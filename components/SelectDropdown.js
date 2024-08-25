import {
  Appbar,
  DarkTheme,
  DefaultTheme,
  Provider,
  Surface,
  ThemeProvider,
} from "react-native-paper";
import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import DropDown from "react-native-paper-dropdown";
import { TextInput } from "react-native-paper";

function SelectDropdown({ label, mode, list, ...props }) {
  const [nightMode, setNightmode] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [gender, setGender] = useState("");

  return (
    <Provider theme={nightMode ? DarkTheme : DefaultTheme}>
      {/* <SafeAreaView style={styles.safeContainerStyle}> */}
      <DropDown
        label={label}
        mode={mode}
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        value={gender}
        setValue={setGender}
        list={list}
        dropDownStyle={{
          // flex: 1,
          top: 20,
          left: 0,
          right: 0,
        //   backgroundColor: "red",
        //   // offset
          zIndex:999,
        //   position: "absolute",
        //   borderColor: "#322b7c",
        //   borderWidth: 0.7,
        //   borderRadius: 4,
        //   borderStyle: "solid",
          // backgroundColor: 'white',
        }}
        //   dropDownContainerHeight={Dimensions.get("window").height * 0.2}
        inputProps={{
          right: (
            <TextInput.Icon icon={showDropDown ? "menu-up" : "menu-down"} />
          ),
        }}
      />
      {/* </SafeAreaView> */}
    </Provider>
  );
}

const styles = StyleSheet.create({
  // containerStyle: {
  //   flex: 1,
  // },
  // spacerStyle: {
  //   marginBottom: 15,
  // },
  safeContainerStyle: {
    flex: 1,
    marginTop: 20,
    justifyContent: "center",
  },
  // dropDownStyle:{
  //     flex: 1,
  //     top: 0,
  //     position: "absolute"
  // }
});

export default SelectDropdown;
