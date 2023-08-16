import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import Meta from '../meta/meta';
import styles from './css/Home.module.css';
import homeInfo from '../../cms-data/homeCms';
import { AiFillCaretRight } from 'react-icons/ai';
import { BsArrowRightShort } from 'react-icons/bs';
import { RiNotification4Fill } from 'react-icons/ri';
import { TbPizza } from 'react-icons/tb';
import { TbCookie } from 'react-icons/tb';
import { IoIosArrowForward } from 'react-icons/io';
import parse from 'html-react-parser';
import { BiPhone } from 'react-icons/bi';
import { FiArrowUpRight, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
// import homeCMS from "../homeCms";
import Banner from '../Banner';
import Slider_one from '../SliderOne';
import Slider_two from '../SliderTwo';

import { useRouter } from 'next/router';
import SliderHeader from '../SliderHeader';
import {
	useGetHomeCmsQuery,
	useGetRetailerAllDataMutation,
	useGetRetailerFilterAllDataMutation,
	useGetInstagramCmsContentMutation,
	useGetInstagramContentMutation,
	useGetRetailerElasticSearchMutation,
} from '../../redux/api_core/apiCore';
import HomeCms from '../../interfaces/HomeInterface';
import {
	setSiteLoader,
	setCheckoutId,
	setSelectedRetailer,
	setPriceFilter,
	setPriceValue,
	setFilterPriceValue,
	setActiveRetailerType,
	setUserSelectRetailerState,
	setFirstPopupForState,
	setPopupModal,
	setSecondPopupModal,
	setMenuTypeValue,
} from '../../redux/global_store/globalReducer';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import api from '../../config/api.json';
import { fetchData, postData } from '../../utils/FetchApi';
import SliderThree from '../SliderThree';
import axios from 'axios';
import { createCheckout } from '../../utils/helper';
import { toTitleCase, urlSlug } from '../../utils/helper';
import Instagram from '../instagramSlider';
import Head from 'next/head';
import { createToast } from '../../utils/toast';
import zipCodeToLatLng from '../../utils/zipCodeToLatLng';
import stateList from '../../utils/stateList';
import Loader from '../Loader';
import {
	checkSort,
	sortArrayAlphabetically,
	sortArrayStateAlphabetically,
	sortArrayStateAlphabeticallyAfterFilter,
} from '../../utils/arrayUtils';
import AgeVerification from '../../pages/ageVerification';
import CategorySlider from '../CategorySlider';

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
export default function HomePage() {
	var days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	var d = new Date();
	var dayName = days[d.getDay()];

	const dispatch = useDispatch();
	const [sectionFive, setSectionFive] = useState([]);
	const [homeSchema, setHomeSchema] = useState('');
	// const [firstPopupForState, setFirstPopupForState] = useState(true);
	const [groupState, setGroupState] = useState([]);
	const [activeLoader, setActiveLoader] = useState(false);
	const [bellIcon, setBellIcon] = useState(false);
	const [heartIcon, setHeartIcon] = useState(false);
	const [watermelonIcon, setWatermelonIcon] = useState(false);
	const [discoutIcon, setDiscoutIcon] = useState(false);
	const [hoverImage, setHoverImage] = useState(-1);

	const [customSuggestion, setCustomSuggestion] = useState(false);
	const suggestionRef = useRef(null);

	function handleClickOutside(event) {
		if (
			suggestionRef.current &&
			!suggestionRef.current.contains(event?.target)
		) {
			setCustomSuggestion(false);
		}
	}

	const checkElasticSearch = useRef(false);
	const [isMobile, setIsMobile] = useState(false);

	const [getRetailerElasticSearch, results] =
		useGetRetailerElasticSearchMutation();

	let {
		initialPage,
		offset,
		checkoutId,
		selectedRetailer,
		categories,
		pageTitles,
		userInfo,
		pageMeta,
		allFormatedRetailer,
		firstPopupForState,
		popupModal,
		secondPopupModal,
		userSelectRetailerState,
		customAZList,
		homePageMobileCategory,
		menuTypeValue,
	} = useSelector((state) => state.globalStore);

	const selectedState =
		typeof window !== 'undefined'
			? JSON.parse(localStorage.getItem('user_selected_retailer_state'))
			: null;
	const { data, isLoading, isSuccess, isFetching, error } =
		useGetHomeCmsQuery(selectedState);

	const sectionNine = data?.data?.homePageSectionNineCmsData[0];
	const sectionFour = data?.data?.homePageSectionFourSliderData;
	const sectionFiveCms = data?.data?.homePageSectionFiveCmsData[0];
	const homePageSectionFive = data?.data?.homePageSectionFiveData;

	const commonBannerCmsData = data?.data?.commonBannerCmsData[0];
	const dropBannerCmsData = data?.data?.dropBannerCmsData[0];
	const sectionFourCmsData = data?.data?.sectionFourCmsData[0];
	const sectionSevenCmsData = data?.data?.sectionSevenCmsData[0];
	const sectionThreeCmsData = data?.data?.sectionThreeCmsData[0];
	const sectionTwoCmsData = data?.data?.sectionTwoCmsData[0];
	const sliderData = data?.data?.sliderData;
	const homeComponentUI = data?.data?.homeComponentUI[0];
	const homePageSubNav = data?.data?.homePageSubNav;

	const title = 'home page';
	const description = 'home page description';
	const keywords = 'home page, home page';
	const settings = {
		dots: false,
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		adaptiveHeight: false,
		centerMode: false,
		arrows: true,
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />,
		dotsClass: 'dots',
		autoplay: false,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};
	const categorySliderSettings = {
		dots: false,
		infinite: true,
		slidesToShow: categories.length == 1 ? 1 : categories.length == 2 ? 2 : 3,
		slidesToScroll: 1,
		adaptiveHeight: false,
		centerMode: false,
		arrows: true,
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />,
		dotsClass: 'dots',
		autoplay: false,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow:
						categories.length == 1 ? 1 : categories.length == 2 ? 2 : 3,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow:
						categories.length == 1 ? 1 : categories.length == 2 ? 2 : 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow:
						categories.length == 1 ? 1 : categories.length == 2 ? 1 : 1,
					slidesToScroll: 1,
				},
			},
		],
	};
	const settings2 = {
		dots: false,
		infinite: sectionFour && sectionFour?.length > 4,
		slidesToShow: 4,
		slidesToScroll: 1,
		adaptiveHeight: false,
		centerMode: false,
		arrows: true,
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />,
		dotsClass: 'dots',
		autoplay: false,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};
	const router = useRouter();
	const [divToShow, setDivToShow] = useState(0);

	const handleToggle = (index) => {
		setDivToShow(index);
	};

	function getSectionFive() {
		postData(api.home.getProductFilter, {
			retailerId: selectedRetailer?.id,
			menuType: menuTypeValue,
			filter: {
				menuSection: {
					type: 'CUSTOM_SECTION',
					name: 'Home Higher Self',
				},
			},
		})
			.then((response) => {
				setSectionFive(response?.data?.menu?.products);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	// function toTitleCase(str) {
	//     return str.replace(
	//         /\w\S*/g,
	//         function (txt) {
	//             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	//         }
	//     );
	// }

	const handleSectionFourPriceRangeProduct = (e) => {
		e.preventDefault();
		// router.push({ pathname: '/shop', query: { minPrice: 0, maxPrice: e.target.getAttribute("price-data") } })
		let priceValue = Number(e.target.getAttribute('price-data'));
		dispatch(setPriceFilter(true));
		dispatch(setFilterPriceValue(priceValue));
		router.push('/shop');
	};

	// popup modal
	// const [popupModal, setPopupModal] = useState(false);
	const [allRetialer, setAllRetailer] = useState([]);
	const [skeletonHoldSearch, setSkeletonHoldSearch] = useState(false);
	const [location, setLocation] = useState({
		lat: 0,
		lng: 0,
	});
	const [zipCodeOrName, setZipCodeOrName] = useState('Zip Code');
	const [searchType, setSearchType] = useState('ZipOrLocation');
	const [search, setSearch] = useState('');

	const [getRetailer, result] = useGetRetailerAllDataMutation([]);
	const [getRetailerFilterAll, result1] = useGetRetailerFilterAllDataMutation(
		[]
	);

	function handleAllRetailers() {
		if (allFormatedRetailer && allFormatedRetailer?.length > 0) {
			setAllRetailer(allFormatedRetailer);
		} else {
			const formatedRetailerData = JSON.parse(
				localStorage.getItem('formatedRetailerData') || '{}'
			);
			setAllRetailer(formatedRetailerData ?? {});
		}
	}

	useEffect(() => {
		window.scrollTo(0, 0);

		const selectedRetailerCheck = localStorage.getItem('selected-retailer');
		if (
			selectedRetailer == 'undefined' ||
			selectedRetailerCheck == 'undefined' ||
			!selectedRetailerCheck
		) {
			dispatch(setPopupModal(true));
		} else {
			dispatch(setPopupModal(false));
		}

		handleAllRetailers();
	}, [initialPage]);

	useEffect(() => {
		getSectionFive();
		try {
			dispatch(setSiteLoader(true));
			if (data?.data?.sliderData?.length > 0) {
				dispatch(setSiteLoader(false));
			}
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(setSiteLoader(false));
		}
	}, [selectedRetailer?.id, menuTypeValue]);

	const searchByAllowAccessMyLocation = (e) => {
		e.preventDefault();
		checkElasticSearch.current = true;
		setSearchType('Closest Location');
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLocation({
						lat: parseFloat(position?.coords?.latitude),
						lng: parseFloat(position?.coords?.longitude),
						// lat: 42.445586,
						// lng: -83.1473961,
					});

					setSkeletonHoldSearch(true);

					let closestLocationT = 'Closest Location';
					try {
						postData(
							api.retailerAll.searchRetailerFilterAllURL +
							`${closestLocationT}`,
							{
								userLatitude: parseFloat(position?.coords?.latitude)
									? parseFloat(position?.coords?.latitude)
									: 0,
								userLongitude: parseFloat(position?.coords?.longitude)
									? parseFloat(position?.coords?.longitude)
									: 0,
								maxDistance: 500.0,
								// userLatitude: 42.445586,
								// userLongitude: -83.1473961,
								// maxDistance: 500.00
							}
						)
							.then((response) => {
								if (response?.data) {
									setSkeletonHoldSearch(false);
								}
								setAllRetailer(response?.data);
							})
							.catch((error) => {
								console.log(error);
							});
					} catch (error) {
						console.log(error);
					} finally {
						if (allRetialer?.length < 0) {
							setTimeout(() => {
								setSkeletonHoldSearch(false);
							}, 5000);
						}
					}
				},
				(error) => {
					console.error(error);
				}
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
		}
	};

	const handleHomeRetailerSearch = async (e) => {
		e.preventDefault();
		checkElasticSearch.current = true;
		const searchList = [];
		const searchLowerCase = search.toLowerCase();

		if (!search) {
			createToast('Please enter zip / postal-code', 'error');
			setAllRetailer(allFormatedRetailer);
		} else {
			for (const item of allFormatedRetailer) {
				const name = item.name.toLowerCase();
				const address = item.address.toLowerCase();
				const isMatch =
					name.includes(searchLowerCase) || address.includes(searchLowerCase);

				if (isMatch) {
					searchList.push(item);
				}
			}

			if (searchList?.length <= 0 && !isNaN(search)) {
				setSkeletonHoldSearch(true);
				const data = await zipCodeToLatLng(search);

				setSearchType('Closest Location');
				if (data?.latitude && data?.longitude) {
					setLocation({
						lat: parseFloat(data?.latitude),
						lng: parseFloat(data?.longitude),
					});

					let closestLocationT = 'Closest Location';
					try {
						postData(
							api.retailerAll.searchRetailerFilterAllURL +
							`${closestLocationT}`,
							{
								userLatitude: parseFloat(data?.latitude)
									? parseFloat(data?.latitude)
									: 0,
								userLongitude: parseFloat(data?.longitude)
									? parseFloat(data?.longitude)
									: 0,
								maxDistance: 500.0,
							}
						)
							.then((response) => {
								if (response?.data) {
									setSkeletonHoldSearch(false);
								}
								setAllRetailer(response?.data);
							})
							.catch((error) => {
								console.log(error);
							});
					} catch (error) {
						console.log(error);
					} finally {
						if (allRetialer?.length < 0) {
							setTimeout(() => {
								setSkeletonHoldSearch(false);
							}, 5000);
						}
					}
				}
			}
			setAllRetailer(searchList);
		}
	};

	const handleRetailerSearchByElastic = (search) => {
		const searchList = [];
		const searchLowerCase = search.toLowerCase();

		if (search) {
			for (const item of allFormatedRetailer) {
				const name = item.name.toLowerCase();
				const address = item.address.toLowerCase();
				const isMatch =
					name.includes(searchLowerCase) || address.includes(searchLowerCase);

				if (isMatch) {
					searchList.push(item);
				}
			}
			setAllRetailer(searchList);
			setSearch('');
		}
	};

	const handleRetialderSelectManually = async (retailerId, e) => {
		e.preventDefault();
		setAllRetailer(allFormatedRetailer);
		setActiveLoader(true);
		try {
			let response = await postData(api.retailerAll.retailerDetails, {
				retailerId: retailerId,
			});
			if (response.status == 201 || response.status == 200) {
				let retailerRes = response.data.retailer;
				dispatch(setSelectedRetailer(retailerRes));
				localStorage.setItem('selected-retailer', JSON.stringify(response.data.retailer));
				//setting retailer type,
				const retailerType = getRetailerType(retailerRes);
				localStorage.setItem('retailer_type', JSON.stringify(retailerType));
				localStorage.setItem('active_retailer_type', JSON.stringify(retailerType));
				dispatch(setActiveRetailerType(retailerType));

				dispatch(setPopupModal(false));
				let checkoutId = await createCheckout({
					retailerId: response.data.retailer.id,
					orderType: retailerType == 'Curbside Pickup' ? 'PICKUP' : retailerType.toUpperCase(),
					pricingType: 'RECREATIONAL',
				});
				if (checkoutId) {
					dispatch(setCheckoutId(checkoutId));
				}
				dispatch(setMenuTypeValue('RECREATIONAL'));
				localStorage.setItem("menuTypeValue", 'RECREATIONAL');
			} else {
				createToast('Something went wrong! Please try again.', 'error');
			}
			setActiveLoader(false);
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(setSiteLoader(false));
		}
	};

	const handleRetialderAZSelectManually = async (azLink, e) => {
		console.log(azLink);
		window.location.href = azLink;
		return false;
	};

	function calcCrow(latOne, lngOne, latTwo, lngTwo) {
		const R = 6371;
		const dLat = toRadian(latTwo - latOne);
		const dLng = toRadian(lngTwo - lngOne);
		latOne = toRadian(latOne);
		latTwo = toRadian(latTwo);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2) *
			Math.cos(latOne) *
			Math.cos(latTwo);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const d = R * c;
		return d * 0.621371;
	}

	function toRadian(value) {
		return (value * Math.PI) / 180;
	}

	async function getSchemaCms() {
		try {
			await fetchData(api.cms.pageSchema)
				.then((response) => {
					let data = response?.data?.[0];
					if (data?.homePage) {
						setHomeSchema(data?.homePage);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		} catch (error) {
			console.log(error);
		}
	}

	// Group addresses by state
	const groupedAddresses = sortArrayStateAlphabetically(allRetialer)?.reduce(
		(acc, curr) => {
			const state = curr?.addressObject?.state;
			if (!acc[state]) {
				acc[state] = [];
			}
			acc[state].push(curr);
			return acc;
		},
		{}
	);
	const stateNameGroup = groupedAddresses ? Object.keys(groupedAddresses) : [];

	const handleRetailerSateSet = (state) => {
		localStorage.setItem('user_selected_retailer_state', JSON.stringify(state));
		dispatch(setUserSelectRetailerState(state));
		const filteredAddresses = allRetialer?.filter(
			(address) => address.addressObject.state === state
		);
		setAllRetailer(filteredAddresses);
		dispatch(setFirstPopupForState(false));
	};

	const handleSitePopupRetailerSateSet = (state) => {
		localStorage.setItem('user_selected_retailer_state', JSON.stringify(state));
		dispatch(setUserSelectRetailerState(state));
		dispatch(setSecondPopupModal(false));
		// const filteredAddresses = allRetialer?.filter(
		//     (address) => address.addressObject.state === state
		// );
		// setAllRetailer(filteredAddresses);
	};

	const handleSearch = async (value) => {
		setSearch(value);
		const stateName = JSON.parse(
			localStorage.getItem('user_selected_retailer_state')
		);
		const data = {
			search: value,
			state: stateName,
			limit: allFormatedRetailer?.length,
		};
		await getRetailerElasticSearch({ data });
		if (value) {
			setCustomSuggestion(true);
		} else {
			setCustomSuggestion(false);
		}
		// let dataSearch = await postData(api.retailerAll.retailerElasticSearch, data);
		// console.log(dataSearch);
	};

	const handleBackButton = () => {
		dispatch(setFirstPopupForState(!firstPopupForState));
		// localStorage.removeItem('user_selected_retailer_state');
		// dispatch(setUserSelectRetailerState("undefined"));
		handleAllRetailers();
	};

	function handleScroll(sectionId) {
		const section = document.getElementById(sectionId);

		if (section) {
			section.scrollIntoView({ behavior: 'smooth' });
		}
	}

	useEffect(() => {
		getSchemaCms();
		dispatch(setSiteLoader(false));
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		// Add event listener for window resize
		window.addEventListener('resize', handleResize);

		// Initial check for screen size on component mount
		handleResize();

		// Cleanup the event listener on component unmount
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [selectedRetailer]);


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
		<>
			<Head>
				<meta name="description" content={pageMeta?.homePageMetaDescription} />
				<meta name="keywords" content={pageMeta?.homePageMetaKeyword} />
				{homeSchema && (
					<script
						id="json_ld_home"
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: homeSchema }}
					/>
				)}

				<style>{`
                    .higherSelfComponentUI {
                        background-color: ${homeComponentUI?.higherSelfSectionCardButtonBackgroundColor} !important;
                        border-color: ${homeComponentUI?.higherSelfSectionCardButtonBorderColor} !important;
                        color: ${homeComponentUI?.higherSelfSectionCardButtonFontColor} !important;
                    }
                    .higherSelfComponentUI:hover {
                        background-color: ${homeComponentUI?.higherSelfSectionCardButtonHoverBackgroundColor} !important;
                        border-color: ${homeComponentUI?.higherSelfSectionCardButtonHoverBorderColor} !important;
                        color: ${homeComponentUI?.higherSelfSectionCardButtonHoverFontColor} !important;
                    }
        `}</style>
			</Head>
			{activeLoader && <Loader />}
			{!isLoading ? (
				<>
					{data?.data?.sliderData?.length > 0 && (
						<div
							style={{
								backgroundColor: `${homeComponentUI?.pageBackgroundColor}`,
							}}
						>
							<Meta
								title={pageTitles?.homePageTitle}
								keywords={keywords}
								description={description}
							/>
							<section>
								<SliderHeader sliderData={sliderData} />
							</section>
							{/* Start home popup state change popup */}
							{!initialPage ? (
								<AgeVerification />
							) : firstPopupForState ? (
								<div
									className={`modal fade ${popupModal
										? `show ${styles.customModalLocation} ${styles.modalShow}`
										: ''
										}  `}
									id="exampleModal"
								>
									<div
										className={`modal-dialog modal-md modal-dialog-centered`}
									>
										<div className="modal-content position-relative">
											<div className="modal-body">
												<div className="d-flex flex-column flex-lg-row justify-content-center align-items-center">
													<div className="w-100">
														<div>
															<h2 className="fs-22 ff-Soleil700 text-center mb-4">
																Select a State
															</h2>
														</div>
														<hr />
														<ul className="list-group">
															{/* {Object.entries(groupedAddresses).map(([state, addresses]) => { */}
															{sortArrayStateAlphabeticallyAfterFilter(
																stateNameGroup
															)?.map((state, index) => {
																let stateListData = stateList.filter(
																	(data) => data.code == state
																);
																return (
																	<li
																		key={index}
																		className="list-group-item list-group-item-action list-group-item-light d-flex justify-content-between align-content-center cp mt-2 rounded-pill border shadow-sm"
																		onClick={() => handleRetailerSateSet(state)}
																	>
																		<span className="w-100">
																			<span>
																				<i className="bx bx-location-plus"></i>
																			</span>
																			<span
																				style={{ marginLeft: '20px' }}
																				className="fs-20 me-4"
																			>
																				{stateListData[0].name}
																			</span>
																		</span>
																		<span
																			style={{ transform: 'translateY(5px)' }}
																		>
																			<i className="bx bx-right-arrow-circle fs-20"></i>
																		</span>
																	</li>
																);
															})}
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div
									className={`modal fade ${popupModal
										? `show ${styles.customModalLocation} ${styles.modalShow}`
										: ''
										}  `}
									id="exampleModal"
								>
									<div
										className={`modal-dialog modal-md modal-dialog-centered`}
									>
										<div className="modal-content position-relative">
											{/* <div className={styles.closeButton}>
                                            <button type="button" className="btn-close" data-bs-dismiss="exampleModal" aria-label="Close"></button>
                                        </div> */}
											<div className="modal-body">
												<div className="modal-body">
													<div className="d-flex flex-column flex-lg-row justify-content-center align-items-center">
														<div className="w-100">
															<div className="d-flex gap-5 align-content-center justify-content-between">
																<h4
																	className="fs-22 fs-md-18 ff-Soleil700 mb-4 w-75 cp mt-1 d-flex align-items-center"
																	onClick={handleBackButton}
																>
																	<i className="bx bx-left-arrow-alt"></i> Back
																</h4>
																<h2 className="fs-22 fs-md-18 ff-Soleil700 mb-4 w-75">
																	Select a Store
																</h2>
															</div>
															<div>
																<form>
																	<div className="mb-3">
																		<div className="d-flex flex-column">
																			<div className="input-group">
																				{/* <input onChange={(e) => setSearch(e.target.value)} type="search" name="search" className="form-control border border-1 border-dark py-2 shadow-none rounded-0 h-100" placeholder="Zip/Postal Code" aria-label="Recipient's username" aria-describedby="button-addon2" /> */}
																				<input
																					ref={suggestionRef}
																					onChange={(e) =>
																						handleSearch(e.target.value)
																					}
																					type="search"
																					name="search"
																					className="form-control border border-1 border-dark py-2 shadow-none rounded-0 h-100"
																					placeholder="Zip/Postal Code"
																					aria-label="Recipient's username"
																					aria-describedby="button-addon2"
																					autoComplete="off"
																					value={search}
																				/>
																				{customSuggestion && (
																					<div
																						className={`container ${styles.search_card_suggestion}`}
																					>
																						<div className="row d-flex justify-content-center shadow-lg">
																							<div className="custom-search-modal-card">
																								<ul className="list-group list-group-flush">
																									{results?.data?.data
																										?.retailers?.length > 0 ? (
																										results?.data?.data?.retailers.map(
																											(data, index) => {
																												return (
																													<li
																														key={index}
																														className="list-group-item cp"
																														onClick={() =>
																															handleRetailerSearchByElastic(
																																data?.retailerName
																															)
																														}
																													>
																														{data?.retailerName}
																													</li>
																													// <li key={index} className='list-group-item cp' onClick={() => setSearch(data?.retailerName)}>{data?.retailerName}</li>
																												);
																											}
																										)
																									) : (
																										<li className="list-group-item text-center">
																											<Skeleton
																												style={{
																													width: '100%',
																													height: '30px',
																												}}
																											/>
																										</li>
																									)}
																								</ul>
																							</div>
																						</div>
																					</div>
																				)}
																				<button
																					onClick={handleHomeRetailerSearch}
																					className="btn btn-dark rounded-0 ff-Soleil700"
																					style={{ height: '40px' }}
																					type="submit"
																					id="button-addon2"
																				>
																					Search
																				</button>
																			</div>
																			<div className="input-group mt-0 mt-lg-2">
																				<span
																					className={`${styles.popupSearchType}`}
																				>
																					<div className="w-100 text-center mt-2 mt-lg-0">
																						<button
																							onClick={
																								searchByAllowAccessMyLocation
																							}
																							className="btn btn-dark rounded-0 ff-Soleil700 w-100 text-nowrap"
																							style={{ height: '42px' }}
																						>
																							Allow Access My Location
																						</button>
																					</div>
																				</span>
																			</div>
																		</div>
																	</div>
																</form>
															</div>
															<hr />

															<div className={styles.customLocation}>
																{allRetialer?.length > 0 ? (
																	sortArrayAlphabetically(allRetialer, checkElasticSearch.current)
																		.map((li, index) => {
																			let userLat = location?.lat ? location?.lat : 0;
																			let userLng = location?.lng
																				? location?.lng
																				: 0;
																			let retailerLat = parseFloat(
																				li?.coordinates?.latitude
																			);
																			let retailerLng = parseFloat(
																				li?.coordinates?.longitude
																			);
																			let distance = calcCrow(
																				userLat,
																				userLng,
																				retailerLat,
																				retailerLng
																			).toFixed(2);
																			// console.log('distance', distance)
																			let showDistance = false;
																			if (distance >= 0) {
																				showDistance = true;
																			}
																			let dayN = '';
																			for (let hour in li?.hours) {
																				dayN = checkActiveDay(li);
																			}
																			if (li.hours?.curbsidePickup?.[dayName]?.active || li.hours?.delivery?.[dayName]?.active || li.hours?.pickup?.[dayName]?.active) {
																				if (li.name != 'JARS Cannabis – Ann Arbor - Main St.' && li.name != 'JARS Cannabis – Test') {
																					return (
																						<>
																							{li?.addressObject?.state ==
																								'AZ' ? (
																								<>
																									{customAZList.map(
																										(item, index_az) => (
																											<div
																												key={
																													'az-0' +
																													index_az +
																													'-jars'
																												}
																											>
																												<div>
																													<div className="d-flex">
																														<div className="ms-2">
																															<p className="fs-16 my-auto ff-Soleil700">
																																{item?.name}
																															</p>
																															<p className="fs-12 mt-2 ff-Soleil400">
																																{item?.address}
																																{showDistance &&
																																	searchType ==
																																	'Closest Location'
																																	? ` (Distance: ${distance} Miles)`
																																	: ''}
																															</p>
																															{li?.contactNumber && (
																																<Link
																																	href={`tel:${li?.contactNumber}`}
																																	className="fs-12 mt-1 ff-Soleil400"
																																>
																																	<BiPhone />
																																	&ensp;
																																	{
																																		li?.contactNumber
																																	}
																																</Link>
																															)}
																															<div className="d-flex fs-16 mt-3">
																																<p className="text-primary ff-Soleil700">
																																	Open{' '}
																																	{item?.open}{' '}
																																	&nbsp;
																																</p>
																																<p className="">
																																	{' '}
																																	|{' '}
																																</p>
																																<p className="ff-Soleil700">
																																	&nbsp;Closes{' '}
																																	{item?.end}
																																</p>
																															</div>
																															<div>
																																<button
																																	onClick={(e) =>
																																		handleRetialderAZSelectManually(
																																			item?.link,
																																			e
																																		)
																																	}
																																	className="btn btn-dark fs-14 ff-Soleil700"
																																>
																																	Shop With This
																																	Store
																																</button>
																															</div>
																														</div>
																													</div>
																												</div>
																												<hr />
																											</div>
																										)
																									)}
																								</>
																							) : (
																								<div key={index}>
																									<div>
																										<div className="d-flex">
																											<div className="ms-2">
																												<p className="fs-16 my-auto ff-Soleil700">
																													{li?.name}
																												</p>
																												<p className="fs-12 mt-2 ff-Soleil400">
																													{
																														li?.addressObject
																															?.line1
																													}
																													,{' '}
																													{
																														li?.addressObject
																															?.city
																													}
																													,{' '}
																													{
																														li?.addressObject
																															?.state
																													}
																													,{' '}
																													{
																														li?.addressObject
																															?.postalCode
																													}
																													{showDistance &&
																														searchType ==
																														'Closest Location'
																														? ` (Distance: ${distance} Miles)`
																														: ''}
																												</p>
																												{li?.contactNumber && (
																													<Link
																														href={`tel:${li?.contactNumber}`}
																														className="fs-12 mt-1 ff-Soleil400"
																													>
																														<BiPhone />
																														&ensp;
																														{li?.contactNumber}
																													</Link>
																												)}
																												<div className="d-flex fs-16 mt-3">
																													<p className="text-primary ff-Soleil700">
																														Open {dayN?.start}{' '}
																														&nbsp;
																													</p>
																													<p className=""> | </p>
																													<p className="ff-Soleil700">
																														&nbsp;Closes{' '}
																														{dayN?.end}
																													</p>
																												</div>
																												<div>
																													<button
																														onClick={(e) =>
																															handleRetialderSelectManually(
																																li?.id,
																																e
																															)
																														}
																														className="btn btn-dark fs-14 ff-Soleil700"
																													>
																														Shop With This Store
																													</button>
																												</div>
																											</div>
																										</div>
																									</div>
																									<hr />
																								</div>
																							)}
																						</>
																					);
																				}
																			}
																		})
																) : (
																	<>
																		{skeletonHoldSearch && (
																			<div>
																				<div className="">
																					<div className="d-flex">
																						<div className="ms-2" width="100%">
																							<Skeleton
																								style={{
																									width: '350px',
																									height: '30px',
																								}}
																							/>
																							<p className="fs-12 mt-2 ff-Soleil400">
																								<Skeleton
																									width="90%"
																									height="20px"
																								/>
																							</p>
																							<div
																								className="d-flex fs-16"
																								width="100%"
																							>
																								<p
																									className="text-primary ff-Soleil700"
																									style={{ width: '100%' }}
																								>
																									<Skeleton
																										width="80%"
																										height="40px"
																									/>
																								</p>
																							</div>
																							<div width="100%">
																								<Skeleton
																									width="50%"
																									height="50px"
																								/>
																							</div>
																						</div>
																					</div>
																				</div>
																				<hr />
																			</div>
																		)}

																		{!skeletonHoldSearch && (
																			<p className="text-center">
																				{' '}
																				Retailer not found!
																			</p>
																		)}
																	</>
																)}
															</div>
														</div>

														{/* <div className='w-90 text-center mt-5 mt-lg-0'>
                                                            <button onClick={() => handleRetialderSelectManually(allRetialer.[0].id)} className='btn btn-dark fs-14 ff-Soleil700'>Just Browsing</button>
                                                        </div> */}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
							<section className={`mt-4 mt-lg-0 ${styles.customGap}`}>
								<div className="d-none d-md-block">
									<div className="mx-4 mx-md-0">
										<div className="row gy-2 customBorderColor">
											{homePageSubNav?.map((li, index) => (
												<Link
													key={index}
													href={li?.link}
													onMouseEnter={() => setHoverImage(index)}
													onMouseLeave={() => setHoverImage(index - 6)}
													className={`col-12 col-md-3 col-lg-3 d-flex justify-content-center align-items-center gap-3 ${styles.highDealsButton}`}
												>
													<picture>
														{hoverImage == index ? (
															<img
																src={li?.imageTwo}
																style={{ height: '20px' }}
															/>
														) : (
															<img
																src={li?.imageOne}
																style={{ height: '30px' }}
															/>
														)}
													</picture>
													<p className="my-auto py-3 fw-bold">{li?.title}</p>
												</Link>
											))}
										</div>
									</div>
								</div>
							</section>
							{/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Modal
                                    </button> */}

							{/* category slider */}
							{
								categories?.length > 0 ?
									<section
										className={`container d-md-none mx-auto m-4  ${styles.customGap}`}
									>
										<h5 className="fw-bold my-3 text-center">{homePageMobileCategory?.title}</h5>
										<CategorySlider />
									</section>
									: <></>
							}

							{/* Shop by price start */}
							<section
								data-aos="fade-in"
								data-aos-delay="200"
								className={`container ${styles.customGap}`}
								id="shop-by-price"
							>
								<div
									className="text-site-white"
									style={{
										backgroundColor: `${homeComponentUI?.shopByPriceSectionBackgroundColor}`,
									}}
								>
									<div
										className={`w-45 w-md-100 ms-0 ms-md-2 text-center text-md-start ${styles.customShopBanner}`}
									>
										<h2
											className="fs-60 fs-xs-30 ff-PowerGrotesk700 lh-55 lh-md-30"
											style={{
												color: `${homeComponentUI?.shopByPriceSectionTitleFontColor}`,
												letterSpacing: '2px',
											}}
										>
											{sectionFourCmsData?.title || ''}
										</h2>
										<p
											className="lh-10 fs-14 mt-0 mt-md-3 mb-0 mb-lg-2 ff-Soleil400 py-1 py-md-0"
											style={{
												color: `${homeComponentUI?.shopByPriceSectionSubtitleFontColor}`,
											}}
										>
											{sectionFourCmsData?.subTitle || ''}
										</p>
									</div>
									<div
										className="d-flex justify-content-center d-md-none pb-4"
										style={{ marginTop: '-5px' }}
									>
										<Link
											href={sectionFourCmsData?.buttonLink || ''}
											className="btn btn-light ff-Soleil400 border-0 rounded-pill fs-14 fs-md-12"
											style={{
												width: '104px',
												height: '31px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												backgroundColor: `${homeComponentUI?.shopByPriceSectionButtonBackgroundColor}`,
												color: `${homeComponentUI?.shopByPriceSectionButtonFontColor}`,
												borderColor: `${homeComponentUI?.shopByPriceSectionButtonBorderColor}`,
											}}
										>
											{sectionFourCmsData?.buttonText || ''}
										</Link>
									</div>
								</div>
							</section>
							{/* Shop by price slider start */}
							<section className={styles.customGap}>
								<div className="container">
									<Slider {...settings2}>
										{sectionFour?.map((second_slider, index) => (
											<div className="slider-item h-100" key={index}>
												<div className="card h-100 rounded-0 border-0 justify-content-center align-items-center borderSliderFour">
													<div
														className={`card-body w-100 text-center d-flex align-items-center ${styles.sliderTwoCardContext}`}
													>
														<div className="w-100 py-5 py-lg-2">
															{second_slider.type == 'Price' ? (
																<>
																	<p
																		className={`fs-16 ff-powerGrotesk700 text-site-black`}
																	>
																		UNDER
																	</p>
																	<h2
																		className={`fs-60 lh-60 ff-powerGrotesk700 text-site-black ${styles.custom_sale_box}`}
																	>
																		${second_slider?.title}
																	</h2>
																	{second_slider?.buttonLink ? (
																		<div
																			style={{
																				display: 'flex',
																				justifyContent: 'center',
																				alignItems: 'center',
																			}}
																		>
																			<Link
																				href={
																					userInfo.id
																						? second_slider?.buttonTwoLink
																						: second_slider?.buttonLink || ''
																				}
																				className="btn border-0 fs-16 ff-powerGrotesk700 text-site-white bg-site-black rounded-pill text-uppercase"
																				style={{
																					height: '46px',
																					width: '205px',
																					display: 'flex',
																					alignItems: 'center',
																					justifyContent: 'center',
																				}}
																			>
																				{userInfo.id
																					? second_slider?.buttonTwoText
																					: second_slider?.buttonText}
																			</Link>
																		</div>
																	) : (
																		<div
																			style={{
																				display: 'flex',
																				justifyContent: 'center',
																				alignItems: 'center',
																			}}
																		>
																			<Link
																				href="#"
																				onClick={
																					handleSectionFourPriceRangeProduct
																				}
																				className="btn border-0 fs-16 ff-powerGrotesk700 text-site-white bg-site-black rounded-pill text-uppercase"
																				style={{
																					height: '46px',
																					width: '205px',
																					display: 'flex',
																					alignItems: 'center',
																					justifyContent: 'center',
																				}}
																				price-data={second_slider?.title}
																			>
																				{userInfo.id
																					? second_slider?.buttonTwoText
																					: second_slider?.buttonText}
																			</Link>
																		</div>
																	)}
																</>
															) : (
																<>
																	<h2
																		className={`fs-60 lh-60 ff-powerGrotesk700 text-site-black mb-5 ${styles.custom_sale_box}`}
																	>
																		{second_slider?.title}
																	</h2>
																	<div
																		style={{
																			display: 'flex',
																			justifyContent: 'center',
																			alignItems: 'center',
																		}}
																	>
																		<Link
																			href={
																				userInfo.id
																					? second_slider?.buttonTwoLink
																					: second_slider?.buttonLink || ''
																			}
																			className="btn border-0 fs-16 ff-powerGrotesk700 text-site-white bg-site-black rounded-pill text-uppercase"
																			style={{
																				height: '46px',
																				width: '205px',
																				display: 'flex',
																				alignItems: 'center',
																				justifyContent: 'center',
																			}}
																		>
																			{userInfo.id
																				? second_slider?.buttonTwoText
																				: second_slider?.buttonText}
																		</Link>
																	</div>
																</>
															)}
														</div>
													</div>
												</div>
											</div>
										))}
									</Slider>
								</div>
							</section>
							{/* Shop by price slider end */}
							{/* section three  */}
							<section className={`container mt-5 ${styles.customGap}`}>
								<div
									className="container row position-relative py-0 mx-auto"
									style={{ background: '#C4C4D9' }}
								>
									<div className="col-4 col-md-3 my-auto">
										<img
											src={sectionThreeCmsData?.image}
											className={`${styles.sectionThreeCmsImage}`}
										/>
									</div>
									<div className="col-8 col-md-9 my-auto">
										<div
											className={`d-flex flex-column flex-lg-row justify-content-around py-4 ${styles.sectionThreeCmsText}`}
										>
											<div className="bg-transparent my-auto">
												<div className="mt-2">
													<h3 className="fw-bold fs-24 fs-md-18 ff-PowerGrotesk700 lh-md-20 lh-33">
														{sectionThreeCmsData?.title}
													</h3>
													<p
														className="fs-14 fs-md-12"
														dangerouslySetInnerHTML={{
															__html: sectionThreeCmsData?.subTitle,
														}}
													></p>
												</div>
											</div>
											<div
												className={`bg-transparent my-auto ${styles.sectionThreeCmsButton}`}
											>
												<button
													onClick={() => {
														router.push(`${sectionThreeCmsData?.buttonLink}`);
													}}
													className="btn btn-dark px-4 px-lg-5 py-2 border-0 rounded-pill fs-16 fs-md-12 text-site-white"
												>
													{sectionThreeCmsData?.buttonText}
												</button>
											</div>
										</div>
									</div>
								</div>
							</section>
							{/* High Five Section*/}
							<section className={`${styles.customGap}`} id="the-high-five">
								<Slider_one
									sectionTwoCmsData={sectionTwoCmsData}
									homeComponentUI={homeComponentUI}
								/>
							</section>

							{/* Common Banner */}
							<section
								data-aos="fade-left"
								data-aos-delay="200"
								className={`container index-common-banner ${styles.customGap}`}
							>
								<Banner commonBannerCmsData={commonBannerCmsData} />
							</section>

							{/* New Drops Slider Start */}
							<section className={styles.customGap} id="new-drops">
								<Slider_two homeComponentUI={homeComponentUI} />
							</section>
							{/* New Drops Slider End */}
							{/* Hihger Test Puzzle Design */}
							{sectionFiveCms?.status && sectionFive?.length > 0 ? (
								<>
									<section
										className={`container ${styles.customGap}`}
										id="higher-self"
									>
										<div className="row">
											{!isMobile && (
												<div className="col-12 col-md-5 col-lg-5">
													<div
														className="border border-dark h-100 mb-3 mb-md-0"
														style={{
															backgroundColor: `${homeComponentUI?.higherSelfSectionCardOneBackgroundColor}`,
														}}
													>
														<div>
															<img
																src={sectionFive[0]?.image}
																className={styles.left_big_img}
															/>
														</div>
														<div className="px-3 py-4">
															<p
																className="my-auto"
																style={{
																	color: `${homeComponentUI?.higherSelfSectionCardOneSubtitleFontColor}`,
																}}
															>
																{sectionFive[0]?.brand?.name}
															</p>
															<Link
																href={`/product-details/${sectionFive[0]?.slug}`}
																className="fs-24 fw-bold line-clamp-1"
																style={{
																	cursor: 'pointer',
																	color: `${homeComponentUI?.higherSelfSectionCardOneTitleFontColor}`,
																}}
															>
																{sectionFive[0]?.name}
															</Link>

															{
																(menuTypeValue == 'MEDICAL') ?
																	<>
																		{
																			sectionFive[0]?.variants[0]?.specialPriceMed ?
																				(
																					<p className="card-text my-auto">
																						<small className="text-muted">
																							<span className="text-danger fs-16">
																								Now $
																								{
																									sectionFive[0]?.variants[0]
																										?.specialPriceMed
																								}{' '}
																							</span>
																							${sectionFive[0]?.variants[0]?.priceMed}
																						</small>{' '}
																						|{' '}
																						<small className="text-muted">
																							{sectionFive[0]?.variants[0]?.option}
																						</small>
																					</p>
																				) :
																				(
																					<p className="card-text my-auto">
																						<small className="text-muted">
																							<span className="text-danger fs-16">
																								Now $
																								{sectionFive[0]?.variants[0]?.priceMed}
																							</span>
																						</small>{' '}
																						|{' '}
																						<small className="text-muted">
																							{sectionFive[0]?.variants[0]?.option}
																						</small>
																					</p>
																				)
																		}
																	</>
																	: menuTypeValue == 'RECREATIONAL' ?
																		<>
																			{
																				sectionFive[0]?.variants[0]?.specialPriceRec ?
																					(
																						<p className="card-text my-auto">
																							<small className="text-muted">
																								<span className="text-danger fs-16">
																									Now $
																									{
																										sectionFive[0]?.variants[0]?.specialPriceRec
																									}{' '}
																								</span>
																								${sectionFive[0]?.variants[0]?.priceRec}
																							</small>{' '}
																							|{' '}
																							<small className="text-muted">
																								{sectionFive[0]?.variants[0]?.option}
																							</small>
																						</p>
																					) :
																					(
																						<p className="card-text my-auto">
																							<small className="text-muted">
																								<span className="text-danger fs-16">
																									Now $
																									{sectionFive[0]?.variants[0]?.priceRec}
																								</span>
																							</small>{' '}
																							|{' '}
																							<small className="text-muted">
																								{sectionFive[0]?.variants[0]?.option}
																							</small>
																						</p>
																					)
																			}
																		</>
																		: <></>
															}

															<Link
																href={`/product-details/${sectionFive[0]?.slug}`}
																className="px-5 mt-3 rounded-pill fs-16 fs-md-12 btn btn-outline-dark ff-Soleil400 higherSelfComponentUI"
															>
																Shop now
																<span>
																	<FiArrowUpRight className="fs-16 fs-md-14 my-auto fw-bold" />
																</span>
															</Link>
														</div>
													</div>
												</div>
											)}
											<div className="col-12 col-md-7 d-flex flex-column">
												<div
													style={{
														backgroundColor: `${homeComponentUI?.higherSelfSectionBackgroundColor}`,
													}}
													className={`text-site-white d-flex flex-column justify-content-start border border-2 border-dark mt-3 mt-md-0 ${styles.customHigherSelf}`}
												>
													<div className="my-auto text-site-white py-0 py-md-3">
														<h2
															className="w-25 w-md-100 mx-4 fs-60 fs-xs-30 ff-PowerGrotesk700 lh-55 ms-0 ms-md-4 text-center text-md-start"
															style={{
																color: `${homeComponentUI?.higherSelfSectionTitleFontColor}`,
																letterSpacing: '2px',
															}}
														>
															{sectionFiveCms?.title}
														</h2>
														<div className="d-flex flex-column flex-md-row justify-content-between mx-lg-4 mx-md-4">
															<p
																className="text-center mb-0 fs-14 mt-0 mt-md-2 ff-Soleil400"
																style={{
																	color: `${homeComponentUI?.higherSelfSectionSubtitleFontColor}`,
																}}
															>
																{sectionFiveCms?.subTitle}
															</p>
															<Link
																className="d-flex justify-content-center"
																style={{
																	cursor: 'pointer',
																	color: `${homeComponentUI?.higherSelfSectionButtonFontColor}`,
																}}
																href="/shop"
															>
																<p className="d-none d-md-block d-lg-block mb-0 fs-14 mt-2 ff-Soleil400">
																	<u>{sectionFiveCms?.buttonText}</u>
																</p>
															</Link>

															<div
																className={`d-md-none text-center ${styles.higherSelf}`}
															>
																<Link
																	href="/shop"
																	className="px-3 px-md-5 py-1 border-0 rounded-pill fs-14 fs-md-14 fw-bold"
																	style={{
																		color: `${homeComponentUI?.higherSelfSectionButtonFontColor}`,
																	}}
																>
																	{sectionFiveCms?.buttonText}
																</Link>
															</div>
														</div>
													</div>
												</div>
												<div
													className="border border-dark mt-3 h-100 mb-3 mb-md-0"
													style={{
														backgroundColor: `${homeComponentUI?.higherSelfSectionCardTwoBackgroundColor}`,
													}}
												>
													<div>
														<img
															src={sectionFive[1]?.image}
															className={styles.right_big_image}
														/>
													</div>
													<div className="p-3">
														<p
															className="my-auto"
															style={{
																color: `${homeComponentUI?.higherSelfSectionCardTwoSubtitleFontColor}`,
															}}
														>
															{sectionFive[1]?.brand?.name}
														</p>
														<Link
															className="fs-24 fw-bold line-clamp-1"
															style={{
																cursor: 'pointer',
																color: `${homeComponentUI?.higherSelfSectionCardTwoTitleFontColor}`,
															}}
															href={`/product-details/${sectionFive[1]?.slug}`}
														>
															{sectionFive[1]?.name}
														</Link>

														{
															(menuTypeValue == 'MEDICAL') ?
																<>
																	{
																		sectionFive[1]?.variants[0]?.specialPriceMed ?
																			(
																				<p className="card-text my-auto">
																					<small className="text-muted">
																						<span className="text-danger fs-16">
																							Now $
																							{
																								sectionFive[1]?.variants[0]
																									?.specialPriceMed
																							}{' '}
																						</span>
																						${sectionFive[1]?.variants[0]?.priceMed}
																					</small>{' '}
																					|{' '}
																					<small className="text-muted">
																						{sectionFive[1]?.variants[0]?.option}
																					</small>
																				</p>
																			) :
																			(
																				<p className="card-text my-auto">
																					<small className="text-muted">
																						<span className="text-danger fs-16">
																							Now $
																							{sectionFive[1]?.variants[0]?.priceMed}
																						</span>
																					</small>{' '}
																					|{' '}
																					<small className="text-muted">
																						{sectionFive[1]?.variants[0]?.option}
																					</small>
																				</p>
																			)
																	}
																</>
																: menuTypeValue == 'RECREATIONAL' ?
																	<>
																		{
																			sectionFive[1]?.variants[0]?.specialPriceRec ?
																				(
																					<p className="card-text my-auto">
																						<small className="text-muted">
																							<span className="text-danger fs-16">
																								Now $
																								{
																									sectionFive[1]?.variants[0]?.specialPriceRec
																								}{' '}
																							</span>
																							${sectionFive[1]?.variants[0]?.priceRec}
																						</small>{' '}
																						|{' '}
																						<small className="text-muted">
																							{sectionFive[1]?.variants[0]?.option}
																						</small>
																					</p>
																				) :
																				(
																					<p className="card-text my-auto">
																						<small className="text-muted">
																							<span className="text-danger fs-16">
																								Now $
																								{sectionFive[1]?.variants[0]?.priceRec}
																							</span>
																						</small>{' '}
																						|{' '}
																						<small className="text-muted">
																							{sectionFive[1]?.variants[0]?.option}
																						</small>
																					</p>
																				)
																		}
																	</> : <></>
														}

														{/* {
                            sectionFive[1]?.variants[0]?.specialPriceRec ? (
                              <p className="card-text my-auto">
                                <small className="text-muted">
                                  <span className="text-danger fs-16">
                                    Now $
                                    {
                                      sectionFive[1]?.variants[0]
                                        ?.specialPriceRec
                                    }{' '}
                                  </span>
                                  ${sectionFive[1]?.variants[0]?.priceRec}
                                </small>{' '}
                                |{' '}
                                <small className="text-muted">
                                  {sectionFive[1]?.variants[0]?.option}
                                </small>
                              </p>
                            ) : (
                              <p className="card-text my-auto">
                                <small className="text-muted">
                                  <span className="text-danger fs-16">
                                    Now ${sectionFive[1]?.variants[0]?.priceRec}
                                  </span>
                                </small>{' '}
                                |{' '}
                                <small className="text-muted">
                                  {sectionFive[1]?.variants[0]?.option}
                                </small>
                              </p>
                            )} */}

														<div>
															<Link
																href={`/product-details/${sectionFive[1]?.slug}`}
																className="px-5 mt-3 rounded-pill fs-16 fs-md-14 btn btn-outline-dark ff-Soleil400 higherSelfComponentUI"
															>
																Shop now
																<span>
																	<FiArrowUpRight className="fs-16 fs-md-12 my-auto fw-bold" />
																</span>
															</Link>
														</div>
													</div>
												</div>
											</div>
											{isMobile && (
												<div className="col-12 col-md-5 col-lg-5">
													<div
														className="border border-dark h-100 mb-3 mb-md-0"
														style={{
															backgroundColor: `${homeComponentUI?.higherSelfSectionCardOneBackgroundColor}`,
														}}
													>
														<div>
															<img
																src={sectionFive[0]?.image}
																className={styles.left_big_img}
															/>
														</div>
														<div className="px-3 py-4">
															<p
																className="my-auto"
																style={{
																	color: `${homeComponentUI?.higherSelfSectionCardOneSubtitleFontColor}`,
																}}
															>
																{sectionFive[0]?.brand?.name}
															</p>
															<Link
																href={`/product-details/${sectionFive[0]?.slug}`}
																className="fs-24 fw-bold line-clamp-1"
																style={{
																	cursor: 'pointer',
																	color: `${homeComponentUI?.higherSelfSectionCardOneTitleFontColor}`,
																}}
															>
																{sectionFive[0]?.name}
															</Link>

															{
																(menuTypeValue == 'MEDICAL') ?
																	<>
																		{
																			sectionFive[0]?.variants[0]?.specialPriceMed ?
																				(
																					<p className="card-text my-auto">
																						<small className="text-muted">
																							<span className="text-danger fs-16">
																								Now $
																								{
																									sectionFive[0]?.variants[0]
																										?.specialPriceMed
																								}{' '}
																							</span>
																							${sectionFive[0]?.variants[0]?.priceMed}
																						</small>{' '}
																						|{' '}
																						<small className="text-muted">
																							{sectionFive[0]?.variants[0]?.option}
																						</small>
																					</p>
																				) :
																				(
																					<p className="card-text my-auto">
																						<small className="text-muted">
																							<span className="text-danger fs-16">
																								Now $
																								{sectionFive[0]?.variants[0]?.priceMed}
																							</span>
																						</small>{' '}
																						|{' '}
																						<small className="text-muted">
																							{sectionFive[0]?.variants[0]?.option}
																						</small>
																					</p>
																				)
																		}
																	</>
																	: menuTypeValue == 'RECREATIONAL' ?
																		<>
																			{
																				sectionFive[0]?.variants[0]?.specialPriceRec ?
																					(
																						<p className="card-text my-auto">
																							<small className="text-muted">
																								<span className="text-danger fs-16">
																									Now $
																									{
																										sectionFive[0]?.variants[0]?.specialPriceRec
																									}{' '}
																								</span>
																								${sectionFive[0]?.variants[0]?.priceRec}
																							</small>{' '}
																							|{' '}
																							<small className="text-muted">
																								{sectionFive[0]?.variants[0]?.option}
																							</small>
																						</p>
																					) :
																					(
																						<p className="card-text my-auto">
																							<small className="text-muted">
																								<span className="text-danger fs-16">
																									Now $
																									{sectionFive[0]?.variants[0]?.priceRec}
																								</span>
																							</small>{' '}
																							|{' '}
																							<small className="text-muted">
																								{sectionFive[0]?.variants[0]?.option}
																							</small>
																						</p>
																					)
																			}
																		</> : <></>
															}

															{/* {sectionFive[0]?.variants[0]?.specialPriceRec ? (
                                <p className="card-text my-auto">
                                  <small className="text-muted">
                                    <span className="text-danger fs-16">
                                      Now $
                                      {
                                        sectionFive[0]?.variants[0]
                                          ?.specialPriceRec
                                      }{' '}
                                    </span>
                                    ${sectionFive[0]?.variants[0]?.priceRec}
                                  </small>{' '}
                                  |{' '}
                                  <small className="text-muted">
                                    {sectionFive[0]?.variants[0]?.option}
                                  </small>
                                </p>
                              ) : (
                                <p className="card-text my-auto">
                                  <small className="text-muted">
                                    <span className="text-danger fs-16">
                                      Now $
                                      {sectionFive[0]?.variants[0]?.priceRec}
                                    </span>
                                  </small>{' '}
                                  |{' '}
                                  <small className="text-muted">
                                    {sectionFive[0]?.variants[0]?.option}
                                  </small>
                                </p>
                              )} */}

															<Link
																href={`/product-details/${sectionFive[0]?.slug}`}
																className="px-5 mt-3 rounded-pill fs-16 fs-md-12 btn btn-outline-dark ff-Soleil400 higherSelfComponentUI"
															>
																Shop now
																<span>
																	<FiArrowUpRight className="fs-16 fs-md-14 my-auto fw-bold" />
																</span>
															</Link>
														</div>
													</div>
												</div>
											)}
										</div>
									</section>
									<section
										data-aos="fade-left"
										data-aos-delay="200"
										className={`container ${styles.customGap}`}
									>
										<div className="row">
											<div className="col-12 col-md-7 ">
												<div
													className="border border-dark h-100 mb-3 mb-md-0"
													style={{
														backgroundColor: `${homeComponentUI?.higherSelfSectionCardThreeBackgroundColor}`,
													}}
												>
													<div>
														<img
															src={sectionFive[2]?.image}
															className={styles.right_big_image}
														/>
													</div>
													<div className="p-3">
														<p
															className="my-auto"
															style={{
																color: `${homeComponentUI?.higherSelfSectionCardThreeSubtitleFontColor}`,
															}}
														>
															{sectionFive[2]?.brand?.name}
														</p>
														<Link
															className="fs-24 fw-bold line-clamp-1"
															style={{
																cursor: 'pointer',
																color: `${homeComponentUI?.higherSelfSectionCardThreeTitleFontColor}`,
															}}
															href={`/product-details/${sectionFive[2]?.slug}`}
														>
															{sectionFive[2]?.name}
														</Link>

														{
															(menuTypeValue == 'MEDICAL') ?
																<>
																	{
																		sectionFive[2]?.variants[0]?.specialPriceMed ?
																			(
																				<p className="card-text my-auto">
																					<small className="text-muted">
																						<span className="text-danger fs-16">
																							Now $
																							{
																								sectionFive[2]?.variants[0]
																									?.specialPriceMed
																							}{' '}
																						</span>
																						${sectionFive[2]?.variants[0]?.priceMed}
																					</small>{' '}
																					|{' '}
																					<small className="text-muted">
																						{sectionFive[2]?.variants[0]?.option}
																					</small>
																				</p>
																			) :
																			(
																				<p className="card-text my-auto">
																					<small className="text-muted">
																						<span className="text-danger fs-16">
																							Now $
																							{sectionFive[2]?.variants[0]?.priceMed}
																						</span>
																					</small>{' '}
																					|{' '}
																					<small className="text-muted">
																						{sectionFive[2]?.variants[0]?.option}
																					</small>
																				</p>
																			)
																	}
																</>
																: menuTypeValue == 'RECREATIONAL' ?
																	<>
																		{
																			sectionFive[2]?.variants[0]?.specialPriceRec ?
																				(
																					<p className="card-text my-auto">
																						<small className="text-muted">
																							<span className="text-danger fs-16">
																								Now $
																								{
																									sectionFive[2]?.variants[0]?.specialPriceRec
																								}{' '}
																							</span>
																							${sectionFive[2]?.variants[0]?.priceRec}
																						</small>{' '}
																						|{' '}
																						<small className="text-muted">
																							{sectionFive[2]?.variants[0]?.option}
																						</small>
																					</p>
																				) :
																				(
																					<p className="card-text my-auto">
																						<small className="text-muted">
																							<span className="text-danger fs-16">
																								Now $
																								{sectionFive[2]?.variants[0]?.priceRec}
																							</span>
																						</small>{' '}
																						|{' '}
																						<small className="text-muted">
																							{sectionFive[2]?.variants[0]?.option}
																						</small>
																					</p>
																				)
																		}
																	</> : <></>
														}

														{/* {sectionFive[2]?.variants[0]?.specialPriceRec ? (
                              <p className="card-text my-auto">
                                <small className="text-muted">
                                  <span className="text-danger fs-16">
                                    Now $
                                    {
                                      sectionFive[2]?.variants[0]
                                        ?.specialPriceRec
                                    }{' '}
                                  </span>
                                  ${sectionFive[2]?.variants[0]?.priceRec}
                                </small>{' '}
                                |{' '}
                                <small className="text-muted">
                                  {sectionFive[2]?.variants[0]?.option}
                                </small>
                              </p>
                            ) : (
                              <p className="card-text my-auto">
                                <small className="text-muted">
                                  <span className="text-danger fs-16">
                                    Now ${sectionFive[2]?.variants[0]?.priceRec}
                                  </span>
                                </small>{' '}
                                |{' '}
                                <small className="text-muted">
                                  {sectionFive[2]?.variants[0]?.option}
                                </small>
                              </p>
                            )} */}

														<Link
															href={`/product-details/${sectionFive[2]?.slug}`}
															className="px-5 mt-3 rounded-pill fs-16 fs-md-14 ff-Soleil400 btn btn-outline-dark higherSelfComponentUI"
														>
															Shop now
															<span>
																<FiArrowUpRight className="fs-16 fs-md-12 my-auto fw-bold" />
															</span>
														</Link>
													</div>
												</div>
											</div>
											<div className="col-md-5">
												<div
													className="border border-dark h-100 mt-3 mt-md-0"
													style={{
														backgroundColor: `${homeComponentUI?.higherSelfSectionCardFourBackgroundColor}`,
													}}
												>
													<div>
														<img
															src={sectionFive[3]?.image}
															className={styles.right_second_big_image}
														/>
													</div>
													<div className="p-3">
														<p
															className="my-auto"
															style={{
																color: `${homeComponentUI?.higherSelfSectionCardFourSubtitleFontColor}`,
															}}
														>
															{sectionFive[3]?.brand?.name}
														</p>
														<Link
															className="fs-24 fw-bold line-clamp-1"
															style={{
																cursor: 'pointer',
																color: `${homeComponentUI?.higherSelfSectionCardFourTitleFontColor}`,
															}}
															href={`/product-details/${sectionFive[3]?.slug}`}
														>
															{sectionFive[3]?.name}
														</Link>

														{
															(menuTypeValue == 'MEDICAL') ?
																<>
																	{
																		sectionFive[3]?.variants[0]?.specialPriceMed ?
																			(
																				<p className="card-text my-auto">
																					<small className="text-muted">
																						<span className="text-danger fs-16">
																							Now $
																							{
																								sectionFive[3]?.variants[0]
																									?.specialPriceMed
																							}{' '}
																						</span>
																						${sectionFive[3]?.variants[0]?.priceMed}
																					</small>{' '}
																					|{' '}
																					<small className="text-muted">
																						{sectionFive[3]?.variants[0]?.option}
																					</small>
																				</p>
																			) :
																			(
																				<p className="card-text my-auto">
																					<small className="text-muted">
																						<span className="text-danger fs-16">
																							Now $
																							{sectionFive[3]?.variants[0]?.priceMed}
																						</span>
																					</small>{' '}
																					|{' '}
																					<small className="text-muted">
																						{sectionFive[3]?.variants[0]?.option}
																					</small>
																				</p>
																			)
																	}
																</>
																: menuTypeValue == 'RECREATIONAL' ?
																	<>
																		{
																			sectionFive[3]?.variants[0]?.specialPriceRec ?
																				(
																					<p className="card-text my-auto">
																						<small className="text-muted">
																							<span className="text-danger fs-16">
																								Now $
																								{
																									sectionFive[3]?.variants[0]?.specialPriceRec
																								}{' '}
																							</span>
																							${sectionFive[3]?.variants[0]?.priceRec}
																						</small>{' '}
																						|{' '}
																						<small className="text-muted">
																							{sectionFive[3]?.variants[0]?.option}
																						</small>
																					</p>
																				) :
																				(
																					<p className="card-text my-auto">
																						<small className="text-muted">
																							<span className="text-danger fs-16">
																								Now $
																								{sectionFive[3]?.variants[0]?.priceRec}
																							</span>
																						</small>{' '}
																						|{' '}
																						<small className="text-muted">
																							{sectionFive[3]?.variants[0]?.option}
																						</small>
																					</p>
																				)
																		}
																	</> : <></>
														}

														{/* {sectionFive[3]?.variants[0]?.specialPriceRec ? (
                              <p className="card-text my-auto">
                                <small className="text-muted">
                                  <span className="text-danger fs-16">
                                    Now $
                                    {
                                      sectionFive[3]?.variants[0]
                                        ?.specialPriceRec
                                    }{' '}
                                  </span>
                                  ${sectionFive[3]?.variants[0]?.priceRec}
                                </small>{' '}
                                |{' '}
                                <small className="text-muted">
                                  {sectionFive[3]?.variants[0]?.option}
                                </small>
                              </p>
                            ) : (
                              <p className="card-text my-auto">
                                <small className="text-muted">
                                  <span className="text-danger fs-16">
                                    Now ${sectionFive[3]?.variants[0]?.priceRec}
                                  </span>
                                </small>{' '}
                                |{' '}
                                <small className="text-muted">
                                  {sectionFive[3]?.variants[0]?.option}
                                </small>
                              </p>
                            )} */}

														<Link
															href={`/product-details/${sectionFive[3]?.slug}`}
															className="px-5 mt-3 rounded-pill fs-16 ff-Soleil400 fs-md-12 btn btn-outline-dark higherSelfComponentUI"
														>
															Shop now
															<span>
																<FiArrowUpRight className="fs-16 fs-md-14 my-auto fw-bold" />
															</span>
														</Link>
													</div>
												</div>
											</div>
										</div>
									</section>
								</>
							) : (
								<>
									<section
										className={`container ${styles.customGap}`}
										id="higher-self"
									>
										<div className="row gy-4">
											{!isMobile && (
												<div className="col-12 col-md-5 col-lg-5">
													<div
														className="border border-dark h-100 mb-3 mb-md-0"
														style={{
															backgroundColor: `${homeComponentUI?.higherSelfSectionCardOneBackgroundColor}`,
														}}
													>
														<div>
															<img
																src={homePageSectionFive[0]?.image}
																className={`${styles.firstImage}`}
															/>
														</div>
														<div className="px-3 py-4">
															<h2
																className="fs-24 fw-bold"
																style={{
																	cursor: 'pointer',
																	color: `${homeComponentUI?.higherSelfSectionCardOneTitleFontColor}`,
																}}
															>
																{homePageSectionFive[0]?.title}
															</h2>
															<p
																className="global_line_text_limit"
																style={{
																	color: `${homeComponentUI?.higherSelfSectionCardOneSubtitleFontColor}`,
																}}
															>
																{homePageSectionFive[0]?.description}
															</p>

															<Link
																href={homePageSectionFive[0]?.buttonLink || ''}
																className="px-5 py-1 mt-3 rounded-pill fs-16 fs-md-14 btn btn-outline-dark ff-Soleil400 higherSelfComponentUI"
															>
																{homePageSectionFive[0]?.buttonText}
															</Link>
														</div>
													</div>
												</div>
											)}

											<div className="col-12 col-md-7 d-flex flex-column">
												<div
													style={{
														backgroundColor: `${homeComponentUI?.higherSelfSectionBackgroundColor}`,
													}}
													className={`text-site-white d-flex flex-column justify-content-start border border-2 border-dark mt-3 mt-md-0 ${styles.customHigherSelf}`}
												>
													<h2
														className="w-25 w-md-100 mx-4 fs-60 fs-xs-30 ff-PowerGrotesk700 lh-55 ms-0 ms-md-4 text-center text-md-start"
														style={{
															color: `${homeComponentUI?.higherSelfSectionTitleFontColor}`,
															letterSpacing: '2px',
														}}
													>
														{sectionFiveCms?.title}
													</h2>
													<div className="d-flex flex-column flex-md-row justify-content-between mx-lg-4 mx-md-4">
														<p
															className="text-center mb-0 fs-14 mt-0 mt-md-2 ff-Soleil400"
															style={{
																color: `${homeComponentUI?.higherSelfSectionSubtitleFontColor}`,
															}}
														>
															{sectionFiveCms?.subTitle}
														</p>
														<Link
															className="d-flex justify-content-center"
															style={{
																cursor: 'pointer',
																color: `${homeComponentUI?.higherSelfSectionButtonFontColor}`,
															}}
															href="/shop"
														>
															<p className="d-none d-md-block d-lg-block mb-0 fs-14 ff-Soleil400 mt-2">
																{sectionFiveCms?.buttonText}
															</p>
														</Link>
														<div
															className={`d-md-none text-center ${styles.higherSelf}`}
														>
															<Link
																style={{
																	width: '104px',
																	height: '31px',
																	color: `${homeComponentUI?.higherSelfSectionButtonFontColor}`,
																}}
																href="/shop"
																className="px-3 ff-Soleil700 px-md-5 py-1 border-0 rounded-pill fs-16 fs-md-14 fw-bold"
															>
																{sectionFiveCms?.buttonText}
															</Link>
														</div>
													</div>
												</div>
												<div
													className="border border-dark mt-3 h-100 mb-3 mb-md-0"
													style={{
														backgroundColor: `${homeComponentUI?.higherSelfSectionCardTwoBackgroundColor}`,
													}}
												>
													<div>
														<img
															src={homePageSectionFive[1]?.image}
															className={`${styles.thirdImage}`}
														/>
													</div>
													<div className="p-3">
														<h2
															className="fs-24 fw-bold"
															style={{
																cursor: 'pointer',
																color: `${homeComponentUI?.higherSelfSectionCardTwoTitleFontColor}`,
															}}
														>
															{homePageSectionFive[1]?.title}
														</h2>
														<p
															className="global_line_text_limit"
															style={{
																color: `${homeComponentUI?.higherSelfSectionCardTwoSubtitleFontColor}`,
															}}
														>
															{homePageSectionFive[1]?.description}
														</p>

														<div>
															<Link
																href={homePageSectionFive[1]?.buttonLink || ''}
																className="px-5 py-1 mt-3 rounded-pill fs-16 fs-md-14 btn btn-outline-dark higherSelfComponentUI"
															>
																{homePageSectionFive[1]?.buttonText}
															</Link>
														</div>
													</div>
												</div>
											</div>
											{isMobile && (
												<div className="col-12 col-md-5 col-lg-5">
													<div
														className="border border-dark h-100 mb-3 mb-md-0"
														style={{
															backgroundColor: `${homeComponentUI?.higherSelfSectionCardOneBackgroundColor}`,
														}}
													>
														<div>
															<img
																src={homePageSectionFive[0]?.image}
																className={`${styles.firstImage}`}
															/>
														</div>
														<div className="px-3 py-4">
															<h2
																className="fs-24 fw-bold"
																style={{
																	cursor: 'pointer',
																	color: `${homeComponentUI?.higherSelfSectionCardOneTitleFontColor}`,
																}}
															>
																{homePageSectionFive[0]?.title}
															</h2>
															<p
																className="global_line_text_limit"
																style={{
																	color: `${homeComponentUI?.higherSelfSectionCardOneSubtitleFontColor}`,
																}}
															>
																{homePageSectionFive[0]?.description}
															</p>

															<Link
																href={homePageSectionFive[0]?.buttonLink || ''}
																className="px-5 py-1 mt-3 rounded-pill fs-16 fs-md-14 btn btn-outline-dark ff-Soleil400 higherSelfComponentUI"
															>
																{homePageSectionFive[0]?.buttonText}
															</Link>
														</div>
													</div>
												</div>
											)}
										</div>
									</section>
									<section
										data-aos="fade-left"
										data-aos-delay="200"
										className={`container ${styles.customGap}`}
									>
										<div className="row">
											<div className="col-12 col-md-7 ">
												<div
													className="border border-dark h-100 mb-3 mb-md-0"
													style={{
														backgroundColor: `${homeComponentUI?.higherSelfSectionCardThreeBackgroundColor}`,
													}}
												>
													<div>
														<img
															src={homePageSectionFive[2]?.image}
															style={{
																width: '100%',
																height: '280px',
																objectFit: 'fill',
															}}
														/>
													</div>
													<div className="p-3">
														<h2
															className="fs-24 fw-bold"
															style={{
																cursor: 'pointer',
																color: `${homeComponentUI?.higherSelfSectionCardThreeTitleFontColor}`,
															}}
														>
															{homePageSectionFive[2]?.title}
														</h2>
														<p
															className="global_line_text_limit"
															style={{
																color: `${homeComponentUI?.higherSelfSectionCardThreeSubtitleFontColor}`,
															}}
														>
															{homePageSectionFive[2]?.description}
														</p>

														<Link
															href={homePageSectionFive[2]?.buttonLink || ''}
															className="px-5 py-1 mt-3 rounded-pill fs-16 fs-md-14 btn btn-outline-dark higherSelfComponentUI"
														>
															{homePageSectionFive[2]?.buttonText}
														</Link>
													</div>
												</div>
											</div>
											<div className="col-md-5">
												<div
													className="border border-dark h-100 mt-3 mt-md-0"
													style={{
														backgroundColor: `${homeComponentUI?.higherSelfSectionCardFourBackgroundColor}`,
													}}
												>
													<div>
														<img
															src={homePageSectionFive[3]?.image}
															style={{
																width: '100%',
																height: '280px',
																objectFit: 'fill',
															}}
														/>
													</div>
													<div className="p-3">
														<h2
															className="fs-24 fw-bold"
															style={{
																cursor: 'pointer',
																color: `${homeComponentUI?.higherSelfSectionCardFourTitleFontColor}`,
															}}
														>
															{homePageSectionFive[3]?.title}
														</h2>
														<p
															className="global_line_text_limit"
															style={{
																color: `${homeComponentUI?.higherSelfSectionCardFourSubtitleFontColor}`,
															}}
														>
															{homePageSectionFive[3]?.description}
														</p>

														<Link
															href={homePageSectionFive[3]?.buttonLink || ''}
															className="px-5 py-1 mt-3 rounded-pill fs-16 fs-md-14 btn btn-outline-dark higherSelfComponentUI"
														>
															{homePageSectionFive[3]?.buttonText}
														</Link>
													</div>
												</div>
											</div>
										</div>
									</section>
								</>
							)}
							{/* Banner Ad */}
							{sectionSevenCmsData?.isImageOrColor ? (
								<section className={`container ${styles.customGapBanner}`}>
									<div
										className="d-flex flex-column flex-md-row flex-lg-row justify-content-around py-5 py-md-3 learboardBannerImage"
										style={{
											backgroundImage: `url(${sectionSevenCmsData?.image})`,
											backgroundPosition: 'center center',
											backgroundRepeat: 'no-repeat',
										}}
									>
										<div className="learboardBannerTextImage">
											<div className="text-center text-lg-start text-white">
												<h2
													className="fs-24 fs-md-22 ff-Soleil700"
													style={{ color: '#F1FAFE' }}
												>
													{sectionSevenCmsData?.title}
												</h2>
												<p className="fs-16 ff-Soleil400">
													{sectionSevenCmsData?.subTitle}
												</p>
											</div>
										</div>

										<div className="d-flex align-items-center learboardBannerButtonImage">
											<Link
												href={sectionSevenCmsData?.buttonLink || ''}
												className="mx-auto btn px-5 py-2 border-0 rounded-pill fs-16 fs-md-14 fw-bold"
												style={{ backgroundColor: '#F6E821', color: '#212322' }}
											>
												{sectionSevenCmsData?.buttonText}
											</Link>
										</div>
									</div>
								</section>
							) : (
								<section className={`container ${styles.customGapBanner}`}>
									<div
										className="d-flex flex-column flex-md-row flex-lg-row justify-content-around py-5 py-md-3 learboardBannerColor"
										style={{
											backgroundColor: `${sectionSevenCmsData?.bgColor}`,
										}}
									>
										<div className="learboardBannerTextColor">
											<div className="text-center text-lg-start text-white">
												<h2
													className="fs-24 fs-md-22 ff-Soleil700"
													style={{ color: '#F1FAFE' }}
												>
													{sectionSevenCmsData?.title}
												</h2>
												<p className="fs-16 ff-Soleil400">
													{sectionSevenCmsData?.subTitle}
												</p>
											</div>
										</div>

										<div className="d-flex align-items-center learboardBannerButtonColor">
											<Link
												href={sectionSevenCmsData?.buttonLink || ''}
												className="mx-auto btn px-5 py-2 border-0 rounded-pill fs-16 fs-md-14 fw-bold"
												style={{ backgroundColor: '#F6E821', color: '#212322' }}
											>
												{sectionSevenCmsData?.buttonText}
											</Link>
										</div>
									</div>
								</section>
							)}

							{/* SunnyDaze Start */}
							<section className={styles.customGap} id="sunny-daze">
								<SliderThree homeComponentUI={homeComponentUI} />
							</section>
							{/* Category Start */}
							{categories?.length > 0 ? (
								<section
									className="py-5 bg-site-black"
									style={{
										backgroundColor: `${homeComponentUI?.shopOurInventorySectionBackgroundColor}`,
									}}
									id="shop-our-inventory"
								>
									<div className="container">
										<div className="text-md-end">
											<h2
												className="ff-powerGrotesk700 fs-60 lh-55 lh-sm-35 fs-sm-30 mb-0"
												style={{
													color: `${homeComponentUI?.shopOurInventorySectionTitleFontColor}`,
													letterSpacing: '2px',
												}}
											>
												{sectionNine?.titleOne}
											</h2>
											<h2
												className="ff-powerGrotesk700 fs-60 lh-55 lh-sm-35 fs-sm-30 mb-0"
												style={{
													color: `${homeComponentUI?.shopOurInventorySectionTitleFontColor}`,
													letterSpacing: '2px',
												}}
											>
												{sectionNine?.titleTwo}
											</h2>
											<p
												className="fs-14 ff-Soleil400"
												style={{
													color: `${homeComponentUI?.shopOurInventorySectionSubtitleFontColor}`,
												}}
											>
												{' '}
												{sectionNine?.subTitle}
											</p>
										</div>
										<Slider {...categorySliderSettings}>
											{categories?.length > 0 &&
												categories?.map((fourth_slider, index) => {
													return (
														<div
															className={`slider-item ${styles.category_slider_img}`}
															key={index}
														>
															<Link
																href={`/category/${urlSlug(
																	fourth_slider.categoryName
																)}`}
																className={`card rounded-0 border-0 h-100 mx-2 ${styles.shopInventoryCard}`}
																style={{ cursor: 'pointer' }}
															>
																<div className="w-100 h-100">
																	<img
																		src={fourth_slider.featuredImage}
																		className="w-100 h-100"
																	/>
																</div>
																<div className={styles.shopInventoryCardHover}>
																	<h2 className="fs-40 ff-Soleil700 text-site-white text-center">
																		{toTitleCase(fourth_slider.categoryName)}
																	</h2>
																</div>
															</Link>
														</div>
													);
												})}
										</Slider>
									</div>
								</section>
							) : (
								<></>
							)}
						</div>
					)}
				</>
			) : (
				<>
					<Loader />
					<section>
						<Skeleton style={{ width: '100%', height: '933px' }} />
					</section>
					<section>
						<div>
							<div className="mx-4 mx-md-0 mt-3 mt-md-0">
								<div className="row gy-2">
									<div className="col-12 col-md-3 col-lg-3 d-flex justify-content-center gap-3">
										<Skeleton style={{ width: '390px', height: '58px' }} />
									</div>
									<div className="col-12 col-md-3 col-lg-3 d-flex justify-content-center gap-3">
										<Skeleton style={{ width: '390px', height: '58px' }} />
									</div>
									<div className="col-12 col-md-3 col-lg-3 d-flex justify-content-center gap-3">
										<Skeleton style={{ width: '390px', height: '58px' }} />
									</div>
									<div className="col-12 col-md-3 col-lg-3 d-flex justify-content-center gap-3">
										<Skeleton style={{ width: '390px', height: '58px' }} />
									</div>
								</div>
							</div>
						</div>
					</section>
					<section className="pt-5">
						<div>
							<Skeleton style={{ width: '100%', height: '428px' }} />
						</div>
					</section>

					<section
						data-aos="fade-in"
						data-aos-delay="200"
						className="container mt-3 mt-lg-5"
					>
						<div className="py-2 py-md-4 text-site-white ">
							<Skeleton style={{ width: '100%', height: '200px' }} />
						</div>
					</section>

					<section className="pt-5">
						<div>
							<Skeleton style={{ width: '100%', height: '428px' }} />
						</div>
					</section>
				</>
			)}
		</>
	);
}
