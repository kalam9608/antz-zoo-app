import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Video } from "expo-av";


const RenderMessageVideo = (props) => {
    const { currentMessage } = props;

    return (
      <View style={{ position: "relative", height: 150, width: 250 }}>
        <Video
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 150,
            width: 250,
            borderRadius: 20,
          }}
          posterSource={{
            uri: "https://m.media-amazon.com/images/I/5192PBp8rHL.jpg",
          }}
          posterStyle={{ resizeMode: "cover" }}
          useNativeControls
          usePoster={true}
          shouldPlay={play}
          isLooping={false}
          rate={1.0}
          resizeMode="cover"
          height={150}
          width={250}
          muted={true}
          source={{ uri: currentMessage?.video }}
          allowsExternalPlayback={false}
          onPlaybackStatusUpdate={(status) => setPlayStatus(() => status)}
        />
        {!play ? (
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 150,
              width: 250,
              borderRadius: 20,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => setPlay(!play)}>
              <MaterialCommunityIcons
                name={!play ? "play-circle-outline" : "pause-circle-outline"}
                size={50}
                color={constThemeColor?.onPrimary}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };


  const style = (reduxColors) => StyleSheet.create({

  })

  export default RenderMessageVideo;