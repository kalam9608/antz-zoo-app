import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import DarkModeReducer from "./DarkModeReducer";
import SiteSlice from "./SiteSlice";
import MedicalSlice from "./MedicalSlice";
import AnimalMovementSlice from "./AnimalMovementSlice";
import AnimalTransferSlice from "./AnimalTransferSlice";
import SocketSlice from "./SocketSlice";
import ModulesLabSlice from "./accessLabSlice";
import PharmacyAccessSlice from "./PharmacyAccessSlice";
import TabRefreshSlice from "./TabRefreshSlice";
import MyJournalSlice from "./MyJournalSlice";

export const store = configureStore({
  reducer: {
    UserAuth: AuthSlice,
    darkMode: DarkModeReducer,
    sites: SiteSlice,
    medical: MedicalSlice,
    AnimalMove: AnimalMovementSlice,
    AnimalTransfer: AnimalTransferSlice,
    SocketSlice: SocketSlice,
    ModulesLabSlice: ModulesLabSlice,
    PharmacyAccessSlice: PharmacyAccessSlice,
    tabRefresh: TabRefreshSlice,
    myRefreshJournalSlice: MyJournalSlice,
  },
});
