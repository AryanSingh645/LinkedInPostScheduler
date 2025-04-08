import axios from "axios"

export const verifyLinkedInToken = async(token) => {
    try {
        const response = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return {
            success: true,
            data: response.data
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Invalid Token"
        }
    }
}