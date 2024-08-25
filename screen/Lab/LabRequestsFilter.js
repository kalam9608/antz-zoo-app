/**
 * @React Imports
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  StyleSheet,
} from "react-native";
import { Card, FAB } from "react-native-paper";

/**
 * @Expo Imports
 */
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * @ThirdParty Imports
 */
import { FlatList } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { widthPercentageToDP } from "react-native-responsive-screen";
import moment from "moment";

/**
 * @Custom Imports
 */
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import ListEmpty from "../../components/ListEmpty";
import ModalFilterComponent from "../../components/ModalFilterComponent";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import InputBox from "../../components/InputBox";

/**
 * @Config Imports
 */
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { useToast } from "../../configs/ToastConfig";

/**
 * @Utils Imports
 */
import {
  capitalize,
  dateFormatter,
  ifEmptyValue,
  opacityColor,
} from "../../utils/Utils";

/**
 * @API Imports
 */
import {
  getUserLabsTests,
  getUserLabsTestsStats,
} from "../../services/staffManagement/addPersonalDetails";

const LabRequestsFilter = () => {
  const [labList, setLabList] = useState([]);
  const [labListLength, setLabListLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [fabOpen, setFabOpen] = useState(false);
  const [medicalListModal, setMedicalListModal] = useState(false);
  const [count, setCount] = useState(0);
  const [stats, setStats] = useState();
  const [site_id, setSite_id] = useState(null);
  const [section_id, setSection_id] = useState(null);
  const [doctor_id, setDoctor_id] = useState(null);
  const [class_id, setClass_id] = useState(null);
  const [genus_id, setGenus_id] = useState(null);
  const [species_id, setSpecies_id] = useState(null);
  const [lab_id, setLab_id] = useState(null);
  const [lab_name, setLab_name] = useState(null);
  const [selectedCheckBox, setselectedCheckBox] = useState(1);
  const [type, setType] = useState(null);
  const [step, setStep] = useState(-1);
  const [finalStep, setFinalStep] = useState(false);
  const [filterDays, setFilterDays] = useState("300");
  const [filterTypeData] = useState([
    {
      id: 1,
      type: "pending",
      name: "Pending",
    },
    {
      id: 2,
      type: "completed",
      name: "Completed",
    },
    {
      id: 3,
      type: "all",
      name: "All",
    },
  ]);
  const [filterName, setFilterName] = useState(filterTypeData[0].name);
  const [filterType, setFilterType] = useState(filterTypeData[0].type);
  const [fabIconList, setFabIconList] = useState([]);

  const UserDetails = useSelector((state) => state.UserAuth?.userDetails);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const { errorToast } = useToast();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setPage(1);
      loadData(1, filterType);
      loadStas(filterType);

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [])
  );

  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [step, navigation]);

  useEffect(() => {
    setIsLoading(true);
    setPage(1);
    setFinalStep(false);
    setLabList([]);
    loadData(1, filterType);
    loadStas(filterType);
    if (step == -1) {
      setLab_id(null);
      setLab_name(null);
    }
    let arr = [];
    if (step == -1) {
      arr = [
        {
          icon: "plus",
          label: "Add Lab",
          onPress: () => {
            navigation.navigate("AddLabForm");
          },
        },
        {
          icon: "fence",
          label: "Site",
          onPress: () => {
            handleType("site");
          },
        },
        {
          icon: "doctor",
          label: "Doctor",
          onPress: () => handleType("doctor"),
        },
        {
          icon: "paw",
          label: "Collection ",
          onPress: () => handleType("class"),
        },
        {
          icon: "home",
          label: "Home",
          onPress: () => navigation.navigate("Home"),
        },
      ];
    } else {
      arr = [
        {
          icon: "plus",
          label: "Add Lab",
          onPress: () => {
            navigation.navigate("AddLabForm");
          },
        },
        {
          icon: "home",
          label: "Home",
          onPress: () => navigation.navigate("Home"),
        },
      ];
    }

    setFabIconList(arr);
  }, [step, type]);

  const handleType = (index) => {
    setType(index);
    setStep(1);
  };

  const handleClick = (index) => {
    if (type == "site" && step == 1) {
      setSite_id(index.id);
      setStep(step + 1);
    } else if (type == "site" && step == 2) {
      setSection_id(index.id);
      setStep(step + 1);
    } else if (type == "doctor" && step == 1) {
      setDoctor_id(index.id);
      setStep(step + 1);
    } else if (type == "class" && step == 1) {
      setClass_id(index.id);
      setStep(step + 1);
    } else if (type == "class" && step == 2) {
      setGenus_id(index.id);
      setStep(step + 1);
    } else if (type == "class" && step == 3) {
      setSpecies_id(index.id);
      setStep(step + 1);
    }
  };

  const togglePrintModal = () => {
    setMedicalListModal(!medicalListModal);
  };
  const closePrintModal = () => {
    setMedicalListModal(false);
  };

  const closeMenu = (item) => {
    setselectedCheckBox(item.id);
    setFilterName(item.name);
    setFilterType(item.type);
    setPage(1);
    setIsLoading(true);
    loadData(1, item.type);
    loadStas(filterType);
    closePrintModal();
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(type && step == 1 ? step - 2 : step - 1);
      setType(type && step == 1 ? null : type);
    } else if (step == 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleFilter = () => {
    setPage(1);
    setIsLoading(true);
    loadData(1, filterType);
    loadStas(filterType);
  };

  const onStateChange = ({ open }) => setFabOpen(open);

  const loadData = (pageNo, filter) => {
    let obj = {
      page_no: pageNo,
      filter_type: filter,
      filter_date: moment()
        .subtract(parseInt(filterDays), "days")
        .format("YYYY-MM-DD"),
    };
    if (step == 0 && lab_id) {
      obj.lab_id = lab_id;
    }
    if (step > 0 && type == "site") {
      obj.type = type;
      if (step == 2) {
        obj.site_id = site_id;
      }
      if (step == 3) {
        obj.site_id = site_id;
        obj.section_id = section_id;
        setFinalStep(true);
      }
    } else if (step > 0 && type == "doctor") {
      obj.type = type;
      if (step == 2) {
        obj.doctor_id = doctor_id;
        setFinalStep(true);
      }
    } else if (step > 0 && type == "class") {
      obj.type = "collection";
      if (step == 2) {
        obj.class_id = class_id;
      }
      if (step == 3) {
        obj.class_id = class_id;
        obj.genus_id = genus_id;
      }
      if (step == 4) {
        obj.class_id = class_id;
        obj.genus_id = genus_id;
        obj.species_id = species_id;
        setFinalStep(true);
      }
    }
    getUserLabsTests(obj)
      .then((res) => {
        let dataArr = pageNo == 1 ? [] : labList;
        if (res.data) {
          // if(res.data?.total_count == 1){
          //   setStep(step + 1);
          //   setPage(1);
          //   setIsLoading(true);
          //   loadData(1, filterType);
          //   return;
          // }
          setCount(res.data?.total_count);
          setLabListLength(res.data?.data ? res.data?.data?.length : 0);
          setLabList(dataArr.concat(res.data?.data));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        errorToast("error", "Oops! Something went wrong!!");
        setIsLoading(false);
      });
  };

  const loadStas = (filter) => {
    setIsStatsLoading(true);
    let obj = {
      filter_type: filter,
      filter_date: moment()
        .subtract(parseInt(filterDays), "days")
        .format("YYYY-MM-DD"),
    };
    if (step == 0 && lab_id) {
      obj.lab_id = lab_id;
    }
    if (step > 0 && type == "site") {
      obj.type = type;
      if (step == 2) {
        obj.site_id = site_id;
      }
      if (step == 3) {
        obj.site_id = site_id;
        obj.section_id = section_id;
        setFinalStep(true);
      }
    } else if (step > 0 && type == "doctor") {
      obj.type = type;
      if (step == 2) {
        obj.doctor_id = doctor_id;
        setFinalStep(true);
      }
    } else if (step > 0 && type == "class") {
      obj.type = "collection";
      if (step == 2) {
        obj.class_id = class_id;
      }
      if (step == 3) {
        obj.class_id = class_id;
        obj.genus_id = genus_id;
      }
      if (step == 4) {
        obj.class_id = class_id;
        obj.genus_id = genus_id;
        obj.species_id = species_id;
        setFinalStep(true);
      }
    }
    getUserLabsTestsStats(obj)
      .then((res) => {
        if (res.data) {
          setStats(res.data[0]);
        }
        setIsStatsLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        errorToast("error", "Oops! Something went wrong!!");
        setIsStatsLoading(false);
      });
  };

  const renderFooter = () => {
    if (isLoading || labListLength < 10 || labListLength == count) {
      return null;
    }
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };

  const handleLoadMore = () => {
    if (!isLoading && labListLength > 0 && labListLength != count) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, filterType);
    }
  };

  const isSelectedId = (id) => {
    return selectedCheckBox == id;
  };

  const renderItem = ({ item }) => {
    if (step == -1) {
      return (
        <Card
          style={reduxColors.card}
          elevation={0}
          onPress={() => {
            setLab_id(item.id);
            setLab_name(item.name);
            setStep(step + 1);
          }}
        >
          <Card.Content>
            <View style={[reduxColors.cardContentRow, { width: "100%" }]}>
              <View style={{ width: "70%" }}>
                <Text style={reduxColors.cardContentTitle}>
                  {ifEmptyValue(item.name)}
                </Text>
              </View>
              <View style={reduxColors.cardContentCountContainer}>
                <Text style={reduxColors.cardContentCountText}>
                  {item.request_count}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      );
    } else if (finalStep || !type) {
      return (
        <Card style={reduxColors.card} elevation={0}>
          <Card.Content>
            <View style={[reduxColors.cardContentRow, { width: "100%" }]}>
              <View style={{ width: "70%" }}>
                <Text style={reduxColors.cardContentTitle}>{item.id}</Text>

                <Text style={reduxColors.cardContentTitle}>
                  {dateFormatter(item.created_at)}
                </Text>
                <AnimalCustomCard
                  item={item}
                  animalIdentifier={
                    !item?.animal_details?.local_identifier_value
                      ? item?.animal_details?.animal_id
                      : item?.animal_details?.local_identifier_name
                  }
                  localID={item?.animal_details?.local_identifier_value ?? null}
                  icon={item?.animal_details?.default_icon}
                  enclosureName={item?.animal_details?.user_enclosure_name}
                  animalName={
                    item?.animal_details?.default_common_name
                      ? item?.animal_details?.default_common_name
                      : item?.animal_details?.scientific_name
                  }
                  style={{
                    backgroundColor: constThemeColor.displaybgPrimary,
                    margin: 0,
                    padding: 0,
                    paddingTop: Spacing.small,
                  }}
                  sectionName={item?.animal_details?.user_section_name}
                  show_specie_details={true}
                  show_housing_details={true}
                  chips={item?.animal_details?.sex}
                  noArrow={true}
                />
                <Text style={reduxColors.cardContentTitle}>
                  {item?.created_by_name}
                </Text>
              </View>
              <View style={reduxColors.cardContentCountContainer}>
                <Text style={reduxColors.cardContentCountText}>
                  {item.completed_test_count}
                </Text>
                <MaterialCommunityIcons
                  name="slash-forward"
                  size={18}
                  color={constThemeColor.onSecondaryContainer}
                />
                <Text style={reduxColors.cardContentCountText}>
                  {item.test_count}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      );
    } else {
      return (
        <Card
          style={reduxColors.card}
          elevation={0}
          onPress={() => handleClick(item)}
        >
          <Card.Content>
            <View style={[reduxColors.cardContentRow, { width: "100%" }]}>
              <View style={{ width: "70%" }}>
                <Text style={reduxColors.cardContentTitle}>
                  {ifEmptyValue(item.name)}
                </Text>
              </View>
              <View style={reduxColors.cardContentCountContainer}>
                <Text style={reduxColors.cardContentCountText}>
                  {item.request_count}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      );
    }
  };

  return (
    <View style={reduxColors.container}>
      <Loader visible={isLoading} />
      <Header
        title={
          step != 0 ? UserDetails.user_first_name + "'s Lab Request" : lab_name
        }
        noIcon={true}
        backgroundColor={constThemeColor?.onPrimary}
        hideMenu={true}
        customBack={() => handleBack(step)}
      />
      <View style={reduxColors.textbox}>
        <Text style={reduxColors.textStyle}>Show records for </Text>
        <InputBox
          inputLabel={null}
          placeholder={null}
          style={{
            height: 35,
            maxWidth: widthPercentageToDP(50),
          }}
          keyboardType="numeric"
          value={filterDays}
          onChange={(text) => {
            setFilterDays(text);
          }}
          handleBlur={handleFilter}
          onSubmitEditing={handleFilter}
        />
        <Text style={reduxColors.textStyle}> days</Text>
      </View>

      <View style={reduxColors.statusCustomStyle}>
        <InputBox
          inputLabel={"Status"}
          value={filterName}
          onFocus={togglePrintModal}
          rightElement={medicalListModal ? "menu-up" : "menu-down"}
          DropDown={togglePrintModal}
        />
      </View>

      <View
        style={[
          reduxColors.cardContainer,
          {
            backgroundColor: "transparent",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: opacityColor(constThemeColor.onSecondaryContainer, 50),
          },
        ]}
      >
        <View style={reduxColors.dataContainer}>
          <View style={reduxColors.dataRow}>
            <Text style={reduxColors.cardNumberTitle}>7+ days</Text>
            {isStatsLoading ? (
              <ActivityIndicator
                style={{ marginTop: Spacing.small }}
                color={constThemeColor.primary}
                size={24}
              />
            ) : (
              <Text style={reduxColors.cardNumber}>
                {stats?.seven_days_count ?? 0}
              </Text>
            )}
          </View>
          <View style={reduxColors.dataRow}>
            <Text style={reduxColors.cardNumberTitle}>3 days</Text>
            {isStatsLoading ? (
              <ActivityIndicator
                style={{ marginTop: Spacing.small }}
                color={constThemeColor.primary}
                size={24}
              />
            ) : (
              <Text style={reduxColors.cardNumber}>
                {stats?.three_days_count ?? 0}
              </Text>
            )}
          </View>
          <View style={reduxColors.dataRow}>
            <Text style={reduxColors.cardNumberTitle}>Today</Text>
            {isStatsLoading ? (
              <ActivityIndicator
                style={{ marginTop: Spacing.small }}
                color={constThemeColor.primary}
                size={24}
              />
            ) : (
              <Text style={reduxColors.cardNumber}>
                {stats?.today_count ?? 0}
              </Text>
            )}
          </View>
          <View style={reduxColors.dataRow}>
            <Text style={reduxColors.cardNumberTitle}>Total</Text>
            {isStatsLoading ? (
              <ActivityIndicator
                style={{ marginTop: Spacing.small }}
                color={constThemeColor.primary}
                size={24}
              />
            ) : (
              <Text style={reduxColors.cardNumber}>
                {stats?.total_count ?? 0}
              </Text>
            )}
          </View>
        </View>
      </View>
      {type ? (
        <View style={reduxColors.textbox}>
          {/* <Text
            onPress={() => setStep(-1)}
            style={[
              reduxColors.textStyle,
              step > -1 && {
                color: constThemeColor.skyblue,
                textDecorationLine: "underline",
              },
            ]}
          >
            Labs
          </Text>
          <MaterialCommunityIcons
            name="slash-forward"
            size={18}
            color={constThemeColor.onSecondaryContainer}
          /> */}
          <Text
            onPress={() => setStep(1)}
            style={[
              reduxColors.textStyle,
              step > 1 && {
                color: constThemeColor.skyblue,
                textDecorationLine: "underline",
              },
            ]}
          >
            {capitalize(type)}
          </Text>
          {type == "site" && step > 1 && (
            <>
              <MaterialCommunityIcons
                name="slash-forward"
                size={18}
                color={constThemeColor.onSecondaryContainer}
              />
              <Text
                onPress={() => setStep(2)}
                style={[
                  reduxColors.textStyle,
                  step > 2 && {
                    color: constThemeColor.skyblue,
                    textDecorationLine: "underline",
                  },
                ]}
              >
                Section
              </Text>
            </>
          )}
          {type == "class" && step > 1 && (
            <>
              <MaterialCommunityIcons
                name="slash-forward"
                size={18}
                color={constThemeColor.onSecondaryContainer}
              />
              <Text
                onPress={() => setStep(2)}
                style={[
                  reduxColors.textStyle,
                  step > 2 && {
                    color: constThemeColor.skyblue,
                    textDecorationLine: "underline",
                  },
                ]}
              >
                Genus
              </Text>
            </>
          )}
          {type == "class" && step > 2 && (
            <>
              <MaterialCommunityIcons
                name="slash-forward"
                size={18}
                color={constThemeColor.onSecondaryContainer}
              />
              <Text
                onPress={() => setStep(3)}
                style={[
                  reduxColors.textStyle,
                  step > 3 && {
                    color: constThemeColor.skyblue,
                    textDecorationLine: "underline",
                  },
                ]}
              >
                Species
              </Text>
            </>
          )}
          {(finalStep || !type) && (
            <>
              <MaterialCommunityIcons
                name="slash-forward"
                size={18}
                color={constThemeColor.onSecondaryContainer}
              />
              <Text style={reduxColors.textStyle}>Lab Requests</Text>
            </>
          )}
        </View>
      ) : (
        <View style={reduxColors.textbox}>
          <Text
            onPress={() => setStep(-1)}
            style={[
              reduxColors.textStyle,
              step == 0 && {
                color: constThemeColor.skyblue,
                textDecorationLine: "underline",
              },
            ]}
          >
            Labs
          </Text>
          {step == 0 && (
            <>
              <MaterialCommunityIcons
                name="slash-forward"
                size={18}
                color={constThemeColor.onSecondaryContainer}
              />
              <Text style={reduxColors.textStyle}>Lab Requests</Text>
            </>
          )}
        </View>
      )}
      <FlatList
        data={labList}
        contentContainerStyle={{
          paddingBottom: Spacing.major + Spacing.body,
        }}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={<ListEmpty visible={isLoading} />}
        ListFooterComponent={renderFooter}
      />

      <FAB.Group
        open={fabOpen}
        fabStyle={reduxColors.fabStyle}
        visible
        icon={fabOpen ? "close-circle-outline" : "dots-horizontal"}
        actions={fabIconList}
        onStateChange={onStateChange}
        onPress={() => {
          if (fabOpen) {
          }
        }}
      />

      {medicalListModal ? (
        <ModalFilterComponent
          onPress={togglePrintModal}
          onDismiss={closePrintModal}
          onBackdropPress={closePrintModal}
          onRequestClose={closePrintModal}
          data={filterTypeData}
          closeModal={closeMenu}
          title="Select Status"
          style={{ alignItems: "flex-start" }}
          isSelectedId={isSelectedId}
          radioButton={true}
        />
      ) : null}
    </View>
  );
};

