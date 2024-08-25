import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Spacing from "../../../configs/Spacing";
import Header from "../../../components/Header";
import ChatInput from "../../../components/ChatModule/TextInput";
import ButtonCom from "../../../components/ButtonCom";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { groupUpdate } from "../../../services/chatModules/chatsApi";
import { errorDailog, successDailog } from "../../../utils/Alert";
import Loader from "../../../components/Loader";

const ChangeGroupName = (props) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(props.route.params?.item?.group_name);
  }, []);

  const handleSubmit = () => {
    let obj = {
      id: props.route.params?.item?.group_id,
      group_name: name,
    };
    setLoading(true);
    groupUpdate(obj)
      .then((res) => {
        if (res.success) {
          setLoading(false);
          successDailog("Successful!", res.message);
          navigation.goBack();
        }
      })
      .catch((err) => {
        setLoading(false);
        errorDailog("Error!", err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <Header noIcon={true} title={"Enter group name"} />
      <View style={styles.body}>
        <View>
          <ChatInput
            placeholder={name}
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={styles.btnWrapper}>
          <ButtonCom
            title={"Save"}
            buttonStyle={styles.btn}
            textStyle={styles.btnText}
            onPress={handleSubmit}
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
    btnWrapper: {
      position: "absolute",
      bottom: Spacing.minor,
      alignSelf: "center",
      width: wp(100),
    },
    btn: {
      backgroundColor: reduxColors?.primary,
      height: 46,
      marginHorizontal: Spacing.minor,
      borderRadius: Spacing.small,
    },
    btnText: {
      color: reduxColors?.onPrimary,
    },
  });

export default ChangeGroupName;
