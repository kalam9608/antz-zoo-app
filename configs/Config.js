import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  downlode,
  encrupted,
  forward,
  home_health,
  move,
  person,
  pets,
  visibility,
} from "./SvgHomeImport";
const isDev = true; // False means staging url will work
const uat_build = false;
const prod_build = false;
const vantara_build = false;
const ENABLE_SCREEN_SHOT = false;
const experience_id = "@antzsystems/antz-app";

const is_dev_build = false; // set this to true this only to generate dev builds bcz the app color changes
// isDev?"https://app.antzsystems.com/api/"
const BASE_URL = vantara_build
  ? "https://uatapi.antz.ril.com/"
  : isDev
  ? "https://api.dev.antzsystems.com/"
  : uat_build
  ? "https://app.antzsystems.com/"
  : "https://app.staging.antzsystems.com/";
export default {
  BASE_URL: BASE_URL + "api/",
  SUCCESS_TYPE: "success",
  ERROR_TYPE: "error",
  ALERT_TYPE: "alert",
  WARNING_TYPE: "warning",
  BASE_APP_URL: BASE_URL,
  isDev: isDev,
  vantara_build: vantara_build,
  ENABLE_SCREEN_SHOT: ENABLE_SCREEN_SHOT,
  IS_DEV_BUILD: is_dev_build,
  CHAT_URL: "https://chat.desuntechnologies.com/public/index.php/api/",
  EXPERIENCE_ID: experience_id,
};

export const data = [
  {
    id: 61,
    title: "First Item",
  },
  {
    id: 72,
    title: "Second Item",
  },
  {
    id: 83,
    title: "Third Item",
  },
];

export const buttonData = [
  {
    id: 1,
    screen: "AddZooSite",
    buttonTitle: "+ Site",
    key: "add_sites",
    icon: pets,
  },
  {
    id: 2,
    screen: "Section",
    buttonTitle: "+ Section",
    key: "housing_add_section",
    icon: pets,
  },
  {
    id: 12,
    buttonTitle: "+ Note",
    screen: "Observation",
    key: "not_required",
    icon: visibility,
  },
  {
    id: 3,
    screen: "CreateEnclosure",
    buttonTitle: "+ Enclosure",
    key: "housing_add_enclosure",
    icon: pets,
  },
  {
    id: 4,
    screen: "Accession",
    buttonTitle: "+ Accession",
    subKey: "collection_animal_record_access",
    icon: pets,
  },
  {
    id: 5,
    screen: "AddStaff",
    buttonTitle: "+ User",
    key: "allow_add_users",
    icon: person,
  },
  {
    id: 6,
    screen: "AddMedical",
    buttonTitle: "+ Medical",
    subKey: "medical_records_access",
    icon: home_health,
  },
  // {
  //   id: 7,
  //   screen: "AnimalMovement",
  //   buttonTitle: "Move Animal",
  //   key: "approval_move_animal_internal",
  //   icon: forward,
  // },
  {
    id: 8,
    screen: "master",
    buttonTitle: "Master",
    key: "allow_masters",
    icon: encrupted,
  },

  // {
  //   id: 9,
  //   screen: "PrintLabelMAster",
  //   buttonTitle: "Get Print Label",
  //   key: "not_required",
  //   icon: downlode,
  // },
  {
    id: 10,
    buttonTitle: "Transfer Animal",
    screen: "MoveAnimal",
    key: "approval_move_animal_external",
    icon: move,
  },

  {
    id: 7,
    screen: "AddDispenseMedicine",
    buttonTitle: "Dispense Medicine",
    subKey: "medical_records_access",
    icon: home_health,
  },
];

export const AnimalSearchPage = [
  {
    id: 1,
    name: "Common Name",
    isSelect: true,
  },

  {
    id: 2,
    name: "Scientific Name",
  },
  {
    id: 3,
    name: "Identifier",
  },
];

export const SearchPage = [
  {
    id: 1,
    name: "Common Name",
    key: "collection_view_insights",
  },
  {
    id: 2,
    name: "Scientific Name",
    key: "collection_view_insights",
  },
  {
    id: 3,
    name: "Identifier",
    key: "collection_view_insights",
  },
  {
    id: 4,
    name: "Enclosure",
    key: "enable_housing",
  },
  {
    id: 5,
    name: "Section",
    key: "enable_housing",
  },
  {
    id: 6,
    name: "Site",
    key: "enable_housing",
  },
  {
    id: 7,
    name: "User",
    key: "not_required",
  },
];

