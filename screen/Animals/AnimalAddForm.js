import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { AntDesign } from "@expo/vector-icons";
import Category from "../../components/DropDownBox";
import CustomForm from "../../components/CustomForm";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  LogBox,
  useWindowDimensions,
  Platform,
  BackHandler,
} from "react-native";
import { List, SegmentedButtons } from "react-native-paper";
import InputBox from "../../components/InputBox";
import DatePicker from "../../components/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { listAccessionType } from "../../services/AccessionService";
import { GetEnclosure } from "../../services/FormEnclosureServices";
import { addAnimal, getAnimalConfigs } from "../../services/AnimalService";
import moment from "moment";
import { getParentEnclosure, getTaxonomic } from "../../services/EggsService";
import Loader from "../../components/Loader";
import Colors from "../../configs/Colors";
import { useNavigation } from "@react-navigation/core";
import { AutoCompleteSearch } from "../../components/AutoCompleteSearch";
import Modal from "react-native-modal";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import { getOrganization } from "../../services/Organization";
import RequestBy from "../../components/Move_animal/RequestBy";
import { capitalize } from "lodash";
import {
  removeAnimalMovementData,
  setDestination,
} from "../../redux/AnimalMovementSlice";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { ifEmptyValue } from "../../utils/Utils";
import {
  OwnerShipList,
  instituteList,
} from "../../services/MedicalMastersService";
import Config, { AnimalStatsType } from "../../configs/Config";
import Spacing from "../../configs/Spacing";
import HounsingCard from "../../components/housing/HounsingCard";
import ModalFilterComponent from "../../components/ModalFilterComponent";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Constants from "../../configs/Constants";
import { getParentOrChildEnc } from "../../services/Animal_movement_service/MoveAnimalService";
import { getHousingSection } from "../../services/housingService/SectionHousing";

