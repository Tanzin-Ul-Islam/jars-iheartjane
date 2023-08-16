import styles from './css/chooseLocation.module.css'
import Image from 'next/image'
import Link from "next/link";
import { useRouter } from "next/router";
import { useGetLandingPageCmsQuery } from '../../redux/api_core/apiCore';
import { useEffect, useState } from 'react';
import { fetchData, postData } from '../../utils/FetchApi';
import api from '../../config/api.json';
import { useDispatch } from 'react-redux';
import { setSelectedRetailer, setCheckoutId } from '../../redux/global_store/globalReducer';
import { createToast } from '../../utils/toast';
import { createCheckout } from '../../utils/helper';
import Skeleton from 'react-loading-skeleton';
export default function ChooseLocation() {

    const router = useRouter();
    const dispatch = useDispatch();


    const { data, isSuccess, isFetching, error } = useGetLandingPageCmsQuery({});

    const getData = async () => {
        let res = await fetchData(api.retailerAll.selectedRetailer);
        if (res.data?.length > 0) {
            let response = await postData(api.retailerAll.retailerDetails, { retailerId: res.data[0].retailerId });
            if (response.status == 201) {
                let checkoutId = await createCheckout({ retailerId: response.data.retailer.id, orderType: "PICKUP", pricingType: "RECREATIONAL" });
                if (checkoutId) {
                    dispatch(setCheckoutId(checkoutId));
                }
                localStorage.setItem('selected-retailer', JSON.stringify(response.data.retailer));
                dispatch(setSelectedRetailer(data));
                router.push('/home');
            }
        } else {
            localStorage.setItem('selected-retailer', 'undefined');
        }
    }

    useEffect(() => {
        getData();
    }, []);



    return (
        <div className={styles.chooseLocationPage}>
            <div className="row m-0">
                <div className="col-12 col-md-7 col-lg-5 p-0">
                    <div className="bg-white py-3  d-flex flex-column justify-content-between">
                        <div className="text-center mb-5">
                            <picture>
                                {data?.data?.length > 0 ? <img src={data?.data[0].logo} alt='' style={{ width: '73px', height: '73px' }} />
                                :
                                <Skeleton circle="true" width="73px" height="73px" />}
                            </picture>
                        </div>
                        <div className="text-center px-4 mb-5">
                            {data?.data?.length > 0 ?
                                <h1 className="fs-40 ff-powerGrotesk500">{data?.data[0].title}</h1>
                            :
                                <Skeleton width="500px" height="50px" />
                            }
                            {data?.data?.length > 0 ?
                                <p>{data?.data[0].description}</p>
                            :
                                <Skeleton width="520px" height="100px" />
                            }
                        </div>
                        <hr className="mb-4" />
                        <div className="text-center">
                            {data?.data?.length > 0 ?
                                <h2 className="fs-20 ff-powerGrotesk600 mb-4">{data?.data[0].questionTitle}</h2>
                            :
                                <Skeleton width="430px" height="35px" style={{ marginBottom: "10px" }} />
                            }
                            <div className="d-flex justify-content-center">
                                {/* <Link href={{ pathname: '/retailer', query: { type: 'pick-up' } }} className={`w-100 px-4 py-4 ${styles.chooseLocationPageBtn} border-end`}>
                                    {data?.data[0].buttonOneText}
                                </Link>
                                <Link href={{ pathname: '/retailer', query: { type: 'delivery' } }} className={` w-100 px-4 py-4 ${styles.chooseLocationPageBtn}`}>
                                    {data?.data[0].buttonTwoText}
                                </Link> */}
                                {data?.data?.length > 0 ?
                                    <>
                                        <Link href={{ pathname: '/retailer', query: { type: 'pick-up' } }} className={`w-100 px-4 py-4 ${styles.chooseLocationPageBtn} border-end`}>
                                            {data?.data[0].buttonOneText}
                                        </Link>
                                        <Link href={{ pathname: '/retailer', query: { type: 'delivery' } }} className={` w-100 px-4 py-4 ${styles.chooseLocationPageBtn}`}>
                                            {data?.data[0].buttonTwoText}
                                        </Link>
                                    </>
                                :
                                    <Skeleton width="568px" height="70px" />
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-5 col-lg-7 p-0">
                    { data?.data?.length > 0 ?
                        <div className={`${styles.chooseLocationPageRightSide}`} style={{ backgroundImage: `url(${data?.data[0].image})`, }}></div>
                    :
                        <Skeleton width="100%" height="100vh" />
                    }    
                </div>
            </div>
        </div>
    )
}
