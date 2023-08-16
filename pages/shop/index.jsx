import ProductList from "../../components/ProductList"
import React from 'react'
import Banner from "../../components/Banner"
import HeaderTitles from "../../components/HeaderTitles";
import { useSelector } from "react-redux";
import { useGetShopCmsUiQuery } from "../../redux/api_core/apiCore";
import Link from "next/link";
import ProductListIHeartJane from "../../components/ProductListIHeartJane";

export default function Shop() {
    const { commonBannerCmsData, shopBannerCmsData, shopBannerComponentUI } = useSelector((store) => store.globalStore);
    return (
        <>
            <HeaderTitles title={'shopPagetitle'} />
            {
                shopBannerCmsData?.isImageOrColor ?
                    <section className={`container`} style={{ backgroundColor: `${shopBannerCmsData?.imageBackgroundColor}` }}>
                        <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-around py-5 py-md-3 learboardBannerImage" style={{ backgroundImage: `url(${shopBannerCmsData?.image})`, backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
                            <div className='learboardBannerTextImage'>
                                <div className="text-center text-lg-start text-white">
                                    <h2 className="fs-24 fs-md-22 ff-Soleil700" style={{ color: `${shopBannerComponentUI?.titleFontColor}` }}>{shopBannerCmsData?.title}</h2>
                                    <p className="fs-16 ff-Soleil400" style={{ color: `${shopBannerComponentUI?.subTitleFontColor}` }}>{shopBannerCmsData?.subTitle}</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center userLearboardBannerButtonImage">
                                <Link href={shopBannerCmsData?.buttonLink || ""} className='mx-auto btn px-5 py-2 border-0 rounded-pill fs-16 fs-md-14 fw-bold' style={{ backgroundColor: `${shopBannerComponentUI?.buttonBackgroundColor}`, color: `${shopBannerComponentUI?.buttonFontColor}` }}>{shopBannerCmsData?.buttonText}</Link>
                            </div>
                        </div>
                    </section>
                    :
                    <section className={`container`}>
                        <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-around py-5 py-md-3 learboardBannerColor" style={{ backgroundColor: `${shopBannerCmsData?.bgColor}` }}>
                            <div className='learboardBannerTextColor'>
                                <div className="text-center text-lg-start text-white">
                                    <h2 className="fs-24 fs-md-22 ff-Soleil700" style={{ color: `${shopBannerComponentUI?.titleFontColor}` }}>{shopBannerCmsData?.title}</h2>
                                    <p className="fs-16 ff-Soleil400" style={{ color: `${shopBannerComponentUI?.subTitleFontColor}` }}>{shopBannerCmsData?.subTitle}</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center learboardBannerButtonColor">
                                <Link href={shopBannerCmsData?.buttonLink || ""} className='mx-auto btn px-5 py-2 border-0 rounded-pill fs-16 fs-md-14 fw-bold' style={{ backgroundColor: `${shopBannerComponentUI?.buttonBackgroundColor}`, color: `${shopBannerComponentUI?.buttonFontColor}` }}>{shopBannerCmsData?.buttonText}</Link>
                            </div>
                        </div>
                    </section>
            }
            {/* <Banner commonBannerCmsData={commonBannerCmsData} /> */}
            <div className="my-2 my-lg-4" />
            {/* <ProductList route={'shop'} /> */}
            <ProductListIHeartJane route={'shop'}/>
        </>
    )
}