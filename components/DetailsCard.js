// Name:MD KALAM
// Creation Date: 19th JUN 2023
// Details: DETAILS CARD COMPONENTS

import React from "react";
import { View, Text, StyleSheet } from "react-native";

// RESPONSIVE
import {
  heightPercentageToDP,
  widthPercentageToDP,
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Card } from "react-native-paper";
// DATE Formate
import moment from "moment";

// UTILS IMPORT
import {
  getCurrentDateWithTime,
  ifEmptyValue,
  severityColor,
} from "../utils/Utils";

import { SvgXml } from "react-native-svg";

// IMPORT SVG TO INDIVIDUAL VARIABLES
import svg_share from "../assets/share.svg";
import svg_med_complaints from "../assets/Med_Complaints.svg";
import svg_med_diagnosis from "../assets/Med_Diagnosis.svg";
import svg_med_prescription from "../assets/Med_Prescription.svg";
import svg_med_advice from "../assets/Med_Advice.svg";
import svg_med_lab from "../assets/Med_Lab.svg";
import svg_med_notes from "../assets/Med_Notes.svg";
import svg_med_follow_up_date from "../assets/Med_Followup.svg";
import svg_med_attachment from "../assets/attach_file.svg";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import { useNavigation } from "@react-navigation/native";
import Spacing from "../configs/Spacing";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function DetailsCard({ item }) {
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const navigation = useNavigation();

  function backgroundColor(priroty, constThemeColor) {
    if (priroty == "Mild") {
      return constThemeColor?.secondaryContainer;
    } else if (priroty == "Moderate") {
      return constThemeColor?.notes;
    } else if (priroty == "High") {
      return constThemeColor?.tertiaryContainer;
    } else if (priroty == "Extreme") {
      return constThemeColor?.errorContainer;
    } else {
      return constThemeColor?.secondaryContainer;
    }
  }

  return (
    <Card
      style={reduxColors.card}
      elevation={0}
      onPress={() => {
        navigation.navigate("MedicalSummary", {
          medical_record_id: item?.id,
          item: item,
        });
      }}
    >
      <Card.Title
        title={moment(item.created_at).format("DD MMM YYYY")}
        subtitle={item.case_type}
        style={{
          backgroundColor: constThemeColor.secondaryContainer,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        right={(props) => (
          <SvgXml
            xml={svg_share}
            width="20"
            height="18"
            style={reduxColors.image}
          />
        )}
        rightStyle={{ marginRight: widthPercentageToDP(5) }}
        titleStyle={{
          fontWeight: FontSize.Antz_Body_Title.fontWeight,
          fontSize: FontSize.Antz_Body_Title.fontSize,
          color: constThemeColor.onSecondaryContainer,
        }}
        subtitleStyle={{
          fontWeight: FontSize.Antz_Body_Title.fontWeight,
          fontSize: FontSize.Antz_Subtext_Regular.fontSize,
          marginTop: heightPercentageToDP(-1),
          color: constThemeColor.onSecondaryContainer,
        }}
      />
      <Card.Content style={{ marginTop: heightPercentageToDP(2) }}>
        {item.complaints?.length > 0 ? (
          <View style={reduxColors.medicalEachSection}>
            <View style={reduxColors.medicalHeadingSection}>
              <ImageIcon path={svg_med_complaints} />
              <Text style={reduxColors.title}>Complaints</Text>
            </View>
            <View style={reduxColors.medicalInnerList}>
              {item.complaints.map((value, index) => (
                <Text style={reduxColors.commonTextStyle}>{value}</Text>
              ))}
            </View>
          </View>
        ) : (
          <></>
        )}
        {item.diagnosis?.length > 0 ? (
          <View style={reduxColors.medicalEachSection}>
            <View style={reduxColors.medicalHeadingSection}>
              <ImageIcon path={svg_med_diagnosis} />

              <Text style={reduxColors.title}>Diagnosis</Text>
            </View>
            <View style={reduxColors.medicalInnerList}>
              {item.diagnosis.map((value, index) => {
                return (
                  <>
                    {value?.status !== "closed" && (
                      <Text
                        style={{
                          marginLeft: 5,
                          backgroundColor: backgroundColor(
                            value.severity,
                            constThemeColor
                          ),
                          padding: 3,
                          borderRadius: 4,
                          marginTop: 2,
                        }}
                      >
                        {value.diagnosis}
                      </Text>
                    )}
                  </>
                );
              })}
            </View>
          </View>
        ) : (
          <></>
        )}
        {item.prescription?.length > 0 ? (
          <View style={reduxColors.medicalEachSection}>
            <View style={reduxColors.medicalHeadingSection}>
              <ImageIcon path={svg_med_prescription} />
              <Text style={reduxColors.title}>Prescription</Text>
            </View>
            <View
              style={{ width: widthPercentageToDP(80), alignSelf: "center" }}
            >
              {item.prescription.map((value, index) => (
                <View
                  style={[
                    reduxColors.commonTextStyle,
                    {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: 8,
                      marginLeft: 30,
                    },
                  ]}
                >
                  <Text
                    style={{ fontSize: FontSize.Antz_Body_Regular.fontSize }}
                  >
                    {value.prescription}
                  </Text>
                  <Text
                    style={{ fontSize: FontSize.Antz_Body_Regular.fontSize }}
                  >
                    {value.dosage}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <></>
        )}
        {item.advice?.length > 0 ? (
          <View style={reduxColors.medicalEachSection}>
            <View style={reduxColors.medicalHeadingSection}>
              <ImageIcon path={svg_med_advice} />

              <Text style={reduxColors.title}>Advice</Text>
            </View>
            <View
              style={{ width: widthPercentageToDP(80), alignSelf: "center" }}
            >
              {item.advice.map((value, index) => (
                <Text
                  style={[
                    reduxColors.commonTextStyle,
                    {
                      marginVertical: 4,
                      marginLeft: 30,
                      fontSize: FontSize.Antz_Body_Regular.fontSize,
                      paddingHorizontal: 8,
                    },
                  ]}
                >
                  {value}
                </Text>
              ))}
            </View>
          </View>
        ) : (
          <></>
        )}
        {item.lab_test?.length > 0 ? (
          <View style={reduxColors.medicalEachSection}>
            <View style={reduxColors.medicalHeadingSection}>
              <ImageIcon path={svg_med_lab} />
              <Text style={reduxColors.title}>Lab Test Requests</Text>
            </View>
            <View style={reduxColors.medicalInnerList}>
              {item.lab_test?.map((value, index) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderColor: constThemeColor?.adviceBorderColor1,
                    borderWidth: 1.5,
                    padding: Spacing.body,
                    borderRadius: 8,
                    width: "100%",
                    marginVertical: Spacing.mini,
                  }}
                >
                  <View>
                    <Text style={reduxColors?.labTextSub}>
                      {moment(
                        value?.lab_test_date,
                        "YYYY-MM-DD HH:mm:ss"
                      ).format("DD MMM YYYY")}
                    </Text>
                    <Text
                      style={[
                        reduxColors?.labTextTitle,
                        {
                          color: constThemeColor?.onPrimaryContainer,
                        },
                      ]}
                    >
                      Lab Test - {value?.lab_test_id}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <></>
        )}
        {item?.documents_count ||
        item?.images_count ||
        item?.notes?.documents ||
        item?.notes?.images ? (
          <View style={reduxColors.medicalEachSection}>
            <View style={reduxColors.medicalHeadingSection}>
              <ImageIcon path={svg_med_attachment} />
              <Text style={reduxColors.title}>Attachments</Text>
            </View>
            <View style={reduxColors?.medicalInnerList}>
              {item?.images_count ? (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome
                    name="photo"
                    size={20}
                    color={constThemeColor?.secondary}
                  />
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Body_Regular.fontSize,
                      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                      color: reduxColors.onSurfaceVariant,
                      marginLeft: Spacing.mini,
                    }}
                  >
                    {item?.images_count > 1 || item?.notes?.images > 1
                      ? `${item?.images_count ?? item?.notes?.images} images`
                      : `${item?.images_count ?? item?.notes?.images} image`}
                  </Text>
                </View>
              ) : null}
              {item?.documents_count || item?.notes?.documents ? (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: item.images_count ? Spacing.major : 0,
                  }}
                >
                  <MaterialIcons
                    name="description"
                    size={20}
                    color={constThemeColor?.secondary}
                  />
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Body_Regular.fontSize,
                      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                      color: reduxColors.onSurfaceVariant,
                      marginLeft: Spacing.mini,
                    }}
                  >
                    {item?.documents_count > 1 || item?.notes?.documents > 1
                      ? `${
                          item?.documents_count ?? item?.notes?.documents
                        } documents`
                      : `${
                          item?.documents_count ?? item?.notes?.documents
                        } document`}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        ) : (
          <></>
        )}
        {item.notes?.length ? (
          <View style={reduxColors.medicalEachSection}>
            <View style={reduxColors.medicalHeadingSection}>
              <ImageIcon path={svg_med_notes} />
              <Text style={reduxColors.title}>Notes</Text>
            </View>
            <View style={reduxColors.medicalInnerList}>
              <View style={reduxColors.notesDataBox}>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Body_Regular.fontSize,
                    color: constThemeColor.neutral50,
                    marginBottom: 6,
                  }}
                >
                  {getCurrentDateWithTime(
                    item.notes[item.notes.length - 1]?.created_at
                  )}
                </Text>
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
                    color: constThemeColor.onErrorContainer,
                  }}
                >
                  {item.notes[item.notes.length - 1].notes.length > 20
                    ? item.notes[item.notes.length - 1].notes.slice(0, 20) +
                      "..."
                    : item.notes[item.notes.length - 1].notes}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <></>
        )}
        {ifEmptyValue(moment(item.follow_up_date).format("DD MMM YYYY")) !==
        "NA" ? (
          <View style={reduxColors.medicalEachSection}>
            <View style={reduxColors.medicalHeadingSection}>
              <ImageIcon path={svg_med_follow_up_date} />
              <Text style={reduxColors.title}>Follow Up Date</Text>
            </View>
            <View style={reduxColors.medicalInnerList}>
              <Text
                style={[
                  reduxColors.commonTextStyle,
                  {
                    marginLeft: 5,
                    color: constThemeColor.onErrorContainer,
                  },
                ]}
              >
                {ifEmptyValue(
                  moment(item.follow_up_date).format("DD MMM YYYY")
                )}
              </Text>
            </View>
          </View>
        ) : (
          <></>
        )}
      </Card.Content>
    </Card>
  );
}

