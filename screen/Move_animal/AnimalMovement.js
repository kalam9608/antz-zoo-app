/*
 * Modified By - Anirban Pan
 * ON -25.05.2023
 */
/*
 * React Import
 */
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ScrollView,
  BackHandler,
} from "react-native";

/*
 * Redux Import
 */
import { useDispatch, useSelector } from "react-redux";
import {
  removeAnimalMovementData,
  setApprover,
} from "../../redux/AnimalMovementSlice";

/*
 * Responsive Import
 */
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

/*
 * Component Import
 */
import MoveAnimalHeader from "../../components/MoveAnimalHeader";
import RequestBy from "../../components/Move_animal/RequestBy";
import Loader from "../../components/Loader";

/*
 * React native paper Import
 */
import { Divider, TextInput } from "react-native-paper";

/*
 * Expo Import
 */
import { AntDesign, Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";

/*
 * API Import
 */
import { createAnimalMoveRequest } from "../../services/Animal_movement_service/MoveAnimalService";
import { capitalize, ifEmptyValue } from "../../utils/Utils";
import SubmitBtn from "../../components/SubmitBtn";
import DynamicAlert from "../../components/DynamicAlert";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { errorDailog, successDailog } from "../../utils/Alert";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import InchargeCard from "../../components/InchargeCard";
import Header from "../../components/Header";
import { useToast } from "../../configs/ToastConfig";

const AnimalMovement = (props) => {
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [complete_name, setcomplete_name] = useState(
    props.route.params?.item.complete_name ?? ""
  );
  const [taxonomy_id, settaxonomy_id] = useState(
    props.route.params?.item.taxonomy_id ?? ""
  );
  const [user_enclosurename, setuser_enclosure_name] = useState(
    props.route.params?.item.user_enclosure_name ?? ""
  );
  const [section_name, setsection_name] = useState(
    props.route.params?.item.section_name ?? ""
  );
  const [approverList, setApproverList] = useState([]);

  /*
   * Redux state value
   */
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const user = [useSelector((state) => state.UserAuth.userDetails)].map(
    (item) => {
      return {
        user_email: item.user_email,
        user_id: item.user_id,
        user_mobile_number: item.user_mobile_number,
        user_name: item.user_first_name + " " + item.user_last_name,
        user_profile_pic: item.profile_pic,
      };
    }
  );
  const destination =
    useSelector((state) => state.AnimalMove.destination) ?? {};
  const approver = useSelector((state) =>
    Object.keys(state.AnimalMove.approver).length > 0
      ? state.AnimalMove.approver
      : []
  );
  useEffect(() => {
    setApproverList(approver);
  }, [JSON.stringify(approver)]);
  const deleteApprover = (id) => {
    const filter = approverList?.filter((p) => p?.user_id != id);
    setApproverList(filter);
    dispatch(setApprover(filter));
  };

  const requestBy = useSelector((state) => state.AnimalMove.requestBy) ?? user;

  const setAnimalArray = useSelector((state) =>
    props.route.params?.item
      ? [props.route.params?.item]
      : Object.keys(state.AnimalMove.animal).length > 0
      ? state.AnimalMove.animal
      : []
  );
  // const setAnimalArray = useSelector((state) =>Object.keys(state.AnimalMove.animal).length>0?state.AnimalMove.animal:[]);
  const isRequestBy = useSelector((state) => state.AnimalMove.isRequestBy);

  /*
   * Local state
   */

  const [reasonToMove, setReasonToMove] = useState("");
  const [loading, setLoading] = useState(false);

  /*
   * validation state state
   */
  const [animalError, setAnimalError] = useState(false);
  const [destinationError, setDesignationError] = useState(false);
  const [approvalError, setApprovalError] = useState(false);

  const [animalErrorMessage, setAnimalErrorMessage] = useState("");
  const [destinationErrorMessage, setDestinationErrorMessage] = useState("");
  const [approvalErrorMessage, setApprovalErrorMessage] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  /*
   * Navigation to screen
   */
  const gotoSelectScreen = () => {
    navigation.navigate("SearchTransferanimal");
  };
  const gotoSearchScreen = (limit) => {
    navigation.navigate("CommonAnimalSelect", {
      screenName: "MoveAnimal",
      limit: limit,
    });
  };
  const gotoApprovalScreen = (e, is_true) => {
    if (is_true) {
      navigation.navigate("InchargeAndApproverSelect", {
        user: e,
        selectedInchargeIds: requestBy.map((item) => item.user_id),
        inchargeDetailsData: requestBy,
        isRequestByScreen: is_true,
        is_single: true,
      });
    } else {
      navigation.navigate("InchargeAndApproverSelect", {
        selectedInchargeIds: approver.map((item) => item.user_id),
        inchargeDetailsData: approver,
      });
    }
  };

  // validation
  const Validation = () => {
    if (!setAnimalArray[0]?.enclosure_id) {
      setAnimalError(true);
      setAnimalErrorMessage("Please select this is required");
      return false;
    }

    if (!destination.enclosure_id) {
      setDesignationError(true);
      setDestinationErrorMessage("Please select this is required");
      return false;
    }

    if (!approver[0]?.user_id) {
      setApprovalError(true);
      setApprovalErrorMessage("Please select this is required");
      return false;
    }

    return true;
  };

  const showAlert = () => {
    setIsVisible(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };

  const handleOK = () => {
    setIsVisible(false);
    if (alertType === "success") {
      // navigation.navigate("Home");
      navigation.navigate("ApprovalTask");
    }
  };
  const handleCancel = () => {
    setIsVisible(false);
  };

  /*
   * Submit request function
   */
  const submitMoveRequest = () => {
    setAnimalError(false);
    setDesignationError(false);
    setApprovalError(false);

    if (Validation()) {
      const Ids = setAnimalArray?.map((value) => value.animal_id);
      const approvalIds = approverList?.map((value) => value.user_id);
      setLoading(true);
      let postData = {
        from_enclosure_id: setAnimalArray[0]?.enclosure_id,
        entity_type: "animal",
        entity_ids: Ids,
        to_enclosure_id: destination.enclosure_id,
        reason: reasonToMove,
        approval_from: approvalIds,
        requested_by: requestBy[0].user_id,
        status: "Requested",
      };
      createAnimalMoveRequest(postData)
        .then((res) => {
          if (res.success) {
            dispatch(removeAnimalMovementData());
            // setAlertType("success");
            // setAlertMessage(res?.message);
            successToast("success", res?.message);
            navigation.navigate("ApprovalTask");
            setReasonToMove("");
          } else {
            // setAlertType("error");
            // setAlertMessage(res?.message);
            errorToast("error", res?.message);
          }
        })
        .catch((err) => {
          // setAlertType("error");
          // setAlertMessage("Something Went Wrong");
          errorToast("error", "Something Went Wrong");
        })
        .finally(() => {
          // showAlert();
          setLoading(false);
        });
    }
  };

  const gotoBack = () => {
    dispatch(removeAnimalMovementData());
    navigation.goBack();
  };

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      <Loader visible={loading} />
      {/* <MoveAnimalHeader
        title={"Move Animal"}
        headerTitle={reduxColors.headerTitle}
        gotoBack={gotoBack}
      /> */}
      <Header
        noIcon={true}
        title={"Move Animal"}
        showBackButton={true}
        style={{ backgroundColor: constThemeColor.onPrimary }}
        backgroundColor={constThemeColor.onPrimary}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: constThemeColor.onPrimary }}
      >
        <View style={reduxColors.mainContainer}>
          <View style={reduxColors.conatiner}>
            <View style={[reduxColors.animalBox]}>
              <TouchableOpacity
                onPress={() => gotoSearchScreen(Infinity)}
                disabled={props.route.params?.item ? true : false}
                style={[
                  reduxColors.animalCardStyle,
                  {
                    // minHeight: setAnimalArray[0]?.animal_id
                    //   ? heightPercentageToDP(18)
                    //   : complete_name
                    //   ? heightPercentageToDP(18)
                    //   : heightPercentageToDP(6.8),
                    // borderWidth: setAnimalArray[0]?.animal_id ? 1.5 : 1,
                    paddingVertical: Spacing.body,
                  },
                  {
                    borderColor:
                      animalError && !setAnimalArray[0]?.enclosure_id
                        ? constThemeColor.error
                        : constThemeColor.outlineVariant,
                  },

                  // {
                  //   paddingTop: setAnimalArray?.length > 0 ? 10 : 0,
                  // },
                ]}
              >
                <Text style={[reduxColors.animalTextStyle]}>
                  Select Animal to be Moved
                </Text>
                {setAnimalArray?.map((setAnimal, key) => {
                  return (
                    <AnimalCustomCard
                      item={setAnimal}
                      key={key}
                      animalIdentifier={
                        !setAnimal?.local_identifier_value
                          ? setAnimal?.animal_id
                          : setAnimal?.local_identifier_name ?? null
                      }
                      localID={setAnimal?.local_identifier_value ?? null}
                      icon={setAnimal.default_icon}
                      enclosureName={setAnimal?.user_enclosure_name}
                      animalName={
                        setAnimal?.common_name
                          ? setAnimal?.common_name
                          : setAnimal?.scientific_name
                      }
                      sectionName={setAnimal?.section_name}
                      show_specie_details={true}
                      show_housing_details={true}
                      chips={setAnimal?.sex}
                      onPress={() => {
                        if (!props.route.params?.item) {
                          gotoSearchScreen(Infinity);
                        }
                      }}
                      style={{
                        backgroundColor: constThemeColor.surface,
                        shadowOpacity: 0,
                      }}
                      noArrow={false}
                    />
                  );
                })}
              </TouchableOpacity>
              {animalError && !setAnimalArray[0]?.enclosure_id ? (
                <View style={reduxColors.errorBox}>
                  <Text style={reduxColors.errorMessage}>
                    {animalErrorMessage}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={reduxColors.destinationBox}>
              <TouchableOpacity
                onPress={gotoSelectScreen}
                style={[
                  reduxColors.animalCardStyle,
                  {
                    // minHeight: destination?.enclosure_id
                    //   ? heightPercentageToDP(14)
                    //   : heightPercentageToDP(7),
                    //paddingVertical:Spacing.minor+Spacing.micro,
                    //borderWidth: destination?.enclosure_id ? 1.5 : 1,
                    paddingVertical: Spacing.body,
                  },
                  {
                    borderColor:
                      destinationError && !destination.enclosure_id
                        ? constThemeColor.error
                        : constThemeColor.outlineVariant,
                  },
                ]}
              >
                <Text
                  style={[
                    reduxColors.animalTextStyle,

                    // { paddingVertical: destination.enclosure_id ? 10 : 0 },
                  ]}
                >
                  Select Destination
                </Text>
                {destination.enclosure_id ? (
                  <View style={{ paddingTop: Spacing.body }}>
                    <RequestBy
                      svgUri={true}
                      middleSection={
                        <View>
                          <Text
                            style={{
                              fontSize: FontSize.Antz_Minor_Title.fontSize,
                              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                              color: constThemeColor.onPrimaryContainer,
                              marginBottom: Spacing.micro,
                            }}
                          >
                            {capitalize(destination.user_enclosure_name)}
                          </Text>
                          <Text
                            style={{
                              fontSize: FontSize.Antz_Body_Regular.fontSize,
                              fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                              color: constThemeColor.onPrimaryContainer,
                              marginBottom: Spacing.micro,
                            }}
                          >
                            In Charge -
                            <Text style={{ color: reduxColors.onSurface }}>
                              {" "}
                              {ifEmptyValue(destination.incharge_name)}
                            </Text>
                          </Text>
                          <Text
                            style={{
                              fontSize: FontSize.Antz_Body_Regular.fontSize,
                              fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                              color: constThemeColor.onSurfaceVariant,
                              marginBottom: Spacing.micro,
                            }}
                          >
                            Section - {ifEmptyValue(destination?.section_name)}
                          </Text>
                          <Text
                            style={{
                              fontSize: FontSize.Antz_Body_Regular.fontSize,
                              fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                              color: constThemeColor.onSurfaceVariant,
                            }}
                          >
                            Site - {ifEmptyValue(destination?.site_name)}
                          </Text>
                        </View>
                      }
                      rightSectoon={
                        <View
                          style={
                            {
                              // marginHorizontal: widthPercentageToDP(3),
                            }
                          }
                        >
                          {/* <AntDesign
                          name="right"
                          size={24}
                          color={constThemeColor.onPrimaryContainer}
                        /> */}
                          <MaterialIcons
                            name="keyboard-arrow-right"
                            size={24}
                            color={constThemeColor.onSurfaceVariant}
                          />
                        </View>
                      }
                    />
                  </View>
                ) : null}
              </TouchableOpacity>
              {destinationError && !destination.enclosure_id ? (
                <View style={reduxColors.errorBox}>
                  <Text style={reduxColors.errorMessage}>
                    {destinationErrorMessage}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* <View style={reduxColors.destinationBox}>
              <TouchableOpacity
                onPress={() => gotoApprovalScreen(user, false)}
                style={[
                  reduxColors.animalCardStyle,
                  {
                    minHeight: approver[0]?.user_id
                      ? heightPercentageToDP(14)
                      : heightPercentageToDP(7),
                    paddingTop: approver?.length > 0 ? 5 : 0,
                    borderWidth: approver[0]?.user_id ? 1.5 : 1,
                  },
                  {
                    borderColor:
                      approvalError && !approver.user_id
                        ? constThemeColor.error
                        : constThemeColor.outlineVariant,
                  },
                ]}
              >
                <Text style={reduxColors.animalTextStyle}>Approval From</Text>
                {approver?.map((approverr, key) => (
                  <RequestBy
                    borderBottomWidth={approver?.length - 1 == key ? 0 : 0.5}
                    borderBottomColor={constThemeColor.outlineVariant}
                    svgUri={true}
                    middleSection={
                      <View>
                        <Text
                          style={{
                            fontSize: FontSize.Antz_Minor_Title.fontSize,
                            fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                            color: constThemeColor.onPrimaryContainer,
                          }}
                        >
                          {approverr.user_name}
                        </Text>
                        <Text
                          style={{
                            fontSize: FontSize.Antz_Minor_Title.fontSize,
                            // fontWeight: "600",
                            color: constThemeColor.onPrimaryContainer,
                            color: constThemeColor.onPrimaryContainer,
                          }}
                        >
                          Department -{" "}
                          {approverr.departments ? approverr.departments : "NA"}
                        </Text>
                        <Text
                          style={{
                            fontSize: FontSize.Antz_Minor_Title.fontSize,
                            color: constThemeColor.onPrimaryContainer,
                            color: constThemeColor.onPrimaryContainer,
                          }}
                        >
                          {approverr.designation}
                        </Text>
                      </View>
                    }
                    rightSectoon={
                      <View
                        style={{
                          marginHorizontal: widthPercentageToDP(11),
                        }}
                      >
                        <AntDesign
                          name="right"
                          size={14}
                          color={constThemeColor.onPrimaryContainer}
                        />
                      </View>
                    }
                  />
                ))}
              </TouchableOpacity>
            </View> */}

            <View style={[reduxColors.animalBox]}>
              <InchargeCard
                customStyle={reduxColors.inchargeCardCustom}
                navigation={gotoApprovalScreen}
                title={"Approval From"}
                selectedUserData={approverList}
                removeAsign={(item) => deleteApprover(item?.user_id)}
                outerStyle={{
                  borderWidth: approverList?.length > 0 ? 1 : 1,
                  borderRadius: Spacing.small,
                  backgroundColor: constThemeColor.surface,
                  // borderColor: constThemeColor.outline,
                  //paddingVertical:Spacing.micro+Spacing.mini,
                  borderColor: constThemeColor.outlineVariant,
                  //paddingHorizontal: Spacing.small,
                }}
              />
              {approvalError && !approver.length > 0 ? (
                <View style={reduxColors.errorBox}>
                  <Text style={reduxColors.errorMessage}>
                    {approvalErrorMessage}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={[reduxColors.destinationBox]}>
              <View
                style={[
                  reduxColors.reasonToMoveBox,
                  {
                    paddingVertical: Spacing.body,
                    paddingHorizontal: Spacing.body,
                    borderWidth: reasonToMove ? 1 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    reduxColors.animalTextStyle,
                    { paddingHorizontal: 0 },
                  ]}
                >
                  Reason to Move
                </Text>
                <TextInput
                  multiline
                  style={reduxColors.inputbox}
                  mode="outlined"
                  value={reasonToMove}
                  placeholder="Enter reason to move"
                  outlineStyle={{
                    borderRadius: Spacing.small,
                    backgroundColor: constThemeColor.notes,
                  }}
                  onChangeText={(e) => setReasonToMove(e)}
                />
              </View>
            </View>

            {/* <View style={reduxColors.destinationBox}>
              <TouchableOpacity
                onPress={() => gotoApprovalScreen(user, true)}
                style={[
                  reduxColors.animalCardStyle,
                  {
                    //minHeight: heightPercentageToDP(14),
                    //marginBottom: 100,
                    borderWidth: 1,
                    paddingTop: Spacing.body,
                  },
                ]}
              >
                <Text
                  style={[reduxColors.animalTextStyle]}
                >
                  Requested by
                </Text>
                <View >
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={requestBy}
                    renderItem={({ item }) => {
                      return (
                        <RequestBy
                          svgUri={true}
                          middleSection={
                            <View>
                              <Text
                                style={{
                                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                                  fontWeight:
                                    FontSize.Antz_Minor_Title.fontWeight,
                                  color: constThemeColor.onPrimaryContainer,
                                  // marginBottom: 8,
                                }}
                              >
                                {isRequestBy
                                  ? item.user_name
                                  : item.user_first_name}
                              </Text>
                              <Text
                                style={{
                                  fontSize: FontSize.Antz_Body_Regular.fontSize,
                                  fontWeight:
                                    FontSize.Antz_Body_Regular.fontWeight,
                                  color: constThemeColor.onPrimaryContainer,
                                }}
                              >
                                User type -{" "}
                                {isRequestBy && item.designation
                                  ? item.designation
                                  : "NA"}
                              </Text>
                            </View>
                          }
                          rightSectoon={
                            <View
                              style={
                                {
                                  // marginHorizontal: widthPercentageToDP(3),
                                }
                              }
                            >
                              <MaterialIcons
                                name="keyboard-arrow-right"
                                size={24}
                                color={constThemeColor.onSurfaceVariant}
                              />
                            </View>
                          }
                        />
                      );
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View> */}
            <View style={[reduxColors.animalBox]}>
              <InchargeCard
                customStyle={reduxColors.inchargeCardCustom}
                navigation={() => gotoApprovalScreen(user, true)}
                title={"Requested by"}
                selectedUserData={requestBy}
                outerStyle={{
                  borderWidth: approverList?.length > 1,
                  borderRadius: Spacing.small,
                  backgroundColor: constThemeColor.surface,
                  borderColor: constThemeColor.outlineVariant,
                  borderWidth: 1,
                  // paddingHorizontal: widthPercentageToDP(3),
                }}
              />
            </View>
          </View>
          {/* <DynamicAlert
            isVisible={isVisible}
            onClose={hideAlert}
            type={alertType}
            title={alertType === "success" ? "Success" : "Error"}
            message={alertMessage}
            onOK={handleOK}
            // isCancelButton={alertType === "success" ? true : false}
            onCancel={handleCancel}
          /> */}
        </View>
      </ScrollView>
      <View style={reduxColors.footerStyle}>
        <SubmitBtn
          onPress={submitMoveRequest}
          // onPress={() => navigation.navigate("TransferCheckList")}
          buttonText={"Submit Request"}
        />
      </View>
    </>
  );
};

export default AnimalMovement;
const styles = (reduxColors) =>
  StyleSheet.create({
    inchargeCardCustom: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurface,
    },
    mainContainer: {
      justifyContent: "space-between",
      flexDirection: "column",
      paddingHorizontal: Spacing.minor,
      paddingTop: Spacing.minor,
    },
    conatiner: {
      flex: 1,
      alignItems: "center",
      backgroundColor: reduxColors.onPrimary,
      //paddingHorizontal: Spacing.minor,
      //paddingTop: Spacing.minor,
      //gap: 16,
    },
    animalBox: {
      // marginTop: heightPercentageToDP(2.5),
      width: "100%",
      marginVertical: Spacing.small,
    },
    destinationBox: {
      // marginTop: heightPercentageToDP(2),
      width: "100%",
      marginVertical: Spacing.small,
    },
    animalText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontSize,
      color: reduxColors.neutralPrimary,
      //paddingLeft: widthPercentageToDP(2),
    },

    animalCardStyle: {
      justifyContent: "center",
      //width: widthPercentageToDP(90),
      borderWidth: 1,
      borderRadius: Spacing.small,
      borderColor: reduxColors.outlineVariant,
      backgroundColor: reduxColors.surface,
    },
    reasonToMoveBox: {
      justifyContent: "center",
      //width: widthPercentageToDP(90),
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
      borderRadius: Spacing.small,
      // minHeight: heightPercentageToDP(13),
      backgroundColor: reduxColors.surface,
    },
    requestedByBox: {
      justifyContent: "flex-start",
      alignItems: "center",
      width: widthPercentageToDP(90),
      borderWidth: 0.25,
      borderRadius: 6,
      borderColor: reduxColors.outlineVariant,
      height: "auto",
      backgroundColor: reduxColors.surface,
    },

    animalTextStyle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurface,
      // paddingLeft: widthPercentageToDP(5),
      paddingHorizontal: Spacing.body,
    },
    animalTextStyles: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurface,
      paddingLeft: widthPercentageToDP(5),
      paddingTop: heightPercentageToDP(1),
    },

    headerTitle: {
      fontSize: FontSize.Antz_Major,
      color: reduxColors.titleName,
      textAlign: "center",
    },
    inputbox: {
      //width: widthPercentageToDP(80),
      width: "100%",
      alignSelf: "center",
      color: reduxColors.error,
      marginTop: Spacing.body,
    },
    cardstyle: {
      backgroundColor: reduxColors.surface,
      borderRadius: widthPercentageToDP("3%"),
      marginVertical: widthPercentageToDP("2%"),
      flexDirection: "row",
      paddingHorizontal: Spacing.micro + Spacing.small,
      paddingVertical: Spacing.small,
      width: widthPercentageToDP(80),
    },
    cardstyle2: {
      backgroundColor: reduxColors.onPrimary,
      borderRadius: widthPercentageToDP("2%"),
      marginVertical: widthPercentageToDP("2%"),
      elevation: 1, // for shadow on Android
      shadowColor: reduxColors.neutralPrimary, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 1,
      flexDirection: "row",
      paddingHorizontal: Spacing.micro + Spacing.small,
      paddingVertical: Spacing.micro + Spacing.small,
    },
    mainTag: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: widthPercentageToDP(20),
      height: heightPercentageToDP(4),
    },
    tagscontainerM: {
      width: widthPercentageToDP(6),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.surfaceVariant,
      borderRadius: 5,
      marginLeft: widthPercentageToDP(1.2),
      justifyContent: "center",
    },
    tagscontainerB: {
      width: widthPercentageToDP(6),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.secondary,
      borderRadius: 5,

      justifyContent: "center",
    },
    errorBox: {
      textAlign: "left",
      width: "100%",
      marginTop: Spacing.micro,
    },
    errorMessage: {
      color: reduxColors.error,
    },
    footerStyle: {
      width: "100%",
      paddingHorizontal: Spacing.body,
      paddingBottom: Spacing.body,
      backgroundColor: reduxColors.onPrimary,
    },
  });
