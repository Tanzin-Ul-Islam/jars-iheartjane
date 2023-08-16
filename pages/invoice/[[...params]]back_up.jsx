import React, { useEffect } from 'react'
import Banner from '../../components/Banner'
import styles from "../../styles/Invoice.module.css"
import { useGetFaqPageCmsQuery, useGetSingleOrderMutation } from "../../redux/api_core/apiCore";
import { useRouter } from 'next/router';
import { formatDate } from '../../utils/helper';
import Skeleton from 'react-loading-skeleton';
import HeaderTitles from '../../components/HeaderTitles';
const Invoice = () => {
    const router = useRouter();
    const orderNumber = router?.query?.params?.length > 0 ? router?.query?.params[0] : null;

    //for cms
    const { data, isSuccess, isFetching, error } = useGetFaqPageCmsQuery({});
    let commonBannerCmsData = data?.data?.commonBannerCmsData[0];

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
            <HeaderTitles title={'invoicePageTitle'}/>
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
                                    <p className='mb-1 fw-bold ff-Soleil700 fs-18'>ORDER</p>
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
                            <table className="table">
                                <thead className='bg-dark text-white fs-14 ff-Soleil700'>
                                    <tr>
                                        <th scope="col" className='text-center'>Image</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Qty</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className='border-0 fs-14 align-middle border ff-Soleil400'>
                                    {
                                        orderDetails?.items?.map(el => {
                                            return (
                                                <tr className='border'>
                                                    <td className='text-center'>
                                                        <div>
                                                            <picture>
                                                                <img style={{ objectFit: "fill" }}
                                                                    height="50"
                                                                    src={el?.product?.image}
                                                                    alt="Grower" />
                                                            </picture>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <p className='mb-0' style={{ fontSize: "9px", }}>{el?.product?.brand?.name}</p>
                                                            <p className='mb-0 fs-14'>{el?.product?.name}</p>
                                                        </div>
                                                    </td>
                                                    <td>{el?.quantity}</td>
                                                    <td>${el?.price / 100}</td>
                                                    <td>${el?.subtotal / 100}</td>
                                                </tr>
                                            )
                                        })
                                    }

                                    <tr className="no-bottom-border">
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
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        {/* <div className='fs-14'>
                <p className='mb-1 ff-Soleil700'>Notes</p>
                <p className='mb-0 ff-Soleil400'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui, officia!</p>
                <p className='mb-0 ff-Soleil400'>Lorem ipsum, dolor sit amet consectetur</p>
            </div> */}
                    </section>
                    :
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

            }

        </div>
    )
}

export default Invoice