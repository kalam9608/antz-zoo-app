import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import moment from "moment";
import ModalFilterComponent, { ModalTitleData } from "./ModalFilterComponent";
import { useToast } from "../configs/ToastConfig";
import { FilterMaster } from "../configs/Config";
import { useNavigation } from "@react-navigation/native";

const MedicalFilterStats = ({
  isMedicalTopStats,
  medicalStatsCount,
  setDates,
  selectedFilterValue,
  selectDropID,
  startDate,
  endDate,
  siteId,
  sectionId,
  enclosureId,
  speciesId,
}) => {
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  const navigation = useNavigation();

  const [selectedCheckBox, setselectedCheckBox] = useState(selectDropID ?? "");
  const [medicalInshightModal, setMedicalInshightModal] = useState(false);

  const [selectDrop, setSelectDrop] = useState(
    selectedFilterValue ?? "Last 6 Months"
  );

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

  const isSelectedId = (id) => {
    return selectedCheckBox.includes(id);
  };

  return (
    <View
      style={[
        reduxColors.medicalStatsCard,
        {
          borderTopEndRadius: isMedicalTopStats ? 0 : Spacing.body,
          borderTopLeftRadius: isMedicalTopStats ? 0 : Spacing.body,
        },
      ]}
    >
      {/* count filter*/}
      <View
        style={{
          flexDirection: "row",
          alignSelf: "flex-start",
          alignItems: "center",
          paddingVertical: Spacing.small,
        }}
      >
        <ModalTitleData
          selectDrop={selectDrop ?? "Last 6 Months"}
          toggleModal={toggleDateModal}
          selectDropStyle={[
            FontSize.Antz_Subtext_Regular,
            { color: constThemeColor.onSurface },
          ]}
          filterIconStyle={{ marginLeft: Spacing.mini }}
          filterIconcolor={{ color: constThemeColor.onSurface }}
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

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity
          style={reduxColors.countBox}
          disabled={Number(medicalStatsCount?.total_animal ?? 0) === 0}
          onPress={() => {
            navigation.navigate("SickAnimalsList", {
              ref_type: "animals_sick",
              ref_title:"Animal",
              startDate,
              endDate,
              siteId,
              sectionId,
              enclosureId,
              speciesId,
            });
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={reduxColors.CountStyle}>
              {medicalStatsCount?.total_animal ?? "0"}
            </Text>
            <Text style={reduxColors.CountTitle}>Animals Sick</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={reduxColors.countBox}
          disabled={Number(medicalStatsCount?.under_medication ?? 0) === 0}
          onPress={() => {
            navigation.navigate("SickAnimalsList", {
              ref_type: "under_medication",
              ref_title:"Animal",
              startDate,
              endDate,
              siteId,
              sectionId,
              enclosureId,
              speciesId,
            });
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={reduxColors.CountStyle}>
              {medicalStatsCount?.under_medication ?? "0"}
            </Text>
            <Text style={reduxColors.CountTitle}>Under </Text>
            <Text style={reduxColors.CountTitle}> Medication</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={reduxColors.countBox}
          disabled={Number(medicalStatsCount?.quarantined ?? 0) === 0}
          onPress={() => {
            navigation.navigate("SickAnimalsList", {
              ref_type: "quarantined",
              ref_title:"Animal",
              startDate,
              endDate,
              siteId,
              sectionId,
              enclosureId,
              speciesId,
            });
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={reduxColors.CountStyle}>
              {medicalStatsCount?.quarantined ?? "0"}
            </Text>
            <Text style={reduxColors.CountTitle}>Quarantined</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={reduxColors.countBox}
          onPress={() => {
            navigation.navigate("BySpeciesList", {
              title: "Resolved Diagnosis",
              status:"closed",  
              startDate,
              endDate,
              siteId,
              sectionId,
              enclosureId,
              speciesId,
            });
          }}
          disabled={Number(medicalStatsCount?.resolved_diagnosis ?? 0) === 0}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={reduxColors.CountStyle}>
              {medicalStatsCount?.resolved_diagnosis ?? "0"}
            </Text>
            <Text style={reduxColors.CountTitle}>Resolved </Text>
            <Text style={reduxColors.CountTitle}> Diagnosis</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MedicalFilterStats;

const styles = (reduxColors) =>
  StyleSheet.create({
    medicalStatsCard: {
      backgroundColor: reduxColors.surface,
      borderBottomEndRadius: Spacing.body,
      borderBottomLeftRadius: Spacing.body,
      paddingVertical: Spacing.minor,
      paddingHorizontal: Spacing.small,
    },
    countBox: {
      alignItems: "center",
    },
    CountStyle: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
      textAlign: "center",
      marginVertical: Spacing.mini,
    },
    CountTitle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.outline,
      textAlign: "center",
    },
  });
