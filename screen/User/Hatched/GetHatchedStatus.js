import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { getHatchedStatus } from "../../../services/HatchService";

import Loader from "../../../components/Loader";
import Header from "../../../components/Header";
import FontSize from "../../../configs/FontSize";
import { useToast } from "../../../configs/ToastConfig";

const GetHatchedStatus = ({ route }) => {
  const { itemId } = route.params;
  const [hatchDetails, setHatchDetails] = useState([]);
  const { successToast, errorToast, } = useToast();
  useEffect(() => {
    getHatchedStatus({ itemId: itemId })
      .then((response) => {
        setHatchDetails(response);
      })
      .catch((error) => errorToast("error","Oops! Something went wrong!!"));
  }, []);

  return (
    <>
      <View style={styles.container}>
        {!hatchDetails.is_success ? (
          <Loader
            loaderColor="primary.500"
            loaderSize="lg"
            loaderText="Loading..."
            loaderTextStyle={{
              fontSize: FontSize.Antz_Medium_Medium.fontSize,
              color: "red",
              marginLeft: 6,
            }}
            flexDirection="column"
          />
        ) : (
          <View style={styles.outerContainer}>
            <Header noIcon={true} title={"Get Hatched Status"} />
            {!hatchDetails.hasOwnProperty("data") ? (
              <Loader
                loaderColor="primary.500"
                loaderSize="lg"
                loaderText="Loading..."
                loaderTextStyle={{
                  fontSize: FontSize.Antz_Medium_Medium.fontSize,
                  color: "red",
                  marginLeft: 6,
                }}
                flexDirection="column"
              />
            ) : (
              <View style={styles.innerContainer}>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Id:</Text>
                  <Text>{hatchDetails.data.id}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Hatched Type:</Text>
                  <Text>{hatchDetails.data.hatched_type}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Hatched Key:</Text>
                  <Text>{hatchDetails.data.hatched_key}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>String Id:</Text>
                  <Text>{hatchDetails.data.string_id}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Active:</Text>
                  <Text>{hatchDetails.data.active}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Comment:</Text>
                  <Text>{hatchDetails.data.comment}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Created By:</Text>
                  <Text>{hatchDetails.data.created_by}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Created At:</Text>
                  <Text>{hatchDetails.data.created_at}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Updated By:</Text>
                  <Text>{hatchDetails.data.updated_by}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ marginHorizontal: 5 }}>Updated At:</Text>
                  <Text>{hatchDetails.data.updated_at}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    padding: "2%",
    borderWidth: 1,
    borderColor: "darkgrey",
    marginVertical: "10%",
  },
  cardItem: {
    marginVertical: "1%",
  },
  loader: {
    marginTop: "50%",
  },
  outerContainer: {
    flex: 1,
  },
  innerContainer: {
    backgroundColor: "rgba(100,100,100,0.2)",
    alignItems: "center",
    padding: "10%",
    marginVertical: 20,
    marginHorizontal: 10,
    justifyContent: "center",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    // width:width*0.8,
    justifyContent: "space-between",
  },
});

export default GetHatchedStatus;
