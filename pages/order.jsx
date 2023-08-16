import React from 'react'
import Banner from '../components/Banner'
import Link from "next/link"
import styles from "../styles/User.module.css";
import { useState, useEffect } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs"
import { useRouter } from "next/router";
import { useGetAllOrderMutation } from "../redux/api_core/apiCore";
import { createToast } from "../utils/toast";
import UserSidebar from "../components/userSidebar";
import { postData } from '../utils/FetchApi';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../utils/helper';
import { setSiteLoader } from '../redux/global_store/globalReducer';
import HeaderTitles from '../components/HeaderTitles';
import Head from 'next/head';
import Loader from '../components/Loader';

const Order = () => {
    let { userInfo, selectedRetailer, pageMeta, commonBannerCmsData } = useSelector((store) => (store.globalStore));
    // console.log('userInfo', userInfo);

    //get all orders
    const [getAllOrder, { data: result, isLoading, isError }] = useGetAllOrderMutation();
    const orders = result?.data;

    const dispatch = useDispatch();

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

    useEffect(() => {
        let data = {
            retailerId: JSON.parse(localStorage.getItem('selected-retailer')).id,
            email: localStorage.getItem('email'),
        }
        if(selectedRetailer != 'undefined') getAllOrder({data});

    }, [selectedRetailer])
    return (

        <div>
            <HeaderTitles title={'orderPageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.orderPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.orderPageMetaKeyword}
                />
            </Head>
            <section>
                <Banner commonBannerCmsData={commonBannerCmsData} />
            </section>
            <section className='container mb-5 mt-3'>
                <div className='row'>
                    <UserSidebar />
                    <div className='col-12 col-lg-9'>
                        <div className='container mt-5'>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                                <div>
                                    <h1 className='fs-14 mb-0 fw-bold'>Current Orders</h1>
                                </div>
                                <div>
                                    {/* <div className="dropdown">
                                        <button className="btn bg-transparent border border-dark dropdown-toggle fs-12 px-2" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            <BiFilterAlt /><span className='align-middle ms-1'>All Orders</span>
                                        </button>
                                        <ul className="dropdown-menu fs-12" aria-labelledby="dropdownMenuButton1">
                                            <li><a className="dropdown-item" href="#">Action</a></li>
                                            <li><a className="dropdown-item" href="#">Another action</a></li>
                                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                                        </ul>
                                    </div> */}
                                </div>
                            </div>

                            {
                                !isLoading ?
                                    <div className="table-responsive">
                                        {
                                            (orders?.length) > 0 ?
                                                <table className="table">
                                                    <thead className='fs-12'>
                                                        <tr>
                                                            <th scope="col">Order</th>
                                                            <th scope="col">Customer</th>
                                                            <th scope="col">Type</th>
                                                            <th scope="col">Total Amount</th>
                                                            <th scope="col">Status</th>
                                                            <th scope="col" className='text-center'>Created At</th>
                                                            <th scope="col" className='text-center'>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='fs-12 align-middle'>
                                                        {
                                                            orders?.map((el, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <th scope="row">{el.orderNumber}</th>
                                                                        <td>{el?.customer?.name}</td>
                                                                        <td><button className='btn btn-dark my-auto px-2 py-1' style={{ fontSize: "9px" }}>{el?.pickup ? 'PICKUP' : el?.delivery ? 'DELIVERY' : 'N/A'}</button></td>
                                                                        <td className=''>${el.total}</td>
                                                                        <td>{showStatus(el?.status)}</td>
                                                                        <td className='text-center'>{formatDate(el?.createdAt)}</td>
                                                                        <td className="d-flex justify-content-center"><Link href={"/invoice/" + el?.orderNumber}><button className={`btn btn-dark d-flex justify-content-center align-items-center fs-10`}><BsEyeFill className='' /></button></Link></td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                                : 
                                                <div className='row mt-4' style={{ position: 'relative', margin: '0 auto' }}>
                                                    <div className="col-12" role="alert">
                                                        <p className='text-center fs-18 fw-bold'>No data found!</p>
                                                    </div>
                                                </div>
                                        }

                                    </div>

                                    :
                                    <>
                                        <Loader />
                                        <div className="d-flex p-2 justify-content-center">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden"></span>
                                            </div>
                                        </div>
                                    </>


                            }

                        </div>

                    </div>

                </div>

            </section>
        </div>




    )
}

export default Order