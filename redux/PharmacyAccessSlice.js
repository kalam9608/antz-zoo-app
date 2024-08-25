import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pharmacyData: [],
};

export const PharmacyAccessSlice = createSlice({
  name: "pharmacyAccess",
  initialState,
  reducers: {
    setPharmacyData: (state, action) => {
      state.pharmacyData = action.payload;
    },
    unsetPharmacyData: (state, action) => {
      state.pharmacyData = [];
    }
  },
});

export const { setPharmacyData, unsetPharmacyData } = PharmacyAccessSlice.actions;
export default PharmacyAccessSlice.reducer;
