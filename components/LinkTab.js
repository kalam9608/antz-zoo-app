import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
import Spacing from "../configs/Spacing";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheetModalStyles from "../configs/BottomSheetModalStyles";
export default function LinkTab({ tabIcon, tabText, navigateIcon, onPress }) {
  const propsCustom = {
    tabIcon:
      tabIcon === undefined || tabIcon === "" ? (
        <FontAwesome
          name="circle"
          size={50}
          color={constThemeColor.onSurfaceVariant}
        />
      ) : (
        tabIcon
      ),
    tabText: tabText === undefined || tabText === "" ? "Go To Screen" : tabText,
    navigateIcon:
      navigateIcon === undefined || navigateIcon === "" ? null : navigateIcon,
    onPress,
  };
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet = BottomSheetModalStyles.ShodowOpacity(constThemeColor);
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={[
          reduxColors.contStyle,
          {
            elevation: stylesSheet.elevationShadow.elevation,
            shadowColor: stylesSheet.elevationShadow.shadowColor,
          },
        ]}
      >
        <View style={reduxColors.listItem}>
          <View style={reduxColors.tabIconAndText}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {propsCustom.tabIcon}
            </View>
            <Text style={reduxColors.tabText}>{propsCustom.tabText}</Text>
          </View>
          <View>{propsCustom.navigateIcon}</View>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = (reduxColors) =>
  StyleSheet.create({
    contStyle: {
      marginHorizontal: Spacing.body,
      marginTop: Spacing.body,
    },
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tabIconAndText: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    tabText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginLeft: Spacing.minor,
    },
    listItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: reduxColors.onPrimary,
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.minor,
      borderRadius: Spacing.small,
    },
  });
