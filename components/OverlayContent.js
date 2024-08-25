import { View } from "react-native";
import ImageHeader from "./ImageHeader";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import Colors from "../configs/Colors";
import FontSize from "../configs/FontSize";
import AnimatedHeader from "./AnimatedHeader";
import { LinearGradient } from "expo-linear-gradient";
import Spacing from "../configs/Spacing";

const OverlayContent = (props) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  return (
    <>
      <View
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "space-between",
          //backgroundColor: "#00000066",
        }}
      >
        <LinearGradient colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"]}>
          <AnimatedHeader
            title={props?.title}
            subTitle={props?.preTitle}
            showTitle={true}
          />
        </LinearGradient>
        {/* <ImageHeader title={props.title} /> */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {props?.subtitle ? (
            <View
              style={{
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.40)",
                borderRadius: 4,
                marginBottom: Spacing.minor,
                paddingHorizontal: Spacing.body,
                paddingVertical: Spacing.micro,
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontWeight: FontSize.Antz_Subtext_title.fontWeight,
                  fontSize: FontSize.Antz_Subtext_title.fontSize,
                  textAlign: "center",
                }}
              >
                {props?.subtitle}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default OverlayContent;
