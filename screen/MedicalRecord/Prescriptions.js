import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { widthPercentageToDP } from "react-native-responsive-screen";
import CustomCard from "../../components/CustomCard";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getPrescriptionsData } from "../../services/medicalRecord";
import { ActivityIndicator } from "react-native-paper";
import Colors from "../../configs/Colors";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import ListEmpty from "../../components/ListEmpty";
import { useToast } from "../../configs/ToastConfig";

const Prescriptions = () => {
  const navigation = useNavigation();
  const [Loading, setLoading] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState([]);
  const { errorToast } = useToast();
  const [isActive, setIsActive] = useState(true);
  const [countHeader, setCountHeader] = useState({});

  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  const [prescriptionDataLength, setPrescriptionDataLength] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // const subscribe = navigation.addListener("focus", () => {
    setLoading(true);
    setPage(1);
    loadData(1);
    // });

    // return subscribe;
  }, []);

  const loadData = (count) => {
    let reqObj = {
      page_no: count,
      zoo_id: zooID,
    };
    getPrescriptionsData(reqObj)
      .then((res) => {
        setCountHeader(res.data);
        let dataArr = count == 1 ? [] : prescriptionData;
        setPrescriptionDataLength(
          res.data?.prescription_list ? res.data?.prescription_list.length : 0
        );
        if (res.data.prescription_list) {
          setPrescriptionData(dataArr.concat(res.data?.prescription_list));
        }

        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (!Loading && prescriptionDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  const renderFooter = () => {
    if (Loading || prescriptionDataLength == 0 || prescriptionDataLength < 10)
      return null;
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
        title="Prescriptions"
        noIcon={true}
        search={true}
        gotoSearchPage={() => navigation.navigate("InsightSearching")}
        // style={{
        //   paddingBottom: widthPercentageToDP("3%"),
        //   paddingTop: widthPercentageToDP("2%"),
        // }}
      />

      <View style={reduxColors.card}>
        <TouchableOpacity
          onPress={() => setIsActive(true)}
          style={reduxColors.cardBody}
          disabled={true}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={reduxColors.cardText}>
              {countHeader?.prescription_total}
            </Text>
            <Text style={reduxColors.cardBottomText}>Prescriptions</Text>
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
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <FlatList
          data={prescriptionData}
          keyExtractor={(item, index) => item?.prescription_id}
          ListEmptyComponent={<ListEmpty visible={Loading} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => {
            return (
              <View style={{}}>
                <CustomCard
                  title={item.prescription_name}
                  icon={"assets/class_images/default_animal.svg"}
                  onPress={() => {
                    navigation.navigate(
                      "PrescriptionAnimal",
                      (item = { item })
                    );
                  }}
                  count={item.count}
                  style={{ minHeight: 60 }}
                />
              </View>
            );
          }}
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
      shadowColor: "rgba(0,0,0,0.1)",
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

export default Prescriptions;
