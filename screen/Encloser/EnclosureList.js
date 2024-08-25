import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  Linking,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { GetEnclosurewithPagination } from "../../services/FormEnclosureServices";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import FloatingButton from "../../components/FloatingButton";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native-paper";
import ListEmpty from "../../components/ListEmpty";
import { dateFormatter } from "../../utils/Utils";
import { ifEmptyValue } from "../../utils/Utils";
import { widthPercentageToDP } from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import { useToast } from "../../configs/ToastConfig";

const EnclosureList = () => {
  const navigation = useNavigation();

  const [enclosureData, setEnclosureData] = useState("");
  const [enclosureDataLength, setEnclosureDataLength] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const currentTheme = useSelector((state) => state.darkMode.theme);
  const [page, setPage] = useState(1);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const { showToast, successToast, errorToast, alertToast, warningToast } = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      setPage(1);
      loadData(1);
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = (page) => {
    let postData = {
      zoo_id: zooID,
      page_no: page,
    };
    GetEnclosurewithPagination(postData)
      .then((res) => {
        let dataArr = page == 1 ? [] : enclosureData;
        setEnclosureDataLength(res.data.length);
        if (res.data) {
          setEnclosureData(dataArr.concat(res.data));
        }
        setIsLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        errorToast("error","Oops! Something went wrong!");
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const openMap = (lat, lng) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${lat},${lng}`;
    const label = "Custom Label";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };

  const handelID = (id) => {
    navigation.navigate("EnclosureDetails", { enclosure_id: id });
  };

  const renderItem = (item) => {
    const {
      enclosure_id,
      enclosure_status,
      user_enclosure_name,
      enclosure_code,
      created_at,
      enclosure_desc,
      enclosure_environment,
      enclosure_sunlight,
      enclosure_lat,
      enclosure_long,
    } = item;
    // fot taking styles from redux use this function
    const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    const reduxColors = styles(constThemeColor);
    return (
      <TouchableOpacity
        style={[
          reduxColors.listContainer,
          Platform.OS != "ios" ? reduxColors.shadow : null,
        ]}
        onPress={() => handelID(enclosure_id)}
      >
        <View style={reduxColors.header}>
          <View style={reduxColors.innerHeader}>
            <Text>ID : </Text>
            <Text style={reduxColors.idNumber}>{`#${enclosure_id}`}</Text>
          </View>
          <Text>
            <Ionicons
              onPress={() => openMap(enclosure_lat, enclosure_long)}
              name="navigate"
              size={24}
              color={constThemeColor?.shadeOfCyan}
            />
          </Text>
          {/* <Text style={reduxColors.idNumber}>{enclosure_status}</Text> */}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Name :</Text>
          <Text style={reduxColors.idNumber}>
            {ifEmptyValue(user_enclosure_name)}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Code :</Text>
          <Text style={reduxColors.idNumber}>
            {ifEmptyValue(enclosure_code)}
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text>Description :</Text>
          <Text style={reduxColors.idNumber}>
            {ifEmptyValue(enclosure_desc)}
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text>Environment :</Text>
          <Text style={reduxColors.idNumber}>
            {ifEmptyValue(enclosure_environment)}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Sunlite :</Text>
          <Text style={reduxColors.idNumber}>
            {ifEmptyValue(enclosure_sunlight)}
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text>Created On : </Text>
          <Text style={reduxColors.idNumber}>
            {ifEmptyValue(dateFormatter(created_at, "MMM Do YY"))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleLoadMore = () => {
    if (!isLoading && enclosureDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (isLoading || enclosureDataLength == 0 || enclosureDataLength<10) return null;
    return <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />;
  };
  // fot taking styles from redux use this function
  
  return (
    <>
      <Header title="Enclosures" noIcon={true} />
      <Loader visible={isLoading} />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        <View style={reduxColors.listSection}>
          <FlatList
            data={enclosureData}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={<ListEmpty visible={isLoading || refreshing} />}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.4}
            keyExtractor={(item) => item.enclosure_id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  setPage(1);
                  loadData(1);
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
            onPress={() => navigation.navigate("CreateEnclosure")}
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
      paddingHorizontal: 10,
    },
    titleSection: {
      marginTop: 14,
      alignSelf: "center",
    },
    title: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      paddingVertical: 10,
      color: reduxColors.neutralPrimary,
      lineHeight: 22,
    },
    listSection: {
      flex: 1,
      marginTop: 15,
    },
    listContainer: {
      backgroundColor: reduxColors?.lightGrey,
      marginVertical: 5,
      borderRadius: 8,
      padding: 5,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    innerHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    idNumber: {
      marginLeft: 5,
      width: widthPercentageToDP(70),
    },
    shadow: {
      shadowOffset: {
        height: 10,
        width: 5,
      },
      shadowColor: reduxColors.blackWithPointEight,
      shadowOpacity: 1,
    },
  });

export default EnclosureList;
