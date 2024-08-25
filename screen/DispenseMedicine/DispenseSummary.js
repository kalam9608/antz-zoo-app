import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Platform,
  UIManager,
  BackHandler,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";
import {
  AntDesign,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import Spacing from "../../configs/Spacing";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontSize from "../../configs/FontSize";
import { Divider } from "react-native-paper";
import {
  ShortFullName,
  capitalize,
  contactFun,
  opacityColor,
} from "../../utils/Utils";
import { Image } from "react-native";
import { ScrollView } from "react-native";
import moment from "moment";
import Loader from "../../components/Loader";
import ImageComponent from "../../components/ImageComponent";
import { useToast } from "../../configs/ToastConfig";
import SummaryHeader from "../../components/SummaryHeader";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import CustomBottomSheet from "../../components/Transfer/CustomBottomSheet";
import { FlatList } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import { getDispenseSummary } from "../../services/MedicalsService";
import InsideBottomsheet from "../../components/Move_animal/InsideBottomsheet";

const DispenseSummary = (props) => {
  const [summaryDetails, setSummaryDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allAnimalList, setAllAnimalList] = useState([]);
  const [allAnimalCount, setAllAnimalCount] = useState(0);
  const [dispense_id] = useState(props?.route?.params?.id);
  const [store_id] = useState(props?.route?.params?.store_id);
  const [memberList, setMemberList] = useState([]);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const navigation = useNavigation();
  const animalSheetRef = useRef(null);
  const memberSheetRef = useRef(null);
  const [AnimalModalView, setAnimalModalView] = useState(false);
  const [MemberModalView, setMemberModalView] = useState(false);
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const profile_pic = useSelector(
    (state) => state.UserAuth?.userDetails.profile_pic
  );
  const [optionData] = useState([
    {
      id: 1,
      option: (
        <Text>
          <AntDesign name="home" size={20} color={constThemeColor.primary} />
          {"  "}Home
        </Text>
      ),
      screen: "Home",
    },
  ]);
  const [created, setCreated] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [listDataArray, setListDataArray] = useState([]);
  const activeItems = listDataArray.filter((item) => item.active === true);

  const [isModalVisible, setModalVisible] = useState(false);
  let textInputRef = useRef(null);
  const [scrollComment, setScrollComment] = useState(false);
  const scrollRef = useRef(null);

  const onRefresh = async () => {
    // setRefreshing(true);
    // getBtnStatus();
    // getAnimalTransferLog();
    // getApprovalSummary();
  };
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      dispenseSummary();

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [])
  );
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

  const openMemberSheet = () => {
    // getMembarList();
    //  memberSheetRef.current.open();
  };
  const closeMemberSheet = () => {
    // memberSheetRef.current.close();
    setMemberModalView(false);
  };

  const openAnimalSheet = () => {
    // fetchAllAnimal();
    animalSheetRef.current.present();
  };
  const closeAnimalSheet = () => {
    animalSheetRef.current.close();
    setAnimalModalView(false);
  };
  const dispenseSummary = () => {
    const obj = {
      id: dispense_id,
      Selectedstore: store_id,
    };
    getDispenseSummary(obj)
      .then((res) => {
        setSummaryDetails(res?.data);
      })
      .catch((err) => {
        console?.log({ err });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  // useEffect(() => {:st
  //   if (scrollRef?.current) {
  //     scrollRef.current.scrollTo({ y: 250, animated: true });
  //   }
  // }, [scrollComment]);

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleButtonPress = () => {
    toggleModal();
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     if (AnimalModalView || MemberModalView) {
  //       closeAnimalSheet();
  //       closeMemberSheet();
  //     } else {
  //       if (props?.route?.params?.screen == "site") {
  //         navigation.goBack();
  //       } else if (
  //         props?.route?.params?.screen == "qr" ||
  //         props?.route?.params?.screen == "home"
  //       ) {
  //         navigation.navigate("Home");
  //       } else {
  //         navigation.navigate("siteDetails", {
  //           id: summaryDetails?.transfer_details?.source_site_id,
  //           mainScreen: "animalTransfers",
  //           subScreen: summaryDetails?.transfer_details?.transfer_type,
  //         });
  //       }
  //     }
  //     return true;
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );
  //   return () => backHandler.remove();
  // }, [navigation, AnimalModalView, MemberModalView]);
  const groupedData = summaryDetails?.dispense_item_details?.reduce(
    (acc, obj) => {
      const foundItem = acc.find((item) => item.name === obj.name);
      if (foundItem) {
        foundItem.items.push(obj);
      } else {
        acc.push({ name: obj.name, items: [obj] });
      }
      return acc;
    },
    []
  );
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
            backgroundColor: created
              ? constThemeColor.onSurface
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
            title={summaryDetails?.dispense_id}
            hideMenu={false}
            deleteMedical={true}
            optionData={optionData}
            onPressBack={() => {
              navigation.goBack();
            }}
            style={{
              backgroundColor: created
                ? constThemeColor.onSurface
                : constThemeColor?.onPrimary,
            }}
            deleteMedicalFun={() => {
              navigation.navigate("Home");
            }}
            backPressButton={created ? true : false}
            styleText={{ alignItems: "center", justifyContent: "center" }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: Spacing.minor,
              backgroundColor: created
                ? constThemeColor.onSurface
                : constThemeColor?.onPrimary,
            }}
          >
            <View style={{}}>
              <View style={{}}>
                <Text
                  style={{
                    ...FontSize.Antz_Minor_Medium,
                    color: created
                      ? constThemeColor.onPrimary
                      : constThemeColor?.onPrimaryContainer,
                    marginLeft: Spacing.mini,
                  }}
                >
                  {summaryDetails?.from_store}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: Spacing.mini,
                  }}
                >
                  <Text
                    style={{
                      ...FontSize.Antz_Subtext_Regular,
                      color: created
                        ? constThemeColor.onPrimary
                        : constThemeColor?.onPrimaryContainer,
                      marginLeft: Spacing.mini,
                      paddingVertical: Spacing.mini,
                    }}
                  >
                    {moment(summaryDetails?.created_at).format("DD MMM YYYY")} •{" "}
                    {moment(summaryDetails?.created_at).format("LT")}
                  </Text>
                </View>
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
                    {summaryDetails?.created_profile_pic ? (
                      <Image
                        source={{
                          uri: summaryDetails?.created_profile_pic,
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
                            ...FontSize.Antz_Subtext_Medium,
                            color: constThemeColor.onPrimary,
                          }}
                        >
                          {ShortFullName(
                            summaryDetails?.created_user_first_name +
                              " " +
                              summaryDetails?.created_user_last_name
                          )}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                      color: created
                        ? constThemeColor.onPrimary
                        : constThemeColor?.onPrimaryContainer,
                      marginLeft: Spacing.mini,
                    }}
                  >
                    {summaryDetails?.created_user_first_name}{" "}
                    {summaryDetails?.created_user_last_name}
                  </Text>
                </View>

                <>
                  <TouchableOpacity
                    onPress={() =>
                      handleCall(summaryDetails?.created_user_mobile_number)
                    }
                    style={[
                      reduxColors?.call,
                      {
                        backgroundColor: created
                          ? opacityColor(constThemeColor.neutralPrimary, 40)
                          : opacityColor(constThemeColor.neutralPrimary, 5),
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="call"
                      size={18}
                      color={
                        created
                          ? constThemeColor.onPrimary
                          : constThemeColor?.onPrimaryContainer
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      handleMessage(summaryDetails?.created_user_mobile_number)
                    }
                    style={[
                      reduxColors?.call,
                      {
                        marginLeft: Spacing.small,
                        backgroundColor: created
                          ? opacityColor(constThemeColor.neutralPrimary, 40)
                          : opacityColor(constThemeColor.neutralPrimary, 5),
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="message-text-outline"
                      size={18}
                      color={
                        created
                          ? constThemeColor.onPrimary
                          : constThemeColor?.onPrimaryContainer
                      }
                    />
                  </TouchableOpacity>
                </>
              </View>
            </View>
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
          <>
            <View>
              <View style={[reduxColors.transferView]}>
                <View style={{ flexDirection: "row" }}>
                  <Ionicons
                    name="person"
                    size={20}
                    style={{ paddingTop: 0 }}
                    color={constThemeColor.editIconColor}
                  />
                  <View style={{ marginLeft: Spacing.body }}>
                    <Text
                      style={[
                        reduxColors?.cardCountANimal,
                        { ...FontSize.Antz_Subtext_Regular },
                      ]}
                    >
                      Dispensed To
                    </Text>
                    <View style={[reduxColors?.requestByWrap]}>
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
                          {summaryDetails?.profile_pic ? (
                            <Image
                              source={{
                                uri: summaryDetails?.profile_pic,
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
                                  ...FontSize.Antz_Subtext_Medium,
                                  color: constThemeColor.onPrimary,
                                }}
                              >
                                {ShortFullName(
                                  summaryDetails?.user_first_name +
                                    " " +
                                    summaryDetails?.user_last_name
                                )}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{
                            ...FontSize.Antz_Minor_Medium,
                            color: constThemeColor.onSurfaceVariant,
                            marginLeft: Spacing.mini,
                            // width: "60%",
                          }}
                        >
                          {summaryDetails?.user_first_name}{" "}
                          {summaryDetails?.user_last_name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() =>
                      handleCall(summaryDetails?.user_mobile_number)
                    }
                    style={[
                      {
                        justifyContent: "center",
                        padding: Spacing.body,
                        borderRadius: Spacing.small,
                        backgroundColor: constThemeColor.secondaryContainer,
                        marginRight: Spacing.mini,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="call"
                      size={18}
                      color={constThemeColor?.onSecondaryContainer}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      handleMessage(summaryDetails?.user_mobile_number)
                    }
                    style={[
                      {
                        justifyContent: "center",
                        padding: Spacing.body,
                        borderRadius: Spacing.small,
                        marginLeft: Spacing.small,
                        backgroundColor: constThemeColor.secondaryContainer,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="message-text-outline"
                      size={18}
                      color={constThemeColor?.onSecondaryContainer}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Divider />

            <View>
              <View style={reduxColors.transferView}>
                <View style={{ flexDirection: "row" }}>
                  <MaterialIcons
                    name="pets"
                    size={22}
                    color={constThemeColor.onSurfaceVariant}
                  />

                  <View style={{ marginLeft: Spacing.body }}>
                    <Text
                      style={[
                        reduxColors?.cardCountANimal,
                        { ...FontSize.Antz_Subtext_Regular },
                      ]}
                    >
                      Dispensed For
                    </Text>
                    <Text style={reduxColors?.cardCountANimal}>
                      {summaryDetails?.animal_count} Animals
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
            </View>

            <Divider />

            <View>
              <View
                style={[
                  reduxColors.transferView,
                  {
                    backgroundColor: opacityColor(
                      constThemeColor.onPrimary,
                      10
                    ),
                  },
                ]}
              >
                <View style={{}}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <MaterialIcons
                          name="medical-services"
                          size={22}
                          style={{ paddingTop: Spacing.micro }}
                          color={constThemeColor.onSurfaceVariant}
                        />
                        <View style={{ marginLeft: Spacing.small }}>
                          <Text
                            style={[
                              reduxColors?.cardCountANimal,
                              { ...FontSize.Antz_Subtext_Regular },
                            ]}
                          >
                            Medicines
                          </Text>
                          <Text style={reduxColors?.cardCountANimal}>
                            {groupedData?.length ?? "0"}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={[
                          reduxColors?.cardCountANimal,
                          {
                            ...FontSize.Antz_Subtext_Regular,
                            justifyContent: "flex-end",
                          },
                        ]}
                      >
                        Total Quantity
                      </Text>
                      <Text
                        style={[
                          reduxColors?.cardCountANimal,
                          { alignSelf: "flex-end" },
                        ]}
                      >
                        {summaryDetails?.dispense_item_details?.reduce(
                          (acc, crr) => acc + parseInt(crr?.qty),
                          0
                        ) ?? "0"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                paddingHorizontal: Spacing.mini,
              }}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                data={groupedData}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingHorizontal: Spacing.mini }}
                ListEmptyComponent={<ListEmpty visible={isLoading} />}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={{
                        marginVertical: Spacing.mini,
                        paddingVertical: Spacing.body,
                        paddingHorizontal: Spacing.small,
                        borderRadius: Spacing.small,
                        backgroundColor: constThemeColor.onPrimary,
                      }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                ...FontSize.Antz_Body_Title,
                                color: constThemeColor.neutralPrimary,
                                marginLeft: Spacing.mini,
                              }}
                            >
                              {item?.name ?? ""}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                ...FontSize.Antz_Body_Title,
                                color: constThemeColor.neutralPrimary,
                                marginLeft: Spacing.mini,
                              }}
                            >
                              {item?.items?.reduce(
                                (acc, crr) => acc + parseInt(crr?.qty),
                                0
                              ) ?? "0"}
                            </Text>
                          </View>
                        </View>
                        {item?.items?.map((val, index) => {
                          return (
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: Spacing.mini,
                              }}
                            >
                              <View>
                                <Text
                                  style={[
                                    reduxColors?.cardCountANimal1,
                                    {
                                      ...FontSize.Antz_Subtext_Regular,
                                      marginLeft: Spacing.mini,
                                    },
                                  ]}
                                >
                                  {val?.batch_no ?? ""}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={[
                                    reduxColors?.cardCountANimal1,
                                    { ...FontSize.Antz_Subtext_Regular },
                                  ]}
                                >
                                  {val?.qty ?? ""}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                }}
                //   onEndReached={handleLoadMoreMedicineData}
                onEndReachedThreshold={0.4}
                //   ListFooterComponent={renderMedicineFooter}
              />
            </View>
          </>
        </ScrollView>
      </View>

      <BottomSheetModalComponent ref={animalSheetRef}>
        <InsideBottomsheet
          title="Select Animal"
          type="animal"
          data={summaryDetails?.animal_details}
          closeModal={closeAnimalSheet}
          hideSearch={true}
          onPress={() => {}}
          activeOpacity={1}
        />
      </BottomSheetModalComponent>
    </>
  );
};

export default DispenseSummary;

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
    cardCountANimal1: {
      ...FontSize.Antz_Minor_Medium,
      color: reduxColors.neutralSecondary,
    },
    iconStyle: {
      height: 25,
      width: 25,
      backgroundColor: opacityColor(reduxColors.outline, 30),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      marginLeft: Spacing.small,
    },
  });
