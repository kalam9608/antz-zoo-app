import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import InputBox from "../../components/InputBox";
import Category from "../../components/DropDownBox";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import CustomForm from "../../components/CustomForm";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import InchargeCard from "../../components/InchargeCard";
import { setApprover } from "../../redux/AnimalMovementSlice";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MedicalAnimalCard from "../../components/MedicalAnimalCard";
import { filterAnimals } from "../../services/AnimalService";
import moment from "moment";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import InsideBottomsheet from "../../components/Move_animal/InsideBottomsheet";
import Loader from "../../components/Loader";
import { ScrollView } from "react-native-gesture-handler";
import SubmitBtn from "../../components/SubmitBtn";
import DispenseModal from "./DispenseModal";
import {
  createDispense,
  getDispenseBatch,
} from "../../services/MedicalsService";
import { useToast } from "../../configs/ToastConfig";
import { opacityColor } from "../../utils/Utils";
const AddDispenseMedicine = () => {
  const [storeType, setStoreType] = useState("");
  const [selectedStore, setSelectedStore] = useState({});
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [isStoreTypeMenuOpen, setIsStoreTypeMenuOpen] = useState(false);
  const [approverList, setApproverList] = useState([]);
  const [animalList, setAnimalList] = useState([]);
  const [allAnimalList, setAllAnimalList] = useState([]);
  const [animalListDataLength, setAnimalListDataLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rowsErrMsg, setRowsErrMsg] = useState([
    { medicine: false, qty: false },
  ]);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const { showToast, errorToast } = useToast();
  const [storeList, setStoreList] = useState([]);
  const [searchTextAnimal, setSearchTextAnimal] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [selectItemName, setSelectItemName] = useState({});
  const [batchList, setBatchList] = useState([]);
  const navigation = useNavigation();
  const selectAnimalModalRef = useRef();
  // redux

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const storeLisRedux =
    useSelector((state) => state.PharmacyAccessSlice?.pharmacyData?.pharmacy) ??
    [];

  const filterDispense = storeLisRedux?.filter(
    (item) =>
      item?.permission?.dispense_medicine ||
      item?.permission?.pharmacy_module == "allow_full_access"
  );
  const reduxColors = styles(constThemeColor);
  useEffect(() => {
    setTimeout(() => {
      setStoreList(
        filterDispense?.map((v) => {
          return { id: v?.id, name: v?.name, type: v?.type };
        })
      );
    });
  }, [JSON.stringify(filterDispense)]);

  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const approver = useSelector((state) =>
    Object.keys(state.AnimalMove.approver).length > 0
      ? state.AnimalMove.approver
      : []
  );

  const SetStoreTypeDropDown = () => {
    setIsStoreTypeMenuOpen(!isStoreTypeMenuOpen);
  };
  const storeTypeCatClose = () => {
    setIsStoreTypeMenuOpen(false);
  };
  const storeTypeCatPressed = (item) => {
    setSelectedStore(item[0]);
    setStoreType(item.map((u) => u.name).join(", "));
    setIsStoreTypeMenuOpen(false);
    if (selectedStore?.id != item[0]?.id) {
      clearData();
    }
  };

  const clearData = () => {
    setSelectedMedicines([]);
    dispatch(setApprover([]));
    setAnimalList([]);
  };
  //select/delete doctor functionality
  const gotoApprovalScreen = () => {
    navigation.navigate("InchargeAndApproverSelect", {
      selectedInchargeIds: approverList.map((item) => item.user_id),
      inchargeDetailsData: approverList,
      is_single: true,
    });
  };
  useEffect(() => {
    setApproverList(approver);
    if (approverList?.length > 0) {
    }
  }, [JSON.stringify(approver)]);
  const deleteApprover = (id) => {
    const filter = approverList?.filter((p) => p?.user_id != id);
    setApproverList(filter);
    dispatch(setApprover(filter));
  };

  //animal list based on selected doctor(user)
  const animalListApi = (count, user_id, q) => {
    const obj = {
      end_date: moment(new Date()).format("YYYY-MM-DD"),
      page_no: count,
      q: q,
      start_date: null,
      type: "all_animals",
      selected_user_id: user_id,
    };
    setPage(count);
    setLoading(true);
    filterAnimals(obj)
      .then((res) => {
        if (res?.success) {
          if (q.length > 0) {
            setAnimalListDataLength(0);
            setAllAnimalList(res?.data?.animals);
          } else {
            // setSearch(false);
            let dataArr = page == 1 ? [] : allAnimalList;
            setAnimalListDataLength(res.data?.animals?.length);
            if (res.data?.animals?.length > 0) {
              setAllAnimalList(dataArr.concat(res.data?.animals));
            }
          }
        } else {
          errorToast("Oops!", "Something went wrong!!");
          setLoading(false);
        }
      })
      .catch((err) => {
        errorToast("Oops!", "Something went wrong!!");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setSelectedIds(animalList?.map((v) => v?.animal_id));
  }, [JSON.stringify(animalList)]);

  const selectAnimalHandler = (animal) => {
    if (selectedIds.includes(animal?.animal_id)) {
      setAnimalList((old) => {
        return old?.filter((v) => v?.animal_id !== animal?.animal_id);
      });
    } else {
      if (animalList?.length < Number(Infinity)) {
        setAnimalList((old) => {
          return [...old, { ...animal, selectType: "animal" }];
        });
      }
    }
  };

  const clearSelectedId = () => {
    setAnimalList([]);
  };
  const closeSheet = () => {
    selectAnimalModalRef.current.close();
  };
  const deleteFun = (type, id) => {
    if (type == "animal") {
      const filterData = animalList?.filter((p) => p.animal_id != id);
      setAnimalList(filterData);
    }
  };

  const handleLoadMore = () => {
    if (!loading && animalListDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      animalListApi(nextPage, approverList[0]?.user_id, "");
    }
  };
  const handleSearch = (text, type) => {
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        if (type == "animal") {
          setSearchTextAnimal(text);
          animalListApi(1, approverList[0]?.user_id, text);
        }
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      const getData = setTimeout(() => {
        if (type == "animal") {
          setSearchTextAnimal("");
          animalListApi(1, approverList[0]?.user_id, text);
        }
      }, 2000);
      return () => clearTimeout(getData);
    }
  };
  const searchSelectData = (data) => {
    setSelectedMedicines([...selectedMedicines, ...data]);
  };

  const editMedicine = (item) => {
    setRowsErrMsg(
      item?.list?.map((item) => {
        return { medicine: false, qty: false };
      })
    );
    setToggleModal(true);
    setSelectItemName(item);
    getBatchList(item);
  };

  const getBatchList = (item) => {
    const obj = {
      id: item?.id,
      Selectedstore: selectedStore?.id,
    };
    getDispenseBatch(obj)
      .then((res) => {
        if (res?.success) {
          setBatchList(
            res?.data?.items?.map((v) => {
              return { ...v, id: v?.batch_no, name: v?.batch_no };
            })
          );
          setToggleModal(!toggleModal);
        } else {
          errorToast("error", res?.data ?? "Opps! something went wrong !!");
        }
      })
      .catch((e) => {
        console.log({ e });
        errorToast("Error", "Opps! something went wrong !!");
      });
  };

  const editMedicineList = (data, rows) => {
    const index = selectedMedicines.findIndex((item) => item.id === data?.id);
    if (index != -1) {
      setSelectedMedicines([
        ...selectedMedicines.slice(0, index),
        { id: data?.id, name: data?.name, list: rows },
        ...selectedMedicines.slice(index + 1),
      ]);
      setToggleModal(false);
    }
  };
  const removeMedicine = (id) => {
    setSelectedMedicines(selectedMedicines?.filter((p) => p?.id !== id));
  };
  const submitDispense = () => {
    const mergedList = selectedMedicines.flatMap((item) =>
      item.list.map(({ batch_no, qty, stock_id }) => ({
        batch_no,
        qty,
        stock_id,
      }))
    );
    const obj = {
      Selectedstore: selectedStore?.id,
      user_id: approverList[0]?.user_id,
      animal_id: animalList?.map((v) => v?.animal_id),
      dispense_item_details: mergedList,
    };
    setLoading(true);
    createDispense(obj)
      .then((res) => {
        if (res?.success) {
          showToast("success", res?.message);
          setLoading(false);
          navigation.replace("DispenseSummary", {
            id: res?.data,
            store_id: selectedStore?.id,
          });
        } else {
          setLoading(false);
          errorToast("error", res?.message ?? "Opps! something went wrong !!");
        }
      })
      .catch((e) => {
        setLoading(false);
        errorToast("error", res?.message ?? "Opps! something went wrong !!");
        // console?.log({ err: e });
      });
  };
  const disableBtn =
    selectedStore?.id &&
    selectedMedicines?.length > 0 &&
    approverList?.length > 0
      ? false
      : true;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: constThemeColor?.surfaceVariant,
      }}
    >
      <Loader visible={loading} />
      <Header
        title={"Dispense"}
        headerTitle={reduxColors.headerTitle}
        noIcon={true}
        search={false}
        hideMenu={true}
        backgroundColor={constThemeColor?.surfaceVariant}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: constThemeColor?.surfaceVariant }}
      >
        <View style={reduxColors.mainContainer}>
          <View style={reduxColors.card}>
            <Text style={reduxColors.commonTitle}>
              {"Dispense from pharmacy"}
            </Text>

            <TouchableOpacity
              activeOpacity={0.5}
              style={reduxColors.selectSiteButtonContainer}
              onPress={() => SetStoreTypeDropDown()}
            >
              {/* <Image
                source={require("../../assets/nearMe.png")}
                resizeMode={"contain"}
                style={reduxColors.nearMeIcon}
              /> */}
              <Text style={reduxColors.siteTitleText}>
                {/* {selectedSite?.site_name ?? "Select Site"} */}
                {storeType ? storeType : "Select pharmacy"}
              </Text>
              <Image
                source={require("../../assets/expandMore.png")}
                resizeMode={"contain"}
                style={reduxColors.expandMoreIcon}
              />
            </TouchableOpacity>
          </View>
          {selectedStore?.id ? (
            <>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("MedicineList", {
                      selectedStore: selectedStore,
                      selected: selectedMedicines,
                      onGoBack: (e) => searchSelectData(e),
                    });
                  }}
                >
                  <View
                    style={[
                      reduxColors.cardContainer,
                      {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: Spacing.small,
                        borderBottomLeftRadius:
                          selectedMedicines?.length > 0 ? 0 : Spacing.small,
                        borderBottomRightRadius:
                          selectedMedicines?.length > 0 ? 0 : Spacing.small,
                        backgroundColor: constThemeColor?.surface,
                        padding: Spacing.body,
                        marginVertical:
                          selectedMedicines?.length > 0 ? 0 : Spacing.mini,
                      },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "80%",
                      }}
                    >
                      <Text style={[reduxColors?.commonTitle]}>
                        Add Medicines
                      </Text>
                    </View>

                    <>
                      <Feather
                        name="plus-circle"
                        size={24}
                        color={constThemeColor.addPrimary}
                      />
                    </>
                  </View>
                </TouchableOpacity>
                {selectedMedicines?.length > 0 ? (
                  <View
                    style={{
                      backgroundColor: constThemeColor?.background,
                      paddingHorizontal: Spacing.body,
                      paddingVertical: Spacing.body,
                      borderBottomWidth: 1,
                      borderColor: constThemeColor?.outlineVariant,
                    }}
                  >
                    <Text
                      style={{
                        color: constThemeColor?.onSurfaceVariant,
                        fontSize: FontSize.Antz_Minor_Regular?.fontSize,
                        fontWeight: FontSize?.Antz_Minor_Regular?.fontWeight,
                        // borderBottomWidth: 1,
                        // borderColor: constThemeColor?.outlineVariant,
                      }}
                    >
                      {selectedMedicines?.length}{" "}
                      {selectedMedicines?.length == 1
                        ? "medicine"
                        : "medicines"}{" "}
                      added
                    </Text>
                  </View>
                ) : null}

                {selectedMedicines?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => editMedicine(item)}
                      style={{
                        backgroundColor: constThemeColor?.onPrimary,
                        padding: Spacing.body,
                        paddingHorizontal: Spacing.body,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottomLeftRadius:
                          index == selectedMedicines?.length - 1
                            ? Spacing.small
                            : 0,
                        borderBottomRightRadius:
                          index == selectedMedicines?.length - 1
                            ? Spacing.small
                            : 0,
                        borderBottomWidth:
                          index == selectedMedicines?.length - 1 ? 0 : 1,
                        borderColor: constThemeColor?.outlineVariant,
                      }}
                    >
                      <View>
                        <Text
                          style={[
                            FontSize.Antz_Minor_Medium,
                            { color: constThemeColor?.onPrimaryContainer },
                          ]}
                        >
                          {item?.name}
                        </Text>
                      </View>
                      <View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text style={[FontSize.Antz_Minor_Medium]}>
                            {item?.list?.reduce(
                              (acc, crr) => acc + parseInt(crr?.qty),
                              0
                            )}
                          </Text>
                          <TouchableOpacity
                            onPress={() => removeMedicine(item?.id)}
                            style={{
                              alignSelf: "center",
                              marginLeft: Spacing.body,
                            }}
                          >
                            <MaterialIcons
                              name="highlight-remove"
                              size={24}
                              color={constThemeColor.error}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ marginVertical: Spacing.body }}>
                <InchargeCard
                  navigation={gotoApprovalScreen}
                  title={"Dispense to "}
                  selectedUserData={approverList}
                  removeAsign={(item) => deleteApprover(item?.user_id)}
                  customContainerPadding={Spacing.body}
                  outerStyle={{
                    borderWidth: approverList?.length > 0 ? 2 : 1,
                    borderRadius: 8,
                    backgroundColor: constThemeColor.surface,
                    borderColor: constThemeColor.outlineVariant,
                  }}
                  icon={
                    <Feather
                      name="plus-circle"
                      size={24}
                      color={constThemeColor.addPrimary}
                    />
                  }
                  customStyle={reduxColors?.commonTitle}
                />
              </View>
              {approverList?.length > 0 ? (
                <MedicalAnimalCard
                  outerStyle={[
                    reduxColors.cardContainer,
                    {
                      marginTop: Spacing.mini,
                      paddingBottom: []?.length ? 0 : null,
                    },
                  ]}
                  title={"Select Animal"}
                  navigation={() => {
                    setAllAnimalList([]);
                    selectAnimalModalRef.current.present();
                    animalListApi(1, approverList[0]?.user_id, "");
                  }}
                  animalList={animalList}
                  enclosureData={[]}
                  sectionData={[]}
                  hideIcon={true}
                  deleteFun={deleteFun}
                  boldStyle={true}
                />
              ) : null}
            </>
          ) : null}
        </View>
      </ScrollView>
      <View style={{ paddingVertical: Spacing.body }}>
        <SubmitBtn
          buttonText="Dispense"
          backgroundColor={
            disableBtn
              ? opacityColor(constThemeColor.neutralPrimary, 10)
              : constThemeColor?.onSurface
          }
          onPress={submitDispense}
          isButtonDisabled={disableBtn}
        />
      </View>

      {isStoreTypeMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isStoreTypeMenuOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={storeTypeCatClose}
          >
            <Category
              categoryData={storeList}
              onCatPress={storeTypeCatPressed}
              heading={"Select Store"}
              isMulti={false}
              onClose={storeTypeCatClose}
            />
          </Modal>
        </View>
      ) : null}

      {toggleModal ? (
        <DispenseModal
          selectItemName={selectItemName}
          handleToggleCommDropdown={() => setToggleModal(!toggleModal)}
          batchList={batchList}
          rowsErrMsgData={rowsErrMsg}
          handleDetailsSubmit={editMedicineList}
        />
      ) : null}
      <BottomSheetModalComponent
        // style={{ marginHorizontal: Spacing.body }}
        ref={selectAnimalModalRef}
      >
        <InsideBottomsheet
          title="Select Animal"
          type="animal"
          onPress={(item) => selectAnimalHandler(item)}
          data={allAnimalList}
          enclosure
          seletedAnimals={animalList}
          handleLoadMore={handleLoadMore}
          selectedIds={selectedIds}
          closeSheet={closeSheet}
          searchText={searchTextAnimal}
          handelSearch={handleSearch}
          clearSelectedId={clearSelectedId}
          // screenName={screenName}
          selectedPreviousIds={[]}
          // selectedPreviousIds
        />
      </BottomSheetModalComponent>
    </View>
  );
};

