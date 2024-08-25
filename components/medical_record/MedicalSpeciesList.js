import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import SpeciesCustomCard from "../SpeciesCustomCard";
import ListEmpty from "../ListEmpty";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getMedicalRecordList } from "../../services/medicalRecord";

const MedicalSpeciesList = ({
  status,
  screenType,
  endDate,
  startDate,
  siteId,
  sectionId,
  enclosureId,
  speciesId,
}) => {
  const navigation = useNavigation();
  //for species
  const [Loading, setLoading] = useState(false);
  const [speciesData, setSpeciesData] = useState([]);
  const [speciesDataLength, setSpeciesDataLength] = useState(0);
  const [speciesDataCount, setSpeciesDataCount] = useState(0);
  const [speciesDataPage, setSpeciesDataPage] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setSpeciesDataPage(1);
      fetchSpeciesData(1);

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation, screenType, endDate, startDate])
  );

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
          let arrData = pageNo == 1 ? [] : speciesData;

          setSpeciesDataCount(
            res?.data?.count == undefined ? 0 : res?.data?.count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setSpeciesData(arrData);
            setSpeciesDataLength(arrData?.length);

            setLoading(false);
          }
        } else {
          setSpeciesDataLength(speciesDataCount);
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
      speciesDataLength >= 10 &&
      speciesDataLength !== speciesDataCount
    ) {
      const nextPage = speciesDataPage + 1;
      setSpeciesDataPage(nextPage);
      fetchSpeciesData(nextPage);
    }
  };

  const renderFooterSpecies = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      speciesDataLength == 0 ||
      speciesDataLength < 10 ||
      speciesDataLength == speciesDataCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

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
                navigation.navigate("SpeciesDiagnosis", {
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

export default MedicalSpeciesList;
