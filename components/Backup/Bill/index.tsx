import React from 'react'
import billInfo from '../../../cms-data/billCms'
import Banner from '../../Banner'

function Bill() {
    return (
        <div>
            {/* <section>
                <Banner />
            </section> */}
            <section className='container mb-5'>
                <div className='row'>
                    <div className='col-12 col-lg-7'>
                        <div className='test container'>
                            <ul className="mt-4 nav nav-tabs mb-3 text-black" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="test nav-link border-0 active me-3" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">{billInfo.toggle_button_one}</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="test nav-link border-0" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">{billInfo.toggle_button_two}</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className=''>

                                        <div className='mt-5'>
                                            <h1 className='fs-30'>{billInfo.bill_main_text}</h1>
                                        </div>
                                        <div className='mt-4'>
                                            <form className="row g-3">
                                                <div className="col-md-6">
                                                    <label htmlFor="inputEmail4" className="form-label fs-12">{billInfo.form_data_billing.first_name}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none border border-2 border-dark shadow-none" id="inputEmail4" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="inputEmail4" className="form-label fs-12">{billInfo.form_data_billing.last_name}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none" id="inputEmail4" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputState" className="form-label fs-12">{billInfo.form_data_billing.region_1}</label>
                                                    <select id="inputState" className="form-select border border-2 border-dark shadow-none">
                                                        <option selected>Choose...</option>
                                                        <option>...</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputState" className="form-label fs-12">{billInfo.form_data_billing.region_2}</label>
                                                    <select id="inputState" className="form-select border border-2 border-dark shadow-none">
                                                        <option selected>Choose...</option>
                                                        <option>...</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputAddress" className="form-label fs-12">{billInfo.form_data_billing.street}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none" id="inputAddress" placeholder="1234 Main St" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputAddress2" className="form-label fs-12">{billInfo.form_data_billing.apartment}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputAddress" className="form-label fs-12">{billInfo.form_data_billing.town}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none" id="inputAddress" placeholder="1234 Main St" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputAddress2" className="form-label fs-12">{billInfo.form_data_billing.postal}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputPassword4" className="form-label fs-12">{billInfo.form_data_billing.phone}</label>
                                                    <input type="number" className="form-control border border-2 border-dark shadow-none" id="inputNumber4" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputEmail4" className="form-label fs-12">{billInfo.form_data_billing.email}</label>
                                                    <input type="email" className="form-control border border-2 border-dark shadow-none" id="inputEmail4" />
                                                </div>
                                                {/* <div className="col-12">
                                            <button type="submit" className="btn btn-primary">Sign in</button>
                                        </div> */}
                                                <div className="col-md-12 mt-4">
                                                    <label htmlFor="inputEmail4" className="form-label fs-12">{billInfo.form_data_billing.additional_text}</label>
                                                    <textarea className="form-control border border-2 border-dark shadow-none" id="inputEmail4" rows={5} />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                    <div className=''>
                                        <div className="mt-5 form-check">
                                            <input className="form-check-input shadow-none border border-dark" type="checkbox" value="" id="flexCheckDefault" />
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Same as Bill Address
                                            </label>
                                        </div>
                                        <div className='mt-4'>
                                            <h1 className='fs-30'>{billInfo.ship_main_text}</h1>
                                        </div>
                                        <div className='mt-4'>
                                            <form className="row g-3">
                                                <div className="col-md-6">
                                                    <label htmlFor="inputEmail4" className="form-label fs-12">{billInfo.form_data_shipping.first_name}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none border border-2 border-dark shadow-none" id="inputEmail4" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="inputEmail4" className="form-label fs-12">{billInfo.form_data_shipping.last_name}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none" id="inputEmail4" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputState" className="form-label fs-12">{billInfo.form_data_shipping.region_1}</label>
                                                    <select id="inputState" className="form-select border border-2 border-dark shadow-none">
                                                        <option selected>Choose...</option>
                                                        <option>...</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputState" className="form-label fs-12">{billInfo.form_data_shipping.region_2}</label>
                                                    <select id="inputState" className="form-select border border-2 border-dark shadow-none">
                                                        <option selected>Choose...</option>
                                                        <option>...</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputAddress" className="form-label fs-12">{billInfo.form_data_shipping.street}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none" id="inputAddress" placeholder="1234 Main St" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputAddress2" className="form-label fs-12">{billInfo.form_data_shipping.apartment}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputAddress" className="form-label fs-12">{billInfo.form_data_shipping.town}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none" id="inputAddress" placeholder="1234 Main St" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputAddress2" className="form-label fs-12">{billInfo.form_data_shipping.postal}</label>
                                                    <input type="text" className="form-control border border-2 border-dark shadow-none" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputPassword4" className="form-label fs-12">{billInfo.form_data_shipping.phone}</label>
                                                    <input type="number" className="form-control border border-2 border-dark shadow-none" id="inputNumber4" />
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label htmlFor="inputEmail4" className="form-label fs-12">{billInfo.form_data_shipping.email}</label>
                                                    <input type="email" className="form-control border border-2 border-dark shadow-none" id="inputEmail4" />
                                                </div>
                                                {/* <div className="col-12">
                                            <button type="submit" className="btn btn-primary">Sign in</button>
                                        </div> */}
                                                <div className="col-md-12 mt-4">
                                                    <label htmlFor="inputEmail4" className="form-label fs-12">{billInfo.form_data_shipping.additional_text}</label>
                                                    <textarea className="form-control border border-2 border-dark shadow-none" id="inputEmail4" rows={5} />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-lg-5'>
                        <div className='container'>
                            <div className='mt-5'>
                                <h1 className='fs-25'>{billInfo.order_main_text}</h1>
                            </div>
                            <div className='d-flex justify-content-between fs-16 text-site-gray-500 mt-4'>
                                <p>{billInfo.product_headline}</p>
                                <p>{billInfo.subtotal_headline}</p>
                            </div>
                            <div className='d-flex justify-content-between fs-16'>
                                <p className='w-50 my-auto'>{billInfo.product_name} × {billInfo.product_quantity}</p>
                                <p className='my-auto'>${billInfo.product_subtotal_price}</p>
                            </div>
                            <hr className='my-4' />
                            <div className='bg-site-gray-300 p-3'>
                                <div className='d-flex justify-content-between fs-25'>
                                    <p className=''>{billInfo.subtotal_headline}:</p>
                                    <p className=''>${billInfo.product_subtotal_price}</p>
                                </div>
                                <div className='d-flex justify-content-between mt-4'>
                                    <p className='fs-25'>{billInfo.shipping_headline}</p>
                                    <div>
                                        <div className="form-check">
                                            <input className="me-1" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value='flexRadioDefault1' />
                                            <label className="form-check-label fs-16" htmlFor="flexRadioDefault1">
                                                {billInfo.shipping_sub_text.text_one}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="me-1" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                                            <label className="form-check-label fs-16" htmlFor="flexRadioDefault2">
                                                {billInfo.shipping_sub_text.text_two}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="me-1" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
                                            <label className="form-check-label fs-16" htmlFor="flexRadioDefault3">
                                                {billInfo.shipping_sub_text.text_three}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-between mt-4 fs-25'>
                                    <p className=''>{billInfo.total_headline}:</p>
                                    <p>${billInfo.total_price}</p>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <div className="form-check">
                                    <input className="me-1" type="radio" name="flexRadioDefault2" id="flexRadioDefault4" />
                                    <label className="form-check-label" htmlFor="flexRadioDefault4">
                                        {billInfo.shipping_sub_text.text_one}
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="me-1" type="radio" name="flexRadioDefault2" id="flexRadioDefault5" checked />
                                    <label className="form-check-label" htmlFor="flexRadioDefault5">
                                        {billInfo.shipping_sub_text.text_two}
                                    </label>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <p className='fs-16'>{billInfo.site_paragraph_one}</p>
                            </div>
                            <div className='mt-4 text-center text-lg-start'>
                                <button className='fs-16 py-2 py-lg-3 border-0 bg-dark text-white w-sm-100 w-65'>{billInfo.order_button_text}</button>
                            </div>
                            <div className='mt-4'>
                                <p className='fs-16'>{billInfo.site_paragraph_two}</p>
                            </div>


                        </div>

                    </div>

                </div>
            </section>
        </div>
    )
}

export default Bill