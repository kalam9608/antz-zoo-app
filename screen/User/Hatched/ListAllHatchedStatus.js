import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import ListComponent from "../../../components/ListComponent";
import Loader from "../../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import FloatingButton from "../../../components/FloatingButton";
import Header from "../../../components/Header";
import { listAllHatchedStatus } from "../../../services/HatchService";
import Spacing from "../../../configs/Spacing";

const ListAllHatchedStatus = () => {
  const navigation = useNavigation();
  const [allHatched, setAllHatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getRefreshData();
    });
    return unsubscribe;
  }, [navigation]);

  const getRefreshData = () => {
    setRefreshing(true);
    setIsLoading(true);
    listAllHatchedStatus()
      .then((res) => {
        setAllHatched(res.data);
        // return res;
      })
      .finally(() => {
        setRefreshing(false);
        setIsLoading(false);
      });
  };

  const editExperienceData = ({ item }) => {};

  const deleteExperienceData = ({ item }) => {};

  const InnerList = ({ item }) => {
    const {
      id,
      active,
      comment,
      created_at,
      created_by,
      hatched_key,
      hatched_type,
      string_id,
      updated_at,
      updated_by,
    } = item.item;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.innerHeader}>
            <Text>ID:</Text>
            <Text style={styles.idNumber}>{id}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Active:</Text>
          <Text style={styles.idNumber}>{active}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Comment:</Text>
          <Text style={styles.idNumber}>{comment}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Created at:</Text>
          <Text style={styles.idNumber}>{created_at}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Created by:</Text>
          <Text style={styles.idNumber}>{created_by}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Hatched key:</Text>
          <Text style={styles.idNumber}>{hatched_key}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Hatched type:</Text>
          <Text style={styles.idNumber}>{hatched_type}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>String id:</Text>
          <Text style={styles.idNumber}>{string_id}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Updated at:</Text>
          <Text style={styles.idNumber}>{updated_at}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Updated by:</Text>
          <Text style={styles.idNumber}>{updated_by}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header noIcon={true} title={"List all hatched status"} />
      <View style={{ flex: 1 }}>
        {isLoading || refreshing ? (
          <Loader />
        ) : (
          <View style={styles.container}>
            <FlatList
              data={allHatched}
              renderItem={(item) => (
                <ListComponent
                  item={item}
                  onPress={() =>
                    navigation.navigate("GetHatchedStatus", {
                      itemId: item.item.id,
                    })
                  }
                  onPressDelete={() => deleteExperienceData(item)}
                  onPressEdit={() => editExperienceData(item)}
                >
                  <InnerList item={item} />
                </ListComponent>
              )}
              keyExtractor={(item) => item.id}
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
              onPress={() => navigation.navigate("AddHatchedStatus")}
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
    paddingHorizontal: Spacing.small,
    paddingBottom: Spacing.small,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  innerHeader: {
    // flexDirection: 'row',
    // alignItems: 'center'
  },
  idNumber: {
    marginLeft: Spacing.mini,
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

export default ListAllHatchedStatus;
