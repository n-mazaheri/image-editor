import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface CanvasState {
  strokeColor: string;
  strockeWidth: number;
  textColor: string;
  fontSize: number;
  fillColor: string;
}

const initialState: CanvasState = {
  strokeColor: '#ff0000',
  strockeWidth: 2,
  textColor: '#00ff00',
  fontSize: 17,
  fillColor: '#0000ff',
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setStrokeColor(state, action: PayloadAction<string>) {
      state.strokeColor = action.payload;
    },
    setStrokeWidth(state, action: PayloadAction<number>) {
      state.strockeWidth = action.payload;
    },
    setTextColor(state, action: PayloadAction<string>) {
      state.textColor = action.payload;
    },
    setFontSize(state, action: PayloadAction<number>) {
      state.fontSize = action.payload;
    },
    setFillColor(state, action: PayloadAction<string>) {
      state.fillColor = action.payload;
    },
  },
});

export const { setStrokeColor, setStrokeWidth, setFontSize, setTextColor, setFillColor } = canvasSlice.actions;

export const selectStrokeColor = (state: RootState) => state.canvas.strokeColor;
export const selectStrokewidth = (state: RootState) => state.canvas.strockeWidth;
export const selectTextColor = (state: RootState) => state.canvas.textColor;
export const selectFontSize = (state: RootState) => state.canvas.fontSize;
export const selectFillColor = (state: RootState) => state.canvas.fillColor;

export default canvasSlice.reducer;
