// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './slices/imageSlice';
import canvasReducer from './slices/canvasSlice';

export const store = configureStore({
  reducer: {
    image: imageReducer,
    canvas: canvasReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
