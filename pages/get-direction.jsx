import React from 'react'
import styles from '../styles/Contact.module.css';
import { GoLocation } from "react-icons/go";
import { BsTelephone } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa"
import { BsInstagram } from "react-icons/bs"
import { FaTiktok } from "react-icons/fa"
import { BsYoutube } from "react-icons/bs"
import Banner from '../components/Banner';
import { useGetContactPageCmsQuery } from "../redux/api_core/apiCore";
import ContactCmsInterface from "../interfaces/ContactInterface";
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Script from "next/script";
import HeaderTitles from '../components/HeaderTitles';
import Link from "next/link";
import Skeleton from 'react-loading-skeleton';
import Loader from '../components/Loader';


function GetDirection() {
    const retailer = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('selected-retailer')) : null;
    const { data, isSuccess, isFetching, error } = useGetContactPageCmsQuery(retailer?.id);
    let cmsData = data?.data?.cmsData[0];
    let commonBannerCmsData = data?.data?.commonBannerCmsData[0];
    let socialData = data?.data?.socialPackData;

    const { selectedRetailer, pageMeta } = useSelector((state) => (state.globalStore));

    return (
        selectedRetailer?.name && isSuccess ?
        <>
            <HeaderTitles title={'getDirectionPageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.getDirectionPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.getDirectionPageMetaKeyword}
                />
            </Head>

            <section>
                <Banner commonBannerCmsData={commonBannerCmsData} />
            </section>
            <div className=''>
                <section className='container'>
                    <div className='row mb-5'>
                        <div className='col-12 col-md-12 col-lg-6'>
                            <div className='container'>
                                <div className="col-12 col-md-12 mt-5 lh-65 text-center text-lg-start">
                                    <h1>{selectedRetailer?.name}</h1>
                                </div>
                                <div className='mt-4 mt-lg-1 lh-65'>
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
                            </div>

                        </div>

                    </div>

                </section>
            </div>

        </>
        :
        <>
            <Loader />
            <HeaderTitles title={'getDirectionPageTitle'} />
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
                                <div className="col-12 col-md-12 mt-5 lh-65 text-center text-lg-start">
                                    <h4><Skeleton style={{ width: '70%', height: '30px' }} /></h4>
                                </div>
                                <div className='mt-4 mt-lg-1 lh-65'>
                                    <div className='d-flex flex-column flex-lg-row gap-0 gap-lg-4 text-center text-lg-start'>
                                        <Skeleton style={{ width: '300px', height: '30px' }} />
                                    </div>
                                    <div className='d-flex flex-column flex-lg-row gap-0 gap-lg-4 text-center text-lg-start'>
                                        <Skeleton style={{ width: '180px', height: '30px' }} />
                                    </div>
                                    <div className='d-flex flex-column flex-lg-row gap-0 gap-lg-4 text-center text-lg-start'>
                                        <Skeleton style={{ width: '220px', height: '30px' }} />
                                    </div>
                                </div>
                                <div className='d-flex mt-2 mt-lg-5'>
                                    <div className='mx-auto mx-lg-0'>
                                        <Skeleton style={{ width: '50%', height: '40px' }} />
                                    </div>
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
                            </div>

                        </div>

                    </div>

                </section>
            </div>

        </>

    )
}

export default GetDirection
