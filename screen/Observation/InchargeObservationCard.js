import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useRef } from "react";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Spacing from "../../configs/Spacing";
import UserCustomCard from "../../components/UserCustomCard";

const InchargeObservationCard = ({
  icontrue,
  outerStyle,
  title,
  selectedUserData,
  removeAsign,
  navigation,
  customStyle,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const ref = useRef();

  // Function to scroll to the when remove the member from the list
  useEffect(() => {
    scrollToTop();
  }, [selectedUserData]);

  const scrollToTop = () => {
    if (ref.current) {
      ref.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  return (
    <View style={outerStyle}>
      <TouchableOpacity onPress={navigation}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: Spacing.minor,
            backgroundColor:
              selectedUserData?.length > 0
                ? constThemeColor.displaybgPrimary
                : constThemeColor.surface,
            // borderRadius: Spacing.small,
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {icontrue && (
              <MaterialCommunityIcons
                name="home-plus-outline"
                size={24}
                color={constThemeColor.OnPrimaryContainer}
              />
            )}
            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Minor_Medium.fontSize,
                  fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                  marginLeft: icontrue ? Spacing.small : Spacing.major,
                },
                customStyle,
              ]}
            >
              {title}
            </Text>
          </View>

          <AntDesign
            name="pluscircleo"
            size={20}
            color={constThemeColor.addPrimary}
          />
        </View>
      </TouchableOpacity>
      {selectedUserData.length > 0 ? <Divider bold={true} /> : null}
      <FlatList
        ref={ref}
        showsVerticalScrollIndicator={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={selectedUserData}
        renderItem={({ item }) => (
          <UserCustomCard
            selectedStyle={{ width: "auto", margin: Spacing.mini }}
            item={item}
            handleRemove={() => removeAsign(item)}
          />
        )}
        keyExtractor={(item, index) => `item-${index}`}
      />
    </View>
  );
};

export default InchargeObservationCard;

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
