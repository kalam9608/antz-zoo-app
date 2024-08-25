import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
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
import { createRole } from "../../services/staffManagement/permission";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { Dropdown } from "react-native-element-dropdown";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";

const CreateRole = (props) => {
  const navigation = useNavigation();
  const { successToast, errorToast } = useToast();
  const [supervisor, setSupervisor] = useState(
    props.route.params?.duplicateData?.role_name === undefined
      ? ""
      : props.route.params?.duplicateData?.role_name + " - Copy"
  );

  const [collectionInsight, setCollectionInsight] = useState(
    props.route.params?.duplicateData?.permission?.collection_view_insights ??
      false
  );

  const [collectionMortality, setCollectionMortality] = useState(
    props.route.params?.duplicateData?.permission?.access_mortality_module ??
      false
  );

  const [collectionAnimalRecord, setCollectionAnimalRecord] = useState(
    props.route.params?.duplicateData?.permission?.collection_animal_records ??
      false
  );

  const [enableHousing, setEnableHousing] = useState(
    props.route.params?.duplicateData?.permission?.enable_housing ?? false
  );

  const [housingInsight, setHousingInsight] = useState(
    props.route.params?.duplicateData?.permission?.housing_view_insights ??
      false
  );

  const [housingSection, setHousingSection] = useState(
    props.route.params?.duplicateData?.permission?.housing_add_section ?? false
  );

  const [housingEnclosure, setHousingEnclosure] = useState(
    props.route.params?.duplicateData?.permission?.housing_add_enclosure ??
      false
  );

  const [medicalRecord, setMedicalRecord] = useState(
    props.route.params?.duplicateData?.permission?.medical_records ?? false
  );

  const [diet, setDiet] = useState(
    props.route.params?.duplicateData?.permission?.diet_module ?? false
  );

  const [approvalsInternal, setApprovalsInternal] = useState(
    props.route.params?.duplicateData?.permission
      ?.approval_move_animal_internal ?? false
  );

  const [approvalsExternal, setApprovalsExternal] = useState(
    props.route.params?.duplicateData?.permission
      ?.approval_move_animal_external ?? false
  );

  const [viewLabAccess, setViewLabAccess] = useState(
    props.route.params?.duplicateData?.permission?.add_lab ?? false
  );
  const [transferLabAccess, setTransferLabAccess] = useState(
    props.route.params?.duplicateData?.permission?.lab_test_mapping ?? false
  );

  const [addPharmacy, setAddPharmacy] = useState(
    props.route.params?.duplicateData?.permission?.add_pharmacy ?? false
  );

  const [collectionChip, setCollectionChip] = useState(
    props.route.params?.duplicateData?.permission
      ?.collection_animal_record_access ?? ""
  );
  const [medicalChip, setMedicalChip] = useState(
    props.route.params?.duplicateData?.permission?.medical_records_access ?? ""
  );
  const [dietChip, setDietChip] = useState(
    props.route.params?.duplicateData?.permission?.diet_module_access ?? ""
  );

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  //ROLES
  const userPermissions = [
    { label: "View", value: "VIEW" },
    { label: "View + Add", value: "ADD" },
    { label: "View + Add + Edit", value: "EDIT" },
    { label: "View + Add + Edit + Delete", value: "DELETE" },
  ];

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
    const backAction = () => {
      alertModalOpen();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

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
  const viewLabAccessSwitch = (data) => {
    setViewLabAccess(data);
  };
  const transferLabAccessSwitch = (data) => {
    setTransferLabAccess(data);
  };
  const addPharmacySwitch = (data) => {
    setAddPharmacy(data);
  };
  const handleCollectionChip = (data) => {
    setCollectionChip(data);
  };
  const handleMedicalChip = (data) => {
    setMedicalChip(data);
  };
  const validation = () => {
    if (!supervisor) {
      setIsError({ role: true });
      setErrorMessage({ role: "This field is required*" });
      return false;
    }
    return true;
  };
  const addNewRole = () => {
    setIsError({});
    setErrorMessage({});
    if (validation()) {
      let obj = {
        role_name: supervisor,
        permission: JSON.stringify({
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
          diet_module_access: diet ? dietChip : "",
          // approval_move_animal_internal: approvalsInternal,
          approval_move_animal_external: approvalsExternal,
          add_lab: viewLabAccess,
          lab_test_mapping: transferLabAccess,
          add_pharmacy: addPharmacy,
          enable_housing: enableHousing,
        }),
      };
      setLoading(true);
      createRole(obj)
        .then((res) => {
          setLoading(false);
          successToast("success", "Role created successfully");
          navigation.goBack();
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!!");
          setLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Header
        noIcon={true}
        title={"Create New Role"}
        style={{
          backgroundColor: constThemeColor.onSecondary,
        }}
      />
      <Loader visible={loading} />
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
                label={"Role Name"}
                placeholder="Role Name"
                value={supervisor}
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
                onChangeText={(data) => setSupervisor(data)}
                error={isError?.role}
              />
              {isError?.role ? (
                <Text
                  style={{
                    color: constThemeColor.error,
                    marginLeft: Spacing.mini,
                    marginTop: Spacing.mini,
                    fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                  }}
                >
                  {errorMessage?.role}
                </Text>
              ) : null}
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
                <Text style={styles.cardTextWithSwitch}>View Insights</Text>
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
                  handleToggle={(e) => {
                    collectionAnimalRecordSwitch(e);
                    // if (collectionChip === "") {
                    //   setCollectionChip("VIEW");
                    // }
                  }}
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
              {/* {collectionAnimalRecord && (
                <View>
                  <ChipGroup
                    accessFunction={handleCollectionChip}
                    access={collectionChip}
                  />
                </View>
              )} */}
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
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Medical Record</Text>
                <Switch
                  handleToggle={medicalRecordSwitch}
                  // handleToggle={(e) => {
                  //   medicalRecordSwitch(e);
                  //   if (medicalChip === "") {
                  //     setMedicalChip("VIEW");
                  //   }
                  // }}
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
                <Text style={styles.cardHeading}>Approvals</Text>
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
                  { justifyContent: "space-between", marginBottom: 0 },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Transfer Animal</Text>
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
                <Switch
                  handleToggle={viewLabAccessSwitch}
                  active={viewLabAccess}
                />
              </View>

              {/* <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>Assign Users</Text>
                <Switch
                  handleToggle={performLabAccessSwitch}
                  active={performLabAccess}
                />
              </View> */}

              <View
                style={[
                  styles.cardButtonWrap,
                  { justifyContent: "space-between", marginBottom: 0 },
                ]}
              >
                <Text style={styles.cardTextWithSwitch}>
                  Allow Lab Test Mapping
                </Text>
                <Switch
                  handleToggle={transferLabAccessSwitch}
                  active={transferLabAccess}
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
                <Switch handleToggle={addPharmacySwitch} active={addPharmacy} />
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
          onPress={addNewRole}
        />
      </View>
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
      //lineHeight: 19,
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

export default CreateRole;
