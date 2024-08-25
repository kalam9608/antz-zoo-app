import React, { useRef, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { isArray } from "lodash";

import { addAssessmentTemplateTaxon } from "../../services/assessmentService/AssessmentTemplate";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import SelectTaxonSheet from "../../components/SelectTaxonSheet";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import { errorToast, successToast } from "../../utils/Alert";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";

const AddTaxon = ({ route }) => {
  const [selectTaxonType, setSelectTaxonType] = useState(null);
  const [parentTaxon, setParentTaxon] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedGenus, setSelectedGenus] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectTaxonModalRef = useRef();

  const { goBack, navigate } = useNavigation();

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  const taxonDetails = route?.params?.taxonDetails ?? {};

  const getTsnIds = () => {
    if (selectedSpecies !== null && isArray(selectedSpecies)) {
      return selectedSpecies?.map(i => Number(i?.tsn));
    }
    else if (selectedGenus !== null && isArray(selectedGenus)) {
      return selectedGenus?.map(i => Number(i?.tsn));
    }
    else if (selectedFamily !== null && isArray(selectedFamily)) {
      return selectedFamily?.map(i => Number(i?.tsn));
    }
    else if (selectedOrder !== null && isArray(selectedOrder)) {
      return selectedOrder?.map(i => Number(i?.tsn));
    }
    else if (selectedClass !== null) {
      return [Number(selectedClass?.tsn)];
    }
    return null;
  };

  const getTaxonType = () => {
    if (selectedSpecies !== null && isArray(selectedSpecies)) {
      return 'species';
    }
    else if (selectedGenus !== null && isArray(selectedGenus)) {
      return 'genus';
    }
    else if (selectedFamily !== null && isArray(selectedFamily)) {
      return 'family';
    }
    else if (selectedOrder !== null && isArray(selectedOrder)) {
      return 'order';
    }
    else if (selectedClass !== null) {
      return 'class';
    }
    return null;
  };

  const checkAlreadyAdded = () => {
    if (selectedSpecies !== null && isArray(selectedSpecies)) {
      if (selectedSpecies?.find(i => i?.assessment_template_id !== null) !== undefined) {
        errorToast("Error", 'Template is already created for this selected Species!');
        return true;
      }
      return false;
    }
    else if (selectedGenus !== null && isArray(selectedGenus)) {
      if (selectedGenus?.find(i => i?.assessment_template_id !== null) !== undefined) {
        errorToast("Error", 'Template is already created for this selected Genus!');
        return true;
      }
      return false;
    }
    else if (selectedFamily !== null && isArray(selectedFamily)) {
      if (selectedFamily?.find(i => i?.assessment_template_id !== null) !== undefined) {
        errorToast("Error", 'Template is already created for this selected Family!');
        return true;
      }
      return false;
    }
    else if (selectedOrder !== null && isArray(selectedOrder)) {
      if (selectedOrder?.find(i => i?.assessment_template_id !== null) !== undefined) {
        errorToast("Error", 'Template is already created for this selected Order!');
        return true;
      }
      return false;
    }
    else if (selectedClass !== null) {
      if (selectedClass?.assessment_template_id !== null) {
        errorToast("Error", 'Template is already created for this selected Class!');
        return true;
      }
      return false;
    }
    return false;
  };

  const onApplyPress = () => {
    if (getTsnIds() !== null && getTaxonType() !== null && checkAlreadyAdded() === false) {
      setIsLoading(true);
      const obj = {
        assessment_template_id: route?.params?.assessmentTempId ?? '',
        tsn_id: JSON.stringify(getTsnIds()),
        taxon_type: getTaxonType(),
      };
      // console.log('addAssessmentTemplateTaxon obj :: ', obj);
      addAssessmentTemplateTaxon(obj)
        .then((res) => {
          // console.log('addAssessmentTemplateTaxon res :: ', res);
          if (res?.success) {
            successToast("Success", res?.message ?? 'Added Successfully!');
            goBack();
          } else {
            errorToast("error", res?.message ?? "Something went wrong");
          }
        })
        .catch((e) => {
          errorToast("error", "Something went wrong");
        })
        .finally((e) => {
          setIsLoading(false);
        });
    }
  };

  const TaxonSelectionCard = ({ title, name, commonName, pictureUri, onCancelPress, list }) => {
    return (
      <View style={dynamicStyles.taxonSelectionCardContainer}>
        <Text style={dynamicStyles.taxonSelectionCardTitle}>{title}</Text>
        {list ?
          <FlatList
            data={list}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.body }} />}
            renderItem={({ item }) => (
              <View style={dynamicStyles.taxonCardDetailsContainer}>
                <Image
                  source={{ uri: item?.default_icon ?? '' }}
                  contentFit={'contain'}
                  style={dynamicStyles.taxonCardPicture}
                />
                <View style={{ flex: 1, marginHorizontal: Spacing.body }}>
                  <Text style={dynamicStyles.taxonCardTitle}>
                    {item?.common_name ? item?.common_name : item?.scientific_name ?? ''}
                  </Text>
                  {commonName ? <Text style={dynamicStyles.taxonCardSubTitle}>{commonName}</Text> : null}
                </View>
                <TouchableOpacity onPress={() => onCancelPress(item?.tsn)}>
                  <Image
                    source={require('../../assets/cancel_circle.png')}
                    contentFit={'contain'}
                    style={dynamicStyles.cancelIcon}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index?.toString()}
          />
          :
          <View style={dynamicStyles.taxonCardDetailsContainer}>
            <Image
              source={{ uri: pictureUri }}
              resizeMode={'contain'}
              style={dynamicStyles.taxonCardPicture}
            />
            <View style={{ flex: 1, marginHorizontal: Spacing.body }}>
              <Text style={dynamicStyles.taxonCardTitle}>{name}</Text>
              {commonName ? <Text style={dynamicStyles.taxonCardSubTitle}>{commonName}</Text> : null}
            </View>
            <TouchableOpacity onPress={onCancelPress}>
              <Image
                source={require('../../assets/cancel_circle.png')}
                contentFit={'contain'}
                style={dynamicStyles.cancelIcon}
              />
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  };

  const SelectButton = ({ title, onPress }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={dynamicStyles.selectButtonContainer}>
        <Text style={dynamicStyles.selectButtonTitle}>{title}</Text>
        <MaterialIcons
          name={"keyboard-arrow-down"}
          size={24}
          color={constThemeColor.onSecondaryContainer}
        />
      </TouchableOpacity>
    );
  };

  const isApplyDisabled = getTsnIds() === null && getTaxonType() === null;

  return (
    <View style={dynamicStyles.mainContainer}>
      <Loader visible={isLoading} />

      <Header
        noIcon={true}
        hideMenu={true}
        showBackButton={true}
        style={dynamicStyles.header}
      />

      <View style={{ flex: 1 }}>
        {selectedClass === null ?
          <SelectButton
            title={'Select Class'}
            onPress={() => {
              setSelectTaxonType('class');
              selectTaxonModalRef.current.present();
            }}
          />
          :
          <TaxonSelectionCard
            title={'Selected Class'}
            pictureUri={selectedClass?.default_icon ?? ''}
            name={selectedClass?.common_name ? selectedClass?.common_name : selectedClass?.scientific_name ?? ''}
            onCancelPress={() => {
              setSelectedClass(null);
              setSelectedOrder(null);
              setSelectedFamily(null);
              setSelectedGenus(null);
            }}
          />
        }

        {selectedClass !== null ?
          <>
            <View style={dynamicStyles.searchBarContainer}>
              <TouchableOpacity onPress={goBack}>
                <Ionicons
                  name={"search-outline"}
                  size={22}
                  color={constThemeColor.onSecondaryContainer}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigate('SearchSpeciesScreen', {
                    parentTaxon: selectedClass?.tsn,
                    assessmentTempId: route?.params?.assessmentTempId,
                  });
                }}>
                <Text style={dynamicStyles.searchBarTitle}>{'Search Species'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={dynamicStyles.mainTitleText}>{'Choose Taxon'}</Text>
          </>
          : null
        }

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {selectedClass !== null ? selectedOrder === null ?
            <SelectButton
              title={'Select Order'}
              onPress={() => {
                setParentTaxon(selectedClass?.tsn ?? '');
                setSelectTaxonType('order');
                selectTaxonModalRef.current.present();
              }}
            />
            :
            <TaxonSelectionCard
              title={'Selected Order'}
              list={selectedOrder ?? []}
              onCancelPress={(id) => {
                const newData = selectedOrder?.filter(i => i?.tsn !== id);
                setSelectedOrder(newData?.length > 0 ? [...newData] : null);
                setSelectedFamily(null);
                setSelectedGenus(null);
                setSelectedSpecies(null);
              }}
            />
            : null
          }

          {(selectedOrder !== null && selectedOrder?.length === 1) ? selectedFamily === null ?
            <SelectButton
              title={'Select Family'}
              onPress={() => {
                setParentTaxon(selectedOrder?.[0]?.tsn ?? '');
                setSelectTaxonType('family');
                selectTaxonModalRef.current.present();
              }}
            />
            :
            <TaxonSelectionCard
              title={'Selected Family'}
              list={selectedFamily ?? []}
              onCancelPress={(id) => {
                const newData = selectedFamily?.filter(i => i?.tsn !== id);
                setSelectedFamily(newData?.length > 0 ? [...newData] : null);
                setSelectedGenus(null);
                setSelectedSpecies(null);
              }}
            />
            : null
          }

          {(selectedFamily !== null && selectedFamily?.length === 1) ? selectedGenus === null ?
            <SelectButton
              title={'Select Genus'}
              onPress={() => {
                setParentTaxon(selectedFamily?.[0]?.tsn ?? '');
                setSelectTaxonType('genus');
                selectTaxonModalRef.current.present();
              }}
            />
            :
            <TaxonSelectionCard
              title={'Selected Genus'}
              list={selectedGenus ?? []}
              onCancelPress={(id) => {
                const newData = selectedGenus?.filter(i => i?.tsn !== id);
                setSelectedGenus(newData?.length > 0 ? [...newData] : null);
                setSelectedSpecies(null);
              }}
            />
            : null
          }

          {(selectedGenus !== null && selectedGenus?.length === 1) ? selectedSpecies === null ?
            <SelectButton
              title={'Select Species'}
              onPress={() => {
                setParentTaxon(selectedGenus?.[0]?.tsn ?? '');
                setSelectTaxonType('species');
                selectTaxonModalRef.current.present();
              }}
            />
            :
            <TaxonSelectionCard
              title={'Selected Species'}
              list={selectedSpecies ?? []}
              onCancelPress={(id) => {
                const newData = selectedSpecies?.filter(i => i?.tsn !== id);
                setSelectedSpecies(newData?.length > 0 ? [...newData] : null);
              }}
            />
            : null
          }
        </ScrollView>
      </View>

      <BottomSheetModalComponent ref={selectTaxonModalRef} onDismiss={() => { }}>
        <SelectTaxonSheet
          selectTaxonType={selectTaxonType}
          parentTaxon={parentTaxon}
          selectedClass={selectedClass}
          selectedOrder={selectedOrder !== null ? selectedOrder?.[0] : null}
          selectedFamily={selectedFamily !== null ? selectedFamily?.[0] : null}
          onClosePress={() => {
            setParentTaxon(null);
            setSelectTaxonType(null);
            selectTaxonModalRef.current.close();
          }}
          onApplyPress={(data) => {
            if (selectTaxonType === 'class') {
              setSelectedClass(data);
            } else if (selectTaxonType === 'order') {
              setSelectedOrder(data);
            } else if (selectTaxonType === 'family') {
              setSelectedFamily(data);
            } else if (selectTaxonType === 'genus') {
              setSelectedGenus(data);
            } else if (selectTaxonType === 'species') {
              setSelectedSpecies(data);
            }
            setParentTaxon(null);
            setSelectTaxonType(null);
            selectTaxonModalRef.current.close();
          }}
        />
      </BottomSheetModalComponent>

      <View style={dynamicStyles.applyButtonWrapper}>
        <TouchableOpacity
          disabled={isApplyDisabled}
          onPress={onApplyPress}
          style={dynamicStyles.applyButtonContainer}>
          <Text style={dynamicStyles.applyButtonTitle}>{'Apply'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddTaxon;

const styles = (reduxColors) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: reduxColors.onError,
    },
    header: {
      paddingBottom: Spacing.body,
      backgroundColor: reduxColors.onError,
    },
    taxonSelectionCardContainer: {
      backgroundColor: reduxColors.surfaceVariant,
      borderRadius: 4,
      padding: Spacing.minor,
      marginHorizontal: Spacing.minor,
      marginBottom: Spacing.body,
    },
    taxonSelectionCardTitle: {
      ...FontSize.Antz_Body_Medium,
      color: reduxColors.neutralPrimary,
      marginBottom: Spacing.body,
    },
    taxonCardDetailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.body,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: reduxColors.outlineVariant,
      backgroundColor: reduxColors.onError,
    },
    taxonCardPicture: {
      height: 44,
      width: 44,
    },
    taxonCardTitle: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onSurfaceVariant,
    },
    taxonCardSubTitle: {
      ...FontSize.Antz_Body_Medium,
      color: reduxColors.onSurfaceVariant,
      marginTop: Spacing.micro,
    },
    mainTitleText: {
      ...FontSize.Antz_Minor_Medium,
      color: reduxColors.onSecondaryContainer,
      marginHorizontal: Spacing.minor,
      marginBottom: Spacing.minor,
    },
    cancelIcon: {
      height: 24,
      width: 24,
    },
    searchBarContainer: {
      borderWidth: 1,
      borderRadius: 40,
      borderColor: reduxColors.outline,
      paddingHorizontal: Spacing.minor + Spacing.mini,
      paddingVertical: Spacing.minor,
      marginHorizontal: Spacing.minor,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.body,
    },
    searchBarTitle: {
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.onSurfaceVariant,
      // flex: 1,
      marginLeft: Spacing.small,
      marginTop: Spacing.micro,
    },
    selectButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: reduxColors.surface,
      padding: Spacing.minor,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: reduxColors.outline,
      marginHorizontal: Spacing.minor,
      marginBottom: Spacing.minor,
    },
    selectButtonTitle: {
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.onSecondaryContainer,
      flex: 1,
    },
    applyButtonWrapper: {
      backgroundColor: reduxColors.displaybgPrimary,
      paddingVertical: Spacing.minor + Spacing.micro,
      alignItems: 'center',
    },
    applyButtonContainer: {
      paddingHorizontal: Spacing.major,
      paddingVertical: Spacing.body,
      backgroundColor: reduxColors.primary,
      borderRadius: 8,
    },
    applyButtonTitle: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onError,
    },
  });
