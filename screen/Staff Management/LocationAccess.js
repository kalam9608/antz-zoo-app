import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Header from "../../components/Header";
import CardTwo from "./components/cardTwo";
import Switch from "../../components/Switch";
import Loader from "../../components/Loader";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { ifEmptyValue } from "../../utils/Utils";
import Spacing from "../../configs/Spacing";

import {
  getUserAccess,
  fullZooAccessPermission,
} from "../../services/staffManagement/permission";
import { getZooSite } from "../../services/AddSiteService";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import { useToast } from "../../configs/ToastConfig";
const LocationAccess = (props) => {
  const navigation = useNavigation();
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [completeAccess, setCompleteAccess] = useState(false);
  const [userSite, setUserSite] = useState([]);
  const [accessibleSites, setAccessibleSites] = useState({});

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const allowCompleteAccess = (data) => {
    setCompleteAccess(data);
    let obj = {
      user_id: props.route.params?.user_id,
      zoo_id: zooID,
      zoo_full_access: data,
    };
    setLoading(true);
    fullZooAccessPermission(obj)
      .then((res) => {
        userAccessSite();
        if (res.success) {
          successToast("success", res.message);
        } else {
          errorToast("error", "Oops!! Something went wrong!!");
        }
      })
      .catch((err) => {
        errorToast("error", "Oops!! Something went wrong!!");
        setLoading(false);
      });
  };

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      getLocationAccess();
    });
    return subscribe;
  }, [navigation]);

  const getLocationAccess = () => {
    setLoading(true);
    getZooSite(zooID)
      .then((res) => {
        setUserSite(res.data);
        userAccessSite();
      })
      .catch((err) => {
        errorToast("error", "Oops!! Something went wrong!!");
        setLoading(false);
      });
  };

  const userAccessSite = () => {
    setLoading(true);
    getUserAccess({ user_id: props.route.params?.user_id })
      .then((res) => {
        setCompleteAccess(res.data.user_settings?.zoo_housing_full_access);
        setAccessibleSites(res.data);
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops!! Something went wrong!!");
        setLoading(false);
      });
  };

  const checkSiteSelect = (site_id) => {
    if (accessibleSites && accessibleSites.sites) {
      let check = accessibleSites.sites.filter(
        (item) => item.site_id === site_id
      );

      if (check[0]?.full_access === true || check[0]?.section.length > 0) {
        return true;
      }
    }
  };

  const checkSectionSelect = (site_id) => {
    if (accessibleSites && accessibleSites.sites) {
      let check = accessibleSites.sites.filter(
        (item) => item.site_id === site_id
      );
      if (!check[0]?.full_access) {
        let sectionInSite =
          check[0]?.section.length === undefined
            ? "0"
            : check[0]?.section.length;
        let totalSection =
          check[0]?.section_count === undefined ? "0" : check[0]?.section_count;

        return String(sectionInSite + "/" + totalSection + " " + "Sections");
      } else if (check[0]?.full_access === true) {
        return "Full Access";
      }
    }
  };
  const checkSectionData = (site_id) => {
    if (accessibleSites && accessibleSites.sites) {
      let check = accessibleSites.sites.filter(
        (item) => item.site_id === site_id
      );
      return check[0];
    }
  };
  const RenderItem = ({ item }) => {
    return (
      <View style={{ marginHorizontal: 1 }}>
        <CardTwo
          elevation={0}
          onPress={() =>
            navigation.navigate("AccessSite", {
              item: item,
              user_id: props.route.params?.user_id,
              sectionData: checkSectionData(item.site_id),
            })
          }
          stylesData={{ marginBottom: Spacing.body, marginTop: 0 }}
        >
          <View style={styles.cardBody}>
            <View style={{ width: "70%" }}>
              <Text style={styles.cardHeading}>{item.site_name}</Text>
              {checkSiteSelect(item.site_id) && (
                <Text style={styles.headingRightText}>
                  {checkSectionSelect(item.site_id)}
                </Text>
              )}
            </View>
            {checkSiteSelect(item.site_id) && (
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
          //paddingVertical: hp(2) ,
          backgroundColor: constThemeColor.onSecondary,
        }}
        title={"Location Access"}
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
          <Text style={styles.headingTitle}>Access Sites</Text>

          <Text style={styles.headingRightText}>
            {`${accessibleSites?.sites?.length ?? "-"}/${
              userSite.length
            } Sites`}
          </Text>
        </View>
        <FlatList
          data={userSite}
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
      // paddingTop: hp(2),
      paddingTop: Spacing.minor,
      paddingRight: Spacing.small,
      paddingLeft: Spacing.small,
      // paddingBottom: hp(0),
      // paddingBottom:Spacing.body,
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

export default LocationAccess;
