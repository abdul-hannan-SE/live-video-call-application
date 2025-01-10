import { createSlice } from "@reduxjs/toolkit";

const backdropSlice = createSlice({
  name: "backdrop",
  initialState: { open: false },
  reducers: {
    showBackdrop: (state) => {
      state.open = true;
    },
    clearBackdrop: (state) => {
      state.open = false;
    },
  },
});

export const { showBackdrop, clearBackdrop } = backdropSlice.actions;
export default backdropSlice.reducer;
