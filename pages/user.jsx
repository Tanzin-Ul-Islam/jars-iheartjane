import React from "react";
import Link from "next/link"
import Banner from "../components/Banner";
import styles from "../styles/User.module.css";
import { useState, useEffect } from "react";
import { HiOutlineChevronRight } from "react-icons/hi"
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { BsWallet2 } from "react-icons/bs";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FiCompass } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";
import { BiHelpCircle } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import { GrHomeRounded } from "react-icons/gr";
import userInfo from "../cms-data/userCms";
import { fetchData, patchData } from "../utils/FetchApi";
import api from "../config/api.json";
import { useDispatch, useSelector } from "react-redux";
import { setSiteLoader, setUserInfo } from "../redux/global_store/globalReducer";
import { useRouter } from "next/router";
import { useGetAllOrderMutation, useGetUserPageBannerCmsQuery, useGetUserPageBannerComponentUIQuery } from "../redux/api_core/apiCore";
import { createToast } from "../utils/toast";
import UserSidebar from "../components/userSidebar";
import { formatDate, isValidUSMobileNumber, removeUSCountryCode, retialerNameSlug } from "../utils/helper";
import HeaderTitles from "../components/HeaderTitles";
import Head from "next/head";
import Loader from "../components/Loader";
import WishlistCard from "../components/WishlistCard";

