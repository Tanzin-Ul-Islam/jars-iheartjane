import React, { useState } from 'react';

const LearnMoreModal = ({ learMoreContentList }) => {
  const [check, setCheck] = useState(0);
  function handleCloseModal() {
    if (check < learMoreContentList.length - 1) {
      setCheck(check+1);
    }
  }

  return (
    <div
      className="modal fade"
      id="learnMoreModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setCheck(0)}
            ></button>
          </div>
          <div className="modal-body text-center">
            <div id="carouselExampleIndicators" className="carousel slide">
              <div className="carousel-indicators">
                {learMoreContentList?.map((item, i = 0) => (
                  <button
                    key={'b' + i}
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={i}
                    className={i === 0 && check == 0 ? 'active indicators' : 'indicators'}
                    aria-current={i === 0 && check == 0 && true}
                    aria-label={`Slide ${i}`}
                    onClick={handleCloseModal}
                  ></button>
                ))}
              </div>
              <div className="carousel-inner">
                {learMoreContentList?.map((item, i) => (
                  <div
                    key={i}
                    className={`carousel-item carousel-item-new ${i === 0 && check == 0 ? 'active' : ''}`}
                  >
                    <img
                      src={item?.image}
                      className="w-auto h-auto"
                      alt=""
                    />
                    <h4 className="fw-bold">{item?.title}</h4>
                    <p className="fs-5">
                      {item?.description}
                    </p>
                    {/* <span style={{ fontSize: '14px' }}>
                      {item?.termsAndConditionTitle}
                    </span> */}
                  </div>
                ))}
              </div>
              <a
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
                onClick={handleCloseModal}
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMoreModal;
