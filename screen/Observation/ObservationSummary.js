import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  Linking,
  RefreshControl,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Appbar, Divider, FAB } from "react-native-paper";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import SvgUri from "react-native-svg-uri";
import Modal from "react-native-modal";
import { TouchableWithoutFeedback } from "react-native";

import { SvgXml } from "react-native-svg";
import moment from "moment";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
  LengthDecrease,
  ShortFullName,
  contactFun,
  getDocumentData,
  getFileData,
  ifEmptyValue,
  opacityColor,
} from "../../utils/Utils";
import { KeyboardAvoidingView } from "react-native";
import {
  DeleteObservation,
  getObservationDetails,
  observationNote,
} from "../../services/ObservationService";
import Loader from "../../components/Loader";
import flag_priority_low from "../../assets/priroty/flag_priority_low.svg";
import flag_priority_critical from "../../assets/priroty/flag_priority_critical.svg";
import flag_priority_high from "../../assets/priroty/flag_priority_high.svg";
import flag_priority_medium from "../../assets/priroty/flag_priority_medium.svg";
import ImageViewer from "../../components/ImageViewer";
import { setApprover } from "../../redux/AnimalMovementSlice";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import Spacing from "../../configs/Spacing";
import SummaryHeader from "../../components/SummaryHeader";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import Config, { audioType, documentType } from "../../configs/Config";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";
import headingImage from "../../assets/family_home.svg";
import ObservationAnimalCard from "../../components/ObservationAnimalListCard";
import subtypeImage from "../../assets/raven.svg";
import Constants from "../../configs/Constants";
import Gallery from "../../assets/Gallery.svg";
import Documents from "../../assets/Document.svg";
import Doc from "../../assets/Doc.svg";
import Pdf from "../../assets/Pdf.svg";
import Video from "../../assets/Video.svg";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { handleFilesPick } from "../../utils/UploadFiles";
import UserCustomCard from "../../components/UserCustomCard";

const maxFileSizeExceededError = "Can't choose file greater than 25MB";

