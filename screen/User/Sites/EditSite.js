import React, { useEffect, useState, useRef } from "react";

import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  StyleSheet,
  BackHandler,
  Linking,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import * as Location from "expo-location";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";

/*
 * Responsive Import
 */
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import CustomForm from "../../../components/CustomForm";
import Loader from "../../../components/Loader";
import InputBox from "../../../components/InputBox";
import InchargeCard from "../../../components/InchargeCard";
import { useToast } from "../../../configs/ToastConfig";
import FontSize from "../../../configs/FontSize";
import Spacing from "../../../configs/Spacing";
import BottomSheetModalStyles from "../../../configs/BottomSheetModalStyles";
import DialougeModal from "../../../components/DialougeModal";
import Config from "../../../configs/Config";
import { setApprover } from "../../../redux/AnimalMovementSlice";
import { getFileData, getTextWithoutExtraSpaces } from "../../../utils/Utils";
import {
  deleteGalleryImage,
  deleteZooSite,
  editZooSite,
  galleryImageUpload,
  removeDisplayImage,
} from "../../../services/ZooSiteService";
import { getRefreshToken } from "../../../services/AuthService";
import { clearAsyncData, saveAsyncData } from "../../../utils/AsyncStorageHelper";
import { setPassCode, setSignIn, setSignOut } from "../../../redux/AuthSlice";
import { setSites } from "../../../redux/SiteSlice";
import { handleFilesPick } from "../../../utils/UploadFiles";

