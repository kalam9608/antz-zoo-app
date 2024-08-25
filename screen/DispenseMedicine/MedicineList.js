import { StyleSheet, Text, View, FlatList, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { getDispenseBatch, getMedicines } from "../../services/MedicalsService";
import { TabView, TabBar } from "react-native-tab-view";
import PrescriptionMedicineCard from "../../components/PrescriptionMedicineCard";
import ListEmpty from "../../components/ListEmpty";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import Colors from "../../configs/Colors";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import MedicalSearchFooter from "../../components/MedicalSearchFooter";
import DispenseModal from "./DispenseModal";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import { useToast } from "../../configs/ToastConfig";
const MedicineList = (props) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [medicineData, setMedicineData] = useState([]);
  const [medicineDataLength, setMedicineDataLength] = useState(0);
  const [medicineDataLengthTotal, setMedicineDataLengthTotal] = useState(0);
  const [dataLength, setDataLength] = useState(0);
  const [dataLengthTotal, setDataLengthTotal] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [selectItemName, setSelectItemName] = useState({});
  const [selectedCheckedBox, setSelectedCheckBox] = useState(
    props.route.params?.selected?.map((item) => item.id) ?? []
  );
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const [batchList, setBatchList] = useState([]);
  const [preSelectedIds] = useState(
    props.route.params?.selected?.map((item) => item.id) ?? []
  );
  const [selectedItems, setSelectedItems] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  useEffect(() => {
    setisLoading(true);
    // getMedicineList(1, "");
  }, []);

  const [routes] = React.useState([
    { key: "brandName", title: "By Brand Name" },
    { key: "genericName", title: "By Generic Name" },
  ]);
  const indexChangeFun = (indexCount) => {
    setIndex(indexCount);
    if (searchInput?.length >= 2) {
      setisLoading(true);
      getMedicineList(1, searchInput);
    } else {
      getMedicineList(1, "");
    }
  };
  const getMedicineList = (count, searchText) => {
    const obj = {
      q: searchText,
      page_no: count,
      store_id: props?.route?.params?.selectedStore?.id,
    };
    setPage(count);
    if (searchText?.length > 0) {
      obj.type = index == 0 ? "brand_name" : "generic_name";
    }
    getMedicines(obj)
      .then((response) => {
        if (response?.data) {
          let dataArr = count == 1 ? [] : data;
          let dataArr2 = count == 1 ? [] : medicineData;
          setMedicineDataLength(response.data?.generic_name?.count ?? 0);
          setDataLength(response.data?.brand_name?.count ?? 0);
          setMedicineDataLengthTotal(
            dataArr2.concat(response?.data?.generic_name?.result ?? [])
              ?.length ?? 0
          );
          setDataLengthTotal(
            dataArr.concat(response?.data?.brand_name?.result ?? [])?.length ??
              0
          );
          if (
            response.data?.brand_name?.result ||
            response?.data?.generic_name?.result
          ) {
            setData(dataArr.concat(response?.data?.brand_name?.result ?? []));
            setMedicineData(
              dataArr2.concat(response?.data?.generic_name?.result ?? [])
            );
          }
        }

        setisLoading(false);
      })
      .catch((e) => {
        console.log({ e });
        setisLoading(false);
      });
  };

  const selectAction = (item) => {
    const findExist = selectedCheckedBox?.find((p) => p == item?.id);
    console?.log({ findExist });
    if (findExist) {
      const removeExist = selectedItems?.filter((p) => p?.id != item?.id);
      setSelectedCheckBox(selectedCheckedBox?.filter((p) => p != item?.id));
      setSelectedItems(removeExist);
    } else {
      getBatchList(item);
      setSelectItemName(item);
    }
  };
  const getBatchList = (item) => {
    const obj = {
      id: item?.id,
      Selectedstore: props?.route?.params?.selectedStore?.id,
      type: props?.route?.params?.selectedStore?.type,
    };
    getDispenseBatch(obj)
      .then((res) => {
        console?.log({ res });
        if (res?.success) {
          setBatchList(
            res?.data?.items?.map((v) => {
              return { ...v, id: v?.batch_no, name: v?.batch_no };
            })
          );
          setToggleModal(!toggleModal);
        } else {
          errorToast(
            "error",
            "No stock available" ?? "Oops! something went wrong !!"
          );
        }
      })
      .catch((e) => {
        console.log({ e });
        errorToast("Error", "Oops! something went wrong !!");
      });
  };
  const handleLoadMoreMedicineData = () => {
    if (
      !isLoading &&
      index == 0 &&
      dataLength > 0 &&
      index == 0 &&
      dataLength != dataLengthTotal &&
      index == 0
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getMedicineList(nextPage, searchInput);
    }
  };
  const handleLoadMoreMedicineDataGeneric = () => {
    if (
      !isLoading &&
      index == 1 &&
      medicineDataLength > 0 &&
      index == 1 &&
      medicineDataLength != medicineDataLengthTotal &&
      index == 1
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      getMedicineList(nextPage, searchInput);
    }
  };

  const renderMedicineFooter = () => {
    if (
      isLoading ||
      (index == 0 && dataLength <= 10) ||
      (index == 0 && dataLength == dataLengthTotal)
    )
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };
  const renderMedicineFooterGeneric = () => {
    if (
      isLoading ||
      (index == 1 && medicineDataLength <= 10) ||
      (index == 1 && medicineDataLength == medicineDataLengthTotal)
    )
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };

  //prescription search
  useEffect(() => {
    if (searchInput.length >= 2) {
      const getData = setTimeout(() => {
        setisLoading(true);
        getMedicineList(1, searchInput);
      }, 1000);
      return () => clearTimeout(getData);
    } else if (searchInput.length == 0) {
      setisLoading(true);
      setSearchInput("");
      getMedicineList(1, "");
    }
  }, [searchInput]);
  const clearSearch = () => {
    setSearchInput("");
  };
  const handleDetailsSubmit = (item, rows) => {
    setSelectedCheckBox([...selectedCheckedBox, item.id]);
    // const exist = selectedItems?.find((p=>))
    setSelectedItems([
      ...selectedItems,
      { id: item?.id, name: item?.name, list: rows },
    ]);
    setToggleModal(false);
    console.log({ rows });
  };
  const back = () => {
    props.route.params?.onGoBack(selectedItems), props.navigation?.goBack();
  };

  const RenderScene = ({ route }) => {
    switch (route.key) {
      case "brandName":
        return (
          <View
            style={{
              paddingHorizontal: Spacing.minor,
            }}
          >
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={<ListEmpty visible={isLoading} />}
              renderItem={({ item, index }) => {
                return (
                  <PrescriptionMedicineCard
                    item={item}
                    index={index}
                    showCount={true}
                    selectedCheckedBox={selectedCheckedBox}
                    selectAction={selectAction}
                    preSelectedIds={preSelectedIds}
                  />
                );
              }}
              onEndReached={handleLoadMoreMedicineData}
              onEndReachedThreshold={0.4}
              ListFooterComponent={renderMedicineFooter}
            />
          </View>
        );
      case "genericName":
        return (
          <View
            style={{
              paddingHorizontal: Spacing.minor,
            }}
          >
            <FlatList
              showsVerticalScrollIndicator={false}
              data={medicineData}
              ListEmptyComponent={<ListEmpty visible={isLoading} />}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <PrescriptionMedicineCard
                    item={item}
                    index={index}
                    showCount={true}
                    selectedCheckedBox={selectedCheckedBox}
                    selectAction={selectAction}
                    preSelectedIds={preSelectedIds}
                  />
                );
              }}
              onEndReached={handleLoadMoreMedicineDataGeneric}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderMedicineFooterGeneric}
            />
          </View>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={constThemeColor.onPrimary}
      />
      <Loader visible={isLoading} />
      <View style={reduxColors.container}>
        <Searchbar
          accessible={true}
          accessibilityLabel={"commonSearchBar"}
          AccessibilityId={"commonSearchBar"}
          placeholder={`Search Medicine`}
          placeholderTextColor={constThemeColor?.mediumGrey}
          defaultValue={props.route.params?.itemName}
          onChangeText={(text) => setSearchInput(text)}
          value={searchInput}
          inputStyle={reduxColors.input}
          autoFocus={false}
          style={[
            reduxColors.Searchbar,
            { backgroundColor: constThemeColor.onPrimary },
          ]}
          // autoFocus={false}
          icon={({ size, color }) => (
            <Ionicons
              name="arrow-back"
              size={24}
              color
              style={{
                color: constThemeColor.onSecondaryContainer,
              }}
              onPress={() => props.navigation.goBack()}
            />
          )}
          right={() => (
            <>
              <View style={{ paddingRight: 10 }}>
                {searchInput ? (
                  <View>
                    <Entypo
                      name="cross"
                      size={30}
                      color={Colors.mediumGrey}
                      onPress={clearSearch}
                    />
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </>
          )}
        />
        <View style={[reduxColors.PrescriptionStyle]}>
          <TabView
            accessible={true}
            accessibilityLabel={"commonSearchTab"}
            AccessibilityId={"commonSearchItemTab"}
            navigationState={{ index, routes }}
            renderScene={RenderScene}
            onIndexChange={indexChangeFun}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                style={{
                  backgroundColor: constThemeColor.onPrimary,
                  color: constThemeColor.onSurfaceVariant,
                  marginBottom: Spacing.small,
                }}
                labelStyle={{
                  textAlign: "center",
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  color: constThemeColor.onSurfaceVariant,
                }}
                indicatorStyle={{
                  backgroundColor: constThemeColor.primary,
                  height: 4,
                  borderTopLeftRadius: Spacing.mini,
                  borderTopRightRadius: Spacing.mini,
                  width: "40%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: Spacing.minor,
                }}
                activeColor={constThemeColor.onSurface}
              />
            )}
          />
        </View>
        {toggleModal ? (
          <DispenseModal
            selectItemName={selectItemName}
            handleToggleCommDropdown={() => setToggleModal(!toggleModal)}
            batchList={batchList}
            handleDetailsSubmit={handleDetailsSubmit}
          />
        ) : null}

        {/* Footer */}

        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
          }}
        >
          <MedicalSearchFooter
            title={"Rx"}
            singular={props.route.params?.singular}
            selectCount={selectedItems?.length}
            // toggleSelectedList={toggleSelectedList}
            onPress={back}
            selectedItems={selectedItems}
          />
        </View>
      </View>
    </>
  );
};

export default MedicineList;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: reduxColors.surfaceVariant,
    },
    Searchbar: {
      borderRadius: 0,
      borderBottomWidth: 1,
      borderColor: Colors.lightGrey,
      width: "100%",
    },
    inputTextAddField: {
      height: 50,
      marginHorizontal: Spacing.minor,
      borderRadius: Spacing.mini,
      paddingLeft: Spacing.body,
      paddingRight: Spacing.minor,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: reduxColors.onPrimary,
      marginTop: Spacing.minor,
    },
    searchItemList: {
      borderRadius: Spacing.mini,
      marginHorizontal: Spacing.minor,
      marginVertical: Spacing.mini,
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.small,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    PrescriptionStyle: {
      flex: 1,
      borderTopWidth: 1,
      borderColor: reduxColors.surfaceVariant,
      width: "100%",
      marginBottom: 85,
    },
    labelName: {
      color: Colors.textColor,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
    },
    searchItemName: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      flex: 1,
      marginRight: Spacing.small,
    },
  });
