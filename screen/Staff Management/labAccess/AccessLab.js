import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, BackHandler } from "react-native";
import Header from "../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import CardTwo from "../components/cardTwo";
import Switch from "../../../components/Switch";
import Loader from "../../../components/Loader";
import {
  addLabMappingData,
  getPermissionData,
} from "../../../services/staffManagement/permission";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import FontSize from "../../../configs/FontSize";
import Spacing from "../../../configs/Spacing";
import DialougeModal from "../../../components/DialougeModal";
import Config from "../../../configs/Config";
import { setModulesLab } from "../../../redux/accessLabSlice";
import { errorToast, successToast, warningToast } from "../../../utils/Alert";

const AccessLab = (props) => {
  const navigation = useNavigation();
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [allowFullAccess, setAllowFullAccess] = useState(false);
  const [switchChange, setSwitchChange] = useState(false);
  const [labDetails] = useState(props?.route?.params.item);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const [permissionData, setPermissionData] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [dialogueTitle, setDialogueTitle] = useState("");
  const [dialogueSubtitle, setDialogueSubtitle] = useState("");
  const [type, setType] = useState("");
  const [viewTestsSwitchDisabled, setViewTestsSwitchDisabled] = useState(false);
  const firstButtonPress = () => {
    if (type == "update") {
      navigation.goBack();
      alertModalClose();
    } else if (type == "back") {
      alertModalClose();
      navigation.goBack();
    } else if (type == "fullPermissionUpdate") {
      alertModalClose();
      navigation.goBack();
    }
  };
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const secondButtonPress = () => {
    alertModalClose();
  };

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      getPermission();
    });

    if (allowFullAccess) {
      const data = permissionData?.map((i) => {
        if (i?.id) {
          return {
            ...i,
            status: true,
          };
        }
      });
      setPermissionData(data);
    }

    return subscribe;
  }, [navigation, switchChange, allowFullAccess]);

  useEffect(() => {
    const backAction = () => {
      alertModalOpen();
      setType("back");
      setDialogueTitle("Are you sure you want to go back?");
      setDialogueSubtitle("");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  // get permission data
  const getPermission = () => {
    setLoading(true);
    getPermissionData(props.route.params?.item?.id, props.route.params?.user_id)
      .then((res) => {
        let arr = res.data ?? [];
        // set here disable
        const performTestsStatus = arr.find(
          (m) => m.key === "perform_tests"
        )?.status;
        const transferTestsStatus = arr.find(
          (m) => m.key === "transfer_tests"
        )?.status;
        const isViewTestsDisabled = performTestsStatus || transferTestsStatus;
        arr = arr.map((ele) => {
          return {
            ...ele,
            disabled:
              ele.key === "view_tests" ? isViewTestsDisabled : ele.disabled,
          };
        });
        setPermissionData(arr);
        res.data?.find((i) => {
          if (i?.key == "allow_full_access") {
            setAllowFullAccess(i?.status ? true : false);
          }
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log("error", err);
        setLoading(false);
      });
  };

  // all switch control here
  const handleSwitch = (item) => {
    setSwitchChange(!switchChange);
    let arr = permissionData ?? [];
    updateStatus(item);
    arr = arr.map((ele) => {
      return {
        ...ele,
        status: item.id == ele.id ? !item.status : ele.status,
      };
    });
    // set here disable
    const performTestsStatus = arr.find(
      (m) => m.key === "perform_tests"
    )?.status;
    const transferTestsStatus = arr.find(
      (m) => m.key === "transfer_tests"
    )?.status;
    const isViewTestsDisabled = performTestsStatus || transferTestsStatus;
    arr = arr.map((ele) => {
      return {
        ...ele,
        disabled: ele.key === "view_tests" ? isViewTestsDisabled : ele.disabled,
      };
    });
    setPermissionData(arr);
    if (arr.filter((item) => item.status == false).length > 0) {
      setAllowFullAccess(false);
    }
  };

  function updateStatus(item) {
    const module = permissionData.find((m) => m.key === item?.key);

    if (module) {
      if (item?.key === "transfer_tests" && !item?.status) {
        permissionData.find((m) => m.key === "view_tests").status = true;
      }
      if (item?.key === "perform_tests" && !item?.status) {
        permissionData.find((m) => m.key === "view_tests").status = true;
      } else if (
        item?.key === "view_tests" &&
        (permissionData.find((m) => m.key === "perform_tests").status ||
          permissionData.find((m) => m.key === "transfer_tests").status)
      ) {
        warningToast(
          "Warning",
          "Cannot change view tests status when perform tests and transfer tests are true."
        );
      }
      setPermissionData([...permissionData]);
    } else {
      errorToast(`Permission key not found.`);
    }
  }
  // lab access full permission
  const fullAccessSwitch = (data) => {
    let arr = permissionData ?? [];
    setAllowFullAccess(data);
    // set here disable
    const performTestsStatus = arr.find(
      (m) => m.key === "perform_tests"
    )?.status;
    const transferTestsStatus = arr.find(
      (m) => m.key === "transfer_tests"
    )?.status;
    const isViewTestsDisabled = performTestsStatus && transferTestsStatus;
    arr = arr.map((ele) => {
      return {
        ...ele,
        disabled: ele.key === "view_tests" ? true : ele.disabled,
      };
    });
    setPermissionData(arr);
  };
  // individual permission for lab
  const assignUserAccess = () => {
    setLoading(true);
    let obj = {
      lab_id: labDetails?.id,
      user_id: props.route.params?.user_id,
      permission_id: JSON.stringify([
        ...new Set(permissionData?.map((i) => i.id)),
      ]),
    };

    let obj1 = {
      lab_id: labDetails?.id,
      user_id: props.route.params?.user_id,
      permission_id: JSON.stringify(
        permissionData
          ?.filter((i) => i?.status && i?.key != "allow_full_access")
          ?.map((v) => v.id)
      ),
    };
    addLabMappingData(allowFullAccess ? obj : obj1)
      .then((res) => {
        if (res.success) {
          getPermission();
          // dispatch(setModulesLab(res.data?.lab_data));
          setType("update");
          setDialogueTitle(res.message);
          setDialogueSubtitle("Do you want to go back?");
          alertModalOpen();
        } else {
          errorToast("Error", "Oops! Something went wrong!!");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        errorToast("error", "Oops!! Something went wrong!!");
      });
  };
  const backPermission = () => {
    alertModalOpen();
    setType("back");
    setDialogueTitle("Are you sure you want to go back?");
    setDialogueSubtitle("");
  };
  return (
    <View style={styles.container}>
      <Header
        title={labDetails.lab_name}
        onPress={assignUserAccess}
        noIcon={false}
        back={() => backPermission()}
      />
      <Loader visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <CardTwo elevation={0}>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>Allow Full Access</Text>
              <Switch
                active={allowFullAccess}
                handleToggle={fullAccessSwitch}
              />
            </View>
          </CardTwo>
          <View style={styles.headingSection}>
            <Text style={styles.heading}>Access Lab Room</Text>
          </View>
          {permissionData?.map((item, index) => {
            if (item?.key == "allow_full_access") {
              return null;
            }
            return (
              <CardTwo elevation={0} key={index.toString()}>
                <View style={styles.cardBody}>
                  <Text style={styles.cardText}>{item?.label}</Text>
                  <Switch
                    active={item?.status}
                    handleToggle={handleSwitch}
                    multiple
                    data={item}
                    disabled={item?.disabled}
                  />
                </View>
              </CardTwo>
            );
          })}
        </View>
      </ScrollView>
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.SUCCESS_TYPE}
        title={dialogueTitle}
        subTitle={dialogueSubtitle}
        closeModal={alertModalClose}
        firstButtonHandle={firstButtonPress}
        secondButtonHandle={secondButtonPress}
        firstButtonText={"Yes"}
        secondButtonText={"No"}
        firstButtonStyle={{
          backgroundColor: constThemeColor.error,
          borderWidth: 0,
        }}
        firstButtonTextStyle={{ color: constThemeColor.onPrimary }}
        secondButtonStyle={{
          backgroundColor: constThemeColor.surfaceVariant,
          borderWidth: 0,
        }}
      />
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
      padding: hp(2),
      backgroundColor: reduxColor.background,
    },
    cardBody: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardText: {
      color: reduxColor?.onSurfaceVariant,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      width: wp(60),
    },
    headingSection: {
      paddingTop: Spacing.minor,
      paddingBottom: hp(0),
      paddingHorizontal: hp(0.5),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    heading: {
      color: reduxColor?.onSurfaceVariant,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      paddingLeft: Spacing.small,
    },
    rightHeading: {
      color: reduxColor?.onSurface,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      paddingRight: Spacing.small,
    },
  });

export default AccessLab;
