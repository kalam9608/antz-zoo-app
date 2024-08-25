import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  BackHandler,
  Platform,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Fontisto, MaterialIcons } from "@expo/vector-icons";

import Loader from "../../components/Loader";
import Header from "../../components/Header";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import InsideBottomsheet from "../../components/Move_animal/InsideBottomsheet";
import MedicalAnimalCard from "../../components/MedicalAnimalCard";
import {
  setMedicalAnimal,
  setMedicalEnclosure,
} from "../../redux/MedicalSlice";
import { getAsyncData, saveAsyncData } from "../../utils/AsyncStorageHelper";
import { opacityColor } from "../../utils/Utils";

import compare_arrow from "../../assets/compare_arrows.svg";
import move_down from "../../assets/move_down.svg";
import moved_location from "../../assets/moved_location.svg";
import { instituteList } from "../../services/MedicalMastersService";
import {
  animalListBySpecies,
  checkSiteApproval,
  createNewAnimalMoveRequest,
  getAllSiteList,
} from "../../services/Animal_movement_service/MoveAnimalService";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import { getSection } from "../../services/staffManagement/getEducationType";
import { setDestination } from "../../redux/AnimalMovementSlice";

const MoveAnimal = (props) => {
  const [loading, setLoading] = useState(false);
  const [reasonToMove, setReasonToMove] = useState("");
  const selectSiteModalRef = useRef(null);
  const selectInstituteModalRef = useRef(null);
  const [siteModal, setSiteModal] = useState(false);
  const [instituteModal, setInstituteModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState({});
  const [selectedTranferSite, setSelectedTranferSite] = useState({});
  const [siteType, setSiteType] = useState("FromSite");
  const [searchTextSite, setSearchTextSite] = useState("");
  const [siteData, setSiteData] = useState([]);
  const [destinationSiteData, setDestinationSiteData] = useState([]);
  const [allSiteData, setAllSiteData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [SelectedAnimal, setSelectedAnimal] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [SelectedEnclosure, setSelectedEnclosure] = useState([]);
  const [instituteListData, setInstituteListData] = useState([]);
  const [instituteListAllData, setInstituteListAllData] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState({});
  const [complete_name, setcomplete_name] = useState("");
  const [selectedEnclosureData, setSelectedEnclosureData] = useState({});
  const [transferTypeList, setTransferTypeList] = useState([
    {
      title: "In-house Transfer",
      sub_title: "Move within the same site",
      icon: (
        // <SvgXml
        //   xml={compare_arrow}
        //   width="22"
        //   height="22"
        //   style={style.image}
        // />
        <SvgXml xml={move_down} width="22" height="22" style={style.image} />
      ),
      type: "intra",
    },
    {
      title: "Inter-site Transfer",
      sub_title: "Move from one site to another",
      icon: (
        <SvgXml
          xml={compare_arrow}
          width="22"
          height="22"
          style={style.image}
        />
      ),
      type: "inter",
    },
    {
      title: "External Transfer",
      sub_title: "Move to another zoo/institution",
      icon: (
        <SvgXml
          xml={moved_location}
          width="22"
          height="22"
          style={style.image}
        />
      ),
      type: "external",
    },
  ]);
  // const permission = useSelector((state) => state.UserAuth.permission);

  // For Dialouge type modal  =========================
  const [isModalVisible, setModalVisible] = useState(false);
  const [DialougeTitle, setDialougeTitle] = useState("");
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const confirmButtonPress = () => {
    setModalVisible(false);
    if (siteType == "FromSite") {
      setSelectedSite({});
    } else {
      setSelectedTranferSite({});
    }
  };
  const [selectedTranferType, setSelectedTranferType] = useState({
    title: "In-house Transfer",
    sub_title: "Move within the same site",
    icon: <SvgXml xml={move_down} width="22" height="22" />,
    type: "intra",
  });
  const selectedEnclosureRedux =
    useSelector((state) => state.AnimalMove.destination) ?? {};
  useEffect(() => {
    setSelectedEnclosureData(selectedEnclosureRedux);
  }, [JSON.stringify(selectedEnclosureRedux)]);

  useEffect(() => {
    if (props.route.params?.animal_movement_id) {
      setSelectedTranferSite(
        props.route.params?.transfer_type == "inter"
          ? props.route.params?.destinationSite
          : {}
      );
      setTimeout(() => {
        setSelectedSite({
          site_id: props.route.params?.sourceSite?.site_id,
          site_name: props.route.params?.sourceSite?.site_name,
        });
      }, 1000);
      setSelectedTranferType(
        transferTypeList?.find(
          (p) => p.type == props.route.params?.transfer_type
        )
      );
      setSelectedInstitute(
        props.route.params?.transfer_type == "external"
          ? {
              id: props.route.params?.destinationSite?.site_id,
              label: props.route.params?.destinationSite?.site_name,
            }
          : {}
      );
      if (props.route.params?.allocateTo?.enclosure_id) {
        dispatch(setDestination(props.route.params?.allocateTo));
      }

      fetchAllAnimal(props.route.params?.animal_movement_id);
    }
  }, [props.route.params?.animal_movement_id]);

  console.log({ selectedEnclosureData });

  useEffect(() => {
    if (props.route.params?.item?.animal_id) {
      setSelectedSite({
        site_id: props.route.params?.item.site_id,
        site_name: props.route.params?.item.site_name,
      });
      saveAsyncData("@antz_selected_site", {
        site_id: props.route.params?.item.site_id,
        site_name: props.route.params?.item.site_name,
      });
      dispatch(
        setMedicalAnimal([
          { ...props.route.params?.item, selectType: "animal" },
        ])
      );
    }
  }, [props.route.params?.item]);

  const getInstitute = () => {
    setLoading(true);
    instituteList()
      .then((res) => {
        setInstituteListData(res?.data);
        setInstituteListAllData(res?.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        errorToast("Error", "Oops! ,Something went wrong!!");
      });
  };
  // useEffect(() => {
  //   Option();
  //   if (
  //     permission["approval_move_animal_internal"] ||
  //     (permission["approval_move_animal_external"] &&
  //       permission["approval_move_animal_internal"])
  //   ) {
  //     setSelectedTranferType({
  //       title: "Intrasite transfer",
  //       sub_title: "Move within the same site",
  //       icon: (
  //         <SvgXml
  //           xml={compare_arrow}
  //           width="22"
  //           height="22"
  //           style={style.image}
  //         />
  //       ),
  //     });
  //   } else {
  //     setSelectedTranferType({
  //       title: "External transfer",
  //       sub_title: "Move to another institution",
  //       icon: (
  //         <SvgXml
  //           xml={moved_location}
  //           width="22"
  //           height="22"
  //           style={style.image}
  //         />
  //       ),
  //     });
  //   }
  // }, [permission]);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const site = useSelector((state) => state.UserAuth.zoos);
  const SelectedAnimalRedux = useSelector((state) => state.medical.animal);
  const SelectedEnclosureRedux = useSelector(
    (state) => state.medical.enclosure
  );

  const defaultSite =
    site?.length > 0
      ? site[0]?.sites?.length == 1
        ? site[0]?.sites[0]
        : null
      : null;

  useEffect(() => {
    const selectedSite = async () => {
      try {
        if (defaultSite) {
          checkSiteApprovalStatus(defaultSite?.site_id);
          return setSelectedSite(defaultSite);
        } else {
          return setSelectedSite({});
        }
      } catch (e) {
        return setSelectedSite({});
      }
    };
    selectedSite();
  }, [defaultSite]);

  useEffect(() => {
    setSiteData(site.length > 0 ? site[0]?.sites : {});
  }, [JSON.stringify(site[0]?.sites)]);
  const handleSelectSiteModal = (type) => {
    setSiteType(type);
    selectSiteModalRef.current.present();
    setSiteModal(true);
    if (type == "ToSite") {
      setLoading(true);
      destinationList();
    }
  };

  // const getSectionData = () => {
  //   setLoading(true);
  //   var postData = {
  //     zoo_id: zooID,
  //     site_id: selectedSite?.site_id,
  //     module: "Transfer",
  //   };
  //   getSection(postData)
  //     .then((res) => {
  //       setSectionTypeData(res.data);
  //       navigation.navigate("CommonAnimalSelectMedical", {
  //         screenName: "Transfer",
  //         sectionData: [res.data[0]],
  //         limit: Infinity,
  //       });
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  const destinationList = () => {
    const obj = {};
    getAllSiteList(obj)
      .then((res) => {
        setDestinationSiteData(res?.data?.result);
        setAllSiteData(res?.data?.result);
      })
      .catch((e) => {
        console.log("err", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const closeSiteSheet = () => {
    selectSiteModalRef.current.close();
    setSiteModal(false);
  };
  const handleSelectInstituteModal = (type) => {
    if (instituteListData?.length == 0) {
      getInstitute();
      selectInstituteModalRef.current.present();
      setInstituteModal(true);
    } else {
      selectInstituteModalRef.current.present();
      setInstituteModal(true);
    }
  };
  const closeInstituteSheet = () => {
    selectInstituteModalRef.current.close();
    setInstituteModal(false);
  };
  // console.log({ sectionTypeData });
  const handleSearch = (text, type) => {
    if (text.length >= 3) {
      if (type == "Site") {
        setSearchTextSite(text);
        if (siteType == "FromSite") {
          setSiteData(
            site[0]?.sites?.filter((p) =>
              p.site_name?.toLowerCase()?.includes(text?.toLowerCase())
            )
          );
        } else {
          setDestinationSiteData(
            allSiteData?.filter((p) =>
              p.site_name?.toLowerCase()?.includes(text?.toLowerCase())
            )
          );
        }
      }
      if (type == "Institute") {
        setSearchTextSite(text);
        setInstituteListData(
          instituteListAllData?.filter((p) =>
            p.label?.toLowerCase()?.includes(text?.toLowerCase())
          )
        );
      }
    } else if (text.length == 0) {
      if (type == "Site") {
        setSearchTextSite("");
        if (siteType == "FromSite") {
          setSiteData(site[0]?.sites);
        }
        setDestinationSiteData(allSiteData);
      }
      if (type == "Institute") {
        setSearchTextSite("");
        setInstituteListData(instituteListAllData);
      }
    }
  };
  // const Option = () => {
  //   const optionList = [];
  //   if (
  //     permission["approval_move_animal_internal"] ||
  //     (permission["approval_move_animal_external"] &&
  //       permission["approval_move_animal_internal"])
  //   ) {
  //     optionList.push(
  //       {
  //         title: "Intrasite transfer",
  //         sub_title: "Move within the same site",
  //         icon: (
  //           <SvgXml
  //             xml={compare_arrow}
  //             width="22"
  //             height="22"
  //             style={style.image}
  //           />
  //         ),
  //       },
  //       {
  //         title: "Intersite transfer",
  //         sub_title: "Move from one site to another",
  //         icon: (
  //           <SvgXml
  //             xml={move_down}
  //             width="22"
  //             height="22"
  //             style={style.image}
  //           />
  //         ),
  //       }
  //     );
  //   }
  //   if (
  //     permission["approval_move_animal_external"] ||
  //     (permission["approval_move_animal_external"] &&
  //       permission["approval_move_animal_internal"])
  //   ) {
  //     optionList.push({
  //       title: "External transfer",
  //       sub_title: "Move to another institution",
  //       icon: (
  //         <SvgXml
  //           xml={moved_location}
  //           width="22"
  //           height="22"
  //           style={style.image}
  //         />
  //       ),
  //     });
  //   }
  //   setTransferTypeList(optionList);
  // };

  const chooseAnimal = () => {
    navigation.navigate("CommonAnimalSelectMedical", {
      screenName: "Transfer",
      limit: Infinity,
      selectedIds: selectedIds,
    });
  };
  const handleTransferType = (item) => {
    setSelectedTranferType(item);
    setVisible(false);
    if (item?.title == "Inter-site Transfer") {
      setSelectedInstitute({});
    } else if (item?.title == "External Transfer") {
      setSelectedTranferSite({});
    } else {
      setSelectedInstitute({});
      setSelectedTranferSite({});
    }
  };

  const destination =
    useSelector((state) => state.AnimalMove.destination) ?? {};
  const deleteFun = (type, id) => {
    if (type == "animal") {
      const filterData = SelectedAnimal?.filter((p) => p?.animal_id != id);
      setSelectedIds(filterData?.map((i) => i?.animal_id));
      setSelectedAnimal(filterData);
      dispatch(setMedicalAnimal(filterData));
    } else if (type == "enclosure") {
      const filterData = SelectedEnclosure?.filter((p) => p.enclosure_id != id);
      setSelectedEnclosure(filterData);
      dispatch(setMedicalEnclosure(filterData));
    }
  };
  useEffect(() => {
    if (SelectedAnimalRedux.length > 0 && SelectedAnimalRedux[0].site_id) {
      setSelectedSite({
        site_id: SelectedAnimalRedux[0].site_id,
        site_name: SelectedAnimalRedux[0].site_name,
      });
      saveAsyncData("@antz_selected_site", {
        site_id: SelectedAnimalRedux[0].site_id,
        site_name: SelectedAnimalRedux[0].site_name,
      });
      if (
        selectedTranferType.type == "inter" &&
        SelectedAnimalRedux[0]?.site_id == selectedTranferSite?.site_id
      ) {
        warningToast(
          "",
          "External Transfer, Source and Destination can't be same!!"
        );
        handleTransferType(transferTypeList[0]);
      }
    }
    setSelectedAnimal(SelectedAnimalRedux);
    setSelectedIds(SelectedAnimalRedux?.map((i) => i?.animal_id));
  }, [JSON.stringify(SelectedAnimalRedux)]);

  useEffect(() => {
    setSelectedEnclosure(SelectedEnclosureRedux);
  }, [JSON.stringify(SelectedEnclosureRedux)]);

  const checkFields =
    SelectedAnimal?.length + SelectedEnclosure?.length > 0 ? true : false;
  const showSubmitButton =
    (selectedTranferSite?.site_id ||
      selectedInstitute?.label ||
      selectedTranferType?.title == "In-house Transfer") &&
    selectedSite?.site_id &&
    reasonToMove
      ? true
      : false;

  const clearAll = () => {
    setSelectedAnimal([]);
    setSelectedIds([]);
    setSelectedEnclosure([]);
    setSelectedTranferSite({});
    setSelectedInstitute({});
    setReasonToMove("");
    // setSelectedTranferType({
    //   title: "Intrasite transfer",
    //   sub_title: "Move within the same site",
    //   icon: (
    //     <SvgXml
    //       xml={compare_arrow}
    //       width="22"
    //       height="22"
    //       style={style.image}
    //     />
    //   ),
    //   type: "intra",
    // });
    dispatch(setMedicalEnclosure([]));
    dispatch(setMedicalAnimal([]));
  };
  const fetchAllAnimal = (id) => {
    setLoading(true);
    animalListBySpecies({
      animal_movement_id: id,
    })
      .then((res) => {
        if (res?.success) {
          const animalIds = [];
          res.data.result.forEach((item) => {
            if (item.animal_details) {
              item.animal_details.forEach((detail) => {
                if (detail?.animal_id) {
                  animalIds.push({ ...detail, selectType: "animal" });
                }
              });
            }
          });
          dispatch(setMedicalAnimal(animalIds));
          // setSelectedAnimal(animalIds);
        } else {
          errorToast("Error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        errorToast("Error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitRequest = () => {
    setLoading(true);
    const destinationId =
      selectedTranferType?.type == "intra"
        ? selectedEnclosureData?.enclosure_id
          ? selectedEnclosureData?.enclosure_id
          : selectedSite?.site_id
        : selectedTranferType?.type == "inter"
        ? selectedTranferSite?.site_id
        : selectedInstitute?.id;
    const obj = {
      animal_id: JSON.stringify(SelectedAnimal?.map((v) => v?.animal_id)),
      enclosure_id: JSON.stringify(
        SelectedEnclosure?.map((v) => v.enclosure_id)
      ),
      transfer_type: selectedTranferType?.type,
      source_site: selectedSite?.site_id,
      destination: destinationId,
      destination_type: selectedEnclosureData?.enclosure_id ? "enclosure" : "",
      reason: reasonToMove,
    };
    createNewAnimalMoveRequest(obj)
      .then((res) => {
        if (res?.success) {
          successToast("success", res?.message);
          setTimeout(() => {
            navigation.replace("ApprovalSummary", {
              animal_movement_id: res?.data?.animal_movement_id,
              site_id: res?.data?.source_site_id,
              screen:
                props?.route?.params?.cameFrom == "AnimalDetails"
                  ? "site"
                  : "home",
            });
          }, 500);
          clearAll();
        } else {
          errorToast(
            "error",
            res.message ? res.message : "Something went wrong!!"
          );
        }
      })
      .catch((err) => {
        console?.log("err", err);
        errorToast("error", "Something went wrong!!");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const checkSiteApprovalStatus = (id) => {
    setLoading(true);
    checkSiteApproval(id)
      .then((res) => {
        if (!res?.success) {
          setModalVisible(true);
          setDialougeTitle(
            res?.message ==
              "This site doesn't have an users under Transfer Authority"
              ? "This site does not have any users under Transfer Authority"
              : res?.message
          );
          setLoading(false);
        } else {
          setModalVisible(false);
        }
      })
      .catch((e) => {
        console.log("err", e);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const backAction = () => {
      if (siteModal || instituteModal) {
        closeSiteSheet();
        closeInstituteSheet();
      } else {
        navigation.goBack();
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [navigation, siteModal, instituteModal]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={[{ flex: 1 }]}
      keyboardVerticalOffset={40}
    >
      <Loader visible={loading} />
      <Header
        title={"Transfer Animal"}
        noIcon={true}
        showBackButton={true}
        backgroundColor={constThemeColor.onPrimary}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: constThemeColor.onPrimary }}
      >
        <View style={styles.mainContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitleText}>{"Transfer from site"}</Text>

            <TouchableOpacity
              activeOpacity={0.5}
              disabled={props.route.params?.item ? true : false}
              style={styles.selectSiteButtonContainer}
              onPress={() => handleSelectSiteModal("FromSite")}
            >
              <Image
                source={require("../../assets/nearMe.png")}
                resizeMode={"contain"}
                style={styles.nearMeIcon}
              />
              <Text style={styles.siteTitleText}>
                {selectedSite?.site_name ?? "Select Site"}
              </Text>
              <Image
                source={require("../../assets/expandMore.png")}
                resizeMode={"contain"}
                style={styles.expandMoreIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.card, { padding: 0 }]}>
            <View style={[styles.rowContainer, { padding: Spacing.body }]}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(true);
                }}
                activeOpacity={0.5}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      marginRight: Spacing.body,
                      backgroundColor: opacityColor(
                        constThemeColor?.neutralPrimary,
                        5
                      ),
                      padding: Spacing.small,
                      borderRadius: 8,
                    }}
                  >
                    {selectedTranferType?.icon}
                  </View>
                  <View>
                    <Text style={styles.cardTitleText}>
                      {selectedTranferType?.title}
                    </Text>
                    <Text style={styles.moveInfoText}>
                      {selectedTranferType?.sub_title}
                    </Text>
                  </View>
                </View>

                <Text style={styles.changeButtonText}>{"Change"}</Text>
              </TouchableOpacity>
            </View>
            {/**
             * In-house
             */}
            {selectedTranferType?.title == "In-house Transfer" &&
            selectedSite?.site_id ? (
              <>
                <View style={styles?.labelBox}>
                  <Text
                    style={[
                      FontSize.Antz_Minor_Regular,
                      { color: constThemeColor?.onSurfaceVariant },
                    ]}
                  >
                    Transfer to Enclosure
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.interSiteButtonContainer}
                  onPress={() => {
                    navigation.navigate("SearchTransferanimal", {
                      type: "Select",
                      screen: "Transfer",
                      selectedSite: selectedSite?.site_id,
                    });
                  }}
                >
                  <Image
                    source={require("../../assets/nearMe.png")}
                    resizeMode={"contain"}
                    style={styles.nearMeIcon}
                  />

                  <Text style={styles.siteTitleText}>
                    {selectedEnclosureData?.enclosure_id
                      ? `${
                          selectedEnclosureData?.user_enclosure_name ??
                          selectedEnclosureData?.enclosure_name
                        }`
                      : "Select Enclosure"}
                  </Text>
                  {
                    selectedEnclosureData?.enclosure_id ? (
                      <Fontisto
                        onPress={() => {
                          setSelectedEnclosureData({});
                          dispatch(setDestination(null));
                        }}
                        name="close"
                        size={22}
                        color={constThemeColor.tertiary}
                      />
                    ) : null
                    // <Image
                    //   source={require("../../assets/expandMore.png")}
                    //   resizeMode={"contain"}
                    //   style={styles.expandMoreIcon}
                    // />
                  }
                </TouchableOpacity>
              </>
            ) : null}
            {/**
             * Intersite
             */}
            {selectedTranferType?.title == "Inter-site Transfer" ? (
              <>
                <View style={styles?.labelBox}>
                  <Text
                    style={[
                      FontSize.Antz_Minor_Regular,
                      { color: constThemeColor?.onSurfaceVariant },
                    ]}
                  >
                    Transfer to Site
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.interSiteButtonContainer}
                  onPress={() => handleSelectSiteModal("ToSite")}
                >
                  <Image
                    source={require("../../assets/nearMe.png")}
                    resizeMode={"contain"}
                    style={styles.nearMeIcon}
                  />

                  <Text style={styles.siteTitleText}>
                    {selectedTranferSite?.site_id
                      ? selectedTranferSite?.site_name
                      : "Select Site"}
                  </Text>
                  {selectedTranferSite?.site_id ? (
                    <Fontisto
                      onPress={() => setSelectedTranferSite({})}
                      name="close"
                      size={22}
                      color={constThemeColor.tertiary}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/expandMore.png")}
                      resizeMode={"contain"}
                      style={styles.expandMoreIcon}
                    />
                  )}
                </TouchableOpacity>
              </>
            ) : null}
            {/**
             * External institution selected
             */}
            {selectedTranferType?.title == "External Transfer" ? (
              <>
                <View style={styles?.labelBox}>
                  <Text
                    style={[
                      FontSize.Antz_Minor_Regular,
                      { color: constThemeColor?.onSurfaceVariant },
                    ]}
                  >
                    Transfer to
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.interSiteButtonContainer}
                  onPress={handleSelectInstituteModal}
                >
                  {selectedInstitute?.label ? (
                    <Image
                      source={require("../../assets/external_transfer.png")}
                      resizeMode={"contain"}
                      style={styles.externalTransferIcon}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.siteTitleText,
                      {
                        marginHorizontal: selectedInstitute?.label
                          ? Spacing.small
                          : 0,
                      },
                      // { color: constThemeColor.onSurfaceVariant },
                    ]}
                  >
                    {selectedInstitute?.label ?? "Add destination"}
                  </Text>
                  {selectedInstitute?.label ? (
                    <Fontisto
                      onPress={() => setSelectedInstitute({})}
                      name="close"
                      size={22}
                      color={constThemeColor.tertiary}
                    />
                  ) : (
                    <Feather
                      name="plus-circle"
                      size={24}
                      color={constThemeColor.addPrimary}
                    />
                  )}
                </TouchableOpacity>
              </>
            ) : null}
          </View>
          {selectedSite?.site_id ? (
            <View style={{ marginBottom: Spacing.body }}>
              <MedicalAnimalCard
                outerStyle={[
                  styles.cardContainer,
                  {
                    marginTop: 0,
                    paddingBottom:
                      SelectedAnimal?.length > 0 ||
                      SelectedEnclosure?.length > 0 ||
                      complete_name?.animal_id
                        ? 0
                        : null,
                  },
                ]}
                title={"Select Animal(s)*"}
                navigation={() => {
                  if (!complete_name?.animal_id) {
                    chooseAnimal();
                  }
                }}
                selectedAnimal={
                  SelectedAnimal?.length > 0 ? SelectedAnimal[0] : null
                }
                maintitleStyle={true}
                animalList={SelectedAnimal}
                enclosureData={SelectedEnclosure}
                sectionData={[]}
                completeName={complete_name}
                deleteFun={deleteFun}
                hideLeftIcon={true}
                type={"Transfer"}
                titleStyle={styles.cardTitleText}
                disable={props.route.params?.item?.animal_id ? true : false}
              />
            </View>
          ) : null}

          {checkFields ? (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitleText}>{"Reason to Move"}</Text>

                <TextInput
                  placeholder={"Enter reason to move"}
                  style={styles.reasonToMoveInput}
                  value={reasonToMove}
                  onChangeText={setReasonToMove}
                />
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      {/* Submit request button  */}
      {checkFields ? (
        <View style={styles.content}>
          <LinearGradient
            colors={[
              constThemeColor?.displaybgPrimary,
              constThemeColor?.displaybgPrimary,
            ]}
          >
            <View style={styles.mainbox}>
              <TouchableOpacity
                style={[
                  styles.secondbutton,
                  {
                    backgroundColor: showSubmitButton
                      ? constThemeColor?.primary
                      : opacityColor(constThemeColor.neutralPrimary, 10),
                  },
                ]}
                onPress={submitRequest}
                disabled={showSubmitButton ? false : true}
                accessible={true}
                accessibilityLabel={"footerDoneLvl"}
                AccessibilityId={"footerDoneLvl"}
              >
                <Text style={[styles.textstyleSecond]}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      ) : null}

      {/* bottom Sheet for Sites  */}
      <BottomSheetModalComponent ref={selectSiteModalRef}>
        <InsideBottomsheet
          title="Select Site"
          type="Site"
          onPress={(item) => {
            if (siteType == "FromSite") {
              setSelectedSite(item);
              dispatch(setDestination(null));
              saveAsyncData("@antz_selected_site", item);
              if (selectedSite?.site_id != item?.site_id) {
                clearAll();
              }
            } else {
              setSelectedTranferSite(item);
            }
            checkSiteApprovalStatus(item?.site_id);
            closeSiteSheet();
            setSearchTextSite("");
          }}
          data={
            siteType == "FromSite"
              ? siteData
              : destinationSiteData?.filter(
                  (p) => p.site_id != selectedSite?.site_id
                )
          }
          handelSearch={handleSearch}
          searchText={searchTextSite}
          selectedIds={
            siteType == "FromSite"
              ? selectedSite?.site_id
              : selectedTranferSite?.site_id
          }
          closeSectionSheet={closeSiteSheet}
          loading={loading}
        />
      </BottomSheetModalComponent>

      {/* bottom Sheet for Institute  */}
      <BottomSheetModalComponent ref={selectInstituteModalRef}>
        <InsideBottomsheet
          title="Select Institute"
          type="Institute"
          onPress={(item) => {
            setSelectedInstitute(item);
            closeInstituteSheet();
            setSearchTextSite("");
          }}
          data={instituteListData}
          // handleLoadMore={handleLoadMoreSite}
          handelSearch={handleSearch}
          searchText={searchTextSite}
          selectedIds={""}
          closeSectionSheet={closeInstituteSheet}
          loading={loading}
        />
      </BottomSheetModalComponent>

      {/* Modal for Transfer Type */}
      <Modal
        visible={visible}
        avoidKeyboard
        animationType="fade"
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
          <View style={[styles.modalOverlay]}>
            <View
              style={{
                // minHeight: 200,
                width: "80%",
                backgroundColor: constThemeColor?.onPrimary,
                borderRadius: 8,
              }}
            >
              <Text
                style={[
                  FontSize.Antz_Medium_Medium,
                  { textAlign: "center", paddingVertical: Spacing.body },
                ]}
              >
                Choose transfer type
              </Text>
              {transferTypeList?.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleTransferType(item)}
                    style={{
                      paddingHorizontal: Spacing.body,
                      height: 66,
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      backgroundColor:
                        selectedTranferType?.title == item?.title
                          ? constThemeColor?.primaryContainer
                          : null,
                      borderBottomLeftRadius:
                        transferTypeList?.length - 1 == index ? 8 : 0,
                      borderBottomRightRadius:
                        transferTypeList?.length - 1 == index ? 8 : 0,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View
                        style={{
                          marginRight: Spacing.body,
                          backgroundColor: opacityColor(
                            constThemeColor?.neutralPrimary,
                            5
                          ),
                          padding: Spacing.small,
                          borderRadius: 8,
                        }}
                      >
                        {item?.icon}
                      </View>
                      <View>
                        <Text
                          style={[
                            FontSize.Antz_Minor_Title,
                            { color: constThemeColor?.onSurfaceVariant },
                          ]}
                        >
                          {item?.title}
                        </Text>
                        <Text
                          style={[
                            FontSize.Antz_Subtext_Regular,
                            { color: constThemeColor?.onSurfaceVariant },
                          ]}
                        >
                          {item?.sub_title}
                        </Text>
                      </View>
                    </View>
                    {selectedTranferType?.title == item?.title ? (
                      <MaterialIcons name="check" size={18} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={DialougeTitle}
        closeModal={alertModalClose}
        firstButtonHandle={confirmButtonPress}
        // secondButtonHandle={cancelButtonPress}
        firstButtonText={"OK"}
        // secondButtonText={"No"}
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
    </KeyboardAvoidingView>
  );
};

export default MoveAnimal;

const style = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      justifyContent: "space-between",
      flexDirection: "column",
      paddingHorizontal: Spacing.minor,
    },
    rowContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    card: {
      borderWidth: 1,
      borderRadius: Spacing.small + Spacing.micro,
      borderColor: reduxColors.outlineVariant,
      backgroundColor: reduxColors.surface,
      padding: Spacing.body,
      marginBottom: Spacing.body + Spacing.micro,
    },
    cardTitleText: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurface,
      flex: 1,
    },
    moveInfoText: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginTop: Spacing.mini,
    },
    selectSiteButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.minor + Spacing.micro,
      borderWidth: 1,
      borderRadius: Spacing.mini,
      borderColor: reduxColors.outlineVariant,
      backgroundColor: reduxColors.onPrimary,
      marginTop: Spacing.body,
    },
    addCircleIcon: {
      height: 24,
      width: 24,
    },
    externalTransferIcon: {
      height: 44,
      width: 44,
    },
    nearMeIcon: {
      height: 20,
      width: 20,
    },
    expandMoreIcon: {
      height: 24,
      width: 26,
    },
    siteTitleText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSurface,
      flex: 1,
      marginHorizontal: Spacing.small,
    },
    changeButtonText: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      color: reduxColors.primary,
      marginHorizontal: Spacing.small,
    },
    reasonToMoveInput: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      fontStyle: "italic",
      color: reduxColors.onPrimaryContainer,
      padding: Spacing.body,
      backgroundColor: reduxColors.notes,
      borderWidth: 1,
      borderRadius: Spacing.small + Spacing.micro,
      borderColor: reduxColors.outlineVariant,
      marginTop: Spacing.body,
    },
    interSiteButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.minor + Spacing.micro,
      borderTopWidth: 1,
      borderBottomLeftRadius: Spacing.small + Spacing.micro,
      borderBottomRightRadius: Spacing.small + Spacing.micro,
      borderColor: reduxColors.outlineVariant,
      backgroundColor: reduxColors.onPrimary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 60),
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      color: reduxColors.onSecondaryContainer,
    },
    cardContainer: {
      borderWidth: 1,
      borderColor: reduxColors.whiteSmoke,
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.surface,
      marginVertical: Spacing.mini,
    },
    mainbox: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: Spacing.minor,
      width: "100%",
      height: 80,
    },
    secondbutton: {
      borderRadius: Spacing.small,
      minWidth: 90,
      height: 40,
      justifyContent: "center",
      backgroundColor: reduxColors.primary,
      marginHorizontal: Spacing.small,
      paddingHorizontal: Spacing.body,
    },
    textstyleSecond: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      textAlign: "center",
      color: reduxColors.onPrimary,
    },
    labelBox: {
      backgroundColor: reduxColors?.background,
      paddingHorizontal: Spacing.small,
      paddingVertical: Spacing.body,
      justifyContent: "center",
      borderTopWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
  });
