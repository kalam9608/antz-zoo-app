// Created by -->> Sharad Yaduvanshi  //
// date --->>  24/02/023   //
// this is scanner page ---> //

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useIsFocused } from "@react-navigation/native";
import { errorToast } from "../utils/Alert";

const windowScreenWidth = Dimensions.get("screen").width;
const windowScreenHeight = Dimensions.get("screen").height;
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const QRCodeScanner = ({ route }) => {
  const isFocused = useIsFocused();
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not started yet");
  const navigation = useNavigation();

  const askForCameraScanner = () => {
    (async () => {
      BarCodeScanner.requestPermissionsAsync()
        .then((result) => {
          if (result.status === "granted") {
            setScanned(true);
          } else {
            Alert.alert("Please give the permission");
          }
        })
        .catch((error) => errorToast("Oops!", "Something went wrong!!"));
    })();
  };
  useEffect(() => {
    if (isFocused) {
      askForCameraScanner();
    } else {
      setScanned(false);
    }
  }, [isFocused]);
  const handleBarCodeScanner = ({ type, data }) => {
    setText(data);
    setScanned(false);
    try {
      const parseData = JSON.parse(data);
      if (parseData?.type === "enclosure") {
        gotoBack();
        navigation.navigate("OccupantScreen", {
          enclosure_id: parseData?.enclosure_id,
        });
      } else if (parseData?.type === "section") {
        gotoBack();
        navigation.navigate("HousingEnclosuer", {
          section_id: parseData?.section_id,
        });
      } else if (parseData?.type === "animal") {
        gotoBack();
        navigation.navigate("AnimalsDetails", {
          animal_id: parseData?.animal_id,
          enclosure_id: parseData?.enclosure_id,
        });
      } else if (parseData?.type === "user") {
        gotoBack();
        navigation.navigate("UserDetails", {
          user_id: parseData?.user_id,
        });
      } else {
        alert("Wrong QR code scanned!!");
        gotoBack();
      }
    } catch {
      alert("Wrong QR code scanned!!");
      gotoBack();
    }
  };

  const gotoBack = () => {
    setScanned(false);
    navigation.goBack();
  };

  return (
    <View style={Styles.container}>
      <View>
        <Text style={{ fontSize: 36, color: "white", top: "60%" }}>
          Scanning...
        </Text>
      </View>
      <View
        style={{
          alignItems: "center",
          marginTop: "auto",
          marginBottom: "auto",
          width: windowWidth,
          height: "100%",
        }}
      >
        <View style={[Styles.container1]}>
          <View style={Styles.child1}></View>
          <View style={Styles.child2}></View>
        </View>

        <View style={Styles.qrCodeSacnBox}>
          <View style={Styles.line} />
          {scanned && (
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanner}
              style={{ width: 450, height: 500 }}
            />
          )}
        </View>

        <View style={[Styles.container2]}>
          <View style={Styles.child3}></View>
          <View style={Styles.child4}></View>
        </View>
      </View>
      <TouchableOpacity
        style={Styles.cancelButtonText}
        onPress={() => {
          setScanned(false);
          navigation.goBack();
        }}
      >
        <Text
          style={{
            fontSize: 60,
            color: "white",
          }}
        >
          x
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QRCodeScanner;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#24595F",
    justifyContent: "space-around",
  },
  container1: {
    width: "80%",
    flex: 1 / 2,
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    top: "24%",
  },
  container2: {
    width: "80%",
    flex: 1 / 2,
    justifyContent: "space-between",
    flexDirection: "row",
    top: "63%",
    alignItems: "center",
  },
  line: {
    width: "100%",
    zIndex: 1,
    justifyContent: "center",
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    borderTopWidth: 1.5,
    borderColor: "#99aaff",
  },
  child1: {
    width: 100,
    height: 100,
    borderLeftWidth: 2.5,
    borderTopWidth: 2.5,
    borderTopLeftRadius: 50,
    borderColor: "#6680FF",
  },
  child2: {
    width: 100,
    height: 100,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderTopRightRadius: 50,
    borderColor: "#6680FF",
  },
  child3: {
    width: 100,
    height: 100,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    borderBottomLeftRadius: 50,
    borderColor: "#6680FF",
  },
  child4: {
    width: 100,
    height: 100,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomRightRadius: 50,
    borderColor: "#6680FF",
  },

  qrCodeSacnBox: {
    width: Math.floor((windowWidth * 68) / 100),
    height: Math.floor((windowWidth * 68) / 100),
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 30,
    position: "absolute",
    zIndex: 1,
    top: "26.3%",
  },

  cancelButtonText: {
    width: 100,
    height: 100,
    fontSize: 75,
    fontWeight: "100",
    bottom: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
});
