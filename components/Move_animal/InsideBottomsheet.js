import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";

import { capitalize, opacityColor, shortenNumber } from "../../utils/Utils";
import HounsingCard from "../housing/HounsingCard";
import FontSize from "../../configs/FontSize";
import { useSelector } from "react-redux";
import AnimalCustomCard from "../AnimalCustomCard";
import Spacing from "../../configs/Spacing";
import { Divider } from "react-native-paper";
import MedicalEnclosureCard from "../MedicalEnclosureCard";
import ListEmpty from "../ListEmpty";
import moment from "moment";
import NotesSiteCard from "../NotesSiteCard";
import EnclosureInmateCard from "../EnclosureInmateCard";

const InsideBottomsheet = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const [checked, setCheked] = useState(false);
  const [searchModalText, setSearchModalText] = useState(
    props?.searchText ?? ""
  );

  const handleSearch = (text) => {
    props?.handelSearch(text, props?.type);
    setSearchModalText(text);
  };

  const countAnimals = (arrayOfObjects) => {
    if (arrayOfObjects?.length > 0) {
      let totalCount = 0;
      arrayOfObjects?.forEach((item) => {
        if (item?.type === "single") {
          totalCount += 1;
        } else if (item?.type === "group") {
          totalCount += parseInt(item?.total_animal);
        }
      });
      return totalCount;
    } else {
      return 0;
    }
  };
  return (
    <View style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {props.type === "medicalSelected" ? null : (
        <View
          style={{
            alignItems: "center",
            position: "relative",
          }}
        >
          <View
            style={{
              width: "100%",
              paddingHorizontal: Spacing.minor,
              flexDirection: "row",
              alignItems: "center",
              justifyContent:
                props.type == "assessmentType" ? "space-between" : "center",
              marginBottom: props.type == "assessmentType" ? 0 : Spacing.body,
            }}
          >
            {props.type == "assessmentType" ? (
              <Text
                style={{
                  color: reduxColors.onPrimaryContainer,
                  fontSize:
                    props.type == "assessmentType"
                      ? 16
                      : FontSize.Antz_Major_Medium.fontSize,
                  fontWeight: FontSize.Antz_Major_Medium.fontWeight,
                }}
              >
                {props.title ? props.title : "Select"}
              </Text>
            ) : (
              <Text
                style={{
                  color: reduxColors.onPrimaryContainer,
                  fontSize: FontSize.Antz_Major_Medium.fontSize,
                  fontWeight: FontSize.Antz_Major_Medium.fontWeight,
                }}
              >
                {props.title ? props.title : "Select"}
              </Text>
            )}
            {props.type == "assessmentType" ? (
              <Ionicons
                name="close-sharp"
                size={24}
                color={constThemeColor.onPrimaryContainer}
                onPress={props.CloseBottomSheet}
              />
            ) : null}
          </View>
          {props.screenName == "Observation" &&
          props?.type == "Site" &&
          props.selectedSiteNotes?.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: constThemeColor.secondaryContainer,
                padding: Spacing.minor,
                height: 56,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Octicons
                  name="x"
                  size={24}
                  color={constThemeColor.onSecondaryContainer}
                  onPress={props?.clearSiteAllSElected}
                />
                <Text
                  style={{
                    left: Spacing.minor,
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  }}
                >
                  {props.selectedSiteNotes?.length} Items
                </Text>
              </View>
              <View>
                <Octicons
                  name="check"
                  size={24}
                  color={constThemeColor.onSecondaryContainer}
                  onPress={props?.closeSectionSheet}
                />
              </View>
            </View>
          ) : null}

          <View
            style={{
              width: "100%",
              paddingHorizontal: Spacing.minor,
              marginVertical: Spacing.small,
            }}
          >
            {props?.head == "animal" ? (
              <>
                <Text style={[reduxColors?.subHeading]}>
                  Encl :<Text>{props?.enclosureName}</Text>
                </Text>
                <Text style={reduxColors?.subHeading}>
                  Sec :
                  <Text style={{ textTransform: "capitalize" }}>
                    {props?.sectionName}
                  </Text>
                </Text>
                <Text style={reduxColors?.subHeading}>
                  Site :{" "}
                  <Text style={{ textTransform: "capitalize" }}>
                    {props?.siteName}
                  </Text>
                </Text>
              </>
            ) : null}
            {props?.type == "medicalEnclosure" ? (
              <>
                <Text style={reduxColors?.subHeading}>
                  Sec :
                  <Text style={{ textTransform: "capitalize" }}>
                    {props?.sectionName}
                  </Text>
                </Text>
                <Text style={reduxColors?.subHeading}>
                  Site :{" "}
                  <Text style={{ textTransform: "capitalize" }}>
                    {props?.siteName}
                  </Text>
                </Text>
              </>
            ) : null}
            {props?.type == "medicalSection" ? (
              <Text style={reduxColors?.subHeading}>
                Site :{" "}
                <Text style={{ textTransform: "capitalize" }}>
                  {props?.siteName}
                </Text>
              </Text>
            ) : null}
          </View>
          {props?.screenName == "Medical" && props?.type !== "Site" ? (
            <View
              style={{
                width: props?.type == "role" ? null : "100%",
                paddingHorizontal: Spacing.minor,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: Spacing.body,
              }}
            >
              <View
                style={[
                  reduxColors.searchBarContainer,
                  { width: props?.type == "role" ? 210 : "100%" },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="search"
                    size={20}
                    color={constThemeColor.onPrimaryContainer}
                    style={reduxColors.searchIcon}
                  />
                  <TextInput
                    style={reduxColors.input}
                    placeholder={
                      props.type == "role" ? "Search Roles" : "Search"
                    }
                    onChangeText={(e) => handleSearch(e)}
                    value={searchModalText}
                    placeholderTextColor={constThemeColor.onPrimaryContainer}
                  />
                </View>
                {searchModalText && props?.type != "role" ? (
                  <Ionicons
                    name="close"
                    size={20}
                    onPress={() => {
                      setSearchModalText("");
                      props?.handelSearch("", props?.type);
                    }}
                    color={constThemeColor.onPrimaryContainer}
                    style={{ paddingRight: Spacing.body }}
                  />
                ) : null}
              </View>
            </View>
          ) : null}

          <View style={reduxColors.modalFirstbox}>
            {props.type === "loginHistory" || props.hideSearch ? null : ((props
                .seletedAnimals?.length >= 0 &&
                props?.screenName == "Medical") ||
                (props.seletedAnimals?.length > 0 &&
                  props?.screenName !== "Medical")) &&
              props.type === "animal" ? (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: constThemeColor.secondaryContainer,
                  paddingHorizontal: Spacing.minor,
                  height: 56,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Octicons
                    name="x"
                    size={24}
                    color={constThemeColor.onSecondaryContainer}
                    onPress={props?.clearSelectedId}
                  />
                  <Text
                    style={{
                      left: Spacing.major,
                      fontSize: FontSize.Antz_Minor_Title.fontSize,
                      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    }}
                  >
                    {countAnimals(props?.seletedAnimals ?? [])} Items
                  </Text>
                </View>

                {props?.SelectAll && props?.screenName == "Medical" ? (
                  <TouchableOpacity
                    style={{ alignItems: "center" }}
                    onPress={() => {
                      setCheked(!checked);
                      props.SelectAll();
                    }}
                  >
                    <MaterialCommunityIcons
                      name="select-all"
                      size={30}
                      color={constThemeColor?.onSecondaryContainer}
                    />
                  </TouchableOpacity>
                ) : null}

                <View>
                  <Octicons
                    name="check"
                    size={24}
                    color={constThemeColor.onSecondaryContainer}
                    onPress={props?.closeSheet}
                  />
                </View>
              </View>
            ) : props.selectedSection?.length > 0 &&
              props.type === "medicalSection" ? (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: constThemeColor.secondaryContainer,
                  padding: Spacing.minor,
                  height: 56,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Octicons
                    name="x"
                    size={24}
                    color={constThemeColor.onSecondaryContainer}
                    onPress={props?.clearSelectedId}
                  />
                  <Text
                    style={{
                      left: Spacing.minor,
                      fontSize: FontSize.Antz_Minor_Title.fontSize,
                      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    }}
                  >
                    {props.selectedSection?.length} Items
                  </Text>
                </View>
                <View>
                  <Octicons
                    name="check"
                    size={24}
                    color={constThemeColor.onSecondaryContainer}
                    onPress={props?.closeSectionSheet}
                  />
                </View>
              </View>
            ) : props.selectedEnclosure?.length > 0 &&
              props.type === "medicalEnclosure" ? (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: constThemeColor.secondaryContainer,
                  padding: Spacing.minor,
                  height: 56,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Octicons
                    name="x"
                    size={24}
                    color={constThemeColor.onSecondaryContainer}
                    onPress={props?.clearSelectedId}
                  />
                  <Text
                    style={{
                      left: Spacing.minor,
                      fontSize: FontSize.Antz_Minor_Title.fontSize,
                      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    }}
                  >
                    {props.selectedEnclosure?.length} Items
                  </Text>
                </View>
                <View>
                  <Octicons
                    name="check"
                    size={24}
                    color={constThemeColor.onSecondaryContainer}
                    onPress={props?.closeEnclosureSheet}
                  />
                </View>
              </View>
            ) : props.searchRemoveFromTemp == "searchRemoveTemplate" ? null : (
              <View
                style={{
                  width: props?.type == "role" ? null : "100%",
                  paddingHorizontal: Spacing.minor,
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: Spacing.body,
                }}
              >
                <View
                  style={[
                    reduxColors.searchBarContainer,
                    { width: props?.type == "role" ? 210 : "100%" },
                  ]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="search"
                      size={20}
                      color={constThemeColor.onPrimaryContainer}
                      style={reduxColors.searchIcon}
                    />
                    <TextInput
                      style={reduxColors.input}
                      placeholder={
                        props.type == "role" ? "Search Roles" : "Search"
                      }
                      onChangeText={(e) => handleSearch(e)}
                      value={searchModalText}
                      placeholderTextColor={constThemeColor.onPrimaryContainer}
                    />
                  </View>
                  {searchModalText && props?.type != "role" ? (
                    <Ionicons
                      name="close"
                      size={20}
                      onPress={() => {
                        setSearchModalText("");
                        props?.handelSearch("", props?.type);
                      }}
                      color={constThemeColor.onPrimaryContainer}
                      style={{ paddingRight: Spacing.body }}
                    />
                  ) : null}
                </View>
              </View>
            )}

            <View style={{}}>
              {props.type == "role" ? (
                <TouchableOpacity onPress={props.navigation}>
                  <View style={reduxColors.roleAddBtn}>
                    <MaterialIcons
                      size={24}
                      name="person-add-alt"
                      color={constThemeColor.primary}
                    />
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Minor_Regular.fontSize,
                        fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                        color: constThemeColor.primary,
                      }}
                    >
                      Add Role
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      )}
      <View
        style={{
          width: "100%",
          flex: 1,
        }}
      >
        {props.type === "section" ? (
          <Sectionlist
            sectionData={props.data}
            onPress={props.onPress}
            handleLoadMore={props.handleLoadMore}
            selectedIds={props?.selectedIds}
            constThemeColor={constThemeColor}
            reduxColors={reduxColors}
          />
        ) : null}
        {props.type === "enclosure" ? (
          <Enclosure
            enclosureData={props.selectEnclosureData}
            reduxColors={reduxColors}
            onPress={props.onPress}
            handleLoadMore={props.handleLoadMore}
            selectedIds={props?.selectedIds}
            constThemeColor={constThemeColor}
            loading={props?.loading}
          />
        ) : null}
        {props.type === "animal" ? (
          <Animal
            speciesListData={props.data}
            onPress={props.onPress}
            handleLoadMore={props.handleLoadMore}
            animalLength={props.seletedAnimals?.length}
            closeSheet={props?.closeSheet}
            selectedIds={props?.selectedIds}
            screenName={props.screenName}
            constThemeColor={constThemeColor}
            reduxColors={reduxColors}
            selectedPreviousIds={props?.selectedPreviousIds}
            activeOpacity={props?.activeOpacity}
            loading={props?.loading}
          />
        ) : null}
        {props.type === "role" ? (
          <Role
            roleData={props.data}
            onPress={props.onPress}
            navigation={props.navigation}
            title
            reduxColors={reduxColors}
            constThemeColor={constThemeColor}
            loading={props?.loading}
          />
        ) : null}
        {props.type === "loginHistory" ? (
          <LoginHistory
            data={props.data}
            navigation={props.navigation}
            title
            reduxColors={reduxColors}
            constThemeColor={constThemeColor}
            handleLoadMore={props?.handleLoadMore}
            renderFooter={props?.renderLoginHistoryFooter}
            loading={props?.loading}
          />
        ) : null}
        {props.type === "assessmentType" ? (
          <AssessmentTypes
            assessmentTypeData={props.assessmentTypeData}
            navigation={props.navigation}
            title
            reduxColors={reduxColors}
            constThemeColor={constThemeColor}
            navigateTodetails={props.navigateTodetails}
            searchAssessement={props.searchAssessement}
            removeRightIcon={props.removeRightIcon}
            handleLoadMore={props.handleLoadMore}
            renderFooter={props.renderFooter}
          />
        ) : null}
        {props.type === "inmateHistory" ? (
          <InmateHistory
            type={props.type ?? false}
            data={props.data}
            navigation={props.navigation}
            title
            reduxColors={reduxColors}
            constThemeColor={constThemeColor}
            handleLoadMore={props?.handleLoadMore}
            renderFooter={props?.renderLoginHistoryFooter}
            loading={props?.loading}
          />
        ) : null}
        {props?.type === "storeList" ? (
          <StoreList
            storeData={props.data}
            onPress={props.onPress}
            handleLoadMore={props.handleLoadMore}
            selectedIds={props?.selectedIds}
            constThemeColor={constThemeColor}
            reduxColors={reduxColors}
            closeButton={props.closeButton}
            loading={props?.loading}
          />
        ) : null}
        {props.type === "Site" ? (
          <MedicalSitelist
            selectedSiteNotesIds={props?.selectedSitePreviousIds}
            screenName={props.screenName}
            siteData={props.data}
            onPress={props.onPress}
            handleLoadMore={props.handleLoadMore}
            selectedIds={props?.selectedIds}
            constThemeColor={constThemeColor}
            reduxColors={reduxColors}
            closeButton={props.closeButton}
            loading={props?.loading}
          />
        ) : null}
        {props.type === "Institute" ? (
          <InstituteList
            instituteData={props.data}
            onPress={props.onPress}
            handleLoadMore={props.handleLoadMore}
            selectedIds={props?.selectedIds}
            constThemeColor={constThemeColor}
            reduxColors={reduxColors}
            loading={props?.loading}
          />
        ) : null}
        {props.type === "medicalSection" ? (
          <MedicalSectionlist
            sectionData={props.data}
            onPress={props.onPress}
            handleLoadMore={props.handleLoadMore}
            selectedIds={props?.selectedIds}
            constThemeColor={constThemeColor}
            selectedSectionPreviousIds={props?.selectedSectionPreviousIds}
            reduxColors={reduxColors}
            closeButton={props.closeButton}
            loading={props?.loading}
          />
        ) : null}
        {props.type === "medicalEnclosure" ? (
          <MedicalEnclosure
            enclosureData={props.selectEnclosureData}
            reduxColors={reduxColors}
            onPress={props.onPress}
            handleLoadMore={props.handleLoadMore}
            selectedIds={props?.selectedIds}
            constThemeColor={constThemeColor}
            selectedEnclosurePreviousIds={props?.selectedEnclosurePreviousIds}
            closeButton={props.closeButton}
            loading={props?.loading}
          />
        ) : null}
        {props.type === "medicalSelected" ? (
          <MedicalSelectedList
            siteList={props?.siteList ?? []}
            countAnimals={countAnimals}
            enclosureData={props.selectEnclosureData}
            sectionData={props.selectSectionData}
            animalData={props.selectAnimalData}
            reduxColors={reduxColors}
            onPress={props.onPress}
            handleLoadMore={props.handleLoadMore}
            selectedIds={props?.selectedIds}
            constThemeColor={constThemeColor}
            onRemove={props?.onRemove}
            closeButton={props.closeButton}
            loading={props?.loading}
          />
        ) : null}
      </View>
    </View>
  );
};

export default InsideBottomsheet;

const Enclosure = ({
  enclosureData,
  onPress,
  handleLoadMore,
  selectedIds,
  constThemeColor,
  reduxColors,
}) => {
  return (
    <>
      <View style={{}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={enclosureData}
          renderItem={({ item }) => {
            return (
              <>
                <HounsingCard
                  title={capitalize(item?.user_enclosure_name)}
                  chip2={
                    "Animals " +
                    shortenNumber(item?.enclosure_wise_animal_count)
                  }
                  onPress={() => onPress(item)}
                  style={reduxColors.stylesCard}
                  // textTransform={"uppercase"}
                  backgroundColor={
                    selectedIds == item?.enclosure_id
                      ? constThemeColor.background
                      : null
                  }
                />
                <Divider />
              </>
            );
          }}
          onEndReached={handleLoadMore}
        />
      </View>
    </>
  );
};

const Role = ({
  roleData,
  onPress,
  reduxColors,
  handleLoadMore,
  constThemeColor,
}) => {
  return (
    <>
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={roleData}
          renderItem={({ item }) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() => onPress(item)}
                  activeOpacity={0.5}
                  style={reduxColors.roleWrap}
                >
                  <MaterialCommunityIcons
                    name="account-circle-outline"
                    size={35}
                    color={constThemeColor.onSurfaceVariant}
                  />
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Minor_Title.fontSize,
                      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                      marginLeft: "2%",
                      color: constThemeColor.onSurfaceVariant,
                    }}
                  >
                    {item?.role_name}
                  </Text>
                </TouchableOpacity>
                <Divider />
              </>
            );
          }}
          onEndReached={handleLoadMore}
        />
      </View>
    </>
  );
};

