import React from 'react';
import Image from 'next/image';
import Section from '../../components/Section';

const Steps = ({ stepsSection }) => {
  return (
    <section className="primary-bg">
      <div className="container">
        <Section title={stepsSection?.title}>
          {stepsSection?.subTitle}
        </Section>
        <div className="row mt-2 py-5">
          <div className="col-md-4 text-center px-4 pb-5">
            <div style={{ minHeight: '12rem' }}>
              <Image
                src={stepsSection?.countOneImage}
                width={180}
                height={180}
                className=""
                alt=""
              />
            </div>
            <h5 className="fw-bold ff-Soleil700">{stepsSection?.countOneTitle}</h5>
            <h6 className='ff-Soleil400'>{stepsSection?.countOneDescription}</h6>
          </div>
          <div className="col-md-4 text-center px-4 pb-5">
            <div style={{ minHeight: '12rem' }}>
              <Image
                src={stepsSection?.countTwoImage}
                width={180}
                height={180}
                className=""
                alt=""
              />
            </div>
            <h5 className="fw-bold ff-Soleil700">{stepsSection?.countTwoTitle}</h5>
            <h6 className='ff-Soleil400'>{stepsSection?.countTwoDescription}</h6>
          </div>
          <div className="col-md-4 text-center px-4 pb-5">
            <div style={{ minHeight: '12rem' }}>
              <Image
                src={stepsSection?.countThreeImage}
                width={180}
                height={180}
                className=""
                alt=""
              />
            </div>
            <h5 className="fw-bold ff-Soleil700">{stepsSection?.countThreeTitle}</h5>
            <h6 className='ff-Soleil400'>{stepsSection?.countThreeDescription}</h6>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;

