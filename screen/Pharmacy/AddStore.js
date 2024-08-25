import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import Loader from "../../components/Loader";
import { CountryPicker } from "react-native-country-codes-picker";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Fontisto,
  Feather,
} from "@expo/vector-icons";
import {
  createLab,
  mobileExist,
} from "../../services/staffManagement/addPersonalDetails";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { useToast } from "../../configs/ToastConfig";
import { AddGSTtaxslab, AddStoreNew } from "../../services/PharmicyApi";
import { RadioButton } from "react-native-paper";
import Category from "../../components/DropDownBox";

const AddStore = (props) => {
  const { successToast, errorToast, alertToast, warningToast, showToast } =
    useToast();
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [site, setSite] = useState("");
  const [siteId, setSiteId] = useState("");
  const [mobile, setMobile] = useState("");
  const [state, setState] = useState("");
  const [contact, setContact] = useState("");
  const [Gst, setGst] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [balence, setBalence] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const sites = useSelector((state) => state.UserAuth.zoos);
  const [checked, setChecked] = React.useState("");
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const [type_of, setTYpeOf] = useState(props.route.params.type_of ?? "");

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setIsLoading(false);
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLongitude(location.coords.longitude.toString());
    setLatitude(location.coords.latitude.toString());
    setIsLoading(false);
  };
  const [allSite, setAllSite] = useState([]);
  const [isSiteOpen, setisSiteOpen] = useState(false);
  useEffect(() => {
    let data = sites[0].sites.map((item) => ({
      id: item.site_id,
      name: item.site_name,
      isSelect:
        item?.site_id == props.route.params?.item?.section_site_id ||
        item?.site_id == props.route.params?.item?.site_id
          ? true
          : false,
    }));
    setAllSite(data);
  }, []);
  const catPressed = (item) => {
    setSite(item.map((u) => u.name).join(", "));
    setSiteId(item[0].id);
    setisSiteOpen(!isSiteOpen);
  };

  const catClose = () => {
    setisSiteOpen(false);
  };
  useEffect(() => {
    // setIsLoading(true);
    getLocation();
  }, []);

  useEffect(() => {
    if (name || site || checked) {
      setIsError(false);
      setErrorMessage(false);
    }
  }, [name, site, checked]);
  const validation = () => {
    if (name == "") {
      setIsError({ name: true });
      setErrorMessage({ name: "Please enter store name" });
      return false;
    } else if (site == "") {
      setIsError({ site: true });
      setErrorMessage({ site: "Please Select site" });
      return false;
    } else if (checked == "") {
      setIsError({ checked: true });
      setErrorMessage({ checked: "Please select type" });
      return false;
    }
    return true;
  };
  const AddStore = () => {
    if (validation()) {
      let obj = {
        latitude: latitude,
        logitude: longitude,
        name: name,
        site_id: siteId,
        status: "active",
        type: checked,
      };

      setIsLoading(true);
      AddStoreNew(obj)
        .then((res) => {
          if (res?.success) {
            successToast("success", res?.message ?? "");
            navigation.goBack();
          } else {
            errorToast("error", `Opps! something went wrong!!`);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: constThemeColor.onPrimary }}>
        <Loader visible={isLoading} />
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "transparent",
            alignItems: "center",
            marginHorizontal: Spacing.major,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={constThemeColor.neutralPrimary}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: FontSize.Antz_Medium_Medium.fontSize,
              fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
            }}
          >
            Add New {type_of ?? ""}
          </Text>
        </View>

        <CustomForm
          header={false}
          onPress={() => {
            AddStore();
          }}
        >
          <InputBox
            inputLabel={"Store name"}
            placeholder={" Enter Store name"}
            keyboardType={"default"}
            multiline={false}
            numberOfLines={3}
            onChange={(val) => setName(val)}
            // closeDesignation
            value={name}
            isError={isError.name}
            errors={errorMessage.name}
          />
          <InputBox
            inputLabel={"Site"}
            placeholder={"Select Site"}
            keyboardType={"default"}
            multiline={false}
            numberOfLines={1}
            rightElement={isSiteOpen ? "menu-up" : "menu-down"}
            DropDown={() => {
              setisSiteOpen(true);
            }}
            onFocus={() => {
              setisSiteOpen(true);
            }}
            value={site}
            isError={isError.site}
            errors={errorMessage.site}
          />
          <Text
            style={{
              fontSize: FontSize.Antz_Body_Medium.fontSize,
              fontWeight: FontSize.Antz_Body_Medium.fontWeight,
              marginLeft: Spacing.mini,
            }}
          >
            Type
          </Text>
          <View
            style={{
              flexDirection: "row",
              borderColor: constThemeColor.error,
              borderBottomWidth: errorMessage?.checked ? 1 : 0,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton
                value="first"
                status={checked === "local" ? "checked" : "unchecked"}
                onPress={() => setChecked("local")}
              />
              <Text>Local</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton
                value="second"
                status={checked === "central" ? "checked" : "unchecked"}
                onPress={() => setChecked("central")}
              />
              <Text>Central</Text>
            </View>
          </View>
          {errorMessage?.checked && (
            <Text
              style={{
                // fontSize: FontSize.Antz_Body_Medium.fontSize,
                // fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                marginLeft: Spacing.mini,
                color: constThemeColor.error,
              }}
            >
              {errorMessage?.checked}
            </Text>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: Spacing.mini,
            }}
          >
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Medium.fontSize,
                fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                marginLeft: Spacing.mini,
              }}
            >
              Package
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsLoading(true);
                getLocation();
              }}
            >
              <MaterialIcons name="my-location" size={24} color="black" />
            </TouchableOpacity>
          </View>
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
        {isSiteOpen ? (
          <View>
            <Modal
              animationType="fade"
              // transparent={true}
              // deviceWidth={width}
              visible={isSiteOpen}
              onDismiss={catClose}
              // style={{ margin: 0, justifyContent: "flex-end" }}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={catClose}
            >
              <Category
                categoryData={allSite}
                onCatPress={catPressed}
                heading={"Choose Sites"}
                isMulti={false}
                onClose={catClose}
              />
            </Modal>
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: Spacing.small,
      paddingHorizontal: Spacing.small,
    },
    Label: {
      marginTop: 20,
      fontSize: FontSize.Antz_Small,
      fontWeight: "200",
    },
    autoGenarate: {
      color: reduxColors.primary,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      lineHeight: 16,
      marginBottom: Spacing.mini,
      marginLeft: widthPercentageToDP(3),
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors?.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    defaultText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      // marginLeft: Spacing.small,
    },
    modalContainer: {
      backgroundColor: reduxColors.surface,
      height: 150,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.major,
    },
    docsText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      marginTop: Spacing.mini,
    },
    labTestBox: {
      marginTop: 12,
      marginBottom: 8,
    },
    labTest: {
      justifyContent: "center",
      width: "100%",
      borderRadius: 4,
      minHeight: heightPercentageToDP(6.5),
    },
    labTestTextStyle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      paddingLeft: 15,
    },
  });

export default AddStore;
