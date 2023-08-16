import React from 'react';
import styles from '../styles/Cart.module.css';
import { GoLocation } from 'react-icons/go';
import { RiWallet3Line } from 'react-icons/ri';
import { useState, useEffect } from 'react';
import cartInfo from '../cms-data/cartCms';
import Slider_High_Deals from '../components/BannerTwo';
import Slider_two from '../components/SliderTwo';
import { useRouter } from 'next/router';
import {
  useGetCartPageCmsQuery,
  useGetHomeCmsQuery,
} from '../redux/api_core/apiCore';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSiteLoader,
  setPrevPage,
} from '../redux/global_store/globalReducer';
import {
  increaseItemQuantityInCartList,
  decreaseItemQuantityInCartList,
  updateItemOfCart,
  removeItemFromCart,
} from '../redux/cart_store/cartReducer';
import Swal from 'sweetalert2';
import parse from 'html-react-parser';
import Banner from '../components/Banner';
import { addToWishlist } from '../redux/wishlist_store/wishlistReducer';
import { createToast } from '../utils/toast';
import moment from 'moment';
import { redirectURL, showLoader } from '../utils/helper';
import HeaderTitles from '../components/HeaderTitles';
import Skeleton from 'react-loading-skeleton';
import Head from 'next/head';
import Link from 'next/link';
import Loader from '../components/Loader';
import { checkoutItemsForSeo, decreaseAddToCartItemForSeo, increaseAddToCartItemForSeo, removeFromCartItemsForSeo } from '../utils/seoInformations';