const Animal = ({
  speciesListData,
  onPress,
  handleLoadMore,
  animalLength,
  closeSheet,
  selectedIds,
  screenName,
  constThemeColor,
  reduxColors,
  activeOpacity,
  selectedPreviousIds = [],
  loading,
}) => {
  return (
    <>
      <View style={{}}>
        <Divider />
        <FlatList
          data={speciesListData}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmpty visible={loading} />}
          renderItem={({ item }) => (
            <>
              <AnimalCustomCard
                item={item}
                animalIdentifier={
                  !item?.local_identifier_value
                    ? item?.animal_id
                    : item?.local_identifier_name ?? null
                }
                localID={item?.local_identifier_value ?? null}
                icon={item?.default_icon}
                enclosureName={item?.user_enclosure_name}
                animalName={
                  item?.common_name
                    ? item?.common_name
                    : item?.default_common_name
                    ? item?.default_common_name
                    : item?.scientific_name
                }
                sectionName={item?.section_name}
                show_specie_details={true}
                show_housing_details={true}
                siteName={item?.site_name}
                chips={item?.sex}
                onPress={() => onPress(item)}
                style={[
                  {
                    backgroundColor: selectedIds?.includes(item?.animal_id)
                      ? constThemeColor.onBackground
                      : selectedPreviousIds?.includes(item?.animal_id) ||
                        (Boolean(parseInt(item?.in_transit)) &&
                          screenName == "Transfer")
                      ? opacityColor(constThemeColor.neutralPrimary, 5)
                      : null,
                    borderRadius: 0,
                    marginVertical: 0,
                    opacity:
                      selectedPreviousIds?.includes(item?.animal_id) ||
                      (Boolean(parseInt(item?.in_transit)) &&
                        screenName == "Transfer")
                        ? 0.5
                        : 1,
                  },
                ]}
                noArrow={true}
                disable={
                  selectedPreviousIds?.includes(item?.animal_id) ||
                  (Boolean(parseInt(item?.in_transit)) &&
                    screenName == "Transfer")
                }
                animalSelect={
                  selectedIds?.includes(item?.animal_id) ? true : false
                }
                transferCheck={screenName == "Transfer"}
                showInTransit={
                  Boolean(parseInt(item?.in_transit)) &&
                  screenName == "Transfer"
                }
                activeOpacity={activeOpacity}
              />
              <Divider />
            </>
          )}
          onEndReached={handleLoadMore}
        />
      </View>
    </>
  );
};

