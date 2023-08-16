import { useEffect, useState } from 'react';
import styles from '../components/chooseLocation/css/chooseLocation.module.css'
import { useRouter } from "next/router";
import { useGetLandingPageCmsQuery, useGetRetailerDataMutation, useGetRetailerSearchDataMutation } from '../redux/api_core/apiCore';
import { postData } from '../utils/FetchApi';
import api from '../config/api.json';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRetailer, setSiteLoader, setCheckoutId, setRetailerType } from '../redux/global_store/globalReducer';
import Swal from 'sweetalert2';
import axios from 'axios';
import { createToast } from '../utils/toast';
import { createCheckout } from '../utils/helper';
import Skeleton from 'react-loading-skeleton';
import HeaderTitles from '../components/HeaderTitles';
import Head from 'next/head';

export default function Retailer() {
    const router = useRouter()
    const dispatch = useDispatch();
    const { pageMeta } = useSelector((store) => store.globalStore);

    const [allRetailer, setAllRetailer] = useState([]);
    const [search, setSearch] = useState('');

    const { data, isSuccess, isFetching, isLoading, error } = useGetLandingPageCmsQuery({});
    const [getRetailer, result] = useGetRetailerDataMutation({});
    const [getRetailerSearch, result1] = useGetRetailerSearchDataMutation({});
    const [orderType, setOrderType] = useState('');
    const [skeletonHoldSearch, setSkeletonHoldSearch] = useState(true);
    const [searchDataNotFound, setSearchDataNotFound] = useState(false);
    const [storeTitle, setStoreTitle] = useState("");


    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];

    const handleRetialderSelectManually = async (retailerId) => {
        try {
            dispatch(setSiteLoader(true));
            let response = await postData(api.retailerAll.retailerDetails, { retailerId: retailerId });
            if (response.status == 201 || response.status == 200) {
                let retailerRes = response.data.retailer;
                localStorage.setItem('selected-retailer', JSON.stringify(response.data.retailer));
                let checkoutId = await createCheckout({ retailerId: response.data.retailer?.id, orderType: orderType, pricingType: "RECREATIONAL" });
                if (checkoutId) {
                    dispatch(setCheckoutId(checkoutId));
                }
                dispatch(setSelectedRetailer(retailerRes));
                router.push('/');
            } else {
                createToast("Something went wrong! Please try again.", 'error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleRetailerDataSearch = async (e) => {
        e.preventDefault();
        if (!search) {
            createToast("Please enter zip / postal-code", 'error')
        } else {
            if (router.query.type === 'pick-up') {
                const data = await getRetailerSearch(search + '&type=PICKUP');
                setAllRetailer(data?.data);
            }

            if (router.query.type === 'delivery') {
                const data = await getRetailerSearch(search + '&type=DELIVERY');
                setAllRetailer(data?.data);
            }
        }
    }

    useEffect(() => {
        if (router.isReady) {
            if (router?.query?.type) {
                if (router?.query?.type === 'pick-up') {
                    getRetailer("PICKUP")
                    setOrderType("PICKUP")

                    setStoreTitle(data?.data[0].pickUpPageTitle)

                    localStorage.setItem('retailer_type', JSON.stringify('pickup'))
                    dispatch(setRetailerType('pickup'));
                }

                if (router?.query?.type === 'delivery') {
                    getRetailer("DELIVERY")
                    setOrderType("DELIVERY")

                    setStoreTitle(data?.data[0].deliveryPageTitle)

                    localStorage.setItem('retailer_type', JSON.stringify('delivery'))
                    dispatch(setRetailerType('delivery'));
                }
            }
        }
    }, [router?.query?.type]);

    useEffect(() => {
        if (result?.data?.length > 0) {
            dispatch(setSiteLoader(false));
        } else {
            dispatch(setSiteLoader(true));
        }
        setAllRetailer(result?.data);

        if (allRetailer?.length <= 0) {
            setTimeout(() => {
                setSkeletonHoldSearch(false);
                setSearchDataNotFound(true);
            }, 2000)
        }

    }, [result?.data]);



    return (

        <>
            <HeaderTitles title={'retailerPageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.retailerPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.retailerPageMetaKeyword}
                />
            </Head>
            {
                result && result?.data?.length > 0 ?
                    <div className={styles.testLocationPage}>
                        <div className="container-fluid">
                            <div className="container">
                                <div className="row m-0">
                                    <div className="col-12 col-md-12 col-lg-5">
                                        <div className={styles.parent}>
                                            <div className={styles.child}>
                                                <div className="text-center mt-5 mb-3 mb-lg-5">
                                                    <picture>
                                                        {data?.data?.length > 0 ?
                                                            <img src={data?.data[0].logo} alt='' style={{ width: '73px', height: '73px' }} />
                                                            :
                                                            <Skeleton circle="true" width="73px" height="73px" />
                                                        }
                                                    </picture>
                                                </div>
                                                <div className="text-center px-4">
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
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-7 p-0 bg-site-blue-100">
                                        {/* <div className={`bg-site-Red ${styles.chooseLocationPageRightSide}`} style={{ backgroundImage: `url(${data?.data[0].image})`, }}></div> */}
                                        <div className="p-4 text-center">
                                            {data?.data?.length > 0 ?
                                                <h2 className="fs-20 ff-powerGrotesk600 mb-4">{storeTitle}</h2>
                                                :
                                                <Skeleton width="430px" height="35px" style={{ marginBottom: "10px" }} />
                                            }
                                            <div className={`d-flex justify-content-center ${styles.testLocationBox}`}>
                                                <div className="text-start w-70">
                                                    <div className="mb-4">
                                                        {/* <input type="search" className="form-control shadow-none bg-white py-2" placeholder={data?.data[0].searchBoxText} /> */}
                                                        <form onSubmit={handleRetailerDataSearch}>
                                                            <div className="input-group">
                                                                <input name="search" onChange={(e) => setSearch(e.target.value)} type="search" className="form-control shadow-none" placeholder={data?.data[0].searchBoxText}
                                                                    aria-label="Search here" aria-describedby="Search-addon2" value={search} />
                                                                <button className="btn btn-outline-secondary" type="submit"
                                                                    id="Search-addon2">Search
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <ul className="list-unstyled">
                                                        {allRetailer?.length > 0 ? allRetailer?.map((item, index) => {
                                                            let dayN = '';
                                                            for (let hour in item.hours) {
                                                                if (router?.query?.type === 'delivery' && hour === 'delivery') {
                                                                    if ('Friday' === dayName) {
                                                                        dayN = item?.hours?.delivery.Friday;
                                                                    }
                                                                    if ('Saturday' === dayName) {
                                                                        dayN = item?.hours?.delivery.Saturday;
                                                                    }
                                                                    if ('Sunday' === dayName) {
                                                                        dayN = item?.hours?.delivery.Sunday;
                                                                    }
                                                                    if ('Monday' === dayName) {
                                                                        dayN = item?.hours?.delivery.Monday;
                                                                    }
                                                                    if ('Tuesday' === dayName) {
                                                                        dayN = item?.hours?.pickup.Tuesday;
                                                                    }
                                                                    if ('Wednesday' === dayName) {
                                                                        dayN = item?.hours?.delivery.Wednesday;
                                                                    }
                                                                    if ('Thursday' === dayName) {
                                                                        dayN = item?.hours?.delivery.Thursday;
                                                                    }

                                                                }
                                                                if (router?.query?.type === 'pick-up' && hour === 'pickup') {
                                                                    if ('Friday' === dayName) {
                                                                        dayN = item?.hours?.pickup.Friday;
                                                                    }
                                                                    if ('Saturday' === dayName) {
                                                                        dayN = item?.hours?.pickup.Saturday;
                                                                    }
                                                                    if ('Sunday' === dayName) {
                                                                        dayN = item?.hours?.pickup.Sunday;
                                                                    }
                                                                    if ('Monday' === dayName) {
                                                                        dayN = item?.hours?.pickup.Monday;
                                                                    }
                                                                    if ('Tuesday' === dayName) {
                                                                        dayN = item?.hours?.pickup.Tuesday;
                                                                    }
                                                                    if ('Wednesday' === dayName) {
                                                                        dayN = item?.hours?.pickup.Wednesday;
                                                                    }
                                                                    if ('Thursday' === dayName) {
                                                                        dayN = item?.hours?.pickup.Thursday;
                                                                    }

                                                                }
                                                            }
                                                            return (
                                                                <li className="mb-4" key={index}>
                                                                    <div>
                                                                        <h3 className="fs-18">
                                                                            {item.name}
                                                                        </h3>
                                                                        <p>{item.addressObject.line1}<br />
                                                                            {item.addressObject.city}, {item.addressObject.state}, {item.addressObject.postalCode}<br />
                                                                            {dayN?.active && (
                                                                                <>
                                                                                    Today’s Hours: {dayN?.start} – {dayN?.end}
                                                                                </>
                                                                            )}
                                                                        </p>
                                                                        <button onClick={() => handleRetialderSelectManually(item?.id)} className={`btn px-4 ${styles.chooseLocationPageBtn} w-100`}>
                                                                            {data?.data[0].chooseStoreButtonText} </button>
                                                                    </div>
                                                                </li>
                                                            )
                                                        })
                                                            :
                                                            <>
                                                                {skeletonHoldSearch && <Skeleton width="100%" height="" style={{ marginBottom: "200px" }} />}

                                                                {searchDataNotFound && <p className='text-center'>Retailer not found!</p>}
                                                            </>

                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : <></>
            }
        </>


    )
}
