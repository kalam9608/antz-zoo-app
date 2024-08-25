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
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import {
  checkPermissionAndNavigateWithAccess,
} from "../../utils/Utils";

const DATA = [
  {
    id: "1",
    title: "ADD DESIGNATION ",
    screen: "CreateDesignation",
    key: "add_designations",
  },
  {
    id: "2",
    title: "ADD DEPARTMENT",
    screen: "empDepartment",
    key: "add_departments",
  },
  {
    id: "3",
    title: "ADD ID PROOFS",
    screen: "ClientIdproof",
    key: "add_id_proofs",
  },
  {
    id: "4",
    title: "EDUCATION TYPE",
    screen: "Education",
    key: "add_educations",
  },
  {
    id: "6",
    title: "MEDICAL MASTERS",
    screen: "medicalMastersData",
    key: "not_required",
  },
  {
    id: "7",
    title: "TRANSFERS",
    screen: "ListOfTransfers",
    key: "not_required",
  },
  {
    id: "8",
    title: "INSTITUTE MASTERS",
    screen: "InstituteList",
    key: "add_institutes_for_animal_transfer",
  },
  {
    id: "9",
    title: "TAXONOMY",
    screen: "SpeciesMaster",
    key: "add_taxonomy",
  },
  {
    id: "10",
    title: "ROLE",
    screen: "RoleList",
    key: "allow_creating_roles",
  },
  {
    id: "11",
    title: "ORGANIZATION",
    screen: "OrganizationList",
    key: "add_organizations",
  },
];

const Item = ({ title, screen, item }) => {
  const navigation = useNavigation();
  // fot taking styles from redux use this function
  const permission = useSelector((state) => state.UserAuth.permission);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() =>
        checkPermissionAndNavigateWithAccess(
          permission,
          item.subKey,
          navigation,
          screen,
          {},
          "DELETE"
        )
      }
      style={reduxColors.item}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default function Master() {
  const masterMenu = useFilteredArray(DATA);
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const renderItem = ({ item }) => (
    <Item title={item.title} screen={item.screen} item={item} />
  );
  return (
    <>
      <Header title="Masters" noIcon={true} />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        <FlatList
          data={masterMenu}
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
      // paddingTop: hp(4),
    },
    item: {
      backgroundColor: reduxColors.onPrimary,
      padding: 20,
      marginVertical: Spacing.small,
      marginHorizontal: Spacing.minor,
      borderRadius: 5,
    },
  });
