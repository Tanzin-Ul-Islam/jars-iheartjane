import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router';
import styles from '../../styles/Blog.module.css'
import { AiOutlineHeart, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { ImArrowRight2 } from "react-icons/im"
import { FaUserAlt } from "react-icons/fa"
import { BsCheckCircle, BsCalendar2DateFill } from "react-icons/bs"
import { CgMenuRight } from "react-icons/cg"
import { MdCategory } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux';
import { setSiteLoader } from '../../redux/global_store/globalReducer';
import api from '../../config/api.json';
import { fetchData } from '../../utils/FetchApi';
import ReactPaginate from 'react-paginate';
import Skeleton from 'react-loading-skeleton';
import { BsArrowRightShort } from "react-icons/bs";
import { RiNotification4Fill } from "react-icons/ri";
import HeaderTitles from '../../components/HeaderTitles';
import Head from "next/head";
import Link from "next/link";
import Loader from '../../components/Loader';
import useDidMountEffect from '../../custom-hook/useDidMount';
import { useGetArticleCategoryURLQuery } from '../../redux/api_core/apiCore';

const Index = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const { pageMeta, articleComponentUI, selectedRetailer } = useSelector((store) => store.globalStore);
    const [bellIcon, setBellIcon] = useState(false);
    const [heartIcon, setHeartIcon] = useState(false);
    const [watermelonIcon, setWatermelonIcon] = useState(false);
    const [discoutIcon, setDiscoutIcon] = useState(false);
    const [hoverImage, setHoverImage] = useState(-1);
    const { data: articleData, isSuccess: articleIsSuccess, isLoading, isError, error } = useGetArticleCategoryURLQuery();
    const [isMobile, setIsMobile] = useState(false);


    // const list = [
    //     {
    //         svg_url_black: "../../images/nav-icons/Bell.svg",
    //         svg_url_white: "../../images/nav-icons/WhiteBell.svg",
    //         title: "Education",
    //         setData: setBellIcon,
    //         getData: bellIcon
    //     },
    //     {
    //         svg_url_black: "../../images/nav-icons/BlackHeart.svg",
    //         svg_url_white: "../../images/nav-icons/WhiteHeart.svg",
    //         title: "Diversity, Equity & Inclusion",
    //         setData: setHeartIcon,
    //         getData: heartIcon
    //     },
    //     {
    //         svg_url_black: "../../images/nav-icons/Watermelon.svg",
    //         svg_url_white: "../../images/nav-icons/WhiteWatermelon.svg",
    //         title: "Culture",
    //         setData: setWatermelonIcon,
    //         getData: watermelonIcon
    //     },
    //     {
    //         svg_url_black: "../../images/nav-icons/BlackDivide.svg",
    //         svg_url_white: "../../images/nav-icons/WhiteDiscout.svg",
    //         title: "Higher Self",
    //         setData: setDiscoutIcon,
    //         getData: discoutIcon
    //     }
    // ]

    // const pageNo = useRef(1);
    // const [pageCount, setPageCount] = useState(0);
    // const [perPageArticle, setPerPageArticle] = useState(9);

    const [searchArticle, setSearchArticle] = useState('');
    const keyword = useRef('');
    const categoryIdRef = useRef('');
    const tagNameRef = useRef('');

    const [cmsData, setCmsData] = useState({});
    const [articleList, setArticleList] = useState([]);
    const [articleCategoryList, setArticleCategoryList] = useState([]);
    const [topArticleList, setTopArticleList] = useState([]);
    const [articleTagList, setArticleTagList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showLoader, setShowLoader] = useState(true);

    const pageNo = useRef(1);
    const limit = 12;
    const pageCount = useRef(1);
    const [currentPage, setCurrentPage] = useState(0);

    async function getCms() {
        setShowLoader(true);
        try {
            let response = await fetchData(api.article.getAllURL + '?page=' + 1 + "&limit=" + 1);
            if (response?.statusCode == 200) {
                setCmsData(response?.data?.cmsData[0]);
                // setArticleList(response?.data?.articleList?.posts);
                setArticleCategoryList(response?.data?.articleCategoryList);
                setTopArticleList(response?.data?.topArticleList);
                setArticleTagList(response?.data?.articleTagList);
            }

        } catch (error) {
            console.log(error)
        } finally {
            setShowLoader(false);
        }
    }

    async function getBlogData() {
        try {
            let response = await fetchData(api.article.getBlogFilterUrl + '?page=' + pageNo.current + "&limit=" + limit + "&category=" + encodeURIComponent(selectedCategory));
            setArticleList(response.data)
            pageCount.current = response.pageCount
        } catch (error) {
            console.log(error)
        }
        finally {
            dispatch(setSiteLoader(false));
        }
    }

    function handleScroll() {
        const section = document.getElementById('content_section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    async function handlePageClick(event) {
        setCurrentPage(event.selected);
        pageNo.current = event.selected + 1;
        await getBlogData();
        handleScroll();
    };

    function clearPagination() {
        pageNo.current = 1;
        setCurrentPage(0);
    }

    function handleFilterByCategory(arg) {
        setSelectedCategory(arg);
    }

    useEffect(() => {
        getCms();
        getBlogData();
    }, []);

    useDidMountEffect(() => {
        clearPagination();
        getBlogData();
    }, [selectedCategory])

    // async function handlePageClick(event) {
    //     pageNo.current = event.selected + 1;
    //     getArticles();
    // };

    // const hnadleArticleByCategory = (categoryId) => {
    //     categoryIdRef.current = categoryId;
    //     getArticles();
    // }

    // const hnadleArticleByTag = (tagName) => {
    //     tagNameRef.current = tagName;
    //     getArticles();
    // }

    // const handleArticleSearch = () => {
    //     keyword.current = searchArticle;
    //     getArticles();
    // }

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
            {showLoader ? <Loader /> : <></>}
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.articlesPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.articlesPageMetaKeyword}
                />
            </Head>
            <div style={{ backgroundColor: articleComponentUI?.pageBackgroundColor }}>
                <HeaderTitles title={'articlesPageTitle'} />
                {cmsData?.bannerImage ?
                    <section className={` ${styles.banner_bg}`} style={{ backgroundImage: `url(${cmsData?.bannerImage})`, marginTop: `${selectedRetailer?.name == "JARS Cannabis – East Detroit" && isMobile ? '173px' : '0px'}` }}>
                        <div className='container top-50'>
                            <div className='w-50 w-md-75 p-4 p-lg-0'>
                                <h1 className='ff-PowerGrotesk700 fs-50 fs-md-25 lh-70 lh-md-28' style={{ color: articleComponentUI?.titleFontColor }}>{cmsData?.title}</h1>
                                <div className='d-flex justify-content-start gap-4'>
                                    <p className={`fs-14 fs-md-10 mt-0 mt-lg-3 pe-3 pe-lg-0 ${styles.banner_sub}`} style={{ color: articleComponentUI?.subTitleFontColor }}>{cmsData?.subTitle}</p>
                                </div>
                                <Link href={cmsData?.ButtonLink || ""}
                                    className='btn px-5 py-1 rounded-pill fs-16 fs-md-10' style={{ backgroundColor: articleComponentUI?.buttonBackgroundColor, color: articleComponentUI?.buttonFontColor }}>
                                    <span className='align-middle'>{cmsData?.ButtonText}</span>
                                    <BsArrowRightShort className="fs-5" />
                                </Link>
                            </div>
                        </div>
                    </section>
                    :
                    <Skeleton style={{ width: '100%', height: '92vh' }} />

                }

                {/* <section>
                    <div>
                        <div className="mx-4 mx-md-0 mt-3 mt-md-0">
                            <div className="row gy-2">
                                {list?.map((li, index) => (
                                    <div onMouseEnter={() => li?.setData(true)} onMouseLeave={() => li?.setData(false)} className={`border border-dark col-12 col-md-3 col-lg-3 d-flex justify-content-left justify-content-md-center align-items-center cp gap-3 ${styles.custom_button_hover} ${li.title === selectedCategory && styles.custom_button_selected}`} key={index} onClick={() => handleFilterByCategory(li?.title)}>
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
                        <div className="mx-4 mx-md-0 mt-3 mt-md-0">
                            <div className="row gy-2">
                                {articleData?.data?.map((li, index) => (
                                    li?.isShowNav &&
                                    <div onMouseEnter={() => setHoverImage(index)} onMouseLeave={() => setHoverImage(index - 6)} className={`border border-dark col-12 col-md-3 col-lg-3 d-flex justify-content-left justify-content-md-center align-items-center cp gap-3 ${styles.custom_button_hover} ${li?.title === selectedCategory && styles.custom_button_selected}`} key={index} onClick={() => handleFilterByCategory(li?.title)}>
                                        {/* <RiNotification4Fill className="fs-5 my-auto fw-bold" /> */}
                                        <picture>
                                            {
                                                li.title == selectedCategory ?
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
                    <div className='row gy-4' id='content_section'>
                        {
                            (articleList?.length > 0) ? articleList?.map((li, index) => (
                                <div className='col-12 col-lg-4' key={index}>
                                    <div className='border border-dark h-100 position-relative'>
                                        <div className='mb-5'>
                                            <picture>
                                                <img src={li?.photo} className={styles.card_thumb_img} />
                                            </picture>
                                        </div>
                                        <div className='px-4 pb-3 mb-5'>
                                            <p className='fs-18 fw-bold my-auto ff-PowerGrotesk700'>{li?.title}</p><br />
                                            <p className={`fs-14 ${styles.card_sub_description} ff-Soleil400`} dangerouslySetInnerHTML={{ __html: li?.shortDetails }}></p>
                                        </div>
                                        <div className='position-absolute bottom-0 start-0 w-100'>
                                            <div className='pb-3 px-2'>
                                                <Link href={`/blog/${li?.urlSlug}`}
                                                    className="btn text-decoration-underline rounded-0 ff-Soleil700" >
                                                    <span>Read more</span>
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
                            (articleList?.length > 0) ?
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
                                : <></>
                        }
                    </div>
                </section>


                <section className='container mb-5 d-none'>
                    <div className='row'>
                        <div className='col-12 col-lg-8'>
                            {(articleList?.length > 0) ?
                                articleList?.map((li, index) => {
                                    const date = new Date(li.createdAt).toString();
                                    const dateArr = date.split(' ');

                                    return (
                                        <div className='blog-box mt-5' key={index}>
                                            <div>
                                                <picture>
                                                    <img src={li.photo} className='w-100' />
                                                </picture>
                                            </div>
                                            <div>
                                                <p className='fs-32 fw-bold ff-Soleil700'>{li.title}</p>
                                            </div>
                                            <div className='d-flex justify-content-start gap-4'>
                                                <div className='d-flex gap-2'>
                                                    <BsCalendar2DateFill className="fs-16 my-auto" />
                                                    <p className='my-auto ff-Soleil400'>{dateArr[1]} {dateArr[2]}</p>
                                                </div>
                                                {/* <div className='d-flex gap-2'>
                                        <FaUserAlt className="fs-16 my-auto" />
                                        <p className='my-auto ff-Soleil400'>By <b>Mr. Frank</b></p>
                                    </div> */}
                                                <div className='d-flex gap-2'>
                                                    <MdCategory className="fs-16 my-auto" />
                                                    <p className='my-auto ff-Soleil400'>{li.categoryName}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div>
                                                <p className="ff-Soleil400">{li.shortDetails}</p>
                                            </div>
                                            <div>
                                                <button type="button" className="btn btn-outline-dark rounded-0 ff-Soleil700" onClick={() => router.push('/blog/' + li.urlSlug)}><span className='align-middle'>READ MORE</span> &nbsp;<ImArrowRight2 className='fs-16' /></button>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className='row mt-4' style={{ position: 'relative', margin: '0 auto' }}>
                                    <div className="col-12" role="alert">
                                        <p className='text-center fs-18 fw-bold'>No blog found!</p>
                                    </div>
                                </div>
                            }

                        </div>
                        {/* {
                            topArticleList.length > 0 ?
                                <div className='col-12 col-lg-4'>
                                    <div className='mt-5 bg-dark text-white p-4'>
                                        <div className='d-flex'>
                                            <CgMenuRight className='fs-24 my-auto me-1' />
                                            <p className='fs-24 my-auto ff-Soleil700'>Search Blog</p>
                                        </div>
                                        <div className='mt-3'>
                                            <div className="">
                                                <form>
                                                    <div className="mb-3">
                                                        <div className='d-flex'>
                                                            <span className='w-100 me-1'>
                                                                <input name='searchArticle' type="search" className="form-control border border-1 border-light py-2 shadow-none rounded-0 " placeholder="Type Key" aria-label="Recipient's username" aria-describedby="button-addon2" value={searchArticle} onChange={(e) => setSearchArticle(e.target.value)} />
                                                            </span>
                                                            <span>
                                                                <button onClick={handleArticleSearch} className="btn btn-outline-light h-100 rounded-0 ff-Soleil700" type="button" id="button-addon2">Search</button>
                                                            </span>
                                                        </div>



                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div className='py-4'>
                                            <div className='d-flex'>
                                                <CgMenuRight className='fs-24 my-auto me-1' />
                                                <p className='fs-24 my-auto ff-Soleil700
                                '>Categories</p>
                                            </div>
                                            <div className='text-center mt-3'>
                                                <ul className='list-group lh-35'>
                                                    {articleCategoryList?.map((cat, index) => {
                                                        return (
                                                            <li onClick={() => hnadleArticleByCategory(cat?.id)} className='d-flex gap-2 justify-content-start' style={{ cursor: 'pointer' }} key={index}>
                                                                <div>
                                                                    <BsCheckCircle className="fs-16 my-auto" />
                                                                </div>
                                                                <div>
                                                                    <p className='my-auto ff-Soleil400'>{cat.categoryName}</p>
                                                                </div>
                                                            </li>
                                                        )
                                                    })}


                                                </ul>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='d-flex'>
                                                <CgMenuRight className='fs-24 my-auto me-1' />
                                                <p className='fs-24 my-auto ff-Soleil700'>Top Articles</p>
                                            </div>
                                            <div className='mt-3'>
                                                {topArticleList.map((top, index) => {

                                                    const date = new Date(top?.createdAt).toString();
                                                    const dateArr = date.split(' ');

                                                    return (
                                                        <div key={index}>
                                                            <div onClick={() => router.push('/blog/' + top?.urlSlug)} className="d-flex justify-content-start" style={{ cursor: 'pointer' }} >
                                                                <picture>
                                                                    <img src={top?.photo} className="flex-shrink-0 me-3" alt="..." style={{ width: '80px', height: '60px' }} />
                                                                </picture>
                                                                <div>
                                                                    <h5 className="mt-0  fs-14 ff-Soleil400">{top.title}</h5>
                                                                    <p className='fs-12 ff-Soleil400'>Posted: {dateArr[1]} {dateArr[2]}</p>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className='d-flex'>
                                                <CgMenuRight className='fs-24 my-auto me-1' />
                                                <p className='fs-24 my-auto ff-Soleil700'>Tags Cloud</p>
                                            </div>
                                            <div className='row gy-3 mx-3 mt-3'>
                                                {articleTagList?.map((tag, index) => {

                                                    return (
                                                        <div onClick={() => hnadleArticleByTag(tag?.tagName)} className='col-12 col-lg-6' style={{ cursor: 'pointer' }} key={index}>
                                                            <button type="button" className="btn btn-outline-light rounded-0 w-100 ff-Soleil400">{tag?.tagName}</button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className='col-12 col-lg-4 mt-5'>
                                    <Skeleton style={{ width: '100%', height: '400px' }} />
                                </div>
                        } */}
                    </div>
                </section>
            </div>
        </>
    )
}

export default Index