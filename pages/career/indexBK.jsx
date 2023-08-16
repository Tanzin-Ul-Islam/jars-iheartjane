import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCareerContentQuery } from '../../redux/api_core/apiCore';
import { setSiteLoader } from '../../redux/global_store/globalReducer';
import HeaderTitles from '../../components/HeaderTitles';
import Skeleton from 'react-loading-skeleton';
import Head from "next/head";
import Link from 'next/link';
import Loader from '../../components/Loader';

export default function Career() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [activeLoader, setActiveLoader] = useState(true);
    let { data, isLoading, isFetching } = useGetCareerContentQuery();
    let { siteLoader, pageMeta } = useSelector((store) => (store.globalStore));
    let departments = (data?.data?.careerDepartmentData?.length > 0) ? data.data.careerDepartmentData : [];
    let cms = (data?.data?.cmsData?.length > 0) ? data?.data?.cmsData[0] : {};

    useEffect(() => {
        setTimeout(() => {
            setActiveLoader(false);
        }, 2000)
    }, []);

    return (
        <>
            {activeLoader && <Loader />} 
            <HeaderTitles title={'careerPageTitle'} />
            <Head>
                <>
                    <meta
                        name="description"
                        content={pageMeta?.careerPageMetaDescription}
                    />
                    <meta
                        name="keywords"
                        content={pageMeta?.careerPageMetaKeyword}
                    />
                </>
            </Head>
            {
                !isLoading ?
                    <div>
                        <div className="container py-5">
                            <h1 className="text-center ff-Soleil700 fs-36 fs-xs-25 mt-4 mt-md-0">{cms.departmentPageTitle}</h1>
                            {(departments?.length > 0) ? <p className="text-center ff-Soleil400">{data?.data?.totalCount} job{(data?.data?.totalCount == 1 ? + '' : 's')} live.</p> : <></>}
                            <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 gy-4 mb-4">
                                {
                                    (departments?.length > 0) ? departments.map((el, index) => {
                                        return (
                                            <Link className="col" key={index} href={'/career/' + el.urlSlug}>
                                                <div className="career_card h-100">
                                                    <div className="career_card_img_box">
                                                        <picture>
                                                            <img src={el.logo} width="40" height="40" />
                                                        </picture>
                                                    </div>
                                                    <div className="career_card_text-box">
                                                        <p className="mb-1 ff-Soleil700 fs-20 fs-md-18 fs-sm-16">{el.name}</p>
                                                        <p className="mb-0 ff-Soleil400 fs-15">( {el.count} Open Positions )</p>
                                                    </div>
                                                    <i className="bi bi-chevron-right"></i>
                                                </div>
                                            </Link>
                                        )
                                    }) : <></>
                                }

                                {
                                    departments?.length == 0 ?
                                        <div className='row mt-4' style={{ position: 'relative', margin: '0 auto' }}>
                                            <div className="col-12" role="alert">
                                                <p className='text-center fs-18 fw-bold'>No data found!</p>
                                            </div>
                                        </div>
                                        : <></>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <>                      
                        <div>
                            <div className="container py-5">
                                <h3 className="text-center ff-Soleil700 fs-36 fs-xs-25 mt-4 mt-md-0">
                                    <Skeleton style={{ width: "400px", height: "50px" }} />
                                </h3>
                                <p className="text-center ff-Soleil400">
                                    <Skeleton style={{ width: "100px", height: "20px" }} />
                                </p>
                                <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 gy-4 mb-4">
                                    <div className="col">
                                        <div className="h-100">
                                            <Skeleton style={{ width: "100%", height: "90px" }} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="h-100">
                                            <Skeleton style={{ width: "100%", height: "90px" }} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="h-100">
                                            <Skeleton style={{ width: "100%", height: "90px" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </>

    )
}