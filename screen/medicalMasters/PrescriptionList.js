import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import FloatingButton from "../../components/FloatingButton";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";

import ListComponent from "../../components/ListComponent";
import { useSelector } from "react-redux";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { dateFormatter } from "../../utils/Utils";
import ListEmpty from "../../components/ListEmpty";
import { capitalize, ifEmptyValue } from "../../utils/Utils";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RefreshControl } from "react-native";
import {
  diagnosisList,
  prescriptionList,
} from "../../services/MedicalMastersService";
import Spacing from "../../configs/Spacing";
import { useToast } from "../../configs/ToastConfig";

const PrescriptionList = () => {
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      getRefreshData();
    });
    return unsubscribe;
  }, [navigation]);

  const getRefreshData = () => {
    prescriptionList(zooID)
      .then((res) => {
        setDiagnosisData(res);
        setRefreshing(false);
        setIsLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setRefreshing(false);
        setIsLoading(false);
      });
  };

  const InnerComponent = ({ item }) => {
    const { id, label, active, description } = item.item;
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <Text>Id : </Text>
          <Text>{ifEmptyValue(id)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Label : </Text>
          <Text>{ifEmptyValue(label)}</Text>
        </View>
        <View style={{ flexDirection: "row", width: wp(70) }}>
          <Text>Description : </Text>
          <Text>{ifEmptyValue(description)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Status : </Text>
          <Text>{active == "1" ? "Active" : "In-Active"}</Text>
        </View>
      </View>
    );
  };
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      <Loader visible={isLoading} />
      <Header noIcon={true} title={"Prescriptions"} />
      <View
        style={[
          reduxColors.container,
          { backgroundColor: constThemeColor.surfaceVariant },
        ]}
      >
        <View style={reduxColors.listSection}>
          <FlatList
            data={diagnosisData}
            renderItem={(item) => (
              <ListComponent
                item={item}
                onPress={() =>
                  navigation.navigate("editPrescription", { item: item })
                }
              >
                <InnerComponent item={item} />
              </ListComponent>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<ListEmpty visible={isLoading} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  getRefreshData();
                }}
              />
            }
          />

          <FloatingButton
            icon="plus-circle-outline"
            backgroundColor={constThemeColor.flotionBackground}
            borderWidth={0}
            borderColor={constThemeColor.flotionBorder}
            borderRadius={50}
            linkTo=""
            floaterStyle={{ height: 60, width: 60 }}
            onPress={() => navigation.navigate("addprescription")}
          />
        </View>
      </View>
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
      paddingHorizontal: Spacing.small,
    },
    listSection: {
      flex: 1,
    },
    idNumber: {
      paddingLeft: Spacing.micro,
    },
  });

export default PrescriptionList;
