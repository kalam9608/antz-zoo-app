const Constants = {
  OTHERS: "others",
  MEDICAL_TEMPLATE_TYPE: {
    COMPLAINTS: "complaint",
    PRESCRIPTION: "prescription",
    DIAGNOSIS: "diagnosis",
    ADVICE: "advice",
    LABTEST: "lab",
  },
  MEDICAL_RECORD_FILTER_LABEL: {
    ALL: "Show All",
    ACTIVE_DIAGNOSIS: "Active Diagnosis",
    ACTIVE_PRESCRIPTIONS: "Active Prescriptions",
  },
  MEDICAL_RECORD_FILTER_LABEL_VALUE: {
    ALL: "all",
    ACTIVE_DIAGNOSIS: "active_diagnosis",
    ACTIVE_PRESCRIPTIONS: "active_prescriptions",
  },
  GLOBAL_ALERT_TIMEOUT_VALUE: 500,
  GLOBAL_LOADER_TIMEOUT_VALUE: 100,
  GLOBAL_DIALOG_TIMEOUT_VALUE: 800,
  MAX_FILE_UPLOAD_VALUE: 25*1024*1024, //25mb
  MAX_IMAGE_UPLOAD_SIZE: 5*1024*1024,  //5mb

  EMPTY_DATA_IMAGE_LENGTH: 3, // Check ListEmpty Component
};

module.exports = Constants;
