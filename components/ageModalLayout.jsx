import React from 'react'
import styles from '../styles/Age.module.css';
import { useGetAgeVerificationCmsQuery } from '../redux/api_core/apiCore';
import Skeleton from 'react-loading-skeleton';

const AgeModalLayout = ({ landingComponentUI, children }) => {

  const { data, isSuccess, isFetching, isLoading, error } = useGetAgeVerificationCmsQuery({});

  return (
    <>
      {
        data?.data?.length > 0 ?
          <div className={styles.modal_container} style={{ backgroundColor: `${landingComponentUI?.pageBackgroundColor}` }}>
            {children}
          </div>
          :
          <div className={styles.modal_container} style={{ backgroundColor: `${landingComponentUI?.pageBackgroundColor}` }}>
            {children}
          </div>
      }
    </>

  )
}

export default AgeModalLayout