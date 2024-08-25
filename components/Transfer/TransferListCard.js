import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { Card } from "react-native-paper";
import SvgUri from "react-native-svg-uri";
import { useSelector } from "react-redux";
import { useState } from "react";
import FontSize from "../../configs/FontSize";
import Config, { ACTIVITY_STATUS, TRANSFER_STATUS } from "../../configs/Config";
import { ifEmptyValue, opacityColor } from "../../utils/Utils";
import compare_arrow from "../../assets/compare_arrows.svg";
import move_down from "../../assets/move_down.svg";
import moved_location from "../../assets/moved_location.svg";
import line_end_square from "../../assets/line_end_square.svg";
import line_start_circle from "../../assets/line_start_circle.svg";
import { SvgXml } from "react-native-svg";
import Spacing from "../../configs/Spacing";
import moment from "moment";
import { Entypo } from "@expo/vector-icons";
import { widthPercentageToDP } from "react-native-responsive-screen";

const TransferListCard = ({ onPress, item, site_id }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const [imageUrl, setImageUrl] = useState(move_down);
  const reduxColors = styles(constThemeColor);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);

  useEffect(() => {
    if (item.transfer_type == "intra") {
      setImageUrl(move_down);
    } else if (item.transfer_type == "inter") {
      setImageUrl(compare_arrow);
    } else if (item.transfer_type == "external") {
      setImageUrl(moved_location);
    }
  }, [item]);

  const transferAnimalCountCheck = (total_count, transferred_count) => {
    if (
      parseInt(transferred_count) >= parseInt(total_count) ||
      parseInt(transferred_count) == 0
    ) {
      return `${total_count}`;
    } else {
      return `${transferred_count}/${total_count}`;
    }
  };
  const allocateButtonCheck = (e, item) => {
    if (
      e == "REACHED_DESTINATION" &&
      JSON.parse(item?.user_details)?.includes(parseInt(UserId))
    ) {
      return "ALLOCATE";
    } else if (e == "REACHED_DESTINATION" && item.transfer_type == "intra") {
      return "ALLOCATE";
    } else {
      return e;
    }
  };

  const allocateText = (e, item) => {
    if (
      e == "Received Animals" &&
      JSON.parse(item?.user_details)?.includes(parseInt(UserId))
    ) {
      return "Allocate";
    } else if (e == "Received Animals" && item.transfer_type == "intra") {
      return "Allocate";
    } else {
      return e;
    }
  };

  return (
    <Card
      style={[
        {
          backgroundColor: constThemeColor.onPrimary,
          justifyContent: "center",
          borderRadius: 8,
          marginBottom: 12,
          padding: Spacing.body,
        },
      ]}
      onPress={onPress}
      elevation={0.5}
    >
      <View style={[reduxColors.cardContainer]}>
        <View style={reduxColors.textBox}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              borderRadius: Spacing.body,
              marginBottom: Spacing.micro,
            }}
          >
            <SvgXml xml={imageUrl} width="14" height="14" />
            <Text
              style={{
                color: reduxColors.onSecondaryContainer,
                fontWeight: FontSize.Antz_Body_Title.fontWeight,
                fontSize: FontSize.Antz_Body_Title.fontSize,
                paddingLeft: Spacing.small,
              }}
            >
              {item?.request_id.toUpperCase()}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {item.transfer_type != "intra" && (
              <>
                {item.destination_id == site_id ? (
                  <SvgXml
                    xml={line_start_circle}
                    width="16"
                    height="8"
                    style={{ marginRight: Spacing.mini }}
                  />
                ) : (
                  <SvgXml
                    xml={line_end_square}
                    width="16"
                    height="8"
                    style={{ marginRight: Spacing.mini }}
                  />
                )}
              </>
            )}
            <Text style={reduxColors.title}>
              {ifEmptyValue(
                item.transfer_type == "inter"
                  ? item.destination_id == site_id
                    ? item.source_site_name
                    : item.destination_name
                  : item.destination_name
              )}
            </Text>
          </View>

          <Text style={[reduxColors.sub, { marginTop: Spacing.mini }]}>
            {transferAnimalCountCheck(
              item.animal_count,
              item.transferred_animal_count
            )}{" "}
            Animals{" "}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={reduxColors.subTitle}>
              {moment(item.requested_on).format("DD MMM")}
            </Text>
            <Entypo
              name="dot-single"
              size={24}
              color={constThemeColor.onSurfaceVariant}
              style={{ paddingTop: 4 }}
            />
            <Text style={reduxColors.subTitle}>
              {moment(item.requested_on).format("LT")}
            </Text>
          </View>
        </View>
        <View style={reduxColors.buttonContainer}>
          {TRANSFER_STATUS.filter((a) => a.value == item.transfer_status)
            .length > 0 && (
            <View
              style={[
                reduxColors.button,
                {
                  backgroundColor:
                    TRANSFER_STATUS.filter(
                      (a) =>
                        a.value ==
                          allocateButtonCheck(item.activity_status, item) ||
                        a.value1 ==
                          allocateButtonCheck(item.activity_status, item)
                    )[0]?.color ?? constThemeColor.onPrimary,
                },
              ]}
            >
              <Text
                style={[
                  reduxColors.buttonTitle,
                  {
                    color:
                      TRANSFER_STATUS.filter(
                        (a) =>
                          a.value ==
                            allocateButtonCheck(item.activity_status, item) ||
                          a.value1 ==
                            allocateButtonCheck(item.activity_status, item)
                      )[0]?.textColor ?? constThemeColor.onPrimaryContainer,
                  },
                ]}
              >
                {/* {TRANSFER_STATUS.filter(
                  (a) => a.value == allocateButtonCheck(item.activity_status)
                )[0]?.name ?? item?.activity_status} */}
                {allocateText(item?.comments, item) ?? item?.activity_status}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

export default TransferListCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    imgStyle: {
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 5),
      borderRadius: Spacing.small,
      width: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
    },

    cardContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    AvtarImage: {
      paddingRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    textBox: {
      flex: 1,
      justifyContent: "center",
      marginRight: 12,
      paddingLeft: Spacing.small,
    },
    title: {
      color: reduxColors.onSecondaryContainer,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      marginBottom: -Spacing.micro,
    },
    subTitle: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    sub: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      marginTop: -Spacing.micro,
    },
    buttonContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      paddingVertical: Spacing.body,
      borderRadius: Spacing.mini,
      alignSelf: "flex-end",
      // height: 39,
      width: 85,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonTitle: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    subButtonTitle: {
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      alignSelf: "flex-end",
      maxWidth: widthPercentageToDP(38),
      textAlign: "right",
      paddingTop: Spacing.small,
    },
  });
