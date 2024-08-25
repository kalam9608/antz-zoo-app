import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import ViewSlider from "react-native-view-slider";
import FontSize from "../configs/FontSize";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import { opacityColor } from "../utils/Utils";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const InsightDataCarousel = ({ data, ...props }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const navigation = useNavigation();
  const handlePress = (type) => {
    if (type === "population") {
      navigation.navigate("Listing", {
        type: "animals",
        class_type: props?.classType,
        tsn_id: props?.tsn_id,
        totalCount: props?.populationData,
      });
    } else if (type === "species") {
      navigation.navigate("Listing", {
        type: "species",
        class_type: props?.classType,
        tsn_id: props?.tsn_id,
        totalCount: props.species,
      });
    }
  };
  return (
    <>
      <ViewSlider
        renderSlides={
          <>
            {data.map((items, index) => {
              return (
                <View style={[reduxColors.viewBox]} key={index}>
                  <View style={reduxColors.insideFlat}>
                    {items.map((item) => (
                      <TouchableOpacity onPress={() => handlePress(item.type)}>
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={reduxColors.numStyle}>{item.num}</Text>
                          <Text style={reduxColors.TextStyle}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
          </>
        }
        style={reduxColors.slider}
        height={90}
        slideCount={data.length > 1 ? data.length : null}
        dots={true}
        dotActiveColor={constThemeColor.outline}
        dotInactiveColor={opacityColor(constThemeColor.neutralPrimary, 5)}
        dotsContainerStyle={reduxColors.dotContainer}
        
      />
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    viewBox: {
      justifyContent: "center",
      width: width,
      alignItems: "center",
      height: 70,
      flexDirection: "row",
    },
    slider: {
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
    },
    dotContainer: {
      backgroundColor: "transparent",
      position: "absolute",
      bottom: -10,
    },
    insideFlat: {
      width: "40%",
      flexDirection: "row",
      justifyContent: "space-around",
    },
    numStyle: {
      fontSize: FontSize.Antz_Stat_Title.fontSize,
      fontWeight: FontSize.Antz_Stat_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    TextStyle: {
      fontSize: FontSize.Antz_Strong,
    },
  });

export default InsightDataCarousel;
