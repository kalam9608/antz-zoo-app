import React, { useState, useEffect } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Searchbar, ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";
import { isArray } from "lodash";

import ListEmpty from "../../components/ListEmpty";
import MedicalSearchFooter from "../../components/MedicalSearchFooter";
import TaxonCustomCard from "../../components/TaxonCustomCard";
import { addAssessmentTemplateTaxon, assessmentTemplateTaxonFiltering } from "../../services/assessmentService/AssessmentTemplate";
import { useToast } from "../../configs/ToastConfig";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { successToast } from "../../utils/Alert";
import Loader from "../../components/Loader";

const SearchSpeciesScreen = ({ route, navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchdata, setSearchData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [totalDataCount, setTotalDataCount] = useState('0');
  const [stopSearchCall, setStopSearchCall] = useState(false);

  const { goBack } = useNavigation();

  const { errorToast } = useToast();

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  useEffect(() => {
    setSearchData([]);
    setSelectedData([]);
    setStopSearchCall(false);
    setPage(1);
    const getData = setTimeout(() => {
      if (searchText?.length > 0) {
        searchSpeciesData(searchText, 1);
      }
    }, 1000);

    return () => clearTimeout(getData);
  }, [searchText]);

  const onSelectedItemPress = (item) => {
    let newData = [...selectedData];
    if (selectedData?.find(i => i?.tsn === item?.tsn)) {
      setSelectedData([...newData?.filter(i => i?.tsn !== item?.tsn)]);
    } else {
      setSelectedData([...selectedData, item]);
    }
  };

  const onAddPress = () => {
    if (selectedData?.length > 0) {
      setIsAddLoading(true);
      const obj = {
        assessment_template_id: route?.params?.assessmentTempId ?? '',
        tsn_id: JSON.stringify(selectedData?.map(i => Number(i?.tsn))),
        taxon_type: 'species',
      };
      // console.log('addAssessmentTemplateTaxon obj :: ', obj);
      addAssessmentTemplateTaxon(obj)
        .then((res) => {
          // console.log('addAssessmentTemplateTaxon res :: ', res);
          if (res?.success) {
            successToast("Success", res?.message ?? 'Added Successfully!');
            navigation?.pop(2);
          } else {
            errorToast("error", res?.message ?? "Something went wrong");
          }
        })
        .catch((e) => {
          errorToast("error", "Something went wrong");
        })
        .finally((e) => {
          setIsAddLoading(false);
        });
    }
  };

  const searchSpeciesData = (query, page) => {
    setIsLoading(true);
    const requestObj = {
      type: 'species',
      page_no: page,
      parent_taxon: route?.params?.parentTaxon ?? '',
      parent_taxon_type: 'class',
      q: query,
    };
    assessmentTemplateTaxonFiltering(requestObj)
      .then((res) => {
        // console.log('res', res?.data?.taxon_list);
        if (res?.data?.length > 0) Keyboard.dismiss();
        if (page === 1) {
          setSearchData(res?.data?.taxon_list ?? []);
        } else {
          setSearchData(prev => [...prev, ...(res?.data?.taxon_list ?? [])]);
        }
        setStopSearchCall(res?.data?.taxon_list === undefined);
        setTotalDataCount(res?.data?.total_count ?? '0');
      })
      .catch((error) => errorToast("Oops!", "Something went wrong!!"))
      .finally(() => {
        setIsLoading(false);
        setIsMoreLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (!isLoading && !isMoreLoading) {
      let p = page + 1;
      setPage(p);
      searchSpeciesData(searchText, p);
    }
  };

  const renderFooter = () => {
    if (!isLoading && isMoreLoading) {
      return (
        <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
      );
    }
    return null;
  };

  const renderItems = ({ item }) => {
    const selectedTaxonIds = isArray(selectedData) ? selectedData?.map(i => i?.tsn) : [];
    return (
      <TaxonCustomCard
        pictureUri={item?.default_icon ?? ''}
        title={item?.common_name ?? ''}
        showCheckBox={true}
        isSelected={selectedTaxonIds?.includes(item?.tsn)}
        onPress={() => {
          let newData = [...selectedData];
          if (selectedData?.find(i => i?.tsn === item?.tsn)) {
            setSelectedData([...newData?.filter(i => i?.tsn !== item?.tsn)]);
          } else {
            setSelectedData([...selectedData, item]);
          }
        }}
      />
    );
  };

  return (
    <View style={reduxColors.container}>
      <Loader visible={isAddLoading} />
      <Searchbar
        placeholder={'Search Species'}
        placeholderTextColor={constThemeColor.onSurfaceVariant}
        inputStyle={reduxColors.input}
        icon={() => (
          <MaterialCommunityIcons
            name={"arrow-left"}
            size={24}
            color={constThemeColor.onSurfaceVariant}
          />
        )}
        onIconPress={goBack}
        style={reduxColors.searchbar}
        loading={isLoading}
        value={searchText}
        onChangeText={setSearchText}
        autoFocus={true}
      />

      <View style={reduxColors.searchContainer}>
        {searchdata.length > 0 ? (
          <Text
            style={{
              fontSize: FontSize.Antz_Body_Medium.fontSize,
              fontWeight: FontSize.Antz_Body_Medium.fontWeight,
              color: constThemeColor.onSurfaceVariant,
              marginVertical: Spacing.body,
              marginHorizontal: Spacing.minor,
            }}>
            {isLoading ? "" : `${totalDataCount} results`}
          </Text>
        ) : null}

        {searchdata?.length > 0 ?
          <FlatList
            data={searchdata}
            renderItem={renderItems}
            keyExtractor={(item, index) => `${item?.tsn}${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            extraData={selectedData}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.4}
            onEndReached={handleLoadMore}
            ListEmptyComponent={<ListEmpty />}
          />
          : null
        }
      </View>

      {selectedData?.length > 0 ? (
        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <MedicalSearchFooter
            title={"Specie"}
            selectCount={selectedData?.length}
            speciesCard={true}
            toggleSelectedList={false}
            selectedItems={selectedData}
            onPress={onAddPress}
            onPressData={onSelectedItemPress}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    searchContainer: {
      paddingBottom: Spacing.small,
      marginVertical: Spacing.body,
    },
    searchbar: {
      width: "100%",
      borderRadius: 0,
      borderBottomWidth: 0.5,
      borderColor: reduxColors.outlineV,
      backgroundColor: reduxColors.onPrimary
    },
  });

export default SearchSpeciesScreen;
