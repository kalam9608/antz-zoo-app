import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import { Card } from "react-native-paper";
import { ifEmptyValue } from "../utils/Utils";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import CheckBox from "./CheckBox";
import Spacing from "../configs/Spacing";

const PrescriptionMedicineCard = ({
  item,
  index,
  selectedCheckedBox,
  selectAction,
  preSelectedIds,
  showCount,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <Card
      style={[
        {
          backgroundColor: selectedCheckedBox?.includes(item.id)
            ? constThemeColor?.background
            : constThemeColor.onPrimary,
          justifyContent: "center",
          marginVertical: Spacing.mini + Spacing.micro,
        },
      ]}
      key={index}
      accessible={true}
      accessibilityLabel={"prescriptionCard"}
      AccessibilityId={"prescriptionCard"}
    >
      <TouchableOpacity
        onPress={() => {
          if (!preSelectedIds?.includes(item.id)) {
            selectAction(item);
          }
        }}
      >
        <View style={[reduxColors.cardContainer]}>
          <View style={reduxColors.textBox}>
            <Text style={reduxColors.title}>{item.name}</Text>
            {item?.composition ? (
              <Text
                style={reduxColors.subTitle}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item?.composition}
              </Text>
            ) : null}
            {showCount ? (
              <View style={reduxColors.stockBox}>
                <Text style={reduxColors.stockBoxText}>
                  Stocks:{" "}
                  <Text style={reduxColors.stockBoxText}>
                    <Text
                      style={[
                        reduxColors.stockValue,
                        {
                          color:
                            item?.total_qty == "0"
                              ? constThemeColor?.error
                              : null,
                        },
                      ]}
                    >
                      {item?.total_qty}
                    </Text>
                  </Text>
                </Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={{ marginLeft: Spacing.mini }}
            accessible={true}
            accessibilityLabel={"prescriptionCardCB"}
            AccessibilityId={"prescriptionCardCB"}
          >
            <CheckBox
              key={item.id}
              activeOpacity={1}
              iconSize={24}
              checked={selectedCheckedBox.includes(item.id)}
              checkedColor={constThemeColor.primary}
              uncheckedColor={constThemeColor.outline}
              onPress={() => {
                if (!preSelectedIds?.includes(item.id)) {
                  selectAction(item);
                }
              }}
              disabled={preSelectedIds?.includes(item.id)}
              labelStyle={[reduxColors.labelName, reduxColors.mb0]}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

export default PrescriptionMedicineCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: Spacing.body,
    },
    textBox: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      color: reduxColors.onSurfaceVariant,
    },
    subTitle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      paddingTop: Spacing.small,
    },
    stockBox: {
      backgroundColor: reduxColors.surfaceVariant,
      marginTop: Spacing.body,
      padding: Spacing.small,
      borderRadius: Spacing.mini,
      flexDirection: "row",
    },
    stockBoxText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    stockValue: {
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
    },
  });
