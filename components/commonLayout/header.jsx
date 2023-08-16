import styles from './css/Header.module.css';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { MdOutlineQuiz } from 'react-icons/md';
import { VscHome } from 'react-icons/vsc';
import Marquee from 'react-fast-marquee';
import Link from 'next/link';
import { CiWallet } from 'react-icons/ci';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { FiShoppingCart } from 'react-icons/fi';
import { BsFillQuestionCircleFill, BsPencilSquare } from 'react-icons/bs';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  useGetRetailerDataMutation,
  useGetDiscoverHoverCmsQuery,
} from '../../redux/api_core/apiCore';
import HeaderCmsInterface from '../../interfaces/HeaderInterface';
import DiscoverHoverModalCms from '../../interfaces/DiscoverHoverInterface';
import { postData } from '../../utils/FetchApi';
import api from '../../config/api.json';
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai';
import {
  setAllRetailer,
  setCheckoutId,
  setEffectValue,
  setMenuTypeValue,
  setRetailerType,
  setSelectedRetailer,
  setToken,
  setUserInfo,
} from '../../redux/global_store/globalReducer';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import parse from 'html-react-parser';
import usePopupClose from '../../hooks/usePopupClose';
import { createCheckout, retialerNameSlug, toTitleCase, urlSlug } from '../../utils/helper';
import { setSiteLoader } from '../../redux/global_store/globalReducer';
import Skeleton from 'react-loading-skeleton';
import EffectListSkeleton from '../Ui/Skeleton/ListSkeleton/EffectListSkeleton';
import CategoryListSkeleton from '../Ui/Skeleton/ListSkeleton/CategoryListSkeleton';
import { setCartCountDown, setCartCounter, setCartList, setDiscount, setSubTotal, setTaxAmont, setTotalAmont } from '../../redux/cart_store/cartReducer';
import Swal from 'sweetalert2';
import useDidMountEffect from '../../custom-hook/useDidMount';
import Loader from '../Loader';

