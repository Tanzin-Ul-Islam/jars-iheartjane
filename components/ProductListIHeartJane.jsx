import React, { useState, useEffect, useRef } from 'react';
import ReactPaginate from 'react-paginate';
import Link from 'next/link';
import productInfo from '../cms-data/productsCms';
import styles from '../styles/Products.module.css';
import pStyles from '../styles/productList.module.css';
import { BiFilterAlt, BiSearch } from 'react-icons/bi';
import { RxDividerVertical } from 'react-icons/rx';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RiArrowDropDownLine, RiFilterOffLine } from 'react-icons/ri';
import {
  AiOutlineClose,
  AiOutlineHeart,
  AiOutlineLeft,
  AiFillCloseCircle,
  AiOutlineRight,
  AiFillHeart,
  AiOutlineDown,
} from 'react-icons/ai';
import { MdOutlineSort } from 'react-icons/md';
import { TiArrowUnsorted } from 'react-icons/ti';
import { useRouter } from 'next/router';
import { getTrackBackground, Range } from 'react-range';
import { fetchData, postData } from '../utils/FetchApi';
import api from '../config/api.json';
import {
  setCurrentPage,
  setSiteLoader,
  setOffset,
  setRetailerType,
  setAllRetailer,
  setEffectValue,
  setPriceFilter,
  setFilterPriceValue,
  setShopFilter,
  setCurrentSpecialOffer,
  setMenuTypeValue,
} from '../redux/global_store/globalReducer';
import { useSelector, useDispatch } from 'react-redux';
import useDidMountEffect from '../custom-hook/useDidMount';
import { scrollToTop, showLoader } from '../utils/helper';
import { addItemToCart, setCartCountDown, setCartCounter, setCartList, setDiscount, setSubTotal, setTaxAmont, setTotalAmont } from '../redux/cart_store/cartReducer';
import {
  addToWishlist,
  removeFromWishlist,
} from '../redux/wishlist_store/wishlistReducer';
import {
  setCheckoutId,
  setBrandQueryValue,
  setCategoryQueryValue,
  setStrainTypeQueryValue,
} from '../redux/global_store/globalReducer';
import Swal from 'sweetalert2';
import { createCheckout } from '../utils/helper';
import Skeleton from 'react-loading-skeleton';
import { createToast } from '../utils/toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  useGetFeaturedBrandsQuery,
  useGetRetailerDataMutation,
} from '../redux/api_core/apiCore';
import axios from 'axios';
import parse from 'html-react-parser';
import { toTitleCase } from '../utils/helper';
import { sortArray } from '../utils/arrayUtils';
import { getGraphQLClient } from '../utils/graphqlClient';
import {
  fetchProductsCount,
  filterProducts,
  menuType,
} from '../utils/dutchieQuery';
import Head from 'next/head';
import SideBarSkeleton from './Ui/Skeleton/shop/SideBarSkeleton';
import TopBarSkeleton from './Ui/Skeleton/shop/TopBarSkeleton';
import Loader from './Loader';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { addToCartItemForSeo } from '../utils/seoInformations';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  RefinementList,
  Highlight,
  Configure,
} from 'react-instantsearch';
import { orderBy } from 'lodash';
import { InfiniteHits } from './InfiniteHits';

const Hit = ({ hit }) => {
  console.log(hit)
  return (
    <article>
      <div
        className="col-6 col-md-4 col-lg-4"
      >
        <div
          className={`m-0 px-2 py-3 m-md-0 m-lg-4 ${styles.productCustomCard} ${styles.custom_border}`}
        >
          <div className="text-center">
            <Link
              href={`/product-details`}
            >
              <img
                className="cp"
                src={hit?.image_urls[0]}
                height={117}
                width={117}
              />
            </Link>
          </div>
          <div className="text-center mt-3 mt-md-5 lh-15">
            <p
              className="fs-12 mb-2 ff-Soleil400 cp"
              style={{ color: '#212322' }}
            >
              <Highlight attribute="brand" hit={hit} />
            </p>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: '40px' }}
            >
              <Link
                href={`/product-details`}
                className="w-75 fs-16 cp lh-20 ff-Soleil700 global_line_product_limit mb-0 text-center"
              >
                <Highlight attribute="name" hit={hit} />
              </Link>
            </div>
            <p className="fs-14 fs-sm-10 text-nowrap mb-2">
              <span className="text-dark fs-20"></span>
              <span className="text-danger fs-20">
                {'test'}
              </span>
              ${'123'}
            </p>
          </div>

          <div className="d-flex gap-3 justify-content-center">
            <AiOutlineHeart
              className={`fs-24 text-center my-auto cp ${styles.heartIcon}`}
            />
            {/* <button
            className={`px-4 py-1 rounded-pill fs-16 ${styles.addToCartButton}`}
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
          >
            {productInfo.product_button}&nbsp;&nbsp;
            <span className="fs-18">+</span>
          </button> */}
          </div>
          <div className="mt-3">
            <div className={`row ${styles.potencyRow}`}>
              <div
                className={`col-6 ${styles.left_col}`}
              >
                <div className="">
                  <p
                    className={`fs-12 text-center ${styles.card_button_left}`}
                  > N/A</p>
                </div>
              </div>
              <div
                className={`col-6 ${styles.right_col}`}
              >
                <div className="">
                  <p
                    className={`fs-12 text-center ${styles.card_button_right}`}
                  >
                    THC {'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )

};

