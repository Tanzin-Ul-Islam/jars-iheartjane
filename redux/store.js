import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart_store/cartReducer';
import wishlistReducer from './wishlist_store/wishlistReducer';
import globalReducer from './global_store/globalReducer';
import { ApiCore } from './api_core/apiCore';
export const store = configureStore({
  reducer: {
    [ApiCore.reducerPath]: ApiCore.reducer,
    cartStore: cartReducer,
    wishlistStore: wishlistReducer,
    globalStore: globalReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(ApiCore.middleware),
});