export const MasterData = [
  {
    id: 42,
    screen: "CreateSite",
    buttonTitle: "+Add Sites",
  },
  {
    id: 43,
    screen: "Section",
    buttonTitle: "+Add Section",
  },
  {
    id: 44,
    screen: "AddStaff",
    buttonTitle: "+Add User",
  },
  {
    id: 45,
    screen: "CreateEnclosure",
    buttonTitle: "Add Enclosure",
  },
  {
    id: 46,
    screen: "master",
    buttonTitle: "Master",
  },
];

export const FilterMaster = [
  {
    id: 0,
    name: "All time data",
    value: "all",
  },
  {
    id: 1,
    name: "Last 7 days",
    value: "last-7-days",
  },
  {
    id: 2,
    name: "This Month",
    value: "this-month",
  },

  {
    id: 3,
    name: "Last 3 Months",
    value: "last-3-months",
  },
  {
    id: 4,
    name: "Last 6 Months",
    value: "last-6-months",
  },
];

export const TRANSFER_STATUS = [
  {
    id: -1,
    name: "Show All",
    value: "ALL",
  },
  {
    id: 0,
    name: "Awaiting Approval",
    value: "PENDING",
    color: "#FCF4AE",
    textColor: "#FA6140",
  },
  {
    id: 1,
    name: "Approved",
    value: "APPROVED",
    color: "#E1F9ED",
    textColor: "#37BD69",
  },
  {
    id: 2,
    name: "Rejected",
    value: "REJECTED",
    color: "#FFD3D3",
    textColor: "#E93353",
  },

  {
    id: 3,
    name: "Canceled",
    value: "CANCELED",
    color: "#7A8684",
    textColor: "#FFFFFF",
  },
  {
    id: 4,
    name: "Completed",
    value: "COMPLETED",
    color: "#000000",
    textColor: "#FFFFFF",
  },
  {
    id: 5,
    name: "Allocate",
    value: "REACHED_DESTINATION",
    value1: "ALLOCATE",
    color: "#37BD69",
    textColor: "#FFFFFF",
  },
  {
    id: 6,
    name: "Received Animals",
    value: "RECEIVED_ANIMALS",
    color: "#37BD69",
    textColor: "#FFFFFF",
  },
  {
    id: 7,
    name: "SECURITY CHECKOUT CLEARED",
    value: "SECURITY_CHECKOUT_ALLOWED",
    color: "#FFFFFF",
    textColor: "#1F515B",
  },
  {
    id: 8,
    name: "SECURITY CHECKIN CLEARED",
    value: "SECURITY_CHECKIN_ALLOWED",
    color: "#FFFFFF",
    textColor: "#1F515B",
  },
];
export const APPROVAL_STATUS = [
  {
    id: -1,
    name: "Show All",
    value: "ALL",
  },
  {
    id: 0,
    name: "Awaiting Approval",
    value: "PENDING",
    color: "#FFE86E",
    textColor: "#FA6140",
  },
  {
    id: 1,
    name: "Approved",
    value: "APPROVED",
    color: "#37BD69",
    textColor: "#FFFFFF",
  },
  {
    id: 2,
    name: "Rejected",
    value: "REJECTED",
    color: "#E93353",
    textColor: "#FFFFFF",
  },

  {
    id: 3,
    name: "Canceled",
    value: "CANCELED",
    color: "#7A8684",
    textColor: "#FFFFFF",
  },
  {
    id: 4,
    name: "Completed",
    value: "COMPLETED",
    color: "#1F515B",
    textColor: "#52F990",
  },
];

export const ACTIVITY_STATUS = [
  {
    id: 0,
    key: "PENDING",
    name: "PENDING",
  },
  {
    id: 1,
    key: "APPROVED",
    name: "APPROVED",
  },
  {
    id: 2,
    key: "REJECTED",
    name: "REJECTED",
  },

  {
    id: 3,
    key: "CANCELED",
    name: "CANCELED",
  },
  {
    id: 4,
    key: "QR_CODE_GENERATED",
    name: "QR CODE GENERATED",
  },
  {
    id: 5,
    key: "CHECKED_TEMPERATURE",
    name: "CHECKED TEMPERATURE",
  },
  {
    id: 6,
    key: "LOADED_ANIMALS",
    name: "LOADED ANIMALS",
  },
  {
    id: 7,
    key: "RIDE_STARTED",
    name: "MOVED TO SECURITY CHECKOUT",
  },
  {
    id: 8,
    key: "SECURITY_CHECKOUT_DENIED",
    name: "SECURITY CHECKOUT DENIED",
  },
  {
    id: 9,
    key: "RELOADED_ANIMALS",
    name: "RELOADED ANIMALS",
  },
  {
    id: 10,
    key: "SECURITY_CHECKOUT_ALLOWED",
    name: "IN-TRANSIT",
  },
  {
    id: 11,
    key: "SECURITY_CHECKIN_DENIED",
    name: "SECURITY CHECKIN DENIED",
  },
  {
    id: 12,
    key: "CHECKIN_ENTRY_APPROVED",
    name: "CHECKIN ENTRY APPROVED",
  },
  {
    id: 13,
    key: "SECURITY_CHECKIN_ALLOWED",
    name: "SECURITY CHECKIN ALLOWED",
  },
  {
    id: 14,
    key: "REACHED_DESTINATION",
    name: "REACHED DESTINATION",
  },
  {
    id: 15,
    key: "COMPLETED",
    name: "COMPLETED",
  },
];

