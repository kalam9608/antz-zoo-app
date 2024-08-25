import { useState } from "react";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import * as Location from "expo-location";
import { CreateZoneService } from "../../services/CreateZoneService";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useToast } from "../../configs/ToastConfig";

export default function CreateZone() {
  const navigation = useNavigation();
  const [zoneName, setZoneName] = useState("");
  const [zoneDescription, setZoneDescription] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [loading, setLoding] = useState(false);
  const { successToast, errorToast, alertToast, warningToast } = useToast();

  const [isError, setIsError] = useState({
    zoneName: false,
    zoneDescription: false,
    longitude: false,
    latitude: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    zoneName: null,
    zoneDescription: null,
    longitude: null,
    latitude: null,
  });

  // const validation = () => {
  //     if (zoneName.trim().length === 0) {
  //         setIsError({ zoneName: true })
  //         setErrorMessage({ zoneName: "Enter The Name" })
  //         return false;
  //     } else if (zoneDescription.trim().length === 0) {
  //         setIsError({ zoneDescription: true })
  //         setErrorMessage({ zoneDescription: "Enter Description" })
  //         return false;
  //     } else if (longitude.trim().length === 0) {
  //         setIsError({ longitude: true })
  //         setErrorMessage({ longitude: "Enter The longitude" })
  //         return false;
  //     } else if (latitude.trim().length === 0) {
  //         setIsError({ latitude: true })
  //         setErrorMessage({ latitude: "Enter The latitude" })
  //         return false;
  //     }
  //     return true;
  // };

  const checkName = (str) => {
    let res = str.match(/^[A-Za-z / /]+$/) ? false : true;
    return res;
  };

  const getLocation = async () => {
    setLoding(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      warningToast("warning","Permission to access location was denied", "");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLongitude(location.coords.longitude.toString());
    setLatitude(location.coords.latitude.toString());
    setLoding(false);
  };

  const getZoneData = () => {
    setIsError({});
    setErrorMessage({});
    if (zoneName.trim().length === 0) {
      setIsError({ zoneName: true });
      setErrorMessage({ zoneName: "Enter Zone Name" });
      return false;
    } else if (checkName(zoneName)) {
      setIsError({ zoneName: true });
      setErrorMessage({
        zoneName: "institute name can contains only alphabets",
      });
      return false;
    } else if (
      zoneDescription.trim().length === 0 ||
      !nameRegex.test(zoneDescription)
    ) {
      setIsError({ zoneDescription: true });
      setErrorMessage({ zoneDescription: "Enter Description" });
      return false;
    } else if (longitude.trim().length === 0) {
      setIsError({ longitude: true });
      setErrorMessage({ longitude: "Enter The longitude" });
      return false;
    } else if (latitude.trim().length === 0) {
      setIsError({ latitude: true });
      setErrorMessage({ latitude: "Enter The latitude" });
      return false;
    } else {
      let obj = {
        zone_name: zoneName,
        zone_description: zoneDescription,
        zone_latitude: latitude,
        zone_longitude: longitude,
        site_id: 1,
      };
      setLoding(true);
      CreateZoneService(obj)
        .then((res) => {})
        .catch((err) => {
          errorToast("error","Oops! Something went wrong!");
        })
        .finally(() => {
          setLoding(false);
          navigation.navigate("Home");
          successToast("success","Created Zone Is Added Successfully");
        });
      setZoneName("");
      setZoneDescription("");
      setErrorMessage("");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <CustomForm header={true} title={"Create Zone"} onPress={getZoneData}>
          <InputBox
            inputLabel={"Name"}
            placeholder={"Enter Name"}
            errors={errorMessage.zoneName}
            isError={isError.zoneName}
            onChange={(value) => setZoneName(value)}
            value={zoneName}
          />
          <InputBox
            inputLabel={"Description"}
            placeholder={"Enter Description"}
            errors={errorMessage.zoneDescription}
            isError={isError.zoneDescription}
            onChange={(value) => setZoneDescription(value)}
            value={zoneDescription}
          />
          <InputBox
            inputLabel={"longitude"}
            placeholder={"longitude"}
            keyboardType={"numeric"}
            errors={errorMessage.longitude}
            isError={isError.longitude}
            value={longitude}
            onChange={(value) => setLongitude(value)}
          />
          <TouchableOpacity
            style={{
              width: "7%",
              alignItems: "center",
              marginHorizontal: "90%",
              bottom: "13%",
            }}
            onPress={getLocation}
          >
            <MaterialIcons name="my-location" size={23} color="grey" />
          </TouchableOpacity>
          <View style={{ bottom: 13 }}>
            <InputBox
              inputLabel={"latitude"}
              placeholder={"latitude"}
              keyboardType={"numeric"}
              errors={errorMessage.latitude}
              isError={isError.latitude}
              value={latitude}
              onChange={(value) => setLatitude(value)}
            />
            <TouchableOpacity
              style={{
                width: "7%",
                alignItems: "center",
                marginHorizontal: "90%",
                bottom: "45%",
              }}
              onPress={getLocation}
            >
              <MaterialIcons name="my-location" size={23} color="grey" />
            </TouchableOpacity>
          </View>
        </CustomForm>
      )}
    </>
  );
}
