import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  medicalRecordId: null,
  editFromAnimalDetailsPage: false,
  editFromSummaryPage: false,
  addMedicalPage: false,
  fromMedicalBasicPage: false,
  editFor: "",
  activeDiagnosisEdit: null,
  activePrescriptionEdit: null,
  effectListApiCall: true,
  adverseEffectList: [],
  animal: [],
  enclosure: [],
  section: [],
  site:[],
  caseType: {},
  complaints: [],
  diagnosis: [],
  lab: [],
  prescription: [],
  prescriptionSearch: {},
  prescriptionSearchPage: 0,
  followUpDate: "",
  showFollowUpDate: "",
  bodyWeight: "",

  format: "days",
  totalDays: "0",
  selectDuration: "",

  advice: [],
  adviceNotes: "",
  labRequests: [],
  additionalSamples: "",
  multipleLabTests: [],
  attachments: {
    images: [],
    documents: [],
    notes: [],
  },

  medicalSettings: {
    caseTypes: [],

    complaintsTemplates: [],
    // mostUsedComplaints: [],
    recentlyUsedComplaints: [],

    diagnosisTemplates: [],
    // mostUsedDiagnosis: [],
    recentlyUsedDiagnosis: [],

    medicineTemplates: [],
    // mostUsedMedicines: [],
    recentlyUsedMedicines: [],

    prescriptionMeasurementType: [],
    prescriptionDosageMeasurementType: [],
    prescriptionDuration: [],
    prescriptionFrequency: [],
    prescriptionDeliveryRoute: [],

    adviceTemplates: [],
    recommendedAdvices: [],
    recentlyUsedAdvices:[],
    labTests: [],
    // mostUsedLabTests: [],
    recentlyUsedLabTests: [],
  },
  animalMedicalDetails: {
    basic: {},
    diagnosis: {
      active_diagnosis: {
        active_count: 0,
        closed_count: 0,
        data: [],
      },
      closed_diagnosis: {
        active_count: 0,
        closed_count: 0,
        data: [],
      },
    },
    prescriptions: {
      active_prescriptions: {
        active_count: 0,
        closed_count: 0,
        data: [],
      },
      closed_prescriptions: {
        active_count: 0,
        closed_count: 0,
        data: [],
      },
    },
  },
};

