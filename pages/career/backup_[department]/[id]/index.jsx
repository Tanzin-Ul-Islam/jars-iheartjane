import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../../../styles/details.module.css";
import React, { useRef, useState, useEffect } from "react";

import { fetchData, postData } from "../../../../utils/FetchApi";
import api from "../../../../config/api.json";
import { createToast } from "../../../../utils/toast";
import ErrorPage from "next/error";
import { useDispatch, useSelector } from "react-redux";
import { setSiteLoader } from "../../../../redux/global_store/globalReducer";
import Swal from "sweetalert2";
import { showLoader } from "../../../../utils/helper";
import HeaderTitles from "../../../../components/HeaderTitles";
import Skeleton from "react-loading-skeleton";
import Head from "next/head";
import Loader from "../../../../components/Loader";
function Details() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  let { siteLoader, pageMeta } = useSelector((store) => (store.globalStore));


  const [errors, setErrors] = useState({
    jobTitle: "",
    fullName: "",
    email: "",
    contactNumber: "",
    coverLetter: "",
    resume: "",
  });

  let [applicationData, setApplicationData] = useState({
    jobTitle: "",
    fullName: "",
    email: "",
    contactNumber: "",
    coverLetter: "",
    resume: "",
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

  function handleAssignData(event) {
    setApplicationData({
      ...applicationData,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    let iserror = false;
    if (!applicationData.jobTitle) {
      setErrors((prevState) => ({
        ...prevState,
        jobTitle: "Please provide job title.",
      }));
      iserror = true;
    } else {
      setErrors((prevState) => ({ ...prevState, jobTitle: "" }));
    }

    if (!applicationData.fullName) {
      setErrors((prevState) => ({
        ...prevState,
        fullName: "Please provide full name.",
      }));
      iserror = true;
    } else {
      setErrors((prevState) => ({ ...prevState, fullName: "" }));
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
    if (!applicationData.coverLetter) {
      setErrors((prevState) => ({
        ...prevState,
        coverLetter: "Please provide cover letter.",
      }));
      iserror = true;
    } else {
      setErrors((prevState) => ({ ...prevState, coverLetter: "" }));
    }
    if (!applicationData.resume) {
      setErrors((prevState) => ({
        ...prevState,
        resume: "Please upload resume.",
      }));
      iserror = true;
    } else {
      setErrors((prevState) => ({ ...prevState, resume: "" }));
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
        let formData = new FormData();
        formData.append("jobTitle", applicationData.jobTitle);
        formData.append("fullName", applicationData.fullName);
        formData.append("email", applicationData.email);
        formData.append("contactNumber", applicationData.contactNumber);
        formData.append("coverLetter", applicationData.coverLetter);
        formData.append("resume", applicationData.resume);
        document.getElementById("submitModalCloseBtn")?.click();
        showLoader();
        const response = await postData(api.career.careerApplication, formData);
        if (response.data.statusCode == 201) {
          Swal.close();
          setApplicationData({
            jobTitle: careerDetailsData.title,
            fullName: "",
            email: "",
            contactNumber: "",
            coverLetter: "",
            resume: "",
          });
          createToast("Application submitted successfully.", "success");
        } else {
          createToast("Something went wrong! Please try again.", "error");
        }
      }
    } catch (error) {
      document.getElementById("submitModalCloseBtn")?.click();
      createToast("Something went wrong! Please try again.", "error");
    }
  }

  const myElementRef = useRef(null);
  const handleClick = () => {
    myElementRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // dispatch(setSiteLoader(true));
    // setTimeout(() => {
    //   dispatch(setSiteLoader(false));
    // }, 1000)
    if (router.isReady) {
      getData();
    }
  }, [id]);

  return (
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
      {
        hasData ?
          <>
            {
              hasData ?
                <div className="mx-2 mx-lg-0">
                  <section className="career-section py-5">
                    <div className="container mt-4 mt-md-0">
                      <h2 className="ff-Soleil400 fs-17 section-title position-relative mb-4">
                        <Link href="/home">Home</Link>/
                        <Link className="mx-2" href="/career">
                          Career
                        </Link>
                        / Grower
                      </h2>
                      <div className="position-relative">
                        <div className="d-flex flex-column flex-lg-row align-items-center gap-lg-5">
                          <picture>
                            <img height="80" src="/images/logo.svg" alt="Grower" />
                          </picture>
                          <div className="mt-3 mt-lg-0">
                            <h1 className="ff-Soleil700 fs-36 fs-md-24 text-center">
                              {careerDetailsData.title}
                            </h1>
                            <p className="ff-Soleil400 fs-17 fs-md-14 text-center text-lg-start">
                              About Company
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 mt-lg-5">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: careerDetailsData.description,
                          }}
                        ></div>
                        <div className="mt-5 text-center text-lg-start">
                          <button
                            className="btn SubmitNow-btn py-3 px-4 mb-3"
                            data-bs-toggle="modal"
                            data-bs-target="#submitModal"
                          >
                            Submit Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                  <div
                    className="modal fade z-index-3000"
                    id="submitModal"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                        <div className="text-end">
                          <button
                            type="button"
                            className="btn-close p-3 shadow-none my-auto"
                            id="submitModalCloseBtn"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="w-50 w-lg-100 p-2 mx-auto">
                            <div className="text-center">
                              <p className="my-auto fs-16">{cmsData.modalTitle}</p>
                              <h3 className="fs-36 fs-lg-30 my-auto text-nowrap">
                                {cmsData.modalSubTitle}
                              </h3>
                              <p className="fs-16">{cmsData.modalDescription}</p>
                            </div>
                            <div>
                              <form
                                onSubmit={(e) => {
                                  handleFormSubmit(e);
                                }}
                                enctype="multipart/form-data"
                              >
                                <div className="mb-3">
                                  <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label ff-Soleil700 fs-17"
                                  >
                                    Job Title
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control shadow-none border border-dark rounded-pill"
                                    style={{ cursor: "auto", backgroundColor: "#E8F0FE" }}
                                    name="jobTitle"
                                    value={applicationData.jobTitle}
                                    // onChange={(e) => {
                                    //   handleAssignData(e);
                                    // }}
                                    readOnly={true}
                                  />
                                  {errors.jobTitle ? (
                                    <span className="text-danger mt-2 fs-12">
                                      *&nbsp;{errors.jobTitle}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="mb-3">
                                  <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label ff-Soleil700 fs-17"
                                  >
                                    Full Name*
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control shadow-none border border-dark rounded-pill"
                                    name="fullName"
                                    value={applicationData.fullName}
                                    onChange={(e) => {
                                      handleAssignData(e);
                                    }}
                                  />
                                  {errors.fullName ? (
                                    <span className="text-danger mt-2 fs-12">
                                      *&nbsp;{errors.fullName}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="mb-3">
                                  <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label ff-Soleil700 fs-17"
                                  >
                                    Email*
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control shadow-none border border-dark rounded-pill"
                                    id="exampleFormControlInput1"
                                    placeholder="name@example.com"
                                    name="email"
                                    value={applicationData.email}
                                    onChange={(e) => {
                                      handleAssignData(e);
                                    }}
                                  />
                                  {errors.email ? (
                                    <span className="text-danger mt-2 fs-12">
                                      *&nbsp;{errors.email}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="mb-3">
                                  <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label ff-Soleil700 fs-17"
                                  >
                                    Contact Number*
                                  </label>
                                  <input
                                    type="tel"
                                    className="form-control shadow-none border border-dark rounded-pill"
                                    minlength="10"
                                    maxlength="15"
                                    name="contactNumber"
                                    value={applicationData.contactNumber}
                                    onChange={(e) => {
                                      handleAssignData(e);
                                    }}
                                  />
                                  {errors.contactNumber ? (
                                    <span className="text-danger mt-2 fs-12">
                                      *&nbsp;{errors.contactNumber}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="mb-3">
                                  <label
                                    htmlFor="exampleFormControlTextarea1"
                                    className="form-label ff-Soleil700 fs-17"
                                  >
                                    Cover Letter
                                  </label>
                                  <textarea
                                    className="form-control shadow-none border border-dark rounded-3"
                                    id="exampleFormControlTextarea1"
                                    rows={8}
                                    name="coverLetter"
                                    value={applicationData.coverLetter}
                                    onChange={(e) => {
                                      handleAssignData(e);
                                    }}
                                  ></textarea>
                                  {errors.coverLetter ? (
                                    <span className="text-danger mt-2 fs-12">
                                      *&nbsp;{errors.coverLetter}
                                    </span>
                                  ) : null}
                                </div>
                                <div>
                                  <p className="ff-Soleil700 fs-17">Resume</p>
                                  <input
                                    type="file"
                                    className={`ff-Soleil700 w-100 ${styles.custom_file_input}`}
                                    name="resume"
                                    accept=".pdf, .doc, .docx"
                                    defaultValue={applicationData.resume}
                                    onChange={(e) => {
                                      setApplicationData({
                                        ...applicationData,
                                        resume: e.target.files[0],
                                      });
                                    }}
                                  />
                                  {applicationData.resume?.name ? (
                                    <p className="mt-3 fs-12 ff-Soleil400">
                                      Uploaded File: {applicationData.resume?.name}
                                    </p>
                                  ) : null}
                                  <p className="mt-3 fs-12 ff-Soleil400">
                                    Upload your resume file.
                                    <span className="text-primary">
                                      {" "}
                                      File types : .pdf
                                    </span>{" "}
                                    and Max file size: 2MB{" "}
                                  </p>
                                  {errors.resume ? (
                                    <span className="text-danger mt-2 fs-12">
                                      *&nbsp;{errors.resume}
                                    </span>
                                  ) : null}
                                </div>
                                <button
                                  className="btn FormSubmit-btn py-1 px-5 rounded-pill mt-3 fs-16 mb-3 ff-Soleil700"
                                  type="submit"
                                >
                                  {cmsData.modalButtonText}
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> : <ErrorPage statusCode={404} />

            }
          </>
          :
          <>
            <Loader />
            <div className="mx-2 mx-lg-0">
              <section className="career-section py-5">
                <div className="container mt-4 mt-md-0">
                  <h2 className="ff-Soleil400 fs-17 section-title position-relative mb-4">
                    <Skeleton style={{ width: "250px", height: "30px" }} />
                  </h2>
                  <div className="position-relative">
                    <div className="d-flex flex-column flex-lg-row align-items-center gap-lg-5">
                      <Skeleton style={{ width: "80px", height: "80px" }} circle={true} />
                      <div className="mt-3 mt-lg-0">
                        <h5 className="ff-Soleil700 fs-36 fs-md-24 text-center">
                          <Skeleton style={{ width: "350px", height: "40px" }} />
                        </h5>
                        <p className="ff-Soleil400 fs-17 fs-md-14 text-center text-lg-start">
                          <Skeleton style={{ width: "100px", height: "30px" }} />
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 mt-lg-5">
                    <div>
                      <Skeleton style={{ width: "100%", height: "600px" }} />
                    </div>
                    <div className="mt-5 text-center text-lg-start">
                      <Skeleton style={{ width: "120px", height: "50px", borderRadius: "6px" }} />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
      }
    </>
  );
}
export default Details;
