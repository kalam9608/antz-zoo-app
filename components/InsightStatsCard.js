import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Colors from "../configs/Colors";
import { Entypo } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Menu } from "react-native-paper";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import FontSize from "../configs/FontSize";
import moment from "moment";
import { warningToast } from "../utils/Alert";
import Spacing from "../configs/Spacing";
import { shortenSmallerNumber } from "../utils/Utils";
import MenuModalComponent from "./MenuModalComponent";
import { ActivityIndicator } from "react-native";
import { FilterMaster } from "../configs/Config";
import ModalFilterComponent, { ModalTitleData } from "./ModalFilterComponent";
import InsightDataCarousel from "./DataCarousel";
import CarouselCurrentData from "./CarouselCurrentData";
import { useToast } from "../configs/ToastConfig";
import Background from "./BackgroundImage";

const InsightStatsCard = ({ loading, ...props }) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const [visible, setVisible] = useState(false);
  const [selectDrop, setSelectDrop] = useState(
    props.selectedFilter ?? "Last 6 Months"
  );
  const [dropdownValue, setDropdownValue] = useState("");
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const openMenu = () => setVisible(true);
  const { showToast } = useToast();
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
        showToast("warning", "Oops!! Unknown option!");
        return;
    }
    if (isSelectedId(item.id)) {
      setselectedCheckBox(selectedCheckBox.filter((item) => item !== item.id));
    } else {
      setselectedCheckBox([selectedCheckBox, item.id]);
    }
    var end_date = moment(today).format(dateFormat);
    // setStartDate(start?.toLocaleDateString('en-CA'));
    // setEndDate(today?.toLocaleDateString('en-CA'));
    setSelectDrop(item.name ?? item);
    setDropdownValue(item.value);
    setCollectionInshightModal(!collectionInshightModal);
    props.setdates(start_date, end_date, item?.name);
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  const [collectionInshightModal, setCollectionInshightModal] = useState(false);
  const togglePrintModal = () => {
    setCollectionInshightModal(!collectionInshightModal);
  };
  const closePrintModal = () => {
    setCollectionInshightModal(false);
  };
  const [selectedCheckBox, setselectedCheckBox] = useState("");
  const isSelectedId = (id) => {
    return selectedCheckBox.includes(id);
  };
  useEffect(() => {
    const selectedItem = FilterMaster?.find((item) => item.name === selectDrop);
    if (selectedItem) {
      setselectedCheckBox(["", selectedItem.id]);
    }
  }, [selectDrop]);

  const data = [
    [
      {
        num: shortenSmallerNumber(props.populationData),
        name: "Population",
        type: "population",
      },
      {
        num: shortenSmallerNumber(props.species ?? props.birthData),
        name: "Species",
        type: "species",
      },
      
    ],
  ];

  if (props?.classType == "genus") {
    data.push(
      [
        {
          num: shortenSmallerNumber(props?.siteData),
          name: "Sites",
          type: "Sites",
        },
        {
          num: shortenSmallerNumber(props?.sectionData),
          name: "Sections",
          type: "Sections",
        },
      ],
      [
        {
          num: shortenSmallerNumber(props?.enclosureData),
          name: "Enclosures",
          type: "Enclosures",
        },
      ]
    );
  }

  
  return (
    <>
      <View>
        <View
          style={{
            backgroundColor: constThemeColor.surfaceVariant,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: Spacing.minor,
          }}
        >
          {/* Population and Species */}

          <CarouselCurrentData title="Current data" data={data} {...props} />

          <View style={{ width: Spacing.body }}></View>
          {/* Birth && Mortality */}
          <View
            style={[
              dynamicStyles.cardContainer,
              {
                backgroundColor: constThemeColor.surface,
                borderRadius: 10,
                flex: 1,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: Spacing.mini,
                paddingTop: Spacing.micro,
              }}
            >
              <ModalTitleData
                selectDrop={selectDrop}
                loading={loading}
                toggleModal={togglePrintModal}
                filterIconStyle={{ marginLeft: Spacing.small }}
                filterIcon={true}
                size={18}
                touchStyle={{ marginBottom: Spacing.mini }}
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
                  checkIcon={true}
                />
              ) : null}
            </View>
            <View
              style={[
                dynamicStyles.dataContainer,
                { marginTop: Spacing.small },
              ]}
            >
              <Background>
              <View style={dynamicStyles.dataRow}>
                <Text
                  style={[
                    dynamicStyles.cardNumber,
                    {
                      color: isSwitchOn
                        ? Colors.white
                        : Colors.insightStatsData,
                    },
                  ]}
                >
                  {shortenSmallerNumber(props.birthData)}
                </Text>
                <Text
                  style={[
                    dynamicStyles.cardNumberTitle,
                    {
                      color: isSwitchOn
                        ? Colors.white
                        : Colors.insightStatslabel,
                    },
                  ]}
                >
                  Birth
                </Text>
              </View>
              </Background>
             {/*  if the count is zero then stop navigation */}
              {/* <TouchableOpacity
                onPress={props.onPress}
                style={dynamicStyles.dataRow}
                disabled={props?.mortalityData == "0" ? true : false}
              >
                <Text
                  style={[
                    dynamicStyles.cardNumber,
                    {
                      color: isSwitchOn
                        ? Colors.white
                        : Colors.insightStatsData,
                    },
                  ]}
                >
                  {shortenSmallerNumber(props.mortalityData)}
                </Text>
                <Text
                  style={[
                    dynamicStyles.cardNumberTitle,
                    {
                      color: isSwitchOn
                        ? Colors.white
                        : Colors.insightStatslabel,
                    },
                  ]}
                >
                  Mortality
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default InsightStatsCard;
const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      marginTop: Spacing.body,
      marginBottom: Spacing.body,
      backgroundColor: reduxColors.surface,
      paddingHorizontal: Spacing.minor,
      paddingTop: Spacing.body,
    },
    dataContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      bottom: 10,
    },
    dataRow: {
      alignItems: "center",
    },

    cardNumber: {
      fontSize: FontSize.Antz_Stat_Title.fontSize,
      fontWeight: FontSize.Antz_Stat_Title.fontWeight,
      color: reduxColors.onSurface,
    },
    cardNumberTitle: {
      fontSize: FontSize.Antz_Strong,
    },
    dataRow: {
      alignItems: "center",
    },
    dropdown: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      color: reduxColors.onSurface,
      // marginTop: 0
    },
  });

//   <View style={dynamicStyles.dataContainer}>
//   <TouchableOpacity
//     style={dynamicStyles.dataRow}
//     onPress={() =>
//       navigation.navigate("Listing", {
//         type: "animals",
//         class_type: props?.classType,
//         tsn_id: props?.tsn_id,
//         totalCount: props?.populationData,
//       })
//     }
//   >
//     <Text
//       style={[
//         dynamicStyles.cardNumber,
//         {
//           color: constThemeColor.onPrimaryContainer,
//         },
//       ]}
//     >
//       {/* shortenSmallerNumber(10000) */}
//       {shortenSmallerNumber(props.populationData)}
//     </Text>
//     <Text
//       style={[
//         dynamicStyles.cardNumberTitle,
//         {
//           color: isSwitchOn
//             ? Colors.white
//             : Colors.insightStatslabel,
//         },
//       ]}
//     >
//       Population
//     </Text>
//   </TouchableOpacity>
//   <TouchableOpacity
//     style={dynamicStyles.dataRow}
//     onPress={() =>
//       navigation.navigate("Listing", {
//         type: "species",
//         class_type: props?.classType,
//         tsn_id: props?.tsn_id,
//         totalCount: props.species,
//       })
//     }
//   >
//     <Text
//       style={[
//         dynamicStyles.cardNumber,
//         {
//           color: isSwitchOn
//             ? Colors.white
//             : Colors.insightStatsData,
//         },
//       ]}
//     >
//       {/* 6.2K */}
//       {shortenSmallerNumber(props.species ?? props.birthData)}
//       {/* {shortenSmallerNumber(4820)} */}
//     </Text>
//     <Text
//       style={[
//         dynamicStyles.cardNumberTitle,
//         {
//           color: isSwitchOn
//             ? Colors.white
//             : Colors.insightStatslabel,
//         },
//       ]}
//     >
//       Species
//     </Text>
//   </TouchableOpacity>
// </View>
