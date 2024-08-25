import React, { useEffect, useState } from "react";
import {
  Platform,
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  TouchableWithoutFeedback,
} from "react-native";

// import Voice from '@react-native-voice/voice';

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Colors from "../configs/Colors";
import Constants from "expo-constants";
import { errorToast } from "../utils/Alert";
import FontSize from "../configs/FontSize";
import { useToast } from "../configs/ToastConfig";

const VoiceText = ({ icon, containerstyle, resultValue = () => {} }) => {
  const [result, setResult] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const { showToast } = useToast();
  const customProps = {
    icon:
      icon === undefined ? (
        <Ionicons
          name="mic-outline"
          size={24}
          style={{ color: isSwitchOn ? Colors.white : Colors.arrowColor }}
        />
      ) : (
        icon
      ),
  };
  const isExpoGo = Constants.appOwnership === "expo";

  useEffect(() => {
    if (!isExpoGo) {
      import("@react-native-voice/voice").then((Voice) => {
        Voice.onSpeechStart = onSpeechStartHandler;
        Voice.onSpeechEnd = onSpeechEndHandler;
        Voice.onSpeechResults = onSpeechResultsHandler;

        return () => {
          Voice.destroy().then(Voice.removeAllListeners);
        };
      });
    }
  }, []);

  const onSpeechStartHandler = (e) => {};
  const onSpeechEndHandler = (e) => {
    setLoading(false);
  };

  const onSpeechResultsHandler = (e) => {
    let text = e.value[0];
    setResult(text);
    resultValue(text);
  };

  const startRecording = async () => {
    setLoading(true);
    try {
      if (!isExpoGo) {
        const Voice = await import("@react-native-voice/voice");
        await Voice.start("en-Us");
      }
    } catch (error) {
      // errorToast("Oops!", "Something went wrong!!");
      showToast("error", "Oops! Something went wrong!!");
    }
  };

  const stopRecording = async () => {
    try {
      if (!isExpoGo) {
        const Voice = await import("@react-native-voice/voice");
        await Voice.stop();
      }
    } catch (error) {
      showToast("error", "Oops! Something went wrong!!");
      // errorToast("Oops!", "Something went wrong!!");
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.buttonStyle]}
        onPress={() => {
          setShowModal(true);
          startRecording();
        }}
        // onPressOut={stopRecording}
      >
        {customProps.icon}
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        onPress={() => {
          setShowModal(false);
          // stopRecording()
        }}
        onRequestClose={() => {
          setShowModal();
          stopRecording();
        }}
      >
        <View style={[styles.modalMaster, {}]}>
          <TouchableOpacity
            onPress={() => {
              setShowModal(false);
              stopRecording();
            }}
            style={[styles.modalOverlay, {}]}
          ></TouchableOpacity>

          <View style={styles.crossbutton}>
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                stopRecording();
              }}
              style={{}}
            >
              <Text
                style={{ fontSize: FontSize.Antz_Minor_Medium_title.fontSize }}
              >
                X
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalview}>
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.textStyle}>Listening</Text>
            </View>

            <View>
              <Image
                source={require("../assets/sound.gif")}
                style={styles.imagestyle}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },

  modalMaster: {
    flex: 1,
  },

  modalOverlay: {
    flex: 0.7,
  },

  modalview: {
    width: "100%",
    backgroundColor: "white",
    // position: "relative",
    flex: 0.3,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
    transform: [{ scaleX: 2 }],
  },

  textStyle: {
    fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
    color: "red",
    alignSelf: "center",
    marginTop: "12%",
    transform: [{ scaleX: 0.5 }],
  },

  imagestyle: {
    width: "29%",
    height: "50%",
    alignSelf: "center",
    marginTop: "9%",
    transform: [{ scaleX: 0.5 }],
  },

  crossbutton1: {
    position: "absolute",
    top: -25,
    left: 102,
    zIndex: 999999999,
    backgroundColor: "teal",
  },

  crossbutton: {
    marginLeft: widthPercentageToDP("5%"),
    backgroundColor: "grey",
    width: widthPercentageToDP("8%"),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VoiceText;
