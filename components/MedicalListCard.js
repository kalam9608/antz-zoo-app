import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Card, Chip } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import FontSize from "../configs/FontSize";
import moment from "moment";
import Spacing from "../configs/Spacing";
import { AntDesign } from "@expo/vector-icons";
import { LengthDecrease, severityColor } from "../utils/Utils";
import PrescriptionItem from "./PrescriptionItem";
import AnimalCustomCard from "./AnimalCustomCard";
import { setFromMedicalBasicPage } from "../redux/MedicalSlice";
import SvgUri from "react-native-svg-uri";
import svg_med_complaints from "../assets/Med_Complaints.svg";
import svg_med_diagnosis from "../assets/Med_Diagnosis.svg";
import svg_med_prescription from "../assets/Med_Prescription.svg";
import svg_med_advice from "../assets/Med_Advice.svg";
import svg_med_lab from "../assets/Med_Lab.svg";
import { SvgXml } from "react-native-svg";
const MedicalListCard = ({ item, filter, index, ...props }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const goToMedicalSummary = () => {
    if (props.fromMedicalBasicPage) {
      dispatch(setFromMedicalBasicPage(true));
    }
    navigation.navigate("MedicalSummary", {
      medical_record_id: item?.id,
      item: item,
      medical_record_code: item?.medical_record_code,
    });
  };
  const ImageIcon = ({ path }) => {
    const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    const reduxColors = styles(constThemeColor);
    return (
      <>
        <SvgXml xml={path} width="20" height="18" style={reduxColors.image} />
      </>
    );
  };
  return (
    <Card
      style={{
        backgroundColor: constThemeColor.onPrimary,
        marginVertical: Spacing.mini + Spacing.micro,
      }}
      elevation={0}
      onPress={() => goToMedicalSummary()}
    >
      <Card.Content style={{}}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <View
              style={{
                // flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  // backgroundColor:
                  //   item.id % 2 == 0
                  //     ? constThemeColor.tertiary
                  //     : constThemeColor.primary,
                  backgroundColor: constThemeColor.primary,
                }}
              > */}
              {/* <Image
                source={{ uri: item?.default_icon }}
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 50,
                  resizeMode: "contain",
                }}
              /> */}
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 55,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: item?.color_code,
                }}
              >
                <SvgUri
                  source={{ uri: item?.default_icon }}
                  width="15"
                  height="15"
                  style={reduxColors.image}
                />
              </View>
              {/* </View> */}
              <Text
                style={{
                  fontSize: FontSize.Antz_Body_Title.fontSize,
                  fontWeight: FontSize.Antz_Body_Title.fontWeight,
                  color: constThemeColor.neutralPrimary,
                  paddingLeft: Spacing.small,
                }}
              >
                {item?.medical_record_code}
              </Text>
            </View>
            <View
              style={{ marginVertical: Spacing.mini, flexDirection: "row" }}
            >
              <Text
                style={{
                  fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                  fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                  color: constThemeColor?.onPrimaryContainer,
                }}
              >
                {item?.case_type}
              </Text>
              <Text
                style={{
                  fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                  fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                  color: constThemeColor?.neutralSecondary,
                  paddingLeft: Spacing.small,
                }}
              >
                • {moment(item.created_at).format("DD MMM YYYY")}
              </Text>
              {index == 1 ? (
                <Text
                  style={{
                    fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                    fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                    color: constThemeColor?.neutralSecondary,
                    paddingLeft: Spacing.small,
                  }}
                >
                  • {LengthDecrease(22, item.full_name)}
                </Text>
              ) : null}
            </View>
          </View>
          <AntDesign
            name="right"
            size={18}
            color={constThemeColor?.onSurfaceVariant}
          />
        </View>

        {item?.animal_details ? (
          <View style={{ marginVertical: Spacing.small }}>
            <AnimalCustomCard
              item={item?.animal_details}
              animalIdentifier={
                item?.animal_details?.local_identifier_value
                  ? item?.animal_details?.local_identifier_name
                  : item?.animal_details?.animal_id
              }
              localID={item?.animal_details?.local_identifier_value ?? null}
              icon={item?.animal_details?.default_icon}
              enclosureName={item?.animal_details?.user_enclosure_name}
              animalName={
                item?.animal_details?.common_name
                  ? item?.animal_details?.common_name
                  : item?.animal_details?.scientific_name ?? ""
              }
              sectionName={item?.animal_details?.section_name}
              show_specie_details={true}
              siteName={item?.site_name}
              show_housing_details={true}
              chips={item?.animal_details?.sex}
              style={{
                paddingHorizontal: Spacing.body,
                paddingVertical: Spacing.small,
                backgroundColor: constThemeColor?.background,
              }}
              noArrow={true}
              remove={false}
              screenType="Medical"
            />
          </View>
        ) : null}

        {/* {item?.diagnosis?.length > 0 && filter != "active_prescriptions" ? (
          <View style={{}}>
            <Text style={reduxColors?.subTitle}>Diagnosis</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {item?.diagnosis?.map((item, index) => {
                return (
                  <View key={index}>
                    <Chip
                      style={[
                        reduxColors.painbox,
                        {
                          backgroundColor:
                            item?.status == "closed"
                              ? constThemeColor?.adviceBorderColor1
                              : severityColor(item?.additional_info?.severity),
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: constThemeColor.onPrimary,
                          fontSize: FontSize.Antz_Minor_Medium.fontSize,
                          fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                        }}
                      >
                        {item.diagnosis}
                      </Text>
                    </Chip>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {(item?.diagnosis?.length == 0 || filter == "active_prescriptions") &&
        item?.prescription?.filter((p) => !p.additional_info?.stop_date)
          ?.length > 0 ? (
          <View>
            <Text style={reduxColors?.subTitle}>Prescription</Text>
            <View style={{ width: "100%", alignSelf: "center" }}>
              {item.prescription
                ?.filter((p) => !p.additional_info?.stop_date)
                ?.map((value, index) => (
                  <PrescriptionItem item={value} />
                ))}
            </View>
          </View>
        ) : null}
        {item?.diagnosis?.length == 0 &&
        item?.complaint?.length > 0 &&
        item?.prescription?.filter((p) => !p.additional_info?.stop_date)
          ?.length == 0 ? (
          <View>
            <Text style={reduxColors?.subTitle}>Complaints</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {item?.complaint?.map((item, index) => {
                return (
                  <View key={index}>
                    <Chip
                      style={[
                        reduxColors.painbox,
                        {
                          borderWidth: 1,
                          borderColor: severityColor(
                            item?.additional_info?.severity
                          ),
                          backgroundColor: constThemeColor.onPrimary,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: severityColor(item?.additional_info?.severity),
                          fontSize: FontSize.Antz_Minor_Medium.fontSize,
                          fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                        }}
                      >
                        {item?.complaint}
                      </Text>
                    </Chip>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null} */}

        {/* for closed  */}
        {/* {item?.diagnosis?.filter((p) => p?.additional_info?.status == "active")
          ?.length == 0 &&
        item?.prescription?.filter((p) => !p.additional_info?.stop_date)
          ?.length == 0 &&
        item?.complaint?.length == 0 ? (
          <>
            {item?.diagnosis?.filter(
              (p) => p?.additional_info?.status == "closed"
            )?.length > 0 ? (
              <View style={{}}>
                <Text style={reduxColors?.subTitle}>Diagnosis</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {item?.diagnosis
                    ?.filter((p) => p?.additional_info?.status == "closed")
                    ?.map((item, index) => {
                      return (
                        <View key={index}>
                          <Chip
                            style={[
                              reduxColors.painbox,
                              {
                                backgroundColor:
                                  constThemeColor?.adviceBorderColor1,
                              },
                            ]}
                          >
                            <Text
                              style={{
                                color: constThemeColor.onPrimary,
                                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                                fontWeight:
                                  FontSize.Antz_Minor_Medium.fontWeight,
                              }}
                            >
                              {item.diagnosis}
                            </Text>
                          </Chip>
                        </View>
                      );
                    })}
                </View>
              </View>
            ) : null}
            {item?.diagnosis?.filter(
              (p) => p?.additional_info?.status == "closed"
            )?.length == 0 &&
            item?.prescription?.filter((p) => p.additional_info?.stop_date)
              ?.length > 0 ? (
              <View>
                <Text style={reduxColors?.subTitle}>Prescription</Text>
                <View style={{ width: "100%", alignSelf: "center" }}>
                  {item.prescription
                    ?.filter((p) => p.additional_info?.stop_date)
                    ?.map((value, index) => (
                      <PrescriptionItem item={value} />
                    ))}
                </View>
              </View>
            ) : null}
          </>
        ) : null} */}

        {/* new design for now commented out  */}
        <View style={{ flexDirection: "row", marginVertical: Spacing.small }}>
          {item?.diagnosis?.length > 0 &&
          item?.complaint?.filter(
            (item) => item?.additional_info?.status == "active"
          )?.length > 0 ? (
            <View style={reduxColors?.iconView}>
              <ImageIcon path={svg_med_complaints} />
              <Text style={reduxColors?.count}>
                {" "}
                {
                  item?.complaint?.filter(
                    (item) => item?.additional_info?.status == "active"
                  )?.length
                }
              </Text>
            </View>
          ) : null}
          {
            // item?.diagnosis?.length == 0 &&
            item?.prescription?.filter((p) => !p.additional_info?.stop_date)
              ?.length > 0 &&
            (item?.diagnosis?.length > 0 || item?.complaint?.length > 0) ? (
              <View style={reduxColors?.iconView}>
                <ImageIcon path={svg_med_prescription} />
                <Text style={reduxColors?.count}>
                  {" "}
                  {
                    item?.prescription?.filter(
                      (p) => !p.additional_info?.stop_date
                    )?.length
                  }
                </Text>
              </View>
            ) : null
          }
          {item?.advices_count && item?.advices_count != "0" ? (
            <View style={reduxColors?.iconView}>
              <ImageIcon path={svg_med_advice} />
              <Text style={reduxColors?.count}>
                {" "}
                {item?.advices_count ?? "0"}
              </Text>
            </View>
          ) : null}

          {props?.AnimalDetailsBasic &&
          item?.advice &&
          item?.advice?.length != "0" ? (
            <View style={reduxColors?.iconView}>
              <ImageIcon path={svg_med_advice} />
              <Text style={reduxColors?.count}>
                {" "}
                {item?.advice?.length ?? "0"}
              </Text>
            </View>
          ) : null}
          {
            //  item?.diagnosis?.length == 0 &&
            item?.lab_test_id_count > 0 ? (
              <View style={reduxColors?.iconView}>
                <ImageIcon path={svg_med_lab} />
                <Text style={reduxColors?.count}>
                  {" "}
                  {item?.lab_test_id_count}
                </Text>
              </View>
            ) : null
          }
        </View>
        {item?.diagnosis?.length > 0 ? (
          <View style={{}}>
            <Text style={reduxColors?.subTitle}>Diagnosis</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {item?.diagnosis?.map((item, index) => {
                return (
                  <View key={index}>
                    <Chip
                      style={[
                        reduxColors.painbox,
                        {
                          backgroundColor:
                            item?.status == "closed"
                              ? constThemeColor?.adviceBorderColor1
                              : severityColor(item?.additional_info?.severity),
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: constThemeColor.onPrimary,
                          fontSize: FontSize.Antz_Minor_Medium.fontSize,
                          fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                        }}
                      >
                        {item.diagnosis}
                      </Text>
                    </Chip>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
        {item?.diagnosis?.length == 0 && item?.complaint?.length > 0 ? (
          <View>
            <Text style={reduxColors?.subTitle}>Complaints</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {item?.complaint?.map((item, index) => {
                return (
                  <View key={index}>
                    <Chip
                      style={[
                        reduxColors.painbox,
                        {
                          borderWidth: 1,
                          borderColor:
                            item?.additional_info?.status == "closed"
                              ? constThemeColor?.adviceBorderColor1
                              : severityColor(item?.additional_info?.severity),
                          backgroundColor: constThemeColor.onPrimary,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color:
                            item?.additional_info?.status == "closed"
                              ? constThemeColor?.adviceBorderColor1
                              : severityColor(item?.additional_info?.severity),
                          fontSize: FontSize.Antz_Minor_Medium.fontSize,
                          fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                        }}
                      >
                        {item?.complaint}
                      </Text>
                    </Chip>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {item?.prescription?.filter((p) => !p.additional_info?.stop_date)
          ?.length > 0 &&
        item?.diagnosis?.length == 0 &&
        item?.complaint?.length == 0 ? (
          <View>
            <Text style={reduxColors?.subTitle}>Prescription</Text>
            <View style={{ width: "100%", alignSelf: "center" }}>
              {item.prescription
                ?.filter((p) => !p.additional_info?.stop_date)
                ?.slice(0, 1)
                ?.map((value, index) => (
                  <PrescriptionItem item={value} />
                ))}
            </View>
          </View>
        ) : null}
        {item?.prescription?.filter((p) => !p.additional_info?.stop_date)
          ?.length == 0 &&
        item?.prescription?.filter((p) => p.additional_info?.stop_date)
          ?.length > 0 &&
        item?.diagnosis?.length == 0 &&
        item?.complaint?.length == 0 ? (
          <View>
            <Text style={reduxColors?.subTitle}>Prescription</Text>
            <View style={{ width: "100%", alignSelf: "center" }}>
              {item.prescription
                ?.filter((p) => p.additional_info?.stop_date)
                ?.slice(0, 1)
                ?.map((value, index) => (
                  <PrescriptionItem item={value} />
                ))}
            </View>
          </View>
        ) : null}
      </Card.Content>
    </Card>
  );
};

export default MedicalListCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    painbox: {
      margin: Spacing.mini,
      marginLeft: Spacing.micro,
      borderRadius: Spacing.mini,
    },
    subTitle: {
      fontSize: FontSize.Antz_Subtext_Medium.fontSize,
      fontWeight: FontSize.Antz_Subtext_Medium.fontWeight,
      color: reduxColors?.onSurfaceVariant,
      marginVertical: Spacing.micro,
    },
    count: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      color: reduxColors?.onSurfaceVariant,
    },
    iconView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginRight: Spacing.body,
    },
  });
