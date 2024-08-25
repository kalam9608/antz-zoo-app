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
import { Image } from "react-native";
import { ActivityIndicator, Switch } from "react-native-paper";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config, { documentType } from "../../configs/Config";
import SubmitBtn from "../../components/SubmitBtn";
import LabTestCard from "../../components/medical/LabTestCard";
import Category from "../../components/DropDownBox";
import { getDocumentData, getFileData } from "../../utils/Utils";
import * as DocumentPicker from "expo-document-picker";
import { AddStockMedicine } from "../../services/PharmicyApi";
import ImageViewer from "../../components/ImageViewer";

const AddProductForm = (props) => {
  const { successToast, errorToast, alertToast, warningToast, showToast } =
    useToast();
  const navigation = useNavigation();
  const [labName, setLabName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [labOwnerName, setLabOwnerName] = useState("");
  const [Address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [labType, setLabType] = useState("");
  const [labTypeValue, setLabTypeValue] = useState("");

  const [labTypeId, setlabTypeId] = useState("");
  const [isLabTypeMenuOpen, setIsLabTypeMenuOpen] = useState(false);
  const [manufacturer, setManufacturer] = useState("");
  const [manufacturerId, setManufacturerId] = useState("");
  const [manufacturerMenuOpen, setManufacturerMenuOpen] = useState(false);
  const [packageType, setPackageType] = useState("");
  const [packageTypeId, setPackageTypeId] = useState("");
  const [packageTypeMenuOpen, setPackageTypeMenuOpen] = useState(false);

  const [uom, setUom] = useState("");
  const [uomTypeId, setUomTypeId] = useState("");
  const [uomTypeMenuOpen, setUomTypeMenuOpen] = useState(false);

  const [productForm, setProductForm] = useState("");
  const [productFormId, setProductFormId] = useState("");
  const [productFormTypeMenuOpen, setProductFormTypeMenuOpen] = useState(false);

  const [gst, setGst] = useState("");
  const [gstFormId, setGstFormId] = useState("");
  const [gstFormTypeMenuOpen, setGstFormTypeMenuOpen] = useState(false);

  const [drug, setDrug] = useState("");
  const [drugFormId, setDrugFormId] = useState("");
  const [drugFormTypeMenuOpen, setDrugFormTypeMenuOpen] = useState(false);

  const [storage, setStorage] = useState("");
  const [storageFormId, setStorageFormId] = useState("");
  const [storageFormTypeMenuOpen, setStorageFormTypeMenuOpen] = useState(false);

  const [controlled, setControlled] = useState("");
  const [controlledFormId, setControlledFormId] = useState("0");
  const [controlledFormTypeMenuOpen, setControlledFormTypeMenuOpen] =
    useState(false);

  const [stock, setStock] = useState("");
  const [stockFormId, setStockFormId] = useState("0");
  const [stockFormTypeMenuOpen, setStockFormTypeMenuOpen] = useState(false);

  const [prescription, setPrescription] = useState("");
  const [prescriptionFormId, setPrescriptionFormId] = useState("0");
  const [prescriptionFormTypeMenuOpen, setPrescriptionFormTypeMenuOpen] =
    useState(false);
  const [saltFormTypeMenuOpen, setSaltFormTypeMenuOpen] = useState(false);
  const [manufactureModalShow, setManufactureModalShow] = useState(false);
  const [addManufacture, setAddManufacture] = useState("");
  const [sideEffects, setSideEffects] = useState("");
  const [uses, setUses] = useState("");
  const [safety, setSafety] = useState("");
  const [reference, setReference] = useState("");
  const [preselectedSalt, setPreselectedSalt] = useState([]);
  const [uploadFile, setUploadFile] = useState([]);
  const [labTypeData] = useState([
    {
      id: 1,
      name: "Allopathy",
      value: "allopathy",
    },
    {
      id: 2,
      name: "Ayurveda",
      value: "ayurveda",
    },
    {
      id: 3,
      name: "Unani",
      value: "unani",
    },
    {
      id: 4,
      name: "Non Medical",
      value: "non_medical",
    },
  ]);
  const [manufacturerTypeData] = useState([
    {
      id: 1,
      name: "xyz",
    },
    {
      id: 2,
      name: "abc",
    },
  ]);
  const [packageTypeData] = useState([
    {
      id: 1,
      name: "1st Psckage",
    },
    {
      id: 2,
      name: "2nd Psckage",
    },
  ]);
  const [uomTypeData] = useState([
    {
      id: 1,
      name: "1st UOM",
    },
    {
      id: 2,
      name: "2nd UOM",
    },
  ]);
  const [productFormTypeData] = useState([
    {
      id: 1,
      name: "1st Product Form",
    },
    {
      id: 2,
      name: "2nd Product Form",
    },
  ]);
  const [drugFormTypeData] = useState([
    {
      id: 1,
      name: "1st Drug Class",
    },
    {
      id: 2,
      name: "2nd Drug Class",
    },
  ]);
  const [gstFormTypeData] = useState([
    {
      id: 1,
      name: "1st GST",
    },
    {
      id: 2,
      name: "2nd GST",
    },
  ]);

  const [storageFormTypeData] = useState([
    {
      id: 1,
      name: "1st Storage",
    },
    {
      id: 2,
      name: "2nd Storage",
    },
  ]);
  const [controlledFormTypeData] = useState([
    {
      id: 1,
      name: "Yes",
    },
    {
      id: 2,
      name: "No",
    },
  ]);
  const [prescriptionFormTypeData] = useState([
    {
      id: 1,
      name: "Yes",
    },
    {
      id: 2,
      name: "No",
    },
  ]);
  const [stockFormTypeData] = useState([
    {
      id: 1,
      name: "Yes",
    },
    {
      id: 2,
      name: "No",
    },
  ]);
  const [saltFormTypeData] = useState([
    {
      id: 1,
      name: "salt1",
    },
    {
      id: 2,
      name: "salt2",
    },
  ]);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  // manufacturer type
  const SetmanufacturerTypeDropDown = () => {
    setManufacturerMenuOpen(!manufacturerMenuOpen);
  };
  const manufacturerTypeCatClose = () => {
    setManufacturerMenuOpen(false);
  };
  const manufacturerTypeCatPressed = (item) => {
    setManufacturer(item.map((u) => u.name).join(", "));

    setManufacturerId(item.map((id) => id.id).join(","));

    setManufacturerMenuOpen(false);
  };
  // Product type

  const SetLabTypeDropDown = () => {
    setIsLabTypeMenuOpen(!isLabTypeMenuOpen);
  };
  const labTypeCatClose = () => {
    setIsLabTypeMenuOpen(false);
  };
  const labTypeCatPressed = (item) => {
    setLabType(item.map((u) => u.name).join(", "));

    setlabTypeId(item.map((id) => id.id).join(","));
    setLabTypeValue(item.map((id) => id.value).join(","));
    setIsLabTypeMenuOpen(false);
  };

  // PackageType type
  const SetPackageTypeDropDown = () => {
    setPackageTypeMenuOpen(!isLabTypeMenuOpen);
  };
  const packageTypeCatClose = () => {
    setPackageTypeMenuOpen(false);
  };
  const packageTypeCatPressed = (item) => {
    setPackageType(item.map((u) => u.name).join(", "));

    setPackageTypeId(item.map((id) => id.id).join(","));

    setPackageTypeMenuOpen(false);
  };
  // Uom
  const SetUomTypeDropDown = () => {
    setUomTypeMenuOpen(!uomTypeMenuOpen);
  };
  const uomTypeCatClose = () => {
    setUomTypeMenuOpen(false);
  };
  const uomTypeCatPressed = (item) => {
    setUom(item.map((u) => u.name).join(", "));

    setUomTypeId(item.map((id) => id.id).join(","));

    setUomTypeMenuOpen(false);
  };
  // ProductForm
  const SetproductFormTypeDropDown = () => {
    setProductFormTypeMenuOpen(!productFormTypeMenuOpen);
  };
  const productFormTypeCatClose = () => {
    setProductFormTypeMenuOpen(false);
  };
  const productFormTypeCatPressed = (item) => {
    setProductForm(item.map((u) => u.name).join(", "));

    setPackageTypeId(item.map((id) => id.id).join(","));

    setProductFormTypeMenuOpen(false);
  };
  // GST
  const SetGstTypeDropDown = () => {
    setGstFormTypeMenuOpen(!gstFormTypeMenuOpen);
  };
  const gstTypeCatClose = () => {
    setGstFormTypeMenuOpen(false);
  };
  const gstFormTypeCatPressed = (item) => {
    setGst(item.map((u) => u.name).join(", "));

    setGstFormId(item.map((id) => id.id).join(","));

    setGstFormTypeMenuOpen(false);
  };
  // Drug
  const SetdrugFormTypeDropDown = () => {
    setDrugFormTypeMenuOpen(!drugFormTypeMenuOpen);
  };
  const drugFormTypeCatClose = () => {
    setDrugFormTypeMenuOpen(false);
  };
  const drugFormTypeCatPressed = (item) => {
    setDrug(item.map((u) => u.name).join(", "));

    setDrugFormId(item.map((id) => id.id).join(","));

    setDrugFormTypeMenuOpen(false);
  };
  // Storage
  const SetStorageTypeDropDown = () => {
    setStorageFormTypeMenuOpen(!storageFormTypeMenuOpen);
  };
  const storageFormTypeCatClose = () => {
    setStorageFormTypeMenuOpen(false);
  };
  const storageFormTypeCatPressed = (item) => {
    setStorage(item.map((u) => u.name).join(", "));

    setStorageFormId(item.map((id) => id.id).join(","));

    setStorageFormTypeMenuOpen(false);
  };
  // Controlled
  const SetControlledFormTypeDropDown = () => {
    setControlledFormTypeMenuOpen(!controlledFormTypeMenuOpen);
  };
  const controlledFormTypeCatClose = () => {
    setControlledFormTypeMenuOpen(false);
  };
  const controlledFormTypeCatPressed = (item) => {
    setControlled(item.map((u) => u.name).join(", "));

    setControlledFormId(
      item.map((id) => (id.name == "Yes" ? "1" : "0")).join(",")
    );

    setControlledFormTypeMenuOpen(false);
  };
  // Stock
  const SetStockFormTypeDropDown = () => {
    setStockFormTypeMenuOpen(!stockFormTypeMenuOpen);
  };
  const stockFormTypeCatClose = () => {
    setStockFormTypeMenuOpen(false);
  };
  const stockFormTypeCatPressed = (item) => {
    setStock(item.map((u) => u.name).join(", "));

    setStockFormId(item.map((id) => (id.name == "Yes" ? "1" : "0")).join(","));

    setStockFormTypeMenuOpen(false);
  };

  // Prescription
  const SetPrescriptionFormTypeDropDown = () => {
    setPrescriptionFormTypeMenuOpen(!prescriptionFormTypeMenuOpen);
  };
  const prescriptionFormTypeCatClose = () => {
    setPrescriptionFormTypeMenuOpen(false);
  };
  const prescriptionFormTypeCatPressed = (item) => {
    setPrescription(item.map((u) => u.name).join(", "));

    setPrescriptionFormId(
      item.map((id) => (id.name == "Yes" ? "1" : "0")).join(",")
    );

    setPrescriptionFormTypeMenuOpen(false);
  };
  //SALT Cmposition functionalities
  const [rows, setRows] = useState([{ saltId: "", salt: "", quantity: "" }]);
  const [rowsErrMsg, setRowsErrMsg] = useState([
    { salt: false, quantity: false },
  ]);
  const [saltErr, SetSaltErr] = useState(false);
  const addNewRow = () => {
    setRows([...rows, { saltId: "", salt: "", quantity: "" }]);
    setRowsErrMsg([...rowsErrMsg, { salt: false, quantity: false }]);
  };

  const removeRow = (indexToRemove) => {
    setRows(rows.filter((_, index) => index !== indexToRemove));
    setRowsErrMsg(rowsErrMsg.filter((_, index) => index !== indexToRemove));
  };
  const removeValueQuantity = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].quantity = "";
    updatedRows[index].salt = "";
    updatedRows[index].saltId = "";
    setRows(updatedRows);
  };

  const handleQuantityChange = (index, value) => {
    if (!isNaN(value)) {
      const updatedRows = [...rows];
      updatedRows[index].quantity = value;
      setRows(updatedRows);
    }
  };

  const [SaltIndex, setSaltIndex] = useState(0);
  const SetSaltFormTypeDropDown = (index) => {
    setSaltIndex(index);
    setSaltFormTypeMenuOpen(!saltFormTypeMenuOpen);
  };
  const saltFormTypeCatClose = () => {
    setSaltFormTypeMenuOpen(false);
  };
  const saltFormTypeCatPressed = (item) => {
    const updatedRows = [...rows];
    updatedRows[SaltIndex].salt = item.map((u) => u.name).join(", ");
    updatedRows[SaltIndex].saltId = item.map((u) => u.id).join(", ");
    setRows(updatedRows);
    setSaltFormTypeMenuOpen(false);
  };

  // Document piker
  const removeDocuments = (docsName) => {
    const filterData = uploadFile?.filter((item) => {
      if (item?.type == "image/jpeg") {
        return item?.uri != docsName;
      }
    });
    setUploadFile(filterData);
  };

  const handleDocumentPick = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setUploadFile([...uploadFile, getFileData(result.assets[0])]);
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  const searchSelectData = (e, type_of, index) => {
    if (type_of == "Manufacturer") {
      setManufacturer(e[0]?.label);
      setManufacturerId(e[0]?.id);
    } else if (type_of == "Package") {
      setPackageType(e[0]?.label);
      setPackageTypeId(e[0]?.id);
    } else if (type_of == "UOM") {
      setUom(e[0]?.unit_name);
      setUomTypeId(e[0]?.id);
    } else if (type_of == "ProductForm") {
      setProductForm(e[0]?.label);
      setProductFormId(e[0]?.id);
    } else if (type_of == "Salt") {
      const updatedRows = [...rows];
      updatedRows[index].salt = e[0]?.label;
      updatedRows[index].saltId = e[0]?.id;
      setRows(updatedRows);
    } else if (type_of == "Drug") {
      setDrug(e[0]?.label);
      setDrugFormId(e[0]?.id);
    } else if (type_of == "DrugStorage") {
      setStorage(e[0]?.label);
      setStorageFormId(e[0]?.id);
    } else if (type_of == "GST") {
      setGst(e[0]?.label);
      setGstFormId(e[0]?.id);
    }
  };
  useEffect(() => {
    let x = rows?.map((i) => {
      return i.saltId;
    });
    setPreselectedSalt(x);
    // validateSalts()
  }, [rows]);
  useEffect(() => {
    if (
      labName ||
      manufacturerId ||
      packageTypeId ||
      quantity ||
      productFormId ||
      gstFormId ||
      labTypeId
    ) {
      setIsError(false);
    }
  }, [
    labName,
    manufacturerId,
    packageTypeId,
    quantity,
    productFormId,
    gstFormId,
    labTypeId,
  ]);
  const validation = () => {
    if (labTypeId == "") {
      setIsError({ labType: true });
      setErrorMessage({ labType: "Please enter medicine name" });
      return false;
    } else if (labName == "") {
      setIsError({ labName: true });
      setErrorMessage({ labName: "Please enter medicine name" });
      return false;
    } else if (manufacturerId == "") {
      setIsError({ manufacturer: true });
      setErrorMessage({ manufacturer: "Please select a manufacturer" });
      return false;
    } else if (packageTypeId == "") {
      setIsError({ packageType: true });
      setErrorMessage({ packageType: "Please select a package" });
      return false;
    } else if (quantity == "") {
      setIsError({ quantity: true });
      setErrorMessage({ quantity: "Please enter quantity" });
      return false;
    } else if (productFormId == "") {
      setIsError({ productForm: true });
      setErrorMessage({ productForm: "Please select a product form" });
      return false;
    } else if (!validateSalts()) {
      return false;
    } else if (gstFormId == "") {
      setIsError({ gst: true });
      setErrorMessage({ gst: "Please select GST type" });
      return false;
    }
    return true;
  };

  // const convertToFormData = (item, index) => ({
  //   [`salts[${index}][salt_name]`]: "",
  //   [`salts[${index}][salt_qty]`]: "10mg",
  //   [`salts[${index}][salt_id]`]: item.saltId,
  // });
  // const formDataArray = rows?.map(convertToFormData);
  // const finalFormData = Object.assign({}, ...formDataArray);
  // let obj = {
  //   ZooId: "11",
  //   medicine_type: "allopathy",
  //   medicine_name: "BLA Med",
  //   manufacturer: "7653",
  //   package_type: "9",
  //   package_qty: "3",
  //   package_uom: "7",
  //   product_form: "158",
  //   gst_slab: "1",
  //   drug_class: "3",
  //   storage: "1",
  //   prescription_required: "0",
  //   controlled_substance: "0",
  //   part_out_of_stock: "0",
  //   side_effects: "",
  //   uses: "",
  //   safety_advice: "",
  //   status: "1",
  // };
  // console.log("-----------------",rows);
  // const filteredRows=(rows)=>{
  //  let x= rows.filter((i)=>{
  //     if (i.saltId!="") {
  //       return i
  //     }
  //   })
  //   // console.log("-----------------",x);
  // }

  const validateSalts = () => {
    let isValid = true;

    rows.forEach((i, index) => {
      if (i.saltId === "") {
        const updatedRows = [...rowsErrMsg];
        updatedRows[index].salt = "Select salt type";
        setRowsErrMsg(updatedRows);
        isValid = false;
      }

      if (i.quantity === "") {
        const updatedRows = [...rowsErrMsg];
        updatedRows[index].quantity = "Enter quantity";
        setRowsErrMsg(updatedRows);
        isValid = false;
      }

      if (i.saltId !== "") {
        const updatedRows = [...rowsErrMsg];
        updatedRows[index].salt = false;
        setRowsErrMsg(updatedRows);
      }

      if (i.quantity !== "") {
        const updatedRows = [...rowsErrMsg];
        updatedRows[index].quantity = false;
        setRowsErrMsg(updatedRows);
      }

      if (i.quantity !== "" && i.saltId !== "") {
      }
    });

    return isValid;
  };

  const AddProductForm = () => {
    if (validation()) {
      let obj = {
        ZooId: zooID,
        medicine_type: labTypeValue,
        medicine_value: labType,
        medicine_name: labName,
        manufacturer: manufacturerId,
        package_type: packageTypeId,
        package_qty: quantity,
        package_uom: uomTypeId,
        product_form: productFormId,
        gst_slab: gstFormId,
        drug_class: drugFormId,
        storage: storageFormId,
        prescription_required: prescriptionFormId,
        controlled_substance: controlledFormId,
        part_out_of_stock: stockFormId,
        side_effects: sideEffects,
        uses: uses,
        safety_advice: safety,
        status: "1",
      };
      let filteredSalts = rows.filter((i) => {
        if (i.saltId != "") {
          return i;
        }
      });
      setIsLoading(true);
      AddStockMedicine(obj, filteredSalts, uploadFile)
        .then((res) => {
          if (res?.success) {
            successToast("success", res?.data ?? "");
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
            Add New Medicine
          </Text>
        </View>

        <CustomForm
          header={false}
          onPress={() => {
            AddProductForm();
          }}
        >
          <InputBox
            inputLabel={"Medicine Type"}
            placeholder={"Choose Medicine Type"}
            value={labType}
            defaultValue={labType != "" ? labType : ""}
            rightElement={isLabTypeMenuOpen ? "menu-up" : "menu-down"}
            onFocus={SetLabTypeDropDown}
            DropDown={SetLabTypeDropDown}
            errors={errorMessage.labType}
            isError={isError.labType}
          />
          <View style={{}}>
            <InputBox
              inputLabel={"Medicine Name*"}
              placeholder={"Enter Medicine Name"}
              onChange={(val) => {
                setIsError(false);
                setLabName(val);
              }}
              value={labName}
              isError={isError.labName}
              errors={errorMessage.labName}
            />
          </View>
          <InputBox
            inputLabel={"Manufacturer*"}
            placeholder={"Choose Manufacturer"}
            value={manufacturer}
            onFocus={() =>
              navigation.navigate("SearchManufacture", {
                onGoBack: (e, type_of) => searchSelectData(e, type_of),
                type_of: "Manufacturer",
              })
            }
            errors={errorMessage.manufacturer}
            isError={isError.manufacturer}
          />

          <Text
            style={{
              fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              marginLeft: Spacing.mini,
            }}
          >
            Package
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "48%" }}>
              <InputBox
                inputLabel={"Package*"}
                placeholder={"Choose Package"}
                value={packageType}
                // rightElementToNavigate={"menu-right"}
                onFocus={() =>
                  navigation.navigate("SearchManufacture", {
                    onGoBack: (e, type_of) => searchSelectData(e, type_of),
                    type_of: "Package",
                  })
                }
                errors={errorMessage.packageType}
                isError={isError.packageType}
              />
            </View>
            <View style={{ width: "48%" }}>
              <InputBox
                inputLabel={"Quantity*"}
                placeholder={"Enter Quantity"}
                onChange={(val) => {
                  setIsError(false);
                  if (!isNaN(val)) {
                    setQuantity(val);
                  }
                }}
                value={quantity}
                keyboardType={"numeric"}
                isError={isError.quantity}
                errors={errorMessage.quantity}
              />
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "48%" }}>
              <InputBox
                inputLabel={"UOM"}
                placeholder={"Choose UOM"}
                value={uom}
                onFocus={() =>
                  navigation.navigate("SearchManufacture", {
                    onGoBack: (e, type_of) => searchSelectData(e, type_of),
                    type_of: "UOM",
                  })
                }
                errors={errorMessage.uom}
                isError={isError.uom}
              />
            </View>
            <View style={{ width: "48%" }}>
              <InputBox
                inputLabel={"Product Form*"}
                placeholder={"Choose Product Form"}
                value={productForm}
                onFocus={() =>
                  navigation.navigate("SearchManufacture", {
                    onGoBack: (e, type_of) => searchSelectData(e, type_of),
                    type_of: "ProductForm",
                  })
                }
                errors={errorMessage.productForm}
                isError={isError.productForm}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                marginRight: Spacing.mini,
                marginLeft: Spacing.mini,
              }}
            >
              Salt Composition
            </Text>
            <TouchableOpacity
              style={{
                borderRadius: 50,
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Feather
                name="plus"
                size={20}
                color={constThemeColor.primary}
                alignSelf="center"
                alignContent="center"
              />
            </TouchableOpacity>
          </View>

          {rows?.length > 0 &&
            rows?.map((row, index) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "35%" }}>
                  <InputBox
                    inputLabel={"Salt"}
                    placeholder={"Choose Salt Name"}
                    value={row.salt}
                    onFocus={() => {
                      navigation.navigate("SearchManufacture", {
                        onGoBack: (e, type_of, index) =>
                          searchSelectData(e, type_of, index),
                        type_of: "Salt",
                        index: index,
                        preselectedSalt: preselectedSalt,
                      });
                    }}
                    isError={rowsErrMsg[index].salt}
                    errors={rowsErrMsg[index].salt}
                  />
                </View>
                <View style={{ width: "30%" }}>
                  <InputBox
                    inputLabel={"Quantity"}
                    placeholder={"Enter Quantity"}
                    onChange={(val) => handleQuantityChange(index, val)}
                    value={row.quantity}
                    keyboardType={"numeric"}
                    isError={rowsErrMsg[index].quantity}
                    errors={rowsErrMsg[index].quantity}
                  />
                </View>
                <View style={{ width: "30%", justifyContent: "center" }}>
                  {index == 0 && (
                    <TouchableOpacity
                      onPress={() => addNewRow()}
                      style={{
                        marginTop: Spacing.mini + Spacing.micro,
                        borderRadius: Spacing.mini,
                        borderWidth: 1,
                        padding: Spacing.body + 1,

                        borderColor: constThemeColor.primary,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: FontSize.Antz_Body_Title.fontSize,
                          fontWeight: FontSize.Antz_Body_Title.fontWeight,
                          color: constThemeColor.primary,
                        }}
                        alignSelf={"center"}
                      >
                        Add
                      </Text>
                    </TouchableOpacity>
                  )}
                  {index !== 0 && (
                    <TouchableOpacity
                      onPress={() => removeRow(index)}
                      style={{
                        alignSelf: "center",
                        // marginTop: Spacing.mini + Spacing.micro,
                        // borderRadius: Spacing.mini,
                        // borderWidth: 1,
                        // padding: Spacing.body + 1,
                        // borderColor: constThemeColor.error,
                      }}
                    >
                      {/* <Text
                        style={{
                          fontSize: FontSize.Antz_Body_Title.fontSize,
                          fontWeight: FontSize.Antz_Body_Title.fontWeight,
                          color: constThemeColor.error,
                        }}
                        alignSelf={"center"}
                      >
                        Remove
                      </Text> */}
                      <MaterialIcons
                        name="highlight-remove"
                        size={35}
                        color={constThemeColor.error}
                      />
                    </TouchableOpacity>
                  )}
                  {/* {index == 0 && (
                    <TouchableOpacity
                      onPress={() => removeValueQuantity(index)}
                      style={{
                        marginTop:
                          rows.length > 1 ? Spacing.mini + Spacing.micro : 0,
                        borderRadius: Spacing.mini,
                        borderWidth: 1,
                        padding:
                          rows.length > 1
                            ? Spacing.body + 1
                            : Spacing.micro - 1,
                        borderColor: constThemeColor.primary,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: FontSize.Antz_Body_Title.fontSize,
                          fontWeight: FontSize.Antz_Body_Title.fontWeight,
                          color: constThemeColor.primary,
                        }}
                        alignSelf={"center"}
                      >
                        Clear
                      </Text>
                    </TouchableOpacity>
                  )} */}
                </View>
              </View>
            ))}
          <Text
            style={{
              fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              marginRight: Spacing.mini,
              marginLeft: Spacing.mini,
            }}
          >
            Others
          </Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "48%" }}>
              <InputBox
                inputLabel={"GST*"}
                placeholder={"Choose GST"}
                value={gst}
                onFocus={() => {
                  navigation.navigate("SearchManufacture", {
                    onGoBack: (e, type_of) => searchSelectData(e, type_of),
                    type_of: "GST",
                  });
                }}
                errors={errorMessage.gst}
                isError={isError.gst}
              />
            </View>
            <View style={{ width: "48%" }}>
              <InputBox
                inputLabel={"Drug Class"}
                placeholder={"Choose Drug Class"}
                value={drug}
                onFocus={() => {
                  navigation.navigate("SearchManufacture", {
                    onGoBack: (e, type_of) => searchSelectData(e, type_of),
                    type_of: "Drug",
                  });
                }}
                errors={errorMessage.drug}
                isError={isError.drug}
              />
            </View>
          </View>

          {/* 2nd */}

          <InputBox
            inputLabel={"Storage"}
            placeholder={"Choose Storage"}
            value={storage}
            onFocus={() => {
              navigation.navigate("SearchManufacture", {
                onGoBack: (e, type_of) => searchSelectData(e, type_of),
                type_of: "DrugStorage",
              });
            }}
            errors={errorMessage.storage}
            isError={isError.storage}
          />

          <InputBox
            inputLabel={"Controlled Substances"}
            placeholder={"Choose Controlled Substances"}
            value={controlled}
            defaultValue={controlled != "" ? controlled : ""}
            rightElement={controlledFormTypeMenuOpen ? "menu-up" : "menu-down"}
            onFocus={SetControlledFormTypeDropDown}
            DropDown={SetControlledFormTypeDropDown}
            errors={errorMessage.controlled}
            isError={isError.controlled}
          />
          <InputBox
            inputLabel={"Prescription Required"}
            placeholder={"Choose Option"}
            value={prescription}
            defaultValue={prescription != "" ? prescription : ""}
            rightElement={
              prescriptionFormTypeMenuOpen ? "menu-up" : "menu-down"
            }
            onFocus={SetPrescriptionFormTypeDropDown}
            DropDown={SetPrescriptionFormTypeDropDown}
            errors={errorMessage.prescription}
            isError={isError.prescription}
          />
          <InputBox
            inputLabel={"Part Out of Stock"}
            placeholder={"Choose Option"}
            value={stock}
            defaultValue={stock != "" ? stock : ""}
            rightElement={stockFormTypeMenuOpen ? "menu-up" : "menu-down"}
            onFocus={SetStockFormTypeDropDown}
            DropDown={SetStockFormTypeDropDown}
            errors={errorMessage.stock}
            isError={isError.stock}
          />
          <InputBox
            inputLabel={"Common Side Effects"}
            placeholder={"Enter Common Side Effects"}
            keyboardType={"default"}
            multiline={true}
            numberOfLines={3}
            onChange={(val) => setSideEffects(val)}
            closeDesignation
            value={sideEffects}
            isError={isError.sideEffects}
            errors={errorMessage.sideEffects}
          />
          <InputBox
            inputLabel={"Uses"}
            placeholder={" Enter Uses"}
            keyboardType={"default"}
            multiline={true}
            numberOfLines={3}
            onChange={(val) => setUses(val)}
            closeDesignation
            value={uses}
            isError={isError.uses}
            errors={errorMessage.uses}
          />
          <InputBox
            inputLabel={"Safety Advice"}
            placeholder={" Enter Safety Advice"}
            keyboardType={"default"}
            multiline={true}
            numberOfLines={3}
            onChange={(val) => setSafety(val)}
            closeDesignation
            value={safety}
            isError={isError.safety}
            errors={errorMessage.safety}
          />
          <InputBox
            inputLabel={"Reference URL"}
            placeholder={" Enter Reference URL"}
            keyboardType={"default"}
            multiline={true}
            numberOfLines={1}
            onChange={(val) => setReference(val)}
            closeDesignation
            value={reference}
            isError={isError.reference}
            errors={errorMessage.reference}
          />

          <Text
            style={{
              fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              marginBottom: Spacing.small,
              marginLeft: Spacing.mini,
            }}
          >
            Upload Product Picture
          </Text>
          <TouchableOpacity
            onPress={() => handleDocumentPick()}
            style={{
              paddingVertical: Spacing.small,
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: constThemeColor.surface,
              borderRadius: Spacing.mini,
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                marginRight: Spacing.mini,
                color: constThemeColor.primary,
              }}
            >
              Click to upload files
            </Text>
            <View
              style={{
                borderRadius: 50,
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Feather
                name="plus"
                size={35}
                color={constThemeColor.primary}
                alignSelf="center"
                alignContent="center"
              />
            </View>
          </TouchableOpacity>
          {/* {uploadFile?.map((item) => (
                    <View style={{ marginTop: Spacing.micro }}>
                      <View
                        style={[
                          {
                            backgroundColor: constThemeColor.displaybgPrimary,
                            marginVertical: Spacing.mini,
                            flexDirection:"row",
                            alignItems:"center",
                            justifyContent:"space-between",
                            paddingHorizontal:Spacing.mini,
                            paddingVertical:Spacing.mini
                          },
                        ]}
                      >
                        <MaterialIcons
                          name="picture-as-pdf"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />
                       
                          <Text ellipsizeMode="tail" numberOfLines={1} style={{width:"80%"}}>{item?.name}</Text>
                       

                        <MaterialCommunityIcons
                          name="close"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                          style={{
                            paddingHorizontal: 5,
                          }}
                          onPress={() => removeDocuments(item?.uri)}
                        />
                      </View>
                    </View>
                  ))} */}
          <ImageViewer
            data={uploadFile}
            horizontal={true}
            imageClose={(item) => removeDocuments(item?.uri)}
            width={widthPercentageToDP(88)}
            imgWidth={widthPercentageToDP(88)}
          />
        </CustomForm>
        {/* Product type drop */}
        {isLabTypeMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={isLabTypeMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={labTypeCatClose}
            >
              <Category
                categoryData={labTypeData}
                onCatPress={labTypeCatPressed}
                heading={"Select Lab Type"}
                isMulti={false}
                onClose={labTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}
        {manufacturerMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={manufacturerMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={manufacturerTypeCatClose}
            >
              <Category
                categoryData={manufacturerTypeData}
                onCatPress={manufacturerTypeCatPressed}
                heading={"Select Manufacturer Type"}
                isMulti={false}
                onClose={manufacturerTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}
        {packageTypeMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={packageTypeMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={packageTypeCatClose}
            >
              <Category
                categoryData={packageTypeData}
                onCatPress={packageTypeCatPressed}
                heading={"Select Package Type"}
                isMulti={false}
                onClose={packageTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}
        {uomTypeMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={uomTypeMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={uomTypeCatClose}
            >
              <Category
                categoryData={uomTypeData}
                onCatPress={uomTypeCatPressed}
                heading={"Select UOM Type"}
                isMulti={false}
                onClose={uomTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}
        {productFormTypeMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={productFormTypeMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={productFormTypeCatClose}
            >
              <Category
                categoryData={productFormTypeData}
                onCatPress={productFormTypeCatPressed}
                heading={"Select Product Form"}
                isMulti={false}
                onClose={productFormTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}

        {gstFormTypeMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={gstFormTypeMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={gstTypeCatClose}
            >
              <Category
                categoryData={gstFormTypeData}
                onCatPress={gstFormTypeCatPressed}
                heading={"Select GST"}
                isMulti={false}
                onClose={gstTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}
        {drugFormTypeMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={drugFormTypeMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={drugFormTypeCatClose}
            >
              <Category
                categoryData={drugFormTypeData}
                onCatPress={drugFormTypeCatPressed}
                heading={"Select Drug Class"}
                isMulti={false}
                onClose={drugFormTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}
        {storageFormTypeMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={storageFormTypeMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={storageFormTypeCatClose}
            >
              <Category
                categoryData={storageFormTypeData}
                onCatPress={storageFormTypeCatPressed}
                heading={"Select Storage Type"}
                isMulti={false}
                onClose={storageFormTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}
        {controlledFormTypeMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={controlledFormTypeMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={controlledFormTypeCatClose}
            >
              <Category
                categoryData={controlledFormTypeData}
                onCatPress={controlledFormTypeCatPressed}
                heading={"Select Controlled Substances"}
                isMulti={false}
                onClose={controlledFormTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}

        {prescriptionFormTypeMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={prescriptionFormTypeMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={prescriptionFormTypeCatClose}
            >
              <Category
                categoryData={prescriptionFormTypeData}
                onCatPress={prescriptionFormTypeCatPressed}
                heading={"Select Prescription"}
                isMulti={false}
                onClose={prescriptionFormTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}
        {stockFormTypeMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={stockFormTypeMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={stockFormTypeCatClose}
            >
              <Category
                categoryData={stockFormTypeData}
                onCatPress={stockFormTypeCatPressed}
                heading={" Select Out OF Stock status"}
                isMulti={false}
                onClose={stockFormTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}
        {saltFormTypeMenuOpen ? (
          <View>
            <Modal
              animationType="fade"
              visible={saltFormTypeMenuOpen}
              style={stylesSheet.bottomSheetStyle}
              onBackdropPress={saltFormTypeCatClose}
            >
              <Category
                categoryData={saltFormTypeData}
                onCatPress={saltFormTypeCatPressed}
                heading={"Select Salt Name"}
                isMulti={false}
                onClose={saltFormTypeCatClose}
              />
            </Modal>
          </View>
        ) : null}
        {/* <Modal
          isVisible={manufactureModalShow}
          style={{
            justifyContent: "center",
            alignSelf: "center",
            margin: 0,
          }}
          propagateSwipe={true}
          hideModalContentWhileAnimating={true}
          swipeThreshold={150}
          animationInTiming={500}
          animationOutTiming={100}
          useNativeDriver={true}
          onBackdropPress={() => setManufactureModalShow(!manufactureModalShow)}
          width={"80%"}
        >
          <KeyboardAvoidingView
            style={{
              backgroundColor: constThemeColor.onPrimary,
              borderRadius: Spacing.major,
              justifyContent: "flex-start",
              paddingBottom: Spacing.minor,
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.primary,
                borderTopLeftRadius: Spacing.major,
                borderTopRightRadius: Spacing.major,
              }}
            >
              <TouchableOpacity onPress={() => setManufactureModalShow(false)}>
                <Entypo
                  name="cross"
                  size={30}
                  color="black"
                  alignSelf="flex-end"
                  padding={Spacing.mini}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  alignSelf: "center",
                  marginBottom: Spacing.body,
                }}
              >
                Add Manufacturer
              </Text>
            </View>
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                // height: "60%",
              }}
            >
              <InputBox
                inputLabel={"Manufacturer Name"}
                placeholder={"Enter Manufacturer Name"}
                onChange={(val) => {
                  setIsError(false);
                  setAddManufacture(val);
                }}
                value={addManufacture}
                isError={isError.addManufacture}
                errors={errorMessage.addManufacture}
              />
              <TouchableOpacity
                style={{
                  marginTop: Spacing.body,
                  width: "60%",
                  alignSelf: "center",
                }}
              >
                <SubmitBtn
                  backgroundColor={constThemeColor?.primary}
                  buttonText={"Submit"}
                  onPress={() => {
                    AddManufacturer();
                  }}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal> */}
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

export default AddProductForm;
