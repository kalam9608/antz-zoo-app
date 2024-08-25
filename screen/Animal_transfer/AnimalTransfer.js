/*
 * Created By - Anirban Pan
 * ON -14.6.2023
 */
/*
 * React Import
 */
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Modal from "react-native-modal";
/*
 * Redux Import
 */
import { useDispatch, useSelector } from "react-redux";
import { removeAnimalTransferData } from "../../redux/AnimalTransferSlice";

/*
 * Responsive Import
 */
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

/*
 * Component Import
 */
import MoveAnimalHeader from "../../components/MoveAnimalHeader";
import RequestBy from "../../components/Move_animal/RequestBy";
import Loader from "../../components/Loader";

/*
 * React native paper Import
 */
import { Divider, TextInput } from "react-native-paper";

/*
 * Expo Import
 */
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

import FontSize from "../../configs/FontSize";
/*
 * API Import
 */
import { capitalize, dateFormatter } from "../../utils/Utils";
import SubmitBtn from "../../components/SubmitBtn";
import Category from "../../components/DropDownBox";
import { instituteList } from "../../services/MedicalMastersService";
import { createAnimalTransferRequest } from "../../services/Animal_transfer/TransferAnimalService";
import DynamicAlert from "../../components/DynamicAlert";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import Spacing from "../../configs/Spacing";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import Header from "../../components/Header";

import { MaterialIcons } from "@expo/vector-icons";
import Config, { AnimalStatsType } from "../../configs/Config";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";

