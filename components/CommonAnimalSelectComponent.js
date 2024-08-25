/**
 * @React Imports
 */
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
/**
 * @Expo Imports
 */
import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
/**
 * @Redux Imports
 */
import { useDispatch, useSelector } from "react-redux";

/**
 * @Component Imports
 */
import AnimalCustomCard from "./AnimalCustomCard";
import Card from "./CustomCard";
import Loader from "./Loader";

/**
 * @Third Party Imports
 */
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
/**
 * @Config Imports
 */
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";

/**
 * @API Imports
 */
import { getSection } from "../services/staffManagement/getEducationType";
import { searchScientificName } from "../services/SearchService";
import { getParentEnclosure } from "../services/EggsService";
import { postAnimalEnclosure } from "../services/AnimalEnclosureService";
import BottomSheetModalComponent from "./BottomSheetModalComponent";
import InsideBottomsheet from "./Move_animal/InsideBottomsheet";
import { getEnclosureBySectionId } from "../services/GetEnclosureBySectionIdServices";
import { Keyboard } from "react-native";
import { QrGetDetails } from "../services/staffManagement/addPersonalDetails";
import { useToast } from "../configs/ToastConfig";
const CommonAnimalSelectComponent = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  const [screenName] = useState(props.screenName);
  const [type, settype] = useState(props.type);
  const [limit, setlimit] = useState(props.limit);
  const [selectedQR, setSelectedQR] = useState(props.selctedQr);
  const [animalListDataLength, setAnimalListDataLength] = useState([]);

  const [sectionType, setSectionType] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [sectionTypeData, setSectionTypeData] = useState([]);
  const [isSecTypeMenuOpen, setIsSecTypeMenuOpen] = useState(false);
  const [sectionTypeDataLength, setSectionTypeDataLength] = useState([]);

  const [selectEnclosure, setSelectEnclosure] = useState("");

  const [selectEnclosureId, setSelectEnclosureId] = useState("");
  const [selectEnclosureData, setSelectEnclosureData] = useState([]);
  const [isSelectEnclosure, setIsSelectEnclosure] = useState(false);
  const [selectEnclosureDataLength, setSelectEnclosureDataLength] = useState(
    []
  );

  const [animalData, setAnimalData] = useState([]);

  const [searchData, setSearchData] = useState([]);
  const [selectedAnimalName, setSelectedAnimalName] = useState("");
  const [page, setPage] = useState(1);
  const [sectionPage, setSectionPage] = useState(1);
  const [enclosurePage, setEnclosurePage] = useState(1);

  const [selectedAnimal, setSelectedAnimal] = useState([]);
  const [animalTest, setAnimalTest] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTextSection, setSearchTextSection] = useState("");
  const [searchTextAnimal, setSearchTextAnimal] = useState("");
  const [searchTextEnclosure, setSearchTextEnclosure] = useState("");
  const [search, setSearch] = useState(false);
  const [siteData, setSiteData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const site = useSelector((state) => state.UserAuth.zoos);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const selectSectionModalRef = useRef(null);
  const selectEnclosureModalRef = useRef(null);
  const selectAnimalModalRef = useRef(null);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const handleSelectAnimalModal = () => selectAnimalModalRef.current.present();
  const handleSelectSectionModal = () =>
    selectSectionModalRef.current.present();
  const handleSelectEnclosureModal = () =>
    selectEnclosureModalRef.current.present();

  const selectAnimalHandler = (animal) => {
    if (type == "father" || screenName == "MoveAnimal") {
      if (selectedIds.includes(animal?.animal_id)) {
        setAnimalTest((old) => {
          return old?.filter((v) => v?.animal_id !== animal?.animal_id);
        });
      } else {
        if (animalTest?.length < Number(limit)) {
          setSelectedAnimalName(animal.complete_name);
          setSelectedAnimal(animal);
          setAnimalTest((old) => {
            return [...old, animal];
          });
        }
      }
      // selectAnimalModalRef.current.close();
    } else {
      setSelectedAnimalName(animal.complete_name);
      setSelectedAnimal(animal);
      selectAnimalModalRef.current.close();
    }
    props.selectAnimalHandler(animal);
  };
  const sectionPressed = (item) => {
    setSectionType(item.section_name);
    setSectionId(item.section_id);
    props.sectionPressed(item);
    getEnclosureData(1, item.section_id, "");
    setSelectEnclosure("");

    //for animals
    setSelectedAnimalName("");
    getAllAnimalListById(1, item.enclosure_id, "");
    setSelectedIds([]);
    setAnimalTest([]);
    selectSectionModalRef.current.close();
  };

  const handleSearch = (text, type) => {
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        if (type == "section") {
          setSearchTextSection(text);
          getSectionData(1, text);
        } else if (type == "enclosure") {
          setSearchTextEnclosure(text);
          getEnclosureData(1, sectionId, text);
        } else if (type == "animal") {
          setSearchTextAnimal(text);
          getAllAnimalListById(1, selectEnclosureId, text);
        }
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      const getData = setTimeout(() => {
        if (type == "section") {
          setSearchTextSection("");
          getSectionData(1, text);
        } else if (type == "enclosure") {
          setSearchTextEnclosure("");
          getEnclosureData(1, sectionId, text);
        } else if (type == "animal") {
          setSearchTextAnimal("");
          getAllAnimalListById(1, selectEnclosureId, text);
        }
      }, 2000);
      return () => clearTimeout(getData);
    }
  };
  const clearSelectedId = () => {
    setAnimalTest([]);
  };
  const closeSheet = () => {
    selectAnimalModalRef.current.close();
  };
  const handleLoadMore = () => {
    if (!Loading && animalListDataLength > 0 && !search) {
      const nextPage = page + 1;
      setPage(nextPage);
      getAllAnimalListById(nextPage, selectEnclosureId, "");
    }
  };

  const enclosurePressed = (item) => {
    // After change Encluser need to remove animal data
    setAnimalData([]);
    setAnimalTest([]);
    setPage(1);
    setSelectedAnimalName("");
    // -------------------
    setSelectEnclosure(item.user_enclosure_name);
    setSelectEnclosureId(item.enclosure_id);
    props.enclosurePressed(item);
    getAllAnimalListById(1, item.enclosure_id, "");
    selectEnclosureModalRef.current.close();
  };

  const getAllAnimalListById = (page, selectEnclosureId, searchText) => {
    setLoading(true);
    let getAnimal;

    if (type == "mother") {
      getAnimal = getParentEnclosure({
        enclosure_id: selectEnclosureId,
        gender: "female",
        page_no: page,
        q: searchText,
      });
    } else if (type == "father") {
      getAnimal = getParentEnclosure({
        enclosure_id: selectEnclosureId,
        gender: "male",
        page_no: page,
        q: searchText,
      });
    } else {
      getAnimal = postAnimalEnclosure({
        enclosure_id: selectEnclosureId,
        page_no: page,
        q: searchText,
      });
    }
    getAnimal
      .then((res) => {
        if (searchText.length > 0) {
          setAnimalListDataLength(0);
          setAnimalData(res.data);
        } else {
          setSearch(false);
          let dataArr = page == 1 ? [] : animalData;
          setAnimalListDataLength(res?.data?.length);
          if (res.data?.length > 0) {
            if (props?.animal_idToFilter && props?.animal_idToFilter !== null) {
              const idToFilter = props?.animal_idToFilter;
              const filteredData = res?.data?.filter(
                (item) => item.animal_id !== idToFilter
              );
              setAnimalData(dataArr.concat(filteredData));
            } else {
              setAnimalData(dataArr.concat(res.data));
            }
          } else {
            if (page == 1) {
              setAnimalData([]);
            }
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);
    getSectionData(1, "");
  }, []);
  const getSectionData = (count, searchText) => {
    setLoading(true);
    var postData = {
      zoo_id: zooID,
      page_no: count,
      q: searchText,
    };
    if (type) {
      postData.sex =
        type == "mother" ? "female" : type == "father" ? "male" : null;
    }
    getSection(postData)
      .then((res) => {
        if (searchText.length > 0) {
          setSectionTypeDataLength(0);
          setSectionTypeData(res.data);
        } else {
          setSearch(false);
          let dataArr = count == 1 ? [] : sectionTypeData;
          setSectionTypeDataLength(res.data.length);
          if (res.data) {
            setSectionTypeData(dataArr.concat(res.data));
          }
        }

        // let dataArr = count == 1 ? [] : sectionTypeData;
        // setSectionTypeDataLength(res.data.length);
        // if (res.data) {
        //   setSectionTypeData(dataArr.concat(res.data));
        // }
      })
      .catch((error) => {
        // errorToast("Oops!", "Something went wrong!!");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleLoadMoreSection = () => {
    if (!Loading && sectionTypeDataLength > 0 && !search) {
      const nextPage = sectionPage + 1;
      setSectionPage(nextPage);
      getSectionData(nextPage, "");
    }
  };

  useEffect(() => {
    setSelectedIds(animalTest?.map((v) => v?.animal_id));
  }, [animalTest]);

  useEffect(() => {
    setEnclosurePage(1);
    getEnclosureData(1, sectionId, "");
  }, [sectionId]);

  const getEnclosureData = (count, sectionId, searchText) => {
    setLoading(true);

    let postData = {
      section_id: sectionId,
      page_no: count,
      q: searchText,
    };
    if (type) {
      postData.sex =
        type == "mother" ? "female" : type == "father" ? "male" : null;
    }
    getEnclosureBySectionId(postData)
      .then((res) => {
        if (searchText.length > 0) {
          setSelectEnclosureDataLength(0);
          setSelectEnclosureData(res?.data?.enclosure_list);
        } else {
          setSearch(false);
          let dataArr = count == 1 ? [] : selectEnclosureData;
          setSelectEnclosureDataLength(res?.data?.enclosure_list?.length);
          if (res?.data?.enclosure_list?.length > 0) {
            setSelectEnclosureData(dataArr.concat(res.data?.enclosure_list));
            selectSectionModalRef.current.close();
          } else {
            if (count == 1) {
              setSelectEnclosureData([]);
              setAnimalData([]);
            }
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleLoadMoreEnclosure = () => {
    if (!Loading && selectEnclosureDataLength > 0 && !search) {
      const nextPage = enclosurePage + 1;
      setEnclosurePage(nextPage);
      getEnclosureData(nextPage, sectionId, "");
    }
  };

  useEffect(() => {
    setSiteData(
      site[0].sites.map((item) => ({
        value: item.site_id,
        label: item.site_name,
      }))
    );
  }, []);

  useEffect(() => {
    searchValue(searchText);
  }, []);

  const searchValue = (query) => {
    let requestObj = {
      zoo_id: zooID,
      searchquery: query,
    };
    searchScientificName(requestObj)
      .then((res) => {
        setSearchData(res.data);
      })
      .catch((error) => {})
      .finally(() => {});
  };

  const backButton = () => {
    navigation.goBack();
  };
  const mergeData = (item) => {
    sectionPressed(item);
    enclosurePressed(item);
    selectAnimalHandler(item);
  };

  const getdetail = (type, id) => {
    setLoading(true);
    QrGetDetails({ type, id })
      .then((res) => {
        if (res.success == true) {
          if (type == "section") {
            sectionPressed(res?.data);
          } else if (type == "enclosure") {
            sectionPressed(res?.data);
            enclosurePressed(res?.data);
          } else if (type == "animal") {
            if (res.data.animal_id == props?.animal_idToFilter) {
              warningToast("Oops!!", "You cannot select same animal.");
            } else {
              if (props.type) {
                if (props?.type == "mother" && res?.data?.sex != "female") {
                  warningToast(
                    "Oops!!",
                    "You cannot select a animal other than female."
                  );
                } else if (
                  props?.type == "father" &&
                  res?.data?.sex != "male"
                ) {
                  warningToast(
                    "Oops!!",
                    "You cannot select a animal other than male."
                  );
                } else {
                  sectionPressed(res?.data);
                  enclosurePressed(res?.data);
                  selectAnimalHandler(res?.data);
                }
              }
            }
          }
        } else {
          setLoading(false);
          warningToast("Oops!!", res.message);
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const QrMergeData = (item) => {
    if (item.type == "section") {
      getdetail(item?.type, item?.section_id);
    } else if (item.type == "enclosure") {
      getdetail(item?.type, item?.enclosure_id);
    } else if (item.type == "animal") {
      getdetail(item?.type, item?.animal_id);
    } else {
      warningToast("Oops!!", "Wrong QR scan!!");
    }
  };

  const gotoSearchScreen = () => {
    Keyboard.dismiss();
    navigation.navigate("AnimalSearchScreen", {
      selectData: (item) => mergeData(item),
      selectQrData: (item) => QrMergeData(item),
      type: type,
      animal_idToFilter: props?.animal_idToFilter,
      selectedOption: "qrscan",
    });
  };

  const hideCard = () => {
    setSectionType("");
    setSectionId(null);
    setSelectEnclosureId(null);
    setSelectEnclosureData([]);
    setSelectEnclosure("");
    setSelectedAnimalName("");
    setAnimalTest([]);
    props.oncloseMoveAnimal([]);
    props.oncloseAnimal();
  };
  const closeAnimalCard = (id) => {
    if (type == "father" || screenName == "MoveAnimal") {
      const filterData = animalTest?.filter((p) => p?.animal_id !== id);
      setAnimalTest(filterData);
      props.oncloseMoveAnimal(filterData);
      props.oncloseAnimal();
    } else {
      setSelectedAnimalName("");
      props.oncloseAnimal();
    }
  };
  const closeCard = () => {
    setSelectEnclosure("");
    setSelectedAnimalName("");
    setSelectEnclosureId(null);
    setSelectedIds([]);
    setAnimalData([]);
    setAnimalTest([]);
    props.oncloseMoveAnimal([]);
    props.oncloseAnimal();
  };

  return (
    <>
      <Loader visible={Loading} />
      <View style={reduxColors.container}>
        <View style={reduxColors.searchbox}>
          <View style={{ width: "100%" }}>
            <TouchableOpacity onPress={() => gotoSearchScreen()}>
              <Searchbar
                mode="bar"
                placeholder="Search Animal"
                // editable={false}
                style={{
                  width: "100%",
                  backgroundColor: constThemeColor.surfaceVariant,
                }}
                onFocus={() => {
                  gotoSearchScreen();
                }}
                icon={(size) => (
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={constThemeColor.onSecondaryContainer}
                  />
                )}
                onIconPress={backButton}
                onSubmitEditing={() => gotoSearchScreen()}
                right={({ size, color }) => (
                  <View
                    style={[
                      reduxColors.rightIcons,
                      { flexDirection: "row", alignItems: "center" },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("LatestCamScanner", {
                          dataSendBack: QrMergeData,
                          screen: props?.screenName,
                        })
                      }
                    >
                      <MaterialIcons
                        name="qr-code"
                        size={24}
                        color={constThemeColor?.primary}
                      />
                    </TouchableOpacity>
                    <MaterialIcons
                      name="search"
                      size={24}
                      style={{
                        margin: 10,
                        color: constThemeColor.neutralPrimary,
                      }}
                      onPress={gotoSearchScreen}
                    />
                  </View>
                )}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={reduxColors.textBox}>
          <Text style={reduxColors.textstyle}>Or choose from</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={reduxColors.dropdownBox}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <TouchableOpacity
            style={[
              reduxColors.boxStyle,
              // {
              //   height: sectionType === "" ? heightPercentageToDP(6.5) : "auto",
              // },
            ]}
            onPress={() => handleSelectSectionModal()}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={reduxColors.selectTextstyle}>Select Section</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                style={styles.arrowIcon}
              />
              {/* <AntDesign
                name={isSecTypeMenuOpen ? "up" : "down"}
                size={16}
                color={constThemeColor.neutralPrimary}
                style={{ marginRight: widthPercentageToDP(2.5) }}
                onPress={() => handleSelectSectionModal()}
              /> */}
            </View>
            <View>
              {sectionType === "" ? null : (
                <Card
                  title={sectionType}
                  style={[reduxColors.cardstyle]}
                  svgUri={true}
                  rightIcon={
                    <MaterialCommunityIcons
                      name="close-circle-outline"
                      size={24}
                      color={constThemeColor.onSurfaceVariant}
                      onPress={hideCard}
                    />
                  }
                />
              )}
            </View>
          </TouchableOpacity>
          {selectEnclosureData.length > 0 ? (
            <TouchableOpacity
              style={[
                reduxColors.boxStyle,
                // { marginTop: heightPercentageToDP(2) },
                // {
                //   height:
                //     selectEnclosure === "" ? heightPercentageToDP(6.5) : "auto",
                // },
              ]}
              onPress={() => handleSelectEnclosureModal()}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  // paddingHorizontal: widthPercentageToDP(1.5),
                  //paddingVertical: Spacing.body,
                }}
              >
                <Text style={reduxColors.selectTextstyle}>
                  Select Enclosure
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  style={styles.arrowIcon}
                />
                {/* <AntDesign
                name={isSelectEnclosure ? "up" : "down"}
                size={16}
                color={constThemeColor.neutralPrimary}
                style={{ marginRight: widthPercentageToDP(2.5) }}
                onPress={() => handleSelectEnclosureModal()}
              /> */}
              </View>
              <View>
                {selectEnclosure === "" ? null : (
                  <Card
                    title={selectEnclosure}
                    style={reduxColors.cardstyle}
                    svgUri={true}
                    rightIcon={
                      <MaterialCommunityIcons
                        name="close-circle-outline"
                        size={24}
                        color={constThemeColor.onSurfaceVariant}
                        onPress={closeCard}
                      />
                    }
                  />
                )}
              </View>
            </TouchableOpacity>
          ) : null}
          {animalData.length > 0 ? (
            <TouchableOpacity
              style={[
                reduxColors.boxStyle,
                // { marginTop: heightPercentageToDP(2) },
                {
                  // height:
                  //   selectedAnimalName == ""
                  //     ? heightPercentageToDP(6.5)
                  //     : "auto",
                  // minHeight: heightPercentageToDP(6.5),
                  // height: "auto",
                },
              ]}
              onPress={() => {
                handleSelectAnimalModal();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  // paddingHorizontal: widthPercentageToDP(1.5),
                  //paddingVertical: Spacing.body,
                }}
              >
                <Text style={reduxColors.selectTextstyle}>Select Animal</Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  style={styles.arrowIcon}
                />
                {/* <AntDesign
                name="down"
                size={16}
                color={constThemeColor.neutralPrimary}
                style={{ marginRight: widthPercentageToDP(2.5) }}
                onPress={() => {
                  handleSelectAnimalModal();
                }}
              /> */}
              </View>
              <View>
                {type == "father" || screenName == "MoveAnimal" ? (
                  animalTest == [] ? null : (
                    selectedAnimalName !== "" &&
                    animalTest?.map((item) => {
                      return (
                        <AnimalCustomCard
                          item={item}
                          animalIdentifier={
                            !item?.local_identifier_value
                              ? item?.animal_id
                              : item?.local_identifier_name
                          }
                          localID={item?.local_identifier_value ?? null}
                          icon={item?.default_icon}
                          enclosureName={item?.user_enclosure_name}
                          animalName={
                            item?.common_name
                              ? item?.common_name
                              : item?.scientific_name
                          }
                          sectionName={item?.section_name}
                          show_specie_details={true}
                          show_housing_details={true}
                          chips={item?.sex}
                          onPress={() => handleSelectAnimalModal()}
                          style={{
                            backgroundColor: selectedIds?.includes(
                              item?.animal_id
                            )
                              ? constThemeColor.secondaryContainer
                              : null,
                            // marginHorizontal: Spacing.body,
                            marginTop: Spacing.small,
                          }}
                          noArrow={true}
                          rightIcon={
                            <MaterialCommunityIcons
                              name="close-circle-outline"
                              size={24}
                              color={constThemeColor.onSurfaceVariant}
                              onPress={() =>
                                closeAnimalCard(selectedAnimal?.animal_id)
                              }
                            />
                          }
                        />
                      );
                    })
                  )
                ) : selectedAnimalName === "" ? null : (
                  <AnimalCustomCard
                    item={selectedAnimal}
                    animalIdentifier={
                      !selectedAnimal?.local_identifier_value
                        ? selectedAnimal?.animal_id
                        : selectedAnimal?.local_identifier_name ?? null
                    }
                    localID={selectedAnimal?.local_identifier_value ?? null}
                    icon={selectedAnimal?.default_icon}
                    enclosureName={selectedAnimal?.user_enclosure_name}
                    animalName={
                      selectedAnimal?.common_name
                        ? selectedAnimal?.common_name
                        : selectedAnimal?.scientific_name
                    }
                    sectionName={selectedAnimal?.section_name}
                    show_specie_details={true}
                    show_housing_details={true}
                    chips={selectedAnimal?.sex}
                    onPress={() => handleSelectAnimalModal()}
                    style={{
                      backgroundColor: constThemeColor.secondaryContainer,
                      // marginHorizontal: Spacing.body,
                      marginTop: Spacing.small,
                    }}
                    noArrow={true}
                    rightIcon={
                      <MaterialCommunityIcons
                        name="close-circle-outline"
                        size={24}
                        color={constThemeColor.onSurfaceVariant}
                        onPress={() =>
                          closeAnimalCard(selectedAnimal?.animal_id)
                        }
                      />
                    }
                  />
                )}
              </View>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>

      <BottomSheetModalComponent ref={selectSectionModalRef}>
        <InsideBottomsheet
          title="Select Section"
          type="section"
          onPress={(item) => sectionPressed(item)}
          data={sectionTypeData}
          handleLoadMore={handleLoadMoreSection}
          handelSearch={handleSearch}
          searchText={searchTextSection}
          selectedIds={sectionId}
          loading={Loading}
        />
      </BottomSheetModalComponent>

      <BottomSheetModalComponent ref={selectEnclosureModalRef}>
        <InsideBottomsheet
          title="Select Enclosure"
          type="enclosure"
          onPress={(item) => enclosurePressed(item)}
          selectEnclosureData={selectEnclosureData}
          handleLoadMore={handleLoadMoreEnclosure}
          handelSearch={handleSearch}
          searchText={searchTextEnclosure}
          selectedIds={selectEnclosureId}
          loading={Loading}
        />
      </BottomSheetModalComponent>

      <BottomSheetModalComponent ref={selectAnimalModalRef}>
        <InsideBottomsheet
          title="Select Animal"
          type="animal"
          onPress={(item) => selectAnimalHandler(item)}
          data={animalData}
          enclosure
          seletedAnimals={animalTest}
          handleLoadMore={handleLoadMore}
          selectedIds={selectedIds}
          closeSheet={closeSheet}
          searchText={searchTextAnimal}
          handelSearch={handleSearch}
          clearSelectedId={clearSelectedId}
          loading={Loading}
        />
      </BottomSheetModalComponent>
    </>
  );
};

export default CommonAnimalSelectComponent;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: reduxColors.onPrimary,
      //padding: Spacing.minor,
      paddingHorizontal: Spacing.minor,
      width: "100%",
    },
    searchbox: {
      marginTop: Spacing.major,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },

    title: {
      fontSize: widthPercentageToDP(4.8),
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      width: "100%",
    },

    subtitle: {
      fontSize: widthPercentageToDP(4.5),
      color: reduxColors.onSurfaceVariant,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontStyle: "italic",
    },
    MBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(2),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.errorContainer,
    },
    BBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(2),
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
    secondItembox: {
      width: widthPercentageToDP(90),
      marginTop: heightPercentageToDP(2),
      flexDirection: "row",
      alignItems: "flex-end",
    },

    dateDropdown: {
      height: heightPercentageToDP(4),
      borderColor: reduxColors.outline,
      borderWidth: widthPercentageToDP(0.2),
      borderRadius: 8,
      marginRight: widthPercentageToDP(2),
      backgroundColor: reduxColors.onPrimary,
      flexDirection: "row",
      alignItems: "center",
      width: "27%",
    },
    collectionsDropdown: {
      width: widthPercentageToDP(30),
      height: heightPercentageToDP(4),
      borderColor: reduxColors.outline,
      borderWidth: widthPercentageToDP(0.2),
      borderRadius: 8,
      fontSize: FontSize?.Antz_Small,
      backgroundColor: reduxColors.onPrimary,
      marginRight: 7,
    },

    siteDropdown: {
      width: widthPercentageToDP(29),
      height: heightPercentageToDP(4),
      borderColor: reduxColors.outline,
      borderWidth: widthPercentageToDP(0.2),
      marginRight: widthPercentageToDP(3),
      borderRadius: 8,
      backgroundColor: reduxColors.onPrimary,
    },
    sitecontainerStyle: {
      width: widthPercentageToDP(26),
      marginRight: 10,
    },
    speciesDropdown: {
      width: widthPercentageToDP(25),
      height: heightPercentageToDP("4.7%"),
      borderColor: reduxColors.neutralSecondary,
      borderWidth: widthPercentageToDP(0.3),
      borderRadius: 8,
      backgroundColor: reduxColors.onPrimary,
    },
    textBox: {
      marginVertical: Spacing.major,
      alignItems: "flex-start",
      width: "100%",
    },

    textstyle: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSecondaryContainer,
    },
    dropdownBox: {
      // marginTop: heightPercentageToDP(2),
      width: "100%",
    },

    placehStyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
    },
    placehStyles: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
      // backgroundColor:'red',
      paddingLeft: widthPercentageToDP(1),
    },

    itemstyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
    },
    footerStyle: {
      position: "absolute",
      bottom: 0,
    },
    boxStyle: {
      width: "100%",
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
      borderRadius: Spacing.small,
      // paddingTop: heightPercentageToDP(1.5),
      backgroundColor: reduxColors.surface,
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.body,
      marginBottom: Spacing.body,
    },

    boxstylesecond: {
      width: widthPercentageToDP(90),
      height: heightPercentageToDP(10),
      flexDirection: "row",
      justifyContent: "space-between",
      borderWidth: 1,
      borderRadius: 4,
      paddingTop: heightPercentageToDP(1.5),
    },
    selectTextstyle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      textAlign: "left",
    },
    cardstyle: {
      borderRadius: Spacing.small,
      //marginVertical: widthPercentageToDP("2%"),

      flexDirection: "row",
      paddingHorizontal: 10,
      paddingVertical: 10,
      alignSelf: "center",
      backgroundColor: reduxColors.secondaryContainer,
      marginTop: Spacing.small,
    },
    modalMaster: {
      flex: 1,
    },

    headerStyle: {
      width: widthPercentageToDP(60),
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginTop: heightPercentageToDP(3),
    },
    headerText: {
      textAlign: "center",
      fontSize: FontSize.Antz_Medium_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },
    modalFirstbox: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: heightPercentageToDP(2),
    },
    //modal search box
    searchBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: reduxColors.onPrimary,
      borderRadius: 8,
      borderWidth: 1,
      // paddingVertical: 8,
      paddingLeft: 12,
      height: 35,
      padding: 5,
      borderColor: reduxColors.onPrimary,
    },
    searchIcon: {
      marginRight: 8,
    },
    input: {
      color: reduxColors.onPrimary,
      width: "30%",
    },
    listofModalStyle: {
      width: widthPercentageToDP(90),
      marginTop: heightPercentageToDP(3),
    },

    modalSearchplaceholderStyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
    },
    tagsContainer: {
      flexDirection: "row",
    },
    tag: {
      backgroundColor: reduxColors.primary,
      borderRadius: 8,
      // paddingVertical: 4,
      paddingHorizontal: 8,
      marginRight: 8,
    },
    malechipText: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      color: reduxColors.onPrimary,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      color: reduxColors.onPrimary,
    },

    // Modal Style

    modalView: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: reduxColors.onPrimary,
      borderRadius: 20,
      paddingTop: 35,
      alignItems: "center",
      borderWidth: 0.7,
      overflow: "hidden",
      marginTop: 50,
      marginBottom: 50,
    },
    MBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(2),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.onSurfaceVariant,
    },
    BBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(2),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.secondary,
    },
    arrowIcon: {},
  });
