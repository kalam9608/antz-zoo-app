import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import Loader from "../../components/Loader";
import {
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";

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
import Category from "../../components/DropDownBox";
import { getFileData } from "../../utils/Utils";
import {
  AddStockMedicine,
  UpdateStockMedicine,
} from "../../services/PharmicyApi";
import ImageViewer from "../../components/ImageViewer";

const EditMedicines = (props) => {
  const { successToast, errorToast, alertToast, warningToast, showToast } =
    useToast();
  const navigation = useNavigation();
  const [labName, setLabName] = useState(props.route.params?.item?.name ?? "");
  const [quantity, setQuantity] = useState(
    props.route.params?.item?.package_qty ?? ""
  );
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [labType, setLabType] = useState("");
  const [labTypeValue, setLabTypeValue] = useState("");
  const [labTypeId, setlabTypeId] = useState("");
  const [isLabTypeMenuOpen, setIsLabTypeMenuOpen] = useState(false);
  const [manufacturer, setManufacturer] = useState(
    props.route.params?.item?.manufacturer_name ?? ""
  );
  const [manufacturerId, setManufacturerId] = useState(
    props.route.params?.item?.manufacturer ?? ""
  );
  const [packageType, setPackageType] = useState(
    props.route.params?.item?.package ?? ""
  );
  const [packageTypeId, setPackageTypeId] = useState(
    props.route.params?.item?.package_type ?? ""
  );
  const [item, setItem] = useState(props.route.params.item ?? {});
  const [uom, setUom] = useState(
    props.route.params?.item?.package_uom_label ?? ""
  );
  const [uomTypeId, setUomTypeId] = useState(
    props.route.params?.item?.package_uom ?? ""
  );
  const [productForm, setProductForm] = useState(
    props.route.params?.item?.product_form_label ?? ""
  );
  const [productFormId, setProductFormId] = useState(
    props.route.params?.item?.product_form ?? ""
  );

  const [gst, setGst] = useState(
    props.route.params?.item?.gst_value + "%" ?? ""
  );
  const [gstFormId, setGstFormId] = useState(
    props.route.params?.item?.gst_slab ?? ""
  );

  const [drug, setDrug] = useState(
    props.route.params?.item?.drug_class_label ?? ""
  );
  const [drugFormId, setDrugFormId] = useState(
    props.route.params?.item?.drug_class ?? ""
  );

  const [storage, setStorage] = useState(
    props.route.params?.item?.storage_value ?? ""
  );
  const [storageFormId, setStorageFormId] = useState(
    props.route.params?.item?.storage ?? ""
  );

  const [controlled, setControlled] = useState(
    props.route.params?.item?.controlled_substance == "0" ? "No" : "Yes" ?? ""
  );
  const [controlledFormId, setControlledFormId] = useState(
    props.route.params?.item?.controlled_substance ?? "0"
  );
  const [controlledFormTypeMenuOpen, setControlledFormTypeMenuOpen] =
    useState(false);

  const [stock, setStock] = useState(
    props.route.params?.item?.part_out_of_stock == "0" ? "No" : "Yes" ?? ""
  );
  const [stockFormId, setStockFormId] = useState(
    props.route.params?.item?.part_out_of_stock ?? "0"
  );
  const [stockFormTypeMenuOpen, setStockFormTypeMenuOpen] = useState(false);

  const [prescription, setPrescription] = useState(
    props.route.params?.item?.prescription_required == "0" ? "No" : "Yes" ?? ""
  );
  const [prescriptionFormId, setPrescriptionFormId] = useState(
    props.route.params?.item?.prescription_required ?? "0"
  );
  const [prescriptionFormTypeMenuOpen, setPrescriptionFormTypeMenuOpen] =
    useState(false);
  const [sideEffects, setSideEffects] = useState(
    props.route.params?.item?.side_effects ?? ""
  );
  const [uses, setUses] = useState(props.route.params?.item?.uses ?? "");
  const [safety, setSafety] = useState(
    props.route.params?.item?.safety_advice ?? ""
  );
  const [id, setID] = useState(props.route.params?.item?.id ?? "");
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

  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  // Product type

  const SetLabTypeDropDown = () => {
    setIsLabTypeMenuOpen(!isLabTypeMenuOpen);
  };
  const labTypeCatClose = () => {
    setIsLabTypeMenuOpen(false);
  };
  const labTypeCatPressed = (item) => {
    setLabType(item.map((u) => u.name).join(", "));
    setLabTypeValue(item.map((id) => id.value).join(","));
    setlabTypeId(item.map((id) => id.id).join(","));

    setIsLabTypeMenuOpen(false);
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
    if (props.route.params?.item?.salts) {
      const newArray = props.route.params?.item?.salts?.map((i) => {
        return {
          saltId: i.id,
          salt: i.label,
          quantity: i.qty,
        };
      });
      const errorArray = props.route.params?.item?.salts?.map((i) => {
        return {
          salt: false,
          quantity: false,
        };
      });
      setRows(newArray);
      setRowsErrMsg(errorArray);
    }

    if (props.route.params?.item?.image) {
      setUploadFile([{ url: props.route.params?.item?.image }]);
    }

    labTypeData?.filter((i) => {
      if (i.value == props.route.params?.item?.stock_type) {
        setLabType(i.name);
        setlabTypeId(i.id);
        setLabTypeValue(i.value);
      }
    });
  }, []);
  useEffect(() => {
    let x = rows?.map((i) => {
      return i?.saltId?.toString();
    });
    setPreselectedSalt(x);
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
    if (labType == "") {
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

  const EditMedicineForm = () => {
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
      UpdateStockMedicine(obj, filteredSalts, uploadFile, id)
        .then((res) => {
          if (res?.success) {
            successToast("success", res?.message ?? "");
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
            Edit Medicine
          </Text>
        </View>

        <CustomForm
          header={false}
          onPress={() => {
            EditMedicineForm();
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

export default EditMedicines;