export default function ProductListIHeartJane({ route }) {
  let {
    checkoutId,
    selectedRetailer,
    brandQueryValue,
    categoryQueryValue,
    strainTypeQueryValue,
    effectValue,
    todaySpecialsValue,
    pageMeta,
    priceFilter,
    filterPriceValue,
    activeRetailerType,
    shopFilter,
    filterLoader,
    filterVariants,
    currentSpecialOffer,
    menuTypeValue,
  } = useSelector((store) => store.globalStore);

  const router = useRouter();

  const searchClient = algoliasearch(
    'VFM4X0N23A',
    '4c8d529bfd20fc02f1735d3b59e33052'
  );

  return (
    <>
      <Head>
        <meta name="description" content={pageMeta?.shopPageMetaDescription} />
        <meta name="keywords" content={pageMeta?.shopPageMetaKeyword} />
        {router.query?.categoryName && categorySchema && (
          <script
            id="json_ld_category"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: categorySchema }}
          />
        )}
      </Head>
      {
        <div>
          <section className="container mb-4 mb-lg-0">
            <InstantSearch
              searchClient={searchClient}
              indexName="menu-products-production"
            >
              <div className="row">
                <div className="col-lg-3">
                  <div
                    className={`offcanvas-lg z-index-2000 offcanvas-start `}
                  >
                    <div className="offcanvas-header justify-content-end">
                      <button
                        type="button"
                        className="btn-close text-reset btn btn-dark"
                      ></button>
                    </div>
                    <div className="offcanvas-body">
                      <div className="w-100">
                        <div
                          className="d-flex justify-content-between align-items-center mb-3"
                          style={{ margin: '0px 18px 0px 18px' }}
                        >
                          <h1 className="ff-Soleil400 fs-16 fw-bold mb-0">
                            Filter Products
                          </h1>
                          <p className="fs-14 mb-0 cp">
                            <RiFilterOffLine
                              style={{ marginTop: '-2px', marginRight: '2px' }}
                            />
                            <span className="align-middle">Clear Filter</span>
                          </p>
                        </div>
                        <div
                          className="accordion"
                          id="accordionPanelsStayOpenExample"
                        >
                          <div className="search-panel__filters">
                            <h3>Root Types</h3>
                            <RefinementList
                              transformItems={(items) => orderBy(items, 'label', 'asc')}
                              attribute="root_types"
                            />
                            <h3>Brands</h3>
                            <RefinementList attribute="brand" />
                            <h3>Reviews</h3>
                            <RefinementList attribute="aggregate_rating" />
                            <h3>Price</h3>
                            <RefinementList attribute="bucket_price" />
                            <h3>Kind</h3>
                            <RefinementList attribute="kind" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`col-12 col-md-12 col-lg-9 ${styles.borderStart}`}
                >
                  <hr className="my-auto" />
                  <>
                    <>
                      <div className="row gy-3 mt-2 mt-md-0 gy-md-5 gx-3 gx-md-5">

                        <Configure filters="store_id = 1850" hitsPerPage="10" />
                        <div className="search-panel">
                          <div className="search-panel__results">
                            <InfiniteHits hitComponent={Hit} />
                          </div>
                        </div>
                      </div>
                    </>
                  </>
                </div>
              </div>
            </InstantSearch>
          </section>
        </div>
      }
    </>
  );
}
