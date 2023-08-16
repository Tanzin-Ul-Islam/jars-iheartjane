import React, { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginComponent from '../components/LoginComponent';
import server from '../config/server.json';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

function Login() {
    const router = useRouter();
    const { token } = useSelector((store) => (store.globalStore));
    useEffect(() => {
        const jwtToken = localStorage.getItem("token") ?? "";
    }, []);

    return (
        <GoogleOAuthProvider clientId={server?.google?.logInKey}>
            <LoginComponent />
        </GoogleOAuthProvider>
    )
}

export default Login
