import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import {
  getAssessmentCategoryTypeList,
  getAssessmentTypesList,
  addAssessmentType,
} from "../../services/assessmentService/AssessmentServiceApi";
import Loader from "../../components/Loader";
import { useToast } from "../../configs/ToastConfig";
import MedicalSearchFooter from "../../components/MedicalSearchFooter";
import ListEmpty from "../../components/ListEmpty";
import CheckBox from "../../components/CheckBox";

const AddAssessmentTypeTemplate = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { goBack } = useNavigation();

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const [AssessmentTypeData, setAssessmentTypeData] = useState([]);

  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [selectedItems, setSelectedItems] = useState(
    props?.route?.params?.selectedDataId
      ? props?.route?.params?.selectedDataId
      : []
  );
  const [selectedeType, setSelectededType] = useState(
    props?.route?.params?.data ? props?.route?.params?.data : []
  );
  const { errorToast } = useToast();
  const [assessmentTypeListDataLength, setAssessmentTypeListDataLength] =
    useState(0);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchModalText, setSearchModalText] = useState("");
  const from = props?.route?.params?.from ?? "";
  const animalId = props?.route?.params?.animalId ?? "";
  const peviousSelectedAssessmentList = props?.route?.params?.data ?? []
  const peviousSelectedAssessmentId = props?.route?.params?.selectedDataId ?? []

  useEffect(() => {
    if (searchModalText?.length == 0) {
      setIsLoading(true);
      getAssesssmetCategoryList(
        1,
        selectedCategory !== "" ? selectedCategory : "",
        ""
      );
      GetAssessmentTypeList();
      setPage(1);
    }
    const getData = setTimeout(() => {
      if (searchModalText.length >= 3) {
        setIsLoading(true);
        getAssesssmetCategoryList(
          1,
          selectedCategory !== "" ? selectedCategory : "",
          searchModalText
        );
        GetAssessmentTypeList();
        setPage(1);
      }
    }, 1000);
    return () => clearTimeout(getData);
  }, [searchModalText]);

  //This function is used for Filter type based on category
  const handleCategoryPress = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
      setIsLoading(true);
      setPage(1);
      getAssesssmetCategoryList(1, "", "");
    } else {
      setSelectedCategory(category);
      setIsLoading(true);
      setPage(1);
      getAssesssmetCategoryList(
        1,
        category,
        searchModalText !== "" ? searchModalText : ""
      );
    }
  };
  // This function is used of checkBox sellection
  const handleCheckboxChange = (id, item) => {
    const selectedIndex = selectedItems?.indexOf(id);
    const selectedCompleteDataIndex = selectedeType?.findIndex(
      (data) => data?.string_id === item?.string_id
    );
    if (selectedIndex === -1 && selectedCompleteDataIndex === -1) {
      setSelectedItems([...selectedItems, id]);
      setSelectededType([...selectedeType, item]);
    } else {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems.splice(selectedIndex, 1);
      setSelectedItems(updatedSelectedItems);
      const updatedSelectedCompletData = [...selectedeType];
      updatedSelectedCompletData.splice(selectedCompleteDataIndex, 1);
      setSelectededType(updatedSelectedCompletData);
    }
  };

  // This function is used for Assessment type complete data list
  const getAssesssmetCategoryList = (pageCount, selected, searchModalText) => {
    const obj = {
      page_no: pageCount,
      cat_id: selected,
      q: searchModalText,
    };
    getAssessmentCategoryTypeList(obj)
      .then((res) => {
        if (res?.success) {
          let dataArr = pageCount == 1 ? [] : AssessmentTypeData;
          setAssessmentTypeListDataLength(
            res?.data?.result ? res?.data?.result?.length : 0
          );
          if (res?.data?.total_count == 0) {
            setAssessmentTypeData([]);
          } else {
            setAssessmentTypeData(dataArr.concat(res?.data?.result));
          }
        } else {
          errorToast("error", "Something went wrong");
          setIsLoading(false);
        }
      })
      .catch((e) => {
        errorToast("error", "Something went wrong");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  // This function is used for Assessment category data list
  const GetAssessmentTypeList = () => {
    getAssessmentTypesList()
      .then((res) => {
        if (res.success) {
          setAssessmentTypes(res?.data);
        } else {
          errorToast("error", "Something went wrong");
        }
      })
      .catch((e) => {
        setIsLoading(false);
        errorToast("error", "Something went wrong");
      })
      .finally((e) => {
        setIsLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (!isLoading && assessmentTypeListDataLength == 10) {
      const nextPage = page + 1;
      getAssesssmetCategoryList(nextPage, selectedCategory, searchModalText);
      setPage(nextPage);
    }
  };

  const renderFooter = () => {
    if (
      isLoading ||
      assessmentTypeListDataLength == 0 ||
      assessmentTypeListDataLength < 10
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  const sendApprovalList = () => {
    if (from === "animal_assessment") {
      const filterData = selectedItems?.filter(id => !peviousSelectedAssessmentList?.some(item => item.assessment_type_id === id)) 

      console.log("filterData====>", filterData?.length)
      if(filterData?.length > 0){
        const response = {
          assessment_types_to_be_removed: JSON.stringify([]),
          new_assessment_types: JSON.stringify(filterData),
        };
  
        addAssessmentType(response, animalId)
          .then((response) => {
            console.log("response200===>", response)
            if (response?.success) {
              props.navigation.goBack();
            }
          })
          .catch((err) => {
            console.log("Error", err)
            setIsLoading(false);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        console.log("Please select assessment....")
      }

    } else {
      props.route.params.onGoBack(selectedeType),
      props.route.params.saveExtraData(selectedItems);
      props.navigation.goBack();
    }
  };

  const mappedSelectedAssessmentType = selectedeType?.map((item) => ({
    id: item.assessment_type_id,
    name: item.assessments_type_label,
  }));


  const clearSearchText = () => {
    setSearchModalText("");
    setIsLoading(true);
    getAssesssmetCategoryList(1, "", "");
    GetAssessmentTypeList();
    setPage(1);
  };

  const FilterListItem = ({ title, isSelected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        dynamicStyles.filterContainer,
        selectedCategory === isSelected
          ? dynamicStyles.selectedFilterContainer
          : {},
      ]}
    >
      <Text
        style={[
          dynamicStyles.filterTitleText,
          selectedCategory === isSelected
            ? { color: constThemeColor.onPrimary }
            : {},
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Loader visible={isLoading} />
      <View style={dynamicStyles.headerContainer}>
        <TouchableOpacity onPress={goBack}>
          <MaterialCommunityIcons
            name={"arrow-left"}
            size={24}
            color={constThemeColor.onSecondaryContainer}
          />
        </TouchableOpacity>
        <TextInput
          placeholder={"Search Assessment Type"}
          style={dynamicStyles.searchInput}
          value={searchModalText}
          onChangeText={setSearchModalText}
        />
        {searchModalText?.length > 0 ? (
          <TouchableOpacity onPress={clearSearchText}>
            <Image
              source={require("../../assets/close.png")}
              resizeMode={"contain"}
              style={dynamicStyles.headerIcon}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={dynamicStyles.contentContainer}>
        <View
          style={{
            paddingVertical: Spacing.body,
            paddingHorizontal: Spacing.mini,
          }}
        >
          <FlatList
            data={assessmentTypes}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            renderItem={({ item }) => {
              return (
                <View style={{ flexDirection: "row" }}>
                  <FilterListItem
                    title={item?.label}
                    isSelected={item?.assessment_category_id}
                    onPress={() =>
                      handleCategoryPress(item?.assessment_category_id)
                    }
                  />
                </View>
              );
            }}
            keyExtractor={(item) => item?.assessment_category_id}
          />
        </View>
        <View style={{ marginBottom: 75, flex: 1 }}>
          <FlatList
            data={AssessmentTypeData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={[
                    dynamicStyles.listItemContainer,
                    selectedItems.includes(item?.assessment_type_id)
                      ? { backgroundColor:
                        from === "animal_assessment" ?
                        peviousSelectedAssessmentId.includes(item?.assessment_type_id) ?
                        constThemeColor?.surface
                        : constThemeColor.onBackground
                        :constThemeColor.onBackground
                      }
                      : {},
                  ]}
                  disabled={from === "animal_assessment" && peviousSelectedAssessmentId.includes(item?.assessment_type_id)}
                  onPress={() =>
                    handleCheckboxChange(item?.assessment_type_id, item)
                  }
                >
                  <Text style={dynamicStyles.listItemTitleText}>
                    {item?.assessments_type_label}
                  </Text>
                   <CheckBox
                    accessible={true}
                    key={item?.id}
                    activeOpacity={1}
                    iconSize={24}
                    disabled={from === "animal_assessment" && peviousSelectedAssessmentId?.includes(item?.assessment_type_id) ? true : false}
                    checked={selectedItems.includes(item?.assessment_type_id)}
                    checkedColor={constThemeColor.primary}
                    uncheckedColor={constThemeColor.outline}
                    labelStyle={[constThemeColor.labelName, constThemeColor.mb0]}
                  />
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item?.assessment_type_id}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={<ListEmpty />}
          />
        </View>

        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <MedicalSearchFooter
            title={"Type"}
            selectCount={mappedSelectedAssessmentType?.length}
            onPress={sendApprovalList}
            selectedItems={mappedSelectedAssessmentType}
          />
        </View>
      </View>
    </View>
  );
};

export default AddAssessmentTypeTemplate;

const styles = (reduxColors) =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      padding: Spacing.minor,
      backgroundColor: reduxColors.onError,
    },
    headerIcon: {
      height: 24,
      width: 24,
      tintColor: reduxColors.onSecondaryContainer,
    },
    searchInput: {
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.on_Surface,
      flex: 1,
      marginHorizontal: Spacing.major,
      paddingTop: 0,
      paddingBottom: 0,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: reduxColors.surfaceVariant,
    },
    filterContainer: {
      paddingHorizontal: Spacing.small,
      paddingVertical: Spacing.mini + Spacing.micro,
      marginHorizontal: Spacing.small,
      backgroundColor: reduxColors.onBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: reduxColors.outline,
    },
    selectedFilterContainer: {
      backgroundColor: reduxColors.onPrimaryContainer,
    },
    filterTitleText: {
      ...FontSize.Antz_Body_Medium,
      color: reduxColors.onPrimaryContainer,
    },
    downArrowIcon: {
      height: 14,
      width: 14,
      tintColor: reduxColors.onSurfaceVariant,
      marginLeft: Spacing.small,
    },
    bottomContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: Spacing.minor + Spacing.mini,
      paddingHorizontal: Spacing.major + Spacing.mini,
    },
    bottomCountText: {
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.on_Surface,
    },
    addButtonContainer: {
      backgroundColor: reduxColors.primary,
      borderRadius: 8,
      paddingVertical: Spacing.body,
      paddingHorizontal: Spacing.minor,
    },
    addButtonTitleText: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onError,
    },
    listItemContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: Spacing.body + Spacing.micro,
      paddingHorizontal: Spacing.body,
      paddingLeft: Spacing.minor,
      height: 56,
      backgroundColor: reduxColors.onError,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: reduxColors.background,
      marginBottom: Spacing.body,
    },
    listItemTitleText: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onSurfaceVariant,
      flex: 1,
    },
  });
