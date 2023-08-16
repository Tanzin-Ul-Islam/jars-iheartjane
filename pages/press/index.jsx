import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Press.module.css';
import { ImArrowRight2 } from "react-icons/im";
import { useGetPressReleaseCategoryURLQuery, useGetPressReleaseDataQuery } from '../../redux/api_core/apiCore';
import parse from 'html-react-parser';
import Skeleton from 'react-loading-skeleton';
import HeaderTitles from '../../components/HeaderTitles';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Loader from '../../components/Loader';
import { BsArrowRightShort } from "react-icons/bs";
import { fetchData } from '../../utils/FetchApi';
import api from "../../config/api.json"
import { setSiteLoader } from '../../redux/global_store/globalReducer';
import ReactPaginate from 'react-paginate';
import { AiOutlineHeart, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import useDidMountEffect from '../../custom-hook/useDidMount';
import { scrollToTop } from '../../utils/helper';
const Index = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [bellIcon, setBellIcon] = useState(false);
    const [heartIcon, setHeartIcon] = useState(false);
    const [watermelonIcon, setWatermelonIcon] = useState(false);
    const [discoutIcon, setDiscoutIcon] = useState(false);
    const [hoverImage, setHoverImage] = useState(-1);
    const { data: pressData, isSuccess: pressIsSuccess, isLoading: pressIsLoading, isError: pressIsError, error: pressError } = useGetPressReleaseCategoryURLQuery();

    // const list = [
    //     {
    //         svg_url_black: "../../images/nav-icons/Bell.svg",
    //         svg_url_white: "../../images/nav-icons/WhiteBell.svg",
    //         title: "Press Releases",
    //         setData: setBellIcon,
    //         getData: bellIcon
    //     },
    //     {
    //         svg_url_black: "../../images/nav-icons/BlackHeart.svg",
    //         svg_url_white: "../../images/nav-icons/WhiteHeart.svg",
    //         title: "Featured Mentions",
    //         setData: setHeartIcon,
    //         getData: heartIcon
    //     },
    //     {
    //         svg_url_black: "../../images/nav-icons/Watermelon.svg",
    //         svg_url_white: "../../images/nav-icons/WhiteWatermelon.svg",
    //         title: "Hot Off The Press",
    //         setData: setWatermelonIcon,
    //         getData: watermelonIcon
    //     },
    //     {
    //         svg_url_black: "../../images/nav-icons/BlackDivide.svg",
    //         svg_url_white: "../../images/nav-icons/WhiteDiscout.svg",
    //         title: "Media Assets",
    //         setData: setDiscoutIcon,
    //         getData: discoutIcon
    //     }
    // ]

    const [pressReleaseData, setPressReleaseData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const { data, isLoading, isSuccess, isFetching, error } = useGetPressReleaseDataQuery();
    const { pageMeta, pressComponentUI, selectedRetailer } = useSelector((store) => store.globalStore);
    const [isMobile, setIsMobile] = useState(false);

    // let pressReleaseData = data?.data?.pressReleaseData.length > 0 ? data.data.pressReleaseData : [];
    let cmsData = data?.data?.cmsData?.length > 0 ? data.data.cmsData[0] : {};

    const SkeletonPressList = [{}, {}, {}, {}];

    const pageNo = useRef(1);
    const limit = 12;
    const pageCount = useRef(1);
    const [currentPage, setCurrentPage] = useState(0);


    async function getPressData() {
        try {
            let response = await fetchData(api.pressRelease.getPressReleaseUrl + '?page=' + pageNo.current + "&limit=" + limit + "&category=" + selectedCategory);
            setPressReleaseData(response.data)
            pageCount.current = response.pageCount
        } catch (error) {
            console.log(error)
        }
    }

    async function handlePageClick(event) {
        setCurrentPage(event.selected);
        pageNo.current = event.selected + 1;
        await getPressData();
        // scrollToTop();
        handleScroll();
    };

    function clearPagination() {
        pageNo.current = 1;
        setCurrentPage(0);
    }

    function handleFilterByCategory(arg) {
        setSelectedCategory(arg);
    }

    function handleScroll() {
        const section = document.getElementById('content_section');

        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    useEffect(() => {
        getPressData();
    }, [])

    useDidMountEffect(() => {
        clearPagination();
        getPressData();
    }, [selectedCategory])

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
        <>
            {isLoading ? <Loader /> : <></>}
            <HeaderTitles title={'pressReleasePageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.pressReleasePageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.pressReleasePageMetaKeyword}
                />
            </Head>
            <div style={{ backgroundColor: pressComponentUI?.pageBackgroundColor }}>
                {cmsData?.bannerImage ?
                    // <section className={`position-relative ${styles.banner_bg}`} style={{ backgroundImage: `url(${cmsData.bannerImage})` }}>
                    //     <div className='text-center position-absolute top-50 start-50 translate-middle'>
                    //         <div>
                    //             <h1 className={`ff-Soleil700 ${styles.main_text_banner}`}>{cmsData?.title}</h1>
                    //             <p className={`ff-Soleil400 text-white my-auto ${styles.banner_sub}`}>{cmsData?.subTitle}</p>
                    //         </div>
                    //     </div>
                    // </section>
                    <section className={` ${styles.banner_bg}`} style={{ backgroundImage: `url(${cmsData?.bannerImage})`, marginTop: `${selectedRetailer?.name == "JARS Cannabis – East Detroit" && isMobile ? '10rem' : '0px'}` }}>
                        <div className='container top-50'>
                            <div className='w-50 w-md-75 p-4 p-lg-0'>
                                <h1 className='ff-PowerGrotesk700 fs-50 fs-md-25 lh-70 lh-md-28' style={{ color: pressComponentUI?.titleFontColor }}>{cmsData?.title}</h1>
                                <div className='d-flex gap-4'>
                                    <p className={`fs-14 fs-md-10 mt-0 mt-lg-2 pe-3 pe-lg-0 ${styles.banner_sub}`} style={{ color: pressComponentUI?.subTitleFontColor }}>{cmsData?.subTitle}</p>
                                </div>
                                <Link href={cmsData?.buttonLink || ""}
                                    className='btn px-5 py-1 rounded-pill fs-16 fs-md-10' style={{ backgroundColor: pressComponentUI?.buttonBackgroundColor, color: pressComponentUI?.buttonFontColor }}>
                                    <span className='align-middle'>{cmsData?.buttonText}</span>
                                    <BsArrowRightShort className="fs-5" />
                                </Link>
                            </div>
                        </div>
                    </section>
                    :
                    <section className='position-relative'>
                        <Skeleton style={{ width: '100%', height: '280px' }} />
                    </section>
                }

                {/* <section>
                    <div>
                        <div className="mx-4 mx-md-0 mt-3 mt-md-0">
                            <div className="row gy-2">
                                {list?.map((li, index) => (
                                    <div onMouseEnter={() => li?.setData(true)} onMouseLeave={() => li?.setData(false)} className={`border border-dark col-12 col-md-3 col-lg-3 d-flex justify-content-left justify-content-md-center align-items-center gap-3 cp ${styles.custom_button_hover} ${li.title === "Media Assets" && styles.disabled} ${li.title === selectedCategory && styles.custom_button_selected}`} key={index} onClick={() => handleFilterByCategory(li?.title)}>
                                        <picture>
                                            {
                                                li.title == selectedCategory ?
                                                    <img src={li?.svg_url_white} className='my-auto' style={{ height: '20px' }} />
                                                    :
                                                    !li.getData ?
                                                        <img src={li?.svg_url_black} className='my-auto' style={{ height: '30px' }} />
                                                        :
                                                        <img src={li?.svg_url_white} className='my-auto' style={{ height: '20px' }} />
                                            }
                                        </picture>
                                        <p className="my-auto py-3 fw-bold">{li?.title}</p>
                                    </div>
                                ))}

                                
                            </div>
                        </div>
                    </div>
                </section> */}

                <section>
                    <div>
                        <div className="mx-4 mx-md-0 mt-3 mt-md-0" id="content_section">
                            <div className="row gy-2">
                                {pressData?.data?.map((li, index) => (
                                    li?.isShowNav &&
                                    <div onMouseEnter={() => setHoverImage(index)} onMouseLeave={() => setHoverImage(index - 6)} className={`border border-dark col-12 col-md-3 col-lg-3 d-flex justify-content-left justify-content-md-center align-items-center gap-3 cp ${styles.custom_button_hover} ${li?.title === "Media Assets" && styles.disabled} ${li?.title === selectedCategory && styles.custom_button_selected}`} key={index} onClick={() => handleFilterByCategory(li?.title)}>
                                        <picture>
                                            {
                                                li?.title == selectedCategory ?
                                                    <img src={li?.imageTwo} className='my-auto' style={{ height: '20px' }} />
                                                    :
                                                    hoverImage == index ?
                                                        <img src={li?.imageTwo} className='my-auto' style={{ height: '20px' }} />
                                                        :
                                                        <img src={li?.imageOne} className='my-auto' style={{ height: '30px' }} />
                                            }
                                        </picture>
                                        <p className="my-auto py-3 fw-bold">{li?.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className='container py-5'>
                    <div className='row gy-4'>
                        {
                            pressReleaseData?.length > 0 ? pressReleaseData?.map((li, index) => (
                                <div className='col-12 col-lg-3' key={index}>
                                    <div className='border border-dark h-100 position-relative'>
                                        <div>
                                            <picture>
                                                <img src={li?.image} className={styles.card_thumb_img} />
                                            </picture>
                                        </div>
                                        <div className='d-flex gap-3 px-3 pt-3'>
                                            <p className='ff-Soleil400'>{new Date(li?.createdAt).toLocaleDateString("en-US")}</p>
                                        </div>
                                        <div className='px-3 pb-3 mb-5'>
                                            <p className='fs-18 fw-bold my-auto ff-Soleil400'>{li?.title}</p>
                                            <p className={`fs-14 ${styles.card_sub_description} ff-Soleil400`} dangerouslySetInnerHTML={{ __html: li?.description }}></p>
                                        </div>
                                        <div className='position-absolute bottom-0 start-0 w-100'>
                                            <hr />
                                            <div className='pb-3 ps-3 '>
                                                <Link
                                                    type="button"
                                                    href={'/press/' + li.urlSlug}
                                                    className="btn btn-outline-dark rounded-0 ff-Soleil700"
                                                >
                                                    <span className='align-middle'>READ MORE</span> &nbsp;<ImArrowRight2 className='fs-16' />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                                :
                                <>
                                    <div className='row mt-4' style={{ position: 'relative', margin: '0 auto' }}>
                                        <div className="col-12" role="alert">
                                            <p className='text-center fs-18 fw-bold'>No data found!</p>
                                        </div>
                                    </div>
                                </>

                        }
                        {
                            pressReleaseData?.length > 0 &&
                            <div className="d-flex justify-content-center">
                                <ReactPaginate
                                    nextLabel={<AiOutlineRight />}
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={2}
                                    pageCount={pageCount.current}
                                    previousLabel={<AiOutlineLeft />}
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakLabel="..."
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    containerClassName="pagination"
                                    activeClassName="active"
                                    renderOnZeroPageCount={null}
                                    forcePage={currentPage}
                                />
                            </div>
                        }
                    </div>
                </section>
            </div>
        </>
    )
}

export default Index