import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import ModalFilterComponent, { ModalTitleData } from "../ModalFilterComponent";
import moment from "moment";
import { FilterMaster } from "../../configs/Config";

const MortalityStatsCard = ({
  type,
  setDates,
  mortalityStatsCount,
  screenType,
  onTogglePress,
  selectedFilterValue,
  selectDropID,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  /*****this is for mortality filter count update*****/
  const [selectDrop, setSelectDrop] = useState(
    selectedFilterValue ?? "All time data"
  );
  const [selectedCheckBox, setselectedCheckBox] = useState(selectDropID ?? "");

  const [mortalityInshightModal, setMortalityInshightModal] = useState(false);

  const togglePrintModal = () => {
    setMortalityInshightModal(!mortalityInshightModal);
  };
  const closePrintModal = () => {
    setMortalityInshightModal(false);
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

    if (isSelectedId(item.id)) {
      // setselectedCheckBox(selectedCheckBox.filter((item) => item !== item.id));
    } else {
      setselectedCheckBox([item.id]);
    }
    var end_date = moment(today).format(dateFormat);

    setSelectDrop(item.name ?? item);
    setMortalityInshightModal(!mortalityInshightModal);
    setDates(start_date, end_date, item?.name);
  };

  const isSelectedId = (id) => {
    return selectedCheckBox?.includes(id);
  };

  return (
    <>
      <View style={reduxColors.mortalityStatsCard}>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            alignItems: "center",
          }}
        >
          {/* <ModalTitleData
            selectDrop={selectDrop}
            // loading={Loading}
            toggleModal={togglePrintModal}
            selectDropStyle={[
              FontSize.Antz_Subtext_Regular,
              { color: constThemeColor.onTertiaryContainer },
            ]}
            filterIconStyle={{ marginLeft: Spacing.small }}
            filterIconcolor={{ color: constThemeColor.onTertiaryContainer }}
            filterIcon={true}
            size={20}
            isFromInsights={true}
          /> */}
          {mortalityInshightModal ? (
            <ModalFilterComponent
              onPress={togglePrintModal}
              onDismiss={closePrintModal}
              onBackdropPress={closePrintModal}
              onRequestClose={closePrintModal}
              data={FilterMaster}
              closeModal={closeMenu}
              title="Filter By"
              style={{ alignItems: "flex-start" }}
              isSelectedId={isSelectedId}
              radioButton={true}
            />
          ) : null}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          {type == "reasons" && (
            <TouchableOpacity
              onPress={() => onTogglePress("reasons")}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: Spacing.small + Spacing.micro,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Large_Title.fontSize,
                    fontWeight: FontSize.Antz_Large_Title.fontWeight,
                    color: constThemeColor.onTertiaryContainer,
                    textAlign: "center",
                  }}
                >
                  {mortalityStatsCount?.reason_count ?? "00"}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                    color: constThemeColor.onErrorContainer,
                    marginBottom: Spacing.body,
                    textAlign: "center",
                  }}
                >
                  Reasons
                </Text>
              </View>

              <View
                style={[
                  {
                    height: 6,
                    width: 85,
                    borderTopLeftRadius: Spacing.small,
                    borderTopRightRadius: Spacing.small,
                    backgroundColor:
                      screenType == "reasons"
                        ? constThemeColor.tertiary
                        : "transparent",
                  },
                ]}
              ></View>
            </TouchableOpacity>
          )}

          {type == "species" && (
            <TouchableOpacity
              onPress={() => onTogglePress("species")}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: Spacing.small + Spacing.micro,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Large_Title.fontSize,
                    fontWeight: FontSize.Antz_Large_Title.fontWeight,
                    color: constThemeColor.onTertiaryContainer,
                    textAlign: "center",
                  }}
                >
                  {mortalityStatsCount?.species_count ?? "00"}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                    color: constThemeColor.onErrorContainer,
                    marginBottom: Spacing.body,
                    textAlign: "center",
                  }}
                >
                  Species
                </Text>
              </View>

              <View
                style={[
                  {
                    height: 6,
                    width: 85,
                    borderTopLeftRadius: Spacing.small,
                    borderTopRightRadius: Spacing.small,
                    backgroundColor:
                      screenType == "species"
                        ? constThemeColor.tertiary
                        : "transparent",
                  },
                ]}
              ></View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => onTogglePress("animals")}
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: Spacing.small + Spacing.micro,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: FontSize.Antz_Large_Title.fontSize,
                  fontWeight: FontSize.Antz_Large_Title.fontWeight,
                  color: constThemeColor.onTertiaryContainer,
                  textAlign: "center",
                }}
              >
                {mortalityStatsCount?.total_animal ?? "00"}
              </Text>
              <Text
                style={{
                  fontSize: FontSize.Antz_Body_Regular.fontSize,
                  fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  color: constThemeColor.onErrorContainer,
                  marginBottom: Spacing.body,
                  textAlign: "center",
                }}
              >
                Animals
              </Text>
            </View>

            <View
              style={[
                {
                  height: 6,
                  width: 85,
                  borderTopLeftRadius: Spacing.small,
                  borderTopRightRadius: Spacing.small,
                  backgroundColor:
                    screenType == "animals"
                      ? constThemeColor.tertiary
                      : "transparent",
                },
              ]}
            ></View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default MortalityStatsCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    mortalityStatsCard: {
      backgroundColor: reduxColors.tertiaryContainer,
      borderRadius: Spacing.small + Spacing.mini,
      paddingTop: Spacing.minor - 1,
      paddingHorizontal: Spacing.minor,
      marginBottom: Spacing.minor,
    },
  });
