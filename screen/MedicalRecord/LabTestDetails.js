import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { widthPercentageToDP } from "react-native-responsive-screen";
import AnimalCard from "../../components/AnimalCard";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { getLabTestDetails } from "../../services/medicalRecord";
import { ifEmptyValue } from "../../utils/Utils";
import moment from "moment";
import { ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import { errorToast } from "../../utils/Alert";
import ListEmpty from "../../components/ListEmpty";
import Spacing from "../../configs/Spacing";
import AnimalCustomCard from "../../components/AnimalCustomCard";

const LabTestDetails = (props) => {
  const navigation = useNavigation();
  const [Loading, setLoading] = useState(false);
  const [labTestData, setLabTestData] = useState([]);
  const [labTestDataLength, setLabTestDataLength] = useState(0);
  const [page, setPage] = useState(1);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      setLoading(true);
      loadData(1);
    });

    return subscribe;
  }, [navigation]);

  const loadData = (count) => {
    getLabTestDetails({
      lab_test_id: props.route.params?.item?.lab_test_id,
      page_no: count,
      zoo_id: zooID,
    })
      .then((res) => {
        let dataArr = count == 1 ? [] : labTestData;
        setLabTestDataLength(res.data ? res.data?.length : 0);
        if (res.data) {
          setLabTestData(dataArr.concat(res.data));
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        errorToast("Oops!", "Something went wrong!!");
      });
  };

  const handleLoadMore = () => {
    if (!Loading && labTestDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  const renderFooter = () => {
    if (Loading || labTestDataLength == 0 || labTestDataLength < 10)
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };

  const CountUniqueIds = (data) => {
    const idCount = {};
    data.forEach((item) => {
      if (idCount[item.animal_id]) {
        idCount[item.animal_id]++;
      } else {
        idCount[item.animal_id] = 1;
      }
    });
    let uniqueCount = 0;
    let duplicateCount = 0;
    for (let id in idCount) {
      if (idCount[id] === 1) {
        uniqueCount++;
      } else {
        duplicateCount++;
      }
    }
    return {
      uniqueCount,
      duplicateCount,
    };
  };
  const result = CountUniqueIds(labTestData);
  const countLabTest = result?.duplicateCount + result?.uniqueCount ?? "0";
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: constThemeColor.surfaceVariant,
      }}
    >
      <Loader visible={Loading} />
      <Header
        title={props.route.params?.item?.lab_test_name}
        noIcon={true}
        search={true}
        gotoSearchPage={() => navigation.navigate("InsightSearching")}
        // style={{
        //   paddingBottom: widthPercentageToDP("3%"),
        //   paddingTop: widthPercentageToDP("2%"),
        // }}
      />
      <Text style={reduxColors.heading}>
        {countLabTest ?? props.route.params?.item?.count ?? ""} Animals Lab Test
        with {props.route.params?.item?.lab_test_name ?? ""}
      </Text>
      <FlatList
        data={labTestData}
        renderItem={({ item }) => {
          return (
            <View style={{ marginHorizontal: Spacing.minor }}>
              <AnimalCustomCard
                item={item}
                date={moment(item.created_at, "YYYY-MM-DD HH:mm:ss").format(
                  "DD MMM YYYY"
                )}
                show_housing_details={true}
                show_specie_details={true}
                icon={item.default_icon ?? ""}
                animalIdentifier={
                  !item?.local_identifier_value
                    ? item?.animal_id
                    : item?.local_identifier_name ?? null
                }
                localID={item?.local_identifier_value ?? null}
                chips={item.sex ?? null}
                enclosureName={item.enclosure_name ?? null}
                sectionName={item.section_name ?? null}
                animalName={
                  item.common_name
                    ? item.common_name
                    : item.scientific_name ?? null
                }
                onPress={() => {
                  navigation.navigate("MedicalSummary", {
                    medical_record_id: item?.medical_record_id,
                    item: item,
                  });
                }}
              />
            </View>
          );
        }}
        ListEmptyComponent={<ListEmpty visible={Loading} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    heading: {
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      fontStyle: "normal",
      paddingHorizontal: 28,
      marginVertical: 15,
    },
  });

export default LabTestDetails;
