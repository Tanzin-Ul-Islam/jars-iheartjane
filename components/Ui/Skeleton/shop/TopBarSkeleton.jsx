import React from 'react'
import Skeleton from "react-loading-skeleton";
import styles from "../../../../styles/Products.module.css";
import { BiFilterAlt, BiSearch } from "react-icons/bi";
import { RxDividerVertical } from "react-icons/rx";
import { RiArrowDropDownLine, RiFilterOffLine } from "react-icons/ri";
export default function TopBarSkeleton() {
    return (
        <>
            <div className="d-flex flex-column flex-lg-row justify-content-between">
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <div>
                        <div className="d-block nav-item dropdown">
                            <div>
                                <Skeleton width="100px" height="38px" className='px-2 px-lg-4 rounded-pill' />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <Skeleton width="100px" height="38px" className='px-2 px-lg-4 rounded-pill' />
                        </div>
                    </div>
                    {/* <div>
                        <div className=''>
                            <Skeleton width="100px" height="38px" className='px-2 px-lg-4 rounded-pill' />
                        </div >
                    </div>
                    <div>
                        <div className="d-block nav-item dropdown">
                            <div className=''>
                                <Skeleton width="100px" height="38px" className='px-2 px-lg-4 rounded-pill' />
                            </div >
                        </div>
                    </div> */}
                </div>
                <div >
                    <Skeleton width="300px" height="40px" className={`d-flex rounded-pill mt-3 mt-lg-3 ${styles.customSearchBox}`} />
                </div>
            </div>
            <div className="d-flex flex-row justify-content-between my-3">
            </div>
            <div className="d-flex justify-content-between align-items-center gap-2">
                <div className="d-block d-lg-none">
                    <Skeleton width="52px" height="24px" className='px-2 px-lg-4' />
                </div>
                <div className="d-none d-lg-block"></div>
                <div className="d-flex">
                    <Skeleton width="8rem" height="25px" className={`mb-2 fw-bold pe-none ${styles.filter_button}`} />
                </div>
            </div>

        </>

    )
}
