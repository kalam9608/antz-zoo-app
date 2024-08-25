import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";
import moment from "moment";

const AdministerStats = ({ infoVisble, setInfoVisble, item, setReason }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const Administer = ({ value, lastItem }) => {
    return (
      <TouchableWithoutFeedback>
        <View
          style={{
            marginTop: Spacing.mini,
            backgroundColor: constThemeColor?.background,
            padding: Spacing.body,
            minHeight: 82,
            borderBottomEndRadius: lastItem ? 8 : 0,
            borderBottomStartRadius: lastItem ? 8 : 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "33%" }}>
              <Text style={reduxColors?.count}>
                {moment(value?.administritive_time, "HH:mm:ss").format("LT")}
              </Text>
              <Text style={reduxColors?.countType}>Dosage time</Text>
            </View>
            <View style={{ alignItems: "center", width: "33%" }}>
              {value?.quantity_administered ? (
                <>
                  <Text style={reduxColors?.count}>
                    {value?.quantity_administered}
                  </Text>
                  <Text style={reduxColors?.countType}>Given</Text>
                </>
              ) : null}
            </View>

            <View
              style={{
                alignItems: "flex-end",
                width: "33%",
              }}
            >
              {value?.wastage_quantity != 0 || value?.status == "withheld" ? (
                <View style={{ alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={[
                        reduxColors?.count,
                        { textTransform: "capitalize" },
                      ]}
                    >
                      {value?.status == "withheld"
                        ? "withheld"
                        : value?.wastage_quantity}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        setInfoVisble(!infoVisble);
                        setReason(value);
                      }}
                    >
                      <MaterialIcons
                        name="info-outline"
                        color={constThemeColor?.moderateSecondary}
                        size={20}
                        style={{ marginLeft: Spacing.mini }}
                      />
                    </TouchableOpacity>
                  </View>
                  {value?.status == "withheld" ? null : (
                    <Text style={reduxColors?.countType}>Wastage</Text>
                  )}
                </View>
              ) : null}
            </View>
          </View>
          <Text
            style={[
              reduxColors?.recorderTime,
              {
                color:
                  moment(value?.created_at).format("DD MMM YYYY") !=
                  moment(item?.administritive_date).format("DD MMM YYYY")
                    ? constThemeColor?.tertiary
                    : constThemeColor?.outline,
              },
            ]}
          >
            Recorded at:{" "}
            {moment(value?.administritive_date).format("DD MMM YYYY")}{" "}
            {moment(value?.administritive_time, "HH:mm:ss").format("LT")}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  return (
    <View style={{ marginTop: Spacing.small }}>
      <View style={reduxColors?.cardDate}>
        <Text
          style={{
            fontSize: FontSize.Antz_Body_Medium.fontSize,
            fontWeight: FontSize.Antz_Body_Medium.fontWeight,
          }}
        >
          {moment(item?.administritive_date).format("DD MMM YYYY")}
        </Text>
      </View>
      {item?.med_admin_data?.map((val, index) => {
        return (
          <Administer
            value={val}
            lastItem={item?.med_admin_data?.length - 1 == index}
          />
        );
      })}
    </View>
  );
};

export default AdministerStats;

const styles = (reduxColors) =>
  StyleSheet.create({
    cardDate: {
      backgroundColor: reduxColors?.displaybgSecondary,
      height: 50,
      justifyContent: "center",
      padding: Spacing.small,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    count: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors?.onPrimaryContainer,
    },
    countType: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors?.cardLebel,
    },
    recorderTime: {
      paddingTop: Spacing.body,
      fontSize: FontSize.Antz_Small,
      color: reduxColors?.outline,
    },
  });
