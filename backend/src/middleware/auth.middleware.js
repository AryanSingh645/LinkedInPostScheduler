
import { response } from "express";
import { prisma } from "../prismaClient.js";
import { verifyLinkedInToken } from "../utils/verifyLinkedInToken.js";

const verfiyUser = async(req, res, next) => {
    try {
        console.log(req.cookies, "cookies");
        const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ","");
        console.log(token, "token");
        if(!token){
            return res.status(400).json({
                success: false,
                message: "No Token Found",
                isVerified: false
            })
        }

        const isValid = await verifyLinkedInToken(token);
        if(!isValid.success){
            return res.status(401).json({
                success: false,
                message: isValid.message,
                isVerified: false
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                sub: isValid.data.sub,
                email: isValid.data.email
            }
        })

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Not Found. Please Login using LinkedIn Account",
                isVerified: false
            })
        }
        req.user = user;
        req.user.accessToken = token;

        next()

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Not Valid",
            isVerified: false
        })
    }
}

export { verfiyUser };