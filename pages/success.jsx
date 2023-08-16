import React, { useEffect, useState } from 'react'
import styles from '../styles/Success.module.css'
import Banner from '../components/Banner';
import { AiOutlineCheckCircle } from "react-icons/ai"
import { HiArrowUturnLeft } from "react-icons/hi2"
import { FaShoppingCart } from "react-icons/fa"
import { useGetFaqPageCmsQuery, useGetSingleOrderMutation } from "../redux/api_core/apiCore";
import { useRouter } from 'next/router';
import { postData } from '../utils/FetchApi';
import { createCheckout } from '../utils/helper';
import api from "../config/api.json";
import { useDispatch, useSelector } from 'react-redux';
import { setCheckoutId } from '../redux/global_store/globalReducer';
import HeaderTitles from '../components/HeaderTitles';
import Head from 'next/head';
import { checkoutItemsForSeo, purchaseForSeo } from '../utils/seoInformations';
import { getGraphQLClient } from '../utils/graphqlClient';
import { fetchMultipleOrder, fetchOneOrder } from '../utils/dutchieQuery';
const Success = () => {

  const router = useRouter();
  const { orderNumber } = router.query;
  const dispatch = useDispatch();
  const { selectedRetailer, pageMeta, menuTypeValue } = useSelector((store) => (store.globalStore));

  const [getSingleOrder, { data: result, isLoading, isError }] = useGetSingleOrderMutation();

  //page cms
  const { commonBannerCmsData } = useSelector((store) => store.globalStore);

  const [token, setToken] = useState("");

  function findIndexByKeyValue(key, value) {
    return window.dataLayer.findIndex(function (item) {
      return item.hasOwnProperty(key) && item[key] === value;
    });
  }

  function removeFromDatalayer() {
    localStorage.removeItem('add_to_cart');
    localStorage.removeItem('remove_from_cart');

    const addToCartData = { event: "add_to_cart", ecommerce: {} };
    const removeFromCartData = { event: "remove_from_cart", ecommerce: {} };

    let addToCartIndex = findIndexByKeyValue('event', 'add_to_cart')
    window.dataLayer[addToCartIndex] = addToCartData;
    let removeCartIndex = findIndexByKeyValue('event', 'remove_from_cart')
    window.dataLayer[removeCartIndex] = removeFromCartData;
  }

  // async function getOrderByOrderId() {
  //   let data = {
  //     retailerId: JSON.parse(localStorage.getItem('selected-retailer')).id,
  //     filter: {
  //       orderNumber: orderNumber
  //     }
  //   }
  //   await getSingleOrder({ data }).then(response => {
  //     let order = response.data.orders.length > 0 ? response.data.orders[0] : {};
  //     removeFromDatalayer();
  //     purchaseForSeo(order);
  //   });
  // }

  async function handlePostOrder() {
    const email = localStorage.getItem('email');
    let data = {
      email: email,
      orderNumber: orderNumber,
    }
    await postData(api.order.postOrder, data).then(async (response) => {
      // await getOrderByOrderId();
      return;
    })
  }

  async function handleCreateCheckoutId() {
    const retailerType = JSON.parse(localStorage.getItem('retailer_type'));
    let checkoutId = await createCheckout({
      retailerId: selectedRetailer?.id,
      orderType: retailerType == "Curbside Pickup" ? 'PICKUP' : retailerType.toUpperCase(),
      pricingType: menuTypeValue
    });
    if (checkoutId) {
      dispatch(setCheckoutId(checkoutId));
      return;
    }
  }

  function validateUserAndStoreOrder(tokenArg) {
    if (orderNumber) {
      if (tokenArg) {
        handlePostOrder();
      }
      handleCreateCheckoutId();
    }
  }

  function handleToken() {
    setToken(() => {
      const token = localStorage.getItem("token");
      validateUserAndStoreOrder(token);
      return token;
    })
  }

  function handleCheckoutSeo(order) {
    let tempArr = [];
    order.items.forEach(element => {
      let payLoad = {
        ...element.product,
        quantity: element.quantity,
        variant: element.option,
      }
      tempArr.push(payLoad);
    });
    checkoutItemsForSeo(tempArr);
  }

  async function getOrderDetailsFromGql() {
    try {
      const graphQLClient = getGraphQLClient();
      const query = fetchMultipleOrder();
      const variables = JSON.stringify({
        retailerId: JSON.parse(localStorage.getItem('selected-retailer')).id,
      });
      await graphQLClient.request(query, variables).then(response => {
        const orderArr = response.orders.filter(el => (el.orderNumber == orderNumber));
        const order = (orderArr.length > 0) ? orderArr[0] : null;
        if (order) {
          handleCheckoutSeo(order);
          purchaseForSeo(order);
        }
      }).catch(error => console.log(error));
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    if (router.isReady) {
      handleToken();
      getOrderDetailsFromGql();
    }
  }, [orderNumber])




  return (
    <>
      <HeaderTitles title={'successPageTitle'} />
      <Head>
        <meta
          name="description"
          content={pageMeta?.successPageMetaDescription}
        />
        <meta
          name="keywords"
          content={pageMeta?.successPageMetaKeyword}
        />
      </Head>
      <section className=''>
        <Banner commonBannerCmsData={commonBannerCmsData} />
      </section>
      <section className='container my-5'>
        <div className='mt-5 mt-lg-0'>
          <div className='text-center mt-5 d-flex flex-column justify-content-center align-items-center'>
            <div className='mb-2'>
              <AiOutlineCheckCircle className='fs-80' />
            </div>
            <div className='mt-3'>
              <p className='mb-2 ff-Soleil700 fs-36 fs-md-20'>Your Order Placed Successfully</p>
              {/* <p className='ff-Soleil400 fs-14 fs-md-12 w-75 mx-auto'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, officia.</p> */}
            </div>
            <div className='d-flex gap-3 justify-content-center mt-4'>
              <button className='btn btn-outline-dark ff-Soleil400 fs-14 d-flex justify-content-center align-items-center gap-2' onClick={() => { router.push('/') }}><HiArrowUturnLeft />Back to Home</button>
              {
                token ? <button className='btn btn-outline-dark ff-Soleil400 fs-14 d-flex justify-content-center align-items-center gap-2' onClick={() => { router.push('/order') }} ><FaShoppingCart /> My Orders</button> : <></>
              }

            </div>
          </div>
        </div>
      </section>
    </>

  )
}

export default Success