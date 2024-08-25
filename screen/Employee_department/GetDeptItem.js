import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { getDepartmentById } from "../../services/DepartmentServices";
import Loader from "../../components/Loader";
import Header from "../../components/Header";

const { width, height } = Dimensions.get("window");

const GetDeptItem = ({ route }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let itemId = route.params;
  useEffect(() => {
    setIsLoading(true);
    getDepartmentById({ itemId: itemId })
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
              <Header title="Department Details" noIcon={true} />
              <View style={[styles.innerContainer]}>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Department Id:</Text>
                  <Text>{data.details.dept_id}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Department Name:</Text>
                  <Text>{data.details.dept_name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Department Code:</Text>
                  <Text>{data.details.dept_code}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Created at:</Text>
                  <Text>{data.details.created_at}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Created by:</Text>
                  <Text>{data.details.created_by}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Modified at:</Text>
                  <Text>{data.details.modified_at}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Status:</Text>
                  <Text>{data.details.status}</Text>
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
    // paddingTop: 30,
    alignItems: "center",
  },

  innerContainer: {
    backgroundColor: "rgba(100,100,100,0.2)",
    alignItems: "center",
    padding: 8,
    marginVertical: 20,
    marginHorizontal: "10%",
    width: width * 0.9,
    height: height * 0.5,
    justifyContent: "space-evenly",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    // backgroundColor:'red',
    width: width * 0.8,
    justifyContent: "space-between",
    // marginHorizontal:20
  },
});

export default GetDeptItem;
