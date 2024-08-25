import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";

const ComplaintsCard = ({
  data,
  selectedColor,
  handleSelectCommon,
  toggleCommNameDropdown,
  selectCommonModalName,
  handleToggleCommDropdown,
  severityColor,
  severity,
  durationNo,
  duration,
  handleSeveritySelect,
  handleDurationSelect,
  handleDurationInptSelect,
  handleDetailsSubmit,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  return (
    <>
      <Text style={[styles.searchSuggestionTitle, { marginTop: 10 }]}>
        Most Used
      </Text>
      <View style={styles.commBtnContainer}>
        {data.map((item, index) => {
          return (
            <View key={index}>
              <TouchableOpacity
                style={
                  selectedColor(item.name)
                    ? styles.activeSearchSgBtnCover
                    : styles.searchSuggestionbtnCover
                }
                onPress={() => handleSelectCommon(item)}
              >
                <Text style={styles.caseTypeBtnTxt}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      {toggleCommNameDropdown ? (
        <Modal
          avoidKeyboard
          animationType="none"
          transparent={true}
          visible={true}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: "transparent" }]}
          >
            <View style={[styles.modalOverlay]}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <View>
                      <Text
                        style={{
                          fontSize: FontSize.Antz_Minor,
                          color: constThemeColor.onPrimaryContainer,
                          // fontWeight: "600",
                          lineHeight: 19,
                        }}
                      >
                        {selectCommonModalName}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.closeBtn}
                      onPress={handleToggleCommDropdown}
                    >
                      <Ionicons
                        name="close"
                        size={22}
                        color={constThemeColor.onSurface}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <View style={styles.modalItem}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Ionicons
                          name="sad-outline"
                          size={20}
                          color={severityColor(severity)}
                        />
                        <Text style={[styles.searchSuggestionTitle]}>
                          Severity
                        </Text>
                      </View>

                      <View style={styles.itemRow}>
                        <TouchableOpacity
                          style={[
                            severity === "Mild"
                              ? styles.actvModalCommonBtnCover
                              : styles.modalCommonBtnCover,
                            {
                              backgroundColor:
                                constThemeColor.secondaryContainer,
                            },
                          ]}
                          onPress={() => handleSeveritySelect("Mild")}
                        >
                          {severity === "Mild" ? (
                            <TouchableOpacity style={{ marginRight: wp(1) }}>
                              <Feather
                                name="check"
                                size={17}
                                color={constThemeColor.neutralPrimary}
                              />
                            </TouchableOpacity>
                          ) : null}

                          <Text style={styles.caseTypeBtnTxt}>Mild</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            severity === "Moderate"
                              ? styles.actvModalCommonBtnCover
                              : styles.modalCommonBtnCover,
                            {
                              backgroundColor: constThemeColor?.moderatePrimary,
                            },
                          ]}
                          onPress={() => handleSeveritySelect("Moderate")}
                        >
                          {severity === "Moderate" ? (
                            <TouchableOpacity style={{ marginRight: wp(1) }}>
                              <Feather
                                name="check"
                                size={17}
                                color={constThemeColor.neutralPrimary}
                              />
                            </TouchableOpacity>
                          ) : null}

                          <Text style={styles.caseTypeBtnTxt}>Moderate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            severity === "High"
                              ? styles.actvModalCommonBtnCover
                              : styles.modalCommonBtnCover,
                            {
                              backgroundColor:
                                constThemeColor.tertiaryContainer,
                            },
                          ]}
                          onPress={() => handleSeveritySelect("High")}
                        >
                          {severity === "High" ? (
                            <TouchableOpacity style={{ marginRight: wp(1) }}>
                              <Feather
                                name="check"
                                size={17}
                                color={constThemeColor.neutralPrimary}
                              />
                            </TouchableOpacity>
                          ) : null}

                          <Text style={styles.caseTypeBtnTxt}>High</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            severity === "Extreme"
                              ? styles.actvModalCommonBtnCover
                              : styles.modalCommonBtnCover,
                            { backgroundColor: constThemeColor.tertiary },
                          ]}
                          onPress={() => handleSeveritySelect("Extreme")}
                        >
                          {severity === "Extreme" ? (
                            <TouchableOpacity style={{ marginRight: wp(1) }}>
                              <Feather
                                name="check"
                                size={17}
                                color={constThemeColor.onPrimary}
                              />
                            </TouchableOpacity>
                          ) : null}

                          <Text
                            style={[
                              styles.caseTypeBtnTxt,
                              { color: constThemeColor.onPrimary },
                            ]}
                          >
                            Extreme
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.modalItem}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          top: hp(1.2),
                        }}
                      >
                        <FontAwesome5
                          name="stopwatch"
                          size={20}
                          color={constThemeColor.onSurfaceVariant}
                        />
                        <Text style={[styles.searchSuggestionTitle]}>
                          Duration
                        </Text>
                      </View>

                      <View style={styles.itemRow}>
                        <TextInput
                          autoCompleteType="off"
                          style={styles.durationInput}
                          placeholder="0"
                          defaultValue={durationNo}
                          onChangeText={(e) => handleDurationInptSelect(e)}
                          keyboardType="numeric"
                        />
                        <TouchableOpacity
                          style={[
                            duration === `${durationNo} Days`
                              ? styles.actvModalDurationBtnCover
                              : styles.modalDurationBtnCover,
                            {
                              borderTopLeftRadius: 5,
                              borderBottomLeftRadius: 5,
                            },
                          ]}
                          onPress={() =>
                            handleDurationSelect(`${durationNo} Days`)
                          }
                        >
                          <Text style={styles.caseTypeBtnTxt}>Days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={
                            duration === `${durationNo} Weeks`
                              ? styles.actvModalDurationBtnCover
                              : styles.modalDurationBtnCover
                          }
                          onPress={() =>
                            handleDurationSelect(`${durationNo} Weeks`)
                          }
                        >
                          <Text style={styles.caseTypeBtnTxt}>Weeks</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={
                            duration === `${durationNo} Months`
                              ? styles.actvModalDurationBtnCover
                              : styles.modalDurationBtnCover
                          }
                          onPress={() =>
                            handleDurationSelect(`${durationNo} Months`)
                          }
                        >
                          <Text style={styles.caseTypeBtnTxt}>Months</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            duration == `${durationNo} Years`
                              ? styles.actvModalDurationBtnCover
                              : styles.modalDurationBtnCover,
                            {
                              borderRightWidth: 1,
                              borderTopRightRadius: 5,
                              borderBottomRightRadius: 5,
                            },
                          ]}
                          onPress={() =>
                            handleDurationSelect(`${durationNo} Years`)
                          }
                        >
                          <Text style={styles.caseTypeBtnTxt}>Years</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  width: "96%",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  position: "absolute",
                  bottom: hp(0),
                  backgroundColor: constThemeColor.addBackground,
                  // height : "25%",
                }}
              >
                <TouchableOpacity
                  style={[styles.modalBtnCover]}
                  onPress={() => handleDetailsSubmit(selectCommonModalName)}
                >
                  <Text style={styles.bottomBtnTxt}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      ) : null}
    </>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    commBtnContainer: { flexDirection: "row", flex: 1, flexWrap: "wrap" },
    activeSearchSgBtnCover: {
      width: "auto",
      paddingHorizontal: 15,
      height: hp(4.5),
      margin: 6,
      // paddingVertical: 2,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    searchSuggestionbtnCover: {
      width: "auto",
      height: hp(4.5),
      margin: 6,
      paddingHorizontal: 15,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: reduxColors.lightGrey,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
    caseTypeBtnTxt: {
      fontSize: FontSize.Antz_Standerd,
      color: reduxColors.onSurfaceVariant,
      lineHeight: 17,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
    },
    container: {
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.2)",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      height: hp(45),
      width: wp(96),
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalHeader: {
      height: 50,
      width: "90%",
      flexDirection: "row",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: reduxColors?.lightGrey,
      justifyContent: "space-between",
      alignItems: "center",
    },
    closeBtn: {
      width: "10%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    modalItem: {
      height: hp(10),
    },
    searchSuggestionTitle: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Minor,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      lineHeight: 17,
      marginLeft: 3,
      top: hp(0.2),
    },
    itemRow: {
      flexDirection: "row",
      marginTop: 10,
      alignItems: "center",
    },
    actvModalCommonBtnCover: {
      width: "auto",
      height: 32,
      marginRight: 8,
      paddingVertical: 2,
      paddingHorizontal: 10,
      // marginTop: 10,
      borderRadius: 8,
      borderWidth: 1.2,
      borderColor: reduxColors.neutralPrimary,
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
    },
    modalCommonBtnCover: {
      width: "auto",
      height: 32,
      marginRight: 8,
      paddingVertical: 2,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
    caseTypeBtnTxt: {
      fontSize: FontSize.Antz_Standerd,
      color: reduxColors.onSurfaceVariant,
      lineHeight: 17,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
    },
    durationInput: {
      width: "18%",
      height: 38,
      padding: 10,
      marginRight: 10,
      backgroundColor: reduxColors.surface,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor,
      lineHeight: 17,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
    actvModalDurationBtnCover: {
      width: "auto",
      height: 38,
      marginVertical: 6,
      paddingVertical: 2,
      paddingHorizontal: 12,
      // marginTop: 10,
      borderWidth: 1,
      borderRightWidth: 0,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    modalDurationBtnCover: {
      width: "auto",
      height: 38,
      marginVertical: 6,
      paddingVertical: 2,
      paddingHorizontal: 12,
      // marginTop: 10,
      borderWidth: 1,
      borderRightWidth: 0,
      borderColor: reduxColors.outline,
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
    bottomBtnTxt: {
      fontSize: FontSize.Antz_Minor,
      color: reduxColors.onPrimary,
    },
    modalBtnCover: {
      margin: 18,
      paddingVertical: 2,
      paddingHorizontal: 20,
      // marginBottom: 0,
      borderRadius: 3,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      width: wp(25),
      height: hp(4.5),
      backgroundColor: reduxColors.primary,
    },
  });

export default ComplaintsCard;
