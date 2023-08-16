import React from 'react'
import { InfinitySpin } from 'react-loader-spinner'
import styles from '../../styles/App.module.css'
import { useSelector, useDispatch } from 'react-redux';

const SiteLoader = () => {

  let { siteLoader } = useSelector(store => (store.globalStore));

  return (
    <>
      {siteLoader && <div className={styles.infinitySpin}>
        <div style={{ marginLeft: '70px' }}>
          <InfinitySpin
            width="300"
            color="#212529"
            wrapperStyle={{ minWidth: '100vw', minHeight: '100vh' }}
            visible={false}
          />
        </div>
      </div>
      }
    </>
  )
}

export default SiteLoader;