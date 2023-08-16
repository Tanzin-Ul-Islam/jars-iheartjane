import React from 'react'
import { IoIosArrowForward } from "react-icons/io"
import { useGetRelatedProductCmsQuery } from '../redux/api_core/apiCore';
import { useRouter } from 'next/router';
import Link from 'next/link';
function BannerRelatedProduct() {

  const router = useRouter();

  const relatedProduct = useGetRelatedProductCmsQuery();


  return (
    <div>
      <div className="bg-dark py-2 py-md-4 px-2 px-md-3">
        <div className="w-25 w-md-100 text-center text-md-start pt-4 pt-md-0">
          <h1 className="fs-60 fs-md-25 ff-PowerGrotesk700 text-site-blue-100 lh-55 lh-md-30 ms-0 ms-md-4">{relatedProduct?.data?.data[0]?.title }</h1>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between ms-0 ms-md-4 mt-0 mt-md-3 pb-4 pb-md-0">
          <p className="lh-10 text-center text-md-start fs-14">{relatedProduct?.data?.data[0]?.subTitle}</p>
          <Link className='d-flex me-3' style={{ cursor: 'pointer' }} href={'/shop'}>
            <p className="d-none d-md-block text-center text-md-start my-auto fs-14">{relatedProduct?.data?.data[0]?.buttonText}</p>
          </Link>

          <div className="d-flex justify-content-center d-md-none mt-2">
            <button className='btn btn-light py-1 border-0 rounded-pill fs-16 fs-md-12 text-site-black w-25'>{relatedProduct?.data?.data[0]?.buttonText}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BannerRelatedProduct