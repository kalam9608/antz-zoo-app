import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import SpeciesCustomCard from "../../components/SpeciesCustomCard";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import CustomCard from "../../components/CustomCard";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import ImageComponent from "../../components/ImageComponent";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  getMortalityResonWiseList,
  getMortalitySpeciesWiseList,
} from "../../services/mortalityServices";
import { useToast } from "../../configs/ToastConfig";
import Loader from "../../components/Loader";
import ListEmpty from "../../components/ListEmpty";
import { capitalize, checkPermissionAndNavigateWithAccess } from "../../utils/Utils";
import HeaderMortality from "../../components/HeaderMortality";
import Config from "../../configs/Config";

const MortalityResonSpeciesList = (props) => {
  const navigation = useNavigation();
  const permission = useSelector((state) => state.UserAuth.permission);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const [Loading, setLoading] = useState(false);
  const [animalData, setAnimalData] = useState([]);
  const [animalDataLength, setAnimalDataLength] = useState([]);
  const [animalCount, setAnimalCount] = useState(0);
  const [animalPage, setAnimalPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      if (searchText.length == 0) {
        setLoading(true);
        fetchMortalityResonSpeciesList(1, "");
        setAnimalPage(1);
      }
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation, searchText])
  );

  const fetchMortalityResonSpeciesList = (count, qSearch) => {
    let obj = {
      purpose: "animals",
      reason_id: props?.route?.params?.reson_id,
      species_id: props?.route?.params?.specie_id,
      page_no: count,
      q: qSearch,
    };
    getMortalityResonWiseList(obj)
      .then((res) => {
        let dataArr = count == 1 ? [] : animalData;
        if (res.data) {
          setAnimalCount(res?.data?.total_count);
          setAnimalDataLength(res.data?.result ? res.data?.result?.length : 0);
          setAnimalData(dataArr.concat(res.data?.result));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("error====>", err);
        setLoading(false);
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //pagenation for animals list
  const handleLoadMore = () => {
    if (!Loading && animalDataLength > 0 && animalData?.length != animalCount) {
      const nextPage = animalPage + 1;
      setAnimalPage(nextPage);
      fetchMortalityResonSpeciesList(nextPage, searchText);
    }
  };

  const renderFooter = () => {
    if (Loading || animalDataLength < 10 || animalData?.length == animalCount) {
      return null;
    }

    return (
      <ActivityIndicator style={{ color: constThemeColor?.housingPrimary }} />
    );
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length >= 3) {
      const getSearchData = setTimeout(() => {
        setLoading(true);
        fetchMortalityResonSpeciesList(1, text);
      }, 1500);
      return () => clearTimeout(getSearchData);
    } else if (text.length == 0) {
      setSearchText("");
      const getSearchData = setTimeout(() => {
        setLoading(true);
        fetchMortalityResonSpeciesList(1, "");
      }, 1500);
      return () => clearTimeout(getSearchData);
    }
  };

  const clearSearchText = () => {
    setSearchText("");
    setLoading(true);
    fetchMortalityResonSpeciesList(1, "");
  };

  return (
    <View style={styles.container}>
      <HeaderMortality
        noIcon={true}
        title={"Mortality"}
        search={true}
        titlePaddingHorizontal={Spacing.mini}
        handleSearch={handleSearch}
        clearSearchText={clearSearchText}
        searchModalText={searchText}
        backgroundColor={"#FFE5DD"} // color code is not in redux
      />
      <Loader visible={Loading} />
      <View style={styles.body}>
        <Text
          style={{
            fontSize: FontSize.Antz_Major,
            fontWeight: FontSize.weight400,
            marginBottom: Spacing.minor,
          }}
        >
          {props?.route?.params?.reson_name ?? "NA"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            borderWidth: 1,
            borderColor: constThemeColor?.tertiaryContainer,
            borderRadius: Spacing.small + Spacing.mini,
            paddingHorizontal: Spacing.minor,
            paddingVertical: Spacing.minor,
            marginBottom: Spacing.minor,
          }}
        >
          <View style={{ marginRight: Spacing.body, alignSelf: "center" }}>
            <ImageComponent
              icon={
                props?.route?.params?.icon ??
                `${Config.BASE_APP_URL}uploads/assets/class_images/default_animal.svg`
              }
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: FontSize.Antz_Minor,
                fontWeight: FontSize.weight600,
              }}
            >
              {capitalize(props?.route?.params?.complete_name ?? "NA")}
            </Text>
            <Text
              style={{
                color: constThemeColor.onSurfaceVariant,
                fontStyle: "italic",
              }}
            >
              ({capitalize(props?.route?.params?.SpeciesName ?? "NA")})
            </Text>
          </View>
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={animalData}
          renderItem={({ item }) => {
            return (
              <AnimalCustomCard
                item={item}
                discoveredDate={item?.discovered_date}
                reasonName={item?.reason_name}
                animalIdentifier={
                  item?.local_identifier_value
                    ? item?.local_identifier_name
                    : item?.animal_id
                }
                localID={item?.local_identifier_value ?? null}
                icon={item?.default_icon}
                enclosureName={item?.user_enclosure_name}
                animalName={
                  item?.common_name ? item?.common_name : item?.scientific_name
                }
                scientific_name={item?.scientific_name ?? null}
                sectionName={item?.section_name}
                siteName={item?.site_name}
                show_mortality_details={true}
                show_specie_details={true}
                show_housing_details={true}
                chips={item?.sex}
                // noArrow={true}
                onPress={() =>
                  checkPermissionAndNavigateWithAccess(
                    permission,
                    "collection_animal_record_access",
                    navigation,
                    "AnimalsDetails",
                    {
                      animal_id: item?.animal_id,
                      default_tab: "Mortality",
                    },
                    "VIEW"
                  )
                }
              />
            );
          }}
          keyExtractor={(i, index) => index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={<ListEmpty height={"50%"} visible={Loading} />}
        />
      </View>
    </View>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFE5DD",
    },
    body: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
    },
  });

export default MortalityResonSpeciesList;