const AnimalAddForm = (props) => {
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const [isLoading, setLoding] = useState(false);

  const [value, setValue] = useState("single");

  const [accessionType, setAccessionType] = useState("");
  const [accessionTypeData, setAccessionTypeData] = useState([]);
  const [accessionTypeID, setAccessionTypeID] = useState("");
  const [isAcsnTypeMenuOpen, setIsAcsnTypeMenuOpen] = useState(false);
  const [isDob_required, setIsDob_required] = useState(true);

  const [institutionType, setInstitutionType] = useState("");
  const [isInstituteTypeMenuOpen, setIsInstituteTypeMenuOpen] = useState(false);
  const [institutionTypeID, setInstitutionTypeID] = useState(null);
  const [institutionTypeData, setInstitutionTypeData] = useState([]);

  const [ownershipType, setOwnershipType] = useState("");
  const [isOwnershipTypeMenuOpen, setOwnershipTypeMenuOpen] = useState(false);
  const [OwnershipTypeID, setOwnershipTypeID] = useState(null);
  const [ownershipTypeData, setOwnershipTypeData] = useState([]);

  const [selectOrganizationType, setSelectOrganizationType] = useState("");
  const [selectOrganizationTypeID, setSelectOrganizationTypeID] = useState("");
  const [isSelectOrganizationType, setIsSelectOrganizationType] =
    useState(false);
  const [selectOrganizationTypeData, setSelectOrganizationTypeData] = useState(
    []
  );
  const [accessionDate, setAccessionDate] = useState(null);

  const [species, setSpecies] = useState(props.route.params?.tsn ?? "");
  const [sepciesID, setSpeciesID] = useState(props.route.params?.tsn_id ?? "");

  const [selectSexType, setSelectSexType] = useState("");
  const [selectSexTypeID, setSelectSexTypeID] = useState();
  const [selectSexTypeData, setSelectSexTypeData] = useState([
    { id: "male", name: "MALE" },
    { id: "female", name: "FEMALE" },
    { id: "indeterminate", name: "INDETERMINATE" },
    { id: "undetermined", name: "UNDETERMINED" },
  ]);
  const [isSelectSexType, setIsSelectSexType] = useState(false);

  const [selectCollectionType, setSelectCollectionType] = useState("");
  const [selectCollectionTypeID, setSelectCollectionTypeID] = useState(null);
  const [selectCollectionTypeData, setSelectCollectionTypeData] = useState([]);
  const [isSelectCollectionType, setIsSelectCollectionType] = useState(false);

  const [birthDate, setBirthDate] = useState(null);
  const [dateComponent, setDateComponent] = useState("days");
  const [age, setAge] = useState("");

  const [isMother, setIsMother] = useState(false);
  const [genderMother, setGenderMother] = useState("");
  const [genderMotherId, setGenderMotherId] = useState("");
  const [Mother, setMother] = useState([]);

  const [isFather, SetIsFather] = useState(false);
  const [genderFather, setGenderFather] = useState("");
  const [genderFatherId, setGenderFatherId] = useState("");
  const [Father, setFather] = useState([]);

  const [selectIdentifierType, setSelectIdentifierType] = useState("");
  const [selectIdentifierTypeID, setSelectIdentifierTypeID] = useState(null);
  const [selectIdentifierTypeData, setSelectIdentifierTypeData] = useState([]);
  const [isSelectIdentifierType, setIsSelectIdentifierType] = useState(false);
  const [localIdentifier, setLocalIdentifier] = useState(null);

  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [undeterminedCount, setUndeterminedCount] = useState(0);
  const [indeterminateCount, setIndeterminateCount] = useState(0);
  const [batchOptions, setBatchOptions] = useState(0);

  const [input2Focus, setinput2Focus] = useState(false);

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [isNeedToClear, setIsNeedToClear] = useState(false);
  const [clearTextInputKey, setClearTextInputKey] = useState(0);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  // For Dialouge type modal  =========================
  const [isModalVisible, setModalVisible] = useState(false);
  const [DialougeTitle, setDialougeTitle] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [type, setType] = useState("");
  const [isAddAnimal, setisAddAnimal] = useState(false);
  const [AnimalId, setAnimalId] = useState("");
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const confirmButtonPress = () => {
    if (type == "backConfirmation") {
      navigation.goBack();
      alertModalClose();
    } else if (type == "addAnimal") {
      alertModalClose();
      setLoding(true);
      resetState();
    }
  };

  const cancelButtonPress = () => {
    if (type == "addAnimal") {
      if (AnimalId) {
        navigation.replace("AnimalsDetails", { animal_id: AnimalId });
      } else {
        navigation.replace("AnimalList", {
          type: AnimalStatsType.recentlyAdded,
          name: "Recently Added",
        });
      }
    }
    alertModalClose();
  };

  const GotoAnimalList = () => {
    navigation.replace("AnimalList", {
      type: AnimalStatsType.recentlyAdded,
      name: "Recently Added",
    });
    alertModalClose();
  };

  // const destination =
  //   Object.keys(useSelector((state) => state.AnimalMove.destination) ?? {})
  //     ?.length > 0
  //     ? useSelector((state) => state.AnimalMove.destination)
  //     : props.route?.params?.item ?? {};
  const destination =
    useSelector((state) => state.AnimalMove.destination) ??
    props.route?.params?.item ??
    {};
  const dispatch = useDispatch();
  // update: by md kalam ansari , add the minus plus icon insted of arrow dropdown icons
  const [expanded, setExpanded] = React.useState({
    Basic: false,
    Additional: false,
  });
  // institution list api  call********
  useEffect(() => {
    const getRefreshData = async () => {
      try {
        const res = await instituteList(zooID);
        setInstitutionTypeData(
          res.data.map((item) => {
            return {
              id: item.id,
              name: item.label,
            };
          })
        );
      } catch (err) {
        showToast("error", "Oops! Something went wrong!");
      } finally {
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
    // setIsInstituteTypeMenuOpen(!isInstituteTypeMenuOpen);
    setIsSelectSexType(false);
    setIsSelectCollectionType(false);
    setIsSelectOrganizationType(false);
    // setIsSelectOrganizationType(false);
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
    setIsDob_required(Boolean(Number(item.dob_required)));
    setInstitutionType("");
    setInstitutionTypeID(null);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    datePicker1Ref.current.focus();*/
    }
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
  const isSelectedOwnershipTypePressed = (id) => {
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
  const moveItHere = (item) => {
    dispatch(setDestination(item));
  };
  const gotoSelectScreen = () => {
    if (props.route?.params?.type == "section") {
      navigation.navigate("MoveToEnclosure", {
        section: props.route?.params?.item,
        type: "Select",
        isSection: "section",
        onPress: (e) => moveItHere(e),
      });
    } else {
      navigation.navigate("SearchTransferanimal", {
        type: "Select",
      });
    }
  };

  //this is  function Taxonomay dropDwon Filed
  const catTaxonomydata = (item) => {
    if (item) {
      setSpecies(item.title);
      setSpeciesID(item.id);
      // thirdOneOpen()
      handleSubmitFocus(enclRef);
    }
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
  const isSelectedOrganizationTypePressed = (id) => {
    return selectOrganizationTypeID == id;
  };
  const SetSexTypeDropDown = () => {
    setIsSelectSexType(!isSelectSexType);
    setIsAcsnTypeMenuOpen(false);
    setIsSelectCollectionType(false);
    setIsSelectOrganizationType(false);
  };

  const sexTypePressed = (item) => {
    setIsSelectSexType(!isSelectSexType);
    setSelectSexType(item.name);
    setSelectSexTypeID(item.id);
    // fifthOneOpen();
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    handleSubmitFocus(collectionRef)*/
    }
  };
  const isSelectedSexTypePressed = (id) => {
    return selectSexTypeID == id;
  };
  //this function the Mother DropDwon
  const SetIsMotherDown = () => {
    setIsMother(!isMother);
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
  };

  const catFatherdata = (item) => {
    setGenderFather(item.map((value) => value.name).join(","));
    setGenderFatherId(item.map((value) => value.id).join(","));
  };

  const IsFatherClose = () => {
    SetIsFather(false);
  };

  const sexClose = () => {
    setIsSelectSexType(false);
  };

  const getBirthDate = (birthDate) => {
    const todayDate = new Date();
    if (accessionDate < birthDate) {
      showToast(
        "warning",
        "Oops! You can't select accession date before birth date"
      );
      setAccessionDate(null);
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
    const birthDate = moment().subtract(value, dateComponent);
    getBirthDate(new Date(birthDate));
  };
  const SetCollectionTypeDown = () => {
    setIsSelectCollectionType(!isSelectCollectionType);
    setIsSelectSexType(false);
    setIsAcsnTypeMenuOpen(false);
    setIsSelectOrganizationType(false);
  };

  const collectionTypePressed = (item) => {
    setIsSelectCollectionType(!isSelectCollectionType);
    setSelectCollectionType(item.name);
    setSelectCollectionTypeID(item.id);
    // if (value === "batch") {
    //   handleSubmitFocus(input2Ref);
    // }
  };
  const isSelectedCollectionTypePressed = (id) => {
    return selectCollectionTypeID == id;
  };
  const collectionTypeClose = () => {
    setIsSelectCollectionType(false);
  };

  const organizationClose = () => {
    setIsSelectOrganizationType(false);
  };

  const SetOrganizationDown = () => {
    setIsSelectOrganizationType(!isSelectOrganizationType);
    setIsSelectCollectionType(false);
    setIsSelectSexType(false);
    setIsAcsnTypeMenuOpen(false);
  };

  const AddMorePopupConformationClose = () => {
    setIsAnimalAdded(false);
  };

  const SetIdentifierTypeDown = () => {
    setIsSelectIdentifierType(!isSelectIdentifierType);
  };

  const identifierTypePressed = (item) => {
    setIsSelectIdentifierType(!isSelectIdentifierType);
    setSelectIdentifierType(item.name);
    setSelectIdentifierTypeID(item.id);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    handleSubmitFocus(localIdentifierRef,1000);*/
    }
  };
  const isSelectedIdentifierTypePressed = (id) => {
    return selectIdentifierTypeID == id;
  };
  const identifierTypeClose = () => {
    setIsSelectIdentifierType(false);
  };

  const validation = () => {
    if (value === "batch") {
      let totalBatchCount =
        Number(maleCount) +
        Number(femaleCount) +
        Number(indeterminateCount) +
        Number(undeterminedCount);
      setBatchOptions(totalBatchCount);

      if (Number(totalBatchCount) < 2) {
        setIsError({ batchOptions: true });
        setErrorMessage({ batchOptions: "Atleast 2 batch count required" });
        return false;
      }
    }
    if (!species) {
      setIsError({ species: true });
      setErrorMessage({ species: "Select Taxonomy" });
      return false;
    } else if (accessionType == "") {
      setIsError({ accessionType: true });
      setErrorMessage({ accessionType: "Select Accession Type" });
      return false;
    } else if (
      accessionType == "From Institution" &&
      institutionType?.length == 0
    ) {
      setIsError({ institutionType: true });
      setErrorMessage({ institutionType: "Select Institution Type" });
      return false;
    } else if (accessionDate == null) {
      setIsError({ accessionDate: true });
      setErrorMessage({ accessionDate: "Select Accession Date" });
      return false;
    } else if (!destination?.enclosure_id) {
      setIsError({ selectEnclosure: true });
      setErrorMessage({ selectEnclosure: "Select Enclosure" });
      return false;
    } else if (value === "single" && selectSexType?.length === 0) {
      setIsError({ selectSexType: true });
      setErrorMessage({ selectSexType: "Select Sex Type" });
      return false;
    } else if (selectCollectionType == "") {
      setIsError({ selectCollectionType: true });
      setErrorMessage({ selectCollectionType: "Select Collection Type" });
      return false;
    } else if (isDob_required && !birthDate) {
      setExpanded({ Additional: true });
      setIsError({ birthDate: true });
      setErrorMessage({
        birthDate: "Select Birth Date",
      });

      return false;
    } else if (selectIdentifierType !== "" && !localIdentifier) {
      setIsError({ localIdentifier: true });
      setErrorMessage({ localIdentifier: "This field is required" });
      return false;
    }

    // if (value === "batch") {
    //   let totalBatchCount =
    //     Number(maleCount) +
    //     Number(femaleCount) +
    //     Number(indeterminateCount) +
    //     Number(undeterminedCount);
    //   setBatchOptions(totalBatchCount);

    //   if (Number(totalBatchCount) < 2) {
    //     setIsError({ batchOptions: true });
    //     setErrorMessage({ batchOptions: "Atleast 2 batch count required" });
    //     return false;
    //   }
    // }

    return true;
  };

  useEffect(() => {
    if (
      species ||
      accessionType ||
      institutionType ||
      accessionDate ||
      destination?.enclosure_id ||
      selectSexType ||
      selectCollectionType ||
      birthDate ||
      localIdentifier ||
      value
    ) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [
    species,
    accessionType,
    institutionType,
    accessionDate,
    destination?.enclosure_id,
    selectSexType,
    selectCollectionType,
    birthDate,
    localIdentifier,
    value,
  ]);

  const resetState = () => {
    setIsNeedToClear(true);
    setClearTextInputKey(clearTextInputKey + 1);
    // Reset Single Tab
    setSpecies("");
    setSpeciesID("");
    dispatch(removeAnimalMovementData());
    setAccessionType("");
    setAccessionTypeID("");
    setAccessionDate(null);
    setSelectSexType("");
    setSelectSexTypeID();
    setSelectCollectionType("");
    setSelectCollectionTypeID(null);
    setSelectOrganizationType("");
    setSelectOrganizationTypeID(null);
    setOwnershipType("");
    setOwnershipTypeID(null);

    // Additional Information

    setBirthDate(null);
    setAge("");
    setDateComponent("");
    setSelectIdentifierType("");
    setSelectIdentifierTypeID(null);
    setLocalIdentifier("");
    setGenderMotherId("");
    setGenderMother("");
    setGenderFather("");
    setGenderFatherId("");

    // Reset Batch Tab
    setMaleCount(0);
    setFemaleCount(0);
    setUndeterminedCount(0);
    setIndeterminateCount(0);
    setBatchOptions(0);
    setLoding(false);
  };
  //TCIFT.185
  // const showAlert = (animal_id) => {
  //   Alert.alert("Confirmation", "Do you want to Add more Animals.", [
  //     {
  //       text: "Cancel",
  //       onPress: () => {
  //         dispatch(removeAnimalMovementData());
  //         if (animal_id) {
  //           navigation.replace("AnimalsDetails", { animal_id });
  //         } else {
  //           // navigation.replace("AnimalList");
  //           navigation.replace("AnimalList", {
  //             type: AnimalStatsType.recentlyAdded,
  //             name: "Recently Added",
  //           });
  //         }
  //       },
  //       style: "cancel",
  //     },
  //     {
  //       text: "OK",
  //       onPress: () => {
  //         setLoding(true);
  //         resetState();
  //       },
  //     },
  //   ]);
  // };
  const handleOnPress = () => {
    setIsError({});
    setErrorMessage({});
    if (validation()) {
      setLoding(true);
      const requestObject = {
        accession_type: accessionTypeID,
        accession_date: accessionDate
          ? moment(accessionDate).format("YYYY-MM-DD")
          : null,
        taxonomy_id: sepciesID,
        enclosure_id: destination?.enclosure_id,
        organization_id: selectOrganizationTypeID,
        from_institution: institutionTypeID,
        ownership_term: OwnershipTypeID,
        section_id: destination?.section_id,
        site_id: destination?.site_id,
        // sex: (value === 'single'
        //   ? selectSexTypeID
        //   : { male: maleCount, female: femaleCount, undetermined: undeterminedCount, indetermined: indeterminateCount }),
        collection_type: selectCollectionTypeID, //
        birth_date: birthDate ? moment(birthDate).format("YYYY-MM-DD") : null,
        local_id_type: selectIdentifierTypeID,
        local_id: localIdentifier,
        description: "Add Animal",
        form_type: value,
        zoo_id: zooID,
        parent_female: "",
        parent_male: "",
        age: age > 0 ? age + dateComponent : null,
      };

      if (value === "single") {
        requestObject.sex = selectSexTypeID;
        if (selectOrganizationTypeID == "") {
          delete requestObject["organization_id"];
        }
      } else {
        requestObject.male = maleCount;
        requestObject.female = femaleCount;
        requestObject.undetermined = undeterminedCount;
        requestObject.indeterminate = indeterminateCount;
        if (selectOrganizationTypeID == "") {
          delete requestObject["organization_id"];
        }
      }
      addAnimal(requestObject)
        .then((response) => {
          if (response.success) {
            // setAnimalId(response?.data?.animal_id);

            // successToast("success", response?.message);
            setLoding(false);
            const animal_id = response?.data?.animal_id;
            // showAlert(animal_id);

            // successDailog(
            //   "Confirmation",
            //   "Do you want to Add more Animals ?",
            //   "Ok",
            //   () => {
            //     setLoding(true), resetState();
            //   },
            //   "Cancel",
            //   () => {
            //     dispatch(removeAnimalMovementData());
            //     if (animal_id) {
            //       navigation.replace("AnimalsDetails", { animal_id });
            //     } else {
            //       navigation.replace("AnimalList", {
            //         type: AnimalStatsType.recentlyAdded,
            //         name: "Recently Added",
            //       });
            //     }
            //   }
            // );

            setDialougeTitle(response?.message);
            setType("addAnimal");
            setAnimalId(animal_id);
            setAlertType(Config.SUCCESS_TYPE);
            setisAddAnimal(true);
            setTimeout(() => {
              alertModalOpen();
            }, Constants.GLOBAL_ALERT_TIMEOUT_VALUE);
          } else {
            showToast("error", response?.message);
          }
        })
        .catch((error) => {
          showToast("error", "Oops! Something went wrong!");
          setLoding(false);
        })
        .finally(() => {
          setLoding(false);
          // setIsAnimalAdded(true)
          // alert("Animal Added Successfully");
          // confirm("Press a button!");
          // showAlert()
        });
    }
  };

  useEffect(() => {
    getData();
    setErrorMessage({});
  }, []);

  const getData = () => {
    setLoding(true);
    let postData = {
      zoo_id: zooID,
    };
    let postDataSection = {
      zoo_id: zooID,
      page: 1,
      offset: 10,
      selected_site_id: null,
      filter_empty_enclosures: 1,
    };
    Promise.all([
      listAccessionType(),
      getAnimalConfigs(),
      getOrganization(zooID),
      getHousingSection(postDataSection),
    ])
      .then((res) => {
        setAccessionTypeData(
          res[0].data.map((item) => ({
            id: item.accession_id,
            name: item.accession_type,
            dob_required: item.dob_required,
          }))
        );
        setSelectCollectionTypeData(
          res[1].data.collection_type.map((item) => ({
            id: item.id,
            name: item.label,
          }))
        );
        setSelectIdentifierTypeData(
          res[1].data.animal_indetifier.map((item) => ({
            id: item.id,
            name: item.label,
          }))
        );
        setSelectOrganizationTypeData(
          res[2]?.map((item) => ({
            id: item?.id,
            name: item?.organization_name,
          }))
        );
        if (res[3]?.sections[0]?.length == 1) {
          if (res[3]?.sections[0][0]?.total_enclosures == 1) {
            getParentEnclosureData(res[3]?.sections[0][0]?.section_id);
          }
        }

        {
          /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
        if (value === "single") {
          
          setinput2Focus(false);
          handleSubmitFocus(accessRef)
        } else {
          setIsAcsnTypeMenuOpen(false);
          setinput2Focus(true);
          handleSubmitFocus(maleRef,1000);
        }*/
        }
      })
      .catch((err) => {
        showToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoding(false);
      });
  };

  const getParentEnclosureData = (id) => {
    let postData = {
      section_id: id,
      page_no: 1,
    };
    getParentOrChildEnc(postData)
      .then((res) => {
        if (res?.success) {
          if (res?.data?.length == 1) {
            dispatch(setDestination(res?.data[0]));
          }
        }
      })
      .catch((err) => {
        errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setLoding(false);
      });
  };
  const maleRef = useRef(null);
  const femaleRef = useRef(null);
  const undeterminedRef = useRef(null);
  const indeterminateRef = useRef(null);
  const accessRef = useRef(null);
  const instituRef = useRef(null);
  const ownerShipRef = useRef(null);

  const taxonomyRef = useRef(null);
  const enclRef = useRef(null);
  const sexRef = useRef(null);
  const collectionRef = useRef(null);
  const identifierTypeRef = useRef(null);
  const organizationRef = useRef(null);
  const localIdentifierRef = useRef(null);
  const datePicker1Ref = useRef(null);
  const datePicker21Ref = useRef(null);
  const handleSubmitFocus = (refs, time) => {
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
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
    }*/
    }
  };

  // useEffect(() => {
  //   if (value === "single") {
  //     setIsAcsnTypeMenuOpen(true)
  //     setinput2Focus(false);
  //     handleSubmitFocus(accessRef)
  //   } else {
  //     setIsAcsnTypeMenuOpen(false);
  //     setinput2Focus(true);
  //     handleSubmitFocus(maleRef);
  //   }
  // }, [value]);

  // const acessDropdownOpen = () => {
  //   setIsAcsnTypeMenuOpen(true)
  // };

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

  const checkNumber = (number) => {
    setIsError({ batchOptions: false });
    const pattern = /^[1-9][0-9]*$/;
    let result = pattern.test(number);
    if (!result) {
      setIsError({ batchOptions: true });
      setErrorMessage({ batchOptions: "Only number accepted" });
    }
    return result;
  };

  const dropdownOff = () => {
    setIsAcsnTypeMenuOpen(false);
    setIsInstituteTypeMenuOpen(false);
    setIsSelectSexType(false);
    setIsSelectCollectionType(false);
    setIsSelectIdentifierType(false);
  };

  useEffect(() => {
    const backAction = () => {
      // warningDailog(
      //   "Confirmation",
      //   "Are you sure you want to go back?",
      //     "YES",
      //     () => navigation.goBack(),
      //     "NO"
      //   );

      setDialougeTitle("Are you sure you want to go back?");
      setType("backConfirmation");
      setAlertType(Config.ERROR_TYPE);
      setisAddAnimal(false);
      alertModalOpen();

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const goBack = () => {
    dispatch(setDestination(null));
    navigation.goBack();
  };

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  return (
    <>
      <CustomForm
        header={true}
        key={clearTextInputKey}
        title={"Add Animal"}
        marginBottom={60}
        onPress={() => handleOnPress()}
        back={goBack}
      >
        <Loader visible={isLoading} />
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "single",
              label: "Single",
              style: reduxColors.button,
              showSelectedCheck: true,
            },
            {
              value: "batch",
              label: "Batch",
              style: reduxColors.button,
              showSelectedCheck: true,
            },
          ]}
          style={reduxColors.group}
        />
        {value === "batch" ? (
          <View style={{ display: "flex" }}>
            <List.Section>
              <List.Accordion
                title="Batch Count"
                id="1"
                titleStyle={{
                  color: constThemeColor.onPrimaryContainer,
                  fontSize: FontSize.Antz_Minor_Medium.fontSize,
                  fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                  marginLeft: -8,
                }}
                style={{
                  backgroundColor: constThemeColor.onPrimary,
                  paddingLeft: 0,
                }}
                right={(props) => (
                  <List.Icon
                    {...props}
                    icon="minus"
                    style={{ display: "none" }}
                  />
                )}
                expanded={!expanded.batchOptions}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <View
                    style={{
                      width: widthPercentageToDP("42%"),
                      // paddingHorizontal: 5,
                      // paddingRight: 5,
                    }}
                  >
                    <InputBox
                      refs={maleRef}
                      autoFocus={input2Focus}
                      inputLabel={"# Male"}
                      placeholder={"Male"}
                      keyboardType={"numeric"}
                      onFocus={dropdownOff}
                      style={{
                        marginVertical: 2.5,
                        marginHorizontal: 1,
                      }}
                      // onSubmitEditing={() => handleSubmitFocus(femaleRef)}
                      value={maleCount}
                      onChange={(value) => {
                        checkNumber(value)
                          ? setMaleCount(value)
                          : setMaleCount("");
                      }}
                      // errors={errorMessage.enclosureName}
                      // isError={isError.enclosureName}
                    />
                  </View>
                  <View
                    style={{
                      width: widthPercentageToDP("42%"),
                      // paddingHorizontal: 5,
                      // paddingLeft: 5,
                    }}
                  >
                    <InputBox
                      refs={femaleRef}
                      inputLabel={"# Female"}
                      placeholder={"Female"}
                      keyboardType={"numeric"}
                      onFocus={dropdownOff}
                      value={femaleCount}
                      style={{
                        marginVertical: 2.5,
                        marginHorizontal: 1,
                      }}
                      onChange={(value) => {
                        checkNumber(value)
                          ? setFemaleCount(value)
                          : setFemaleCount("");
                      }}
                      // onSubmitEditing={() => handleSubmitFocus(undeterminedRef)}
                      // errors={errorMessage.enclosureName}
                      // isError={isError.enclosureName}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    // paddingHorizontal: 2,
                  }}
                >
                  <View
                    style={{
                      width: widthPercentageToDP("42%"),
                    }}
                  >
                    <InputBox
                      refs={undeterminedRef}
                      inputLabel={"# Undetermined"}
                      placeholder={"Undetermined"}
                      keyboardType={"numeric"}
                      onFocus={dropdownOff}
                      value={undeterminedCount}
                      style={{
                        marginVertical: 2.5,
                        marginHorizontal: 1,
                      }}
                      onChange={(value) => {
                        checkNumber(value)
                          ? setUndeterminedCount(value)
                          : setUndeterminedCount("");
                      }}
                      // onSubmitEditing={() => handleSubmitFocus(indeterminateRef)}
                      // errors={errorMessage.enclosureName}
                      // isError={isError.enclosureName}
                    />
                  </View>
                  <View
                    style={{
                      width: widthPercentageToDP("42%"),
                    }}
                  >
                    <InputBox
                      refs={indeterminateRef}
                      inputLabel={"# Indeterminate"}
                      placeholder={"Indeterminate"}
                      keyboardType={"numeric"}
                      onFocus={dropdownOff}
                      style={{
                        marginVertical: 2.5,
                        marginHorizontal: 1,
                      }}
                      value={indeterminateCount}
                      onChange={(value) => {
                        checkNumber(value)
                          ? setIndeterminateCount(value)
                          : setIndeterminateCount("");
                      }}
                      // onSubmitEditing={() => setIsAcsnTypeMenuOpen(true)}
                      // errors={errorMessage.enclosureName}
                      // isError={isError.enclosureName}
                    />
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
              </List.Accordion>
            </List.Section>
          </View>
        ) : null}
        <List.Section>
          <List.Accordion
            title="Basic Information"
            id="1"
            titleStyle={{
              color: constThemeColor.onPrimaryContainer,
              fontSize: FontSize.Antz_Minor_Medium.fontSize,
              fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
              marginLeft: -8,
            }}
            style={{
              backgroundColor: constThemeColor.onPrimary,
              paddingLeft: 0,
            }}
            right={(props) => (
              <List.Icon {...props} icon="minus" style={{ display: "none" }} />
            )}
            expanded={!expanded.Basic}
          >
            <View style={{ marginBottom: 0, paddingHorizontal: 0 }}>
              <AutoCompleteSearch
                refs={taxonomyRef}
                placeholder="Enter minimum 3 characters"
                label="Species/Taxonomy"
                value={species}
                onPress={catTaxonomydata}
                errors={errorMessage.species}
                isError={isError.species}
                onClear={() => {
                  setSpeciesID("");
                  setSpecies("");
                }}
                // isNeedToClear={isNeedToClear}
              />
              <InputBox
                inputLabel={"Accession Type"}
                placeholder={"Choose accession"}
                refs={accessRef}
                editable={false}
                rightElement={isAcsnTypeMenuOpen ? "menu-up" : "menu-down"}
                value={accessionType}
                DropDown={SetAcsnTypeDropDown}
                onFocus={SetAcsnTypeDropDown}
                // defaultValue={
                //   enclosureEnvironment != null
                //     ? enclosureEnvironment
                //     : null
                // }
                errors={errorMessage.accessionType}
                isError={isError.accessionType}
              />
              {accessionType == "From Institution" ? (
                <InputBox
                  inputLabel={"Institution"}
                  placeholder={"Choose Institution"}
                  edit={accessionType == "From Institution" ? true : false}
                  rightElement={
                    isInstituteTypeMenuOpen ? "menu-up" : "menu-down"
                  }
                  value={institutionType}
                  DropDown={SetInstituteTypeDropDown}
                  onFocus={SetInstituteTypeDropDown}
                  errors={errorMessage.institutionType}
                  isError={isError.institutionType}
                  style={{
                    marginVertical: 8,
                  }}
                />
              ) : null}
              <InputBox
                inputLabel={"Ownership Term"}
                placeholder={"Ownership Term"}
                refs={ownerShipRef}
                editable={false}
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
              <View>
                <DatePicker
                  title="Accession Date"
                  style={{ borderBottomLeftRadius: 0 }}
                  today={accessionDate}
                  refs={datePicker1Ref}
                  minimumDate={birthDate}
                  maximumDate={new Date()}
                  mode={"date"}
                  onChange={(date) => {
                    setAccessionDate(date);
                  }}
                  errors={errorMessage.accessionDate}
                  isError={isError.accessionDate}
                  onOpen={dropdownOff}
                />

                <View style={reduxColors.destinationBox}>
                  <TouchableOpacity
                    disabled={
                      props.route?.params?.type == "enclosure" ? true : false
                    }
                    onPress={
                      props.route?.params?.type == "enclosure"
                        ? undefined
                        : gotoSelectScreen
                    }
                    style={[
                      reduxColors.animalCardStyle,
                      {
                        minHeight: destination?.enclosure_id
                          ? heightPercentageToDP(14)
                          : 50,
                      },
                      {
                        borderColor:
                          isError.selectEnclosure && !destination?.enclosure_id
                            ? constThemeColor.error
                            : constThemeColor.outline,
                      },
                      {
                        backgroundColor: destination?.enclosure_id
                          ? constThemeColor.displaybgPrimary
                          : constThemeColor.surface,
                      },
                      {
                        borderWidth: destination?.enclosure_id ? 2 : 1,
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
                            incharge={
                              " " + (destination?.incharge_name ?? "NA")
                            }
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
                {isError.selectEnclosure && !destination?.enclosure_id ? (
                  <View style={reduxColors.errorBox}>
                    <Text style={reduxColors.errorMessage}>
                      {errorMessage.selectEnclosure}
                    </Text>
                  </View>
                ) : null}

                {value === "single" ? (
                  <InputBox
                    inputLabel={"Sex Type"}
                    placeholder={"Choose Sex"}
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
                  inputLabel={"Collection Type"}
                  placeholder={"Choose collection"}
                  editable={false}
                  refs={collectionRef}
                  DropDown={SetCollectionTypeDown}
                  onFocus={SetCollectionTypeDown}
                  value={selectCollectionType}
                  rightElement={
                    isSelectCollectionType ? "menu-up" : "menu-down"
                  }
                  //   defaultValue={section != null ? section : null}
                  errors={errorMessage.selectCollectionType}
                  isError={isError.selectCollectionType}
                />

                <InputBox
                  inputLabel={"Select Organization"}
                  placeholder={"Choose Organization"}
                  editable={false}
                  refs={organizationRef}
                  DropDown={SetOrganizationDown}
                  onFocus={SetOrganizationDown}
                  value={selectOrganizationType}
                  rightElement={
                    isSelectOrganizationType ? "menu-up" : "menu-down"
                  }
                  errors={errorMessage.selectOrganizationType}
                  isError={isError.selectOrganizationType}
                />
              </View>
              <DatePicker
                title="Birth Date"
                style={{ borderBottomLeftRadius: 0 }}
                today={birthDate}
                onChange={getBirthDate}
                maximumDate={new Date()}
                onOpen={dropdownOff}
                isError={isError.birthDate}
                errors={errorMessage.birthDate}
              />
              {/* {isError.birthDate ? (
                <Text
                  style={{
                    color: constThemeColor.error,
                    paddingHorizontal: 4,
                  }}
                >
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
                  color: constThemeColor.error,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                    width: "100%",
                    marginBottom: 8,
                  }}
                >
                  <View style={{ width: "35%" }}>
                    <InputBox
                      inputLabel={"Enter Age"}
                      placeholder={"Approx Age"}
                      keyboardType={"numeric"}
                      value={age}
                      onFocus={dropdownOff}
                      autoFocus={
                        accessionType == "House Breeding" && !age ? true : false
                      }
                      style={{
                        // height: 48,
                        fontSize: FontSize.Antz_Body_Title.fontSize,
                        flex: 1,
                        marginRight: 10,
                      }}
                      // onChange={handleAge}
                      onChange={(value) => {
                        checkNumber(value)
                          ? handleDate(dateComponent, value)
                          : setAge("");
                      }}
                      // errors={errorMessage.enclosureSunlight}
                      // isError={isError.enclosureSunlight}
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
                        style={[
                          reduxColors.botton,
                          {
                            // borderLeftWidth: Platform.OS == "ios" ? 0 : 0.8,
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
                </View>
                <View>
                  {isError.batchOptions !== true ? null : (
                    <Text style={{ color: constThemeColor.error }}>
                      {errorMessage.batchOptions}
                    </Text>
                  )}
                </View>
                {/* Remove parent father mother as per nidhin said */}
                {/* <InputBox
                  inputLabel={"Parent Female"}
                  placeholder={"Choose Parent Female"}
                  multiline={Platform.OS === "android" ? false : true}
                  value={genderMother}
                  rightElement={isMother ? "menu-up" : "menu-down"}
                  DropDown={SetIsMotherDown}
                  onFocus={SetIsMotherDown}
                  errors={errorMessage.genderMother}
                  isError={isError.genderMother}
                />
                <InputBox
                  inputLabel={"Parent Male"}
                  placeholder={"Choose Parent Male"}
                  value={genderFather}
                  rightElement={isFather ? "menu-up" : "menu-down"}
                  DropDown={SetIsFatherDown}
                  onFocus={SetIsFatherDown}
                  errors={errorMessage.genderFather}
                  isError={isError.genderFather}
                /> */}
                {value === "single" ? (
                  <View style={{ display: "flex" }}>
                    <InputBox
                      inputLabel={"Local Identifier Type"}
                      placeholder={"Choose Local Identifier"}
                      editable={false}
                      refs={identifierTypeRef}
                      value={selectIdentifierType}
                      onFocus={SetIdentifierTypeDown}
                      DropDown={SetIdentifierTypeDown}
                      rightElement={
                        isSelectIdentifierType ? "menu-up" : "menu-down"
                      }
                    />
                    {selectIdentifierType !== "" && (
                      <InputBox
                        inputLabel={"Local Identifier"}
                        placeholder={"Enter Local Identifier"}
                        refs={localIdentifierRef}
                        value={localIdentifier}
                        onFocus={dropdownOff}
                        onChange={(value) =>
                          setLocalIdentifier(value.replace(/^\s+/, ""))
                        }
                        errors={errorMessage.localIdentifier}
                        isError={isError.localIdentifier}
                      />
                    )}
                  </View>
                ) : null}
              </View>
            </View>
          </List.Accordion>
        </List.Section>

        {/* <List.Section>
          <List.Accordion
            title="Additional Information "
            id="1"
            titleStyle={{
              color: constThemeColor.onPrimaryContainer,
              fontSize: FontSize.Antz_Minor_Medium.fontSize,
              fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
              marginLeft: -2,
            }}
            style={{
              backgroundColor: constThemeColor.onPrimary,
              paddingLeft: 0,
              marginTop: -20,
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
            
          </List.Accordion>
        </List.Section> */}
      </CustomForm>

      <DialougeModal
        isVisible={isModalVisible}
        alertType={alertType}
        title={DialougeTitle}
        closeModal={alertModalClose}
        firstButtonHandle={confirmButtonPress}
        secondButtonHandle={cancelButtonPress}
        thirdButtonHandle={GotoAnimalList}
        firstButtonText={type == "backConfirmation" ? "Yes" : "Add more"}
        addMore={type == "backConfirmation" ? false : true}
        secondButtonText={
          type == "backConfirmation"
            ? "No"
            : AnimalId
            ? "Go to animal details"
            : "Go to animal list"
        }
        thirdButtonText={AnimalId ? "Go to animal list" : null}
        firstButtonStyle={{
          backgroundColor:
            type == "backConfirmation" ? constThemeColor.error : "",
          borderWidth: type != "backConfirmation" ? 1 : 0,
        }}
        firstButtonTextStyle={{
          color:
            type == "backConfirmation"
              ? constThemeColor.onPrimary
              : constThemeColor.onSurfaceVariant,
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
          title="Ownership Term"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedOwnershipTypePressed}
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
          isSelectedId={isSelectedCollectionTypePressed}
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
          title="Choose Identifier Type"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedIdentifierTypePressed}
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
          isSelectedId={isSelectedOrganizationTypePressed}
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

      {/* Remove parent father mother as per nidhin said */}
      {/* {isMother ? (
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
              heading={"Select Parent Female"}
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
              heading={"Select Parent Male"}
              isMulti={true}
              onClose={IsFatherClose}
            />
          </Modal>
        </View>
      ) : null} */}
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
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onPrimaryContainer,
      //"rgba(0,0,0,0.5)",
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

    dateFirstComponent: {
      backgroundColor: reduxColors.surface,
      borderRadius: 5,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: Platform.OS == "ios" ? 0.8 : 0,
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
      borderWidth: 1,
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
      // height: heightPercentageToDP("6.2%"),
      height: 50,
    },
    ageSelectContainer1: {
      borderWidth: 2,
      flexDirection: "row",
      borderRadius: 5,
      borderColor: reduxColors.outline,
      alignItems: "center",
      height: 50,
      width: widthPercentageToDP("57.05%"),
    },
    animalCardStyle: {
      justifyContent: "center",
      width: "100%",
      borderRadius: 4,
      minHeight: heightPercentageToDP(6.5),
    },
    destinationBox: {
      marginTop: 12,
      marginBottom: 8,
    },
    animalTextStyle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      paddingLeft: 15,
    },
    errorBox: {
      textAlign: "left",
      width: "90%",
    },
    errorMessage: {
      color: reduxColors.error,
    },
    group: {
      paddingHorizontal: 30,
      justifyContent: "center",
      marginTop: 30,
    },
  });

export default AnimalAddForm;
