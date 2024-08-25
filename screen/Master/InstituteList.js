import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import FloatingButton from "../../components/FloatingButton";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";

import ListComponent from "../../components/ListComponent";
import { useSelector } from "react-redux";
import ListEmpty from "../../components/ListEmpty";
import { capitalize, ifEmptyValue } from "../../utils/Utils";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RefreshControl } from "react-native";
import { instituteList } from "../../services/MedicalMastersService";
import { useToast } from "../../configs/ToastConfig";

const InstituteList = () => {
  const [instituteData, setInstituteData] = useState([]);
  const [instituteDataLength, setInstituteDataLength] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      getRefreshData(1);
      setPage(1);
    });
    return unsubscribe;
  }, [navigation]);

  const getRefreshData = (count) => {
    instituteList({ page_no: count })
      .then((res) => {
        let dataArr = count == 1 ? [] : instituteData;
        setInstituteDataLength(res.data ? res.data.length : 0);
        if (res.data) {
          setInstituteData(dataArr.concat(res.data));
        }

        setRefreshing(false);
        setIsLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setRefreshing(false);
        setIsLoading(false);
      });
  };
  // pagination
  const handleLoadMore = () => {
    if (!isLoading && instituteDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      getRefreshData(nextPage);
    }
  };

  const renderFooter = () => {
    if (isLoading || instituteDataLength == 0 || instituteDataLength < 10)
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  const InnerComponent = ({ item }) => {
    const { id, label, string_id, description } = item.item;
    return (
      <View style={{ padding: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <Text>Id : </Text>
          <Text>{ifEmptyValue(id)}</Text>
        </View>
        <View style={{ flexDirection: "row", width: wp(80) }}>
          <Text>Name : </Text>
          <Text>{ifEmptyValue(label)}</Text>
        </View>
        <View style={{ flexDirection: "row", width: wp(70) }}>
          <Text>Description : </Text>
          <Text>{ifEmptyValue(description)}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Loader visible={isLoading} />
      <Header noIcon={true} title={"Institutes"} />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: isSwitchOn
              ? constThemeColor.onSecondaryContainer
              : constThemeColor.surfaceVariant,
          },
        ]}
      >
        <View style={reduxColors.listSection}>
          <FlatList
            data={instituteData}
            renderItem={(item) => (
              <ListComponent
                item={item}
                // onPress={() => navigation.navigate("editInstituteData")}
              >
                <InnerComponent item={item} />
              </ListComponent>
            )}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={<ListEmpty visible={isLoading} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  getRefreshData(1);
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
            onPress={() => navigation.navigate("AddInstitute")}
          />
        </View>
      </View>
    </>
  );
};

export default InstituteList;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 8,
    },
    listSection: {
      flex: 1,
    },
    idNumber: {
      paddingLeft: 2,
    },
  });
