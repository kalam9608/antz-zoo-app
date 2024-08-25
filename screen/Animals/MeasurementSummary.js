import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Divider } from "react-native-paper";
import DynamicAlert from "../../components/DynamicAlert";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import {
  addAnimalMeasurment,
  editMeasurmentSummary,
  getMeasurmentSummary,
  getMeasurmentUnit,
} from "../../services/AnimalService";
import Loader from "../../components/Loader";
import moment from "moment";
import MeasurmentFooterCom from "./MeasurmentFooterCom";
import Modal from "react-native-modal";
import { ScrollView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AgeCalculation from "../../utils/AgeCalculation";
import MeasSummaryList from "./MeasSummaryList";
import SummaryHeader from "../../components/SummaryHeader";
import SelectDropdown from "react-native-select-dropdown";
import { checkPermissionAndNavigateWithAccess } from "../../utils/Utils";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";

const MeasurementSummary = (props) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedTabName, setSelectedTabName] = useState(
    props?.route?.params.type
  );
  const [routes, setRoutes] = React.useState([]);
  const [animalDetails] = useState(props.route.params?.animalData);
  const [summaryData, setSummaryData] = useState([]);
  const [heightData, setHeightData] = useState({});
  const [flag, setFlag] = useState(false);
  const [allData, setAllData] = useState([]);
  const [up, setUp] = useState(false);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  useEffect(() => {
    getMeasurmentSummaryFunc();
  }, []);
  const getMeasurmentSummaryFunc = () => {
    setIsLoading(true);
    setFlag(false);
    getMeasurmentSummary(props.route.params?.animal_id)
      .then((response) => {
        setAllData(response.data);
        setSummaryData(response.data);
        const heightData = response.data
          .filter((item) => item.title === selectedTabName)
          .flatMap((item) => item);
        setHeightData(heightData);
      })
      .catch((error) => {
        errorToast("error", "Oops! Something went wrong!");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        setFlag(true);
      });
  };

  const componentSelect = (item) => {
    switch (item) {
      case selectedTabName:
        return () =>
          Height(
            heightData,
            animalDetails,
            getMeasurmentSummaryFunc,
            selectedTabName,
            setIsLoading,
            props.route.params?.dead,
            props.route.params?.deleted
          );
      default:
        return () => DefaultTab(isLoading, heightData?.length);
    }
  };
  const handleIndexChange = (selectedIndex) => {
    setIndex(selectedIndex);
    const selectedTabName = routes[selectedIndex].title;
    const heightData = allData
      .filter((item) => item.title === selectedTabName)
      .flatMap((item) => item);
    setHeightData(heightData);
    setSelectedTabName(selectedTabName);
  };
  useEffect(() => {
    const tabRoutes = summaryData.map((tab) => ({
      key: tab.title,
      title: tab.title,
      component: componentSelect(tab.title),
    }));
    setRoutes(tabRoutes);
  }, [summaryData, flag, heightData]);
  const generateScenes = () => {
    const scenes = {};
    routes.forEach((tab) => {
      scenes[tab.title] = tab.component;
    });
    return SceneMap(scenes);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      summaryData.filter((element, id) => {
        if (element.title === props.route.params?.type) {
          setIndex(props.route.params?.type === selectedTabName ? id : index);
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [summaryData]);

  return (
    <>
      <Loader visible={isLoading} />
      <SummaryHeader onPressBack={() => navigation.goBack()} hideMenu={true} />
      <Loader visible={isLoading} />
      <View
        style={{ paddingLeft: 12, backgroundColor: constThemeColor.background }}
      >
        <Text
          style={{
            fontSize: FontSize.Antz_Major_Regular.fontSize,
            fontWeight: FontSize.Antz_Major_Regular.fontWeight,
            color: constThemeColor.onPrimaryContainer,
          }}
        >
          Measurements
        </Text>
      </View>

      <View style={{ margin: Spacing.micro }}>
        <AnimalCustomCard
          item={animalDetails}
          style={{
            backgroundColor: constThemeColor.background,
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
            animalDetails?.vernacular_name
              ? animalDetails?.vernacular_name
              : animalDetails?.scientific_name
          }
          sectionName={animalDetails?.section_name}
          show_specie_details={true}
          show_housing_details={true}
          chips={animalDetails?.sex}
          noArrow={true}
        />
      </View>
      {flag && heightData ? (
        <TabView
          navigationState={{ index, routes }}
          renderScene={generateScenes()}
          onIndexChange={handleIndexChange}
          initialLayout={{ width: Dimensions.get("window").width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              scrollEnabled={true}
              style={{
                backgroundColor: constThemeColor.onPrimary,
                elevation: 0,
                borderBottomWidth: 1,
                borderBottomColor: constThemeColor.outlineVariant,
              }}
              labelStyle={{
                textAlign: "center",

                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
              }}
              tabStyle={{
                height: 44,
                width: "auto",
                marginHorizontal: 8,
              }}
              indicatorStyle={{
                backgroundColor: constThemeColor.onSurface,
                height: 4,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
              activeColor={constThemeColor.onSurface}
            />
          )}
        />
      ) : (
        <ListEmpty label="No Measurement data found" visible={isLoading} />
      )}
    </>
  );
};
const CustomModal = ({
  title,
  hideDatePicker,
  visible,
  type,
  animalDetails,
  handleConfirm,
  setToggleMeasurementModal,
  selectedUnitId,
  setComments,
  dateVal,
  setMeasurementValue,
  MeasurementValue,
  setSelectedUnitId,
  comments,
  handelMeasurmentSubmit,
  showDatePicker,
  setError,
  error,
  errorMessage,
  isDatePickerVisible,
  setUnitError,
  UnitError,
  errorUnitMessage,
  unitValue,
  onSubmit,
  up,
  setUp,
  unit,
  setUnit,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <Modal animationType="none" transparent={true} visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[reduxColors.container, { backgroundColor: "transparent" }]}
      >
        <View style={[reduxColors.modalOverlay]}>
          <View style={reduxColors.modalContainer}>
            <View style={reduxColors.modalHeader}>
              <View>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    color: constThemeColor.onPrimaryContainer,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  }}
                >
                  {type} {title}
                </Text>
              </View>
              <TouchableOpacity activeOpacity={1} style={reduxColors.closeBtn}>
                <Ionicons
                  name="close"
                  size={22}
                  color={constThemeColor.onSurface}
                  onPress={() => setToggleMeasurementModal(false)}
                />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <TouchableOpacity
                onPress={showDatePicker}
                style={[
                  reduxColors.animalCardStyle,
                  {
                    minHeight: heightPercentageToDP(7),
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
                  <Text style={reduxColors.animalTextStyle}>
                    {moment(dateVal).format("DD MMM YYYY")}
                  </Text>
                  <MaterialCommunityIcons
                    name="calendar-refresh-outline"
                    size={18}
                    color={constThemeColor.onSurfaceVariant}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  width: widthPercentageToDP(50),
                }}
              >
                <View style={reduxColors.commonBoxView}>
                  <TextInput
                    style={{
                      justifyContent: "center",
                      width: widthPercentageToDP(20),
                      borderWidth: 0.5,
                      borderRadius: 6,
                      borderColor: constThemeColor.onSurfaceVariant,
                      backgroundColor: constThemeColor.surface,
                      paddingHorizontal: widthPercentageToDP(2.5),
                      height: heightPercentageToDP(6.5),
                    }}
                    keyboardType="number-pad"
                    placeholder="00"
                    value={MeasurementValue}
                    onChangeText={(text) => {
                      setError(false);
                      setMeasurementValue(text);
                    }}
                  />
                  {error && (
                    <View style={{ textAlign: "left", width: "100%" }}>
                      <Text style={{ color: constThemeColor?.error }}>
                        {errorMessage}
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    reduxColors.commonBoxView,
                    { marginLeft: widthPercentageToDP(2.5) },
                  ]}
                >
                  <SelectDropdown
                    onFocus={() => {
                      setUp(true);
                    }}
                    onBlur={() => {
                      setUp(false);
                    }}
                    defaultButtonText={unit ? unit : "select unit"}
                    selectedRowStyle={{
                      backgroundColor: constThemeColor.surface,
                    }}
                    showsVerticalScrollIndicator={false}
                    buttonStyle={{
                      borderWidth: 0.5,
                      borderRadius: 6,
                      borderColor: constThemeColor.onSurfaceVariant,
                      backgroundColor: constThemeColor.surface,
                      width: widthPercentageToDP(27),
                      height: heightPercentageToDP(6.5),
                    }}
                    data={unitValue}
                    onSelect={(selectedItem, index) => {
                      setUnitError(false);
                      setSelectedUnitId(selectedItem?.id);
                    }}
                    rowStyle={{
                      borderBottomWidth: 0,
                      height: heightPercentageToDP(6),
                    }}
                    dropdownStyle={{
                      height: heightPercentageToDP(15),
                      paddingHorizontal: 5,
                      borderWidth: 0.5,
                      backgroundColor: constThemeColor.onPrimary,
                      borderRadius: 5,
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem?.uom_abbr;
                    }}
                    buttonTextStyle={{
                      textAlign: "left",
                      fontSize: FontSize.Antz_Body_Title.fontSize,
                      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                    }}
                    rowTextForSelection={(item, index) => {
                      return item?.uom_abbr;
                    }}
                    rowTextStyle={{
                      textAlign: "left",
                      fontSize: FontSize.Antz_Body_Title.fontSize,
                    }}
                    renderDropdownIcon={() => {
                      return (
                        <>
                          {up ? (
                            <MaterialIcons
                              name="keyboard-arrow-up"
                              size={24}
                              color="black"
                            />
                          ) : (
                            <MaterialIcons
                              name="keyboard-arrow-down"
                              size={24}
                              color="black"
                            />
                          )}
                        </>
                      );
                    }}
                  />

                  {UnitError && (
                    <View style={{ textAlign: "left", width: "100%" }}>
                      <Text style={{ color: constThemeColor?.error }}>
                        {errorUnitMessage}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <View style={reduxColors.itemRow}>
                <TextInput
                  autoCompleteType="off"
                  style={reduxColors.notesInput}
                  placeholder="Add Notes"
                  placeholderTextColor={constThemeColor.onErrorContainer}
                  multiline
                  value={comments}
                  onChangeText={(text) => setComments(text)}
                />
              </View>
            </ScrollView>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              minimumDate={new Date(animalDetails?.birth_date)}
              maximumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          <View
            style={{
              width: "96%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: constThemeColor.addBackground,
              paddingVertical: 20,
              height: heightPercentageToDP(12),
            }}
          >
            <TouchableOpacity
              style={[reduxColors.modalBtnCover]}
              onPress={() => {
                if (type == "Edit") {
                  onSubmit();
                } else {
                  handelMeasurmentSubmit();
                }
              }}
            >
              <Text style={reduxColors.bottomBtnTxt}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
const Height = (
  data,
  animalDetails,
  getMeasurmentSummaryFunc,
  header,
  isLoading,
  dead,
  deleted
) => {
  const [toggleMeasurementModal, setToggleMeasurementModal] = useState(false);
  const [measurementTypeId] = useState(data[0]?.key);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [MeasurementValue, setMeasurementValue] = useState([]);
  const [dateVal, setDate] = useState([]);
  const [comments, setComments] = useState([]);
  const [unitValue, setUnitValue] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [measurementId, setmeasurmentId] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMeasurementType, setModalMeasurementTypeTitle] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [type, setType] = useState("");
  const [Id, setId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorUnitMessage, setErrorUnitMessage] = useState("");
  const [UnitError, setUnitError] = useState(false);
  const [unit, setUnit] = useState("");
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const permission = useSelector((state) => state.UserAuth.permission);
  const [birthDateItem, setbirthDateItem] = useState();
  const [up, setUp] = useState(false);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  const showDatePicker = () => {
    if (
      moment(birthDateItem || animalDetails.birth_date)?.format(
        "MMMM Do YYYY"
      ) != moment(new Date())?.format("MMMM Do YYYY")
    ) {
      setDatePickerVisibility(true);
    } else {
      // errorToast("Oops!!", "You can't select date for a new born animal");
      errorToast("error", "You can't select date for a new born animal");
    }
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };

  const handleOpenModal = (item, id, title, measurement_type, type) => {
    setError(false);
    setErrorMessage("");
    setUnitError(false);
    setErrorUnitMessage("");
    setbirthDateItem(item?.birth_date ?? null);
    setType(type);
    if (type == "Edit") {
      if (
        checkPermissionAndNavigateWithAccess(
          permission,
          "collection_animal_record_access",
          null,
          null,
          null,
          "EDIT"
        )
      ) {
        setmeasurmentId(id);
        setToggleMeasurementModal(true);
        setUnit(item.uom_abbr);
        setMeasurementValue(item.measurement_value);
        setDate(item.record_date);
        setComments(item.comments);
        setSelectedUnitId(item?.unit_id);
        setId(item?.UOM_id);
        setModalData(item);
        setModalTitle(title);
      } else {
        warningToast("Restricted", "You do not have permission to access!!");
      }
    } else {
      if (
        checkPermissionAndNavigateWithAccess(
          permission,
          "collection_animal_record_access",
          null,
          null,
          null,
          "ADD"
        )
      ) {
        setToggleMeasurementModal(true);
        setmeasurmentId(id);
        setSelectedUnitId(null);
        setMeasurementValue("");
        setUnit("");
        setDate(new Date());
        setComments("");
        setModalData({});
        setModalTitle(title);
      } else {
        warningToast("Restricted", "You do not have permission to access!!");
      }
    }
    setModalMeasurementTypeTitle(measurement_type);
  };
  useEffect(() => {
    if (modalMeasurementType) {
      getMeasurmentUnit(modalMeasurementType)
        .then(({ data }) => {
          setUnitValue(data);
        })
        .catch((error) => {
          errorToast("error", "Oops! Something went wrong!");
        });
    }
  }, [modalMeasurementType]);
  const showAlert = () => {
    setIsVisible(true);
  };
  const handleOK = () => {
    setIsVisible(false);
    if (alertType === "success") {
      getMeasurmentSummaryFunc();
    }
  };
  const handleCancel = () => {
    setToggleMeasurementModal(false);
    setIsVisible(false);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };
  const validation = () => {
    setError(false);
    setErrorMessage("");
    setUnitError(false);
    setErrorUnitMessage("");
    if (!MeasurementValue) {
      setError(true);
      setErrorMessage("Enter value");
      return false;
    }
    if (!selectedUnitId) {
      setUnitError(true);
      setErrorUnitMessage("Select unit");
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (validation()) {
      isLoading(true);
      var obj = {
        animal_id: animalDetails?.animal_id,
        measurement_type_id: measurementTypeId,
        measurement_unit_id: selectedUnitId,
        measurement_value: MeasurementValue,
        record_date: moment(dateVal).format("YYYY-MM-DD"),
        comments: comments,
        id: Id,
      };
      editMeasurmentSummary(obj)
        .then((res) => {
          if (res.success == true) {
            setToggleMeasurementModal(false);
            successToast("success", res?.message);
            getMeasurmentSummaryFunc();
          } else {
            errorToast("error", res?.message);
          }
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!");

          setToggleMeasurementModal(false);
          setIsLoading(false);
        })
        .finally(() => {
          isLoading(false);
          setToggleMeasurementModal(false);
          // showAlert();
        });
    }
  };
  const handelMeasurmentSubmit = () => {
    if (validation()) {
      isLoading(true);
      setToggleMeasurementModal(false);
      const obj = {
        animal_id: animalDetails?.animal_id,
        measurement_type_id: measurementTypeId,
        measurement_unit_id: selectedUnitId,
        measurement_value: MeasurementValue,
        record_date: moment(dateVal).format("YYYY-MM-DD"),
        comments: comments,
      };
      addAnimalMeasurment(obj)
        .then((response) => {
          if (response.success) {
            successToast("success", response?.message);
            getMeasurmentSummaryFunc();
          } else {
            errorToast("error", response?.message);
          }
        })
        .catch((e) => {
          errorToast("error", "Oops! Something went wrong!");

          isLoading(false);
        })
        .finally(() => {
          setToggleMeasurementModal(false);
          isLoading(false);
          // showAlert();
        });
    }
  };
  return (
    <>
      <View
        style={[
          reduxColors.containerTabs,
          { backgroundColor: constThemeColor.onPrimary },
        ]}
      >
        <View style={reduxColors.dateView}>
          <Text style={reduxColors.dateText}>Date</Text>
          <Text style={reduxColors.dateText}>{header}</Text>
          <Text style={reduxColors.dateText}>Age</Text>
        </View>
        <Divider
          style={{ borderWidth: 0.2, borderColor: constThemeColor.outline }}
        />
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 20,
          }}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data[0]?.measurements}
            width="100%"
            style={{ marginTop: 5, marginBottom: 145 }}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <MeasSummaryList
                    day={item.record_date}
                    month={item.record_date}
                    dead={dead}
                    deleted={deleted}
                    year={item.record_date}
                    measurement_value={item.measurement_value}
                    measurementUOM={item.uom_abbr}
                    age={
                      <AgeCalculation
                        from={item.birth_date}
                        to={item.record_date}
                      />
                    }
                    comments={item.comments}
                    onPress={() =>
                      handleOpenModal(
                        item,
                        data[0]?.key,
                        data[0]?.title,
                        data[0]?.measurement_type,
                        "Edit"
                      )
                    }
                  />
                </View>
              );
            }}
          />
        </View>
        <DynamicAlert
          isVisible={isVisible}
          onClose={hideAlert}
          type={alertType}
          title={alertType === "success" ? "Success" : "Error"}
          message={alertMessage}
          onOK={handleOK}
          // isCancelButton={alertType === "success" ? true : false}
          onCancel={handleCancel}
        />
      </View>
      {dead || deleted ? null : (
        <MeasurmentFooterCom
          name={`Add New ${header}`}
          onPress={() =>
            handleOpenModal(
              "",
              data[0]?.key,
              data[0]?.title,
              data[0]?.measurement_type,
              "Add"
            )
          }
        />
      )}
      <CustomModal
        title={data[0]?.title?.toLowerCase()}
        setToggleMeasurementModal={setToggleMeasurementModal}
        dateVal={dateVal}
        visible={toggleMeasurementModal}
        setMeasurementValue={setMeasurementValue}
        setSelectedUnitId={setSelectedUnitId}
        measurementTypeId={measurementTypeId}
        setComments={setComments}
        isDatePickerVisible={isDatePickerVisible}
        handleConfirm={handleConfirm}
        hideDatePicker={hideDatePicker}
        onSubmit={onSubmit}
        comments={comments}
        UnitError={UnitError}
        animalDetails={animalDetails}
        errorUnitMessage={errorUnitMessage}
        selectedUnitId={selectedUnitId}
        unitValue={unitValue}
        setUnitError={setUnitError}
        error={error}
        errorMessage={errorMessage}
        setError={setError}
        showDatePicker={showDatePicker}
        MeasurementValue={MeasurementValue}
        handelMeasurmentSubmit={handelMeasurmentSubmit}
        type={type}
        up={up}
        setUp={setUp}
        unit={unit}
        setUnit={setUnit}
      />
    </>
  );
};

const DefaultTab = (isLoading, length) => {
  return (
    <>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    </>
  );
};
export default MeasurementSummary;

const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
const styles = (reduxColors) =>
  StyleSheet.create({
    containerTabs: {
      height: "100%",
    },
    container: {
      alignSelf: "center",
      height: heightPercentageToDP("100%"),
      width: widthPercentageToDP("100%"),
    },
    scene: {
      flex: 1,
    },
    tabBar: {
      backgroundColor: reduxColors.onPrimary,
      color: "black",
    },

    secondViewTitleText: {
      fontStyle: "normal",
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      color: reduxColors.onSurfaceVariant,
      width: widthPercentageToDP(60),
    },
    secondSymbolOne: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      textAlign: "center",
      width: 21,
      height: 18,
      backgroundColor: reduxColors.surfaceVariant,
      borderRadius: 5,
      left: 10,
      top: 8,
      fontSize: 12,
    },
    medicalEachSection: {
      marginBottom: heightPercentageToDP(2),
    },
    medicalHeadingSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    title: {
      color: reduxColors.onSurfaceVariant,
      marginLeft: widthPercentageToDP(3.5),
      fontSize: FontSize.Antz_Subtext_Medium.fontSize,
      fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
      marginBottom: 2,
    },
    image: {
      height: heightPercentageToDP(5),
      color: reduxColors.onPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
    dateView: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 11,
      paddingTop: 15,
    },
    dateText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.outline,
    },
    weightView: {
      marginVertical: 8,
      borderRadius: 10,
    },
    weightViewinside: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 10,
      paddingHorizontal: 20,
    },
    weight: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
    },
    ageView: {
      alignItems: "center",
      justifyContent: "center",
    },
    ageStyle: {
      color: reduxColors.onSurfaceVariant,
      alignItems: "center",
    },
    commentStyle: {
      paddingHorizontal: 25,
    },
    image: {
      width: 44,
      height: 44,
      borderRadius: 50,
      alignSelf: "center",
      justifyContent: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      height: Math.floor(windowHeight * 0.35),
      width: "96%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalHeader: {
      height: heightPercentageToDP(8),
      width: widthPercentageToDP(85),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalItem: {
      minHeight: heightPercentageToDP(10),
    },
    closeBtn: {
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },

    modalBody: {
      height: "100%",
      flex: 1,
      width: "90%",
    },
    modalNotesBtnCover: {
      width: "auto",
      height: 38,
      marginVertical: 6,
      paddingVertical: 2,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderRightWidth: 0,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
    modalBtnCover: {
      margin: 10,
      paddingVertical: 2,
      paddingHorizontal: 20,
      borderRadius: 3,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      height: heightPercentageToDP(4.5),
      backgroundColor: reduxColors.primary,
    },
    notesInput: {
      width: "100%",
      minHeight: 41,
      padding: 10,
      paddingTop: 11,
      backgroundColor: reduxColors.notes,
      color: reduxColors.onErrorContainer,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      lineHeight: 17,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: reduxColors.onErrorContainer,
      marginBottom: 15,
    },
    bottomBtnTxt: {
      fontSize: Spacing.minor,
      color: reduxColors.onPrimary,
    },
    animalCardStyle: {
      justifyContent: "center",
      width: widthPercentageToDP(85),
      borderWidth: 0.5,
      borderRadius: 6,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
      paddingHorizontal: widthPercentageToDP(2.5),
    },
    itemRow: {
      flexDirection: "row",
      marginTop: heightPercentageToDP(2),
      alignItems: "center",
      width: widthPercentageToDP(85),
    },
    commonBoxView: {
      marginTop: heightPercentageToDP(2),
    },
  });