function User() {
    const dispatch = useDispatch();
    const { commonBannerCmsData, userInfo: checkUserInfo } = useSelector((store) => store.globalStore);
    let { wishlist, wishlistCounter } = useSelector((store) => (store.wishlistStore));
    //get orders
    const [getAllOrder, { data: result, isLoading, isError }] = useGetAllOrderMutation();
    const latestOrder = result?.data?.length > 0 ? result?.data[0] : {};

    // user banner cms and component ui
    const userBannerCms = useGetUserPageBannerCmsQuery();
    const userBannerComponentUI = useGetUserPageBannerComponentUIQuery();

    const [image, setImage] = useState(null);
    const [profileImage, setprofileImage] = useState("");
    const [userId, setUserId] = useState("");
    const [isProfileUploadBtnShow, setIsProfileUploadBtnShow] = useState(false);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        createdAt: ''
    });
    const [updateInfo, setUpdateInfo] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        birthdayDate: "",
    });

    const getUserData = async () => {
        const localStorageData = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (localStorageData) {
            setUserId(localStorageData);
        }
        try {
            let response = await fetchData(api.user.getUserDetails + localStorageData, token);
            dispatch(setSiteLoader(true));
            if (response) {
                setUserData(response?.data);
                let data = {
                    firstName: response?.data?.firstName,
                    lastName: response?.data?.lastName,
                    phone: response?.data?.phone,
                    birthdayDate: response?.data?.birthdayDate,
                }
                setUpdateInfo({ ...data })
                setprofileImage(response?.data?.image);
                dispatch(setSiteLoader(false));
            }
        } catch (error) {
            dispatch(setSiteLoader(false));
        } finally {
            dispatch(setSiteLoader(false));
        }
    };

    function handleUpdateInfoChange(e) {
        setUpdateInfo((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
    }

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleSaveChange = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token") ?? "";
        if (token) {

            if (isValidUSMobileNumber(updateInfo?.phone)) {
                const numberWithoutCountryCode = removeUSCountryCode(updateInfo?.phone);

                await patchData(api.user.updateUserProfile, { ...updateInfo, phone: numberWithoutCountryCode }, token).then(response => {
                    if (response.data.statusCode == 200) {
                        document.getElementById("close-btn").click();
                        let data = response.data.data;
                        localStorage.setItem('firstName', data?.firstName);
                        localStorage.setItem('lastName', data?.lastName);
                        localStorage.setItem('birthdayDate', data?.birthdayDate);
                        localStorage.setItem('phone', data?.phone);
                        localStorage.setItem('image', data?.image);
                        setUserData({ ...data });
                        let reduxUserInfo = {
                            id: data?.id,
                            firstName: data?.firstName,
                            lastName: data?.lastName,
                            email: data?.email,
                            phone: data?.phone,
                            birthdayDate: data?.birthdayDate,
                        }
                        dispatch(setUserInfo(reduxUserInfo));
                        let userInfo = {
                            firstName: data?.firstName,
                            lastName: data?.lastName,
                            phone: data?.phone,
                            birthdayDate: data?.birthdayDate,
                        }
                        setUpdateInfo({ ...userInfo });
                        setprofileImage(data?.image);
                        createToast(response.data.message, 'success');
                    }
                });
            } else {
                createToast("Invalid Number", 'error');
            }


        }
    };

    const updateProfileImage = async () => {
        let formData = new FormData();
        formData.append("image", image, image.name);
        const token = localStorage.getItem("token") ?? "";
        if (token) {
            try {
                const response = await patchData(api.user.updateUserProfile, formData, token);
                dispatch(setSiteLoader(true));
                if (response.status === 200) {
                    setIsProfileUploadBtnShow(false);
                    createToast('Image uploaded successfully', 'success');
                    dispatch(setSiteLoader(false));
                }
            } catch (error) {
                dispatch(setSiteLoader(false));
            } finally {
                dispatch(setSiteLoader(false));
            }
        }
    };

    const { token, siteLoader, selectedRetailer, pageMeta } = useSelector((state) => state.globalStore);
    const router = useRouter();

    useEffect(() => {
        dispatch(setSiteLoader(false));
        const jwtToken = localStorage.getItem("token");
        if (!jwtToken) {
            router.push('/login');
        } else {
            getUserData();
        }
    }, []);

    useEffect(() => {

        let data = {
            retailerId: JSON.parse(localStorage.getItem('selected-retailer'))?.id,
            email: localStorage.getItem('email'),
        }
        if (selectedRetailer != 'undefined') getAllOrder({ data });

    }, [selectedRetailer])

    return (
        token === 'undefined' ? '' :
            <div>
                {!checkUserInfo && <Loader />}
                <HeaderTitles title={'profilePageTitle'} />
                <Head>
                    <meta
                        name="description"
                        content={pageMeta?.profilePageMetaDescription}
                    />
                    <meta
                        name="keywords"
                        content={pageMeta?.profilePageMetaKeyword}
                    />
                </Head>
                {/* <section>
                    <Banner commonBannerCmsData={commonBannerCmsData} />
                </section> */}
                {
                    userBannerCms?.data?.data[0]?.isImageOrColor ?
                        <section className={`container`} style={{ backgroundColor: `${userBannerCms?.data?.data[0]?.imageBackgroundColor}` }}>
                            <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-around py-5 py-md-3 learboardBannerImage" style={{ backgroundImage: `url(${userBannerCms?.data?.data[0]?.image})`, backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
                                <div className='learboardBannerTextImage'>
                                    <div className="text-center text-lg-start text-white">
                                        <h2 className="fs-24 fs-md-22 ff-Soleil700" style={{ color: `${userBannerComponentUI?.data?.data[0]?.titleFontColor}` }}>{userBannerCms?.data?.data[0]?.title}</h2>
                                        <p className="fs-16 ff-Soleil400" style={{ color: `${userBannerComponentUI?.data?.data[0]?.subTitleFontColor}` }}>{userBannerCms?.data?.data[0]?.subTitle}</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center userLearboardBannerButtonImage">
                                    <Link href={userBannerCms?.data?.data[0]?.buttonLink || ""} className='mx-auto btn px-5 py-2 border-0 rounded-pill fs-16 fs-md-14 fw-bold' style={{ backgroundColor: `${userBannerComponentUI?.data?.data[0]?.buttonBackgroundColor}`, color: `${userBannerComponentUI?.data?.data[0]?.buttonFontColor}` }}>{userBannerCms?.data?.data[0]?.buttonText}</Link>
                                </div>
                            </div>
                        </section>
                        :
                        <section className={`container`}>
                            <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-around py-5 py-md-3 learboardBannerColor" style={{ backgroundColor: `${userBannerCms?.data?.data[0]?.bgColor}` }}>
                                <div className='learboardBannerTextColor'>
                                    <div className="text-center text-lg-start text-white">
                                        <h2 className="fs-24 fs-md-22 ff-Soleil700" style={{ color: `${userBannerComponentUI?.data?.data[0]?.titleFontColor}` }}>{userBannerCms?.data?.data[0]?.title}</h2>
                                        <p className="fs-16 ff-Soleil400" style={{ color: `${userBannerComponentUI?.data?.data[0]?.subTitleFontColor}` }}>{userBannerCms?.data?.data[0]?.subTitle}</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center learboardBannerButtonColor">
                                    <Link href={userBannerCms?.data?.data[0]?.buttonLink || ""} className='mx-auto btn px-5 py-2 border-0 rounded-pill fs-16 fs-md-14 fw-bold' style={{ backgroundColor: `${userBannerComponentUI?.data?.data[0]?.buttonBackgroundColor}`, color: `${userBannerComponentUI?.data?.data[0]?.buttonFontColor}` }}>{userBannerCms?.data?.data[0]?.buttonText}</Link>
                                </div>
                            </div>
                        </section>
                }
                <section className="container">
                    <div className="row">
                        <UserSidebar />
                        <div className="col-12 col-lg-9">
                            <div className="ms-lg-5 w-90 mx-auto">
                                <div className={styles.head_section}>
                                    <h1 className="fs-30 fs-md-21 ff-Soleil700 ms-3">{userInfo.account_greeting}</h1>
                                    <p className="fs-24 fs-md-16 ff-Soleil700 mt-5 ms-3">
                                        <span>
                                            {/* <FaRegEdit className="fs-28 fs-md-20" /> */}
                                            {/* <img src="/images/purchase-lg.svg" /> */}
                                            <img src="/images/nav-icons/List.svg" style={{ height: '38px' }} />
                                        </span>{" "}
                                        &nbsp;&nbsp;{userInfo.purchase_history_text}
                                    </p>
                                </div>
                                {
                                    !isLoading ?
                                        <>

                                            {
                                                Object.values(latestOrder)?.length > 0 ?
                                                    <>
                                                        <div className="d-flex flex-column flex-lg-row justify-content-between mt-4">
                                                            <div className="d-flex gap-3 h-100">
                                                                {
                                                                    latestOrder?.items?.slice(0, 4).map((el, index) => {
                                                                        return (
                                                                            <img src={el?.product?.image} key={index} style={{ width: "78px", height: "84px" }} />
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                            <div className="text-start text-lg-end fs-14 mt-4 mt-lg-0">
                                                                <p>
                                                                    {userInfo.order_text}: {latestOrder?.orderNumber}
                                                                </p>
                                                                <p>
                                                                    {'ORDER DATE'}: {formatDate(latestOrder?.createdAt)}
                                                                </p>
                                                                <p>
                                                                    {userInfo.total_text}: ${latestOrder?.total}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-start text-lg-end fs-14 mt-2 mt-lg-4">
                                                            <p><span className="cp" onClick={() => { router.push('/invoice/' + latestOrder?.orderNumber) }}>View Order</span>&nbsp;|&nbsp;<span className="cp" onClick={() => { router.push('/order') }}>View all</span></p>
                                                        </div>
                                                        <hr className="my-4 d-none d-lg-block" />
                                                    </> :
                                                    <>
                                                        <div className='row mt-4' style={{ position: 'relative', margin: '0 auto' }}>
                                                            <div className="col-12" role="alert">
                                                                <p className='text-center fs-18 fw-bold'>No data found!</p>
                                                            </div>
                                                        </div>
                                                        <hr className="my-4 d-none d-lg-block" />
                                                    </>

                                            }

                                        </>
                                        : <div className="d-flex p-2 justify-content-center">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                }

                                <div className={`accordion mb-4 ${styles.accordion_button}`} id="accordionExample">
                                    {/* <div className="accordion-item border-0 bg-transparent my-5">
                                        <h2 className="accordion-header" id="headingTwo">
                                            <button
                                                className="accordion-button shadow-none collapsed bg-transparent text-black fs-24 fw-bold"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseTwo"
                                                aria-expanded="false"
                                                aria-controls="collapseTwo"
                                            >
                                                <span>
                                                    <BsWallet2 className="fs-30 fw-normal" />
                                                </span>{" "}
                                                &nbsp;&nbsp;&nbsp;{userInfo.account_wallet_text}
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseTwo"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingTwo"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                <strong>This is the second item's accordion body.</strong> It is hidden by default,
                                                until the collapse plugin adds the appropriate classes that we use to style each
                                                element. These classes control the overall appearance, as well as the showing and
                                                hiding via CSS transitions. You can modify any of this with custom CSS or overriding
                                                our default variables. It's also worth noting that just about any HTML can go within
                                                the <code>.accordion-body</code>, though the transition does limit overflow.
                                            </div>
                                        </div>
                                    </div> */}
                                    {/* <hr className="my-4" /> */}
                                    <div className={`accordion-item bg-transparent ${styles.custom_accordion_button_phn}`}>
                                        <h2 className="accordion-header" id="headingOne">
                                            <button
                                                className="accordion-button account-accordion-button shadow-none bg-transparent text-black fs-24 fs-md-14 ff-Soleil700"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="true"
                                                aria-controls="collapseOne"
                                            >
                                                <span>
                                                    {/* <CgProfile className="fs-30 fs-md-20 fw-normal" /> */}
                                                    {/* <img src="/images/account-lg.svg" style={{ height: '27.5px', width: '21.6px' }} alt="" /> */}
                                                    <img src="/images/nav-icons/Person.svg" style={{ height: '38px' }} />
                                                </span>{" "}
                                                &nbsp;&nbsp;&nbsp;{userInfo.account_info_text}
                                            </button>
                                        </h2>

                                        {/* update profile */}
                                        <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse show"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                <div className="row">
                                                    <div className="text-end">
                                                        <button
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editInfoModal"
                                                            className="fs-14 ff-Soleil400 border-0 bg-transparent"
                                                        >
                                                            {userInfo.edit_button_text}
                                                        </button>
                                                    </div>
                                                    <div
                                                        className="modal fade z-index-3000"
                                                        id="editInfoModal"
                                                        aria-labelledby="editInfoModalLabel"
                                                        aria-hidden="true"
                                                    >
                                                        <div className="modal-dialog modal-dialog-centered">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h5 className="modal-title" id="exampleModalLabel">
                                                                        Edit Account Info
                                                                    </h5>
                                                                    <button
                                                                        type="button"
                                                                        className="btn-close"
                                                                        id="close-btn"
                                                                        data-bs-dismiss="modal"
                                                                        aria-label="Close"
                                                                    ></button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <form onSubmit={handleSaveChange}>
                                                                        <div className="row">
                                                                            <div className="col-sm-6 mb-3">
                                                                                <label htmlFor="inputFullName" className="form-label">
                                                                                    First Name :
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    name="firstName"
                                                                                    onChange={handleUpdateInfoChange}
                                                                                    value={updateInfo.firstName}
                                                                                    className="form-control"
                                                                                    id="inputFullName"
                                                                                    aria-describedby="nameHelp"
                                                                                    placeholder="first name"
                                                                                />
                                                                            </div>
                                                                            <div className="col-sm-6 mb-3">
                                                                                <label htmlFor="inputFullName" className="form-label">
                                                                                    Last Name :
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    name="lastName"
                                                                                    onChange={handleUpdateInfoChange}
                                                                                    value={updateInfo.lastName}
                                                                                    className="form-control"
                                                                                    id="inputFullName"
                                                                                    aria-describedby="nameHelp"
                                                                                    placeholder="last name"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="mb-3">
                                                                            <label htmlFor="inputPhone" className="form-label">
                                                                                Date of Birth :
                                                                            </label>
                                                                            <input
                                                                                type="date"
                                                                                name="birthdayDate"
                                                                                onChange={handleUpdateInfoChange}
                                                                                value={updateInfo.birthdayDate}
                                                                                className="form-control"
                                                                                id="inputPhone"
                                                                                aria-describedby="nameHelp"
                                                                                placeholder="date of birth"
                                                                            />
                                                                        </div>

                                                                        <div className="mb-3">
                                                                            <label htmlFor="inputPhone" className="form-label">
                                                                                Phone :
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                name="phone"
                                                                                onChange={handleUpdateInfoChange}
                                                                                value={updateInfo.phone}
                                                                                className="form-control"
                                                                                id="inputPhone"
                                                                                aria-describedby="nameHelp"
                                                                                placeholder="phone"
                                                                            />
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-outline-secondary"
                                                                                data-bs-dismiss="modal"
                                                                            >
                                                                                Close
                                                                            </button>
                                                                            <button
                                                                                type="submit"
                                                                                className="btn btn-dark"
                                                                            >
                                                                                Save changes
                                                                            </button>
                                                                        </div>
                                                                    </form>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-lg-6">
                                                        <div className="container">
                                                            <div className="mt-3">
                                                                <p className="fs-12 ff-Soleil400 my-2">Name</p>
                                                                <div className="d-flex justify-content-between">
                                                                    <p className="fs-16 ff-Soleil700">{userData?.firstName + ' ' + userData?.lastName}</p>
                                                                    {/* <p className='fs-14'>{userInfo.edit_button_text}</p> */}
                                                                </div>
                                                            </div>
                                                            <div className="mt-3">
                                                                <p className="fs-12 ff-Soleil400 my-2">{userInfo.profile_email_text}</p>
                                                                <div className="d-flex justify-content-between">
                                                                    <p className="fs-16 ff-Soleil700">{userData.email}</p>
                                                                    {/* <p className='fs-14'>{userInfo.edit_button_text}</p> */}
                                                                </div>
                                                            </div>
                                                            <div className="mt-3">
                                                                <p className="fs-12 ff-Soleil400 my-2">{userInfo.profile_phone_text}</p>
                                                                <div className="d-flex justify-content-between">
                                                                    <p className="fs-16 ff-Soleil700">{userData?.phone !== 'null' ? userData?.phone : '**********'}</p>
                                                                    {/* <p className='fs-14'>{userInfo.edit_button_text}</p> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className='col-12 col-lg-6'>
                                                    <div className='container'>
                                                        <div className='mt-3'>
                                                            <p className='fs-12 my-2'>{userInfo.profile_password_text}</p>
                                                            <div className='d-flex justify-content-between'>
                                                                <p className='fs-16 fw-bold'>{userInfo.profile_password}</p>
                                                                <p className='fs-14'>{userInfo.edit_button_text}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-4 d-none d-lg-block" />
                                    {/* <div className="accordion-item border-0 bg-transparent my-5">
                                        <h2 className="accordion-header" id="headingThree">
                                            <button
                                                className="accordion-button shadow-none collapsed bg-transparent text-black fs-24 fw-bold"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseThree"
                                                aria-expanded="false"
                                                aria-controls="collapseThree"
                                            >
                                                <span>
                                                    <AiOutlineHeart className="fs-30 fw-normal" />
                                                </span>{" "}
                                                &nbsp;&nbsp;&nbsp;{userInfo.account_lists_text}
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseThree"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingThree"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                <strong>This is the third item's accordion body.</strong> It is hidden by default,
                                                until the collapse plugin adds the appropriate classes that we use to style each
                                                element. These classes control the overall appearance, as well as the showing and
                                                hiding via CSS transitions. You can modify any of this with custom CSS or overriding
                                                our default variables. It's also worth noting that just about any HTML can go within
                                                the <code>.accordion-body</code>, though the transition does limit overflow.
                                            </div>
                                        </div>
                                    </div> */}
                                    {/* <Link href="/my-items">
                                        <div className="d-none d-lg-block ">
                                            <div className="d-flex justify-content-between align-items-center py-4 mx-3">
                                                <h2 className={`fs-24 ff-Soleil700 text-black mb-0 ${styles.custom_text}`}>
                                                    <img src="/images/nav-icons/Heart.svg" style={{ height: '38px' }} />
                                                    <span className="ms-3 align-middle">Lists</span></h2>
                                                <HiOutlineChevronRight className="fs-21 text-black" />
                                            </div>
                                        </div>
                                    </Link> */}
                                    <div className="accordion-item border-0 bg-transparent my-5">
                                        <h2 className="accordion-header" id="headingFour">
                                            <button
                                                className="accordion-button shadow-none collapsed bg-transparent text-black fs-24 fw-bold"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseFour"
                                                aria-expanded="false"
                                                aria-controls="collapseFour"
                                            >
                                                <img src="/images/nav-icons/Heart.svg" style={{ height: '38px' }} />
                                                <span className="ms-3 align-middle">Lists</span>
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseFour"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingFour"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                <div className="container">
                                                    <div className="row">
                                                       <div style={{maxHeight : '640px', overflowY : 'auto'}} >
                                                       {
                                                            wishlist?.map((el, index) => {
                                                                return <WishlistCard item={el} index={index} key={'wish-item' + index} />
                                                            })
                                                        }

                                                       </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-4 d-none d-lg-block" />
                                    <Link href={`/${selectedRetailer?.addressObject?.state?.toLowerCase()}/${retialerNameSlug(selectedRetailer?.name)}`}>
                                        <div className="d-none d-lg-block">
                                            <div className="d-flex justify-content-between align-items-center py-4 mx-3">
                                                <h2 className={`fs-24 ff-Soleil700 text-black mb-0`}>
                                                    {/* <img src="/images/home.svg" style={{ height: '30.15px', width: '28.4px' }} /> */}
                                                    <img src="/images/nav-icons/Home.svg" style={{ height: '38px' }} />
                                                    <span className="ms-3 align-middle">Your Selcted JARS Store</span></h2>
                                                <HiOutlineChevronRight className="fs-21 text-black" />
                                            </div>
                                        </div>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
    );
}

export default User;
