/**
 * @React Imports
 */
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
} from "react-native";

/**
 * @Expo Imports
 */
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

/**
 * @Redux Imports
 */
import { useDispatch, useSelector } from "react-redux";
import {
  removeAnimalMovementData,
  setApprover,
} from "../../redux/AnimalMovementSlice";

/**
 * @Component Imports
 */
import InputBox from "../../components/InputBox";
import CustomForm from "../../components/CustomForm";
import Category from "../../components/DropDownBox";
import Loader from "../../components/Loader";
import InchargeCard from "../../components/InchargeCard";
import AnimalCustomCard from "../../components/AnimalCustomCard";

/**
 * @Third Party Imports
 */
import Modal from "react-native-modal";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";

/**
 * @Config Imports
 */
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import Config, { audioType, documentType } from "../../configs/Config";

/**
 * @Utils Imports
 */
import {
  getDocumentData,
  getFileData,
  getFileInfo,
  ifEmptyValue,
  isLessThanTheMB,
} from "../../utils/Utils";

/**
 * @Assets Imports
 */
import low from "../../assets/priroty/low.svg";
import moderate from "../../assets/priroty/modrate.svg";
import high from "../../assets/priroty/high.svg";
import icon_priority_critical from "../../assets/priroty/icon_priority_critical.svg";
import icon_priority_low_filled from "../../assets/priroty/icon_priority_low_filled.svg";
import icon_priority_high_filled from "../../assets/priroty/icon_priority_high_filled.svg";
import icon_priority_medium_filled from "../../assets/priroty/icon_priority_medium_filled.svg";
import icon_priority_critical_filled from "../../assets/priroty/icon_priority_critical_filled.svg";
import Gallery from "../../assets/Gallery.svg";
import Doc from "../../assets/Doc.svg";
import Pdf from "../../assets/Pdf.svg";
import Video from "../../assets/Video.svg";
import Documents from "../../assets/Document.svg";
/**
 * @API Imports
 */
import {
  getObservationListforAdd,
  EditObservationData,
  EditObservationDatav2,
} from "../../services/ObservationService";
import { useToast } from "../../configs/ToastConfig";
import { Divider, Checkbox } from "react-native-paper";
import MedicalAnimalCard from "../../components/MedicalAnimalCard";
import ObservationAnimalCard from "../../components/ObservationAnimalListCard";
import InchargeObservationCard from "./InchargeObservationCard";
import Constants from "../../configs/Constants";
import Switch from "../../components/Switch";

import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
// import { errorToast } from "../../utils/Alert";
import { handleFilesPick } from "../../utils/UploadFiles";

