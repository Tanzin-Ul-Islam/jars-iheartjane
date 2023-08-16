import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { initialState } from "./initialState"
import axios from "axios";
import { server } from "../../config/serverPoint";
import api from "../../config/api.json"
import { createToast } from '../../utils/toast';
import Swal from 'sweetalert2';

const BaseUrl = server + "api/v1/";

export const addItemToCart = createAsyncThunk(
    'item/addItem',
    async ({ itemData, checkoutId, retailerId }) => {
        try {
            let payload = {
                checkoutId: checkoutId,
                retailerId: retailerId,
                productId: itemData.productId,
                quantity: itemData.quantity,
                option: itemData.option
            }
            const response = await axios.post(`${BaseUrl}${api.checkout.addItemToCheckout}`, payload);
            return response;
        } catch (err) {
            console.log(err)
        }
    }
)

export const updateItemOfCart = createAsyncThunk(
    'item/updateItem',
    async ({ checkoutId, retailerId, index }, { getState }) => {
        const newCartList = getState().cartStore.cartList;
        let item = newCartList[index];
        try {
            let payload = {
                retailerId: retailerId,
                checkoutId: checkoutId,
                itemId: item.id,
                quantity: item.quantity,
            }
            const response = await axios.post(`${BaseUrl}${api.checkout.updateItemOfCheckout}`, payload);
            return response;
        } catch (err) {
            console.log(err)
        }
    }
)

export const removeItemFromCart = createAsyncThunk(
    'item/removeItem',
    async ({ itemId, checkoutId, retailerId }) => {
        try {
            let payload = {
                "retailerId": retailerId,
                "checkoutId": checkoutId,
                "itemId": itemId
            }
            const response = await axios.post(`${BaseUrl}${api.checkout.removeItemFromChecout}`, payload);
            return response
        } catch (err) {
            console.log(err)
        }
    }
)

