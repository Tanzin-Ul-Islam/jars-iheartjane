import React, { useEffect } from 'react'
import Banner from '../../components/Banner'
import styles from "../../styles/Invoice.module.css"
import { useGetSingleOrderMutation } from "../../redux/api_core/apiCore";
import { useRouter } from 'next/router';
import { formatDate } from '../../utils/helper';
import Skeleton from 'react-loading-skeleton';
import HeaderTitles from '../../components/HeaderTitles';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
const Invoice = () => {
    const router = useRouter();
    const orderNumber = router?.query?.params?.length > 0 ? router?.query?.params[0] : null;

    const { pageMeta, commonBannerCmsData } = useSelector((store) => store.globalStore);

    //get order data
    const [getSingleOrder, { data: result, isLoading, isError }] = useGetSingleOrderMutation();

    let orderDetails = {};
    if (result && result.orders?.length > 0) {
        orderDetails = result?.orders[0]
    }

    function showStatus(status) {
        if (status == 'open') {
            return 'New';
        } else if (status == 'confirmed') {
            return 'Confirmed';
        } else if (status == 'closed') {
            return 'Closed';
        } else {
            return 'N/A';
        }
    }

    function showPickupTime(param) {
        let date = new Date(param);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let time = hours + ':' + minutes + ' ' + ampm;
        return time;
    }

    
    useEffect(() => {
        if (router.isReady) {
            let data = {
                retailerId: JSON.parse(localStorage.getItem('selected-retailer')).id,
                filter: {
                    orderNumber: orderNumber
                }
            }
            getSingleOrder({ data });

        }
    }, [orderNumber]);


    return (
        <div>
            <HeaderTitles title={'invoicePageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.invoicePageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.invoicePageMetaKeyword}
                />
            </Head>
            <section>
                <Banner commonBannerCmsData={commonBannerCmsData} />
            </section>
            {
                orderDetails?.dispensaryName ?
                    <section className='container mb-5 my-4'>
                        {/* <p className='mb-0 py-3 ff-Soleil700 fs-36 text-center text-lg-start'>JARS</p> */}
                        <div className='d-flex justify-content-center'>
                            <picture>
                                <img src="../../images/Logo.png" />
                            </picture>
                        </div>
                        <div className='row my-4'>
                            <div className='col-12 col-md-6 mb-3 mb-lg-0'>
                                <div>
                                    <p className='mb-1 ff-Soleil700 fs-18'>{orderDetails?.customer?.name}</p>
                                </div>
                                <div className='fs-14 d-flex gap-3 mb-3'>
                                    <div className=''>
                                        <p className='mb-0 ff-Soleil400'>Phone : </p>
                                        <p className='mb-0 ff-Soleil400'>Birthday :</p>
                                        <p className='mb-0 ff-Soleil400'>Email :</p>
                                    </div>
                                    <div className=''>
                                        <p className='mb-0 ff-Soleil400'>{orderDetails?.customer?.phone}</p>
                                        <p className='mb-0 ff-Soleil400'>{formatDate(new Date(orderDetails?.customer?.birthdate))}</p>
                                        <p className='mb-0 ff-Soleil400'>{orderDetails?.customer?.email ? orderDetails?.customer?.email : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className='fs-14'>
                                    <p className='mb-2 fs-18 fw-bold ff-Soleil700'>{orderDetails?.dispensaryName}</p>
                                    <p className='mb-2 py-1 ff-Soleil400 bg-dark text-white w-15 text-center fs-12 rounded-1'>{orderDetails?.pickup ? 'PICKUP' : orderDetails?.delivery ? 'DELIVERY' : 'N/A'}</p>
                                    {
                                        orderDetails?.pickup ?
                                            <>
                                                <p className='mb-0 ff-Soleil400'>Pickup Date : {formatDate(orderDetails?.reservationDate?.startTime)}</p>
                                                <p className='mb-0 ff-Soleil400'>Pickup Time : {showPickupTime(orderDetails?.reservationDate?.startTime)}-{showPickupTime(orderDetails?.reservationDate?.endTime)}</p>
                                            </>
                                            : null
                                    }
                                </div>
                            </div>
                            <div className='col-12 col-md-6'>
                                <div>
                                    <h1 className='mb-1 fw-bold ff-Soleil700 fs-18'>ORDER</h1>
                                </div>
                                <div className='fs-14 d-flex gap-3 mb-3'>
                                    <div className=''>
                                        <p className='mb-0 ff-Soleil400'>Order : </p>
                                        <p className='mb-0 ff-Soleil400'>Order Placed :</p>
                                        <p className='mb-0 ff-Soleil400'>Status :</p>
                                        {/* <p className='mb-0 ff-Soleil400'>Invoice Status :</p> */}
                                    </div>
                                    <div>
                                        <p className='mb-0 ff-Soleil400'>{orderDetails?.orderNumber}</p>
                                        <p className='mb-0 ff-Soleil400'>{formatDate(orderDetails?.createdAt)}</p>
                                        <p className='mb-0 ff-Soleil400'>{showStatus(orderDetails?.status)}</p>
                                        {/* <p className='mb-0 ff-Soleil400'>COMPLETED</p> */}
                                    </div>
                                </div>
                                <div className='border'>
                                    <div className='d-flex align-items-center'>
                                        <div className='text-center bg-dark text-white'>
                                            <p className='mb-0 fs-28 px-3 ff-Soleil700'>{showStatus(orderDetails?.status)}</p>
                                        </div>
                                        <div className='text-center bg-light w-100' style={{ padding: "6px 0" }}>
                                            <p className='mb-0 fs-20 ff-Soleil700'>{formatDate(orderDetails?.createdAt)}</p>
                                        </div>
                                    </div>
                                    <hr className='my-auto' />
                                    <div className='text-center'>
                                        <p className='mb-0 ff-Soleil400 fs-16 py-2'><span className='fw-bold ff-Soleil700 fs-28'>${orderDetails?.total} </span>USD</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='mb-3'>
                            <table className={styles.table_cart}>
                                <thead className='bg-dark text-white fs-14 ff-Soleil700'>
                                    <tr>
                                        <th scope="col" className='text-center py-2'>Image</th>
                                        <th scope="col" className=''><span className='ms-2'>Name</span></th>
                                        <th scope="col" className='text-center'>Qty</th>
                                        <th scope="col" className='text-center'>Price</th>
                                        <th scope="col" className='text-center'>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className='border-0 fs-14 align-middle border ff-Soleil400'>
                                    {
                                        orderDetails?.items?.map((el, index) => {
                                            return (
                                                <tr className='border'>
                                                    <td data-th="Image" className='text-center'>
                                                        <div>
                                                            <picture>
                                                                <img style={{ objectFit: "fill" }}
                                                                    height="50"
                                                                    src={el?.product?.image}
                                                                    alt="Grower" />
                                                            </picture>
                                                        </div>
                                                    </td>
                                                    <td data-th="Name">
                                                        <div className='py-3'>
                                                            <p className='mb-0 ms-2' style={{ fontSize: "9px", }}>{el?.product?.brand?.name}</p>
                                                            <p className='mb-0 fs-14 w-100 w-md-50 ms-auto ms-md-2 line-clamp-2'>{el?.product?.name}</p>
                                                        </div>
                                                    </td>
                                                    <td data-th="Quantity" className='text-end text-lg-center'>{el?.quantity}</td>
                                                    <td data-th="Price" className='text-end text-lg-center'>${el?.price / 100}</td>
                                                    <td data-th="Subtotal" className='text-end text-lg-center'>${el?.subtotal / 100}</td>
                                                </tr>
                                            )
                                        })
                                    }

                                    {/* <tr className="no-bottom-border">
                                        <td colSpan={3} className=""></td>
                                        <td className='ff-Soleil700 text-nowrap'>Subtotal :</td>
                                        <td className='ff-Soleil400'>${orderDetails?.subtotal}</td>
                                    </tr>
                                    <tr className="">
                                        <td colSpan={3} className="border-0"></td>
                                        <td className='ff-Soleil700'>Tax :</td>
                                        <td className='ff-Soleil400'>${orderDetails?.tax}</td>
                                    </tr>
                                    <tr className="no-bottom-border">
                                        <td colSpan={3}></td>
                                        <td className='ff-Soleil700'>Total :</td>
                                        <td className='ff-Soleil400'>${orderDetails?.total}</td>
                                    </tr> */}
                                </tbody>
                            </table>
                            <div className='mt-3'>
                                <div className='d-flex justify-content-center align-items-end flex-column p-2 me-0 me-lg-5'>
                                        <div className='d-flex justify-content-center align-items-center gap-5'>
                                            <p className='ff-Soleil700 mb-0'>Subtotal:</p>
                                            <p className='ff-Soleil400 mb-0'>${orderDetails?.subtotal}</p>
                                        </div>
                                        
                                        <div className='d-flex justify-content-center align-items-center gap-5'>
                                            <p className='ff-Soleil700 mb-0' style={{marginRight:"5px"}}>Tax:</p>
                                            <p className='ff-Soleil400 mb-0'>${orderDetails?.tax}</p>
                                        </div> 

                                        <div className='d-flex justify-content-center align-items-center gap-5'>
                                            <p className='ff-Soleil700 mb-0' style={{marginRight:"5px"}}>Discount:</p>
                                            <p className='ff-Soleil400 mb-0'>${(orderDetails?.subtotal - orderDetails?.total)}</p>
                                        </div> 
                                        
                                        <div className='d-flex justify-content-center align-items-center gap-5'>
                                            <p className='ff-Soleil700 mb-0'>Total:</p>
                                            <p className='ff-Soleil400 mb-0'>${orderDetails?.total}</p>
                                        </div>   
                                </div>
                            </div>
                            {/* <table className='' style={{width:"100%"}}>
                                <tbody>
                                        <tr className="no-bottom-border">
                                            <td colSpan={3} className="w-70"></td>
                                            <td className='ff-Soleil700 text-nowrap'>Subtotal :</td>
                                            <td className='ff-Soleil400'>${orderDetails?.subtotal}</td>
                                        </tr>
                                        <tr className="">
                                            <td colSpan={3} className="border-0"></td>
                                            <td className='ff-Soleil700'>Tax :</td>
                                            <td className='ff-Soleil400'>${orderDetails?.tax}</td>
                                        </tr>
                                        <tr className="no-bottom-border">
                                            <td colSpan={3}></td>
                                            <td className='ff-Soleil700'>Total :</td>
                                            <td className='ff-Soleil400'>${orderDetails?.total}</td>
                                        </tr>

                                </tbody>
                            </table> */}
                        </div>
                        {/* <div className='fs-14'>
                <p className='mb-1 ff-Soleil700'>Notes</p>
                <p className='mb-0 ff-Soleil400'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui, officia!</p>
                <p className='mb-0 ff-Soleil400'>Lorem ipsum, dolor sit amet consectetur</p>
            </div> */}
                    </section>
                    :
                    <>
                        <Loader />
                        <section className='container mb-5 my-4'>
                            <p className='mb-0 py-3 ff-Soleil700 fs-36 text-center text-lg-start'>
                                <Skeleton width="100px" height="40px" />
                            </p>
                            <div className='row mb-4'>
                                <div className='col-12 col-md-6 mb-3 mb-lg-0'>
                                    <div>
                                        <p className='mb-1 ff-Soleil700 fs-18'>
                                            <Skeleton width="150px" height="25px" />
                                        </p>
                                    </div>
                                    <div className='fs-14 d-flex gap-3 mb-3'>
                                        <div className=''>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /> </p>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /></p>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /></p>
                                        </div>
                                        <div className=''>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /></p>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /></p>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /></p>
                                        </div>
                                    </div>
                                    <div className='fs-14'>
                                        <p className='mb-2 fs-18 fw-bold ff-Soleil700'><Skeleton width="300px" height="26px" /></p>
                                        <p className='mb-2 py-1 ff-Soleil400'><Skeleton width="90px" height="25px" /></p>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div>
                                        <p className='mb-1 fw-bold ff-Soleil700 fs-18'><Skeleton width="80px" height="30px" /></p>
                                    </div>
                                    <div className='fs-14 d-flex gap-3 mb-3'>
                                        <div className=''>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /> </p>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /> </p>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /> </p>
                                        </div>
                                        <div>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /></p>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /></p>
                                            <p className='mb-0 ff-Soleil400'><Skeleton width="80px" height="20px" /></p>
                                        </div>
                                    </div>
                                    <div className='border'>
                                        <div className='d-flex align-items-center'>
                                            <Skeleton width="540px" height="40px" />
                                        </div>
                                        <hr className='my-auto' />
                                        <div className='text-center'>
                                            <p className='mb-0 ff-Soleil400 fs-16 py-2'>
                                                <Skeleton width="100px" height="45px" />
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className='mb-3'>
                                <Skeleton width="100" height="200px" />
                            </div>
                        </section>
                    </>

            }

        </div>
    )
}

export default Invoice