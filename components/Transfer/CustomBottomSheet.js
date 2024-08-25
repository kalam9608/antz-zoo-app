import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Divider } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import AnimalCustomCard from "../AnimalCustomCard";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { Text } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { opacityColor } from "../../utils/Utils";
import UserCustomCard from "../UserCustomCard";
import { TouchableOpacity } from "react-native";

export default function CustomBottomSheet({
  data,
  closeModal,
  total,
  type,
  title,
  showSwitch,
  hideCount,
  navigation,
  allSelectedIds,
  loadWarning,
  loadCount,
  selectedAnimalCount,
  hideHeader,
  showCheckList,
  selectedAnimals,
  editLoad,
  totalMembers,
  transferType,
  trasferStatus,
  isSecurityCheckout,
  isSecurityCheckin,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0)
  const selectedIdsRef = useRef([]);
  const [forceCallKey, setForceCallKey] = useState(0);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const handleSetSelectedIds = useCallback(
    (animal) => {
      if (selectedIdsRef.current?.find(p=>p.animal_id==animal.animal_id)) {
        selectedIdsRef.current = selectedIdsRef.current?.filter(
          (p) => p?.animal_id != animal?.animal_id
        );
      } else {
        selectedIdsRef.current = [...selectedIdsRef.current, animal];
      }
      setSelectedIds(selectedIdsRef.current);
      setForceCallKey(forceCallKey + 1); // TODO: try to remove
    },
    [JSON.stringify(selectedIdsRef.current)]
  );
  useEffect(() => {
    if (allSelectedIds) {
      allSelectedIds(selectedIds, selectedCount);
    }
  }, [selectedIds?.length, forceCallKey]);
  useEffect(() => {
    if (selectedAnimals?.length > 0) {
      setSelectedIds(selectedAnimals);
      selectedIdsRef.current = selectedAnimals;
    }
  }, [JSON.stringify(selectedAnimals)]);
  const activityStatusList = [
    "RIDE_STARTED",
    "LOADED_ANIMALS",
    "SECURITY_CHECKOUT_DENIED",
    "SECURITY_CHECKOUT_ALLOWED",
    "SECURITY_CHECKIN_DENIED",
    "SECURITY_CHECKIN_ALLOWED",
    "CHECKIN_ENTRY_APPROVED",
    "APPROVED_ENTRY",
    "REACHED_DESTINATION",
    "COMPLETED",
    "CANCELED",
    "DESTINATION_VEHICLE_ARRIVED",
  ];

  const Member = ({ users }) => {
    return (
      <>
        <View
          style={{
            flex: 1,
            backgroundColor: constThemeColor?.background,
            padding: Spacing.small,
          }}
        >
          <FlatList
            data={users}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <UserCustomCard
                item={item}
                selectedStyle={{
                  backgroundColor: constThemeColor?.onPrimary,
                  borderWidth: 1,
                  borderColor: constThemeColor?.outlineVariant,
                }}
                type="transferMember"
                transferType={transferType}
              />
            )}
          />
        </View>
      </>
    );
  };

  return (
    <View style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {hideHeader || type === "member" ? null : (
        <View
          style={[
            reduxColors.titleContainer,
            {
              paddingVertical: hideCount ? Spacing.major : Spacing.body,
              backgroundColor: hideCount ? constThemeColor?.onPrimary : null,
            },
          ]}
        >
          <Text style={hideCount ? reduxColors.title2 : reduxColors.title}>
            {title}
          </Text>
          <AntDesign
            onPress={closeModal}
            name="close"
            size={hideCount ? 30 : 24}
            color={constThemeColor.onPrimaryContainer}
          />
        </View>
      )}
      {hideHeader || type != "member" ? null : (
        <View
          style={[
            reduxColors.titleContainer,
            {
              paddingVertical: Spacing.minor,
              paddingHorizontal: Spacing.body,
              // backgroundColor: ,
            },
          ]}
        >
          <Text
            style={{
              fontSize: FontSize.Antz_Minor_Medium.fontSize,
              fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
              color: constThemeColor?.onSurfaceVariant,
            }}
          >
            {title}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="account-circle"
              size={24}
              color={constThemeColor?.onSurfaceVariant}
            />
            <Text style={reduxColors?.cardHeaderTitle}>
              {totalMembers ?? 0}
            </Text>
          </View>
        </View>
      )}
      {loadWarning ? (
        <View
          style={{
            backgroundColor: constThemeColor?.onPrimary,
            justifyContent: "center",
            alignItems: "center",
            padding: Spacing.body,
          }}
        >
          <Text
            style={[
              FontSize.Antz_Major_Medium,
              { color: constThemeColor?.error },
            ]}
          >
            {total - loadCount}/{total} animals not loaded.
          </Text>
          <TouchableOpacity
            onPress={editLoad}
            style={{
              alignSelf: "center",
              borderWidth: 1,
              borderColor: constThemeColor.onSurfaceVariant,
              width: "90%",
              borderRadius: Spacing.mini,
              paddingVertical: Spacing.minor,
              backgroundColor: constThemeColor.background,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginVertical: Spacing.small,
              marginTop: Spacing.body,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              }}
            >
              {`Edit Loaded List`}
            </Text>
          </TouchableOpacity>
          <Text
            style={[
              FontSize?.Antz_Medium_Medium,
              {
                color: constThemeColor?.onSurfaceVariant,
                textAlign: "center",
                paddingVertical: Spacing.body,
              },
            ]}
          >
            The animals below will get unlocked from this request.
          </Text>
        </View>
      ) : null}
      <Divider />
      {type === "animal" && !hideCount ? (
        <View style={reduxColors.titleContainer}>
          <Text style={reduxColors.total}>Total Animals - {total}</Text>
        </View>
      ) : null}
      <Divider />
      <View
        style={{
          width: "100%",
          flex: 1,
        }}
      >
        {type === "animal" ? (
          <Animal
            speciesListData={data}
            showSwitch={showSwitch}
            handleSetSelectedIds={handleSetSelectedIds}
            selectedCount={selectedCount}
            setSelectedCount={setSelectedCount}
            trasferStatus={trasferStatus}
            selectedIdsRef={selectedIdsRef}
            activityStatusList={activityStatusList}
            showCheckList={showCheckList}
            isSecurityCheckin={isSecurityCheckin}
            selectedAnimals={selectedAnimals}
          />
        ) : null}
        {type === "member" ? <Member users={data} /> : null}
      </View>
    </View>
  );
}
const Animal = React.memo(
  ({
    speciesListData,
    showSwitch,
    handleSetSelectedIds,
    trasferStatus,
    selectedCount,
    setSelectedCount,
    selectedIdsRef,
    activityStatusList,
    showCheckList,
    isSecurityCheckin,
    selectedAnimals
  }) => {
    const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    const reduxColors = styles(constThemeColor);
    const renderItem = ({ item }) => {
      return (
        <View
          style={{
            width: "100%",
            flex: 1,
          }}
        >
          {item.animal_details?.length > 0 ? (
            <View style={reduxColors.header}>
              <Text
                style={[
                  reduxColors.headerText,
                  { fontWeight: FontSize.Antz_Body_Title.fontWeight },
                ]}
              >
                {item.animal_details?.length}{" "}
              </Text>
              <Text style={reduxColors.headerText}>{item.complete_name}</Text>
            </View>
          ) : null}

          <View
            style={{
              width: "100%",
              flex: 1,
            }}
          >
            <FlatList
              data={item.animal_details}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <>
                  <RenderAnimalCustomCard
                    item={item}
                    selectedIdsRef={selectedIdsRef}
                    handleSetSelectedIds={handleSetSelectedIds}
                    selectedCount={selectedCount}
                    setSelectedCount={setSelectedCount}
                    showCheckList={showCheckList}
                    activityStatusList={activityStatusList}
                    isSecurityCheckin={isSecurityCheckin}
                    showSwitch={showSwitch}
                    trasferStatus={trasferStatus}
                    selectedAnimals={selectedAnimals}
                  />
                  <Divider />
                </>
              )}
              // onEndReached={handleLoadMore}
            />
          </View>
        </View>
      );
    };
    return (
      <>
        <View style={{}}>
          <Divider />
          <FlatList
            scrollEnabled={true}
            data={speciesListData}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.taxonomy_id}
          />
        </View>
      </>
    );
  }
);
const RenderAnimalCustomCard = React.memo(
  ({
    item,
    showSwitch,
    activityStatusList,
    handleSetSelectedIds,
    setSelectedCount,
    selectedCount,
    trasferStatus,
    isSecurityCheckin,
    showCheckList,
    selectedIdsRef,
    selectedAnimals,
  }) => {
    const [selectedIds, setSelectedIds] = useState(
      selectedIdsRef.current?.length > 0 ? selectedIdsRef.current : []
    );
    useEffect(() => {
      if (selectedAnimals?.length > 0) {
        setSelectedIds(selectedAnimals);
        selectedIdsRef.current = selectedAnimals;
      }
    }, [JSON.stringify(selectedAnimals)]);
    // const [selectedCount, setSelectedCount] = useState(0)
    const handleToggleSwitch = () => {
     
      if (selectedIds?.find(p=>p?.animal_id==item?.animal_id)) {
        setSelectedIds(selectedIds?.filter((p) => p?.animal_id != item?.animal_id));
        // setSelectedCount(selectedCount - item.total_animal)
      } else {
        setSelectedIds([...selectedIds, item]);
        // setSelectedCount(selectedCount + item.total_animal)
      }
      handleSetSelectedIds(item);
    };
    return (
      <AnimalCustomCard
        item={item}
        animalIdentifier={
          !item?.local_identifier_value ? item?.animal_id : item?.label ?? null
        }
        localID={item?.local_identifier_value ?? null}
        icon={item?.default_icon}
        enclosureName={item?.user_enclosure_name}
        animalName={item.common_name ? item.common_name : item.scientific_name}
        sectionName={item?.section_name}
        show_specie_details={true}
        show_housing_details={true}
        siteName={item?.site_name}
        chips={item?.sex}
        onPress={() => {
          // navigation.navigate("AnimalsDetails", {
          //   animal_id: item.animal_id,
          // });
        }}
        institutioName={
          item?.assigned_status !== "PENDING" && trasferStatus === "COMPLETED"
            ? item?.institution_name
            : null
        }
        switch={showSwitch}
        switchStatus={selectedIds?.find(p=>p.animal_id==item?.animal_id)?true:false}
        toggleSwitch={() => handleToggleSwitch()}
        isSecurityCheckin={isSecurityCheckin}
        style={[
          {
            opacity:
              activityStatusList?.includes(trasferStatus) &&
              (item?.assigned_status === "PENDING" ||
                item?.assigned_status === "SECURITY_CHECKIN_DENIED" ||
                item?.assigned_status === "SECURITY_CHECKOUT_DENIED")
                ? 0.5
                : 1,
          },
        ]}
        noArrow={true}
        // disable={item?.assigned_status === "PENDING"}
        showCheckList={showCheckList}
        checklistStatus={item?.transfer_status}
        excluded={
          activityStatusList?.includes(trasferStatus) &&
          (item?.assigned_status === "PENDING" ||
            item?.assigned_status === "SECURITY_CHECKIN_DENIED" ||
            item?.assigned_status === "SECURITY_CHECKOUT_DENIED")
        }
      />
    );
  }
);
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      backgroundColor: reduxColors.onPrimary,
    },
    titleContainer: {
      flexDirection: "row",
      paddingVertical: Spacing.body,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Spacing.small,
    },
    title: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.outline,
    },
    title2: {
      fontSize: FontSize.Antz_Medium_Medium.fontSize,
      fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },

    total: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.neutralPrimary,
    },
    header: {
      flexDirection: "row",
      paddingVertical: Spacing.body,
      alignItems: "center",
      paddingHorizontal: Spacing.small,
      backgroundColor: opacityColor(reduxColors.onPrimaryContainer, 20),
    },

    headerText: {
      textAlign: "center",
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    cardHeaderTitle: {
      color: reduxColors?.onSecondaryContainer,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      paddingLeft: Spacing.small,
    },
  });
