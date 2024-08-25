import { View } from "react-native";
import { Text } from "react-native";
import { TouchableOpacity, StyleSheet } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
// import { SvgXml } from "react-native-svg";
import { dateFormatter, ifEmptyValue, opacityColor } from "../utils/Utils";
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
import { SvgXml } from "react-native-svg";
import line_start from "../assets/line_start_circle.svg";
import line_end from "../assets/line_end_circle.svg";

import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import ImageComponent from "./ImageComponent";
import GenderChipComponents from "./GenderChipComponents";
import { useState } from "react";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const EnclosureHistoryCard2 = ({ encHistoryData, getEncloHistoryInmates }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [isHide, setIsHide] = useState(false);
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: constThemeColor.surface,
          padding: Spacing.body + Spacing.mini,
          borderTopLeftRadius: Spacing.small,
          borderTopRightRadius: Spacing.small,
        }}
        onPress={() => {
          navigation.navigate("OccupantScreen", {
            enclosure_id: encHistoryData?.enclosure_id,
          });
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View
            style={{
              backgroundColor: opacityColor(constThemeColor?.neutralPrimary, 5),
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 99,
            }}
          >
            <MaterialCommunityIcons
              name="home-analytics"
              size={24}
              color={constThemeColor.onSurfaceVariant}
            />
          </View>
          <View
            style={{
              marginLeft: Spacing.small,
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: FontSize.Antz_Small,
                  color: constThemeColor?.neutralSecondary,
                }}
              >
                {encHistoryData?.out_date
                  ? `PREVIOUS ENCLOSURE`
                  : "CURRENT ENCLOSURE"}
              </Text>
              <Text
                style={[
                  FontSize.Antz_Minor_Medium,
                  {
                    color: constThemeColor.onSecondaryContainer,
                    marginBottom: Spacing.micro,
                  },
                ]}
              >
                {ifEmptyValue(encHistoryData?.user_enclosure_name ?? "NA")}
              </Text>
              <Text
                style={{
                  fontSize: FontSize.Antz_Body_Regular.fontSize,
                  fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  color: constThemeColor?.onSurfaceVariant,
                }}
              >
                Section: {ifEmptyValue(encHistoryData?.section_name ?? "NA")}
              </Text>
              <Text
                style={{
                  fontSize: FontSize.Antz_Body_Regular.fontSize,
                  fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  color: constThemeColor?.onSurfaceVariant,
                }}
              >
                Site: {ifEmptyValue(encHistoryData?.site_name ?? "NA")}
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} />
          </View>
        </View>

        <View
          style={{
            backgroundColor: constThemeColor.onBackground,
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: Spacing.minor,
            borderRadius: Spacing.mini,
            padding: Spacing.small,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: Spacing.small,
            }}
          >
            <SvgXml xml={line_start} width="20" height="18" />
            <Text
              style={{
                fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                color: constThemeColor.onSurfaceVariant,
              }}
            >
              {moment(encHistoryData?.in_date).format("DD MMM yyyy")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: Spacing.small,
            }}
          >
            {encHistoryData?.out_date && (
              <>
                <SvgXml xml={line_end} width="20" height="20" />
                <Text
                  style={{
                    fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                    fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                  }}
                >
                  {moment(encHistoryData?.out_date).format("DD MMM yyyy")}
                </Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default EnclosureHistoryCard2;

const styles = (reduxColors) =>
  StyleSheet.create({
    tagsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 4,
      paddingRight: 0,
      paddingLeft: 0,
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
  });
