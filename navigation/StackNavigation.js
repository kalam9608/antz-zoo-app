import React, { useEffect } from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import Home from "../screen/Home";
import PersonalDetails from "../screen/Staff Management/PersonalDetails";
import Education from "../screen/Staff Management/Education";
import WorkExperience from "../screen/Staff Management/WorkExperience";
import DrawerNavigator from "./DrawerNavigation";
import EnclosureForm from "../screen/Encloser/EnclosureForm";
import UserForm from "../screen/Staff Management/UserForm";
import UserIdForm from "../screen/Staff Management/UserIdForm";
import Enclosure from "../screen/Master/Enclosure";
import AddDiagnosis from "../screen/Master/Medical/AddDiagnosis";
import ManageAffectedParts from "../screen/Master/Medical/ManageAffectedParts";
import AddFeedingFactors from "../screen/Master/Kitchen/AddFeedingFactors";
import AddFeedingPlaters from "../screen/Master/Kitchen/AddFeedingPlaters";
import AddMealSlots from "../screen/Master/Kitchen/AddMealSlots";
import AddEnclosureType from "../screen/Master/AddEnclosureType (1)";
import AddincidentType from "../screen/Master/AddincidentType";
import TagAssign from "../screen/Master/TagAssign";
import AddTag from "../screen/Master/AddTag";
import AddTagGroup from "../screen/Master/AddTagGroup";
import AddFeedTypes from "../screen/Master/AddFeedTypes";
import Foods from "../screen/Master/Foods";
import Section from "../screen/Section/CreateSection";
import ListSection from "../screen/Section/ListSection";
import EditSection from "../screen/Section/EditSection";

import CreateZoo from "../screen/Staff Management/CreateZoo";
import EducationType from "../screen/Staff Management/EducationType";
import GetEducationType from "../screen/Staff Management/getEducationType";
import EmpDepartment from "../screen/Employee_department/EmpDepartment";
import CreateZooSite from "../screen/Employee_department/CreateZooSite";
import ClientIdForm from "../screen/Client id/ClientIdForm";
import ListClientIdProof from "../screen/Client id/ListClientIdProof";
import Department from "../screen/Employee_department/Department";
import Designation from "../screen/Employee_department/Designation";
import AssignUserSite from "../screen/Staff Management/AssignUserSite";
import AssignUserSection from "../screen/Staff Management/AssignUserSection";
import GetClientidProof from "../screen/Client id/GetClientidProof";
import ShowPersonalDetails from "../screen/Staff Management/ShowPersonalDetails";
import GetDeptItem from "../screen/Employee_department/GetDeptItem";
import DesignationDetail from "../screen/Employee_department/DesignationDetail";
import CreateDesignation from "../screen/Employee_department/CreateDesignation";
import ListDepartment from "../screen/User/Department/ListDepartment";
import AddDepartment from "../screen/User/Department/AddDepartment";
import ZoneListByZooId from "../screen/Staff Management/ZoneListByZooId";
import CreateEnclosure from "../screen/Encloser/CreateEnclosure";
import EnclosureList from "../screen/Encloser/EnclosureList";
import EnclosureDetails from "../screen/Encloser/EnclosureDetails";
import ListEggFertility from "../screen/User/Egg Fertility/ListEggFertility";
import AddEggFertility from "../screen/User/Egg Fertility/AddEggFertility";
import GetEggFertility from "../screen/User/Egg Fertility/GetEggFertility";
import ListAccession from "../screen/User/Accession_Type/ListAccession";
import AddAccession from "../screen/User/Accession_Type/AddAccession";
import GetAccession from "../screen/User/Accession_Type/GetAccession";
import AddExperience from "../screen/User/Experience/AddExperience";
import GetExperience from "../screen/User/Experience/GetExperience";
import Listeducation from "../screen/User/Education/Listeducation";
import CreateEducation from "../screen/User/Education/CreateEducation";
import AddHatchedStatus from "../screen/User/Hatched/AddHatchedStatus";
import ListAllHatchedStatus from "../screen/User/Hatched/ListAllHatchedStatus";
import GetHatchedStatus from "../screen/User/Hatched/GetHatchedStatus";
import UserCreateSection from "../screen/User/SectionComponents/UserCreateSection";
import GetSection from "../screen/User/SectionComponents/GetSection";
import CreateSite from "../screen/User/Sites/CreateSite";
import ListSite from "../screen/User/Sites/ListSite";
import AddIdProof from "../screen/User/IdProof/AddIdProof";
import GetIdProof from "../screen/User/IdProof/GetIdProof";
import AddStaff from "../screen/Staff Management/AddStaff";
import UserDetails from "../screen/Staff Management/UserDetails";
import CreateZone from "../screen/Master/CreateZone";
import ListStaff from "../screen/Staff Management/ListStaff";
import AddFeedLog from "../screen/Feed/AddFeedLog";
import SearchScreen from "../screen/SearchScreen";
import Master from "../screen/MasterComponents/Master";
import EggsAddDynamicForm from "../screen/Eggs/EggsAddDynamicForm";
import EggsAddForm from "../screen/Eggs/EggsAddForm";
import EditEggForm from "../screen/Eggs/EditEggForm";
import EggDetails from "../screen/Eggs/EggDetails";
import AnimalMovement from "../screen/Move_animal/AnimalMovement";
import AnimalAddForm from "../screen/Animals/AnimalAddForm";
import AnimalsAdd from "../screen/Others/AnimalsAdd";
import AnimalModuleStats from "../screen/Animals/AnimalModuleStats";
import AnimalList from "../screen/Animals/AnimalList";
import Accession from "../screen/Accession/Accession";
import EggLists from "../screen/Eggs/EggLists";
import AddDisposition from "../screen/Animals/AddDisposition";
import AnimalsDetails from "../screen/Animals/AnimalsDetails";
import BottomTabNav from "./BottomTabNavigation";
import Collections from "../screen/Insights/Collection";
import OrderHierarchy from "../screen/Insights/OrderHierarchy";
import FamilyHierarchy from "../screen/Insights/FamilyHierarchy";
import GenusHierarchy from "../screen/Insights/GenusHierarchy";
import SpeciesHierarchy from "../screen/Insights/SpeciesHierarchy";
import SpeciesDetails from "../screen/Insights/SpeciesDetails";
import Advice from "../screen/Medical/Advice";
import CaseType from "../screen/Medical/CaseType";
import AddMedical from "../screen/Medical/AddMedical";
import Complaints from "../screen/Medical/Complaints";
import Notes from "../screen/Medical/Notes";
import FollowUpDate from "../screen/Medical/FollowUpDate";
import AnimalEnclosure from "../screen/Encloser/AnimalEnclosure";
import ApprovalTask from "../screen/Approval/ApprovalTask";
import Prescription from "../screen/Medical/Prescription";
import Diagnosis from "../screen/Medical/Diagnosis";
import AnimalTransfer from "../screen/Animal_transfer/AnimalTransfer";
import EditAnimals from "../screen/Others/EditAnimals";
import EditTaxonomy from "../screen/MasterComponents/EditTaxonomy";

