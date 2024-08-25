import React from "react";
import { Card } from "react-native-paper";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import StatsBlock from "./StatsBlock";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import ObservationCard from "../screen/Observation/ObservationCard";
import { SvgXml } from "react-native-svg";
import insightsHomeIcon from "../assets/insights_home_icon.svg";
import { AnimalStatsType } from "../configs/Config";
import { checkPermissionAndNavigate, opacityColor } from "../utils/Utils";
import Spacing from "../configs/Spacing";
import BottomSheetModalStyles from "../configs/BottomSheetModalStyles";
import { warningToast } from "../utils/Alert";
import Background from "./BackgroundImage";

const HomeStat = ({
  insightData,
  showStat,
  insightsPermission,
  commonOnPress,
}) => {
  const navigation = useNavigation();
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const styles = styles(constThemeColor);
  const stylesSheet = BottomSheetModalStyles.ShodowOpacity(constThemeColor);
  const permission = useSelector((state) => state.UserAuth.permission);
  const siteList = useSelector((state) => state.sites.sites);
  return (
    <View style={{ flex: 1, marginTop: 0 }}>
      {showStat ? (
        <View>
          {insightsPermission ? (
            <Card
              style={[
                stylesSheet.elevationShadow,
                {
                  marginBottom: hp(2),
                  backgroundColor: constThemeColor.onPrimary,
                  elevation: stylesSheet.elevationShadow.elevation,
                  shadowColor: stylesSheet.elevationShadow.shadowColor,
                },
              ]}
            >
              
               <Background>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Card.Title
                    title="Dashboard"
                    style={{ width: "90%" }}
                    titleStyle={{
                      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                      fontSize: FontSize.Antz_Minor_Medium.fontSize,
                      color: constThemeColor.onPrimaryContainer,
                    }}
                    left={(props) => (
                      // <View
                      //   style={{
                      //     borderRadius: 25,
                      //     height: 45,
                      //     width: 45,
                      //     backgroundColor: constThemeColor.secondaryContainer,
                      //     alignItems: "center",
                      //     justifyContent: "center",
                      //   }}
                      // >
                      //   <Image source={require("../assets/insights.png")} />
                      // </View>

                      <SvgXml
                        xml={insightsHomeIcon}
                        style={{ alignSelf: "center" }}
                      />
                    )}
                  />
                  {/* <Entypo
                  name="dots-three-vertical"
                  // size={wp(5)}
                  size={20}
                  style={{
                    color: Colors.insightMenu,
                    // backgroundColor: Colors.black,
                    // position: "absolute",
                    right: wp(5),
                    // top: hp(3.5),
                    top: 30,
                  }}
                /> */}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginBottom: Spacing.body,
                  }}
                >
                  <StatsBlock
                    insightData={insightData?.zoo_stats?.total_species}
                    label={"Species"}
                    onPress={() => {
                      if (Number(insightData?.zoo_stats?.total_species) > 0) {
                        checkPermissionAndNavigate(
                          permission,
                          "collection_view_insights",
                          navigation,
                          "Collections",
                          {}
                        );
                      } else {
                        warningToast("Oops!!", "No Species present!!");
                      }
                    }}
                  />
                  <StatsBlock
                    insightData={insightData.zoo_stats.total_animals}
                    label={"Animals"}
                    onPress={() => {
                      if (Number(insightData.zoo_stats.total_animals) > 0) {
                        checkPermissionAndNavigate(
                          permission,
                          "collection_animal_records",
                          navigation,
                          "AnimalModuleStats",
                          {}
                        );
                      } else {
                        warningToast("Oops!!", "No Animal present!!");
                      }
                    }}
                  />
                  <StatsBlock
                    insightData={insightData.zoo_stats.total_sites}
                    onPress={() => {
                      if (Number(insightData.zoo_stats.total_sites) > 0) {
                        if (insightData.zoo_stats.total_sites == 1) {
                          checkPermissionAndNavigate(
                            permission,
                            "enable_housing",
                            navigation,
                            "siteDetails",
                            { id: siteList[0]?.site_id }
                          );
                        } else {
                          checkPermissionAndNavigate(
                            permission,
                            "enable_housing",
                            navigation,
                            "Housing",
                            {}
                          );
                        }
                      } else {
                        warningToast("Oops!!", "No Site present!!");
                      }
                    }}
                    label={"Sites"}
                  />
                </View>
                </Background>
              {/* <Card.Content>
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    borderTopWidth: 0.3,
                    borderColor: constThemeColor.outlineVariant,
                    marginVertical: 12,
                  }}
                ></View>

                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: constThemeColor.outline,
                      fontSize: FontSize.Antz_Subtext_title.fontSize,
                      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
                    }}
                  >
                    More insights and animal statistics
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Collections");
                    }}
                    style={{
                      display: "flex",
                      textAlign: "center",
                      width: 70,
                      borderColor: constThemeColor.onSurface,
                      borderWidth: 1,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        display: "flex",
                        textAlign: "center",
                        margin: 5,
                        color: constThemeColor.onSurface,
                        fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        fontSize: FontSize.Antz_Body_Medium.fontSize,
                        lineHeight: 20,
                      }}
                    >
                      View
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card.Content> */}
            </Card>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default HomeStat;
