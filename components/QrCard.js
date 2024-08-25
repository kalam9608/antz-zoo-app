import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { capitalize, shortenNumber } from "../utils/Utils";

import { SvgUri } from "react-native-svg";
import { Image } from "expo-image";
import { Avatar } from "react-native-paper";
import Spacing from "../configs/Spacing";

const QrCard = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [screen, setScreen] = useState("a");

  return (
    <View style={reduxColors.container}>
      <View
        style={{
          backgroundColor: constThemeColor.onPrimary,
          flexDirection: "row",
          borderRadius: Spacing.small,
          paddingVertical: Spacing.minor,
          paddingHorizontal: Spacing.body,
        }}
      >
        <View
          style={{
            alignSelf: "center",
          }}
        >
          {props.imgUri ? (
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 50,
                alignSelf: "center",
              }}
            >
              <SvgUri width="100%" height="100%" uri={props.imgUri} />
            </View>
          ) : (
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 50,
                alignSelf: "center",
                backgroundColor: constThemeColor.secondary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  textAlign: "center",
                  color: reduxColors.onPrimary,
                }}
              >
                {capitalize(props.title).slice(0, 1)}
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            marginLeft: Spacing.small,
            // alignContent:"center"
          }}
        >
          <View style={reduxColors.card}>
            {props.title ? (
              <Text
                style={{
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  color: constThemeColor.onSurfaceVariant,
                }}
              >
                {props.title}
              </Text>
            ) : null}

            {props.chip ? (
              <View
                style={[
                  reduxColors.chip,
                  {
                    backgroundColor:
                      props?.chip == "U"
                        ? constThemeColor.errorContainer
                        : props?.chip == "I"
                        ? constThemeColor.indertermineChip
                        : props?.chip == "F"
                        ? constThemeColor.secondary
                        : constThemeColor.surfaceVariant,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: FontSize.Antz_Small.fontSize,
                    fontWeight: FontSize.Antz_Small.fontWeight,
                  }}
                >
                  {props.chip}
                </Text>
              </View>
            ) : null}
          </View>

          {props.name ? (
            <View>
              <Text
                style={{
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                }}
              >
                {props.name}
              </Text>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: Spacing.mini,
            }}
          >
            <Text
              style={{
                fontSize: FontSize.Antz_Minor_Regular.fontSize,
                color: constThemeColor.onSurfaceVariant,
              }}
            >
              In Charge
            </Text>
            <View
              style={{
                backgroundColor: constThemeColor.background,
                flexDirection: "row",
                // marginLeft: Spacing.mini,
                padding: Spacing.mini,
                borderRadius: Spacing.mini,
              }}
            >
              <FontAwesome5
                name="user"
                size={20}
                color={constThemeColor.onSurface}
              />
              <Text
                style={{
                  marginLeft: Spacing.mini,
                  fontSize: FontSize.Antz_Minor_Regular.fontSize,
                  fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                  color: constThemeColor.onSurface,
                }}
              >
                {" " + props.inchargename + " "}
              </Text>
            </View>

            {props.onPress != false ? (
              <TouchableOpacity
                onPress={props.onPress}
                style={{
                  backgroundColor: constThemeColor.secondaryContainer,
                  borderRadius: Spacing.mini,
                  paddingVertical: Spacing.mini,
                  paddingHorizontal: Spacing.mini
                }}
              >
                <MaterialCommunityIcons
                  color={constThemeColor.onSurface}
                  name="phone"
                  size={20}
                />
              </TouchableOpacity>
            ) : null}

            {props.onPressMsz != false ? (
              <TouchableOpacity
                onPress={props.onPressMsz}
                style={{
                  backgroundColor: constThemeColor.secondaryContainer,
                  borderRadius: Spacing.mini,
                  paddingVertical: Spacing.mini,
                  paddingHorizontal: Spacing.mini,
                }}
              >
                <MaterialIcons
                  color={constThemeColor.onSurface}
                  name="chat"
                  size={20}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          {props.Enclosures && props.Animals ? (
            <View
              style={{
                flexDirection: "row",
                marginVertical: Spacing.mini,
                columnGap: Spacing.mini,
              }}
            >
              <View
                style={{
                  backgroundColor: constThemeColor.background,
                  borderRadius: Spacing.mini,
                  paddingVertical: Spacing.mini,
                  paddingHorizontal: Spacing.mini + Spacing.micro,
                  flexDirection:
                    shortenNumber(props.Enclosures)?.length > 4
                      ? "column"
                      : "row",
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                  }}
                >
                  Enclosures
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                    marginLeft:
                      shortenNumber(props.Enclosures)?.length > 4
                        ? 0
                        : Spacing.mini,
                  }}
                >
                  {shortenNumber(props.Enclosures)}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: constThemeColor.background,
                  borderRadius: Spacing.mini,
                  paddingVertical: Spacing.mini,
                  paddingHorizontal: Spacing.mini + Spacing.micro,
                  flexDirection:
                    shortenNumber(props.Animals)?.length > 4 ? "column" : "row",
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                  }}
                >
                  Animals
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                    marginLeft:
                      shortenNumber(props.Animals)?.length > 4
                        ? 0
                        : Spacing.mini,
                  }}
                >
                  {shortenNumber(props.Animals)}
                </Text>
              </View>
            </View>
          ) : null}

          {props.Occupants && props.Species ? (
            <View
              style={{
                flexDirection: "row",
                marginVertical: Spacing.mini,
                columnGap: Spacing.mini,
              }}
            >
              <View
                style={{
                  backgroundColor: constThemeColor.background,
                  borderRadius: Spacing.mini,
                  paddingVertical: Spacing.mini,
                  paddingHorizontal: Spacing.mini + Spacing.micro,
                  flexDirection:
                    shortenNumber(props.Occupants)?.length > 6
                      ? "column"
                      : "row",
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                  }}
                >
                  Occupants
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                    marginLeft:
                      shortenNumber(props.Occupants)?.length > 4
                        ? 0
                        : Spacing.mini,
                  }}
                >
                  {shortenNumber(props.Occupants)}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: constThemeColor.background,
                  borderRadius: Spacing.mini,
                  paddingVertical: Spacing.mini,
                  paddingHorizontal: Spacing.mini + Spacing.micro,
                  flexDirection:
                    shortenNumber(props.Species)?.length > 6 ? "column" : "row",
                }}
              >
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                  }}
                >
                  Species
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                    marginLeft:
                      shortenNumber(props.Species)?.length > 4
                        ? 0
                        : Spacing.mini,
                  }}
                >
                  {shortenNumber(props.Species)}
                </Text>
              </View>
            </View>
          ) : null}

          {props.Encloure ? (
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                marginTop: Spacing.micro,
                color: constThemeColor.onSurfaceVariant,
              }}
            >
              {props.Encloure}
            </Text>
          ) : null}

          {props.Section ? (
            <View style={{width:wp(70)}}>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                marginTop: Spacing.micro,
                color: constThemeColor.onSurfaceVariant,
              }} 
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {props.Section}
            </Text></View>
          ) : null}

          {props.sitename ? (
            <View style={{width:wp(70)}}>
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                marginTop: Spacing.micro,
                color: constThemeColor.onSurfaceVariant,
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Site- {props.sitename}
            </Text></View>
          ) : null}
        </View>
      </View>
    </View>
  );
};
export default QrCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: reduxColors.surfaceVariant,
      marginVertical : Spacing.body
    },
    chip: {
      height: 22,
      width: 22,
      backgroundColor: reduxColors.surfaceVariant,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Spacing.mini,
      marginLeft: Spacing.small,
    },
    card: {
      flexDirection: "row",
    },
  });
