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
  TouchableWithoutFeedback,
} from "react-native";
import { List, SegmentedButtons, TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { listAccessionType } from "../../services/AccessionService";
import { GetEnclosure } from "../../services/FormEnclosureServices";
import {
  DeleteAnimal,
  RestoreAnimal,
  addAnimal,
  addGroupofAnimal,
  editGroupofAnimal,
  getAnimalConfigs,
  getDeleteReasonList,
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
import { successDailog } from "../../utils/Alert";
import { checkPermissionAndNavigateWithAccess } from "../../utils/Utils";
import Config, { AnimalStatsType } from "../../configs/Config";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import RequestBy from "../../components/Move_animal/RequestBy";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { capitalize } from "lodash";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import {
  OwnerShipList,
  instituteList,
} from "../../services/MedicalMastersService";
import { getOrganization } from "../../services/Organization";
import HounsingCard from "../../components/housing/HounsingCard";

const EditAnimals = (props) => {
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const animalDetails = props.route.params?.item ?? {};
  const [isLoading, setLoding] = useState(false);
  const [isDeleted, setIsDeleted] = useState(
    props.route.params?.item?.is_deleted == "1" ? true : false
  );
  const [isTransit, setInTransit] = useState(
    props.route.params?.item?.in_transit ?? false
  );
  const [deletes, setDeeltes] = useState(props.route.params?.deleted);
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [totalCount, settotalCount] = useState(animalDetails.total_animal ?? 0);

  const [accessionType, setAccessionType] = useState(
    animalDetails.master_accession_type ?? ""
  );
  const [isAcsnTypeMenuOpen, setIsAcsnTypeMenuOpen] = useState(false);
  const [accessionTypeData, setAccessionTypeData] = useState([]);
  const [accessionTypeID, setAccessionTypeID] = useState(
    animalDetails.accession_type ?? 0
  );

  const [institutionType, setInstitutionType] = useState(
    animalDetails.institutes_label ?? ""
  );
  const [isInstituteTypeMenuOpen, setIsInstituteTypeMenuOpen] = useState(false);
  const [institutionTypeID, setInstitutionTypeID] = useState(
    animalDetails.from_institution ?? null
  );
  const [institutionTypeData, setInstitutionTypeData] = useState([]);

  const [ownershipType, setOwnershipType] = useState(
    animalDetails.ownership_terms_label ?? ""
  );
  const [isOwnershipTypeMenuOpen, setOwnershipTypeMenuOpen] = useState(false);
  const [OwnershipTypeID, setOwnershipTypeID] = useState(
    animalDetails.ownership_term ?? null
  );
  const [ownershipTypeData, setOwnershipTypeData] = useState([]);

  const permission = useSelector((state) => state.UserAuth.permission);
  const [species, setSpecies] = useState(
    animalDetails.vernacular_name +
      " (" +
      animalDetails.scientific_name +
      ")" ?? ""
  );
  const [sepciesID, setSpeciesID] = useState(animalDetails.taxonomy_id ?? "");

  const [selectEnclosure, setSelectEnclosure] = useState(
    animalDetails.user_enclosure_name ?? ""
  );
  const [selectEnclosureID, setSelectEnclosureID] = useState(
    animalDetails.enclosure_id ?? 0
  );
  const [selectEnclosureData, setSelectEnclosureData] = useState([]);
  const [isSelectEnclosure, setIsSelectEnclosure] = useState(false);

  const [selectCollectionType, setSelectCollectionType] = useState(
    animalDetails.master_collection_type ?? ""
  );
  const [selectCollectionTypeID, setSelectCollectionTypeID] = useState(
    animalDetails.collection_type ?? 0
  );
  const [selectCollectionTypeData, setSelectCollectionTypeData] = useState([]);
  const [isSelectCollectionType, setIsSelectCollectionType] = useState(false);

  const [selectOrganizationType, setSelectOrganizationType] = useState(
    animalDetails.organization_name ?? ""
  );
  const [selectOrganizationTypeID, setSelectOrganizationTypeID] = useState(
    animalDetails.organization_id ?? ""
  );
  const [isSelectOrganizationType, setIsSelectOrganizationType] =
    useState(false);
  const [selectOrganizationTypeData, setSelectOrganizationTypeData] = useState(
    []
  );

  const [accessionDate, setAccessionDate] = useState(
    animalDetails.accession_date ?? new Date()
  );

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  // For Dialouge type modal  =========================
  const [isModalVisible, setModalVisible] = useState(false);
  const [DialougeTitle, setDialougeTitle] = useState("");
  const [type, setType] = useState("");

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("Choose Reason");
  const [reasonId, setReasonId] = useState(null);
  const [isReasonModal, setIsReasonModal] = useState(false);
  const [reasonData, setReasonData] = useState([]);

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const toggleReasonModal = () => {
    setIsReasonModal(!isReasonModal);
  };
  const closeReasonModal = () => {
    setIsReasonModal(false);
  };
  const isSelectedReasonId = (id) => {
    return reasonId == id;
  };
  const closeMenuReason = (item) => {
    setReason(item.name);
    setReasonId(item.id);
    setIsReasonModal(false);
  };

  const confirmButtonPress = () => {
    if (type == "Deleteanimal") {
      getDeleteData();
      alertModalClose();
    } else if (type == "restoreAnimal") {
      RestoreAnimalDataFunc();
      alertModalClose();
    }
  };

  const cancelButtonPress = () => {
    alertModalClose();
  };

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
  const destination =
    useSelector((state) => state.AnimalMove.destination) ??
    props.route?.params?.item ??
    {};

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

  const collectionTypeClose = () => {
    setIsSelectCollectionType(false);
  };

  const isSelectedCollectionTypePressed = (id) => {
    return selectCollectionTypeID == id;
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
    if (accessionType.length === 0) {
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
  useEffect(() => {
    if (
      accessionType ||
      species ||
      selectCollectionType ||
      destination?.enclosure_id
    ) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [accessionType, species, selectCollectionType, destination?.enclosure_id]);

  const handleOnPress = () => {
    setIsError({});
    setErrorMessage({});
    if (validation()) {
      const requestObject = {
        animal_id: animalDetails.animal_id,
        accession_type: accessionTypeID,
        accession_date: moment(accessionDate).format("YYYY-MM-DD"),
        taxonomy_id: sepciesID,
        enclosure_id: destination?.enclosure_id,
        organization_id: selectOrganizationTypeID,
        from_institution: institutionTypeID,
        ownership_term: OwnershipTypeID,
        collection_type: selectCollectionTypeID,
        description: "Edit Animal",
        zoo_id: zooID,
      };
      setLoding(true);
      editGroupofAnimal(requestObject)
        .then((response) => {
          if (response.success) {
            successToast("Success!", response.message);
            navigation.goBack();
          } else {
            errorToast("error", "Oops! Something went wrong!");
          }
        })
        .catch((error) => {
          errorToast("error", "Oops! Something went wrong!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

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
    Promise.all([
      listAccessionType(),
      GetEnclosure(postData),
      getAnimalConfigs(),
      getOrganization(zooID),
    ])
      .then((res) => {
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
        setSelectOrganizationTypeData(
          res[3]?.map((item) => ({
            id: item?.id,
            name: item?.organization_name,
          }))
        );
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoding(false);
        {
          /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
        handleSubmitFocus(maleinputRef) */
        }
      });
  };

  const dropdownOff = () => {
    setIsAcsnTypeMenuOpen(false);
    setIsSelectEnclosure(false);
    setIsSelectCollectionType(false);
  };
  const RestoreAnimalData = () => {
    // Alert.alert("Restore Animal", "Do you want to restore this animal?", [
    //   {
    //     text: "Cancel",
    //     style: "cancel",
    //   },
    //   { text: "Yes", onPress: RestoreAnimalDataFunc },
    // ]);

    setDialougeTitle("Do you want to restore this animal?");
    setType("restoreAnimal");
    alertModalOpen();
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
      setType("Deleteanimal");
      alertModalOpen();
    } else {
      warningToast("Restricted", "You do not have permission to access!!");
    }
  };

  const RestoreAnimalDataFunc = () => {
    let obje = {
      animal_id: animalDetails?.animal_id,
    };
    setLoding(true);
    RestoreAnimal(obje)
      .then((res) => {
        setLoding(false);

        if (res.success) {
          successToast("success", res.message);
          setTimeout(() => {
            // navigation.replace("DeletedAnimalList");
            navigation.navigate("AnimalList", {
              name: "All Animals",
              type: AnimalStatsType.allAnimals,
            });
          }, 500);
        } else {
          errorToast("error", "Can not restore animal " + res.message);
        }
      })
      .catch((err) => {
        setLoding(false);
        errorToast("error", "Oops! Something went wrong!");
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

  const DeleteAnimalDataFunc = () => {
    setShowReasonModal(false);
    let obje = {
      animal_id: animalDetails?.animal_id,
      reason: reason,
      description: description,
    };
    setLoding(true);
    DeleteAnimal(obje)
      .then((res) => {
        setLoding(false);
        if (res.success) {
          successToast("success", res.message);
          setTimeout(() => {
            // navigation.replace("DeletedAnimalList");
            navigation.navigate("AnimalList", {
              type: AnimalStatsType.deletedAnimals,
              name: "Deleted Animals",
            });
          }, 500);
        } else {
          errorToast("error", "Can not delete animal " + res.message);
        }
      })
      .catch((err) => {
        setLoding(false);
        errorToast("error", "Oops! Something went wrong!");
      });
  };

  const gotoSelectScreen = () => {
    navigation.navigate("SearchTransferanimal", {
      type: "Select",
    });
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
        title={"Edit Group of Animals"}
        marginBottom={60}
        margin_Bottom={isTransit?10:0}

        onPress={handleOnPress}
        deletes={isDeleted}
        deleteButton={
          !isTransit
            ? animalDetails?.is_deleted == "1"
              ? RestoreAnimalData
              : DeleteAnimalData
            : false
        }
        isGroup={animalDetails?.is_deleted == "1" ? true : false}
        firstTitle={animalDetails?.is_deleted == "1" ? "Restore" : null}
        deleteTitle={"Animals"}
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
                marginLeft: -16,
              }}
              style={{
                backgroundColor: constThemeColor.onPrimary,
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
                    inputLabel={"Total Count"}
                    placeholder={"Total Count"}
                    onFocus={dropdownOff}
                    keyboardType={"numeric"}
                    value={totalCount}
                    edit={false}
                    onChange={(value) => {
                      settotalCount(value.replace(/^0|[^0-9]/g, ""));
                    }}
                    errors={errorMessage.totalCount}
                    isError={isError.totalCount}
                  />
                  <InputBox
                    inputLabel={"Accession Type*"}
                    placeholder={"Choose accession"}
                    editable={false}
                    rightElement={isAcsnTypeMenuOpen ? "menu-up" : "menu-down"}
                    value={accessionType}
                    edit={isDeleted ? false : true}
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
                    edit={isDeleted ? false : true}
                    onChange={(date) => {
                      setAccessionDate(date);
                    }}
                    maximumDate={new Date()}
                    onOpen={dropdownOff}
                  />
                  <AutoCompleteSearch
                    placeholder="Enter atleast 3 charecter to search..."
                    label="Species/Taxonomy"
                    value={species}
                    edit={isDeleted ? false : true}
                    onPress={catTaxonomydata}
                    // onFocus={catTaxonomydata}
                    errors={errorMessage.species}
                    isError={isError.species}
                    onClear={() => {
                      setSpeciesID("");
                      setSpecies("");
                    }}
                  />
                  {/* <InputBox
                    inputLabel={"Select Enclosure"}
                    placeholder={"Choose Enclosure"}
                    editable={false}
                    edit={isDeleted?false:true}
                    DropDown={SetSelectEncDropDown}
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
                    edit={isDeleted ? false : true}
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
export default EditAnimals;
