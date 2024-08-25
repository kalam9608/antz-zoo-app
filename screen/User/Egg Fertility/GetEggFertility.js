import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Loader from "../../../components/Loader";
import Header from "../../../components/Header";
import { getEggFertilityByID } from "../../../services/EggFartilityService";
import Spacing from "../../../configs/Spacing";

const { width, height } = Dimensions.get("window");

const GetEggFertility = ({ route }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getEggFertilityByID(route.params.id)
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header noIcon={true} title={`Egg Fertility Details`} />
      {isLoading ? (
        <Loader loaderSize={"lg"} />
      ) : (
        <View style={styles.container}>
          {!data.is_success ? (
            <View>
              <Text>No data Found</Text>
            </View>
          ) : (
            <View style={styles.innerContainer}>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Id:</Text>
                <Text>#{data.data.fertility_id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Code:</Text>
                <Text>{data.data.code}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Description:</Text>
                <Text>{data.data.description}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Created at:</Text>
                <Text>{data.data.created_at}</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    backgroundColor: "rgba(100,100,100,0.2)",
    alignItems: "center",
    padding: Spacing.small,
    marginVertical: 20,
    marginHorizontal: 10,
    width: width * 0.9,
    height: height * 0.5,
    justifyContent: "space-evenly",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    width: width * 0.8,
    justifyContent: "space-between",
  },
});

export default GetEggFertility;
