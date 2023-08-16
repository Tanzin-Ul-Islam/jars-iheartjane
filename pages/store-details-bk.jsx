import React from 'react'
import styles from '../styles/Contact.module.css';
import stylesStore from '../styles/StoreDetails.module.css';
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
import parse from 'html-react-parser';
import Script from "next/script";
import HeaderTitles from '../components/HeaderTitles';
import Skeleton from 'react-loading-skeleton';
import Loader from '../components/Loader';

function StoreDetails() {
    const retailer = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('selected-retailer')) : null;
    const { data, isSuccess, isFetching, error } = useGetContactPageCmsQuery(retailer?.id);
    let cmsData = data?.data?.cmsData[0];
    let commonBannerCmsData = data?.data?.commonBannerCmsData[0];

    const { selectedRetailer, pageMeta } = useSelector((state) => (state.globalStore));

    return (
        selectedRetailer?.address && isSuccess ?
        <>
            <HeaderTitles title={'storeDetailsPageTitle'} />
            <Head>
                <meta
                    name="description"
                        content={pageMeta?.storeDetailsPageMetaDescription}
                />
                <meta
                    name="keywords"
                        content={pageMeta?.storeDetailsPageMetaKeyword}
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
                                <div className="row mt-5">
                                    <div className="col-12 col-md-12">
                                        <h4>{selectedRetailer?.name}</h4>
                                        <address className='fs-17'>{selectedRetailer?.address}</address>
                                    </div>
                                    <div className="col-12 col-md-12">
                                        <h6 style={{ color: "#212322", }}>Pickup Hours</h6>
                                        <ul className={stylesStore.hours}>

                                            <li>
                                                <span>Sunday</span>
                                                {selectedRetailer?.hours?.pickup?.Sunday?.active ? parse(`<span>${selectedRetailer?.hours?.pickup?.Sunday?.start} - ${selectedRetailer?.hours?.pickup?.Sunday?.end}</span>`) : 'close'}

                                            </li>
                                            <li>
                                                <span>Monday</span>
                                                {selectedRetailer?.hours?.pickup?.Monday?.active ? parse(`<span>${selectedRetailer?.hours?.pickup?.Monday?.start} - ${selectedRetailer?.hours?.pickup?.Monday?.end}</span>`) : 'close'}
                                            </li>
                                            <li>
                                                <span>Tuesday</span>
                                                {selectedRetailer?.hours?.pickup?.Tuesday?.active ? parse(`<span>${selectedRetailer?.hours?.pickup?.Tuesday?.start} - ${selectedRetailer?.hours?.pickup?.Tuesday?.end}</span>`) : 'close'}
                                            </li>
                                            <li>
                                                <span>Wednesday</span>
                                                {selectedRetailer?.hours?.pickup?.Wednesday?.active ? parse(`<span>${selectedRetailer?.hours?.pickup?.Wednesday?.start} - ${selectedRetailer?.hours?.pickup?.Wednesday?.end}</span>`) : 'close'}
                                            </li>
                                            <li>
                                                <span>Thursday</span>
                                                {selectedRetailer?.hours?.pickup?.Thursday?.active ? parse(`<span>${selectedRetailer?.hours?.pickup?.Thursday?.start} - ${selectedRetailer?.hours?.pickup?.Thursday?.end}</span>`) : 'close'}
                                            </li>
                                            <li>
                                                <span>Friday</span>
                                                {selectedRetailer?.hours?.pickup?.Friday?.active ? parse(`<span>${selectedRetailer?.hours?.pickup?.Friday?.start} - ${selectedRetailer?.hours?.pickup?.Friday?.end}</span>`) : 'close'}
                                            </li>
                                            <li>
                                                <span>Saturday</span>
                                                {selectedRetailer?.hours?.pickup?.Saturday?.active ? parse(`<span>${selectedRetailer?.hours?.pickup?.Saturday?.start} - ${selectedRetailer?.hours?.pickup?.Saturday?.end}</span>`) : 'close'}
                                            </li>

                                        </ul>
                                    </div>
                                    <div className="col-12 col-md-12">
                                        <h6 style={{ color: "#212322", }}>Delivery Hours</h6>
                                        <ul className={stylesStore.hours}>

                                            <li>
                                                <span>Sunday</span>
                                                {selectedRetailer?.hours?.delivery?.Sunday?.active ? parse(`<span>${selectedRetailer?.hours?.delivery?.Sunday?.start} - ${selectedRetailer?.hours?.delivery?.Sunday?.end}</span>`) : 'close'}
                                            </li>
                                            <li>
                                                <span>Monday</span>
                                                {selectedRetailer?.hours?.delivery?.Monday?.active ? parse(`<span>${selectedRetailer?.hours?.delivery?.Monday?.start} - ${selectedRetailer?.hours?.delivery?.Monday?.end}</span>`) : 'close'}
                                            </li>
                                            <li>
                                                <span>Tuesday</span>
                                                {selectedRetailer?.hours?.delivery?.Tuesday?.active ? parse(`<span>${selectedRetailer?.hours?.delivery?.Tuesday?.start} - ${selectedRetailer?.hours?.delivery?.Tuesday?.end}</span>`) : 'close'}
                                            </li>
                                            <li>
                                                <span>Wednesday</span>
                                                {selectedRetailer?.hours?.delivery?.Wednesday?.active ? parse(`<span>${selectedRetailer?.hours?.delivery?.Wednesday?.start} - ${selectedRetailer?.hours?.delivery?.Wednesday?.end}</span>`) : 'close'}
                                            </li>
                                            <li>
                                                <span>Thursday</span>
                                                {selectedRetailer?.hours?.delivery?.Thursday?.active ? parse(`<span>${selectedRetailer?.hours?.delivery?.Thursday?.start} - ${selectedRetailer?.hours?.delivery?.Thursday?.end}</span>`) : 'close'}
                                            </li>
                                            <li>
                                                <span>Friday</span>
                                                {selectedRetailer?.hours?.delivery?.Friday?.active ? parse(`<span>${selectedRetailer?.hours?.delivery?.Friday?.start} - ${selectedRetailer?.hours?.delivery?.Friday?.end}</span>`) : 'close'}
                                            </li>
                                            <li>
                                                <span>Saturday</span>
                                                {selectedRetailer?.hours?.delivery?.Saturday?.active ? parse(`<span>${selectedRetailer?.hours?.delivery?.Saturday?.start} - ${selectedRetailer?.hours?.delivery?.Saturday?.end}</span>`) : 'close'}
                                            </li>

                                        </ul>
                                    </div>


                                    <div className="col-12 col-md-12">
                                        <h6 style={{ color: "#212322", }}>Payment Methods</h6>
                                        <ul className={stylesStore.PaymentMethods}>

                                            {selectedRetailer?.paymentMethodsByOrderTypes?.map((payment, index) => {
                                                let pMethodData = '';
                                                {
                                                    payment.paymentMethods.map((data) => {
                                                        pMethodData += data + '<br/>';
                                                    })
                                                }
                                                return (
                                                    <li key={index}>
                                                        <span className={stylesStore.PaymentMethodsType}>{payment.orderType}: </span>
                                                        <span className={stylesStore.PaymentMethodsData}>{parse(pMethodData)}</span>
                                                    </li>
                                                )
                                            })}


                                        </ul>
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
                                                height={450}
                                                id="gmap_canvas"
                                                src={`https://maps.google.com/maps?q=${selectedRetailer?.address}&t=&z=10&ie=UTF8&iwloc=&output=embed`}>
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
            <HeaderTitles title={'storeDetailsPageTitle'} />
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
                                <div className="row mt-5">
                                    <div className="col-12 col-md-12">
                                        <h4><Skeleton style={{ width: '60%', height: '30px' }} /></h4>
                                        <address className='fs-17'>
                                            <Skeleton style={{ width: '70%', height: '20px' }} />
                                        </address>
                                    </div>
                                    <div className="col-12 col-md-12">
                                        <h6 style={{ color: "#212322", }}>
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                        </h6>
                                        <ul className={stylesStore.hours}>

                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />

                                        </ul>
                                    </div>
                                    <div className="col-12 col-md-12">
                                        <h6 style={{ color: "#212322", }}>
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                        </h6>
                                        <ul className={stylesStore.hours}>

                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />

                                        </ul>
                                    </div>


                                    <div className="col-12 col-md-12">
                                        <h6 style={{ color: "#212322", }}>
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                        </h6>
                                        <ul className={stylesStore.hours}>
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                            <Skeleton style={{ width: '30%', height: '20px' }} />
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className='col-12 col-md-12 col-lg-6'>
                            <div className='container'>
                                <div className='mt-5 mx-auto'>
                                    <div className="mapouter">
                                        <div className="gmap_canvas">
                                            <Skeleton style={{ width: '100%', height: '350px' }} />
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

export default StoreDetails;
