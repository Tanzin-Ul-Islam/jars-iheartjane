import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from "../../config/serverPoint";
import api from "../../config/api.json";

export const ApiCore = createApi({
    reducerPath: 'ApiCore',
    baseQuery: fetchBaseQuery({
        baseUrl: server + "api/v1/"
    }),
    endpoints: (builder) => ({
        getAboutPageCms: builder.query({ query: () => api.about.aboutPageCmsURL }),
        getContactPageCms: builder.query({ query: (storeId) => `${api.contact.contactPageCmsURL}?storeId=${storeId}` }),
        getFaqPageCms: builder.query({ query: () => api.faq.faqCmsURL }),
        getQuizPageCms: builder.query({ query: () => api.quiz.quizCmsURL }),
        getLandingPageCms: builder.query({ query: () => api.landing.landingPageCmsURL }),
        getPrivacyPolicyCms: builder.query({ query: () => api.privacyPolicy.privacyPolicyCmsURL }),
        getTermsOfServiceCms: builder.query({ query: () => api.termsOfService.termsOfServiceCmsURL }),
        getCookiesSettingsCms: builder.query({ query: () => api.cookiesSettings.cookiesSettingsCmsURL }),
        getFooterCms: builder.query({ query: () => api.footer.footerCmsURL }),
        getHomeCms: builder.query({ query: (param) => api.home.homeCmsURL + '?stateCode=' + param }),
        getCareerContent: builder.query({ query: () => api.career.careerURL }),
        getCartPageCms: builder.query({ query: () => api.cart.cartPageCmsURL }),
        getHeaderPageCms: builder.query({ query: () => api.header.headerPageCmsURL }),
        getDiscoverHoverCms: builder.query({ query: () => api.header.discoverHoverCmsURL }),
        getHoverModalCms: builder.query({ query: () => api.discover.hoverModalCmsURL }),
        getModalCms: builder.query({ query: () => api.discover.modalCmsURL }),
        getArticlePageCms: builder.query({ query: () => api.article.ArticleCmsURL }),
        getAgeVerificationCms: builder.query({ query: () => api.ageVerification.ageVerificationCmsURL }),
        getPressReleaseData: builder.query({ query: () => api.pressRelease.requestURL }),
        getCareerDetails: builder.query({ query: ({ id }) => api.career.careerDetails + id }),
        getSectionEightCms: builder.query({ query: () => api.home.sectionEightCmsURL }),
        getSectionNineCms: builder.query({ query: () => api.home.sectionNineCmsURL }),
        getHomePageSectionFourSlider: builder.query({ query: () => api.home.homePageSectionFourSlider }),
        getHomePageSectionFiveCms: builder.query({ query: () => api.home.homePageSectionFiveCmsURL }),
        getHighDealsCms: builder.query({ query: () => api.cart.highDealsCmsURL }),
        getRelatedProductCms: builder.query({ query: () => api.product.relatedProductCmsURL }),
        getHowToEnjoyCms: builder.query({ query: () => api.product.howToEnjoyCmsURL }),
        getDiscoverCms: builder.query({ query: () => api.product.discoverCmsURL }),
        getReserveTimeCms: builder.query({ query: () => api.product.reserveTimeCmsURL }),
        getHomePageSectionTwo: builder.query({ query: () => api.home.homePageSectionTwoURL }),
        getHomePageNewDropsBanner: builder.query({ query: () => api.home.homePageNewDropsBannerURL }),
        getFeaturedBrands: builder.query({ query: () => api.featured.featuredBrand }),
        getHomePageSectionEight: builder.query({ query: () => api.home.homePageSectionEightURL }),
        getHomePageSectionFive: builder.query({ query: () => api.home.homePageSectionFiveURL }),
        getJarsSectionOneCms: builder.query({ query: () => api.jarsplus.jarsSectionOneCmsURL }),
        getJarsSectionTwoTopCms: builder.query({ query: () => api.jarsplus.jarsSectionTwoTopCmsURL }),
        getJarsSectionTwoBottomCms: builder.query({ query: () => api.jarsplus.jarsSectionTwoBottomCmsURL }),
        getJarsSectionThreeCms: builder.query({ query: () => api.jarsplus.jarsSectionThreeCmsURL }),
        getUserPageBannerCms: builder.query({ query: () => api.cms.userPageBannerCms }),
        getUserPageBannerComponentUI: builder.query({ query: () => api.componentUI.userPageBannerComponentUI }),
        getArticleCategoryURL: builder.query({ query: () => api.article.ArticleCategoryURL }),
        getPressReleaseCategoryURL: builder.query({ query: () => api.pressRelease.pressReleaseCategoryURL }),
        getContactReasonURL: builder.query({ query: () => api.contact.contactReasonURL }),
        getRetailerAllData: builder.mutation({
            query: () => ({
                url: api.retailerAll.retailerAllURL,
                method: 'POST'
            })
        }),
        getRetailerData: builder.mutation({
            query: (data) => ({
                url: api.retailerAll.retailerURL,
                method: 'POST'
            })
        }),
        getRetailerSearchData: builder.mutation({
            query: (data) => ({
                url: api.retailerAll.searchRetailerAllURL + data,
                method: 'POST'
            })
        }),
        getRetailerFilterAllData: builder.mutation({
            query: (data) => ({
                url: api.retailerAll.searchRetailerFilterAllURL + data,
                method: 'POST',
                body: data
            })
        }),
        getAllOrder: builder.mutation({
            query: ({ data }) => ({
                url: api.order.getAllOrder,
                method: 'POST',
                body: data
            })
        }),
        getSingleOrder: builder.mutation({
            query: ({ data }) => ({
                url: api.order.getSingleOrder,
                method: 'POST',
                body: data
            })
        }),
        getHeaderBannerContent: builder.mutation({ query: () => api.header.headerBannerCms }),
        getInstagramCmsContent: builder.mutation({ query: () => api.cms.instagram }),
        getInstagramContent: builder.mutation({ query: () => api.cms.instagramImages }),
        getDiscoverHighlightsComponentUIContent: builder.mutation({ query: () => api.cms.productDetailsComponentUI }),
        getFooterCmsData: builder.mutation({ query: () => api.footer.footerCmsURL }),
        getCareerContentData: builder.mutation({ query: () => api.career.careerURL }),
        getCareerDepartmentDetailsData: builder.mutation({ query: (url) => `${api.career.careerListURL}${url}` }),
        getCareerList: builder.mutation({ query: (url) => `${api.career.careerListURLNew}${url}` }),
        getRetailerElasticSearch: builder.mutation({
            query: ({ data }) => ({
                url: api.retailerAll.retailerElasticSearch,
                method: 'POST',
                body: data
            })
        }),
    })
});

