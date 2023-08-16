import React from 'react'
import Skeleton from "react-loading-skeleton";
export default function HomeSliderOneSkeleton() {
    return (
        <div className="row">
            <div className="col-12 col-md-4 col-lg-4">
                <Skeleton width="100%" height="466px" />
            </div>
            <div className="col-12 col-md-4 col-lg-4">
                <Skeleton width="100%" height="466px" />
            </div>
            <div className="col-12 col-md-4 col-lg-4">
                <Skeleton width="100%" height="466px" />
            </div>
        </div>
    )
}
