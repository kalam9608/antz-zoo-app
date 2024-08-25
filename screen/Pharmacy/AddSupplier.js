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
import { AddGSTtaxslab, AddSupplierNew } from "../../services/PharmicyApi";

const AddSupplier = (props) => {
  const { successToast, errorToast, alertToast, warningToast, showToast } =
    useToast();
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [state, setState] = useState("");
  const [contact, setContact] = useState("");
  const [Gst, setGst] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [balence, setBalence] = useState("");
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const [type_of, setTYpeOf] = useState(props.route.params.type_of ?? "");
  //   useEffect(() => {
  //     if (
  //       labName ||
  //       manufacturerId ||
  //       packageTypeId ||
  //       quantity ||
  //       productFormId ||
  //       gstFormId ||
  //       labTypeId
  //     ) {
  //       setIsError(false);
  //     }
  //   }, [
  //     labName,
  //     manufacturerId,
  //     packageTypeId,
  //     quantity,
  //     productFormId,
  //     gstFormId,
  //     labTypeId,
  //   ]);
  //   const validation = () => {
  //     if (labTypeId == "") {
  //       setIsError({ labType: true });
  //       setErrorMessage({ labType: "Please enter medicine name" });
  //       return false;
  //     } else if (labName == "") {
  //       setIsError({ labName: true });
  //       setErrorMessage({ labName: "Please enter medicine name" });
  //       return false;
  //     } else if (manufacturerId == "") {
  //       setIsError({ manufacturer: true });
  //       setErrorMessage({ manufacturer: "Please select a manufacturer" });
  //       return false;
  //     } else if (packageTypeId == "") {
  //       setIsError({ packageType: true });
  //       setErrorMessage({ packageType: "Please select a package" });
  //       return false;
  //     } else if (quantity == "") {
  //       setIsError({ quantity: true });
  //       setErrorMessage({ quantity: "Please enter quantity" });
  //       return false;
  //     } else if (productFormId == "") {
  //       setIsError({ productForm: true });
  //       setErrorMessage({ productForm: "Please select a product form" });
  //       return false;
  //     } else if (!validateSalts()) {
  //       return false;
  //     } else if (gstFormId == "") {
  //       setIsError({ gst: true });
  //       setErrorMessage({ gst: "Please select GST type" });
  //       return false;
  //     }
  //     return true;
  //   };
  //
  const AddSuppli = () => {
    // if (validation()) {
    let obj = {
      // name: "raja",
      // mobile: "+919679193059",
      // state_id: "1",
      // state_name: "West Bengal",
    };

    setIsLoading(true);
    AddSupplierNew(obj)
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
    // }
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
            // AddSupplier();
          }}
        >
          <InputBox
            inputLabel={"Supplier name"}
            placeholder={" Enter Supplier name"}
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
            inputLabel={"Mobile Number"}
            placeholder={"Enter Mobile Number"}
            keyboardType={"numeric"}
            multiline={false}
            numberOfLines={1}
            onChange={(val) => setMobile(val)}
            // closeDesignation
            value={mobile}
            isError={isError.mobile}
            errors={errorMessage.mobile}
          />
          <InputBox
            inputLabel={"Select State"}
            placeholder={"Select State"}
            keyboardType={"default"}
            multiline={false}
            numberOfLines={1}
            onChange={(val) => setState(val)}
            // closeDesignation
            value={state}
            isError={isError.state}
            errors={errorMessage.state}
          />
          <InputBox
            inputLabel={"Contact Person"}
            placeholder={"Contact Person"}
            keyboardType={"default"}
            multiline={false}
            numberOfLines={1}
            onChange={(val) => setContact(val)}
            // closeDesignation
            value={contact}
            isError={isError.contact}
            errors={errorMessage.contact}
          />
          <InputBox
            inputLabel={"Gst Number"}
            placeholder={"Enter Gst Number"}
            keyboardType={"default"}
            multiline={false}
            numberOfLines={1}
            onChange={(val) => setGst(val)}
            // closeDesignation
            value={Gst}
            isError={isError.Gst}
            errors={errorMessage.Gst}
          />
          <InputBox
            inputLabel={"Email"}
            placeholder={"Enter Email"}
            keyboardType={"default"}
            multiline={false}
            numberOfLines={1}
            onChange={(val) => setEmail(val)}
            // closeDesignation
            value={email}
            isError={isError.email}
            errors={errorMessage.email}
          />
          <InputBox
            inputLabel={"Phone"}
            placeholder={"Enter Phone"}
            keyboardType={"default"}
            multiline={false}
            numberOfLines={1}
            onChange={(val) => setPhone(val)}
            // closeDesignation
            value={phone}
            isError={isError.phone}
            errors={errorMessage.phone}
          />
          <InputBox
            inputLabel={"Description"}
            placeholder={"Enter Description"}
            keyboardType={"default"}
            multiline={false}
            numberOfLines={1}
            onChange={(val) => setDescription(val)}
            // closeDesignation
            value={description}
            isError={isError.description}
            errors={errorMessage.description}
          />

          <InputBox
            inputLabel={"Address"}
            placeholder={"Enter Address"}
            keyboardType={"default"}
            multiline={false}
            numberOfLines={1}
            onChange={(val) => setAddress(val)}
            // closeDesignation
            value={address}
            isError={isError.address}
            errors={errorMessage.address}
          />
          <InputBox
            inputLabel={"Opening Balence"}
            placeholder={"Enter Opening Balence"}
            keyboardType={"default"}
            multiline={false}
            numberOfLines={1}
            onChange={(val) => setBalence(val)}
            // closeDesignation
            value={balence}
            isError={isError.balence}
            errors={errorMessage.balence}
          />
        </CustomForm>
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

export default AddSupplier;
