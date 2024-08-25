import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
  Modal,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import AnimalCustomCard from "./AnimalCustomCard";
import Spacing from "../configs/Spacing";
import TaxonCustomCard from "./TaxonCustomCard";

const MedicalSearchFooter = ({
  selectCount,
  title,
  onPress,
  animalcard,
  speciesCard,
  selectedItems,
  checked,
  onPressData,
  singular,
  ...props
}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const toggleView = () => {
    Keyboard.dismiss();
    if (selectCount) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSearchModal(!searchModal);
    }
  };
  const closeModal = () => {
    setSearchModal(false);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onExtendedPress = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    } else {
      if (onPress) {
        onPress(true);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[constThemeColor.addBackground, constThemeColor.addBackground]}
        style={{ flex: 1 }}
      >
        <View style={{ flexDirection: "column" }}>
          <View>
            <Modal
              visible={searchModal}
              transparent={true}
              animationType="fade"
            >
              <OverlayBackground onPress={closeModal} />
              <View
                style={[
                  reduxColors.modalContainer,
                  {
                    backgroundColor: animalcard
                      ? constThemeColor.onBackground
                      : constThemeColor?.onPrimary,
                  },
                ]}
              >
                {/* Content for the modal */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ width: "100%" }}
                >
                  {selectedItems?.map((item, index) =>
                    animalcard ? (
                      <View
                        key={index}
                        style={{
                          width: "100%",
                        }}
                      >
                        <AnimalCustomCard
                          item={item}
                          animalIdentifier={
                            !item?.local_identifier_value
                              ? item?.animal_id
                              : item?.local_identifier_name ?? null
                          }
                          localID={item?.local_identifier_value ?? null}
                          icon={item?.default_icon}
                          enclosureName={item?.user_enclosure_name}
                          animalName={
                            item?.common_name
                              ? item?.common_name
                              : item?.scientific_name
                          }
                          sectionName={item?.section_name}
                          show_specie_details={true}
                          show_housing_details={true}
                          chips={item?.sex}
                          noArrow={true}
                          style={[
                            {
                              borderRadius: 0,
                              // marginVertical: 0,
                              borderBottomWidth: 0.2,
                              borderBottomColor: reduxColors.outlineVariant,
                              backgroundColor: constThemeColor.onBackground,
                            },
                          ]}
                          checkbox={true}
                          checked={selectedItems}
                          onPress={() => onPressData(item)}
                        />
                      </View>
                    ) : speciesCard ? (
                      <TaxonCustomCard
                        key={item?.tsn}
                        pictureUri={item?.default_icon ?? ''}
                        title={item?.common_name ?? ''}
                        showCheckBox={true}
                        isSelected={selectedItems?.map(i => i?.tsn)?.includes(item?.tsn)}
                        onPress={() => {
                          onPressData(item);
                        }}
                      />
                    ) : (
                      <View
                        key={index}
                        style={{
                          backgroundColor: constThemeColor.background,
                          width: "100%",
                          marginTop: Spacing.mini,
                          padding: Spacing.minor,
                          borderRadius: Spacing.small,
                          marginBottom: Spacing.mini,
                        }}
                      >
                        <Text
                          style={{
                            width: "100%",
                            fontSize: FontSize.Antz_Minor_Medium.fontSize,
                            fontWeight: FontSize.Antz_Body_Title.fontWeight,
                            color: constThemeColor.onSurfaceVariant,
                          }}
                        >
                          {item.name
                            ? item.name
                            : item.label ?? item.unit_name ?? item.user_name ?? ""}
                        </Text>
                      </View>
                    )
                  )}
                </ScrollView>
              </View>

              <View
                style={[
                  reduxColors.mainbox,
                  {
                    // backgroundColor: animalcard
                    //   ? constThemeColor.background
                    //   : constThemeColor?.onPrimary,
                    backgroundColor: constThemeColor.background,
                  },
                ]}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    width: "70%",
                    // justifyContent: "space-between",
                  }}
                  onPress={() => setSearchModal(false)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={reduxColors.searchHeading}>
                      {selectCount !== 0 ? selectCount : "No"}{" "}
                      {title + (selectCount > 1 && !singular ? "s" : "")}{" "}
                      Selected
                    </Text>
                    {selectCount ? (
                      <Ionicons
                        name={
                          searchModal
                            ? "chevron-up-outline"
                            : "chevron-down-outline"
                        }
                        size={24}
                        color={constThemeColor?.neutralPrimary}
                        style={{ marginLeft: Spacing.small }}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={reduxColors.secondbutton}
                  onPress={onPress}
                >
                  <Text style={[reduxColors.textstyleSecond]}>Add</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>

          {!searchModal ? (
            <View style={[reduxColors.mainboxOutside]}>
              <TouchableOpacity
                onPress={toggleView}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  width: "70%",
                }}
              >
                <Text style={[reduxColors.searchHeading]}>
                  {selectCount !== 0 ? selectCount : "No"}{" "}
                  {title + (selectCount > 1 && !singular ? "s" : "")} Selected
                </Text>
                {selectCount ? (
                  <View>
                    <Ionicons
                      name={
                        searchModal
                          ? "chevron-up-outline"
                          : "chevron-down-outline"
                      }
                      size={24}
                      color={constThemeColor?.neutralPrimary}
                      style={{ marginLeft: Spacing.small }}
                    />
                  </View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity
                style={reduxColors.secondbutton}
                // onPress={onPress}
                onPress={onExtendedPress}
              >
                <Text style={[reduxColors.textstyleSecond]}>Add</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </LinearGradient>
    </View>
  );
};

// Create a new component for the background overlay
const OverlayBackground = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
    />
  );
};

export default MedicalSearchFooter;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainbox: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: Spacing.minor,
      width: "100%",
    },
    mainboxOutside: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: Spacing.minor,
      width: "100%",
    },
    secondbutton: {
      borderRadius: Spacing.small,
      paddingVertical: Spacing.body,
      paddingHorizontal: Spacing.major,
      justifyContent: "center",
      backgroundColor: reduxColors.primary,
      marginLeft: Spacing.body,
    },
    searchHeading: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.on_Surface,
      textAlign: "center",
    },
    textstyleSecond: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      textAlign: "center",
      color: reduxColors.onPrimary,
    },
    modalContainer: {
      width: "100%",
      alignItems: "center",
      borderTopLeftRadius: Spacing.minor,
      borderTopRightRadius: Spacing.minor,
      maxHeight: 450,
      overflow: "scroll",
      padding: Spacing.minor,
    },
  });
