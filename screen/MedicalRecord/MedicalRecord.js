import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import MedicalStats from "../../components/MedicalStats";
import CustomCard from "../../components/CustomCard";
import { FlatList } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  getMedicalCount,
  getFilterData,
  getMedicalListData,
  getMedicalRecordCount,
} from "../../services/medicalRecord";
import svg_med_diagnosis from "../../assets/Med_Diagnosis.svg";
import svg_med_records from "../../assets/clinical_notes.svg";
import svg_med_prescription from "../../assets/Med_Prescription.svg";
import svg_med_lab from "../../assets/Med_Lab.svg";
import svg_med_suite from "../../assets/individual_suite.svg";
import svg_med_surgical from "../../assets/surgical.svg";
import { useSelector } from "react-redux";
import { errorToast } from "../../utils/Alert";
import Constants from "../../configs/Constants";
import Spacing from "../../configs/Spacing";
import { getAsyncData } from "../../utils/AsyncStorageHelper";
import MedicalRecordCardComponent from "../../components/MedicalRecordCardComponent";
import { FilterMaster } from "../../configs/Config";
import moment from "moment";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const MedicalRecord = (props) => {
  const navigation = useNavigation();
  const [Loading, setLoading] = useState(false);
  const [countData, setCountData] = useState({});

  const [isHideStats, setIsHideStats] = useState(null);
  // const [filterData, setFilterData] = useState({});
  // const [medicalListData, setMedicalListData] = useState({});

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const reduxColors = styles(constThemeColor);
  const [status, setStatus] = useState("active");

  const [optionData, setOptionData] = useState([
    {
      id: 1,
      option: <Text>{"  "} All Data</Text>,
      type: "allData",
    },
    {
      id: 2,
      option: (
        <Text>
          {/* {status == "active" && (
            <MaterialCommunityIcons
              name="check-bold"
              size={24}
              color={constThemeColor.primary}
            />
          )} */}
          {"  "}Active
        </Text>
      ),
      type: "active",
    },
    {
      id: 3,
      option: (
        <Text>
          {/* {status == "closed" && (
            <MaterialCommunityIcons
              name="check-bold"
              size={24}
              color={constThemeColor.primary}
            />
          )} */}
          {"  "}Closed
        </Text>
      ),
      type: "closed",
    },
  ]);

  const [medicalStatsCount, setMedicalStatsCount] = useState("");

  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  // *****this is for mortality filter count update*****/
  const [selectDropValue, setSelectDropValue] = useState("Last 6 Months");
  // for this months start date
  const dateFormat = "YYYY-MM-DD";
  var currentDate = new Date();

  var end_date = moment(currentDate).format(dateFormat);
  const Last6Months = moment(currentDate)
    .subtract(6, "months")
    .format(dateFormat);

  const [startDate, setStartDate] = useState(Last6Months);
  const [endDate, setEndDate] = useState(end_date);

  /*****set date and update the count*****/
  const setDates = (s, e, item) => {
    setStartDate(s);
    setEndDate(e);
    setSelectDropValue(item);
  };

  function findIdByName(nameToFind, dataArray) {
    const result = dataArray.find((item) => item.name === nameToFind);
    return result ? result.id?.toString() : null;
  }
  const selectDropID = findIdByName(selectDropValue, FilterMaster);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setLoading(true);
  //     loadData();
  //     medicalDateFilterStats();
  //     return () => {
  //       // Clean up the effect when the screen is unfocused (if necessary)
  //     };
  //   }, [navigation, startDate, endDate, status])
  // );

  useFocusEffect(
    useCallback(() => {
      getHideStatsValue();
    }, [])
  );

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };

  // useEffect(() => {
  //   const subscribe = navigation.addListener("focus", () => {
  //     loadData();
  //     // medicalDetailsListData();
  //     medicalDateFilterStats();
  //   });
  //   return subscribe;
  // }, [navigation]);

  // const loadData = () => {
  //   setLoading(true);
  //   getMedicalCount({ zoo_id: zooID })
  //     .then((res) => {
  //       setCountData(res.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       errorToast("Oops!", "Something went wrong!!");
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   getFilterStatus("this-month");
  // }, []);

  // const getFilterStatus = (value) => {
  //   let reqObj = {
  //     value: value,
  //     zoo_id: zooID,
  //   };
  //   setLoading(true);
  //   getFilterData(reqObj)
  //     .then((res) => {
  //       setFilterData(res.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       errorToast("Oops!", "Something went wrong!!");
  //       setLoading(false);
  //     });
  // };

  // const medicalDetailsListData = () => {
  //   setLoading(true);
  //   getMedicalListData({ zoo_id: zooID })
  //     .then((res) => {
  //       setMedicalListData(res.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       errorToast("Oops!", "Something went wrong!!");
  //       setLoading(false);
  //     });
  // };

  // const medicalDateFilterStats = () => {
  //   let obj = {
  //     medical: "zoo",
  //     start_date: startDate ?? "",
  //     end_date: endDate ?? "",
  //   };
  //   if (status == "closed" || status == "active") {
  //     obj["status"] = status;
  //   }
  //   // if (status == "allData") {
  //   //   delete obj["status"];
  //   // }
  //   getMedicalRecordCount(obj)
  //     .then((res) => {
  //       setMedicalStatsCount(res?.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       errorToast("error", "Oops! Something went wrong!");
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  const optionPress = (item) => {
    if (item?.type == "active") {
      setStatus(item.type);
    } else if (item?.type == "closed") {
      setStatus(item.type);
    } else {
      setStatus(item.type);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: constThemeColor.surfaceVariant,
      }}
    >
      <Loader visible={Loading} />
      <Header
        title="Medical"
        noIcon={true}
        // search={true}
        // gotoSearchPage={() => navigation.navigate("InsightSearching")}
        // style={{
        //   paddingBottom: widthPercentageToDP("3%"),
        //   paddingTop: widthPercentageToDP("2%"),
        // }}
      />

      <ScrollView
        style={{ marginHorizontal: Spacing.minor }}
        showsVerticalScrollIndicator={false}
      >
        <MedicalRecordCardComponent
          isMedicalTopStats={true}
          MedicalStatsTopCount={countData}
          medicalStatsCount={medicalStatsCount}
          setDates={setDates}
          selectedFilterValue={selectDropValue}
          selectDropID={selectDropID}
          optionData={optionData}
          optionPress={optionPress}
          startDate={startDate}
          endDate={endDate}
          status={status}
        />

        {/* {!isHideStats &&
          <View style={{ marginVertical: Spacing.body }}>
            <MedicalStats
              title={"Medical Stats"}
              // subtitle={"Last Updated Today 7:00 AM"}
              item={countData}
            // filterData={getFilterStatus}
            // filterDataStatus={filterData}
            />
          </View>
        } */}

        {/* <View style={{}}>
          <CustomCard
            routeName={props.route?.name}
            title={"Medical Records"}
            svgXML={true}
            svgXMLData={svg_med_records}
            onPress={() => navigation.navigate("MedicalRecordList")}
            // count={medicalListData.medical_records}
            style={{ height: 60 }}
          />
        </View>

        <View style={{}}>
          <CustomCard
            routeName={props.route?.name}
            title={"Active Diagnosis"}
            svgXML={true}
            svgXMLData={svg_med_diagnosis}
            // onPress={() => navigation.navigate("ActiveDiagnosis")}
            onPress={() =>
              navigation.navigate("MedicalRecordList", {  //DiagnoisiScreen
                filter_label_name:
                  Constants.MEDICAL_RECORD_FILTER_LABEL.ACTIVE_DIAGNOSIS,
                filter_value:
                  Constants.MEDICAL_RECORD_FILTER_LABEL_VALUE.ACTIVE_DIAGNOSIS,
              })
            }
            // count={medicalListData.active_diagnosis}
            style={{ height: 60 }}
          />
        </View>

        <View style={{}}>
          <CustomCard
            routeName={props.route?.name}
            title={"Active Prescriptions"}
            svgXML={true}
            svgXMLData={svg_med_prescription}
            // onPress={() => navigation.navigate("Prescriptions")}
            onPress={() =>
              navigation.navigate("MedicalRecordList", {
                filter_label_name:
                  Constants.MEDICAL_RECORD_FILTER_LABEL.ACTIVE_PRESCRIPTIONS,
                filter_value:
                  Constants.MEDICAL_RECORD_FILTER_LABEL_VALUE
                    .ACTIVE_PRESCRIPTIONS,
              })
            }
            // count={medicalListData.prescriptions}
            style={{ height: 60 }}
          />
        </View> */}

        {/* <View style={{}}>
          <CustomCard
            routeName={props.route?.name}
            title={"Lab Tests "}
            svgXML={true}
            svgXMLData={svg_med_lab}
            onPress={() => navigation.navigate("LabTests")}
            count={medicalListData.tests}
            style={{ height: 60 }}
          />
        </View>

        <View style={{}}>
          <CustomCard
            routeName={props.route?.name}
            title={"Anesthesia"}
            svgXML={true}
            svgXMLData={svg_med_suite}
            // onPress={{}}
            count={medicalListData.anesthesia}
            style={{ height: 60 }}
          />
        </View>

        <View style={{}}>
          <CustomCard
            routeName={props.route?.name}
            title={"Necropsy"}
            svgXML={true}
            svgXMLData={svg_med_surgical}
            // onPress={{}}
            count={medicalListData.necropsy}
            style={{ height: 60 }}
          />
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default MedicalRecord;
