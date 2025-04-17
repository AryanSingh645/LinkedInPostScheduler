import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './context/User';

const ProtectedRoute = ({ children }) => {
    const [isVerified, setIsVerified] = useState(null);
    const { setUser } = useUser();
    useEffect(() => {
        const userInfo = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate a delay
                const response = await axios.get('/auth/linkedin/verify', { withCredentials: true });
                console.log('User verification response:', response);
                if (response.data.success) {
                    setUser(response.data.data);
                    setIsVerified(true);
                } else {
                    setIsVerified(false);
                }
            } catch (error) {
                console.error('Error verifying user:', error);
                setIsVerified(false);
            }
        };
        userInfo();
    }, []);

    if (isVerified === null) {
        return <div>Loading...</div>;
    }

    if (!isVerified) {
        return <Navigate to="/signin" replace={true} />;
    }

    return children;
};

export default ProtectedRoute;