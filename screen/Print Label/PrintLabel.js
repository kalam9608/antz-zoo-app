//create by : Arnab
// create on : 7.6.23

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
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { getSection } from "../../services/staffManagement/getEducationType";

import { useSelector } from "react-redux";
import { getListSite, getUserSite } from "../../services/AddSiteService";
import Modal from "react-native-modal";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { getStaffList } from "../../services/staffManagement/addPersonalDetails";
import {
  getAnimalListBySections,
  getEnclosureBySectionId,
} from "../../services/GetEnclosureBySectionIdServices";
import { capitalize } from "../../utils/Utils";
import Colors from "../../configs/Colors";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { get_Print_Label } from "../../services/AnimalService";
import { AntDesign } from "@expo/vector-icons";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";

import FontSize from "../../configs/FontSize";
import { useToast } from "../../configs/ToastConfig";
import DialougeModal from "../../components/DialougeModal";
import Config from "../../configs/Config";

// const renderImage = (prop) => {
//   const images = prop.map((item) => {
//     return `<div style="width:100px;margin: 0 3px;">
//             <img src="${item}" width="100%" height="auto">
//         </div>`;
//   });
//   return images;
// };

const htmlRender = (data, type, isShowAnimalData, inputRef) => {
  let html = "";

  if (type === "user") {
    html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>App Html Table</title>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
        </style>
      </head>
    
      <body style="background: white">
        <main style="font-family: 'Roboto', sans-serif; padding: 20px 0px">`;

    const chunkSize = 2;
    for (let i = 0; i < data?.length; i += chunkSize) {
      const chunk = data?.slice(i, i + chunkSize);
      html += ` <div
      style="display: flex; justify-content: space-between; margin-top: 15px"
    >`;
      chunk?.forEach((item) => {
        html += `<div
                  style="
                    width: 39%;
                    padding: 15px 15px 0 15px;
                    border: 1px solid red;
                    text-align: center;
                  "
                  >
                  <img src=${item?.qr_image} style="width: 55%; height: auto" />
                  <h3 style="margin: 12px">${
                    item?.user_first_name + " " + item?.user_last_name
                  }</h3>
                  <h3 style="margin: 12px">${item?.user_email}</h3>
                  <h3 style="margin: 12px">${item?.user_mobile_number}</h3>
                  </div>`;
      });

      html += ` </div>`;
    }
    html += `</main>
      </body>
    </html>
    `;
  }

  if (type === "section" && !isShowAnimalData) {
    html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>App Html Table</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
          </style>
        </head>
      
        <body style="background: white">
          <main style="font-family: 'Roboto', sans-serif; padding: 20px 0px">`;

    const chunkSize = 2;
    for (let i = 0; i < data?.length; i += chunkSize) {
      const chunk = data?.slice(i, i + chunkSize);
      html += ` <div
        style="display: flex; justify-content: space-between; margin-top: 15px"
      >`;
      chunk?.forEach((item) => {
        html += `<div
                    style="
                      width: 39%;
                      padding: 15px 15px 0 15px;
                      border: 1px solid red;
                      text-align: center;
                    "
                    >
                    <img src=${item?.qr_image} style="width: 55%; height: auto" />
                    <h3 style="margin: 12px">#${item?.section_id}</h3>
                    <h3 style="margin: 12px">${item?.section_name}</h3>
                    </div>`;
      });

      html += ` </div>`;
    }
    html += `</main>
        </body>
      </html>
      `;
  }

  if (type === "section" && isShowAnimalData) {
    html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>App Html Table</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
          </style>
        </head>
      
        <body style="background: white">
          <main style="font-family: 'Roboto', sans-serif; padding: 20px 20px">`;

    data?.forEach((item, index) => {
      html += `<div
        style="
          display: flex;
          border: 1px solid red;
          width: 100%;
          align-items: center;
          margin: 15px auto 0 auto;
        "
      >
        <div style="width: 35%; padding: 15px; text-align: center">
          <img src=${item?.qr_image} style="width: 100%; height: auto" />
        </div>
        <div style="width: 75%; text-align: left">
        <h2 style="margin: 12px">#${item?.section_id}</h2>
        <h2 style="margin: 12px">${item?.section_name}</h2>
        </div>
      </div>
     `;

      const chunkSize = 2;
      for (let i = 0; i < item?.animal_data?.length; i += chunkSize) {
        const chunk = item?.animal_data?.slice(i, i + chunkSize);
        html += `<div
          style="display: flex; margin-top: 15px; justify-content: space-between"
        >`;
        chunk?.forEach((animal) => {
          html += `<div
                      style="
                        display: flex;
                        width: 45%;
                        align-items: center;
                        border: 1px solid blue;
                        padding: 10px;
                      "
                    >
                      <div style="width: 35%">
                        <img src=${
                          animal?.qr_image
                        } style="width: 100%; height: auto" />
                      </div>
                      <div style="width: 65%; padding: 0 12px; font-size: 12px">
                        <p style="font-size: 19px;font-weight: 900;margin: 0;font-family: 'Roboto',sans-serif;">${
                          animal?.scientific_name || "NA"
                        }</p>
                        <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">Local Id: ${
                          animal?.local_id || "NA"
                        }</small><br>
                        <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">Sex: ${
                          animal?.sex || "NA"
                        }</small>
                      </div>
                    </div>`;
        });

        html += ` </div>`;
      }
    });

    html += `</main>
      </body>
      
      </html>`;
  }

  if (type === "enclosure" && !isShowAnimalData) {
    html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>App Html Table</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
          </style>
        </head>
      
        <body style="background: white">
          <main style="font-family: 'Roboto', sans-serif; padding: 20px 0px">`;

    const chunkSize = 2;
    for (let i = 0; i < data?.length; i += chunkSize) {
      const chunk = data?.slice(i, i + chunkSize);
      html += ` <div
        style="display: flex; justify-content: space-between; margin-top: 15px"
      >`;
      chunk?.forEach((item) => {
        html += ` <div
            style="
              width: 39%;
              padding: 15px 15px 0 15px;
              border: 1px solid red;
              text-align: center;
            "
          >
            <img src=${item?.qr_image} style="width: 55%; height: auto" />
            <h3 style="margin: 12px">#${item?.enclosure_id}</h3>
            <h3 style="margin: 12px">${item?.user_enclosure_name}</h3>
          </div>`;
      });

      html += ` </div>`;
    }

    html += `</main>
        </body>
      </html>
      `;
  }

  if (type === "enclosure" && isShowAnimalData) {
    html = `<!DOCTYPE html>
       <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>App Html Table</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
          </style>
        </head>
      
        <body style="background: white">
          <main style="font-family: 'Roboto', sans-serif; padding: 20px 20px">`;

    const chunkSize = 2;
    let combineAnimalArr = [];
    for (let i = 0; i < data?.length; i += chunkSize) {
      combineAnimalArr = [];
      const chunk = data?.slice(i, i + chunkSize);
      html += `<div style="display: flex; justify-content: space-between; margin-top: 15px">`;
      chunk?.forEach((item) => {
        html += `<div
                    style="
                    width: 44%;
                    padding: 15px 15px 0 15px;
                    text-align: center;
                    border: 1px solid red;
                    "
                    >
                    <img src=${item?.qr_image} style="width: 80%; height: auto" />
                    <h3 style="margin: 12px">#${item?.enclosure_id}</h3>
                    <h3 style="margin: 12px">${item?.user_enclosure_name}</h3>
                    <p style="font-size: 12px">
                    ${item?.section_name}
                    </p>
                    </div>`;

        item?.animal_data?.forEach((animal) =>
          combineAnimalArr.push({ ...animal })
        );
      });

      html += `</div>`;

      const chunkSize1 = 2;
      for (let i = 0; i < combineAnimalArr?.length; i += chunkSize1) {
        const chunk1 = combineAnimalArr?.slice(i, i + chunkSize1);
        html += `<div style="display: flex; margin-top: 15px; justify-content: space-between">`;
        chunk1?.forEach((animal) => {
          html += ` <div
            style="
              display: flex;
              width: 45%;
              align-items: center;
              border: 1px solid blue;
              padding: 10px;
            "
          >
            <div style="width: 35%">
              <img src=${animal?.qr_image} style="width: 100%; height: auto" />
            </div>
            <div style="width: 65%; padding: 0 12px; font-size: 12px">
                        <p style="font-size: 19px;font-weight: 900;margin: 0;font-family: 'Roboto',sans-serif;">${
                          animal?.scientific_name || "NA"
                        }</p>
                        <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">Local Id: ${
                          animal?.local_id || "NA"
                        }</small><br>
                        <small style="font-family: 'Roboto',sans-serif; font-weight: 400;">Sex: ${
                          animal?.sex || "NA"
                        }</small>
                      </div>
          </div>`;
        });
        html += `</div>`;
      }

      html += `</div>`;
    }

    html += `</main>
        </body>
      </html>
      `;
  }

  if (type === "animal") {
    html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="ie=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>App Html Table</title>
            <style>
              @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
            </style>
          </head>
        
          <body style="background: white">
            <main style="font-family: 'Roboto', sans-serif; padding: 20px 0px">`;

    const chunkSize = 2;
    for (let i = 0; i < data?.length; i += chunkSize) {
      const chunk = data?.slice(i, i + chunkSize);
      html += ` <div
          style="display: flex; justify-content: space-between; margin-top: 15px"
        >`;
      chunk?.forEach((animal) => {
        html += `<div
                      style="
                        width: 39%;
                        padding: 15px 15px 0 15px;
                        border: 1px solid red;
                        text-align: center;
                      "
                      >
                      <img src=${
                        animal?.qr_image
                      } style="width: 55%; height: auto" />
                      <h2 style="margin: 12px">${
                        animal?.scientific_name || "NA"
                      }</h2>
                      <h3 style="margin: 12px">Local Id: ${
                        animal?.local_id || "NA"
                      }</h3>
                      <h3 style="margin: 12px">Sex: ${animal?.sex || "NA"}</h3>
                      </div>`;
      });

      html += ` </div>`;
    }
    html += `</main>
          </body>
        </html>
        `;
  }

  const download_data = async () => {
    inputRef.current.blur();
    const { uri } = await Print.printToFileAsync({
      html,
    });
    await shareAsync(uri, { UTI: ".jpeg", mimeType: "application/jpeg" });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={download_data}
      style={{ width: "100%", alignItems: "center", justifyContent: "center" }}
    >
      <Text
        style={{
          textAlign: "center",
          justifyContent: "center",
          fontSize: FontSize.Antz_Medium_Medium.fontSize,
        }}
      >
        Share <AntDesign name="export" size={30} color={Colors.green} />
      </Text>
    </TouchableOpacity>
  );
};

export default function PrintLabel(props) {
  const navigation = useNavigation();
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const { height, width } = useWindowDimensions();

  const [type, setType] = useState(props.route.params?.type ?? null);

  const [with_animal, setWith_animal] = useState(false);

  const [section, setsection] = useState([]);
  const [sectionId, setsectionId] = useState("");
  const [sectionName, setsectionName] = useState("");
  const [sectionDropdown, setsectionDropdown] = useState(false);

  const [enclosure, setenclosure] = useState([]);
  const [enclosureId, setenclosureId] = useState("");
  const [enclosureName, setenclosureName] = useState("");
  const [enclosureDropdown, setenclosureDropdown] = useState(false);

  const [animals, setanimals] = useState([]);
  const [animalsId, setanimalsId] = useState("");
  const [animalsName, setanimalsName] = useState("");
  const [animalsDropdown, setanimalsDropdown] = useState(false);

  const [users, setusers] = useState([]);
  const [usersId, setusersId] = useState("");
  const [usersName, setusersName] = useState("");
  const [usersDropdown, setusersDropdown] = useState(false);

  const [refId, setrefId] = useState(null);

  const [loading, setLoding] = useState(false);

  const [qrData, setqrData] = useState([]);

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});

  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const inputRef = useRef(null);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  // const dynamicStyles = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const validation = () => {
    if (refId === null) {
      setIsError({ refId: true });
      setErrorMessage({ refId: "Not selected any " + capitalize(type) });
      return false;
    }
    return true;
  };

  const getData = () => {
    setLoding(true);
    var postData = {
      zoo_id: zooID,
    };
    Promise.all([getSection(postData), getStaffList(postData)])
      .then((res) => {
        let staff = res[1].data.map((item) => {
          return {
            id: item.user_id,
            name: item.user_first_name + " " + item.user_last_name,
          };
        });
        let section = res[0].data.map((item) => {
          return {
            id: item.section_id,
            name: item.section_name,
          };
        });
        setsection(section);
        setusers(staff);
      })
      .catch((err) => errorToast("", "Oops! Something went wrong!!"))
      .finally(() => {
        setLoding(false);
      });
  };

  // Handle Section Dropdown
  const handleSection = (item) => {
    setsectionName(item.map((u) => u.name).join(", "));
    setsectionId(item.map((u) => u.id).join(", "));
    if (type == "section") {
      setrefId(item.map((u) => u.id).join(", "));
    }
    if (type != "section") {
      setenclosure([]);
      getEnclosureData(item[0].id);
      SetSectionDropDown();
    }
  };
  const SetSectionDropDown = () => {
    setsectionDropdown(!sectionDropdown);
  };

  // Handle Enclosure Dropdown
  const handleEnclosure = (item) => {
    setenclosureName(item.map((u) => u.name).join(", "));
    setenclosureId(item.map((u) => u.id).join(", "));
    if (type == "enclosure") {
      setrefId(item.map((u) => u.id).join(", "));
    }
    if (type != "enclosure") {
      getAnimalsData(item[0].id);
      SetEnclosureDropDown();
    }
  };
  const SetEnclosureDropDown = () => {
    setenclosureDropdown(!enclosureDropdown);
  };

  // Handle Animal Dropdown
  const handleAnimal = (item) => {
    setanimalsName(item.map((u) => u.name).join(", "));
    setrefId(item.map((u) => u.id).join(", "));
    if (type != "animal") {
      SetAnimalsDropDown();
    }
  };
  const SetAnimalsDropDown = () => {
    setanimalsDropdown(!animalsDropdown);
  };

  // Handle Users Dropdown
  const handleUsers = (item) => {
    setusersName(item.map((u) => u.name).join(", "));
    setrefId(item.map((u) => u.id).join(", "));
    if (type != "user") {
      SetUserDropDown();
    }
  };
  const SetUserDropDown = () => {
    setusersDropdown(!usersDropdown);
  };
  // fetch enclosure data by section id
  const getEnclosureData = (section_id) => {
    setIsError({});
    setLoding(true);
    let requestObj = {
      section_id: section_id,
    };
    getEnclosureBySectionId(requestObj)
      .then((res) => {
        let enclosure = res.data.enclosure_list.map((item) => {
          return {
            id: item.enclosure_id,
            name: item.user_enclosure_name,
          };
        });
        if (enclosure.length > 0) {
          setenclosure(enclosure);
        } else {
          setIsError({ sectionName: true });
          setErrorMessage({
            sectionName: "No enclosure available for this section!!",
          });
        }
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
      })
      .finally(() => {
        setLoding(false);
      });
  };

  // fetch animals data by section id
  const getAnimalsData = (enclosure_id) => {
    setIsError({});
    setLoding(true);
    let requestObj = {
      enclosure_id: enclosure_id,
    };
    getAnimalListBySections(requestObj)
      .then((res) => {
        let animals = res.data.animal_list.map((item) => {
          return {
            id: item.animal_id,
            name: item.scientific_name + "(" + item.animal_id + ")",
          };
        });
        if (animals.length > 0) {
          setanimals(animals);
        } else {
          setIsError({ enclosureName: true });
          setErrorMessage({
            enclosureName: "No animals available for this enclosure!!",
          });
          setanimals([]);
        }
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!!");
      })
      .finally(() => {
        setLoding(false);
      });
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  const firstButtonPress = () => {
    getQrCode("with_animal");
    alertModalClose();
  };
  const secondButtonPress = () => {
    getQrCode("");
    alertModalClose();
  };
  const getPrintLabel = () => {
    setErrorMessage({});
    if (validation()) {
      alertModalOpen();
    }
  };

  const PrintLabelCheck = () => {
    if (type == "animal" || type == "user") {
      getQrCode("");
    } else {
      getPrintLabel();
      //  Keyboard.dismiss()
    }
  };

  const getQrCode = async (purpose) => {
    setWith_animal(purpose == "with_animal" ? true : false);
    let obj = {
      type: type,
      ref_id: refId,
      purpose: purpose,
    };
    setLoding(true);
    get_Print_Label(obj)
      .then((data) => {
        setqrData(data?.data);
        setLoding(false);
      })
      .catch((error) => {
        errorToast("error", "Oops! Something went wrong!!"), setLoding(false);
      });
  };

  return (
    <>
      <CustomForm
        header={true}
        title={"Print Label for " + capitalize(type)}
        onPress={PrintLabelCheck}
      >
        <Loader visible={loading} />
        {type == "user" ? null : (
          <InputBox
            editable={false}
            refs={inputRef}
            inputLabel="Section"
            value={sectionName}
            placeholder="Select Section"
            rightElement={sectionDropdown ? "menu-up" : "menu-down"}
            DropDown={SetSectionDropDown}
            onFocus={SetSectionDropDown}
            onSubmitEditing={Keyboard.dismiss}
            errors={errorMessage.sectionName}
            isError={isError.sectionName}
            multiline={Platform.OS == "ios" ? true : false}
          />
        )}
        {(type == "enclosure" || type == "animal") && enclosure.length > 0 ? (
          <InputBox
            editable={false}
            refs={inputRef}
            inputLabel="Enclosure"
            value={enclosureName}
            placeholder="Select Enclosure"
            rightElement={enclosureDropdown ? "menu-up" : "menu-down"}
            DropDown={SetEnclosureDropDown}
            onFocus={SetEnclosureDropDown}
            errors={errorMessage.enclosureName}
            isError={isError.enclosureName}
            multiline={Platform.OS == "ios" ? true : false}
          />
        ) : null}
        {type == "animal" && animals.length > 0 ? (
          <InputBox
            editable={false}
            refs={inputRef}
            inputLabel="Animals"
            value={animalsName}
            placeholder="Select Animals"
            rightElement={animalsDropdown ? "menu-up" : "menu-down"}
            DropDown={SetAnimalsDropDown}
            onFocus={SetAnimalsDropDown}
            errors={errorMessage.animalsName}
            isError={isError.animalsName}
            multiline={Platform.OS == "ios" ? true : false}
          />
        ) : null}
        {type == "user" ? (
          <InputBox
            editable={false}
            refs={inputRef}
            inputLabel="User"
            value={usersName}
            placeholder="Select User"
            rightElement={usersDropdown ? "menu-up" : "menu-down"}
            DropDown={SetUserDropDown}
            onFocus={SetUserDropDown}
            errors={errorMessage.usersName}
            isError={isError.usersName}
            multiline={Platform.OS == "ios" ? true : false}
          />
        ) : null}
        {errorMessage.refId ? (
          <View style={{ width: "100%", marginTop: 10, alignItems: "center" }}>
            <Text style={{ color: Colors.danger }}>{errorMessage.refId}</Text>
          </View>
        ) : null}
        {qrData?.length > 0
          ? htmlRender(qrData, type, with_animal, inputRef)
          : null}
      </CustomForm>
      {sectionDropdown ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={sectionDropdown}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={SetSectionDropDown}
          >
            <Category
              categoryData={section}
              onCatPress={handleSection}
              heading={"Choose Section"}
              isMulti={type == "section" ? true : false}
              onClose={SetSectionDropDown}
            />
          </Modal>
        </View>
      ) : null}
      {enclosureDropdown ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={enclosureDropdown}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={SetEnclosureDropDown}
          >
            <Category
              categoryData={enclosure}
              onCatPress={handleEnclosure}
              heading={"Choose Enclosure"}
              isMulti={type == "enclosure" ? true : false}
              onClose={SetEnclosureDropDown}
            />
          </Modal>
        </View>
      ) : null}
      {animalsDropdown ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={animalsDropdown}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={SetAnimalsDropDown}
          >
            <Category
              categoryData={animals}
              onCatPress={handleAnimal}
              heading={"Choose Animal"}
              isMulti={type == "animal" ? true : false}
              onClose={SetAnimalsDropDown}
            />
          </Modal>
        </View>
      ) : null}
      {usersDropdown ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={usersDropdown}
            // style={{ margin: 0, justifyContent: "flex-end" }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={SetUserDropDown}
          >
            <Category
              categoryData={users}
              onCatPress={handleUsers}
              heading={"Choose Users"}
              isMulti={true}
              onClose={SetUserDropDown}
            />
          </Modal>
        </View>
      ) : null}
      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={"Do you want QR code with Animals?"}
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
    </>
  );
}
