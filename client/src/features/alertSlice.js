// src/store/alertSlice.js
import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alert",
  initialState: { message: null, severity: "info", type: null }, // Added 'type' to the state
  reducers: {
    showAlert: (state, action) => {
      state.message = action.payload.message;
      state.severity = action.payload.severity || "info";
      state.type = action.payload.type || null; // Set 'type' if provided, else default to null
    },
    clearAlert: (state) => {
      state.message = null;
      state.severity = "info";
      state.type = null; // Reset 'type' when clearing the alert
    },
  },
});

export const { showAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
