import React, { useState, useEffect } from 'react'
import styles from '../styles/Login.module.css';
import authInfo from '../cms-data/authCms'
import { useRouter } from 'next/router';
import api from "../config/api.json";
import { setToken, setSiteLoader, setPrevPage, setUserInfo } from '../redux/global_store/globalReducer';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { postData } from '../utils/FetchApi';
import { createToast } from '../utils/toast';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import HeaderTitles from '../components/HeaderTitles';
import Head from 'next/head';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { removeUSCountryCode } from '../utils/helper';
export default function RegistrationComponent() {
    const router = useRouter()
    let dispatch = useDispatch();
    let { token, prevPage, pageMeta, registerPageCms, registerPageComponentUI } = useSelector((state) => (state.globalStore))
    let [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthdayDate: "",
        password: "",
        confirmPassword: "",
        retailerId: ""
    })
    function handleAssignData(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }
    const ageValidation = (date) => {
        const today = new Date();
        const birthDate = new Date(date);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    function validateForm() {
        if (!formData.firstName) {
            createToast("Please enter first name.", 'info');
            return false;
        }
        else if (!formData.lastName) {
            createToast("Please enter first name.", 'info');
            return false;
        }
        else if (!formData.email) {
            createToast("Please enter email.", 'info');
            return false;
        }
        else if (!formData.phone) {
            createToast("Please enter contact no.", 'info');
            return false;
        }
        else if (formData?.phone?.length <= 9) {
            createToast("Contact no must be atleast 10 digits", 'info');
            return false;
        }
        else if (!formData.birthdayDate) {
            createToast("Please enter your date of birth.", 'info');
            return false;
        }
        else if (ageValidation(formData.birthdayDate) < 21) {
            createToast("You need to be atleast 21 years old!", 'info');
            return false;
        }
        else if (!formData.password) {
            createToast("Please enter password.", 'info');
            return false;
        }
        else if (formData?.password?.length < 6) {
            createToast("Password must be atleast 6 char long.", 'info');
            return false;
        }
        else if (!formData.confirmPassword) {
            createToast("Please confirm password.", 'info');
            return false;
        }
        else if (formData.password != formData.confirmPassword) {
            createToast("Password did not match!", 'info');
            return false;
        }
        return true;

    }
    async function handleFormSubmit(event) {
        try {
            event.preventDefault();
            if (validateForm()) {
                const { confirmPassword, ...data } = formData;
                const numberWithoutCountryCode = removeUSCountryCode(formData?.phone);
                dispatch(setSiteLoader(true));
                await postData(api?.auth?.registration, { ...data, phone: numberWithoutCountryCode }).then(response => {
                    if (response?.data?.statusCode == 201) {
                        let data = response?.data?.data;
                        setFormData({
                            firstName: "",
                            lastName: "",
                            email: "",
                            phone: "",
                            birthdayDate: "",
                            password: "",
                            confirmPassword: "",
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
                        }
                        dispatch(setUserInfo(userInfo));
                        createToast("Successfully Registration.", 'success');
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
                    if (error.response.data.message == "Email Already Exists") {
                        setTimeout(() => {
                            router.push('/login');
                        }, 4000)
                    }
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
                if (response?.status == 200) {
                    let userInfo = response?.data;
                    let data = {
                        name: userInfo?.name,
                        email: userInfo?.email,
                        token: tokenResponse?.access_token,
                    }
                    dispatch(setSiteLoader(true));
                    await postData(api.google.login, data).then(response => {
                        if (response?.status == 201) {
                            let data = response?.data;
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

    useEffect(() => {
        const selectedRetailer = JSON.parse(localStorage.getItem('selected-retailer'));
        if (selectedRetailer?.id) {
            setFormData((prevState) => ({ ...prevState, retailerId: selectedRetailer?.id }))
        }

    }, []);
    return (
        <div style={{ backgroundColor: `${registerPageComponentUI?.backgroundColor}` }}>
            <HeaderTitles title={'signupPageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.signupPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.signupPageMetaKeyword}
                />
            </Head>
            <div className='container'>
                {prevPage}
                <div className='w-25 w-lg-90 mx-auto'>
                    <h1 className={`text-center mb-4 fs-60 fs-md-35 ff-PowerGrotesk700 fw-bold ${styles.header_section}`} style={{ color: `${registerPageComponentUI?.titleFontColor}` }}>{registerPageCms?.title}</h1>

                    {/* <div className='bg-site-blue-100 rounded-pill d-flex justify-content-between px-4 py-2 mb-3'>
                    <img src={authInfo.facebook_logo_img_url} className='my-auto' />
                    <p className='my-auto fs-14'>{authInfo.facebook_logo_text}</p>
                    <br />
                </div> */}
                    <div className='bg-site-blue-100 rounded-pill d-flex justify-content-between px-4 py-2 cp' onClick={googleLogin}>
                        <img src={authInfo.google_logo_img_url} className='my-auto' />
                        <p className='my-auto fs-14'>{authInfo.google_logo_text}</p>
                        <br />
                    </div>
                    <div className='d-flex gap-3 justify-content-center my-4'>
                        <img src="/images/Line 15.png" className='my-auto' />
                        <p className='fs-12 my-auto'>Or</p>
                        <img src="/images/Line 15.png" className='my-auto' />
                    </div>
                    <form onSubmit={(e) => { handleFormSubmit(e) }}>
                        <div className=''>
                            <div>
                                <label className="form-label fs-16">First Name</label>
                                <input className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" type="text" placeholder="first name" name='firstName' value={formData.firstName} onChange={(e) => { handleAssignData(e) }} />
                            </div>
                            <div className="mt-3">
                                <label className="form-label fs-16">Last Name</label>
                                <input className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" type="text" placeholder="last name" name='lastName' value={formData.lastName} onChange={(e) => { handleAssignData(e) }} />
                            </div>
                            <div className="mt-3">
                                <label className="form-label fs-16">{authInfo.email_input_text}</label>
                                <input className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" type="email" placeholder="email" name='email' value={formData.email} onChange={(e) => { handleAssignData(e) }} />
                            </div>
                            <div className="mt-3">
                                <div className={`border border-site-gray-100 round-12 text-site-cyan`}>
                                    <label className="form-label fs-16">Contact No</label>
                                    <PhoneInput
                                        placeholder="Phone number"
                                        className={`form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none ${styles.custom_number_input}`}
                                        value={formData.phone}
                                        onChange={(value) => handleAssignData({
                                            target: {
                                                name: 'phone',
                                                value: value
                                            }
                                        })}
                                        defaultCountry="US"
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="form-label fs-16">Date of Birth</label>
                                <input className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" type="date" placeholder="Date of birth" name='birthdayDate' value={formData.birthdayDate} onChange={(e) => { handleAssignData(e) }} />
                            </div>
                            <div className="mt-3">
                                <label className="form-label fs-16">{authInfo.password_input_text}</label>
                                <input type="password" className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" id="exampleInputPassword1" placeholder="password" name='password' value={formData.password} onChange={(e) => { handleAssignData(e) }} />
                            </div>
                            <div className="mt-3">
                                <label className="form-label fs-16">{authInfo.password_retype_text}</label>
                                <input type="password" className="form-control rounded-pill border-dark fs-12 py-2 border border-2 shadow-none" id="exampleInputPassword1" placeholder="confirm password" name='confirmPassword' value={formData.confirmPassword} onChange={(e) => { handleAssignData(e) }} />
                            </div>
                        </div>
                        <div className='mt-5'>
                            <button type='submit' className='w-100 border-0 rounded-pill fs-16 py-2' style={{ backgroundColor: `${registerPageComponentUI?.buttonColor}`, color: `${registerPageComponentUI?.buttonFontColor}` }}>{registerPageCms?.buttonText}</button>
                        </div>
                    </form>


                    <p className='text-center py-4 py-lg-5' style={{ color: `${registerPageComponentUI?.bottomOneFontColor}`, marginBottom: '0px' }}>{registerPageCms?.bottomTextOne}&nbsp;&nbsp;<span><button onClick={() => { router.push(registerPageCms?.buttonLink) }} className='bg-transparent border-0' style={{ color: `${registerPageComponentUI?.bottomTwoFontColor}` }}>{registerPageCms?.bottomTextTwo}</button></span></p>
                </div>
            </div>
        </div>
    )
}
