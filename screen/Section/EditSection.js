import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import InputBox from "../../components/InputBox";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  editSection,
  sectionDeleteGalleryImage,
  sectionGalleryImageUpload,
} from "../../services/CreateSectionServices";
import Loader from "../../components/Loader";
import {
  TouchableOpacity,
  View,
  Text,
  useWindowDimensions,
  Alert,
  Platform,
  Image,
  StyleSheet,
  BackHandler,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import Category from "../../components/DropDownBox";
import { getStaffList } from "../../services/staffManagement/addPersonalDetails";
import { deleteSection } from "../../services/CreateSectionServices";
import Modal from "react-native-modal";
import Colors from "../../configs/Colors";
import CustomForm from "../../components/CustomForm";
import DocumentUpload from "../../components/DocumentUpload";
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
import { getInchargesListingBySections } from "../../services/GetEnclosureBySectionIdServices";

import Spacing from "../../configs/Spacing";
import InchargeCard from "../../components/InchargeCard";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { getFileData, getTextWithoutExtraSpaces } from "../../utils/Utils";
import { removeDisplayImage } from "../../services/ZooSiteService";
import { handleFilesPick } from "../../utils/UploadFiles";

const EditSectionForm = (props) => {
  const selectedSiteName = props.route.params?.section?.site_details
    ? props.route.params?.section?.site_details
        .map((site) => site.site_name)
        .join(", ")
    : "";

  const selectedSiteId = props.route.params?.section?.site_details
    ? props.route.params?.section?.site_details
        .map((site) => site.site_id)
        .join(", ")
    : "";

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [sectionId, setSectionId] = useState(
    props.route.params?.section?.section_id ?? ""
  );
  const [sectionName, setSectionName] = useState(
    props.route.params?.section?.section_name ?? ""
  );
  const [sectionCode, setSectionCode] = useState("");
  const [longitude, setLongitude] = useState(
    props.route.params?.section?.section_longitude ?? ""
  );
  const [latitude, setLatitude] = useState(
    props.route.params?.section?.section_latitude ?? ""
  );
  const [sectionInCharge, setSectionInCharge] = useState();
  const [sectionDescription, setSectionDescription] = useState("");
  const [uploadFile, setUploadFile] = useState(
    props.route.params?.item?.uploadFile ?? []
  );
  const [loading, setLoding] = useState(false);
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const site = useSelector((state) => state.UserAuth.zoos);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const currentTheme = useSelector((state) => state.darkMode.theme);
  const [sites, setSites] = useState([]);
  const [siteName, setsiteName] = useState(
    props.route.params?.section?.site_name ?? ""
  );
  const [siteId, setsiteId] = useState(
    props.route.params?.section?.section_site_id ?? ""
  );
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [isSiteOpen, setisSiteOpen] = useState(false);
  const { height, width } = useWindowDimensions();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  const [isModalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState("");
  const [bottomTitle, setBottomTitle] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [documentModal, setDocumentModal] = useState(false);

  let icon = props.route.params?.section?.images?.filter(
    (item) => item?.display_type == "banner"
  )[0]?.file;

  const [displayIcon, setDisplayIcon] = useState(icon ?? null);
  const [galleryImage, setGalleryImage] = useState(
    props.route.params?.section?.images ?? []
  );
  // for Incharge DropDown

  const [inchargeData, setInchargeData] = useState([]);

  const approver = useSelector((state) =>
    Object.keys(state.AnimalMove.approver).length > 0
      ? state.AnimalMove.approver
      : []
  );

  useEffect(() => {
    setInchargeData(approver);
  }, [JSON.stringify(approver)]);

  const gotoApprovalScreen = () => {
    navigation.navigate("InchargeAndApproverSelect", {
      selectedInchargeIds: inchargeData?.map((i) => i?.user_id).join(","),
      inchargeDetailsData: inchargeData,
    });
  };

  useEffect(() => {
    setLoding(true);
    let obj={
      section_id: sectionId,
      page_no: "",
      search: "",
    }
    getInchargesListingBySections(obj)
      .then((res) => {
        setInchargeData(
          res.data?.incharge.map((incharge) => {
            return {
              user_id: incharge?.user_id,
              user_name:
                incharge?.user_first_name + " " + incharge?.user_last_name,
              user_profile_pic: incharge?.user_profile_pic,
            };
          })
        );
        setSectionInCharge(res.data.incharge.map((i) => i.user_id).join(","));
        setLoding(false);
      })
      .catch((err) => {
        // errorToast("error","Oops! Something went wrong!!");
        setLoding(false);
      });
  }, [sectionId]);

  // useEffect updated by **Raja** 24.07.2023 , showing preselected data on enclosure Section incharge dropdown.
  useEffect(() => {
    setSites(
      site[0].sites.map((item) => ({
        id: item.site_id,
        name: item.site_name,
        isSelect: siteId == item.site_id,
      }))
    );
  }, []);

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
      alert("Permission to access location was denied");
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLongitude(location.coords.longitude.toString());
      setLatitude(location.coords.latitude.toString());
    } catch (e) {
      // errorToast("Oops!", "Something went wrong!!");
    } finally {
      setLoding(false);
    }
  };

  const updateSection = () => {
    if (validation()) {
      let obj = {
        section_id: sectionId,
        section_name: getTextWithoutExtraSpaces(sectionName),
        section_code: sectionCode,
        section_site_id: siteId,
        section_latitude: latitude,
        section_longitude: longitude,
        // section_incharge: inchargeData?.map((i) => i?.user_id).join(","),
        section_description: sectionDescription,
        images:
          uploadFile.length > 0
            ? `data:${uploadFile[0]?.type};base64,${uploadFile[0]?.fileBase64}`
            : null,
        // "section_image[]": displayIcon,
      };
      //this is for display image update and gallery image update
      if (displayIcon?.uri) {
        obj["section_image[]"] = displayIcon;
      }

      setLoding(true);
      editSection(obj, galleryImage[0]?.uri ? galleryImage : [])
        .then((res) => {
          if (res.success) {
            dispatch(removeAnimalMovementData());
            dispatch(setApprover([]));
            successToast("Success!!", res.message);
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          } else {
            errorToast("error", res?.message);
          }
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  const sectionNameRef = useRef(null);
  const sitesRef = useRef(null);
  const loginputRef = useRef(null);
  const latitudeinputRef = useRef(null);
  const input5Ref = useRef(null);
  const handleSubmitFocus = (refs) => {};

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

  const sectionDelete = () => {
    if (props.route.params?.section?.is_system_generated == "1") {
      warningToast(
        "Restricted",
        "This section is system generated. It will be not editable or deleted!!"
      );
    } else {
      setBottomTitle("Do you want to delete this section?");
      setType("deleteSection");
      alertModalOpen();
    }
  };

  const sectionDeleteFunc = () => {
    let argument = {
      section_id: props?.route?.params?.section?.section_id,
    };
    setLoding(true);
    deleteSection(argument)
      .then((res) => {
        setLoding(false);
        if (res.success) {
          successToast("success", res.message);
          setTimeout(() => {
            navigation.pop(2);
          }, 500);
        } else {
          warningToast(
            "warning",
            "Cannot delete a section, enclosure(s) is present!"
          );
        }
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setLoding(false);
      });
  };
  const deleteApprover = (id) => {
    const filter = inchargeData?.filter((p) => p?.user_id != id);
    setInchargeData(filter);
    dispatch(setApprover(filter));
  };

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const firstButtonPress = () => {
    if (type == "deleteSection") {
      sectionDeleteFunc();
      // navigation.goBack();
      alertModalClose();
    } else if (type == "navigationBack") {
      navigation.goBack();
      alertModalClose();
    }
  };
  const secondButtonPress = () => {
    alertModalClose();
  };

  useEffect(() => {
    const backAction = () => {
      setBottomTitle("Are you sure you want to go back?");
      setType("navigationBack");
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
    setLoding(true);
    // No permissions request is necessary for launching the image library
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 1,
    // });

    // if (!result.canceled) {
    //   setDisplayIcon(getFileData(result.assets[0]));
    //   setLoding(false);
    // }
    const result = await handleFilesPick(errorToast, "image", setLoding);
    if (result&&result?.length>0) {
      setDisplayIcon(result[0]);
    }
  };

  const removeIcon = async () => {
    setLoding(true);
    removeDisplayImage({
      ref_id: sectionId,
      ref_type: "section",
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
    setLoding(true);
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
      //   // setGalleryImage([getFileData(result.assets[0])]);
      //   setDocumentModal(false);
      //   setLoding(false);
      // }
    } catch (err) {
      console.log("Error picking image:", err);
    }
  };

  const removeDocuments = (url) => {
    setLoding(true);

    const obj = {
      image_id: url?.id,
      section_id: sectionId,
    };

    sectionDeleteGalleryImage(obj)
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

  const uploadGalleryImage = (banner_image) => {
    setLoding(true);
    const reqObj = {
      section_id: sectionId,
    };
    sectionGalleryImageUpload(reqObj, banner_image)
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: constThemeColor.surfaceVariant,
      }}
    >
      <Loader visible={loading} />
      <CustomForm
        header={true}
        title={"Edit Section"}
        onPress={updateSection}
        deleteButton={sectionDelete}
        deleteTitle={"Section"}
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
          onSubmitEditing={() => handleSubmitFocus(sitesRef)}
        />
        <InputBox
          refs={sitesRef}
          inputLabel={"Sites"}
          placeholder=" "
          editable={false}
          value={siteName}
          isError={isError.siteName}
          errors={errorMessage.siteName}
          onFocus={() => {
            setisSiteOpen(true);
          }}
          rightElement={isSiteOpen ? "menu-up" : "menu-down"}
          DropDown={() => {
            setisSiteOpen(true);
          }}
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
            {galleryImage
              ?.filter((item) => item?.display_type !== "banner")
              .map((url) => (
                <View
                  style={{
                    width: "49%",
                  }}
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
                    <TouchableOpacity onPress={() => removeDocuments(url)}>
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
                marginVertical: Spacing.small,
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
            onSubmitEditing={() => handleSubmitFocus(latitudeinputRef)}
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
        {/* <DocumentUpload
          uploadable={true}
          type={"document"}
          items={uploadFile}
          onChange={(value) => {
            setUploadFile(value);
          }}
        />
        {isError.uploadFile ? (
          <Text style={styles.errortext}>{errorMessage.uploadFile}</Text>
        ) : null} */}
      </CustomForm>

      {isSiteOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isSiteOpen}
            onDismiss={catClose}
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
        title={bottomTitle}
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
      marginTop: heightPercentageToDP(1.4),
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
export default EditSectionForm;
