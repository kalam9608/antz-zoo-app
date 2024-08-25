import React, { useState, createRef, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Searchbar, Checkbox } from "react-native-paper";
import VoiceText from "../components/VoiceText";
import { SearchPage } from "../configs/Config";
import Colors from "../configs/Colors";
import {
  searchCommonName,
  searchEnclosure,
  searchIdentifier,
  searchScientificName,
  searchSection,
  searchSite,
} from "../services/SearchService";
import { useSelector } from "react-redux";
import Category from "../components/DropDownBox";
import Modal from "react-native-modal";
import CustomCard from "../components/CustomCard";
import CustomList from "../components/CustomList";
import {
  capitalize,
  checkPermissionAndNavigateWithAccess,
} from "../utils/Utils";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";
import BottomSheetModalStyles from "../configs/BottomSheetModalStyles";
import { Platform } from "react-native";
import SpeciesCustomCard from "../components/SpeciesCustomCard";
import AnimalCustomCard from "../components/AnimalCustomCard";
import HounsingCard from "../components/housing/HounsingCard";
import Spacing from "../configs/Spacing";
import ModalFilterComponent, {
  ModalTitleData,
} from "../components/ModalFilterComponent";
import { getStaffListWithPagination } from "../services/staffManagement/addPersonalDetails";
import UserCustomCard from "../components/UserCustomCard";
import { useFilteredArray } from "../components/Custom_hook/UserPermissionHook";
import ListEmpty from "../components/ListEmpty";

const deviceWidth = Dimensions.get("window").width;

