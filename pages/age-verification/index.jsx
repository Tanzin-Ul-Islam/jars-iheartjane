import React, { useEffect } from 'react'
import AgeVerification from '../ageVerification'
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import HeaderTitles from '../../components/HeaderTitles';

const AgeVerify = () => {
    const router = useRouter();
    const { initialPage } = useSelector(state => state.globalStore);
    useEffect(() => {
        const selectedPage = localStorage.getItem("initial-page");
        if (selectedPage) {
            router.push('/');
        }
    }, []);

    return (
        <>
        <HeaderTitles title={'ageVerificationPageTitle'}/>
            {
                !initialPage && <AgeVerification />
            }
        </>
    )
}

export default AgeVerify