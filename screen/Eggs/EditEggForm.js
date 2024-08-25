// created by Wasim Akram

import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
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
} from "react-native";
import { Checkbox, List, SegmentedButtons } from "react-native-paper";
import InputBox from "../../components/InputBox";
import DatePicker from "../../components/DatePicker";
import { listAccessionType } from "../../services/AccessionService";
import { GetEnclosure } from "../../services/FormEnclosureServices";
import moment from "moment";
import Loader from "../../components/Loader";
import {
  DeleteEggsEditList,
  editData,
  getEggConfigData,
  getParentEnclosure,
  getTaxonomic,
} from "../../services/EggsService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { AutoCompleteSearch } from "../../components/AutoCompleteSearch";
import Modal from "react-native-modal";
import Colors from "../../configs/Colors";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { capitalize, ifEmptyValue } from "../../utils/Utils";
import { AntDesign } from "@expo/vector-icons";
import RequestBy from "../../components/Move_animal/RequestBy";
import FontSize from "../../configs/FontSize";
import { setDestination } from "../../redux/AnimalMovementSlice";
import { instituteList } from "../../services/MedicalMastersService";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import Spacing from "../../configs/Spacing";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";

const EditEggForm = (props) => {
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();
  const [egg_id, setEgg_id] = useState(props.route.params?.item?.egg_id ?? 0);
  const [accessionType, setAccessionType] = useState(
    props.route.params?.item?.accession ?? ""
  );
  const [accessionTypeID, setAccessionTypeID] = useState(
    props.route.params?.item?.accession_type ?? ""
  );
  const [accessionTypeData, setAccessionTypeData] = useState([]);
  const [isAcsnTypeMenuOpen, setisAcsnTypeMenuOpen] = useState(false);

  const [institutionType, setInstitutionType] = useState(
    props.route.params?.item?.institutes_label ?? ""
  );
  const [isInstituteTypeMenuOpen, setIsInstituteTypeMenuOpen] = useState(false);
  const [institutionTypeID, setInstitutionTypeID] = useState(
    props.route.params?.item?.from_institution ?? null
  );
  const [institutionTypeData, setInstitutionTypeData] = useState([]);

  const [selectEnclosure, setSelectEnclosure] = useState(
    props.route.params?.item?.enclosure_name ?? ""
  );
  const [selectEnclosureID, setSelectEnclosureID] = useState(
    props.route.params?.item?.enclosure_id ?? ""
  );
  const [selectEnclosureData, setSelectEnclosureData] = useState([]);
  const [isSelectEnclosure, setIsSelectEnclosure] = useState(false);

  const [species, setSpecies] = useState(
    props.route.params?.item?.vernacular_name ??
      props.route.params?.item?.complete_name ??
      ""
  );
  const [sepciesID, setSpeciesID] = useState(
    props.route.params?.item?.taxonomy_id ?? ""
  );
  const [speciesData, setSpeciesData] = useState([]);
  const [isSpecies, setIsSpecies] = useState(false);

  const [markLayDate, setMarkLayDate] = useState(
    Boolean(props.route.params?.item?.lay_date_approx) ?? false
  );

  const [clutch, setClutch] = useState(props.route.params?.item?.clutch ?? "");

  const [gastation, SetGastation] = useState(
    props.route.params?.item?.hatching_period ?? ""
  );

  const [layDate, setLayDate] = useState(
    props.route.params?.item?.lay_date ?? new Date()
  );
  const [foundDate, setFoundDate] = useState(
    props.route.params?.item?.found_date ?? new Date()
  );

  const [fertilityStatus, setFertilityStatus] = useState(
    props.route.params?.item?.fertility ?? ""
  );
  const [fertilityStatusID, setFertilityStatusID] = useState(
    props.route.params?.item?.fertility_status ?? ""
  );
  const [fertilityStatusData, setFertilityStatusData] = useState([]);
  const [isFertilityStatus, setIsFertilityStatus] = useState(false);

  const [fertAsesmntMethod, setFertAsesmntMethod] = useState(
    props.route.params?.item?.fertility_assessment_method_label ?? ""
  );
  const [fertAsesmntMethodID, setFertAsesmntMethodID] = useState(
    props.route.params?.item?.fertility_assessment_method ?? ""
  );
  const [fertAsesmntMethodData, setFertAsesmntMethodData] = useState([]);
  const [isFertAsesmntMethod, setisFertAsesmntMethod] = useState(false);

  const [incubationType, setIncubationType] = useState(
    props?.route.params?.item?.incubation_type_label ?? ""
  );
  const [incubationTypeID, setIncubationTypeID] = useState(
    props?.route.params?.item?.incubation_type ?? ""
  );
  const [incubationTypeData, setIncubationTypeData] = useState([]);
  const [isIncubationType, setIsIncubationType] = useState(false);

  const [motherType, setMotherType] = useState(
    props?.route.params?.item?.parent_female
      ? props?.route.params?.item?.parent_female[0]?.parents
          ?.map((value) => value.local_id)
          .join(", ")
      : ""
  );
  const [motherTypeId, setMotherTypeId] = useState(
    props?.route.params?.item?.parent_female
      ? props?.route.params?.item?.parent_female[0]?.parents
          ?.map((value) => value.animal_id)
          .join(", ")
      : ""
  );
  const [isParentMotherTypeData, setIsParentMotherTypeData] = useState([]);
  const [isParentMotherType, setIsParentMotherType] = useState(false);

  const [fatherType, setFatherType] = useState(
    props?.route.params?.item?.parent_male
      ? props?.route.params?.item?.parent_male[0]?.parents
          ?.map((value) => value.local_id)
          .join(", ")
      : ""
  );
  const [fatherTypeId, setFatherTypeId] = useState(
    props?.route.params?.item?.parent_male
      ? props?.route.params?.item?.parent_male[0]?.parents
          ?.map((value) => value.animal_id)
          .join(", ")
      : ""
  );
  const [isParentFatherTypeData, setIsParentFatherTypeData] = useState([]);
  const [isParentFatherType, setIsparentFatherType] = useState(false);

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [isLoading, setIsLoding] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const permission = useSelector((state) => state.UserAuth.permission);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const destination = useSelector((state) => state.AnimalMove.destination) ?? {
    ...props.route.params?.item,
    user_enclosure_name: props.route.params?.item?.enclosure_name,
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const [insti, setInsti] = useState(false);

  // update: by md kalam ansari , add the minus plus icon insted of arrow dropdown icons
  const [expanded, setExpanded] = React.useState({
    Basic: true,
    Additional: false,
    Fertility: false,
  });

  const [motherData, setMotherData] = useState(false);
  const [fatherData, setFatherData] = useState(false);
  const [deletes, setDeeltes] = useState(props.route.params?.deleted);
  useEffect(() => {
    if (accessionType && accessionType == "From Institution") {
      setInsti(true);
    } else {
      setInsti(false);
    }
  }, [accessionType]);

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
        // errorToast("Oops!", "Something went wrong!!");
      } finally {
      }
    };

    getRefreshData();
  }, []);

  useEffect(() => {
    setIsLoding(true);
    listAccessionType()
      .then((res) => {
        setAccessionTypeData(
          res.data.map((item) => {
            return {
              id: item.accession_id,
              name: item.accession_type,
              isSelect: item.accession_id == accessionTypeID ? true : false,
            };
          })
        );
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        {
          /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
        handleSubmitFocus(accessRef) */
        }
        setIsLoding(false);
      });
  }, []);
  useEffect(() => {
    setIsLoding(true);
    let postData = {
      zoo_id: zooID,
    };
    GetEnclosure(postData)
      .then((res) => {
        setSelectEnclosureData(
          res.data.map((item) => {
            return {
              id: item.enclosure_id,
              name: item.user_enclosure_name,
              isSelect: item.enclosure_id == selectEnclosureID ? true : false,
            };
          })
        );
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setIsLoding(false);
      });
  }, []);

  useEffect(() => {
    setIsLoding(true);
    getEggConfigData()
      .then((res) => {
        setFertilityStatusData(
          res.data.fertility_type.map((item) => {
            return {
              id: item.fertility_id,
              name: item.text,
              isSelect: item.fertility_id == fertilityStatusID ? true : false,
            };
          })
        );
        setFertAsesmntMethodData(
          res.data.fertility_assessment.map((item) => {
            return {
              id: item.id,
              name: item.label,
              isSelect: item.id == fertAsesmntMethodID ? true : false,
            };
          })
        );
        setIncubationTypeData(
          res.data.incubation_type.map((item) => {
            return {
              id: item.id,
              name: item.label,
              isSelect: item.id == incubationTypeID ? true : false,
            };
          })
        );
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setIsLoding(false);
      });
  }, []);

  const setParentMother = useSelector((state) =>
    Object.keys(state?.AnimalMove?.motherAnimal)?.length > 0
      ? [state.AnimalMove.motherAnimal]
      : props.route.params?.item?.parent_female
      ? props.route.params?.item?.parent_female[0]?.parents ?? null
      : // props.route.params?.item?.parent_female[0]?.parents
        null
  );
  const setParentFather = useSelector((state) =>
    state.AnimalMove.fatherAnimal?.length > 0
      ? state.AnimalMove.fatherAnimal
      : props.route.params?.item?.parent_male
      ? props.route.params?.item?.parent_male[0]?.parents ?? null
      : null
  );
  const validation = () => {
    if (accessionType.length === 0) {
      setIsError({ accessionType: true });
      setErrorMessage({ accessionType: "Select Accession Type Options" });
      return false;
    } else if (accessionType == "From Institution" && !institutionType) {
      setIsError({ institutionType: true });
      setErrorMessage({ institutionType: "Select Institution" });
      return false;
    } else if (!destination?.user_enclosure_name?.length) {
      setIsError({ selectEnclosure: true });
      setErrorMessage({ selectEnclosure: "Select Enclosure Options" });
      return false;
    } else if (species.length === 0) {
      setIsError({ species: true });
      setErrorMessage({ species: "Select the Species/Taxonomy Options" });
      return false;
    } else if (layDate.length === 0) {
      setIsError({ layDate: true });
      setErrorMessage({ layDate: "Select the Lay Date" });
      return false;
    } else if (foundDate.length === 0) {
      setIsError({ foundDate: true });
      setErrorMessage({
        foundDate: "Select the Found Date ",
      });
      return false;
    }
    return true;
  };
  // function for post the Edit Api
  const editEggData = () => {
    if (validation()) {
      let obje = {
        accession_type: accessionTypeID,
        enclosure_id: destination?.enclosure_id,
        taxonomy_id: sepciesID,
        lay_date: moment(layDate).format("YYYY-MM-DD"),
        found_date: moment(foundDate).format("YYYY-MM-DD"),
        from_institution: institutionTypeID,
        nest_location: "4",
        parent_female:
          setParentMother?.length > 0
            ? setParentMother.map((value) => value.animal_id).join(",")
            : "",
        parent_male:
          setParentFather?.length > 0
            ? setParentFather.map((value) => value.animal_id).join(",")
            : "",
        description: "Edit egg",
        zoo_id: zooID,
        lay_date_approx: markLayDate,
        // hatched_status:1,
        egg_id: egg_id,
        gestation_period: gastation,
        clutch: clutch,
        fertility_status: fertilityStatusID,
        fertility_assessment_method: fertAsesmntMethodID,
        incubation_type: incubationTypeID,
      };
      setIsLoding(true);
      editData(obje)
        .then((res) => {
          if (res.success) {
            setIsLoding(false);
            successToast("success", res.message);
            navigation.goBack();
          }
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!!");
        })
        .finally(() => {
          setIsLoding(false);
        });
    }
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [type, setType] = useState("");
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const firstButtonPress = () => {
    if (type === "delete") {
      alertModalClose();
      DeleteEggDataFunc();
    } else if (type === "back") {
      alertModalClose();
      navigation.goBack();
    }
  };
  const secondButtonPress = () => {
    alertModalClose();
  };
  const DeleteEggData = () => {
    if (permission["collection_animal_record_access"] == "DELETE") {
      setType("delete");
      setMessageTitle("Do you want to delete this egg?");
      alertModalOpen();
    } else {
      warningToast("warning", "You do not have permission to delete egg!!");
    }
  };
  // Delete Egg Function
  const DeleteEggDataFunc = () => {
    let obje = {
      egg_id: egg_id,
    };

    setIsLoding(true);
    DeleteEggsEditList(obje)
      .then((res) => {
        if (res.success) {
          setIsLoding(false);
          successToast("success", res.message);
          setTimeout(() => {
            navigation.replace("EggLists");
          }, 500);
        } else {
          warningToast("warning", res.message);
        }
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        // errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setIsLoding(false);
      });
  };

  // function for  select enclosure onCatPressed.
  const enclosurePressed = (item) => {
    let enclosure_id = item.map((value) => value.id).join(",");
    setSelectEnclosure(item.map((value) => value.name).join(","));
    setSelectEnclosureID(enclosure_id);
    setIsSelectEnclosure(!isSelectEnclosure);
    // setIsSpecies(true);
    // datePickerRef.current.focus();
    Promise.all([
      getParentEnclosure({ enclosure_id: enclosure_id, gender: "male" }),
      getParentEnclosure({ enclosure_id: enclosure_id, gender: "female" }),
    ])
      .then((res) => {
        setIsParentFatherTypeData(
          res[0].data.map((item) => {
            return {
              id: item.animal_id,
              name: item?.complete_name ?? "N/A",
            };
          })
        );
        setIsParentMotherTypeData(
          res[1].data.map((item) => {
            return {
              id: item.animal_id,
              name: item?.complete_name ?? "N/A",
            };
          })
        );
        {
          /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
        handleSubmitFocus(taxonomyRef, 1000);
        */
        }
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
      });
  };
  // function for  select Accession Type onCatPressed.
  const accessPressed = (item) => {
    setisAcsnTypeMenuOpen(!isAcsnTypeMenuOpen);
    setAccessionType(item.map((value) => value.name).join(","));
    setAccessionTypeID(item.map((value) => value.id).join(","));
    // setIsSelectEnclosure(true);
    setInstitutionType(null);
    {
      /* Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    enclRef.current.focus();*/
    }
  };

  //this is  function Taxonomay dropDwon Filed
  const catTaxonomydata = (item) => {
    if (item) {
      setSpecies(item.title);
      setSpeciesID(item.id);
      // datePickerRef.current.focus();
    }
  };

  // function for  select Taxonomy onCatPressed.
  const fertilityAssessPressed = (item) => {
    setisFertAsesmntMethod(!isFertAsesmntMethod);
    setFertAsesmntMethod(item.map((value) => value.name).join(","));
    setFertAsesmntMethodID(item.map((value) => value.id).join(","));
    // setIsIncubationType(true);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    incubationRef.current.focus();*/
    }
  };
  // function for  select Fertility onCatPressed.
  const fertilityPressed = (item) => {
    setIsFertilityStatus(!isFertilityStatus);
    setFertilityStatus(item.map((value) => value.name).join(","));
    setFertilityStatusID(item.map((value) => value.id).join(","));
    // setisFertAsesmntMethod(true);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    fertAsesmntMethodRef.current.focus();*/
    }
  };
  // function for  select incubationType onCatPressed.
  const incubationPressed = (item) => {
    setIsIncubationType(!isIncubationType);
    setIncubationType(item.map((value) => value.name).join(","));
    setIncubationTypeID(item.map((value) => value.id).join(","));
  };
  // function for  select motherType onCatPressed.
  const motherPressed = (item) => {
    // setIsParentMotherType(!isParentMotherType);
    setMotherType(item.map((value) => value.name).join(","));
    setMotherTypeId(item.map((value) => value.id).join(","));
    motherTypeClose();
    // maleRef.current.focus();
  };
  // function for  select fatherType onCatPressed.
  const fatherPressed = (item) => {
    // setIsparentFatherType(!isParentFatherType);
    setFatherType(item.map((value) => value.name).join(","));
    setFatherTypeId(item.map((value) => value.id).join(","));
    fatherTypeClose();
    // gastationRef.current.focus();
  };
  const SetAcsnTypeDropDown = () => {
    setisAcsnTypeMenuOpen(!isAcsnTypeMenuOpen);
    setIsSelectEnclosure(false);
    setIsSpecies(false);
    setIsIncubationType(false);
    setisFertAsesmntMethod(false);
    setIsFertilityStatus(false);
    setIsParentMotherType(false);
    setIsparentFatherType(false);
  };
  const SetInstituteTypeDropDown = () => {
    setIsInstituteTypeMenuOpen(!isInstituteTypeMenuOpen);
    setIsSelectEnclosure(false);
    setIsSpecies(false);
    setIsIncubationType(false);
    setisFertAsesmntMethod(false);
    setIsFertilityStatus(false);
    setIsParentMotherType(false);
    setIsparentFatherType(false);
  };
  const institutePressed = (item) => {
    setIsInstituteTypeMenuOpen(!isInstituteTypeMenuOpen);
    setInstitutionType(item.map((value) => value.name).join(","));
    setInstitutionTypeID(item.map((value) => value.id).join(","));
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
      datePicker1Ref.current.focus();*/
    }
  };
  const InstiClose = () => {
    setIsInstituteTypeMenuOpen(false);
  };

  const SetSelectEncDropDown = () => {
    setIsSelectEnclosure(!isSelectEnclosure);
    setisAcsnTypeMenuOpen(false);
    setIsSpecies(false);

    setIsIncubationType(false);
    setisFertAsesmntMethod(false);
    setIsFertilityStatus(false);
  };

  const SetSpeciesDown = () => {
    setIsSpecies(!isSpecies);
    setIsSelectEnclosure(false);
    setisAcsnTypeMenuOpen(false);

    setIsIncubationType(false);
    setisFertAsesmntMethod(false);
    setIsFertilityStatus(false);
  };

  const onPressMarkLayDate = () => {
    setMarkLayDate(!markLayDate);
  };
  // function for open fertility dropdown.
  const SetFertilityDown = () => {
    setIsFertilityStatus(!isFertilityStatus);
    setIsSelectEnclosure(false);
    setisAcsnTypeMenuOpen(false);
    setIsSpecies(false);

    setIsIncubationType(false);
    setisFertAsesmntMethod(false);
  };
  // function for open fertility assesment method dropdown.
  const SetAsesmntMethodDown = () => {
    setisFertAsesmntMethod(!isFertAsesmntMethod);
    setIsSelectEnclosure(false);
    setisAcsnTypeMenuOpen(false);
    setIsSpecies(false);

    setIsIncubationType(false);
    setIsFertilityStatus(false);
  };
  // function for open incubationtype dropdown.
  const SetIncubationTypeDown = () => {
    setIsIncubationType(!isIncubationType);

    setIsSelectEnclosure(false);
    setisAcsnTypeMenuOpen(false);
    setIsSpecies(false);
    setisFertAsesmntMethod(false);
    setIsFertilityStatus(false);
  };
  // function for open motherParentType Dropdown.
  const SetMotherParentTypeDown = (data) => {
    setIsParentMotherType(data);
    setIsSelectEnclosure(false);
    setisAcsnTypeMenuOpen(false);
    setIsSpecies(false);
    setisFertAsesmntMethod(false);
    setIsFertilityStatus(false);
    setIsIncubationType(false);
  };
  // function for open fatherParentType Dropdown.
  const SetFatherParentTypeDown = () => {
    setIsparentFatherType(!isParentFatherType);
    setIsSelectEnclosure(false);
    setisAcsnTypeMenuOpen(false);
    setIsSpecies(false);
    setisFertAsesmntMethod(false);
    setIsFertilityStatus(false);
    setIsIncubationType(false);
    setIsParentMotherType(false);
  };

  const acsnClose = () => {
    setisAcsnTypeMenuOpen(false);
  };

  const encClose = () => {
    setIsSelectEnclosure(false);
  };

  const speciesClose = () => {
    setIsSpecies(false);
  };

  const fertStatusClose = () => {
    setIsFertilityStatus(false);
  };

  const assessmentMethodClose = () => {
    setisFertAsesmntMethod(false);
  };
  const incubationTypeClose = () => {
    setIsIncubationType(false);
  };
  const motherTypeClose = () => {
    setIsParentMotherType(false);
    // setIsparentFatherType(true);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    maleRef.current.focus();*/
    }
  };
  const fatherTypeClose = () => {
    setIsparentFatherType(false);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    gastationRef.current.focus();*/
    }
  };
  const getdateLay = (date) => {
    setLayDate(date);
  };
  const getdateFound = (date) => {
    setFoundDate(date);
  };
  const accessRef = useRef(null);
  const instituteRef = useRef(null);
  const gastationRef = useRef(null);
  const datePickerRef = useRef(null);
  const datePicker2Ref = useRef(null);
  const enclRef = useRef(null);
  const taxonomyRef = useRef(null);
  const femaleRef = useRef(null);
  const maleRef = useRef(null);
  const fertAsesmntMethodRef = useRef(null);
  const incubationRef = useRef(null);
  const handleSubmitFocus = (refs) => {
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 01.05.2023
    if (refs.current) {
      refs.current.focus();
    }*/
    }
  };

  const dropdownOff = () => {
    setIsInstituteTypeMenuOpen(false);
    setisAcsnTypeMenuOpen(false);
    setIsSelectEnclosure(false);
    setIsParentMotherType(false);
    setIsparentFatherType(false);
    setIsFertilityStatus(false);
    setisFertAsesmntMethod(false);
    setIsIncubationType(false);
  };

  const gotoSelectScreen = () => {
    navigation.navigate("SearchTransferanimal", {
      type: "Select",
    });
  };

  const gotoSearchScreenMother = (type) => {
    navigation.navigate("CommonAnimalSelect", { type });
    setMotherData(true);
  };

  const gotoSearchScreenFather = (type, limit) => {
    setFatherData(true);
    navigation.navigate("CommonAnimalSelect", { type, limit });
  };

  useEffect(() => {
    const backAction = () => {
      setType("back");
      setMessageTitle("Are you sure you want to go back?");
      alertModalOpen();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <>
      <Loader visible={isLoading} />
      <CustomForm
        header={true}
        title={"Edit Egg"}
        marginBottom={50}
        onPress={editEggData}
        deleteButton={DeleteEggData}
        deleteTitle={"Egg"}
      >
        <List.Section>
          <List.Accordion
            title="Basic Information"
            id="1"
            titleStyle={{
              color: isSwitchOn
                ? Colors.white
                : constThemeColor.onPrimaryContainer,
              fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
              fontSize: FontSize.Antz_Minor_Medium.fontSize,
              marginLeft: -8,
            }}
            style={{
              backgroundColor: isSwitchOn
                ? Colors.ContainerBackgroundColorDark
                : Colors.white,
              paddingLeft: 0,
            }}
            right={(props) => (
              <List.Icon {...props} icon="minus" style={{ display: "none" }} />
            )}
            expanded={expanded.Basic}
          >
            <View style={{}}>
              <View>
                <InputBox
                  inputLabel={"Accession Type"}
                  placeholder={"Enter Accession Type"}
                  refs={accessRef}
                  editable={false}
                  DropDown={SetAcsnTypeDropDown}
                  onFocus={SetAcsnTypeDropDown}
                  value={accessionType}
                  defaultValue={accessionType ? accessionType : null}
                  rightElement={isAcsnTypeMenuOpen ? "menu-up" : "menu-down"}
                  errors={errorMessage.accessionType}
                  isError={isError.accessionType}
                />

                <InputBox
                  inputLabel={"Choose Institution"}
                  placeholder={"Institution"}
                  edit={accessionType == "From Institution" ? true : false}
                  rightElement={
                    isInstituteTypeMenuOpen ? "menu-up" : "menu-down"
                  }
                  value={institutionType}
                  DropDown={SetInstituteTypeDropDown}
                  onFocus={SetInstituteTypeDropDown}
                  errors={errorMessage.institutionType}
                  isError={isError.institutionType}
                  helpText={
                    accessionType == "From Institution"
                      ? ""
                      : "Only if Accession Type is From Institution"
                  }
                />
                <View style={dynamicStyles.destinationBox}>
                  <TouchableOpacity
                    onPress={gotoSelectScreen}
                    style={[
                      dynamicStyles.animalCardStyle,
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
                        dynamicStyles.animalTextStyle,
                        {
                          paddingVertical: destination?.enclosure_id
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
                      <RequestBy
                        svgUri={true}
                        middleSection={
                          <View>
                            <Text
                              style={{
                                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                fontWeight:
                                  FontSize.Antz_Minor_Medium.fontWeight,
                                color: constThemeColor.onPrimaryContainer,
                                marginBottom: Spacing.small,
                              }}
                            >
                              {capitalize(
                                destination?.user_enclosure_name ??
                                  destination?.enclosure_name ??
                                  "NA"
                              )}
                            </Text>
                            {destination?.incharge_name ? (
                              <Text
                                style={{
                                  fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                  color: constThemeColor.onPrimaryContainer,
                                  marginBottom: Spacing.small,
                                }}
                              >
                                In Charge -
                                <Text
                                  style={{ color: constThemeColor.onSurface }}
                                >
                                  {" "}
                                  {destination?.incharge_name ?? "NA"}
                                </Text>
                              </Text>
                            ) : null}
                            <Text
                              style={{
                                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                color: constThemeColor.onPrimaryContainer,
                              }}
                            >
                              Section - {destination?.section_name ?? "NA"}
                            </Text>
                          </View>
                        }
                        rightSectoon={
                          <View
                            style={{
                              marginHorizontal: Spacing.minor,
                            }}
                          >
                            <AntDesign
                              name="right"
                              size={14}
                              color={constThemeColor.onSurfaceVariant}
                            />
                          </View>
                        }
                      />
                    ) : null}
                  </TouchableOpacity>
                </View>
                {isError.selectEnclosure && !destination?.enclosure_id ? (
                  <View style={dynamicStyles.errorBox}>
                    <Text style={dynamicStyles.errorMessage}>
                      {errorMessage.selectEnclosure}
                    </Text>
                  </View>
                ) : null}
                <AutoCompleteSearch
                  refs={taxonomyRef}
                  placeholder="Enter atleast 3 charecter to search..."
                  label="Species/Taxonomy"
                  value={species}
                  onPress={catTaxonomydata}
                  errors={errorMessage.species}
                  isError={isError.species}
                  onClear={() => {
                    setSpeciesID("");
                    setSpecies("");
                  }}
                />

                <View>
                  <DatePicker
                    title="Lay Date"
                    style={{ borderBottomLeftRadius: 0 }}
                    today={layDate}
                    refs={datePickerRef}
                    onOpen={dropdownOff}
                    maximumDate={new Date()}
                    onChange={(date) => {
                      [setLayDate(date)];
                    }}
                    errors={errorMessage.layDate}
                    isError={isError.layDate}
                  />

                  <View style={dynamicStyles.checkboxWrap}>
                    <Checkbox.Android
                      status={markLayDate ? "checked" : "unchecked"}
                      onPress={onPressMarkLayDate}
                      style={dynamicStyles.checkBox}
                    />
                    <Text style={dynamicStyles.label}>
                      Mark lay date as approximate
                    </Text>
                  </View>
                  {isError.layDate ? (
                    <Text style={styles.errortext}>{errorMessage.layDate}</Text>
                  ) : null}
                </View>

                <DatePicker
                  title="Found Date"
                  today={foundDate}
                  refs={datePicker2Ref}
                  onOpen={dropdownOff}
                  onChange={getdateFound}
                  maximumDate={new Date()}
                  errors={errorMessage.foundDate}
                  isError={isError.foundDate}
                />
                {isError.foundDate ? (
                  <Text style={styles.errortext}>{errorMessage.foundDate}</Text>
                ) : null}
              </View>
            </View>
          </List.Accordion>
        </List.Section>

        <List.Section>
          <List.Accordion
            title="Additional Information"
            id="1"
            titleStyle={{
              color: isSwitchOn ? Colors.white : Colors.defaultTextColor,
              fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              marginLeft: widthPercentageToDP(-2),
            }}
            style={{
              backgroundColor: isSwitchOn
                ? Colors.ContainerBackgroundColorDark
                : Colors.white,
              marginRight: widthPercentageToDP(-3.5),
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
            <View style={[dynamicStyles.animalBox, {}]}>
              <TouchableOpacity
                disabled={deletes ? true : false}
                onPress={() => gotoSearchScreenMother("mother")}
                style={[
                  dynamicStyles.animalCardStyle,
                  {
                    borderWidth: setParentMother?.length > 0 ? 2 : 1,
                    borderColor: isError.genderMother
                      ? constThemeColor.error
                      : constThemeColor.outline,
                    backgroundColor: setParentMother?.animal_id
                      ? null
                      : constThemeColor.surface,
                  },
                ]}
              >
                {setParentMother?.length > 0 ? (
                  setParentMother?.map((animal, key) => {
                    return animal?.animal_id ? (
                      <AnimalCustomCard
                        item={animal}
                        animalIdentifier={
                          !animal?.local_identifier_value
                            ? animal?.animal_id
                            : animal?.local_identifier_name ?? null
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
                        chips={
                          animal?.sex ??
                          props.route.params?.item?.parent_female[0]?.gender ??
                          null
                        }
                        onPress={() => gotoSearchScreenMother("mother")}
                        style={{
                          backgroundColor: constThemeColor.surface,
                        }}
                        noArrow={false}
                      />
                    ) : null;
                  })
                ) : (
                  <Text style={[dynamicStyles.animalTextStyle]}>
                    Parent Mother
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {isError.genderMother ? (
              <Text
                style={{
                  color: constThemeColor.error,
                  marginLeft: 5,
                  marginTop: 6,
                  fontSize: FontSize.Antz_Strong,
                }}
              >
                {errorMessage.genderMother}
              </Text>
            ) : null}

            <View style={[dynamicStyles.animalBox, {}]}>
              <TouchableOpacity
                disabled={deletes ? true : false}
                onPress={() => gotoSearchScreenFather("father", 3)}
                style={[
                  dynamicStyles.animalCardStyle,
                  {
                    borderWidth: setParentFather?.length > 0 ? 2 : 1,
                    borderColor: isError.genderFather
                      ? constThemeColor.error
                      : constThemeColor.outline,
                    backgroundColor:
                      setParentFather?.length > 0
                        ? null
                        : constThemeColor.surface,
                  },
                ]}
              >
                {setParentFather?.length > 0 ? (
                  setParentFather?.map((animal, key) => {
                    return animal?.animal_id ? (
                      <AnimalCustomCard
                        item={animal}
                        animalIdentifier={
                          !animal?.local_identifier_value
                            ? animal?.animal_id
                            : animal?.local_identifier_name ?? null
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
                        chips={
                          animal?.sex ??
                          props.route.params?.item?.parent_male[0]?.gender ??
                          null
                        }
                        onPress={() => gotoSearchScreenFather("father", 3)}
                        style={{
                          backgroundColor: constThemeColor.surface,
                        }}
                        noArrow={false}
                      />
                    ) : null;
                  })
                ) : (
                  <Text style={[dynamicStyles.animalTextStyle]}>
                    Parent Father
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {isError.genderFather ? (
              <Text
                style={{
                  color: constThemeColor.error,
                  marginLeft: 5,
                  marginTop: 6,
                  fontSize: FontSize.Antz_Strong,
                }}
              >
                {errorMessage.genderFather}
              </Text>
            ) : null}
            <View style={{ marginTop: heightPercentageToDP(0.5) }}>
              <InputBox
                inputLabel={"Clutch"}
                placeholder={"Choose Clutch"}
                autoFocus={false}
                onFocus={dropdownOff}
                value={clutch}
                onChange={(value) => setClutch(value)}
                onSubmitEditing={() => handleSubmitFocus(femaleRef)}
              />
            </View>
            <InputBox
              refs={gastationRef}
              inputLabel={"Gestation Period"}
              placeholder={"Enter Gestation Period"}
              onFocus={dropdownOff}
              onChange={(value) => SetGastation(value)}
              value={gastation}
              keyboardType="numeric"
            />
          </List.Accordion>
        </List.Section>
        <List.Section>
          <List.Accordion
            title="Fertility and Incubation"
            id="2"
            titleStyle={{
              color: isSwitchOn ? Colors.white : Colors.defaultTextColor,
              fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              marginLeft: widthPercentageToDP(-2),
            }}
            style={{
              backgroundColor: isSwitchOn
                ? Colors.ContainerBackgroundColorDark
                : Colors.white,
              marginRight: widthPercentageToDP(-3.5),
            }}
            right={(props) =>
              expanded.Fertility ? (
                <List.Icon {...props} icon="minus" />
              ) : (
                <List.Icon {...props} icon="plus" />
              )
            }
            expanded={expanded.Fertility}
            onPress={() =>
              setExpanded((prevState) => ({
                ...prevState,
                Fertility: !expanded.Fertility,
              }))
            }
          >
            <InputBox
              inputLabel={"Fertility Status"}
              placeholder={"Choose Fertility Status"}
              editable={false}
              value={fertilityStatus}
              autoFocus={false}
              defaultValue={fertilityStatus != null ? fertilityStatus : null}
              rightElement={isFertilityStatus ? "menu-up" : "menu-down"}
              DropDown={SetFertilityDown}
              onFocus={SetFertilityDown}
              onSubmitEditing={() => handleSubmitFocus(fertAsesmntMethodRef)}
            />
            <InputBox
              inputLabel={"Fertility Assessment Method"}
              placeholder={"Choose Fertility Assessment Method"}
              editable={false}
              refs={fertAsesmntMethodRef}
              value={fertAsesmntMethod}
              defaultValue={
                fertAsesmntMethod != null ? fertAsesmntMethod : null
              }
              rightElement={isFertAsesmntMethod ? "menu-up" : "menu-down"}
              DropDown={SetAsesmntMethodDown}
              onFocus={SetAsesmntMethodDown}
              onSubmitEditing={() => handleSubmitFocus(incubationRef)}
            />
            <InputBox
              inputLabel={"Incubation Type"}
              placeholder={"Choose Incubation Type"}
              editable={false}
              refs={incubationRef}
              value={incubationType}
              defaultValue={incubationType != null ? incubationType : null}
              rightElement={isIncubationType ? "menu-up" : "menu-down"}
              DropDown={SetIncubationTypeDown}
            />
          </List.Accordion>
        </List.Section>
      </CustomForm>

      {isAcsnTypeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isAcsnTypeMenuOpen}
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
      ) : null}
      {isInstituteTypeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isInstituteTypeMenuOpen}
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
      ) : null}
      {isSelectEnclosure ? (
        <View>
          <Modal
            animationType="fade"
            visible={isSelectEnclosure}
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

      {isFertilityStatus ? (
        <View>
          <Modal
            animationType="fade"
            visible={isFertilityStatus}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={fertStatusClose}
          >
            <Category
              categoryData={fertilityStatusData}
              onCatPress={fertilityPressed}
              heading={"Choose Fertility Status"}
              isMulti={false}
              onClose={fertStatusClose}
            />
          </Modal>
        </View>
      ) : null}

      {isFertAsesmntMethod ? (
        <View>
          <Modal
            animationType="fade"
            visible={isFertAsesmntMethod}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={assessmentMethodClose}
          >
            <Category
              categoryData={fertAsesmntMethodData}
              onCatPress={fertilityAssessPressed}
              heading={"Choose Fertility Assessment Method"}
              isMulti={false}
              onClose={assessmentMethodClose}
            />
          </Modal>
        </View>
      ) : null}

      {isIncubationType ? (
        <View>
          <Modal
            animationType="fade"
            visible={isIncubationType}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={incubationTypeClose}
          >
            <Category
              categoryData={incubationTypeData}
              onCatPress={incubationPressed}
              heading={"Choose Incubation Type"}
              isMulti={false}
              onClose={incubationTypeClose}
            />
          </Modal>
        </View>
      ) : null}

      {isParentMotherType ? (
        <View>
          <Modal
            animationType="fade"
            visible={isParentMotherType}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={motherTypeClose}
          >
            <Category
              categoryData={isParentMotherTypeData}
              onCatPress={motherPressed}
              heading={"Choose Parent Mother"}
              isMulti={true}
              onClose={motherTypeClose}
            />
          </Modal>
        </View>
      ) : null}

      {isParentFatherType ? (
        <View>
          <Modal
            animationType="fade"
            visible={isParentFatherType}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={fatherTypeClose}
          >
            <Category
              categoryData={isParentFatherTypeData}
              onCatPress={fatherPressed}
              heading={"Choose Parent Father"}
              isMulti={true}
              onClose={fatherTypeClose}
            />
          </Modal>
        </View>
      ) : null}
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={messageTitle}
        closeModal={alertModalClose}
        firstButtonHandle={firstButtonPress}
        secondButtonHandle={secondButtonPress}
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
    </>
  );
};

export default EditEggForm;

const styles = (reduxColors) =>
  StyleSheet.create({
    checkboxWrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderColor: reduxColors.outline,
      marginBottom: 8,
      borderWidth: 0.8,
      borderTopWidth: 0,
      marginTop: -10,
      padding: 4,
      borderBottomRightRadius: 5,
      borderBottomLeftRadius: 5,
      height: 51,
    },

    checkBox: {
      flex: 1,
      borderRadius: 4,
      borderWidth: 0.8,
      borderColor: reduxColors.onSurfaceVariant,
    },

    label: {
      flex: 1,
      lineHeight: 24,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    errortext: {
      color: "red",
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
    animalBox: {
      marginTop: heightPercentageToDP(2),
      marginBottom: heightPercentageToDP(0.5),
      borderColor: reduxColors.onSurfaceVariant,
      borderRadius: 5,
    },
    animalCardStyle: {
      justifyContent: "center",
      width: "100%",
      borderWidth: 1,
      borderRadius: 6,
      borderColor: reduxColors.border,
      minHeight: 50,
    },
    mainTag: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: widthPercentageToDP(20),
      height: heightPercentageToDP(4),
    },
    tagscontainerB: {
      width: widthPercentageToDP(6),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.secondary,
      borderRadius: 5,
      justifyContent: "center",
    },
    errorBox: {
      textAlign: "left",
      width: "90%",
    },
    errorMessage: {
      color: reduxColors.error,
    },
  });
