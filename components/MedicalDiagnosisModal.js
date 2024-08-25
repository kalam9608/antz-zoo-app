import {
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "../configs/Spacing";
import { SvgXml } from "react-native-svg";
import { Divider, Switch } from "react-native-paper";
import ModalFilterComponent, { ModalTitleData } from "./ModalFilterComponent";
import { opacityColor } from "../utils/Utils";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";

const MedicalDiagnosisModal = ({
  selectCommonModalName,
  handleToggleCommDropdown,
  chronic,
  detailsReport,
  onToggleSwitch,
  togglePrintModal,
  backgroundSideColor,
  handleNotesInptSelect,
  handleDetailsSubmit,
  medicalPrirotyModal,
  closePrintModal,
  PrirotyData,
  closeMenu,
  isSwitchOn,
  isSelectedId,
  StatusData,
  medicalStatusModal,
  toggleStatusModal,
  closeMenuStatus,
  closeStatusModal,
  isSelectedIdStatus,
  handleClosedNotesInptSelect,
  updateDiagnosis,
  selectCommonModalId,
  currentDate,
  notesStop,
  status,
  setToogleCommNameDropdown,
  toggleCommNameDropdown,
}) => {
  const [isError, setIsError] = useState(false);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <Modal avoidKeyboard animationType="none" transparent={true} visible={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 11}
        style={[reduxColors.container, { backgroundColor: "transparent" }]}
      >
        <View style={[reduxColors.modalOverlay]}>
          <View style={reduxColors.modalContainer}>
            <View style={reduxColors.modalHeader}>
              <View>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: constThemeColor.onPrimaryContainer,
                  }}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  {selectCommonModalName}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                style={reduxColors.closeBtn}
                onPress={handleToggleCommDropdown}
                accessible={true}
                accessibilityLabel={"diagnosisModalClose"}
                AccessibilityId={"diagnosisModalClose"}
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <SvgXml
                    xml={chronic}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                  <Text style={reduxColors.chronicStyle}>
                    Mark it as Chronic
                  </Text>
                </View>
                <View>
                  {status == "closed" ? null : (
                    <Switch
                      value={
                        detailsReport?.chronic
                          ? detailsReport?.chronic
                          : isSwitchOn
                      }
                      onValueChange={(e) => onToggleSwitch(e)}
                    />
                  )}
                </View>
              </View>
              <Divider />
              <View
                style={{
                  paddingVertical: Spacing.minor,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={reduxColors.severity}>Severity</Text>
                <View>
                  <ModalTitleData
                    selectDrop={
                      detailsReport?.severity ? detailsReport?.severity : "Mild"
                    }
                    disabled={detailsReport?.status == "closed" ? true : false}
                    toggleModal={
                      detailsReport?.status == "closed"
                        ? null
                        : togglePrintModal
                    }
                    imageIcon={true}
                    noIcon={detailsReport?.status == "closed" ? true : false}
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
              {/* {detailsReport?.status=="closed" ? null : ( */}
              <>
                {status == "active" ? (
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
                    <View style={[reduxColors.itemRow, { marginVertical: 0 }]}>
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
              {/* )} */}

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  maxHeight: 200,
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
                    updateDiagnosis(
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
                      updateDiagnosis(
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
  );
};

export default MedicalDiagnosisModal;

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
      backgroundColor: reduxColors.onPrimary,
      minHeight: Platform.OS === "ios" ? 280 : 300,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: Spacing.minor,
      borderTopRightRadius: Spacing.minor,
    },
    modalHeader: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: Spacing.minor,
    },
    closeBtn: {
      alignItems: "center",
      justifyContent: "center",
    },
    modalBody: {
      // flex: 1,
      width: "100%",
      paddingHorizontal: Spacing.minor,
    },
    chronicStyle: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginLeft: Spacing.small,
    },
    severity: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    popUpStyle: {
      padding: Spacing.minor,
      borderRadius: Spacing.small,
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
    itemRow: {
      flexDirection: "row",
      marginVertical: Spacing.minor,
      padding: Spacing.micro,
      alignItems: "center",
    },
  });
