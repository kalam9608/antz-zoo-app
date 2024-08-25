import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Loader from "../../components/Loader";
import HeaderWithSearch from "../../components/HeaderWithSearch";
import Spacing from "../../configs/Spacing";
import { useToast } from "../../configs/ToastConfig";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getMedicalAnimalsRecord } from "../../services/medicalRecord";
import ListEmpty from "../../components/ListEmpty";
import FontSize from "../../configs/FontSize";
import { checkPermissionAndNavigateWithAccess } from "../../utils/Utils";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import SpeciesCustomCard from "../../components/SpeciesCustomCard";

const SickSpeciesList = (props) => {
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [Loading, setLoading] = useState(false);
  const permission = useSelector((state) => state.UserAuth.permission);
  const [speciesList, setSpecies] = useState([]);
  const [speciesListLength, setSpeciesLength] = useState(0);
  const [speciesListCount, setSpeciesCount] = useState(0);
  const [speciesPage, setSpeciesPage] = useState(0);
  const [title] = useState(props?.route?.params?.ref_title);
  const [type] = useState(props?.route?.params?.ref_type);
  const [start_date] = useState(props?.route?.params?.startDate);
  const [end_date] = useState(props?.route?.params?.endDate);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setSpeciesPage(1);
      fetchspeciesListData(1);

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation])
  );

  const fetchspeciesListData = (pageNo) => {
    let obj = {
      ref_type: type,
      page_no: pageNo,
    };
    if (start_date || end_date) {
      obj["start_date"] = start_date;
      obj["end_date"] = end_date;
    }

    getMedicalAnimalsRecord(obj)
      .then((res) => {
        if (res?.success) {
          let arrData = pageNo == 1 ? [] : speciesList;

          setSpeciesCount(
            res?.data?.total_count == undefined ? 0 : res?.data?.total_count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setSpecies(arrData);
            setSpeciesLength(arrData?.length);

            setLoading(false);
          }
        } else {
          setSpeciesLength(speciesListCount);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("error===>", err);
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (
      !Loading &&
      speciesListLength >= 10 &&
      speciesListLength !== speciesListCount
    ) {
      const nextPage = speciesPage + 1;
      setSpeciesPage(nextPage);
      fetchspeciesListData(nextPage);
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      speciesListLength == 0 ||
      speciesListLength < 10 ||
      speciesListLength == speciesListCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  return (
    <View style={reduxColors.container}>
      <HeaderWithSearch
        noIcon={true}
        title={title ? title + " List" : ""}
        search={false}
        titlePaddingHorizontal={Spacing.mini}
        backgroundColor={constThemeColor?.secondaryContainer}
      />
      <Loader visible={Loading} />
      <View style={reduxColors.body}>
        <View
          style={{
            paddingTop: Spacing.small,
            paddingBottom: Spacing.mini,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginLeft: Spacing.micro,
              fontSize: FontSize.Antz_Body_Medium.fontSize,
              fontWeight: FontSize.Antz_Body_Medium.fontWeight,
              color: constThemeColor?.onPrimaryContainer,
            }}
          >
            {speciesListCount ?? "0"} {title ? title : ""}
          </Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={speciesList}
          renderItem={({ item }) => (
            <>
              <SpeciesCustomCard
                icon={item.default_icon}
                animalName={item.scientific_name ? item?.scientific_name : "NA"}
                complete_name={item.common_name ? item.common_name : "NA"}
                tags={item.sex_data}
                count={item.total}
                onPress={() =>
                  navigation.navigate("SickAnimalsList", {
                    ref_type: "animals_sick",
                    speciesId: item?.specie_id,
                    ref_title: "Animal",
                    speciesId: item?.specie_id,
                  })
                }
              />
            </>
          )}
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

export default SickSpeciesList;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors?.secondaryContainer,
    },
    body: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
    },
  });
