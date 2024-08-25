/**
 * @React Imports
 */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  FlatList,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
/**
 * @Expo Imports
 */
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
/**
 * @Redux Imports
 */
import { useDispatch, useSelector } from "react-redux";

/**
 * @Component Imports
 */
import Header from "./Header";
import DeleteBtn from "./DeleteBtn";
import SubmitBtn from "./SubmitBtn";
import Loader from "./Loader";
import QrCard from "./QrCard";
import AnimalCustomCard from "./AnimalCustomCard";

/**
 * @Third Party Imports
 */
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";

/**
 * @Config Imports
 */
import Spacing from "../configs/Spacing";
import FontSize from "../configs/FontSize";
import { useToast } from "../configs/ToastConfig";
/**
 * @Utils Imports
 */
import {
  checkPermissionAndNavigate,
  checkPermissionAndNavigateWithAccess,
  contactFun,
  filterData,
} from "../utils/Utils";

/**
 * @Assets Imports
 */
import svg_mortality from "../assets/Mortality.svg";
import svg_enclosure from "../assets/enclosure.svg";
/**
 * @API Imports
 */
import { RestoreAnimal } from "../services/AnimalService";
import { QrGetDetails } from "../services/staffManagement/addPersonalDetails";
import Config from "../configs/Config";
import DialougeModal from "./DialougeModal";

