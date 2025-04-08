import axios from "axios";
const getAuthorizationCode = async(req, res) => {
    try {
        const response = await axios.get(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&scope=openid%20profile%20email&state=${process.env.LINKEDIN_STATE}`)
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
    console.log(req.originalUrl)
    console.log(req.query);
    const {code, state} = req.query;
    console.log(code, state);

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
    console.log(response);
    return res.status(200).json({
        success: true,
        message: "Successfully fetched the access token"
    })
}

export {
    getAuthorizationCode,
    getAccessToken
}