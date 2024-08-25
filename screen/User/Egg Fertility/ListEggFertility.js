import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import ListComponent from "../../../components/ListComponent";
import Loader from "../../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import FloatingButton from "../../../components/FloatingButton";
import Header from "../../../components/Header";
import { getEggFertility } from "../../../services/EggFartilityService";
import { useSelector } from "react-redux";

const ListEggFertility = () => {
  const navigation = useNavigation();
  const [eggFertility, seteggFertility] = useState([]);
  const [isLoading, setIsLoding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getRefreshData();
    });
    return unsubscribe;
  }, [navigation]);

  const getRefreshData = () => {
    setRefreshing(true);
    setIsLoding(true);
    getEggFertility()
      .then((res) => {
        seteggFertility(res.data);
        // return res;
      })
      .finally(() => {
        setRefreshing(false);
        setIsLoding(false);
      });
  };

  const editFertility = (item) => {};

  const deleteFertility = (item) => {};

  const InnerList = ({ item }) => {
    const { fertility_id, description, created_at, code, string_id } =
      item.item;
    return (
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <View style={styles.innerHeader}>
            <Text>ID:</Text>
            <Text style={styles.idNumber}>{`#${fertility_id}`}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Desc :</Text>
          <Text style={styles.idNumber}>{description}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>String Id:</Text>
          <Text style={styles.idNumber}>{string_id}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Code:</Text>
          <Text style={styles.idNumber}>{code}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Created at:</Text>
          <Text style={styles.idNumber}>{created_at}</Text>
        </View>
      </View>
    );
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);

  return (
    <View style={{ flex: 1, backgroundColor: constThemeColor.onPrimary }}>
      <Header noIcon={true} title={"Egg Fertility Type"} />
      <View style={{ flex: 1 }}>
        {isLoading || refreshing ? (
          <Loader />
        ) : (
          <View style={styles.container}>
            <FlatList
              data={eggFertility}
              renderItem={(item) => (
                <ListComponent
                  item={item}
                  onPressEdit={editFertility}
                  onPressDelete={deleteFertility}
                  onPress={() =>
                    navigation.navigate("GetEggFertility", {
                      id: item.item.fertility_id,
                    })
                  }
                >
                  <InnerList item={item} />
                </ListComponent>
              )}
              keyExtractor={(item) => item.fertility_id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={getRefreshData}
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
              onPress={() => navigation.navigate("AddEggFertility")}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    // backgroundColor:'rgba(0,0,0,0.2)'
  },
});

export default ListEggFertility;
