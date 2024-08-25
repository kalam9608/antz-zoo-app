// Author: Ganesh Aher
// Date: 02-05-2023
// work: 1.Design and impliment the edit API on Design.
//       2.disable only all the fiels when comes from Deleted Animal page  date: 30 May 2023

import React, { useEffect, useState, useCallback, useRef } from "react";
import Category from "../../components/DropDownBox";
import CustomForm from "../../components/CustomForm";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  BackHandler,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Divider, List, SegmentedButtons, TextInput } from "react-native-paper";
import InputBox from "../../components/InputBox";
import DatePicker from "../../components/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { listAccessionType } from "../../services/AccessionService";
import { GetEnclosure } from "../../services/FormEnclosureServices";
import {
  DeleteAnimal,
  RestoreAnimal,
  addAnimal,
  getAnimalConfigs,
  getAnimalMasterData,
  getDeleteReasonList,
} from "../../services/AnimalService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment from "moment";
import { getParentEnclosure, getTaxonomic } from "../../services/EggsService";
import Loader from "../../components/Loader";
import Colors from "../../configs/Colors";
import { AutoCompleteSearch } from "../../components/AutoCompleteSearch";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { animalEditData } from "../../services/AnimalService";
import {
  capitalize,
  checkPermissionAndNavigateWithAccess,
  ifEmptyValue,
} from "../../utils/Utils";
import RequestBy from "../../components/Move_animal/RequestBy";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  removeParentAnimal,
  setFatherAnimal,
  setMotherAnimal,
} from "../../redux/AnimalMovementSlice";
import FontSize from "../../configs/FontSize";
import { getOrganization } from "../../services/Organization";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { errorDailog, successDailog, warningDailog } from "../../utils/Alert";
import {
  OwnerShipList,
  instituteList,
} from "../../services/MedicalMastersService";
import Config, { AnimalStatsType } from "../../configs/Config";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import Spacing from "../../configs/Spacing";
import ModalFilterComponent, {
  ModalInputBox,
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import HounsingCard from "../../components/housing/HounsingCard";

const AnimalEdit = (props) => {
  const [deletes, setDeeltes] = useState(props.route.params?.deleted);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();
  const [isLoading, setLoding] = useState(false);
  const [value, setValue] = useState("single");
  const [alive, setAlive] = useState(
    props.route.params?.item?.is_alive == "1" ? true : false
  );
  const [animal_id, setAnimal_id] = useState(
    props.route.params?.item.animal_id ?? 0
  );
  const [accessionType, setAccessionType] = useState(
    props.route.params?.item.master_accession_type ?? ""
  );
  const [accessionTypeID, setAccessionTypeID] = useState(
    props.route.params?.item.accession_type ?? ""
  );
  const [isAcsnTypeMenuOpen, setIsAcsnTypeMenuOpen] = useState(false);
  const [accessionTypeData, setAccessionTypeData] = useState([]);
  const [accessionDate, setAccessionDate] = useState(
    props.route.params?.item.accession_date ?? null
  );

  const [institutionType, setInstitutionType] = useState(
    props.route.params?.item.institutes_label ?? ""
  );
  const [isInstituteTypeMenuOpen, setIsInstituteTypeMenuOpen] = useState(false);
  const [institutionTypeID, setInstitutionTypeID] = useState(
    props.route.params?.item.from_institution ?? null
  );
  const [institutionTypeData, setInstitutionTypeData] = useState([]);

  const [ownershipType, setOwnershipType] = useState(
    props.route.params?.item.ownership_terms_label ?? ""
  );
  const [isOwnershipTypeMenuOpen, setOwnershipTypeMenuOpen] = useState(false);
  const [OwnershipTypeID, setOwnershipTypeID] = useState(
    props.route.params?.item.ownership_term ?? null
  );
  const [ownershipTypeData, setOwnershipTypeData] = useState([]);
  const [species, setSpecies] = useState(
    props.route.params?.item.vernacular_name ??
      props.route.params?.item.complete_name ??
      ""
  );
  const [sepciesID, setSpeciesID] = useState(
    props.route.params?.item.taxonomy_id ?? ""
  );
  const [selectEnclosure, setSelectEnclosure] = useState(
    props.route.params?.item.user_enclosure_name ?? ""
  );
  const [selectEnclosureID, setSelectEnclosureID] = useState(
    props.route.params?.item.enclosure_id ?? ""
  );
  const [selectEnclosureData, setSelectEnclosureData] = useState([]);
  const [isSelectEnclosure, setIsSelectEnclosure] = useState(false);
  const [selectSexType, setSelectSexType] = useState(
    capitalize(props.route.params?.item.sex) ?? ""
  );
  const [selectSexTypeID, setSelectSexTypeID] = useState(
    props.route.params?.item.sex ?? ""
  );
  const [selectOrganizationType, setSelectOrganizationType] = useState(
    props.route.params?.item?.organization_name ?? ""
  );
  const [selectOrganizationTypeID, setSelectOrganizationTypeID] = useState(
    props.route.params?.item?.organization_id ?? ""
  );
  const [isSelectOrganizationType, setIsSelectOrganizationType] =
    useState(false);
  const [selectOrganizationTypeData, setSelectOrganizationTypeData] = useState(
    []
  );
  const [selectSexTypeData, setSelectSexTypeData] = useState([
    {
      id: "male",
      name: "MALE",
      isSelect: "male" == props.route.params?.item.sex ? true : false,
    },
    {
      id: "female",
      name: "FEMALE",
      isSelect: "female" == props.route.params?.item.sex ? true : false,
    },
    {
      id: "indeterminate",
      name: "INDETERMINATE",
      isSelect: "indeterminate" == props.route.params?.item.sex ? true : false,
    },
    {
      id: "undetermined",
      name: "UNDETERMINED",
      isSelect: "undetermined" == props.route.params?.item.sex ? true : false,
    },
  ]);
  const [isSelectSexType, setIsSelectSexType] = useState(false);
  const [selectCollectionType, setSelectCollectionType] = useState(
    props.route.params?.item.master_collection_type ?? ""
  );
  const [selectCollectionTypeID, setSelectCollectionTypeID] = useState(
    props.route.params?.item.collection_type ?? ""
  );
  const [selectCollectionTypeData, setSelectCollectionTypeData] = useState([]);
  const [isSelectCollectionType, setIsSelectCollectionType] = useState(false);
  const [birthDate, setBirthDate] = useState(
    props.route.params?.item.birth_date ?? null
  );
  const [dateComponent, setDateComponent] = useState();
  const [age, setAge] = useState("");

  const [isMother, setIsMother] = useState(false);
  const [genderMother, setGenderMother] = useState("");
  const [genderMotherId, setGenderMotherId] = useState("");
  const [Mother, setMother] = useState([]);

  const [isFather, SetIsFather] = useState(false);
  const [genderFather, setGenderFather] = useState("");
  const [genderFatherId, setGenderFatherId] = useState("");
  const [Father, setFather] = useState([]);

  const [selectIdentifierType, setSelectIdentifierType] = useState(
    props.route.params?.item.label ?? ""
  );

  const [selectIdentifierTypeID, setSelectIdentifierTypeID] = useState(
    props.route.params?.item.local_id_type ?? ""
  );
  const [selectIdentifierTypeData, setSelectIdentifierTypeData] = useState([]);
  const [isSelectIdentifierType, setIsSelectIdentifierType] = useState(false);
  const [localIdentifier, setLocalIdentifier] = useState(
    props.route.params?.item.local_id ?? null
  );
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  // update: by md kalam ansari , add the minus plus icon insted of arrow dropdown icons
  const [expanded, setExpanded] = React.useState({
    Basic: false,
    Additional: false,
  });
  const destination =
    useSelector((state) => state.AnimalMove.destination) ??
    props?.route?.params?.item;
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [motherData, setMotherData] = useState(false);
  const [fatherData, setFatherData] = useState(false);
  const [isfatherParent, setIsfatherParent] = useState(false);
  const [parentMother, setParentMother] = useState(
    props?.route?.params?.item?.parents?.parent_female?.length > 0
      ? props?.route?.params?.item?.parents?.parent_female[0]
      : null
  );

  const [parentFather, setParentFather] = useState(
    props?.route?.params?.item?.parents?.parent_male?.length > 0
      ? props?.route?.params?.item?.parents?.parent_male
      : []
  );

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("Choose Reason");
  const [reasonId, setReasonId] = useState(null);
  const [isReasonModal, setIsReasonModal] = useState(false);
  const [reasonData, setReasonData] = useState([]);

  const motherAnimal = useSelector((state) => state.AnimalMove.motherAnimal);

  const fatherAnimal = useSelector((state) => state.AnimalMove.fatherAnimal);

  useFocusEffect(
    React.useCallback(() => {
      if (Object.keys(motherAnimal).length > 0) {
        setParentMother(motherAnimal);
        dispatch(setMotherAnimal({}));
      }
      return () => {};
    }, [JSON.stringify(motherAnimal)])
  );

  const toggleReasonModal = () => {
    setIsReasonModal(!isReasonModal);
  };
  const closeReasonModal = () => {
    setIsReasonModal(false);
  };
  const closeMenuReason = (item) => {
    setReason(item.name);
    setReasonId(item.id);
    setIsReasonModal(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (Object.keys(fatherAnimal).length > 0) {
        let data = [...parentFather, ...fatherAnimal];
        let filtered_input = data.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.animal_id === value.animal_id)
        );
        setParentFather(filtered_input);
        dispatch(setFatherAnimal({}));
      }
      return () => {};
    }, [JSON.stringify(fatherAnimal)])
  );

  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  const permission = useSelector((state) => state.UserAuth.permission);

  // lifestage ,sexing types data state ============================

  const [animalLifeStageData, setAnimalLifeStageData] = useState([]);
  const [animalSexingData, setAnimalSexingData] = useState([]);
  const [animalContraceptionData, setAnimalContraceptionData] = useState([]);
  // For Sexting type modal
  const [selectedCheckBox, setselectedCheckBox] = useState(null);
  const [animalEditModal, setAnimalEditModal] = useState(false);
  const [sexingType, setSexingType] = useState(
    props.route.params?.item.sexing_type ?? ""
  );
  const [sexingTypeId, setSexingTypeId] = useState(
    props.route.params?.item.sexing_type_id ?? ""
  );

  // For Life Stage modal  ===============================
  const [selectedLifeStageBox, setselectedLifeStageBox] = useState(null);
  const [animalLifeStagetModal, setAnimalLifeStageModal] = useState(false);
  const [lifeStageName, setLifeStageName] = useState(
    props.route.params?.item.life_stage_name ?? ""
  );
  const [lifeStageNameId, setLifeStageNameId] = useState(
    props.route.params?.item.life_stage_id ?? ""
  );

  // For Contraception type modal  =========================
  const [selectedContraceptionBox, setselectedContraceptionBox] =
    useState(null);
  const [ContraceptionModal, setContraceptionModal] = useState(false);
  const [ContraceptionName, setContraceptionName] = useState(
    props.route.params?.item.contraception_status ?? ""
  );
  const [ContraceptionNameId, setContraceptionNameId] = useState(
    props.route.params?.item.contraception_status_id ?? ""
  );

  // For Dialouge type modal  =========================
  const [isModalVisible, setModalVisible] = useState(false);
  const [DialougeTitle, setDialougeTitle] = useState("");
  const [type, setType] = useState("");

  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const confirmButtonPress = () => {
    // if (type == "animalEdit") {
    //   navigation.goBack();
    //   alertModalClose();
    // } else
    if (type == "animalDelete") {
      getDeleteData();
      alertModalClose();
    } else if (type == "restoreAnimal") {
      RestoreAnimalDataFunc();
      alertModalClose();
    } else if (type == "backConfirmation") {
      navigation.goBack();
      alertModalClose();
    }
  };

  const cancelButtonPress = () => {
    alertModalClose();
  };

  // institution list and OwnerShipList api  call********
  useEffect(() => {
    const getRefreshData = async () => {
      try {
        const res = await instituteList(zooID);
        setInstitutionTypeData(
          res.data.map((item) => {
            return {
              id: item.id,
              name: item.label,
              isSelect: institutionTypeID == item.id ? true : false,
            };
          })
        );
      } catch (err) {
        showToast("error", "Oops! Something went wrong!");
      }
    };
    const getOwnershipData = async () => {
      try {
        const res = await OwnerShipList(zooID);
        setOwnershipTypeData(
          res.data.map((item) => {
            return {
              id: item.id,
              name: item.label,
              isSelect: OwnershipTypeID == item.id ? true : false,
            };
          })
        );
      } catch (err) {
        showToast("error", "Oops! Something went wrong!");
      } finally {
      }
    };
    getRefreshData();
    getOwnershipData();
  }, []);
  const SetAcsnTypeDropDown = () => {
    setIsAcsnTypeMenuOpen(!isAcsnTypeMenuOpen);
    setIsSelectEnclosure(false);
    setIsSelectSexType(false);
    setIsSelectCollectionType(false);
    setIsSelectOrganizationType(false);
  };
  const SetInstituteTypeDropDown = () => {
    setIsInstituteTypeMenuOpen(!isInstituteTypeMenuOpen);
    setIsSelectSexType(false);
    setIsSelectCollectionType(false);
    setIsSelectOrganizationType(false);
  };
  const SetOwnershipTypeDropDown = () => {
    setOwnershipTypeMenuOpen(!isOwnershipTypeMenuOpen);
    setIsSelectSexType(false);
    setIsSelectCollectionType(false);
    setIsSelectOrganizationType(false);
  };

  const accessPressed = (item) => {
    setIsAcsnTypeMenuOpen(!isAcsnTypeMenuOpen);
    setAccessionType(item.name);
    setAccessionTypeID(item.id);
    // accessiondatePicker.current.focus();
    setInstitutionType("");
    setInstitutionTypeID(null);
  };
  const isSelectedAcsnTypePressed = (id) => {
    return accessionTypeID == id;
  };

  const institutePressed = (item) => {
    setIsInstituteTypeMenuOpen(!isInstituteTypeMenuOpen);
    setInstitutionType(item.name);
    setInstitutionTypeID(item.id);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    datePicker1Ref.current.focus();*/
    }
  };

  const isSelectedInstituteTypePressed = (id) => {
    return institutionTypeID == id;
  };
  const OwnershipPressed = (item) => {
    setOwnershipTypeMenuOpen(!isOwnershipTypeMenuOpen);
    setOwnershipType(item.name);
    setOwnershipTypeID(item.id);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    datePicker1Ref.current.focus();*/
    }
  };
  const isSelectedOwnershipPressed = (id) => {
    return OwnershipTypeID == id;
  };
  const acsnClose = () => {
    setIsAcsnTypeMenuOpen(false);
  };
  const InstiClose = () => {
    setIsInstituteTypeMenuOpen(false);
  };
  const OwnershipClose = () => {
    setOwnershipTypeMenuOpen(false);
  };

  const getAccessionDate = (date) => {
    setAccessionDate(date);
  };

  const catTaxonomydata = (item) => {
    if (item) {
      setSpecies(item.title);
      setSpeciesID(item.id);
      // handleSubmitFocus(enclRef);
    }
  };

  const SetSelectEncDropDown = () => {
    setIsSelectEnclosure(!isSelectEnclosure);
    setIsAcsnTypeMenuOpen(false);
    setIsSelectSexType(false);
    setIsSelectCollectionType(false);
    setIsSelectOrganizationType(false);
  };
  const OrganizationPressed = (item) => {
    setIsSelectOrganizationType(!isSelectOrganizationType);
    setSelectOrganizationType(item.name);
    setSelectOrganizationTypeID(item.id);
    // fifthOneOpen();
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    handleSubmitFocus(collectionRef)*/
    }
  };
  const isSelectedOrgnizationPressed = (id) => {
    return selectOrganizationTypeID == id;
  };
  const enclosurePressed = (item) => {
    setIsSelectEnclosure(!isSelectEnclosure);
    setSelectEnclosure(item.map((value) => value.name).join(","));
    setSelectEnclosureID(item.map((value) => value.id).join(","));
    // sexRef.current.focus();
  };
  const encClose = () => {
    setIsSelectEnclosure(false);
  };
  const SetSexTypeDropDown = () => {
    setIsSelectSexType(!isSelectSexType);
    setIsSelectEnclosure(false);
    setIsAcsnTypeMenuOpen(false);
    setIsSelectCollectionType(false);
    setIsSelectOrganizationType(false);
  };
  // const sexTypePressed = (item) => {
  //   setIsSelectSexType(!isSelectSexType);
  //   setSelectSexType(item.map((value) => value.name).join(","));
  //   setSelectSexTypeID(item.map((value) => value.id).join(","));
  //   // collectionRef.current.focus();
  // };
  const sexTypePressed = (item) => {
    setIsSelectSexType(!isSelectSexType);
    setSelectSexTypeID(item.id);
    setSelectSexType(item.name);
  };
  const sexClose = () => {
    setIsSelectSexType(false);
  };
  const isSelectedSexTypePressed = (id) => {
    return selectSexTypeID == id;
  };

  const getBirthDate = (birthDate) => {
    const todayDate = new Date();

    if (accessionDate < birthDate) {
      errorToast(
        "error",
        "Oops! You can't select accession date before birth date"
      );
      setAccessionDate(birthDate);
    } else {
      setAccessionDate(accessionDate);
    }
    if (todayDate < birthDate) {
      setIsError({ birthDate: true });
      setErrorMessage({
        birthDate: "Birth Date Can Not Be Greater Than Today Date",
      });
    } else {
      setBirthDate(birthDate);
      setIsError({ birthDate: false });
      setErrorMessage({ birthDate: "" });
    }

    const age = moment(todayDate).diff(moment(birthDate), "days");
    setAge(String(age));
    setDateComponent("days");
  };

  const handleAge = (age) => setAge(age);

  const handleDate = (dateComponent, value) => {
    setAge(value);
    setDateComponent(dateComponent);

    const birthDate = moment()
      .subtract(value, dateComponent)
      .format("YYYY-MM-DD");
    setBirthDate(birthDate);
  };

  const SetCollectionTypeDown = () => {
    setIsSelectCollectionType(!isSelectCollectionType);
    setIsSelectSexType(false);
    setIsSelectEnclosure(false);
    setIsAcsnTypeMenuOpen(false);
    setIsSelectOrganizationType(false);
  };
  const organizationClose = () => {
    setIsSelectOrganizationType(false);
  };
  const SetOrganizationDown = () => {
    setIsSelectOrganizationType(!isSelectOrganizationType);
    setIsSelectCollectionType(false);
    setIsSelectSexType(false);
    setIsSelectEnclosure(false);
    setIsAcsnTypeMenuOpen(false);
  };

  const collectionTypePressed = (item) => {
    setIsSelectCollectionType(!isSelectCollectionType);
    setSelectCollectionType(item.name);
    setSelectCollectionTypeID(item.id);
  };
  const isSelectedCollectionPressed = (id) => {
    return selectCollectionTypeID == id;
  };
  const collectionTypeClose = () => {
    setIsSelectCollectionType(false);
  };

  //   this function is used for local identifier type ==============  //

  const identifierTypePressed = (item) => {
    setSelectIdentifierTypeID(item.id);
    setSelectIdentifierType(item.name);
    setIsSelectIdentifierType(!isSelectIdentifierType);
  };

  const isSelectedidentifierTypePressed = (id) => {
    return selectIdentifierTypeID == id;
  };

  const SetIdentifierTypeDown = () => {
    setIsSelectIdentifierType(!isSelectIdentifierType);
  };

  const identifierTypeClose = () => {
    setIsSelectIdentifierType(false);
  };

  //this function the Mother DropDwon
  const SetIsMotherDown = () => {
    setIsMother(!isMother);
    setIsSelectEnclosure(false);
    SetIsFather(false);
  };

  const catMotherdata = (item) => {
    // setIsMother(!isMother)
    setGenderMother(item.map((value) => value.name).join(","));
    setGenderMotherId(item.map((value) => value.id).join(","));
    IsmotherClose();
    // fatherdropdownOpen();
    // maleRef.current.focus();
  };

  const IsmotherClose = () => {
    setIsMother(false);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    fatherdropdownOpen();*/
    }
  };

  //this function the Father DropDwon
  const SetIsFatherDown = () => {
    SetIsFather(!isFather);
    setIsMother(false);
    setIsSelectEnclosure(false);
  };

  const catFatherdata = (item) => {
    setGenderFather(item.map((value) => value.name).join(","));
    setGenderFatherId(item.map((value) => value.id).join(","));
  };

  const IsFatherClose = () => {
    SetIsFather(false);
  };

  const validation = () => {
    if (accessionType.length === 0) {
      setIsError({ accessionType: true });
      setErrorMessage({ accessionType: "Select Accession Type" });
      return false;
    } else if (
      accessionType == "From Institution" &&
      institutionType.length === 0
    ) {
      setIsError({ institutionType: true });
      setErrorMessage({ institutionType: "Select Institution Type" });
      return false;
    } else if (species.length === 0) {
      setIsError({ species: true });
      setErrorMessage({ species: "Select Taxonomy" });
      return false;
    } else if (!destination?.enclosure_id) {
      setIsError({ selectEnclosure: true });
      setErrorMessage({ selectEnclosure: "Select Enclosure" });
      return false;
    } else if (value === "single" && selectSexType.length === 0) {
      setIsError({ selectSexType: true });
      setErrorMessage({ selectSexType: "Select Sex Type" });
      return false;
    } else if (selectCollectionType.length === 0) {
      setIsError({ selectCollectionType: true });
      setErrorMessage({ selectCollectionType: "Select Collection Type" });
      return false;
    } else if (selectIdentifierType !== "" && !localIdentifier) {
      setIsError({ localIdentifier: true });
      setErrorMessage({ localIdentifier: "This field is required" });
      return false;
    } else if (accessionType == "House Breeding" && !birthDate) {
      setExpanded({ Additional: true });
      setIsError({ birthDate: true });
      setErrorMessage({
        birthDate: "Select Birth Date",
      });

      return false;
    }
    //  else if (selectOrganizationType.length === 0) {
    //   setIsError({ selectOrganizationType: true });
    //   setErrorMessage({ selectOrganizationType: "Select Organization " });
    //   return false;
    // }
    // else if (Object.keys(parentMother).length === 0) {
    //   setIsError({ genderMother: true });
    //   setErrorMessage({ genderMother: "Select Parent Mother" });
    //   return false;
    // }else if (Object.keys(parentFather).length === 0) {
    //   setIsError({ genderFather: true });
    //   setErrorMessage({ genderFather: "Select Parent Father" });
    //   return false;
    // }
    return true;
  };

  useEffect(() => {
    if (
      species ||
      accessionType ||
      institutionType ||
      destination?.enclosure_id ||
      selectSexType ||
      selectCollectionType ||
      birthDate ||
      localIdentifier
    ) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [
    species,
    accessionType,
    institutionType,
    destination?.enclosure_id,
    selectSexType,
    selectCollectionType,
    birthDate,
    localIdentifier,
  ]);

  const removeOrganization_id = (obj) => {
    if (selectOrganizationTypeID == "") {
      delete obj["organization_id"];
    }
  };
  const editAnimalData = () => {
    setIsError({});
    setErrorMessage({});
    if (validation()) {
      let requestObject = {
        from_institution: institutionTypeID,
        ownership_term: OwnershipTypeID,
        accession_type: accessionTypeID,
        accession_date: accessionDate
          ? moment(accessionDate).format("YYYY-MM-DD")
          : null,
        taxonomy_id: sepciesID,
        enclosure_id: destination?.enclosure_id,
        sex: selectSexTypeID,
        collection_type: selectCollectionTypeID,
        birth_date: birthDate ? moment(birthDate).format("YYYY-MM-DD") : null,
        age: dateComponent,
        local_id_type: selectIdentifierTypeID,
        local_id: localIdentifier,
        description: "Upadate Animal",
        organization_id: selectOrganizationTypeID,
        id: animal_id,
        zoo_id: zooID,
        parent_female: parentMother?.animal_id ? parentMother?.animal_id : "",
        parent_male:
          parentFather?.length > 0
            ? parentFather.map((value) => value.animal_id).join(",")
            : "",
        sexing_type: sexingTypeId,
        life_stage: lifeStageNameId,
        contraception_type: ContraceptionNameId,
      };
      setLoding(true);
      removeOrganization_id(requestObject);
      animalEditData(requestObject)
        .then((res) => {
          if (res?.success) {
            successToast("Success ", res.message);
            navigation.goBack();
            dispatch(removeParentAnimal());
          } else {
            // warningDailog(
            //   "Oops!!",
            //   res?.message,
            //   "Go Back",
            //   () => navigation.goBack(),
            //   "Cancel"
            // );
            // setDialougeTitle(res?.message);
            // setType("animalEdit");
            // alertModalOpen();
            warningToast("Oops!!", res?.message);
          }
        })
        .catch((err) => {
          showToast("error", "Oops! Something went wrong!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  useEffect(() => {
    const getAnimalMaster = async () => {
      try {
        const res = await getAnimalMasterData(zooID);
        setAnimalLifeStageData(
          res.data.life_stage.map((item) => ({
            id: item.id,
            name: item.name,
            isSelect: item.id == lifeStageNameId ? true : false,
          }))
        );
        setAnimalSexingData(
          res.data.sexing_types.map((item) => ({
            id: item.id,
            name: item.name,
            isSelect: item.id == sexingTypeId ? true : false,
          }))
        );
        setAnimalContraceptionData(
          res.data.contraception_status.map((item) => ({
            id: item.id,
            name: item.name,
            isSelect: item.id == ContraceptionNameId ? true : false,
          }))
        );
      } catch (err) {
        showToast("error", "Oops! Something went wrong!");
      } finally {
      }
    };
    getAnimalMaster();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
    });
    return unsubscribe;
  }, [navigation, value, accessionType]);

  const getData = () => {
    setLoding(true);

    let postData = {
      zoo_id: zooID,
    };
    Promise.all([
      listAccessionType(),
      GetEnclosure(postData),
      getAnimalConfigs(),
      getOrganization(zooID),
    ])
      .then((res) => {
        if (birthDate) {
          getBirthDate(moment(birthDate));
        }
        setAccessionTypeData(
          res[0].data.map((item) => ({
            id: item.accession_id,
            name: item.accession_type,
            isSelect: item.accession_id == accessionTypeID ? true : false,
          }))
        );
        setSelectEnclosureData(
          res[1].data.map((item) => ({
            id: item.enclosure_id,
            name: item.user_enclosure_name,
            isSelect: item.enclosure_id == selectEnclosureID ? true : false,
          }))
        );
        setSelectCollectionTypeData(
          res[2].data.collection_type.map((item) => ({
            id: item.id,
            name: item.label,
            isSelect: item.id == selectCollectionTypeID ? true : false,
          }))
        );
        setSelectIdentifierTypeData(
          res[2].data.animal_indetifier.map((item) => ({
            id: item.id,
            name: item.label,
            isSelect: item.id == selectIdentifierTypeID ? true : false,
          }))
        );
        setSelectOrganizationTypeData(
          res[3]?.map((item) => ({
            id: item?.id,
            name: item?.organization_name,
            isSelect: item.id == selectOrganizationTypeID ? true : false,
          }))
        );
      })
      .catch((err) => {
        showToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoding(false);
        // handleSubmitFocus("accessRef");
      });
  };

  const accessRef = useRef(null);
  const instituRef = useRef(null);
  const ownerShipRef = useRef(null);
  const accessiondatePicker = useRef(null);
  const taxonomyRef = useRef(null);
  const enclRef = useRef(null);
  const organizationRef = useRef(null);
  const sexRef = useRef(null);
  const collectionRef = useRef(null);

  const identifierTypeRef = useRef(null);
  const localIdentifierRef = useRef(null);

  const handleSubmitFocus = (refs, time) => {
    if (time) {
      setTimeout(() => {
        if (refs.current) {
          refs.current.focus();
        }
      }, time);
    } else {
      if (refs.current) {
        refs.current.focus();
      }
    }
  };
  const thirdOneOpen = () => {
    setIsSelectEnclosure(true);
  };
  const forthOneOpen = () => {
    if (value == "batch") {
      fifthOneOpen();
    } else {
      setIsSelectSexType(true);
    }
  };
  const fifthOneOpen = () => {
    setIsSelectCollectionType(true);
  };

  const dropdownOff = () => {
    setIsAcsnTypeMenuOpen(false);
    setIsSelectEnclosure(false);
    setIsSelectSexType(false);
    setIsSelectCollectionType(false);
    setIsSelectIdentifierType(false);
    setIsSelectOrganizationType(false);
  };

  const DeleteAnimalData = () => {
    const accessValue = checkPermissionAndNavigateWithAccess(
      permission,
      "collection_animal_record_access",
      null,
      null,
      null,
      "DELETE"
    );

    if (accessValue) {
      setDialougeTitle("Do you want to delete this animal?");
      setType("animalDelete");
      alertModalOpen();
    } else {
      warningToast("Restricted", "You do not have permission to access!!");
    }
  };

  const DeleteAnimalDataFunc = () => {
    setShowReasonModal(false);
    let obje = {
      animal_id: animal_id,
      reason: reason,
      description: description,
    };
    setLoding(true);
    DeleteAnimal(obje)
      .then((res) => {
        setLoding(false);
        if (res.success) {
          showToast("success", res.message);
          setTimeout(() => {
            navigation.navigate("AnimalList", {
              type: AnimalStatsType.deletedAnimals,
              name: "Deleted Animals",
            });
          }, 500);
        } else {
          // errorToast("Can not delete animal " + res.message);
          showToast("error", "Can not delete animal " + res.message);
        }
      })
      .catch((err) => {
        setLoding(false);
        showToast("error", "Oops! Something went wrong!");
      });
  };

  const getDeleteData = () => {
    setLoding(true);
    getDeleteReasonList()
      .then((res) => {
        setReasonData(res.data);
        setReason("Choose Reason");
        setDescription("");
        setReasonId("");
        setLoding(false);
        setShowReasonModal(true);
      })
      .catch((err) => {
        setLoding(false);
      });
  };

  const RestoreAnimalData = () => {
    setDialougeTitle("Do you want to restore this animal?");
    setType("restoreAnimal");
    alertModalOpen();
  };

  const gotoSelectScreen = () => {
    navigation.navigate("SearchTransferanimal", {
      type: "Select",
    });
  };

  const RestoreAnimalDataFunc = (id) => {
    let obje = {
      animal_id: animal_id,
    };
    setLoding(true);
    RestoreAnimal(obje)
      .then((res) => {
        setLoding(false);

        if (res.success) {
          showToast("success", res.message);
          setTimeout(() => {
            navigation.navigate("AnimalList", {
              name: "All Animals",
              type: AnimalStatsType.allAnimals,
            });
          }, 500);
        } else {
          showToast("error", "Can not restore animal " + res.message);
        }
      })
      .catch((err) => {
        setLoding(false);
        showToast("error", "Oops! Something went wrong!");
      });
  };
  const gotoSearchScreenMother = (type) => {
    navigation.navigate("CommonAnimalSelect", {
      type,
      animal_idToFilter: animal_id,
    });
    setMotherData(true);
  };
  const gotoSearchScreenFather = (type, limit) => {
    setFatherData(true);
    navigation.navigate("CommonAnimalSelect", {
      type,
      limit,
      animal_idToFilter: animal_id,
    });
  };

  useEffect(() => {
    const backAction = () => {
      // warningDailog(
      //   "Confirmation",
      //   "Are you sure you want to go back?",
      //   "YES",
      //   () => navigation.goBack(),
      //   "NO"
      // );

      setDialougeTitle("Are you sure you want to go back?");
      setType("backConfirmation");
      alertModalOpen();

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  const closeMenu = (item) => {
    setselectedCheckBox(item.id);
    setSexingType(item.name);
    setSexingTypeId(item?.id);
    closePrintModal();
  };

  const togglePrintModal = () => {
    setAnimalEditModal(!animalEditModal);
  };
  const closePrintModal = () => {
    setAnimalEditModal(false);
  };
  const isSelectedId = (id) => {
    return selectedCheckBox == id;
  };

  // For Life Stage modal

  const closeLifeStageMenu = (item) => {
    setselectedLifeStageBox(item.id);
    setLifeStageName(item.name);
    setLifeStageNameId(item?.id);
    closeLifeStageModal();
  };

  const toggleLifeStageModal = () => {
    setAnimalLifeStageModal(!animalLifeStagetModal);
  };
  const closeLifeStageModal = () => {
    setAnimalLifeStageModal(false);
  };
  const isSelectedLifeStageId = (id) => {
    return selectedLifeStageBox == id;
  };

  const closeContraceptionMenu = (item) => {
    setselectedContraceptionBox(item.id);
    setContraceptionName(item?.name);
    setContraceptionNameId(item?.id);
    closeContraceptionModal();
  };

  const toggleContraceptionModal = () => {
    setContraceptionModal(!ContraceptionModal);
  };
  const closeContraceptionModal = () => {
    setContraceptionModal(false);
  };
  const isSelectedContraceptionId = (id) => {
    return selectedContraceptionBox == id;
  };
  const isSelectedReasonId = (id) => {
    return reasonId == id;
  };
  return (
    <>
      <Loader visible={isLoading} />

      <CustomForm
        header={true}
        title={"Edit Animal"}
        marginBottom={60}
        // onPress={handleOnPress}
        onPress={editAnimalData}
        deletes={deletes}
        deleteButton={
          props.route.params?.deleted ? RestoreAnimalData : DeleteAnimalData
        }
        firstTitle={props.route.params?.deleted ? "Restore" : null}
        deleteTitle={"Animal"}
      >
        <List.Section>
          <List.Accordion
            title="Basic Information"
            id="1"
            titleStyle={{
              color: constThemeColor.onSecondaryContainer,
              fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              marginLeft: -8,
            }}
            style={{
              backgroundColor: constThemeColor.onPrimary,
              marginRight: -16,
            }}
            right={(props) =>
              !expanded.Basic ? (
                <List.Icon {...props} icon="minus" />
              ) : (
                <List.Icon {...props} icon="plus" />
              )
            }
            expanded={!expanded.Basic}
            onPress={() =>
              setExpanded((prevState) => ({
                ...prevState,
                Basic: !expanded.Basic,
              }))
            }
          >
            <View style={{ marginBottom: 15 }}>
              {/* <View> */}
              <InputBox
                inputLabel={"Accession Type*"}
                placeholder={"Choose accession"}
                editable={false}
                edit={deletes ? false : true}
                rightElement={isAcsnTypeMenuOpen ? "menu-up" : "menu-down"}
                value={accessionType}
                DropDown={SetAcsnTypeDropDown}
                onFocus={SetAcsnTypeDropDown}
                errors={errorMessage.accessionType}
                isError={isError.accessionType}
              />
              {accessionType == "From Institution" ? (
                <InputBox
                  inputLabel={"Choose Institution"}
                  placeholder={"Institution"}
                  edit={
                    deletes
                      ? false
                      : accessionType == "From Institution"
                      ? true
                      : false
                  }
                  rightElement={
                    isInstituteTypeMenuOpen ? "menu-up" : "menu-down"
                  }
                  value={institutionType}
                  DropDown={SetInstituteTypeDropDown}
                  onFocus={SetInstituteTypeDropDown}
                  errors={errorMessage.institutionType}
                  isError={isError.institutionType}
                  // helpText={
                  //   accessionType == "From Institution"
                  //     ? ""
                  //     : "Only if Accession Type is From Institution"
                  // }
                />
              ) : null}

              <InputBox
                inputLabel={"Choose Ownership Term"}
                placeholder={" Ownership Term"}
                refs={ownerShipRef}
                editable={false}
                edit={deletes ? false : true}
                rightElement={isOwnershipTypeMenuOpen ? "menu-up" : "menu-down"}
                value={ownershipType}
                DropDown={SetOwnershipTypeDropDown}
                onFocus={SetOwnershipTypeDropDown}
                // defaultValue={
                //   enclosureEnvironment != null
                //     ? enclosureEnvironment
                //     : null
                // }
                errors={errorMessage.ownershipType}
                isError={isError.ownershipType}
              />

              <DatePicker
                title="Accession Date"
                edit={deletes ? false : true}
                style={{ borderBottomLeftRadius: 0 }}
                minimumDate={new Date(birthDate)}
                maximumDate={new Date()}
                today={accessionDate}
                mode={"date"}
                onChange={(date) => {
                  setAccessionDate(date);
                  // handleSubmitFocus(taxonomyRef, 1000);
                }}
                // errors={errorMessage.accessionDate}
                // isError={isError.accessionDate}
                onOpen={dropdownOff}
              />

              <AutoCompleteSearch
                showClear={deletes ? false : true}
                placeholder="Enter atleast 3 charecter to search..."
                edit={deletes ? false : true}
                label="Species/Taxonomy"
                value={species}
                onPress={catTaxonomydata}
                onClear={() => {
                  setSpeciesID("");
                  setSpecies("");
                }}
                // onFocus={catTaxonomydata}
                errors={errorMessage.species}
                isError={isError.species}
              />

              {/* <InputBox
                  inputLabel={"Select Enclosure"}
                  placeholder={"Choose Enclosure"}
                  edit={deletes ? false : true}
                  refs={enclRef}
                  editable={false}
                  DropDown={SetSelectEncDropDown}
                  onFocus={SetSelectEncDropDown}
                  value={selectEnclosure}
                  rightElement={isSelectEnclosure ? "menu-up" : "menu-down"}
                  // defaultValue={
                  //   selectEnclosure != null ? selectEnclosure : null
                  // }
                  errors={errorMessage.selectEnclosure}
                  isError={isError.selectEnclosure}
                /> */}

              <View
                style={reduxColors.destinationBox}
                pointerEvents={destination?.enclosure_id ? "none" : "auto"}
              >
                <TouchableOpacity
                  onPress={gotoSelectScreen}
                  disabled={deletes}
                  style={[
                    reduxColors.animalCardStyle,
                    {
                      minHeight: destination.enclosure_id
                        ? heightPercentageToDP(14)
                        : 50,
                    },
                    {
                      borderColor:
                        isError.selectEnclosure && !destination.enclosure_id
                          ? constThemeColor.error
                          : constThemeColor.outline,
                    },
                    {
                      backgroundColor: destination.enclosure_id
                        ? constThemeColor.displaybgPrimary
                        : constThemeColor.surface,
                    },
                    {
                      borderWidth: destination.enclosure_id ? 2 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      reduxColors.animalTextStyle,
                      {
                        paddingVertical: destination.enclosure_id
                          ? Spacing.small
                          : 0,
                      },
                    ]}
                  >
                    {destination?.enclosure_id
                      ? "Selected Enclosure"
                      : "Select Enclosure"}
                  </Text>
                  {destination?.enclosure_id ? (
                    <>
                      <View>
                        <HounsingCard
                          backgroundColor={constThemeColor.displaybgPrimary}
                          title={capitalize(destination?.user_enclosure_name)}
                          incharge={" " + (destination?.incharge_name ?? "NA")}
                          section={destination?.section_name ?? "NA"}
                          style={{ borderRadius: Spacing.body, zIndex: -1 }}
                          sitename={destination?.site_name}
                          onPress={
                            props.route?.params?.item
                              ? undefined
                              : gotoSelectScreen
                          }
                          arrow={props.route?.params?.item ? false : true}
                        />
                      </View>
                    </>
                  ) : null}
                </TouchableOpacity>
              </View>
              {isError.selectEnclosure && !destination.enclosure_id ? (
                <View style={reduxColors.errorBox}>
                  <Text style={reduxColors.errorMessage}>
                    {errorMessage.selectEnclosure}
                  </Text>
                </View>
              ) : null}

              {value === "single" ? (
                <InputBox
                  inputLabel={"Sex Type*"}
                  placeholder={"Choose sex"}
                  edit={deletes ? false : true}
                  editable={false}
                  refs={sexRef}
                  onFocus={SetSexTypeDropDown}
                  DropDown={SetSexTypeDropDown}
                  value={selectSexType}
                  rightElement={isSelectSexType ? "menu-up" : "menu-down"}
                  //  defaultValue={section != null ? section : null}
                  errors={errorMessage.selectSexType}
                  isError={isError.selectSexType}
                />
              ) : null}

              <InputBox
                inputLabel={"Collection Type*"}
                placeholder={"Choose collection"}
                editable={false}
                edit={deletes ? false : true}
                DropDown={SetCollectionTypeDown}
                onFocus={SetCollectionTypeDown}
                value={selectCollectionType}
                rightElement={isSelectCollectionType ? "menu-up" : "menu-down"}
                errors={errorMessage.selectCollectionType}
                isError={isError.selectCollectionType}
              />
              <InputBox
                inputLabel={"Select Organization"}
                placeholder={"Choose Organization"}
                editable={false}
                refs={organizationRef}
                edit={deletes ? false : true}
                DropDown={SetOrganizationDown}
                onFocus={SetOrganizationDown}
                value={selectOrganizationType}
                rightElement={
                  isSelectOrganizationType ? "menu-up" : "menu-down"
                }
                //   defaultValue={section != null ? section : null}
                errors={errorMessage.selectOrganizationType}
                isError={isError.selectOrganizationType}
              />
              {/* </View> */}
            </View>
          </List.Accordion>
        </List.Section>
        <List.Section>
          <View style={{ display: value === "batch" ? "none" : "flex" }}>
            <List.Accordion
              title="Additional Information"
              id="1"
              titleStyle={{
                color: constThemeColor.onSecondaryContainer,
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                marginLeft: -8,
              }}
              style={{
                backgroundColor: constThemeColor.onPrimary,
                marginRight: -16,
              }}
              right={(props) =>
                expanded.Additional ? (
                  <List.Icon {...props} icon="minus" />
                ) : (
                  <List.Icon {...props} icon="plus" />
                )
              }
              expanded={expanded.Additional}
              onPress={() =>
                setExpanded((prevState) => ({
                  ...prevState,
                  Additional: !expanded.Additional,
                }))
              }
            >
              <View>
                <DatePicker
                  title="Birth Date"
                  edit={deletes ? false : true}
                  style={{ borderBottomLeftRadius: 0 }}
                  today={birthDate}
                  maximumDate={new Date()}
                  onChange={getBirthDate}
                  onOpen={dropdownOff}
                  isError={isError.birthDate}
                  errors={errorMessage.birthDate}
                />
                {/* {isError.birthDate ? (
                  <Text style={{ color: Colors.danger, paddingHorizontal: 4 }}>
                    {errorMessage.birthDate}
                  </Text>
                ) : null} */}

                <View
                  style={{
                    width: widthPercentageToDP("25%"),
                    marginBottom: heightPercentageToDP(1),
                    marginTop: heightPercentageToDP(1),
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      marginLeft: widthPercentageToDP(1),
                      color: constThemeColor.onPrimaryContainer,
                      fontSize: FontSize.Antz_Minor_Regular.fontSize,
                      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                    }}
                  >
                    {"Or"}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <View style={{ width: "35%" }}>
                    <InputBox
                      inputLabel={"Enter Age"}
                      edit={deletes ? false : true}
                      placeholder={"Approx Age"}
                      keyboardType={"numeric"}
                      value={age}
                      style={{
                        // height: 48,
                        flex: 1,
                        marginRight: 10,
                      }}
                      onFocus={dropdownOff}
                      // autoFocus={isError?.birthDate ? true : false}
                      onChange={(value) => {
                        handleDate(
                          dateComponent,
                          value.replace(/^0|[^0-9]/g, "")
                        );
                      }}
                    />
                  </View>

                  <View style={reduxColors.checkboxWrap}>
                    {/* <TouchableOpacity
                      style={[
                        reduxColors.botton,
                        dateComponent === "years"
                          ? reduxColors.activeDateComponent
                          : null,
                      ]}
                      onPress={() => {
                        [
                          handleDate("years"),
                          handleSubmitFocus(identifierTypeRef),
                        ];
                      }}
                    >
                      <Text
                        style={[
                          dateComponent === "years"
                            ? reduxColors.activeDateComponentText
                            : null,
                        ]}
                      >
                        Years
                      </Text>
                    </TouchableOpacity> */}
                    <View style={reduxColors.ageSelectContainer}>
                      <TouchableOpacity
                        disabled={deletes}
                        style={[
                          reduxColors.botton,
                          {
                            // borderRightWidth: Platform.OS == "ios" ? 0.8 : 1,
                            borderRadius: 0,
                            zIndex: 999,
                          },
                          dateComponent === "months"
                            ? reduxColors.activeDateFirstComponent
                            : reduxColors.dateFirstComponent,
                        ]}
                        onPress={() => {
                          [
                            handleDate("months", age),
                            handleSubmitFocus(identifierTypeRef),
                          ];
                        }}
                      >
                        <Text
                          style={[
                            dateComponent === "months"
                              ? reduxColors.activeDateComponentText
                              : reduxColors.dateComponentText,
                          ]}
                        >
                          Months
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={deletes}
                        style={[
                          reduxColors.botton,
                          {
                            borderLeftWidth: Platform.OS == "ios" ? 0 : 0.8,
                            borderRightWidth: 1,

                            borderRadius: 0,
                            zIndex: 999,
                          },
                          dateComponent === "weeks"
                            ? reduxColors.activeDateComponent
                            : reduxColors.dateComponent,
                        ]}
                        onPress={() => {
                          [
                            handleDate("weeks", age),
                            handleSubmitFocus(identifierTypeRef),
                          ];
                        }}
                      >
                        <Text
                          style={[
                            dateComponent === "weeks"
                              ? reduxColors.activeDateComponentText
                              : reduxColors.dateComponentText,
                          ]}
                        >
                          Weeks
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={deletes}
                        style={[
                          reduxColors.botton,
                          {
                            // borderRightWidth: 0.5,
                            // borderRadius: 0,
                            // zIndex: 999,
                          },
                          dateComponent === "days"
                            ? reduxColors.activeDateLastComponent
                            : reduxColors.dateLastComponent,
                        ]}
                        onPress={() => {
                          [
                            handleDate("days", age),
                            handleSubmitFocus(identifierTypeRef),
                          ];
                        }}
                      >
                        <Text
                          style={[
                            dateComponent === "days"
                              ? reduxColors.activeDateComponentText
                              : reduxColors.dateComponentText,
                          ]}
                        >
                          Days
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: 10,
                    }}
                  >
                    {isError.batchOptions !== true ? null : (
                      <Text style={{ color: constThemeColor.error }}>
                        {errorMessage.batchOptions}
                      </Text>
                    )}
                  </View>
                </View>
                <Text
                  style={{
                    marginLeft: 10,
                    color: constThemeColor.onPrimaryContainer,
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                  }}
                >
                  Estimate range
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                  }}
                >
                  {isError.batchOptions !== true ? null : (
                    <Text style={{ color: Colors.danger }}>
                      {errorMessage.batchOptions}
                    </Text>
                  )}
                </View>
                {/* <InputBox
                  inputLabel={"Parent Mother"}
                  placeholder={"Choose Parent Mother "}
                  multiline={Platform.OS === "android" ? false : true}
                  value={genderMother}
                  rightElement={isMother ? "menu-up" : "menu-down"}
                  DropDown={SetIsMotherDown}
                  onFocus={SetIsMotherDown}
                  errors={errorMessage.genderMother}
                  isError={isError.genderMother}
                /> */}

                <View style={[reduxColors.animalBox, {}]}>
                  <TouchableOpacity
                    disabled={deletes ? true : false}
                    onPress={() => gotoSearchScreenMother("mother")}
                    style={[
                      reduxColors.animalCardStyle,
                      {
                        borderWidth: parentMother?.animal_id ? 2 : 1,
                        borderColor: isError.genderMother
                          ? constThemeColor.error
                          : constThemeColor.outline,
                        backgroundColor: parentMother?.animal_id
                          ? constThemeColor.displaybgPrimary
                          : constThemeColor.surface,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        reduxColors.animalTextStyle,
                        { paddingVertical: Spacing.mini },
                      ]}
                    >
                      Parent Mother
                    </Text>
                    {parentMother?.animal_id ? (
                      <>
                        <Divider />
                        <AnimalCustomCard
                          item={parentMother}
                          animalIdentifier={
                            !parentMother?.local_identifier_value
                              ? parentMother?.animal_id
                              : parentMother?.local_identifier_name ?? null
                          }
                          localID={parentMother?.local_identifier_value ?? null}
                          icon={parentMother.default_icon}
                          enclosureName={parentMother?.user_enclosure_name}
                          animalName={
                            parentMother?.common_name
                              ? parentMother?.common_name
                              : parentMother?.scientific_name
                          }
                          sectionName={parentMother?.section_name}
                          show_specie_details={true}
                          show_housing_details={true}
                          chips={parentMother?.sex ?? "female"}
                          // onPress={() => gotoSearchScreenMother("mother")}
                          style={{
                            backgroundColor: constThemeColor.displaybgPrimary,
                          }}
                          noArrow={true}
                          remove={true}
                          onRemove={() => {
                            if (deletes) {
                              return null;
                            } else {
                              setParentMother([]);
                            }
                          }}
                        />
                      </>
                    ) : null}
                  </TouchableOpacity>
                </View>
                {isError.genderMother ? (
                  <Text
                    style={{
                      color: constThemeColor.error,
                      marginLeft: 5,
                      marginTop: 6,
                      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                    }}
                  >
                    {errorMessage.genderMother}
                  </Text>
                ) : null}

                <View style={reduxColors.animalBox}>
                  <TouchableOpacity
                    disabled={deletes ? true : false}
                    onPress={() => {
                      console.log(parentFather?.length);
                      if (parentFather?.length < 3) {
                        gotoSearchScreenFather(
                          "father",
                          3 - parentFather?.length
                        );
                      }
                    }}
                    style={[
                      reduxColors.animalCardStyle,
                      {
                        borderWidth: parentFather?.length > 0 ? 2 : 1,
                        borderColor: isError.genderFather
                          ? constThemeColor.error
                          : constThemeColor.outline,
                        backgroundColor:
                          parentFather?.length > 0
                            ? constThemeColor.displaybgPrimary
                            : constThemeColor.surface,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        reduxColors.animalTextStyle,
                        { paddingVertical: Spacing.mini },
                      ]}
                    >
                      Parent Father
                    </Text>
                    {parentFather?.length > 0
                      ? parentFather?.map((animal, key) => {
                          return animal?.animal_id ? (
                            <>
                              <Divider />
                              <AnimalCustomCard
                                item={animal}
                                animalIdentifier={
                                  !animal?.local_identifier_value
                                    ? animal?.animal_id
                                    : animal?.local_identifier_name
                                }
                                localID={animal?.local_identifier_value ?? null}
                                icon={animal.default_icon}
                                enclosureName={animal?.user_enclosure_name}
                                animalName={
                                  animal?.common_name
                                    ? animal?.common_name
                                    : animal?.scientific_name
                                }
                                sectionName={animal?.section_name}
                                show_specie_details={true}
                                show_housing_details={true}
                                chips={animal?.sex ?? "male"}
                                // onPress={() =>
                                //   gotoSearchScreenFather("father", 3)
                                // }
                                style={{
                                  backgroundColor:
                                    constThemeColor.displaybgPrimary,
                                }}
                                noArrow={true}
                                remove={true}
                                onRemove={() => {
                                  if (deletes) return null;
                                  setParentFather((old) => {
                                    return old?.filter(
                                      (v) => v?.animal_id !== animal?.animal_id
                                    );
                                  });
                                }}
                              />
                            </>
                          ) : null;
                        })
                      : null}
                  </TouchableOpacity>
                </View>
                {isError.genderFather ? (
                  <Text
                    style={{
                      color: constThemeColor.error,
                      marginLeft: 5,
                      marginTop: 6,
                      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                    }}
                  >
                    {errorMessage.genderFather}
                  </Text>
                ) : null}
                {/* <InputBox
                  inputLabel={"Parent Father"}
                  placeholder={"Choose Parent Father"}
                  value={genderFather}
                  rightElement={isFather ? "menu-up" : "menu-down"}
                  DropDown={SetIsFatherDown}
                  onFocus={SetIsFatherDown}
                  errors={errorMessage.genderFather}
                  isError={isError.genderFather}
                /> */}

                <InputBox
                  inputLabel={"Local Identifier Type"}
                  placeholder={"Choose Local Identifier"}
                  editable={false}
                  edit={deletes ? false : true}
                  value={selectIdentifierType}
                  onFocus={SetIdentifierTypeDown}
                  DropDown={SetIdentifierTypeDown}
                  rightElement={
                    isSelectIdentifierType ? "menu-up" : "menu-down"
                  }
                  //  defaultValue={section != null ? section : null}
                />

                {selectIdentifierType !== "" && (
                  <InputBox
                    inputLabel={"Local Identifier"}
                    placeholder={"Enter Local Identifier"}
                    edit={deletes ? false : true}
                    value={localIdentifier}
                    onFocus={dropdownOff}
                    onChange={(value) => setLocalIdentifier(value)}
                    errors={errorMessage.localIdentifier}
                    isError={isError.localIdentifier}
                  />
                )}
                <InputBox
                  inputLabel={"Sexting Type"}
                  placeholder={"Sexting Type"}
                  editable={false}
                  edit={deletes ? false : true}
                  value={sexingType}
                  onFocus={togglePrintModal}
                  DropDown={togglePrintModal}
                  rightElement={animalEditModal ? "menu-up" : "menu-down"}
                  //  defaultValue={section != null ? section : null}
                />
                <InputBox
                  inputLabel={"Life Stage"}
                  placeholder={"Life Stage"}
                  editable={false}
                  edit={deletes ? false : true}
                  value={lifeStageName}
                  onFocus={toggleLifeStageModal}
                  DropDown={toggleLifeStageModal}
                  rightElement={animalLifeStagetModal ? "menu-up" : "menu-down"}
                  //  defaultValue={section != null ? section : null}
                />
                <InputBox
                  inputLabel={"Contraception Type"}
                  placeholder={"Contraception Type"}
                  editable={false}
                  edit={deletes ? false : true}
                  value={ContraceptionName}
                  onFocus={toggleContraceptionModal}
                  DropDown={toggleContraceptionModal}
                  rightElement={ContraceptionModal ? "menu-up" : "menu-down"}
                  //  defaultValue={section != null ? section : null}
                />

                {animalEditModal ? (
                  <ModalFilterComponent
                    onPress={togglePrintModal}
                    onDismiss={closePrintModal}
                    onBackdropPress={closePrintModal}
                    onRequestClose={closePrintModal}
                    data={animalSexingData}
                    closeModal={closeMenu}
                    title="Sexting Type"
                    style={{ alignItems: "flex-start" }}
                    isSelectedId={isSelectedId}
                    checkIcon={true}
                  />
                ) : null}

                {animalLifeStagetModal ? (
                  <ModalFilterComponent
                    onPress={toggleLifeStageModal}
                    onDismiss={closeLifeStageModal}
                    onBackdropPress={closeLifeStageModal}
                    onRequestClose={closeLifeStageModal}
                    data={animalLifeStageData}
                    closeModal={closeLifeStageMenu}
                    title="Life Stage"
                    style={{ alignItems: "flex-start" }}
                    isSelectedId={isSelectedLifeStageId}
                    checkIcon={true}
                  />
                ) : null}

                {ContraceptionModal ? (
                  <ModalFilterComponent
                    onPress={toggleContraceptionModal}
                    onDismiss={closeContraceptionModal}
                    onBackdropPress={closeContraceptionModal}
                    onRequestClose={closeContraceptionModal}
                    data={animalContraceptionData}
                    closeModal={closeContraceptionMenu}
                    title="Contraception Type"
                    style={{ alignItems: "flex-start" }}
                    isSelectedId={isSelectedContraceptionId}
                    checkIcon={true}
                  />
                ) : null}
              </View>
            </List.Accordion>
          </View>
        </List.Section>
      </CustomForm>

      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={DialougeTitle}
        closeModal={alertModalClose}
        firstButtonHandle={confirmButtonPress}
        secondButtonHandle={cancelButtonPress}
        firstButtonText={"Yes"}
        secondButtonText={"No"}
        firstButtonStyle={{
          backgroundColor: constThemeColor.error,
          borderWidth: 0,
        }}
        firstButtonTextStyle={{ color: constThemeColor.onPrimary }}
        secondButtonStyle={{
          backgroundColor: constThemeColor.surfaceVariant,
          borderWidth: 0,
        }}
      />
      {isAcsnTypeMenuOpen ? (
        <ModalFilterComponent
          onPress={acsnClose}
          onDismiss={acsnClose}
          onBackdropPress={acsnClose}
          onRequestClose={acsnClose}
          data={accessionTypeData}
          closeModal={accessPressed}
          title="Choose Accession Type"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedAcsnTypePressed}
          checkIcon={true}
        />
      ) : null}

      {isInstituteTypeMenuOpen ? (
        <ModalFilterComponent
          onPress={InstiClose}
          onDismiss={InstiClose}
          onBackdropPress={InstiClose}
          onRequestClose={InstiClose}
          data={institutionTypeData}
          closeModal={institutePressed}
          title="Choose Institute"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedInstituteTypePressed}
          checkIcon={true}
        />
      ) : null}
      {isOwnershipTypeMenuOpen ? (
        <ModalFilterComponent
          onPress={OwnershipClose}
          onDismiss={OwnershipClose}
          onBackdropPress={OwnershipClose}
          onRequestClose={OwnershipClose}
          data={ownershipTypeData}
          closeModal={OwnershipPressed}
          title="Choose Ownership Term"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedOwnershipPressed}
          checkIcon={true}
        />
      ) : null}
      {isSelectCollectionType ? (
        <ModalFilterComponent
          onPress={collectionTypeClose}
          onDismiss={collectionTypeClose}
          onBackdropPress={collectionTypeClose}
          onRequestClose={collectionTypeClose}
          data={selectCollectionTypeData}
          closeModal={collectionTypePressed}
          title="Choose Collection Type"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedCollectionPressed}
          checkIcon={true}
        />
      ) : null}
      {isSelectOrganizationType ? (
        <ModalFilterComponent
          onPress={organizationClose}
          onDismiss={organizationClose}
          onBackdropPress={organizationClose}
          onRequestClose={organizationClose}
          data={selectOrganizationTypeData}
          closeModal={OrganizationPressed}
          title="Choose Organization"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedOrgnizationPressed}
          checkIcon={true}
        />
      ) : null}
      {isSelectIdentifierType ? (
        <ModalFilterComponent
          onPress={identifierTypeClose}
          onDismiss={identifierTypeClose}
          onBackdropPress={identifierTypeClose}
          onRequestClose={identifierTypeClose}
          data={selectIdentifierTypeData}
          closeModal={identifierTypePressed}
          title="Choose Local Identifier"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedidentifierTypePressed}
          checkIcon={true}
        />
      ) : null}

      {isSelectSexType ? (
        <ModalFilterComponent
          onPress={sexClose}
          onDismiss={sexClose}
          onBackdropPress={sexClose}
          onRequestClose={sexClose}
          data={selectSexTypeData}
          closeModal={sexTypePressed}
          title="Choose Sex Type"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedSexTypePressed}
          checkIcon={true}
        />
      ) : null}

      {/* {isAcsnTypeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isAcsnTypeMenuOpen}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={acsnClose}
          >
            <Category
              categoryData={accessionTypeData}
              onCatPress={accessPressed}
              heading={"Choose Accession Type"}
              isMulti={false}
              onClose={acsnClose}
            />
          </Modal>
        </View>
      ) : null} */}

      {/* {isInstituteTypeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isInstituteTypeMenuOpen}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={InstiClose}
          >
            <Category
              categoryData={institutionTypeData}
              onCatPress={institutePressed}
              heading={"Choose Institute"}
              isMulti={false}
              onClose={InstiClose}
            />
          </Modal>
        </View>
      ) : null} */}
      {/* {isOwnershipTypeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isOwnershipTypeMenuOpen}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={OwnershipClose}
          >
            <Category
              categoryData={ownershipTypeData}
              onCatPress={OwnershipPressed}
              heading={"Choose Institute"}
              isMulti={false}
              onClose={OwnershipClose}
            />
          </Modal>
        </View>
      ) : null} */}

      {isSelectEnclosure ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isSelectEnclosure}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={encClose}
          >
            <Category
              categoryData={selectEnclosureData}
              onCatPress={enclosurePressed}
              heading={"Choose Enclosure"}
              isMulti={false}
              onClose={encClose}
            />
          </Modal>
        </View>
      ) : null}

      {/* {isSelectSexType ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isSelectSexType}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={sexClose}
          >
            <Category
              categoryData={selectSexTypeData}
              onCatPress={sexTypePressed}
              heading={"Choose Sex Type"}
              isMulti={false}
              onClose={sexClose}
            />
          </Modal>
        </View>
      ) : null} */}

      {/* {isSelectCollectionType ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isSelectCollectionType}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={collectionTypeClose}
          >
            <Category
              categoryData={selectCollectionTypeData}
              onCatPress={collectionTypePressed}
              heading={"Choose Collection Type"}
              isMulti={false}
              onClose={collectionTypeClose}
            />
          </Modal>
        </View>
      ) : null} */}

      {/* {isSelectIdentifierType ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isSelectIdentifierType}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={identifierTypeClose}
          >
            <Category
              categoryData={selectIdentifierTypeData}
              onCatPress={identifierTypePressed}
              heading={"Choose Identifier Type"}
              isMulti={false}
              onClose={identifierTypeClose}
            />
          </Modal>
        </View>
      ) : null} */}
      {/* {isSelectOrganizationType ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isSelectOrganizationType}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={organizationClose}
          >
            <Category
              categoryData={selectOrganizationTypeData}
              onCatPress={OrganizationPressed}
              heading={"Choose Organization"}
              isMulti={false}
              onClose={organizationClose}
            />
          </Modal>
        </View>
      ) : null} */}
      {isMother ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isMother}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={IsmotherClose}
          >
            <Category
              categoryData={Mother}
              onCatPress={catMotherdata}
              heading={"Select Parent Mother"}
              isMulti={false}
              onClose={IsmotherClose}
            />
          </Modal>
        </View>
      ) : null}

      {isFather ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isFather}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={IsFatherClose}
          >
            <Category
              categoryData={Father}
              onCatPress={catFatherdata}
              heading={"Select Parent Father"}
              isMulti={true}
              onClose={IsFatherClose}
              selectLimit={3}
            />
          </Modal>
        </View>
      ) : null}

      {/** Delete Animal modal*/}
      <Modal
        avoidKeyboard
        animationType="fade"
        visible={showReasonModal}
        style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
      >
        <TouchableWithoutFeedback onPress={() => setShowReasonModal(false)}>
          <View style={[reduxColors.modalOverlay]}>
            <View style={reduxColors.modalContainer}>
              <View style={reduxColors.modalHeader}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: constThemeColor.neutralPrimary,
                  }}
                >
                  Delete Animal
                </Text>
                <TouchableOpacity
                  activeOpacity={1}
                  style={reduxColors.closeBtn}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color={constThemeColor.onSurface}
                    onPress={() => setShowReasonModal(false)}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <View style={reduxColors.modalBody}>
                  <ModalTitleData
                    selectDrop={reason}
                    toggleModal={toggleReasonModal}
                    dropDownIcon={true}
                    size={16}
                    selectDropStyle={{
                      color: constThemeColor.onPrimaryContainer,
                      flex: 1,
                      paddingLeft: Spacing.mini,
                    }}
                    touchStyle={{
                      backgroundColor: constThemeColor.surface,
                      borderWidth: 1,
                      borderColor: constThemeColor.outlineVariant,
                      paddingHorizontal: Spacing.minor,
                      justifyContent: "space-between",
                      width: "100%",
                      height: 54,
                      borderRadius: Spacing.small,
                    }}
                  />
                  {isReasonModal ? (
                    <ModalFilterComponent
                      onPress={toggleReasonModal}
                      onDismiss={closeReasonModal}
                      onBackdropPress={closeReasonModal}
                      onRequestClose={closeReasonModal}
                      data={reasonData}
                      closeModal={closeMenuReason}
                      style={{ alignItems: "flex-start" }}
                      isSelectedId={isSelectedReasonId}
                      radioButton={false}
                      checkIcon={true}
                    />
                  ) : null}
                </View>
              </View>
              <View style={reduxColors.modalBody}>
                <TextInput
                  inputLabel={"Description"}
                  mode="outlined"
                  autoCompleteType="off"
                  placeholder={"Enter Description for delete"}
                  value={description}
                  style={{
                    width: "100%",
                    backgroundColor: constThemeColor.errorContainer,
                    borderColor: constThemeColor.errorContainer,
                    height: 100,
                    borderRadius: 8,
                    color: constThemeColor?.errorContainer,
                  }}
                  onChangeText={(text) => {
                    setDescription(text);
                  }}
                  placeholderTextColor={constThemeColor?.onErrorContainer}
                  cursorColor={constThemeColor.error}
                  textColor={constThemeColor?.onErrorContainer}
                  outlineColor={constThemeColor.error}
                  activeOutlineColor={constThemeColor.error}
                  textAlignVertical="top"
                  numberOfLines={1}
                  multiline
                />
              </View>
              <View style={[reduxColors.modalBtnCover]}>
                {reasonId && description?.trim().length != 0 ? (
                  <TouchableOpacity
                    disabled={description === "" ? true : false}
                    onPress={DeleteAnimalDataFunc}
                    style={{
                      backgroundColor: constThemeColor.error,
                      paddingHorizontal: Spacing.minor,
                      paddingVertical: Spacing.small,
                      borderRadius: Spacing.mini,
                    }}
                  >
                    <Text
                      style={{
                        color: constThemeColor.onPrimary,
                        fontSize: FontSize.Antz_Minor_Title.fontSize,
                        fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    checkboxWrap: {
      flexDirection: "row",
      // alignItems: "center",
      // justifyContent: "flex-end",
      // width: "70%",
      // borderTopWidth: 0,
      // padding: 10,
      alignItems: "center",
      justifyContent: "flex-end",
      width: "65%",
      marginTop: 5,
    },
    label: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.blackWithPointEight,
    },
    botton: {
      borderColor: reduxColors.outline,
      // padding: 8,
      // paddingHorizontal: 18,
      // height: heightPercentageToDP("6%"),
      height: 48,
      borderRadius: 2,
      alignItems: "center",
      justifyContent: "center",
      width: widthPercentageToDP("18%"),
    },
    botton1: {
      borderColor: reduxColors.outline,
      padding: 8,
      height: 48,
      borderRadius: 2,
      alignItems: "center",
      alignItems: "center",
      justifyContent: "center",
      width: widthPercentageToDP("18.90%"),
      borderRightWidth: 1.2,
    },

    dateComponent: {
      backgroundColor: reduxColors.surface,
      borderLeftWidth: Platform.OS == "ios" ? 0 : 1,
    },
    dateLastComponent: {
      backgroundColor: reduxColors.surface,
      borderRadius: 5,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    activeDateFirstComponent: {
      backgroundColor: reduxColors.secondaryContainer,
      borderRadius: 4,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderWidth: 1,
      borderRightWidth: Platform.OS == "ios" ? 2 : 1,
    },
    dateFirstComponent: {
      backgroundColor: reduxColors.surface,
      borderRadius: 5,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: Platform.OS == "ios" ? 0.8 : 0,
    },
    activeDateComponent: {
      backgroundColor: reduxColors.secondaryContainer,
      borderWidth: 1,
      borderRightWidth: Platform.OS == "ios" ? 2 : 2,
      borderLeftWidth: Platform.OS == "ios" ? 1 : 2,
    },
    activeDateLastComponent: {
      backgroundColor: reduxColors.secondaryContainer,
      borderRadius: 4,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderWidth: 1.2,
    },
    activeDateComponentText: {
      // color: reduxColors.onPrimary,
    },
    dateComponentText: {
      color: reduxColors.onSecondaryContainer,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    ageSelectContainer: {
      borderWidth: 1,
      flexDirection: "row",
      borderRadius: 5,
      borderColor: reduxColors.outline,
      alignItems: "center",
      justifyContent: "space-between",
      height: 50,
      // width: widthPercentageToDP("57%"),
    },
    ageSelectContainer1: {
      borderWidth: 2,
      flexDirection: "row",
      borderRadius: 5,
      borderColor: reduxColors.outline,
      alignItems: "center",
      justifyContent: "space-between",
      height: 50,
      // width: widthPercentageToDP("57%"),
    },
    animalBox: {
      marginTop: heightPercentageToDP(1.5),
      marginBottom: heightPercentageToDP(0.5),
      // width: widthPercentageToDP(95),
      borderColor: reduxColors.onSurfaceVariant,
      // borderWidth: 0.5,
      borderRadius: 5,
    },
    animalText: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.neutralPrimary,
      paddingLeft: widthPercentageToDP(2),
    },

    animalCardStyle: {
      justifyContent: "center",
      width: "100%",
      borderWidth: 1,
      borderRadius: 6,
      borderColor: reduxColors.border,
      // backgroundColor: reduxColors.surface,
      minHeight: 50,
    },
    animalTextStyle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      paddingLeft: Spacing.minor,
    },
    mainTag: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: widthPercentageToDP(20),
      height: heightPercentageToDP(4),
    },
    tagscontainerM: {
      width: widthPercentageToDP(6),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.surfaceVariant,
      borderRadius: 5,
      marginLeft: widthPercentageToDP(1.2),
      justifyContent: "center",
    },
    tagscontainerB: {
      width: widthPercentageToDP(6),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.secondary,
      borderRadius: 5,
      justifyContent: "center",
    },
    destinationBox: {
      marginVertical: heightPercentageToDP(1),
    },
    textbox: {
      paddingVertical: 10,
      paddingHorizontal: Spacing.small,
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexDirection: "row",
      borderWidth: 1,
      borderColor: reduxColors.outline,
      marginVertical: Spacing.micro,
      borderRadius: Spacing.mini,
      backgroundColor: reduxColors.surface,
    },
    modalCont: {
      marginVertical: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: Spacing.minor,
    },
    modalHeader: {
      width: widthPercentageToDP(85),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.body,
    },
    modalBody: {
      flexDirection: "row",
      // justifyContent: "space-between",
      // alignItems: "center",
      paddingBottom: Spacing.major,
      width: "75%",
    },
    modalBtnCover: {
      alignSelf: "flex-end",
      paddingHorizontal: Spacing.minor,
      paddingBottom: Spacing.body,
    },
    commonSelectStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: Spacing.mini,
    },
  });

