//Create by: Gaurav Shukla
//Create on :21/02/2023

import React, { useState } from "react";
import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Category from "../../components/DropDownBox";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useSelector } from "react-redux";

const items = [
  {
    id: 1,
    name: "Ondo",
  },
  {
    id: 2,
    name: "Ogun",
  },
  {
    id: 3,
    name: "Calabar",
  },
  {
    id: 4,
    name: "Lagos",
  },
  {
    id: 5,
    name: "Maiduguri",
  },
  {
    id: 6,
    name: "Anambra",
  },
  {
    id: 7,
    name: "Benue",
  },
  {
    id: 8,
    name: "Kaduna",
  },
  {
    id: 9,
    name: "Moggara",
  },
  {
    id: 10,
    name: "Ambuaj",
  },
];

const EnclosureForm = (props) => {
  const [section, setSection] = useState(false);
  const [type, setType] = useState(false);
  const [size, setSize] = useState(false);
  const [data, setData] = useState(null);
  const [sectionVal, setSectionVal] = useState(null);
  const [feet, setFeet] = useState(null);

  const catPressed = (item) => {
    setData(item.map((u) => u.name).join(", "));
  };

  const changeType = (item) => {
    setSectionVal(item.map((u) => u.name).join(", "));
  };

  const changeSize = (item) => {
    setFeet(item.map((u) => u.name).join(", "));
  };

  const onChange = (item) => {};
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  //  const reduxColors = styles(constThemeColor);
  return (
    <>
      <CustomForm header={true} title={"Add Enclosure"}>
        <InputBox
          inputLabel={"Enclosure Name"}
          placeholder={"Enter Enclosure Name"}
          onChange={onChange}
        />
        <InputBox
          inputLabel={"Enclosure ID"}
          placeholder={"Enter Enclosure/cage id"}
          onChange={onChange}
        />
        <InputBox
          inputLabel={"Choose Section"}
          placeholder={"Choose Section"}
          onChange={onChange}
          editable={false}
          defaultValue={data != null ? data : null}
          rightElement={
            <AntDesign
              onPress={() => {
                setSection(!section);
                setSize(false);
                setType(false);
              }}
              name={section ? "up" : "down"}
              size={24}
              color={constThemeColor.neutralSecondary}
            />
          }
        />
        <InputBox
          inputLabel={"Choose Type"}
          placeholder={"Choose Type"}
          onChange={onChange}
          editable={false}
          defaultValue={sectionVal != null ? sectionVal : null}
          rightElement={
            <AntDesign
              onPress={() => {
                setSize(false);
                setSection(false);
                setType(!type);
              }}
              name={type ? "up" : "down"}
              size={24}
              color={constThemeColor.neutralSecondary}
            />
          }
        />
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            marginBottom: "15%",
          }}
        >
          <InputBox
            mode={"flat"}
            inputLabel={"Enclosure Size"}
            placeholder={"Enter Size"}
            onChange={onChange}
            style={{ width: "50%" }}
          />
          <InputBox
            mode={"flat"}
            placeholder={"in Feet"}
            style={{ marginLeft: "5%", width: "50%" }}
            onChange={onChange}
            editable={false}
            defaultValue={feet != null ? feet : null}
            rightElement={
              <AntDesign
                onPress={() => {
                  setSize(!size);
                  setSection(false);
                  setType(false);
                }}
                name={size ? "up" : "down"}
                size={24}
                color={constThemeColor.neutralSecondary}
              />
            }
          />
        </View>
      </CustomForm>

      {section ? (
        <View style={{ flex: 1, backgroundColor: constThemeColor.onPrimary }}>
          <Category
            categoryData={items}
            onCatPress={catPressed}
            heading={"Choose Section"}
            userType={"admin"}
            navigation={props.navigation}
            permission={"Yes"}
            screen={"AddCategory"}
            isMulti={true}
          />
        </View>
      ) : null}

      {type ? (
        <View style={{ flex: 1, backgroundColor: constThemeColor.onPrimary }}>
          <Category
            categoryData={items}
            onCatPress={changeType}
            heading={"Choose Section"}
            userType={"admin"}
            navigation={props.navigation}
            permission={"Yes"}
            screen={"AddCategory"}
          />
        </View>
      ) : null}

      {size ? (
        <View style={{ flex: 1, backgroundColor: constThemeColor.onPrimary }}>
          <Category
            categoryData={items}
            onCatPress={changeSize}
            heading={"Choose Section"}
            userType={"admin"}
            navigation={props.navigation}
            permission={"Yes"}
            screen={"AddCategory"}
            isMulti={true}
          />
        </View>
      ) : null}
    </>
  );
};
export default EnclosureForm;