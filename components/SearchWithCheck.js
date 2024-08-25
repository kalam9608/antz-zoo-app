import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { Searchbar } from "react-native-paper";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import CheckBox from "./CheckBox";
import MedicalSearchFooter from "./MedicalSearchFooter";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
// import Checkbox from "expo-checkbox";

const SearchWithCheck = (props) => {
  const [selectCount, setSelectCount] = useState(0);
  const [toggleSelectedList, setToggleSelectedList] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [searchInput, setSearchInput] = useState(
    props.route.params?.itemName ? props.route.params?.itemName : ""
  );

  const [searchData, setsearchData] = useState(
    props.route.params?.listData ?? []
  );
  const [filterData, setfilterData] = useState(
    props.route.params?.listData ?? []
  );
  useEffect(() => {
    setSelectCount(filterData.filter((item) => item.is_active == true).length);
    setSelectedItems(filterData.filter((item) => item.is_active == true));
  }, [filterData]);

  /**
   * Select item
   */
  const selectAction = (e) => {
    let arr = filterData ?? [];
    arr = arr.map((item) => ({
      id: item.id,
      name: item.name,
      is_active: item.id == e.id ? !e.is_active : item.is_active,
    }));
    let data = e;
    data.is_active = Number(!data.is_active);
    setfilterData(arr);
    // setSelectedItems(arr);
  };
  // const selectAction = (e) => {
  //   let arr = filterData ?? [];
  //   const updatedData = arr?.map((item) => {
  //     if (item?.id === e?.id) {
  //       return { ...item, is_active: !item?.is_active };
  //     }
  //     return item;
  //   });

  //   setfilterData(updatedData);
  // };
  /**
   * Filter data
   */
  const searchFilterData = (item, array) => {
    setSearchInput(item);
    if (item.length > 2) {
      let arr = array ?? searchData;
      let newArr = arr.filter((e) => {
        return e.name.toLowerCase().match(item.toLowerCase());
      });
      setfilterData(newArr);
    } else {
      setfilterData(searchData);
    }
  };
  const back = () => {
    props.navigation.goBack();
    props.route.params?.onGoBack(filterData);
  };

  /**
   * Clear search
   */
  const clearSearch = () => {
    setSearchInput("");
    setfilterData(props.route.params?.listData ?? []);
  };

  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={constThemeColor?.onPrimary}
      />
      <View style={reduxColors.container}>
        <View>
          <Searchbar
            placeholder={`Search ${props.route.params?.name}`}
            placeholderTextColor={constThemeColor?.mediumGrey}
            defaultValue={props.route.params?.itemName}
            onChangeText={searchFilterData}
            value={searchInput}
            inputStyle={reduxColors.input}
            style={[
              reduxColors.Searchbar,
              { backgroundColor: constThemeColor?.onPrimary },
            ]}
            autoFocus={false}
            icon={({ size, color }) => (
              <Ionicons
                name="arrow-back"
                size={24}
                color
                style={{
                  color: constThemeColor?.onSecondaryContainer,
                }}
                onPress={() => props.navigation.goBack()}
              />
            )}
            right={() => (
              <>
                <View style={{ paddingRight: 10 }}>
                  {searchInput ? (
                    <View>
                      <Entypo
                        name="cross"
                        size={30}
                        color={constThemeColor?.mediumGrey}
                        onPress={clearSearch}
                      />
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              </>
            )}
          />
        </View>
        {/* Search List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filterData.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={reduxColors.searchItemList}
                onPress={() => selectAction(item)}
                activeOpacity={0.5}
              >
                <Text style={[reduxColors.searchItemName]}>{item.name}</Text>
                <View>
                  <CheckBox
                    key={item.id}
                    activeOpacity={1}
                    iconSize={18}
                    checked={item.is_active}
                    checkedColor={constThemeColor?.primary}
                    uncheckedColor={constThemeColor?.outline}
                    onPress={() => selectAction(item)}
                    labelStyle={[reduxColors.labelName]}
                  />
                  {/* <Checkbox
                  style={{height:18,width:18}}
                    value={item.is_active}
                    onValueChange={() => selectAction(item)}
                    color={item.is_active?constThemeColor?.primary:constThemeColor?.neutralPrimary}
                  /> */}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Footer */}

        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <MedicalSearchFooter
            title={props.route.params?.name}
            selectCount={selectCount}
            toggleSelectedList={toggleSelectedList}
            onPress={back}
            selectedItems={selectedItems}
          />
        </View>
      </View>
    </>
  );
};
export default SearchWithCheck;

const windowHeight = Dimensions.get("screen").height;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: reduxColors?.surfaceVariant,
      position: "relative",
    },
    Searchbar: {
      width: widthPercentageToDP(100),
      borderRadius: 0,
      borderBottomWidth: 1,
      borderColor: reduxColors?.lightGreyHexa,
    },
    searchItemList: {
      height: heightPercentageToDP(6),
      width: widthPercentageToDP(90),
      marginBottom: heightPercentageToDP(1),
      borderRadius: 5,
      paddingHorizontal: 10,
      backgroundColor: reduxColors?.surface,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    labelName: {
      color: reduxColors?.textColor,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
    },
    searchItemName: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      color: reduxColors?.neutralPrimary,
    },
  });