export const {
    useGetAboutPageCmsQuery,
    useGetContactPageCmsQuery,
    useGetFaqPageCmsQuery,
    useGetQuizPageCmsQuery,
    useGetLandingPageCmsQuery,
    useGetPrivacyPolicyCmsQuery,
    useGetTermsOfServiceCmsQuery,
    useGetCookiesSettingsCmsQuery,
    useGetFooterCmsQuery,
    useGetHomeCmsQuery,
    useGetCareerContentQuery,
    useGetCartPageCmsQuery,
    useGetHeaderPageCmsQuery,
    useGetDiscoverHoverCmsQuery,
    useGetHoverModalCmsQuery,
    useGetModalCmsQuery,
    useGetAgeVerificationCmsQuery,
    useGetArticlePageCmsQuery,
    useGetRetailerDataMutation,
    useGetRetailerSearchDataMutation,
    useGetPressReleaseDataQuery,
    useGetCareerDetailsQuery,
    useGetSectionEightCmsQuery,
    useGetSectionNineCmsQuery,
    useGetHomePageSectionFourSliderQuery,
    useGetHomePageSectionFiveCmsQuery,
    useGetHighDealsCmsQuery,
    useGetRelatedProductCmsQuery,
    useGetHowToEnjoyCmsQuery,
    useGetDiscoverCmsQuery,
    useGetReserveTimeCmsQuery,
    useGetHomePageSectionTwoQuery,
    useGetHomePageNewDropsBannerQuery,
    useGetFeaturedBrandsQuery,
    useGetHomePageSectionEightQuery,
    useGetHomePageSectionFiveQuery,
    useGetAllOrderMutation,
    useGetSingleOrderMutation,
    useGetJarsSectionOneCmsQuery,
    useGetJarsSectionTwoTopCmsQuery,
    useGetJarsSectionTwoBottomCmsQuery,
    useGetJarsSectionThreeCmsQuery,
    useGetRetailerAllDataMutation,
    useGetRetailerFilterAllDataMutation,
    useGetHeaderBannerContentMutation,
    useGetInstagramCmsContentMutation,
    useGetInstagramContentMutation,
    useGetDiscoverHighlightsComponentUIContentMutation,
    useGetFooterCmsDataMutation,
    useGetCareerContentDataMutation,
    useGetCareerDepartmentDetailsDataMutation,
    useGetRetailerElasticSearchMutation,
    useGetCareerListMutation,
    useGetUserPageBannerCmsQuery,
    useGetUserPageBannerComponentUIQuery,
    useGetArticleCategoryURLQuery,
    useGetPressReleaseCategoryURLQuery,
    useGetContactReasonURLQuery,
} = ApiCore;