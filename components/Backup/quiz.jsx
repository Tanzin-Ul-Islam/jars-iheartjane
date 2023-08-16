import React, { useState } from 'react'
import styles from '../styles/Faq.module.css';
// import styles from '../styles/Quiz.module.css';
import Banner from '../Banner';
import { useGetQuizPageCmsQuery, useGetFaqPageCmsQuery } from "../../redux/api_core/apiCore";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setQuizInfo } from '../../redux/global_store/globalReducer';
import HeaderTitles from '../HeaderTitles';
const Quiz = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const { data, isSuccess, isFetching, error } = useGetQuizPageCmsQuery();
    let cmsData = data?.data?.cmsData[0];
    let quizData = data?.data?.quizData;

    const commonBanner = useGetFaqPageCmsQuery();
    const { quizInfo, commonBannerCmsData } = useSelector((state) => state.globalStore);

    let [selectedQ, setSelected] = useState([]);

    const handleOption = (e, i, q_id, answer, question) => {
        let option = e.target.value;

        let oldSelectedList = [...selectedQ];

        let value = { id: q_id, selected_option: option, answer, question };

        if (selectedQ.find(data => data.id == q_id)) {
            oldSelectedList.splice(selectedQ.indexOf(value), 1, value);
        } else {
            oldSelectedList.push(value);
        }


        setSelected(oldSelectedList);
    }

    const handleQuizSubmit = (e) => {
        e.preventDefault();
        dispatch(setQuizInfo(selectedQ));
        router.push('/shop');
    }

    return (
        <div>
            <HeaderTitles title={'quizPageTitle'} />
            <div className='container'>
                <section className=''>
                    <Banner commonBannerCmsData={commonBannerCmsData} />
                </section>
                <section className='container'>
                    <div className={styles.heading}>
                        <h1 className='fs-30 fw-bold ff-PowerGrotesk700 text-center'>{cmsData?.title}</h1>
                        <p className='fs-16 fs-md-12 mt-4 mb-5 text-center'>{cmsData?.subTitle}</p>
                    </div>
                </section>
                <div className={`${styles.question_box}`}>
                    <form>
                        <div className={`accordion w-70 w-md-90 w-xs-100 mx-auto ${styles.accordion_button}`} id="accordionExample">
                            {quizData?.map((quiz, index) => (
                                <div className="rounded-1 accordion-item border border-dark bg-site-blue-100 mb-4" key={index}>
                                    <h2 className="accordion-header" id={"headingTwo" + index}>
                                        <button
                                            className={`accordion-button bg-transparent accordion-button shadow-none fs-16 fs-sm-18 ${index === 0 ? '' : 'collapsed'}`}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={'#collapseTwo' + index}
                                            aria-expanded={index === 0 ? 'true' : 'false'}
                                            aria-controls="collapseTwo"
                                        >
                                            {quiz.question}
                                        </button>
                                    </h2>
                                    <div
                                        id={'collapseTwo' + index}
                                        className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                                        aria-labelledby="headingTwo"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body">
                                            <div className="form-check fs-12 mt-2 d-flex align-items-center">
                                                <input
                                                    onChange={(e) => handleOption(e, index, quiz?.id, quiz?.answer, quiz?.question)}
                                                    className="me-1"
                                                    type="radio"
                                                    name={`flexRadioDefault${index}`}
                                                    id={`flexRadioDefaultA${index}`}
                                                    value={quiz.optionA}
                                                />
                                                <label className="form-check-label fs-16" htmlFor={`flexRadioDefaultA${index}`}>
                                                    {quiz.optionA}
                                                </label>
                                            </div>
                                            <div className="form-check fs-12 d-flex align-items-center mt-2">
                                                <input
                                                    onChange={(e) => handleOption(e, index, quiz?.id, quiz?.answer, quiz?.question)}
                                                    className="me-1"
                                                    type="radio"
                                                    name={`flexRadioDefault${index}`}
                                                    id={`flexRadioDefaultB${index}`}
                                                    value={quiz.optionB}
                                                />
                                                <label className="form-check-label fs-16" htmlFor={`flexRadioDefaultB${index}`}>
                                                    {quiz.optionB}
                                                </label>
                                            </div>
                                            <div className="form-check fs-12 d-flex align-items-center mt-2">
                                                <input
                                                    onChange={(e) => handleOption(e, index, quiz?.id, quiz?.answer, quiz?.question)}
                                                    className="me-1"
                                                    type="radio"
                                                    name={`flexRadioDefault${index}`}
                                                    id={`flexRadioDefaultC${index}`}
                                                    value={quiz.optionC}
                                                />
                                                <label className="form-check-label fs-16" htmlFor={`flexRadioDefaultC${index}`}>
                                                    {quiz.optionC}
                                                </label>
                                            </div>
                                            <div className="form-check fs-12 d-flex align-items-center mt-2">
                                                <input
                                                    onChange={(e) => handleOption(e, index, quiz?.id, quiz?.answer, quiz?.question)}
                                                    className="me-1"
                                                    type="radio"
                                                    name={`flexRadioDefault${index}`}
                                                    id={`flexRadioDefaultD${index}`}
                                                    value={quiz.optionD}
                                                />
                                                <label className="form-check-label fs-16" htmlFor={`flexRadioDefaultD${index}`}>
                                                    {quiz.optionD}
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* <div className="rounded-1 accordion-item border border-dark bg-site-blue-100 mb-4">
                                        <h2 className="accordion-header" id="headingTwo">
                                            <button
                                                className="accordion-button shadow-none collapsed bg-transparent text-black"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseThree"
                                                aria-expanded="false"
                                                aria-controls="collapseThree"
                                            > 
                                                Quiz !
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseThree"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingThree"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                <strong>This is the second item's accordion body.</strong> It is hidden by default,
                                                until the collapse plugin adds the appropriate classes that we use to style each
                                                element. These classes control the overall appearance, as well as the showing and
                                                hiding via CSS transitions. You can modify any of this with custom CSS or overriding
                                                our default variables. It's also worth noting that just about any HTML can go within
                                                the <code>.accordion-body</code>, though the transition does limit overflow.
                                            </div>
                                        </div>
                        </div>
                        <div className="rounded-1 accordion-item border border-dark bg-site-blue-100 mb-4">
                                        <h2 className="accordion-header" id="headingTwo">
                                            <button
                                                className="accordion-button shadow-none collapsed bg-transparent text-black"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseFour"
                                                aria-expanded="false"
                                                aria-controls="collapseFour"
                                            > 
                                                Quiz !
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseFour"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingFour"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                <strong>This is the second item's accordion body.</strong> It is hidden by default,
                                                until the collapse plugin adds the appropriate classes that we use to style each
                                                element. These classes control the overall appearance, as well as the showing and
                                                hiding via CSS transitions. You can modify any of this with custom CSS or overriding
                                                our default variables. It's also worth noting that just about any HTML can go within
                                                the <code>.accordion-body</code>, though the transition does limit overflow.
                                            </div>
                                        </div>
                        </div> */}
                        </div>
                        <div className='text-center mb-5 mt-5'>
                            <button type='button' onClick={handleQuizSubmit} className='btn btn-dark'>Shop Your Strain</button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default Quiz