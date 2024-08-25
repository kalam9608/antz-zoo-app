import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import Header from "./Header";
import { useSelector } from "react-redux";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import CheckBox from "./CheckBox";
import Spacing from "../configs/Spacing";
import { getObservationListforAdd } from "../services/ObservationService";
import Loader from "./Loader";
import Modal from "react-native-modal";
import FontSize from "../configs/FontSize";
import FilterScreenHeader from "./FilterScreenHeader";
import { searchUserListing } from "../services/Animal_movement_service/SearchApproval";
import { Image } from "react-native";
import { Chip } from "react-native-paper";
import UserCustomCard from "./UserCustomCard";

const FilterComponent = ({ items, fetchData, dataSendBack, selectedData }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const [screenId, setScreenId] = useState();
  const [item, setItem] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [subItem, setSubItem] = useState([]);
  const [type, setType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");

  useEffect(() => {
    setItemCount(item.filter((a) => a.isSelect == true).length);
  }, [item]);

  useEffect(() => {
    if (isModalOpen && item.length == 0) {
      fetchData();
    }
    const test = selectedData.length > 0;
    setItem(test ? selectedData : items);
    setScreenId(test ? selectedData[0]?.id : items[0]?.id);
    setSubItem(test ? selectedData[0]?.subItem : items[0]?.subItem);
    setType(test ? selectedData[0]?.type : items[0]?.type);
  }, [isModalOpen, items]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const singleClear = () => {
    let arr = subItem ?? [];
    arr = arr.map((item) => ({
      ...item,
      isSelect: false,
    }));
    setItem(
      item.map((item) => ({
        ...item,
        subItem: item.id == screenId ? arr : item.subItem,
        isSelect:
          item.id == screenId
            ? arr.filter((a) => a.isSelect == true).length > 0
              ? true
              : false
            : item.isSelect,
      }))
    );
    setSubItem(arr);
  };

  const clearAll = () => {
    let arr = subItem ?? [];
    arr = arr.map((item) => ({
      ...item,
      isSelect: false,
    }));
    setItem(
      item.map((item) => ({
        ...item,
        subItem: item.subItem.map((b) => ({
          ...b,
          isSelect: false,
        })),
        isSelect: false,
      }))
    );
    setSubItem(arr);
  };

  const handleFilter = () => {
    setIsModalOpen(false);
    dataSendBack(item.filter((a) => a.isSelect == true).length > 0 ? item : []);
  };

  const selectAction = (e) => {
    let arr = subItem ?? [];
    arr = arr.map((item) => ({
      ...item,
      isSelect: item.id == e.id ? !e.isSelect : item.isSelect,
    }));
    // let data = e;
    // data.isSelect = !data.isSelect;
    setItem(
      item.map((item) => ({
        ...item,
        subItem: item.id == screenId ? arr : item.subItem,
        isSelect:
          item.id == screenId
            ? arr.filter((a) => a.isSelect == true).length > 0
              ? true
              : false
            : item.isSelect,
      }))
    );
    setSubItem(arr);
  };

  const handleSearch = (text) => {
    setSearchModalText(text);
    // let arr = subItem;
    // if (text.length > 2) {
    //   arr = arr.filter((e) => {
    //     return (
    //       (e?.name && e?.name.toLowerCase().match(text.toLowerCase())) ||
    //       (e?.user_name && e?.user_name.toLowerCase().match(text.toLowerCase()))
    //     );
    //   });
    //   setSubItem(arr);
    // } else {
    //   setSubItem(item[item.findIndex((a) => a.id == screenId)].subItem);
    // }
  };

  return (
    <>
      <TouchableOpacity style={{ flexDirection: "row" }} onPress={openModal}>
        <MaterialIcons
          name="filter-list"
          color={constThemeColor.onSurface}
          size={16}
        />
        <Text style={reduxColors.dropdown}>
          Filter {itemCount > 0 && "(" + itemCount + ")"}
        </Text>
      </TouchableOpacity>
      <Modal
        avoidKeyboard
        animationType="fade"
        visible={isModalOpen}
        onDismiss={closeModal}
        onBackdropPress={closeModal}
        onRequestClose={closeModal}
        style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: constThemeColor.surfaceVariant,
          }}
        >
          {/* header */}
          {/* <Header title="Filters" noIcon={true} search={!true} /> */}
          <SafeAreaView
            style={{
              backgroundColor: constThemeColor.onPrimary,
              borderBottomWidth: 1,
              borderBottomColor: constThemeColor.outlineVariant,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{width: '100%',flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.minor, justifyContent: 'space-between', paddingVertical: Spacing.body}}>
            <Text
              style={{
                color: constThemeColor.onSecondaryContainer,
                fontSize: FontSize.Antz_Medium_Medium.fontSize,
                fontWeight: FontSize.Antz_Major_Regular.fontWeight,
              }}
            >
              Filters {"("}
              {itemCount}
              {")"}
            </Text>

            <TouchableOpacity onPress={closeModal}>
              <AntDesign
                name="close"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* main screen  */}
          <View style={{ flexDirection: "row", flex: 1 }}>
            {/* left screen */}
            <View style={reduxColors.leftScreen}>
              {/* Filters Button */}
              <View style={{ flex: 1 }}>
                {item.map((value, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setScreenId(value.id);
                        setSubItem(value.subItem);
                        setType(value.type);
                        setSearchModalText("");
                      }}
                      style={{
                        padding: Spacing.body,
                        paddingLeft: Spacing.minor,
                        backgroundColor:
                          value.id == screenId
                            ? constThemeColor.onPrimary
                            : constThemeColor.background,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: constThemeColor.neutralPrimary,
                          textAlign: "center",
                          fontSize: FontSize.Antz_Subtext_title.fontSize,
                          fontWeight: FontSize.Antz_Subtext_title.fontWeight,
                        }}
                      >
                        {value.title}
                      </Text>

                      <Text
                        style={{
                          color: constThemeColor.neutralPrimary,
                          textAlign: "center",
                          fontSize: FontSize.Antz_Subtext_title.fontSize,
                          fontWeight: FontSize.Antz_Subtext_title.fontWeight,
                        }}
                      >
                        {
                          value.subItem.filter((item) => item.isSelect == true)
                            .length
                        }
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* right scren */}
            <View style={reduxColors.rightScreen}>
              <View>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <View style={reduxColors.searchBox}>
                    <TextInput
                      style={[reduxColors.input, {paddingVertical: Spacing.small}]}
                      placeholder={"Search"}
                      onChangeText={(e) => handleSearch(e)}
                      value={searchModalText}
                      placeholderTextColor={constThemeColor.onPrimaryContainer}
                      
                    />
                    <Ionicons
                      name="search"
                      size={14}
                      color={constThemeColor.onPrimaryContainer}
                      // style={{ position: "absolute", right: 16 }}
                    />
                  </View>
                  {/* {subItem?.filter((item) => item.isSelect == true).length >
                    0 && (
                    <TouchableOpacity
                      style={{
                        width: 50,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={singleClear}
                    >
                      <Text style={reduxColors.singleClear}>Clear</Text>
                    </TouchableOpacity>
                  )} */}
                </View>
                <ScrollView
                  contentContainerStyle={{ paddingBottom: Spacing.major }}
                >
                  {subItem
                    ?.filter(
                      (e) =>
                        (e?.name &&
                          e?.name
                            .toLowerCase()
                            .match(searchModalText.toLowerCase())) ||
                        (e?.user_name &&
                          e?.user_name
                            .toLowerCase()
                            .match(searchModalText.toLowerCase()))
                    )
                    .map((item, index) => (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "flex-start",
                        }}
                        key={index}
                      >
                        {type == "user" ? (
                          <UserCustomCard
                            item={item}
                            onPress={() => selectAction(item)}
                          />
                        ) : (
                          <Chip
                            style={{
                              marginTop: Spacing.small,
                              backgroundColor: item.isSelect
                                ? constThemeColor.onBackground
                                : constThemeColor.background,
                              borderRadius: Spacing.mini,
                            }}
                            selected={item.isSelect}
                            showSelectedCheck={false}
                            key={index}
                            onPress={() => selectAction(item)}
                            onClose={
                              item.isSelect
                                ? () => selectAction(item)
                                : undefined
                            }
                          >
                            {item.name}
                          </Chip>
                        )}
                      </View>
                    ))}
                </ScrollView>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent:
                item?.filter((a) => a.isSelect == true).length > 0
                  ? "space-between"
                  : "flex-end",
              padding: Spacing.body,
              backgroundColor: constThemeColor.onPrimary,
              borderTopWidth: 1,
              borderTopColor: constThemeColor.outlineVariant,
            }}
          >
            {item?.filter((a) => a.isSelect == true).length > 0 && (
              <TouchableOpacity
                style={{
                  paddingHorizontal: Spacing.minor,
                  paddingVertical: Spacing.small,
                  borderRadius: Spacing.small,
                  alignItems: "center",
                }}
                onPress={clearAll}
              >
                <Text
                  style={{
                    color: constThemeColor.tertiary,
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  }}
                >
                  Clear all
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                paddingHorizontal: Spacing.minor,
                paddingVertical: Spacing.small,
                borderRadius: Spacing.small,
                backgroundColor: constThemeColor.primary,
                // item?.filter((a) => a.isSelect == true).length > 0
                //   : constThemeColor.insightMenu,
                alignItems: "center",
              }}
              // disabled={item?.filter((a) => a.isSelect == true).length == 0}
              onPress={handleFilter}
            >
              <Text
                style={{
                  color: constThemeColor.onPrimary,
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                }}
              >
                Apply filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default FilterComponent;

const styles = (reduxColors) =>
  StyleSheet.create({
    leftScreen: {
      flex: 0.42,
      backgroundColor: reduxColors.background,
    },
    rightScreen: {
      flex: 0.58,
      backgroundColor: reduxColors.onPrimary,
      padding: Spacing.body,
      justifyContent: "space-between",
    },
    input: {
      flex: 1,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    card: {
      marginVertical: Spacing.mini,
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.onPrimary,
    },
    selectedCard: {
      backgroundColor: reduxColors.surface,
    },
    singleClear: {
      color: reduxColors.tertiary,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    searchBox: {
      width: "100%",
      flexDirection: "row",
      borderWidth: 1,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Spacing.small,
      borderColor: reduxColors.outline,
      borderRadius: Spacing.small,
      marginBottom: Spacing.body
    },
    userTitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    designation: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginTop: Spacing.micro,
    },
    dropdown: {
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
      color: reduxColors.onPrimaryContainer,
    },
  });
