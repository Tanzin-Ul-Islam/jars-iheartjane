import Styles from "../components/homePage/css/Home.module.css";
import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsArrowRightShort, BsInstagram, BsTelephone, BsYoutube } from "react-icons/bs";
import Link from "next/link";
import Banner from "../components/Banner";
import { FaFacebookF, FaTiktok } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineChat } from "react-icons/hi";
import Slider_one from "../components/SliderOne";
import { useRouter } from "next/router";
import homeInfo from "../cms-data/homeCms";
import { useGetAboutPageCmsQuery, useGetHomeCmsQuery } from "../redux/api_core/apiCore";
import AboutCmsInterface from "../interfaces/AboutInterface";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { setSiteLoader } from "../redux/global_store/globalReducer";
// import styles from "react-loading-overlay-ts/dist/styles";
import Script from "next/script";
import HeaderTitles from "../components/HeaderTitles";
import Slider_two from "../components/SliderTwo";
import Skeleton from "react-loading-skeleton";
import Loader from "../components/Loader";

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className="next"
            onClick={onClick}
        >
            <FiChevronRight />
        </div>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className="previous"
            onClick={onClick}
        >
            <FiChevronLeft />
        </div>
    );
}

export default function About() {
    const { pageMeta } = useSelector((store) => store.globalStore);
    let dispatch = useDispatch();


    const { data, isSuccess, isFetching, error } = useGetAboutPageCmsQuery();

    let cmsData = data?.data?.cmsData[0];
    let commonBannerCmsData = data?.data?.commonBannerCmsData[0];
    let dropBannerCmsData = data?.data?.dropBannerCmsData[0];
    let homeSectionThreeCmsData = data?.data?.homeSectionThreeCmsData[0];
    let sectionTwoData = data?.data?.sectionTwoData;
    let socialData = data?.data?.socialPackData;

    const homeCMS = useGetHomeCmsQuery();

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

    const router = useRouter()
    return (
        <>
            <HeaderTitles title={'aboutUsPageTitle'} />
            {
                data?.data?.cmsData?.length > 0 && isSuccess ?
                    <>
                        <Head>
                            <>
                                <Script src="https://kit.fontawesome.com/7f4933efb1.js" strategy="beforeInteractive" crossOrigin="anonymous" />
                                <meta
                                    name="description"
                                    content={pageMeta?.aboutUsPageMetaDescription}
                                />
                                <meta
                                    name="keywords"
                                    content={pageMeta?.aboutUsPageMetaKeyword}
                                />
                            </>
                        </Head>
                        <section>
                            <Banner commonBannerCmsData={commonBannerCmsData} />
                        </section>
                        <div className="">
                            <section className="py-5">
                                <div className="container">
                                    <div className="d-flex gap-5 gap-md-0 flex-column flex-md-row">
                                        <div className="w-100">
                                            <p className="fs-14 ff-Soleil400 mb-0">{cmsData?.title}</p>
                                            <h2 className="ff-Soleil700 fs-36">
                                                {cmsData?.subTitle}
                                            </h2>
                                            <p className="mb-4">{cmsData?.description}</p>
                                            <ul className="list-unstyled mb-4">
                                                <li className="d-flex gap-3 align-items-center mb-3">
                                                    <div className="social_Icon">
                                                        <HiOutlineLocationMarker />
                                                    </div>
                                                    <div className="social_details">{cmsData?.address}</div>
                                                </li>
                                                <li className="d-flex gap-3 align-items-center mb-3">
                                                    <div className="social_Icon">
                                                        <BsTelephone />
                                                    </div>
                                                    <Link className="social_details" href={`tel:${cmsData?.contactNumber}`}>
                                                        {cmsData?.contactNumber}
                                                    </Link>
                                                    {/* <div className="social_details cp">{cmsData?.contactNumber}</div> */}
                                                </li>
                                                <li className="d-flex gap-3 align-items-center mb-3">
                                                    <div className="social_Icon">
                                                        <HiOutlineChat />
                                                    </div>
                                                    <Link className="social_details" href={`mailto:${cmsData?.email}`}>
                                                        {cmsData?.email}
                                                    </Link>
                                                    {/* <div className="social_details cp">{cmsData?.email}</div> */}
                                                </li>
                                            </ul>
                                            <div className="d-flex justify-content-start gap-4 text-site-black bg-black">
                                                {
                                                    socialData && socialData.map((el, index) => {
                                                        return (
                                                            <Link href={el?.link ? el?.link : ''} target="_blank" key={index}><i className={`${el?.className} fa-lg`}></i></Link>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="w-100">
                                            <div className="row gy-3">
                                                <div className="col-12 col-sm-6">
                                                    <picture>
                                                        <img src={cmsData?.imageOne} className={Styles.image_one} />
                                                    </picture>
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <picture>
                                                        <img src={cmsData?.imageTwo} className={`mb-3 mb-lg-2 ${Styles.image_two}`} />
                                                    </picture>
                                                    <picture>
                                                        <img src={cmsData?.imageThree} className={Styles.image_two} />
                                                    </picture>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="py-5 bg-site-gray">
                                <div className="container" style={{ width: "60vw" }}>
                                    <h2 className="ff-Soleil400 fw-bold fs-36 text-site-black text-center mb-4">{cmsData?.sectionTwoTitle}</h2>
                                    <div className="row row-cols-1 row-cols-sm-3 row-cols-md-3 gy-3">
                                        {
                                            sectionTwoData && sectionTwoData.map((el, index) => {
                                                return (
                                                    <div className="col" key={index}>
                                                        <div className="h-100">
                                                            <picture>
                                                                <img src={el.image} />
                                                            </picture>
                                                            <h3 className="my-3 ff-Soleil700 fs-16">{el.title}</h3>
                                                            <p className="ff-Soleil400 fs-15 mb-0">{el.description}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </section>
                            <section className="py-5">
                                <Slider_one sectionTwoCmsData={homeCMS?.data?.data?.sectionTwoCmsData[0]} />
                            </section>
                            <section className="py-5">
                                <div className="container">
                                    <div className="container rowmx-auto position-relative" style={{ background: '#C4C4D9' }} >
                                        <div className={`${Styles.custom_banner}`}>
                                            <img src={homeSectionThreeCmsData?.image} />
                                        </div>
                                        <div className="my-auto">
                                            <div className="ms-5 d-flex flex-column flex-lg-row justify-content-around py-3">
                                                <div className="bg-transparent my-auto">
                                                    <div className={`ms-5 mx-lg-5 my-auto ${Styles.custom_banner_text_section}`}>
                                                        <h3 className="fw-bold fs-24 fs-md-18 ff-PowerGrotesk700 mb-4">{homeSectionThreeCmsData?.title}</h3>
                                                        <p dangerouslySetInnerHTML={{ __html: homeSectionThreeCmsData?.subTitle }}></p>
                                                        {/* <p className="mt-2 mt-lg-4 fs-16 fs-md-12">{homeSectionThreeCmsData?.subTitle}</p> */}
                                                    </div>
                                                </div>
                                                <div className="bg-transparent my-auto ms-5 ms-lg-0">
                                                    <Link href={homeSectionThreeCmsData?.buttonLink ? homeSectionThreeCmsData?.buttonLink : ''}  className='btn btn-dark px-4 px-lg-5 py-2 border-0 rounded-pill fs-16 fs-md-12 text-site-white'>{homeSectionThreeCmsData?.buttonText}</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* New Drops Banner */}
                            <section className="py-4">
                                <Slider_two />
                            </section>
                        </div>
                        {/* New Drops Slider */}
                    </>
                    :
                    <>
                        <Loader />
                        <section>
                            <div className="container-xxl px-0">
                                <Skeleton style={{ width: '100%', height: '130px' }} />
                            </div>
                        </section>
                        <div className="">
                            <section className="py-5">
                                <div className="container">
                                    <div className="d-flex gap-5 gap-md-0 flex-column flex-md-row">
                                        <div className="w-100">
                                            <p className="fs-14 ff-Soleil400 mb-0">
                                                <Skeleton style={{ width: '70%', height: '20px' }} />
                                            </p>
                                            <h3 className="ff-Soleil700 fs-36 mt-2">
                                                <Skeleton style={{ width: '90%', height: '60px' }} />
                                            </h3>
                                            <p className="mb-4">
                                                <Skeleton style={{ width: '90%', height: '100px' }} />
                                            </p>
                                            <ul className="list-unstyled mb-4">
                                                <li className="d-flex gap-3 align-items-center mb-3">
                                                    <Skeleton style={{ width: '40px', height: '40px' }} circle={true} />
                                                    <div className="social_details">
                                                        <Skeleton style={{ width: '50%', height: '30px' }} />
                                                    </div>
                                                </li>
                                                <li className="d-flex gap-3 align-items-center mb-3">
                                                    <Skeleton style={{ width: '40px', height: '40px' }} circle={true} />
                                                    <div className="social_details">
                                                        <Skeleton style={{ width: '30%', height: '30px' }} />
                                                    </div>
                                                </li>
                                                <li className="d-flex gap-3 align-items-center mb-3">
                                                    <Skeleton style={{ width: '40px', height: '40px' }} circle={true} />
                                                    <div className="social_details">
                                                        <Skeleton style={{ width: '40%', height: '30px' }} />
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="d-flex justify-content-start gap-4 text-site-black">
                                                <Skeleton style={{ width: '60%', height: '40px' }} />
                                            </div>
                                        </div>
                                        <div className="w-100">
                                            <div className="row gy-3">
                                                <div className="col-12 col-sm-6">
                                                    <Skeleton style={{ width: '100%', height: '385px' }} />
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <Skeleton style={{ width: '100%', height: '190px' }} />
                                                    <Skeleton style={{ width: '100%', height: '190px' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="py-5 bg-site-gray">
                                <div className="container" style={{ width: "60vw" }}>
                                    <h3 className="ff-Soleil400 fw-bold fs-36 text-site-black text-center mb-4">
                                        <Skeleton style={{ width: '300px', height: '40px' }} />
                                    </h3>
                                    <div className="row row-cols-1 row-cols-sm-3 row-cols-md-3 gy-3">
                                        <div className="col">
                                            <div className="h-100">
                                                <Skeleton style={{ width: '60px', height: '60px' }} circle={true} />
                                                <h3 className="my-3 ff-Soleil700 fs-16"><Skeleton style={{ width: '100%', height: '20px' }} /></h3>
                                                <p className="ff-Soleil400 fs-15 mb-0"><Skeleton style={{ width: '100%', height: '120px' }} /></p>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="h-100">
                                                <Skeleton style={{ width: '60px', height: '60px' }} circle={true} />
                                                <h3 className="my-3 ff-Soleil700 fs-16"><Skeleton style={{ width: '100%', height: '20px' }} /></h3>
                                                <p className="ff-Soleil400 fs-15 mb-0"><Skeleton style={{ width: '100%', height: '120px' }} /></p>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="h-100">
                                                <Skeleton style={{ width: '60px', height: '60px' }} circle={true} />
                                                <h3 className="my-3 ff-Soleil700 fs-16"><Skeleton style={{ width: '100%', height: '20px' }} /></h3>
                                                <p className="ff-Soleil400 fs-15 mb-0"><Skeleton style={{ width: '100%', height: '120px' }} /></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="py-5">
                                <div>
                                    <div className="container">
                                        <div className="row gy-4">
                                            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                <Skeleton width="100%" height="466px" />
                                            </div>
                                            <div className="col-12 col-sm-6 col-md-8 col-lg-9" style={{ position: "relative" }}>
                                                <div className="row">
                                                    <div className="col-12 col-md-4 col-lg-4">
                                                        <Skeleton width="100%" height="466px" />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-lg-4">
                                                        <Skeleton width="100%" height="466px" />
                                                    </div>
                                                    <div className="col-12 col-md-4 col-lg-4">
                                                        <Skeleton width="100%" height="466px" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="py-4 mb-5">
                                <div className="container">
                                    <Skeleton width="100%" height="100px" />
                                </div>
                            </section>
                            {/* New Drops Banner */}
                            <section className="mt-4 mb-5">
                                <section data-aos="fade-right"
                                    data-aos-delay="200" className={`container text-site-white`}>
                                    <Skeleton width="100%" height="200px" />
                                </section>
                                <div className="container mt-4">
                                    <div className="row">
                                        <div className="col-4">
                                            <Skeleton width="100%" height="350px" />
                                        </div>
                                        <div className="col-4">
                                            <Skeleton width="100%" height="350px" />
                                        </div>
                                        <div className="col-4">
                                            <Skeleton width="100%" height="350px" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        {/* New Drops Slider */}
                    </>
            }
        </>


    )
}
