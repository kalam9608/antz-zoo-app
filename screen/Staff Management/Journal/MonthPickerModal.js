import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

import MonthPicker from "react-native-month-picker";
import { useSelector } from "react-redux";
import Spacing from "../../../configs/Spacing";
import FontSize from "../../../configs/FontSize";
import Colors from "../../../configs/Colors";

function MonthPickerModal({
  isOpen,
  toggleOpen,
  value,
  onChange,
  onPressCancelDatePicker,
  onPressConfirmDatePicker,
}) {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <View style={reduxColors.container}>
      <Modal
        avoidKeyboard
        transparent
        animationType="fade"
        visible={isOpen}
        style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
        onRequestClose={toggleOpen}
      >
        <View style={reduxColors.modalOverlay}>
          <View style={[reduxColors.modalContainer]}>
            <MonthPicker
              selectedDate={value || new Date()}
              onMonthChange={onChange}
              yearTextStyle={reduxColors.itemTitle}
              monthTextStyle={reduxColors.titleTextStyle}
              selectedMonthTextStyle={{
                color: Colors.journalDateColor,
              }}
              selectedBackgroundColor={Colors.defaultTextColor}
            />
            <View style={{ flexDirection: "row", width: "100%" }}>
              <TouchableOpacity
                style={reduxColors.confirmButton}
                onPress={onPressCancelDatePicker}
              >
                <Text style={reduxColors.titleTextStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={reduxColors.confirmButton}
                onPress={onPressConfirmDatePicker}
              >
                <Text style={reduxColors.titleTextStyle}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      // width: widthPercentageToDP("80%"),
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: Spacing.small,
      paddingVertical: 0,
    },

    itemTitle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    titleTextStyle: {
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      color: reduxColors.onSurfaceVariant,
    },

    flexText: {
      flex: 1,
    },
    confirmButton: {
      borderWidth: Spacing.micro * 0.3,
      padding: Spacing.body,
      margin: Spacing.small + Spacing.micro,
      borderRadius: Spacing.small,
      flex: 1,
      alignItems: "center",
    },
  });
export default MonthPickerModal;
