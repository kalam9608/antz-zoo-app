import React, { useEffect, useState, useRef } from "react";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Category from "../../components/DropDownBox";
import CustomForm from "../../components/CustomForm";
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  Platform,
  Alert,
  BackHandler,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
} from "react-native";
import {
  getSection,
  getEnclosurebySection,
} from "../../services/staffManagement/getEducationType";
import { AddEnclosure } from "../../services/FormEnclosureServices";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import { Checkbox, List, SegmentedButtons } from "react-native-paper";

import InputBox from "../../components/InputBox";
import { getEnclosureService } from "../../services/SettingEnclosure";
import DatePicker from "../../components/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import { getStaffList } from "../../services/staffManagement/addPersonalDetails";
import moment from "moment";
import FontSize from "../../configs/FontSize";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import RequestBy from "../../components/Move_animal/RequestBy";
import {
  removeAnimalMovementData,
  setApprover,
} from "../../redux/AnimalMovementSlice";
import { errorToast } from "../../utils/Alert";
import InchargeCard from "../../components/InchargeCard";
import DynamicAlert from "../../components/DynamicAlert";
import { useToast } from "../../configs/ToastConfig";
import * as ImagePicker from "expo-image-picker";
import { getFileData, getTextWithoutExtraSpaces } from "../../utils/Utils";
import Spacing from "../../configs/Spacing";
import { handleFilesPick } from "../../utils/UploadFiles";

