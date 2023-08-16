import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Rating } from 'react-simple-star-rating'
import { AiTwotoneStar, AiOutlineStar, AiFillCloseCircle } from "react-icons/ai";
import { IoIosSend, IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io"
import { useSelector } from 'react-redux';
import { postData } from '../../utils/FetchApi';
import api from '../../config/api.json';
import { createToast } from '../../utils/toast';
import HeaderTitles from '../../components/HeaderTitles';
import Head from 'next/head';
import Loader from '../../components/Loader';
import styles from './css/review.module.css';

const Details = () => {
    const router = useRouter();

    const [input, setInput] = useState({
        productId: '',
        productName: '',
        rating: null,
        name: '',
        likeOrDislikeMsg: '',
        reviewSummary: ''
    });

    const handleChnageInput = (e) => {
        setInput((prevStatus) => ({ ...prevStatus, [e.target.name]: e.target.value }));
    }

    const { selectedRetailer, checkoutId, pageMeta } = useSelector((state) => (state.globalStore));


    const [step, setStep] = useState(0);
    const nextStep = () => {
        setStep(step + 1);
    };
    const previousStep = () => {
        setStep(step - 1);
    };

    const [rating, setRating] = useState(0)
    const handleRating = (rate) => {
        setRating(rate)
        setInput((prevStatus) => ({ ...prevStatus, rating: rate }));
        // other logic
    }
    const onPointerEnter = () => console.log('Enter')
    const onPointerLeave = () => console.log('Leave')
    const onPointerMove = (value, index) => console.log(value, index)

    const [product, setProduct] = useState({});

    async function getProductList() {
        try {
            let data = {
                retailerId: selectedRetailer?.id,
                productId: router?.query?.id
            }
            let response = await postData(api.product.getProductDetails, data);
            if (response?.status == 200) {
                setProduct(response?.data?.product);
                setInput((prevStatus) => ({ ...prevStatus, productId: response?.data?.product?.id, productName: response?.data?.product?.name }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (router.isReady) {
            getProductList();
        }
    }, [router?.query?.id]);

    function validateForm() {
        if (!input.rating) {
            createToast("Please enter rating.", 'info');
            return false;
        }
        else if (!input.name) {
            createToast("Please enter name.", 'info');
            return false;
        }
        return true;
    }

    const handleProductReview = async (e) => {
        try {
            e.preventDefault();
            if (validateForm()) {
                let response = await postData(api.review.productReviewURL, input);
                if (response.data.statusCode == 201) {
                    setInput({
                        productId: '',
                        productName: '',
                        rating: 0,
                        name: '',
                        likeOrDislikeMsg: '',
                        reviewSummary: ''
                    });
                    setRating(0);
                    createToast(response.data.message, 'success');
                    setTimeout(() => {
                        router.push(`/product-details/${product?.slug}`);
                    }, 2000);
                } else {
                    createToast("Something went wrong! Please try again.", 'error');
                }
            }
        } catch (error) {
            createToast("Something went wrong! Please try again.", 'error');
        }
    }
    return (
        <div>
            <HeaderTitles title={'reviewPageTitle'} />
            <Head>
                <meta
                    name="description"
                    content={pageMeta?.reviewPageMetaDescription}
                />
                <meta
                    name="keywords"
                    content={pageMeta?.reviewPageMetaKeyword}
                />
            </Head>
            <div className='text-white'>.</div>
            {product?.image ? 
                <section className='container mt-3'>
                    <div className='row'>
                        <div className='col-12 col-lg-6'>
                            <picture>
                                <img src={product?.image} className={`${styles.customReviewImage}`} />
                            </picture>
                        </div>
                        <div className='col-12 col-lg-6'>
                            <div>
                                <p className='fs-12 my-auto mt-2'>{product?.brand?.name}</p>
                                <h1 className='fs-24 fw-bold'>{product?.name}</h1>
                            </div>
                            <div>
                                {
                                    step === 0 &&
                                    <div>
                                        <p className='text-center my-3 fw-bold'>Select a Rating</p>
                                        <div>
                                            <form>
                                                <div className='text-center mt-4 mb-2'>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label
                                                        className="form-label ff-futuraNormal ff-Soleil700 fs-12">Your Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-transparent shadow-none contact-section-input py-2 px-4 "
                                                        placeholder="" name="name" value={input.name} onChange={handleChnageInput} />
                                                </div>

                                                <div className="my-4">
                                                    <p className='my-auto'>Share your experience. Your input matters and helps shape our
                                                        cannabis community here at JARS.</p>
                                                    <label
                                                        className="form-label ff-futuraNormal ff-Soleil700 fs-12 mt-2">What did you like or dislike? What should shoppers know
                                                        before buying?</label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-transparent shadow-none contact-section-input py-2 px-4 "
                                                        placeholder="" name="likeOrDislikeMsg" value={input.likeOrDislikeMsg} onChange={handleChnageInput} />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleFormControlTextarea1" className="form-label ff-Soleil700 fs-12">How would you summarize your review?
                                                    </label>
                                                    <textarea className="form-control shadow-none border border-dark rounded-3" id="exampleFormControlTextarea1" rows={4} name="reviewSummary" value={input.reviewSummary} onChange={handleChnageInput} ></textarea>

                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                }
                                {step === 1 &&
                                    <div>
                                        <p className='text-center my-3 fw-bold'>Tell us more (Optional)</p>
                                        <div className='mb-3'>
                                            <p className='fs-18 fw-bold'>Flower/ Prerolls (if purchased)</p>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Appearance</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Aroma</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Cure</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Effects</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Flavor</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mb-3'>
                                            <p className='fs-18 fw-bold'>Concentrates/ Vapes (if purchased)</p>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Appearance</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Aroma</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Consistency</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Effects</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Flavor</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mb-3'>
                                            <p className='fs-18 fw-bold'>Edibles/ Capsules / Beverages / Tinctures (if purchased)</p>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Creativity</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Effects</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Flavor</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Presentation</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Texture</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mb-3'>
                                            <p className='fs-18 fw-bold'>Topicals (if purchased)</p>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Effects</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Presentation</p>
                                                </div>
                                            </div>
                                            <div className='d-flex gap-3'>
                                                <div>
                                                    <Rating
                                                        size={26}
                                                        onClick={handleRating}
                                                        onPointerEnter={onPointerEnter}
                                                        onPointerLeave={onPointerLeave}
                                                        onPointerMove={onPointerMove}
                                                    /* Available Props */
                                                    />
                                                </div>
                                                <div>
                                                    <p>Texture</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mb-4'>
                                            <p className='fs-18 fw-bold'>Would you recommend this product?</p>
                                            <div className='d-flex gap-4'>
                                                <div className="form-check">
                                                    <input className="form-check-input shadow-none border border-dark" type="checkbox" value="1" id="flexCheckDefault" />
                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input shadow-none border border-dark" type="checkbox" value="2" id="flexCheckDefault2" />
                                                    <label className="form-check-label" htmlFor="flexCheckDefault2">
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className='text-end'>
                                    {
                                        step === 0 &&
                                        // <button type="button" className="btn btn-dark fs-12 mb-1" onClick={nextStep}><span className='align-middle'>Next </span><IoMdArrowRoundForward/></button>
                                        <button type="button" className="btn btn-dark fs-12" onClick={handleProductReview}><span className='align-middle'>Submit </span><IoIosSend /></button>
                                    }
                                    {
                                        step === 1 &&
                                        <div className='mb-4'>
                                            <button type="button" className="bg-transparent border-0 fw-bold me-3 fs-12" onClick={previousStep}><IoMdArrowRoundBack /><span className='align-middle'> Previous</span></button>
                                            <button type="button" className="btn btn-outline-dark me-2 fs-12"><AiFillCloseCircle className='' /><span className='align-middle'> Cancel</span></button>
                                            <button type="button" className="btn btn-dark fs-12" onClick={() => router.push("/shop")}><span className='align-middle'>Submit </span><IoIosSend /></button>
                                            {/* ignored */}
                                        </div>
                                    }

                                </div>


                            </div>
                            <div>
                                <p className='text-center my-3 fw-bold'></p>
                            </div>
                        </div>

                    </div>
                </section>
                :
                <Loader />
            }
            
        </div>
    )
}

export default Details