//modify By: gaurav shukla
//date:2-05-2023
//description: add the functions for the navigation footermedical

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  BackHandler,
  Alert,
} from "react-native";
import React from "react";
import Footermedical from "../../components/Footermedical";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import MedicalHeader from "../../components/MedicalHeader";
import { useDispatch, useSelector } from "react-redux";
import { setcaseType } from "../../redux/MedicalSlice";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { listMedicalCaseType } from "../../services/MedicalsService";
import Loader from "../../components/Loader";
import { FontAwesome } from "@expo/vector-icons";
import { errorToast } from "../../utils/Alert";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import Header from "../../components/Header";
import SvgUri from "react-native-svg-uri";

const CaseType = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const caseType = useSelector((state) => state.medical.caseType);
  const [selectedCaseType, setSelectedCaseType] = useState(caseType);
  const medicalSettingsData = useSelector(
    (state) => state.medical.medicalSettings
  );
  const [caseTypeData, setcaseTypeData] = useState(
    medicalSettingsData.caseTypes ?? []
  );
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("AddMedical");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  /**
   * Select and dispatch
   */
  const clickFun = (item) => {
    dispatch(setcaseType(selectedCaseType));
  };

  /**
   * Navigations
   */
  const navigateNextScreen = () => {
    clickFun();
    navigation.navigate("Complaints", {
      screenName: "Medical",
    });
  };
  const goback = () => {
    clickFun();
    navigation.navigate("AddMedical");
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      {/* <MedicalHeader
        title="Choose Case Type"
        noIcon={true}
        style={{
          paddingVertical: Spacing.minor,
        }}
      /> */}
      <Header
        title={"Choose Case Type"}
        headerTitle={reduxColors.headerTitle}
        noIcon={true}
        search={false}
        hideMenu={true}
        backgroundColor={constThemeColor?.onPrimary}
        customBack={() => navigation.navigate("AddMedical")}
      />
      <Loader visible={isLoading} />
      <ScrollView style={{ backgroundColor: constThemeColor.onPrimary }}>
        {caseTypeData?.map((item, i) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setSelectedCaseType(item)}
              accessible={true}
              accessibilityLabel={"caseTypeBox"}
              AccessibilityId={"caseTypeBox"}
            >
              <View
                style={[
                  reduxColors.cont,
                  {
                    backgroundColor:
                      item.id !== selectedCaseType?.id
                        ? constThemeColor.surface
                        : constThemeColor.secondaryContainer,
                  },
                ]}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 55,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: item?.color_code,
                      }}
                    >
                      <SvgUri
                        source={{ uri: item?.default_icon }}
                        width="20"
                        height="20"
                        style={reduxColors.image}
                      />
                    </View>
                    {/* <Image
                  source={{uri:item?.default_icon}}
                  style={{ width: 40, height: 40, borderRadius: 50, resizeMode: "contain" }}
                /> */}
                    <View
                      style={{ marginLeft: "8%", justifyContent: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: FontSize.Antz_Minor_Title.fontSize,
                          fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                          textAlign: "center",
                          color: constThemeColor.onSurfaceVariant,
                        }}
                      >
                        {item.label}
                      </Text>
                    </View>
                  </View>

                  {item.id == selectedCaseType?.id ? (
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: Spacing.body,
                      }}
                    >
                      <AntDesign
                        name="check"
                        size={24}
                        color={constThemeColor.onPrimaryContainer}
                      />
                    </View>
                  ) : (
                    ""
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={{ width: "100%" }}>
        <Footermedical
          firstlabel={""}
          lastlabel={"Complaints"}
          navigateNextScreen={navigateNextScreen}
          ShowRighticon={true}
          onPress={goback}
        />
      </View>
    </>
  );
};

export default CaseType;

const styles = (reduxColors) =>
  StyleSheet.create({
    cont: {
      borderRadius: Spacing.small,
      marginVertical: Spacing.small,
      marginHorizontal: Spacing.minor,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
      padding: Spacing.body,
    },
  });
