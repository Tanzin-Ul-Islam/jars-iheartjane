import { useSelector } from "react-redux";
import Head from "next/head";
import React from 'react'

export default function HeaderTitles({ title = '', isProductDetails = false }) {
    const { pageTitles } = useSelector((store) => (store.globalStore));
    return (
        <Head>
            {
                isProductDetails ?
                <title>{title}</title> :
                <title>{title ? pageTitles[title] : 'Jars'}</title>
            }
        </Head>
    )
}
