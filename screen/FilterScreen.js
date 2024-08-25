import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { AntDesign, Entypo, Feather, Ionicons } from "@expo/vector-icons";
import CheckBox from "../components/CheckBox";
import Spacing from "../configs/Spacing";
import { getObservationListforAdd } from "../services/ObservationService";
import Loader from "../components/Loader";
import { searchUserListing } from "../services/Animal_movement_service/SearchApproval";
import FontSize from "../configs/FontSize";
import FilterScreenHeader from "../components/FilterScreenHeader";
import SearchOnPage from "../components/searchOnPage";
import { ifEmptyValue } from "../utils/Utils";

// priority icons
import low from "../assets/priroty/low.svg";
import moderate from "../assets/priroty/modrate.svg";
import high from "../assets/priroty/high.svg";
import icon_priority_critical from "../assets/priroty/icon_priority_critical.svg";
import icon_priority_low_filled from "../assets/priroty/icon_priority_low_filled.svg";
import icon_priority_high_filled from "../assets/priroty/icon_priority_high_filled.svg";
import icon_priority_medium_filled from "../assets/priroty/icon_priority_medium_filled.svg";
import icon_priority_critical_filled from "../assets/priroty/icon_priority_critical_filled.svg";
import { SvgXml } from "react-native-svg";

