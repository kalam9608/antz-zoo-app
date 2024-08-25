// Created By: wasim Akram
// created at : 04/05/2023

import { Entypo } from "@expo/vector-icons";
import React from "react";
import { FlatList, Image, TouchableOpacity, Dimensions } from "react-native";
import { Text, View } from "react-native";
import { Card, Divider } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { shortenNumber } from "../utils/Utils";
import { useSelector } from "react-redux";
import Colors from "../configs/Colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import FontSize from "../configs/FontSize";

const HousingInsight = ({ title, insightData, ...props }) => {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState("");
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).subtract(1, "week").format("DD MMM YYYY")
  );

  const data = [
    {
      id: 1,
      name: "1W",
      isPreSelected: true,
      date: "week",
      time: 1,
    },
    {
      id: 2,
      name: "1M",
      isPreSelected: false,
      date: "month",
      time: 1,
    },
    {
      id: 3,
      name: "3M",
      isPreSelected: false,
      date: "month",
      time: 3,
    },
    {
      id: 4,
      name: "6M",
      isPreSelected: false,
      date: "month",
      time: 6,
    },
    {
      id: 5,
      name: "1Y",
      isPreSelected: false,
      date: "year",
      time: 1,
    },
    {
      id: 6,
      name: "5Y",
      isPreSelected: false,
      date: "year",
      time: 5,
    },
    {
      id: 7,
      name: "ALL",
      isPreSelected: false,
    },
    {
      id: 8,
      type: "icon",
    },
  ];

  const handleDate = (time, date) => {
    const newDate = moment().subtract(time, date).format("DD MMM YYYY");
    setSelectedDate(newDate);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(moment(date).format("DD MMM YYYY"));
    hideDatePicker();
  };

  // current date
  const currentDate = moment(new Date()).format("DD MMM YYYY");

  const Item = ({ item, onPress }) => {
    return (
      <View>
        {item.type === "icon" ? (
          <TouchableOpacity
            onPress={() => [showDatePicker(), setSelectedId(item.id)]}
          >
            <Feather
              name="calendar"
              size={wp(5)}
              style={[
                styles.item,
                {
                  backgroundColor:
                    selectedId !== ""
                      ? item.id == selectedId
                        ? Colors.locationarrow
                        : null
                      : item.isPreSelected
                      ? Colors.locationarrow
                      : null,
                  left: wp("6%"),
                },
              ]}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
          onPress={() => [
            setSelectedId(item.id),
            handleDate(item.time, item.date),
          ]}
            style={[
              styles.item,
              {
                backgroundColor:
                  selectedId !== ""
                    ? item.id == selectedId
                      ? Colors.locationarrow
                      : null
                    : item.isPreSelected
                    ? Colors.locationarrow
                    : null,
              },
            ]}
          >
            <Text
              style={[
                styles.itemText,
                {
                  color:
                    selectedId !== ""
                      ? item.id == selectedId
                        ? Colors.white
                        : null
                      : item.isPreSelected
                      ? Colors.white
                      : null,
                },
              ]}
            >
              <Text style={{ color: isSwitchOn ? Colors.white : Colors.black }}>
                {` ${item.name} `}
              </Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Item
        style={[styles.itemContainer]}
        item={item}
        onPress={() => setSelectedId(item.id)}
      />
    );
  };

  return (
    <View
      style={[
        // styles.markNode,
        {
          backgroundColor: isSwitchOn
            ? Colors.black
            : Colors.textColorDefaultPrimaryVariationOne,
          borderRadius: wp(2),
          flex: 1,
          width: wp(95),
        },
      ]}
    >
      <Card.Title
        style={[{ marginVertical: hp(1) }]}
        title={title}
        subtitle="Last Updated Today 7:00 AM"
        titleStyle={{
          fontWeight: "400",
          fontSize: hp(2),
          color: isSwitchOn ? Colors.white : Colors.black,

          paddingTop: 2,
        }}
        subtitleStyle={{
          fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
          fontSize: FontSize.Antz_Subtext_Regular.fontSize,
          color: isSwitchOn ? Colors.white : Colors.insigntText,

          marginTop: hp(-0.9),
        }}
        left={(props) => (
          <View
            style={{
              borderRadius: wp(30),
              height: 50,
              width: 50,
              backgroundColor: Colors.backgroundInsights,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={require("../assets/insights.png")} />
          </View>
        )}
      />

      <Entypo
        name="dots-three-vertical"
        size={20}
        style={{
          color: isSwitchOn ? Colors.white : Colors.insightMenu,
          alignSelf: "flex-end",
          top: hp(3.5),
          right: wp(5),
          position: "absolute",
        }}
      />

      <FlatList
        data={data}
        horizontal={true}
        renderItem={renderItem}
        extraData={selectedId}
        contentContainerStyle={{
          paddingHorizontal: wp("8%"),
          justifyContent: "space-between",
          alignItems: "center",
          width: wp("88%"),
        }}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        maximumDate={new Date()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <View style={{ marginHorizontal: wp(6), marginVertical: wp(2) }}>
        <Divider bold={true} />
      </View>

      <Text
        style={{
          width: "90%",
          left: wp(5.2),
          fontWeight: "700",
          fontSize: hp(1.5),
          color: "#006D35",
        }}
      >
        {" "}
        {selectedDate} - {currentDate}{" "}
      </Text>

      <View style={{ marginHorizontal: wp(6), marginVertical: wp(2) }}>
        <Divider bold={true} />
      </View>

      <View
        style={{
          justifyContent: "space-around",
          flexDirection: "row",
          // marginTop: hp(1.5),
          alignItems: "center",
          height: heightPercentageToDP(17),
        }}
      >
        <View style={styles.parent}>
          <Text style={styles.firstNum}>-18%</Text>
          <Text
            style={[
              styles.firstDiv,
              { color: isSwitchOn ? Colors.white : Colors.insightStatsData },
            ]}
          >
            {isNaN(insightData?.total_sections)
              ? "00"
              : shortenNumber(insightData?.total_sections)}
          </Text>
          <Text
            style={[
              styles.textStyle,
              { color: isSwitchOn ? Colors.white : Colors.insightStatslabel },
            ]}
          >
            Sections
          </Text>
        </View>

        <View style={styles.parent}>
          <Text style={styles.firstNum}>-13%</Text>
          <Text
            style={[
              styles.firstDiv,
              { color: isSwitchOn ? Colors.white : Colors.insightStatsData },
            ]}
          >
            {isNaN(insightData?.total_enclosures)
              ? "00"
              : shortenNumber(insightData?.total_enclosures)}
          </Text>
          <Text
            style={[
              styles.textStyle,
              { color: isSwitchOn ? Colors.white : Colors.insightStatslabel },
            ]}
          >
            Enclosures
          </Text>
        </View>

        <View style={styles.parent}>
          <Text style={styles.firstNumPostive}>+13%</Text>
          <Text
            style={[
              styles.firstDiv,
              { color: isSwitchOn ? Colors.white : Colors.insightStatsData },
            ]}
          >
            {isNaN(insightData?.total_animals)
              ? "00"
              : shortenNumber(insightData?.total_animals)}
          </Text>
          <Text
            style={[
              styles.textStyle,
              { color: isSwitchOn ? Colors.white : Colors.insightStatslabel },
            ]}
          >
            Animals
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HousingInsight;

const styles = StyleSheet.create({
  itemText: {
    color: "#1F515B",
    fontSize: hp(1.6),
    fontWeight: "400",
  },
  item: {
    paddingHorizontal: wp(1),
    paddingVertical: hp(0.8),
    borderRadius: 5,
  },
  main: {
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: wp(4),
    marginBottom: wp(7),
    alignItems: "center",
  },
  parent: {
    alignItems: "center",
  },
  firstDiv: {
    fontWeight: "600",
    fontSize: hp(5),
  },
  firstNum: {
    fontWeight: "600",
    fontSize: hp(1.5),
    color: Colors.demoAvtarColor,
  },
  firstNumPostive: {
    fontWeight: "600",
    fontSize: hp(1.5),
    color: Colors.green,
  },
  textStyle: {
    fontWeight: "400",
    fontSize: hp(2),
  },

  markNode: {
    borderColor: "red",
    borderWidth: 1,
  },
});
