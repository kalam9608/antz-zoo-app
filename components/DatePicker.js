import React, { useState } from "react";
import moment from "moment/moment";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from "@expo/vector-icons";
import InputBox from "./InputBox";
import { ifEmptyValue } from "../utils/Utils";
import { useSelector } from "react-redux";

const DatePicker = (
  props,
  {
    onChange = () => {},
    onHide = () => {},
    isDarkModeEnabled = false,
    today,
    edit = true,
  }
) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(props.today ?? new Date());
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    props.onOpen();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    props.onChange(date);
    hideDatePicker();
  };
  return (
    <>
      <InputBox
        edit={props.edit}
        inputLabel={props.title}
        placeholder={props.title}
        // editable={false}
        onChange={(val) => {
          setTotalWorkExp(val);
        }}
        defaultValue={null}
        refs={props.refs}
        value={
          props.today
            ? props.mode == "time"
              ? ifEmptyValue(moment(props.today).format("LT"))
              : ifEmptyValue(moment(props.today).format(props.format ?? "Do MMM YY"))
            : ""
        }
        rightElement="calendar"
        DropDown={() => {
          showDatePicker();
        }}
        isError={props.isError}
        errors={props.errors}
      />
      <View style={{ Width: "100%" }}>
        <DateTimePickerModal
          // date={props.today}
          display={
            Platform.OS === "ios" ? "spinner" : "default"
          }
          textColor={constThemeColor.neutralPrimary}
          isVisible={isDatePickerVisible}
          maximumDate={props?.maximumDate}
          minimumDate={props.minimumDate}
          mode={props.mode}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          onChange={onChange}
          onHide={onHide}
          isDarkModeEnabled={false}
        />
      </View>
    </>
  );
};

export default DatePicker;

// const styles = StyleSheet.create({
//   fieldBox: {
//     // alignItems: "center",
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderBottomWidth: 1,
//     // backgroundColor: "#fff",
//     // height: "auto",
//     justifyContent: "space-around",
//     // marginTop:30
//   },
//   labelName: {
//     // paddingLeft: 4,
//     // height: "auto",
//     // paddingVertical: 10,
//   },
//   dateField: {
//     // backgroundColor: "#fff",
//     // height: "auto",
//     // textAlign: "left",
//     padding: 5,
//     // marginLeft: 60
//     width: "100%",
//     justifyContent: "space-between",
//     // backgroundColor:"red"
//   },
//   darkMode: {
//     backgroundColor: "#222", // dark mode background color
//   },
//   lightMode: {
//     color: "#fff",
//   },
// });

/**
 * Created by: Om Tripathi
 * Created on: 10/02/2023
 * Updated on: 12/02/2023
 * Description: Through This Component We Can Make DatePicker And TimePicker. 
 * @param {string} mode : Choose between "date", "time", and "datetime"
 * @param {string} defaultDate : Set the Default date.
 * @param {string} labelName : Change the label name
 * @param {boolean} isDarkMode : true / false - Show the darkMode
 * @param {style} labelStyle : Change the style for the label (backgroundColor,color....)
 * @param {style} styleProps : Change the style the selected date. 
 * @param {callback function} getDate :Get the selected date  .  
 * Example ----
 <DateTimePickerModal
    isVisible={isDatePickerVisible}
    mode={props.mode}
    onConfirm={handleConfirm}
    onCancel={hideDatePicker}
    />
 * @public
 */
