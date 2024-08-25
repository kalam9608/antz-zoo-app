/**
 * @React Imports
 */
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  BackHandler,
  Linking,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
/**
 * @Config Imports
 */
import FontSize from "../../../configs/FontSize";
import Spacing from "../../../configs/Spacing";
import Config, { documentType } from "../../../configs/Config";

/**
 * @Third Party Imports
 */
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
/**
 * @Expo Imports
 */
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

/**
 * @Utils Imports
 */
import { warningDailog } from "../../../utils/Alert";
import { getDocumentData, getFileData } from "../../../utils/Utils";

/**
 * @Component Imports
 */
import CustomForm from "../../../components/CustomForm";
import Loader from "../../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import InputBox from "../../../components/InputBox";
import Category from "../../../components/DropDownBox";
import BottomSheetModalStyles from "../../../configs/BottomSheetModalStyles";
import ImageViewer from "../../../components/ImageViewer";
import svg_med_attachment from "../../../assets/attach_file.svg";
/**
 * @API Imports
 */
import {
  AddIdProofService,
  DeleteIdProofImg,
  DeleteIdProofService,
  EditIdProofService,
  getIdProofsForm,
  getIdProofsList,
} from "../../../services/IdProofService";
import { useToast } from "../../../configs/ToastConfig";
import DialougeModal from "../../../components/DialougeModal";
import Header from "../../../components/Header";
import ListEmpty from "../../../components/ListEmpty";
import { SvgXml } from "react-native-svg";
import { Checkbox } from "react-native-paper";

