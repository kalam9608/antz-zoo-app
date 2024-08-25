import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import CardTwo from "./components/cardTwo";
import Header from "../../components/Header";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Switch from "../../components/Switch";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  masterAssignpermission,
  permissionSummary,
} from "../../services/staffManagement/permission";
import Loader from "../../components/Loader";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { SvgXml } from "react-native-svg";
import home_housing from "../../assets/home_housing.svg";
import ButtonCom from "../../components/ButtonCom";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";
import note_alt from '../../assets/note_alt.svg';

const MasterPermission = (props) => {
  const navigation = useNavigation();
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [species, setSpecies] = useState(false);
  const [sites, setSites] = useState(false);
  const [newDiagnosis, setNewDiagnosis] = useState(false);
  const [newComplaints, setNewComplaints] = useState(false);
  const [newMedicines, setNewMedicines] = useState(false);
  const [tests, setTests] = useState(false);
  const [sample, setSample] = useState(false);
  const [medicalAdvice, setMedicalAdvice] = useState(false);
  const [prescriptions, setPrescriptions] = useState(false);
  const [designation, setDesignation] = useState(false);
  const [department, setDepartment] = useState(false);
  const [idProof, setIdProof] = useState(false);
  const [education, setEducation] = useState(false);
  const [animalTransfer, setAnimalTransfer] = useState(false);
  const [organization, setOrgnazation] = useState(false);
  const [assessment, setAssessment] = useState(false);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [isModalVisible, setModalVisible] = useState(false);

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };

  const firstButtonPress = () => {
      alertModalClose();
      navigation.goBack()
  };

  const secondButtonPress = () => {
    alertModalClose();
  };

  useEffect(() => {
    const subcribe = navigation.addListener("focus", () => {
      getMasterData();
    });
    const backAction = () => {
      // Alert.alert(
      //   "Confirmation",
      //   "Are you sure you want to go back?",
      //   [
      //     { text: "Cancel", style: "cancel", onPress: () => {} },
      //     { text: "OK", onPress: () => navigation.goBack() },
      //   ],
      //   { cancelable: false }
      // );
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

  const getMasterData = () => {
    setLoading(true);
    permissionSummary({ user_id: props.route.params?.user_id })
      .then((res) => {
        setLoading(false);
        setAnimalTransfer(
          res.data?.permission?.add_institutes_for_animal_transfer
        );
        setOrgnazation(res.data?.permission?.add_organizations);
        setSpecies(res.data?.permission?.add_taxonomy);
        setSites(res.data?.permission?.add_sites);
        setDesignation(res.data?.permission?.add_designations);
        setDepartment(res.data?.permission?.add_departments);
        setIdProof(res.data?.permission?.add_id_proofs);
        setEducation(res.data?.permission?.add_educations);
        setNewDiagnosis(res.data?.permission?.medical_add_diagnosis);
        setNewComplaints(res.data?.permission?.medical_add_complaints);
        setNewMedicines(res.data?.permission?.medical_add_prescription);
        setTests(res.data?.permission?.medical_add_tests);
        setSample(res.data?.permission?.medical_add_samples);
        setMedicalAdvice(res.data?.permission?.medical_add_advices);
        setAssessment(res.data?.permission?.add_assessment);
      })
      .catch((err) => {
        errorToast("error","Oops! Something went wrong!!");
        setLoading(false);
      });
  };

  const speciesSwitch = (data) => setSpecies(data);
  const sitesSwitch = (data) => setSites(data);
  const newComplaintSwitch = (data) => setNewComplaints(data);
  const newDiagnosisSwitch = (data) => setNewDiagnosis(data);
  const newMedicinesSwitch = (data) => setNewMedicines(data);
  const medicalAdviceSwitch = (data) => setMedicalAdvice(data);
  const departmentSwitch = (data) => setDepartment(data);
  const idProofSwitch = (data) => setIdProof(data);
  const educationTypeSwitch = (data) => setEducation(data);
  const animalTransferSwitch = (data) => setAnimalTransfer(data);
  const addOrganizationSwitch = (data) => setOrgnazation(data);
  const designationSwitch = (data) => setDesignation(data);
  const assessmentSwitch = (data) => setAssessment(data);

  const handleSubmit = () => {
    setLoading(true);
    let obj = {
      user_id: props.route.params?.user_id,
      master_access: {
        add_taxonomy: species,
        add_sites: sites,
        add_designations: designation,
        add_departments: department,
        add_id_proofs: idProof,
        add_educations: education,
        add_institutes_for_animal_transfer: animalTransfer,
        add_organizations: organization,
        medical_add_diagnosis: newDiagnosis,
        medical_add_complaints: newComplaints,
        medical_add_prescription: newMedicines,
        medical_add_samples: sample,
        medical_add_tests: tests,
        medical_add_advices: medicalAdvice,
        add_assessment: assessment 
      },
    };
    masterAssignpermission(obj)
      .then((res) => {
        setLoading(false);
        getMasterData();
        if (res.success) {
          successToast("success", res?.message);
          navigation.goBack();
        } else {
          warningToast("warning", res?.message?.master_access);
        }
      })
      .catch((err) => {
        errorToast("error","Oops! Something went wrong!!");
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <Header
        noIcon={true}
        style={{
          //paddingVertical: hp(2),
          backgroundColor: constThemeColor.onSecondary,
        }}
        title={"Master Permissions"}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.titleSection}>
            <Text style={styles.bodyTitle}>Module Permissions</Text>
          </View>
          <View style={styles.cardSection}>
            <CardTwo elevation={0} stylesData={styles.cardStyle}>
              <View style={styles.cardTitleSection}>
                <MaterialIcons
                  name="person"
                  size={24}
                  style={styles.cardTitleIcon}
                />
                <View>
                  <Text style={styles.cardTitle}>Administration</Text>
                </View>
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>
                  Add Institutes for Animal Transfer
                </Text>
                <Switch
                  handleToggle={animalTransferSwitch}
                  active={animalTransfer}
                />
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add organization</Text>
                <Switch
                  handleToggle={addOrganizationSwitch}
                  active={organization}
                />
              </View>
            </CardTwo>
          </View>
          <View style={styles.cardSection}>
            <CardTwo elevation={0} stylesData={styles.cardStyle}>
              <View style={styles.cardTitleSection}>
                <MaterialIcons
                  name="pets"
                  size={24}
                  style={styles.cardTitleIcon}
                />
                <View>
                  <Text style={styles.cardTitle}>Collection</Text>
                </View>
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add Species</Text>
                <Switch handleToggle={speciesSwitch} active={species} />
              </View>
            </CardTwo>
          </View>

          <View style={styles.cardSection}>
            <CardTwo elevation={0} stylesData={styles.cardStyle}>
              <View style={styles.cardTitleSection}>
                <View>
                  <SvgXml xml={home_housing} style={[styles.cardTitleIcon]} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Housing</Text>
                </View>
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add Sites</Text>
                <Switch handleToggle={sitesSwitch} active={sites} />
              </View>
            </CardTwo>
          </View>
          <View style={styles.cardSection}>
            <CardTwo elevation={0} stylesData={styles.cardStyle}>
              <View style={styles.cardTitleSection}>
                <MaterialIcons
                  name="person"
                  size={24}
                  style={styles.cardTitleIcon}
                />
                <View>
                  <Text style={styles.cardTitle}>Users</Text>
                </View>
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add Designations</Text>
                <Switch handleToggle={designationSwitch} active={designation} />
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add Departments</Text>
                <Switch handleToggle={departmentSwitch} active={department} />
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add Id Proofs</Text>
                <Switch handleToggle={idProofSwitch} active={idProof} />
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add Education Type</Text>
                <Switch handleToggle={educationTypeSwitch} active={education} />
              </View>
            </CardTwo>
          </View>

          <View style={styles.cardSection}>
            <CardTwo elevation={0} stylesData={styles.cardStyle}>
              <View style={styles.cardTitleSection}>
                <View>
                  <SvgXml xml={note_alt} style={[styles.cardTitleIcon]} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Assessment</Text>
                </View>
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add Assessment</Text>
                <Switch handleToggle={assessmentSwitch} active={assessment} />
              </View>
            </CardTwo>
          </View>

          <View style={styles.cardSection}>
            <CardTwo>
              <View style={styles.cardTitleSection}>
                <MaterialCommunityIcons
                  name="home-plus"
                  size={24}
                  style={styles.cardTitleIcon}
                />
                <View>
                  <Text style={styles.cardTitle}>Medical</Text>
                </View>
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add New Complaints</Text>
                <Switch
                  handleToggle={newComplaintSwitch}
                  active={newComplaints}
                />
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add New Diagnosis</Text>
                <Switch
                  handleToggle={newDiagnosisSwitch}
                  active={newDiagnosis}
                />
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add New Medicines</Text>
                <Switch
                  handleToggle={newMedicinesSwitch}
                  active={newMedicines}
                />
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add Medical Tests</Text>
                <Switch
                  handleToggle={(v) => setTests(v)}
                  active={tests}
                />
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add Medical Samples</Text>
                <Switch
                  handleToggle={(v) => setSample(v)}
                  active={sample}
                />
              </View>
              <View
                style={[
                  styles.cardTitleButtonWrap,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.bodyTitle}>Add Medical Advices</Text>
                <Switch
                  handleToggle={medicalAdviceSwitch}
                  active={medicalAdvice}
                />
              </View>
            </CardTwo>
          </View>
        </View>
      </ScrollView>

      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Confirmation"}
        subTitle={"Are you sure you want to go back?"}
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
      <View
        style={{
          backgroundColor: constThemeColor?.background,
          padding: Spacing.small,
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
          onPress={handleSubmit}
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
      backgroundColor: reduxColor?.background,
    },
    titleSection: {
      paddingHorizontal: Spacing.small,
      paddingTop: Spacing.major,
      // paddingBottom: Spacing.body,
    },
    bodyTitle: {
      color: reduxColor?.onSurfaceVariant,
      fontSize: FontSize?.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize?.Antz_Minor_Regular.fontWeight,
      marginBottom: Spacing.small,
    },
    cardSection: {
      //marginVertical: hp(0.5),
    },
    cardTitleSection: {
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: Spacing.body,
    },
    cardTitleButtonWrap: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: Spacing.body,
    },
    cardTitleIcon: {
      marginRight: Spacing.minor,
      color: reduxColor.onSurfaceVariant,
    },
    cardTitle: {
      fontSize: FontSize?.Antz_Minor_Title?.fontSize,
      fontWeight: FontSize?.Antz_Minor_Title?.fontWeight,
      color: reduxColor?.onSurfaceVariant,
    },
    cardStyle: {
      marginVertical: Spacing.small,
    },
    btn: {
      backgroundColor: reduxColor?.onPrimaryContainer,
      width: "85%",
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.minor,
      borderRadius: 8,
    },
  });

export default MasterPermission;
