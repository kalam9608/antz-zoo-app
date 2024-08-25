import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  RefreshControl,
  Animated,
  Platform
} from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { SvgXml } from "react-native-svg";
import { AntDesign, Feather, Ionicons, Entypo } from "@expo/vector-icons";
import * as Device from "expo-device";
import { DeviceType } from "expo-device";
import moment from "moment";
import { AssessmentModal } from "../../components/Assessment/AssessmentModalComponent";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import {
  getAssessmentAnimalTypeList,
  updateAssessmentCategory,
  addAssessmentCategory,
} from "../../services/assessmentService/AssessmentServiceApi";
import ListEmpty from "../../components/ListEmpty";
import {
  getMeasurmentUnit,
  getMeasurmentListUnit,
} from "../../services/AnimalService";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { getAsyncData } from "../../utils/AsyncStorageHelper";
import { debounce } from "lodash";

//SVG
import Add from "../../assets/Add.svg";
import Filter from "../../assets/Filter.svg";
import Search from "../../assets/Search.svg";
import ActiveSearch from "../../assets/ActiveSearch.svg";
import Loader from "../../components/Loader";

export const AssessmentInfo = ({
  typeCount,
  filterCount,
  animalId,
  animalDetails,
  tabName,
}) => {
  let screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = Styles(themeColors);
  const isTab = Device.deviceType === DeviceType.TABLET;
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentListIndex, setCurrentListIndex] = useState(0);
  const [currentNumericScaleIndex, setCurrentNumericScaleIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState("");
  const [listModalData, setListModalData] = useState([]);
  const [dateValue, setDateValue] = useState(new Date());
  const [dateModal, setDateModal] = useState(false);
  const [timeValue, setTimeValue] = useState(new Date().getTime());
  const [timeModal, setTimeModal] = useState(false);
  const [responseTextInput, setResponseTextInput] = useState("");
  const [addResponseTextInput, setAddResponseTextInput] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [addNumericValue, setAddNumericValue] = useState("");
  const [numericValue, setNumericValue] = useState("");
  const [unitValue, setUnitValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentList, setAssessmentList] = useState([]);
  const [filterCategoryAssessmentList, setFilterCategoryAssessmentList] =
    useState([]);
  const [filterTypeAssessmentList, setFilterTypeAssessmentList] = useState([]);
  const [assessmentCategoryList, setAssessmentCategoryList] = useState([]);
  const [assessmentTypeList, setAssessmentTypeList] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [searchAssessmentListType, setSearchAssessmentListType] = useState("");
  const [animalAssessmentId, setAnimalAssesementId] = useState("");
  const [animalAssessmentValue, setAnimalAssessmentValue] = useState("");
  const [fromAddIcon, setFromAddIcon] = useState(false);
  const [isTypeFilter, setIsTypeFilter] = useState(false);
  const [finalFilterAssessment, setFinalFilterAssessment] = useState([]);
  const [searchFilterData, setSearchFilterData] = useState([]);
  const [selectedListData, setSelectedListData] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [onPressSelectedItem, setOnPressSelectedItem] = useState("");
  const [isResponseTrue, setIsResponseTrue] = useState(false);
  const [noData, setNoData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [userId, setUserId] = useState("");
  const [animation] = useState(new Animated.Value(0));
  const [assessmentDetail, setAssessmentDetail] = useState("");
  const [measurementListUnit, setMeasurementList] = useState([]);
  const [assementItem, setAssessmentItem] = useState("")

  const assessmentCategoryListRef = useRef(null);
  const flatListListRef = useRef(null);
  const flatListNumericScaleRef = useRef(null);
  const flatListResponseTextRef = useRef(null);

  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "sec",
      ss: "%dsec",
      m: "a min",
      mm: "%dmin",
      h: "an hr",
      hh: "%dh",
      d: "a day",
      dd: "%dd",
      w: "a week",
      ww: "%d weeks",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years",
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      if (tabName == "Assessment") {
        setIsLoading(true);
        fetchAssessmentAnimalTypeList();
        fetchUserId();
        fetchMeasurementUnitList();
        setFilterCategoryAssessmentList([])
        assessmentCategoryListRef?.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    }, [tabName])
  );

  useEffect(() => {
    const changeListener = Dimensions.addEventListener(
      "change",
      updateOrientation
    );
    return () => {
      if (changeListener) {
        changeListener.remove();
      }
    };
  }, []);

  const fetchUserId = async () => {
    const userInfo = await getAsyncData("@antz_user_data");
    setUserId(userInfo?.user?.user_id);
  };

  const fetchAssessmentAnimalTypeList = (response) => {
    getAssessmentAnimalTypeList(animalId)
      .then((res) => {
        if (res?.success) {
          const data = res?.data;
          setAssessmentList(data);
          setSelectedIndexes(Array.from({ length: data.length }, () => 0));
          if (response) {
            const filter = data?.filter(item=> item?.assessment_category_id == assementItem?.id)
            setFilterCategoryAssessmentList(filter)
          } else {
            const assementCategoryNameList = [
              ...new Set(data.map((item) => item?.assessment_category_name)),
            ];
            const assementCategoryIdList = [
              ...new Set(data.map((item) => item?.assessment_category_id)),
            ];

            let assementCategoryObjectList = assementCategoryNameList.map(
              (name, index) => ({
                name: name,
                id: assementCategoryIdList[index],
              })
            );

            const assementTypeNameList = [
              ...new Set(data.map((item) => item?.assessment_name)),
            ];
            const assementTypeIdList = [
              ...new Set(data.map((item) => item?.assessment_type_id)),
            ];

            let assementTypeObjectList = assementTypeNameList.map(
              (name, index) => ({
                name: name,
                id: assementTypeIdList[index],
              })
            );

            assementCategoryObjectList.unshift({
              name: "All",
              id: "All",
              isSelected: true,
            });

            setAssessmentCategoryList(assementCategoryObjectList);
            setAssessmentTypeList(assementTypeObjectList);
          }
        }
      })
      .catch((e) => {
        //errorToast("error", "Something went wrong");
        setIsLoading(false);
        setRefreshing(false);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const fetchMeasurementUnitList = () => {
    getMeasurmentListUnit()
      .then((res) => {
        if (res?.success) {
          setMeasurementList(res?.data);
        }
      })
      .catch((e) => {
        //errorToast("error", "Something went wrong");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateOrientation = () => {
    screenWidth = Dimensions.get("window").width;
    setSelectedIndexes(Array.from({ length: assessmentList.length }, () => 0));

    flatListListRef?.current?.scrollToIndex({
      index: 0,
      animated: true,
    });

    flatListNumericScaleRef?.current?.scrollToIndex({
      index: 0,
      animated: true,
    });

    flatListResponseTextRef?.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  };

  const toggleDropDown = () => {
    setIsSearch(!isSearch);
    Animated.timing(animation, {
      toValue: isSearch ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const dropdownHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  const renderAssessmentTypes = (item, index) => (
    <View>
      {item?.isSelected && (
        <TouchableOpacity
          key={index}
          style={[
            reduxColors.filteredItemContainer,
            {
              marginRight:
                index === assessmentCategoryList?.length - 1 ? 16 : 0,
            },
          ]}
        >
          <Text
            style={[
              reduxColors.regularText,
              { color: themeColors.onPrimaryContainer },
            ]}
          >
            {item?.name}
          </Text>
          <TouchableOpacity
            style={{ marginLeft: Spacing.small }}
            onPress={() => onAssessmnetTypePressHandler(item, index)}
          >
            <AntDesign name="close" size={16} color={themeColors?.onSurface} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAssessmentCategories = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[
        reduxColors.filterItemContainer,
        {
          marginRight:
            index === assessmentCategoryList?.length - 1 ? Spacing.minor : 0,
          backgroundColor: item?.isSelected
            ? themeColors?.onPrimaryContainer
            : themeColors?.displaybgSecondary,
        },
      ]}
      onPress={() => onAssessmnetCategoryPressHandler(item, index)}
    >
      <Text
        style={[
          reduxColors.regularText,
          {
            color: item?.isSelected
              ? themeColors?.onPrimary
              : themeColors.onPrimaryContainer,
          },
        ]}
      >
        {item?.name}
      </Text>
    </TouchableOpacity>
  );

  const renderListResponseType = (
    item,
    index,
    parentData,
    parent,
    parentIndex
  ) => {
    let concateTime = item?.record_date + " " + item?.record_time;
    let time = moment(concateTime).fromNow();
    const convertedDate = moment(
      item?.record_date,
      "YYYY-MM-DD HH:mm:ss"
    ).toISOString();
    const convertedTime = moment(item?.record_time, "HH:mm:ss").valueOf();

    return (
      <TouchableOpacity
        style={{
          flex: 1,
          width: screenWidth - 56,
          opacity: selectedIndexes[parentIndex] === index ? 1 : 0.1,
          // width: isTab ? windowDimension * 0.945 : windowDimension * 0.855,
        }}
        activeOpacity={0.5}
        onPress={() => {
          setOnPressSelectedItem(item);
          setIsModalOpen(true), setModalData(parent);
          setAnimalAssesementId(item?.assessment_id);
          setAnimalAssessmentValue(item?.assessment_value);
          setAddNotes(item?.comments);
          setDateValue(convertedDate);
          setTimeValue(convertedTime);
          setAssessmentDetail(item);
        }}
      >
        <Text
          style={[
            reduxColors.mediumText,
            {
              color: themeColors.onSecondaryContainer,
              lineHeight: 20,
              height: 45,
            },
          ]}
          numberOfLines={2}
        >
          {item?.asssessment_label}
        </Text>

        <View style={reduxColors.dateDotWrapper}>
          <Text
            style={[
              reduxColors.microRegularText,
              { color: themeColors.onSecondaryContainer },
            ]}
          >
            {time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNumericScaleResponseType = (
    item,
    index,
    parentData,
    parent,
    parentIndex
  ) => {
    let concateTime = item?.record_date + " " + item?.record_time;
    const convertedDate = moment(
      item?.record_date,
      "YYYY-MM-DD HH:mm:ss"
    ).toISOString();
    const convertedTime = moment(item?.record_time, "HH:mm:ss").valueOf();

    let time = moment(concateTime).fromNow();
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          setOnPressSelectedItem(item);
          setIsModalOpen(true), setModalData(parent);
          setAnimalAssesementId(item?.assessment_id);
          setAnimalAssessmentValue(item?.assessment_value);
          setAddNotes(item?.comments);
          setDateValue(convertedDate);
          setTimeValue(convertedTime);
          setAssessmentDetail(item);
        }}
        style={{
          flex: 1,
          width: screenWidth - 56,
          opacity: selectedIndexes[parentIndex] === index ? 1 : 0.1,
        }}
      >
        <Text
          style={[
            reduxColors.mediumText,
            {
              color: themeColors.onSecondaryContainer,
              lineHeight: 20,
              height: 45,
            },
          ]}
          numberOfLines={2}
        >
          {item?.asssessment_label}
        </Text>
        <View style={reduxColors.dateDotWrapper}>
          <Text
            style={[
              reduxColors.microRegularText,
              { color: themeColors.onSecondaryContainer },
            ]}
          >
            {time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTextResponseType = (
    item,
    index,
    parentData,
    parent,
    parentIndex
  ) => {
    let concateTime = item?.record_date + " " + item?.record_time;
    let time = moment(concateTime).fromNow();
    const convertedDate = moment(
      item?.record_date,
      "YYYY-MM-DD HH:mm:ss"
    ).toISOString();
    const convertedTime = moment(item?.record_time, "HH:mm:ss").valueOf();

    return (
      <TouchableOpacity
        style={{
          flex: 1,
          width: screenWidth - 56,
          opacity: selectedIndexes[parentIndex] === index ? 1 : 0.1,
        }}
        activeOpacity={0.5}
        onPress={() => {
          setOnPressSelectedItem(item);
          setIsModalOpen(true), setModalData(parent);
          setAnimalAssesementId(item?.assessment_id);
          setResponseTextInput(item?.assessment_value);
          setAddNotes(item?.comments);
          setDateValue(convertedDate);
          setTimeValue(convertedTime);
          setAssessmentDetail(item);
        }}
      >
        <Text
          style={[
            reduxColors.mediumText,
            {
              color: themeColors.onSecondaryContainer,
              lineHeight: 20,
              height: 45,
            },
          ]}
          numberOfLines={2}
        >
          {item?.assessment_value}
        </Text>
        <View style={reduxColors.dateDotWrapper}>
          <Text
            style={[
              reduxColors.microRegularText,
              { color: themeColors.onSecondaryContainer },
            ]}
          >
            {time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNumericValueResponseType = (item, index, parentData) => {
    let concateTime = item?.record_date + " " + item?.record_time;
    let time = moment(concateTime).fromNow();
    const convertedDate = moment(
      item?.record_date,
      "YYYY-MM-DD HH:mm:ss"
    ).toISOString();
    const convertedTime = moment(item?.record_time, "HH:mm:ss").valueOf();

    const isLastItem =
      index === parentData?.assessment_values?.length - 1 || index === 0;

    let unitAbbr = "";

    const unit = measurementListUnit.find(
      (unit) => unit?.id == item?.assessment_unit_id
    );
    if (unit) {
      unitAbbr = unit.uom_abbr;
    }

    return (
      <View
        style={[
          reduxColors.numericValueContainer,
          {
            borderRightWidth: isLastItem ? 0 : 1,
            paddingHorizontal: index === 0 ? 0 : Spacing.minor,
          },
        ]}
      >
        {index !== 0 && (
          <View>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                setIsModalOpen(true), setNumericValue(item?.assessment_value);
                setUnitValue(item?.assessment_unit_id);
                setModalData(parentData);
                setAnimalAssesementId(item?.assessment_id);
                setAddNotes(item?.comments);
                setDateValue(convertedDate);
                setTimeValue(convertedTime);
                setAssessmentDetail(item);
              }}
            >
              <Text
                style={[
                  reduxColors?.majorText,
                  {
                    color: themeColors?.outline,
                  },
                ]}
              >
                {item?.assessment_value}
              </Text>
              <Text
                style={[
                  reduxColors.mediumText,
                  {
                    marginTop: 8,
                    marginLeft: 2.5,
                    color: themeColors?.outline,
                  },
                ]}
              >
                {unitAbbr ? unitAbbr : ""}
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                reduxColors.regularText,
                {
                  color: themeColors?.onSecondaryContainer,
                  marginTop: Spacing.mini,
                },
              ]}
            >
              {time}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderDotIndicator = (parentItem, parentIndex) => (
    <View>
      {parentItem?.assessment_values?.length > 1 && (
        <View
          style={[
            reduxColors.dotContainer,
            { position: "absolute", right: 0, top: -Spacing.subMajor },
          ]}
        >
          {parentItem?.assessment_values?.map((item, index) => {
            return (
              <View
                key={item._id}
                style={[
                  reduxColors.dotStyle,
                  {
                    backgroundColor:
                      selectedIndexes[parentIndex] === index
                        ? themeColors?.outline
                        : themeColors?.blackWithPointFive,
                    opacity: selectedIndexes[parentIndex] === index ? 1 : 0.1,
                  },
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );

  const renderSubCategory = (parentItem, parentIndex) => {
    return (
      <View
        style={[
          reduxColors?.subCategoryItemContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        {/* Card Header  */}
        <TouchableOpacity
          style={[
            reduxColors?.subCategoryHeaderContainer,
            {
              backgroundColor: themeColors.secondaryContainer,
              paddingHorizontal: Spacing.body,
            },
          ]}
          onPress={() =>
            navigation.navigate("AssessmentSummary", {
              animalDetails: animalDetails,
              parentItem: parentItem,
              subCategory: assessmentList,
              index: assessmentList?.findIndex(
                (item) =>
                  item?.assessment_type_id === parentItem?.assessment_type_id
              ),
            })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    reduxColors.title,
                    {
                      color: themeColors.onSecondaryContainer,
                    },
                  ]}
                >
                  {parentItem?.assessment_name}
                </Text>
                <Feather
                  name="chevron-right"
                  size={23}
                  color={themeColors.onSecondaryContainer}
                />
              </View>
              <Text style={[reduxColors.subRegularText]}>
                {parentItem?.assessment_category_name}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                setIsModalOpen(true),
                  setModalData(parentItem),
                  setFromAddIcon(true);
                if (
                  parentItem?.responseType === "Numeric Scale" ||
                  parentItem?.responseType === "List"
                ) {
                  setListModalData(parentItem?.data);
                }
              }}
            >
              <Ionicons
                name="add-circle-outline"
                size={30}
                color={themeColors.skyblue}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Card Body  */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            //paddingVertical: Spacing.small,
            paddingHorizontal: Spacing.body,
            width: "100%",
            height: 80,
          }}
        >
          {parentItem?.assessment_values?.length === 0 ? (
            <View style={{ width: "50%" }}>
              <TouchableOpacity
                activeOpacity={userId !== parentItem?.created_by ? 0.9 : 0.5}
                style={[reduxColors.addContainer]}
                onPress={() => {
                  setIsModalOpen(true),
                  setModalData(parentItem),
                  setFromAddIcon(true);
                if (
                  parentItem?.responseType === "Numeric Scale" ||
                  parentItem?.responseType === "List"
                ) {
                  setListModalData(parentItem?.data);
                }
                }}
              >
                <Text
                  style={[
                    reduxColors.regularText,
                    { color: themeColors?.onSurface },
                  ]}
                >
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          ) : parentItem?.response_type === "list" ? (
            <View style={{ flex: 1 }}>
              <FlatList
                ref={flatListListRef}
                data={parentItem?.assessment_values}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) =>
                  renderListResponseType(
                    item,
                    index,
                    parentItem?.assessment_values,
                    parentItem,
                    parentIndex
                  )
                }
                // onMomentumScrollEnd={(e) => {
                //   const value = screenWidth - 56;
                //   const offsetX = e.nativeEvent.contentOffset.x;
                //   const selectedIndex = Math.round(offsetX / value);
                //   setSelectedIndexes((prevIndexes) => {
                //     const newIndexes = [...prevIndexes];
                //     newIndexes[parentIndex] = selectedIndex;
                //     return newIndexes;
                //   });
                // }}
                onScroll={(e) => {
                  const value = screenWidth - 56;
                  const offsetX = e.nativeEvent.contentOffset.x;
                  const selectedIndex = Math.round(offsetX / value);
                  setSelectedIndexes((prevIndexes) => {
                    const newIndexes = [...prevIndexes];
                    newIndexes[parentIndex] = selectedIndex;
                    return newIndexes;
                  });
                }}
              />
              {renderDotIndicator(parentItem, parentIndex)}
            </View>
          ) : parentItem?.response_type === "numeric_scale" ? (
            <View>
              <FlatList
                //ref={opacityRef}
                data={parentItem?.assessment_values}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                nestedScrollEnabled
                renderItem={({ item, index }) =>
                  renderNumericScaleResponseType(
                    item,
                    index,
                    parentItem?.assessment_values,
                    parentItem,
                    parentIndex
                  )
                }
                // onMomentumScrollEnd={(e) => {
                //   const value = screenWidth - 56;
                //   const offsetX = e.nativeEvent.contentOffset.x;
                //   const selectedIndex = Math.round(offsetX / value);
                //   setSelectedIndexes((prevIndexes) => {
                //     const newIndexes = [...prevIndexes];

                //     newIndexes[parentIndex] = selectedIndex;
                //     return newIndexes;
                //   });
                // }}
                onScroll={(e) => {
                  const value = screenWidth - 56;
                  const offsetX = e.nativeEvent.contentOffset.x;
                  const selectedIndex = Math.round(offsetX / value);
                  setSelectedIndexes((prevIndexes) => {
                    const newIndexes = [...prevIndexes];

                    newIndexes[parentIndex] = selectedIndex;
                    return newIndexes;
                  });
                }}
              />
              {renderDotIndicator(parentItem, parentIndex)}
            </View>
          ) : parentItem?.response_type === "numeric_value" ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View>
                {parentItem?.assessment_values?.map((item, index) => {
                  let concateTime = item?.record_date + " " + item?.record_time;
                  let time = moment(concateTime).fromNow();
                  const convertedDate = moment(
                    item?.record_date,
                    "YYYY-MM-DD HH:mm:ss"
                  ).toISOString();
                  const convertedTime = moment(
                    item?.record_time,
                    "HH:mm:ss"
                  ).valueOf();

                  let unitAbbr = "";

                  const unit = measurementListUnit.find(
                    (unit) => unit?.id == item?.assessment_unit_id
                  );
                  if (unit) {
                    unitAbbr = unit.uom_abbr;
                  }

                  return (
                    <View>
                      {index === 0 && (
                        <View
                          style={[
                            reduxColors.numericValueContainer,
                            {
                              borderRightWidth: 1,
                              marginRight: 0,
                              // backgroundColor: 'red',
                              paddingLeft: 0,
                              paddingRight: Spacing.minor,
                              // paddingHorizontal: 0
                            },
                          ]}
                        >
                          <View>
                            <TouchableOpacity
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                              onPress={() => {
                                setIsModalOpen(true),
                                  setNumericValue(item?.assessment_value);
                                setUnitValue(item?.assessment_unit_id);
                                setModalData(parentItem);
                                setAnimalAssesementId(item?.assessment_id);
                                setAddNotes(item?.comments);
                                setDateValue(convertedDate);
                                setTimeValue(convertedTime);
                                setAssessmentDetail(item);
                              }}
                            >
                              <Text
                                style={[
                                  reduxColors?.majorText,
                                  {
                                    color: themeColors.onSurface,
                                  },
                                ]}
                              >
                                {item?.assessment_value}
                              </Text>
                              <Text
                                style={[
                                  reduxColors.mediumText,
                                  {
                                    marginTop: 8,
                                    marginLeft: 2.5,
                                    color: themeColors?.outline,
                                  },
                                ]}
                              >
                                {unitAbbr ? unitAbbr : ""}
                              </Text>
                            </TouchableOpacity>

                            <Text
                              style={[
                                reduxColors.mediumText,
                                {
                                  color: themeColors?.onSecondaryContainer,
                                  marginTop: Spacing.mini,
                                },
                              ]}
                            >
                              {time}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
              <FlatList
                data={parentItem?.assessment_values}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) =>
                  renderNumericValueResponseType(item, index, parentItem)
                }
              />
            </View>
          ) : (
            <View>
              <FlatList
                ref={flatListResponseTextRef}
                data={parentItem?.assessment_values}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) =>
                  renderTextResponseType(
                    item,
                    index,
                    parentItem?.assessment_values,
                    parentItem,
                    parentIndex
                  )
                }
                // onMomentumScrollEnd={(e) => {
                //   const value = screenWidth - 56;
                //   const offsetX = e.nativeEvent.contentOffset.x;
                //   const selectedIndex = Math.round(offsetX / value);
                //   setSelectedIndexes((prevIndexes) => {
                //     const newIndexes = [...prevIndexes];
                //     newIndexes[parentIndex] = selectedIndex;
                //     return newIndexes;
                //   });
                // }}
                onScroll={(e) => {
                  const value = screenWidth - 56;
                  const offsetX = e.nativeEvent.contentOffset.x;
                  const selectedIndex = Math.round(offsetX / value);
                  setSelectedIndexes((prevIndexes) => {
                    const newIndexes = [...prevIndexes];
                    newIndexes[parentIndex] = selectedIndex;
                    return newIndexes;
                  });
                }}
              />
              {renderDotIndicator(parentItem, parentIndex)}
            </View>
          )}
        </View>
      </View>
    );
  };


  const onCancelPress = () => {
    setIsModalOpen(!isModalOpen);
    setFromAddIcon(false);
    setAddNotes("");
    setDateValue(new Date());
    setTimeValue(new Date());
    setOnPressSelectedItem("");
    setAddNumericValue("")
    setAddResponseTextInput("")
  };

  const onAddEntryPress = () => {
    const selectedItem = selectedListData.find((item) => item?.isSelected);
    let recordDateTime =
      moment(dateValue).format("YYYY-MM-DD") +
      " " +
      moment(timeValue).format("HH:mm:ss");
    let response = {};
    if (fromAddIcon) {
      if (
        modalData?.response_type === "numeric_scale" ||
        modalData?.response_type === "list"
      ) {
        response = {
          assessment_type_id: modalData?.assessment_type_id,
          assessment_value: selectedItem?.id,
          comments: addNotes,
          recorded_date_time: recordDateTime,
        };
      } else if (modalData?.response_type === "numeric_value") {
        response = {
          assessment_type_id: modalData?.assessment_type_id,
          assessment_value: addNumericValue,
          assessment_unit_id: selectedUnitId,
          comments: addNotes,
          recorded_date_time: recordDateTime,
        };
      } else {
        response = {
          assessment_type_id: modalData?.assessment_type_id,
          assessment_value: addResponseTextInput,
          comments: addNotes,
          recorded_date_time: recordDateTime,
        };
      }
    } else {
      if (
        modalData?.response_type === "numeric_scale" ||
        modalData?.response_type === "list"
      ) {
        response = {
          animal_assessment_id: animalAssessmentId,
          assessment_value: selectedItem?.id,
          comments: addNotes,
          recorded_date_time: recordDateTime,
        };
      } else if (modalData?.response_type === "numeric_value") {
        response = {
          animal_assessment_id: animalAssessmentId,
          assessment_value: numericValue,
          assessment_unit_id: selectedUnitId,
          comments: addNotes,
          recorded_date_time: recordDateTime,
        };
      } else {
        response = {
          animal_assessment_id: animalAssessmentId,
          assessment_value: responseTextInput,
          comments: addNotes,
          recorded_date_time: recordDateTime,
        };
      }
    }

    setIsLoading(true);
    if (fromAddIcon) {
      addAssessmentCategory(response, animalId)
        .then((response) => {
          if (response?.success) {
            setIsResponseTrue(true);
            fetchAssessmentAnimalTypeList(response = true);
            setIsModalOpen(!isModalOpen);
            setFromAddIcon(!fromAddIcon);
            setAddNumericValue("");
            setAddResponseTextInput("");
            setAddNotes("");
            setSelectedUnitId("");
            setDateValue(new Date());
            setTimeValue(new Date());
            // setFilterCategoryAssessmentList([])
            // assessmentCategoryListRef?.current?.scrollToIndex({
            //   index: 0,
            //   animated: true,
            // });
          }
        })
        .catch((err) => {
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsResponseTrue(true);
      updateAssessmentCategory(response, animalId)
        .then((response) => {
          if (response?.success) {
            fetchAssessmentAnimalTypeList(response = true);
            setIsModalOpen(!isModalOpen);
            setAddNotes("");
            setSelectedUnitId("");
            setDateValue(new Date());
            setTimeValue(new Date());
            // setFilterCategoryAssessmentList([])
            // assessmentCategoryListRef?.current?.scrollToIndex({
            //   index: 0,
            //   animated: true,
            // });
          }
        })
        .catch((err) => {
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const modalHandler = () => {
    return (
      <AssessmentModal
        onAddEntryPress={onAddEntryPress}
        isModalOpen={isModalOpen}
        modalData={modalData}
        onClosePress={onCancelPress}
        onCancelPress={onCancelPress}
        responseTextInput={responseTextInput}
        addResponseTextInput={addResponseTextInput}
        onChangeAddResponseTextInput={(value) => setAddResponseTextInput(value)}
        onChangeResponseTextInput={(value) => setResponseTextInput(value)}
        addNotes={addNotes}
        onChangeAddNotesInput={(value) => setAddNotes(value)}
        unitValue={unitValue}
        numericValue={numericValue}
        onChangeNumericValue={(value) => setNumericValue(value)}
        addNumericValue={addNumericValue}
        onChangeAddNumericValue={(value) => setAddNumericValue(value)}
        dateModal={dateModal}
        dateValue={dateValue}
        onDateModalPress={() => setDateModal(true)}
        onDateCancelPress={() => setDateModal(false)}
        onDateConfirmPress={(data) => {
          setDateValue(data);
          setDateModal(false);
        }}
        timeModal={timeModal}
        timeValue={timeValue}
        onTimeModalPress={() => setTimeModal(true)}
        onTimeCancelPress={() => setTimeModal(false)}
        onTimeConfirmPress={(data) => {
          setTimeValue(data);
          setTimeModal(false);
        }}
        listModalData={listModalData}
        fromAddIcon={fromAddIcon}
        selectedItem={setSelectedListData}
        selectedUnitId={setSelectedUnitId}
        onPressSelectedItem={onPressSelectedItem}
        isResponseTrue={isResponseTrue}
        userId={userId}
        assessmentDetail={assessmentDetail}
      />
    );
  };

  //For multiple select
  // const onAssessmnetCategoryPressHandler = (item, id) => {
  //   let updatedCategories;

  //   if (item.id === "All") {
  //     updatedCategories = assessmentCategoryList.map((element) => ({
  //       ...element,
  //       isSelected: element.id === "All" ? true : false,
  //     }));
  //   } else {
  //     updatedCategories = assessmentCategoryList.map((element) => {
  //       if (element.id === "All") {
  //         return { ...element, isSelected: false };
  //       } else if (element.id === item.id) {
  //         return { ...element, isSelected: !element.isSelected };
  //       } else {
  //         return element;
  //       }
  //     });
  //   }

  //   setAssessmentCategoryList(updatedCategories);
  //   const selectedItems = updatedCategories.filter(
  //     (element) => element.isSelected
  //   );
  //   const selectedCategoryIds = selectedItems.map((item) => item?.id);
  //   const filteredData = assessmentList.filter((assessment) => {
  //     return selectedCategoryIds.includes(assessment.assessment_category_id);
  //   });

  //   if (selectedItems.length === 0) {
  //     updatedCategories = updatedCategories.map((element) => ({
  //       ...element,
  //       isSelected: element.id === "All" ? true : false,
  //     }));
  //     setAssessmentCategoryList(updatedCategories);
  //     //setFilterCategoryAssessmentList(assessmentList);
  //     //finalFilter(filteredData, from = "category")
  //   } else {
  //     setFilterCategoryAssessmentList(filteredData);
  //     //finalFilter(filteredData, from = "category")
  //   }
  // };

  const handleSearch = (query) => {
    setSearchAssessmentListType(query);
    let filteredData = [];

    if (filterCategoryAssessmentList?.length > 0) {
      filteredData = filterCategoryAssessmentList.filter((assessment) =>
        assessment.assessment_name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      filteredData = assessmentList.filter((assessment) =>
        assessment.assessment_name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (query?.length > 0 && filteredData?.length > 0) {
      setSearchFilterData(filteredData);
      setNoData(false);
    } else {
      setSearchFilterData([]);
      setFilterCategoryAssessmentList(filterCategoryAssessmentList);
      setNoData(true);
    }
  };

  const onAssessmnetCategoryPressHandler = (item, id) => {
    setAssessmentItem(item)
    let updatedCategories;

    if (item.id === "All") {
      // If "All" is selected, set all categories to isSelected:true
      updatedCategories = assessmentCategoryList.map((element) => ({
        ...element,
        isSelected: element.id === "All" ? true : false,
      }));
    } else {
      // If a specific category is selected
      updatedCategories = assessmentCategoryList.map((element) => ({
        ...element,
        isSelected: element.id === item.id,
      }));
    }

    setAssessmentCategoryList(updatedCategories);

    const selectedCategory = updatedCategories.find(
      (element) => element.isSelected
    );
    const selectedCategoryId = selectedCategory ? selectedCategory.id : null;

    const filteredData = selectedCategoryId
      ? assessmentList.filter(
          (assessment) =>
            assessment.assessment_category_id === selectedCategoryId
        )
      : assessmentList;
    setFilterCategoryAssessmentList(filteredData);
  };

  const onAssessmnetTypePressHandler = (item, id) => {
    let updatedCategories;

    updatedCategories = assessmentTypeList.map((element) => {
      if (element.id === item.id) {
        return { ...element, isSelected: !element.isSelected };
      } else {
        return element;
      }
    });

    setAssessmentTypeList(updatedCategories);

    const selectedItems = updatedCategories.filter(
      (element) => element.isSelected
    );

    const selectedTypesIds = selectedItems.map((item) => item?.id);
    const filteredData = assessmentList.filter((assessment) => {
      return selectedTypesIds.includes(assessment?.assessment_type_id);
    });

    setFilterTypeAssessmentList(filteredData);
    finalFilter(filteredData, (from = "types"));
  };

  const filterTypeModal = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Modal
        animationType="fade"
        visible={isTypeFilter}
        style={{ margin: 0, backgroundColor: themeColors?.neutral50 }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={() => setIsTypeFilter(false)}
      >
        <View style={reduxColors?.filterModalContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={[
                reduxColors.mediumText,
                { color: themeColors?.onPrimaryContainer },
              ]}
            >
              Total assessment types
            </Text>
            <Text
              style={[
                reduxColors.mediumText,
                { color: themeColors?.onPrimaryContainer },
              ]}
            >
              {" "}
              {assessmentTypeList?.length}
            </Text>
          </View>

          <FlatList
            data={assessmentTypeList}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  reduxColors?.listContainer,
                  {
                    backgroundColor: item?.isSelected
                      ? themeColors?.primaryContainer
                      : themeColors?.displaybgPrimary,
                  },
                ]}
                activeOpacity={0.5}
                onPress={() => onAssessmnetTypePressHandler(item, index)}
              >
                <Text
                  style={[
                    reduxColors?.minorMediumText,
                    {
                      color: themeColors?.onPrimaryContainer,
                    },
                  ]}
                >
                  {item?.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );

  const onNavigate = () => {
    const selectedDataId = assessmentList?.map(
      (item) => item.assessment_type_id
    );

    const updatedAssessmentList = assessmentList.map((item) => {
      const newItem = { ...item };
      newItem.assessments_type_label = newItem.assessment_name;
      delete newItem.assessment_name;
      return newItem;
    });

    navigation.navigate("AddAssessmentTypeTemplate", {
      selectedDataId: selectedDataId,
      data: updatedAssessmentList,
      animalId: animalId,
      from: "animal_assessment",
    });
  };

  const onEmptyAssessmentList = () => {
    if (searchFilterData.length === 0 && searchAssessmentListType !== "") {
      return (
        <View>
          <ListEmpty />
        </View>
      );
    } else {
      return (
        <View style={reduxColors?.centerContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={reduxColors?.addAssessmentContainer}
            onPress={() =>
              navigation.navigate("AddAssessmentTypeTemplate", {
                selectedDataId: undefined,
                data: assessmentList,
                animalId: animalId,
                // onGoBack: (e) => searchSelectData(e),
                // saveExtraData: (e) => saveExtraDataId(e),
                from: "animal_assessment",
              })
            }
          >
            <AntDesign name="plus" size={24} color={themeColors?.onPrimary} />
            <Text
              style={[
                reduxColors?.mediumText,
                {
                  marginLeft: widthPercentageToDP(2),
                  color: themeColors.onPrimary,
                },
              ]}
            >
              Add Assessment Type
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const finalFilter = (filteredData, from) => {
    if (
      from === "types" &&
      filteredData?.length > 0 &&
      filterCategoryAssessmentList?.length > 0
    ) {
      const selectedTypesIds = filteredData.map(
        (item) => item?.assessment_type_id
      );
      const data = filterCategoryAssessmentList.filter((assessment) => {
        return selectedTypesIds.includes(assessment?.assessment_type_id);
      });
      if (data?.length === 0) {
        setFinalFilterAssessment(filterCategoryAssessmentList);
      } else {
        setFinalFilterAssessment(data);
      }
    } else if (from === "types" && filteredData?.length > 0) {
      setFinalFilterAssessment(filteredData);
    } else if (from === "category" && filteredData?.length > 0) {
      if (filterTypeAssessmentList?.length > 0) {
        const selectedTypesIds = filteredData.map(
          (item) => item?.assessment_type_id
        );
        const data = filterTypeAssessmentList.filter((assessment) => {
          return selectedTypesIds.includes(assessment?.assessment_type_id);
        });
        setFinalFilterAssessment(data);
      } else {
        setFinalFilterAssessment(filteredData);
      }
    } else if (filterCategoryAssessmentList?.length > 0) {
      if (from === "category" && filteredData?.length === 0) {
        setFinalFilterAssessment(assessmentList);
      } else {
        setFinalFilterAssessment(filterCategoryAssessmentList);
      }
    } else {
      setFinalFilterAssessment(assessmentList);
    }
  };

  return (
    <Tabs.ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchAssessmentAnimalTypeList();
          }}
          style={{
            color: themeColors.blueBg,
            marginTop:
              Platform.OS == "ios" ? 0 : (Spacing.body + Spacing.small) * 3,
          }}
          enabled={true}
        />
      }
    >
      <Loader visible={isLoading} />
      <View style={reduxColors.container}>
        {assessmentList?.length > 0 && (
          <View style={reduxColors.headerContainer}>
            <Text
              style={[
                reduxColors?.title,
                { color: themeColors?.onSurfaceVariant },
              ]}
            >
              {assessmentList?.length} Types
            </Text>

            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={[
                  reduxColors.iconContainer,
                  {
                    marginRight: Spacing.body,
                  },
                ]}
                onPress={() => {
                  onNavigate();
                }}
              >
                <SvgXml
                  xml={Add}
                  width="24"
                  height="24"
                  style={reduxColors.image}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  reduxColors.iconContainer,
                  {
                    backgroundColor: isSearch
                      ? themeColors?.onBackground
                      : themeColors?.lightGreyHexa,
                  },
                ]}
                onPress={toggleDropDown}
              >
                {!isSearch ? (
                  <SvgXml
                    xml={Search}
                    // width="22"
                    // height="22"
                    style={reduxColors.image}
                  />
                ) : (
                  <SvgXml
                    xml={ActiveSearch}
                    // width="18"
                    // height="18"
                    style={reduxColors.image}
                  />
                )}
              </TouchableOpacity>

              {/* <TouchableOpacity
              style={[
                reduxColors.iconContainer,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor:
                    filterTypeAssessmentList?.length > 0
                      ? themeColors?.onSurface
                      : themeColors?.lightGreyHexa,
                },
              ]}
              onPress={() => setIsTypeFilter(!isTypeFilter)}
            >
              <SvgXml
                xml={Filter}
                width="18"
                height="18"
                style={reduxColors.image}
                strokeWidth={1.5}
                stroke={
                  filterTypeAssessmentList?.length > 0
                    ? themeColors?.onPrimary
                    : themeColors?.onSurface
                }
              />
              {filterTypeAssessmentList?.length > 0 && (
                <Text
                  style={[
                    FontSize.Antz_Body_Title.fontSize,

                    { color: themeColors?.lightGreyHexa, marginLeft: 5 },
                  ]}
                >
                  {filterTypeAssessmentList?.length}
                </Text>
              )}
            </TouchableOpacity> */}
            </View>
          </View>
        )}

        <Animated.View
          style={{
            width: "100%",
            height: dropdownHeight,
            //backgroundColor: 'red'
          }}
        >
          <View
            style={{
              width: "100%",
              paddingVertical: 10,
              paddingHorizontal: 16,
              //backgroundColor: 'red'
            }}
          >
            <View
              style={[
                reduxColors?.searchBarContainer,
                { paddingVertical: isSearch ? Spacing.small : 0 },
              ]}
            >
              <Feather
                name="search"
                size={22}
                color={themeColors?.onPrimaryContainer}
              />
              {isSearch && (
                <TextInput
                  value={searchAssessmentListType}
                  onChangeText={handleSearch}
                  style={reduxColors.searchBarInputContainer}
                  placeholder="Search..."
                  autoFocus={true}
                />
              )}
              {searchAssessmentListType?.length > 0 && (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    setSearchAssessmentListType("");
                  }}
                >
                  <AntDesign
                    name="close"
                    size={22}
                    color={themeColors?.onPrimaryContainer}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>

        {filterTypeAssessmentList?.length > 0 && (
          <View style={reduxColors.filterSelectedListContainer}>
            <FlatList
              data={assessmentTypeList}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) =>
                renderAssessmentTypes(item, index)
              }
            />
          </View>
        )}

        {assessmentList?.length > 0 && (
          <View
            style={[
              reduxColors.filterListContainer,
              { marginTop: isSearch ? Spacing.small : Spacing.minor },
            ]}
          >
            <FlatList
              ref={assessmentCategoryListRef}
              data={assessmentCategoryList}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) =>
                renderAssessmentCategories(item, index)
              }
            />
          </View>
        )}

        <View style={reduxColors.assessmentListContainer}>
          {isSearch ? (
            <View style={{ width: "100%" }}>
              <FlatList
                data={
                  searchFilterData?.length > 0
                    ? searchFilterData
                    : filterCategoryAssessmentList?.length > 0 &&
                      searchAssessmentListType?.length === 0
                    ? filterCategoryAssessmentList
                    : searchAssessmentListType?.length > 0 && noData
                    ? []
                    : assessmentList
                }
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => renderSubCategory(item, index)}
                contentContainerStyle={{ paddingHorizontal: Spacing.minor }}
                ListEmptyComponent={onEmptyAssessmentList}
              />
            </View>
          ) : (
            <View style={{ width: "100%" }}>
              <FlatList
                data={
                  filterCategoryAssessmentList?.length > 0
                    ? filterCategoryAssessmentList
                    : assessmentList
                }
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => renderSubCategory(item, index)}
                contentContainerStyle={{ paddingHorizontal: Spacing.minor }}
                ListEmptyComponent={onEmptyAssessmentList}
              />
            </View>
          )}
        </View>
      </View>
      {modalHandler()}
      {filterTypeModal()}
    </Tabs.ScrollView>
  );
};

const Styles = (reduxColors) =>
  StyleSheet.create({
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    headerContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      padding: Spacing.body,
      borderBottomWidth: 0.2,
      borderBottomColor: reduxColors.gray,
      justifyContent: "space-between",
    },
    iconContainer: {
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4,
      backgroundColor: reduxColors.lightGreyHexa,
      // paddingHorizontal: Spacing.small,
      // paddingVertical: Spacing.mini
    },
    filterListContainer: {
      width: "100%",
      //marginTop: Spacing.minor,
      //marginVertical: Spacing.minor,
      marginBottom: Spacing.minor,
    },

    filterSelectedListContainer: {
      width: "100%",
      paddingVertical: Spacing.minor,
      backgroundColor: reduxColors?.displaybgSecondary,
    },

    filterItemContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.small,
      backgroundColor: reduxColors?.displaybgSecondary,
      borderRadius: 5,
      marginLeft: Spacing.minor,
    },

    filteredItemContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.small,
      backgroundColor: reduxColors?.onSecondary,
      borderRadius: 8,
      marginLeft: Spacing.minor,
      borderWidth: 1,
      borderColor: reduxColors?.outline,
      flexDirection: "row",
    },

    assessmentListContainer: {
      width: "100%",
      backgroundColor: reduxColors.onPrimary,
      alignItems: "center",
    },

    subCategoryItemContainer: {
      borderRadius: 8,
      width: "100%",
      marginBottom: Spacing.body,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1,
      elevation: 1,
    },

    subCategoryHeaderContainer: {
      justifyContent: "space-between",
      paddingBottom: 10,
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      paddingTop: 8,
      marginBottom: 5,
    },

    addContainer: {
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.body,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: reduxColors.outline,
      borderRadius: 5,
    },

    numericValueContainer: {
      paddingHorizontal: Spacing.minor,
      borderRightColor: reduxColors?.outline,
      paddingVertical: Spacing.small,
      marginRight: Spacing.minor,
    },

    dateDotWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: Spacing.small,
      justifyContent: "space-between",
    },

    dotContainer: {
      flexDirection: "row",
      justifyContent: "center",
    },

    dotStyle: {
      width: 6,
      height: 6,
      borderRadius: 10,
      marginHorizontal: 5,
    },

    modalMainContainer: {
      minHeight: 100,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      paddingTop: 22,
      backgroundColor: reduxColors?.onSecondary,
      marginHorizontal: 10,
    },

    dateTimeContainer: {
      width: "48%",
      paddingVertical: Spacing.small,
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 4,
      borderWidth: 1,
      borderColor: reduxColors?.outline,
      backgroundColor: reduxColors?.surface,
      paddingHorizontal: Spacing.small,
    },

    inputContainer: {
      paddingHorizontal: 9,
      paddingVertical: Spacing.minor,
      backgroundColor: "red",
      borderRadius: 4,
      borderWidth: 1,
      marginTop: Spacing.minor,
    },

    buttonContainer: {
      width: "48%",
      paddingVertical: 10,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 8,
    },

    listContainer: {
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.minor,
      marginTop: Spacing.minor,
      borderRadius: 8,
    },

    searchBarContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: reduxColors?.background,
      //paddingVertical: Spacing.small,
      borderRadius: 4,
      paddingHorizontal: Spacing.small,
    },
    searchBarInputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      marginLeft: Spacing.small,
    },

    footerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.minor,
      paddingVertical: 20,
      backgroundColor: reduxColors?.background,
      justifyContent: "space-between",
    },

    filterModalContainer: {
      width: "80%",
      paddingVertical: 21,
      backgroundColor: reduxColors?.onPrimary,
      alignSelf: "center",
      borderRadius: 8,
      paddingHorizontal: 12,
    },

    addAssessmentContainer: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      paddingVertical: Spacing.minor,
      width: "100%",
      borderRadius: 8,
      backgroundColor: reduxColors?.secondary,
      marginTop: Spacing.major,
    },

    //Text-Styles
    title: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
    },

    majorText: {
      fontWeight: FontSize.Antz_Major_Title.fontWeight,
      fontSize: FontSize.Antz_Major_Title.fontSize,
    },

    minorMediumText: {
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
    },
    regularText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    },
    subRegularText: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
    },
    microRegularText: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
    },
    mediumText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    },

    //verticleLine
    verticalLine: {
      width: 1,
      height: 60,
      marginHorizontal: 20,
    },

    //Divider
    divider: {
      width: "100%",
      height: 0.5,
      backgroundColor: reduxColors?.outlineVariant,
    },
  });
