import React, { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { AntDesign } from "@expo/vector-icons";
import Category from "../../components/DropDownBox";
import CustomForm from "../../components/CustomForm";
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
  BackHandler,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import {
  getSection,
  getEnclosurebySection,
  DeleteEnclosure,
} from "../../services/staffManagement/getEducationType";
import {
  editEnclosure,
  enclosureDeleteGalleryImage,
  enclosureGalleryImageUpload,
} from "../../services/FormEnclosureServices";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import { Checkbox, List } from "react-native-paper";

import InputBox from "../../components/InputBox";
import { getEnclosureService } from "../../services/SettingEnclosure";
import DatePicker from "../../components/DatePicker";
import { Provider, useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import moment from "moment";
import { capitalize, getFileData, getTextWithoutExtraSpaces } from "../../utils/Utils";
import FontSize from "../../configs/FontSize";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import RequestBy from "../../components/Move_animal/RequestBy";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  removeAnimalMovementData,
  setApprover,
} from "../../redux/AnimalMovementSlice";
import {
  getBasicInfoData,
  getInchargesListingByEnclosure,
} from "../../services/GetEnclosureBySectionIdServices";
import InchargeCard from "../../components/InchargeCard";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import Spacing from "../../configs/Spacing";
import { removeDisplayImage } from "../../services/ZooSiteService";
import { setEncDelete } from "../../redux/TabRefreshSlice";
import { handleFilesPick } from "../../utils/UploadFiles";

const EnclosureEdit = (props) => {
  const { height, width } = useWindowDimensions();
  const navigation = useNavigation();
  const [value, setValue] = useState("single");
  const dispatch = useDispatch();
  const [enclosureCode, setEnclosureCode] = useState("");
  const [enclosure_id, SetEnclosure_id] = useState(
    props.route.params?.enclosure_id ?? ""
  );
  const { successToast, errorToast, alertToast, warningToast, showToast } =
    useToast();
  const [enclosureName, setEnclosureName] = useState("");

  const [userEnclosureId, setUserEnclosureId] = useState("");

  const [encEnvData, setencEnvData] = useState([]);

  const [enclosureEnvironment, setEnclosureEnvironment] = useState();

  const [enclosureType, setEnclosureType] = useState();
  const [enclosureTypeId, setEnclosureTypeId] = useState();
  const [section, setSection] = useState();

  const [sectionId, setSectionId] = useState();

  const [isInchargeMenuOpen, setIsInchargeMenuOpen] = useState(false);

  const [inchargeId, setInchargeId] = useState([]);
  const [inchargeData, setInchargeData] = useState([]);

  const [enclosure, setParentEnclosure] = useState("");

  const [enclosureParentId, setParentEnclosureId] = useState();

  const [isMovable, setIsMovable] = useState();
  const [isWalkable, setIsWalkable] = useState();

  const [enclosureSunlight, setEnclosureSunlight] = useState();

  const [isSunlight, setIsSunlight] = useState(false);

  const [sunlightData, setSunlightData] = useState([]);

  const [foundDate, setFoundDate] = useState(new Date());

  const [enclosureDesc, SetEnclosureDesc] = useState();

  const [enclosure_lat, Setenclosure_lat] = useState();

  const [enclosure_long, Setenclosure_long] = useState();

  const [enclosure_status, Setenclosure_status] = useState("");

  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [sectionData, setSectionData] = useState([]);

  const [isEnclosureOpen, setIsEnclosureOpen] = useState(false);
  const [enclosureData, setEnclosureData] = useState([]);

  const [isEncEnvMenuOpen, setisEncEnvMenuOpen] = useState(false);

  const [aquaEnctype, setAquaEnctype] = useState([]);

  const [isEncTypeMenuOpen, setisEncTypeMenuOpen] = useState(false);

  const [encTypeData, setencTypeData] = useState([]);

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoding] = useState(false);

  const user_id = useSelector((state) => state.UserAuth.userDetails.user_id);

  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  const [longitude, setLongitude] = useState("");

  const [latitude, setLatitude] = useState("");
  const approver = useSelector((state) =>
    Object.keys(state.AnimalMove.approver).length > 0
      ? state.AnimalMove.approver
      : []
  );

  const [documentModal, setDocumentModal] = useState(false);

  let icon = props.route.params?.enclosure?.images?.filter(
    (item) => item?.display_type == "banner"
  )[0]?.file;

  const [displayIcon, setDisplayIcon] = useState(icon ?? null);
  const [galleryImage, setGalleryImage] = useState(
    props.route.params?.enclosure?.images ?? []
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const firstButtonPress = () => {
    DeleteEnclosureDataFunc();
    alertModalClose();
  };
  const secondButtonPress = () => {
    alertModalClose();
  };

  useEffect(() => {
    setInchargeData(approver);
  }, [JSON.stringify(approver)]);

  const deleteApprover = (id) => {
    const filter = inchargeData?.filter((p) => p?.user_id != id);
    setInchargeData(filter);
    dispatch(setApprover(filter));
  };
  const gotoApprovalScreen = () => {
    navigation.navigate("InchargeAndApproverSelect", {
      selectedInchargeIds: inchargeData?.map((i) => i.user_id).join(","),
      inchargeDetailsData: inchargeData,
    });
  };
  // update: by md kalam ansari , add the minus plus icon insted of arrow dropdown icons
  const [expanded, setExpanded] = React.useState({
    Basic: false,
    Additional: false,
    Facilities: false,
  });

  const encNameRef = useRef(null);
  const envTypeRef = useRef(null);
  const encTypeRef = useRef(null);
  const secRef = useRef(null);
  const parentEncRef = useRef(null);
  const sunlightRef = useRef(null);
  const datePickerRef = useRef(null);
  const notesRef = useRef(null);

  const getLocation = async (check) => {
    if (check) {
      setLoding(true);
    }
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLoding(false);
      showToast("warning", "Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    if (check) {
      setLongitude(location.coords.longitude.toString());
      setLatitude(location.coords.latitude.toString());
    }
    setLoding(false);
  };

  const catPressed = (item) => {
    setSection(item.map((u) => u.name).join(", "));
    setSectionId(item.map((id) => id.id).join(","));
    setIsSectionMenuOpen(false);
  };

  const catClose = () => {
    setIsSectionMenuOpen(false);
  };

  const inchargeCatClose = () => {
    setIsInchargeMenuOpen(false);
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

    setisEncEnvMenuOpen(false);
  };

  const catEnvClose = () => {
    setisEncEnvMenuOpen(false);
  };

  const catEnTypePress = (item) => {
    setEnclosureType(item[0].name);
    setEnclosureTypeId(item[0].id);
    setisEncTypeMenuOpen(false);
  };

  const catEnTypeClose = () => {
    setisEncTypeMenuOpen(false);
  };

  const catIsSunlightPress = (item) => {
    item.map((u) => u.name).join(",");
    setEnclosureSunlight(item.map((u) => u.name).join(","));
    setIsSunlight(false);
  };

  const catIsSunlightClose = () => {
    setIsSunlight(false);
  };

  useEffect(() => {
    if (sectionId) {
      getEnclosurebySection(sectionId).then((res) => {
        let enc = res?.data?.map((item) => {
          return {
            id: item.enclosure_id,
            name: item.user_enclosure_name,
            isSelect: item.enclosure_id == enclosureParentId ? true : false,
          };
        });
        setEnclosureData(enc);
        if (enclosureParentId > 0) {
          let parent_enclosure = enc.filter(
            (item) => item.id == enclosureParentId
          );
          setParentEnclosure(parent_enclosure[0].name);
        }
      });
    }
  }, [sectionId]);
  // Fetch all data
  // useEffect updated by Raja 24.07.2023 , showing preselected data on enclosure incharge dropdown.
  useEffect(() => {
    setLoding(true);
    var requestObj = {
      zoo_id: zooID,
    };
    Promise.all([
      getInchargesListingByEnclosure({ enclosure_id }),
      getSection(requestObj),
      getEnclosureService(),
      getBasicInfoData(enclosure_id),
    ])
      .then((res) => {
        setInchargeData(
          res[0].data?.incharge?.map((incharge) => {
            return {
              user_id: incharge.user_id,
              user_name:
                incharge.user_first_name + " " + incharge.user_last_name,
              user_profile_pic: incharge?.user_profile_pic,
            };
          })
        );
        setInchargeId(res[0].data?.incharge?.map((i) => i.user_id).join(","));
        let section = res[1].data?.map((item) => {
          return {
            id: item.section_id,
            name: item.section_name,
            isSelect: item.section_id == res[3].data?.section_id ? true : false,
          };
        });
        setSectionData(section);

        let environments = res[2].data?.environment_type.map((item) => {
          return {
            id: item.string_id,
            name: item.name,
            isSelect:
              item.name == res[3].data?.enclosure_environment ? true : false,
          };
        });
        setencEnvData(environments);

        let aquatic_enclosure_type = res[2].data?.aquatic_enclosure_type.map(
          (item) => {
            return {
              id: item.id,
              name: item.name,
              isSelect:
                item.id == res[3].data?.enclosure_type_id ? true : false,
            };
          }
        );
        setAquaEnctype(aquatic_enclosure_type);

        let enclosure_type = res[2].data?.enclosure_type.map((item) => {
          return {
            id: item.id,
            name: item.name,
            isSelect: item.id == res[3].data?.enclosure_type_id ? true : false,
          };
        });
        setencTypeData(enclosure_type);
        setEnclosureCode(res[3].data?.enclosure_code);
        SetEnclosure_id(res[3].data?.enclosure_id);
        setEnclosureName(res[3].data?.user_enclosure_name);
        setUserEnclosureId(res[3].data?.user_enclosure_id);
        setEnclosureEnvironment(res[3].data?.enclosure_environment);
        setEnclosureType(res[3].data?.enclosure_type);
        setEnclosureTypeId(res[3].data?.enclosure_type_id);
        setParentEnclosure(res[3].data?.parent_enclosure_name);
        setSection(res[3].data?.section_name);
        setSectionId(res[3].data?.section_id);
        setParentEnclosureId(res[3].data?.enclosure_parent_id);
        setIsMovable(res[3].data?.enclosure_is_movable == "1" ? true : false);
        setIsWalkable(res[3].data?.enclosure_is_walkable == "1" ? true : false);
        setEnclosureSunlight(res[3].data?.enclosure_sunlight);
        setSunlightData([
          {
            id: "0",
            name: "Moderate",
            isSelect:
              "Moderate" == capitalize(res[3].data?.enclosure_sunlight)
                ? true
                : false,
          },
          {
            id: "1",
            name: "Good",
            isSelect:
              "Good" == capitalize(res[3].data?.enclosure_sunlight)
                ? true
                : false,
          },
          {
            id: "2",
            name: "Bad",
            isSelect:
              "Bad" == capitalize(res[3].data?.enclosure_sunlight)
                ? true
                : false,
          },
        ]);
        setFoundDate(res[3].data?.commistioned_date);
        SetEnclosureDesc(res[3].data?.enclosure_desc);
        Setenclosure_status(res[3].data?.enclosure_status);
        setLongitude(res[3].data?.enclosure_long);
        setLatitude(res[3].data?.enclosure_lat);
      })
      .catch((err) => {
        console.log({ err });
        showToast("error", "Oops! Something went wrong!!");
      })
      .finally(() => {
        setLoding(false);
      });
  }, []);

  const DeleteEnclosureData = () => {
    // Alert.alert("Delete Enclosure", "Do you want to delete this enclosure?", [
    //   {
    //     text: "Cancel",
    //     style: "cancel",
    //   },
    //   { text: "Yes", onPress: DeleteEnclosureDataFunc },
    // ]);
    if (props.route.params?.enclosure?.is_system_generated == "1") {
      warningToast(
        "Restricted",
        "This enclosure is system generated. It will be not editable or deleted!!"
      );
    } else {
      alertModalOpen();
    }
  };

  // Delete Enclosure Function
  const DeleteEnclosureDataFunc = (id) => {
    let obje = {
      enclosure_id: enclosure_id,
    };
    setLoding(true);
    DeleteEnclosure(obje)
      .then((res) => {
        setLoding(false);

        if (res.success) {
          showToast("success", res.message);
          setTimeout(() => {
            dispatch(setEncDelete(true));
            navigation.pop(2);
          }, 500);
        } else {
          warningToast(
            "warning",
            "Cannot delete an enclosure, animal(s) is present!"
          );
        }
      })
      .catch((err) => {
        setLoding(false);
        // errorToast("Oops!", "Something went wrong!!");
        showToast("error", "Oops! Something went wrong!!");
      });
  };

  const validation = () => {
    if (enclosureName.trim().length === 0) {
      setIsError({ enclosureName: true });
      setErrorMessage({ enclosureName: "Enter The Name" });
      return false;
    } else if (enclosureEnvironment.trim().length === 0) {
      setIsError({ enclosureEnvironment: true });
      setErrorMessage({
        enclosureEnvironment: "Enter The Enclosure Environment",
      });
      return false;
    } else if (enclosureType.trim().length === 0) {
      setIsError({ enclosureType: true });
      setErrorMessage({ enclosureType: "Enter The Enclosure Type" });
      return false;
    } else if (section.length === 0) {
      setIsError({ section: true });
      setErrorMessage({ section: "Select Section Id" });
      return false;
    }
    return true;
  };
  const checkNumber = (number, type) => {
    setIsError({});
    const pattern = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
    const numberPattern = /^\d+$/;
    let result =
      type == "number"
        ? numberPattern.test(number)
        : number.length > 4
        ? pattern.test(number)
        : true;
    if (!result) {
      let err = {};
      err[type] = true;
      let errmsg = {};
      errmsg[type] = "Input format doesn't match";
      setIsError(err);
      setErrorMessage(errmsg);
      return result;
    }
    return result;
  };
  const getEnclosureEdit = () => {
    if (validation()) {
      let obj = {
        enclosure_id: enclosure_id,
        user_enclosure_name: getTextWithoutExtraSpaces(enclosureName),
        section_id: sectionId,
        enclosure_desc: enclosureDesc,
        enclosure_environment: enclosureEnvironment,
        // enclosure_incharge_id: inchargeData?.map((i) => i.user_id).join(","),
        user_enclosure_id: userEnclosureId,
        enclosure_is_movable: Number(isMovable),
        enclosure_is_walkable: Number(isWalkable),
        enclosure_type: enclosureTypeId,
        enclosure_sunlight: enclosureSunlight,
        enclosure_parent_id: enclosureParentId,
        enclosure_lat: latitude,
        enclosure_long: longitude,
        commistioned_date: moment(foundDate).format("YYYY-MM-DD"),
        enclosure_status: "active",
        enclosure_code: enclosureCode,
        // "enclosure_image[]": displayIcon,
      };

      //this is for display image update and gallery image update
      if (displayIcon?.uri) {
        obj["enclosure_image[]"] = displayIcon;
      }
      setLoding(true);
      editEnclosure(obj, galleryImage[0]?.uri ? galleryImage : [])
        .then((res) => {
          if (res.success) {
            dispatch(removeAnimalMovementData());
            dispatch(setApprover([]));
            showToast("success", res.message);
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          } else {
            showToast("error", res?.message);
          }
        })
        .catch((err) => {
          showToast("error", "Oops!! Something went wrong!!");
        })
        .finally(() => {
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
    setIsInchargeMenuOpen(false);
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
  const SetParentEncDropDown = (data) => {
    setIsSectionMenuOpen(false);
    setisEncEnvMenuOpen(false);
    setisEncTypeMenuOpen(false);
    setIsEnclosureOpen(!isEnclosureOpen);

    setIsSunlight(false);
    setIsInchargeMenuOpen(false);
  };

  const SetEnvTypeDropDown = (data) => {
    setisEncEnvMenuOpen(!isEncEnvMenuOpen);
    setIsSectionMenuOpen(false);
    setisEncTypeMenuOpen(false);

    setIsSunlight(false);
    setIsEnclosureOpen(false);
    setIsInchargeMenuOpen(false);
  };

  const SetEncTypeDropDown = (data) => {
    setisEncTypeMenuOpen(!isEncTypeMenuOpen);
    setisEncEnvMenuOpen(false);
    setIsSectionMenuOpen(false);

    setIsSunlight(false);
    setIsEnclosureOpen(false);
    setIsInchargeMenuOpen(false);
  };

  const SetIsSunlightDropDown = () => {
    setIsSunlight(!isSunlight);

    setIsSectionMenuOpen(false);
    setisEncEnvMenuOpen(false);
    setisEncTypeMenuOpen(false);
    setIsEnclosureOpen(false);
    setIsInchargeMenuOpen(false);
  };

  const dropdownOff = () => {
    setIsSunlight(false);

    setIsSectionMenuOpen(false);
    setisEncEnvMenuOpen(false);
    setisEncTypeMenuOpen(false);
    setIsEnclosureOpen(false);
    setIsInchargeMenuOpen(false);
  };

  const getdateFound = (date) => {
    setFoundDate(date);
    handleSubmitFocus(notesRef);
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

  const handleSubmitFocus = (refs) => {};

  const onPressMovable = () => {
    setIsMovable(!isMovable);
  };
  const onPressWalkable = () => {
    setIsWalkable(!isWalkable);
  };

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

  const removeIcon = async () => {
    setLoding(true);
    removeDisplayImage({
      ref_id: enclosure_id,
      ref_type: "enclosure",
    })
      .then((res) => {
        successToast("success", res?.message);
        setDisplayIcon(null);
      })
      .catch((err) => {
        errorToast("Oops!", "Something went wrong!!");
        setLoding(false);
      })
      .finally(() => {
        setLoding(false);
      });
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
        uploadGalleryImage(selectedImages);
      } else {
        setLoding(false);
        setDocumentModal(false);
      }

      // if (
      //   result &&
      //   !result.canceled &&
      //   result.assets &&
      //   result.assets.length > 0
      // ) {
      //   const imageData = {
      //     uri: result.uri,
      //     type: result.type,
      //     name: result.uri.split("/").pop(),
      //   };
      //   uploadGalleryImage([getFileData(imageData)]);
      //   // setGalleryImage([getFileData(imageData)]);

      //   setDocumentModal(false);
      // }
    } catch (err) {
      console.log("Error picking image:", err);
    }
  };

  const uploadGalleryImage = (banner_image) => {
    setLoding(true);
    const reqObj = {
      enclosure_id: enclosure_id,
    };
    enclosureGalleryImageUpload(reqObj, banner_image)
      .then((res) => {
        successToast("success", res?.message);
        setGalleryImage(res?.data);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setLoding(false);
      })
      .finally(() => setLoding(false));
  };

  const removeDocuments = (url) => {
    setLoding(true);

    const obj = {
      image_id: url?.id,
      enclosure_id: enclosure_id,
    };

    enclosureDeleteGalleryImage(obj)
      .then((res) => {
        successToast("success", res?.message);
        setGalleryImage(res?.data);
      })
      .catch((err) => {
        console.log("error", err);
        setLoding(false);
      })
      .finally(() => {
        setLoding(false);
      });
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

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  return (
    <>
      <Loader visible={loading} />
      <CustomForm
        header={true}
        title={"Edit Enclosure "}
        marginBottom={60}
        onPress={getEnclosureEdit}
        deleteButton={DeleteEnclosureData}
        deleteTitle={"Enclosure"}
      >
        {/* display Icon */}

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
                  // source={{ uri: displayIcon.uri }}
                  source={{
                    uri: displayIcon.uri ? displayIcon.uri : displayIcon,
                  }}
                  style={reduxColors.iconImage}
                />
              )}
            </TouchableOpacity>
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
                  removeIcon();
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

        <View>
          <List.Section expandedId="1">
            <List.Accordion
              title="Basic Information"
              id="1"
              titleStyle={{
                color: constThemeColor.onSecondaryContainer,
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
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
              expanded={!expanded.Basic}
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
                  placeholder={"Choose environment"}
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
                  placeholder={"Choose enclosure type"}
                  refs={encTypeRef}
                  value={enclosureType}
                  defaultValue={enclosureType != null ? enclosureType : null}
                  rightElement={isEncTypeMenuOpen ? "menu-up" : "menu-down"}
                  onFocus={SetEncTypeDropDown}
                  DropDown={SetEncTypeDropDown}
                  errors={errorMessage.enclosureType}
                  isError={isError.enclosureType}
                />
                <View pointerEvents={section ? "none" : "auto"}>
                  <InputBox
                    inputLabel={"Choose Section*"}
                    placeholder={"Choose Section Name"}
                    refs={secRef}
                    value={section}
                    defaultValue={section != null ? section : null}
                    onFocus={SetEncDropDown}
                    DropDown={SetEncDropDown}
                    rightElement={
                      <>
                        {section
                          ? null
                          : isSectionMenuOpen
                          ? "menu-up"
                          : "menu-down"}
                      </>
                    }
                    errors={errorMessage.section}
                    isError={isError.section}
                    helpText={"Section where the enclosure is located"}
                  />
                </View>
                {enclosure || enclosureParentId ? (
                  <InputBox
                    inputLabel={"Parent Enclosure"}
                    placeholder={"Choose Parent Enclosure"}
                    refs={parentEncRef}
                    value={enclosure}
                    defaultValue={enclosure != null ? enclosure : null}
                    onFocus={SetParentEncDropDown}
                    DropDown={SetParentEncDropDown}
                    rightElement={isEnclosureOpen ? "menu-up" : "menu-down"}
                    errors={errorMessage.enclosure}
                    isError={isError.enclosure}
                    helpText={"Assign your enclosure as child under this"}
                  />
                ) : null}

                {/* ..........................Incharge Enclosure................................ */}

                {/* <View style={{ marginVertical: 8 }}>
                  <InchargeCard
                    navigation={gotoApprovalScreen}
                    title={"Incharge"}
                    selectedUserData={inchargeData}
                    removeAsign={(item) => deleteApprover(item?.user_id)}
                    outerStyle={{
                      borderWidth: inchargeData?.length > 0 ? 2 : 1,
                      borderRadius: 5,
                      backgroundColor: constThemeColor.surface,
                      borderColor: constThemeColor.outline,
                    }}
                  />
                </View> */}
              </View>

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
                  Add images in JPG or PNG format only. Preferable dimension of
                  the image is 2000 width x 1250 height or higher
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
                  {galleryImage
                    ?.filter((item) => item?.display_type !== "banner")
                    .map((url, index) => (
                      <View
                        style={{
                          width: "49%",
                        }}
                        key={index}
                      >
                        <Image
                          source={{ uri: url?.uri ? url?.uri : url?.file }}
                          style={{
                            width: "100%",
                            height: 150,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        />
                        <View style={reduxColors.imgNameStyle}>
                          <Text style={reduxColors.imageName}>
                            {url?.name
                              ? url?.name?.slice(-12)
                              : url?.file_original_name?.slice(-12)}
                          </Text>
                          <TouchableOpacity
                            onPress={() => removeDocuments(url)}
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

              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: 5,
                  padding: 3,
                }}
              >
                <View style={{ flex: 7 }}>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Minor_Title.fontSize,
                      color: constThemeColor.neutralPrimary,
                    }}
                  >
                    Location of the Enclosure
                  </Text>
                </View>
                <View style={{ justifyContent: "flex-end" }}>
                  <TouchableOpacity onPress={() => getLocation(true)}>
                    <MaterialIcons
                      name="my-location"
                      size={23}
                      color={constThemeColor.neutralPrimary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ marginHorizontal: 13 }}>
                <InputBox
                  inputLabel={"Longitude"}
                  placeholder={"Longitude"}
                  keyboardType={"numeric"}
                  onFocus={dropdownOff}
                  errors={errorMessage.longitude}
                  isError={isError.longitude}
                  value={longitude}
                  onChange={(value) => {
                    checkNumber(value, "longitude")
                      ? setLongitude(value)
                      : setLongitude("");
                  }}
                />

                <InputBox
                  inputLabel={"Latitude"}
                  placeholder={"Latitude"}
                  keyboardType={"numeric"}
                  onFocus={dropdownOff}
                  errors={errorMessage.latitude}
                  isError={isError.latitude}
                  value={latitude}
                  onChange={(value) => {
                    checkNumber(value, "latitude")
                      ? setLatitude(value)
                      : setLatitude("");
                  }}
                />
              </View>
            </List.Accordion>
          </List.Section>
          <List.Section>
            <List.Accordion
              title="Additional Information"
              id="2"
              titleStyle={{
                color: constThemeColor.onSecondaryContainer,
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              }}
              style={{
                backgroundColor: constThemeColor.onPrimary,
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
                <View style={reduxColors.layDateWrap}>
                  <Checkbox.Android
                    status={isMovable ? "checked" : "unchecked"}
                    onPress={onPressMovable}
                  />
                  <Text style={reduxColors.label}>Enclosure is Movable ?</Text>
                </View>
                <View style={reduxColors.layDateWrap}>
                  <Checkbox.Android
                    status={isWalkable ? "checked" : "unchecked"}
                    onPress={onPressWalkable}
                  />
                  <Text style={reduxColors.label}>Enclosure is Walkable ?</Text>
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
                  <Text style={reduxColors.errortext}>
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
                  multiline={true}
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
              onClose={inchargeCatClose}
              heading={"Choose Enclosure Incharge"}
              isMulti={true}
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
              heading={"Choose Environment"}
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
              heading={"Choose enclosure type"}
              isMulti={false}
              onClose={catEnTypeClose}
              noOptionAvailableMessage={"Choose Enclosure Environment First"}
            />
          </Modal>
        </View>
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

      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Do you want to delete this enclosure?"}
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
    errortext: {
      color: reduxColors.error,
    },
    layDateWrap: {
      flexDirection: "row",
      alignItems: "center",
      padding: 4,
    },
    label: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.blackWithPointEight,
    },
    destinationBox: {
      marginTop: heightPercentageToDP(1.3),
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
export default EnclosureEdit;
