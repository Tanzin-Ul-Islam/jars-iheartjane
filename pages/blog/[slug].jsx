import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { ImArrowRight2 } from "react-icons/im"
import { AiOutlineRight } from "react-icons/ai"
import { BsCheckCircle, BsCalendar2DateFill } from "react-icons/bs"
import { BsChevronCompactRight } from "react-icons/bs"
import { MdCategory } from "react-icons/md"
import styles from '../../styles/Blog.module.css';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import { useGetArticlePageCmsQuery } from '../../redux/api_core/apiCore';
import { useDispatch, useSelector } from 'react-redux';
import { setSiteLoader } from '../../redux/global_store/globalReducer';
import { fetchData } from '../../utils/FetchApi';
import api from '../../config/api.json';
import parse from 'html-react-parser';
import Skeleton from 'react-loading-skeleton';
import { FacebookShareButton, TwitterShareButton, PinterestShareButton } from 'react-share';
import HeaderTitles from '../../components/HeaderTitles';
import Head from "next/head";
import Link from "next/link";
import Loader from '../../components/Loader';

const Details = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { pageMeta, articleDetailsComponentUI, selectedRetailer } = useSelector((store) => store.globalStore);
    const { slug } = router.query;

    const [cmsData, setCmsData] = useState({});
    const [articleCmsData, setArticleCmsData] = useState({});
    const [article, setArticle] = useState({});
    const [tags, setTags] = useState([]);
    const [relatedArticle, setRelatedArticle] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    const { data, isSuccess, isFetching, isLoading, error } = useGetArticlePageCmsQuery({});

    async function getData() {
        try {
            //dispatch(setSiteLoader(true));
            let response = await fetchData(api.article.getArticleDetailsURL + slug);

            if (response?.statusCode == 200) {
                setCmsData(response?.data?.cmsData[0]);
                setArticleCmsData(response?.data?.cmsData[0]);
                setArticle(response?.data?.articleData[0]);
                setTags(response?.data?.articleData[0]?.tags);
                setRelatedArticle(response?.data?.articleData[0]?.relatedPostsDetails);
            }

        } catch (error) {
            console.log(error)
        }
        finally {
            dispatch(setSiteLoader(false));
        }
    }

    useEffect(() => {
        if (slug) getData();
    }, [slug]);

    const date = new Date(article.createdAt).toString();
    const dateArr = date.split(' ');

    let currentPageURL = '';

    if (typeof window !== 'undefined') {
        currentPageURL = location.href;
        // currentPageURL = 'https://jars.1space.co/article/7-strains-to-elevate-your-outdoor-adventures';
    }

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
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.articleDetailsPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.articleDetailsPageMetaKeyword}
                />
            </Head>
            <div style={{ backgroundColor: articleDetailsComponentUI?.backgroundColor }}>
                <HeaderTitles title={'articleDetailsPageTitle'} />
                {cmsData?.bannerImage ?
                    // <section className={`position-relative ${styles.banner_bg}`} style={{ backgroundImage: `url(${cmsData?.bannerImage})` }}>
                    //     <div className='text-center position-absolute top-50 start-50 translate-middle'>
                    //         <h1 className={`ff-Soleil700 ${styles.main_text_banner}`}>{cmsData?.title }</h1>
                    //         <div className='d-flex justify-content-center gap-4'>

                    //             <p className={`ff-Soleil400 text-white my-auto ${styles.banner_sub}`}>{cmsData?.subTitle}</p>
                    //         </div>
                    //     </div>
                    // </section>
                    <section className={styles.bannerBackground} style={{ backgroundImage: `url(${article?.photo})`, marginTop: `${selectedRetailer?.name == "JARS Cannabis – East Detroit" && isMobile ? '173px' : '0px'}` }}>
                        <div className='container'>
                            <div className={`w-40 w-md-100 ${styles.headerTextBox}`}>
                                <h1 className="ff-PowerGrotesk700 mb-3 mb-lg-4 line-clamp-3" style={{ color: articleDetailsComponentUI?.titleFontColor }}>{article?.title}</h1>
                                {/* <h2 className="ff-PowerGrotesk700 mb-3 mb-lg-4">GOES HERE</h2> */}
                                {/* <p className='fs-14 fs-md-10 w-100 w-md-50 line-clamp-3'>{article?.shortDetails}</p> */}
                                <p className='fs-14 fs-md-10 w-100 w-md-50' style={{ color: articleDetailsComponentUI?.subTitleFontColor }}>{article?.shortDetails}</p>
                            </div>
                        </div>
                    </section>
                    :
                    <Skeleton style={{ width: '100%', height: '280px' }} />
                }

                {/* {article?.photo ?
              <section className='container'>
                    <div className='row'>
                        <div className=''>
                            <div className='blog-box mt-3 mt-lg-5'>
                                <div>
                                    <picture>
                                        <img src={article?.photo} className={styles.bannerImage} />
                                    </picture>
                                </div>
                                <div>
                                    <p className='fs-32 fw-bold mt-3 ff-Soleil700'>{article?.title}</p>
                                </div>
                                <div className='d-flex justify-content-start gap-4'>
                                    <div className='d-flex gap-2'>
                                        <BsCalendar2DateFill className="fs-16 my-auto" />
                                        <p className='my-auto ff-Soleil400'>{dateArr[1]} {dateArr[2]}</p>
                                    </div>
                                    <div className='d-flex gap-2'>
                                        <MdCategory className="fs-16 my-auto" />
                                        <p className='my-auto ff-Soleil400'>{article?.categoryName}</p>
                                    </div>
                                </div>
                                <hr className='' />
                                <div className=''>
                                    <p className="ff-Soleil400">{parse(`${article?.longDetails}`)}</p>
                                </div>
                                <div className='row gy-3 mt-3'>
                                    {tags?.map((tag, index) => (
                                        <div className='col-6 col-lg-2' key={index}>
                                            <p className='bg-dark text-white p-2 text-center ff-Soleil400'>{tag?.tagName}</p>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
              :
              <section className='container'>
                  <div className='row'>
                      <div className=''>
                          <div className='blog-box mt-3 mt-lg-5'>
                              <div>
                                  <picture>
                                      <Skeleton style={{ width: '100%', height: '410px' }} />
                                  </picture>
                              </div>
                              <div>
                                  <Skeleton style={{ width: '100%', height: '40px' }} />
                              </div>
                              <div className='d-flex justify-content-start gap-4'>
                                  <div className='d-flex gap-2'>
                                      <Skeleton style={{ width: '20%', height: '30px' }} />
                                  </div>
                                  <div className='d-flex gap-2'>
                                      <Skeleton style={{ width: '20%', height: '30px' }} />
                                  </div>
                              </div>
                              <hr className='' />
                              <div className=''>
                                  <Skeleton style={{ width: '100%', height: '100%' }} />
                              </div>
                              <div className='row gy-3 mt-3'>
                                  <Skeleton style={{ width: '20%', height: '50px' }} />
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
          } */}
                {article.photo ?
                    <section className={`container pb-5 ${styles.subheadSection}`}>
                        <div className='mb-4 mb-lg-5'>
                            {/* <h2 className='fs-40 fs-md-30 ff-Soleil700'>{article?.title}</h2> */}
                            <p className='fs-14 ff-Soleil400 text-justify'>{parse(`${article?.longDetails}`)}</p>
                        </div>
                    </section>
                    :
                    <>
                        <Loader />
                        <section className='container'>
                            <div className='row'>
                                <div>
                                    <div className='blog-box mt-3 mt-lg-5'>
                                        <div>
                                            <picture>
                                                <Skeleton style={{ width: '100%', height: '410px' }} />
                                            </picture>
                                        </div>
                                        <div>
                                            <Skeleton style={{ width: '100%', height: '40px' }} />
                                        </div>
                                        <div className='d-flex justify-content-start gap-4'>
                                            <div className='d-flex gap-2'>
                                                <Skeleton style={{ width: '20%', height: '30px' }} />
                                            </div>
                                            <div className='d-flex gap-2'>
                                                <Skeleton style={{ width: '20%', height: '30px' }} />
                                            </div>
                                        </div>
                                        <hr />
                                        <div>
                                            <Skeleton style={{ width: '100%', height: '100%' }} />
                                        </div>
                                        <div className='row gy-3 mt-3'>
                                            <Skeleton style={{ width: '20%', height: '50px' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                }
                <section className='container mb-5'>
                    <div className='text-center'>
                        <p className='ff-Soleil700 fs-13'>SHARE WITH FRIENDS</p>
                        <div className='d-flex justify-content-center gap-2'>
                            <FacebookShareButton url={currentPageURL} quote="Please share this article" hashtag="#code">
                                <picture>
                                    <img src='../../images/fb-icon.svg' className='cp' />
                                </picture>
                            </FacebookShareButton>
                            <TwitterShareButton url={currentPageURL} quote="Please share this article" hashtag="#code">
                                <picture>
                                    <img src='../../images/twitter-icon.svg' className='cp' />
                                </picture>
                            </TwitterShareButton>
                            <PinterestShareButton url={currentPageURL} quote="Please share this article" hashtag="#code" media={currentPageURL}>
                                <picture>
                                    <img src='../../images/pintrest-icon.svg' className='cp' />
                                </picture>
                            </PinterestShareButton>
                        </div>
                    </div>
                </section>
                <section className='container text-site-white mb-4'>
                    <div className={`bg-dark ${styles.customBlogBanner}`}>
                        <div className="w-25 w-md-100 text-center text-md-start pt-0 pt-lg-3 pt-md-0">
                            <h2 className="fs-60 fs-md-25 ff-PowerGrotesk700 lh-55 lh-md-30 ms-0 ms-md-4">{data?.data[0]?.title}</h2>
                        </div>
                        <div className="d-flex flex-column flex-md-row justify-content-between ms-0 ms-md-4 mt-0 mt-md-3">
                            <p className="lh-10 text-center text-md-start fs-14">{data?.data[0]?.subTitle}</p>
                            <p className="d-none d-md-block lh-10 me-4 text-center text-md-start text-decoration-underline fs-14" style={{ 'cursor': 'pointer' }}><Link href={data?.data[0]?.buttonLink || ''}><span className="align-middle">{data?.data[0]?.buttonText}</span><AiOutlineRight /></Link></p>
                            <div className="d-flex justify-content-center d-md-none mt-2">
                                <button onClick={() => { router.push(`${data?.data[0]?.buttonLink}`) }} className='btn btn-light py-1 border-0 rounded-pill fs-14 fs-md-12 text-site-black w-25'>{data?.data[0]?.buttonText}</button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='container pb-4'>
                    <div className='row gy-4'>
                        {relatedArticle.map((li, index) => (
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
                                            <button type="button" onClick={() => router.push('/blog/' + li.urlSlug)} className="btn text-decoration-underline rounded-0 ff-Soleil700" ><span className=''>Read more</span></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* <section className='container mb-5'>
            {relatedArticle?.length > 0 && <div className='mt-5 mb-3'>
                <h2 className='text-center text-lg-start ff-Soleil700'>Related Blogs</h2>
            </div>}
            <div className='row gy-4'>
                  { relatedArticle?.map((li, index) => {
                      const date = new Date(li?.createdAt).toLocaleDateString("en-US");
                      return (
                          <div className='col-12 col-lg-4' key={index}>
                              <div className='border border-dark h-100 position-relative'>
                                  <div>
                                      <picture>
                                          <img src={li?.photo} className={styles.card_thumb_img} />
                                      </picture>
                                  </div>
                                  <div className='d-flex gap-3 px-3 pt-3'>
                                      <p className='ff-Soleil400'>{date}</p>
                                      <p>|</p>
                                      <p className='ff-Soleil400'>{li?.categoryName}</p>
                                  </div>
                                  <div className='px-3 pb-3 mb-5'>
                                      <p className='fs-18 mb-1 fw-bold my-auto ff-Soleil400'>{li?.title}</p>
                                      <p className={`ff-Soleil400 ${styles.card_sub_description}`}>{li?.shortDetails}</p>
                                  </div>
                                  <div className='position-absolute bottom-0 start-0 w-100'>
                                      <hr />
                                      <div className='pb-3 ps-3 '>
                                          <button onClick={() => router.push('/article/' + li.urlSlug)} type="button" className="btn btn-outline-dark rounded-0 ff-Soleil700" >READ MORE &nbsp;<ImArrowRight2 className='fs-16' /></button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )
                    
                })}         
              
            </div>
            

        </section> */}
            </div>
        </>

    )
}

export default Details