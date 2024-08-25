import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ListEmpty from "../../components/ListEmpty";
import HeaderWithSearch from "../../components/HeaderWithSearch";
import CustomCard from "../../components/CustomCard";
import Spacing from "../../configs/Spacing";
import Loader from "../../components/Loader";
import FontSize from "../../configs/FontSize";
import SpeciesCustomCard from "../../components/SpeciesCustomCard";
import { useToast } from "../../configs/ToastConfig";
import {
  getMedicalRecordCount,
  getMedicalRecordList,
} from "../../services/medicalRecord";
import { ActivityIndicator } from "react-native-paper";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import moment from "moment";
import { FilterMaster } from "../../configs/Config";
import MedicalStatsCommonFilterComponent from "../../components/medical_record/MedicalStatsCommonFilterComponent";

const DiagnoisiScreen = (props) => {
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [Loading, setLoading] = useState(false);
  const [screenType, setScreenType] = useState("Species");

  const [diagnosisStatsCount, setDiagnosisStatsCount] = useState("");

  //for species
  const [diagnosisSpecies, setDiagnosisSpecies] = useState([]);
  const [diagnosisSpeciesLength, setDiagnosisSpeciesLength] = useState(0);
  const [diagnosisSpeciesCount, setDiagnosisSpeciesCount] = useState(0);
  const [diagnosisSpeciesPage, setDiagnosisSpeciesPage] = useState(0);

  //for diagnosis
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [diagnosisLength, setDiagnosisLength] = useState(0);
  const [diagnosisCount, setDiagnosisCount] = useState(0);
  const [diagnosisPage, setDiagnosisPage] = useState(0);

  const [status] = useState(props?.route?.params?.status);
  const [siteId] = useState(props?.route?.params?.siteId);
  const [sectionId] = useState(props?.route?.params?.sectionId);
  const [enclosureId] = useState(props?.route?.params?.enclosureId);
  const [speciesId] = useState(props?.route?.params?.speciesId);

  const [selectedCheckBox, setselectedCheckBox] = useState(
    props?.route?.params?.selectDropID ?? ""
  );

  const [selectDrop, setSelectDrop] = useState(
    props?.route?.params?.selectedFilterValue ?? "All time data"
  );

  // for this months start date
  const dateFormat = "YYYY-MM-DD";
  var currentDate = new Date();

  var end_date = moment(currentDate).format(dateFormat);

  const [startDate, setStartDate] = useState(
    props?.route?.params?.startDate ?? null
  );
  const [endDate, setEndDate] = useState(
    props?.route?.params?.endDate ?? end_date
  );

  /*****set date and update the count*****/
  const setDates = (s, e, item) => {
    setStartDate(s);
    setEndDate(e);
    setSelectDrop(item);
  };

  //Toggle tab
  const toggleTab = (data) => {
    setScreenType(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchMedicalDiagnosisStats();

      if (screenType == "Species") {
        setLoading(true);
        setDiagnosisSpeciesPage(1);
        fetchSpeciesData(1);
      } else if (screenType == "By Diagnosis") {
        setLoading(true);
        setDiagnosisPage(1);
        fetchDiagnosisData(1);
      }

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation, screenType, endDate, startDate])
  );

  const fetchMedicalDiagnosisStats = () => {
    let obj = {
      medical: "diagnosis",
      ref_type: "diagnosis",
      start_date: startDate ?? "",
      end_date: endDate ?? "",
    };
    if (status == "active" || status == "closed") {
      obj["status"] = status;
    }
    if (siteId) {
      obj["site_id"] = siteId;
    }

    if (sectionId) {
      obj["section_id"] = sectionId;
    }

    if (enclosureId) {
      obj["enclosure_id"] = enclosureId;
    }

    if (speciesId) {
      obj["species_id"] = speciesId;
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

  const fetchSpeciesData = (pageNo) => {
    let obj = {
      medical: "diagnosis",
      ref_type: "species",
      start_date: startDate ?? "",
      end_date: endDate ?? "",
      page_no: pageNo,
    };
    if (status == "active" || status == "closed") {
      obj["status"] = status;
    }
    if (siteId) {
      obj["site_id"] = siteId;
    }

    if (sectionId) {
      obj["section_id"] = sectionId;
    }

    if (enclosureId) {
      obj["enclosure_id"] = enclosureId;
    }

    if (speciesId) {
      obj["species_id"] = speciesId;
    }

    getMedicalRecordList(obj)
      .then((res) => {
        if (res?.success) {
          let arrData = pageNo == 1 ? [] : diagnosisSpecies;

          setDiagnosisSpeciesCount(
            res?.data?.count == undefined ? 0 : res?.data?.count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setDiagnosisSpecies(arrData);
            setDiagnosisSpeciesLength(arrData?.length);

            setLoading(false);
          }
        } else {
          setDiagnosisSpeciesLength(diagnosisSpeciesCount);
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

  const handleLoadMoreSpecies = () => {
    if (
      !Loading &&
      diagnosisSpeciesLength >= 10 &&
      diagnosisSpeciesLength !== diagnosisSpeciesCount
    ) {
      const nextPage = diagnosisSpeciesPage + 1;
      setDiagnosisSpeciesPage(nextPage);
      fetchSpeciesData(nextPage);
    }
  };

  const renderFooterSpecies = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      diagnosisSpeciesLength == 0 ||
      diagnosisSpeciesLength < 10 ||
      diagnosisSpeciesLength == diagnosisSpeciesCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  const fetchDiagnosisData = (pageNo) => {
    let obj = {
      medical: "diagnosis",
      ref_type: "by_diagonosis",
      start_date: startDate ?? "",
      end_date: endDate ?? "",
      page_no: pageNo,
    };
    if (status == "active" || status == "closed") {
      obj["status"] = status;
    }

    if (siteId) {
      obj["site_id"] = siteId;
    }

    if (sectionId) {
      obj["section_id"] = sectionId;
    }

    if (enclosureId) {
      obj["enclosure_id"] = enclosureId;
    }

    if (speciesId) {
      obj["species_id"] = speciesId;
    }

    getMedicalRecordList(obj)
      .then((res) => {
        if (res?.success) {
          let arrData = pageNo == 1 ? [] : diagnosisData;

          setDiagnosisCount(
            res?.data?.count == undefined ? 0 : res?.data?.count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setDiagnosisData(arrData);
            setDiagnosisLength(arrData?.length);

            setLoading(false);
          }
        } else {
          setDiagnosisLength(diagnosisCount);
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

  const handleLoadMoreDiagnosis = () => {
    if (
      !Loading &&
      diagnosisLength >= 10 &&
      diagnosisLength !== diagnosisCount
    ) {
      const nextPage = diagnosisPage + 1;
      setDiagnosisPage(nextPage);
      fetchDiagnosisData(nextPage);
    }
  };

  const renderFooterDiagnosis = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      diagnosisLength == 0 ||
      diagnosisLength < 10 ||
      diagnosisLength == diagnosisCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  return (
    <View style={reduxColors.container}>
      <HeaderWithSearch
        noIcon={true}
        title={"Diagnosis"}
        search={false}
        titlePaddingHorizontal={Spacing.mini}
        backgroundColor={constThemeColor?.secondaryContainer}
      />
      <Loader visible={Loading} />
      <View style={reduxColors.body}>
        {/* date filter */}

        <MedicalStatsCommonFilterComponent
          screenType={screenType}
          leftTitle={"Species"}
          rightTitle={"By Diagnosis"}
          leftStatsCount={diagnosisStatsCount?.species ?? "0"}
          rightStatsCount={diagnosisStatsCount?.by_diagonosis ?? "0"}
          isDateFilter={true} // if you wants to date filter then pass to all bottom props
          onTogglePress={toggleTab}
          selectedFilterValue={selectDrop}
          selectDropID={selectedCheckBox}
          setDates={setDates}
        />

        {/* <View style={reduxColors.statsCard}>

          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              alignItems: "center",
              paddingVertical: Spacing.small,
            }}
          >
            <ModalTitleData
              selectDrop={selectDrop ?? "All time data"}
              toggleModal={toggleDateModal}
              selectDropStyle={[
                FontSize.Antz_Subtext_Regular,
                { color: constThemeColor.onTertiaryContainer },
              ]}
              filterIconStyle={{ marginLeft: Spacing.mini }}
              filterIconcolor={{ color: constThemeColor.onTertiaryContainer }}
              filterIcon={true}
              size={20}
              isFromInsights={true}
            />
            {medicalInshightModal ? (
              <ModalFilterComponent
                onPress={toggleDateModal}
                onDismiss={closeDateModal}
                onBackdropPress={closeDateModal}
                onRequestClose={closeDateModal}
                data={FilterMaster}
                closeModal={closeMenu}
                title="Filter By"
                style={{ alignItems: "flex-start" }}
                isSelectedId={isSelectedId}
                radioButton={true}
              />
            ) : null}
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
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
                <Text style={reduxColors?.countStyle}>
                  {diagnosisStatsCount?.species ?? "0"}
                </Text>
                <Text style={reduxColors?.countText}>Species</Text>
              </View>

              <View
                style={[
                  {
                    height: 6,
                    width: 80,
                    borderTopLeftRadius: Spacing.small,
                    borderTopRightRadius: Spacing.small,
                    backgroundColor:
                      screenType == "species"
                        ? constThemeColor.primary
                        : "transparent",
                  },
                ]}
              ></View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleTab("diagnosis")}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: Spacing.small + Spacing.micro,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={reduxColors.countStyle}>
                  {diagnosisStatsCount?.by_diagonosis ?? "0"}
                </Text>
                <Text style={reduxColors?.countText}>By Diagnosis</Text>
              </View>

              <View
                style={[
                  {
                    height: 6,
                    width: 100,
                    borderTopLeftRadius: Spacing.small,
                    borderTopRightRadius: Spacing.small,
                    backgroundColor:
                      screenType == "diagnosis"
                        ? constThemeColor.primary
                        : "transparent",
                  },
                ]}
              ></View>
            </TouchableOpacity>
          </View>
        </View> */}

        <View
          style={{
            marginVertical: Spacing.small,
            flex: 1,
          }}
        >
          {screenType == "Species" && (
            <SpeciesList
              speciesData={diagnosisSpecies}
              resetData={true}
              navigation={navigation}
              status={status}
              handleLoadMoreSpecies={handleLoadMoreSpecies}
              renderFooterSpecies={renderFooterSpecies}
              Loading={Loading}
            />
          )}

          {screenType == "By Diagnosis" && (
            <DiagnosisList
              diagnosisData={diagnosisData}
              navigation={navigation}
              status={status}
              handleLoadMoreDiagnosis={handleLoadMoreDiagnosis}
              renderFooterDiagnosis={renderFooterDiagnosis}
              Loading={Loading}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default DiagnoisiScreen;

const SpeciesList = ({
  speciesData,
  navigation,
  status,
  handleLoadMoreSpecies,
  renderFooterSpecies,
  Loading,
}) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={speciesData}
      renderItem={({ item }) => {
        return (
          <>
            <SpeciesCustomCard
              icon={item.default_icon}
              animalName={item.scientific_name ? item?.scientific_name : "NA"}
              complete_name={item.common_name ? item.common_name : "NA"}
              tags={item.sex_data}
              count={item.total}
              onPress={() =>
                navigation.navigate("BySpeciesList", {
                  specie_id: item?.specie_id,
                  title: "Diagnosis",
                  icon: item.default_icon,
                  SpeciesName: item.scientific_name
                    ? item?.scientific_name
                    : "NA",

                  complete_name: item.common_name ? item.common_name : "NA",
                  status,
                })
              }
            />
          </>
        );
      }}
      keyExtractor={(i, index) => index.toString()}
      onEndReached={handleLoadMoreSpecies}
      onEndReachedThreshold={0.4}
      ListFooterComponent={renderFooterSpecies}
      ListEmptyComponent={<ListEmpty height={"50%"} visible={Loading} />}
    />
  );
};

const DiagnosisList = ({
  diagnosisData,
  navigation,
  status,
  handleLoadMoreDiagnosis,
  renderFooterDiagnosis,
  Loading,
}) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={diagnosisData}
      renderItem={({ item }) => {
        return (
          <>
            <CustomCard
              title={item?.label}
              count={item?.medical_count}
              onPress={() => {
                navigation.navigate("MedicalActiveCloseScreen", {
                  diagnosis_id: item?.diagnosis_type,
                  title: item?.label,
                  total_diagnosis: item?.medical_count,
                  // species_id: props?.route?.params?.specie_id,
                  status,
                });
              }}
            />
          </>
        );
      }}
      keyExtractor={(i, index) => index.toString()}
      onEndReached={handleLoadMoreDiagnosis}
      onEndReachedThreshold={0.4}
      ListFooterComponent={renderFooterDiagnosis}
      ListEmptyComponent={<ListEmpty height={"50%"} visible={Loading} />}
    />
  );
};

const styles = (reduxColors) =>
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
      borderRadius: Spacing.body,
      paddingTop: Spacing.minor,
      paddingHorizontal: Spacing.minor,
      marginTop: Spacing.body,
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
  });
