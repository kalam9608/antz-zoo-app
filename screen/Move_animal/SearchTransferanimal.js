// created by Wasim Akram
// Created at 10/05/2023

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from "react-native";

import { GetEnclosure } from "../../services/FormEnclosureServices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Searchbar } from "react-native-paper";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import Loader from "../../components/Loader";
import VoiceText from "../../components/VoiceText";
import { getAnimalConfigs, getAnimalList } from "../../services/AnimalService";

import {
  searchScientificName,
  searchSection,
} from "../../services/SearchService";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment/moment";
import HounsingCard from "../../components/housing/HounsingCard";
import { setDestination } from "../../redux/AnimalMovementSlice";
import ListEmpty from "../../components/ListEmpty";
import { shortenNumber } from "../../utils/Utils";
// import { errorToast } from "../../utils/Alert";
import FontSize from "../../configs/FontSize";
import {
  getEnclosureSiteWiseData,
  getHousingSection,
} from "../../services/housingService/SectionHousing";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import Spacing from "../../configs/Spacing";
import { useToast } from "../../configs/ToastConfig";
import { QrGetDetails } from "../../services/staffManagement/addPersonalDetails";
import { getEnclosureBySectionId } from "../../services/GetEnclosureBySectionIdServices";

const SearchTransferanimal = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();
  const [searchText, setSearchText] = useState("");

  const [value, setValue] = useState(null);
  const [secondValue, setSecondValue] = useState(
    props?.route?.params?.selectedSite ?? null
  );
  const [idData, setIdData] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const [collectiondata, setCollectionData] = useState([]);
  const [siteData, setSiteData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Date");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [sectionDataLength, setSectionDataLength] = useState([]);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const site = useSelector((state) => state.UserAuth.zoos);

  const [userDepartmentdata, setUserDepartmentData] = useState([]);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleConfirm = (date) => {
    let format = moment(date).format("MMM Do YY");
    setSelectedDate(format);
    hideDatePicker();
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const loadSectionData = (page_count) => {
    let postData = {
      zoo_id: zooID,
      page: page_count,
      offset: 10,
      selected_site_id: secondValue,
      filter_empty_enclosures: 1,
    };
    getHousingSection(postData)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : sectionData;
        setSiteData(
          site[0].sites.map((item) => ({
            label: item.site_name,
            value: item.site_id,
          }))
        );
        if (res.sections[0]) {
          setSectionDataLength(res.sections[0].length);
          setSectionData(dataArr.concat(res.sections[0]));
        } else {
          setSectionDataLength(0);
        }
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setPage(1);
    setLoading(true);
    loadSectionData(1, secondValue);
  }, [secondValue]);

  useEffect(() => {
    if (searchText.length >= 3) {
      setPage(1);
      const getData = setTimeout(() => {
        setRefreshing(true);
        searchValue(searchText);
      }, 1000);

      return () => clearTimeout(getData);
    } else if (searchText.length == 0) {
      setPage(1);
      setLoading(true);
      loadSectionData(1, secondValue);
    }
  }, [searchText]);

  const searchValue = (query) => {
    let requestObj = {
      searchquery: query,
      zoo_id: zooID,
    };
    searchSection(requestObj)
      .then((res) => {
        if (res.data) {
          setSectionDataLength(res?.data?.length);
          setSectionData(res?.data);
        } else {
          setSectionDataLength(0);
        }
      })
      .catch((error) => errorToast("error", "Oops! Something went wrong!!"))
      .finally(() => {
        setRefreshing(false);
        setLoading(false);
      });
  };

  const onVoiceInput = (text) => {
    setSearchText(text);
  };
  const backButton = () => {
    navigation.goBack();
  };

  const moveItHere = (item) => {
    dispatch(setDestination(item));
    navigation.goBack();
  };

  const handleLoadMore = () => {
    if (!Loading && sectionDataLength > 0 && searchText.length == 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadSectionData(nextPage);
    }
  };

  const renderFooter = () => {
    if (
      Loading ||
      sectionDataLength == 0 ||
      searchText.length > 0 ||
      sectionDataLength < 10
    )
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };

  useEffect(() => {
    let data = site[0].sites;
    let obj = {
      id: null,
      name: "All Sites",
    };

    // Add a new property to each object in the data array
    data = data.map((item) => ({
      ...item, // Copy the existing properties of the item
    }));
    data.unshift(obj);
    setSiteData(data);
  }, [site]);

  const mappedResult = siteData.map((item) => ({
    // Map the id as well
    id: item.value,
    name: item.label,
    // Add other properties if necessary
  }));
  const [rolesFilter, setRolesFilter] = useState(false);
  const toggleRoleModal = () => {
    setRolesFilter(!rolesFilter);
  };
  const closeRoleModal = () => {
    setRolesFilter(false);
  };
  const [selectedCheckBox, setselectedCheckBox] = useState("");

  const closeMenu = (item) => {
    if (isSelectedId(item.id)) {
      setselectedCheckBox(selectedCheckBox.filter((item) => item !== item.id));
    } else {
      setselectedCheckBox([selectedCheckBox, item.id]);
    }
    setValue(item.name ? item.name : item);
    setSecondValue(item.id);
    setRolesFilter(!rolesFilter);
  };
  const isSelectedId = (id) => {
    return selectedCheckBox.includes(id);
  };

  const QrMergeData = (item) => {
    setLoading(true);
    if (item.type == "section") {
      getdetail(item?.type, item?.section_id);
    } else if (item.type == "enclosure") {
      getdetail(item?.type, item?.enclosure_id);
    } else if (item.type == "animal") {
      getdetail(item?.type, item?.animal_id);
    }
  };

  const getdetail = (type, id) => {
    QrGetDetails({ type, id })
      .then((res) => {
        if (res.success) {
          navigation.navigate("MoveToEnclosure", {
            section: res.data,
            type: props?.route?.params?.type,
            isSection: type,
            isQr: true,
            onPress: (e) => moveItHere(e),
          });
          setLoading(false);
        } else {
          setLoading(false);
          warningToast("Oops!!", res.message);
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  return (
    <>
      <Loader visible={Loading} />
      <StatusBar
        barStyle="dark-content"
        backgroundColor={constThemeColor.surfaceVariant}
      />
      <View style={[reduxColors.container]}>
        <View style={[reduxColors.searchbox, {}]}>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate("MoveSearchScreen", {
              //   name: "Enclosure",
              //   onPress: (e) => moveItHere(e),
              //   selected_site_id: secondValue,
              // });
            }}
          >
            <Searchbar
              mode="bar"
              autoFocus={false}
              editable={true}
              placeholder="Search Section"
              caretHidden={true}
              onChangeText={(e) => {
                setSearchText(e);
              }}
              // onFocus={() => {
              //   navigation.navigate("MoveSearchScreen", {
              //     name: "Enclosure",
              //     onPress: (e) => moveItHere(e),
              //     selected_site_id: secondValue,
              //   });
              // }}
              value={searchText}
              loading={refreshing}
              style={{
                backgroundColor: constThemeColor.surface,
              }}
              icon={(size) => (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={reduxColors.neutralPrimary}
                />
              )}
              onIconPress={backButton}
              right={() => (
                <>
                  <MaterialIcons
                    name="qr-code-scanner"
                    size={24}
                    color={reduxColors.neutralPrimary}
                    style={{ marginRight: heightPercentageToDP(3) }}
                    onPress={() =>
                      navigation.navigate("LatestCamScanner", {
                        dataSendBack: (item) => QrMergeData(item),
                        screen: "enclosure",
                      })
                    }
                  />
                </>
              )}
            />
          </TouchableOpacity>
        </View>

        {/* <View style={reduxColors.secondItembox}>
          <Dropdown
            style={reduxColors.siteDropdown}
            placeholderStyle={reduxColors.placehStyle}
            selectedTextStyle={reduxColors.itemstyle}
            itemTextStyle={reduxColors.containerStyleDrop}
            containerStyle={reduxColors.sitecontainerStyle}
            itemContainerStyle={reduxColors.ItemcontainerStyle}
            showsVerticalScrollIndicator={false}
            data={siteData}
            labelField="label"
            valueField="value"
            placeholder="Site"
            searchPlaceholder="Search..."
            value={secondValue}
            onChange={(item) => {
              setSecondValue(item.value);
              // loadSectionData(1,item.value)
            }}
          />
        </View>
        <View style={reduxColors.textBox}>
          <Text style={reduxColors.textstyle}>Sections</Text>
        </View> */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: Spacing.body,
          }}
        >
          {rolesFilter ? (
            <ModalFilterComponent
              onPress={toggleRoleModal}
              onDismiss={closeRoleModal}
              onBackdropPress={closeRoleModal}
              onRequestClose={closeRoleModal}
              data={mappedResult}
              closeModal={closeMenu}
              title="Filter By"
              style={{ alignItems: "flex-start" }}
              isSelectedId={isSelectedId}
              radioButton={true}
            />
          ) : null}
        </View>
        <View
          style={[
            reduxColors.textBox,
            { justifyContent: "space-between", marginBottom: Spacing.small },
          ]}
        >
          <View>
            <Text style={reduxColors.textstyle}>Sections</Text>
          </View>
          <View
            style={{
              // marginHorizontal: Spacing.minor,
              // marginBottom: Spacing.small,
              alignItems: "flex-end",
            }}
          >
            {props?.route?.params?.screen == "Transfer" ? null : (
              <ModalTitleData
                selectDrop={value ? value : "All Sites"}
                toggleModal={toggleRoleModal}
                filterIcon={true}
                size={22}
                filterIconStyle={{ marginLeft: Spacing.small }}
              />
            )}
          </View>
        </View>
        <View style={reduxColors.listItem}>
          {sectionDataLength === 0 && page < 2 ? (
            <ListEmpty label="No sections created yet" visible={Loading} />
          ) : (
            <FlatList
              data={sectionData}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<ListEmpty visible={Loading} />}
              renderItem={({ item }) => (
                <View>
                  <HounsingCard
                    title={item.section_name}
                    incharge={item.incharge_name ? item.incharge_name : "NA"}
                    chip1={"Enclosures " + shortenNumber(item.total_enclosures)}
                    chip2={"Animals " + shortenNumber(item.total_animals)}
                    onPress={() =>
                      navigation.navigate("MoveToEnclosure", {
                        section: item,
                        type: props?.route?.params?.type,
                        isSection: "section",
                        onPress: (e) => moveItHere(e),
                      })
                    }
                    style={reduxColors.containerStyle}
                  />
                </View>
              )}
              onEndReachedThreshold={0.5}
              onEndReached={handleLoadMore}
              ListFooterComponent={renderFooter}
            />
          )}
        </View>
      </View>
      <View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </>
  );
};

export default SearchTransferanimal;

const styles = (reduxColors) =>
  StyleSheet.create({
    containerStyle: {
      marginVertical: 6,
      // marginHorizontal: 12,
      borderRadius: 10,
    },
    containerStyleDrop: {
      marginVertical: 0,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    itemTextStyle: {},
    container: {
      flex: 1,
      // justifyContent:"center",
      // alignItems: "center",
      width: "100%",
      paddingHorizontal: Spacing.body,
      backgroundColor: reduxColors.surfaceVariant,
    },
    searchbox: {
      marginTop: heightPercentageToDP(2),
      // marginTop: Spacing.body,
      // width: widthPercentageToDP(90),
      // justifyContent: "center",
      // alignItems: "center",
    },

    secondItembox: {
      width: widthPercentageToDP(90),
      marginTop: heightPercentageToDP(2),
      flexDirection: "row",
      alignItems: "flex-end",
    },

    siteDropdown: {
      width: widthPercentageToDP(29),
      height: heightPercentageToDP(4),
      borderWidth: widthPercentageToDP(0.2),
      marginRight: widthPercentageToDP(3),
      borderRadius: 8,
      backgroundColor: reduxColors.onPrimary,
    },
    sitecontainerStyle: {
      minWidth: widthPercentageToDP(35),
      marginRight: 10,
    },

    textBox: {
      // marginTop: heightPercentageToDP(3),
      // alignItems: "flex-start",
      // width: widthPercentageToDP(90),
      flexDirection: "row",
      justifyContent: "space-around",
    },

    textstyle: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSecondaryContainer,
    },
    dropdownBox: {
      marginTop: heightPercentageToDP(2),
      width: widthPercentageToDP(90),
    },

    placehStyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
    },
    itemstyle: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
    },

    cardstyle: {
      backgroundColor: reduxColors.onPrimary,
      borderRadius: widthPercentageToDP("2%"),
      marginVertical: widthPercentageToDP("2%"),

      elevation: 2, // for shadow on Android
      shadowColor: reduxColors.shadow, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      flexDirection: "row",
      paddingHorizontal: 10,
      paddingVertical: 10,
      width: widthPercentageToDP(90),
      alignSelf: "center",
    },
    listItem: {
      flex: 1,
      // marginTop: heightPercentageToDP(1),
      // width: widthPercentageToDP(100),
    },
    // containerStyle : {
    //   marginVertical: 7,
    //      marginHorizontal: 12,
    //            borderRadius : 10,
    //            backgroundColor:'blue'
    //   }
  });
