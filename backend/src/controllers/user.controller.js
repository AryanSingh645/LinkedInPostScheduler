import { PrismaClient } from "../../generated/prisma"
import { uploadOnCloudinary } from "../utils/cloudinary";
const prisma = new PrismaClient();

//TODO: You can use the process hook here to listen on SIGINT and SIGTERM to disconnect the prisma client 

const createUserPost = async(req, res) => {
    try {
        const {text, visibility, schedule_time} = req.body;
        if(!text || !visibility || !schedule_time){
            return res.status(404).json({
                success: false,
                message: "All fields are required."
            })
        }

        let galleryLocalPaths;
        if(req.files && Array.isArray(req.files.gallery) && req.files.gallery.length > 0){
            galleryLocalPaths = req.files.gallery;
        }
        let images = [];

        for(const galleryPath of galleryLocalPaths){

            //TODO: Register and upload the image on LinkedIn for posting.
            //NOTE: Give a thought to cron jobs also, consider it using.

            const image = await uploadOnCloudinary(galleryPath);
            if(!image){
                return res.status(404).json({
                    success: false,
                    message: "No image Found"
                })
            }
            images.push(image.url);
        }

        await prisma.post.create({
            data: {
                text,
                schedule_time,
                visibility,
                id: 
            }
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error creating the post. Please Try Again!"
        })
    }
}

const getDashboardData = async(req, res) => {
    try {
        const {userId} = req.body;
        if(!userId){
            return res.status(400).json({
                message: "User Id is required",
                success: false
            })
        }
    
        const userData = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include:{
                post: true
            }
        })
    
        if(!userData){
            return res.status(404).json({
                success: false,
                message: "User data not found"
            })
        }
        return res.status(200).json({
            success: true,
            data: userData,
            message: `Welcome ${userData.name}!`
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user data. Please Refresh!"
        })
    }

}