const ObservationSummary = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const [documentModal, setDocumentModal] = useState(false);
  const [AddComment, setAddComment] = useState(false);
  const [AssignToUser, setAssignToUser] = useState(false);
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const [selectedItems, setSelectedItems] = useState([]);
  const [observationComments, setObservationComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const observRef = useRef(null);
  const [observation_id, setObservation_id] = useState(
    props?.route?.params?.item?.observation_id
  );
  const [assignTo, setAssignTo] = useState(
    props?.route?.params?.item?.assign_to ?? []
  );
  const modalStyles =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  const [comments, setComments] = useState([]);
  const [commentErrorMessage, setCommentErrorMessage] = useState(false);
  const [commentError, setCommentError] = useState(false);

  const [observationData, setObservationData] = useState([]);
  const documents_obj = observationData?.attachments?.filter(
    (value) => value?.file_type?.split("/")[0] != "image"
  );
  const [observationTypeId, setObservationTypeId] = useState(
    props?.route?.params?.item?.child_master_type?.parent_observation_type_id
  );

  const [recording, setRecording] = useState(undefined);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isRecordPlaying, setIsRecordPlaying] = useState(false);
  const [currentPlayingAudioUri, setCurrentPlayingAudioUri] = useState("");
  const [audioPickModal, setAudioPickModal] = useState(false);
  const [recordedSounds, setRecordedSounds] = useState([]);
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});

  const images_Obj = observationData?.attachments
    ?.filter(
      (value) =>
        value?.file_type == "image/jpeg" || value?.file_type == "image/png"
    )
    .map((el) => ({
      id: el.id,
      url: el.file,
    }));
  const [dataRef, setDataRef] = useState(props?.route?.params?.item?.ref_data);
  const [masterTypeData, setMasterTypeData] = useState(
    props?.route?.params?.item?.child_master_type
  );
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const [SelectedAnimal, setSelectedAnimal] = useState([]);
  const [SelectedEnclosure, setSelectedEnclosure] = useState([]);
  const [SelectedSection, setSelectedSection] = useState([]);
  const [scrollComment, setScrollComment] = useState(false);
  const scrollViewRef = useRef(null);
  const [SelectedSite, setSelectedSite] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const checkCommentBool =
  //   props?.route?.params?.boolen
  useEffect(() => {
    const categorizedData = {
      sections: [],
      enclosures: [],
      animals: [],
      sites: [],
    };

    dataRef?.forEach((item) => {
      if (item.type === "section" || item.ref_type == "section") {
        categorizedData.sections.push(item?.sectionData);
      } else if (item.type === "enclosure" || item.ref_type == "enclosure") {
        categorizedData.enclosures.push(item?.enclosureData);
      } else if (item.type === "animal" || item.ref_type == "animal") {
        categorizedData.animals.push(item?.animalData);
      } else if (item.type === "site" || item.ref_type == "site") {
        categorizedData.sites.push(item?.siteData);
      }
    });
    setSelectedSite(
      categorizedData?.sites?.map((a) => {
        return {
          ...a,
          selectType: "site",
        };
      })
    );
    setSelectedSection(
      categorizedData.sections.map((a) => {
        return {
          ...a,
          selectType: "section",
        };
      })
    );
    setSelectedEnclosure(
      categorizedData.enclosures.map((a) => {
        return {
          ...a,
          selectType: "enclosure",
        };
      })
    );
    setSelectedAnimal(
      categorizedData.animals.map((a) => {
        return {
          ...a,
          // group: a?.type,
          selectType: "animal",
        };
      })
    );
  }, [dataRef]);

  const [isPrirotyModalVisible, setPrirotyModalVisible] = useState(false);

  const togglePrirotyModal = () => {
    setPrirotyModalVisible(!isPrirotyModalVisible);
  };

  useEffect(() => {
    setTimeout(() => {
      setAddComment(
        props?.route?.params?.boolen == true
          ? props?.route?.params?.boolen
          : false
      );
    }, Constants.GLOBAL_DIALOG_TIMEOUT_VALUE + Constants.GLOBAL_DIALOG_TIMEOUT_VALUE);
  }, [props?.route?.params?.boolen]);

  useEffect(() => {
    const sub = navigation.addListener("focus", () => {
      setIsLoading(true);
      observationDetails();
    });
    return sub;
  }, [navigation]);

  const observationDetails = () => {
    getObservationDetails({ observation_id: observation_id })
      .then((res) => {
        if (res.success) {
          setDataRef(res?.data?.ref_data);
          setMasterTypeData(res?.data?.child_master_type);
          setObservationTypeId(
            res?.data?.child_master_type?.parent_observation_type_id
          );
          setAssignTo(res.data?.assign_to);
          setComments(res?.data);
          setObservationData(res?.data);
        } else {
          navigation.goBack();
          errorToast("", "Oops!! No data found!!");
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  const toggleAssignUser = () => {
    setAssignToUser(!AssignToUser);
    setDocumentModal(false);
    setAddComment(false);
  };
  const toggleModal = () => {
    setDocumentModal(!documentModal);
    setAddComment(false);
    setAssignToUser(false);
    setObservationComments("");
    setSelectedItems([]);
    setRecordedSounds([]);
  };
  const toggleCommentModal = () => {
    setAddComment(!AddComment);
    setObservationComments("");
    setAssignToUser(false);
    setDocumentModal(false);
  };

  const handleCall = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("tel", phoneNumber);
    }
  };
  const handleMessage = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("sms", phoneNumber);
    }
  };

  const handleDocumentPick = async () => {
    // try {
    //   const result = await DocumentPicker.getDocumentAsync({
    //     type: documentType,
    //   });
    //   let obj = {};
    //   if (result) {
    //     (obj.name = result?.assets[0]?.name),
    //       (obj.type = result?.assets[0]?.mimeType),
    //       (obj.uri = result?.assets[0]?.uri);
    //   }
    //   if (!result.canceled) {
    //     setSelectedItems([...selectedItems, getDocumentData(obj)]);
    //     setRecordedSounds((prev) => [...prev, getDocumentData(obj)]);
    //   }
    // } catch (err) {
    //   console.log("Error picking document:", err);
    // }
    setSelectedItems(
      await handleFilesPick(
        errorToast,
        "doc",
        setIsLoading,
        selectedItems,
        true
      )
    );
  };

  const handleAudioPick = async () => {
    // try {
    //   setIsLoading(true);
    //   const result = await DocumentPicker.getDocumentAsync({
    //     type: audioType,
    //   });
    //   if (!result.canceled) {
    //     if (result.assets[0].size < Constants.MAX_FILE_UPLOAD_VALUE) {
    //       setSelectedItems([
    //         ...selectedItems,
    //         getDocumentData(result?.assets[0]),
    //       ]);
    //       setRecordedSounds((prev) => [
    //         ...prev,
    //         getDocumentData(result?.assets[0]),
    //       ]);

    //       setIsLoading(false);
    //     } else {
    //       showToast("error", "Can't choose file greater than 25MB");
    //       setIsLoading(false);
    //     }
    //   } else {
    //     setIsLoading(false);
    //   }
    // } catch (err) {
    //   setIsLoading(false);
    //   console.log("Error picking document:", err);
    // }
    setSelectedItems(
      await handleFilesPick(
        errorToast,
        "audio",
        setIsLoading,
        selectedItems,
        true
      )
    );
    toggleAudioModalView();
  };

  const handleVideoPick = async () => {
    // try {
    //   setIsLoading(true);
    //   const result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    //   });

    //   if (!result.canceled) {
    //     if (
    //       result?.assets[0]?.filesize != undefined &&
    //       result?.assets[0]?.filesize < Constants.MAX_FILE_UPLOAD_VALUE
    //     ) {
    //       setSelectedItems([...selectedItems, getFileData(result?.assets[0])]);
    //       setRecordedSounds((prev) => [
    //         ...prev,
    //         getFileData(result?.assets[0]),
    //       ]);

    //       setIsLoading(false);
    //     } else if (
    //       result?.assets[0]?.fileSize != undefined &&
    //       result.assets[0].fileSize < Constants.MAX_FILE_UPLOAD_VALUE
    //     ) {
    //       setSelectedItems([...selectedItems, getFileData(result?.assets[0])]);
    //       setRecordedSounds((prev) => [
    //         ...prev,
    //         getFileData(result?.assets[0]),
    //       ]);

    //       setIsLoading(false);
    //     } else {
    //       showToast("error", "Can't choose file greater than 25MB");
    //       setIsLoading(false);
    //     }
    //   } else {
    //     setIsLoading(false);
    //   }
    // } catch (err) {
    //   console.log("Error picking image:", err);
    //   setIsLoading(false);
    // }
    setSelectedItems(
      await handleFilesPick(
        errorToast,
        "video",
        setIsLoading,
        selectedItems,
        true
      )
    );
  };

  const handleImagePick = async () => {
    // try {
    //   const result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     // allowsEditing: true,
    //     quality: 1,
    //   });
    //   if (!result.canceled) {
    //     if (result?.assets[0]?.type == "image") {
    //       if (
    //         result?.assets[0]?.fileSize != undefined &&
    //         result?.assets[0]?.fileSize < Constants.MAX_IMAGE_UPLOAD_SIZE
    //       ) {
    //         setSelectedItems([...selectedItems, getFileData(result.assets[0])]);
    //       } else if (
    //         result?.assets[0]?.filesize != undefined &&
    //         result?.assets[0]?.filesize < Constants.MAX_IMAGE_UPLOAD_SIZE
    //       ) {
    //         setSelectedItems([...selectedItems, getFileData(result.assets[0])]);
    //       } else {
    //         showToast("error", "Can't choose image greater than 5MB");
    //         setIsLoading(false);
    //       }
    //     }
    //   }
    // } catch (err) {
    //   console.log("Error picking image:", err);
    // }
    setSelectedItems(
      await handleFilesPick(
        errorToast,
        "image",
        setIsLoading,
        selectedItems,
        true
      )
    );
  };
  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setSelectedItems([...selectedItems, getFileData(result.assets[0])]);
      }
    } catch (err) {
      console.log("Error picking image:", err);
    }
  };

  const removeDocuments = (docsName) => {
    const filterData = selectedItems?.filter((item) => {
      if (item?.type == "image/jpeg" || item?.type == "image/png") {
        return item?.uri != docsName;
      } else {
        return item?.name != docsName;
      }
    });
    const filterRecordedSoundData = recordedSounds?.filter((item) => {
      if (item?.type == "image/jpeg" || item?.type == "image/png") {
        return item?.uri != docsName;
      } else {
        return item?.name != docsName;
      }
    });
    setSelectedItems(filterData);
    setRecordedSounds(filterRecordedSoundData);
  };
  function extractTextAndExtension(text) {
    if (text?.length >= 1) {
      const first20Chars = text?.slice(0, 20);
      const extensionIndex = text?.lastIndexOf(".");
      const extension =
        extensionIndex !== -1 ? text.slice(extensionIndex + 1).trim() : "";
      if (text?.length < 20) {
        return `${text}`;
      } else {
        return `${first20Chars}.${extension}`;
      }
    } else {
      return "";
    }
  }
  const Validation = () => {
    if (AddComment) {
      if (observationComments.trim() === "") {
        setCommentError(true);
        setCommentErrorMessage("This field is required*");
        return false;
      }
      return true;
    }
    return true;
  };
  const submitCommentsRequest = () => {
    if (Validation()) {
      setIsLoading(true);
      setDocumentModal(false);
      setScrollComment(true);
      setAddComment(false);
      let postData = {
        observation_id: observation_id,
        observation: observationComments,
      };

      observationNote(postData, selectedItems)
        .then((res) => {
          if (res?.success) {
            observationDetails();
            showToast("success", "Comment added successfully");
          } else {
            if (res?.message == "File Size Exceeded") {
              setIsLoading(false);
              showToast(
                "error",
                `${
                  res?.data?.file?.slice(-15) ?? ""
                }, Can't upload file greater than ${
                  Number(res?.data?.max_size ?? 0) / 1024 ?? ""
                }MB`
              );
            } else {
              setIsLoading(false);
              showToast("error", "Oops!! Something went wrong");
            }
          }
        })
        .catch((err) => {
          console.log(err.value);
          showToast("error", "Oops! ,Something went wrong!!");
        })
        .finally((res) => {
          setSelectedItems([]);
          setRecordedSounds([]);
          setObservationComments("");
          setIsLoading(false);
          setScrollComment(false);
        });
    }
  };
  useEffect(() => {
    if (scrollViewRef?.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [scrollComment]);

  const names = assignTo?.map((name) => {
    return name.full_name;
  });

  const [first, ...remaining] = names;

  const openPDF = async (pdfURL) => {
    const supported = await Linking.canOpenURL(pdfURL);

    if (supported) {
      await Linking.openURL(pdfURL);
    } else {
      console.error(`Don't know how to open URL: ${pdfURL}`);
    }
  };

  const configureImageArr = (data) => {
    let arr = data.filter(
      (img) => img?.file_type?.split("/")[0].toLowerCase() == "image"
    );
    arr = arr.map((item) => {
      return {
        id: item?.id,
        url: item?.file,
      };
    });
    return arr;
  };
  const renderOutsideTouchable = (onTouch) => {
    const view = <View style={{ flex: 1, width: "100%" }} />;
    if (!onTouch) return view;
    return (
      <TouchableWithoutFeedback
        onPress={onTouch}
        style={{ flex: 1, width: "100%" }}
      >
        {view}
      </TouchableWithoutFeedback>
    );
  };
  const navigateToEditObservation = (x) => {
    navigation.navigate("EditObservation", {
      selectedAnimal: observationData,
      sectionId: observationData?.ref_details?.section_id,
      animal_id: observationData?.ref_details?.animal_id,
      common_name: observationData?.ref_details?.common_name,
      complete_name: observationData?.ref_details?.complete_name,
      enclosure_id: observationData?.ref_details?.user_enclosure_id,
      local_id: observationData?.ref_details?.local_id,
      scientific_name: observationData?.ref_details?.scientific_name,
      user_section_name: observationData?.ref_details?.user_section_name,
      sex: observationData?.ref_details?.sex,
      user_enclosure_name: observationData?.ref_details?.user_enclosure_name,
      ref_type: observationData?.ref_type,
      local_identifier_value:
        observationData?.ref_details?.local_identifier_value,
      local_identifier_name:
        observationData?.ref_details?.local_identifier_name,
      cameFrom: x ? x : null,
      masterTypeData: masterTypeData,
      SelectedAnimal: SelectedAnimal,
      SelectedSection: SelectedSection,
      SelectedEnclosure: SelectedEnclosure,
      observationTypeId: observationTypeId,
      SelectedSite: SelectedSite,
    });
  };
  // Delete observation api intigration
  const DeleteObservationData = (id) => {
    let obj = {
      observation_id: observationData?.observation_id,
    };
    setIsLoading(true);
    DeleteObservation(obj)
      .then((res) => {
        setIsLoading(false);
        if (res.success) {
          successToast("success", res.message);
          setTimeout(() => {
            navigation.goBack();
          }, 400);
        } else {
          showToast("error", res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        showToast("error", "Oops!!, Something went wrong!!");
      });
  };

  const onRefreshObservation = () => {
    setIsRefreshing(true);
    observationDetails();
  };

  const toggleAudioModalView = () => {
    if (documentModal) setDocumentModal(false);
    else if (!documentModal) setDocumentModal(true);

    setAudioPickModal(!audioPickModal);

    setIsError({ recordAudio: false });
    setErrorMessage({ audio: "" });
  };

  const handleStartRecording = async () => {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const handleStopRecording = async () => {
    console.log("Stopping recording..");
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const { sound, status } = await recording.createNewLoadedSoundAsync();

    const uri = recording.getURI();

    const recordedAudioFile = await FileSystem.getInfoAsync(recording.getURI());
    const recordedAudioFileSizeBytes = recordedAudioFile.size;

    if (recordedAudioFileSizeBytes < Constants.MAX_FILE_UPLOAD_VALUE) {
      // Cant send the sound object to API so to providing play option having a separate state and object
      const fileInfo = {
        name: `recording-${Date.now()}.m4a`,
        type: "audio/m4a",
        uri: uri,
      };
      const fileInfoForPreview = {
        name: `recording-${Date.now()}.m4a`,
        type: "audio/m4a",
        uri: uri,
        sound: sound,
      };

      setRecordedSounds((prev) => [...prev, fileInfoForPreview]);

      setSelectedItems([...selectedItems, fileInfo]);
      setIsError({ recordAudio: false });
      setErrorMessage({ audio: "" });
    } else {
      // setIsError({ recordAudio: true });
      showToast("error", `${maxFileSizeExceededError}`);
      // setErrorMessage({ audio: "Can't choose file greater than 25MB" });
    }
    setRecording(undefined);
    toggleAudioModalView();
    console.log("Recording stopped and stored at", uri);
  };
  const handlePlayRecordedPlay = async (index) => {
    const item = recordedSounds[index];

    if (isRecordPlaying) {
      await handleStopRecordedAudio(item?.sound);
    }
    setIsRecordPlaying(true);
    setCurrentPlayingAudioUri(index);
    item?.sound?.playAsync();
    item?.sound?.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // Sound has finished playing
        console.log("Sound has finished playing");

        handleStopRecordedAudio(item?.sound);
      }
    });
  };
  const handleStopRecordedAudio = async (sound) => {
    await sound.stopAsync();
    setIsRecordPlaying(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader visible={isLoading} />
      <SummaryHeader
        edit={UserId === observationData?.created_by_id ? true : false}
        onPressBack={() => navigation.goBack()}
        onPressEdit={() => {
          if (UserId === observationData?.created_by_id) {
            navigateToEditObservation();
            dispatch(setApprover([]));
          } else {
            warningToast("success", "You are not admin for this observation");
          }
        }}
        created_by_id={observationData?.created_by_id}
        DeleteObservationData={DeleteObservationData}
        delete={true}
        hideMenu={UserId === observationData?.created_by_id ? false : true}
        title={"Note"}
        color={constThemeColor.onSurfaceVariant}
      />
      {observationData?.length != 0 ? (
        <>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: constThemeColor.background,
              marginTop: 0,
              paddingVertical: Spacing.body,
              paddingBottom: Spacing.small,
              paddingLeft: Spacing.minor,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={reduxColors.iconStyle}>
                {/* <SvgXml xml={headingImage} /> */}
                <MaterialCommunityIcons
                  name="note-outline"
                  size={20}
                  color={constThemeColor.onPrimary}
                />
              </View>
              <View style={{ marginLeft: Spacing.small }}>
                <Text style={[reduxColors.Title, {}]}>
                  {masterTypeData?.parent_observation_type}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setPrirotyModalVisible(!isPrirotyModalVisible)}
            >
              <View
                style={[
                  reduxColors.imageView,
                  { marginRight: 0, marginBottom: 4 },
                ]}
              >
                {observationData?.priority === "Low" ? (
                  <SvgXml
                    xml={flag_priority_low}
                    style={{ transform: [{ scaleX: -1 }] }}
                  />
                ) : observationData?.priority === "Moderate" ? (
                  <SvgXml
                    xml={flag_priority_medium}
                    style={{ transform: [{ scaleX: -1 }] }}
                  />
                ) : observationData?.priority === "High" ? (
                  <SvgXml
                    xml={flag_priority_high}
                    style={{ transform: [{ scaleX: -1 }] }}
                  />
                ) : observationData?.priority === "Critical" ? (
                  <SvgXml
                    xml={flag_priority_critical}
                    style={{ transform: [{ scaleX: -1 }] }}
                  />
                ) : (
                  ""
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              flexWrap: "wrap",
              paddingLeft: Spacing.minor,
              backgroundColor: constThemeColor.background,
            }}
          >
            {masterTypeData?.child_observation_type?.map((item) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: opacityColor(
                        constThemeColor.neutralPrimary,
                        5
                      ),
                      borderRadius: Spacing.minor,
                      marginRight: Spacing.small,
                      marginVertical: Spacing.mini,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        // backgroundColor: constThemeColor.onPrimary,
                        borderRadius: Spacing.minor,
                        paddingVertical: Spacing.minor,
                      }}
                    >
                      {/* <SvgXml xml={subtypeImage} /> */}
                    </View>
                    <Text
                      style={{
                        ...FontSize.Antz_Small,
                        marginHorizontal: Spacing.small,
                      }}
                    >
                      {item?.type_name}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View
            style={{
              padding: Spacing.minor,
              paddingTop: Spacing.mini,
              backgroundColor: constThemeColor.background,
              paddingBottom: Spacing.body,
            }}
          >
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Body_Regular.fontSize,
                      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                      color: constThemeColor.onSurfaceVariant,
                      marginRight: widthPercentageToDP(1.5),
                    }}
                  >
                    By
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginRight: heightPercentageToDP(1),
                    backgroundColor: constThemeColor.surfaceVariant,
                    borderRadius: 4,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      marginLeft: widthPercentageToDP(1),
                      alignItems: "center",
                      height: 32,
                    }}
                  >
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color={constThemeColor.onSurfaceVariant}
                    />
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      marginLeft: heightPercentageToDP(1),
                      marginRight: heightPercentageToDP(1),
                    }}
                  >
                    <Text
                      style={{
                        color: constThemeColor.onSurface,
                        fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        fontSize: FontSize.Antz_Minor_Regular.fontSize,
                        textAlign: "center",
                      }}
                    >
                      {/* {observationData?.created_by ?? "NA"} */}
                      {LengthDecrease(22, observationData?.created_by ?? "NA")}
                    </Text>
                  </View>
                </View>

                <>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      backgroundColor: constThemeColor.surfaceVariant,
                      padding: Spacing.mini,
                      borderRadius: 4,
                      height: 32,
                    }}
                    onPress={() =>
                      handleCall(observationData?.created_by_phone)
                    }
                  >
                    <MaterialIcons
                      name="call"
                      size={22}
                      color={constThemeColor.onSurface}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      backgroundColor: constThemeColor.surfaceVariant,
                      marginLeft: widthPercentageToDP(1.5),
                      padding: Spacing.mini,
                      borderRadius: 4,
                      height: 32,
                    }}
                    onPress={() =>
                      handleMessage(observationData?.created_by_phone)
                    }
                  >
                    <MaterialCommunityIcons
                      name="message-text-outline"
                      size={24}
                      color={constThemeColor.onSurface}
                    />
                  </TouchableOpacity>
                </>
              </View>
            </View>
            <View
              style={[reduxColors.DateTimeView, { paddingTop: Spacing.small }]}
            >
              <Text style={reduxColors.timeText}>
                {moment(observationData?.create_date).format("DD MMM YYYY")}
              </Text>
              <Entypo
                name="dot-single"
                size={20}
                color={opacityColor(constThemeColor.neutralPrimary, 50)}
              />
              <Text
                style={[
                  reduxColors.timeText,
                  // { fontWeight: FontSize.Antz_Body_Regular.fontWeight },
                ]}
              >
                {moment(observationData?.create_time, "HH:mm:ss").format(
                  "h:mm A"
                )}
              </Text>
            </View>
          </View>

          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{
              backgroundColor: constThemeColor.onPrimary,
            }}
            ref={scrollViewRef}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefreshObservation}
                style={{ color: constThemeColor.blueBg }}
                enabled={true}
              />
            }
          >
            {SelectedAnimal?.length +
            SelectedEnclosure?.length +
            SelectedSection?.length +
            SelectedSite?.length ? (
              <View style={{ padding: Spacing.minor }}>
                <ObservationAnimalCard
                  outerStyle={[
                    reduxColors.cardContainer,
                    {
                      marginTop: 0,
                      paddingBottom:
                        SelectedAnimal?.length > 0 ||
                        SelectedEnclosure?.length > 0 ||
                        SelectedSection?.length > 0
                          ? 0
                          : null,

                      borderColor: constThemeColor.whiteSmoke,
                    },
                  ]}
                  navigation={() => {}}
                  selectedAnimal={
                    SelectedAnimal?.length > 0 ? SelectedAnimal[0] : null
                  }
                  siteList={SelectedSite ?? []}
                  animalList={SelectedAnimal}
                  enclosureData={SelectedEnclosure}
                  sectionData={SelectedSection}
                  disable={true}
                  deleteFun={() => {}}
                  closeButton={false}
                />
              </View>
            ) : null}
            <View
              style={{
                padding: Spacing.major,
                paddingTop: 0,
              }}
            >
              <View style={[reduxColors.TitleView, { marginBottom: 0 }]}>
                {observationData?.observation_name ? (
                  <Text style={reduxColors.titleText}>Description</Text>
                ) : null}
                <Text style={reduxColors.titleDesc}>
                  {observationData?.observation_name}
                </Text>
                <View>
                  {images_Obj == undefined ? null : (
                    <ImageViewer data={images_Obj} horizontal={true} />
                  )}
                </View>
              </View>
              {documents_obj ? (
                <View style={[reduxColors.TitleView, {}]}>
                  {documents_obj == undefined ? null : (
                    <View>
                      {documents_obj?.map((item) => (
                        <TouchableOpacity onPress={() => openPDF(item?.file)}>
                          <View
                            style={[
                              reduxColors.attachBox,
                              {
                                backgroundColor:
                                  constThemeColor.displaybgPrimary,
                                // margin: widthPercentageToDP(2),
                              },
                            ]}
                          >
                            {item?.type?.split("/")[1] == "pdf" ? (
                              <SvgXml
                                xml={Pdf}
                                width="21"
                                height="21"
                                style={[{ alignSelf: "center" }]}
                              />
                            ) : item?.type?.split("/")[0] == "video" ? (
                              <MaterialCommunityIcons
                                name="file-video-outline"
                                size={26}
                                color={constThemeColor.onSurfaceVariant}
                              />
                            ) : item?.type?.split("/")[0] == "audio" ? (
                              <MaterialCommunityIcons
                                name="music-box-multiple-outline"
                                size={25}
                                color={constThemeColor.onSurfaceVariant}
                              />
                            ) : (
                              <SvgXml
                                xml={Doc}
                                width="21"
                                height="21"
                                style={[{ alignSelf: "center" }]}
                              />
                            )}

                            <View style={{ paddingHorizontal: Spacing.minor }}>
                              <Text
                                style={reduxColors.attachText}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                              >
                                {item?.file_orginal_name
                                  ? extractTextAndExtension(
                                      item?.file_orginal_name
                                    )
                                  : ""}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ) : null}
              <View
                style={[
                  reduxColors.TitleView,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 8,
                    alignItems: "center",
                    marginBottom: 0,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => setAssignToUser(!AssignToUser)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name="account-circle"
                      size={24}
                      color={constThemeColor.primary}
                    />
                    <Text>
                      {/* {first} */}
                      {LengthDecrease(26, first)}
                    </Text>
                    {assignTo.length == 0 && (
                      <Text
                        style={[
                          reduxColors.assignTo,
                          { color: constThemeColor.tertiary, marginLeft: 0 },
                        ]}
                      >
                        {" "}
                        No member Tagged
                      </Text>
                    )}
                    <Text>
                      {" "}
                      {remaining?.length > 0 ? `+${remaining?.length}` : null}
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text style={reduxColors.assignTo}>
                  {comments?.notes?.length} Comments
                </Text>
              </View>
            </View>

            <View style={[reduxColors.TitleView]}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={comments.notes}
                renderItem={({ item }) => {
                  return (
                    <>
                      <Divider bold={true} />

                      <View style={reduxColors.mainCommentView}>
                        {item.observation || item.notes_attachment ? (
                          <View style={reduxColors.commentView}>
                            <View style={reduxColors.commentPerson}>
                              <View
                                style={{
                                  backgroundColor: constThemeColor.secondary,
                                  borderRadius: 20,
                                  height: 30,
                                  width: 30,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {item?.user_profile_pic ? (
                                  <Image
                                    source={{ uri: item?.user_profile_pic }}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: 20,
                                    }}
                                  />
                                ) : (
                                  <View style={{ flexDirection: "row" }}>
                                    <Text
                                      style={{
                                        ...FontSize.Antz_Body_Medium,
                                        color: constThemeColor.onPrimary,
                                      }}
                                    >
                                      {ShortFullName(item?.created_by_name)}
                                    </Text>
                                  </View>
                                )}
                              </View>
                              <Text style={reduxColors.nameText}>
                                {LengthDecrease(25, item?.created_by_name)}
                              </Text>
                            </View>
                            <View
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text style={reduxColors.nameDateTime}>
                                {moment(
                                  item?.created_at?.split(" ").shift()
                                ).format("DD MMMM YYYY")}
                              </Text>
                            </View>
                          </View>
                        ) : null}
                        {item.observation ? (
                          <View style={reduxColors.notesView}>
                            <Text style={reduxColors.notesText}>
                              {item.observation}
                            </Text>
                          </View>
                        ) : null}

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                            marginTop: 8,
                          }}
                        >
                          {item?.notes_attachment && (
                            <ImageViewer
                              data={configureImageArr(item?.notes_attachment)}
                              horizontal={true}
                            />
                          )}
                        </View>

                        <View style={{ marginTop: 4 }}>
                          {item?.notes_attachment?.map((item) => {
                            return (
                              <>
                                {item?.file_type
                                  ?.split("/")[0]
                                  .toLowerCase() !== "image" && (
                                  <TouchableOpacity
                                    onPress={() => openPDF(item.file)}
                                  >
                                    <View
                                      style={[
                                        reduxColors.attachBox,
                                        {
                                          backgroundColor:
                                            constThemeColor.displaybgPrimary,
                                          // margin: widthPercentageToDP(2),
                                        },
                                      ]}
                                    >
                                      <AntDesign
                                        name="file1"
                                        size={24}
                                        color={constThemeColor.onSurfaceVariant}
                                      />
                                      <View
                                        style={{
                                          paddingHorizontal: Spacing.minor,
                                        }}
                                      >
                                        <Text
                                          style={reduxColors.attachText}
                                          numberOfLines={3}
                                          ellipsizeMode="tail"
                                        >
                                          {item?.file_orginal_name
                                            ? extractTextAndExtension(
                                                item?.file_orginal_name
                                              )
                                            : ""}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </>
                            );
                          })}
                        </View>

                        <View style={{ alignItems: "flex-end" }}>
                          <Text
                            style={{
                              fontSize: FontSize.Antz_Small,
                              color: reduxColors.neutralSecondary,
                            }}
                          >
                            {moment(
                              item?.created_at?.split(" ").pop(),
                              "HH:mm:ss"
                            ).format("h:mm A")}
                          </Text>
                        </View>
                      </View>
                    </>
                  );
                }}
                keyExtractor={(item, index) => `item-${index}`}
              />
            </View>
          </ScrollView>

          <FAB.Group
            open={open}
            visible
            fabStyle={reduxColors.fabStyle}
            icon={open ? "close-circle-outline" : "plus-circle-outline"}
            actions={[
              {
                icon: () => (
                  <MaterialCommunityIcons
                    name="message-text-outline"
                    size={24}
                    color={constThemeColor.onSurfaceVariant}
                  />
                ),
                label: "Add Comment",
                onPress: () => setAddComment(!AddComment),
              },
              {
                icon: () => (
                  <Ionicons
                    name="attach-sharp"
                    size={24}
                    color={constThemeColor.onSurfaceVariant}
                  />
                ),
                label: "Add Attachments",
                onPress: () => setDocumentModal(!documentModal),
              },
              {
                icon: "home",
                label: "Go to home",
                onPress: () => navigation.navigate("Home"),
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
              }
            }}
          />
          {documentModal ? (
            <Modal
              avoidKeyboard
              animationType="fade"
              transparent={true}
              visible={true}
              onBackButtonPress={toggleModal}
              onBackdropPress={toggleModal}
              style={[
                modalStyles.bottomSheetStyle,
                {
                  backgroundColor: "transparent",
                },
              ]}
            >
              <TouchableWithoutFeedback onPress={toggleModal}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginBottom: Platform.OS == "ios" && Spacing.body,
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => setDocumentModal(true)}
                  >
                    <View style={[reduxColors.modalContainer]}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          alignSelf: "center",
                          marginLeft: widthPercentageToDP(1),
                          marginTop: 8,
                        }}
                      >
                        {selectedItems
                          .filter(
                            (item) =>
                              item?.type?.split("/")[0].toLowerCase() == "image"
                          )
                          .map((item) => (
                            <TouchableOpacity
                              style={{
                                width: widthPercentageToDP(40),
                                marginBottom: heightPercentageToDP(0.5),
                                margin: Spacing.small + 1,
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
                                  backgroundColor:
                                    constThemeColor.displaybgPrimary,
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
                            </TouchableOpacity>
                          ))}
                      </ScrollView>

                      {selectedItems
                        .filter(
                          (item) =>
                            item?.type?.split("/")[0].toLowerCase() !== "image"
                        )
                        .map((item, index) => (
                          <View
                            style={{
                              marginTop: Spacing.small,
                              width: "90%",
                              alignSelf: "center",
                            }}
                          >
                            <View
                              style={[
                                {
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: 10,
                                  marginBottom: 3,
                                  marginTop: 3,
                                  backgroundColor:
                                    constThemeColor.displaybgPrimary,
                                  margin: widthPercentageToDP(2),
                                },
                              ]}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                {item?.type?.split("/")[1] == "pdf" ? (
                                  <SvgXml
                                    xml={Pdf}
                                    width="21"
                                    height="21"
                                    style={[{ alignSelf: "center" }]}
                                  />
                                ) : item?.type?.split("/")[0] == "video" ? (
                                  <MaterialCommunityIcons
                                    name="file-video-outline"
                                    size={26}
                                    color={constThemeColor.onSurfaceVariant}
                                  />
                                ) : item?.type?.split("/")[0] == "audio" ? (
                                  <MaterialCommunityIcons
                                    name={
                                      isRecordPlaying &&
                                      item?.type == "audio/m4a" &&
                                      currentPlayingAudioUri == index
                                        ? "pause"
                                        : item?.type == "audio/m4a"
                                        ? "play"
                                        : "music-box-multiple-outline"
                                    }
                                    onPress={() =>
                                      isRecordPlaying &&
                                      currentPlayingAudioUri == index
                                        ? handleStopRecordedAudio(
                                            recordedSounds[index]?.sound
                                          )
                                        : item?.type == "audio/m4a"
                                        ? handlePlayRecordedPlay(index)
                                        : null
                                    }
                                    size={25}
                                    color={constThemeColor.onSurfaceVariant}
                                  />
                                ) : (
                                  <SvgXml
                                    xml={Doc}
                                    width="21"
                                    height="21"
                                    style={[{ alignSelf: "center" }]}
                                  />
                                )}
                                <View style={{ marginLeft: 10 }}>
                                  <Text style={reduxColors.attachText}>
                                    {item?.name
                                      ? extractTextAndExtension(item?.name)
                                      : ""}
                                  </Text>
                                </View>
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
                        ))}

                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={10}
                          onPress={takePhoto}
                        >
                          <View style={reduxColors.modalView}>
                            <View style={reduxColors.attachmentView}>
                              <MaterialIcons
                                name="camera-alt"
                                size={24}
                                color={constThemeColor.onPrimary}
                              />
                            </View>
                            <Text style={reduxColors.docsText}>Camera</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={10}
                          onPress={handleImagePick}
                        >
                          <View style={reduxColors.modalView}>
                            <View style={reduxColors.attachmentView}>
                              <SvgXml
                                xml={Gallery}
                                width="21"
                                height="20"
                                style={[{ alignSelf: "center" }]}
                              />
                            </View>
                            <Text style={reduxColors.docsText}>Photo</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={10}
                          onPress={handleVideoPick}
                        >
                          <View style={reduxColors.modalView}>
                            <View style={reduxColors.attachmentView}>
                              <SvgXml
                                xml={Video}
                                width="21"
                                height="20"
                                style={[{ alignSelf: "center" }]}
                              />
                            </View>
                            <Text style={reduxColors.docsText}>Video</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          activeOpacity={10}
                          onPress={toggleAudioModalView}
                        >
                          <View style={reduxColors.modalView}>
                            <View style={reduxColors.attachmentView}>
                              <MaterialCommunityIcons
                                name="microphone"
                                size={27}
                                color={constThemeColor.onPrimary}
                              />
                            </View>
                            <Text style={reduxColors.docsText}>Audio</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          activeOpacity={10}
                          onPress={handleDocumentPick}
                        >
                          <View style={reduxColors.modalView}>
                            <View style={reduxColors.attachmentView}>
                              <SvgXml
                                xml={Documents}
                                width="22"
                                height="21"
                                style={[{ alignSelf: "center" }]}
                              />
                            </View>
                            <Text style={reduxColors.docsText}>Document</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          backgroundColor: constThemeColor.addBackground,
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        {selectedItems.length > 0 ? (
                          <View style={{ padding: 16 }}>
                            <TouchableOpacity
                              style={{
                                backgroundColor: constThemeColor.primary,
                                padding: 10,
                                borderRadius: 8,
                                width: "20%",
                              }}
                              onPress={() => submitCommentsRequest()}
                            >
                              <Text
                                style={{ color: constThemeColor.onPrimary }}
                              >
                                Submit
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          ) : null}
          {AddComment ? (
            <Modal
              avoidKeyboard
              animationType="none"
              transparent={true}
              visible={true}
              style={[
                modalStyles.bottomSheetStyle,
                { backgroundColor: "transparent" },
              ]}
              onBackButtonPress={() => setAddComment(!AddComment)}
              onBackdropPress={() => setAddComment(!AddComment)}
            >
              <KeyboardAvoidingView
                // behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[
                  reduxColors.container,
                  { backgroundColor: "transparent" },
                ]}
              >
                <TouchableWithoutFeedback onPress={toggleCommentModal}>
                  <View style={[reduxColors.modalOverlay]}>
                    <TouchableWithoutFeedback
                      onPress={() => setAddComment(true)}
                    >
                      <View style={[reduxColors.modalContainer]}>
                        <TextInput
                          style={[
                            reduxColors.input,
                            {
                              borderColor: commentError
                                ? constThemeColor.error
                                : constThemeColor.outlineVariant,
                              marginBottom: commentError
                                ? Spacing.micro
                                : Spacing.major,
                            },
                          ]}
                          placeholder="Add Comment"
                          multiline={true}
                          refs={observRef}
                          value={observationComments}
                          keyboardType={
                            Platform.OS === "ios"
                              ? "ascii-capable"
                              : "email-address"
                          }
                          autoFocus={false}
                          onChangeText={(value) => {
                            const regex =
                              /^[a-zA-Z0-9!@#\$%\^&\*\(\)_\-/ \+=\{\}\[\];:\'",<>\.\?~`|\\°∠√∛∜∫∬∭∮∯∰∱∲∳≈≡≠≤≥∅∞±×÷∆∂∇∑∏∐∓√∛∜∝∞∟∠∡∢∣∥∦∧∨∩∪∫∬∭∮∯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿≀≁≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≢≣≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳≴≵≶≷≸≹≺≻≼≽≾≿⊀⊁⊂⊃⊄⊅⊆⊇⊈⊉⊊⊋⊌⊍⊎⊏⊐⊑⊒⊓⊔⊕⊖⊗⊘⊙⊚⊛⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯⊰⊱⊲⊳⊴⊵⊶⊷⊸⊹⊺⊻⊼⊽⊾⊿]*$/;
                            if (regex.test(value)) {
                              setObservationComments(value);
                              setCommentError(false);
                            }
                          }}
                        />
                        {commentError && (
                          <View style={reduxColors.errorStyle}>
                            <Text style={{ color: constThemeColor?.error }}>
                              {commentErrorMessage}
                            </Text>
                          </View>
                        )}
                        <View
                          style={{
                            backgroundColor: constThemeColor.addBackground,
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <View style={{ paddingBottom: 15 }}>
                            <TouchableOpacity
                              style={{
                                backgroundColor: constThemeColor.primary,
                                padding: 10,
                                borderRadius: 8,
                                marginTop: 14,
                              }}
                              onPress={() => submitCommentsRequest()}
                            >
                              <Text
                                style={{ color: constThemeColor.onPrimary }}
                              >
                                Submit
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
          {AssignToUser ? (
            <Modal
              avoidKeyboard
              animationType="fade"
              transparent={true}
              visible={AssignToUser}
              style={[
                modalStyles.bottomSheetStyle,
                { backgroundColor: "transparent" },
              ]}
              onBackButtonPress={() => setAssignToUser(!AssignToUser)}
              onBackdropPress={() => setAssignToUser(!AssignToUser)}
            >
              <View style={[reduxColors.modalOverlay]}>
                {renderOutsideTouchable(toggleAssignUser)}
                <View
                  style={[
                    reduxColors.modalContainer,
                    {
                      minHeight: heightPercentageToDP(10),
                      maxHeight: heightPercentageToDP(60),
                    },
                  ]}
                >
                  <View style={reduxColors.modalHeader}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons
                        name="account-circle"
                        size={24}
                        color={constThemeColor.onSurfaceVariant}
                      />
                      <Text style={reduxColors.assignTo}>
                        {observationData?.assign_to?.length ?? 0}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={reduxColors.closeBtn}
                      onPress={() => {
                        if (UserId === observationData?.created_by_id) {
                          navigateToEditObservation(true);
                          setAssignToUser(false); // Close the modal
                        } else {
                          // warningToast(
                          //   "You are not admin for this observation"
                          // );
                          setAssignToUser(false);
                          showToast(
                            "warning",
                            "Access Denied: This note belongs to another user."
                          );
                        }
                      }}
                    >
                      <Ionicons
                        name="person-add"
                        size={22}
                        color={constThemeColor.primary}
                      />
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    style={{ paddingBottom: Spacing.minor }}
                    showsVerticalScrollIndicator={false}
                  >
                    {observationData?.assign_to?.map((item) => {
                      return (
                          <UserCustomCard
                            selectedStyle={{
                              flexDirection: "row",
                              width: widthPercentageToDP(85),
                              borderWidth: 1,
                              borderColor: constThemeColor.outlineVariant,
                              borderRadius: 8,
                              marginVertical: 5,
                            }}
                            item={{
                              ...item,
                              user_name: item.full_name,
                            }}
                          />
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          ) : null}
          {audioPickModal ? (
            <Modal
              onBackdropPress={toggleAudioModalView}
              onRequestClose={toggleAudioModalView}
              visible={true}
              avoidKeyboard
              animationType="fade"
              onDismiss={toggleAudioModalView}
              style={[
                modalStyles.bottomSheetStyle,
                { backgroundColor: "transparent" },
              ]}
            >
              <TouchableWithoutFeedback onPress={toggleAudioModalView}>
                <View style={[reduxColors.modalOverlay]}>
                  <View style={reduxColors.modalContainer}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <TouchableWithoutFeedback onPress={handleAudioPick}>
                        <View style={reduxColors.modalView}>
                          <View
                            style={{
                              backgroundColor: constThemeColor.secondary,
                              height: 50,
                              width: 50,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 25,
                              marginRight: Spacing.body,
                            }}
                          >
                            <FontAwesome5
                              name="file-audio"
                              size={24}
                              color={constThemeColor.onPrimary}
                            />
                          </View>
                          <Text
                            style={[
                              reduxColors.docsText,
                              { marginRight: Spacing.body },
                            ]}
                          >
                            Pick Audio
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback
                        onPress={
                          recording == undefined
                            ? handleStartRecording
                            : handleStopRecording
                        }
                      >
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
                            <MaterialCommunityIcons
                              name={
                                recording !== undefined ? "stop" : "record-rec"
                              }
                              size={24}
                              color={constThemeColor.onPrimary}
                            />
                          </View>
                          <Text style={reduxColors.docsText}>
                            {recording !== undefined
                              ? "Stop Recoding"
                              : "Record Audio"}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                    {isError?.audioPick || isError?.recordAudio ? (
                      <Text
                        style={{
                          color: constThemeColor.error,
                          fontSize: FontSize.Antz_errMsz,
                          marginTop: Spacing.small,
                        }}
                      >
                        {errorMessage?.audio}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          ) : null}
        </>
      ) : (
        <ListEmpty
          height={"50%"}
          label={"No Notes data found"}
          visible={isLoading}
        />
      )}
      <Modal
        isVisible={isPrirotyModalVisible}
        style={reduxColors.modal}
        onBackButtonPress={() => setPrirotyModalVisible(!isPrirotyModalVisible)}
        onBackdropPress={() => setPrirotyModalVisible(!isPrirotyModalVisible)}
        propagateSwipe={true}
        hideModalContentWhileAnimating={true}
        swipeThreshold={90}
        swipeDirection={"down"}
        animationInTiming={400}
        animationOutTiming={100}
        useNativeDriver={true}
      >
        <View
          style={[
            reduxColors.modalContent,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          {observationData?.priority === "Low" ? (
            <SvgXml xml={flag_priority_low} />
          ) : observationData?.priority === "Moderate" ? (
            <SvgXml xml={flag_priority_medium} />
          ) : observationData?.priority === "High" ? (
            <SvgXml xml={flag_priority_high} />
          ) : observationData?.priority === "Critical" ? (
            <SvgXml xml={flag_priority_critical} />
          ) : (
            ""
          )}
          <View>
            {observationData?.priority === "Low" ? (
              <Text style={reduxColors.modalText}>Low Priority Note</Text>
            ) : observationData?.priority === "Moderate" ? (
              <Text style={reduxColors.modalText}>Moderate Priority Note</Text>
            ) : observationData?.priority === "High" ? (
              <Text style={reduxColors.modalText}>High Priority Note</Text>
            ) : observationData?.priority === "Critical" ? (
              <Text style={reduxColors.modalText}>Critical Priority Note</Text>
            ) : (
              ""
            )}
          </View>
        </View>
        <TouchableOpacity onPress={togglePrirotyModal}>
          <Text>Close Modal</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ObservationSummary;
// STYLES STARTS FROM HERE
const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    priroty: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onPrimaryContainer,
      paddingBottom: 0,
    },
    Title: {
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    DateTimeView: {
      display: "flex",
      flexDirection: "row",
    },
    timeText: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      // fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      // marginRight: 8,
    },
    TitleView: {
      marginBottom: 8,
    },
    titleText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    titleDesc: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onPrimaryContainer,
      paddingTop: 5,
    },
    secondViewTitleText: {
      fontStyle: "normal",
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      color: reduxColors.onSurfaceVariant,
      width: widthPercentageToDP(60),
    },
    image: {
      height: heightPercentageToDP(5),
      color: reduxColors.onPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
    mainCommentView: {
      padding: Spacing.major,
      paddingTop: Spacing.minor,
    },
    commentView: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    commentPerson: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    nameText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      left: 10,
    },
    nameDateTime: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onTertiaryContainer,
    },
    notesView: {
      backgroundColor: reduxColors.notes,
      marginVertical: 5,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    notesText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onErrorContainer,
    },
    modalOverlay: {
      flex: 1,
      // height: heightPercentageToDP(100),
      // width: widthPercentageToDP("100%"),
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
      // alignSelf: "center",
      marginBottom: Platform.OS == "ios" && Spacing.body,
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
      padding: Spacing.small,
    },
    attachmentView: {
      backgroundColor: reduxColors.secondary,
      height: 50,
      width: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 40,
    },
    docsText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    input: {
      // marginTop: 12,
      borderWidth: 1,
      padding: 12,
      borderColor: reduxColors.outlineVariant,
      width: "90%",
      backgroundColor: reduxColors.notes,
      borderRadius: 5,
      marginTop: Spacing.major,
    },
    errorStyle: {
      textAlign: "left",
      width: "100%",
      paddingLeft: widthPercentageToDP(5),
      marginBottom: Spacing.mini,
    },
    attatchmentViewinner: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    attatchmentView: {
      backgroundColor: reduxColors.surface,
      borderWidth: 1,
      borderColor: reduxColors.outline,
      borderRadius: 4,
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 10,
    },
    attatcDocs: {
      width: "89.5%",
      borderWidth: 1,
      borderColor: reduxColors.outline,
      borderRadius: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
    },
    assignTo: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSecondaryContainer,
      marginLeft: 5,
    },
    modalHeader: {
      height: heightPercentageToDP(8),
      width: widthPercentageToDP(85),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    attachBox: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginBottom: 3,
      marginTop: 3,
      backgroundColor: reduxColors.surface,
    },
    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondaryContainer,
      marginRight: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.errorContainer,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginHorizontal: widthPercentageToDP(0.5),
    },
    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.displaybgPrimary,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    indeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.indertermineChip,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    malechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    undeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    indeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    cardContainer: {
      borderWidth: 1,
      borderColor: reduxColors.whiteSmoke,
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.surface,
      marginVertical: Spacing.mini,
    },
    iconStyle: {
      height: 30,
      width: 30,
      borderRadius: Spacing.mini,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: reduxColors.onPrimaryContainer,
      marginHorizontal: Spacing.mini,
    },
    modal: {
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: reduxColors.onPrimary,
      padding: 22,

      borderRadius: 4,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    modalText: {
      ...FontSize.Antz_Minor_Medium,
      color: reduxColors.onSurfaceVariant,
      paddingHorizontal: Spacing.small,
    },
  });
