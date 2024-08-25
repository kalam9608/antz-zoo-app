import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { useSelector } from "react-redux";

import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import SpeciesCustomCard from "./SpeciesCustomCard";
import AnimalCustomCard from "./AnimalCustomCard";

const EnclosureOccupantsCard = ({
  data,
  permission,
  isHideStats,
  onAnimalPress,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const customStyles = styles(constThemeColor);

  return (
    <View style={customStyles.mainContainer}>
      <SpeciesCustomCard
        icon={data?.default_icon}
        complete_name={data?.complete_name ? data?.complete_name : "NA"}
        animalName={data?.common_name ? data?.common_name : "NA"}
        tags={
          !isHideStats && permission["housing_view_insights"]
            ? data?.sex_data
            : null
        }
        count={
          !isHideStats && permission["housing_view_insights"]
            ? data?.animal_count
            : null
        }
        style={customStyles.speciesCardContainer}
      />
      <FlatList
        data={data?.animals ?? []}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <AnimalCustomCard
            item={item}
            show_housing_details={true}
            show_specie_details={true}
            icon={item?.default_icon}
            animalIdentifier={
              !item?.local_identifier_value
                ? item?.animal_id
                : item?.local_identifier_name ?? null
            }
            animalName={
              item?.common_name
                ? item?.common_name
                : item?.default_common_name
                ? item?.default_common_name
                : item?.scientific_name
            }
            localID={item?.local_identifier_value ?? null}
            chips={item?.sex}
            enclosureName={item?.user_enclosure_name}
            sectionName={item?.section_name}
            siteName={item?.site_name}
            style={[
              customStyles.animalCardContainer,
              index === data?.animals?.length - 1
                ? customStyles.lastAnimalCardContainer
                : {},
            ]}
            onPress={() => onAnimalPress(item)}
          />
        )}
        keyExtractor={(item) => item?.animal_id}
      />
    </View>
  );
};

export default EnclosureOccupantsCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      borderWidth: 1,
      borderRadius: Spacing.small,
      borderColor: reduxColors.outlineVariant,
      marginBottom: Spacing.body,
    },
    speciesCardContainer: {
      marginVertical: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderBottomWidth: 1,
      borderColor: reduxColors.outlineVariant,
      backgroundColor: reduxColors.surface,
    },
    animalCardContainer: {
      marginVertical: 0,
      borderRadius: 0,
      borderBottomWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
    lastAnimalCardContainer: {
      borderBottomLeftRadius: Spacing.small,
      borderBottomRightRadius: Spacing.small,
      borderBottomWidth: 0,
    },
    subtitle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
  });
