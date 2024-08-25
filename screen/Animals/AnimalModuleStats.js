/**
 * Created By: Joseph Gerald J
 * Created On: 22/08/23
 */

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import { getAnimalStats } from "../../services/AnimalService";
import { useSelector } from "react-redux";
import ListEmpty from "../../components/ListEmpty";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import SearchOnPage from "../../components/searchOnPage";
import { errorToast } from "../../utils/Alert";
import CustomCard from "../../components/CustomCard";
import { Duration, AnimalStatsType } from "../../configs/Config";
import { useToast } from "../../configs/ToastConfig";
import { getAsyncData } from "../../utils/AsyncStorageHelper";

const AnimalModuleStats = () => {
  const navigation = useNavigation();
  const [animalStats, setAnimalStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isHideStats, setIsHideStats] = useState(null);

  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const permission = useSelector((state) => state.UserAuth.permission);
  const { showToast } = useToast();

  // useEffect(() => {
  //   setIsLoading(true);
  //   loadAnimalStatsData();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getHideStatsValue();
    }, [])
  );

  const getHideStatsValue = async () => {
    const value = await getAsyncData("@antz_hide_stats");
    setIsHideStats(value);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      loadAnimalStatsData();
    });
    return unsubscribe;
  }, []);

  const loadAnimalStatsData = () => {
    getAnimalStats()
      .then((res) => {
        setIsLoading(false);
        setRefreshing(false);
        if (res.data) {
          setAnimalStats(res.data);
        }
      })
      .catch((err) => {
        showToast("error", "Oops! Something went wrong!");
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const goToAnimalList = () => {
    navigation.navigate("AnimalList", {
      type: AnimalStatsType.allAnimals,
      name: "All Animals",
    });
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const refInput = React.useRef(null);

  return (
    <>
      <Header title={"Animals"} noIcon={true} />
      <Loader visible={isLoading} />
      <View
        style={[
          reduxColors.container,
          { backgroundColor: constThemeColor.surfaceVariant },
        ]}
      >
        <TouchableOpacity onPress={goToAnimalList}>
          <View pointerEvents={"none"}>
            <SearchOnPage
              placeholderText={"Search animals"}
              searchModalText=""
            />
          </View>
        </TouchableOpacity>
        <View style={{ marginBottom: Spacing.small }}></View>
        <View style={reduxColors.listSection}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={animalStats}
              renderItem={({ item }) => (
                <CustomCard
                  hideBackgroundImage={
                    item?.type == "recently_added" ? "" : "show"
                  }
                  showWaterMark = {true}
                  title={item?.label}
                  count={!isHideStats && item?.show_count ? item?.count : ""}
                  onPress={() =>
                    navigation.navigate("AnimalList", {
                      type: item?.type,
                      name: item?.label,
                    })
                  }
                />
              )}
              ListEmptyComponent={<ListEmpty visible={isLoading} />}
              keyExtractor={(item) => item.type}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    loadAnimalStatsData();
                  }}
                />
              }
            />
          </View>
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
      paddingHorizontal: Spacing.minor,
    },
    listSection: {
      flex: 1,
    },
  });

export default AnimalModuleStats;
