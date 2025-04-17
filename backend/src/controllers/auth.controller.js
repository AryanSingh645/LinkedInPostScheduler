import axios from "axios";
import { prisma } from "../prismaClient.js";
const getAuthorizationCode = async(req, res) => {
    try {
        const response = await axios.get(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&scope=openid%20profile%20email%20w_member_social&state=${process.env.LINKEDIN_STATE}`)
        // console.log(Object.keys(response.request));
        res.status(200).json({
            success: true,
            redirectUrl : response.request.res.responseUrl
        })
        // res.redirect(response);
    } catch (error) {
        console.log(error, "Error in getting authorization code")
        return res.status(500).json({
            success: false,
            message: "Error getting the authorization code"
        })
    }
}

const getAccessToken = async(req, res) => {
    // console.log(req.originalUrl)
    // console.log(req.query);
    const {code, state} = req.query;
    // console.log(code, state);

    if(state !== process.env.LINKEDIN_STATE){
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access -- Invalid LinkedIn State"
        })
    }

    const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken',{
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET
    },
    {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    // console.log(response, "accesstoken response");
    res.status(200).cookie("access_token", response.data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 24 * 30
    })
    // res.setHeader('Set-Cookie', `access_token=${response.data.access_token}; HttpOnly; Secure=false; SameSite=None; Max-Age=${60 * 60 * 24 * 30}`);
    // await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Setcookie", res.getHeaders('Set-Cookie'));
    res.redirect('http://localhost:5173')
}

const verifyUser = async(req, res) => {
    try {
        const token = req.cookies.access_token;
        const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const user = await prisma.user.upsert({
            where: { sub: response.data.sub },
            update: {
                name: response.data.name,
                email: response.data.email,
                picture: response.data.picture,
            },
            create: {
                name: response.data.name,
                email: response.data.email,
                sub: response.data.sub,
                picture: response.data.picture,
            },
        });
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.log(error, "Error in verifying user");
        return res.status(500).json({
            success: false,
            message: "Error verifying user"
        });
    }
}

export {
    getAuthorizationCode,
    getAccessToken,
    verifyUser
}