const SearchScreen = (props) => {
  const [searchText, setSearchText] = useState("");
  const SearchItems = useFilteredArray(SearchPage);
  const [value, setValue] = useState(
    SearchItems?.find(
      (element) => element.name == capitalize(props.route.params?.SearchType)
    )?.name ?? SearchItems[0].name
  );
  const [selectedCheckBox, setselectedCheckBox] = useState(
    SearchItems?.find(
      (element) => element.name == capitalize(props.route.params?.SearchType)
    )?.id ?? SearchItems[0].id
  );
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [searchdata, setSearchData] = useState([]);
  const [searchTypeID, setSearchTypeID] = useState("");
  const [secrhDropDownOpen, setSecrchDropDownOpen] = useState(false);
  const [apiDataShow, setApiDataShow] = useState(false);
  const navigation = useNavigation();
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const permission = useSelector((state) => state.UserAuth.permission);
  const gotoBack = () => navigation.goBack();

  let popUpRef = createRef();
  const searchRef = useRef();

  const firstLetter = (s) => {
    return s ? s[0].toUpperCase() : "...";
  };
  const [checkedItems, setCheckedItems] = useState([]);
  const isCheckedId = (id) => {
    return checkedItems.includes(id);
  };

  const onValueChacked = (id) => {
    if (isCheckedId(id)) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const navigateToComponent = ({ screenName, params }) => {
    setPage(1);
    navigation.navigate(screenName, params);
  };
  const List = ({ item, dynamicStyles }) => {
    if (value === "Enclosure") {
      return (
        <CustomCard
          title={capitalize(item.user_enclosure_name)}
          textTransformStyle={"none"}
          svgUri={true}
          count={
            permission["housing_view_insights"]
              ? item.enclosure_wise_animal_count
              : null
          }
          onPress={() =>
            navigateToComponent({
              screenName: "OccupantScreen",
              params: {
                enclosure_id: item?.enclosure_id ?? 0,
                section_id: item?.section_id,
                section_name: item?.section_name,
                enclosure_name: item?.user_enclosure_name,
                enclosure_id: item?.enclosure_id,
              },
            })
          }
        />
      );
    } else if (value === "Section") {
      return (
        <HounsingCard
          style={dynamicStyles.containerStyle}
          title={item.section_name}
          incharge={item.incharge_name ? item.incharge_name : "NA"}
          sitename={item?.site_name ?? "NA"}
          onPress={() =>
            navigation.navigate("HousingEnclosuer", {
              section_id: item?.section_id ?? 0,
              sectiondata: item,
              incharge_name: item.incharge_name ? item.incharge_name : "NA",
            })
          }
        />
      );
    } else if (value === "Site") {
      return (
        <CustomList
          title={capitalize(item.site_name)}
          subtitle={
            item.site_description &&
            "Site Description: " + item.site_description
          }
          valueletter={firstLetter(item.site_name)}
          onPress={() => {
            navigation.navigate("siteDetails", {
              // site: {
              //   id: item.site_id,
              // },
              id: item.site_id,
            });
          }}
        />
      );
    } else if (value === "Common Name") {
      return (
        <SpeciesCustomCard
          icon={item.default_icon}
          animalName={item.common_name ? capitalize(item.common_name) : "NA"}
          complete_name={item.scientific_name ? item.scientific_name : "NA"}
          tags={item.sex_data}
          count={item?.sex_data?.total}
          onPress={() => {
            navigation.navigate("SpeciesDetails", {
              title: item.common_name,
              subtitle: item.scientific_name,
              tags: item.sex_data,
              tsn_id: item.tsn,
            });
          }}
        />
      );
    } else if (value === "Scientific Name") {
      return (
        <SpeciesCustomCard
          icon={item.default_icon}
          animalName={
            item.scientific_name ? capitalize(item.scientific_name) : "NA"
          }
          complete_name={item.common_name ? item.common_name : "NA"}
          tags={item.sex_data}
          count={item?.sex_data?.total}
          onPress={() => {
            navigation.navigate("SpeciesDetails", {
              title: item.common_name,
              subtitle: item.scientific_name,
              tags: item.sex_data,
              tsn_id: item.tsn,
            });
          }}
        />
      );
    } else if (value === "Identifier") {
      return (
        <AnimalCustomCard
          item={item}
          show_housing_details={true}
          show_specie_details={true}
          chips={item.sex}
          icon={item?.default_icon}
          enclosureName={item.user_enclosure_name}
          sectionName={item.section_name}
          animalName={
            item.common_name ? item.common_name : item.scientific_name
          }
          animalIdentifier={
            !item?.local_identifier_value
              ? item?.animal_id
              : item?.local_identifier_name ?? null
          }
          localID={item?.local_identifier_value ?? null}
          rightIcon={
            <View
              style={{
                marginRight: widthPercentageToDP("4%"),
              }}
            >
              <AntDesign
                name="right"
                size={14}
                color={constThemeColor.onSurfaceVariant}
              />
            </View>
          }
          onPress={() =>
            checkPermissionAndNavigateWithAccess(
              permission,
              "collection_animal_record_access",
              navigation,
              "AnimalsDetails",
              {
                animal_id: item.animal_id,
              },
              "VIEW"
            )
          }
        />
      );
    } else if (value === "User") {
      return (
        <UserCustomCard
          item={item}
          onPress={() => {
            navigation.navigate("UserDetails", {
              allData: item,
              user_id: item.user_id,
            });
          }}
        />
      );
    }
  };

  useEffect(() => {
    setSearchData([]);
    seterrorMessage("");
    const getData = setTimeout(() => {
      searchData(searchText, value, page);
    }, 1000);

    return () => clearTimeout(getData);
  }, [searchText, value]);

  const searchData = (query, val, page) => {
    if (query.length >= 2) {
      let requestObj = {
        searchquery: query,
        zoo_id: zooID,
        limit: 10,
        offset: page,
      };
      if (val === "Enclosure") {
        setisLoading(true);
        searchEnclosure(requestObj)
          .then((res) => {
            if (res.data.length > 0) {
              Keyboard.dismiss();
            }
            setSearchData(res.data);
            setApiDataShow(true);
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setisLoading(false);
          });
      } else if (val === "Section") {
        setisLoading(true);
        searchSection(requestObj)
          .then((res) => {
            if (res.data.length > 0) {
              Keyboard.dismiss();
            }
            setSearchData(res.data);
            setApiDataShow(true);
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setisLoading(false);
          });
      } else if (val === "Site") {
        setisLoading(true);
        searchSite(requestObj)
          .then((res) => {
            if (res.data.length > 0) {
              Keyboard.dismiss();
            }
            setSearchData(res.data);
            setApiDataShow(true);
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setisLoading(false);
          });
      } else if (val === "Common Name") {
        setisLoading(true);
        searchCommonName(requestObj)
          .then((res) => {
            if (res.data.length > 0) {
              Keyboard.dismiss();
            }
            setSearchData(res.data);
            setApiDataShow(true);
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setisLoading(false);
          });
      } else if (val === "Scientific Name") {
        setisLoading(true);
        searchScientificName(requestObj)
          .then((res) => {
            if (res.data.length > 0) {
              Keyboard.dismiss();
            }
            setSearchData(res.data);
            setApiDataShow(true);
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setisLoading(false);
          });
      } else if (val === "Identifier") {
        setisLoading(true);
        searchIdentifier(requestObj)
          .then((res) => {
            if (res.data.length > 0) {
              Keyboard.dismiss();
            }
            setSearchData(res.data);
            setApiDataShow(true);
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setisLoading(false);
          });
      } else if (val === "User") {
        setisLoading(true);
        let postData = {
          zoo_id: zooID,
          q: query,
        };
        getStaffListWithPagination(postData)
          .then((res) => {
            if (res.data.length > 0) {
              Keyboard.dismiss();
            }
            setSearchData(res.data);
            setApiDataShow(true);
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setisLoading(false);
          });
      } else {
        seterrorMessage("Please Choose Search by..");
      }
    } else {
      setApiDataShow(false);
    }
  };

  const onVoiceInput = (text) => {
    setSearchText(text);
  };

  // const SetDropDown = (data) => {
  //   setSecrchDropDownOpen(true)
  //   setSecrchDropDownOpen(data)
  // };

  const searchPressed = (item) => {
    setSecrchDropDownOpen(!secrhDropDownOpen);
    setValue(item.map((value) => value.name).join(","));
    setSearchTypeID(item.map((value) => value.id).join(","));
  };

  {
    /*
    Author: Biswanath nath
    Date:  01.05.2023
    Desc: When scroll reach end will call this function to work as pagination and load more data
  */
  }
  const handleLoadMore = () => {
    if (!isLoading && searchdata.length > 0) {
      let p = page + 1; // increase page by 1
      setPage(p);
      searchData(searchText, value, p); // method for API call
    }
  };

  const acsnClose = () => {
    setSecrchDropDownOpen(false);
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  const closeMenu = (item) => {
    // if (isSelectedId(item.id)) {
    //   // setselectedCheckBox(selectedCheckBox.filter((item) => item !== item.id));
    // } else {
    //   setselectedCheckBox([selectedCheckBox, item.id]);
    // }
    setselectedCheckBox(item.id);
    setValue(item.name);
    setSearchScreenModal(!searchScreenModal);
  };
  const [searchScreenModal, setSearchScreenModal] = useState(false);
  const togglePrintModal = () => {
    setSearchScreenModal(!searchScreenModal);
  };
  const closePrintModal = () => {
    setSearchScreenModal(false);
  };
  const isSelectedId = (id) => {
    return selectedCheckBox == id;
  };
  return (
    <>
      <View
        style={[
          dynamicStyles.container,
          { backgroundColor: constThemeColor.surfaceVariant },
        ]}
      >
        {/* <Loader visible={isLoading} /> */}
        <View>
          <Searchbar
            ref={searchRef}
            placeholder={value === "" ? "Search..." : `Search by ${value}`}
            inputStyle={dynamicStyles.input}
            placeholderTextColor={dynamicStyles.onSurfaceVariant}
            onIconPress={gotoBack}
            style={[
              dynamicStyles.Searchbar,
              { backgroundColor: constThemeColor.onPrimary },
            ]}
            loading={isLoading}
            onChangeText={(e) => {
              setSearchText(e);
            }}
            value={searchText}
            autoFocus={true}
            icon={({ size, color }) => (
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            )}
            right={() => (
              <View
                style={{
                  marginHorizontal: Spacing.minor,
                  flexDirection: "row",
                }}
              >
                {searchText ? (
                  <AntDesign
                    name="close"
                    size={22}
                    color={constThemeColor.onSurfaceVariant}
                    onPress={() => setSearchText("")}
                    style={{ marginRight: 12, marginLeft: 0 }}
                  />
                ) : null}

                <ModalTitleData
                  toggleModal={togglePrintModal}
                  filterIconStyle={{ marginRight: Spacing.small }}
                  size={20}
                />
              </View>
            )}
          />
          {errorMessage ? (
            <Text style={dynamicStyles.errortext}>{errorMessage}</Text>
          ) : null}
        </View>

        <View style={dynamicStyles.SearchContainer}>
          {searchdata.length > 0 ? (
            <Text
              style={{
                // textAlign: "center",
                fontSize: FontSize.Antz_Body_Medium.fontSize,
                fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                color: constThemeColor.onSurfaceVariant,

                marginVertical: Spacing.body,
              }}
            >
              {isLoading === false
                ? "About " + searchdata.length + " results in " + value
                : ""}
            </Text>
          ) : (
            ""
          )}
          <FlatList
            data={searchdata}
            renderItem={({ item }) => (
              <List item={item} dynamicStyles={dynamicStyles} />
            )}
            ListEmptyComponent={<ListEmpty visible={isLoading} />}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.4}
            contentContainerStyle={{ paddingBottom: 20 }}
            onEndReached={handleLoadMore}
          />
        </View>
      </View>
      {searchScreenModal ? (
        <ModalFilterComponent
          onPress={togglePrintModal}
          onDismiss={closePrintModal}
          onBackdropPress={closePrintModal}
          onRequestClose={closePrintModal}
          data={SearchItems}
          closeModal={closeMenu}
          title="Filter By"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedId}
          radioButton={true}
        />
      ) : null}
      {/* {Platform.OS == "ios" && secrhDropDownOpen ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={secrhDropDownOpen}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={acsnClose}
          >
            <Category
              categoryData={SearchPage}
              onCatPress={searchPressed}
              heading={"Choose Search By"}
              isMulti={false}
              onClose={acsnClose}
            />
          </Modal>
        </View>
      ) : null}
      {Platform.OS != "ios" ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={secrhDropDownOpen}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={acsnClose}
          >
            <Category
              categoryData={SearchPage}
              onCatPress={searchPressed}
              heading={"Choose Search By"}
              isMulti={false}
              onClose={acsnClose}
            />
          </Modal>
        </View>
      ) : null} */}
    </>
  );
};

