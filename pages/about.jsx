import Styles from '../components/homePage/css/Home.module.css';
import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  BsArrowRightShort,
  BsInstagram,
  BsTelephone,
  BsYoutube,
} from 'react-icons/bs';
import Link from 'next/link';
import Banner from '../components/Banner';
import { FaFacebookF, FaTiktok } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlineChat } from 'react-icons/hi';
import Slider_one from '../components/SliderOne';
import { useRouter } from 'next/router';
import homeInfo from '../cms-data/homeCms';
import {
  useGetAboutPageCmsQuery,
} from '../redux/api_core/apiCore';
import AboutCmsInterface from '../interfaces/AboutInterface';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import { setSiteLoader } from '../redux/global_store/globalReducer';
// import styles from "react-loading-overlay-ts/dist/styles";
import Script from 'next/script';
import HeaderTitles from '../components/HeaderTitles';
import Slider_two from '../components/SliderTwo';
import Skeleton from 'react-loading-skeleton';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Button from '../components/Button';
import ThreeCard from '../components/ThreeCard';
import Image from 'next/image';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className="next" onClick={onClick}>
      <FiChevronRight />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className="previous" onClick={onClick}>
      <FiChevronLeft />
    </div>
  );
}

export default function About() {
    const router = useRouter()
    const { pageMeta, aboutComponentUI } = useSelector((store) => store.globalStore);
    let dispatch = useDispatch();


  const { data, isSuccess, isFetching, error } = useGetAboutPageCmsQuery();

    // let cmsData = data?.data?.cmsData[0];
    // let commonBannerCmsData = data?.data?.commonBannerCmsData[0];
    // let dropBannerCmsData = data?.data?.dropBannerCmsData[0];
    // let homeSectionThreeCmsData = data?.data?.homeSectionThreeCmsData[0];
    // let sectionTwoData = data?.data?.sectionTwoData;
    // let socialData = data?.data?.socialPackData;

    let header = data?.data?.aboutPageHeaderCmsData[0];
    let sectionOne = data?.data?.aboutPageSectionOneCmsData[0];
    let sectionTwo = data?.data?.aboutPageSectionTwoCmsData[0];
    let sectionThree = data?.data?.aboutPageSectionThreeCmsData[0];

    const aboutCards = [
        {
            img: `${sectionTwo?.imageOne}`,
            title: `${sectionTwo?.titleOne}`,
            desc: `${sectionTwo?.descriptionOne}`
        },
        {
            img: `${sectionTwo?.imageTwo}`,
            title: `${sectionTwo?.titleTwo}`,
            desc: `${sectionTwo?.descriptionTwo}`
        },
        {
            img: `${sectionTwo?.imageThree}`,
            title: `${sectionTwo?.titleThree}`,
            desc: `${sectionTwo?.descriptionThree}`
        },
    ];


    return (
        <>
            {
                data?.data?.aboutPageHeaderCmsData?.length > 0 && isSuccess ?
                    < div style={{ backgroundColor: `${aboutComponentUI?.backgroundColor}` }}>
                        <HeaderTitles title={'aboutUsPageTitle'} />
                        <Head>
                            <>
                                <Script src="https://kit.fontawesome.com/7f4933efb1.js" strategy="beforeInteractive" crossOrigin="anonymous" />
                                <meta
                                    name="description"
                                    content={pageMeta?.aboutUsPageMetaDescription}
                                />
                                <meta
                                    name="keywords"
                                    content={pageMeta?.aboutUsPageMetaKeyword}
                                />
                            </>
                        </Head>
                        <Hero
                            bg={header?.image}
                            title1={header?.titleOne}
                            title2={header?.titleTwo}
                            btnBg="transparent"
                            btnText={header?.buttonText}
                            btnLink={header?.buttonLink}
                            border
                            uiData={aboutComponentUI}
                        >
                            {header?.description}
                        </Hero>
                        <Section title={sectionOne?.title} childCls="fw-bold mx-auto mt-3">
                            {sectionOne?.subTitle}
                        </Section>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-6">
                                    <p className="h5Plus ff-Soleil400 fs-14">{sectionOne?.descriptionOne}</p>
                                </div>
                                <div className="col-lg-6">
                                    <p className="h5Plus ff-Soleil400 fs-14">{sectionOne?.descriptionTwo}</p>
                                </div>
                            </div>
                            <div className="my-4" style={{ border: '1.5px solid #212322' }} />
                            <Section
                                title={sectionTwo?.title}
                                childCls="fw-bold w-75 mx-auto mt-3"
                            >
                                {sectionTwo?.subTitle}
                            </Section>
                            <ThreeCard data={aboutCards} />
                            <div className="my-4" style={{ border: '1.5px solid #212322' }} />
                            <div className="row p-2 p-md-5 align-items-center">
                                <div className="col-md-4">
                                    <div className="row w-auto">
                                        <img
                                            src={`${sectionThree?.image}`}
                                            width={0}
                                            height={0}
                                            className="w-auto h-auto mx-auto"
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="col-md-8 col-xl-6 px-4">
                                    <div className="row">
                                        <h2 className="fw-bold ff-Soleil700">
                                            {sectionThree?.title}
                                        </h2>
                                        <p className="my-3 ff-Soleil400">
                                            {sectionThree?.subTitle}
                                        </p>
                                    </div>
                                    <Link href={`${sectionThree?.buttonLink || ''}`} className="w-auto bg-black rounded-pill text-white px-5 py-2 mx-auto btn ff-Soleil700">
                                        {sectionThree?.buttonText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div >
                    :
                    <><Loader /></>
            }
        </>
    )
}
