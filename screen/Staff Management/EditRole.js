import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import Header from "../../components/Header";
import CardTwo from "./components/cardTwo";
import InputBox from "../../components/InputBox";
import {
  Entypo,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import Switch from "../../components/Switch";
import ChipGroup from "./components/chipGroup";
import ButtonCom from "../../components/ButtonCom";
import {
  getRoleEditData,
  editRole,
} from "../../services/staffManagement/permission";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { getRoleListDetails } from "../../services/staffManagement/addPersonalDetails";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import InsideBottomsheet from "../../components/Move_animal/InsideBottomsheet";
import { Dropdown } from "react-native-element-dropdown";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";

const EditRole = (props) => {
  const navigation = useNavigation();
  const selectSupervisorModalRef = useRef(null);
  const [roleName, setRoleName] = useState(null);
  const [roleId, setRoleId] = useState(props.route.params?.role_id ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [collectionInsight, setCollectionInsight] = useState(false);
  const [collectionMortality, setCollectionMortality] = useState(false);
  const [collectionAnimalRecord, setCollectionAnimalRecord] = useState(false);
  const [housingInsight, setHousingInsight] = useState(false);
  const [housingSection, setHousingSection] = useState(false);
  const [housingEnclosure, setHousingEnclosure] = useState(false);
  const [medicalRecord, setMedicalRecord] = useState(false);
  const [diet, setDiet] = useState(false);
  const [approvalsInternal, setApprovalsInternal] = useState(false);
  const [approvalsExternal, setApprovalsExternal] = useState(false);
  const [addLab, setAddLab] = useState(false);
  const [labTestMapping, setLabTestMapping] = useState(false);
  const [pharmacyAdd, setPharmacyAdd] = useState(false);
  const [enableHousing, setEnableHousing] = useState(false);
  const [collectionChip, setCollectionChip] = useState("");
  const [medicalChip, setMedicalChip] = useState("");
  const [dietChip, setDietChip] = useState("");
  const [roleList, setRoleList] = useState([]);
  const { successToast, errorToast, alertToast, warningToast } = useToast();

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  //ROLES
  const userPermissions = [
    { label: "View", value: "VIEW" },
    { label: "View + Add", value: "ADD" },
    { label: "View + Add + Edit", value: "EDIT" },
    { label: "View + Add + Edit + Delete", value: "DELETE" },
  ];
  const collectionInsightSwitch = (data) => {
    setCollectionInsight(data);
  };
  const collectionMortalitySwitch = (data) => {
    setCollectionMortality(data);
  };
  const collectionAnimalRecordSwitch = (data) => {
    setCollectionAnimalRecord(data);
    setCollectionChip(data ? "VIEW" : "");
  };
  const enableHousingSwitch = (data) => {
    setEnableHousing(data);
  };
  const housingInsightSwitch = (data) => {
    setHousingInsight(data);
  };
  const housingSectionSwitch = (data) => {
    setHousingSection(data);
  };
  const housingEnclosureSwitch = (data) => {
    setHousingEnclosure(data);
  };
  const medicalRecordSwitch = (data) => {
    setMedicalRecord(data);
    setMedicalChip(data ? "VIEW" : "");
  };
  const dietSwitch = (data) => {
    setDiet(data);
    setDietChip(data ? "VIEW" : "");
  };
  const approvalsInternalSwitch = (data) => {
    setApprovalsInternal(data);
  };
  const approvalsExternalSwitch = (data) => {
    setApprovalsExternal(data);
  };
  const viewLabSwitch = (data) => {
    setAddLab(data);
  };
  const transferLabSwitch = (data) => {
    setLabTestMapping(data);
  };
  const addPharmacySwitch = (data) => {
    setPharmacyAdd(data);
  };
  const handleCollectionChip = (data) => {
    setCollectionChip(data);
  };
  const handleMedicalChip = (data) => {
    setMedicalChip(data);
  };

  const handleSuperviorSectionModal = () => {
    return selectSupervisorModalRef.current.present();
  };

  const closeSheet = () => {
    selectSupervisorModalRef.current.close();
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const firstButtonPress = () => {
    navigation.goBack();
    alertModalClose();
  };
  const secondButtonPress = () => {
    alertModalClose();
  };
  useEffect(() => {
    const subcribe = navigation.addListener("focus", () => {
      getRoleData(roleId);
      getRoleList();
    });
    const backAction = () => {
      alertModalOpen();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
      subcribe();
    };
  }, [navigation]);

  const getRoleList = () => {
    getRoleListDetails()
      .then((v) => {
        setRoleList(v?.data);
      })
      .catch((e) => {
        errorToast("error", "Oops! Something went wrong!!");
      });
  };

  const selectRole = (item) => {
    setRoleName(item.role_name);
    setRoleId(item.id);
    closeSheet();
    getRoleData(item.id);
  };

  const getRoleData = (roleId) => {
    setIsLoading(true);
    getRoleEditData(roleId)
      .then((res) => {
        setRoleName(res?.data?.role_name);
        setCollectionInsight(res?.data?.permission?.collection_view_insights);
        setCollectionMortality(res?.data?.permission?.access_mortality_module);
        setCollectionAnimalRecord(
          res?.data?.permission?.collection_animal_records
        );
        setCollectionChip(
          res?.data?.permission?.collection_animal_record_access
        );
        setHousingInsight(res?.data?.permission?.housing_view_insights);
        setHousingSection(res?.data?.permission?.housing_add_section);
        setHousingEnclosure(res?.data?.permission?.housing_add_enclosure);
        setMedicalRecord(res?.data?.permission?.medical_records);
        setMedicalChip(res?.data?.permission?.medical_records_access);
        setDiet(res?.data?.permission?.diet_module);
        setDietChip(res?.data?.permission?.diet_module_access);
        setApprovalsInternal(
          res?.data?.permission?.approval_move_animal_internal
        );
        setApprovalsExternal(
          res?.data?.permission?.approval_move_animal_external
        );
        setLabTestMapping(res?.data?.permission?.lab_test_mapping);
        setAddLab(res?.data?.permission?.add_lab);
        setPharmacyAdd(res.data?.permission?.add_pharmacy);
        setEnableHousing(res.data?.permission?.enable_housing);
        setIsLoading(false);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
        setIsLoading(false);
      });
  };

  const addEditRole = () => {
    let obj = {
      role_name: roleName,
      user_role_id: roleId,
      permission: JSON.stringify({
        collection_view_insights: collectionInsight,
        access_mortality_module: collectionMortality,
        collection_animal_records: collectionAnimalRecord,
        collection_animal_record_access: collectionAnimalRecord
          ? collectionChip
          : "",
        housing_view_insights: housingInsight,
        housing_add_section: housingSection,
        housing_add_enclosure: housingEnclosure,
        medical_records: medicalRecord,
        medical_records_access: medicalRecord ? medicalChip : "",
        diet_module: diet,
        diet_module_access: diet ? dietChip : "",
        // approval_move_animal_internal: approvalsInternal,
        approval_move_animal_external: approvalsExternal,
        add_lab: addLab,
        lab_test_mapping: labTestMapping,
        add_pharmacy: pharmacyAdd,
        enable_housing: enableHousing,
      }),
    };
    setIsLoading(true);
    editRole(obj)
      .then((res) => {
        setIsLoading(false);
        navigation.goBack();
        successToast("success", res.message);
      })
      .catch((err) => {
        errorToast("error", err.message);
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Header
        noIcon={true}
        title={"Edit Role"}
        style={{
          backgroundColor: constThemeColor.onSecondary,
        }}
      />
      <Loader visible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View>
            <Text style={styles.heading}>Roles</Text>
            <CardTwo elevation={0} stylesData={[styles.cardStyle]}>
              <TextInput
                textColor={constThemeColor.onSecondaryContainer}
                style={{
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                }}
                mode="outlined"
                label={"Choose a Role"}
                placeholder="Veterinary Doctor"
                showSoftInputOnFocus={false}
                caretHidden={true}
                value={roleName}
                onPressIn={() => handleSuperviorSectionModal()}
                editable={null}
                selectTextOnFocus={false}
                outlineColor={constThemeColor.onSurfaceVariant}
                left={
                  <TextInput.Icon
                    icon={(props) => (
                      <MaterialCommunityIcons
                        {...props}
                        name="account-circle-outline"
                        size={32}
                        color={constThemeColor?.onPrimaryContainer}
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
                        color={constThemeColor?.onPrimaryContainer}
                        onPress={() => handleSuperviorSectionModal()}
                      />
                    )}
                  />
                }
              />
            </CardTwo>
            <CardTwo elevation={0} stylesData={[styles.cardStyle]}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={styles.roleBtn}
                  onPress={() =>
                    navigation.navigate("CreateRole", {
                      duplicateData: {
                        role_name: roleName,
                        user_role_id: props.route.params?.role_id,
                        permission: {
                          collection_view_insights: collectionInsight,
                          access_mortality_module: collectionMortality,
                          collection_animal_records: collectionAnimalRecord,
                          collection_animal_record_access: collectionChip,
                          housing_view_insights: housingInsight,
                          housing_add_section: housingSection,
                          housing_add_enclosure: housingEnclosure,
                          medical_records: medicalRecord,
                          medical_records_access: medicalChip,
                          diet_module: diet,
                          diet_module_access: dietChip,
                          // approval_move_animal_internal: approvalsInternal,
                          approval_move_animal_external: approvalsExternal,
                          add_lab: addLab,
                          lab_test_mapping: labTestMapping,
                          add_pharmacy: pharmacyAdd,
                          enable_housing: enableHousing,
                        },
                      },
                    })
                  }
                >
                  <MaterialIcons
                    name="group"
                    size={30}
                    color={constThemeColor?.onSurfaceVariant}
                  />
                  <Text style={styles.roleBtnText}>Duplicate Role</Text>
                </TouchableOpacity>
                {/* <View style={styles.roleBtn}>
                  <MaterialIcons
                    name="delete-outline"
                    size={30}
                    color={constThemeColor?.error}
                  />
                  <Text style={styles.roleBtnText}>Delete Role</Text>
                </View> */}
              </View>
            </CardTwo>
          </View>
          <View>
            <Text style={[styles.heading, { marginTop: Spacing.body }]}>
              Module Permissions
            </Text>
            <CardTwo elevation={0} stylesData={[styles.cardStyle]}>
              <View style={styles.cardHeadingWrap}>
                <MaterialIcons
                  name="pets"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
                <Text style={styles.cardHeading}>Collection</Text>
              </View>
              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>
                  Enable collection and view insights
                </Text>
                <Switch
                  handleToggle={collectionInsightSwitch}
                  active={collectionInsight}
                />
              </View>

              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Animals Record</Text>
                <Switch
                  handleToggle={collectionAnimalRecordSwitch}
                  active={collectionAnimalRecord}
                />
              </View>
              {collectionAnimalRecord && (
                <View>
                  <View>
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Minor_Regular.fontSize,
                        fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        color: constThemeColor?.onSurfaceVariant,
                        marginBottom: Spacing.small,
                      }}
                    >
                      Permission To
                    </Text>
                  </View>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={userPermissions}
                    search={false}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Permission"
                    searchPlaceholder="Search..."
                    value={collectionChip}
                    onChange={(item) => {
                      handleCollectionChip(item.value);
                    }}
                    renderRightIcon={() => (
                      <MaterialCommunityIcons
                        {...props}
                        name="chevron-down"
                        size={24}
                        color={constThemeColor?.onPrimaryContainer}
                      />
                    )}
                  />
                </View>
              )}
              {/* {collectionAnimalRecord && (
                <View>
                  <ChipGroup
                    accessFunction={handleCollectionChip}
                    access={collectionChip}
                  />
                </View>
              )} */}
              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Mortality</Text>
                <Switch
                  handleToggle={collectionMortalitySwitch}
                  active={collectionMortality}
                />
              </View>
            </CardTwo>
            <CardTwo elevation={0} stylesData={[styles.cardStyle]}>
              <View style={styles.cardHeadingWrap}>
                <MaterialCommunityIcons
                  name="home-analytics"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
                <Text style={styles.cardHeading}>Housing</Text>
              </View>
              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Enable Housing</Text>
                <Switch
                  handleToggle={enableHousingSwitch}
                  active={enableHousing}
                />
              </View>
              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>View Insights</Text>
                <Switch
                  handleToggle={housingInsightSwitch}
                  active={housingInsight}
                />
              </View>

              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Add Sections</Text>
                <Switch
                  handleToggle={housingSectionSwitch}
                  active={housingSection}
                />
              </View>

              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between", marginBottom: 0 },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Add Enclosure</Text>
                <Switch
                  handleToggle={housingEnclosureSwitch}
                  active={housingEnclosure}
                />
              </View>
            </CardTwo>
            <CardTwo elevation={0} stylesData={[styles.cardStyle]}>
              <View style={styles.cardHeadingWrap}>
                <MaterialCommunityIcons
                  name="home-plus-outline"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
                <Text style={styles.cardHeading}>Medical</Text>
              </View>
              <View
                style={[
                  styles.cardButtonWrap,
                  {
                    justifyContent: "space-between",
                    marginBottom: Spacing.small,
                  },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Medical Record</Text>
                <Switch
                  handleToggle={medicalRecordSwitch}
                  active={medicalRecord}
                />
              </View>
              {medicalRecord && (
                <View>
                  <View>
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Minor_Regular.fontSize,
                        fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        color: constThemeColor?.onSurfaceVariant,
                        marginBottom: Spacing.small,
                      }}
                    >
                      Permissions
                    </Text>
                  </View>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={userPermissions}
                    search={false}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Permission"
                    searchPlaceholder="Search..."
                    value={medicalChip}
                    onChange={(item) => {
                      setMedicalChip(item.value);
                    }}
                    renderRightIcon={() => (
                      <MaterialCommunityIcons
                        {...props}
                        name="chevron-down"
                        size={24}
                        color={constThemeColor?.onPrimaryContainer}
                      />
                    )}
                  />
                </View>
              )}
              {/* {medicalRecord && (
                <View>
                  <ChipGroup
                    accessFunction={handleMedicalChip}
                    access={medicalChip}
                  />
                </View>
              )} */}
            </CardTwo>
            <CardTwo elevation={0} stylesData={[styles.cardStyle]}>
              <View style={styles.cardHeadingWrap}>
                <FontAwesome6
                  name="plate-wheat"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
                <Text style={styles.cardHeading}>Diet</Text>
              </View>
              <View
                style={[
                  styles.cardButtonWrap,
                  {
                    justifyContent: "space-between",
                    marginBottom: Spacing.small,
                  },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Diet Module</Text>
                <Switch handleToggle={dietSwitch} active={diet} />
              </View>
              {diet && (
                <View>
                  <View>
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Minor_Regular.fontSize,
                        fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        color: constThemeColor?.onSurfaceVariant,
                        marginBottom: Spacing.small,
                      }}
                    >
                      Permissions
                    </Text>
                  </View>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={userPermissions}
                    search={false}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Permission"
                    searchPlaceholder="Search..."
                    value={dietChip}
                    onChange={(item) => {
                      setDietChip(item.value);
                    }}
                    renderRightIcon={() => (
                      <MaterialCommunityIcons
                        {...props}
                        name="chevron-down"
                        size={24}
                        color={constThemeColor?.onPrimaryContainer}
                      />
                    )}
                  />
                </View>
              )}
            </CardTwo>
            <CardTwo elevation={0} stylesData={[styles.cardStyle]}>
              <View style={styles.cardHeadingWrap}>
                <MaterialCommunityIcons
                  name="thumb-up-outline"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
                <Text style={styles.cardHeading}>Animal Transfer</Text>
              </View>
              {/* <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>
                  Move Animal - Internal
                </Text>
                <Switch
                  handleToggle={approvalsInternalSwitch}
                  active={approvalsInternal}
                />
              </View> */}

              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Allow</Text>
                <Switch
                  handleToggle={approvalsExternalSwitch}
                  active={approvalsExternal}
                />
              </View>
            </CardTwo>
            <CardTwo elevation={0} stylesData={[styles.cardStyle]}>
              <View style={styles.cardHeadingWrap}>
                <Entypo
                  name="lab-flask"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
                <Text style={styles.cardHeading}>Lab</Text>
              </View>
              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Add Lab</Text>
                <Switch handleToggle={viewLabSwitch} active={addLab} />
              </View>

              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>
                  Allow Lab Test Mapping
                </Text>
                <Switch
                  handleToggle={transferLabSwitch}
                  active={labTestMapping}
                />
              </View>
            </CardTwo>
            <CardTwo elevation={0} stylesData={[styles.cardStyle]}>
              <View style={styles.cardHeadingWrap}>
                <MaterialIcons
                  name="local-pharmacy"
                  size={24}
                  color={constThemeColor.onSurfaceVariant}
                />
                <Text style={styles.cardHeading}>Pharmacy</Text>
              </View>
              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Add Pharmacy</Text>
                <Switch handleToggle={addPharmacySwitch} active={pharmacyAdd} />
              </View>
            </CardTwo>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: constThemeColor?.onSecondary,
          paddingHorizontal: Spacing.small,
          paddingVertical: Spacing.major,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ButtonCom
          title={"Submit"}
          buttonStyle={styles.btn}
          titleColor={{
            color: constThemeColor?.onSecondary,
            fontSize: FontSize.Antz_Medium_Medium.fontSize,
            fontWeight: FontSize.Antz_Medium_Medium_btn.fontWeight,
            textAlign: "center",
          }}
          onPress={addEditRole}
        />
      </View>
      <BottomSheetModalComponent
        style={{ marginHorizontal: wp(4), paddingHorizontal: wp(0.5) }}
        ref={selectSupervisorModalRef}
      >
        <InsideBottomsheet
          title="Select a Role"
          type="role"
          data={roleList}
          navigation={() => {
            closeSheet();
            navigation.navigate("CreateRole");
          }}
          onPress={(item) => selectRole(item)}
        />
      </BottomSheetModalComponent>
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Are you sure you want to go back?"}
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
      paddingHorizontal: Spacing.minor,
      backgroundColor: reduxColor?.background,
    },
    heading: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      // lineHeight: 19,
      color: reduxColor?.onSurfaceVariant,
      marginBottom: Spacing.body,
      marginTop: Spacing.major,
      marginLeft: Spacing.small,
    },
    cardHeadingWrap: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Spacing.body,
    },
    cardButtonWrap: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: Spacing.body,
    },
    cardHeading: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColor?.onSurfaceVariant,
      lineHeight: 19,
      paddingLeft: Spacing.minor,
    },
    cardTextWithSwitch: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      lineHeight: 19,
      color: reduxColor?.onSurfaceVariant,
    },
    btn: {
      backgroundColor: reduxColor?.onPrimaryContainer,
      width: "85%",
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.minor,
      borderRadius: 8,
    },
    roleBtn: {
      alignItems: "center",
      marginHorizontal: wp(5),
      paddingHorizontal: wp(2),
      paddingVertical: hp(0),
      borderRadius: 4,
    },
    roleBtnText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColor?.onSurfaceVariant,
      paddingTop: hp(0.5),
    },
    dropdown: {
      borderColor: reduxColor.onSurfaceVariant,
      borderWidth: 1,
      borderRadius: 4,
      paddingVertical: Spacing.mini,
      paddingHorizontal: Spacing.body,
    },
    cardStyle: {
      marginTop: 0,
      marginBottom: Spacing.body,
    },
    selectedTextStyle: {
      color: reduxColor.onSecondaryContainer,
      //fontWeight: 'bold',
    },
  });

export default EditRole;
