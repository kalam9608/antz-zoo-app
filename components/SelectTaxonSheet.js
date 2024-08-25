import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { capitalize, isArray } from "lodash";

import ListEmpty from "./ListEmpty";
import Loader from "./Loader";
import { assessmentTemplateTaxonFiltering } from "../services/assessmentService/AssessmentTemplate";
import { errorToast } from "../utils/Alert";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import { opacityColor } from "../utils/Utils";

const SelectTaxonSheet = ({
  selectTaxonType,
  onClosePress,
  onApplyPress,
  parentTaxon,
  selectedClass,
  selectedOrder,
  selectedFamily,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [taxons, setTaxons] = useState([]);
  const [stopTaxonsListCall, setStopTaxonsListCall] = useState(false);
  const [selectedTaxon, setSelectedTaxon] = useState(null);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  useEffect(() => {
    setIsLoading(true);
    getTaxonList(1);
  }, []);

  const getTaxonList = (pageNo) => {
    const obj = {
      type: selectTaxonType,
      page_no: pageNo,
      ...(parentTaxon && { parent_taxon: parentTaxon }),
    };
    assessmentTemplateTaxonFiltering(obj)
      .then((res) => {
        // console.log('res', res?.data?.taxon_list);
        if (res?.success) {
          if (pageNo === 1) {
            setTaxons(res?.data?.taxon_list);
          } else {
            setTaxons(prev => [...prev, ...(res?.data?.taxon_list ?? [])]);
          }
          setStopTaxonsListCall(res?.data?.taxon_list === undefined);
        } else {
          errorToast("error", "Something went wrong");
        }
      })
      .catch((e) => {
        errorToast("error", "Something went wrong");
      })
      .finally((e) => {
        setIsLoading(false);
      });
  };

  const getName = (data) => {
    if (data) return data?.common_name ? data?.common_name : data?.scientific_name ?? null;
    return null
  };

  const ListItem = ({ disabled, pictureUri, title, onPress, isSelected }) => (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        dynamicStyles.listItemContainer,
        isSelected ? { backgroundColor: constThemeColor.onBackground } : {},
        disabled ? { opacity: 0.5 } : {},
      ]}>
      <Image
        source={{ uri: pictureUri }}
        contentFit={'contain'}
        style={dynamicStyles.picture}
      />
      <Text style={dynamicStyles.listItemTitle}>{title}</Text>
      {isSelected ?
        <AntDesign
          name={"checkcircle"}
          size={20}
          color={constThemeColor.primary}
        />
        : null}
    </TouchableOpacity>
  );

  const className = getName(selectedClass);
  const orderName = getName(selectedOrder);
  const familyName = getName(selectedFamily);
  // const isMultiSelect = !['class', 'order', 'family']?.includes(selectTaxonType);
  const isMultiSelect = selectTaxonType !== 'class';
  const shouldDisabledItem = selectTaxonType === 'species';
  const selectedTaxonIds = selectedTaxon !== null && isArray(selectedTaxon) ? selectedTaxon?.map(i => i?.tsn) : [];

  return (
    <View style={dynamicStyles.mainContainer}>
      <Loader visible={isLoading} />

      <Text style={dynamicStyles.mainTitleText}>{`Select ${capitalize(selectTaxonType)}`}</Text>

      {className ? <Text style={dynamicStyles.subTitleText}>{`\u2022 Class: ${className}`}</Text> : null}
      {orderName ? <Text style={dynamicStyles.subTitleText}>{`   \u2022 Order: ${orderName}`}</Text> : null}
      {familyName ? <Text style={dynamicStyles.subTitleText}>{`      \u2022 Family: ${familyName}`}</Text> : null}

      {(!isLoading && taxons?.length > 0) ?
        <View style={dynamicStyles.countContainer}>
          <TouchableOpacity
            onPress={() => {
              setTaxons([]);
              setSelectedTaxon(null);
              onClosePress && onClosePress()
            }}>
            <Octicons
              name={"x"}
              size={24}
              color={constThemeColor.onSecondaryContainer}
            />
          </TouchableOpacity>
          <Text style={dynamicStyles.countTitleText}>
            {isMultiSelect && selectedTaxon?.length > 0 ? `${selectedTaxon?.length} items` : ''}
          </Text>
          <TouchableOpacity
            onPress={() => {
              onApplyPress && onApplyPress(selectedTaxon);
              setTaxons([]);
              setSelectedTaxon(null);
            }}>
            <Octicons
              name={"check"}
              size={24}
              color={constThemeColor.onSecondaryContainer}
            />
          </TouchableOpacity>
        </View>
        : null
      }

      <BottomSheetFlatList
        data={taxons}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={<View style={dynamicStyles.itemSeparatorComponent} />}
        renderItem={({ item }) => {
          return (
            <ListItem
              pictureUri={item?.default_icon ?? ''}
              title={item?.common_name ? item?.common_name : item?.scientific_name ?? ''}
              isSelected={isMultiSelect ? selectedTaxonIds?.includes(item?.tsn) : item?.tsn === selectedTaxon?.tsn}
              disabled={shouldDisabledItem && item?.assessment_template_id !== null}
              onPress={() => {
                if (isMultiSelect) {
                  let newData = selectedTaxon === null ? [] : [...selectedTaxon];
                  if (selectedTaxon?.find(i => i?.tsn === item?.tsn)) {
                    setSelectedTaxon([...newData?.filter(i => i?.tsn !== item?.tsn)]);
                  } else {
                    setSelectedTaxon([...(selectedTaxon !== null ? selectedTaxon : []), item]);
                  }
                }
                else {
                  if (selectedTaxon?.tsn === item?.tsn) {
                    setSelectedTaxon(null);
                  } else {
                    setSelectedTaxon(item ?? null);
                  }
                }
              }}
            />
          );
        }}
        keyExtractor={(item, index) => index?.toString()}
        ListEmptyComponent={<ListEmpty />}
      // onEndReached={handleLoadMore}
      // ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default SelectTaxonSheet;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      height: "100%",
    },
    mainTitleText: {
      ...FontSize.Antz_Major_Medium,
      color: reduxColors.onPrimaryContainer,
      marginTop: Spacing.mini,
      marginBottom: Spacing.body,
      textAlign: 'center',
    },
    subTitleText: {
      ...FontSize.Antz_Body_Regular,
      color: reduxColors.onSurfaceVariant,
      marginBottom: Spacing.small,
      marginHorizontal: Spacing.minor,
    },
    countContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.minor,
      backgroundColor: reduxColors.secondaryContainer,
    },
    countTitleText: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onPrimaryContainer,
      flex: 1,
      marginHorizontal: Spacing.major,
    },
    picture: {
      height: 44,
      width: 44,
    },
    listItemContainer: {
      padding: Spacing.body,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: reduxColors.onPrimary,
    },
    listItemTitle: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onSurfaceVariant,
      paddingHorizontal: Spacing.body,
      flex: 1,
    },
    itemSeparatorComponent: {
      height: 1,
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 10),
    },
  });