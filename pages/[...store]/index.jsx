import React, { useEffect, useState } from 'react'
import styles from '../../styles/Contact.module.css';
import stylesStore from '../../styles/StoreDetails.module.css';
import { GoLocation } from "react-icons/go";
import { BsTelephone } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa"
import { BsInstagram } from "react-icons/bs"
import { FaTiktok } from "react-icons/fa"
import { BsYoutube } from "react-icons/bs"
import Banner from '../../components/Banner';
import { useGetContactPageCmsQuery } from "../../redux/api_core/apiCore";
import ContactCmsInterface from "../../interfaces/ContactInterface";
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import parse from 'html-react-parser';
import Script from "next/script";
import HeaderTitles from '../../components/HeaderTitles';
import Skeleton from 'react-loading-skeleton';
import Loader from '../../components/Loader';
import { useRouter } from 'next/router';
import { createCheckout, retialerNameSlug } from '../../utils/helper';
import { setActiveRetailerType, setCheckoutId, setInitialPage, setMenuTypeValue, setSelectedRetailer, setUserSelectRetailerState } from '../../redux/global_store/globalReducer';
import { postData } from '../../utils/FetchApi';
import NotFound from '../404';
import api from '../../config/api.json';

function StoreDetails() {
    const router = useRouter();
    const dispatch = useDispatch();
    const routeStore = router?.query?.store;
    // const slug = route.replace(/^\//, '');
    // const parts = slug.split('/');
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = new Date();
    let dayName = days[d.getDay()];
    const [checkStore, setCheckStore] = useState(true);

    const retailer = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('selected-retailer')) : null;

    const { data, isSuccess, isFetching, error } = useGetContactPageCmsQuery(retailer?.id);
    let cmsData = data?.data?.cmsData[0];
    let commonBannerCmsData = data?.data?.commonBannerCmsData[0];

    const { selectedRetailer, pageMeta, allFormatedRetailer } = useSelector((state) => (state.globalStore));

    function getRetailerType(retailer) {
        let retailerType = undefined;
        if ('Friday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Friday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Friday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Saturday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Saturday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Saturday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Sunday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Sunday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Sunday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Monday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Monday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Monday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Tuesday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Tuesday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Tuesday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Wednesday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Wednesday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Wednesday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Thursday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Thursday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Thursday?.active) ? 'Pickup' : 'Delivery';
        }
        return retailerType ? retailerType : 'Pickup';
    }

    async function handleRetialderSelectManually(retailerId) {
        try {
            let response = await postData(api.retailerAll.retailerDetails, {
                retailerId: retailerId,
            });
            if (response.status == 201 || response.status == 200) {
                let retailerRes = response.data.retailer;
                dispatch(setSelectedRetailer(retailerRes));
                localStorage.setItem('selected-retailer', JSON.stringify(response.data.retailer));
                const retailerType = getRetailerType(retailerRes);
                localStorage.setItem('retailer_type', JSON.stringify(retailerType));
                localStorage.setItem('active_retailer_type', JSON.stringify(retailerType));
                dispatch(setActiveRetailerType(retailerType));
                const orderTypeForCheckout = retailerRes?.deliverySettings?.afterHoursOrderingForPickup ? 'PICKUP' : 'DELIVERY'
                let checkoutId = await createCheckout({
                    retailerId: response.data.retailer.id, orderType: retailerType == 'Curbside Pickup' ? 'PICKUP' : retailerType.toUpperCase(), pricingType: 'RECREATIONAL',
                });
                if (checkoutId) {
                    dispatch(setCheckoutId(checkoutId));
                }
                dispatch(setMenuTypeValue('RECREATIONAL'));
                localStorage.setItem("menuTypeValue", 'RECREATIONAL');
                dispatch(setInitialPage(true))
                localStorage.setItem("initial-page", true);
                localStorage.setItem('user_selected_retailer_state', JSON.stringify(parts[0].toUpperCase()));
                dispatch(setUserSelectRetailerState(parts[0].toUpperCase()));
                setCheckStore(true);
            } else {
                createToast('Something went wrong! Please try again.', 'error');
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        if (router.isReady) {
            if (allFormatedRetailer?.length > 0) {
                const nameFound = allFormatedRetailer?.filter((dispensary) => retialerNameSlug(dispensary?.name) === routeStore[1] && dispensary?.addressObject?.state?.toLowerCase() === routeStore[0]);
                if (nameFound?.length > 0) {
                    handleRetialderSelectManually(nameFound[0]?.id)
                } else {
                    setCheckStore(false);
                }
            }
        }

    }, [allFormatedRetailer]);

    if (checkStore) {
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
                                            {
                                                selectedRetailer?.hours?.pickup ? (
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
                                                ) : <></>
                                            }

                                            {
                                                selectedRetailer?.hours?.delivery ? (
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
                                                ) : <></>
                                            }

                                            {
                                                selectedRetailer?.hours?.curbsidePickup ? (
                                                    <div className="col-12 col-md-12">
                                                        <h6 style={{ color: "#212322", }}>Curbside Pickup Hours</h6>
                                                        <ul className={stylesStore.hours}>
                                                            <li>
                                                                <span>Sunday</span>
                                                                {selectedRetailer?.hours?.curbsidePickup?.Sunday?.active ? parse(`<span>${selectedRetailer?.hours?.curbsidePickup?.Sunday?.start} - ${selectedRetailer?.hours?.curbsidePickup?.Sunday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Monday</span>
                                                                {selectedRetailer?.hours?.curbsidePickup?.Monday?.active ? parse(`<span>${selectedRetailer?.hours?.curbsidePickup?.Monday?.start} - ${selectedRetailer?.hours?.curbsidePickup?.Monday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Tuesday</span>
                                                                {selectedRetailer?.hours?.curbsidePickup?.Tuesday?.active ? parse(`<span>${selectedRetailer?.hours?.curbsidePickup?.Tuesday?.start} - ${selectedRetailer?.hours?.curbsidePickup?.Tuesday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Wednesday</span>
                                                                {selectedRetailer?.hours?.curbsidePickup?.Wednesday?.active ? parse(`<span>${selectedRetailer?.hours?.curbsidePickup?.Wednesday?.start} - ${selectedRetailer?.hours?.curbsidePickup?.Wednesday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Thursday</span>
                                                                {selectedRetailer?.hours?.curbsidePickup?.Thursday?.active ? parse(`<span>${selectedRetailer?.hours?.curbsidePickup?.Thursday?.start} - ${selectedRetailer?.hours?.curbsidePickup?.Thursday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Friday</span>
                                                                {selectedRetailer?.hours?.curbsidePickup?.Friday?.active ? parse(`<span>${selectedRetailer?.hours?.curbsidePickup?.Friday?.start} - ${selectedRetailer?.hours?.curbsidePickup?.Friday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Saturday</span>
                                                                {selectedRetailer?.hours?.curbsidePickup?.Saturday?.active ? parse(`<span>${selectedRetailer?.hours?.curbsidePickup?.Saturday?.start} - ${selectedRetailer?.hours?.curbsidePickup?.Saturday?.end}</span>`) : 'close'}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                ) : <></>
                                            }

                                            {
                                                selectedRetailer?.hours?.specialHours ? (
                                                    <div className="col-12 col-md-12">
                                                        <h6 style={{ color: "#212322", }}>Special Hours</h6>
                                                        <ul className={stylesStore.hours}>
                                                            <li>
                                                                <span>Sunday</span>
                                                                {selectedRetailer?.hours?.specialHours?.Sunday?.active ? parse(`<span>${selectedRetailer?.hours?.specialHours?.Sunday?.start} - ${selectedRetailer?.hours?.specialHours?.Sunday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Monday</span>
                                                                {selectedRetailer?.hours?.specialHours?.Monday?.active ? parse(`<span>${selectedRetailer?.hours?.specialHours?.Monday?.start} - ${selectedRetailer?.hours?.specialHours?.Monday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Tuesday</span>
                                                                {selectedRetailer?.hours?.specialHours?.Tuesday?.active ? parse(`<span>${selectedRetailer?.hours?.specialHours?.Tuesday?.start} - ${selectedRetailer?.hours?.specialHours?.Tuesday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Wednesday</span>
                                                                {selectedRetailer?.hours?.specialHours?.Wednesday?.active ? parse(`<span>${selectedRetailer?.hours?.specialHours?.Wednesday?.start} - ${selectedRetailer?.hours?.specialHours?.Wednesday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Thursday</span>
                                                                {selectedRetailer?.hours?.specialHours?.Thursday?.active ? parse(`<span>${selectedRetailer?.hours?.specialHours?.Thursday?.start} - ${selectedRetailer?.hours?.specialHours?.Thursday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Friday</span>
                                                                {selectedRetailer?.hours?.specialHours?.Friday?.active ? parse(`<span>${selectedRetailer?.hours?.specialHours?.Friday?.start} - ${selectedRetailer?.hours?.specialHours?.Friday?.end}</span>`) : 'close'}
                                                            </li>
                                                            <li>
                                                                <span>Saturday</span>
                                                                {selectedRetailer?.hours?.specialHours?.Saturday?.active ? parse(`<span>${selectedRetailer?.hours?.specialHours?.Saturday?.start} - ${selectedRetailer?.hours?.specialHours?.Saturday?.end}</span>`) : 'close'}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                ) : <></>
                                            }

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
                                                        src={`https://maps.google.com/maps?q=${selectedRetailer?.address}${selectedRetailer?.name}&t=&z=10&ie=UTF8&iwloc=&output=embed`}>
                                                    </iframe>
                                                    {/* <iframe
                                                    width="100%"
                                                    height={450}
                                                    id="gmap_canvas"
                                                    src={`https://maps.google.com/maps?q=${selectedRetailer?.address}&t=&z=10&ie=UTF8&iwloc=&output=embed`}>
                                                </iframe> */}
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
    } else {
        return (
            <>
                <NotFound />
            </>
        )
    }

}

export default StoreDetails;
