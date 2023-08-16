import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { ImArrowRight2 } from "react-icons/im"
import { FaUserAlt } from "react-icons/fa"
import { BsCheckCircle, BsCalendar2DateFill } from "react-icons/bs"
import { CgMenuRight } from "react-icons/cg"
import { MdCategory } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux';
import { setSiteLoader } from '../../redux/global_store/globalReducer';
import { fetchData } from '../../utils/FetchApi';
import api from '../../config/api.json';
import styles from '../../styles/Press.module.css';
import parse from 'html-react-parser';
import Skeleton from 'react-loading-skeleton';
import HeaderTitles from '../../components/HeaderTitles';
import Head from 'next/head';
import Loader from '../../components/Loader';

const Details = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;
    const { pageMeta, pressDetailsComponentUI, selectedRetailer } = useSelector((store) => store.globalStore);
    const [isMobile, setIsMobile] = useState(false);

    const [cmsData, setCmsData] = useState({});
    const [pressRelease, setPressRelease] = useState({});

    async function getData() {
        try {
            //dispatch(setSiteLoader(true));
            let response = await fetchData(api.pressRelease.getPressDetailsURL + id);

            if (response?.statusCode == 200) {
                setCmsData(response?.data?.cmsData[0]);
                setPressRelease(response?.data?.pressReleaseData[0]);
            }

        } catch (error) {
            console.log(error)
        }
        finally {
            dispatch(setSiteLoader(false));
        }
    }

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Initial check for screen size on component mount
        handleResize();

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [selectedRetailer]);


    return (
        <div style={{ backgroundColor: pressDetailsComponentUI?.backgroundColor }}>
            <HeaderTitles title={'pressReleaseDetailsPageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.pressReleaseDetailsPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.pressReleaseDetailsPageMetaKeyword}
                />
            </Head>
            {cmsData?.bannerImage ?
                <section className={`position-relative ${styles.banner_bg}`} style={{ backgroundImage: `url(${cmsData?.bannerImage})`, marginTop: `${selectedRetailer?.name == "JARS Cannabis – East Detroit" && isMobile ? '10rem' : '0px'}` }}>
                    <div className='text-center position-absolute top-50 start-50 translate-middle'>
                        <h2 className={`ff-Soleil700 ${styles.main_text_banner}`} style={{ color: pressDetailsComponentUI?.titleFontColor }}>{cmsData?.title}</h2>
                        <div className='d-flex justify-content-center gap-4'>
                            {/* <button className='bg-dark border-0 text-white px-3 py-1'>Home</button> */}
                            <p className={`ff-Soleil400 my-auto ${styles.banner_sub}`} style={{ color: pressDetailsComponentUI?.subTitleFontColor }}>{cmsData?.subTitle}</p>
                        </div>
                    </div>
                </section>
                :
                <section className='position-relative'>
                    <Skeleton style={{ width: '100%', height: '280px' }} />
                </section>
            }
            <section className='container'>
                {pressRelease?.image ?
                    <div className='blog-box py-3 py-lg-5'>
                        <div>
                            <picture>
                                <img src={pressRelease?.image} className={styles.bannerImage} />
                            </picture>
                        </div>
                        <div>
                            <h1 className='fs-32 fw-bold mt-3 ff-Soleil700'>{pressRelease?.title}</h1>
                        </div>
                        <div className='d-flex justify-content-start gap-4'>
                            <div className='d-flex gap-2'>
                                <BsCalendar2DateFill className="fs-16 my-auto" />
                                <p className='my-auto ff-Soleil400'>{new Date(pressRelease?.createdAt).toLocaleDateString("en-US")}</p>
                            </div>
                        </div>
                        <hr />
                        <div>
                            <p className="ff-Soleil400">{parse(`${pressRelease?.description}`)}</p>
                        </div>
                    </div>
                    :
                    <>
                        <Loader />
                        <div className='blog-box mt-3 mt-lg-5'>
                            <div className='h-100 position-relative'>
                                <div>
                                    <picture>
                                        <Skeleton style={{ width: '100%', height: '200px' }} />
                                    </picture>
                                </div>
                                <div className='d-flex gap-3 px-3 pt-3'>
                                    <Skeleton style={{ width: '20%', height: '10px' }} />
                                </div>
                                <div className='px-3 pb-3 mb-5'>
                                    <Skeleton style={{ width: '100%', height: '50px' }} />
                                </div>
                            </div>
                        </div>
                    </>
                }
            </section>
        </div>
    )
}

export default Details