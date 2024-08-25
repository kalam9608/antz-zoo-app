import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React from "react";
import MoveAnimalHeader from "../../components/MoveAnimalHeader";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import SvgUri from "react-native-svg-uri";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import moment from "moment/moment";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import InputBox from "../../components/InputBox";
import Modal from "react-native-modal";
import Category from "../../components/DropDownBox";
import { List, TextInput } from "react-native-paper";
import SubmitBtn from "../../components/SubmitBtn";
import { FlatList } from "react-native";
import {
  calculateAge,
  getDocumentData,
  getFileData,
  ifEmptyValue,
} from "../../utils/Utils";
import { useEffect } from "react";
import {
  carcassDisposition,
  mannerOfDeath,
} from "../../services/AddDispositionService";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { NecropsyAdd, NecropsyEdit } from "../../services/NecropcyService";
import Loader from "../../components/Loader";
// import { errorDailog, errorToast, successDailog } from "../../utils/Alert";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import DynamicAlert from "../../components/DynamicAlert";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import { documentType } from "../../configs/Config";
import { useToast } from "../../configs/ToastConfig";
import { handleFilesPick } from "../../utils/UploadFiles";

const EditNecropsy = (props) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  const [Loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    props.route.params?.necropsyData?.discovered_date ?? new Date()
  );
  const [extraData, setExtraData] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isNecropsyDatePickerVisible, setIsNecropsyDatePickerVisible] =
    useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isNecropsyTimePickerVisible, setNecropsyTimePickerVisibility] =
    useState(false);
  const [selectedTime, setSelectedTime] = useState(
    props.route.params?.necropsyData?.discovered_time
      ? moment(props.route.params?.necropsyData?.discovered_time, "HH:mm:ss")
      : new Date()
  );
  const [isDeathModalOpan, setisDeathModalOpan] = useState(false);
  const [isDisposalModalOpan, setisDisposalModalOpan] = useState(false);
  const { height, width } = useWindowDimensions();
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [expand, setExpanded] = React.useState({
    Information: false,
    Basic: false,
  });
  //   const [first_name, setfirst_name] = useState();

  const [necropsyData, setNecropsyData] = useState(
    props.route.params?.necropsyData
  );
  const [documentModal, setDocumentModal] = useState(false);
  const [deathReasonList, setDeathReasonList] = useState([]);
  const [mannerDeath, setMannerDeath] = useState(
    props.route.params?.necropsyData?.cause_of_death ?? ""
  );
  const [mannerDeathId, setMannerDeathId] = useState(
    props.route.params?.necropsyData?.cause_of_death_id ?? ""
  );
  const [disposalList, setDisposalList] = useState([]);
  const [disposalName, setDisposalName] = useState(
    props.route.params?.necropsyData?.disposition ?? ""
  );
  const [disposalId, setDisposalId] = useState(
    props.route.params?.necropsyData.disposition_id
      ? props.route.params?.necropsyData.disposition_id
      : ""
  );
  const [selectedOrgans, setSelectedOrgans] = useState(
    props.route.params?.necropsyData?.necropsy_organs ?? []
  );
  const [bodyPartData, setBodyPartData] = useState([]);
  const [description, setDescription] = useState(
    props.route.params?.necropsyData?.general_description ?? ""
  );
  const [selectedItems, setSelectedItems] = useState([]);
  const [necropsyDate, setNecropsyDate] = useState(
    props.route.params?.necropsyData.necropsy_date ?? new Date()
  );

  const [necropsyTime, setNecropsyTime] = useState(
    props.route.params?.necropsyData?.necropsy_time
      ? moment(props.route.params?.necropsyData?.necropsy_time, "HH:mm:ss")
      : new Date()
  );

  const [placeOfDeath, setPlaceOfDeath] = useState(
    props.route.params?.necropsyData?.place_of_death ?? ""
  );
  const [bioTests, setBioTests] = useState(
    props.route.params?.necropsyData?.biological_test ?? ""
  );
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const { showToast, errorToast } = useToast();

  const dob = moment(props.route.params?.necropsyData?.birth_date);
  const today = moment(new Date());
  const duration = moment.duration(today.diff(dob));
  const years = duration?._data?.years;
  const months = duration?._data?.months;
  const days = duration?._data?.days;
  const hideAlert = () => {
    setIsVisible(false);
  };
  const showAlert = () => {
    setIsVisible(true);
  };
  const handleOK = () => {
    setIsVisible(false);
    if (alertType === "success") {
      navigation.goBack();
    }
  };
  const handleCancel = () => {
    navigation.goBack();
    setIsVisible(false);
  };

  const necropsySubmit = () => {
    setLoading(true);
    let obj = {
      animal_id: necropsyData?.animal_id,
      necropsy_id: parseInt(necropsyData?.id),
      necropsy_time: moment(necropsyTime).format("HH:mm:ss"),
      necropsy_date: moment(necropsyDate).format("YYYY-MM-DD"),
      general_description: description,
      place_of_death: placeOfDeath,
      biological_test: bioTests,
      body_part_data: JSON.stringify(bodyPartData),
      cause_for_death: mannerDeathId,
      disposal_method: disposalId,
      discovered_date: `${moment(selectedDate).format("YYYY-MM-DD")} ${moment(
        selectedTime
      ).format("HH:mm:ss")}`,
      mortality_id: necropsyData?.mortality_id,
    };
    NecropsyEdit(obj, selectedItems)
      .then((res) => {
        if (res.success) {
          showToast("success", res?.message);
          navigation.goBack();
        } else {
          showToast("error", res?.message);
        }
      })
      .catch((error) => {
        showToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        // showAlert();
        setLoading(false);
      });
  };
  const handlePressInformation = () => {
    setExpanded((prevState) => ({
      ...prevState,
      Information: !prevState.Information,
    }));
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const showNecropsyDatePicker = () => {
    setIsNecropsyDatePickerVisible(true);
  };

  const hideNecropsyDatePicker = () => {
    setIsNecropsyDatePickerVisible(false);
  };

  const handleNecropsyDatePick = (date) => {
    setNecropsyDate(date);
    hideNecropsyDatePicker();
  };
  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const showNecropsyTimePicker = () => {
    setNecropsyTimePickerVisibility(true);
  };

  const hideNecropsyTimePicker = () => {
    setNecropsyTimePickerVisibility(false);
  };

  const handleNecropsyTimePick = (time) => {
    // Format the selected time as desired
    const formattedTime = time.toLocaleTimeString("en-US", {
      timeStyle: "short",
    });

    setNecropsyTime(time);
    hideNecropsyTimePicker();
  };
  const handleConfirmTime = (time) => {
    // Format the selected time as desired
    const formattedTime = time.toLocaleTimeString("en-US", {
      timeStyle: "short",
    });

    setSelectedTime(time);
    hideTimePicker();
  };

  const catPressed = (item) => {
    setMannerDeath(item.map((u) => u.name).join(","));
    setMannerDeathId(item.map((id) => id.id).join(","));
    setisDeathModalOpan(!isDeathModalOpan);
  };

  const catClose = () => {
    setisDeathModalOpan(false);
  };

  const disposalOpen = (item) => {
    setDisposalName(item.map((u) => u.name).join(","));
    setDisposalId(item.map((id) => id.id).join(","));
    setisDisposalModalOpan(!isDisposalModalOpan);
  };

  const disposalClose = () => {
    setisDisposalModalOpan(false);
  };
  const saveExtraData = (e) => {
    setExtraData(e);
  };
  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      getMannerofDeath();
      getDisposal();
    });

    return subscribe;
  }, [navigation]);
  const getMannerofDeath = () => {
    mannerOfDeath()
      .then((res) => {
        setDeathReasonList(
          res.data?.map((item) => ({
            id: item?.id,
            name: item?.name,
            isSelect: item.name == necropsyData?.cause_of_death ? true : false,
          }))
        );
      })
      .catch((err) => {
        showToast("error", "Oops! Something went wrong!");
      });
  };

  const getDisposal = () => {
    carcassDisposition()
      .then((res) => {
        setDisposalList(
          res.data?.map((item) => ({
            id: item?.id,
            name: item?.name,
            isSelect: item.name == necropsyData?.disposition ? true : false,
          }))
        );
      })
      .catch((err) => {
        showToast("error", "Oops! Something went wrong!");
      });
  };
  useEffect(() => {
    // let data = [];
    // for (let i = 0; i < selectedOrgans?.length; i++) {
    //   for (let j = 0; j < selectedOrgans[i]?.parts?.length; j++) {
    //     let obj = {};
    //     (obj.body_part_id = selectedOrgans[i]?.parts[j]?.id),
    //       (obj.value = selectedOrgans[i]?.parts[j]?.value);
    //     data.push(obj);
    //   }
    // }
    let data = [];
    for (let i = 0; i < selectedOrgans?.length; i++) {
      for (let j = 0; j < selectedOrgans[i]?.parts?.length; j++) {
        let obj = {};
        if (selectedOrgans[i]?.parts[j]?.value) {
          obj.value = selectedOrgans[i]?.parts[j]?.value;
        }
        (obj.body_part_id = selectedOrgans[i]?.parts[j]?.id),
          bodyPartData.forEach((item) => {
            if (
              selectedOrgans[i]?.parts[j]?.id == item?.body_part_id &&
              !selectedOrgans[i]?.parts[j]?.value
            ) {
              obj.value = item.value;
            }
          });

        data.push(obj);
      }
    }
    setBodyPartData(data);
    const necropsy_attachment = [];
    for (const attachment of necropsyData.necropsy_attachment) {
      let doc = getDocumentData(attachment);
      necropsy_attachment.push(doc);
    }

    let totalPartsCount = 0;
    for (const organ of selectedOrgans) {
      totalPartsCount += organ.parts.length;
    }
    const allOrganIds = selectedOrgans.map((organ) => organ.id);
    let allPartIds = [];
    for (const organ of selectedOrgans) {
      allPartIds = allPartIds.concat(organ.parts.map((part) => part.id));
    }
    const allParts = [];
    for (const organ of selectedOrgans) {
      for (const part of organ.parts) {
        allParts.push(part);
      }
    }
    setSelectedItems(necropsy_attachment);
    setExtraData({
      selectCount: totalPartsCount,
      selectedOrganIds: allOrganIds,
      selectedPartIds: allPartIds,
      selectedCheckedBox: allPartIds,
      selectedParts: allParts,
    });
  }, [selectedOrgans]);

  const searchSelectData = (data) => {
    setSelectedOrgans(data);
    if (data?.length > 0) {
      setIsError({ bodyPart: false });
      setErrorMessage({ bodyPart: "" });
    }
  };
  const handleInputChange = (id, value) => {
    setBodyPartData((prevData) => {
      // Clone the data array to avoid directly mutating the state
      const newData = [...prevData];
      // Find the part with the given partId and update its value
      bodyPartData.forEach((part) => {
        if (part.body_part_id === id) {
          part.value = value;
        }
      });
      return newData;
    });
  };
  const renderItem = ({ item }) => (
    <View>
      <Text
        style={[
          reduxColors.searchItemName,
          {
            fontSize: FontSize.Antz_Body_Title.fontSize,
            fontWeight: FontSize.Antz_Body_Title.fontWeight,
            color: constThemeColor.outline,
            marginTop: Spacing.minor,
          },
        ]}
      >
        {item.label}
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={item?.parts}
        renderItem={({ item }) => (
          <View style={{ marginVertical: -Spacing.mini }}>
            <InputBox
              inputLabel={item.label}
              placeholder={`Enter ${item.label} Description`}
              multiline={false}
              editable={true}
              onChange={(value) => handleInputChange(item.id, value)}
              value={
                bodyPartData.find(
                  (dataItem) => dataItem.body_part_id === item.id
                )?.value || ""
              }
            />
          </View>
        )}
        keyExtractor={(item, index) => `item-${index}`}
      />
    </View>
  );
  const toggleModal = () => {
    setDocumentModal(!documentModal);
  };
  const docModalClose = () => {
    setDocumentModal(false);
  };

  const handleDocumentPick = async () => {
    setSelectedItems(
      await handleFilesPick(errorToast, "doc", setLoading, selectedItems, true)
    );
    setDocumentModal(false);
  };

  const handleImagePick = async () => {
    setSelectedItems(
      await handleFilesPick(
        errorToast,
        "image",
        setLoading,
        selectedItems,
        true
      )
    );
    setDocumentModal(false);
  };

  const removeDocuments = (uri) => {
    const filterData = selectedItems?.filter((item) => {
      return item.uri != uri;
    });
    setSelectedItems(filterData);
  };

  return (
    <>
      <Loader visible={Loading} />
      <View
        style={{
          flex: 1,
          backgroundColor: constThemeColor.onPrimary,
        }}
      >
        <MoveAnimalHeader
          title={"Edit Necropsy"}
          gotoBack={() => navigation.goBack()}
        />
        <ScrollView>
          <List.Section>
            <List.Accordion
              title={"Basic Information"}
              id="1"
              titleStyle={{
                color: constThemeColor.neutralPrimary,
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                paddingLeft: Spacing.small,
              }}
              style={{
                backgroundColor: constThemeColor.onPrimary,
              }}
              right={(props) => (
                <List.Icon
                  {...props}
                  icon="minus"
                  style={{ display: "none" }}
                />
              )}
              expanded={!expand.Basic}
            >
              <View style={reduxColors.headingView}>
                <Text
                  style={[
                    reduxColors.basicInfo,
                    // {
                    //   padding: 0,
                    //   fontSize: FontSize.Antz_Body_Medium.fontSize,
                    // },
                  ]}
                >
                  Animal Details
                </Text>
                <AnimalCustomCard
                  item={necropsyData}
                  style={{
                    backgroundColor: necropsyData
                      ? constThemeColor.displaybgPrimary
                      : constThemeColor.surface,
                    borderWidth: necropsyData ? 2 : 1,
                    borderColor: necropsyData
                      ? constThemeColor.outline
                      : "grey",
                  }}
                  animalIdentifier={
                    !necropsyData?.local_identifier_value
                      ? necropsyData?.animal_id
                      : necropsyData?.local_identifier_name ?? null
                  }
                  localID={necropsyData?.local_identifier_value ?? null}
                  icon={necropsyData?.default_icon}
                  enclosureName={necropsyData?.user_enclosure_name}
                  siteName={necropsyData?.site_name}
                  animalName={
                    necropsyData?.common_name
                      ? necropsyData?.common_name
                      : necropsyData?.scientific_name
                  }
                  sectionName={necropsyData?.section_name}
                  show_specie_details={true}
                  show_housing_details={true}
                  chips={necropsyData?.sex}
                  extra={
                    years || months || days
                      ? `Age - ${years ? `${years}y ` : ""}${
                          months ? `${months}m ` : ""
                        }${days ? `${days}d ` : ""}`
                      : ""
                  }
                  noArrow={true}
                />
              </View>

              <View
                style={[reduxColors.headingView, { paddingTop: Spacing.small }]}
              >
                <Text
                  style={[
                    reduxColors.basicInfo,
                    // {
                    //   padding: 0,
                    //   fontSize: FontSize.Antz_Body_Medium.fontSize,
                    // },
                  ]}
                >
                  Opinion
                </Text>
                <View
                // style={{ marginHorizontal: 12 }}
                >
                  <InputBox
                    inputLabel={"Cause of Death"}
                    placeholder="Choose Cause of Death"
                    value={mannerDeath}
                    editable={false}
                    onFocus={() => {
                      setisDeathModalOpan(true);
                    }}
                    rightElement={
                      isDeathModalOpan ? "chevron-up" : "chevron-down"
                    }
                    DropDown={() => {
                      setisDeathModalOpan(true);
                    }}
                  />
                </View>
              </View>

              {/* <View
                style={[
                  reduxColors.headingView,
                  { paddingTop: 0, paddingBottom: 0 },
                ]}
              > */}
              <View
                style={[reduxColors.headingView, { paddingTop: Spacing.small }]}
              >
                <Text
                  style={[
                    reduxColors.basicInfo,
                    // {
                    //   padding: 0,
                    //   fontSize: FontSize.Antz_Body_Medium.fontSize,
                    // },
                  ]}
                >
                  Necropsy Observation
                </Text>
                <View style={reduxColors.genralDescription}>
                  <InputBox
                    inputLabel={"Add Description"}
                    placeholder={"Enter Description"}
                    onChange={(value) => setDescription(value)}
                    multiline={true}
                    numberOfLines={5}
                    value={description}
                  />
                </View>
              </View>
              {/* <View
                style={[
                  reduxColors.headingView,
                  { paddingTop: 0, marginHorizontal: 12, marginVertical: 0 },
                ]}
              > */}
              <View style={[reduxColors.headingView, { paddingTop: 0 }]}>
                <InputBox
                  inputLabel={"Disposal method"}
                  placeholder=" "
                  editable={false}
                  value={disposalName}
                  onFocus={() => {
                    setisDisposalModalOpan(true);
                  }}
                  rightElement={
                    isDisposalModalOpan ? "chevron-up" : "chevron-down"
                  }
                  DropDown={() => {
                    setisDisposalModalOpan(true);
                  }}
                />
              </View>

              {/* <View style={[reduxColors.headingView, { paddingTop: 0 }]}> */}
              <View
                style={[reduxColors.headingView, { paddingTop: Spacing.small }]}
              >
                <Text
                  style={[
                    reduxColors.basicInfo,
                    // {
                    //   padding: 0,
                    //   fontSize: FontSize.Antz_Body_Medium.fontSize,
                    // },
                  ]}
                >
                  Organ-wise Description of Lesions
                </Text>
                <View style={reduxColors.parentOrgan}>
                  <TouchableOpacity
                    style={reduxColors.btnOrgan}
                    onPress={() =>
                      navigation.navigate("AddOrganSelection", {
                        data: selectedOrgans,
                        extraData: extraData,
                        onGoBack: (e) => searchSelectData(e),
                        saveExtraData: (e) => saveExtraData(e),
                      })
                    }
                  >
                    <View style={reduxColors.viewOrganStyle}>
                      <AntDesign
                        name="plus"
                        size={20}
                        color={constThemeColor.onSecondaryContainer}
                      />
                      <Text style={reduxColors.organStyle}>Select Organs</Text>
                    </View>
                  </TouchableOpacity>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={selectedOrgans}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `label-${index}`}
                  />
                </View>
              </View>

              {/* <View style={[reduxColors.headingView, { paddingTop: 0 }]}> */}
              <View
                style={[reduxColors.headingView, { paddingTop: Spacing.small }]}
              >
                <View style={reduxColors.attatchmentView}>
                  <TouchableOpacity
                    onPress={() => setDocumentModal(!documentModal)}
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
                      <View
                        style={{
                          backgroundColor: constThemeColor.secondaryContainer,
                          borderRadius: 100,
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
                  {selectedItems.map((item, index) => {
                    return (
                      <View style={[reduxColors.headingView]} key={index}>
                        <View style={reduxColors.attachBox}>
                          <MaterialIcons
                            name={
                              (item?.file_type || item?.type)?.split("/")[0] ==
                              "image"
                                ? "image"
                                : "picture-as-pdf"
                            }
                            size={24}
                            color={constThemeColor.onSurfaceVariant}
                          />
                          <View style={{ marginLeft: Spacing.body }}>
                            <Text style={reduxColors.attachText}>
                              {item?.name
                                ? item?.name
                                : item?.file_orginal_name}
                            </Text>
                          </View>
                          <MaterialCommunityIcons
                            name="close"
                            size={24}
                            color={constThemeColor.onSurfaceVariant}
                            style={{
                              position: "absolute",
                              right: 0,
                              padding: Spacing.mini,
                              // paddingHorizontal: Spacing.mini,
                            }}
                            onPress={() => removeDocuments(item?.uri)}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* <View style={[reduxColors.headingView]}> */}
              <View
                style={[reduxColors.headingView, { paddingTop: Spacing.minor }]}
              >
                <Text
                  style={[
                    reduxColors.basicInfo,
                    // {
                    //   padding: 0,
                    //   fontSize: FontSize.Antz_Body_Medium.fontSize,
                    // },
                  ]}
                >
                  Time and Date of Necropsy
                </Text>
              </View>
              <View style={reduxColors.dateTimeStyle}>
                <TouchableOpacity
                  onPress={showNecropsyTimePicker}
                  style={[
                    reduxColors.animalCardStyle,
                    {
                      // minHeight: heightPercentageToDP(7),
                      minHeight: 56,
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={reduxColors.timeTextStyle}>
                      {moment(necropsyTime, "HH:mm:ss").format("LT")}
                    </Text>

                    <MaterialIcons
                      name="access-time"
                      size={22}
                      color={constThemeColor.onSurfaceVariant}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={showNecropsyDatePicker}
                  style={[
                    reduxColors.animalCardStyle,
                    {
                      // minHeight: heightPercentageToDP(7),
                      minHeight: 56,
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={reduxColors.timeTextStyle}>
                      {moment(necropsyDate).format("Do MMM YY")}
                    </Text>
                    <AntDesign
                      name="calendar"
                      size={22}
                      color={constThemeColor.onSurfaceVariant}
                    />
                  </View>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isNecropsyDatePickerVisible}
                  mode="date"
                  date={new Date(necropsyDate)}
                  minimumDate={new Date(selectedDate)}
                  maximumDate={new Date()}
                  onConfirm={handleNecropsyDatePick}
                  onCancel={handleNecropsyDatePick}
                />
                <DateTimePickerModal
                  isVisible={isNecropsyTimePickerVisible}
                  mode="time"
                  minimumDate={new Date(selectedTime)}
                  maximumDate={new Date()}
                  date={new Date()}
                  onConfirm={handleNecropsyTimePick}
                  onCancel={handleNecropsyTimePick}
                />
              </View>
            </List.Accordion>
          </List.Section>

          <View>
            <List.Section>
              <List.Accordion
                title={
                  expand.Information
                    ? "Hide Additional information"
                    : "Show Additional information"
                }
                id="1"
                titleStyle={{
                  color: constThemeColor.onSurface,
                  fontSize: FontSize.Antz_Minor_Medium.fontSize,
                  fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                  paddingLeft: Spacing.small,
                }}
                style={{
                  backgroundColor: constThemeColor.onPrimary,
                  // paddingHorizontal: 20,
                }}
                expanded={expand.Information}
                onPress={handlePressInformation}
                right={(props) =>
                  expand.Information ? (
                    <List.Icon
                      {...props}
                      icon="minus"
                      color={constThemeColor.primary}
                    />
                  ) : (
                    <List.Icon
                      {...props}
                      icon="plus"
                      color={constThemeColor.primary}
                    />
                  )
                }
              >
                <View style={{ padding: 0 }}>
                  <View
                    style={[
                      reduxColors.headingView,
                      { paddingTop: Spacing.small },
                    ]}
                  >
                    <Text
                      style={[
                        reduxColors.basicInfo,
                        // {
                        //   padding: 0,
                        //   fontSize: FontSize.Antz_Body_Medium.fontSize,
                        //   paddingBottom: 1,
                        // },
                      ]}
                    >
                      Time and Date of Death
                    </Text>
                  </View>
                  <View style={reduxColors.dateTimeStyle}>
                    <TouchableOpacity
                      onPress={showTimePicker}
                      style={[
                        reduxColors.animalCardStyle,
                        {
                          // minHeight: heightPercentageToDP(7),
                          minHeight: 56,
                        },
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={reduxColors.timeTextStyle}>
                          {moment(selectedTime, "HH:mm:ss").format("LT")}
                        </Text>

                        <MaterialIcons
                          name="access-time"
                          size={22}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={showDatePicker}
                      style={[
                        reduxColors.animalCardStyle,
                        {
                          // minHeight: heightPercentageToDP(7),
                          minHeight: 56,
                        },
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={reduxColors.timeTextStyle}>
                          {moment(selectedDate).format("Do MMM YY")}
                        </Text>
                        <AntDesign
                          name="calendar"
                          size={22}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      </View>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      date={new Date(selectedDate)}
                      minimumDate={new Date(dob)}
                      maximumDate={new Date()}
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />
                    <DateTimePickerModal
                      isVisible={isTimePickerVisible}
                      mode="time"
                      date={new Date()}
                      onConfirm={handleConfirmTime}
                      onCancel={hideTimePicker}
                    />
                  </View>
                  <View
                    style={[
                      reduxColors.headingView,
                      { paddingTop: Spacing.small, marginHorizontal: 0 },
                    ]}
                  >
                    <InputBox
                      inputLabel={"Place of Death"}
                      placeholder={"Enter place of death"}
                      multiline={false}
                      onChange={(e) => setPlaceOfDeath(e)}
                      value={placeOfDeath}
                    />
                    <InputBox
                      inputLabel={"Enter Biological Tests Done If Any"}
                      placeholder={"Enter Biological tests done if any"}
                      multiline={false}
                      onChange={(e) => setBioTests(e)}
                      value={bioTests}
                    />
                  </View>
                </View>
              </List.Accordion>
            </List.Section>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: constThemeColor.onPrimary,
              marginBottom: Spacing.minor,
            }}
          >
            <SubmitBtn
              style={{ width: "100%" }}
              onPress={() => necropsySubmit()}
            />
          </View>
        </ScrollView>
      </View>

      {isDeathModalOpan ? (
        <View>
          <Modal
            animationType="fade"
            visible={isDeathModalOpan}
            style={stylesSheet.bottomSheetStyle}
            onRequestClose={catClose}
            onBackdropPress={catClose}
            onDismiss={catClose}
          >
            <Category
              categoryData={deathReasonList}
              onCatPress={catPressed}
              heading={"Cause of Death"}
              isMulti={false}
              onClose={catClose}
            />
          </Modal>
        </View>
      ) : null}

      {isDisposalModalOpan ? (
        <View>
          <Modal
            animationType="fade"
            visible={isDisposalModalOpan}
            style={stylesSheet.bottomSheetStyle}
            onRequestClose={disposalClose}
          >
            <Category
              onCatPress={disposalOpen}
              categoryData={disposalList}
              heading={"Disposal method"}
              isMulti={false}
              onClose={disposalClose}
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
          onDismiss={docModalClose}
          onBackdropPress={docModalClose}
          onRequestClose={docModalClose}
          style={[
            stylesSheet.bottomSheetStyle,
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
      ) : null}
      {/* <DynamicAlert
        isVisible={isVisible}
        onClose={hideAlert}
        type={alertType}
        title={alertType === "success" ? "Success" : "Error"}
        message={alertMessage}
        onOK={handleOK}
        isCancelButton={false}
        onCancel={handleCancel}
      /> */}
    </>
  );
};
// STYLES STARTS FROM HERE
const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
export default EditNecropsy;
const styles = (reduxColors) =>
  StyleSheet.create({
    headingView: {
      // padding: 10,
      // paddingBottom: 5,
      // paddingTop: 15,

      paddingHorizontal: Spacing.minor,
      paddingTop: Spacing.minor,
      paddingBottom: Spacing.small,
    },
    basicInfo: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      // padding: 10,
      // paddingLeft: 25,

      paddingLeft: Spacing.small,
    },
    image: {
      height: heightPercentageToDP(5),
      color: reduxColors.onPrimary,
      alignItems: "center",
      justifyContent: "center",
    },

    secondViewTitleText: {
      // fontStyle: "normal",
      marginTop: Spacing.mini,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      color: reduxColors.onSurfaceVariant,
      width: "100%",
    },
    dateTimeStyle: {
      display: "flex",
      flexDirection: "row",
      // justifyContent: "space-around",
      marginHorizontal: Spacing.minor,
      // marginVertical: 5,
      justifyContent: "space-between",
    },
    animalCardStyle: {
      justifyContent: "center",
      // width: widthPercentageToDP(43),
      width: "48%",
      borderWidth: 1,
      borderRadius: 6,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
      // paddingHorizontal: widthPercentageToDP(2.5),
      paddingHorizontal: Spacing.minor,
    },
    genralDescription: {
      // marginHorizontal: 12,
    },
    genralTextDescription: {
      padding: Spacing.body,
      color: reduxColors.onErrorContainer,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: reduxColors.outline,
      textAlignVertical: "top",
      backgroundColor: reduxColors.surface,
    },
    parentOrgan: {
      backgroundColor: reduxColors.background,
      // marginHorizontal: 13,
      borderRadius: 8,
      marginVertical: Spacing.small,
      padding: Spacing.minor,
    },
    btnOrgan: {
      // height: 60,
      padding: Spacing.minor,
      backgroundColor: reduxColors.secondaryContainer,
      borderRadius: 8,
      alignItem: "center",
      justifyContent: "center",
    },
    viewOrganStyle: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    errorBox: {
      textAlign: "left",
      width: "90%",
    },
    errorMessage: {
      color: reduxColors.error,
    },
    organStyle: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSecondaryContainer,
      left: Spacing.mini,
    },
    attatchmentViewinner: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.minor,
      // paddingTop: 10,
      // paddingBottom: 10,
      paddingVertical: Spacing.small,
    },
    attatchmentView: {
      backgroundColor: reduxColors.surface,
      // marginHorizontal: 13,
      borderWidth: 1,
      borderColor: reduxColors.outline,
      borderRadius: 4,
    },
    notesInput: {
      backgroundColor: reduxColors.notes,
      color: reduxColors.onErrorContainer,
      fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
      borderRadius: 4,
      marginVertical: Spacing.small,
    },
    timeTextStyle: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      color: reduxColors.onPrimaryContainer,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors?.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.surface,
      height: Math.floor(windowHeight * 0.15),
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
    },
    attachBox: {
      flexDirection: "row",
      alignItems: "center",
    },
    attachText: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSecondaryContainer,
      flexWrap: "wrap",
      width: widthPercentageToDP("60%"),
    },
  });
