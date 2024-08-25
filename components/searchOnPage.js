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

const SearchOnPage = ({
  searchModalText,
  handleSearch,
  placeholderText,
  style,
  clearSearchText,
  customStyle,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
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

SearchOnPage.defaultProps = {
  customStyle: { borderRadius: 8 },
};

export default SearchOnPage;

const styles = (reduxColors) =>
  StyleSheet.create({
    input: {
      flex: 1,
      paddingLeft: 40,
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    searchBarContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: reduxColors.surface,
      borderRadius: 8,
      width: "100%",
      height: 56,
      paddingHorizontal: 8,
    },
  });
