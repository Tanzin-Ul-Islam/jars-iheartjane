import React, { useState } from 'react';
import ThreeCard from '../../components/ThreeCard';
import Section from '../../components/Section';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import LearnMoreModal from '../../components/modals/LearnMoreModal';
import Link from 'next/link';

const Benefits = ({ benefitsSection, benefitsContentList, benefitsModal }) => {
  // const benefitCard = [
  //   {
  //     img: `${benefitsSection?.imageOne}`,
  //     title: `${benefitsSection?.titleOne}`,
  //     desc: `${benefitsSection?.descriptionOne}`,
  //     btnText: `${benefitsSection?.buttonOneText}`,
  //     btnLink: `${benefitsSection?.buttonOneLink}`,
  //   },
  //   {
  //     img: `${benefitsSection?.imageTwo}`,
  //     title: `${benefitsSection?.titleTwo}`,
  //     desc: `${benefitsSection?.descriptionTwo}`,
  //     btnText: `${benefitsSection?.buttonTwoText}`,
  //     btnLink: `${benefitsSection?.buttonTwoLink}`,
  //   },
  //   {
  //     img: `${benefitsSection?.imageThree}`,
  //     title: `${benefitsSection?.titleThree}`,
  //     desc: `${benefitsSection?.descriptionThree}`,
  //     btnText: `${benefitsSection?.buttonThreeText}`,
  //     btnLink: `${benefitsSection?.buttonThreeLink}`,
  //   },
  // ];
  const [learMoreContentList, setLearMoreContentList] = useState([]);
  async function getLearnMoreContent(data) {
    setLearMoreContentList(data);
  }

  return (
    <section>
      <div className="container">
        <Section title={benefitsSection?.title}>
          {benefitsSection?.subTitle}
        </Section>

        <div className="row pb-5 text-center">
          {/* <ThreeCard data={benefitsContentList} learnMore={true} /> */}
          <div className="container">
            <div className="row py-md-5 text-center">
              {benefitsContentList?.map((card, i) => (
                <div key={i} className="col-md-4 px-4">
                  <div className="row">
                    <img src={card?.image} width={280} height={280} alt="" />
                    <div className="mt-3">
                      <h5 className="fw-bold ff-Soleil700">{card?.title}</h5>
                      <p className='ff-Soleil400'>{card?.description}</p>
                      {
                        (card?.benefitsContentLearnMore?.length > 0) ?
                          <Link href={'javascript:void(0)'} onClick={() => { getLearnMoreContent(card?.benefitsContentLearnMore) }} className="text-black ff-Soleil400 text-decoration-underline" style={{ textDecoration: 'underline !important' }} data-bs-toggle="modal" data-bs-target={"#learnMoreModal"}>
                            {card?.buttonText}
                          </Link>
                          :
                          <Link href={'javascript:void(0)'} className="text-black ff-Soleil400 text-decoration-underline" style={{ textDecoration: 'underline !important' }}>
                            {card?.buttonText}
                          </Link>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <LearnMoreModal learMoreContentList={learMoreContentList} />
          </div>
          {
            benefitsSection?.sectionButtonLink && benefitsSection?.sectionButtonLink != null && benefitsSection?.sectionButtonLink != "" ?
            <Link href={benefitsSection?.sectionButtonLink || ""}>
              <Button cls="rounded-pill">
                { benefitsSection?.sectionButtonText }
              </Button>
            </Link>
            :
            <span
              className="w-auto mx-auto mt-3"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <Button cls="rounded-pill">
                { benefitsSection?.sectionButtonText }
              </Button>
            </span>
          }
        </div>
        <div className="my-4" style={{ border: '1.5px solid #212322' }} />
      </div>

      <Modal benefitsModal={benefitsModal} />
    </section>
  );
};

export default Benefits;
