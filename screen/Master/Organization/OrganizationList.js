import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../../configs/Colors";
import AddMedicalRecordCard from "../../../components/AddMedicalRecordCard";
import { useSelector } from "react-redux";
import FontSize from "../../../configs/FontSize";
import FloatingButton from "../../../components/FloatingButton";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import ListEmpty from "../../../components/ListEmpty";
import Loader from "../../../components/Loader";
import { getOrganization } from "../../../services/Organization";
import { ifEmptyValue } from "../../../utils/Utils";
import { errorToast } from "../../../utils/Alert";
import CustomCard from "../../../components/CustomCard";
import { capitalize } from "../../../utils/Utils";
import moment from "moment";
import Spacing from "../../../configs/Spacing";
import { useToast } from "../../../configs/ToastConfig";

const OrganizationList = () => {
  const [organizationList, setOrganizationList] = useState([]);
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [isLoading, setIsLoading] = useState(false);
  const reduxColors = styles(constThemeColor);
  const { showToast } = useToast();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      getOraganizationList();
    });
    return unsubscribe;
  }, [navigation]);
  const getOraganizationList = () => {
    getOrganization(zooID)
      .then((v) => {
        setOrganizationList(v);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        // errorToast("Oops!", "Something went wrong!!");
        showToast("error", "Oops! Something went wrong!!");
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: constThemeColor.surfaceVariant }}>
      <Header noIcon={true} title={"Organization"} />
      <Loader visible={isLoading} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={organizationList}
        contentContainerStyle={{
          paddingBottom: 50,
          paddingHorizontal: Spacing.minor,
        }}
        renderItem={({ item }) => {
          console.log(item)
          return (
            // <AddMedicalRecordCard
            //   backgroundColor={constThemeColor.onPrimary}
            //   children={
            //     <>
            //       <View
            //         style={{
            //           display: "flex",
            //           flexDirection: "row",
            //           paddingHorizontal: 5,
            //           paddingVertical: 5,
            //         }}
            //       >
            //         <View
            //           style={{
            //             alignItems: "center",
            //             justifyContent: "center",
            //           }}
            //         ></View>
            //         <View>
            //           <Text style={reduxColors.roleTitle}>Id : {item?.id}</Text>
            //           <Text style={reduxColors.roleTitle}>
            //             Name :
            //             <Text
            //               style={{
            //                 fontWeight: FontSize.Antz_Body_Title.fontWeight,
            //               }}
            //             >
            //               {" "}
            //               {item?.organization_name}
            //             </Text>
            //           </Text>
            //           <Text style={reduxColors.roleTitle}>
            //             Description :{" "}
            //             <Text style={{ fontStyle: "italic" }}>
            //               {" "}
            //               {ifEmptyValue(item?.description)}
            //             </Text>
            //           </Text>
            //         </View>
            //       </View>
            //     </>
            //   }
            // />

            <CustomCard
              title={item?.organization_name}
              subtitle={ifEmptyValue(
                moment(item.created_on).format("DD MMM YYYY h:mm A")
              )}
              textTransformStyle={"none"}
            />
          );
        }}
        ListEmptyComponent={<ListEmpty visible={isLoading} />}
      />
      <FloatingButton
        icon="plus-circle-outline"
        backgroundColor={Colors.backgroundColorinList}
        borderWidth={0}
        borderColor={Colors.borderColorinListStaff}
        borderRadius={50}
        linkTo=""
        floaterStyle={{ height: 60, width: 60 }}
        onPress={() => navigation.navigate("AddOrganization")}
      />
    </View>
  );
};

export default OrganizationList;
const styles = (reduxColors) =>
  StyleSheet.create({
    roleWrap: {
      width: 40,
      height: 40,
      borderRadius: 100,
      backgroundColor: reduxColors.secondary,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    roleTitle: {
      fontSize: FontSize?.Antz_Body_Regular?.fontSize,
      width: widthPercentageToDP(90),
    },
    roleAddBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.backgroundColorAnimalCard,
      padding: 7,
      borderRadius: 5,
    },
  });
