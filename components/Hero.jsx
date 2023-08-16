import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';

const Hero = (props) => {
  const router = useRouter();
  const { bg, children, title1, title2, btnBg, btnText, btnLink, handleScroll, border, uiData, page } = props;


  return (
    <div
      className="bg-black _hero-image"
      style={{ backgroundImage: ` url(${bg})` }}
    >
      <div className="overlay"></div>
      <div className="container h-100">
        <div className="w-100 h-100 d-flex flex-column justify-content-center _hero-text">
          <h1
            className="title1 ff-powerGrotesk800 text-white"
            style={{ zIndex: '1', fontSize: '24px', color: `${uiData?.titleFontColor}` }}
          >
            {title1}
            <br />
            <span
              className="title2 ff-powerGrotesk700"
              style={{ color: `${uiData?.subTitleFontColor}`, fontSize: '48px' }}
            >
              {title2}
            </span>
          </h1>
          <p
            className="h5Plus mb-5 lh-base ff-Soleil400 text-white"
            style={{ zIndex: '1', color: `${uiData?.descriptionFontColor}` }}
          >
            {children}
          </p>
          {/* test white removed */}
          <button
            onClick={() => { page == 'career' ? handleScroll() : router.push(btnLink) }}
            style={{
              backgroundColor: `${uiData?.buttonBackgroundColor}`,
              color: `${uiData?.buttonFontColor}`,
              zIndex: '1',
            }}
            className={`${border ? 'border' : 'border-0'
              } w-auto me-auto px-5 py-2 rounded-pill btn ff-Soleil400 text-white`}
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
