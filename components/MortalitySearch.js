import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useRef } from "react";

const MortalitySearch = ({
  searchModalText,
  handleSearch,
  placeholderText,
  style,
  clearSearchText,
  customStyle,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const inputRef = useRef();

  return (
    <>
      <View style={[reduxColors.searchBarContainer, customStyle]}>
        <Ionicons
          name="search"
          size={20}
          color={constThemeColor.onPrimaryContainer}
          style={{ position: "absolute", left: 16 }}
        />
        <TextInput
          style={[reduxColors.input]}
          ref={inputRef}
          onLayout={() => inputRef.current.focus()}
          placeholder={placeholderText}
          onChangeText={(e) => handleSearch(e)}
          value={searchModalText}
          placeholderTextColor={constThemeColor.onPrimaryContainer}
        />
        {searchModalText !== "" && (
          <Octicons
            name="x"
            size={20}
            color={constThemeColor.onPrimaryContainer}
            onPress={clearSearchText}
            style={{ position: "absolute", right: 16 }}
          />
        )}
      </View>
    </>
  );
};

MortalitySearch.defaultProps = {
  customStyle: { borderRadius: 8 },
};

export default MortalitySearch;

const styles = (reduxColors) =>
  StyleSheet.create({
    input: {
      flex: 1,
      paddingLeft: 40,
      paddingRight: 25,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    searchBarContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      width: "100%",
      height: 50,
      paddingHorizontal: 8,
    },
  });
