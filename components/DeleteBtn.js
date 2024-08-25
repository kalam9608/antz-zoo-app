//Create by :gaurav shukla
// Date:15-05-2023
//  here is only  two props  will be pass  OnPress ,Title

import React from "react";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import Colors from "../configs/Colors";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";

const DeleteBtn=({onPress,Title,firstTitle})=>{
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
      return(
        <>
      <TouchableOpacity
          onPress={onPress}
          style={{
            width: "100%",
            alignSelf: "center",
            marginTop: 10,
            marginBottom:10,
            borderWidth: 1,
            borderColor: constThemeColor.danger,
            minHeight: 45,
            borderRadius: 5,
            backgroundColor:constThemeColor.onDanger
         
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              fontSize: FontSize.Antz_Minor_Regular.fontSize,
              color: constThemeColor.danger,
              textAlign:'center',
              paddingVertical:12,
           

            }}
          >
            {firstTitle ? firstTitle+" "+Title :"Delete "+Title}
          </Text>
        </TouchableOpacity>
        </>
      )
}

export default DeleteBtn;