/**
 * Modified By: gaurav shukla
 * Modification Date: 15/05/23
 *
 * Modification: Added pagination in the listing
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  Linking,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import { Ionicons } from "@expo/vector-icons";
import FloatingButton from "../../components/FloatingButton";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import Colors from "../../configs/Colors";
import { getSectionwithPagination } from "../../services/CreateSectionServices";
import { ActivityIndicator } from "react-native-paper";
import { dateFormatter } from "../../utils/Utils";
import ListEmpty from "../../components/ListEmpty";
import { ifEmptyValue } from "../../utils/Utils";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { useToast } from "../../configs/ToastConfig";

const ListSection = () => {
  const navigation = useNavigation();
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [sectionData, setSectionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const currentTheme = useSelector((state) => state.darkMode.theme);
  const [page, setPage] = useState(1);
  const [sectionDataLength, setSectionDataLength] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      setPage(1);
      fetchSectionData(1);
    });
    return unsubscribe;
  }, [navigation]);

  const fetchSectionData = (page) => {
    let postData = {
      zoo_id: zooID,
      page_no: page,
    };
    getSectionwithPagination(postData)
      .then((res) => {
        let dataArr = page == 1 ? [] : sectionData;
        setSectionDataLength(res.data.length);
        if (res.data) {
          setSectionData(dataArr.concat(res.data));
        }
        setIsLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
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
    navigation.navigate("SectionDetails", { section_id: id });
  };

  const SectionItem = ({ item }) => {
    const {
      section_id,
      section_name,
      animal_count,
      enclosure_count,
      incharge_name,
      section_incharge,
      section_description,
      created_at,
      section_latitude,
      section_longitude,
    } = item;
    return (
      <>
        <TouchableOpacity
          style={[
            styles.listContainer,
            Platform.OS != "ios" ? styles.shadow : null,
          ]}
          onPress={() => handelID(section_id)}
        >
          <View style={styles.header}>
            <View style={styles.innerHeader}>
              <Text>ID : </Text>
              <Text style={styles.idNumber} numberOfLines={1}>{`#${ifEmptyValue(
                section_id
              )}`}</Text>
            </View>
            <Ionicons
              onPress={() => openMap(section_latitude, section_longitude)}
              name="navigate"
              size={24}
              color="#00abf0"
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>Name : </Text>
            <Text style={styles.idNumber}>{ifEmptyValue(section_name)}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>Animal Count : </Text>
            <Text style={styles.idNumber}>{ifEmptyValue(animal_count)}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>Enclosure Count : </Text>
            <Text style={styles.idNumber}>{ifEmptyValue(enclosure_count)}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>Incharge Name : </Text>
            <Text style={styles.idNumber}>{ifEmptyValue(incharge_name)}</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const handleLoadMore = () => {
    if (!isLoading && sectionDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      setIsLoading(true);
      fetchSectionData(nextPage);
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (isLoading || sectionDataLength == 0 || sectionDataLength < 10)
      return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  return (
    <>
      <Header title="Sections" noIcon={true} />
      <Loader visible={isLoading} />
      <View
        style={[
          styles.container,
          {
            backgroundColor: isSwitchOn
              ? currentTheme.colors.background
              : Colors.background,
          },
        ]}
      >
        <View style={styles.listSection}>
          <FlatList
            data={sectionData}
            renderItem={({ item }) => <SectionItem item={item} />}
            keyExtractor={sectionData.id}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            ListEmptyComponent={<ListEmpty visible={isLoading} />}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.4}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  setPage(1);
                  fetchSectionData(1);
                }}
              />
            }
          />

          <FloatingButton
            icon="plus-circle-outline"
            backgroundColor="#eeeeee"
            borderWidth={0}
            borderColor="#aaaaaa"
            borderRadius={50}
            linkTo=""
            floaterStyle={{ height: 60, width: 60 }}
            onPress={() => navigation.navigate("Section")}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.small,
    paddingTop: Spacing.body,
  },
  titleSection: {
    marginTop: 14,
    alignSelf: "center",
  },
  title: {
    fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
    fontWeight: FontSize.Antz_Body_Title.fontWeight,
    paddingVertical: Spacing.body,
    color: "#000",
    lineHeight: 22,
  },
  listSection: {
    flex: 1,
    marginTop: Spacing.mini,
  },
  listContainer: {
    backgroundColor: "#ccc",
    marginVertical: Spacing.mini,
    borderRadius: 8,
    padding: Spacing.mini,
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
    fontWeight: "500",
  },
  shadow: {
    shadowOffset: {
      height: 10,
      width: 5,
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 1,
  },
});

export default ListSection;
