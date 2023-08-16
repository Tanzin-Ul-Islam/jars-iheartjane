import React from "react";
import Link from "next/link"
import styles from "../styles/User.module.css";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import userInfoSite from "../cms-data/userCms";
import { patchData } from "../utils/FetchApi";
import api from "../config/api.json";
import { useDispatch, useSelector } from "react-redux";
import { setSiteLoader, setToken, setUserInfo } from "../redux/global_store/globalReducer";
import { useRouter } from "next/router";
import { useGetFaqPageCmsQuery } from "../redux/api_core/apiCore";
import { createToast } from "../utils/toast";
import { scrollToTop } from "../utils/helper";
const UserSidebar = () => {
    const dispatch = useDispatch();
    let { userInfo } = useSelector((store) => (store.globalStore));

    const [image, setImage] = useState(null);
    const [isProfileUploadBtnShow, setIsProfileUploadBtnShow] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    function handleLogout() {
        dispatch(setSiteLoader(true));
        localStorage.removeItem("email");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("birthdayDate");
        localStorage.removeItem("birthdayDate");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("phone");
        dispatch(setToken("undefined"));
        dispatch(setUserInfo({
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            birthdayDate: "",
        }));
        setTimeout(() => {
            dispatch(setSiteLoader(false));
            router.push("/");
        }, 500);
    }


    const updateProfileImage = async () => {
        let formData = new FormData();
        formData.append("image", image, image.name);
        const token = localStorage.getItem("token") ?? "";
        if (token) {
            try {
                const response = await patchData(api.user.updateUserProfile, formData, token);
                dispatch(setSiteLoader(true));
                if (response.status === 200) {
                    localStorage.setItem('image', response.data.data.image);
                    let userInfo = {
                        id: response.data.data.id,
                        firstName: response.data.data.firstName,
                        lastName: response.data.data.lastName,
                        email: response.data.data.email,
                        phone: response.data.data.phone,
                        birthdayDate: response.data.data.birthdayDate,
                        image: response.data.data.image,
                    }
                    dispatch(setUserInfo(userInfo));
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

    function showMemberDuration(joinDate) {
        const current = new Date();
        const date2 = new Date(joinDate);
        let result = undefined;
        const diffInYears = current.getFullYear() - date2.getFullYear();
        const diffInMonths = diffInYears * 12 + current.getMonth() - date2.getMonth();
        if (diffInMonths > 11) {
            const year = Math.floor(diffInMonths / 12);
            result = year > 1 ? `${year} Years` : `${year} Year`;
        } else {
            result = diffInMonths > 1 ? `${diffInMonths} Months` : `${diffInMonths} Month`;
        }
        return result;
    }

    const router = useRouter();

    return (

        <>
            <div className="col-12 col-lg-3 border-end">
                <div className="w-100 w-lg-90 mx-auto">
                    <div className="mt-5 d-none d-lg-block">
                        <p className="fs-12"><Link href="/">Home</Link> / Profile</p>
                    </div>
                    <div className="mt-3 mt-lg-4 text-center">
                        <div>
                            <div
                                className={styles.image_container}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* */}
                                {image ? (
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "50px",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (userInfo && userInfo?.image && userInfo?.image != 'default.png') ? (
                                    <img
                                        src={userInfo.image}
                                        alt="Preview"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "50px",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <img
                                        src="../../images/VisitStore-icon.png"
                                        alt="Preview"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "50px",
                                            objectFit: "cover",
                                        }}
                                    />
                                )}
                                <div className={styles.parent_element}>
                                    {isHovered && (
                                        <div className={styles.h_1}>
                                            <div className={`${styles.fileUpload}`}>
                                                <input
                                                    type="file"
                                                    className={styles.upload}
                                                    onChange={(e) => {
                                                        setImage(e.target.files[0]);
                                                        setIsProfileUploadBtnShow(true);
                                                    }}
                                                />
                                                <span>
                                                    {" "}
                                                    <FaRegEdit className="fs-24 text-black" />{" "}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-3">
                                {image && isProfileUploadBtnShow && (
                                    <button
                                        type="button"
                                        onClick={updateProfileImage}
                                        className="btn btn-outline-dark px-4 btn-block rounded-0"
                                    >
                                        Update
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 mt-lg-4">
                        <h2 className="fw-bold fs-24">
                            {userInfoSite.greeting_text},&nbsp;{userInfo?.firstName + ' ' + userInfo?.lastName}
                        </h2>
                        <p className="fs-12 mt-0 mt-lg-4 mb-lg-5">
                            {userInfoSite.sub_text} {userInfo?.createdAt ? showMemberDuration(userInfo.createdAt) : '0 Month'}
                        </p>
                        <hr className="d-none d-lg-block my-lg-4" />
                    </div>
                    <div className="mt-4 mt-lg-0">
                        <div className="fs-12">
                            <Link href="/order">
                                <p className="my-lg-4 d-flex align-items-center">
                                    <span>
                                        {/* <BsFileEarmarkBarGraph className="fs-18" /> */}
                                        <img src="/images/nav-icons/List.svg" style={{ height: '30px' }} />
                                    </span>{" "}
                                    &nbsp;&nbsp;&nbsp;{userInfoSite.purchase_text}
                                </p>
                            </Link>
                            <hr className="d-none d-lg-block my-lg-4" />
                            {/* <p className="">
                                            <span>
                                                <BsWallet2 className="fs-18" />
                                            </span>{" "}
                                            &nbsp;&nbsp;&nbsp;{userInfoSite.wallet_text}
                                        </p> */}
                            {/* <hr className="my-lg-4" /> */}
                        </div>
                        <div>
                            <h2 className="fw-bold fs-16 d-none d-lg-block">{userInfoSite.items_main_text}</h2>
                            {/* <p className="fs-12 mt-0 mt-lg-4">
                                            <span>
                                                <BsCartPlus className="fs-18" />
                                            </span>{" "}
                                            &nbsp;&nbsp;&nbsp;{userInfoSite.reorder_text}
                                        </p> */}
                            <Link href={'/my-items'}>
                                <p className="fs-12 mt-0 my-lg-4 d-flex align-items-sm-center">
                                    <span>
                                        {/* <AiOutlineHeart className="fs-18" /> */}
                                        <img src="/images/nav-icons/Heart.svg" style={{ height: '30px' }} />
                                    </span>{" "}
                                    &nbsp;&nbsp;&nbsp;{userInfoSite.list_text}
                                </p>
                            </Link>
                            <hr className="d-none d-lg-block my-lg-4" />
                            {/* <p className="fs-12">
                                            <span>
                                                <AiOutlineHeart className="fs-18" />
                                            </span>{" "}
                                            &nbsp;&nbsp;&nbsp;{userInfoSite.list_text}
                                        </p> */}
                            {/* <hr className="my-lg-4" /> */}
                        </div>
                        <div className="d-none d-lg-block">
                            <h2 className="fw-bold fs-16 d-none d-lg-block">{userInfoSite.account_main_text}</h2>
                            <Link href="/user">
                                <p className="fs-12 mt-0 my-lg-4 d-flex align-items-sm-center">
                                    <span>
                                        {/* <CgProfile className="fs-18" /> */}
                                        <img src="/images/nav-icons/Person.svg" style={{ height: '30px' }} />
                                    </span>{" "}
                                    &nbsp;&nbsp;&nbsp;{userInfoSite.info_text}
                                </p>
                            </Link>
                            <hr className="d-block d-lg-none" />
                            {/* <p className="fs-12">
                            <span>
                                <FiCompass className="fs-18" />
                            </span>{" "}
                            &nbsp;&nbsp;&nbsp;{userInfoSite.address_text}
                        </p> */}
                            <hr className="my-lg-4" />
                        </div>
                        {/* <div>
                        <h2 className="fw-bold fs-16 d-none d-lg-block">{userInfoSite.subscription_main_text}</h2>
                        <p className="fs-12 mt-0 mt-lg-4">
                            <span>
                                <CiCalendarDate className="fs-18" />
                            </span>{" "}
                            &nbsp;&nbsp;&nbsp;{userInfoSite.delivery_text}
                        </p>
                        <hr className="my-lg-4" />
                    </div> */}
                        <div>
                            <h2 className=" fw-bold fs-16 d-none d-lg-block">{userInfoSite.service_main_text}</h2>
                            <Link href={'/contact'}>
                                <p className="fs-12 mt-0 my-lg-4 d-flex align-items-sm-center">
                                    <span>
                                        {/* <BiHelpCircle className="fs-18" /> */}
                                        <img src="/images/nav-icons/Question.svg" style={{ height: '30px' }} />
                                    </span>{" "}
                                    &nbsp;&nbsp;&nbsp;{userInfoSite.help_text}
                                </p>
                            </Link>
                            <hr className="d-block d-lg-none" />
                            <Link href={'/terms-policy'}>
                                <p className="fs-12 my-lg-4 d-flex align-items-sm-center">
                                    <span>
                                        {/* <FaRegEdit className="fs-18" /> */}
                                        <img src="/images/nav-icons/Write.svg" style={{ height: '30px' }} />
                                    </span>{" "}
                                    &nbsp;&nbsp;&nbsp;{"Terms of Service"}
                                </p>
                            </Link>
                            <hr className="my-lg-4" />
                        </div>
                        <div>
                            <span className="fs-12 cp d-flex align-items-sm-center" onClick={handleLogout}>
                                <span>
                                    {/* <RxExit className="fs-18" /> */}
                                    <img src="/images/nav-icons/SideArrow.svg" style={{ height: '30px' }} />
                                </span>{" "}
                                &nbsp;&nbsp;&nbsp;{userInfoSite.sign_out_text}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserSidebar