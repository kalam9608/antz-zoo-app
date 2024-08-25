import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Card } from "react-native-paper";
import { useSelector } from "react-redux";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import FontSize from "../../configs/FontSize";
import SubmitBtn from "../SubmitBtn";
import { dateFormatter, ifEmptyValue } from "../../utils/Utils";
import Spacing from "../../configs/Spacing";
import ImageViewer from "../ImageViewer";

const MortalityCard = ({ data, onPressEdit, onPress, onPressView }) => {
  const constThemeColors = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColors);
  return (
    <Card
      // style={[styles.container, { paddingVertical: 0 }]}
      style={styles.container}
    >
      <Card.Content
        style={{
          paddingHorizontal: Spacing.minor,
          paddingTop: Spacing.small,
          paddingBottom: Spacing.minor,
        }}
      >
        <View style={styles.mortalityContentItem}>
          <View>
            <Text style={styles.cardContentTitle}>Manner Of Death</Text>
            <Text style={styles.cardContentData}>
              {ifEmptyValue(data?.manner_of_death)}
            </Text>
          </View>
          {data?.submitted_for_necropsy == "1" && data?.necropsy == null && (
            <View>
              {/* <MaterialIcons
                name="edit"
                size={24}
                color={constThemeColors?.editIconColor}
                onPress={onPressEdit}
              /> */}

              <MaterialCommunityIcons
                name="pencil-outline"
                size={24}
                color={constThemeColors?.editIconColor}
                onPress={onPressEdit}
              />
            </View>
          )}
        </View>
        <View style={styles.mortalityContentItem}>
          <View>
            <Text style={styles.cardContentTitle}>Animal Count</Text>
            <Text style={styles.cardContentData}>
              {ifEmptyValue(data?.total_animal)}
            </Text>
          </View>
        </View>
        <View style={styles.mortalityContentItem}>
          <View>
            <Text style={styles.cardContentTitle}>Discovered Date</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {Boolean(Number(data?.is_estimate)) ? (
                <MaterialCommunityIcons
                  name="approximately-equal"
                  size={16}
                  color="black"
                  style={{
                    marginTop: Spacing.micro,
                    marginRight: Spacing.mini,
                  }}
                />
              ) : null}
              <Text style={styles.cardContentData}>
                {ifEmptyValue(dateFormatter(data?.created_at, "DD/MM/YYYY"))}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.mortalityContentItem}>
          <View>
            <Text style={styles.cardContentTitle}>Carcass Condition</Text>
            <Text style={styles.cardContentData}>
              {ifEmptyValue(data?.carcass_condition)}
            </Text>
          </View>
        </View>
        <View style={styles.mortalityContentItem}>
          <View>
            <Text style={styles.cardContentTitle}>Carcass Disposition</Text>
            <Text style={styles.cardContentData}>
              {ifEmptyValue(data?.carcass_disposition)}
            </Text>
          </View>
        </View>
        {data?.antz_animal_mortality_media?.length > 0 ? (
          <View style={styles.mortalityContentItem}>
            <View>
              <Text style={styles.cardContentTitle}>Attachments</Text>
              <ImageViewer
                data={data?.antz_animal_mortality_media
                  .filter((i) => i?.file_type?.split("/")[0] == "image")
                  .map((e) => {
                    return {
                      id: e?.id,
                      name: e?.file_original_name,
                      url: e?.media_path,
                    };
                  })}
                horizontal={true}
                width={widthPercentageToDP(41)}
                imgHeight={99}
                imgWidth={widthPercentageToDP(40.5)}
                fileName={true}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.mortalityContentItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardContentTitle}>Notes</Text>
            <View style={styles.mortalityNotesBox}>
              <Text style={[styles.cardContentData, { marginTop: 0 }]}>
                {ifEmptyValue(data?.notes)}
              </Text>
            </View>
          </View>
        </View>
        {data?.submitted_for_necropsy == "1" && data?.necropsy == null ? (
          <View style={styles.mortalityContentItem}>
            <View style={{ flex: 1 }}>
              {/* <Text style={styles.cardContentTitle}>Necropsy</Text> */}
              <SubmitBtn
                buttonText="Add Necropsy"
                onPress={onPress}
                backgroundColor={constThemeColors.secondary}
                color={constThemeColors.onPrimary}
                iconName={"plus"}
                horizontalPadding={0}
              />
            </View>
          </View>
        ) : (
          <View style={styles.mortalityContentItem}>
            <View style={{ flex: 1 }}>
              {/* <Text style={[styles.cardContentTitle, { paddingBottom: hp(0.5) }]}>
              Necropsy
            </Text> */}
              <TouchableOpacity onPress={onPressView}>
                <View style={styles.btnWrapper}>
                  <View>
                    <Text style={styles.btnText}>Necropsy report</Text>
                    <Text style={styles.btnSubText}>20 July 2023</Text>
                  </View>
                  <View>
                    <Text style={styles.btnTextRight}>View</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const style = (reduxColor) =>
  StyleSheet.create({
    container: {
      // marginHorizontal: wp(2),
      marginVertical: Spacing.small,
      backgroundColor: reduxColor.displaybgPrimary,
      // padding: wp(0.5),
    },
    mortalityContentItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      // marginVertical: wp(2),
      marginVertical: Spacing.small,
    },
    cardContentTitle: {
      color: reduxColor.neutralSecondary,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    cardContentData: {
      color: reduxColor.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginTop: Spacing.micro,
    },
    mortalityNotesBox: {
      backgroundColor: reduxColor.notes,
      minHeight: 50,
      borderRadius: 4,
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.minor,
      marginTop: Spacing.mini,
      // width: wp(82),

      display: "flex",
      justifyContent: "center",
    },
    cardContentData: {
      color: reduxColor.onSecondaryContainer,
      fontSize: FontSize.Antz_Minor,
      marginTop: 2,
    },
    btnWrapper: {
      backgroundColor: reduxColor?.primary,
      height: 60,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 8,
      justifyContent: "space-between",
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    btnText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColor?.onPrimary,
    },
    btnSubText: {
      marginTop: Spacing.micro,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColor?.onPrimary,
    },
    btnTextRight: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColor?.onPrimary,
    },
  });

export default MortalityCard;
