import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FeatureState {
  value: number;
}

const initialState: FeatureState = {
  value: 0,
};

const featureSlice = createSlice({
  name: 'ComponentLazy2',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = featureSlice.actions;
export default featureSlice.reducer;