export const AccessionData = [
  {
    id: "1",
    title: "Add Animal",
    screen: "AnimalAddDynamicForm",
  },
  // {
  //   id: "2",
  //   title: "Add Eggs",
  //   screen: "EggsAddForm",
  // },
  {
    id: "3",
    title: "Add Group Of Animals",
    screen: "AddAnimals",
  },
];
export const AddAnimalTypeData = [
  {
    id: "1",
    title: "Single / Batch Animals",
    screen: "AnimalAddDynamicForm",
  },
  // {
  //   id: "2",
  //   title: "Add Eggs",
  //   screen: "EggsAddForm",
  // },
  {
    id: "3",
    title: "Group Of Animals",
    screen: "AddAnimals",
  },
];
export const MasterHomeData = [
  // {
  //   id: "1",
  //   title: "Add Designation ",
  //   screen: "CreateDesignation",
  //   key: "add_designations",
  // },
  // {
  //   id: "2",
  //   title: "Add Department",
  //   screen: "empDepartment",
  //   key: "add_departments",
  // },
  {
    id: "3",
    title: "Add Id Proofs",
    screen: "ListClientId",
    key: "add_id_proofs",
  },
  {
    id: "4",
    title: "Education Type",
    screen: "EducationType",
    key: "add_educations",
  },
  {
    id: "6",
    title: "Medical Masters",
    screen: "medicalMastersData",
    key: "medical_records",
  },
  {
    id: "7",
    title: "Transfers",
    screen: "ListOfTransfers",
    key: "approval_move_animal_external",
  },
  {
    id: "8",
    title: "Institute Masters",
    screen: "InstituteList",
    key: "add_institutes_for_animal_transfer",
  },
  {
    id: "9",
    title: "Taxonomy",
    screen: "SpeciesMaster",
    key: "add_taxonomy",
  },
  {
    id: "10",
    title: "Role",
    screen: "RoleList",
    key: "allow_creating_roles",
  },
  {
    id: "11",
    title: "Organization",
    screen: "OrganizationList",
    key: "add_organizations",
  },
  // {
  //   id: "12",
  //   title: "Note Types", 
  //   screen: "NotesTypesList",
  //   key: "not_required",
  // },
  {
    id: "13",
    title: "Assessments",
    screen: "Assessment",
    key: "add_assessment",
  },
];
export const PrintLabel = [
  {
    id: "1",
    title: "Sections",
    type: "section",
  },
  {
    id: "2",
    title: "Enclosures",
    type: "enclosure",
  },
  {
    id: "3",
    title: "Animals",
    type: "animal",
  },
  {
    id: "4",
    title: "Users",
    type: "user",
  },
];
export const Duration = {
  allTime: "all",
  thisMonth: "this-month",
  last7Days: "last-7-days",
  last3Months: "last-3-months",
  last6Months: "last-6-months",
};

export const AnimalStatsType = {
  allAnimals: "all_animals",
  recentlyAdded: "recently_added",
  transferredAnimals: "transfered_animals",
  deletedAnimals: "deleted_animals",
};

export const documentType = [
  "application/pdf", //.pdf
  "application/msword", //.doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", //.docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", //.xlsx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", //.pptx
  "application/vnd.ms-powerpoint", //.ppt
  "application/vnd.ms-excel", //.xls
];

export const docsMimeType = [
  "application/pdf",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "text/plain",
  "text/html",
  "application/xml",
  // "application/json",
  "text/csv",
];

export const audioType = ["audio/mpeg", "audio/ogg"];

export const videoType = [
  "video/mp4",
  "video/x-flv",
  "video/MP2T",
  "video/3gpp",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-ms-wmv",
];

export const galeryType = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/*",
];

export const imageType = ["image/jpeg", "image/png", "image/gif", "image/webp"];
