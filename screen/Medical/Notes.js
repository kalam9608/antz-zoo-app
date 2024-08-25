import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  BackHandler,
  Platform,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MedicalHeader from "../../components/MedicalHeader";
import Footermedical from "../../components/Footermedical";
import { useDispatch, useSelector } from "react-redux";
import { setAttachments } from "../../redux/MedicalSlice";
import Loader from "../../components/Loader";
import {
  getCurrentDateWithTime,
  getDocumentData,
  getFileData,
} from "../../utils/Utils";
import FontSize from "../../configs/FontSize";
import ImageViewer from "../../components/ImageViewer";
import Spacing from "../../configs/Spacing";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Modal } from "react-native";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { KeyboardAvoidingView } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import Header from "../../components/Header";
import { handleFilesPick } from "../../utils/UploadFiles";
import { useToast } from "../../configs/ToastConfig";

const Notes = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
const {errorToast}=useToast()
  const attachmentData = useSelector((state) => state.medical.attachments);
  const [isLoading, setisLoading] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([...attachmentData.notes]);
  const [images, setImages] = useState([...attachmentData.images]);
  const [documents, setDocuments] = useState([...attachmentData.documents]);
  const [notesVisible, setNotesVisible] = useState(false);
  const modalStyles =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const goback = () => {
    navigation.navigate("AddMedical");
  };
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("AddMedical");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  /**
   * Dispatch note
   */
  const clickFunc = () => {
    goback();
    dispatch(
      setAttachments({ notes: notes, images: images, documents: documents })
    );
  };
  useEffect(() => {
    if (note && note?.charAt(0) == " ") {
      setNote(note?.trimStart());
    }
  }, [note]);
  /**
   * Navigation
   */
  const navigateNextScreen = () => {
    dispatch(
      setAttachments({ notes: notes, images: images, documents: documents })
    );
    navigation.navigate("FollowUpDate");
  };

  const navigatePreviousScreen = () => {
    dispatch(
      setAttachments({ notes: notes, images: images, documents: documents })
    );
    navigation.navigate("LabRequest");
  };

  /**
   * Add Note
   */
  const AddNote = (e) => {
    setNote(e);
  };
  const handleAddNotes = () => {
    setNotes((prevNotes) => [
      {
        name: note,
        date: getCurrentDateWithTime(),
      },
      ...prevNotes,
    ]);
    setNotesVisible(false);
    setNote("");
  };

  const pickImage = async () => {
    // try {
    //   let image = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     // allowsEditing: true,
    //     allowsMultipleSelection: true,
    //     aspect: [4, 3],
    //     quality: 1,
    //   });

    //   if (!image.canceled) {
    //     setImages([
    //       ...images,
    //       ...image?.assets?.map((i) => {
    //         return getFileData({
    //           uri: i.uri,
    //           type: i.type,
    //           name: i.uri.split("/").pop(),
    //         });
    //       }),
    //     ]);
    //   }
    // } catch (err) {
    //   errorToast("Oops!", "Something went wrong!!");
    // }
    setImages(await handleFilesPick(errorToast,"image",setisLoading, images, true));
  };

  const handleDocumentPick = async () => {
    // try {
    //   const result = await DocumentPicker.getDocumentAsync({
    //     type: ["application/pdf", "application/msword"],
    //   });
    //   if (!result.canceled) {
    //     setDocuments([...documents, getDocumentData(result?.assets[0])]);
    //   }
    // } catch (err) {
    //   console.log("Error picking document:", err);
    // }
    setDocuments(await handleFilesPick(errorToast,"doc",setisLoading, documents, true));
  };
  const removeDocuments = (docsName) => {
    const filterData = documents?.filter((item) => {
      if (item?.type == "image/jpeg") {
        return item?.uri != docsName;
      } else {
        return item?.name != docsName;
      }
    });
    setDocuments(filterData);
  };

  const removeImages = (docsName) => {
    const filterData = images?.filter((item) => {
      if (item?.type == "image/jpeg" || item?.type == "image/png") {
        return item?.uri != docsName;
      } else {
        return item?.name != docsName;
      }
    });
    setImages(filterData);
  };

  const toggleNoteModal = () => {
    setNotesVisible(!notesVisible);
    setNote("");
  };

  return (
    <>
      {/* <MedicalHeader title="Attachments & Notes" noIcon={true} /> */}
      <Header
        title={"Attachments & Notes"}
        headerTitle={reduxColors.headerTitle}
        noIcon={true}
        search={false}
        hideMenu={true}
        backgroundColor={constThemeColor?.onPrimary}
        customBack={() => navigation.navigate("AddMedical")}
      />
      <Loader visible={isLoading} />
      <View style={[reduxColors.container]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={reduxColors.scrollContainer}
        >
          <View style={{ marginBottom: Spacing.minor }}>
            {images.length > 0 && (
              <Text
                style={[reduxColors.title, { marginBottom: Spacing.small }]}
              >
                Media
              </Text>
            )}
            <ImageViewer
              data={images}
              horizontal={true}
              imageClose={(item) => removeImages(item?.uri)}
              width={220}
              imgWidth={220}
            />
          </View>

          <View>
            {documents.length > 0 && (
              <Text
                style={[reduxColors.title, { marginBottom: Spacing.small }]}
              >
                Documents
              </Text>
            )}
            {documents?.map((item, index) => {
              return (
                <View
                  key={index.toString()}
                  style={[
                    reduxColors.attachBox,
                    {
                      backgroundColor: constThemeColor.displaybgPrimary,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="picture-as-pdf"
                    size={24}
                    color={constThemeColor.onSurfaceVariant}
                  />
                  <View
                    style={{
                      flex: 1,
                      marginHorizontal: Spacing.small,
                    }}
                  >
                    <Text style={reduxColors.attachText}>
                      {item?.name ?? item?.file_original_name}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={constThemeColor.onSurfaceVariant}
                    onPress={() => removeDocuments(item?.name)}
                  />
                </View>
              );
            })}
          </View>

          <View
            style={{
              flex: 1,
              marginTop: Spacing.minor,
            }}
          >
            {notes?.length > 0 && (
              <Text
                style={[reduxColors.title, { marginBottom: Spacing.small }]}
              >
                Notes
              </Text>
            )}
            {notes?.map((item, index) => {
              return (
                <View
                  style={{
                    backgroundColor: constThemeColor.notes,
                    borderRadius: Spacing.mini,
                    padding: Spacing.body,
                    marginVertical: Spacing.mini,
                    marginBottom:
                      notes?.length - 1 == index ? Spacing.major : Spacing.mini,
                  }}
                  key={index}
                >
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Small.fontSize,
                      fontWeight: FontSize.Antz_Small.fontWeight,
                      color: constThemeColor.notesDate,
                      marginBottom: Spacing.mini,
                    }}
                  >
                    {item?.date}
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Body_Regular.fontSize,
                      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                      color: constThemeColor.onErrorContainer,
                    }}
                  >
                    {item?.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View style={reduxColors.footerUpper}>
          <TouchableOpacity
            style={reduxColors.box}
            onPress={pickImage}
            accessible={true}
            accessibilityLabel={"imagePick"}
            AccessibilityId={"imagePick"}
          >
            <View style={reduxColors.imageWrapper}>
              <FontAwesome
                name="photo"
                size={24}
                color={constThemeColor?.onPrimary}
              />
            </View>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: constThemeColor.neutralPrimary,
              }}
            >
              Add Media
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={reduxColors.box}
            onPress={handleDocumentPick}
            accessible={true}
            accessibilityLabel={"docPick"}
            AccessibilityId={"docPick"}
          >
            <View style={reduxColors.imageWrapper}>
              <MaterialIcons
                name="description"
                size={24}
                color={constThemeColor?.onPrimary}
              />
            </View>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: constThemeColor.neutralPrimary,
              }}
            >
              Add Document
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={reduxColors.box}
            onPress={() => setNotesVisible(!notesVisible)}
            accessible={true}
            accessibilityLabel={"noteAdd"}
            AccessibilityId={"noteAdd"}
          >
            <View style={reduxColors.imageWrapper}>
              <MaterialIcons
                name="notes"
                size={24}
                color={constThemeColor?.onPrimary}
              />
            </View>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: constThemeColor.neutralPrimary,
              }}
            >
              Add Notes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        {/* <View style={{ alignSelf: "flex-end" }}> */}
        <View style={{ width: "100%" }}>
          <Footermedical
            ShowIonicons={true}
            ShowRighticon={true}
            firstlabel={`Test Requested`}
            lastlabel={`Follow Up Date`}
            navigateNextScreen={navigateNextScreen}
            navigatePreviousScreen={navigatePreviousScreen}
            onPress={clickFunc}
          />
        </View>

        {notesVisible ? (
          <Modal
            avoidKeyboard
            animationType="none"
            // transparent={true}
            visible={true}
            style={[
              modalStyles.bottomSheetStyle,
              { backgroundColor: "transparent" },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              style={[
                reduxColors.modalViewContainer,
                { backgroundColor: "transparent" },
              ]}
            >
              <TouchableWithoutFeedback onPress={toggleNoteModal}>
                <View style={[reduxColors.modalOverlay]}>
                  <TouchableWithoutFeedback
                    onPress={() => setNotesVisible(true)}
                  >
                    <View style={[reduxColors.modalContainer]}>
                      <View
                        style={{
                          width: "100%",
                          paddingHorizontal: Spacing.minor,
                        }}
                      >
                        <TextInput
                          editable
                          multiline
                          autoCompleteType="off"
                          placeholder="Type Notes"
                          placeholderTextColor={constThemeColor?.mediumGrey}
                          style={[
                            reduxColors.input,
                            {
                              borderColor: constThemeColor.outlineVariant,
                            },
                          ]}
                          onChangeText={(e) => AddNote(e)}
                          maxLength={500}
                          value={note}
                          numberOfLines={4}
                        />
                      </View>
                      <View
                        style={{
                          backgroundColor: constThemeColor.addBackground,
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ paddingBottom: Spacing.minor }}>
                          <TouchableOpacity
                            disabled={note.length == 0 ? true : null}
                            style={{
                              backgroundColor:
                                note.length == 0
                                  ? constThemeColor.outlineVariant
                                  : constThemeColor.primary,
                              padding: Spacing.micro + Spacing.small,
                              borderRadius: Spacing.small,
                              marginTop:
                                Spacing.mini + Spacing.micro + Spacing.small,
                              width: 100,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onPress={() => handleAddNotes()}
                            accessible={true}
                            accessibilityLabel={"attachmentModal"}
                            AccessibilityId={"attachmentModal"}
                          >
                            <Text style={{ color: constThemeColor.onPrimary }}>
                              Add
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Modal>
        ) : null}
      </View>
    </>
  );
};

export default Notes;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContainer: {
      width: "100%",
      backgroundColor: reduxColors.onPrimary,
      padding: Spacing.minor,
    },
    title: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors?.onSurfaceVariant,
    },
    footerUpper: {
      backgroundColor: reduxColors?.surface,
      paddingVertical: Spacing.minor,
      paddingHorizontal: Spacing.body,
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: "100%",
    },
    imageWrapper: {
      height: 48,
      width: 48,
      borderRadius: 24,
      backgroundColor: reduxColors?.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: Spacing.small,
    },
    box: {
      alignItems: "center",
    },
    attachBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      padding: Spacing.body,
      marginVertical: Spacing.mini,
      backgroundColor: reduxColors.surface,
      borderRadius: Spacing.mini,
    },
    attachText: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      flexWrap: "wrap",
    },
    modalViewContainer: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: Spacing.minor,
      borderTopRightRadius: Spacing.minor,
    },
    input: {
      borderWidth: 1,
      padding: Spacing.body,
      borderColor: reduxColors.outlineVariant,
      width: "100%",
      backgroundColor: reduxColors.notes,
      borderRadius: Spacing.mini + Spacing.micro,
      marginVertical: Spacing.minor,
      textAlignVertical: "top",
      minHeight: 120,
    },
  });
