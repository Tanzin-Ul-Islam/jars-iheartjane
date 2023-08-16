import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../styles/categorySlider.module.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { toTitleCase, urlSlug } from '../utils/helper';

const CategorySlider = () => {

  let { categories } = useSelector((state) => state.globalStore);

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className="next position-absolute"
        style={{ top: '40%', backgroundColor: '#D9D29A' }}
        onClick={onClick}
      >
        <FiChevronRight />
      </div>
    );
  }
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className="previous position-absolute"
        style={{ top: '40%', backgroundColor: '#D9D29A' }}
        onClick={onClick}
      >
        <FiChevronLeft />
      </div>
    );
  }
  return (
    <div className="d-md-none grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-6 py-10 px-2">
      <Slider
        arrows={true}
        nextArrow=<SampleNextArrow />
        prevArrow=<SamplePrevArrow />
        dots={false}
        infinite={true}
        speed={500}
        slidesToShow={4}
        slidesToScroll={1}
        autoplay={true}
        responsive={[
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
        ]}
      >
        {categories?.map((el, i) => (
          <Link href={`/category/${urlSlug(
            el?.categoryName
          )}`} className={`${styles.slick_prev}`} key={i}>
            <div
              style={{
                width: '5rem',
                height: '5rem',
                backgroundColor: '#F1FAFE',
                border: '1px solid #212322',
              }}
              className="rounded-circle d-flex mx-auto"
            >
              <img
                src={el?.image}
                className="p-3"
                alt=""
              />
            </div>
            <h6 className="text-center">{toTitleCase(el?.categoryName)}</h6>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default CategorySlider;
