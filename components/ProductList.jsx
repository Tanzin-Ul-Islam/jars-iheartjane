import React, { useState, useEffect, useRef } from 'react';
import ReactPaginate from 'react-paginate';
import Link from 'next/link';
import productInfo from '../cms-data/productsCms';
import styles from '../styles/Products.module.css';
import pStyles from '../styles/productList.module.css';
import { BiFilterAlt, BiSearch } from 'react-icons/bi';
import { RxDividerVertical } from 'react-icons/rx';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RiArrowDropDownLine, RiFilterOffLine } from 'react-icons/ri';
import {
  AiOutlineClose,
  AiOutlineHeart,
  AiOutlineLeft,
  AiFillCloseCircle,
  AiOutlineRight,
  AiFillHeart,
  AiOutlineDown,
} from 'react-icons/ai';
import { MdOutlineSort } from 'react-icons/md';
import { TiArrowUnsorted } from 'react-icons/ti';
import { useRouter } from 'next/router';
import { getTrackBackground, Range } from 'react-range';
import { fetchData, postData } from '../utils/FetchApi';
import api from '../config/api.json';
import {
  setCurrentPage,
  setSiteLoader,
  setOffset,
  setRetailerType,
  setAllRetailer,
  setEffectValue,
  setPriceFilter,
  setFilterPriceValue,
  setShopFilter,
  setCurrentSpecialOffer,
  setMenuTypeValue,
} from '../redux/global_store/globalReducer';
import { useSelector, useDispatch } from 'react-redux';
import useDidMountEffect from '../custom-hook/useDidMount';
import { scrollToTop, showLoader } from '../utils/helper';
import { addItemToCart, setCartCountDown, setCartCounter, setCartList, setDiscount, setSubTotal, setTaxAmont, setTotalAmont } from '../redux/cart_store/cartReducer';
import {
  addToWishlist,
  removeFromWishlist,
} from '../redux/wishlist_store/wishlistReducer';
import {
  setCheckoutId,
  setBrandQueryValue,
  setCategoryQueryValue,
  setStrainTypeQueryValue,
} from '../redux/global_store/globalReducer';
import Swal from 'sweetalert2';
import { createCheckout } from '../utils/helper';
import Skeleton from 'react-loading-skeleton';
import { createToast } from '../utils/toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  useGetFeaturedBrandsQuery,
  useGetRetailerDataMutation,
} from '../redux/api_core/apiCore';
import axios from 'axios';
import parse from 'html-react-parser';
import { toTitleCase } from '../utils/helper';
import { sortArray } from '../utils/arrayUtils';
import { getGraphQLClient } from '../utils/graphqlClient';
import {
  fetchProductsCount,
  filterProducts,
  menuType,
} from '../utils/dutchieQuery';
import Head from 'next/head';
import SideBarSkeleton from './Ui/Skeleton/shop/SideBarSkeleton';
import TopBarSkeleton from './Ui/Skeleton/shop/TopBarSkeleton';
import Loader from './Loader';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { addToCartItemForSeo } from '../utils/seoInformations';