const Sectionlist = ({
  sectionData,
  handleLoadMore,
  onPress,
  selectedIds,
  constThemeColor,
  reduxColors,
}) => {
  return (
    <>
      <View>
        <FlatList
          data={sectionData}
          keyExtractor={(item) => item.section_id}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => {
            return (
              <>
                <HounsingCard
                  title={item.section_name}
                  incharge={item.incharge_name ? item.incharge_name : "NA"}
                  chip1={"Enclosures " + shortenNumber(item.enclosure_count)}
                  chip2={"Animals " + shortenNumber(item.animal_count)}
                  onPress={() => onPress(item)}
                  style={reduxColors.stylesCard}
                  backgroundColor={
                    selectedIds == item?.section_id
                      ? constThemeColor.outlineVariant
                      : null
                  }
                />
                <Divider />
              </>
            );
          }}
          onEndReached={handleLoadMore}
        />
      </View>
    </>
  );
};

const MedicalSitelist = ({
  selectedSiteNotesIds,
  screenName,
  siteData,
  handleLoadMore,
  onPress,
  selectedIds,
  constThemeColor,
  reduxColors,
  loading,
}) => {
  return (
    <>
      <View>
        <FlatList
          data={siteData}
          keyExtractor={(item) => item?.site_id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmpty visible={loading} />}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() => {
                    onPress(item);
                  }}
                  style={[
                    reduxColors.stylesCard,
                    {
                      opacity:
                        screenName == "Observation"
                          ? selectedSiteNotesIds?.includes(
                              item?.site_id?.toString()
                            )
                            ? 0.1
                            : 1
                          : 1,
                      padding: Spacing.body,
                      paddingHorizontal: Spacing.minor,
                      borderTopWidth: index == 0 ? 0.5 : 0,
                      backgroundColor:
                        screenName == "Observation"
                          ? selectedSiteNotesIds?.includes(
                              item?.site_id?.toString()
                            ) ||
                            selectedIds?.includes(item?.site_id?.toString())
                            ? constThemeColor.onBackground
                            : null
                          : selectedIds == item?.site_id
                          ? constThemeColor.onBackground
                          : null,
                    },
                  ]}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Minor_Title?.fontSize,
                        fontWeight: FontSize.Antz_Major_Title.fontWeight,
                        color: constThemeColor?.onSurfaceVariant,
                      }}
                    >
                      {item.site_name}
                    </Text>
                  </View>
                </TouchableOpacity>
                <Divider />
              </>
            );
          }}
          onEndReached={handleLoadMore}
        />
      </View>
    </>
  );
};

