export const verifyLinkedInToken = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            return res.status(400).json({
                success: false,
                message: "No Token Found"
            })
        }

        const isValid = await verifyLinkedInToken(token);
        if(!isValid.success){
            return res.status(401).json({
                success: false,
                message: isValid.message
            })
        }
        console.log(isValid);
        console.log(isValid.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Not Valid"
        })
    }
}