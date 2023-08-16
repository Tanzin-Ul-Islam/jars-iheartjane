import React, { useState, useEffect } from 'react';
import Accordion from './Accordion';
import Hero from '../../components/Hero';
import Steps from './Steps';
import Benefits from './Benefits';
import Button from '../../components/Button';
import Section from '../../components/Section';
import HeaderTitles from '../../components/HeaderTitles';
import Head from 'next/head';
import { fetchData } from '../../utils/FetchApi';
import api from "../../config/api.json";
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Loader from '../../components/Loader';

const index = () => {

  const { pageMeta, jarsPlusComponentUI } = useSelector((store) => store.globalStore);

  const [cmsData, setCmsData] = useState({
    faqCms: {
      cmsData: {
        subTitle: '',
        buttonText: '',
        butttonLink: ''
      },
      faqData: []
    },
    sectionOne: {
      backgroundImage: '',
      title: '',
      subTitle: '',
      description: '',
      buttonLink: '',
      buttonText: ''
    },
    sectionTwoTop: {
      description: '',
      buttonLink: '',
      buttonText: ''
    },
    stepsSection: {
      title: "",
      subTitle: "",
      countOneImage: "",
      countOneTitle: "",
      countOneDescription: "",
      countTwoImage: "",
      countTwoTitle: "",
      countTwoDescription: "",
      countThreeImage: "",
      countThreeTitle: "",
      countThreeDescription: ""
    },
    benefitsSection: {},
    benefitsModal: [],
    isLoading: true
  });

  const [benefitsContentList, setBenefitsContentList] = useState([]);

  const [isData, setIsData] = useState(0);

  const getCms = async () => {
    const sectionOne = await fetchData(api.jarsplus.jarsSectionOneCmsURL);
    const stepsSection = await fetchData(api.jarsplus.stepsSectionCmsURL);
    const benefitsSection = await fetchData(api.jarsplus.benefitsSectionCmsURL);
    const benefitsModal = await fetchData(api.jarsplus.benefitsModalURL);
    const faqCms = await fetchData(api.faq.faqCmsURL);

    setIsData(sectionOne?.data);

    setCmsData({
      faqCms: {
        cmsData: faqCms?.data?.cmsData?.[0],
        faqData: faqCms?.data?.faqData
      },
      sectionOne: sectionOne?.data?.[0],
      stepsSection: stepsSection?.data?.[0],
      benefitsSection: benefitsSection?.data?.data?.length > 0 ? benefitsSection?.data?.data?.[0] : {},
      benefitsModal: benefitsModal?.data,
      isLoading: false
      // isLoading: true
    });
    setBenefitsContentList(benefitsSection?.data?.benefitsContent)
  }

  useEffect(() => {
    getCms();
  }, [])

  return (
    <>
      {
        isData?.length > 0 ?
          <div style={{ backgroundColor: jarsPlusComponentUI?.backgroundColor }}>
            <HeaderTitles title={'jarsPlusPageTitle'} />
            <Head>
              <meta
                name="description"
                content={pageMeta?.jarsPlusPageMetaDescription}
              />
              <meta
                name="keywords"
                content={pageMeta?.jarsPlusPageMetaKeyword}
              />
            </Head>
            <div className="pb-5">
              <Hero
                bg={cmsData?.sectionOne?.backgroundImage}
                title1={cmsData?.sectionOne?.title}
                title2={cmsData?.sectionOne?.subTitle}
                btnText={cmsData?.sectionOne?.buttonText}
                btnLink={cmsData?.sectionOne?.buttonLink}
                btnBg="#d9d29a"
                uiData={jarsPlusComponentUI}
              >
                {cmsData?.sectionOne?.description}
              </Hero>
              <Steps stepsSection={cmsData?.stepsSection} />
              <Benefits benefitsSection={cmsData?.benefitsSection} benefitsContentList={benefitsContentList} benefitsModal={cmsData?.benefitsModal} />
              <div className="text-center">
                <Section title={cmsData?.faqCms?.cmsData?.title}>
                  {cmsData?.faqCms?.cmsData?.subTitle}
                </Section>
                <Accordion data={cmsData?.faqCms?.faqData} />
                <Link href={`${cmsData?.faqCms?.cmsData?.buttonLink}`} className="w-auto bg-black rounded-pill text-white px-5 py-2 mx-auto btn ff-Soleil700">
                  {cmsData?.faqCms?.cmsData?.buttonText}
                </Link>
              </div>
            </div>
          </div>
          :
          <><Loader /></>
      }

    </>
  );
};

export default index;