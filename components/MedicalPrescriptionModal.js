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
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import CheckBox from "./CheckBox";
// import { DosaseTab } from "../screen/Medical/Prescription";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { capitalize, opacityColor } from "../utils/Utils";
import { LayoutAnimation } from "react-native";
import { useCallback } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import ModalFilterComponent, { ModalTitleData } from "./ModalFilterComponent";
import { Checkbox, Divider } from "react-native-paper";
import Loader from "./Loader";

const MedicalPrescriptionModal = ({
  selectItemName,
  handleToggleCommDropdown,
  SelectedAnimalRedux,
  SelectedEnclosureRedux,
  SelectedSectionRedux,
  selectAction,
  setSelectAction,
  recordWeight,
  dataWeight,
  setRecordWeight,
  setRecordWeightUnit,
  dosagePerWeight,
  handleDosagePerWeightSelect,
  dosagePerWeightUnit,
  handleDosagePerWeightUnitSelect,
  give,
  handleGiveSelect,
  dosagePerWeightdata,
  giveUnit,
  recordWeightUnit,
  handleGiveSelectUnit,
  isError,
  errorMessage,
  frequencyValue,
  reasonModal,
  handleCloseModel,
  reasonModalType,
  handleWhenSelect,
  frequencyData,
  frequencyUnit,
  handleWhenSelectUnit,
  durationNo,
  durationData,
  durationType,
  isLoading,
  setisLoading,
  handleDurationInptSelect,
  handleDurationSelect,
  quantity,
  dosageData,
  handleQuantitySelect,
  routeData,
  route,
  handleDilevery,
  latestWeight,
  notes,
  handleNote,
  prevMediceStatus,
  resonModalFun,
  handleDetailsSubmit,
  showDurationField,
  showFrequencyField,
  isErrorDosage,
  isErrorDuration,
  isErrorQyt,
  isErrorFreq,
  setStopMedicine,
  setRestartMedicine,
  setreasonText,
  reasonText,
  toggleUNitModal,
  closeUnitModal,
  closeMenuUnit,
  isSelectedIdUnit,
  medicalUnitModal,
  togglefrequencyModal,
  closefrequencyModal,
  closeMenufrequency,
  isSelectedIdfrequency,
  medicalfrequencyModal,
  checkSignleAnimal,
  setSideEffects,
  sideEffects,

  toggleDurationModal,
  closeDurationModal,
  closeMenuDuration,
  isSelectedIdDuration,
  medicalDurationModal,

  toggleRouteModal,
  closeRouteModal,
  closeMenuRoute,
  isSelectedIdRoute,
  medicalRouteModal,

  frequencyUnitLabel,
  durationTypeLabel,
  routeLabel,
  medicalStatusUpdate,
  setReasonModal,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [showMore, setShowMore] = useState(false);
  const [textLines, setTextLines] = useState(2);
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

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  const mappedDosageData = dosageData.map((item) => ({
    id: item.id,
    name: item.label,
    key: item.key,
  }));
  const mappedFrequencyData = frequencyData.map((item) => ({
    id: item.id,
    name: item.label,
    key: item.key,
  }));
  const mappedDurationData = durationData.map((item) => ({
    id: item.id,
    name: item.label,
    key: item.key,
  }));
  const mappedRouteData = routeData.map((item) => ({
    id: item.id,
    name: item.delivery,
  }));
  const disablCheck =
    (selectItemName?.additional_info?.start_date &&
      !selectItemName?.additional_info?.stop_date) ||
    selectItemName?.additional_info?.will_restart == false;
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
                      style={reduxColors.secondViewTitleText}
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
                    {/* <Text style={reduxColors.stockBoxText}>
                      Local
                      <Text
                        style={[
                          reduxColors.stockValue,
                          {
                            color:
                              selectItemName?.total_local_store_qty == "0"
                                ? constThemeColor?.error
                                : null,
                          },
                        ]}
                      >
                        {" "}
                        {selectItemName?.total_local_store_qty ?? "0"}
                      </Text>
                    </Text>
                    <Text style={reduxColors.stockBoxText}>
                    {" ,"} Central
                      <Text
                        style={[
                          reduxColors.stockValue,
                          {
                            color:
                              selectItemName?.total_central_store_qty == "0"
                                ? constThemeColor?.error
                                : null,
                          },
                        ]}
                      >
                        {" "}
                        {selectItemName?.total_central_store_qty ?? "0"}
                      </Text>
                    </Text> */}
                  </Text>
                  {/* <FlatList
                    horizontal
                    key={({ item }) => item?.store_data?.id}
                    showsHorizontalScrollIndicator={false}
                    data={selectItemName?.store_data}
                    renderItem={({ item: value, index }) => {
                      return (
                        <Text style={reduxColors.stockBoxText}>
                          {value?.store_name}
                          <Text
                            style={[
                              reduxColors.stockValue,
                              {
                                color:
                                  value?.medicine_qty == "0"
                                    ? constThemeColor?.error
                                    : null,
                              },
                            ]}
                          >
                            {" "}
                            {value?.medicine_qty}{" "}
                            {selectItemName?.store_data?.length - 1 == index
                              ? ""
                              : ", "}
                          </Text>
                        </Text>
                      );
                    }}
                  /> */}
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
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    // justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* {checkSignleAnimal ? (
                    <>
                      <Text
                        style={{
                          paddingVertical: Spacing.small,
                          fontSize: FontSize.Antz_Body_Title.fontSize,
                          fontWeight: FontSize.Antz_Body_Title.fontWeight,
                          color: constThemeColor?.onSurfaceVariant,
                        }}
                      >
                        Body Weight - {latestWeight ? latestWeight : "NA"}
                      </Text>
                    </>
                  ) : null} */}
                </View>
                {checkSignleAnimal ? <Divider /> : null}
                <View style={{ paddingVertical: Spacing.small }}>
                  <Text style={[reduxColors.suggestionTitle]}>Give</Text>

                  <View style={reduxColors.commonSelectStyle}>
                    <TextInput
                      accessible={true}
                      editable={disablCheck ? false : true}
                      accessibilityLabel={"giveInput"}
                      AccessibilityId={"giveInput"}
                      autoCompleteType="off"
                      style={[reduxColors.giveInput]}
                      value={give}
                      onChangeText={(e) => handleGiveSelect(e)}
                      placeholder="0"
                      keyboardType="numeric"
                    />

                    <ModalTitleData
                      selectDrop={giveUnit}
                      toggleModal={toggleUNitModal}
                      disabled={disablCheck ? true : false}
                      dropDownIcon={true}
                      selectDropStyle={{
                        color: constThemeColor.onPrimaryContainer,
                        paddingRight: 24,
                        paddingLeft: 12,
                      }}
                      touchStyle={[
                        reduxColors.popUpStyle,
                        {
                          backgroundColor: constThemeColor.surface,
                          borderWidth: 1,
                          borderColor: constThemeColor.outlineVariant,
                          height: 54,
                          // width: "75%",
                          // flex: 1,
                          justifyContent: "space-between",
                        },
                      ]}
                    />
                    {medicalUnitModal ? (
                      <ModalFilterComponent
                        onPress={toggleUNitModal}
                        onDismiss={closeUnitModal}
                        onBackdropPress={closeUnitModal}
                        onRequestClose={closeUnitModal}
                        data={mappedDosageData}
                        closeModal={closeMenuUnit}
                        style={{ alignItems: "flex-start" }}
                        isSelectedId={isSelectedIdUnit}
                        radioButton={false}
                        checkIcon={true}
                      />
                    ) : null}
                  </View>
                  {isErrorDosage && (
                    <View style={{ textAlign: "left", width: "100%" }}>
                      <Text style={{ color: constThemeColor?.error }}>
                        {isErrorDosage}
                      </Text>
                    </View>
                  )}
                  {/* {isError?.dosageUnit && (
                    <View
                      style={{
                        textAlign: "left",
                        width: "100%",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text style={{ color: constThemeColor?.error }}>
                        {errorMessage?.dosageUnit}
                      </Text>
                    </View>
                  )} */}
                </View>

                <View
                  style={{
                    paddingVertical: Spacing.small,
                  }}
                >
                  <Text style={[reduxColors.suggestionTitle]}>Frequency</Text>

                  <View style={reduxColors.commonSelectStyle}>
                    {showFrequencyField ? (
                      <TextInput
                        accessible={true}
                        editable={disablCheck ? false : true}
                        accessibilityLabel={"frequencyInput"}
                        AccessibilityId={"frequencyInput"}
                        autoCompleteType="off"
                        style={[reduxColors.frequencyInput]}
                        value={frequencyValue}
                        onChangeText={(e) => handleWhenSelect(e)}
                        placeholder="0"
                        keyboardType="numeric"
                      />
                    ) : null}
                    <ModalTitleData
                      selectDrop={frequencyUnitLabel}
                      toggleModal={togglefrequencyModal}
                      disabled={disablCheck ? true : false}
                      dropDownIcon={true}
                      size={16}
                      selectDropStyle={{
                        color: constThemeColor.onPrimaryContainer,
                        paddingRight: 22,
                        paddingLeft: 10,
                        alignItems: "flex-start",
                        // width: "70%",
                        maxWidth: 200,
                      }}
                      touchStyle={[
                        reduxColors.popUpStyle,
                        {
                          backgroundColor: constThemeColor.surface,
                          borderWidth: 1,
                          borderColor: constThemeColor.outlineVariant,
                          height: 54,
                          maxWidth: 225,
                          // width: showFrequencyField == false ? "100%" : "75%",
                          justifyContent: "space-between",
                        },
                      ]}
                    />
                    {medicalfrequencyModal ? (
                      <ModalFilterComponent
                        onPress={togglefrequencyModal}
                        onDismiss={closefrequencyModal}
                        onBackdropPress={closefrequencyModal}
                        onRequestClose={closefrequencyModal}
                        data={mappedFrequencyData}
                        closeModal={closeMenufrequency}
                        style={{ alignItems: "flex-start" }}
                        isSelectedId={isSelectedIdfrequency}
                        radioButton={false}
                        checkIcon={true}
                      />
                    ) : null}
                  </View>
                  {give && frequencyValue != 0 ? (
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Body_Title.fontSize,
                        fontWeight: FontSize.Antz_Body_Title?.fontWeight,
                        color: constThemeColor?.onSurface,
                        paddingTop: Spacing.mini,
                      }}
                    >
                      {give} {giveUnit}{" "}
                      {frequencyUnit
                        ?.replace("_x_", ` ${frequencyValue} `)
                        ?.replaceAll("_", " ")}
                    </Text>
                  ) : null}
                  {isErrorFreq && (
                    <View style={{ textAlign: "left", width: "100%" }}>
                      <Text style={{ color: constThemeColor?.error }}>
                        {isErrorFreq}
                      </Text>
                    </View>
                  )}

                  {/* {isError?.frequencyUnit && (
                    <View
                      style={{
                        textAlign: "right",
                        width: "100%",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text style={{ color: constThemeColor?.error }}>
                        {errorMessage?.frequencyUnit}
                      </Text>
                    </View>
                  )} */}
                </View>

                <View
                  style={{
                    paddingVertical: Spacing.small,
                  }}
                >
                  <Text style={[reduxColors.suggestionTitle]}>Duration</Text>

                  <View style={[reduxColors.commonSelectStyle]}>
                    {showDurationField ? (
                      <TextInput
                        accessible={true}
                        editable={disablCheck ? false : true}
                        accessibilityLabel={"durationInput"}
                        AccessibilityId={"durationInput"}
                        autoCompleteType="off"
                        style={[reduxColors.durationInput]}
                        value={durationNo}
                        onChangeText={(e) => handleDurationInptSelect(e)}
                        placeholder="0"
                        keyboardType="numeric"
                      />
                    ) : null}
                    <ModalTitleData
                      selectDrop={durationTypeLabel}
                      toggleModal={toggleDurationModal}
                      disabled={disablCheck ? true : false}
                      dropDownIcon={true}
                      size={16}
                      selectDropStyle={{
                        color: constThemeColor.onPrimaryContainer,
                        paddingRight: 24,
                        paddingLeft: 12,
                        flex: 1,
                      }}
                      touchStyle={[
                        reduxColors.popUpStyle,
                        {
                          backgroundColor: constThemeColor.surface,
                          borderWidth: 1,
                          borderColor: constThemeColor.outlineVariant,
                          height: 54,
                          width: 222,
                          justifyContent: "space-between",
                          // width: showFrequencyField == false ? "100%" : "75%",
                        },
                      ]}
                    />
                    {medicalDurationModal ? (
                      <ModalFilterComponent
                        onPress={toggleDurationModal}
                        onDismiss={closeDurationModal}
                        onBackdropPress={closeDurationModal}
                        onRequestClose={closeDurationModal}
                        data={mappedDurationData}
                        closeModal={closeMenuDuration}
                        style={{ alignItems: "flex-start" }}
                        isSelectedId={isSelectedIdDuration}
                        radioButton={false}
                        checkIcon={true}
                      />
                    ) : null}
                  </View>
                  {isErrorDuration && (
                    <View style={{ textAlign: "left", width: "100%" }}>
                      <Text style={{ color: constThemeColor?.error }}>
                        {isErrorDuration}
                      </Text>
                    </View>
                  )}
                </View>

                {/* <View
                  style={{
                    paddingVertical: Spacing.small,
                  }}
                >
                  <Text style={[reduxColors.suggestionTitle]}>
                    Quantity in {selectItemName?.dose_form ?? "tablets"}
                  </Text>

                  <View style={[reduxColors.commonSelectStyle]}>
                    <TextInput
                      accessible={true}
                      editable={disablCheck ? false : true}
                      accessibilityLabel={"quantityInput"}
                      AccessibilityId={"quantityInput"}
                      autoCompleteType="off"
                      style={[reduxColors.durationInput, { width: 75 }]}
                      // inputMode="numeric"
                      value={quantity}
                      onChangeText={(e) => handleQuantitySelect(e)}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </View>
                  {isErrorQyt && (
                    <View style={{ textAlign: "left", width: "100%" }}>
                      <Text style={{ color: constThemeColor?.error }}>
                        {isErrorQyt}
                      </Text>
                    </View>
                  )}
                </View> */}

                <View
                  style={{
                    paddingVertical: Spacing.small,
                  }}
                >
                  <Text style={[reduxColors.suggestionTitle]}>
                    Delivery Route
                  </Text>
                  <View style={reduxColors.commonSelectStyle}>
                    <ModalTitleData
                      selectDrop={routeLabel}
                      toggleModal={toggleRouteModal}
                      disabled={disablCheck ? true : false}
                      dropDownIcon={true}
                      size={16}
                      selectDropStyle={{
                        color: constThemeColor.onPrimaryContainer,
                        paddingRight: 24,
                        paddingLeft: 12,
                        flex: 1,
                      }}
                      touchStyle={[
                        reduxColors.popUpStyle,
                        {
                          backgroundColor: constThemeColor.surface,
                          borderWidth: 1,
                          borderColor: constThemeColor.outlineVariant,
                          height: 54,
                          width: 222,
                          justifyContent: "space-between",
                        },
                      ]}
                    />
                    {medicalRouteModal ? (
                      <ModalFilterComponent
                        onPress={toggleRouteModal}
                        onDismiss={closeRouteModal}
                        onBackdropPress={closeRouteModal}
                        onRequestClose={closeRouteModal}
                        data={mappedRouteData}
                        closeModal={closeMenuRoute}
                        style={{ alignItems: "flex-start" }}
                        isSelectedId={isSelectedIdRoute}
                        radioButton={false}
                        checkIcon={true}
                      />
                    ) : null}
                  </View>
                  {/* {isError?.delivery && (
                    <View style={{ textAlign: "left", width: "100%" }}>
                      <Text style={{ color: constThemeColor?.error }}>
                        {errorMessage?.delivery}
                      </Text>
                    </View>
                  )} */}
                </View>

                <View
                  style={{
                    paddingVertical: Spacing.body,
                  }}
                >
                  <Text style={[reduxColors.suggestionTitle]}>Notes</Text>
                  <View style={reduxColors.inputBox}>
                    <View style={reduxColors.notesBoxCover}>
                      <TextInput
                        accessible={true}
                        editable={disablCheck ? false : true}
                        accessibilityLabel={"notesInput"}
                        AccessibilityId={"notesInput"}
                        autoCompleteType="off"
                        placeholder="Add Notes"
                        value={notes}
                        placeholderTextColor={constThemeColor.mediumGrey}
                        style={[reduxColors.notesTextFeild, { width: "100%" }]}
                        onChangeText={(e) => handleNote(e)}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Footer */}
          {selectItemName?.additional_info?.will_restart == true ||
          !selectItemName?.additional_info ? (
            <>
              {prevMediceStatus ? (
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    position: "absolute",
                    bottom: 0,
                    backgroundColor: constThemeColor?.displaybgPrimary,
                  }}
                >
                  {selectItemName?.additional_info?.stop_date ? (
                    <TouchableOpacity
                      accessible={true}
                      accessibilityLabel={"restartMedicine"}
                      AccessibilityId={"restartMedicine"}
                      style={reduxColors.addMedBtn}
                      onPress={() => resonModalFun("restart")}
                    >
                      <Text style={reduxColors.bottomBtnTxt}>
                        Restart Medicine
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      accessible={true}
                      accessibilityLabel={"stopMedicine"}
                      AccessibilityId={"stopMedicine"}
                      style={[
                        reduxColors.addMedBtn,
                        { backgroundColor: constThemeColor?.errorContainer },
                      ]}
                      onPress={() => resonModalFun("stop")}
                    >
                      <Text
                        style={[
                          reduxColors.bottomBtnTxt,
                          { color: constThemeColor?.error },
                        ]}
                      >
                        Stop Medicine
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    position: "absolute",
                    bottom: 0,
                    backgroundColor: constThemeColor?.displaybgPrimary,
                  }}
                >
                  <TouchableOpacity
                    style={reduxColors.addMedBtn}
                    onPress={() =>
                      handleDetailsSubmit(
                        selectItemName?.name,
                        selectItemName?.id
                      )
                    }
                    accessible={true}
                    accessibilityLabel={"addMedicine"}
                    AccessibilityId={"addMedicine"}
                  >
                    <Text style={reduxColors.bottomBtnTxt}>Add Medicine</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : null}
        </View>
      </KeyboardAvoidingView>

      {reasonModal ? (
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={reasonModal}
          onRequestClose={handleCloseModel}
        >
          <View style={reduxColors.centeredView}>
            <View style={reduxColors.modalView}>
              <View style={{ alignContent: "flex-start", width: "100%" }}>
                <Text style={reduxColors.modalText}>
                  Reason to {reasonModalType} medicine
                </Text>
                {reasonModalType == "stop" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingLeft: Spacing.small,
                      marginTop: Spacing.body,
                    }}
                  >
                    <Checkbox.Android
                      status={sideEffects ? "checked" : "unchecked"}
                      onPress={() => setSideEffects(!sideEffects)}
                    />
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Subtext_title.fontSize,
                        fontWeight: FontSize.Antz_Subtext_title.fontWeight,
                        color: constThemeColor?.tertiary,
                      }}
                    >
                      Mark if it had caused adverse side effects
                    </Text>
                  </View>
                ) : null}
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: Spacing.body,
                }}
              >
                <TextInput
                  accessible={true}
                  accessibilityLabel={"reasonInput"}
                  AccessibilityId={"reasonInput"}
                  multiline
                  numberOfLines={3}
                  placeholder={
                    reasonModalType == "stop"
                      ? "Enter reason to stop this medicine"
                      : "Enter reason to restart this medicine"
                  }
                  placeholderTextColor={constThemeColor?.onErrorContainer}
                  autoFocus={true}
                  onChangeText={setreasonText}
                  value={reasonText}
                  style={[
                    reduxColors.inputBoxStyle,
                    {
                      backgroundColor:
                        reasonModalType == "stop"
                          ? constThemeColor?.errorContainer
                          : constThemeColor?.surface,
                      borderColor:
                        reasonModalType == "stop"
                          ? constThemeColor.error
                          : constThemeColor?.outlineVariant,
                    },
                  ]}
                  // underlineColorAndroid="transparent"
                />
              </View>

              <View
                style={[
                  reduxColors.btnView,
                  {
                    marginTop: Spacing.body,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[reduxColors.skipBtn]}
                  onPress={handleCloseModel}
                  accessible={true}
                  accessibilityLabel={"cancelTouch"}
                  AccessibilityId={"cancelTouch"}
                >
                  <Text
                    style={[
                      reduxColors.textStyle,
                      { color: constThemeColor?.onSurfaceVariant },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={reasonText ? false : true}
                  style={[
                    reduxColors.doneBtn,
                    {
                      backgroundColor: reasonText
                        ? reasonModalType == "stop"
                          ? constThemeColor?.error
                          : constThemeColor?.primary
                        : constThemeColor?.surfaceVariant,
                    },
                  ]}
                  onPress={() => {
                    setReasonModal(false);
                    setisLoading(true);
                    if (reasonModalType == "stop") {
                      medicalStatusUpdate(selectItemName?.id, "stop");
                    } else {
                      setStopMedicine(false);
                      medicalStatusUpdate(selectItemName?.id, "restart");
                    }
                  }}
                  accessible={true}
                  accessibilityLabel={"reasonBtn"}
                  AccessibilityId={"reasonBtn"}
                >
                  <Text
                    style={[
                      reduxColors.textStyle,
                      { color: constThemeColor?.onPrimary },
                    ]}
                  >
                    {reasonModalType == "stop"
                      ? "Stop Medicine"
                      : "Restart Medicine"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

      <Loader visible={isLoading} />
    </Modal>
  );
};

export default MedicalPrescriptionModal;

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
      flex: 1,
      marginTop: 100,
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
      minWidth: 140,
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
  });
