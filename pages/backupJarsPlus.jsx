import styles from "/styles/jarsPlus.module.css"
// import { useGetFaqPageCmsQuery, useGetJarsSectionOneCmsQuery, useGetJarsSectionThreeCmsQuery, useGetJarsSectionTwoBottomCmsQuery, useGetJarsSectionTwoTopCmsQuery } from "../redux/api_core/apiCore";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import { useEffect, useRef, useState } from "react";
import HeaderTitles from "../components/HeaderTitles";
import { fetchData } from '../utils/FetchApi';
import api from "../config/api.json";
import ReactPlayer from 'react-player/lazy'
import Head from "next/head";
import { useSelector } from "react-redux";
import Link from 'next/link';
import Loader from "../components/Loader";

export default function JarsPlus() {
    // useGetFaqPageCmsQuery useGetJarsSectionOneCmsQuery useGetJarsSectionTwoTopCmsQuery useGetJarsSectionTwoBottomCmsQuery
    // useGetJarsSectionThreeCmsQuery


    // const { data, isSuccess, isFetching, error } = useGetFaqPageCmsQuery();
    // const sectionOne = useGetJarsSectionOneCmsQuery();
    // const sectionTwoTop = useGetJarsSectionTwoTopCmsQuery();
    // const sectionTwoBottom = useGetJarsSectionTwoBottomCmsQuery();
    // const sectionThree = useGetJarsSectionThreeCmsQuery();
    // let cmsData = data?.data?.cmsData[0];
    // let faqData = data?.data?.faqData;

    // video player
    // const videoRef = useRef(null)
    // useEffect(() => { videoRef.current.play(); }, []);
    // const [isPlaying, setIsPlaying] = useState(false)
    // const handlePlayPause = async () => {
    //     const video = videoRef.current

    //     if (isPlaying) {
    //         await video.pause()
    //         setIsPlaying(false)
    //     } else {
    //         await video.play()
    //         setIsPlaying(true)
    //     }
    // }
    const router = useRouter();
    const { pageMeta } = useSelector((store) => store.globalStore);
    const [cmsData, setCmsData] = useState({
        faqCms: {
            cmsData: {
                subTitle: '',
                buttonText: '',
                butttonLink: ''
            },
            faqData: []
        },
        sectionOne: {
            backgroundImage: '',
            title: '',
            subTitle: '',
            description: '',
            buttonLink: '',
            buttonText: ''
        },
        sectionTwoTop: {
            description: '',
            buttonLink: '',
            buttonText: ''
        },
        sectionTwoBottom: {
            title: '',
            countOne: 0,
            countOneTitle: '',
            countOneDescription: '',
            countTwo: 0,
            countTwoTitle: '',
            countTwoDescription: '',
            countThree: 0,
            countThreeTitle: '',
            countThreeDescription: ''
        },
        sectionThree: {
            title: '',
            imageOne: '',
            titleOne: '',
            descriptionOne: '',
            imageTwo: '',
            titleTwo: '',
            descriptionTwo: '',
            imageThree: '',
            titleThree: '',
            descriptionThree: '',
        },
        isLoading: true
    });
    const [isPlaying, setIsPlaying] = useState(true);

    const getCms = async () => {
        const faqCms = await fetchData(api.faq.faqCmsURL);
        if (faqCms?.data) {
            const sectionOne = await fetchData(api.jarsplus.jarsSectionOneCmsURL);
            if (sectionOne?.data) {
                const sectionTwoTop = await fetchData(api.jarsplus.jarsSectionTwoTopCmsURL);
                if (sectionTwoTop?.data) {
                    const sectionTwoBottom = await fetchData(api.jarsplus.jarsSectionTwoBottomCmsURL);
                    if (sectionTwoBottom?.data) {
                        const sectionThree = await fetchData(api.jarsplus.jarsSectionThreeCmsURL);
                        if (sectionThree?.data) {
                            setCmsData({
                                faqCms: {
                                    cmsData: faqCms?.data?.cmsData?.[0],
                                    faqData: faqCms?.data?.faqData
                                },
                                sectionOne: sectionOne?.data?.[0],
                                sectionTwoTop: sectionTwoTop?.data?.[0],
                                sectionTwoBottom: sectionTwoBottom?.data?.[0],
                                sectionThree: sectionThree?.data?.[0],
                                isLoading: false
                                // isLoading: true
                            });
                        }
                    }
                }
            }
        }
    }

    useEffect(() => {
        getCms();
    }, [])

    return (
        <>
            <HeaderTitles title={'jarsPlusPageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.jarsPlusPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.jarsPlusPageMetaKeyword}
                />
            </Head>
            {cmsData?.isLoading ?
                <>
                    <Loader />
                    <div className="main-body">
                        <section className={styles.jarPlusSection}>
                            <div className="container">
                                <h2 className="mb-2">
                                    <Skeleton className="w-25 w-md-70" style={{ height: "40px" }} />
                                </h2>
                                <h2 className="mb-2">
                                    <Skeleton className="w-50 w-md-80" style={{ height: "65px" }} />
                                </h2>
                                <p className="mb-2">
                                    <Skeleton className="w-45 w-md-100" style={{ height: "70px" }} />
                                </p>
                                <div className="mt-5">
                                    <Skeleton className="w-15 w-md-45" style={{ height: "40px", borderRadius: "25px" }} />
                                </div>
                            </div>
                        </section>
                        {/* <section className={styles.jarPlusVideoSection}>
                            <div className="container">
                                <div className="w-80 w-sm-100 mx-auto text-center mb-4">
                                    <p className="mb-4">
                                        <Skeleton className="w-100" style={{ height: "105px" }} />
                                    </p>
                                    <div
                                        className="px-5">
                                        <Skeleton className="w-20 w-md-50" style={{ height: "50px", borderRadius: "15px" }} />
                                    </div>
                                </div>
                                
                                <div className="mb-5">
                                    <Skeleton className="w-100" style={{ height: "680px" }} />
                                </div>
                                <div>
                                    <h2 className="ff-powerGrotesk700 text-site-black fs-60 fs-md-48 fs-xs-40 lh-70 lh-md-58 lh-xs-50 mb-5 text-center">
                                        <Skeleton className="w-40 w-md-70" style={{ height: "100px" }} />
                                    </h2>
                                    <div className="row g-5 row-cols-1 row-cols-sm-2 row-cols-lg-3">
                                        <div className="col">
                                            <div className="card border-0 h-100 text-center bg-transparent">
                                                <h2 className="ff-powerGrotesk700 fs-190 text-site-blue-100 mb-0">
                                                    <Skeleton className="w-40" style={{ height: "170px" }} />
                                                </h2>
                                                <div>
                                                    <div className="fs-20 ff-powerGrotesk700 text-site-black">
                                                        <Skeleton className="w-40" style={{ height: "35px" }} />
                                                    </div>
                                                    <p className="fs-20 lh-28 lh-md-28 lh-xs-28 text-site-black mt-2">
                                                        <Skeleton className="w-100" style={{ height: "80px" }} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="card border-0 h-100 text-center bg-transparent">
                                                <h2 className="ff-powerGrotesk700 fs-190 text-site-blue-100 mb-0">
                                                    <Skeleton className="w-40" style={{ height: "170px" }} />
                                                </h2>
                                                <div>
                                                    <div className="fs-20 ff-powerGrotesk700 text-site-black">
                                                        <Skeleton className="w-40" style={{ height: "35px" }} />
                                                    </div>
                                                    <p className="fs-20 lh-28 lh-md-28 lh-xs-28 text-site-black mt-2">
                                                        <Skeleton className="w-100" style={{ height: "80px" }} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="card border-0 h-100 text-center bg-transparent">
                                                <h2 className="ff-powerGrotesk700 fs-190 text-site-blue-100 mb-0">
                                                    <Skeleton className="w-40" style={{ height: "170px" }} />
                                                </h2>
                                                <div>
                                                    <div className="fs-20 ff-powerGrotesk700 text-site-black">
                                                        <Skeleton className="w-40" style={{ height: "35px" }} />
                                                    </div>
                                                    <p className="fs-20 lh-28 lh-md-28 lh-xs-28 text-site-black mt-2">
                                                        <Skeleton className="w-100" style={{ height: "80px" }} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section> */}
                    </div>
                </>
                :
                <div className="main-body">
                    <section className={styles.jarPlusSection}
                        style={{ backgroundImage: `url(${cmsData?.sectionOne?.backgroundImage})` }}>
                        <div className="container">
                            <h2 className="ff-powerGrotesk800 text-site-yellow-200 fs-30 fs-md-24 fs-xs-20 lh-36 lh-md-30 lh-xs-26 mb-0">
                                {cmsData?.sectionOne?.title}
                            </h2>
                            <h1 className="ff-powerGrotesk700 text-site-white fs-60 fs-md-48 fs-xs-40 lh-70 lh-md-58 lh-xs-50 mb-3">
                                {cmsData?.sectionOne?.subTitle}
                            </h1>
                            <p className="text-site-white ff-Soleil400 fs-24 fs-md-20 fs-xs-16 lh-36 lh-md-32 lh-xs-28 mb-0"
                                style={{ width: '597.12px' }}>
                                {cmsData?.sectionOne?.description}
                            </p>
                            <Link
                                href={`${cmsData?.sectionOne?.buttonLink}`}
                                className="btn text-site-black border-site-black bg-site-yellow-200 ff-Soleil700 fs-16 px-5 rounded-pill mt-5"
                            >
                                {cmsData?.sectionOne?.buttonText}
                            </Link>
                        </div>
                    </section>
                    <section className={styles.jarPlusVideoSection}>
                        <div className="container">
                            {/* <div className="w-80 w-sm-100 mx-auto text-center mb-4">
                                <p className="text-site-black ff-Soleil400 fs-24 fs-md-20 fs-xs-16 lh-24 lh-md-24 lh-xs-24 mb-4">
                                    {cmsData?.sectionTwoTop?.description}
                                </p>
                                <Link
                                    href={`${cmsData?.sectionTwoTop?.buttonLink}`}
                                    className="btn bg-site-black border-site-black text-site-yellow-200 ff-Soleil700 fs-16 px-5 rounded-pill"
                                >
                                    {cmsData?.sectionTwoTop?.buttonText}
                                </Link>
                            </div>
                            <div className="ratio ratio-16x9 mb-5"
                                onClick={() => setIsPlaying(!isPlaying)}>
                                <ReactPlayer
                                    className="w-100 h-100 cp"
                                    url={cmsData?.sectionTwoTop?.video} // vido url
                                    // controls={true} // play pause button, time show
                                    loop={true} // play loop
                                    muted={true} // video muted
                                    playsinline={true} // for all device support
                                    playing={isPlaying}  // play or pause
                                />
                            </div> */}
                            <div>
                                <h2 className="ff-powerGrotesk700 text-site-black fs-60 fs-md-48 fs-xs-40 lh-70 lh-md-58 lh-xs-50 mb-5 text-center">
                                    {cmsData?.sectionTwoBottom?.title} 
                                </h2>
                                <div className="row g-5 row-cols-1 row-cols-sm-2 row-cols-lg-3">
                                    <div className="col">
                                        <div className="card border-0 h-100 text-center bg-transparent">
                                            <h2 className="ff-powerGrotesk700 fs-190 text-site-blue-100 mb-0">
                                                {cmsData?.sectionTwoBottom?.countOne}
                                            </h2>
                                            <div>
                                                <span className="fs-20 ff-powerGrotesk700 text-site-black">
                                                    {cmsData?.sectionTwoBottom?.countOneTitle}
                                                </span>
                                                <p className="fs-20 lh-28 lh-md-28 lh-xs-28 text-site-black">
                                                    {cmsData?.sectionTwoBottom?.countOneDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card border-0 h-100 text-center bg-transparent">
                                            <h2 className="ff-powerGrotesk700 fs-190 text-site-blue-100 mb-0">
                                                {cmsData?.sectionTwoBottom?.countTwo}
                                            </h2>
                                            <div>
                                                <span className="fs-20 ff-powerGrotesk700 text-site-black">
                                                    {cmsData?.sectionTwoBottom?.countTwoTitle}
                                                </span>
                                                <p className="fs-20 lh-28 lh-md-28 lh-xs-28 text-site-black">
                                                    {cmsData?.sectionTwoBottom?.countTwoDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card border-0 h-100 text-center bg-transparent">
                                            <h2 className="ff-powerGrotesk700 fs-190 text-site-blue-100 mb-0">
                                                {cmsData?.sectionTwoBottom?.countThree}
                                            </h2>
                                            <div>
                                                <span className="fs-20 ff-powerGrotesk700 text-site-black">
                                                    {cmsData?.sectionTwoBottom?.countThreeTitle}
                                                </span>
                                                <p className="fs-20 lh-28 lh-md-28 lh-xs-28 text-site-black">
                                                    {cmsData?.sectionTwoBottom?.countThreeDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className={styles.ENJOYEXCLUSIVEPERKSSection}>
                        <div className="container">
                            <div className={styles.pb100}>
                                <h2 className="ff-powerGrotesk700 text-site-black fs-60 fs-md-48 fs-xs-40 lh-70 lh-md-58 lh-xs-50 mb-5 text-center">
                                    {cmsData?.sectionThree?.title}
                                </h2>
                                <div className="row g-5 row-cols-1 row-cols-sm-2 row-cols-lg-3">
                                    <div className="col">
                                        <div className="card border-0 h-100 text-center bg-transparent">
                                            <div className={styles.ENJOYEXCLUSIVEPERKSSectionImageBox}>
                                                <picture>
                                                    <img src={cmsData?.sectionThree?.imageOne} alt={''} />
                                                </picture>
                                            </div>
                                            <div>
                                                <span className="fs-20 ff-powerGrotesk700 text-site-black cp">
                                                    {cmsData?.sectionThree?.titleOne}
                                                </span>
                                                <p className="fs-16 lh-28 lh-md-28 lh-xs-28 text-site-black">
                                                    {cmsData?.sectionThree?.descriptionOne}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card border-0 h-100 text-center bg-transparent">
                                            <div className={styles.ENJOYEXCLUSIVEPERKSSectionImageBox}>
                                                <picture>
                                                    <img src={cmsData?.sectionThree?.imageTwo} alt={''} />
                                                </picture>
                                            </div>
                                            <div>
                                                <span className="fs-20 ff-powerGrotesk700 text-site-black cp">
                                                    {cmsData?.sectionThree?.titleTwo}
                                                </span>
                                                <p className="fs-16 lh-28 lh-md-28 lh-xs-28 text-site-black">
                                                    {cmsData?.sectionThree?.descriptionTwo}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card border-0 h-100 text-center bg-transparent">
                                            <div className={styles.ENJOYEXCLUSIVEPERKSSectionImageBox}>
                                                <picture>
                                                    <img src={cmsData?.sectionThree?.imageThree} alt={''} />
                                                </picture>
                                            </div>
                                            <div>
                                                <span className="fs-20 ff-powerGrotesk700 text-site-black cp">
                                                    {cmsData?.sectionThree?.titleThree}
                                                </span>
                                                <p className="fs-16 lh-28 lh-md-28 lh-xs-28 text-site-black">
                                                    {cmsData?.sectionThree?.descriptionThree}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="m-0 border-site-black" />
                        </div>
                    </section>
                    <section className={styles.faqSection}>
                        <div className="container">
                            <div className="w-80 w-sm-100 mx-auto text-center mb-4">
                                <h2 className="ff-powerGrotesk700 text-site-black fs-60 fs-md-48 fs-xs-40 lh-70 lh-md-58 lh-xs-50 mb-4 text-center">{cmsData?.title}</h2>
                                <p className="text-site-black ff-Soleil400 fs-20 fs-md-18 fs-xs-16 lh-30 lh-md-28 lh-xs-20 mb-4">
                                    {cmsData?.faqCms?.cmsData?.subTitle}
                                </p>
                            </div>
                            <div className="accordion mt-5" id="accordion">
                                {cmsData?.faqCms?.faqData?.map((faq, index) => (
                                    <div className="accordion-item round-0 mb-4 border-0 bg-transparent" key={index}>
                                        <h2 className="accordion-header round-0" id={"headingOne" + index}>
                                            <button
                                                className={`accordion-button bg-transparent accordion-button shadow-none fs-16 ff-Soleil700 round-0 border-1 border-bottom border-site-black border-opacity-50 ps-0 ${index === 0 ? '' : 'collapsed'}`}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={'#collapse' + index}
                                                aria-expanded={index === 0 ? 'true' : 'false'}
                                                aria-controls="collapse"
                                            >
                                                {faq.question}
                                            </button>
                                        </h2>
                                        <div
                                            id={'collapse' + index}
                                            className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                                            aria-labelledby="heading"
                                            data-bs-parent="#accordion"
                                        >
                                            <div className="accordion-body ps-0">
                                                <p className="mb-0 fs-16">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center pt-5">
                                <Link
                                    href={cmsData?.faqCms?.cmsData?.buttonLink}
                                    className="btn bg-site-black border-site-black text-site-yellow-200 ff-Soleil700 fs-16 px-5 rounded-pill"
                                >
                                    {cmsData?.faqCms?.cmsData?.buttonText}
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            }
        </>
    )
}
