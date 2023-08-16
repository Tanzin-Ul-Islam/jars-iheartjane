import styles from './css/chooseLocation.module.css'
import { useRouter } from "next/router";
import { useGetLandingPageCmsQuery } from '../../redux/api_core/apiCore';

export default function DeliveryPage(){
    const router = useRouter()

    const { data, isSuccess, isFetching, error } = useGetLandingPageCmsQuery();


    return(
        <div className={styles.chooseLocationPage}>
            <div className="row m-0">
                <div className="col-12 col-md-7 col-lg-5 p-0">
                    <div className="bg-white py-5  d-flex flex-column justify-content-between">
                        <div className="text-center mb-5">
                            <picture>
                                <img src={data?.data[0].logo} alt='' height='73' width='73' />
                            </picture>
                        </div>
                        <div className="text-center px-4 mb-5">
                            <h1 className="fs-40 ff-powerGrotesk500">{data?.data[0].title}</h1>
                            <p>{data?.data[0].description}</p>
                        </div>
                        <hr/>
                        <div className="p-4 text-center">
                            <h2 className="fs-20 ff-powerGrotesk600 mb-4">{data?.data[0].deliveryPageTitle}</h2>
                            <div className={`d-flex justify-content-center ${styles.locationBox}`}>
                                <div className="text-start w-70">
                                    <div className="mb-4">
                                        {/* <input type="search" className="form-control shadow-none bg-white py-2" placeholder={data?.data[0].searchBoxText} /> */}
                                        <form>
                                            <div className="input-group">
                                                <input type="search" className="form-control shadow-none border border-dark" placeholder="Search here..."
                                                    aria-label="Search here" aria-describedby="Search-addon2" />
                                                <button className="btn btn-dark" type="submit"
                                                    id="Search-addon2">
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    <ul className="list-unstyled">
                                        <li className="mb-4">
                                            <div>
                                                <h3>
                                                    Boca Raton
                                                </h3>
                                                <p>9912 Glades Rd<br/>
                                                    Boca Raton, FL, 33434<br/>
                                                    Today’s Hours: 9:00 AM – 8:30 PM</p>
                                                <p>(561) 939-6655</p>
                                                <button onClick={()=>router.push('/home')}  className={`btn px-4 ${styles.chooseLocationPageBtn} w-100`}>
                                                    {data?.data[0].chooseStoreButtonText}</button>
                                            </div>
                                        </li>
                                        <li className="mb-4">
                                            <div>
                                                <h3>
                                                    Boca Raton
                                                </h3>
                                                <p>9912 Glades Rd<br/>
                                                    Boca Raton, FL, 33434<br/>
                                                    Today’s Hours: 9:00 AM – 8:30 PM</p>
                                                <p>(561) 939-6655</p>
                                                <button onClick={()=>router.push('/home')} className={`btn px-4 ${styles.chooseLocationPageBtn} w-100`}>
                                                    {data?.data[0].chooseStoreButtonText}</button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                        <hr/>
                    </div>
                </div>
                <div className="col-12 col-md-5 col-lg-7 p-0">
                    <div className={`bg-site-Red ${styles.chooseLocationPageRightSide}`} style={{ backgroundImage: `url(${data?.data[0].image})`, }}></div>
                </div>
            </div>
        </div>
    )
}