export const MedicalSlice = createSlice({
  name: "Medical",
  initialState,
  reducers: {
    setActiveDiagnosis: (state, action) => {
      state.animalMedicalDetails.diagnosis.active_diagnosis = action.payload;
    },
    setClosedDiagnosis: (state, action) => {
      state.animalMedicalDetails.diagnosis.closed_diagnosis = action.payload;
    },
    setActivePrescription: (state, action) => {
      state.animalMedicalDetails.prescriptions.active_prescriptions =
        action.payload;
    },
    setClosedPrescription: (state, action) => {
      state.animalMedicalDetails.prescriptions.closed_prescriptions =
        action.payload;
    },
    setMedicalRecordId: (state, action) => {
      state.medicalRecordId = action.payload;
    },
    setMedicalAnimal: (state, action) => {
      state.animal = action.payload;
    },
    setMedicalEnclosure: (state, action) => {
      state.enclosure = action.payload;
    },
    setMedicalSection: (state, action) => {
      state.section = action.payload;
    },
    setMedicalSite: (state, action) => {
      state.site = action.payload;
    },
    setcaseType: (state, action) => {
      state.caseType = action.payload;
    },
    setcomplaints: (state, action) => {
      state.complaints = action.payload;
    },
    setdiagnosis: (state, action) => {
      state.diagnosis = action.payload;
    },
    setlab: (state, action) => {
      state.lab = action.payload;
    },
    setprescription: (state, action) => {
      state.prescription = action.payload;
    },
    setPrescriptionSearch: (state, action) => {
      state.prescriptionSearch = action.payload;
    },
    setPrescriptionSearchPage: (state, action) => {
      state.prescriptionSearchPage = action.payload;
    },
    setfollowUpDate: (state, action) => {
      state.followUpDate = action.payload;
    },
    setShowFollowUpDate: (state, action) => {
      state.showFollowUpDate = action.payload;
    },
    setBodyWeight: (state, action) => {
      state.bodyWeight = action.payload;
    },
    setFormatData: (state, action) => {
      state.format = action.payload;
    },
    setTotalDaysData: (state, action) => {
      state.totalDays = action.payload;
    },
    setSelectDurationData: (state, action) => {
      state.selectDuration = action.payload;
    },

    setadvice: (state, action) => {
      state.advice = action.payload;
    },
    setAdviceNotes: (state, action) => {
      state.adviceNotes = action.payload;
    },
    setLabRequests: (state, action) => {
      state.labRequests = action.payload;
    },
    setMultiLabTests: (state, action) => {
      state.multipleLabTests = action.payload;
    },
    setAdditionalSamples: (state, action) => {
      state.additionalSamples = action.payload;
    },
    setAttachments: (state, action) => {
      state.attachments = action.payload;
    },
    setMedicalSettings: (state, action) => {
      state.medicalSettings = action.payload;
    },
    setEditFromAnimalDetails: (state, action) => {
      state.editFromAnimalDetailsPage = action.payload;
    },
    setEditFromSummaryPage: (state, action) => {
      state.editFromSummaryPage = action.payload;
    },
    setAddMedicalPage: (state, action) => {
      state.addMedicalPage = action.payload;
    },
    removeAddMedicalPage: (state, action) => {
      state.addMedicalPage = false;
    },
    setFromMedicalBasicPage: (state, action) => {
      state.fromMedicalBasicPage = action.payload;
    },
    setEffectListApiCall: (state, action) => {
      state.effectListApiCall = action.payload;
    },
    setAdverseEffectList: (state, action) => {
      state.adverseEffectList = action.payload;
    },
    removeFromMedicalBasicPage: (state, action) => {
      state.fromMedicalBasicPage = false;
    },
    setEditFor: (state, action) => {
      state.editFor = action.payload;
    },
    setActiveDiagnosisEdit: (state, action) => {
      state.activeDiagnosisEdit = action.payload;
    },
    setActivePrescriptionEdit: (state, action) => {
      state.activePrescriptionEdit = action.payload;
    },
    removeEditFromAnimalDetailsPage: (state, action) => {
      state.editFromAnimalDetailsPage = false;
    },
    removeMedical: (state, action) => {
      (state.editFromSummaryPage = false), (state.effectListApiCall = true);
      state.medicalRecordId = null;
      (state.editFromSummaryPage = false), (state.medicalRecordId = null);
      state.editFor = "";
      state.animal = [];
      state.enclosure = [];
      state.section = [];
      state.caseType = {
      };
      state.complaints = [];
      state.diagnosis = [];
      state.lab = [];
      state.prescription = [];
      state.followUpDate = "";
      state.showFollowUpDate = "";
      state.format = "days";
      state.totalDays = "0";
      state.selectDuration = "";
      state.advice = [];
      state.adviceNotes = "";
      state.labRequests = [];
      state.prescriptionSearch = {};
      state.prescriptionSearchPage = 0;
      state.multipleLabTests = [];
      state.additionalSamples = "";
      state.bodyWeight = "";
      state.attachments = {
        images: [],
        documents: [],
        notes: [],
      };
    },
    removeMedicalMasters: (state, action) => {
      state.medicalSettings = {
        caseTypes: [],

        complaintsTemplates: [],
        // mostUsedComplaints: [],
        recentlyUsedComplaints: [],

        diagnosisTemplates: [],
        // mostUsedDiagnosis: [],
        recentlyUsedDiagnosis: [],

        medicineTemplates: [],
        // mostUsedMedicines: [],
        recentlyUsedMedicines: [],

        prescriptionMeasurementType: [],
        prescriptionDosageMeasurementType: [],
        prescriptionDuration: [],
        prescriptionFrequency: [],
        prescriptionDeliveryRoute: [],

        adviceTemplates: [],
        recommendedAdvices: [],
        recentlyUsedAdvices: [],
        labTests: [],
        // mostUsedLabTests: [],
        recentlyUsedLabTests: [],
      };
    },
  },
});

export const {
  setMedicalRecordId,
  setMedicalAnimal,
  setMedicalEnclosure,
  setMedicalSection,
  setMedicalSite,
  setMedical,
  setcaseType,
  setcomplaints,
  setdiagnosis,
  setlab,
  setprescription,
  setfollowUpDate,
  setShowFollowUpDate,
  setFormatData,
  setTotalDaysData,
  setSelectDurationData,
  setadvice,
  setAdviceNotes,
  setLabRequests,
  setAdditionalSamples,
  setEditFromSummaryPage,
  setBodyWeight,
  setMultiLabTests,
  setAttachments,
  setMedicalSettings,
  setEditFromAnimalDetails,
  setEditFor,
  setActiveDiagnosisEdit,
  setActivePrescriptionEdit,
  setAddMedicalPage,
  setFromMedicalBasicPage,
  removeFromMedicalBasicPage,
  removeAddMedicalPage,
  removeMedical,
  removeMedicalMasters,
  removeEditFromAnimalDetailsPage,
  setPrescriptionSearch,
  setPrescriptionSearchPage,
  setActiveDiagnosis,
  setClosedDiagnosis,
  setActivePrescription,
  setClosedPrescription,
  setEffectListApiCall,
  setAdverseEffectList,
} = MedicalSlice.actions;

export default MedicalSlice.reducer;
