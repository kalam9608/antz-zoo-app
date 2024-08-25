import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  View,
  RefreshControl,
  Platform,
  UIManager,
  BackHandler,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";
import { TextInput as TextInputPaper } from "react-native-paper";
import {
  AntDesign,
  Entypo,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import Spacing from "../../configs/Spacing";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontSize from "../../configs/FontSize";
import startSvg from "../../assets/start.svg";
import line_end_square_white from "../../assets/line_end_square_white.svg";
import { SvgXml } from "react-native-svg";
import SpeciesCustomCard from "../../components/SpeciesCustomCard";
import { Divider } from "react-native-paper";
import {
  ShortFullName,
  capitalize,
  contactFun,
  opacityColor,
} from "../../utils/Utils";
import { Image } from "react-native";
import { ScrollView } from "react-native";
import Modal from "react-native-modal";
import {
  addTransferComments,
  animalListBySpecies,
  approvalSummary,
  approveTransferRequest,
  btnStatusForTransfer,
  checkListDataFetch,
  checkedDataFetch,
  getTransferLog,
  getTransferMembers,
  rejectAndResetRequest,
  updateTransferStatus,
} from "../../services/Animal_movement_service/MoveAnimalService";
import moment from "moment";
import Loader from "../../components/Loader";
import ImageComponent from "../../components/ImageComponent";
import { useToast } from "../../configs/ToastConfig";
import SummaryHeader from "../../components/SummaryHeader";
import FixBottomSheetComponent from "../../components/FixBottomSheetComponent";
import BottomsheetTransferBtns from "./BottomsheetTransferBtns";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import CustomBottomSheet from "../../components/Transfer/CustomBottomSheet";
import line_start_circle from "../../assets/line_start_circle.svg";
import line_end_square from "../../assets/line_end_square.svg";
import move_down from "../../assets/move_down.svg";
import { widthPercentageToDP } from "react-native-responsive-screen";

const ApprovalSummary = (props) => {
  const [comment, setComment] = useState("");
  const [summaryDetails, setSummaryDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [commentCount, setCommentCount] = useState(3);
  const [allAnimalList, setAllAnimalList] = useState([]);
  const [allAnimalCount, setAllAnimalCount] = useState(0);
  const [animal_movement_id] = useState(
    props?.route?.params?.animal_movement_id
  );
  const [site_id] = useState(props?.route?.params?.site_id);
  const [memberList, setMemberList] = useState([]);
  const [memberCount, setMemberCount] = useState(0);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const navigation = useNavigation();
  const animalSheetRef = useRef(null);
  const memberSheetRef = useRef(null);
  const [AnimalModalView, setAnimalModalView] = useState(false);
  const [MemberModalView, setMemberModalView] = useState(false);
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const [allButtonStatus, setAllButtonStatus] = useState({});
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const userDetails = useSelector((state) => state.UserAuth?.userDetails);
  const [optionData] = useState([
    {
      id: 1,
      option: <Text>Cancel Transfer</Text>,
    },
  ]);
  const [approveRecord, setApproveRecord] = useState({});
  const [tempRecord, setTempRecord] = useState({});
  const [loadAnimalRecord, setLoadAnimalRecord] = useState({});
  const [reLoadAnimalRecord, setReLoadAnimalRecord] = useState({});
  const [rideStartRecord, setRideStartRecord] = useState({});
  const [checkoutDenyRecord, setCheckoutDenyRecord] = useState({});
  const [checkoutAllowRecord, setCheckoutAllowRecord] = useState({});
  const [checkInDenyRecord, setCheckInDenyRecord] = useState({});
  const [checkInAllowRecord, setCheckInAllowRecord] = useState({});
  const [reachDestinationRecord, setReachDestinationRecord] = useState({});
  const [approveEntryRecord, setApproveEntryRecord] = useState({});
  const [destinationVehicle, setdestinationVehicle] = useState({});
  const [allocationComplete, setAllocationComplete] = useState({});
  const [trasferComplete, setTrasferComplete] = useState({});
  const [allowEntryRecord, setAllowEntryRecord] = useState({});
  const [created, setCreated] = useState(false);
  const [transferActivityStatus, setTransferActivityStatus] = useState("");
  const [seeAllLogs, setSeeAllLog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [checkListData, setCheckListData] = useState([]);
  const [listDataArray, setListDataArray] = useState([]);
  const [recentLog, setRecentLog] = useState({});
  const [transferLogs, setTransferLogs] = useState([]);
  const activeItems = listDataArray.filter((item) => item.active === true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);
  let textInputRef = useRef(null);
  const [scrollComment, setScrollComment] = useState(false);
  const scrollRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      checklistApi();
      getApprovalSummary();
      return () => {};
    }, [created, animal_movement_id])
  );
  const handleCheckBox = (itemData) => {
    const mapData = itemData?.map((item, i) => {
      if (item?.sub_category) {
        return {
          ...item,
          active: item?.sub_category?.some((p) =>
            p?.items?.some((v) => v.value)
          ),
          sub_category: item?.sub_category?.map((value) => {
            return {
              ...value,
              active: value?.items?.some((v) => v.value),
            };
          }),
        };
      } else if (item?.items) {
        return {
          ...item,
          active: item?.items?.some((v) => v.value),
        };
      }
    });
    setListDataArray(mapData);
  };

  const checklistApi = () => {
    Promise.all([
      checkListDataFetch(),
      checkedDataFetch({
        animal_movement_id: animal_movement_id,
      }),
    ])
      .then((res) => {
        const jsonData = res[0].data;
        setCheckListData(jsonData);
        const checkedData = res[1]?.data || [];

        const findCheckedValueByKey = (key) => {
          for (const checkedItem of checkedData) {
            if (checkedItem.key === key) {
              return checkedItem.value;
            }
          }
          return null;
        };

        jsonData.forEach((category) => {
          if (category.sub_category) {
            category.sub_category.forEach((subCategory) => {
              if (subCategory.items) {
                subCategory.items.forEach((item) => {
                  const checkedValue = findCheckedValueByKey(item?.key);
                  if (checkedValue !== null) {
                    item.value = checkedValue;
                  }
                });
              }
            });
          } else if (category.items) {
            category.items.forEach((item) => {
              const checkedValue = findCheckedValueByKey(item?.key);
              if (checkedValue !== null) {
                item.value = checkedValue;
              }
            });
          }
        });

        handleCheckBox(jsonData);
      })
      .catch((e) => {
        console.log("==================", e);
      })
      .finally(() => {});
  };

  // const handleCheckBox = (itemData) => {
  //   const mapData = itemData?.map((item, i) => {
  //     if (item?.sub_category) {
  //       return {
  //         ...item,
  //         active: item?.sub_category?.find((p) =>
  //           p?.items?.find((v) => v.value) ? true : false
  //         )
  //           ? true
  //           : false,
  //         sub_category: item?.sub_category?.map((value) => {
  //           return {
  //             ...value,
  //             active: value?.items?.find((v) => v.value) ? true : false,
  //           };
  //         }),
  //       };
  //     } else if (item?.items) {
  //       return {
  //         ...item,
  //         active: item?.items?.find((v) => v.value) ? true : false,
  //       };
  //     }
  //   });
  //   setListDataArray(mapData);
  // };

  // const checklistApi = () => {
  //   Promise.all([
  //     checkListDataFetch(),
  //     checkedDataFetch({
  //       animal_movement_id: animal_movement_id,
  //     }),
  //   ])
  //     .then((res) => {
  //       const jsonData = res[0].data;
  //       setCheckListData(jsonData);
  //       const checkedData = res[1]?.data;
  //       jsonData.forEach((category) => {
  //         if (category.sub_category) {
  //           category.sub_category.forEach((subCategory) => {
  //             if (subCategory.items) {
  //               let itemStatus = false;
  //               subCategory.items.forEach((item) => {
  //                 const itemFind = checkedData?.find((p) => p.key == item?.key);

  //                 if (item.type === "checkbox") {
  //                   item.value = itemFind?.value ? true : false;
  //                   if (itemFind?.value) {
  //                     itemStatus = true;
  //                   }
  //                 } else if (item.type === "textbox") {
  //                   item.value = itemFind?.value ?? "";
  //                 }
  //               });
  //             }
  //           });
  //         } else if (category.items) {
  //           category.items.forEach((item) => {
  //             const itemFind = checkedData?.find((p) => p.key == item?.key);
  //             if (item.type === "checkbox") {
  //               item.value = itemFind?.value
  //                 ? Boolean(Number(itemFind?.value))
  //                 : false;
  //             } else if (item.type === "textbox") {
  //               item.value = itemFind?.value ?? "";
  //             } else if (item.type === "multi_line_textbox") {
  //               item.value = itemFind?.value ?? "";
  //             }
  //           });
  //         }
  //       });
  //       handleCheckBox(jsonData);
  //     })
  //     .catch((e) => {
  //       console.log("==================", e);
  //     })
  //     .finally(() => {
  //       // setLoading(false);
  //     });
  // };

  const onRefresh = async () => {
    // setRefreshing(true);
    getBtnStatus();
    getAnimalTransferLog();
    getApprovalSummary();
    checklistApi();
  };
  function hasValueOneExceptShowActivity(buttonStatus) {
    for (const key in buttonStatus) {
      if (
        key !== "show_transfer_member_activity" &&
        key !== "show_cancel_request_button" &&
        key !== "show_checklist_button" &&
        buttonStatus[key] === 1
      ) {
        return true;
      }
    }
    return false;
  }

  const result = hasValueOneExceptShowActivity(allButtonStatus);

  //Function for Call
  const handleCall = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("tel", phoneNumber);
    }
  };
  //Function for  Message
  const handleMessage = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("sms", phoneNumber);
    }
  };
  // useEffect(() => {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  // }, [showMore]);

  const updateTransferActivity = (e) => {
    let requestObj = {};
    if (e.status === "CHECKED_TEMPERATURE") {
      requestObj.status = e.status;
      requestObj.movement_id = animal_movement_id;
      requestObj.temperature_value = e.temperature_value;
      requestObj.temperature_unit = e.temperature_unit;
    }
    if (e.status == "CANCELED") {
      requestObj.status = e.status;
      requestObj.movement_id = animal_movement_id;
      requestObj.comments = cancelReason;
    }
    if (e.status == "REACHED_DESTINATION") {
      requestObj.status = e.status;
      requestObj.movement_id = animal_movement_id;
    }
    if (e.status == "COMPLETE") {
      requestObj.status = e.status;
      requestObj.movement_id = animal_movement_id;
    }
    if (e.status == "RIDE_STARTED") {
      requestObj.status = e.status;
      requestObj.movement_id = animal_movement_id;
    }
    if (e.status == "APPROVE_ENTRY") {
      requestObj.status = e.status;
      requestObj.movement_id = animal_movement_id;
      requestObj.comments = e.comments;
    }
    if (e.status == "RELOADED_ANIMALS") {
      requestObj.status = e.status;
      requestObj.movement_id = animal_movement_id;
    }
    if (e.status == "ALLOW_ENTRY") {
      requestObj.status = e.status;
      requestObj.movement_id = animal_movement_id;
    }
    updateTransferStatus(requestObj)
      .then((res) => {
        if (e.status == "APPROVE_ENTRY") {
          setSeeAllLog(true);
        }
        if (e.status == "CANCELED") {
          setSeeAllLog(false);
        }
        if (
          e.status == "RIDE_STARTED" &&
          (summaryDetails?.transfer_details?.transfer_type == "inter" ||
            summaryDetails?.transfer_details?.transfer_type == "external")
        ) {
          navigation.navigate("TransferQR", {
            qrUrl: summaryDetails?.transfer_details?.qr_code_full_path,
            id: summaryDetails?.transfer_details?.request_id,
            animalMovementId: animal_movement_id,
            screen: props?.route?.params?.screen,
          });
        }
      })
      .catch((e) => {
        console.log("err", e);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
        getApprovalSummary();
        getBtnStatus();
        setCancelReason("");
        setShowCancelModal(false);
        // getAnimalTransferLog();
      });
  };

  const getApprovalSummary = () => {
    let summaryObj = {
      animal_movement_id: animal_movement_id,
    };
    if (props?.route?.params?.screen == "qr") {
      summaryObj.type = "qr";
    }
    approvalSummary(summaryObj)
      .then((res) => {
        if (res?.success) {
          setSummaryDetails(res?.data);
          setCreated(
            res?.data?.transfer_details?.qr_code_full_path ? true : false
          );
          setComment("");
          setTransferActivityStatus(
            res?.data?.transfer_details?.activity_status
          );
          getBtnStatus(
            res?.data?.transfer_details?.qr_code_full_path ? true : false
          );
          getAnimalTransferLog(
            res?.data?.transfer_details?.transfer_type,
            res?.data?.approval_list[0] !== undefined &&
              res?.data?.approval_list[0].status === "APPROVED"
              ? true
              : false,
            res?.data?.approval_list[0]?.source_action_date
          );
        } else if (!res?.success && props?.route?.params?.screen == "qr") {
          errorToast("Error", res?.messagee);
          navigation.navigate("Home");
        }
      })
      .catch((e) => {
        console.log("err", e);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const getBtnStatus = (isQr) => {
    setIsLoading(true);
    let obj = {
      animal_movement_id: animal_movement_id?.toString(),
      site_id: site_id?.toString(),
    };
    if (props?.route?.params?.reference) {
      obj.reference = "list";
    }
    if (created || isQr) {
      obj.type = "other";
    }
    btnStatusForTransfer(obj)
      .then((res) => {
        if (res?.success) {
          setAllButtonStatus(res?.data);
        } else {
          errorToast("Error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((e) => {
        console.log("err", e);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };
  const markObjectsWithDateChange = (arr) => {
    let previousDate = "";

    arr.forEach((obj, index) => {
      obj.date_changed = false;
      if (index !== 0) {
        const currentDate = obj.commented_on;
        if (currentDate.substring(0, 10) !== previousDate.substring(0, 10)) {
          obj.date_changed = true;
        }
      }
      previousDate = obj.commented_on;
    });

    return arr;
  };

  const getAnimalTransferLog = (transfer_type, approved, commented_on) => {
    setIsLoading(true);
    getTransferLog(animal_movement_id?.toString())
      .then((res) => {
        let logs = [];

        if (transfer_type === "intra" && approved) {
          const obj = {
            status: "APPROVED",
            comments: "Approved",
            commented_on: commented_on,
          };
          setApproveRecord(obj);
          logs = [obj, ...(res?.data?.logs ?? [])];
        } else {
          logs = res?.data?.logs;
        }

        setTransferLogs(logs);
        setRecentLog(logs[logs?.length - 1]);
        let updatedLog = markObjectsWithDateChange(logs);

        if (res?.success === true) {
          // let logs = res?.data?.logs;
          for (let index = 0; index < updatedLog?.length; index++) {
            if (updatedLog[index].status === "CHECKED_TEMPERATURE") {
              setTempRecord(updatedLog[index]);
            }
            if (updatedLog[index].status === "LOADED_ANIMALS") {
              setLoadAnimalRecord(updatedLog[index]);
            }
            if (updatedLog[index].status === "RELOADED_ANIMALS") {
              setReLoadAnimalRecord(updatedLog[index]);
            }
            if (updatedLog[index].status === "RIDE_STARTED") {
              setRideStartRecord(updatedLog[index]);
            }
            if (updatedLog[index].status === "SECURITY_CHECKOUT_DENIED") {
              setCheckoutDenyRecord(updatedLog[index]);
            }
            if (updatedLog[index].status === "SECURITY_CHECKOUT_ALLOWED") {
              setCheckoutAllowRecord(updatedLog[index]);
            }
            if (updatedLog[index].status === "SECURITY_CHECKIN_DENIED") {
              setCheckInDenyRecord(updatedLog[index]);
            }
            if (logs[index].status === "SECURITY_CHECKIN_ALLOWED") {
              setCheckInAllowRecord(logs[index]);
            }
            if (updatedLog[index].status === "REACHED_DESTINATION") {
              setReachDestinationRecord(updatedLog[index]);
            }
            if (updatedLog[index].status === "APPROVE_ENTRY") {
              setApproveEntryRecord(updatedLog[index]);
            }
            if (updatedLog[index].status === "ALLOW_ENTRY") {
              setAllowEntryRecord(updatedLog[index]);
            }
            if (updatedLog[index].status === "DESTINATION_VEHICLE_ARRIVED") {
              setdestinationVehicle(updatedLog[index]);
            }
            // ALLOCATION_COMPLETED
            if (updatedLog[index].status === "ALLOCATION_COMPLETED") {
              setAllocationComplete(updatedLog[index]);
            }
            if (updatedLog[index].status === "COMPLETED") {
              setTrasferComplete(updatedLog[index]);
            }
          }
        }
      })
      .catch((e) => {
        console.log("err", e);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };
  const getMembarList = () => {
    setIsLoading(true);
    getTransferMembers({
      animal_movement_id: animal_movement_id,
    })
      .then((res) => {
        if (res?.success) {
          setMemberList(res.data.user_details);
          memberSheetRef.current.present();
          setMemberModalView(true);
        } else {
          errorToast("Error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((e) => {
        console.log("err", e);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const openMemberSheet = () => {
    getMembarList();
  };
  const closeMemberSheet = () => {
    memberSheetRef.current.close();
    setMemberModalView(false);
  };

  const openAnimalSheet = () => {
    fetchAllAnimal();
  };
  const closeAnimalSheet = () => {
    animalSheetRef.current.close();
    setAnimalModalView(false);
  };

  const fetchAllAnimal = () => {
    setIsLoading(true);
    animalListBySpecies({
      animal_movement_id: animal_movement_id,
    })
      .then((res) => {
        if (res?.success) {
          setAllAnimalList(res.data.result);
          setAllAnimalCount(res.data.total_animal_count);
          animalSheetRef.current.present();
          setAnimalModalView(true);
        } else {
          errorToast("Error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        errorToast("Error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const addComment = () => {
    setIsLoading(true);
    const obj = {
      animal_movement_id: animal_movement_id,
      comments: comment,
      status: "COMMENT",
    };
    addTransferComments(obj)
      .then((res) => {
        if (res.success) {
          setScrollComment(true);
          successToast("success", res?.message);
          getApprovalSummary();
        } else {
          errorToast("Error", "Oops! ,Something went wrong!!");
          setIsLoading(false);
          setRefreshing(false);
        }
      })
      .catch((err) => {
        errorToast("Error", "Oops! ,Something went wrong!!");
        setIsLoading(false);
        setRefreshing(false);
        toggleModal();
      })
      .finally(() => {
        setScrollComment(false);
      });
    toggleModal();
  };
  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTo({ y: 320, animated: true });
    }
  }, [scrollComment]);
  const handleApproveTransferRequest = () => {
    setIsLoading(true);
    const obj = {
      animal_movement_id: animal_movement_id,
    };
    approveTransferRequest(obj)
      .then((res) => {
        if (res.success) {
          successToast("success", res?.message);
        } else {
          successToast("success", res?.message);
          setIsLoading(false);
          setRefreshing(false);
        }
      })
      .catch((err) => {
        console.log(err);
        errorToast("Error", "Oops! ,Something went wrong!!");
        setIsLoading(false);
        setRefreshing(false);
      })
      .finally(() => {
        getApprovalSummary();
        getBtnStatus();
        // getAnimalTransferLog();
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const rejectAndResetTransferRequest = (e) => {
    setIsLoading(true);
    const obj = {};
    if (e.activity_status === "PENDING") {
      obj.animal_movement_id = animal_movement_id;
      obj.transfer_status = "PENDING";
      obj.activity_status = "PENDING";
    }
    if (e.activity_status === "REJECTED") {
      obj.animal_movement_id = animal_movement_id;
      obj.transfer_status = "REJECTED";
      obj.activity_status = "REJECTED";
      obj.comments = e.comment;
    }
    rejectAndResetRequest(obj)
      .then((res) => {
        if (res.success) {
          successToast(
            "success",
            res?.message ?? e.activity_status === "PENDING"
              ? "Transfer request is revoked successfully"
              : "Transfer request is rejected successfully"
          );
        } else {
          successToast("success", res?.message);
          setIsLoading(false);
          setRefreshing(false);
        }
      })
      .catch((err) => {
        console.log(err);
        errorToast("Error", "Oops! ,Something went wrong!!");
        setIsLoading(false);
        setRefreshing(false);
      })
      .finally(() => {
        getApprovalSummary();
        getBtnStatus();
        // getAnimalTransferLog();
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const backgroundCheck = (type) => {
    if (type == "PENDING" || type == "COMMENT" || !type) {
      return constThemeColor?.notes;
    }
    if (type == "REVOKED") {
      return opacityColor(constThemeColor?.neutralPrimary, 5);
    }
    if (type == "APPROVED") {
      return constThemeColor?.onBackground;
    }
    if (type == "REJECTED") {
      return constThemeColor?.errorContainer;
    } else {
      return opacityColor(constThemeColor?.neutralPrimary, 5);
    }
  };
  const textColorCheck = (type) => {
    if (type == "PENDING" || type == "COMMENT" || !type) {
      return constThemeColor?.onTertiaryContainer;
    }
    if (type == "REVOKED") {
      return opacityColor(constThemeColor?.neutralPrimary, 5);
    }
    if (type == "APPROVED") {
      return constThemeColor?.onSurface;
    }
    if (type == "REJECTED") {
      return constThemeColor?.error;
    }
  };
  const handleSeeAllLogs = () => {
    // setSeeAllLog(!seeAllLogs);
    toggleView();
  };

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const toggleView = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSeeAllLog(!seeAllLogs);
  };
  const headetTitle =
    summaryDetails?.transfer_details?.transfer_type == "inter"
      ? "Inter-site Transfer"
      : summaryDetails?.transfer_details?.transfer_type == "intra"
      ? "In-house Transfer"
      : "External Transfer";

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleButtonPress = () => {
    toggleModal();
  };
  const transferAnimalCountCheck = (total_count, transferred_count) => {
    if (
      parseInt(transferred_count) >= parseInt(total_count) ||
      parseInt(transferred_count) == 0
    ) {
      return `${total_count}`;
    } else {
      return `${transferred_count}/${total_count}`;
    }
  };
  const getStatus = () => {
    const rejectedCount = summaryDetails?.approval_list?.filter(
      (item) => item.status === "REJECTED"
    ).length;
    const canceledCount = summaryDetails?.approval_list?.filter(
      (item) => item.status === "CANCELED"
    ).length;
    if (rejectedCount > 0 || canceledCount > 0) {
      if (rejectedCount > 0) {
        return "Approval Rejected";
      } else {
        return "Canceled by";
      }
    } else {
      const approvedCount = summaryDetails?.approval_list?.filter(
        (item) => item.status === "APPROVED"
      ).length;

      if (approvedCount > 1) {
        return "Approved by";
      } else if (approvedCount === 1) {
        if (
          summaryDetails?.transfer_details?.transfer_type == "intra" ||
          summaryDetails?.transfer_details?.transfer_type == "external" ||
          (summaryDetails?.transfer_details?.transfer_type == "inter" &&
            summaryDetails?.approval_list[0].destination_site == 1 &&
            summaryDetails?.approval_list[0].source_site == 1)
        ) {
          return "Approved by";
        } else {
          return "Awaiting Approval";
        }
      } else {
        return "Awaiting Approval";
      }
    }
  };
  const getColor = (constThemeColor) => {
    const rejectedCount = summaryDetails?.approval_list?.filter(
      (item) => item.status === "REJECTED"
    ).length;

    if (rejectedCount > 0) {
      return constThemeColor?.moderateSecondary;
    } else {
      const approvedCount = summaryDetails?.approval_list?.filter(
        (item) => item.status === "APPROVED"
      ).length;

      if (approvedCount > 1) {
        return constThemeColor?.onSurface;
      } else if (approvedCount === 1) {
        if (
          summaryDetails?.transfer_details?.transfer_type == "intra" ||
          summaryDetails?.transfer_details?.transfer_type == "external" ||
          (summaryDetails?.transfer_details?.transfer_type == "inter" &&
            summaryDetails?.approval_list[0].destination_site == 1 &&
            summaryDetails?.approval_list[0].source_site == 1)
        ) {
          return constThemeColor?.onSurface;
        } else {
          return constThemeColor?.moderateSecondary;
        }
      } else {
        return constThemeColor?.moderateSecondary;
      }
    }
  };
  // console.log({
  //   summaryDetails: JSON.stringify(summaryDetails?.transfer_details),
  // });
  useEffect(() => {
    const backAction = () => {
      if (AnimalModalView || MemberModalView) {
        closeAnimalSheet();
        closeMemberSheet();
      } else {
        if (props?.route?.params?.screen == "site") {
          navigation.goBack();
        } else if (
          props?.route?.params?.screen == "qr" ||
          props?.route?.params?.screen == "home"
        ) {
          navigation.navigate("Home");
        } else if (props?.route?.params?.screen == "without_qr") {
          navigation.goBack();
        } else {
          navigation.navigate("siteDetails", {
            id: summaryDetails?.transfer_details?.source_site_id,
            mainScreen: "animalTransfers",
            subScreen: summaryDetails?.transfer_details?.transfer_type,
          });
        }
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [navigation, AnimalModalView, MemberModalView]);

  const navigateTo = () => {
    if (activeItems?.length > 0) {
      navigation.navigate("TransferCheckListSummary", {
        animalMovementId: animal_movement_id,
        checklistData: checkListData,
        qrUrl: summaryDetails?.transfer_details?.qr_code_full_path,
        id: summaryDetails?.transfer_details?.request_id,
        requestId: summaryDetails?.transfer_details?.request_id,
        screen: props?.route?.params?.screen,
        qrGenerated: created,
        edit:
          ((summaryDetails?.edit_check_list &&
            summaryDetails?.edit_check_list == true) ||
            UserId == summaryDetails?.transfer_details?.user_id) &&
          Object.keys(checkInAllowRecord).length == 0
            ? true
            : false,
      });
    } else if (
      UserId == summaryDetails?.transfer_details?.user_id ||
      summaryDetails?.edit_check_list == true
    ) {
      navigation.navigate("TransferCheckList", {
        animalMovementId: animal_movement_id,
        checklistData: checkListData,
        qrUrl: summaryDetails?.transfer_details?.qr_code_full_path,
        id: summaryDetails?.transfer_details?.request_id,
        requestId: summaryDetails?.transfer_details?.request_id,
        screen: props?.route?.params?.screen,
        qrGenerated: created,
        edit:
          ((summaryDetails?.edit_check_list &&
            summaryDetails?.edit_check_list == true) ||
            UserId == summaryDetails?.transfer_details?.user_id) &&
          Object.keys(checkInAllowRecord).length == 0
            ? true
            : false,
      });
    } else {
      console.log("----------------no navigation---------------");
    }
  };
  const headerCheck =
    summaryDetails?.transfer_details?.transfer_type == "inter" ||
    summaryDetails?.transfer_details?.transfer_type == "external"
      ? created && Object.keys(rideStartRecord).length > 0
        ? true
        : false
      : created
      ? true
      : false;
  return (
    <>
      <View
        style={{
          backgroundColor: opacityColor(constThemeColor?.surfaceVariant, 30),
          flex: 1,
        }}
      >
        <Loader visible={isLoading} />
        <View
          style={{
            backgroundColor: headerCheck
              ? constThemeColor.onPrimaryContainer
              : constThemeColor?.onPrimary,
            paddingBottom: Spacing.body,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.15,
            shadowRadius: 2.5,
            zIndex: 999,
            elevation: 3,
          }}
        >
          <SummaryHeader
            title={summaryDetails?.transfer_details?.request_id.toUpperCase()}
            hideMenu={!allButtonStatus?.show_cancel_request_button}
            deleteMedical={true}
            optionData={optionData}
            onPressBack={() => {
              if (props?.route?.params?.screen == "site") {
                navigation.goBack();
              } else if (
                props?.route?.params?.screen == "qr" ||
                props?.route?.params?.screen == "home"
              ) {
                navigation.navigate("Home");
              } else {
                navigation.navigate("siteDetails", {
                  id: summaryDetails?.transfer_details?.source_site_id,
                  mainScreen: "animalTransfers",
                  subScreen: summaryDetails?.transfer_details?.transfer_type,
                });
              }
            }}
            style={{
              backgroundColor: headerCheck
                ? constThemeColor.onPrimaryContainer
                : constThemeColor?.onPrimary,
            }}
            deleteMedicalFun={() => setShowCancelModal(true)}
            backPressButton={headerCheck ? true : false}
            styleText={{ alignItems: "center", justifyContent: "center" }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: Spacing.minor,
              backgroundColor: headerCheck
                ? constThemeColor.onPrimaryContainer
                : constThemeColor?.onPrimary,
            }}
          >
            <View style={{}}>
              <View style={{}}>
                <Text
                  style={{
                    ...FontSize.Antz_Minor_Medium,
                    color: headerCheck
                      ? constThemeColor.onPrimary
                      : constThemeColor?.onPrimaryContainer,
                  }}
                >
                  {headetTitle}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: Spacing.small - 2,
                  }}
                >
                  {summaryDetails?.transfer_details?.transfer_type ==
                  "intra" ? null : (
                    <SvgXml
                      xml={line_start_circle}
                      width="16"
                      height="8"
                      style={{ marginRight: Spacing.mini + 2 }}
                    />
                  )}
                  <Text
                    style={{
                      ...FontSize.Antz_Minor_Title,
                      color: headerCheck
                        ? constThemeColor.onPrimary
                        : constThemeColor?.onPrimaryContainer,
                    }}
                  >
                    {summaryDetails?.transfer_details?.source_site_name}
                  </Text>
                </View>
                {summaryDetails?.transfer_details?.transfer_type ==
                "intra" ? null : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <SvgXml
                      xml={line_end_square}
                      width="16"
                      height="8"
                      style={{ marginRight: Spacing.mini + 2 }}
                    />

                    <Text
                      style={{
                        ...FontSize.Antz_Minor_Title,
                        color: headerCheck
                          ? constThemeColor.onPrimary
                          : constThemeColor?.onPrimaryContainer,
                      }}
                    >
                      {summaryDetails?.transfer_details?.destination_name}
                    </Text>
                  </View>
                )}
                {headerCheck ? (
                  <View
                    style={[
                      reduxColors?.date,
                      FontSize.Antz_Subtext_title,
                      {
                        marginTop:
                          summaryDetails?.transfer_details?.transfer_type ==
                          "intra"
                            ? null
                            : Spacing.small,
                        flexDirection: "row",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        reduxColors?.date,
                        {
                          color: headerCheck
                            ? constThemeColor.onPrimary
                            : constThemeColor?.neutralSecondary,
                        },
                      ]}
                    >
                      {moment(
                        summaryDetails?.transfer_details?.requested_on
                      ).format("D MMM YYYY")}
                    </Text>
                    <Text
                      style={{
                        paddingHorizontal: Spacing.mini,
                        color: headerCheck
                          ? constThemeColor.onPrimary
                          : constThemeColor?.neutralSecondary,
                      }}
                    >
                      •
                    </Text>

                    <Text
                      style={[
                        reduxColors?.date,
                        {
                          color: headerCheck
                            ? constThemeColor.onPrimary
                            : constThemeColor?.neutralSecondary,
                        },
                      ]}
                    >
                      {moment(
                        summaryDetails?.transfer_details?.requested_on
                      ).format("h:mm A")}
                    </Text>
                  </View>
                ) : null}
                {headerCheck ? null : (
                  <View
                    style={[
                      reduxColors?.date,
                      FontSize.Antz_Subtext_title,
                      {
                        marginTop:
                          summaryDetails?.transfer_details?.transfer_type ==
                          "intra"
                            ? null
                            : Spacing.small,
                        flexDirection: "row",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        reduxColors?.date,
                        {
                          color: headerCheck
                            ? constThemeColor.onPrimary
                            : constThemeColor?.neutralSecondary,
                        },
                      ]}
                    >
                      {moment(
                        summaryDetails?.transfer_details?.requested_on
                      ).format("D MMM YYYY")}
                    </Text>
                    <Text
                      style={{
                        paddingHorizontal: Spacing.mini,
                        color: headerCheck
                          ? constThemeColor.onPrimary
                          : constThemeColor?.neutralSecondary,
                      }}
                    >
                      •
                    </Text>

                    <Text
                      style={[
                        reduxColors?.date,
                        {
                          color: headerCheck
                            ? constThemeColor.onPrimary
                            : constThemeColor?.neutralSecondary,
                        },
                      ]}
                    >
                      {moment(
                        summaryDetails?.transfer_details?.requested_on
                      ).format("h:mm A")}
                    </Text>
                  </View>
                )}
              </View>
              <View style={reduxColors?.requestByWrap}>
                <View style={reduxColors?.requestByInsideWrap}>
                  <View
                    style={{
                      backgroundColor: constThemeColor.secondary,
                      borderRadius: 50,
                      height: 32,
                      width: 32,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {summaryDetails?.transfer_details?.user_profile_pic ? (
                      <Image
                        source={{
                          uri: summaryDetails?.transfer_details
                            ?.user_profile_pic,
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 50,
                        }}
                      />
                    ) : (
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            ...FontSize.Antz_Body_Medium,
                            color: constThemeColor.onPrimary,
                          }}
                        >
                          {ShortFullName(
                            summaryDetails?.transfer_details?.user_first_name +
                              " " +
                              summaryDetails?.transfer_details?.user_last_name
                          )}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                      color: headerCheck
                        ? constThemeColor.onPrimary
                        : constThemeColor?.onPrimaryContainer,
                      marginLeft: Spacing.mini,
                    }}
                  >
                    {capitalize(
                      summaryDetails?.transfer_details?.user_first_name
                    )}{" "}
                    {capitalize(
                      summaryDetails?.transfer_details?.user_last_name
                    )}
                  </Text>
                </View>

                <>
                  <TouchableOpacity
                    onPress={() =>
                      handleCall(
                        summaryDetails?.transfer_details?.user_mobile_number
                      )
                    }
                    style={[
                      reduxColors?.call,
                      {
                        backgroundColor: headerCheck
                          ? opacityColor(constThemeColor.neutralPrimary, 40)
                          : opacityColor(constThemeColor.neutralPrimary, 5),
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="call"
                      size={18}
                      color={
                        headerCheck
                          ? constThemeColor.onPrimary
                          : constThemeColor?.onPrimaryContainer
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      handleMessage(
                        summaryDetails?.transfer_details?.user_mobile_number
                      )
                    }
                    style={[
                      reduxColors?.call,
                      {
                        marginLeft: Spacing.small,
                        backgroundColor: headerCheck
                          ? opacityColor(constThemeColor.neutralPrimary, 40)
                          : opacityColor(constThemeColor.neutralPrimary, 5),
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="message-text-outline"
                      size={18}
                      color={
                        headerCheck
                          ? constThemeColor.onPrimary
                          : constThemeColor?.onPrimaryContainer
                      }
                    />
                  </TouchableOpacity>
                </>
              </View>
            </View>
            {headerCheck ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("TransferQR", {
                    qrUrl: summaryDetails?.transfer_details?.qr_code_full_path,
                    id: summaryDetails?.transfer_details?.request_id,
                    animalMovementId: animal_movement_id,
                    screen: props?.route?.params?.screen,
                  })
                }
                style={{ position: "absolute", right: Spacing.small }}
              >
                <MaterialIcons
                  name="qr-code-2"
                  size={60}
                  color={constThemeColor?.onPrimary}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <ScrollView
          style={{}}
          contentContainerStyle={{ paddingBottom: Spacing.body }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ref={scrollRef}
        >
          {summaryDetails?.animal_details ? (
            <>
              <TouchableOpacity onPress={openAnimalSheet}>
                <View style={reduxColors.transferView}>
                  <View style={{ flexDirection: "row" }}>
                    <MaterialCommunityIcons
                      name="arrow-right-top"
                      size={21}
                      color={constThemeColor.editIconColor}
                    />
                    <View style={{ marginLeft: Spacing.body }}>
                      <Text
                        style={[
                          reduxColors?.cardCountANimal,
                          { ...FontSize.Antz_Subtext_Regular },
                        ]}
                      >
                        Transfer
                      </Text>
                      <Text style={reduxColors?.cardCountANimal}>
                        {transferAnimalCountCheck(
                          summaryDetails?.total_animal_count,
                          summaryDetails?.transferred_animal_count
                        )}{" "}
                        Animals
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={openAnimalSheet}>
                    <Text
                      style={{
                        ...FontSize.Antz_Body_Medium,
                        color: constThemeColor.onSurface,
                      }}
                    >
                      View
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <Divider />

              <View style={reduxColors.transferView}>
                <View style={{ flexDirection: "row" }}>
                  <AntDesign
                    name="questioncircle"
                    size={21}
                    color={constThemeColor.editIconColor}
                    style={{ paddingTop: Spacing.micro }}
                  />
                  <View style={{ marginLeft: Spacing.body, flex: 1 }}>
                    <Text
                      style={[
                        reduxColors?.cardCountANimal,
                        { ...FontSize.Antz_Subtext_Regular },
                      ]}
                    >
                      Reason for transfer
                    </Text>
                    <Text
                      style={[
                        reduxColors?.cardCountANimal,
                        { ...FontSize.Antz_Body_Medium },
                      ]}
                    >
                      {summaryDetails?.transfer_details?.reason}
                    </Text>
                  </View>
                </View>
              </View>
              {summaryDetails?.transfer_details?.transfer_type == "intra" &&
              summaryDetails?.transfer_details?.assign_to?.enclosure_id ? (
                <>
                  <Divider />
                  <View style={reduxColors.transferView}>
                    <View style={{ flexDirection: "row" }}>
                      <MaterialCommunityIcons
                        name="arrow-right-top"
                        size={21}
                        color={constThemeColor.editIconColor}
                      />
                      <View style={{ marginLeft: Spacing.body }}>
                        <Text
                          style={[
                            reduxColors?.cardCountANimal,
                            { ...FontSize.Antz_Subtext_Regular },
                          ]}
                        >
                          Transfer To
                        </Text>
                        <Text
                          style={[
                            reduxColors?.cardCountANimal,
                            { ...FontSize.Antz_Body_Medium },
                          ]}
                        >
                          {
                            summaryDetails?.transfer_details?.assign_to
                              ?.enclosure_name
                          }
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              ) : null}

              <Divider />
              <TouchableOpacity onPress={openMemberSheet}>
                <View style={reduxColors.transferView}>
                  <View style={{ flexDirection: "row" }}>
                    <Ionicons
                      name="person"
                      size={20}
                      style={{ paddingTop: Spacing.micro }}
                      color={constThemeColor.editIconColor}
                    />
                    <View style={{ marginLeft: Spacing.body }}>
                      <Text
                        style={[
                          reduxColors?.cardCountANimal,
                          { ...FontSize.Antz_Subtext_Regular },
                        ]}
                      >
                        Transfer Team
                      </Text>
                      <Text style={reduxColors?.cardCountANimal}>
                        {summaryDetails?.total_members} Members
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={openMemberSheet}>
                    <Text
                      style={{
                        ...FontSize.Antz_Body_Medium,
                        color: constThemeColor.onSurface,
                      }}
                    >
                      View
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <Divider />
              <View style={[reduxColors.transferViewApproved]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {getStatus() == "Approval Rejected" ||
                  getStatus() == "Canceled by" ? (
                    <MaterialCommunityIcons
                      name="close-octagon"
                      size={24}
                      color={
                        getStatus() == "Canceled by"
                          ? constThemeColor.neutralSecondary
                          : constThemeColor.error
                      }
                    />
                  ) : (
                    <Ionicons
                      name="checkmark-circle"
                      size={21}
                      color={getColor(constThemeColor)}
                    />
                  )}

                  <Text
                    style={[
                      reduxColors?.cardCountANimal,
                      {
                        ...FontSize.Antz_Subtext_Regular,
                        marginLeft: Spacing.small,
                      },
                    ]}
                  >
                    {getStatus()}
                  </Text>
                </View>
                <View style={{ marginLeft: Spacing.major + 3 }}>
                  {summaryDetails?.approval_list?.map((item, index) => {
                    return (
                      <ApprovalMember
                        item={item}
                        reduxColors={reduxColors}
                        constThemeColor={constThemeColor}
                        index={index}
                        summaryDetails={summaryDetails}
                      />
                    );
                  })}
                </View>
              </View>
              <Divider />
              {allButtonStatus?.show_checklist_button ? (
                <View
                  style={[
                    {
                      elevation: 1,
                      zIndex: 999,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.15,
                      shadowRadius: 2.5,
                    },
                  ]}
                >
                  <TouchableOpacity onPress={() => navigateTo()}>
                    <View style={reduxColors.transferView}>
                      <View style={{ flexDirection: "row" }}>
                        <Ionicons
                          name="checkmark-circle"
                          size={21}
                          color={constThemeColor.skyblue}
                        />
                        <View style={{ marginLeft: Spacing.small }}>
                          <Text
                            style={[
                              reduxColors?.cardCountANimal,
                              {
                                ...FontSize.Antz_Subtext_Regular,
                                paddingTop: Spacing.micro,
                              },
                            ]}
                          >
                            Transfer Checklist
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => navigateTo()}>
                        <View
                          style={{
                            height: 36,
                            width: 36,
                            borderRadius: 50,
                            borderColor: constThemeColor.primary,
                            borderWidth: 1,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: constThemeColor.onSurface,
                              ...FontSize.Antz_Body_Title,
                            }}
                          >
                            {activeItems.length}/{checkListData?.length}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
              <View
                style={{
                  paddingLeft: Spacing.minor,
                  paddingTop: Spacing.body,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="message-text-outline"
                  size={24}
                  color={constThemeColor.outline}
                />
                <Text
                  style={{
                    ...FontSize.Antz_Body_Medium,
                    marginLeft: Spacing.mini,
                  }}
                >
                  Comments
                </Text>
              </View>
              <TouchableOpacity onPress={handleButtonPress}>
                <View style={{ padding: Spacing.minor, flexDirection: "row" }}>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      borderRadius: 8,
                      alignItems: "center",
                      backgroundColor: constThemeColor.onPrimary,
                      justifyContent: "space-between",
                      height: 50,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View style={[reduxColors.iconStyle]}>
                        {userDetails?.profile_pic ? (
                          <Image
                            source={{ uri: userDetails?.profile_pic }}
                            style={{
                              width: 25,
                              height: 25,
                              borderRadius: 20,
                            }}
                          />
                        ) : (
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={{
                                ...FontSize.Antz_Small,
                                color: constThemeColor.onPrimary,
                              }}
                            >
                              {ShortFullName(
                                userDetails?.user_first_name +
                                  " " +
                                  userDetails?.user_last_name
                              )}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={{ marginLeft: Spacing.body }}>
                        Add your comment
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={reduxColors?.commentSend}
                      onPress={addComment}
                      disabled={comment?.length > 0 ? false : true}
                    >
                      <MaterialIcons
                        name="send"
                        size={20}
                        color={
                          comment.length > 0
                            ? constThemeColor.primary
                            : opacityColor(constThemeColor?.neutralPrimary, 40)
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  padding: Spacing.minor,
                  paddingVertical: Spacing.small,
                  paddingTop: 0,
                }}
              >
                {summaryDetails?.comments_details?.map((item, index) => {
                  return (
                    <Activity
                      item={item}
                      reduxColors={reduxColors}
                      constThemeColor={constThemeColor}
                      index={index}
                      backgroundCheck={backgroundCheck}
                      textColorCheck={textColorCheck}
                      userDetails={userDetails}
                    />
                  );
                })}
              </View>
            </>
          ) : null}
        </ScrollView>
        <Modal
          avoidKeyboard
          animationType="fade"
          visible={showCancelModal}
          style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
        >
          <TouchableWithoutFeedback onPress={() => setShowCancelModal(false)}>
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
                    Cancel Transfer
                  </Text>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={reduxColors.closeBtn}
                  >
                    <Ionicons
                      name="close"
                      size={22}
                      color={constThemeColor.onSurface}
                      onPress={() => setShowCancelModal(false)}
                    />
                  </TouchableOpacity>
                </View>
                <View style={reduxColors.modalBody}>
                  <TextInputPaper
                    inputLabel={"Reason"}
                    mode="outlined"
                    autoCompleteType="off"
                    placeholder={"Enter reason to cancel"}
                    style={{
                      width: "100%",
                      backgroundColor: constThemeColor.errorContainer,
                      borderColor: constThemeColor.errorContainer,
                      height: 100,
                      borderRadius: 8,
                      color: constThemeColor?.errorContainer,
                    }}
                    onChangeText={(text) => {
                      setCancelReason(text);
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
                  <TouchableOpacity
                    disabled={cancelReason?.length > 0 ? false : true}
                    onPress={() =>
                      updateTransferActivity({
                        status: "CANCELED",
                      })
                    }
                    style={{
                      backgroundColor:
                        cancelReason?.length > 0
                          ? constThemeColor.error
                          : constThemeColor.neutralSecondary,
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
                  {/* {cancelReason?.length != 0 ? (
                  ) : null} */}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      <View
        style={{
          borderRadius: Spacing.major,
          backgroundColor: opacityColor(constThemeColor?.surfaceVariant, 30),
          display:
            !isLoading ||
            result ||
            allButtonStatus?.reinitiate_button ||
            allButtonStatus?.already_rejected ||
            (transferActivityStatus === "APPROVED"
              ? true
              : false && !allButtonStatus?.show_check_temperature_button) ||
            Object.keys(tempRecord).length > 0 ||
            Object.keys(loadAnimalRecord).length > 0 ||
            Object.keys(reLoadAnimalRecord).length > 0 ||
            Object.keys(rideStartRecord).length > 0 ||
            Object.keys(checkoutDenyRecord).length > 0 ||
            Object.keys(checkoutAllowRecord).length > 0 ||
            Object.keys(checkInAllowRecord).length > 0 ||
            Object.keys(checkInDenyRecord).length > 0 ||
            Object.keys(reachDestinationRecord).length > 0 ||
            Object.keys(approveEntryRecord).length > 0 ||
            Object.keys(destinationVehicle).length > 0 ||
            Object.keys(allocationComplete)?.length > 0 ||
            Object.keys(trasferComplete)?.length > 0
              ? "flex"
              : "none",
        }}
      >
        <FixBottomSheetComponent
          allButtonStatus={allButtonStatus}
          status={summaryDetails?.transfer_details?.activity_status}
          approvedCheck={
            transferActivityStatus === "APPROVED" &&
            allButtonStatus?.show_transfer_member_activity
              ? true
              : false
          }
        >
          <BottomsheetTransferBtns
            isModalVisible={isModalVisible}
            allButtonStatus={allButtonStatus}
            status={summaryDetails?.transfer_details?.activity_status}
            requestId={summaryDetails?.transfer_details?.request_id}
            updateTransferActivity={(e) => updateTransferActivity(e)}
            animalMovementId={animal_movement_id}
            approveFunc={() => handleApproveTransferRequest()}
            rejectAndResetFunc={(e) => rejectAndResetTransferRequest(e)}
            approvedCheck={transferActivityStatus === "APPROVED" ? true : false}
            seeAllLogs={seeAllLogs}
            transferLogs={transferLogs}
            recentLog={recentLog}
            handleSeeAllLogs={handleSeeAllLogs}
            isCreator={
              summaryDetails?.transfer_details?.user_id == UserId ? true : false
            }
            approveData={approveRecord}
            tempData={tempRecord}
            loadAnimalData={loadAnimalRecord}
            reLoadAnimalData={reLoadAnimalRecord}
            startRideData={rideStartRecord}
            checkoutDenyData={checkoutDenyRecord}
            checkoutAllowData={checkoutAllowRecord}
            checkinAllowData={checkInAllowRecord}
            checkinDenyData={checkInDenyRecord}
            reachDestinationData={reachDestinationRecord}
            approveEntryData={approveEntryRecord}
            destinationVehicle={destinationVehicle}
            allocationComplete={allocationComplete}
            trasferComplete={trasferComplete}
            reason={summaryDetails?.transfer_details?.reason}
            qr_code_full_path={summaryDetails?.transfer_details?.qr_code_full_path}
            sourceSite={{
              site_id: summaryDetails?.transfer_details?.source_site_id,
              site_name: summaryDetails?.transfer_details?.source_site_name,
            }}
            destinationSite={{
              site_id: summaryDetails?.transfer_details?.destination_id,
              site_name: summaryDetails?.transfer_details?.destination_name,
            }}
            transfer_type={summaryDetails?.transfer_details?.transfer_type}
            request_id={summaryDetails?.transfer_details?.request_id}
            screen={props?.route?.params?.screen}
            allocateTo={
              summaryDetails?.transfer_details?.destination_type ==
                "enclosure" &&
              summaryDetails?.transfer_details?.assign_to?.enclosure_id
                ? summaryDetails?.transfer_details?.assign_to
                : {}
            }
          />
        </FixBottomSheetComponent>
      </View>
      <BottomSheetModalComponent ref={animalSheetRef}>
        <CustomBottomSheet
          data={allAnimalList}
          type="animal"
          title="Animals to be transferred"
          total={transferAnimalCountCheck(
            summaryDetails?.total_animal_count,
            summaryDetails?.transferred_animal_count
          )}
          closeModal={closeAnimalSheet}
          navigation={navigation}
          trasferStatus={summaryDetails?.transfer_details?.activity_status}
        />
      </BottomSheetModalComponent>
      <BottomSheetModalComponent ref={memberSheetRef}>
        <CustomBottomSheet
          data={memberList}
          type="member"
          title="Transfer Members"
          total={allAnimalCount}
          closeModal={closeMemberSheet}
          totalMembers={summaryDetails?.total_members}
          transferType={summaryDetails?.transfer_details?.transfer_type}
        />
      </BottomSheetModalComponent>

      {isModalVisible ? (
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
          style={{
            justifyContent: "flex-end",
            margin: 0,
          }}
          propagateSwipe={true}
          hideModalContentWhileAnimating={true}
          swipeThreshold={250}
          swipeDirection={"down"}
          animationInTiming={400}
          animationOutTiming={100}
          useNativeDriver={true}
          avoidKeyboard={true}
          onShow={() => {
            setTimeout(() => {
              textInputRef.blur();
              textInputRef.focus();
            }, 50);
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: constThemeColor.onPrimary,
            }}
          >
            <View style={[reduxColors.iconStyle]}>
              {userDetails?.profile_pic ? (
                <Image
                  source={{ uri: userDetails?.profile_pic }}
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 20,
                  }}
                />
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      ...FontSize.Antz_Small,
                      color: constThemeColor.onPrimary,
                    }}
                  >
                    {ShortFullName(
                      userDetails?.user_first_name +
                        " " +
                        userDetails?.user_last_name
                    )}
                  </Text>
                </View>
              )}
            </View>
            <TextInput
              ref={(input) => {
                textInputRef = input;
              }}
              style={reduxColors?.textInput}
              placeholder="Add your comment"
              value={comment}
              onChangeText={(text) => setComment(text)}
              placeholderTextColor={constThemeColor?.onTertiaryContainer}
              autoFocus
            />
            <TouchableOpacity
              style={reduxColors?.commentSend}
              onPress={addComment}
              disabled={comment?.length > 0 ? false : true}
            >
              <MaterialIcons
                name="send"
                size={20}
                color={
                  comment.length > 0
                    ? constThemeColor.primary
                    : opacityColor(constThemeColor?.neutralPrimary, 40)
                }
              />
            </TouchableOpacity>
          </View>
        </Modal>
      ) : null}
    </>
  );
};

export default ApprovalSummary;

// Card for Species

const SpeciesCard = ({ item, index, reduxColors, constThemeColor }) => {
  return (
    <View key={index}>
      {/* <SpeciesCustomCard
    complete_name={"Hyacinth Macaw"}
    animalName={"Hyacinth Macaw"}
    count={20}
    icon={
    }
  /> */}
      <View style={reduxColors?.centerSpaceBtw}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View>
            <ImageComponent icon={item?.default_icon} />
          </View>
          <Text
            style={[
              FontSize.Antz_Minor_Regular,
              {
                color: constThemeColor?.onSurfaceVariant,
                paddingLeft: Spacing.small,
              },
            ]}
          >
            {item?.complete_name ?? item?.scientific_name}
          </Text>
        </View>
        <Text
          style={[
            FontSize.Antz_Minor_Title,
            { color: constThemeColor?.onSurfaceVariant },
          ]}
        >
          {item?.total}
        </Text>
      </View>

      <Divider />
    </View>
  );
};

//Approval member status
const ApprovalMember = ({
  item,
  index,
  reduxColors,
  constThemeColor,
  summaryDetails,
}) => {
  return (
    <View
      style={{
        flex: 1,
        marginTop: Spacing.mini + 2,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View
          style={{
            backgroundColor: constThemeColor.secondary,
            borderRadius: 20,
            height: 26,
            width: 26,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {item?.user_profile_pic ? (
            <Image
              source={{ uri: item?.user_profile_pic }}
              style={{
                width: 26,
                height: 26,
                borderRadius: 20,
              }}
            />
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  ...FontSize.Antz_Subtext_Medium,
                  color: constThemeColor.onPrimary,
                }}
              >
                {ShortFullName(
                  item?.user_first_name + " " + item?.user_last_name
                )}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            paddingLeft: Spacing.small,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={[
                FontSize.Antz_Minor_Regular,
                { color: constThemeColor?.onSurfaceVariant },
              ]}
            >
              {capitalize(item?.user_first_name)}{" "}
              {capitalize(item?.user_last_name)}
            </Text>
            <MaterialIcons
              name="stars"
              color={constThemeColor?.moderateSecondary}
              size={18}
            />
          </View>

          <Text
            style={[
              FontSize.Antz_Subtext_Regular,
              {
                color: constThemeColor?.onSurfaceVariant,
                marginTop: Spacing.micro,
              },
            ]}
          >
            {item?.source_site == "1" && item?.destination_site == "1"
              ? `Sites: ${item?.source_site_name}${
                  summaryDetails?.transfer_details?.transfer_type == "inter"
                    ? `, ${item?.destination_site_name}`
                    : ""
                }`
              : item?.source_site === "1"
              ? `Originating site : ${item?.source_site_name}`
              : `Destination site : ${item?.destination_site_name}`}
          </Text>
          <View style={{ width: "95%" }}>
            {item?.comments ? (
              <Text
                style={[
                  FontSize.Antz_Body_Regular,
                  {
                    color:
                      item?.status == "APPROVED"
                        ? constThemeColor?.onSurface
                        : item?.status == "CANCELED"
                        ? constThemeColor?.neutralSecondary
                        : constThemeColor?.error,
                  },
                ]}
              >
                {item?.comments}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <View
        style={[
          {
            alignItems: "flex-end",
            justifyContent: "center",
          },
          reduxColors?.center,
        ]}
      >
        {item?.status == "APPROVED" ? (
          <Octicons
            name="check-circle"
            size={18}
            color={constThemeColor.onSurface}
            style={{ paddingTop: Spacing.micro }}
          />
        ) : (
          <Foundation
            name="prohibited"
            size={24}
            color={
              item?.status == "CANCELED"
                ? constThemeColor?.neutralSecondary
                : constThemeColor.error
            }
          />
        )}
      </View>
    </View>
  );
};

//Activities

const Activity = ({
  item,
  index,
  reduxColors,
  constThemeColor,
  backgroundCheck,
  textColorCheck,
  userDetails
}) => {
  const handleCheckStatus = (e) => {
    if (e === "APPROVED") {
      return capitalize(e);
    } else if (e === "CHECKED_TEMPERATURE") {
      return capitalize("Checked Temperature");
    } else if (e === "LOADED_ANIMALS") {
      return capitalize("Loaded Animals");
    } else if (e === "REJECTED") {
      return capitalize(e);
    } else if (e === "RIDE_STARTED") {
      return capitalize("MOVED TO SECURITY CHECKOUT");
    } else if (e === "QR_CODE_GENERATED") {
      return capitalize("Generate QR Code");
    } else if (e === "SECURITY_CHECKOUT_ALLOWED") {
      return capitalize("Checkout Vehicle in transit");
    } else if (e === "SECURITY_CHECKIN_ALLOWED") {
      return capitalize("ALLOWED SECURITY CHECKIN");
    } else if (e === "REACHED_DESTINATION") {
      return capitalize("MARKED REACHED DESTINATION");
    } else if (e === "SECURITY_CHECKOUT_DENIED") {
      return capitalize("DENIED SECURITY CHECKOUT");
    } else if (e === "SECURITY_CHECKIN_DENIED") {
      return capitalize("DENIED SECURITY CHECKIN");
    } else if (e === "APPROVE_ENTRY") {
      return capitalize("APPROVE ENTRY");
    } else {
      return e;
    }
  };
  return (
    <>
      {item?.status == "COMMENT" ? (
        <View
          style={{
            color: backgroundCheck(item?.status),
            marginVertical: Spacing.mini,
            padding: Spacing.body,
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: opacityColor(
              constThemeColor.onPrimaryContainer,
              5
            ),
          }}
        >
          <View style={{ width: "80%", flexDirection: "row" }}>
            <View
              style={[
                reduxColors.iconStyle,
                { marginRight: Spacing.small, marginLeft: -Spacing.mini },
              ]}
            >
              {userDetails?.profile_pic ? (
                <Image
                  source={{ uri: userDetails?.profile_pic }}
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 20,
                  }}
                />
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      ...FontSize.Antz_Small,
                      color: constThemeColor.onPrimary,
                    }}
                  >
                    {ShortFullName(
                      userDetails?.user_first_name +
                        " " +
                        userDetails?.user_last_name
                    )}
                  </Text>
                </View>
              )}
            </View>
            <View>
              <Text
                style={[
                  item?.status == "COMMENT"
                    ? FontSize.Antz_Body_Regular
                    : FontSize.Antz_Body_Regular,
                  { color: opacityColor(constThemeColor?.neutralPrimary, 40) },
                ]}
              >
                {item?.user_first_name} {item?.user_last_name}{" "}
              </Text>

              <Text
                style={[{ color: textColorCheck(item?.status) }]}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {item?.comments}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: FontSize.Antz_Small,
                color: constThemeColor?.neutralSecondary,
              }}
            >
              {moment(item?.commented_on).format("LT")}
            </Text>
          </View>
        </View>
      ) : null}
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    header: {
      backgroundColor: reduxColors?.background,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: FontSize.Antz_Medium_Medium.fontSize,
      fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
      color: reduxColors?.onPrimaryContainer,
    },
    date: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
    },
    card: {
      backgroundColor: reduxColors?.onPrimary,
      // height: 200,
      width: "100%",
      borderRadius: 8,
      // marginVertical: Spacing.body,
    },
    cardHeader: {
      backgroundColor: reduxColors?.onSurfaceVariant,
      padding: Spacing.body,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    cardHeaderTitle: {
      color: reduxColors?.onPrimary,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      paddingLeft: Spacing.small,
    },
    image: {
      width: 42,
      height: 42,
      borderRadius: 50,
      alignSelf: "center",
      backgroundColor: reduxColors.neutral10,
    },
    externalTransferIcon: {
      height: 36,
      width: 36,
    },
    subList: {
      padding: Spacing.small,
      backgroundColor: opacityColor(reduxColors?.onPrimaryContainer, 20),
      paddingHorizontal: Spacing.body,
    },
    centerSpaceBtw: {
      flexDirection: "row",
      alignItems: "center",
      padding: Spacing.body,
      justifyContent: "space-between",
    },
    center: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    requestByWrap: {
      display: "flex",
      flexDirection: "row",
      marginTop: Spacing.small,
      // paddingVertical: Spacing.mini,
      // paddingHorizontal: Spacing.major,
      alignItems: "center",
    },
    requestByInsideWrap: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginRight: Spacing.small,
      borderRadius: Spacing.mini,
      // paddingHorizontal: Spacing.mini + Spacing.micro,
    },
    call: {
      justifyContent: "center",
      padding: Spacing.mini,
      borderRadius: 50,
    },
    textInput: {
      flex: 1,
      borderRadius: 8,
      height: 65,
      padding: Spacing.small,
    },
    commentSend: {
      borderRadius: 8,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: Spacing.body,
    },
    imgStyle: {
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 10),
      borderRadius: Spacing.small,
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    AvtarImage: {
      paddingRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    transferView: {
      backgroundColor: reduxColors.surface,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: Spacing.minor,
      paddingHorizontal: Spacing.minor,
    },
    transferViewApproved: {
      backgroundColor: reduxColors.surface,
      padding: Spacing.minor,
      paddingHorizontal: Spacing.minor,
    },
    cardCountANimal: {
      ...FontSize.Antz_Minor_Medium,
      color: reduxColors.onSurfaceVariant,
    },
    iconStyle: {
      height: 25,
      width: 25,
      backgroundColor: reduxColors.secondary,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      marginLeft: Spacing.small,
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
      width: widthPercentageToDP(83),
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
  });
