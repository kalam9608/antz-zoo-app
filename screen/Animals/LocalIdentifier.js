// Author: Ganesh Aher
// Date: 02-05-2023
// work: 1.Design and impliment the edit API on Design.

import React, { useEffect, useState, useRef } from "react";
import Category from "../../components/DropDownBox";
import CustomFormWithoutKeyboardScroll from "../../components/CustomFormWithoutKeyboardScroll";
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Linking,
  Image,
} from "react-native";
import { List } from "react-native-paper";
import InputBox from "../../components/InputBox";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import Colors from "../../configs/Colors";
import { useNavigation } from "@react-navigation/core";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import {
  addAnimalLocalIdentifier,
  animalEditData,
  getAnimalConfigs,
} from "../../services/AnimalService";
import DocumentUpload from "../../components/DocumentUpload";
import { Checkbox } from "react-native-paper";
import FontSize from "../../configs/FontSize";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { useToast } from "../../configs/ToastConfig";
import svg_med_attachment from "../../assets/attach_file.svg";
import Spacing from "../../configs/Spacing";
import { SvgXml } from "react-native-svg";
import { ScrollView } from "react-native-gesture-handler";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import CustomForm from "../../components/CustomForm";
import { getFileData } from "../../utils/Utils";
import { handleFilesPick } from "../../utils/UploadFiles";

