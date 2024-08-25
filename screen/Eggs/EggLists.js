/**
 * Modified By: gaurav shukla
 * Modification Date: 15/05/23
 *
 * Modification: Added pagination in the listing
 */

import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import { getEggsList } from "../../services/EggsService";
import FloatingButton from "../../components/FloatingButton";
import Colors from "../../configs/Colors";
import { ActivityIndicator } from "react-native-paper";
import ListEmpty from "../../components/ListEmpty";
import { checkPermissionAndNavigateWithAccess } from "../../utils/Utils";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import EggListCard from "../../components/EggListCard";
import Spacing from "../../configs/Spacing";
import {
  removeParentAnimal,
  setDestination,
} from "../../redux/AnimalMovementSlice";
import DragDrop from "../../components/DragDrop";

const EggLists = (props) => {
  const navigation = useNavigation();

  const [eggList, setEggList] = useState([]);
  const [isLoading, setIsLoding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const currentTheme = useSelector((state) => state.darkMode.theme);
  const [page, setPage] = useState(1);
  const [eggListDataLength, setEggListDataLength] = useState([]);
  const permission = useSelector((state) => state.UserAuth.permission);
  const dispatch = useDispatch();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoding(true);
      setPage(1);
      getData(1);
    });
    return unsubscribe;
  }, [navigation]);

  const getData = (page) => {
    let obj = {
      zoo_id: zooID,
      page_no: page,
    };

    getEggsList(obj)
      .then((res) => {
        let dataArr = page == 1 ? [] : eggList;
        setEggListDataLength(res.data.length);
        if (res.data) {
          setEggList(dataArr.concat(res.data));
        }
        setIsLoding(false);
        setRefreshing(false);
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
        setIsLoding(false);
        setRefreshing(false);
      });
  };

  const handleLoadMore = () => {
    if (!isLoading && eggListDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      getData(nextPage);
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (isLoading || eggListDataLength == 0 || eggListDataLength < 10)
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <Header noIcon={true} title={"Eggs"} />
      <Loader visible={isLoading} />
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: isSwitchOn
                ? currentTheme.colors.background
                : constThemeColor.background,
            },
          ]}
        >
          <FlatList
            data={eggList}
            onEndReachedThreshold={0.4}
            renderItem={({ item }) => {
              return (
                <EggListCard
                  chips={item?.fertility_status_label}
                  eggStatus={item?.fertility_status_label}
                  key={"#" + item.egg_id}
                  animalIdentifier={item?.egg_id}
                  icon={item.default_icon}
                  enclosureName={item.user_enclosure_name}
                  animalName={
                    item?.common_name
                      ? item?.common_name
                      : item?.scientific_name
                  }
                  sectionName={item?.section_name}
                  onPress={() =>
                    navigation.navigate("EggDetails", { item: item })
                  }
                />
              );
            }}
            keyExtractor={(item) => item.egg_id}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<ListEmpty visible={isLoading} />}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  setPage(1);
                  getData(1);
                }}
              />
            }
          />
          {/* <DragDrop> */}
          <FloatingButton
            icon="plus-circle-outline"
            backgroundColor={constThemeColor.flotionBackground}
            borderWidth={0}
            borderColor={constThemeColor.flotionBorder}
            borderRadius={50}
            linkTo=""
            floaterStyle={{ height: 60, width: 60 }}
            onPress={() => {
              checkPermissionAndNavigateWithAccess(
                permission,
                "collection_animal_record_access",
                navigation,
                "EggsAddForm",
                "",
                "ADD"
              );
              dispatch(setDestination([]));
              dispatch(removeParentAnimal());
            }}
          />
          {/* </DragDrop> */}
        </View>
      </View>
    </View>
  );
};

const style = (reduxColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
    },
    imageSection: {
      marginHorizontal: wp(4),
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
    cardLabel: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColor?.onSurfaceVariant,
      marginRight: wp(2),
    },
    idNumber: {
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      color: reduxColor.onSurfaceVariant,
    },
    icon: {
      position: "absolute",
      right: 0,
    },
  });

export default EggLists;