import ChatsScreen from "../screen/ChatModule/screen/ChatsScreen";
import ChatScreen from "../screen/ChatModule/screen/ChatScreen";
import AnimalEdit from "../screen/Animals/AnimalEdit";
import EditSite from "../screen/User/Sites/EditSite";
import EnclosureEdit from "../screen/Encloser/EnclosureEdit";
import SearchTransferanimal from "../screen/Move_animal/SearchTransferanimal";
import MoveToEnclosure from "../screen/Move_animal/MoveToEnclosure";
import Housing from "../screen/housing/Housing";
import OccupantScreen from "../screen/housing/OccupantScreen";
import HousingEnclouser from "../screen/housing/HousingEnclouser";
import InsightSearching from "../screen/Insights/InsightSearching";
import InchargeAndApproverSelect from "../components/InchargeAndApproverSelect";
import CommonSearch from "../screen/Medical/CommonSearch";
import QRCodeScanner from "../components/CamScanner";
import LocalIdentifier from "../screen/Animals/LocalIdentifier";
import Mortality from "../screen/Insights/Mortality";
import FilterScreen from "../screen/FilterScreen";
import SectionDetails from "../screen/Section/SectionDetails";
import MortalityAnimals from "../screen/Insights/MortalityAnimals";
import DeletedAnimalList from "../screen/Animals/DeletedAnimalList";
import MedicalMaster from "../screen/medicalMasters/MedicalList";
import DiagnosisList from "../screen/medicalMasters/DiagnosisList";
import PrescriptionList from "../screen/medicalMasters/PrescriptionList";
import ComplaintsList from "../screen/medicalMasters/ComplaintsList";
import CaseTypeList from "../screen/medicalMasters/CaseTypeList";
import PrescriptionDosagesList from "../screen/medicalMasters/PrescriptionDosageList";
import MedicalAdvicesList from "../screen/medicalMasters/MedicalAdvicesList";
import AddDiagnosisData from "../screen/medicalMasters/AddDiagnosis";
import AddInstitute from "../screen/medicalMasters/AddInstitute";
import AddPrescription from "../screen/medicalMasters/AddPrescription";
import AddComplaints from "../screen/medicalMasters/AddComplaints";
import AddPrescriptionDosage from "../screen/medicalMasters/AddPrescriptionDosage";
import AddMedicalCaseType from "../screen/medicalMasters/AddMedicalCaseType";
import { AddAdvice } from "../services/MedicalMastersService";
import AddAdviceData from "../screen/medicalMasters/AddAdvice";
import PrintLabelMAster from "../screen/Print Label/PrintLabelMAster";
import PrintLabel from "../screen/Print Label/PrintLabel";
import LabRequest from "../screen/Medical/LabRequest";
import BottomTabs from "./BottomTab";

