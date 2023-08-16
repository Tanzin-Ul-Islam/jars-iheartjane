import React, { useState, useEffect, useRef } from 'react'
import { FiArrowUpRight, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { AiFillCaretRight } from "react-icons/ai"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from 'next/router';
import api from '../config/api.json';
import { postData } from '../utils/FetchApi';
import styles from '../styles/SliderOne.module.css';
import parse from 'html-react-parser';
import { createCheckout, showLoader } from '../utils/helper';
import { useSelector, useDispatch } from 'react-redux';
import { setCheckoutId } from '../redux/global_store/globalReducer';
import { addItemToCart } from "../redux/cart_store/cartReducer";
import Swal from 'sweetalert2';
import { useGetHowToEnjoyCmsQuery } from '../redux/api_core/apiCore';
import { addToCartItemForSeo } from '../utils/seoInformations';


function SliderHowToEnjoy() {

  let dispatch = useDispatch();
  let { checkoutId, selectedRetailer, menuTypeValue } = useSelector(state => (state.globalStore));
  let { cartList } = useSelector((store) => store.cartStore);
  const [howToEnjoyData, setHowToEnjoyData] = useState([]);

  const howToEnjoy = useGetHowToEnjoyCmsQuery();

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
  const router = useRouter()
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

  useEffect(() => {
    postData(api.home.getProductFilter, {
      retailerId: selectedRetailer.id,
      menuType: menuTypeValue,
      filter: {
        menuSection: {
          type: "CUSTOM_SECTION",
          name: "How To Enjoy"
        }
      }
    })
      .then(response => {
        setHowToEnjoyData(response?.data?.menu?.products);
      })
      .catch(error => {
        console.log(error);
      });
  }, [selectedRetailer?.id]);

  const sectionHowToEnjoyArray = howToEnjoy?.data?.data[0]?.title.split(" ");

  return (
    (howToEnjoyData?.length > 0) ?
      <div>
        <div className="container">
          <div className="row gy-3">
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 bg-site-black rounded-0 justify-content-end px-3">
                <div className="w-100 text-center text-sm-end py-2">
                  <h1 className="ff-powerGrotesk700 fs-60 fs-xs-30 text-site-blue-100 lh-50 mb-0">
                    {sectionHowToEnjoyArray?.map((title, index) => (
                      <>
                        <span key={index}>{title}</span>
                        <br key={index} className='d-none d-lg-flex' />
                      </>
                    ))}
                  </h1>
                  <p className="ff-Soleil400 fs-14 text-site-blue-100 pt-0 pt-lg-2 mb-2">{howToEnjoy?.data?.data[0]?.subTitle}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-8 col-lg-9" style={{ position: "relative" }}>
              <Slider {...settings}>
                {howToEnjoyData?.map((li, index) => {
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
                    <div className="slider-item h-100 py-0 py-lg-1" key={index}>
                      <div className={`card mx-2 h-100 rounded-0 border-site-black ${styles.cardCustomSlideCard}`}>
                        <div>
                          <img src={li.image} className="w-100" style={{ width: "100%", height: "220px", objectFit: 'contain' }} alt="" />
                        </div>
                        <div className="card-body pt-2">
                          <div className={styles.slider_text_box}>
                            <p className='my-auto'>{li.brand.name}</p>
                            <h5 className="card-title fw-bold" style={{ cursor: 'pointer' }} onClick={() => { router.push(`/product-details/${li.slug}`) }} >{li.name}</h5>
                            {parse(`${price}`)}
                          </div>

                          <button onClick={() => { addToCart(li) }} className={`btn bg-transparent fs-16 ff-powerGrotesk700 ${styles.addToCartButton}`} data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">Add to Cart
                            <AiFillCaretRight className="fs-12 ms-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
                }
              </Slider>
            </div>
          </div>
        </div>
      </div> : <></>
  )
}

export default SliderHowToEnjoy
