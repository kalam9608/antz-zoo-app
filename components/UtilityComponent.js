
import React from "react";
import {
    View,
    Text,
  } from "react-native";
  import { useSelector, connect } from "react-redux";
  import Spacing from "../configs/Spacing";
  import { MaterialIcons } from "@expo/vector-icons";
  import FontSize from "../configs/FontSize";
  
  //Used in Edit permissions
  const PermissionListItem = ({iconColor, permissionTextColor, permissionText, permissionTextStyle}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.mini,
          }}
        >
          <View style={{}}>
            <MaterialIcons
              name="check"
              size={20}
              color={iconColor??constThemeColor?.primary}
            />  
          </View>
          <Text style={[permissionTextStyle ?? {
            fontSize: FontSize.Antz_Body_Regular.fontSize,
            fontWeight: FontSize.Antz_Body_Regular.fontWeight,
            marginLeft: Spacing.mini,
            color: permissionTextColor?? constThemeColor?.onSurfaceVariant, 
            }]}>
           {permissionText}
          </Text>
        </View>
      </>
    );
  }
  export default PermissionListItem;