import React, { useState, createRef, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Searchbar, Checkbox, ActivityIndicator } from "react-native-paper";
import VoiceText from "../components/VoiceText";
import { AnimalSearchPage } from "../configs/Config";
import Colors from "../configs/Colors";
import {
  AnimalSearch,
  searchCommonName,
  searchEnclosure,
  searchIdentifier,
  searchScientificName,
  searchSection,
  searchSite,
} from "../services/SearchService";
import { useSelector, useDispatch } from "react-redux";
import Category from "../components/DropDownBox";
import Modal from "react-native-modal";
import CustomCard from "../components/CustomCard";
import CustomList from "../components/CustomList";
import { capitalize, opacityColor } from "../utils/Utils";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { log } from "react-native-reanimated";
import BottomSheetModalStyles from "../configs/BottomSheetModalStyles";
import { useToast } from "../configs/ToastConfig";
import FontSize from "../configs/FontSize";
import AnimalCustomCard from "../components/AnimalCustomCard";
import Spacing from "../configs/Spacing";
import ListEmpty from "../components/ListEmpty";
import ModalFilterComponent, {
  ModalTitleData,
} from "../components/ModalFilterComponent";
import MedicalSearchFooter from "../components/MedicalSearchFooter";
import {
  setMedicalAnimal,
  setMedicalEnclosure,
  setMedicalSection,
} from "../redux/MedicalSlice";
import { QrGetDetails } from "../services/staffManagement/addPersonalDetails";

const deviceWidth = Dimensions.get("window").width;