import Taxonomy from "../screen/MasterComponents/Taxonomy";
import SpeciesMaster from "../screen/MasterComponents/SpeciesMaster";
import InstituteList from "../screen/Master/InstituteList";
import ListOfTransfers from "../screen/Animal_transfer/ListOfTransfers";
import AddUser from "../screen/User/AddUser";
import ActiveDiagnosis from "../screen/MedicalRecord/ActiveDiagnosis";
import LabTests from "../screen/MedicalRecord/LabTests";
import Prescriptions from "../screen/MedicalRecord/Prescriptions";
import MedicalRecord from "../screen/MedicalRecord/MedicalRecord";
import DiagnosisAnimal from "../screen/MedicalRecord/DiagnosisAnimals";
import PrescriptionAnimal from "../screen/MedicalRecord/PrescriptionAnimal";
import LabTestDetails from "../screen/MedicalRecord/LabTestDetails";
import RoleList from "../screen/Master/RoleList";
import MedicalRecordList from "../screen/MedicalRecord/MedicalRecordList";
import MedicalSummary from "../screen/MedicalRecord/MedicalSummary";
import EditUser from "../screen/User/EditUser";
import CommonAnimalSelect from "../components/CommonAnimalSelect";
import CommonAnimalSelectMedical from "../components/CommonAnimalSelectMedical";
import AnimalCard from "../components/AnimalCard";
import UserPassword from "../screen/User/UserPassword";
import PasscodeAuth from "../screen/LoginScreen/PasscodeAuth";
import ResetPasscode from "../screen/User/ResetPasscode";
import InsightsCardComp from "../components/InsightsCardComp";
import EditPermissions from "../screen/Staff Management/EditPermissions";
import LocationAccess from "../screen/Staff Management/LocationAccess";
import CreateRole from "../screen/Staff Management/CreateRole";
import EditRole from "../screen/Staff Management/EditRole";
import AccessSite from "../screen/Staff Management/AccessSite";
import SearchWithCheck from "../components/SearchWithCheck";
import MasterPermission from "../screen/Staff Management/MasterPermission";
import AnimalSearchScreen from "../screen/AnimalSearchScreen";
import MeasurementSummary from "../screen/Animals/MeasurementSummary";
import AfterCamScan from "../components/AfterCamScan";
import NewCamScanner from "../components/NewCamScanner";
import AddNecropcy from "../screen/Animals/AddNecropcy";
import AddOrganization from "../screen/Master/Organization/AddOrganization";
import OrganizationList from "../screen/Master/Organization/OrganizationList";
import AddOrganSelection from "../screen/Animals/AddOrganSelection";
import NecropsySummary from "../screen/Animals/NecropsySummary";
import EditNecropsy from "../screen/Animals/EditNecropsy";
import EditDisposition from "../screen/Animals/EditDisposition";
import Observation from "../screen/Observation/Observation";

import ObservationSummary from "../screen/Observation/ObservationSummary";
import ObservationList from "../screen/Observation/ObservationList";
import EditLocalIdentifier from "../screen/Animals/EditLocalIdentifier";
import Listing from "../screen/Listing/Listing";
import EditObservation from "../screen/Observation/EditObservation";
import ChatUserDetails from "../screen/ChatModule/screen/chatUserDetails";
import EditAdvice from "../screen/medicalMasters/EditAdvice";
import EditMedicalCaseType from "../screen/medicalMasters/EditMedicalCaseType";
import EditPrescriptionDosage from "../screen/medicalMasters/EditPrescriptionDosage";

