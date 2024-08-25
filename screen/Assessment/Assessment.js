import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { opacityColor } from "../../utils/Utils";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import FloatingButton from "../../components/FloatingButton";
import {
  AntDesign,
  Feather,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import InsideBottomsheet from "../../components/Move_animal/InsideBottomsheet";
import {
  getAssessmentCategoryTypeList,
  getAssessmentStats,
  getAssessmentTypesList,
  getAssessmentTypesListById,
} from "../../services/assessmentService/AssessmentServiceApi";
import { useToast } from "../../configs/ToastConfig";
import Loader from "../../components/Loader";
import ListEmpty from "../../components/ListEmpty";
import { assessmentTemplateList } from "../../services/assessmentService/AssessmentTemplate";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Searchbar } from "react-native-paper";
import CustomInsightCard from "../../components/CustomInsightCard";
import Header from "../../components/Header";

// This Function is used For assessment Stats show

const AssessmentStats = ({ handleClick }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [assessmemntStats, setAssessmentStats] = useState([]);
  const AssessemntStats = [
    {
      id: 1,
      title: "Types",
      count: assessmemntStats?.type_count ?? 0,
    },
    {
      id: 2,
      title: "Templates",
      count: assessmemntStats?.template_count ?? 0,
    },
  ];
  useFocusEffect(
    React.useCallback(() => {
      AssessmentStatsList();
      return () => {};
    }, [])
  );

  const AssessmentStatsList = () => {
    getAssessmentStats()
      .then((res) => {
        if (res.success) {
          setAssessmentStats(res?.data);
        } else {
          errorToast("error", "Something went wrong");
        }
      })
      .catch((e) => {
        errorToast("error", "Something went wrong");
      });
  };
  const statsPress = (check) => {
    handleClick(check);
  };
  return (
    <>
      <Header
        noIcon={true}
        showBackButton={true}
        backgroundColor={(backgroundColor = constThemeColor.onPrimaryContainer)}
        arrowColor={true}
        hideMenu={true}
      />
      <View style={reduxColors.assessmentContainer}>
        <Text style={reduxColors.assessmentText}>Assessments</Text>
        <View>
          <CustomInsightCard
            mainContainer={{
              backgroundColor: opacityColor(constThemeColor.neutralPrimary, 40),
            }}
            cardNumColor={{ color: constThemeColor.primaryContainer }}
            insightData={AssessemntStats}
            statsPress={statsPress}
          />
        </View>
      </View>
    </>
  );
};

// This is a main function For assessment screen

const Assessment = () => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const routes = [
    { key: "first", title: "Types" },
    { key: "second", title: "Templates" },
  ];

  const renderScene = SceneMap({
    first: () => (index == 0 ? <Types /> : null),
    second: () => (index == 1 ? <Templates /> : null),
  });

  const onIndexChange = (newIndex) => {
    setIndex(newIndex);
  };
  const handleClick = (check) => {
    if (check == "Types") {
      setIndex(0);
    } else if (check == "Templates") {
      setIndex(1);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {/* Header for assessmemnt and Assessment stats of types and templates */}

      <AssessmentStats handleClick={handleClick} />

      {/* Tabs List  */}

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        swipeEnabled={false}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled={false}
            style={{
              backgroundColor: constThemeColor.onPrimary,
              elevation: 0,
              borderBottomWidth: 1,
              borderBottomColor: constThemeColor.outlineVariant,
            }}
            labelStyle={{
              color: constThemeColor.onSurfaceVariant,
              fontSize: FontSize.Antz_Minor_Medium.fontSize,
              fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
              width: "100%",
              textAlign: "center",
              textTransform: "capitalize",
            }}
            tabStyle={{
              height: 50,
            }}
            indicatorStyle={{
              backgroundColor: constThemeColor.onSurface,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              height: 3,
              width: "20%",
              marginLeft: "12%",
              marginBottom: -0.5,
            }}
            activeColor={constThemeColor.onSurface}
          />
        )}
      />

      {/* Floating button for adding new assessment type and templates*/}

      <FloatingButton
        icon="plus"
        backgroundColor={constThemeColor.flotionBackground}
        borderWidth={0}
        borderColor={constThemeColor.flotionBorder}
        borderRadius={50}
        linkTo=""
        floaterStyle={{ height: 60, width: 60 }}
        onPress={() => {
          if (index == 0) {
            navigation.navigate("AddAssessmentType");
          } else if (index == 1) {
            navigation.navigate("AddAssessmentTemplate");
          }
        }}
      />
    </View>
  );
};

export default Assessment;

// This function is used for list all the assessement type

