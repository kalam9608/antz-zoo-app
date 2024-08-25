import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  animalListBySpecies,
  checkOutList,
  getChekoutList,
  updateTransferStatus,
} from "../../services/Animal_movement_service/MoveAnimalService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomBottomSheet from "./CustomBottomSheet";
import Loader from "../Loader";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import ActionBtn from "./ActionBtn";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native-paper";
import { KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import EntryExitStatus from "./EntryExitStatus";
import { useToast } from "../../configs/ToastConfig";
import moment from "moment";
import { setSelectedTransferAnimal } from "../../redux/AnimalTransferSlice";

const AnimalChecklist = (props) => {
  const [allAnimalList, setAllAnimalList] = useState([]);
  const [allAnimalCount, setAllAnimalCount] = useState(0);
  const [selectAnimals, setSelectedAnimals] = useState(
    props?.route?.params?.selectAnimals ?? []
  );
  const [selectedAnimalCount, setSelectedAnimalCount] = useState(
    props?.route?.params?.loadCount ?? 0
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const navigation = useNavigation();
  const [denyReason, setDenyReason] = useState("");
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [checkData, setCheckData] = useState(
    props?.route?.params?.checkData ?? {}
  );
  const dispatch = useDispatch();
  const { showToast, errorToast, successToast, warningToast } = useToast();
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      if (props?.route?.params?.animal_movement_id) {
        if (props?.route?.params?.type == "checkOut") {
          fetchAllAnimalCheckout(
            props?.route?.params?.animal_movement_id,
            "security_check_out"
          );
        } else if (
          props?.route?.params?.type == "checkIn" ||
          props?.route?.params?.type == "RELOADED_ANIMALS"
        ) {
          fetchAllAnimalCheckout(
            props?.route?.params?.animal_movement_id,
            "security_check_in"
          );
        } else if (props?.route?.params?.type == "exitStatus") {
          fetchCheckOutList(props?.route?.params?.animal_movement_id);
        } else {
          fetchAllAnimal(props?.route?.params?.animal_movement_id);
        }
      }
    }, [props?.route?.params?.animal_movement_id])
  );
  const fetchAllAnimal = (id) => {
    setIsLoading(true);
    animalListBySpecies({
      animal_movement_id: id,
    })
      .then((res) => {
        if (res?.success) {
          setAllAnimalList(res.data.result);
          setAllAnimalCount(res.data.total_animal_count);
        } else {
          errorToast("error", "Oops! ,Something went wrong!!");
        }
      })

      .catch((err) => {
        console.log("err", err);
        errorToast("error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchAllAnimalCheckout = (id, type) => {
    setIsLoading(true);
    getChekoutList({
      animal_movement_id: id,
      type: type,
    })
      .then((res) => {
        if (res?.success) {
          setAllAnimalCount(
            res.data.total_animal_count - res?.data?.type_wise_count
          );
          setAllAnimalList(res.data?.result);
          if (props?.route?.params?.type == "RELOADED_ANIMALS") {
            const animalIds = [];
            res?.data?.result.forEach((item) => {
              if (item.animal_details) {
                item.animal_details.forEach((detail) => {
                  if (
                    detail.animal_id &&
                    detail?.assigned_status != "SECURITY_CHECKOUT_DENIED"
                  ) {
                    animalIds.push(detail);
                  }
                });
              }
            });
            setSelectedAnimals(animalIds);
          }
        } else {
          errorToast("error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        errorToast("error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const fetchCheckOutList = (id) => {
    setIsLoading(true);
    checkOutList(id)
      .then((res) => {
        if (res?.success) {
          // setAllAnimalCount(res?.data?.type_wise_count);

          setAllAnimalList(res.data);
        } else {
          errorToast("error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        errorToast("error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const closeAnimalSheet = () => {
    // dispatch(setSelectedTransferAnimal([]));
    navigation.goBack();
  };

  const countAnimals = (arrayOfObjects) => {
    if (arrayOfObjects?.length > 0) {
      let totalCount = 0;
      arrayOfObjects?.forEach((item) => {
        if (item?.type === "single") {
          totalCount += 1;
        } else if (item?.type === "group") {
          totalCount += parseInt(item?.total_animal);
        }
      });
      return totalCount;
    } else {
      return 0;
    }
  };
  const submit = (type, comment) => {
    if (
      selectAnimals?.length > 0 ||
      props?.route?.params?.type == "checkOut" ||
      props?.route?.params?.type == "checkIn"
    ) {
      const obj = {
        movement_id: props?.route?.params?.animal_movement_id,
        animal_ids: JSON.stringify(selectAnimals?.map((p) => p?.animal_id)),
        status: type,
        comments: comment,
      };
      setIsLoading(true);
      updateTransferStatus(obj)
        .then((res) => {
          if (res?.success) {
            successToast(
              "success",
              props.route.params.transfer_type === "external" &&
                props?.route?.params?.type === "checkOut"
                ? "Transfer completed successfully"
                : props?.route?.params?.type == "checkIn"
                ? "Security checkin cleared successfully"
                : props?.route?.params?.type === "checkOut"
                ? "Security checkout cleared successfully"
                : "Animal loaded for transfer"
            );
            if (
              countAnimals(selectAnimals) != parseInt(allAnimalCount) &&
              props?.route?.params?.type != "checkOut" &&
              props?.route?.params?.type != "checkIn"
            ) {
              navigation.navigate("ConfirmRide", {
                animal_movement_id: props?.route?.params?.animal_movement_id,
                moveToBack: navigation.goBack(),
                screen: props?.route.params?.screen,
                trasferStatus: "LOADED_ANIMALS",
                qr_code_full_path: props?.route.params?.qr_code_full_path,
                request_id: props?.route.params?.request_id,
              });
            } else {
              // navigation.goBack();
              navigation.navigate("ApprovalSummary", {
                animal_movement_id: props.route.params?.animal_movement_id,
                site_id: props.route.params?.site_id,
                screen: props?.route?.params?.screen,
                reference: "list",
              });
            }
          } else {
            errorToast("error", "Oops! ,Something went wrong!!");
          }
        })
        .catch((err) => {
          console.log({ err });
          errorToast("error", "Oops! ,Something went wrong!!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      warningToast("Oops!", "Please select animals to continue");
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Loader visible={isLoading} />

      <View style={{ flex: 1 }}>
        {props?.route?.params?.type == "exitStatus" ? (
          <View style={{ width: "100%" }}>
            <EntryExitStatus
              approve={props?.route?.params?.checkInAllowed}
              title={
                props?.route?.params?.checkInAllowed
                  ? "Entry Allowed"
                  : props?.route?.params?.type == "exitStatus"
                  ? "Exit Denied"
                  : "Entry Denied"
              }
              time={moment(
                checkData?.commented_on,
                "YYYY-MM-DD HH:mm:ss"
              ).format("h:mm A")}
              user_name={checkData?.user_details?.full_name}
              profile_pic={checkData?.user_details?.profile_pic}
              subTitle={
                props?.route?.params?.checkData?.user_details
                  ?.source_site_name ?? "NA"
              }
              sourceSite={
                props?.route?.params?.checkData?.user_details?.source_site_name
                  ? true
                  : false
              }
              summary={props?.route?.params?.comment}
              showCancel={true}
              close={() => {
                // dispatch(setSelectedTransferAnimal([]));
                navigation.goBack();
              }}
            />
          </View>
        ) : null}
        <CustomBottomSheet
          data={allAnimalList}
          type="animal"
          title={
            props?.route?.params?.type == "checkList" ||
            props?.route?.params?.type == "RELOADED_ANIMALS"
              ? "Animal Load Checklist"
              : props?.route?.params?.type == "checkOut"
              ? "Checkout Gate"
              : props?.route?.params?.type == "checkIn"
              ? "Checkin Gate"
              : ""
          }
          total={allAnimalCount}
          trasferStatus={props?.route?.params?.trasferStatus}
          showCheckList={
            props?.route?.params?.type == "exitStatus" ? true : false
          }
          closeModal={closeAnimalSheet}
          showSwitch={props?.route?.params?.type == "exitStatus" ? false : true}
          hideHeader={props?.route?.params?.type == "exitStatus"}
          allSelectedIds={(data, totalCount) => {
            setSelectedAnimals(data);
            setSelectedAnimalCount(totalCount);
            setShowCheckout(false);
          }}
          hideCount={true}
          // selectedAnimals={selectAnimals}
          //   navigation={dnavigation}
          selectedAnimalCount={selectedAnimalCount}
          selectedAnimals={
            props?.route?.params?.type == "checkIn" && allAnimalList.length > 0
              ? allAnimalList
                  .map((animalSpecies) =>
                    animalSpecies.animal_details.map((item) => item)
                  )
                  .flat(1)
              : selectAnimals
          }
          isSecurityCheckout={
            props?.route?.params?.type == "checkOut" ? true : false
          }
          isSecurityCheckin={
            props?.route?.params?.type == "checkIn" ? true : false
          }
        />
      </View>
      {props?.route?.params?.type == "exitStatus" ? null : (
        <View
          style={{
            width: "100%",
            backgroundColor: constThemeColor?.background,
            position: "absolute",
            bottom: 0,
            // paddingBottom: Spacing.small,
            alignItems: "center",
          }}
        >
          {props?.route?.params?.type == "checkList" ||
          props?.route?.params?.type == "RELOADED_ANIMALS" ? (
            <>
              <TouchableOpacity
                onPress={() =>
                  submit(
                    props?.route?.params?.type == "RELOADED_ANIMALS"
                      ? "RELOADED_ANIMALS"
                      : "LOADED_ANIMALS",
                    `Loaded ${selectAnimals?.length}/${allAnimalCount}`
                  )
                }
                style={{
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: constThemeColor.onPrimaryContainer,
                  width: "90%",
                  borderRadius: Spacing.body,
                  paddingVertical: Spacing.minor,
                  backgroundColor: constThemeColor.onPrimaryContainer,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: Spacing.small,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: constThemeColor.onPrimary,
                    fontSize: FontSize.Antz_Major_Title_btn.fontSize,
                    fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
                  }}
                >
                  {`Loading Completed - ${countAnimals(
                    selectAnimals
                  )}/${allAnimalCount}`}
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  FontSize.Antz_Body_Medium,
                  {
                    color: constThemeColor?.onSurfaceVariant,
                    width: "80%",
                    textAlign: "center",
                    paddingBottom: Spacing.small,
                  },
                ]}
              >
                Select the animals only when it is loaded into the vehicle.{" "}
              </Text>
            </>
          ) : null}

          {props?.route?.params?.type == "checkOut" ||
          props?.route?.params?.type == "checkIn" ? (
            <>
              {!showCheckout &&
              countAnimals(selectAnimals) == allAnimalCount ? (
                <View style={{ width: "100%", paddingVertical: Spacing.small }}>
                  <ActionBtn
                    onPress={() => setShowCheckout(true)}
                    backgroundColor={constThemeColor?.onPrimaryContainer}
                    title={`Checked ${countAnimals(
                      selectAnimals
                    )}/${allAnimalCount}`}
                  />
                </View>
              ) : null}

              {/* {showCheckout ? ( */}
              {/* <> */}
              {!showCheckout ? null : (
                // <View
                //   style={{
                //     backgroundColor: constThemeColor?.errorContainer,
                //     width: "100%",
                //     paddingVertical: Spacing.small,
                //   }}
                // >
                //   <TouchableOpacity
                //     onPress={() => {
                //       setShowDenyModal(true);
                //     }}
                //     style={{
                //       alignSelf: "center",
                //       borderWidth: 1,
                //       borderColor: constThemeColor.error,
                //       width: "90%",
                //       borderRadius: Spacing.body,
                //       paddingVertical: Spacing.minor,
                //       backgroundColor: constThemeColor.error,
                //       flexDirection: "row",
                //       alignItems: "center",
                //       justifyContent: "center",
                //       marginVertical: Spacing.small,
                //     }}
                //   >
                //     <AntDesign
                //       name={"exclamationcircleo"}
                //       color={constThemeColor.onPrimary}
                //       size={20}
                //       style={{ marginRight: Spacing.body }}
                //     />
                //     <Text
                //       style={{
                //         textAlign: "center",
                //         color: constThemeColor.onPrimary,
                //         fontSize: FontSize.Antz_Major_Title_btn.fontSize,
                //         fontWeight:
                //           FontSize.Antz_Major_Title_btn.fontWeight,
                //       }}
                //     >
                //       {props?.route?.params?.type == "checkIn"
                //         ? "PUT ON HOLD"
                //         : "PUT ON HOLD"}
                //     </Text>
                //   </TouchableOpacity>
                // </View>
                <View
                  style={{
                    backgroundColor: constThemeColor?.onBackground,
                    width: "100%",
                    paddingVertical: Spacing.small,
                  }}
                >
                  <ActionBtn
                    onPress={() =>
                      submit(
                        props?.route?.params?.type == "checkOut"
                          ? "SECURITY_CHECKOUT_ALLOWED"
                          : "SECURITY_CHECKIN_ALLOWED",
                        ""
                      )
                    }
                    backgroundColor={constThemeColor?.primary}
                    title={
                      props?.route?.params?.type == "checkIn"
                        ? "Allow Entry"
                        : "Allow Exit"
                    }
                  />
                </View>
              )}
              {/* </> */}
              {/* ) : null} */}
            </>
          ) : null}
        </View>
      )}

      <Modal
        avoidKeyboard
        animationType="fade"
        visible={showDenyModal}
        style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[reduxColors.container, { backgroundColor: "transparent" }]}
        >
          <TouchableWithoutFeedback onPress={() => setShowDenyModal(false)}>
            <View style={[reduxColors.modalOverlay]}>
              <View style={reduxColors.modalContainer}>
                <View style={reduxColors.modalHeader}>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Minor_Title.fontSize,
                      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                      color: constThemeColor.neutralPrimary,
                    }}
                  >
                    {props?.route?.params?.type == "checkOut"
                      ? "Deny Exit"
                      : "Deny Entry"}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={reduxColors.closeBtn}
                  >
                    <Ionicons
                      name="close"
                      size={22}
                      color={constThemeColor.onSurface}
                      onPress={() => setShowDenyModal(false)}
                    />
                  </TouchableOpacity>
                </View>
                <View style={reduxColors.modalBody}>
                  <TextInput
                    inputLabel={"Reason"}
                    mode="outlined"
                    autoCompleteType="off"
                    placeholder={`Enter reason to ${
                      props?.route?.params?.type == "checkOut"
                        ? "Deny Exit"
                        : "Deny Entry"
                    }`}
                    style={{
                      width: "100%",
                      paddingVertical: Spacing.micro,
                      backgroundColor: constThemeColor.errorContainer,
                      borderWidth: 1,
                      borderColor: constThemeColor?.onErrorContainer,
                      padding: Spacing.small,
                      height: 100,
                      borderRadius: 8,
                      textAlignVertical: "top",
                    }}
                    onChangeText={(text) => {
                      setDenyReason(text);
                    }}
                    placeholderTextColor={constThemeColor?.onErrorContainer}
                  />
                </View>
                <View style={[reduxColors.modalBtnCover]}>
                  <TouchableOpacity
                    disabled={!denyReason}
                    onPress={() => {
                      submit(
                        props?.route?.params?.type == "checkOut"
                          ? "SECURITY_CHECKOUT_DENIED"
                          : "SECURITY_CHECKIN_DENIED",
                        denyReason
                      );
                      setShowDenyModal(false);
                    }}
                    style={{
                      backgroundColor: constThemeColor.error,
                      paddingHorizontal: Spacing.minor,
                      paddingVertical: Spacing.small,
                      borderRadius: Spacing.mini,
                    }}
                  >
                    <Text
                      style={{
                        color: constThemeColor.onPrimary,
                        fontSize: FontSize.Antz_Minor_Title.fontSize,
                        fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                      }}
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default AnimalChecklist;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: Spacing.minor,
      minHeight: 220,
      marginBottom: "30%",
    },
    modalHeader: {
      width: widthPercentageToDP(85),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.body,
    },
    modalBody: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: Spacing.major,
      width: "75%",
    },
    tempUnitButton: {
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
      padding: Spacing.minor,
    },
    modalBtnCover: {
      alignSelf: "flex-end",
      paddingHorizontal: Spacing.minor,
      paddingBottom: Spacing.body,
    },
  });
