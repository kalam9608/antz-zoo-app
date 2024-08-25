import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { GetListDesignation } from "../../services/staffManagement/DesignationService";
import { useToast } from "../../configs/ToastConfig";

const { width, height } = Dimensions.get("window");

const DesignationDetail = ({ route }) => {
  const { successToast, errorToast, } = useToast();
  const [loading, setLoding] = useState(false);
  const [data, setData] = useState([]);

  let itemId = route.params;
  useEffect(() => {
    setLoding(true);
    GetListDesignation({ itemId: itemId })
      .then((res) => {
        setData(res.details);
      })
      .finally(() => {
        setLoding(false);
      })
      .catch((err) => {
        errorToast("error","Oops! Something went wrong!!");
      });
  }, []);
  return (
    <>
      {loading ? (
        <Loader loaderSize={"lg"} />
      ) : (
        <View style={styles.container}>
          <View>
            <Header title="Designation Details" noIcon={true} />
            <View style={[styles.innerContainer]}>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Id:</Text>
                <Text>{`#${data.designation_id}`}</Text>
              </View>
              {/* <Text style={styles.idNumber}>{data.status}</Text> */}
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Name:</Text>
                <Text>{data.designation_name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Code:</Text>
                <Text>{data.designation_code}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Created at:</Text>
                <Text>{data.created_at}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Status:</Text>
                <Text>{data.status}</Text>
              </View>
            </View>
          </View>
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

export default DesignationDetail;
