import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import CustomCard from '../../components/CustomCard';
import { useNavigation } from "@react-navigation/native";

const MortalityReason = () => {
    const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [type, setType] = useState("reasons");

  //Toggle tab
  const toggleTab = (data) => {
    setType(data);
  };
  return (
    <View style={styles.container}>
      <Header
        noIcon={true}
        title={"Mortality"}
        search={true}
        titleBackgroundColor={"#ffe81a"}
        titlePaddingHorizontal={Spacing.mini}
        backgroundColor={"#FFE5DD"}
      />
      <View style={styles.body}>
        <View
          style={{
            backgroundColor: "#FFBDA8",
            borderRadius: Spacing.small + Spacing.mini,
            paddingTop: Spacing.minor - 1,
            paddingHorizontal: Spacing.minor,
            marginBottom: Spacing.minor
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              alignItems: "center",
            }}
          >
            <Text style={[FontSize.Antz_Subtext_Regular, { color: "#250E01" }]}>
              All time data
            </Text>
            <MaterialIcons
              name="expand-more"
              size={20}
              color={"#250E01"}
              style={{ paddingLeft: Spacing.mini }}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={() => toggleTab("reasons")}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: Spacing.small + Spacing.micro,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Large_Title.fontSize,
                    fontWeight: FontSize.Antz_Large_Title.fontWeight,
                    color: "#250E01",
                    textAlign: "center",
                  }}
                >
                  15
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                    color: "#4A0415",
                    marginBottom: Spacing.body,
                    textAlign: "center",
                  }}
                >
                  Reasons
                </Text>
              </View>

              <View
                style={[
                  {
                    height: 6,
                    width: 85,
                    borderTopLeftRadius: Spacing.small,
                    borderTopRightRadius: Spacing.small,
                    backgroundColor:
                      type == "reasons" ? "#FA6140" : "transparent",
                  },
                ]}
              ></View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleTab("species")}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: Spacing.small + Spacing.micro,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Large_Title.fontSize,
                    fontWeight: FontSize.Antz_Large_Title.fontWeight,
                    color: "#250E01",
                    textAlign: "center",
                  }}
                >
                  144
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                    color: "#4A0415",
                    marginBottom: Spacing.body,
                    textAlign: "center",
                  }}
                >
                  Species
                </Text>
              </View>

              <View
                style={[
                  {
                    height: 6,
                    width: 85,
                    borderTopLeftRadius: Spacing.small,
                    borderTopRightRadius: Spacing.small,
                    backgroundColor:
                      type == "species" ? "#FA6140" : "transparent",
                  },
                ]}
              ></View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleTab("animals")}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: Spacing.small + Spacing.micro,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Large_Title.fontSize,
                    fontWeight: FontSize.Antz_Large_Title.fontWeight,
                    color: "#250E01",
                    textAlign: "center",
                  }}
                >
                  987
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                    color: "#4A0415",
                    marginBottom: Spacing.body,
                    textAlign: "center",
                  }}
                >
                  Animals
                </Text>
              </View>

              <View
                style={[
                  {
                    height: 6,
                    width: 85,
                    borderTopLeftRadius: Spacing.small,
                    borderTopRightRadius: Spacing.small,
                    backgroundColor:
                      type == "animals" ? "#FA6140" : "transparent",
                  },
                ]}
              ></View>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={["1", "2", "3", "1", "2", "3"]}
          renderItem={({ item }) => {
            return (
              <>
                <CustomCard
                  title={"Hi"}
                  count={5}
                  onPress={() =>
                    navigation.navigate("MortalityReasonSpecies")
                  }
                />
              </>
            );
          }}
        />
      </View>
    </View>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFE5DD",
    },
    body: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
    },
  });

export default MortalityReason;