export const cartSlice = createSlice({
    name: 'cartStore',
    initialState,

    reducers: {
        setCartList: (state, action) => {
            state.cartList = action.payload;
        },
        setCartCounter: (state) => {
            state.cartCounter = 0
            if (state?.cartList?.length > 0) {
                state.cartList.forEach(el => {
                    state.cartCounter = state.cartCounter + el.quantity;
                });
            }
        },
        setSubTotal: (state, action) => {
            state.subtotal = action.payload
        },
        setTotalAmont: (state, action) => {
            state.totalAmount = action.payload
        },
        setTaxAmont: (state, action) => {
            state.taxAmount = action.payload
        },
        setDiscount: (state, action) => {
            state.discountAmount = action.payload;
        },
        increaseItemQuantityInCartList: (state, action) => {
            let index = action.payload;
            state.cartList[index].quantity = state.cartList[index].quantity + 1;
        },
        decreaseItemQuantityInCartList: (state, action) => {
            let index = action.payload;
            if (state.cartList[index].quantity > 1) {
                state.cartList[index].quantity = state.cartList[index].quantity - 1;
            }

        },
        setCheckoutUrl: (state, action) => {
            state.checkoutURL = action.payload;
        },
        setCartCounterObj(state, action) {
            state.cartCounterObj = action.payload;
        },
        setCartCountDown(state, action) {
            state.cartCountDown = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(addItemToCart.fulfilled, (state, action) => {
            if (action.payload && action.payload.status == 200) {
                if ('addItem' in action.payload?.data) {
                    let data = action.payload.data?.addItem;
                    let items = data?.items;
                    let priceSummary = data?.priceSummary;
                    state.subtotal = (priceSummary.subtotal / 100).toFixed(2);
                    state.totalAmount = (priceSummary.total / 100).toFixed(2);
                    state.taxAmount = (priceSummary.taxes / 100).toFixed(2);
                    state.discountAmount = (priceSummary.discounts / 100).toFixed(2);
                    state.cartList = items;
                    localStorage.setItem('cartList', JSON.stringify(state.cartList));

                    state.cartCounter = 0;
                    state.cartList.forEach(el => {
                        state.cartCounter = state.cartCounter + el.quantity;
                    })
                    state.checkoutURL = data.redirectUrl;

                    if (state.cartList.length > 0 && state.cartCounterObj?.enableCartCounter) {
                        const time = (parseInt(state.cartCounterObj.counterTimeInSeconds));
                        state.cartCountDown = time;
                    } else {
                        state.cartCountDown = null;
                        localStorage.removeItem("countDownTime");
                    }
                    // createToast("Item added to cart successfully.", 'success', 'bottom');
                    if (state.cartList.length > 0 && state.cartCounterObj?.enableCartCounter) {
                        const time = (parseInt(state.cartCounterObj.counterTimeInSeconds));
                        state.cartCountDown = time;
                    } else {
                        state.cartCountDown = null;
                        localStorage.removeItem("countDownTime");
                    }
                    Swal.close();
                } else {
                    createToast("Oops, something went wrong. Please try again.", 'error', 'bottom');
                }
            } else {
                createToast("Oops, something went wrong. Please try again.", 'error', 'bottom');
            }

        })
        builder.addCase(updateItemOfCart.fulfilled, (state, action) => {
            if (action.payload && action.payload.status == 200) {
                if ('updateQuantity' in action.payload?.data) {
                    let data = action.payload.data.updateQuantity;
                    let items = data?.items;
                    let priceSummary = data?.priceSummary;
                    state.subtotal = (priceSummary.subtotal / 100).toFixed(2);
                    state.totalAmount = (priceSummary.total / 100).toFixed(2);
                    state.taxAmount = (priceSummary.taxes / 100).toFixed(2);
                    state.discountAmount = (priceSummary.discounts / 100).toFixed(2);
                    state.cartList = items;
                    localStorage.setItem('cartList', JSON.stringify(state.cartList));

                    state.cartCounter = 0;
                    state.cartList.forEach(el => {
                        state.cartCounter = state.cartCounter + el.quantity;
                    })
                    state.checkoutURL = data.redirectUrl;
                    if (state.cartList.length > 0 && state.cartCounterObj?.enableCartCounter) {
                        const time = (parseInt(state.cartCounterObj.counterTimeInSeconds));
                        state.cartCountDown = time;
                    } else {
                        state.cartCountDown = null;
                        localStorage.removeItem("countDownTime");
                    }
                    // createToast("Cart updated successfully.", 'success', 'bottom');
                } else {
                    createToast("Oops, something went wrong. Please try again.", 'error', 'bottom');
                }
            } else {
                createToast("Oops, something went wrong. Please try again.", 'error', 'bottom');
            }
        })
        builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
            if (action.payload && action.payload.status == 200) {
                if ('removeItem' in action.payload.data) {
                    let data = action.payload.data.removeItem;
                    let items = data?.items;
                    let priceSummary = data?.priceSummary;
                    state.subtotal = (priceSummary.subtotal / 100).toFixed(2);
                    state.totalAmount = (priceSummary.total / 100).toFixed(2);
                    state.taxAmount = (priceSummary.taxes / 100).toFixed(2);
                    state.discountAmount = (priceSummary.discounts / 100).toFixed(2);
                    state.cartList = items;
                    localStorage.setItem('cartList', JSON.stringify(state.cartList));

                    state.cartCounter = 0;
                    state.cartList.forEach(el => {
                        state.cartCounter = state.cartCounter + el.quantity;
                    })
                    state.checkoutURL = data.redirectUrl;
                    if (state.cartList.length > 0 && state.cartCounterObj?.enableCartCounter) {
                        const time = (parseInt(state.cartCounterObj.counterTimeInSeconds));
                        state.cartCountDown = time;
                    } else {
                        state.cartCountDown = null;
                        localStorage.removeItem("countDownTime");
                    }
                    // createToast("Item remove from cart successfully.", 'success', 'bottom');
                } else {
                    createToast("Oops, something went wrong. Please try again.", 'error', 'bottom');
                }
            } else {
                createToast("Oops, something went wrong. Please try again.", 'error', 'bottom');
            }
        })
    },
})

// Action creators are generated for each case reducer function
export const { setCartList, setCartCounter, setSubTotal, setTotalAmont, setTaxAmont, setDiscount, setCheckoutUrl, increaseItemQuantityInCartList, decreaseItemQuantityInCartList, setCartCounterObj, setCartCountDown } = cartSlice.actions

export default cartSlice.reducer