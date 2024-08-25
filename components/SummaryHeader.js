import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import React, { useState } from "react";
import { Appbar, Menu } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, Octicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Spacing from "../configs/Spacing";
import { setApprover } from "../redux/AnimalMovementSlice";
import { useToast } from "../configs/ToastConfig";
import DialougeModal from "./DialougeModal";
import Config from "../configs/Config";
import { widthPercentageToDP } from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";

const SummaryHeader = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const { showToast } = useToast();
  const [moreOptionData] = useState(
    props.optionData ?? [
      {
        id: 1,
        option: <Text>Delete Note</Text>,
      },
    ]
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);

  const optionPress = (item) => {
    if (UserId === props?.created_by_id) {
      alertModalOpen();
      dispatch(setApprover([]));
    } else {
      showToast("warning", "You are not admin for this observation");
    }
    setMenuVisible(false);
  };
  const firstButtonPress = () => {
    props?.DeleteObservationData();
    alertModalClose();
  };
  const secondButtonPress = () => {
    alertModalClose();
  };
  const optionPressMedical = () => {
    props?.deleteMedicalFun();
    setMenuVisible(false);
  };
  return (
    <>
      <Appbar.Header
        style={[
          {
            backgroundColor:
              props.page === "medical"
                ? constThemeColor.onPrimary
                : constThemeColor.background,
          },
          props.style,
        ]}
      >
        {/* <Appbar.BackAction
        color={constThemeColor.onSecondaryContainer}
        onPress={props.onPressBack}
      /> */}
        <TouchableOpacity
          onPress={props.onPressBack}
          size={40}
          style={{
            // marginHorizontal: Spacing.minor + Spacing.mini,
            // paddingLeft: Spacing.body-2,
            borderRadius: 100,
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={
              props.backPressButton == true
                ? constThemeColor.onPrimary
                : constThemeColor.onSecondaryContainer
            }
            style={{
              paddingLeft: Spacing.body,
              paddingVertical: Spacing.small,
            }}
          />
        </TouchableOpacity>
        {props?.title ? (
          <Appbar.Content
            title={props?.title}
            titleStyle={[
              {
                color:
                  props.backPressButton == true
                    ? constThemeColor.onPrimary
                    : constThemeColor.onSecondaryContainers,
              },
              FontSize.Antz_Medium_Medium,
            ]}
            style={props.styleText}
          />
        ) : (
          <Appbar.Content />
        )}

        {props?.edit ? (
          <TouchableOpacity
            onPress={props.onPressEdit}
            style={{
              width: 35,
              height: 35,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Appbar.Action
              icon={() => (
                <Octicons
                  name="pencil"
                  size={20}
                  disabled={props.deleted}
                  color={
                    props.backPressButton == true
                      ? constThemeColor.onPrimary
                      : constThemeColor.onSecondaryContainer
                  }
                />
              )}
            />
          </TouchableOpacity>
        ) : props.duplicate ? (
          <TouchableOpacity
            onPress={props.duplicatePress}
            style={{ paddingRight: Spacing.minor+4 }}
          >
            <Image
              source={require("../assets/duplicate.png")}
              resizeMode={"contain"}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>
        ) : null}
        {props.editAssessmentTemplate ? (
          <TouchableOpacity
            onPress={props.editAssessment}
            style={{
              width: 35,
              height: 35,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 4,
            }}
          >
            <Appbar.Action
              icon={() => (
                <Octicons
                  name="pencil"
                  size={20}
                  color={
                    props.backPressButton == true
                      ? constThemeColor.onPrimary
                      : constThemeColor.onSecondaryContainer
                  }
                />
              )}
            />
          </TouchableOpacity>
        ) : null}
        {props.hideMenu ? null : (
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Appbar.Action
                icon="dots-vertical"
                color={
                  props.backPressButton == true
                    ? constThemeColor.onPrimary
                    : constThemeColor.onSecondaryContainer
                }
                size={28}
                onPress={openMenu}
              />
            }
          >
            {props?.delete &&
              moreOptionData.map((item, index) => {
                return (
                  <Menu.Item
                    onPress={() => {
                      setMenuVisible(false);
                      optionPress(item);
                    }}
                    titleStyle={{ textAlign: "center" }}
                    title={item.option}
                    key={index}
                  />
                );
              })}
            {props?.deleteMedical &&
              moreOptionData?.map((item, index) => {
                return (
                  <Menu.Item
                    onPress={() => {
                      setMenuVisible(false);
                      optionPressMedical(item);
                    }}
                    titleStyle={{ textAlign: "center" }}
                    title={item.option}
                    key={index}
                  />
                );
              })}
          </Menu>
        )}
      </Appbar.Header>
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Do you want to delete this Note?"}
        closeModal={alertModalClose}
        firstButtonHandle={firstButtonPress}
        secondButtonHandle={secondButtonPress}
        firstButtonText={"Yes"}
        secondButtonText={"No"}
        firstButtonStyle={{
          backgroundColor: constThemeColor.error,
          borderWidth: 0,
        }}
        firstButtonTextStyle={{ color: constThemeColor.onPrimary }}
        secondButtonStyle={{
          backgroundColor: constThemeColor.surfaceVariant,
          borderWidth: 0,
        }}
      />
    </>
  );
};

export default SummaryHeader;
