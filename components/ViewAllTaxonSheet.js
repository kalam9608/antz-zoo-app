import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { capitalize } from "lodash";

import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import HousingSearchBox from "./HousingSearchBox";
import TaxonCustomCard from "./TaxonCustomCard";

const ViewAllTaxonSheet = ({ taxonDetails, viewAllType }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  const getTaxonList = () => {
    if (viewAllType === 'species') {
      return taxonDetails?.species?.items ?? [];
    } else if (viewAllType === 'genus') {
      return taxonDetails?.genus?.items ?? [];
    }
  };

  return (
    <View style={dynamicStyles.mainContainer}>
      {viewAllType === 'species' ?
        <View style={dynamicStyles.maintTitleContainer}>
          <Text style={dynamicStyles.mainTitleText}>{'Species'}</Text>
          <Text style={dynamicStyles.mainTitleText}>{taxonDetails?.species?.items?.length ?? ''}</Text>
        </View>
        :
        <Text style={dynamicStyles.mainTitleText}>{capitalize(viewAllType ?? '')}</Text>
      }

      {/* <Text style={dynamicStyles.subTitleText}>{'Class: Aves'}</Text> */}
      {false && <TaxonCustomCard
        title={'Psittacidae'}
        scientificName={'(Scientific name)'}
        className={'Aves'}
        orderName={'Psittaciformes'}
      />}

      <View style={dynamicStyles.searchWrapper}>
        {/* <Text style={dynamicStyles.speciesCountText}>{'6 Species under Psittacidae'}</Text> */}
        <HousingSearchBox
          // value={searchText}
          // onChangeText={(e) => SearchAddText(e)}
          // onClearPress={() => SearchRemoveText()}
          // loading={searchLoading}
          maincontainerStyle={dynamicStyles.searchContainer}
        />
      </View>

      <FlatList
        data={getTaxonList()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TaxonCustomCard
            pictureUri={item?.default_icon ?? ''}
            title={item?.common_name ? item?.common_name : item?.scientific_name ?? ''}
            // scientificName={item?.scientific_name ?? ''}
            showCancelButton={true}
          // onCancelPress={() => {
          //   updateIsLoading(true);
          //   deleteTemplateTaxon(item?.id ?? '');
          // }}
          />
        )}
        keyExtractor={(item, index) => index?.toString()}
      />
    </View>
  );
};

export default ViewAllTaxonSheet;

const styles = (reduxColors) =>
  StyleSheet.create({
    maintTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: Spacing.minor,
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
    searchContainer: {
      backgroundColor: reduxColors.background,
      borderRadius: 4,
    },
    searchWrapper: {
      paddingHorizontal: Spacing.minor,
      backgroundColor: reduxColors.onError,
      shadowColor: reduxColors.neutralPrimary,
      shadowOpacity: 0.1,
      shadowOffset: {
        height: -1,
        width: 0
      },
      shadowRadius: 1,
    },
    speciesCountText: {
      ...FontSize.Antz_Body_Title,
      color: reduxColors.onSurfaceVariant,
      marginTop: Spacing.small,
    },
  });