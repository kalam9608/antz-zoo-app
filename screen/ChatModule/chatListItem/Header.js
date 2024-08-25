import * as React from "react";
import { Appbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = (props) => {
  
  const navigation = useNavigation();

  const gotoBack = () => navigation.goBack();
  return (
    <Appbar.Header mode="small">
      <Ionicons
        name="arrow-back"
        size={28}
        color="black"
        style={{ marginLeft: 5 }}
        onPress={gotoBack}
      />

      <Appbar.Content title={props.title} style={{ left: 20,}} />

      <Ionicons
        name={props.name}
        size={24}
        color="black"
        style={{ marginRight: 5 }}
      />
    </Appbar.Header>
  );
};

export default Header;
