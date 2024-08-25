import {
  View,
  Text,
  ScrollView,
  FlatList,
  Linking,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/core";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import SvgUri from "react-native-svg-uri";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { Octicons } from "@expo/vector-icons";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { getNecropsySummary } from "../../services/AnimalService";
import moment from "moment/moment";
import {
  calculateAge,
  capitalize,
  checkPermissionAndNavigateWithAccess,
  contactFun,
  dateFormatter,
  ifEmptyValue,
} from "../../utils/Utils";
import Loader from "../../components/Loader";
import * as WebBrowser from "expo-web-browser";
import SummaryHeader from "../../components/SummaryHeader";
import { errorToast } from "../../utils/Alert";
import ImageViewer from "../../components/ImageViewer";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import ListEmpty from "../../components/ListEmpty";

const NecropsySummary = (props) => {
  const navigation = useNavigation();
  const [necropsyData, setNecropsyData] = useState({});
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const dob = moment(necropsyData?.birth_date);
  const today = moment(new Date());
  const duration = moment.duration(today.diff(dob));
  const years = duration?._data?.years;
  const months = duration?._data?.months;
  const days = duration?._data?.days;
  const { animalId, mortalityId } = props.route.params;
  const permission = useSelector((state) => state.UserAuth.permission);
  const { height, width } = Dimensions.get("window");
  const aspectRatio = height / width;
  let isTablet = false;

  if (aspectRatio > 1.6) {
    isTablet = false;
  } else {
    isTablet = true;
  }

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      getNecropsyData();
    });

    return subscribe;
  }, [navigation]);

  const getNecropsyData = () => {
    setLoading(true);
    let obj = {
      animal_id: animalId,
      mortality_id: mortalityId,
    };
    getNecropsySummary(obj)
      .then((res) => {
        setNecropsyData(res.data);
        if (res.data?.necropsy_attachment) {
          const attachmentFilter = res.data?.necropsy_attachment?.filter(
            (item) => item.file_type.split("/")[0] == "image"
          );
          setImages(
            attachmentFilter.map((item) => {
              return {
                id: item.id,
                url: item.uri,
              };
            })
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
        setLoading(false);
      });
  };

  const handleCall = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("tel", phoneNumber);
    }
  };

  const handleMessage = (data) => {
    let phoneNumber = typeof data !== "undefined" ? data : null;

    if (phoneNumber !== null) {
      contactFun("sms", phoneNumber);
    }
  };
  const renderItem = ({ item }) => {
    return (
      <View>
        <Text
          style={[
            reduxColors.searchItemName,
            {
              fontSize: FontSize.Antz_Body_Title.fontSize,
              fontWeight: FontSize.Antz_Body_Title.fontWeight,
              color: constThemeColor.onSurfaceVariant,
              marginTop: Spacing.small,
            },
          ]}
        >
          {item?.label}
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={item?.parts}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  backgroundColor: constThemeColor.background,
                  marginVertical: Spacing.small,
                  borderRadius: 8,
                  padding: Spacing.mini,
                }}
              >
                <View style={{ padding: Spacing.mini }}>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Minor_Medium.fontSize,
                      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                      color: constThemeColor.onPrimaryContainer,
                    }}
                  >
                    {item?.label} :
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Minor_Regular.fontSize,
                      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                      color: constThemeColor.onPrimaryContainer,
                    }}
                  >
                    {ifEmptyValue(item?.value)}
                  </Text>
                </View>
              </View>
            );
          }}
          keyExtractor={(item, index) => `item-${index}`}
        />
      </View>
    );
  };
  return (
    <View style={{ backgroundColor: constThemeColor.background, flex: 1 }}>
      <Loader visible={loading} />
      <SummaryHeader
        deleted={Boolean(Number(necropsyData.is_deleted))}
        edit={necropsyData?.animal_id ? true : false}
        onPressBack={() => navigation.goBack()}
        onPressEdit={() =>
          checkPermissionAndNavigateWithAccess(
            permission,
            "collection_animal_record_access",
            navigation,
            "EditNecropsy",
            {
              necropsyData: necropsyData,
              animalDetails: props.route.params?.animalDetails,
            },
            "EDIT"
          )
        }
      />
      {necropsyData?.animal_id ? (
        <>
          <View
            style={{
              padding: Spacing.major,
              paddingTop: 0,
            }}
          >
            <View style={{ paddingBottom: Spacing.mini }}>
              <Text style={reduxColors.Title}>Necropsy Report</Text>
            </View>
            <View style={reduxColors.DateTimeView}>
              <Text style={reduxColors.timeText}>
                {moment(necropsyData.necropsy_time, "HH:mm:ss").format("LT")}
              </Text>
              <Text
                style={[
                  reduxColors.timeText,
                  { fontWeight: FontSize.Antz_Body_Regular.fontWeight },
                ]}
              >
                {dateFormatter(necropsyData.necropsy_date)}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                paddingTop: Spacing.major,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginRight: Spacing.small,
                  backgroundColor: constThemeColor.surfaceVariant,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    marginLeft: Spacing.small,
                    alignItems: "center",
                    height: 32,
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={constThemeColor.onSurfaceVariant}
                  />
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    marginHorizontal: Spacing.small,
                  }}
                >
                  <Text
                    style={{
                      color: constThemeColor.onSurface,
                      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                      fontSize: FontSize.Antz_Minor_Regular.fontSize,
                      textAlign: "center",
                    }}
                  >
                    {ifEmptyValue(necropsyData?.doctor_name)}
                  </Text>
                </View>
              </View>

              <>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    backgroundColor: constThemeColor.surfaceVariant,
                    padding: Spacing.mini,
                    borderRadius: 5,
                    height: 32,
                  }}
                  onPress={() => handleCall(necropsyData?.doctor_phone)}
                >
                  <MaterialIcons
                    name="call"
                    size={22}
                    color={constThemeColor.onSurface}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    backgroundColor: constThemeColor.surfaceVariant,
                    marginLeft: Spacing.small,
                    padding: Spacing.mini,
                    borderRadius: 5,
                    height: 32,
                  }}
                  onPress={() => handleMessage(necropsyData?.doctor_phone)}
                >
                  <MaterialCommunityIcons
                    name="message-text-outline"
                    size={24}
                    color={constThemeColor.onSurface}
                  />
                </TouchableOpacity>
              </>
            </View>
            <AnimalCustomCard
              item={necropsyData}
              animalIdentifier={
                !necropsyData?.local_identifier_value
                  ? necropsyData?.animal_id
                  : necropsyData?.local_identifier_name ?? null
              }
              localID={necropsyData?.local_identifier_value ?? null}
              icon={necropsyData?.default_icon}
              enclosureName={necropsyData?.user_enclosure_name}
              animalName={
                necropsyData?.common_name
                  ? necropsyData?.common_name
                  : necropsyData?.scientific_name
              }
              sectionName={necropsyData?.section_name}
              siteName={necropsyData?.site_name}
              show_specie_details={true}
              show_housing_details={true}
              chips={necropsyData?.sex}
              // onPress={() => gotoSearchScreen(Infinity)}
              style={{
                backgroundColor: constThemeColor.background,
              }}
              extra={
                years || months || days
                  ? `Age - ${years ? `${years}y ` : ""}${
                      months ? `${months}m ` : ""
                    }${days ? `${days}d ` : ""}`
                  : ""
              }
              noArrow={true}
            />
          </View>

          <ScrollView>
            <View
              style={{
                backgroundColor: constThemeColor.onPrimary,
                padding: Spacing.major,
                paddingTop: Spacing.body,
              }}
            >
              <View style={reduxColors.timeDateNecropsyView}>
                <Text style={reduxColors.timeDeathTitle}>
                  Time and Date of Death
                </Text>
                <Text style={reduxColors.timeDateNecropsy}>
                  {moment(necropsyData?.discovered_time, "HH:mm:ss").format(
                    "LT"
                  )}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {dateFormatter(necropsyData?.discovered_date)}
                </Text>
              </View>

              <View style={[reduxColors.timeDateNecropsyView]}>
                <Text style={reduxColors.timeDeathTitle}>Cause of death</Text>
                <Text style={reduxColors.timeDateNecropsy}>
                  {ifEmptyValue(necropsyData?.cause_of_death)}
                </Text>
              </View>
              <View style={[reduxColors.timeDateNecropsyView]}>
                <Text style={reduxColors.timeDeathTitle}>Place of death</Text>
                <Text style={reduxColors.timeDateNecropsy}>
                  {capitalize(ifEmptyValue(necropsyData?.place_of_death))}
                </Text>
              </View>
              <View style={[reduxColors.timeDateNecropsyView]}>
                <Text style={reduxColors.timeDeathTitle}>
                  General Description
                </Text>
                <Text style={reduxColors.timeDateNecropsy}>
                  {ifEmptyValue(necropsyData?.general_description)}
                </Text>
              </View>

              <View style={[reduxColors.timeDateNecropsyView]}>
                <Text style={reduxColors.timeDeathTitle}>Disposal Method</Text>
                <Text style={reduxColors.timeDateNecropsy}>
                  {ifEmptyValue(necropsyData?.disposition)}
                </Text>
              </View>
              <View style={[reduxColors.timeDateNecropsyView]}>
                <Text style={reduxColors.timeDeathTitle}>
                  Organ-wise Description of Lessions
                </Text>
                {necropsyData?.necropsy_organs?.length !== 0 ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={necropsyData?.necropsy_organs}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `label-${index}`}
                  />
                ) : (
                  <Text style={reduxColors.timeDateNecropsy}>{"NA"}</Text>
                )}
              </View>
              {/* <View style={[reduxColors.timeDateNecropsyView]}>
            <Text
              style={[
                reduxColors.timeDeathTitle,
                {
                  padding: 0,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  paddingLeft: 5,
                },
              ]}
            >
              History of Illness
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: constThemeColor.displaybgPrimary,
                marginVertical: 8,
                borderRadius: 10,
                padding: 10,
              }}
            >
              <View
                style={[
                  reduxColors.image,
                  { alignItems: "center", justifyContent: "center" },
                ]}
              >
                <SvgUri
                  width="40"
                  height="40"
                  source={{
                    uri: Config.BASE_APP_URL + "assets/class_images/default_animal.svg",
                  }}
                />
              </View>

              <View style={{ marginLeft: widthPercentageToDP(3.8) }}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text
                    style={{
                      marginTop: "2%",
                      color: constThemeColor.onSurfaceVariant,
                      fontSize: FontSize.Antz_Subtext_Medium.fontSize,
                      fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
                    }}
                  >
                    Diagnosis
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: constThemeColor.secondaryContainer,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={[
                      reduxColors.secondViewTitleText,
                      {
                        fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                        padding: 2,
                      },
                    ]}
                  >
                    Covid
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: constThemeColor.tertiary,
                    borderRadius: 4,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={[
                      reduxColors.secondViewTitleText,
                      {
                        fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                        padding: 2,
                        color: constThemeColor.onPrimary,
                      },
                    ]}
                  >
                    Viral Fever
                  </Text>
                </View>
              </View>
            </View>
          </View> */}

              <View style={[reduxColors.timeDateNecropsyView]}>
                <Text style={reduxColors.timeDeathTitle}>
                  Biological Tests Done
                </Text>
                <Text style={reduxColors.timeDateNecropsy}>
                  {ifEmptyValue(necropsyData.biological_test)}
                </Text>
              </View>
              <View style={[reduxColors.timeDateNecropsyView, {}]}>
                {necropsyData?.necropsy_attachment?.length !== 0 && (
                  <Text style={reduxColors.timeDeathTitle}>Attachments</Text>
                )}
              </View>

              {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {necropsyData.necropsy_attachment?.map((file) => {
              if (file.file_type.split("/")[0] == "image") {
                return (
                  <TouchableOpacity
                    style={{ marginRight: Spacing.mini }}
                    onPress={() => WebBrowser.openBrowserAsync(file.file)}
                  >
                    <Image
                      source={{ uri: file.file }}
                      style={{
                        width: isTablet ? 300 : 200,
                        height: isTablet ? 200 : 120,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    />
                    <View
                      style={[
                        reduxColors.imgNameStyle,
                        { width: isTablet ? 300 : 200 },
                      ]}
                    >
                      <Text numberOfLines={1} style={reduxColors.imageName}>
                        {file.file_orginal_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            })}
          </ScrollView> */}
              <ImageViewer data={images} horizontal={true} />

              <View
                style={{
                  flex: 1,
                  marginTop: widthPercentageToDP(2),
                }}
              >
                {necropsyData.necropsy_attachment?.map((file) => {
                  if (file.file_type.split("/")[0] != "image") {
                    return (
                      <TouchableOpacity
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          backgroundColor: constThemeColor.background,
                          paddingVertical: Spacing.minor,
                          paddingHorizontal: Spacing.body,
                          borderRadius: 6,
                          marginVertical: Spacing.mini,
                        }}
                        onPress={() => WebBrowser.openBrowserAsync(file.file)}
                      >
                        <AntDesign
                          name="pdffile1"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />
                        <Text
                          style={{
                            marginLeft: Spacing.small,
                            top: Spacing.mini,
                            color: constThemeColor.onSecondaryContainer,
                            fontSize: FontSize.Antz_Body_Regular.fontSize,
                            fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                          }}
                          numberOfLines={2}
                        >
                          {ifEmptyValue(file?.file_orginal_name)}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                })}
              </View>
            </View>
          </ScrollView>
        </>
      ) : (
        <ListEmpty visible={loading} />
      )}
    </View>
  );
};

export default NecropsySummary;
const styles = (reduxColors) =>
  StyleSheet.create({
    Title: {
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    DateTimeView: {
      display: "flex",
      flexDirection: "row",
    },
    timeText: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginRight: Spacing.small,
    },
    timeDateNecropsyView: {
      marginVertical: Spacing.body,
    },
    timeDeathTitle: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },

    timeDateNecropsy: {
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginTop: Spacing.mini,
    },
    secondViewTitleText: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },

    imgNameStyle: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: reduxColors.background,
      textAlign: "left",
      height: 30,
      padding: Spacing.mini,
    },
    imageName: {
      fontSize: FontSize.Antz_Small,
      fontWeight: FontSize.Antz_Small.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    image: {
      color: reduxColors.onPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
    secondSymbolOne: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: 21,
      height: 20,
      backgroundColor: reduxColors.surfaceVariant,
      borderRadius: 5,
      marginLeft: Spacing.body,
    },
  });