const CreateEnclosure = (props) => {
  const { height, width } = useWindowDimensions();
  const navigation = useNavigation();
  const [value, setValue] = useState("single");
  const [foundDate, setFoundDate] = useState(new Date());

  const [enclosureName, setEnclosureName] = useState("");
  const [enclosureDesc, SetEnclosureDesc] = useState(
    props.route.params?.item?.enclosure_desc ?? ""
  );
  const [enclosureCode, setEnclosureCode] = useState(
    props.route.params?.item?.enclosure_code ?? ""
  );
  const [isMovable, setIsMovable] = useState(false);
  const [isWalkable, setIsWalkable] = useState(false);

  const [enclosureSunlight, setEnclosureSunlight] = useState(
    props.route.params?.item?.enclosure_sunlight ?? ""
  );
  const [approverList, setApproverList] = useState([]);
  const [isSunlight, setIsSunlight] = useState(false);
  const [sunlightData, setSunlightData] = useState([
    { id: "0", name: "Moderate" },
    { id: "1", name: "Good" },
    { id: "2", name: "Bad" },
  ]);

  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [sectionData, setSectionData] = useState([]);
  const [section, setSection] = useState(
    (props.route.params?.item?.data ||
      props.route.params?.section_name ||
      props.route.params?.item?.section_name) ??
      ""
  );
  const [sectionId, setSectionId] = useState(
    (props.route.params?.item?.section_id ||
      props.route.params?.section_id ||
      props.route.params?.item?.section_id) ??
      ""
  );
  const approver = useSelector((state) =>
    Object.keys(state.AnimalMove.approver)?.length > 0
      ? state.AnimalMove.approver
      : []
  );

  useEffect(() => {
    setApproverList(approver);
  }, [JSON.stringify(approver)]);
  const deleteApprover = (id) => {
    const filter = approverList?.filter((p) => p?.user_id != id);
    setApproverList(filter);
    dispatch(setApprover(filter));
  };
  const [isInchargeMenuOpen, setIsInchargeMenuOpen] = useState(false);
  const [incharge, setIncharge] = useState("");
  const [inchargeId, setInchargeId] = useState(
    props.route.params?.item?.enclosure_incharge_id ?? ""
  );
  const [inchargeData, setInchargeData] = useState([]);

  const [isEnclosureOpen, setIsEnclosureOpen] = useState(false);
  const [enclosureData, setEnclosureData] = useState([]);
  const [enclosure, setParentEnclosure] = useState(
    props.route.params?.item?.user_enclosure_name
      ? props.route?.params?.item?.user_enclosure_name
      : ""
  );
  const [enclosureParentId, setParentEnclosureId] = useState(
    props.route.params?.item?.enclosure_id ?? null
  );

  const [isEncEnvMenuOpen, setisEncEnvMenuOpen] = useState(false);
  const [encEnvData, setencEnvData] = useState([]);
  const [enclosureEnvironment, setEnclosureEnvironment] = useState(
    props.route.params?.item?.enclosure_environment ?? ""
  );
  const [enclosureEnvironmentId, setEnclosureEnvironmentId] = useState("");
  const [aquaEnctype, setAquaEnctype] = useState([]);

  const [isEncTypeMenuOpen, setisEncTypeMenuOpen] = useState(false);
  const [enclosureType, setEnclosureType] = useState(
    props.route.params?.item?.enclosure_type ?? ""
  );
  const [enclosureTypeId, setEnclosureTypeId] = useState(
    props.route.params?.item?.enclosure_type_id ?? ""
  );
  const [encTypeData, setencTypeData] = useState([]);

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoding] = useState(false);

  const [batchCount, setBatchCount] = useState(0);
  const [batchStartSeq, setBatchStartSeq] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const { showToast, errorToast } = useToast();
  const user_id = useSelector((state) => state.UserAuth.userDetails.user_id);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const dispatch = useDispatch();

  const [selectedItems, setSelectedItems] = useState([]);
  const [documentModal, setDocumentModal] = useState(false);

  const [displayIcon, setDisplayIcon] = useState(null);
  const [galleryImage, setGalleryImage] = useState([]);

  // updated by Md KALAM : change the errow icon to plus and minus icons whenever clicked !
  const [expand, setExpanded] = React.useState({
    Basic: false,
    Information: false,
    Facilities: false,
  });

  const handlePressInformation = () => {
    setExpanded((prevState) => ({
      ...prevState,
      Information: !prevState.Information,
    }));
  };
  const handlePressFacilities = () => {
    setExpanded((prevState) => ({
      ...prevState,
      Facilities: !prevState.Facilities,
    }));
  };

  const segmentRef = useRef(null);
  const encCountRef = useRef(null);
  const seqStartRef = useRef(null);
  const encNameRef = useRef(null);
  const envTypeRef = useRef(null);
  const encTypeRef = useRef(null);
  const secRef = useRef(null);
  const parentEncRef = useRef(null);
  const sunlightRef = useRef(null);
  const datePickerRef = useRef(null);
  const notesRef = useRef(null);

  const catPressed = (item) => {
    setSection(item.map((u) => u.name).join(", "));
    setSectionId(item.map((id) => id.id).join(","));
    setIsSectionMenuOpen(false);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    parentEncRef.current.focus();*/
    }
  };

  const catClose = () => {
    setIsSectionMenuOpen(false);
  };

  const parentEnclosurePressed = (item) => {
    setParentEnclosure(item.map((u) => u.name).join(", "));
    setParentEnclosureId(item.map((id) => id.id).join(","));
    setIsEnclosureOpen(false);
  };

  const parentEnclosureClose = () => {
    setIsEnclosureOpen(false);
  };

  const catEnvPress = (item) => {
    setEnclosureEnvironment(item[0].name);
    setEnclosureEnvironmentId(item[0].id);
    setEnclosureTypeId("");
    setEnclosureType("");
    setisEncEnvMenuOpen(false);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    encTypeRef.current.focus();*/
    }
  };

  const catEnvClose = () => {
    setisEncEnvMenuOpen(false);
  };

  const catEnTypePress = (item) => {
    setEnclosureType(item.map((u) => u.name).join(","));
    setEnclosureTypeId(item.map((u) => u.id).join(","));
    setisEncTypeMenuOpen(false);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    secRef.current.focus();*/
    }
  };

  const catEnTypeClose = () => {
    setisEncTypeMenuOpen(false);
  };

  const catIsSunlightPress = (item) => {
    setEnclosureSunlight(item.map((u) => u.name).join(","));
    setIsSunlight(false);
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    datePickerRef.current.focus();*/
    }
  };

  const catIsSunlightClose = () => {
    setIsSunlight(false);
  };

  useEffect(() => {
    if (sectionId) {
      getEnclosurebySection(sectionId).then((res) => {
        let enc = res?.data.map((item) => {
          return {
            id: item.enclosure_id,
            name: item.user_enclosure_name,
            isSelect:
              item?.enclosure_id == props.route.params?.item?.enclosure_id
                ? true
                : false,
          };
        });
        setEnclosureData(enc);
      });
    }
  }, [sectionId]);

  useEffect(() => {
    setLoding(true);
    var postData = {
      zoo_id: zooID,
    };
    Promise.all([
      getStaffList(postData),
      getSection(postData),
      getEnclosureService(),
    ]).then((res) => {
      let section = res[1].data.map((item) => {
        return {
          id: item.section_id,
          name: item.section_name,
          isSelect:
            item?.section_id == props.route.params?.item?.section_id
              ? true
              : false,
        };
      });
      let env_type = res[2].data.environment_type.map((item) => {
        return {
          id: item.string_id,
          name: item.name,
        };
      });
      let incharges = res[0].data.map((item) => {
        return {
          id: item.user_id,
          name: item.user_first_name + " " + item.user_last_name,
        };
      });

      setInchargeData(incharges);
      setencTypeData(res[2].data.enclosure_type);
      setencEnvData(env_type);
      setAquaEnctype(res[2].data.aquatic_enclosure_type);
      setSectionData(section);
      setLoding(false);
    });
  }, []);

  const validation = () => {
    if (enclosureName.trim().length === 0) {
      setIsError({ enclosureName: true });
      setErrorMessage({ enclosureName: "This field is required!!" });
      return false;
    } else if (enclosureEnvironment.trim().length === 0) {
      setIsError({ enclosureEnvironment: true });
      setErrorMessage({
        enclosureEnvironment: "This field is required!!",
      });
      return false;
    } else if (enclosureType.trim().length === 0) {
      setIsError({ enclosureType: true });
      setErrorMessage({ enclosureType: "This field is required!!" });
      return false;
    } else if (section.length === 0) {
      setIsError({ section: true });
      setErrorMessage({ section: "This field is required!!" });
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (enclosureName || enclosureEnvironment || enclosureType || section) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [enclosureName, enclosureEnvironment, enclosureType, section]);

  const getEnclosureFormData = () => {
    if (validation()) {
      let obj = {
        user_enclosure_name: getTextWithoutExtraSpaces(enclosureName),
        section_id: sectionId,
        enclosure_desc: enclosureDesc,
        user_enclosure_id: user_id,
        enclosure_code: enclosureCode,
        enclosure_environment: enclosureEnvironment,
        // enclosure_incharge_id: approverList?.map((i) => i.user_id).join(","),
        enclosure_is_movable: Number(isMovable),
        enclosure_is_walkable: Number(isWalkable),
        enclosure_type: enclosureTypeId,
        enclosure_sunlight: enclosureSunlight,
        enclosure_parent_id: enclosureParentId,
        commistioned_date: moment(foundDate).format("YYYY-MM-DD"),
        batch_count: batchCount,
        batch_seq: batchStartSeq,
        zoo_id: zooID,
        "enclosure_image[]": displayIcon,
      };
      setLoding(true);
      AddEnclosure(obj, galleryImage)
        .then((res) => {
          if (res.success) {
            dispatch(removeAnimalMovementData());
            showToast("success", res?.message);
            if (res.data?.enclosure_id) {
              navigation.replace("OccupantScreen", {
                enclosure_id: res.data?.enclosure_id,
              });
            } else {
              navigation.replace("HousingEnclosuer", {
                section_id: sectionId,
              });
            }
          } else {
            showToast("error", res?.message);
          }
        })
        .catch((err) => {
          showToast("error", "Something Went Wrong");
        })
        .finally(() => {
          // showAlert();
          setLoding(false);
        });
    }
  };

  const SetEncDropDown = (data) => {
    setIsSectionMenuOpen(!isSectionMenuOpen);
    setisEncEnvMenuOpen(false);
    setisEncTypeMenuOpen(false);
    setIsEnclosureOpen(false);
    setIsSunlight(false);
  };

  const SetParentEncDropDown = (data) => {
    setIsSectionMenuOpen(false);
    setisEncEnvMenuOpen(false);
    setisEncTypeMenuOpen(false);
    setIsEnclosureOpen(!isEnclosureOpen);
    setIsSunlight(false);
  };

  const SetEnvTypeDropDown = (data) => {
    setisEncEnvMenuOpen(!isEncEnvMenuOpen);
    setIsSectionMenuOpen(false);
    setisEncTypeMenuOpen(false);
    setIsSunlight(false);
    setIsEnclosureOpen(false);
  };

  const SetEncTypeDropDown = (data) => {
    setisEncTypeMenuOpen(!isEncTypeMenuOpen);
    setisEncEnvMenuOpen(false);
    setIsSectionMenuOpen(false);
    setIsSunlight(false);
    setIsEnclosureOpen(false);
  };

  const SetIsSunlightDropDown = () => {
    setIsSunlight(!isSunlight);
    setIsSectionMenuOpen(false);
    setisEncEnvMenuOpen(false);
    setisEncTypeMenuOpen(false);
    setIsEnclosureOpen(false);
  };

  const dropdownOff = () => {
    setIsSunlight(false);
    setIsSectionMenuOpen(false);
    setisEncEnvMenuOpen(false);
    setisEncTypeMenuOpen(false);
    setIsEnclosureOpen(false);
  };

  const getdateFound = (date) => {
    setFoundDate(date);
    handleSubmitFocus(notesRef);
  };

  // incharge
  const SetInchargeDropDown = () => {
    setIsInchargeMenuOpen(!isInchargeMenuOpen);

    setisEncEnvMenuOpen(false);
    setisEncTypeMenuOpen(false);
    setIsEnclosureOpen(false);
    setIsSectionMenuOpen(false);

    setisEncEnvMenuOpen(false);
    setisEncTypeMenuOpen(false);
    setIsEnclosureOpen(false);
  };

  const inchargeCatPressed = (item) => {
    setIncharge(item.map((u) => u.name).join(", "));

    setInchargeId(item.map((id) => id.id).join(","));

    // setIsInchargeMenuOpen(false);
  };

  const inchargeCatClose = () => {
    setIsInchargeMenuOpen(false);
    // parentEncRef.current.focus();
  };

  const onCheckLimitEnclosure = (value) => {
    const cleanNumber = value.replace(/^0|[^0-9]/g, "");
    setBatchCount(cleanNumber);
    setIsError({ enclosureCount: false });
  };

  const onCheckLimitSequense = (value) => {
    const cleanNumber = value.replace(/^0|[^0-9]/g, "");
    setBatchStartSeq(cleanNumber);
    setIsError({ enclosureSequense: false });
  };

  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  const handleSubmitFocus = (refs) => {
    {
      /*Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
    if (refs.current) {
      refs.current.focus();
    }*/
    }
  };

  const onPressMovable = () => {
    setIsMovable(!isMovable);
  };
  const onPressWalkable = () => {
    setIsWalkable(!isWalkable);
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert(
  //       "Confirmation",
  //       "Are you sure you want to go back?",
  //       [
  //         { text: "Cancel", style: "cancel", onPress: () => {} },
  //         { text: "OK", onPress: () => navigation.goBack() },
  //       ],
  //       { cancelable: false }
  //     );
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, [navigation]);

  const gotoApprovalScreen = () => {
    navigation.navigate("InchargeAndApproverSelect", {
      selectedInchargeIds: approverList.map((item) => item.user_id),
      inchargeDetailsData: approverList,
    });
  };

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  // ****image upload*****
  const toggleModal = () => {
    setDocumentModal(!documentModal);
  };

  const pickIcon = async () => {
    const result = await handleFilesPick(errorToast, "image", setLoding);
    if (result&&result?.length>0) {
      setDisplayIcon(result[0]);
    }
    
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: true, // Enable multi-selection
      });

      if (!result.canceled) {
        setDocumentModal(false);
        const selectedImages = result.assets.map((asset) => getFileData(asset));
        setGalleryImage([...galleryImage, ...selectedImages]);
      }

      // if (
      //   result &&
      //   !result.canceled &&
      //   result.assets &&
      //   result.assets.length > 0
      // ) {
      //   setGalleryImage([...galleryImage, getFileData(result.assets[0])]);
      //   setDocumentModal(false);
      // }
    } catch (err) {
      console.log("Error picking image:", err);
    }
  };

  const removeDocuments = (docsName) => {
    const filterData = galleryImage?.filter((item) => {
      if (
        item?.type == "image/jpeg" ||
        item?.type == "image/png" ||
        item?.type == "image/jpg"
      ) {
        return item?.uri != docsName;
      } else {
        return item?.name != docsName;
      }
    });
    setGalleryImage(filterData);
  };

  return (
    <>
      <Loader visible={loading} />
      <CustomForm
        header={true}
        title={"Add Enclosure"}
        marginBottom={50}
        onPress={getEnclosureFormData}
      >
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

        <View>
          <List.Section>
            {value === "batch" ? (
              <View style={{ display: "flex" }}>
                <List.Accordion
                  title="Batch Options"
                  id="1"
                  // expanded={true}
                  titleStyle={{
                    color: constThemeColor.onPrimaryContainer,
                    fontSize: FontSize.Antz_Minor_Medium.fontSize,
                    fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                    marginLeft: -8,
                  }}
                  style={{
                    paddingLeft: 0,
                    backgroundColor: constThemeColor.onPrimary,
                  }}
                  expanded={!expand.batchOptions}
                  right={(props) => (
                    <List.Icon
                      {...props}
                      icon="minus"
                      style={{ display: "none" }}
                    />
                  )}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: 0,
                    }}
                  >
                    <View style={{ width: "50%", paddingRight: 5 }}>
                      <InputBox
                        inputLabel={"Enclosure Count"}
                        placeholder={"Count"}
                        keyboardType={"number-pad"}
                        refs={encCountRef}
                        onFocus={dropdownOff}
                        onSubmitEditing={() => handleSubmitFocus(seqStartRef)}
                        onChange={(value) => onCheckLimitEnclosure(value)}
                        value={batchCount}
                        errors={errorMessage.enclosureCount}
                        isError={isError.enclosureCount}
                      />
                    </View>
                    <View style={{ width: "50%", paddingLeft: 5 }}>
                      <InputBox
                        inputLabel={"Sequence Start"}
                        refs={seqStartRef}
                        onFocus={dropdownOff}
                        keyboardType={"numeric"}
                        placeholder={"Start"}
                        onChange={(value) => onCheckLimitSequense(value)}
                        value={batchStartSeq}
                        onSubmitEditing={() => handleSubmitFocus(encNameRef)}
                        errors={errorMessage.enclosureSequense}
                        isError={isError.enclosureSequense}
                      />
                    </View>
                  </View>
                </List.Accordion>
              </View>
            ) : null}
          </List.Section>

          {value === "batch" ? null : (
            <View style={reduxColors.iconStyle}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    pickIcon();
                  }}
                  style={[reduxColors.iconImage]}
                >
                  {displayIcon === null ? (
                    <MaterialIcons
                      name="add-photo-alternate"
                      size={72}
                      color={constThemeColor.onPrimary}
                    />
                  ) : (
                    <Image
                      source={{ uri: displayIcon.uri }}
                      style={reduxColors.iconImage}
                    />
                  )}
                </TouchableOpacity>
                {/* <TouchableOpacity
                onPress={() => {
                  pickIcon();
                }}
              >
                <Text style={reduxColors.iconImageText}>
                  {displayIcon === null
                    ? "Add Display Picture"
                    : "Change Display Picture"}
                </Text>
              </TouchableOpacity> */}

                {!displayIcon ? (
                  <TouchableOpacity
                    onPress={() => {
                      pickIcon();
                    }}
                  >
                    <Text style={reduxColors.iconImageText}>
                      Add Display Picture{" "}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setDisplayIcon(null);
                    }}
                  >
                    <Text
                      style={[
                        reduxColors.iconImageText,
                        { color: constThemeColor.error },
                      ]}
                    >
                      Remove Display Picture{" "}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
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
                <List.Icon
                  {...props}
                  icon="minus"
                  style={{ display: "none" }}
                />
              )}
              expanded={!expand.Basic}
            >
              <View style={{ marginBottom: 15 }}>
                <InputBox
                  refs={encNameRef}
                  keyboardType={"default"}
                  value={enclosureName}
                  inputLabel={
                    value === "single"
                      ? "Enclosure Name/Prefix*"
                      : "Enclosure Prefix*"
                  }
                  placeholder={
                    value === "single"
                      ? "Enter Enclosure Name/Prefix"
                      : "Enter Enclosure Prefix"
                  }
                  onFocus={dropdownOff}
                  onChange={(value) => setEnclosureName(value)}
                  onSubmitEditing={() => handleSubmitFocus(envTypeRef)}
                  isError={isError.enclosureName}
                  errors={errorMessage.enclosureName}
                />
                <InputBox
                  refs={envTypeRef}
                  inputLabel={"Environment Type*"}
                  placeholder={"Choose Environment"}
                  value={enclosureEnvironment}
                  defaultValue={
                    enclosureEnvironment != null ? enclosureEnvironment : null
                  }
                  rightElement={isEncEnvMenuOpen ? "menu-up" : "menu-down"}
                  onFocus={SetEnvTypeDropDown}
                  DropDown={SetEnvTypeDropDown}
                  errors={errorMessage.enclosureEnvironment}
                  isError={isError.enclosureEnvironment}
                />

                <InputBox
                  inputLabel={"Enclosure Type*"}
                  placeholder={"Choose Enclosure Type"}
                  refs={encTypeRef}
                  value={enclosureType}
                  defaultValue={enclosureType != null ? enclosureType : null}
                  rightElement={isEncTypeMenuOpen ? "menu-up" : "menu-down"}
                  onFocus={SetEncTypeDropDown}
                  DropDown={SetEncTypeDropDown}
                  errors={errorMessage.enclosureType}
                  isError={isError.enclosureType}
                />

                <InputBox
                  inputLabel={"Choose Section*"}
                  placeholder={"Choose Section Name"}
                  edit={props.route?.params?.section_id ? false : true}
                  refs={secRef}
                  value={section}
                  defaultValue={section != null ? section : null}
                  onFocus={SetEncDropDown}
                  DropDown={SetEncDropDown}
                  rightElement={isSectionMenuOpen ? "menu-up" : "menu-down"}
                  errors={errorMessage.section}
                  isError={isError.section}
                  helpText={"Section where the enclosure is located"}
                />
                {enclosureData.length > 0 && section ? (
                  <InputBox
                    inputLabel={"Parent Enclosure"}
                    placeholder={"Choose Parent Enclosure"}
                    refs={parentEncRef}
                    value={enclosure}
                    defaultValue={section != null ? section : null}
                    onFocus={SetParentEncDropDown}
                    DropDown={SetParentEncDropDown}
                    rightElement={isEnclosureOpen ? "menu-up" : "menu-down"}
                    errors={errorMessage.enclosure}
                    isError={isError.enclosure}
                    helpText={"Assign your enclosure as child under this"}
                  />
                ) : null}

                {/* <View style={{ marginVertical: 8 }}>
                  <InchargeCard
                    navigation={gotoApprovalScreen}
                    title={"Choose Incharge"}
                    selectedUserData={approverList}
                    removeAsign={(item) => deleteApprover(item?.user_id)}
                    outerStyle={{
                      borderWidth: inchargeId ? 2 : 1,
                      borderRadius: 5,
                      backgroundColor: constThemeColor.surface,
                      borderColor: constThemeColor.outline,
                    }}
                  />
                </View> */}

                {/* {value !== "batch" && (
                  <View style={{ marginVertical: Spacing.small }}>
                    <View
                      style={[
                        reduxColors.attatchmentView,
                        {
                          backgroundColor:
                            selectedItems?.length > 0
                              ? constThemeColor.displaybgPrimary
                              : constThemeColor.surface,

                          borderWidth: selectedItems?.length > 0 ? 2 : 1,
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => setDocumentModal(!documentModal)}
                      >
                        <View style={reduxColors.attatchmentViewinner}>
                          <Text
                            style={{
                              color: constThemeColor.onSecondaryContainer,
                              fontSize: FontSize.Antz_Minor_Regular.fontSize,
                              fontWeight:
                                FontSize.Antz_Minor_Regular.fontWeight,
                            }}
                          >
                            Add Image
                          </Text>
                          <View
                            style={{
                              backgroundColor:
                                constThemeColor.secondaryContainer,
                              borderRadius: 50,
                            }}
                          >
                            <Ionicons
                              name="attach-sharp"
                              size={24}
                              color={constThemeColor.onSurfaceVariant}
                              style={{
                                padding: Spacing.mini,
                                paddingHorizontal: Spacing.mini,
                              }}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          alignSelf: "center",
                          paddingHorizontal: Spacing.small,
                          justifyContent: "space-around",
                        }}
                      >
                        {selectedItems
                          .filter(
                            (item) =>
                              item?.type == "image/jpeg" ||
                              item?.type == "image/png"
                          )
                          .map((item, index) => (
                            <View
                              style={{
                                width: widthPercentageToDP(39),
                                marginBottom: heightPercentageToDP(0.5),
                                marginRight: Spacing.body,
                              }}
                              key={index}
                            >
                              <Image
                                source={{ uri: item?.uri }}
                                style={{
                                  width: widthPercentageToDP(40),
                                  height: heightPercentageToDP(15),
                                }}
                              />

                              <View
                                style={{
                                  backgroundColor:
                                    constThemeColor.surfaceVariant,
                                  height: heightPercentageToDP(4),
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  width: widthPercentageToDP(40),
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    marginLeft: widthPercentageToDP(1),
                                    textAlign: "center",
                                  }}
                                >
                                  {item?.uri?.slice(-15)}
                                </Text>
                                <MaterialCommunityIcons
                                  name="close"
                                  size={22}
                                  color={constThemeColor.onSurfaceVariant}
                                  onPress={() => removeDocuments(item?.uri)}
                                />
                              </View>
                            </View>
                          ))}
                      </ScrollView>
                    </View>
                    {isError?.selectedItems ? (
                      <Text
                        style={{
                          color: constThemeColor.error,
                          fontSize: FontSize.Antz_errMsz,
                        }}
                      >
                        {errorMessage?.selectedItems}
                      </Text>
                    ) : null}
                  </View>
                )} */}
                {value === "batch" ? null : (
                  <>
                    {/*gallery images Hide - AF-1744 https://antzsystems.atlassian.net/browse/AF-1744*/}
                    {/* <TouchableOpacity
                      onPress={() => setDocumentModal(!documentModal)}
                      style={reduxColors.galleryImage}
                    >
                      <MaterialIcons
                        name="add-photo-alternate"
                        size={24}
                        color={constThemeColor.onPrimary}
                      />
                      <Text style={reduxColors.galleryImgText}>
                        {" "}
                        Add gallery Images
                      </Text>
                    </TouchableOpacity> */}

                    {/* <View>
                      <Text style={reduxColors.imageNotifications}>
                        Add images in JPG or PNG format only. Preferable
                        dimension of the image is 2000 width x 1250 height or
                        higher
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          flexWrap: "wrap",
                          marginVertical: 14,
                          columnGap: 6,
                          rowGap: 12,
                        }}
                      >
                        {galleryImage.map((url, index) => (
                          <View
                            style={{
                              width: "49%",
                            }}
                            key={index}
                          >
                            <Image
                              source={{ uri: url.uri }}
                              style={{
                                width: "100%",
                                height: 150,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            />
                            <View style={reduxColors.imgNameStyle}>
                              <Text style={reduxColors.imageName}>
                                {url.name.slice(-12)}
                              </Text>
                              <TouchableOpacity
                                onPress={() => removeDocuments(url?.uri)}
                              >
                                <Entypo
                                  name="cross"
                                  size={22}
                                  color={constThemeColor.onSurfaceVariant}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View> */}
                  </>
                )}
              </View>
            </List.Accordion>
          </List.Section>

          <List.Section>
            <List.Accordion
              title="Additional Information"
              id="2"
              titleStyle={{
                color: constThemeColor.onPrimaryContainer,
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                marginLeft: -8,
              }}
              style={{
                paddingLeft: 0,
                backgroundColor: constThemeColor.onPrimary,
              }}
              expanded={expand.Information}
              onPress={handlePressInformation}
              right={(props) =>
                expand.Information ? (
                  <List.Icon {...props} icon="minus" />
                ) : (
                  <List.Icon {...props} icon="plus" />
                )
              }
            >
              <View>
                <View style={reduxColors.layDateWrap}>
                  <Checkbox.Android
                    status={isMovable ? "checked" : "unchecked"}
                    onPress={onPressMovable}
                  />
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Body_Medium.fontSize,
                      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                      color: constThemeColor.onPrimaryContainer,
                    }}
                  >
                    Enclosure is Movable ?
                  </Text>
                </View>
                <View style={reduxColors.layDateWrap}>
                  <Checkbox.Android
                    status={isWalkable ? "checked" : "unchecked"}
                    onPress={onPressWalkable}
                  />
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Body_Medium.fontSize,
                      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                      color: constThemeColor.onPrimaryContainer,
                    }}
                  >
                    Enclosure is Walkable ?
                  </Text>
                </View>
                <InputBox
                  inputLabel={"Sunlight"}
                  placeholder={"Choose Sunlight"}
                  onChange={(value) => setEnclosureSunlight(value)}
                  value={enclosureSunlight}
                  defaultValue={
                    enclosureSunlight != null ? enclosureSunlight : null
                  }
                  refs={sunlightRef}
                  rightElement={isSunlight ? "menu-up" : "menu-down"}
                  DropDown={SetIsSunlightDropDown}
                  onSubmitEditing={() => handleSubmitFocus(datePickerRef)}
                  isError={isError.enclosureSunlight}
                  errors={errorMessage.enclosureSunlight}
                />
                <DatePicker
                  title="Commissioned Date"
                  refs={datePickerRef}
                  today={foundDate}
                  onChange={getdateFound}
                  onOpen={dropdownOff}
                />
                {isError.foundDate ? (
                  <Text style={{ color: constThemeColor.error }}>
                    {errorMessage.foundDate}
                  </Text>
                ) : null}
                <InputBox
                  refs={notesRef}
                  inputLabel={"Notes"}
                  onFocus={dropdownOff}
                  placeholder={"Write a note"}
                  onChange={(value) => SetEnclosureDesc(value)}
                  value={enclosureDesc}
                  multiline={Platform.OS == "ios" ? true : false}
                  errors={errorMessage.enclosureDesc}
                  isError={isError.enclosureDesc}
                />
              </View>
            </List.Accordion>
          </List.Section>
        </View>
      </CustomForm>
      {isSectionMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isSectionMenuOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={catClose}
          >
            <Category
              categoryData={sectionData}
              onCatPress={catPressed}
              heading={"Choose Section"}
              isMulti={false}
              onClose={catClose}
            />
          </Modal>
        </View>
      ) : null}

      {isEnclosureOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isEnclosureOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={parentEnclosureClose}
          >
            <Category
              categoryData={enclosureData}
              onCatPress={parentEnclosurePressed}
              heading={"Choose Parent Enclosure"}
              isMulti={false}
              onClose={parentEnclosureClose}
              noOptionAvailableMessage={"Choose Section First"}
            />
          </Modal>
        </View>
      ) : null}

      {isEncEnvMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isEncEnvMenuOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={catEnvClose}
          >
            <Category
              categoryData={encEnvData}
              onCatPress={catEnvPress}
              heading={"Choose Enclosure Environment"}
              isMulti={false}
              onClose={catEnvClose}
            />
          </Modal>
        </View>
      ) : null}

      {isEncTypeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isEncTypeMenuOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={catEnTypeClose}
          >
            <Category
              categoryData={
                enclosureEnvironment === ""
                  ? []
                  : enclosureEnvironment === "Aquatic"
                  ? aquaEnctype
                  : encTypeData
              }
              onCatPress={catEnTypePress}
              heading={"Choose Enclosure Type"}
              isMulti={false}
              onClose={catEnTypeClose}
              noOptionAvailableMessage={"Choose Enclosure Environment First"}
            />
          </Modal>
        </View>
      ) : null}

      {isInchargeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isInchargeMenuOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={inchargeCatClose}
          >
            <Category
              categoryData={inchargeData}
              onCatPress={inchargeCatPressed}
              heading={"Choose Enclosure Incharge"}
              isMulti={true}
              onClose={inchargeCatClose}
            />
          </Modal>
        </View>
      ) : null}

      {documentModal ? (
        <Modal
          avoidKeyboard
          animationType="fade"
          transparent={true}
          visible={true}
          style={[
            reduxColors.bottomSheetStyle,
            { backgroundColor: "transparent" },
          ]}
        >
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={[reduxColors.modalOverlay]}>
              <View style={reduxColors.modalContainer}>
                <TouchableOpacity
                  style={reduxColors.modalContainer}
                  onPress={handleImagePick}
                >
                  <View style={reduxColors.modalView}>
                    <View
                      style={{
                        backgroundColor: constThemeColor.secondary,
                        height: 50,
                        width: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 30,
                      }}
                    >
                      <FontAwesome
                        name="image"
                        size={22}
                        color={constThemeColor.onPrimary}
                      />
                    </View>
                    <Text style={reduxColors.docsText}>Photo</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}

      {isSunlight ? (
        <View>
          <Modal
            animationType="fade"
            visible={isSunlight}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={catIsSunlightClose}
          >
            <Category
              categoryData={sunlightData}
              onCatPress={catIsSunlightPress}
              heading={"Choose Sunlight"}
              isMulti={false}
              onClose={catIsSunlightClose}
            />
          </Modal>
        </View>
      ) : null}
      {/* <DynamicAlert
        isVisible={isVisible}
        onClose={hideAlert}
        type={alertType}
        title={alertType === "success" ? "Success" : "Error"}
        message={alertMessage}
        onOK={handleOK}
        // isCancelButton={alertType === "success" ? true : false}
        onCancel={handleCancel}
      /> */}
    </>
  );
};
const styles = (reduxColors) =>
  StyleSheet.create({
    iconStyle: {
      justifyContent: "space-between",
      marginTop: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    iconImage: {
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: reduxColors.secondary,

      width: 124,
      height: 124,
      borderRadius: 62,
    },
    iconImageText: {
      alignSelf: "center",
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.primary,
      marginTop: 10,
    },
    galleryImage: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: reduxColors.secondary,
      marginTop: 25,
      height: 50,
      borderRadius: 4,
    },
    galleryImgText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onPrimary,
      paddingLeft: Spacing.minor,
    },
    imageNotifications: {
      fontSize: FontSize.Antz_Small.fontSize,
      fontWeight: FontSize.Antz_Small.fontWeight,
      color: reduxColors.outline,
      marginTop: 10,
      paddingLeft: Spacing.mini,
    },
    imgNameStyle: {
      borderWidth: widthPercentageToDP(0.225),
      borderColor: reduxColors.outlineVariant,
      minHeight: heightPercentageToDP(4.5),
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    imageName: {
      fontSize: FontSize.Antz_Small.fontSize,
      fontWeight: FontSize.Antz_Small.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    destinationBox: {
      marginTop: heightPercentageToDP(1),
      width: "100%",
      borderRadius: 6,
      borderWidth: 1,
      alignSelf: "center",
      borderColor: reduxColors.outline,
    },
    animalCardStyle: {
      justifyContent: "center",
      width: "100%",
      alignSelf: "center",
      borderRadius: 6,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
    },
    animalTextStyle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onPrimaryContainer,
      paddingLeft: 15,
    },
    button: {
      flex: 1,
    },
    group: {
      paddingHorizontal: 30,
      justifyContent: "center",
      marginTop: 30,
    },
    layDateWrap: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
      marginLeft: -8,
    },
    attatchmentViewinner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: Spacing.minor,
      paddingRight: Spacing.small + Spacing.micro,
      paddingVertical: Spacing.small,
    },
    attatchmentView: {
      backgroundColor: reduxColors.surface,
      borderColor: reduxColors.outline,
      borderRadius: Spacing.mini,
      marginTop: Spacing.mini + Spacing.micro,
    },
    bottomSheetStyle: {
      margin: 0,
      justifyContent: "flex-end",
      backgroundColor: reduxColors.blackWithPointEight,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors?.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.surface,
      height: 150,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.major,
    },
    docsText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      marginTop: Spacing.mini,
    },
  });
export default CreateEnclosure;
