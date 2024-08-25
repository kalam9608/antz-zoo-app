import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Header from "../../../components/Header";
import CardTwo from "../components/cardTwo";
import Switch from "../../../components/Switch";
import Loader from "../../../components/Loader";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Spacing from "../../../configs/Spacing";

import {
  fullLabAccessPermission,
  getUserAccessLab,
} from "../../../services/staffManagement/permission";
import FontSize from "../../../configs/FontSize";
import { useToast } from "../../../configs/ToastConfig";
import { getZooLab } from "../../../services/AddSiteService";
import { setModulesLab } from "../../../redux/accessLabSlice";
const LabAccess = (props) => {
  const navigation = useNavigation();
  const { successToast, errorToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [completeAccess, setCompleteAccess] = useState(false);
  const [totalAccessLab, setTotalAccessLab] = useState(0);
  const [labList, setLabList] = useState([]);
  const [totalLab, setTotalLab] = useState(0);
  const [accessibleSites, setAccessibleSites] = useState([]);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  useFocusEffect(
    React.useCallback(() => {
      getAllLab();
      getAccessLabByUser();
    }, [navigation])
  );
  const allowCompleteAccess = (data) => {
    setCompleteAccess(data);
    let obj = {
      full_access_key: data,
      user_id: props.route.params?.user_id,
    };
    setLoading(true);
    fullLabAccessPermission(obj)
      .then((res) => {
        getAccessLabByUser();
        if (res.success) {
          successToast(
            "success",
            res?.data?.lab_data?.full_permission_access
              ? "Allow complete access successful"
              : "Allow complete access disable"
          );
        } else {
          errorToast("error", "Oops!! Something went wrong!!");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log({ err });
        errorToast("error", "Oops!! Something went wrong!!");
        setLoading(false);
      });
  };

  // get lab list by user id
  const getAccessLabByUser = () => {
    getUserAccessLab({ user_id: props.route.params?.user_id })
      .then((res) => {
        setAccessibleSites(res?.data?.lab_data);
        setTotalAccessLab(res.data?.lab_data?.total_access_lab);
        setCompleteAccess(res.data.lab_data?.full_permission_access);
      })
      .catch((err) => {
        errorToast("error", "Oops!! Something went wrong!!");
        setLoading(false);
      });
  };

  // Get all lab data by zoo id
  const getAllLab = () => {
    setLoading(true);
    getZooLab()
      .then((res) => {
        setTotalLab(res.data?.total_count);
        setLabList(res.data?.result);
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops!! Something went wrong!!");
        setLoading(false);
      });
  };
  const checkLabSelect = (lab_id) => {
    if (accessibleSites && accessibleSites?.lab) {
      let check = accessibleSites?.lab?.find((item) => item?.lab_id == lab_id);

      if (check?.permission) {
        return true;
      }
    }
  };
  const checkSectionSelect = (lab_id) => {
    if (accessibleSites && accessibleSites?.lab) {
      let check = accessibleSites?.lab?.find((item) => item.lab_id === lab_id);

      if (check?.permission?.allow_full_access) {
        return "Full Access";
      } else if (
        check?.permission?.perform_tests &&
        check?.permission?.transfer_tests
      ) {
        return "View + Perform + Transfer";
      } else if (check?.permission?.perform_tests) {
        return "View + Perform";
      } else if (check?.permission?.transfer_tests) {
        return "View + Transfer";
      } else if (check?.permission?.view_tests) {
        return "View";
      }
    }
  };
  // check item avilable
  const checkSectionData = (lab_id) => {
    if (accessibleSites && accessibleSites?.lab) {
      let check = accessibleSites?.lab?.find((item) => item.lab_id === lab_id);
      return check;
    }
  };
  const RenderItem = ({ item }) => {
    return (
      <View style={{ marginHorizontal: 1 }}>
        <CardTwo
          elevation={0}
          onPress={() =>
            navigation.navigate("AccessLab", {
              item: item,
              user_id: props.route.params?.user_id,
              sectionData: checkSectionData(item.id),
            })
          }
          stylesData={{ marginBottom: Spacing.body, marginTop: 0 }}
        >
          <View style={styles.cardBody}>
            <View style={{ width: "70%" }}>
              <Text style={styles.cardHeading}>{item.lab_name}</Text>
              {checkLabSelect(item.id) && (
                <Text style={styles.headingRightText}>
                  {checkSectionSelect(item.id)}
                </Text>
              )}
            </View>
            {checkLabSelect(item.id) && (
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
        title={"Lab Access"}
        goBackData={completeAccess}
      />
      <View style={styles.body}>
        <CardTwo elevation={0} stylesData={{ marginTop: 0, marginBottom: 0 }}>
          <View style={styles.cardBody}>
            <Text style={styles.cardBodyText}>Allow Complete Access</Text>
            <Switch
              handleToggle={allowCompleteAccess}
              active={accessibleSites?.full_permission_access}
            />
          </View>
        </CardTwo>
        <View style={styles.headingSection}>
          <Text style={styles.headingTitle}>Full Access Labs</Text>

          <Text style={styles.headingRightText}>
            {`${totalAccessLab ?? "0"}/${totalLab} Labs`}
          </Text>
        </View>
        <FlatList
          data={labList}
          renderItem={({ item }) => <RenderItem item={item} />}
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

export default LabAccess;
