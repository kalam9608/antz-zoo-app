/**
 * you have to pass the data in array form like that
 * arr= {
 * id : id,name : name
 * }
 *
 */

/** This component use for title that show what we select  after click on this modal will open */
// {<ModalTitleData
// selectDrop={selectDrop}
// loading={loading}
// toggleModal={togglePrintModal}

// />}

/** You have to pass all the function  */
//   onPress={togglePrintModal}
//   onDismiss={closePrintModal}
//   onBackdropPress={closePrintModal}
//   onRequestClose={closePrintModal}

/** This props use for pass the data */
//data={FilterMaster}
//maincolorsCheck :-  this props use to change the background if you pass otherwise it take White color
//Textcolor :- this prop passing the text color
import { View, Text, Dimensions, TouchableHighlight } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import { KeyboardAvoidingView } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import BottomSheetModalStyles from "../configs/BottomSheetModalStyles";
import { TouchableWithoutFeedback } from "react-native";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Checkbox, Divider, RadioButton } from "react-native-paper";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { useState } from "react";
import { ActivityIndicator } from "react-native";

import { SvgXml } from "react-native-svg";
import expand_all from "../assets/expand_all.svg";
const ModalFilterComponent = ({
  onDismiss,
  onBackdropPress,
  onRequestClose,
  onPress,
  data,
  style,
  closeModal,
  titleStyle,
  isSelectedId,
  radioButton,
  CheckboxIcon,
  divider,
  checkedData,
  checkIcon,
  maincolorsCheck,
  mainLightColorCheck,
  Textcolor,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const modalStyles =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const navigation = useNavigation();
  function backgroundColor(priroty, constThemeColor) {
    if (priroty == "Mild") {
      return constThemeColor?.secondaryContainer;
    } else if (priroty == "Moderate") {
      return constThemeColor?.notes;
    } else if (priroty == "High") {
      return constThemeColor?.tertiaryContainer;
    } else if (priroty == "Extreme") {
      return constThemeColor?.errorContainer;
    } else if (priroty == "active") {
      return constThemeColor?.onBackground;
    } else if (priroty == "closed") {
      return constThemeColor?.errorContainer;
    } else {
      return constThemeColor?.primaryContainer;
    }
  }
  return (
    <>
      <Modal
        avoidKeyboard
        animationType="fade"
        visible={true}
        onDismiss={onDismiss}
        onBackdropPress={onBackdropPress}
        onRequestClose={onRequestClose}
        style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
      >
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={[reduxColors.modalOverlay]}>
            <View style={[reduxColors.modalContainer, style]}>
              {props.title ? (
                <View style={[reduxColors.modalHeader]}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={[reduxColors.accession, titleStyle]}>
                      {props.title}
                    </Text>
                  </View>
                </View>
              ) : null}

              <View
                style={{
                  width: "100%",
                  maxHeight: heightPercentageToDP(60),
                  paddingVertical: Spacing.small,
                }}
              >
                {divider ? (
                  <Divider style={{ marginHorizontal: Spacing.small }} />
                ) : null}
                <FlatList
                  data={data}
                  renderItem={({ item }) => (
                    <>
                      <TouchableHighlight
                        style={{
                          backgroundColor: isSelectedId(item.id)
                            ? maincolorsCheck
                            : constThemeColor.onPrimary,
                          padding: Spacing.body,
                          flexDirection: "row",
                        }}
                        activeOpacity={0.4}
                        onPress={() => closeModal(item)}
                        underlayColor={backgroundColor(
                          item.name,
                          constThemeColor
                        )}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              width: "90%",
                            }}
                          >
                            {radioButton ? (
                              <RadioButton
                                status={
                                  isSelectedId(item.id)
                                    ? "checked"
                                    : "unchecked"
                                }
                                onPress={() => closeModal(item)}
                              />
                            ) : null}

                            <Text
                              style={[
                                reduxColors.itemTitle,
                                {
                                  paddingHorizontal: Spacing.body,
                                  // marginTop: 6,
                                  color: isSelectedId(item.id)
                                    ? Textcolor
                                    : constThemeColor.onSurfaceVariant,
                                  textTransform: "capitalize",
                                },
                              ]}
                              ellipsizeMode="tail"
                              numberOfLines={3}
                            >
                              {item.name}
                            </Text>
                          </View>
                          {checkIcon ? (
                            <View>
                              {isSelectedId(item.id) ? (
                                <MaterialIcons
                                  name="check"
                                  size={24}
                                  color={
                                    Textcolor
                                      ? Textcolor
                                      : constThemeColor.onSurfaceVariant
                                  }
                                />
                              ) : null}
                            </View>
                          ) : null}
                        </View>
                      </TouchableHighlight>
                    </>
                  )}
                  onEndReachedThreshold={0.4}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default ModalFilterComponent;

export const ModalTitleData = ({
  selectDrop,
  loading,
  toggleModal,
  selectDropStyle,
  customStyle,
  filterIconStyle,
  size,
  touchStyle,
  filterIconcolor,
  isFromInsights,
  disabled,
  nearIcon,
  alignStyle,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <View style={customStyle ?? reduxColors?.mainStyle}>
      <TouchableOpacity
        onPress={toggleModal}
        disabled={disabled}
        style={[
          touchStyle,
          {
            flexDirection: "row",
            justifyContent: alignStyle ? alignStyle : "center",
            alignItems: "center",
            paddingLeft: Spacing.mini,
          },
        ]}
      >
        {nearIcon ? (
          <MaterialIcons
            name="near-me"
            size={20}
            color={constThemeColor.onPrimary}
            style={{ paddingRight: Spacing.body }}
          />
        ) : null}
        {selectDrop ? (
          <Text
            style={[
              reduxColors.dorpText,
              selectDropStyle,
              { textTransform: "capitalize" },
            ]}
          >
            {selectDrop}
          </Text>
        ) : null}
        {props?.noIcon ? null : (
          <View style={[filterIconStyle, {}]}>
            {props.filterIcon ? (
              <>
                {isFromInsights ? (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={size}
                    color={constThemeColor.onPrimaryContainer}
                    style={filterIconcolor}
                  />
                ) : (
                  <MaterialIcons
                    name="filter-list"
                    size={size}
                    color={constThemeColor.onSurface}
                    style={filterIconcolor}
                  />
                )}
              </>
            ) : props.imageIcon ? (
              <SvgXml
                xml={expand_all}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            ) : props.dropDownIcon ? (
              <AntDesign
                name="caretdown"
                // size={widthPercentageToDP(3)}
                size={16}
                color={constThemeColor.onPrimaryContainer}
              />
            ) : (
              <Ionicons
                name="funnel"
                size={20}
                color={constThemeColor.primary}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={constThemeColor.onSurfaceVarient}
        />
      ) : null}
    </View>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    mainStyle: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      // width: widthPercentageToDP("80%"),
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: Spacing.small,
      paddingVertical: 0,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    accession: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      padding: Spacing.major,
      color: reduxColors.onSurfaceVariant,
      paddingVertical: Spacing.minor,
      paddingBottom: Spacing.small,
    },
    itemTitle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    titleTextStyle: {
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      color: reduxColors.onSurfaceVariant,
    },
    dorpText: {
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
      color: reduxColors.onPrimaryContainer,
    },
    flexText: {
      flex: 1,
    },
  });
