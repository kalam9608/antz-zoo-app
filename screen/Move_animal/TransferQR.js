import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { useNavigation } from "@react-navigation/native";

const TransferQR = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: constThemeColor?.primaryContainer,
        // paddingTop: "20%",
        alignItems: "center",
        // justifyContent: "space-between",
        // paddingBottom: Spacing.major,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flex: 1,
        }}
      >
        <Text
          style={[
            FontSize.Antz_Large_Title,
            { paddingBottom: Spacing.body, textAlign: "center" },
          ]}
        >
          Transfer Pass
        </Text>
        <Text
          style={[
            FontSize.Antz_Minor_Regular,
            { paddingVertical: Spacing.small, textAlign: "center" },
          ]}
        >
          Transfer Request number
        </Text>
        <Text
          style={[
            FontSize.Antz_Major_Medium,
            {
              paddingBottom: Spacing.minor,
              textAlign: "center",
              textTransform: "uppercase",
            },
          ]}
        >
          {props?.route?.params?.id.toUpperCase()}
        </Text>
        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: constThemeColor?.onPrimary,
              borderRadius: 8,
            }}
          >
            <Image
              source={{
                uri: props?.route?.params?.qrUrl,
              }}
              style={{
                width: 310,
                height: 300,
                resizeMode: "contain",
                padding: Spacing.body,
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ height: 54, marginVertical: Spacing.major }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ApprovalSummary", {
              animal_movement_id: props?.route?.params?.animalMovementId,
              screen: props?.route?.params?.screen,
            })
          }
          style={reduxColors?.btn}
        >
          <Text
            style={[
              FontSize.Antz_Medium_Medium,
              { color: constThemeColor?.onSurface },
            ]}
          >
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransferQR;

const styles = (reduxColors) =>
  StyleSheet.create({
    btn: {
      width: 180,
      height: 54,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: reduxColors?.primary,
      borderRadius: 8,
    },
  });
