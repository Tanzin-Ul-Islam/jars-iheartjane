import React, { useState, useEffect, useRef } from 'react';
import { FiArrowUpRight, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { AiFillCaretRight } from 'react-icons/ai';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRouter } from 'next/router';
import api from '../config/api.json';
import { postData } from '../utils/FetchApi';
import styles from '../styles/SliderOne.module.css';
import parse from 'html-react-parser';
import { createCheckout, showLoader } from '../utils/helper';
import { useSelector, useDispatch } from 'react-redux';
import { setCheckoutId } from '../redux/global_store/globalReducer';
import { addItemToCart } from '../redux/cart_store/cartReducer';
import Swal from 'sweetalert2';
import { useGetHomeCmsQuery } from '../redux/api_core/apiCore';
import HomeSliderOneSkeleton from './Ui/Skeleton/HomeSliderOneSkeleton';
import Link from 'next/link';
import { addToCartItemForSeo } from '../utils/seoInformations';

function Slider_one({ sectionTwoCmsData, homeComponentUI }) {
  let dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  let { checkoutId, selectedRetailer, menuTypeValue } = useSelector((state) => state.globalStore);
  let { cartList } = useSelector((store) => store.cartStore);
  const selectedState =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user_selected_retailer_state'))
      : null;
  const { data, isLoading, isSuccess, isFetching, error } =
    useGetHomeCmsQuery(selectedState);
  const homePageSectionTwo = data?.data?.homePageSectionTwoData;

  const sectionTwoTitleArray = sectionTwoCmsData?.title.split(' ');

  const [popularProduct, setPopularProduct] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className="next" onClick={onClick}>
        <FiChevronRight />
      </div>
    );
  }
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className="previous" onClick={onClick}>
        <FiChevronLeft />
      </div>
    );
  }
  async function addToCart(data, e) {
    e.preventDefault();
    let createdId = '';
    if (selectedRetailer?.id && checkoutId == 'undefined') {
      let retailerType =
        localStorage.getItem('retailer_type') &&
          localStorage.getItem('retailer_type') != 'undefined'
          ? JSON.parse(localStorage.getItem('retailer_type'))
          : 'PICKUP';
      createdId = await createCheckout({
        retailerId: selectedRetailer?.id,
        orderType: retailerType == 'Curbside Pickup' ? 'PICKUP' : retailerType.toUpperCase(),
        pricingType: menuTypeValue,
      });
      if (createdId) {
        dispatch(setCheckoutId(createdId));
      }
    }
    showLoader();
    if (!data.selectedWeight) {
      data.selectedWeight = data?.variants[0]?.option;
    }
    let processedItemData = {
      productId: data.id,
      quantity: 1,
      option: data.selectedWeight,
    };
    let filterCheckOutId = createdId ? createdId : checkoutId;
    dispatch(
      addItemToCart({
        itemData: processedItemData,
        checkoutId: filterCheckOutId,
        retailerId: selectedRetailer.id,
      })
    );
    const itemArr = cartList?.filter(item => (item.productId == data.id));
    if (itemArr?.length > 0) {
      const item = itemArr[0];
      addToCartItemForSeo(item.product, item.quantity + 1);
    } else {
      addToCartItemForSeo(data, 1);
    }
  }
  const router = useRouter();
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow:
      ((popularProduct?.data?.menu?.products?.length &&
        sectionTwoCmsData?.status
        ? popularProduct?.data?.menu?.products?.length
        : 0) ||
        (homePageSectionTwo?.length && !sectionTwoCmsData?.status
          ? homePageSectionTwo?.length
          : 0)) == 1
        ? 1
        : ((popularProduct?.data?.menu?.products?.length &&
          sectionTwoCmsData?.status
          ? popularProduct?.data?.menu?.products?.length
          : 0) ||
          (homePageSectionTwo?.length && !sectionTwoCmsData?.status
            ? homePageSectionTwo?.length
            : 0)) == 2
          ? 2
          : 3,
    slidesToScroll: 1,
    adaptiveHeight: false,
    centerMode: false,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    dotsClass: 'dots',
    autoplay: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow:
            ((popularProduct?.data?.menu?.products?.length &&
              sectionTwoCmsData?.status
              ? popularProduct?.data?.menu?.products?.length
              : 0) ||
              (homePageSectionTwo?.length && !sectionTwoCmsData?.status
                ? homePageSectionTwo?.length
                : 0)) == 1
              ? 1
              : ((popularProduct?.data?.menu?.products?.length &&
                sectionTwoCmsData?.status
                ? popularProduct?.data?.menu?.products?.length
                : 0) ||
                (homePageSectionTwo?.length && !sectionTwoCmsData?.status
                  ? homePageSectionTwo?.length
                  : 0)) == 2
                ? 2
                : 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow:
            ((popularProduct?.data?.menu?.products?.length &&
              sectionTwoCmsData?.status
              ? popularProduct?.data?.menu?.products?.length
              : 0) ||
              (homePageSectionTwo?.length && !sectionTwoCmsData?.status
                ? homePageSectionTwo?.length
                : 0)) == 1
              ? 1
              : ((popularProduct?.data?.menu?.products?.length &&
                sectionTwoCmsData?.status
                ? popularProduct?.data?.menu?.products?.length
                : 0) ||
                (homePageSectionTwo?.length && !sectionTwoCmsData?.status
                  ? homePageSectionTwo?.length
                  : 0)) == 2
                ? 1
                : 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow:
            ((popularProduct?.data?.menu?.products?.length &&
              sectionTwoCmsData?.status
              ? popularProduct?.data?.menu?.products?.length
              : 0) ||
              (homePageSectionTwo?.length && !sectionTwoCmsData?.status
                ? homePageSectionTwo?.length
                : 0)) == 1
              ? 1
              : ((popularProduct?.data?.menu?.products?.length &&
                sectionTwoCmsData?.status
                ? popularProduct?.data?.menu?.products?.length
                : 0) ||
                (homePageSectionTwo?.length && !sectionTwoCmsData?.status
                  ? homePageSectionTwo?.length
                  : 0)) == 2
                ? 1
                : 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  async function getProductList() {
    try {
      setShowSkeleton(true);
      await postData(api.home.getProductFilter, {
        retailerId: selectedRetailer?.id,
        menuType: menuTypeValue,
        filter: {},
        pagination: {
          offset: 0,
          limit: 20,
        },
        sort: {
          direction: 'DESC',
          key: 'POPULAR',
        },
      })
        .then((response) => {
          setPopularProduct(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setShowSkeleton(false);
    }
  }

  useEffect(() => {
    getProductList();

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
  }, [selectedRetailer?.id, menuTypeValue]);

  return (
    <div>
      {
        (homePageSectionTwo?.length > 0 && !sectionTwoCmsData?.status) || (popularProduct?.data?.menu?.products?.length > 0 && sectionTwoCmsData?.status) ?
          <div className="container">
            <div className="row gy-4">
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div
                  className={`card rounded-0 justify-content-end px-3 py-2 py-lg-0 ${styles.customSlideCard}`}
                  style={{
                    backgroundColor: `${homeComponentUI?.highFiveSectionBackgroundColor}`,
                  }}
                >
                  <div className="w-100 text-center text-sm-end mb-0">
                    {/* <h1 className="ff-powerGrotesk700 fs-60 fs-xs-30 lh-50 mb-0" style={{ color: "#FFFFFF", letterSpacing: '2px' }}> */}
                    <h1
                      className="ff-Soleil700 fs-60 fs-xs-30 lh-50 mb-0"
                      style={{
                        color: `${homeComponentUI?.highFiveSectionTitleFontColor}`,
                        letterSpacing: '2px',
                      }}
                    >
                      {isMobile
                        ? sectionTwoCmsData?.title
                        : sectionTwoTitleArray?.map((title, index) => (
                          <div key={index}>
                            <span>&nbsp;{title}</span>
                            <br className="d-none d-lg-flex" />
                          </div>
                        ))}
                    </h1>
                    <p
                      className="ff-Soleil400 fs-14 pt-0 pt-lg-2"
                      style={{
                        color: `${homeComponentUI?.highFiveSectionSubtitleFontColor}`,
                      }}
                    >
                      {sectionTwoCmsData?.subTitle}
                    </p>
                  </div>
                  <div
                    className="d-flex justify-content-center d-md-none pb-3"
                    style={{ marginTop: '-5px' }}
                  >
                    <Link
                      href={
                        sectionTwoCmsData?.buttonLink
                          ? sectionTwoCmsData?.buttonLink
                          : ''
                      }
                      className="btn btn-light ff-Soleil400 border-0 rounded-pill fs-14 fs-md-12"
                      style={{
                        width: '104px',
                        height: '31px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: `${homeComponentUI?.highFiveSectionButtonBackgroundColor}`,
                        color: `${homeComponentUI?.highFiveSectionButtonFontColor}`,
                        borderColor: `${homeComponentUI?.highFiveSectionButtonBorderColor}`,
                      }}
                    >
                      {sectionTwoCmsData?.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-sm-6 col-md-8 col-lg-9"
                style={{ position: 'relative' }}
              >
                {!showSkeleton ? (
                  <Slider {...settings}>
                    {sectionTwoCmsData?.status
                      ? popularProduct?.data?.menu?.products.map((li, index) => {
                        let price = '';
                        if (menuTypeValue == 'MEDICAL') {
                          if (li?.variants[0]?.specialPriceMed) {
                            price = `<p className="card-text my-auto"><small className="text-muted"><span className='text-danger fs-16'>Now $${li?.variants[0]?.specialPriceMed} </span>$${li?.variants[0]?.priceMed}</small> | <small className="text-muted">${li?.variants[0]?.option}</small></p>`;
                          } else {
                            price = `<p className="card-text my-auto"><small className="text-muted"><span className='text-danger fs-16'>Now $${li?.variants[0]?.priceMed}</span></small> | <small className="text-muted">${li?.variants[0]?.option}</small></p>`;
                          }
                        } else if (menuTypeValue == 'RECREATIONAL') {
                          if (li?.variants[0]?.specialPriceRec) {
                            price = `<p className="card-text my-auto"><small className="text-muted"><span className='text-danger fs-16'>Now $${li?.variants[0]?.specialPriceRec} </span>$${li?.variants[0]?.priceRec}</small> | <small className="text-muted">${li?.variants[0]?.option}</small></p>`;
                          } else {
                            price = `<p className="card-text my-auto"><small className="text-muted"><span className='text-danger fs-16'>Now $${li?.variants[0]?.priceRec}</span></small> | <small className="text-muted">${li?.variants[0]?.option}</small></p>`;
                          }
                        }

                        return (
                          <div className="slider-item" key={index}>
                            <div
                              className={`card mx-2 rounded-0 border-site-black ${styles.cardCustomSlideCardt}`}
                            >
                              <div>
                                <img
                                  src={li.image}
                                  className="w-100"
                                  style={{ width: '100%', height: '283px' }}
                                  alt=""
                                />
                              </div>
                              <div className="card-body pt-2">
                                <div className={styles.slider_text_box}>
                                  <p className="my-auto ff-Soleil400">
                                    {li?.brand?.name}
                                  </p>
                                  <h5
                                    className="card-title fw-bold ff-Soleil700"
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <Link href={`/product-details/${li.slug}`}>
                                      {li.name}
                                    </Link>
                                  </h5>
                                  {parse(`${price}`)}
                                </div>

                                <Link
                                  href="#"
                                  onClick={(e) => {
                                    addToCart(li, e);
                                  }}
                                  className="px-0 btn bg-transparent border-0 fs-16 ff-Soleil700"
                                  data-bs-toggle="offcanvas"
                                  data-bs-target="#offcanvasRight"
                                >
                                  Add to Cart
                                  <AiFillCaretRight className="fs-12 ms-2" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })
                      : homePageSectionTwo?.map((li, index) => {
                        return (
                          <div className="slider-item highFiveSlider" key={index}>
                            <div
                              className={`card mx-2 h-100 rounded-0 border-site-black ${styles.newHighFiveSliderCard} `}
                            >
                              <div>
                                <img
                                  src={li?.image}
                                  className="w-100"
                                  style={{ width: '100%', height: '283px' }}
                                  alt=""
                                />
                              </div>
                              <div className="card-body pt-2">
                                <div className="">
                                  <h5 className="card-title fw-bold">
                                    {li?.title}
                                  </h5>
                                  <p
                                    className={`fs-14 text-justify ${styles.section_two_desc}`}
                                    style={{
                                      lineHeight: '22px',
                                      color: '#212322',
                                    }}
                                  >
                                    {li?.description}
                                  </p>
                                </div>

                                <Link
                                  href={li?.buttonLink || ''}
                                  className="px-0 btn bg-transparent border-0 fs-16 ff-powerGrotesk700"
                                >
                                  {li?.buttonText}
                                  <AiFillCaretRight className="fs-12 ms-2" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </Slider>
                ) : (
                  <HomeSliderOneSkeleton />
                )}
              </div>
            </div>
          </div>
          :
          <></>
      }
    </div>
  );
}

export default Slider_one;
