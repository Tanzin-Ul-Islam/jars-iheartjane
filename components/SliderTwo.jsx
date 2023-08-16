import React, { useState, useEffect } from 'react'
import { FiArrowUpRight, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { AiFillCaretRight } from "react-icons/ai"
import Slider from "react-slick";
import styles from '../styles/SliderTwo.module.css';
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

function Slider_two({ homeComponentUI }) {

  const router = useRouter();

  let dispatch = useDispatch();
  let { checkoutId, selectedRetailer, menuTypeValue } = useSelector(state => (state.globalStore));
  let { cartList } = useSelector((store) => store.cartStore);
  const selectedState = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user_selected_retailer_state')) : null;
  const { data, isLoading, isSuccess, isFetching, error } = useGetHomeCmsQuery(selectedState);

  const dropBannerCmsData = data?.data?.dropBannerCmsData[0];
  const homePageNewDropsBanner = data?.data?.homePageNewDropBannerData;

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
          slidesToShow: 2,
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
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 576,
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
          name: "New Drops"
        }
      },
    })
      .then(response => {
        if (response?.data?.menu?.products) setNewDrop(response?.data?.menu?.products);
      })
      .catch(error => {
        console.log(error);
      });
  }, [selectedRetailer?.id, menuTypeValue]);

  return (
    <>
      {/* New Drops Banner Start */}
      {
        (!dropBannerCmsData?.status || newDrop?.length > 0) &&
        <section data-aos="fade-right"
          data-aos-delay="200" className={`container text-site-white ${styles.customGap}`}>
          <div className={`${styles.customDropsBanner}`} style={{ backgroundColor: `${homeComponentUI?.newDropsSectionBackgroundColor}` }}>
            <div className="w-25 w-md-100 text-center text-md-start">
              <h2 className="fs-60 fs-md-30 ff-PowerGrotesk700 lh-55 lh-md-30 ms-0 ms-md-2" style={{ color: `${homeComponentUI?.newDropsSectionTitleFontColor}`, letterSpacing: '2px' }}>{dropBannerCmsData?.title}</h2>
            </div>
            <div className="d-flex flex-column flex-md-row justify-content-between ms-0 ms-md-2 mt-0 mt-md-3 pb-1 pb-md-0">
              <p className="lh-10 text-center text-md-start fs-14 ff-Soleil400 mb-2" style={{ color: `${homeComponentUI?.newDropsSectionSubtitleFontColor}`, letterSpacing: '2px' }}>{dropBannerCmsData?.subTitle}</p>
              <Link href={dropBannerCmsData?.buttonLink || ""} className="d-none d-md-block lh-10 me-2 text-center text-md-start fs-14 mb-2" style={{ 'cursor': 'pointer', color: `${homeComponentUI?.newDropsSectionButtonFontColor}` }}><u>{dropBannerCmsData?.buttonText}</u></Link>
              <div className="d-flex justify-content-center d-md-none mt-3">
                <Link href={dropBannerCmsData?.buttonLink || ""} className='btn btn-light ff-Soleil400 border-0 rounded-pill fs-14 fs-md-12' style={{ width: "104px", height: "31px", display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: `${homeComponentUI?.newDropsSectionButtonBackgroundColor}`, color: `${homeComponentUI?.newDropsSectionButtonMobileFontColor}`, borderColor: `${homeComponentUI?.newDropsSectionButtonBorderColor}` }}>{dropBannerCmsData?.buttonText}</Link>
              </div>
            </div>
          </div>
        </section>
      }

      {/* New Drops Banner End */}
      {/* New Drops Slider Start */}
      <div className={styles.customGap}>
        <div className="container containerNewDrop">
          <Slider {...settings}>
            {dropBannerCmsData?.status
              ?
              newDrop?.map((li, index) => {
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
                  <div className='customNewDrops' key={index}>
                    <div className={`slider-item py-0 py-lg-3 px-0 px-lg-1 ${styles.sliderItem}`} >
                      <div className={`card rounded-0 border-dark h-100 mx-2 ${styles.newDropSliderCard}`}>
                        <div>
                          <img src={li?.image} className={styles.main_img} style={{ width: "100%", objectFit: 'contain' }} />
                        </div>
                        <div className="p-3">
                          <div className={`${styles.slider_text_box}`}>
                            <p className='my-auto'>{li?.brand.name}</p>
                            <h5 className="card-title fw-bold line-clamp-1 global_line_product_limit_card_title" style={{ cursor: 'pointer' }} ><Link href={`/product-details/${li?.slug}`}>{li?.name}</Link></h5>
                            {parse(`${price}`)}
                          </div>
                          <Link href="#" className={`${styles.custom_add_to_cart_button} px-5 rounded-pill fs-16 fs-md-12 btn btn-outline-dark ff-Soleil400`} data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" onClick={(e) => { addToCart(li, e) }}>
                            Add to Cart
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
              :
              homePageNewDropsBanner?.map((li, index) => {
                return (
                  <div className="slider-item h-100" key={index}>
                    <div className={`card rounded-0 border-dark h-100 mx-2 ${styles.newDropSliderCard}`}>
                      <div>
                        <img src={li?.image} className={`${styles.hero_img} w-100`} />
                      </div>
                      <div className="p-3">
                        <div className="">
                          <h5 className="card-title fw-bold">{(li?.title.length > 32) ? `${li.title.slice(0, 32)}...` : li.title}</h5>
                          <p className={`fs-14 text-justify ${styles.new_drops_banner_desc}`} style={{ lineHeight: '22px', color: '#212322', }}>{(li?.description.length > 90) ? `${li.description.slice(0, 90)}...` : li.description}</p>
                        </div>

                        <Link href={li?.buttonLink || ""} className="px-5 mt-4 rounded-pill fs-16 fs-md-12 btn btn-outline-dark ff-Soleil400">
                          {li?.buttonText}
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </Slider>
        </div>
      </div>
      {/* New Drops Slider End */}
    </>
  )
}

export default Slider_two