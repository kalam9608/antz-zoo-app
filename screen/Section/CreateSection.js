//create by:Gaurav Shukla
// create on :1/03/2023

import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import InputBox from "../../components/InputBox";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { CreateSection } from "../../services/CreateSectionServices";
import Loader from "../../components/Loader";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  useWindowDimensions,
  Linking,
  BackHandler,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Category from "../../components/DropDownBox";
import Modal from "react-native-modal";
import CustomForm from "../../components/CustomForm";
import DynamicAlert from "../../components/DynamicAlert";
import FontSize from "../../configs/FontSize";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { errorDailog, successDailog } from "../../utils/Alert";
import Spacing from "../../configs/Spacing";
import { Alert, StyleSheet, Image } from "react-native";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import * as ImagePicker from "expo-image-picker";
import { getFileData, getTextWithoutExtraSpaces } from "../../utils/Utils";
import InchargeCard from "../../components/InchargeCard";
import { setApprover } from "../../redux/AnimalMovementSlice";
import { handleFilesPick } from "../../utils/UploadFiles";

export default function CreateSectionForm(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [sectionName, setSectionName] = useState("");
  const [sectionCode, setSectionCode] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [loading, setLoding] = useState(false);
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const site = useSelector((state) => state.UserAuth.zoos);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const [sites, setSites] = useState([]);
  const [siteName, setsiteName] = useState(
    props.route.params?.item?.site_name ?? ""
  );
  const [siteId, setsiteId] = useState(
    props.route.params?.item?.section_site_id
      ? props.route.params?.item?.section_site_id
      : props.route.params?.item?.site_id
      ? props.route.params?.item?.site_id
      : ""
  );
  const [inchargeData, setInchargeData] = useState([]);

  const [isSiteOpen, setisSiteOpen] = useState(false);
  const { height, width } = useWindowDimensions();
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [documentModal, setDocumentModal] = useState(false);

  const [displayIcon, setDisplayIcon] = useState(null);
  const [galleryImage, setGalleryImage] = useState([]);

  useEffect(() => {
    let data = site[0].sites.map((item) => ({
      id: item.site_id,
      name: item.site_name,
      isSelect:
        item?.site_id == props.route.params?.item?.section_site_id ||
        item?.site_id == props.route.params?.item?.site_id
          ? true
          : false,
    }));
    setSites(data);
  }, []);

  //this is for incharge select
  const approver = useSelector((state) =>
    Object.keys(state?.AnimalMove?.approver)?.length > 0
      ? state?.AnimalMove?.approver
      : []
  );

  useEffect(() => {
    setInchargeData(approver);
  }, [JSON.stringify(approver)]);

  const gotoApprovalScreen = () => {
    navigation.navigate("InchargeAndApproverSelect", {
      selectedInchargeIds: inchargeData?.map((i) => i?.user_id)?.join(","),
      inchargeDetailsData: inchargeData,
    });
  };

  const deleteApprover = (id) => {
    const filter = inchargeData?.filter((p) => p?.user_id != id);
    setInchargeData(filter);
    dispatch(setApprover(filter));
  };

  const validation = () => {
    if (sectionName.trim().length === 0) {
      setIsError({ sectionName: true });
      setErrorMessage({ sectionName: "Enter The Name" });
      return false;
    } else if (!siteId) {
      setIsError({ siteId: true });
      setErrorMessage({ siteId: "Select site" });
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (sectionName != "") {
      setIsError(false);
      setErrorMessage(false);
    }
    if (siteId != "") {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [sectionName, siteId]);

  const catPressed = (item) => {
    setsiteName(item.map((u) => u.name).join(", "));
    setsiteId(item[0].id);
    setisSiteOpen(!isSiteOpen);
  };

  const catClose = () => {
    setisSiteOpen(false);
  };

  const getLocation = async () => {
    setLoding(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLoding(false);
      Alert.alert(
        "Confirmation",
        "Access denied, would you like to grant permission?",
        [
          { text: "No", style: "cancel", onPress: () => {} },
          { text: "Yes", onPress: () => Linking.openSettings() },
        ],
        { cancelable: false }
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLongitude(location.coords.longitude.toString());
    setLatitude(location.coords.latitude.toString());
    setLoding(false);
  };

  const getSectionData = () => {
    setIsError({});
    setErrorMessage({});
    if (validation()) {
      let obj = {
        section_name: getTextWithoutExtraSpaces(sectionName),
        section_code: sectionCode,
        zoo_id: zooID,
        section_latitude: latitude,
        section_longitude: longitude,
        // section_incharge: inchargeData?.map((i) => i?.user_id)?.join(","),
        site_id: siteId,
        "section_image[]": displayIcon,
      };
      setLoding(true);
      CreateSection(obj, galleryImage)
        .then((res) => {
          if (res.success) {
            successToast("Success", res?.message);
            navigation.replace("HousingEnclosuer", {
              section_id: res?.data?.section_id,
            });
          } else {
            errorToast("error", res?.message);
          }
        })
        .catch((err) => {
          errorToast("error", "Something went wrong!!");
        })
        .finally(() => {
          showAlert();

          setLoding(false);
        });
    }
  };

  const sectionNameRef = useRef(null);
  const sitesRef = useRef(null);
  const loginputRef = useRef(null);
  const latitudeinputRef = useRef(null);
  const input5Ref = useRef(null);
  const dropdownOff = () => {
    setisSiteOpen(false);
  };

  const checkNumber = (number, type) => {
    setIsError({});
    const pattern = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
    let result = number.length > 4 ? pattern.test(number) : true;
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

  const showAlert = () => {
    setIsVisible(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };

  const handleOK = () => {
    setIsVisible(false);
    if (alertType === "success") {
      navigation.goBack();
    }
  };
  const handleCancel = () => {
    setIsVisible(false);
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const firstButtonPress = () => {
    navigation.goBack();
    alertModalClose();
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
      //   // setGalleryImage([getFileData(result.assets[0])]);
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
        item?.type == "image/jpg" ||
        item?.type == "image/png"
      ) {
        return item?.uri != docsName;
      } else {
        return item?.name != docsName;
      }
    });
    setGalleryImage(filterData);
  };

  return (
    <View style={{ flex: 1, backgroundColor: constThemeColor.surfaceVariant }}>
      <Loader visible={loading} />
      <CustomForm 
        header={true} 
        title={"Add Section"} 
        onPress={getSectionData}
      >
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

        <View style={{ flex: 7, marginTop: 20, marginBottom: Spacing.small }}>
          <Text
            style={{
              color: constThemeColor.onPrimaryContainer,
              fontSize: FontSize.Antz_Minor_Medium.fontSize,
              fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
            }}
          >
            Basic Information
          </Text>
        </View>

        <InputBox
          refs={sectionNameRef}
          inputLabel={"Name"}
          placeholder={"Enter Name"}
          errors={errorMessage.sectionName}
          isError={isError.sectionName}
          onFocus={dropdownOff}
          onChange={(value) => setSectionName(value)}
          value={sectionName}
        />
        <InputBox
          refs={sitesRef}
          inputLabel={"Sites"}
          placeholder=" "
          editable={false}
          value={props.route.params?.selcted_site?.site_name ?? siteName}
          isError={isError.siteId}
          errors={errorMessage.siteId}
          onFocus={() => {
            setisSiteOpen(true);
          }}
          rightElement={isSiteOpen ? "menu-up" : "menu-down"}
          DropDown={() => {
            setisSiteOpen(true);
          }}
          // onFocus={()=>setisSiteOpen(!isSiteOpen)}
        />

        {/* <View style={{ marginVertical: 8 }}>
          <InchargeCard
            navigation={gotoApprovalScreen}
            title={"Choose Section Incharge"}
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
          <Text style={reduxColors.galleryImgText}> Add gallery Images</Text>
        </TouchableOpacity> */}

        {/* <View>
          <Text style={reduxColors.imageNotifications}>
            Add images in JPG or PNG format only. Preferable dimension of the
            image is 2000 width x 1250 height or higher
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
                  <TouchableOpacity onPress={() => removeDocuments(url?.uri)}>
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

        {/* <View style={{ marginVertical: Spacing.small }}>
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
            <TouchableOpacity onPress={() => setDocumentModal(!documentModal)}>
              <View style={reduxColors.attatchmentViewinner}>
                <Text
                  style={{
                    color: constThemeColor.onSecondaryContainer,
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                  }}
                >
                  Add Image
                </Text>
                <View
                  style={{
                    backgroundColor: constThemeColor.secondaryContainer,
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
                .filter((item) => item?.type?.split("/")[0] == "image")
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
                        backgroundColor: constThemeColor.surfaceVariant,
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
        </View> */}

        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginVertical: Spacing.small,
            padding: 3,
          }}
        >
          <View style={{ flex: 7, marginBottom: Spacing.small }}>
            <Text
              style={{
                color: constThemeColor.onPrimaryContainer,
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
              }}
            >
              Location of the Section
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: constThemeColor.background,
            paddingHorizontal: Spacing.minor,
            paddingVertical: Spacing.small,
            borderRadius: 8,
          }}
        >
          <TouchableOpacity onPress={() => getLocation(true)}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: constThemeColor.secondaryContainer,
                marginVertical: 7,
                borderRadius: 4,
                padding: Spacing.minor,
              }}
            >
              <Text
                style={{
                  color: constThemeColor.onSecondaryContainer,
                  fontSize: FontSize.Antz_Minor_Medium.fontSize,
                  fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                }}
              >
                Set Current Location
              </Text>
              <MaterialIcons
                name="my-location"
                size={23}
                color={constThemeColor.onSecondaryContainer}
              />
            </View>
          </TouchableOpacity>

          <InputBox
            refs={loginputRef}
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
            refs={latitudeinputRef}
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
      </CustomForm>
      {isSiteOpen ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isSiteOpen}
            onDismiss={catClose}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={catClose}
          >
            <Category
              categoryData={sites}
              onCatPress={catPressed}
              heading={"Choose Sites"}
              isMulti={false}
              onClose={catClose}
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
    </View>
  );
}

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
    attatchmentViewinner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.small + Spacing.micro,
      paddingVertical: Spacing.small,
    },
    attatchmentView: {
      backgroundColor: reduxColors.surface,
      borderColor: reduxColors.outline,
      borderRadius: Spacing.mini,
      marginTop: Spacing.mini,
      paddingLeft: Spacing.mini + Spacing.micro,
      paddingRight: Spacing.mini,
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
