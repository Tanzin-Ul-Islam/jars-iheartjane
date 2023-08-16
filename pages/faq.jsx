import React, { useEffect, useState } from 'react'
import styles from '../styles/Faq.module.css';
import Banner from '../components/Banner';
import { useGetFaqPageCmsQuery } from "../redux/api_core/apiCore";
import { useDispatch, useSelector } from 'react-redux';
import { setSiteLoader } from '../redux/global_store/globalReducer';
import HeaderTitles from '../components/HeaderTitles';
import Skeleton from "react-loading-skeleton";
import Head from 'next/head';
import Loader from '../components/Loader';

function Faq() {

    // const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [activeLoader, setActiveLoader] = useState(true);

    const { data, isSuccess, isFetching, error } = useGetFaqPageCmsQuery();
    const { pageMeta, faqComponentUI } = useSelector((store) => store.globalStore);

    let cmsData = data?.data?.cmsData[0];
    let commonBannerCmsData = data?.data?.commonBannerCmsData[0];
    let faqData = data?.data?.faqData;

    useEffect(() => {
        try {
            // dispatch(setSiteLoader(true))
            if (data?.data?.cmsData?.length > 0) {
                setIsLoading(false)
                // dispatch(setSiteLoader(false))
            }
        } catch (error) {
            console.log(error);
        } finally {
            // dispatch(setSiteLoader(false))
        }
    }, [data]);

    useEffect(() => {
        setTimeout(() => {
            setActiveLoader(false);
        }, 2000)
    }, []);

    return (
        <>
            {activeLoader && <Loader />} 
            <HeaderTitles title={'faqPageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.faqPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.faqPageMetaKeyword}
                />
            </Head>
            {isLoading ?
                <>
                    <Loader />
                    <div>
                        <section className=''>
                            <div className="container-xxl px-0">
                                <Skeleton style={{ width: '100%', height: '130px' }} />
                            </div>
                        </section>
                        <section className='container'>
                            <div className={styles.heading}>
                                <h2 className='fs-30 fw-bold ff-PowerGrotesk700 text-center'>
                                    <Skeleton className="w-10 w-md-40" style={{ height: "35px" }} />
                                </h2>
                                <Skeleton className="w-100 mt-4 mb-5" style={{ height: "110px" }} />
                            </div>
                        </section>
                        <section className="faq-section">
                            <div className="container">
                                <div className="w-70 w-md-90 w-xs-100 mx-auto">
                                    <div className="accordion" id="accordion">
                                        <Skeleton className="w-100 mb-2" style={{ height: "110px" }} />
                                        <Skeleton className="w-100 mb-2" style={{ height: "110px" }} />
                                        <Skeleton className="w-100 mb-3" style={{ height: "110px" }} />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </>
                :
                <div style={{ backgroundColor: `${faqComponentUI?.pageBackgroundColor}` }}>
                    <section className=''>
                        <Banner commonBannerCmsData={commonBannerCmsData} />
                    </section>
                    <section className='container'>
                        <div className={styles.heading}>
                            <h1 className='fs-30 fw-bold ff-PowerGrotesk700 text-center' style={{ color: `${faqComponentUI?.titleFontColor}` }}>{cmsData?.title}</h1>
                            <p className='fs-16 fs-md-12 mt-4 mb-5 text-center' style={{ color: `${faqComponentUI?.subTitleFontColor}` }}>{cmsData?.subTitle}</p>
                        </div>
                    </section>
                    <section className="faq-section">
                        <div className="container">
                            <div className="w-70 w-md-90 w-xs-100 mx-auto">
                                <div className="accordion" id="accordion">
                                    {faqData?.map((faq, index) => (
                                        <div className="accordion-item round-8 mb-4 border bg-site-blue-100" key={index}>
                                            <h2 className="accordion-header" id={"headingOne" + index}>
                                                <button
                                                    className={`accordion-button bg-transparent accordion-button shadow-none fs-16 fs-sm-18 ${index === 0 ? '' : 'collapsed'}`}
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
                                                <div className="accordion-body">
                                                    <p className="mb-0 fs-12">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ height: '30px' }}></div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                </div>
            }
        </>

    )
}

export default Faq
