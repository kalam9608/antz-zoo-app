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
} from "react-native";
import { List, SegmentedButtons } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { listAccessionType } from "../../services/AccessionService";
import { GetEnclosure } from "../../services/FormEnclosureServices";
import {
  addAnimal,
  addGroupofAnimal,
  getAnimalConfigs,
} from "../../services/AnimalService";
import moment from "moment";
import InputBox from "../../components/InputBox";
import DatePicker from "../../components/DatePicker";
import Colors from "../../configs/Colors";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/core";
import { AutoCompleteSearch } from "../../components/AutoCompleteSearch";
import Modal from "react-native-modal";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import RequestBy from "../../components/Move_animal/RequestBy";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { capitalize } from "lodash";
import { AntDesign } from "@expo/vector-icons";
import { setDestination } from "../../redux/AnimalMovementSlice";
import { useToast } from "../../configs/ToastConfig";
import { AnimalStatsType } from "../../configs/Config";
import { getHousingSection } from "../../services/housingService/SectionHousing";
import { getParentOrChildEnc } from "../../services/Animal_movement_service/MoveAnimalService";
import ModalFilterComponent from "../../components/ModalFilterComponent";
import { getOrganization } from "../../services/Organization";
import {
  OwnerShipList,
  instituteList,
} from "../../services/MedicalMastersService";
import HounsingCard from "../../components/housing/HounsingCard";

