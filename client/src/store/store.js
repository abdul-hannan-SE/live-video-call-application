import { configureStore } from "@reduxjs/toolkit";
import {
  userSlice as userReducer,
  alertSlice as alertReducer,
  backdropSlice as backdropReducer,
} from "../features/";

export const store = configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
    backdrop: backdropReducer,
  },
});

export default store;