function Cart() {

  const dispatch = useDispatch();
  const { cartList, totalAmount, taxAmount, discountAmount, subtotal, cartCounter, checkoutURL, cartCountDown, cartCounterObj } = useSelector((store) => (store.cartStore));
  const { token, checkoutId, selectedRetailer, userInfo, pageMeta, commonBannerCmsData, menuTypeValue } = useSelector((store) => (store.globalStore));
  let { wishlist } = useSelector(store => (store.wishlistStore));

  const { data, isLoading, isSuccess, isFetching, error } =
    useGetCartPageCmsQuery();
  let Cartdata = data?.data[0];

  const selectedState =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user_selected_retailer_state'))
      : null;
  const {
    data: homeUIData,
    isLoading: homeUIIsLoading,
    isSuccess: homeUIIsSuccess,
    isFetching: homeUIIsFetching,
    error: homeUIError,
  } = useGetHomeCmsQuery(selectedState);
  const homeComponentUI = homeUIData?.data?.homeComponentUI[0];

  const router = useRouter();
  const [counter, updateCounter] = useState(1);

  function showPrice(item) {
    let selectedVariant = {};
    if (item.product?.variants?.length == 1) {
      selectedVariant = item.product?.variants[0];
    } else {
      let variantExist = item.product?.variants.filter(
        (el) => el.option === item.option
      );
      selectedVariant = variantExist[0];
    }

    if (menuTypeValue == 'MEDICAL') {
      if (selectedVariant?.specialPriceMed)
        return `<h3 className='fs-18 lh-24 ff-Soleil700 mb-0' style='color: #F5333F;'>Now $${selectedVariant?.specialPriceMed}<span className="text-site-black fs-16 ff-Soleil400 fw-600 text-decoration-line-through ms-1"> $${selectedVariant?.priceMed}</span></h3>`;
      else
        return `<h3 className="fs-18 lh-24 ff-Soleil700 mb-0">$${selectedVariant?.priceMed} <span className="text-site-black fs-14 ff-Soleil400"></span></h3>`;
    } else if (menuTypeValue == 'RECREATIONAL') {
      if (selectedVariant?.specialPriceRec)
        return `<h3 className='fs-18 lh-24 ff-Soleil700 mb-0' style='color: #F5333F;'>Now $${selectedVariant?.specialPriceRec}<span className="text-site-black fs-16 ff-Soleil400 fw-600 text-decoration-line-through ms-1"> $${selectedVariant?.priceRec}</span></h3>`;
      else
        return `<h3 className="fs-18 lh-24 ff-Soleil700 mb-0">$${selectedVariant?.priceRec} <span className="text-site-black fs-14 ff-Soleil400"></span></h3>`;
    }
  }

  function handleIncreaseQuantity(index, el) {
    dispatch(increaseItemQuantityInCartList(index));
    dispatch(
      updateItemOfCart({
        checkoutId: checkoutId,
        retailerId: selectedRetailer.id,
        index: index,
      })
    );
    const itemArr = cartList?.filter(item => (item.id == el.id));
    if (itemArr?.length > 0) {
      const item = itemArr[0];
      increaseAddToCartItemForSeo(el.product, item.quantity + 1)
    }

  }

  function handleDecreaseQuantity(index, el) {
    if (cartList[index].quantity > 1) {
      dispatch(decreaseItemQuantityInCartList(index));
      dispatch(
        updateItemOfCart({
          checkoutId: checkoutId,
          retailerId: selectedRetailer.id,
          index: index,
        })
      );
      const itemArr = cartList?.filter(item => (item.id == el.id));
      if (itemArr?.length > 0) {
        const item = itemArr[0];
        decreaseAddToCartItemForSeo(el.product, item.quantity - 1)
      }
    }
  }

  function handleRemoveItem(item) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      customClass: 'remove',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const itemArr = cartList?.filter(el => (el.id == item.id));
        if (itemArr?.length > 0) {
          const itemData = itemArr[0];
          removeFromCartItemsForSeo(itemData.product, itemData.quantity);
        }else{
          removeFromCartItemsForSeo(itemData.product, 1);
        }
        dispatch(
          removeItemFromCart({
            itemId: item.id,
            checkoutId: checkoutId,
            retailerId: selectedRetailer.id,
          })
        );
        Swal.fire('Remove!', 'Item remove from cart successfully.', 'success');
      }
    });
  }

  function handleCheckout() {
    showLoader();
    if (token && token != 'undefined') {
      let formatedDate = moment(userInfo?.birthdayDate).format('MMDDYYYY');
      window.location.href =
        checkoutURL +
        `?firstName=${userInfo?.firstName}&lastName=${userInfo?.lastName
        }&phone=${userInfo?.phone}&birthdate=${formatedDate}&email=${userInfo?.email
        }&hideLogin=true&r=${redirectURL()}`;
    } else {
      window.location.href = checkoutURL + `?r=${redirectURL()}`;
    }
    // cartList.forEach(element => {
    //   checkoutItemsForSeo(element.product)
    // });
    Swal.close();
    // else {
    //     dispatch(setPrevPage('cart'))
    //     createToast("Please login", "info");
    //     router.push('/login');
    // }
  }

  function calculateProductPrice(menuType, item) {
    if (menuType == 'RECREATIONAL') {
      if (item.specialPriceRec) return item.specialPriceRec;
      else return item.priceRec;
    }
    if (menuType == 'MEDICAL') {
      if (item.specialPriceMed) return item.specialPriceMed;
      else return item.priceMed;
    }
  }

  function handleWishlist(data) {
    const obj = { ...data };
    obj.menuType = menuTypeValue;
    if (obj?.variants?.length > 1) {
      obj.selectedPrice = calculateProductPrice(obj.menuType, data.variants[0]);
      obj.selectedWeight = data.variants[0].option;
      obj.selectedVariants = JSON.stringify({
        price: data.selectedPrice,
        weight: data.selectedWeight,
      });
    } else {
      obj.selectedPrice = calculateProductPrice(obj.menuType, data.variants[0]);
      obj.selectedWeight = data.variants[0].option;
    }
    dispatch(addToWishlist({ data: obj, quantity: 1 }));
    existInWishlist(data);
  }

  function existInWishlist(data) {
    const item = wishlist.find((el) => el.data.id == data.id);
    if (item) {
      return true;
    } else {
      return false;
    }
  }

  function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const time = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
    return time;
  }

  return (
    <>
      <Head>
        <>
          <meta
            name="description"
            content={pageMeta?.cartPageMetaDescription}
          />
          <meta name="keywords" content={pageMeta?.cartPageMetaKeyword} />
        </>
      </Head>
      {!isLoading ? (
        <div>
          <HeaderTitles title={'cartPageTitle'} />
          <section>
            <Banner commonBannerCmsData={commonBannerCmsData} />
          </section>
          <section className="container">
            <div className="row">
              <div className="col-12 col-lg-7">
                <div className="container p-1 p-lg-4">
                  <div className="mt-4">
                    <div className="d-flex gap-lg-4">
                      <div className="col-md-2">
                        <img
                          src={Cartdata?.topBannerImage}
                          className="my-auto"
                          style={{ height: '140.1px' }}
                        />
                      </div>
                      <div
                        className="col-md-9"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          paddingLeft: '42px',
                        }}
                      >
                        <h1
                          className="fs-30 ff-Soleil700 fs-md-14 mb-4 w-lg-100"
                          style={{ lineHeight: '1em' }}
                        >
                          {Cartdata?.topBannerTitle}
                        </h1>
                        <div className="d-flex flex-column flex-lg-row justify-content-between fs-14 text-decoration-underline">
                          <p className="fs-14 ff-Soleil700">
                            {Cartdata?.topBannerSubtitle}
                          </p>
                          <Link
                            href={Cartdata?.topBannerButtonLink || ''}
                            className="fs-12 fs-md-10"
                          >
                            {Cartdata?.topBannerButtonText}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {cartCountDown > 0 ? (
                    <div className=" p-3 text-center">
                      <div class="alert alert-dark" role="alert">
                        Your items will be held in the cart for{' '}
                        {formatTime(cartCountDown)} minute
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <hr className="my-4 mt-lg-2 mb-lg-4" />
                  <div>
                    {cartList?.length > 0 ? (
                      cartList?.map((el, index) => (
                        <div className="row" key={index}>
                          <div className="col-4 col-lg-3">
                            <Link
                              href={`/product-details/${el?.product?.slug}`}
                            >
                              <img
                                src={el.product?.image}
                                className={styles.cart_img_size}
                                style={{ cursor: 'pointer' }}
                              />
                            </Link>
                          </div>
                          <div className="col-8 col-lg-9">
                            <div className="pe-4">
                              <p className="my-auto fs-12 mt-3">
                                {el.product.brand?.name}
                              </p>
                              <div
                                className={`d-flex justify-content-between ${styles.customShowPrice}`}
                              >
                                <Link
                                  href={`/product-details/${el?.product?.slug}`}
                                  className="fs-16 fw-bold cut-text"
                                  style={{ cursor: 'pointer' }}
                                >
                                  {el.product?.name} - {'  ' + el.option}
                                </Link>
                                {
                                  <p className="fs-16  d-lg-block mt-1 mt-md-0">
                                    {/* <span className='fs-20'>${showPrice(el)}</span> */}
                                    <span className="fs-20">
                                      {parse(`${showPrice(el)}`)}
                                    </span>
                                  </p>
                                }
                              </div>
                              <div className="row">
                                <div className="col-12 col-lg-6 mt-auto order-2 order-lg-1">
                                  <div className="d-flex justify-content-between mt-4 mt-lg-0">
                                    <p className="fs-12 my-auto">
                                      <span
                                        onClick={() => {
                                          handleRemoveItem(el);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        {cartInfo.button_one_text}
                                      </span>
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                          handleWishlist(el.product);
                                        }}
                                        className="ms-4"
                                      >
                                        {existInWishlist(el.product)
                                          ? 'Saved'
                                          : 'Save for later'}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                <div className="col-12 col-lg-6 order-1 order-lg-2">
                                  <div
                                    className={`d-flex gap-4 border border-2 border-dark rounded-pill justify-content-center ms-lg-0 ms-lg-auto ${styles.counter}`}
                                  >
                                    <button
                                      onClick={() => {
                                        handleDecreaseQuantity(index, el);
                                      }}
                                      className="bg-transparent border-0 my-auto fs-16 fw-bold"
                                    >
                                      -
                                    </button>
                                    <p className="my-auto fs-16 fw-bold">
                                      {el.quantity}
                                    </p>
                                    <button
                                      onClick={() => {
                                        handleIncreaseQuantity(index, el);
                                      }}
                                      className="bg-transparent border-0 my-auto fs-16 fw-bold"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr className="my-4 my-lg-5" />
                        </div>
                      ))
                    ) : (
                      <div
                        className="alert alert-dark"
                        role="alert"
                        style={{ textAlign: 'center' }}
                      >
                        Cart is empty!
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <div className="container p-1 p-lg-4">
                  <div
                    className={`d-none d-lg-block w-75 mx-auto ${styles.cart_checkout_button}`}
                  >
                    <button
                      type="submit"
                      className="w-100 border-0 bg-dark text-white rounded-pill fs-16 py-3 ff-Soleil400"
                      onClick={() => {
                        handleCheckout();
                      }}
                    >
                      {token && token != 'undefined'
                        ? cartInfo.checkout_button
                        : 'Guest Checkout'}
                    </button>
                  </div>
                  <hr className="d-block d-lg-none my-4  " />
                  <div className="mt-4 mt-lg-5">
                    <div className="d-flex justify-content-between fs-18 ff-Soleil400">
                      <p className="my-auto">
                        <span className="fw-bold">{cartInfo.total_text}</span> (
                        {cartCounter} item)
                      </p>
                      <p className="my-auto">{subtotal}</p>
                    </div>
                    <div className="d-flex justify-content-between fs-14 ff-Soleil400">
                      <p className="mt-auto">{cartInfo.delivery_type}</p>
                      <p className="text-danger  mt-auto">
                        {cartInfo.delivery_charge}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between fs-18 ff-Soleil400">
                      <p className="fw-bold">{cartInfo.tax_text}</p>
                      <p>{cartInfo.tax_rate}</p>
                      {/* <p>{taxAmount}</p> */}
                    </div>
                    {discountAmount > 0 ? (
                      <div className="d-flex justify-content-between fs-18 ff-Soleil400">
                        <p>{cartInfo.discount_text}</p>
                        <p>{discountAmount}</p>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="d-flex justify-content-between fs-18 ff-Soleil400">
                      <p className="fw-bold">{cartInfo.total_price_text}</p>
                      <p>{totalAmount}</p>
                    </div>
                  </div>
                  <div className="d-block d-lg-none my-3">
                    <button
                      type="submit"
                      className="w-100 border-0 bg-dark text-white rounded-pill fs-16 py-2 ff-Soleil400"
                      onClick={() => {
                        handleCheckout();
                      }}
                    >
                      {token && token != 'undefined'
                        ? cartInfo.checkout_button
                        : 'Guest Checkout'}
                    </button>
                  </div>
                  <div className="mt-3">
                    <p className="fs-14 ff-Soleil400 text-center text-lg-start">
                      Please&nbsp;
                      <Link
                        className="ff-Soleil700"
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                        href={'/login'}
                      >
                        Login&nbsp;
                      </Link>
                      or&nbsp;
                      <Link
                        className="ff-Soleil700"
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                        href={'/registration'}
                      >
                        Register&nbsp;
                      </Link>
                      for a customized shopping experience.
                    </p>
                  </div>
                  {/* <div className={`mt-3 mt-lg-5 bg-dark p-4 text-center`} style={{ backgroundImage: `url(${Cartdata?.bottomBannerImage})`, backgroundRepeat: "no-repeat" }}>
                                <h2 className='text-white fw-bold fs-24 my-auto'>{Cartdata?.bannerTitle}</h2>
                                <p className='text-site-darkkhaki fs-16 my-auto'>{Cartdata?.bannerSubTitle}</p>
                            </div> */}
                  <div className="mt-3 mt-lg-5 bg-dark p-4 text-center">
                    <img
                      src={Cartdata?.bottomBannerImage}
                      alt=""
                      className="w-100"
                    />
                  </div>
                  <div className="mt-4 mt-lg-5">
                    <div className="d-flex gap-2">
                      <picture>
                        <img
                          src="/images/Menu Icon/Small Icon/location.svg"
                          alt="location"
                          style={{ width: '15px' }}
                        />
                      </picture>
                      <div>
                        <p className="fs-14 my-auto">
                          {Cartdata?.bottomSubtitleOne}
                        </p>
                        <p className="fs-16 fw-bold my-auto">
                          {Cartdata?.bottomTitleOne}
                        </p>
                        <Link
                          href={Cartdata?.bottomButtonOneLink || ''}
                          className="fs-14 my-auto"
                        >
                          {Cartdata?.bottomButtonOneText}
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-4">
                      <picture>
                        <img
                          src="/images/Menu Icon/Small Icon/moneybag.svg"
                          alt="wallet"
                          style={{ width: '15px' }}
                        />
                      </picture>
                      <div>
                        <p className="fs-16 fw-bold my-auto">
                          {Cartdata?.bottomTitleTwo}
                        </p>
                        <p className="fs-14 my-auto">
                          {Cartdata?.bottomSubtitleTwo}
                        </p>
                        <Link
                          href={Cartdata?.bottomButtonTwoLink || ''}
                          className="fs-14 my-auto"
                        >
                          {Cartdata?.bottomButtonTwoText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="container text-site-white mt-3 mt-lg-4">
            <Slider_High_Deals />
          </section>
          <section className="py-4 mt-4">
            <Slider_two homeComponentUI={homeComponentUI} />
          </section>
        </div>
      ) : (
        <div>
          <Loader />
          <HeaderTitles title={'cartPageTitle'} />
          <section>
            <div className="container-xxl px-0">
              <Skeleton style={{ width: '100%', height: '130px' }} />
            </div>
          </section>
          <section className="container">
            <div className="row">
              <div className="col-12 col-lg-7">
                <div className="container p-1 p-lg-4">
                  <div className="mt-4">
                    <div className="d-flex gap-lg-4">
                      <div className="col-md-2">
                        <Skeleton
                          style={{ width: '130px', height: '130px' }}
                          circle={true}
                        />
                      </div>
                      <div
                        className="col-md-9"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          paddingLeft: '42px',
                        }}
                      >
                        <h1
                          className="fs-30 ff-Soleil700 fs-md-14 mb-4 w-lg-100"
                          style={{ lineHeight: '1em' }}
                        >
                          <Skeleton style={{ width: '100%', height: '60px' }} />
                        </h1>
                        <div className="d-flex flex-column flex-lg-row justify-content-between fs-14 text-decoration-underline">
                          <p className="fs-14 ff-Soleil700">
                            <Skeleton
                              style={{ width: '250px', height: '20px' }}
                            />
                          </p>
                          <Link
                            href={Cartdata?.topBannerButtonLink || ''}
                            className="fs-12 fs-md-10"
                          >
                            <Skeleton
                              style={{ width: '100px', height: '20px' }}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4 my-lg-5" />
                  <div>
                    <div className="row">
                      <div className="col-4 col-lg-3">
                        <Skeleton
                          className={styles.cart_img_size}
                          style={{ width: '100px', height: '150px' }}
                        />
                      </div>
                      <div className="col-8 col-lg-9">
                        <div className="pe-4">
                          <p className="my-auto fs-12 mt-3">
                            <Skeleton
                              style={{ width: '100px', height: '20px' }}
                            />
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <p
                              className="fs-16 fw-bold cut-text"
                              style={{ cursor: 'pointer' }}
                            >
                              <Skeleton
                                style={{ width: '200px', height: '30px' }}
                              />
                            </p>
                            {
                              <p className="fs-16 d-none d-lg-block">
                                <Skeleton
                                  style={{ width: '80px', height: '30px' }}
                                />
                              </p>
                            }
                          </div>
                          <div className="row">
                            <div className="col-12 col-lg-6 mt-auto order-2 order-lg-1">
                              <div className="d-flex justify-content-between mt-4 mt-lg-0">
                                <p className="fs-12 my-auto">
                                  <Skeleton
                                    style={{ width: '200px', height: '30px' }}
                                  />
                                </p>
                              </div>
                            </div>

                            <div className="col-12 col-lg-6 order-1 order-lg-2 text-end">
                              <Skeleton
                                style={{
                                  width: '100px',
                                  height: '40px',
                                  borderRadius: '50px',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="my-4 my-lg-5" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <div className="container p-1 p-lg-4">
                  <div
                    className={`d-none d-lg-block w-75 mx-auto ${styles.cart_checkout_button}`}
                  >
                    <Skeleton
                      style={{
                        width: '300px',
                        height: '60px',
                        borderRadius: '50px',
                      }}
                    />
                  </div>
                  <hr className="d-block d-lg-none my-4  " />
                  <div className="mt-4 mt-lg-5">
                    <div className="d-flex justify-content-between fs-18 ff-Soleil400">
                      <p className="my-auto">
                        <Skeleton style={{ width: '150px', height: '30px' }} />
                      </p>
                      <p className="my-auto">
                        <Skeleton style={{ width: '100px', height: '30px' }} />
                      </p>
                    </div>
                    <div className="d-flex justify-content-between fs-14 ff-Soleil400">
                      <p className="mt-auto">
                        <Skeleton style={{ width: '150px', height: '30px' }} />
                      </p>
                      <p className="text-danger  mt-auto">
                        <Skeleton style={{ width: '100px', height: '30px' }} />
                      </p>
                    </div>
                    <div className="d-flex justify-content-between fs-18 ff-Soleil400">
                      <p className="mt-auto">
                        <Skeleton style={{ width: '150px', height: '30px' }} />
                      </p>
                      <p className="text-danger  mt-auto">
                        <Skeleton style={{ width: '100px', height: '30px' }} />
                      </p>
                    </div>
                    <div className="d-flex justify-content-between fs-18 ff-Soleil400">
                      <p className="mt-auto">
                        <Skeleton style={{ width: '180px', height: '40px' }} />
                      </p>
                      <p className="text-danger  mt-auto">
                        <Skeleton style={{ width: '100px', height: '40px' }} />
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="fs-14 ff-Soleil400 text-center text-lg-start">
                      <Skeleton style={{ width: '100%', height: '30px' }} />
                    </p>
                  </div>
                  <div className="mt-3 mt-lg-5">
                    <Skeleton style={{ width: '100%', height: '200px' }} />
                  </div>
                  <div className="mt-4 mt-lg-5">
                    <div className="d-flex gap-2">
                      <Skeleton style={{ width: '400px', height: '100px' }} />
                    </div>
                    <div className="d-flex gap-2 mt-4">
                      <Skeleton style={{ width: '400px', height: '100px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="container text-site-white mt-3 mt-lg-4">
            <section
              data-aos="fade-right"
              data-aos-delay="200"
              className={`container text-site-white`}
            >
              <Skeleton width="100%" height="200px" />
            </section>
            <div className="container mt-4">
              <div className="row">
                <div className="col-4">
                  <Skeleton width="100%" height="350px" />
                </div>
                <div className="col-4">
                  <Skeleton width="100%" height="350px" />
                </div>
                <div className="col-4">
                  <Skeleton width="100%" height="350px" />
                </div>
              </div>
            </div>
          </section>
          <section className="py-4 mt-4">
            <section
              data-aos="fade-right"
              data-aos-delay="200"
              className={`container text-site-white`}
            >
              <Skeleton width="100%" height="200px" />
            </section>
            <div className="container mt-4">
              <div className="row">
                <div className="col-4">
                  <Skeleton width="100%" height="350px" />
                </div>
                <div className="col-4">
                  <Skeleton width="100%" height="350px" />
                </div>
                <div className="col-4">
                  <Skeleton width="100%" height="350px" />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default Cart;