export default function EditIdProof(props) {
  const { successToast, errorToast } = useToast();
  const navigation = useNavigation();
  const [id_proof_id, setId_proof_id] = useState(
    props.route.params?.item?.id ?? 0
  );
  const [IdProofForm, setIdProofForm] = useState([]);
  const [id, setId] = useState(props.route.params?.item?.id ?? "");
  const [idName, setIdName] = useState(props.route.params?.item?.id_name ?? "");
  const [idMoreNumber, setIdMoreNumber] = useState(
    props.route.params?.item?.id_value ?? ""
  );
  const [checked, setChecked] = useState(true);
  const [moreUpload, setMoreUpload] = useState([]);
  const [prevImage, setPrevImage] = useState([]);
  const [newImages, setNewImages] = useState([]);
  // props.route.params?.item?.doc_files?.length > 0
  // ? // [
  //     {
  //       id: 1,
  //       name: props.route.params?.item?.id_doc,
  //       url:
  //         Config.BASE_APP_URL +
  //         "uploads/" +
  //         props.route.params?.item?.id_doc,
  //     },
  //   ]
  //   props.route.params?.item?.doc_files
  //     ?.filter((data) => {
  //       const extension = data?.id_doc?.split(".").pop().toLowerCase();
  //       return extension === "jpeg" || extension === "png";
  //     })
  //     ?.map((item, index) => {
  //       const extension = item?.id_doc?.split(".").pop().toLowerCase();
  //       return {
  //         name: item.id_doc,
  //         type: `image/${extension}`,
  //         uri:  Config.BASE_APP_URL +
  //         "uploads/" +
  //         item?.id_doc,
  //       }
  //     })
  // : []

  // console.log(">>>>>>>>>>>>>>>>>>>>>>>", prevImage);
  const [idProofDropDown, setIdProofDropDown] = useState("");
  const [loading, setLoding] = useState(false);
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [documentModal, setDocumentModal] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const modalStyles =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  const catPressed = (item) => {
    item.map((value) => {
      setId(value.id);
    });
    item.map((value) => {
      setIdName(value.name);
    });
    setIdProofDropDown(!idProofDropDown);
  };

  const catClose = () => {
    setIdProofDropDown(!idProofDropDown);
  };

  const SetDropDown = (data) => {
    setIdProofDropDown(!idProofDropDown);
  };

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const firstButtonPress = () => {
    onDelete();
    alertModalClose();
  };
  const secondButtonPress = () => {
    alertModalClose();
  };
  useEffect(() => {
    if (props.route.params?.item?.doc_files?.length > 0) {
      docFileImageType(props.route.params?.item?.doc_files);
    }
  }, [JSON.stringify(props.route.params?.item?.doc_files)]);

  const docFileImageType = (items) => {
    const imgs = items
      ?.filter((data) => {
        const extension = data?.id_doc?.split(".").pop().toLowerCase();
        return (
          extension === "jpeg" || extension === "png" || extension === "jpg"
        );
      })
      ?.map((item, index) => {
        const extension = item?.id_doc?.split(".").pop().toLowerCase();
        return {
          ...item,
          name: item.id_doc,
          type: `image/${extension}`,
          uri: Config.BASE_APP_URL + "uploads/" + item?.id_doc,
        };
      });
    setMoreUpload(imgs);
  };
  const validate = () => {
    if (idName.length == 0) {
      setIsError({ idName: true });
      setErrorMessage({ idName: "Please Select Id Proof Type" });
      return false;
    } else if (idMoreNumber.trim().length == 0) {
      setIsError({ idMoreNumber: true });
      setErrorMessage({ idMoreNumber: "Please Enter Id Proof Number" });
      return false;
    } else if (!prevImage.length && moreUpload.length == 0) {
      setIsError({ moreUpload: true });
      setErrorMessage({ moreUpload: "Please Upload The File" });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (idName || idMoreNumber || moreUpload) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [idName, idMoreNumber, moreUpload]);

  const onSubmit = () => {
    setIsError({});
    setErrorMessage({});
    if (validate()) {
      setLoding(true);
      let obj = {
        id_proof_id: id_proof_id,
        id_proof_value: idMoreNumber,
        type_id: id,
        user_id: props?.route?.params?.item?.user_id
      };
      // let imeg = moreUpload.length > 0 ? moreUpload : null;
      EditIdProofService(obj)
        .then((res) => {
          if (res.success) {
            successToast("Success ", res.message);
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          } else {
            errorToast("error", "something went wrong");
          }
        })
        .catch((error) => {
          console.log("error----->", error);
          errorToast("error", "something went wrong");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  const deleteApi = () => {
    alertModalOpen();
  };
  const onImageUpload = (imageData) => {
    setLoding(true);
      let obj = {
        user_id: props?.route?.params?.item?.user_id,
        id_type: id,
        id_value: props.route.params?.item?.id_value,
      };
      AddIdProofService(obj, imageData)
        .then((res) => {
          if (res?.success) {
            successToast("Success ", "Images uploaded successfully");
            docFileImageType(res?.data?.doc_files)
            setNewImages([])
          } else {
            errorToast("error", "Oops! Something went wrong!!");
          }
        })
        .catch((error) => {
          console.log("error----->", error);
          errorToast("error", "Oops! Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
        });
    
  };

  const deleteImg = (id) => {
    setLoding(true);
    let obj = {
      id: id,
    };
    DeleteIdProofImg(obj)
      .then((res) => {
        if (res.success) {
          successToast("Success ", res.message);
          const filterData = moreUpload?.filter((item) => {
            if (item?.type.split("/")[0].toLowerCase() == "image") {
              return item?.id != id;
            } 
            // else {
            //   return item?.name != docsName;
            // }
          });
          setMoreUpload(filterData);
        } else {
          errorToast("error", "something went wrong");
        }
      })
      .catch((error) => {
        console.log("error----->", error);
        errorToast("error", "something went wrong");
      })
      .finally(() => {
        setLoding(false);
      });
  };
  // Delete ID proof
  const onDelete = () => {
    setIsError({});
    setErrorMessage({});
    setLoding(true);
    let obj = {
      user_id: props?.route?.params?.item?.user_id,
      type_id: id,
    };
    DeleteIdProofService(obj)
      .then((res) => {
        if (res.success) {
          successToast("Success ", res.message);
          setTimeout(() => {
            navigation.goBack();
          }, 500);
        } else {
          errorToast("error", "something went wrong");
        }
      })
      .catch((error) => {
        console.log("error----->", error);
        errorToast("error", "something went wrong");
      })
      .finally(() => {
        setLoding(false);
      });
  };

  const idProofRef = useRef(null);
  const idproofnumRef = useRef(null);
  const handleSubmitFocus = (refs) => {
    if (refs.current) {
      refs.current.focus();
    }
  };

  const dropdownOff = () => {
    setIdProofDropDown(false);
  };
  const toggleModal = () => {
    setDocumentModal(!documentModal);
  };

  // const removeDocuments = (docsName) => {
  //   setLoding(true);
  //   const filterData = moreUpload?.filter((item) => {
  //     if (item?.type.split("/")[0].toLowerCase() == "image") {
  //       return item?.uri != docsName;
  //     } else {
  //       return item?.name != docsName;
  //     }
  //   });
  //   const filterNewData = newImages?.filter((item) => {
  //     if (item?.type.split("/")[0].toLowerCase() == "image") {
  //       return item?.uri != docsName;
  //     } else {
  //       return item?.name != docsName;
  //     }
  //   });
  //   setMoreUpload(filterData);
  //   setNewImages(filterNewData);
  //   setLoding(false);
  // };
  // const handleDocumentPick = async () => {
  //   setLoding(true);
  //   try {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: documentType,
  //     });
  //     if (!result.canceled) {
  //       setPrevImage([]);
  //       setMoreUpload([getDocumentData(result.assets[0])]);
  //     }
  //     setLoding(false);
  //     setDocumentModal(!documentModal);
  //   } catch (err) {
  //     setLoding(false);
  //     console.log("Error picking document:", err);
  //   }
  // };

  // const handleImagePick = async () => {
  //   setLoding(true);
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       quality: 1,
  //     });
  //     if (!result.canceled) {
  //       setPrevImage([]);
  //       setMoreUpload([getFileData(result.assets[0])]);
  //     }
  //     setDocumentModal(!documentModal);
  //     setLoding(false);
  //   } catch (err) {
  //     console.log("Error picking image:", err);
  //     setLoding(false);
  //   }
  // };

  const handleImagePick = async () => {
    try {
      setLoding(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true, // Enable multi-selection
      });

      if (
        result &&
        !result.cancelled &&
        result.assets &&
        result.assets.length > 0
      ) {
        const selectedImages = result.assets.map((asset) => getFileData(asset));
        setMoreUpload([...moreUpload, ...selectedImages]);
        setNewImages([...newImages, ...selectedImages]);
        onImageUpload([...newImages, ...selectedImages])
        setDocumentModal(!documentModal);
      }
    } catch (err) {
      console.log("Error picking image:", err);
    } finally {
      setLoding(false);
      setDocumentModal(false);
    }
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
      if (!result.canceled && result.assets) {
        setDocumentModal(false);
        // setMoreUpload([...moreUpload, getFileData(result.assets[0])]);
        setNewImages([...newImages, getFileData(result.assets[0])]);
        setTimeout(()=>{
          onImageUpload([...newImages, getFileData(result.assets[0])])
        },1000)
      
      }
    } catch (err) {
      console.error("Error picking image:", err);
    } finally {
      setLoding(false);
      setDocumentModal(false);
    }
  };
  const handleCheckboxToggle = () => {
    setChecked(!checked);
  };

  const openPDF = async (pdfURL) => {
    const supported = await Linking.canOpenURL(pdfURL);

    if (supported) {
      await Linking.openURL(pdfURL);
    } else {
      console.error(`Don't know how to open URL: ${pdfURL}`);
    }
  };

  return (
    <>
      <CustomForm
        header={true}
        title={"Edit Id Proof"}
        noIcon={true}
        onPress={onSubmit}
        deleteButton={deleteApi}
        isButtonDisabled={checked && moreUpload?.length > 0 ? false : true}
        deleteTitle={"Id Proof"}
      >
        <Loader visible={loading} />
        <View style={styles.fieldSection}>
          <InputBox
            refs={idProofRef}
            edit={false}
            inputLabel="Id Proof Type"
            value={idName}
            placeholder="Enter Id Proof Type"
            rightElement={idProofDropDown ? "menu-up" : "menu-down"}
            DropDown={SetDropDown}
            onFocus={SetDropDown}
            onSubmitEditing={() => handleSubmitFocus(idproofnumRef)}
            errors={errorMessage.idName}
            isError={isError.idName}
          />
          <InputBox
            refs={idproofnumRef}
            inputLabel={"Id Proof Number"}
            placeholder={"Enter Id Number"}
            value={idMoreNumber}
            onFocus={dropdownOff}
            errors={errorMessage.idMoreNumber}
            isError={isError.idMoreNumber}
            onChange={(value) => setIdMoreNumber(value)}
          />

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
                { color: constThemeColor?.outline, padding: Spacing.small },
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
              marginVertical: moreUpload?.length ? Spacing.body : 0,
            }}
          >
            {moreUpload
              ?.filter(
                (item) =>
                  item?.type == "image/jpeg" ||
                  item?.type == "image/png" ||
                  item?.type == "image/jpg"
              )
              .map((item) => (
                <View
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
                      onPress={() => {
                        // removeDocuments(item?.uri)
                        deleteImg(item?.id)
                      }}
                    />
                  </View>
                </View>
              ))}
          </ScrollView>
          <View>
            {/* {moreUpload?.length == 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setDocumentModal(!documentModal);
                }}
                style={styles.uploadcontainer}
              >
                <Ionicons name="add" size={45} style={{ color: "black" }} />
              </TouchableOpacity>
            ) : null} */}
            {/* <ImageViewer
              data={moreUpload.filter(
                (item) => item?.type.split("/")[0].toLowerCase() == "image"
              )}
              horizontal={true}
              imageClose={(item) => removeDocuments(item?.uri)}
            /> */}
            {/* {moreUpload
              .filter(
                (item) => item?.type.split("/")[0].toLowerCase() !== "image"
              )
              .map((item) => (
                <View style={{ marginTop: Spacing.micro }}>
                  <View
                    style={[
                      styles.attachBox,
                      {
                        backgroundColor: constThemeColor.displaybgPrimary,
                        margin: widthPercentageToDP(0.5),
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="picture-as-pdf"
                      size={24}
                      color={constThemeColor.onSurfaceVariant}
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.attachText}>{item?.name}</Text>
                    </View>

                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color={constThemeColor.onSurfaceVariant}
                      style={{
                        paddingHorizontal: 5,
                      }}
                      onPress={() => removeDocuments(item?.name)}
                    />
                  </View>
                </View>
              ))} */}
            {/* {prevImage.length > 0 &&
              (prevImage[0]?.name?.match(/\.(jpeg|jpg|png)$/i) ? (
                <ImageViewer data={prevImage} horizontal={true} />
              ) : (
                <TouchableOpacity onPress={() => openPDF(prevImage[0]?.url)}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 10,
                      marginBottom: 3,
                      marginTop: 3,
                      backgroundColor: constThemeColor.surface,
                    }}
                  >
                    <MaterialIcons
                      name="picture-as-pdf"
                      size={24}
                      color={constThemeColor.onSurfaceVariant}
                    />

                    <View style={{ marginLeft: 10 }}>
                      <Text numberOfLines={1} ellipsizeMode="tail">
                        {prevImage[0]?.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            {isError.moreUpload ? (
              <Text style={styles.errortext}>{errorMessage.moreUpload}</Text>
            ) : null} */}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Checkbox.Android
              status={checked == true ? "checked" : "unchecked"}
              onPress={handleCheckboxToggle}
            />
            <Text
              style={{
                color: constThemeColor.onSecondaryContainer,
                marginLeft: Spacing.mini,
              }}
            >
              The information provided is correct
            </Text>
          </View>
          {isError.moreUpload ? (
            <Text style={styles.errortext}>{errorMessage.moreUpload}</Text>
          ) : null}
        </View>
      </CustomForm>
      {idProofDropDown ? (
        <View>
          <Modal
            animationType="fade"
            visible={idProofDropDown}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={catClose}
          >
            <Category
              categoryData={IdProofForm}
              onCatPress={catPressed}
              heading={"Choose Id Proof Type"}
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
          visible={documentModal}
          style={[
            modalStyles.bottomSheetStyle,
            { backgroundColor: "transparent" },
          ]}
        >
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={[styles.modalOverlay]}>
              <TouchableWithoutFeedback onPress={{}}>
                <View style={[styles.modalContainer]}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: Spacing.major,
                    }}
                  >
                    <TouchableWithoutFeedback onPress={() => takePhoto()}>
                      <View style={styles.modalView}>
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
                        <Text style={styles.docsText}>Camera</Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={handleImagePick}>
                      <View style={styles.modalView}>
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
                        <Text style={styles.docsText}>Add Photo</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}

      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Do you want to delete this id proof details?"}
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
}

const style = (reduxColors) =>
  StyleSheet.create({
    errortext: {
      color: reduxColors.danger,
    },
    fieldSection: {
      borderWidth: 0.5,
      paddingHorizontal: 5,
      borderRadius: 10,
      borderColor: reduxColors.surfaceVariant,
      marginVertical: 10,
      paddingBottom: 5,
    },
    errortext: {
      color: reduxColors.danger,
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
    bottomSheetStyle: {
      margin: 0,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    attachBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      marginBottom: 3,
      marginTop: 3,
      backgroundColor: reduxColors.surface,
    },
    uploadcontainer: {
      width: 70,
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      // backgroundColor:"red"
    },
  });
