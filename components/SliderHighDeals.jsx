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
import { setCheckoutId, setHighDetalsDataCheck } from '../redux/global_store/globalReducer';
import { addItemToCart } from "../redux/cart_store/cartReducer";
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
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

function HighDealsSlider() {

  const router = useRouter();

  let dispatch = useDispatch();
  let { checkoutId, selectedRetailer, menuTypeValue } = useSelector(state => (state.globalStore));
  let { cartList } = useSelector((store) => store.cartStore);

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

  const [highDeals, setHighDeals] = useState([]);

  async function addToCart(data) {
    let createdId = "";
    if (selectedRetailer?.id && checkoutId == 'undefined') {
      let retailerType = localStorage.getItem('retailer_type') && localStorage.getItem('retailer_type') != 'undefined' ? JSON.parse(localStorage.getItem('retailer_type')) : 'PICKUP';
      createdId = await createCheckout({ retailerId: selectedRetailer?.id, orderType: retailerType == 'Curbside Pickup' ? 'PICKUP' : retailerType.toUpperCase(), pricingType: "RECREATIONAL" });
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
          name: "Cart Page High Deals"
        }
      },
    })
      .then(response => {
        setHighDeals(response?.data?.menu?.products);
        response?.data?.menu?.products.length > 0 ? dispatch(setHighDetalsDataCheck(true)) : dispatch(setHighDetalsDataCheck(false));
      })
      .catch(error => {
        console.log(error);
      });
  }, [selectedRetailer?.id, menuTypeValue]);

  return (
    <>
      {
        highDeals.length > 0 ?
          <div>
            <div className="container container_highDeals">
              <Slider {...settings} className={`${styles.square}`}>
                {highDeals?.map((li, index) => {
                  let price = '';
                  if (li?.variants[0]?.specialPriceRec) {
                    price = `<p className="card-text my-auto"><small className="text-muted"><span className='text-danger fs-16'>Now $${li?.variants[0]?.specialPriceRec} </span>$${li?.variants[0]?.priceRec}</small> | <small className="text-muted">${li?.variants[0]?.option}</small></p>`;
                  } else {
                    price = `<p className="card-text my-auto"><small className="text-muted"><span className='text-danger fs-16'>Now $${li?.variants[0]?.priceRec}</span></small> | <small className="text-muted">${li?.variants[0]?.option}</small></p>`;
                  }

                  return (
                    <div className={`${styles.customSliderCard}`}>
                      <div className="slider-item py-0 py-lg-3 px-0 px-lg-1" key={index}>
                        <div className={`card rounded-0 border-dark h-100 mx-2 ${styles.newHigherDealsCard}`}>
                          <div>
                            <img src={li?.image} className={`w-100 ${styles.main_img}`} style={{ width: "100%", objectFit: 'contain' }} />
                          </div>
                          <div className="p-3">
                            <div className={`${styles.slider_text_box}`}>
                              <p className='my-auto' style={{ color: "#212529" }}>{li.brand.name}</p>
                              <h5 className="card-title fw-bold line-clamp-1" style={{ cursor: 'pointer', color: "#212529" }} onClick={() => { router.push(`/product-details/${li.slug}`) }}>{li.name}</h5>
                              {parse(`${price}`)}
                            </div>

                            <button className={`px-5 rounded-pill fs-16 fs-md-12 btn btn-outline-dark ff-Soleil400 ${styles.custom_add_to_cart_button}`} data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" onClick={() => { addToCart(li) }}>
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
                }
              </Slider>
            </div>
          </div>
          : <></>
      }
    </>

  )
}

export default HighDealsSlider