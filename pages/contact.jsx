import React, { useEffect, useState } from 'react'
import styles from '../styles/Contact.module.css';
import { GoLocation } from "react-icons/go";
import { BsTelephone } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa"
import { BsInstagram } from "react-icons/bs"
import { FaTiktok } from "react-icons/fa"
import { BsYoutube } from "react-icons/bs"
import Banner from '../components/Banner';
import { useGetContactPageCmsQuery, useGetContactReasonURLQuery } from "../redux/api_core/apiCore";
import ContactCmsInterface from "../interfaces/ContactInterface";
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import { setSiteLoader } from '../redux/global_store/globalReducer';
import { useRouter } from 'next/router';
import { createToast } from '../utils/toast';
import { fetchData, postData } from '../utils/FetchApi';
import api from "../config/api.json";
import Script from "next/script";
import HeaderTitles from '../components/HeaderTitles';
import Link from "next/link";
import Skeleton from 'react-loading-skeleton';
import Loader from '../components/Loader';

function Contact() {
    const { pageMeta, contactComponentUI, userSelectRetailerState } = useSelector((store) => (store.globalStore));
    const dispatch = useDispatch();
    const router = useRouter();
    const [reasonData, setReasonData] = useState([]);

    async function getContactReason() {
        const response = await fetchData(`${api.contact.contactReasonURL}?stateCode=${userSelectRetailerState}`)
        setReasonData(response?.data);
    }
    // const { data: reasonData } = useGetContactReasonURLQuery();

    let [formData, setFormData] = useState({
        contactReasonName: "",
        name: "",
        email: "",
        message: ""
    })

    const retailer = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('selected-retailer')) : null;
    const { data, isLoading, isSuccess, isFetching, error } = useGetContactPageCmsQuery(retailer?.id);
    let cmsData = data?.data?.cmsData[0];
    let commonBannerCmsData = data?.data?.commonBannerCmsData[0];
    let socialData = data?.data?.socialPackData;

    useEffect(() => {
        try {
            dispatch(setSiteLoader(true))
            if (data?.data?.cmsData?.length > 0) {
                dispatch(setSiteLoader(false))
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setSiteLoader(false))
        }
    }, [data]);



    function handleAssignData(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    function validateForm() {
        if (!formData.contactReasonName) {
            createToast("Please enter contact reason.", 'info');
            return false;
        }
        if (!formData.name) {
            createToast("Please enter full name.", 'info');
            return false;
        }
        else if (!formData.email) {
            createToast("Please enter email.", 'info');
            return false;
        }
        else if (!formData.message) {
            createToast("Please enter message.", 'info');
            return false;
        }
        return true;

    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        try {
            if (validateForm()) {
                const updateReason = reasonData?.filter((data) => data?.contactReasonName == formData?.contactReasonName);
         
                const data = {
                    ...formData,
                    contactEmail: updateReason?.length > 0 ? updateReason[0]?.contactEmail : ""
                }
                const response = await postData(api.contact.contactMessageURL, data);
                if (response.data.statusCode == 201) {
                    setFormData({
                        contactReasonName: "",
                        name: "",
                        email: "",
                        message: ""
                    })
                    createToast(response.data.message, 'success');
                } else {
                    createToast("Something went wrong! Please try again.", 'error');
                }
            }
            
        } catch (error) {
            createToast("Something went wrong! Please try again.", 'error');
        }
    }

    useEffect(() => {
        const stateName = JSON.parse(localStorage.getItem('user_selected_retailer_state'));
        if (stateName) {
            getContactReason();
        }
    }, [userSelectRetailerState]);

    return (
        <div style={{backgroundColor:contactComponentUI?.backgroundColor}}>
            <HeaderTitles title={'contactUsPageTitle'} />
            {
                !isLoading ?
                    <>
                        <Head>
                            <>
                                <Script src="https://kit.fontawesome.com/7f4933efb1.js" strategy="beforeInteractive" crossOrigin="anonymous" />
                                <meta
                                    name="description"
                                    content={pageMeta?.contactUsPageMetaDescription}
                                />
                                <meta
                                    name="keywords"
                                    content={pageMeta?.contactUsPageMetaKeyword}
                                />
                            </>
                        </Head>
                        <section>
                            <Banner commonBannerCmsData={commonBannerCmsData} />
                        </section>
                        <div>
                            <section className='container'>
                                <div className='row pb-0 pb-lg-5'>
                                    <div className='col-12 col-md-12 col-lg-6'>
                                        <div className='container'>
                                            <div className='mt-5 d-none d-lg-block'>
                                                <p className='fs-12'>Home   / Contact us</p>
                                            </div>
                                            <div className='mt-4 mt-lg-5'>
                                                <h1 className='fs-24 fw-bold ff-PowerGrotesk700 text-center text-lg-start' style={{color:contactComponentUI?.pageTitleFontColor}}>{cmsData?.title}</h1>
                                                <p className='fs-16 fs-md-12 mt-3 mt-lg-4 mb-4 text-center text-lg-start w-100 mx-auto w-lg-75'>{cmsData?.subTitle}</p>
                                            </div>
                                            <div>
                                                <form onSubmit={handleFormSubmit}>
                                                    <div className="mb-4">
                                                        <label htmlFor="exampleInputEmail1" className="form-label fs-16">Contact Reason</label>
                                                        <select name="contactReasonName" className='form-control rounded-pill border-dark' onChange={handleAssignData} value={formData.contactReasonName}>
                                                            <option disabled value="">--Choose Reason--</option>
                                                            {
                                                                reasonData?.map((reason) => (
                                                                    <option value={reason?.contactReasonName}>{reason?.contactReasonName }</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="exampleInputEmail1" className="form-label fs-16">Your Name</label>
                                                        <input type="text" name="name" className="form-control rounded-pill border-dark" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleAssignData} value={formData.name} />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="exampleInputEmail1" className="form-label fs-16">Your Email</label>
                                                        <input type="email" name="email" className="form-control rounded-pill border-dark" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleAssignData} value={formData.email} />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="exampleFormControlTextarea1" className="form-label fs-16">Message</label>
                                                        <textarea name="message" className={`form-control border border-dark ${styles.text_border}`} placeholder={`Type Your Message`} id="exampleFormControlTextarea1" rows={8} onChange={handleAssignData} value={formData.message}></textarea>
                                                    </div>
                                                    <button type="submit" className="w-50 w-lg-100 border-0 bg-dark text-white rounded-pill fs-16 py-2">{cmsData?.buttonText}</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-12 col-lg-6'>
                                        <div className='container'>
                                            <div className='mt-5 mx-auto'>
                                                <div className="mapouter">
                                                    <div className="gmap_canvas">
                                                        <iframe
                                                            width="100%"
                                                            height={300}
                                                            id="gmap_canvas"
                                                            src={`https://maps.google.com/maps?q=${cmsData?.location}&t=&z=10&ie=UTF8&iwloc=&output=embed`}>
                                                        </iframe>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-3 lh-65'>
                                                <div className='d-flex flex-column flex-lg-row gap-0 gap-lg-4'>
                                                    {/* <GoLocation className="my-auto mx-auto mx-lg-0" /> */}
                                                    <img src="/images/nav-icons/PinDrop.svg" className="my-auto mx-auto mx-lg-0" alt="Location" style={{ height: '30px' }} />
                                                    <p className='my-auto fs-16 text-center'>{cmsData?.location}</p>
                                                </div>
                                                <div className='d-flex flex-column flex-lg-row gap-0 gap-lg-4'>
                                                    {/* <BsTelephone className="my-auto mx-auto mx-lg-0" /> */}
                                                    <img src="/images/nav-icons/Phone.svg" className="my-auto mx-auto mx-lg-0" alt="Location" style={{ height: '30px' }} />
                                                    <Link className='my-0 my-lg-auto fs-16 text-center' href={`tel:${cmsData?.phone}`}>
                                                        {cmsData?.phone}
                                                    </Link>
                                                    {/* <p className='my-0 my-lg-auto fs-16 text-center'>{cmsData?.phone}</p> */}
                                                </div>
                                                <div className='d-flex flex-column flex-lg-row gap-0 gap-lg-4'>
                                                    {/* <AiOutlineMessage className="my-auto mx-auto mx-lg-0" /> */}
                                                    <img src="/images/nav-icons/Chat.svg" className="my-auto mx-auto mx-lg-0" alt="Location" style={{ height: '30px' }} />
                                                    <Link className="my-auto fs-16 text-center" href={`mailto:${cmsData?.email}`}>
                                                        {cmsData?.email}
                                                    </Link>
                                                    {/* <p className='my-auto fs-16 text-center'>{cmsData?.email}</p> */}
                                                </div>
                                            </div>
                                            <div className='d-flex mt-2 mt-lg-5'>
                                                <div className='mx-auto mx-lg-0'>
                                                    {
                                                        socialData && socialData.map((el, index) => {
                                                            return (
                                                                <Link href={el.link} target="_blank" key={index}><i className={`${el.className} fa-lg mx-3`}></i></Link>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </section>
                        </div>

                    </>
                    :
                    <>
                        <Loader />
                        <section>
                            <div className="container-xxl px-0">
                                <Skeleton style={{ width: '100%', height: '130px' }} />
                            </div>
                        </section>
                        <div className=''>
                            <section className='container'>
                                <div className='row mb-5'>
                                    <div className='col-12 col-md-12 col-lg-6'>
                                        <div className='container'>
                                            <div className='mt-5 d-none d-lg-block'>
                                                <Skeleton style={{ width: '20%', height: '30px' }} />
                                            </div>
                                            <div className='mt-4 mt-lg-5'>
                                                <div className='my-2'><Skeleton style={{ width: '60%', height: '30px' }} /></div>
                                                <div className="my-2"><Skeleton style={{ width: '100%', height: '60px' }} /></div>
                                            </div>
                                            <div>
                                                <form>
                                                    <div className="mb-4">
                                                        <Skeleton style={{ width: '100%', height: '40px', borderRadius: '50px' }} />
                                                    </div>
                                                    <div className="mb-4">
                                                        <Skeleton style={{ width: '100%', height: '40px', borderRadius: '50px' }} />
                                                    </div>
                                                    <div className="mb-4">
                                                        <Skeleton style={{ width: '100%', height: '220px', borderRadius: '50px' }} />
                                                    </div>
                                                    <Skeleton style={{ width: '40%', height: '40px', borderRadius: '50px' }} />
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-12 col-lg-6'>
                                        <div className='container'>
                                            <div className='mt-5 mx-auto'>
                                                <div className="mapouter">
                                                    <div className="gmap_canvas">
                                                        <Skeleton style={{ width: '100%', height: '300px' }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-3 lh-65'>
                                                <Skeleton style={{ width: '60%', height: '40px' }} />
                                                <Skeleton style={{ width: '40%', height: '40px' }} />
                                                <Skeleton style={{ width: '50%', height: '40px' }} />
                                            </div>
                                            <div className='d-flex mt-2 mt-lg-5'>
                                                <div className='mx-auto mx-lg-0'>
                                                    {
                                                        socialData && socialData.map((el, index) => {
                                                            return (
                                                                <Link href={el.link} target="_blank" key={index}><i className={`${el.className} fa-lg mx-3`}></i></Link>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </section>
                        </div>
                    </>
            }
        </div>


    )
}

export default Contact