const EditObservation = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const { height, width } = useWindowDimensions();
  const [documentModal, setDocumentModal] = useState(false);
  const navigation = useNavigation();
  const [extraData, setExtraData] = useState([]);
  const [isError, setIsError] = useState({});
  const [checked, setChecked] = useState(
    props.route.params?.selectedAnimal?.assign_to.length > 0 ||
      props.route.params?.cameFrom == true
      ? 1
      : 0
  );
  const { showToast, errorToast } = useToast();

  const [recording, setRecording] = useState(undefined);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isRecordPlaying, setIsRecordPlaying] = useState(false);
  const [isPlayingUploadedUri, setIsPlayingUploadedUri] = useState(false);
  const [currentPlayingAudioUri, setCurrentPlayingAudioUri] = useState("");
  const [audioPickModal, setAudioPickModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState({});
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [observationData, setObservationData] = useState("");
  const [observationTypeID, setObservationTypeID] = useState(
    props.route.params?.selectedAnimal?.observation_type_id ?? ""
  );
  const [SelectedAnimal] = useState(
    props.route.params?.SelectedAnimal?.map((a) => {
      return {
        ...a,
        selectType: "animal",
      };
    })
  );
  const [SelectedSite] = useState(
    props.route.params?.SelectedSite?.map((a) => {
      return {
        ...a,
        selectType: "site",
      };
    })
  );

  const [SelectedSection] = useState(
    props.route.params?.SelectedSection?.map((a) => {
      return {
        ...a,
        selectType: "section",
      };
    })
  );
  const [SelectedEnclosure] = useState(
    props.route.params?.SelectedEnclosure?.map((a) => {
      return {
        ...a,
        selectType: "enclosure",
      };
    })
  );
  const [masterTypeData] = useState(props.route.params?.masterTypeData);
  const [isLoading, setIsLoading] = useState(false);
  const [observationTypeMenuOpen, setObservationTypeMenuOpen] = useState(false);
  const observRef = useRef(null);
  const [selectedImage, setselectedImage] = useState([]);
  const [paramdata, setParamdata] = useState(null);
  const [attach, setAttach] = useState(null);
  const dispatch = useDispatch();
  const [observationType, setObservationType] = useState(
    props.route.params?.selectedAnimal?.type_name ?? []
  );
  const [observationDescription, setObservationDescription] = useState(
    props.route.params?.selectedAnimal?.observation_name ?? []
  );
  const [assign, setAssign] = useState(
    props.route.params?.selectedAnimal?.assign_to ?? []
  );
  const [selectedUserData, setSelectedUserData] = useState(
    props.route.params?.selectedAnimal?.assign_to ?? []
  );
  const [selectedItems, setSelectedItems] = useState(
    props.route.params?.selectedAnimal?.attachments ?? []
  );
  // Filter out images from selectedAnimal.attachments to be used for sounds.
  // Since images and sounds have different UI representations, their indices
  // are managed separately to ensure correct rendering.
  const filteredAttachments =
    props.route.params?.selectedAnimal?.attachments?.filter((item) =>
      item?.file_type
        ? !(item?.file_type === "image/jpeg" || item?.file_type === "image/png")
        : !(item?.type === "image/jpeg" || item?.type === "image/png")
    );
  const [recordedSounds, setRecordedSounds] = useState(
    filteredAttachments ?? []
  );

  const [priority, setPriority] = useState(
    props.route.params?.selectedAnimal?.priority ?? ""
  );
  const [inchargeId, setInchargeId] = useState([]);
  const [inchargeData, setInchargeData] = useState(
    props.route.params?.selectedAnimal?.assign_to?.map((incharge) => {
      return {
        user_id: incharge?.user_id,
        user_name: incharge?.full_name,
        user_profile_pic: incharge?.user_profile_pic,
        role_name: incharge?.role_name,
      };
    }) ?? []
  );
  const approver = useSelector((state) =>
    Object.keys(state.AnimalMove.approver).length > 0
      ? state.AnimalMove.approver
      : []
  );
  const observationTypeId = props.route.params?.observationTypeId;
  useEffect(() => {
    if (approver?.length > 0) {
      setInchargeData(approver);
      setIsError({});
      setErrorMessage({});
    }
  }, [JSON.stringify(approver)]);

  const deleteApprover = (id) => {
    const filter = inchargeData?.filter((p) => p?.user_id != id);
    setInchargeData(filter);
    dispatch(setApprover(filter));
  };

  useEffect(() => {
    setParamdata(props.route.params);
    if (props.route.params?.cameFrom) {
      navigation.navigate("AssignTo", {
        data: inchargeData,
        selectedItemsType: extraData.selectedItemsType,
        selectedTypeIds: observationTypeId,
      });
    }
  }, [props.route.params]);

  useEffect(() => {
    const attachment = selectedItems?.map((item) => {
      return item?.data?.uri;
    });
    setAttach(attachment);
  }, [selectedItems]);

  useEffect(() => {
    const attachment = selectedItems?.map((item) => {
      return {
        name: item.file_orginal_name,
        type: item.file_type,
        uri: item.file,
      };
    });
    setSelectedItems(attachment);
    setIsLoading(true);
    getObservationListforAdd()
      .then((v) => {
        const transformedData = v.data.map((item) => {
          return { id: item.id, isSelect: false, name: item.type_name };
        });
        setObservationData(transformedData);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log("error", e);
        setIsLoading(false);
      });
  }, []);

  const handleCheckboxToggle = () => {
    setChecked(checked == 0 ? 1 : 0);
  };

  useEffect(() => {
    const transformedData = selectedUserData
      ?.map((item) => item.user_id)
      .join(",");
    setAssign(transformedData);
  }, [selectedUserData]);

  const observClose = () => {
    setObservationTypeMenuOpen(false);
  };
  const observPressed = (item) => {
    setObservationTypeMenuOpen(!observationTypeMenuOpen);
    setObservationType(item.map((value) => value.name).join(","));
    setObservationTypeID(item.map((value) => value.id).join(","));
  };
  const SetobservDown = () => {
    setObservationTypeMenuOpen(!observationTypeMenuOpen);
  };

  const toggleModal = () => {
    setDocumentModal(!documentModal);
  };
  const toggleAudioModalView = () => {
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
      setIsError({ recordAudio: true });
      setErrorMessage({ audio: "Can't choose file greater than 25MB" });
    }
    setRecording(undefined);
    toggleAudioModalView();
    console.log("Recording stopped and stored at", uri);
  };

  const handlePlayRecordedAudio = async (index) => {
    const item = recordedSounds[index];

    if (isRecordPlaying) {
      await handleStopRecordedAudio(item?.sound);
    }
    setIsRecordPlaying(true);
    setCurrentPlayingAudioUri(index);
    item?.sound?.replayAsync();
    item?.sound?.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // Sound has finished playing
        console.log("Sound has finished playing");
        // setIsRecordPlaying(false);
        handleStopRecordedAudio(item?.sound);
      }
    });
  };
  const handleStopRecordedAudio = async (sound) => {
    await sound.stopAsync();
    setIsRecordPlaying(false);
  };

  const handleDocumentPick = async () => {
    setSelectedItems(
      await handleFilesPick(
        errorToast,
        "doc",
        setIsLoading,
        selectedItems,
        true
      )
    );
    setDocumentModal(false);
  };

  const handleAudioPick = async () => {
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
    setSelectedItems(
      await handleFilesPick(
        errorToast,
        "image",
        setIsLoading,
        selectedItems,
        true
      )
    );
    setDocumentModal(false);
  };

  const removeDocuments = (docsName) => {
    const filterData = selectedItems?.filter((item) => {
      if (
        item?.type == "image/jpeg" ||
        item?.file_type == "image/jpeg" ||
        item?.type == "image/png"
      ) {
        return item?.uri ? item?.uri != docsName : item?.file != docsName;
      } else {
        return (item?.name || item?.file_orginal_name) != docsName;
      }
    });
    const filterRecordedData = recordedSounds?.filter((item) => {
      if (
        item?.type == "image/jpeg" ||
        item?.file_type == "image/jpeg" ||
        item?.type == "image/png"
      ) {
        return item?.uri ? item?.uri != docsName : item?.file != docsName;
      } else {
        return (item?.name || item?.file_orginal_name) != docsName;
      }
    });
    setSelectedItems(filterData);
    setRecordedSounds(filterRecordedData);
  };

  const imageData = [
    {
      id: 1,
      low: low,
      lowColor: icon_priority_low_filled,
      name: "Low",
    },
    {
      id: 2,
      low: moderate,
      lowColor: icon_priority_medium_filled,
      name: "Moderate",
    },
    {
      id: 3,
      low: high,
      lowColor: icon_priority_high_filled,
      name: "High",
    },
    {
      id: 4,
      low: icon_priority_critical,
      lowColor: icon_priority_critical_filled,
      name: "Critical",
    },
  ];

  const isSelectedId = (item) => {
    if (selectedImage?.length > 0) {
      return selectedImage.includes(item?.id);
    } else {
      return item?.name == props?.route?.params?.selectedAnimal?.priority;
    }
  };
  const onValueChacked = (id) => {
    if (isSelectedId(id)) {
      setselectedImage(selectedImage.filter((item) => item !== id));
    } else {
      setselectedImage([selectedImage, id]);
    }
  };
  const validation = () => {
    // if (observationType?.trim()?.length === 0) {
    //   setIsError({ observationType: true });
    //   setErrorMessage({ observationType: "This field is required" });
    //   return false;
    // } else if (observationDescription?.trim()?.length === 0) {
    //   setIsError({ observationDescription: true });
    //   setErrorMessage({ observationDescription: "This field is required" });
    //   return false;
    if (checked == 1 && inchargeData.length === 0) {
      setIsError({ assign: true });
      setErrorMessage({ assign: "This field is required" });
      return false;
    } else if (
      selectedItems?.map(
        (i) => i?.type == "image/jpeg" || i?.type == "image/png"
      )?.length > 20
    ) {
      showToast("error", "Select upto 20 photos");
      return false;
    }

    return true;
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setSelectedItems([...selectedItems, getFileData(result.assets[0])]);
      }
    } catch (err) {
      console.error("Error picking image:", err);
    }
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
  const readableBytes = (bytes) => {
    let i = Math.floor(Math?.log(bytes) / Math?.log(1024)),
      sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    return (bytes / Math?.pow(1024, i)).toFixed(2) * 1 + " " + sizes[i];
  };
  const editSubmit = () => {
    if (validation()) {
      let obj = {
        observation_id: props.route.params?.selectedAnimal?.observation_id,
        observation_name: observationDescription,
        priority: priority,
        observation_type_id: JSON.stringify(
          masterTypeData?.child_observation_type.map((i) => i.child_id)
        ),
      };
      if (checked == 1) {
        obj.assign_to = inchargeData?.map((i) => i?.user_id).join(",");
      }
      setIsLoading(true);
      EditObservationDatav2(obj, selectedItems)
        .then((res) => {
          if (res.success) {
            dispatch(removeAnimalMovementData());
            showToast("success", "Note edited successfully");
            navigation.goBack();
          } else {
            // errorToast("Oops!!", JSON.stringify(res.message));
            if (res?.message == "File Size Exceeded") {
              showToast(
                "error",
                `${
                  res?.data?.file?.slice(-15) ?? ""
                }, Can't upload file greater than ${
                  // Number(res?.data?.max_size ?? 0) / 1024*1024 ?? ""
                  readableBytes(Number(res?.data?.max_size ?? 0))
                }`
              );
            } else {
              showToast("error", "Oops!! Something went wrong");
            }
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log({ err });
          showToast("error", "Oops!! Something went wrong");
          setIsLoading(false);
        });
    }
  };

  const renderItem = ({ item }) => (
    <View
      key={item.id}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: Spacing.mini,
      }}
    >
      <Feather name="check" size={18} color={constThemeColor.primary} />
      <Text style={{ paddingHorizontal: Spacing.body - Spacing.micro }}>
        {item.type_name}
      </Text>
    </View>
  );
  return (
    <>
      <CustomForm
        header={true}
        title={"Edit Note"}
        onPress={editSubmit}
        paddingBottom={20}
      >
        <Loader visible={isLoading} />

        <ScrollView>
          <View
            style={{
              borderWidth: 1,
              borderColor: constThemeColor.outlineVariant,
              borderRadius: 4,
              marginTop: Spacing.body,
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.displaybgPrimary,
                borderRadius: Spacing.mini,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: Spacing.body,
                }}
              >
                <Text
                  style={[
                    {
                      color: constThemeColor.onPrimaryContainer,
                      fontSize: FontSize.Antz_Minor_Regular.fontSize,
                      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                    },
                  ]}
                >
                  Note type
                </Text>
              </View>
            </View>
            <Divider bold />
            <View
              style={{
                paddingLeft: Spacing.minor + Spacing.mini,
                paddingTop: Spacing.mini,
                paddingBottom: Spacing.small,
                paddingRight: Spacing.minor,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    ...FontSize.Antz_Minor_Title,
                    color: constThemeColor.onSurfaceVariant,
                  }}
                >
                  {masterTypeData?.parent_observation_type}
                </Text>
                <View
                  style={{
                    paddingTop: Spacing.small,
                  }}
                ></View>
              </View>

              <FlatList
                showsVerticalScrollIndicator={false}
                data={masterTypeData?.child_observation_type}
                renderItem={renderItem}
                keyExtractor={(item, index) => `label-${index}`}
              />
            </View>
          </View>
          <View style={reduxColors.genralDescription}>
            <InputBox
              inputLabel={"Enter Note"}
              placeholder={"Enter Note"}
              value={observationDescription}
              autoFocus={false}
              onChange={(value) => {
                setObservationDescription(value);
              }}
              errors={errorMessage.observation}
              isError={
                observationDescription?.length > 0
                  ? null
                  : isError.observationDescription
              }
              multiline={true}
              numberOfLines={4}
            />
          </View>

          <View style={{ marginVertical: 8 }}>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: Spacing.minor,
                backgroundColor:
                  inchargeData?.length > 0
                    ? constThemeColor.displaybgPrimary
                    : constThemeColor.surface,
                borderTopLeftRadius: Spacing.mini,
                borderTopRightRadius: Spacing.mini,
                borderTopWidth:
                  inchargeData?.length > 0 || isError.assign ? 1 : 1,
                borderColor: isError.assign
                  ? constThemeColor.error
                  : constThemeColor.outline,

                borderLeftWidth:
                  inchargeData?.length > 0 || isError.assign ? 1 : 1,
                borderColor: isError.assign
                  ? constThemeColor.error
                  : constThemeColor.outline,

                borderRightWidth:
                  inchargeData?.length > 0 || isError.assign ? 1 : 1,
                borderColor: isError.assign
                  ? constThemeColor.error
                  : constThemeColor.outline,
                borderBottomWidth: checked != 1 ? 1 : 0,
                borderBottomLeftRadius: checked != 1 ? 5 : 0,
                borderBottomRightRadius: checked != 1 ? 5 : 0,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginLeft: Spacing?.micro,
                }}
              >
                <FontAwesome6
                  name="user"
                  size={21}
                  color={constThemeColor.OnPrimaryContainer}
                />
                <Text
                  style={[
                    {
                      color: constThemeColor.OnPrimaryContainer,
                      fontSize: FontSize.Antz_Minor_Regular.fontSize,
                      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                      marginLeft: Spacing.body,
                    },
                  ]}
                >
                  Notify members
                </Text>
              </View>

              <Switch
                handleToggle={handleCheckboxToggle}
                active={
                  checked == 1 || props.route.params?.cameFrom == true
                    ? true
                    : false
                }
              />
            </View>
            {checked == 1 ? (
              <View>
                <InchargeObservationCard
                  icontrue={true}
                  navigation={() =>
                    navigation.navigate("AssignTo", {
                      data: inchargeData,
                      selectedItemsType: extraData.selectedItemsType,
                      selectedTypeIds: observationTypeId,
                    })
                  }
                  title={
                    inchargeData.length > 0
                      ? // ? `${inchargeData.length} Add members to be notified`
                        // : "Add members to be notified"
                        `${inchargeData?.length} Members to be notified`
                      : "Add members to be notified"
                  }
                  selectedUserData={inchargeData}
                  removeAsign={(item) => deleteApprover(item?.user_id)}
                  outerStyle={{
                    borderBottomWidth:
                      inchargeData?.length > 0 || isError.assign ? 1 : 1,
                    borderColor: isError.assign
                      ? constThemeColor.error
                      : constThemeColor.outline,

                    borderLeftWidth:
                      inchargeData?.length > 0 || isError.assign ? 1 : 1,
                    borderColor: isError.assign
                      ? constThemeColor.error
                      : constThemeColor.outline,

                    borderRightWidth:
                      inchargeData?.length > 0 || isError.assign ? 1 : 1,
                    borderColor: isError.assign
                      ? constThemeColor.error
                      : constThemeColor.outline,
                    borderTopWidth:
                      inchargeData?.length > 0 || isError.assign ? 1 : 1,
                    borderColor: isError.assign
                      ? constThemeColor.error
                      : constThemeColor.outline,
                    borderBottomRightRadius: Spacing.mini,
                    borderBottomLeftRadius: Spacing.mini,
                    // borderRadius: 5,
                  }}
                />
                {isError.assign && (
                  <Text
                    style={{
                      color: constThemeColor.error,
                      marginLeft: 5,
                      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                    }}
                  >
                    {errorMessage.assign}
                  </Text>
                )}
              </View>
            ) : null}
          </View>
          {SelectedAnimal?.length +
            SelectedEnclosure?.length +
            SelectedSection?.length +
            SelectedSite?.length >
          0 ? (
            <ObservationAnimalCard
              outerStyle={[
                reduxColors.cardContainer,
                {
                  paddingBottom:
                    SelectedAnimal?.length > 0 ||
                    SelectedEnclosure?.length > 0 ||
                    SelectedSection?.length > 0 ||
                    SelectedSite?.length > 0
                      ? 0
                      : null,

                  borderColor: constThemeColor.outlineVariant,
                  marginTop: Spacing.small,
                  borderRadius: Spacing.mini,
                },
              ]}
              cardcolorbg={
                SelectedAnimal?.length +
                  SelectedEnclosure?.length +
                  SelectedSection?.length +
                  SelectedSite?.length >
                0
                  ? true
                  : false
              }
              title={"Select Section, Enclosure or Animal*"}
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
          ) : null}
          {SelectedAnimal?.length +
            SelectedEnclosure?.length +
            SelectedSection?.length +
            SelectedSite?.length >
          0 ? (
            <View
              style={{
                paddingHorizontal: Spacing.small,
                paddingBottom: Spacing.small,
              }}
            >
              <Text style={reduxColors.optionalColors}>
                Notes related to an animal, enclosure, section or a site
              </Text>
              {/* )} */}
            </View>
          ) : null}
          <View
            style={[
              reduxColors.headingView,
              { marginVertical: Spacing.body, marginTop: Spacing.mini },
            ]}
          >
            <View
              style={[
                reduxColors.attatchmentView,
                {
                  // backgroundColor: constThemeColor.surface,

                  borderWidth: selectedItems?.length > 0 ? 2 : 1,
                },
              ]}
            >
              <View
                style={{
                  borderRadius: Spacing.mini,
                  backgroundColor:
                    selectedItems?.length > 0
                      ? constThemeColor.displaybgPrimary
                      : constThemeColor.surface,
                  paddingBottom: 10,
                  borderColor: constThemeColor?.Outline,
                }}
              >
                <View style={reduxColors.attatchmentViewinner}>
                  <MaterialCommunityIcons
                    name="home-plus-outline"
                    size={24}
                    color={constThemeColor.OnPrimaryContainer}
                  />
                  <Text
                    style={{
                      marginLeft: Spacing?.small,
                      color: constThemeColor.onSecondaryContainer,
                      fontSize: FontSize.Antz_Minor_Regular.fontSize,
                      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                    }}
                  >
                    Add Attachments If Any
                  </Text>
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  // horizontal
                >
                  <TouchableOpacity activeOpacity={10} onPress={takePhoto}>
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
              </View>
              {selectedItems?.length > 0 && (
                <View
                  style={{
                    borderBottomWidth: 2,
                    borderColor: constThemeColor?.outline,
                  }}
                ></View>
              )}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignSelf: "center",
                  paddingHorizontal: Spacing.small,
                  justifyContent: "space-around",
                  marginTop: selectedItems?.length > 0 ? Spacing.small : 0,
                }}
              >
                {selectedItems
                  .filter((item) =>
                    item?.file_type
                      ? item?.file_type == "image/jpeg"
                      : item?.type == "image/jpeg" || item?.type == "image/png"
                  )
                  .map((item) => (
                    <View
                      style={{
                        width: widthPercentageToDP(38),
                        // marginLeft: widthPercentageToDP(1),
                        // marginRight: widthPercentageToDP(1),
                        marginBottom: Spacing.mini,
                        marginRight: Spacing.body,
                      }}
                    >
                      <Image
                        source={{ uri: item?.file ? item?.file : item?.uri }}
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
                          {item?.file
                            ? item?.file?.slice(-15)
                            : item?.uri?.slice(-15)}
                        </Text>
                        <MaterialCommunityIcons
                          name="close"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                          onPress={() =>
                            removeDocuments(item?.file ? item?.file : item?.uri)
                          }
                        />
                      </View>
                    </View>
                  ))}
              </ScrollView>

              {selectedItems
                ?.filter(
                  (item) =>
                    (item?.file_type || item?.type)?.split("/")[0] != "image"
                )
                ?.map((item, index) => {
                  return (
                    <View
                      style={{
                        backgroundColor: constThemeColor.onPrimary,
                        paddingHorizontal: Spacing.small,
                        marginBottom: Spacing.small,
                      }}
                    >
                      <View
                        style={[
                          reduxColors.attachBox,
                          {
                            backgroundColor: constThemeColor.displaybgPrimary,
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
                            // name="music-box-multiple-outline"

                            name={
                              recordedSounds?.length > 0 &&
                              recordedSounds[index]?.sound &&
                              isRecordPlaying &&
                              item?.type == "audio/m4a" &&
                              currentPlayingAudioUri == index
                                ? "pause"
                                : item?.type == "audio/m4a" &&
                                  recordedSounds[index]?.sound
                                ? "play"
                                : "music-box-multiple-outline"
                            }
                            onPress={() =>
                              isRecordPlaying &&
                              currentPlayingAudioUri == index &&
                              recordedSounds?.length > 0 &&
                              recordedSounds[index]?.sound
                                ? handleStopRecordedAudio(
                                    recordedSounds[index]?.sound
                                  )
                                : item?.type == "audio/m4a" &&
                                  recordedSounds[index]?.sound
                                ? handlePlayRecordedAudio(index)
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
                        <View style={{ marginLeft: Spacing.small }}>
                          <Text style={reduxColors.attachText}>
                            {/* {item?.type == "audio/m4a"
                              ? item?.name
                              : item?.name
                              ? item?.name?.slice(-20)
                              : item?.file_orginal_name
                              ? item?.file_orginal_name?.slice(-20)
                              : ""} */}
                            {item?.name
                              ? extractTextAndExtension(item?.name)
                              : item?.file_orginal_name
                              ? extractTextAndExtension(item?.file_orginal_name)
                              : ""}
                          </Text>
                        </View>
                        <MaterialCommunityIcons
                          name="close"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                          style={{
                            position: "absolute",
                            right: Spacing.mini,
                            // paddingHorizontal: 5,
                          }}
                          onPress={() =>
                            removeDocuments(
                              item?.name || item?.file_orginal_name
                            )
                          }
                        />
                      </View>
                    </View>
                  );
                })}
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

          <View
            style={{ marginVertical: Spacing.body, marginTop: Spacing.micro }}
          >
            <View
              style={{
                borderWidth: priority ? 1 : 1,
                borderColor: isError?.priority
                  ? constThemeColor.error
                  : constThemeColor.outline,
                borderRadius: Spacing.mini,
                backgroundColor: priority
                  ? constThemeColor.displaybgPrimary
                  : constThemeColor.surface,
              }}
            >
              <View
                style={{
                  padding: Spacing.minor,
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                    color: constThemeColor.onPrimaryContainer,
                  }}
                >
                  Priority
                </Text>
              </View>
              <View
                style={{
                  padding: Spacing.minor,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 0,
                }}
              >
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={imageData}
                  contentContainerStyle={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        paddingHorizontal: Spacing.small,
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          setPriority(item?.name);
                          onValueChacked(item?.id);
                        }}
                      >
                        <SvgXml
                          xml={isSelectedId(item) ? item.lowColor : item.low}
                          style={[reduxColors.image]}
                        />
                        <Text style={reduxColors.prirotyStyle}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            </View>
            {isError?.priority ? (
              <Text
                style={{
                  color: constThemeColor.error,
                  fontSize: FontSize.Antz_errMsz,
                }}
              >
                {errorMessage?.priority}
              </Text>
            ) : null}
          </View>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Checkbox.Android
              status={
                checked == 1 || props.route.params?.cameFrom == true
                  ? "checked"
                  : "unchecked"
              }
              onPress={handleCheckboxToggle}
            />
            <Text
              style={{
                color: constThemeColor.onSecondaryContainer,
                marginLeft: Spacing.mini,
              }}
            >
              Do you want to tag or Team up users
            </Text>
          </View> */}
        </ScrollView>
      </CustomForm>
      {observationTypeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={observationTypeMenuOpen}
            style={reduxColors.bottomSheetStyle}
            onBackdropPress={observClose}
          >
            <Category
              categoryData={observationData}
              onCatPress={observPressed}
              heading={"Choose Observation Type"}
              isMulti={false}
              onClose={observClose}
            />
          </Modal>
        </View>
      ) : null}

      {/* {documentModal ? (
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
              <TouchableWithoutFeedback onPress={() => setDocumentModal(true)}>
                <View style={reduxColors.modalContainer}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <TouchableWithoutFeedback onPress={handleDocumentPick}>
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
                          <Ionicons
                            name="document-text-sharp"
                            size={24}
                            color={constThemeColor.onPrimary}
                          />
                        </View>
                        <Text style={reduxColors.docsText}>Document</Text>
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
                        <Text style={reduxColors.docsText}>Photo</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null} */}
      {audioPickModal ? (
        <Modal
          onBackdropPress={toggleAudioModalView}
          onRequestClose={toggleAudioModalView}
          visible={true}
          avoidKeyboard
          animationType="fade"
          onDismiss={toggleAudioModalView}
          style={[
            stylesSheet.bottomSheetStyle,
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
                          name={recording !== undefined ? "stop" : "record-rec"}
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
  );
};

export default EditObservation;
// STYLES STARTS FROM HERE
const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
const styles = (reduxColors) =>
  StyleSheet.create({
    attatchmentViewinner: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingHorizontal: 10,
      marginLeft: Spacing?.mini,
      paddingTop: 10,
      paddingBottom: 10,
    },
    attatchmentView: {
      // backgroundColor: reduxColors.surface,
      borderWidth: 1,
      borderColor: reduxColors.outline,
      borderRadius: 4,
    },
    secondViewTitleText: {
      fontStyle: "normal",
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      color: reduxColors.onSurfaceVariant,
      width: widthPercentageToDP(60),
    },
    modalOverlay: {
      // flex: 1,
      height: heightPercentageToDP(100),
      width: widthPercentageToDP("100%"),
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
      alignSelf: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      height: Math.floor(windowHeight * 0.15),
      width: widthPercentageToDP("100%"),
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.mini,
    },
    attachmentView: {
      backgroundColor: reduxColors.secondary,
      height: 45,
      width: 45,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 40,
    },
    docsText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    attachBox: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginBottom: 3,
      marginTop: 3,
      backgroundColor: reduxColors.surface,
    },
    attachText: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSecondaryContainer,
      flexWrap: "wrap",
      width: widthPercentageToDP("60%"),
    },
    optionalColors: {
      fontSize: FontSize.Antz_Subtext_Medium.fontSize,
      fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    optionalColors1: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    prirotyStyle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginTop: 4,
    },
    mainTag: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      minWidth: widthPercentageToDP(24),
      height: heightPercentageToDP(4),
    },
    tagsContainer: {
      flexDirection: "row",
      left: 5,
      top: 2,
    },
    tag: {
      backgroundColor: reduxColors.tagColor,
      borderRadius: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginRight: 8,
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
      backgroundColor: reduxColors.errorContainer,
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
    errorBox: {
      textAlign: "left",
      width: "90%",
    },
    errorMessage: {
      color: reduxColors.error,
    },
    bottomSheetStyle: {
      margin: 0,
      justifyContent: "flex-end",
      backgroundColor: reduxColors.blackWithPointEight,
    },
    userTitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    designation: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    department: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    cardContainer: {
      borderWidth: 1,
      // borderTopLeftRadius: Spacing.small,
      // borderTopRightRadius:Spacing.small,
      // // backgroundColor: reduxColors.displaybgPrimary,
      marginVertical: Spacing.mini,
    },
  });