const AfterCamScan = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [animalDetails, setAnimaldetails] = useState(null);
  const [enclosureDetails, setEnclosuredetails] = useState(null);
  const [sectionDetails, setSectiondetails] = useState(null);
  const [buttonColor, setButtonColor] = useState(constThemeColor.danger);
  const [bgColor, setBgColor] = useState(constThemeColor.onPrimary);
  const permission = useSelector((state) => state.UserAuth.permission);
  const navigation = useNavigation();
  const [Loading, setLoading] = useState(false);
  const [is_permission, setIs_permission] = useState(false);
  const dispatch = useDispatch();
  const [type, setType] = useState(props?.route?.params?.type);
  const [id, setId] = useState(props?.route?.params?.id);
  const [imguri, setImguri] = useState(null);
  const [buttonData, setButtonData] = useState([]);
  const site = useSelector((state) => state.sites.sites);

  const { showToast } = useToast();
  const [isModalVisible, setModalVisible] = useState(false);

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    setType(props?.route?.params?.type);
    setId(props?.route?.params?.id);
    getdetail(props?.route?.params?.type, props?.route?.params?.id);
  }, [animalDetails?.animal_transfered]);

  const getButtonData = (type, details) => {
    let data = [];
    if (type == "enclosure") {
      data = [
        {
          id: 1,
          screen: "CreateEnclosure",
          buttonTitle: "Add Sub Enclosure",
          svg: (
            <Feather
              name="home"
              size={24}
              color={constThemeColor.onSurfaceVariant}
            />
          ),
          key: "housing_add_enclosure",
          params: {
            section_name: details?.section_name,
            section_id: details?.section_id,
            item: details,
          },
        },
        {
          id: 3,
          screen: "AnimalAddDynamicForm",
          buttonTitle: "Add Animal",
          svg: (
            <MaterialCommunityIcons
              name="warehouse"
              size={24}
              color={constThemeColor.onSurfaceVariant}
            />
          ),
          subKey: "collection_animal_record_access",
          params: { item: details, type: type ?? "" },
        },
        // {
        //   id: 4,
        //   screen: "EggsAddForm",
        //   buttonTitle: "Add Egg",
        //   svg: (
        //     <Ionicons
        //       name="egg-sharp"
        //       size={24}
        //       color={constThemeColor.onSurfaceVariant}
        //     />
        //   ),
        //   subKey: "collection_animal_record_access",
        //   params: { item: details, enclosure_Data: "YES" },
        // },
        {
          id: 5,
          screen: "AddAnimals",
          buttonTitle: "Add Group Of Animals",
          svg: (
            <MaterialCommunityIcons
              name="select-group"
              size={24}
              color={constThemeColor.onSurfaceVariant}
            />
          ),
          subKey: "collection_animal_record_access",
          params: { item: details, type: type ?? "" },
        },
        {
          id: 6,
          screen: "Observation",
          buttonTitle: "Add Notes",
          svg: (
            <MaterialCommunityIcons
              name="note-plus-outline"
              size={24}
              color={constThemeColor.onSurfaceVariant}
            />
          ),
          key: "not_required",
          params: {
            selectEnclosure: details.user_enclosure_name,
            selectEnclosureId: details.enclosure_id,
            sectionId: details.section_id,
            sectionType: details.section_name,
            enclosureData: details,
          },
        },
      ];
    } else if (type == "section") {
      data = [
        // {
        //   id: 1,
        //   screen: "Section",
        //   buttonTitle: "Add Section",
        //   svg: (
        //     <MaterialCommunityIcons
        //       // name="warehouse"
        //       name="view-module"
        //       size={24}
        //       color={constThemeColor.onSurfaceVariant}
        //     />
        //   ),
        //   key: "housing_add_section",
        //   params: { item: details },
        // },
        {
          id: 2,
          screen: "CreateEnclosure",
          buttonTitle: "Add Enclosure",
          svg: <SvgXml xml={svg_enclosure} width="24" height="24" />,
          key: "housing_add_enclosure",
          params: { item: details, type: type ?? "" },
        },
        {
          id: 3,
          screen: "AnimalAddDynamicForm",
          buttonTitle: "Add Animal",
          svg: (
            <MaterialCommunityIcons
              name="warehouse"
              size={24}
              color={constThemeColor.onSurfaceVariant}
            />
          ),
          subKey: "collection_animal_record_access",
          params: { item: details, type: type ?? "" },
        },
        // {
        //   id: 4,
        //   screen: "EggsAddForm",
        //   buttonTitle: "Add Egg",
        //   svg: (
        //     <Ionicons
        //       name="egg-sharp"
        //       size={24}
        //       color={constThemeColor.onSurfaceVariant}
        //     />
        //   ),
        //   subKey: "collection_animal_record_access",
        //   params: { item: details, section_Data: true },
        // },
        {
          id: 5,
          screen: "AddAnimals",
          buttonTitle: "Add Group Of Animals",
          svg: (
            <MaterialCommunityIcons
              name="select-group"
              size={24}
              color={constThemeColor.onSurfaceVariant}
            />
          ),
          subKey: "collection_animal_record_access",
          params: { item: details, type: type ?? "" },
        },
        {
          id: 6,
          screen: "Observation",
          buttonTitle: "Add Notes",
          svg: (
            <MaterialCommunityIcons
              name="note-plus-outline"
              size={24}
              color={constThemeColor.onSurfaceVariant}
            />
          ),
          key: "not_required",
          params: {
            sectionId: details?.section_id,
            sectionType: details?.section_name,
            sectionDetailsData: details,
          },
        },
      ];
    } else if (type == "animal") {
      if (
        animalDetails &&
        site?.some((obj) => obj?.site_id == animalDetails?.site_id)
      ) {
        data = [
          // {
          //   id: 3,
          //   screen: "AnimalAddDynamicForm",
          //   buttonTitle: "Add Animal",
          //   svg: (
          //     <MaterialCommunityIcons
          //       name="warehouse"
          //       size={24}
          //       color={constThemeColor.onSurfaceVariant}
          //     />
          //   ),
          //   subKey: "collection_animal_record_access",
          //   params: { item: details, type: type ?? "" },
          // },
        ];
        if (
          details.is_alive == 1 &&
          details.is_deleted == 0 &&
          details.animal_transfered == 0 &&
          details.in_transit == 0
        ) {
          data.push(
            {
              id: 6,
              screen: "Observation",
              buttonTitle: "Add Note",
              svg: (
                // <Entypo
                //   name="notification"
                //   size={24}
                //   color={constThemeColor.onSurfaceVariant}
                // />
                <MaterialCommunityIcons
                  name="note-plus-outline"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
              ),
              key: "not_required",
              params: {
                selectedAnimal: details,
              },
            },
            {
              id: 1,
              screen: "MoveAnimal",
              buttonTitle: "Transfer Animal",
              svg: (
                <MaterialCommunityIcons
                  name="arrow-right-top"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
              ),
              key: "approval_move_animal_external",
              params: { item: details },
            },
            {
              id: 5,
              screen: "AddMedical",
              buttonTitle: "Add Medical",
              svg: (
                <MaterialCommunityIcons
                  // name="hospital-box-outline"
                  name="medical-bag"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
              ),
              subKey: "medical_records_access",
              params: { item: details, cameFrom: "AnimalDetails" },
            },
            {
              id: 2,
              screen: "AddDisposition",
              buttonTitle: "Add Mortality",
              svg: <SvgXml xml={svg_mortality} width="24" height="24" />,
              key: "access_mortality_module",
              params: { item: details },
            }
          );
        }
      }

      // else {
      //   data.push({
      //     id: 7,
      //     screen: "AddNecropasy",
      //     buttonTitle: "Add Necropsy",
      //     svg: (
      //       <MaterialCommunityIcons
      //         name="warehouse"
      //         size={24}
      //         color={constThemeColor.onSurfaceVariant}
      //       />
      //     ),
      //     subKey: "collection_animal_record_access",
      //     params: {
      //       mortalityData: details,
      //       animalDetails: details,
      //     },
      //   });
      // }
      // if (details.sex == "female") {
      //   data.push({
      //     id: 8,
      //     screen: "EggsAddForm",
      //     buttonTitle: "Add Egg",
      //     svg: (
      //       <Ionicons
      //         name="egg-sharp"
      //         size={24}
      //         color={constThemeColor.onSurfaceVariant}
      //       />
      //     ),
      //     subKey: "collection_animal_record_access",
      //     params: {
      //       item: details,
      //       parentMotherData: "YES",
      //     },
      //   });
      // }
    }

    // Transfer animal button remove if already transferred.
    if (animalDetails?.animal_transfered == "1") {
      data.splice(3, 1);
    }

    setButtonData(data);
    setLoading(false);
  };
  const gotoBack = () => {
    navigation.goBack();
  };
  const getdetail = (type, id) => {
    setLoading(true);
    QrGetDetails({ type, id })
      .then((res) => {
        setLoading(false);
        if (res.success == true) {
          setIs_permission(res?.data?.is_permission);
          if (type == "enclosure") {
            if (res?.data.enclosure_id) {
              setEnclosuredetails(res?.data);
              setImguri(res?.data?.enclosure_qr_image ?? null);
            } else {
              showToast(
                "error",
                "You dont have permission to access this enclosure"
              );
              gotoBack();
            }
          } else if (type == "section") {
            setSectiondetails(res?.data);
            setImguri(res?.data?.qr_image ?? null);
          } else if (type == "animal") {
            setImguri(res?.data?.animal_qr_image ?? null);
            setAnimaldetails(res?.data);
          }
          getButtonData(type, res.data);
        } else {
          setLoading(false);
          if (type == "section") {
            showToast(
              "warning",
              "User doesn’t have permission to access for the scanned section"
            );
          } else if (type == "enclosure") {
            showToast(
              "warning",
              "User doesn’t have permission to access for the scanned enclosure"
            );
          } else if (type == "animal") {
            showToast(
              "warning",
              "User doesn’t have permission to access for the scanned ANIMAL"
            );
          } else {
            showToast("warning", res?.message);
          }

          navigation.goBack();
        }
      })
      .catch((error) => {
        console.log({ error });
        showToast("error", "Oops! Something went wrong!");
        // errorToast("Oops!!", "Something went wrong");
        setLoading(false);
      });
  };
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx > 10;
      },
      onPanResponderGrant: () => {
        setButtonColor(constThemeColor.error);
        setBgColor("yellow"); // Change color when swipe starts
      },
      onPanResponderMove: Animated.event([null, { dx: pan }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 50) {
          // Handle swipe action
        }
        if (gestureState.dx < 80) {
          setBgColor(constThemeColor.onPrimary);
        }
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start(() => {
          setButtonColor(constThemeColor.danger);
          setBgColor(constThemeColor.onPrimary);
          // Revert to default color after releasing the button
        });
      },
    })
  ).current;

  const animatedStyle = {
    transform: [{ translateX: pan }],
    backgroundColor: buttonColor, // Apply the color to the button
  };

  const openMessagingApp = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("sms", phoneNumber);
    }
  };
  const makePhoneCall = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("tel", phoneNumber);
    }
  };

  const GotoNavigation = () => {
    if (type == "enclosure") {
      navigation.navigate("OccupantScreen", {
        enclosure_id: enclosureDetails?.enclosure_id,
        enclosureDetails: enclosureDetails,
      });
    } else if (type == "section") {
      navigation.navigate("HousingEnclosuer", {
        section_id: sectionDetails?.section_id ?? "",
        sectiondata: sectionDetails,
        incharge_name: sectionDetails?.incharge_name
          ? sectionDetails?.incharge_name
          : "NA",
      });
    } else if (type == "animal") {
      checkPermissionAndNavigateWithAccess(
        permission,
        "collection_animal_record_access",
        navigation,
        "AnimalsDetails",
        {
          animal_id: animalDetails?.animal_id,
          enclosure_id: animalDetails?.enclosure_id,
        },
        "VIEW"
      );
    }
  };

  const truncateWord = (word) => {
    if (word?.length > 25) {
      return word?.substring(0, 25) + "...";
    } else if (word?.length > 7) {
      return word?.substring(0, 7) + "...";
    }
    return word;
  };
  const SorterNameWord = (word) => {
    if (word?.length > 30) {
      return word?.substring(0, 30) + "...";
    }
    return word;
  };

  const RestoreAnimalData = () => {
    const accessValue = checkPermissionAndNavigateWithAccess(
      permission,
      "collection_animal_record_access",
      null,
      null,
      null,
      "DELETE"
    );
    if (accessValue) {
      alertModalOpen();
    }
  };

  const confirmButtonPress = () => {
    RestoreAnimalDataFunc();
    alertModalClose();
  };

  const cancelButtonPress = () => {
    alertModalClose();
  };

  const RestoreAnimalDataFunc = () => {
    let obje = {
      animal_id: animalDetails?.animal_id ?? null,
    };
    setLoading(true);
    RestoreAnimal(obje)
      .then((res) => {
        setLoading(false);

        if (res.success) {
          // successToast("Success!", res?.message);
          showToast("success", res?.message);
          getdetail(type, id);
        } else {
          // errorToast("Oops!", "Can not delete animal!!");
          showToast("error", "Can not delete animal!!");
        }
      })
      .catch((err) => {
        setLoading(false);
        // errorToast("Oops!", "Something went wrong!!");
        showToast("error", "Oops! Something went wrong!");
      });
  };
  const shareImageAsPDF = async () => {
    try {
      const pdfFile = await Print.printToFileAsync({
        height: 297.64,
        width: 209.76,
        margins: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
        html: `
        <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
              <title>Document</title>
              <style>
                  @media screen, print {
                      *{
                      color: #ffffff;
                      text-align: center;
                      font-family: 'Inter', sans-serif;
                      box-sizing: border-box;
                  }
                  body{
                      width: 100%;
                      height: 100%;
                      print-color-adjust: exact;
                      -webkit-print-color-adjust: exact; 
                      margin:0px;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                  }
                  html, body{
                      height: 100%;
                      overflow: hidden;
                  }
                  body{
                      background-color: #006D35!important;
                      padding: 35px 26px 20px 26px; 
                      display: flex; 
                      flex-direction: column; 
                      align-items: center; 
                      height: 100%; 
                      justify-content: flex-end;
                      width: 296px;
                      height: 420px;
                      margin: 0 auto;
                  }
                  .title{
                      text-align: center; 
                      font-size: 28px; 
                      margin: 0px;
                      margin-bottom: 16px;
                      line-height: 28px;
                      height: 60px;
                  }
                  .qrWrapper{
                      border-radius: 20px; 
                      background-color: #ffffff;
                      width: 245px;
                      height: 245px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                  }
                  .qrImage{
                      width: 211px;
                      height: 211px;
                  }
                  .section{
                      margin: 8px 0px 4px 0px; 
                      font-size: 14px;
                  }
                  .site{
                      margin: 0px 0px 0px 0px; 
                      font-size: 14px;
                  }
                
                }

                @page {
                  margin: 0px;
              }
              </style>
          </head>
          <body>
              <div class="body">
              <h2 class="title">${
                animalDetails?.common_name
                  ? animalDetails?.common_name
                  : sectionDetails?.section_name
                  ? sectionDetails?.section_name
                  : enclosureDetails?.user_enclosure_name
              }</h2>
              <div class="qrWrapper">
                  <img src="${imguri}" class="qrImage" />
              </div>
              <div>
              <p class="section">${
                animalDetails?.user_enclosure_name
                  ? animalDetails?.user_enclosure_name
                  : enclosureDetails?.section_name
                  ? enclosureDetails?.section_name
                  : ""
              }</p>
              <p class="site">${
                animalDetails?.section_name
                  ? animalDetails?.section_name
                  : sectionDetails?.site_name
                  ? sectionDetails?.site_name
                  : ""
              }</p>
              </div>
          </div>
          </body>
          </html>
      `,
      });
      if (pdfFile.uri) {
        await Sharing.shareAsync(pdfFile.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share User Profile",
          UTI: "com.adobe.pdf",
        });
      } else {
        console.error("Error generating PDF");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    }
  };
  return (
    <>
      <View style={reduxColors.container}>
        <Loader visible={Loading} />
        <Header
          title={"Scan"}
          noIcon={true}
          shareIcon={
            <Feather
              name="share-2"
              size={20}
              color={constThemeColor.onSecondaryContainer}
              onPress={shareImageAsPDF}
            />
          }
        />

        <View style={{ flex: 1, marginBottom: Spacing.small }}>
          <Image
            style={{
              width: 160,
              height: 160,
              alignSelf: "center",
            }}
            source={{
              uri: imguri && imguri !== null ? imguri : null,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginVertical: Spacing.mini,
              justifyContent: "center",
            }}
          >
            {animalDetails || sectionDetails || enclosureDetails ? (
              <View style={{ display: "flex", justifyContent: "center" }}>
                <MaterialIcons
                  name="pets"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
              </View>
            ) : null}

            <Text
              style={{
                marginHorizontal: Spacing.mini,
                fontSize: FontSize.Antz_Major_Medium.fontSize,
                fontWeight: FontSize.Antz_Major_Medium.fontWeight,
                color: constThemeColor.onSurfaceVariant,
              }}
            >
              {animalDetails
                ? animalDetails.animal_transfered == "1"
                  ? "Transferred Animal"
                  : "Animal"
                : sectionDetails
                ? "Section"
                : enclosureDetails
                ? "Enclosure"
                : ""}
            </Text>
          </View>

          {animalDetails && animalDetails?.is_deleted == "1" ? (
            <View style={[reduxColors.deadContainer]}>
              <Entypo
                name="circle-with-cross"
                size={20}
                color={constThemeColor.onPrimary}
              />
              <Text style={reduxColors.deadText}>Deleted</Text>
            </View>
          ) : animalDetails && animalDetails?.is_alive == 0 ? (
            <View style={[reduxColors.deadContainer]}>
              <Entypo
                name="circle-with-cross"
                size={20}
                color={constThemeColor.onPrimary}
              />
              <Text style={reduxColors.deadText}>Dead</Text>
            </View>
          ) : null}
          {animalDetails?.in_transit ? (
            <TouchableOpacity
              style={[
                reduxColors.deadContainer,
                { backgroundColor: constThemeColor?.tertiaryContainer },
              ]}
              onPress={() =>
                checkPermissionAndNavigate(
                  permission,
                  "approval_move_animal_external",
                  navigation,
                  "ApprovalSummary",
                  {
                    animal_movement_id: animalDetails?.animal_movement_id,
                    screen: "without_qr",
                  }
                )
              }
            >
              <Text
                style={[
                  FontSize.Antz_Subtext_Regular,
                  { color: constThemeColor?.onTertiaryContainer },
                ]}
              >
                In Transit
              </Text>
            </TouchableOpacity>
          ) : null}

          <View
            style={{
              flex: 1,
              marginHorizontal: Spacing.minor,
            }}
          >
            {animalDetails ? (
              <AnimalCustomCard
                item={animalDetails}
                animalIdentifier={
                  !animalDetails?.local_identifier_value
                    ? animalDetails?.animal_id
                    : animalDetails?.local_identifier_name
                }
                localID={animalDetails?.local_identifier_value ?? null}
                icon={animalDetails?.default_icon}
                enclosureName={animalDetails?.user_enclosure_name}
                animalName={animalDetails?.common_name}
                scientific_name={animalDetails?.scientific_name}
                sectionName={animalDetails?.section_name}
                show_specie_details={true}
                show_housing_details={true}
                chips={animalDetails?.sex}
                noArrow={true}
                siteName={animalDetails?.site_name}
              />
            ) : null}
            {enclosureDetails ? (
              <QrCard
                imgUri={
                  Config.BASE_APP_URL + "assets/class_images/default_animal.svg"
                }
                title={SorterNameWord(
                  enclosureDetails?.user_enclosure_name ?? "NA"
                )}
                inchargename={truncateWord(
                  enclosureDetails?.incharge_name ?? "NA"
                )}
                Section={
                  "Section - " + (enclosureDetails?.section_name ?? "NA")
                }
                onPress={
                  enclosureDetails?.mobile_no &&
                  enclosureDetails?.mobile_no != null
                    ? () => makePhoneCall(enclosureDetails?.mobile_no)
                    : false
                }
                onPressMsz={
                  enclosureDetails?.mobile_no &&
                  enclosureDetails?.mobile_no != null
                    ? () => openMessagingApp(enclosureDetails?.mobile_no)
                    : false
                }
                Species={enclosureDetails?.total_species ?? "0"}
                Occupants={enclosureDetails?.animal_count ?? "0"}
              />
            ) : null}

            {sectionDetails ? (
              <QrCard
                imgUri={
                  Config.BASE_APP_URL + "assets/class_images/default_animal.svg"
                }
                title={SorterNameWord(sectionDetails?.section_name ?? "NA")}
                inchargename={truncateWord(
                  sectionDetails?.incharge_name ?? "NA"
                )}
                sitename={sectionDetails?.site_name ?? "Na"}
                onPress={
                  sectionDetails?.mobile_no && sectionDetails?.mobile_no != null
                    ? () => makePhoneCall(sectionDetails?.mobile_no)
                    : false
                }
                onPressMsz={
                  sectionDetails?.mobile_no && sectionDetails?.mobile_no != null
                    ? () => openMessagingApp(sectionDetails?.mobile_no)
                    : false
                }
                Animals={sectionDetails?.animal_count}
                Enclosures={sectionDetails?.enclosure_count}
              />
            ) : null}

            <FlatList
              data={filterData(buttonData, permission)}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={reduxColors.navtab}
                    onPress={() =>
                      navigation.navigate(item.screen, item.params)
                    }
                  >
                    <View style={reduxColors.navdata}>
                      {item.svg}
                      <Text style={reduxColors.navtext}>
                        {item.buttonTitle}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            {animalDetails?.is_deleted == "1" ? (
              <View style={{ marginHorizontal: Spacing.minor }}>
                <DeleteBtn
                  onPress={RestoreAnimalData}
                  firstTitle={"Restore"}
                  Title={"Animal"}
                />
              </View>
            ) : null}
          </View>
        </View>
        {(animalDetails || sectionDetails || enclosureDetails) &&
          is_permission && (
            <View style={{ marginBottom: Spacing.small }}>
              <SubmitBtn
                buttonText="Open"
                onPress={() => {
                  GotoNavigation();
                }}
              />
            </View>
          )}
      </View>
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Do you want to restore this animal?"}
        closeModal={alertModalClose}
        firstButtonHandle={confirmButtonPress}
        secondButtonHandle={cancelButtonPress}
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
export default AfterCamScan;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.surfaceVariant,
    },
    chip: {
      height: hp(3.5),
      width: hp(3.5),
      backgroundColor: reduxColors.error,
      alignItems: "center",
      marginVertical: hp(1),
      borderRadius: 5,
      marginLeft: wp(2),
    },
    card: {
      marginTop: hp(2),
      height: hp("4%"),
      width: wp("40%"),

      flexDirection: "row",
      alignItems: "center",
    },
    navtab: {
      marginVertical: Spacing.mini,
      backgroundColor: reduxColors.onPrimary,
      borderRadius: Spacing.small,
    },
    navdata: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.minor,
      height: 56,
    },
    navtext: {
      fontSize: FontSize.Antz_Medium_Medium.fontSize,
      fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
      color: reduxColors.onSurface,
      marginLeft: Spacing.small,
    },
    swipeableButton: {
      height: hp(7),
      width: wp(14),
      borderRadius: hp("50%"),
      backgroundColor: reduxColors.danger,
      alignItems: "center",
      justifyContent: "center",
    },
    swipeableButton1: {
      height: hp(7),
      width: wp(14),
      borderRadius: hp("50%"),
      backgroundColor: reduxColors.danger,
      alignItems: "center",
      justifyContent: "center",
    },
    deadContainer: {
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.error,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      padding: Spacing.mini,
      marginBottom: Spacing.small,
    },
    deadText: {
      color: reduxColors.onPrimary,
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginLeft: Spacing.micro,
    },
  });

