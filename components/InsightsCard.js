import { AntDesign, Entypo } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { Text, View } from "react-native";
import { Card, Divider } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { shortenNumber } from "../utils/Utils";
import { useSelector } from "react-redux";
import Colors from "../configs/Colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import FontSize from "../configs/FontSize";
// import type {} from 'react-native';
const InsightsCard = ({
  title,
  insightData,
  mortalityObj = {},
  mortalityType = "",
  ...props
}) => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState("");
  const [expand, setExpand] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).subtract(1, "week").format("DD MMM YYYY")
  );

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  const toggleView = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpand(!expand);
  };

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
                  color: selectedId
                    ? item.id == selectedId
                      ? Colors.white
                      : null
                    : item.isPreSelected
                    ? Colors.white
                    : null,
                },
              ]}
            >
              <Text
                style={{
                  color: isSwitchOn
                    ? Colors.white
                    : item?.isPreSelected
                    ? Colors.black
                    : Colors.black,
                }}
              >
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
          borderRadius: wp(3),
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

          paddingTop: 1,
        }}
        subtitleStyle={{
          fontWeight: "400",
          fontSize: FontSize.Antz_Subtext_Regular.fontSize,
          color: isSwitchOn ? Colors.white : Colors.insigntText,

          marginTop: hp(-1),
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
          paddingHorizontal: wp("7.5%"),
          justifyContent: "space-between",
          alignItems: "center",
          width: wp("86%"),
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
          color: Colors.count,
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
          margin: wp(3),
        }}
      >
        {/* If text has +num% then give style= {styles.firstNumPostive} else style= {style.firstNum} */}
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={styles.firstNumPostive}> +23%</Text>
          <Text
            style={{
              fontWeight: "600",
              fontSize: hp(5),
              lineHeight: hp(7),
              textAlign: "center",
              color: isSwitchOn ? Colors.white : Colors.insightStatsData,
            }}
          >
            {shortenNumber(27)}
          </Text>
          <Text
            style={{
              fontWeight: "400",
              fontSize: hp(2),
              textAlign: "center",
              color: isSwitchOn ? Colors.white : Colors.insightStatslabel,
            }}
          >
            Species
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontWeight: "600",
              fontSize: hp(1.5),
              color: Colors.demoAvtarColor,
            }}
          >
            -3%
          </Text>
          <Text
            style={{
              fontWeight: "600",
              fontSize: hp(5),
              lineHeight: hp(7),
              color: isSwitchOn ? Colors.white : Colors.insightStatsData,
            }}
          >
            {shortenNumber(133)}
          </Text>
          <Text
            style={{
              fontWeight: "400",
              fontSize: hp(2),
              color: isSwitchOn ? Colors.white : Colors.insightStatslabel,
            }}
            onPress={()=>navigation.navigate("InsightsCardComp")}
          >
            Population
          </Text>
        </View>
      </View>

      {/* last div */}
      <View
        style={{
          justifyContent: "space-around",
          flexDirection: "row",
          marginTop: hp(1.5),
          alignItems: "center",
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
            {/* {" "} */}
            {shortenNumber(props.middlelabel)}
          </Text>
          <Text
            style={[
              styles.textStyle,
              { color: isSwitchOn ? Colors.white : Colors.insightStatslabel },
            ]}
          >
            Accession
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
            {/* {" "} */}
            {shortenNumber(props.middlabel)}
          </Text>
          <Text
            style={[
              styles.textStyle,
              { color: isSwitchOn ? Colors.white : Colors.insightStatslabel },
            ]}
          >
            Birth
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (mortalityObj) {
              navigation.navigate("Mortality", {
                mortalityObj: mortalityObj,
                mortalityType: mortalityType,
              });
            }
          }}
          style={styles.parent}
        >
          <Text style={styles.firstNumPostive}>+13%</Text>
          <Text
            style={[
              styles.firstDiv,
              { color: isSwitchOn ? Colors.white : Colors.insightStatsData },
            ]}
          >
            {/* {" "} */}
            {shortenNumber(props.lastlabel)}
          </Text>
          <Text
            style={[
              styles.textStyle,
              { color: isSwitchOn ? Colors.white : Colors.insightStatslabel },
            ]}
          >
            Mortality
          </Text>
        </TouchableOpacity>
      </View>

      {/* Send the Props  */}

      {expand && (
        <View style={styles.main}>
          <View style={{ alignItems: "center", width: "33%" }}>
            <Text style={[styles.firstNum]}>-3%</Text>
            <Text
              style={[
                styles.firstDiv,
                { color: isSwitchOn ? Colors.white : Colors.insightStatsData },
              ]}
            >
              {shortenNumber(877)}
            </Text>
            <Text
              style={[
                styles.textStyle,
                { color: isSwitchOn ? Colors.white : Colors.insightStatslabel },
              ]}
            >
              Egg
            </Text>
          </View>

          <View style={{ alignItems: "center", width: "33%" }}>
            <Text style={styles.firstNum}>-3%</Text>
            <Text
              style={[
                styles.firstDiv,
                { color: isSwitchOn ? Colors.white : Colors.insightStatsData },
              ]}
            >
              {shortenNumber(425)}
            </Text>
            <Text
              style={[
                styles.textStyle,
                { color: isSwitchOn ? Colors.white : Colors.insightStatslabel },
              ]}
            >
              Incubation
            </Text>
          </View>

          <View style={{ alignItems: "center", width: "33%" }}>
            <Text style={styles.firstNumPostive}>+13%</Text>
            <Text
              style={[
                styles.firstDiv,
                { color: isSwitchOn ? Colors.white : Colors.insightStatsData },
              ]}
            >
              {/* {" "} */}
              {shortenNumber(455)}
            </Text>
            <Text
              style={[
                styles.textStyle,
                { color: isSwitchOn ? Colors.white : Colors.insightStatslabel },
              ]}
            >
              Hand Raised
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        activeOpacity={1}
        onPress={toggleView}
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          flexDirection: "row",
        }}
      >
        <Text
          style={[
            styles.textStyle,
            { color: isSwitchOn ? Colors.white : Colors.insightStatslabel },
          ]}
        >
          {expand ? "Less" : "More"}
        </Text>
        <AntDesign
          name={expand ? "up" : "down"}
          size={15}
          style={{ paddingTop: 5 }}
          color={isSwitchOn ? Colors.white : Colors.arrowColor}
        />
      </TouchableOpacity>
    </View>
  );
};

export default InsightsCard;

const styles = StyleSheet.create({
  itemText: {
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
    alignItems: "center",
  },
  parent: {
    alignItems: "center",
    width: "33%",
  },
  firstDiv: {
    fontWeight: "600",
    fontSize: hp(4),
    textAlign: "center",
  },
  firstNum: {
    fontWeight: "600",
    fontSize: hp(1.5),
    color: "#E93353",
  },
  firstNumPostive: {
    fontWeight: "600",
    fontSize: hp(1.5),
    color: "#006D35",
  },
  textStyle: {
    fontWeight: "400",
    fontSize: hp(2),
    color: "#666666",
  },

  markNode: {
    borderColor: "red",
    borderWidth: 1,
  },
});
