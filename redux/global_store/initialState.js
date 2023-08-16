
export const initialState = {
    initialPage: false,
    token: 'undefined',
    selectedRetailer: 'undefined',
    checkoutId: 'undefined',
    currentPage: 0,
    siteLoader: false,
    offset: 0,
    allRetailer: [],
    retailerType: 'undefined',
    activeRetailerType: 'undefined',
    highDetalsDataCheck: false,

    //category
    categories: [],
    categoryLoader: true,

    //product type
    menuTypeValue: undefined,

    //effects
    globalEffects: [],
    effectValue: "",
    effectLoader: true,

    //filter variants
    filterLoader: true,
    filterVariants: {
        category: [],
        effects: [],
        strains: [],
    },

    prevRetailerId: 'undefined',
    prevPage: "",
    userInfo: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthdayDate: "",
        image: ""
    },
    quizInfo: [],
    pageTitles: {},
    brandQueryValue: "",
    categoryQueryValue: "",
    strainTypeQueryValue: "",

    todaySpecialLoader: true,
    todaySpecialsValue: [],



    pageMeta: {},
    cmsData: {},
    headerBannerCmsDataJSON: {},
    Headerdata: {},
    hoverModalCms: {},
    socialPackData: [],
    commonBannerCmsData: {},
    shopBannerCmsData:{},

    //price filter
    priceFilter: false,
    filterPriceValue: null,

    allFormatedRetailer: [],
    userSelectRetailerState: "undefined",
    shopFilter: {},
    firstPopupForState: true,
    popupModal: false,
    secondPopupModal: false,
    currentSpecialOffer: "",
    topTickerComponentUI: "",

    articleComponentUI: "",
    articleDetailsComponentUI: "",
    pressComponentUI: "",
    pressDetailsComponentUI: "",
    contactComponentUI: "",
    careerComponentUI: "",
    aboutComponentUI: "",
    termsComponentUI: "",
    privacyComponentUI: "",
    cookieComponentUI: "",
    faqComponentUI: "",
    landingComponentUI: "",
    jarsPlusComponentUI: "",
    shopBannerComponentUI: {},
    customAZList: [
        { name: "JARS Cannabis – Metro", address: "10040 N Metro Pkwy W, Phoenix, AZ, 85051", open: '8 AM', end: '10 PM', link: "https://az.jarscannabis.com/" },
        { name: "24TH ST & UNIVERSITY", address: "2424 S 24th St, Phoenix, AZ 85034", open: '8 AM', end: '10 PM', link: "https://az.jarscannabis.com/24th-street-phoenix/" },
        {
        name: "BULLHEAD", address: "3550 North Ln. Ste 110 Bullhead City, AZ 86442", open: '7 AM', end: '10 PM', link: "https://az.jarscannabis.com/bullhead/" },
        {
        name: "CAVE CREEK", address: "12620 N Cave Creek Rd Suite #1, Phoenix, AZ 85022", open: '8 AM', end: '10 PM', link: "https://az.jarscannabis.com/cave-creek/" },
        {
        name: "GLOBE", address: "2250 US-60, Globe, AZ 85501", open: '7 AM', end: '10 PM', link: "https://az.jarscannabis.com/globe/" },
        {
        name: "PHOENIX METRO CENTER", address: "10040 N Metro Pkwy W, Phoenix, AZ 85051", open: '7 AM', end: '10 PM', link: "https://az.jarscannabis.com/phoenix/adultuse-metrocenter/" },
        {
        name: "NEW RIVER", address: "46639 N Black Canyon Hwy #1, New River, AZ 85087", open: '7 AM', end: '10 PM', link: "https://az.jarscannabis.com/new-river-adult-menu/" },
        {
        name: "NORTH PHOENIX", address: "20224 North 27th Avenue, Phoenix, AZ 85027", open: '8 AM', end: '10 PM', link: "https://az.jarscannabis.com/north-phoenix/" },
        {
        name: "PAYSON", address: "200 N Tonto St Suite A, Payson, AZ 85541", open: '8 AM', end: '9 PM', link: "https://az.jarscannabis.com/payson/" },
        {
        name: "PEORIA", address: "20340 N Lake Pleasant Rd, Peoria, AZ 85382", open: '7 AM', end: '10 PM', link: "https://az.jarscannabis.com/peoria/" },
        {
        name: "SAFFORD", address: "1809 W Thatcher Blvd, Safford, AZ 85546", open: '9 AM', end: '9 PM', link: "https://az.jarscannabis.com/safford/" },
        {
        name: "SOMERTON", address: "3345 W County 15th St, Somerton, AZ 86350", open: '7 AM', end: '10 PM', link: "https://az.jarscannabis.com/somerton" }
    ],
    cartCountDown: null,
    cartCounterObj: undefined,
    triggerCounter: false,
    homePageMobileCategory: {},
    loginPageCms: {},
    registerPageCms: {},
    loginPageComponentUI: {},
    registerPageComponentUI: {},
}
