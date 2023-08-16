import React, { useEffect } from 'react'
import HomePage from "../components/homePage";
import { setSiteLoader } from "../redux/global_store/globalReducer";
import { useDispatch } from "react-redux";
import Header from '../components/commonLayout/header';
import Loader from '../components/Loader';

const HomeP = () => {
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setSiteLoader(false));
    }, [dispatch])

    return (
        <>
            {/* <Loader/> */}
            <Header />
            <HomePage />
        </>
    )
}

export default HomeP