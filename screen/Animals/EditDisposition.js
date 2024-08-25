// Author :  Ganesh
// Date:- 31 March 2023 modify :25 May 2023

import React, { useContext, useEffect, useRef, useState } from "react";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Category from "../../components/DropDownBox";
import CustomForm from "../../components/CustomForm";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import InputBox from "../../components/InputBox";
import DatePicker from "../../components/DatePicker";
import {
  addMortalityMedia,
  addanimalmortality,
  carcassCondition,
  carcassDisposition,
  deleteMortalityMedia,
  editAnimalMortality,
  getAnimal,
  mannerOfDeath,
} from "../../services/AddDispositionService";
import moment from "moment";
import { useSelector } from "react-redux";
import { getAnimalList } from "../../services/AnimalService";
import { capitalize, getFileData } from "../../utils/Utils";
import { Checkbox, Divider } from "react-native-paper";
import Card from "../../components/CustomCard";
import Modal from "react-native-modal";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

import Colors from "../../configs/Colors";
import AnimalMortality from "../../components/AnimalMortalityCard";
import FontSize from "../../configs/FontSize";
import { parse } from "react-native-svg";
import Switch from "../../components/SwitchNecro";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { errorDailog } from "../../utils/Alert";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import { useToast } from "../../configs/ToastConfig";
import Spacing from "../../configs/Spacing";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import { handleFilesPick } from "../../utils/UploadFiles";

const EntityItem = [
  {
    id: 1,
    name: "Preselected",
  },
  {
    id: 2,
    name: "Auto completed",
  },
];

const Necropsy = [
  {
    id: 1,
    name: "Yes",
  },
  {
    id: 0,
    name: "No",
  },
];

