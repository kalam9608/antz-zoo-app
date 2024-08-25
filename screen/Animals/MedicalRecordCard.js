import React from "react";
import { View } from "react-native";
import { Button, Card, Menu, Avatar } from "react-native-paper";
import moment from "moment/moment";
import {
    heightPercentageToDP,
    widthPercentageToDP,
  } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";

const MedicalRecordCard = () => {
     // fot taking styles from redux use this function 
     const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
     const reduxColors = styles(constThemeColor);
  return (
    <View>
      <Card style={reduxColors.card} elevation={0}>
        <Card.Title
          title={moment(item.created_at).format("DD MMM YYYY")}
          subtitle={item.case_type}
          style={{
            backgroundColor: constThemeColor.secondaryContainer,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
          right={(props) => (
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color={constThemeColor.neutralPrimary}
            />
          )}
          rightStyle={{ marginRight: widthPercentageToDP(5) }}
          titleStyle={{
            fontWeight:FontSize.weight200,
            fontSize: heightPercentageToDP(2),
          }}
          subtitleStyle={{
            fontWeight: FontSize.weight400,
            fontSize: heightPercentageToDP(1.5),
            marginTop: heightPercentageToDP(-1),
          }}
        />
        <Card.Content style={{ marginTop: heightPercentageToDP(2) }}>
          {item.complaints?.length > 0 ? (
            <View style={reduxColors.medicalEachSection}>
              <View style={reduxColors.medicalHeadingSection}>
                <Entypo name="emoji-sad" size={18} color={constThemeColor.neutralPrimary} />
                <Text style={{ marginLeft: 15 }}>Complaints</Text>
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
                <FontAwesome name="stethoscope" size={18} color={constThemeColor.neutralPrimary} />
                <Text style={{ marginLeft: 15 }}>Diagnosis</Text>
              </View>
              <View style={reduxColors.medicalInnerList}>
                {item.diagnosis.map((value, index) => (
                  <Text
                    style={{
                      marginLeft: 5,
                      backgroundColor: constThemeColor.secondaryContainer,
                      padding: 3,
                      borderRadius: 4,
                      marginTop: 2,
                    }}
                  >
                    {value.diagnosis}
                  </Text>
                ))}
              </View>
            </View>
          ) : (
            <></>
          )}
          {item.prescription?.length > 0 ? (
            <View style={reduxColors.medicalEachSection}>
              <View style={reduxColors.medicalHeadingSection}>
                <MaterialCommunityIcons
                  name="note-plus-outline"
                  size={18}
                  color={constThemeColor.neutralPrimary}
                />
                <Text style={{ marginLeft: 15 }}>Prescription</Text>
              </View>
              <View style={{ width: "80%", alignSelf: "center" }}>
                {item.prescription.map((value, index) => (
                  <View
                    style={[
                      reduxColors.commonTextStyle,
                      {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 8,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: FontSize.Antz_Standerd }}>{value.prescription}</Text>
                    <Text style={{ fontSize: FontSize.Antz_Standerd }}>{value.dosage}</Text>
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
                <Feather name="user" size={18} color={constThemeColor.neutralPrimary} />
                <Text style={{ marginLeft: 15 }}>Advice</Text>
              </View>
              <View style={{ width: widthPercentageToDP(75) }}>
                {item.advice.map((value, index) => (
                  <Text
                    style={[
                      reduxColors.commonTextStyle,
                      {
                        marginVertical: 4,
                        marginLeft: 30,
                        fontSize: FontSize.Antz_Standerd,
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
          {item.lab?.length > 0 ? (
            <View style={reduxColors.medicalEachSection}>
              <View style={reduxColors.medicalHeadingSection}>
                <MaterialCommunityIcons
                  name="test-tube"
                  size={18}
                  color={constThemeColor.neutralPrimary}
                />
                <Text style={{ marginLeft: 15 }}>Test Requests</Text>
              </View>
              <View style={reduxColors.medicalInnerList}>
                {item.lab.map((value, index) => (
                  <Text
                    style={[
                      reduxColors.commonTextStyle,
                      {
                        marginLeft: 5,
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
          {item.notes?.length ? (
            <View style={reduxColors.medicalEachSection}>
              <View style={reduxColors.medicalHeadingSection}>
                <FontAwesome name="sticky-note-o" size={18} color={constThemeColor.neutralPrimary} />
                <Text style={{ marginLeft: 15 }}>Notes</Text>
              </View>
              <View style={reduxColors.medicalInnerList}>
                <View style={reduxColors.notesDataBox}>
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Standerd,
                      color: constThemeColor.primary,
                      marginBottom: 6,
                    }}
                  >
                    {getCurrentDateWithTime(
                      item.notes[item.notes.length - 1]?.created_at
                    )}
                  </Text>
                  <Text style={{ fontSize: FontSize.Antz_Minor_Regular.fontSize }}>
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
          {item.follow_up_date !== null ? (
            <View style={reduxColors.medicalEachSection}>
              <View style={reduxColors.medicalHeadingSection}>
                <MaterialCommunityIcons
                  name="calendar-refresh-outline"
                  size={18}
                  color={constThemeColor.neutralPrimary}
                />
                <Text style={{ marginLeft: 15 }}>Follow Up Date</Text>
              </View>
              <View style={reduxColors.medicalInnerList}>
                <Text
                  style={[
                    reduxColors.commonTextStyle,
                    {
                      marginLeft: 5,
                    },
                  ]}
                >
                  {moment(item.follow_up_date).format("DD MMM YYYY")}
                </Text>
              </View>
            </View>
          ) : (
            <></>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

export default MedicalRecordCard;

const styles =(reduxColors)=> StyleSheet.create({
  card: {
    marginHorizontal: "4%",
    marginVertical: "3%",
    backgroundColor: reduxColors.onPrimary,
  },
});
