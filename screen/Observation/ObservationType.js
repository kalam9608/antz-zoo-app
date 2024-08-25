import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { FlatList } from "react-native";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { Divider, RadioButton } from "react-native-paper";
import CheckBox from "../../components/CheckBox";
import { NewObservationTypeList } from "../../services/ObservationService";
import Loader from "../../components/Loader";

const ObservationType = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [observationTypeData, setObservationTypeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(
    props.route.params?.data ? props.route.params?.data : []
  );

  const [selectedIds, setSelectedIds] = useState(
    props.route.params?.extraData?.selectedIds
      ? props.route.params?.extraData?.selectedIds
      : []
  );

  const [selectedParent, setSelectedParent] = useState(
    props.route.params?.extraData?.selectedIds
      ? props.route.params?.extraData?.selectedIds
      : ""
  );
  const [selectedChildren, setSelectedChildren] = useState(
    props.route.params?.extraData?.selectedSubTypeIds
      ? props.route.params?.extraData?.selectedSubTypeIds
      : []
  );
  const [SellectionDone, setSellectionDone] = useState(false);
  const handleParentSelection = (parentId) => {
    const selectedParentData = observationTypeData?.find(
      (parent) => parent.id === parentId
    );
    const selectedParentDone = observationTypeData?.find(
      (parent) => parent.id === parentId
    );
    setSellectionDone(
      selectedParentDone?.child_observation.length > 0 ? false : true
    );
    const updatedCompleteData = {
      id: selectedParentData.id,
      type_name: selectedParentData.type_name,
      key: selectedParentData.key,
      source_required: selectedParentData.source_required,
      child_observation: [],
    };

    setSelectedParent(parentId);
    setSelectedIds(parentId);
    setSelectedChildren([]);
    setSelectedItems(updatedCompleteData);
  };

  const handleChildSelection = (childId) => {
    if (!selectedParent) return;

    const selectedIndex = selectedChildren.indexOf(childId);
    const selectedParentData = observationTypeData?.find(
      (parent) => parent.id === selectedParent
    );

    let updatedChildObservation = [];

    if (selectedIndex === -1) {
      setSelectedChildren([...selectedChildren, childId]);
      updatedChildObservation = [
        ...selectedItems.child_observation,
        selectedParentData.child_observation.find(
          (child) => child.id === childId
        ),
      ];
    } else {
      const updatedChildren = selectedChildren.filter((id) => id !== childId);
      setSelectedChildren(updatedChildren);
      updatedChildObservation = selectedItems.child_observation.filter(
        (child) => child.id !== childId
      );
    }

    const updatedCompleteData = {
      ...selectedItems,
      child_observation: updatedChildObservation,
    };
    setSellectionDone(updatedCompleteData?.child_observation?.length!==0 ? true : false);
    setSelectedItems(updatedCompleteData);
  };
  const back = () => {
    props.route.params?.onGoBack(selectedItems),
      props.route.params?.saveExtraData({
        selectedIds: selectedIds,
        selectedSubTypeIds: selectedChildren,
      });
    props.navigation.goBack();
  };

  useEffect(() => {
    setIsLoading(true);
    NewObservationTypeList()
      .then((res) => {
        setObservationTypeData(res.data);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log("error", e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          paddingHorizontal: Spacing.body,
          paddingVertical: Spacing.small,
        }}
      >
        <Loader Loader={isLoading} />
        <View
          style={{
            backgroundColor: constThemeColor.onPrimary,
            borderRadius: Spacing.mini,
          }}
        >
          <TouchableOpacity
            onPress={() => handleParentSelection(item.id)}
            style={[
              {
                backgroundColor:
                  selectedParent == item.id
                    ? constThemeColor.surface
                    : constThemeColor.onPriamry,
                padding: Spacing.small,
                borderTopLeftRadius: Spacing.mini,
                borderTopRightRadius: Spacing.mini,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: Spacing.mini,
              }}
            >
              <Text
                style={{
                  ...FontSize.Antz_Minor_Title,
                  color: constThemeColor.onSurfaceVariant,
                }}
              >
                {item.type_name}
              </Text>
              <RadioButton
                value={selectedParent}
                status={selectedParent == item.id ? "checked" : "unchecked"}
                onPress={() => handleParentSelection(item.id)}
              />
            </View>
          </TouchableOpacity>
          {selectedParent == item.id && selectedChildren.length > 0 && (
            <Divider bold />
          )}
          {selectedParent == item.id && (
            <View>
              {item.child_observation.map((part) => (
                <TouchableOpacity onPress={() => handleChildSelection(part.id)}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      backgroundColor: constThemeColor.onPrimary,
                      alignItems: "center",
                      paddingHorizontal: Spacing.small,
                      borderBottomLeftRadius: Spacing.mini,
                      borderBottomRightRadius: Spacing.mini,
                    }}
                  >
                    <Text
                      key={part.id}
                      style={{
                        ...FontSize.Antz_Minor_Regular,
                        color: constThemeColor.onSurfaceVariant,
                      }}
                    >
                      {part.type_name}
                    </Text>
                    <CheckBox
                      activeOpacity={1}
                      iconSize={14}
                      checkedColor={constThemeColor?.green}
                      checked={selectedChildren.includes(part?.id)}
                      uncheckedColor={constThemeColor.onPrimary}
                      onPress={() => handleChildSelection(part.id)}
                      labelStyle={[reduxColors.labelName, reduxColors.mb0]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };
  return (
    <>
      <View style={reduxColors.container}>
        <Header
          noIcon={true}
          title={"Select Note Type"}
          backGoesto={false}
          showBackButton={true}
          backgroundColor={"#fff"}
          hideMenu={true}
        />
        <Loader visible={isLoading} />
        <View style={{ flex: 1 }}>
          <FlatList
            data={observationTypeData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      {SellectionDone ? (
        <View
          style={{
            alignItems: "center",
            backgroundColor: constThemeColor.displaybgPrimary,
          }}
        >
          <TouchableOpacity style={reduxColors.btnBg} onPress={back}>
            <Text
              style={{
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                color: constThemeColor.onPrimary,
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

export default ObservationType;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.surfaceVariant,
    },
    btnBg: {
      backgroundColor: reduxColors.primary,
      marginVertical: Spacing.small,
      width: 90,
      height: 40,
      borderRadius: Spacing.small,
      alignItems: "center",
      justifyContent: "center",
    },
  });
