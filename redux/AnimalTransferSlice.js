import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  animal: {},
  isRequestBy: false,
  transferChecklistData: [],
  selectedTransferAnimal: [],
};

export const AnimalTransferSlice = createSlice({
  name: "AnimalTransfer",
  initialState,
  reducers: {
    setAnimal: (state, action) => {
      state.animal = action.payload;
    },
    setTransferChecklistData: (state, action) => {
      state.transferChecklistData = action.payload;
    },
    setSelectedTransferAnimal: (state, action) => {
      state.selectedTransferAnimal = action.payload;
    },
    removeParentAnimal: (state, action) => {
      state.fatherAnimal = {};
      state.motherAnimal = {};
    },
    removeAnimalTransferData: (state, action) => {
      state.animal = {};
    },
    removeSelectedTransferAnimal: (state, action) => {
      state.selectedTransferAnimal = [];
    },
  },
});

export const {
  setAnimal,
  setTransferChecklistData,
  setSelectedTransferAnimal,
  removeAnimalTransferData,
  removeParentAnimal,
  removeSelectedTransferAnimal,
} = AnimalTransferSlice.actions;

export default AnimalTransferSlice.reducer;
