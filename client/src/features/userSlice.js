import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userList: [],
  activeUserList: [],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state, action) => {
      state.user = null;
    },
    addUserList: (state, action) => {
      state.userList = action.payload;
    },
    removeUserFromList: (state, action) => {
      state.userList = state.userList.filter(
        (user) => user.id !== action.payload
      );
    },
    addActiveUsers: (state, action) => {
      state.activeUserList = action.payload;
    },
    removeActiveUserFromList: (state, action) => {
      state.userList = state.activeUserList.filter(
        (user) => user.id !== action.payload
      );
    },
  },
});

export const {
  addUser,
  removeUser,
  addUserList,
  removeUserFromList,
  addActiveUsers,
  removeActiveUserFromList,
} = userSlice.actions;
export default userSlice.reducer;