const AnimalSearchScreen = (props) => {
  const dispatch = useDispatch();
  const { successToast, errorToast } = useToast();

  const { height, width } = useWindowDimensions();
  const [searchText, setSearchText] = useState("");
  const [value, setValue] = useState(
    AnimalSearchPage.filter((element) => element.isSelect == true)[0].name
  );
  const { type: gender } = props.route.params || {};
  const [animal_idToFilter, setAnimal_idToFilter] = useState(
    props.route.params?.animal_idToFilter ?? null
  );
  const [selectedOption, setSelectedOption] = useState(
    props.route.params?.selectedOption
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [searchdata, setSearchData] = useState([]);
  const [searchdataLength, setSearchDataLength] = useState([]);
  const [searchTypeID, setSearchTypeID] = useState("");
  const [secrhDropDownOpen, setSecrchDropDownOpen] = useState(false);
  const [apiDataShow, setApiDataShow] = useState(false);
  const navigation = useNavigation();
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const gotoBack = () => navigation.goBack();
  let popUpRef = createRef();
  const searchRef = useRef();

  const [filterData, setFilterData] = useState([]);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [selectCount, setSelectCount] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);
  const [toggleSelectedList] = useState(false);

  const [SelectedAnimal, setSelectedAnimal] = useState([]);
  const [SelectedEnclosure, setSelectedEnclosure] = useState([]);
  const [SelectedSection, setSelectedSection] = useState([]);

  const SelectedAnimalRedux = useSelector((state) => state.medical.animal);
  const SelectedEnclosureRedux = useSelector(
    (state) => state.medical.enclosure
  );
  const SelectedSectionRedux = useSelector((state) => state.medical.section);
  useEffect(() => {
    setSelectedAnimal(SelectedAnimalRedux);
  }, [JSON.stringify(SelectedAnimalRedux)]);
  useEffect(() => {
    setSelectedEnclosure(SelectedEnclosureRedux);
  }, [JSON.stringify(SelectedEnclosureRedux)]);
  useEffect(() => {
    setSelectedSection(SelectedSectionRedux);
  }, [JSON.stringify(SelectedSectionRedux)]);

  const dataSendBack = (item) => {
    if (
      props.route.params?.screenName === "Medical" ||
      props.route.params?.screenName === "Observation" ||
      props.route.params?.screenName === "Transfer"
    ) {
      let animal = selectedAnimals.find((e) => e.animal_id === item.animal_id);
      if (animal) {
        setSelectedAnimals(
          selectedAnimals.filter((e) => e.animal_id !== item.animal_id)
        );
        setCheckedItems(checkedItems.filter((e) => e !== item.animal_id));
        setSelectCount(selectCount - 1);
      } else {
        setSelectedAnimals([
          ...selectedAnimals,
          { ...item, selectType: "animal" },
        ]);
        setCheckedItems([...checkedItems, item.animal_id]);
        setSelectCount(selectCount + 1);
      }
    } else {
      props.route.params?.selectData(item);
      gotoBack();
    }
  };

  const QrMergeData = (item) => {
    if (item.type == "section") {
      getdetail(item?.type, item?.section_id);
    } else if (item.type == "enclosure") {
      getdetail(item?.type, item?.enclosure_id);
    } else if (item.type == "animal") {
      getdetail(item?.type, item?.animal_id);
    }
  };

  const getdetail = (type, id) => {
    setIsLoading(true);
    QrGetDetails({ type, id })
      .then((res) => {
        if (res.success == true) {
          if (type == "animal") {
            const find = SelectedAnimalRedux?.find(
              (p) => p.animal_id == res.data?.animal_id
            );
            if (!find?.animal_id) {
              dispatch(
                setMedicalAnimal([
                  ...SelectedAnimalRedux,
                  { ...res.data, selectType: "animal" },
                ])
              );
            }
            navigation.navigate("AddMedical");
          } else if (type == "enclosure") {
            const enclosureFind = SelectedEnclosureRedux?.find(
              (p) => p.enclosure_id == res.data?.enclosure_id
            );
            if (!enclosureFind?.enclosure_id) {
              dispatch(
                setMedicalEnclosure([
                  ...SelectedEnclosureRedux,
                  { ...res.data, selectType: "enclosure" },
                ])
              );
            }
            navigation.navigate("AddMedical");
          } else if (type == "section") {
            const sectionFind = SelectedSectionRedux?.find(
              (p) => p.section_id == res.data?.section_id
            );
            if (!sectionFind?.section_id) {
              dispatch(
                setMedicalSection([
                  ...SelectedSectionRedux,
                  { ...res.data, selectType: "section" },
                ])
              );
            }
            navigation.navigate("AddMedical");
          }
        } else {
          setIsLoading(false);
          warningToast("Oops!!", res.message);
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const back = () => {
    dispatch(setMedicalAnimal([...SelectedAnimalRedux, ...selectedAnimals]));
    props.route.params?.screenName === "Observation"
      ? navigation.navigate("Observation")
      : navigation.navigate("AddMedical");
  };
  const backToTranfer = () => {
    dispatch(setMedicalAnimal([...SelectedAnimalRedux, ...selectedAnimals]));
    navigation.navigate("MoveAnimal");
  };

  const checkExistingData = (item) => {
    if (SelectedSection.length > 0) {
      let sections = SelectedSection.filter(
        (e) => e.section_id === item.section_id
      );
      if (sections.length > 0) {
        return true;
      }
    }

    if (SelectedEnclosure.length > 0) {
      let enclosures = SelectedEnclosure.filter(
        (e) => e.enclosure_id === item.enclosure_id
      );
      if (enclosures.length > 0) {
        return true;
      }
    }

    if (SelectedAnimal.length > 0) {
      let animals = SelectedAnimal.filter(
        (e) => e.animal_id === item.animal_id
      );
      if (animals.length > 0) {
        return true;
      }
    }

    return false;
  };

  const checkBoxChecking = (item) => {
    if (checkedItems.includes(item.animal_id)) {
      return true;
    } else if (checkExistingData(item)) {
      return true;
    } else {
      return false;
    }
  };

  const List = ({ item }) => {
    return (
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
          item?.common_name ? item?.common_name : item?.scientific_name
        }
        sectionName={item?.section_name}
        show_specie_details={true}
        show_housing_details={true}
        chips={item?.sex}
        onPress={() => dataSendBack(item)}
        style={{
          backgroundColor:
            checkExistingData(item) ||
            (Boolean(parseInt(item?.transfer)) &&
              props.route.params?.screenName === "Transfer")
              ? opacityColor(constThemeColor.onBackground, 50)
              : checkBoxChecking(item)
              ? constThemeColor.onBackground
              : constThemeColor.onPrimary,
          borderRadius: 0,
          marginVertical: 0,
          borderBottomWidth: 0.5,
          borderBottomColor: constThemeColor.outline,
          opacity:
            checkExistingData(item) ||
            (Boolean(parseInt(item?.transfer)) &&
              props.route.params?.screenName === "Transfer")
              ? 0.5
              : 1,
        }}
        noArrow={true}
        checkbox={
          props.route.params?.screenName === "Medical" ||
          props.route.params?.screenName === "Observation" ||
          props.route.params?.screenName === "Transfer"
            ? true
            : false
        }
        checked={checkBoxChecking(item)}
        disable={
          checkExistingData(item) ||
          (Boolean(parseInt(item?.transfer)) &&
            props.route.params?.screenName === "Transfer")
        }
        showInTransit={
          Boolean(parseInt(item?.transfer)) &&
          props.route.params?.screenName === "Transfer"
        }
      />
    );
  };

  useEffect(() => {
    setSearchData([]);
    seterrorMessage("");
    setPage(1);
    const getData = setTimeout(() => {
      searchData(searchText, value, 1);
    }, 1000);

    return () => clearTimeout(getData);
  }, [searchText, value]);

  const searchData = (query, val, page) => {
    let type;
    if (val === "Common Name") {
      type = "common_name";
    } else if (val === "Scientific Name") {
      type = "scientific_name";
    } else if (val === "Identifier") {
      type = "local_id";
    }
    if (query.length >= 3) {
      let requestObj = {
        searchquery: query,
        zoo_id: zooID,
        type: type,
        page_no: page,
        module: props.route.params?.screenName,
        site_id: props.route.params?.site_id ?? "",
      };
      if (gender) {
        gender == "mother" || gender == "m"
          ? (requestObj.gender = "female")
          : gender == "father" || gender == "f"
          ? (requestObj.gender = "male")
          : null;
      }
      setIsLoading(true);
      AnimalSearch(requestObj)
        .then((res) => {
          if (res.data.length > 0) {
            Keyboard.dismiss();
          }
          let dataArr = page == 1 ? [] : searchdata;
          setSearchDataLength(res.data.length);
          if (res.data) {
            if (animal_idToFilter && animal_idToFilter != null) {
              const filteredData = res?.data?.filter(
                (item) => item.animal_id !== animal_idToFilter
              );
              setSearchData(dataArr.concat(filteredData));
            } else {
              setSearchData(dataArr.concat(res.data));
            }
          }
          setApiDataShow(true);
        })
        .catch((error) => errorToast("Oops!", "Something went wrong!!"))
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setApiDataShow(false);
    }
  };

  const onVoiceInput = (text) => {
    setSearchText(text);
  };

  const handleLoadMore = () => {
    if (!isLoading && searchdataLength > 0) {
      let p = page + 1; // increase page by 1
      setPage(p);
      searchData(searchText, value, p); // method for API call
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (isLoading || searchdataLength == 0) return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };

  const acsnClose = () => {
    setSecrchDropDownOpen(false);
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const closeMenu = (item) => {
    setselectedCheckBox(item.id);
    setValue(item.name);
    setSearchScreenModal(!searchScreenModal);
  };
  const [searchScreenModal, setSearchScreenModal] = useState(false);
  const togglePrintModal = () => {
    setSearchScreenModal(!searchScreenModal);
  };
  const closePrintModal = () => {
    setSearchScreenModal(false);
  };
  const [selectedCheckBox, setselectedCheckBox] = useState("1");
  const isSelectedId = (id) => {
    return selectedCheckBox == id;
  };
  return (
    <>
      <View
        style={[
          reduxColors.container,
          { backgroundColor: constThemeColor.onPrimary },
        ]}
      >
        {/* <Loader visible={isLoading} /> */}
        <View>
          <Searchbar
            ref={searchRef}
            placeholder={value === "" ? "Search..." : `Search by ${value}`}
            inputStyle={reduxColors.input}
            onIconPress={gotoBack}
            placeholderTextColor={constThemeColor.onSurfaceVariant}
            style={[
              reduxColors.Searchbar,
              { backgroundColor: constThemeColor.onPrimary },
            ]}
            loading={isLoading}
            onChangeText={(e) => {
              setSearchText(e);
            }}
            value={searchText}
            autoFocus={true}
            icon={({ size, color }) => (
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            )}
            right={() => (
              <View
                style={{
                  marginHorizontal: Spacing.minor,
                  flexDirection: "row",
                }}
              >
                {searchText ? (
                  <AntDesign
                    name="close"
                    size={22}
                    color={constThemeColor.onSurfaceVariant}
                    onPress={() => setSearchText("")}
                    style={{ marginRight: 12, marginLeft: 0 }}
                  />
                ) : null}
                {/* {selectedOption == "qrscan" ? (
                  <TouchableOpacity
                    style={{
                      marginRight: 15,
                    }}
                    onPress={() =>
                      navigation.navigate("LatestCamScanner", {
                        // dataSendBack: props.route.params?.selectQrData,
                        dataSendBack: QrMergeData,
                        screen: props.route.params?.screenName,
                      })
                    }
                  >
                    <MaterialIcons
                      name="qr-code"
                      size={24}
                      color={constThemeColor.primary}
                    />
                  </TouchableOpacity>
                ) : // <Text>dsjfkfd</Text>

                null} */}
                <ModalTitleData toggleModal={togglePrintModal} size={20} />
              </View>
            )}
          />
          {errorMessage ? (
            <Text style={reduxColors.errortext}>{errorMessage}</Text>
          ) : null}
        </View>

        <View style={reduxColors.SearchContainer}>
          {searchdata.length > 0 ? (
            <Text
              style={{
                fontSize: FontSize.Antz_Body_Medium.fontSize,
                fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                color: constThemeColor.onSurfaceVariant,
                marginVertical: Spacing.body,
                marginHorizontal: Spacing.minor,
              }}
            >
              {isLoading === false
                ? searchdata.length + " results in " + value
                : ""}
            </Text>
          ) : (
            ""
          )}
          {searchdata.length > 0 ? (
            <FlatList
              data={searchdata}
              renderItem={List}
              keyExtractor={(item) => item.animal_id}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.4}
              contentContainerStyle={{ paddingBottom: 100 }}
              onEndReached={handleLoadMore}
              ListFooterComponent={renderFooter}
            />
          ) : (
            <>
              {apiDataShow === true ? <ListEmpty visible={isLoading} /> : null}
            </>
          )}
        </View>
        {/* } */}
      </View>
      {searchScreenModal ? (
        <ModalFilterComponent
          onPress={togglePrintModal}
          onDismiss={closePrintModal}
          onBackdropPress={closePrintModal}
          onRequestClose={closePrintModal}
          data={AnimalSearchPage}
          closeModal={closeMenu}
          title="Filter By"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedId}
          radioButton={true}
        />
      ) : null}
      {props.route.params?.screenName === "Medical" ||
      (props.route.params?.screenName === "Observation" && selectCount > 0) ? (
        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <MedicalSearchFooter
            title={"Animal"}
            selectCount={selectCount}
            animalcard={true}
            toggleSelectedList={toggleSelectedList}
            onPress={back}
            selectedItems={selectedAnimals}
            onPressData={dataSendBack}
          />
        </View>
      ) : null}
      {props.route.params?.screenName === "Transfer" && selectCount > 0 ? (
        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <MedicalSearchFooter
            title={"Animal"}
            selectCount={selectCount}
            animalcard={true}
            toggleSelectedList={toggleSelectedList}
            onPress={backToTranfer}
            selectedItems={selectedAnimals}
            onPressData={dataSendBack}
          />
        </View>
      ) : null}
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    errortext: {
      color: reduxColors.error,
      textAlign: "center",
    },
    button: {
      width: "81%",
      borderRadius: 5,
    },
    btnText: {
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      fontSize: FontSize.Antz_Body_Title.fontSize,
    },

    SearchContainer: {
      paddingBottom: 8,
      marginBottom: hp(9),
      marginTop: 10,
    },
    Searchbar: {
      width: "100%",
      borderRadius: 0,
      borderBottomWidth: 0.5,
      borderColor: reduxColors.outlineV,
    },
    fabStyle: {
      margin: 10,
      right: 5,
      bottom: 20,
      width: 45,
      height: 45,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default AnimalSearchScreen;
