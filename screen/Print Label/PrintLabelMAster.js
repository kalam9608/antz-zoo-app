import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import Colors from "../../configs/Colors";
import Spacing from "../../configs/Spacing";

const DATA = [
  {
    id: "1",
    title: "Sections",
    type: "section",
  },
  {
    id: "2",
    title: "Enclosures",
    type: "enclosure",
  },
  {
    id: "3",
    title: "Animals",
    type: "animal",
  },
  {
    id: "4",
    title: "Users",
    type: "user",
  },
];

const Item = ({ title, type }) => {
  const navigation = useNavigation();
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => navigation.navigate("PrintLabel", { type })}
      style={reduxColors.item}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default function PrintLabelMAster() {
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const renderItem = ({ item }) => <Item title={item.title} type={item.type} />;
  return (
    <>
      <Header title="Print Label" noIcon={true} />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </>
  );
}

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: hp(4),
    },
    item: {
      backgroundColor: reduxColors.onPrimary,
      padding: 20,
      marginVertical: Spacing.small,
      marginHorizontal: Spacing.minor,
      borderRadius: 5,
    },
  });
