import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  FlatList,
} from "react-native";
import { toggleAnimation } from "../medical/Accordion/toggleAnimation";
import { MaterialIcons } from "@expo/vector-icons";
import Spacing from "../../configs/Spacing";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import CheckBox from "../CheckBox";
import { TextInput } from "react-native-paper";
import SvgUri from "react-native-svg-uri";

const CheckListSelectComponent = (props) => {
  const animationController = useRef(new Animated.Value(0)).current;

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [listData, setListData] = useState({});
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const listDataRef = useRef(props?.item ?? {});

  useEffect(() => {
    setListData(props?.item ?? {});
  }, [JSON.stringify(props.item)]);

  const toggleListItem = (item) => {
    const config = {
      duration: 300,
      toValue: openAccordionId === item.key ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimation);

    setOpenAccordionId(openAccordionId === item.key ? null : item.key);
  };

  const ArrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handleCheckBox = (itemData) => {
    const updatedListData = { ...listDataRef.current };

    const updateCategory = (category) => {
      let hasActiveItem = false;

      if (category.sub_category) {
        category.sub_category.forEach((subCategory) => {
          let subCategoryActive = false;

          if (subCategory.items) {
            subCategory.items.forEach((item) => {
              if (item.key === itemData.key) {
                item.value = !item.value;
              }
              subCategoryActive = subCategoryActive || Boolean(item.value);
            });
          }

          subCategory.active = subCategoryActive;
          hasActiveItem = hasActiveItem || subCategoryActive;
        });
      } else if (category.items) {
        category.items.forEach((item) => {
          if (item.key === itemData.key) {
            item.value = !item.value;
          }
          hasActiveItem = hasActiveItem || Boolean(item.value);
        });
      }

      category.active = hasActiveItem;
    };

    if (updatedListData.sub_category) {
      updateCategory(updatedListData);
    } else if (updatedListData.items) {
      updateCategory(updatedListData);
    }

    setListData(updatedListData);
    // props.updatedData(updatedListData);

    listDataRef.current = updatedListData;
    props.handleCheckBoxUpdatedData(updatedListData);
  };
  const updateCategory = (category, selectedItem, newData) => {
    const updatedCategory = { ...category };

    if (updatedCategory.sub_category) {
      updatedCategory.sub_category = updatedCategory.sub_category.map(
        (subCategory) => {
          const updatedSubCategory = { ...subCategory };
          if (updatedSubCategory.items) {
            updatedSubCategory.items = updatedSubCategory.items.map((item) => {
              if (item.key === selectedItem.key) {
                return { ...item, value: newData };
              }
              return item;
            });
          }
          updatedSubCategory.active = updatedSubCategory.items.some((item) =>
            Boolean(item.value)
          );
          return updatedSubCategory;
        }
      );
    } else if (updatedCategory.items) {
      updatedCategory.items = updatedCategory.items.map((item) => {
        if (item.key === selectedItem.key) {
          return { ...item, value: newData };
        }
        return item;
      });
      updatedCategory.active = updatedCategory.items.some((item) =>
        Boolean(item.value)
      );
    }

    return updatedCategory;
  };
  const handleInputBox = (event, selectedItem) => {
    const updatedListData = { ...listDataRef.current };
    let data = event.nativeEvent.text ? event.nativeEvent.text : "";

    const updatedData = updateCategory(updatedListData, selectedItem, data);

    listDataRef.current = updatedData;
    props.updatedData(updatedData);
  };
  // const handleInputBox = (event, selectedItem) => {
  //   const updatedListData = { ...listDataRef.current };
  //   let data = event.nativeEvent.text ? event.nativeEvent.text : "";
  //   const updateCategory = (category) => {
  //     let hasActiveItem = false;

  //     if (category.sub_category) {
  //       category.sub_category.forEach((subCategory) => {
  //         let subCategoryActive = false;

  //         if (subCategory.items) {
  //           subCategory.items.forEach((item) => {
  //             if (item.key === selectedItem.key) {
  //               item.value = data;
  //             }
  //             subCategoryActive = subCategoryActive || Boolean(item.value);
  //           });
  //         }

  //         subCategory.active = subCategoryActive;
  //         hasActiveItem = hasActiveItem || subCategoryActive;
  //       });
  //     } else if (category.items) {
  //       category.items.forEach((item) => {
  //         if (item.key === selectedItem.key) {
  //           item.value = data;
  //         }
  //         hasActiveItem = hasActiveItem || Boolean(item.value);
  //       });
  //     }

  //     category.active = hasActiveItem;
  //   };

  //   if (updatedListData.sub_category) {
  //     updateCategory(updatedListData);
  //   } else if (updatedListData.items) {
  //     updateCategory(updatedListData);
  //   }

  //   // setListData(updatedListData);

  //   //  Make a new variable to avoid the FlatList update unnecessary
  //   listDataRef.current = updatedListData;
  //   props.updatedData(updatedListData);
  // };

  const RenderItem = React.memo(({ item }) => {
    const itemData = item;
    if (itemData?.type == "checkbox") {
      return (
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: Spacing.body,
          }}
        >
          <Text
            style={[
              FontSize.Antz_Minor_Regular,
              { color: constThemeColor.onSecondaryContainer },
            ]}
          >
            {item?.label}
          </Text>
          <CheckBox
            accessible={true}
            accessibilityLabel={"checkboxTransferChecklist"}
            AccessibilityId={"checkboxTransferChecklist"}
            checked={itemData?.value}
            onPress={() => handleCheckBox(itemData)}
            disabled={props?.edit ? false : true}
          />
        </View>
      );
    } else if (itemData?.type == "textbox") {
      return (
        <View
          style={{
            paddingHorizontal: Spacing.body,
            marginVertical: Spacing.mini,
          }}
        >
          <TextInput
            accessible={true}
            accessibilityLabel={"textboxCheckList"}
            AccessibilityId={"textboxCheckList"}
            defaultValue={item?.value}
            onEndEditing={(event) => handleInputBox(event, item)}
            label={item?.label}
            mode="outlined"
            placeholder={"Enter " + item?.label}
            style={{ marginRight: Spacing.mini }}
            disabled={props?.edit ? false : true}
          />
        </View>
      );
    } else if (itemData?.type == "multi_line_textbox") {
      return (
        <View
          style={{
            paddingHorizontal: Spacing.body,
            marginVertical: Spacing.small,
          }}
        >
          <TextInput
            keyboardType={"default"}
            mode="outlined"
            defaultValue={item?.value}
            label={item?.label}
            multiline={true}
            scrollEnabled={false} /// AF - 1562 ( in IOS if multiline is true KeyboardAvoidView doesn't work well with the last element that's why it is false)
            placeholder={"Enter " + item?.label}
            onEndEditing={(event) => handleInputBox(event, item)}
            disabled={props?.edit ? false : true}
          />
        </View>
      );
    }
  });

  return (
    <>
      {listData && (
        <>
          <View style={[styles.container]}>
            <TouchableOpacity
              onPress={() => toggleListItem(listData)}
              accessible={true}
              accessibilityLabel={"containerLabTests"}
              AccessibilityId={"containerLabTests"}
              style={{ backgroundColor: constThemeColor?.onSecondaryContainer }}
            >
              <View style={styles.titleContainer}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 55,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: Spacing.body,
                  }}
                >
                  <SvgUri
                    source={{
                      uri: listData?.icon,
                    }}
                    width="20"
                    height="20"
                  />
                </View>
                <Text
                  style={[FontSize.Antz_Body_Title, styles.title]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {listData?.label}
                </Text>
                <Animated.View
                  style={{
                    transform:
                      openAccordionId == listData?.key
                        ? [{ rotateZ: ArrowTransform }]
                        : [],
                    marginRight: Spacing.mini,
                  }}
                >
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color={constThemeColor?.onPrimary}
                  />
                </Animated.View>
              </View>
            </TouchableOpacity>
            <View>
              {openAccordionId === listData?.key ? (
                <View style={{ paddingBottom: Spacing.small }}>
                  {listData?.sub_category &&
                  listData?.sub_category.length > 0 ? (
                    <FlatList
                      data={listData?.sub_category}
                      keyExtractor={(_, index) => index?.toString()}
                      renderItem={({ item }) => {
                        return (
                          <>
                            <View style={[styles.reviewSection]}>
                              <Text
                                style={[
                                  FontSize.Antz_Body_Regular,
                                  styles.reviewMsg,
                                ]}
                              >
                                {item.label}
                              </Text>
                            </View>
                            <FlatList
                              data={item?.items}
                              keyExtractor={(_, index) => index?.toString()}
                              renderItem={({ item }) => {
                                return <RenderItem item={item} />;
                              }}
                            />
                          </>
                        );
                      }}
                    />
                  ) : (
                    <>
                      {listData?.items && listData?.items?.length > 0 ? (
                        <FlatList
                          data={listData?.items}
                          keyExtractor={(_, index) => index?.toString()}
                          renderItem={({ item }) => {
                            return <RenderItem item={item} />;
                          }}
                        />
                      ) : null}
                    </>
                  )}
                </View>
              ) : null}
            </View>
          </View>
        </>
      )}
    </>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      borderRadius: Spacing.small,
      backgroundColor: reduxColors?.onPrimary,
      marginVertical: Spacing.mini,
      overflow: "hidden",
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: Spacing.minor,
      paddingLeft: Spacing.body,
      paddingRight: Spacing.small,
    },
    title: {
      flex: 1,
      color: reduxColors?.onPrimary,
      marginRight: Spacing.small,
    },
    reviewSection: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: reduxColors?.outlineVariant,
      marginBottom: Spacing.small,
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.small,
    },
    reviewMsg: { color: reduxColors?.neutralPrimary },
  });

export default CheckListSelectComponent;
