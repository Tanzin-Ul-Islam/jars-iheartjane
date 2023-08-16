import React, { useEffect, useState } from 'react'
import { useGetCookiesSettingsCmsQuery, } from "../redux/api_core/apiCore";
import CookiesCmsInterface from "../interfaces/CookiesInterface";
import { useDispatch, useSelector } from 'react-redux';
import { setSiteLoader } from '../redux/global_store/globalReducer';
import Skeleton from 'react-loading-skeleton';
import HeaderTitles from '../components/HeaderTitles';
import Head from "next/head";
import Link from "next/link";
import Loader from '../components/Loader';
const CookiesSettings = () => {
  const { pageMeta, cookieComponentUI } = useSelector((store) => (store.globalStore));
  const dispatch = useDispatch();
  const [activeLoader, setActiveLoader] = useState(true);

  const { data, isLoading, isSuccess, isFetching, error } = useGetCookiesSettingsCmsQuery({});

  let Cookiesdata = data?.data[0];

  useEffect(() => {
    setTimeout(() => {
      setActiveLoader(false);
    }, 2000);
    try {
      dispatch(setSiteLoader(true))
      if (data?.data?.length > 0) {
        dispatch(setSiteLoader(false))
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setSiteLoader(false))
    }
  }, []);

  return (
    <>
      {activeLoader && <Loader />} 
      <HeaderTitles title={'cookiesSettingsPageTitle'} />
      <Head>
        <>
          <meta
            name="description"
            content={pageMeta?.cookiesSettingsPageMetaDescription}
          />
          <meta
            name="keywords"
            content={pageMeta?.cookiesSettingsPageMetaKeyword}
          />
        </>
      </Head>
      {
        !isLoading ?
          <>
            {
              data?.data?.length > 0 &&
              <div style={{ backgroundColor: `${cookieComponentUI?.pageBackgroundColor}` }}>
                <section className="career-section py-5">
                  <div className="container">
                    <h2 className="ff-Soleil400 fs-17 section-title position-relative mt-3 mb-4" style={{ color: `${cookieComponentUI?.pageBreadcrumbFontColor}` }}><Link
                      href="/">Home &nbsp;</Link>/<span className="mx-2">Cookies Settings</span></h2>

                    <div className='text-center'>
                      <picture>
                        <img height="80"
                          src="/images/logo.svg"
                          alt="Grower" />
                      </picture>
                    </div>
                    <div className='text-center mt-4'>
                      {Cookiesdata?.title ?
                        <h1 className='ff-Soleil700 fs-36' style={{ color: `${cookieComponentUI?.titleFontColor}` }}>{Cookiesdata?.title}</h1>
                        :
                        <Skeleton style={{ width: '250px', height: '30px' }} />
                      }
                    </div>


                    <div className="">
                      <div className='mt-5'>
                        {Cookiesdata?.description ?
                          <p className="ff-Soleil400 fs-17" style={{ color: `${cookieComponentUI?.descriptionFontColor}` }}>{Cookiesdata?.description}</p>
                          :
                          <Skeleton style={{ width: '100%', height: '250px' }} />
                        }
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            }
          </> :
          <>
            <div>
              <section className="career-section py-5">
                <div className="container">
                  <h2 className="ff-Soleil400 fs-17 section-title position-relative mb-4"><Link
                    href="/home">Home</Link>/<Link className="mx-2" href="/terms-policy">Cookies Settings</Link></h2>
                  <div className='text-center'>
                    <picture>
                      <Skeleton style={{ width: '80px', height: '80px', borderRadius: '100%' }} />
                    </picture>
                  </div>
                  <div className='text-center mt-4'>
                    <Skeleton style={{ width: '250px', height: '30px' }} />
                  </div>
                  <div className="">
                    <div className='mt-5'>
                      <Skeleton style={{ width: '100%', height: '250px' }} />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
      }
    </>

  )
}

export default CookiesSettings