const FilterScreen = () => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const [screenName, setScreenName] = useState("Priority");
  const [observationTypeSelect, setObservationTypeSelect] = useState([]);
  const [priorityTypeSelect, setPriorityTypeSelect] = useState([]);
  const [ObservedByTypeSelect, setObservedByTypeSelect] = useState([]);
  const [priority, setPriority] = useState("");
  const [filterValue, setFilterValue] = useState([]);

  const submitHanlder = () => {
    let obj = {
      ObservationTypeValue: observationTypeSelect,
      priorityValue: priority,
      ObservedByTypeSelectValue: ObservedByTypeSelect,
    };
  };

  const Items = [
    {
      id: 1,
      title: "Note Type",
      screen: "ObservationType",
    },
    {
      id: 2,
      title: "Priority",
      screen: "Priority",
    },
    {
      id: 3,
      title: "Created By",
      screen: "ObservedBy",
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: constThemeColor.surfaceVariant,
      }}
    >
      {/* header */}
      <FilterScreenHeader filterValue={filterValue} />

      {/* main screen  */}
      <View style={{ flexDirection: "row", flex: 1 }}>
        {/* left screen */}
        <View style={reduxColors.leftScreen}>
          {/* Filters Button */}
          <View style={{ flex: 1 }}>
            {Items.map((value) => {
              return (
                <TouchableOpacity
                  onPress={() => setScreenName(value.screen)}
                  style={{
                    padding: Spacing.body,
                    paddingLeft: Spacing.minor,
                    backgroundColor:
                      value.screen == screenName
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
                    {value.screen == "ObservationType"
                      ? observationTypeSelect.length !== 0 &&
                        observationTypeSelect.length
                      : value.screen == "Priority"
                      ? priorityTypeSelect.length !== 0 &&
                        priorityTypeSelect.length
                      : value.screen == "ObservedBy"
                      ? ObservedByTypeSelect.length !== 0 &&
                        ObservedByTypeSelect.length
                      : null}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* right scren */}
        <View style={reduxColors.rightScreen}>
          <View>
            {screenName == "ObservationType" ? (
              <ObservationType
                constThemeColor={constThemeColor}
                setObservationTypeSelect={setObservationTypeSelect}
              />
            ) : screenName == "Priority" ? (
              <Priority
                constThemeColor={constThemeColor}
                setPriorityTypeSelect={setPriorityTypeSelect}
                setPriority={setPriority}
              />
            ) : screenName == "ObservedBy" ? (
              <ObservedBy
                constThemeColor={constThemeColor}
                reduxColors={reduxColors}
                setObservedByTypeSelect={setObservedByTypeSelect}
              />
            ) : null}
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          padding: Spacing.body,
          backgroundColor: constThemeColor.onPrimary,
          borderTopWidth: 1,
          borderTopColor: constThemeColor.outlineVariant,
        }}
      >
        <TouchableOpacity
          style={{
            paddingHorizontal: Spacing.minor,
            paddingVertical: Spacing.small,
            borderRadius: Spacing.small,
            backgroundColor: constThemeColor.primary,
            alignItems: "center",
          }}
          onPress={() => submitHanlder()}
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
  );
};

export default FilterScreen;

const ObservedBy = ({
  constThemeColor,
  reduxColors,
  setObservedByTypeSelect,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [searchModalText, setSearchModalText] = useState("");

  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  useEffect(() => {
    setIsLoading(true);
    let postData = {
      zoo_id: zooID,
      // page_no: page,
      // q: searchText,
    };
    searchUserListing(postData)
      .then((v) => {
        setUserData(v?.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setObservedByTypeSelect(selectedItems);
  }, [selectedItems]);
  useEffect(() => {
    setSelectedItems([]);
  }, []);

  const selectAction = (e) => {
    if (selectedItems?.includes(e)) {
      setSelectedItems((old) => {
        return old?.filter((v) => v !== e);
      });
    } else {
      setSelectedItems((old) => {
        return [...old, e];
      });
    }
  };

  const handleSearch = (text) => {};

  return (
    <>
      <Loader visible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            borderWidth: 1,
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: Spacing.small,
            borderColor: constThemeColor.outline,
            borderRadius: Spacing.small,
          }}
        >
          <TextInput
            style={[reduxColors.input]}
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
        {userData?.map((item, index) => (
          <TouchableOpacity
            style={{
              marginLeft: Spacing.small,
            }}
            accessible={true}
            key={index}
            onPress={() => selectAction(item)}
          >
            <View
              style={{
                marginTop: Spacing.small,
                borderRadius: Spacing.mini,
                padding: Spacing.small,
                backgroundColor: selectedItems.includes(item)
                  ? constThemeColor.onBackground
                  : constThemeColor.background,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <View
                  style={{
                    backgroundColor: constThemeColor.blackWithPointFour,
                    borderRadius: Spacing.major,
                    height: 30,
                    width: 30,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather
                    name="user"
                    size={24}
                    color={constThemeColor.onPrimary}
                  />
                </View>

                <View style={{ flex: 1, marginHorizontal: Spacing.small }}>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Subtext_title.fontSize,
                      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
                      color: constThemeColor.onPrimaryContainer,
                    }}
                  >
                    {item?.user_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                      color: constThemeColor.onSurfaceVariant,
                    }}
                  >
                    {ifEmptyValue(item?.designation)}
                  </Text>
                </View>
              </View>

              {selectedItems.includes(item) && (
                <Entypo
                  name="cross"
                  size={20}
                  color={constThemeColor.onSurfaceVariant}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

const Priority = ({ constThemeColor, setPriorityTypeSelect, setPriority }) => {
  const [selectedImage, setselectedImage] = useState([]);

  useEffect(() => {
    setPriorityTypeSelect(selectedImage);
  }, [selectedImage]);
  const priorityData = [
    {
      id: 1,
      low: low,
      lowColor: icon_priority_low_filled,
      name: "Low",
    },
    {
      id: 2,
      low: moderate,
      lowColor: icon_priority_medium_filled,
      name: "Moderate",
    },
    {
      id: 3,
      low: high,
      lowColor: icon_priority_high_filled,
      name: "High",
    },
    {
      id: 4,
      low: icon_priority_critical,
      lowColor: icon_priority_critical_filled,
      name: "Critical",
    },
  ];

  const isSelectedId = (id) => {
    return selectedImage.includes(id);
  };
  const onValueChacked = (id) => {
    if (isSelectedId(id)) {
      setselectedImage(selectedImage.filter((item) => item !== id));
      setPriority("");
    } else {
      // setselectedImage([...selectedImage, id]);
      setselectedImage([id]);
    }
  };

  return (
    <>
      {priorityData.map((item, index) => (
        <TouchableOpacity
          style={{ marginLeft: Spacing.small }}
          accessible={true}
          key={index}
          onPress={() => {
            setPriority(item?.name);
            onValueChacked(item?.id);
          }}
        >
          <View
            style={{
              marginTop: Spacing.small,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: Spacing.mini,
              backgroundColor: isSelectedId(item.id)
                ? constThemeColor.onBackground
                : constThemeColor.background,
            }}
          >
            <SvgXml xml={isSelectedId(item.id) ? item.lowColor : item.low} />
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                color: constThemeColor.onSurfaceVariant,
                padding: Spacing.small,
              }}
            >
              {item?.name}
            </Text>

            {isSelectedId(item.id) && (
              <Entypo
                name="cross"
                size={20}
                color={constThemeColor.onSurfaceVariant}
                style={{ marginLeft: 20 }}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

const ObservationType = ({ constThemeColor, setObservationTypeSelect }) => {
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [observationData, setObservationData] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    getObservationListforAdd()
      .then((v) => {
        const transformedData = v?.data?.map((item) => {
          return { id: item?.id, isSelect: false, name: item?.type_name };
        });
        setObservationData(transformedData);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log("error", e);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setObservationTypeSelect(selected);
  }, [selected]);

  useEffect(() => {
    setObservationTypeSelect([]);
    setSelected([]);
  }, []);

  const selectAction = (e) => {
    if (selected?.includes(e)) {
      setSelected((old) => {
        return old?.filter((v) => v !== e);
      });
    } else {
      setSelected((old) => {
        return [...old, e];
      });
    }
  };

  return (
    <>
      <Loader visible={isLoading} />
      <ScrollView>
        {observationData?.map((item, index) => (
          <TouchableOpacity
            style={{ marginLeft: Spacing.small }}
            accessible={true}
            key={index}
            onPress={() => selectAction(item)}
          >
            <View
              style={{
                marginTop: Spacing.small,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.Antz_Body_Regular.fontSize,
                  fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  color: constThemeColor.onSurfaceVariant,
                  padding: Spacing.small,
                  backgroundColor: selected.includes(item)
                    ? constThemeColor.onBackground
                    : constThemeColor.background,
                  borderRadius: Spacing.mini,
                }}
              >
                {item?.name}

                {selected.includes(item) && (
                  <Entypo
                    name="cross"
                    size={20}
                    color={constThemeColor.onSurfaceVariant}
                    style={{
                      marginLeft: Spacing.major,
                    }}
                  />
                )}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

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
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
  });
