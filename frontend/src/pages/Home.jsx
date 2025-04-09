import React, { useEffect } from 'react'
import axios from "axios"
const Home = () => {
    useEffect(() => {
        const apiCall = async() => {
            const response = await axios.get();
            if(!response.data.success){
                // TODO: handle unauthorized or logged out users to login page
            }
        }
    },[]);
    return (
        <div>Home</div>
    )
}

export default Home