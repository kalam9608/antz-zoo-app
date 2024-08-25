import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import SpeciesCustomCard from "../../components/SpeciesCustomCard";
import AnimalCustomCard from "../../components/AnimalCustomCard";

const MortalityReasonSpecies = () => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [type, setType] = useState("species");

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
        <Text
          style={{
            fontSize: FontSize.Antz_Major,
            fontWeight: FontSize.weight400,
            marginBottom: Spacing.body,
          }}
        >
          Euthanasia
        </Text>
        <View
          style={{
            backgroundColor: "#FFBDA8",
            borderRadius: Spacing.small + Spacing.mini,
            paddingTop: Spacing.minor - 1,
            paddingHorizontal: Spacing.minor,
            marginBottom: Spacing.minor,
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
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
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
          data={
            type == "species"
              ? ["1", "2", "3", "1", "2", "3"]
              : ["1", "2", "3", "1", "2", "3"]
          }
          renderItem={({ item }) => {
            return (
              <>
                {type == "species" ? (
                  <SpeciesCustomCard
                    // icon={item.default_icon}
                    complete_name={"Golden conure"}
                    animalName={"hdsgvhfdvyh"}
                    // tags={}
                    count={15}
                    //   onPress={() => {
                    //     navigateToComponent({
                    //       screenName: "SpeciesDetails",
                    //       params: {
                    //         title: item?.common_name,
                    //         subtitle: item.complete_name,
                    //         tags: item.sex_data,
                    //         tsn_id: item.tsn_id,
                    //         icon: item.default_icon,
                    //         section_id: section_id,
                    //       },
                    //     });
                    //   }}
                  />
                ) : (
                  <AnimalCustomCard
                    item={{}}
                    animalName={"nscjgvyh"}
                    chips={"male"}
                    show_housing_details={true}
                    sectionName={"Section name"}
                    enclosureName={"Enclosure name"}
                  />
                )}
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

export default MortalityReasonSpecies;