export default AnimalEdit;

// export const AnimalModalDataEdit = ({
//   selectedDrop,
//   toggleModal,
//   togglePrintModal,
//   onDismiss,
//   onBackdropPress,
//   onRequestClose,
//   data,
//   title,
//   closeMenu,
//   isSelectedId,
//   animalEditModal
// }) => {
//   const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
//   const reduxColors = styles(constThemeColor);

//   return (
//     <View style={reduxColors.textbox}>
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "flex-start",
//         }}
//       >
//         <ModalTitleData
//           selectDrop={selectedDrop}
//           selectDropStyle={[
//             FontSize.Antz_Minor_Medium,
//             { color: constThemeColor.onPrimaryContainer, flex: 1 },
//           ]}
//           toggleModal={toggleModal}
//           filterIconStyle={{
//             marginLeft: Spacing.small,
//             marginTop: Spacing.micro,
//           }}
//           filterIcon={true}
//           size={24}
//           isFromInsights={true}
//         />
//       </View>
//       {animalEditModal ? (
//         <ModalFilterComponent
//           onPress={onPress}
//           onDismiss={onPress}
//           onBackdropPress={onBackdropPress}
//           onRequestClose={onRequestClose}
//           data={data}
//           closeModal={closeMenu}
//           title={title}
//           style={{ alignItems: "flex-start" }}
//           isSelectedId={isSelectedId}
//         />
//       ) : null}
//     </View>
//   );
// };
