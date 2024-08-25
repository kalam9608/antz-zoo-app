//create by : Arnab
// create on : 10.3.23

import { useContext, useEffect, useState, useRef } from "react";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import {
  assignUserSite,
  CreateSection,
} from "../../services/CreateSectionServices";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import Category from "../../components/DropDownBox";
import { Text, View, useWindowDimensions } from "react-native";
import { getSection } from "../../services/staffManagement/getEducationType";

import { useSelector } from "react-redux";
import { getListSite, getUserSite } from "../../services/AddSiteService";
import Modal from "react-native-modal";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { errorToast } from "../../utils/Alert";

export default function AssignUserSite(props) {
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const [sites, setSites] = useState([]);
  const [sitesId, setSitesId] = useState([]);
  const [sitesName, setSitesName] = useState([]);
  const [loading, setLoding] = useState(false);

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [siteDropDown, setSiteDropDown] = useState();
  const user_id = useSelector((state) => state.UserAuth.userDetails.user_id);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const passed_user_id = props.route.params?.item.user_id;

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const dynamicStyles = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  const validation = () => {
    if (sitesName === null || sitesName.trim().length === 0) {
      setIsError({ sitesName: true });
      setErrorMessage({ sitesName: "Choose any Site" });
      return false;
    }
    return true;
  };

  const getData = async () => {
    setLoding(true);
    Promise.all([getListSite(zooID), getUserSite({ user_id: passed_user_id })])
      .then((res) => {
        let sites = res[0].data.map((item) => {
          let selectValue = res[1].data.filter(
            (u) => u.site_id == item.site_id
          );
          return {
            id: item.site_id,
            name: item.site_name,
            isSelect: selectValue.length > 0 ? true : false,
          };
        });
        setSites(sites);
        setSitesName(res[1].data.map((u) => u.site_name).join(", "));
        setSitesId(res[1].data.map((u) => u.id));

        // setLoding(false);
      })
      .catch((err) => errorToast("Oops!", "Something went wrong!!"))
      .finally(() => {
        setLoding(false);
        // Closing all auto focus for favor of IOS modal By Biswanath Nath 24.04.2023
        // handleSubmitFocus(sectionNameRef);
      });
  };

  const handleSites = (item) => {
    setSitesName(item.map((u) => u.name).join(", "));
    setSitesId(item.map((u) => u.id));
    // setSiteDropDown(!siteDropDown);
  };

  useEffect(() => {
    setLoding(true);
    getData();
  }, []);

  const addSectionData = () => {
    if (validation()) {
      let obj = {
        user_id: passed_user_id,
        site_id: sitesId,
      };
      setLoding(true);
      assignUserSite(obj)
        .then((res) => {
          setLoding(false);
          alert(res.message);
          setTimeout(() => {
            navigation.goBack();
          }, 300);
          // navigation.goBack();
        })
        .catch((err) => {
          errorToast("Oops!", "Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  const SetDropDown = () => {
    setSiteDropDown(!siteDropDown);
  };

  const sectionNameRef = useRef(null);
  const handleSubmitFocus = (refs) => {
    if (refs.current) {
      refs.current.focus();
    }
  };

  //  useEffect(() => {
  //  setTimeout(() => {
  //     sectionNameRef.current.focus();
  //   }, 0);
  // },[]);

  return (
    <>
      <CustomForm
        header={true}
        title={"Assign User Sites"}
        onPress={addSectionData}
      >
        <Loader visible={loading} />
        <InputBox
          editable={false}
          inputLabel="Sites"
          value={sitesName}
          multiline={true}
          refs={sectionNameRef}
          placeholder="Select Sites"
          rightElement={siteDropDown ? "menu-up" : "menu-down"}
          DropDown={SetDropDown}
          onFocus={SetDropDown}
          errors={errorMessage.sitesName}
          isError={isError.sitesName}
        />
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
            onBackdropPress={SetDropDown}
            backdropColor="red"
          >
            <Category
              categoryData={sites}
              onCatPress={handleSites}
              heading={"Choose Sites"}
              isMulti={true}
              onClose={SetDropDown}
            />
          </Modal>
        </View>
      ) : null}
    </>
  );
}
