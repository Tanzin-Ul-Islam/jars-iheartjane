import 'bootstrap-icons/font/bootstrap-icons.scss'
import 'bootstrap/scss/bootstrap.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/globals.css'
import '../styles/career.css'
import '../styles/career-details.css'
import Layout from "../components/layouts/layout";
import Meta from "../components/meta/meta";
import HandleInitialState from '../components/HandleInitialState';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from "react";
import Modal from "../components/reserveTime/modal";
import { Provider, useSelector } from 'react-redux';
import { store } from '../redux/store';
import SiteLoader from '../components/SiteLoader/SiteLoader';
import { InfinitySpin } from 'react-loader-spinner'
import 'boxicons/css/boxicons.css';
import styles from '../styles/App.module.css'
import CartCanvas from "../components/CartCanvas"
import PickupCart from '../components/PickupCart';
import 'react-loading-skeleton/dist/skeleton.css'
import { useRouter } from 'next/router';
import server from '../config/server.json';
import ScrollToTopButton from '../components/scrollToTopButton';
import ScrollToTopOnReload from '../components/scrollToTop';
import version from '../version.json';
import checkBot from '../middleware/checkBot';
import HandleSelectDefaultRetailer from '../components/HandleSelectDefaultRetailer';


export default function App({ Component, pageProps }) {
    const appVersion = version.buildVersion;
    const router = useRouter();
    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
        AOS.init({
            offset: 100,
        });
    }, []);

    // for checking if retailer is selected. if not it will redirect to root
    useEffect(() => {
        const seletedStore = localStorage.getItem('selected-retailer') ? localStorage.getItem('selected-retailer') : 'undefined'
        if (router.pathname == '/age-verification' || router.pathname == '' || router.pathname == '/' || router.pathname == '/retailer' || router.pathname == '/terms-policy' || router.pathname == '/privacy-policy' || router.pathname == '/cookies-settings' || router.pathname == '/forgot-password' || router.pathname == '/reset-password/[[...params]]' || router.pathname == '/product-details/[id]' || router.pathname == '/[...store]') {
            return;
        }
        else if (seletedStore && seletedStore == 'undefined') {
            router.push('/')
        }

    }, [router])

    const [isLoader, setLoader] = useState(true);

    setTimeout(() => {
        setLoader(false);
    }, 300);

    const resetLocalStorage = () => {
        localStorage.clear();
        localStorage.setItem('userVersion', appVersion);
        window.location.href = '/age-verification';
        window.location.reload();
        // router.push('/age-verification');
    }

    useEffect(() => {
        // const selectedPage = localStorage.getItem("initial-page");
        // if (!selectedPage || selectedPage == "false") {
        //     router.push('/age-verification');
        // }
        // console.log('checking version')
        const userVersion = localStorage.getItem('userVersion');
        // console.log(localStorage.getItem('userVersion'))
        // console.log(!userVersion || userVersion !== appVersion)
        if (!userVersion || userVersion !== appVersion) {
            resetLocalStorage();
        }
    }, [])


    return (

        <>
            <Provider store={store}>
                <Meta />
                {checkBot() && <HandleSelectDefaultRetailer />}
                <HandleInitialState />
                <SiteLoader />
                <CartCanvas />
                <PickupCart />
                <ScrollToTopOnReload />
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                <Modal />
                <ScrollToTopButton />
            </Provider>
        </>
    )
}

{/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', minWidth: '100vw', paddingLeft: '70px' }} className={styles.infinitySpin}>
                            <div style={{ marginLeft: '70px' }}>
                                <InfinitySpin
                                    width="300"
                                    color="#212529"
                                    wrapperStyle={{ minWidth: '100vw', minHeight: '100vh' }}
                                    visible={false}
                                />
                            </div>
                        </div> */}
