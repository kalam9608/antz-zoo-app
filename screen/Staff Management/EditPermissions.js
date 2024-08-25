import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Card, TextInput } from "react-native-paper";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import InsideBottomsheet from "../../components/Move_animal/InsideBottomsheet";
import DropDown from "../../components/Dropdown";
import Switch from "../../components/Switch";
import { useNavigation } from "@react-navigation/native";
import { getRoleListDetails } from "../../services/staffManagement/addPersonalDetails";
import {
  getRoleEditData,
  masterAssignpermission,
  permissionSummary,
  userAssignpermission,
} from "../../services/staffManagement/permission";
import { checkPermissionAndNavigate, ifEmptyValue } from "../../utils/Utils";
import Loader from "../../components/Loader";
import { getZooLab, getZooSite } from "../../services/AddSiteService";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { SvgXml } from "react-native-svg";
import PermissionListItem from "../../components/UtilityComponent";
//Icons
import person_pin_circle from "../../assets/person_pin_circle.svg";
import home_housing from "../../assets/home_housing.svg";
import { useToast } from "../../configs/ToastConfig";
import { getRefreshToken } from "../../services/AuthService";
import { clearAsyncData, saveAsyncData } from "../../utils/AsyncStorageHelper";
import { setPassCode, setSignIn, setSignOut } from "../../redux/AuthSlice";
import { setSites } from "../../redux/SiteSlice";
import { setPharmacyData } from "../../redux/PharmacyAccessSlice";
import note_alt from "../../assets/note_alt.svg";

