//create by : Arnab
// create on : 10.3.23

import { useContext, useEffect, useState } from "react";
import CustomForm from "../../../components/CustomForm";
import InputBox from "../../../components/InputBox";
import Loader from "../../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import Category from "../../../components/DropDownBox";
import { Alert, BackHandler, Text, View } from "react-native";
import { getDepartments } from "../../../services/staffManagement/getEducationType";

import {
  createUserDepartment,
  editUserDepartment,
} from "../../../services/UserDepartmentService";
import { useSelector } from "react-redux";
import { useToast } from "../../../configs/ToastConfig";

export default function AddDepartment(props) {
  const { successToast, errorToast, } = useToast();
  const navigation = useNavigation();
  const [department, setdepartment] = useState([]);
  const [id, setId] = useState(props.route.params?.item.id ?? 0);
  const [departmentId, setdepartmentId] = useState(
    props.route.params?.item.department_id ?? ""
  );
  const [departmentName, setdepartmentName] = useState(
    props.route.params?.item.dept_name ?? null
  );
  const [loading, setLoding] = useState(false);

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [departmentDropDown, setDepartmentDropDown] = useState();

  const validation = () => {
    if (departmentName === null || departmentName.trim().length === 0) {
      setIsError({ departmentName: true });
      setErrorMessage({ departmentName: "Choose any Department" });
      return false;
    }
    return true;
  };

  const getData = async () => {
    getDepartments()
      .then((res) => {
        let department = res.map((item) => {
          return {
            id: item.dept_id,
            name: item.dept_name,
          };
        });
        setdepartment(department);
        setLoding(false);
      })
      .catch((err) => errorToast("error","Oops! Something went wrong!!"));
  };

  const handledepartment = (item) => {
    setdepartmentName(item.map((u) => u.name).join(", "));
    setdepartmentId(item.map((u) => u.id)[0]);
    setDepartmentDropDown(false);
  };

  const departmentClose = () => {
    setDepartmentDropDown(false);
  };

  useEffect(() => {
    setLoding(true);
    getData();
  }, []);

  const adddepartmentData = () => {
    if (validation()) {
      let obj = {
        department_id: departmentId,
      };
      setLoding(true);
      createUserDepartment(obj)
        .then((res) => {
          successToast("success","Added Successfully");
          navigation.goBack();
        })
        .catch((err) => {
          errorToast("error","Oops! Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  const editDeptData = () => {
    if (validation()) {
      let obj = {
        department_id: departmentId,
        id: id,
      };
      setLoding(true);
      editUserDepartment(obj)
        .then((res) => {
          successToast("success","Updated Successfully");
          navigation.goBack();
        })
        .catch((err) => {
          errorToast("error","Oops! Something went wrong!!");
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  const SetDropDown = () => {
    setDepartmentDropDown(!departmentDropDown);
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel", onPress: () => {} },
          { text: "OK", onPress: () => navigation.goBack() },
        ],
        { cancelable: false }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);

  return (
    <>
      <CustomForm
        header={true}
        title={"Assign User Department"}
        onPress={id > 0 ? editDeptData : adddepartmentData}
      >
        <Loader visible={loading} />
        <InputBox
          editable={false}
          inputLabel="Section Name"
          value={departmentName}
          placeholder="Select Section Name"
          rightElement={departmentDropDown ? "menu-up" : "menu-down"}
          DropDown={SetDropDown}
          errors={errorMessage.departmentName}
          isError={isError.departmentName}
        />
      </CustomForm>
      {departmentDropDown ? (
        <View style={{ flex: 1, backgroundColor: constThemeColor.onPrimary }}>
          <Category
            categoryData={department}
            onCatPress={handledepartment}
            heading={"Choose Department"}
            onClose={departmentClose}
          />
        </View>
      ) : null}
    </>
  );
}
