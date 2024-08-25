import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, BackHandler } from "react-native";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import CardTwo from "./components/cardTwo";
import Switch from "../../components/Switch";
import Loader from "../../components/Loader";
import {
  fullZooAccessPermission,
  getAllSectionsList
} from "../../services/staffManagement/permission";
import { ifEmptyValue } from "../../utils/Utils";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";


const AccessSite = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [allowFullAccess, setAllowFullAccess] = useState(false);
  const [hospital, setHospital] = useState(false);
  const [siteDetails] = useState(props?.route?.params.item);
  const [sectionData, setSectionData] = useState([]);
  const [accessSections] = useState(
    props.route.params?.sectionData?.section ?? []
  );
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const [activeSections, setactiveSections] = useState([]);
  const [switchChange, setSwitchChange] = useState(false);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  const gotoBack = () => {
    navigation.goBack();
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [dialogueTitle,setDialogueTitle] = useState('')
  const [dialogueSubtitle,setDialogueSubtitle] = useState('')
  const [type,setType] = useState('')
  const firstButtonPress = () => {
    if(type == 'update'){
      navigation.goBack()
      alertModalClose();
    }else if(type == 'back'){
      alertModalClose();
      navigation.goBack()
    }else if(type == 'fullPermissionUpdate'){
      alertModalClose();
      navigation.goBack()
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
      listSections();
      setAllowFullAccess(props.route.params?.sectionData?.full_access ?? false);
    });

    setactiveSections(
      sectionData
        .filter((item) => item.is_active == true)
        .map((v) => v?.section_id)
    );

    const activeLength = sectionData?.filter(i => i.is_active == true)?.length == sectionData?.length;
    if (activeLength) {
      setAllowFullAccess(true);
    }
    return subscribe;
  }, [navigation, switchChange]);

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

  const listSections = () => {
    let obj = {
      zoo_id: props.route.params?.item?.zoo_id,
      site_id: props.route.params?.item?.site_id,
    };
    setLoading(true);
    getAllSectionsList(obj)
      .then((res) => {
        let section = res.data.map((item) => {
          return {
            section_id: item.section_id,
            section_name: item.section_name,
            is_active: accessSections.filter(
              (e) => e.section_id == item.section_id
            )[0]?.full_access,
          };
        });
        setactiveSections(
          section
            .filter((item) => item.is_active == true)
            .map((v) => v?.section_id)
        );
        setSectionData(section);
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error","Oops! Something went wrong!!");
        setLoading(false);
      });
  };

  const fullAccessSwitch = (data) => {
    setAllowFullAccess(data);
    if (data == true) {
      let section = sectionData.map((item) => {
        return {
          section_id: item.section_id,
          section_name: item.section_name,
          is_active: true,
        };
      });
      setactiveSections(
        section
          .filter((item) => item.is_active == true)
          .map((v) => v?.section_id)
      );
      setSectionData(section);
      setType("update");
    }
    if (data == false) {
      let section = sectionData.map((item) => {
        return {
          section_id: item.section_id,
          section_name: item.section_name,
          is_active: false,
        };
      });
      setactiveSections([]);
      setSectionData(section);
      setType("update");
    }
        // let obj = {
    //   site_id: props.route.params?.item?.site_id,
    //   full_access: data,
    //   zoo_id: props.route.params?.item?.zoo_id,
    //   user_id: props.route.params?.user_id,
    // };
    // setLoading(true);
    // fullZooAccessPermission(obj)
    //   .then((res) => {
    //     if (res.success) {
    // let section = sectionData.map((item) => {
    //   return {
    //     section_id: item.section_id,
    //     section_name: item.section_name,
    //     is_active:data?true:false
    //   };
    // });
    // setactiveSections(
    //   section
    //     .filter((item) => item.is_active == true)
    //     .map((v) => v?.section_id)
    // );
    // setSectionData(section);
    // setType('update')
    //       setDialogueTitle(res.message)
    //       setDialogueSubtitle('Do you want to go back?')
    //       alertModalOpen();

    //     } else {
    //       errorToast("error","Oops! Something went wrong!!");
    //     }
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     // console.log(err);
    //     // errorToast("Oops!", "Something went wrong!!");
    //     setLoading(false);
    //   });
  };

  const handleSwitch = (item) => {
    setSwitchChange(!switchChange);
    let arr = sectionData ?? [];
    arr = arr.map((ele) => {
      return {
        section_id: ele.section_id,
        section_name: ele.section_name,
        is_active:
          item.section_id == ele.section_id ? !item.is_active : ele.is_active,
      };
    });
    setSectionData(arr);
    if (arr.filter((item) => item.is_active == false).length > 0) {
      setAllowFullAccess(false);
    }
  };

  const assignUserAccess = () => {
    let obj = {
      site_id: props.route.params?.item?.site_id,
      full_access: allowFullAccess,
      sections: activeSections,
      zoo_id: props.route.params?.item?.zoo_id,
      user_id: props.route.params?.user_id,
    };
    setLoading(true);
    if (sectionData.length) {
      fullZooAccessPermission(obj)
        .then((res) => {
          setLoading(false);
          let fullAccess = res.data.sites.filter(
            (item) => item.site_id == props.route.params?.item?.site_id
          );
          setAllowFullAccess(
            fullAccess.length > 0 ? fullAccess[0].full_access : false
          );
          if (res.success) {

            setType('fullPermissionUpdate')
            setDialogueTitle(res.message)
            setDialogueSubtitle('Do you want to go back?')
            alertModalOpen();
          } else {
            errorToast("error","Oops! Something went wrong!!");
          }
        })
        .catch((err) => {
          console.log({err});
          errorToast("error","Oops! Something went wrong!!");
          setLoading(false);
        });
    } else {
      warningToast("Oops!!", "No section available!");
      setLoading(false);
    }
  };