const ImageIcon = ({ path }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      <SvgXml xml={path} width="20" height="18" style={reduxColors.image} />
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    medicalEachSection: {
      marginBottom: heightPercentageToDP(2),
    },
    medicalHeadingSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    title: {
      color: reduxColors.onSurfaceVariant,
      marginLeft: widthPercentageToDP(3.5),
      fontSize: hp(1.7),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginBottom: 2,
    },
    image: {
      height: hp(5),
      color: reduxColors.onPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
    notesDataBox: {
      minHeight: heightPercentageToDP(8),
      width: widthPercentageToDP(65),
      backgroundColor: reduxColors.notes,
      borderRadius: 15,
      padding: 8,
      marginBottom: 5,
      marginTop: 2,
    },
    medicalInnerList: {
      flexDirection: "row",
      marginLeft: widthPercentageToDP(8),
      flexWrap: "wrap",
    },
    commonTextStyle: {
      marginLeft: 5,
      backgroundColor: reduxColors.background,
      padding: 3,
      borderRadius: 4,
      marginTop: 2,
    },
    notesTextStyle: {
      marginLeft: 5,
      backgroundColor: reduxColors.notes,
      padding: 3,
      borderRadius: 4,
      marginTop: 2,
    },

    scientificName: {
      color: reduxColors.onPrimary,
      fontStyle: "italic",
      fontSize: heightPercentageToDP(1.5),
      marginVertical: 2,
    },

    sexAndAge: {
      flexDirection: "row",
      marginVertical: 2,
    },

    sex: {
      color: reduxColors.onPrimary,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: heightPercentageToDP(1.8),
    },

    card: {
      marginHorizontal: "4%",
      marginVertical: "3%",
      backgroundColor: reduxColors.onPrimary,
    },
    labTextSub: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    labTextTitle: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors?.onPrimaryContainer,
    },
  });
