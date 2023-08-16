// import { useGetModalCmsQuery } from "../../redux/api_core/apiCore";
import Style from "./css/modal.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function Modal() {
  // const modalCms = useGetModalCmsQuery({});
  const [isExpanded, setIsExpanded] = useState(false);
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div>
      <div
        className="modal fade z-index-9999"
        id="reserveTimeModal"
        tabIndex={-1}
        aria-labelledby="reserveTimeModalLabel"
        aria-hidden="true"
      >
        <div
          className={`modal-dialog modal-dialog-scrollable ${Style.modalLg}`}
        >
          <div className="modal-content rounded-0 border-0">
            <div className="modal-header bg-site-black rounded-0">
              <h2
                className="modal-title fs-16 text-site-white ff-Soleil400"
                id="reserveTimeModalLabel"
              >
                RESERVE A TIME
              </h2>
              <button
                type="button"
                className="btn-close btn-close-white shadow-none"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body bg-site-blue-100 p-3 p-md-5 ">
              <div
                className="d-flex border-1 border-site-black mx-auto rounded-pill mb-5"
                style={{ border: "1px solid #212322" }}
              >
                <button
                  type="button"
                  className="btn border-0 btn-outline-dark w-100 rounded-pill bg-site-black text-site-white"
                >
                  PICKUP
                </button>
                <button
                  type="button"
                  className="btn border-0 btn-outline-dark w-100 rounded-pill"
                >
                  DELIVERY
                </button>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                  <h2 className="fs-20 lh-21 mb-0 ff-Soleil700">
                    JARS RIVER ROUGE
                  </h2>
                  <p className="fs-16 mb-0">
                    11347 W Jefferson Ave, River Rouge, MI 48218
                  </p>
                </div>
                <button
                  className="btn text-decoration-underline border-0"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasExampleLeft"
                  aria-controls="offcanvasExampleLeft"
                >
                  Change
                </button>
              </div>
              <hr />
              <ul className="list-unstyled d-flex gap-2 align-items-center mb-5">
                <li className="text-center w-100">
                  <h3 className="fs-16 fs-xs-12 ff-Soleil700 text-uppercase">
                    MON
                  </h3>
                  <div className={Style.dateList}>9/19</div>
                </li>
                <li className="text-center w-100">
                  <h3 className="fs-16 fs-xs-12 ff-Soleil700 text-uppercase">
                    tue
                  </h3>
                  <div className={Style.dateList}>9/19</div>
                </li>
                <li className="text-center w-100">
                  <h3 className="fs-16 fs-xs-12 ff-Soleil700 text-uppercase">
                    wed
                  </h3>
                  <div className={`${Style.dateList} ${Style.activeDateList}`}>
                    9/19
                  </div>
                </li>
                <li className="text-center w-100">
                  <h3 className="fs-16 fs-xs-12 ff-Soleil700 text-uppercase">
                    thu
                  </h3>
                  <div className={Style.dateList}>9/19</div>
                </li>
                <li className="text-center w-100">
                  <h3 className="fs-16 fs-xs-12 ff-Soleil700 text-uppercase">
                    fri
                  </h3>
                  <div className={Style.dateList}>9/19</div>
                </li>
                <li className="text-center w-100">
                  <h3 className="fs-16 fs-xs-12 ff-Soleil700 text-uppercase">
                    sat
                  </h3>
                  <div className={Style.dateList}>9/19</div>
                </li>
                <li className="text-center w-100">
                  <h3 className="fs-16 fs-xs-12 ff-Soleil700 text-uppercase">
                    sun
                  </h3>
                  <div className={Style.dateList}>9/19</div>
                </li>
              </ul>
              <div className="d-flex align-items-center gap-3 px-3 py-3 px-sm-4 py-sm-4 py-md-3 bg-site-gray mb-5">
                <div className="w-20 position-relative">
                  {/* <img  src={modalCms?.data?.data[0].image} alt='' width={95} height={145} className={Style.ModalImg}/> */}
                  <img
                    src="/images/mobile_pic.png"
                    alt=""
                    width={95}
                    height={145}
                    className={Style.ModalImg}
                  />
                </div>
                <div className="w-80">
                  <h2 className="fs-24 fs-sm-16 ff-Soleil700 text-site-black">
                    {/* {modalCms?.data?.data[0].titleOne} */}
                    Get $10 off pre-orders
                  </h2>
                  <p className="mb-0 fs-sm-12">
                    {/* {modalCms?.data?.data[0].description} */}
                    Now offering FREE, same-day and scheduled delivery services
                    with a $75 minimum purchase in Michigan.
                  </p>
                </div>
              </div>
              <ul className="list-group mb-0">
                <li className="list-group-item border rounded-0 bg-transparent mb-3">
                  <label
                    className="containerr fs-14 ff-Soleil400 my-auto"
                    htmlFor="firstRadio"
                  >
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      name="listGroupRadio"
                      value=""
                      id="firstRadio"
                    />
                    <span className="checkmark-modal"></span>
                    8am-9am
                  </label>
                </li>
                <li className="list-group-item border rounded-0 bg-transparent mb-3">
                  <label
                    className="containerr fs-14 ff-Soleil400 my-auto"
                    htmlFor="secondRadio"
                  >
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      name="listGroupRadio"
                      value=""
                      id="secondRadio"
                    />
                    <span className="checkmark-modal"></span>
                    9am-10am
                  </label>
                </li>
                <li className="list-group-item border rounded-0 bg-transparent mb-3">
                  <label
                    className="containerr fs-14 ff-Soleil400 my-auto"
                    htmlFor="thirdRadio"
                  >
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      name="listGroupRadio"
                      value=""
                      id="thirdRadio"
                    />
                    <span className="checkmark-modal"></span>
                    10am-11am
                  </label>
                </li>
                <li className="list-group-item border rounded-0 bg-transparent">
                  <label
                    className="containerr fs-14 ff-Soleil400 my-auto"
                    htmlFor="forthRadio"
                  >
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      name="listGroupRadio"
                      value=""
                      id="forthRadio"
                    />
                    <span className="checkmark-modal"></span>
                    12pm-1pm
                  </label>
                </li>
              </ul>
              {isExpanded && (
                <ul className="list-group mt-3 mb-0">
                  <li className="list-group-item border rounded-0 bg-transparent mb-3">
                    <label
                      className="containerr fs-14 ff-Soleil400 my-auto"
                      htmlFor="firstRadio"
                    >
                      <input
                        className="form-check-input me-2"
                        type="radio"
                        name="listGroupRadio"
                        value=""
                        id="firstRadio"
                      />
                      <span className="checkmark-modal"></span>
                      2am-3am
                    </label>
                  </li>
                  <li className="list-group-item border rounded-0 bg-transparent mb-3">
                    <label
                      className="containerr fs-14 ff-Soleil400 my-auto"
                      htmlFor="secondRadio"
                    >
                      <input
                        className="form-check-input me-2"
                        type="radio"
                        name="listGroupRadio"
                        value=""
                        id="secondRadio"
                      />
                      <span className="checkmark-modal"></span>
                      3am-4am
                    </label>
                  </li>
                  <li className="list-group-item border rounded-0 bg-transparent mb-3">
                    <label
                      className="containerr fs-14 ff-Soleil400 my-auto"
                      htmlFor="thirdRadio"
                    >
                      <input
                        className="form-check-input me-2"
                        type="radio"
                        name="listGroupRadio"
                        value=""
                        id="thirdRadio"
                      />
                      <span className="checkmark-modal"></span>
                      5am-6am
                    </label>
                  </li>
                  <li className="list-group-item border rounded-0 bg-transparent">
                    <label
                      className="containerr fs-14 ff-Soleil400 my-auto"
                      htmlFor="forthRadio"
                    >
                      <input
                        className="form-check-input me-2"
                        type="radio"
                        name="listGroupRadio"
                        value=""
                        id="forthRadio"
                      />
                      <span className="checkmark-modal"></span>
                      7pm-8pm
                    </label>
                  </li>
                </ul>
              )}
              <div className="text-end">
                {isExpanded == false ? (
                  <button
                    onClick={handleClick}
                    className="bg-transparent border-0 fs-14 ff-Soleil400 mb-0 mt-4"
                  >
                    <u>SEE MORE ITEMS</u>
                  </button>
                ) : (
                  <button
                    onClick={handleClick}
                    className="bg-transparent border-0 fs-14 ff-Soleil400 mb-0 mt-4"
                  >
                    <u>SEE LESS ITEMS</u>
                  </button>
                )}
              </div>
              <div className="text-center mt-4">
                <button className="btn btn-dark rounded-pill fs-16 fs-xs-12 ff-Soleil700 px-5">
                  RESERVE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
