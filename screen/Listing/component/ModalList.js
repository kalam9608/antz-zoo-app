import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";
import AnimalCustomCard from "../../../components/AnimalCustomCard";
import SpeciesCustomCard from "../../../components/SpeciesCustomCard";
import {
  checkPermissionAndNavigateWithAccess,
  opacityColor,
} from "../../../utils/Utils";
import Spacing from "../../../configs/Spacing";

const ModalList = ({ type, data, navigation, closeButtonSheet }) => {
  const constThemeColors = useSelector((state) => state.darkMode.theme.colors);
  const permission = useSelector((state) => state.UserAuth.permission);
  const styles = style(constThemeColors);
  return (
    <>
      {type == "species" ? (
        <SpeciesCustomCard
          style={{
            backgroundColor: opacityColor(constThemeColors.surfaceVariant, 60),
          }}
          icon={data.default_icon}
          animalName={data.complete_name ? data?.complete_name : "NA"}
          complete_name={data?.common_name ? data?.common_name : "NA"}
          tags={data.sex_data}
          count={data.animal_count}
          onPress={() => {
            closeButtonSheet();
            navigation.navigate("SpeciesDetails", {
              title: data?.common_name,
              subtitle: data.complete_name,
              tags: data.sex_data,
              tsn_id: data.tsn_id,
              icon: data.default_icon,
              section_id: data.section_id,
            });
          }}
        />
      ) : (
        <AnimalCustomCard
          style={{
            backgroundColor: opacityColor(constThemeColors.onSurfaceVariant, 5),
          }}
          item={data}
          animalIdentifier={
            data?.local_identifier_value
              ? data?.local_identifier_name
              : data?.animal_id
          }
          localID={data?.local_identifier_value ?? null}
          icon={data?.default_icon}
          enclosureName={data?.user_enclosure_name}
          animalName={
            data?.default_common_name
              ? data?.default_common_name
              : data?.scientific_name
          }
          siteName={data?.site_name}
          sectionName={data?.section_name}
          show_specie_details={true}
          show_housing_details={true}
          chips={data?.sex}
          onPress={() => {
            closeButtonSheet();
            checkPermissionAndNavigateWithAccess(
              permission,
              "collection_animal_record_access",
              navigation,
              "AnimalsDetails",
              {
                animal_id: data.animal_id,
              },
              "VIEW"
            );
          }}
        />
      )}
    </>
  );
};

const style = (reduxColor) => StyleSheet.create({});

export default ModalList;
