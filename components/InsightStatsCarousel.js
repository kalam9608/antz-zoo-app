import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
import { opacityColor } from "../utils/Utils";
import { useNavigation } from "@react-navigation/native";
import Background from "./BackgroundImage";

const InsightStatsCarousel = ({ data, ...props }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const [activeSlide, setActiveSlide] = useState(0);
  const navigation = useNavigation();
  const handlePress = (type) => {
    if (type === "population" && props?.populationData > 0) {
      navigation.navigate("Listing", {
        type: "animals",
        class_type: props?.classType,
        tsn_id: props?.tsn_id,
        totalCount: props?.populationData,
      });
    } else if (type === "species" && props?.species > 0) {
      navigation.navigate("Listing", {
        type: "species",
        class_type: props?.classType,
        tsn_id: props?.tsn_id,
        totalCount: props.species,
      });
    } else if (type === "Sites" && props?.siteData > 0) {
      navigation.navigate("CollectionSliderListing", {
        class_type: props?.classType,
        species_id: props?.tsn_id,
        data_type: "site",
        total_count: props?.siteData,
      });
    } else if (type === "Sections" && props?.sectionData > 0) {
      navigation.navigate("CollectionSliderListing", {
        class_type: props?.classType,
        species_id: props?.tsn_id,
        data_type: "section",
        total_count: props?.sectionData,
      });
    } else if (type === "Enclosures" && props?.enclosureData > 0) {
      navigation.navigate("CollectionSliderListing", {
        class_type: props?.classType,
        species_id: props?.tsn_id,
        data_type: "enclosure",
        total_count: props?.enclosureData,
      });
    }
  };
  const renderDataItem = ({ item }) => (
    <View style={reduxColors.slide}>
      <View style={reduxColors.insideFlat}>
        <Background
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {item.map((subItem, index) => (
            <TouchableOpacity onPress={() => handlePress(subItem.type)}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={reduxColors.numStyle}>{subItem.num}</Text>
                <Text style={reduxColors.TextStyle}>{subItem.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Background>
      </View>
    </View>
  );

  return (
    <View style={reduxColors.container}>
      <Carousel
        data={data === undefined ? null : data}
        renderItem={renderDataItem}
        sliderWidth={Dimensions.get("window").width / 2}
        itemWidth={Dimensions.get("window").width / 2}
        onSnapToItem={(index) => setActiveSlide(index)}
      />

      <Pagination
        dotsLength={data === undefined ? null : data.length}
        activeDotIndex={activeSlide}
        containerStyle={reduxColors.paginationContainer}
        dotStyle={reduxColors.paginationDot}
        inactiveDotStyle={reduxColors.paginationInactiveDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      // flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    slide: {
      // flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 5,
      backgroundColor: reduxColors.outline,
      marginBottom: -6,
    },
    paginationInactiveDot: {
      width: 8,
      height: 8,
      borderRadius: 5,
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 15),
      marginBottom: -6,
    },
    paginationContainer: {
      paddingVertical: 12,
    },
    insideFlat: {
      width: "85%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingTop: 8,
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

export default InsightStatsCarousel;
