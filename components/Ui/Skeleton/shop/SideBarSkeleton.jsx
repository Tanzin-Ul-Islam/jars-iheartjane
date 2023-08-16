import React from 'react'
import Skeleton from "react-loading-skeleton";
import styles from "../../../../styles/Products.module.css";

export default function SideBarSkeleton({ toggleViewMode }) {
    return (
        <div className="col-lg-3">
            <div
                className={`offcanvas-lg z-index-2000 offcanvas-start ${toggleViewMode ? "show" : ""
                    }`}
            >
                <div className="offcanvas-body">
                    <div className="w-100">
                        <div className="mb-3" style={{ margin: "0px" }}>
                            <Skeleton className='w-100' style={{ height: "40px" }} />
                        </div>
                        <div
                            className="accordion"
                            id="accordionPanelsStayOpenExample"
                        >

                            {/* strain type */}
                            <Skeleton className='w-100' style={{ height: "250px" }} />
                            <hr className={`mx-3 my-3 ${styles.customHr}`} />

                            {/* brand */}
                            <Skeleton className='w-100' style={{ height: "250px" }} />
                            <hr className={`mx-3 my-3 ${styles.customHr}`} />
                            {/* potency */}
                            <Skeleton className='w-100' style={{ height: "250px" }} />
                            <hr className={`mx-3 my-3 ${styles.customHr}`} />

                            {/* weightList */}
                            <Skeleton className='w-100' style={{ height: "250px" }} />
                            <hr className={`mx-3 my-3 ${styles.customHr}`} />

                            {/* categoryList */}
                            <Skeleton className='w-100' style={{ height: "250px" }} />
                            <hr className={`mx-3 my-3 ${styles.customHr}`} />

                            {/* subCategoryList */}
                            <Skeleton className='w-100' style={{ height: "250px" }} />
                            <hr className={`mx-3 my-3 ${styles.customHr}`} />

                            {/* effectsList */}
                            <Skeleton className='w-100' style={{ height: "250px" }} />
                            <hr className={`mx-3 my-3 ${styles.customHr}`} />

                            {/* customMenus */}
                            <Skeleton className='w-100' style={{ height: "250px" }} />
                            <hr className={`mx-3 my-3 ${styles.customHr}`} />

                            {/* Today's Specials */}

                            <Skeleton className='w-100' style={{ height: "250px" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
