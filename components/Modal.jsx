import React from 'react';

const Modal = ({ benefitsModal }) => {
  return (
    <div
      className="modal fade"
      id="exampleModal"
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
            ></button>
          </div>
          <div className="modal-body text-center">
            <div id="carouselExampleIndicatorsEarning" className="carousel slide">
              <div className="carousel-indicators">
                {benefitsModal?.map((item, i) => (
                  <button
                    key={'btn' + i}
                    type="button"
                    data-bs-target="#carouselExampleIndicatorsEarning"
                    data-bs-slide-to={i}
                    className={i === 0 ? 'active indicators' : 'indicators'}
                    aria-current={i === 0 && true}
                    aria-label={`Slide ${i}`}
                  ></button>
                ))}
              </div>
              <div className="carousel-inner">
                {benefitsModal?.map((item, i) => (
                  <div
                    key={'ci' + i}
                    className={`carousel-item carousel-item-new ${i === 0 ? 'active' : ''}`}
                  >
                    <img
                      src={item?.image}
                      className="w-auto h-auto"
                      alt=""
                    />
                    <h4 className="fw-bold">{item?.title}</h4>
                    <p className="fs-5">
                      {item?.subTitle}
                    </p>
                    <span style={{ fontSize: '14px' }}>
                      {item?.termsAndConditionTitle}
                    </span>
                  </div>
                ))}
              </div>
              <a
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicatorsEarning"
                data-bs-slide="next"
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

export default Modal;
