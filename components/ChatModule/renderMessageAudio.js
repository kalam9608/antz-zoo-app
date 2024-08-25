import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { Audio } from "expo-av";
import { ProgressBar } from "react-native-paper";

const RenderMessageAudio = (props) => {
  const { currentMessage } = props;
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const loadSound = async () => {
      const newSound = new Audio.Sound();
      try {
        if (currentMessage.audio) {
          await newSound.loadAsync({ uri: currentMessage.audio });
          setSound(newSound);

          // Fetch the duration and update the state
          const { durationMillis } = await newSound.getStatusAsync();
          setDuration(durationMillis);

          // Set a callback for playback status updates
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded) {
              setPosition(status.positionMillis);

              // if (duration === 0 && status.durationMillis > 0) {
              //   setDuration(status.durationMillis);
              // }
            }

            if (status.didJustFinish && !status.isLooping) {
              // Audio finished playing, update the state
              setIsPlaying(false);
              newSound.stopAsync();
              setPosition(0);
            }
          });
        }
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentMessage.audio]);

  const playAudio = async () => {
    if (sound) {
      try {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Error playing/pausing audio:", error);
      }
    }
  };

  let positionValue = moment.duration(position).asMilliseconds();
  let durationValue = moment.duration(duration).asMilliseconds();

  return (
    <Pressable
      onLongPress={() => props.onLongPress(props.context, props.currentMessage)}
    >
      <View
        style={{
          // flexDirection: "row",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name={isPlaying ? "pause" : "play"}
            size={30}
            color={
              currentMessage?.sender_id == UserId
                ? constThemeColor?.onPrimary
                : constThemeColor?.surface
            }
            onPress={() => playAudio()}
          />
          <View style={{}}>
            <ProgressBar
              progress={duration > 0 ? position / duration : 0}
              color={constThemeColor?.surface}
              style={{ width: 100, borderRadius: 10 }}
            />
          </View>
        </View>
        <Text
          style={[
            FontSize.Antz_Subtext_Regular,
            {
              marginTop: Spacing.small,
              color:
                currentMessage?.sender_id == UserId
                  ? constThemeColor?.onPrimary
                  : constThemeColor?.surfaceVariant,
              position: "absolute",
              bottom: 5,
              left: 10,
            },
          ]}
        >
          {moment.utc(positionValue).format("mm:ss")} /{" "}
          {moment.utc(durationValue).format("mm:ss")}
        </Text>
        <Text
          style={[
            styles.timeText,
            {
              marginLeft: Spacing.small,
              color:
                currentMessage?.sender_id == UserId
                  ? constThemeColor.onPrimary
                  : null,
            },
          ]}
        >
          {moment(props?.currentMessage?.createdAt).format("LT")}
        </Text>
      </View>
    </Pressable>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    timeText: {
      fontSize: FontSize.Antz_Small,
      fontWeight: FontSize.weight400,
      alignSelf: "flex-end",
      bottom: -5,
    },
  });

export default RenderMessageAudio;