export default LabRequestsFilter;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    textbox: {
      marginVertical: Spacing.small,
      marginHorizontal: Spacing.small,
      alignItems: "center",
      flexDirection: "row",
    },
    textStyle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    statusTextStyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors?.onPrimaryContainer,
    },
    statusCustomStyle: {
      marginVertical: Spacing.small,
      marginHorizontal: Spacing.small,
    },
    statusIconStyle: {
      marginLeft: Spacing.small,
      marginTop: Spacing.micro,
      color: reduxColors?.onSurface,
    },
    cardContainer: {
      backgroundColor: reduxColors.surface,
      padding: 5,
      marginHorizontal: Spacing.small,
      marginVertical: Spacing.small,
    },
    dataContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      bottom: 10,
      marginTop: 20,
      minHeight: 80,
    },
    dataRow: {
      alignItems: "center",
    },

    cardNumber: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      color: reduxColors.onSecondaryContainer,
    },
    cardNumberTitle: {
      fontSize: FontSize.Antz_Major_Title_btn.fontSize,
      fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
      color: reduxColors.primary,
    },
    dataRow: {
      alignItems: "center",
    },
    dropdown: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onPrimary,
      paddingLeft: 20,
    },
    card: {
      // marginHorizontal: "4%",
      marginHorizontal: Spacing.minor,
      marginVertical: Spacing.small,
      backgroundColor: reduxColors.displaybgPrimary,
    },
    cardContentRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cardContentTitle: {
      color: reduxColors.onSecondaryContainer,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    },
    cardContentCountText: {
      color: reduxColors.onSecondaryContainer,
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
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
    cardContentCountContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "30%",
      justifyContent: "flex-end",
    },
  });
