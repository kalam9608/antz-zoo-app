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

const SickAnimalsList = (props) => {
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [Loading, setLoading] = useState(false);
  const permission = useSelector((state) => state.UserAuth.permission);
  const [animals, setAnimals] = useState([]);
  const [animalsLength, setAnimalsLength] = useState(0);
  const [animalsCount, setAnimalsCount] = useState(0);
  const [animalPage, setAnimalPage] = useState(0);

  const [type] = useState(props?.route?.params?.ref_type);
  const [title] = useState(props?.route?.params?.ref_title);

  const [start_date] = useState(props?.route?.params?.startDate);
  const [end_date] = useState(props?.route?.params?.endDate);
  const [siteId] = useState(props?.route?.params?.siteId);
  const [sectionId] = useState(props?.route?.params?.sectionId);
  const [enclosureId] = useState(props?.route?.params?.enclosureId);
  const [speciesId] = useState(props?.route?.params?.speciesId);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setAnimalPage(1);
      fetchAnimalsData(1);

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation])
  );

  const fetchAnimalsData = (pageNo) => {
    let obj = {
      ref_type: type,
      page_no: pageNo,
    };
    if (start_date || end_date) {
      obj["start_date"] = start_date;
      obj["end_date"] = end_date;
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

    getMedicalAnimalsRecord(obj)
      .then((res) => {
        if (res?.success) {
          let arrData = pageNo == 1 ? [] : animals;

          setAnimalsCount(
            res?.data?.total_count == undefined ? 0 : res?.data?.total_count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setAnimals(arrData);
            setAnimalsLength(arrData?.length);

            setLoading(false);
          }
        } else {
          setAnimalsLength(animalsCount);
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
    if (!Loading && animalsLength >= 10 && animalsLength !== animalsCount) {
      const nextPage = animalPage + 1;
      setAnimalPage(nextPage);
      fetchAnimalsData(nextPage);
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      animalsLength == 0 ||
      animalsLength < 10 ||
      animalsLength == animalsCount
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
            {animalsCount ?? "0"}{" "}
            {title ? (animalsCount == 1 ? title : title + "s") : ""}
          </Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={animals}
          renderItem={({ item }) => (
            <AnimalCustomCard
              item={item}
              animalIdentifier={
                !item?.local_identifier_value || !item?.local_identifier_name
                  ? item?.animal_id
                  : item?.local_identifier_name ?? null
              }
              siteName={item?.site_name ? item?.site_name : "NA"}
              localID={
                item?.local_identifier_value && item?.local_identifier_name
                  ? item?.local_identifier_value
                  : null
              }
              icon={item?.default_icon}
              enclosureName={item?.user_enclosure_name}
              animalName={
                item?.default_common_name
                  ? item?.default_common_name
                  : item?.complete_name
              }
              sectionName={item?.section_name}
              show_specie_details={true}
              show_housing_details={true}
              chips={item?.sex}
              // onPress={() =>
              //   checkPermissionAndNavigateWithAccess(
              //     permission,
              //     "collection_animal_record_access",
              //     navigation,
              //     "AnimalsDetails",
              //     {
              //       animal_id: item.animal_id,
              //     },
              //     "VIEW"
              //   )
              // }
            />
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

export default SickAnimalsList;

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
