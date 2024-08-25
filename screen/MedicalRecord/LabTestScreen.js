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
import moment from "moment";
import MedicalStatsCommonFilterComponent from "../../components/medical_record/MedicalStatsCommonFilterComponent";

const LabTestScreen = (props) => {
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [Loading, setLoading] = useState(false);
  const [screenType, setScreenType] = useState("Species");

  const [labStatsCount, setLabStatsCount] = useState("");

  //for species setLabTestSpeciesLength
  const [labTestSpecies, setLabTestSpecies] = useState([]);
  const [labTestSpeciesLength, setLabTestSpeciesLength] = useState(0);
  const [labTestSpeciesCount, setLabTestSpeciesCount] = useState(0);
  const [labTestSpeciesPage, setLabTestSpeciesPage] = useState(0);

  //for lab test
  const [labTestData, setLabTestData] = useState([]);
  const [labTestLength, setLabTestLength] = useState(0);
  const [labTestCount, setLabTestCount] = useState(0);
  const [labTestPage, setLabTestPage] = useState(0);

  const [status] = useState(props?.route?.params?.status);
  const [siteId] = useState(props?.route?.params?.siteId);
  const [sectionId] = useState(props?.route?.params?.sectionId);
  const [enclosureId] = useState(props?.route?.params?.enclosureId);
  const [speciesId] = useState(props?.route?.params?.speciesId);

  const [selectedCheckBox, setselectedCheckBox] = useState(
    props?.route?.params?.selectDropID ?? ""
  );
  // const [medicalInshightModal, setMedicalInshightModal] = useState(false);

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
      fetchMedicalLabTestStats();

      if (screenType == "Species") {
        setLoading(true);
        setLabTestSpeciesPage(1);
        fetchSpeciesData(1);
      } else if (screenType == "By Tests") {
        setLoading(true);
        setLabTestPage(1);
        fetchLabTestData(1);
      }

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation, screenType, endDate, startDate])
  );
  const fetchMedicalLabTestStats = () => {
    let obj = {
      medical: "lab",
      ref_type: "lab",
      start_date: startDate ?? "",
      end_date: endDate ?? "",
    };
    // if (status == "active" || status == "closed") {
    //   obj["status"] = status;
    // }
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
        setLabStatsCount(res?.data);
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
      medical: "lab",
      ref_type: "species",
      start_date: startDate ?? "",
      end_date: endDate ?? "",
      page_no: pageNo,
    };
    // if (status == "active" || status == "closed") {
    //   obj["status"] = status;
    // }
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
          let arrData = pageNo == 1 ? [] : labTestSpecies;

          setLabTestSpeciesCount(
            res?.data?.count == undefined ? 0 : res?.data?.count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setLabTestSpecies(arrData);
            setLabTestSpeciesLength(arrData?.length);

            setLoading(false);
          }
        } else {
          setLabTestSpeciesLength(labTestSpeciesCount);
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
      labTestSpeciesLength >= 10 &&
      labTestSpeciesLength !== labTestSpeciesCount
    ) {
      const nextPage = labTestSpeciesPage + 1;
      setLabTestSpeciesPage(nextPage);
      fetchSpeciesData(nextPage);
    }
  };

  const renderFooterSpecies = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      labTestSpeciesLength == 0 ||
      labTestSpeciesLength < 10 ||
      labTestSpeciesLength == labTestSpeciesCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  const fetchLabTestData = (pageNo) => {
    let obj = {
      medical: "lab",
      ref_type: "by_test",
      start_date: startDate ?? "",
      end_date: endDate ?? "",
      page_no: pageNo,
    };
    // if (status == "active" || status == "closed") {
    //   obj["status"] = status;
    // }

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
          let arrData = pageNo == 1 ? [] : labTestData;

          setLabTestCount(res?.data?.count == undefined ? 0 : res?.data?.count);
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setLabTestData(arrData);
            setLabTestLength(arrData?.length);

            setLoading(false);
          }
        } else {
          setLabTestLength(labTestCount);
        }
      })
      .catch((err) => {
        console.log("err==>", err);
        setLoading(false);
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLoadMoreLab = () => {
    if (!Loading && labTestLength >= 10 && labTestLength !== labTestCount) {
      const nextPage = labTestPage + 1;
      setLabTestPage(nextPage);
      fetchLabTestData(nextPage);
    }
  };

  const renderFooterLab = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      labTestLength == 0 ||
      labTestLength < 10 ||
      labTestLength == labTestCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  return (
    <>
      <View style={reduxColors.container}>
        <HeaderWithSearch
          noIcon={true}
          title={"Lab Tests"}
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
            rightTitle={"By Tests"}
            leftStatsCount={labStatsCount?.species ?? "0"}
            rightStatsCount={labStatsCount?.by_test ?? "0"}
            isDateFilter={true} // if you wants to date filter then pass to all bottom props
            onTogglePress={toggleTab}
            selectedFilterValue={selectDrop}
            selectDropID={selectedCheckBox}
            setDates={setDates}
          />
          <View
            style={{
              marginVertical: Spacing.small,
              flex: 1,
            }}
          >
            {screenType == "Species" && (
              <SpeciesList
                labTestSpecies={labTestSpecies}
                resetData={true}
                navigation={navigation}
                status={status}
                handleLoadMoreSpecies={handleLoadMoreSpecies}
                renderFooterSpecies={renderFooterSpecies}
                Loading={Loading}
              />
            )}

            {screenType == "By Tests" && (
              <LabList
                labTestData={labTestData}
                navigation={navigation}
                status={status}
                handleLoadMoreLab={handleLoadMoreLab}
                renderFooterLab={renderFooterLab}
                Loading={Loading}
              />
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default LabTestScreen;

const SpeciesList = ({
  labTestSpecies,
  navigation,
  status,
  handleLoadMoreSpecies,
  renderFooterSpecies,
  Loading,
}) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={labTestSpecies}
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
                navigation.navigate("BySpeciesLabTestList", {
                  specie_id: item?.specie_id,
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

const LabList = ({
  labTestData,
  navigation,
  status,
  handleLoadMoreLab,
  renderFooterLab,
  Loading,
}) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={labTestData}
      renderItem={({ item }) => {
        return (
          <>
            <CustomCard
              title={item?.label}
              count={item?.medical_count}
              onPress={() => {
                navigation.navigate("ByMedicalLabTestAnimals", {
                  test_id: item?.test_id,
                  test_name: item?.label,
                  medical_count: item?.medical_count,
                  // species_id: props?.route?.params?.specie_id,
                  status,
                });
              }}
            />
          </>
        );
      }}
      keyExtractor={(i, index) => index.toString()}
      onEndReached={handleLoadMoreLab}
      onEndReachedThreshold={0.4}
      ListFooterComponent={renderFooterLab}
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

{
  /* <MedicalCommonRecordListCard title={"Lab Test"} /> */
}