const LocalIdentifier = (props) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  const [isLoading, setLoding] = useState(false);
  const [uploadFile, setUploadFile] = useState([]);
  const [makePrimary, setMakePrimary] = useState(false);

  const [animal_id, setAnimal_id] = useState(
    props.route.params?.item.animal_id ?? 0
  );

  const [selectIdentifierType, setSelectIdentifierType] = useState("");

  const [selectIdentifierTypeID, setSelectIdentifierTypeID] = useState("");
  const [selectIdentifierTypeData, setSelectIdentifierTypeData] = useState([]);
  const [isSelectIdentifierType, setIsSelectIdentifierType] = useState(false);
  const [localIdentifier, setLocalIdentifier] = useState("");
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});

  const [documentModal, setDocumentModal] = useState(false);

  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  const onPressMakePrimary = () => {
    setMakePrimary(!makePrimary);
  };

  const SetIdentifierTypeDown = () => {
    setIsSelectIdentifierType(!isSelectIdentifierType);
  };

  const identifierTypePressed = (item) => {
    setIsSelectIdentifierType(!isSelectIdentifierType);
    setSelectIdentifierType(item.map((value) => value.name).join(","));
    setSelectIdentifierTypeID(item.map((value) => value.id).join(","));
  };

  const identifierTypeClose = () => {
    setIsSelectIdentifierType(false);
  };

  const validation = () => {
    if (selectIdentifierType?.trim().length === 0) {
      setIsError({ selectIdentifierType: true });
      setErrorMessage({ selectIdentifierType: "Select Identifier Type" });
      return false;
    } else if (localIdentifier?.trim().length === 0) {
      setIsError({ localIdentifier: true });
      setErrorMessage({ localIdentifier: "Select Local Identifire" });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (selectIdentifierType || localIdentifier) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [selectIdentifierType, localIdentifier]);

  const addAnimalLocalIdentifierData = () => {
    if (validation()) {
      let requestObject = {
        animal_id: animal_id,
        type: selectIdentifierTypeID,
        value: localIdentifier,
        is_primary: Number(makePrimary),
      };
      setLoding(true);
      addAnimalLocalIdentifier(requestObject, uploadFile)
        .then((res) => {
          if (res.success) {
            successToast("Success!!", res?.message);
            navigation.goBack();
          } else {
            errorToast("Oops!!", res?.message);
          }
        })
        .catch((err) => {
          errorToast("Oops!!", "Something went wrong, try again later!!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  const toggleModal = () => {
    setDocumentModal(!documentModal);
  };

  const removeDocuments = (docsName) => {
    setLoding(true);
    const filterData = uploadFile?.filter((item) => {
      if (item?.type.split("/")[0].toLowerCase() == "image") {
        return item?.uri != docsName;
      } else {
        return item?.name != docsName;
      }
    });
    setUploadFile(filterData);
    setLoding(false);
  };

  const handleImagePick = async () => {
    // try {
    //   setLoding(true);
    //   const result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   });
    //   if (!result.canceled) {
    //     const selectedImages = result.assets.map((asset) => getFileData(asset));
    //     setUploadFile(selectedImages);
    //     setDocumentModal(!documentModal);
    //   }
    // } catch (err) {
    //   console.log("Error picking image:", err);
    // } finally {
    //   setLoding(false);
    //   setDocumentModal(false);
    // }
    setUploadFile(
      await handleFilesPick(errorToast, "image", setLoding, [], false)
    );
    setDocumentModal(false);
  };
  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
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
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) {
        setUploadFile([getFileData(result.assets[0])]);
        setDocumentModal(!documentModal);
      }
    } catch (err) {
      console.error("Error picking image:", err);
    } finally {
      setLoding(false);
      setDocumentModal(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoding(true);

    getAnimalConfigs()
      .then((res) => {
        setSelectIdentifierTypeData(
          res.data.animal_indetifier.map((item) => ({
            id: item.id,
            name: item.label,
            isSelect: item.id == selectIdentifierTypeID ? true : false,
          }))
        );
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setLoding(false);
      });
  };

  const identifierTypeRef = useRef(null);
  const localIdentifierRef = useRef(null);

  const dropdownOff = () => {
    setIsSelectIdentifierType(false);
  };
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const modalStyles =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  return (
    <>
      <CustomForm
        header={true}
        title={"Local Identifier"}
        noIcon={true}
        // isButtonDisabled={checked&&moreUpload?.length>0?false:true}
        onPress={addAnimalLocalIdentifierData}
      >
        <Loader visible={isLoading} />
        <InputBox
          inputLabel={"Local Identifier Type*"}
          placeholder={"Choose Local Identifier"}
          editable={false}
          value={selectIdentifierType}
          // onFocus={SetIdentifierTypeDown}
          DropDown={SetIdentifierTypeDown}
          rightElement={isSelectIdentifierType ? "menu-up" : "menu-down"}
          errors={errorMessage.selectIdentifierType}
          isError={isError.selectIdentifierType}
          //  defaultValue={section != null ? section : null}
        />
        <InputBox
          inputLabel={"Local Identifier*"}
          placeholder={"Enter Local Identifier"}
          value={localIdentifier}
          onFocus={dropdownOff}
          onChange={(value) => setLocalIdentifier(value)}
          errors={errorMessage.localIdentifier}
          isError={isError.localIdentifier}
        />

        <View style={reduxColors.checkboxWrap}>
          <Checkbox.Android
            status={makePrimary ? "checked" : "unchecked"}
            onPress={onPressMakePrimary}
          />
          <Text style={reduxColors.label}>Make Primary</Text>
        </View>
        <View>
          <View style={{ marginVertical: Spacing.body }}>
            <TouchableOpacity
              onPress={() => setDocumentModal(!documentModal)}
              style={{
                backgroundColor: constThemeColor?.secondaryContainer,
                paddingHorizontal: Spacing.body,
                paddingVertical: Spacing.minor,
                borderRadius: Spacing.small,

                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={[
                  FontSize.Antz_Minor_Regular,
                  { color: constThemeColor?.onPrimaryContainer },
                ]}
              >
                Upload
              </Text>
              <SvgXml
                xml={svg_med_attachment}
                width="20"
                height="18"
                style={{}}
              />
            </TouchableOpacity>
            <Text
              style={[
                FontSize.Antz_Subtext_Regular,
                {
                  color: constThemeColor?.outline,
                  padding: Spacing.small,
                },
              ]}
            >
              Add images in JPG or PNG format only.
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignSelf: "center",
              paddingHorizontal: Spacing.small,
              justifyContent: "space-around",
              marginVertical: uploadFile?.length ? Spacing.body : 0,
            }}
          >
            {uploadFile
              ?.filter(
                (item) =>
                  item?.type == "image/jpeg" ||
                  item?.type == "image/png" ||
                  item?.type == "image/jpg"
              )
              .map((item) => (
                <View
                  key={item.uri}
                  style={{
                    width: widthPercentageToDP(39),
                    marginBottom: heightPercentageToDP(0.5),
                    marginRight: Spacing.body,
                  }}
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
                      backgroundColor: constThemeColor.displaybgPrimary,
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
                      size={24}
                      color={constThemeColor.onSurfaceVariant}
                      onPress={() => removeDocuments(item?.uri)}
                    />
                  </View>
                </View>
              ))}
          </ScrollView>
          {isError.uploadFile ? (
            <Text style={reduxColors.errortext}>{errorMessage.uploadFile}</Text>
          ) : null}
        </View>
      </CustomForm>

      {isSelectIdentifierType ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isSelectIdentifierType}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={identifierTypeClose}
          >
            <Category
              categoryData={selectIdentifierTypeData}
              onCatPress={identifierTypePressed}
              heading={"Choose Identifier Type"}
              isMulti={false}
              onClose={identifierTypeClose}
            />
          </Modal>
        </View>
      ) : null}
      {documentModal ? (
        <Modal
          avoidKeyboard
          animationType="fade"
          transparent={true}
          visible={documentModal}
          style={[
            modalStyles.bottomSheetStyle,
            { backgroundColor: "transparent" },
          ]}
        >
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={[reduxColors.modalOverlay]}>
              <TouchableWithoutFeedback onPress={{}}>
                <View style={[reduxColors.modalContainer]}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: Spacing.major,
                    }}
                  >
                    <TouchableWithoutFeedback onPress={() => takePhoto()}>
                      <View style={reduxColors.modalView}>
                        <View
                          style={{
                            backgroundColor: constThemeColor.secondary,
                            height: 50,
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 40,
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
                    <TouchableWithoutFeedback onPress={handleImagePick}>
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
                        <Text style={reduxColors.docsText}>Add Photo</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    checkboxWrap: {
      flexDirection: "row",
      alignItems: "center",
      // justifyContent: "flex-end",
      width: "70%",
      // borderTopWidth: 0,
      // padding: 10,
      marginTop: 5,
    },
    label: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.blackWithPointEight,
    },
    modalOverlay: {
      flex: 1,
      // height: heightPercentageToDP(100),
      // width: widthPercentageToDP("100%"),
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
      // alignSelf: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      width: widthPercentageToDP("100%"),
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    docsText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
  });

export default LocalIdentifier;
