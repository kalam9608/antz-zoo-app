import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import ImageComponent from "../../components/ImageComponent";
import { opacityColor } from "../../utils/Utils";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import HeaderWithSearch from "../../components/HeaderWithSearch";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import ListEmpty from "../../components/ListEmpty";
import MedicalListCard from "../../components/MedicalListCard";
import {
  getMedicalRecordCount,
  getMedicalRecordList,
} from "../../services/medicalRecord";
import { useToast } from "../../configs/ToastConfig";
import MedicalStatsCommonFilterComponent from "../../components/medical_record/MedicalStatsCommonFilterComponent";
import Config from "../../configs/Config";
import CommonSpeciesCard from "../../components/CommonSpeciesCard";

const MedicalActiveCloseScreen = (props) => {
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const navigation = useNavigation();
  const permission = useSelector((state) => state.UserAuth.permission);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = style(constThemeColor);

  const [Loading, setLoading] = useState(false);
  const [statsCount, setStatsCount] = useState("");
  const [screenType, setScreenType] = useState("Active");
  const [diagnosisStatsCount, setDiagnosisStatsCount] = useState("");

  // for Active diagnosis
  const [activeDiagnosis, setActiveDiagnosis] = useState([]);
  const [activeDiagnosisLength, setActiveDiagnosisLength] = useState(0);
  const [activeDiagnosisCount, setActiveDiagnosisCount] = useState(0);
  const [activePage, setActivePage] = useState(0);

  // for Active closed
  const [closeDiagnosis, setCloseDiagnosis] = useState([]);
  const [closeDiagnosisLength, setCloseDiagnosisLength] = useState(0);
  const [closeDiagnosisCount, setCloseDiagnosisCount] = useState(0);
  const [closePage, setClosePage] = useState(0);

  const [species_id] = useState(props?.route?.params?.species_id);

  //Toggle tab
  const toggleTab = (data) => {
    setScreenType(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchDiagnosisStats();

      if (screenType == "Active") {
        setLoading(true);
        setActivePage(1);
        fetchDiagnosisActiveData(1);
      } else if (screenType == "Closed") {
        setLoading(true);
        setClosePage(1);
        fetchDiagnosisCloseData(1);
      }

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation, screenType])
  );

  const fetchDiagnosisStats = () => {
    let obj = {
      medical: "diagnosis",
      ref_type: "species",
      ref_id: props?.route?.params?.diagnosis_id,
    };
    if (species_id) {
      obj["species_id"] = species_id;
    }
    getMedicalRecordCount(obj)
      .then((res) => {
        setDiagnosisStatsCount(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchDiagnosisActiveData = (pageNo) => {
    let obj = {
      medical: "diagnosis",
      ref_id: props?.route?.params?.diagnosis_id,
      ref_type: "active",
      page_no: pageNo,
    };
    if (species_id) {
      obj["species_id"] = species_id;
    }
    getMedicalRecordList(obj)
      .then((res) => {
        if (res?.success) {
          let arrData = pageNo == 1 ? [] : activeDiagnosis;

          setActiveDiagnosisCount(
            res?.data?.count == undefined ? 0 : res?.data?.count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setActiveDiagnosis(arrData);
            setActiveDiagnosisLength(arrData?.length);

            setLoading(false);
          }
        } else {
          setActiveDiagnosisLength(activeDiagnosisCount);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLoadMoreActive = () => {
    if (
      !Loading &&
      activeDiagnosisLength >= 10 &&
      activeDiagnosisLength !== activeDiagnosisCount
    ) {
      const nextPage = activePage + 1;
      setActivePage(nextPage);
      fetchDiagnosisActiveData(nextPage);
    }
  };

  const renderFooterActive = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      activeDiagnosisLength == 0 ||
      activeDiagnosisLength < 10 ||
      activeDiagnosisLength == activeDiagnosisCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  const fetchDiagnosisCloseData = (pageNo) => {
    let obj = {
      medical: "diagnosis",
      ref_id: props?.route?.params?.diagnosis_id,
      ref_type: "closed",
      page_no: pageNo,
    };
    if (species_id) {
      obj["species_id"] = species_id;
    }
    getMedicalRecordList(obj)
      .then((res) => {
        if (res?.success) {
          let arrData = pageNo == 1 ? [] : closeDiagnosis;

          setCloseDiagnosisCount(
            res?.data?.count == undefined ? 0 : res?.data?.count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setCloseDiagnosis(arrData);
            setCloseDiagnosisLength(arrData?.length);

            setLoading(false);
          }
        } else {
          setCloseDiagnosisLength(closeDiagnosisCount);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLoadMoreClosed = () => {
    if (
      !Loading &&
      closeDiagnosisLength >= 10 &&
      closeDiagnosisLength !== closeDiagnosisCount
    ) {
      const nextPage = closePage + 1;
      setClosePage(nextPage);
      fetchDiagnosisCloseData(nextPage);
    }
  };

  const renderFooterClosed = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      closeDiagnosisLength == 0 ||
      closeDiagnosisLength < 10 ||
      closeDiagnosisLength == closeDiagnosisCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  return (
    <View style={reduxColors.container}>
      <HeaderWithSearch
        noIcon={true}
        title={props?.route?.params?.title}
        search={false}
        titlePaddingHorizontal={Spacing.mini}
        backgroundColor={constThemeColor?.secondaryContainer}
      />
      <Loader visible={Loading} />
      <View style={reduxColors.body}>
        {species_id && (
          <CommonSpeciesCard
            icon={props?.route?.params?.icon}
            SpeciesName={props?.route?.params?.SpeciesName}
            complete_name={props?.route?.params?.complete_name}
          />
        )}
        {/* stats card */}

        {props.route.params?.resolvedDiagnois !== "Resolved Diagnosis" && (
          <MedicalStatsCommonFilterComponent
            screenType={screenType}
            leftTitle={"Active"}
            rightTitle={"Closed"}
            leftStatsCount={diagnosisStatsCount?.active ?? "0"}
            rightStatsCount={diagnosisStatsCount?.closed ?? "0"}
            onTogglePress={toggleTab}
            isDateFilter={false}
          />
        )}
        <View
          style={{
            flex: 1,
            paddingHorizontal: Spacing.micro,
            marginTop: Spacing.small,
          }}
        >
          {screenType == "Active" ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={activeDiagnosis}
              renderItem={({ item }) => <MedicalListCard item={item} />}
              keyExtractor={(i, index) => index.toString()}
              onEndReached={handleLoadMoreActive}
              onEndReachedThreshold={0.4}
              ListFooterComponent={renderFooterActive}
              ListEmptyComponent={
                <ListEmpty height={"50%"} visible={Loading} />
              }
            />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={closeDiagnosis}
              renderItem={({ item }) => {
                return (
                  <>
                    <MedicalListCard item={item} />
                  </>
                );
              }}
              keyExtractor={(i, index) => index.toString()}
              onEndReached={handleLoadMoreClosed}
              onEndReachedThreshold={0.4}
              ListFooterComponent={renderFooterClosed}
              ListEmptyComponent={
                <ListEmpty height={"50%"} visible={Loading} />
              }
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default MedicalActiveCloseScreen;

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors?.secondaryContainer,
    },
    body: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
    },
    statsCard: {
      backgroundColor: reduxColors.surface,
      borderRadius: Spacing.small + Spacing.mini,
      paddingTop: Spacing.minor,
      paddingHorizontal: Spacing.major,
      marginVertical: Spacing.minor,
    },
    countStyle: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.onTertiaryContainer,
      textAlign: "center",
    },
    countText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onErrorContainer,
      marginBottom: Spacing.small,
      textAlign: "center",
    },
    speciesCard: {
      backgroundColor: opacityColor(reduxColors.surfaceDisabled, 10),
      flexDirection: "row",
      borderWidth: 1,
      borderColor: opacityColor(reduxColors?.outlineVariant, 5),
      borderRadius: Spacing.small,
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.minor,
      marginTop: Spacing.minor,
    },
  });
