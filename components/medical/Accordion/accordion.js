import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  LayoutAnimation,
  FlatList,
} from "react-native";
import { toggleAnimation } from "./toggleAnimation";
import { MaterialIcons } from "@expo/vector-icons";
import Spacing from "../../../configs/Spacing";
import { useSelector } from "react-redux";
import FontSize from "../../../configs/FontSize";
import Switch from "../../../components/Switch";
import CheckBox from "../../CheckBox";
import InputBox from "../../InputBox";
import { TextInput } from "react-native-paper";

const Accordion = (props) => {
  const [showContent, setShowContent] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [listData, setListData] = useState();
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [fullTest, setFullTest] = useState(false);

  useEffect(() => {
    setListData(props.item ?? []);
  }, [JSON.stringify(props.item)]);

  const toggleListItem = (item) => {
    const config = {
      duration: 300,
      toValue: openAccordionId === item.test_id ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimation);

    setOpenAccordionId(openAccordionId === item.test_id ? null : item.test_id);
    setShowContent(openAccordionId !== item.test_id);
  };

  const ArrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  useEffect(() => {
    props.updatedData(listData);
  }, [listData]);

  const sampleSelectAll = (sample_id) => {
    setListData((prevListData) => {
      return {
        ...prevListData,
        active: prevListData.value ? false : true,
        value: !prevListData.value, // Toggle the value
        tests: prevListData.tests.map((parentTestObj) => {
          return {
            ...parentTestObj,
            full_test: !prevListData.value, // Set full_test to true for each parent test
            child_tests: parentTestObj.child_tests.map((childTestObj) => {
              return {
                ...childTestObj,
                value: !prevListData.value, // Toggle the value for each child test
              };
            }),
          };
        }),
      };
    });
  };

  const toggleButtonHandle = (isSelected, selectedParentTestObj) => {
    let isSampleActive = false;
    listData?.tests.some((parentTestObj) => {
      return parentTestObj.child_tests.some((childTestObj) => {
        if (childTestObj["value"] === true) {
          isSampleActive = true;
          return true;
        }
        return false;
      });
    });

    setListData({
      ...listData,
      active: isSelected || isSampleActive,
      tests: listData?.tests?.map((parentTestObj) => {
        return {
          ...parentTestObj,
          full_test:
            parentTestObj?.test_id == selectedParentTestObj?.test_id
              ? isSelected
              : parentTestObj?.full_test,
          child_tests: parentTestObj?.child_tests?.map((childTestObj) => {
            return {
              ...childTestObj,
              value:
                parentTestObj?.test_id == selectedParentTestObj?.test_id
                  ? isSelected
                  : childTestObj?.value,
            };
          }),
        };
      }),
    });

    setTimeout(() => {
      const isAnyFullTestFalse = listData?.tests.filter(
        (parentTestObj) => parentTestObj.full_test === false
      );
      setListData((prevListData) => ({
        ...prevListData,
        value: isAnyFullTestFalse ? false : true,
      }));
    }, 1000);
  };

  const handleCheckBox = (
    isSelected,
    selectedChildTestObj,
    selectedParentTestObj
  ) => {
    let isSampleActive = false;
    listData?.tests.some((parentTestObj) => {
      return parentTestObj.child_tests.some((childTestObj) => {
        if (
          childTestObj.test_id != selectedChildTestObj.test_id &&
          childTestObj["value"] === true
        ) {
          isSampleActive = true;
          return true;
        }
        return false;
      });
    });

    const isFullTestSelected = selectedParentTestObj?.child_tests.every(
      (childTestObj) =>
        childTestObj.test_id == selectedChildTestObj.test_id
          ? isSelected
          : childTestObj["value"]
    );

    setListData({
      ...listData,
      // active:
      //   isSelected ||
      //   listData?.tests
      //     .filter((a) => a.test_id == selectedParentTestObj.test_id)[0]
      //     .child_tests.filter(
      //       (b) => b?.test_id != selectedChildTestObj?.test_id && b.value == true
      //     ).length > 0
      //     ? true
      //     : false,
      active: isSelected || isSampleActive,
      tests: listData?.tests?.map((parentTestObj) => {
        return {
          ...parentTestObj,
          full_test:
            parentTestObj.test_id == selectedParentTestObj.test_id
              ? // isSelected &&
                //   listData?.tests
                //     .filter((a) => a?.test_id == selectedParentTestObj?.test_id)[0]
                //     .child_tests.filter(
                //       (b) => b.test_id != selectedChildTestObj.test_id && b.value == true
                //     ).length ==
                //     listData?.tests.filter(
                //       (a) => a?.test_id == selectedParentTestObj?.test_id
                //     )[0].child_tests.length -
                //       1
                //   ? true
                //   : false
                isFullTestSelected
              : parentTestObj.full_test,
          child_tests: parentTestObj?.child_tests?.map((childTestObj) => {
            return {
              ...childTestObj,
              value:
                childTestObj?.test_id == selectedChildTestObj?.test_id
                  ? isSelected
                  : childTestObj?.value,
            };
          }),
        };
      }),
    });
    setTimeout(() => {
      const isAnyFullTestFalse = listData?.tests.filter(
        (parentTestObj) => parentTestObj.full_test === false
      );
      setListData((prevListData) => ({
        ...prevListData,
        value: isAnyFullTestFalse ? false : true,
      }));
    }, 1000);
  };

  const handleInputBox = (e, selectedParentTestObj) => {
    let data = e.nativeEvent.text ? e.nativeEvent.text : "";
    setListData((prevListData) => {
      const updatedTests = prevListData.tests.map((parentTestObj) => {
        if (selectedParentTestObj.test_id === parentTestObj.test_id) {
          return {
            ...parentTestObj,
            full_test: data.length > 0, // Set to true if data is not empty
            input_value: data,
          };
        } else {
          return {
            ...parentTestObj,
          };
        }
      });

      const isActive = updatedTests?.some(
        (parentTestObj) =>
          parentTestObj.input_value?.length > 0 ||
          parentTestObj.child_tests?.some(
            (childTestObj) => childTestObj?.value === true
          )
      );

      return {
        ...prevListData,
        active: isActive,
        tests: updatedTests,
      };
    });
  };

  const RenderItem = React.memo(({ item, isOpen }) => {
    const itemData = item;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => toggleListItem(itemData)}
          disabled={itemData?.child_tests?.length == 0 ? true : false}
          accessible={true}
          accessibilityLabel={"containerLabTests"}
          AccessibilityId={"containerLabTests"}
        >
          <View style={styles.titleContainer}>
            <Text
              style={[FontSize.Antz_Minor_Title, styles.title]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {itemData?.test_name}
            </Text>
            {itemData?.child_tests?.length > 0 ? (
              <Animated.View
                style={{
                  transform:
                    isOpen && itemData?.child_tests?.length > 0
                      ? [{ rotateZ: ArrowTransform }]
                      : [],
                  marginRight: Spacing.mini,
                }}
              >
                <MaterialIcons
                  name="arrow-drop-down"
                  size={24}
                  color={constThemeColor?.onSurfaceVariant}
                />
              </Animated.View>
            ) : itemData?.child_tests?.length == 0 &&
              itemData?.input_type == "CheckBox" ? (
              <View>
                <CheckBox
                  accessible={true}
                  accessibilityLabel={"checkboxLabTests"}
                  AccessibilityId={"checkBoxLabTests"}
                  checked={itemData?.full_test}
                  onPress={() =>
                    toggleButtonHandle(!itemData?.full_test, itemData)
                  }
                />
              </View>
            ) : null}
          </View>
        </TouchableOpacity>

        <View
          style={
            isOpen && itemData?.child_tests?.length > 0
              ? styles.bodyContainer
              : null
          }
        >
          {isOpen && itemData?.child_tests?.length > 0 ? (
            <>
              <View
                style={[
                  styles.reviewSection,
                  // {
                  //   backgroundColor: constThemeColor?.background,
                  //   borderRadius: Spacing.mini,
                  // },
                ]}
              >
                <View>
                  <Text style={[FontSize.Antz_Minor_Regular, styles.reviewMsg]}>
                    Full Test
                  </Text>
                </View>
                <View style={{ marginRight: Spacing.small }}>
                  <Switch
                    accessible={true}
                    accessibilityLabel={"switchLabTests"}
                    AccessibilityId={"switchLabTests"}
                    active={itemData?.full_test}
                    handleToggle={(data) => toggleButtonHandle(data, itemData)}
                  />
                </View>
              </View>
              {itemData?.child_tests?.map((i) => {
                return (
                  <View>
                    {i?.input_type == "CheckBox" && (
                      <TouchableHighlight
                        activeOpacity={0.5}
                        onPress={() => handleCheckBox(!i?.value, i, itemData)}
                        underlayColor={constThemeColor?.background}
                        style={{
                          borderRadius: Spacing.mini,
                        }}
                      >
                        <View style={[styles.reviewSection]}>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={[
                                FontSize.Antz_Minor_Regular,
                                styles.reviewMsg,
                              ]}
                              numberOfLines={2}
                              ellipsizeMode="tail"
                            >
                              {i?.test_name}
                            </Text>
                          </View>
                          <View>
                            <CheckBox
                              checked={i?.value}
                              // onPress={() =>
                              //   handleCheckBox(!i?.value, i, itemData)
                              // }
                            />
                          </View>
                        </View>
                      </TouchableHighlight>
                    )}
                  </View>
                );
              })}
            </>
          ) : (
            <>
              {itemData?.child_tests?.length == 0 &&
                itemData?.input_type == "InputBox" && (
                  <View style={[styles.reviewSection, { paddingLeft: 0 }]}>
                    <View style={{ width: "100%" }}>
                      <TextInput
                        accessible={true}
                        accessibilityLabel={"othersLabTests"}
                        AccessibilityId={"othersLabTests"}
                        defaultValue={itemData.input_value}
                        onEndEditing={(event) =>
                          handleInputBox(event, itemData)
                        }
                        label={itemData.test_name}
                        mode="outlined"
                        placeholder="Enter Here..."
                        style={{ marginRight: Spacing.mini }}
                      />
                    </View>
                  </View>
                )}
            </>
          )}
        </View>
      </View>
    );
  });

  return (
    <>
      {listData?.tests && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[FontSize.Antz_Body_Title, styles.sectionName]}>
              {listData?.sample_name}
            </Text>
            {props?.sampleFullTestShow ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    FontSize.Antz_Body_Regular,
                    styles.reviewMsg,
                    { marginRight: Spacing.small },
                  ]}
                >
                  Select All
                </Text>
                <Switch
                  accessible={true}
                  accessibilityLabel={"switchLabTests"}
                  AccessibilityId={"switchLabTests"}
                  active={listData?.value}
                  activeSwitchWrapHeight={22}
                  activeSwitchWrapWidth={35}
                  switchWrapHeight={22}
                  switchWrapWidth={35}
                  activeInnerPointHeight={12}
                  activeInnerPointWidth={12}
                  innerPointHeight={12}
                  innerPointWidth={12}
                  handleToggle={() => sampleSelectAll(listData?.sample_id)}
                />
              </View>
            ) : (
              <></>
            )}
          </View>
          <FlatList
            data={listData?.tests}
            keyExtractor={(_, index) => index?.toString()}
            renderItem={({ item }) => {
              const isOpen = openAccordionId === item?.test_id;
              return (
                <RenderItem item={item} isOpen={isOpen} fullTest={fullTest} />
              );
            }}
          />
        </>
      )}
    </>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    sectionName: {
      color: reduxColors?.onSurfaceVariant,
      marginVertical: Spacing.small,
    },
    container: {
      paddingVertical: Spacing.body,
      paddingLeft: Spacing.body,
      paddingRight: Spacing.small,
      borderRadius: Spacing.small,
      backgroundColor: reduxColors?.onPrimary,
      marginVertical: Spacing.mini,
      overflow: "hidden",
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      flex: 1,
      color: reduxColors?.onSurfaceVariant,
      marginRight: Spacing.small,
    },
    bodyContainer: {
      marginTop: Spacing.small,
    },
    reviewSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: Spacing.body,
      paddingVertical: Spacing.small,
    },
    reviewMsg: { color: reduxColors?.onSurfaceVariant },
  });

export default Accordion;
