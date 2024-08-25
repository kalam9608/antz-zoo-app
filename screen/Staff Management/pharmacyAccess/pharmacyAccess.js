import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Header from "../../../components/Header";
import CardTwo from "../components/cardTwo";
import Switch from "../../../components/Switch";
import Loader from "../../../components/Loader";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Spacing from "../../../configs/Spacing";

import { fullPharmacyAccessPermission, getUserAccessPhermacy } from "../../../services/staffManagement/permission";
import FontSize from "../../../configs/FontSize";
import { useToast } from "../../../configs/ToastConfig";
import { getZooPharmacy } from "../../../services/AddSiteService";
const PharmacyAccess = (props) => {
  const navigation = useNavigation();
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { successToast, errorToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [completeAccess, setCompleteAccess] = useState(false);
  const [pharmacyList, setPharmacyList] = useState([]);
  const [accessibleSites, setAccessibleSites] = useState([]);
  const [totalPharmacy, setTotalPharmacy] = useState(0);
  const [totalAccessPharmacy, setTotalAccessPharmacy] = useState(0);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  useFocusEffect(
    React.useCallback(() => {
      getAllPharmacy();
      getAccessPhermacyByUser();
    }, [navigation])
  );
  const allowCompleteAccess = (data) => {
    setCompleteAccess(data);
    let obj = {
      full_access_key: data,
      user_id: props.route.params?.user_id
    };
    setLoading(true);
    fullPharmacyAccessPermission(obj)
      .then((res) => {
        getAccessPhermacyByUser();
        console.log({res: res.data?.pharmacy_data})
        if (res.success) {
          successToast(
            "success",
            res.data?.pharmacy_data?.full_pharmacy_permission_access
              ? "Allow complete access successful"
              : "Allow complete access disable"
          );
        } else {
          errorToast("error", "Oops!! Something went wrong!!");
        }
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops!! Something went wrong!!");
        
        console.log({err})
        setLoading(false);
      });
  };
  // get access pharmacy list by user id
  const getAccessPhermacyByUser = () => {
    getUserAccessPhermacy(props.route.params?.user_id)
      .then((res) => {
        setAccessibleSites(res?.data?.pharmacy_data);
        setTotalAccessPharmacy(res.data?.pharmacy_data?.total_access_pharmacy);
        setCompleteAccess(res.data.pharmacy_data?.full_pharmacy_permission_access);
      })
      .catch((err) => {
        errorToast("error", "Oops!! Something went wrong!!");
        setLoading(false);
      });
  }

  // Get all lab data by zoo id
  const getAllPharmacy = () => {
    setLoading(true);
    getZooPharmacy(zooID)
      .then((res) => {
        setPharmacyList(res.data?.result);
        setTotalPharmacy(res.data?.total_count);
        // setTotalAccessPharmacy(res?.data?.full_access_pharmacy);
        setLoading(false);
      })
      .catch((err) => {
        console.log('errorP', err);
        errorToast("error", "Oops!! Something went wrong!!");
        setLoading(false);
      });
  };

  const checkPharmacySelect = (pharmacy_id) => {

    if (accessibleSites && accessibleSites?.pharmacy) {
      let check = accessibleSites?.pharmacy?.find(
        (item) => item?.id == pharmacy_id
      );
      // console?.log({check})
      if (check?.permission?.status == 1) {
        return true;
      }
    }
  };

  const checkSectionSelect = (pharmacy_id) => {
    if (accessibleSites && accessibleSites?.pharmacy) {
      let check = accessibleSites?.pharmacy?.find(
        (item) => item.id === pharmacy_id
      );
      
      if (
        check?.permission?.key == "allow_full_access" &&
        check?.permission?.status == 1
      ) {
        return "Full Access";
      } else if (
        check?.permission?.key == "VIEW" &&
        check?.permission?.status == 1
      ) {
        return "View";
      } else if (
        check?.permission?.key == "ADD" &&
        check?.permission?.status == 1
      ) {
        return "View + Add";
      }else if (
        check?.permission?.key == "EDIT" &&
        check?.permission?.status == 1
      ) {
        return "View + Add + Edit";
      }else if (
        check?.permission?.key == "DELETE" &&
        check?.permission?.status == 1
      ) {
        return "View + Add + Edit + Delete";
      }
    }
  };
  const checkSectionData = (pharmacy_id) => {
    if (accessibleSites && accessibleSites?.pharmacy) {
      let check = accessibleSites?.pharmacy?.find(
        (item) => item.id === pharmacy_id
      );
      return check;
    }
  };
  const RenderItem = ({ item }) => {
    return (
      <View style={{ marginHorizontal: 1 }}>
        <CardTwo
          elevation={0}
          onPress={() =>
            navigation.navigate("AccessPharmacy", {
              item: item,
              user_id: props.route.params?.user_id,
              sectionData: checkSectionData(item.id),
            })
          }
          stylesData={{ marginBottom: Spacing.body, marginTop: 0 }}
        >
          <View style={styles.cardBody}>
            <View style={{ width: "70%" }}>
              <Text style={styles.cardHeading}>{item.name}</Text>
              {checkPharmacySelect(item.id) && (
                <Text style={styles.headingRightText}>
                  {checkSectionSelect(item.id)}
                </Text>
              )}
            </View>
            {checkPharmacySelect(item.id) && (
              <View style={styles.cardIcon}>
                <MaterialIcons
                  name="check-circle"
                  size={24}
                  color={constThemeColor?.primary}
                />
              </View>
            )}
            <View>
              <MaterialIcons
                name="navigate-next"
                size={30}
                color={constThemeColor?.onSurfaceVariant}
              />
            </View>
          </View>
        </CardTwo>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <Header
        noIcon={true}
        style={{
          backgroundColor: constThemeColor.onSecondary,
        }}
        title={"Pharmacy Access"}
        goBackData={completeAccess}
      />
      <View style={styles.body}>
        <CardTwo elevation={0} stylesData={{ marginTop: 0, marginBottom: 0 }}>
          <View style={styles.cardBody}>
            <Text style={styles.cardBodyText}>Allow Complete Access</Text>
            <Switch
              handleToggle={allowCompleteAccess}
              active={completeAccess}
            />
          </View>
        </CardTwo>
        <View style={styles.headingSection}>
          <Text style={styles.headingTitle}>Access Pharmacy</Text>
          <Text style={styles.headingRightText}>
            {`${totalAccessPharmacy ?? "0"}/${totalPharmacy} Pharmacies`}
          </Text>
        </View>
        <FlatList
          data={pharmacyList}
          renderItem={(item) => <RenderItem {...item} />}
          keyExtractor={(i, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const style = (reduxColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    body: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
      paddingTop: Spacing.minor,
      backgroundColor: reduxColor.background,
    },
    cardBody: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    cardBodyText: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColor?.onSurfaceVariant,
    },
    headingSection: {
      paddingTop: Spacing.minor,
      paddingRight: Spacing.small,
      paddingLeft: Spacing.small,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    headingTitle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColor?.onSurfaceVariant,
      paddingLeft: Spacing.small,
      marginBottom: Spacing.body,
    },
    headingRightText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColor?.onSurface,
      paddingRight: Spacing.small,
    },
    cardIcon: {
      position: "absolute",
      right: 60,
    },
    cardHeading: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColor?.onSurfaceVariant,
    },
  });

export default PharmacyAccess;
