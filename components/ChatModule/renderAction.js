import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const RenderAction = ({onPress}) => {
    return (
      <TouchableOpacity style={{ margin: 8 }} onPress={onPress}>
        <MaterialCommunityIcons name="plus" size={24} />
      </TouchableOpacity>
    );
  };

export default RenderAction;