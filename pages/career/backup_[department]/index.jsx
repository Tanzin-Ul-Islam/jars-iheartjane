import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from "react";
import { FaBlackTie } from "react-icons/fa";
import { RiBook3Line } from "react-icons/ri";
import { useSelector } from 'react-redux';
import ErrorPage from "next/error";
import { useGetCareerContentDataMutation, useGetCareerDepartmentDetailsDataMutation } from '../../../redux/api_core/apiCore';
import HeaderTitles from '../../../components/HeaderTitles';
import Skeleton from 'react-loading-skeleton';
import Head from "next/head";
import Link from 'next/link';
import Loader from '../../../components/Loader';

export default function Department() {
    const router = useRouter();
    const departmentSlug = router.query?.department;
    let { pageMeta } = useSelector((store) => (store.globalStore));
    const [isCareerDepartmentExist, setIsCareerDepartmentExist] = useState(true);
    const [department, setDepartment] = useState({
        name: ''
    })
    const [careerDeparmentDetails, setCareerDeparmentDetails] = useState(
        {
            cmsData: [],
            careerList: [],
            isCareerDepartmentExist: false,
            isLoading: true
        }
    )
    const [activeLoader, setActiveLoader] = useState(true);
    const [getCareerContent] = useGetCareerContentDataMutation();
    const [getCareerDepartmentDetailsData] = useGetCareerDepartmentDetailsDataMutation();

    const getData = async () => {
        const cmsData = await getCareerContent();
        if (cmsData?.data?.data) {
            const deptList = cmsData?.data?.data?.careerDepartmentData;
            const department = deptList.find((department) => department.urlSlug === departmentSlug)
            if (department) {
                setDepartment(department)
                const { data } = await getCareerDepartmentDetailsData(`?departmentName=${encodeURIComponent(department?.name)}`);
                if (data?.data) {
                    setCareerDeparmentDetails({
                        ...data?.data,
                        isLoading: false
                    });
                }
            } else {
                setCareerDeparmentDetails((prevState) => ({ ...prevState, isLoading: false }))
                setIsCareerDepartmentExist(false)
            }
        }

    }

    useEffect(() => {
        if (departmentSlug) getData();
    }, [departmentSlug])

    useEffect(() => {
        setTimeout(() => {
            setActiveLoader(false);
        }, 2000)
    }, []);

    return (

        <>
            {activeLoader && <Loader />}
            <HeaderTitles title={'careerDepartmentPageTitle'} />
            <Head>
                <>
                    <meta
                        name="description"
                        content={pageMeta?.careerDepartmentPageMetaDescription}
                    />
                    <meta
                        name="keywords"
                        content={pageMeta?.careerDepartmentPageMetaKeyword}
                    />
                </>
            </Head>
            {
                !careerDeparmentDetails.isLoading ?
                    <>
                        {
                            isCareerDepartmentExist ?
                                <div className="container py-5">
                                    <h1 className="text-center ff-Soleil700 fs-36 fs-xs-25 mt-4 mt-md-0">{department.name}</h1>
                                    {
                                        (careerDeparmentDetails?.careerList?.length > 0) ? <p className="text-center ff-Soleil400">{careerDeparmentDetails?.careerList?.length} position {careerDeparmentDetails?.careerList?.length === 1 ? 'is' : 'are'} open now!</p>
                                            : <p className="text-center ff-Soleil400">Currently no position is open!</p>
                                    }

                                    {
                                        (careerDeparmentDetails?.careerList?.length > 0) ?
                                            <div className="row gy-4">
                                                {
                                                    (careerDeparmentDetails?.careerList?.length > 0) ? careerDeparmentDetails?.careerList?.map((el, index) => {
                                                        return (
                                                            <div className='col-12 col-lg-4' key={index}>
                                                                <Link href={'/career/' + departmentSlug + '/' + el.id} className="col">
                                                                    <div className="career_card h-100">
                                                                        <div className="career_card_text-box">
                                                                            <p className="mb-2 ff-Soleil400 fs-17"><FaBlackTie className="bg-transparent" />&nbsp;{el.jobType}</p>
                                                                            <p className="mb-3 ff-Soleil700 fs-22">{el.title}</p>
                                                                            <div className="d-flex align-items-start mb-4">
                                                                                <p className="mb-0 w-100 text-nowrap me-4"><i className="bi bi-geo-alt-fill me-1"></i>
                                                                                    {el.location}
                                                                                </p>
                                                                                <p className="mb-0 w-100"><RiBook3Line className="me-1" />
                                                                                    {el.salary ? el.salary : 'Negotiable'}
                                                                                </p>
                                                                            </div>
                                                                            <Link className="btn ApplyNow-btn py-3 px-4 mb-3" href={'/career/' + departmentSlug + '/' + el.id} >
                                                                                Apply Now
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        )
                                                    })
                                                        : "No Data found!!"
                                                }
                                            </div>
                                            : <></>
                                    }
                                </div>
                                : <ErrorPage statusCode={404} />
                        }

                    </>
                    :
                    <div>
                        <div className="container py-5">
                            <h3 className="text-center ff-Soleil700 fs-36 fs-xs-25 mt-4 mt-md-0">
                                <Skeleton style={{ width: "300px", height: "50px" }} />
                            </h3>
                            <p className="text-center ff-Soleil400">
                                <Skeleton style={{ width: "100px", height: "20px" }} />
                            </p>
                            <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 gy-4 mb-4">
                                <div className="col">
                                    <div className="h-100">
                                        <Skeleton style={{ width: "100%", height: "220px" }} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="h-100">
                                        <Skeleton style={{ width: "100%", height: "220px" }} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="h-100">
                                        <Skeleton style={{ width: "100%", height: "220px" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

            }

        </>
    )
}