const styles = (DarkModeReducer) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    containerStyle: {
      marginVertical: Spacing.mini,
      borderRadius: 8,
    },
    errortext: {
      textAlign: "center",
      justifyContent: "center",
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: DarkModeReducer.error,
      marginVertical: Spacing.major,
    },
    button: {
      width: "81%",
      borderRadius: 5,
    },
    btnText: {
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
    },
    btnCont: {
      width: "100%",
      padding: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: DarkModeReducer.outline,
      marginTop: 10,
      height: 40,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    innerHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    idNumber: {
      marginLeft: 3,
      fontWeight: "500",
    },
    SearchContainer: {
      // backgroundColor: '#fff',
      // flex :1,
      // paddingHorizontal: 8,
      paddingBottom: 8,
      marginBottom: hp(9),
      marginTop: 10,
      marginHorizontal: Spacing.minor,
    },
    listContainer: {
      backgroundColor: "#ccc",
      marginVertical: 5,
      borderRadius: 8,
      padding: 7,
    },
    rightIcons: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: "3%",
      marginHorizontal: "1%",
    },
    Searchbar: {
      width: "100%",
      borderRadius: 0,
    },
    tagsContainer: {
      flexDirection: "row",
    },
    tag: {
      backgroundColor: "#f0f0f0",
      borderRadius: 8,

      paddingHorizontal: 8,
      marginRight: 8,
    },

    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: DarkModeReducer.surfaceVariant,
      marginHorizontal: 5,
      fontWeight: 500,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: DarkModeReducer.surfaceVariant,
      fontWeight: 500,
      marginLeft: 5,
    },
    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: DarkModeReducer.errorContainer,
      marginHorizontal: 5,
      fontWeight: 500,
    },
    indeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: "#F0F4FE",
      marginHorizontal: 5,
      fontWeight: 500,
    },
    malechipText: {
      fontSize: FontSize.Antz_Strong,
      color: DarkModeReducer.onPrimaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Strong,
      color: DarkModeReducer.onPrimaryContainer,
    },
    undeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: DarkModeReducer.onPrimaryContainer,
    },
    indeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: DarkModeReducer.onPrimaryContainer,
    },
    undeterminedChipB1: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: DarkModeReducer.secondary,
      marginHorizontal: 5,
      fontWeight: 500,
    },
    indeterminedChipE1: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: DarkModeReducer.primaryContainer,
      marginHorizontal: 5,
      fontWeight: 500,
    },
    malechipM: {
      backgroundColor: DarkModeReducer.surfaceVariant,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      marginHorizontal: 5,
      fontWeight: 500,
    },
    femalechipF: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: DarkModeReducer.secondary,
      fontWeight: 500,
      marginLeft: 5,
    },
    fabStyle: {
      margin: 10,
      right: 5,
      bottom: 20,
      width: 45,
      height: 45,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default SearchScreen;
