import React, { useEffect, useState } from 'react'
import { useGetPrivacyPolicyCmsQuery } from "../redux/api_core/apiCore";
import PrivacyCmsInterface from "../interfaces/PrivacyInterface";
import { useDispatch, useSelector } from 'react-redux';
import { setSiteLoader } from '../redux/global_store/globalReducer';
import Skeleton from 'react-loading-skeleton';
import HeaderTitles from '../components/HeaderTitles';
import Head from 'next/head';
import Link from "next/link";
import Loader from '../components/Loader';

const PrivacyPolicy = () => {

  const dispatch = useDispatch();
  const [activeLoader, setActiveLoader] = useState(true);

  const { data, isLoading, isSuccess, isFetching, error } = useGetPrivacyPolicyCmsQuery({});
  let Privacydata = data?.data[0];
  const { pageMeta, privacyComponentUI } = useSelector((store) => store.globalStore);

  useEffect(() => {
    setTimeout(() => {
      setActiveLoader(false);
    }, 2000)
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
      <HeaderTitles title={'privacyPageTitle'} />
      <Head>
        <meta
          name="description"
          content={pageMeta?.privacyPageMetaDescription}
        />
        <meta
          name="keywords"
          content={pageMeta?.privacyPageMetaKeyword}
        />
      </Head>
      {
        !isLoading ?
          <>
            {
              data?.data?.length > 0 &&
              <div style={{ backgroundColor: `${privacyComponentUI?.pageBackgroundColor}` }}>
                <section className="career-section py-5">
                  <div className="container">
                      <h2 className="ff-Soleil400 fs-17 section-title position-relative mb-4" style={{ color: `${privacyComponentUI?.pageBreadcrumbFontColor}` }}><Link
                      href="/">Home &nbsp;</Link>/<span className="mx-2">Privacy Policy</span></h2>

                    <div className='text-center'>
                      <picture>
                        <img height="80"
                          src="/images/logo.svg"
                          alt="Grower" />
                      </picture>
                    </div>
                    <div className='text-center mt-4'>
                      {Privacydata?.title ?
                        <h1 className='ff-Soleil700 fs-36' style={{ color: `${privacyComponentUI?.titleFontColor}` }}>{Privacydata?.title}</h1>
                        :
                        <Skeleton style={{ width: '250px', height: '30px' }} />
                      }
                    </div>


                    <div className="">
                      <div className='mt-5'>
                        {Privacydata?.description ?
                          <p className="ff-Soleil400 fs-17" style={{ color: `${privacyComponentUI?.descriptionFontColor}` }}>{Privacydata?.description}</p>
                          :
                          <Skeleton style={{ width: '100%', height: '250px' }} />
                        }
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            }
          </>
          :
          <div>
            <section className="career-section py-5">
              <div className="container">
                <h2 className="ff-Soleil400 fs-17 section-title position-relative mb-4"><Link
                  href="/home">Home</Link>/<Link className="mx-2" href="/terms-policy">Privacy Policy</Link></h2>

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
      }
    </>

  )
}

export default PrivacyPolicy