const AnimalsAdd = (props) => {
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const [totalCount, settotalCount] = useState(0);
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [isLoading, setLoding] = useState(false);

  const [accessionType, setAccessionType] = useState("");
  const [isAcsnTypeMenuOpen, setIsAcsnTypeMenuOpen] = useState(false);
  const [accessionTypeData, setAccessionTypeData] = useState([]);
  const [accessionTypeID, setAccessionTypeID] = useState("");

  const [institutionType, setInstitutionType] = useState("");
  const [isInstituteTypeMenuOpen, setIsInstituteTypeMenuOpen] = useState(false);
  const [institutionTypeID, setInstitutionTypeID] = useState(null);
  const [institutionTypeData, setInstitutionTypeData] = useState([]);

  const [ownershipType, setOwnershipType] = useState("");
  const [isOwnershipTypeMenuOpen, setOwnershipTypeMenuOpen] = useState(false);
  const [OwnershipTypeID, setOwnershipTypeID] = useState(null);
  const [ownershipTypeData, setOwnershipTypeData] = useState([]);

  const [species, setSpecies] = useState("");
  const [sepciesID, setSpeciesID] = useState("");
  const dispatch = useDispatch();
  const [selectEnclosure, setSelectEnclosure] = useState(
    props.route.params?.item?.user_enclosure_name
      ? props.route.params?.item?.user_enclosure_name
      : ""
  );
  const [selectEnclosureID, setSelectEnclosureID] = useState(
    props.route.params?.item?.enclosure_id
      ? props.route.params?.item?.enclosure_id
      : ""
  );

  const [selectEnclosureData, setSelectEnclosureData] = useState([]);
  const [isSelectEnclosure, setIsSelectEnclosure] = useState(false);

  const [selectCollectionType, setSelectCollectionType] = useState("");
  const [selectCollectionTypeID, setSelectCollectionTypeID] = useState("");
  const [selectCollectionTypeData, setSelectCollectionTypeData] = useState([]);
  const [isSelectCollectionType, setIsSelectCollectionType] = useState(false);

  const [selectOrganizationType, setSelectOrganizationType] = useState("");
  const [selectOrganizationTypeID, setSelectOrganizationTypeID] = useState("");
  const [isSelectOrganizationType, setIsSelectOrganizationType] =
    useState(false);
  const [selectOrganizationTypeData, setSelectOrganizationTypeData] = useState(
    []
  );

  const [accessionDate, setAccessionDate] = useState(new Date());
  const destination =
    useSelector((state) => state.AnimalMove.destination) ??
    props.route?.params?.item ??
    {};

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const SetAcsnTypeDropDown = () => {
    setIsAcsnTypeMenuOpen(!isAcsnTypeMenuOpen);
    setIsSelectEnclosure(false);
    setIsSelectCollectionType(false);
  };

  const accessPressed = (item) => {
    setIsAcsnTypeMenuOpen(!isAcsnTypeMenuOpen);
    setAccessionType(item.name);
    setAccessionTypeID(item.id);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    datePicker1Ref.current.focus();*/
    }
  };
  const isSelectedAccessionTypeIDPressed = (id) => {
    return accessionTypeID == id;
  };

  const acsnClose = () => {
    setIsAcsnTypeMenuOpen(false);
  };
  const SetSelectEncDropDown = () => {
    setIsSelectEnclosure(!isSelectEnclosure);
    setIsAcsnTypeMenuOpen(false);
    setIsSelectCollectionType(false);
  };

  const enclosurePressed = (item) => {
    setIsSelectEnclosure(!isSelectEnclosure);
    setSelectEnclosure(item.map((value) => value.name).join(","));
    setSelectEnclosureID(item.map((value) => value.id).join(","));
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    forthOneOpen();*/
    }
  };

  const catTaxonomydata = (item) => {
    if (item) {
      setSpecies(item.title);
      setSpeciesID(item.id);
      {
        /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
      thirdOneOpen()*/
      }
    }
  };

  const encClose = () => {
    setIsSelectEnclosure(false);
  };
  const SetCollectionTypeDown = () => {
    setIsSelectCollectionType(!isSelectCollectionType);
    setIsAcsnTypeMenuOpen(false);
    setIsSelectEnclosure(false);
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
    setIsAcsnTypeMenuOpen(false);
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

  const SetInstituteTypeDropDown = () => {
    setIsInstituteTypeMenuOpen(!isInstituteTypeMenuOpen);
    setIsSelectCollectionType(false);
    setIsSelectOrganizationType(false);
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
  const InstiClose = () => {
    setIsInstituteTypeMenuOpen(false);
  };
  const isSelectedInstituteTypePressed = (id) => {
    return institutionTypeID == id;
  };

  const SetOwnershipTypeDropDown = () => {
    setOwnershipTypeMenuOpen(!isOwnershipTypeMenuOpen);
    setIsSelectCollectionType(false);
    setIsSelectOrganizationType(false);
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
  const OwnershipClose = () => {
    setOwnershipTypeMenuOpen(false);
  };
  const isSelectedOwnershipTypePressed = (id) => {
    return OwnershipTypeID == id;
  };

  const validation = () => {
    if (totalCount < 1) {
      setIsError({ totalCount: true });
      setErrorMessage({ totalCount: "This field is required*" });
      return false;
    } else if (accessionType.length === 0) {
      setIsError({ accessionType: true });
      setErrorMessage({ accessionType: "This field is required*" });
      return false;
    } else if (
      accessionType == "From Institution" &&
      institutionType.length == 0
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
      setErrorMessage({ selectEnclosure: "This field is required*" });
      return false;
    } else if (selectCollectionType.length === 0) {
      setIsError({ selectCollectionType: true });
      setErrorMessage({ selectCollectionType: "This field is required*" });
      return false;
    }
    return true;
  };

  const handleOnPress = () => {
    setIsError({});
    setErrorMessage({});
    if (validation()) {
      const requestObject = {
        accession_type: accessionTypeID,
        accession_date: moment(accessionDate).format("YYYY-MM-DD"),
        taxonomy_id: sepciesID,
        enclosure_id: destination?.enclosure_id,
        organization_id: selectOrganizationTypeID,
        from_institution: institutionTypeID,
        ownership_term: OwnershipTypeID,
        totalCount: totalCount,
        collection_type: selectCollectionTypeID,
        description: "Add Animal",
        zoo_id: zooID,
      };
      setLoding(true);

      addGroupofAnimal(requestObject)
        .then((response) => {
          if (response.success) {
            successToast("Success ", response?.message ?? "");
            // navigation.goBack();
            navigation.replace("AnimalList", {
              type: AnimalStatsType.recentlyAdded,
              name: "Recently Added",
            });
          } else {
            errorToast("Oops!", "Something went wrong!!");
          }
        })
        .catch((error) => {
          errorToast("Oops!", "Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };
  useEffect(() => {
    if (totalCount || accessionType || species || selectCollectionType) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [totalCount, accessionType, species, selectCollectionType]);

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

  useEffect(() => {
    getRefreshData();
    getOwnershipData();
    getData();
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
      GetEnclosure(postData),
      getAnimalConfigs(),
      getHousingSection(postDataSection),
      getOrganization(zooID),
    ])
      .then((res) => {
        setAccessionTypeData(
          res[0].data.map((item) => ({
            id: item.accession_id,
            name: item.accession_type,
          }))
        );
        setSelectEnclosureData(
          res[1].data.map((item) => ({
            id: item.enclosure_id,
            name: item.user_enclosure_name,
            isSelect:
              item?.enclosure_id == props.route.params?.item?.enclosure_id
                ? true
                : false,
          }))
        );
        setSelectCollectionTypeData(
          res[2].data.collection_type.map((item) => ({
            id: item.id,
            name: item.label,
          }))
        );
        setSelectOrganizationTypeData(
          res[4]?.map((item) => ({
            id: item?.id,
            name: item?.organization_name,
          }))
        );
        if (res[3]?.sections[0]?.length == 1) {
          if (res[3]?.sections[0][0]?.total_enclosures == 1) {
            getParentEnclosureData(res[3]?.sections[0][0]?.section_id);
          }
        }
      })
      .catch((err) => {
        errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setLoding(false);
        {
          /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
        handleSubmitFocus(maleinputRef) */
        }
      });
  };
  getParentEnclosureData = (id) => {
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
        setLoading(false);
      });
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
  const maleinputRef = useRef(null);
  const femaleinputRef = useRef(null);
  const undetinputRef = useRef(null);
  const indetinputRef = useRef(null);
  const localinputRef = useRef(null);
  const datePicker1Ref = useRef(null);
  const datePicker21Ref = useRef(null);
  const handleSubmitFocus = (refs) => {
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    if (refs.current) {
      refs.current.focus();
    }*/
    }
  };

  const thirdOneOpen = () => {
    setIsSelectEnclosure(true);
  };
  const forthOneOpen = () => {
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
    setIsSelectEnclosure(false);
    setIsSelectCollectionType(false);
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
        title={"Add Group of Animals"}
        marginBottom={60}
        onPress={handleOnPress}
        back={() => {
          dispatch(setDestination(null));
          navigation.goBack();
        }}
      >
        <Loader visible={isLoading} />
        <View>
          <List.Section>
            <List.Accordion
              title="Basic Information"
              id="1"
              expanded={true}
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
            >
              <View style={{ marginBottom: 15 }}>
                <View>
                  <InputBox
                    refs={maleinputRef}
                    // autoFocus={true}
                    inputLabel={"Total Count"}
                    placeholder={"Total Count"}
                    onFocus={dropdownOff}
                    keyboardType={"numeric"}
                    // onSubmitEditing={() => handleSubmitFocus(femaleinputRef)}
                    value={totalCount}
                    onChange={(value) => {
                      settotalCount(value.replace(/^0|[^0-9]/g, ""));
                    }}
                    errors={errorMessage.totalCount}
                    isError={isError.totalCount}
                  />
                  <InputBox
                    inputLabel={"Accession Type"}
                    placeholder={"Choose accession"}
                    editable={false}
                    rightElement={isAcsnTypeMenuOpen ? "menu-up" : "menu-down"}
                    value={accessionType}
                    DropDown={SetAcsnTypeDropDown}
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
                    editable={false}
                    rightElement={
                      isOwnershipTypeMenuOpen ? "menu-up" : "menu-down"
                    }
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
                    style={{ borderBottomLeftRadius: 0 }}
                    today={accessionDate}
                    refs={datePicker1Ref}
                    onChange={(date) => {
                      setAccessionDate(date);
                    }}
                    maximumDate={new Date()}
                    onOpen={dropdownOff}
                  />
                  <AutoCompleteSearch
                    placeholder="Species/Taxonomy"
                    label="Species/Taxonomy"
                    onPress={catTaxonomydata}
                    errors={errorMessage.species}
                    isError={isError.species}
                    value={species}
                    onClear={() => {
                      setSpeciesID("");
                      setSpecies("");
                    }}
                  />

                  {/* <InputBox
                    inputLabel={"Select Enclosure"}
                    placeholder={"Choose Enclosure"}
                    editable={false}
                    DropDown={SetSelectEncDropDown}
                    value={selectEnclosure}
                    rightElement={isSelectEnclosure ? "menu-up" : "menu-down"}
                    // defaultValue={
                    //   selectEnclosure != null ? selectEnclosure : null
                    // }
                    errors={errorMessage.selectEnclosure}
                    isError={isError.selectEnclosure}
                  /> */}
                  <View style={reduxColors.destinationBox}>
                    <TouchableOpacity
                      onPress={gotoSelectScreen}
                      style={[
                        reduxColors.animalCardStyle,
                        {
                          minHeight: destination?.enclosure_id
                            ? heightPercentageToDP(14)
                            : 50,
                        },
                        {
                          borderColor:
                            isError.selectEnclosure &&
                            !destination?.enclosure_id
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
                              title={capitalize(
                                destination?.user_enclosure_name
                              )}
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
                  <InputBox
                    inputLabel={"Collection Type*"}
                    placeholder={"Choose collection"}
                    editable={false}
                    DropDown={SetCollectionTypeDown}
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
              </View>
            </List.Accordion>
          </List.Section>
        </View>
      </CustomForm>

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
          isSelectedId={isSelectedAccessionTypeIDPressed}
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
    </>
  );
};
const styles = (reduxColors) =>
  StyleSheet.create({
    checkboxWrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 0.8,
      borderColor: "grey",
      borderTopWidth: 0,
      marginTop: -10,
      padding: 10,
    },
    label: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.neutral50,
    },
    botton: {
      borderWidth: 0.8,
      borderColor: "grey",
      padding: Spacing.small,
      paddingHorizontal: Spacing.minor,
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
  });
export default AnimalsAdd;
