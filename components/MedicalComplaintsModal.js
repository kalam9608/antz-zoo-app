import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "../configs/Spacing";
import ModalFilterComponent, { ModalTitleData } from "./ModalFilterComponent";
import { opacityColor } from "../utils/Utils";
import FontSize from "../configs/FontSize";
import { Divider } from "react-native-paper";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";

const MedicalComplaintsModal = ({
  selectCommonModalName,
  handleToggleCommDropdown,
  detailsReport,
  togglePrintModal,
  durationNo,
  handleDurationInptSelect,
  durationType,
  toggleDateModal,
  medicalPrirotyModal,
  medicalDateModal,
  closePrintModal,
  PrirotyData,
  closeMenu,
  isSelectedId,
  closeDateModal,
  durationData,
  closeMenuDate,
  isSelectedIdDay,
  backgroundSideColor,
  handleDetailsSubmit,
  toggleStatusModal,
  medicalStatusModal,
  closeStatusModal,
  StatusData,
  status,
  closeMenuStatus,
  isSelectedIdStatus,
  handleNotesInptSelect,
  handleClosedNotesInptSelect,
  notesStop,
  updateComplaints,
  selectCommonModalId,
}) => {
  const [isError, setIsError] = useState(false);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  console?.log({ status });
  return (
    <>
      <Modal
        avoidKeyboard
        animationType="none"
        transparent={true}
        visible={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 11}
          style={[reduxColors.container, { backgroundColor: "transparent" }]}
        >
          <View style={[reduxColors.modalOverlay]}>
            <View
              style={[
                reduxColors.modalContainer,
                {
                  minHeight:
                    Platform.OS === "ios"
                      ? detailsReport?.active_at
                        ? 500
                        : 330
                      : detailsReport?.active_at
                      ? 550
                      : 350,
                },
              ]}
            >
              <View style={reduxColors.modalHeader}>
                <View>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Minor_Title.fontSize,
                      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                      color: constThemeColor.onPrimaryContainer,
                    }}
                  >
                    {selectCommonModalName}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  style={reduxColors.closeBtn}
                  onPress={handleToggleCommDropdown}
                  accessible={true}
                  accessibilityLabel={"complaintsModalClose"}
                  AccessibilityId={"complaintsModalClose"}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={constThemeColor.onSurfaceVariant}
                  />
                </TouchableOpacity>
              </View>
              <View style={reduxColors.modalBody}>
                <View
                  style={{
                    paddingVertical: Spacing.body,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={reduxColors.severity}>Severity</Text>
                  <View>
                    <ModalTitleData
                      selectDrop={
                        detailsReport?.severity
                          ? detailsReport?.severity
                          : "Mild"
                      }
                      toggleModal={togglePrintModal}
                      imageIcon={true}
                      size={16}
                      selectDropStyle={{
                        color: constThemeColor.onPrimary,
                        paddingHorizontal: 12,
                      }}
                      touchStyle={[
                        reduxColors.popUpStyle,
                        {
                          backgroundColor: backgroundSideColor(
                            detailsReport?.severity
                              ? detailsReport?.severity
                              : "Mild",
                            constThemeColor
                          ),
                        },
                      ]}
                    />
                  </View>
                </View>

                <Divider />
                {detailsReport?.active_at ? (
                  <>
                    <View
                      style={{
                        paddingVertical: Spacing.minor,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={reduxColors.severity}>Status</Text>
                      <View>
                        <ModalTitleData
                          selectDrop={status ? status : "active"}
                          disabled={
                            detailsReport?.status == "closed" ? true : false
                          }
                          toggleModal={
                            detailsReport?.status == "closed"
                              ? null
                              : toggleStatusModal
                          }
                          imageIcon={true}
                          noIcon={
                            detailsReport?.status == "closed" ? true : false
                          }
                          size={16}
                          selectDropStyle={{
                            color:
                              status == "active"
                                ? constThemeColor?.onSurface
                                : constThemeColor.error,
                            textTransform: "capitalize",
                            paddingHorizontal: 12,
                          }}
                          touchStyle={[
                            reduxColors.popUpStyle,
                            {
                              backgroundColor: backgroundSideColor(
                                status ? status : "active",
                                constThemeColor
                              ),
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <Divider />
                  </>
                ) : null}

                <View>
                  <Text style={[reduxColors.suggestionTitle]}>Duration</Text>
                  <View style={[reduxColors.commonSelectStyle]}>
                    <TextInput
                      accessible={true}
                      accessibilityLabel={"inputDuration"}
                      AccessibilityId={"inputDuration"}
                      autoCompleteType="off"
                      style={[reduxColors.durationInput]}
                      defaultValue={durationNo}
                      onChangeText={(e) => handleDurationInptSelect(e)}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                    {/* <Dropdown
                            style={reduxColors.dropdown}
                            showsVerticalScrollIndicator={false}
                            itemTextStyle={{
                              fontSize: FontSize.Antz_Body_Title.fontSize,
                            }}
                            placeholderStyle={reduxColors?.fontStyle}
                            selectedTextStyle={reduxColors?.fontStyle}
                            data={durationData}
                            labelField="label"
                            valueField="value"
                            placeholder="Choose Duration Type"
                            value={durationType}
                            onChange={(item) => {
                              handleDurationSelect(item?.value);
                            }}
                            renderRightIcon={() => (
                              <AntDesign
                                name="caretdown"
                                size={widthPercentageToDP(3)}
                                color={constThemeColor.onSurface}
                              />
                            )}
                          /> */}
                    <ModalTitleData
                      selectDrop={durationType}
                      toggleModal={toggleDateModal}
                      dropDownIcon={true}
                      size={16}
                      selectDropStyle={{
                        color: constThemeColor.onPrimaryContainer,
                        paddingHorizontal: 12,
                      }}
                      touchStyle={[
                        reduxColors.popUpStyle,
                        {
                          backgroundColor: constThemeColor.surface,
                          borderWidth: 1,
                          borderColor: constThemeColor.outline,
                          height: 56,
                        },
                      ]}
                    />
                  </View>
                </View>

                <>
                  {status == "active" && !detailsReport?.active_at ? (
                    <View style={reduxColors.itemRow}>
                      <TextInput
                        accessible={true}
                        accessibilityLabel={"diagnosisModalNotes"}
                        AccessibilityId={"diagnosisModalNotes"}
                        mode="outlined"
                        autoCompleteType="off"
                        style={reduxColors.notesInput}
                        defaultValue={detailsReport?.notes}
                        placeholder="Notes..."
                        onChangeText={(e) => handleNotesInptSelect(e)}
                      />
                    </View>
                  ) : (
                    <View style={{ marginVertical: Spacing.body }}>
                      <View
                        style={[reduxColors.itemRow, { marginVertical: 0 }]}
                      >
                        <TextInput
                          accessible={true}
                          accessibilityLabel={"diagnosisModalCloseNotes"}
                          AccessibilityId={"diagnosisModalCloseNotes"}
                          mode="outlined"
                          autoCompleteType="off"
                          style={reduxColors.notesInput}
                          defaultValue={notesStop}
                          placeholder="Add Comments"
                          onChangeText={(e) => {
                            handleClosedNotesInptSelect(e);
                            if (e.length > 0) {
                              setIsError(false);
                            }
                          }}
                        />
                      </View>

                      {isError && (
                        <View style={{ textAlign: "left", width: "100%" }}>
                          <Text style={{ color: constThemeColor?.error }}>
                            This field is required
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    maxHeight: 300,
                  }}
                >
                  {detailsReport?.comment_list?.map((value, index) => {
                    return (
                      <View style={{ marginBottom: Spacing.body }}>
                        <View
                          style={{
                            backgroundColor: constThemeColor?.background,
                            padding: Spacing.body,
                            marginTop: Spacing.micro,
                            borderRadius: 8,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text>
                              Status :{" "}
                              <Text
                                style={{
                                  color:
                                    value?.status == "closed"
                                      ? constThemeColor?.error
                                      : constThemeColor?.onSurface,
                                  textTransform: "capitalize",
                                }}
                              >
                                {value?.status}
                              </Text>
                            </Text>
                            <Text style={{ fontSize: FontSize.Antz_Small }}>
                              {moment(value?.created_at).format(
                                "DD MMM yyyy, hh:mm A"
                              )}
                            </Text>
                          </View>
                          <Text
                            style={{
                              paddingTop: Spacing.mini,
                              color: constThemeColor?.onSurfaceVariant,
                            }}
                          >
                            {value?.note}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                  {/* comment_list
              {detailsReport?.status == "closed" ? (
                <View style={{ marginBottom: Spacing.body }}>
                  <View
                    style={{
                      backgroundColor: constThemeColor?.background,
                      padding: Spacing.body,
                      marginTop: Spacing.micro,
                      borderRadius: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text>
                        Status :{" "}
                        <Text style={{ color: constThemeColor?.error }}>
                          Closed
                        </Text>
                      </Text>
                      <Text style={{ fontSize: FontSize.Antz_Small }}>
                        {moment(status == "closed" ?? currentDate).format(
                          "DD MMM yyyy, hh:mm A"
                        )}
                      </Text>
                    </View>
                    <Text
                      style={{
                        paddingTop: Spacing.mini,
                        color: constThemeColor?.onSurfaceVariant,
                      }}
                    >
                      {detailsReport?.stop_note}
                    </Text>
                  </View>
                </View>
              ) : null} */}
                  {detailsReport?.active_at ? (
                    <View style={{ marginBottom: Spacing.body }}>
                      <View
                        style={{
                          backgroundColor: constThemeColor?.background,
                          padding: Spacing.body,
                          marginTop: Spacing.micro,
                          borderRadius: 8,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text>
                            Status :{" "}
                            <Text style={{ color: constThemeColor?.onSurface }}>
                              Active
                            </Text>
                          </Text>
                          <Text style={{ fontSize: FontSize.Antz_Small }}>
                            {moment(detailsReport?.active_at).format(
                              "DD MMM yyyy, hh:mm A"
                            )}
                          </Text>
                        </View>
                        <Text
                          style={{
                            paddingTop: Spacing.mini,
                            color: constThemeColor?.onSurfaceVariant,
                          }}
                        >
                          {detailsReport?.notes}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </ScrollView>
              </View>
            </View>
            {/* <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "flex-end",
                // position: "absolute",
                // bottom: heightPercentageToDP(0),
                backgroundColor: constThemeColor.addBackground,
              }}
            >
              <TouchableOpacity
                style={[reduxColors.modalBtnCover]}
                onPress={() => handleDetailsSubmit(selectCommonModalName)}
                accessible={true}
                accessibilityLabel={"complaintsModalDone"}
                AccessibilityId={"complaintsModalDone"}
              >
                <Text style={reduxColors.bottomBtnTxt}>Done</Text>
              </TouchableOpacity>
            </View> */}
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "flex-end",

                // position: "absolute",
                // bottom: heightPercentageToDP(0),
                backgroundColor: constThemeColor.addBackground,
                // paddingVertical: Spacing.small,
              }}
            >
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={"diagnosisModalDone"}
                AccessibilityId={"diagnosisModalDone"}
                style={[reduxColors.modalBtnCover]}
                onPress={() => {
                  if (
                    detailsReport?.active_at &&
                    detailsReport?.status !== "closed" &&
                    status == "closed"
                  ) {
                    if (notesStop) {
                      updateComplaints(
                        selectCommonModalId,
                        "closed",
                        selectCommonModalName
                      );
                      setIsError(false);
                    } else {
                      setIsError(true);
                    }
                  } else {
                    if (detailsReport?.status == "closed") {
                      if (notesStop) {
                        updateComplaints(
                          selectCommonModalId,
                          "active",
                          selectCommonModalName
                        );
                        setIsError(false);
                      } else {
                        setIsError(true);
                      }
                    } else {
                      handleDetailsSubmit(selectCommonModalName);
                    }
                  }
                }}
              >
                <Text style={reduxColors.bottomBtnTxt}>
                  {detailsReport?.status == "closed" ? "Re-Activate" : "Done"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {medicalPrirotyModal ? (
          <ModalFilterComponent
            onPress={togglePrintModal}
            onDismiss={closePrintModal}
            onBackdropPress={closePrintModal}
            onRequestClose={closePrintModal}
            data={PrirotyData}
            closeModal={closeMenu}
            style={{ alignItems: "flex-start" }}
            isSelectedId={isSelectedId}
            radioButton={false}
            checkIcon={true}
            maincolorsCheck={backgroundSideColor(
              detailsReport?.severity ? detailsReport?.severity : "Mild",
              constThemeColor
            )}
            Textcolor={constThemeColor.onPrimary}
          />
        ) : null}
        {medicalDateModal ? (
          <ModalFilterComponent
            onPress={toggleDateModal}
            onDismiss={closeDateModal}
            onBackdropPress={closeDateModal}
            onRequestClose={closeDateModal}
            data={durationData}
            closeModal={closeMenuDate}
            style={{ alignItems: "flex-start" }}
            isSelectedId={isSelectedIdDay}
            radioButton={false}
            checkIcon={true}
          />
        ) : null}

        {medicalStatusModal ? (
          <ModalFilterComponent
            onPress={toggleStatusModal}
            onDismiss={closeStatusModal}
            onBackdropPress={closeStatusModal}
            onRequestClose={closeStatusModal}
            data={StatusData}
            closeModal={closeMenuStatus}
            style={{ alignItems: "flex-start" }}
            isSelectedId={isSelectedIdStatus}
            radioButton={false}
            checkIcon={true}
            maincolorsCheck={backgroundSideColor(
              detailsReport?.status ? detailsReport?.status : "active",
              constThemeColor
            )}
            Textcolor={
              detailsReport?.status == "active"
                ? constThemeColor?.onSurface
                : constThemeColor.error
            }
          />
        ) : null}
      </Modal>
    </>
  );
};

export default MedicalComplaintsModal;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
      width: "100%",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 60),
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      minHeight: Platform.OS === "ios" ? 380 : 400,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: Spacing.minor,
      borderTopRightRadius: Spacing.minor,
    },
    modalHeader: {
      width: "100%",
      flexDirection: "row",
      // borderTopWidth: StyleSheet.hairlineWidth,
      // borderColor: reduxColors.lightGrey,
      justifyContent: "space-between",
      alignItems: "center",
      padding: Spacing.minor,
    },
    closeBtn: {
      alignItems: "center",
      justifyContent: "center",
    },

    modalBody: {
      flex: 1,
      width: "100%",
      paddingHorizontal: Spacing.minor,
    },
    severity: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    popUpStyle: {
      padding: Spacing.minor,
      borderRadius: Spacing.mini,
    },
    suggestionTitle: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      color: reduxColors.onSurfaceVariant,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      marginVertical: Spacing.mini,
    },
    commonSelectStyle: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: Spacing.mini,
    },
    durationInput: {
      // width: "65%",
      flex: 1,
      height: 56,
      paddingLeft: Spacing.body,
      paddingRight: Spacing.small,
      paddingVertical: Spacing.mini,
      marginRight: Spacing.body,
      borderRadius: Spacing.mini,
      backgroundColor: reduxColors.surface,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      borderWidth: 1,
      borderColor: reduxColors.outline,
    },
    modalBtnCover: {
      marginTop: Spacing.major,
      marginBottom: Spacing.major,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: Spacing.small,
      width: 100,
      height: 40,
      backgroundColor: reduxColors.primary,
    },
    bottomBtnTxt: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimary,
    },
    notesInput: {
      width: "100%",
      height: 50,
      padding: Spacing.small,
      alignItems: "center",
      justifyContent: "center",
      color: reduxColors.onErrorContainer,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      borderRadius: Spacing.mini,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
      paddingVertical: Spacing.small,
    },
    itemRow: {
      flexDirection: "row",
      marginVertical: Spacing.minor,
      padding: Spacing.micro,
      alignItems: "center",
    },
  });
