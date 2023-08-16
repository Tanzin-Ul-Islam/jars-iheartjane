import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import HomeP from './home';
import { setSiteLoader } from "../redux/global_store/globalReducer";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { initialPage } = useSelector(state => state.globalStore);

  // useEffect(() => {
  //   // localStorage.setItem("initial-page", initialPage);
  //   const selectedPage = localStorage.getItem("initial-page");
  //   if (!selectedPage || selectedPage == "false") {
  //     router.push('/age-verification');
  //   }
  // }, [])

  return (
    // <>
    //   {
    //     initialPage && <HomeP />
    //   }
    // </>
    <HomeP />
  )
}
