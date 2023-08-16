import Link from 'next/link';
import React, { useState } from 'react';
import api from "../config/api.json";
import { fetchData } from '../utils/FetchApi';
import LearnMoreModal from './modals/LearnMoreModal';
const ThreeCard = ({ data, learnMore }) => {
  // console.log('data', data)
  // const [learMoreContentList, setLearMoreContentList] = useState([]);
  // async function getLearnMoreContent(data) {
  //   setLearMoreContentList(data);
  // }
  return (
    <div className="container">
      <div className="row py-md-5 text-center">
        {data?.map((card, i) => (
          <div key={i} className="col-md-4 px-4">
            <div className="row">
              <img src={card?.img} width={280} height={280} alt="" />
              <div className="mt-3">
                <h5 className="fw-bold ff-Soleil700">{card?.title}</h5>
                <p className='ff-Soleil400'>{card?.desc}</p>
                {
                  <>
                    <Link href={'javascript:void(0)'} className="text-black ff-Soleil400 text-decoration-underline" style={{ textDecoration: 'underline !important' }}>
                      {card?.buttonText}
                    </Link>
                  </>
                }

              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <LearnMoreModal learMoreContentList={learMoreContentList} /> */}
    </div>
  );
};

export default ThreeCard;
