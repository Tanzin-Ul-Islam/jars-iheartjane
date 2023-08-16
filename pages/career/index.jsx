import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCareerContentQuery, useGetCareerListMutation } from '../../redux/api_core/apiCore';
import { setSiteLoader } from '../../redux/global_store/globalReducer';
import HeaderTitles from '../../components/HeaderTitles';
import Skeleton from 'react-loading-skeleton';
import Head from 'next/head';
import Link from 'next/link';
import Loader from '../../components/Loader';
import Hero from '../../components/Hero';
import Section from '../../components/Section';
import Nav from './Nav';
import JobList from './JobList';
import useDidMountEffect from '../../custom-hook/useDidMount';
import { IoMdArrowDropdown } from 'react-icons/io';
import Input, { Select } from '../../components/Input';
import Button from '../../components/Button';
import statesList from "../../utils/stateList";
import {
  FaFacebook,
  FaGlobeAsia,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaRegThumbsUp,
  FaTwitter,
} from 'react-icons/fa';
import { FacebookShareButton, LinkedinShareButton, PinterestShareButton, TwitterShareButton } from 'react-share';
export default function Career() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [getCareerData] = useGetCareerListMutation();
  const [activeLoader, setActiveLoader] = useState(true);
  const [careerList, setCareerList] = useState([]);
  const [duplicateCareerList, setDuplicateCareerList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  let { data, isLoading, isFetching } = useGetCareerContentQuery();
  let { siteLoader, pageMeta, allFormatedRetailer, careerComponentUI } = useSelector((store) => store.globalStore);
  const statesListData = statesList;
  const jobTypeList = ['Full TIme', 'Part Time', 'Contractual'];
  const sortByList = ['Job Title', 'End Date', 'City', 'Employment Type'];

  const [open, setOpen] = useState(false);
  let departments =
    data?.data?.careerDepartmentData?.length > 0
      ? data.data.careerDepartmentData
      : [];
  let cms = data?.data?.cmsData?.length > 0 ? data?.data?.cmsData[0] : {};


  let [filterData, setFilterData] = useState({
    city: "",
    state: "",
    jobType: "",
    sortBy: "Job Title",
    store: "",
  });
  const [searchKey, setSearchKey] = useState("");

  function handleSearch() {
    let newArr = [...careerList];
    let searchVal = searchKey.toUpperCase();
    let filteredArr = [];
    newArr.forEach((el) => {
      let careerName = el?.title?.toUpperCase();
      if (careerName.includes(searchVal)) {
        filteredArr.push(el);
      }
    });
    setDuplicateCareerList(filteredArr);
  }

  async function getCareerList(param) {
    try {
      await getCareerData(param).then((response) => {
        setCareerList(response.data.data);
        setDuplicateCareerList(response.data.data);
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleInputChange(e) {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
  }

  function handleSubmitForm(e) {
    e.preventDefault();
    applyFilter();
    setOpen(false);
  }

  async function applyFilter() {
    let param = '?sortBy=' + filterData.sortBy;
    if (filterData.city) {
      param += '&city=' + filterData.city;
    }
    if (filterData.state) {
      param += '&state=' + filterData.state;
    }
    if (filterData.jobType) {
      param += '&jobType=' + filterData.jobType;
    }
    if (filterData.store) {
      param += '&store=' + filterData.store;
    }
    await getCareerList(param);
  }

  let currentPageURL = '';

  if (typeof window !== 'undefined') {
    currentPageURL = location.href;
    // currentPageURL = 'https://jars.1space.co/article/7-strains-to-elevate-your-outdoor-adventures';
  }

  function handleScroll() {
    const section = document.getElementById('job-section');

    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  useEffect(() => {
    if (router.isReady) {
      if (router.query.store) {
        setFilterData({ ...filterData, store: router.query.store });
      } else {
        applyFilter();
      }
    }

  }, [router.query]);

  useDidMountEffect(() => {
    if (filterData.store) {
      applyFilter();
      setFilterData({ ...filterData, store: "" });
    }
  }, [filterData.store]);

  useEffect(() => {
    let tempStateList = []
    tempStateList = allFormatedRetailer.map((el) => {
      const tempstate = statesListData.filter(state => (state.code == el.addressObject.state));
      return tempstate[0];
    });
    setStateList([...new Set(tempStateList)]);

    //city list
    let tempCityList = []
    tempCityList = allFormatedRetailer.map((el) => {
      return el.addressObject.city;
    });
    setCityList([...new Set(tempCityList)]);

  }, [allFormatedRetailer])

  useDidMountEffect(() => {
    handleSearch()
  }, [searchKey]);

  return (
    <div style={{backgroundColor:careerComponentUI?.backgroundColor}}>
      <Hero
        bg={cms?.heroSectionBgImage}
        title1={cms?.heroSectionTitleOne}
        title2={cms?.heroSectionTitleTwo}
        btnBg="#C4C4D9"
        btnText={cms?.heroSectionBtnText}
        handleScroll={handleScroll}
        uiData={careerComponentUI}
        page="career"
      >
        {cms?.heroSectionDescription}
      </Hero>
      <div style={{backgroundColor:careerComponentUI?.backgroundColor}}>
        <Section title={cms?.sectionTwoTitle}>
          {cms?.sectionTwoSubTitle}
        </Section>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              {/* <h4 className="fw-bold ff-Soleil700">{data?.sectionTwoContentOne}</h4> */}
              <p
                className="h5Plus ff-Soleil400 fs-14"
                dangerouslySetInnerHTML={{ __html: cms?.sectionTwoContentOne }}
              ></p>
            </div>
            <div className="col-lg-6">
              {/* <h4 className="fw-bold ff-Soleil700">{data?.sectionTwoContentTwo}</h4> */}
              <p
                className="h5Plus ff-Soleil400 fs-14"
                dangerouslySetInnerHTML={{ __html: cms?.sectionTwoContentTwo }}
              ></p>
            </div>
          </div>
          <h4 className="w-75 mx-auto text-center py-5 ff-Soleil400">
            {cms?.sectionTwoEndContent}
          </h4>
        </div>
      </div>
      <div className="container" id="job-section">
        <div className='d-flex justify-content-center mb-5'>
          <Link href={'https://jarscannabis.isolvedhire.com/jobs/'} target='_blank' className='btn btn-outline-dark rounded-pill'>Checkout Our Available Jobs</Link>
        </div>
        {/* <Nav /> */}
        {/* <div className=" d-flex justify-content-between align-items-center p-3 mt-5 rounded-2 nav-border _linear-bg ff-Soleil400">
          {router.pathname === '/career' ? (
            <div className="d-flex align-items-center">
              <a
                onClick={() => setOpen(!open)}
                className="d-flex align-items-center m-0 mx-3 cp"
              >
                Filter <IoMdArrowDropdown className="ms-3" />
              </a>
              <div className="tooltip-container">
                {open && (
                  <div className="tooltips">
                    <div className="tool">
                      <p>Looking for something more specific?</p>
                      <form onSubmit={handleSubmitForm}>
                        <div className="d-flex gap-4">
                          <div className="d-flex flex-column w-50">
                            <label htmlFor="name" className="fw-bold">
                              City
                            </label>
                            <select name="city" value={filterData.city} onChange={handleInputChange} id="" className={`px-3 my-auto p-2 rounded-2`}>
                              <option value="" selected style={{ display: 'none' }}>
                                Select City
                              </option>
                              {cityList.map((option, i) => (
                                <option key={i} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="d-flex flex-column w-50">
                            <label htmlFor="name" className="fw-bold">
                              State/Province
                            </label>
                            <select name="state" value={filterData.state} onChange={handleInputChange} className={`px-3 my-auto p-2 rounded-2`}>
                              <option value="" selected style={{ display: 'none' }}>
                                Select Sate
                              </option>
                              {stateList.map((option, i) => (
                                <option key={i} value={option.name}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="d-flex flex-column gap-2 w-50 pe-3">
                          <label htmlFor="name" className="fw-bold mt-2">
                            Employment Type
                          </label>
                          <select name="jobType" value={filterData.jobType} onChange={handleInputChange} className={`px-3 my-auto p-2 rounded-2`}>
                            <option value="" selected style={{ display: 'none' }}>
                              Select Employment Type
                            </option>
                            {jobTypeList.map((option, i) => (
                              <option key={i} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <label htmlFor="name" className="fw-bold mt-2">
                            Sort By
                          </label>
                          <select name="sortBy" value={filterData.sortBy} onChange={handleInputChange} className={`px-3 my-auto p-2 rounded-2`}>
                            <option value="" selected style={{ display: 'none' }}>
                              Select Sort By
                            </option>
                            {sortByList.map((option, i) => (
                              <option key={i} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="text-center">
                          <Button cls="w-75 mt-3">Search</Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Search Jobs"
                className="p-2 rounded-2 border-0 w-100 career-input"
                onChange={(e) => { setSearchKey(e.target.value) }}
              />
            </div>
          ) : singleJob ? (
            <h4 className="">Job Title</h4>
          ) : (
            <h4 className="">Jobs by Location</h4>
          )}

          <div className="mx-auto mx-sm-0 mt-3 mt-sm-0">
            <Link
              href={'/career'}
              className="text-dark px-3 text-decoration-none link"
              style={{ borderRight: '2px dashed #333' }}
            >
              Career
            </Link>
            <Link
              href={'/login'}
              className="text-dark px-3 text-decoration-none link"
              style={{ borderRight: '2px dashed #333' }}
            >
              Login
            </Link>
          </div>
        </div> */}
        {/* <JobList /> */}
        {/* <div className="row mt-2 pb-5">
          <div className="col-md-8">
            <h4 className="pt-4 fw-bold ff-Soleil700">
              Current Job Listing {duplicateCareerList?.length} Total Jobs
            </h4>
            <p className="py-3 m-0 border-2 border-bottom border-dark ff-Soleil400">
              Below is a List of the Current openings with out company. Click on the
              job title to learn more about the opening
            </p>
            {duplicateCareerList.map((el, i) => (
              <Link href={"/career/" + el?.id} key={i}>
                <div className="border-2 border-dark border-bottom pt-3">
                  <h5 className="fw-bold ff-Soleil700">{el.title}</h5>
                  <p className="ff-Soleil400">{el.location}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="col-md-4 mt-5">
            <div className="border border-dark rounded-2">
              <h6 className="fw-bold px-2 py-1 ff-Soleil700">Resources</h6>
              <Link href="/career/jobsByLocation">
                <p className="m-0 p-2 border border-dark rounded-2 _linear-bg ff-Soleil400">
                  &gt; Jobs by Location
                </p>
              </Link>
            </div>
            <div className="border border-dark rounded-2 mt-4">
              <h6 className="fw-bold px-2 py-1 ff-Soleil700">
                Share This Page
              </h6>
              <div className="d-flex gap-3 p-2 border border-dark rounded-2 _linear-bg ">

                <FacebookShareButton url={currentPageURL} quote="Please share this page" hashtag="#code">
                  <div className='cp'>
                    <FaFacebook className="fs-4" />
                  </div>
                </FacebookShareButton>
                <TwitterShareButton url={currentPageURL} quote="Please share this article" hashtag="#code">
                  <div className='cp'>
                    <FaTwitter className="fs-4" />
                  </div>
                </TwitterShareButton>
                <LinkedinShareButton url={currentPageURL} quote="Please share this article" hashtag="#code">
                  <div className='cp'>
                    <FaLinkedin className="fs-4" />
                  </div>
                </LinkedinShareButton>
                <PinterestShareButton url={currentPageURL} quote="Please share this article" hashtag="#code" media={currentPageURL} >
                  <div className='cp'>
                    <FaPinterest className="fs-4" />
                  </div>
                </PinterestShareButton>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

const careerData = [
  {
    title: 'Your future at JARS',
    desc: `JARS Cannabis is more than just your average cannabis brand and retailer. We are a culturally inspired organization on a mission to rewrite the existing narratives that surround cannabis, one community at a time. We seek to empower the future leaders of our industry while creating an inclusive workplace environment that is fueled by celebrating the intersection of cannabis with creativity, community, and collaboration.Implementing a progressive approach, we aim to provide only the highest quality of product and service to our customers and the communities that we are fortunate to inhabit. Striving to set a new standard of professional excellence in cannabis retail, our highly motivated team is comprised of knowledgeable experts who are committed to making the integration of cannabis into any lifestyleboth easy and accessible.`,
  },
  {
    title: 'JARS University',
    desc: 'At JARS Cannabis, we believe in the power of education to shape customer experiences. Thats why we developed JARS University, a groundbreaking training program that prepares our budtenders to confidently navigate the evolving landscape of product knowledge and customer preferences. Located in Ann Arbor, MI, our state-of-the-art JARS Campus training facility serves as a mock JARS store where budtenders gain practical skills and expertise from certified industry professionals during a three-day course. By implementing a ‘full spectrum’ training approach, our program’s curriculum empowers JARS budtenders to become trusted experts who provide professional guidance and exceptional customer service. Together, we are redefining the cannabis retail experience, one educated budtender and satisfied customer at a time. Check out our open budtender positions to start your higher education journey with JARS today.',
  },
];

const jobList = [
  {
    title: 'Delivery Dispatcher',
    location: 'Troy. MI, USA | Full Time',
  },
  {
    title: 'Delivery Driver / Curbside Specialist',
    location: 'Troy. MI, USA | Full Time',
  },
  {
    title: 'General Manager',
    location: 'Troy. MI, USA | Full Time',
  },
  {
    title: 'Inventory Lead',
    location: 'Troy. MI, USA | Full Time',
  },
  {
    title: 'Inventory Lead',
    location: 'Troy. MI, USA | Full Time',
  },
];

const links = [
  {
    name: 'Jobs',
    url: '/jobs',
  },
  {
    name: 'Login',
    url: '/login',
  },
];
const options = ['Home', 'Cell', 'Work'];

