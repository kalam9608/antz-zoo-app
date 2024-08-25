// created by Wasim Akram
// Created at 26/04/2023
// modified by: wasim Akram at 03.05.2023

/* modify by - gaurav shukla
    Date - 08-05-023
    Des- change the Ui according bugSheets and fixed the api of postAnimalEnclosure.
*/

import React, { useEffect, useState, useRef, useCallback } from "react";
import Category from "../../components/DropDownBox";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  FlatList,
  Animated,
  StatusBar,
} from "react-native";

import { GetEnclosure } from "../../services/FormEnclosureServices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  MaterialIcons,
  Ionicons,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import Loader from "../../components/Loader";
import Colors from "../../configs/Colors";
import AddMedicalRecordCard from "../../components/AddMedicalRecordCard";
import FontSize from "../../configs/FontSize";

const arr = [
  {
    id: 1,
    title: "Nanday Conure",
    title_id: "A000093",
    sex_data: { male: "M", female: "F" },
  },
  {
    id: 2,
    title: "Nanday Conure",
    title_id: "B000093",
    sex_data: { male: "M", female: "F" },
  },
  {
    id: 3,
    title: "Canday Conure",
    title_id: "C000093",
    sex_data: { male: "M", female: "F" },
  },
  {
    id: 4,
    title: "Fanday Conure",
    title_id: "C000093",
    sex_data: { male: "M", female: "F" },
  },
  {
    id: 5,
    title: "Janday Conure",
    title_id: "D000093",
    sex_data: { male: "M", female: "F" },
  },
  {
    id: 6,
    title: "Tanday Conure",
    title_id: "E000093",
    sex_data: { male: "M", female: "F" },
  },
];

