import React, { useState, useEffect } from 'react'
import { FiArrowUpRight, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { AiFillCaretRight } from "react-icons/ai"
import styles from '../styles/SliderTwo.module.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { postData } from '../utils/FetchApi';
import api from '../config/api.json';
import parse from 'html-react-parser';
import { createCheckout, showLoader } from '../utils/helper';
import { useSelector, useDispatch } from 'react-redux';
import { setCheckoutId } from '../redux/global_store/globalReducer';
import { addItemToCart } from "../redux/cart_store/cartReducer";
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useGetHomeCmsQuery } from '../redux/api_core/apiCore';
import Link from 'next/link';
import { addToCartItemForSeo } from '../utils/seoInformations';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="next"
      onClick={onClick}
    ><FiChevronRight /></div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className="previous"
      onClick={onClick}
    >
      <FiChevronLeft />
    </div>
  );
}

function SliderThree({ homeComponentUI }) {

  const router = useRouter();

  let dispatch = useDispatch();
  let { checkoutId, selectedRetailer, menuTypeValue } = useSelector(state => (state.globalStore));
  let { cartList } = useSelector((store) => store.cartStore);
  const selectedState = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user_selected_retailer_state')) : null;
  const { data, isLoading, isSuccess, isFetching, error } = useGetHomeCmsQuery(selectedState);
  const sectionEightCms = data?.data?.homePageSectionEightCmsData[0];
  const homePageSectionEight = data?.data?.homePageSectionEightData;

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
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
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
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

  const [newDrop, setNewDrop] = useState([]);

  async function addToCart(data) {
    let createdId = "";
    if (selectedRetailer?.id && checkoutId == 'undefined') {
      let retailerType = localStorage.getItem('retailer_type') && localStorage.getItem('retailer_type') != 'undefined' ? JSON.parse(localStorage.getItem('retailer_type')) : 'PICKUP';
      createdId = await createCheckout({
        retailerId: selectedRetailer?.id,
        orderType: retailerType == 'Curbside Pickup' ? 'PICKUP' : retailerType.toUpperCase(),
        pricingType: menuTypeValue
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
      option: data.selectedWeight
    }
    let filterCheckOutId = (createdId ? createdId : checkoutId);
    dispatch(addItemToCart({ itemData: processedItemData, checkoutId: filterCheckOutId, retailerId: selectedRetailer.id }));
    const itemArr = cartList?.filter(item => (item.productId == data.id));
    if (itemArr?.length > 0) {
      const item = itemArr[0];
      addToCartItemForSeo(item.product, item.quantity + 1);
    } else {
      addToCartItemForSeo(data, 1);
    }
  }

  useEffect(() => {
    postData(api.home.getProductFilter, {
      retailerId: selectedRetailer?.id,
      menuType: menuTypeValue,
      filter: {
        menuSection: {
          type: "CUSTOM_SECTION",
          name: "Home Sunny Daze"
        }
      },
    })
      .then(response => {
        setNewDrop(response?.data?.menu?.products);
      })
      .catch(error => {
        console.log(error);
      });
  }, [selectedRetailer?.id, menuTypeValue]);

  return (
    <div>
      {
        newDrop?.length > 0 || homePageSectionEight?.length > 0 ?
          <>
            {/* SunnyDaze Banner Start */}
            {
              ((sectionEightCms?.status && newDrop?.length > 0) || (!sectionEightCms?.status && homePageSectionEight?.length > 0)) &&
              <section data-aos="fade-right"
                data-aos-delay="200" className={`container text-site-white ${styles.customGap}`}>
                <div style={{ backgroundColor: `${homeComponentUI?.sunnyDazeSectionBackgroundColor}` }} className={`text-site-white d-flex flex-column justify-content-start border border-2 border-dark mt-3 mt-md-0 ${styles.customSunnyDaze}`}>
                  <div className="text-center text-md-start pt-0 pt-md-4 pt-md-0">
                    <h2 className="w-25 w-md-100 fs-60 fs-md-30 ff-PowerGrotesk700 lh-55 text-center text-md-start" style={{ color: `${homeComponentUI?.sunnyDazeSectionTitleFontColor}`, letterSpacing: '2px' }}>{sectionEightCms?.title}</h2>
                  </div>
                  <div className="d-flex flex-column flex-md-row justify-content-between mt-0 mt-md-3 pb-2 pb-md-0">
                    <p className="lh-10 text-center text-md-start fs-14 ff-Soleil400 mb-2" style={{ color: `${homeComponentUI?.sunnyDazeSectionSubtitleFontColor}` }}>{sectionEightCms?.subTitle}</p>
                    <Link href={sectionEightCms?.buttonLink || ""} className="d-none d-md-block lh-10 me-2 text-center text-md-start fs-14 ff-Soleil400 mb-2" style={{ 'cursor': 'pointer', color: `${homeComponentUI?.sunnyDazeSectionButtonFontColor}` }}><u>{sectionEightCms?.buttonText}</u></Link>
                    <div className={`d-flex justify-content-center d-md-none ${styles.customSunnyDazeButton}`}>
                      <Link href={sectionEightCms?.buttonLink || ""} className='btn btn-light py-1 border-0 rounded-pill fs-14 ff-Soleil400' style={{ width: "104px", height: "31px", display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: `${homeComponentUI?.sunnyDazeSectionButtonBackgroundColor}`, color: `${homeComponentUI?.sunnyDazeSectionButtonMobileFontColor}`, borderColor: `${homeComponentUI?.sunnyDazeSectionButtonBorderColor}` }}>{sectionEightCms?.buttonText}</Link>
                    </div>
                  </div>
                </div>
              </section>
            }
            {/* SunnyDaze Banner End */}
            {/* SunnyDaze Slider Start */}
            <div className="container">
              <Slider {...settings}>
                {(sectionEightCms?.status && newDrop?.length > 0) && newDrop?.map((li, index) => {
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
                    <div className='customSunnyDaze' key={index}>
                      <div className="slider-item h-100 py-0 py-lg-3 px-0 px-lg-1">
                        <div className={`card rounded-0 border-dark h-100 mx-2 ${styles.newDropSliderCard}`}>
                          <div>
                            <img src={li.image} className={`w-100 ${styles.main_img}`} style={{ width: "100%", objectFit: 'contain' }} />
                          </div>
                          <div className="p-3">
                            <div className={`${styles.slider_text_box}`}>
                              <p className='my-auto'>{li.brand.name}</p>
                              <h5 className="card-title fw-bold line-clamp-1" style={{ cursor: 'pointer' }} ><Link href={`/product-details/${li.slug}`}>{li.name}</Link></h5>
                              {parse(`${price}`)}
                            </div>

                            <Link href="#" onClick={(e) => { addToCart(li, e) }} className={`ff-Soleil400 px-5 rounded-pill fs-16 fs-md-12 btn btn-outline-dark ${styles.custom_add_to_cart_button}`} data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">
                              Add to Cart
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
                }
                {
                  !sectionEightCms?.status &&
                  homePageSectionEight?.map((li, index) => {
                    return (
                      <div className="slider-item h-100" key={index}>
                        <div className={`card rounded-0 border-dark h-100 mx-2 ${styles.newDropSliderCard}`}>
                          <div>
                            <img src={li.image} className="w-100" style={{ width: "100%", height: "283px" }} />
                          </div>
                          <div className="p-3">
                            <div className="">
                              <h5 className="card-title fw-bold" >{li.title}</h5>
                              <p className={`${styles.new_drops_banner_desc}`}>{(li?.description?.length > 90) ? `${li.description.slice(0, 90)}...` : li.description}</p>
                            </div>

                            <Link href={li.buttonLink || ""} className={`px-5 rounded-pill fs-16 fs-md-12 btn btn-outline-dark ff-Soleil400`}>
                              {li.buttonText}
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </Slider>
            </div>
            {/* SunnyDaze Slider End */}
          </>
          :
          <></>
      }

    </div>
  )
}

export default SliderThree