const backPermission = ()=>{
  alertModalOpen();
  setType('back')
  setDialogueTitle('Are you sure you want to go back?')
  setDialogueSubtitle('')
}
  return (
    <View style={styles.container}>
      <Header
        title={siteDetails.site_name}
        onPress={assignUserAccess}
        noIcon={false}
        back={() =>
          // successDailog(
          //   "Are you sure you want to go back?",
          //   "",
          //   "YES",
          //   () => navigation.goBack(),
          //   "NO"
          // )
          backPermission()
        }
      />
      <Loader visible={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <CardTwo elevation={0}>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>Allow full access</Text>
              <Switch
                active={allowFullAccess}
                handleToggle={fullAccessSwitch}
              />
            </View>
          </CardTwo>
          <View style={styles.headingSection}>
            <Text style={styles.heading}>Access Sections</Text>
            <Text style={styles.rightHeading}>
              {`${activeSections?.length}/${sectionData?.length} Sections`}
            </Text>
          </View>
          {sectionData?.map((item, index) => {
            return (
              <CardTwo elevation={0} key={index.toString()}>
                <View style={styles.cardBody}>
                  <Text style={styles.cardText}>
                    {ifEmptyValue(item?.section_name)}
                  </Text>
                  <Switch
                    active={item?.is_active}
                    handleToggle={handleSwitch}
                    multiple
                    data={item}
                  />
                </View>
              </CardTwo>
            );
          })}
        </View>
      </ScrollView>
      <DialougeModal
        isVisible={isModalVisible}
        alertType={type == "back" ? Config.ERROR_TYPE : Config.SUCCESS_TYPE}
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
      backgroundColor:reduxColor.background,
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
       paddingTop:Spacing.minor,
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
      paddingLeft:Spacing.small,
    },
    rightHeading: {
      color: reduxColor?.onSurface,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      paddingRight:Spacing.small,
    },
  });

export default AccessSite;