const MedicalSectionlist = ({
  sectionData,
  handleLoadMore,
  onPress,
  selectedIds,
  constThemeColor,
  reduxColors,
  selectedSectionPreviousIds,
  loading,
}) => {
  return (
    <>
      <View>
        <FlatList
          data={sectionData}
          keyExtractor={(item) => item.section_id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmpty visible={loading} />}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => {
            return (
              <>
                <MedicalEnclosureCard
                  title={item.section_name}
                  // incharge={item.incharge_name ? item.incharge_name : "NA"}
                  chip1={"Enclosures " + shortenNumber(item.enclosure_count)}
                  chip2={"Animals " + shortenNumber(item.animal_count)}
                  onPress={() => {
                    if (
                      !selectedSectionPreviousIds?.includes(item?.section_id)
                    ) {
                      onPress(item);
                    }
                  }}
                  style={[
                    reduxColors.stylesCard,
                    {
                      padding: Spacing.body,
                      paddingHorizontal: Spacing.minor,
                      borderTopWidth: index == 0 ? 0.5 : 0,
                    },
                  ]}
                  backgroundColor={
                    selectedIds?.includes(item?.section_id)
                      ? constThemeColor.onBackground
                      : selectedSectionPreviousIds?.includes(item?.section_id)
                      ? constThemeColor.onBackground
                      : null
                  }
                  opacity={
                    selectedSectionPreviousIds?.includes(item?.section_id)
                      ? 0.5
                      : 1
                  }
                  remove={false}
                  disabled={selectedSectionPreviousIds?.includes(
                    item?.section_id
                  )}
                  itemSelect={
                    selectedIds?.includes(item?.section_id) ? true : false
                  }
                />
                <Divider />
              </>
            );
          }}
          onEndReached={handleLoadMore}
        />
      </View>
    </>
  );
};

