import React, { useState, useEffect } from 'react'
import styles from '../styles/Login.module.css';
import authInfo from '../cms-data/authCms'
import { useRouter } from 'next/router';
import { postData } from '../utils/FetchApi';
import api from "../config/api.json";
import { setSiteLoader, setToken, setPrevPage, setUserInfo } from '../redux/global_store/globalReducer';
import { useSelector, useDispatch } from 'react-redux';
import { createToast } from '../utils/toast';
import axios from 'axios';
import { showLoader } from '../utils/helper';
import HeaderTitles from '../components/HeaderTitles';
import Head from 'next/head';
function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    //redux
    const dispatch = useDispatch();
    const { token, prevPage, pageMeta } = useSelector((state) => state.globalStore);


    function handleAssignData(event) {
        setEmail(event.target.value);
    }

    function validateForm() {
        if (!email) {
            createToast("Please enter email.", 'info');
            return false;
        }
        return true;

    }

    async function handleFormSubmit(event) {
        try {
            event.preventDefault();
            if (validateForm()) {
                const data = {
                    email: email,
                }
                showLoader();
                await postData(api?.auth?.forgotPassword, data).then(response => {
                    if (response.status == 201) {
                        let data = response.data.data;
                        setEmail("");
                        createToast("Successfully Login.", 'success');
                    } else {
                        createToast("Something went wrong! Please try again.", 'error');
                    }
                }).catch(error => {
                    createToast(error.response.data.message, 'error');
                });
            }
        } catch (error) {
            createToast("Something went wrong! Please try again.", 'error');
        }
    }


    useEffect(() => {
        const jwtToken = localStorage.getItem("token") ?? "";
        if (jwtToken) {
            router.push('/home')
        }
    }, []);


    return (
        <>
            <HeaderTitles title={'forgotPasswordPageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.forgotPasswordPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.forgotPasswordPageMetaKeyword}
                />
            </Head>
            <div className='container' style={{ minHeight: "25rem" }}>
                <div className='w-25 w-lg-90 mx-auto'>
                    <h1 className={`text-center fs-30 fs-md-28 ff-PowerGrotesk700 fw-bold pt-4 ${styles.header_section}`}>Forgot Password</h1>
                    {/* <div className='bg-site-blue-100 rounded-pill d-flex justify-content-between px-4 py-2 cp' onClick={googleLogin}>
                    <img src={authInfo.google_logo_img_url} className='my-auto' />
                    <p className='my-auto fs-14'>{authInfo.google_logo_text}</p>
                    <br />
                </div> */}
                    {/* <div className='d-flex gap-3 justify-content-center my-4'>
                    <img src="/images/Line 15.png" className='my-auto w-100' />
                    <p className='fs-12 my-auto'>Or</p>
                    <img src="/images/Line 15.png" className='my-auto w-100' />
                </div> */}
                    <form action="" onSubmit={(e) => { handleFormSubmit(e) }}>
                        <div className='mt-4'>
                            <div>
                                <label htmlFor="exampleInputEmail1" className="form-label fs-16">Email Address</label>
                                <input className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" type="email" placeholder="Email" aria-label="Search" name='email' value={email} onChange={(e) => { handleAssignData(e) }} />
                                <span className="fs-12 text-dark">*A reset link will be sent shortly.</span>
                            </div>
                            {/* <div className="mt-3">
                            <div className='d-flex justify-content-between mb-2'>
                                <label htmlFor="exampleInputPassword1" className="form-label my-auto fs-16">{authInfo.password_input_text}</label>
                                <div id="emailHelp" className="form-text text-end my-auto fs-12 text-site-darkkhaki">{authInfo.password_sub_text}</div>
                            </div>
                            <input type="password" className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" id="exampleInputPassword1" placeholder="password" name='password' value={formData.password} onChange={(e) => { handleAssignData(e) }} />
                        </div> */}
                        </div>
                        <div className='mt-4'>
                            <button type='submit' className='w-100 border-0 bg-dark text-white rounded-pill fs-16 py-2 mt-3'>Send Link</button>
                        </div>
                    </form>
                    <p className='text-center my-4 my-lg-5 text-dark'>{authInfo.login_site_sub_text_bold}&nbsp;&nbsp;<span><button onClick={() => { router.push('/registration') }} className='bg-transparent border-0 text-site-darkkhaki'>{authInfo.login_site_sub_text}</button></span></p>
                </div>
            </div>
        </>

    )
}

export default ForgotPassword
