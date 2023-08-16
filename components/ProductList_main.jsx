import React, { useState, useEffect, useRef } from "react";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import productInfo from "../cms-data/productsCms";
import styles from "../styles/Products.module.css";
import { BiFilterAlt, BiSearch } from "react-icons/bi";
import { RxDividerVertical } from "react-icons/rx";
import { RiArrowDropDownLine, RiFilterOffLine } from "react-icons/ri";
import {
    AiOutlineHeart,
    AiOutlineLeft,
    AiOutlineRight,
    AiFillHeart,
    AiOutlineDown,
} from "react-icons/ai";
import { MdOutlineSort } from "react-icons/md";
import { TiArrowUnsorted } from "react-icons/ti";
import { useRouter } from "next/router";
import { getTrackBackground, Range } from "react-range";
import { fetchData, postData } from "../utils/FetchApi";
import api from "../config/api.json";
import {
    setCurrentPage,
    setSiteLoader,
    setOffset,
    setRetailerType,
    setAllRetailer,
} from "../redux/global_store/globalReducer";
import { useSelector, useDispatch } from "react-redux";
import useDidMountEffect from "../custom-hook/useDidMount";
import { scrollToTop, showLoader } from "../utils/helper";
import { addItemToCart } from "../redux/cart_store/cartReducer";
import { addToWishlist } from "../redux/wishlist_store/wishlistReducer";
import { setCheckoutId, setBrandQueryValue, setCategoryQueryValue, setStrainTypeQueryValue } from "../redux/global_store/globalReducer";
import Swal from "sweetalert2";
import { createCheckout } from "../utils/helper";
import Skeleton from "react-loading-skeleton";
import { createToast } from "../utils/toast";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGetFeaturedBrandsQuery, useGetRetailerDataMutation } from "../redux/api_core/apiCore";
import axios from "axios";
import parse from "html-react-parser";
import { toTitleCase } from "../utils/helper";

const STEP = 1;
const MIN = 0;
const MAX = 100;

const priceMin = 0;
const priceMax = 300;

