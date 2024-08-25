import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { Card } from "react-native-paper";
import SvgUri from "react-native-svg-uri";
import { useSelector } from "react-redux";
import { useState } from "react";
import FontSize from "../../configs/FontSize";
import Config, { ACTIVITY_STATUS, APPROVAL_STATUS } from "../../configs/Config";
import { capitalize, ifEmptyValue, opacityColor } from "../../utils/Utils";
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

const TransferCard = ({ onPress, item, site_id, action }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const userDetails = useSelector((state) => state.UserAuth.userDetails);
  const [imageUrl, setImageUrl] = useState(move_down);
  const reduxColors = styles(constThemeColor);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  useEffect(() => {
    if (item?.transfer_type == "intra") {
      setImageUrl(move_down);
    } else if (item?.transfer_type == "inter") {
      setImageUrl(compare_arrow);
    } else if (item?.transfer_type == "external") {
      setImageUrl(moved_location);
    }
  }, [item]);

  const transferStatusCheck = (transfer_status) => {
    if (
      transfer_status === "PENDING" ||
      transfer_status === "APPROVED" ||
      transfer_status === "COMPLETED" ||
      transfer_status === "REACHED_DESTINATION"
    ) {
      return "Approved";
    } else if (transfer_status === "CANCELED") {
      return "Canceled";
    } else if (transfer_status === "REJECTED") {
      return "Rejected";
    } else {
      return transfer_status;
    }
  };
  return (
    <Card
      style={[
        {
          backgroundColor: constThemeColor.onPrimary,
          justifyContent: "center",
          borderRadius: Spacing.small,
          marginBottom: Spacing.body,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={{
          paddingVertical: Spacing.mini,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: Spacing.minor,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: reduxColors.onSurfaceVariant,
              fontSize: FontSize.Antz_Subtext_Regular.fontSize,
              fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
            }}
          >
            Requested by
          </Text>
          <Text
            style={{
              color: reduxColors.onSurfaceVariant,
              fontSize: FontSize.Antz_Subtext_title.fontSize,
              fontWeight: FontSize.Antz_Subtext_title.fontWeight,
              marginLeft: Spacing.mini,
            }}
          >
            {item?.requested_by?.user_name}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={reduxColors.subTitle}>
            {moment(item?.requested_on).format("DD MMM")}
          </Text>
          <Entypo
            name="dot-single"
            size={25}
            color={constThemeColor.onSurfaceVariant}
          />
          <Text style={reduxColors.subTitle}>
            {moment(item?.requested_on).format("LT")}
          </Text>
        </View>
      </View>
      <View style={[reduxColors.cardContainer]}>
        <View style={reduxColors.AvtarImage}>
          <View style={reduxColors.imgStyle}>
            <SvgXml
              xml={imageUrl}
              width="24"
              height="24"
              style={reduxColors.image}
            />
          </View>
        </View>

        <View style={reduxColors.textBox}>
          <Text style={reduxColors.title}>
            {item?.request_id.toUpperCase()}
          </Text>

          {item?.transfer_type != "intra" ? (
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <SvgXml xml={line_start_circle} width="16" height="8" />
                <Text
                  style={{
                    marginLeft: Spacing.small,
                    color: reduxColors.onSurfaceVariant,
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  }}
                >
                  {item?.source_site_name}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <SvgXml xml={line_end_square} width="16" height="8" />
                <Text
                  style={{
                    marginLeft: Spacing.small,
                    color: reduxColors.onSurfaceVariant,
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  }}
                >
                  {item?.destination_name}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    // marginLeft: Spacing.small,
                    color: reduxColors.onSurfaceVariant,
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  }}
                >
                  {item?.source_site_name}
                </Text>
              </View>
            </View>
          )}

          <Text style={reduxColors.sub}>
            {item?.animal_count} {item?.animal_count > 1 ? "Animals" : "Animal"}
          </Text>
        </View>
        {action === "approve_reject" ? (
          <View style={reduxColors.buttonContainer}>
            <View
              style={[
                reduxColors.button,
                {
                  backgroundColor:
                    APPROVAL_STATUS.filter(
                      (a) =>
                        capitalize(a.value) ==
                        transferStatusCheck(item?.transfer_status)
                    )[0]?.color ?? constThemeColor.moderatePrimary,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    reduxColors.buttonTitle,
                    {
                      color:
                        APPROVAL_STATUS.filter(
                          (a) =>
                            capitalize(a.value) ==
                            transferStatusCheck(item?.transfer_status)
                        )[0]?.textColor ?? constThemeColor.tertiary,
                    },
                  ]}
                >
                  {transferStatusCheck(item?.transfer_status)}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={reduxColors.buttonContainer}>
            <View
              style={[
                reduxColors.button,
                {
                  backgroundColor:
                    APPROVAL_STATUS.filter(
                      (a) => a.value == item?.transfer_status
                    )[0]?.color ?? constThemeColor.moderatePrimary,
                },
              ]}
            >
              <Text
                style={[
                  reduxColors.buttonTitle,
                  {
                    color:
                      APPROVAL_STATUS.filter(
                        (a) => a.value == item?.transfer_status
                      )[0]?.textColor ?? constThemeColor.tertiary,
                  },
                ]}
              >
                {APPROVAL_STATUS.filter(
                  (a) => a.value == item?.transfer_status
                )[0]?.name ?? APPROVAL_STATUS[1].name}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Card>
  );
};

export default TransferCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    imgStyle: {
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 5),
      borderRadius: Spacing.small,
      width: 56,
      height: 56,
      alignItems: "center",
      justifyContent: "center",
    },

    cardContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      paddingVertical: Spacing.small,
    },
    AvtarImage: {
      paddingHorizontal: Spacing.body,
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    textBox: {
      flex: 1,
      marginRight: Spacing.minor,
      paddingLeft: Spacing.small,
    },
    title: {
      color: reduxColors.onSecondaryContainer,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
    },
    subTitle: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
    },
    sub: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      paddingTop: Spacing.micro,
      //   marginLeft: Spacing.mini,
    },
    buttonContainer: {
      padding: Spacing.body,
      paddingTop: 0,
    },
    button: {
      // paddingVertical: Spacing.minor,
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.body,
      borderRadius: Spacing.mini,
      // maxWidth: widthPercentageToDP(30),
      // alignSelf: "flex-end",
      width: 100,
      alignItems: "center",
    },
    buttonTitle: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
    },
    subButtonTitle: {
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      alignSelf: "flex-end",
    },
  });