const Types = () => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const assessmentType = useRef(null);
  const assessmentTypeSearch = useRef(null);
  const navigation = useNavigation();
  const [typeName, setTypeName] = useState("");
  const { errorToast } = useToast();
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [assessmentTypesById, setAssessmentTypesById] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTypeData, setSearchTypeData] = useState("");
  const [AssessmentTypeData, setAssessmentTypeData] = useState([]);
  const [selectedTypeData, setSelectedTypeData] = useState([]);
  const [searchTypeIdData, setSearchTypeIdData] = useState("");
  const [assessmentTypeListDataLength, setAssessmentTypeListDataLength] =
    useState(0);
  const [pageType, setPageType] = useState(1);
  const [assessmentDataCount, setAssessmentDataCount] = useState(0);
  const [assessmentTypeModal, setassessmentTypeModal] = useState(false);
  const [assessmentTypeIdModal, setassessmentTypeIdModal] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      GetAssessmentTypeList();
      return () => {};
    }, [])
  );
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
  const handleSearchByTypeId = (text) => {
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setSearchTypeIdData(text);
        categoryWiseBottomSheet(selectedTypeData, text);
      }, 1000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      const getData = setTimeout(() => {
        setSearchTypeIdData("");
        categoryWiseBottomSheet(selectedTypeData, text);
      }, 1000);
      return () => clearTimeout(getData);
    }
  };

  const categoryWiseBottomSheet = (item, text) => {
    setSelectedTypeData(item);
    setTypeName(item.label + " - " + item.assessment_type_count);
    setassessmentTypeIdModal(true)
    setIsLoading(true);
    const obj = {
      cat_id: item.assessment_category_id,
      q: text ? text : "",
    };
    setIsLoading(true);
    getAssessmentTypesListById(obj)
      .then((res) => {
        if (res.success) {
          assessmentType.current.present();
          setAssessmentTypesById(res?.data?.result);
        } else {
          errorToast("error", "Something went wrong");
          assessmentType.current.close();
          setIsLoading(false);
        }
      })
      .catch((e) => {
        errorToast("error", "Something went wrong");
        setIsLoading(false);
        assessmentType.current.close();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const navigateTodetails = (id) => {
    assessmentType.current.close();
    assessmentTypeSearch.current.close();
    setSearchTypeData("");
    setSearchTypeIdData("");
    navigation.navigate("AssessmentDetails", {
      assessmentId: id,
    });
  };

  //This function is ussed for type Search
  const handleTypeSearch = (text) => {
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setSearchTypeData(text);
        setPageType(1);
        setIsLoading(true);
        searchAssessmentTypeBottomSheet(text, 1);
      }, 1000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      const getData = setTimeout(() => {
        setSearchTypeData("");
        setIsLoading(true);
        searchAssessmentTypeBottomSheet(text, 1);
        setPageType(1);
      }, 1000);
      return () => clearTimeout(getData);
    }
  };
  // This function is ussed for list all the type and when  bottom sheet open call the type list api
  const searchAssessmentTypeBottomSheet = (text, pageNo) => {
    setTypeName("Search Assessment Types");
    assessmentTypeSearch.current.present();
    const obj = {
      q: text ? text : "",
      page_no: pageNo,
    };
    getAssessmentCategoryTypeList(obj)
      .then((res) => {
        if (res.success) {
          let arrData = pageNo == 1 ? [] : AssessmentTypeData;

          setAssessmentDataCount(
            res?.data?.total_count == undefined ? 0 : res?.data?.total_count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setAssessmentTypeData(arrData);
            setAssessmentTypeListDataLength(arrData?.length);
            setIsLoading(false);
          }
        } else {
          setAssessmentTypeListDataLength(assessmentDataCount);
        }
      })
      .catch((e) => {
        console.log("error==>", e);
        errorToast("error", "Something went wrong");
        setIsLoading(false);
        assessmentType.current.close();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleLoadMore = () => {
    if (
      !isLoading &&
      assessmentTypeListDataLength >= 10 &&
      assessmentTypeListDataLength != assessmentDataCount
    ) {
      const nextPage = pageType + 1;
      setPageType(nextPage);
      searchAssessmentTypeBottomSheet(searchTypeData, nextPage);
    }
  };

  const renderFooter = () => {
    if (
      isLoading ||
      assessmentTypeListDataLength == 0 ||
      assessmentTypeListDataLength < 10 ||
      assessmentTypeListDataLength == assessmentDataCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };
  // This function is used for open bottom sheet that listed all the types
  const bottomSHeetOpenPress = () => {
    setIsLoading(true);
    setPageType(1);
    searchAssessmentTypeBottomSheet("", 1);
    setassessmentTypeModal(true);
  };
 // These all function is used for close the bottom sheet
  const searchAllAssessmentClose = () => {
    assessmentTypeSearch.current.close();
    setassessmentTypeModal(false);
  };
  const searchAllAssessmentTypeIdClose = () => {
    assessmentType.current.close();
    setassessmentTypeIdModal(false);
  };
  useEffect(() => {
    const backAction = () => {
      if (assessmentTypeModal || assessmentTypeIdModal) {
        searchAllAssessmentClose();
        searchAllAssessmentTypeIdClose()
      } else {
        navigation.goBack();
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [navigation, assessmentTypeModal,assessmentTypeIdModal]);
  return (
    <View style={{ flex: 1 }}>
      <Loader visible={isLoading} />
      <TouchableOpacity onPress={bottomSHeetOpenPress}>
        <View style={reduxColors.countTypeContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                paddingLeft: Spacing.body,
                color: constThemeColor.onPrimaryContainer,
              }}
            >
              Search Assessment Type
            </Text>
          </View>
          <View style={{ paddingRight: Spacing.body }}>
            <Octicons name="search" size={20} color={constThemeColor.primary} />
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          backgroundColor: constThemeColor.background,
          paddingTop: Spacing.mini,
        }}
      >
        <FlatList
          data={assessmentTypes}
          keyExtractor={(item) => item?.assessment_category_id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmpty />}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() =>
                    item?.assessment_type_count == 0
                      ? null
                      : categoryWiseBottomSheet(item)
                  }
                >
                  <View style={reduxColors.typeListContainer}>
                    <Text style={reduxColors.typeTitle}>{item.label}</Text>
                    <View style={reduxColors.rightIcon}>
                      <Text style={[reduxColors.typeTitle,{textAlign: "right"}]}>
                        {item?.assessment_type_count == 0
                          ? null
                          : item?.assessment_type_count}
                      </Text>
                      {item?.assessment_type_count == 0 ? null : (
                        <MaterialIcons
                          name="chevron-right"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            );
          }}
        />
      </View>
      <BottomSheetModalComponent ref={assessmentType}>
        <InsideBottomsheet
          title={typeName}
          type={"assessmentType"}
          assessmentTypeData={assessmentTypesById}
          CloseBottomSheet={() => assessmentType.current.close()}
          navigateTodetails={navigateTodetails}
          handelSearch={handleSearchByTypeId}
          searchText={searchTypeIdData}
        />
      </BottomSheetModalComponent>
      <BottomSheetModalComponent ref={assessmentTypeSearch}>
        <InsideBottomsheet
          title={typeName}
          type={"assessmentType"}
          searchAssessement={"searchAssessmentModal"}
          assessmentTypeData={AssessmentTypeData}
          CloseBottomSheet={() => assessmentTypeSearch.current.close()}
          navigateTodetails={navigateTodetails}
          handelSearch={handleTypeSearch}
          searchText={searchTypeData}
          handleLoadMore={handleLoadMore}
          renderFooter={renderFooter}
        />
      </BottomSheetModalComponent>
    </View>
  );
};

//   This function is used for list down all the assessment template
const Templates = () => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { navigate } = useNavigation();
  const { errorToast } = useToast();
  const [templateListData, setTemplateListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentTempDataLength, setAssessmentTempDataLength] = useState(0);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  useFocusEffect(
    React.useCallback(() => {
      if (searchText?.length == 0) {
        setIsLoading(true);
        setPage(1);
        templateList("", 1);
      }
      const getData = setTimeout(() => {
        if (searchText.length >= 3) {
          setIsLoading(true);
          setPage(1);
          templateList(searchText, 1);
        }
      }, 1000);
      return () => clearTimeout(getData);
    }, [searchText])
  );
  const [assessmentTemplateCount, setAssessmentTemplateCount] = useState(0);
  const templateList = (text, pageNo) => {
    const obj = {
      q: text ? text : "",
      page_no: pageNo,
    };
    assessmentTemplateList(obj)
      .then((res) => {
        // let dataArr = pageNo == 1 ? [] : templateListData;
        // setAssessmentTempDataLength(res?.data?.result?.length);
        // if (res?.data?.result) {
        //   setTemplateListData(dataArr.concat(res?.data?.result));
        // }
        if (res.success) {
          let arrData = pageNo == 1 ? [] : templateListData;

          setAssessmentTemplateCount(
            res?.data?.total_count == undefined ? 0 : res?.data?.total_count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setTemplateListData(arrData);
            setAssessmentTempDataLength(arrData?.length);
            setIsLoading(false);
          }
        } else {
          setAssessmentTempDataLength(assessmentTemplateCount);
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
    if (
      !isLoading &&
      assessmentTempDataLength >= 10 &&
      assessmentTempDataLength != assessmentTemplateCount
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      templateList(searchText, nextPage);
    }
  };

  const renderFooter = () => {
    if (
      isLoading ||
      assessmentTempDataLength == 0 ||
      assessmentTempDataLength < 10 ||
      assessmentTempDataLength == assessmentTemplateCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  const clearSearchData = () => {
    setIsLoading(true);
    templateList("", 1);
    setSearchText("");
    setPage(1);
  };
  return (
    <View style={{ flex: 1 }}>
      <Loader visible={isLoading} />
    {templateListData?.length !=0 ?  <Searchbar
        placeholder={`Search`}
        placeholderTextColor={constThemeColor?.mediumGrey}
        onChangeText={(e) => setSearchText(e)}
        inputStyle={reduxColors.input}
        value={searchText}
        style={[
          reduxColors.Searchbar,
          { backgroundColor: constThemeColor.onPrimary },
        ]}
        autoFocus={false}
        icon={({ size, color }) => (
          <Feather
            name="search"
            size={24}
            color={constThemeColor.onSecondaryContainer}
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
                onPress={() => clearSearchData()}
                style={{ marginRight: 12, marginLeft: 0 }}
              />
            ) : null}
          </View>
        )}
      />:null}
      <View
        style={{
          flex: 1,
          // paddingTop: Spacing.small,
          backgroundColor: constThemeColor.background,
        }}
      >
        <FlatList
          data={templateListData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigate("AssessmentTemplateDetails", {
                    assessmentTemplateId: item?.assessment_template_id,
                  })
                }
                style={reduxColors.typeListContainer}
              >
                <View style={{flex: 1,width: "100%"}}>
                  <Text style={reduxColors.typeTitle}>
                    {item?.template_name}
                  </Text>
                  <Text style={reduxColors.type}>
                    Assessment Types - {item?.assigned_assessment_types}
                  </Text>
                  <Text style={reduxColors.type}>
                    Taxon - {item?.assigned_species_count}
                  </Text>
                </View>
                <View style={reduxColors.rightIconTemp}>
                  <MaterialIcons
                    name={"chevron-right"}
                    size={24}
                    color={constThemeColor.onSurfaceVariant}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item?.assessment_template_id}
          ListEmptyComponent={<ListEmpty />}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
        />
      </View>
    </View>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    assessmentContainer: {
      backgroundColor: reduxColors.onPrimaryContainer,
      padding: Spacing.minor,
      paddingTop: 0,
      paddingBottom: Spacing.major+Spacing.minor
    },
    assessmentText: {
      ...FontSize.Antz_Major_Medium,
      color: reduxColors.onPrimary,
    },
    searchIconContainer: {
      backgroundColor: reduxColors.onBackground,
      padding: Spacing.mini + 2,
      borderRadius: Spacing.mini,
    },

    // This Styles is used for Assessment type component

    countTypeContainer: {
      backgroundColor: reduxColors.onPrimary,
      padding: Spacing.body,
      paddingVertical: Spacing.minor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 0.8,
      borderBottomColor: reduxColors.outlineVariant,
    },
    typesCount: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onSurfaceVariant,
    },
    typeListContainer: {
      backgroundColor: reduxColors.onPrimary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "center",
      padding: Spacing.minor,
      marginHorizontal: Spacing.body,
      borderRadius: Spacing.small,
      paddingBottom: Spacing.body,
      marginTop: Spacing.body,
    },
    rightIcon: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: 75,
    },
    typeTitle: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onSurfaceVariant,
    },

    // This Styles is used for template list
    templateCount: {
      ...FontSize.Antz_Body_Title,
      color: reduxColors.onSurfaceVariant,
    },
    rightIconTemp: {
      alignItems: "center",
      justifyContent: "center",
    },
    type: {
      ...FontSize.Antz_Body_Regular,
      color: reduxColors.onSurfaceVariant,
    },
    searchContainer: {
      marginVertical: 0,
      height: 48,
      paddingLeft: Spacing.small,
      backgroundColor: reduxColors.surface,
      borderRadius: 0,
    },

    headerContainer: {
      flexDirection: "row",
      padding: Spacing.body,
      backgroundColor: reduxColors.onError,
    },
    searchInput: {
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.on_Surface,
      flex: 1,
      marginHorizontal: Spacing.minor,
      paddingTop: 0,
      paddingBottom: 0,
    },
    Searchbar: {
      width: widthPercentageToDP(100),
      borderRadius: 0,
      borderBottomWidth: 1,
      borderColor: reduxColors.lightGreyHexa,
    },
  });

// const handleTempSearch = (text) => {
//   setSearchText(text);
//   if (text.length >= 3) {
//     const getData = setTimeout(() => {
//       setIsLoading(true);
//       templateList(text, 1);
//       setPage(1);
//     }, 1000);
//     return () => clearTimeout(getData);
//   } else if (text.length == 0) {
//     const getData = setTimeout(() => {
//       templateList("", 1);
//       setPage(1);
//     }, 1000);
//     return () => clearTimeout(getData);
//   }
// };
