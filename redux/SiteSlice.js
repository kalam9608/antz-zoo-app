import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sites: [],
};

export const SiteSlice = createSlice({
  name: "sites",
  initialState,
  reducers: {
    setSites: (state, action) => {
        state.sites = action.payload;
    },
    getSites: (state) => {},
  },
});

export const { setSites, getSites } = SiteSlice.actions;
export default SiteSlice.reducer;
