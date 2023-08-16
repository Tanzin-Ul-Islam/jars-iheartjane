import React, { useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import RegistrationComponent from '../components/RegistrationComponent';
import server from '../config/server.json';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
function Registration() {
    const router = useRouter();
    const { token } = useSelector((store) => (store.globalStore));
    useEffect(() => {
        const jwtToken = localStorage.getItem("token") ?? "";
    }, []);

    return (
        <GoogleOAuthProvider clientId={server?.google?.logInKey}>
            <RegistrationComponent />
        </GoogleOAuthProvider>

    )
}

export default Registration