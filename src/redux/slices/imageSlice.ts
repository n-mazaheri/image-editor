import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ImageState {
  imagePreview: string | null;
  imageHeight: number;
  imageWidth: number;
  imageType: string;
  layers: { id: number; objects: string[]; visible: boolean; grouped: boolean }[];
  activeLayer: number | null;
  requestUngroupActiveGroup: boolean;
}

const initialState: ImageState = {
  imagePreview: null,
  layers: [{ id: 1, objects: [], visible: true, grouped: false }],
  activeLayer: 1,
  imageHeight: 0,
  imageWidth: 0,
  imageType: 'png',
  requestUngroupActiveGroup: true,
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setImagePriview(state, action: PayloadAction<string | null>) {
      state.imagePreview = action.payload;
    },
    setImageHeight(state, action: PayloadAction<number>) {
      state.imageHeight = action.payload;
    },
    setImageWidth(state, action: PayloadAction<number>) {
      state.imageWidth = action.payload;
    },
    setImageType(state, action: PayloadAction<string>) {
      state.imageType = action.payload;
    },

    setLayers(state, action: PayloadAction<{ id: number; objects: string[]; visible: boolean; grouped: boolean }[]>) {
      state.layers = action.payload;
      if (!action.payload.find((l) => l.id == state.activeLayer)) {
        if (state.layers.length) {
          state.activeLayer = state.layers[0].id;
        } else {
          state.activeLayer = null;
        }
      }
    },
    addLayer(state) {
      let maxLayer = state.layers.reduce((a, b) => Math.max(a, b.id), -Infinity);
      if (state.layers.length == 0) maxLayer = 0;
      state.layers = [...state.layers, { id: maxLayer + 1, objects: [], visible: true, grouped: false }];
      state.activeLayer = state.layers[state.layers.length - 1].id;
    },
    removeLayer(state, action: PayloadAction<number>) {
      state.layers = [...state.layers.filter((l) => l.id != action.payload)];
      if (!state.layers.find((l) => l.id == state.activeLayer)) {
        if (state.layers.length) {
          state.activeLayer = state.layers[0].id;
        } else {
          state.activeLayer = null;
        }
      }
    },
    moveLayerUp(state, action: PayloadAction<number>) {
      let index = action.payload;
      if (index > 0) {
        let newLayers = [...state.layers];
        let temp = newLayers[index - 1];
        newLayers[index - 1] = newLayers[index];
        newLayers[index] = temp;
        state.layers = newLayers;
      }
    },
    moveLayerDown(state, action: PayloadAction<number>) {
      let index = action.payload;
      if (index < state.layers.length - 1) {
        let newLayers = [...state.layers];
        let temp = newLayers[index + 1];
        newLayers[index + 1] = newLayers[index];
        newLayers[index] = temp;
        state.layers = newLayers;
      }
    },

    setActiveLayer(state, action: PayloadAction<number | null>) {
      if (state.layers.find((l) => l.id == action.payload)) {
        state.activeLayer = action.payload;
      }
    },
    setRequestUngroupActiveGroup(state, action: PayloadAction<boolean>) {
      state.requestUngroupActiveGroup = action.payload;
    },
    addObject(state, action: PayloadAction<string>) {
      let activeLayer = state.layers.find((l) => l.id == state.activeLayer);
      if (activeLayer) {
        activeLayer.objects = [...activeLayer.objects, action.payload];
      }
    },
    changeLayerVisibility(state, action: PayloadAction<{ id: number; visible: boolean }>) {
      let layer = state.layers.find((l) => l.id == action.payload.id);
      if (layer) {
        layer.visible = action.payload.visible;
      }
    },
    changeLayerGroup(
      state,
      action: PayloadAction<{ layerId: number; grouped: boolean; added: string[]; removed: string[] }>
    ) {
      let layer = state.layers.find((lay) => lay.id == action.payload.layerId);
      if (layer) {
        layer.grouped = action.payload.grouped;
        layer.objects = layer.objects.filter((object) => !action.payload.removed.find((re) => re == object));
        layer.objects = ([] as string[]).concat(layer.objects, action.payload.added);
      }
    },
  },
});

export const {
  setImagePriview,
  setImageHeight,
  setImageWidth,
  setImageType,
  setLayers,
  setActiveLayer,
  addObject,
  changeLayerVisibility,
  addLayer,
  removeLayer,
  moveLayerUp,
  moveLayerDown,
  changeLayerGroup,
  setRequestUngroupActiveGroup,
} = imageSlice.actions;

export const selectImagePreview = (state: RootState) => state.image.imagePreview;
export const selectImageHeight = (state: RootState) => state.image.imageHeight;
export const selectImageType = (state: RootState) => state.image.imageType;
export const selectImageWidth = (state: RootState) => state.image.imageWidth;
export const selectLayers = (state: RootState) => state.image.layers;
export const selectActiveLayer = (state: RootState) => state.image.activeLayer;
export const selectRequestUngroupActiveGroup = (state: RootState) => state.image.requestUngroupActiveGroup;

export default imageSlice.reducer;
