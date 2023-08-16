import React, { useEffect } from 'react'
import checkBot from "../../middleware/checkBot"
import { fetchData, postData } from '../../utils/FetchApi';
import { setActiveRetailerType, setCheckoutId, setInitialPage, setMenuTypeValue, setSelectedRetailer } from '../../redux/global_store/globalReducer';
import { createCheckout } from '../../utils/helper';
import api from "../../config/api.json";
import { useDispatch } from 'react-redux';

export default function HandleSelectDefaultRetailer({ productSlug = "", isGoogleBot }) {
    const dispatch = useDispatch();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];
    function getRetailerType(retailer) {
        let retailerType = undefined;
        if ('Friday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Friday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Friday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Saturday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Saturday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Saturday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Sunday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Sunday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Sunday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Monday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Monday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Monday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Tuesday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Tuesday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Tuesday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Wednesday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Wednesday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Wednesday?.active) ? 'Pickup' : 'Delivery';
        }
        else if ('Thursday' === dayName) {
            retailerType = (retailer?.hours?.curbsidePickup?.Thursday?.active) ? 'Curbside Pickup' : (retailer?.hours?.pickup?.Thursday?.active) ? 'Pickup' : 'Delivery';
        }
        return retailerType ? retailerType : 'Pickup';
    }
    async function handleRetialderSelectManually(retailerId) {
        try {
            let response = await postData(api.retailerAll.retailerDetails, {
                retailerId: retailerId,
            });
            if (response.status == 201 || response.status == 200) {
                let retailerRes = response.data.retailer;
                dispatch(setSelectedRetailer(retailerRes));
                localStorage.setItem('selected-retailer', JSON.stringify(response.data.retailer));
                const retailerType = getRetailerType(retailerRes);
                localStorage.setItem('retailer_type', JSON.stringify(retailerType));
                localStorage.setItem('active_retailer_type', JSON.stringify(retailerType));
                dispatch(setActiveRetailerType(retailerType));
                const orderTypeForCheckout = retailerRes?.deliverySettings?.afterHoursOrderingForPickup ? 'PICKUP' : 'DELIVERY'
                let checkoutId = await createCheckout({
                    retailerId: response.data.retailer.id, orderType: retailerType == 'Curbside Pickup' ? 'PICKUP' : retailerType.toUpperCase(), pricingType: 'RECREATIONAL',
                });
                if (checkoutId) {
                    dispatch(setCheckoutId(checkoutId));
                }
                dispatch(setMenuTypeValue('RECREATIONAL'));
                localStorage.setItem("menuTypeValue", 'RECREATIONAL');
                dispatch(setInitialPage(true))
                localStorage.setItem("initial-page", true);
                localStorage.setItem('user_selected_retailer_state', JSON.stringify(retailerRes?.addressObject?.state));
                dispatch(setUserSelectRetailerState(retailerRes?.addressObject?.state));
            } else {
                createToast('Something went wrong! Please try again.', 'error');
            }
        } catch (error) {
            console.log(error);
        }
    }


    async function handleUser() {
        try {
            await fetchData(api.googlebot.requestUrl + '/' + productSlug).then(async (response) => {
                if (response?.statusCode == 200) {
                    const data = response?.data;
                    if (data?.retailerId) {
                        await handleRetialderSelectManually(data?.retailerId);
                        return;
                    }
                }
            }).catch(error => {
                console.log(error);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function handleBot() {
        await handleRetialderSelectManually("fe025dd0-85c4-4041-bc15-1051def8aa49");
    }

    useEffect(() => {
        checkBot()
        if (checkBot() && !productSlug) {
            handleBot();
        } else {
            handleUser();
        }
    }, [])
    return (
        <></>
    )
}
