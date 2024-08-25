import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import QRCodeScanner from "../components/CamScanner";
import HomeScreen from "../screen/Home";
import Module from "../screen/Module";
import Profile from "../screen/Staff Management/Profile";
import { useSelector } from "react-redux";
import Colors from "../configs/Colors";
import NewCamScanner from "../components/NewCamScanner";
import ObservationList from "../screen/Observation/ObservationList";

const Tab = createMaterialBottomTabNavigator();

const BottomTabs = () => {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      shifting={false}
      sceneAnimationEnabled={true}
      barStyle={{ backgroundColor: constThemeColor.surfaceVariant }}

    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return focused ? (
              <MaterialCommunityIcons name="home" size={24} color={ color} />
            ) : (
              <MaterialCommunityIcons
                name="home-outline"
                size={24}
                color={ color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Module}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return focused ? (
              <MaterialCommunityIcons name="widgets" size={24} color={color} />
            ) : (
              <MaterialCommunityIcons
                name="widgets-outline"
                size={24}
                color={isSwitchOn? Colors.white: color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Scan"
        component={NewCamScanner}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return focused ? (
              <MaterialCommunityIcons name="qrcode-scan" size={24} color={color} />
            ) : (
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={24}
                color={isSwitchOn? Colors.white: color}
              />
            );
          },
        }}
        
      />
      <Tab.Screen
        name="Notes"
        component={ObservationList}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return focused ? (
              <MaterialCommunityIcons name="note" size={24} color={color} />
            ) : (
              <MaterialCommunityIcons name="note-outline" size={24} color={isSwitchOn? Colors.white: color}/>
            );
          },
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return focused ? (
              <MaterialCommunityIcons
                name="account-circle"
                size={24}
                color={color}
              />
            ) : (
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={24}
                color={isSwitchOn? Colors.white: color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
