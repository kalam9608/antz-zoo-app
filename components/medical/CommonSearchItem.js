import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
} from "react-native";
import { toggleAnimation } from "../medical/Accordion/toggleAnimation";
import { MaterialIcons } from "@expo/vector-icons";
import Spacing from "../../configs/Spacing";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import CheckBox from "../CheckBox";
// import data from "./data.json";
import { Divider } from "react-native-paper";
import Constants from "../../configs/Constants";

const CommonSearchItem = ({
  searchInput,
  data,
  preSelectedIds,
  selectedCheckedBox,
  routeName,
  selectAction,
  handleToggleCommModal,
  ...props
}) => {
  const animationController = useRef(new Animated.Value(0)).current;

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [listData, setListData] = useState([]);
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [show, setShow] = useState(
    searchInput && searchInput?.length >= 2 ? true : false
  );
  useEffect(() => {
    setListData(data ?? {});
  }, [JSON.stringify(data)]);
  useEffect(() => {}, [listData]);

  const toggleListItem = (item) => {
    setShow(false);
    const config = {
      duration: 300,
      toValue: openAccordionId == item.label ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimation);

    setOpenAccordionId(
      !show ? (openAccordionId == item?.label ? null : item?.label) : null
    );
  };

  const ArrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const RenderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: Spacing.body,
        }}
        onPress={() => {
          handleToggleCommModal(item);
        }}
        disabled={preSelectedIds?.includes(item?.id) ? true : false}
      >
        <Text
          style={[
            FontSize.Antz_Minor_Regular,
            { color: constThemeColor.onSecondaryContainer, width: "70%" },
          ]}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {item?.name}
        </Text>
        <CheckBox
          key={item?.id}
          activeOpacity={1}
          iconSize={24}
          disabled={preSelectedIds?.includes(item?.id) ? true : false}
          checked={selectedCheckedBox?.includes(item?.id)}
          checkedColor={constThemeColor.primary}
          uncheckedColor={constThemeColor.outline}
          labelStyle={[styles.labelName, styles.mb0]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {listData && (
        <>
          <View style={[styles.mainContainer]}>
            <View style={[styles.container]}>
              <TouchableOpacity
                onPress={() => toggleListItem(listData)}
                style={{
                  backgroundColor:
                    show || openAccordionId == listData?.label
                      ? constThemeColor?.surface
                      : constThemeColor?.onSecondary,
                }}
              >
                <View style={styles.titleContainer}>
                  <Text
                    style={[
                      FontSize.Antz_Minor_Title,
                      {
                        color:
                          show || openAccordionId == listData?.label
                            ? constThemeColor?.onSurfaceVariant
                            : constThemeColor?.neutralSecondary,
                      },
                      styles.title,
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {listData?.label}
                  </Text>
                  <Animated.View
                    style={{
                      // transform:
                      // show||openAccordionId == listData?.label
                      //     ? [{ rotateZ: ArrowTransform }]
                      //     : [],
                      marginRight: Spacing.mini,
                    }}
                  >
                    {show || openAccordionId == listData?.label ? (
                      <MaterialIcons
                        name="keyboard-arrow-up"
                        size={24}
                        color={constThemeColor?.editIconColor}
                      />
                    ) : (
                      <MaterialIcons
                        name="keyboard-arrow-down"
                        size={24}
                        color={constThemeColor?.editIconColor}
                      />
                    )}
                  </Animated.View>
                </View>
              </TouchableOpacity>
              <View>
                {show || openAccordionId === listData?.label ? (
                  <>
                    <Divider />
                    <View style={{ paddingVertical: Spacing.small }}>
                      {routeName === "complaint" &&
                        listData?.complaints?.map((item, index) => (
                          <RenderItem key={index} item={item} />
                        ))}
                      {routeName === "diagnosis" &&
                        listData?.diagnosis?.map((item, index) => (
                          <RenderItem key={index} item={item} />
                        ))}
                    </View>
                  </>
                ) : null}
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingVertical: Spacing.mini,
    },
    container: {
      borderRadius: Spacing.small,
      backgroundColor: reduxColors?.onSecondary,
      marginVertical: Spacing.mini,
      marginHorizontal: Spacing.minor,
      overflow: "hidden",
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: Spacing.minor,
      paddingHorizontal: Spacing.body,
    },
    title: {
      flex: 1,
      marginRight: Spacing.small,
    },
  });

export default CommonSearchItem;
