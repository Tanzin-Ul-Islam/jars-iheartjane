import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "../styles/Error.module.css"
import Link from "next/link"
import HomeP from './home'
import Head from "next/head";

export default function NotFound() {
  const router = useRouter();
  const path = router.asPath;
  const { initialPage } = useSelector(state => state.globalStore);

  async function fetchData(extractedDynamicValue) {
    try {
      await fetch(`/api/${extractedDynamicValue}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    // localStorage.setItem("initial-page", initialPage);
    // const selectedPage = localStorage.getItem("initial-page");
    // if (!selectedPage || selectedPage == "false") {
    //   router.push('/age-verification');
    // }
  }, [])

 

  useEffect(() => {
    const extractedDynamicValue = path;

    if (extractedDynamicValue) {
      fetchData(extractedDynamicValue);
    }
  }, [path]);

  return (
   <>
      <Head>
        <>
          <meta name="robots" content="noindex" />
        </>
      </Head>   
      <div className={styles.error_page}>
        <div className="container">
          <div className="d-flex justify-content-center">
            <picture>
              <img src="../../images/err.png" className={styles.errorImage} />
            </picture>
          </div>
          <h1 className="pt-4 fw-bold fs-72 ff-PowerGrotesk700 mb-0 text-site-black text-center">404</h1>
          <p className="ff-Soleil400 mb-0 py-4 text-site-black text-center">Let's get you back on the right path.</p>
          <div className="text-center">
            <Link href="/" className="ff-Soleil400 btn btn-outline-dark px-5 py-2 rounded-pill">Go Home</Link>
          </div>
        </div>
      </div>
   </>
  )
}