export default function ProductList({ route }) {
    let dispatch = useDispatch();

    const [getRetailer, result] = useGetRetailerDataMutation();

    let { offset, checkoutId, selectedRetailer, categories, brandQueryValue, categoryQueryValue, strainTypeQueryValue } = useSelector(
        (store) => store.globalStore
    );
    let { wishlist } = useSelector((store) => store.wishlistStore);

    // featured brands
    let { data: featuredBrandData, isLoading: featuredBrandLoading } =
        useGetFeaturedBrandsQuery();
    const featuredBrandList = featuredBrandData?.data;
    const featuredBrandSkeleton = [1, 2, 3, 4, 5, 6];

    const router = useRouter();
    const [rtl, setRtl] = useState(undefined);
    const [seeCatagoryText, setSeeCatagoryText] = useState("See more");
    const [seeSubcatagoryText, setSeeSubcatagoryText] = useState("See more");
    const [seeBrandText, setSeeBrandText] = useState("See more");
    const [seeEffectText, setSeeEffectText] = useState("See more");
    const [toggleViewMode, setToggleViewMode] = useState(false);
    const [toggleSortMode, setToggleSortMode] = useState(false);
    const [toggleFeatureMode, setToggleFeatureMode] = useState(false);
    const [priceValues, setPriceValues] = useState([0, 100]);

    const [productList, setProductList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [effectsList, setEffectsList] = useState([]);
    const [strainTypeList, setStrainTypeList] = useState([]);
    const [weightList, setWeightList] = useState([]);
    const [menuTypeList, setMenuTypeList] = useState([]);
    const [limitPerPage, setLimitPerPage] = useState(20);
    const [pageCount, setPageCount] = useState(0);
    const [prevCategoryId, setPrevCategoryId] = useState("");
    const [prevSubCategoryId, setPrevSubCategoryId] = useState("");
    const [prevBrandId, setPrevBrandId] = useState("");
    const [prevWeightList, setPrevWeightList] = useState([]);
    const [filterInit, setFilterInit] = useState(true);
    const [mainBrandList, setMainBrandList] = useState([]);
    const customMenus = ['Bundles', 'Current Promos', 'Save with JARS', 'Weekly Deals'];

    //const [currentPage, setCurrentPage] = useState(0);

    const [filterData, setFilterData] = useState({
        categoryValue: "",
        subCategoryValue: "",
        brandIdValue: "",
        effectsValue: [],
        strainTypeValue: "",
        weightsValue: [],
        menuTypeValue: handleMenuType(),
        potencyValue: [0, 100],
        potencyCbdValue: [0, 100],
        priceValue: [0, 500],
        dailyDealsValue: "",
        sort: {
            direction: "ASC",
            key: "PRICE",
        },
        // search: "",
        specialId: "",
        customMenuValue: ""
    });
    const search = useRef("");
    const [searchKey, setSearchKey] = useState("");

    const [sortKey, setSortKey] = useState({
        sort: {
            direction: "ASC",
            key: "PRICE",
        },
    });

    const [sortByLabel, setSortByLabel] = useState("");
    const [featureByLabel, setFeatureByLabel] = useState("");
    const [customOff, setCustomOff] = useState(false);
    const divRef = useRef(null);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    const handleClickOutside = (event) => {
        if (divRef.current && !divRef.current.contains(event.target)) {
            setCustomOff(false);
        }
    };

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

    const [brandFilterValue, setBrandFilterValue] = useState("");
    let brandFilterInit = useRef(false);

    function handleBrandFilterValue(e) {
        setBrandFilterValue(e.target.value);
    }

    function filterBrand() {
        brandFilterInit.current == true;
        let newArr = [...mainBrandList];
        let searchVal = brandFilterValue.toUpperCase();
        let filteredArr = [];
        newArr.forEach((el, index) => {
            let brandName = el?.name?.toUpperCase();
            if (brandName.includes(searchVal)) {
                filteredArr.push(el);
            }
        });
        setBrandList(filteredArr);
    }

    function handleMenuType() {
        if (selectedRetailer?.menuTypes?.length == 2) {
            return selectedRetailer.menuTypes.find((el) => el == "RECREATIONAL");
        } else if (selectedRetailer?.menuTypes?.length == 1) {
            return selectedRetailer?.menuTypes[0];
        } else {
            return "RECREATIONAL";
        }
    }

    function handleMenuTypeDropdownSelection(data) {
        setFilterData((prevState) => ({ ...prevState, menuTypeValue: data }));
    }

    const handleCatagoryToggle = () => {
        if (seeCatagoryText === "See more") {
            setSeeCatagoryText("See less");
        } else {
            setSeeCatagoryText("See more");
        }
    };

    const handleSubcatagoryToggle = () => {
        if (seeSubcatagoryText === "See more") {
            setSeeSubcatagoryText("See less");
        } else {
            setSeeSubcatagoryText("See more");
        }
    };

    const handleBrandToggle = () => {
        if (seeBrandText === "See more") {
            setSeeBrandText("See less");
        } else {
            setSeeBrandText("See more");
        }
    };

    const handleEffectToggle = () => {
        if (seeEffectText === "See more") {
            setSeeEffectText("See less");
        } else {
            setSeeEffectText("See more");
        }
    };

    // function toTitleCase(str) {
    //     return str.replace(/\w\S*/g, function (txt) {
    //         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    //     });
    // }

    function handleWeightCheckbox(e) {
        let value = e.target.value;
        let filteredValue = [...filterData.weightsValue];
        if (filterData.weightsValue.includes(value)) {
            filteredValue.splice(filterData.weightsValue.indexOf(value), 1);
        } else {
            filteredValue.push(value);
        }
        //setWeightsValue(filteredValue);
        setFilterData((prevState) => ({
            ...prevState,
            [e.target.name]: filteredValue,
        }));
    }

    function handleEffectCheckbox(e) {
        let value = e.target.value;
        let filteredValue = [...filterData.effectsValue];
        if (filterData.effectsValue.includes(value)) {
            filteredValue.splice(filterData.effectsValue.indexOf(value), 1);
        } else {
            filteredValue.push(value);
        }
        //setEffectsValue(filteredValue);
        setFilterData((prevState) => ({
            ...prevState,
            [e.target.name]: filteredValue,
        }));
    }

    function handleTabCategoryCheckBox(e) {
        if (e.target.checked) {
            setFilterData((oldVal) => ({ ...oldVal, categoryValue: e.target.value }));
            setPrevCategoryId("");
        } else {
            setFilterData((oldVal) => ({ ...oldVal, categoryValue: "" }));
        }
    }

    function handleFilter(e) {
        setFilterData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    }

    function handleSort(label, param = {}) {
        setSortByLabel(label);
        setFeatureByLabel("");
        setSortKey((prevValue) => ({ ...prevValue, sort: param }));
    }

    function handleFeature(label, param = {}) {
        setFeatureByLabel(label);
        setSortByLabel("");
        setSortKey((prevValue) => ({ ...prevValue, sort: param }));
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
        if (filterData.menuTypeValue == "RECREATIONAL") {
            if (item.specialPriceRec) return item.specialPriceRec;
            else return item.priceRec;
        }
        if (filterData.menuTypeValue == "MEDICAL") {
            if (item.specialPriceMed) return item.specialPriceMed;
            else return item.priceMed;
        }
    }

    function calculateDiscountPercentage(orginalPrice, discountPrice) {
        let discount = 100 * ((orginalPrice - discountPrice) / orginalPrice);
        return parseInt(discount);
    }

    function handlePageScroll() {
        offsetKey.current = offsetKey.current + 20;
        applyFilter();
    }

    async function handleSearch(e) {
        e.preventDefault();
        setFilterInit(true);
        searchInit.current = true;
        search.current = searchKey;
        offsetKey.current = 0;
        clearAllFilter();
        await getProductList();
        searchInit.current = false;
    }

    async function handleSearchSug(data) {
        setFilterInit(true);
        setCustomOff(false);
        setSearchKey(data);
        searchInit.current = true;
        search.current = data;
        offsetKey.current = 0;
        clearAllFilter();
        await getProductList();
        searchInit.current = false;
    }

    async function getProductList(params = {}) {
        try {
            let response = undefined;
            brandFilterInit.current = false;
            if (search.current) {
                let data = {
                    retailerId: selectedRetailer.id,
                    search: search.current,
                    page: Math.ceil(offsetKey.current / limitPerPage),
                    limit: limitPerPage,
                };
                response = await postData(
                    api.product.productServiceElasticSearchDetails,
                    data
                );
            } else {
                if (filterData.customMenuValue) {
                    params.menuSection = {
                        type: "CUSTOM_SECTION",
                        name: filterData.customMenuValue,
                    }
                }
                if (filterData.dailyDealsValue) {
                    params.menuSection = {
                        type: "SPECIALS",
                        specialId: filterData.dailyDealsValue,
                    }
                }
                let data = {
                    retailerId: selectedRetailer.id,
                    filter: params,
                    menuType: filterData.menuTypeValue,
                    pagination: {
                        offset: offsetKey.current,
                        limit: limitPerPage,
                    },
                    ...(((filterData.priceValue[0] && filterData.priceValue[0] > 0) ||
                        (filterData.priceValue[1] && filterData.priceValue[1] <= 300)) && {
                        minPrice: filterData.priceValue[0],
                        maxPrice: filterData.priceValue[1],
                    }),
                    sort: sortKey.sort,
                };
                response = await postData(api.product.getAllURL, data);
            }

            if (response?.status == 200 || response?.status == 201) {
                let data = response.data.menu;
                // if (data?.products.length == 0) {
                //     setFilterData((prevState) => ({ ...prevState, subCategoryValue: "", brandIdValue: "", weightsValue: [] }));
                // }
                let productList = data?.products?.length > 0 ? data?.products : [];
                let brandList = data?.brands?.length > 0 ? data?.brands : [];
                let subCategoryList =
                    data?.subCategory?.length > 0 ? data?.subCategory : [];
                let weightList = data?.weights?.length > 0 ? data?.weights : [];
                let productsCount = data?.productsCount;
                productCount.current = productsCount;
                //let pageCount = Math.ceil(productsCount / limitPerPage);
                //setPageCount(pageCount);
                if (productCount.current > 20) {
                    if (offsetKey.current > productsCount) {
                        hasMore.current = false;
                    } else {
                        hasMore.current = true;
                    }
                } else {
                    hasMore.current = false;
                }

                if (offsetKey.current == 0) {
                    setProductList(productList);
                } else {
                    setProductList((oldVal) => [...oldVal, ...productList]);
                }

                setMainBrandList(brandList);
                setBrandList(brandList);
                if (filterData.categoryValue != prevCategoryId) {
                    setSubCategoryList(subCategoryList);
                }
                if (filterData.categoryValue) {
                    setWeightList(weightList);
                }
            }
            //isFilter.current = false;
        } catch (error) {
            console.log(error);
        } finally {
            setFilterInit(false);
        }
    }

    async function getProductVariants() {
        try {
            let data = {
                retailerId: selectedRetailer.id,
            };
            let response = await postData(api.product.getProductVariants, data);
            if (response.status == 200) {
                let data = response.data;
                let categoryList = data?.category?.length > 0 ? data?.category : [];
                let effectList = data?.effects?.length > 0 ? data?.effects : [];
                let strainList = data?.strainType?.length > 0 ? data?.strainType : [];
                let menuTypeList = data?.menuType?.length > 0 ? data?.menuType : [];
                setCategoryList(categoryList);
                setEffectsList(effectList);
                setStrainTypeList(strainList);
                const copyMenuList = [...menuTypeList];
                const reverseMenuList = copyMenuList.reverse();
                setMenuTypeList(reverseMenuList);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function applyFilter() {
        if (offsetKey.current == 0) {
            setFilterInit(true);
        }
        let categoryChange = false;
        let subCategoryChange = false;
        let brandChange = false;
        let weightChange = false;
        let data = {
            ...(filterData.categoryValue &&
                filterData.categoryValue != "N/A" && {
                category: filterData.categoryValue,
            }),
            ...(filterData.effectsValue &&
                filterData.effectsValue?.length > 0 && {
                effects: filterData.effectsValue,
            }),
            ...(filterData.strainTypeValue && {
                strainType: filterData.strainTypeValue,
            }),
            // ...(filterData.search && { search: filterData.search }),
        };

        //handle category change
        if (
            filterData.categoryValue &&
            filterData.categoryValue != "N/A" &&
            filterData.categoryValue != prevCategoryId
        ) {
            categoryChange = true;
            if (
                filterData.subCategoryValue ||
                filterData.brandIdValue ||
                filterData.weightsValue?.length > 0
            ) {
                setFilterData((prevState) => ({
                    ...prevState,
                    subCategoryValue: "",
                    brandIdValue: "",
                    weightsValue: [],
                }));
            }
            setPrevCategoryId(filterData.categoryValue);
        }
        //handle sub category change
        if (
            filterData.subCategoryValue &&
            filterData.subCategoryValue != prevSubCategoryId
        ) {
            subCategoryChange = true;
            if (filterData.brandIdValue) {
                setFilterData((prevState) => ({ ...prevState, brandIdValue: "" }));
            }
            if (filterData.weightsValue?.length > 0) {
                setFilterData((prevState) => ({ ...prevState, weightsValue: [] }));
            }
            setPrevSubCategoryId(filterData.subCategoryValue);
        }

        //handle brand change
        if (filterData.brandIdValue && filterData.brandIdValue != prevBrandId) {
            brandChange = true;
            if (filterData.weightsValue?.length > 0) {
                setFilterData((prevState) => ({ ...prevState, weightsValue: [] }));
            }
            setPrevBrandId(filterData.brandIdValue);
        }

        //handle weight change
        if (
            filterData.weightsValue?.length > 0 &&
            JSON.stringify(filterData.weightsValue) !== JSON.stringify(prevWeightList)
        ) {
            weightChange = true;
            if (filterData.brandIdValue) {
                setFilterData((prevState) => ({ ...prevState, brandIdValue: "" }));
            }
            setPrevWeightList(filterData.weightsValue);
        }

        if (filterData.subCategoryValue && categoryChange == false) {
            data.subcategory = filterData.subCategoryValue;
        }

        if (filterData.potencyValue[0] > 0 || filterData.potencyValue[1] <= 100) {
            data.potencyThc = {
                min: filterData.potencyValue[0],
                max: filterData.potencyValue[1],
                unit: "PERCENTAGE",
            };
        }

        if (
            filterData.potencyCbdValue[0] > 0 ||
            filterData.potencyCbdValue[1] <= 100
        ) {
            data.potencyCbd = {
                min: filterData.potencyCbdValue[0],
                max: filterData.potencyCbdValue[1],
                unit: "PERCENTAGE",
            };
        }
        if (
            filterData.weightsValue &&
            filterData.weightsValue?.length > 0 &&
            categoryChange == false &&
            subCategoryChange == false &&
            brandChange == false
        ) {
            data.weights = filterData.weightsValue;
        }
        if (
            filterData.brandIdValue &&
            categoryChange == false &&
            subCategoryChange == false &&
            weightChange == false
        ) {
            data.brandId = filterData.brandIdValue;
        }
        if (router.query.special_id && router.query.menuType) {
            data.menuSection = {
                type: "SPECIALS",
                specialId: filterData.specialId,
            };
        }
        await getProductList(data);
    }

    //cart and wish list section
    async function addToCart(data) {
        let createdId = "";
        if (selectedRetailer?.id && checkoutId == "undefined") {
            createdId = await createCheckout({
                retailerId: selectedRetailer?.id,
                orderType: "PICKUP",
                pricingType: "RECREATIONAL",
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
    }

    function handleWishlist(data) {
        data.menuType = filterData.menuTypeValue;
        if (data.variants?.length > 1) {
            data.selectedPrice = calculateProductPrice(data.variants[0]);
            data.selectedWeight = data.variants[0].option;
            data.selectedVariants = JSON.stringify({
                price: data.selectedPrice,
                weight: data.selectedWeight,
            });
        } else {
            data.selectedPrice = calculateProductPrice(data.variants[0]);
            data.selectedWeight = data.variants[0].option;
        }
        dispatch(addToWishlist({ data: data, quantity: 1 }));
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
    //end cart and wish list section

    //clear particular filter
    function clearFilter(filterName) {
        switch (filterName) {
            case "category":
                setFilterData((prevState) => ({ ...prevState, categoryValue: "N/A" }));
                setFilterData((prevState) => ({ ...prevState, subCategoryValue: "" }));
                setFilterData((prevState) => ({ ...prevState, weightsValue: [] }));
                setFilterData((prevState) => ({ ...prevState, brandIdValue: "" }));
                break;
            case "subCategory":
                setFilterData((prevState) => ({ ...prevState, subCategoryValue: "" }));
                setFilterData((prevState) => ({ ...prevState, weightsValue: [] }));
                setFilterData((prevState) => ({ ...prevState, brandIdValue: "" }));
                break;
            case "strain":
                setFilterData((prevState) => ({ ...prevState, strainTypeValue: "" }));
                break;
            case "weight":
                setFilterData((prevState) => ({ ...prevState, weightsValue: [] }));
                setFilterData((prevState) => ({ ...prevState, brandIdValue: "" }));
                break;
            case "brands":
                setFilterData((prevState) => ({ ...prevState, brandIdValue: "" }));
                setFilterData((prevState) => ({ ...prevState, weightsValue: [] }));
                break;
            case "effect":
                setFilterData((prevState) => ({ ...prevState, effectsValue: [] }));
                break;
            case "customMenu":
                setFilterData((prevState) => ({ ...prevState, customMenuValue: "" }));
                break;
            case "dailyDeals":
                setFilterData((prevState) => ({ ...prevState, dailyDealsValue: "" }));
                break;
        }
    }

    //clear all filter
    function clearAllFilter() {
        setFilterData({
            categoryValue: "N/A",
            subCategoryValue: "",
            brandIdValue: "",
            effectsValue: [],
            strainTypeValue: "",
            weightsValue: [],
            menuTypeValue: handleMenuType(),
            potencyValue: [0, 100],
            potencyCbdValue: [0, 100],
            priceValue: [0, 500],
            dailyDealsValue: "",
            sort: {
                direction: "ASC",
                key: "PRICE",
            },
            search: "",
        });
        setPrevCategoryId("");
    }

    const handleSearchOnChange = async (e) => {
        const search = e.target.value;
        setSearchKey(search);
        const data = { search, retailerId: selectedRetailer?.id, limit: 5 };
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
    };

    const handleDetailsPage = (slug) => {
        router.push(`/product-details/${slug}`);
    };

    function handlePriceValue(e) {
        let tempArr = [0, e.target.value];
        setFilterData((prevValue) => ({ ...prevValue, priceValue: tempArr }));
    }
    function handlePotencyThcChange(e) {
        let tempArr = [0, e.target.value];
        setFilterData((prevValue) => ({ ...prevValue, potencyValue: tempArr }));
    }
    function handlePotencyCbdChange(e) {
        let tempArr = [0, e.target.value];
        setFilterData((prevValue) => ({ ...prevValue, potencyCbdValue: tempArr }));
    }

    useEffect(() => {
        getProductVariants();
        if (router.isReady) {
            if (route == "category" && router.query?.categoryName) {
                routeCategory.current = router.query?.categoryName;
                setFilterData((prevValue) => ({
                    ...prevValue,
                    categoryValue: routeCategory.current.toUpperCase(),
                }));
            }

            if (
                route == "shop" &&
                router?.query?.minPrice &&
                router?.query?.maxPrice
            ) {
                let price = [
                    parseInt(router?.query?.minPrice),
                    parseInt(router?.query?.maxPrice),
                ];
                setFilterData((prevState) => ({ ...prevState, priceValue: price }));
            }
            if (router.query.special_id && router.query.menuType) {
                setFilterData((prevState) => ({
                    ...prevState,
                    menuTypeValue: router.query.menuType,
                }));
                setFilterData((prevState) => ({
                    ...prevState,
                    specialId: router.query.special_id,
                }));
            }
            if (router?.query?.search) {
                offsetKey.current = 0;
                search.current = router?.query?.search;
                setFilterInit(true);
                getProductList();
            }
        }
        if (
            !router?.query?.categoryName &&
            !router?.query?.minPrice &&
            !router?.query?.maxPrice &&
            !router?.query?.menuType &&
            !router?.query?.search &&
            !brandQueryValue &&
            !categoryQueryValue &&
            !strainTypeQueryValue &&
            !router?.query?.special_id
        ) {
            applyFilter();
        }
        if (brandQueryValue) {
            setFilterData((prevState) => ({ ...prevState, brandIdValue: brandQueryValue }));
            dispatch(setBrandQueryValue(""));
        }
        if (categoryQueryValue) {
            setFilterData((prevState) => ({ ...prevState, categoryValue: categoryQueryValue }));
            dispatch(setCategoryQueryValue(""));
        }
        if (strainTypeQueryValue) {
            setFilterData((prevState) => ({ ...prevState, strainTypeValue: strainTypeQueryValue }));
            dispatch(setStrainTypeQueryValue(""));
        }

        if (router?.query?.special_id) {
            setFilterData((prevState) => ({ ...prevState, dailyDealsValue: router?.query?.special_id }));
            // dispatch(setStrainTypeQueryValue(""));
        }
        // strainTypeValue
    }, [router.query?.categoryName, router?.query?.search, router?.query?.special_id]);

    useDidMountEffect(() => {
        offsetKey.current = 0;
        if (routeCategory.current) {
            routeCategory.current = "";
        }

        if (!searchInit.current) {
            if (search.current) {
                search.current = "";
                setSearchKey("");
            }
            applyFilter();
        }
    }, [filterData]);

    useDidMountEffect(() => {
        applyFilter();
    }, [sortKey]);

    useDidMountEffect(() => {
        filterBrand();
    }, [brandFilterValue]);

    useDidMountEffect(() => {
        clearAllFilter();
        getProductVariants();
    }, [selectedRetailer]);

    useEffect(() => {
        if (result?.data !== undefined) {
            if (result?.data?.length > 0) {
                dispatch(setAllRetailer(result?.data));
                localStorage.setItem("all_retailer", JSON.stringify(result?.data));
            }
        }
    }, [result]);


    const handlePickupDataGet = () => {
        getRetailer("PICKUP");
        localStorage.setItem("retailer_type", JSON.stringify("pickup"));
        dispatch(setRetailerType("pickup"));
    };

    const [specials, setSpecials] = useState([]);

    async function getSpecialOffers() {
        try {
        let data = {
            retailerId: selectedRetailer?.id,
        };
        // dispatch(setSiteLoader(true));
        let response = await postData(api.product.getSpecialOffers, data);
        if (response.status == 200) {
            setSpecials(response.data.specials);
        }
        } catch (error) {
        console.log(error);
        } finally {
        // dispatch(setSiteLoader(false));
        }
    }

    useEffect(() => {
        getSpecialOffers();
    }, [selectedRetailer?.id]);

    return (
        <>
            {
                <div className="">
                    <section className="container">
                        <div className="row">
                            <div className="col-lg-3">
                                <div
                                    className={`offcanvas-lg z-index-2000 offcanvas-start ${toggleViewMode ? "show" : ""
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
                                            <div className="d-flex justify-content-between align-items-center mb-3" style={{ margin: "0px 18px 0px 18px" }}>
                                                <p className="ff-Soleil400 fs-16 fw-bold mb-0">Filter Products</p>
                                                <p onClick={clearAllFilter} className="fs-14 mb-0 cp"><RiFilterOffLine style={{ marginTop: "-2px", marginRight: "2px" }} /><span className="align-middle">Clear Filter</span></p>
                                            </div>
                                            <div
                                                className="accordion"
                                                id="accordionPanelsStayOpenExample"
                                            >
                                                <div className="accordion-item border-0">
                                                    <div
                                                        className="accordion-header"
                                                        id="panelsStayOpen-headingSeven"
                                                    >
                                                        <div className={styles.section_accordionButton}>
                                                            <button
                                                                className="accordion-button shadow-none"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#panelsStayOpen-collapseSeven"
                                                                aria-expanded="true"
                                                                aria-controls="panelsStayOpen-collapseSeven"
                                                            >
                                                                <p className="my-auto fs-16 fw-bold">
                                                                    Price
                                                                </p>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div
                                                        id="panelsStayOpen-collapseSeven"
                                                        className="accordion-collapse collapse show"
                                                        aria-labelledby="panelsStayOpen-headingNine"
                                                    >
                                                        <div className="">
                                                            <div className={styles.scrollable_section}>
                                                                <div className="accordion-body p-2 mx-3">
                                                                    <div className="d-flex justify-content-between align-items-center">

                                                                        {/* <Range
                                                                            values={filterData.priceValue}
                                                                            step={STEP}
                                                                            min={priceMin}
                                                                            max={priceMax}
                                                                            rtl={rtl}
                                                                            onChange={(values) => {
                                                                                setFilterData((prevValue) => ({
                                                                                    ...prevValue,
                                                                                    priceValue: values,
                                                                                }));
                                                                            }}
                                                                            renderTrack={({ props, children }) => (
                                                                                <div
                                                                                    onMouseDown={props.onMouseDown}
                                                                                    onTouchStart={props.onTouchStart}
                                                                                    style={{
                                                                                        ...props.style,
                                                                                        height: "35px",
                                                                                        display: "flex",
                                                                                        width: "100%",
                                                                                    }}
                                                                                >
                                                                                    <div
                                                                                        ref={props.ref}
                                                                                        style={{
                                                                                            height: "7px",
                                                                                            width: "100%",
                                                                                            borderRadius: "4px",
                                                                                            background: getTrackBackground({
                                                                                                values: filterData.priceValue,
                                                                                                colors: ["#ccc", "#000", "#ccc"],
                                                                                                min: priceMin,
                                                                                                max: priceMax,
                                                                                                rtl,
                                                                                            }),
                                                                                            alignSelf: "center",
                                                                                        }}
                                                                                    >
                                                                                        {children}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            renderThumb={({ props, isDragged }) => (
                                                                                <div
                                                                                    {...props}
                                                                                    style={{
                                                                                        ...props.style,
                                                                                        height: "12px",
                                                                                        width: "12px",
                                                                                        borderRadius: "50%",
                                                                                        backgroundColor: "#000",
                                                                                        display: "flex",
                                                                                        justifyContent: "center",
                                                                                        border: "2px solid #000",
                                                                                        alignItems: "center",
                                                                                        boxShadow: "0px 2px 6px #AAA",
                                                                                    }}
                                                                                ></div>
                                                                            )}
                                                                        /> */}

                                                                        <div>
                                                                            <p className="my-auto ff-Soleil400 fs-14">
                                                                                $
                                                                                {filterData?.priceValue[0]}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="my-auto ff-Soleil400 fs-14">
                                                                                $
                                                                                {filterData.priceValue[1]}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <input className="w-100" type="range" id="price_range" min={0} max={500} step={10} value={filterData.priceValue[1]} onChange={(e) => { handlePriceValue(e) }} />


                                                                    
                                                                    {/* <div className='d-flex justify-content-between'>
                                                                <p className='fs-12 my-auto'>$0</p>
                                                                <p className=' fs-12 my-auto'>$300</p>
                                                            </div>
                                                            <div className="progress rounded-pill w-100" style={{ height: '12px' }}>
                                                                <div className="progress-bar rounded-pill bg-site-black" role="progressbar"
                                                                    aria-label="Basic example" style={{ width: `50%` }}
                                                                    aria-valuenow={100} aria-valuemin="0"
                                                                    aria-valuemax="100"></div>
                                                            </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className={`mx-3 my-3 ${styles.customHr}`} />

                                                {/* menutype */}
                                                {/* {menuTypeList.length > 0 ? (
                                                    <>
                                                        <div className="accordion-item border-0">
                                                            <div
                                                                className="accordion-header"
                                                                id="panelsStayOpen-headingEleven"
                                                            >
                                                                <div className={styles.section_accordionButton}>
                                                                    <button
                                                                        className="accordion-button shadow-none"
                                                                        type="button"
                                                                        data-bs-toggle="collapse"
                                                                        data-bs-target="#panelsStayOpen-collapseEleven"
                                                                        aria-expanded="false"
                                                                        aria-controls="panelsStayOpen-collapseEleven"
                                                                    >
                                                                        <p className="my-auto fs-16 fw-bold">
                                                                            Menu Types
                                                                        </p>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div
                                                                id="panelsStayOpen-collapseEleven"
                                                                className="accordion-collapse collapse show"
                                                                aria-labelledby="panelsStayOpen-headingEleven"
                                                            >
                                                                <div className="">
                                                                    {menuTypeList?.map((el, index) => (
                                                                        <div
                                                                            className="form-check mt-2 fs-14 d-flex align-items-center"
                                                                            key={index}
                                                                        >
                                                                            <label className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}>
                                                                                <input
                                                                                    className="me-2"
                                                                                    type="radio"
                                                                                    name="menuTypeValue"
                                                                                    id={"flexRadioDefault" + el}
                                                                                    checked={
                                                                                        filterData.menuTypeValue === el
                                                                                    }
                                                                                    value={el}
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
                                                        <hr className={`mx-3 my-3 ${styles.customHr}`} />
                                                    </>
                                                ) : (
                                                    <></>
                                                )} */}

                                                {/* strain type */}
                                                {strainTypeList?.length > 0 ? (
                                                    <>
                                                        <div className="accordion-item border-0">
                                                            <div
                                                                className="accordion-header"
                                                                id="panelsStayOpen-headingTen"
                                                            >
                                                                <div className={styles.section_accordionButton}>
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
                                                                                clearFilter("strain");
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
                                                                    {strainTypeList?.map((el, index) => (
                                                                        <div
                                                                            className="form-check mt-2 fs-14 d-flex align-items-center"
                                                                            key={index}
                                                                        >
                                                                            <label className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}>
                                                                                <input
                                                                                    className="me-2"
                                                                                    type="radio"
                                                                                    name="strainTypeValue"
                                                                                    id={"flexRadioDefault" + el}
                                                                                    checked={
                                                                                        filterData.strainTypeValue === el
                                                                                    }
                                                                                    value={el}
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
                                                        <hr className={`mx-3 my-3 ${styles.customHr}`} />
                                                    </>
                                                ) : (
                                                    <></>
                                                )}

                                                {/* brand */}
                                                {brandList?.length > 0 ||
                                                    brandFilterInit.current == false ? (
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
                                                                                clearFilter("brands");
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
                                                                        className={`d-flex justify-content-center align-items-center border border-1 border-dark rounded-pill ${styles.brandSearch}`}>
                                                                        <picture>
                                                                            <img src="../../images/ssc.png"
                                                                                className="ms-2 mb-1" alt="JARS Cannabis" title="JARS Cannabis" />
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
                                                                                        htmlFor={"flexRadioDefault" + el.id}
                                                                                        className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}
                                                                                    >
                                                                                        <input
                                                                                            className="me-2 brands"
                                                                                            type="radio"
                                                                                            name="brandIdValue"
                                                                                            id={"flexRadioDefault" + el.id}
                                                                                            checked={
                                                                                                el.id ===
                                                                                                filterData.brandIdValue
                                                                                            }
                                                                                            value={el.id}
                                                                                            onChange={handleFilter}
                                                                                        />
                                                                                        <span
                                                                                            className="checkmark"></span>
                                                                                        {el.name}
                                                                                    </label>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        {/* <div className=''>
                                                            <div className="collapse" id="collapseExampleBrands">
                                                                <div className=''>
                                                                    {productInfo.strain_types?.slice(5).map((strain_types, index) => (
                                                                        <div className="form-check mt-2 fs-12 d-flex align-items-center">
                                                                            <input
                                                                                className="me-2"
                                                                                type="radio"
                                                                                name="flexRadioDefault"
                                                                                id={"flexRadioDefault" + index}
                                                                            />
                                                                            <label className="form-check-label">
                                                                                {strain_types.name}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                                        {/* <div className='mt-2'>
                                                            <button onClick={handleBrandToggle} className="fs-16 bg-transparent border-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExampleBrands" aria-expanded="false" aria-controls="collapseExampleBrands">
                                                                {seeBrandText}
                                                            </button>
                                                        </div> */}
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
                                                            <p className="my-auto fs-16 fw-bold">
                                                                Potency
                                                            </p>
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
                                                            <input className="w-100" type="range" min={0} max={100} step={1} value={filterData.potencyValue[1]} onChange={(e) => { handlePotencyThcChange(e) }} />
                                                            {/* <Range
                                                                values={filterData.potencyValue}
                                                                step={STEP}
                                                                min={MIN}
                                                                max={MAX}
                                                                rtl={rtl}
                                                                onChange={(values) => {
                                                                    setFilterData((prevValue) => ({
                                                                        ...prevValue,
                                                                        potencyValue: values,
                                                                    }));
                                                                }}
                                                                renderTrack={({ props, children }) => (
                                                                    <div
                                                                        onMouseDown={props.onMouseDown}
                                                                        onTouchStart={props.onTouchStart}
                                                                        style={{
                                                                            ...props.style,
                                                                            height: "35px",
                                                                            display: "flex",
                                                                            width: "100%",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            ref={props.ref}
                                                                            style={{
                                                                                height: "7px",
                                                                                width: "100%",
                                                                                borderRadius: "4px",
                                                                                background: getTrackBackground({
                                                                                    values: filterData.potencyValue,
                                                                                    colors: ["#ccc", "#000", "#ccc"],
                                                                                    min: MIN,
                                                                                    max: MAX,
                                                                                    rtl,
                                                                                }),
                                                                                alignSelf: "center",
                                                                            }}
                                                                        >
                                                                            {children}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                renderThumb={({ props, isDragged }) => (
                                                                    <div
                                                                        {...props}
                                                                        style={{
                                                                            ...props.style,
                                                                            height: "20px",
                                                                            width: "20px",
                                                                            borderRadius: "50%",
                                                                            backgroundColor: "#FFF",
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            border: "2px solid #000",
                                                                            alignItems: "center",
                                                                            boxShadow: "0px 2px 6px #AAA",
                                                                        }}
                                                                    ></div>
                                                                )}
                                                            /> */}
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
                                                            <input className="w-100" type="range" min={0} max={100} step={1} value={filterData.potencyCbdValue[1]} onChange={(e) => { handlePotencyCbdChange(e) }} />
                                                            {/* <Range
                                                                values={filterData.potencyCbdValue}
                                                                step={STEP}
                                                                min={MIN}
                                                                max={MAX}
                                                                rtl={rtl}
                                                                onChange={(values) => {
                                                                    setFilterData((prevValue) => ({
                                                                        ...prevValue,
                                                                        potencyCbdValue: values,
                                                                    }));
                                                                }}
                                                                renderTrack={({ props, children }) => (
                                                                    <div
                                                                        onMouseDown={props.onMouseDown}
                                                                        onTouchStart={props.onTouchStart}
                                                                        style={{
                                                                            ...props.style,
                                                                            height: "35px",
                                                                            display: "flex",
                                                                            width: "100%",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            ref={props.ref}
                                                                            style={{
                                                                                height: "7px",
                                                                                width: "100%",
                                                                                borderRadius: "4px",
                                                                                background: getTrackBackground({
                                                                                    values: filterData.potencyCbdValue,
                                                                                    colors: ["#ccc", "#000", "#ccc"],
                                                                                    min: MIN,
                                                                                    max: MAX,
                                                                                    rtl,
                                                                                }),
                                                                                alignSelf: "center",
                                                                            }}
                                                                        >
                                                                            {children}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                renderThumb={({ props, isDragged }) => (
                                                                    <div
                                                                        {...props}
                                                                        style={{
                                                                            ...props.style,
                                                                            height: "20px",
                                                                            width: "20px",
                                                                            borderRadius: "50%",
                                                                            backgroundColor: "#FFF",
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            border: "2px solid #000",
                                                                            alignItems: "center",
                                                                            boxShadow: "0px 2px 6px #AAA",
                                                                        }}
                                                                    ></div>
                                                                )}
                                                            /> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className={`mx-3 my-3 ${styles.customHr}`} />

                                                {/* weightList */}
                                                {filterData?.categoryValue && weightList?.length > 0 ? (
                                                    <>
                                                        <div className="accordion-item border-0">
                                                            <div
                                                                className="accordion-header"
                                                                id="panelsStayOpen-headingFive"
                                                            >
                                                                <div className={styles.section_accordionButton}>
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
                                                                                clearFilter("weight");
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
                                                                            {weightList?.map((el, index) => (
                                                                                <div className="col-6" key={index}>
                                                                                    <div className="">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className="btn-check weights"
                                                                                            name="weightsValue"
                                                                                            id={"danger-outlined" + index}
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
                                                                                                "danger-outlined" + index
                                                                                            }
                                                                                        >
                                                                                            {el}
                                                                                        </label>
                                                                                    </div>
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

                                                {/* categoryList */}
                                                {categoryList?.length > 0 ? (
                                                    <>
                                                        <div className="accordion-item border-0">
                                                            <div
                                                                className="accordion-header"
                                                                id="panelsStayOpen-headingTwo"
                                                            >
                                                                <div className={styles.section_accordionButton}>
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
                                                                    {filterData.categoryValue &&
                                                                        filterData.categoryValue != "N/A" ? (
                                                                        <button
                                                                            className={`bg-transparent border-0 ${styles.clear_button_subcat}`}
                                                                            onClick={() => {
                                                                                clearFilter("category");
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
                                                                            {categoryList?.map((el, index) => (
                                                                                <div
                                                                                    className="form-check mt-2 fs-14 d-flex align-items-center"
                                                                                    key={index}
                                                                                >
                                                                                    <label
                                                                                        htmlFor={"flexRadioDefault" + el}
                                                                                        className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}
                                                                                    >
                                                                                        <input
                                                                                            className="me-2"
                                                                                            type="radio"
                                                                                            name="categoryValue"
                                                                                            id={"flexRadioDefault" + el}
                                                                                            value={el}
                                                                                            onChange={handleFilter}
                                                                                            checked={
                                                                                                el == filterData.categoryValue
                                                                                            }
                                                                                        />
                                                                                        <span
                                                                                            className="checkmark"></span>
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

                                                {/* subCategoryList */}
                                                {(filterData?.categoryValue && subCategoryList?.length > 0) ? (
                                                    <>
                                                        <div className="accordion-item border-0">
                                                            <div
                                                                className="accordion-header"
                                                                id="panelsStayOpen-headingThree"
                                                            >
                                                                <div className={styles.section_accordionButton}>
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
                                                                                clearFilter("subCategory");
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
                                                                    <div className={styles.scrollable_section}>
                                                                        <div>
                                                                            {subCategoryList.map((el, index) => (
                                                                                <div
                                                                                    className="form-check mt-2 fs-14 d-flex align-items-center"
                                                                                    key={index}
                                                                                >
                                                                                    <label
                                                                                        htmlFor={"flexRadioDefault" + el}
                                                                                        className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}
                                                                                    >
                                                                                        <input
                                                                                            className="me-2 subCategoryValue"
                                                                                            type="radio"
                                                                                            name="subCategoryValue"
                                                                                            value={el}
                                                                                            id={"flexRadioDefault" + el}
                                                                                            checked={
                                                                                                el ===
                                                                                                filterData.subCategoryValue
                                                                                            }
                                                                                            onChange={handleFilter}
                                                                                        />

                                                                                        <span
                                                                                            className="checkmark"></span>
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

                                                {/* effectsList */}
                                                {effectsList?.length > 0 ? (
                                                    <>
                                                        <div className="accordion-item border-0">
                                                            <div
                                                                className="accordion-header"
                                                                id="panelsStayOpen-headingEight"
                                                            >
                                                                <div className={styles.section_accordionButton}>
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
                                                                                clearFilter("effect");
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
                                                                            {effectsList?.map((el, index) => (
                                                                                <div
                                                                                    className="form-check mt-2 fs-14"
                                                                                    key={index}
                                                                                >
                                                                                    <input
                                                                                        className="form-check-input shadow-none border border-dark"
                                                                                        type="checkbox"
                                                                                        name="effectsValue"
                                                                                        id={"flexRadioDefault" + el}
                                                                                        value={el}
                                                                                        checked={filterData.effectsValue.includes(
                                                                                            el
                                                                                        )}
                                                                                        onChange={handleEffectCheckbox}
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={"flexRadioDefault" + el}
                                                                                        className={`form-check-label ff-Soleil400 fs-14 ${styles.customLabel}`}
                                                                                    >
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

                                                {/* categoryList */}
                                                {categoryList?.length > 0 ? (
                                                    <>
                                                        <div className="accordion-item border-0">
                                                            <div
                                                                className="accordion-header"
                                                                id="panelsStayOpen-headingTwo"
                                                            >
                                                                <div className={styles.section_accordionButton}>
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
                                                                                clearFilter("customMenu");
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

                                                                                        htmlFor={
                                                                                            "custom-menu" + index
                                                                                        }
                                                                                        className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}
                                                                                    >
                                                                                        <input
                                                                                            className="me-2"
                                                                                            type="radio"
                                                                                            name="customMenuValue"
                                                                                            id={"custom-menu" + index}
                                                                                            value={el}
                                                                                            checked={filterData.customMenuValue == el}
                                                                                            onChange={handleFilter}

                                                                                        />
                                                                                        <span
                                                                                            className="checkmark"></span>
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

                                                {/* Today's Specials */}

                                                {specials?.length > 0 ||
                                                    brandFilterInit.current == false ? (
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
                                                                            Today's Specials
                                                                        </p>
                                                                    </button>
                                                                    {filterData.dailyDealsValue ? (
                                                                        <button
                                                                            className={`bg-transparent border-0 ${styles.clear_button_subcat}`}
                                                                            onClick={() => {
                                                                                clearFilter("dailyDeals");
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
                                                                            {specials?.map((el, index) => (
                                                                                <div
                                                                                    className="form-check mt-2 fs-12 d-flex align-items-center"
                                                                                    key={index}
                                                                                >
                                                                                    <label
                                                                                        htmlFor={"dailyDeals" + el.id}
                                                                                        className={`containerr ff-Soleil400 fs-14 ${styles.customLabel}`}
                                                                                    >
                                                                                        <input
                                                                                            className="me-2 brands"
                                                                                            type="radio"
                                                                                            name="dailyDealsValue"
                                                                                            id={"dailyDeals" + el.id}
                                                                                            checked={
                                                                                                el.id ===
                                                                                                filterData.dailyDealsValue
                                                                                            }
                                                                                            value={el.id}
                                                                                            onChange={handleFilter}
                                                                                        />
                                                                                        <span
                                                                                            className="checkmark"></span>
                                                                                        {el.name}
                                                                                    </label>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        {/* <div className=''>
                                                            <div className="collapse" id="collapseExampleBrands">
                                                                <div className=''>
                                                                    {productInfo.strain_types?.slice(5).map((strain_types, index) => (
                                                                        <div className="form-check mt-2 fs-12 d-flex align-items-center">
                                                                            <input
                                                                                className="me-2"
                                                                                type="radio"
                                                                                name="flexRadioDefault"
                                                                                id={"flexRadioDefault" + index}
                                                                            />
                                                                            <label className="form-check-label">
                                                                                {strain_types.name}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                                        {/* <div className='mt-2'>
                                                            <button onClick={handleBrandToggle} className="fs-16 bg-transparent border-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExampleBrands" aria-expanded="false" aria-controls="collapseExampleBrands">
                                                                {seeBrandText}
                                                            </button>
                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr className={`mx-3 my-3 ${styles.customHr}`} />
                                                    </>
                                                ) : (
                                                    <></>
                                                )}

                                                {/* <div className="accordion-item border-0">
                                                    <div
                                                        className="accordion-header"
                                                        id="panelsStayOpen-headingTwelve"
                                                    >
                                                        <div className={styles.section_accordionButton}>
                                                            <button
                                                                className="accordion-button shadow-none"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#panelsStayOpen-collapseTwelve"
                                                                aria-expanded="false"
                                                                aria-controls="panelsStayOpen-collapseTwelve"
                                                            >
                                                                <p className="my-auto fs-16 fw-bold">
                                                                    Custome Menus
                                                                </p>
                                                            </button>
                                                            {filterData.customMenuValue ? (
                                                                <button
                                                                    className={`bg-transparent border-0 ${styles.clear_button_subcat}`}
                                                                    onClick={() => {
                                                                        clearFilter("customMenu");
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
                                                        id="panelsStayOpen-collapseTwelve"
                                                        className="accordion-collapse collapse show"
                                                        aria-labelledby="panelsStayOpen-headingTwelve"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className={styles.scrollable_section}>
                                                                <div className="">
                                                                    {
                                                                        customMenus.map((el, index) => {
                                                                            return (
                                                                                <div className="w-100 my-3">
                                                                                    <input
                                                                                        type="radio"
                                                                                        className="w-100 btn-check weights"
                                                                                        name="customMenuValue"
                                                                                        id={"custom-menu" + index}
                                                                                        value={el}
                                                                                        checked={filterData.customMenuValue == el}
                                                                                        onChange={handleFilter}
                                                                                    />
                                                                                    <label
                                                                                        className="btn btn-outline-dark rounded-pill w-100 text-nowrap fs-12 py-2 ff-Soleil400"
                                                                                        htmlFor={
                                                                                            "custom-menu" + index
                                                                                        }
                                                                                    >
                                                                                        {el}
                                                                                    </label>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className={`mx-3 my-3 ${styles.customHr}`} /> */}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`col-12 col-md-12 col-lg-9 ${styles.borderStart}`}
                            >
                                <div className="d-flex flex-column flex-lg-row justify-content-between mt-2">
                                    <div className="d-flex justify-content-center align-items-center gap-2">
                                        <div className="">
                                            <input
                                                type="checkbox"
                                                className="btn-check weights"
                                                name="weightsValue"
                                                id={"tabCategory"}
                                                value={categories[0]?.category}
                                                checked={
                                                    filterData.categoryValue === categories[0]?.category
                                                }
                                                onChange={handleTabCategoryCheckBox}
                                            />
                                            <label
                                                className={`btn rounded-pill bg-tansparent border border-2 fs-14 border-dark fw-bold px-4 ${styles.customCheck}`}
                                                htmlFor={"tabCategory"}
                                            >
                                                {categories?.length > 0 &&
                                                    toTitleCase(categories[0]?.category)}
                                            </label>
                                        </div>
                                        <div className="">
                                            <button
                                                onClick={handlePickupDataGet}
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#offcanvasExampleLeft"
                                                aria-controls="offcanvasExampleLeft"
                                                className="btn rounded-pill bg-tansparent border border-2 fs-14 fs-md-10 border-dark fw-bold px-3 px-lg-4 text-nowrap"
                                            >
                                                Curbside Pickup
                                            </button>
                                        </div>
                                        <div className="">
                                            <div className="d-block nav-item dropdown">
                                                <button
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                    data-bs-display="static"
                                                    className="btn rounded-pill bg-tansparent border border-2 fs-14 fs-md-10 border-dark fw-bold px-2 px-lg-4"
                                                >
                                                    <span className="align-middle">Product Type</span>
                                                    <AiOutlineRight className="ms-1 fw-bold" />
                                                    {/* <span className="align-middle">{(filterData.menuTypeValue && filterData.menuTypeValue != 'N/A') ? toTitleCase(filterData.menuTypeValue) : 'Product Type'}</span>
                                                    <AiOutlineRight className="ms-1 fw-bold" /> */}
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
                                                    {/* {categoryList?.map((el, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <Link
                                                                    className="dropdown-item"
                                                                    href="javascript:void(0)"
                                                                    onClick={() => {
                                                                        handleCategoryDropdownSelection(el);
                                                                    }}
                                                                >
                                                                    {toTitleCase(el)}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })} */}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSearch}>
                                        <div
                                            className={`d-flex border border-2 border-dark rounded-pill mt-3 mt-lg-0 ${styles.customSearchBox}`}>
                                            <picture>
                                                <img src="../../images/ssc.png" className="ms-2"
                                                    style={{ marginTop: "1px" }} alt="JARS Cannabis" title="JARS Cannabis" />
                                            </picture>
                                            <input
                                                ref={divRef}
                                                type="search"
                                                autoComplete="off"
                                                className={`form-control fs-12 shadow-none bg-transparent ${styles.customInputForm}`}
                                                placeholder="Search"
                                                aria-label="Search here"
                                                aria-describedby="Search-addon2"
                                                value={searchKey}
                                                id="searchInput"
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
                                                                    totalProducts > 0 ? "border-bottom" : ""
                                                                }
                                                            >
                                                                <div className="py-2">
                                                                    {sugData.map((x) => (
                                                                        <p
                                                                            className="fs-14"
                                                                            key={x.id}
                                                                            style={{ cursor: "pointer" }}
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
                                                                    totalProducts > 0 ? "border-bottom" : ""
                                                                }
                                                            >
                                                                <div className="py-2">
                                                                    {brands.map((brand, index) => (
                                                                        <p
                                                                            className="fs-14 fw-bold"
                                                                            key={index}
                                                                            style={{ cursor: "pointer" }}
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
                                                                <div
                                                                    key={index}
                                                                    className="border-bottom"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() =>
                                                                        handleDetailsPage(x.productSlug)
                                                                    }
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
                                                                </div>
                                                            ))}
                                                            <div className="mt-3">
                                                                <div className="text-center">
                                                                    {totalProducts > 0 ? (
                                                                        <button
                                                                            className="bg-transparent border-0 fs-md-12"
                                                                            onClick={() => handleSearchSug(searchKey)}
                                                                        >
                                                                            View All{" "}
                                                                            <span className="fw-bold">
                                                                                {totalProducts}
                                                                            </span>{" "}
                                                                            Products
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="bg-transparent border-0 fs-md-12">
                                                                            No products found!
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </form>
                                </div>
                                <div className="d-flex flex-row justify-content-between my-3">
                                </div>
                                <div className="d-flex justify-content-between gap-2">
                                    <div className="d-block d-lg-none">
                                        <li className="d-block nav-item dropdown">
                                            <a
                                                type="button"
                                                onClick={() => setToggleViewMode(!toggleViewMode)}
                                            >
                                                <p className="fs-14 px-3 py-1">
                                                    <BiFilterAlt className="fs-16 my-auto" />
                                                    Filter
                                                </p>
                                            </a>
                                        </li>
                                    </div>
                                    <div className="d-none d-lg-block"></div>
                                    <div className="d-flex">
                                        <li className="d-block nav-item dropdown">
                                            <a
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                data-bs-display="static"
                                            >
                                                <p
                                                    className={`fs-14 py-1 fw-bold pe-none ${styles.filter_button}`}
                                                >
                                                    <span className="align-middle">
                                                        Sort By
                                                    </span>
                                                    <RxDividerVertical className="fs-24" />
                                                </p>
                                            </a>
                                            <a
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                data-bs-display="static"
                                            >
                                                <p className={`fs-14 py-1 fw-bold ${styles.filter_button}`}>
                                                    <span className="align-middle">
                                                        {featureByLabel ? featureByLabel : "Featured"}
                                                    </span>{" "}
                                                    <RiArrowDropDownLine className="fs-24" />
                                                </p>
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleFeature("Featured", {
                                                                direction: "DESC",
                                                                key: "POPULAR",
                                                            })
                                                        }
                                                    >
                                                        Popular
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("Low to high", {
                                                                direction: "ASC",
                                                                key: "PRICE",
                                                            })
                                                        }
                                                    >
                                                        Lowest Price
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("High to low", {
                                                                direction: "DESC",
                                                                key: "PRICE",
                                                            })
                                                        }
                                                    >
                                                        Highest Price
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("A to Z", {
                                                                direction: "ASC",
                                                                key: "NAME",
                                                            })
                                                        }
                                                    >
                                                        Name A-Z
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("Z to A", {
                                                                direction: "DESC",
                                                                key: "NAME",
                                                            })
                                                        }
                                                    >
                                                        Name Z-A
                                                    </Link>
                                                </li>
                                            </ul>
                                            {/* <ul className="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleFeature("popular", {
                                                                direction: "DESC",
                                                                key: "POPULAR",
                                                            })
                                                        }
                                                    >
                                                        Popular
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("Low to high", {
                                                                direction: "ASC",
                                                                key: "PRICE",
                                                            })
                                                        }
                                                    >
                                                        Lowest Price
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("High to low", {
                                                                direction: "DESC",
                                                                key: "PRICE",
                                                            })
                                                        }
                                                    >
                                                        Highest Price
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("A to Z", {
                                                                direction: "ASC",
                                                                key: "NAME",
                                                            })
                                                        }
                                                    >
                                                        Name A-Z
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("Z to A", {
                                                                direction: "DESC",
                                                                key: "NAME",
                                                            })
                                                        }
                                                    >
                                                        Name Z-A
                                                    </Link>
                                                </li>
                                            </ul> */}
                                        </li>

                                        {/* <li className="d-block nav-item dropdown">
                                            <a
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                data-bs-display="static"
                                            >
                                                <p className={`fs-14 py-1 fw-bold ${styles.filter_button}`}>
                                                    <span className="align-middle">
                                                        {featureByLabel ? featureByLabel :"Featured"}
                                                    </span>{" "}
                                                    <RiArrowDropDownLine className="fs-24" />
                                                </p>
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleFeature("popular", {
                                                                direction: "DESC",
                                                                key: "POPULAR",
                                                            })
                                                        }
                                                    >
                                                        Popular
                                                    </Link>
                                                </li>
                                            </ul>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleFeature("maaz", {
                                                                direction: "DESC",
                                                                key: "POPULAR",
                                                            })
                                                        }
                                                    >
                                                        Popular
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("Low to high", {
                                                                direction: "ASC",
                                                                key: "PRICE",
                                                            })
                                                        }
                                                    >
                                                        Lowest Price
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("High to low", {
                                                                direction: "DESC",
                                                                key: "PRICE",
                                                            })
                                                        }
                                                    >
                                                        Highest Price
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("A to Z", {
                                                                direction: "ASC",
                                                                key: "NAME",
                                                            })
                                                        }
                                                    >
                                                        Name A-Z
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="javascript:void(0)"
                                                        onClick={() =>
                                                            handleSort("Z to A", {
                                                                direction: "DESC",
                                                                key: "NAME",
                                                            })
                                                        }
                                                    >
                                                        Name Z-A
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li> */}
                                    </div>
                                </div>
                                <hr className="my-auto" />
                                {!filterInit ? (
                                    <>
                                        {productList?.length > 0 ? (
                                            <>
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
                                                    <div className="row gy-5 gx-5">
                                                        {productList?.map((product, index) => (
                                                            <div
                                                                className="col-12 col-md-4 col-lg-4"
                                                                key={index}
                                                            >
                                                                <div className={`m-4 m-md-0 m-lg-4 ${styles.productCustomCard}`}>
                                                                    <div className="text-center">
                                                                        <picture
                                                                            onClick={() => {
                                                                                router.push(
                                                                                    `/product-details/${product.slug}`
                                                                                );
                                                                            }}
                                                                        >
                                                                            <img
                                                                                className="cp"
                                                                                src={product?.image}
                                                                                alt={product?.name}
                                                                                height={117}
                                                                                width={117}
                                                                            />
                                                                        </picture>
                                                                    </div>
                                                                    <div className="text-center mt-5 lh-15">
                                                                        <p className='fs-12 mb-2 ff-Soleil400 cp'
                                                                            onClick={() => setFilterData((prevState) => ({ ...prevState, brandIdValue: product?.brand?.id }))}
                                                                            style={{ color: "#212322" }}>{product?.brand?.name}</p>
                                                                        <div
                                                                            className="d-flex justify-content-center align-items-center"
                                                                            style={{ height: '40px' }}>
                                                                            <p
                                                                                onClick={() => {
                                                                                    router.push(
                                                                                        `/product-details/${product.slug}`
                                                                                    );
                                                                                }}
                                                                                className="w-75 fs-16 cp lh-20 ff-Soleil700 global_line_product_limit mb-0"
                                                                            >
                                                                                {product.name}
                                                                            </p>

                                                                        </div>

                                                                        {
                                                                            product?.variants?.length > 1 ? (
                                                                                <>
                                                                                    <select
                                                                                        onChange={(e) => {
                                                                                            handleProductVariants(e, index);
                                                                                        }}
                                                                                        className="mb-2"
                                                                                        style={{
                                                                                            border: "none",
                                                                                            textAlign: "center",
                                                                                            outline: "none",
                                                                                        }}
                                                                                    >
                                                                                        {product?.variants?.map((el, i) => {
                                                                                            return (
                                                                                                <option
                                                                                                    key={i}
                                                                                                    value={JSON.stringify({
                                                                                                        price:
                                                                                                            calculateProductPrice(el),
                                                                                                        weight: el.option,
                                                                                                    })}
                                                                                                >
                                                                                                    $
                                                                                                    {calculateProductPrice(el) +
                                                                                                        `/${el.option}`}
                                                                                                </option>
                                                                                            );
                                                                                        })}

                                                                                    </select>
                                                                                    <div className="text-center">
                                                                                        <p className="fs-12 text-gray-600">
                                                                                            {product?.variants?.length}{" "}
                                                                                            Varient Available
                                                                                        </p>
                                                                                    </div>
                                                                                </>
                                                                            ) : product?.variants[0]
                                                                                ?.specialPriceMed ||
                                                                                product?.variants[0]
                                                                                    ?.specialPriceRec ? (
                                                                                <h3 style={{ color: "#F5333F" }}
                                                                                    className="fs-16 text-center ff-Soleil700 mb-3">
                                                                                    Now $
                                                                                    {filterData.menuTypeValue == "MEDICAL"
                                                                                        ? product?.variants[0]
                                                                                            ?.specialPriceMed
                                                                                        : product?.variants[0]
                                                                                            ?.specialPriceRec}
                                                                                    <span
                                                                                        className="text-site-black fs-14 ff-Soleil700 ">
                                                                                        {" "}
                                                                                        <span
                                                                                            className="text-decoration-line-through">
                                                                                            $
                                                                                            {filterData.menuTypeValue ==
                                                                                                "MEDICAL"
                                                                                                ? product?.variants[0]?.priceMed
                                                                                                : product?.variants[0]
                                                                                                    ?.priceRec}
                                                                                        </span>
                                                                                        {" "}
                                                                                        | {product?.variants[0]?.option}
                                                                                    </span>
                                                                                </h3>
                                                                            ) : (
                                                                                <p className='fs-14'><span
                                                                                    className='text-dark fs-20'></span><span
                                                                                        className='text-danger fs-20'>{filterData.menuTypeValue == 'MEDICAL' ? product?.variants[0]?.specialPriceMed : product?.variants[0]?.specialPriceRec}</span>${filterData.menuTypeValue == 'MEDICAL' ? product?.variants[0]?.priceMed : product?.variants[0]?.priceRec} | {product?.variants[0]?.option}
                                                                                </p>

                                                                            )
                                                                        }
                                                                    </div>

                                                                    <div
                                                                        className="d-flex gap-3 justify-content-center">
                                                                        {existInWishlist(product) ? (
                                                                            <AiFillHeart
                                                                                className={`fs-24 text-center my-auto cp`}
                                                                                onClick={() => {
                                                                                    createToast(
                                                                                        "Item already added to wishlist.",
                                                                                        "info"
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
                                                                                        {product?.strainType != 'NOT_APPLICABLE' ? product?.strainType : 'N/A'}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className={`col-6 ${styles.right_col}`}
                                                                            >
                                                                                <div className="">
                                                                                    {product?.potencyThc?.formatted ?
                                                                                        <p
                                                                                            className={`fs-12 text-center ${styles.card_button_right} cp`}
                                                                                            onClick={() => setFilterData((prevState) => ({ ...prevState, potencyValue: [0, product?.potencyThc?.range[0]] }))}
                                                                                        >
                                                                                            THC {" "}
                                                                                            {product?.potencyThc?.formatted}
                                                                                        </p>
                                                                                        :
                                                                                        <p
                                                                                            className={`fs-12 text-center ${styles.card_button_right}`}
                                                                                        >
                                                                                            THC {" "}
                                                                                            {'N/A'}
                                                                                        </p>
                                                                                    }

                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        {product?.variants[0]?.specialPriceMed ||
                                                                            product?.variants[0]?.specialPriceRec ? (
                                                                            <div className="">
                                                                                {filterData.menuTypeValue ==
                                                                                    "RECREATIONAL" ? (
                                                                                    <p
                                                                                        className={`text-center text-white fs-12 mb-0 ${styles.card_button_bottom}`}
                                                                                    >
                                                                                        {calculateDiscountPercentage(
                                                                                            product?.variants[0].priceMed,
                                                                                            product?.variants[0]
                                                                                                .specialPriceMed
                                                                                        )}
                                                                                        % OFF
                                                                                    </p>
                                                                                ) : (
                                                                                    <p
                                                                                        className={`text-center text-white fs-12 mb-0 ${styles.card_button_bottom}`}
                                                                                    >
                                                                                        {calculateDiscountPercentage(
                                                                                            product?.variants[0].priceRec,
                                                                                            product?.variants[0]
                                                                                                .specialPriceRec
                                                                                        )}
                                                                                        % OFF
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </InfiniteScroll>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className="text-center fs-18 fw-bold mt-5"
                                                    role="alert"
                                                >
                                                    No product found!
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    skelitonArr.map((el, index) => {
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
                                    })
                                )}
                                {/* {
                                    (productList.length > 0) ?
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <ReactPaginate

                                                nextLabel={<AiOutlineRight />}
                                                onPageChange={handlePageClick}
                                                pageRangeDisplayed={3}
                                                marginPagesDisplayed={2}
                                                pageCount={pageCount}
                                                previousLabel={<AiOutlineLeft />}
                                                pageClassName="page-item"
                                                pageLinkClassName="page-link"
                                                previousClassName="page-item"
                                                previousLinkClassName="page-link"
                                                nextClassName="page-item"
                                                nextLinkClassName="page-link"
                                                breakLabel="..."
                                                breakClassName="page-item"
                                                breakLinkClassName="page-link"
                                                containerClassName="pagination"
                                                activeClassName="active"
                                                renderOnZeroPageCount={null}
                                                forcePage={currentPage.current}
                                            />
                                        </div>
                                        : <></>
                                } */}
                            </div>
                        </div>
                    </section>
                </div>
            }
        </>
    );
}