const InsightSearching = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  const [collectiondataOpen, setCollectiondataOpen] = useState(false);
  const [collectiondataValue, setCollectiondataValue] = useState(null);
  const [collectiondata, setCollectionData] = useState([
    { label: "PUCIT", value: "pucit" },
    { label: "UCP", value: "ucp" },
    { label: "UET", value: "uet" },
  ]);

  const gotoBackPage = () => navigation.goBack();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <>
      <Loader visible={Loading} />
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={constThemeColor.onPrimary}
      />
      <View style={reduxColors.container}>
        <View style={reduxColors.searchbox}>
          <View>
            <Searchbar
              placeholder={"Search species, animals..."}
              inputStyle={reduxColors.input}
              style={[
                reduxColors.Searchbar,
                { backgroundColor: constThemeColor.onPrimary },
              ]}
              autoFocus={true}
              icon={({ size, color }) => (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color
                  style={{
                    color: constThemeColor.neutralPrimary,
                  }}
                  onPress={gotoBackPage}
                />
              )}
              right={() => (
                <>
                  <Ionicons
                    name="close"
                    size={20}
                    color={constThemeColor.neutralPrimary}
                    style={{ marginRight: 10 }}
                  />
                </>
              )}
            />
          </View>
          <ScrollView>
            <View>
              <Text
                style={{
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  color: constThemeColor.onSurfaceVariant,
                  margin: "4%",
                  marginTop: "3%",
                  marginBottom: "3%",
                }}
              >
                {" "}
                Show All
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginHorizontal: 13,
              }}
            >
              <View>
                <Dropdown
                  style={reduxColors.collectionsDropdown}
                  placeholderStyle={reduxColors.placehStyle}
                  selectedTextStyle={reduxColors.itemstyle}
                  data={collectiondata}
                  labelField="label"
                  valueField="value"
                  placeholder="Animals"
                  searchPlaceholder="Search..."
                  value={collectiondataValue}
                  onChange={() => setCollectionData(collectiondata)}
                />
              </View>
              <View>
                <Dropdown
                  style={reduxColors.collectionsDropdown}
                  placeholderStyle={reduxColors.placehStyle}
                  selectedTextStyle={reduxColors.itemstyle}
                  data={collectiondata}
                  labelField="label"
                  valueField="value"
                  placeholder="Animal today"
                  searchPlaceholder="Search..."
                  value={collectiondataValue}
                  onChange={() => setCollectionData(collectiondata)}
                />
              </View>
              <View>
                <Dropdown
                  style={reduxColors.siteDropdown}
                  placeholderStyle={reduxColors.placehStyle}
                  selectedTextStyle={reduxColors.itemstyle}
                  data={collectiondata}
                  labelField="label"
                  valueField="value"
                  placeholder="Status"
                  searchPlaceholder="Search..."
                  value={collectiondataValue}
                  onChange={() => setCollectionData(collectiondata)}
                />
              </View>
            </View>

            <Text
              style={{
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                color: constThemeColor.onSurfaceVariant,
                marginLeft: "4%",
                marginTop: "5%",
              }}
            >
              Results
            </Text>

            <View style={{ marginHorizontal: 10 }}>
              <FlatList
                data={arr}
                renderItem={({ item }) => {
                  return (
                    <>
                      <AddMedicalRecordCard
                        backgroundColorimg={"red"}
                        backgroundColor={constThemeColor.onPrimary}
                        children={
                          <>
                            <Text style={reduxColors.subtitle}>
                              {item.title}
                            </Text>
                            <View
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <Text style={reduxColors.subtitle}>
                                {item.title_id}
                              </Text>
                              <Text style={reduxColors.MBox}>
                                {item.sex_data.male}
                              </Text>
                              <Text style={reduxColors.BBox}>
                                {item.sex_data.female}
                              </Text>
                            </View>
                            <Text style={reduxColors.subtitle1}>
                              Enclosure name, Section name
                            </Text>
                          </>
                        }
                        imagePath={require("../../assets/antz.svg")}
                      />
                    </>
                  );
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default InsightSearching;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: reduxColors.addBackground,
    },
    Searchbar: {
      width: widthPercentageToDP(100),
      borderRadius: 0,
      borderBottomWidth: 1,
      borderColor: reduxColors.lightGreyHexa,
    },

    title: {
      fontSize: widthPercentageToDP(4.8),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      width: "100%",
    },

    secondItembox: {
      width: widthPercentageToDP(90),
      marginTop: heightPercentageToDP(2),
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 4,
    },
    collectionsDropdown: {
      width: widthPercentageToDP(33),
      height: heightPercentageToDP(5),
      borderColor: reduxColors.outline,
      borderWidth: widthPercentageToDP(0.3),
      borderRadius: 13,
      // marginLeft: widthPercentageToDP(4),
      backgroundColor: reduxColors.onPrimary,
    },
    siteDropdown: {
      width: widthPercentageToDP(20),
      height: heightPercentageToDP(5),
      borderColor: reduxColors.outline,
      borderWidth: widthPercentageToDP(0.3),
      marginRight: widthPercentageToDP(3),
      borderRadius: 13,
      backgroundColor: reduxColors.onPrimary,
    },
    textBox: {
      marginTop: heightPercentageToDP(3),
      alignItems: "flex-start",
      width: widthPercentageToDP(90),
    },

    placehStyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
      marginLeft: widthPercentageToDP(2),
      // backgroundColor:'red'
    },
    itemstyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
    },
    modalMaster: {
      flex: 1,
    },
    overlay: {
      flex: 0.1,
    },
    headerStyle: {
      width: widthPercentageToDP(60),
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginTop: heightPercentageToDP(3),
    },
    headerText: {
      textAlign: "center",
      fontSize: 22,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    modalFirstbox: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: heightPercentageToDP(2),
    },
    listofModalStyle: {
      width: widthPercentageToDP(90),
      marginTop: heightPercentageToDP(3),
    },

    modalSearchplaceholderStyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
    },
    tagsContainer: {
      flexDirection: "row",
    },
    subtitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      color: reduxColors.onSurfaceVariant,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      // fontStyle: "italic",
      padding: heightPercentageToDP(0.3),
    },
    subtitle1: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      color: reduxColors.onSurfaceVariant,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      // fontStyle: "italic",
      padding: heightPercentageToDP(0.3),
    },
    MBox: {
      //  borderWidth:0.5,
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.surfaceVariant,
      borderRadius: 5,
    },
    BBox: {
      //  borderWidth:0.5,
      marginLeft: widthPercentageToDP(2),
      paddingTop: widthPercentageToDP(0.1),
      padding: widthPercentageToDP(1.5),
      height: heightPercentageToDP(2.9),
      backgroundColor: reduxColors.secondary,
      borderRadius: 5,
    },
  });