const EditSite = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [siteName, setSiteName] = useState(
    props.route.params?.site?.site_name ?? ""
  );
  const [description, setDescription] = useState(
    props.route.params?.site?.site_description ?? ""
  );
  const [number, setNumber] = useState("");
  const [longitude, setLongitude] = useState(
    props.route.params?.site?.longitude ?? ""
  );
  const [latitude, setLatitude] = useState(
    props.route.params?.site?.latitude ?? ""
  );
  const [userData, setuserData] = useState("");
  const [isInchargeMenuOpen, setisInchargeMenuOpen] = useState(false);
  const [isLoading, setLoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});

  const [approverList, setApproverList] = useState(
    props.route.params?.site?.incharges?.map((incharge) => {
            return {
        user_id: incharge?.user_id,
        user_name: incharge?.full_name,
        role_name: incharge?.role_name,
        user_profile_pic: incharge?.user_profile_pic,
      };
    }) ?? []
  );

  let icon = props.route.params?.site?.images?.filter(
    (item) => item?.display_type == "banner"
  )[0]?.file;

  const [displayIcon, setDisplayIcon] = useState(icon ?? null);
  const [galleryImage, setGalleryImage] = useState(
    props.route.params?.site?.images ?? []
  );

  const [getBanner, setGetBanner] = useState(false);

  const [documentModal, setDocumentModal] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  const { successToast, warningToast, errorToast, showToast } = useToast();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const approver = useSelector((state) =>
    Object.keys(state.AnimalMove.approver).length > 0
      ? state.AnimalMove.approver
      : []
  );
  useEffect(() => {
    if (approver?.length > 0) {
      setApproverList(approver);
    }
  }, [JSON.stringify(approver)]);

  const deleteApprover = (id) => {
    const filter = approverList?.filter((p) => p?.user_id != id);
    setApproverList(filter);
    dispatch(setApprover(filter));
  };

  const getLocation = async (check) => {
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
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLongitude(location.coords.longitude.toString());
      setLatitude(location.coords.latitude.toString());
    } catch (e) {
      // errorToast("Oops!", "Something went wrong!!");
      showToast("error", "Oops! Something went wrong!!");
    } finally {
      setLoding(false);
    }
  };

  const validation = () => {
    if (siteName.trim().length === 0) {
      setIsError({ siteName: true });
      setErrorMessage({ siteName: "Site name is required" });
      return false;
    }
    return true;
  };

  const editSiteData = () => {
    if (validation()) {
      let obj = {
        zoo_id: zooID,
        site_id: props.route.params?.site?.site_id,
        site_name: getTextWithoutExtraSpaces(siteName),
        site_description: description,
        site_latitude: latitude,
        site_longitude: longitude,
        // site_incharge: approverList?.map((i) => i.user_id).join(","),
      };
      if (displayIcon?.uri) {
        obj["site_image[]"] = displayIcon;
      }
      setLoding(true);
      editZooSite(obj, galleryImage[0]?.uri ? galleryImage : [])
        .then((res) => {
          if (res?.success) {
            getRefreshToken()
              .then((response) => {
                if (!response.success) {
                  warningToast("Oops!!", response.message);
                  clearAsyncData("@antz_user_device_token");
                  clearAsyncData("@antz_user_data");
                  clearAsyncData("@antz_user_token");
                  clearAsyncData("@antz_selected_site");
                  dispatch(setSignOut());
                  dispatch(setPassCode(null));
                } else {
                  successToast("success", res.message);
                  saveAsyncData("@antz_user_token", response.token);
                  saveAsyncData("@antz_max_upload_sizes", response?.settings);
                  dispatch(setSignIn(response));
                  dispatch(setSites(response?.user?.zoos[0]?.sites));
                  dispatch(setApprover([]));
                  setTimeout(() => {
                    navigation.goBack();
                  }, 500);
                  setLoding(false);
                }
              })
              .catch((e) => {
                console.log({ e });
                setLoding(false);
                showToast("error", "Oops! Something went wrong!!");
              });
          } else {
            setLoding(false);
            showToast("error", res?.message);
          }
        })
        .catch((err) => {
          console.log({ err });
          // errorToast("Oops!", "Something went wrong!!");
          showToast("error", "Oops!! Try again later!!");
          setLoding(false);
        })
        .finally(() => {
          // setLoding(false);
        });
    }
  };

  const deleteSiteData = () => {
    setBottomTitle("Do you want to delete this site?");
    setType("deleteSection");
    alertModalOpen();
  };

  const siteDeleteFunc = () => {
    let obj = {
      site_id: props.route.params?.site?.site_id,
    };
    setLoding(true);
    deleteZooSite(obj)
      .then((res) => {
        setLoding(false);
        if (res.success) {
          successToast("success", res.message);
          setTimeout(() => {
            navigation.navigate("Housing");
          }, 500);
        } else {
          warningToast(
            "warning",
            "Cannot delete a site, section(s) is present!!"
          );
        }
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
      })
      .finally(() => {
        setLoding(false);
      });
  };

  const siteNameRef = useRef(null);
  const lognitudeRef = useRef(null);
  const latitudeRef = useRef(null);
  const descripRef = useRef(null);

  const handleSubmitFocus = (refs, time) => {};

  const catInchargeClose = () => {
    setisInchargeMenuOpen(false);
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

  const gotoApprovalScreen = () => {
    navigation.navigate("InchargeAndApproverSelect", {
      selectedInchargeIds: approverList.map((item) => item.user_id),
      inchargeDetailsData: approverList,
    });
  };

  // warning dialouge modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState("");
  const [bottomTitle, setBottomTitle] = useState("");

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const firstButtonPress = () => {
    if (type == "deleteSection") {
      siteDeleteFunc();
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
    const result = await handleFilesPick(errorToast, "image", setLoding);
    if (result&&result?.length>0) {
      setDisplayIcon(result[0]);
    }
  };

  const removeIcon = async () => {
    setLoding(true);
    removeDisplayImage({
      ref_id: props.route.params?.site?.site_id,
      ref_type: "site",
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
        // aspect: [4, 3],
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
      //   // 'image' now contains the cropped image data
      //   const imageData = {
      //     uri: result.uri,
      //     type: result.type,
      //     name: result.uri.split("/").pop(),
      //   };
      //   uploadGalleryImage([getFileData(imageData)]);

      //   // setGalleryImage([getFileData(result.assets[0])]);

      //   setDocumentModal(false);
      // }
    } catch (err) {
      console.log("Error picking image:", err);
    }
  };

  const uploadGalleryImage = (banner_image) => {
    setLoding(true);
    const reqObj = {
      site_id: props.route.params?.site?.site_id,
    };
    galleryImageUpload(reqObj, banner_image)
      .then((res) => {
        successToast("success", res?.message);
        setGalleryImage(res?.data);
        setGetBanner(!getBanner);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setLoding(false);
      })
      .finally(() => setLoding(false));
  };

  const removeDocuments = (url) => {
    setLoding(true);

    let obj = {
      site_id: props.route.params?.site?.site_id,
      image_id: url?.id,
    };

    deleteGalleryImage(obj)
      .then((res) => {
        successToast("success", res?.message);
        setGalleryImage(res?.data);
        setGetBanner(!getBanner);
      })
      .catch((err) => {
        setLoding(false);
      })
      .finally(() => {
        setLoding(false);
      });
  };

  return (
    <>
      <CustomForm
        header={true}
        title={"Edit Zoo Site"}
        onPress={editSiteData}
        deleteButton={deleteSiteData}
        deleteTitle={"Site"}
      >
        <View style={{}}>
          <Loader visible={isLoading} />

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

          <View style={{ flex: 7, marginTop: 20, marginBottom: 8 }}>
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
            inputLabel={"Site Name"}
            placeholder={"Enter Site Name"}
            refs={siteNameRef}
            onFocus={catInchargeClose}
            onChange={(val) => {
              setSiteName(val);
              setIsError(false);
              setErrorMessage(false);
            }}
            value={siteName}
            onSubmitEditing={() => handleSubmitFocus(lognitudeRef)}
            errors={errorMessage.siteName}
            isError={isError.siteName}
            accessible={true}
            accessibilityLabel={"siteName"}
            accessibilityId="siteName"
          />
          {/* <View style={{ marginVertical: 8 }}>
            <InchargeCard
              navigation={gotoApprovalScreen}
              title={"Choose Site Incharge"}
              selectedUserData={approverList}
              removeAsign={(item) => deleteApprover(item?.user_id)}
              outerStyle={{
                borderWidth: approverList?.length > 0 ? 2 : 1,
                borderRadius: 5,
                backgroundColor: constThemeColor.surface,
                borderColor: constThemeColor.outline,
              }}
            />
          </View> */}

          <InputBox
            refs={descripRef}
            inputLabel={"Site Description"}
            onFocus={catInchargeClose}
            multiline={true}
            numberOfLines={3}
            placeholder={"Enter Site Description"}
            onChange={(val) => setDescription(val)}
            value={description}
            errors={errorMessage.description}
            isError={isError.description}
            style={{ minHeight: 100 }}
            accessible={true}
            accessibilityLabel={"siteDesc"}
            accessibilityId="siteDesc"
          />

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

          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginVertical: 8,
              padding: 3,
            }}
          >
            <View style={{ flex: 7, marginBottom: 8 }}>
              <Text
                style={{
                  color: constThemeColor.onPrimaryContainer,
                  fontSize: FontSize.Antz_Minor_Medium.fontSize,
                  fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                }}
              >
                Location of the Site
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: constThemeColor.background,
              paddingHorizontal: Spacing.minor,
              paddingVertical: Spacing.small,
              borderRadius: 8,
              marginBottom: Spacing.small,
            }}
          >
            <TouchableOpacity
              onPress={() => getLocation(true)}
              accessible={true}
              accessibilityLabel={"location"}
              accessibilityId="location"
            >
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
              refs={lognitudeRef}
              inputLabel={"Longitude"}
              placeholder={"Longitude"}
              keyboardType={"numeric"}
              onFocus={catInchargeClose}
              errors={errorMessage.longitude}
              isError={isError.longitude}
              value={longitude}
              onChange={(value) => {
                checkNumber(value, "longitude")
                  ? setLongitude(value)
                  : setLongitude("");
              }}
              accessible={true}
              accessibilityLabel={"Longitude"}
              accessibilityId="Longitude"
            />

            <InputBox
              refs={latitudeRef}
              inputLabel={"Latitude"}
              placeholder={"Latitude"}
              keyboardType={"numeric"}
              onFocus={catInchargeClose}
              errors={errorMessage.latitude}
              isError={isError.latitude}
              value={latitude}
              onChange={(value) => {
                checkNumber(value, "latitude")
                  ? setLatitude(value)
                  : setLatitude("");
              }}
              accessible={true}
              accessibilityLabel={"Latitude"}
              accessibilityId="Latitude"
            />
          </View>
        </View>
      </CustomForm>

      {isInchargeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isInchargeMenuOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={catInchargeClose}
          >
            <Category
              categoryData={userData}
              onCatPress={catInchargePress}
              heading={"Choose Site Incharge"}
              isMulti={true}
              onClose={catInchargeClose}
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
      borderWidth: wp(0.225),
      borderColor: reduxColors.outlineVariant,
      minHeight: hp(4.5),
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    imageName: {
      fontSize: FontSize.Antz_Small.fontSize,
      fontWeight: FontSize.Antz_Small.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    ViewBox: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: reduxColors.surfaceVariant,
      borderRadius: wp(1),
      backgroundColor: reduxColors.surface,
      marginTop: hp("2%"),
      marginBottom: hp(1),
      height: hp(7),
    },
    destinationBox: {
      marginTop: hp(0.7),
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
      // backgroundColor: reduxColors.surface,
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

    attatchmentViewinner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: Spacing.minor,
      paddingRight: Spacing.small + Spacing.micro,
      paddingVertical: Spacing.small + Spacing.micro,
    },
    attatchmentView: {
      backgroundColor: reduxColors.surface,
      borderColor: reduxColors.outline,
      borderRadius: Spacing.mini,
    },
  });

export default EditSite;
