import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { filterData, ifEmptyValue, shortenNumber } from "../utils/Utils";
import Colors from "../configs/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Button, Card, Menu } from "react-native-paper";
import { useSelector } from "react-redux";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useState } from "react";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import moment from "moment";
import { warningToast } from "../utils/Alert";
import { SvgXml } from "react-native-svg";
import insightscollectionIcon from "../assets/insights_collection_icon.svg";
import MenuModalComponent from "./MenuModalComponent";
import { FilterMaster } from "../configs/Config";
import ModalFilterComponent, { ModalTitleData } from "./ModalFilterComponent";
import Background from "./BackgroundImage";

const InsightsCardComp = ({
  mortalityObj = {},
  mortalityType = "",
  classType,
  tsn_id,
  loading,
  selectedFilter,
  selectDropID,
  ...props
}) => {
  const start = new Date();
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const [visible, setVisible] = useState(false);
  const [selectDrop, setSelectDrop] = useState(
    selectedFilter ?? "Last 6 Months"
  );
  const [selectedCheckBox, setselectedCheckBox] = useState(selectDropID ?? "");
  const [dropdownValue, setDropdownValue] = useState("");
  const navigation = useNavigation();
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(new Date().toLocaleDateString('en-CA'));
  const openMenu = () => setVisible(true);
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
    setDropdownValue(item.value);
    setCollectionInshightModal(!collectionInshightModal);
    props.setdates(start_date, end_date, item?.name);
  };

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const [collectionInshightModal, setCollectionInshightModal] = useState(false);
  const togglePrintModal = () => {
    setCollectionInshightModal(!collectionInshightModal);
  };
  const closePrintModal = () => {
    setCollectionInshightModal(false);
  };
  const isSelectedId = (id) => {
    return selectedCheckBox.includes(id);
  };
  return (
    <>
      <View
        style={[
          {
            backgroundColor: constThemeColor.onPrimaryContainer,
            borderRadius: 12,
          },
        ]}
      >
        <Background>
        <View>
          <Card.Title
            style={[{}]}
            title={"Insights"}
            // subtitle={"Last Updateed Today 7:00 AM"}
            titleStyle={{
              fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
              fontSize: FontSize.Antz_Minor_Medium.fontSize,
              color: constThemeColor.onPrimary,
            }}
            subtitleStyle={{
              fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
              fontSize: FontSize.Antz_Subtext_Regular.fontSize,
              color: constThemeColor.outlineVariant,
              marginTop: -Spacing.mini,
            }}
            left={(props) => (
              <SvgXml
                xml={insightscollectionIcon}
                style={{ alignSelf: "center" }}
              />
            )}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: Spacing.minor,
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                if (props?.species && props?.species > 0) {
                  if (props?.showModalList == true) {
                    props?.ClickOnStats(
                      {
                        type: "species",
                        class_type: classType,
                        tsn_id: tsn_id,
                        totalCount: props?.species,
                      }
                    );
                  } else {
                    navigation.navigate("Listing", {
                      type: "species",
                      class_type: classType,
                      tsn_id: tsn_id,
                      totalCount: props?.species,
                    });
                  }
                }
              }}
            >
              <Text style={reduxColors.numberHeading}>
                {shortenNumber(props.species)}
              </Text>
              <Text style={reduxColors.numberDesp}>Species</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                if (props?.population && props?.population > 0) {
                  if (props?.showModalList == true) {
                    props?.ClickOnStats(
                      {
                        type: "animals",
                        class_type: classType,
                        tsn_id: tsn_id,
                        totalCount: props?.population,
                      }
                    );
                  } else {
                    navigation.navigate("Listing", {
                      type: "animals",
                      class_type: classType,
                      tsn_id: tsn_id,
                      totalCount: props?.population,
                    });
                  }
                }
              }}
            >
              <Text style={reduxColors.numberHeading}>
                {shortenNumber(props.population)}
              </Text>
              <Text style={reduxColors.numberDesp}>Population</Text>
            </TouchableOpacity>
          </View>
        </View>
        </Background>
       
        <View
          style={{
            backgroundColor: constThemeColor.onPrimary,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            padding: Spacing.mini,
          }}
        >
           <Background >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: Spacing.body,
              marginHorizontal: Spacing.body,
            }}
          >
            <ModalTitleData
              selectDrop={selectDrop}
              loading={loading}
              toggleModal={togglePrintModal}
              filterIconStyle={{ marginLeft: Spacing.small }}
              filterIcon={true}
              size={16}
            />
            {collectionInshightModal ? (
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
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: Spacing.minor,
              marginBottom: Spacing.minor,
              flexWrap: "wrap",
              paddingHorizontal: Spacing.minor,
            }}
          >
            <View style={reduxColors.statistics}>
              <Text style={reduxColors.statisticsValue}>
                {shortenNumber(props.accession)}
              </Text>
              <Text style={reduxColors.statisticsDownText}>Accession</Text>
            </View>

            <View style={reduxColors.statistics}>
              <Text style={reduxColors.statisticsValue}>
                {shortenNumber(props.birth)}
              </Text>

              <Text style={reduxColors.statisticsDownText}>Birth</Text>
            </View>

            {/*  if the count is zero then stop navigation */}
            {/* <TouchableOpacity onPress={props.onPress} disabled={props?.mortality == "0" ? true : false}> */}
            {/* <View style={reduxColors.statistics}>
                <Text style={reduxColors.mortalityStatisticsValue}>
                  {shortenNumber(props.mortality)}
                </Text>
                <Text style={reduxColors.statisticsDownText}>Mortality</Text>
              </View> */}
            {/* </TouchableOpacity> */}
            {/* <View style={reduxColors.statistics}>
              <Text style={reduxColors.statisticsValue}>{props.egg}</Text>
              <Text style={reduxColors.statisticsDownText}>Egg</Text>
            </View> */}
          </View>
        </Background>
        </View>
      </View>
    </>
  );
};

export default InsightsCardComp;

const styles = (reduxColors) =>
  StyleSheet.create({
    numberHeading: {
      color: reduxColors.primaryContainer,
      fontSize: FontSize.Antz_Display_Title.fontSize,
      fontWeight: FontSize.Antz_Display_Title.fontWeight,
      textAlign: "center",
    },
    numberDesp: {
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      color: reduxColors.surfaceVariant,
      textAlign: "center",
    },
    dropdown: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurface,
      paddingLeft: Spacing.minor,
    },
    statistics: {
      alignItems: "center",
    },
    statisticsValue: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    mortalityStatisticsValue: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.onSurface,
    },
    statisticsDownText: {
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      color: reduxColors.cardLebel,
    },
  });
