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
import { useFilteredArray } from "../../components/Custom_hook/UserPermissionHook";

const DATA = [
  {
    id: "1",
    title: "DIAGNOSIS",
    screen: "diagnosisList",
    key: "medical_add_diagnosis",
  },
  // {
  //   id: "2",
  //   title: "MEDICINES",
  //   screen: "prescriptionList",
  //   key: "medical_add_prescription",
  // },
  {
    id: "3",
    title: "COMPLAINTS",
    screen: "complaintsList",
    key: "medical_add_complaints",
  },
  {
    id: "4",
    title: "PRESCRIPTION DOSAGES",
    screen: "prescriptionDosagesList",
    key: "medical_add_prescription",
  },
  {
    id: "5",
    title: "CASE TYPES",
    screen: "medicalCaseType",
    key: "add_case_type",
  },
  {
    id: "6",
    title: "ADVICES",
    screen: "medicalAdvicesList",
    key: "medical_add_advices",
  },
];

export default function MedicalMaster() {
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const menuItems = useFilteredArray(DATA);

  const renderItem = ({ item }) => (
    <Item title={item.title} screen={item.screen} />
  );

  const Item = ({ title, screen }) => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate(`${screen}`)}
        style={reduxColors.item}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Header title="Medical Masters" noIcon={true} />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        <FlatList
          data={menuItems}
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
