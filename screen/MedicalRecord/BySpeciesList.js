import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderWithSearch from "../../components/HeaderWithSearch";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import CustomCard from "../../components/CustomCard";
import Loader from "../../components/Loader";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import ImageComponent from "../../components/ImageComponent";
import ListEmpty from "../../components/ListEmpty";
import { opacityColor } from "../../utils/Utils";
import { getMedicalRecordList } from "../../services/medicalRecord";
import { useToast } from "../../configs/ToastConfig";
import Config from "../../configs/Config";
import CommonSpeciesCard from "../../components/CommonSpeciesCard";

const BySpeciesList = (props) => {
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = style(constThemeColor);
  const [Loading, setLoading] = useState(false);
  const [speciesDiagnosisList, setSpeciesDiagnosisList] = useState([]);
  const [speciesDiagnosisLength, setSpeciesDiagnosisLength] = useState(0);
  const [speciesDiagnosisCount, setSpeciesDiagnosisCount] = useState(0);
  const [page, setPage] = useState(0);

  const [status] = useState(props?.route?.params?.status);
  const [species_id] = useState(props?.route?.params?.specie_id);
  const [startDate] = useState(props?.route?.params?.startDate);
  const [endDate] = useState(props?.route?.params?.endDate);
  const [siteId] = useState(props?.route?.params?.siteId);
  const [sectionId] = useState(props?.route?.params?.sectionId);
  const [enclosureId] = useState(props?.route?.params?.enclosureId);
  const [speciesId] = useState(props?.route?.params?.speciesId);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setPage(1);
      fetchSpeciesData(1);
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation])
  );

  const fetchSpeciesData = (pageNo) => {
    let obj = {
      medical: "diagnosis",
      ref_type: "by_diagonosis",
      page_no: pageNo,
    };
    if (status == "active" || status == "closed") {
      obj["status"] = status;
    }
    if (species_id) {
      obj["species_id"] = species_id;
    }

    if (startDate || endDate) {
      obj["start_date"] = startDate;
      obj["end_date"] = endDate;
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
          let arrData = pageNo == 1 ? [] : speciesDiagnosisList;

          setSpeciesDiagnosisCount(
            res?.data?.count == undefined ? 0 : res?.data?.count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setSpeciesDiagnosisList(arrData);
            setSpeciesDiagnosisLength(arrData?.length);

            setLoading(false);
          }
        } else {
          setSpeciesDiagnosisCount(speciesDiagnosisCount);
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

  const handleLoadMoreSpecies = () => {
    if (
      !Loading &&
      speciesDiagnosisLength >= 10 &&
      speciesDiagnosisLength !== speciesDiagnosisCount
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSpeciesData(nextPage);
    }
  };

  const renderFooterSpecies = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      speciesDiagnosisLength == 0 ||
      speciesDiagnosisLength < 10 ||
      speciesDiagnosisLength == speciesDiagnosisCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  return (
    <View style={reduxColors.container}>
      <HeaderWithSearch
        noIcon={true}
        title={props.route.params?.title}
        search={false}
        titlePaddingHorizontal={Spacing.mini}
        backgroundColor={constThemeColor?.secondaryContainer}
      />
      <Loader visible={Loading} />
      <View style={reduxColors.body}>
        {props.route.params?.title !== "Resolved Diagnosis" && (
          <CommonSpeciesCard
            icon={props?.route?.params?.icon}
            SpeciesName={props?.route?.params?.SpeciesName}
            complete_name={props?.route?.params?.complete_name}
          />
        )}

        <View style={{ marginTop: Spacing.small }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={speciesDiagnosisList}
            renderItem={({ item }) => {
              return (
                <>
                  <CustomCard
                    title={item?.label}
                    count={item?.medical_count}
                    onPress={() =>
                      navigation.navigate("MedicalActiveCloseScreen", {
                        diagnosis_id: item?.diagnosis_type,
                        resolvedDiagnois: props?.route?.params?.title,
                        title: item?.label,
                        total_diagnosis: item?.medical_count,
                        species_id: props?.route?.params?.specie_id,
                        icon: props?.route?.params?.icon,
                        SpeciesName: props?.route?.params?.SpeciesName
                          ? props?.route?.params?.SpeciesName
                          : "NA",

                        complete_name: props?.route?.params?.complete_name
                          ? props?.route?.params?.complete_name
                          : "NA",
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
        </View>
      </View>
    </View>
  );
};

export default BySpeciesList;

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
    speciesCard: {
      backgroundColor: opacityColor(reduxColors.surfaceDisabled, 10),
      flexDirection: "row",
      borderWidth: 1,
      borderColor: opacityColor(reduxColors?.outlineVariant, 5),
      borderRadius: Spacing.small,
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.minor,
      marginVertical: Spacing.minor,
    },
  });
