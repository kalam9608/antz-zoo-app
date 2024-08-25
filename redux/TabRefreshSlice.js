import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isEnclosureDeleted: false,
  isGroupAnimalCountUpdated: false
};

export const TabRefreshSlice = createSlice({
  name: "tabRefresh",
  initialState,
  reducers: {
    setEncDelete: (state, action) => {
        state.isEnclosureDeleted = action.payload;
    },
    setGroupAnimalCountUpdated: (state, action) => {
        state.isGroupAnimalCountUpdated = action.payload;
    },
  },
});

export const { setEncDelete, setGroupAnimalCountUpdated } = TabRefreshSlice.actions;
export default TabRefreshSlice.reducer;