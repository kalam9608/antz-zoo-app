import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import { AntDesign, Feather } from "@expo/vector-icons";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Spacing from "../configs/Spacing";
import UserCustomCard from "./UserCustomCard";

const InchargeCard = ({
  outerStyle,
  title,
  selectedUserData,
  removeAsign,
  navigation,
  customStyle,
  icon,
  customContainerPadding,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <View style={outerStyle}>
      <TouchableOpacity onPress={navigation}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: customContainerPadding ?? Spacing.minor,
          }}
        >
          <Text
            style={[
              {
                // fontSize: FontSize.Antz_Minor_Title.fontSize,
                // fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                // color: constThemeColor.onSurface
                color: constThemeColor.onPrimaryContainer,
                fontSize: FontSize.Antz_Minor_Regular.fontSize,
                fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
              },
              customStyle,
            ]}
          >
            {title}
          </Text>
          {icon ? (
            icon
          ) : (
            <AntDesign
              name="pluscircleo"
              size={20}
              color={constThemeColor.addPrimary}
            />
          )}
        </View>
      </TouchableOpacity>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={selectedUserData}
        renderItem={({ item }) => (
          <>
            <Divider bold={true} />
            <UserCustomCard
              selectedStyle={{
                margin: Spacing.small,
                backgroundColor: constThemeColor.displaybgPrimary,
                width: "auto",
              }}
              item={item}
              handleRemove={() => removeAsign(item)}
            />
          </>
        )}
        keyExtractor={(item, index) => `item-${index}`}
      />
    </View>
  );
};

export default InchargeCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    userTitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    designation: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    department: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
  });
