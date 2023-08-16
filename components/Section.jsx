import React from 'react';
const Section = ({ title, children, cls, childCls }) => {

  return (
    <div className={`${cls} container text-center w-75 mx-auto py-5 section`}>
      <h2 className="fw-bold section-title ff-Soleil700">{title}</h2>
      <p className={`${childCls} h5 fw-normal ff-Soleil400`}>{children}</p>
    </div>
  );
};

export default Section;
