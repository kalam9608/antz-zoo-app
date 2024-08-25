import {
  Platform,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";
import { TextInput } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import SubmitBtn from "./SubmitBtn";
import { Keyboard } from "react-native";
const AdministerAddComponent = ({
  data,
  visible,
  setAdministerIsVisible,
  addAdminster,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [date, setDate] = useState(formatDate(new Date()));
  const [time, setTime] = useState(moment(new Date()).format("LT"));
  const [type, setType] = useState("");
  const [isWithheld, setIsWithheld] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [dosage, setDose] = useState(
    data?.data?.additional_info?.dosage
      ? data?.data?.additional_info?.dosage?.split(" ")[0]
      : 0
  );
  const [dosageWastage, setDoseWastage] = useState(0);
  const [wastageReason, setWastageReason] = useState("");
  const [error, setError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [dosageUnit, setDosageUnit] = useState(
    data?.data?.additional_info?.dosage
      ? data?.data?.additional_info?.dosage?.split(" ")[1]
      : ""
  );
  function formatDate(date) {
    const suffixes = ["th", "st", "nd", "rd"];
    const day = date.getDate();
    const daySuffix =
      suffixes[
        day % 10 > 3 ? 0 : (day % 100) - (day % 10) != 10 ? day % 10 : 0
      ];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    // return `${day}${daySuffix} ${month} ${year}`;
    return `${day} ${month} ${year}`;
  }
  const confirmDate = (date) => {
    if (type == "date") {
      setDate(formatDate(date));
      setIsDatePickerVisible(false);
    } else {
      setTime(moment(date).format("LT"));
      setIsDatePickerVisible(false);
    }
  };
  const isValidation = (type) => {
    setErrorMessage({});
    setError({});
    if (!dosage || dosage == 0) {
      setErrorMessage({ dosage: "Dosage is required" });
      setError({ dosage: true });
      return false;
    }
    if (
      (!wastageReason && dosageWastage) ||
      (type == "withheld" && !wastageReason)
    ) {
      setErrorMessage({ reason: "Reason is required" });
      setError({ reason: true });
      return false;
    }
    return true;
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const addAdminsterApiCall = (status) => {
    const obj = {
      quantity_administered: `${dosage} ${dosageUnit}`,
      wastage_quantity: dosageWastage ? `${dosageWastage} ${dosageUnit}` : 0,
      administritive_time: moment(time, "LT").format("HH:mm:ss"),
      administritive_date: moment(date ?? new Date(), "D MMM YYYY")?.format(
        "YYYY-MM-DD"
      ),
      reason: wastageReason,
      animal_id: data?.data?.animal_id,
      medical_record_id: data?.data?.medical_record_id,
      medicine_name: data?.data?.prescription,
      medicine_id: data?.data?.id,
      status: status,
      medicine_unit_id: data?.data?.additional_info?.medicine_unit_id,
      prescription_id: data?.data?.prescription_id,
    };
    if (isValidation(status)) {
      setIsWithheld(false);
      setAdministerIsVisible(false);
      addAdminster(obj);
      setTime((moment(new Date()).format("LT")))
      setDate(formatDate(new Date()))
    }
  };
  return (
    <Modal
      avoidKeyboard
      animationType="none"
      transparent={true}
      visible={visible}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 11}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[{ flex: 1 }, { backgroundColor: "transparent" }]}
      >
        <TouchableWithoutFeedback
          onPress={() => setAdministerIsVisible(!visible)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: constThemeColor.blackWithPointEight, //"transparent",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: constThemeColor.onPrimary,
                  minHeight: "40%",
                  width: "100%",
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                }}
              >
                <View
                  style={{
                    padding: Spacing.body + Spacing.mini,
                    borderBottomWidth: 0.5,
                    borderColor: constThemeColor.lightGrey,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: Spacing.micro,
                    }}
                  >
                    <Text
                      style={[
                        FontSize.Antz_Minor_Title,
                        { color: constThemeColor.primary },
                      ]}
                    >
                      Case ID: {data?.medical_record_id}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setAdministerIsVisible(false)}
                    >
                      <MaterialCommunityIcons
                        name="close"
                        color={constThemeColor.onSurface}
                        size={24}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginBottom: Spacing.micro }}>
                    <Text
                      style={[
                        FontSize.Antz_Minor_Title,
                        { color: constThemeColor.onPrimaryContainer },
                      ]}
                    >
                      {data.data?.prescription}
                    </Text>
                  </View>
                  {data?.data?.composition ? (
                    <View style={{ marginBottom: Spacing.micro }}>
                      <Text
                        style={[
                          FontSize.Antz_Body_Regular,
                          {
                            color: constThemeColor.onSurfaceVariant,
                            //   width: wp(80),
                          },
                        ]}
                        //   onTextLayout={onTextLayout}
                        //   numberOfLines={textShown ? undefined : 3}
                      >
                        {data?.data?.composition}
                      </Text>
                      {/* {lengthMore ? (
                  <Text
                    onPress={toggleNumberOfLines}
                    style={{ lineHeight: 21 }}
                  >
                    {textShown ? "Read less" : "Read more"}
                  </Text>
                ) : null} */}
                    </View>
                  ) : null}
                </View>
                <View>
                  {isWithheld ? null : (
                    <View style={reduxColors?.itemWrapper}>
                      <Text style={reduxColors?.type}>Dosage</Text>
                      <View>
                        <View style={reduxColors?.inputWrapper}>
                          <TextInput
                            accessible={true}
                            accessibilityLabel={"doseInput"}
                            AccessibilityId={"doseInput"}
                            autoCompleteType="off"
                            style={[reduxColors.doseInput]}
                            value={dosage}
                            onChangeText={(e) => setDose(e)}
                            placeholder="0"
                            keyboardType="numeric"
                          />
                          <Text
                            style={{
                              padding: Spacing.body,
                              color: constThemeColor?.onPrimaryContainer,
                              textTransform: "capitalize",
                            }}
                          >
                            {dosageUnit}
                          </Text>
                        </View>
                        {error?.dosage && (
                          <View style={{ textAlign: "left", width: "100%" }}>
                            <Text style={{ color: constThemeColor?.error }}>
                              {errorMessage?.dosage}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  <View style={reduxColors?.itemWrapper}>
                    <Text style={reduxColors?.type}>Time</Text>
                    <View style={reduxColors?.inputWrapper}>
                      <TouchableOpacity
                        onPress={() => {
                          setType("time");
                          setIsDatePickerVisible(!isDatePickerVisible);
                        }}
                        style={{ flex: 1, alignItems: "center" }}
                      >
                        <Text>{time}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={reduxColors?.itemWrapper}>
                    <Text style={reduxColors?.type}>Date</Text>
                    <View style={[reduxColors?.inputWrapper,{alignSelf:"center",justifyContent:"center"}]}>
                      <TouchableOpacity
                        onPress={() => {
                          setType("date");
                          setIsDatePickerVisible(!isDatePickerVisible);
                        }}
                        style={{ flex: 1,flexDirection:"row" }}
                      >
                        <Text>{date}</Text>
                        <View>
                      <MaterialCommunityIcons
                        name="calendar-today"
                        size={18}
                        style={{
                          marginLeft: Spacing.mini,
                        }}
                        color={
                           constThemeColor.onSurfaceVariant
                        }
                      
                      />
                    </View>
                      </TouchableOpacity>
                    </View>
                    {/* <View
                      style={{
                        width: 130,
                      }}
                    >
                      <DatePicker
                        title="Date Given"
                        today={date}
                        // refs={datePicker2Ref}
                        onChange={() => {}}
                        onOpen={() => {
                          setType("date");
                          setIsDatePickerVisible(!isDatePickerVisible);
                        }}
                        maximumDate={new Date()}
                        errors={errorMessage.date}
                        // isError={isError.date}
                      />
                    </View> */}
                  </View>
                </View>
                <View
                  style={{ backgroundColor: constThemeColor?.displaybgPrimary }}
                >
                  {isWithheld ? null : (
                    <>
                      <View style={reduxColors?.itemWrapper}>
                        <Text style={reduxColors?.type}>
                          Add wastage if any
                        </Text>
                        <View style={reduxColors?.inputWrapper}>
                          <TextInput
                            accessible={true}
                            accessibilityLabel={"wastageInput"}
                            AccessibilityId={"wastageInput"}
                            autoCompleteType="off"
                            style={[reduxColors.doseInput]}
                            value={dosageWastage}
                            onChangeText={(e) => setDoseWastage(e)}
                            placeholder="0"
                            keyboardType="numeric"
                          />
                          <Text
                            style={{
                              padding: Spacing.body,
                              color: constThemeColor?.onPrimaryContainer,
                              textTransform: "capitalize",
                            }}
                          >
                            {dosageUnit}
                          </Text>
                        </View>
                      </View>
                      <View style={{ padding: Spacing.body }}>
                        <TextInput
                          accessible={true}
                          accessibilityLabel={"wastageReason"}
                          AccessibilityId={"wastageReason"}
                          autoCompleteType="off"
                          editable={dosageWastage ? true : false}
                          style={[reduxColors.wastageInput]}
                          value={wastageReason}
                          onChangeText={(e) => setWastageReason(e)}
                          placeholder="Enter reason for wastage"
                          keyboardType="text"
                        />
                        {error?.reason && (
                          <View style={{ textAlign: "left", width: "100%" }}>
                            <Text style={{ color: constThemeColor?.error }}>
                              {errorMessage?.reason}
                            </Text>
                          </View>
                        )}
                      </View>
                    </>
                  )}
                  {isWithheld ? (
                    <View style={{ padding: Spacing.body }}>
                      <TextInput
                        accessible={true}
                        accessibilityLabel={"withheldreason"}
                        AccessibilityId={"withheldreason"}
                        autoCompleteType="off"
                        style={[reduxColors.wastageInput]}
                        value={wastageReason}
                        onChangeText={(e) => setWastageReason(e)}
                        placeholder="Enter reason for withholding"
                        keyboardType="text"
                      />
                      {error?.reason && (
                        <View style={{ textAlign: "left", width: "100%" }}>
                          <Text style={{ color: constThemeColor?.error }}>
                            {errorMessage?.reason}
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : null}
                </View>
                {!keyboardVisible ? (
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: Spacing.minor,
                    }}
                  >
                    {isWithheld ? (
                      <View style={{ width: "100%" }}>
                        <SubmitBtn
                          backgroundColor={constThemeColor?.secondary}
                          buttonText={"Withholding"}
                          onPress={() => addAdminsterApiCall("withheld")}
                        />
                      </View>
                    ) : (
                      <>
                        <View style={{ width: "50%" }}>
                          <SubmitBtn
                            backgroundColor={constThemeColor?.secondary}
                            buttonText={"Withholding"}
                            onPress={() => setIsWithheld(true)}
                          />
                        </View>
                        <View style={{ width: "50%" }}>
                          <SubmitBtn
                            backgroundColor={constThemeColor?.primary}
                            buttonText={"Given"}
                            onPress={() => addAdminsterApiCall("administritor")}
                          />
                        </View>
                      </>
                    )}
                  </View>
                ) : null}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <DateTimePickerModal
        // date={props.today}
        display={Platform.OS === "ios" ? "spinner" : "default"}
        textColor={constThemeColor.neutralPrimary}
        isVisible={isDatePickerVisible}
        maximumDate={new Date()}
        // minimumDate={props.minimumDate}
        mode={type}
        onConfirm={confirmDate}
        onCancel={() => setIsDatePickerVisible(false)}
        // onChange={onChange}
        // onHide={onHide}
        isDarkModeEnabled={false}
      />
    </Modal>
  );
};

export default AdministerAddComponent;

const styles = (reduxColors) => ({
  doseInput: {
    minWidth: 50,
    height: 54,
    paddingLeft: Spacing.body,
    // paddingVertical: Spacing.mini,
    // marginRight: Spacing.body,
    // borderRadius: 4,
    // backgroundColor: reduxColors.surface,
    color: reduxColors.onPrimaryContainer,
    fontSize: FontSize.Antz_Minor_Title.fontSize,
  },
  wastageInput: {
    width: "100%",
    height: 54,
    paddingLeft: Spacing.body,
    paddingVertical: Spacing.mini,
    marginRight: Spacing.body,
    borderRadius: 8,
    backgroundColor: reduxColors.onPrimary,
    color: reduxColors.onPrimaryContainer,
    fontSize: FontSize.Antz_Minor_Title.fontSize,
  },
  inputWrapper: {
    height: 54,
    width: 130,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: reduxColors.surface,
    borderWidth: 1,
    borderColor: reduxColors.outlineVariant,
    padding: Spacing.mini,
    borderRadius: 4,
    paddingHorizontal: Spacing.body,
  },
  itemWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.body,
    marginVertical: Spacing.body,
  },
  type: {
    fontSize: FontSize.Antz_Minor_Title.fontSize,
    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    color: reduxColors?.onSurfaceVariant,
  },
});
