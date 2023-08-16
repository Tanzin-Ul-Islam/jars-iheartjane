import React from "react";
import Header from "../commonLayout/header";
import Footer from "../commonLayout/footer";
import { useRouter } from "next/router";
import SiteLoader from "../SiteLoader/SiteLoader";
import { useSelector } from 'react-redux';

export default function Layout({ children }) {
    const router = useRouter()

    let { siteLoader } = useSelector(store => (store.globalStore));

    return (
        
        <>
            <noscript>
                <iframe 
                    src="https://www.googletagmanager.com/ns.html?id=GTM-5LZHCXM"
                    height="0" 
                    width="0" 
                    style={{display:"none", visibility:"hidden"}}>
                </iframe>
            </noscript>
            { 
                router.pathname === '/' || router.pathname === '/pick-up-medical' || router.pathname === '/delivery-medical' ?
                    '' : !siteLoader && (<Header />)
            }
            < div className="main-body">
                {children}
            </div >
            {!siteLoader && <Footer />}
        </>
    )
}
