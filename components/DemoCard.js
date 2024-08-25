import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native";
import { Avatar, Card } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../configs/Colors";
import { useSelector } from "react-redux";
import { opacityColor } from "../utils/Utils";
export default function DemoCard({ data, isSwitchOn }) {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);

  return (
    <FlatList
      data={data}
      renderItem={(item) => (
        <Card
          style={{
            marginBottom: hp(2),
            backgroundColor: constThemeColor.onPrimary,
            shadowColor:opacityColor(constThemeColor.neutralPrimary,15)
          }}
          elevation={0.5}
        >
         
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Card.Title
              title="Paradise"
              subtitle="2 day ago"
              style={{ width: "80%" }}
              titleStyle={{
                fontWeight: "400",
                fontSize: hp(2),
              }}
              subtitleStyle={{
                fontWeight: "200",
                fontSize: hp(1.5),
                marginTop: -3,
              }}
       
            />
            <Entypo
              name="dots-three-vertical"
              size={20}
              style={{
                color:constThemeColor.insightMenu,
                right: wp(5),
                top: 30,
              }}
            />
          </View>

          <Card.Cover source={require("../assets/maccow.jpg")}  style={{height:wp(50)}}/>
          <Card.Content style={{}}>
            <Text
              style={{
                color: constThemeColor.neutralPrimary,
                margin: hp(1),
                fontWeight: "300",
                fontSize: hp(2),
              }}
            >
              Today we have a new scarlet macaw added to our Paradise Macaw
              section
            </Text>
          </Card.Content>
        </Card>
      )}
    />
  );
}