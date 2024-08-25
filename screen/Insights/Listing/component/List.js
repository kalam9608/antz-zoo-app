import React from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AnimalCustomCard from "../../../../components/AnimalCustomCard";
import { useNavigation } from "@react-navigation/native";
import {
  checkPermissionAndNavigateWithAccess,
  shortenNumber,
} from "../../../../utils/Utils";
import CustomSiteCard from "../../../../components/CustomSiteCard";
import EnclosureCard from "../../../../components/EnclosureCard";
import { View } from "react-native";
import Spacing from "../../../../configs/Spacing";
import SpeciesCustomCard from "../../../../components/SpeciesCustomCard";

const List = ({ type, data }) => {
  const constThemeColors = useSelector((state) => state.darkMode.theme.colors);
  const permission = useSelector((state) => state.UserAuth.permission);
  const styles = style(constThemeColors);
  const navigation = useNavigation(0);
  return (
    <>
      {type == "section" ? (
        <CustomSiteCard
          title={data.section_name}
          incharge={data.incharge_name ? data.incharge_name : "NA"}
          animalCount={shortenNumber(data.animal_count)}
          speciesCount={shortenNumber(data.species_count)}
          encCount={shortenNumber(data.enclosure_count)}
          InchargePhoneNumber={data.incharge_phone_number}
          permission={permission}
          images={data.images}
          onPress={() =>
            navigation.navigate("HousingEnclosuer", {
              section_id: data?.section_id ?? 0,
              sectiondata: data,
              incharge_name: data.incharge_name ? data.incharge_name : "NA",
            })
          }
        />
      ) : type == "animal" ? (
        <View style={styles.body}>
          <AnimalCustomCard
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
            type={data?.type}
            onPress={() =>
              checkPermissionAndNavigateWithAccess(
                permission,
                "collection_animal_record_access",
                navigation,
                "AnimalsDetails",
                {
                  animal_id: data.animal_id,
                },
                "VIEW"
              )
            }
          />
        </View>
      ) : type == "enclosure" ? (
        <>
          <View style={styles.body}>
            <EnclosureCard
              item={data}
              onPress={() =>
                navigation.navigate("OccupantScreen", {
                  enclosure_id: data?.enclosure_id ?? 0,
                  section_id: data?.section_id,
                  section_name: data?.section_name,
                  enclosure_name: data?.user_enclosure_name,
                  enclosure_id: data?.enclosure_id,
                })
              }
            />
          </View>
        </>
      ) : type == "site" ? (
        <>
          <CustomSiteCard
            title={data.site_name}
            incharge={data.incharge_name ? data.incharge_name : "NA"}
            animalCount={shortenNumber(data.animal_count)}
            speciesCount={shortenNumber(data.species_count)}
            encCount={shortenNumber(data.enclosure_count)}
            sectionCount={shortenNumber(data.section_count)}
            InchargePhoneNumber={
              data.incharge_mobile_no
                ? data.incharge_mobile_no
                : data?.incharge_phone_number
            }
            permission={permission}
            images={data.images}
            onPress={() =>
              navigation.navigate("siteDetails", {
                id: data.site_id,
              })
            }
          />
        </>
      ) : type == "species" ? (
        <SpeciesCustomCard
          icon={data.default_icon}
          complete_name={data?.complete_name ? data?.complete_name : "NA"}
          animalName={data.common_name ? data?.common_name : "NA"}
          tags={data.sex_data}
          count={data.animal_count}
          onPress={() =>
            navigation.navigate("HousingEnclosuer", {
              section_id: data?.section_id ?? 0,
              sectiondata: data,
              incharge_name: data.incharge_name ? data.incharge_name : "NA",
            })
          }
        />
      ) : null}
    </>
  );
};

const style = (reduxColor) =>
  StyleSheet.create({
    body: { marginHorizontal: Spacing.minor },
  });

export default List;
