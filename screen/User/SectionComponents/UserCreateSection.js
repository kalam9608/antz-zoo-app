import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import CustomForm from "../../../components/CustomForm";
import Loader from "../../../components/Loader";
import {
  CreateSectionData,
  EditSectionData,
} from "../../../services/AllSectionApis";
import { getSection } from "../../../services/staffManagement/getEducationType";
import NewDropdown from "../../../components/Dropdown";
import InputBox from "../../../components/InputBox";
import { View } from "react-native";
import Category from "../../../components/DropDownBox";
import { useSelector } from "react-redux";
import FontSize from "../../../configs/FontSize";
import { useToast } from "../../../configs/ToastConfig";

const items = [
  {
    category_id: 1,
    category_name: "FullAccess",
    category_type: 1,
    isExpanded: true,
    subcategory: [
      {
        id: 0,
        val: "No",
      },
      {
        id: 1,
        val: "Yes",
      },
    ],
  },
];

const activeitem = [
  {
    category_id: 1,
    category_name: "Active",
    category_type: 1,
    isExpanded: true,
    subcategory: [
      {
        id: 0,
        val: "No",
      },
      {
        id: 1,
        val: "Yes",
      },
    ],
  },
];

const UserCreateSection = (props) => {
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const navigation = useNavigation();
  const [fullAccess, setFullAccess] = useState(
    props.route.params?.item.full_access ?? ""
  );
  const [sectionName, setSectionName] = useState(
    props.route.params?.item.section_name ?? ""
  );
  const [id, setId] = useState(props.route.params?.item.section_id ?? "");
  const [active, setActive] = useState(props.route.params?.item.active ?? "");
  const [loading, setLoding] = useState("");
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [sectionDropDown, setSectionDropDown] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  const catPressed = (item) => {
    setSectionName(item.map((u) => u.name).join(", "));
    setId(item.map((id) => id.id).join(","));
    setSectionDropDown(!sectionDropDown);
  };
  const validation = () => {
    if (fullAccess.length === 0) {
      setIsError({ fullAccess: true });
      setErrorMessage({ fullAccess: "Select Full Access Options" });
      return false;
    } else if (id.length === 0) {
      setIsError({ id: true });
      setErrorMessage({ id: "Select Section Options" });
      return false;
    } else if (active.length === 0) {
      setIsError({ active: true });
      setErrorMessage({ active: "Select Active Options" });
      return false;
    }
    return true;
  };
  useEffect(() => {
    $postData = {
      zoo_id: zooID,
    };
    getSection($postData).then((res) => {
      let getdata = res.map((item) => {
        return {
          id: item.section_id,
          name: item.section_name,
        };
      });
      setSectionData(getdata);
    });
  }, []);

  const PostSectionData = () => {
    if (validation()) {
      let obj = {
        full_access: fullAccess,
        section_id: id,
        active: active,
        user_id: 1,
      };
      setLoding(true);
      CreateSectionData(obj)
        .then((res) => {
          setLoding(false);
          if (res.success) {
            navigation.goBack();
            successToast("success","Added Successfully");
          } else {
            errorToast("error","Oops! Something went wrong!!");
          }
        })
        .catch((err) => {
          errorToast("error","Oops! Something went wrong!!");
        });
    }
  };

  const getFullAccessData = (item) => {
    const accessdata = item.id;
    setFullAccess(accessdata);
  };

  const getActiveData = (item) => {
    const activeData = item.id;
    setActive(activeData);
  };

  const editOnSubmit = () => {
    if (validation()) {
      var obj = {
        // id: id,
        full_access: fullAccess,
        section_id: id,
        active: active,
      };
      setLoding(true);
      EditSectionData(obj)
        .then((res) => {})
        .catch((err) => {
          errorToast("error","Oops! Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
          successToast("success","Data update successfully");
          navigation.goBack();
        });
    }
  };

  const SetDropDown = (data) => {
    setSectionDropDown(data);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <CustomForm
          header={true}
          title={"Add Section "}
          onPress={PostSectionData}
        >
          <NewDropdown
            title="FullAccess"
            data={items}
            afterPressDropdown={getFullAccessData}
            errors={errorMessage.fullAccess}
            isError={isError.fullAccess}
          />
          <View style={{ marginTop: 20 }}>
            <InputBox
              editable={false}
              inputLabel="Section Name"
              value={sectionName}
              placeholder="Select Section Name"
              rightElement="chevron-down"
              DropDown={SetDropDown}
              errors={errorMessage.id}
              isError={isError.id}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <NewDropdown
              title="Active"
              data={activeitem}
              afterPressDropdown={getActiveData}
              errors={errorMessage.active}
              isError={isError.active}
            />
          </View>
        </CustomForm>
      )}
      {sectionDropDown ? (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <Category
            categoryData={sectionData}
            onCatPress={catPressed}
            heading={"Choose Section"}
            userType={"admin"}
            navigation={props.navigation}
            permission={"Yes"}
            screen={"AddCategory"}
            isMulti={false}
          />
        </View>
      ) : null}
    </>
  );
};
export default UserCreateSection;
const Styles = StyleSheet.create({
});
