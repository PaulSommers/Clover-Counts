import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import roomsReducer from './slices/roomsSlice';
import countSessionsReducer from './slices/countSessionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    rooms: roomsReducer,
    countSessions: countSessionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;