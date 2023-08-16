import React, { useState, useEffect } from 'react'
import { FiArrowUpRight, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { AiFillCaretRight } from "react-icons/ai"
import styles from '../components/homePage/css/Home.module.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from 'next/router';
import { BsArrowRightShort } from "react-icons/bs"
import Link from 'next/link';
import { useSelector } from 'react-redux';


function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={styles.next_header}
      onClick={onClick}
    ><FiChevronRight /></div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={styles.previous_header}
      onClick={onClick}
    >
      <FiChevronLeft />
    </div>
  );
}

function SliderHeader({ sliderData }) {
  const router = useRouter()
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    centerMode: false,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    dotsClass: 'dots',
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const [isMobile, setIsMobile] = useState(false);
  const { selectedRetailer } = useSelector((store) => store.globalStore);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Initial check for screen size on component mount
    handleResize();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [selectedRetailer]);


  return (
    <div>
      <div className="">
        <div className="">
          <div className="">
            <Slider {...settings}>
              {sliderData?.map((li, index) => {
                return (
                  // <div className="slider-item h-100" key={index}>
                  // <section className={styles.header_section} style={{ backgroundImage: `url(${li.image})` }}>
                  //     <div className="container">
                  //       <div className="w-50 w-md-75 p-4 p-lg-0">
                  //       <h2 className="ff-PowerGrotesk700 fs-50 fs-md-25 lh-50 lh-md-28">{li.title}</h2>
                  //         <p className="line-clamp-3 fs-12 fs-md-10 mt-0 mt-lg-3 pe-3 pe-lg-0">{li.description}</p>
                  //         <Link href={li?.buttonLink} className="btn btn-outline-dark ff-Soleil400 text-uppercase px-4 py-1 rounded-pill fs-16 fs-md-10"><span className='align-middle'>{li.buttonText}&nbsp;</span><BsArrowRightShort className="fs-5" /></Link>
                  //       </div>
                  //     </div>
                  // </section>
                  // </div>
                  <div className="slider-item h-100" key={index}>
                    <section className={styles.header_section} style={{ backgroundImage: `url(${li.image})`, marginTop: `${selectedRetailer?.name == "JARS Cannabis – East Detroit" && isMobile ? '42px' : '0px'}` }}>
                      <div className="container">
                        <div className="w-50 w-md-75 p-4 p-lg-0">
                          <h2 className="ff-PowerGrotesk700 fs-50 fs-md-25 lh-36 lh-md-20" style={{ color: `${li.titleOneColor}` }}>{li.titleOne}</h2>
                          <h2 className="ff-PowerGrotesk700 fs-50 fs-md-25 lh-50 lh-md-28" style={{ color: `${li.titleTwoColor}` }}>{li.titleTwo}</h2>
                          {/* <p className="line-clamp-3 fs-12 fs-md-10 mt-0 mt-lg-3 pe-3 pe-lg-0 text-site-white">{li.description}</p> */}
                          <p className="fs-12 fs-md-10 mt-0 mt-lg-3 pe-3 pe-lg-0 text-site-white">{li.description}</p>
                          <Link href={li?.buttonLink || ""} className={`btn btn-outline-dark ff-Soleil400 text-uppercase px-4 py-1 rounded-pill fs-16 fs-md-10 text-site-white ${styles.sliderButton}`}><span className='align-middle'>{li.buttonText}&nbsp;</span></Link>
                        </div>
                      </div>
                    </section>
                  </div>
                )
              })
              }
            </Slider>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SliderHeader
