import React, { useEffect, useRef } from 'react'
import { setInitialPage, setSelectedRetailer, setToken, setCheckoutId, setAllRetailer, setRetailerType, setCategories, setPrevRetailerId, setUserInfo, setPageTitles, setTodaySpecialsValue, setGlobalEffects, setPageMeta, setCmsData, setSocialPackData, setHeaderBannerCmsData, setHeaderCmsData, setServiceTypeCmsData, setCommonBannerCmsData, setAllFormatedRetailer, setActiveRetailerType, setUserSelectRetailerState, setCategoryLoader, setEffectLoader, setFilterLoader, setFilterVariants, setTodaySpecialLoader, setTopTickerComponentUI, setArticleComponentUI, setArticleDetailsComponentUI, setPressComponentUI, setPressDetailsComponentUI, setContactComponentUI, setCareerComponentUI, setAboutComponentUI, setTermsComponentUI, setCookieComponentUI, setFaqComponentUI, setLandingComponentUI, setPrivacyComponentUI, setJarsPlusComponentUI, setHomePageMobileCategory, setMenuTypeValue, setLoginPageCms, setRegisterPageCms, setLoginPageComponentUI, setRegisterPageComponentUI, setShopBannerCmsData, setShopBannerComponentUI } from "../redux/global_store/globalReducer";
import { useSelector, useDispatch } from 'react-redux';
import { setCartList, setCartCounter, setTotalAmont, setTaxAmont, setCheckoutUrl, setDiscount, setSubTotal, setCartCounterObj, setCartCountDown } from '../redux/cart_store/cartReducer';
import { setWishlist, setWishlistCounter } from '../redux/wishlist_store/wishlistReducer';
import api from "../config/api.json"
import { postData, fetchData } from '../utils/FetchApi';
import { useRouter } from 'next/router';
import useDidMountEffect from '../custom-hook/useDidMount';
import { fetchAllRetailers } from '../utils/dutchieQuery';
import { getGraphQLClient } from '../utils/graphqlClient';
export default function HandleInitialState() {

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];

    const hasRunRef = useRef(false);
    const dispatch = useDispatch();
    const { token, checkoutId, selectedRetailer, prevRetailerId, userInfo, pageTitles, filterVariants } = useSelector((store) => (store.globalStore));
    const { cartList, cartCounter, cartCounterObj } = useSelector((store) => (store.cartStore));
    const didMount = useRef(false);

    const getCategoryService = async () => {
        try {
            dispatch(setCategoryLoader(true))
            const response = await fetchData(api.category.getStateWiseCategory + '?stateCode=' + selectedRetailer?.addressObject?.state);
            if (response.statusCode === 200) {
                // console.log(response?.data)
                dispatch(setCategories(response?.data));
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setCategoryLoader(false))
        }
    }

    async function getFilterVariants() {
        try {
            dispatch(setFilterLoader(true))
            const response = await fetchData(api.product.productVariants + '?stateCode=' + selectedRetailer?.addressObject?.state);
            const category = response.category;
            category.unshift("ALL CATEGORY");
            const effects = response.effects;
            const strains = response.strainType;
            const payLoad = {
                category: category,
                effects: effects,
                strains: strains
            }
            dispatch(setFilterVariants(payLoad));
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setFilterLoader(false));
        }
    }

    function handleUserInfo() {
        let id = localStorage.getItem('userId');
        let email = localStorage.getItem('email');
        let firstName = localStorage.getItem('firstName');
        let lastName = localStorage.getItem('lastName');
        let birthdayDate = localStorage.getItem('birthdayDate');
        let phone = localStorage.getItem('phone');
        let image = localStorage.getItem('image');
        let userInfo = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            birthdayDate: birthdayDate,
            image: image,
        }
        dispatch(setUserInfo(userInfo));
    }

    async function getCommonCms() {
        try {
            const response = await fetchData(api.cms.common);
            if (response.statusCode == 200) {
                const data = response.data;
                //page titles
                const pageTitles = data?.pageTitleCMS?.length > 0 ? data?.pageTitleCMS[0] : {}
                const pageMeta = data?.pageMetaCMS?.length > 0 ? data?.pageMetaCMS[0] : {}
                const cmsData = data?.cmsData?.length > 0 ? data?.cmsData[0] : {}
                const headerBannerCmsData = data?.headerBannerCmsData?.length > 0 ? data?.headerBannerCmsData[0] : {}
                const headerCmsData = data?.headerCmsData?.length > 0 ? data?.headerCmsData[0] : {}
                const serviceTypeCmsData = data?.serviceTypeCmsData?.length > 0 ? data?.serviceTypeCmsData[0] : {}
                const socialPackData = data?.socialPackData?.length > 0 ? data?.socialPackData : {}
                const commonBannerCmsData = data?.commonBannerCmsData?.length > 0 ? data.commonBannerCmsData[0] : {}
                const topTickerComponentUI = data?.topTicker?.length > 0 ? data.topTicker[0] : {};
                const cartCounterObj = data?.cartCounter?.length > 0 ? data.cartCounter[0] : {};
                const homePageMobileCategory = data?.homePageMobileCategory?.length > 0 ? data.homePageMobileCategory[0] : {};
                const loginPageCms = data?.loginPageCms?.length > 0 ? data.loginPageCms[0] : {};
                const registerPageCms = data?.registerPageCms?.length > 0 ? data.registerPageCms[0] : {};
                const shopPageBannerCmsRepo = data?.shopPageBannerCmsRepo?.length > 0 ? data.shopPageBannerCmsRepo[0] : {};
                dispatch(setPageTitles(pageTitles));
                dispatch(setPageMeta(pageMeta));
                dispatch(setCmsData(cmsData));
                dispatch(setSocialPackData(socialPackData));
                dispatch(setHeaderBannerCmsData(headerBannerCmsData));
                dispatch(setHeaderCmsData(headerCmsData));
                dispatch(setServiceTypeCmsData(serviceTypeCmsData));
                dispatch(setCommonBannerCmsData(commonBannerCmsData));
                dispatch(setTopTickerComponentUI(topTickerComponentUI));
                dispatch(setCartCounterObj(cartCounterObj));
                dispatch(setHomePageMobileCategory(homePageMobileCategory));
                dispatch(setLoginPageCms(loginPageCms));
                dispatch(setRegisterPageCms(registerPageCms));
                dispatch(setShopBannerCmsData(shopPageBannerCmsRepo));

                //component ui
                const ui = data.componentUI;
                dispatch(setArticleComponentUI(ui.articleComponentUI.length > 0 ? ui.articleComponentUI[0] : {}));
                dispatch(setArticleDetailsComponentUI(ui.articleDetailsComponentUI.length > 0 ? ui.articleDetailsComponentUI[0] : {}));
                dispatch(setPressComponentUI(ui.pressComponentUI.length > 0 ? ui.pressComponentUI[0] : {}));
                dispatch(setPressDetailsComponentUI(ui.pressDetailsComponentUI.length > 0 ? ui.pressDetailsComponentUI[0] : {}));
                dispatch(setContactComponentUI(ui.contactComponentUI.length > 0 ? ui.contactComponentUI[0] : {}));
                dispatch(setCareerComponentUI(ui.careerComponentUI.length > 0 ? ui.careerComponentUI[0] : {}));
                dispatch(setAboutComponentUI(ui.aboutComponentUI.length > 0 ? ui.aboutComponentUI[0] : {}));
                dispatch(setTermsComponentUI(ui.termsComponentUI.length > 0 ? ui.termsComponentUI[0] : {}));
                dispatch(setPrivacyComponentUI(ui.privacyComponentUI.length > 0 ? ui.privacyComponentUI[0] : {}));
                dispatch(setCookieComponentUI(ui.cookieComponentUI.length > 0 ? ui.cookieComponentUI[0] : {}));
                dispatch(setFaqComponentUI(ui.faqComponentUI.length > 0 ? ui.faqComponentUI[0] : {}));
                dispatch(setLandingComponentUI(ui.landingComponentUI.length > 0 ? ui.landingComponentUI[0] : {}));
                dispatch(setJarsPlusComponentUI(ui.jarsPlusComponentUI.length > 0 ? ui.jarsPlusComponentUI[0] : {}));
                dispatch(setLoginPageComponentUI(ui.loginPageComponentUI.length > 0 ? ui.loginPageComponentUI[0] : {}));
                dispatch(setRegisterPageComponentUI(ui.registerPageComponentUI.length > 0 ? ui.registerPageComponentUI[0] : {}));
                dispatch(setShopBannerComponentUI(ui.shopBannerComponentUiRepo.length > 0 ? ui.shopBannerComponentUiRepo[0] : {}))
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getSpecialOffers() {
        try {
            dispatch(setTodaySpecialLoader(true));
            let data = {
                retailerId: selectedRetailer?.id,
            };
            let response = await postData(api.product.getSpecialOffers, data);
            if (response.status == 200) {
                dispatch(setTodaySpecialsValue(response.data.specials));
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setTodaySpecialLoader(false));
        }
    }

    async function getCartInformation() {
        let checkoutId = localStorage.getItem('checkoutId');
        let retailer = JSON.parse(localStorage.getItem('selected-retailer'));
        let data = {
            "retailerId": retailer.id,
            "checkoutId": checkoutId
        }
        let response = await postData(api.checkout.getCartDetails, data);
        if (response.status == 200) {
            if ('checkout' in response.data && response.data?.checkout != null) {
                let data = response.data.checkout;
                let items = data?.items;
                let priceSummary = data?.priceSummary;

                let subTotal = (priceSummary.subtotal / 100).toFixed(2);
                dispatch(setSubTotal(subTotal));

                let total = (priceSummary.total / 100).toFixed(2);
                dispatch(setTotalAmont(total));

                if (priceSummary.taxes > 0) {
                    let parsedTaxAmount = (priceSummary.taxes / 100).toFixed(2);
                    dispatch(setTaxAmont(parsedTaxAmount));
                }
                if (priceSummary.discounts > 0) {
                    let parsedDiscountAmount = (priceSummary.discounts / 100).toFixed(2);
                    dispatch(setDiscount(parsedDiscountAmount));
                }
                dispatch(setCartList(items));
                dispatch(setCartCounter());
                dispatch(setCheckoutUrl(data.redirectUrl));
            }
        }
    }

    function getWishlistCounterValue() {
        let counter = 0;
        if (localStorage.getItem('wishlist') && localStorage.getItem('wishlist') != 'null') {
            let wishlist = JSON.parse(localStorage.getItem('wishlist'));
            for (let i = 0; i < wishlist?.length; i++) {
                counter = counter + wishlist[i].quantity;
            }
            return counter;
        } else {
            return 0;
        }
    }

    function setWishlistInitialValue() {
        let wishlist = (localStorage.getItem('wishlist') && localStorage.getItem('wishlist') != 'null') ? JSON.parse(localStorage.getItem('wishlist')) : [];
        dispatch(setWishlist(wishlist))
    }

    function setRetailerTypeValue() {
        let retailerType = (localStorage.getItem('retailer_type') && localStorage.getItem('retailer_type') != 'undefined') ? JSON.parse(localStorage.getItem('retailer_type')) : 'undefined';
        dispatch(setRetailerType(retailerType))
    }

    function setActiveRetailerTypeValue() {
        let activeRetailerType = (localStorage.getItem('active_retailer_type') && localStorage.getItem('active_retailer_type') != 'undefined') ? JSON.parse(localStorage.getItem('active_retailer_type')) : 'undefined';
        dispatch(setActiveRetailerType(activeRetailerType))
    }

    function setUserSelectRetailerStateValue() {
        //set user select retailer state
        let userSelectRetailerState = localStorage.getItem('user_selected_retailer_state') && JSON.parse(localStorage.getItem('user_selected_retailer_state')) != 'undefined' ? JSON.parse(localStorage.getItem('user_selected_retailer_state')) : 'undefined';
        dispatch(setUserSelectRetailerState(userSelectRetailerState));
    }

    //set cart counter value
    function setWishListCounterValue() {
        let cartCounter = getWishlistCounterValue();
        dispatch(setWishlistCounter(cartCounter));
    }

    async function handleRetailers() {
        const graphQLClient = getGraphQLClient();
        const query = fetchAllRetailers();
        const gqlResponse = await graphQLClient.request(query);
        const retailerData = gqlResponse.retailers;
        let retailerService = [];

        const apiResponse = await fetchData(api.retailerAll.retailerService);
        if (apiResponse.statusCode == 200) {
            retailerService = apiResponse.data;
        }
        let formatedRetailerData = [];
        retailerData.map((elRetailer) => {
            if (elRetailer?.hours?.delivery?.[dayName]?.active || elRetailer?.hours?.pickup?.[dayName]?.active) {
                retailerService.map((elRetailerService) => {
                    if (elRetailer.id == elRetailerService.retailerId) {

                        if (elRetailerService.retailerMobileNumber) {
                            elRetailer.retailerMobileNumber = elRetailerService.retailerMobileNumber;
                        } else {
                            elRetailer.retailerMobileNumber = null;
                        }
                    }
                });
                formatedRetailerData.push(elRetailer);
            }
        });
        localStorage.setItem('formatedRetailerData', JSON.stringify(formatedRetailerData));
        dispatch(setAllFormatedRetailer(formatedRetailerData));
    }

    function setCountDownValue() {
        const leftTime = localStorage.getItem('countDownTime') ? localStorage.getItem('countDownTime') : null;
        let time = null;
        if (leftTime) {
            time = JSON.parse(leftTime);
        }
        dispatch(setCartCountDown(time));
    }


    function handleSetProductMenuType() {
        const type = localStorage.getItem("menuTypeValue") ? localStorage.getItem("menuTypeValue") : undefined;
        dispatch(setMenuTypeValue(type));
    }

    //init datalayer
    // function handleInitiateDataLayer() {
    //     const viewItemData = { event: "view_item", ecommerce: {} };
    //     const addToCartData = { event: "add_to_cart", ecommerce: {} };
    //     const removeFromCartData = { event: "remove_from_cart", ecommerce: {} };
    //     const beingCheckoutData = { event: "begin_checkout", ecommerce: {} };
    //     const purchaseData = { event: "purchase", ecommerce: {} };
    //     dataLayer.push(viewItemData);
    //     dataLayer.push(addToCartData);
    //     dataLayer.push(removeFromCartData);
    //     dataLayer.push(beingCheckoutData);
    //     dataLayer.push(purchaseData);
    // }

    // function clearSeoInformation() {
    //     localStorage.removeItem('view_item');
    //     localStorage.removeItem('add_to_cart');
    //     localStorage.removeItem('remove_from_cart');
    //     localStorage.removeItem('begin_checkout');
    //     localStorage.removeItem('purchase');
    // }

    // function findIndexByKeyValue(key, value) {
    //     return window.dataLayer.findIndex(function (item) {
    //         return item.hasOwnProperty(key) && item[key] === value;
    //     });
    // }

    // function assignDataToWindowDatalayer() {
    //     //predefine
    //     const viewItemData = { event: "view_item", ecommerce: {} };
    //     const addToCartData = { event: "add_to_cart", ecommerce: {} };
    //     const removeFromCartData = { event: "remove_from_cart", ecommerce: {} };
    //     const beingCheckoutData = { event: "begin_checkout", ecommerce: {} };
    //     const purchaseData = { event: "purchase", ecommerce: {} };

    //     const view_item = localStorage.getItem('view_item') ? JSON.parse(localStorage.getItem('view_item')) : viewItemData;
    //     const add_to_cart = localStorage.getItem('add_to_cart') ? JSON.parse(localStorage.getItem('add_to_cart')) : addToCartData;
    //     const remove_from_cart = localStorage.getItem('remove_from_cart') ? JSON.parse(localStorage.getItem('remove_from_cart')) : removeFromCartData;
    //     const begin_checkout = localStorage.getItem('begin_checkout') ? JSON.parse(localStorage.getItem('begin_checkout')) : beingCheckoutData;
    //     const purchase = localStorage.getItem('purchase') ? JSON.parse(localStorage.getItem('purchase')) : purchaseData;

    //     let viewItemIndex = findIndexByKeyValue('event', 'view_item')
    //     window.dataLayer[viewItemIndex] = view_item;
    //     let addToCartIndex = findIndexByKeyValue('event', 'add_to_cart')
    //     window.dataLayer[addToCartIndex] = add_to_cart;
    //     let removeCartIndex = findIndexByKeyValue('event', 'remove_from_cart')
    //     window.dataLayer[removeCartIndex] = remove_from_cart;
    //     let beginCheckoutIndex = findIndexByKeyValue('event', 'begin_checkout')
    //     window.dataLayer[beginCheckoutIndex] = begin_checkout;
    //     let purchaseIndex = findIndexByKeyValue('event', 'purchase')
    //     window.dataLayer[purchaseIndex] = purchase;
    // }

    useEffect(() => {
        // if (cartList == undefined) {
        //     dispatch(setCartList([]));
        // }
        //set token
        let tokenValue = localStorage.getItem('token') ? localStorage.getItem('token') : 'undefined';
        dispatch(setToken(tokenValue));

        //setting user info in logged in
        if (tokenValue && tokenValue != 'undefined') {
            handleUserInfo()
        }

        //set retailer detials
        let selectedRetialerValue = (localStorage.getItem('selected-retailer') && localStorage.getItem('selected-retailer') != 'undefined') ? JSON.parse(localStorage.getItem('selected-retailer')) : 'undefined';
        dispatch(setSelectedRetailer(selectedRetialerValue));
        dispatch(setPrevRetailerId(selectedRetialerValue?.id));

        //set checkout id
        let checkoutId = (localStorage.getItem('checkoutId') && localStorage.getItem('checkoutId') != 'undefined') ? localStorage.getItem('checkoutId') : 'undefined';
        dispatch(setCheckoutId(checkoutId))

        //initial page state
        let InitialPageStatus = localStorage.getItem('initial-page') && localStorage.getItem('initial-page') != false ? localStorage.getItem('initial-page') : false;
        dispatch(setInitialPage(InitialPageStatus));

        //all retailer state
        let allRetailer = localStorage.getItem('all_retailer') && JSON.parse(localStorage.getItem('all_retailer')) != [] ? JSON.parse(localStorage.getItem('all_retailer')) : [];
        dispatch(setAllRetailer(allRetailer));

        //set retailer type state
        let retailerType = localStorage.getItem('retailer_type') && JSON.parse(localStorage.getItem('retailer_type')) != 'undefined' ? JSON.parse(localStorage.getItem('retailer_type')) : 'undefined';
        dispatch(setRetailerType(retailerType));

        //set active retailer type state
        let activeRetailerType = localStorage.getItem('active_retailer_type') && JSON.parse(localStorage.getItem('active_retailer_type')) != 'undefined' ? JSON.parse(localStorage.getItem('active_retailer_type')) : 'undefined';
        dispatch(setActiveRetailerType(activeRetailerType));

        //set user select retailer state
        let userSelectRetailerState = localStorage.getItem('user_selected_retailer_state') && JSON.parse(localStorage.getItem('user_selected_retailer_state')) != 'undefined' ? JSON.parse(localStorage.getItem('user_selected_retailer_state')) : 'undefined';
        dispatch(setUserSelectRetailerState(userSelectRetailerState));

        // handle wishlist
        //init wishlist value to local storage
        if (!localStorage.getItem('wishlist')) {
            localStorage.setItem('wishlist', 'null');
        }

        //set cart initial value
        setWishlistInitialValue();
        setWishListCounterValue();

        setRetailerTypeValue();
        setActiveRetailerTypeValue();
        setUserSelectRetailerStateValue()

        //get common cms
        getCommonCms();
        handleRetailers();

        //cart countdown
        setCountDownValue();

        //set menu type
        handleSetProductMenuType();

        //init datalayer
        // handleInitiateDataLayer();

    }, []);


    useDidMountEffect(() => {

        if ((localStorage.getItem('checkoutId') && localStorage.getItem('checkoutId') != 'undefined') && (localStorage.getItem('selected-retailer') && localStorage.getItem('selected-retailer') != 'undefined')) {
            getCartInformation();
        }
        // getEffects();

        //clear wish list
        let selectedRetialerValue = (localStorage.getItem('selected-retailer') && localStorage.getItem('selected-retailer') != 'undefined') ? JSON.parse(localStorage.getItem('selected-retailer')) : 'undefined';

        if (selectedRetialerValue != 'undefined' && selectedRetialerValue?.id != prevRetailerId) {
            localStorage.setItem('wishlist', 'null');
            dispatch(setWishlist([]))
            dispatch(setPrevRetailerId(selectedRetialerValue?.id));
            // clearSeoInformation();
        }

        getSpecialOffers();

        setRetailerTypeValue();
        setActiveRetailerTypeValue();
        setUserSelectRetailerStateValue();

        // getEffects();

        // get category service
        getCategoryService()

        //filter variants
        getFilterVariants();

        //assign data to window datalayer
        // assignDataToWindowDatalayer()

    }, [selectedRetailer]);

    //if false
    useDidMountEffect(() => {
        if (cartCounterObj?.enableCartCounter == false) {
            dispatch(setCartCountDown(null));
            localStorage.removeItem("countDownTime");
        }
    }, [cartCounterObj?.enableCartCounter])


    return (
        <></>
    )
}
