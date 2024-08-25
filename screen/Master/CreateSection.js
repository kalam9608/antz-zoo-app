//create by:Gaurav Shukla
// create on :1/03/2023

import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { CreateSection } from "../../services/CreateSectionServices";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { Alert, BackHandler } from "react-native";
import { useToast } from "../../configs/ToastConfig";

export default function CreateSectionForm() {
  const navigation = useNavigation();
  const [sectionName, setSectionName] = useState("");
  const [sectionCode, setSectionCode] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [loading, setLoding] = useState(false);
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const validation = () => {
    if (sectionName.trim().length === 0) {
      setIsError({ sectionName: true });
      setErrorMessage({ sectionName: "Enter The Name" });
      return false;
    } else if (sectionCode.trim().length === 0) {
      setIsError({ sectionCode: true });
      setErrorMessage({ sectionCode: "Enter The Code" });
      return false;
    } else if (longitude.trim().length === 0) {
      setIsError({ longitude: true });
      setErrorMessage({ longitude: "Enter The longitude" });
      return false;
    } else if (latitude.trim().length === 0) {
      setIsError({ latitude: true });
      setErrorMessage({ latitude: "Enter The latitude" });
      return false;
    }
    return true;
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLongitude(location.coords.longitude.toString());
    setLatitude(location.coords.latitude.toString());
    setLoding(false);
  };

  useEffect(() => {
    setLoding(true);
    getLocation();
  }, []);

  const getSectionData = () => {
    if (validation()) {
      // @TODO ADD SITES COMPONENTS AND UPDATE SITE_ID FIELD
      let obj = {
        section_name: sectionName,
        section_code: sectionCode,
        zoo_id: zooID,
        section_latitude: latitude,
        section_longitude: longitude,
        site_id: 1,
      };
      setLoding(true);
      CreateSection(obj)
        .then((res) => {})
        .finally(() => {
          setLoding(false);
          successToast("success","CreateSection Added Successfully");
          navigation.replace("HomeScreen");
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!!");
        });
    }
  };


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <CustomForm
          header={true}
          title={"Add Section"}
          onPress={getSectionData}
        >
          <InputBox
            inputLabel={"Name"}
            placeholder={"Enter Name"}
            errors={errorMessage.sectionName}
            isError={isError.sectionName}
            onChange={(value) => setSectionName(value)}
            value={sectionName}
          />
          <InputBox
            inputLabel={"Code"}
            placeholder={"Enter Code"}
            keyboardType={"numeric"}
            errors={errorMessage.sectionCode}
            isError={isError.sectionCode}
            onChange={(value) => setSectionCode(value)}
            value={sectionCode}
          />
          <InputBox
            inputLabel={"Longitude"}
            placeholder={"Longitude"}
            keyboardType={"numeric"}
            value={longitude}
            errors={errorMessage.longitude}
            isError={isError.longitude}
            onChange={(value) => setLongitude(value)}
          />
          <InputBox
            inputLabel={"Latitude"}
            placeholder={"Latitude"}
            keyboardType={"numeric"}
            errors={errorMessage.latitude}
            isError={isError.latitude}
            value={latitude}
            onChange={(value) => setLatitude(value)}
          />
        </CustomForm>
      )}
    </>
  );
}
