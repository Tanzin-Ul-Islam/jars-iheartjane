import React from 'react'
import Skeleton from "react-loading-skeleton";
import styles from "../../../../styles/Products.module.css";
export default function CategoryListSkeleton() {
    return (
        <div className='col-6 fs-14 d-flex align-items-center gap-3'>
            <Skeleton width="88px" height="30px" className='px-2 px-lg-4' />
        </div>
    )
}
