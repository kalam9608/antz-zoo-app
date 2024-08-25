// Name: Ganesh Aher
// Date:25 May
// work: Design and API implimented

import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import { getDeletedAnimalList } from "../../services/AnimalService";
import FloatingButton from "../../components/FloatingButton";
import AnimalListCard from "../../components/AnimalListCard";
import {
  capitalize,
  checkPermissionAndNavigateWithAccess,
  ifEmptyValue,
} from "../../utils/Utils";
import Colors from "../../configs/Colors";
import ListEmpty from "../../components/ListEmpty";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { errorToast } from "../../utils/Alert";

const DeletedAnimalList = (props) => {
  const navigation = useNavigation();
  const [eggList, setEggList] = useState([]);
  const [isLoading, setIsLoding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const user_id = useSelector((state) => state.UserAuth.userDetails.user_id);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const currentTheme = useSelector((state) => state.darkMode.theme);
  const permission = useSelector((state) => state.UserAuth.permission);
  const [page, setPage] = useState(1);
  const [animalListDataLength, setAnimalListDataLength] = useState([]);
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
    getDeletedAnimalList(obj)
      .then((res) => {
        let dataArr = page == 1 ? [] : eggList;
        setAnimalListDataLength(res.data.length);
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
    if (!isLoading && animalListDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      getData(nextPage);
    }
  };
  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (isLoading || animalListDataLength == 0 || animalListDataLength < 10)
      return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const reduxColors = styles(constThemeColor);
  return (
    <>
      <Header noIcon={true} title={"Deleted Animals"} />
      <Loader visible={isLoading} />
      <View
        style={[
          styles.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        <FlatList
          data={eggList}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <AnimalCustomCard
              item={item}
              show_housing_details={true}
              show_specie_details={true}
              // image ={true}
              chips={item.sex}
              icon={item.default_icon}
              enclosureName={item.user_enclosure_name}
              sectionName={item.section_name}
              animalName={
                item?.default_common_name
                  ? item?.default_common_name
                  : item?.scientific_name
              }
              animalIdentifier={
                !item?.local_identifier_value
                  ? item?.animal_id
                  : item?.local_identifier_name ?? null
              }
              localID={item?.local_identifier_value ?? null}
              rightIcon={
                <View>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={24}
                    color={constThemeColor.onSurfaceVariant}
                  />
                </View>
              }
              onPress={() =>
                checkPermissionAndNavigateWithAccess(
                  permission,
                  "collection_animal_record_access",
                  navigation,
                  "AnimalsDetails",
                  {
                    animal_id: item.animal_id,
                    enclosure_id: item.enclosure_id,
                    deleted: true,
                  },
                  "VIEW"
                )
              }
            />
            // <AnimalListCard
            //   title={ifEmptyValue(capitalize(item.vernacular_name))}
            //   subtitle={
            //     item.local_id == "" || item.local_id == null
            //       ? "Animal Id: " + ifEmptyValue(item.animal_id)
            //       : "Local Id: " + ifEmptyValue(item.local_id)
            //   }
            //   UserEnclosureName={
            //     "Enclosure: " + ifEmptyValue(item.user_enclosure_name)
            //   }
            //   onPress={() =>
            //     navigation.navigate("AnimalsDetails", {
            //       animal_id: item.animal_id,
            //       enclosure_id: item.enclosure_id,
            //       deleted: true,
            //     })
            //   }
            // />
          )}
          keyExtractor={(item) => item.animal_id}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={<ListEmpty visible={isLoading} />}
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    paddingHorizontal: 12,
  },
});

export default DeletedAnimalList;
