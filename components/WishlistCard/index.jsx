import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { addItemToCart } from '../../redux/cart_store/cartReducer';
import { decreaseCount, increaseCount, removeFromWishlist, setVariants } from '../../redux/wishlist_store/wishlistReducer';
import { addToCartItemForSeo } from '../../utils/seoInformations';
import { useDispatch, useSelector } from 'react-redux';
import styles from "../../styles/MyItems.module.css";
import Swal from 'sweetalert2';
import { createCheckout, showLoader } from '../../utils/helper';
import { setCheckoutId } from '../../redux/global_store/globalReducer';
export default function WishlistCard({ item, index }) {
    const [counter, updateCounter] = useState(1);
    const [activeLoader, setActiveLoader] = useState(true);
    const dispatch = useDispatch();
    let { wishlist, wishlistCounter } = useSelector((store) => (store.wishlistStore));
    let { checkoutId, selectedRetailer, pageMeta, menuTypeValue } = useSelector(store => (store.globalStore));
    let { cartList } = useSelector((store) => store.cartStore);
    let router = useRouter();

    function calculateProductPrice(product, el) {
        if (menuTypeValue == 'RECREATIONAL') {
            if (el.specialPriceRec)
                return el.specialPriceRec;
            else
                return el.priceRec;
        } else if (menuTypeValue == 'MEDICAL') {
            if (el.specialPriceMed)
                return el.specialPriceMed;
            else
                return el.priceMed;
        }
    }
    function handleProductVariants(e, index) {
        let variants = JSON.parse(e.target.value)
        let { price, weight } = variants;
        dispatch(setVariants({ index: index, price: price, weight: weight }));
    }
    function handleIncrement(index) {
        dispatch(increaseCount(index))
    }
    function handleDecrement(index) {
        dispatch(decreaseCount(index));
    }
    function handleRemoveItem(data) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            customClass: 'remove',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(removeFromWishlist(data));
            }
        })
    }

    async function addToCart(product) {
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
            productId: product?.data?.id,
            quantity: product?.quantity,
            option: product?.data?.selectedWeight
        }
        let filterCheckOutId = (createdId ? createdId : checkoutId);
        dispatch(addItemToCart({ itemData: processedItemData, checkoutId: filterCheckOutId, retailerId: selectedRetailer.id }));
        dispatch(removeFromWishlist(product?.data));

        const itemArr = cartList?.filter(item => (item.productId == product?.data.id));
        if (itemArr?.length > 0) {
            const item = itemArr[0];
            addToCartItemForSeo(item.product, item.quantity + product?.quantity);
        } else {
            addToCartItemForSeo(product?.data, product?.quantity);
        }
    }

    return (
        <>
            {/* old card */}
            {/* <div className="col-12 col-md-4" key={index}>
                <div className={`card mb-3 ${styles.card_width}`}>
                    <picture>
                        <img
                            style={{ cursor: 'pointer' }}
                            onClick={() => { router.push(`/product-details/${item.data.slug}`) }}
                            src={item.data.image}
                            className={`rounded-top ${styles.card_img}`}
                        />
                    </picture>
                    <div className="card-body">
                        <div className={styles.text_body}>
                            <p className="my-auto text-center">{item.data?.brand?.name}</p>
                            <h5 className="card-title fw-bold ff-Soleil700 text-center" style={{ cursor: 'pointer' }}
                                onClick={() => { router.push(`/product-details/${item.data.slug}`) }}>{item.data.name}</h5>
                            <div>
                                {
                                    item?.data?.variants?.length > 1 ?
                                        <>
                                            <div className="d-flex justify-content-center">
                                                <select onChange={(e) => { handleProductVariants(e, index) }} value={item?.data?.selectedVariants} className='mb-2' style={{ 'border': 'none', 'outline': 'none' }}>
                                                    {
                                                        item.data.variants.map((el, i) => {
                                                            return (
                                                                <option key={i} value={JSON.stringify({ price: calculateProductPrice(item, el), weight: el.option })}>${calculateProductPrice(item, el) + `/${el.option}`}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className=''>
                                                <p className='fs-12 text-gray-600 text-center'>{item?.data?.variants?.length} Varient Available</p>
                                            </div>
                                        </> :
                                        <>
                                            {
                                                (menuTypeValue == "MEDICAL") ?
                                                    <>
                                                        {
                                                            (item?.data?.variants[0]?.specialPriceMed) ?
                                                                <>
                                                                    <h3 className="text-danger fs-20 text-center ff-Soleil400 mt-3 mb-2">Now ${item?.data?.variants[0]?.specialPriceMed}<span className="text-site-black fs-14 ff-Soleil400"> ${item?.data?.variants[0]?.priceMed} | {item?.data?.variants[0]?.option}</span></h3>
                                                                </>
                                                                :
                                                                <>
                                                                    <h3 className="text-danger fs-20 text-center ff-Soleil400 mt-3 mb-2">Now ${item?.data?.variants[0]?.priceMed} <span className="text-site-black fs-14 ff-Soleil400"> | {item?.data?.variants[0]?.option}</span></h3>
                                                                </>
                                                        }
                                                    </>
                                                    :
                                                    (menuTypeValue == "RECREATIONAL") ?
                                                        <>
                                                            {
                                                                (item?.data?.variants[0]?.specialPriceRec) ?
                                                                    <>
                                                                        <h3 className="text-danger fs-20 text-center ff-Soleil400 mt-3 mb-2">Now ${item?.data?.variants[0]?.specialPriceRec}<span className="text-site-black fs-14 ff-Soleil400"> ${item?.data?.variants[0]?.priceRec} | {item?.data?.variants[0]?.option}</span></h3>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <h3 className="text-danger fs-20 text-center ff-Soleil400 mt-3 mb-2">Now ${item?.data?.variants[0]?.priceRec} <span className="text-site-black fs-14 ff-Soleil400"> | {item?.data?.variants[0]?.option}</span></h3>
                                                                    </>
                                                            }
                                                        </>
                                                        :
                                                        <>

                                                        </>
                                            }
                                        </>
                                }
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <div className="mb-2 d-flex w-50 gap-4 border border-dark rounded-pill justify-content-center py-2">
                                <button
                                    onClick={() => { handleIncrement(index) }}
                                    className="bg-transparent border-0 my-auto fs-14 fw-bold"
                                >
                                    +
                                </button>
                                <p className="my-auto fs-14 fw-bold">{item.quantity}</p>
                                <button
                                    onClick={() => { handleDecrement(index) }}
                                    className="bg-transparent border-0 my-auto fs-14 fw-bold"
                                >
                                    -
                                </button>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-sm btn-dark fs-14 rounded-pill w-100 py-2"
                                onClick={() => { addToCart(item) }}
                                data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
                            >
                                Add To Cart
                            </button>
                            &ensp;
                            <button
                                type="button"
                                className="btn btn-sm btn-dark fs-14 rounded-pill w-100 py-2"
                                onClick={() => { handleRemoveItem(item?.data) }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* New Card Design */}
            <div className="col-12">
                <div className="card mb-3 py-2">
                    <div className="card-body d-md-flex flex-sm-column flex-md-row gap-3">
                        <div>
                            <picture>
                                <img
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => { router.push(`/product-details/${item.data.slug}`) }}
                                    src={item.data.image}
                                    className={`rounded-top ${styles.wishlist_card_image}`}
                                />
                            </picture>
                        </div>
                        <div className='shrink-0 w-100'>
                            {/* title part */}
                            <p className="my-auto mb-2 fs-12 text-center text-md-start">{item.data?.brand?.name}</p>
                            <h5 className="card-title fs-18 fw-bold ff-Soleil700 text-center text-md-start" style={{ cursor: 'pointer' }}
                                onClick={() => { router.push(`/product-details/${item.data.slug}`) }}>{item.data.name}</h5>
                            {/* pricing part */}
                            <div>
                                {
                                    item?.data?.variants?.length > 1 ?
                                        <>
                                            <div className="">
                                                <select onChange={(e) => { handleProductVariants(e, index) }} value={item?.data?.selectedVariants} className='mb-2' style={{ 'border': 'none', 'outline': 'none' }}>
                                                    {
                                                        item.data.variants.map((el, i) => {
                                                            return (
                                                                <option key={i} value={JSON.stringify({ price: calculateProductPrice(item, el), weight: el.option })}>${calculateProductPrice(item, el) + `/${el.option}`}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className=''>
                                                <p className='fs-12 text-gray-600'>{item?.data?.variants?.length} Varient Available</p>
                                            </div>
                                        </> :
                                        <>
                                            {
                                                (menuTypeValue == "MEDICAL") ?
                                                    <>
                                                        {
                                                            (item?.data?.variants[0]?.specialPriceMed) ?
                                                                <>
                                                                    <h3 className="text-danger text-center text-md-start fs-20 ff-Soleil400 mt-3 mb-2">Now ${item?.data?.variants[0]?.specialPriceMed}<span className="text-site-black fs-14 ff-Soleil400"> ${item?.data?.variants[0]?.priceMed} | {item?.data?.variants[0]?.option}</span></h3>
                                                                </>
                                                                :
                                                                <>
                                                                    <h3 className="text-danger text-center text-md-start fs-20 ff-Soleil400 mt-3 mb-2">Now ${item?.data?.variants[0]?.priceMed} <span className="text-site-black fs-14 ff-Soleil400"> | {item?.data?.variants[0]?.option}</span></h3>
                                                                </>
                                                        }
                                                    </>
                                                    :
                                                    (menuTypeValue == "RECREATIONAL") ?
                                                        <>
                                                            {
                                                                (item?.data?.variants[0]?.specialPriceRec) ?
                                                                    <>
                                                                        <h3 className="text-danger text-center text-md-start fs-20 ff-Soleil400 mt-3 mb-2">Now ${item?.data?.variants[0]?.specialPriceRec}<span className="text-site-black fs-14 ff-Soleil400"> ${item?.data?.variants[0]?.priceRec} | {item?.data?.variants[0]?.option}</span></h3>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <h3 className="text-danger text-center text-md-start fs-20 ff-Soleil400 mt-3 mb-2">Now ${item?.data?.variants[0]?.priceRec} <span className="text-site-black fs-14 ff-Soleil400"> | {item?.data?.variants[0]?.option}</span></h3>
                                                                    </>
                                                            }
                                                        </>
                                                        :
                                                        <>

                                                        </>
                                            }
                                        </>
                                }
                            </div>
                            {/* buttons part */}

                            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
                                <div className="d-flex w-50  mx-auto gap-4 border border-dark rounded-pill justify-content-center py-1 py-md-2">
                                    <button
                                        onClick={() => { handleIncrement(index) }}
                                        className="bg-transparent border-0 my-auto fs-14 fw-bold"
                                    >
                                        +
                                    </button>
                                    <p className="my-auto fs-14 fw-bold">{item.quantity}</p>
                                    <button
                                        onClick={() => { handleDecrement(index) }}
                                        className="bg-transparent border-0 my-auto fs-14 fw-bold"
                                    >
                                        -
                                    </button>
                                </div>
                                <div className="d-flex justify-content-between w-100 w-md-100 mt-1 mt-md-0">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-dark fs-sm-11 fs-md-14  rounded-pill w-100 py-2"
                                        onClick={() => { addToCart(item) }}
                                        data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
                                    >
                                        Add To Cart
                                    </button>
                                    &ensp;
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-dark fs-sm-11 fs-md-14 rounded-pill w-100 py-2"
                                        onClick={() => { handleRemoveItem(item?.data) }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
