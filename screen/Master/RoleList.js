import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { getRoleListDetails } from "../../services/staffManagement/addPersonalDetails";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../configs/Colors";
import AddMedicalRecordCard from "../../components/AddMedicalRecordCard";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import FloatingButton from "../../components/FloatingButton";
import { heightPercentageToDP } from "react-native-responsive-screen";
import ListEmpty from "../../components/ListEmpty";
import Loader from "../../components/Loader";
import { checkPermissionAndNavigate } from "../../utils/Utils";
import { useToast } from "../../configs/ToastConfig";
const RoleList = () => {
  const [roleList, setRoleList] = useState([]);
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const permission = useSelector((state) => state.UserAuth.permission);
  const [isLoading, setIsLoading] = useState(false);
  const reduxColors = styles(constThemeColor);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      getRoleList();
    });
    return unsubscribe;
  }, [navigation]);
  const getRoleList = () => {
    getRoleListDetails()
      .then((v) => {
        setRoleList(v?.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        errorToast("error", "Oops! Something went wrong!");
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: constThemeColor.surfaceVariant }}>
      <Header noIcon={true} title={"Role"} />
      <Loader visible={isLoading} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={roleList}
        contentContainerStyle={{
          paddingBottom: 50,
          paddingHorizontal: Spacing.minor,
        }}
        renderItem={({ item }) => {
          return (
            <AddMedicalRecordCard
              onPress={() =>
                checkPermissionAndNavigate(
                  permission,
                  "allow_creating_roles",
                  navigation,
                  "EditRole",
                  {
                    role_id: item?.id,
                    user_id: "",
                  }
                )
              }
              children={
                <>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 15,
                      }}
                    >
                      <View style={reduxColors.roleWrap}>
                        <MaterialCommunityIcons
                          name="account-circle-outline"
                          size={35}
                        />
                      </View>
                    </View>
                    <View>
                      <Text style={reduxColors.roleTitle}>
                        {item?.role_name}
                      </Text>
                      {/* <Text
                        style={{
                          fontStyle: "italic",
                          fontSize: FontSize?.Antz_Subtext_Regular?.fontSize,
                        }}
                      >
                        Department Name
                      </Text> */}
                    </View>
                  </View>
                </>
              }
            />
          );
        }}
        ListEmptyComponent={<ListEmpty visible={isLoading} />}
      />
      <FloatingButton
        icon="plus-circle-outline"
        backgroundColor={constThemeColor.flotionBackground}
        borderWidth={0}
        borderColor={constThemeColor.flotionBorder}
        borderRadius={50}
        linkTo=""
        floaterStyle={{ height: 60, width: 60 }}
        onPress={() =>
          checkPermissionAndNavigate(
            permission,
            "allow_creating_roles",
            navigation,
            "CreateRole"
          )
        }
      />
    </View>
  );
};

export default RoleList;
const styles = (reduxColors) =>
  StyleSheet.create({
    roleWrap: {
      width: 40,
      height: 40,
      borderRadius: 100,
      // backgroundColor: reduxColors.secondary,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    roleTitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    },
    roleAddBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.backgroundColorAnimalCard,
      padding: 7,
      borderRadius: 5,
    },
  });
