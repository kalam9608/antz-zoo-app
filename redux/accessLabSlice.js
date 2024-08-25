import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modulesLab: [],
};

export const ModulesLabSlice = createSlice({
  name: "modulesLab",
  initialState,
  reducers: {
    setModulesLab: (state, action) => {
      state.modulesLab = action.payload;
    },
    unsetModuleLab: (state, action) => {
      state.modulesLab = [];
    }
  },
});

export const { setModulesLab, unsetModuleLab } = ModulesLabSlice.actions;
export default ModulesLabSlice.reducer;