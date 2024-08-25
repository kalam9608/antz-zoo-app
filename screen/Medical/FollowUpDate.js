import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
// import MedicalHeader from "./MedicalHeader";
import MedicalHeader from "../../components/MedicalHeader";
import Footermedical from "../../components/Footermedical";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import {
  setFormatData,
  setTotalDaysData,
  setSelectDurationData,
  setfollowUpDate,
  setShowFollowUpDate,
} from "../../redux/MedicalSlice";
import { useDispatch, useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { BackHandler } from "react-native";
import Header from "../../components/Header";

const FollowUpDate = () => {
  const navigation = useNavigation();
  const [commonlyUsed, setCommonlyUsed] = useState([
    { name: "days", no_of_days: 3 },
    { name: "week", no_of_days: 1 },
    { name: "days", no_of_days: 15 },
  ]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const formatData = useSelector((state) => state.medical.format);
  const totalDaysData = useSelector((state) => state.medical.totalDays);
  const selectDurationData = useSelector(
    (state) => state.medical.selectDuration
  );
  const followUpDateData = useSelector((state) => state.medical.followUpDate);
  const showFollowUpDateData = useSelector(
    (state) => state.medical.showFollowUpDate
  );

  // const [format, setFormat] = useState("days");
  // const [selectDateFromDpicker, setSelectDateFromDpicker] = useState(
  //   moment(Date.now()).format("DD MMM YYYY")
  // );
  // const [totalDays, setTotalDays] = useState("0");
  // const [selectDuration, setSelectDuration] = useState("");
  // const [followUpDate, setFollowUpDate] = useState();

  const [todaysDate] = useState(moment(Date.now()).format("DD MMM YYYY"));
  const [format, setFormat] = useState(formatData);
  const [totalDays, setTotalDays] = useState(totalDaysData);
  const [selectDuration, setSelectDuration] = useState(selectDurationData);
  const [followUpDate, setFollowUpDate] = useState(followUpDateData);
  const [selectDateFromDpicker, setSelectDateFromDpicker] =
    useState(showFollowUpDateData);

  const dispatch = useDispatch();

  // fot taking reduxColors from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  useEffect(() => {}, [selectDuration]);
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

  const handleConfirm = (date) => {
    const formattedDate = moment(date)?.format("DD MMM YYYY");
    setSelectDateFromDpicker(formattedDate);
    setFollowUpDate(moment(date)?.format("DD-MM-YYYY"));
    const startDate = moment(todaysDate, "DD MMM YYYY");
    const endDate = moment(date);
    const daysDiff = endDate?.diff(startDate, "days");
    setSelectDuration(daysDiff);
    hideDatePicker();
  };

  const navigatePreviousScreen = () => {
    dispatch(setFormatData(format));
    dispatch(setTotalDaysData(totalDays));
    dispatch(setSelectDurationData(selectDuration));
    dispatch(setfollowUpDate(followUpDate));
    dispatch(setShowFollowUpDate(selectDateFromDpicker));
    navigation.navigate("Notes");
  };
  const clickFunc = () => {
    dispatch(setFormatData(format));
    dispatch(setTotalDaysData(totalDays));
    dispatch(setSelectDurationData(selectDuration));
    dispatch(setfollowUpDate(followUpDate));
    dispatch(setShowFollowUpDate(selectDateFromDpicker));
    navigation.navigate("AddMedical");
  };
  const changeDuration = (e) => {
    let number = e === "" ? "0" : e;
    setSelectDateFromDpicker(moment(Date.now()).format("DD MMM YYYY"));
    setSelectDuration(e);
    if (format === "days") {
      setTotalDays(parseInt(number));
    } else if (format === "week") {
      setTotalDays(number * 7);
    } else if (format === "months") {
      setTotalDays(number * 30);
    }
  };
  const changeFormat = (e) => {
    setFormat(e);
  };
  useEffect(() => {
    changeDuration(selectDuration);
  }, [totalDays, selectDuration, format]);

  useEffect(() => {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + parseInt(totalDays));
    let formattedDate = moment(startDate).format("DD MMM YYYY");
    setSelectDateFromDpicker(formattedDate);
    setFollowUpDate(moment(startDate).format("DD-MM-YYYY"));
  }, [totalDays]);

  return (
    <>
      {/* <MedicalHeader title="Follow Up Date" noIcon={true} /> */}
      <Header
        title={"Follow Up Date"}
        headerTitle={reduxColors.headerTitle}
        noIcon={true}
        search={false}
        hideMenu={true}
        backgroundColor={constThemeColor?.onPrimary}
        customBack={() => navigation.navigate("AddMedical")}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={reduxColors.container}>
          <View style={reduxColors.center}>
            <Text
              style={{
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                color: constThemeColor?.onSecondaryContainer,
                marginBottom: Spacing.minor,
              }}
            >
              Next follow Up Date
            </Text>
            <TextInput
              accessible={true}
              accessibilityLabel={"followUpDateInput"}
              AccessibilityId={"followUpDateInput"}
              theme={{ colors: "none" }}
              style={[
                reduxColors.input,
                {
                  paddingHorizontal:
                    selectDuration.toString().length > 1
                      ? Spacing.mini
                      : Spacing.minor,
                },
              ]}
              maxLength={3}
              placeholder="0"
              value={selectDuration.toString()}
              keyboardType="numeric"
              onChangeText={(e) => changeDuration(e)}
              autoCompleteType="off"
            />
            <View style={reduxColors.itemRow}>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={"followUpDateDaysBtn"}
                AccessibilityId={"followUpDateDaysBtn"}
                style={[
                  format === "days"
                    ? reduxColors.activeFormatBtnCover
                    : reduxColors.formatBtnCover,
                  {
                    borderTopLeftRadius: Spacing.mini,
                    borderBottomLeftRadius: Spacing.mini,
                  },
                ]}
                onPress={() => changeFormat("days")}
              >
                <Text style={reduxColors.caseTypeBtnTxt}>Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={"followUpDateWeekBtn"}
                AccessibilityId={"followUpDateWeekBtn"}
                style={
                  format === "week"
                    ? reduxColors.activeFormatBtnCover
                    : reduxColors.formatBtnCover
                }
                onPress={() => changeFormat("week")}
              >
                <Text style={[reduxColors.caseTypeBtnTxt]}>Weeks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={"followUpDateMonthBtn"}
                AccessibilityId={"followUpDateMonthBtn"}
                style={[
                  format === "months"
                    ? reduxColors.activeFormatBtnCover
                    : reduxColors.formatBtnCover,
                  {
                    borderRightWidth: 1,
                    borderTopRightRadius: Spacing.mini,
                    borderBottomRightRadius: Spacing.mini,
                  },
                ]}
                onPress={() => changeFormat("months")}
              >
                <Text style={reduxColors.caseTypeBtnTxt}>Months</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={showDatePicker}
                style={reduxColors.datePicker}
                accessible={true}
                accessibilityLabel={"followUpDateCalenderBtn"}
                AccessibilityId={"followUpDateCalenderBtn"}
              >
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={40}
                  color={constThemeColor.secondary}
                />
                <Text style={reduxColors.dateTxt}>{selectDateFromDpicker}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                minimumDate={new Date()}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          </View>
          <View style={[reduxColors.center,{marginTop:Spacing.minor}]}>
            <Text
              style={{
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                color: constThemeColor?.onSecondaryContainer,
              }}
            >
              Commonly used
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: Spacing.minor,
              }}
            >
              {commonlyUsed.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      changeFormat(item?.name);
                      changeDuration(item?.no_of_days);
                    }}
                    style={reduxColors.commonUsedButton}
                    accessible={true}
                    accessibilityLabel={"followUpDateCommonBtn"}
                    AccessibilityId={"followUpDateCommonBtn"}
                    disabled={
                      item?.name == format &&
                      (item?.name === "week"
                        ? item?.no_of_days * 7
                        : item?.no_of_days) == totalDays
                    }
                  >
                    <Text style={[reduxColors.commonUsedButtontxt]}>
                      {item?.no_of_days} {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {/* Footer */}
      <View style={{ width: "100%" }}>
        <Footermedical
          ShowIonicons={true}
          firstlabel={"Notes"}
          doneRight={true}
          navigatePreviousScreen={navigatePreviousScreen}
          onPress={() => {
            clickFunc();
          }}
        />
      </View>
    </>
  );
};