const EditDisposition = (props) => {
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const [toggleValue, setToggleValue] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [count, setCount] = useState(0);

  const [vernacularName, setVernacularName] = useState(
    props.route.params?.item?.scientific_name ?? ""
  );

  const [animalId, setAnimalId] = useState(
    props.route.params?.item?.animal_id ?? ""
  );

  const [localId, setLocalId] = useState(
    props.route.params?.item?.local_id ?? ""
  );
  const [selectEnclosure, setSelectEnclosure] = useState(
    props.route.params?.item?.user_enclosure_name ?? ""
  );
  const [selectSection, setSelectSection] = useState(
    props.route.params?.item?.section_name ?? ""
  );
  const [animalDetails, setAnimalDetails] = useState(
    props.route.params?.item ?? {}
  );

  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  const [isEncEnvMenuOpen, setisEncEnvMenuOpen] = useState(false);

  const [isEncTypeMenuOpen, setisEncTypeMenuOpen] = useState(false);
  const [isEncTypeMenuOpen1, setisEncTypeMenuOpen1] = useState(false);
  const [isEncTypeMenuOpen2, setisEncTypeMenuOpen2] = useState(false);

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});

  const [entity, setEntity] = useState(
    capitalize(props.route.params?.item?.vernacular_name) +
      " (" +
      props.route.params?.item?.complete_name +
      ")" ?? ""
  );
  const [isEntityOpen, setEntityOpen] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [entityId, setEntityId] = useState(
    props.route.params?.item?.animal_id ?? undefined
  );
  const [date, setDate] = useState(
    props.route.params?.item?.user_dob ?? new Date()
  );
  const [mannerDeath, setMannerDeath] = useState(
    props.route.params?.item.manner_death ?? ""
  );
  const [mannerDeathId, setMannerDeathId] = useState(
    props.route.params?.mortalityData[0]?.manner_of_death_id !== undefined
      ? props.route.params?.mortalityData[0]?.manner_of_death_id
      : props.route.params?.mortalityData?.manner_of_death_id
  );
  const [mannerData, setMannerData] = useState([]);

  const [condition, setCondition] = useState(
    props.route.params?.item?.condition_type ?? ""
  );
  const [conditionId, setConditionId] = useState(
    props.route.params?.mortalityData[0]?.carcass_condition_id !== undefined
      ? props.route.params?.mortalityData[0]?.carcass_condition_id
      : props.route.params?.mortalityData?.carcass_condition_id
  );
  const [conditionData, setConditionData] = useState([]);

  const [disposition, setDisposition] = useState(
    props?.route?.params?.item?.disposition_type ?? ""
  );
  const [dispositionId, setDispositionId] = useState(
    props.route.params?.mortalityData[0]?.carcass_disposition_id !== undefined
      ? props.route.params?.mortalityData[0]?.carcass_disposition_id
      : props.route.params?.mortalityData?.carcass_disposition_id
  );
  const [dispositionData, setDispositionData] = useState([]);
  const [note, setNotes] = useState(
    props.route.params?.item?.user_for_notes ?? ""
  );
  const [selectedItems, setSelectedItems] = useState([]);
  const [necropsy, setNecropsy] = useState(
    props.route.params?.item.necropsy_type ?? ""
  );
  const [necropsyId, setNecropsyId] = useState(
    props.route.params?.item.necropsy_type ?? ""
  );
  const [markLayDate, setMarkLayDate] = useState(
    Boolean(
      Number(
        props.route.params?.mortalityData[0]?.is_estimate !== undefined
          ? props.route.params?.mortalityData[0]?.is_estimate
          : props.route.params?.mortalityData?.is_estimate
      )
    ) ?? false
  );
  const [loading, setLoding] = useState(false);
  const [animalData, setAnimalData] = useState([]);
  const [countAnimal, setCountAnimal] = useState("");
  const [enclosureTypeDown, setEnclosureTypeDown] = useState(false);
  const [Ad, setAd] = useState();
  const entityRefs = useRef(null);
  const dispositionDateRef = useRef(null);
  const mannerofDeathRef = useRef(null);
  const carcassConditionRef = useRef(null);
  const carcassDispositionRef = useRef(null);
  const notesRef = useRef(null);
  const necropsyRef = useRef(null);
  const necropsyStatus =
    props?.route?.params?.mortalityData?.submitted_for_necropsy;

  useEffect(() => {
    if (props.route.params?.editParams == "1") {
      if (props.route.params?.item?.total_animal > 1) {
        setCountAnimal(props.route.params?.mortalityData?.total_animal);
        setVernacularName(props.route.params?.item?.vernacular_name);
        setLocalId(props.route.params?.item?.local_id);
        setSelectEnclosure(props.route.params?.item?.user_enclosure_name);
        setSelectSection(props.route.params?.item?.section_name);
        setMannerDeathId(props.route.params?.mortalityData?.manner_of_death_id);
        setMannerDeath(props.route.params?.mortalityData?.manner_of_death);
        setCondition(props.route.params?.mortalityData?.carcass_condition);
        setDisposition(props.route.params?.mortalityData?.carcass_disposition);
        setNotes(props.route.params?.mortalityData?.notes);
        setSelectedItems(
          props.route.params?.mortalityData?.antz_animal_mortality_media
        );
        setDate(props.route.params?.mortalityData?.discovered_date);
        setIsSwitchOn(
          props.route.params?.mortalityData?.submitted_for_necropsy == "1"
            ? true
            : false
        );
      } else {
        setVernacularName(props.route.params?.item?.vernacular_name);
        setLocalId(props.route.params?.item?.local_id);
        setSelectEnclosure(props.route.params?.item?.user_enclosure_name);
        setSelectSection(props.route.params?.item?.section_name);
        setMannerDeathId(
          props.route.params?.mortalityData[0]?.manner_of_death_id
        );
        setMannerDeath(props.route.params?.mortalityData[0]?.manner_of_death);
        setCondition(props.route.params?.mortalityData[0]?.carcass_condition);
        setDisposition(
          props.route.params?.mortalityData[0]?.carcass_disposition
        );
        setNotes(props.route.params?.mortalityData[0]?.notes);
        setSelectedItems(
          props.route.params?.mortalityData[0]?.antz_animal_mortality_media
        );
        setIsSwitchOn(
          props.route.params?.mortalityData[0]?.submitted_for_necropsy == "1"
            ? true
            : false
        );
        setDate(props.route.params?.mortalityData[0]?.discovered_date);
      }
    }
  }, []);

  const handleSubmitFocus = (refs, time) => {};

  const catPressed = (item) => {
    setEntity(item.map((u) => u.name).join(", "));

    setEntityId(item.map((id) => id.id).join(","));

    setEntityOpen(false);
    handleSubmitFocus(dispositionDateRef);
  };

  const catEnvPress = (item) => {
    setMannerDeath(item.map((u) => u.name).join(","));
    setMannerDeathId(item.map((id) => id.id).join(","));

    setisEncEnvMenuOpen(false);
  };

  const catEnTypePress = (item) => {
    setCondition(item.map((u) => u.name).join(","));
    setConditionId(item.map((id) => id.id).join(","));

    setisEncTypeMenuOpen(false);
    handleSubmitFocus(carcassDispositionRef);
  };

  const catEnTypePress1 = (item) => {
    setDisposition(item.map((u) => u.name).join(","));
    setDispositionId(item.map((id) => id.id).join(","));
    setisEncTypeMenuOpen1(false);
    handleSubmitFocus(notesRef, 1000);
  };

  const catEnTypePress2 = (item) => {
    item.map((value) => {
      setNecropsy(value.name);
    });
    item.map((value) => {
      setNecropsyId(value.id);
    });
    setisEncTypeMenuOpen2(false);
  };

  useEffect(() => {
    setLoding(true);
    let obj = {
      zoo_id: zooID,
    };
    Promise.all([
      getAnimalList(obj),
      mannerOfDeath(),
      carcassCondition(),
      carcassDisposition(),
    ])
      .then((res) => {
        setAnimalData(
          res[0]?.data?.map((item) => ({
            id: item.animal_id,
            name:
              capitalize(item.vernacular_name) +
              " (" +
              item.complete_name +
              ")",
          }))
        );
        setMannerData(
          res[1]?.data?.map((item) => ({
            id: item?.id,
            name: item?.name,
            isSelect:
              item.name == props.route.params?.mortalityData?.manner_of_death
                ? true
                : false,
          }))
        );
        setConditionData(
          res[2]?.data?.map((item) => ({
            id: item?.id,
            name: item?.name,
            isSelect: item?.name == condition ? true : false,
          }))
        );
        setDispositionData(
          res[3]?.data?.map((item) => ({
            id: item?.id,
            name: item?.name,
            isSelect: item?.name == disposition ? true : false,
          }))
        );
        setCount(1);
      })
      .catch((err) => {
        console.log(err);
        setLoding(false);
      })
      .finally(() => {
        setLoding(false);
        if (entityId === undefined) {
          handleSubmitFocus(entityRefs);
        } else {
          handleSubmitFocus(dispositionDateRef);
        }
      });
  }, [count]);

  const validation = () => {
    if (props.route.params?.item?.total_animal > 1) {
      if (countAnimal.trim().length == 0) {
        setIsError({ countAnimal: true });
        setErrorMessage({ countAnimal: "Enter the animal count" });
        return false;
      } else if (Number(countAnimal) === 0) {
        setIsError({ countAnimal: true });
        setErrorMessage({
          countAnimal: "Count of animal should not be 0",
        });
        return false;
      } else if (
        Number(props.route.params?.item?.mortality_count) !==
          Number(props.route.params?.mortalityData?.total_animal) &&
        Number(props.route.params?.item?.mortality_count) -
          Number(props.route.params?.mortalityData?.total_animal) +
          Number(countAnimal) >
          props.route.params?.item?.total_animal
      ) {
        setIsError({ countAnimal: true });
        setErrorMessage({
          countAnimal: `Dead animal count ${props.route.params?.item?.mortality_count}/${props.route.params?.item?.total_animal} `,
        });
        return false;
      } else if (
        Number(props.route.params?.item?.mortality_count) ==
          Number(props.route.params?.mortalityData?.total_animal) &&
        Number(countAnimal) > props.route.params?.item?.total_animal
      ) {
        setIsError({ countAnimal: true });
        setErrorMessage({
          countAnimal: `Dead animal count ${props.route.params?.item?.mortality_count}/${props.route.params?.item?.total_animal} `,
        });
        return false;
      }
    } else if (date === "") {
      setIsError({ date: true });
      setErrorMessage({ date: "Select from dropdown" });
      return false;
    } else if (mannerDeath.trim().length === 0) {
      setIsError({ mannerDeath: true });
      setErrorMessage({ mannerDeath: "Select The Manner Of Death" });
      return false;
    } else if (condition.trim().length === 0) {
      setIsError({ condition: true });
      setErrorMessage({ condition: "Select The Carcass Condition" });
      return false;
    } else if (disposition.trim().length === 0) {
      setIsError({ disposition: true });
      setErrorMessage({ disposition: "Select The Carcass Disposition" });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (countAnimal || date || mannerDeath || condition || disposition) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [countAnimal, date, mannerDeath, condition, disposition]);

  const EditMortalityFromData = () => {
    if (validation()) {
      let obj = {
        mortality_id:
          props.route.params?.mortalityData[0]?.mortality_id !== undefined
            ? props.route.params?.mortalityData[0]?.mortality_id
            : props.route.params?.mortalityData?.mortality_id,
        entity_id: entityId,
        entity_type: "animal",
        discovered_date: moment(date).format("YYYY-MM-DD"),
        is_estimate: Number(markLayDate),
        manner_of_death: mannerDeathId,
        reason_for_death: 0,
        carcass_condition: conditionId,
        carcass_disposition: dispositionId,
        notes: note,
        submitted_for_necropsy: Number(isSwitchOn),
        total_animal:
          props.route.params?.item?.total_animal > 1 ? countAnimal : 1,
      };
      setLoding(true);
      editAnimalMortality(obj)
        .then((res) => {
          if (res?.success) {
            successToast("Success", res?.message ?? "");
            navigation.goBack();
          }
          setLoding(false);
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!");
          setLoding(false);
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  const SetDropDown = (data) => {
    setIsSectionMenuOpen(data);
    setisEncEnvMenuOpen(false);
    setisEncTypeMenuOpen(false);
    setisEncTypeMenuOpen1(false);
    setisEncTypeMenuOpen2(false);
  };
  const SetEnvTypeDropDown = (data) => {
    setisEncEnvMenuOpen(data);
    setEntityOpen(false);
    setisEncTypeMenuOpen(false);
    setisEncTypeMenuOpen1(false);
    setisEncTypeMenuOpen2(false);
  };

  const SetEncTypeDropDown = (data) => {
    setisEncTypeMenuOpen(data);

    setisEncEnvMenuOpen(false);
    setEntityOpen(false);
    setisEncTypeMenuOpen1(false);
    setisEncTypeMenuOpen2(false);
  };
  const SetEncTypeDropDown1 = (data) => {
    setisEncTypeMenuOpen1(data);

    setisEncTypeMenuOpen2(false);
    setisEncEnvMenuOpen(false);
    setEntityOpen(false);
    setisEncTypeMenuOpen(false);
  };
  const SetEncTypeDropDown2 = (data) => {
    setisEncTypeMenuOpen2(data);
    setisEncEnvMenuOpen(false);
    setEntityOpen(false);
    setisEncTypeMenuOpen1(false);
    setisEncTypeMenuOpen(false);
  };

  const setSelectedDate = (item) => {
    let today = new Date();
    if (today < item) {
      errorDailog("Oops!!", "Select only today or previous date", "OK");
      return;
    }
    setDate(item);
  };

  const onPressMarkLayDate = () => {
    setMarkLayDate(!markLayDate);
  };

  const closeAllDropDown = () => {
    setisEncTypeMenuOpen2(false);
    setisEncEnvMenuOpen(false);
    setEntityOpen(false);
    setisEncTypeMenuOpen1(false);
    setisEncTypeMenuOpen(false);
  };

  const closeEntity = () => {
    setEntityOpen(false);
  };

  const closeManner = () => {
    setisEncEnvMenuOpen(false);
  };

  const closeCarcassCondition = () => {
    setisEncTypeMenuOpen(false);
  };

  const closeCarcassDisposition = () => {
    setisEncTypeMenuOpen1(false);
  };

  const closeNecropsy = () => {
    setisEncTypeMenuOpen2(false);
  };

  const diableDown = () => {
    setEntityOpen(false);
  };
  const handleToggleButton = () => {
    setToggleValue(!toggleValue);
  };
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };
  const onToggleSwitch1 = () => {
    // setIsSwitchOn(!isSwitchOn);
  };
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

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
        addMortalityMediaFun([getFileData(result.assets[0])])
      }
    } catch (err) {
      console.error("Error picking image:", err);
    } finally {
      setLoding(false);
    }
  };
  const handleImagePick = async () => {
    // try {
    //   // setLoding(true);
    //   const result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     allowsMultipleSelection: true, // Enable multi-selection
    //   });

    //   if (
    //     result &&
    //     !result.cancelled &&
    //     result.assets &&
    //     result.assets.length > 0
    //   ) {
    //     const selectedImages = result.assets.map((asset) => getFileData(asset));
    //     addMortalityMediaFun(selectedImages)
        
    //   }
    // } catch (err) {
    //   console.log("Error picking image:", err);
    // } finally {
    //   setLoding(false);
    // }
    // addMortalityMediaFun(await handleFilesPick(errorToast, "image", setLoding, [], true));
    let data=await handleFilesPick(errorToast, "image", setLoding, [], true)
    if (data&&data!=[]) {
      addMortalityMediaFun(data)
    }
  };
  const addMortalityMediaFun=(fileData)=>{
    if (fileData&&fileData?.length>0) {
      const obj={
        animal_id:entityId
      }
      addMortalityMedia(obj,fileData,'media_attachment[]').then((res)=>{
        if(res.success){
          successToast("Success ", res?.message);
          setSelectedItems([...selectedItems, ...res?.data]);
  
        }else{
          errorToast("error", res.message??"Oops! Something went wrong!");
        }
      }).catch((err)=>{
        errorToast("error", "Oops! Something went wrong!");
        console.log({err})
      })
    }
   
  }
  const removeDocuments = (id) => {
    const obj={
      id:id
    }
    setLoding(true)
    deleteMortalityMedia(obj).then((res)=>{
      if(res.success){
        successToast("Success ", res.message);
        setSelectedItems(selectedItems?.filter(p=>p?.id!=id))
      }else{
        errorToast("error", res.message??"Oops! Something went wrong!");
      }

    }).catch((err)=>{
      errorToast("error","Oops! Something went wrong!");
      console.log({err})
    }).finally(()=>{
      setLoding(false)
    })
    ;
  };
  return (
    <>
      <CustomForm
        header={true}
        title={"Edit Mortality"}
        paddingBottom={20}
        onPress={EditMortalityFromData}
      >
        <Loader visible={loading} />

        <AnimalCustomCard
          item={animalDetails}
          style={{
            backgroundColor: animalDetails
              ? constThemeColor.displaybgPrimary
              : constThemeColor.surface,
            borderWidth: animalDetails ? 2 : 1,
            borderColor: animalDetails ? constThemeColor.outline : "grey",
          }}
          animalIdentifier={
            !animalDetails?.local_identifier_value
              ? animalDetails?.animal_id
              : animalDetails?.local_identifier_name ?? null
          }
          localID={animalDetails?.local_identifier_value ?? null}
          icon={animalDetails?.default_icon}
          enclosureName={animalDetails?.user_enclosure_name}
          animalName={
            animalDetails?.common_name
              ? animalDetails?.common_name
              : animalDetails?.scientific_name
          }
          scientific_name={animalDetails?.scientific_name ?? null}
          sectionName={animalDetails?.section_name}
          show_specie_details={true}
          show_housing_details={true}
          chips={animalDetails?.sex}
          noArrow={true}
        />

        {props.route.params?.item?.total_animal > 1 && (
          <InputBox
            inputLabel={"Number of animals"}
            placeholder={"Number of animals"}
            value={countAnimal}
            errors={errorMessage.countAnimal}
            isError={isError.countAnimal}
            onChange={(data) => setCountAnimal(data)}
            keyboardType={"number-pad"}
            helpText={`Total dead animal count ${props.route.params?.item?.mortality_count}/${props.route.params?.item?.total_animal} `}
          />
        )}
        <View>
          <DatePicker
            today={date}
            onChange={setSelectedDate}
            title="Discovered Date"
            onOpen={closeAllDropDown}
            refs={dispositionDateRef}
          />

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox.Android
              status={markLayDate ? "checked" : "unchecked"}
              onPress={onPressMarkLayDate}
            />
            <Text style={styles.label}>Mark this date as approximate</Text>
          </View>

          {isError.date ? (
            <Text style={styles.errortext}>{errorMessage.date}</Text>
          ) : null}
        </View>

        <InputBox
          inputLabel={"Manner Of Death"}
          placeholder={"Manner Of Death"}
          editable={false}
          value={mannerDeath}
          refs={mannerofDeathRef}
          rightElement={isEncEnvMenuOpen ? "menu-up" : "menu-down"}
          onFocus={SetDropDown}
          DropDown={SetEnvTypeDropDown}
          errors={errorMessage.mannerDeath}
          isError={isError.mannerDeath}
        />

        <InputBox
          inputLabel={"Carcass Condition"}
          placeholder={"Choose Carcass Condition"}
          editable={false}
          value={condition}
          refs={carcassConditionRef}
          onFocus={SetEncTypeDropDown}
          rightElement={isEncTypeMenuOpen ? "menu-up" : "menu-down"}
          DropDown={SetEncTypeDropDown}
          errors={errorMessage.condition}
          isError={isError.condition}
        />

        <InputBox
          inputLabel={"Carcass Disposition"}
          placeholder={"Necropsy"}
          editable={false}
          value={disposition}
          refs={carcassDispositionRef}
          rightElement={isEncTypeMenuOpen1 ? "menu-up" : "menu-down"}
          onFocus={SetEncTypeDropDown1}
          DropDown={SetEncTypeDropDown1}
          errors={errorMessage.disposition}
          isError={isError.disposition}
        />

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
                backgroundColor: constThemeColor.surface,

                borderWidth: selectedItems?.length > 0 ? 2 : 1,
              },
            ]}
          >
            <View style={reduxColors.attatchmentViewinner}>
              <Text
                style={{
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
                justifyContent: "space-evenly",
              }}
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
              <TouchableOpacity activeOpacity={10} onPress={handleImagePick}>
                <View style={reduxColors.modalView}>
                  <View style={reduxColors.attachmentView}>
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
            {selectedItems.length > 0 ? <Divider bold /> : null}
            <View style={{ marginVertical: Spacing.small }}>
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
                  .filter(
                    (item) =>
                      item?.file_mime_type == "image/jpeg" ||
                      item?.file_mime_type == "image/png"
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
                        source={{ uri: item?.media_path }}
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
                          {item?.file?.slice(-12)}
                        </Text>
                        <MaterialCommunityIcons
                          name="close"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                          onPress={() => removeDocuments(item?.id)}
                        />
                      </View>
                    </View>
                  ))}
              </ScrollView>
            </View>
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
        <InputBox
          inputLabel={"Notes"}
          placeholder={"Notes"}
          editable={true}
          refs={notesRef}
          value={note}
          onChange={(val) => {
            setNotes(val);
          }}
          multiline={true}
          numberOfLines={1}
          errors={errorMessage.note}
          isError={isError.note}
          style={{
            backgroundColor: constThemeColor.notes,
            marginBottom: widthPercentageToDP(2),
          }}
        />

        <View
          style={[
            styles.boxStyle,
            {
              marginTop: heightPercentageToDP(2),
              backgroundColor: constThemeColor.displaybgPrimary,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: heightPercentageToDP("7.5%"),
              borderWidth: 2,
              borderRadius: 5,
              borderColor: constThemeColor.outline,
              padding: widthPercentageToDP(2),
            }}
          >
            <Text style={reduxColors.selectTextstyle}>Necropsy</Text>
            <Switch
              handleToggle={onToggleSwitch}
              active={isSwitchOn}
              blockToggle={true}
            />
          </View>
        </View>
      </CustomForm>
      {isEntityOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isEntityOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={closeEntity}
          >
            <Category
              categoryData={animalData}
              onCatPress={catPressed}
              heading={"Choose Entity"}
              isMulti={false}
              onClose={closeEntity}
            />
          </Modal>
        </View>
      ) : null}

      {isEncEnvMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isEncEnvMenuOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={closeManner}
          >
            <Category
              categoryData={mannerData}
              onCatPress={catEnvPress}
              heading={"Choose Nature Of Death"}
              isMulti={false}
              onClose={closeManner}
            />
          </Modal>
        </View>
      ) : null}

      {isEncTypeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isEncTypeMenuOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={closeCarcassCondition}
          >
            <Category
              categoryData={conditionData}
              onCatPress={catEnTypePress}
              heading={"Choose Carcass condition"}
              isMulti={false}
              onClose={closeCarcassCondition}
            />
          </Modal>
        </View>
      ) : null}

      {isEncTypeMenuOpen1 ? (
        <View>
          <Modal
            animationType="fade"
            visible={isEncTypeMenuOpen1}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={closeCarcassDisposition}
          >
            <Category
              categoryData={dispositionData}
              onCatPress={catEnTypePress1}
              heading={"Choose Carcass Disposition"}
              isMulti={false}
              onClose={closeCarcassDisposition}
            />
          </Modal>
        </View>
      ) : null}

      {isEncTypeMenuOpen2 ? (
        <View>
          <Modal
            animationType="fade"
            visible={isEncTypeMenuOpen2}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={closeNecropsy}
          >
            <Category
              categoryData={Necropsy}
              onCatPress={catEnTypePress2}
              heading={"Choose Necropsy "}
              isMulti={false}
              onClose={closeNecropsy}
            />
          </Modal>
        </View>
      ) : null}
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    label: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors?.neutral50,
    },
    errortext: {
      color: reduxColors.error,
    },
    errortext: {
      color: reduxColors.error,
    },
    boxStyle: {
      width: widthPercentageToDP(94),
      height: heightPercentageToDP(6.5),
      borderWidth: 1.2,
      borderColor: reduxColors.outlineVariant,
      borderRadius: 4,
      justifyContent: "center",
    },
    selectTextstyle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurface,
      textAlign: "left",
      lineHeight: 20,
      marginLeft: widthPercentageToDP(2),
    },
    attatchmentViewinner: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 10,
    },
    attatchmentView: {
      backgroundColor: reduxColors.surface,
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
    modalView: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.small,
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
  });
export default EditDisposition;