const MedicalEnclosure = ({
  enclosureData,
  onPress,
  handleLoadMore,
  selectedIds,
  constThemeColor,
  reduxColors,
  selectedEnclosurePreviousIds,
  loading,
}) => {
  return (
    <>
      <View style={{}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={enclosureData}
          ListEmptyComponent={<ListEmpty visible={loading} />}
          renderItem={({ item, index }) => {
            return (
              <>
                <MedicalEnclosureCard
                  title={capitalize(item?.user_enclosure_name)}
                  chip2={
                    "Animals " +
                    shortenNumber(item?.enclosure_wise_animal_count)
                  }
                  onPress={() => {
                    if (
                      !selectedEnclosurePreviousIds?.includes(
                        item?.enclosure_id
                      )
                    ) {
                      onPress(item);
                    }
                  }}
                  style={[
                    reduxColors.stylesCard,
                    {
                      padding: Spacing.body,
                      paddingHorizontal: Spacing.minor,
                      borderTopWidth: index == 0 ? 0.5 : 0,
                    },
                  ]}
                  backgroundColor={
                    selectedIds?.includes(item?.enclosure_id)
                      ? constThemeColor.onBackground
                      : selectedEnclosurePreviousIds?.includes(
                          item?.enclosure_id
                        )
                      ? constThemeColor?.onBackground
                      : null
                  }
                  opacity={
                    selectedEnclosurePreviousIds?.includes(item?.section_id)
                      ? 0.5
                      : 1
                  }
                  remove={false}
                  disabled={selectedEnclosurePreviousIds?.includes(
                    item?.enclosure_id
                  )}
                  itemSelect={
                    selectedIds?.includes(item?.enclosure_id) ? true : false
                  }
                />
                <Divider />
              </>
            );
          }}
          onEndReached={handleLoadMore}
        />
      </View>
    </>
  );
};

const MedicalSelectedList = ({
  siteList,
  countAnimals,
  enclosureData,
  sectionData,
  onPress,
  handleLoadMore,
  animalData,
  selectedIds,
  constThemeColor,
  reduxColors,
  onRemove,
  ...props
}) => {
  return (
    <>
      <View
        style={{
          // padding: Spacing.small,
          // paddingLeft: Spacing.minor,

          paddingHorizontal: Spacing.minor,
          paddingTop: Spacing.small,
          paddingBottom: Spacing.minor,
        }}
      >
        <Text
          style={{
            fontSize: FontSize.Antz_Minor_Title.fontSize,
            fontWeight: FontSize?.Antz_Minor_Title?.fontWeight,
          }}
        >
          Total Selected -{" "}
          {sectionData?.length +
            animalData?.length +
            enclosureData?.length +
            siteList?.length ?? 0}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: Spacing.minor }}
      >
        <View style={{}}>
          {siteList?.length > 0 ? (
            <View
              style={{
                backgroundColor: constThemeColor?.background,
                paddingVertical: Spacing.small,
                paddingHorizontal: Spacing.minor,
                borderTopWidth: 1,
                borderTopColor: opacityColor(
                  constThemeColor.neutralPrimary,
                  10
                ),
              }}
            >
              <Text style={{ fontSize: FontSize.Antz_Body_Regular.fontSize }}>
                <Text
                  style={{ fontWeight: FontSize.Antz_Body_Title?.fontWeight }}
                >
                  {siteList?.length}{" "}
                </Text>
                Site
              </Text>
            </View>
          ) : null}
          <FlatList
            data={siteList}
            keyExtractor={(item) => item?.site_id}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.4}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
              return (
                <>
                  <NotesSiteCard
                    style={[
                      reduxColors.stylesCard,
                      {
                        paddingHorizontal: Spacing.body,
                        borderTopWidth: index == 0 ? 1 : 0,
                        borderTopColor: opacityColor(
                          constThemeColor.neutralPrimary,
                          10
                        ),
                      },
                    ]}
                    title={`Site : ${item?.site_name}`}
                    type="Site"
                    incharge={""}
                    remove={props.closeButton == false ? false : true}
                    onRemove={() => {
                      onRemove("site", item?.site_id);
                    }}
                  />
                  <Divider />
                </>
              );
            }}
          />
          {sectionData?.length > 0 ? (
            <View
              style={{
                backgroundColor: constThemeColor?.background,
                paddingVertical: Spacing.small,
                paddingHorizontal: Spacing.minor,
                borderTopWidth: 1,
                borderTopColor: opacityColor(
                  constThemeColor.neutralPrimary,
                  10
                ),
              }}
            >
              <Text style={{ fontSize: FontSize.Antz_Body_Regular.fontSize }}>
                <Text
                  style={{ fontWeight: FontSize.Antz_Body_Title?.fontWeight }}
                >
                  {sectionData?.length}{" "}
                </Text>
                Section
              </Text>
            </View>
          ) : null}

          <FlatList
            data={sectionData}
            keyExtractor={(item) => item.section_id}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.4}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
              return (
                <>
                  <MedicalEnclosureCard
                    title={item.section_name}
                    // incharge={item.incharge_name ? item.incharge_name : "NA"}
                    chip1={"Enclosures " + shortenNumber(item.enclosure_count)}
                    chip2={"Animals " + shortenNumber(item?.animal_count ?? 0)}
                    style={[
                      reduxColors.stylesCard,
                      {
                        paddingHorizontal: Spacing.body,
                        borderTopWidth: index == 0 ? 1 : 0,
                        borderTopColor: opacityColor(
                          constThemeColor.neutralPrimary,
                          10
                        ),
                      },
                    ]}
                    backgroundColor={
                      selectedIds?.includes(item?.section_id)
                        ? constThemeColor.background
                        : null
                    }
                    remove={props.closeButton == false ? false : true}
                    label={`Site : ${item?.site_name}`}
                    onRemove={() => {
                      onRemove("section", item?.section_id);
                    }}
                  />
                  <Divider />
                </>
              );
            }}
            // onEndReached={handleLoadMore}
          />

          {enclosureData?.length > 0 ? (
            <View
              style={{
                backgroundColor: constThemeColor?.background,
                padding: Spacing.small,
                paddingLeft: Spacing.minor,
              }}
            >
              <Text style={{ fontSize: FontSize.Antz_Body_Regular.fontSize }}>
                <Text
                  style={{ fontWeight: FontSize.Antz_Body_Title?.fontWeight }}
                >
                  {enclosureData?.length}
                </Text>{" "}
                Enclosure
              </Text>
            </View>
          ) : null}

          <FlatList
            showsVerticalScrollIndicator={false}
            data={enclosureData}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
              return (
                <MedicalEnclosureCard
                  title={capitalize(item?.user_enclosure_name)}
                  chip2={
                    "Animals " +
                    shortenNumber(item?.enclosure_wise_animal_count)
                  }
                  style={[
                    reduxColors.stylesCard,
                    {
                      paddingHorizontal: Spacing.body,
                      borderTopWidth: index == 0 ? 1 : 0,
                      borderTopColor: opacityColor(
                        constThemeColor.neutralPrimary,
                        10
                      ),
                    },
                  ]}
                  backgroundColor={
                    selectedIds?.includes(item?.enclosure_id)
                      ? constThemeColor.background
                      : null
                  }
                  remove={props.closeButton == false ? false : true}
                  label={`Section :${item?.section_name}`}
                  onRemove={() => {
                    onRemove("enclosure", item?.enclosure_id);
                  }}
                />
              );
            }}
            // onEndReached={handleLoadMore}
          />
          {animalData?.length > 0 ? (
            <View
              style={{
                backgroundColor: constThemeColor?.background,
                padding: Spacing.small,
                paddingLeft: Spacing.minor,
              }}
            >
              <Text style={{ fontSize: FontSize.Antz_Body_Regular.fontSize }}>
                <Text
                  style={{ fontWeight: FontSize.Antz_Body_Title?.fontWeight }}
                >
                  {countAnimals(animalData ?? [])}
                </Text>{" "}
                Animals
              </Text>
            </View>
          ) : null}

          <FlatList
            data={animalData}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <>
                <AnimalCustomCard
                  item={item}
                  animalIdentifier={
                    !item?.local_identifier_value
                      ? item?.animal_id
                      : item?.local_identifier_name ?? null
                  }
                  localID={item?.local_identifier_value ?? null}
                  icon={item?.default_icon}
                  enclosureName={item?.user_enclosure_name}
                  animalName={item?.common_name}
                  siteName={item?.site_name}
                  scientific_name={item?.scientific_name}
                  sectionName={item?.section_name}
                  show_specie_details={true}
                  show_housing_details={true}
                  chips={item?.sex}
                  style={[
                    {
                      backgroundColor: selectedIds?.includes(item?.animal_id)
                        ? constThemeColor.background
                        : null,
                      borderRadius: 0,
                      marginVertical: 0,
                      borderTopWidth: index == 0 ? 1 : 0,
                      borderTopColor: opacityColor(
                        constThemeColor.neutralPrimary,
                        10
                      ),
                    },
                  ]}
                  noArrow={true}
                  animalSelect={
                    selectedIds?.includes(item?.animal_id) ? true : false
                  }
                  remove={props.closeButton == false ? false : true}
                  onRemove={() => {
                    onRemove("animal", item?.animal_id);
                  }}
                />
                <Divider />
              </>
            )}
            onEndReached={handleLoadMore}
          />
        </View>
      </ScrollView>
    </>
  );
};