import EditDiagnosis from "../screen/medicalMasters/EditDiagnosis";
import EditPrescription from "../screen/medicalMasters/EditPrescription";
import EditComplaints from "../screen/medicalMasters/EditComplaints";
import SelectContact from "../screen/ChatModule/screen/SelectContact";
import NewGroup from "../screen/ChatModule/screen/NewGroup";
import GroupDetails from "../screen/ChatModule/screen/GroupDetails";
import EditChatUserProfile from "../screen/ChatModule/screen/EditChatUserProfile";
import Edit from "../screen/ChatModule/screen/Edit";
import ChangeGroupName from "../screen/ChatModule/screen/ChangeGroupName";
import ChatSearch from "../screen/ChatModule/screen/chatSearch";
import LabTestSearch from "../screen/Medical/LabTestSearch";
import ProfileQr from "../screen/Staff Management/ProfileQr";
import Setings from "../screen/Staff Management/Setings";
import EditIdProof from "../screen/User/IdProof/EditIdProof";
import LatestCamScanner from "../components/LatestCamScanner";
import MoveSearchScreen from "../screen/Move_animal/SearchScreen";
import ListOfLabs from "../screen/Lab/ListOfLabs";
import LabAccess from "../screen/Staff Management/labAccess/LabAccess";
import AccessLab from "../screen/Staff Management/labAccess/AccessLab";
import AddLabForm from "../screen/Lab/AddLabForm";
import SiteDetails from "../screen/housing/SiteDetails";
import ListOfProduct from "../screen/Pharmacy/ListOfProduct";
import AddProductForm from "../screen/Pharmacy/AddProductForm";
import PharmacyAccess from "../screen/Staff Management/pharmacyAccess/pharmacyAccess";
import AccessPharmacy from "../screen/Staff Management/pharmacyAccess/AccessPharmacy";
import SearchManufacture from "../screen/Pharmacy/SearchManufacture";
import LabRequestsList from "../screen/Lab/LabRequestsList";
import LabRequestsFilter from "../screen/Lab/LabRequestsFilter";
import EditMedicines from "../screen/Pharmacy/EditMedicines";
import ObservationType from "../screen/Observation/ObservationType";
import List from "../screen/Pharmacy/List";
import AddMasterScreen from "../screen/Pharmacy/AddMasterScreen";
import AssignTo from "../screen/Observation/AssignTo";
import SearchUsers from "../screen/Observation/SearchUsers";
import MoveAnimal from "../screen/Move_animal/MoveAnimal";
import TransferQR from "../screen/Move_animal/TransferQR";
import TransferCheckList from "../screen/Move_animal/TransferCheckList";
import ApprovalSummary from "../screen/Approval/ApprovalSummary";
import TransferCheckListSummary from "../screen/Move_animal/TransferCheckListSummary";
import AddSupplier from "../screen/Pharmacy/AddSupplier";
import AddStore from "../screen/Pharmacy/AddStore";
import EditTemplate from "../screen/Observation/EditTemplate";
import EditMasterScreen from "../screen/Pharmacy/EditMasterScreen";
import StarredMessage from "../screen/ChatModule/screen/StarredMessage";
import ListingData from "../screen/Insights/Listing/ListingData";
import AnimalChecklist from "../components/Transfer/AnimalChecklist";
import ConfirmRide from "../components/Transfer/ConfirmRide";
import MortalityReason from "../screen/Mortality/mortalityReason";
import MortalityReasonSpecies from "../screen/Mortality/mortalityReasonSpecies";
import AllListingData from "../screen/AllListing/AllListingData";
import MortalitySpeciesReson from "../screen/Mortality/MortalitySpeciesReson";
import MortalitySpeciesResonList from "../screen/Mortality/MortalitySpeciesResonList";
import MortalityResonSpeciesList from "../screen/Mortality/MortalityResonSpeciesList";
import MortalityScreen from "../screen/Mortality/MortalityScreen";
import MortalityResonSpecies from "../screen/Mortality/MortalityResonSpecies";
import AddTemplate from "../screen/Observation/AddTemplate";
import SelectSection from "../screen/housing/selectSection";
import SelectEnclosure from "../screen/housing/selectEnclosure";
import CollectionSliderListing from "../screen/AllListing/CollectionSliderListing";
import AllocateAnimals from "../components/Transfer/AllocateAnimals";
import WebViewScreen from "../screen/Webscreen";
import AddDispenseMedicine from "../screen/DispenseMedicine/AddDispenseMedicine";
import MedicineList from "../screen/DispenseMedicine/MedicineList";
import DispenseList from "../screen/DispenseMedicine/DispenseList";
import DispenseSummary from "../screen/DispenseMedicine/DispenseSummary";
import MyJournal from "../screen/Staff Management/Journal/MyJournal";
import EditMedicalTempalte from "../screen/Medical/EditMedicalTempalte";
import DiagnoisiScreen from "../screen/MedicalRecord/DiagnoisiScreen";
// import DiagnosisActiveClose from "../screen/MedicalRecord/DiagnosisActiveClose";
import Assessment from "../screen/Assessment/Assessment";
import AddAssessmentType from "../screen/Assessment/AddAssessmentType";
import AssessemetTypeDetails from "../screen/Assessment/AssessemetTypeDetails";
import AssessmentTemplateDetails from "../screen/Assessment/AssessmentTemplateDetails";
import AddAssessmentTemplate from "../screen/Assessment/AddAssessmentTemplate";
import AddAssessmentTypeTemplate from "../screen/Assessment/AddAssessmentTypeTemplate";
import DiffPasscodeReset from "../screen/User/DiffPasscodeReset";
import AddTaxon from "../screen/Assessment/AddTaxon";
import SearchSpeciesScreen from "../screen/Assessment/SearchSpeciesScreen";
// import ByDiagnosisActiveClose from "../screen/MedicalRecord/ByDiagnosisActiveClose";
import { useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import LabTestScreen from "../screen/MedicalRecord/LabTestScreen";
import SpeciesLabTestAnimalsList from "../screen/MedicalRecord/SpeciesLabTestAnimalsList";
import ByMedicalLabTestAnimals from "../screen/MedicalRecord/ByMedicalLabTestAnimals";
import BySpeciesLabTestList from "../screen/MedicalRecord/BySpeciesLabTestList";
import NotesTypesList from "../screen/Master/NotesTypes/NotesTypesList";
import AddNotesType from "../screen/Master/NotesTypes/AddNotesType";
import SubTypesList from "../screen/Master/NotesTypes/SubTypesList";
import SickAnimalsList from "../screen/MedicalRecord/SickAnimalsList";
import SickSpeciesList from "../screen/MedicalRecord/SickSpeciesList";
import { AssessmentTable } from "../screen/Table";
import BySpeciesList from "../screen/MedicalRecord/BySpeciesList";
import EditNotesType from "../screen/Master/NotesTypes/EditNotesType";
import MedicalActiveCloseScreen from "../screen/MedicalRecord/MedicalActiveCloseScreen";
import AssessmentSummary from "../screen/Assessment/AssessmentSummary";
import ModalListing from "../screen/Listing/ModalListing";

const Stack = createStackNavigator();

const MainStackNavigation = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const horizontalAnimation = {
    gestureDirection: "horizontal",
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  };

  const config = {
    animation: "spring",
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#00B386",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Homes" component={DrawerNavigator} />
      <Stack.Screen name="HomeScreen" component={BottomTabs} />

      <Stack.Screen name="BottomTabNav" component={BottomTabNav} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="UserForm" component={UserForm} />
      <Stack.Screen name="AddStaff" component={AddUser} />
      {/* <Stack.Screen name="AddUser" component={AddUser} /> */}
      <Stack.Screen name="EditUser" component={EditUser} />
      <Stack.Screen name="EditTaxonomy" component={EditTaxonomy} />
      <Stack.Screen name="UserPassword" component={UserPassword} />
      <Stack.Screen name="ResetPasscode" component={ResetPasscode} />
      <Stack.Screen name="DiffPasscodeReset" component={DiffPasscodeReset} />
      <Stack.Screen name="ListStaff" component={ListStaff} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen name="UserIdForm" component={UserIdForm} />
      <Stack.Screen name="AddEncloser" component={EnclosureForm} />
      <Stack.Screen name="Education" component={Education} />
      <Stack.Screen name="WorkExperience" component={WorkExperience} />
      <Stack.Screen name="Enclosure" component={Enclosure} />
      <Stack.Screen name="AddDiagnosis" component={AddDiagnosis} />
      <Stack.Screen name="AddOrganization" component={AddOrganization} />
      <Stack.Screen name="NotesTypesList" component={NotesTypesList} />
      <Stack.Screen name="AddNotesType" component={AddNotesType} />
      <Stack.Screen name="EditNotesType" component={EditNotesType} />
      <Stack.Screen name="SubTypesList" component={SubTypesList} />
      <Stack.Screen name="OrganizationList" component={OrganizationList} />
      <Stack.Screen name="editDiagnosis" component={EditDiagnosis} />
      <Stack.Screen name="editPrescription" component={EditPrescription} />
      <Stack.Screen name="editComplaints" component={EditComplaints} />
      <Stack.Screen
        name="ManageAffectedParts"
        component={ManageAffectedParts}
      />
      <Stack.Screen name="AddFeedingFactors" component={AddFeedingFactors} />
      <Stack.Screen name="AddFeedingPlaters" component={AddFeedingPlaters} />
      <Stack.Screen name="AddMealSlots" component={AddMealSlots} />
      <Stack.Screen name="AddEnclosureType" component={AddEnclosureType} />
      <Stack.Screen name="AddFeedTypes" component={AddFeedTypes} />
      <Stack.Screen name="AddincidentType" component={AddincidentType} />
      <Stack.Screen name="AddTagAssign" component={TagAssign} />
      <Stack.Screen name="AddTag" component={AddTag} />
      <Stack.Screen name="AddTagGroup" component={AddTagGroup} />
      <Stack.Screen name="Foods" component={Foods} />
      <Stack.Screen name="Section" component={Section} />
      <Stack.Screen name="ListSection" component={ListSection} />
      <Stack.Screen name="SectionDetails" component={SectionDetails} />
      <Stack.Screen name="EditSection" component={EditSection} />
      <Stack.Screen name="ListingData" component={ListingData} />

      <Stack.Screen name="CreateZoo" component={CreateZoo} />
      <Stack.Screen name="EducationType" component={EducationType} />
      <Stack.Screen name="GetEducationType" component={GetEducationType} />
      <Stack.Screen name="empDepartment" component={EmpDepartment} />
      <Stack.Screen name="AddZooSite" component={CreateZooSite} />
      <Stack.Screen name="CreateZone" component={CreateZone} />
      <Stack.Screen name="ClientIdproof" component={ClientIdForm} />
      <Stack.Screen name="ListClientId" component={ListClientIdProof} />
      <Stack.Screen name="Department" component={Department} />
      <Stack.Screen name="AssignUserSite" component={AssignUserSite} />
      <Stack.Screen name="AssignUserSection" component={AssignUserSection} />
      <Stack.Screen name="GetClientidProof" component={GetClientidProof} />

      <Stack.Screen
        name="ShowPersonalDetails"
        component={ShowPersonalDetails}
      />
      <Stack.Screen name="departmentById" component={GetDeptItem} />
      <Stack.Screen name="Designation" component={Designation} />
      <Stack.Screen name="DesignationDetail" component={DesignationDetail} />
      <Stack.Screen name="CreateDesignation" component={CreateDesignation} />
      <Stack.Screen name="ZoneListByZooId" component={ZoneListByZooId} />

      <Stack.Screen name="ListDepartment" component={ListDepartment} />
      <Stack.Screen name="AddDepartment" component={AddDepartment} />

      <Stack.Screen name="CreateEnclosure" component={CreateEnclosure} />
      <Stack.Screen name="EnclosureEdit" component={EnclosureEdit} />

      <Stack.Screen name="EnclosureList" component={EnclosureList} />
      <Stack.Screen name="EnclosureDetails" component={EnclosureDetails} />
      <Stack.Screen name="AnimalMovement" component={AnimalMovement} />
      <Stack.Screen name="ListEggFertility" component={ListEggFertility} />
      <Stack.Screen name="AddEggFertility" component={AddEggFertility} />
      <Stack.Screen name="GetEggFertility" component={GetEggFertility} />
      <Stack.Screen name="MoveAnimal" component={MoveAnimal} />
      <Stack.Screen name="TransferQR" component={TransferQR} />
      <Stack.Screen name="AnimalChecklist" component={AnimalChecklist} />
      <Stack.Screen name="ConfirmRide" component={ConfirmRide} />
      <Stack.Screen name="AllocateAnimals" component={AllocateAnimals} />

      <Stack.Screen name="ListAccessionType" component={ListAccession} />
      <Stack.Screen name="Accession" component={Accession} />
      <Stack.Screen name="AddAccessionType" component={AddAccession} />
      <Stack.Screen name="GetAccessionType" component={GetAccession} />

      <Stack.Screen name="GetExperience" component={GetExperience} />
      <Stack.Screen name="AddExperience" component={AddExperience} />

      <Stack.Screen name="Listeducation" component={Listeducation} />
      <Stack.Screen name="CreateEducation" component={CreateEducation} />

      <Stack.Screen name="AddHatchedStatus" component={AddHatchedStatus} />
      <Stack.Screen
        name="ListAllHatchedStatus"
        component={ListAllHatchedStatus}
      />
      <Stack.Screen name="GetHatchedStatus" component={GetHatchedStatus} />

      <Stack.Screen name="GetSection" component={GetSection} />
      <Stack.Screen name="UserCreateSection" component={UserCreateSection} />

      <Stack.Screen name="CreateSite" component={CreateSite} />
      <Stack.Screen name="ListSite" component={ListSite} />

      <Stack.Screen name="AddIdProof" component={AddIdProof} />
      <Stack.Screen name="EditIdProof" component={EditIdProof} />
      <Stack.Screen name="EditAnimals" component={EditAnimals} />

      <Stack.Screen name="GetId" component={GetIdProof} />
      <Stack.Screen name="AddFeedLog" component={AddFeedLog} />
      <Stack.Screen name="master" component={Master} />
      <Stack.Screen name="EggsAddDynamicForm" component={EggsAddDynamicForm} />
      <Stack.Screen name="AnimalAddDynamicForm" component={AnimalAddForm} />
      <Stack.Screen name="AddAnimals" component={AnimalsAdd} />
      <Stack.Screen name="AnimalsDetails" component={AnimalsDetails} />
      <Stack.Screen name="MeasurementSummary" component={MeasurementSummary} />
      <Stack.Screen name="AnimalEdit" component={AnimalEdit} />

      <Stack.Screen name="AddDisposition" component={AddDisposition} />
      <Stack.Screen name="EditDisposition" component={EditDisposition} />

      <Stack.Screen name="LocalIdentifier" component={LocalIdentifier} />
      <Stack.Screen
        name="EditLocalIdentifier"
        component={EditLocalIdentifier}
      />
      <Stack.Screen name="AnimalModuleStats" component={AnimalModuleStats} />
      <Stack.Screen name="AnimalList" component={AnimalList} />
      <Stack.Screen name="DeletedAnimalList" component={DeletedAnimalList} />
      <Stack.Screen name="RoleList" component={RoleList} />
      <Stack.Screen name="EggsAddForm" component={EggsAddForm} />
      <Stack.Screen name="EditEggForm" component={EditEggForm} />
      <Stack.Screen name="EggDetails" component={EggDetails} />
      <Stack.Screen name="EggLists" component={EggLists} />
      <Stack.Screen name="Mortality" component={Mortality} />
      <Stack.Screen name="FilterScreen" component={FilterScreen} />

      <Stack.Screen name="MortalityAnimals" component={MortalityAnimals} />
      <Stack.Screen name="Collections" component={Collections} />
      <Stack.Screen name="OrderHierarchy" component={OrderHierarchy} />
      <Stack.Screen name="GenusHierarchy" component={GenusHierarchy} />
      <Stack.Screen name="FamilyHierarchy" component={FamilyHierarchy} />
      <Stack.Screen name="SpeciesHierarchy" component={SpeciesHierarchy} />
      <Stack.Screen name="SpeciesDetails" component={SpeciesDetails} />
      <Stack.Screen name="SelectSection" component={SelectSection} />
      <Stack.Screen name="SelectEnclosure" component={SelectEnclosure} />

      {/* Medical */}
      <Stack.Screen name="SickAnimalsList" component={SickAnimalsList} />
      <Stack.Screen name="SickSpeciesList" component={SickSpeciesList} />

      {/* for lab test follow */}
      <Stack.Screen name="LabTestScreen" component={LabTestScreen} />
      <Stack.Screen
        name="BySpeciesLabTestList"
        component={BySpeciesLabTestList}
      />
      <Stack.Screen
        name="SpeciesLabTestAnimalsList"
        component={SpeciesLabTestAnimalsList}
      />
      <Stack.Screen
        name="ByMedicalLabTestAnimals"
        component={ByMedicalLabTestAnimals}
      />

      <Stack.Screen name="DiagnoisiScreen" component={DiagnoisiScreen} />
      <Stack.Screen
        name="MedicalActiveCloseScreen"
        component={MedicalActiveCloseScreen}
      />
      <Stack.Screen name="BySpeciesList" component={BySpeciesList} />

      <Stack.Screen name="MedicalRecordList" component={MedicalRecordList} />
      <Stack.Screen name="AddMedical" component={AddMedical} />
      <Stack.Screen
        name="CaseType"
        component={CaseType}
        options={{
          transitionSpec: {
            open: horizontalAnimation,
            close: horizontalAnimation,
          },
        }}
      />
      <Stack.Screen
        name="Complaints"
        component={Complaints}
        options={{
          transitionSpec: {
            open: horizontalAnimation,
            close: horizontalAnimation,
          },
        }}
      />
      <Stack.Screen
        name="Diagnosis"
        component={Diagnosis}
        options={{
          transitionSpec: {
            open: horizontalAnimation,
            close: horizontalAnimation,
          },
        }}
      />
      <Stack.Screen
        name="Prescription"
        component={Prescription}
        options={{
          transitionSpec: {
            open: horizontalAnimation,
            close: horizontalAnimation,
          },
        }}
      />
      <Stack.Screen
        name="Advice"
        component={Advice}
        options={{
          transitionSpec: {
            open: horizontalAnimation,
            close: horizontalAnimation,
          },
        }}
      />
      <Stack.Screen
        name="LabRequest"
        component={LabRequest}
        options={{
          transitionSpec: {
            open: horizontalAnimation,
            close: horizontalAnimation,
          },
        }}
      />
      <Stack.Screen
        name="Notes"
        component={Notes}
        options={{
          transitionSpec: {
            open: horizontalAnimation,
            close: horizontalAnimation,
          },
        }}
      />
      <Stack.Screen
        name="FollowUpDate"
        component={FollowUpDate}
        options={{
          transitionSpec: {
            open: horizontalAnimation,
            close: horizontalAnimation,
          },
        }}
      />
      <Stack.Screen name="AnimalEnclosure" component={AnimalEnclosure} />
      <Stack.Screen name="ApprovalTask" component={ApprovalTask} />
      <Stack.Screen name="ApprovalSummary" component={ApprovalSummary} />
      <Stack.Screen name="ChatList" component={ChatsScreen} />
      <Stack.Screen name="Chats" component={ChatScreen} />
      <Stack.Screen
        name="EditChatUserProfile"
        component={EditChatUserProfile}
      />
      <Stack.Screen name="StarredMessage" component={StarredMessage} />
      <Stack.Screen name="ChatUserDetails" component={ChatUserDetails} />
      <Stack.Screen name="SelectContact" component={SelectContact} />
      <Stack.Screen name="NewGroup" component={NewGroup} />
      <Stack.Screen name="GroupDetails" component={GroupDetails} />
      <Stack.Screen name="Edit" component={Edit} />
      <Stack.Screen name="ChangeGroupName" component={ChangeGroupName} />
      <Stack.Screen name="ChatSearch" component={ChatSearch} />

      <Stack.Screen name="AnimalEditPage" component={AnimalEdit} />
      <Stack.Screen name="EditSite" component={EditSite} />
      <Stack.Screen name="Housing" component={Housing} />
      <Stack.Screen name="OccupantScreen" component={OccupantScreen} />
      <Stack.Screen name="HousingEnclosuer" component={HousingEnclouser} />
      <Stack.Screen name="AllListingData" component={AllListingData} />
      <Stack.Screen
        name="CollectionSliderListing"
        component={CollectionSliderListing}
      />

      <Stack.Screen
        name="SearchTransferanimal"
        component={SearchTransferanimal}
      />
      <Stack.Screen name="MoveToEnclosure" component={MoveToEnclosure} />
      <Stack.Screen name="InsightSearching" component={InsightSearching} />
      <Stack.Screen
        name="InchargeAndApproverSelect"
        component={InchargeAndApproverSelect}
      />
      <Stack.Screen name="CommonSearch" component={CommonSearch} />
      <Stack.Screen name="MoveSearchScreen" component={MoveSearchScreen} />
      <Stack.Screen name="LabTestSearch" component={LabTestSearch} />
      <Stack.Screen name="QRCodeScanner" component={NewCamScanner} />
      <Stack.Screen name="LatestCamScanner" component={LatestCamScanner} />

      {/* AfterCamScan */}
      <Stack.Screen name="AfterCamScan" component={AfterCamScan} />

      <Stack.Screen name="medicalMastersData" component={MedicalMaster} />
      <Stack.Screen name="InstituteList" component={InstituteList} />
      <Stack.Screen name="Taxonomy" component={Taxonomy} />
      <Stack.Screen name="SpeciesMaster" component={SpeciesMaster} />

      <Stack.Screen name="diagnosisList" component={DiagnosisList} />
      <Stack.Screen name="prescriptionList" component={PrescriptionList} />
      <Stack.Screen name="complaintsList" component={ComplaintsList} />
      <Stack.Screen name="medicalCaseType" component={CaseTypeList} />
      <Stack.Screen name="SearchWithCheck" component={SearchWithCheck} />

      <Stack.Screen
        name="prescriptionDosagesList"
        component={PrescriptionDosagesList}
      />
      <Stack.Screen name="medicalAdvicesList" component={MedicalAdvicesList} />
      <Stack.Screen name="adddiagnosis" component={AddDiagnosisData} />

      <Stack.Screen name="AddInstitute" component={AddInstitute} />

      <Stack.Screen name="addprescription" component={AddPrescription} />
      <Stack.Screen name="addcomplatins" component={AddComplaints} />
      <Stack.Screen
        name="addprescriptiondosage"
        component={AddPrescriptionDosage}
      />
      <Stack.Screen
        name="editprescriptiondosage"
        component={EditPrescriptionDosage}
      />

      <Stack.Screen name="addmedicalcasetype" component={AddMedicalCaseType} />
      <Stack.Screen
        name="editmedicalcasetype"
        component={EditMedicalCaseType}
      />
      <Stack.Screen name="addadvice" component={AddAdviceData} />
      <Stack.Screen name="editadvice" component={EditAdvice} />

      {/* Print Label */}
      <Stack.Screen name="PrintLabelMAster" component={PrintLabelMAster} />
      <Stack.Screen name="PrintLabel" component={PrintLabel} />

      {/* Animal Transfer */}
      <Stack.Screen name="AnimalTransfer" component={AnimalTransfer} />
      <Stack.Screen name="ListOfTransfers" component={ListOfTransfers} />
      <Stack.Screen name="MedicalRecord" component={MedicalRecord} />

      <Stack.Screen name="LabTests" component={LabTests} />
      <Stack.Screen name="Prescriptions" component={Prescriptions} />
      <Stack.Screen name="ActiveDiagnosis" component={ActiveDiagnosis} />

      <Stack.Screen name="DiagnosisAnimal" component={DiagnosisAnimal} />
      <Stack.Screen name="PrescriptionAnimal" component={PrescriptionAnimal} />

      <Stack.Screen name="LabTestDetails" component={LabTestDetails} />

      <Stack.Screen name="MedicalSummary" component={MedicalSummary} />

      {/* Common Animal Select */}
      <Stack.Screen name="CommonAnimalSelect" component={CommonAnimalSelect} />
      <Stack.Screen
        name="CommonAnimalSelectMedical"
        component={CommonAnimalSelectMedical}
      />
      <Stack.Screen name="AnimalCard" component={AnimalCard} />
      <Stack.Screen name="InsightsCardComp" component={InsightsCardComp} />
      <Stack.Screen name="EditPermissions" component={EditPermissions} />
      <Stack.Screen name="LocationAccess" component={LocationAccess} />
      <Stack.Screen name="LabAccess" component={LabAccess} />
      <Stack.Screen name="PharmacyAccess" component={PharmacyAccess} />
      <Stack.Screen name="CreateRole" component={CreateRole} />
      <Stack.Screen name="EditRole" component={EditRole} />
      <Stack.Screen name="AccessSite" component={AccessSite} />
      <Stack.Screen name="AccessLab" component={AccessLab} />
      <Stack.Screen name="AccessPharmacy" component={AccessPharmacy} />
      <Stack.Screen name="MasterPermission" component={MasterPermission} />
      <Stack.Screen name="AnimalSearchScreen" component={AnimalSearchScreen} />
      <Stack.Screen name="AddNecropasy" component={AddNecropcy} />
      <Stack.Screen name="NecropsySummary" component={NecropsySummary} />
      <Stack.Screen name="AddOrganSelection" component={AddOrganSelection} />
      <Stack.Screen name="Observation" component={Observation} />

      <Stack.Screen name="ObservationSummary" component={ObservationSummary} />
      <Stack.Screen name="ObservationList" component={ObservationList} />
      <Stack.Screen name="EditObservation" component={EditObservation} />
      <Stack.Screen name="EditNecropsy" component={EditNecropsy} />
      <Stack.Screen name="Listing" component={Listing} />
      <Stack.Screen name="ModalListing" component={ModalListing} />

      <Stack.Screen name="ProfileQr" component={ProfileQr} />
      <Stack.Screen name="Setings" component={Setings} />

      {/* Lab Module */}
      <Stack.Screen name="ListOfLabs" component={ListOfLabs} />
      <Stack.Screen name="LabRequestsList" component={LabRequestsList} />
      <Stack.Screen name="LabRequestsFilter" component={LabRequestsFilter} />
      <Stack.Screen name="AddLabForm" component={AddLabForm} />
      <Stack.Screen name="siteDetails" component={SiteDetails} />
      {/* Pharmacy */}
      <Stack.Screen name="ListOfProduct" component={ListOfProduct} />
      <Stack.Screen name="AddProductForm" component={AddProductForm} />
      <Stack.Screen name="SearchManufacture" component={SearchManufacture} />
      <Stack.Screen name="EditMedicines" component={EditMedicines} />
      <Stack.Screen name="observationtype" component={ObservationType} />

      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="AddMasterScreen" component={AddMasterScreen} />
      <Stack.Screen name="AssignTo" component={AssignTo} />
      <Stack.Screen name="Edittemplate" component={EditTemplate} />
      <Stack.Screen name="searchUsers" component={SearchUsers} />
      <Stack.Screen name="AddTemplate" component={AddTemplate} />

      {/* <Stack.Screen name="AddSupplier" component={AddSupplier} />
      <Stack.Screen name="AddStore" component={AddStore} /> */}

      {/* <Stack.Screen name="List" component={List} /> */}
      {/* <Stack.Screen name="AddMasterScreen" component={AddMasterScreen} />
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="AddMasterScreen" component={AddMasterScreen} />

      {/* Transfer */}
      <Stack.Screen name="TransferCheckList" component={TransferCheckList} />
      <Stack.Screen
        name="TransferCheckListSummary"
        component={TransferCheckListSummary}
      />
      {/* <Stack.Screen name="AddSupplier" component={AddSupplier} /> */}
      {/* <Stack.Screen name="AddStore" component={AddStore} /> */}
      <Stack.Screen name="EditMasterScreen" component={EditMasterScreen} />

      {/* Mortality */}
      <Stack.Screen name="MortalityReason" component={MortalityReason} />
      <Stack.Screen
        name="MortalityReasonSpecies"
        component={MortalityReasonSpecies}
      />

      <Stack.Screen name="MortalityScreen" component={MortalityScreen} />
      <Stack.Screen
        name="MortalitySpeciesReson"
        component={MortalitySpeciesReson}
      />
      <Stack.Screen
        name="MortalitySpeciesResonList"
        component={MortalitySpeciesResonList}
      />
      <Stack.Screen
        name="MortalityResonSpecies"
        component={MortalityResonSpecies}
      />
      <Stack.Screen
        name="MortalityResonSpeciesList"
        component={MortalityResonSpeciesList}
      />
      <Stack.Screen
        name="EditMedicalTempalte"
        component={EditMedicalTempalte}
      />

      <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
      <Stack.Screen
        name="AddDispenseMedicine"
        component={AddDispenseMedicine}
      />
      <Stack.Screen name="DispenseSummary" component={DispenseSummary} />
      <Stack.Screen name="DispenseList" component={DispenseList} />
      <Stack.Screen name="MedicineList" component={MedicineList} />
      <Stack.Screen name="MyJournal" component={MyJournal} />
      <Stack.Screen name="Assessment" component={Assessment} />
      <Stack.Screen name="AddAssessmentType" component={AddAssessmentType} />
      <Stack.Screen
        name="AssessmentDetails"
        component={AssessemetTypeDetails}
      />
      <Stack.Screen
        name="AssessmentTemplateDetails"
        component={AssessmentTemplateDetails}
      />
      <Stack.Screen
        name="AddAssessmentTemplate"
        component={AddAssessmentTemplate}
      />
      <Stack.Screen
        name="AddAssessmentTypeTemplate"
        component={AddAssessmentTypeTemplate}
      />
      <Stack.Screen name="AddTaxon" component={AddTaxon} />
      <Stack.Screen
        name="SearchSpeciesScreen"
        component={SearchSpeciesScreen}
      />
      <Stack.Screen name="AssessmentTable" component={AssessmentTable} />
      <Stack.Screen name="AssessmentSummary" component={AssessmentSummary} />
    </Stack.Navigator>
  );
};

export default MainStackNavigation;
