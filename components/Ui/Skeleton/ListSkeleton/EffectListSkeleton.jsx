import React from 'react'
import Skeleton from "react-loading-skeleton";
import styles from "../../../../styles/Products.module.css";
export default function EffectListSkeleton() {
    return (
        <div className='col-6 col-lg-12 mb-3'>
            <Skeleton width="88px" height="30px" className='px-2 px-lg-4' />
        </div>
    )
}
