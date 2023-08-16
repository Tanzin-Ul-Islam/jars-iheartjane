import React from 'react'
import styles from './css/Banner.module.css';
import componentInfo from '../../cms-data/componentCms'
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';

function Banner({ commonBannerCmsData }) {
  let router = useRouter();
  return (
    commonBannerCmsData?.id ?
    <div className="container-xxl px-0">
      <div className={`global-common-banner`} style={{background: `url(${commonBannerCmsData?.image})`, backgroundColor:commonBannerCmsData?.imageBackgroundColor}}>
        <div className="row m-0 align-items-center py-1">
          <div className="col-12 col-md-3"></div>
          <div className="col-12 col-md-6">
            <div className='text-site-white text-center py-3'>
              <h3 className='fs-24 fs-md-18 ff-PowerGrotesk700'>{commonBannerCmsData?.title}</h3>
              <p className="fs-16 fs-md-12 mb-0">
                <span className="text-site-yellow-200 me-1">Members Access Only.</span>
                {commonBannerCmsData?.subTitle}</p>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className='my-auto text-center text-md-end px-lg-4 pb-4 pb-md-0'>
              <Link
                  href={commonBannerCmsData?.buttonLink ? commonBannerCmsData?.buttonLink : ''}
                className={`px-5 py-1 border-0 rounded-pill fs-16 fs-md-12 fw-bold ${styles.commonBannerButton}`}
                style={{ background: '#D9D29A' }}
              >
                {commonBannerCmsData?.buttonText}
              </Link>
            </div>
          </div>

        </div>
      </div>


    </div>
    :
    <>
      <div className="container-xxl px-0">
        <Skeleton style={{ width: '100%', height: '130px' }} />
      </div>
    </>
  )
}

export default Banner