export default FollowUpDate;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: reduxColors.onPrimary,
      paddingTop: 56,
      paddingBottom: 76,
    },
    center: { justifyContent: "center", alignItems: "center" },
    commonUsedButton: {
      height: 36,
      width: 82,
      justifyContent: "center",
      alignItems: "center",
      borderColor: reduxColors.onPrimaryContainer,
      borderRadius: Spacing.mini,
      borderWidth: 1,
      marginHorizontal: Spacing.small,
    },
    itemRow: {
      flexDirection: "row",
      marginTop: Spacing.major + Spacing.body,
      alignItems: "center",
      justifyContent: "center",
    },
    datePicker: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: reduxColors.background,
      height: 56,
      width: 246,
      marginTop: Spacing.body,
      borderRadius: Spacing.mini,
    },
    dateTxt: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
      marginLeft: Spacing.body,
    },
    formatBtnCover: {
      width: 82,
      height: 36,
      marginTop: Spacing.small,
      marginBottom: Spacing.minor,
      paddingVertical: Spacing.micro,
      paddingHorizontal: Spacing.mini,
      borderWidth: 1,
      borderRightWidth: 0,
      borderColor: reduxColors.outlineVariant,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
    activeFormatBtnCover: {
      width: 82,
      height: 36,
      marginTop: Spacing.small,
      marginBottom: Spacing.minor,
      paddingVertical: Spacing.micro,
      paddingHorizontal: Spacing.mini,
      borderWidth: 1,
      borderRightWidth: 0,
      borderColor: reduxColors.secondary,
      backgroundColor: reduxColors.secondaryContainer,
      justifyContent: "center",
      alignItems: "center",
    },
    caseTypeBtnTxt: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSecondaryContainer,
      textAlign: "center",
    },
    input: {
      minWidth: 96,
      height: 72,
      borderWidth: 1,
      paddingVertical: Spacing.small,
      paddingHorizontal: 0,
      borderColor: reduxColors?.outlineVariant,
      fontSize: FontSize.Antz_Display_Title.fontSize,
      fontWeight: FontSize.Antz_Display_Title.fontWeight,
      borderRadius: 4,
      backgroundColor: reduxColors.surface,
      justifyContent: "center",
      alignItems: "center",
      color: reduxColors.onPrimaryContainer,
    },
    commonUsedButtontxt: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onPrimaryContainer,
      textAlign: "center",
    },
  });
