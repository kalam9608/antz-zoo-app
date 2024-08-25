//create by :gaurav shukla

import React, { useEffect, useState, useRef } from "react";
import Category from "../../components/DropDownBox";
import CustomForm from "../../components/CustomForm";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Alert,
  BackHandler,
} from "react-native";
import { Checkbox, Divider, List } from "react-native-paper";

import InputBox from "../../components/InputBox";
import DatePicker from "../../components/DatePicker";
import { GetEnclosure } from "../../services/FormEnclosureServices";
import { listAccessionType } from "../../services/AccessionService";
import { getParentEnclosure, PostaddEggs } from "../../services/EggsService";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { AutoCompleteSearch } from "../../components/AutoCompleteSearch";
import Modal from "react-native-modal";
import Loader from "../../components/Loader";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import RequestBy from "../../components/Move_animal/RequestBy";
import { capitalize, ifEmptyValue } from "../../utils/Utils";
import { AntDesign } from "@expo/vector-icons";
import {
  setDestination,
  removeParentAnimal,
} from "../../redux/AnimalMovementSlice";
import { instituteList } from "../../services/MedicalMastersService";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import Spacing from "../../configs/Spacing";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";

const EggsAddForm = (props) => {
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();
  const [accessionType, setAccessionType] = useState("");
  const [accessionId, setAccessionId] = useState("");
  const [accessionTypeData, setAccessionTypeData] = useState([]);
  const [isAcsnTypeMenuOpen, setisAcsnTypeMenuOpen] = useState(false);

  const [institutionType, setInstitutionType] = useState(null);
  const [isInstituteTypeMenuOpen, setIsInstituteTypeMenuOpen] = useState(false);
  const [institutionTypeID, setInstitutionTypeID] = useState(null);
  const [institutionTypeData, setInstitutionTypeData] = useState([]);

  const [selectEnclosure, setSelectEnclosure] = useState("");
  const [selectEnclosureId, setSelectEnclosureId] = useState("");
  const [selectEnclosureData, setSelectEnclosureData] = useState([]);
  const [isSelectEnclosure, setIsSelectEnclosure] = useState(false);

  // New Lay Date and Age
  const [laysDate, setLaysDate] = useState(new Date());
  const [dateComponent, setDateComponent] = useState();
  const [age, setAge] = useState("");
  const [Loading, setLoading] = useState(false);

  const [foundDate, setFoundDate] = useState(new Date());
  const [layDate, setLayDate] = useState(new Date());

  const [species, setSpecies] = useState(
    props.route.params?.item?.vernacular_name &&
      props.route.params?.item?.scientific_name
      ? `${props.route.params?.item?.vernacular_name}(${props.route.params?.item?.scientific_name})`
      : ""
  );
  const [speciesId, setSpeciesId] = useState(
    props.route.params?.item?.taxonomy_id ?? ""
  );
  const [isSpecies, setIsSpecies] = useState(false);

  const [markLayDate, setMarkLayDate] = useState(false);

  const [clutch, setClutch] = useState("");
  const [batchCount, setBatchCount] = useState("");

  const [isMother, setIsMother] = useState(false);
  const [genderMother, setGenderMother] = useState("");
  const [genderMotherId, setGenderMotherId] = useState("");
  const [Mother, setMother] = useState([]);

  const [isFather, SetIsFather] = useState(false);
  const [genderFather, setGenderFather] = useState("");
  const [genderFatherId, setGenderFatherId] = useState("");
  const [Father, setFather] = useState([]);

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});

  const [motherData, setMotherData] = useState(
    props?.route.params?.parentMotherData
      ? props?.route.params?.parentMotherData
      : false
  );
  const [fatherData, setFatherData] = useState(false);
  const [insti, setInsti] = useState(false);

  const destination =
    useSelector((state) => state.AnimalMove.destination) ??
    props.route?.params?.item ??
    {};

  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  // const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  // update: by md kalam ansari , add the minus plus icon insted of arrow dropdown icons
  const [expanded, setExpanded] = React.useState({
    Basic: true,
    Additional: false,
    Fertility: false,
  });

  useEffect(() => {
    if (accessionType && accessionType == "From Institution") {
      setInsti(true);
    } else {
      setInsti(false);
    }
  }, [accessionType]);

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

  const SetInstituteTypeDropDown = () => {
    setIsInstituteTypeMenuOpen(!isInstituteTypeMenuOpen);
    // SetAcsnTypeDropDown(false)
    setIsSelectEnclosure(false);
    setIsSpecies(false);
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

  /// this function is for Accession Types dropdwon
  const Accessiondata = (item) => {
    setisAcsnTypeMenuOpen(!isAcsnTypeMenuOpen);
    setAccessionType(item.map((value) => value.name).join(","));
    setAccessionId(item.map((value) => value.id).join(","));
    setInstitutionType(null);
    // enclDropdownOpen();
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    enclRef.current.focus();*/
    }
  };

  useEffect(() => {
    let postData = {
      zoo_id: zooID,
    };
    setLoading(true);
    Promise.all([listAccessionType(), GetEnclosure(postData)]).then((res) => {
      let data = res[0]?.data.map((item) => {
        return {
          id: item.accession_id,
          name: item.accession_type,
        };
      });
      let data1 = res[1]?.data.map((item) => {
        return {
          id: item.enclosure_id,
          name: item.user_enclosure_name,
        };
      });
      setAccessionTypeData(data);
      setSelectEnclosureData(data1);
      setLoading(false);
      handleSubmitFocus(accessionRef);
      // setisAcsnTypeMenuOpen(true);
    });
  }, []);

  //this is function is for Select Enclosure Dropdwon

  const EnclosureData = (item) => {
    let enclosure_id = item.map((value) => value.id).join(",");
    setSelectEnclosure(item.map((value) => value.name).join(","));
    setSelectEnclosureId(enclosure_id);
    setIsSelectEnclosure(!isSelectEnclosure);
    // taxiDropdownOpen();

    setLoading(true);
    Promise.all([
      getParentEnclosure({ enclosure_id: item[0].id, gender: "male" }),
      getParentEnclosure({ enclosure_id: item[0].id, gender: "female" }),
    ])
      .then((res) => {
        setFather(
          res[0].data.map((item) => {
            return {
              id: item.animal_id,
              name: item?.complete_name ?? "NA",
            };
          })
        );
        setMother(
          res[1].data.map((item) => {
            return {
              id: item.animal_id,
              name: item?.complete_name ?? "NA",
            };
          })
        );
        setLoading(false);
        {
          /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
        handleSubmitFocus(taxonomyRef, 1000);*/
        }
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
      });
  };

  const SetAcsnTypeDropDown = () => {
    setisAcsnTypeMenuOpen(!isAcsnTypeMenuOpen);
    setIsInstituteTypeMenuOpen(false);
    setIsSelectEnclosure(false);
    setIsSpecies(false);
  };

  const SetSelectEncDropDown = () => {
    setIsSelectEnclosure(!isSelectEnclosure);
    setisAcsnTypeMenuOpen(false);
    setIsSpecies(false);
  };

  const onPressMarkLayDate = () => {
    setMarkLayDate(!markLayDate);
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

  const getdateFound = (date) => {
    setFoundDate(date);
  };
  const getdateLay = (date) => {
    setLayDate(date);
  };

  //this is  function Taxonomay dropDwon Filed
  const catTaxonomydata = (item) => {
    if (item || species) {
      if (item) {
        setSpecies(item.title);
        setSpeciesId(item.id);
      }
    } else {
      setSpecies("");
      setSpeciesId("");
    }
  };

  //this function the Mother DropDwon
  const SetIsMotherDown = () => {
    setIsMother(!isMother);
    setIsSelectEnclosure(false);
    setisAcsnTypeMenuOpen(false);
    setIsSpecies(false);
    SetIsFather(false);
  };

  const gotoSearchScreenMother = (type) => {
    navigation.navigate("CommonAnimalSelect", { type });
    setMotherData(true);
  };

  const gotoSearchScreenFather = (type, limit) => {
    setFatherData(true);
    navigation.navigate("CommonAnimalSelect", { type, limit });
  };

  const setParentMother = useSelector((state) =>
    Object.keys(state?.AnimalMove?.motherAnimal)?.length > 0
      ? state.AnimalMove.motherAnimal
      : props?.route?.params?.item?.parent_female
      ? props?.route?.params?.item?.parent_female[0]?.parents
      : props?.route?.params?.item
      ? props?.route?.params?.item
      : null
  );
  const setParentFather = useSelector((state) =>
    state.AnimalMove.fatherAnimal?.length > 0
      ? state.AnimalMove.fatherAnimal
      : props?.route?.params?.item?.parent_male?.parents?.length > 0
      ? props?.route?.params?.item?.parent_male?.parents
      : null
  );

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
    setisAcsnTypeMenuOpen(false);
    setIsSpecies(false);
  };

  const catFatherdata = (item) => {
    setGenderFather(item.map((value) => value.name).join(","));
    setGenderFatherId(item.map((value) => value.id).join(","));
    IsFatherClose();
  };

  const IsFatherClose = () => {
    SetIsFather(false);
  };

  const setNumberofEggs = (value) => {
    const numberRegex2 = /^[1-9][0-9]*$/;

    if (!numberRegex2.test(value)) {
      setIsError({ batchCount: true });
      setErrorMessage({ batchCount: "Only number accepted" });
      setBatchCount("");
      return false;
    } else {
      setIsError({ batchCount: false });
      setBatchCount(value);
    }
  };

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
    } else if (species.trim().length === 0) {
      setIsError({ species: true });
      setErrorMessage({ species: "Select the Species/Taxonomy Options" });
      return false;
    } else if (layDate.length === 0) {
      setIsError({ layDate: true });
      setErrorMessage({ layDate: "Select the Lay Date" });
      return false;
    } else if (batchCount.trim().length === 0) {
      setIsError({ batchCount: true });
      setErrorMessage({ batchCount: "Enter The Numbers Of Eggs" });
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

  useEffect(() => {
    if (
      accessionType ||
      institutionType ||
      species ||
      layDate ||
      batchCount ||
      foundDate
    ) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [accessionType, institutionType, species, layDate, batchCount, foundDate]);

  const sendAddEggsData = () => {
    if (validation()) {
      setLoading(true);
      let obj = {
        accession_type: accessionId,
        enclosure_id: destination?.enclosure_id,
        taxonomy_id: speciesId,
        from_institution: institutionTypeID,
        // taxonomy_id: 18161,
        lay_date: moment(layDate).format("YYYY-MM-DD"),
        found_date: moment(foundDate).format("YYYY-MM-DD"),
        nest_location: "4",
        batch_count: batchCount,
        parent_female: setParentMother?.animal_id
          ? setParentMother?.animal_id
          : "",
        parent_male:
          setParentFather?.length > 0
            ? setParentFather.map((value) => value.animal_id).join(",")
            : "",
        description: "",
        zoo_id: zooID,
        lay_date_approx: markLayDate,
      };
      PostaddEggs(obj)
        .then((res) => {
          setLoading(false);
          if (res.success) {
            successToast("success", res?.message);
            navigation.replace("EggLists");
          }
        })
        .catch((err) => {
          setLoading(false);
          errorToast("error", "Oops! Something went wrong!!");
        });
    }
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

  const eggNumberRef = useRef(null);
  const datePickerRef = useRef(null);
  const femaleRef = useRef(null);
  const accessionRef = useRef(null);
  const instituRef = useRef(null);
  const enclRef = useRef(null);
  const taxonomyRef = useRef(null);
  const maleRef = useRef(null);
  const datePicker2Ref = useRef(null);
  const handleSubmitFocus = (refs, time) => {};
  const enclDropdownOpen = () => {
    setIsSelectEnclosure(true);
  };
  const taxiDropdownOpen = () => {
    setIsSpecies(true);
  };
  const motherDropdownOpen = () => {
    setIsMother(true);
  };
  const fatherdropdownOpen = () => {
    SetIsFather(true);
  };

  useEffect(() => {
    if (
      props.route.params?.enclosure_Data != "YES" ||
      props.route.params?.parentMotherData != "YES"
    ) {
      dispatch(removeParentAnimal());
    }
  }, []);
  const dropdownOff = () => {
    setIsInstituteTypeMenuOpen(false);
    setisAcsnTypeMenuOpen(false);
    setIsSelectEnclosure(false);
    setIsMother(false);
    setIsMother(false);
  };

  const getLayDate = (layDate) => {
    const todayDate = new Date();

    if (todayDate < layDate) {
      setIsError({ layDate: true });
      setErrorMessage({
        layDate: "Lay Date Can Not Be Greater Than Today Date",
      });
    } else {
      setLayDate(layDate);
      setIsError({ layDate: false });
      setErrorMessage({ layDate: "" });
    }

    const age = moment(todayDate).diff(moment(layDate), "days");
    setAge(String(age));
    setDateComponent("days");
  };

  const handleAge = (age) => setAge(age);

  const handleDate = (dateComponent, value) => {
    setAge(value);
    setDateComponent(dateComponent);
    const layDate = moment()
      .subtract(value, dateComponent)
      .format("YYYY-MM-DD");
    setLayDate(layDate);
  };

  const gotoSelectScreen = () => {
    navigation.navigate("SearchTransferanimal", {
      type: "Select",
    });
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const firstButtonPress = () => {
    alertModalClose();
    navigation.goBack();
  };
  const secondButtonPress = () => {
    alertModalClose();
  };
  useEffect(() => {
    const backAction = () => {
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
    dispatch(setDestination([]));
    dispatch(removeParentAnimal());
    navigation.goBack();
  };

  return (
    <>
      <Loader visible={Loading} />
      <CustomForm
        header={true}
        title={"Add Eggs"}
        paddingBottom={50}
        onPress={sendAddEggsData}
        back={goBack}
      >
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
            expanded={expanded.Basic}
          >
            <View style={{ marginBottom: 0, paddingHorizontal: 0 }}>
              <View>
                <InputBox
                  refs={accessionRef}
                  inputLabel={"Accession Type"}
                  placeholder={"Enter Accession Type"}
                  editable={false}
                  DropDown={SetAcsnTypeDropDown}
                  value={accessionType}
                  defaultValue={accessionType != null ? accessionType : null}
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
              </View>
              {/* <InputBox
                  inputLabel={"Select Enclosure"}
                  placeholder={"Choose Enclosure"}
                  editable={false}
                  refs={enclRef}
                  DropDown={SetSelectEncDropDown}
                  onFocus={SetSelectEncDropDown}
                  value={selectEnclosure}
                  defaultValue={
                    selectEnclosure != null ? selectEnclosure : null
                  }
                  rightElement={isAcsnTypeMenuOpen ? "menu-up" : "menu-down"}
                  onSubmitEditing={() => handleSubmitFocus(datePickerRef)}
                  errors={errorMessage.selectEnclosure}
                  isError={isError.selectEnclosure}
                /> */}
              <View style={dynamicStyles.destinationBox}>
                <TouchableOpacity
                  onPress={gotoSelectScreen}
                  style={[
                    dynamicStyles.animalCardStyle,
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
                      dynamicStyles.animalTextStyle,
                      {
                        paddingVertical: destination.enclosure_id
                          ? Spacing.small
                          : 0,
                      },
                    ]}
                  >
                    {destination?.enclosure_id || destination?.user_enclosure_id
                      ? "Selected Enclosure"
                      : "Select Enclosure"}
                  </Text>
                  {destination?.enclosure_id ||
                  destination?.user_enclosure_id ? (
                    <RequestBy
                      svgUri={true}
                      middleSection={
                        <View>
                          <Text
                            style={{
                              fontSize: FontSize.Antz_Minor_Medium.fontSize,
                              fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                              color: constThemeColor.onPrimaryContainer,
                              marginBottom: Spacing.small,
                            }}
                          >
                            {capitalize(destination.user_enclosure_name)}
                          </Text>
                          {destination.incharge_name ? (
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
                                {destination.incharge_name ?? "NA"}
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
              {isError.selectEnclosure && !destination.enclosure_id ? (
                <View style={dynamicStyles.errorBox}>
                  <Text style={dynamicStyles.errorMessage}>
                    {errorMessage.selectEnclosure}
                  </Text>
                </View>
              ) : null}
              <AutoCompleteSearch
                refs={taxonomyRef}
                placeholder="Enter atleast 3 characters to search..."
                label="Species/Taxonomy"
                onPress={catTaxonomydata}
                value={species}
                errors={errorMessage.species}
                isError={isError.species}
                onClear={() => {
                  setSpeciesId("");
                  setSpecies("");
                }}
              />
              <View>
                <DatePicker
                  title="Lay Date"
                  style={{ borderBottomLeftRadius: 0 }}
                  refs={datePickerRef}
                  today={layDate}
                  maximumDate={new Date()}
                  onChange={getLayDate}
                  onOpen={dropdownOff}
                />
                <View style={dynamicStyles.layDateWrap}>
                  <Checkbox.Android
                    status={markLayDate ? "checked" : "unchecked"}
                    onPress={onPressMarkLayDate}
                  />
                  <Text style={dynamicStyles.label}>
                    Mark lay date as approximate
                  </Text>
                </View>
                {isError.layDate ? (
                  <Text style={dynamicStyles.errortext}>
                    {errorMessage.layDate}
                  </Text>
                ) : null}
              </View>

              <View
                style={{
                  width: widthPercentageToDP("25%"),
                  height: "4%",
                  marginTop: heightPercentageToDP(1.2),
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
                    placeholder={"Approx Age"}
                    keyboardType={"numeric"}
                    value={age}
                    style={{
                      // height: 48,
                      flex: 1,
                      marginRight: 10,
                    }}
                    onFocus={dropdownOff}
                    autoFocus={false}
                    // onChange={handleAge}
                    onChange={(value) => {
                      checkNumber(value)
                        ? handleDate(dateComponent, value)
                        : setAge("");
                    }}
                  />
                </View>

                <View style={dynamicStyles.checkboxWrap}>
                  <View style={dynamicStyles.ageSelectContainer}>
                    <TouchableOpacity
                      style={[
                        dynamicStyles.botton,
                        {
                          // borderRightWidth: Platform.OS == "ios" ? 2 : 1,
                          borderRadius: 0,
                          zIndex: 999,
                        },
                        dateComponent === "months"
                          ? dynamicStyles.activeDateFirstComponent
                          : dynamicStyles.dateFirstComponent,
                      ]}
                      onPress={() => {
                        handleDate("months", age);
                      }}
                    >
                      <Text
                        style={[
                          dateComponent === "months"
                            ? dynamicStyles.activeDateComponentText
                            : dynamicStyles.dateComponentText,
                        ]}
                      >
                        Months
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        dynamicStyles.botton,
                        {
                          // borderLeftWidth: Platform.OS == "ios" ? 1 : 0.8,
                          borderRightWidth: 1,
                          borderRadius: 0,
                          zIndex: 999,
                        },
                        dateComponent === "weeks"
                          ? dynamicStyles.activeDateComponent
                          : dynamicStyles.dateComponent,
                      ]}
                      onPress={() => {
                        handleDate("weeks", age);
                      }}
                    >
                      <Text
                        style={[
                          dateComponent === "weeks"
                            ? dynamicStyles.activeDateComponentText
                            : dynamicStyles.dateComponentText,
                        ]}
                      >
                        Weeks
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        dynamicStyles.botton,
                        {
                          // // borderRightWidth: 0.25,
                          // borderRadius: 0,
                          // zIndex: 999,
                        },
                        dateComponent === "days"
                          ? dynamicStyles.activeDateLastComponent
                          : dynamicStyles.dateLastComponent,
                      ]}
                      onPress={() => {
                        handleDate("days", age);
                      }}
                    >
                      <Text
                        style={[
                          dateComponent === "days"
                            ? dynamicStyles.activeDateComponentText
                            : dynamicStyles.dateComponentText,
                        ]}
                      >
                        Days
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                  <Text style={{ color: "red" }}>
                    {errorMessage.batchOptions}
                  </Text>
                )}
              </View>
              <InputBox
                inputLabel={"Number of Eggs"}
                placeholder={"Enter Number"}
                keyboardType={"numeric"}
                refs={eggNumberRef}
                onFocus={dropdownOff}
                value={batchCount}
                onChange={setNumberofEggs}
                onSubmitEditing={() => handleSubmitFocus(datePicker2Ref)}
                errors={errorMessage.batchCount}
                isError={isError.batchCount}
              />
              <DatePicker
                today={foundDate}
                refs={datePicker2Ref}
                title="Found Date"
                maximumDate={new Date()}
                onChange={getdateFound}
                onOpen={dropdownOff}
              />
              {isError.foundDate ? (
                <Text style={dynamicStyles.errortext}>
                  {errorMessage.foundDate}
                </Text>
              ) : null}
            </View>
          </List.Accordion>
        </List.Section>

        <List.Section>
          <List.Accordion
            title="Additional Information"
            id="1"
            titleStyle={{
              color: constThemeColor.onSurface,
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
            <InputBox
              inputLabel={"Clutch"}
              placeholder={"Enter Clutch"}
              autoFocus={false}
              value={clutch}
              onFocus={dropdownOff}
              onChange={(value) => setClutch(value)}
              onSubmitEditing={() => handleSubmitFocus(femaleRef)}
              errors={errorMessage.clutch}
              isError={isError.clutch}
            />
            {/* <InputBox
              inputLabel={"Parent Mother"}
              placeholder={"Choose Parent Mother"}
              refs={femaleRef}
              editable={false}
              multiline={Platform.OS === "android" ? false : true}
              value={genderMother}
              defaultValue={genderMother != null ? species : null}
              rightElement={isMother ? "menu-up" : "menu-down"}
              DropDown={SetIsMotherDown}
              onFocus={SetIsMotherDown}
              errors={errorMessage.genderMother}
              isError={isError.genderMother}
            /> */}
            <View style={[dynamicStyles.animalBox, {}]}>
              <TouchableOpacity
                // disabled={deletes ? true : false}s
                onPress={() => gotoSearchScreenMother("mother")}
                style={[
                  dynamicStyles.animalCardStyle2,
                  {
                    borderWidth: setParentMother?.animal_id ? 2 : 1,
                    borderColor: isError.genderMother
                      ? constThemeColor.error
                      : constThemeColor.outline,
                    backgroundColor: setParentMother?.animal_id
                      ? null
                      : constThemeColor.surface,
                  },
                ]}
              >
                {setParentMother?.animal_id ? (
                  <>
                    {/* <Divider /> */}
                    <AnimalCustomCard
                      item={setParentMother}
                      animalIdentifier={
                        !setParentMother?.local_identifier_value
                          ? setParentMother?.animal_id
                          : setParentMother?.local_identifier_name ?? null
                      }
                      localID={setParentMother?.local_identifier_value ?? null}
                      icon={setParentMother.default_icon}
                      enclosureName={setParentMother?.user_enclosure_name}
                      animalName={
                        setParentMother?.common_name
                          ? setParentMother?.common_name
                          : setParentMother?.scientific_name
                      }
                      sectionName={setParentMother?.section_name}
                      show_specie_details={true}
                      show_housing_details={true}
                      chips={setParentMother?.sex}
                      onPress={() => gotoSearchScreenMother("mother")}
                      style={{
                        backgroundColor: constThemeColor.surface,
                      }}
                      noArrow={false}
                    />
                  </>
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
                  fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                }}
              >
                {errorMessage.genderMother}
              </Text>
            ) : null}
            {/* <InputBox
              inputLabel={"Parent Father"}
              placeholder={"Choose Parent Father"}
              editable={false}
              refs={maleRef}
              value={genderFather}
              defaultValue={genderFather != null ? species : null}
              rightElement={isFather ? "menu-up" : "menu-down"}
              DropDown={SetIsFatherDown}
              onFocus={SetIsFatherDown}
              errors={errorMessage.genderFather}
              isError={isError.genderFather}
            /> */}
            <View
              style={[
                dynamicStyles.animalBox,
                { marginTop: heightPercentageToDP(2.5) },
              ]}
            >
              <TouchableOpacity
                onPress={() => gotoSearchScreenFather("father", 3)}
                style={[
                  dynamicStyles.animalCardStyle2,
                  {
                    borderWidth: setParentFather?.length > 0 ? 2 : 1,
                    borderColor: isError.genderFather
                      ? constThemeColor.error
                      : constThemeColor.outline,
                    backgroundColor:
                      setParentFather?.length > 0
                        ? null
                        : constThemeColor.surface,

                    marginBottom: heightPercentageToDP(5),
                  },
                ]}
              >
                {setParentFather?.length > 0 ? (
                  setParentFather?.map((animal, key) => {
                    return animal?.animal_id ? (
                      <>
                        {/* <Divider /> */}
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
                          chips={animal?.sex}
                          onPress={() => gotoSearchScreenFather("father", 3)}
                          style={{
                            backgroundColor: constThemeColor.surface,
                          }}
                          noArrow={false}
                        />
                      </>
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
                  fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                }}
              >
                {errorMessage.genderFather}
              </Text>
            ) : null}
          </List.Accordion>
        </List.Section>
      </CustomForm>

      {isAcsnTypeMenuOpen ? (
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
              onCatPress={Accessiondata}
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
      ) : null}
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
              onCatPress={EnclosureData}
              heading={"Choose Enclosure"}
              isMulti={false}
              onClose={encClose}
            />
          </Modal>
        </View>
      ) : null}

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
              isMulti={true}
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
            />
          </Modal>
        </View>
      ) : null}
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Are you sure you want to go back?"}
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

export default EggsAddForm;

const styles = (DarkModeReducer) =>
  StyleSheet.create({
    layDateWrap: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 0.8,
      borderColor: DarkModeReducer.outline,
      borderTopWidth: 0,
      marginTop: -10,
      padding: 4,
      borderBottomRightRadius: 5,
      borderBottomLeftRadius: 5,
      height: 51,
    },
    errortext: {
      color: DarkModeReducer.error,
    },
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
      color: DarkModeReducer.onPrimaryContainer, //"rgba(0,0,0,0.5)",
    },
    botton: {
      // borderColor: DarkModeReducer.onSurfaceVariant,
      // width: widthPercentageToDP("18%"),
      // padding: 8,
      // paddingHorizontal: 5,
      // height: heightPercentageToDP("6%"),
      // borderRadius: 2,
      // alignItems: "center",
      // justifyContent: "center",

      borderColor: DarkModeReducer.outline,
      // padding: 8,
      // paddingHorizontal: 18,
      // height: heightPercentageToDP("6%"),
      height: 48,
      borderRadius: 2,
      alignItems: "center",
      justifyContent: "center",
      width: widthPercentageToDP("18%"),
    },
    dateFirstComponent: {
      backgroundColor: DarkModeReducer.surface,
      borderRadius: 5,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: Platform.OS == "ios" ? 0.8 : 0,
    },
    dateComponent: {
      backgroundColor: DarkModeReducer.surface,
      borderLeftWidth: Platform.OS == "ios" ? 0 : 1,
    },
    dateLastComponent: {
      backgroundColor: DarkModeReducer.surface,
      borderRadius: 5,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    activeDateFirstComponent: {
      backgroundColor: DarkModeReducer.secondaryContainer,
      borderRadius: 4,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderWidth: 1,
      borderRightWidth: Platform.OS == "ios" ? 2 : 1,
    },
    activeDateComponent: {
      backgroundColor: DarkModeReducer.secondaryContainer,
      borderWidth: 1,
      borderRightWidth: Platform.OS == "ios" ? 2 : 2,
      borderLeftWidth: Platform.OS == "ios" ? 1 : 2,
    },
    activeDateLastComponent: {
      backgroundColor: DarkModeReducer.secondaryContainer,
      borderRadius: 4,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderWidth: 1,
    },
    activeDateComponentText: {},
    dateComponentText: {
      color: DarkModeReducer.onSecondaryContainer,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    ageSelectContainer: {
      borderWidth: 1,
      flexDirection: "row",
      borderRadius: 5,
      borderColor: DarkModeReducer.outline,
      alignItems: "center",
      justifyContent: "space-between",
      // height: heightPercentageToDP("6.2%"),
      height: 50,
    },
    destinationBox: {
      marginTop: 12,
      marginBottom: 8,
    },
    animalCardStyle: {
      justifyContent: "center",
      width: "100%",
      borderRadius: 4,
      minHeight: heightPercentageToDP(6.5),
    },
    animalTextStyle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: DarkModeReducer.onSurfaceVariant,
      paddingLeft: 15,
    },
    errorBox: {
      textAlign: "left",
      width: "90%",
    },
    errorMessage: {
      color: DarkModeReducer.error,
    },
    animalBox: {
      marginTop: heightPercentageToDP(1.5),
      // width: widthPercentageToDP(95),
      borderColor: DarkModeReducer.onSurfaceVariant,
      // borderWidth: 0.5,
      borderRadius: 5,
    },
    animalCardStyle1: {
      justifyContent: "center",
      width: "100%",
      borderWidth: 1,
      borderRadius: 6,
      borderColor: DarkModeReducer.border,
      marginBottom: heightPercentageToDP(0.5),
      // backgroundColor: DarkModeReducer.surface,
      minHeight: 50,
      paddingHorizontal: widthPercentageToDP(3),
    },
    animalCardStyle2: {
      justifyContent: "center",
      width: "100%",
      borderWidth: 1,
      borderRadius: 6,
      borderColor: DarkModeReducer.border,
      // backgroundColor: DarkModeReducer.surface,
      minHeight: 50,
      // padding: widthPercentageToDP(2),
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
      backgroundColor: DarkModeReducer.secondary,
      borderRadius: 5,
      justifyContent: "center",
    },
  });
