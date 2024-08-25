import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";

const DATA = [
  {
    id: "1",
    title: "ADD ANIMAL",
    screen: "AnimalAddDynamicForm",
  },
  // {
  //   id: "2",
  //   title: "ADD EGGS",
  //   screen: "EggsAddForm",
  // },
  {
    id: "3",
    title: "ADD GROUP OF ANIMALS",
    screen: "AddAnimals",
  }
];

const Item = ({ title, screen }) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  return (
    <View style={dynamicStyles.item}>
      <Text onPress={() => navigation.navigate(`${screen}`)}>{title}</Text>
    </View>
  );
};

export default function Accession() {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const renderItem = ({ item }) => (
    <Item title={item.title} screen={item.screen} />
  );
  return (
    <>
      <Header title="Accession" noIcon={true} />
      <View style={dynamicStyles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </>
  );
}

const styles = (DarkModeReducer) =>
  StyleSheet.create({
    container: {
      paddingTop: 30,
      padding: 2,
      backgroundColor: DarkModeReducer.ContainerBackgroundColor,
      height: "100%",
    },
    item: {
      backgroundColor: DarkModeReducer.onPrimary,
      padding: 20,
      marginVertical: Spacing.small,
      marginHorizontal: Spacing.minor,
    },
  });
