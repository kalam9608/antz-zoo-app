import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import Loader from "../../components/Loader";
import { CountryPicker } from "react-native-country-codes-picker";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import {
  createLab,
  getSampleAndTests,
  mobileExist,
} from "../../services/staffManagement/addPersonalDetails";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { Image } from "react-native";
import Flag from "react-native-flags";
import * as allFlatFlags32 from "react-native-flags/flags/flat/32";

import { ActivityIndicator, Switch } from "react-native-paper";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import SubmitBtn from "../../components/SubmitBtn";
import LabTestCard from "../../components/medical/LabTestCard";
import Category from "../../components/DropDownBox";
import { getFileData } from "../../utils/Utils";

const AddLabForm = (props) => {
  const { successToast, errorToast, alertToast, warningToast, showToast } =
    useToast();
  const navigation = useNavigation();
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [labName, setLabName] = useState("");
  const [labOwnerName, setLabOwnerName] = useState("");
  const [labTestDataArray, setLabTestDataArray] = useState([]);
  const [countryCode, setCountryCode] = useState("+91");
  const [countryFlag, setCountryFlag] = useState("IN");
  const [country, setcountry] = useState("India");

  const [mobile, setmobile] = useState("");
  const [Address, setAddress] = useState("");
  const [show, setShow] = useState(false);
  const [mobile_exist, setmobile_exist] = useState(false);

  const [userImageModal, setUserImageModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [MobileLoad, setMobileLoad] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const [imageData, setImageData] = useState(null);
  const [imageData64, setImageData64] = useState("");
  const [imgformat, setimgformat] = useState();
  const [imagetype, setimagetype] = useState();
  const [switchStatus, setSwitchStatus] = useState(false);
  const [isLabTypeMenuOpen, setIsLabTypeMenuOpen] = useState(false);
  const [labType, setLabType] = useState("Internal Lab");
  const [labTypeId, setlabTypeId] = useState(1);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const [image, setImage] = useState([]);
  const [labSend, setLabSend] = useState(false);
  const [labTypeData] = useState([
    {
      id: 1,
      name: "Internal Lab",
    },
    {
      id: 2,
      name: "External Lab",
    },
  ]);

  const toggleUserImageModal = () => {
    setUserImageModal(!userImageModal);
  };

  const PhotoUploadOptions = () => {
    // sheetRef.current.open();
    setUserImageModal(!userImageModal);
  };

  const closeUserImageModal = () => {
    setUserImageModal(false);
  };

  const pickImage = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setIsLoading(false);
      setImageData64(result.assets[0].base64);
      setImageData(result.assets[0].uri);
      setimagetype(result.assets[0].type);
      setImage([getFileData(result.assets[0])]);
      const fileExtension = result.assets[0].uri.split(".").pop();
      setimgformat(fileExtension);
      setUserImageModal(false);
    }

    // sheetRef.current.close();
    setIsLoading(false);
  };
  const takePhoto = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setIsLoading(false);
      setImageData64(result.assets[0].base64);
      setImageData(result.assets[0].uri);
      setImage([getFileData(result.assets[0])]);
      setimagetype(result.assets[0].type);
      const fileExtension = result.assets[0].uri.split(".").pop();
      setimgformat(fileExtension);
      setUserImageModal(false);
    }

    setIsLoading(false);
    // sheetRef.current.close();
  };

  const checkMobile = (mobile) => {
    setmobile(mobile);
    setIsError({});
    if (mobile.length >= 10) {
      setMobileLoad(true);
      mobileExist({ mobile })
        .then((res) => {
          setmobile_exist(!res.success);

          if (!res.success) {
            setIsError({ mobile: true });
            setErrorMessage({ mobile: res.message });
            setMobileLoad(false);
          }
          setMobileLoad(false);
        })

        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!!");
          setMobileLoad(false);
        });
    } else {
      setmobile_exist(true);
      setIsError({ mobile: true });
      setErrorMessage({ mobile: "Enter a valid mobile no" });
      setMobileLoad(false);
    }
  };

  const handleContentSizeChange = (event) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };
  const getLocation = async (check) => {
    setIsLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  const closeDesignation = () => {
    setisDesignationOpen(false);
  };

  const CountCode = (item) => {
    setCountryCode(item.dial_code);
    setShow(false);
  };
  const showAlert = () => {
    setIsVisible(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };

  const handleOK = () => {
    setIsVisible(false);
  };
  const handleCancel = () => {
    setIsVisible(false);
    navigation.goBack();
  };

  const searchSelectData = (data) => {
    setLabTestDataArray(data);
  };

  const SetLabTypeDropDown = () => {
    setIsLabTypeMenuOpen(!isLabTypeMenuOpen);
  };
  const labTypeCatClose = () => {
    setIsLabTypeMenuOpen(false);
  };
  const labTypeCatPressed = (item) => {
    setLabType(item.map((u) => u.name).join(", "));

    setlabTypeId(item.map((id) => id.id).join(","));

    setIsLabTypeMenuOpen(false);
  };
  const onToggleSwitch = () => {
    setSwitchStatus(!switchStatus);
  };

  //
  const activeCount = () => {
    setLabSend(false);
    labTestDataArray?.filter((i) => {
      if (i.active) {
        setLabSend(true);
      }
    });
  };
  useEffect(() => {
    {
      labTestDataArray.length === 0
        ? getSampleAndTests()
            .then((res) => {
              setLabTestDataArray(res.data);
            })
            .catch((err) => {
              console.log("errror=======>", err);
              errorToast("error", "Oops! Something went wrong!");
            })
            .finally(() => {
              setIsLoading(false);
            })
        : null;
    }
  }, []);

  useEffect(() => {
    activeCount();
  }, [labTestDataArray]);

  const validation = () => {
    if (labName == "") {
      setIsError({ labName: true });
      setErrorMessage({ labName: "Enter lab name" });
      return false;
    } else if (labTypeId == null) {
      setIsError({ labType: true });
      setErrorMessage({ labType: "Select lab type" });
      return false;
    } else if (labOwnerName == "") {
      setIsError({ labOwnerName: true });
      setErrorMessage({ labOwnerName: "Enter lab incharge name" });
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (validation()) {
      let obj = {
        lab_name: labName,
        incharge_name: labOwnerName,
        address: Address,
        latitudes: latitude,
        longitudes: longitude,
        lab_contact_number: countryCode + mobile,
        is_default: switchStatus,
        type: labTypeId,
        user_id: UserId,
      };
      if (labSend) {
        obj.lab = JSON.stringify(labTestDataArray);
      }
      setIsLoading(true);
      createLab(obj, image)
        .then((res) => {
          if (res?.success) {
            successToast("success", res?.message);
            navigation.goBack();
          } else {
            errorToast("error", "Oops! Something went wrong!");
          }
        })
        .catch((err) => {
          console.log("errror=======>", err);
          errorToast("error", "Oops! Something went wrong!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const removeTests = (testObj) => {
    const updatedLabTestDataArray = labTestDataArray.map((sample) => {
      const updatedSample = { ...sample, value: false };
      updatedSample.tests = updatedSample.tests.map((test) => {
        if (test.test_id === testObj.test_id) {
          test.full_test = false;
          test.child_tests = test.child_tests.map((childTest) => ({
            ...childTest,
            value: false,
          }));
        }

        // Check if the testObj is "Others" and update accordingly
        if (testObj.test_name === "Others") {
          test.full_test = false;
          test.input_value = ""; // Clear the input_value for "Others"
        }

        return test;
      });

      // Check if any child test in the current sample is true
      const anyChildTestTrue = updatedSample.tests.some((test) =>
        test.child_tests.some((childTest) => childTest.value === true)
      );

      // If any child test is true in the current sample, set sample.active to true
      if (anyChildTestTrue) {
        updatedSample.active = true;
      } else {
        updatedSample.active = false;
      }

      return updatedSample;
    });

    setLabTestDataArray(updatedLabTestDataArray);
  };

  const reOrderedLabTestArray = (index, updatedTests) => {
    // Create a new array of objects
    const newData = [...labTestDataArray];

    // Update the tests array of the specified object
    newData[index] = { ...newData[index], tests: updatedTests };

    // Iterate over all tests in newData
    newData.forEach((test) => {
      // Filter out innerTest objects that don't meet the condition
      const filteredTests = test.tests.filter((innerTest) => {
        // Check if the condition fulfills for any childTest
        return innerTest.child_tests.some(
          (childTest) => childTest.value !== false
        );
      });

      // Filter out innerTest objects that meet the condition
      const rejectedTests = test.tests.filter((innerTest) => {
        // Check if the condition does not fulfill for any childTest
        return !innerTest.child_tests.some(
          (childTest) => childTest.value !== false
        );
      });

      // Concatenate filtered and rejected tests arrays
      test.tests = filteredTests.concat(rejectedTests);
    });

    setLabTestDataArray(newData);
  };

  // // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: constThemeColor.onPrimary }}>
        <Loader visible={isLoading} />
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "transparent",
            alignItems: "center",
            marginHorizontal: Spacing.major,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={constThemeColor.neutralPrimary}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: FontSize.Antz_Medium_Medium.fontSize,
              fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
            }}
          >
            Add Lab Basic Info
          </Text>
        </View>

        <CustomForm
          header={false}
          onPress={onSubmit}
          // marginBottom={50}
        >
          <TouchableOpacity
            onPress={() => PhotoUploadOptions()}
            style={{
              width: 124,
              height: 124,
              borderRadius: 62,
              alignSelf: "center",
              backgroundColor: constThemeColor.secondary,
              justifyContent: "center",
            }}
          >
            {!imageData ? (
              <Fontisto
                name="laboratory"
                size={60}
                color={constThemeColor.onPrimary}
                style={{ alignSelf: "center" }}
              />
            ) : (
              <Image
                source={{ uri: imageData }}
                style={{
                  width: 124,
                  height: 124,
                  borderRadius: 62,
                  alignSelf: "center",
                  backgroundColor: constThemeColor.secondary,
                  justifyContent: "center",
                }}
              />
            )}
          </TouchableOpacity>

          {!imageData ? (
            <Text
              style={{
                alignSelf: "center",
                fontSize: FontSize.Antz_Minor_Regular.fontSize,
                fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                color: constThemeColor.primary,
                marginTop: 10,
              }}
            >
              Add Lab Profile Picture
            </Text>
          ) : null}

          <InputBox
            inputLabel={"Lab Name*"}
            placeholder={"Enter Lab Name*"}
            onChange={(val) => {
              setIsError(false);
              setLabName(val);
            }}
            value={labName}
            isError={isError.labName}
            errors={errorMessage.labName}
          />
          <InputBox
            inputLabel={"Lab Type"}
            placeholder={"Choose Lab Type"}
            value={labType}
            defaultValue={labType != null ? labType : null}
            rightElement={isLabTypeMenuOpen ? "menu-up" : "menu-down"}
            onFocus={SetLabTypeDropDown}
            DropDown={SetLabTypeDropDown}
            errors={errorMessage.labType}
            isError={isError.labType}
          />
          <InputBox
            inputLabel={"Lab Incharge Name"}
            placeholder={"Enter Lab Incharge Name"}
            onChange={(val) => {
              setIsError(false);
              setLabOwnerName(val);
            }}
            autoCapitalize="none"
            value={labOwnerName}
            isError={isError.labOwnerName}
            errors={errorMessage.labOwnerName}
          />
          <InputBox
            inputLabel={"Lab Address"}
            placeholder={"Lab Enter Address"}
            keyboardType={"default"}
            onContentSizeChange={handleContentSizeChange}
            multiline={true}
            numberOfLines={1}
            onChange={(val) => setAddress(val)}
            closeDesignation
            value={Address}
            isError={isError.Address}
            errors={errorMessage.Address}
          />

          <InputBox
            inputLabel={"Lab Incharge Mobile Number"}
            placeholder={"Enter Mobile Number"}
            keyboardType={"numeric"}
            maxLength={10}
            onChange={(val) => {
              checkMobile(val);
            }}
            value={mobile}
            isError={isError.mobile}
            errors={errorMessage.mobile}
            renderRightIcon={true}
            left={
              <TouchableOpacity
                onPress={() => setShow(true)}
                style={{ flexDirection: "row" }}
              >
                <View
                  onPress={() => setShow(true)}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Flag code={countryFlag} size={32} from={allFlatFlags32} />
                  <AntDesign
                    name="caretdown"
                    size={10}
                    color={constThemeColor.onPrimaryContainer}
                    style={{ left: 3 }}
                  />
                </View>
              </TouchableOpacity>
            }
            right={() => {
              return mobile.length >= 10 ? (
                MobileLoad ? (
                  <ActivityIndicator size={24} />
                ) : mobile_exist ? (
                  <Entypo
                    name="cross"
                    size={24}
                    color={constThemeColor.error}
                  />
                ) : (
                  <Ionicons
                    name="checkmark-done"
                    size={24}
                    color={constThemeColor.primaryContainer}
                  />
                )
              ) : (
                <></>
              );
            }}
          />
          <View
            style={{
              paddingVertical: Spacing.small,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={reduxColors.defaultText}>Mark as default Lab</Text>
            </View>
            <View>
              <Switch
                value={switchStatus}
                onValueChange={(e) => onToggleSwitch(e)}
              />
            </View>
          </View>
          <View
            style={{
              backgroundColor: constThemeColor?.background,
              paddingVertical: Spacing.minor,
              borderRadius: Spacing.small,
              marginVertical: Spacing.small,
            }}
          >
            <View style={{ marginBottom: Spacing.small }}>
              <SubmitBtn
                buttonText="Add Tests"
                onPress={() =>
                  navigation.navigate("LabTestSearch", {
                    name: "Lab Request",
                    listData: labTestDataArray,
                    onGoBack: (e) => searchSelectData(e),
                    page: "AddLab",
                  })
                }
                backgroundColor={constThemeColor.secondaryContainer}
                color={constThemeColor.onSecondaryContainer}
                iconName={"plus"}
                fontSize={FontSize.Antz_Minor_Medium.fontSize}
                fontWeight={FontSize.Antz_Minor_Medium.fontWeight}
              />
            </View>
            <LabTestCard
              data={labTestDataArray}
              reOrderedLabTestArray={reOrderedLabTestArray}
              removeTests={(e) => removeTests(e)}
            />
          </View>
          <View
            style={{
              backgroundColor: constThemeColor.background,
              paddingHorizontal: Spacing.minor,
              paddingVertical: Spacing.small,
              borderRadius: 8,
              marginBottom: Spacing.small,
              marginTop: Spacing.small,
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
              inputLabel={"Longitude"}
              placeholder={"Longitude"}
              keyboardType={"numeric"}
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
              inputLabel={"Latitude"}
              placeholder={"Latitude"}
              keyboardType={"numeric"}
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
        </CustomForm>

        <CountryPicker
          show={show}
          style={{
            modal: {
              height: 300,
            },
          }}
          onBackdropPress={() => setShow(false)}
          pickerButtonOnPress={(item) => {
            setCountryCode(item.dial_code);
            setcountry(item.name.en);
            setCountryFlag(item.code);
            setShow(false);
          }}
        />

        {userImageModal ? (
          <Modal
            avoidKeyboard
            animationType="fade"
            visible={true}
            onDismiss={closeUserImageModal}
            onBackdropPress={closeUserImageModal}
            onRequestClose={closeUserImageModal}
            style={[
              stylesSheet.bottomSheetStyle,
              { backgroundColor: "transparent" },
            ]}
          >
            <TouchableWithoutFeedback onPress={toggleUserImageModal}>
              <View style={[reduxColors.modalOverlay]}>
                <View style={reduxColors.modalContainer}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <TouchableWithoutFeedback onPress={pickImage}>
                      <View style={reduxColors.modalView}>
                        <View
                          style={{
                            backgroundColor: constThemeColor.secondary,
                            height: 50,
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 25,
                          }}
                        >
                          <MaterialIcons
                            name="photo-library"
                            size={24}
                            color={constThemeColor.onPrimary}
                          />
                        </View>
                        <Text style={reduxColors.docsText}>Gallery</Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={takePhoto}>
                      <View style={reduxColors.modalView}>
                        <View
                          style={{
                            backgroundColor: constThemeColor.secondary,
                            height: 50,
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 25,
                          }}
                        >
                          <MaterialIcons
                            name="camera-alt"
                            size={24}
                            color={constThemeColor.onPrimary}
                          />
                        </View>
                        <Text style={reduxColors.docsText}>Camera</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : null}

        <DialougeModal
          isVisible={isVisible}
          alertType={Config.SUCCESS_TYPE}
          title={alertTitle}
          subTitle={alertMessage}
          closeModal={hideAlert}
          firstButtonHandle={handleOK}
          secondButtonHandle={handleCancel}
          firstButtonText={"Go to user details"}
          secondButtonText={"Go to back"}
          secondButtonStyle={{
            backgroundColor: constThemeColor.error,
            borderWidth: 0,
          }}
          secondButtonTextStyle={{
            color: constThemeColor.onPrimary,
          }}
          firstButtonStyle={{
            backgroundColor: constThemeColor.surfaceVariant,
            borderWidth: 0,
          }}
        />
      </View>
      {isLabTypeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isLabTypeMenuOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={labTypeCatClose}
          >
            <Category
              categoryData={labTypeData}
              onCatPress={labTypeCatPressed}
              heading={"Choose Lab Type"}
              isMulti={false}
              onClose={labTypeCatClose}
            />
          </Modal>
        </View>
      ) : null}
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: Spacing.small,
      paddingHorizontal: Spacing.small,
    },
    Label: {
      marginTop: 20,
      fontSize: FontSize.Antz_Small,
      fontWeight: "200",
    },
    autoGenarate: {
      color: reduxColors.primary,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      lineHeight: 16,
      marginBottom: Spacing.mini,
      marginLeft: widthPercentageToDP(3),
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors?.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    defaultText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      // marginLeft: Spacing.small,
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
    labTestBox: {
      marginTop: 12,
      marginBottom: 8,
    },
    labTest: {
      justifyContent: "center",
      width: "100%",
      borderRadius: 4,
      minHeight: heightPercentageToDP(6.5),
    },
    labTestTextStyle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      paddingLeft: 15,
    },
  });

export default AddLabForm;
