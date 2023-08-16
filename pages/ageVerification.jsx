import React, { useEffect, useState } from 'react'
import AgeModalLayout from '../components/ageModalLayout'
import styles from '../styles/Age.module.css';
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { setInitialPage } from '../redux/global_store/globalReducer';
import { useGetAgeVerificationCmsQuery } from '../redux/api_core/apiCore';
import Skeleton from 'react-loading-skeleton'
import { useRouter } from 'next/router';
import Head from "next/head";


const AgeVerification = () => {
  const [showText, setShowText] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [verificationText, setVerificationText] = useState("")
  const { pageMeta, landingComponentUI } = useSelector((store) => store.globalStore);
  const dispatch = useDispatch()
  const router = useRouter();

  const { data, isSuccess, isFetching, isLoading, error } = useGetAgeVerificationCmsQuery({});

  useEffect(() => {
    setIsChecked(data?.data[0]?.checkboxStatus);
  }, [data?.data[0]?.checkboxStatus])

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  }
  const handlerAgeVerificationTrue = (event) => {
    event.preventDefault()
    if (!isChecked) {
      setVerificationText('Please check the checkbox');
      setShowText(false)
    } else {
      dispatch(setInitialPage(true))
      localStorage.setItem("initial-page", true);
      router.push('/')
    }
  }
  const handleClick = () => {
    setShowText(true);
    setVerificationText("");
  }

  // useEffect(() => {
  //   localStorage.clear();
  // }, []);

  return (
    <>
    
      <Head>
        <meta
          name="description"
          content={pageMeta?.ageVerificationPageMetaDescription}
        />
        <meta
          name="keywords"
          content={pageMeta?.ageVerificationPageMetaKeyword}
        />
      </Head>
      <AgeModalLayout landingComponentUI={landingComponentUI}>
        {data?.data?.length > 0 ? <div className='text-white'>
          <div className='p-4'>
            <div className='text-center mb-5'>
              {/* <picture>
              <img src={data?.data[0]?.logo} height="120" />
            </picture> */}
              <picture>
                <img src={data?.data[0]?.logo} alt='JARS Cannabis' title='JARS Cannabis' />
              </picture>
            </div>
            <div className='text-center'>
              {/* <p className='my-auto fw-bold fs-18'>{data?.data[0]?.title}</p> */}
              <h2 className='fw-bold fs-24 mb-3 ff-Soleil700 text-site-yellow-200' style={{ color: `${landingComponentUI?.titleFontColor}` }}>{data?.data[0]?.title}</h2>
              {/* <p className='fs-16'>{data?.data[0]?.subTitle} </p> */}
              <div className={`form-check w-60 mx-auto`}>
                {
                  data?.data[0]?.isCheckboxShow &&
                  <input className={`form-check-input fs-14 shadow-none ${styles.custom_radio}`} type="radio" name="flexRadioDefault" value="" id="flexRadioDefault1" checked={isChecked} onChange={handleCheckboxChange} />
                }
                <label className="form-check-label fs-16 ff-Soleil400" htmlFor="flexRadioDefault1" style={{ color: `${landingComponentUI?.subTitleFontColor}` }}>
                  {data?.data[0]?.subTitle}
                </label>
              </div>
              <p className='fs-12 text-danger'>{verificationText}</p>
            </div>
            <div className='text-center ff-Soleil700 mb-4'>
              <button className={styles.enterButton} onClick={handlerAgeVerificationTrue} style={{ color: `${landingComponentUI?.buttonFontColor}`, backgroundColor: `${landingComponentUI?.buttonBackgroundColor}` }}>{data?.data[0]?.buttonOneText}</button>
              {
                data?.data[0]?.isNoButtonShow &&
                <button
                  className={`${styles.enterButton} ms-3`}
                  onClick={handleClick}
                  style={{ color: `${landingComponentUI?.buttonFontColor}`, backgroundColor: `${landingComponentUI?.buttonBackgroundColor}` }}
                >
                  {data?.data[0]?.buttonTwoText}
                </button>
              }
            </div>
            <div>
              <p className='fs-14 w-55 w-md-100 mx-auto text-center ff-Soleil400' style={{ color: `${landingComponentUI?.policyFontColor}` }}>By entering this site, you accept our use of cookies and agree to our
                <Link href="/privacy-policy" target="_blank" >
                  <b> Privacy Policy </b>
                </Link>
                and
                <Link href="/terms-policy" target="_blank" >
                  <b> Terms of Use. </b>
                </Link></p>
            </div>
            {/* <div className={`form-check my-3 ${styles.text_field}`}>
            <input className="form-check-input shadow-none border border-dark" type="checkbox" value="" id="flexCheckDefault" checked={isChecked}
              onChange={handleCheckboxChange} />
            <label className="form-check-label fs-12" htmlFor="flexCheckDefault">
              
                          
            </label>
            
                      
          </div> */}
            {/* <div className='d-flex justify-content-center gap-1'>
            <button type="button" className="btn btn-dark px-3" onClick={handlerAgeVerificationTrue}>{data?.data[0]?.buttonOneText}</button>
            <button type="button" className="btn btn-outline-dark px-3" onClick={handleClick}>{data?.data[0]?.buttonTwoText}</button>
          </div> */}
            {showText &&
              <div className='mt-3'>
                <p className='fs-12 text-danger fw-bold text-center'>You are not old enough to view this content</p>
              </div>
            }
          </div>
        </div>
          :
          <div className='text-white'>
            <div className='p-4'>
              <div className='text-center mb-5'>
                {/* <picture>
              <img src={data?.data[0]?.logo} height="120" />
            </picture> */}
                <picture>
                  <Skeleton style={{ width: "198px", height: '69px' }} />
                </picture>
              </div>
              <div className='text-center'>
                {/* <p className='my-auto fw-bold fs-18'>{data?.data[0]?.title}</p> */}
                <p className='fw-bold fs-24 mb-3 ff-Soleil700 text-site-yellow-200'>
                  <Skeleton style={{ width: "216px", height: '26px' }} />
                </p>
                {/* <p className='fs-16'>{data?.data[0]?.subTitle} </p> */}
                <Skeleton style={{ width: "384px", height: '20px' }} />
                <Skeleton style={{ width: "130px", height: '20px' }} />
                <p className='fs-12 text-danger'>{verificationText}</p>
              </div>
              <div className='text-center ff-Soleil700 mb-4'>
                <Skeleton style={{ width: "143px", height: '34px', borderRadius: "50px" }} />
              </div>
              <div>
                <p className='fs-14 w-55 w-md-100 m-auto text-center ff-Soleil400 d-flex flex-column align-items-center'>
                  <Skeleton style={{ width: "354px", height: '20px' }} />
                  <Skeleton style={{ width: "283px", height: '20px' }} />
                </p>

              </div>
              {/* <div className={`form-check my-3 ${styles.text_field}`}>
            <input className="form-check-input shadow-none border border-dark" type="checkbox" value="" id="flexCheckDefault" checked={isChecked}
              onChange={handleCheckboxChange} />
            <label className="form-check-label fs-12" htmlFor="flexCheckDefault">
              
                          
            </label>
            
                      
          </div> */}
              {/* <div className='d-flex justify-content-center gap-1'>
            <button type="button" className="btn btn-dark px-3" onClick={handlerAgeVerificationTrue}>{data?.data[0]?.buttonOneText}</button>
            <button type="button" className="btn btn-outline-dark px-3" onClick={handleClick}>{data?.data[0]?.buttonTwoText}</button>
          </div> */}
              {showText &&
                <div className='mt-3'>
                  <p className='fs-12 text-danger fw-bold text-center'>You are not old enough to view this content</p>
                </div>
              }
            </div>
          </div>
        }

      </AgeModalLayout>
    </>

  )
}

export default AgeVerification
