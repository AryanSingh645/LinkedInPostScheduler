import { prisma } from "../prismaClient.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import axios from "axios";
import fs from "fs";
import schedule from "node-schedule";

//TODO: You can use the process hook here to listen on SIGINT and SIGTERM to disconnect the prisma client 


const createUserPost = async (req, res) => {
    try {
        const { text, visibility, schedule_time } = req.body;
        console.log(req.body, "req.body");
        if (!text || !visibility || !schedule_time) {
            return res.status(404).json({
                success: false,
                message: "All fields are required."
            });
        }

        let galleryLocalPaths;
        if (req.files && Array.isArray(req.files.gallery) && req.files.gallery.length > 0) {
            galleryLocalPaths = req.files.gallery;
        }
        let images = [];
        let assetIds = [];

        console.log(galleryLocalPaths, "galleryLocalPaths");

        for (const galleryPath of galleryLocalPaths) {
            const image = await uploadOnCloudinary(galleryPath.path);
            if (!image) {
                return res.status(404).json({
                    success: false,
                    message: "No image Found"
                });
            }
            images.push(image.url);
        }

        // Save the post to the database
        const postData = await prisma.post.create({
            data: {
                text,
                schedule_time: new Date(schedule_time),
                visibility,
                user: {
                    connect: {
                        id: req.user.id,
                    },
                },
                images,
            },
        });

        // Schedule the LinkedIn post
        schedule.scheduleJob(new Date(schedule_time), async () => {
            try {
                console.log(`Posting to LinkedIn for post ID: ${postData.id}`);

                for (const galleryPath of galleryLocalPaths) {
                    const registerImagePayload = {
                        registerUploadRequest: {
                            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                            owner: `urn:li:person:${req.user.sub}`,
                            serviceRelationships: [
                                {
                                    relationshipType: "OWNER",
                                    identifier: "urn:li:userGeneratedContent",
                                },
                            ],
                        },
                    };

                    const registerImageResponse = await axios.post(
                        "https://api.linkedin.com/v2/assets?action=registerUpload",
                        registerImagePayload,
                        {
                            headers: {
                                Authorization: `Bearer ${req.user.accessToken}`,
                            },
                        }
                    );

                    const asset = registerImageResponse.data.value.asset;
                    assetIds.push(asset);

                    const uploadUrl =
                        registerImageResponse.data.value.uploadMechanism[
                            "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
                        ].uploadUrl;

                    const fileData = fs.readFileSync(galleryPath.path);
                    await axios.put(uploadUrl, fileData, {
                        headers: {
                            Authorization: `Bearer ${req.user.accessToken}`,
                            "Content-Type": galleryPath.mimetype,
                        },
                    });
                    fs.unlinkSync(galleryPath.path); // Remove the local file after upload
                }
                
                const imagePostPayload = {
                    author: `urn:li:person:${req.user.sub}`,
                    lifecycleState: "PUBLISHED",
                    specificContent: {
                        "com.linkedin.ugc.ShareContent": {
                            shareCommentary: {
                                text: `${text}`,
                            },
                            shareMediaCategory: "IMAGE",
                            media: assetIds.map((assetId) => ({
                                status: "READY",
                                media: `${assetId}`,
                                title: {
                                    text: "My LinkedIn Image Post",
                                },
                            })),
                        },
                    },
                    visibility: {
                        "com.linkedin.ugc.MemberNetworkVisibility": visibility,
                    },
                };

                const imagePostResponse = await axios.post(
                    "https://api.linkedin.com/v2/ugcPosts",
                    imagePostPayload,
                    {
                        headers: {
                            Authorization: `Bearer ${req.user.accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("Post successfully published to LinkedIn:", imagePostResponse.data);
            } catch (error) {
                console.error("Error posting to LinkedIn:", error);
            }
        });
        console.log("sent");
        return res.status(200).json({
            success: true,
            message: "Post scheduled successfully.",
            data: postData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error scheduling the post. Please try again!",
        });
    }
};

const getDashboardData = async(req, res) => {
    try {
        // const {userId} = req.body;
        // console.log(userId, "userId");
        // if(!userId){
        //     return res.status(400).json({
        //         message: "User Id is required",
        //         success: false
        //     })
        // }
        
    
        const userData = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            include:{
                post: true
            }
        })

        console.log(userData, "userData");
    
        if(!userData){
            return res.status(404).json({
                success: false,
                message: "User data not found"
            })
        }
        return res.status(200).json({
            success: true,
            data: userData,
            message: `Welcome ${userData.name}!`,
            isVerified: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user data. Please Refresh!"
        })
    }

}

export {
    createUserPost,
    getDashboardData
}