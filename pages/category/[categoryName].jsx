import ProductList from "../../components/ProductList"
import React from 'react'
import Banner from "../../components/Banner"
import { useGetFaqPageCmsQuery } from "../../redux/api_core/apiCore";
import HeaderTitles from "../../components/HeaderTitles";
import Head from "next/head";
import { useSelector } from 'react-redux';

export default function Category() {

    const { pageMeta } = useSelector((store) => (store.globalStore));
    const { commonBannerCmsData } = useSelector((store) => store.globalStore);

    return (
        <>
            <Head>
                <>
                    <meta
                        name="description"
                        content={pageMeta?.categoryPageMetaDescription}
                    />
                    <meta
                        name="keywords"
                        content={pageMeta?.categoryPageMetaKeyword}
                    />
                </>
            </Head>
            <HeaderTitles title={'categoryPageTitle'} />
            <Banner commonBannerCmsData={commonBannerCmsData} />
            <div className="my-2 my-lg-4" />
            <ProductList route={'category'} />
        </>
    )
}