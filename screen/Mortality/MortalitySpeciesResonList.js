import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
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
import { getMortalitySpeciesWiseList } from "../../services/mortalityServices";
import Loader from "../../components/Loader";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";
import { ActivityIndicator } from "react-native";
import { checkPermissionAndNavigateWithAccess } from "../../utils/Utils";
import HeaderMortality from "../../components/HeaderMortality";
import Config from "../../configs/Config";
import { capitalize } from "lodash";

const MortalitySpeciesResonList = (props) => {
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
      setLoading(true);
      fetchMortalitySpeciesResonList(1, "");
      setAnimalPage(1);
      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation])
  );
  const fetchMortalitySpeciesResonList = (count, qSearch) => {
    let obj = {
      reason_id: props?.route?.params?.reason_id,
      purpose: "reasons",
      taxonomy_id: props?.route?.params?.specie_id,
      page_no: count,
      q: qSearch,
    };
    getMortalitySpeciesWiseList(obj)
      .then((res) => {
        let dataArr = count == 1 ? [] : animalData;
        if (res.data) {
          setAnimalCount(res?.data?.total_count);
          setAnimalDataLength(res.data?.result ? res.data?.result?.length : 0);
          setAnimalData(dataArr.concat(res?.data?.result));
        }
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

  //pagenation for animals list
  const handleLoadMore = () => {
    if (!Loading && animalDataLength > 0 && animalData?.length != animalCount) {
      const nextPage = animalPage + 1;
      setAnimalPage(nextPage);
      fetchMortalitySpeciesResonList(nextPage, searchText);
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
        fetchMortalitySpeciesResonList(1, text);
      }, 1500);
      return () => clearTimeout(getSearchData);
    } else if (text.length == 0) {
      setSearchText("");
      const getSearchData = setTimeout(() => {
        setLoading(true);
        fetchMortalitySpeciesResonList(1, "");
      }, 1500);
      return () => clearTimeout(getSearchData);
    }
  };

  const clearSearchText = () => {
    setSearchText("");
    setLoading(true);
    fetchMortalitySpeciesResonList(1, "");
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
        <View
          style={{
            flexDirection: "row",
            borderWidth: 1,
            borderColor: constThemeColor?.tertiaryContainer,
            borderRadius: Spacing.small + Spacing.mini,
            paddingHorizontal: Spacing.minor,
            paddingVertical: Spacing.minor,
            marginVertical: Spacing.small,
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
              {/* {props?.route?.params?.SpeciesName} */}
              {capitalize(props?.route?.params?.complete_name)}
            </Text>
            <Text
              style={{
                color: constThemeColor.onSurfaceVariant,
                fontStyle: "italic",
              }}
            >
              {/* ({props?.route?.params?.complete_name}) */}(
              {capitalize(props?.route?.params?.SpeciesName)})
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: FontSize.Antz_Minor,
            fontWeight: FontSize.weight500,
            marginBottom: Spacing.small,
          }}
        >
          {props?.route?.params?.reson_name ?? "NA"} -{" "}
          {props?.route?.params?.total_reson ?? "0"}
        </Text>

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

export default MortalitySpeciesResonList;
