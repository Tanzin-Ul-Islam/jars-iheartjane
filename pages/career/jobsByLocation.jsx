import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import Button from '../../components/Button';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { useRouter } from 'next/router';

const JobsByLocation = () => {
  const { allFormatedRetailer } = useSelector((store) => (store.globalStore));
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(true);

  function handleChangeRoute(data) {
    router.push('/career?store=' + data?.name);
  }


  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false)
    }, 1000);
  }, []);

  return (
    <>
      {showLoader ? <Loader /> : <></>}
      <div className="container py-2">
        <Nav />
        <div className="row">
          {allFormatedRetailer.map((el, index) => (
            <div
              key={index}
              className="col-sm-6 col-lg-4 d-flex flex-column px-4 py-3"
            >
              {/* <Button cls="py-3" onClick={() => { handleChangeRoute(el) }}>{el.name}</Button> */}
              <button className={`py-3 bg-black text-white px-5 py-2 btn ff-Soleil700`} onClick={() => { handleChangeRoute(el) }}>
                {el.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default JobsByLocation;

const buttonsData = [
  { id: 1, title: 'Ann Arbor' },
  { id: 2, title: 'Battle Creek' },
  { id: 3, title: 'Center Line' },
  { id: 4, title: 'Corporate' },
  { id: 5, title: 'East Detroit' },
  { id: 6, title: 'Grands Rapid' },
  { id: 7, title: 'Green Culture' },
  { id: 8, title: 'Lansing' },
  { id: 9, title: 'Monroe' },
  { id: 10, title: 'Mt. Clemens' },
  { id: 11, title: 'Mt. Morris' },
  { id: 12, title: 'Mt. Pleasant' },
  { id: 13, title: 'Muskegon' },
  { id: 14, title: 'Owosso' },
  { id: 15, title: 'Oxford' },
  { id: 16, title: 'River Rouge' },
  { id: 17, title: 'Saugatuck' },
  { id: 18, title: 'West Detroit' },
];
