import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import Header from "../../../components/Header";
import { getAccessionType } from "../../../services/AccessionService";
import Spacing from "../../../configs/Spacing";

const { width, height } = Dimensions.get("window");

const GetAccession = ({ route }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAccessionType(route.params.id)
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader loaderSize={"lg"} />
      ) : (
        <View style={styles.container}>
          {!data.is_success ? (
            <View>
              <Text>No data Found</Text>
            </View>
          ) : (
            <View>
              <Header title="Accession Type Details" noIcon={true} />
              <View style={[styles.innerContainer]}>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Accession Id:</Text>
                  <Text>{data.data.accession_id}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Accession Key:</Text>
                  <Text>{data.data.accession_key}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Accession Type:</Text>
                  <Text>{data.data.accession_type}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Active:</Text>
                  <Text>{data.data.active}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Comment:</Text>
                  <Text>{data.data.comment}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Created At:</Text>
                  <Text>{data.data.created_at}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Created By:</Text>
                  <Text>{data.data.created_by}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>String ID:</Text>
                  <Text>{data.data.string_id}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Updated At:</Text>
                  <Text>{data.data.updated_at}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Updated By:</Text>
                  <Text>{data.data.updated_by}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  innerContainer: {
    backgroundColor: "rgba(100,100,100,0.2)",
    alignItems: "center",
    padding: Spacing.small,
    marginVertical: 20,
    marginHorizontal: "10%",
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

export default GetAccession;