const EditPermissions = (props) => {
  const navigation = useNavigation();
  const selectSupervisorModalRef = useRef(null);
  const [roleValue, setRoleValue] = useState(
    props.route.params?.roleData?.data ?? null
  );
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [roleId, setRoleId] = useState(
    props.route.params?.roleData?.data?.id ?? null
  );
  const [roleList, setRoleList] = useState([]);
  const [roleMainList, setRoleMainList] = useState([]);
  const [roleDataPermission, setRoleDataPermission] = useState({});
  const [userSiteCount, setUserSiteCount] = useState(0);
  const [activeSiteCount, setActiveSiteCount] = useState(0);
  const [totalLab, setTotalLab] = useState(0);
  const [totalAccessLab, setTotalAccessLab] = useState(0);
  const [allowAddingUser, setAllowAddingUser] = useState(false);
  const [view_journal, setView_journal] = useState(false);
  const [view_user_permission, setView_user_permission ] = useState(false);
  const [access_all_notes, setAccess_all_notes] = useState(false);
  const [allowCreatingRole, setAllowCreatingRole] = useState(false);
  const [allowMasters, setAllowMasters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [masterData, setMasterData] = useState({});
  const [totalLabCount, setTotalLabCount] = useState(0);
  const [fullAccessLabCount, setFullAccessLabCount] = useState(0);
  const [totalPharmacyCount, setTotalPharmacyCount] = useState(0);
  const [fullAccessPharmacyCount, setFullAccessPharmacyCount] = useState(0);
  const [fullAccessPharmacy, setFullAccessPharmacy] = useState(false);
  const [fullAccessLab, setFullAccessLab] = useState(false);

  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const permission = useSelector((state) => state.UserAuth.permission);
  const userDetails = useSelector((state) => state.UserAuth.userDetails);
  const styles = style(constThemeColor);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getRoleList();
      getRoleData(roleId);
      getMasterData();
      zooSite();
      setUserData();
    });
    return unsubscribe;
  }, [navigation]);

  const getMasterData = () => {
    setLoading(true);
    permissionSummary({ user_id: props.route.params?.userId })
      .then((res) => {
        setMasterData(res.data);
        setLoading(false);
        setAllowAddingUser(res?.data?.permission?.allow_add_users);
        setView_journal(res?.data?.permission?.view_journal);
        setView_user_permission(res?.data?.permission?.view_user_permission);
        setAccess_all_notes(res?.data?.permission?.access_all_notes);
        setAllowCreatingRole(res?.data?.permission?.allow_creating_roles);
        setAllowMasters(res?.data?.permission?.allow_masters);
        setActiveSiteCount(res?.data?.sitecount);
        setTotalLabCount(res?.data?.total_lab);
        setFullAccessLabCount(res?.data?.total_full_access_lab);
        setTotalPharmacyCount(res?.data?.total_pharmacy);
        setFullAccessPharmacyCount(res?.data?.total_full_access_pharmacy);
        setFullAccessPharmacy(
          res?.data?.permission?.allow_complete_pharmacy_access ?? false
        );
        setFullAccessLab(
          res?.data?.permission?.allow_complete_lab_access ?? false
        );
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setLoading(false);
      });
  };

  const handleSuperviorSectionModal = () => {
    if (permission["allow_creating_roles"]) {
      selectSupervisorModalRef.current.present();
    } else {
      warningToast("Restricted", "You do not have permission to access!!");
    }
  };

  const setUserRole = (role_id) => {
    setLoading(true);
    userAssignpermission({
      user_id: props.route.params?.userId,
      user_role_id: role_id,
    })
      .then((res) => {
        if (res.success) {
          successToast("success", "User role added successfully");
          setUserData();
        } else {
          errorToast("error", "User role not added");
        }
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setLoading(false);
      });
  };

  const closeSheet = () => {
    selectSupervisorModalRef.current.close();
  };
  const handleSearch = (text) => {
    let data = roleMainList;
    if (text.length > 2) {
      data = data.filter(({ role_name }) => role_name.includes(text));
    }
    setRoleList(data);
  };
  const selectRole = (item) => {
    setRoleValue(item);
    setRoleId(item.id);
    closeSheet();
    setUserRole(item.id);
    getRoleData(item.id);
  };

  const setUserData = () => {
    if (userDetails.user_id == props.route.params?.userId) {
      getRefreshToken().then((response) => {
        if (!response.success) {
          warningToast("Oops!!", response.message);
          clearAsyncData("@antz_user_device_token");
          clearAsyncData("@antz_user_data");
          clearAsyncData("@antz_user_token");
          clearAsyncData("@antz_selected_site");
          dispatch(setSignOut());
          dispatch(setPassCode(null));
          dispatch(setPharmacyData([]));
        } else {
          saveAsyncData("@antz_user_token", response.token);
          saveAsyncData("@antz_max_upload_sizes", response?.settings);
          dispatch(setSignIn(response));
          dispatch(setSites(response.user.zoos[0].sites));
          dispatch(setPharmacyData(response?.modules?.pharmacy_data));
        }
      });
    }
  };

  const getRoleList = () => {
    getRoleListDetails()
      .then((v) => {
        setRoleList(v?.data);
        setRoleMainList(v?.data);
      })
      .catch((e) => {
        errorToast("error", "Oops! Something went wrong!!");
      });
  };
  const addUserSwitch = (data) => {
    setAllowAddingUser(data);
    let obj = {
      user_id: props.route.params?.userId,
      master_access: {
        allow_add_users: data,
        view_journal: data ? data : view_journal,
        view_user_permission: data ? data : view_user_permission,
      },
    };
    setLoading(true);
    masterAssignpermission(obj)
      .then((res) => {
        setLoading(false);
        getMasterData();
        setUserData();
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setLoading(false);
      });
  };
  const view_journalSwitch = (data) => {
    setView_journal(data);
    let obj = {
      user_id: props.route.params?.userId,
      master_access: {
        view_journal: data,
      },
    };
    setLoading(true);
    masterAssignpermission(obj)
      .then((res) => {
        setLoading(false);
        getMasterData();
        setUserData();
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setLoading(false);
      });
  };
  const view_user_permissionSwitch = (data) => {
    setView_user_permission(data);
    let obj = {
      user_id: props.route.params?.userId,
      master_access: {
        view_user_permission: data,
      },
    };
    setLoading(true);
    masterAssignpermission(obj)
      .then((res) => {
        setLoading(false);
        getMasterData();
        setUserData();
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setLoading(false);
      });
  };
  const accessAllNotesSwitch = (data) => {
    setAccess_all_notes(data);
    let obj = {
      user_id: props.route.params?.userId,
      master_access: {
        access_all_notes: data,
      },
    };
    setLoading(true);
    masterAssignpermission(obj)
      .then((res) => {
        setLoading(false);
        getMasterData();
        setUserData();
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setLoading(false);
      });
  };
  const allowCreatingRoleSwitch = (data) => {
    setAllowCreatingRole(data);
    let obj = {
      user_id: props.route.params?.userId,
      master_access: {
        allow_creating_roles: data,
      },
    };
    setLoading(true);
    masterAssignpermission(obj)
      .then((res) => {
        setLoading(false);
        getMasterData();
        setUserData();
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setLoading(false);
      });
  };

  const allowMastersSwitch = (data) => {
    setAllowMasters(data);
    let obj = {
      user_id: props.route.params?.userId,
      master_access: {
        allow_masters: data,
      },
    };
    setLoading(true);
    masterAssignpermission(obj)
      .then((res) => {
        setLoading(false);
        getMasterData();
        setUserData();
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setLoading(false);
      });
  };

  const zooSite = () => {
    setLoading(true);
    getZooSite(zooID)
      .then((res) => {
        setUserSiteCount(res.data.length);
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setLoading(false);
      });
  };

  const getRoleData = (role_id) => {
    getRoleEditData(role_id)
      .then((res) => {
        setRoleDataPermission(res);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
      });
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <Header
        noIcon={true}
        style={{
          backgroundColor: constThemeColor.onSecondary,
        }}
        title={"Edit Permissions"}
      />
      <ScrollView>
        <View style={styles.body}>
          <View>
            <Text style={[styles.heading]}>Access Permissions</Text>
            <Card
              elevation={0}
              onPress={() =>
                navigation.navigate("LocationAccess", {
                  permissionData: props.route.params?.permissionData,
                  user_id: props.route.params?.userId,
                })
              }
              style={{ backgroundColor: constThemeColor.onSecondary }}
            >
              <Card.Content>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <SvgXml xml={person_pin_circle} />
                  </View>
                  <View style={{ marginLeft: Spacing.minor, flex: 1 }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text style={[styles.innerHeading, { flex: 1 }]}>
                        Location Access
                      </Text>
                      <View>
                        <MaterialIcons
                          name="navigate-next"
                          size={24}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                      </View>
                    </View>
                    {activeSiteCount > 0 ? (
                      <PermissionListItem
                        permissionText={`${ifEmptyValue(
                          activeSiteCount
                        )}/${userSiteCount} Sites`}
                      />
                    ) : (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={[
                            styles.permissionSubtitle,
                            {
                              color: constThemeColor.neutral50,
                              marginTop: Spacing.small,
                            },
                          ]}
                        >
                          No site access
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Card.Content>
            </Card>
            <Card
              elevation={0}
              onPress={() =>
                navigation.navigate("LabAccess", {
                  permissionData: props.route.params?.permissionData,
                  user_id: props.route.params?.userId,
                })
              }
              style={{
                backgroundColor: constThemeColor.onSecondary,
                marginTop: Spacing.small,
              }}
            >
              <Card.Content>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Entypo
                      name="lab-flask"
                      size={36}
                      color={constThemeColor?.onSurfaceVariant}
                    />
                  </View>
                  <View style={{ marginLeft: Spacing.minor, flex: 1 }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text style={[styles.innerHeading, { flex: 1 }]}>
                        Lab Access
                      </Text>
                      <View>
                        <MaterialIcons
                          name="navigate-next"
                          size={24}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                      </View>
                    </View>
                    {fullAccessLab ? (
                      <PermissionListItem
                        permissionText={`Allowed complete access`}
                      />
                    ) : fullAccessLabCount > 0 ? (
                      <PermissionListItem
                        permissionText={`${fullAccessLabCount}/${totalLabCount} Labs`}
                      />
                    ) : (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={[
                            styles.permissionSubtitle,
                            {
                              color: constThemeColor.neutral50,
                              marginTop: Spacing.small,
                            },
                          ]}
                        >
                          No Lab access
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Card.Content>
            </Card>
            {/*Controller or its method is not found: \App\Controllers\Api\V1\AntzPharmaStoreController::getAllPharmacy*/}
            <Card
              elevation={0}
              onPress={() =>
                navigation.navigate("PharmacyAccess", {
                  permissionData: props.route.params?.permissionData,
                  user_id: props.route.params?.userId,
                })
              }
              style={{
                backgroundColor: constThemeColor.onSecondary,
                marginTop: Spacing.small,
              }}
            >
              <Card.Content>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <MaterialIcons
                      name="local-pharmacy"
                      size={36}
                      color={constThemeColor?.onSurfaceVariant}
                    />
                  </View>
                  <View style={{ marginLeft: Spacing.minor, flex: 1 }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text style={[styles.innerHeading, { flex: 1 }]}>
                        Pharmacy Access
                      </Text>
                      <View>
                        <MaterialIcons
                          name="navigate-next"
                          size={24}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                      </View>
                    </View>
                    {fullAccessPharmacy ? (
                      <PermissionListItem
                        permissionText={`Allowed complete access`}
                      />
                    ) : fullAccessPharmacyCount > 0 ? (
                      <PermissionListItem
                        permissionText={`${fullAccessPharmacyCount}/${totalPharmacyCount} Pharmacies`}
                      />
                    ) : (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={[
                            styles.permissionSubtitle,
                            {
                              color: constThemeColor.neutral50,
                              marginTop: Spacing.small,
                            },
                          ]}
                        >
                          No pharmacy access
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
          <View>
            <View style={[styles.iconWrapper]}>
              <Text style={[styles.heading, { marginTop: 0, marginBottom: 0 }]}>
                Roles and Permissions
              </Text>
              {roleValue?.role_name == null ? (
                <View style={{ alignSelf: "center" }}>
                  <MaterialIcons
                    name="add"
                    size={24}
                    color={constThemeColor?.onSurfaceVariant}
                    onPress={() => {
                      checkPermissionAndNavigate(
                        permission,
                        "allow_creating_roles",
                        navigation,
                        "CreateRole",
                        ""
                      );
                    }}
                  />
                </View>
              ) : (
                <View style={{ alignSelf: "center" }}>
                  <MaterialIcons
                    name="edit"
                    size={24}
                    color={constThemeColor?.onSurfaceVariant}
                    onPress={() => {
                      checkPermissionAndNavigate(
                        permission,
                        "allow_creating_roles",
                        navigation,
                        "EditRole",
                        {
                          role_id: roleId,
                          user_id: props.route.params?.userId,
                        }
                      );
                    }}
                  />
                </View>
              )}
            </View>
            <Card
              elevation={0}
              style={{
                backgroundColor: constThemeColor.onSecondary,
              }}
            >
              <Card.Content
                style={{
                  padding: 0,
                  margin: 0,
                  paddingHorizontal: Spacing.minor,
                  paddingVertical: Spacing.body,
                }}
              >
                <View
                  style={{
                    marginVertical: Spacing.body,
                  }}
                >
                  <TextInput
                    mode="outlined"
                    label={"Choose a Role"}
                    value={roleValue?.role_name}
                    showSoftInputOnFocus={false}
                    caretHidden={true}
                    textColor={constThemeColor?.onSecondaryContainer}
                    onPressIn={() => handleSuperviorSectionModal()}
                    selectTextOnFocus={false}
                    editable={null}
                    style={{
                      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                      fontSize: FontSize.Antz_Minor_Title.fontSize,
                      marginTop: -6,
                    }}
                    left={
                      <TextInput.Icon
                        style={{ marginLeft: 15 }}
                        icon={(props) => (
                          <MaterialCommunityIcons
                            {...props}
                            name="account-circle-outline"
                            size={32}
                            color={constThemeColor?.onSurfaceVariant}
                          />
                        )}
                      />
                    }
                    right={
                      <TextInput.Icon
                        icon={(props) => (
                          <MaterialCommunityIcons
                            {...props}
                            name="chevron-down"
                            size={24}
                            color={constThemeColor?.onSurfaceVariant}
                            onPress={() => handleSuperviorSectionModal()}
                          />
                        )}
                      />
                    }
                  />
                </View>
                {roleDataPermission?.data?.permission && (
                  <>
                    {(roleDataPermission?.data?.permission
                      ?.collection_view_insights ||
                      roleDataPermission?.data?.permission
                        ?.collection_animal_records) && (
                      <View
                        style={[
                          styles.permissionCard,
                          //{ borderRadius: 4, marginTop: hp(2) },
                        ]}
                      >
                        <MaterialIcons
                          name="pets"
                          size={24}
                          style={[styles.iconSpacing]}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                        {
                          <View style={{}}>
                            <Text style={styles.permissionCardText}>
                              Collection
                            </Text>

                            {roleDataPermission?.data?.permission
                              ?.collection_view_insights && (
                              <PermissionListItem permissionText="Insight" />
                            )}
                            {roleDataPermission?.data?.permission
                              ?.collection_animal_records && (
                              <PermissionListItem permissionText="Animal Record" />
                            )}
                            {roleDataPermission?.data?.permission
                              ?.collection_animal_record_access && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginLeft: 28,
                                }}
                              >
                                {roleDataPermission?.data?.permission
                                  ?.collection_animal_record_access == "VIEW" ||
                                roleDataPermission?.data?.permission
                                  ?.collection_animal_record_access == "ADD" ||
                                roleDataPermission?.data?.permission
                                  ?.collection_animal_record_access == "EDIT" ||
                                roleDataPermission?.data?.permission
                                  ?.collection_animal_record_access ==
                                  "DELETE" ? (
                                  <Text style={styles.subText}>View </Text>
                                ) : null}
                                {roleDataPermission?.data?.permission
                                  ?.collection_animal_record_access == "ADD" ||
                                roleDataPermission?.data?.permission
                                  ?.collection_animal_record_access == "EDIT" ||
                                roleDataPermission?.data?.permission
                                  ?.collection_animal_record_access ==
                                  "DELETE" ? (
                                  <Text style={styles.subText}>Add </Text>
                                ) : null}
                                {roleDataPermission?.data?.permission
                                  ?.collection_animal_record_access == "EDIT" ||
                                roleDataPermission?.data?.permission
                                  ?.collection_animal_record_access ==
                                  "DELETE" ? (
                                  <Text style={styles.subText}>Edit </Text>
                                ) : null}
                                {roleDataPermission?.data?.permission
                                  ?.collection_animal_record_access ==
                                  "DELETE" && (
                                  <Text style={styles.subText}>Delete</Text>
                                )}
                              </View>
                            )}
                            {roleDataPermission?.data?.permission
                              ?.access_mortality_module && (
                              <PermissionListItem permissionText="Mortality" />
                            )}
                          </View>
                        }
                      </View>
                    )}

                    {roleDataPermission?.data?.permission?.enable_housing ||
                    roleDataPermission?.data?.permission
                      ?.housing_view_insights ||
                    roleDataPermission?.data?.permission?.housing_add_section ||
                    roleDataPermission?.data?.permission
                      ?.housing_add_enclosure ? (
                      <View
                        style={[
                          styles.permissionCard,
                          //{ borderRadius: 4, marginTop: hp(2) },
                        ]}
                      >
                        <View>
                          <SvgXml
                            xml={home_housing}
                            style={[styles.iconSpacing]}
                          />
                        </View>
                        <View style={{}}>
                          <Text style={styles.permissionCardText}>Housing</Text>
                          {roleDataPermission?.data?.permission
                            ?.enable_housing && (
                            <PermissionListItem permissionText="Housing Enable" />
                          )}
                          {roleDataPermission?.data?.permission
                            ?.housing_view_insights && (
                            <PermissionListItem permissionText="Insight" />
                          )}
                          {roleDataPermission?.data?.permission
                            ?.housing_add_section && (
                            <PermissionListItem permissionText="Add Section" />
                          )}
                          {roleDataPermission?.data?.permission
                            ?.housing_add_enclosure && (
                            <PermissionListItem permissionText="Add Enclosure" />
                          )}
                        </View>
                      </View>
                    ) : null}

                    {roleDataPermission?.data?.permission?.medical_records ? (
                      <View
                        style={[
                          styles.permissionCard,
                          //{ borderRadius: 4, marginTop: hp(2) },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="home-plus-outline"
                          size={24}
                          style={[styles.iconSpacing]}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                        <View style={{}}>
                          <Text style={styles.permissionCardText}>Medical</Text>

                          {roleDataPermission?.data?.permission
                            ?.medical_records && (
                            <PermissionListItem permissionText="Medical Record" />
                          )}
                          <View
                            style={{ flexDirection: "row", marginLeft: 28 }}
                          >
                            {roleDataPermission?.data?.permission
                              ?.medical_records_access == "VIEW" ||
                            roleDataPermission?.data?.permission
                              ?.medical_records_access == "ADD" ||
                            roleDataPermission?.data?.permission
                              ?.medical_records_access == "EDIT" ||
                            roleDataPermission?.data?.permission
                              ?.medical_records_access == "DELETE" ? (
                              <Text style={styles.subText}>View </Text>
                            ) : null}
                            {roleDataPermission?.data?.permission
                              ?.medical_records_access == "ADD" ||
                            roleDataPermission?.data?.permission
                              ?.medical_records_access == "EDIT" ||
                            roleDataPermission?.data?.permission
                              ?.medical_records_access == "DELETE" ? (
                              <Text style={styles.subText}>Add </Text>
                            ) : null}
                            {roleDataPermission?.data?.permission
                              ?.medical_records_access == "EDIT" ||
                            roleDataPermission?.data?.permission
                              ?.medical_records_access == "DELETE" ? (
                              <Text style={styles.subText}>Edit </Text>
                            ) : null}
                            {roleDataPermission?.data?.permission
                              ?.medical_records_access == "DELETE" && (
                              <Text style={styles.subText}>Delete </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    ) : null}

                    {roleDataPermission?.data?.permission?.diet_module ? (
                      <View
                        style={[
                          styles.permissionCard,
                          //{ borderRadius: 4, marginTop: hp(2) },
                        ]}
                      >
                        <FontAwesome6
                          name="plate-wheat"
                          size={24}
                          style={[styles.iconSpacing]}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                        <View style={{}}>
                          <Text style={styles.permissionCardText}>Diet</Text>

                          {roleDataPermission?.data?.permission
                            ?.diet_module && (
                            <PermissionListItem permissionText="Diet Module" />
                          )}
                          <View
                            style={{ flexDirection: "row", marginLeft: 28 }}
                          >
                            {roleDataPermission?.data?.permission
                              ?.diet_module_access == "VIEW" ||
                            roleDataPermission?.data?.permission
                              ?.diet_module_access == "ADD" ||
                            roleDataPermission?.data?.permission
                              ?.diet_module_access == "EDIT" ||
                            roleDataPermission?.data?.permission
                              ?.diet_module_access == "DELETE" ? (
                              <Text style={styles.subText}>View </Text>
                            ) : null}
                            {roleDataPermission?.data?.permission
                              ?.diet_module_access == "ADD" ||
                            roleDataPermission?.data?.permission
                              ?.diet_module_access == "EDIT" ||
                            roleDataPermission?.data?.permission
                              ?.diet_module_access == "DELETE" ? (
                              <Text style={styles.subText}>Add </Text>
                            ) : null}
                            {roleDataPermission?.data?.permission
                              ?.diet_module_access == "EDIT" ||
                            roleDataPermission?.data?.permission
                              ?.diet_module_access == "DELETE" ? (
                              <Text style={styles.subText}>Edit </Text>
                            ) : null}
                            {roleDataPermission?.data?.permission
                              ?.diet_module_access == "DELETE" && (
                              <Text style={styles.subText}>Delete </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    ) : null}

                    {roleDataPermission?.data?.permission
                      ?.approval_move_animal_external ? (
                      <View style={[styles.permissionCard]}>
                        <MaterialCommunityIcons
                          name="thumb-up-outline"
                          size={24}
                          style={[styles.iconSpacing]}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                        <View style={{}}>
                          <Text style={styles.permissionCardText}>
                            Approvals
                          </Text>

                          {/* {roleDataPermission?.data?.permission
                            ?.approval_move_animal_internal && (
                            <PermissionListItem permissionText="Move Animal" />
                          )} */}
                          {roleDataPermission?.data?.permission
                            ?.approval_move_animal_external && (
                            <PermissionListItem permissionText="Transfer Animal" />
                          )}
                        </View>
                      </View>
                    ) : null}
                    {roleDataPermission?.data?.permission?.add_lab ||
                    roleDataPermission?.data?.permission?.lab_test_mapping ? (
                      <View style={[styles.permissionCard]}>
                        <Entypo
                          name="lab-flask"
                          size={24}
                          style={[styles.iconSpacing]}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                        <View style={{}}>
                          <Text style={styles.permissionCardText}>Labs</Text>

                          {roleDataPermission?.data?.permission?.add_lab && (
                            <PermissionListItem permissionText="Add Lab" />
                          )}
                          {roleDataPermission?.data?.permission
                            ?.lab_test_mapping && (
                            <PermissionListItem permissionText="Allow Lab Test Mapping" />
                          )}
                        </View>
                      </View>
                    ) : null}
                    {roleDataPermission?.data?.permission?.add_pharmacy ? (
                      <View style={[styles.permissionCard]}>
                        <MaterialIcons
                          name="local-pharmacy"
                          size={24}
                          style={[styles.iconSpacing]}
                          color={constThemeColor?.onSurfaceVariant}
                        />
                        <View style={{}}>
                          <Text style={styles.permissionCardText}>
                            Pharmacy
                          </Text>

                          {roleDataPermission?.data?.permission
                            ?.add_pharmacy && (
                            <PermissionListItem permissionText="Add Pharmacy" />
                          )}
                        </View>
                      </View>
                    ) : null}
                  </>
                )}
              </Card.Content>
            </Card>
          </View>
          <View>
            <Text style={[styles.heading]}>Admin Permissions</Text>
            <Card
              elevation={0}
              style={[
                styles.cardGap,
                { backgroundColor: constThemeColor?.onSecondary },
              ]}
            >
              <Card.Content
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View style={{ marginRight: Spacing.minor }}>
                  <MaterialCommunityIcons
                    name="note-outline"
                    size={36}
                    color={constThemeColor?.onSurfaceVariant}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.adminText}>Allow Access all Notes</Text>
                </View>
                <View style={{ alignContent: "flex-end" }}>
                  <Switch
                    handleToggle={(data) => {
                      if (permission["allow_add_users"]) {
                        accessAllNotesSwitch(data);
                      } else {
                        setAccess_all_notes(false);
                        warningToast(
                          "Restricted",
                          "You do not have permission to access this page!!"
                        );
                      }
                    }}
                    active={access_all_notes}
                  />
                </View>
              </Card.Content>
            </Card>
            <Card
              elevation={0}
              style={[
                styles.cardGap,
                { backgroundColor: constThemeColor?.onSecondary },
              ]}
            >
              <Card.Content
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View style={{ marginRight: Spacing.minor }}>
                  <MaterialIcons
                    name="person-pin"
                    size={36}
                    color={constThemeColor?.onSurfaceVariant}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.adminText}>Allow Creating Roles</Text>
                </View>
                <View style={{}}>
                  <Switch
                    handleToggle={(data) => {
                      if (permission["allow_creating_roles"]) {
                        allowCreatingRoleSwitch(data);
                      } else {
                        warningToast(
                          "Restricted",
                          "You do not have permission to access this page!!"
                        );
                      }
                    }}
                    active={allowCreatingRole}
                  />
                </View>
              </Card.Content>
            </Card>
            <Card
              elevation={0}
              style={[
                styles.cardGap,
                { backgroundColor: constThemeColor?.onSecondary },
              ]}
            >
              <Card.Content
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View style={{ marginRight: Spacing.minor }}>
                  <Octicons
                    name="shield-lock"
                    size={36}
                    color={constThemeColor?.onSurfaceVariant}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.adminText}>Allow Masters</Text>
                </View>
                <View style={{}}>
                  <Switch
                    handleToggle={(data) => {
                      if (permission["allow_add_users"]) {
                        allowMastersSwitch(data);
                      } else {
                        warningToast(
                          "Restricted",
                          "You do not have permission to access!!"
                        );
                      }
                    }}
                    active={allowMasters}
                  />
                </View>
              </Card.Content>
            </Card>
            <Card
              elevation={0}
              style={[
                styles.cardGap,
                { backgroundColor: constThemeColor?.onSecondary },
              ]}
            >
              <Card.Content
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View style={{ marginRight: Spacing.minor }}>
                  <MaterialIcons
                    name="person-add-alt"
                    size={36}
                    color={constThemeColor?.onSurfaceVariant}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.adminText}>Allow Adding Users</Text>
                </View>
                <View style={{ alignContent: "flex-end" }}>
                  <Switch
                    handleToggle={(data) => {
                      addUserSwitch(data);
                      // if (permission["allow_add_users"]) {
                      // } else {
                      //   setAllowAddingUser(false);
                      //   warningToast(
                      //     "Restricted",
                      //     "You do not have permission to access this page!!"
                      //   );
                      // }
                    }}
                    // handleToggle={addUserSwitch}
                    active={allowAddingUser}
                  />
                </View>
              </Card.Content>
            </Card>
            <Text style={[styles.heading]}>User Module</Text>
            <Card
              elevation={0}
              style={[
                styles.cardGap,
                { backgroundColor: constThemeColor?.onSecondary },
              ]}
            >
              <Card.Content
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View style={{ marginRight: Spacing.minor }}>
                  <Ionicons
                    name="journal"
                    size={24}
                    color={constThemeColor?.onSurfaceVariant}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.adminText}>View Journal</Text>
                </View>
                <View style={{ alignContent: "flex-end" }}>
                  <Switch
                    handleToggle={(data) => {
                      if (permission["allow_add_users"]) {
                        view_journalSwitch(data);
                      } else {
                        setAllowAddingUser(false);
                        warningToast(
                          "Restricted",
                          "You do not have permission to access this page!!"
                        );
                      }
                    }}
                    // handleToggle={addUserSwitch}
                    active={view_journal}
                  />
                </View>
              </Card.Content>
            </Card>
            <Card
              elevation={0}
              style={[
                styles.cardGap,
                { backgroundColor: constThemeColor?.onSecondary },
              ]}
            >
              <Card.Content
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View style={{ marginRight: Spacing.minor }}>
                  <FontAwesome5
                    name="user-shield"
                    size={24}
                    color={constThemeColor?.onSurfaceVariant}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.adminText}>View Permissions</Text>
                </View>
                <View style={{ alignContent: "flex-end" }}>
                  <Switch
                    handleToggle={(data) => {
                      if (permission["allow_add_users"]) {
                        view_user_permissionSwitch(data);
                      } else {
                        setAllowAddingUser(false);
                        warningToast(
                          "Restricted",
                          "You do not have permission to access this page!!"
                        );
                      }
                    }}
                    // handleToggle={addUserSwitch}
                    active={view_user_permission}
                  />
                </View>
              </Card.Content>
            </Card>
            {allowMasters && (
              <Card
                elevation={0}
                style={[
                  styles.cardGap,
                  { backgroundColor: constThemeColor?.onSecondary },
                ]}
              >
                <Card.Content
                  style={{
                    paddingVertical: Spacing.body,
                    paddingHorizontal: Spacing.minor,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingBottom: Spacing.body,
                    }}
                    onPress={() =>
                      navigation.navigate("MasterPermission", {
                        user_id: props.route.params?.userId,
                      })
                    }
                  >
                    <View style={{ marginRight: Spacing.minor }}>
                      <MaterialIcons
                        name="playlist-add"
                        size={36}
                        color={constThemeColor?.onSurfaceVariant}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.adminText}>Allow Adding Masters</Text>
                    </View>
                    <View style={{}}>
                      <MaterialIcons
                        name="navigate-next"
                        size={36}
                        color={constThemeColor?.onSurfaceVariant}
                      />
                    </View>
                  </TouchableOpacity>

                  {masterData?.permission?.add_taxonomy && (
                    <View style={[styles.permissionCard]}>
                      <MaterialIcons
                        name="pets"
                        size={24}
                        style={[styles.iconSpacing]}
                        color={constThemeColor?.onSurfaceVariant}
                      />

                      <View style={{}}>
                        <Text style={styles.permissionCardText}>
                          Collection
                        </Text>
                        <PermissionListItem permissionText="Add Species" />
                      </View>
                    </View>
                  )}

                  {masterData?.permission?.add_sites && (
                    <View style={[styles.permissionCard]}>
                      <SvgXml xml={home_housing} style={[styles.iconSpacing]} />
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>Housing</Text>
                        {<PermissionListItem permissionText="Add Sites" />}
                      </View>
                    </View>
                  )}
                  {masterData?.permission?.add_designations ||
                  masterData?.permission?.add_departments ||
                  masterData?.permission?.add_id_proofs ||
                  masterData?.permission?.add_educations ? (
                    <View style={[styles.permissionCard]}>
                      <MaterialIcons
                        name="person-add-alt"
                        size={24}
                        style={[styles.iconSpacing]}
                        color={constThemeColor?.onSurfaceVariant}
                      />
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>Users</Text>

                        {masterData?.permission?.add_designations && (
                          <PermissionListItem permissionText="Add Designations" />
                        )}
                        {masterData?.permission?.add_departments && (
                          <PermissionListItem permissionText="Add Departments" />
                        )}
                        {masterData?.permission?.add_id_proofs && (
                          <PermissionListItem permissionText="Add Id Proofs" />
                        )}
                        {masterData?.permission?.add_educations && (
                          <PermissionListItem permissionText="Add Education Type" />
                        )}
                      </View>
                    </View>
                  ) : null}

                  {masterData?.permission?.add_organizations ||
                  masterData?.permission?.add_institutes_for_animal_transfer ? (
                    <View style={[styles.permissionCard]}>
                      <MaterialIcons
                        name="person-add-alt"
                        size={24}
                        style={[styles.iconSpacing]}
                        color={constThemeColor?.onSurfaceVariant}
                      />
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>
                          Administration
                        </Text>

                        {masterData?.permission?.add_organizations && (
                          <PermissionListItem permissionText="Add organization" />
                        )}
                        {masterData?.permission
                          ?.add_institutes_for_animal_transfer && (
                          <PermissionListItem permissionText="Add Institutes for Animal Transfer" />
                        )}
                      </View>
                    </View>
                  ) : null}
                  {masterData?.permission?.add_assessment ? (
                    <View style={[styles.permissionCard]}>
                      <SvgXml xml={note_alt} style={[styles.iconSpacing]} />
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>
                          Assessment
                        </Text>

                        {masterData?.permission?.add_assessment && (
                          <PermissionListItem permissionText="Add assessment" />
                        )}
                      </View>
                    </View>
                  ) : null}
                  {masterData?.permission?.medical_add_complaints ||
                  masterData?.permission?.medical_add_diagnosis ||
                  masterData?.permission?.medical_add_prescription ||
                  masterData?.permission?.medical_add_tests ||
                  masterData?.permission?.medical_add_samples ||
                  masterData?.permission?.medical_add_advices ? (
                    <View style={[styles.permissionCard]}>
                      <MaterialCommunityIcons
                        name="home-plus-outline"
                        size={24}
                        style={[styles.iconSpacing]}
                        color={constThemeColor?.onSurfaceVariant}
                      />
                      <View style={{}}>
                        <Text style={styles.permissionCardText}>Medical</Text>
                        {masterData?.permission?.medical_add_complaints && (
                          <PermissionListItem permissionText="Add New Complaints" />
                        )}
                        {masterData?.permission?.medical_add_diagnosis && (
                          <PermissionListItem permissionText="Add New Diagnosis" />
                        )}
                        {masterData?.permission?.medical_add_prescription && (
                          <PermissionListItem permissionText="Add New Medicines" />
                        )}
                        {masterData?.permission?.medical_add_tests && (
                          <PermissionListItem permissionText="Add Medical Tests" />
                        )}
                        {masterData?.permission?.medical_add_samples && (
                          <PermissionListItem permissionText="Add Medical Samples" />
                        )}
                        {masterData?.permission?.medical_add_advices && (
                          <PermissionListItem permissionText="Add Medical Advices" />
                        )}
                      </View>
                    </View>
                  ) : null}
                </Card.Content>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>

      <BottomSheetModalComponent
        style={{ marginHorizontal: wp(4), paddingHorizontal: wp(0.5) }}
        ref={selectSupervisorModalRef}
      >
        <InsideBottomsheet
          title="Select a Role"
          type="role"
          data={roleList}
          collectionData={roleList}
          permission={permission}
          navigation={() => {
            closeSheet();
            checkPermissionAndNavigate(
              permission,
              "allow_creating_roles",
              navigation,
              "CreateRole",
              "",
              userDetails?.user_id == props?.route?.params?.userId
            );
          }}
          handelSearch={(text) => {
            handleSearch(text);
          }}
          onPress={(item) => {
            selectRole(item);
          }}
        />
      </BottomSheetModalComponent>
    </View>
  );
};

const style = (reduxColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColor?.background,
    },
    body: {
      paddingHorizontal: Spacing.minor,
      flex: 1,
      backgroundColor: reduxColor?.background,
    },
    heading: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColor?.onSurfaceVariant,
      marginBottom: Spacing.body,
      marginTop: Spacing.major,
      marginLeft: Spacing.small,
    },
    innerHeading: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      marginBottom: Spacing.small,
      marginRight: Spacing.minor,
    },
    adminText: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColor.onSurfaceVariant,
    },
    cardGap: {
      marginBottom: Spacing.body,
    },
    permissionCard: {
      flexDirection: "row",
      paddingVertical: Spacing.body,
    },
    permissionCardText: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColor?.onSurfaceVariant,
    },
    permissionSubtitle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColor?.onSurfaceVariant,
      marginLeft: Spacing.mini,
    },
    iconWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: Spacing.body,
      marginTop: Spacing.major,
      // marginTop: hp(1.5),
      // marginBottom: hp(1.2),
    },
    subText: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColor?.onSecondaryContainer,
      marginRight: wp(0.5),
    },
    iconSpacing: {
      marginRight: Spacing.minor,
    },
  });

export default EditPermissions;