export default function ProductList({ route }) {
  let dispatch = useDispatch();
  // const [getRetailer, result] = useGetRetailerDataMutation();
  let {
    checkoutId,
    selectedRetailer,
    brandQueryValue,
    categoryQueryValue,
    strainTypeQueryValue,
    effectValue,
    todaySpecialsValue,
    pageMeta,
    priceFilter,
    filterPriceValue,
    activeRetailerType,
    shopFilter,
    filterLoader,
    filterVariants,
    currentSpecialOffer,
    menuTypeValue,
  } = useSelector((store) => store.globalStore);
  let { cartCounter, cartList } = useSelector((store) => store.cartStore);
  let { wishlist } = useSelector((store) => store.wishlistStore);

  const STEP = 1;
  const MIN = 0;
  const MAX = 100;

  const priceMin = 0;
  const priceMax = 300;

  const regexp = /android|iphone|kindle|ipad/i;

  // featured brands
  // let { data: featuredBrandData, isLoading: featuredBrandLoading } =
  //     useGetFeaturedBrandsQuery();
  // const featuredBrandList = featuredBrandData?.data;
  // const featuredBrandSkeleton = [1, 2, 3, 4, 5, 6];

  const router = useRouter();
  const [rtl, setRtl] = useState(undefined);
  const [seeCatagoryText, setSeeCatagoryText] = useState('See more');
  const [seeSubcatagoryText, setSeeSubcatagoryText] = useState('See more');
  const [seeBrandText, setSeeBrandText] = useState('See more');
  const [seeEffectText, setSeeEffectText] = useState('See more');
  const [toggleViewMode, setToggleViewMode] = useState(false);
  const [toggleSortMode, setToggleSortMode] = useState(false);
  const [toggleFeatureMode, setToggleFeatureMode] = useState(false);
  const [priceValues, setPriceValues] = useState([0, 100]);

  const [productList, setProductList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [mainBrandList, setMainBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [effectsList, setEffectsList] = useState([]);
  const [strainTypeList, setStrainTypeList] = useState([]);
  const [weightList, setWeightList] = useState([]);
  const [menuTypeList, setMenuTypeList] = useState(['RECREATIONAL', 'MEDICAL']);
  const [limitPerPage, setLimitPerPage] = useState(20);
  const [pageCount, setPageCount] = useState(0);
  const [subCategoryLoader, setSubCategoryLoader] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [isFixed, setIsFixed] = useState(false);
  const [searchWidth, setSearchWidth] = useState(56);
  const [croseButton, setCroseButton] = useState(false);

  //checking if mobile device for list view
  const [isMobile, setIsMobile] = useState(checkMobileDevice())
  function checkMobileDevice() {
    if (typeof window !== 'undefined') {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  }


  // const [prevCategoryId, setPrevCategoryId] = useState("");
  // const [prevSubCategoryId, setPrevSubCategoryId] = useState("");
  // const [prevBrandId, setPrevBrandId] = useState("");
  // const [prevWeightList, setPrevWeightList] = useState([]);

  // const [filterListLoaded, setFilterListLoaded] = useState(false);
  const filterListLoaded = useRef(false);
  const customMenus = [
    'Bundles',
    'Current Promos',
    'Save with JARS',
    'Weekly Deals',
  ];
  const [categorySchema, setCategorySchema] = useState('');

  //skeleton
  const [showSideSkeleton, setShowSideSkeleton] = useState(true);
  const [showProductSkeleton, setShowProductSkeleton] = useState(true);

  //const [currentPage, setCurrentPage] = useState(0);

  const [filterData, setFilterData] = useState({
    categoryValue: '',
    subCategoryValue: '',
    brandIdValue: '',
    effectsValue: [],
    strainTypeValue: '',
    weightsValue: [],
    potencyValue: [0, 100],
    potencyCbdValue: [0, 100],
    priceValue: [0, 500],
    dailyDealsValue: '',
    sort: {
      direction: 'DESC',
      key: 'POPULAR',
    },
    customMenuValue: '',
  });
  const [offerName, setOfferName] = useState('');
  const currentAppliedFilter = useRef({});
  const search = useRef('');
  const [searchKey, setSearchKey] = useState('');

  //filter prev state
  let prevCategory = useRef('N/A');
  let tempCategory = useRef('N/A');
  let prevSubCategory = useRef('N/A');
  let prevBrandValue = useRef('N/A');
  let prevWeightList = useRef([]);

  const [sortKey, setSortKey] = useState({
    sort: {
      // direction: "ASC",
      // key: "PRICE",
      direction: 'DESC',
      key: 'POPULAR',
    },
    lebelSortBy: '',
  });

  const [sortByLabel, setSortByLabel] = useState('');
  const [featureByLabel, setFeatureByLabel] = useState('');
  const [customOff, setCustomOff] = useState(false);
  const divRef = useRef(null);



  function handleClickOutside(event) {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setCustomOff(false);
    }
  }

  const isFilter = useRef(false);
  const routeCategory = useRef();
  const currentPage = useRef(0);
  const offsetKey = useRef(0);
  const skelitonArr = [1, 2, 3, 4, 5, 6];
  const searchInit = useRef(false);

  const [sugData, setSugData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  //InfiniteScroll
  let productCount = useRef(0);
  let hasMore = useRef(true);

  const [brandFilterValue, setBrandFilterValue] = useState('');
  let brandFilterInit = useRef(false);

  //for price filter
  let loacalPriceFilter = useRef(false);

  const currentRetailer = useRef(undefined);

  function handleBrandFilterValue(e) {
    setBrandFilterValue(e.target.value);
  }

  function filterBrand() {
    brandFilterInit.current == true;
    let newArr = [...mainBrandList];
    let searchVal = brandFilterValue.toUpperCase();
    let filteredArr = [];
    newArr.forEach((el, index) => {
      let brandName = el?.name.toUpperCase();
      if (brandName.includes(searchVal)) {
        filteredArr.push(el);
      }
    });
    setBrandList(filteredArr);
  }

  // function handleMenuType() {
  //   if (selectedRetailer?.menuTypes?.length == 2) {
  //     return selectedRetailer.menuTypes.find((el) => el == "RECREATIONAL");
  //   } else if (selectedRetailer?.menuTypes?.length == 1) {
  //     return selectedRetailer?.menuTypes[0];
  //   } else {
  //     return "RECREATIONAL";
  //   }
  // }


  async function handleCreateCheckout(pricingTypeValue) {
    let retailerType = localStorage.getItem('retailer_type') && localStorage.getItem('retailer_type') != 'undefined' ? JSON.parse(localStorage.getItem('retailer_type')) : 'PICKUP';
    let checkoutId = await createCheckout({
      retailerId: selectedRetailer?.id,
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
            dispatch(setMenuTypeValue(data));
            localStorage.setItem("menuTypeValue", data);
            await clearCartAll();
            await handleCreateCheckout(data);
          }
        });
      } else {
        dispatch(setMenuTypeValue(data));
        localStorage.setItem("menuTypeValue", data);
        await clearCartAll();
        await handleCreateCheckout(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function checkValidStoreForMedical() {
    const storeList = ["JARS Cannabis – East Detroit"];
    const isValid = storeList.includes(selectedRetailer?.name);
    return isValid;
  }

  function handleClickOutside() {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }

  async function getSchemaCms() {
    try {
      if (router.query?.categoryName) {
        const { host } = window.location;
        await fetchData(api.cms.pageSchema)
          .then((response) => {
            let data = response?.data?.[0];
            if (data?.categoryPage) {
              const category = JSON.parse(data?.categoryPage);
              category.name = router.query?.categoryName;
              category.url = `${host}${router.asPath}`;
              let items = category.mainEntity.offers.itemOffered;
              for (let i = 0; i < items?.length; i++) {
                items[i].name = productList?.[i]?.name;
                items[
                  i
                ].url = `${host}/product-details/${productList?.[i]?.slug}`;
                items[i].offers.price = calculateProductPrice(
                  productList[i]?.variants?.[0]
                );
              }
              setCategorySchema(JSON.stringify(category));
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleSort(label, param = {}, lebelSortBy) {
    setSortByLabel(label);
    setFeatureByLabel('');
    setSortKey((prevValue) => ({ ...prevValue, sort: param, lebelSortBy }));
  }

  function handleFeature(label, param = {}, lebelSortBy) {
    setFeatureByLabel(label);
    setSortByLabel('');
    setSortKey((prevValue) => ({ ...prevValue, sort: param, lebelSortBy }));
  }

  function handleProductVariants(e, index) {
    let variants = JSON.parse(e.target.value);
    let { price, weight } = variants;
    let newArr = [...productList];
    newArr[index].selectedPrice = price;
    newArr[index].selectedWeight = weight;
    setProductList(newArr);
  }

  function calculateProductPrice(item) {
    if (menuTypeValue == 'RECREATIONAL') {
      if (item?.specialPriceRec) return item?.specialPriceRec;
      else return item?.priceRec;
    }
    if (menuTypeValue == 'MEDICAL') {
      if (item?.specialPriceMed) return item?.specialPriceMed;
      else return item?.priceMed;
    }
  }

  function calculateDiscountPercentage(orginalPrice, discountPrice) {
    let discount = 100 * ((orginalPrice - discountPrice) / orginalPrice);
    return parseInt(discount);
  }

  //pagination section

  function handlePageScroll() {
    offsetKey.current = offsetKey.current + 20;
    if (!search.current) {
      applyFilter(filterData);
    } else {
      getProductList();
    }
  }

  function clearPaginationFilterAndInitSkeleton() {
    if (loacalPriceFilter.current == true) {
      loacalPriceFilter.current = false;
    }
    setShowProductSkeleton(true);
    offsetKey.current = 0;
  }

  //end pagination section

  //elastic filter section start

  async function handleSearch(e) {
    e.preventDefault();
    clearPaginationFilterAndInitSkeleton();
    searchInit.current = true;
    search.current = searchKey;
    offsetKey.current = 0;
    clearAllFilter();
    // await getProductList();
    searchInit.current = false;
  }

  async function handleSearchSug(data) {
    clearPaginationFilterAndInitSkeleton();
    setCustomOff(false);
    setSearchKey(data);
    searchInit.current = true;
    search.current = data;
    offsetKey.current = 0;
    clearAllFilter();
    // await getProductList();
    searchInit.current = false;
  }

  async function handleSearchOnChange(e) {
    const search = e.target.value;
    setSearchKey(search);

    const stateName = JSON.parse(localStorage.getItem('user_selected_retailer_state'));

    const data = { search, retailerId: selectedRetailer?.id, state: stateName, limit: 5 };
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
  }

  const handleSearchOnFocus = () => {
    const shopDeals = document.getElementById("shopDeals");
    shopDeals.style.display = "none";
    setSearchWidth(100);
    setCroseButton(true);
  }

  const handleSearchOnBlur = () => {
    const shopDeals = document.getElementById("shopDeals");
    shopDeals.style.display = "block";
    setSearchWidth(56);
  }

  //elastic search section end

  //filter section start

  function handleFilter(e) {
    clearPaginationFilterAndInitSkeleton();
    setFilterData((prevState) => {
      const updatedValue = { ...prevState, [e.target.name]: e.target.value };
      applyFilter(updatedValue);
      return updatedValue;
    });
    setToggleViewMode(!toggleViewMode);
  }

  function handleTodaySpecialFilter(e) {
    clearPaginationFilterAndInitSkeleton();
    setFilterData((prevState) => {
      const updatedValue = {
        ...prevState,
        categoryValue: '',
        subCategoryValue: '',
        brandIdValue: '',
        effectsValue: [],
        strainTypeValue: '',
        weightsValue: [],
        potencyValue: [0, 100],
        potencyCbdValue: [0, 100],
        priceValue: [0, 500],
        dailyDealsValue: e.target.value,
        sort: {
          direction: 'DESC',
          key: 'POPULAR',
        },
        customMenuValue: '',
      };
      applyFilter(updatedValue);
      return updatedValue;
    });
    setToggleViewMode(!toggleViewMode);
  }

  function handleCategoryDropdownSelection(data) {
    clearPaginationFilterAndInitSkeleton();
    setFilterData((prevState) => {
      const updatedVlaue = { ...prevState, categoryValue: data };
      applyFilter(updatedVlaue);
      return updatedVlaue;
    });
  }

  function handleThcClick(data) {
    clearPaginationFilterAndInitSkeleton();
    setFilterData((prevState) => {
      const updatedValue = { ...prevState, potencyValue: [0, data] };
      applyFilter(updatedValue);
      return updatedValue;
    });
  }

  function handleWeightCheckbox(e) {
    clearPaginationFilterAndInitSkeleton();
    let value = e.target.value;
    let filteredValue = [...filterData.weightsValue];
    if (filterData.weightsValue.includes(value)) {
      filteredValue.splice(filterData.weightsValue.indexOf(value), 1);
    } else {
      filteredValue.push(value);
    }
    setFilterData((prevState) => {
      const updatedValue = { ...prevState, [e.target.name]: filteredValue };
      applyFilter(updatedValue);
      return updatedValue;
    });
  }

  function handleEffectCheckbox(e) {
    clearPaginationFilterAndInitSkeleton();
    let value = e.target.value;
    let filteredValue = [...filterData.effectsValue];
    if (filterData.effectsValue.includes(value)) {
      filteredValue.splice(filterData.effectsValue.indexOf(value), 1);
    } else {
      filteredValue.push(value);
    }
    setFilterData((prevState) => {
      const updatedValue = { ...prevState, [e.target.name]: filteredValue };
      applyFilter(updatedValue);
      return updatedValue;
    });
  }

  function handlePotencyThcChange(e) {
    clearPaginationFilterAndInitSkeleton();
    let tempArr = [0, e.target.value];
    setFilterData((prevValue) => {
      const updatedValue = { ...prevValue, potencyValue: tempArr };
      applyFilter(updatedValue);
      return updatedValue;
    });
  }

  function handlePotencyCbdChange(e) {
    clearPaginationFilterAndInitSkeleton();
    let tempArr = [0, e.target.value];
    setFilterData((prevValue) => {
      const updatedValue = { ...prevValue, potencyCbdValue: tempArr };
      applyFilter(updatedValue);
      return updatedValue;
    });
  }

  function handleReduxFilter() {
    prevCategory.current = shopFilter.categoryValue;
    prevSubCategory.current = shopFilter.subCategoryValue;
    if (shopFilter.categoryValue) {
      getSubCategories();
    }
    setFilterData((prevState) => {
      const updatedValue = { ...prevState, ...shopFilter };
      applyFilter(updatedValue);
      return updatedValue;
    });
  }

  function setProducts(data) {
    let productList = data?.products?.length > 0 ? data?.products : [];
    let productsCount = data?.productsCount;
    productCount.current = productsCount;
    if (productList?.length == 0) {
      setFilterData((prevState) => ({
        ...prevState,
        brandIdValue: '',
        weightsValue: [],
      }));
    }
    // setSubCategoryList(data.subCategory);
    setBrandList(data.brands);
    setMainBrandList(data.brands);
    setWeightList(data.weights);
    if (offsetKey.current == 0) {
      setProductList(() => {
        return productList;
      });
    } else {
      setProductList((oldVal) => {
        const updatedVal = [...oldVal, ...productList];
        return updatedVal;
      });
    }

    if (productCount.current > 20) {
      if (offsetKey.current > productsCount) {
        hasMore.current = false;
      } else {
        hasMore.current = true;
      }
    } else {
      hasMore.current = false;
    }
    //for scroll to top
    if (productCount.current < 12) {
      scrollToTop();
    }
  }

  async function getDataFromGraphQL() {
    const retailerData =
      localStorage.getItem('selected-retailer') &&
        localStorage.getItem('selected-retailer') != 'undefined'
        ? JSON.parse(localStorage.getItem('selected-retailer'))
        : 'undefined';
    const graphQLClient = getGraphQLClient();
    const productCountQuery = fetchProductsCount();
    const countData = await graphQLClient.request(productCountQuery, {
      retailerId: retailerData.id,
    });
    const filterVariable = {
      retailerId: retailerData.id,
      pagination: {
        offset: 0,
        limit: countData.menu.productsCount,
      },
    };
    const filterListQ = filterProducts();
    const filterListResponse = await graphQLClient.request(
      filterListQ,
      filterVariable
    );
    return filterListResponse;
  }

  async function getSubCategories() {
    setSubCategoryLoader(true);
    const filterListResponse = await getDataFromGraphQL();
    const filterList = filterListResponse.menu.products;

    const subCategories = [
      ...new Set(
        filterList.map((item) => {
          if (item.category == prevCategory.current) {
            return item.subcategory;
          }
        })
      ),
    ];
    const filteredArray = subCategories.filter(
      (value) => value !== null && value !== undefined
    );
    setSubCategoryList(filteredArray);
    setSubCategoryLoader(false);
  }

  async function getProductByPrice() {
    try {
      const filterListResponse = await getDataFromGraphQL();
      const filterList = filterListResponse.menu.products;
      if (priceFilter && filterPriceValue) {
        const minPrice = 0;
        const maxPrice = filterPriceValue;

        const filteredProducts = filterListResponse.menu.products.filter(
          (product) => {
            const price = product.variants[0].priceRec;
            return price >= minPrice && price <= maxPrice;
          }
        );

        let payLoad = {
          brands: filterListResponse.menu.brands,
          products: filteredProducts.slice(0, 60),
          productsCount: filterListResponse.menu.productsCount,
          weights: filterListResponse.menu.weights,
        };
        setShowProductSkeleton(false);
        setProducts(payLoad);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSubCategoryLoader(false);
    }
  }

  async function getProductList(payLoad = {}) {
    try {
      const retailerData =
        localStorage.getItem('selected-retailer') &&
          localStorage.getItem('selected-retailer') != 'undefined'
          ? JSON.parse(localStorage.getItem('selected-retailer'))
          : 'undefined';

      let response = undefined;
      if (search.current) {
        let data = {
          retailerId: selectedRetailer?.id,
          search: search?.current,
          page: Math.ceil(offsetKey?.current / limitPerPage),
          limit: limitPerPage,
        };
        const result = await postData(
          api?.product?.productServiceElasticSearchDetails,
          data
        );
        response = result.data;
      } else {
        let appliedFilters = {};
        // let Local_menuTypeValue = '';
        let Local_dailyDealsValue = '';
        let Local_customMenuValue = '';
        if (Object.keys(payLoad)?.length > 0) {
          currentAppliedFilter.current = payLoad;
        }
        if (Object.keys(currentAppliedFilter.current)?.length > 0) {
          const {
            // menuTypeValue,
            dailyDealsValue,
            customMenuValue,
            ...filters
          } = currentAppliedFilter.current;
          // for handeling menutype and special Id
          // Local_menuTypeValue = menuTypeValue;
          Local_dailyDealsValue = dailyDealsValue;
          Local_customMenuValue = customMenuValue;
          appliedFilters = filters;
        }
        if (Local_customMenuValue) {
          appliedFilters.menuSection = {
            type: 'CUSTOM_SECTION',
            name: Local_customMenuValue,
          };
        }
        if (Local_dailyDealsValue) {
          appliedFilters.menuSection = {
            type: 'SPECIALS',
            specialId: Local_dailyDealsValue,
          };
        }
        const graphQLClient = getGraphQLClient();
        const query = filterProducts();
        const variables = JSON.stringify({
          retailerId: retailerData?.id,
          // menuType: Local_menuTypeValue ? Local_menuTypeValue : menuTypeValue,
          menuType: menuTypeValue,
          filter: appliedFilters,
          pagination: { offset: offsetKey?.current, limit: limitPerPage },
          sort: sortKey?.sort,
        });
        response = await graphQLClient.request(query, variables);
      }
      if (response) {
        setShowProductSkeleton(false);
      }
      let data = response?.menu;
      setProducts(data);
    } catch (error) {
      console.log(error);
      setShowSideSkeleton(false);
    } finally {
      setShowProductSkeleton(false);
    }
  }

  async function applyFilter(payLoad = {}) {
    try {
      if (search.current) {
        search.current = null;
        setSearchKey('');
      }
      let data = {
        ...(payLoad?.categoryValue &&
          payLoad?.categoryValue != 'ALL CATEGORY' && {
          category: payLoad?.categoryValue,
        }),
        ...(payLoad?.effectsValue &&
          payLoad?.effectsValue?.length > 0 && {
          effects: payLoad?.effectsValue,
        }),
        ...(payLoad?.strainTypeValue && {
          strainType: payLoad?.strainTypeValue,
        }),
      };

      if (
        payLoad.categoryValue &&
        payLoad.categoryValue != 'N/A' &&
        payLoad.categoryValue != prevCategory.current
      ) {
        if (
          payLoad.subCategoryValue ||
          payLoad.brandIdValue ||
          payLoad.weightsValue?.length > 0
        ) {
          payLoad.subCategoryValue = '';
          payLoad.brandIdValue = '';
          payLoad.weightsValue = [];
          setFilterData((prevState) => ({
            ...prevState,
            subCategoryValue: '',
            brandIdValue: '',
            weightsValue: [],
          }));
        }
        prevCategory.current = payLoad.categoryValue;
        if (payLoad.categoryValue == 'ALL CATEGORY') {
          payLoad.subCategoryValue = '';
          setSubCategoryList([]);
        } else {
          getSubCategories();
        }
      }

      if (
        payLoad.subCategoryValue &&
        payLoad.subCategoryValue != prevSubCategory.current
      ) {
        if (payLoad?.brandIdValue || payLoad?.weightsValue?.length > 0) {
          payLoad.brandIdValue = '';
          payLoad.weightsValue = [];
          setFilterData((prevState) => ({
            ...prevState,
            brandIdValue: '',
            weightsValue: [],
          }));
        }
        prevSubCategory.current = payLoad.subCategoryValue;
      }

      if (payLoad?.categoryValue == 'ALL CATEGORY') {
        currentAppliedFilter.current = {};
      }

      if (payLoad?.subCategoryValue) {
        data.subcategory = payLoad?.subCategoryValue;
      }

      if (
        payLoad?.potencyValue?.length > 0 &&
        (payLoad?.potencyValue[0] > 0 || payLoad?.potencyValue[1] < 100)
      ) {
        data.potencyThc = {
          min: parseFloat(payLoad?.potencyValue[0]),
          max: parseFloat(payLoad?.potencyValue[1]),
          unit: 'PERCENTAGE',
        };
      }

      if (
        payLoad?.potencyCbdValue?.length > 0 &&
        (payLoad?.potencyCbdValue[0] > 0 || payLoad?.potencyCbdValue[1] < 100)
      ) {
        data.potencyCbd = {
          min: parseFloat(payLoad?.potencyCbdValue[0]),
          max: parseFloat(payLoad?.potencyCbdValue[1]),
          unit: 'PERCENTAGE',
        };
      }

      if (payLoad?.weightsValue?.length > 0) {
        data.weights = payLoad?.weightsValue;
      }

      if (payLoad?.brandIdValue) {
        data.brandId = payLoad?.brandIdValue;
      }

      // if (payLoad?.menuTypeValue) {
      //   data.menuTypeValue = payLoad?.menuTypeValue;
      // }

      if (payLoad?.customMenuValue) {
        data.customMenuValue = payLoad?.customMenuValue;
      }

      if (payLoad?.dailyDealsValue) {
        data.dailyDealsValue = payLoad?.dailyDealsValue;
      }

      if (route != 'category') {
        if (Object.keys(router.query)?.length == 0) {
          let reduxValue = {
            categoryValue: payLoad.categoryValue,
            subCategoryValue: payLoad.subCategoryValue,
            brandIdValue: payLoad.brandIdValue,
            effectsValue: payLoad.effectsValue,
            strainTypeValue: payLoad.strainTypeValue,
            weightsValue: payLoad.weightsValue,
            potencyValue: payLoad?.potencyValue,
            potencyCbdValue: payLoad?.potencyCbdValue,
            dailyDealsValue: payLoad.dailyDealsValue,
            customMenuValue: payLoad.customMenuValue,
          };
          dispatch(setShopFilter(reduxValue));
        }
      }
      await getProductList(data);
    } catch (error) {
      console.log(error);
    }
  }

  //filter section end

  //cart and wish list section start
  async function addToCart(data) {
    let createdId = '';
    let retailerTypeFromLocal = localStorage.getItem('retailer_type') && localStorage.getItem('retailer_type') != 'undefined' ? JSON.parse(localStorage.getItem('retailer_type')) : 'PICKUP';
    if (selectedRetailer?.id && checkoutId == 'undefined') {
      createdId = await createCheckout({
        retailerId: selectedRetailer?.id,
        orderType: retailerTypeFromLocal == 'Curbside Pickup' ? 'PICKUP' : retailerTypeFromLocal.toUpperCase(),
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

  function handleWishlist(arg) {
    let data = { ...arg };
    // data.menuType = menuTypeValue;
    if (data.variants?.length > 1) {
      data.selectedPrice = calculateProductPrice(data.variants[0]);
      data.selectedWeight = data.variants[0].option;
      data.selectedVariants = JSON.stringify({ price: data.selectedPrice, weight: data.selectedWeight, });
    } else {
      data.selectedPrice = calculateProductPrice(data.variants[0]);
      data.selectedWeight = data.variants[0].option;
    }
    dispatch(addToWishlist({ data: data, quantity: 1 }));
    existInWishlist(data);
  }

  function handleRemoveFromWishlist(data) {
    dispatch(removeFromWishlist(data));
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
  //end cart and wish list section end

  //filter clear section start

  function clearFilter(filterName) {
    if (filterName) {
      clearPaginationFilterAndInitSkeleton();
      let name = '';
      switch (filterName) {
        case 'category':
          prevCategory.current = 'N/A';
          prevSubCategory.current = 'N/A';
          prevBrandValue.current = 'N/A';
          prevWeightList.current = [];
          setSubCategoryList([]);
          setFilterData((prevState) => {
            const updatedValue = {
              ...prevState,
              categoryValue: '',
              subCategoryValue: '',
              brandIdValue: '',
              weightsValue: [],
            };
            currentAppliedFilter.current = {};
            applyFilter(updatedValue);
            return updatedValue;
          });
          break;
        case 'subCategory':
          prevSubCategory.current = 'N/A';
          prevBrandValue.current = 'N/A';
          prevWeightList.current = [];
          setFilterData((prevState) => {
            const updatedValue = {
              ...prevState,
              subCategoryValue: '',
              brandIdValue: '',
              weightsValue: [],
            };
            currentAppliedFilter.current = {};
            applyFilter(updatedValue);
            return updatedValue;
          });
          break;
        case 'strain':
          name = 'strainTypeValue';
          break;
        case 'weight':
          name = 'weightsValue';
          break;
        case 'brands':
          name = 'brandIdValue';
          break;
        case 'effect':
          name = 'effectsValue';
          break;
        case 'customMenu':
          name = 'customMenuValue';
          break;
        case 'dailyDeals':
          name = 'dailyDealsValue';
          break;
      }
      if (name) {
        setFilterData((prevState) => {
          const updatedValue = { ...prevState, [name]: '' };
          currentAppliedFilter.current = {};
          applyFilter(updatedValue);
          return updatedValue;
        });
      }
    }
  }

  function clearAllFilter() {
    clearPaginationFilterAndInitSkeleton();
    setSubCategoryList([]);
    prevCategory.current = 'N/A';
    prevSubCategory.current = 'N/A';
    prevBrandValue.current = 'N/A';
    prevWeightList.current = [];
    setFilterData(() => {
      const reset = {
        categoryValue: '',
        subCategoryValue: '',
        brandIdValue: '',
        effectsValue: [],
        strainTypeValue: '',
        weightsValue: [],
        potencyValue: [0, 100],
        potencyCbdValue: [0, 100],
        priceValue: [0, 500],
        dailyDealsValue: '',
        sort: {
          direction: 'ASC',
          key: 'PRICE',
        },
        customMenuValue: '',
      };
      currentAppliedFilter.current = {};
      dispatch(setShopFilter({}));
      if (Object.keys(router.query)?.length > 0) {
        router.push('/shop');
      } else {
        getProductList();
      }
      // if (!search.current) {
      //     applyFilter(reset);
      // } else {
      //     getProductList();
      // }
      return reset;
    });
    console.log(search.current)
    if (search.current) {
      search.current = "";
    }
    router.push('/shop');
  }

  function clearPriceFilter() {
    dispatch(setPriceFilter(false));
    dispatch(setFilterPriceValue(null));
  }

  //filter clear section end
  async function handleQueryParams() {
    if (priceFilter && filterPriceValue > 0) {
      loacalPriceFilter.current = priceFilter;
      await getProductByPrice();
      clearPriceFilter();
      return;
    }
    offsetKey.current = 0;
    if (router?.query?.search) {
      search.current = router?.query?.search;
      getProductList();
    } else {
      setFilterData((prevValue) => {
        const updateFilter = {
          ...prevValue,
          // ...(router.query?.categoryName && { categoryValue: router.query?.categoryName.toUpperCase() }),
          // ...(router.query?.menuType && { menuTypeValue: router.query.menuType == 'BOTH' ? 'RECREATIONAL' : router.query.menuType, }),
          // ...(router.query?.special_id && { dailyDealsValue: router?.query?.special_id }),
          // ...(brandQueryValue && { brandIdValue: brandQueryValue }),
          // ...(categoryQueryValue && { categoryValue: categoryQueryValue }),
          // ...(strainTypeQueryValue && { strainTypeValue: strainTypeQueryValue }),
          // ...(effectValue && { effectsValue: [effectValue], }),
          categoryValue: router.query?.categoryName
            ? router.query?.categoryName.toUpperCase()
            : categoryQueryValue
              ? categoryQueryValue
              : '',
          subCategoryValue: '',
          brandIdValue: brandQueryValue ? brandQueryValue : '',
          effectsValue: effectValue ? [effectValue] : [],
          strainTypeValue: strainTypeQueryValue ? strainTypeQueryValue : '',
          dailyDealsValue: router?.query?.special_id
            ? router?.query?.special_id
            : '',
        };
        applyFilter(updateFilter);
        return updateFilter;
      });
    }
    dispatch(setEffectValue(null));
    dispatch(setCategoryQueryValue(null));
    dispatch(setBrandQueryValue(null));
    dispatch(setStrainTypeQueryValue(null));
  }

  function getCurrentRetailerFromLocalStorage() {
    filterListLoaded.current = false;
    currentRetailer.current =
      localStorage.getItem('selected-retailer') &&
        localStorage.getItem('selected-retailer') != 'undefined'
        ? JSON.parse(localStorage.getItem('selected-retailer'))
        : 'undefined';
  }

  function isInvalidCategoryForShowingWeight(categoryValue) {
    if (
      filterData.categoryValue == 'SEEDS' ||
      filterData.categoryValue == 'TOPICALS' ||
      filterData.categoryValue == 'TINCTURES' ||
      filterData.categoryValue == 'EDIBLES' ||
      filterData.categoryValue == 'APPAREL' ||
      filterData.categoryValue == 'CBD' ||
      filterData.categoryValue == 'ACCESSORIES'
    ) {
      return true;
    }
    return false;
  }

  const handleSearchTextRemove = (e) => {
    e.preventDefault();
    const shopDeals = document.getElementById("shopDeals");
    shopDeals.style.display = "block";
    setSearchWidth(56);
    setSearchKey("");
    setCroseButton(false);
  }

  useEffect(() => {
    getCurrentRetailerFromLocalStorage();
    setShowSideSkeleton(true);
    setShowProductSkeleton(true);
    if (router.isReady) {
      if (route == 'category') {
        if (router.query?.categoryName) {
          handleQueryParams();
        }
      } else if (route == 'shop') {
        if (
          router?.query?.categoryName ||
          router?.query?.menuType ||
          router?.query?.search ||
          router?.query?.special_id ||
          brandQueryValue ||
          categoryQueryValue ||
          strainTypeQueryValue ||
          effectValue ||
          filterPriceValue
        ) {
          handleQueryParams();
        } else {
          if (Object.values(shopFilter)?.length > 0) {
            handleReduxFilter();
          } else {
            getProductList();
          }
        }
      }
    }
    handleClickOutside();
  }, [
    router,
    router.query?.categoryName,
    router?.query?.search,
    router?.query?.special_id,
  ]);

  useDidMountEffect(() => {
    clearPaginationFilterAndInitSkeleton();
    getProductList();
  }, [menuTypeValue]);

  useDidMountEffect(() => {
    clearPaginationFilterAndInitSkeleton();
    getProductList();
  }, [sortKey]);

  useDidMountEffect(() => {
    filterBrand();
  }, [brandFilterValue]);

  useDidMountEffect(() => {
    if (selectedRetailer?.id != currentRetailer.current?.id) {
      setShowProductSkeleton(true);
      setShowSideSkeleton(true);
      // getProductVariants();
      clearAllFilter();
      if (search.current) {
        search.current = null;
        setSearchKey('');
      }
      loacalPriceFilter.current = false;
      currentRetailer.current = selectedRetailer;
      filterListLoaded.current = false;
    }
  }, [selectedRetailer]);

  useDidMountEffect(() => {
    getSchemaCms();
  }, [productList]);

  useEffect(() => {
    if (filterData.dailyDealsValue) {
      let offer = todaySpecialsValue.filter(
        (el) => el.id == filterData.dailyDealsValue
      );
      setOfferName(offer[0]?.name);
    } else {
      setOfferName('');
    }
  }, [filterData.dailyDealsValue, todaySpecialsValue]);

  useEffect(() => {
    dispatch(setCurrentSpecialOffer(offerName));
  }, [offerName]);

  useEffect(() => {
    if (isMobile) {
      setIsGridView(false);
    }
  }, [isMobile])

  useEffect(() => {
    const handleScroll = () => {
      const fixedDiv = document.getElementById('fixedDiv');
      const initialPosition = fixedDiv?.getBoundingClientRect().top;
      setIsFixed(window.pageYOffset > initialPosition + 100); // Adjust the scrolling threshold here (e.g., 100)
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content={pageMeta?.shopPageMetaDescription} />
        <meta name="keywords" content={pageMeta?.shopPageMetaKeyword} />
        {router.query?.categoryName && categorySchema && (
          <script
            id="json_ld_category"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: categorySchema }}
          />
        )}
      </Head>
      {
        <div>
          <section className="container mb-4 mb-lg-0">
            <div className="row">
              {!filterLoader ? (
                <div className="col-lg-3">
                  <div
                    className={`offcanvas-lg z-index-2000 offcanvas-start ${toggleViewMode ? 'show' : ''
                      }`}
                  >
                    <div className="offcanvas-header justify-content-end">
                      <button
                        type="button"
                        onClick={() => setToggleViewMode(!toggleViewMode)}
                        className="btn-close text-reset btn btn-dark"
                      ></button>
                    </div>
                    <div className="offcanvas-body">
                      <div className="w-100">
                        <div
                          className="d-flex justify-content-between align-items-center mb-3"
                          style={{ margin: '0px 18px 0px 18px' }}
                        >
                          <h1 className="ff-Soleil400 fs-16 fw-bold mb-0">
                            Filter Products
                          </h1>
                          <p onClick={clearAllFilter} className="fs-14 mb-0 cp">
                            <RiFilterOffLine
                              style={{ marginTop: '-2px', marginRight: '2px' }}
                            />
                            <span className="align-middle">Clear Filter</span>
                          </p>
                        </div>
                        <div
                          className="accordion"
                          id="accordionPanelsStayOpenExample"
                        >
                          {/* Filter Start */}

                          {/* SL. 1 - Filter Today's Specials */}
                          {todaySpecialsValue?.length > 0 ? (
                            <>
                              <div className="accordion-item border-0">
                                <div
                                  className="accordion-header"
                                  id="panelsStayOpen-headingSix"
                                >
                                  <div
                                    className={styles.section_accordionButton}
                                  >
                                    <button
                                      className="accordion-button shadow-none"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#panelsStayOpen-collapseSix"
                                      aria-expanded="false"
                                      aria-controls="panelsStayOpen-collapseSix"
                                    >
                                      <p className="my-auto fs-16 fw-bold">
                                        Today's Specials
                                      </p>
                                    </button>
                                    {filterData.dailyDealsValue ? (
                                      <button
                                        className={`bg-transparent border-0 ${styles.clear_button_subcat}`}
                                        onClick={() => {
                                          clearFilter('dailyDeals');
                                        }}
                                      >
                                        Clear
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                                <div
                                  id="panelsStayOpen-collapseSix"
                                  className="accordion-collapse collapse show"
                                  aria-labelledby="panelsStayOpen-headingSix"
                                >
                                  <div className="">
                                    <div className={styles.scrollable_section}>
                                      <div>
                                        {todaySpecialsValue?.map(
                                          (el, index) => (
                                            <div
                                              className="form-check mt-2 fs-12 d-flex align-items-center"
                                              key={index}
                                            >
                                              <label
                                                htmlFor={'dailyDeals' + el.id}
                                                className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}
                                              >
                                                <input
                                                  className="me-2 brands"
                                                  type="radio"
                                                  name="dailyDealsValue"
                                                  id={'dailyDeals' + el.id}
                                                  checked={
                                                    el.id ===
                                                    filterData.dailyDealsValue
                                                  }
                                                  value={el.id}
                                                  onChange={
                                                    handleTodaySpecialFilter
                                                  }
                                                />
                                                <span className="checkmark"></span>
                                                {el.name}
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr className={`mx-3 my-3 ${styles.customHr}`} />
                            </>
                          ) : (
                            <></>
                          )}

                          {/* SL 2. Filter customMenus */}
                          {customMenus?.length > 0 ? (
                            <>
                              <div className="accordion-item border-0">
                                <div
                                  className="accordion-header"
                                  id="panelsStayOpen-headingTwo"
                                >
                                  <div
                                    className={styles.section_accordionButton}
                                  >
                                    <button
                                      className="accordion-button shadow-none"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#panelsStayOpen-collapseTwo"
                                      aria-expanded="true"
                                      aria-controls="panelsStayOpen-collapseTwo"
                                    >
                                      <p className="my-auto fs-16 fw-bold">
                                        Special Offers
                                      </p>
                                    </button>
                                    {filterData.customMenuValue ? (
                                      <button
                                        className={`bg-transparent border-0 ${styles.clear_button_subcat}`}
                                        onClick={() => {
                                          clearFilter('customMenu');
                                        }}
                                      >
                                        Clear
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                                <div
                                  id="panelsStayOpen-collapseTwo"
                                  className="accordion-collapse collapse show"
                                  aria-labelledby="panelsStayOpen-headingTwo"
                                >
                                  <div className="">
                                    <div className={styles.scrollable_section}>
                                      <div>
                                        {customMenus?.map((el, index) => (
                                          <div
                                            className="form-check mt-2 fs-14 d-flex align-items-center"
                                            key={index}
                                          >
                                            <label
                                              htmlFor={'custom-menu' + index}
                                              className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}
                                            >
                                              <input
                                                className="me-2"
                                                type="radio"
                                                name="customMenuValue"
                                                id={'custom-menu' + index}
                                                value={el}
                                                checked={
                                                  filterData.customMenuValue ==
                                                  el
                                                }
                                                onChange={handleFilter}
                                              />
                                              <span className="checkmark"></span>
                                              {toTitleCase(el)}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr className={`mx-3 my-3 ${styles.customHr}`} />
                            </>
                          ) : (
                            <></>
                          )}

                          {/* SL 3. FIlter categoryList */}

                          {filterVariants?.category?.length > 0 ? (
                            <>
                              <div className="accordion-item border-0">
                                <div
                                  className="accordion-header"
                                  id="panelsStayOpen-headingTwo"
                                >
                                  <div
                                    className={styles.section_accordionButton}
                                  >
                                    <button
                                      className="accordion-button shadow-none"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#panelsStayOpen-collapseTwo"
                                      aria-expanded="true"
                                      aria-controls="panelsStayOpen-collapseTwo"
                                    >
                                      <p className="my-auto fs-16 fw-bold">
                                        Categories
                                      </p>
                                    </button>
                                    {filterData.categoryValue ? (
                                      <button
                                        className={`bg-transparent border-0 ${styles.clear_button_subcat}`}
                                        onClick={() => {
                                          clearFilter('category');
                                        }}
                                      >
                                        Clear
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                                <div
                                  id="panelsStayOpen-collapseTwo"
                                  className="accordion-collapse collapse show"
                                  aria-labelledby="panelsStayOpen-headingTwo"
                                >
                                  <div className="">
                                    <div className={styles.scrollable_section}>
                                      <div>
                                        {filterVariants?.category?.map(
                                          (el, index) => (
                                            <div
                                              className="form-check mt-2 fs-14 d-flex align-items-center"
                                              key={index}
                                            >
                                              <label
                                                htmlFor={
                                                  'flexRadioDefault' + el
                                                }
                                                className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}
                                              >
                                                <input
                                                  className="me-2"
                                                  type="radio"
                                                  name="categoryValue"
                                                  id={'flexRadioDefault' + el}
                                                  value={el}
                                                  onChange={handleFilter}
                                                  checked={
                                                    el ==
                                                    filterData.categoryValue
                                                  }
                                                />
                                                <span className="checkmark"></span>
                                                {toTitleCase(el)}
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr className={`mx-3 my-3 ${styles.customHr}`} />
                            </>
                          ) : (
                            <></>
                          )}

                          {/* SL 3.1 FIlter subCategoryList */}
                          {!subCategoryLoader ? (
                            <>
                              {subCategoryList?.length > 0 ? (
                                <>
                                  <div className="accordion-item border-0">
                                    <div
                                      className="accordion-header"
                                      id="panelsStayOpen-headingThree"
                                    >
                                      <div
                                        className={
                                          styles.section_accordionButton
                                        }
                                      >
                                        <button
                                          className="accordion-button shadow-none"
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#panelsStayOpen-collapseThree"
                                          aria-expanded="false"
                                          aria-controls="panelsStayOpen-collapseThree"
                                        >
                                          <p className="my-auto fs-16 fw-bold">
                                            Subcategories
                                          </p>
                                        </button>
                                        {filterData.subCategoryValue ? (
                                          <button
                                            className={`bg-transparent border-0 ${styles.clear_button_subcat}`}
                                            onClick={() => {
                                              clearFilter('subCategory');
                                            }}
                                          >
                                            Clear
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </div>
                                    <div
                                      id="panelsStayOpen-collapseThree"
                                      className="accordion-collapse collapse show"
                                      aria-labelledby="panelsStayOpen-headingThree"
                                    >
                                      <div className="">
                                        <div className=""></div>
                                        <div
                                          className={styles.scrollable_section}
                                        >
                                          <div>
                                            {subCategoryList.map(
                                              (el, index) => (
                                                <div
                                                  className="form-check mt-2 fs-14 d-flex align-items-center"
                                                  key={index}
                                                >
                                                  <label
                                                    htmlFor={
                                                      'flexRadioDefault' + el
                                                    }
                                                    className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}
                                                  >
                                                    <input
                                                      className="me-2 subCategoryValue"
                                                      type="radio"
                                                      name="subCategoryValue"
                                                      value={el}
                                                      id={
                                                        'flexRadioDefault' + el
                                                      }
                                                      checked={
                                                        el ===
                                                        filterData.subCategoryValue
                                                      }
                                                      onChange={handleFilter}
                                                    />

                                                    <span className="checkmark"></span>
                                                    {toTitleCase(el)}
                                                  </label>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <hr
                                    className={`mx-3 my-3 ${styles.customHr}`}
                                  />
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <>
                              <Skeleton
                                className="w-95 mb-1"
                                height={'306px'}
                                style={{ marginLeft: '14px' }}
                              />
                              <Skeleton
                                className="w-95 mb-3"
                                height={'10px'}
                                style={{ marginLeft: '14px' }}
                              />
                            </>
                          )}

                          {/* SL .4 Filter brand */}
                          <>
                            <div className="accordion-item border-0">
                              <div
                                className="accordion-header"
                                id="panelsStayOpen-headingSix"
                              >
                                <div className={styles.section_accordionButton}>
                                  <button
                                    className="accordion-button shadow-none"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseSix"
                                    aria-expanded="false"
                                    aria-controls="panelsStayOpen-collapseSix"
                                  >
                                    <p className="my-auto fs-16 fw-bold">
                                      Brands
                                    </p>
                                  </button>
                                  {filterData.brandIdValue ? (
                                    <button
                                      className={`bg-transparent border-0 ${styles.clear_button_subcat}`}
                                      onClick={() => {
                                        clearFilter('brands');
                                      }}
                                    >
                                      Clear
                                    </button>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                              <div className="mb-2 mx-3">
                                <>
                                  <div
                                    className={`d-flex justify-content-center align-items-center border border-1 border-dark rounded-pill ${styles.brandSearch}`}
                                  >
                                    <picture>
                                      <img
                                        src="../../images/nav-icons/Search.svg"
                                        className="ms-2 mb-1"
                                        alt="JARS Cannabis"
                                        title="JARS Cannabis"
                                        style={{ height: '30px' }}
                                      />
                                    </picture>
                                    <input
                                      className={`form-control fs-14 form-control-sm shadow-none bg-transparent ${styles.brandSearchBox}`}
                                      type="search"
                                      name="search"
                                      placeholder="Find a Brand"
                                      value={brandFilterValue}
                                      onChange={handleBrandFilterValue}
                                      aria-label="Search"
                                    />
                                  </div>
                                </>
                              </div>
                              {brandList?.length > 0 ? (
                                <div
                                  id="panelsStayOpen-collapseSix"
                                  className="accordion-collapse collapse show"
                                  aria-labelledby="panelsStayOpen-headingSix"
                                >
                                  <div className="">
                                    <div className={styles.scrollable_section}>
                                      <div>
                                        {brandList?.map((el, index) => (
                                          <div
                                            className="form-check mt-2 fs-12 d-flex align-items-center"
                                            key={index}
                                          >
                                            <label
                                              htmlFor={
                                                'flexRadioDefault' + el.id
                                              }
                                              className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}
                                            >
                                              <input
                                                className="me-2 brands"
                                                type="radio"
                                                name="brandIdValue"
                                                id={'flexRadioDefault' + el.id}
                                                checked={
                                                  el.id ===
                                                  filterData.brandIdValue
                                                }
                                                value={el.id}
                                                onChange={handleFilter}
                                              />
                                              <span className="checkmark"></span>
                                              {el.name}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex justify-content-center">
                                  <p>No Brand found!</p>
                                </div>
                              )}
                            </div>
                            <hr className={`mx-3 my-3 ${styles.customHr}`} />
                          </>

                          {/* SL. 5 Filter strain type */}
                          {filterVariants?.strains?.length > 0 ? (
                            <>
                              <div className="accordion-item border-0">
                                <div
                                  className="accordion-header"
                                  id="panelsStayOpen-headingTen"
                                >
                                  <div
                                    className={styles.section_accordionButton}
                                  >
                                    <button
                                      className="accordion-button shadow-none"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#panelsStayOpen-collapseTen"
                                      aria-expanded="false"
                                      aria-controls="panelsStayOpen-collapseTen"
                                    >
                                      <p className="my-auto fs-16 fw-bold">
                                        Strain Types
                                      </p>
                                    </button>
                                    {filterData.strainTypeValue ? (
                                      <button
                                        className={`bg-transparent border-0 ${styles.clear_button_subcat}`}
                                        onClick={() => {
                                          clearFilter('strain');
                                        }}
                                      >
                                        Clear
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                                <div
                                  id="panelsStayOpen-collapseTen"
                                  className="accordion-collapse collapse show"
                                  aria-labelledby="panelsStayOpen-headingTen"
                                >
                                  <div className="">
                                    {filterVariants?.strains?.map(
                                      (el, index) => (
                                        <div
                                          className="form-check mt-2 fs-14 d-flex align-items-center"
                                          key={index}
                                        >
                                          <label
                                            className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}
                                          >
                                            <input
                                              className="me-2"
                                              type="radio"
                                              name="strainTypeValue"
                                              id={'flexRadioDefault' + el}
                                              checked={
                                                filterData.strainTypeValue ===
                                                el
                                              }
                                              value={el}
                                              onChange={handleFilter}
                                            />
                                            <span className="checkmark"></span>

                                            {toTitleCase(el)}
                                          </label>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                              <hr className={`mx-3 my-3 ${styles.customHr}`} />
                            </>
                          ) : (
                            <></>
                          )}

                          {/* SL. 6 Filter effectsList */}
                          {filterVariants?.effects?.length > 0 ? (
                            <>
                              <div className="accordion-item border-0">
                                <div
                                  className="accordion-header"
                                  id="panelsStayOpen-headingEight"
                                >
                                  <div
                                    className={styles.section_accordionButton}
                                  >
                                    <button
                                      className="accordion-button shadow-none"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#panelsStayOpen-collapseEight"
                                      aria-expanded="false"
                                      aria-controls="panelsStayOpen-collapseEight"
                                    >
                                      <p className="my-auto fs-16 fw-bold">
                                        Effects
                                      </p>
                                    </button>
                                    {filterData?.effectsValue?.length > 0 ? (
                                      <button
                                        className={`bg-transparent border-0 ${styles.clear_button_subcat}`}
                                        onClick={() => {
                                          clearFilter('effect');
                                        }}
                                      >
                                        Clear
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                                <div
                                  id="panelsStayOpen-collapseEight"
                                  className="accordion-collapse collapse show"
                                  aria-labelledby="panelsStayOpen-headingEight"
                                >
                                  <div className="accordion-body">
                                    <div className={styles.scrollable_section}>
                                      <div className="">
                                        {filterVariants?.effects?.map(
                                          (el, index) => (
                                            <div
                                              className="form-check mt-2 fs-14 "
                                              key={index}
                                            >
                                              <input
                                                className="form-check-input shadow-none border border-dark cp"
                                                type="checkbox"
                                                name="effectsValue"
                                                id={'flexRadioDefault' + el}
                                                value={el}
                                                checked={filterData.effectsValue.includes(
                                                  el
                                                )}
                                                onChange={handleEffectCheckbox}
                                              />
                                              <label
                                                htmlFor={
                                                  'flexRadioDefault' + el
                                                }
                                                className={`form-check-label ff-Soleil400 fs-14 cp ${styles.customLabel}`}
                                              >
                                                {toTitleCase(el)}
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr className={`mx-3 my-3 ${styles.customHr}`} />
                            </>
                          ) : (
                            <></>
                          )}

                          {/* potency */}
                          <div className="accordion-item border-0">
                            <h2
                              className="accordion-header"
                              id="panelsStayOpen-headingFour"
                            >
                              <button
                                className="accordion-button shadow-none"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseFour"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseFour"
                              >
                                <p className="my-auto fs-16 fw-bold">Potency</p>
                              </button>
                            </h2>
                            <div
                              id="panelsStayOpen-collapseFour"
                              className="accordion-collapse collapse show"
                              aria-labelledby="panelsStayOpen-headingFour"
                            >
                              <p className="fs-14 my-auto mt-4 mx-4 ">
                                Potency THC
                              </p>
                              <div className="accordion-body p-2 mx-4">
                                <div className="d-flex justify-content-between">
                                  <p className="my-auto fs-14 ff-Soleil400">
                                    {filterData.potencyValue[0]}%
                                  </p>
                                  <p className="my-auto fs-14 ff-Soleil400">
                                    {filterData.potencyValue[1]}%
                                  </p>
                                </div>
                                <input
                                  className="w-100"
                                  type="range"
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={filterData.potencyValue[1]}
                                  onChange={(e) => {
                                    handlePotencyThcChange(e);
                                  }}
                                />
                              </div>
                              <p className="fs-14 my-auto mt-4 mx-4 ">
                                Potency CBD
                              </p>
                              <div className="accordion-body p-2 mx-4">
                                <div className="d-flex justify-content-between">
                                  <p className="my-auto fs-14 ff-Soleil400">
                                    {filterData.potencyCbdValue[0]}%
                                  </p>
                                  <p className="my-auto fs-14 ff-Soleil400">
                                    {filterData.potencyCbdValue[1]}%
                                  </p>
                                </div>
                                <input
                                  className="w-100"
                                  type="range"
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={filterData.potencyCbdValue[1]}
                                  onChange={(e) => {
                                    handlePotencyCbdChange(e);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <hr className={`mx-3 my-3 ${styles.customHr}`} />

                          {/* weightList */}
                          {filterData?.categoryValue &&
                            !isInvalidCategoryForShowingWeight() &&
                            weightList?.length > 0 ? (
                            <>
                              <div className="accordion-item border-0">
                                <div
                                  className="accordion-header"
                                  id="panelsStayOpen-headingFive"
                                >
                                  <div
                                    className={styles.section_accordionButton}
                                  >
                                    <button
                                      className="accordion-button shadow-none"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#panelsStayOpen-collapseFive"
                                      aria-expanded="false"
                                      aria-controls="panelsStayOpen-collapseFive"
                                    >
                                      <p className="my-auto fs-16 fw-bold">
                                        Weights
                                      </p>
                                    </button>
                                    {filterData?.weightsValue?.length > 0 ? (
                                      <button
                                        className={`bg-transparent border-0 ${styles.clear_button_subcat}`}
                                        onClick={() => {
                                          clearFilter('weight');
                                        }}
                                      >
                                        Clear
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                                <div
                                  id="panelsStayOpen-collapseFive"
                                  className="accordion-collapse collapse show"
                                  aria-labelledby="panelsStayOpen-headingFive"
                                >
                                  <div className="">
                                    <div className={styles.scrollable_section}>
                                      <div className="row gy-3 mx-1">
                                        {sortArray(weightList)?.map(
                                          (el, index) => (
                                            <div className="col-6" key={index}>
                                              <div className="">
                                                <input
                                                  type="checkbox"
                                                  className="btn-check weights"
                                                  name="weightsValue"
                                                  id={'danger-outlined' + index}
                                                  value={el}
                                                  checked={filterData.weightsValue.includes(
                                                    el
                                                  )}
                                                  onChange={(e) => {
                                                    handleWeightCheckbox(e);
                                                  }}
                                                />
                                                <label
                                                  className="btn btn-outline-dark rounded-pill w-100 text-nowrap fs-14 py-2 ff-Soleil400"
                                                  htmlFor={
                                                    'danger-outlined' + index
                                                  }
                                                >
                                                  {el}
                                                </label>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr className={`mx-3 my-3 ${styles.customHr}`} />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <SideBarSkeleton toggleViewMode={toggleViewMode} />
              )}
              <div
                className={`col-12 col-md-12 col-lg-9 ${styles.borderStart}`}
              >
                {!filterLoader ? (
                  <>
                    <div className="d-flex flex-column flex-lg-row justify-content-between mt-2">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <div className="d-block nav-item dropdown w-100 text-nowrap">
                          <button
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            data-bs-display="static"
                            className="w-100 btn rounded-pill bg-tansparent border border-2 fs-14 fs-md-10 border-dark fw-bold px-2 px-lg-4"
                          >
                            {/* <span className="align-middle">{(filterData.categoryValue) ? 'Category' : 'Product Type'}</span> */}
                            <span className="align-middle">
                              {'Product Type'}
                            </span>
                            <AiOutlineDown className="ms-1 fw-bold" />
                          </button>

                          <ul
                            className={`dropdown-menu dropdown-menu-end-custom ${styles.categoriesTopList}`}
                          >
                            {filterVariants?.category?.map((el, index) => (
                              <li key={index}>
                                <div
                                  className="dropdown-item cp"
                                  onClick={() => {
                                    handleCategoryDropdownSelection(el);
                                  }}
                                >
                                  {toTitleCase(el)}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {filterData.categoryValue && (
                          <button
                            className={`text-nowrap rounded-pill border-0 text-white px-4 fs-14 fs-md-10 ${styles.cstomFilterOption}`}
                            style={{ backgroundColor: '#212322' }}
                          >
                            <div className="d-flex justify-content-center align-items-center gap-2">
                              <p className="mb-0">
                                {toTitleCase(filterData.categoryValue)}{' '}
                              </p>
                              <div style={{ marginTop: '-3px' }}>
                                <AiOutlineClose
                                  className="fs-16 fs-md-12"
                                  onClick={() => clearFilter('category')}
                                />
                                {/* <AiFillCloseCircle className="fs-14"/> */}
                              </div>
                            </div>
                          </button>
                        )}
                        <button
                          className="w-100 btn rounded-pill bg-tansparent border border-2 fs-14 fs-md-10 border-dark fw-bold px-3 px-lg-4 text-nowrap text-capitalize cp"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvasExampleLeft"
                          aria-controls="offcanvasExampleLeft"
                          style={{ cursor: 'default' }}
                        >
                          {activeRetailerType}
                        </button>
                        {
                          checkValidStoreForMedical() ?
                            <div className="d-block nav-item dropdown w-100 text-nowrap">
                              <button
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                data-bs-display="static"
                                className="btn w-100 rounded-pill bg-tansparent border border-2 fs-14 fs-md-10 border-dark fw-bold px-2 px-lg-4"
                              >
                                <span className="align-middle">{menuTypeValue ? toTitleCase(menuTypeValue) : 'Menu Type'}</span>
                                <AiOutlineRight className="ms-1 fw-bold" />
                              </button>

                              <ul className="dropdown-menu dropdown-menu-end">
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
                            </div> : <></>
                        }
                      </div>
                      <form onSubmit={handleSearch} className='d-none d-md-block'>
                        <div
                          className={`d-flex border border-2 border-dark rounded-pill mt-3 mt-lg-0 ${styles.customSearchBoxDesktop}`}
                        >
                          <picture>
                            <img
                              src="../../images/nav-icons/Search.svg"
                              className="ms-2"
                              style={{ marginTop: '1px', height: '30px' }}
                              alt="JARS Cannabis"
                              title="JARS Cannabis"
                            />
                          </picture>
                          <input
                            ref={divRef}
                            type="search"
                            autoComplete="off"
                            className={`form-control fs-12 shadow-none bg-transparent ${styles.customInputForm}`}
                            placeholder="Search Products"
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                            value={searchKey}
                            id="searchInputP"
                            onChange={handleSearchOnChange}
                            onClick={() => setCustomOff(true)}
                          />
                          {searchKey && customOff && (
                            <div
                              className={`container  ${styles.search_card_suggestion}`}
                            >
                              <div className="row d-flex justify-content-center shadow-lg">
                                <div className="custom-search-card">
                                  <div
                                    className={
                                      totalProducts > 0 ? 'border-bottom' : ''
                                    }
                                  >
                                    <div className="py-2">
                                      {sugData.map((x, index) => (
                                        <p
                                          className="fs-14"
                                          key={index}
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => {
                                            handleSearchSug(
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
                                            handleSearchSug(brand);
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
                                      href={`/product-details/${x?.productSlug}`}
                                    >
                                      <div className="py-2">
                                        <div className="d-flex mt-2">
                                          <picture className="my-auto">
                                            <img
                                              src={x?.image}
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
                                              {x?.productName}
                                            </p>
                                            <div className="text-start my-auto">
                                              <p
                                                className="text-nowrap text-success"
                                                style={{ fontSize: '12px' }}
                                              >
                                                variants: {x?.variants}
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
                                        <Link
                                          href={'/shop?search=' + searchKey}
                                          className="bg-transparent border-0 fs-md-12"
                                          onClick={() => setCustomOff(false)}
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </form>
                      <div className='d-block d-md-none'>
                        <dir className="d-flex">
                          <Link
                            href='/daily-deals'
                            className="btn w-50 rounded-pill bg-tansparent border border-2 fs-md-10 border-dark fw-bold px-2 px-lg-4"
                            style={{ height: '39px', marginTop: '16px', marginRight: '7px' }}
                            id='shopDeals'
                          >
                            <span className='fs-14'>Shop Deals</span>
                          </Link>

                          <form onSubmit={handleSearch} style={{ width: `${searchWidth}%` }}>
                            <div
                              className={`d-flex border border-2 border-dark rounded-pill mt-3 mt-lg-0 w-50 ${styles.customSearchBox}`}
                            >
                              <picture>
                                <img
                                  src="../../images/nav-icons/Search.svg"
                                  className="ms-2"
                                  style={{ marginTop: '1px', height: '30px' }}
                                  alt="JARS Cannabis"
                                  title="JARS Cannabis"
                                />
                              </picture>
                              <input
                                ref={divRef}
                                type="text"
                                autoComplete="off"
                                className={`form-control fs-12 shadow-none bg-transparent ${styles.customInputForm}`}
                                placeholder="Search Products"
                                aria-label="Recipient's username"
                                aria-describedby="button-addon2"
                                value={searchKey}
                                id="searchInputP"
                                onChange={handleSearchOnChange}
                                onClick={() => setCustomOff(true)}
                                onFocus={handleSearchOnFocus}
                              // onBlur={handleSearchOnBlur}
                              />
                              <i onClick={handleSearchTextRemove} className={`bx bx-x ${croseButton ? 'd-block' : 'd-none'}`} style={{ position: 'absolute', top: '10px', right: '13px' }}></i>
                              {searchKey && customOff && (
                                <div
                                  className={`container  ${styles.search_card_suggestion}`}
                                >
                                  <div className="row d-flex justify-content-center shadow-lg">
                                    <div className="custom-search-card">
                                      <div
                                        className={
                                          totalProducts > 0 ? 'border-bottom' : ''
                                        }
                                      >
                                        <div className="py-2">
                                          {sugData.map((x, index) => (
                                            <p
                                              className="fs-14"
                                              key={index}
                                              style={{ cursor: 'pointer' }}
                                              onClick={() => {
                                                handleSearchSug(
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
                                                handleSearchSug(brand);
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
                                          href={`/product-details/${x?.productSlug}`}
                                        >
                                          <div className="py-2">
                                            <div className="d-flex mt-2">
                                              <picture className="my-auto">
                                                <img
                                                  src={x?.image}
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
                                                  {x?.productName}
                                                </p>
                                                <div className="text-start my-auto">
                                                  <p
                                                    className="text-nowrap text-success"
                                                    style={{ fontSize: '12px' }}
                                                  >
                                                    variants: {x?.variants}
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
                                            <Link
                                              href={'/shop?search=' + searchKey}
                                              className="bg-transparent border-0 fs-md-12"
                                              onClick={() => setCustomOff(false)}
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
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </form>
                        </dir>
                      </div>

                    </div>
                    <div className="d-flex flex-row justify-content-between my-3"></div>
                    <div className={`d-flex justify-content-between align-items-center gap-2 ${isFixed ? `${styles.fixedProduct} shadow-sm` : ''}`} id="fixedDiv">
                      <div className="d-block d-lg-none">
                        <li className="d-block nav-item dropdown">
                          <div
                            type="button"
                            onClick={() => setToggleViewMode(!toggleViewMode)}
                          >
                            <div className="d-flex align-items-center">
                              <BiFilterAlt className="fs-16 fw-bold my-auto" />
                              <p className="fs-14 fw-bold ms-1 mb-0">Filter</p>
                            </div>
                          </div>
                        </li>
                      </div>
                      <div className="d-none d-lg-block"></div>
                      <div className="d-flex gap-3 align-items-center">
                        <BsGrid3X3GapFill
                          className="h5 cp"
                          onClick={() => setIsGridView(true)}
                          style={{ marginBottom: '0px' }}
                        />
                        <GiHamburgerMenu
                          className="h5 cp"
                          onClick={() => setIsGridView(false)}
                          style={{ marginBottom: '0px' }}
                        />
                        <ul className="d-block nav-item dropdown list-unstyled" style={{ transform: `translateY(11px)` }}>
                          <li className='d-flex align-items-center'>
                            <span
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              data-bs-display="static"
                            >
                              <p
                                className={`fs-14 mb-2 fw-bold pe-none ${styles.filter_button}`}
                              >
                                <span className="align-middle">Sort By</span>
                                <RxDividerVertical className="fs-24" />
                              </p>
                            </span>

                            <span
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              data-bs-display="static"
                            >
                              <p
                                className={`fs-14 mb-2 fw-bold ${styles.filter_button}`}
                              >
                                <span className="align-middle">
                                  {/* {featureByLabel ? featureByLabel : "Featured"} */}
                                  {sortKey.lebelSortBy
                                    ? toTitleCase(sortKey.lebelSortBy)
                                    : 'Popular'}
                                </span>{' '}
                                <RiArrowDropDownLine className="fs-24" />
                              </p>
                            </span>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <div
                                  className="dropdown-item cp"
                                  onClick={() =>
                                    handleFeature(
                                      'Featured',
                                      {
                                        direction: 'DESC',
                                        key: 'POPULAR',
                                      },
                                      'POPULAR'
                                    )
                                  }
                                >
                                  Popular
                                </div>
                              </li>
                              <li>
                                <div
                                  className="dropdown-item cp"
                                  onClick={() =>
                                    handleFeature(
                                      'Featured',
                                      {
                                        direction: 'ASC',
                                        key: 'POTENCY',
                                      },
                                      'Potency Low-High'
                                    )
                                  }
                                >
                                  Potency Low-High
                                </div>
                              </li>
                              <li>
                                <div
                                  className="dropdown-item cp"
                                  onClick={() =>
                                    handleFeature(
                                      'Featured',
                                      {
                                        direction: 'DESC',
                                        key: 'POTENCY',
                                      },
                                      'Potency High-Low'
                                    )
                                  }
                                >
                                  Potency High-Low
                                </div>
                              </li>
                              <li>
                                <div
                                  className="dropdown-item cp"
                                  onClick={() =>
                                    handleSort(
                                      'Low to high',
                                      {
                                        direction: 'ASC',
                                        key: 'PRICE',
                                      },
                                      'Price Low-High'
                                    )
                                  }
                                >
                                  Price Low-High
                                </div>
                              </li>
                              <li>
                                <div
                                  className="dropdown-item cp"
                                  onClick={() =>
                                    handleSort(
                                      'High to low',
                                      {
                                        direction: 'DESC',
                                        key: 'PRICE',
                                      },
                                      'Price High-Low'
                                    )
                                  }
                                >
                                  Price High-Low
                                </div>
                              </li>
                              <li>
                                <div
                                  className="dropdown-item cp"
                                  onClick={() =>
                                    handleSort(
                                      'A to Z',
                                      {
                                        direction: 'ASC',
                                        key: 'NAME',
                                      },
                                      'Name A to Z'
                                    )
                                  }
                                >
                                  Name A-Z
                                </div>
                              </li>
                              <li>
                                <div
                                  className="dropdown-item cp"
                                  onClick={() =>
                                    handleSort(
                                      'Z to A',
                                      {
                                        direction: 'DESC',
                                        key: 'NAME',
                                      },
                                      'Name Z to A'
                                    )
                                  }
                                >
                                  Name Z-A
                                </div>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <TopBarSkeleton />
                )}
                <hr className="my-auto" />
                {!showProductSkeleton ? (
                  <>
                    {productList?.length > 0 ? (
                      <>
                        {!loacalPriceFilter.current ? (
                          <InfiniteScroll
                            dataLength={offsetKey.current}
                            next={handlePageScroll}
                            hasMore={hasMore.current}
                            loader={
                              <div className="row">
                                <div className="col-12 col-md-4 col-lg-4">
                                  <div className="m-4 m-md-0 m-lg-4">
                                    <Skeleton width="100%" height="300px" />
                                  </div>
                                </div>
                                <div className="col-12 col-md-4 col-lg-4">
                                  <div className="m-4 m-md-0 m-lg-4">
                                    <Skeleton width="100%" height="300px" />
                                  </div>
                                </div>
                                <div className="col-12 col-md-4 col-lg-4">
                                  <div className="m-4 m-md-0 m-lg-4">
                                    <Skeleton width="100%" height="300px" />
                                  </div>
                                </div>
                              </div>
                            }
                          >
                            <div className="row gy-3 mt-2 mt-md-0 gy-md-5 gx-3 gx-md-5">
                              {productList?.map((product, index) =>
                                isGridView ? (
                                  // Grid View
                                  <div
                                    className="col-6 col-md-4 col-lg-4"
                                    key={index}
                                  >
                                    <div
                                      className={`m-0 px-2 py-3 m-md-0 m-lg-4 ${styles.productCustomCard} ${styles.custom_border}`}
                                    >
                                      <div className="text-center">
                                        <Link
                                          href={`/product-details/${product?.slug}`}
                                        >
                                          <img
                                            className="cp"
                                            src={product?.image}
                                            alt={product?.name}
                                            height={117}
                                            width={117}
                                          />
                                        </Link>
                                      </div>
                                      <div className="text-center mt-3 mt-md-5 lh-15">
                                        <p
                                          className="fs-12 mb-2 ff-Soleil400 cp"
                                          onClick={() =>
                                            setFilterData((prevState) => ({
                                              ...prevState,
                                              brandIdValue: product?.brand?.id,
                                            }))
                                          }
                                          style={{ color: '#212322' }}
                                        >
                                          {product?.brand?.name}
                                        </p>
                                        <div
                                          className="d-flex justify-content-center align-items-center"
                                          style={{ height: '40px' }}
                                        >
                                          <Link
                                            href={`/product-details/${product.slug}`}
                                            className="w-75 fs-16 cp lh-20 ff-Soleil700 global_line_product_limit mb-0 text-center"
                                          >
                                            {product?.name}
                                          </Link>
                                        </div>
                                        {
                                          (menuTypeValue == "MEDICAL") ?
                                            <>
                                              {
                                                (product?.variants?.length > 1) ?
                                                  (
                                                    <>
                                                      <select
                                                        onChange={(e) => {
                                                          handleProductVariants(e, index);
                                                        }}
                                                        className="mb-2"
                                                        style={{
                                                          border: 'none',
                                                          textAlign: 'center',
                                                          outline: 'none',
                                                        }}
                                                      >
                                                        {product?.variants?.map(
                                                          (el, i) => {
                                                            return (
                                                              <option
                                                                key={i}
                                                                value={JSON.stringify({
                                                                  price:
                                                                    calculateProductPrice(
                                                                      el
                                                                    ),
                                                                  weight: el?.option,
                                                                })}
                                                              >
                                                                $
                                                                {calculateProductPrice(
                                                                  el
                                                                ) +
                                                                  `/${filterData?.categoryValue !=
                                                                  'EDIBLES' &&
                                                                  el?.option
                                                                  }`}
                                                              </option>
                                                            );
                                                          }
                                                        )}
                                                      </select>
                                                      <div className="text-center d-none d-md-block">
                                                        <p className="fs-12 text-gray-600">
                                                          {product?.variants?.length}{' '}
                                                          Varient Available
                                                        </p>
                                                      </div>
                                                    </>
                                                  )
                                                  :
                                                  (product?.variants[0]?.specialPriceMed) ?
                                                    <h3
                                                      style={{ color: '#F5333F' }}
                                                      className="fs-16 text-center ff-Soleil700 mb-3"
                                                    >
                                                      Now $
                                                      {product?.variants[0]?.specialPriceMed}
                                                      <span className="text-site-black fs-14 ff-Soleil700 ">
                                                        {' '}
                                                        <span className="text-decoration-line-through">
                                                          ${product?.variants[0]?.priceMed}
                                                        </span>{' '}
                                                        {filterData.categoryValue !=
                                                          'EDIBLES' ? (
                                                          <>
                                                            |{' '}
                                                            {product?.variants[0]?.option}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </span>
                                                    </h3>
                                                    :
                                                    <p className="fs-14">
                                                      <span className="text-dark fs-20"></span>
                                                      <span className="text-danger fs-20">
                                                        {product?.variants[0]?.specialPriceMed}
                                                      </span>
                                                      $
                                                      {product?.variants[0]?.priceMed}
                                                      {filterData.categoryValue !=
                                                        'EDIBLES' ? (
                                                        <>
                                                          | {product?.variants[0]?.option}
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </p>
                                              }
                                            </>
                                            :
                                            (menuTypeValue == "RECREATIONAL") ?
                                              <>
                                                {
                                                  product?.variants?.length > 1 ?
                                                    <>
                                                      <select
                                                        onChange={(e) => {
                                                          handleProductVariants(e, index);
                                                        }}
                                                        className="mb-2"
                                                        style={{
                                                          border: 'none',
                                                          textAlign: 'center',
                                                          outline: 'none',
                                                        }}
                                                      >
                                                        {product?.variants?.map(
                                                          (el, i) => {
                                                            return (
                                                              <option
                                                                key={i}
                                                                value={JSON.stringify({
                                                                  price:
                                                                    calculateProductPrice(
                                                                      el
                                                                    ),
                                                                  weight: el?.option,
                                                                })}
                                                              >
                                                                $
                                                                {calculateProductPrice(
                                                                  el
                                                                ) +
                                                                  `/${filterData?.categoryValue !=
                                                                  'EDIBLES' &&
                                                                  el?.option
                                                                  }`}
                                                              </option>
                                                            );
                                                          }
                                                        )}
                                                      </select>
                                                      <div className="text-center d-none d-md-block">
                                                        <p className="fs-12 text-gray-600">
                                                          {product?.variants?.length}{' '}
                                                          Varient Available
                                                        </p>
                                                      </div>
                                                    </>
                                                    :
                                                    (product?.variants[0]?.specialPriceRec)
                                                      ?
                                                      <h3
                                                        style={{ color: '#F5333F' }}
                                                        className="fs-16 text-center ff-Soleil700 mb-3"
                                                      >
                                                        Now $
                                                        {product?.variants[0]?.specialPriceRec}
                                                        <span className="text-site-black fs-14 ff-Soleil700 ">
                                                          {' '}
                                                          <span className="text-decoration-line-through">
                                                            ${product?.variants[0]?.priceRec}
                                                          </span>{' '}
                                                          {filterData.categoryValue != 'EDIBLES' ? (
                                                            <>
                                                              |{' '}
                                                              {product?.variants[0]?.option}
                                                            </>
                                                          ) : (
                                                            <></>
                                                          )}
                                                        </span>
                                                      </h3>
                                                      :
                                                      <p className="fs-14">
                                                        <span className="text-dark fs-20"></span>
                                                        <span className="text-danger fs-20">
                                                          {product?.variants[0]?.specialPriceRec}
                                                        </span>
                                                        $
                                                        {product?.variants[0]?.priceRec}
                                                        {filterData.categoryValue != 'EDIBLES' ? (
                                                          <>
                                                            | {product?.variants[0]?.option}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </p>
                                                }
                                              </>
                                              :
                                              <></>
                                        }
                                      </div>

                                      <div className="d-flex gap-3 justify-content-center">
                                        {existInWishlist(product) ? (
                                          <AiFillHeart
                                            className={`fs-24 text-center my-auto cp`}
                                            onClick={() => {
                                              handleRemoveFromWishlist(product);
                                            }}
                                          />
                                        ) : (
                                          <AiOutlineHeart
                                            className={`fs-24 text-center my-auto cp ${styles.heartIcon}`}
                                            onClick={() => {
                                              handleWishlist(product);
                                            }}
                                          />
                                        )}

                                        <button
                                          onClick={() => addToCart(product)}
                                          className={`px-4 py-1 rounded-pill fs-16 ${styles.addToCartButton}`}
                                          data-bs-toggle="offcanvas"
                                          data-bs-target="#offcanvasRight"
                                        >
                                          {productInfo.product_button}
                                          &nbsp;&nbsp;
                                          <span className="fs-18">+</span>
                                        </button>
                                      </div>
                                      <div className="mt-3">
                                        <div
                                          className={`row ${styles.potencyRow}`}
                                        >
                                          <div
                                            className={`col-6 ${styles.left_col}`}
                                          >
                                            <div className="">
                                              <p
                                                className={`fs-12 text-center ${styles.card_button_left}`}
                                              >
                                                {product?.strainType !=
                                                  'NOT_APPLICABLE'
                                                  ? product?.strainType
                                                  : 'N/A'}
                                              </p>
                                            </div>
                                          </div>
                                          <div
                                            className={`col-6 ${styles.right_col}`}
                                          >
                                            <div className="">
                                              {product?.potencyThc
                                                ?.formatted ? (
                                                <p
                                                  className={`fs-12 text-center ${styles.card_button_right} cp`}
                                                  onClick={() => {
                                                    handleThcClick(
                                                      product?.potencyThc
                                                        ?.range[0]
                                                    );
                                                  }}
                                                >
                                                  THC{' '}
                                                  {
                                                    product?.potencyThc
                                                      ?.formatted
                                                  }
                                                </p>
                                              ) : (
                                                <p
                                                  className={`fs-12 text-center ${styles.card_button_right}`}
                                                >
                                                  THC {'N/A'}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        {
                                          !offerName ?
                                            <>
                                              {
                                                (menuTypeValue == 'RECREATIONAL' && product?.variants[0]?.specialPriceRec) ?
                                                  <div className="">
                                                    <p
                                                      className={`text-center text-white fs-12 mb-0 ${styles.card_button_bottom}`}
                                                    >
                                                      {calculateDiscountPercentage(
                                                        product?.variants[0].priceRec,
                                                        product?.variants[0].specialPriceRec
                                                      )}
                                                      % OFF
                                                    </p>
                                                  </div> :
                                                  (menuTypeValue == 'MEDICAL' && product?.variants[0]?.specialPriceMed) ?
                                                    <div className="">
                                                      <p
                                                        className={`text-center text-white fs-12 mb-0 ${styles.card_button_bottom}`}
                                                      >
                                                        {calculateDiscountPercentage(
                                                          product?.variants[0].priceMed,
                                                          product?.variants[0].specialPriceMed
                                                        )}
                                                        % OFF
                                                      </p>
                                                    </div>
                                                    : <></>
                                              }
                                            </>
                                            : <></>
                                        }
                                        {offerName ? (
                                          <div className="">
                                            <p
                                              className={`text-center text-white fs-12 mb-0 cp ${styles.card_button_bottom_special}`}
                                            >
                                              <Link href={'/daily-deals'}>
                                                {offerName}
                                              </Link>
                                            </p>
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  // Table view Start=================================
                                  <div className="" key={index}>
                                    <div
                                      className={`m-0 px-2 py-3 m-md-0 pe-4 row ps-0 ${styles.productCustomCard} `}
                                    >
                                      <div className="col-2 col-sm-3 text-center p-0 pe-2 my-auto">
                                        <Link
                                          href={`/product-details/${product.slug}`}
                                        >
                                          <img
                                            className={`${pStyles.image} cp`}
                                            src={product?.image}
                                            alt={product?.name}
                                            height={117}
                                            width={117}
                                          />
                                        </Link>
                                      </div>
                                      <div
                                        className={`col-5 col-sm-4 py-4 px-0 d-flex flex-column justify-content-between ${pStyles.lh}`}
                                      >
                                        <div className="">
                                          <p
                                            className="fs-12 fs-sm-10 ff-Soleil400 mb-1 cp"
                                            onClick={() =>
                                              setFilterData((prevState) => ({
                                                ...prevState,
                                                brandIdValue:
                                                  product?.brand?.id,
                                              }))
                                            }
                                            style={{ color: '#212322' }}
                                          >
                                            {product?.brand?.name}
                                          </p>
                                          <div
                                            className="mb-2"
                                          //   style={{ height: '40px' }}
                                          >
                                            <Link
                                              href={`/product-details/${product.slug}`}
                                              className="fs-16 fs-sm-12 cp lh-20 ff-Soleil700 global_line_product_limit mb-0"
                                            >
                                              {product.name}
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="mb-2">
                                          <div
                                            className={`row ${styles.potencyRow}`}
                                          >
                                            <div
                                              className={`col-6 ${styles.left_col}`}
                                            >
                                              <div className="">
                                                <p
                                                  className={`fs-12 fs-sm-10 text-center m-0 py-2 ${pStyles.half_button} ${styles.card_button_left}`}
                                                >
                                                  {product?.strainType !=
                                                    'NOT_APPLICABLE'
                                                    ? product?.strainType
                                                    : 'N/A'}
                                                </p>
                                              </div>
                                            </div>
                                            <div
                                              className={`col-6 ${styles.right_col}`}
                                            >
                                              <div className="">
                                                {product?.potencyThc
                                                  ?.formatted ? (
                                                  <p
                                                    className={`fs-12 fs-sm-10 text-center m-0 py-2 ${pStyles.half_button} ${styles.card_button_right} cp`}
                                                    onClick={() => {
                                                      handleThcClick(
                                                        product?.potencyThc
                                                          ?.range[0]
                                                      );
                                                    }}
                                                  >
                                                    THC{' '}
                                                    {
                                                      product?.potencyThc
                                                        ?.formatted
                                                    }
                                                  </p>
                                                ) : (
                                                  <p
                                                    className={`fs-12 fs-sm-10 text-center m-0 py-2 ${pStyles.half_button} ${styles.card_button_right}`}
                                                  >
                                                    THC {'N/A'}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        className={`col-5 py-4 d-flex flex-column justify-content-between p-0 ${pStyles.lh}`}
                                      >
                                        <div
                                          className={`d-flex justify-content-end align-items-center mb-2 my-sm-0 ${pStyles.c_gap}`}
                                        >
                                          {/* product variants */}
                                          {
                                            (menuTypeValue == "MEDICAL")
                                              ?
                                              <>
                                                {product?.variants?.length > 1 ? (
                                                  <div className="d-flex flex-column">
                                                    <select
                                                      onChange={(e) => {
                                                        handleProductVariants(
                                                          e,
                                                          index
                                                        );
                                                      }}
                                                      className={`${pStyles.select} fs-sm-10`}
                                                      style={{
                                                        border: 'none',
                                                        textAlign: 'center',
                                                        outline: 'none',
                                                      }}
                                                    >
                                                      {product?.variants?.map(
                                                        (el, i) => {
                                                          return (
                                                            <option
                                                              key={i}
                                                              value={JSON.stringify({
                                                                price:
                                                                  calculateProductPrice(
                                                                    el
                                                                  ),
                                                                weight: el.option,
                                                              })}
                                                            >
                                                              $
                                                              {calculateProductPrice(
                                                                el
                                                              ) +
                                                                `/${filterData.categoryValue !=
                                                                'EDIBLES' &&
                                                                el.option
                                                                }`}
                                                            </option>
                                                          );
                                                        }
                                                      )}
                                                    </select>
                                                    <div className="text-center d-none d-md-block">
                                                      <p className="fs-12 text-gray-600 m-0">
                                                        {product?.variants?.length}{' '}
                                                        Varient Available
                                                      </p>
                                                    </div>
                                                  </div>
                                                ) : product?.variants[0]?.specialPriceMed ?
                                                  (
                                                    <h3
                                                      style={{ color: '#F5333F' }}
                                                      className="mb-0 fs-16 fs-sm-10 text-center ff-Soleil700"
                                                    >
                                                      Now $
                                                      {product?.variants[0]?.specialPriceMed}
                                                      <span className="text-site-black fs-14 fs-sm-10 ff-Soleil700 ">
                                                        {' '}
                                                        <span className=" font-sm-10 text-decoration-line-through">
                                                          ${product?.variants[0]?.priceMed}
                                                        </span>{' '}
                                                        {filterData.categoryValue !=
                                                          'EDIBLES' ? (
                                                          <>
                                                            |{' '}
                                                            {product?.variants[0]?.option}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </span>
                                                    </h3>
                                                  ) : (
                                                    <p className="fs-14 fs-sm-10 text-nowrap mb-2">
                                                      <span className="text-dark fs-20"></span>
                                                      <span className="text-danger fs-20">
                                                        {product?.variants[0]?.specialPriceMed}
                                                      </span>
                                                      $
                                                      {product?.variants[0]?.priceMed}
                                                      {filterData.categoryValue !=
                                                        'EDIBLES' ? (
                                                        <>
                                                          |{' '}
                                                          {product?.variants[0]?.option}
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </p>
                                                  )}
                                              </>
                                              :
                                              (menuTypeValue == "RECREATIONAL") ?
                                                <>
                                                  {product?.variants?.length > 1 ? (
                                                    <div className="d-flex flex-column">
                                                      <select
                                                        onChange={(e) => {
                                                          handleProductVariants(
                                                            e,
                                                            index
                                                          );
                                                        }}
                                                        className={`${pStyles.select} fs-sm-10`}
                                                        style={{
                                                          border: 'none',
                                                          textAlign: 'center',
                                                          outline: 'none',
                                                        }}
                                                      >
                                                        {product?.variants?.map(
                                                          (el, i) => {
                                                            return (
                                                              <option
                                                                key={i}
                                                                value={JSON.stringify({
                                                                  price:
                                                                    calculateProductPrice(
                                                                      el
                                                                    ),
                                                                  weight: el.option,
                                                                })}
                                                              >
                                                                $
                                                                {calculateProductPrice(
                                                                  el
                                                                ) +
                                                                  `/${filterData.categoryValue !=
                                                                  'EDIBLES' &&
                                                                  el.option
                                                                  }`}
                                                              </option>
                                                            );
                                                          }
                                                        )}
                                                      </select>
                                                      <div className="text-center d-none d-md-block">
                                                        <p className="fs-12 text-gray-600 m-0">
                                                          {product?.variants?.length}{' '}
                                                          Varient Available
                                                        </p>
                                                      </div>
                                                    </div>
                                                  ) : (product?.variants[0]?.specialPriceRec)
                                                    ?
                                                    <h3
                                                      style={{ color: '#F5333F' }}
                                                      className="mb-0 fs-16 fs-sm-10 text-center ff-Soleil700"
                                                    >
                                                      Now $
                                                      {product?.variants[0]?.specialPriceRec}
                                                      <span className="text-site-black fs-14 fs-sm-10 ff-Soleil700 ">
                                                        {' '}
                                                        <span className=" font-sm-10 text-decoration-line-through">
                                                          $
                                                          {product?.variants[0]?.priceRec}
                                                        </span>{' '}
                                                        {filterData.categoryValue !=
                                                          'EDIBLES' ? (
                                                          <>
                                                            |{' '}
                                                            {
                                                              product?.variants[0]?.option
                                                            }
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </span>
                                                    </h3>
                                                    :
                                                    <p className="fs-14 fs-sm-10 text-nowrap mb-2">
                                                      <span className="text-dark fs-20"></span>
                                                      <span className="text-danger fs-20">
                                                        {product?.variants[0]?.specialPriceRec}
                                                      </span>
                                                      $
                                                      {product?.variants[0]?.priceRec}
                                                      {filterData.categoryValue !=
                                                        'EDIBLES' ? (
                                                        <>
                                                          |{' '}
                                                          {product?.variants[0]?.option}
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </p>
                                                  }
                                                </>
                                                :
                                                <></>
                                          }
                                          {/* variants end */}

                                          {/* <div className="d-flex align-items-center gap-1"> */}
                                          {existInWishlist(product) ? (
                                            <AiFillHeart
                                              className={`fs-24 fs-sm-14 text-center cp`}
                                              onClick={() => {
                                                handleRemoveFromWishlist(
                                                  product
                                                );
                                              }}
                                            />
                                          ) : (
                                            <AiOutlineHeart
                                              className={`fs-24 fs-sm-14 text-center cp ${styles.heartIcon}`}
                                              style={{ width: '24px' }}
                                              onClick={() => {
                                                handleWishlist(product);
                                              }}
                                            />
                                          )}

                                          <button
                                            onClick={() => addToCart(product)}
                                            className={`px-3 py-1 rounded-pill fs-16 fs-sm-12 ${styles.addToCartButton} ${pStyles.addToCart}`}
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasRight"
                                          >
                                            {productInfo.product_button}
                                            &nbsp;&nbsp;
                                            <span className="fs-sm-12 fs-18">
                                              +
                                            </span>
                                          </button>
                                          {/* </div> */}
                                        </div>
                                        {/* offer button */}
                                        <div className=" ms-3">
                                          {
                                            !offerName ?
                                              <>
                                                {
                                                  (product?.variants[0]?.specialPriceRec && menuTypeValue == 'RECREATIONAL') ?
                                                    <div className="">
                                                      <p
                                                        className={`text-center text-white fs-12 mb-0 ${styles.card_button_bottom}`}
                                                      >
                                                        {calculateDiscountPercentage(
                                                          product?.variants[0].priceRec,
                                                          product?.variants[0].specialPriceRec
                                                        )}
                                                        % OFF
                                                      </p>
                                                    </div> :
                                                    (product?.variants[0]?.specialPriceMed && menuTypeValue == 'MEDICAL') ?
                                                      <div className="">
                                                        <p
                                                          className={`text-center text-white fs-12 mb-0 ${styles.card_button_bottom}`}
                                                        >
                                                          {calculateDiscountPercentage(
                                                            product?.variants[0].priceMed,
                                                            product?.variants[0].specialPriceMed
                                                          )}
                                                          % OFF
                                                        </p>
                                                      </div>
                                                      : <></>
                                                }
                                              </>
                                              : <></>
                                          }
                                          {offerName ? (
                                            <div className="">
                                              <p
                                                className={`text-center text-white fs-12 mb-0 py-2 cp ${styles.card_button_bottom_special}`}
                                              >
                                                <Link href={'/daily-deals'}>
                                                  {offerName}
                                                </Link>
                                              </p>
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                        {/* offer button end */}
                                      </div>
                                    </div>
                                  </div>
                                  //   Table view End
                                )
                              )}
                            </div>
                          </InfiniteScroll>
                        ) : (
                          <div className="row gy-3 mt-2 mt-md-0 gy-md-5 gx-3 gx-md-5">
                            {productList?.map((product, index) => (
                              isGridView ? (
                                <div
                                  className="col-6 col-md-4 col-lg-4"
                                  key={index}
                                >
                                  <div
                                    className={`m-0 px-2 py-3 m-md-0 m-lg-4 ${styles.productCustomCard} ${styles.custom_border}`}
                                  >
                                    <div className="text-center">
                                      <Link
                                        href={`/product-details/${product.slug}`}
                                      >
                                        <img
                                          className="cp"
                                          src={product?.image}
                                          alt={product?.name}
                                          height={117}
                                          width={117}
                                        />
                                      </Link>
                                    </div>
                                    <div className="text-center mt-3 mt-md-5 lh-15">
                                      <p
                                        className="fs-12 mb-2 ff-Soleil400 cp"
                                        onClick={() =>
                                          setFilterData((prevState) => ({
                                            ...prevState,
                                            brandIdValue: product?.brand?.id,
                                          }))
                                        }
                                        style={{ color: '#212322' }}
                                      >
                                        {product?.brand?.name}
                                      </p>
                                      <div
                                        className="d-flex justify-content-center align-items-center"
                                        style={{ height: '40px' }}
                                      >
                                        <Link
                                          href={`/product-details/${product.slug}`}
                                          className="w-75 fs-16 cp lh-20 ff-Soleil700 global_line_product_limit mb-0 text-center"
                                        >
                                          {product.name}
                                        </Link>
                                      </div>

                                      {
                                        (menuTypeValue == "MEDICAL")
                                          ?
                                          <>
                                            {product?.variants?.length > 1 ? (
                                              <div className="d-flex flex-column">
                                                <select
                                                  onChange={(e) => {
                                                    handleProductVariants(
                                                      e,
                                                      index
                                                    );
                                                  }}
                                                  className={`${pStyles.select} fs-sm-10`}
                                                  style={{
                                                    border: 'none',
                                                    textAlign: 'center',
                                                    outline: 'none',
                                                  }}
                                                >
                                                  {product?.variants?.map(
                                                    (el, i) => {
                                                      return (
                                                        <option
                                                          key={i}
                                                          value={JSON.stringify({
                                                            price:
                                                              calculateProductPrice(
                                                                el
                                                              ),
                                                            weight: el.option,
                                                          })}
                                                        >
                                                          $
                                                          {calculateProductPrice(
                                                            el
                                                          ) +
                                                            `/${filterData.categoryValue !=
                                                            'EDIBLES' &&
                                                            el.option
                                                            }`}
                                                        </option>
                                                      );
                                                    }
                                                  )}
                                                </select>
                                                <div className="text-center d-none d-md-block">
                                                  <p className="fs-12 text-gray-600 m-0">
                                                    {product?.variants?.length}{' '}
                                                    Varient Available
                                                  </p>
                                                </div>
                                              </div>
                                            ) : product?.variants[0]?.specialPriceMed ?
                                              (
                                                <h3
                                                  style={{ color: '#F5333F' }}
                                                  className="mb-0 fs-16 fs-sm-10 text-center ff-Soleil700"
                                                >
                                                  Now $
                                                  {product?.variants[0]?.specialPriceMed}
                                                  <span className="text-site-black fs-14 fs-sm-10 ff-Soleil700 ">
                                                    {' '}
                                                    <span className=" font-sm-10 text-decoration-line-through">
                                                      ${product?.variants[0]?.priceMed}
                                                    </span>{' '}
                                                    {filterData.categoryValue !=
                                                      'EDIBLES' ? (
                                                      <>
                                                        |{' '}
                                                        {product?.variants[0]?.option}
                                                      </>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </span>
                                                </h3>
                                              ) : (
                                                <p className="fs-14 fs-sm-10 text-nowrap mb-2">
                                                  <span className="text-dark fs-20"></span>
                                                  <span className="text-danger fs-20">
                                                    {product?.variants[0]?.specialPriceMed}
                                                  </span>
                                                  $
                                                  {product?.variants[0]?.priceMed}
                                                  {filterData.categoryValue !=
                                                    'EDIBLES' ? (
                                                    <>
                                                      |{' '}
                                                      {product?.variants[0]?.option}
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}
                                                </p>
                                              )}
                                          </>
                                          :
                                          (menuTypeValue == "RECREATIONAL") ?
                                            <>
                                              {product?.variants?.length > 1 ? (
                                                <div className="d-flex flex-column">
                                                  <select
                                                    onChange={(e) => {
                                                      handleProductVariants(
                                                        e,
                                                        index
                                                      );
                                                    }}
                                                    className={`${pStyles.select} fs-sm-10`}
                                                    style={{
                                                      border: 'none',
                                                      textAlign: 'center',
                                                      outline: 'none',
                                                    }}
                                                  >
                                                    {product?.variants?.map(
                                                      (el, i) => {
                                                        return (
                                                          <option
                                                            key={i}
                                                            value={JSON.stringify({
                                                              price:
                                                                calculateProductPrice(
                                                                  el
                                                                ),
                                                              weight: el.option,
                                                            })}
                                                          >
                                                            $
                                                            {calculateProductPrice(
                                                              el
                                                            ) +
                                                              `/${filterData.categoryValue !=
                                                              'EDIBLES' &&
                                                              el.option
                                                              }`}
                                                          </option>
                                                        );
                                                      }
                                                    )}
                                                  </select>
                                                  <div className="text-center d-none d-md-block">
                                                    <p className="fs-12 text-gray-600 m-0">
                                                      {product?.variants?.length}{' '}
                                                      Varient Available
                                                    </p>
                                                  </div>
                                                </div>
                                              ) :
                                                (product?.variants[0]?.specialPriceRec)
                                                  ?
                                                  <h3
                                                    style={{ color: '#F5333F' }}
                                                    className="mb-0 fs-16 fs-sm-10 text-center ff-Soleil700"
                                                  >
                                                    Now $
                                                    {product?.variants[0]?.specialPriceRec}
                                                    <span className="text-site-black fs-14 fs-sm-10 ff-Soleil700 ">
                                                      {' '}
                                                      <span className=" font-sm-10 text-decoration-line-through">
                                                        $
                                                        {product?.variants[0]?.priceRec}
                                                      </span>{' '}
                                                      {filterData.categoryValue !=
                                                        'EDIBLES' ? (
                                                        <>
                                                          |{' '}
                                                          {
                                                            product?.variants[0]?.option
                                                          }
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </span>
                                                  </h3>
                                                  :
                                                  <p className="fs-14 fs-sm-10 text-nowrap mb-2">
                                                    <span className="text-dark fs-20"></span>
                                                    <span className="text-danger fs-20">
                                                      {product?.variants[0]?.specialPriceRec}
                                                    </span>
                                                    $
                                                    {product?.variants[0]?.priceRec}
                                                    {filterData.categoryValue !=
                                                      'EDIBLES' ? (
                                                      <>
                                                        |{' '}
                                                        {product?.variants[0]?.option}
                                                      </>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </p>
                                              }
                                            </>
                                            :
                                            <></>
                                      }
                                    </div>

                                    <div className="d-flex gap-3 justify-content-center">
                                      {existInWishlist(product) ? (
                                        <AiFillHeart
                                          className={`fs-24 text-center my-auto cp`}
                                          onClick={() => {
                                            createToast(
                                              'Item already added to wishlist.',
                                              'info'
                                            );
                                          }}
                                        />
                                      ) : (
                                        <AiOutlineHeart
                                          className={`fs-24 text-center my-auto cp ${styles.heartIcon}`}
                                          onClick={() => {
                                            handleWishlist(product);
                                          }}
                                        />
                                      )}

                                      <button
                                        onClick={() => addToCart(product)}
                                        className={`px-4 py-1 rounded-pill fs-16 ${styles.addToCartButton}`}
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#offcanvasRight"
                                      >
                                        {productInfo.product_button}&nbsp;&nbsp;
                                        <span className="fs-18">+</span>
                                      </button>
                                    </div>
                                    <div className="mt-3">
                                      <div className={`row ${styles.potencyRow}`}>
                                        <div
                                          className={`col-6 ${styles.left_col}`}
                                        >
                                          <div className="">
                                            <p
                                              className={`fs-12 text-center ${styles.card_button_left}`}
                                            >
                                              {product?.strainType !=
                                                'NOT_APPLICABLE'
                                                ? product?.strainType
                                                : 'N/A'}
                                            </p>
                                          </div>
                                        </div>
                                        <div
                                          className={`col-6 ${styles.right_col}`}
                                        >
                                          <div className="">
                                            {product?.potencyThc?.formatted ? (
                                              <p
                                                className={`fs-12 text-center ${styles.card_button_right} cp`}
                                                onClick={() => {
                                                  handleThcClick(
                                                    product?.potencyThc?.range[0]
                                                  );
                                                }}
                                              >
                                                THC{' '}
                                                {product?.potencyThc?.formatted}
                                              </p>
                                            ) : (
                                              <p
                                                className={`fs-12 text-center ${styles.card_button_right}`}
                                              >
                                                THC {'N/A'}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* offer */}
                                      {
                                        !offerName ?
                                          <>
                                            {
                                              (product?.variants[0]?.specialPriceRec && menuTypeValue == 'RECREATIONAL') ?
                                                <div className="">
                                                  <p
                                                    className={`text-center text-white fs-12 mb-0 ${styles.card_button_bottom}`}
                                                  >
                                                    {calculateDiscountPercentage(
                                                      product?.variants[0].priceRec,
                                                      product?.variants[0].specialPriceRec
                                                    )}
                                                    % OFF
                                                  </p>
                                                </div> :
                                                (product?.variants[0]?.specialPriceMed && menuTypeValue == 'MEDICAL') ?
                                                  <div className="">
                                                    <p
                                                      className={`text-center text-white fs-12 mb-0 ${styles.card_button_bottom}`}
                                                    >
                                                      {calculateDiscountPercentage(
                                                        product?.variants[0].priceMed,
                                                        product?.variants[0].specialPriceMed
                                                      )}
                                                      % OFF
                                                    </p>
                                                  </div>
                                                  : <></>
                                            }
                                          </>
                                          : <></>
                                      }


                                      {offerName ? (
                                        <div className="">
                                          <p
                                            className={`text-center text-white fs-12 mb-0 cp ${styles.card_button_bottom_special}`}
                                          >
                                            <Link href={'/daily-deals'}>
                                              {offerName}
                                            </Link>
                                          </p>
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) :
                                (
                                  // Table view Start=================================
                                  <div className="" key={index}>
                                    <div
                                      className={`m-0 px-2 py-3 m-md-0 pe-4 row ps-0 ${styles.productCustomCard} `}
                                    >
                                      <div className="col-2 col-sm-3 text-center p-0 pe-2 my-auto">
                                        <Link
                                          href={`/product-details/${product.slug}`}
                                        >
                                          <img
                                            className={`${pStyles.image} cp`}
                                            src={product?.image}
                                            alt={product?.name}
                                            height={117}
                                            width={117}
                                          />
                                        </Link>
                                      </div>
                                      <div
                                        className={`col-5 col-sm-4 py-4 px-0 d-flex flex-column justify-content-between ${pStyles.lh}`}
                                      >
                                        <div className="">
                                          <p
                                            className="fs-12 fs-sm-10 ff-Soleil400 mb-1 cp"
                                            onClick={() =>
                                              setFilterData((prevState) => ({
                                                ...prevState,
                                                brandIdValue:
                                                  product?.brand?.id,
                                              }))
                                            }
                                            style={{ color: '#212322' }}
                                          >
                                            {product?.brand?.name}
                                          </p>
                                          <div
                                            className="mb-2"
                                          //   style={{ height: '40px' }}
                                          >
                                            <Link
                                              href={`/product-details/${product.slug}`}
                                              className="fs-16 fs-sm-12 cp lh-20 ff-Soleil700 global_line_product_limit mb-0"
                                            >
                                              {product.name}
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="mb-2">
                                          <div
                                            className={`row ${styles.potencyRow}`}
                                          >
                                            <div
                                              className={`col-6 ${styles.left_col}`}
                                            >
                                              <div className="">
                                                <p
                                                  className={`fs-12 fs-sm-10 text-center m-0 py-2 ${pStyles.half_button} ${styles.card_button_left}`}
                                                >
                                                  {product?.strainType !=
                                                    'NOT_APPLICABLE'
                                                    ? product?.strainType
                                                    : 'N/A'}
                                                </p>
                                              </div>
                                            </div>
                                            <div
                                              className={`col-6 ${styles.right_col}`}
                                            >
                                              <div className="">
                                                {product?.potencyThc
                                                  ?.formatted ? (
                                                  <p
                                                    className={`fs-12 fs-sm-10 text-center m-0 py-2 ${pStyles.half_button} ${styles.card_button_right} cp`}
                                                    onClick={() => {
                                                      handleThcClick(
                                                        product?.potencyThc
                                                          ?.range[0]
                                                      );
                                                    }}
                                                  >
                                                    THC{' '}
                                                    {
                                                      product?.potencyThc
                                                        ?.formatted
                                                    }
                                                  </p>
                                                ) : (
                                                  <p
                                                    className={`fs-12 fs-sm-10 text-center m-0 py-2 ${pStyles.half_button} ${styles.card_button_right}`}
                                                  >
                                                    THC {'N/A'}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        className={`col-5 py-4 d-flex flex-column justify-content-between p-0 ${pStyles.lh}`}
                                      >
                                        <div
                                          className={`d-flex justify-content-end align-items-center mb-2 my-sm-0 ${pStyles.c_gap}`}
                                        >
                                          {/* product variants */}

                                          {
                                            (menuTypeValue == "MEDICAL")
                                              ?
                                              <>
                                                {product?.variants?.length > 1 ? (
                                                  <div className="d-flex flex-column">
                                                    <select
                                                      onChange={(e) => {
                                                        handleProductVariants(
                                                          e,
                                                          index
                                                        );
                                                      }}
                                                      className={`${pStyles.select} fs-sm-10`}
                                                      style={{
                                                        border: 'none',
                                                        textAlign: 'center',
                                                        outline: 'none',
                                                      }}
                                                    >
                                                      {product?.variants?.map(
                                                        (el, i) => {
                                                          return (
                                                            <option
                                                              key={i}
                                                              value={JSON.stringify({
                                                                price:
                                                                  calculateProductPrice(
                                                                    el
                                                                  ),
                                                                weight: el.option,
                                                              })}
                                                            >
                                                              $
                                                              {calculateProductPrice(
                                                                el
                                                              ) +
                                                                `/${filterData.categoryValue !=
                                                                'EDIBLES' &&
                                                                el.option
                                                                }`}
                                                            </option>
                                                          );
                                                        }
                                                      )}
                                                    </select>
                                                    <div className="text-center d-none d-md-block">
                                                      <p className="fs-12 text-gray-600 m-0">
                                                        {product?.variants?.length}{' '}
                                                        Varient Available
                                                      </p>
                                                    </div>
                                                  </div>
                                                ) : product?.variants[0]?.specialPriceMed ?
                                                  (
                                                    <h3
                                                      style={{ color: '#F5333F' }}
                                                      className="mb-0 fs-16 fs-sm-10 text-center ff-Soleil700"
                                                    >
                                                      Now $
                                                      {product?.variants[0]?.specialPriceMed}
                                                      <span className="text-site-black fs-14 fs-sm-10 ff-Soleil700 ">
                                                        {' '}
                                                        <span className=" font-sm-10 text-decoration-line-through">
                                                          ${product?.variants[0]?.priceMed}
                                                        </span>{' '}
                                                        {filterData.categoryValue !=
                                                          'EDIBLES' ? (
                                                          <>
                                                            |{' '}
                                                            {product?.variants[0]?.option}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </span>
                                                    </h3>
                                                  ) : (
                                                    <p className="fs-14 fs-sm-10 text-nowrap mb-2">
                                                      <span className="text-dark fs-20"></span>
                                                      <span className="text-danger fs-20">
                                                        {product?.variants[0]?.specialPriceMed}
                                                      </span>
                                                      $
                                                      {product?.variants[0]?.priceMed}
                                                      {filterData.categoryValue !=
                                                        'EDIBLES' ? (
                                                        <>
                                                          |{' '}
                                                          {product?.variants[0]?.option}
                                                        </>
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </p>
                                                  )}
                                              </>
                                              :
                                              (menuTypeValue == "RECREATIONAL") ?
                                                <>
                                                  {product?.variants?.length > 1 ? (
                                                    <div className="d-flex flex-column">
                                                      <select
                                                        onChange={(e) => {
                                                          handleProductVariants(
                                                            e,
                                                            index
                                                          );
                                                        }}
                                                        className={`${pStyles.select} fs-sm-10`}
                                                        style={{
                                                          border: 'none',
                                                          textAlign: 'center',
                                                          outline: 'none',
                                                        }}
                                                      >
                                                        {product?.variants?.map(
                                                          (el, i) => {
                                                            return (
                                                              <option
                                                                key={i}
                                                                value={JSON.stringify({
                                                                  price:
                                                                    calculateProductPrice(
                                                                      el
                                                                    ),
                                                                  weight: el.option,
                                                                })}
                                                              >
                                                                $
                                                                {calculateProductPrice(
                                                                  el
                                                                ) +
                                                                  `/${filterData.categoryValue !=
                                                                  'EDIBLES' &&
                                                                  el.option
                                                                  }`}
                                                              </option>
                                                            );
                                                          }
                                                        )}
                                                      </select>
                                                      <div className="text-center d-none d-md-block">
                                                        <p className="fs-12 text-gray-600 m-0">
                                                          {product?.variants?.length}{' '}
                                                          Varient Available
                                                        </p>
                                                      </div>
                                                    </div>
                                                  ) :
                                                    (product?.variants[0]?.specialPriceRec)
                                                      ?
                                                      <h3
                                                        style={{ color: '#F5333F' }}
                                                        className="mb-0 fs-16 fs-sm-10 text-center ff-Soleil700"
                                                      >
                                                        Now $
                                                        {product?.variants[0]?.specialPriceRec}
                                                        <span className="text-site-black fs-14 fs-sm-10 ff-Soleil700 ">
                                                          {' '}
                                                          <span className=" font-sm-10 text-decoration-line-through">
                                                            $
                                                            {product?.variants[0]?.priceRec}
                                                          </span>{' '}
                                                          {filterData.categoryValue !=
                                                            'EDIBLES' ? (
                                                            <>
                                                              |{' '}
                                                              {
                                                                product?.variants[0]?.option
                                                              }
                                                            </>
                                                          ) : (
                                                            <></>
                                                          )}
                                                        </span>
                                                      </h3>
                                                      :
                                                      <p className="fs-14 fs-sm-10 text-nowrap mb-2">
                                                        <span className="text-dark fs-20"></span>
                                                        <span className="text-danger fs-20">
                                                          {product?.variants[0]?.specialPriceRec}
                                                        </span>
                                                        $
                                                        {product?.variants[0]?.priceRec}
                                                        {filterData.categoryValue !=
                                                          'EDIBLES' ? (
                                                          <>
                                                            |{' '}
                                                            {product?.variants[0]?.option}
                                                          </>
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </p>
                                                  }
                                                </>
                                                :
                                                <></>
                                          }

                                          {/* variants end */}

                                          {/* <div className="d-flex align-items-center gap-1"> */}
                                          {existInWishlist(product) ? (
                                            <AiFillHeart
                                              className={`fs-24 fs-sm-14 text-center cp`}
                                              onClick={() => {
                                                handleRemoveFromWishlist(
                                                  product
                                                );
                                              }}
                                            />
                                          ) : (
                                            <AiOutlineHeart
                                              className={`fs-24 fs-sm-14 text-center cp ${styles.heartIcon}`}
                                              style={{ width: '24px' }}
                                              onClick={() => {
                                                handleWishlist(product);
                                              }}
                                            />
                                          )}

                                          <button
                                            onClick={() => addToCart(product)}
                                            className={`px-3 py-1 rounded-pill fs-16 fs-sm-12 ${styles.addToCartButton} ${pStyles.addToCart}`}
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasRight"
                                          >
                                            {productInfo.product_button}
                                            &nbsp;&nbsp;
                                            <span className="fs-sm-12 fs-18">
                                              +
                                            </span>
                                          </button>
                                          {/* </div> */}
                                        </div>
                                        {/* offer button */}
                                        <div className=" ms-3">
                                          {
                                            !offerName ?
                                              <>
                                                {
                                                  (product?.variants[0]?.specialPriceRec && menuTypeValue == 'RECREATIONAL') ?
                                                    <div className="">
                                                      <p
                                                        className={`text-center text-white fs-12 mb-0 ${styles.card_button_bottom}`}
                                                      >
                                                        {calculateDiscountPercentage(
                                                          product?.variants[0].priceRec,
                                                          product?.variants[0].specialPriceRec
                                                        )}
                                                        % OFF
                                                      </p>
                                                    </div> :
                                                    (product?.variants[0]?.specialPriceMed && menuTypeValue == 'MEDICAL') ?
                                                      <div className="">
                                                        <p
                                                          className={`text-center text-white fs-12 mb-0 ${styles.card_button_bottom}`}
                                                        >
                                                          {calculateDiscountPercentage(
                                                            product?.variants[0].priceMed,
                                                            product?.variants[0].specialPriceMed
                                                          )}
                                                          % OFF
                                                        </p>
                                                      </div>
                                                      : <></>
                                                }
                                              </>
                                              : <></>
                                          }
                                          {offerName ? (
                                            <div className="">
                                              <p
                                                className={`text-center text-white fs-12 mb-0 py-2 cp ${styles.card_button_bottom_special}`}
                                              >
                                                <Link href={'/daily-deals'}>
                                                  {offerName}
                                                </Link>
                                              </p>
                                            </div>
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                        {/* offer button end */}
                                      </div>
                                    </div>
                                  </div>
                                  //   Table view End
                                )
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="container py-4">
                        <div className="row">
                          <div className="col-12 col-md-12 col-lg-12">
                            <div
                              className="text-center fs-18 fw-bold mt-5"
                              role="alert"
                            >
                              <div>
                                <picture>
                                  <img
                                    src="/images/no-brand-select.png"
                                    alt=""
                                    height={160}
                                    style={{ objectFit: 'contain' }}
                                  />
                                </picture>
                                <div className="text-center">
                                  <p className="fs-28 ff-Montserrat600 mb-0">
                                    No Products Found!
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {skelitonArr.map((el, index) => {
                      return (
                        <div className="row" key={index}>
                          <div className="col-12 col-md-4 col-lg-4">
                            <div className="m-4 m-md-0 m-lg-4">
                              <Skeleton width="100%" height="300px" />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-lg-4">
                            <div className="m-4 m-md-0 m-lg-4">
                              <Skeleton width="100%" height="300px" />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-lg-4">
                            <div className="m-4 m-md-0 m-lg-4">
                              <Skeleton width="100%" height="300px" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      }
    </>
  );
}
