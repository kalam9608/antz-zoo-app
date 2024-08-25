import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  animal: {},
  motherAnimal: {},
  fatherAnimal: {},
  destination: null,
  approver: {},
  requestBy: null,
  isRequestBy: false,
  isReloading: false,
};

export const AnimalMovementSlice = createSlice({
  name: "AnimalMove",
  initialState,
  reducers: {
    setReloading: (state, action) => {
      state.isReloading = action.payload;
    },
    setAnimal: (state, action) => {
      state.animal = action.payload;
    },
    setMotherAnimal: (state, action) => {
      state.motherAnimal = action.payload;
    },
    setFatherAnimal: (state, action) => {
      state.fatherAnimal = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setApprover: (state, action) => {
      state.approver = action.payload;
    },
    setRequestBy: (state, action) => {
      state.requestBy = action.payload;
      state.isRequestBy = true;
    },
    removeParentAnimal: (state, action) => {
      state.fatherAnimal = {};
      state.motherAnimal = {};
    },
    removeAnimalMovementData: (state, action) => {
      state.animal = {};
      state.destination = null;
      state.approver = {};
      state.requestBy = null;
      state.isRequestBy = false;
    },
  },
});

export const {
  setAnimal,
  setFatherAnimal,
  setMotherAnimal,
  setDestination,
  setApprover,
  setRequestBy,
  removeAnimalMovementData,
  removeParentAnimal,
  setReloading
} = AnimalMovementSlice.actions;

export default AnimalMovementSlice.reducer;
