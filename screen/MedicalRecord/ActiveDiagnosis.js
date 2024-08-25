import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { widthPercentageToDP } from "react-native-responsive-screen";
import CustomCard from "../../components/CustomCard";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getActiveDiagnosisData } from "../../services/medicalRecord";
import { ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import { errorToast } from "../../utils/Alert";
import ListEmpty from "../../components/ListEmpty";

const ActiveDiagnosis = (props) => {
  const navigation = useNavigation();
  const [Loading, setLoading] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [countHeader, setCountHeader] = useState({});

  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  const [animalDataLength, setAnimalDataLength] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      setLoading(true);
      setPage(1);
      loadData(1);
    });

    return subscribe;
  }, [navigation]);

  const loadData = (count) => {
    let reqObj = {
      page_no: count,
      zoo_id: zooID,
    };
    getActiveDiagnosisData(reqObj)
      .then((res) => {
        setCountHeader(res.data);
        let dataArr = count == 1 ? [] : diagnosisData;
        setAnimalDataLength(
          res.data?.active_diagnosis_list
            ? res.data?.active_diagnosis_list.length
            : 0
        );
        if (res.data.active_diagnosis_list) {
          setDiagnosisData(dataArr.concat(res.data?.active_diagnosis_list));
        }

        setLoading(false);
      })
      .catch((err) => {
        errorToast("Oops!", "Something went wrong!!");
        setLoading(false);
      });
  };
  const handleLoadMore = () => {
    if (!Loading && animalDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  const renderFooter = () => {
    if (Loading || animalDataLength == 0 || animalDataLength < 10) return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };
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
        title="Active Diagnosis"
        noIcon={true}
        search={true}
        gotoSearchPage={() => navigation.navigate("InsightSearching")}
        // style={{
        //   paddingBottom: widthPercentageToDP("3%"),
        //   paddingTop: widthPercentageToDP("2%"),
        // }}
      />

      <View style={[reduxColors.card]}>
        <TouchableOpacity
          onPress={() => setIsActive(true)}
          style={reduxColors.cardBody}
          disabled={true}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={reduxColors.cardText}>
              {countHeader?.diagnosis_total}
            </Text>
            <Text style={reduxColors.cardBottomText}>Diagnosis</Text>
          </View>

          <View
            style={[
              reduxColors.bottomLine,
              { backgroundColor: constThemeColor.primary },
            ]}
          ></View>
        </TouchableOpacity>

        <TouchableOpacity style={reduxColors.cardBody} disabled={true}>
          <View style={{ alignItems: "center" }}>
            <Text style={reduxColors.cardText}>
              {countHeader?.animal_total}
            </Text>
            <Text style={[reduxColors.cardBottomText, {}]}>Animals</Text>
          </View>
          <View style={[reduxColors.bottomLine]}></View>
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: 10, flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={diagnosisData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ marginBottom: 10 }}
          renderItem={({ item }) => {
            return (
              <View style={{}}>
                <CustomCard
                  title={item.diagnosis_name}
                  //   icon={"assets/class_images/default_animal.svg"}
                  onPress={() => {
                    navigation.navigate("DiagnosisAnimal", { item: item });
                  }}
                  count={item.count}
                  style={{ minHeight: 60 }}
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
    </View>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: reduxColors.surface,
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      padding: 10,
      paddingBottom: 0,
      borderRadius: 12,
      shadowColor: reduxColors.neutral50,
      elevation: 2,
      shadowOffset: {
        height: 2,
        width: 10,
      },
      marginBottom: 5,
      marginHorizontal: 10,
    },
    cardBody: {
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 10,
    },
    cardText: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.onSurface,
      textAlign: "center",
    },
    cardBottomText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      fontStyle: "normal",
      marginBottom: 7,
      marginTop: -4,
      textAlign: "center",
    },
    bottomLine: {
      height: 6,
      width: 85,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
  });

export default ActiveDiagnosis;
