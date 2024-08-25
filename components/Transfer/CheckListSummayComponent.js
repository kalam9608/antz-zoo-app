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
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Spacing from "../../configs/Spacing";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import SvgUri from "react-native-svg-uri";

const CheckListSummayComponent = (props) => {
  const animationController = useRef(new Animated.Value(0)).current;

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [listData, setListData] = useState({});
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const openAccordionIddd = props?.item;
  useEffect(() => {
    setListData(props?.item ?? {});
    if (props.item?.active) {
      setOpenAccordionId(props.item?.key);
    }
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

  const RenderItem = React.memo(({ item }) => {
    const itemData = item;
    if (itemData?.type == "checkbox" && itemData?.value) {
      return (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: Spacing.body,
            paddingVertical: Spacing.mini,
          }}
        >
          <MaterialCommunityIcons
            name="check"
            size={20}
            color={constThemeColor.primary}
          />
          <Text
            style={[
              FontSize.Antz_Body_Regular,
              {
                color: constThemeColor.onSurfaceVariant,
                marginLeft: Spacing.mini,
              },
            ]}
            ellipsizeMode="tail"
            numberOfLines={3}
          >
            {item?.label}
          </Text>
        </View>
      );
    } else if (itemData?.type == "textbox" && Boolean(itemData?.value)) {
      return (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: Spacing.body,
            paddingVertical: Spacing.mini,
          }}
        >
          <MaterialCommunityIcons
            name="check"
            size={20}
            color={constThemeColor.primary}
          />
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                FontSize.Antz_Body_Regular,
                {
                  color: constThemeColor.outline,
                  marginLeft: Spacing.mini,
                },
              ]}
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {item?.label} -
            </Text>
            <Text
              style={[
                FontSize.Antz_Body_Regular,
                {
                  color: constThemeColor.onSurfaceVariant,
                  marginLeft: Spacing.mini,
                },
              ]}
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {item?.value}
            </Text>
          </View>
        </View>
      );
    } else if (
      itemData?.type == "multi_line_textbox" &&
      Boolean(itemData?.value)
    ) {
      return (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: Spacing.body,
            paddingVertical: Spacing.mini,
          }}
        >
          <MaterialCommunityIcons
            name="check"
            size={20}
            color={constThemeColor.primary}
          />
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                FontSize.Antz_Body_Regular,
                {
                  color: constThemeColor.outline,
                  marginLeft: Spacing.mini,
                },
              ]}
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {item?.label} -
            </Text>
            <Text
              style={[
                FontSize.Antz_Body_Regular,
                {
                  color: constThemeColor.onSurfaceVariant,
                  marginLeft: Spacing.mini,
                },
              ]}
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {item?.value}
            </Text>
          </View>
        </View>
      );
    }
  });

  return (
    <>
      {listData && listData.active && (
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
                          item?.active && (
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
                          )
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

export default CheckListSummayComponent;
