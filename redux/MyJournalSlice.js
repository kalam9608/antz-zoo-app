import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myJournalRefreshLoader: false,
};

export const MyJournalSlice = createSlice({
  name: "MyJournalSlice",
  initialState,
  reducers: {
    setRefreshLoaderTrue: (state, { payload }) => {
      state.myJournalRefreshLoader = true;
    },
    setRefreshLoaderFalse: (state, { payload }) => {
      state.myJournalRefreshLoader = false;
    },
  },
});

export const { setRefreshLoaderTrue, setRefreshLoaderFalse } =
  MyJournalSlice.actions;
export default MyJournalSlice.reducer;
