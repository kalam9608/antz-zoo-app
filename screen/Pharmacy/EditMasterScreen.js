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
import {
  AddDrugStorage,
  AddDrugs,
  AddGSTtaxslab,
  AddManufacture,
  AddPackages,
  AddProductforms,
  AddSalts,
  AddUom,
  EditDrugClass,
  EditGSTtaxslab,
  EditManufacture,
  EditPackages,
  EditProductForm,
  EditSalts,
  EditStorage,
  EditUom,
} from "../../services/PharmicyApi";

const EditMasterScreen = (props) => {
  const { successToast, errorToast, alertToast, warningToast, showToast } =
    useToast();
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [value, setvalue] = useState("");
  const [commonval, setCommonVal] = useState("");
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [id,sertID]=useState(props.route.params?.item?.id??0)
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
  const CommonFunctionAdd = () => {
    if (type_of == "Manufacturer") {
      AddManufacturer();
    } else if (type_of == "Package") {
      AddPackage();
    } else if (type_of == "UOM") {
      AddUomData();
    } else if (type_of == "ProductForm") {
      AddProductformData();
    } else if (type_of == "Salt") {
      AddSaltData();
    } else if (type_of == "Drug") {
      AddDrugData();
    } else if (type_of == "DrugStorage") {
      AddStorage();
    } else if (type_of == "GST") {
      AddGst();
    }
  };
  const validation = () => {
    if (name == "") {
      setIsError({ name: true });
      setErrorMessage({ name: "Gst required" });
      return false;
    } else if (value == "") {
      setIsError({ value: true });
      setErrorMessage({ value: "Tax required" });
      return false;
    }
    return true;
  };
  const AddGst = () => {
    if (validation()) {
      let obj = {
        active: "1",
        name: name,
        tax_value: value,
      };
      setIsLoading(true);
      EditGSTtaxslab(obj,id)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            navigation.goBack();
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
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

  const AddDrugData = () => {
    if (commonval !== "") {
      let obj = {
        name: commonval,
      };
      setIsLoading(true);
      EditDrugClass(obj,id)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            navigation.goBack();
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsError({ commonval: true });
      setErrorMessage({ commonval: "Required" });
    }
  };

  const AddSaltData = () => {
    if (commonval !== "") {
      let obj = {
        name: commonval,
      };
      setIsLoading(true);
      EditSalts(obj,id)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            navigation.goBack();
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsError({ commonval: true });
      setErrorMessage({ commonval: "Required" });
    }
  };
  const AddProductformData = () => {
    if (commonval !== "") {
      let obj = {
        name: commonval,
      };
      setIsLoading(true);
      EditProductForm(obj,id)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            navigation.goBack();
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
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
    } else {
      setIsError({ commonval: true });
      setErrorMessage({ commonval: "Required" });
    }
  };
  const AddUomData = () => {
    if (commonval !== "") {
      let obj = {
        unit_name: commonval,
      };
      setIsLoading(true);
      EditUom(obj,id)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            navigation.goBack();
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
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
    } else {
      setIsError({ commonval: true });
      setErrorMessage({ commonval: "Required" });
    }
  };
  const AddPackage = () => {
    if (commonval !== "") {
      let obj = {
        name: commonval,
      };
      setIsLoading(true);
      EditPackages(obj,id)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            navigation.goBack();
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsError({ commonval: true });
      setErrorMessage({ commonval: "Required" });
    }
  };
  const AddManufacturer = () => {
    if (commonval != "") {
      let obj = {
        manufacturer_name: commonval,
      };
      setIsLoading(true);
      EditManufacture(obj,id)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            navigation.goBack();
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
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
    } else {
      setIsError({ commonval: true });
      setErrorMessage({ commonval: "Required" });
    }
  };
  const AddStorage = () => {
    if (commonval !== "") {
      let obj = {
        name: commonval,
      };
      setIsLoading(true);
      EditStorage(obj,id)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            navigation.goBack();
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsError({ commonval: true });
      setErrorMessage({ commonval: "Required" });
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
            Edit {type_of ?? ""}
          </Text>
        </View>

        <CustomForm
          header={false}
          onPress={() => {
            CommonFunctionAdd();
            // }
          }}
        >
          {type_of == "GST" ? (
            <>
              <InputBox
                inputLabel={"Enter name"}
                placeholder={" Enter Name"}
                keyboardType={"default"}
                multiline={false}
                numberOfLines={3}
                onChange={(val) => setName(val)}
                closeDesignation
                value={name}
                isError={isError.name}
                errors={errorMessage.name}
              />
              <InputBox
                inputLabel={"Enter Value"}
                placeholder={" Enter Value"}
                keyboardType={"default"}
                multiline={false}
                numberOfLines={1}
                onChange={(val) => setvalue(val)}
                closeDesignation
                value={value}
                isError={isError.value}
                errors={errorMessage.value}
              />
            </>
          ) : (
            <InputBox
              inputLabel={type_of ?? "value"}
              placeholder={" Enter " + type_of ?? "value"}
              keyboardType={"default"}
              multiline={false}
              numberOfLines={1}
              onChange={(val) => setCommonVal(val)}
              closeDesignation
              value={commonval}
              isError={isError.commonval}
              errors={errorMessage.commonval}
            />
          )}
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

export default EditMasterScreen;
