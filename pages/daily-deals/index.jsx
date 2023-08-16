import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowUpRight, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProductList from '../../components/ProductList';
import Banner from '../../components/Banner';
import styles from '../../styles/Daily.module.css';
import {
  useGetFaqPageCmsQuery,
  useGetFeaturedBrandsQuery,
} from '../../redux/api_core/apiCore';
import { postData } from '../../utils/FetchApi';
import { useSelector, useDispatch } from 'react-redux';
import { setSiteLoader } from '../../redux/global_store/globalReducer';
import api from '../../config/api.json';
import { useRouter } from 'next/router';
import HeaderTitles from '../../components/HeaderTitles';
import Skeleton from 'react-loading-skeleton';
import Head from 'next/head';
import Loader from '../../components/Loader';

export default function index() {
  const router = useRouter();
  let dispatch = useDispatch();
  let { siteLoader, todaySpecialsValue, pageMeta, todaySpecialLoader } =
    useSelector((store) => store.globalStore);
  const { data, isSuccess, isFetching, error } = useGetFaqPageCmsQuery({});

  // featured brands
  let { data: featuredBrandData, isLoading } = useGetFeaturedBrandsQuery();
  const featuredBrandList = featuredBrandData?.data;

  let commonBannerCmsData = data?.data?.commonBannerCmsData[0];

  return (
    // commonBannerCmsData?.id ?
    <>
      <HeaderTitles title={'dailyDealsPageTitle'} />
      <Head>
        <meta
          name="description"
          content={pageMeta?.dailyDealsPageMetaDescription}
        />
        <meta name="keywords" content={pageMeta?.dailyDealsPageMetaKeyword} />
      </Head>
      {!todaySpecialLoader ? (
        <div>
          <div>
            <section className="mt-5">
              <Banner commonBannerCmsData={commonBannerCmsData} />
            </section>
            <div className="container my-5 text-center text-lg-start">
              <h3 className="ff-Soleil700 fs-28">Today's Specials</h3>
              <p className="ff-Soleil400 fs-14">
                Shop today's sales and special offers!
              </p>
            </div>
            {todaySpecialsValue?.length > 0 ? (
              <div className="container mb-5">
                <div className="row gy-5">
                  {todaySpecialsValue?.map((el, index) => (
                    <>
                      <div
                        className="position-relative col-6 col-lg-4 d-none d-md-block"
                        key={index}
                      >
                        <div
                          className={`p-3 p-sm-5 shadow-sm ${styles.small_box}`}
                          style={{
                            background: `linear-gradient(hsl(0, 2%, 20%,0.2),80%,black), url(${
                              el.menuDisplayConfiguration.image
                                ? el.menuDisplayConfiguration.image
                                : 'https://jars-dutchi.nyc3.cdn.digitaloceanspaces.com/default/special-demo.png'
                            }) no-repeat`,
                            objectFit: 'cover !important',
                            backgroundSize: '100% 100%',
                          }}
                        >
                          <p className="text-white fs-sm-15 fs-20 fw-bold text-center ff-Soleil700">
                            {el.name}
                          </p>
                        </div>
                        <Link
                          href={
                            '/shop?special_id=' +
                            el.id +
                            '&menuType=' +
                            el.menuType
                          }
                          className="ff-Soleil400 position-absolute top-100 start-50 translate-middle btn btn-dark fs-14 rounded-pill px-5"
                        >
                          Shop
                        </Link>
                      </div>
                      {/* Mobile screen */}
                      <div
                        className="position-relative col-6 col-lg-4 mt-4 d-md-none d-block"
                        key={index}
                      >
                        <div
                          className={`p-3 p-sm-5 shadow-sm text-center rounded-2 ${styles.small_box}`}
                          style={{
                            background: `linear-gradient(hsl(0, 2%, 20%,0.2),80%,black), url(${
                              el.menuDisplayConfiguration.image
                                ? el.menuDisplayConfiguration.image
                                : 'https://jars-dutchi.nyc3.cdn.digitaloceanspaces.com/default/special-demo.png'
                            }) no-repeat`,
                            objectFit: 'cover !important',
                            backgroundSize: '100% 100%',
                          }}
                        >
                          <p className="text-white fs-sm-15 fs-20 fw-bold text-center ff-Soleil700">
                            {el.name}
                          </p>
                          <Link
                            href={
                              '/shop?special_id=' +
                              el.id +
                              '&menuType=' +
                              el.menuType
                            }
                            className="ff-Soleil400 text-white btn border fs-14 rounded-pill px-3"
                          >
                            Shop
                          </Link>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            ) : todaySpecialsValue?.length == 0 ? (
              <div
                className="row mt-4"
                style={{ position: 'relative', margin: '0 auto' }}
              >
                <div className="col-12" role="alert">
                  <p className="text-center fs-18 fw-bold">No data found!</p>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          {featuredBrandList && featuredBrandList?.length > 0 ? (
            <section className="container mb-5" style={{ marginTop: '6rem' }}>
              <div>
                <div className="mb-4">
                  <h1 className="fs-28 ff-Soleil700 text-center">
                    FEATURED BRANDS
                  </h1>
                </div>
                <div>
                  <div className="row gy-5">
                    {featuredBrandList?.map((el, index) => {
                      return (
                        <div className="col-6 col-lg-2" key={index}>
                          <Link
                            href={el.link}
                            className={`mx-auto mx-lg-0 d-flex justify-content-center align-items-center border rounded-3 ${styles.brands_small_logo}`}
                          >
                            <picture className="p-3">
                              <img
                                src={el?.image}
                                style={{ width: '100%', objectFit: 'contain' }}
                              />
                            </picture>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>

    // <>

    //   <HeaderTitles title={'dailyDealsPageTitle'} />
    //   <div>
    //     <div>
    //       <section className="mt-5">
    //         <div className="container-xxl px-0">
    //           <Skeleton style={{ width: '100%', height: '130px' }} />
    //         </div>
    //       </section>
    //       <div className="container my-5 text-center text-lg-start">
    //         <h3 className="ff-Soleil700 fs-28"><Skeleton style={{ width: '200px', height: '30px' }} /></h3>
    //         <p className="ff-Soleil400 fs-14">
    //           <Skeleton style={{ width: '400px', height: '30px' }} />
    //         </p>
    //       </div>
    //       <div className="container mb-5">
    //         <div className="row gy-5">
    //           <div className="position-relative col-12 col-lg-4">
    //             <Skeleton style={{ width: '100%', height: '200px' }} />
    //           </div>
    //           <div className="position-relative col-12 col-lg-4">
    //             <Skeleton style={{ width: '100%', height: '200px' }} />
    //           </div>
    //           <div className="position-relative col-12 col-lg-4">
    //             <Skeleton style={{ width: '100%', height: '200px' }} />
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <section className="container mb-5" style={{ marginTop: "6rem" }}>
    //       <div>
    //         <div className="mb-4">
    //           <h1 className="fs-28 ff-Soleil700 text-center"><Skeleton style={{ width: '200px', height: '40px' }} /></h1>
    //         </div>
    //         <div>
    //           <div className="row gy-5">
    //             <div className="col-12 col-md-2 text-center">
    //               <Skeleton style={{ width: '180px', height: '180px', borderRadius: '10px' }} />
    //             </div>
    //             <div className="col-12 col-md-2 text-center">
    //               <Skeleton style={{ width: '180px', height: '180px', borderRadius: '10px' }} />
    //             </div>
    //             <div className="col-12 col-md-2 text-center">
    //               <Skeleton style={{ width: '180px', height: '180px', borderRadius: '10px' }} />
    //             </div>
    //             <div className="col-12 col-md-2 text-center">
    //               <Skeleton style={{ width: '180px', height: '180px', borderRadius: '10px' }} />
    //             </div>
    //             <div className="col-12 col-md-2 text-center">
    //               <Skeleton style={{ width: '180px', height: '180px', borderRadius: '10px' }} />
    //             </div>
    //             <div className="col-12 col-md-2 text-center">
    //               <Skeleton style={{ width: '180px', height: '180px', borderRadius: '10px' }} />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </section>
    //   </div>
    // </>
  );
}
