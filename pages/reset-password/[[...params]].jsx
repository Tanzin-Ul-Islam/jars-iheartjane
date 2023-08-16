import React, { useState, useEffect, useRef } from 'react'
import styles from '../../styles/Login.module.css';
import authInfo from '../../cms-data/authCms'
import { useRouter } from 'next/router';
import { postData } from '../../utils/FetchApi';
import api from "../../config/api.json";
import { useSelector, useDispatch } from 'react-redux';
import { createToast } from '../../utils/toast';
import axios from 'axios';
import { showLoader } from '../../utils/helper';
import HeaderTitles from '../../components/HeaderTitles';
import Head from 'next/head';
import Link from 'next/link';
function ResetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const token = useRef("");
    const [validLink, setValidLink] = useState(false);
    const [formValues, setFormValues] = useState({
        password: "",
        confirmPassword: "",
    })

    const { pageMeta } = useSelector((store) => store.globalStore);

    async function verifyToken() {
        try {
            const data = {
                hashPass: token.current,
            }
            await postData(api?.auth?.verifyHashToken, data).then(response => {
                if (response.status == 201) {
                    let data = response.data.data;
                    setValidLink(data);
                }
            }).catch(error => {
                console.log(error);
            });
        } catch (error) {
            console.log(error);
        }
    }


    function handleAssignData(event) {
        setFormValues({ ...formValues, [event.target.name]: event.target.value })
    }

    function validateForm() {
        if (!formValues.password) {
            createToast("Please enter password.", 'info');
            return false;
        } else if (formValues?.password?.length < 6) {
            createToast("Password must be atleast 6 char long.", 'info');
            return false;
        } else if (!formValues.confirmPassword) {
            createToast("Please confirm password.", 'info');
            return false;
        } else if (formValues.password != formValues.confirmPassword) {
            createToast("Password did not matched!.", 'info');
            return false;
        }
        return true;

    }

    async function handleFormSubmit(event) {
        try {
            event.preventDefault();
            if (validateForm()) {
                const data = {
                    passToken: token.current,
                    password: formValues.password,
                }
                showLoader();
                await postData(api?.auth?.updatePassword, data).then(response => {
                    if (response.status == 201 && response.data.data == true) {
                        createToast("Password reset successfully.", 'success');
                        router.push('/login');
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
        if (router.isReady) {
            token.current = (router?.query?.params?.length > 0) ? router?.query?.params[0] : "";
            verifyToken();
        }
    }, [router?.query?.params]);


    return (
        <>
            <HeaderTitles title={'resetPasswordPageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.resetPasswordPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.resetPasswordPageMetaKeyword}
                />
            </Head>
            <div style={{ minHeight: '40rem' }}>
                {
                    validLink ?
                        <div className='container'>
                            <div className='w-25 w-lg-90 mx-auto'>
                                <h1 className={`text-center fs-30 fs-md-28 ff-PowerGrotesk700 fw-bold ${styles.header_section}`}>Reset Password</h1>
                                <form action="" onSubmit={(e) => { handleFormSubmit(e) }}>
                                    <div className='mt-3'>
                                        <div className="mt-3">
                                            <div className='d-flex justify-content-between mb-2'>
                                                <label htmlFor="exampleInputPassword1" className="form-label my-auto fs-16">{authInfo.password_input_text}</label>
                                            </div>
                                            <input type="password" className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" id="exampleInputPassword1" placeholder="Password" name='password' value={formValues.password} onChange={(e) => { handleAssignData(e) }} />
                                        </div>
                                        <div className="mt-3">
                                            <div className='d-flex justify-content-between mb-2'>
                                                <label htmlFor="exampleInputPassword1" className="form-label my-auto fs-16">Confirm Password</label>
                                            </div>
                                            <input type="password" className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" id="exampleInputPassword1" placeholder="Confirm Password" name='confirmPassword' value={formValues.confirmPassword} onChange={(e) => { handleAssignData(e) }} />
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <button type='submit' className='w-100 border-0 bg-dark text-white rounded-pill fs-16 py-2 mt-3'>Reset Password</button>
                                    </div>
                                </form>
                            </div>
                        </div> :

                        <>
                            <div>
                                <p className={`text-center ${styles.expiredText}`}>Link Expired</p>
                            </div>
                        </>
                }
                <p className='text-center my-4 my-lg-5 text-dark'>
                    <Link className='bg-transparent border-0 text-site-darkkhaki cp' href={'/login'}>
                        Login&nbsp;
                    </Link>or&nbsp;
                    <Link className='bg-transparent border-0 text-site-darkkhaki cp' href={'/forgot-password'}>
                        Forgot Password
                    </Link>
                </p>
            </div>
        </>

    )
}

export default ResetPassword
