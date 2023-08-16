import { createSlice } from '@reduxjs/toolkit'
import { initialState } from "./initialState"

export const globalSlice = createSlice({
    name: 'globalStore',
    initialState,

    reducers: {
        setInitialPage: (state, actions) => {
            state.initialPage = actions.payload;

        },
        setToken: (state, actions) => {
            state.token = actions.payload;
        },

        setSelectedRetailer: (state, actions) => {
            state.selectedRetailer = actions.payload;
        },

        setCurrentPage: (state, actions) => {
            state.currentPage = actions.payload
        },

        setSiteLoader: (state, actions) => {
            state.siteLoader = actions.payload
        },
        setOffset: (state, actions) => {
            state.offset = actions.payload
        },
        setCheckoutId(state, actions) {
            state.checkoutId = actions.payload;
        },
        setAllRetailer(state, actions) {
            state.allRetailer = actions.payload;
        },
        setRetailerType(state, actions) {
            state.retailerType = actions.payload;
        },
        setActiveRetailerType(state, actions) {
            state.activeRetailerType = actions.payload;
        },
        setCategories(state, actions) {
            //state.categories = actions.payload;
            const excludedCategories = ['CBD', 'SEEDS'];
            state.categories = actions.payload.filter(category => !excludedCategories.includes(category.categoryName))
        },
        setPrevRetailerId(state, actions) {
            state.prevRetailerId = actions.payload;
        },
        setPrevPage(state, actions) {
            state.prevPage = actions.payload;
        },
        setUserInfo(state, actions) {
            state.userInfo = actions.payload;
        },
        setQuizInfo(state, actions) {
            state.quizInfo = actions.payload;
        },
        setPageTitles(state, actions) {
            state.pageTitles = actions.payload;
        },
        setBrandQueryValue: (state, action) => {
            state.brandQueryValue = action.payload;
        },
        setCategoryQueryValue: (state, action) => {
            state.categoryQueryValue = action.payload;
        },
        setStrainTypeQueryValue: (state, action) => {
            state.strainTypeQueryValue = action.payload;
        },
        setTodaySpecialsValue: (state, action) => {
            state.todaySpecialsValue = action.payload;
        },
        setGlobalEffects: (state, action) => {
            state.globalEffects = action.payload;
        },

        setEffectValue: (state, action) => {
            state.effectValue = action.payload;
        },

        setPageMeta(state, actions) {
            state.pageMeta = actions.payload;
        },

        //cms
        setCmsData(state, actions) {
            state.cmsData = actions.payload;
        },

        setSocialPackData(state, actions) {
            state.socialPackData = actions.payload;
        },

        setHeaderBannerCmsData(state, actions) {
            state.headerBannerCmsDataJSON = actions.payload;
        },

        setHeaderCmsData(state, actions) {
            state.Headerdata = actions.payload;
        },

        setServiceTypeCmsData(state, actions) {
            state.hoverModalCms = actions.payload;
        },

        setShopBannerCmsData(state, actions) {
            state.shopBannerCmsData = actions.payload;
        },

        setCommonBannerCmsData(state, actions) {
            state.commonBannerCmsData = actions.payload;
        },

        //cms end

        setPriceFilter(state, actions) {
            state.priceFilter = actions.payload;
        },

        setFilterPriceValue(state, actions) {
            state.filterPriceValue = actions.payload;
        },

        setAllFormatedRetailer(state, action) {
            state.allFormatedRetailer = action.payload;
        },

        setUserSelectRetailerState(state, action) {
            state.userSelectRetailerState = action.payload;
        },

        setCategoryLoader(state, action) {
            state.categoryLoader = action.payload;
        },

        setEffectLoader(state, action) {
            state.effectLoader = action.payload;
        },

        setFirstPopupForState(state, action) {
            state.firstPopupForState = action.payload;
        },

        setPopupModal(state, action) {
            state.popupModal = action.payload;
        },

        setSecondPopupModal(state, action) {
            state.secondPopupModal = action.payload;
        },
        setShopFilter(state, action) {
            state.shopFilter = action.payload;
        },
        setFilterLoader(state, action) {
            state.filterLoader = action.payload;
        },
        setFilterVariants(state, action) {

            //console.log('action.payload = ', action.payload);
            state.filterVariants = action.payload;

            //Newly added code to exclude the categories 
            const excludedCategories = ['CBD', 'SEEDS'];
            state.filterVariants.category = state.filterVariants.category.filter(category => !excludedCategories.includes(category))
            //console.log('state.filterVariants.category = ', state.filterVariants.category);
        },
        setCurrentSpecialOffer(state, action) {
            state.currentSpecialOffer = action.payload;
        },
        setTodaySpecialLoader(state, action) {
            state.todaySpecialLoader = action.payload;
        },
        setTopTickerComponentUI(state, action) {
            state.topTickerComponentUI = action.payload;
        },

        //component ui
        setArticleComponentUI(state, action) {
            state.articleComponentUI = action.payload;
        },
        setArticleDetailsComponentUI(state, action) {
            state.articleDetailsComponentUI = action.payload;
        },
        setPressComponentUI(state, action) {
            state.pressComponentUI = action.payload;
        },
        setPressDetailsComponentUI(state, action) {
            state.pressDetailsComponentUI = action.payload;
        },
        setContactComponentUI(state, action) {
            state.contactComponentUI = action.payload;
        },
        setCareerComponentUI(state, action) {
            state.careerComponentUI = action.payload;
        },
        setAboutComponentUI(state, action) {
            state.aboutComponentUI = action.payload;
        },
        setTermsComponentUI(state, action) {
            state.termsComponentUI = action.payload;
        },
        setPrivacyComponentUI(state, action) {
            state.privacyComponentUI = action.payload;
        },
        setCookieComponentUI(state, action) {
            state.cookieComponentUI = action.payload;
        },
        setFaqComponentUI(state, action) {
            state.faqComponentUI = action.payload;
        },
        setLandingComponentUI(state, action) {
            state.landingComponentUI = action.payload;
        },
        setJarsPlusComponentUI(state, action) {
            state.jarsPlusComponentUI = action.payload;
        },
        setMenuTypeValue(state, action) {
            state.menuTypeValue = action.payload;
        },
        setHomePageMobileCategory(state, action) {
            state.homePageMobileCategory = action.payload;
        },
        setLoginPageCms(state, action) {
            state.loginPageCms = action.payload;
        },
        setRegisterPageCms(state, action) {
            state.registerPageCms = action.payload;
        },
        setLoginPageComponentUI(state, action) {
            state.loginPageComponentUI = action.payload;
        },
        setRegisterPageComponentUI(state, action) {
            state.registerPageComponentUI = action.payload;
        },
        setShopBannerComponentUI(state, action) {
            state.shopBannerComponentUI = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    setToken,
    setSelectedRetailer,
    setCurrentPage,
    setSiteLoader,
    setOffset,
    setCheckoutId,
    setInitialPage,
    setAllRetailer,
    setRetailerType,
    setCategories,
    setPrevRetailerId,
    setPrevPage,
    setUserInfo,
    setQuizInfo,
    setPageTitles,
    setBrandQueryValue,
    setCategoryQueryValue,
    setStrainTypeQueryValue,
    setTodaySpecialsValue,
    setGlobalEffects,
    setEffectValue,
    setPageMeta,
    setCmsData,
    setSocialPackData,
    setHeaderBannerCmsData,
    setHeaderCmsData,
    setServiceTypeCmsData,
    setCommonBannerCmsData,
    setPriceFilter,
    setFilterPriceValue,
    setAllFormatedRetailer,
    setActiveRetailerType,
    setUserSelectRetailerState,
    setCategoryLoader,
    setEffectLoader,
    setFirstPopupForState,
    setPopupModal,
    setSecondPopupModal,
    setShopFilter,
    setFilterLoader,
    setFilterVariants,
    setCurrentSpecialOffer,
    setTodaySpecialLoader,
    setCareerStoreName,
    setTopTickerComponentUI,
    setHighDetalsDataCheck,
    setArticleComponentUI,
    setArticleDetailsComponentUI,
    setPressComponentUI,
    setPressDetailsComponentUI,
    setContactComponentUI,
    setCareerComponentUI,
    setAboutComponentUI,
    setTermsComponentUI,
    setPrivacyComponentUI,
    setCookieComponentUI,
    setFaqComponentUI,
    setLandingComponentUI,
    setJarsPlusComponentUI,
    setMenuTypeValue,
    setHomePageMobileCategory,
    setLoginPageCms,
    setRegisterPageCms,
    setLoginPageComponentUI,
    setRegisterPageComponentUI,
    setShopBannerCmsData,
    setShopBannerComponentUI
} = globalSlice.actions

export default globalSlice.reducer