const AnimalTransfer = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const [complete_name, setcomplete_name] = useState(
    props.route.params?.item.complete_name ?? ""
  );
  const [taxonomy_id, settaxonomy_id] = useState(
    props.route.params?.item.taxonomy_id ?? ""
  );
  const [user_enclosurename, setuser_enclosure_name] = useState(
    props.route.params?.item.user_enclosure_name ?? ""
  );
  const [section_name, setsection_name] = useState(
    props.route.params?.item.section_name ?? ""
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isInstituteMenuOpen, setIsInstituteMenuOpen] = useState(false);
  const [instituteData, setInstituteData] = useState([]);
  const [selectedInstituteData, setSelectedInstituteData] = useState("");
  const [selectedInstituteId, setSelectedInstituteId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const { height, width } = useWindowDimensions();

  const [animalError, setAnimalError] = useState(false);
  const [instituteError, setInstituteError] = useState(false);
  const [animalErrorMessage, setAnimalErrorMessage] = useState("");
  const [instituteErrorMessage, setInstituteErrorMessage] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  // For Dialouge type modal  =========================
  const [isModalVisible, setModalVisible] = useState(false);

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const confirmButtonPress = () => {
    animalTransfer();
    alertModalClose();
  };

  const cancelButtonPress = () => {
    alertModalClose();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      getRefreshData();
    });
    return unsubscribe;
  }, [navigation]);

  const getRefreshData = () => {
    instituteList(zooID)
      .then((res) => {
        setInstituteData(
          res.data.map((item) => {
            return {
              id: item.id,
              name: item.label,
            };
          })
        );
        setRefreshing(false);
        setIsLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setRefreshing(false);
        setIsLoading(false);
      });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  /*
   * Redux state value
   */
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const setAnimal = useSelector((state) =>
    props.route.params?.item
      ? props.route.params?.item
      : state.AnimalTransfer.animal
  );

  /*
   * Local state
   */
  const [reasonToMove, setReasonToMove] = useState("");
  const [loading, setLoading] = useState(false);

  /*
   * Navigation to screen
   */
  const gotoSearchScreen = (limit) => {
    navigation.navigate("CommonAnimalSelect", {
      screenName: "TransferAnimal",
      limit: limit,
    });
  };

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     () => {
  //       dispatch(removeAnimalTransferData()); // Dispatch the Redux action to clear the value
  //       return false; // Prevent the default back button behavior
  //     }
  //   );

  //   return () => {
  //     backHandler.remove(); // Clean up the event listener when the component unmounts
  //   };
  // }, []);
  const gotoBack = () => {
    dispatch(removeAnimalTransferData());
    navigation.goBack();
  };

  const catPressed = (item) => {
    setSelectedInstituteData(item.map((u) => u.name).join(", "));
    setSelectedInstituteId(item.map((id) => id.id).join(","));
    setIsInstituteMenuOpen(false);
  };
  const catClose = () => {
    setIsInstituteMenuOpen(false);
  };

  const toggleModal = () => {
    setIsInstituteMenuOpen(!isInstituteMenuOpen);
  };

  const validation = () => {
    setAnimalError(false);
    setInstituteError(false);
    setAnimalErrorMessage("");
    setInstituteErrorMessage("");

    let isValid = true;

    if (!setAnimal.animal_id) {
      setAnimalError(true);
      setAnimalErrorMessage("Please select this is required");
      isValid = false;
    } else if (!selectedInstituteId) {
      setInstituteError(true);
      setInstituteErrorMessage("Please select this is required");
      isValid = false;
    }

    return isValid;
  };

  const showAlert = () => {
    setIsVisible(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };

  const handleOK = () => {
    setIsVisible(false);
    if (alertType === "success") {
      navigation.replace("AnimalList", {
        type: AnimalStatsType.transferredAnimals,
        name: "Transferred Animals",
      });
    }
  };
  const handleCancel = () => {
    setIsVisible(false);
  };
  const handleSubmit = () => {
    if (validation()) {
      alertModalOpen();
    }
  };
  const animalTransfer = () => {
    let postData = {
      entity_id: setAnimal.animal_id,
      entity_type: 1,
      transfered_on: moment(selectedDate).format("YYYY-MM-DD hh:mm:ss"),
      transfered_to: selectedInstituteId,
      notes: reasonToMove,
    };
    createAnimalTransferRequest(postData)
      .then((res) => {
        if (res.success === true) {
          successToast("success", res?.message);

          setSelectedInstituteData("");
          setReasonToMove("");
          setSelectedDate("");
          dispatch(removeAnimalTransferData());
          navigation.replace("AnimalList", {
            type: AnimalStatsType.transferredAnimals,
            name: "Transferred Animals",
          });
        } else {
          errorToast("error", res?.message?.entity_id);
        }
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        // showAlert();
        setLoading(false);
      });
  };
  return (
    <>
      <Loader visible={loading} />
      {/* <MoveAnimalHeader
        title={""}
        headerTitle={dynamicStyles.headerTitle}
        gotoBack={gotoBack}
      /> */}
      <Header
        noIcon={true}
        title={"Transfer Animal"}
        // backGoesto={true}
        showBackButton={true}
        style={{ backgroundColor: constThemeColor.onPrimary }}
        backgroundColor={constThemeColor.onPrimary}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: constThemeColor.onPrimary }}
      >
        <View style={dynamicStyles.mainContainer}>
          <View style={dynamicStyles.conatiner}>
            <View style={[dynamicStyles.animalBox]}>
              <TouchableOpacity
                onPress={() => gotoSearchScreen(Infinity)}
                style={[
                  dynamicStyles.animalCardStyle,
                  // {
                  //   minHeight: setAnimal.animal_id
                  //     ? heightPercentageToDP(19)
                  //     : complete_name
                  //     ? heightPercentageToDP(18)
                  //     : heightPercentageToDP(6.8),
                  // },
                  {
                    //paddingHorizontal: setAnimal.animal_id ? 0 : Spacing.body,
                    paddingVertical: Spacing.body,
                  },
                  {
                    borderColor:
                      animalError && !setAnimal.animal_id
                        ? constThemeColor?.red
                        : constThemeColor?.outlineVariant,
                  },
                ]}
              >
                {/* {setAnimal.animal_id ? ( */}
                <Text
                  style={[
                    dynamicStyles.animalTextStyle,
                    { paddingHorizontal: Spacing.body },
                  ]}
                >
                  {setAnimal.animal_id
                    ? "Selected Animal"
                    : "Select Animal to be transferred"}
                </Text>
                {/* )  */}
                {/* // : (
                //   <Text
                //     style={[
                //       dynamicStyles.animalTextStyle,

                //       // { paddingTop: Spacing.body, paddingBottom: Spacing.body },
                //     ]}
                //   >
                //     {setAnimal.animal_id
                //       ? "Selected Animal"
                //       : "Select Animal to be transfered"}
                //   </Text>
                // )} */}

                {setAnimal?.animal_id ? (
                  <>
                    {/* <Divider /> */}
                    <AnimalCustomCard
                      item={setAnimal}
                      animalIdentifier={
                        !setAnimal?.local_identifier_value
                          ? setAnimal?.animal_id
                          : setAnimal?.local_identifier_name ?? null
                      }
                      localID={setAnimal?.local_identifier_value ?? null}
                      icon={setAnimal.default_icon}
                      enclosureName={setAnimal?.user_enclosure_name}
                      animalName={
                        setAnimal?.common_name
                          ? setAnimal?.common_name
                          : setAnimal?.scientific_name
                      }
                      sectionName={setAnimal?.section_name}
                      show_specie_details={true}
                      show_housing_details={true}
                      chips={setAnimal?.sex}
                      onPress={() => {
                        if (!props.route.params?.item) {
                          gotoSearchScreen(Infinity);
                        }
                      }}
                      style={{
                        backgroundColor: constThemeColor.surface,
                        shadowOpacity: 0,
                        //paddingTop:-Spacing.body
                      }}
                      noArrow={false}
                    />
                  </>
                ) : null}
              </TouchableOpacity>
              {!setAnimal.animal_id && animalError ? (
                <View style={dynamicStyles.errorBox}>
                  <Text style={dynamicStyles.errorMessage}>
                    {animalErrorMessage}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={dynamicStyles.commonBoxView}>
              <TouchableOpacity
                onPress={toggleModal}
                style={[
                  dynamicStyles.animalCardStyle,
                  {
                    // minHeight: selectedInstituteData
                    //   ? heightPercentageToDP(10)
                    //   : heightPercentageToDP(7),
                    paddingVertical: Spacing.body,
                  },
                  {
                    borderColor:
                      instituteError && !selectedInstituteData
                        ? constThemeColor.error
                        : constThemeColor.outlineVariant,
                  },
                ]}
              >
                <Text style={dynamicStyles.animalTextStyle}>
                  Select Institute
                </Text>
                {selectedInstituteData ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: Spacing.body,
                      marginTop: Spacing.body,
                    }}
                  >
                    <Text style={dynamicStyles.selectedInstituteData}>
                      {capitalize(selectedInstituteData)}
                    </Text>
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={24}
                      color={constThemeColor.onSurfaceVariant}
                    />
                    {/* <AntDesign
                      name="right"
                      size={14}
                      color={constThemeColor.onPrimaryContainer}
                      style={{ marginRight: widthPercentageToDP(7) }}
                    /> */}
                  </View>
                ) : null}
              </TouchableOpacity>
              {!selectedInstituteData && instituteError ? (
                <View style={dynamicStyles.errorBox}>
                  <Text style={dynamicStyles.errorMessage}>
                    {instituteErrorMessage}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={[dynamicStyles.commonBoxView]}>
              <View style={[dynamicStyles.reasonToMoveBox]}>
                <Text
                  style={[
                    dynamicStyles.animalTextStyle,
                    { paddingHorizontal: 0 },
                  ]}
                >
                  Notes
                </Text>
                <TextInput
                  multiline
                  style={dynamicStyles.inputbox}
                  mode="outlined"
                  value={reasonToMove}
                  placeholder="Enter reason to move"
                  outlineStyle={{
                    borderRadius: Spacing.small,
                    backgroundColor: constThemeColor.notes,
                  }}
                  onChangeText={(e) => setReasonToMove(e)}
                />
              </View>
            </View>

            <View style={dynamicStyles.commonBoxView}>
              <TouchableOpacity
                onPress={showDatePicker}
                style={[
                  dynamicStyles.animalCardStyle,
                  {
                    paddingVertical: Spacing.body,
                  },
                  // {
                  //   minHeight: selectedDate
                  //     ? heightPercentageToDP(10)
                  //     : heightPercentageToDP(7),
                  // },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: Spacing.body,
                  }}
                >
                  <Text style={dynamicStyles.animalTextStyle}>
                    Transfer Date
                  </Text>
                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={24}
                    color={constThemeColor.onSurfaceVariant}
                    //style={{ marginRight: widthPercentageToDP(4) }}
                  />
                </View>
                {selectedDate ? (
                  <Text style={dynamicStyles.selectedDateStyle}>
                    {dateFormatter(selectedDate)}
                  </Text>
                ) : null}
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              maximumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <DynamicAlert
            isVisible={isVisible}
            onClose={hideAlert}
            type={alertType}
            title={alertType === "success" ? "Success" : "Error"}
            message={alertMessage}
            onOK={handleOK}
            isCancelButton={alertType === "success" ? true : false}
            onCancel={handleCancel}
          />
        </View>
      </ScrollView>
      <View style={dynamicStyles.buttonContainer}>
        <SubmitBtn onPress={handleSubmit} />
      </View>

      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Are you sure you want to transfer the animal?"}
        closeModal={alertModalClose}
        firstButtonHandle={confirmButtonPress}
        secondButtonHandle={cancelButtonPress}
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

      {isInstituteMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isInstituteMenuOpen}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={catClose}
          >
            <Category
              categoryData={instituteData}
              onCatPress={catPressed}
              heading={"Choose Institute"}
              isMulti={false}
              onClose={catClose}
            />
          </Modal>
        </View>
      ) : null}
    </>
  );
};

