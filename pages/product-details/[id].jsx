import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import detailInfo from '../../cms-data/detailCms'
import styles from '../../styles/Products.module.css'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiTwotoneStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import { GoLocation } from "react-icons/go";
import { RiWallet3Line } from "react-icons/ri";
import { AiOutlineHeart } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io"
import { AiFillCaretRight } from "react-icons/ai"
import { FiArrowUpRight, FiChevronRight, FiChevronLeft, } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import Banner from '../../components/Banner';
import Banner_two from '../../components/BannerTwo';
import Slider_one from '../../components/SliderOne';
import Slider_two from '../../components/SliderTwo';
import { fetchData, postData } from '../../utils/FetchApi';
import api from "../../config/api.json";
import parse from 'html-react-parser';
import { useSelector, useDispatch } from 'react-redux';
import { setSiteLoader, setBrandQueryValue, setCategoryQueryValue, setStrainTypeQueryValue, setCurrentSpecialOffer } from '../../redux/global_store/globalReducer';
// import MultiRangeSlider from "multi-range-slider-react";
import { addItemToCart } from "../../redux/cart_store/cartReducer";
import { createToast } from '../../utils/toast';
import Swal from 'sweetalert2';
import { createCheckout, showLoader } from '../../utils/helper';
import { setCheckoutId } from '../../redux/global_store/globalReducer';
import useDidMountEffect from '../../custom-hook/useDidMount';
import { Rating } from 'react-simple-star-rating';
import BannerRelatedProduct from '../../components/BannerRelatedProduct';
import SliderHowToEnjoy from '../../components/SliderHowToEnjoy';
import { useGetDiscoverCmsQuery, useGetReserveTimeCmsQuery, useGetDiscoverHighlightsComponentUIContentMutation, useGetCartPageCmsQuery } from '../../redux/api_core/apiCore';
import Skeleton from 'react-loading-skeleton';
import { addToWishlist } from '../../redux/wishlist_store/wishlistReducer'
import SliderRelatedProduct from '../../components/SliderRelatedProduct';
import HeaderTitles from '../../components/HeaderTitles';
import { toTitleCase } from "../../utils/helper";
import Head from 'next/head';
import Link from "next/link";
import Loader from '../../components/Loader';
import HandleSelectDefaultRetailer from '../../components/HandleSelectDefaultRetailer';
import { viewItemForSeo, addToCartItemForSeo } from "../../utils/seoInformations"
function Details() {
    const router = useRouter();
    const { id } = router?.query;
    let dispatch = useDispatch();
    const { selectedRetailer, checkoutId, pageMeta, currentSpecialOffer, menuTypeValue } = useSelector((state) => (state.globalStore));
    const { wishlist } = useSelector(store => (store.wishlistStore));

    const discoverCms = useGetDiscoverCmsQuery();
    const reserveTimeCms = useGetReserveTimeCmsQuery();

    const { data, isSuccess, isFetching, error } = useGetCartPageCmsQuery();
    let Cartdata = data?.data[0];

    const [counter, updateCounter] = useState(1);
    const [typeSelected, setTypeSelected] = useState('RECREATIONAL');
    const [productList, setProductList] = useState([]);
    const [details, setDetails] = useState([]);
    const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    let productCount = useRef(0);
    const [review, setReview] = useState();
    const [selectedOption, setSelectedOption] = useState({});
    const [selectedWeight, setSelectedWeight] = useState("");
    const [productMetaTitles, setProductMetaTitles] = useState("");
    const [productMetaDescriptions, setProductMetaDescriptions] = useState("");
    const [productSchema, setProductSchema] = useState("");
    // const [menuTypeValue, setMenuTypeValue] = useState("RECREATIONAL");
    const [selectedOffer, setSelectedOffer] = useState("");

    // function toTitleCase(str) {
    //     return str.replace(/\w\S*/g, function (txt) {
    //         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    //     });
    // }

    //handle image
    const BigPreviewImage = ({ image }) => {
        return (
            <div>
                {image == null ?
                    <picture>
                        <Skeleton style={{ width: '100%', height: '450px' }} />
                    </picture>
                    :
                    <picture>
                        <img src={image} alt="Big Preview" className={styles.big_image} />
                    </picture>
                }
            </div>
        );
    };

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className="small_img_next"
                onClick={onClick}
            ><FiChevronRight /></div>
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className="small_img_previous"
                onClick={onClick}
            >
                <FiChevronLeft />
            </div>
        );
    }
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };

    const ImageSlider = () => {
        return (
            <Slider {...settings}>
                {details?.images?.map((image, index) => (
                    <div className='slider-item' key={index}>
                        <div className='me-2'>
                            <picture>
                                <img
                                    key={image.id}
                                    src={image.url}
                                    className={styles.small_icon_image}
                                    //    alt={image}
                                    // alt={image.description}
                                    onClick={() => setSelectedImage(image.url)}
                                />
                                {/* <img src="../../images/hero_bg.webp" className="w-100" height={50}/> */}
                            </picture>
                        </div>
                    </div>
                ))}
            </Slider>
        );
    };


    function handleIncrement() {
        updateCounter(counter + 1);
    }
    function handleDecrement() {
        if (counter > 1) {
            updateCounter(counter - 1);
        }
    }

    async function getProduct() {
        try {
            await fetchData(api.product.productService + id + '?retailerId=' + selectedRetailer?.id).then(response => {
                let data = response?.product;
                setSelectedOption(data?.variants[0]);
                setSelectedWeight(data?.variants[0].option);
                setSelectedImage(data?.image);
                setDetails(data);
            }).catch(error => {
                console.log(error);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function getProductMetaFormat() {
        try {
            await fetchData(api.product.productDetailsMeta).then(response => {
                let data = response?.data?.[0];
                if (data) {
                    let metaTitles = data?.metaTitles.replace(/\s*{{\s*|\s*}}\s*/g, '');
                    const titleKeys = metaTitles.split('|');
                    metaTitles = metaTitles.replace(/\|/g, ' | ');
                    titleKeys.forEach(x => {
                        let value = "";
                        if (typeof details[x] == 'object') {
                            value = details?.[x]?.name;
                        } else if (typeof details[x] == 'string') {
                            value = details?.[x];
                        }
                        metaTitles = metaTitles.replace(x, value?.toLowerCase() || '');
                    });
                    metaTitles = metaTitles.replace(/\s*\|\s*$/, '');
                    setProductMetaTitles(metaTitles);

                    let metaDescriptions = data?.metaDescriptions.replace(/\s*{{\s*|\s*}}\s*/g, '');
                    const descriptionKeys = metaDescriptions.split('-');
                    metaDescriptions = metaDescriptions.replace(/-/g, ' - ');
                    descriptionKeys.forEach(x => {
                        let value = "";
                        if (typeof details[x] == 'object') {
                            value = details?.[x]?.name;
                        } else if (typeof details[x] == 'string') {
                            value = details?.[x];
                        }
                        metaDescriptions = metaDescriptions.replace(x, value?.toLowerCase() || '');
                    });
                    metaDescriptions = metaDescriptions.replace(/\s*-\s*$/, '');
                    setProductMetaDescriptions(metaDescriptions);

                    let schema = data?.productSchema;
                    let schemaKeys = schema.match(/\s*{{\w+}}\s*/g);
                    schemaKeys = new Set(schemaKeys.map(x => x.replace(/\s*{{\s*|\s*}}\s*/g, '')));
                    schemaKeys.forEach(x => {
                        const regex = new RegExp(`{{\\s*${x}\\s*}}`, 'g');
                        let value = "";
                        if (x == 'sku') {
                            value = details.posMetaData?.[x];
                        } else if (typeof details[x] == 'object') {
                            value = details?.[x]?.name;
                        } else if (typeof details[x] == 'string') {
                            value = details?.[x];
                        }
                        schema = schema.replace(regex, value || '');
                    });
                    setProductSchema(schema);
                }
            }).catch(error => {
                console.log(error);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function getProductReview() {
        try {
            if (details?.id) {
                await fetchData(api.review.productReviewURL + '/' + details?.id).then(response => {
                    if (response?.statusCode == 200) {
                        setReview(response?.data);
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const hangleTypeChange = (type) => {
        setTypeSelected(type);
    }


    const handleVariants = (item) => {
        setSelectedOption(item);
        setSelectedWeight(item.option);
    }

    async function addToCart() {
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
        let processedItemData = {
            productId: details?.id,
            quantity: counter,
            option: selectedWeight
        }
        let filterCheckOutId = (createdId ? createdId : checkoutId);
        dispatch(addItemToCart({ itemData: processedItemData, checkoutId: filterCheckOutId, retailerId: selectedRetailer?.id }));
        setSelectedPriceIndex(0);
        updateCounter(1);
        addToCartItemForSeo(details, counter);

    }

    function calculateProductPrice(item) {
        if (menuTypeValue == 'RECREATIONAL') {
            if (item.specialPriceRec)
                return item.specialPriceRec;
            else
                return item.priceRec;

        }
        if (menuTypeValue == 'MEDICAL') {
            if (item.specialPriceMed)
                return item.specialPriceMed;
            else
                return item.priceMed;
        }
    }

    function calculateDiscountPercentage(orginalPrice, discountPrice) {
        let discount = 100 * ((orginalPrice - discountPrice) / orginalPrice);
        return parseInt(discount);
    }

    function handleWishlist(payLoad) {
        let data = { ...payLoad };
        if (data?.variants?.length > 1) {
            data.selectedPrice = calculateProductPrice(data.variants[0]);
            data.selectedWeight = data.variants[0].option;
            data.selectedVariants = JSON.stringify({ price: data.selectedPrice, weight: data.selectedWeight });
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

    const [discoverHighlightsComponentUI, setDiscoverHighlightsComponentUI] = useState({
        discoverSectionBackgroundColor: ''
    });

    const [getDiscoverHighlightsComponentUI] = useGetDiscoverHighlightsComponentUIContentMutation();

    const callDiscoverHighlightsComponentUI = async () => {
        const { data } = await getDiscoverHighlightsComponentUI({});
        if (data?.data) {
            setDiscoverHighlightsComponentUI(data?.data[0]);
        }
    }

    function handleViewItemSeo() {
        viewItemForSeo(details, id)
    }

    useEffect(() => {
        callDiscoverHighlightsComponentUI();
    }, []);

    useEffect(() => {
        if (router.isReady) {
            getProduct();
        }
    }, [id]);

    useDidMountEffect(() => {
        if (router.isReady) {
            getProduct();
        }
    }, [selectedRetailer]);

    useEffect(() => {
        if (router.isReady) {
            getProductMetaFormat();
        }
    }, [details?.id]);

    useEffect(() => {
        getProductReview();
    }, [details?.id]);

    useEffect(() => {
        if (currentSpecialOffer) {
            setSelectedOffer(currentSpecialOffer);
            dispatch(setCurrentSpecialOffer(""));
        }
    }, []);

    useDidMountEffect(() => {
        handleViewItemSeo();
    }, [details]);

    const handleFilter = (filterType, value) => {
        if (filterType === 'brand') {
            dispatch(setBrandQueryValue(value));
            router.push(`/shop`);
        } else if (filterType === 'category') {
            dispatch(setCategoryQueryValue(value));
            router.push(`/shop`);
        } else if (filterType === 'strainType') {
            dispatch(setStrainTypeQueryValue(value));
            router.push(`/shop`);
        }
    }

    if (id) {
        return (
            <>
                {!selectedRetailer?.id && <HandleSelectDefaultRetailer productSlug={id} />}
                {
                    productMetaTitles && <HeaderTitles title={productMetaTitles} isProductDetails={true} />
                }
                <Head>
                    {
                        productMetaDescriptions &&
                        <meta
                            name="description"
                            // content={pageMeta?.productDetailsPageMetaDescription}
                            content={productMetaDescriptions.slice(0, 301)}
                        />
                    }
                    <meta
                        name="keywords"
                        content={pageMeta?.productDetailsPageMetaKeyword}
                    />
                    {
                        productSchema &&
                        <script
                            id="json_ld_product"
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: productSchema }}
                        />
                    }
                </Head>
                {
                    details?.name ?
                        <div>
                            {/* <section>
                                <Banner />
                            </section> */}
                            <section className='container'>
                                <div className='row'>
                                    <div className='col-12 col-md-12 col-lg-6'>
                                        <div className='container'>
                                            <div className={`${styles.mobileProductDetailsBreadCram}`}>
                                                <p className='fs-12'>
                                                    <Link className='cp'
                                                        href={'/'}
                                                    >
                                                        Home
                                                    </Link>   /
                                                    <Link className='cp'
                                                        href={'/shop'}>
                                                        &nbsp;Shop
                                                    </Link>   /&nbsp;
                                                    <span>Product</span>   /&nbsp;
                                                    <span className='cp' onClick={() => handleFilter('category', details?.category)}>{details?.category}</span>
                                                </p>
                                            </div>
                                            {/* <div>
                                        <picture>
                                            <img src={details?.image} className="w-100" />
                                        </picture>
                                    </div> */}
                                            <div className='mb-4'>
                                                <BigPreviewImage image={selectedImage} />
                                            </div>
                                            <div>
                                                <ImageSlider />
                                            </div>
                                            {/* <div className='row'>
                                        {details?.images?.map((img) => (
                                            <div className='col'>
                                                <img src={img.url} className="w-100 border border-1" />
                                            </div>
                                        ))}
                                    </div> */}

                                            <div className="accordion mt-3 mt-lg-5" id="accordionItem">
                                                {
                                                    details?.description == "" ?
                                                        <></> :
                                                        <div className="accordion-item border-0" >
                                                            <hr />
                                                            <h2 className="accordion-header" id="headingOne">
                                                                <button
                                                                    className="accordion-button shadow-none bg-transparent collapsed fs-16 fw-bold"
                                                                    type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target='#collapseD'
                                                                    aria-expanded='false'
                                                                    aria-controls="collapseD">
                                                                    Description
                                                                </button>
                                                            </h2>
                                                            <div
                                                                id='collapseD'
                                                                className='accordion-collapse'
                                                                aria-labelledby="heading"
                                                                data-bs-parent="#accordionItem"
                                                            >
                                                                <div className="accordion-body">
                                                                    <p className='fs-14 ff-Soleil400'>
                                                                        {details?.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                }
                                                {details?.effects?.length > 0 && (
                                                    <div className="accordion-item border-0" >
                                                        <hr />
                                                        <h2 className="accordion-header" id="headingOne">
                                                            <button
                                                                className="accordion-button shadow-none bg-transparent collapsed fs-16 fw-bold"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target='#collapse'
                                                                aria-expanded='false'
                                                                aria-controls="collapse">
                                                                Effects
                                                            </button>
                                                        </h2>
                                                        <div
                                                            id='collapse'
                                                            className='accordion-collapse collapse'
                                                            aria-labelledby="heading"
                                                            data-bs-parent="#accordionItem"
                                                        >
                                                            <div className="accordion-body">

                                                                <ul>
                                                                    {details && details?.effects?.map((effect, index) => (
                                                                        <li key={index}>{effect}</li>
                                                                    ))}
                                                                </ul>

                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>


                                    <div className='col-12 col-md-12 col-lg-6'>
                                        <div className='container'>
                                            <div className='d-none d-lg-flex justify-content-start align-items-center mt-3 mt-lg-5 gap-3'>

                                                {/* <Link href={'/daily-deals'}
                                                        className='border-0 text-white text-center fs-14 my-auto cp'>
                                                        {toTitleCase('Sale')}
                                                    </Link> */}
                                                {
                                                    (menuTypeValue == "MEDICAL")
                                                        ?
                                                        <>
                                                            {
                                                                details?.variants[0]?.specialPriceMed
                                                                    ?
                                                                    <>
                                                                        <div className="">
                                                                            <div className='d-flex justify-content-center align-items-center rounded-pill' style={{ backgroundColor: '#F5333F', height: "42px", width: "107px" }}>
                                                                                <Link href={'/daily-deals'}
                                                                                    className='border-0 text-white text-center fs-14 my-auto cp'>
                                                                                    {calculateDiscountPercentage(
                                                                                        details?.variants[0]?.priceMed,
                                                                                        details?.variants[0]?.specialPriceMed
                                                                                    )}
                                                                                    % OFF
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </> : <></>
                                                            }
                                                        </> :
                                                        (menuTypeValue == "RECREATIONAL")
                                                            ?
                                                            <>
                                                                {
                                                                    details?.variants[0]?.specialPriceRec
                                                                        ?
                                                                        <>
                                                                            <div className="">
                                                                                <div className='d-flex justify-content-center align-items-center rounded-pill' style={{ backgroundColor: '#F5333F', height: "42px", width: "107px" }}>
                                                                                    <Link href={'/daily-deals'}
                                                                                        className='border-0 text-white text-center fs-14 my-auto cp'>
                                                                                        {calculateDiscountPercentage(
                                                                                            details?.variants[0]?.priceRec,
                                                                                            details?.variants[0]?.specialPriceRec
                                                                                        )}
                                                                                        % OFF
                                                                                    </Link>
                                                                                </div>
                                                                            </div>
                                                                        </> : <></>
                                                                }
                                                            </>
                                                            : <></>
                                                }

                                                {details?.strainType != 'NOT_APPLICABLE' ?
                                                    <div className='bg-site-black d-flex justify-content-center align-items-center rounded-pill' style={{ height: "42px", width: "107px" }}>
                                                        <p onClick={() => handleFilter('strainType', details?.strainType)} className='border-0 text-white text-center fs-14 my-auto cp'>{toTitleCase(`${details?.strainType}`)}</p>
                                                    </div> :
                                                    <></>
                                                }
                                                <div className='bg-site-black d-flex justify-content-center align-items-center rounded-pill' style={{ height: "42px", width: "107px" }}>
                                                    <p onClick={() => handleFilter('category', details?.category)} className='border-0 text-white text-center fs-14 my-auto cp'>{toTitleCase(`${details?.category}`)}</p>
                                                </div>


                                            </div>
                                            <div className='mt-3 d-flex gap-2 align-items-center mb-4'>
                                                <div className='my-auto d-none d-lg-block '>

                                                    <Rating
                                                        className='ratingSVG'
                                                        size={16}
                                                        initialValue={review?.ratingAvarage}
                                                        readonly={true}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <p className='fs-12 my-auto d-none d-lg-block '></p>
                                                <div className='d-none d-lg-block '>
                                                    <button className='fs-12 my-auto bg-transparent border-0 me-3'>({review?.reviewCount} Reviews)</button>
                                                    <Link className='fs-12 my-auto bg-transparent border-0'
                                                        href={`/review/${details?.id}`}
                                                    >
                                                        <u>Write a review</u>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div>
                                                <p className='fs-14 lh-20 mt-2 ff-Soleil400 mb-0 cp' onClick={() => { handleFilter('brand', details?.brand?.id) }}>{details?.brand?.name}</p>
                                                <h1 className='fs-24 lh-32 fw-bold ff-Soleil700 my-1'>{details?.name}</h1>

                                            </div>
                                            <div className=''>
                                                {
                                                    menuTypeValue == "MEDICAL" ?
                                                        <>
                                                            {
                                                                selectedOption?.specialPriceMed ?
                                                                    <>
                                                                        <h3 className='fs-24 lh-24 ff-Soleil700 mb-0' style={{ color: '#F5333F' }}>Now ${selectedOption?.specialPriceMed}<span className="text-site-black fs-18 ff-Soleil400 fw-600 text-decoration-line-through ms-1"> ${selectedOption?.priceMed}</span></h3>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <h3 className="fs-24 lh-24 ff-Soleil700 mb-0" style={{ color: '#F5333F' }}>Now ${selectedOption?.priceMed} <span className="text-site-black fs-14 ff-Soleil400"></span></h3>
                                                                    </>
                                                            }
                                                        </>
                                                        :
                                                        menuTypeValue == "RECREATIONAL" ?
                                                            <>
                                                                {
                                                                    selectedOption?.specialPriceRec ?
                                                                        <>
                                                                            <h3 className='fs-24 lh-24 ff-Soleil700 mb-0' style={{ color: '#F5333F' }}>Now ${selectedOption?.specialPriceRec}<span className="text-site-black fs-18 ff-Soleil400 fw-600 text-decoration-line-through ms-1"> ${selectedOption?.priceRec}</span></h3>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <h3 className="fs-24 lh-24 ff-Soleil700 mb-0" style={{ color: '#F5333F' }}>Now ${selectedOption?.priceRec} <span className="text-site-black fs-14 ff-Soleil400"></span></h3>
                                                                        </>
                                                                }
                                                            </>
                                                            : <></>
                                                }
                                                {/* {
                                                    (selectedOption?.specialPriceMed || selectedOption?.specialPriceRec) ?
                                                        <h3 className='fs-24 lh-24 ff-Soleil700 mb-0' style={{ color: '#F5333F' }}>Now ${selectedOption?.specialPriceRec}<span className="text-site-black fs-18 ff-Soleil400 fw-600 text-decoration-line-through ms-1"> ${selectedOption?.priceRec}</span></h3>
                                                        :
                                                        <h3 className="fs-24 lh-24 ff-Soleil700 mb-0" style={{ color: '#F5333F' }}>Now ${selectedOption?.priceRec} <span className="text-site-black fs-14 ff-Soleil400"></span></h3>
                                                } */}
                                            </div>
                                            <div className='mt-3 d-flex gap-2 d-block d-lg-none'>
                                                <div className='my-auto'>
                                                    <Rating
                                                        className='ratingSVG'
                                                        size={16}
                                                        initialValue={review?.ratingAvarage}
                                                        readonly={true}
                                                    />
                                                </div>
                                                <p className='fs-12 my-auto d-block d-lg-none'></p>
                                                <div>
                                                    <button className='fs-12 my-auto bg-transparent border-0 me-3'>({review?.reviewCount} Reviews)</button>
                                                    <Link className='fs-12 my-auto bg-transparent border-0'
                                                        href={`/review/${details?.id}`}>
                                                        <u>Write a review</u>
                                                    </Link>
                                                </div>
                                            </div>
                                            {
                                                details?.category != "EDIBLES"
                                                    ?
                                                    <>
                                                        <div className="mt-4">
                                                            <p className="fs-17 ff-Soleil400 mb-0">Weight</p>
                                                        </div>
                                                        <div className='row mt-2 gy-1'>

                                                            {
                                                                details?.variants?.map((item, index) => {
                                                                    return (
                                                                        <>
                                                                            <div className='col-4 col-lg-2' key={index}>
                                                                                <input type="radio" className="btn-check" name="options-outlined" id={"danger-outlined" + item.option} value={item} onChange={() => { handleVariants(item) }} checked={item.option === selectedWeight} />
                                                                                <label className="btn btn-outline-dark rounded-pill w-100 text-nowrap fs-12 py-2" htmlFor={"danger-outlined" + item.option}>{item.option}</label>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </>
                                                    :
                                                    <></>
                                            }
                                            <div className='mt-4 mt-lg-5'>
                                                <p className='fs-17 my-auto mb-3'>Quantity</p>
                                                <div className='row mb-3'>
                                                    <div className='col-4 col-md-4'>
                                                        <div className='d-flex gap-4 w-100 border border-2 border-dark rounded-pill py-2 justify-content-center'>
                                                            <button onClick={handleDecrement} className='bg-transparent border-0 my-auto fs-14 fs-md-12 fw-bold'>-</button>
                                                            <p className='my-auto fs-14 fs-md-12 fw-bold'>{counter}</p>
                                                            <button onClick={handleIncrement} className='bg-transparent border-0 my-auto fs-14 fs-md-12 fw-bold'>+</button>
                                                        </div>

                                                    </div>
                                                    <div className='col-8 col-md-8'>
                                                        <button onClick={() => { addToCart() }} className={`w-80 w-md-100 rounded-pill fs-14 py-2 ${styles.addToCartButton}`} data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">{detailInfo.main_button_text}</button>
                                                    </div>
                                                </div>
                                                {
                                                    selectedOffer ?
                                                        <div className={styles.details_offer_btn}>
                                                            <p
                                                                className={`text-center text-white fs-12 mb-0 cp ${styles.card_button_bottom_special_details}`}
                                                            >
                                                                <Link href={'/daily-deals'}>
                                                                    {selectedOffer}
                                                                </Link>
                                                            </p>
                                                        </div>
                                                        : <></>

                                                }


                                                {/* <p className='fs-14 mt-4'>{detailInfo.site_text}</p> */}
                                                <p className='fs-16 mt-4'>
                                                    Please&nbsp;
                                                    <Link className="fw-600"
                                                        href={'/login'}
                                                    >
                                                        Login
                                                    </Link>
                                                    &nbsp;or&nbsp;
                                                    <Link className="fw-600"
                                                        href={'/registration'}

                                                    >
                                                        Register&nbsp;
                                                    </Link>
                                                    for a customized shopping experience.
                                                </p>
                                            </div>
                                            <hr className='my-4' />
                                            <div className="fs-14">
                                                {(details?.potencyThc?.formatted) ?
                                                    <span className="me-1">
                                                        <span className="fw-600">THC: </span>
                                                        {details?.potencyThc?.formatted}
                                                    </span>
                                                    :
                                                    <span className="me-1">
                                                        <span className="fw-600">THC: </span> N/A
                                                    </span>
                                                }
                                                {(details?.potencyCbd?.formatted) ?
                                                    <>
                                                        | <span className="fw-600">CBD: </span>
                                                        {details?.potencyCbd?.formatted}
                                                    </>
                                                    :
                                                    <>
                                                        | <span className="fw-600">CBD: </span> N/A
                                                    </>
                                                }
                                                {/*<p className='fs-12'> {(details?.potencyThc?.formatted) ? `THC: ${details?.potencyThc?.formatted}` : "THC: N/A"} {(details?.potencyCbd?.formatted) ? `| CBD: ${details?.potencyCbd?.formatted}` : "| CBD: N/A"} </p>*/}
                                                {
                                                    details?.potencyCbd?.formatted ?
                                                        <>
                                                            <div className='d-flex justify-content-between mt-4'>
                                                                <p className='fs-12 my-auto'>Calming</p>
                                                                <p className=' fs-12 my-auto'>Energizing</p>
                                                            </div>
                                                            <div className="progress w-100" style={{ height: '12px' }}>
                                                                <div className="progress-bar bg-site-black" role="progressbar"
                                                                    aria-label="Basic example" style={{ width: `${details?.potencyCbd?.range[0]}%` }}
                                                                    aria-valuenow={details?.potencyCbd?.range[0].toString} aria-valuemin="0"
                                                                    aria-valuemax="100"></div>
                                                            </div>
                                                            {/*
                                                      <div className=''>
                                                        <form className="multi-range-field">
                                                            <input id="multi3" className="w-100 range-bar" type="range" value={details?.potencyCbd?.range[0]} />
                                                        </form>
                                                    </div>
                                                    */}

                                                        </> : <></>
                                                }
                                                {
                                                    details?.potencyThc?.formatted ?
                                                        <>
                                                            <div className='d-flex justify-content-between mt-4'>
                                                                <p className='fs-12 my-auto'>Low THC</p>
                                                                <p className=' fs-12 my-auto'>High THC</p>
                                                            </div>
                                                            <div className="progress rounded-pill w-100" style={{ height: '12px' }}>
                                                                <div className="progress-bar rounded-pill bg-site-black" role="progressbar"
                                                                    aria-label="Basic example" style={{ width: `${details?.potencyThc?.range[0]}%` }}
                                                                    aria-valuenow={details?.potencyThc?.range[0].toString} aria-valuemin="0"
                                                                    aria-valuemax="100"></div>
                                                            </div>
                                                        </> : <></>
                                                }

                                            </div>
                                            <hr className='mt-5' />
                                            <div className='my-5'>
                                                <div className='d-flex gap-2'>
                                                    <picture>
                                                        <img src='/images/Menu Icon/Small Icon/location.svg' alt='location' style={{ width: '15px' }} />
                                                    </picture>
                                                    <div>
                                                        <p className='fs-14 my-auto'>{Cartdata?.bottomSubtitleOne}</p>
                                                        <p className='fs-16 fw-bold my-auto'>{Cartdata?.bottomTitleOne}</p>
                                                        <Link href={Cartdata?.bottomButtonOneLink || ""} className='fs-14 my-auto' >{Cartdata?.bottomButtonOneText}</Link>
                                                    </div>
                                                </div>
                                                <div className='d-flex gap-2 mt-4'>
                                                    <picture>
                                                        <img src='/images/Menu Icon/Small Icon/moneybag.svg' alt='wallet' style={{ width: '15px' }} />
                                                    </picture>
                                                    <div>
                                                        <p className='fs-16 fw-bold my-auto'>{Cartdata?.bottomTitleTwo}</p>
                                                        <p className='fs-14 my-auto'>{Cartdata?.bottomSubtitleTwo} </p>
                                                        <Link href={"/registration"} className='fs-14 my-auto'>{Cartdata?.bottomButtonTwoText}</Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className='d-flex gap-2 mt-5' onClick={() => { handleWishlist(details) }}>
                                                {
                                                    existInWishlist(details) ?
                                                        <AiFillHeart className="fs-20 text-center my-auto cp" onClick={() => { createToast('Item already added to wishlist.', 'info') }} />
                                                        :
                                                        <AiOutlineHeart className={`fs-20 text-center my-auto cp ${styles.heartIcon}`} />
                                                }
                                                <p className='fs-14 my-auto text-decoration-underline cp'>{toTitleCase(`${detailInfo.lower_site_text}`)}</p>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </section>
                            <section className="py-2 mt-2 mt-md-4">
                                <SliderHowToEnjoy />
                            </section>
                            <section className='container text-site-white mt-4'>
                                <BannerRelatedProduct />
                            </section>
                            <section className="py-0 py-lg-4 mt-4">
                                <SliderRelatedProduct categoryName={details?.category} />
                            </section>
                            <section className='container mt-4 mb-5'>
                                <div className='container'>
                                    <div className='row'>
                                        <div className={discoverHighlightsComponentUI.discoverSectionBackgroundColor ? 'col-12 col-md-5 border border-1 border-dark' : 'col-12 col-md-5 bg-site-darkkhaki border border-1 border-dark'}
                                            style={{ backgroundColor: discoverHighlightsComponentUI.discoverSectionBackgroundColor ? `${discoverHighlightsComponentUI.discoverSectionBackgroundColor}` : '' }}
                                        >
                                            <div className='container p-5'>
                                                <p className='fs-24 text-white my-auto pb-2 text-center text-md-start'>{discoverCms?.data?.data[0]?.sectionOneHeader}</p>
                                                <h1 className='fs-55 fs-md-40 fw-bold ff-PowerGrotesk700 text-white my-auto pb-3 text-center text-md-start'>{discoverCms?.data?.data[0]?.sectionOneTitle}</h1>
                                                <p className='fs-12 text-white w-60 text-center ff-Soleil400 text-md-start w-md-100'>{discoverCms?.data?.data[0]?.sectionOneSubTitle}</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-7 border border-1 border-dark mt-4 mt-md-0'>
                                            <div className='p-3 p-lg-5 mb-0 mb-lg-4'>
                                                <p className='fs-12 my-auto py-2'>{discoverCms?.data?.data[0]?.sectionTwoHeader}</p>
                                                <p className='fs-30 fw-bold text-nowrap fs-md-16 my-0 py-1'>{discoverCms?.data?.data[0]?.sectionTwoTitle}</p>
                                                <p className='fs-12 my-0 py-2'>{discoverCms?.data?.data[0]?.sectionTwoSubTitle}</p>
                                                <p className='fs-12 my-0 text-justify py-2'>{parse(`${discoverCms?.data?.data[0]?.sectionTwoDescription}`)}</p>
                                                <Link
                                                    href={`${discoverCms?.data?.data[0]?.sectionTwoButtonLink || ""}`}
                                                    className="px-3 px-lg-5 fw-bold rounded-pill ff-Soleil400 fs-14 fs-md-12 btn btn-outline-dark text-uppercase">
                                                    {discoverCms?.data?.data[0]?.sectionTwoButtonText}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section >
                        </div >
                        :
                        <>
                            <Loader />
                            <section className='container'>
                                <div className='row'>
                                    <div className='col-12 col-md-12 col-lg-6'>
                                        <div className='container'>
                                            <div className={`${styles.mobileProductDetailsBreadCram}`}>
                                                <p className='fs-12'>
                                                    <Skeleton style={{ width: '200px', height: '30px' }} />
                                                </p>
                                            </div>
                                            <div className='mb-4'>
                                                <Skeleton style={{ width: '100%', height: '350px' }} />
                                            </div>
                                            <div>
                                                <Skeleton style={{ width: '100%', height: '80px' }} />
                                            </div>

                                            <div className="accordion mt-3 mt-lg-5" id="accordionItem">
                                                <div className="accordion-item border-0" >
                                                    <Skeleton style={{ width: '100%', height: '80px' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className='col-12 col-md-12 col-lg-6'>
                                        <div className='container'>
                                            <div className='d-none d-lg-flex justify-content-start align-items-center mt-3 mt-lg-5 gap-3'>
                                                <div className='d-flex justify-content-center align-items-center rounded-pill'>
                                                    <Skeleton style={{ width: '107px', height: '42px', borderRadius: '50px' }} />
                                                </div>
                                                <div className='d-flex justify-content-center align-items-center rounded-pill'>
                                                    <Skeleton style={{ width: '107px', height: '42px', borderRadius: '50px' }} />
                                                </div>
                                                <div className='d-flex justify-content-center align-items-center rounded-pill'>
                                                    <Skeleton style={{ width: '107px', height: '42px', borderRadius: '50px' }} />
                                                </div>


                                            </div>
                                            <div className='mt-3 d-flex gap-2 align-items-center mb-4'>
                                                <div className='my-auto d-none d-lg-block '>
                                                    <Skeleton style={{ width: '100px', height: '20px' }} />
                                                </div>
                                                <p className='fs-12 my-auto d-none d-lg-block '></p>
                                                <div className='d-none d-lg-block '>
                                                    <button className='fs-12 my-auto bg-transparent border-0 me-3'><Skeleton style={{ width: '100px', height: '20px' }} /></button>
                                                    <button className='fs-12 my-auto bg-transparent border-0'><Skeleton style={{ width: '100px', height: '20px' }} /></button>
                                                </div>
                                            </div>
                                            <div>
                                                <p className='fs-14 lh-20 mt-2 ff-Soleil400 mb-0 cp'><Skeleton style={{ width: '20%', height: '20px' }} /></p>
                                                <h1 className='fs-24 lh-32 fw-bold ff-Soleil700 my-1'><Skeleton style={{ width: '80%', height: '30px' }} /></h1>

                                            </div>
                                            <div>
                                                <h3 className='fs-24 lh-24 ff-Soleil700 mb-0' style={{ color: '#F5333F' }}>
                                                    <Skeleton style={{ width: '100px', height: '35px' }} />
                                                </h3>
                                            </div>

                                            <div className="mt-4">
                                                <p className="fs-17 ff-Soleil400 mb-0"><Skeleton style={{ width: '15%', height: '30px' }} /></p>
                                                <p className="fs-22 ff-Soleil700 mb-0"><Skeleton style={{ width: '15%', height: '30px' }} /></p>
                                            </div>
                                            <div className='row mt-2 gy-3'>
                                                <div className='col-4 col-lg-2'>
                                                    <Skeleton style={{ width: '90px', height: '43px', borderRadius: '50px' }} />
                                                </div>
                                            </div>
                                            <div className='mt-4 mt-lg-5'>
                                                <p className='fs-17 my-auto mb-3'><Skeleton style={{ width: '25%', height: '25px' }} /></p>
                                                <div className='row'>
                                                    <div className='col-4 col-md-4'>
                                                        <div className='d-flex justify-content-center ms-5 ms-lg-0'>
                                                            <Skeleton style={{ width: '150px', height: '40px', borderRadius: '50px' }} />
                                                        </div>
                                                    </div>
                                                    <div className='col-8 col-md-8'>
                                                        <Skeleton style={{ width: '200px', height: '40px', borderRadius: '50px' }} />
                                                    </div>
                                                </div>
                                                <p className='fs-16 mt-4'>
                                                    <Skeleton style={{ width: '100%', height: '25px' }} />
                                                </p>
                                            </div>
                                            <hr className='my-4' />
                                            <div className="fs-14">
                                                <Skeleton style={{ width: '300px', height: '30px' }} />
                                            </div>
                                            <hr className='mt-5' />
                                            <div className='my-5'>
                                                <Skeleton style={{ width: '100%', height: '80px' }} />

                                                <Skeleton style={{ width: '100%', height: '80px', marginTop: '20px' }} />
                                            </div>
                                            <hr />
                                            <div className='d-flex gap-2 mt-5'>
                                                <p className='fs-14 my-auto text-decoration-underline cp'><Skeleton style={{ width: '300px', height: '30px' }} /></p>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </section>
                            {/* <section className="py-2 mt-4">
                                <SliderHowToEnjoy />
                            </section>
                            <section className='container text-site-white mt-4'>
                                <BannerRelatedProduct />
                            </section>
                            <section className="py-0 py-lg-4 mt-4">
                                <SliderRelatedProduct categoryName={details?.category} />
                            </section>
                            <section className='container mt-4 mb-5'>
                                <div className='container'>
                                    <div className='row'>
                                        <div className={discoverHighlightsComponentUI.discoverSectionBackgroundColor ? 'col-12 col-md-5 border border-1 border-dark' : 'col-12 col-md-5 bg-site-darkkhaki border border-1 border-dark'}
                                            style={{ backgroundColor: discoverHighlightsComponentUI.discoverSectionBackgroundColor ? `${discoverHighlightsComponentUI.discoverSectionBackgroundColor}` : '' }}
                                        >
                                            <div className='container p-5'>
                                                <p className='fs-24 text-white my-auto pb-2 text-center text-md-start'>{discoverCms?.data?.data[0]?.sectionOneHeader}</p>
                                                <h1 className='fs-55 fs-md-40 fw-bold ff-PowerGrotesk700 text-white my-auto pb-3 text-center text-md-start'>{discoverCms?.data?.data[0]?.sectionOneTitle}</h1>
                                                <p className='fs-12 text-white w-60 text-center ff-Soleil400 text-md-start w-md-100'>{discoverCms?.data?.data[0]?.sectionOneSubTitle}</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-7 border border-1 border-dark mt-4 mt-md-0'>
                                            <div className='p-3 p-lg-5 mb-0 mb-lg-4'>
                                                <p className='fs-12 my-auto py-2'>{discoverCms?.data?.data[0]?.sectionTwoHeader}</p>
                                                <p className='fs-30 fw-bold text-nowrap fs-md-16 my-0 py-1'>{discoverCms?.data?.data[0]?.sectionTwoTitle}</p>
                                                <p className='fs-12 my-0 py-2'>{discoverCms?.data?.data[0]?.sectionTwoSubTitle}</p>
                                                <p className='fs-12 my-0 text-justify py-2'>{parse(`${discoverCms?.data?.data[0]?.sectionTwoDescription}`)}</p>
                                                <Link href={`${discoverCms?.data?.data[0]?.sectionTwoButtonLink || ""}`}
                                                    // onClick={() => { router.push(`${discoverCms?.data?.data[0]?.sectionTwoButtonLink}`) }}
                                                    className="px-3 px-lg-5 fw-bold rounded-pill ff-Soleil400 fs-14 fs-md-12 btn btn-outline-dark text-uppercase">
                                                    {discoverCms?.data?.data[0]?.sectionTwoButtonText}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section > */}
                        </ >
                }
            </>

        )
    }

}

export default Details
