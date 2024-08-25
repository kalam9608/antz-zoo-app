import {
  View,
  Text,
  useWindowDimensions,
  Dimensions,
  ScrollView,
  Image,
  BackHandler,
  Alert,
  Linking,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import InputBox from "../../components/InputBox";
import Modal from "react-native-modal";
import { useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import FontSize from "../../configs/FontSize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomForm from "../../components/CustomForm";
import { FlatList } from "react-native";
import { Checkbox, Divider } from "react-native-paper";
import {
  capitalize,
  getDocumentData,
  getFileData,
  getFileInfo,
  ifEmptyValue,
  isLessThanTheMB,
} from "../../utils/Utils";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import low from "../../assets/priroty/low.svg";
import moderate from "../../assets/priroty/modrate.svg";
import high from "../../assets/priroty/high.svg";
import icon_priority_critical from "../../assets/priroty/icon_priority_critical.svg";
import icon_priority_low_filled from "../../assets/priroty/icon_priority_low_filled.svg";
import icon_priority_high_filled from "../../assets/priroty/icon_priority_high_filled.svg";
import icon_priority_medium_filled from "../../assets/priroty/icon_priority_medium_filled.svg";
import icon_priority_critical_filled from "../../assets/priroty/icon_priority_critical_filled.svg";
import Gallery from "../../assets/Gallery.svg";
import Documents from "../../assets/Document.svg";
import Doc from "../../assets/Doc.svg";
import Pdf from "../../assets/Pdf.svg";
import Video from "../../assets/Video.svg";
import { SvgXml } from "react-native-svg";
import {
  NewObservation,
  NewObservationTemplateList,
  getObservationListforAdd,
} from "../../services/ObservationService";
import {
  removeAnimalMovementData,
  setApprover,
} from "../../redux/AnimalMovementSlice";
import Loader from "../../components/Loader";
import InchargeCard from "../../components/InchargeCard";
import Spacing from "../../configs/Spacing";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import Config, { audioType, documentType } from "../../configs/Config";
import { useToast } from "../../configs/ToastConfig";
import MedicalAnimalCard from "../../components/MedicalAnimalCard";
import {
  setEffectListApiCall,
  setMedicalAnimal,
  setMedicalEnclosure,
  setMedicalSection,
  setMedicalSite,
} from "../../redux/MedicalSlice";
import InchargeObservationCard from "./InchargeObservationCard";
import ObservationAnimalCard from "../../components/ObservationAnimalListCard";
import Constants from "../../configs/Constants";
import Switch from "../../components/Switch";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { handleFilesPick, takeCameraFiles } from "../../utils/UploadFiles";

const Observation = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const { height, width } = useWindowDimensions();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [extraData, setExtraData] = useState({});
  const [observation, setObservation] = useState("");
  const [priority, setPriority] = useState("Low");
  const [checked, setChecked] = useState(0);
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [observationData, setObservationData] = useState("");
  const [observationTypeID, setObservationTypeID] = useState([]);
  const [selectedImage, setselectedImage] = useState("1");
  const [paramdata, setParamdata] = useState(null);
  const [attach, setAttach] = useState(null);
  const dispatch = useDispatch();
  const [inchargeId, setInchargeId] = useState([]);
  const user = useSelector((state) => state.UserAuth.userDetails);
  const [newTempList, setNewTempList] = useState([]);
  const [assignToList, setAssignToList] = useState([]);
  const approver = useSelector((state) =>
    Object.keys(state.AnimalMove.approver).length > 0
      ? state.AnimalMove.approver
      : []
  );
  const clearTypeData = () => {
    setSelectedObservationType([]);
    setExtraData([]);
  };
  const [selectedObservationType, setSelectedObservationType] = useState([]);
  const { showToast, errorToast } = useToast();
  const [SelectedAnimal, setSelectedAnimal] = useState([]);
  const [SelectedEnclosure, setSelectedEnclosure] = useState([]);
  const [SelectedSection, setSelectedSection] = useState([]);
  const SelectedAnimalRedux = useSelector((state) => state.medical.animal);
  const [siteSelectEntity, SetSiteSelectEntity] = useState([]);
  const SelectedEnclosureRedux = useSelector(
    (state) => state.medical.enclosure
  );
  const [siteSelectedIds, setSiteSelectedIds] = useState([]);
  const SelectedSectionRedux = useSelector((state) => state.medical.section);
  const SelectedSiteRedux = useSelector((state) => state.medical.site);
  const [complete_name, setcomplete_name] = useState("");

  const [recording, setRecording] = useState(undefined);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isRecordPlaying, setIsRecordPlaying] = useState(false);
  const [currentPlayingAudioUri, setCurrentPlayingAudioUri] = useState("");
  const [audioPickModal, setAudioPickModal] = useState(false);
  const [recordedSounds, setRecordedSounds] = useState([]);

  useEffect(() => {
    setSelectedAnimal(SelectedAnimalRedux);
  }, [JSON.stringify(SelectedAnimalRedux)]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     SetSiteSelectEntity(props.route?.params?.SiteEntity??[])
  //   }, [props.route?.params?.SiteEntity])
  // );
  useEffect(() => {
    setSelectedEnclosure(SelectedEnclosureRedux);
  }, [JSON.stringify(SelectedEnclosureRedux)]);
  useEffect(() => {
    setSelectedSection(SelectedSectionRedux);
  }, [JSON.stringify(SelectedSectionRedux)]);
  useEffect(() => {
    SetSiteSelectEntity(SelectedSiteRedux);
  }, [JSON.stringify(SelectedSiteRedux)]);
  useEffect(() => {
    setSiteSelectedIds(siteSelectEntity?.map((i) => i?.site_id?.toString()));
  }, [JSON.stringify(siteSelectEntity)]);

  // This useEffect is use for prefilled data from aftercam scan and animal section and enclosure screen
  useEffect(() => {
    if (props.route.params?.selectedAnimal?.animal_id) {
      dispatch(
        setMedicalAnimal([
          { ...props.route.params?.selectedAnimal, selectType: "animal" },
        ])
      );
    } else if (props.route.params?.sectionDetailsData) {
      dispatch(
        setMedicalSection([
          { ...props.route.params?.sectionDetailsData, selectType: "section" },
        ])
      );
    } else if (props.route.params?.enclosureData) {
      dispatch(
        setMedicalEnclosure([
          { ...props.route.params?.enclosureData, selectType: "enclosure" },
        ])
      );
    } else if (props.route.params?.SiteEntity) {
      dispatch(
        setMedicalSite([
          { ...props.route?.params?.SiteEntity, selectType: "site" },
        ])
      );
    }
  }, [
    props.route.params?.selectedAnimal,
    props.route.params?.sectionDetailsData,
    props.route.params?.enclosureData,
    props.route.params?.SiteEntity,
  ]);

  const handleCheckboxToggle = () => {
    setChecked(checked == 0 ? 1 : 0);
  };

  const saveExtraData = (e) => {
    setExtraData(e);
  };
  const searchSelectData = (data) => {
    setSelectedObservationType(data);
    IsDefaultDataSelected(data.id);
  };
  const IsDefaultDataSelected = (data) => {
    setIsLoading(true);
    const obj = {
      ZooId: zooID,
      observation_types: data,
    };
    NewObservationTemplateList(obj)
      .then((res) => {
        if (res.data.result) {
          let result = res?.data?.result;
          const defaultObject = result?.find((obj) => obj.is_default === "1");
          setAssignToList(defaultObject ? defaultObject.template_items : []);
          setChecked(defaultObject ? true : false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setAssignToList(approver);
  }, [JSON.stringify(approver)]);
  const deleteApprover = (id) => {
    const filter = assignToList?.filter((p) => p?.user_id != id);
    setAssignToList(filter);
    dispatch(setApprover(filter));
  };
  useEffect(() => {
    setInchargeId(assignToList?.map((i) => i.user_id));
  }, [JSON.stringify(assignToList)]);
  useEffect(() => {
    setParamdata(props.route.params);
    setObservationTypeID(
      extraData?.selectedSubTypeIds?.length > 0
        ? extraData.selectedSubTypeIds
        : [selectedObservationType?.id]
    );
  }, [props.route.params, extraData]);

  useEffect(() => {
    const attachment = selectedItems?.map((item) => {
      return item?.data?.uri;
    });
    setAttach(attachment);
  }, [selectedItems]);

  useEffect(() => {
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

  const toggleAudioModalView = () => {
    if (selectedObservationType.source_required == 0) {
      setIsError({});
      setErrorMessage({});
    }
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
      setIsError({ recordAudio: true });
      setErrorMessage({ audio: "Can't choose file greater than 25MB" });
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

  const handleDocumentPick = async () => {
    if (selectedObservationType.source_required == 0) {
      setIsError({});
      setErrorMessage({});
    }
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
    if (selectedObservationType.source_required == 0) {
      setIsError({});
      setErrorMessage({});
    }
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

  const handleImagePick = async () => {
    if (selectedObservationType.source_required == 0) {
      setIsError({});
      setErrorMessage({});
    }
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
    if (selectedObservationType.source_required == 0) {
      setIsError({});
      setErrorMessage({});
    }
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        // setIsLoading(false);
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
        setSelectedItems([...selectedItems, getFileData(result.assets[0])]);
      }
    } catch (err) {
      console.error("Error picking image:", err);
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

  const isSelectedId = (id) => {
    return selectedImage.includes(id);
  };
  const onValueChacked = (id) => {
    setselectedImage([selectedImage, id]);
  };

  useEffect(() => {
    if (observationTypeID) {
      setIsError({ observationType: false });
    }
    if (observation) {
      setIsError({ observation: false });
    }
    if (inchargeId) {
      setIsError({ assign: false });
    }
    // if (
    //   SelectedAnimal.length +
    //     SelectedEnclosure.length +
    //     SelectedSection.length >
    //   0
    // ) {
    //   setIsError({ paramdata: false });
    // }
    if (selectedItems?.length > 0) {
      setIsError({ selectedItems: false });
    }
    if (priority) {
      setIsError({ priority: false });
    }
  }, [
    observationTypeID,
    observation,
    inchargeId,
    SelectedAnimal,
    selectedItems,
    priority,
    SelectedEnclosure,
    SelectedSection,
    siteSelectEntity,
  ]);
  const Validation = () => {
    setIsError({});
    setErrorMessage({});
    if (selectedObservationType.length == 0) {
      setIsError({ observationType: true });
      setErrorMessage({ observationType: "Note Type Required" });
      return false;
    } else if (
      selectedObservationType.source_required == 0 &&
      !(
        SelectedAnimal?.length +
        SelectedEnclosure?.length +
        SelectedSection?.length +
        siteSelectEntity?.length
      ) > 0
    ) {
      if (
        !observation &&
        selectedObservationType.source_required == 0 &&
        selectedItems?.length == 0
      ) {
        setIsError({ noteDescription: true, selectedItems: true });
        setErrorMessage({
          noteDescription: "Notes or attachments is required",
          selectedItems: "Notes or attachments is required",
        });
        return false;
      }
    } else if (checked == 1 && inchargeId.length == 0) {
      setIsError({ assign: true });
      setErrorMessage({ assign: "Add member is required" });
      return false;
    } else if (!priority) {
      setIsError({ priority: true });
      setErrorMessage({ priority: "Priority is required" });
      return false;
    } else if (
      selectedObservationType.source_required != 0 &&
      !(
        SelectedAnimal?.length +
        SelectedEnclosure?.length +
        SelectedSection?.length +
        siteSelectEntity?.length
      ) > 0
    ) {
      setIsError({ paramData: true });
      setErrorMessage({
        paramData: "Animal,Enclosure,Section or Site is required",
      });
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
  const readableBytes = (bytes) => {
    let i = Math.floor(Math?.log(bytes) / Math?.log(1024)),
      sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    return (bytes / Math?.pow(1024, i)).toFixed(2) * 1 + " " + sizes[i];
  };
  const handleOnPress = () => {
    if (Validation()) {
      let postData = {
        zoo_id: zooID,
        observation_name: observation,
        observation_type_id: JSON.stringify(observationTypeID?.map((p) => p)),
        animal_id: JSON.stringify(SelectedAnimal?.map((p) => p?.animal_id)),
        enclosure_id: JSON.stringify(
          SelectedEnclosure?.map((p) => p?.enclosure_id)
        ),
        section_id: JSON.stringify(SelectedSection?.map((p) => p?.section_id)),
        priority: priority,
        ref_type: "section",
        ref_id: "101",
        site_id: JSON.stringify(siteSelectEntity?.map((p) => p?.site_id)),
      };
      if (checked == 1) {
        postData.assign_to = inchargeId;
      }
      setIsLoading(true);
      NewObservation(postData, selectedItems)
        .then((response) => {
          if (response?.success) {
            dispatch(removeAnimalMovementData());
            showToast("success", "Note  added successfully");
            // const { onGoBack } = props.route.params;
            // onGoBack("observation");
            // navigation.goBack();
            back();
            if (props?.route?.params?.onGoBackData) {
              props?.route?.params?.onGoBackData("observation");
            }
            setIsLoading(false);
            dispatch(setMedicalEnclosure([]));
            dispatch(setMedicalAnimal([]));
            dispatch(setMedicalSection([]));
            dispatch(setMedicalSite([]));
          } else {
            if (response?.message == "File Size Exceeded") {
              setIsLoading(false);
              showToast(
                "error",
                `${
                  response?.data?.file?.slice(-15) ?? ""
                }, Can't upload file greater than ${
                  // Number(response?.data?.max_size ?? 0) / 1024 ?? ""
                  readableBytes(response?.data?.max_size ?? 0)
                }`
              );
            } else {
              setIsLoading(false);
              showToast("error", "Oops!! Something went wrong");
            }
          }
        })
        .catch((err) => {
          showToast("error", "Something went wrong!!");
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const back = () => {
    dispatch(removeAnimalMovementData());
    dispatch(setMedicalEnclosure([]));
    dispatch(setMedicalAnimal([]));
    dispatch(setMedicalSection([]));
    dispatch(setMedicalSite([]));
    navigation.goBack();
  };

  useEffect(() => {
    if (props.route.params?.item?.animal_id) {
      dispatch(setMedicalAnimal([props.route.params?.item]));
      setcomplete_name(props.route.params?.item);
    }
  }, [props.route.params?.item?.animal_id]);
  const chooseAnimal = () => {
    navigation.navigate("CommonAnimalSelectMedical", {
      screenName: "Observation",
      excludeHousingWithNoAnimals: false,
      limit: Infinity,
      siteSelectedIds: siteSelectedIds ?? [],
    });
  };

  //clear data function
  const deleteFun = (type, id) => {
    dispatch(setEffectListApiCall(true));
    if (type == "animal") {
      const filterData = SelectedAnimal?.filter((p) => p.animal_id != id);
      setSelectedAnimal(filterData);
      dispatch(setMedicalAnimal(filterData));
    } else if (type == "enclosure") {
      const filterData = SelectedEnclosure?.filter((p) => p.enclosure_id != id);
      setSelectedEnclosure(filterData);
      dispatch(setMedicalEnclosure(filterData));
    } else if (type == "section") {
      const filterData = SelectedSection?.filter((p) => p.section_id != id);
      setSelectedSection(filterData);
      dispatch(setMedicalSection(filterData));
    } else if (type == "site") {
      const filterData = siteSelectEntity?.filter(
        (p) => p.site_id != id?.toString()
      );
      SetSiteSelectEntity(filterData);
      // const filterData1 = SelectedSiteRedux?.filter(
      //   (p) => p.site_id != id?.toString()
      //   )
      // dispatch(
      //   setMedicalSite([
      //   filterData1??[]
      //   ])
      // )
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
        title={"New Notes"}
        onPress={handleOnPress}
        back={back}
      >
        <Loader visible={isLoading} />

        <ScrollView>
          <View
            style={{
              borderWidth: 1,
              borderColor: isError?.observationType
                ? constThemeColor.error
                : constThemeColor.outline,
              borderRadius: 4,
              marginTop: Spacing.mini,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("observationtype", {
                  data: selectedObservationType,
                  extraData: extraData,
                  onGoBack: (e) => searchSelectData(e),
                  saveExtraData: (e) => saveExtraData(e),
                })
              }
              style={{
                backgroundColor:
                  selectedObservationType?.child_observation?.length > 0
                    ? constThemeColor.displaybgPrimary
                    : constThemeColor.surface,
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
                {selectedObservationType?.type_name ? null : (
                  <AntDesign
                    name="pluscircleo"
                    size={20}
                    color={constThemeColor.addPrimary}
                  />
                )}
              </View>
            </TouchableOpacity>
            {selectedObservationType.type_name ? <Divider bold /> : null}
            {selectedObservationType.type_name ? (
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
                    {selectedObservationType.type_name}
                  </Text>
                  <View
                    style={{
                      paddingTop: Spacing.small,
                    }}
                  ></View>
                  {selectedObservationType.type_name ? (
                    <AntDesign
                      name="closecircleo"
                      size={20}
                      color={constThemeColor.error}
                      onPress={clearTypeData}
                      style={{ paddingTop: Spacing.mini }}
                    />
                  ) : null}
                </View>

                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={selectedObservationType.child_observation}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => `label-${index}`}
                />
              </View>
            ) : null}
          </View>
          {isError?.observationType ? (
            <Text
              style={{
                color: constThemeColor.error,
                fontSize: FontSize.Antz_errMsz,
              }}
            >
              {errorMessage?.observationType}
            </Text>
          ) : null}
          <View style={reduxColors.genralDescription}>
            <InputBox
              inputLabel={"Enter Notes"}
              placeholder={"Enter Notes"}
              value={observation}
              autoFocus={false}
              onChange={(value) => {
                setObservation(value);
              }}
              multiline={true}
              numberOfLines={4}
            />
            {isError?.noteDescription ? (
              <Text
                style={{
                  color: constThemeColor.error,
                  fontSize: FontSize.Antz_errMsz,
                }}
              >
                {errorMessage?.noteDescription}
              </Text>
            ) : null}
          </View>

          <View
            style={{
              marginBottom: Spacing.mini,
              marginTop: Spacing.mini,
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: Spacing.minor,
                backgroundColor:
                  inchargeId.length > 0
                    ? constThemeColor.displaybgPrimary
                    : constThemeColor.surface,
                borderTopLeftRadius: Spacing.mini,
                borderTopRightRadius: Spacing.mini,
                borderTopWidth: inchargeId.length > 0 || isError.assign ? 1 : 1,
                borderColor: isError.assign
                  ? constThemeColor.error
                  : constThemeColor.outline,

                borderLeftWidth:
                  inchargeId.length > 0 || isError.assign ? 1 : 1,
                borderColor: isError.assign
                  ? constThemeColor.error
                  : constThemeColor.outline,

                borderRightWidth:
                  inchargeId.length > 0 || isError.assign ? 1 : 1,
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
                active={checked == 1 ? true : false}
              />
            </View>
            {checked == 1 ? (
              <View>
                <InchargeObservationCard
                  icontrue={true}
                  navigation={() =>
                    navigation.navigate("AssignTo", {
                      data: assignToList,
                      selectedItemsType: extraData.selectedItemsType,
                      selectedTypeIds: extraData.selectedIds,
                    })
                  }
                  title={
                    assignToList.length > 0
                      ? `${assignToList.length} Members to be notified`
                      : "Add Members to be notified"
                  }
                  selectedUserData={assignToList}
                  removeAsign={(item) => deleteApprover(item?.user_id)}
                  outerStyle={{
                    borderBottomWidth:
                      inchargeId.length > 0 || isError.assign ? 1 : 1,
                    borderColor: isError.assign
                      ? constThemeColor.error
                      : constThemeColor.outline,

                    borderLeftWidth:
                      inchargeId.length > 0 || isError.assign ? 1 : 1,
                    borderColor: isError.assign
                      ? constThemeColor.error
                      : constThemeColor.outline,

                    borderRightWidth:
                      inchargeId.length > 0 || isError.assign ? 1 : 1,
                    borderColor: isError.assign
                      ? constThemeColor.error
                      : constThemeColor.outline,
                    borderTopWidth:
                      inchargeId.length > 0 || isError.assign ? 1 : 1,
                    borderColor: isError.assign
                      ? constThemeColor.error
                      : constThemeColor.outline,
                    borderBottomRightRadius: Spacing.mini,
                    borderBottomLeftRadius: Spacing.mini,
                  }}
                />
                {isError?.assign ? (
                  <Text
                    style={{
                      color: constThemeColor.error,
                      fontSize: FontSize.Antz_errMsz,
                    }}
                  >
                    {errorMessage?.assign}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>

          <View
            style={{
              marginVertical: Spacing.small,
              marginBottom: Spacing.mini,
            }}
          >
            <ObservationAnimalCard
              outerStyle={[
                reduxColors.cardContainer,
                {
                  marginTop: 0,
                  paddingBottom:
                    SelectedAnimal?.length > 0 ||
                    SelectedEnclosure?.length > 0 ||
                    SelectedSection?.length > 0 ||
                    complete_name?.animal_id
                      ? 0
                      : null,

                  borderColor: isError?.paramData
                    ? constThemeColor.error
                    : constThemeColor.outline,
                  borderRadius: Spacing.mini,
                },
              ]}
              cardcolorbg={
                SelectedAnimal?.length +
                  SelectedEnclosure?.length +
                  SelectedSection?.length +
                  siteSelectEntity?.length >
                0
                  ? true
                  : false
              }
              title={"Select Entity*"}
              navigation={() => {
                if (!complete_name?.animal_id) {
                  chooseAnimal();
                }
              }}
              selectedAnimal={
                SelectedAnimal?.length > 0 ? SelectedAnimal[0] : null
              }
              siteList={siteSelectEntity}
              animalList={SelectedAnimal}
              enclosureData={SelectedEnclosure}
              sectionData={SelectedSection}
              completeName={complete_name}
              deleteFun={deleteFun}
              hidePlusIcon={false}
              disable={
                props.route.params?.selectedAnimal ||
                props.route.params?.sectionDetailsData ||
                props.route.params?.enclosureData ||
                props.route.params?.SiteEntity
                  ? true
                  : false
              }
              closeButton={
                props.route.params?.selectedAnimal ||
                props.route.params?.sectionDetailsData ||
                props.route.params?.enclosureData ||
                props.route.params?.SiteEntity
                  ? false
                  : true
              }
            />

            {isError?.paramData ? (
              <Text
                style={{
                  color: constThemeColor.error,
                  fontSize: FontSize.Antz_errMsz,
                }}
              >
                {errorMessage?.paramData}
              </Text>
            ) : null}
          </View>
          <View
            style={{
              paddingHorizontal: Spacing.mini,
              marginBottom: Spacing.small,
            }}
          >
            <Text style={reduxColors.optionalColors1}>
              Notes related to an animal, enclosure or a section
            </Text>
          </View>
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
                      marginLeft: Spacing?.body,
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
                          name={"microphone"}
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
                  paddingHorizontal:
                    selectedItems?.length > 0 ? Spacing.small : 0,
                  justifyContent: "space-around",
                  marginTop: selectedItems?.length > 0 ? Spacing.small : 0,
                }}
              >
                {selectedItems
                  .filter(
                    (item) =>
                      item?.type == "image/jpeg" || item?.type == "image/png"
                  )
                  .map((item) => (
                    <View
                      style={{
                        width: widthPercentageToDP(38),
                        marginBottom: Spacing.small,
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
              {selectedItems
                .filter((item) => item?.type?.split("/")[0] != "image")
                .map((item, index) => (
                  <View
                    style={{
                      backgroundColor: constThemeColor.onPrimary,
                      paddingHorizontal: Spacing.small,
                      marginBottom: Spacing.mini,
                    }}
                  >
                    <View
                      style={[
                        reduxColors.attachBox,
                        {
                          backgroundColor: constThemeColor.displaybgPrimary,
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
                          name={
                            isRecordPlaying &&
                            item?.type == "audio/m4a" &&
                            currentPlayingAudioUri == index
                              ? "pause"
                              : item?.type == "audio/m4a"
                              ? "play"
                              : "music-box-multiple-outline"
                          }
                          size={25}
                          onPress={() =>
                            isRecordPlaying && currentPlayingAudioUri == index
                              ? handleStopRecordedAudio(
                                  recordedSounds[index]?.sound
                                )
                              : item?.type == "audio/m4a"
                              ? handlePlayRecordedPlay(index)
                              : null
                          }
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
                          {/* {item?.type == "audio/m4a"
                            ? item?.name
                            : item?.name?.slice(-20) ?? "NA"} */}
                          {item?.name
                            ? extractTextAndExtension(item?.name ?? "")
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
                        onPress={() => removeDocuments(item?.name)}
                      />
                    </View>
                  </View>
                ))}
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
            style={{ marginVertical: Spacing.body, marginTop: Spacing.mini }}
          >
            <View
              style={{
                borderWidth: priority ? 2 : 1,
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
                  padding: 15,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 0,
                }}
              >
                <FlatList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  data={imageData}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        paddingHorizontal: 8,
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
                          xml={isSelectedId(item.id) ? item.lowColor : item.low}
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
              status={checked == 1 ? "checked" : "unchecked"}
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

export default Observation;
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
      fontSize: FontSize.Antz_Subtext_Medium.fontSize,
      fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
      marginTop: Spacing.mini,
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
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    optionalColors1: {
      fontSize: FontSize.Antz_Subtext_Medium.fontSize,
      fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    prirotyStyle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginTop: Spacing.mini,
    },
    mainTag: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      minWidth: widthPercentageToDP(24),
      height: heightPercentageToDP(4),
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
    cardContainer: {
      borderWidth: 1,
      // borderRadius: Spacing.small,
      // backgroundColor: reduxColors.surface,
      marginVertical: Spacing.mini,
    },
  });
