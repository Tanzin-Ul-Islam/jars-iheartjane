import React, { useState, useEffect } from 'react'
import styles from '../styles/Login.module.css';
import authInfo from '../cms-data/authCms'
import { useRouter } from 'next/router';
import { postData } from '../utils/FetchApi';
import api from "../config/api.json";
import { setSiteLoader, setToken, setPrevPage, setUserInfo } from '../redux/global_store/globalReducer';
import { useSelector, useDispatch } from 'react-redux';
import { createToast } from '../utils/toast';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { showLoader } from '../utils/helper';
import HeaderTitles from '../components/HeaderTitles';
import Head from 'next/head';
export default function LoginComponent() {
    const router = useRouter()
    //let [token, setToken] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const { pageMeta, loginPageCms, loginPageComponentUI } = useSelector((store) => store.globalStore);

    //redux
    const dispatch = useDispatch();
    const { token, prevPage } = useSelector((state) => state.globalStore);


    function handleAssignData(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    function validateForm() {
        if (!formData.email) {
            createToast("Please enter email.", 'info');
            return false;
        } else if (!formData.password) {
            createToast("Please enter password.", 'info');
            return false;
        }
        return true;
    }

    async function handleFormSubmit(event) {
        try {
            event.preventDefault();
            if (validateForm()) {
                dispatch(setSiteLoader(true));
                await postData(api?.auth?.login, formData).then(response => {
                    if (response.status == 201) {
                        let data = response.data
                        setFormData({
                            email: "",
                            password: "",
                        })
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('userId', data.user.id);
                        localStorage.setItem('email', data.user.email);
                        localStorage.setItem('firstName', data.user.firstName);
                        localStorage.setItem('lastName', data.user.lastName);
                        localStorage.setItem('birthdayDate', data.user.birthdayDate);
                        localStorage.setItem('phone', data.user.phone);
                        localStorage.setItem('image', data.user.image);
                        dispatch(setToken(data.token));
                        let userInfo = {
                            id: data.user.id,
                            firstName: data.user.firstName,
                            lastName: data.user.lastName,
                            email: data.user.email,
                            phone: data.user.phone,
                            birthdayDate: data.user.birthdayDate,
                            image: data.user.image,
                        }
                        dispatch(setUserInfo(userInfo));
                        createToast("Successfully Login.", 'success');
                        if (prevPage) {
                            router.push(`/${prevPage}`);
                            dispatch(setPrevPage(""));
                        } else {
                            router.push('/user');
                        }
                    } else {
                        dispatch(setSiteLoader(false));
                        createToast("Something went wrong! Please try again.", 'error');
                    }
                }).catch(error => {
                    dispatch(setSiteLoader(false));
                    createToast(error.response.data.message, 'error');
                });
            }
        } catch (error) {
            dispatch(setSiteLoader(false));
            createToast("Something went wrong! Please try again.", 'error');
        }
        // finally {
        //     dispatch(setSiteLoader(false));
        // }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            await axios.get(api?.google?.authUserProfile, { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }).then(async (response) => {
                if (response.status == 200) {
                    let userInfo = response.data;
                    let data = {
                        name: userInfo.name,
                        email: userInfo.email,
                        token: tokenResponse.access_token,
                    }
                    dispatch(setSiteLoader(true));
                    await postData(api.google.login, data).then(response => {
                        if (response.status == 201) {
                            let data = response.data;
                            localStorage.setItem('token', data.token);
                            localStorage.setItem('userId', data.user.id);
                            localStorage.setItem('email', data.user.email);
                            localStorage.setItem('firstName', data.user.firstName);
                            localStorage.setItem('lastName', data.user.lastName);
                            localStorage.setItem('birthdayDate', data.user.birthdayDate);
                            localStorage.setItem('phone', data.user.phone);
                            localStorage.setItem('image', data.user.image);
                            dispatch(setToken(data.token));
                            let userInfo = {
                                id: data.user.id,
                                firstName: data.user.firstName,
                                lastName: data.user.lastName,
                                email: data.user.email,
                                phone: data.user.phone,
                                birthdayDate: data.user.birthdayDate,
                                image: data.user.image,
                            }
                            dispatch(setUserInfo(userInfo));
                            createToast("Successfully Login.", 'success');
                            if (prevPage) {
                                router.push(`/${prevPage}`);
                                dispatch(setPrevPage(""));
                            } else {
                                router.push('/user');
                            }
                        } else {
                            dispatch(setSiteLoader(false));
                            createToast("Something went wrong! Please try again.", 'error');
                        }
                    }).catch(error => {
                        dispatch(setSiteLoader(false));
                        createToast(error.response.data.message, 'error');
                    });
                }
            })
        },
        onError: errorResponse => console.log(errorResponse),
    });


    return (
        <div style={{ backgroundColor: `${loginPageComponentUI?.backgroundColor}` }}>
            <HeaderTitles title={'loginPageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.signinPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.signinPageMetaKeyword}
                />
            </Head>
            <div className='container'>
                <div className={`w-25 w-lg-90 mx-auto`}>
                    <h1 className={`text-center mb-4 fs-60 fs-md-35 ff-PowerGrotesk700 fw-bold ${styles.header_section}`} style={{ color: `${loginPageComponentUI?.titleFontColor}` }}>{loginPageCms?.title}</h1>
                    {/* <div className='bg-site-blue-100 rounded-pill d-flex justify-content-between px-4 py-2 mb-3 cp'>
                    <img src={authInfo.facebook_logo_img_url} className='my-auto' />
                    <p className='my-auto fs-14'>{authInfo.facebook_logo_text}</p>
                    <br />
                </div> */}
                    <div className='bg-site-blue-100 rounded-pill d-flex justify-content-between px-4 py-2 cp' onClick={googleLogin}>
                        {/* <GoogleLogin
                        render={renderProps => (
                            <GoogleButton onClick={renderProps.onClick} disabled={renderProps.disabled}>Sign in with Google</GoogleButton>
                        )}
                        onSuccess={(credentialResponse) => {
                            console.log(credentialResponse);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    /> */}
                        <img src={authInfo.google_logo_img_url} className='my-auto' />
                        <p className='my-auto fs-14'>{authInfo.google_logo_text}</p>
                        <br />
                    </div>
                    <div className='d-flex gap-3 justify-content-center my-4'>
                        <img src="/images/Line 15.png" className='my-auto w-100' />
                        <p className='fs-12 my-auto'>Or</p>
                        <img src="/images/Line 15.png" className='my-auto w-100' />
                    </div>
                    <form action="" onSubmit={(e) => { handleFormSubmit(e) }}>
                        <div className=''>
                            <div>
                                <label htmlFor="exampleInputEmail1" className="form-label fs-16">{authInfo.email_input_text}</label>
                                <input className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" type="email" placeholder="email" aria-label="Search" name='email' value={formData.email} onChange={(e) => { handleAssignData(e) }} />

                            </div>
                            <div className="mt-3">
                                <div className='d-flex justify-content-between mb-2'>
                                    <label htmlFor="exampleInputPassword1" className="form-label my-auto fs-16">{authInfo.password_input_text}</label>
                                    <div id="emailHelp" className="form-text text-end my-auto fs-12 text-site-darkkhaki cp" onClick={() => { router.push('/forgot-password') }}>{authInfo.password_sub_text}</div>
                                </div>
                                <input type="password" className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" id="exampleInputPassword1" placeholder="password" name='password' value={formData.password} onChange={(e) => { handleAssignData(e) }} />
                            </div>
                        </div>
                        <div className='mt-4'>
                            <button type='submit' className='w-100 border-0 rounded-pill fs-16 py-2 mt-3' style={{ backgroundColor: `${loginPageComponentUI?.buttonColor}`, color: `${loginPageComponentUI?.buttonFontColor}` }}>{loginPageCms?.buttonText}</button>
                        </div>
                    </form>
                    <p className='text-center py-4 py-lg-5' style={{ color: `${loginPageComponentUI?.bottomOneFontColor}`, marginBottom: '0px' }}>{loginPageCms?.bottomTextOne}&nbsp;&nbsp;<span><button onClick={() => { router.push(loginPageCms?.buttonLink) }} className='bg-transparent border-0' style={{ color: `${loginPageComponentUI?.bottomTwoFontColor}` }}>{loginPageCms?.bottomTextTwo}</button></span></p>
                </div>
            </div>
        </div>
    )
}
