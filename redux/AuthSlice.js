import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import {
  clearAsyncData,
  getAsyncData,
  saveAsyncData,
} from "../utils/AsyncStorageHelper";
import { errorToast } from "../utils/Alert";

const initialState = {
  userDetails: null,
  passcode: null,
  token: null,
  zoos: null,
  zoo_id: null,
  client_id: null,
  permission: {},
  roles: {},
  setting: null,
  listEmptyImgCount: 0,
};

export const AuthSlice = createSlice({
  name: "UserAuth",
  initialState,
  reducers: {
    setSignIn: (state, action) => {
      state.userDetails = action.payload.user;
      state.zoos = action.payload.user.zoos;
      state.zoo_id = action.payload.user.zoos[0]?.zoo_id;
      state.client_id = action.payload.user.client_id;
      state.token = action.payload.token;
      state.setting = action.payload.settings;
      state.permission = Object.assign(
        action.payload.permission?.user_settings,
        action.payload.roles?.settings
      );
      // state.roles = action.payload.roles;
      saveAsyncData("@antz_user_token", action.payload.token);
    },

    setPassCode: (state, action) => {
      state.passcode = action.payload;
    },

    setListEmptyImgCount: (state, action) => {
      state.listEmptyImgCount = action.payload;
    },

    setToken: (state) => {
      getAsyncData("@antz_user_data")
        .then((response) => {
          state.token = response;
        })
        .catch((error) => errorToast("Oops!", "Something went wrong!!"));
    },

    setSignOut: (state) => {
      state.userDetails = null;
      state.zoos = null;
      state.token = null;
      state.setting= null
      clearAsyncData("@antz_user_token");
      clearAsyncData("@antz_max_upload_sizes");
    },
  },
});
// this is for dispatch
export const {
  setToken,
  setSignIn,
  setSignOut,
  setDarkMode,
  setPassCode,
  setListEmptyImgCount,
} = AuthSlice.actions;

// this is for configureStore
export default AuthSlice.reducer;