// Generate a PDF with the user's image and name
// const pdfFile = await Print.printToFileAsync({
//   html: `
//   <html>
//   <body style="margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
//   <img src="${animalDetails?.default_icon ? animalDetails?.default_icon : image}"  width="120" height="120" style="border-radius: 50%;"/>
//   <p style="font-size: 48px; margin-top: 12px; margin-bottom: 8px">${
//     animalDetails?.default_common_name
//       ? animalDetails?.default_common_name
//       : animalDetails?.scientific_name
//       ? animalDetails?.scientific_name
//       : ""
//   }</p>
//     <p style="font-size: 28px; margin-top: 0px; margin-bottom: -15px;">${
//       animalDetails?.user_enclosure_name
//         ? animalDetails?.user_enclosure_name
//         : enclosureDetails?.user_enclosure_name
//         ? enclosureDetails?.user_enclosure_name
//         : ""
//     }</p>
//     <p style="font-size: 28px;"> ${
//       animalDetails?.section_name
//         ? animalDetails?.section_name
//         : sectionDetails?.section_name
//         ? sectionDetails?.section_name
//         : ""
//     }</p>
//     <img src="${imguri}" width="75%" height = "60%" style="margin-top: -10px;"/>
//     <p style="font-size: 28px;margin-bottom: -50px;">Scan with the Antz App</p>
//   </body>
//   </html>
// `,
// });
