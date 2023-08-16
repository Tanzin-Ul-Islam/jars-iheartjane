import React, { useState, useEffect, useRef } from 'react';
import {
    FaFacebook,
    FaGlobeAsia,
    FaInstagram,
    FaLinkedin,
    FaRegThumbsUp,
    FaTwitter,
    FaPinterest
} from 'react-icons/fa';
import Button from '../../../components/Button';
import Link from 'next/link';
import Input, { Select } from '../../../components/Input';
import { BiDollar } from 'react-icons/bi';
import { BsListTask } from 'react-icons/bs';
import { AiTwotoneCar } from 'react-icons/ai';
import Nav from '../Nav';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import HeaderTitles from '../../../components/HeaderTitles';
import Head from 'next/head';
import { showLoader } from '../../../utils/helper';
import { fetchData, postData } from '../../../utils/FetchApi';
import { FacebookShareButton, TwitterShareButton, PinterestShareButton, LinkedinShareButton, InstapaperShareButton } from 'react-share';
import api from "../../../config/api.json";
import parse from 'html-react-parser';
import { createToast } from '../../../utils/toast';
import Loader from '../../../components/Loader';

const index = () => {

    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();
    let { siteLoader, pageMeta } = useSelector((store) => (store.globalStore));
    const [retailserName, setRetailerName] = useState("");


    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        termsAndCondition: "",
    });

    let [applicationData, setApplicationData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        contactType: "Home",
        preferredCommunicationMethod: "Email",
        applicantCommunicationPolicy: "Yes, I agree to be contacted by text messages",
        termsAndCondition: false,
    });

    const [cmsData, setCmsData] = useState({});
    const [careerDetailsData, setCareerDetailsData] = useState({});
    const [hasData, setHasData] = useState(false);

    async function getData() {
        try {
            let response = await fetchData(api.career.careerDetails + id);
            if (response.statusCode == 200) {
                let data = response.data;
                const cmsData = data.cmsData?.length > 0 ? data.cmsData[0] : {};
                const careerData = data?.careerDetailsData?.length > 0 ? data?.careerDetailsData[0] : {}
                if (data?.careerDetailsData?.length > 0) {
                    setHasData(true);
                } else {
                    setHasData(false);
                }
                setCmsData(cmsData);
                setCareerDetailsData(careerData);
                setApplicationData((prevState) => ({
                    ...prevState,
                    jobTitle: careerData.title,
                }));
            }
        } catch (error) {
            console.log(error)
        }
    }

    function handleInput(event) {
        setApplicationData({
            ...applicationData,
            [event.target.name]: event.target.value,
        });
    }

    

    function validateForm() {
        let iserror = false;
        if (!applicationData.firstName) {
            setErrors((prevState) => ({
                ...prevState,
                firstName: "Please provide first name.",
            }));
            iserror = true;
        } else {
            setErrors((prevState) => ({ ...prevState, firstName: "" }));
        }

        if (!applicationData.lastName) {
            setErrors((prevState) => ({
                ...prevState,
                lastName: "Please provide last name.",
            }));
            iserror = true;
        } else {
            setErrors((prevState) => ({ ...prevState, lastName: "" }));
        }

        if (!applicationData.email) {
            setErrors((prevState) => ({
                ...prevState,
                email: "Please provide email.",
            }));
            iserror = true;
        } else {
            setErrors((prevState) => ({ ...prevState, email: "" }));
        }
        if (!applicationData.contactNumber) {
            setErrors((prevState) => ({
                ...prevState,
                contactNumber: "Please provide contact no.",
            }));
            iserror = true;
        } else {
            setErrors((prevState) => ({ ...prevState, contactNumber: "" }));
        }

        if (!applicationData.termsAndCondition) {
            setErrors((prevState) => ({
                ...prevState,
                termsAndCondition: "Please checked privacy policy.",
            }));
            iserror = true;
        } else {
            setErrors((prevState) => ({ ...prevState, termsAndCondition: "" }));
        }

        if (iserror == true) {
            return false;
        } else {
            return true;
        }
    }

    async function handleFormSubmit(event) {
        try {
            event.preventDefault();
            if (validateForm()) {
                showLoader();
                const response = await postData(api.career.careerApplication, applicationData);
                if (response?.data?.statusCode === 201) {
                    setApplicationData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        contactNumber: "",
                        contactType: "",
                        preferredCommunicationMethod: "",
                        applicantCommunicationPolicy: "",
                        termsAndCondition: false,
                    });
                    createToast("Application submitted successfully.", "success");
                } else {
                    createToast("Something went wrong! Please try again.", "error");
                }
            }
        } catch (error) {
            createToast("Something went wrong! Please try again.", "error");
        }
    }

    let currentPageURL = '';

    if (typeof window !== 'undefined') {
        currentPageURL = location.href;
        // currentPageURL = 'https://jars.1space.co/article/7-strains-to-elevate-your-outdoor-adventures';
    }

    useEffect(() => {
        const retailerInfo = JSON.parse(localStorage.getItem('selected-retailer'));

        if (router.isReady) {
            setRetailerName(retailerInfo?.name);
            getData();
        }
    }, [id]);

    return (
        <>
            {
                careerDetailsData?.title ?
                    <>
                        <HeaderTitles title={'careerDetailsPageTitle'} />
                        <Head>
                            <>
                                <meta
                                    name="description"
                                    content={pageMeta?.careerDetailsPageMetaDescription}
                                />
                                <meta
                                    name="keywords"
                                    content={pageMeta?.careerDetailsPageMetaKeyword}
                                />
                            </>
                        </Head>
                        <div className="container py-2">
                            <Nav singleJob={true} jotTitle={careerDetailsData?.title} />
                            <div className="row mt-4">
                                <div className="col-lg-7 pe-4">
                                    <ul className="row my-4 p-0">
                                        {[
                                            {
                                                icon: <FaGlobeAsia />,
                                                title: `${careerDetailsData?.location ? careerDetailsData?.location : ''}`,
                                            },
                                            {
                                                icon: <BiDollar />,
                                                title: `${careerDetailsData?.salary ? careerDetailsData?.salary : ''}`,
                                            },
                                            // {
                                            //     icon: <BsListTask />,
                                            //     title: 'Hourly',
                                            // },
                                            {
                                                icon: <AiTwotoneCar />,
                                                title: `${careerDetailsData?.jobType ? careerDetailsData?.jobType : ''}`,
                                            },
                                        ].map((item, i) => (
                                            <li
                                                key={i}
                                                className="col-sm-6 col-md-3 d-flex align-items-center list-unstyled italic"
                                            >
                                                {item.icon}
                                                <p className="m-0 ms-2">{item.title}</p>
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="italic">
                                        <FaRegThumbsUp />
                                        {careerDetailsData?.shortDescription ? careerDetailsData?.shortDescription : ''}
                                    </p>
                                    <div className="text-center border-2 border-dark border-bottom pb-3">
                                        <Link href={`mailto:?subject=${retailserName};body=${currentPageURL}`} className="bg-black rounded-3 text-white px-5 py-2 mx-auto btn ff-Soleil700">
                                            Email Me This Job
                                        </Link>
                                    </div>

                                    <div className="mt-5">
                                        {parse(`${careerDetailsData?.description}`)}
                                    </div>
                                </div>
                                <div className="col-lg-5">
                                    <div
                                        className="nav-border p-3 rounded"
                                        style={{ height: 'fit-content' }}
                                    >
                                        <div className="text-center mt-3">
                                            <h5 className="fw-bold">Apply Now</h5>
                                            <p>with our quick 3 minute Application!</p>
                                        </div>

                                        <span style={{ fontSize: '14px' }}>* Fields Are Required</span>
                                        <div>
                                            <label htmlFor="name" className="fw-bold">
                                                What is your full name?
                                            </label>
                                            <div className="d-flex gap-3">
                                                <Input name="firstName" handleInput={handleInput} type="text" placeholder="First Name*" errors={errors.firstName} />
                                                <Input name="lastName" handleInput={handleInput} type="text" placeholder="Last Name*" errors={errors.lastName} />
                                            </div>
                                            <label htmlFor="email" className="fw-bold">
                                                How can we contact you?
                                            </label>
                                            <div>
                                                <Input name="email" handleInput={handleInput} type="email" placeholder="Email*" errors={errors.email} />
                                                <div className="d-flex gap-3">
                                                    <Input name="contactNumber" handleInput={handleInput} type="tel" placeholder="Phone Number*" errors={errors.contactNumber} wth="75%" />
                                                    <Select name="contactType" handleInput={handleInput} options={options} cls="px-3" />
                                                </div>
                                            </div>
                                            <label htmlFor="" className="fw-bold my-2">
                                                What is your preferred method of communication?
                                            </label>
                                            <div>
                                                <Select name="preferredCommunicationMethod" handleInput={handleInput} options={['Email', 'Text Message']} cls="w-100" />
                                            </div>

                                            <label htmlFor="" className="fw-bold my-2">
                                                Please indicate if you agree to isolved Applicant Tracking's
                                                <br /> <a href="#">Applicant Communication Policy.</a>
                                            </label>
                                            <Select name="applicantCommunicationPolicy" handleInput={handleInput}
                                                options={[
                                                    'Yes, I agree to be contacted by text messages',
                                                    'No, I do not agree to receive text messages',
                                                ]}
                                                cls="w-100"
                                            />

                                            <p className="fw-bold my-3">
                                                <input name="termsAndCondition" onChange={() => (setApplicationData({ ...applicationData, termsAndCondition: !applicationData.termsAndCondition }))} type="checkbox" className="me-2" />I agree to isolved
                                                Applicant Tracking's Applicant Information Use Policy.*
                                                {
                                                    errors.termsAndCondition && (
                                                        <div>
                                                            <span className="text-danger mt-2 fs-12">
                                                                *&nbsp;{errors.termsAndCondition}
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                            </p>
                                            <div>
                                                <button type="submit" onClick={handleFormSubmit} className={`bg-black text-white px-5 py-2 btn ff-Soleil700 w-100`}>
                                                    Apply for this Position
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" mt-5">
                                        <div className="border border-dark rounded-2">
                                            <h6 className="fw-bold px-2 py-1 ff-Soleil700">Resources</h6>
                                            <Link href="/career/jobsByLocation">
                                                <p className="m-0 p-2 border border-dark rounded-2 _linear-bg ff-Soleil400">
                                                    &gt; Jobs by Location
                                                </p>
                                            </Link>
                                        </div>
                                        <div className="border border-dark rounded-2 mt-4">
                                            <h6 className="fw-bold px-2 py-1 ff-Soleil700">
                                                Share This Page
                                            </h6>
                                            <div className="d-flex gap-3 p-2 border border-dark rounded-2 _linear-bg ">

                                                <FacebookShareButton url={currentPageURL} quote="Please share this page" hashtag="#code">
                                                    <div className='cp'>
                                                        <FaFacebook className="fs-4" />
                                                    </div>
                                                </FacebookShareButton>
                                                <TwitterShareButton url={currentPageURL} quote="Please share this article" hashtag="#code">
                                                    <div className='cp'>
                                                        <FaTwitter className="fs-4" />
                                                    </div>
                                                </TwitterShareButton>
                                                <LinkedinShareButton url={currentPageURL} quote="Please share this article" hashtag="#code">
                                                    <div className='cp'>
                                                        <FaLinkedin className="fs-4" />
                                                    </div>
                                                </LinkedinShareButton>
                                                <PinterestShareButton url={currentPageURL} quote="Please share this article" hashtag="#code" media={currentPageURL} >
                                                    <div className='cp'>
                                                        <FaPinterest className="fs-4" />
                                                    </div>
                                                </PinterestShareButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <><Loader /></>
            }
        </>
    );
};

export default index;
const options = ['Home', 'Cell', 'Work'];

