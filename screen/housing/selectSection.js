import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Searchbar } from "react-native-paper";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Loader from "../../components/Loader";

import { searchSection } from "../../services/SearchService";
import HounsingCard from "../../components/housing/HounsingCard";
import { setDestination } from "../../redux/AnimalMovementSlice";
import ListEmpty from "../../components/ListEmpty";
import { shortenNumber } from "../../utils/Utils";
import FontSize from "../../configs/FontSize";
import { getHousingSection } from "../../services/housingService/SectionHousing";
import Spacing from "../../configs/Spacing";
import { useToast } from "../../configs/ToastConfig";
import { QrGetDetails } from "../../services/staffManagement/addPersonalDetails";

const SelectSection = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  const [secondValue] = useState(null);
  const [sectionData, setSectionData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Date");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [sectionDataLength, setSectionDataLength] = useState([]);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const site = useSelector((state) => state.UserAuth.zoos);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const { errorToast, warningToast } = useToast();

  const loadSectionData = (page_count) => {
    let postData = {
      zoo_id: zooID,
      page: page_count,
      offset: 10,
      selected_site_id:
        props?.route?.params?.transfer_type == "intra"
          ? props?.route?.params?.site_id
          : null,
      filter_empty_enclosures: 1,
    };
    if (props?.route?.params?.module_name === "transfer") {
      postData.module_name = "transfer";
      postData.movement_id = props?.route?.params?.movement_id;
    }
    getHousingSection(postData)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : sectionData;
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
  const isFirstRender = useRef(true);
  useEffect(() => {
    setPage(1);
    setLoading(true);
    loadSectionData(1, secondValue);
  }, [secondValue]);

  useEffect(() => {
    if (!isFirstRender?.current) {
      if (searchText.length >= 3) {
        setPage(1);
        const getData = setTimeout(() => {
          setRefreshing(true);
          searchValue(searchText, 1);
        }, 1000);

        return () => clearTimeout(getData);
      } else if (searchText.length == 0) {
        setPage(1);
        setLoading(true);
        loadSectionData(1, secondValue);
      }
    } else {
      isFirstRender.current = false;
    }
  }, [searchText]);

  const searchValue = (query, page_count) => {
    let requestObj = {
      searchquery: query,
      zoo_id: zooID,
      limit: 10,
      offset: page_count,
    };
    searchSection(requestObj)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : sectionData;
        if (res.data) {
          setSectionDataLength(res?.data?.length);
          setSectionData(dataArr.concat(res?.data));
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

  const backButton = () => {
    navigation.goBack();
  };

  const moveItHere = (item) => {
    dispatch(setDestination(item));
    // navigation.goBack();         /// commented this so that scanner can work in case of allocate enclosures
  };

  const handleLoadMore = () => {
    if (!Loading && sectionDataLength > 0) {
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
          {
            /*  uses replace instead of navigate so that 
             it can handle side effects when we navigate back to the same page
             */
            // Not using the push method - as when user scans the code again it can be problematic or
            // think of looping when scanning again and again from the scanner
          }
          navigation.replace("SelectEnclosure", {
            section: res.data,
            type: props?.route?.params?.type,
            isSection: type,
            isQr: true,
            site_id: props.route.params?.site_id,
            selected_animal: props.route.params?.selectedAnimal,
            animal_movement_id: props.route.params?.animal_movement_id,
            transfer_type: props?.route?.params?.transfer_type,
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

        <View style={[reduxColors.textBox]}>
          <Text style={reduxColors.textstyle}>Sections</Text>
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
                      navigation.navigate("SelectEnclosure", {
                        section: item,
                        type: props?.route?.params?.type,
                        isSection: "section",
                        selected_animal: props.route.params?.selectedAnimal,
                        site_id: props.route.params?.site_id,
                        request_id: props?.route?.params?.request_id,
                        transfer_type: props?.route?.params?.transfer_type,
                        animal_movement_id:
                          props.route.params?.animal_movement_id,
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
    </>
  );
};

export default SelectSection;

const styles = (reduxColors) =>
  StyleSheet.create({
    containerStyle: {
      marginVertical: 6,
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
      width: "100%",
      paddingHorizontal: Spacing.body,
      backgroundColor: reduxColors.surfaceVariant,
    },
    searchbox: {
      marginTop: heightPercentageToDP(2),
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
      marginTop: Spacing.major,
      marginBottom: Spacing.small,
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

      elevation: 2,
      shadowColor: reduxColors.shadow,
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
    },
  });
