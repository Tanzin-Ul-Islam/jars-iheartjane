import React from 'react'
import { IoIosArrowForward } from "react-icons/io"
import { useGetHighDealsCmsQuery } from '../redux/api_core/apiCore';
import { useRouter } from 'next/router';
import HighDealsSlider from './SliderHighDeals';
import { useSelector } from 'react-redux';
function Slider_High_Deals() {

  const router = useRouter();
  const { highDetalsDataCheck } = useSelector((state) => (state.globalStore));

  const highDeals = useGetHighDealsCmsQuery();

  return (
    highDetalsDataCheck &&<div>
      <div className="bg-dark py-2 py-md-4" style={{ marginBottom: '35px' }}>
        <div className="w-25 w-md-100 text-center text-md-start pt-4 pt-md-0">
          <h1 className="fs-60 fs-md-25 ff-PowerGrotesk700 lh-55 lh-md-30 ms-0 ms-md-4">{highDeals?.data?.data[0]?.titleOne }</h1>
          <h1 className="fs-60 fs-md-25 ff-PowerGrotesk700 lh-55 lh-md-30 ms-0 ms-md-4">{highDeals?.data?.data[0]?.titleTwo }</h1>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between ms-0 ms-md-4 mt-0 mt-md-3 pb-4 pb-md-0">
          <p className="lh-10 text-center text-md-start fs-14">{highDeals?.data?.data[0]?.subTitle}</p>
          <div className='d-flex me-3' onClick={() => { router.push('/shop') }} style={{ cursor: 'pointer' }}>
            <p className="d-none d-md-block text-center text-md-start my-auto fs-14">{highDeals?.data?.data[0]?.buttonText}</p>
          </div>

          <div className="d-flex justify-content-center d-md-none mt-2">
            <button className='btn btn-light py-1 border-0 rounded-pill fs-16 fs-md-12 text-site-black w-25'>{highDeals?.data?.data[0]?.buttonText}</button>
          </div>
        </div>
      </div>
      <HighDealsSlider />
    </div>
  )
}

export default Slider_High_Deals