export default function Header() {
  let {
    siteLoader,
    categories,
    todaySpecialsValue,
    token,
    selectedRetailer,
    retailerType,
    allRetailer,
    globalEffects,
    pageMeta,
    headerBannerCmsDataJSON,
    Headerdata,
    hoverModalCms,
    categoryLoader,
    effectLoader,
    filterLoader,
    filterVariants,
    topTickerComponentUI,
    menuTypeValue
  } = useSelector((store) => store.globalStore);
  let { cartCounter } = useSelector((store) => store.cartStore);

  const [initailStage, setSetInitailStage] = useState(true);

  const [isMobile, setIsMobile] = useState(false);
  const [isShopPage, setIsShopPage] = useState(false);
  const [selectRetail, setSelectRetail] = useState({});
  const [showDiv, setShowDiv] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedStateName, setSelectedStateName] = useState('');

  const [toggleViewMode, setToggleViewMode] = useState(false);
  const [toggleViewMode2, setToggleViewMode2] = useState(false);

  const [menuTypeList, setMenuTypeList] = useState(['RECREATIONAL', 'MEDICAL']);



  const closeSidebar = useRef(null);

  const [getRetailer, result] = useGetRetailerDataMutation({});
  const [isSecondVisible, setIsSecondVisible] = useState(false);
  const [isShopVisible, setIsShopVisible] = useState(false);
  const [isDiscoverVisible, setIsDiscoverVisible] = useState(false);
  const [isDailyDeals, setIsDailyDeals] = useState(false);
  const skeletonList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [croseButton, setCroseButton] = useState(false);

  const handleShopClick = (e) => {
    e.preventDefault();
    setIsShopVisible(true);
  };

  const mobileHandleShopClick = (e) => {
    e.preventDefault();
    setIsShopVisible(true);
  };
  // console.log(isShopVisible);
  const handleCustomShop = () => {
    // router.push("/shop")
    setIsShopVisible(false);
    closeSidebar.current?.click();
  };
  const handleDiscoverClick = (e) => {
    e.preventDefault();
    setIsDiscoverVisible(true);
  };
  const handleDailyDeals = (e) => {
    e.preventDefault();
    setIsDailyDeals(true);
  };
  const handleSecondClick = () => {
    setIsSecondVisible(!isSecondVisible);
  };
  const handleFeaturedArticles = (article_url) => {
    router.push(`/blog/${article_url}`);
    setIsDiscoverVisible(false);
  };
  const handleFeaturedPress = (press_url) => {
    router.push(`/press/${press_url}`);
    setIsDiscoverVisible(false);
  };
  const handleAllFeaturedPress = () => {
    // router.push(`/press`)
    setIsDiscoverVisible(false);
    closeSidebar.current?.click();
  };
  const handleAllFeatured = () => {
    // router.push('/blog')
    setIsDiscoverVisible(false);
    closeSidebar.current?.click();
  };
  const handleTodaySpecials = () => {
    // router.push('/daily-deals')
    setIsDailyDeals(false);
  };
  const handleStoreDetails = () => {
    // router.push("/store-details")
    setIsShopVisible(false);
    closeSidebar.current?.click();
  };
  const handleClick = () => {
    closeSidebar.current?.click();
    setToggleViewMode(false);
    setToggleViewMode2(false);
    setIsShopVisible(false);
  };
  const handleDirection = () => {
    // router.push("/get-direction")
    setIsShopVisible(false);
  };
  const handleContact = () => {
    // router.push("/contact")
    setIsShopVisible(false);
  };
  const handleShopCategories = () => {
    // router.push(
    //   `/category/${category}`
    // )
    setIsShopVisible(false);
    closeSidebar.current?.click();
  };
  const shopMode = async () => {
    if (toggleViewMode2) {
      setToggleViewMode2(false);
    }
    setToggleViewMode(!toggleViewMode);
  };
  const discoverMode = async () => {
    if (toggleViewMode) {
      setToggleViewMode(false);
    }
    setToggleViewMode2(!toggleViewMode2);
  };

  // const { data, isSuccess, isFetching, error } = useGetFooterCmsQuery();
  const hoverDiscoverCms = useGetDiscoverHoverCmsQuery({});

  // let Headerdata = data?.data?.headerCmsData[0];
  // const hoverModalCms = data?.data?.serviceTypeCmsData[0];

  function handleLogout() {
    dispatch(setSiteLoader(true));
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('birthdayDate');
    localStorage.removeItem('birthdayDate');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('phone');
    dispatch(setToken('undefined'));
    dispatch(
      setUserInfo({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthdayDate: '',
      })
    );
    setTimeout(() => {
      dispatch(setSiteLoader(false));
      router.push('/');
    }, 500);
  }
  const [counter, updateCounter] = useState(1);
  function handleIncrement() {
    updateCounter(counter + 1);
  }
  function handleDecrement() {
    updateCounter(counter <= 0 ? 0 : counter - 1);
  }

  function handleDeliveryType() {
    dispatch(setRetailerType('delivery'));
    localStorage.setItem('retailer_type', JSON.stringify('delivery'));
  }

  function handlePickupType() {
    dispatch(setRetailerType('pickup'));
    localStorage.setItem('retailer_type', JSON.stringify('pickup'));
  }

  useEffect(() => { }, [counter]);

  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  var d = new Date();
  var dayName = days[d.getDay()];
  const [dayN, setDayN] = useState(null);

  function checkActiveDay() {
    let dayN = undefined;
    const retailer = selectedRetailer;
    for (let hour in retailer?.hours) {
      if ('Friday' === dayName) {
        dayN = (retailer?.hours?.curbsidePickup?.Friday?.active) ? retailer?.hours?.curbsidePickup?.Friday : (retailer?.hours?.pickup?.Friday?.active) ? retailer?.hours?.pickup?.Friday : retailer?.hours?.delivery?.Friday;
      }
      else if ('Saturday' === dayName) {
        dayN = (retailer?.hours?.curbsidePickup?.Saturday?.active) ? retailer?.hours?.curbsidePickup?.Saturday : (retailer?.hours?.pickup?.Saturday?.active) ? retailer?.hours?.pickup?.Saturday : retailer?.hours?.delivery?.Saturday;
      }
      else if ('Sunday' === dayName) {
        dayN = (retailer?.hours?.curbsidePickup?.Sunday?.active) ? retailer?.hours?.curbsidePickup?.Sunday : (retailer?.hours?.pickup?.Sunday?.active) ? retailer?.hours?.pickup?.Sunday : retailer?.hours?.delivery?.Sunday;
      }
      else if ('Monday' === dayName) {
        dayN = (retailer?.hours?.curbsidePickup?.Monday?.active) ? retailer?.hours?.curbsidePickup?.Monday : (retailer?.hours?.pickup?.Monday?.active) ? retailer?.hours?.pickup?.Monday : retailer?.hours?.delivery?.Monday;
      }
      else if ('Tuesday' === dayName) {
        dayN = (retailer?.hours?.curbsidePickup?.Tuesday?.active) ? retailer?.hours?.curbsidePickup?.Tuesday : (retailer?.hours?.pickup?.Tuesday?.active) ? retailer?.hours?.pickup?.Tuesday : retailer?.hours?.delivery?.Tuesday;
      }
      else if ('Wednesday' === dayName) {
        dayN = (retailer?.hours?.curbsidePickup?.Wednesday?.active) ? retailer?.hours?.curbsidePickup?.Wednesday : (retailer?.hours?.pickup?.Wednesday?.active) ? retailer?.hours?.pickup?.Wednesday : retailer?.hours?.delivery?.Wednesday;
      }
      else if ('Thursday' === dayName) {
        dayN = (retailer?.hours?.curbsidePickup?.Thursday?.active) ? retailer?.hours?.curbsidePickup?.Thursday : (retailer?.hours?.pickup?.Thursday?.active) ? retailer?.hours?.pickup?.Thursday : retailer?.hours?.delivery?.Thursday;
      }
    }
    setDayN(dayN);
  }

  const [search, setSearch] = useState('');

  const handleSiteProductSearchBox = (data) => {
    router.push({ pathname: '/shop', query: { search: data } });
    setSearch('');
  };

  const [sugData, setSugData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchLoader, setSearchLoader] = useState(false);

  const handleSearchOnChange = async (e) => {
    setSearchLoader(true);
    const search = e.target.value;
    setSearch(search);

    const stateName = JSON.parse(
      localStorage.getItem('user_selected_retailer_state')
    );

    const data = {
      search,
      retailerId: selectedRetailer?.id,
      state: stateName,
      limit: 5,
    };
    const response = await postData(
      api.product.productServiceElasticSearch,
      data
    );
    if (response.status === 200 || response.status === 201) {
      const products = response.data.data.products;
      setSugData(products);
      setBrands([...new Set(products.map((x) => x.brandName))]);
      setTotalProducts(response.data.data.total);
    }
    setSearchLoader(false);
  };

  const handleSearchOnFocus = (e) => {
    const headerLodo = document.getElementById('logoMobile');
    const headerBar = document.getElementById('toogleBar');
    const headerCart = document.getElementById('mobileCart');
    const headerCancelSearch = document.getElementById('headerCancelSearch');
    // console.log('headerBar', headerBar)
    headerLodo.style.display = 'none';
    headerBar.style.display = 'none';
    headerBar.classList.remove('d-flex');
    headerCart.style.display = 'none';
    headerCancelSearch.style.display = 'block';
    setCroseButton(true);
  };

  const handleSearchOnBlur = (e) => {
    const headerLodo = document.getElementById('logoMobile');
    const headerBar = document.getElementById('toogleBar');
    const headerCart = document.getElementById('mobileCart');
    const headerCancelSearch = document.getElementById('headerCancelSearch');
    // console.log('headerBar', headerBar)
    headerLodo.style.display = 'block';
    headerBar.classList.add('d-flex');
    headerCart.style.display = 'block';
    headerCancelSearch.style.display = 'none';
  };

  const handleSubmitSearchMobile = (e) => {
    e.preventDefault();
  }

  const handleKeyPress = (event) => {
    setCroseButton(true);
    if (event.key === "Enter") {
      handleSiteProductSearchBox(event.target.value)
    }
  }

  const handleSearchTextRemove = (e) => {
    e.preventDefault();
    setSearch("");
    setCroseButton(false);
  }

  const [brand, setBrand] = useState('');
  const [customOff, setCustomOff] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [retailerContactNumber, setRetailerContactNumber] = useState('');

  function handleEffectCLick(el) {
    dispatch(setEffectValue(el));
  }

  const divRef = useRef(null);
  const picDevRef = useRef(null);

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setCustomOff(false);
    }
  };

  const shopRef = useRef(null);
  const discoverRef = useRef(null);
  const dailyRef = useRef(null);

  usePopupClose(shopRef, setIsShopVisible);
  usePopupClose(discoverRef, setIsDiscoverVisible);
  usePopupClose(dailyRef, setIsDailyDeals);
  usePopupClose(picDevRef, setIsSecondVisible);

  const [headerBannerCmsData, setHeaderBannerCmsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getHeaderBannerCms = async () => {
    if (headerBannerCmsDataJSON?.id) {
      const bannerArray = [];
      for (const [key, value] of Object.entries(
        JSON.parse(headerBannerCmsDataJSON?.bannerText)
      )) {
        bannerArray.push({
          banner: key,
          link: value,
        });
      }
      setHeaderBannerCmsData(bannerArray);
      setIsLoading(false);
    }
  };

  async function handleSearchSug(data) {
    clearPaginationFilterAndInitSkeleton();
    setCustomOff(false);
    setSearch(data);
    searchInit.current = true;
    search.current = data;
    offsetKey.current = 0;
    clearAllFilter();
    // await getProductList();
    searchInit.current = false;
  }

  // handle pricing type start
  function checkValidStoreForMedical() {
    const storeList = ["JARS Cannabis – East Detroit"];
    const isValid = storeList.includes(selectedRetailer?.name);
    return isValid;
  }

  async function handleCreateCheckout(pricingTypeValue) {
    let selectedRetialerValue =
      localStorage.getItem('selected-retailer') &&
        localStorage.getItem('selected-retailer') != 'undefined'
        ? JSON.parse(localStorage.getItem('selected-retailer'))
        : 'undefined';
    let retailerType =
      localStorage.getItem('retailer_type') &&
        localStorage.getItem('retailer_type') != 'undefined'
        ? JSON.parse(localStorage.getItem('retailer_type'))
        : 'PICKUP';
    let checkoutId = await createCheckout({
      retailerId: selectedRetialerValue.id,
      orderType: retailerType == 'Curbside Pickup' ? 'PICKUP' : retailerType.toUpperCase(),
      pricingType: pricingTypeValue,
    });
    if (checkoutId) {
      dispatch(setCheckoutId(checkoutId));
    }
  }

  async function clearCartAll() {
    dispatch(setCartList([]));
    dispatch(setCartCounter(0));
    dispatch(setSubTotal(0));
    dispatch(setTotalAmont(0));
    dispatch(setTaxAmont(0));
    dispatch(setDiscount(0));
    localStorage.setItem('cartList', JSON.stringify([]));
    dispatch(setCartCountDown(null));
    localStorage.removeItem('countDownTime');
  }

  async function handleMenuTypeDropdownSelection(data) {
    try {
      if (cartCounter > 0) {
        Swal.fire({
          title: 'Are you sure?',
          text: "Changing pricing type will clear your existing cart",
          customClass: 'remove',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, change!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            setIsShowLoading(true)
            dispatch(setMenuTypeValue(data));
            localStorage.setItem("menuTypeValue", data);
            await clearCartAll();
            await handleCreateCheckout(data);
            if (router.pathname === '/product-details/[id]') {
              router.push('/shop');
            }
            setIsShowLoading(false)
          }
        });
      } else {
        setIsShowLoading(true)
        dispatch(setMenuTypeValue(data));
        localStorage.setItem("menuTypeValue", data);
        await clearCartAll();
        await handleCreateCheckout(data);
        if (router.pathname === '/product-details/[id]') {
          router.push('/shop');
        }
        setIsShowLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  }
  // handle pricing type end

  useEffect(() => {
    getHeaderBannerCms();
  }, [headerBannerCmsDataJSON?.id]);

  useEffect(() => {
    const stateName = JSON.parse(
      localStorage.getItem('user_selected_retailer_state')
    );
    if (stateName != 'undefined') {
      setSelectedStateName(stateName?.toLowerCase());
    }
  }, [selectedRetailer?.id]);

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

    setRetailerContactNumber('');
    if (selectedRetailer && allRetailer?.length > 0) {
      for (let retailer of allRetailer) {
        if (retailer.id === selectedRetailer.id && retailer.contactNumber)
          setRetailerContactNumber(retailer.contactNumber);
      }
    }
  }, [selectedRetailer]);

  useEffect(() => {
    if (result?.data !== undefined) {
      if (result?.data?.length > 0) {
        dispatch(setAllRetailer(result?.data));
        localStorage.setItem('all_retailer', JSON.stringify(result?.data));
      }
    }
  }, [result]);

  useEffect(() => {
    setTimeout(() => {
      setSetInitailStage(false);
    }, 300);
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    checkActiveDay();
  }, [selectedRetailer?.id]);


  useEffect(() => {
    if (router.isReady) {
      if (router.pathname == '/shop') {
        setIsShopPage(true);
      } else {
        setIsShopPage(false);
      }
    }
  }, [router.pathname]);

  return (
    <>
      {isShowLoading ? <Loader /> : <></>}
      {
        !initailStage && (
          <>
            <div className="fixed-top bg-site-blue-100">
              {!isLoading ? (
                <div
                  className="text-center py-1 px-3"
                  style={{ backgroundColor: topTickerComponentUI?.backgroundColor }}
                >
                  <Marquee
                    gradient={false}
                    className="ff-inter500 fs-14 mb-0"
                    style={{ color: topTickerComponentUI?.fontColor }}
                  >
                    {headerBannerCmsData?.length > 0 ? (
                      <>
                        {headerBannerCmsData?.map((banner, index) => (
                          <p
                            key={index}
                            className="mb-0 cp"
                            onClick={(e) => router.push(banner.link)}
                          >
                            {banner.banner}{' '}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
                          </p>
                        ))}
                      </>
                    ) : (
                      <></>
                    )}
                    {/* {Headerdata?.bannerText} */}
                  </Marquee>
                </div>
              ) : (
                <Skeleton
                  style={{
                    width: '100%',
                    height: '30px',
                    transform: 'translate(0, -3px)',
                  }}
                />
              )}
              {isMobile ? (
                <header className="navbar navbar-expand-lg navbar-dark bd-navbar">
                  <nav
                    className="container bd-gutter flex-wrap flex-lg-nowrap"
                    aria-label="Main navigation"
                  >
                    <div className="main-mobile-header-content d-flex align-items-center gap-3 w-100">
                      <div className="d-flex" id="toogleBar">
                        <div
                          className="navbar-toggler d-flex flex-column gap-1 d-lg-none order-4 p-0 text-site-black w-100"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#bdNavbar"
                          aria-controls="bdNavbar"
                          aria-label="Toggle navigation"
                          style={{ marginLeft: '10px' }}
                        >
                          <span
                            className="bg-site-black rounded-pill"
                            style={{ height: '2px', width: '15px' }}
                          ></span>
                          <span
                            className="bg-site-black rounded-pill"
                            style={{ height: '2px', width: '15px' }}
                          ></span>
                          <span
                            className="bg-site-black rounded-pill"
                            style={{ height: '2px', width: '15px' }}
                          ></span>
                        </div>
                      </div>
                      <Link
                        className="navbar-brand p-0 me-0 d-lg-none gap-3 logoMobile"
                        href="/"
                        aria-label="Bootstrap"
                      >
                        <picture>
                          <img src={Headerdata?.logo} height="41" id="logoMobile" />
                        </picture>
                      </Link>
                      <div
                        className="right-content d-flex divForMobileSearch"
                        style={{ width: '100%' }}
                      >
                        <form style={{ width: '100%' }} onSubmit={handleSubmitSearchMobile}>
                          <div
                            className={`d-flex border border-dark rounded-pill mt-1 mt-lg-0 ${styles.customSearchBox}`}
                          >
                            <input
                              ref={divRef}
                              type="text"
                              autoComplete="off"
                              className={`form-control fs-12 shadow-none bg-transparent ${styles.customInputForm}`}
                              placeholder="Search JARS"
                              aria-label="Search here"
                              aria-describedby="Search-addon2"
                              value={search}
                              id="searchInput"
                              onChange={handleSearchOnChange}
                              onFocus={handleSearchOnFocus}
                              onBlur={handleSearchOnBlur}
                              onClick={() => setCustomOff(true)}
                              onKeyDown={handleKeyPress}
                            />
                            <i onClick={handleSearchTextRemove} className={`bx bx-x ${croseButton ? 'd-block' : 'd-none'}`} style={{ position: 'absolute', top: '10px', right: '39.5px' }}></i>
                            <picture>
                              <img
                                onClick={() => handleSiteProductSearchBox(search)}
                                src="../../images/nav-icons/Search.svg"
                                className="ms-2"
                                style={{ paddingRight: '4px', height: '27px' }}
                                alt="JARS Cannabis"
                                title="JARS Cannabis"
                              />
                            </picture>
                            {/* {search && customOff && (
                              <div
                              className={`container  ${styles.search_card_suggestion_mobile}`}
                              >
                                <div className="row d-flex justify-content-center shadow-lg">
                                  <div className="custom-search-card">
                                    <div
                                      className={
                                        totalProducts > 0 ? "border-bottom" : ""
                                      }
                                    >
                                      <div className="py-2">
                                        {sugData.map((x) => (
                                          <p
                                            className="fs-14"
                                            key={x.id}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => { setSearch(x.brandNameAndProductNameAndCategoryName); handleSiteProductSearchBox(x.brandNameAndProductNameAndCategoryName) }}
                                          >
                                            {parse(`${x.highlight}`)}
                                          </p>
                                        ))}
                                      </div>
                                    </div>
                                    <div
                                      className={
                                        totalProducts > 0 ? "border-bottom" : ""
                                      }
                                    >
                                      <div className="py-2">
                                        {brands.map((brand, index) => (
                                          <p
                                            className="fs-14 fw-bold"
                                            key={index}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => { setBrand(brand); handleSiteProductSearchBox(brand) }}
                                          >
                                            {brand}
                                          </p>
                                        ))}
                                      </div>
                                    </div>
                                    {sugData.map((x, index) => (
                                      <Link key={index}
                                        className="border-bottom"
                                        style={{ cursor: "pointer" }}
                                        href={`/product-details/${x.productSlug}`}
                                        onClick={() => { setSearch(""); }}
                                      >
                                        <div className="py-2">
                                          <div className="d-flex mt-2">
                                            <picture className="my-auto">
                                              <img
                                                src={x.image}
                                                height={60}
                                                width={60}
                                                style={{ objectFit: "fill" }}
                                              />
                                            </picture>
                                            <div className="ms-3 w-100">
                                              <p className="fs-10 mb-0">
                                                {x.brandName}
                                              </p>
                                              <p className="mb-0 fs-14">
                                                {x.productName}
                                              </p>
                                              <div className="text-start my-auto">
                                                <p
                                                  className="text-nowrap text-success"
                                                  style={{ fontSize: "12px" }}
                                                >
                                                  variants: {x.variants}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Link>
                                    ))}
                                    <div className="mt-3">
                                      <div className="text-center">
                                        {totalProducts > 0 ? (
                                          <button
                                            className="bg-transparent border-0 fs-md-12"
                                            onClick={() => handleSiteProductSearchBox(search)}
                                          >
                                            View All{" "}
                                            <span className="fw-bold">
                                              {totalProducts}
                                            </span>{" "}
                                            Products
                                          </button>
                                        ) : (
                                          <div className="">
                                            <button
                                              className="bg-transparent border-0 fs-md-12">
                                              No products found!
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )} */}
                          </div>
                        </form>

                        <div className="d-flex ms-md-auto me-3 me-lg-0">
                          <div
                            className="nav-link py-2 px-2 text-site-black cp"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasRight"
                            aria-controls="offcanvasRight"
                            style={{ marginRight: '-3px' }}
                            id="mobileCart"
                          >
                            <span className="position-relative">
                              <picture>
                                <img
                                  src="/images/nav-icons/Cart.svg"
                                  alt="Jars"
                                  height="30"
                                  style={{ marginRight: '2px' }}
                                />
                              </picture>
                              <span
                                className="start-100 translate-middle bg-dark fs-12 badge rounded-circle"
                                style={{
                                  width: '21px',
                                  height: '21px',
                                  paddingTop: '4px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  position: 'absolute',
                                  top: '2px',
                                  border: '1px solid #FFF',
                                }}
                              >
                                {cartCounter}
                              </span>
                            </span>
                          </div>
                          <div
                            className={`nav-link py-2 px-2 text-site-black cp fs-14 ${styles.headerCancelSearch}`}
                            id="headerCancelSearch"
                          >
                            Cancel
                          </div>
                        </div>
                        {search && customOff && (
                          <div
                            className={`container  ${styles.search_card_suggestion_mobile}`}
                          >
                            <div className="row d-flex justify-content-center shadow-lg">
                              <div className="custom-search-card">
                                <div
                                  className={
                                    totalProducts > 0 ? 'border-bottom' : ''
                                  }
                                >
                                  <div className="py-2">
                                    {sugData.map((x) => (
                                      <p
                                        className="fs-14"
                                        key={x.id}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                          setSearch(
                                            x.brandNameAndProductNameAndCategoryName
                                          );
                                          handleSiteProductSearchBox(
                                            x.brandNameAndProductNameAndCategoryName
                                          );
                                        }}
                                      >
                                        {parse(`${x.highlight}`)}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                                <div
                                  className={
                                    totalProducts > 0 ? 'border-bottom' : ''
                                  }
                                >
                                  <div className="py-2">
                                    {brands.map((brand, index) => (
                                      <p
                                        className="fs-14 fw-bold"
                                        key={index}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                          setBrand(brand);
                                          handleSiteProductSearchBox(brand);
                                        }}
                                      >
                                        {brand}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                                {sugData.map((x, index) => (
                                  <Link
                                    key={index}
                                    className="border-bottom"
                                    style={{ cursor: 'pointer' }}
                                    href={`/product-details/${x.productSlug}`}
                                    onClick={() => {
                                      setSearch('');
                                    }}
                                  >
                                    <div className="py-2">
                                      <div className="d-flex mt-2">
                                        <picture className="my-auto">
                                          <img
                                            src={x.image}
                                            height={60}
                                            width={60}
                                            style={{ objectFit: 'fill' }}
                                          />
                                        </picture>
                                        <div className="ms-3 w-100">
                                          <p className="fs-10 mb-0">
                                            {x.brandName}
                                          </p>
                                          <p className="mb-0 fs-14">
                                            {x.productName}
                                          </p>
                                          <div className="text-start my-auto">
                                            <p
                                              className="text-nowrap text-success"
                                              style={{ fontSize: '12px' }}
                                            >
                                              variants: {x.variants}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                                <div className="mt-3">
                                  <div className="text-center">
                                    {totalProducts > 0 ? (
                                      // <button onClick={() => handleSiteProductSearchBox(search)}></button>
                                      <Link
                                        className="bg-transparent border-0 fs-md-12"
                                        href={'/shop?search=' + search}
                                      >
                                        View All{' '}
                                        <span className="fw-bold">
                                          {totalProducts}
                                        </span>{' '}
                                        Products
                                      </Link>
                                    ) : (
                                      <div className="">
                                        <button className="bg-transparent border-0 fs-md-12">
                                          No products found!
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <br />
                                  <br />
                                  <br />
                                  <br />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* <div className="right-content d-flex" style={{ width: '60%' }}>
                        <div className="d-flex ms-auto me-4 me-lg-0 d-md-none">
                          <button
                            onClick={() => [
                              setShowDiv(!showDiv),
                              setIsSecondVisible(false),
                            ]}
                            className="bg-transparent border-0"
                          >
                            <picture>
                            <img src="../../images/nav-icons/search.svg" alt="JARS Cannabis" title="JARS Cannabis" style={{ height: '30px' }} />
                            </picture>
                          </button>
                        </div>
    
                        <div className="d-flex ms-md-auto me-3 me-lg-0">
                          <div
    
                            className="nav-link py-2 px-2 text-site-black cp"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasRight"
                            aria-controls="offcanvasRight"
                          >
                            <span className="position-relative">
                              <picture>
                                <img src="/images/nav-icons/Cart.svg" alt="Jars" height="30" style={{ marginRight: '2px' }} />
                              </picture>
                              <span
                                className="start-100 translate-middle bg-dark fs-12 badge rounded-circle"
                                style={{
                                  width: "21px",
                                  height: "21px",
                                  paddingTop: "4px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "absolute",
                                  top: '2px',
                                  border: '1px solid #FFF'
                                }}
                              >
                                {cartCounter}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div> */}
                    </div>

                    <div
                      className="offcanvas-lg offcanvas-start flex-grow-1"
                      tabIndex={-1}
                      id="bdNavbar"
                      aria-labelledby="bdNavbarOffcanvasLabel"
                      data-bs-scroll="true"
                    >
                      <div className="offcanvas-header px-4 pb-0">
                        {Headerdata?.logo ? (
                          <Link href="/">
                            <h5
                              className="offcanvas-title text-site-black"
                              id="bdNavbarOffcanvasLabel"
                              data-bs-target="#bdNavbar"
                              data-bs-dismiss="offcanvas"
                            >
                              <picture>
                                <img src={Headerdata?.logo} height="51" />
                              </picture>
                            </h5>
                          </Link>
                        ) : (
                          <Skeleton
                            style={{ width: '55px', height: '55px' }}
                            circle={true}
                          />
                        )}
                        <button
                          type="button"
                          className="btn-close shadow-none"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                          data-bs-target="#bdNavbar"
                          ref={closeSidebar}
                        ></button>
                      </div>

                      <div className="offcanvas-body p-4 pt-0 p-lg-0 justify-content-between align-items-center">
                        <hr className="d-lg-none " />
                        <ul className="navbar-nav flex-row flex-wrap bd-navbar-nav w-100">
                          {/* <li className="nav-item col-12 col-lg-auto">
                                <a onClick={() => (shopMode(), router.push('/shop'))} className="nav-link py-2 px-0 px-lg-2 text-site-black cp dropdown-toggle">
                                    Shop
                                </a>
                            </li> */}
                          <li
                            className={`nav-item col-12 col-lg-auto ${styles.custom_nav_item}`}
                          >
                            <div className="d-flex justify-content-center align-items-center me-2">
                              <div
                                onClick={handleShopClick}
                                className="d-none d-md-block fs-14 mb-0 fw-bold nav-link py-2 px-0 pe-lg-2 text-site-black cp"
                              >
                                SHOP
                              </div>
                              <picture
                                className={`d-none d-md-block ${styles.customShopClick}`}
                                onClick={handleShopClick}
                              >
                                <img src="/images/dropdown.png" />
                              </picture>
                            </div>
                            <div className="d-flex d-md-none justify-content-start align-items-center gap-2">
                              <div
                                onClick={mobileHandleShopClick}
                                className="fs-14 fw-bold nav-link py-2 px-0 pe-lg-2 text-site-black cp"
                              >
                                SHOP
                              </div>
                              <picture
                                className={`cp ${styles.customShopClick}`}
                                onClick={mobileHandleShopClick}
                              >
                                <img src="/images/dropdown.png" />
                              </picture>
                            </div>
                          </li>
                          <li
                            className="nav-item col-12 col-lg-auto"
                            data-bs-target="#bdNavbar"
                            data-bs-dismiss="offcanvas"
                          >
                            <div
                              className="nav-link py-2 px-0 px-lg-2 text-site-black fs-14 fw-bold text-uppercase cp"
                              // onClick={handleClick}
                              onClick={handleDailyDeals}
                            >
                              <div className="d-flex justify-content-start align-items-center mx-0 mx-md-1">
                                <div>DAILY DEALS</div>
                                <picture
                                  className={`ms-2 ${styles.customShopClick}`}
                                >
                                  <img src="/images/dropdown.png" />
                                </picture>
                              </div>
                            </div>
                          </li>
                          <li
                            className={`nav-item col-12 col-lg-auto ${styles.custom_nav_item}`}
                          >
                            {/* <a onClick={() => discoverMode()} className="nav-link py-2 px-0 px-lg-2 text-site-black cp dropdown-toggle">
                                    Discover
                
                </a> */}
                            <div className="d-flex justify-content-center align-items-center me-3">
                              <div>
                                <div
                                  onClick={handleDiscoverClick}
                                  className="d-none d-md-block fs-14 fw-bold nav-link py-2 px-0 px-lg-2 text-site-black cp text-uppercase"
                                >
                                  DISCOVER
                                </div>
                              </div>
                              <div>
                                <picture
                                  onClick={handleDiscoverClick}
                                  className={`d-none d-md-block cp ${styles.customShopClick}`}
                                >
                                  <img src="/images/dropdown.png" />
                                </picture>
                              </div>
                            </div>
                            <div className="d-flex d-md-none justify-content-start align-items-center gap-2">
                              <div
                                onClick={handleDiscoverClick}
                                className="d-block d-md-none fs-14 fw-bold nav-link py-2 px-0 px-lg-2 text-site-black cp text-uppercase"
                              >
                                DISCOVER
                              </div>
                              <picture
                                onClick={handleDiscoverClick}
                                className={`${styles.customShopClick}`}
                              >
                                <img src="/images/dropdown.png" />
                              </picture>
                            </div>
                          </li>
                          <li
                            className="nav-item col-12 col-lg-auto"
                            data-bs-target="#bdNavbar"
                            data-bs-dismiss="offcanvas"
                          >
                            <Link
                              href="/jars-plus"
                              className="nav-link py-2 px-0 px-lg-2 text-site-black fs-14 fw-bold text-uppercase d-flex gap-2 align-content-center"
                              onClick={handleClick}
                            >
                              <picture>
                                <img
                                  src="/images/nav-icons/Wallet.svg"
                                  alt="Jars"
                                  height="30"
                                  style={{ marginTop: '-3px' }}
                                />
                              </picture>
                              JARS+
                            </Link>
                          </li>
                        </ul>

                        <hr className="d-lg-none" />
                        {Headerdata?.logo ? (
                          <Link
                            className="navbar-brand p-0 me-0 d-none d-lg-block"
                            href="/"
                          >
                            <picture>
                              <img src={Headerdata?.logo} height="73" />
                            </picture>
                          </Link>
                        ) : (
                          <Skeleton
                            style={{ width: '75px', height: '75px' }}
                            circle={true}
                          />
                        )}
                        <ul className="navbar-nav flex-row flex-wrap w-100 justify-content-end align-items-center">
                          <li
                            className="nav-item col-12 col-lg-auto"
                            data-bs-target="#bdNavbar"
                            data-bs-dismiss="offcanvas"
                          >
                            <Link
                              className="nav-link py-2 px-0 px-lg-2 text-site-black fs-14 ff-Soleil700 text-uppercase d-flex gap-2 align-items-center"
                              href="/my-items"
                              onClick={handleClick}
                            >
                              <picture>
                                <img
                                  src="/images/nav-icons/Download.svg"
                                  height={30}
                                  alt="my-items"
                                />
                              </picture>
                              MY ITEMS
                            </Link>
                          </li>
                          {token && token == 'undefined' ? (
                            <>
                              <li
                                className="nav-item col-12 col-lg-auto"
                                data-bs-target="#bdNavbar"
                                data-bs-dismiss="offcanvas"
                              >
                                <Link
                                  className="nav-link py-2 px-0 px-lg-2 text-site-black fs-14 ff-Soleil700 text-uppercase d-flex gap-2 align-items-center"
                                  href="/login"
                                >
                                  <picture>
                                    <img
                                      src="/images/nav-icons/Person.svg"
                                      height={30}
                                      alt="profile"
                                    />
                                  </picture>
                                  LOGIN / REGISTER
                                </Link>
                              </li>
                              {/* <li className="nav-item py-1 col-12 col-lg-auto d-none d-lg-block">
                    <div className="vr d-none d-lg-flex h-100 mx-lg-2 text-site-black"></div>
                    <hr className="d-lg-none text-white-50" />
                  </li> */}
                            </>
                          ) : (
                            <li
                              className="nav-item col-12 col-lg-auto dropdown"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              data-bs-display="static"
                            >
                              <Link
                                className="nav-link py-2 px-0 px-lg-2 text-site-black fs-14 ff-Soleil700 text-uppercase"
                                href="/user"
                              >
                                <picture>
                                  <img src="/images/profile.svg" alt="profile" />
                                </picture>
                                &nbsp; My Account
                              </Link>
                              {/* <a type="button"
                                            className="nav-link py-2 px-0 px-lg-2 text-site-black fs-20"
                                            data-bs-toggle="dropdown" aria-expanded="false"
                                            data-bs-display="static">
                                            <i className="bi bi-person-circle"></i>
                                            My Account
                                        </a> */}
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li
                                  data-bs-target="#bdNavbar"
                                  data-bs-dismiss="offcanvas"
                                >
                                  <button
                                    className="dropdown-item fs-14 ff-Soleil400"
                                    onClick={() => router.push('/user')}
                                  >
                                    Profile
                                  </button>
                                </li>
                                <li
                                  data-bs-target="#bdNavbar"
                                  data-bs-dismiss="offcanvas"
                                >
                                  <Link
                                    className="dropdown-item fs-14 ff-Soleil400"
                                    href="/"
                                    onClick={handleLogout}
                                  >
                                    Logout
                                  </Link>
                                </li>
                              </ul>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </nav>
                </header>
              ) : (
                <header className="navbar navbar-expand-lg navbar-dark bd-navbar">
                  <nav
                    className="container bd-gutter flex-wrap flex-lg-nowrap"
                    aria-label="Main navigation"
                  >
                    <Link
                      className="navbar-brand p-0 me-0 d-lg-none"
                      href="/"
                      aria-label="Bootstrap"
                    >
                      <picture>
                        <img src={Headerdata?.logo} height="51" />
                      </picture>
                    </Link>

                    <div
                      className="offcanvas-lg offcanvas-start flex-grow-1"
                      tabIndex={-1}
                      id="bdNavbar"
                      aria-labelledby="bdNavbarOffcanvasLabel"
                      data-bs-scroll="true"
                    >
                      <div className="offcanvas-header px-4 pb-0">
                        {Headerdata?.logo ? (
                          <Link href="/">
                            <h5
                              className="offcanvas-title text-site-black"
                              id="bdNavbarOffcanvasLabel"
                              data-bs-target="#bdNavbar"
                              data-bs-dismiss="offcanvas"
                            >
                              <picture>
                                <img src={Headerdata?.logo} height="51" />
                              </picture>
                            </h5>
                          </Link>
                        ) : (
                          <Skeleton
                            style={{ width: '55px', height: '55px' }}
                            circle={true}
                          />
                        )}
                        <button
                          type="button"
                          className="btn-close shadow-none"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                          data-bs-target="#bdNavbar"
                          ref={closeSidebar}
                        ></button>
                      </div>

                      <div className="offcanvas-body p-4 pt-0 p-lg-0 justify-content-between align-items-center">
                        <hr className="d-lg-none " />
                        <ul className="navbar-nav flex-row flex-wrap bd-navbar-nav w-100">
                          {/* <li className="nav-item col-12 col-lg-auto">
                                        <a onClick={() => (shopMode(), router.push('/shop'))} className="nav-link py-2 px-0 px-lg-2 text-site-black cp dropdown-toggle">
                                            Shop
                                        </a>
                                    </li> */}
                          <li
                            className={`nav-item col-12 col-lg-auto ${styles.custom_nav_item}`}
                          >
                            <div className="d-flex justify-content-center align-items-center me-2">
                              <div
                                onClick={handleShopClick}
                                className="d-none d-md-block fs-14 mb-0 fw-bold nav-link py-2 px-0 pe-lg-2 text-site-black cp"
                              >
                                SHOP
                              </div>
                              <picture
                                className={`d-none d-md-block ${styles.customShopClick}`}
                                onClick={handleShopClick}
                              >
                                <img src="/images/dropdown.png" />
                              </picture>
                            </div>
                            <div className="d-flex d-md-none justify-content-start align-items-center gap-2">
                              <div
                                onClick={mobileHandleShopClick}
                                className="fs-14 fw-bold nav-link py-2 px-0 pe-lg-2 text-site-black cp"
                              >
                                SHOP
                              </div>
                              <picture
                                className={`cp ${styles.customShopClick}`}
                                onClick={mobileHandleShopClick}
                              >
                                <img src="/images/dropdown.png" />
                              </picture>
                            </div>
                          </li>
                          <li
                            className="nav-item col-12 col-lg-auto"
                            data-bs-target="#bdNavbar"
                            data-bs-dismiss="offcanvas"
                          >
                            <div
                              className="nav-link py-2 px-0 px-lg-2 text-site-black fs-14 fw-bold text-uppercase cp"
                              // onClick={handleClick}
                              onClick={handleDailyDeals}
                            >
                              <div className="d-flex justify-content-start align-items-center mx-0 mx-md-1">
                                <div>DAILY DEALS</div>
                                <picture
                                  className={`ms-2 ${styles.customShopClick}`}
                                >
                                  <img src="/images/dropdown.png" />
                                </picture>
                              </div>
                            </div>
                          </li>
                          <li
                            className={`nav-item col-12 col-lg-auto ${styles.custom_nav_item}`}
                          >
                            {/* <a onClick={() => discoverMode()} className="nav-link py-2 px-0 px-lg-2 text-site-black cp dropdown-toggle">
                                            Discover
                        
                        </a> */}
                            <div className="d-flex justify-content-center align-items-center me-3">
                              <div>
                                <div
                                  onClick={handleDiscoverClick}
                                  className="d-none d-md-block fs-14 fw-bold nav-link py-2 px-0 px-lg-2 text-site-black cp text-uppercase"
                                >
                                  DISCOVER
                                </div>
                              </div>
                              <div>
                                <picture
                                  onClick={handleDiscoverClick}
                                  className={`d-none d-md-block cp ${styles.customShopClick}`}
                                >
                                  <img src="/images/dropdown.png" />
                                </picture>
                              </div>
                            </div>
                            <div className="d-flex d-md-none justify-content-start align-items-center gap-2">
                              <div
                                onClick={handleDiscoverClick}
                                className="d-block d-md-none fs-14 fw-bold nav-link py-2 px-0 px-lg-2 text-site-black cp text-uppercase"
                              >
                                DISCOVER
                              </div>
                              <picture
                                onClick={handleDiscoverClick}
                                className={`${styles.customShopClick}`}
                              >
                                <img src="/images/dropdown.png" />
                              </picture>
                            </div>
                          </li>
                          <li
                            className="nav-item col-12 col-lg-auto"
                            data-bs-target="#bdNavbar"
                            data-bs-dismiss="offcanvas"
                          >
                            <Link
                              href="/jars-plus"
                              className="nav-link py-2 px-0 px-lg-2 text-site-black fs-14 fw-bold text-uppercase d-flex gap-2 align-content-center"
                              onClick={handleClick}
                            >
                              <picture>
                                <img
                                  src="/images/nav-icons/Wallet.svg"
                                  alt="Jars"
                                  height="30"
                                  style={{ marginTop: '-3px' }}
                                />
                              </picture>
                              JARS+
                            </Link>
                          </li>
                        </ul>

                        <hr className="d-lg-none" />
                        {Headerdata?.logo ? (
                          <Link
                            className="navbar-brand p-0 me-0 d-none d-lg-block"
                            href="/"
                          >
                            <picture>
                              <img src={Headerdata?.logo} height="73" />
                            </picture>
                          </Link>
                        ) : (
                          <Skeleton
                            style={{ width: '75px', height: '75px' }}
                            circle={true}
                          />
                        )}
                        <ul className="navbar-nav flex-row flex-wrap w-100 justify-content-end align-items-center">
                          <li
                            className="nav-item col-12 col-lg-auto"
                            data-bs-target="#bdNavbar"
                            data-bs-dismiss="offcanvas"
                          >
                            <Link
                              className="nav-link py-2 px-0 px-lg-2 text-site-black fs-14 ff-Soleil700 text-uppercase d-flex gap-2 align-items-center"
                              href="/my-items"
                              onClick={handleClick}
                            >
                              <picture>
                                <img
                                  src="/images/nav-icons/Download.svg"
                                  height={30}
                                  alt="my-items"
                                />
                              </picture>
                              MY ITEMS
                            </Link>
                          </li>
                          {token && token == 'undefined' ? (
                            <>
                              <li
                                className="nav-item col-12 col-lg-auto"
                                data-bs-target="#bdNavbar"
                                data-bs-dismiss="offcanvas"
                              >
                                <Link
                                  className="nav-link py-2 px-0 px-lg-2 text-site-black fs-14 ff-Soleil700 text-uppercase d-flex gap-2 align-items-center"
                                  href="/login"
                                >
                                  <picture>
                                    <img
                                      src="/images/nav-icons/Person.svg"
                                      height={30}
                                      alt="profile"
                                    />
                                  </picture>
                                  LOGIN / REGISTER
                                </Link>
                              </li>
                              {/* <li className="nav-item py-1 col-12 col-lg-auto d-none d-lg-block">
                            <div className="vr d-none d-lg-flex h-100 mx-lg-2 text-site-black"></div>
                            <hr className="d-lg-none text-white-50" />
                          </li> */}
                            </>
                          ) : (
                            <li
                              className="nav-item col-12 col-lg-auto dropdown"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              data-bs-display="static"
                            >
                              <Link
                                className="nav-link py-2 px-0 px-lg-2 text-site-black fs-14 ff-Soleil700 text-uppercase"
                                href="/user"
                              >
                                <picture>
                                  <img src="/images/profile.svg" alt="profile" />
                                </picture>
                                &nbsp; My Account
                              </Link>
                              {/* <a type="button"
                                                    className="nav-link py-2 px-0 px-lg-2 text-site-black fs-20"
                                                    data-bs-toggle="dropdown" aria-expanded="false"
                                                    data-bs-display="static">
                                                    <i className="bi bi-person-circle"></i>
                                                    My Account
                                                </a> */}
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li
                                  data-bs-target="#bdNavbar"
                                  data-bs-dismiss="offcanvas"
                                >
                                  <button
                                    className="dropdown-item fs-14 ff-Soleil400"
                                    onClick={() => router.push('/user')}
                                  >
                                    Profile
                                  </button>
                                </li>
                                <li
                                  data-bs-target="#bdNavbar"
                                  data-bs-dismiss="offcanvas"
                                >
                                  <Link
                                    className="dropdown-item fs-14 ff-Soleil400"
                                    href="/"
                                    onClick={handleLogout}
                                  >
                                    Logout
                                  </Link>
                                </li>
                              </ul>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="d-flex ms-auto me-3 me-lg-0 d-md-none">
                      {/* <a data-bs-toggle="modal" data-bs-target="#searchModal" className="nav-link py-2 px-2 text-site-black cp">
                                <i className="bi bi-search"></i>
                            </a> */}
                      <button
                        onClick={() => [
                          setShowDiv(!showDiv),
                          setIsSecondVisible(false),
                        ]}
                        className="bg-transparent border-0"
                      >
                        <picture>
                          <img
                            src="../../images/nav-icons/Search.svg"
                            alt="JARS Cannabis"
                            title="JARS Cannabis"
                            style={{ height: '30px' }}
                          />
                        </picture>
                      </button>
                    </div>

                    <div className="d-flex ms-md-auto me-3 me-lg-0">
                      {/* href="/cart" */}
                      {/* <a className="nav-link py-2 px-2 text-site-black position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                <FiShoppingCart className="fs-24" />
                                <span className={styles.cartCount}>{cartCounter}</span>
                            </a> */}
                      <div
                        className="nav-link py-2 px-2 text-site-black cp"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        <span className="position-relative">
                          <picture>
                            <img
                              src="/images/nav-icons/Cart.svg"
                              alt="Jars"
                              height="30"
                              style={{ marginRight: '2px' }}
                            />
                          </picture>
                          <span
                            className="start-100 translate-middle bg-dark fs-12 badge rounded-circle"
                            style={{
                              width: '21px',
                              height: '21px',
                              paddingTop: '4px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              position: 'absolute',
                              top: '2px',
                              border: '1px solid #FFF',
                            }}
                          >
                            {cartCounter}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div
                        className="navbar-toggler d-flex flex-column gap-1 d-lg-none order-4 p-0 text-site-black "
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#bdNavbar"
                        aria-controls="bdNavbar"
                        aria-label="Toggle navigation"
                      >
                        <span
                          className="bg-site-black rounded-pill"
                          style={{ height: '2px', width: '15px' }}
                        ></span>
                        <span
                          className="bg-site-black rounded-pill"
                          style={{ height: '2px', width: '15px' }}
                        ></span>
                        <span
                          className="bg-site-black rounded-pill"
                          style={{ height: '2px', width: '15px' }}
                        ></span>
                      </div>
                    </div>
                  </nav>
                </header>
              )}

              {/* Right Modal */}
              {/* <div className="offcanvas offcanvas-end" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                    <div className={styles.custom_header}>
                        <div className='d-flex justify-content-between px-3 pt-2'>
                            <h5 id="offcanvasRightLabel" className='ff-Soleil700'>Shopping Cart</h5>
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <hr />
                    </div>
                    <div className={styles.custom_body}>
                        {list.map((li, index) => (
                            <div className='px-3 prod_items'>
                                <div className='d-flex justify-content-between'>
                                    <div className='me-3'>
                                        <picture>
                                            <img src="/images/cart_sample_pic.png" height="60" />
                                        </picture>
                                    </div>
                                    <div className='flex-grow-1'>
                                        <p className='fs-20 fw-bold my-auto ff-Soleil700'>Bhang edibles</p>
                                        <div className="ff-Soleil400 fs-14 mt-2">
                                            <p className='my-auto ff-Soleil400'>Flavor: Chocolate</p>
                                            <p className='my-auto ff-Soleil400'>Weight: 4g</p>
                                            <p className='ff-Soleil400'>Price: $34</p>
                                        </div>
                                        <p className='fs-18 fw-bold ff-Soleil700'>${34 * counter}</p>
                                        <div className='text-start'>
                                            <div className='w-50 d-flex gap-4 border border-dark rounded-pill py-2 justify-content-center'>
                                                <button onClick={handleIncrement} className='bg-transparent border-0 my-auto fs-14 fw-bold ff-Soleil400'>+</button>
                                                <p className='my-auto ff-Soleil400 fs-14 fw-bold'>{counter}</p>
                                                <button onClick={handleDecrement} className='bg-transparent border-0 my-auto fs-14 fw-bold ff-Soleil400'>-</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='me-3'>
                                        <button type="button" className="btn btn-dark fs-10">X</button>
                                    </div>
                                </div>
                                <hr className='my-3 me-3' />
                            </div>
                        ))}
                    </div>
                    <div className={`bg-site-blue-100 ${styles.custom_footer}`}>
                        <div className='px-3'>
                            <div className='d-flex justify-content-between mx-2 mt-2'>
                                <p className='fs-20 ff-Soleil700 fw-bold my-auto'>Subtotal: </p>
                                <p className='fs-20 ff-Soleil700 fw-bold my-auto'>$3543</p>
                            </div>
    
                            <div>
                                <button type="button" className="btn btn-dark fs-12 w-100 mt-3 ff-Soleil700" onClick={() => router.push('/cart')}
                                    data-bs-dismiss="offcanvas"
                                >VIEW SHOPPING CART</button>
                            </div>
                            <p className='fs-14 ff-Soleil400 text-secondary my-2 text-center'>*Due to regulations, cannabis purchases are limited to 28.5g. Your cart may not accurately reflect limitations. Orders will be verified during checkout.</p>
                        </div>
    
    
                    </div>
    
                </div> */}
              {/* Right Modal */}

              <hr className="m-0" />
              {/*  */}
              <div className="d-block d-md-none position-relative">
                <div className="d-flex justify-content-center">
                  {Headerdata?.headerText ? (
                    <button
                      className={`fs-12 bg-transparent border-0 py-2 ${styles.custom_nav_item}`}
                      onClick={() => [
                        setIsSecondVisible(!isSecondVisible),
                        setShowDiv(false),
                      ]}
                    >
                      <span className="align-middle text-site-black">
                        {Headerdata?.headerText}
                      </span>
                      <RiArrowDropDownLine className="fs-25 fw-normal text-site-black" />
                    </button>
                  ) : (
                    <Skeleton style={{ width: '300px', height: '25px' }} />
                  )}
                  <div
                    style={{ cursor: 'pointer' }}
                    href=""
                    className="nav-link py-2 px-2 text-site-black fs-12 fw-bold text-uppercase d-flex gap-1 align-items-center"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExampleLeft"
                    aria-controls="offcanvasExampleLeft"
                  >
                    <picture>
                      <img
                        src="/images/nav-icons/PinDrop.svg"
                        alt="location"
                        style={{ height: '30px' }}
                      />
                    </picture>
                    {selectedRetailer?.addressObject
                      ? selectedRetailer?.addressObject?.city +
                      ', ' +
                      selectedRetailer?.addressObject?.postalCode
                      : 'Location'}
                  </div>
                  {/* <button className="fs-12 bg-transparent border-0 py-2">
                  <span className="align-middle">
                    {selectedRetailer?.name ? selectedRetailer?.name : "Store Name"}
                  </span>
                </button> */}
                </div>
                <hr className='my-auto d-block d-md-none' />
                <div className="d-flex justify-content-center d-block d-md-none">
                  {/* pricing dropdown here */}
                  {
                    (checkValidStoreForMedical()) ?
                      <div className={`${styles.productTypeMobile}`}>
                        <button
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          data-bs-display="static"
                          className="fs-12 ff-Soleil400 px-2 px-lg-4 text-uppercase pb-2 pt-1"
                          style={{ marginTop: "3px" }}
                        >
                          <span>{menuTypeValue ? toTitleCase(menuTypeValue) : 'Pricing Type'}</span>
                          <AiOutlineDown className="ms-1 fs-12 ff-Soleil700 fw-bold" />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end-mobile" style={{ left: '126px' }}>
                          {menuTypeList?.map((el, index) => (
                            <li key={index}>
                              <Link
                                className="dropdown-item"
                                href="javascript:void(0)"
                                onClick={() => { handleMenuTypeDropdownSelection(el) }}
                              >
                                {toTitleCase(el)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      : <></>
                  }
                </div>
                {/* <hr className="my-auto" />
              <div className="d-flex justify-content-center">
                <button className="fs-14 bg-transparent border-0 py-2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExampleLeft" aria-controls="offcanvasExampleLeft">
                  <picture>
                    <img src="../../images/nav-icons/Home.svg" style={{ height: '30px' }} alt="JARS Cannabis" title="JARS Cannabis" />
                  </picture>
                  <span className="ms-2 align-middle text-site-black">
                  {selectedRetailer?.name ? selectedRetailer?.name : "Store Name"}
                  </span>
                </button>
              </div> */}
              </div>
              <div className="container d-none d-md-block position-relative">
                {/* pricing dropdown here */}

                {
                  (checkValidStoreForMedical() && !isShopPage) ?
                    <div className={`${styles.productType}`}>
                      <button
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-display="static"
                        className="fs-14 ff-Soleil400 px-2 px-lg-4 fw-bold text-uppercase"
                      >
                        <span>{menuTypeValue ? toTitleCase(menuTypeValue) : 'Menu Type'}</span>
                        <AiOutlineDown className="ms-1 ff-Soleil400 fw-bold" />
                      </button>

                      <ul className="dropdown-menu dropdown-menu-end" style={{ right: '-7px' }}>
                        {menuTypeList?.map((el, index) => (
                          <li key={index}>
                            <Link
                              className="dropdown-item"
                              href="javascript:void(0)"
                              onClick={() => { handleMenuTypeDropdownSelection(el) }}
                            >
                              {toTitleCase(el)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    : <></>
                }
                <ul className="navbar-nav flex-md-row w-100 justify-content-center align-items-center">
                  {/* data-bs-toggle="dropdown" aria-expanded="false"
                                                data-bs-display="static" */}


                  <li className="nav-item">
                    <div className="dropdown">
                      {Headerdata?.headerText ? (
                        <button
                          style={{ position: 'relative' }}
                          className="dropdown-toggle bg-transparent border-0 fs-14 fw-bold text-uppercase text-site-black ff-Soleil400"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {Headerdata?.headerText}
                        </button>
                      ) : (
                        <Skeleton style={{ width: '300px', height: '30px' }} />
                      )}

                      <div>
                        <ul
                          className={`dropdown-menu ${styles.customClickDrop}`}
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <div className="container py-3">
                            <div className="d-flex align-items-center flex-column flex-md-row">
                              <div className="w_100">
                                <div className="row mx-4 mx-lg-0 d-flex justify-content-evenly align-items-center">
                                  {/* <div className="col-4 col-sm-4 text-center">
                                  <button
                                    className="bg-transparent border-0"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvasExampleLeft"
                                    aria-controls="offcanvasExampleLeft"
                                  >
                                    <picture>
                                      <img
                                        src={hoverModalCms?.imageOne}
                                        alt={hoverModalCms?.titleOne}
                                        className={styles.dropdown_icon_images}
                                      />
                                    </picture>
                                    <h6 className="fs-14 ff-Soleil400 fs-md-12 mt-2 mt-lg-5">
                                      {hoverModalCms?.titleOne}
                                    </h6>
                                  </button>
                                </div> */}
                                  <div className="col-4 col-sm-4 text-center">
                                    <button
                                      onClick={handleDeliveryType}
                                      className="bg-transparent border-0"
                                      data-bs-toggle="offcanvas"
                                      data-bs-target="#offcanvasExampleLeft"
                                      aria-controls="offcanvasExampleLeft"
                                    >
                                      <picture>
                                        <img
                                          src={hoverModalCms?.imageTwo}
                                          alt={hoverModalCms?.titleTwo}
                                          className={styles.dropdown_icon_images}
                                        />
                                      </picture>
                                      <h6 className="fs-14 fs-md-12 mt-2 mt-lg-5 ff-Soleil400">
                                        {hoverModalCms?.titleTwo}
                                      </h6>
                                    </button>
                                  </div>
                                  <div className="col-4 col-sm-4 text-center">
                                    <button
                                      onClick={handlePickupType}
                                      className="bg-transparent border-0"
                                      data-bs-toggle="offcanvas"
                                      data-bs-target="#offcanvasExampleLeft"
                                      aria-controls="offcanvasExampleLeft"
                                    >
                                      <picture>
                                        <img
                                          src={hoverModalCms?.imageThree}
                                          alt={hoverModalCms?.titleThree}
                                          className={styles.dropdown_icon_images}
                                        />
                                      </picture>
                                      <h6 className="fs-14 fs-md-12 mt-2 mt-lg-5 ff-Soleil400">
                                        {hoverModalCms?.titleThree}
                                      </h6>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="w_100 ps-3 ps-lg-5 mt-4 mt-md-0">
                                <div className="row">
                                  <div className="col-12 col-sm-6">
                                    <h6 className="fs-14 text-uppercase ff-Soleil400">
                                      You’re Shopping Recreation at:
                                    </h6>
                                    <h3 className="fs-21 fs-md-18 ff-Soleil700 text-uppercase">
                                      {selectedRetailer?.name
                                        ? selectedRetailer?.name
                                        : 'Store Name'}
                                    </h3>
                                    <div className="fs-14 ff-Soleil400">
                                      <p>
                                        {selectedRetailer?.addressObject?.line1}
                                        <br />
                                        {
                                          selectedRetailer?.addressObject?.city
                                        }, {selectedRetailer?.addressObject?.state}{' '}
                                        {
                                          selectedRetailer?.addressObject
                                            ?.postalCode
                                        }
                                      </p>
                                      <p>
                                        Today's Hours: {dayN?.start}-{dayN?.end}
                                      </p>
                                    </div>
                                    <div className="row">
                                      {/* <div className="col-sm-12">
                                  <button
                                    className="btn bg-site-black border-site-black text-site-white fs-16 fs-md-12 rounded-pill px-1 d-block mb-3 w-75 text-uppercase ff-Soleil700 d-block"
                                    data-bs-toggle="modal"
                                    data-bs-target="#reserveTimeModal"
                                    onClick={handleClick}
                                  >
                                    RESERVE TIME
                                  </button>
                                </div> */}
                                      <div className="col-sm-12">
                                        <button
                                          data-bs-toggle="offcanvas"
                                          data-bs-target="#offcanvasExampleLeft"
                                          aria-controls="offcanvasExampleLeft"
                                          className="btn btn-outline-dark fs-16 fs-md-12 rounded-pill px-1 w-75 text-uppercase ff-Soleil700 d-block"
                                        >
                                          CHANGE ADDRESS
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <ul className="list-unstyled pt-4">
                                      {retailerContactNumber && (
                                        <Link href={`tel:${retailerContactNumber}`}>
                                          <li className="d-flex align-items-center fs-14 gap-3 mb-4">
                                            <picture>
                                              <img
                                                style={{ width: '19px' }}
                                                src="/images/small_icon/call.svg"
                                              />
                                            </picture>
                                            {retailerContactNumber}
                                          </li>
                                        </Link>
                                      )}
                                      <Link href="/get-direction">
                                        <li className="d-flex align-items-center gap-3 mb-4 fs-14 ff-Soleil400">
                                          <picture>
                                            <img
                                              style={{ width: '30px' }}
                                              src="/images/nav-icons/PinDrop.svg"
                                            />
                                          </picture>
                                          Get Direction
                                        </li>
                                      </Link>
                                      <Link href="/contact">
                                        <li className="d-flex align-items-center gap-3 mb-4 fs-14 ff-Soleil400">
                                          <picture>
                                            <img
                                              style={{ width: '30px' }}
                                              src="/images/nav-icons/Chat.svg"
                                            />
                                          </picture>
                                          Contact Us
                                        </li>
                                      </Link>
                                      {/* <Link href="/store-details"> */}
                                      <Link
                                        href={`/${selectedStateName}/${retialerNameSlug(selectedRetailer?.name)}`}
                                      >
                                        <li className="d-flex align-items-center gap-3 mb-4 fs-14 ff-Soleil400">
                                          <picture>
                                            <img
                                              style={{ width: '30px' }}
                                              src="/images/nav-icons/Deal.svg"
                                            />
                                          </picture>
                                          Store Details
                                        </li>
                                      </Link>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </ul>
                      </div>
                    </div>
                  </li>
                  {/* <li className={`nav-item dropdown ${styles.custom_nav_item}`}>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => [setShowDiv(false)]}
                    className="nav-link py-2 px-2 text-site-black dropdown-toggle fs-14 fw-bold text-uppercase"
                    href="javascript:void(0)"
                  >
                    {Headerdata?.headerText}
                  </a>
    
    
    
    
    
                  <div className={styles.custom_hover_dropdown_menu}>
                    <div className="container py-3">
                      <div className="d-flex align-items-center flex-column flex-md-row">
                        <div className="w_100">
                          <div className="row mx-4 mx-lg-0">
                            <div className="col-4 col-sm-4 text-center">
                              <button
                                onClick={handlePickupDataGet}
                                className="bg-transparent border-0"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasExampleLeft"
                                aria-controls="offcanvasExampleLeft"
                              >
                                <picture>
                                  <img
                                    src={hoverModalCms?.imageOne}
                                    alt={hoverModalCms?.titleOne}
                                    className={styles.dropdown_icon_images}
                                  />
                                </picture>
                                <h6 className="fs-14 ff-Soleil400 fs-md-12 mt-2 mt-lg-5">
                                  {hoverModalCms?.titleOne}
                                </h6>
                              </button>
                            </div>
                            <div className="col-4 col-sm-4 text-center">
                              <button
                                onClick={handleDeliveryDataGet}
                                className="bg-transparent border-0"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasExampleLeft"
                                aria-controls="offcanvasExampleLeft"
                              >
                                <picture>
                                  <img
                                    src={hoverModalCms?.imageTwo}
                                    alt={hoverModalCms?.titleTwo}
                                    className={styles.dropdown_icon_images}
                                  />
                                </picture>
                                <h6 className="fs-14 fs-md-12 mt-2 mt-lg-5 ff-Soleil400">
                                  {hoverModalCms?.titleTwo}
                                </h6>
                              </button>
                            </div>
                            <div className="col-4 col-sm-4 text-center">
                              <button
                                onClick={handlePickupDataGet}
                                className="bg-transparent border-0"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasExampleLeft"
                                aria-controls="offcanvasExampleLeft"
                              >
                                <picture>
                                  <img
                                    src={hoverModalCms?.imageThree}
                                    alt={hoverModalCms?.titleThree}
                                    className={styles.dropdown_icon_images}
                                  />
                                </picture>
                                <h6 className="fs-14 fs-md-12 mt-2 mt-lg-5 ff-Soleil400">
                                  {hoverModalCms?.titleThree}
                                </h6>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="w_100 ps-3 ps-lg-5 mt-4 mt-md-0">
                          <div className="row">
                            <div className="col-12 col-sm-6">
                              <h6 className="fs-14 text-uppercase ff-Soleil400">
                                You’re Shopping Recreation at:
                              </h6>
                              <h3 className="fs-21 fs-md-18 ff-Soleil700 text-uppercase">
                                {selectedRetailer?.name}
                              </h3>
                              <div className="fs-14 ff-Soleil400">
                                <p>
                                  {selectedRetailer?.addressObject?.line1}
                                  <br />
                                  {selectedRetailer?.addressObject?.city},{" "}
                                  {selectedRetailer?.addressObject?.state}{" "}
                                  {selectedRetailer?.addressObject?.postalCode}
                                </p>
                                <p>
                                  Today's Hours: {dayN?.start}-{dayN?.end}
                                </p>
                              </div>
                              <div className="row">
                                <div className="col-sm-12">
                                  <button
                                    className="btn bg-site-black border-site-black text-site-white fs-16 fs-md-12 rounded-pill px-1 d-block mb-3 w-75 text-uppercase ff-Soleil700 d-block"
                                    data-bs-toggle="modal"
                                    data-bs-target="#reserveTimeModal"
                                    onClick={handleClick}
                                  >
                                    RESERVE TIME
                                  </button>
                                </div>
                                <div className="col-sm-12">
                                  <button
                                    
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvasExampleLeft"
                                    aria-controls="offcanvasExampleLeft"
                                    className="btn btn-outline-dark fs-16 fs-md-12 rounded-pill px-1 w-75 text-uppercase ff-Soleil700 d-block"
                                  >
                                    CHANGE ADDRESS
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-6">
                              <ul className="list-unstyled pt-4">
                                {retailerContactNumber &&
                                  <Link href={`tel:${retailerContactNumber}`}>
                                    <li className="d-flex align-items-center gap-3 mb-4">
                                      <picture style={{ width: "22px" }}>
                                        <img src="/images/small_icon/call.svg" />
                                      </picture>
                                      Store Phone Number
                                    </li>
                                  </Link>
                                }
                                <Link href="/get-direction">
                                  <li className="d-flex align-items-center gap-3 mb-4 fs-14 ff-Soleil400">
                                    <i
                                      className="bi bi-geo-alt"
                                      style={{ fontSize: "22px" }}
                                    ></i>
                                    Get Direction
                                  </li>
                                </Link>
                                <Link href="/contact">
                                  <li className="d-flex align-items-center gap-3 mb-4 fs-14 ff-Soleil400">
                                    <i
                                      className="bi bi-chat-dots"
                                      style={{ fontSize: "22px" }}
                                    ></i>
                                    Contact Us
                                  </li>
                                </Link>
                                <Link href="/store-details">
                                  <li className="d-flex align-items-center gap-3 mb-4 fs-14 ff-Soleil400">
                                    <picture style={{ width: "22px" }}>
                                      <img src="/images/StoreDetails.png" />
                                    </picture>
                                    Store Details
                                  </li>
                                </Link>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>      
                </li> */}
                  {/* <ul className="dropdown-menu dropdown-menu-end position-absolute">
                                
                                <li data-bs-target="#bdNavbar" data-bs-dismiss="offcanvas">
                                    <button onClick={handlePickupDataGet} data-bs-toggle="offcanvas" data-bs-target="#offcanvasExampleLeft" aria-controls="offcanvasExampleLeft" className="dropdown-item">
                                        <div className='row'>
                                            <div className='col-4'>
                                                <div className=''>
                                                    <picture>
                                                        <img height={50} src={hoverModalCms?.imageOne} alt={hoverModalCms?.titleOne} />
                                                    </picture>
                                                </div>
                                            </div>
                                            <div className='col-8'>
                                                <div className=''>
                                                  <h6 className="fs-14 text-start mt-3">{hoverModalCms?.titleOne}</h6>
                                                </div>
                                            </div>
                                        </div>   
                                    </button>
                                </li>
                                <hr className='my-1'/>
                                <li data-bs-target="#bdNavbar" data-bs-dismiss="offcanvas">
                                    <button onClick={handleDeliveryDataGet}  data-bs-toggle="offcanvas" data-bs-target="#offcanvasExampleLeft" aria-controls="offcanvasExampleLeft" className="dropdown-item">
                                        <div className='row'>
                                            <div className='col-4'>
                                                <picture>
                                                    <img height={50} src={hoverModalCms?.imageTwo} alt={hoverModalCms?.titleTwo} />
                                                </picture>
                                            </div>
                                            <div className='col-8'>
                                                <h6 className="fs-14 text-start mt-3">{hoverModalCms?.titleTwo}</h6>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                                <hr className='my-1'/>
                                <li data-bs-target="#bdNavbar" data-bs-dismiss="offcanvas">
                                <button onClick={handlePickupDataGet} data-bs-toggle="offcanvas" data-bs-target="#offcanvasExampleLeft" aria-controls="offcanvasExampleLeft" className="dropdown-item">
                                    <div className='row'>
                                        <div className='col-4'>
                                            <picture>
                                                <img height={50} src={hoverModalCms?.imageThree} alt={hoverModalCms?.titleThree} />
                                            </picture>
                                        </div>
                                        <div className='col-8'>
                                            <h6 className="fs-14 text-start mt-3">{hoverModalCms?.titleThree}</h6>
                                        </div>
                                    </div>
                                </button>
                                </li>
                                
                            </ul> */}

                  {/* <div className={styles.custom_hover_dropdown_menu_pickup}>
                                <div className="">
                                    <button className='bg-transparent border-0 py-4 px-5' data-bs-toggle="offcanvas" data-bs-target="#offcanvasExampleLeft" aria-controls="offcanvasExampleLeft">
                                        <div onClick={handlePickupDataGet} className='d-flex justify-content-center'>
                                            <picture>
                                                <img height={50} src={hoverModalCms?.imageTwo} alt={hoverModalCms?.titleTwo} />
                                            </picture>
                                            <h6 className="fs-14 my-auto ms-3">{hoverModalCms?.titleTwo}</h6>
                                            <h6 className="fs-14 my-auto ms-4">Pickup</h6>
                                        </div>
                                    </button>
                                    <hr className='my-auto' />
                                    <button className='bg-transparent border-0 py-4 px-5' data-bs-toggle="offcanvas" data-bs-target="#offcanvasExampleLeft" aria-controls="offcanvasExampleLeft">
                                        <div onClick={handleDeliveryDataGet} className='d-flex justify-content-center mb-3'>
                                            <picture>
                                                <img height={50} src={hoverModalCms?.imageThree} alt={hoverModalCms?.titleThree} />
                                            </picture>
                                            <h6 className="fs-14 my-auto ms-3">{hoverModalCms?.titleThree}</h6>
                                            <h6 className="fs-14 my-auto ms-4">Delivery</h6>
                                        </div>
                                    </button>
                                </div>
                            </div> */}
                  <li className="nav-item py-1">
                    <div className="vr d-flex h-100 mx-2 text-site-black"></div>
                  </li>
                  <li className="nav-item">
                    <div
                      style={{ cursor: 'pointer' }}
                      href=""
                      className="nav-link py-2 px-2 text-site-black fs-14 fw-bold text-uppercase d-flex gap-3 align-items-center"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasExampleLeft"
                      aria-controls="offcanvasExampleLeft"
                    >
                      <picture>
                        <img
                          src="/images/nav-icons/PinDrop.svg"
                          alt="location"
                          style={{ height: '30px' }}
                        />
                      </picture>
                      {selectedRetailer?.addressObject
                        ? selectedRetailer?.addressObject?.city +
                        ', ' +
                        selectedRetailer?.addressObject?.postalCode
                        : 'Location'}
                    </div>
                  </li>
                  <li className="nav-item">
                    <div
                      style={{ cursor: 'pointer' }}
                      className="nav-link py-2 px-2 text-site-black fs-14 fw-bold text-uppercase d-flex gap-3 align-items-center"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasExampleLeft"
                      aria-controls="offcanvasExampleLeft"
                    >
                      <picture>
                        <img
                          src="/images/nav-icons/Home.svg"
                          alt="home"
                          style={{ height: '30px' }}
                        />
                      </picture>
                      {selectedRetailer?.name
                        ? selectedRetailer?.name
                        : 'Store Name'}
                    </div>
                  </li>
                </ul>

                <button
                  onClick={() => [setShowDiv(!showDiv), setIsSecondVisible(false)]}
                  className={`btn border-0 ${styles.searchBtn}`}
                >
                  <picture>
                    <img
                      src="../../images/nav-icons/Search.svg"
                      alt="JARS Cannabis"
                      title="JARS Cannabis"
                      style={{ height: '30px' }}
                    />
                  </picture>
                </button>
                {/* <button data-bs-toggle="modal" data-bs-target="#searchModal" className={`btn border-0 ${styles.searchBtn}`}>
                        <i className="bi bi-search"></i>
                    </button> */}
              </div>

              <div
                className={`collapse shadow py-3 max-height-400 overflow-auto ${toggleViewMode ? 'show' : ''
                  }`}
              >
                <div className="container">
                  <div className="offcanvas-header justify-content-end">
                    <button
                      type="button"
                      onClick={() => setToggleViewMode(!toggleViewMode)}
                      className="btn-close shadow-none"
                    ></button>
                  </div>
                  <div className="d-flex flex-column flex-md-row">
                    <div className="w_100">
                      <div className="row">
                        <div className="col-8">
                          <h6 className="fs-14 ff-Soleil400 text-uppercase mb-4">
                            PRODUCT
                          </h6>
                          <div className="row gy-3">
                            {!categoryLoader ? (
                              <>
                                {categories?.length > 0
                                  ? categories?.map((el, index) => (
                                    <Link
                                      href={`/category/${urlSlug(
                                        el?.categoryName
                                      )}`}
                                      className="col-6 fs-14 ff-Soleil400 d-flex align-items-center gap-3"
                                      key={index}
                                      onClick={handleShopCategories}
                                    >
                                      <picture>
                                        <img src={el?.image} />
                                      </picture>
                                      {toTitleCase(el?.categoryName)}
                                    </Link>
                                  ))
                                  : null}
                              </>
                            ) : (
                              <>
                                {skeletonList.map((el) => {
                                  return (
                                    <CategoryListSkeleton key={'catList-Sk' + el} />
                                  );
                                })}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="col-4">
                          <h6 className="fs-14 ff-Soleil400 mb-4">EFFECTS</h6>
                          <ul className="list-unstyled fs-14 ff-Soleil400">
                            {!filterLoader ? (
                              <>
                                {filterVariants?.effects?.length > 0 ? (
                                  filterVariants?.effects?.map((el, index) => {
                                    if (index < 6) {
                                      return (
                                        <li key={index} className="mb-3">
                                          <Link
                                            href="/shop"
                                            className=""
                                            onClick={() => {
                                              handleEffectCLick(el), handleClick();
                                            }}
                                          >
                                            {toTitleCase(el)}
                                          </Link>
                                        </li>
                                      );
                                    }
                                  })
                                ) : (
                                  <></>
                                )}
                              </>
                            ) : (
                              <>
                                {skeletonList.slice(0, 6).map((el) => {
                                  return (
                                    <EffectListSkeleton
                                      key={'effectList-Sk' + el}
                                    />
                                  );
                                })}
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="w_100 ps-md-5">
                      <div className="row">
                        <div className="col-6">
                          <h6 className="fs-14 ff-Soleil400 text-uppercase">
                            You’re Shopping Recreation at:
                          </h6>
                          <h3 className="fs-21 ff-Soleil700 text-uppercase">
                            {selectedRetailer?.name
                              ? selectedRetailer?.name
                              : 'Store Name'}
                          </h3>
                          <div className="fs-14 ff-Soleil400">
                            <p>
                              {selectedRetailer?.addressObject?.line1}
                              <br />
                              {selectedRetailer?.addressObject?.city},{' '}
                              {selectedRetailer?.addressObject?.state}{' '}
                              {selectedRetailer?.addressObject?.postalCode}
                            </p>
                            <p>
                              Today's Hours: {dayN?.start}-{dayN?.end}
                            </p>
                          </div>
                          <button
                            onClick={handleStoreDetails}
                            className="btn bg-site-black border-site-black text-site-white fs-16 rounded-pill px-1 d-block mb-4"
                          >
                            STORE DETAILS
                          </button>
                          <button
                            className="btn bg-transparent  border-site-black fs-16 rounded-pill px-1 d-block"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasExampleLeft"
                            aria-controls="offcanvasExampleLeft"
                          >
                            CHANGE STORE
                          </button>
                        </div>
                        <div className="col-6">
                          <ul className="list-unstyled pt-4">
                            {/* <li className="d-flex align-items-center gap-3 mb-4">
                                                <i className="bi bi-telephone" style={{ width: '22px' }}></i>
                                                Store Phone Number</li> */}

                            <Link
                              href="/get-direction"
                              className="d-flex align-items-center gap-3 mb-4"
                            >
                              <picture>
                                <img
                                  style={{ width: '30px' }}
                                  src="/images/nav-icons/PinDrop.svg"
                                />
                              </picture>
                              Get Direction
                            </Link>

                            <Link href="/contact">
                              <li className="d-flex align-items-center gap-3 mb-4">
                                <picture>
                                  <img
                                    style={{ width: '30px' }}
                                    src="/images/nav-icons/Chat.svg"
                                  />
                                </picture>
                                Contact Us
                              </li>
                            </Link>
                            <Link
                              href={`/${selectedStateName}/${retialerNameSlug(selectedRetailer?.name)}`}
                              onClick={handleStoreDetails}
                              className="d-flex align-items-center gap-3 mb-4"
                            >
                              <picture>
                                <img
                                  style={{ width: '30px' }}
                                  src="/images/nav-icons/Deal.svg"
                                />
                              </picture>
                              Store Details
                            </Link>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className={`shopHover collapse py-3 shadow max-height-400 overflow-auto ${toggleViewMode2 ? 'show' : ''}`} id="collapseExample2">
                    <div className="container">
                        <div className="offcanvas-header justify-content-end">
                            <button type="button" onClick={() => setToggleViewMode2(!toggleViewMode2)} className="btn-close shadow-none"></button>
                        </div>
                        <div className="d-flex align-items-center flex-column flex-md-row">
                            <div className="w_100">
                                <div className="row">
                                    <div className="col-6 col-sm-4 text-center">
                                        <picture>
                                            <img src={hoverModalCms?.imageOne} alt={hoverModalCms?.titleOne} />
                                        </picture>
                                        <h6 className="fs-14 mt-5">{hoverModalCms?.titleOne}</h6>
                                    </div>
                                    <div className="col-6 col-sm-4 text-center">
                                        <picture>
                                            <img src={hoverModalCms?.imageTwo} alt={hoverModalCms?.titleTwo} />
                                        </picture>
                                        <h6 className="fs-14 mt-5">{hoverModalCms?.titleTwo}</h6>
                                    </div>
                                    <div className="col-6 col-sm-4 text-center">
                                        <picture>
                                            <img src={hoverModalCms?.imageThree} alt={hoverModalCms?.titleThree} />
                                        </picture>
                                        <h6 className="fs-14 mt-5">{hoverModalCms?.titleThree}</h6>
                                    </div>
    
                                </div>
                            </div>
                            <div className="w_100 ps-5">
                                <div className="row">
                                    <div className="col-6">
                                        <h6 className="fs-14 text-uppercase ff-Soleil700">Free Shipping To</h6>
                                        <h3 className="fs-24 ff-Soleil700 m">JDIANA AGUILA</h3>
                                        <div className="fs-14">
                                            <p>
                                                11347 W Jefferson Ave <br />
                                                River Rouge, MI 48218
                                            </p>
                                            <p>
                                                Delivery Hours : 9am -9 pm
                                            </p>
                                        </div>
                                        <button className="btn bg-site-black border-site-black text-site-white fs-14 rounded-pill px-4 d-block mb-4" data-bs-toggle="modal" data-bs-target="#reserveTimeModal" onClick={handleClick}>RESERVE TIME</button>
                                        <button className="btn bg-transparent  border-site-black fs-14 rounded-pill px-4 d-block">CHANGE ADDRESS</button>
                                    </div>
                                    <div className="col-6">
                                        <ul className="list-unstyled pt-4">
                                            <li className="d-flex align-items-center gap-3 mb-4">
                                                <i className="bi bi-telephone" style={{ width: '22px' }}></i>
                                                Store Phone Number</li>
                                            <li className="d-flex align-items-center gap-3 mb-4">
                                                <i className="bi bi-geo-alt" style={{ width: '22px' }}></i>
                                                Get Direction</li>
    
                                            <Link href="/contact">
                                                <li className="d-flex align-items-center gap-3 mb-4">
                                                    <i className="bi bi-chat-dots" style={{ width: '22px' }}></i>
                                                    Contact Us
                                                </li>
                                            </Link>
    
                                            <li className="d-flex align-items-center gap-3 mb-4">
                                                <picture style={{ width: '22px' }}><img src="/images/StoreDetails.png" /></picture>
                                                Store Details</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

              <div
                className={`shopHover collapse py-3 shadow max-height-400 overflow-auto ${toggleViewMode2 ? 'show' : ''
                  }`}
                id="collapseExample2"
              >
                <div className="container">
                  <div className="offcanvas-header justify-content-end">
                    <button
                      type="button"
                      onClick={() => setToggleViewMode2(!toggleViewMode2)}
                      className="btn-close shadow-none"
                    ></button>
                  </div>
                  <div className="d-flex align-items-center flex-column flex-md-row">
                    <div className="w_100">
                      <div className="row">
                        <div className="col-6 col-sm-3">
                          <h6 className="mb-0">Events Near You</h6>
                        </div>
                        <div className="col-6 col-sm-3">
                          <h6 className="mb-0">Featured Articles</h6>
                          <ul
                            className="pt-4"
                            style={{
                              listStyle: 'none',
                              paddingLeft: '5px',
                              fontSize: '14px',
                            }}
                          >
                            <li className="mb-3">Article 1</li>
                            <li className="mb-3">Article 2</li>
                            <li className="mb-3">Article 3</li>
                          </ul>
                          <div className="text-center">
                            <button className="btn bg-transparent border-primary fs-14 rounded-pill px-5 d-block">
                              View All
                            </button>
                          </div>
                        </div>
                        <div className="col-6 col-sm-3">
                          <h6 className="mb-0">Featured Press Releases</h6>
                          <ul
                            className="pt-4"
                            style={{
                              listStyle: 'none',
                              paddingLeft: '5px',
                              fontSize: '14px',
                            }}
                          >
                            <li className="mb-3">Press Releases 1</li>
                            <li className="mb-3">Press Releases 2</li>
                            <li className="mb-3">Press Releases 3</li>
                          </ul>
                          <div className="text-center">
                            <button className="btn bg-transparent border-site-black fs-14 rounded-pill px-5 d-block">
                              View All
                            </button>
                          </div>
                        </div>
                        <div className="col-6 col-sm-3">
                          <h6 className="mb-0">
                            Find the right strain for you (8 questions)
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*    search modal*/}
              {/* <div className={`modal ${styles.modalTopGap} fade`} id="searchModal" aria-labelledby="searchModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <button type="button" className="btn-close d-none" data-bs-dismiss="modal" aria-label="Close"></button>
    
                            <div className={styles.search_custom_bar}>
                                <form>
                                    <div className='input-group'>
                                        <input type="search" className="form-control shadow-none border border-dark" placeholder="Search here..."
                                                                aria-label="Search here" aria-describedby="Search-addon2" />
                                                            <button className="btn btn-dark" type="submit"
                                                                id="Search-addon2"><i className="bi bi-search"></i>
                                                            </button>
                                    </div>
                                </form>
                                <input type="search" className="form-control shadow-none border-0" placeholder="Search here..."
                                            aria-label="Search here" aria-describedby="Search-addon2" />
                                        <button className="btn btn-outline-dark" type="submit"
                                            id="Search-addon2">Search
                                        </button>
                            </div>
                        </div>
                    </div>
                </div> */}
              {showDiv && (
                <div
                  className="py-1 bg-site-blue-100 w-100"
                  style={{ position: 'relative' }}
                >
                  <div className="">
                    <div className="w-35 w-lg-75 mx-auto py-1">
                      <div ref={divRef} className="input-group">
                        <input
                          autoComplete="off"
                          name="search"
                          type="search"
                          className="form-control shadow-none border border-dark"
                          placeholder="Search JARS"
                          aria-label="Search here"
                          aria-describedby="Search-addon2"
                          value={search}
                          onChange={handleSearchOnChange}
                          onClick={() => setCustomOff(true)}
                        />
                        <button
                          onClick={() => handleSiteProductSearchBox(search)}
                          className="btn btn-dark"
                          type="button"
                          id="Search-addon2"
                        >
                          <i className="bi bi-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  {search && customOff && (
                    <div
                      className={`container w-35 w-lg-75 ${styles.search_card_suggestion}`}
                    >
                      <div className="row d-flex justify-content-center shadow-lg">
                        {!searchLoader ? (
                          <div className="custom-search-card">
                            <div
                              className={totalProducts > 0 ? 'border-bottom' : ''}
                            >
                              <div className="py-2">
                                {sugData.map((x) => (
                                  <p
                                    className="fs-18 fs-md-12"
                                    key={x.id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                      setShowDiv(!showDiv);
                                      setSearch(
                                        x.brandNameAndProductNameAndCategoryName
                                      );
                                      handleSiteProductSearchBox(
                                        x.brandNameAndProductNameAndCategoryName
                                      );
                                    }}
                                  >
                                    {parse(`${x.highlight}`)}
                                  </p>
                                ))}
                              </div>
                            </div>
                            <div
                              className={totalProducts > 0 ? 'border-bottom' : ''}
                            >
                              <div className="py-2">
                                {brands.map((brand, index) => (
                                  <p
                                    className="fs-18 fs-md-12 fw-bold"
                                    key={index}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                      setShowDiv(!showDiv);
                                      setBrand(brand);
                                      handleSiteProductSearchBox(brand);
                                    }}
                                  >
                                    {brand}
                                  </p>
                                ))}
                              </div>
                            </div>
                            {sugData.map((x, index) => (
                              <Link
                                href={`/product-details/${x.productSlug}`}
                                className="border-bottom"
                                style={{ cursor: 'pointer' }}
                                key={index}
                                onClick={() => {
                                  setShowDiv(!showDiv);
                                  setSearch('');
                                }}
                              >
                                <div className="py-2">
                                  <div className="d-flex mt-2">
                                    <picture className="my-auto">
                                      <img
                                        src={x.image}
                                        height={70}
                                        width={70}
                                        style={{ objectFit: 'fill' }}
                                      />
                                    </picture>
                                    <div className="ms-3 w-100">
                                      <p className="mb-0 fs-18 fs-md-12">
                                        {x.productName}
                                      </p>
                                      <p className="fs-14 mb-0">{x.brandName}</p>
                                    </div>
                                    <div className="text-center my-auto">
                                      <button
                                        className="text-nowrap rounded-pill px-3 py-1 bg-light border-0 text-success"
                                        style={{ fontSize: '10px' }}
                                      >
                                        variants:{x.variants}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                            <div className="mt-3">
                              <div className="text-center">
                                {totalProducts > 0 ? (
                                  // <button onClick={() => handleSiteProductSearchBox(search)}></button>
                                  <Link
                                    className="bg-transparent border-0 fs-md-12"
                                    href={'/shop?search=' + search}
                                  >
                                    View All{' '}
                                    <span className="fw-bold">{totalProducts}</span>{' '}
                                    Products
                                  </Link>
                                ) : (
                                  <button className="bg-transparent border-0 fs-md-12">
                                    No products found!
                                  </button>
                                )}
                              </div>
                            </div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                          </div>
                        ) : (
                          <div className="custom-search-card">
                            <Skeleton
                              className="w-100"
                              style={{ height: '40px' }}
                            />
                            <Skeleton
                              className="w-100"
                              style={{ height: '40px' }}
                            />
                            <Skeleton
                              className="w-100"
                              style={{ height: '40px' }}
                            />

                            <Skeleton
                              className="w-100"
                              style={{ height: '40px' }}
                            />
                            <Skeleton
                              className="w-100"
                              style={{ height: '40px' }}
                            />
                            <Skeleton
                              className="w-100"
                              style={{ height: '40px' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {isShopVisible != false && (
                <div className={`container shadow ${styles.shopBox}`} ref={shopRef}>
                  <div className="text-end mb-3 mb-lg-0">
                    <button
                      onClick={() => setIsShopVisible(false)}
                      className="btn bg-transparent border-0"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <div className="d-flex flex-column flex-md-row">
                    <div className="w_100">
                      <div className="row">
                        <div className="col-12 col-lg-8">
                          <div className="d-flex justify-content-between">
                            <h6 className="fs-16 mb-4 fw-bold ff-Soleil400">
                              PRODUCT
                            </h6>
                            <Link
                              href={'/shop'}
                              className="d-block d-md-none btn btn-dark rounded-pill text-uppercase fs-12 mb-3"
                              onClick={handleCustomShop}
                            // data-bs-target="#bdNavbar"
                            // data-bs-dismiss="offcanvas"
                            >
                              Shop All
                            </Link>
                          </div>
                          <div className="row gy-3">
                            {!categoryLoader ? (
                              <>
                                {categories?.length > 0 ? (
                                  categories?.map((el, index) => (
                                    <Link
                                      href={`/category/${urlSlug(
                                        el?.categoryName
                                      )}`}
                                      onClick={handleShopCategories}
                                      className="col-6 fs-14 d-flex align-items-center gap-3"
                                      key={index}
                                    >
                                      <div className="d-flex justify-content-center align-content-center gap-3 cp">
                                        <div
                                          className="d-flex justify-content-center align-content-center"
                                          style={{ width: '25px' }}
                                        >
                                          <picture className="text-center">
                                            <img
                                              src={el.image}
                                              height={30}
                                              style={{ objectFit: 'fill' }}
                                            />
                                          </picture>
                                        </div>
                                        <div>{toTitleCase(el.categoryName)}</div>
                                      </div>
                                    </Link>
                                  ))
                                ) : (
                                  <></>
                                )}
                              </>
                            ) : (
                              <>
                                {skeletonList.map((el) => {
                                  return (
                                    <CategoryListSkeleton key={'catList-Sk' + el} />
                                  );
                                })}
                              </>
                            )}
                            {/* {categories.length > 0
                              ? categories?.map((el, index) => (
                                <Link
                                  href={`/category/${urlSlug(el?.categoryName)}`}
                                  onClick={
                                    handleShopCategories
                                  }
                                  className="col-6 fs-14 d-flex align-items-center gap-3"
                                  key={index}
                                >
                                  <tr className="d-flex justify-content-center align-content-center gap-3 cp">
                                    <td className="d-flex justify-content-center align-content-center" style={{ width: '25px' }}><picture className="text-center">
                                      <img
                                        src={el.image}
                                        height={30}
                                        style={{ objectFit: "fill" }}
                                      />
                                    </picture>
                                    </td>
                                    <td>{toTitleCase(el?.categoryName)}</td>
                                  </tr>
                                </Link>
                              ))
                              : null} */}
                          </div>
                          <div className="py-4 d-flex justify-content-center">
                            <Link
                              href={'/shop'}
                              onClick={handleCustomShop}
                              className={`d-none d-md-block btn fs-16 rounded-pill px-4 d-block mb-4 ff-Soleil700 text-uppercase ${styles.shopAllButton}`}
                            >
                              Shop all products
                            </Link>
                          </div>
                        </div>
                        <div className="col-12 col-lg-4">
                          <h6 className="fs-16 mb-4 mt-4 mt-lg-0 fw-bold ff-Soleil400">
                            EFFECTS
                          </h6>
                          <div className="">
                            <ul
                              className="row list-unstyled fs-14"
                              data-bs-target="#bdNavbar"
                              data-bs-dismiss="offcanvas"
                            >
                              {!filterLoader ? (
                                <>
                                  {filterVariants?.effects?.length > 0 ? (
                                    filterVariants?.effects?.map((el, index) => {
                                      if (index < 6) {
                                        return (
                                          <li
                                            className="col-6 col-lg-12 mb-3"
                                            key={index}
                                          >
                                            <Link
                                              href="/shop"
                                              className=""
                                              onClick={() => {
                                                handleEffectCLick(el),
                                                  handleClick();
                                              }}
                                            >
                                              {toTitleCase(el)}
                                            </Link>
                                          </li>
                                        );
                                      }
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </>
                              ) : (
                                <>
                                  {skeletonList.slice(0, 6).map((el) => {
                                    return (
                                      <EffectListSkeleton
                                        key={'effectList-Sk' + el}
                                      />
                                    );
                                  })}
                                </>
                              )}

                              {/* {
                                globalEffects.length > 0 ? globalEffects.map((el, index) => {
                                  if (index < 6) {
                                    return (
                                      <li className="col-6 col-lg-12 mb-3" key={index}>
                                        <Link
                                          href="/shop"
                                          className=""
                                          onClick={() => { handleEffectCLick(el), handleClick() }}
                                        >
                                          {toTitleCase(el)}
                                        </Link>
                                      </li>
                                    )
                                  }
                                }) : <></>
                              } */}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w_100 ps-md-5">
                      <div className="row">
                        <div className="col-12 col-lg-6">
                          <h6 className="fs-16 ff-Soleil400 text-uppercase mt-3 mt-lg-0 fw-bold">
                            You’re Shopping Recreation at:
                          </h6>
                          <h3 className="fs-21 ff-Soleil700 text-uppercase">
                            {selectedRetailer?.name
                              ? selectedRetailer?.name
                              : 'Store Name'}
                          </h3>
                          <div className="fs-14 ff-Soleil400">
                            <p>
                              {selectedRetailer?.addressObject?.line1}
                              <br />
                              {selectedRetailer?.addressObject?.city},{' '}
                              {selectedRetailer?.addressObject?.state}{' '}
                              {selectedRetailer?.addressObject?.postalCode}
                            </p>
                            <p>
                              Today's Hours: {dayN?.start}-{dayN?.end}
                            </p>
                          </div>
                          <Link
                            href={`/${selectedStateName}/${retialerNameSlug(selectedRetailer?.name)}`}
                            onClick={handleStoreDetails}
                            className={`btn fs-16 rounded-pill px-4 mb-3 ff-Soleil700 text-uppercase ${styles.shopAllButton}`}
                          >
                            STORE DETAILS&nbsp;
                          </Link>
                          <button
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasExampleLeft"
                            aria-controls="offcanvasExampleLeft"
                            className="btn btn-outline-dark fs-16 ff-Soleil700 text-uppercase rounded-pill px-4 d-block"
                          >
                            CHANGE STORE
                          </button>
                        </div>
                        <div className="col-12 col-lg-6">
                          <ul
                            className="list-unstyled pt-4"
                            data-bs-target="#bdNavbar"
                            data-bs-dismiss="offcanvas"
                          >
                            {retailerContactNumber && (
                              <Link href={`tel:${retailerContactNumber}`}>
                                <li className="d-flex align-items-center fs-14 gap-3 mb-4">
                                  <picture>
                                    <img
                                      style={{ width: '18px' }}
                                      src="/images/small_icon/call.svg"
                                    />
                                  </picture>
                                  {retailerContactNumber}
                                </li>
                              </Link>
                            )}

                            <Link
                              href="/get-direction"
                              onClick={handleDirection}
                              className="d-flex align-items-center gap-3 mb-4 fs-14 ff-Soleil400"
                            >
                              <picture>
                                <img
                                  style={{ width: '30px' }}
                                  src="/images/nav-icons/PinDrop.svg"
                                />
                              </picture>
                              Get Direction
                            </Link>

                            <Link href="/contact" onClick={handleContact}>
                              <li className="d-flex align-items-center gap-3 mb-4 fs-14 ff-Soleil400">
                                <picture>
                                  <img
                                    style={{ width: '30px' }}
                                    src="/images/nav-icons/Chat.svg"
                                  />
                                </picture>
                                Contact Us
                              </li>
                            </Link>
                            <Link
                              href={`/${selectedStateName}/${retialerNameSlug(selectedRetailer?.name)}`}
                              onClick={handleStoreDetails}
                              className="d-flex align-items-center gap-3 mb-4 fs-14 ff-Soleil400"
                            >
                              <picture>
                                <img
                                  style={{ width: '30px' }}
                                  src="/images/nav-icons/Deal.svg"
                                />
                              </picture>
                              Store Details
                            </Link>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isDiscoverVisible && (
                <div
                  className={`container shadow ${styles.shopBox}`}
                  ref={discoverRef}
                >
                  <div className="text-end mb-3">
                    <button
                      onClick={() => setIsDiscoverVisible(false)}
                      className="btn bg-transparent border-0"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <div className="d-flex align-items-center flex-column flex-md-row">
                    <div className="w_100">
                      <div className="row mb-5">
                        {/* <div className="col-12 col-sm-3">
                              <h6 className='mb-0'>Events Near You</h6>
                              <ul className='pt-4' style={{ listStyle: 'none', paddingLeft: '5px', fontSize: '14px' }} data-bs-target="#bdNavbar" data-bs-dismiss="offcanvas">
    
                                  <li className='mb-3'>
                                      <button className="bg-transparent border-0" onClick={() => router.push("/sponsorships")}>Sponsorships</button>
                                  </li>
                                  <li className='mb-3'>
                                      <button className='bg-transparent border-0' onClick={() => router.push("/community-programs")}>Community Porgrams</button>
                                  </li>
                              </ul>
                          </div> */}
                        <div className="col-12 col-sm-6 gx-5">
                          <h6 className="mb-0 fs-16 fw-bold text-uppercase ff-Soleil400">
                            QUICK HITS
                          </h6>
                          <ul
                            className="pt-4"
                            style={{
                              listStyle: 'none',
                              paddingLeft: '5px',
                              fontSize: '14px',
                            }}
                            data-bs-target="#bdNavbar"
                            data-bs-dismiss="offcanvas"
                          >
                            {/* {hoverDiscoverCms?.data?.data?.articleData?.map(
                              (li, index) => (
                                <Link
                                  href=""
                                  onClick={() => handleFeaturedArticles(li?.urlSlug)}
                                  className={`mb-3 ${styles.hover_underline_animation}`}
                                >
                                  <li key={index} className={`mb-0 fs-14 text-uppercase`}>
                                    {li?.title}
                                  </li>
                                </Link>
                              )
                            )} */}
                            {hoverDiscoverCms?.data?.data?.articleData?.map(
                              (li, index) => {
                                if (index < 9) {
                                  return (
                                    <div className="col-12 col-md-12" key={index}>
                                      <Link
                                        href={`/blog/${li.urlSlug}`}
                                        onClick={() => {
                                          setIsDiscoverVisible(false);
                                          // router.push(`/article/${li.urlSlug}`)
                                        }}

                                      // onClick={() => handleFeaturedArticles(li?.urlSlug)}
                                      >
                                        <div
                                          className={`p-2 mb-3 ${styles.custom_daily_box}`}
                                        >
                                          <div className="d-flex align-items-center gap-3">
                                            <picture>
                                              <img
                                                style={{
                                                  objectFit: 'cover',
                                                  borderRadius: '5px',
                                                  width: '60px',
                                                  height: '60px',
                                                }}
                                                src={
                                                  li?.photo
                                                    ? li.photo
                                                    : 'https://jars-dutchi.nyc3.digitaloceanspaces.com/Article/jars.e85d355e-8f5c-4226-b08a-a58764193825_do.png'
                                                }
                                              />
                                            </picture>
                                            <li className="fs-14 text-uppercase line-clamp-2">
                                              {li?.title}
                                            </li>
                                          </div>
                                        </div>
                                      </Link>
                                    </div>
                                  );
                                }
                              }
                            )}
                          </ul>
                          <div className="text-center d-flex justify-content-center mt-5">
                            <Link
                              href={'/blog'}
                              className="btn btn-outline-dark fs-14 rounded-pill px-4 d-block text-uppercase ff-Soleil700"
                              onClick={handleAllFeatured}
                            >
                              View All Articles
                            </Link>
                          </div>
                        </div>
                        <div className="col-12 col-sm-6 gx-5">
                          <h6 className="mb-0 mt-4 mt-sm-0 fs-16 fw-bold ff-Soleil400 text-uppercase">
                            THE GREEN ROOM
                          </h6>
                          <div className="">
                            <ul
                              data-bs-target="#bdNavbar"
                              data-bs-dismiss="offcanvas"
                              className="pt-4"
                              style={{
                                listStyle: 'none',
                                paddingLeft: '5px',
                                fontSize: '14px',
                              }}
                            >
                              {/* {hoverDiscoverCms?.data?.data?.pressReleaseData?.map(
                                (li, index) => (
                                  <Link
                                    href=""
                                    onClick={() => handleFeaturedPress(li?.urlSlug)}
                                    className={``}
                                  >
                                    <li key={index} className={`mb-3 fs-14`}>
                                      <span className={styles.hover_underline_animation}>{li?.title}</span>
                                    </li>
                                  </Link>
                                )
                              )} */}
                              {hoverDiscoverCms?.data?.data?.pressReleaseData?.map(
                                (li, index) => {
                                  if (index < 9) {
                                    return (
                                      <div className="col-12 col-md-12" key={index}>
                                        <Link
                                          href={`/press/${li.urlSlug}`}
                                          onClick={() => {
                                            setIsDiscoverVisible(false);
                                          }}

                                        // onClick={() => handleFeaturedArticles(li?.urlSlug)}
                                        >
                                          <div
                                            className={`p-2 mb-3 ${styles.custom_daily_box}`}
                                          >
                                            <div className="d-flex align-items-center gap-3">
                                              <picture>
                                                <img
                                                  style={{
                                                    objectFit: 'cover',
                                                    borderRadius: '5px',
                                                    width: '60px',
                                                    height: '60px',
                                                  }}
                                                  src={
                                                    li?.image
                                                      ? li.image
                                                      : 'https://jars-dutchi.nyc3.digitaloceanspaces.com/Article/jars.e85d355e-8f5c-4226-b08a-a58764193825_do.png'
                                                  }
                                                />
                                              </picture>
                                              <li className="fs-14 text-uppercase line-clamp-2">
                                                {li?.title}
                                              </li>
                                            </div>
                                          </div>
                                        </Link>
                                      </div>
                                    );
                                  }
                                }
                              )}
                            </ul>
                          </div>
                          <div className="text-center d-flex justify-content-center mt-5">
                            <Link
                              href={`/press`}
                              className="btn btn-outline-dark fs-14 rounded-pill px-4 d-block text-uppercase ff-Soleil700"
                              onClick={handleAllFeaturedPress}
                            >
                              View All Press Release
                            </Link>
                          </div>
                        </div>
                        {/* <div className="col-12 col-sm-4">
                                  <h6 className="mb-0 mt-4 mt-sm-0">
                                    Find the right strain for you (8 questions)
                                  </h6>
                                  <div className="mt-3">
                                    <p className="fs-18 my-auto fw-bold">
                                      What Cannabis Strain is Best for Me?
                                    </p>
                                    <p className="fs-14 mt-2">
                                      <BsFillQuestionCircleFill />
                                      <span className="align-middle">
                                        &nbsp;&nbsp;Not sure which strains best suit
                                        your needs, we’ve got you covered.
                                      </span>
                                    </p>
                                    <p className="fs-14">
                                      <BsPencilSquare />
                                      <span className="align-middle">
                                        &nbsp;&nbsp;Take our short quiz and we’ll
                                        recommend products based on your results
                                      </span>
                                    </p>
                                    <div className="">
                                      <button
                                        data-bs-target="#bdNavbar"
                                        data-bs-dismiss="offcanvas"
                                        className="btn btn-dark rounded-pill fs-14 px-4 d-block"
                                        onClick={() => router.push("/quiz")}
                                      >
                                        <MdOutlineQuiz className="fs-5" /> <span className="align-middle">Start The Quiz</span>
                                      </button>
                                    </div>
                                  </div>
                                </div> */}
                      </div>
                      {/* <div className="row">
                        {hoverDiscoverCms?.data?.data?.articleData?.map(
                          (li, index) => {
                            if (index < 9) {
    
                              return (
                                <div className="col-12 col-md-4" key={index}>
                                  <Link
                                    href=""
                                    onClick={() => {
                                      setIsDiscoverVisible(false);
                                      router.push(`/shop?special_id=${li.id}&menuType=${li.menuType}`)
                                    }}
    
                                  // onClick={() => handleFeaturedArticles(li?.urlSlug)}
                                  >
                                    <div className={`p-2 mb-3 ${styles.custom_daily_box}`}>
                                      <div className="d-flex align-items-center gap-3">
                                        <picture>
                                          <img style={{ objectFit: "cover", borderRadius: "5px", width: "60px", height: "60px" }} src={li?.photo ? li.photo : 'https://jars-dutchi.nyc3.cdn.digitaloceanspaces.com/default/special-demo.png'} />
                                        </picture>
                                        <li className="fs-14 text-uppercase line-clamp-2">
                                          {li?.title}
                                        </li>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              )
                            }
                          }
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              )}
              {/*    search modal*/}
              {isSecondVisible && (
                <div
                  className="container py-3"
                  style={{ height: '100vh' }}
                  ref={picDevRef}
                >
                  <div className="d-flex align-items-center flex-column flex-md-row">
                    <div className="w_100">
                      <div className="text-end">
                        <button
                          onClick={() => setIsSecondVisible(false)}
                          className="btn bg-transparent border-0"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                      <div className="row mx-4 mx-lg-0 d-flex justify-content-evenly align-content-center">
                        {/* <div className="col-4 col-sm-4 text-center">
                        <button
                          className="bg-transparent border-0"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvasExampleLeft"
                          aria-controls="offcanvasExampleLeft"
                        >
                          <picture>
                            <img
                              src={hoverModalCms?.imageOne}
                              alt={hoverModalCms?.titleOne}
                              className={styles.dropdown_icon_images}
                            />
                          </picture>
                          <h6 className="fs-14 fs-md-12 mt-2 mt-lg-5">
                            {hoverModalCms?.titleOne}
                          </h6>
                        </button>
                      </div> */}
                        <div className="col-4 col-sm-4 text-center">
                          <button
                            onClick={handleDeliveryType}
                            className="bg-transparent border-0"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasExampleLeft"
                            aria-controls="offcanvasExampleLeft"
                          >
                            <picture>
                              <img
                                src={hoverModalCms?.imageTwo}
                                alt={hoverModalCms?.titleTwo}
                                className={styles.dropdown_icon_images}
                              />
                            </picture>
                            <h6 className="fs-14 fs-md-12 mt-2 mt-lg-5">
                              {hoverModalCms?.titleTwo}
                            </h6>
                          </button>
                        </div>
                        <div className="col-4 col-sm-4 text-center">
                          <button
                            onClick={handlePickupType}
                            className="bg-transparent border-0"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasExampleLeft"
                            aria-controls="offcanvasExampleLeft"
                          >
                            <picture>
                              <img
                                src={hoverModalCms?.imageThree}
                                alt={hoverModalCms?.titleThree}
                                className={styles.dropdown_icon_images}
                              />
                            </picture>
                            <h6 className="fs-14 fs-md-12 mt-2 mt-lg-5">
                              {hoverModalCms?.titleThree}
                            </h6>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="w_100 ps-3 ps-lg-5 mt-4 mt-md-0">
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <h6 className="fs-14 text-uppercase ff-Soleil400">
                            You’re Shopping Recreation at:
                          </h6>
                          <h3 className="fs-21 fs-md-18 ff-Soleil700 text-uppercase">
                            {selectedRetailer?.name
                              ? selectedRetailer?.name
                              : 'Store Name'}
                          </h3>
                          <div className="fs-14 ff-Soleil400">
                            <p>
                              {selectedRetailer?.addressObject?.line1}
                              <br />
                              {selectedRetailer?.addressObject?.city},{' '}
                              {selectedRetailer?.addressObject?.state}{' '}
                              {selectedRetailer?.addressObject?.postalCode}
                            </p>
                            <p>
                              Today's Hours: {dayN?.start}-{dayN?.end}
                            </p>
                          </div>
                          <div className="row">
                            {/* <div className="col-sm-12">
                            <button
                              className="btn bg-site-black border-site-black text-site-white fs-14 fs-md-12 rounded-pill px-4 d-block mb-3 w-75"
                              data-bs-toggle="modal"
                              data-bs-target="#reserveTimeModal"
                              onClick={handleClick}
                            >
                              RESERVE TIME
                            </button>
                          </div> */}
                            <div className="col-sm-12">
                              <button
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasExampleLeft"
                                aria-controls="offcanvasExampleLeft"
                                className="btn btn-outline-dark fs-14 fs-md-12 rounded-pill px-4 w-75"
                              >
                                CHANGE ADDRESS
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-6">
                          <ul className="list-unstyled pt-4">
                            {/* <li className="d-flex align-items-center gap-3 mb-4">
                                                <i className="bi bi-telephone" style={{ width: '22px' }}></i>
                                                Store Phone Number</li> */}
                            {retailerContactNumber && (
                              <Link href={`tel:${retailerContactNumber}`}>
                                <li className="d-flex align-items-center fs-14 gap-3 mb-4">
                                  <picture>
                                    <img
                                      style={{ width: '16px' }}
                                      src="/images/small_icon/call.svg"
                                    />
                                  </picture>
                                  {retailerContactNumber}
                                </li>
                              </Link>
                            )}
                            <Link href="/get-direction" onClick={handleSecondClick}>
                              <li className="d-flex align-items-center fs-14 gap-3 mb-4">
                                <img
                                  style={{ width: '30px' }}
                                  src="/images/nav-icons/PinDrop.svg"
                                />
                                Get Direction
                              </li>
                            </Link>
                            <Link href="/contact" onClick={handleSecondClick}>
                              <li className="d-flex align-items-center fs-14 gap-3 mb-4">
                                <img
                                  style={{ width: '30px' }}
                                  src="/images/nav-icons/Chat.svg"
                                />
                                Contact Us
                              </li>
                            </Link>
                            <Link
                              href={`/${selectedStateName}/${retialerNameSlug(selectedRetailer?.name)}`}
                              onClick={handleSecondClick}
                            >
                              <li className="d-flex align-items-center fs-14 gap-3 mb-4">
                                <picture>
                                  <img
                                    style={{ width: '30px' }}
                                    src="/images/nav-icons/Deal.svg"
                                  />
                                </picture>
                                Store Details
                              </li>
                            </Link>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isDailyDeals && (
                <div
                  className={`container shadow ${styles.shopBox}`}
                  ref={dailyRef}
                >
                  <div className="d-flex align-items-center flex-column flex-md-row">
                    <div className="w_100">
                      <div className="row">
                        {/* <div className="col-12 col-sm-3">
                                                            <h6 className='mb-0'>Events Near You</h6>
                                                            <ul className='pt-4' style={{ listStyle: 'none', paddingLeft: '5px', fontSize: '14px' }} data-bs-target="#bdNavbar" data-bs-dismiss="offcanvas">
    
                                                                <li className='mb-3'>
                                                                    <button className="bg-transparent border-0" onClick={() => router.push("/sponsorships")}>Sponsorships</button>
                                                                </li>
                                                                <li className='mb-3'>
                                                                    <button className='bg-transparent border-0' onClick={() => router.push("/community-programs")}>Community Porgrams</button>
                                                                </li>
                                                            </ul>
                                                        </div> */}
                        <div className="">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 fs-16 fw-bold text-uppercase ff-Soleil400 text-uppercase">
                              Today's specials
                            </h6>
                            <button
                              onClick={() => setIsDailyDeals(false)}
                              className="btn bg-transparent border-0"
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                          <ul
                            className="pt-3"
                            style={{
                              listStyle: 'none',
                              paddingLeft: '5px',
                              fontSize: '14px',
                            }}
                            data-bs-target="#bdNavbar"
                            data-bs-dismiss="offcanvas"
                          >
                            <div className={`${styles.customScrol} row`}>
                              {todaySpecialsValue?.map((li, index) => {
                                if (index < 9) {
                                  return (
                                    <>
                                      <div
                                        className={`col-4 d-none d-md-block`}
                                        key={index}
                                      >
                                        <Link
                                          href={`/shop?special_id=${li.id}&menuType=${li.menuType}`}
                                          onClick={() => {
                                            setIsDailyDeals(false);
                                          }}

                                        // onClick={() => handleFeaturedArticles(li?.urlSlug)}
                                        >
                                          <div
                                            className={`p-md-2 mb-3 ${styles.custom_daily_box}`}
                                          >
                                            <div className="d-md-flex align-items-center gap-3">
                                              <picture>
                                                <img
                                                  style={{
                                                    objectFit: 'cover',
                                                    borderRadius: '5px',
                                                    width: '60px',
                                                    height: '60px',
                                                  }}
                                                  src={
                                                    li?.menuDisplayConfiguration
                                                      .image
                                                      ? li.menuDisplayConfiguration
                                                        .image
                                                      : 'https://jars-dutchi.nyc3.cdn.digitaloceanspaces.com/default/special-demo.png'
                                                  }
                                                />
                                              </picture>
                                              <li className="fs-14 text-uppercase line-clamp-2">
                                                {li?.name}
                                              </li>
                                            </div>
                                          </div>
                                        </Link>
                                      </div>
                                      {/* Mobile View */}
                                      <div
                                        className={`col-4 px-1 d-md-none d-block`}
                                        key={index}
                                      >
                                        <Link
                                          href={`/shop?special_id=${li.id}&menuType=${li.menuType}`}
                                          onClick={() => {
                                            setIsDailyDeals(false);
                                          }}

                                        // onClick={() => handleFeaturedArticles(li?.urlSlug)}
                                        >
                                          <div
                                            className={`p-md-2 mb-3 ${styles.custom_daily_box}`}
                                          >
                                            <div className="d-md-flex align-items-center gap-1 position-relative text-white">
                                              <picture>
                                                <img
                                                  style={{
                                                    objectFit: 'cover',
                                                    borderRadius: '5px',
                                                    height: '15vh',
                                                    // width: '60px',
                                                    // height: '60px',
                                                  }}
                                                  className="w-100"
                                                  src={
                                                    li?.menuDisplayConfiguration
                                                      .image
                                                      ? li.menuDisplayConfiguration
                                                        .image
                                                      : 'https://jars-dutchi.nyc3.cdn.digitaloceanspaces.com/default/special-demo.png'
                                                  }
                                                />
                                              </picture>
                                              <li className="fs-12 text-uppercase line-clamp-2 position-absolute top-50 translate-middle-y px-2 text-center">
                                                {li?.name}
                                              </li>
                                            </div>
                                          </div>
                                        </Link>
                                      </div>
                                    </>
                                  );
                                }
                              })}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mt-3">
                              <Link
                                href={'/daily-deals'}
                                className="btn btn-outline-dark fs-14 rounded-pill px-4 d-block text-uppercase ff-Soleil700"
                                onClick={handleTodaySpecials}
                              >
                                View All Daily deals
                              </Link>
                            </div>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )
      }
    </>
  );
}
