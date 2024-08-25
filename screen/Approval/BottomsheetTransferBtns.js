import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import SubmitBtn from "../../components/SubmitBtn";
import ActionBtn from "../../components/Transfer/ActionBtn";
import EntryExitStatus from "../../components/Transfer/EntryExitStatus";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { TextInput } from "react-native-paper";
import moment from "moment";
import { removeMedical } from "../../redux/MedicalSlice";
import { capitalize, timeCalculate } from "../../utils/Utils";
import {
  getChekoutList,
  vehicleArrived,
} from "../../services/Animal_movement_service/MoveAnimalService";
import AnimatedActionBtn from "../../components/Transfer/AnimatedActionBtn";
import ProgressBar from "../../components/Transfer/ProgressBar";
import Colors from "../../configs/Colors";

const BottomsheetTransferBtns = ({
  allButtonStatus,
  status,
  updateTransferActivity,
  animalMovementId,
  approveFunc,
  rejectAndResetFunc,
  requestId,
  approvedCheck,
  seeAllLogs,
  transferLogs,
  recentLog,
  handleSeeAllLogs,
  isCreator,
  approveData,
  tempData,
  loadAnimalData,
  reLoadAnimalData,
  startRideData,
  checkoutDenyData,
  checkoutAllowData,
  checkinAllowData,
  checkinDenyData,
  reachDestinationData,
  approveEntryData,
  reason,
  sourceSite,
  destinationSite,
  transfer_type,
  isModalVisible,
  request_id,
  destinationVehicle,
  allocationComplete,
  trasferComplete,
  screen,
  qr_code_full_path,
  allocateTo,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const navigation = useNavigation();
  const [showTempEntryModal, setShowTempEntryModal] = useState(false);
  const [selectedTempUnit, setSelectedTempUnit] = useState("c");
  const [tempValue, setTempValue] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveReason, setApproveReason] = useState("");
  const dispatch = useDispatch();
  const handleTempEntryModal = (e) => {
    setShowTempEntryModal(!showTempEntryModal);
    if (e) {
      setTempValue(tempData?.temperature_value);
      setSelectedTempUnit(tempData?.temperature_unit);
    }
  };
  const submitTemp = (value, unit) => {
    if (parseInt(value) > 0 && unit) {
      updateTransferActivity({
        status: "CHECKED_TEMPERATURE",
        temperature_value: parseInt(value),
        temperature_unit: unit,
      });
      setShowTempEntryModal(false);
      setSelectedTempUnit("c");
      setTempValue("");
    }
  };
  const reachDestinationFunc = (e) => {
    updateTransferActivity({
      status: "REACHED_DESTINATION",
    });
  };

  const RideStartedFunc = (e) => {
    updateTransferActivity({
      status: "RIDE_STARTED",
    });
  };

  const handleApproveEntry = () => {
    setShowApproveModal(true);
  };

  const ApprovedEntry = (e) => {
    setShowApproveModal(false);
    updateTransferActivity({
      status: "APPROVE_ENTRY",
      comments: approveReason,
    });
  };

  const handleReject = () => {
    setShowRejectModal(false),
      rejectAndResetFunc({
        activity_status: "REJECTED",
        comment: rejectReason,
      });
  };
  const handleReLoad = () => {
    setShowRejectModal(false),
      updateTransferActivity({
        status: "RELOADED_ANIMALS",
      });
  };
  const handleAllowEntry = () => {
    setShowRejectModal(false),
      updateTransferActivity({
        status: "ALLOW_ENTRY",
      });
  };
  const fetchAllAnimalCheckout = () => {
    // setIsLoading(true);
    getChekoutList({
      animal_movement_id: animalMovementId,
      type: "security_check_out",
    })
      .then((res) => {
        if (res?.success) {
          const animalIds = [];
          res?.data?.result.forEach((item) => {
            if (item.animal_details) {
              item.animal_details.forEach((detail) => {
                if (detail.animal_id) {
                  animalIds.push(detail);
                }
              });
            }
          });
          navigation.navigate("AnimalChecklist", {
            type: "checkList",
            animal_movement_id: animalMovementId,
            selectAnimals: animalIds,
            screen: screen,
            transfer_type: transfer_type,
            qr_code_full_path:qr_code_full_path,
            request_id:requestId
          });
        } else {
          errorToast("error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        errorToast("error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        // setIsLoading(false);
      });
  };

  const handleVehicleArrived = () => {
    vehicleArrived({
      animal_movement_id: animalMovementId,
    })
      .then((res) => {
        if (res.success) {
          navigation.navigate("AnimalChecklist", {
            type: "checkIn",
            animal_movement_id: animalMovementId,
            screen: screen,
            transfer_type: transfer_type,
          });
        } else {
          console.log("err", err);
          errorToast("error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        errorToast("error", "Oops! ,Something went wrong!!");
      });
  };
  const [checkinAllowDataLineHeight, setCheckinAllowDataLineHeight] =
    useState(44);
  const [reachDestinationDataLineHeight, setDestinationDataLineHeight] =
    useState(36);
  const [approveEntryDataUiLineHeight, setApproveEntryDataUiLineHeight] =
    useState();
  const [destinationVehicleUiLineHeight, setDestinationVehicleUiLineHeight] =
    useState(56);
  const [checkoutAllowDataUiLineHeight, setCheckoutAllowDataUiLineHeight] =
    useState(56);
  const [startRideDataUiLineHeight, setStartRideDataUiLineHeight] =
    useState(58);
  const [loadAnimalDataUiLineHeight, setLoadAnimalDataUiLineHeight] =
    useState(61);
  const [allocationCompleteLineHeight, setAllocationCompleteLineHeight] =
    useState(45);
  const [transferCompleteLineHeight, setTransferCompleteLineHeight] =
    useState(45);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: isModalVisible ? 1 : null }}
      >
        <View
          style={{
            justifyContent: "center",
            flexDirection: "column",
            paddingTop: Spacing.small,
            maxHeight: 700,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ position: "relative" }}
          >
            {seeAllLogs ? (
              <>
                {/* <View style={{
                  flex: 1,
                  borderLeftWidth: 2,
                  height: 550,
                  zIndex: 99,
                  borderLeftColor: constThemeColor.onPrimaryContainer,
                  opacity: 0.4,
                  marginLeft: screenWidth > 500 ? 113 : 93,
                  position: 'absolute',
                  top: Spacing.major,
                }}>
                </View> */}

                {Object.keys(trasferComplete).length > 0 ? (
                  <View
                    onLayout={(event) => {
                      const { x, y, width, height } = event.nativeEvent.layout;

                      setTransferCompleteLineHeight(height);
                    }}
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      marginVertical: Spacing.small,
                      marginBottom: trasferComplete?.date_changed
                        ? Spacing.major * 2.5
                        : Spacing.small,
                    }}
                  >
                    <View style={{ paddingRight: Spacing.small, width: 70.5 }}>
                      <Text
                        style={{
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                          fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        }}
                      >
                        {moment(
                          trasferComplete?.commented_on,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("h:mm A")}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        zIndex: 100,
                        borderColor: constThemeColor.onPrimaryContainer,
                        borderRadius: 12,
                        height: 24,
                        width: 24,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={constThemeColor.onPrimaryContainer}
                      />
                      <View
                        style={{
                          flex: 1,
                          borderLeftWidth: 1,
                          height: trasferComplete?.date_changed
                            ? transferCompleteLineHeight + Spacing.small
                            : transferCompleteLineHeight + Spacing.small,
                          // height: trasferComplete?.date_changed ? 98 : 45,
                          borderLeftColor: constThemeColor.onPrimaryContainer,
                          position: "absolute",
                          top: 22,
                        }}
                      >
                        {trasferComplete?.date_changed && (
                          <View
                            onLayout={(event) => {
                              const { x, y, width, height } =
                                event.nativeEvent.layout;

                              setTransferCompleteLineHeight(
                                (prev) => prev + height
                              );
                            }}
                            style={{
                              flex: 1,
                              position: "absolute",
                              top: 36,
                              right: -30,
                              padding: 8,
                              borderRadius: 8,
                              backgroundColor:
                                constThemeColor.displaybgSecondary,
                            }}
                          >
                            <Text
                              style={{
                                color: constThemeColor.onSurfaceVariant,
                                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                fontWeight:
                                  FontSize.Antz_Minor_Medium.fontWeight,
                              }}
                            >
                              {moment(
                                trasferComplete?.commented_on,
                                "YYYY-MM-DD HH:mm:ss"
                              ).format("DD MMM YYYY")}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flex: 1,
                        backgroundColor: constThemeColor.onBackground,
                        marginLeft: Spacing.minor,
                        padding: Spacing.body,
                        borderRadius: Spacing.small,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Minor_Regular.fontSize,
                          fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        }}
                      >
                        {trasferComplete?.comments}
                      </Text>
                    </View>
                  </View>
                ) : // <View
                //   style={{
                //     alignSelf: "center",
                //     width: "90%",
                //     borderRadius: Spacing.body,
                //     paddingVertical: Spacing.minor,
                //     paddingHorizontal: Spacing.body,
                //     backgroundColor: constThemeColor.onBackground,
                //     flexDirection: "row",
                //     alignItems: "center",
                //     justifyContent: "space-between",
                //     marginVertical: Spacing.small,
                //   }}
                // >
                //   <Text
                //     style={{
                //       color: constThemeColor.neutralSecondary,
                //       fontSize: FontSize.Antz_Small.fontSize,
                //       fontWeight: FontSize.Antz_Small.fontWeight,
                //     }}
                //   >
                //     {moment(
                //       trasferComplete?.commented_on,
                //       "YYYY-MM-DD HH:mm:ss"
                //     ).format("h:mm A")}
                //   </Text>
                //   <View
                //     style={{
                //       flexDirection: "row",
                //     }}
                //   >
                //     <MaterialIcons
                //       name={"check"}
                //       color={constThemeColor.onSurface}
                //       size={22}
                //       style={{}}
                //     />
                //     <Text
                //       style={{
                //         textAlign: "center",
                //         color: constThemeColor.onSurfaceVariant,
                //         fontSize: FontSize.Antz_Minor_Regular.fontSize,
                //         fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                //         marginLeft: Spacing.minor,
                //       }}
                //     >
                //       {trasferComplete?.comments}
                //     </Text>
                //   </View>

                // </View>
                null}
                {Object.keys(allocationComplete).length > 0 ? (
                  <View
                    onLayout={(event) => {
                      const { x, y, width, height } = event.nativeEvent.layout;

                      setAllocationCompleteLineHeight(height);
                    }}
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      marginVertical: Spacing.small,
                      marginBottom: allocationComplete?.date_changed
                        ? Spacing.major * 2.5
                        : Spacing.small,
                    }}
                  >
                    <View style={{ paddingRight: Spacing.small, width: 70.5 }}>
                      <Text
                        style={{
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                          fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        }}
                      >
                        {moment(
                          allocationComplete?.commented_on,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("h:mm A")}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: constThemeColor.onPrimaryContainer,
                        borderRadius: 12,
                        height: 24,
                        width: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.white,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={constThemeColor.onPrimaryContainer}
                      />
                      {(transfer_type === "inter" ||
                        transfer_type === "intra") && (
                        <View
                          style={{
                            flex: 1,
                            borderLeftWidth: 1,
                            height: allocationComplete?.date_changed
                              ? allocationCompleteLineHeight + Spacing.body
                              : allocationCompleteLineHeight,
                            // height: allocationComplete?.date_changed ? 98 : 45,
                            borderLeftColor: constThemeColor.onPrimaryContainer,
                            position: "absolute",
                            top: 22,
                          }}
                        >
                          {allocationComplete?.date_changed && (
                            <View
                              onLayout={(event) => {
                                const { x, y, width, height } =
                                  event.nativeEvent.layout;

                                setAllocationCompleteLineHeight(
                                  (prev) => prev + height
                                );
                              }}
                              style={{
                                flex: 1,
                                position: "absolute",
                                top: 36,
                                right: -30,
                                padding: 8,
                                borderRadius: 8,
                                backgroundColor:
                                  constThemeColor.displaybgSecondary,
                              }}
                            >
                              <Text
                                style={{
                                  color: constThemeColor.onSurfaceVariant,
                                  fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                  fontWeight:
                                    FontSize.Antz_Minor_Medium.fontWeight,
                                }}
                              >
                                {moment(
                                  allocationComplete?.commented_on,
                                  "YYYY-MM-DD HH:mm:ss"
                                ).format("DD MMM YYYY")}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flex: 1,
                        backgroundColor: constThemeColor.onBackground,
                        marginLeft: Spacing.minor,
                        padding: Spacing.body,
                        borderRadius: Spacing.small,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Minor_Regular.fontSize,
                          fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        }}
                      >
                        {allocationComplete?.comments}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {Object.keys(reachDestinationData).length > 0 ? (
                  <View
                    onLayout={(event) => {
                      const { x, y, width, height } = event.nativeEvent.layout;

                      setDestinationDataLineHeight(height);
                    }}
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",

                      marginVertical: Spacing.small,
                      marginBottom: reachDestinationData?.date_changed
                        ? Spacing.major * 2.5
                        : Spacing.small,
                    }}
                  >
                    <View style={{ paddingRight: Spacing.small, width: 70.5 }}>
                      <Text
                        style={{
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                          fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        }}
                      >
                        {moment(
                          reachDestinationData?.commented_on,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("h:mm A")}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: constThemeColor.onPrimaryContainer,
                        borderRadius: 12,
                        height: 24,
                        width: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.white,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={constThemeColor.onPrimaryContainer}
                      />
                      <View
                        style={{
                          flex: 1,
                          borderLeftWidth: 1,
                          height:
                            reachDestinationDataLineHeight +
                            reachDestinationData?.date_changed
                              ? Spacing.major * 2.5
                              : Spacing.small,
                          // height: reachDestinationData?.date_changed ? 89 : 36,
                          borderLeftColor: constThemeColor.onPrimaryContainer,
                          position: "absolute",
                          top: 22,
                        }}
                      >
                        {reachDestinationData?.date_changed && (
                          <View
                            onLayout={(event) => {
                              const { x, y, width, height } =
                                event.nativeEvent.layout;

                              setDestinationDataLineHeight(
                                (prev) => prev + height
                              );
                            }}
                            style={{
                              flex: 1,
                              position: "absolute",
                              top: 36,
                              right: -30,
                              padding: 8,
                              borderRadius: 8,
                              backgroundColor:
                                constThemeColor.displaybgSecondary,
                            }}
                          >
                            <Text
                              style={{
                                color: constThemeColor.onSurfaceVariant,
                                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                fontWeight:
                                  FontSize.Antz_Minor_Medium.fontWeight,
                              }}
                            >
                              {moment(
                                reachDestinationData?.commented_on,
                                "YYYY-MM-DD HH:mm:ss"
                              ).format("DD MMM YYYY")}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flex: 1,
                        backgroundColor: constThemeColor.onBackground,
                        marginLeft: Spacing.minor,
                        padding: Spacing.body,
                        borderRadius: Spacing.small,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Minor_Regular.fontSize,
                          fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        }}
                      >
                        Received Animals
                      </Text>
                    </View>
                  </View>
                ) : null}
                {Object.keys(checkinAllowData).length > 0 ? (
                  <View
                    onLayout={(event) => {
                      const { x, y, width, height } = event.nativeEvent.layout;

                      setCheckinAllowDataLineHeight(height);
                    }}
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",

                      marginVertical: Spacing.small,
                      marginBottom: checkinAllowData?.date_changed
                        ? Spacing.major * 2.5
                        : Spacing.small,
                    }}
                  >
                    <View style={{ paddingRight: Spacing.small, width: 70.5 }}>
                      <Text
                        style={{
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                          fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        }}
                      >
                        {moment(
                          checkinAllowData?.commented_on,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("h:mm A")}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: constThemeColor.onPrimaryContainer,
                        borderRadius: 12,
                        height: 24,
                        width: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.white,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={constThemeColor.onPrimaryContainer}
                      />
                      <View
                        style={{
                          flex: 1,
                          borderLeftWidth: 1,
                          height: checkinAllowDataLineHeight + Spacing.micro,
                          // height: checkinAllowData?.date_changed ? 99 : 46,
                          borderLeftColor: constThemeColor.onPrimaryContainer,
                          position: "absolute",
                          top: 22,
                        }}
                      >
                        {checkinAllowData?.date_changed && (
                          <View
                            style={{
                              flex: 1,
                              position: "absolute",
                              top: 36,
                              right: -30,
                              padding: 8,
                              borderRadius: 8,
                              backgroundColor:
                                constThemeColor.displaybgSecondary,
                            }}
                          >
                            <Text
                              style={{
                                color: constThemeColor.onSurfaceVariant,
                                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                fontWeight:
                                  FontSize.Antz_Minor_Medium.fontWeight,
                              }}
                            >
                              {moment(
                                checkinAllowData?.commented_on,
                                "YYYY-MM-DD HH:mm:ss"
                              ).format("DD MMM YYYY")}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flex: 1,
                        backgroundColor: constThemeColor.onBackground,
                        marginLeft: Spacing.minor,
                        padding: Spacing.body,
                        borderRadius: Spacing.small,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Minor_Regular.fontSize,
                          fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        }}
                      >
                        {checkinAllowData?.comments}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {Object.keys(approveEntryData).length > 0 ? (
                  <View
                    onLayout={(event) => {
                      const { x, y, width, height } = event.nativeEvent.layout;

                      setApproveEntryDataUiLineHeight(height);
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: Spacing.mini,
                      height: 40,
                    }}
                  >
                    <EntryExitStatus
                      approve={true}
                      title={"Entry Approved"}
                      time={moment(
                        approveEntryData?.commented_on,
                        "YYYY-MM-DD HH:mm:ss"
                      ).format("h:mm A")}
                      user_name={approveEntryData?.user_details?.full_name}
                      subTitle={
                        checkoutDenyData?.user_details?.source_site_name ?? "NA"
                      }
                      summary={
                        approveEntryData?.comments
                          ? approveEntryData?.comments
                          : "Entry Approved"
                      }
                      profile_pic={approveEntryData?.user_details?.profile_pic}
                      sourceSite={
                        approveEntryData?.user_details?.source_site_name
                          ? true
                          : false
                      }
                      onPress={() =>
                        navigation.navigate("AnimalChecklist", {
                          type: "exitStatus",
                          checkInAllowed: true,
                          checkData: approveEntryData,
                          animal_movement_id: animalMovementId,
                          comment: approveEntryData?.comments,
                          screen: screen,
                          transfer_type: transfer_type,
                        })
                      }
                    />
                  </View>
                ) : null}
                {Object.keys(checkinDenyData).length > 0 ? (
                  // &&
                  // Object.keys(approveEntryData).length == 0
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: Spacing.mini,
                    }}
                  >
                    <EntryExitStatus
                      approve={false}
                      title={"Security Checkin - On Hold"}
                      time={moment(
                        checkinDenyData?.commented_on,
                        "YYYY-MM-DD HH:mm:ss"
                      ).format("h:mm A")}
                      user_name={checkinDenyData?.user_details?.full_name}
                      subTitle={
                        checkinDenyData?.user_details?.destination_site_name ??
                        "NA"
                      }
                      summary={checkinDenyData?.comments ?? "Entry Denied"}
                      sourceSite={
                        checkinDenyData?.user_details?.source_site_name
                          ? true
                          : false
                      }
                      profile_pic={checkinDenyData?.user_details?.profile_pic}
                      onPress={() =>
                        navigation.navigate("AnimalChecklist", {
                          type: "exitStatus",
                          checkInAllowed: false,
                          checkData: checkinDenyData,
                          animal_movement_id: animalMovementId,
                          comment: checkinDenyData?.comments,
                          screen: screen,
                          transfer_type: transfer_type,
                        })
                      }
                    />
                  </View>
                ) : null}

                {Object.keys(destinationVehicle).length > 0 ? (
                  <View
                    onLayout={(event) => {
                      const { x, y, width, height } = event.nativeEvent.layout;

                      setDestinationVehicleUiLineHeight(height);
                    }}
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      marginVertical: Spacing.small,
                      marginBottom: destinationVehicle?.date_changed
                        ? Spacing.major * 2.5
                        : Spacing.small,
                    }}
                  >
                    <View style={{ paddingRight: Spacing.small, width: 70.5 }}>
                      <Text
                        style={{
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                          fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        }}
                      >
                        {moment(
                          destinationVehicle?.commented_on,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("h:mm A")}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: constThemeColor.onPrimaryContainer,
                        borderRadius: 12,
                        height: 24,
                        width: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.white,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={constThemeColor.onPrimaryContainer}
                      />
                      <View
                        style={{
                          flex: 1,
                          borderLeftWidth: 1,
                          height:
                            destinationVehicleUiLineHeight + Spacing.small,
                          // height: destinationVehicle?.date_changed ? 109 : 56,
                          borderLeftColor: constThemeColor.onPrimaryContainer,
                          position: "absolute",
                          top: 22,
                        }}
                      >
                        {destinationVehicle?.date_changed && (
                          <View
                            onLayout={(event) => {
                              const { x, y, width, height } =
                                event.nativeEvent.layout;

                              setDestinationVehicleUiLineHeight(
                                (prev) => prev + height
                              );
                            }}
                            style={{
                              flex: 1,
                              position: "absolute",
                              top: 36,
                              right: -30,
                              padding: 8,
                              borderRadius: 8,
                              backgroundColor:
                                constThemeColor.displaybgSecondary,
                            }}
                          >
                            <Text
                              style={{
                                color: constThemeColor.onSurfaceVariant,
                                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                fontWeight:
                                  FontSize.Antz_Minor_Medium.fontWeight,
                              }}
                            >
                              {moment(
                                destinationVehicle?.commented_on,
                                "YYYY-MM-DD HH:mm:ss"
                              ).format("DD MMM YYYY")}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flex: 1,
                        backgroundColor: constThemeColor.onBackground,
                        marginLeft: Spacing.minor,
                        padding: Spacing.body,
                        borderRadius: Spacing.small,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Minor_Regular.fontSize,
                          fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        }}
                      >
                        {destinationVehicle?.comments}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {Object.keys(checkoutAllowData).length > 0 ? (
                  <View
                    onLayout={(event) => {
                      const { x, y, width, height } = event.nativeEvent.layout;

                      setCheckoutAllowDataUiLineHeight(height);
                    }}
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      marginVertical: Spacing.small,
                      marginBottom: checkoutAllowData?.date_changed
                        ? Spacing.major * 2.5
                        : Spacing.small,
                    }}
                  >
                    <View style={{ paddingRight: Spacing.small, width: 70.5 }}>
                      <Text
                        style={{
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                          fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        }}
                      >
                        {moment(
                          checkoutAllowData?.commented_on,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("h:mm A")}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: constThemeColor.onPrimaryContainer,
                        borderRadius: 12,
                        height: 24,
                        width: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.white,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={constThemeColor.onPrimaryContainer}
                      />
                      <View
                        style={{
                          flex: 1,
                          borderLeftWidth: 1,
                          height: checkoutAllowData?.date_changed
                            ? checkoutAllowDataUiLineHeight + Spacing.small
                            : checkoutAllowDataUiLineHeight,
                          // height: checkoutAllowData?.date_changed ? 109 : 56,
                          borderLeftColor: constThemeColor.onPrimaryContainer,
                          position: "absolute",
                          top: 22,
                        }}
                      >
                        {checkoutAllowData?.date_changed && (
                          <View
                            onLayout={(event) => {
                              const { x, y, width, height } =
                                event.nativeEvent.layout;

                              setCheckoutAllowDataUiLineHeight(
                                (prev) => prev + height
                              );
                            }}
                            style={{
                              flex: 1,
                              position: "absolute",
                              top: 36,
                              right: -30,
                              padding: 8,
                              borderRadius: 8,
                              backgroundColor:
                                constThemeColor.displaybgSecondary,
                            }}
                          >
                            <Text
                              style={{
                                color: constThemeColor.onSurfaceVariant,
                                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                fontWeight:
                                  FontSize.Antz_Minor_Medium.fontWeight,
                              }}
                            >
                              {moment(
                                checkoutAllowData?.commented_on,
                                "YYYY-MM-DD HH:mm:ss"
                              ).format("DD MMM YYYY")}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flex: 1,
                        backgroundColor: constThemeColor.onBackground,
                        marginLeft: Spacing.minor,
                        padding: Spacing.body,
                        borderRadius: Spacing.small,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Minor_Regular.fontSize,
                          fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        }}
                      >
                        {checkoutAllowData?.comments}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {/* {Object.keys(reLoadAnimalData).length > 0 ? (
                  <TouchableOpacity
                    style={{
                      alignSelf: "center",
                      width: "90%",
                      borderRadius: Spacing.body,
                      paddingVertical: Spacing.minor,
                      paddingHorizontal: Spacing.body,
                      backgroundColor: constThemeColor.onBackground,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginVertical: Spacing.small,
                    }}
                    onPress={fetchAllAnimalCheckout}
                    disabled={
                      Object.keys(startRideData).length > 0 || !isCreator
                    }
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        // width: "60%",
                      }}
                    >
                      <MaterialIcons
                        name={"check"}
                        color={constThemeColor.onSurface}
                        size={22}
                        style={{}}
                      />
                      <View
                        style={{
                          flexDirection: "column",
                          marginLeft: Spacing.minor,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            color: constThemeColor.onSurfaceVariant,
                            fontSize: FontSize.Antz_Minor_Regular.fontSize,
                            fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                          }}
                        >
                          Animals loaded for transfer
                        </Text>
                        <Text
                          style={{
                            color: constThemeColor.neutralSecondary,
                            fontSize: FontSize.Antz_Small.fontSize,
                            fontWeight: FontSize.Antz_Small.fontWeight,
                          }}
                        >
                          {moment(
                            reLoadAnimalData?.commented_on,
                            "YYYY-MM-DD HH:mm:ss"
                          ).format("h:mm A")}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: constThemeColor.onSurface,
                          fontSize: FontSize.Antz_Medium_Medium.fontSize,
                          fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
                        }}
                      >
                        {reLoadAnimalData?.pending_count +
                          "/" +
                          loadAnimalData?.total_animal_count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {Object.keys(checkoutDenyData).length > 0 ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: Spacing.mini,
                    }}
                  >
                    <EntryExitStatus
                      approve={false}
                      title={"Security Checkout - On Hold"}
                      time={moment(
                        checkoutDenyData?.commented_on,
                        "YYYY-MM-DD HH:mm:ss"
                      ).format("h:mm A")}
                      user_name={checkoutDenyData?.user_details?.full_name}
                      subTitle={
                        checkoutDenyData?.user_details?.source_site_name ?? "NA"
                      }
                      sourceSite={
                        checkoutDenyData?.user_details?.source_site_name
                          ? true
                          : false
                      }
                      profile_pic={checkoutDenyData?.user_details?.profile_pic}
                      summary={checkoutDenyData?.comments ?? "Exit Denied"}
                      onPress={() =>
                        navigation.navigate("AnimalChecklist", {
                          type: "exitStatus",
                          checkInAllowed: false,
                          checkData: checkoutDenyData,
                          animal_movement_id: animalMovementId,
                          comment: checkoutDenyData?.comments,
                          screen: screen,
                        })
                      }
                    />
                  </View>
                ) : null} */}
                {Object.keys(startRideData).length > 0 ? (
                  <View
                    onLayout={(event) => {
                      const { x, y, width, height } = event.nativeEvent.layout;

                      setStartRideDataUiLineHeight(height);
                    }}
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      marginVertical: Spacing.small,
                      marginBottom: startRideData?.date_changed
                        ? Spacing.major * 2.5
                        : Spacing.small,
                    }}
                  >
                    <View style={{ paddingRight: Spacing.small, width: 70.5 }}>
                      <Text
                        style={{
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                          fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        }}
                      >
                        {moment(
                          startRideData?.commented_on,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("h:mm A")}
                      </Text>
                    </View>

                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: constThemeColor.onPrimaryContainer,
                        borderRadius: 12,
                        height: 24,
                        width: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.white,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={constThemeColor.onPrimaryContainer}
                      />
                      <View
                        style={{
                          flex: 1,
                          borderLeftWidth: 1,
                          height: startRideData?.date_changed
                            ? startRideDataUiLineHeight +
                              Spacing.body +
                              Spacing.small
                            : startRideDataUiLineHeight + Spacing.mini,
                          // height: startRideData?.date_changed ? 111 : 58,
                          borderLeftColor: constThemeColor.onPrimaryContainer,
                          position: "absolute",
                          top: 22,
                        }}
                      >
                        {startRideData?.date_changed && (
                          <View
                            onLayout={(event) => {
                              const { x, y, width, height } =
                                event.nativeEvent.layout;

                              setStartRideDataUiLineHeight(
                                (prev) => prev + height
                              );
                            }}
                            style={{
                              flex: 1,
                              position: "absolute",
                              top: 36,
                              right: -30,
                              padding: 8,
                              borderRadius: 8,
                              backgroundColor:
                                constThemeColor.displaybgSecondary,
                            }}
                          >
                            <Text
                              style={{
                                color: constThemeColor.onSurfaceVariant,
                                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                fontWeight:
                                  FontSize.Antz_Minor_Medium.fontWeight,
                              }}
                            >
                              {moment(
                                startRideData?.commented_on,
                                "YYYY-MM-DD HH:mm:ss"
                              ).format("DD MMM YYYY")}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flex: 1,
                        backgroundColor: constThemeColor.onBackground,
                        marginLeft: Spacing.minor,
                        padding: Spacing.body,
                        borderRadius: Spacing.small,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Minor_Regular.fontSize,
                          fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        }}
                      >
                        {startRideData?.comments}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {Object.keys(loadAnimalData).length > 0 ? (
                  <TouchableOpacity
                    onLayout={(event) => {
                      const { x, y, width, height } = event.nativeEvent.layout;

                      setLoadAnimalDataUiLineHeight(height);
                    }}
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      marginVertical: Spacing.small,
                      marginBottom: loadAnimalData?.date_changed
                        ? Spacing.major * 2.5
                        : Spacing.small,
                    }}
                    onPress={fetchAllAnimalCheckout}
                    disabled={
                      Object.keys(startRideData).length > 0 || !isCreator
                    }
                  >
                    <View style={{ paddingRight: Spacing.small, width: 70.5 }}>
                      <Text
                        style={{
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                          fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        }}
                      >
                        {moment(
                          loadAnimalData?.commented_on,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("h:mm A")}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: constThemeColor.onPrimaryContainer,
                        borderRadius: 12,
                        height: 24,
                        width: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.white,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={constThemeColor.onPrimaryContainer}
                      />
                      <View
                        style={{
                          flex: 1,
                          borderLeftWidth: 1,
                          height: loadAnimalData?.date_changed
                            ? loadAnimalDataUiLineHeight + Spacing.small
                            : loadAnimalDataUiLineHeight,

                          // height: loadAnimalData?.date_changed ? 114 : 61,
                          borderLeftColor: constThemeColor.onPrimaryContainer,
                          position: "absolute",
                          top: 22,
                        }}
                      >
                        {loadAnimalData?.date_changed && (
                          <View
                            onLayout={(event) => {
                              const { x, y, width, height } =
                                event.nativeEvent.layout;

                              setLoadAnimalDataUiLineHeight(
                                (prev) => prev + height
                              );
                            }}
                            style={{
                              flex: 1,
                              position: "absolute",
                              top: 36,
                              right: -30,
                              padding: 8,
                              borderRadius: 8,
                              backgroundColor:
                                constThemeColor.displaybgSecondary,
                            }}
                          >
                            <Text
                              style={{
                                color: constThemeColor.onSurfaceVariant,
                                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                fontWeight:
                                  FontSize.Antz_Minor_Medium.fontWeight,
                              }}
                            >
                              {moment(
                                loadAnimalData?.commented_on,
                                "YYYY-MM-DD HH:mm:ss"
                              ).format("DD MMM YYYY")}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flex: 1,
                        backgroundColor: constThemeColor.onBackground,
                        marginLeft: Spacing.minor,
                        padding: Spacing.body,
                        borderRadius: Spacing.small,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Minor_Regular.fontSize,
                          fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        }}
                      >
                        Animals loaded for transfer
                      </Text>
                      <Text
                        style={{
                          color: constThemeColor.onSurface,
                          fontSize: FontSize.Antz_Medium_Medium.fontSize,
                          fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
                        }}
                      >
                        {loadAnimalData?.pending_count +
                          "/" +
                          loadAnimalData?.total_animal_count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {Object.keys(tempData).length > 0 ? (
                  <TouchableOpacity
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      marginVertical: Spacing.small,
                    }}
                    onPress={() => handleTempEntryModal(tempData)}
                    disabled={
                      Object.keys(loadAnimalData).length > 0 || !isCreator
                    }
                  >
                    <View style={{ paddingRight: Spacing.small, width: 70.5 }}>
                      <Text
                        style={{
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                          fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        }}
                      >
                        {moment(
                          tempData?.commented_on,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("h:mm A")}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: constThemeColor.onPrimaryContainer,
                        borderRadius: 12,
                        height: 24,
                        width: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.white,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={constThemeColor.onPrimaryContainer}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flex: 1,
                        backgroundColor: constThemeColor.onBackground,
                        marginLeft: Spacing.minor,
                        paddingTop: Spacing.body,
                        paddingLeft: Spacing.body,
                        paddingBottom: Spacing.mini,
                        borderRadius: Spacing.small,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Minor_Regular.fontSize,
                          fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        }}
                      >
                        Temperature checked
                      </Text>
                      <Text
                        style={{
                          color: constThemeColor.onSurface,
                          fontSize: FontSize.Antz_Medium_Medium.fontSize,
                          fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
                        }}
                      >
                        {tempData?.temperature_value +
                          (tempData?.temperature_unit == "C" ||
                          tempData?.temperature_unit == "c"
                            ? "°C"
                            : `°${capitalize(tempData?.temperature_unit)}`)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {Object.keys(approveData).length > 0 ? (
                  <View
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      marginVertical: Spacing.small,
                    }}
                  >
                    <View style={{ paddingRight: Spacing.small, width: 70.5 }}>
                      <Text
                        style={{
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Body_Medium.fontSize,
                          fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                        }}
                      >
                        {moment(
                          approveData?.commented_on,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("h:mm A")}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: constThemeColor.onPrimaryContainer,
                        borderRadius: 12,
                        height: 24,
                        width: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.white,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={constThemeColor.onPrimaryContainer}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flex: 1,
                        backgroundColor: constThemeColor.onBackground,
                        marginLeft: Spacing.minor,
                        padding: Spacing.body,
                        borderRadius: Spacing.small,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: constThemeColor.onSurfaceVariant,
                          fontSize: FontSize.Antz_Minor_Regular.fontSize,
                          fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        }}
                      >
                        Transfer Approved
                      </Text>
                    </View>
                  </View>
                ) : null}
              </>
            ) : null}
          </ScrollView>
          {(!approvedCheck &&
            status !== "CANCELED" &&
            !allButtonStatus?.already_approved &&
            !allButtonStatus?.already_rejected &&
            !allButtonStatus?.reset_approval &&
            !allButtonStatus?.approve_button &&
            !allButtonStatus?.reinitiate_button &&
            !allButtonStatus?.reject_button &&
            (!allButtonStatus?.show_check_temperature_button ||
              Object.keys(tempData).length > 0 ||
              Object.keys(loadAnimalData).length > 0 ||
              Object.keys(reLoadAnimalData).length > 0 ||
              Object.keys(startRideData).length > 0 ||
              Object.keys(checkoutDenyData).length > 0 ||
              Object.keys(checkoutAllowData).length > 0 ||
              Object.keys(checkinAllowData).length > 0 ||
              Object.keys(checkinDenyData).length > 0 ||
              Object.keys(reachDestinationData).length > 0 ||
              Object.keys(approveEntryData).length > 0 ||
              Object.keys(destinationVehicle).length > 0)) ||
          Object.keys(allocationComplete).length > 0 ||
          Object.keys(trasferComplete).length > 0 ? (
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                paddingHorizontal: Spacing.minor,
                paddingVertical: Spacing.mini,
              }}
            >
              {Object.keys(recentLog).length > 0 ? (
                // && !seeAllLogs
                <View style={{ width: "75%" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        color: constThemeColor.neutralSecondary,
                        fontSize: FontSize.Antz_Body_Regular.fontSize,
                        fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                      }}
                    >
                      Current Status
                    </Text>
                    {recentLog?.commented_on && (
                      <Text
                        style={{
                          color: constThemeColor.neutralSecondary,
                          fontSize: FontSize.Antz_Body_Regular.fontSize,
                          fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                          marginLeft: Spacing.mini,
                        }}
                      >
                        • {timeCalculate(recentLog?.commented_on)}{" "}
                        {timeCalculate(recentLog?.commented_on) == "Just now"
                          ? ""
                          : "ago"}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      color: constThemeColor.onPrimaryContainer,
                      fontSize: FontSize.Antz_Medium_Medium.fontSize,
                      fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
                    }}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {recentLog?.comments}
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    color: constThemeColor.neutralSecondary,
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  }}
                >
                  Activity
                </Text>
              )}
              <TouchableOpacity
                style={{
                  padding: Spacing.micro,
                  justifyContent: "flex-end",
                  display:
                    Object.keys(tempData).length > 0 ||
                    Object.keys(approveData).length > 0
                      ? "flex"
                      : "none",
                }}
                onPress={handleSeeAllLogs}
              >
                <Text
                  style={{
                    color: constThemeColor.onSurface,
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  }}
                >
                  {seeAllLogs ? "Hide" : "See all"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {transferLogs?.length >= 1 &&
          (!allButtonStatus?.reinitiate_button ||
            !allButtonStatus?.already_rejected) &&
          status !== "CANCELED" ? (
            // && !seeAllLogs
            <ProgressBar logs={transferLogs} transferType={transfer_type} />
          ) : null}

          {allButtonStatus?.show_allocate_button ? (
            <ActionBtn
              onPress={() =>
                navigation.navigate("AllocateAnimals", {
                  animal_movement_id: animalMovementId,
                  sourceSite: sourceSite,
                  destinationSite: destinationSite,
                  transfer_type: transfer_type,
                  request_id: request_id,
                  allocateTo: allocateTo,
                })
              }
              backgroundColor={constThemeColor?.onPrimaryContainer}
              title={"Allocate Enclosures"}
            />
          ) : null}
          {allButtonStatus?.reset_approval ||
          (allButtonStatus?.already_approved &&
            !allButtonStatus?.show_check_temperature_button &&
            !allButtonStatus?.show_load_animals_button) ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: Spacing.body,
              }}
            >
              <MaterialIcons
                name="check"
                size={24}
                color={constThemeColor?.onPrimary}
                style={{
                  alignSelf: "center",
                  marginLeft: Spacing.micro,
                  marginRight: Spacing.body,
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  color: constThemeColor.onPrimary,
                  fontSize: FontSize.Antz_Major_Title_btn.fontSize,
                  fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
                }}
              >
                {allButtonStatus?.show_you_approved
                  ? "You Approved"
                  : "Approved"}
              </Text>
            </View>
          ) : null}

          {(allButtonStatus?.reinitiate_button ||
            allButtonStatus?.already_rejected) &&
          status !== "CANCELED" ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: Spacing.body,
              }}
            >
              <Entypo
                name="cross"
                size={24}
                color={constThemeColor?.onPrimary}
                style={{
                  alignSelf: "center",
                  marginLeft: Spacing.micro,
                  marginRight: Spacing.body,
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  color: constThemeColor.onPrimary,
                  fontSize: FontSize.Antz_Major_Title_btn.fontSize,
                  fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
                }}
              >
                {allButtonStatus?.show_you_rejected
                  ? "You Rejected"
                  : "Rejected"}
              </Text>
            </View>
          ) : null}
          {allButtonStatus?.reinitiate_button && status === "CANCELED" ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: Spacing.body,
              }}
            >
              <Entypo
                name="cross"
                size={24}
                color={constThemeColor?.onPrimary}
                style={{
                  alignSelf: "center",
                  marginLeft: Spacing.micro,
                  marginRight: Spacing.body,
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  color: constThemeColor.onPrimary,
                  fontSize: FontSize.Antz_Major_Title_btn.fontSize,
                  fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
                }}
              >
                Canceled
              </Text>
            </View>
          ) : null}

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ position: "relative" }}
          >
            {allButtonStatus?.approve_button ? (
              <TouchableOpacity
                onPress={approveFunc}
                style={{
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: constThemeColor.primary,
                  width: "90%",
                  borderRadius: Spacing.body,
                  paddingVertical: Spacing.minor,
                  backgroundColor: constThemeColor.primary,
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
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                  }}
                >
                  {"Approve"}
                </Text>
              </TouchableOpacity>
            ) : null}
            {allButtonStatus?.reject_button ? (
              <TouchableOpacity
                onPress={() => setShowRejectModal(true)}
                style={{
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: constThemeColor.error,
                  width: "90%",
                  borderRadius: Spacing.body,
                  paddingVertical: Spacing.minor,
                  backgroundColor: constThemeColor.error,
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
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                  }}
                >
                  {"Reject"}
                </Text>
              </TouchableOpacity>
            ) : null}
            {allButtonStatus?.reset_approval ? (
              <TouchableOpacity
                onPress={() => {
                  setShowRejectModal(false);
                  rejectAndResetFunc({ activity_status: "PENDING" });
                }}
                style={{
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: constThemeColor.outlineVariant,
                  width: "80%",
                  borderRadius: Spacing.body,
                  paddingVertical: Spacing.minor,
                  backgroundColor: constThemeColor.onPrimary,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: Spacing.small,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: constThemeColor.error,
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                  }}
                >
                  {"Reset Approval"}
                </Text>
              </TouchableOpacity>
            ) : null}
            {allButtonStatus?.reinitiate_button ? (
              <TouchableOpacity
                onPress={() => {
                  dispatch(removeMedical());
                  navigation.navigate("MoveAnimal", {
                    animal_movement_id: animalMovementId,
                    sourceSite: sourceSite,
                    destinationSite: destinationSite,
                    transfer_type: transfer_type,
                    allocateTo: allocateTo,
                  });
                }}
                style={{
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: constThemeColor.onPrimary,
                  width: "80%",
                  paddingVertical: Spacing.minor,
                  backgroundColor:
                    status === "CANCELED"
                      ? constThemeColor?.neutralSecondary
                      : constThemeColor.error,
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
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                  }}
                >
                  {"Re-initiate transfer"}
                </Text>
              </TouchableOpacity>
            ) : null}
            {allButtonStatus?.fill_transfer_check_list ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("TransferCheckList", {
                    animalMovementId: animalMovementId,
                    requestId: requestId,
                    edit: true,
                    screen: screen,
                    transfer_type:transfer_type
                  })
                }
                style={{
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: constThemeColor.outlineVariant,
                  width: "80%",
                  paddingVertical: Spacing.minor,
                  backgroundColor: constThemeColor.onPrimary,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: Spacing.small,
                  borderRadius: Spacing.body,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: constThemeColor.onSurfaceVariant,
                    fontSize: FontSize.Antz_Minor_Regular.fontSize,
                    fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                  }}
                >
                  {"Fill Transfer Checklist"}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={22}
                  color={constThemeColor?.onSurface}
                  style={{ alignSelf: "center", marginLeft: Spacing.micro }}
                />
              </TouchableOpacity>
            ) : null}

            {/* <TouchableOpacity
          style={{
            alignSelf: "center",
            borderWidth: 1,
            borderColor: constThemeColor.outlineVariant,
            width: "80%",
            paddingVertical: Spacing.minor,
            backgroundColor: constThemeColor.onPrimary,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: Spacing.small,
            borderRadius: Spacing.body,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: constThemeColor.onSurfaceVariant,
              fontSize: FontSize.Antz_Minor_Regular.fontSize,
              fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
            }}
          >
            {"Add Comment"}
          </Text>
        </TouchableOpacity> */}
            {allButtonStatus?.show_check_temperature_button ? (
              // <AnimatedActionBtn
              //   title={'Check Temperature'}
              //   titleFontSize={FontSize.Antz_Medium_Medium.fontSize}
              //   onPress={() => handleTempEntryModal()}
              // />

              <ActionBtn
                onPress={() => handleTempEntryModal()}
                containerStyle={{
                  justifyContent: "flex-end",
                }}
                backgroundColor={constThemeColor?.onPrimaryContainer}
                title={"Check Temperature"}
              />
            ) : null}

            {allButtonStatus?.show_load_animals_button ? (
              <ActionBtn
                onPress={() =>
                  navigation.navigate("AnimalChecklist", {
                    type: "checkList",
                    animal_movement_id: animalMovementId,
                    screen: screen,
                    transfer_type: transfer_type,
                    trasferStatus: status,
                    status: status,
                    request_id:requestId,
                    qr_code_full_path:qr_code_full_path
                  })
                }
                backgroundColor={constThemeColor?.onPrimaryContainer}
                title={"Load Animals"}
              />
            ) : null}
            {allButtonStatus?.show_start_ride_button ? (
              <ActionBtn
                onPress={() => {
                  if (
                    loadAnimalData?.pending_count ==
                    loadAnimalData?.total_animal_count
                  ) {
                    RideStartedFunc();
                  } else {
                    navigation.navigate("ConfirmRide", {
                      animal_movement_id: animalMovementId,
                      trasferStatus: status,
                      qr_code_full_path:qr_code_full_path,
                      request_id:requestId,
                      screen:screen
                    });
                  }
                }}
                backgroundColor={constThemeColor?.onPrimaryContainer}
                title={"Move to Security Check"}
              />
            ) : null}
            {allButtonStatus?.show_security_checkout_button ? (
              <ActionBtn
                onPress={() =>
                  navigation.navigate("AnimalChecklist", {
                    type: "checkOut",
                    animal_movement_id: animalMovementId,
                    screen: screen,
                    transfer_type: transfer_type,
                  })
                }
                backgroundColor={constThemeColor?.onPrimaryContainer}
                title={"Security Checkout"}
              />
            ) : null}
            {allButtonStatus?.show_reload_animals_button ? (
              <ActionBtn
                onPress={() => {
                  navigation.navigate("AnimalChecklist", {
                    type: "RELOADED_ANIMALS",
                    animal_movement_id: animalMovementId,
                    screen: screen,
                    transfer_type: transfer_type,
                    request_id:requestId,
                  });
                }}
                backgroundColor={constThemeColor?.onPrimaryContainer}
                title={"Resolve issue"}
              />
            ) : null}
            {/* <ActionBtn
        backgroundColor={constThemeColor?.primary}
        title={"Allow Exit"}
        titleFontSize={FontSize.Antz_Major_Title_btn.fontSize}
        titleFontWeight={FontSize.Antz_Major_Title_btn.fontWeight}
      /> */}
            {allButtonStatus?.show_security_checkin_button ? (
              <ActionBtn
                onPress={handleVehicleArrived}
                backgroundColor={constThemeColor?.onPrimaryContainer}
                title={"Security Checkin"}
              />
            ) : null}
            {/* <TouchableOpacity
        style={{
          alignSelf: "center",
          borderWidth: 1,
          borderColor: constThemeColor.error,
          width: "90%",
          borderRadius: Spacing.body,
          paddingVertical: Spacing.minor,
          backgroundColor: constThemeColor.error,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginVertical: Spacing.small,
        }}
      >
        <AntDesign
          name={"exclamationcircleo"}
          color={constThemeColor.onPrimary}
          size={20}
          style={{ marginRight: Spacing.body }}
        />
        <Text
          style={{
            textAlign: "center",
            color: constThemeColor.onPrimary,
            fontSize: FontSize.Antz_Major_Title_btn.fontSize,
            fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
          }}
        >
          {"Deny Entry"}
        </Text>
      </TouchableOpacity> */}
            {allButtonStatus?.show_approve_entry ? (
              <ActionBtn
                backgroundColor={constThemeColor?.onPrimaryContainer}
                title={"Approve Entry"}
                onPress={handleApproveEntry}
              />
            ) : null}
            {allButtonStatus?.show_allow_entry ? (
              <ActionBtn
                backgroundColor={constThemeColor?.primary}
                title={"Allow Entry"}
                titleFontSize={FontSize.Antz_Major_Title_btn.fontSize}
                titleFontWeight={FontSize.Antz_Major_Title_btn.fontWeight}
                onPress={handleAllowEntry}
              />
            ) : null}

            {/* <ActionBtn
            onPress={reachDestinationFunc}
            backgroundColor={constThemeColor?.primary}
            title={"Complete"}
          /> */}
            {allButtonStatus?.show_reached_destination_button ? (
              <ActionBtn
                onPress={reachDestinationFunc}
                backgroundColor={constThemeColor?.onPrimaryContainer}
                title={"Received Animals"}
              />
            ) : null}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/** Reject modal*/}
      <Modal
        avoidKeyboard
        animationType="fade"
        visible={showRejectModal}
        style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
      >
        <TouchableWithoutFeedback onPress={() => setShowRejectModal(false)}>
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
                  Reject Transfer
                </Text>
                <TouchableOpacity
                  activeOpacity={1}
                  style={reduxColors.closeBtn}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color={constThemeColor.onSurface}
                    onPress={() => setShowRejectModal(false)}
                  />
                </TouchableOpacity>
              </View>
              <View style={reduxColors.modalBody}>
                <TextInput
                  inputLabel={"Reason"}
                  mode="outlined"
                  autoCompleteType="off"
                  placeholder={"Enter reason to reject"}
                  style={{
                    width: "100%",
                    backgroundColor: constThemeColor.errorContainer,
                    borderColor: constThemeColor.errorContainer,
                    height: 100,
                    borderRadius: 8,
                    color: constThemeColor?.errorContainer,
                  }}
                  onChangeText={(text) => {
                    setRejectReason(text);
                  }}
                  placeholderTextColor={constThemeColor?.onErrorContainer}
                  cursorColor={constThemeColor.error}
                  textColor={constThemeColor?.onErrorContainer}
                  outlineColor={constThemeColor.error}
                  activeOutlineColor={constThemeColor.error}
                  textAlignVertical="top"
                  numberOfLines={1}
                  multiline
                />
              </View>
              <View style={[reduxColors.modalBtnCover]}>
                {rejectReason?.length != 0 ? (
                  <TouchableOpacity
                    disabled={rejectReason === "" ? true : false}
                    onPress={() => handleReject()}
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
                ) : null}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        avoidKeyboard
        animationType="fade"
        visible={showApproveModal}
        style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
      >
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[reduxColors.container, { backgroundColor: "transparent" }]}
        > */}
        <TouchableWithoutFeedback onPress={() => setShowApproveModal(false)}>
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
                  Approve transfer
                </Text>
                <TouchableOpacity
                  activeOpacity={1}
                  style={reduxColors.closeBtn}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color={constThemeColor.onSurface}
                    onPress={() => setShowApproveModal(false)}
                  />
                </TouchableOpacity>
              </View>
              <View style={reduxColors.modalBody}>
                <TextInput
                  inputLabel={"Reason"}
                  mode="outlined"
                  autoCompleteType="off"
                  multiline={true}
                  placeholder={"Enter reason to approve"}
                  style={{
                    width: "100%",
                    paddingVertical: Spacing.micro,
                    backgroundColor: constThemeColor.surface,
                    borderColor: constThemeColor?.outlineVariant,
                    paddingHorizontal: Spacing.small,
                    height: 100,
                    borderRadius: 8,
                    textAlignVertical: "top",
                  }}
                  onChangeText={(text) => {
                    setApproveReason(text);
                  }}
                  placeholderTextColor={constThemeColor?.onErrorContainer}
                />
              </View>
              <View style={[reduxColors.modalBtnCover]}>
                {approveReason?.length != 0 ? (
                  <TouchableOpacity
                    disabled={approveReason === "" ? true : false}
                    onPress={() => ApprovedEntry()}
                    style={{
                      backgroundColor: constThemeColor.primary,
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
                ) : null}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {/* </KeyboardAvoidingView> */}
      </Modal>
      <Modal
        avoidKeyboard
        animationType="fade"
        visible={showTempEntryModal}
        style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
      >
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[reduxColors.container, { backgroundColor: "transparent" }]}
        > */}
        <TouchableWithoutFeedback onPress={() => setShowTempEntryModal(false)}>
          <View style={[reduxColors.modalOverlay]}>
            <View style={reduxColors.modalContainer}>
              <View style={reduxColors.modalHeader}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: constThemeColor.onPrimaryContainer,
                  }}
                >
                  Enter Current Temperature
                </Text>
                <TouchableOpacity
                  activeOpacity={1}
                  style={reduxColors.closeBtn}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color={constThemeColor.onSurface}
                    onPress={() => setShowTempEntryModal(false)}
                  />
                </TouchableOpacity>
              </View>
              <View style={reduxColors.modalBody}>
                <TextInput
                  inputLabel={"Count"}
                  defaultValue={tempValue}
                  mode="outlined"
                  autoCompleteType="off"
                  placeholder={"Enter Temperature"}
                  keyboardType="number-pad"
                  maxLength={3}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    paddingVertical: Spacing.micro,
                    backgroundColor: constThemeColor.surface,
                    marginRight: Spacing.minor,
                  }}
                  onChangeText={(number) => {
                    setTempValue(number);
                  }}
                />

                <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                  <TouchableOpacity
                    onPress={() => setSelectedTempUnit("c")}
                    style={[
                      reduxColors.tempUnitButton,
                      {
                        borderTopLeftRadius: Spacing.mini,
                        borderBottomLeftRadius: Spacing.mini,
                        backgroundColor:
                          selectedTempUnit === "c"
                            ? constThemeColor.secondaryContainer
                            : constThemeColor.onPrimary,
                      },
                    ]}
                  >
                    <Text>°C</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedTempUnit("f")}
                    style={[
                      reduxColors.tempUnitButton,
                      {
                        borderLeftWidth: 0,
                        borderTopRightRadius: Spacing.mini,
                        borderBottomRightRadius: Spacing.mini,
                        backgroundColor:
                          selectedTempUnit === "f"
                            ? constThemeColor.secondaryContainer
                            : constThemeColor.onPrimary,
                      },
                    ]}
                  >
                    <Text>°F</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[reduxColors.modalBtnCover]}>
                <TouchableOpacity
                  onPress={() => {
                    submitTemp(tempValue, selectedTempUnit);
                  }}
                  style={{
                    backgroundColor: constThemeColor.primary,
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
        {/* </KeyboardAvoidingView> */}
      </Modal>
    </>
  );
};

export default BottomsheetTransferBtns;

const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("screen").width;
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
      // justifyContent: "space-between",
      // alignItems: "center",
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
    countContainer: {
      paddingHorizontal: 10,
      borderRadius: 10,
      marginLeft: 10,
    },
    countText: {
      color: "#1B5E20", // Adjust the color to match your design
      fontSize: 16, // Adjust the size to match your design
    },
  });
