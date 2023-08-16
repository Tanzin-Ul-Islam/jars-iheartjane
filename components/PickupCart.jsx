import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '../styles/PickUpModal.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { postData } from '../utils/FetchApi';
import { setSelectedRetailer, setSiteLoader, setCheckoutId, setAllFormatedRetailer, setActiveRetailerType, setFirstPopupForState, setPopupModal, setSecondPopupModal, setUserSelectRetailerState, setMenuTypeValue } from '../redux/global_store/globalReducer';
import { createToast } from '../utils/toast';
import api from '../config/api.json';
import axios from 'axios';
import { useGetRetailerElasticSearchMutation, useGetRetailerSearchDataMutation } from '../redux/api_core/apiCore';
import Skeleton from 'react-loading-skeleton';
import { createCheckout, retialerNameSlug } from '../utils/helper';
import { BiPhone } from "react-icons/bi";
import zipCodeToLatLng from '../utils/zipCodeToLatLng';
import statesList from '../utils/stateList';
import Loader from './Loader';
import { sortArrayAlphabetically, sortArrayStateAlphabetically, sortArrayStateAlphabeticallyAfterFilter } from '../utils/arrayUtils';
const PickupCart = () => {
    const router = useRouter();

    const list = [
        { option: 'Selected' }, { option: 'Select' }, { option: 'Select' }, { option: 'Select' }
    ]

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];

    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('ZipOrLocation');
    const [location, setLocation] = useState({
        lat: 0,
        lng: 0,
    });
    const [activeLoader, setActiveLoader] = useState(false);
    const [retailers, setRetailers] = useState([]);
    const [retailerList, setRetailerList] = useState([]);
    const [customSuggestion, setCustomSuggestion] = useState(false);
    const [getRetailerElasticSearch, results] = useGetRetailerElasticSearchMutation();

    const { allRetailer, retailerType, selectedRetailer, allFormatedRetailer, userSelectRetailerState, customAZList, menuTypeValue } = useSelector((state) => (state.globalStore));

    const [getRetailerSearch, result] = useGetRetailerSearchDataMutation({});
    const [skeletonHoldSearch, setSkeletonHoldSearch] = useState(true);
    const [userSelectedRetailerType, setUserSelectedRetailerType] = useState("");
    const [fullStateName, setFullStateName] = useState("");
    const [popupModalForState, setPopupModalForState] = useState(false);
    const checkElasticSearch = useRef(false);

    // const [tempRetailers, setTempRetailers] = useState([]);

    const handleSearch = async (value) => {
        setSearch(value)
        const stateName = JSON.parse(localStorage.getItem('user_selected_retailer_state'));
        const data = {
            search: value,
            state: stateName,
            limit: allFormatedRetailer?.length
        }
        await getRetailerElasticSearch({ data });
        if (value) {
            setCustomSuggestion(true)
        } else {
            setCustomSuggestion(false)
        }
        // let dataSearch = await postData(api.retailerAll.retailerElasticSearch, data);
        // console.log(dataSearch);
    }


    useEffect(() => {
        setRetailers(allFormatedRetailer);
        setRetailerList(allFormatedRetailer);
        if (allFormatedRetailer?.length > 0) {
            setSkeletonHoldSearch(false);
        }
        const selectedRetailer = JSON.parse(localStorage.getItem('retailer_type'));
        setUserSelectedRetailerType(selectedRetailer);
    }, [allFormatedRetailer]);



    const handleRetialderSelectManually = async (retailerId) => {
        setActiveLoader(true);
        try {
            let response = await postData(api.retailerAll.retailerDetails, { retailerId: retailerId });
            if (response.status == 201 || response.status == 200) {

                // if (retailerType == 'pickup') {
                //     dispatch(setActiveRetailerType('pickup'))
                //     localStorage.setItem('active_retailer_type', JSON.stringify('pickup'));
                // } else if (retailerType == 'delivery') {
                //     dispatch(setActiveRetailerType('delivery'))
                //     localStorage.setItem('active_retailer_type', JSON.stringify('delivery'));
                // }
                let retailerRes = response.data.retailer;
                const retailerTypeLocal = getRetailerType(retailerRes);
                setSearch("");
                setRetailers(allFormatedRetailer);
                let checkoutId = await createCheckout({
                    retailerId: retailerRes?.id,
                    orderType: retailerTypeLocal == 'Curbside Pickup' ? 'PICKUP' : retailerTypeLocal.toUpperCase(),
                    pricingType: menuTypeValue
                });
                if (checkoutId) {
                    dispatch(setCheckoutId(checkoutId));
                }
                localStorage.setItem('selected-retailer', JSON.stringify(response.data.retailer));
                localStorage.setItem("menuTypeValue", 'RECREATIONAL');
                localStorage.setItem('retailer_type', JSON.stringify(retailerTypeLocal));
                localStorage.setItem('active_retailer_type', JSON.stringify(retailerTypeLocal));
                dispatch(setActiveRetailerType(retailerTypeLocal));
                dispatch(setSelectedRetailer(retailerRes));
                dispatch(setMenuTypeValue('RECREATIONAL'));

                if (router.pathname === '/product-details/[id]') router.push('/shop')

                if (router.pathname === '/[...store]') {
                    router.push(`/${retailerRes?.addressObject?.state?.toLowerCase()}/${retialerNameSlug(retailerRes?.name)}`)
                }

                setActiveLoader(false);
            } else {
                createToast("Something went wrong! Please try again.", 'error')
            }
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(setSiteLoader(false));
        }
    }

    const handleRetialderAZSelectManually = (azLink) => {
        console.log('azLink -', azLink);
        window.location.href = azLink;
        return false;
    }

    const handleRetailerDataSearch = async (e) => {
        e.preventDefault();
        if (!search) {
            createToast("Please enter zip / postal-code", 'error')
            setRetailers(allFormatedRetailer);
        } else {
            try {
                checkElasticSearch.current = true;
                const searchList = [];
                const searchLowerCase = search.toLowerCase();

                for (const item of allFormatedRetailer) {
                    const name = item.name.toLowerCase();
                    const address = item.address.toLowerCase();
                    const isMatch = name.includes(searchLowerCase) || address.includes(searchLowerCase);

                    if (isMatch) {
                        searchList.push(item);
                    }
                }
                if (searchList?.length <= 0) {
                    setSkeletonHoldSearch(true);
                    const data = await zipCodeToLatLng(search);

                    setSearchType("Closest Location")
                    if (data?.latitude && data?.longitude) {

                        setLocation({
                            lat: parseFloat(data?.latitude),
                            lng: parseFloat(data?.longitude),
                        });

                        let closestLocationT = "Closest Location";
                        try {
                            postData(api.retailerAll.searchRetailerFilterAllURL + `${closestLocationT}`, {
                                userLatitude: parseFloat(data?.latitude) ? parseFloat(data?.latitude) : 0,
                                userLongitude: parseFloat(data?.longitude) ? parseFloat(data?.longitude) : 0,
                                maxDistance: 500.00
                            })
                                .then(response => {
                                    if (response?.data) {
                                        setSkeletonHoldSearch(false);
                                    }
                                    setRetailers(response?.data);
                                })
                                .catch(error => {
                                    console.log(error);
                                });

                        } catch (error) {
                            console.log(error)
                        } finally {
                            if (retailers?.length < 0) {
                                setTimeout(() => {
                                    setSkeletonHoldSearch(false);
                                }, 5000);
                            }
                        }
                    }
                }
                setRetailers(searchList)
            } catch (e) {
                return e;
            }


        }
    }

    const handleRetailerSearchByElastic = (search) => {
        const searchList = [];
        const searchLowerCase = search.toLowerCase();

        if (search) {
            for (const item of allFormatedRetailer) {
                const name = item.name.toLowerCase();
                const address = item.address.toLowerCase();
                const isMatch = name.includes(searchLowerCase) || address.includes(searchLowerCase);

                if (isMatch) {
                    searchList.push(item);
                }
            }
            setRetailers(searchList);
            setCustomSuggestion(false)
            setSearch("");
        }
    }

    function calcCrow(latOne, lngOne, latTwo, lngTwo) {
        const R = 6371;
        const dLat = toRadian(latTwo - latOne);
        const dLng = toRadian(lngTwo - lngOne);
        latOne = toRadian(latOne);
        latTwo = toRadian(latTwo);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(latOne) * Math.cos(latTwo);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d * 0.621371;
    }

    function toRadian(value) {
        return value * Math.PI / 180;
    }

    const handleChangeState = (e) => {
        e.preventDefault();
        setPopupModalForState(!popupModalForState);
        // if (popupModalForState) {
        //     setPopupModalForState(false);
        // } else {
        //     setPopupModalForState(true);
        // }

    }

    // Group addresses by state
    const groupedAddresses = sortArrayStateAlphabetically(retailerList)?.reduce((acc, curr) => {
        const state = curr?.addressObject?.state;
        if (!acc[state]) {
            acc[state] = [];
        }
        acc[state].push(curr);
        return acc;
    }, {});
    const stateNameGroup = groupedAddresses ? Object.keys(groupedAddresses) : [];

    const handleSitePopupRetailerSateSet = (state) => {
        setRetailerList(allFormatedRetailer)
        localStorage.setItem('user_selected_retailer_state', JSON.stringify(state));
        let stateListData = statesList.filter((data) => data.code == state);
        setFullStateName(stateListData[0]?.name)
        dispatch(setUserSelectRetailerState(state));
        setPopupModalForState(false);
        const filteredAddresses = retailerList?.filter(
            (address) => address.addressObject.state === state
        );
        setRetailers(filteredAddresses);
    }


    useEffect(() => {
        const userRetailerState = userSelectRetailerState != 'undefined' ? userSelectRetailerState : JSON.parse(localStorage.getItem('user_selected_retailer_state'));
        if (userRetailerState) {
            let stateListData = statesList.filter((data) => data.code == userRetailerState);
            setFullStateName(stateListData[0]?.name)

            const filteredAddresses = retailerList?.filter(
                (address) => address.addressObject.state === userRetailerState
            );
            setRetailers(filteredAddresses);
        }
    }, [retailerList, userSelectRetailerState, selectedRetailer?.id]);


    // useEffect(() => {
    //     setTimeout(() => {
    //         setActiveLoader(false);
    //     }, 2000);
    // }, []);

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
        return retailerType ? retailerType : 'PICKUP';
    }

    function checkActiveDay(retailer) {
        let dayN = undefined;
        if ('Friday' === dayName) {
            dayN = (retailer?.hours?.curbsidePickup?.Friday?.active) ? retailer?.hours?.curbsidePickup?.Friday : (retailer?.hours?.pickup?.Friday?.active) ? retailer?.hours?.pickup?.Friday : retailer?.hours?.delivery?.Friday;
            return dayN;
        }
        else if ('Saturday' === dayName) {
            dayN = (retailer?.hours?.curbsidePickup?.Saturday?.active) ? retailer?.hours?.curbsidePickup?.Saturday : (retailer?.hours?.pickup?.Saturday?.active) ? retailer?.hours?.pickup?.Saturday : retailer?.hours?.delivery?.Saturday;
            return dayN;
        }
        else if ('Sunday' === dayName) {
            dayN = (retailer?.hours?.curbsidePickup?.Sunday?.active) ? retailer?.hours?.curbsidePickup?.Sunday : (retailer?.hours?.pickup?.Sunday?.active) ? retailer?.hours?.pickup?.Sunday : retailer?.hours?.delivery?.Sunday;
            return dayN;
        }
        else if ('Monday' === dayName) {
            dayN = (retailer?.hours?.curbsidePickup?.Monday?.active) ? retailer?.hours?.curbsidePickup?.Monday : (retailer?.hours?.pickup?.Monday?.active) ? retailer?.hours?.pickup?.Monday : retailer?.hours?.delivery?.Monday;
            return dayN;
        }
        else if ('Tuesday' === dayName) {
            dayN = (retailer?.hours?.curbsidePickup?.Tuesday?.active) ? retailer?.hours?.curbsidePickup?.Tuesday : (retailer?.hours?.pickup?.Tuesday?.active) ? retailer?.hours?.pickup?.Tuesday : retailer?.hours?.delivery?.Tuesday;
            return dayN;
        }
        else if ('Wednesday' === dayName) {
            dayN = (retailer?.hours?.curbsidePickup?.Wednesday?.active) ? retailer?.hours?.curbsidePickup?.Wednesday : (retailer?.hours?.pickup?.Wednesday?.active) ? retailer?.hours?.pickup?.Wednesday : retailer?.hours?.delivery?.Wednesday;
            return dayN;
        }
        else if ('Thursday' === dayName) {
            dayN = (retailer?.hours?.curbsidePickup?.Thursday?.active) ? retailer?.hours?.curbsidePickup?.Thursday : (retailer?.hours?.pickup?.Thursday?.active) ? retailer?.hours?.pickup?.Thursday : retailer?.hours?.delivery?.Thursday;
            return dayN;
        }
    }

    return (
        <div>
            {activeLoader && <Loader />}
            <div className="offcanvas offcanvas-start" id="offcanvasExampleLeft" aria-labelledby="offcanvasExampleLeftLabel" style={{ zIndex: 11111 }}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLeftLabel"></h5>
                    <button type="button" className="btn-close text-reset shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div className={styles.pickup_left_modal_width}>
                        <div className='mb-4 position-relative'>
                            <h2 className='fs-22 ff-Soleil700 text-center'>Select a State</h2>
                            <button onClick={(e) => handleChangeState(e)} className="btn btn-dark h-100 rounded-0 ff-Soleil700 w-100 my-2 d-flex align-items-center justify-content-between">{fullStateName && fullStateName} {popupModalForState ? <i className='bx bx-up-arrow-alt' ></i> : <i className='bx bx-down-arrow-alt'></i>}</button>

                            {popupModalForState && <div className="card card-position">
                                <div className="card-body">
                                    <ul className='list-group'>
                                        {/* {Object.entries(groupedAddresses).map(([state, addresses]) => { */}
                                        {sortArrayStateAlphabeticallyAfterFilter(stateNameGroup).map((state, index) => {
                                            let stateListData = statesList.filter((data) => data.code == state);
                                            return (
                                                <li key={index} className="list-group-item list-group-item-action list-group-item-light d-flex justify-content-between align-content-center cp mt-2 rounded-pill border shadow-sm"
                                                    onClick={() => handleSitePopupRetailerSateSet(state)}
                                                >
                                                    <span className="w-100">
                                                        <span><i className='bx bx-location-plus' ></i></span>
                                                        <span style={{ marginLeft: '20px' }} className='fs-20 me-4'>{stateListData[0].name}</span>
                                                    </span>
                                                    {/* <span style={{ transform: 'translateY(5px)' }}><i className='bx bx-right-arrow-circle fs-20'></i></span> */}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>}
                        </div>
                        <hr />
                        <div>
                            <h2 className='fs-22 ff-Soleil700 text-center'>Select a Store</h2>
                        </div>
                        <div>
                            <form onSubmit={handleRetailerDataSearch} >
                                <div className="mb-3">
                                    <div className='d-flex'>
                                        <span className='w-100 me-1 position-relative'>
                                            <input type="search" name="search" onChange={(e) => handleSearch(e.target.value)} className="form-control border border-1 border-dark py-2 shadow-none rounded-0" placeholder="zip / postal code" aria-label="Recipient's username" aria-describedby="button-addon2" autoComplete="off" value={search} />

                                            {customSuggestion && (
                                                <div
                                                    className={`container ${styles.search_card_suggestion}`}
                                                >
                                                    <div className="row d-flex justify-content-center shadow-lg">
                                                        <div className="custom-search-modal-card">
                                                            <ul className='list-group list-group-flush'>
                                                                {results?.data?.data?.retailers?.length > 0 ? results?.data?.data?.retailers.map((data, index) => {

                                                                    return (
                                                                        <li key={index} className='list-group-item cp' onClick={() => handleRetailerSearchByElastic(data?.retailerName)}>{data?.retailerName}</li>
                                                                        // <li key={index} className='list-group-item cp' onClick={() => setSearch(data?.retailerName)}>{data?.retailerName}</li>
                                                                    )
                                                                }) : <li className='list-group-item text-center'><Skeleton style={{ width: '100%', height: '30px' }} /></li>}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </span>
                                        <span>
                                            <button className="btn btn-dark h-100 rounded-0 ff-Soleil700" type="submit" id="button-addon2">Lookup</button>
                                        </span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <hr />
                        {(retailers?.length > 0)
                            ? sortArrayAlphabetically(retailers, checkElasticSearch.current)?.map((li, index) => {
                                let userLat = location?.lat ? location?.lat : 0;
                                let userLng = location?.lng ? location?.lng : 0;
                                let retailerLat = parseFloat(li?.coordinates?.latitude);
                                let retailerLng = parseFloat(li?.coordinates?.longitude);
                                let distance = calcCrow(userLat, userLng, retailerLat, retailerLng).toFixed(2);
                                let showDistance = false;
                                if (distance >= 0) {
                                    showDistance = true;
                                }
                                let dayN = '';
                                for (let hour in li?.hours) {
                                    dayN = checkActiveDay(li);
                                }
                                // if ((li.deliverySettings?.afterHoursOrderingForDelivery && retailerType == "delivery")) {

                                if (li.hours?.curbsidePickup?.[dayName]?.active || li.hours?.pickup?.[dayName]?.active || li.hours?.delivery?.[dayName]?.active) {
                                    if (li.name != "JARS Cannabis – Ann Arbor - Main St." && li.name != "JARS Cannabis – Test") {
                                        return (
                                            <>
                                                {li?.addressObject?.state == "AZ" ? (
                                                    <>
                                                        {customAZList.map((item, index_az) => (
                                                            (<div key={'az-' + index_az + '-jars'}>
                                                                <div className=''>
                                                                    <div className='d-flex'>
                                                                        <div className='ms-2'>
                                                                            <p className='fs-16 my-auto ff-Soleil700'>{item?.name}</p>
                                                                            <p className='fs-12 mt-2 ff-Soleil400'>{item?.address} {showDistance && searchType == 'Closest Location' ? ` (Distance: ${distance} Miles)` : ''}</p>
                                                                            {li?.retailerMobileNumber &&
                                                                                <Link href={`tel:${li?.retailerMobileNumber}`} className='fs-12 mt-1 ff-Soleil400'>
                                                                                    <BiPhone />&ensp;{li?.retailerMobileNumber}
                                                                                </Link>
                                                                            }
                                                                            <div className='d-flex fs-16 mt-3'>
                                                                                <p className='text-primary ff-Soleil700'>Open {item?.open} &nbsp;</p>
                                                                                <p className=''> | </p>
                                                                                <p className='ff-Soleil700'>&nbsp;Closes {item?.end}</p>
                                                                            </div>
                                                                            <div>

                                                                                <button data-bs-dismiss="offcanvas" onClick={() => handleRetialderAZSelectManually(item?.link)} className={(li?.id == selectedRetailer?.id) ? "btn btn-dark fs-14 ff-Soleil700" : "btn btn-outline-dark fs-14 ff-Soleil700"}>{li?.id == selectedRetailer?.id ? 'Selected' : 'Select'}</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <hr />
                                                            </div>)
                                                        ))}
                                                    </>

                                                ) : (<div key={'pickup-cart-' + index}>
                                                    <div className=''>
                                                        <div className='d-flex'>
                                                            <div className='ms-2'>
                                                                <p className='fs-16 my-auto ff-Soleil700'>{li?.name}</p>
                                                                <p className='fs-12 mt-2 ff-Soleil400'>{li?.addressObject?.line1}, {li?.addressObject?.city}, {li?.addressObject?.state}, {li?.addressObject?.postalCode} {showDistance && searchType == 'Closest Location' ? ` (Distance: ${distance} Miles)` : ''}</p>
                                                                {li?.retailerMobileNumber &&
                                                                    <Link href={`tel:${li?.retailerMobileNumber}`} className='fs-12 mt-1 ff-Soleil400'>
                                                                        <BiPhone />&ensp;{li?.retailerMobileNumber}
                                                                    </Link>
                                                                }
                                                                <div className='d-flex fs-16 mt-3'>
                                                                    <p className='text-primary ff-Soleil700'>Open {dayN?.start} &nbsp;</p>
                                                                    <p className=''> | </p>
                                                                    <p className='ff-Soleil700'>&nbsp;Closes {dayN?.end}</p>
                                                                </div>
                                                                <div>
                                                                    <button data-bs-dismiss="offcanvas" onClick={() => handleRetialderSelectManually(li?.id)} className={(li?.id == selectedRetailer?.id) ? "btn btn-dark fs-14 ff-Soleil700" : "btn btn-outline-dark fs-14 ff-Soleil700"}>{li?.id == selectedRetailer?.id ? 'Selected' : 'Select'}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </div>)}

                                            </>
                                        )
                                    }
                                }
                            })
                            :
                            <>
                                {skeletonHoldSearch &&
                                    <>
                                        <div>
                                            <div className=''>
                                                <div className='d-flex'>
                                                    <div className='ms-2' width="100%">
                                                        <Skeleton style={{ width: '350px', height: '30px' }} />
                                                        <p className='fs-12 mt-2 ff-Soleil400'>
                                                            <Skeleton width="90%" height="20px" />
                                                        </p>
                                                        <div className='d-flex fs-16' width="100%">
                                                            <p className='text-primary ff-Soleil700' style={{ width: "100%", }}>
                                                                <Skeleton width="80%" height="40px" />
                                                            </p>
                                                        </div>
                                                        <div width="100%">
                                                            <Skeleton width="50%" height="50px" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                        <div>
                                            <div className=''>
                                                <div className='d-flex'>
                                                    <div className='ms-2' width="100%">
                                                        <Skeleton style={{ width: '350px', height: '30px' }} />
                                                        <p className='fs-12 mt-2 ff-Soleil400'>
                                                            <Skeleton width="90%" height="20px" />
                                                        </p>
                                                        <div className='d-flex fs-16' width="100%">
                                                            <p className='text-primary ff-Soleil700' style={{ width: "100%", }}>
                                                                <Skeleton width="80%" height="40px" />
                                                            </p>
                                                        </div>
                                                        <div width="100%">
                                                            <Skeleton width="50%" height="50px" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    </>
                                }

                                {!skeletonHoldSearch && <p className='text-center'> Retailer not found!</p>}
                            </>

                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PickupCart