export default AddDispenseMedicine;

const styles = (reduxColors) =>
  StyleSheet.create({
    bottomSheetStyle: {
      margin: 0,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    cardContainer: {
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.surface,
      marginVertical: Spacing.mini,
    },
    commonTitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      flexWrap: "wrap",
    },
    mainContainer: {
      justifyContent: "space-between",
      flexDirection: "column",
      paddingHorizontal: Spacing.minor,
    },
    card: {
      borderWidth: 1,
      borderRadius: Spacing.small + Spacing.micro,
      borderColor: reduxColors.outlineVariant,
      backgroundColor: reduxColors.surface,
      padding: Spacing.body,
      marginBottom: Spacing.body + Spacing.micro,
    },
    cardTitleText: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurface,
      flex: 1,
    },
    moveInfoText: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginTop: Spacing.mini,
    },
    selectSiteButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.minor + Spacing.micro,
      borderWidth: 1,
      borderRadius: Spacing.mini,
      borderColor: reduxColors.outlineVariant,
      backgroundColor: reduxColors.onPrimary,
      marginTop: Spacing.body,
    },
    nearMeIcon: {
      height: 20,
      width: 20,
    },
    expandMoreIcon: {
      height: 24,
      width: 26,
    },
    siteTitleText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onPrimaryContainer,
      flex: 1,
      // marginHorizontal: Spacing.small,s
    },
  });
