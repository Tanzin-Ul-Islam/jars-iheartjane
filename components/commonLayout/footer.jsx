import Link from 'next/link';
import siteInfo from '../../cms-data/siteCms';
import styles from './css/Footer.module.css';
import { FaFacebookF } from 'react-icons/fa';
import { BsInstagram } from 'react-icons/bs';
import { FaTiktok } from 'react-icons/fa';
import { BsYoutube } from 'react-icons/bs';
import { GoPlus } from 'react-icons/go';
import { BiMinus } from "react-icons/bi"

import { useRouter } from 'next/router';
import { useGetRetailerDataMutation } from '../../redux/api_core/apiCore';
import FooterCmsInterface from '../../interfaces/FooterInterface';
import Head from 'next/head';
import { Rating } from 'react-simple-star-rating';
import { postData } from '../../utils/FetchApi';
import api from '../../config/api.json';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { createToast } from '../../utils/toast'
import Swal from 'sweetalert2';
import parse from 'html-react-parser';
import { setAllRetailer, setRetailerType } from '../../redux/global_store/globalReducer';
import { toTitleCase, urlSlug } from "../../utils/helper";

export default function Footer() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { selectedRetailer, categories, token, cmsData, socialPackData } = useSelector(store => (store.globalStore));
    const [quickLink, setQuickLink] = useState(false);
    const [shop, setShop] = useState(false);
    const [discover, setDiscover] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState(true);
    const [initailStage, setSetInitailStage] = useState(true);

    const handleQuickLinksToggle = () => {
        setQuickLink(!quickLink);
        setDiscover(false);
        setShop(false);
    }
    const handleShopToggle = () => {

        setShop(!shop);
        setQuickLink(false);
        setDiscover(false);
    }
    const handleDiscoverToggle = () => {
        setDiscover(!discover);
        setQuickLink(false);
        setShop(false);
    }

    
    const Data = [
        {}, {}, {}
    ]

    
    const [rating, setRating] = useState(0)
    const handleRating = (rate) => {
        setRating(rate)

        // other logic
    }
    const onPointerEnter = () => console.log('Enter')
    const onPointerLeave = () => console.log('Leave')
    const onPointerMove = (value, index) => console.log(value, index)
    const tooltipArray = [
        "Very Poor",
        "Poor",
        "Good",
        "Better",
        "Excellent",
    ];

   


    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (rating > 0) {
            const response = await postData(api.feedback.feedbackCmsURL, { rating });

            if (response) {
                document.querySelector('#modalCloseBtn').click();
                createToast(response.data.message, 'success');
                setRating(0);
            }
        } else {
            createToast('Please select your rating!', 'error');
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setSetInitailStage(false)
        }, 2000);
    }, []);



    return (
        <>
            {/* <Head>
                <script src="https://kit.fontawesome.com/7f4933efb1.js" crossorigin="anonymous"></script>
            </Head> */}
            {!cmsData ? (
                <></>
            ) : (!initailStage &&
                <footer className="bd-footer bg-site-black border-top border-site-yellow-200 border-3">
                    <div className="container py-5 position-relative">
                        <span className={styles.ribbon} >
                            <span className={styles.ribbon_content}>
                                <svg className='mb-2' width="28" height="25" viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19.6667 24.3331H7.66667C5.66667 24.4665 3.8 23.7998 2.33333 22.4664C0.999999 20.9998 0.333332 19.1331 0.466665 17.2664V7.53312C0.333332 5.53312 0.999999 3.66645 2.33333 2.33312C3.8 0.999787 5.8 0.333118 7.66667 0.466452H19.6667C21.6667 0.333118 23.5333 0.999787 25 2.33312C26.3333 3.79979 27 5.66645 26.8667 7.66645H21.2667C20.0667 7.66645 18.8667 8.19979 17.9333 8.99979C17 9.79979 16.6 10.9998 16.6 12.1998C16.6 14.7331 18.7333 16.8665 21.4 16.8665H27V17.2664C27.1333 19.2664 26.4667 21.1331 25.1333 22.4664C23.5333 23.7998 21.6667 24.4665 19.6667 24.3331ZM6.6 5.53312C6.06667 5.53312 5.53333 5.93312 5.53333 6.46645C5.53333 6.99978 5.93333 7.53312 6.6 7.53312H14.0667C14.6 7.53312 15 7.13312 15 6.59978C15 6.06645 14.6 5.66645 14.0667 5.66645H6.6V5.53312ZM26.0667 14.8665H21.5333C20.2 14.8665 19.1333 14.0665 18.7333 12.7331C18.6 11.9331 18.7333 11.1331 19.2667 10.4665C19.8 9.79978 20.6 9.53312 21.4 9.53312H26.0667C26.6 9.53312 27 9.93312 27 10.4665V13.7998C27 14.3331 26.6 14.8665 26.0667 14.8665ZM21.5333 10.9998C21.2667 10.9998 21 11.1331 20.8667 11.2664C20.7333 11.3998 20.6 11.6664 20.6 11.9331C20.6 12.4664 21 12.9998 21.6667 12.9998H22.0667C22.6 12.9998 23 12.5998 23 12.0665C23 11.5331 22.6 11.1331 22.0667 11.1331H21.5333V10.9998Z"
                                        fill="#191A1A"
                                    />
                                </svg>
                            </span>
                        </span>
                        <div className="border-1 w-75 w-md-100" style={{ marginTop: '195px' }}>
                            <h3 className="ff-PowerGrotesk700 lh-10 fs-30 fs-md-15 fw-bold text-site-yellow-200 mt-5 text-center text-lg-start">
                                {cmsData?.subTitle}
                            </h3>
                            <h2 className="ff-PowerGrotesk700 fs-60 fs-md-30 text-site-white text-center text-lg-start">{cmsData?.title}</h2>
                            <p className="fw-md-bold w-75 fs-24 fs-md-14 text-site-white text-center text-lg-start mt-lg-3 mx-auto mx-md-0">{cmsData?.description}</p>
                            <div className="d-flex gap-3 justify-content-center justify-content-lg-start mt-lg-5">
                                {/* <button
                                    onClick={() => {
                                        router.push(cmsData?.buttonOneLink);
                                    }}
                                    className={`btn btn-outline-light px-4 py-1 rounded-pill fs-16 fs-md-12 ff-Soleil700 ${styles.learnMoreButton}`}>
                                    {cmsData?.buttonOneText}
                                </button> */}
                                <Link
                                    href={cmsData?.buttonOneLink || ""}
                                    className={`btn btn-outline-light px-4 py-1 rounded-pill fs-16 fs-md-12 ff-Soleil700 ${styles.learnMoreButton} d-flex justify-content-center align-items-center`}
                                >
                                    {cmsData?.buttonOneText}
                                </Link>
                                {/* <button
                                    onClick={() => {
                                        router.push(cmsData?.buttonTwoLink);
                                    }}
                                    className="btn btn-primary px-5 py-1 border-0 rounded-pill fs-16 fs-md-12 text-site-black ff-Soleil700"
                                    style={{ width: '205px', height: '46px', background: '#D9D29A' }}>
                                    {cmsData?.buttonTwoText}
                                </button> */}
                                <Link
                                    href={cmsData?.buttonTwoLink || ""}
                                    className="btn btn-primary px-5 py-1 border-0 rounded-pill fs-16 fs-md-12 text-site-black ff-Soleil700 d-flex justify-content-center align-items-center"
                                    style={{ width: '205px', height: '46px', background: '#D9D29A' }}
                                >
                                    {cmsData?.buttonTwoText}
                                </Link>
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: '100px' }}>
                            <div className="col-12 col-md-6 col-lg-2 mb-3 d-none d-lg-block">
                                <h5 className="ff-PowerGrotesk700 fs-24 fs-md-18 fw-bold mb-4" style={{ color: '#D9D29A' }}>
                                    {siteInfo.quick_links_main_text}
                                </h5>
                                <ul className="list-unstyled text-site-white fs-14">
                                    {/* {siteInfo.quick_links?.map((quick_links, index) => (
                                        <li className="mb-2" key={index}>
                                            <Link href={quick_links.link}>{quick_links.name}</Link>
                                        </li>
                                    ))} */}
                                    <li className="mb-3 hover-underline-animation">
                                        <Link href={'/about'}>About Us</Link>
                                    </li>
                                    <li className="mb-3">
                                        <Link href={'/career'} className='hover-underline-animation'>Careers</Link>
                                    </li>
                                    <li className="mb-3">
                                        <Link href={'/contact'} className='hover-underline-animation'>Contact Us</Link>
                                    </li>
                                    <li className="mb-3">
                                        <Link href={(token && token != 'undefined') ? '/user' : '/login'} className='hover-underline-animation'>My Account</Link>
                                    </li>
                                    <li className="mb-3">
                                        <div 
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasExampleLeft"
                                            aria-controls="offcanvasExampleLeft"
                                            className='hover-underline-animation cp'>
                                            Find a Dispensary
                                        </div>
                                    </li>
                                    <li className="mb-3">
                                        <Link href={'/faq'} className='hover-underline-animation'>FAQ</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3 mb-3 d-none d-lg-block">
                                <h5 className="ff-PowerGrotesk700 fs-24 fs-md-18 fw-bold mb-4" style={{ color: '#D9D29A' }}>
                                    {siteInfo.shops_main_text}
                                </h5>
                                <div className="d-flex gap-5">
                                    <div className="row text-site-white fs-14">
                                        {categories?.length > 0 ?
                                            categories?.map((shop, index) => (
                                                <div className="col-6" key={index}>
                                                    <li className="list-unstyled mb-3">
                                                        <Link className='hover-underline-animation'
                                                            href={`/category/${urlSlug(shop.categoryName)}`}>
                                                            {toTitleCase(shop.categoryName)}
                                                        </Link>
                                                    </li>
                                                </div>
                                            )) : null}
                                    </div>
                                    {/* <ul className="list-unstyled text-site-white fs-14">
                            {siteInfo.shops?.map((shops)=>(
                                <li className="mb-2"><a href={shops.link}>{shops.name}</a></li>
                            ))}
                        </ul> */}
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-2 mb-3 d-none d-lg-block">
                                <h5 className="ff-PowerGrotesk700 fs-24 fs-md-18 fw-bold mb-4" style={{ color: '#D9D29A' }}>
                                    {siteInfo.discovers_main_text}
                                </h5>
                                <ul className="list-unstyled text-site-white fs-14">
                                    {siteInfo.discover?.map((discover, index) => (
                                        <li className="mb-3" key={index}>
                                            <Link href={discover.link || ""} className='hover-underline-animation'>{discover.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-lg-5 col-md-6 text-start text-lg-end">
                                <div className="text-site-white">
                                    <h2 className="ff-PowerGrotesk700 fs-48 fs-md-36 lh-45 lh-md-34 fw-bold text-center text-lg-end">{parse(`${cmsData?.sectionTwoTitle}`)}</h2>
                                    <p className='text-center text-lg-end mb-4 fs-14'>{cmsData?.sectionTwoSubTitle}</p>
                                    <div className='d-flex justify-content-center justify-content-lg-end'>
                                        <button
                                            data-bs-toggle="modal" data-bs-target="#exampleModal4"
                                            className="btn btn-primary rounded-pill fs-14 fs-md-12 text-site-black border-0 fw-bold ff-Soleil700"
                                            style={{ background: '#D9D29A', width: '200px', height: '40px' }}>
                                            {cmsData?.sectionTwoButtonText}
                                        </button>
                                    </div>

                                    <div className="modal fade" id="exampleModal4" tabIndex={-1} aria-labelledby="exampleModalLabel4" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title text-black" id="exampleModalLabel4">Feedback</h5>
                                                    <button type="button" id="modalCloseBtn" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <div>
                                                        <h2 className='text-black text-center fs-18 fw-bold'>Your feedback matters!</h2>
                                                        <p className='text-black text-center'>Help us improve the JARS website.</p>
                                                    </div>
                                                    <div className='text-center my-4'>
                                                        <Rating
                                                            size={40}
                                                            onClick={handleRating}
                                                            onPointerEnter={onPointerEnter}
                                                            onPointerLeave={onPointerLeave}
                                                            onPointerMove={onPointerMove}
                                                            showTooltip
                                                            tooltipArray={tooltipArray}
                                                        /* Available Props */
                                                        />
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-outline-dark ff-Soleil400 text-uppercase rounded-pill px-3" data-bs-dismiss="modal">Close</button>
                                                    <button onClick={handleFeedbackSubmit} type="button" className="btn btn-dark ff-Soleil400 text-uppercase rounded-pill px-3">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='d-block d-lg-none mt-4'>
                                <div className={`mb-2 ${styles.footer_box_border}`}>
                                    <button className="w-100 py-1 border-0 bg-transparent text-site-yellow-200" onClick={handleQuickLinksToggle}>
                                        <div className='d-flex justify-content-between mx-2'>
                                            {
                                                quickLink == false ?
                                                    <p className='my-auto'>Quick Links</p>
                                                    :
                                                    <p className='flex-grow-1 my-auto ms-3'>Quick Links</p>
                                            }
                                            {quickLink == false ?
                                                <GoPlus className='my-auto' />
                                                :
                                                <BiMinus className="my-auto" />
                                            }
                                        </div>
                                    </button>

                                    {quickLink &&
                                        <div className='text-center'>
                                            <ul className="list-unstyled text-site-white fs-14 mt-2">
                                                {siteInfo.quick_links?.map((quick_links, index) => (
                                                    <li className="mb-3" key={index}>
                                                        {quick_links?.id === 5 ?
                                                            <div
                                                                data-bs-toggle="offcanvas"
                                                                data-bs-target="#offcanvasExampleLeft"
                                                                aria-controls="offcanvasExampleLeft"
                                                                className='cp'
                                                            >
                                                                {quick_links.name}
                                                            </div>
                                                            :
                                                            <Link href={quick_links.link || ""}>{quick_links.name}</Link>
                                                        }

                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    }

                                </div>
                                <div className={`mb-2 ${styles.footer_box_border}`}>
                                    <button className={`w-100 py-1 border-0 bg-transparent text-site-yellow-200 ${styles.footer_button_transition}`} onClick={handleShopToggle}>
                                        <div className='d-flex justify-content-between mx-2'>
                                            {
                                                shop == false ?
                                                    <p className='my-auto'>Shop</p>
                                                    :
                                                    <p className='flex-grow-1 my-auto ms-3'>Shop</p>
                                            }
                                            {shop == false ?
                                                <GoPlus className='my-auto' />
                                                :
                                                <BiMinus className="my-auto" />
                                            }
                                        </div>
                                    </button>
                                    {shop &&
                                        <div className='text-center'>
                                            <div className="text-site-white fs-14 mt-2">
                                                {categories?.length > 0 ?
                                                    categories?.map((shop, index) => (
                                                        <div className="" key={index}>
                                                            <li className="list-unstyled mb-3">
                                                                <Link href={`/category/${urlSlug(shop.categoryName)}`}>{toTitleCase(shop.categoryName)}</Link>
                                                            </li>
                                                        </div>
                                                    )) : null}
                                            </div>
                                        </div>}
                                </div>
                                <div className={`mb-2 ${styles.footer_box_border}`}>
                                    <button className="w-100 py-1 border-0 bg-transparent text-site-yellow-200" onClick={handleDiscoverToggle} style={{ color: "#D9D29A" }}>
                                        <div className='d-flex justify-content-between mx-2'>
                                            {
                                                discover == false ?
                                                    <p className='my-auto'>Discover</p>
                                                    :
                                                    <p className='flex-grow-1 my-auto ms-3'>Discover</p>
                                            }
                                            {discover == false ?
                                                <GoPlus className='my-auto' />
                                                :
                                                <BiMinus className="my-auto" />
                                            }
                                        </div>
                                    </button>
                                    {discover &&
                                        <div className='text-center'>
                                            <div className='ms-1'>
                                                <ul className="list-unstyled text-site-white fs-14 mt-2">
                                                    {siteInfo.discover?.map((discover, index) => (
                                                        <li className="mb-3" key={index}>
                                                            <Link href={discover.link || ""}>{discover.name}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="d-flex justify-content-center justify-content-lg-end mt-3 mt-lg-0 gap-4 text-site-white">
                                {/* <a href="" target="_blank"><FaFacebookF className="fs-5" /></a>
                                    <a href="" target="_blank"><BsInstagram className="fs-5" /></a>
                                    <a href="" target="_blank"> <FaTiktok className="fs-5" /></a>
                                    <a href="" target="_blank"><BsYoutube className="fs-5" /></a> */}

                                {socialPackData &&
                                    socialPackData?.map((el, index) => {
                                        return (
                                            <Link href={el.link || ""} target="_blank" key={index}>
                                                <i className={`${el.className} fa-lg fs-5`}></i>
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>

                        <div className="d-flex flex-column flex-md-row justify-content-md-between mt-2 mt-md-5 text-site-white">
                            <div className="order-1 order-md-2 d-flex justify-content-center">
                                <p className="fs-12 ff-Soleil400">
                                    <span className='px-2'>
                                        <Link href="/terms-policy">Terms of Service</Link>
                                    </span>
                                    |
                                    <span className='px-2'>
                                        <Link href="/privacy-policy">Privacy Policy</Link>
                                    </span>
                                    |
                                    <span className='px-2'>
                                        <Link href="/cookies-settings">Cookies Settings</Link>
                                    </span>
                                </p>
                            </div>
                            <div className="order-2 order-md-1 d-flex justify-content-center">
                                <p className='fs-12 ff-Soleil400'>{cmsData?.copyrightText}</p>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </>
    );
}
