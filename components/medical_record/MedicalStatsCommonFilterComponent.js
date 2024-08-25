import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import Spacing from "../../configs/Spacing";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import ModalFilterComponent, { ModalTitleData } from "../ModalFilterComponent";
import { FilterMaster } from "../../configs/Config";
import moment from "moment";
import { useToast } from "../../configs/ToastConfig";

const MedicalStatsCommonFilterComponent = ({
  isDateFilter,
  setDates,
  leftTitle,
  rightTitle,
  leftStatsCount,
  rightStatsCount,
  screenType,
  onTogglePress,
  selectedFilterValue,
  selectDropID,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  const [selectedCheckBox, setselectedCheckBox] = useState(selectDropID ?? "");
  const [medicalInshightModal, setMedicalInshightModal] = useState(false);

  const [selectDrop, setSelectDrop] = useState(
    selectedFilterValue ?? "All time data"
  );

  const isSelectedId = (id) => {
    return selectedCheckBox.includes(id);
  };

  const toggleDateModal = () => {
    setMedicalInshightModal(!medicalInshightModal);
  };
  const closeDateModal = () => {
    setMedicalInshightModal(false);
  };

  const closeMenu = (item) => {
    const today = new Date();
    let start_date = new Date();
    const dateFormat = "YYYY-MM-DD";

    switch (item.value) {
      case "this-month":
        start_date = moment(today).clone().startOf("month").format(dateFormat);
        break;
      case "last-7-days":
        start_date = moment(today).subtract(7, "days").format(dateFormat);
        break;
      case "last-3-months":
        start_date = moment(today).subtract(3, "months").format(dateFormat);
        break;
      case "last-6-months":
        start_date = moment(today).subtract(6, "months").format(dateFormat);
        break;
      case "all":
        start_date = null;
        break;
      default:
        warningToast("Oops!!", "Unknown option!");
        return;
    }

    if (!isSelectedId(item?.id)) {
      setselectedCheckBox([item.id]);
    }
    var end_date = moment(today).format(dateFormat);

    setSelectDrop(item.name ?? item);
    setMedicalInshightModal(!medicalInshightModal);
    setDates(start_date, end_date, item?.name);
  };

  return (
    <View style={reduxColors.statsCard}>
      {/* date filter */}

      {isDateFilter && (
        <View style={reduxColors.dateFilter}>
          <ModalTitleData
            selectDrop={selectDrop ?? "All time data"}
            toggleModal={toggleDateModal}
            selectDropStyle={[
              FontSize.Antz_Subtext_Regular,
              { color: constThemeColor.onTertiaryContainer },
            ]}
            filterIconStyle={{ marginLeft: Spacing.mini }}
            filterIconcolor={{ color: constThemeColor.onTertiaryContainer }}
            filterIcon={true}
            size={20}
            isFromInsights={true}
          />
          {medicalInshightModal ? (
            <ModalFilterComponent
              onPress={toggleDateModal}
              onDismiss={closeDateModal}
              onBackdropPress={closeDateModal}
              onRequestClose={closeDateModal}
              data={FilterMaster}
              closeModal={closeMenu}
              title="Filter By"
              style={{ alignItems: "flex-start" }}
              isSelectedId={isSelectedId}
              radioButton={true}
            />
          ) : null}
        </View>
      )}

      <View style={reduxColors.statsCountCard}>
        <TouchableOpacity
          onPress={() => onTogglePress(leftTitle)}
          style={reduxColors.countBox}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={reduxColors?.countStyle}>{leftStatsCount}</Text>
            <Text style={reduxColors?.countText}>{leftTitle}</Text>
          </View>

          <View
            style={[
              reduxColors?.activeStyle,
              {
                backgroundColor:
                  screenType == leftTitle
                    ? constThemeColor.primary
                    : "transparent",
              },
            ]}
          ></View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onTogglePress(rightTitle)}
          style={reduxColors?.countBox}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={reduxColors.countStyle}>{rightStatsCount}</Text>
            <Text style={reduxColors?.countText}>{rightTitle}</Text>
          </View>

          <View
            style={[
              reduxColors?.activeStyle,
              {
                width: 100,
                backgroundColor:
                  screenType == rightTitle
                    ? constThemeColor.primary
                    : "transparent",
              },
            ]}
          ></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MedicalStatsCommonFilterComponent;

const styles = (reduxColors) =>
  StyleSheet.create({
    statsCard: {
      backgroundColor: reduxColors.surface,
      borderRadius: Spacing.body,
      paddingTop: Spacing.body,
      paddingHorizontal: Spacing.minor,
      marginTop: Spacing.body,
    },
    countStyle: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.onTertiaryContainer,
      textAlign: "center",
    },
    countText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onErrorContainer,
      marginBottom: Spacing.small,
      textAlign: "center",
    },
    dateFilter: {
      flexDirection: "row",
      alignSelf: "flex-end",
      alignItems: "center",
      paddingVertical: Spacing.small,
    },
    statsCountCard: { flexDirection: "row", justifyContent: "space-around" },
    countBox: {
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: Spacing.small + Spacing.micro,
    },
    activeStyle: {
      height: 6,
      width: 100,
      borderTopLeftRadius: Spacing.small,
      borderTopRightRadius: Spacing.small,
    },
  });
