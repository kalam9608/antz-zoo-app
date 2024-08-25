import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getIdProof } from "../../services/ClientService";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import { Dimensions } from "react-native";
import { errorToast } from "../../utils/Alert";

const { width, height } = Dimensions.get("window");
const GetClientidProof = ({ route }) => {
  const { itemId } = route.params;

  const [getData, setGetdata] = useState([]);
  const [isLoading, setIsLoding] = useState(false);

  useEffect(() => {
    setIsLoding(true);
    getIdProof({ itemId: itemId })
      .then((res) => {
        setGetdata(res);
      })
      .catch((error) => {
        // errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setIsLoding(false);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header title={"Id Proof Details"} noIcon={true} />
      {isLoading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          {!getData.is_success ? (
            <View>
              <Text>No Data Available!</Text>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Id:</Text>
                <Text>{getData.details.id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>id_name:</Text>
                <Text> {getData.details.id_name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>required:</Text>
                <Text> {getData.details.required}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>string_id:</Text>
                <Text> {getData.details.string_id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>client_id:</Text>
                <Text> {getData.details.client_id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>status:</Text>
                <Text> {getData.details.status}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>created_by:</Text>
                <Text> {getData.details.created_by}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>created_at:</Text>
                <Text>{getData.details.created_at}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>modified_at:</Text>
                <Text> {getData.details.modified_at}</Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(100,100,100,0.2)",
    alignItems: "center",
    padding: 8,
    width: width * 0.9,
    height: height * 0.5,
    justifyContent: "space-evenly",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    // backgroundColor: 'red',
    width: width * 0.8,
    justifyContent: "space-between",
    // alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default GetClientidProof;
