//create by :gaurav shukla
//Date:5-05-2023

import React, {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { ImageSlider } from "react-native-image-slider-banner";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Menu } from "react-native-paper";
import { useEffect, useState } from "react";
import { opacityColor } from "../utils/Utils";

const SliderComponent = (props) => {
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const reduxColors = styles(constThemeColor);
  const gotoBack = () => navigation.goBack();
  const navigation = useNavigation();
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const [moreOptionVisible, setMoreOptionVisible] = useState(false);
  const openMoreOption = () => setMoreOptionVisible(true);
  const closeMoreOption = () => setMoreOptionVisible(false);
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

  const onChange = () => {
    setScreenData(Dimensions.get("window"));
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => Dimensions.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      {/* {props?.linearGradient && (
        <View style={customStyles.overlay}>
          <LinearGradient
            colors={props?.GradientColors ?? ["red", "blue", "yellow", "green"]}
            locations={[0, 0.25, 0.5, 0.75]}
            style={{ flex: 1 }}
          ></LinearGradient>
        </View>
      )} */}
      <ImageSlider
        data={props.imageData}
        autoPlay={props.autoPlay ?? false}
        showHeader
        preview={true}
        timer={5000}
        headerLeftComponent={
          !props.noNavigation && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={gotoBack}
              style={{
                width: 35,
                height: 35,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={
                  props?.header
                    ? themeColors.neutralPrimary
                    : themeColors.onPrimary
                }
              />
            </TouchableOpacity>
          )
        }
        headerCenterComponent={
          props.title ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{}}>
                {props?.preTitle ? (
                  <Text
                    style={{
                      color: constThemeColor.onPrimary,
                      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                      fontSize: FontSize.Antz_Body_Medium.fontSize,
                      paddingBottom: Spacing.micro,
                      alignSelf: "center",
                    }}
                  >
                    {props?.preTitle}
                  </Text>
                ) : null}
                <Text
                  style={{
                    color: constThemeColor.onPrimary,
                    fontWeight: FontSize.Antz_Major_Title.fontWeight,
                    fontSize: FontSize.Antz_Major_Title.fontSize,
                    paddingBottom: Spacing.micro,
                    // marginTop: Spacing.mini,
                  }}
                >
                  {props.title}
                </Text>
              </View>
              {props.infoIcon ? (
                <View style={{ alignSelf: "center" }}>
                  <View
                    style={{
                      backgroundColor: constThemeColor.neutralPrimary,
                      height: 32,
                      width: 32,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 100,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="information-variant"
                      size={24}
                      color="white"
                    />
                  </View>
                </View>
              ) : null}
            </View>
          ) : (
            <View
              style={{
                top: props?.isGroup && props?.isGroup == true ? 35 : 42,
                justifyContent: "flex-start",
                width: "98%",
              }}
            >
              {props.child}
            </View>
          )
        }
        headerRightComponent={
          !props.noNavigation &&
          !props.hideMenu && (
            <Menu
              visible={moreOptionVisible}
              onDismiss={closeMoreOption}
              style={{
                marginTop: 15,
              }}
              anchor={
                <TouchableOpacity
                  onPress={openMoreOption}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    color={
                      props?.header
                        ? themeColors.neutralPrimary
                        : themeColors.onPrimary
                    }
                    size={30}
                  />
                </TouchableOpacity>
              }
              statusBarHeight={15}
            >
              {props?.optionData?.map((item, index) => {
                return (
                  <Menu.Item
                    onPress={() => {
                      setMoreOptionVisible(false);
                      props.optionPress(item);
                    }}
                    title={item.option}
                    key={index}
                  />
                );
              })}
            </Menu>
          )
        }
        showIndicator={
          props?.animalDetailsOnly == true &&
          props?.imageData?.length > 1 &&
          props?.showIndicator == true
            ? true
            : props?.showIndicator == true || props?.imageData?.length == 1
            ? false
            : true
        }
        headerStyle={{
          padding: 10,
          position: "absolute",
          zIndex: 1,
        }}
        caroselImageStyle={{
          width: screenData?.width,
          resizeMode: "cover",
          opacity: 0.6,
          backgroundColor: opacityColor(constThemeColor.neutralPrimary, 100),
        }}
        indicatorContainerStyle={[
          { position: "absolute", bottom: -17 },
          props.indicatorContainerStyle,
        ]}
        activeIndicatorStyle={{
          backgroundColor: constThemeColor.primaryContainer,
          height: 5,
          width: 5,
        }}
        inActiveIndicatorStyle={{
          height: 5,
          width: 5,
          backgroundColor: opacityColor(constThemeColor.onPrimary, 60),
        }}
      ></ImageSlider>
      {props?.subtitle ? (
        <View
          style={{
            minWidth: 50,
            borderRadius: Spacing.mini,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            top: 240,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
          }}
        >
          <Text
            style={{
              color: constThemeColor.onPrimary,
              fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
              fontSize: FontSize.Antz_Subtext_Regular.fontSize,
              fontStyle: "italic",
              paddingHorizontal: Spacing.small,
              paddingVertical: Spacing.small,
            }}
          >
            {props?.subtitle}
          </Text>
        </View>
      ) : null}
    </>
  );
};

export default SliderComponent;
const pageStyles = (themeColors) =>
  StyleSheet.create({
    // overlay: {
    //   ...StyleSheet.absoluteFill,
    //   // backgroundColor: themeColors.neutralPrimary,
    //   zIndex: 1,
    //   opacity: 0.3,
    //   marginTop:40,
    // },
    container: {
      flex: 1,
    },
    images: {
      height: "110%",
    },
    inChargeBox: {
      flexDirection: "row",
      marginTop: 5,
    },
    firstTextStyle: {
      ...FontSize.Antz_Body_Title,
      color: themeColors.onPrimary,
      textAlign: "left",
    },
    secondItemBox: {
      flexDirection: "row",
      marginTop: 5,
      marginBottom: Spacing.body + Spacing.micro,
    },

    bodyContainer: {
      position: "relative",
      bottom: 0,
      flex: 1,
      backgroundColor: themeColors.onPrimary,
      borderRadius: 20,
    },

    linearGradient: {
      width: "100%",
      height: "100%",
    },

    scientificName: {
      color: themeColors.onPrimary,
      fontStyle: "italic",
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      marginVertical: 2,
    },

    sexAndAge: {
      flexDirection: "row",
      marginVertical: 2,
    },

    sex: {
      color: themeColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    fourthRow: {
      width: "70%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 2,
    },

    age: {
      color: themeColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    enclosureAndRingId: {
      flexDirection: "row",
      marginVertical: 2,
    },

    enclosure: {
      color: themeColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    ringId: {
      color: themeColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    tagAndHash: {
      flexDirection: "row",
      marginVertical: 8,
    },

    // Body Container

    card: {
      marginHorizontal: Spacing.minor,
      marginBottom: "2%",
      backgroundColor: themeColors.onPrimary,

      // backgroundColor:'red'
    },

    cardContentRow: {
      flexDirection: "row",
      marginHorizontal: "2%",
      marginVertical: "2%",
    },
    qrCard: {
      marginHorizontal: "4%",
      marginVertical: "2%",
      backgroundColor: themeColors.onPrimary,
    },

    qrCardContentRow: {
      alignItems: "center",
      justifyContent: "center",
    },

    cardContentItem: {
      flex: 0.5,
    },

    cardContentTitle: {
      color: themeColors.gray,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    cardContentData: {
      color: themeColors.neutralPrimary,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },

    // Utilities
    markNode: {
      borderColor: themeColors?.red,
      borderWidth: 1,
    },
    tagMainCont: {
      marginLeft: 3,
    },
    tagsContainer: {
      flexDirection: "row",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginHorizontal: 5,
      fontWeight: FontSize.weight500,
    },

    malechipM: {
      backgroundColor: themeColors?.surfaceVariant,

      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      marginHorizontal: 5,
      fontWeight: FontSize.weight700,
    },
    femalechipF: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: themeColors?.secondary,
      fontWeight: FontSize.weight500,
      marginLeft: 5,
      borderWidth: 2,
    },
    malechipText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      color: themeColors?.onPrimaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      color: themeColors?.onPrimaryContainer,
    },

    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: themeColors?.red,
      fontWeight: FontSize.weight500,
      marginLeft: 5,
    },
    undeterminedText: {
      marginLeft: 5,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      backgroundColor: themeColors?.errorContainer,
      color: themeColors?.onPrimary,
    },
    indeterminedText: {
      marginLeft: 5,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      backgroundColor: themeColors?.indertermineChip,
      color: themeColors?.onPrimary,
    },
    chipWrap: {
      marginTop: 8,
    },
    chip: {
      height: heightPercentageToDP(3),
      backgroundColor: themeColors.primaryContainer,
      width: widthPercentageToDP(18),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
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
    tabIcon: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      marginHorizontal: 4,
      // top: 4,
    },
    tabHeaderWrapper: {
      borderBottomColor: themeColors.surfaceVariant,
      borderBottomWidth: 1,
      backgroundColor: themeColors.onPrimary,
    },
    tabBody: {
      flex: 1,
    },
    attachBox: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginBottom: 3,
      marginTop: 3,
      backgroundColor: themeColors.surface,
    },
    enclosureTitleText: {
      fontSize: FontSize.Antz_Small,
      fontWeight: "500",
      color: themeColors.onError,
      letterSpacing: 3.6,
    },
    showSubenclosuresContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.body,
      backgroundColor: themeColors.onPrimary,
      borderRadius: Spacing.small,
      paddingVertical: Spacing.minor,
      marginBottom: Spacing.small,
      borderWidth: 1,
      borderColor: themeColors.outlineVariant,
    },
    showSubenclosuresText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: themeColors.onSurfaceVariant,
      flex: 1,
    },
    subEnclosuresContainer: {
      paddingHorizontal: Spacing.minor,
      paddingBottom: Spacing.small,
      backgroundColor: themeColors?.surfaceVariant,
    },
    occupantsListContainer: {
      paddingLeft: Spacing.minor,
      paddingRight: Spacing.minor,
      backgroundColor: themeColors?.surfaceVariant,
      paddingBottom: Spacing.small,
    },
    headerMainContainer: {
      padding: Spacing.minor,
      borderRadius: Spacing.small,
      backgroundColor: themeColors.onError,
      marginBottom: Spacing.small,
    },
    includeSubenclosuresContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: Spacing.body,
      backgroundColor: themeColors.onPrimary,
      borderWidth: 1,
      borderRadius: Spacing.small,
      borderColor: themeColors.outlineVariant,
    },
    includeSubenclosuresText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: themeColors.onSurfaceVariant,
      flex: 1,
    },
    headerCountContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColors.background,
      padding: Spacing.body,
      borderRadius: Spacing.small,
    },
    headerCountTitleText: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: themeColors.onSurfaceVariant,
      flex: 1,
    },
    headerCountValueText: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: themeColors.onSurfaceVariant,
    },
    siteTitleText: {
      fontSize: FontSize.Antz_Small,
      fontWeight: "500",
      color: themeColors.onError,
      letterSpacing: 3.6,
    },
    deadContainer: {
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginHorizontal: 1.2,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
