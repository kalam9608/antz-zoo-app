import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAsyncData } from "../utils/AsyncStorageHelper";
import Constants from "../configs/Constants";
import Spacing from "../configs/Spacing";
import MedicalStats from "./MedicalStats";
import CustomCard from "./CustomCard";
import { getMedicalCount } from "../services/medicalRecord";
import MedicalFilterStats from "./MedicalFilterStats";

import svg_med_diagnosis from "../assets/Med_Diagnosis.svg";
import svg_med_records from "../assets/clinical_notes.svg";
import svg_med_prescription from "../assets/Med_Prescription.svg";
import svg_med_lab from "../assets/Med_Lab.svg";

const MedicalRecordCardComponent = ({
  isMedicalTopStats,
  MedicalStatsTopCount,
  medicalStatsCount,
  setDates,
  selectedFilterValue,
  selectDropID,
  startDate,
  endDate,
  optionData,
  optionPress,
  status,
  siteId,
  sectionId,
  enclosureId,
  speciesId,
  ...props
}) => {
  const navigation = useNavigation();
  const [isHideStats, setIsHideStats] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getHideStatsValue();
    }, [])
  );

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: constThemeColor.surfaceVariant,
      }}
    >
      {/* {!isHideStats && (
        <View style={{ marginVertical: Spacing.body }}>
          {isMedicalTopStats && (
            <MedicalStats
              title={"Medical Stats"}
              // subtitle={"Last Updated Today 7:00 AM"}
              item={MedicalStatsTopCount}
              // filterData={getFilterStatus}
              // filterDataStatus={filterData}
              optionData={optionData}
              optionPress={optionPress}
              status={status}
            />
          )}
          <MedicalFilterStats
            isMedicalTopStats={isMedicalTopStats}
            medicalStatsCount={medicalStatsCount}
            setDates={setDates}
            selectedFilterValue={selectedFilterValue}
            selectDropID={selectDropID}
            startDate={startDate}
            endDate={endDate}
            siteId={siteId}
            sectionId={sectionId}
            enclosureId={enclosureId}
            speciesId={speciesId}
          />
        </View>
      )} */}

      <View style={{}}>
        <CustomCard
          //   routeName={props?.name}
          title={"Medical Records"}
          svgXML={true}
          svgXMLData={svg_med_records}
          onPress={() =>
            navigation.navigate("MedicalRecordList", {
              status,
              siteId,
              sectionId,
              enclosureId,
              speciesId,
            })
          }
          style={{ height: 60 }}
        />
      </View>

      <View style={{}}>
        <CustomCard
          //   routeName={props?.name}
          title={"Diagnosis"}
          svgXML={true}
          svgXMLData={svg_med_diagnosis}
          onPress={() =>
            navigation.navigate("DiagnoisiScreen", {
              status,
              siteId,
              sectionId,
              enclosureId,
              speciesId,
              selectDropID,
              startDate,
              endDate,
              selectedFilterValue,
              filter_label_name:
                Constants.MEDICAL_RECORD_FILTER_LABEL.ACTIVE_DIAGNOSIS,
              filter_value:
                Constants.MEDICAL_RECORD_FILTER_LABEL_VALUE.ACTIVE_DIAGNOSIS,
            })
          }
          style={{ height: 60 }}
        />
      </View>

      {/* <View style={{}}>
        <CustomCard
          //   routeName={props?.name}
          title={"Prescriptions"}
          svgXML={true}
          svgXMLData={svg_med_prescription}
          onPress={() =>
            navigation.navigate("MedicalRecordList", {
              filter_label_name:
                Constants.MEDICAL_RECORD_FILTER_LABEL.ACTIVE_PRESCRIPTIONS,
              filter_value:
                Constants.MEDICAL_RECORD_FILTER_LABEL_VALUE
                  .ACTIVE_PRESCRIPTIONS,
            })
          }
          style={{ height: 60 }}
        />
      </View> */}

      <View>
        <CustomCard
          title={"Tests"}
          svgXML={true}
          svgXMLData={svg_med_lab}
          onPress={() =>
            navigation.navigate("LabTestScreen", {
              status,
              siteId,
              sectionId,
              enclosureId,
              speciesId,
              selectDropID,
              startDate,
              endDate,
              selectedFilterValue,
            })
          }
          style={{ height: 60 }}
        />
      </View>
    </View>
  );
};

export default MedicalRecordCardComponent;
