import React, { useState } from "react";
import moment from "moment/moment";
import { Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from "@expo/vector-icons";
import { useToast } from "../../../configs/ToastConfig";

const DatePicker = (
  props,
  { onChange = () => {}, onHide = () => {}, isDarkModeEnabled = false }
) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const { successToast, errorToast, alertToast, warningToast } = useToast();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    warningToast("warning","A date has been picked: ", date);
    setDate(date);
    // props.getDate(date)
  };
  return (
    <>
      <View style={props}>
        <TouchableOpacity
          onPress={() => {
            showDatePicker();
          }}
        >
          <Text
            style={[
              props.styleProps,
              props.isDarkMode ? styles.lightMode : "black",
            ]}
          >
            {props.mode == "time"
              ? moment(date).format("LT")
              : moment(date).format("ddd, MMM Do YYYY")}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={props.mode}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          onChange={onChange}
          onHide={onHide}
          isDarkModeEnabled={true}
        />
      </View>
    </>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  darkMode: {
    backgroundColor: "#222", // dark mode background color
  },
  lightMode: {
    color: "#fff",
  },
});

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
