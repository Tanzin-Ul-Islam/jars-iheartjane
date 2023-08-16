import React from 'react'
import styles from '../styles/Events.module.css'
import HeaderTitles from '../HeaderTitles'
const Community_programs = () => {
  return (
    <div>
      <HeaderTitles title={'communityProgramsPageTitle'} />
      <section className={`position-relative ${styles.banner_bg}`}>
        <div className='text-center position-absolute top-50 start-50 translate-middle'>
          <h1 className={`ff-Soleil700 lh-75 lh-sm-50 ${styles.main_text_banner}`}>Community Programs</h1>
          <div className='d-flex justify-content-center gap-4'>
            <p className={`ff-Soleil400 text-white my-auto ${styles.banner_sub}`}>Cannabis Dispensaries located in California & Oregon</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Community_programs