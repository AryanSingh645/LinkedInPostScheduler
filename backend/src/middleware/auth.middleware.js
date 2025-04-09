
import { verifyLinkedInToken } from "../utils/verifyLinkedInToken.js";

const verfiyUser = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            return res.status(400).json({
                success: false,
                message: "No Token Found"
            })
        }

        //TODO: Check if the user already exists in database if not then create it and in both the cases pass req.user object with users info like its id, name, email and sub.

        const isValid = await verifyLinkedInToken(token);
        if(!isValid.success){
            return res.status(401).json({
                success: false,
                message: isValid.message
            })
        }
        console.log(isValid);
        console.log(isValid.data);
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Not Valid"
        })
    }
}

export {verfiyUser};