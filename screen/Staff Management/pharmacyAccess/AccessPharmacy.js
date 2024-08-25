import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import Header from "../../../components/Header";
import { useSelector } from "react-redux";
import CardTwo from "../components/cardTwo";
import Switch from "../../../components/Switch";
import Loader from "../../../components/Loader";
import {
  addPhamacyMappingData,
  getPhermacyPermissionData,
} from "../../../services/staffManagement/permission";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import FontSize from "../../../configs/FontSize";
import Spacing from "../../../configs/Spacing";
import { useToast } from "../../../configs/ToastConfig";
import DialougeModal from "../../../components/DialougeModal";
import Config from "../../../configs/Config";
import { FontAwesome5 } from "@expo/vector-icons";

const AccessPharmacy = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [allowFullAccess, setAllowFullAccess] = useState(false);
  const [labDetails] = useState(props?.route?.params.item);
  const { successToast, errorToast, warningToast } = useToast();
  const [permissionData, setPermissionData] = useState([]);
  const [switchChange, setSwitchChange] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({});
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [isModalVisible, setModalVisible] = useState(false);
  const [dialogueTitle, setDialogueTitle] = useState("");
  const [dialogueSubtitle, setDialogueSubtitle] = useState("");
  const [type, setType] = useState("");
  const [removeAccess, setRemoveAccess] = useState(false);
  const [DispenseAccess, setDispenseAccess] = useState(false);
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

  const toggleRemoveBtn = () => {
    setAllowFullAccess(false);
    setDispenseAccess(false);
    setRemoveAccess(!removeAccess);
  };
  const toggleDispenseRemoveBtn = () => {
    if (dropdownValue?.key == undefined) {
      const lastDropdownValue = dropdownList[0];
      setDropdownValue(lastDropdownValue);
      setDispenseAccess(!DispenseAccess);
    } else {
      setAllowFullAccess(false);
      setDispenseAccess(!DispenseAccess);
    }
  };
  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      getPermission();
    });

    if (allowFullAccess?.status) {
      const lastDropdownValue = dropdownList[dropdownList.length - 1];
      setDropdownValue(lastDropdownValue);
    }

    return subscribe;
  }, [navigation, allowFullAccess?.status]);

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
  useEffect(() => {
    permissionData?.filter((i) => {
      if (i?.key == "allow_full_access") {
        setAllowFullAccess({ ...i, status: i?.status ? true : false });
        setDispenseAccess(i?.status ? true : false);
      }
    });
    permissionData?.filter((i) => {
      if (i?.dispense_medicine == true) {
        setDispenseAccess(true);
      }
    });
    setDropdownValue(permissionData?.find((i) => i.status) ?? dropdownValue);
  }, [permissionData]);
  const getPermission = () => {
    setLoading(true);
    getPhermacyPermissionData(
      props.route.params?.item?.id,
      props.route.params?.user_id
    )
      .then((res) => {
        setPermissionData(res.data);

        setLoading(false);
      })
      .catch((err) => {
        console.log("error", err);
        setLoading(false);
      });
  };

  // get list of dropwown
  const dropdownList = permissionData?.filter(
    (i) => i?.key !== "allow_full_access"
  );

  const fullAccessSwitch = (data, value) => {
    if (value == true) {
      setDispenseAccess(true);
    }
    setRemoveAccess(false);
    setAllowFullAccess({ ...data, status: value });
  };

  const handleDropValue = (data) => {
    if (allowFullAccess?.status) {
      setAllowFullAccess({ ...allowFullAccess, status: false });
    }

    setSwitchChange(!switchChange);
    setDropdownValue({ ...data, status: true });
    setDropdown(false);
  };
  const assignUserAccess = () => {
    if (!allowFullAccess?.status && !dropdownValue?.id) {
      warningToast("Oops!!", "Need changes to update permission!!");
    } else {
      setLoading(true);
      let obj = {
        pharmacy_id: labDetails?.id,
        user_id: props.route.params?.user_id,
        permission_id: allowFullAccess?.status
          ? allowFullAccess?.id
          : dropdownValue?.id,
      };
      if (!removeAccess) {
        obj.allow_access = true;
        if (dropdownValue?.key != undefined) {
          obj.dispense_medicine_status = DispenseAccess == true ? true : false;
        }
      }
      addPhamacyMappingData(obj)
        .then((res) => {
          if (res.success) {
            // getPermission();
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
          console.log("error1", err);
          errorToast("Error", "Oop!, Something went wrong!");
          setLoading(false);
        });
    }
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
        title={labDetails?.name}
        onPress={assignUserAccess}
        noIcon={false}
        back={() => backPermission()}
      />
      <Loader visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <CardTwo elevation={0}>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>Allow full access</Text>
              <Switch
                active={allowFullAccess?.status}
                handleToggle={fullAccessSwitch}
                multiple={true}
                data={permissionData?.find(
                  (i) => i?.key == "allow_full_access"
                )}
              />
            </View>
          </CardTwo>
          <CardTwo elevation={0}>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>Remove all access</Text>
              <Switch
                active={removeAccess}
                handleToggle={toggleRemoveBtn}
                multiple={true}
                data={removeAccess}
              />
            </View>
          </CardTwo>
          <CardTwo elevation={0}>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>Dispense Medicine</Text>
              <Switch
                active={DispenseAccess}
                handleToggle={toggleDispenseRemoveBtn}
                multiple={true}
                data={DispenseAccess}
              />
            </View>
          </CardTwo>
          <View style={styles.headingSection}>
            <Text style={styles.heading}>Access Pharmacy</Text>
          </View>
          <CardTwo
            onPress={() => {
              setDropdown(!dropdown);
              setRemoveAccess(false);
            }}
          >
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>
                {dropdown || removeAccess
                  ? "Choose Action"
                  : dropdownValue?.key == "VIEW"
                  ? "View"
                  : dropdownValue?.key == "ADD"
                  ? "View + Add"
                  : dropdownValue?.key == "EDIT"
                  ? "View + Add + Edit"
                  : dropdownValue?.key == "DELETE"
                  ? "View + Add + Edit + Delete"
                  : "Choose Action"}
              </Text>
              <FontAwesome5
                name={dropdown ? "caret-up" : "caret-down"}
                size={24}
                color={constThemeColor?.onSurfaceVariant}
              />
            </View>
            {dropdown ? (
              <>
                <View style={{ marginTop: Spacing.body }}>
                  {dropdownList?.map((item) => {
                    return (
                      <TouchableOpacity
                        style={{
                          paddingVertical: Spacing.small,
                          marginVertical: Spacing.mini,
                          // paddingHorizontal: Spacing.mini
                        }}
                        onPress={() => handleDropValue(item)}
                      >
                        <Text
                          style={[
                            FontSize.Antz_Minor_Regular,
                            { color: constThemeColor?.onSurfaceVariant },
                          ]}
                        >
                          {item?.key == "VIEW"
                            ? "View"
                            : item?.key == "ADD"
                            ? "View + Add"
                            : item?.key == "EDIT"
                            ? "View + Add + Edit"
                            : item?.key == "DELETE"
                            ? "View + Add + Edit + Delete"
                            : null}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : null}
          </CardTwo>
          {/* <CardTwo elevation={0}>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>Transfer Tests</Text>
              <Switch
                active={transferLab}
                handleToggle={handleTransferSwitch}
              />
            </View>
          </CardTwo> */}
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
      // paddingTop: hp(2),
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

export default AccessPharmacy;
