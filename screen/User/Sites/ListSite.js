// Modify By Wasim Akram at 08/05/2023
// navigation add to navigate Editsite screen and item pass to that screen

/**
 * Modified By: gaurav shukla
 * Modification Date: 15/05/23
 *
 * Modification: Added pagination in the listing
 */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import FloatingButton from "../../../components/FloatingButton";
import Loader from "../../../components/Loader";
import Header from "../../../components/Header";
import { useNavigation } from "@react-navigation/native";
import ListComponent from "../../../components/ListComponent";
import { useSelector } from "react-redux";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { dateFormatter } from "../../../utils/Utils";
import ListEmpty from "../../../components/ListEmpty";
import { capitalize, ifEmptyValue } from "../../../utils/Utils";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RefreshControl } from "react-native";
import { errorToast } from "../../../utils/Alert";
import Spacing from "../../../configs/Spacing";

const ListSite = () => {
  const [siteData, setSiteData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const site = useSelector((state) => state.UserAuth.zoos);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      getRefreshData();
    });
    return unsubscribe;
  }, [navigation]);

  const getRefreshData = () => {
    setSiteData(site[0].sites);
  };

  const InnerComponent = ({ item }) => {
    const {
      site_id,
      site_name,
      site_description,
      status,
      created_at,
      modified_at,
    } = item.item;
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <Text>Id : </Text>
          <Text>{ifEmptyValue(site_id)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Site Name : </Text>
          <Text>{ifEmptyValue(site_name)}</Text>
        </View>
        <View style={{ flexDirection: "row", width: wp(70) }}>
          <Text>Description : </Text>
          <Text>{ifEmptyValue(site_description)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Status : </Text>
          <Text>{ifEmptyValue(capitalize(status))}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Created On:</Text>
          <Text style={styles.idNumber}>
            {dateFormatter(created_at, "MMM Do YY") ?? "NA"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Modified On:</Text>
          <Text style={styles.idNumber}>
            {dateFormatter(modified_at, "MMM Do YY") ?? "NA"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Loader visible={isLoading} />
      <Header noIcon={true} title={"Sites"} />
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
            data={siteData}
            renderItem={(item) => (
              <ListComponent
                item={item}
                onPress={() => navigation.navigate("EditSite", { site: item })}
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
            onPress={() => navigation.navigate("CreateSite")}
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

export default ListSite;
