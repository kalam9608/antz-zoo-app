// {
// show_housing_details={true} if you want to hide housing details do false
// show_specie_details={true}  if you want to hide specie details do false
// animalIdentifier = if local identifier and id null then show animalId
// animalName = pass animal name
// chips = show sex
//  enclosureName, = emclosure name pass as a props
//sectionName, = section name pass as a props
// count, show count in right side
// rightIcon, show right arroe icon in right align
// icon = you can pass svg or jpeg as a props
// }

/**
 * @React Imports
 */
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  AntDesign,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
/**
 * @Redux Imports
 */
import { useSelector } from "react-redux";

/**
 * @Component Imports
 */
import ImageComponent from "./ImageComponent";

/**
 * @Third Party Imports
 */
import { widthPercentageToDP } from "react-native-responsive-screen";

/**
 * @Config Imports
 */
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import BottomSheetModalStyles from "../configs/BottomSheetModalStyles";
/**
 * @Utils Imports
 */
import {
  calculateAge,
  capitalize,
  formatTimeAgo,
  opacityColor,
  shortenNumber,
} from "../utils/Utils";
import Switch from "./Switch";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAsyncData } from "../utils/AsyncStorageHelper";

const AnimalCustomCard = ({
  item,
  discoveredDate,
  date,
  onPress,
  icon,
  animalName,
  animalIdentifier,
  chips,
  cardID,
  enclosureName,
  sectionName,
  siteName,
  reasonName,
  count,
  rightIcon,
  disable,
  show_mortality_details,
  show_housing_details,
  show_specie_details,
  svgUri,
  age,
  extra,
  noArrow,
  localID,
  checkbox,
  checked,
  onRemove,
  weight,
  screenType,
  switchStatus,
  toggleSwitch,
  from,
  movedon,
  isSecurityCheckin,
  scientific_name,
  institutioName,
  activeOpacity,
  ...props
}) => {
  const [isHideStats, setIsHideStats] = useState(null);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet = BottomSheetModalStyles.ShodowOpacity(constThemeColor);

  useEffect(() => {
    getHideStatsValue();
  }, [item]);

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };

  //this is for mortality death date
  const deathDate = formatTimeAgo(discoveredDate);
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity ?? 0.3}
      disabled={disable ? disable : !onPress}
      onPress={onPress}
    >
      <View
        style={[
          reduxColors.cardContainer,
          props?.style,
          {
            cardID,
            // elevation: stylesSheet.elevationShadow.elevation,
            // shadowColor: stylesSheet.elevationShadow.shadowColor,
          },
        ]}
      >
        {/* {props?.type == "group" ? (
          <View
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              backgroundColor: "transparent",
              borderStyle: "solid",
              borderRightWidth: 40,
              borderTopWidth: 40,
              borderRightColor: "transparent",
              borderTopColor: constThemeColor?.background,
            }}
          >
            <Text
              style={[FontSize.Antz_Strong, { color: constThemeColor?.error, position:'absolute', top:-40, left: 5 }]}
            >
              G
            </Text>
          </View>
        ) : null} */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}
        >
          <View style={{ marginRight: Spacing.body, alignSelf: "center" }}>
            <ImageComponent icon={icon} />
            {item?.type == "group" || item?.group == "group" ? (
              <View>
                <View>
                  <View
                    style={[reduxColors.tagsContainer]}
                    onStartShouldSetResponder={() => true}
                  >
                    <View style={reduxColors.groupChip}>
                      <Text style={reduxColors.groupText}>G</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <>
                {chips ? (
                  <View>
                    <View>
                      <View
                        style={reduxColors.tagsContainer}
                        onStartShouldSetResponder={() => true}
                      >
                        <View
                          style={
                            chips == "male"
                              ? reduxColors.malechip
                              : chips == "female"
                              ? reduxColors.femalechip
                              : chips == "undetermined"
                              ? reduxColors.undeterminedChip
                              : chips == "indeterminate"
                              ? reduxColors.indeterminedChip
                              : {}
                          }
                        >
                          <Text
                            style={
                              chips == "male"
                                ? reduxColors.malechipText
                                : chips == "female"
                                ? reduxColors.femalechipText
                                : chips == "undetermined"
                                ? reduxColors.undeterminedText
                                : chips == "indeterminate"
                                ? reduxColors.indeterminedText
                                : {}
                            }
                          >
                            {chips == "male"
                              ? `M`
                              : chips == "female"
                              ? `F`
                              : chips == "undetermined"
                              ? `UD`
                              : chips == "indeterminate"
                              ? `ID`
                              : null}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : null}
              </>
            )}
          </View>

          <View style={{ flex: 1, justifyContent: "center" }}>
            <View>
              {date ? (
                <View>
                  <Text
                    style={{
                      color: constThemeColor.onSurfaceVariant,
                      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                    }}
                  >
                    {date}
                  </Text>
                </View>
              ) : null}

              {show_mortality_details ? (
                <View>
                  {discoveredDate ? (
                    <Text
                      style={{
                        color: constThemeColor.tertiary,
                        fontSize: FontSize.Antz_Body_Medium.fontSize,
                        fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        marginBottom: Spacing.mini,
                      }}
                    >
                      {deathDate}
                    </Text>
                  ) : null}
                  {reasonName ? (
                    <Text
                      style={[
                        reduxColors.title,
                        {
                          marginBottom: Spacing.mini,
                          color: constThemeColor.onSurfaceVariant,
                        },
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      Reason: {capitalize(reasonName)}
                    </Text>
                  ) : null}
                </View>
              ) : null}

              {screenType == "Medical" ? (
                <>
                  {show_specie_details ? (
                    <View>
                      {animalName ? (
                        <Text
                          style={[
                            reduxColors.title,
                            {
                              // marginBottom: Spacing.mini,
                              color: constThemeColor.onSurfaceVariant,
                            },
                          ]}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {capitalize(animalName)}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </>
              ) : (
                <View
                  style={{ flexDirection: "row" }}
                >
                  {animalIdentifier ? (
                    <Text numberOfLines={2} ellipsizeMode="tail">
                      <Text
                        style={[
                          reduxColors.title,
                          {
                            color: constThemeColor.onSurfaceVariant,
                            // marginBottom: Spacing.micro,
                          },
                        ]}
                      >
                        {animalIdentifier}
                      </Text>
                      {localID ? (
                        <Text
                          style={[
                            reduxColors.title,
                            {
                              color: constThemeColor.onSurfaceVariant,
                              // marginBottom: Spacing.micro,
                            },
                          ]}
                        >
                          : {localID}
                        </Text>
                      ) : null}
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
            {screenType == "Medical" ? (
              <>
                <View
                  style={{ flexDirection: "row"}}
                >
                  {animalIdentifier ? (
                    <Text numberOfLines={2} ellipsizeMode="tail">
                      <Text
                        style={[
                          reduxColors.subtitleMedium,
                          {
                            // color: constThemeColor.onSurfaceVariant,
                            marginBottom: Spacing.micro,
                          },
                        ]}
                      >
                        {animalIdentifier}
                      </Text>
                      {localID ? (
                        <Text
                          style={[
                            reduxColors.subtitleMedium,
                            {
                              // color: constThemeColor.onSurfaceVariant,
                              marginBottom: Spacing.micro,
                            },
                          ]}
                        >
                          : {localID}
                        </Text>
                      ) : null}
                    </Text>
                  ) : null}
                </View>
              </>
            ) : (
              <>
                {show_specie_details ? (
                  <>
                    <View>
                      {animalName ? (
                        <Text
                          style={[
                            reduxColors.subtitleMedium,
                            // { marginBottom: Spacing.mini },
                          ]}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {capitalize(animalName)}
                        </Text>
                      ) : null}
                    </View>
                    {/* <View style={{ marginBottom: Spacing.mini }}> */}
                      {scientific_name ? (
                        <Text
                          style={{ fontSize: 12 }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          ({capitalize(scientific_name)})
                        </Text>
                      ) : null}
                    {/* </View> */}
                  </>
                ) : null}
              </>
            )}
            {(!isHideStats && item?.type == "group") ||
            item?.group == "group" ? (
              <View
                style={{
                  // backgroundColor: constThemeColor.background,
                  backgroundColor: opacityColor(
                    constThemeColor?.onPrimaryContainer,
                    10
                  ),
                  width: "45%",
                  borderRadius: Spacing.mini,
                  padding: Spacing.mini,
                  marginVertical: Spacing.mini,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    // color: constThemeColor.onPrimaryContainer,
                    color: constThemeColor.onTertiaryContainer,
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  }}
                >
                  Count{" "}
                </Text>
                <Text
                  style={{
                    // color: constThemeColor.onPrimaryContainer,
                    color: constThemeColor.onTertiaryContainer,
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Title.fontWeight,
                  }}
                >
                  {item.total_animal}
                </Text>
              </View>
            ) : null}
            {show_housing_details ? (
              <View>
                {enclosureName ? (
                  <Text
                    style={[
                      !animalName
                        ? reduxColors.subtitleMedium
                        : reduxColors.subtitle,
                        {
                          marginBottom: 0,
                        },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    Encl: <Text>{capitalize(enclosureName)}</Text>
                  </Text>
                ) : null}
                {sectionName ? (
                  <Text
                    style={[
                      !animalName
                        ? reduxColors.subtitleMedium
                        : reduxColors.subtitle,
                      {
                        marginBottom: 0,
                      },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    Sec:{" "}
                    <Text style={{ textTransform: "capitalize" }}>
                      {capitalize(sectionName)}
                    </Text>
                  </Text>
                ) : null}

                {siteName ? (
                  <Text
                    style={[
                      !animalName
                        ? reduxColors.subtitleMedium
                        : reduxColors.subtitle,
                      {
                        marginBottom: 0,
                      },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    Site:{" "}
                    <Text style={{ textTransform: "capitalize" }}>
                      {capitalize(siteName)}
                    </Text>
                  </Text>
                ) : null}
                {institutioName ? (
                  <Text
                    style={[
                      !animalName
                        ? reduxColors.subtitleMedium
                        : reduxColors.subtitle,
                      {
                        marginBottom: 0,
                      },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    Institution: {capitalize(institutioName)}
                  </Text>
                ) : null}
                {from ? (
                  <Text
                    style={[
                      !animalName
                        ? reduxColors.subtitleMedium
                        : reduxColors.subtitle,
                      {
                        marginBottom: 0,
                      },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    From: {capitalize(from)}
                  </Text>
                ) : null}
                {movedon ? (
                  <Text
                    style={[
                      !animalName
                        ? reduxColors.subtitleMedium
                        : reduxColors.subtitle,
                      {
                        marginBottom: 0,
                      },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    Moved on:{" "}
                    {moment(movedon, "YYYY-MM-DD HH:MM:ss").format("DD MMM")} •{" "}
                    {moment(movedon, "YYYY-MM-DD HH:MM:ss").format("LT")}
                  </Text>
                ) : null}
              </View>
            ) : null}
            {extra ? (
              <>
                {age ? (
                  <View>
                    <Text
                      style={[
                        reduxColors.subtitle,
                        {
                          marginTop: props?.transfered_animals
                            ? Spacing.mini
                            : 0,
                        },
                      ]}
                    >
                      {props?.transfered_animals && "Date: "}
                      {age}
                    </Text>
                  </View>
                ) : null}
                {weight ? (
                  <View>
                    <Text style={[reduxColors.subtitle]}>{weight}</Text>
                  </View>
                ) : null}
              </>
            ) : null}
          </View>
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              marginLeft: Spacing.body,
            }}
          >
            {count ? (
              <View
                style={[
                  reduxColors.rightSection,
                  {
                    alignItems: "flex-end",
                  },
                ]}
              >
                <Text style={reduxColors.count}>{shortenNumber(count)}</Text>
              </View>
            ) : !noArrow ? (
              <View style={[reduxColors.rightSection]}>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
              </View>
            ) : noArrow && checkbox && !props?.showInTransit ? (
              <View style={[reduxColors.rightSection]}>
                <MaterialCommunityIcons
                  name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={24}
                  color={
                    disable
                      ? constThemeColor.neutralSecondary
                      : constThemeColor.primary
                  }
                />
              </View>
            ) : null}
            {rightIcon && noArrow && !count ? (
              <View style={[reduxColors.rightSection]}>{rightIcon}</View>
            ) : null}
          </View>

          {props.animalSelect ||
          (disable == true &&
            (checkbox == undefined || checkbox == false) &&
            !props?.showInTransit) ? (
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <AntDesign
                name="checkcircle"
                size={20}
                color={
                  disable == true
                    ? constThemeColor.neutralSecondary
                    : constThemeColor.primary
                }
              />
            </View>
          ) : null}
          {props.remove ? (
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <Fontisto
                onPress={onRemove}
                name="close"
                size={22}
                color={constThemeColor.tertiary}
              />
            </View>
          ) : null}
          {props.switch ? (
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              {/* <Fontisto
                onPress={onRemove}
                name="close"
                size={22}
                color={constThemeColor.tertiary}
              /> */}
              <Switch
                handleToggle={toggleSwitch}
                active={switchStatus}
                disabled={isSecurityCheckin}
              />
            </View>
          ) : null}
          {props?.showCheckList ? (
            <>
              {props.checklistStatus ||
              (disable == true &&
                (checkbox == undefined || checkbox == false)) ? (
                <View
                  style={{
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <AntDesign
                    name="checkcircle"
                    size={20}
                    color={
                      disable == true
                        ? constThemeColor.neutralSecondary
                        : constThemeColor.primary
                    }
                  />
                </View>
              ) : (
                <View
                  style={{
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <AntDesign
                    name="exclamationcircle"
                    size={20}
                    color={
                      disable == true
                        ? constThemeColor.neutralSecondary
                        : constThemeColor.error
                    }
                  />
                </View>
              )}
            </>
          ) : null}
          {props?.showInTransit ? (
            <View
              style={[
                reduxColors.deadContainer,
                {
                  backgroundColor: constThemeColor?.tertiaryContainer,
                  alignItems: "flex-end",
                  justifyContent: "center",
                },
              ]}
            >
              <Text
                style={[
                  FontSize.Antz_Subtext_Regular,
                  { color: constThemeColor?.onTertiaryContainer },
                ]}
              >
                In Transit
              </Text>
            </View>
          ) : null}
          {props.excluded ? (
            <>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    backgroundColor: constThemeColor.errorContainer,
                    paddingHorizontal: Spacing.small,
                    paddingVertical: Spacing.mini,
                    borderRadius: Spacing.mini,
                    color: constThemeColor.error,
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  }}
                >
                  Excluded
                </Text>
              </View>
            </>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AnimalCustomCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      borderRadius: 10,
      // elevation: 1, // for shadow on Android
      shadowColor: reduxColors.neutralPrimary, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      flexDirection: "row",
      padding: Spacing.body,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "space-between",
      marginVertical: Spacing.mini,
    },
    image: {
      width: 42,
      height: 42,
      borderRadius: 50,
      alignSelf: "center",
    },
    rightSection: {
      justifyContent: "center",
      fontSize: FontSize.Antz_Major,
    },
    rightIcon: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onSurface,
      // marginRight: 10,
    },
    count: {
      fontSize: FontSize.Antz_Major_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onSurface,
      // marginRight: 10,
    },

    title: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    subtitleMedium: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,

      // margin: Spacing.micro,
    },
    subtitle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      // margin: Spacing.micro,
      marginBottom: Spacing.mini,
    },
    tagsContainer: {
      flexDirection: "row",
      marginTop: 3,
      justifyContent: "center",
      alignItems: "center",
      padding: 4,
      paddingRight: 0,
      paddingLeft: 0,
      height: 40,
      width: 40,
      borderRadius: 50,
    },

    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondaryContainer,
      marginRight: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.errorContainer,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginHorizontal: widthPercentageToDP(0.5),
    },
    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.displaybgSecondary,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    indeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.displaybgSecondary,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    groupChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.addPrimary,
      marginHorizontal: widthPercentageToDP(0.5),
    },
    malechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onSecondaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onErrorContainer,
    },
    undeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.error,
    },
    indeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onSurfaceVariant,
    },
    groupText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onError,
    },
    deadContainer: {
      borderRadius: 8,
      backgroundColor: reduxColors.error,
      paddingHorizontal: 10,
      paddingVertical: 6,
      alignItems: "flex-end",
      justifyContent: "center",
    },
  });
