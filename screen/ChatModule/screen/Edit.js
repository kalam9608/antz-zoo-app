import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import FontSize from "../../../configs/FontSize";
import Spacing from "../../../configs/Spacing";
import { useSelector } from "react-redux";
import Header from "../../../components/Header";
import ChatInput from "../../../components/ChatModule/TextInput";
import ButtonCom from "../../../components/ButtonCom";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const Edit = () => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  return (
    <View style={styles.container}>
      <Header noIcon={true} title={"Edit contact"} />
      <View style={styles.body}>
        <View style={styles.inputWrapper}>
          <View style={styles.inputLeftIcon}>
            <MaterialIcons
              name="person"
              size={24}
              color={constThemeColor?.onSurfaceVariant}
            />
          </View>
          <View style={styles.middleSection}>
            <View style={{ marginVertical: Spacing.small }}>
              <Text
                style={[
                  FontSize.Antz_Minor_Regular,
                  { color: constThemeColor?.onSurfaceVariant },
                ]}
              >
                First name
              </Text>
              <ChatInput
                value={firstName}
                placeholder={firstName}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>
            <View style={{ marginVertical: Spacing.small }}>
              <Text
                style={[
                  FontSize.Antz_Minor_Regular,
                  { color: constThemeColor?.onSurfaceVariant },
                ]}
              >
                Last name
              </Text>
              <ChatInput
                value={lastName}
                placeholder={lastName}
                onChangeText={(text) => setLastName(text)}
              />
            </View>
          </View>
        </View>
        <View style={styles.btnWrapper}>
          <ButtonCom
            title={"Save"}
            textStyle={[styles.btnText, FontSize.Antz_Minor_Regular]}
            buttonStyle={styles.btn}
            buttonColor={constThemeColor?.primary}
          />
        </View>
      </View>
    </View>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors?.background,
    },
    body: {
      flex: 1,
      padding: Spacing.body,
    },
    inputWrapper: {
      backgroundColor: reduxColors?.onBackground,
      marginVertical: Spacing.small,
      flexDirection: "row",
    },
    inputLeftIcon: {
      paddingHorizontal: Spacing.mini,
      marginRight: Spacing.small,
    },
    middleSection: {
      flex: 1,
    },
    btnWrapper: {
      position:'absolute',
      bottom:Spacing.body,
      alignSelf: "center",
      width: wp(90),
    },
    btn: {
      backgroundColor: reduxColors?.primary,
      height: 46,
      borderRadius:Spacing.small
    },
    btnText:{
        color:reduxColors?.onPrimary
    }
  });

export default Edit;
