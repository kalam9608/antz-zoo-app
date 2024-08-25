import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
//   import CheckBox from "./CheckBox";
// import { DosaseTab } from "../screen/Medical/Prescription";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { capitalize, opacityColor } from "../../utils/Utils";
import { LayoutAnimation } from "react-native";
import { useCallback } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import { Checkbox, Divider } from "react-native-paper";
import Loader from "../../components/Loader";
import InputBox from "../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import Category from "../../components/DropDownBox";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import Modals from "react-native-modal";
import { useToast } from "../../configs/ToastConfig";

const DispenseModal = ({
  selectItemName,
  handleToggleCommDropdown,
  isLoading,
  handleDetailsSubmit,
  batchList,
  rowsErrMsgData,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [showMore, setShowMore] = useState(false);
  const [textLines, setTextLines] = useState(2);
  const [rows, setRows] = useState(
    selectItemName?.list?.length > 0
      ? selectItemName?.list
      : [{ batch_no: "", name: "", qty: 0, maxQyt: 0, stock_id: "" }]
  );
  const [rowsErrMsg, setRowsErrMsg] = useState(
    rowsErrMsgData ?? [{ medicine: false, qty: false }]
  );
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const [storeType, setStoreType] = useState([]);
  const [index, setIndex] = useState(0);
  const [isStoreTypeMenuOpen, setIsStoreTypeMenuOpen] = useState();
  const [dispenseListModal, setDispenseListModal] = useState(false);
  const textRef = useRef(null);
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [showMore]);

  const handleTextLayout = (e) => {
    const { lines } = e.nativeEvent;
    setTextLines(lines.length);
  };
  const [preselectedMedicine, setPreselectedMedicine] = useState([]);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  const navigation = useNavigation();

  const validateSalts = () => {
    let isValid = true;

    rows.forEach((i, index) => {
      if (i.batch_no === "") {
        const updatedRows = [...rowsErrMsg];
        updatedRows[index].medicine = "Select batch";
        setRowsErrMsg(updatedRows);
        isValid = false;
      }
      // console.log({i})
      if (i.qty == "" || i.qty == 0) {
        const updatedRows = [...rowsErrMsg];

        updatedRows[index].qty = "Enter Quantity";
        setRowsErrMsg(updatedRows);
        isValid = false;
      }
      if (parseInt(i.qty) > parseInt(i.maxQyt)) {
        const updatedRows = [...rowsErrMsg];

        updatedRows[index].qty = `Enter valid quantity`;
        setRowsErrMsg(updatedRows);
        isValid = false;
      }

      if (i.batch_no !== "") {
        const updatedRows = [...rowsErrMsg];
        updatedRows[index].medicine = false;
        setRowsErrMsg(updatedRows);
      }

      if (i?.qty && parseInt(i?.qty) <= parseInt(i.maxQyt)) {
        const updatedRows = [...rowsErrMsg];
        updatedRows[index].qty = false;
        setRowsErrMsg(updatedRows);
      }
    });

    return isValid;
  };
  // console.log({ rows });
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  // add / delete rows for multiple medicine functionality

  const addNewRow = () => {
    setRows([...rows, { batch_no: "", name: "", qty: 0, maxQyt: 0 }]);
    setRowsErrMsg([...rowsErrMsg, { medicine: false, qty: false }]);
  };

  const removeRow = (indexToRemove) => {
    setRows(rows.filter((_, index) => index !== indexToRemove));
    setRowsErrMsg(rowsErrMsg.filter((_, index) => index !== indexToRemove));
  };

  // Preslected Medicine Ids
  useEffect(() => {
    let x = rows?.map((i) => {
      return i.id;
    });
    setPreselectedMedicine(x);
  }, [rows]);
  //Medicine and Qunatity change
  const handleQuantityChange = (index, value) => {
    if (!isNaN(value)) {
      const updatedRows = [...rows];
      updatedRows[index].qty = value;
      setRows(updatedRows);
    }
  };

  const searchSelectData = (e, index) => {
    const updatedRows = [...rows];
    updatedRows[index].name = e?.name;
    updatedRows[index].batch_no = e?.id;
    updatedRows[index].maxQyt = parseInt(e?.qty);
    updatedRows[index].stock_id = e?.stock_item_id;
    setRows(updatedRows);
  };

  // const [storeList] = useState(props?.batchList);

  const SetStoreTypeDropDown = () => {
    setIsStoreTypeMenuOpen(!isStoreTypeMenuOpen);
  };
  const storeTypeCatClose = () => {
    setIsStoreTypeMenuOpen(false);
  };
  const storeTypeCatPressed = (item) => {
    // console?.log({item})
    if (rows?.find((p) => p?.name == item?.name)) {
      setIsStoreTypeMenuOpen(false);
      errorToast("Error", "Batch is already selected");
    } else {
      setStoreType(item?.name);
      searchSelectData(item, index);
      setIsStoreTypeMenuOpen(false);
    }
  };
  const isSelectedFun = () => {};
  const totalQty = rows?.reduce((acc, curr) => acc + parseInt(curr?.qty), 0);
  return (
    <Modal
      avoidKeyboard
      animationType="slide"
      transparent={true}
      visible={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 11}
        style={[reduxColors.container, { backgroundColor: "transparent" }]}
      >
        <View style={[reduxColors.modalOverlay]}>
          <View style={reduxColors.modalContainer}>
            <View style={reduxColors.modalHeader}>
              <View style={reduxColors.leftBoxStyle}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: constThemeColor.onPrimaryContainer,
                  }}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  {selectItemName?.name}
                </Text>
                {selectItemName?.composition ? (
                  <View>
                    <Text
                      ref={textRef}
                      onTextLayout={handleTextLayout}
                      numberOfLines={showMore ? undefined : 2}
                      style={{ paddingVertical: Spacing.mini }}
                    >
                      {selectItemName?.composition}
                    </Text>
                    {textLines > 1 && (
                      <TouchableOpacity onPress={toggleShowMore}>
                        <Text style={{ color: constThemeColor.secondary }}>
                          {showMore ? "Show less" : "Show more"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null}
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text style={reduxColors.stockBoxText}>
                    Availability:{" "}
                    <Text style={reduxColors.stockBoxText}>
                      <Text
                        style={[
                          reduxColors.stockValue,
                          {
                            color:
                              selectItemName?.total_qty == "0"
                                ? constThemeColor?.error
                                : null,
                          },
                        ]}
                      >
                        {selectItemName?.total_qty ?? "0"}
                      </Text>
                    </Text>
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={1}
                onPress={handleToggleCommDropdown}
                accessible={true}
                accessibilityLabel={"prescriptionModalClose"}
                AccessibilityId={"prescriptionModalClose"}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>

            <View style={reduxColors.modalBody}>
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: Spacing.body,
                }}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={[
                    FontSize.Antz_Body_Title,
                    {
                      color: constThemeColor?.onSurfaceVariant,
                      // paddingBottom: Spacing.small,
                    },
                  ]}
                >
                  Batch
                </Text>
                {rows?.length > 0 &&
                  rows?.map((row, index) => (
                    <View>
                      {true ? (
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: Spacing.mini,
                          }}
                        >
                          <Text
                            style={[
                              FontSize.Antz_Subtext_title,
                              { color: constThemeColor?.onSurfaceVariant },
                            ]}
                          >
                            Quantity: {row.maxQyt}
                          </Text>
                        </View>
                      ) : null}

                      <View style={{}}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            // backgroundColor:'red'
                            height: 60,
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              alignItems: "center",
                            }}
                          >
                            <ModalTitleData
                              selectDrop={
                                row?.name ? ` ${row?.name}` : " Choose Batch"
                              }
                              toggleModal={() => {
                                setIndex(index);
                                SetStoreTypeDropDown();
                              }}
                              dropDownIcon={true}
                              size={16}
                              alignStyle="space-between"
                              selectDropStyle={{
                                color: constThemeColor.onPrimaryContainer,
                                // alignItems: "flex-start",
                                flexDirection: "row",
                              }}
                              touchStyle={[
                                reduxColors.popUpStyle,
                                {
                                  backgroundColor: constThemeColor.surface,
                                  borderWidth: 1,
                                  borderColor: constThemeColor.outlineVariant,
                                  height: 54,
                                  flex: 1,
                                  marginRight: Spacing.small,
                                  padding: Spacing.body,
                                  // width: showFrequencyField == false ? "100%" : "75%",
                                  justifyContent: "space-between",
                                },
                              ]}
                            />
                          </View>
                          <View style={{ width: 100, margin: 0 }}>
                            <TextInput
                              accessible={true}
                              // editable={disablCheck ? false : true}
                              accessibilityLabel={"quantityInput"}
                              AccessibilityId={"quantityInput"}
                              autoCompleteType="off"
                              style={[reduxColors.giveInput]}
                              value={row?.qty ?? 0}
                              onChangeText={(e) =>
                                handleQuantityChange(index, e)
                              }
                              placeholderTextColor={
                                constThemeColor?.neutralPrimary
                              }
                              placeholder="Quantity"
                              keyboardType="numeric"
                            />
                          </View>
                          <View
                            style={{
                              width: 80,
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginLeft: Spacing.mini,
                              marginTop: Spacing.mini,
                              marginLeft: Spacing.small,
                              height: 40,
                              flexDirection: "row",
                            }}
                          >
                            {index == rows?.length - 1 && (
                              <>
                                <TouchableOpacity
                                  onPress={() => addNewRow()}
                                  style={{
                                    borderRadius: Spacing.mini,
                                    width: 40,
                                    height: 40,
                                    backgroundColor:
                                      constThemeColor?.secondaryContainer,
                                    alignItems: "center",
                                    justifyContent: "center",

                                    // borderColor: constThemeColor.primary,
                                  }}
                                >
                                  <AntDesign
                                    name="plus"
                                    size={24}
                                    color={"black"}
                                  />
                                </TouchableOpacity>
                                {rows?.length > 1 ? (
                                  <TouchableOpacity
                                    onPress={() => removeRow(index)}
                                    style={{
                                      alignSelf: "center",
                                      width: 40,
                                      height: 40,
                                      marginLeft: Spacing.small,
                                      // marginTop: Spacing.mini + Spacing.micro,
                                      // borderRadius: Spacing.mini,
                                      // borderWidth: 1,
                                      // padding: Spacing.body + 1,
                                      // borderColor: constThemeColor.error,
                                    }}
                                  >
                                    <MaterialIcons
                                      name="highlight-remove"
                                      size={35}
                                      color={constThemeColor.error}
                                    />
                                  </TouchableOpacity>
                                ) : null}
                              </>
                            )}
                            {index !== rows?.length - 1 && (
                              <TouchableOpacity
                                onPress={() => removeRow(index)}
                                style={{
                                  alignSelf: "center",
                                  width: 40,
                                  height: 40,
                                  // marginTop: Spacing.mini + Spacing.micro,
                                  // borderRadius: Spacing.mini,
                                  // borderWidth: 1,
                                  // padding: Spacing.body + 1,
                                  // borderColor: constThemeColor.error,
                                }}
                              >
                                <MaterialIcons
                                  name="highlight-remove"
                                  size={35}
                                  color={constThemeColor.error}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>

                        {isStoreTypeMenuOpen ? (
                          <ModalFilterComponent
                            onPress={SetStoreTypeDropDown}
                            onDismiss={storeTypeCatClose}
                            onBackdropPress={storeTypeCatClose}
                            onRequestClose={storeTypeCatClose}
                            data={batchList}
                            closeModal={storeTypeCatPressed}
                            style={{ alignItems: "flex-start" }}
                            isSelectedId={isSelectedFun}
                            radioButton={false}
                            checkIcon={true}
                          />
                        ) : null}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View>
                          {rowsErrMsg[index]?.medicine && (
                            <View style={{ textAlign: "right", width: "100%" }}>
                              <Text style={{ color: constThemeColor?.error }}>
                                {rowsErrMsg[index]?.medicine}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View style={{ width: 190 }}>
                          {rowsErrMsg[index]?.qty && (
                            <View style={{ textAlign: "right", width: "100%" }}>
                              <Text style={{ color: constThemeColor?.error }}>
                                {rowsErrMsg[index]?.qty}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
              </ScrollView>
            </View>
          </View>

          {/* Footer */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              position: "absolute",
              flexDirection: "row",
              paddingHorizontal: Spacing.body,
              bottom: 0,
              backgroundColor: constThemeColor?.displaybgPrimary,
            }}
          >
            <View>
              <Text
                style={[
                  FontSize?.Antz_Minor_Regular,
                  { color: constThemeColor?.on_Surface },
                ]}
              >
                Total Quantity {totalQty}
              </Text>
            </View>
            <TouchableOpacity
              style={reduxColors.addMedBtn}
              onPress={() => {
                if (validateSalts()) {
                  handleDetailsSubmit(selectItemName, rows);
                }
              }}
              accessible={true}
              accessibilityLabel={"addMedicine"}
              AccessibilityId={"addMedicine"}
            >
              <Text style={reduxColors.bottomBtnTxt}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* {isStoreTypeMenuOpen ? (
        <View>
          <Modals
            animationType="fade"
            visible={isStoreTypeMenuOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={storeTypeCatClose}
          >
            <Category
              categoryData={batchList}
              onCatPress={storeTypeCatPressed}
              heading={"Select Store"}
              isMulti={false}
              onClose={storeTypeCatClose}
            />
          </Modals>
        </View>
      ) : null} */}
      <Loader visible={isLoading} />
    </Modal>
  );
};

export default DispenseModal;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 60),
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      // backgroundColor: reduxColors.onPrimary,
      // width: "100%",
      // flex: 1,
      // justifyContent: "center",
      // alignItems: "center",
      // borderTopLeftRadius: 16,
      // borderTopRightRadius: 16,
      // marginTop: 100,

      backgroundColor: reduxColors.onPrimary,
      width: "100%",
      minHeight: 450,
      //   marginTop: 300,
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: Spacing.minor,
      borderTopRightRadius: Spacing.minor,
    },
    modalHeader: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: Spacing.minor,
      paddingVertical: Spacing.body,
      borderBottomWidth: 1,
      borderBottomColor: reduxColors.outlineVariant,
    },
    leftBoxStyle: {
      flex: 1,
    },
    description: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      paddingVertical: Spacing.small,
    },
    stockBoxText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    stockValue: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
    },
    modalBody: {
      flex: 1,
      width: "100%",
      paddingHorizontal: Spacing.minor,
      marginBottom: 80,
      marginTop: Spacing.mini,
    },
    labelName: {
      color: reduxColors.textColor,
      fontSize: FontSize.Antz_Standerd,
    },
    suggestionTitle: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginVertical: Spacing.mini,
    },
    durationInput: {
      width: 72,
      height: 54,
      paddingLeft: Spacing.body,
      // paddingVertical: Spacing.mini,
      marginRight: Spacing.body,
      borderRadius: 4,
      backgroundColor: reduxColors.surface,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
    giveInput: {
      width: 121,
      height: 54,
      paddingLeft: Spacing.body,
      marginRight: Spacing.body,
      borderRadius: 4,
      backgroundColor: reduxColors.surface,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
    frequencyInput: {
      width: 74,
      height: 54,
      paddingLeft: Spacing.body,
      // paddingVertical: Spacing.mini,
      marginRight: Spacing.body,
      borderRadius: 4,
      backgroundColor: reduxColors.surface,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
    fontStyle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    commonSelectStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: Spacing.mini,
    },
    inputBox: {
      width: "90%",
      height: 50,
      marginBottom: Spacing.body,
      flexDirection: "row",
      alignItems: "center",
    },
    notesBoxCover: {
      height: 50,
      paddingHorizontal: Spacing.small,
      flexDirection: "row",
      backgroundColor: reduxColors.notes,
      borderRadius: Spacing.mini,
      borderColor: reduxColors.mediumGrey,
      marginTop: Spacing.micro,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
    notesTextFeild: {
      padding: Spacing.mini,
      color: reduxColors.onErrorContainer,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
    },
    addMedBtn: {
      minWidth: 70,
      height: 40,
      marginBottom: Spacing.major,
      marginTop: Spacing.major,
      borderRadius: 8,
      backgroundColor: reduxColors.primary,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    bottomBtnTxt: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimary,
    },
    centeredView: {
      alignItems: "center",
      backgroundColor: reduxColors?.lightBlack,
      flex: 1,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: reduxColors.onPrimary,
      width: "90%",
      borderRadius: 8,
      shadowColor: reduxColors.shadow,
      top: "30%",
    },
    modalText: {
      fontStyle: "normal",
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      paddingTop: Spacing.small,
      paddingLeft: Spacing.minor,
      color: reduxColors.neutralPrimary,
    },
    inputBoxStyle: {
      width: "90%",
      alignSelf: "center",
      borderWidth: 1,
      borderStyle: "solid",
      borderRadius: 4,
      padding: Spacing.small,
      minHeight: 100,
      textAlignVertical: "top",
    },
    btnView: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      width: "100%",
      marginBottom: Spacing.minor,

      paddingRight: Spacing.minor + Spacing.mini,
    },

    skipBtn: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: 90,
      height: 32,
      right: Spacing.body,
      backgroundColor: reduxColors.surfaceVariant,
      borderRadius: 4,
    },
    doneBtn: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      minWidth: 150,
      height: 32,
      backgroundColor: reduxColors.primary,
      borderRadius: 4,
    },
    textStyle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    },
    popUpStyle: {
      padding: Spacing.minor,
      borderRadius: Spacing.mini,
    },
    giveInput: {
      width: 100,
      height: 54,
      paddingLeft: Spacing.body,
      marginRight: Spacing.body,
      borderRadius: 4,
      backgroundColor: reduxColors.surface,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
  });
