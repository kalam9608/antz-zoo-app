import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import CustomForm from "../../../components/CustomForm";
import Loader from "../../../components/Loader";
import { PostSite } from "../../../services/AddSiteService";
import NewDropdown from "../../../components/Dropdown";
import { Alert, BackHandler, View, useWindowDimensions } from "react-native";
import InputBox from "../../../components/InputBox";
import Category from "../../../components/DropDownBox";
import { useSelector } from "react-redux";
// import AppContext from '../../../context/AppContext'
import Modal from "react-native-modal";
import BottomSheetModalStyles from "../../../configs/BottomSheetModalStyles";
import { useToast } from "../../../configs/ToastConfig";
import DialougeModal from "../../../components/DialougeModal";
import Config from "../../../configs/Config";

const FullAccessitems = [
  {
    id: 0,
    name: "No",
  },
  {
    id: 1,
    name: "Yes",
  },
];

const activeitem = [
  {
    id: 0,
    name: "No",
  },
  {
    id: 1,
    name: "Yes",
  },
];

const CreateSite = (props) => {
  const { successToast, errorToast } = useToast();
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const [fullAccess, setFullAccess] = useState(
    props.route.params?.item.full_access ?? ""
  );

  const [fullAccessId, setFullAccessId] = useState(
    props.route.params?.item.full_access ?? ""
  );
  const [getSite, setSite] = useState([]);
  const [siteDropDown, setSiteDropDown] = useState(false);
  const [fullAccessDropDown, setFullAccessDropDown] = useState(false);
  const [ActiveDropDown, setActiveDropDown] = useState(false);
  const [data, setData] = useState("");
  const [id, setId] = useState(0);
  const [active, setActive] = useState(props.route.params?.item.active ?? "");
  const [activeId, setActiveId] = useState(
    props.route.params?.item.active ?? ""
  );
  const [loading, setLoding] = useState("");
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const site = useSelector((state) => state.UserAuth.zoos);
  const user_id = useSelector((state) => state.UserAuth.userDetails.user_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const dynamicStyles = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  const catPressed = (item) => {
    // item.map((value)=>{setData(value.name)})
    setData(item.map((u) => u.name).join(", "));
    setId(item.map((id) => id.id).join(","));
    setSiteDropDown(!siteDropDown);
    // setActiveDropDown(true);
  };

  useEffect(() => {
    setSite(
      site[0].sites.map((item) => ({
        id: item.site_id,
        name: item.site_name,
      }))
    );
  }, []);

  const validation = () => {
    if (fullAccess.length === 0) {
      setIsError({ fullAccess: true });
      setErrorMessage({ fullAccess: "Select Full Access Options" });
      return false;
    } else if (data.length === 0) {
      setIsError({ data: true });
      setErrorMessage({ data: "Select Site Options" });
      return false;
    } else if (active.length === 0) {
      setIsError({ active: true });
      setErrorMessage({ active: "Select Active Options" });
      return false;
    }
    return true;
  };

  const PostSiteData = () => {
    if (validation()) {
      let obj = {
        full_access: fullAccessId,
        site_id: id,
        active: activeId,
        user_id: user_id,
      };
      setLoding(true);
      PostSite(obj)
        .then((res) => {
          setLoding(false);
          if (res.success) {
            navigation.goBack();
            successToast("success", res.message);
          } else errorToast("error", "Oops! Something went wrong!!");
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!!");
        });
    }
  };

  const getFullAccessData = (item) => {
    item.map((value) => {
      setFullAccess(value.name);
    });
    item.map((value) => {
      setFullAccessId(value.id);
    });
    setFullAccessDropDown(!fullAccessDropDown);
    {
      /*Closing all auto complete for favor of IOS modal By Biswanath Nath 24.04.2023
  setSiteDropDown(true); */
    }
  };
  const getActiveData = (item) => {
    item.map((value) => {
      setActive(value.name);
    });
    item.map((value) => {
      setActiveId(value.id);
    });
    setActiveDropDown(!ActiveDropDown);
  };

  const SetfullAccess = (data) => {
    setFullAccessDropDown(data);
    setSiteDropDown(false);
    setActiveDropDown(false);
  };

  const SetDropDown = (data) => {
    setSiteDropDown(data);
    setFullAccessDropDown(false);
    setActiveDropDown(false);
  };

  const Setactivedown = (data) => {
    setActiveDropDown(data);
    setFullAccessDropDown(false);
    setSiteDropDown(false);
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

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isSwitchOn
          ? constThemeColor.onSecondaryContainer
          : constThemeColor.surfaceVariant,
      }}
    >
      <Loader visible={loading} />
      <CustomForm header={true} title={"Add Site"} onPress={PostSiteData}>
        <InputBox
          editable={false}
          inputLabel="FullAccess "
          value={fullAccess}
          placeholder="Select FullAccess"
          rightElement={fullAccessDropDown ? "menu-up" : "menu-down"}
          DropDown={SetfullAccess}
          errors={errorMessage.fullAccess}
          isError={isError.fullAccess}
        />

        <View style={{ marginTop: 20 }}>
          <InputBox
            editable={false}
            inputLabel="Site Name"
            value={data}
            placeholder="Select Site Name"
            rightElement={siteDropDown ? "menu-up" : "menu-down"}
            DropDown={SetDropDown}
            errors={errorMessage.data}
            isError={isError.data}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <InputBox
            editable={false}
            inputLabel="Active"
            value={active}
            placeholder="Select Active"
            rightElement={ActiveDropDown ? "menu-up" : "menu-down"}
            DropDown={Setactivedown}
            errors={errorMessage.active}
            isError={isError.active}
          />
        </View>
      </CustomForm>

      {siteDropDown ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={siteDropDown}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={() => setSiteDropDown(!setSiteDropDown)}
          >
            <Category
              categoryData={getSite}
              onCatPress={catPressed}
              heading={"Choose Site"}
              isMulti={false}
              onClose={() => setSiteDropDown(!setSiteDropDown)}
            />
          </Modal>
        </View>
      ) : null}

      {fullAccessDropDown ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={fullAccessDropDown}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={() => setFullAccessDropDown(!fullAccessDropDown)}
          >
            <Category
              categoryData={FullAccessitems}
              onCatPress={getFullAccessData}
              heading={"Choose Full Access"}
              isMulti={false}
              onClose={() => setFullAccessDropDown(!fullAccessDropDown)}
            />
          </Modal>
        </View>
      ) : null}

      {ActiveDropDown ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={ActiveDropDown}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={() => setActiveDropDown(!ActiveDropDown)}
          >
            <Category
              categoryData={activeitem}
              onCatPress={getActiveData}
              heading={"Choose Active"}
              isMulti={false}
              onClose={() => setActiveDropDown(!ActiveDropDown)}
            />
          </Modal>
        </View>
      ) : null}
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
export default CreateSite;
