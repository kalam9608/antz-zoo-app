import { useState } from "react";
import React from "react";
import {
  FlatList,
  View,
  Text,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import moment from "moment";
import RadioForm from "react-native-simple-radio-button";
import Category from "./DropDownBox";
import Colors from "../configs/Colors";
import styles from "../configs/Styles";
import InputBox from "./InputBox";
import CustomForm from "./CustomForm";
import DatePicker from "./DatePicker";
import { dynamicApi } from "../services/EggsService";
import Loader from "./Loader";
import { errorToast } from "../utils/Alert";
import FontSize from "../configs/FontSize";
import { useSelector } from "react-redux";
import { useToast } from "../configs/ToastConfig";

export const DynamicForm = ({
  formData,
  setFormData = () => {},
  isLoading = false,
}) => {
  const [inputDropDownOpenStatusInfo, setinputDropDownOpenStatusInfo] =
    useState([]);
  const [datePickerOpenStatusInfo, setDatePickerOpenStatusInfo] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(isLoading);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const { showToast } = useToast();
  const saveFormData = (id, value, valueName) => {
    let tempFormData = [...formData];
    const index = tempFormData.findIndex((item) => id === item.id);
    tempFormData[index].value = value;
    tempFormData[index].valueName = valueName;
    setFormData([...tempFormData]);
  };

  const saveDropDownData = (id, value) => {
    let tempFormData = [...formData];
    const index = tempFormData.findIndex((item) => id === item.id);
    tempFormData[index].values_for_dropdown = value;

    setFormData([...tempFormData]);
  };

  const isDropDownValue = (id) => {
    let tempFormData = [...formData];
    const index = tempFormData.findIndex((item) => id === item.id);
    let valueLength = tempFormData[index].values_for_dropdown.length;
    return valueLength > 0 ? true : false;
  };

  const handleFormChange = (id, event) => {
    saveFormData(id, event);
  };

  const toggleInputDropdownMenu = (id, status = false, action) => {
    if (status && !isDropDownValue(id)) {
      setLoading(true);
      dynamicApi(action)
        .then((response) => {
          setLoading(false);
          saveDropDownData(id, response.data);
          const index = inputDropDownOpenStatusInfo.findIndex(
            (item) => id === item.id
          );
          if (index < 0) {
            setinputDropDownOpenStatusInfo((prevState) => [
              ...prevState,
              { id, status },
            ]);
          } else {
            setinputDropDownOpenStatusInfo((prevState) => {
              let tempArr = [...prevState];
              tempArr[index] = { id, status };
              return tempArr;
            });
          }
        })
        .catch((error) => showToast("error", "Something went wrong!!"));
    } else {
      const index = inputDropDownOpenStatusInfo.findIndex(
        (item) => id === item.id
      );
      if (index < 0) {
        setinputDropDownOpenStatusInfo((prevState) => [
          ...prevState,
          { id, status },
        ]);
      } else {
        setinputDropDownOpenStatusInfo((prevState) => {
          let tempArr = [...prevState];
          tempArr[index] = { id, status };
          return tempArr;
        });
      }
    }
  };

  const toggleShowDatePicker = (id, status = false) => {
    const index = datePickerOpenStatusInfo.findIndex((item) => id === item.id);
    if (index < 0) {
      setDatePickerOpenStatusInfo((prevState) => [
        ...prevState,
        { id, status },
      ]);
    } else {
      setDatePickerOpenStatusInfo((prevState) => {
        let tempArr = [...prevState];
        tempArr[index] = { id, status };
        return tempArr;
      });
    }
  };

  const showDatePicker = (id) => {
    toggleShowDatePicker(id, true);
    setId(id);
  };

  const handleConfirm = (id, selectDate, format) => {
    saveFormData(id, moment(selectDate).format(format));
  };

  const hideDatePicker = (id) => {
    toggleShowDatePicker(id, false);
  };

  const getOpenStatus = (id) => {
    const index = inputDropDownOpenStatusInfo.findIndex(
      (item) => id === item.id
    );

    return inputDropDownOpenStatusInfo[index]?.status ?? false;
  };

  const getDatePickerOpenStatus = (id) => {
    const index = datePickerOpenStatusInfo.findIndex((item) => id === item.id);
    return datePickerOpenStatusInfo[index]?.status ?? false;
  };

  const selectedItems = (value) => {
    let selectedValues = value.filter((item) => item.selected === true);
    return selectedValues;
  };
  const selectedValue = (value) => {
    let selected = value.filter((item) => item.selected === true);
    return selected[0]?.name;
  };

  const setSelectectItems = (selectedItem, item, id) => {
    let arr = [];
    for (let index = 0; index < item.length; index++) {
      const newObj = item[index];
      delete newObj["selected"];
      if (selectedItem.includes(newObj)) {
        newObj.selected = true;
      }
      arr.push(newObj);
    }

    let tempFormData = [...formData];
    const index = tempFormData.findIndex((item) => id === item.id);
    tempFormData[index] = {
      ...tempFormData[index],
      values_for_dropdown: [...arr],
    };
    setFormData([...tempFormData]);
  };

  const setInputDropdownData = (selectedItem, item, id, isMulti) => {
    let values = selectedItem.map((u) => u.id).join(",");
    let valuesName = selectedItem.map((u) => u.name).join(",");
    saveFormData(id, values, valuesName);
    let arr = [];
    for (let index = 0; index < item.length; index++) {
      let newObj = item[index];
      delete newObj["selected"];
      if (selectedItem.name === newObj.name) {
        newObj.selected = true;
      }
      arr.push(newObj);
    }

    let tempFormData = [...formData];
    const index = tempFormData.findIndex((item) => id === item.id);
    tempFormData[index] = {
      ...tempFormData[index],
      values_for_dropdown: [...arr],
    };
    setFormData([...tempFormData]);
    if (!isMulti) {
      toggleInputDropdownMenu(id, false);
    }
  };

  const handleRadioBtnChange = (value, item, id) => {
    saveFormData(id, value);
    let arr = [...item];
    let newArr = [];
    for (let index = 0; index < arr.length; index++) {
      const newObj = arr[index];
      delete newObj["selected"];
      if (value === newObj.value) {
        newObj.selected = true;
      }
      newArr.push(newObj);
    }

    let tempFormData = [...formData];
    const index = tempFormData.findIndex((item) => id === item.id);
    tempFormData[index] = {
      ...tempFormData[index],
      values_for_dropdown: [...arr],
    };
    setFormData([...tempFormData]);
  };

  const renderListItem = ({ item }) => {
    switch (item.type) {
      case "textarea":
        return (
          <InputBox
            multiline={true}
            inputLabel={item.label}
            placeholder={"Enter " + item.label}
            onChange={(value) => handleFormChange(item.id, value)}
            value={item.value}
            required={item.required}
            maxLength={parseInt(item.maxlength)}
            keyboardType={item.subtype ?? "default"}
            // errors={errorMessage.enclosureName}
            // isError={isError.enclosureName}
          />
        );
      case "text":
        return (
          <InputBox
            inputLabel={item.label}
            placeholder={"Enter " + item.label}
            onChange={(value) => handleFormChange(item.id, value)}
            value={item.value}
            required={item.required}
            maxLength={parseInt(item.maxlength)}
            keyboardType={item.subtype ?? "default"}
            // errors={errorMessage.enclosureName}
            // isError={isError.enclosureName}
          />
        );
      case "multi_form":
        return (
          <InputBox
            inputLabel={item.label}
            placeholder={"Enter " + item.label}
            onChange={(value) => handleFormChange(item.id, value)}
            value={item.value}
            required={item.required}
            maxLength={parseInt(item.maxlength)}
            keyboardType={item.subtype ?? "default"}
            // errors={errorMessage.enclosureName}
            // isError={isError.enclosureName}
          />
        );
      case "radio-group":
        return (
          <View
            // style={[styles.fieldBox]}
            style={{
              marginTop: 8,
              alignItems: "center",
              width: "100%",
              backgroundColor: constThemeColor.onPrimary,
              flexDirection: "row",
              justifyContent: "space-between",
              borderRadius: 5,
              borderWidth: 1,
              padding: 5,
              borderColor: constThemeColor.lightGreyHexa,
            }}
          >
            <Text
              // style={[styles.labelName, styles.width50]}
              style={{
                color: Colors.labelColor,
                fontSize: FontSize.Antz_Minor_Regular.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                margin: 10,
              }}
            >
              {item.label}:
            </Text>
            <RadioForm
              radio_props={item.values_for_dropdown}
              initial={0}
              onPress={(value) => {
                handleRadioBtnChange(value, item.values_for_dropdown, item.id);
              }}
              buttonColor={constThemeColor.housingPrimary}
              selectedButtonColor={constThemeColor.housingPrimary}
              selectedLabelColor={Colors.textColor}
              labelColor={Colors.textColor}
              formHorizontal={true}
              labelHorizontal={true}
              labelStyle={{ marginRight: 15 }}
              buttonSize={15}
            />
          </View>
        );

      // case "checkbox-group":
      //   return (
      //     <View
      //       style={[styles.fieldBox]}
      //       // style={{marginTop:8, padding:8, width:'100%', backgroundColor:'#fff'}}
      //     >
      //       <Category
      //         label={item.label}
      //         items={item.values_for_dropdown}
      //         itemKey={item.id}
      //         selectedItems={selectedItems(item.values_for_dropdown)}
      //         labelStyle={[styles.labelName, styles.width50, {fontWeight:'500'}]}
      //         // labelStyle={{color:Colors.labelColor, fontSize:Colors.lableSize, fontWeight:'450', marginBottom:10}}
      //         placeHolderContainer={styles.textfield}
      //         placeholderStyle={styles.placeholderStyle}
      //         selectedItemsContainer={[
      //           styles.selectedItemsContainer,
      //           styles.width60,
      //         ]}
      //         onSave={(value) =>
      //           setSelectectItems(value, item.values_for_dropdown, item.id)
      //         }
      //         listView={true}
      //       />
      //     </View>
      //   );
      case "date":
        return (
          <DatePicker
            today={item.value}
            onChange={(date) => {
              handleConfirm(item.id, date, item.dateFormat);
            }}
            format={"ddd DD-MMM-YYYY"}
            title={item.label}
          />
        );
      case "select":
        return (
          <>
            <InputBox
              inputLabel={item.label}
              placeholder={"Choose " + item.label}
              editable={false}
              value={item.valueName}
              rightElement={getOpenStatus(item.id) ? "menu-up" : "menu-down"}
              DropDown={() =>
                toggleInputDropdownMenu(
                  item.id,
                  !getOpenStatus(item.id),
                  item.action
                )
              }
              // errors={this.state.errorMessage.accType}
              // isError={this.state.isError.accType}
            />

            {getOpenStatus(item.id) ? (
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <Category
                  categoryData={item.values_for_dropdown}
                  onCatPress={(value) =>
                    setInputDropdownData(
                      value,
                      item.values_for_dropdown,
                      item.id,
                      item.multiple
                    )
                  }
                  heading={"Choose " + item.label}
                  isMulti={item.multiple}
                  onClose={() =>
                    toggleInputDropdownMenu(
                      item.id,
                      !getOpenStatus(item.id),
                      item.action
                    )
                  }
                />
              </View>
            ) : null}

            {/* <Category
              label={item.label}
              value={selectedValue(item.values_for_dropdown)}
              isOpen={getOpenStatus(item.id)}
              items={item.values_for_dropdown}
              itemKey={item.id}
              openAction={() => toggleInputDropdownMenu(item.id, true)}
              closeAction={() => toggleInputDropdownMenu(item.id, false)}
              setValue={(value) =>
                setInputDropdownData(value, item.values_for_dropdown, item.id)
              }
              // labelStyle={styles.labelName}
              labelStyle={{color:Colors.labelColor, fontSize:Colors.lableSize, fontWeight:'500', marginBottom:10}}
              textFieldStyle={styles.inputText}
              // style={[styles.inputContainer]}
            /> */}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Loader visible={loading} />
      <FlatList
        // ListEmptyComponent={() => <ListEmpty visible={loading} />}
        data={formData}
        keyExtractor={(item, index) => item.id}
        renderItem={renderListItem}
        initialNumToRender={formData?.length}
        refreshing={isLoading}
        contentContainerStyle={formData?.length === 0 ? styles.container : null}
      />
    </>
  );
};
