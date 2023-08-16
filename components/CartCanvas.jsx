import React, { useEffect, useState } from 'react';
import styles from './commonLayout/css/Header.module.css';
import { useSelector, useDispatch } from 'react-redux';
import {
    removeItemFromCart,
    increaseItemQuantityInCartList,
    decreaseItemQuantityInCartList,
    updateItemOfCart,
    setCartList,
    setCartCounter,
    setSubTotal,
    setTotalAmont,
    setTaxAmont,
    setDiscount,
    setCartCountDown,
} from '../redux/cart_store/cartReducer';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import moment from 'moment';
import { createCheckout, redirectURL, showLoader } from '../utils/helper';
import Link from 'next/link';
import {
    setCheckoutId,
} from '../redux/global_store/globalReducer';
import { checkoutItemsForSeo, decreaseAddToCartItemForSeo, increaseAddToCartItemForSeo, removeFromCartItemsForSeo } from '../utils/seoInformations';

export default function CartCanvas() {
    let router = useRouter()
    let dispatch = useDispatch();
    let { token, checkoutId, selectedRetailer, userInfo, menuTypeValue } = useSelector((store) => (store.globalStore));
    const { cartList, cartCounter, subtotal, totalAmount, taxAmount, discountAmount, checkoutURL, cartCountDown, cartCounterObj } = useSelector((store) => (store.cartStore));
    const [timeLeft, setTimeLeft] = useState(null);

    function showPrice(item) {
        let selectedVariant = {};
        if (item?.product?.variants.length == 1) {
            selectedVariant = item?.product?.variants[0];
        } else {
            let variantExist = item?.product?.variants.filter(
                (el) => el.option === item?.option
            );
            selectedVariant = variantExist[0];
        }

        if (menuTypeValue == 'MEDICAL') {
            if (selectedVariant?.specialPriceMed) return selectedVariant?.specialPriceMed;
            else return selectedVariant?.priceMed;
        } else if (menuTypeValue == 'RECREATIONAL') {
            if (selectedVariant?.specialPriceRec) return selectedVariant?.specialPriceRec;
            else return selectedVariant?.priceRec;
        }


    }

    function handleIncreaseQuantity(index, el) {
        dispatch(increaseItemQuantityInCartList(index));
        dispatch(
            updateItemOfCart({
                checkoutId: checkoutId,
                retailerId: selectedRetailer?.id,
                index: index,
            })
        );
        const itemArr = cartList?.filter(item => (item.id == el.id));
        if (itemArr?.length > 0) {
            const item = itemArr[0];
            increaseAddToCartItemForSeo(el.product, item.quantity + 1);
        }
    }

    function handleDecreaseQuantity(index, el) {
        if (cartList[index].quantity > 1) {
            dispatch(decreaseItemQuantityInCartList(index));
            dispatch(
                updateItemOfCart({
                    checkoutId: checkoutId,
                    retailerId: selectedRetailer?.id,
                    index: index,
                })
            );
            const itemArr = cartList?.filter(item => (item.id == el.id));
            if (itemArr?.length > 0) {
                const item = itemArr[0];
                decreaseAddToCartItemForSeo(el.product, item.quantity - 1);
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
                } else {
                    removeFromCartItemsForSeo(itemData.product, 1);
                }
                dispatch(
                    removeItemFromCart({
                        itemId: item?.id,
                        checkoutId: checkoutId,
                        retailerId: selectedRetailer?.id,
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
        // let tempArr = []
        // cartList.forEach(element => {
        //     tempArr.push(element.product)
        // });
        // checkoutItemsForSeo(tempArr)
        Swal.close();
    }

    async function handleCreateCheckout() {
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
            pricingType: menuTypeValue,
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
        await handleCreateCheckout();
        localStorage.setItem('cartList', JSON.stringify([]));
        dispatch(setCartCountDown(null));
        localStorage.removeItem('countDownTime');
    }

    async function handleClearAll() {
        try {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                customClass: 'remove',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, remove all!',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await clearCartAll();
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    function formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        const time = `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
        if (
            (typeof window !== 'undefined' && timeInSeconds != undefined) ||
            timeInSeconds != null
        ) {
            localStorage.setItem('countDownTime', timeInSeconds);
        }
        return time;
    }

    useEffect(() => {
        if (cartCounterObj?.enableCartCounter == true) {
            let timer = undefined;
            if (cartCountDown != null) {
                if (cartCountDown > 0) {
                    timer = setInterval(() => {
                        dispatch(setCartCountDown(cartCountDown - 1));
                    }, 1000);
                } else {
                    clearCartAll();
                }

                return () => clearInterval(timer);
            }
        }
    }, [cartCountDown, cartCounterObj?.enableCartCounter]);

    return (
        <div
            className={`offcanvas offcanvas-end ${styles.cartCanvasWidth}`}
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
        >
            <div>
                <div className="d-flex justify-content-between px-3 pt-2">
                    <h5 id="offcanvasRightLabel" className="ff-Soleil700 my-auto pt-1">
                        Shopping Cart
                    </h5>
                    <button
                        type="button"
                        className="btn-close text-reset my-auto mt-1"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <hr />
                <div>
                    {cartCountDown > 0 ? (
                        <div className="text-center px-3">
                            <div className="alert alert-dark" role="alert">
                                Your items will be held in the cart for{' '}
                                {formatTime(cartCountDown)} minute
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div>
                    {cartList?.length > 0 ? (
                        <div
                            className=" text-end mx-3 my-0"
                            onClick={() => handleClearAll()}
                        >
                            <button
                                type="button"
                                className="btn border border-dark rounded-pill fs-10 fw-bold"
                            >
                                Clear All
                            </button>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>

            <div className={`mt-2 ${styles.custom_body}`}>
                {cartList?.length > 0 ? (
                    cartList?.map((el, index) => (
                        <div className="px-3 prod_items" key={index}>
                            <div className="d-flex justify-content-between">
                                <div className="me-3">
                                    <Link href={`/product-details/${el.product.slug}`}>
                                        <img
                                            src={el.product?.image}
                                            className={styles.prod_small_img}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </Link>
                                </div>
                                <div className="flex-grow-1">
                                    <Link
                                        href={`/product-details/${el.product.slug}`}
                                        className="fs-14 lh-20 fw-bold my-auto ff-Soleil700 me-2"
                                    >
                                        {el.product?.name}
                                    </Link>
                                    <div className="ff-Soleil400 fs-14 mt-2">
                                        {/* <p className='my-auto ff-Soleil400'>Flavor: Chocolate</p> */}
                                        <p className="my-auto ff-Soleil400 fs-12">
                                            Weight: {el.option}
                                        </p>
                                        <p className="ff-Soleil400 fs-12">
                                            Price: ${showPrice(el)}
                                        </p>
                                    </div>
                                    {/* <p className='fs-18 fw-bold ff-Soleil700'>${el.data?.selectedPrice * el.quantity}</p> */}
                                    <div className="text-start">
                                        <div className="w-50 d-flex gap-4 border border-dark rounded-pill py-2 justify-content-center">
                                            <button
                                                className="bg-transparent border-0 my-auto fs-14 fw-bold ff-Soleil400"
                                                onClick={() => {
                                                    handleDecreaseQuantity(index, el);
                                                }}
                                            >
                                                -
                                            </button>
                                            <p className="my-auto ff-Soleil400 fs-12 fw-bold">
                                                {el.quantity}
                                            </p>
                                            <button
                                                className="bg-transparent border-0 my-auto fs-14 fw-bold ff-Soleil400"
                                                onClick={() => {
                                                    handleIncreaseQuantity(index, el);
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="me-3 my-auto">
                                    <button
                                        type="button"
                                        className="btn btn-dark fs-10"
                                        onClick={() => {
                                            handleRemoveItem(el);
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                            <hr className="my-3 me-3" />
                        </div>
                    ))
                ) : (
                    <>
                        <div className="position-absolute top-50 start-50 translate-middle">
                            <p className="text-center fs-18 fw-bold"> Cart is empty!</p>
                        </div>
                    </>
                )}
            </div>
            {cartList?.length > 0 ? (
                <div className={`bg-site-blue-100 ${styles.custom_footer}`}>
                    <div className="px-3">
                        <div className="d-flex justify-content-between mx-2 mt-2">
                            <p className="fs-14 ff-Soleil700 fw-bold my-auto">Subtotal: </p>
                            <p className="fs-14 ff-Soleil700 fw-bold my-auto">${subtotal}</p>
                        </div>
                        <hr className="my-auto" />
                        <div className="d-flex justify-content-between mx-2 mt-2">
                            <p className="fs-14 ff-Soleil700 fw-bold my-auto">Taxes: </p>
                            <p className="fs-14 ff-Soleil700 fw-bold my-auto">${taxAmount}</p>
                        </div>
                        <hr className="my-auto" />
                        {discountAmount > 0 ? (
                            <>
                                <div className="d-flex justify-content-between mx-2 mt-2">
                                    <p className="fs-14 ff-Soleil700 fw-bold my-auto">
                                        Discount:{' '}
                                    </p>
                                    <p className="fs-14 ff-Soleil700 fw-bold my-auto">
                                        ${discountAmount}
                                    </p>
                                </div>
                                <hr className="my-auto" />
                            </>
                        ) : (
                            <></>
                        )}
                        <div className="d-flex justify-content-between mx-2 mt-2">
                            <p className="fs-14 ff-Soleil700 fw-bold my-auto">Total: </p>
                            <p className="fs-14 ff-Soleil700 fw-bold my-auto">
                                ${totalAmount}
                            </p>
                        </div>
                        <div
                            className=""
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                            {/* <button type="button" className={`btn btn-dark fs-13 fs-md-10 rounded-pill text-uppercase ff-Soleil400 ${(token && token != 'undefined') ? 'w-40' : 'w-60 mx-auto'} mt-3`} data-bs-dismiss="offcanvas" onClick={() => { router.push('/cart') }}
                                >View Cart</button> */}
                            <button
                                type="button"
                                className="btn btn-dark fs-13 fs-md-10 rounded-pill text-uppercase ff-Soleil400 w-40 mt-3"
                                data-bs-dismiss="offcanvas"
                                onClick={() => {
                                    router.push('/cart');
                                }}
                            >
                                View Cart
                            </button>
                            {token && token != 'undefined' ? (
                                <button
                                    type="button"
                                    className="btn btn-dark fs-13 fs-md-10 w-40 mt-3 ff-Soleil400 text-uppercase rounded-pill"
                                    onClick={() => {
                                        handleCheckout();
                                    }}
                                >
                                    Proceed to checkout
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-dark fs-13 fs-md-10 w-40 mt-3 ff-Soleil400 text-uppercase rounded-pill"
                                    onClick={() => {
                                        handleCheckout();
                                    }}
                                >
                                    Guest checkout
                                </button>
                            )}
                        </div>
                        <p className="fs-10 ff-Soleil400 text-secondary my-2 text-center">
                            *Due to regulations, cannabis purchases are limited to 28.5g. Your
                            cart may not accurately reflect limitations. Orders will be
                            verified during checkout.
                        </p>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