const InstituteList = ({
  instituteData,
  handleLoadMore,
  onPress,
  selectedIds,
  constThemeColor,
  reduxColors,
  loading,
}) => {
  return (
    <>
      <View>
        <FlatList
          data={instituteData}
          keyExtractor={(item) => item?.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmpty visible={loading} />}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() => {
                    onPress(item);
                  }}
                  style={[
                    reduxColors.stylesCard,
                    {
                      padding: Spacing.body,
                      paddingHorizontal: Spacing.minor,
                      borderTopWidth: index == 0 ? 0.5 : 0,
                      backgroundColor:
                        selectedIds == item?.site_id
                          ? constThemeColor.onBackground
                          : null,
                    },
                  ]}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Minor_Title?.fontSize,
                        fontWeight: FontSize.Antz_Major_Title.fontWeight,
                        color: constThemeColor?.onSurfaceVariant,
                      }}
                    >
                      {item?.label}
                    </Text>
                  </View>
                </TouchableOpacity>
                <Divider />
              </>
            );
          }}
          onEndReached={handleLoadMore}
        />
      </View>
    </>
  );
};
const InmateHistory = ({
  type,
  data,
  reduxColors,
  handleLoadMore,
  constThemeColor,
  renderFooter,
  loading,
}) => {
  return (
    <>
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<ListEmpty visible={loading} />}
          renderItem={({ item }) => {
            return (
              <>
                <EnclosureInmateCard item={item} type={type} />
              </>
            );
          }}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
        />
      </View>
    </>
  );
};
const LoginHistory = ({
  data,
  reduxColors,
  handleLoadMore,
  constThemeColor,
  renderFooter,
  loading,
}) => {
  return (
    <>
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<ListEmpty visible={loading} />}
          renderItem={({ item }) => {
            return (
              <>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={reduxColors.roleWrap}
                >
                  <AntDesign
                    name="login"
                    size={35}
                    color={constThemeColor.primary}
                  />
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Body_Title.fontSize,
                      fontWeight: FontSize.Antz_Body_Title.fontWeight,
                      marginLeft: "2%",
                      color: constThemeColor.onSurfaceVariant,
                    }}
                  >
                    {moment(item?.created_at).format("DD MMM YYYY, LT")}
                  </Text>
                </TouchableOpacity>
                <Divider />
              </>
            );
          }}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
        />
      </View>
    </>
  );
};
const AssessmentTypes = ({
  assessmentTypeData,
  reduxColors,
  constThemeColor,
  navigateTodetails,
  searchAssessement,
  removeRightIcon,
  handleLoadMore,
  renderFooter,
  renderFooterFun,
  handleLoadMoreFun,
}) => {
  return (
    <>
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={assessmentTypeData}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<ListEmpty />}
          renderItem={({ item }) => {
            return (
              <>
                {searchAssessement == "searchAssessmentModal" ? (
                  <TouchableOpacity
                    onPress={() => navigateTodetails(item?.assessment_type_id)}
                    activeOpacity={10}
                  >
                    <View style={reduxColors.typeListContainer}>
                      <View>
                        <Text style={reduxColors.typeTitle}>
                          {item?.assessments_type_label}
                        </Text>

                        <Text style={reduxColors.type}>{item?.label}</Text>
                      </View>

                      <View style={reduxColors.rightIconTemp}>
                        <MaterialIcons
                          name="chevron-right"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => navigateTodetails(item?.assessment_type_id)}
                    activeOpacity={10}
                  >
                    <View style={reduxColors.typeListContainer}>
                      <View style={{ width: "90%" }}>
                        <Text style={reduxColors.typeTitle}>
                          {item?.assessments_type_label}
                        </Text>
                        {item?.template_count ? (
                          <Text style={reduxColors.type}>
                            Templates - {item?.template_count}
                          </Text>
                        ) : null}
                      </View>
                      {removeRightIcon == false ? null : (
                        <View style={reduxColors.rightIconTemp}>
                          <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color={constThemeColor.onSurfaceVariant}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              </>
            );
          }}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
        />
      </View>
    </>
  );
};
const StoreList = ({
  storeData,
  handleLoadMore,
  onPress,
  selectedIds,
  constThemeColor,
  reduxColors,
  loading,
}) => {
  return (
    <>
      <View>
        <FlatList
          data={storeData}
          keyExtractor={(item) => item?.site_id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmpty visible={loading} />}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() => {
                    onPress(item);
                  }}
                  style={[
                    reduxColors.stylesCard,
                    {
                      padding: Spacing.body,
                      paddingHorizontal: Spacing.minor,
                      borderTopWidth: index == 0 ? 0.5 : 0,
                      backgroundColor:
                        selectedIds == item?.site_id
                          ? constThemeColor.onBackground
                          : null,
                    },
                  ]}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: FontSize.Antz_Minor_Title?.fontSize,
                        fontWeight: FontSize.Antz_Major_Title.fontWeight,
                        color: constThemeColor?.onSurfaceVariant,
                      }}
                    >
                      {item.site_name}
                    </Text>
                  </View>
                </TouchableOpacity>
                <Divider />
              </>
            );
          }}
          onEndReached={handleLoadMore}
        />
      </View>
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    input: {
      color: reduxColors.neutralPrimary,
      width: "80%",
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      marginLeft: 10,
    },
    modalFirstbox: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    searchBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: reduxColors.background,
      borderRadius: Spacing.mini,
      // width: 220,
      paddingLeft: Spacing.small,
      // height: heightPercentageToDP(4.7),
      height: 36,
      justifyContent: "space-between",
    },

    speciesDropdown: {
      width: widthPercentageToDP(27),
      height: heightPercentageToDP(4.7),
      borderRadius: 8,
      backgroundColor: reduxColors.background,
      borderColor: reduxColors.onPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
    modalSearchplaceholderStyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
      color: reduxColors.neutralPrimary,
    },
    sitecontainerStyle: {
      width: widthPercentageToDP(35),
      marginRight: 10,

      right: widthPercentageToDP(4),
      top: heightPercentageToDP(28),
      position: "absolute",
    },

    title: {
      fontSize: widthPercentageToDP(4.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      width: "100%",
    },
    subtitle: {
      fontSize: widthPercentageToDP(4.5),
      color: reduxColors.onSurfaceVariant,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontStyle: "italic",
    },

    ScientificName: {
      fontSize: widthPercentageToDP(4),
      color: reduxColors.onSurfaceVariant,
      fontWeight: "300",
      fontStyle: "italic",
    },

    MBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(1),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.errorContainer,
    },
    BBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(1),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.secondary,
    },
    IBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(1),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.surfaceVariant,
    },
    UBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(1),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.surfaceVariant,
    },
    cardstyle: {
      flexDirection: "row",
    },
    stylesCard: {
      backgroundColor: reduxColors.neutralPrimary,
      borderBottomWidth: 0.5,
      borderBottomColor: opacityColor(reduxColors.neutralPrimary, 10), //reduxColors.outline,
      borderRadius: 0,
      borderTopWidth: 0.5,
      borderTopColor: opacityColor(reduxColors.neutralPrimary, 10), //reduxColors.outline,
    },
    itemstyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
    },
    roleWrap: {
      padding: 13,
      flexDirection: "row",
      alignItems: "center",
      borderBottomColor: reduxColors.neutralSecondary,
      borderBottomWidth: 0.5,
    },
    roleTitle: {
      fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium_title.fontWeight,
      color: reduxColors.neutralSecondary,
    },
    roleAddBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: reduxColors.surface,
      padding: 6,
      borderRadius: 5,
      marginRight: 5,
    },
    subHeading: {
      color: reduxColors.neutralPrimary,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      marginVertical: Spacing.mini,
    },

    typeListContainer: {
      backgroundColor: reduxColors.onPrimary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "center",
      borderWidth: 1.5,
      borderColor: reduxColors.background,
      borderRadius: Spacing.small,
      marginVertical: Spacing.micro,
      padding: Spacing.body,
      borderRadius: Spacing.small,
      width: "100%",
      // elevation: 1,
    },
    typeTitle: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onSurfaceVariant,
    },
    type: {
      ...FontSize.Antz_Body_Regular,
      color: reduxColors.onSurfaceVariant,
    },
    rightIconTemp: {
      alignItems: "center",
      justifyContent: "center",
    },
  });
