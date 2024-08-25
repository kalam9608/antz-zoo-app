import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { opacityColor } from "../../utils/Utils";
import FontSize from "../../configs/FontSize";
import AnimalCustomCard from "../AnimalCustomCard";
import { FlatList } from "react-native";
import { Divider } from "react-native-paper";
import ListEmpty from "../ListEmpty";
import { animalListBySpecies } from "../../services/Animal_movement_service/MoveAnimalService";
import { useToast } from "../../configs/ToastConfig";
import Spacing from "../../configs/Spacing";
import { useSelector } from "react-redux";
import { ModalTitleData } from "../ModalFilterComponent";
import CheckBox from "../CheckBox";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheetModalComponent from "../BottomSheetModalComponent";
import CustomBottomSheet from "./CustomBottomSheet";
import { changeAnimalEnclosure } from "../../services/GetEnclosureBySectionIdServices";
import Loader from "../Loader";

const AllocateAnimals = (props) => {
  const navigation = useNavigation();
  const [Items, setItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [filterName, setFilterName] = useState("Show All");
  const [allAnimalList, setAllAnimalList] = useState([]);
  const [allAnimalCount, setAllAnimalCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState(
    // selectedAnimals?.length > 0 ? selectedAnimals : []
    []
  );
  const [allocatedAnimalList, setAllocatedAnimalList] = useState([]);
  const [allocatedAnimalCount, setAllocatedAnimalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const animalSheetRef = useRef(null);
  //   const reduxColors = styles(themeColors);
  // species checkbox select here
  const toggleSpeciesCheckBox = (speciesId, animalsId, checked) => {
    if (checked) {
      setSelectedIds(selectedIds?.filter((p) => !animalsId?.includes(p)));
    } else {
      setSelectedIds([...selectedIds, ...animalsId]);
    }
  };
  const closeAnimalSheet = () => {
    animalSheetRef.current.close();
  };
  // animal checkbox select automatically
  const toggleAnimalCheckBox = (animalId, speciesId) => {
    const isSelectedSpecies = selectedSpecies.includes(speciesId);
    const isChecked = isSelectedSpecies || selectedIds.includes(animalId);

    setSelectedIds(
      isChecked
        ? selectedIds.filter((id) => id !== animalId)
        : [...selectedIds, animalId]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      setSelectedIds([]);
      if (props?.route?.params?.animal_movement_id) {
        fetchAllAnimal();
      }
    }, [navigation, props?.route?.params?.animal_movement_id])
  );
  const filterAnimals = (data, type) => {
    return data
      .map((item) => {
        return {
          animal_details: item.animal_details.filter(
            (animal) => animal.assigned_status === type
          ),
          complete_name: item.complete_name,
          taxonomy_id: item.taxonomy_id,
        };
      })
      .filter((item) => item.animal_details.length > 0);
  };

  const selectAllAnimals = () => {
    const animalIds = [];
    allAnimalList.forEach((item) => {
      if (item.animal_details) {
        item.animal_details.forEach((detail) => {
          if (detail.animal_id) {
            animalIds.push(detail?.animal_id);
          }
        });
      }
    });
    if (selectedIds.length == animalIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(animalIds);
    }
  };

  const calculateTotalAnimalCount = (data) => {
    let totalAnimalCount = 0;
    data.forEach((item) => {
      item.animal_details.forEach((animalDetails) => {
        if (animalDetails.type === "group") {
          totalAnimalCount += animalDetails.total_animal;
        } else {
          totalAnimalCount++;
        }
      });
    });

    return totalAnimalCount;
  };

  const fetchAllAnimal = () => {
    setIsLoading(true);
    animalListBySpecies({
      animal_movement_id: props?.route?.params?.animal_movement_id,
    })
      .then((res) => {
        if (res?.success) {
          const transferredAnimalsArray = filterAnimals(
            res.data.result,
            "TEMPORARILY_ASSIGNED"
          );
          const allocateAnimalsArray = filterAnimals(
            res.data.result,
            "ASSIGNED"
          );
          // console?.log({ transferredAnimalsArray });
          const allocatedCount =
            calculateTotalAnimalCount(allocateAnimalsArray);
          setAllAnimalList(transferredAnimalsArray);
          setAllocatedAnimalList(allocateAnimalsArray);
          setAllocatedAnimalCount(allocatedCount);
          setAllAnimalCount(res.data?.allocation_count);
        } else {
          errorToast("Error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        errorToast("Error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  // console.log({ dd: props.route.params.allocateTo });
  // Alocate Function

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          width: "100%",
          flex: 1,
        }}
      >
        {item?.animal_details?.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              padding: Spacing.minor,
              alignItems: "center",

              backgroundColor: opacityColor(themeColors.onPrimaryContainer, 20),
            }}
          >
            <Text
              style={[
                {
                  textAlign: "center",
                  fontSize: FontSize.Antz_Body_Title.fontSize,
                  fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                },
                { fontWeight: FontSize.Antz_Body_Title.fontWeight },
              ]}
            >
              {item?.animal_details?.length}{" "}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: FontSize.Antz_Body_Title.fontSize,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
              }}
            >
              {item?.complete_name}
            </Text>
            <View style={{ position: "absolute", right: 8 }}>
              <CheckBox
                checked={item.animal_details?.every((p) =>
                  selectedIds.includes(p?.animal_id)
                )}
                onPress={() =>
                  toggleSpeciesCheckBox(
                    item?.taxonomy_id,
                    item?.animal_details?.map((p) => p?.animal_id),
                    item?.animal_details?.every((p) =>
                      selectedIds.includes(p?.animal_id)
                    )
                  )
                }
              />
            </View>
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
                <AnimalCustomCard
                  item={item}
                  animalIdentifier={
                    !item?.local_identifier_value
                      ? item?.animal_id
                      : item?.label ?? null
                  }
                  localID={item?.local_identifier_value ?? null}
                  icon={item?.default_icon}
                  enclosureName={item?.user_enclosure_name}
                  animalName={
                    item?.common_name
                      ? item?.common_name
                      : item?.scientific_name
                  }
                  siteName={item?.site_name}
                  sectionName={item?.section_name}
                  show_specie_details={true}
                  show_housing_details={true}
                  chips={item?.sex}
                  onPress={() => {
                    toggleAnimalCheckBox(item.animal_id, item.speciesId);
                  }}
                  noArrow={true}
                  showCheckList={selectedSpecies.includes(item.speciesId)}
                  checklistStatus={item?.transfer_status}
                  checkbox={true}
                  checked={selectedIds?.includes(item.animal_id)}
                  from={item?.source_site_name}
                  movedon={item?.transferred_on}
                  style={{
                    borderRadius: 0,
                    marginVertical: 0,
                    paddingVertical: Spacing.minor,
                    backgroundColor: selectedIds?.includes(item.animal_id)
                      ? themeColors?.onBackground
                      : themeColors?.onPrimary,
                  }}
                />
                <Divider />
              </>
            )}
          />
        </View>
      </View>
    );
  };

  const Animal = ({ speciesListData, loading }) => {
    return (
      <>
        <View style={{}}>
          <Divider />
          <FlatList
            contentContainerStyle={{ paddingBottom: 300 }}
            scrollEnabled={true}
            data={speciesListData}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item?.taxonomy_id}
            ListEmptyComponent={<ListEmpty visible={loading} />}
          />
        </View>
      </>
    );
  };
  return (
    <View
      style={{
        // paddingHorizontal: Spacing.small,
        flexGrow: 1,
      }}
    >
      <Loader visible={isLoading} />
      <View
        style={{
          backgroundColor: themeColors.onPrimaryContainer,
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={themeColors.onPrimary}
          style={{
            padding: Spacing.body,
          }}
          onPress={() => navigation.goBack()}
        />
        <View
          style={{ marginLeft: Spacing.micro, paddingVertical: Spacing.body }}
        >
          <Text
            style={{
              color: themeColors?.onSecondary,
              fontSize: FontSize.Antz_Medium_Medium.fontSize,
              fontWeight: FontSize.Antz_Medium_Medium.fontWeight,
            }}
          >
            Allocate Enclosures
          </Text>
          <Text
            style={{
              color: themeColors?.onSecondary,
              fontSize: FontSize.Antz_Body_Regular.fontSize,
              fontWeight: FontSize.Antz_Body_Regular.fontWeight,
            }}
          >
            {props?.route?.params?.request_id}
          </Text>
        </View>
      </View>
      <View
        style={{
          padding: Spacing.body + Spacing.mini,
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          backgroundColor: themeColors.onPrimary,
        }}
      >
        {/* <Text
          style={{
            fontSize: FontSize.Antz_Minor_Regular.fontSize,
            fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
            color: themeColors?.onSurfaceVariant,
          }}
        >
          Transferred -{" "}
          <Text
            style={{
              fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
            }}
          >
            {allAnimalCount}
          </Text>
        </Text> */}
        <Text
          style={{
            fontSize: FontSize.Antz_Minor_Regular.fontSize,
            fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
            color: themeColors?.onErrorContainer,
          }}
        >
          Pending -{" "}
          <Text
            style={{
              color: themeColors?.error,
              fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
            }}
          >
            {allAnimalCount - allocatedAnimalCount}
          </Text>
        </Text>
        <TouchableOpacity
          onPress={() => {
            animalSheetRef.current.present();
          }}
        >
          <Text
            style={{
              fontSize: FontSize.Antz_Minor_Regular.fontSize,
              fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
              color: themeColors?.onPrimaryContainer,
            }}
          >
            Allocated -{" "}
            <Text
              style={{
                color: themeColors?.skyblue,
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              }}
            >
              {allocatedAnimalCount}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      {selectedIds?.length > 0 ? (
        <View
          style={{
            paddingHorizontal: Spacing.body + Spacing.mini,
            paddingVertical: Spacing.body,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
            backgroundColor: themeColors.secondaryContainer,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => setSelectedIds([])}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={themeColors?.onSecondaryContainer}
              />
            </TouchableOpacity>

            <Text
              style={[
                FontSize.Antz_Minor_Title,
                {
                  color: themeColors?.onSecondaryContainer,
                  paddingLeft: Spacing.minor + Spacing.small,
                },
              ]}
            >
              {selectedIds?.length} items
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={selectAllAnimals}>
              <MaterialCommunityIcons
                name="select-all"
                size={24}
                color={themeColors?.onSecondaryContainer}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{
                paddingHorizontal: Spacing.small,
                paddingVertical: Spacing.small,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: themeColors?.onPrimaryContainer,
                borderRadius: 4,
              }}
              onPress={() => {
                if (props.route.params?.allocateTo?.enclosure_id) {
                  navigation.navigate("SelectEnclosure", {
                    section: {
                      section_id: props.route.params?.allocateTo?.section_id,
                      section_name:
                        props.route.params?.allocateTo?.section_name,
                    },
                    type: props?.route?.params?.type,
                    isSection: "",
                    selected_animal: selectedIds,
                    site_id: props.route.params?.allocateTo?.site_id,
                    request_id: props?.route?.params?.request_id,
                    transfer_type: props?.route?.params?.transfer_type,
                    enclosureId:
                      props.route.params?.allocateTo?.enclosure_parent_id ??
                      null,
                    type: props.route.params?.allocateTo?.enclosure_parent_id
                      ? "enclosure"
                      : "section",
                    preSelectedItem: props.route.params?.allocateTo,
                    headerTitle:
                      props?.route.params?.allocateTo?.enclosure_parent_name ??
                      props.route.params?.allocateTo?.section_name,
                    animal_movement_id: props.route.params?.animal_movement_id,
                    preSelected: true,
                    allocateTo:props.route.params?.allocateTo,
                    onPress: (e) => {},
                  });
                  // navigation.navigate("SelectSection", {
                  //   selectedAnimal: selectedIds,
                  //   site_id: props.route.params?.allocateTo?.site_id,
                  //   animal_movement_id: props.route.params?.animal_movement_id,
                  //   request_id: props?.route?.params?.request_id,
                  //   transfer_type: props?.route?.params?.transfer_type,
                  //   module_name: "transfer",
                  //   movement_id: props?.route?.params?.animal_movement_id,
                  // });
                } else {
                  navigation.navigate("SelectSection", {
                    selectedAnimal: selectedIds,
                    site_id: props?.route?.params?.destinationSite?.site_id,
                    animal_movement_id: props.route.params?.animal_movement_id,
                    request_id: props?.route?.params?.request_id,
                    transfer_type: props?.route?.params?.transfer_type,
                    module_name: "transfer",
                    movement_id: props?.route?.params?.animal_movement_id,
                  });
                }
              }}
            >
              <MaterialCommunityIcons
                name="arrow-right-top"
                size={24}
                color={themeColors?.onPrimary}
              />
              <Text
                style={[
                  FontSize.Antz_Subtext_title,
                  { paddingLeft: Spacing.mini, color: themeColors?.onPrimary },
                ]}
              >
                Allocate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <View style={{}}>
        <Animal speciesListData={allAnimalList} loading={isLoading} />
      </View>
      <BottomSheetModalComponent ref={animalSheetRef}>
        <CustomBottomSheet
          data={allocatedAnimalList}
          type="animal"
          title="Allocated Animals"
          total={allocatedAnimalCount}
          closeModal={closeAnimalSheet}
          navigation={navigation}
        />
      </BottomSheetModalComponent>
    </View>
  );
};

export default AllocateAnimals;

const styles = StyleSheet.create({});
