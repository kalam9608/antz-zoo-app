/**
 * @React Imports
 */
import React, { memo, useCallback, useState } from "react";
import { Text, Keyboard } from "react-native";

/**
 * @Redux Imports
 */
import { useSelector } from "react-redux";

/**
 * @Third Party Imports
 */
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
/**
 * @Config Imports
 */
import FontSize from "../configs/FontSize";

/**
 * @Utils Imports
 */
import { capitalize } from "../utils/Utils";

/**
 * @API Imports
 */
import { getMasterTaxonomic, getTaxonomic } from "../services/EggsService";

export const AutoCompleteSearch = memo((props) => {
  const [loading, setLoading] = useState(false);
  const [inputData, SetInputData] = useState(null);
  const [remoteDataSet, setRemoteDataSet] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);

  const getSuggestions = useCallback(async (query) => {
    SetInputData(query);
    let search = query.toLowerCase();
    if (typeof query !== "string" || query.length < 3) {
      setRemoteDataSet(null);
      return;
    }
    setLoading(true);
    let api = "";
    if (props.type == "master") {
      api = getMasterTaxonomic({ q: search });
    } else {
      api = getTaxonomic({ search: search });
    }
    api.then((res) => {
      let data = res?.data.map((item) => {
        return {
          id: item.tsn,
          taxonomy_id: item.taxonomy_id ? item.taxonomy_id : null,
          title:
            capitalize(item.common_name) + " (" + item.scientific_name + ")",
          scientific_name: item.scientific_name,
        };
      });
      setRemoteDataSet(data);
      setLoading(false);
    });
  }, []);

  const onOpenSuggestionsList = () => {
    Keyboard.dismiss();
  };

  const setValue = (item) => {
    setSelectedItem(item);
    props.onPress(item);
  };

  const onClear = () => {
    setSelectedItem(null);
    setRemoteDataSet([]);
    props.onPress(null);
  };
  return (
    <>
      <AutocompleteDropdown
        showClear={props.showClear}
        dataSet={remoteDataSet}
        closeOnBlur={false}
        useFilter={false}
        clearOnFocus={false}
        onFocus={true}
        textInputProps={{
          editable: props.edit === false ? false : true,
          ref: props.refs,
          label: props.label,
          defaultValue: props.value ? props.value : "",
          placeholder: props.placeholder,
          placeholderTextColor: constThemeColor.neutralSecondary,
          outlineStyle: { borderWidth: props.value ? 2 : 1 },
          style: {
            zIndex: 999,
            textAlign: "auto",
            backgroundColor: props.value
              ? constThemeColor.displaybgPrimary
              : constThemeColor.surface,
          },
        }}
        onSelectItem={setValue}
        onClear={props.onClear?props.onClear:onClear}
        loading={loading}
        onOpenSuggestionsList={onOpenSuggestionsList}
        onChangeText={getSuggestions}
        suggestionsListTextStyle={{
          color: constThemeColor.onPrimaryContainer,
        }}
        suggestionsListContainerStyle={{
          position: "relative",
          top: 0,
        }}
        debounce={1000}
        EmptyResultComponent={
          inputData && remoteDataSet?.length == 0 ? (
            <Text style={{ padding: 10, fontSize: FontSize.Antz_Standerd }}>
              No result found !!!
            </Text>
          ) : (
            <></>
          )
        }
        ChevronIconComponent={
          <MaterialCommunityIcons
            name="menu-down"
            size={25}
            style={constThemeColor.onSurfaceVariant}
            color={constThemeColor.onSurfaceVariant}
          />
        }
        rightButtonsContainerStyle={{
          right: 0,
        }}
      />
      {props.isError ? (
        <Text
          style={{
            color: constThemeColor.error,
            fontSize: FontSize.Antz_Subtext_Regular.fontSize,
          }}
        >
          {props.errors}
        </Text>
      ) : null}
    </>
  );
});