export default AnimalTransfer;
const styles = (dynamicStyles) =>
  StyleSheet.create({
    mainContainer: {
      justifyContent: "space-between",
      flexDirection: "column",
      paddingHorizontal: Spacing.minor,
      paddingTop: Spacing.minor,
      //height: heightPercentageToDP(85),
    },
    conatiner: {
      flex: 1,
      alignItems: "center",
      backgroundColor: dynamicStyles.onPrimary,
    },
    animalBox: {
      width: "100%",
      marginVertical: Spacing.small,
      // marginTop: heightPercentageToDP(2.5),
      // width: widthPercentageToDP(90),
    },
    commonBoxView: {
      marginVertical: Spacing.small,
      width: "100%",
    },
    animalText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Small.fontWeight,
      color: dynamicStyles.neutralPrimary,
      paddingLeft: widthPercentageToDP(2),
    },
    selectedDateStyle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      color: dynamicStyles.onSurfaceVariant,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      marginHorizontal: Spacing.body,
      marginTop: Spacing.body,
    },
    selectedInstituteData: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      color: dynamicStyles.onSurfaceVariant,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    },
    animalCardStyle: {
      justifyContent: "center",
      //width: widthPercentageToDP(90),
      borderWidth: 1,
      borderRadius: Spacing.small,
      borderColor: dynamicStyles.outlineVariant,
      backgroundColor: dynamicStyles.surface,
    },
    reasonToMoveBox: {
      justifyContent: "center",
      width: "100%",
      borderWidth: 1,
      borderColor: dynamicStyles.outlineVariant,
      borderRadius: Spacing.small,
      //minHeight: heightPercentageToDP(13),
      backgroundColor: dynamicStyles.surface,
      paddingVertical: Spacing.body,
      paddingHorizontal: Spacing.body,
    },
    requestedByBox: {
      justifyContent: "flex-start",
      alignItems: "center",
      width: widthPercentageToDP(90),
      borderWidth: 1,
      borderRadius: Spacing.small,
      borderColor: dynamicStyles.outlineVariant,
      height: "auto",
      backgroundColor: dynamicStyles.surface,
    },

    animalTextStyle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: dynamicStyles.onSurface,
      paddingHorizontal: Spacing.body,
      // paddingLeft: widthPercentageToDP(5),
      // paddingLeft: Spacing.body,
      // paddingVertical: heightPercentageToDP(0.5),
    },
    headerTitle: {
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      color: dynamicStyles.neutralPrimary,
    },
    inputbox: {
      width: "100%",
      alignSelf: "center",
      color: dynamicStyles?.red,
      marginTop: Spacing.body,
    },
    cardstyle: {
      borderWidth: 0.5,
      borderColor: dynamicStyles.outlineVariant,
      backgroundColor: dynamicStyles.surface,
      borderRadius: widthPercentageToDP("3%"),
      marginVertical: widthPercentageToDP("2%"),
      flexDirection: "row",
      paddingHorizontal: 10,
      paddingVertical: Spacing.small,
      width: widthPercentageToDP(80),
    },
    cardstyle2: {
      backgroundColor: dynamicStyles.onPrimary,
      borderRadius: widthPercentageToDP("2%"),
      marginVertical: widthPercentageToDP("2%"),
      elevation: 1, // for shadow on Android
      shadowColor: dynamicStyles.neutralPrimary, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 1,
      flexDirection: "row",
      paddingHorizontal: Spacing.micro + Spacing.small,
      paddingVertical: Spacing.micro + Spacing.small,
    },
    footerStyle: {
      position: "absolute",
      bottom: 0,
    },
    mainTag: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: widthPercentageToDP(20),
      height: heightPercentageToDP(4),
    },
    tagscontainerM: {
      width: widthPercentageToDP(6),
      height: heightPercentageToDP(3),
      backgroundColor: dynamicStyles.surfaceVariant,
      borderRadius: 5,
      marginLeft: widthPercentageToDP(1.2),
      justifyContent: "center",
    },
    tagscontainerB: {
      width: widthPercentageToDP(6),
      height: heightPercentageToDP(3),
      backgroundColor: dynamicStyles.secondary,
      borderRadius: 5,
      justifyContent: "center",
    },
    errorBox: {
      textAlign: "left",
      marginTop: Spacing.micro,
      width: "100%",
    },
    errorMessage: {
      color: dynamicStyles.error,
    },
    buttonContainer: {
      width: "100%",
      //paddingHorizontal: Spacing.minor,
      paddingBottom: Spacing.body,
      backgroundColor: dynamicStyles.onPrimary,
    },
  });
