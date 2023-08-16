import { createSlice, } from '@reduxjs/toolkit'
import { initialState } from "./initialState"
import { server } from "../../config/serverPoint";
import api from "../../config/api.json"
import { createToast } from '../../utils/toast';
import Swal from 'sweetalert2';

const BaseUrl = server + "api/v1/";

export const wishlistSlice = createSlice({
    name: 'wishlistStore',
    initialState,

    reducers: {

        setWishlist: (state, action) => {
            state.wishlist = action.payload;
        },

        setWishlistCounter: (state, action) => {
            state.wishlistCounter = action.payload;
        },

        setVariants: (state, action) => {
            const { index, price, weight } = action.payload;
            state.wishlist[index].data.selectedPrice = price;
            state.wishlist[index].data.selectedWeight = weight;
            state.wishlist[index].data.selectedVariants = JSON.stringify({ price: price, weight: weight });
            localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
        },

        addToWishlist: (state, action) => {
            let { data, quantity } = action.payload;
            let duplicate = false;
            state.wishlist.forEach((el, index) => {
                if (el.data.id == data.id) {
                    // state.wishlist[index].quantity = state.wishlist[index].quantity + quantity;
                    // state.wishlistCounter = state.wishlistCounter + quantity;
                    duplicate = true;
                }
            });
            if (duplicate == true) {
                createToast('Item already added to favorites.', 'info');
            } else {
                state.wishlist.push({ data: data, quantity: quantity });
                state.wishlistCounter = state.wishlistCounter + quantity;
                localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
                createToast('Item added to favorites.', 'success');
            }

        },

        increaseCount: (state, action) => {
            let index = action.payload;
            state.wishlist[index].quantity = state.wishlist[index].quantity + 1;
            state.wishlistCounter = state.wishlistCounter + 1;
            localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
        },

        decreaseCount: (state, action) => {
            let index = action.payload;
            if (state.wishlist[index].quantity > 1) {
                state.wishlist[index].quantity = state.wishlist[index].quantity - 1;
                state.wishlistCounter = state.wishlistCounter - 1;
                localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
            }
        },

        removeFromWishlist: (state, action) => {
            let item = action.payload;
            let wishlist = (localStorage.getItem('wishlist') && localStorage.getItem('wishlist') != 'null') ? JSON.parse(localStorage.getItem('wishlist')) : [];
            let removeAbleItem = wishlist.filter((el) => (el.data.id == item.id))[0];
            let filteredWishList = wishlist.filter((el) => (el.data.id != item.id));
            // let index = action.payload;
            // let item = state.wishlist[index]
            state.wishlistCounter = state.wishlistCounter - removeAbleItem.quantity;
            state.wishlist = filteredWishList;
            // state.wishlist.splice(action.payload, 1);
            localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
            createToast('Item removed from favourites successfully.', 'success');
        }

    },
})

// Action creators are generated for each case reducer function
export const { setWishlist, setWishlistCounter, addToWishlist, setVariants, increaseCount, decreaseCount, removeFromWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
