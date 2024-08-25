import { Alert, TouchableOpacity, View } from "react-native";

import React, { useState } from "react";
import * as Location from "expo-location";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import { createZooDetails } from "../../services/staffManagement/createZoo";
import { MaterialIcons } from "@expo/vector-icons";
import NewDropdown from "../../components/Dropdown";
import { useToast } from "../../configs/ToastConfig";

const CreateZoo = () => {
  const navigation = useNavigation();
  const { successToast, errorToast,  } = useToast();
  const [zooName, setZooName] = useState("");
  const [zooDescription, setZooDescription] = useState("");
  const [zooAddress, setZooAddress] = useState("");
  const [zooLatitude, setZooLatitude] = useState("");
  const [zooLongitude, setZooLongitude] = useState("");
  const [zooArea, setZooArea] = useState("");
  const [zooAvgStaffCount, setZooAvgStaffCount] = useState("");
  const [zooContactNumber, setZooContactNumber] = useState("");
  const [zooContactPerson, setZooContactPerson] = useState("");
  const [fullAccess, setFullAccess] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});

  const items = [
    {
      category_id: 1,
      category_name: "Status",
      category_type: 1,
      isExpanded: true,
      subcategory: [
        {
          id: 0,
          val: "Pending",
        },
        {
          id: 1,
          val: "Active",
        },
      ],
    },
  ];

  const userLocation = async () => {
    setIsLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setZooLongitude(location.coords.longitude.toString());
    setZooLatitude(location.coords.latitude.toString());
    setIsLoading(false);
  };

  const onSubmit = () => {
    let mobileRegx = /^\d{10}$/;
    let statusValidate = ["Active", "Pending"];
    setIsError({});
    setErrorMessage({});
    if (zooName.trim().length === 0) {
      setIsError({ zooName: true });
      setErrorMessage({ zooName: "Name is required" });
      return false;
    } else if (zooDescription.trim().length === 0) {
      setIsError({ zooDescription: true });
      setErrorMessage({ zooDescription: "Enter zoo description" });
      return false;
    } else if (zooAddress.trim().length === 0) {
      setIsError({ zooAddress: true });
      setErrorMessage({ zooAddress: "Enter zoo address" });
      return false;
    } else if (zooArea.trim().length === 0) {
      setIsError({ zooArea: true });
      setErrorMessage({ zooArea: "Zoo area required" });
      return false;
    } else if (zooAvgStaffCount.trim().length === 0) {
      setIsError({ zooAvgStaffCount: true });
      setErrorMessage({ zooAvgStaffCount: "Enter average staff count number" });
      return false;
    } else if (zooContactNumber.trim().length === 0) {
      setIsError({ zooContactNumber: true });
      setErrorMessage({ zooContactNumber: "Enter valid number" });
      return false;
    } else if (zooContactPerson.trim().length === 0) {
      setIsError({ zooContactPerson: true });
      setErrorMessage({ zooContactPerson: "Choose a zoo contact person" });
      return false;
    } else if (fullAccess.length === 0) {
      setIsError({ fullAccess: true });
      setErrorMessage({ fullAccess: "Choose from dropdown" });
      return false;
    } else {
      let obj = {
        zoo_name: zooName,
        zoo_description: zooDescription,
        zoo_address: zooAddress,
        zoo_latitude: zooLatitude,
        zoo_longitude: zooLongitude,
        zoo_area: zooArea,
        zoo_avg_staff_count: zooAvgStaffCount,
        zoo_contact_number: zooContactNumber,
        zoo_contact_person: zooContactPerson,
        status: fullAccess,
      };
      setIsLoading(true);
      createZooDetails(obj)
        .then((response) => {})
        .catch((error) => {
          errorToast("error","Oops! Something went wrong!!");
        })
        .finally(() => {
          setIsLoading(false);
          navigation.navigate("Home");
          successToast("success","Your data sucessfully save");
          navigation.navigate("HomeScreen");
        });
    }
  };

  const getFullAccessData = (item) => {
    const accessdata = item.id;
    setFullAccess(accessdata);
  };

  return (
    <>
      {isLoading ? (
        <Loader loaderSize="lg" />
      ) : (
        <CustomForm
          header={true}
          title={"Create Zoo"}
          onPress={onSubmit}
          marginBottom={50}
        >
          <View style={{ marginBottom: 20 }}>
            <InputBox
              inputLabel={"Enter zoo name"}
              placeholder={"Enter zoo name"}
              onChange={(val) => setZooName(val)}
              value={zooName}
              isError={isError.zooName}
              errors={errorMessage.zooName}
              keyboardType={"default"}
              // maxLength={10}
            />
            <InputBox
              inputLabel={"Enter zoo description"}
              placeholder={"Enter zoo description"}
              onChange={(val) => setZooDescription(val)}
              value={zooDescription}
              isError={isError.zooDescription}
              errors={errorMessage.zooDescription}
              keyboardType={"default"}
            />
            <InputBox
              inputLabel={"Enter zoo address"}
              placeholder={"Enter zoo address"}
              onChange={(val) => setZooAddress(val)}
              value={zooAddress}
              isError={isError.zooAddress}
              errors={errorMessage.zooAddress}
            />
            <InputBox
              editable={false}
              inputLabel={"Enter zoo latitude"}
              placeholder={"latitude"}
              onChange={(val) => setZooLatitude(val)}
              value={zooLatitude}
              isError={isError.zooLatitude}
              errors={errorMessage.zooLatitude}
            />
            <TouchableOpacity
              style={{
                width: "10%",
                alignItems: "center",
                marginHorizontal: "90%",
                bottom: "5%",
              }}
              onPress={userLocation}
            >
              <MaterialIcons name="my-location" size={23} color="grey" />
            </TouchableOpacity>
            <View style={{ bottom: 13 }}>
              <InputBox
                inputLabel={"Enter zoo longitude"}
                placeholder={"longitude"}
                onChange={(val) => setZooLongitude(val)}
                value={zooLongitude}
                isError={isError.zooLongitude}
                errors={errorMessage.zooLongitude}
              />
              <TouchableOpacity
                style={{
                  width: "10%",
                  alignItems: "center",
                  marginHorizontal: "90%",
                  bottom: "45%",
                }}
                onPress={userLocation}
              >
                <MaterialIcons name="my-location" size={23} color="grey" />
              </TouchableOpacity>
            </View>
            <InputBox
              inputLabel={"Enter zoo area"}
              placeholder={"Enter zoo area"}
              onChange={(val) => setZooArea(val)}
              value={zooArea}
              isError={isError.zooArea}
              errors={errorMessage.zooArea}
            />
            <InputBox
              inputLabel={"Enter zoo average staff count"}
              placeholder={"Enter zoo average staff count"}
              onChange={(val) => setZooAvgStaffCount(val)}
              value={zooAvgStaffCount}
              isError={isError.zooAvgStaffCount}
              errors={errorMessage.zooAvgStaffCount}
            />
            <InputBox
              inputLabel={"Enter zoo contact number"}
              placeholder={"Enter zoo contact number"}
              onChange={(val) => setZooContactNumber(val)}
              value={zooContactNumber}
              isError={isError.zooContactNumber}
              errors={errorMessage.zooContactNumber}
              maxLength={10}
              keyboardType={"number-pad"}
            />
            <InputBox
              inputLabel={"Enter zoo contact person"}
              placeholder={"Enter zoo contact person"}
              onChange={(val) => setZooContactPerson(val)}
              value={zooContactPerson}
              isError={isError.zooContactPerson}
              errors={errorMessage.zooContactPerson}
            />
            <NewDropdown
              title="FullAccess"
              data={items}
              afterPressDropdown={getFullAccessData}
              errors={errorMessage.fullAccess}
              isError={isError.fullAccess}
            />
          </View>
        </CustomForm>
      )}
    </>
  );
};

export default CreateZoo;
