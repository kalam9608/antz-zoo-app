import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import SummaryHeader from "../../components/SummaryHeader";
import AssessmentTemplateInsight from "../../components/AssessmentTemplateInsight";
import AssessmentTemplateCreaterInfo from "../../components/AssessmentTemplateCreaterInfo";
import SubmitBtn from "../../components/SubmitBtn";
import Loader from "../../components/Loader";
import ListEmpty from "../../components/ListEmpty";
import {
  assessmentTemplateDetails,
  assessmentTemplateSpeciesList,
  assessmentTemplateTaxonList,
  assessmentTemplateTypesList,
  deleteAssessmentTemplateTaxon,
} from "../../services/assessmentService/AssessmentTemplate";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { opacityColor } from "../../utils/Utils";
import BottomSheetModalComponent from "../../components/BottomSheetModalComponent";
import InsideBottomsheet from "../../components/Move_animal/InsideBottomsheet";
import ViewAllTaxonSheet from "../../components/ViewAllTaxonSheet";
import TaxonCustomCard from "../../components/TaxonCustomCard";
import { errorToast, successToast } from "../../utils/Alert";

const AssessmentTemplateDetails = (props) => {
  const [activeTab, setActiveTab] = useState("Types");
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const onTabChange = (newTab) => {
    setActiveTab(newTab);
  };
  const [assessmentTempDetails, setAssessmentTempDetails] = useState([]);
  const [assessmentTempTypeList, setAssessmentTempTypeList] = useState([]);
  const assessmentTempId = props?.route?.params.assessmentTemplateId;

  useEffect(() => {
    if (activeTab === "Info" && assessmentTempDetails?.length == 0) {
      assessmentDetails();
    } else if (activeTab === "Types" && assessmentTempTypeList?.length == 0) {
      assessmentDetails();
      setIsLoading(true);
      templateTypesList();
    }
  }, [activeTab]);

  const assessmentDetails = () => {
    setIsDetailsLoading(true);
    const obj = {
      assessment_template_id: assessmentTempId,
    };
    assessmentTemplateDetails(obj)
      .then((res) => {
        if (res.success) {
          setAssessmentTempDetails(res?.data);
        } else {
          navigation.goBack();
          errorToast("error", "Oops!! No data found!!");
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
      })
      .finally(() => {
        setIsDetailsLoading(false);
      });
  };

  const templateTypesList = () => {
    const obj = {
      assessment_template_id: assessmentTempId,
    };
    assessmentTemplateTypesList(obj)
      .then((res) => {
        if (res.success) {
          setAssessmentTempTypeList(res?.data?.assessment_category);
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
  const assessmentTempTypeListMapped = assessmentTempTypeList?.flatMap(
    (item) => item.assessment_types
  );

  return (
    <View style={{ flex: 1 }}>
      <Loader visible={isLoading || isDetailsLoading} />
      <SummaryHeader
        title={"Templates"}
        hideMenu={true}
        deleteMedical={false}
        backPressButton={true}
        duplicate={true}
        editAssessmentTemplate={true}
        editAssessment={() =>
          navigation.replace("AddAssessmentTemplate", {
            assessmentTempDetails: assessmentTempDetails,
            assessmentTemplateId: assessmentTempId,
            edittemplate: "edit",
          })
        }
        style={{ backgroundColor: constThemeColor.onPrimaryContainer }}
        styleText={{ alignItems: "flex-start", marginLeft: Spacing.major }}
        onPressBack={() => navigation.goBack()}
        editIconColor={constThemeColor.onPrimary}
        duplicatePress={() =>
          navigation.replace("AddAssessmentTemplate", {
            assessmentTempDetails: assessmentTempDetails,
            assessmentTemplateId: assessmentTempId,
            duplicateTemp: "copy",
          })
        }
      />
      <View style={dynamicStyles.assessmentContainer}>
        <View style={dynamicStyles.titleContainer}>
          <Text
            style={dynamicStyles.assessmentText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {assessmentTempDetails?.template_name}
          </Text>
        </View>
        <AssessmentTemplateInsight
          activeTab={activeTab}
          onTabChange={onTabChange}
          typesCount={assessmentTempDetails?.assigned_assessment_types ?? "0"}
          speciesCount={assessmentTempDetails?.assigned_species_count ?? "0"}
        />
      </View>

      {activeTab === "Info" ? (
        <Info assessmentTempDetails={assessmentTempDetails} />
      ) : null}

      {activeTab === "Types" ? (
        <Types
          assessmentTempTypeList={assessmentTempTypeList}
          assessmentTempTypeListMapped={assessmentTempTypeListMapped}
          assessmentTempId={assessmentTempId}
        />
      ) : null}

      {activeTab === "Species" ? (
        <Species
          assessmentTempId={assessmentTempId}
          isLoading={isLoading}
          updateIsLoading={setIsLoading}
          isFocused={activeTab === "Species" && isFocused}
          reloadDetails={assessmentDetails}
          speciesCount={Number(
            assessmentTempDetails?.assigned_species_count ?? "0"
          )}
        />
      ) : null}
    </View>
  );
};

export default AssessmentTemplateDetails;

const Info = ({ assessmentTempDetails }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: constThemeColor.background }}
    >
      <View style={dynamicStyles.descriptionContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={dynamicStyles.descriptionTitle}>{"Description"}</Text>
        </View>
        <Text style={dynamicStyles.descriptionValueText}>
          {assessmentTempDetails?.description}
        </Text>
      </View>

      {assessmentTempDetails ? (
        <AssessmentTemplateCreaterInfo
          profilePicture={assessmentTempDetails?.user_profile_pic}
          userName={assessmentTempDetails?.user_full_name}
          dateTime={assessmentTempDetails?.created_on}
          assessmentTempDetails={assessmentTempDetails}
        />
      ) : null}
    </ScrollView>
  );
};

const Types = ({ assessmentTempTypeList }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  const assessmentTemplate = useRef(null);
  const assessmentTemplateAllTypeList = useRef(null);
  const [templateTypeName, setTemplateTypeName] = useState("");
  const [templateTypeData, setTemplateTypeData] = useState([]);
  const [assessmentTempTypeListData, setAssessmentTempTypeListData] = useState(
    []
  );
  const navigation = useNavigation();
  const modalOpenForCategoryWiseTypeList = (item) => {
    assessmentTemplate.current.present();
    setassessmentTypeIdModal(true);
    setTemplateTypeName(item?.label + " - " + item?.assessment_type_count);
    setTemplateTypeData(item?.assessment_types);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [assessmentTypeModal, setassessmentTypeModal] = useState(false);
  const [assessmentTypeIdModal, setassessmentTypeIdModal] = useState(false);
  const handleSearch = (text) => {
    setSearchQuery(text);
    setTimeout(() => {
      if (text.length > 2) {
        const filtered = assessmentTempTypeListData?.filter((item) =>
          item.assessments_type_label.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
      } else {
        setFilteredData([]);
      }
    }, 1000);
  };
  console.log(filteredData);
  const modalOpenAllTypeList = () => {
    assessmentTemplateAllTypeList.current.present();
    setassessmentTypeModal(true);
    setTemplateTypeName("Search Assessment Template Types");
    setAssessmentTempTypeListData(
      assessmentTempTypeList?.flatMap((item) =>
        item.assessment_types.flatMap((arr) => arr)
      )
    );
  };
  // These all function is used for close the bottom sheet
  const searchAllAssessmentClose = () => {
    assessmentTemplateAllTypeList.current.close();
    setassessmentTypeModal(false);
  };
  const searchAllAssessmentTypeIdClose = () => {
    assessmentTemplate.current.close();
    setassessmentTypeIdModal(false);
  };
  useEffect(() => {
    const backAction = () => {
      if (assessmentTypeModal || assessmentTypeIdModal) {
        searchAllAssessmentClose();
        searchAllAssessmentTypeIdClose();
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
  }, [navigation, assessmentTypeModal, assessmentTypeIdModal]);
  const TypeListItem = ({ title, count, item }) => (
    <TouchableOpacity
      style={dynamicStyles.typeListContainer}
      onPress={() => modalOpenForCategoryWiseTypeList(item)}
    >
      <Text style={[dynamicStyles.typeTitle, { flex: 1 }]}>{title}</Text>
      <Text style={[dynamicStyles.typeTitle, { marginRight: Spacing.major }]}>
        {count}
      </Text>
      {count == 0 ? null : (
        <MaterialIcons
          name={"chevron-right"}
          size={24}
          color={constThemeColor.onSurfaceVariant}
        />
      )}
    </TouchableOpacity>
  );
  return (
    <View style={dynamicStyles.typesMainContainer}>
      <TouchableOpacity onPress={() => modalOpenAllTypeList()}>
        <View style={dynamicStyles.countTypeContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                paddingLeft: Spacing.body,
                color: constThemeColor.onPrimaryContainer,
              }}
            >
              Search
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
          marginTop: 6,
        }}
      >
        <FlatList
          data={assessmentTempTypeList}
          keyExtractor={(item) => item?.assessment_category_id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmpty />}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => {
            return (
              <>
                <TypeListItem
                  title={item?.label}
                  count={item?.assessment_type_count}
                  item={item}
                />
              </>
            );
          }}
        />
      </View>
      <BottomSheetModalComponent ref={assessmentTemplate}>
        <InsideBottomsheet
          title={templateTypeName}
          type={"assessmentType"}
          assessmentTypeData={templateTypeData}
          CloseBottomSheet={() => assessmentTemplate.current.close()}
          searchRemoveFromTemp={"searchRemoveTemplate"}
          removeRightIcon={false}
          navigateTodetails={() => {}}
        />
      </BottomSheetModalComponent>
      <BottomSheetModalComponent ref={assessmentTemplateAllTypeList}>
        <InsideBottomsheet
          title={templateTypeName}
          type={"assessmentType"}
          assessmentTypeData={
            filteredData?.length > 0 ? filteredData : assessmentTempTypeListData
          }
          CloseBottomSheet={() => assessmentTemplateAllTypeList.current.close()}
          removeRightIcon={false}
          navigateTodetails={() => {}}
          handelSearch={handleSearch}
          searchText={searchQuery}
        />
      </BottomSheetModalComponent>
    </View>
  );
};

const Species = ({
  assessmentTempId,
  isLoading,
  updateIsLoading,
  isFocused,
  reloadDetails,
  speciesCount,
}) => {
  const [taxonDetails, setTaxonDetails] = useState(null);
  const [assessmentTempSpeciesList, setAssessmentTempSpeciesList] = useState(
    []
  );
  const [totalSpeciesCount, setTotalSpeciesCount] = useState(0);
  const [speciesPage, setSpeciesPage] = useState(1);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [stopSpeciesListCall, setStopSpeciesListCall] = useState(false);
  const [viewAllType, setViewAllType] = useState(null);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);

  const { navigate } = useNavigation();

  const viewTaxonModalRef = useRef();
  const [activeTab, setActiveTab] = useState(1);

  const handleTabPress = (tabNumber) => {
    setActiveTab(tabNumber);
  };
  const loadSpecies = () => {
    updateIsLoading(true);
    setSpeciesPage(1);
    getTemplateSpecies(1);
  };

  const loadTaxon = () => {
    updateIsLoading(true);
    getTemplateTaxon();
  };

  useEffect(() => {
    if (isFocused) {
      if (activeTab === 1) {
        loadSpecies();
        if (taxonDetails === null) {
          loadTaxon();
        }
      } else if (activeTab === 2) {
        loadTaxon();
      }
    }
  }, [activeTab, isFocused]);

  const getTemplateSpecies = (pageNo) => {
    const obj = {
      assessment_template_id: assessmentTempId,
      page_no: pageNo,
    };
    assessmentTemplateSpeciesList(obj)
      .then((res) => {
        // console.log('res', res?.data);
        if (res?.success) {
          if (pageNo === 1) {
            setAssessmentTempSpeciesList(res?.data?.result);
          } else {
            setAssessmentTempSpeciesList(
              assessmentTempSpeciesList.concat(res?.data?.result ?? [])
            );
          }
          const TotalSpeciesCount = Number(res?.data?.total_count ?? "0");
          if (TotalSpeciesCount !== speciesCount) {
            reloadDetails();
          }
          setTotalSpeciesCount(TotalSpeciesCount);
          setStopSpeciesListCall(res?.data?.result === undefined);
        } else {
          errorToast("error", "Something went wrong");
        }
      })
      .catch((e) => {
        errorToast("error", "Something went wrong");
      })
      .finally(() => {
        setIsMoreLoading(false);
        updateIsLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (!isLoading && !isMoreLoading && !stopSpeciesListCall) {
      const nextPage = speciesPage + 1;
      setIsMoreLoading(true);
      getTemplateSpecies(nextPage);
      setSpeciesPage(nextPage);
    }
  };
  const renderFooter = () => {
    if (isMoreLoading)
      return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
    return null;
  };
  const getTemplateTaxon = () => {
    const obj = {
      assessment_template_id: assessmentTempId,
      page_no: 1,
      ref_type: "all",
    };
    assessmentTemplateTaxonList(obj)
      .then((res) => {
        // console.log('res', res?.data);
        if (res?.success) {
          setTaxonDetails(res?.data ?? null);
          if (JSON.stringify(res?.data ?? null) !== JSON.stringify(taxonDetails)) {
            reloadDetails();
          }
        } else {
          errorToast("error", "Something went wrong");
        }
      })
      .catch((e) => {
        errorToast("error", "Something went wrong");
      })
      .finally((e) => {
        updateIsLoading(false);
      });
  };

  const deleteTemplateTaxon = (id) => {
    const obj = {
      id: id,
      reason_to_delete: "delete",
    };
    // console.log('obj', obj);
    deleteAssessmentTemplateTaxon(obj)
      .then((res) => {
        // console.log('deleteTemplateTaxon res :: ', res);
        if (res?.success) {
          successToast("Success", res?.message ?? "");
          if (activeTab === 1) loadSpecies();
          else if (activeTab === 2) loadTaxon();
        } else {
          errorToast("error", "Something went wrong");
        }
      })
      .catch((e) => {
        errorToast("error", "Something went wrong");
      })
      .finally((e) => {
        updateIsLoading(false);
      });
  };

  const TaxonSectionWrapper = ({ title, containerStyle, content, count }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <View style={[dynamicStyles.taxonSectionContainer, containerStyle]}>
        <TouchableOpacity
          onPress={() => setIsExpanded((prev) => !prev)}
          style={dynamicStyles.taxonSectionHeaderContainer}
        >
          <Text style={dynamicStyles.taxonSectionTitleText}>{title}</Text>
          {count ? (
            <Text style={[dynamicStyles.taxonSectionTitleText, { flex: 0.25 }]}>
              {count}
            </Text>
          ) : null}
          <MaterialIcons
            name={"keyboard-arrow-down"}
            size={24}
            color={constThemeColor.onSurfaceVariant}
          />
        </TouchableOpacity>
        {isExpanded ? content : null}
      </View>
    );
  };

  // const SpeciesTab = () => {
  //   return (
  //     <View style={dynamicStyles.speciesTabContainer}>
  //       <SubmitBtn
  //         buttonText={"Add Taxon"}
  //         iconName={"plus"}
  //         backgroundColor={constThemeColor.secondary}
  //         color={constThemeColor.onError}
  //         fontSize={FontSize.Antz_Minor_Medium.fontSize}
  //         fontWeight={FontSize.Antz_Minor_Medium.fontWeight}
  //         onPress={() => {
  //           navigate("AddTaxon", { assessmentTempId: assessmentTempId });
  //         }}
  //       />
  //       <View style={dynamicStyles.speciesCardsListContainer}>
  //         <FlatList
  //           data={assessmentTempSpeciesList}
  //           showsVerticalScrollIndicator={false}
  //           renderItem={({ item }) => {
  //             return (
  //               <TaxonCustomCard
  //                 pictureUri={item?.default_icon ?? ""}
  //                 title={item?.common_name ?? ""}
  //                 scientificName={item?.scientific_name ?? ""}
  //                 showCancelButton={true}
  //                 onCancelPress={() => {
  //                   updateIsLoading(true);
  //                   deleteTemplateTaxon(item?.id ?? "");
  //                 }}
  //               />
  //             );
  //           }}
  //           keyExtractor={(item, index) => `${item?.tsn}${index}`}
  //           ListEmptyComponent={<ListEmpty />}
  //           onEndReachedThreshold={0.1}
  //           onEndReached={handleLoadMore}
  //           ListFooterComponent={renderFooter}
  //         />
  //       </View>
  //     </View>
  //   );
  // };

  const TaxonTab = () => {
    return (
      <View
        style={[
          dynamicStyles.taxonTabContainer,
          { backgroundColor: constThemeColor.background },
        ]}
      >
        <SubmitBtn
          buttonText={"Add Taxon"}
          iconName={"plus"}
          backgroundColor={constThemeColor.secondary}
          color={constThemeColor.onError}
          fontSize={FontSize.Antz_Minor_Medium.fontSize}
          fontWeight={FontSize.Antz_Minor_Medium.fontWeight}
          onPress={() => {
            navigate("AddTaxon", {
              assessmentTempId: assessmentTempId,
              taxonDetails: taxonDetails,
            });
          }}
        />

        {taxonDetails !== null ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: Spacing.body, flex: 1 }}
          >
            {taxonDetails?.class?.items?.length > 0 ? (
              <TaxonSectionWrapper
                title={"Class"}
                content={
                  <FlatList
                    data={taxonDetails?.class?.items ?? []}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TaxonCustomCard
                        pictureUri={item?.default_icon ?? ""}
                        title={
                          item?.common_name
                            ? item?.common_name
                            : item?.scientific_name ?? ""
                        }
                        showCancelButton={true}
                        onCancelPress={() => {
                          updateIsLoading(true);
                          deleteTemplateTaxon(item?.id ?? "");
                        }}
                      />
                    )}
                    keyExtractor={(item, index) => index?.toString()}
                  />
                }
              />
            ) : null}

            {taxonDetails?.order?.items?.length > 0 ? (
              <TaxonSectionWrapper
                title={"Order"}
                content={
                  <FlatList
                    data={taxonDetails?.order?.items ?? []}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TaxonCustomCard
                        pictureUri={item?.default_icon ?? ""}
                        title={
                          item?.common_name
                            ? item?.common_name
                            : item?.scientific_name ?? ""
                        }
                        showCancelButton={true}
                        v
                        onCancelPress={() => {
                          updateIsLoading(true);
                          deleteTemplateTaxon(item?.id ?? "");
                        }}
                      />
                    )}
                    keyExtractor={(item, index) => index?.toString()}
                  />
                }
              />
            ) : null}

            {taxonDetails?.family?.items?.length > 0 ? (
              <TaxonSectionWrapper
                title={"Family"}
                content={
                  <FlatList
                    data={taxonDetails?.family?.items ?? []}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TaxonCustomCard
                        pictureUri={item?.default_icon ?? ""}
                        title={
                          item?.common_name
                            ? item?.common_name
                            : item?.scientific_name ?? ""
                        }
                        showCancelButton={true}
                        onCancelPress={() => {
                          updateIsLoading(true);
                          deleteTemplateTaxon(item?.id ?? "");
                        }}
                      />
                    )}
                    keyExtractor={(item, index) => index?.toString()}
                  />
                }
              />
            ) : null}

            {taxonDetails?.genus?.items?.length > 0 ? (
              <TaxonSectionWrapper
                title={"Genus"}
                content={
                  <View>
                    <FlatList
                      data={taxonDetails?.genus?.items ?? []}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <TaxonCustomCard
                          pictureUri={item?.default_icon ?? ""}
                          title={
                            item?.common_name
                              ? item?.common_name
                              : item?.scientific_name ?? ""
                          }
                          showCancelButton={true}
                          onCancelPress={() => {
                            updateIsLoading(true);
                            deleteTemplateTaxon(item?.id ?? "");
                          }}
                        />
                      )}
                      keyExtractor={(item, index) => index?.toString()}
                    />
                    {taxonDetails?.genus?.items?.length > 3 ? (
                      <TouchableOpacity
                        onPress={() => {
                          setViewAllType("genus");
                          viewTaxonModalRef?.current?.present();
                        }}
                        style={dynamicStyles.viewAllButtonContainer}
                      >
                        <Text
                          style={dynamicStyles.viewAllButtonTitle}
                        >{`View all ${taxonDetails?.genus?.items?.length} Genus`}</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                }
              />
            ) : null}

            {taxonDetails?.species?.items?.length > 0 ? (
              <TaxonSectionWrapper
                title={"Species"}
                content={
                  <View>
                    <FlatList
                      data={taxonDetails?.species?.items ?? []}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <TaxonCustomCard
                          pictureUri={item?.default_icon ?? ""}
                          title={item?.common_name ?? ""}
                          scientificName={item?.scientific_name ?? ""}
                          showCancelButton={true}
                          onCancelPress={() => {
                            updateIsLoading(true);
                            deleteTemplateTaxon(item?.id ?? "");
                          }}
                        />
                      )}
                      keyExtractor={(item, index) => index?.toString()}
                    />
                    {taxonDetails?.species?.items?.length > 3 ? (
                      <TouchableOpacity
                        onPress={() => {
                          setViewAllType("species");
                          viewTaxonModalRef?.current?.present();
                        }}
                        style={dynamicStyles.viewAllButtonContainer}
                      >
                        <Text style={dynamicStyles.viewAllButtonTitle}>
                          {`View all ${taxonDetails?.species?.items?.length} species`}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                }
              />
            ) : null}
          </ScrollView>
        ) : null}

        <BottomSheetModalComponent ref={viewTaxonModalRef}>
          <ViewAllTaxonSheet
            taxonDetails={taxonDetails}
            viewAllType={viewAllType}
            onClosePress={() => {
              viewTaxonModalRef?.current?.close();
            }}
          />
        </BottomSheetModalComponent>
      </View>
    );
  };

  return (
    <View style={dynamicStyles.speciesMainContainer}>
      <View style={dynamicStyles.tabContainer}>
        <TouchableOpacity
          style={[
            dynamicStyles.tabButton,
            activeTab === 1 && dynamicStyles.activeTab,
          ]}
          onPress={() => handleTabPress(1)}
        >
          <Text style={dynamicStyles.tabText}>Species</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            dynamicStyles.tabButton,
            activeTab === 2 && dynamicStyles.activeTab,
          ]}
          onPress={() => handleTabPress(2)}
        >
          <Text style={dynamicStyles.tabText}>Taxon</Text>
        </TouchableOpacity>
      </View>
      <View style={dynamicStyles.dataContainer}>
        {activeTab === 1 && (
          <View style={dynamicStyles.speciesTabContainer}>
            <SubmitBtn
              buttonText={"Add Taxon"}
              iconName={"plus"}
              backgroundColor={constThemeColor.secondary}
              color={constThemeColor.onError}
              fontSize={FontSize.Antz_Minor_Medium.fontSize}
              fontWeight={FontSize.Antz_Minor_Medium.fontWeight}
              onPress={() => {
                navigate("AddTaxon", { assessmentTempId: assessmentTempId });
              }}
            />
            <View style={dynamicStyles.speciesCardsListContainer}>
              <FlatList
                data={assessmentTempSpeciesList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  return (
                    <TaxonCustomCard
                      pictureUri={item?.default_icon ?? ""}
                      title={item?.common_name ?? ""}
                      scientificName={item?.scientific_name ?? ""}
                      showCancelButton={true}
                      onCancelPress={() => {
                        updateIsLoading(true);
                        deleteTemplateTaxon(item?.id ?? "");
                      }}
                    />
                  );
                }}
                keyExtractor={(item, index) => `${item?.tsn}${index}`}
                ListEmptyComponent={<ListEmpty />}
                onEndReachedThreshold={0.1}
                onEndReached={handleLoadMore}
                ListFooterComponent={renderFooter}
              />
            </View>
          </View>
        )}
        {activeTab === 2 && <TaxonTab />}
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
      paddingBottom: Spacing.major + Spacing.minor,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    assessmentText: {
      ...FontSize.Antz_Major_Medium,
      color: reduxColors.onPrimary,
      // backgroundColor: opacityColor(reduxColors.onPrimary, 10),
      paddingHorizontal: Spacing.small,
      paddingVertical: 2,
      borderRadius: Spacing.mini,
      paddingTop: 0,
    },
    descriptionContainer: {
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.displaybgSecondary,
      margin: Spacing.minor,
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.minor - 2,
    },
    descriptionTitle: {
      ...FontSize.Antz_Body_Regular,
      color: reduxColors.neutralSecondary,
    },
    descriptionValueText: {
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.onPrimaryContainer,
      marginTop: Spacing.mini,
    },
    typesMainContainer: {
      flex: 1,
      backgroundColor: reduxColors.background,
    },
    searchContainer: {
      marginVertical: 0,
      marginBottom: Spacing.minor,
      height: 48,
      paddingLeft: Spacing.small,
      backgroundColor: reduxColors.surface,
      borderRadius: 0,
      shadowColor: reduxColors.neutralPrimary,
      shadowOpacity: 0.1,
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowRadius: 2,
    },
    typeListContainer: {
      backgroundColor: reduxColors.onPrimary,
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "center",
      marginVertical: Spacing.small,
      padding: Spacing.minor,
      marginHorizontal: Spacing.body,
      borderRadius: Spacing.small,
    },
    typeTitle: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onSurfaceVariant,
    },
    speciesMainContainer: {
      flex: 1,
    },
    speciesTabContainer: {
      flex: 1,
      paddingTop: Spacing.body,
      backgroundColor: reduxColors.onPrimary,
    },
    taxonTabContainer: {
      flex: 1,
      paddingTop: Spacing.body,
    },
    speciesCardsListContainer: {
      flex: 1,
      marginVertical: Spacing.body,
      marginHorizontal: Spacing.minor,
      backgroundColor: reduxColors.onError,
      shadowColor: reduxColors.neutralPrimary,
      shadowOpacity: 0.1,
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowRadius: 2,
    },
    taxonSectionContainer: {
      backgroundColor: reduxColors.onError,
      borderRadius: 8,
      shadowColor: reduxColors.neutralPrimary,
      shadowOpacity: 0.1,
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowRadius: 2,
      marginBottom: Spacing.minor,
      marginHorizontal: Spacing.minor,
    },
    taxonSectionHeaderContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: Spacing.minor + Spacing.micro,
      paddingHorizontal: Spacing.body,
    },
    taxonSectionTitleText: {
      ...FontSize.Antz_Minor_Title,
      color: reduxColors.onSurfaceVariant,
      flex: 1,
    },
    viewAllButtonContainer: {
      paddingVertical: Spacing.body,
      marginTop: Spacing.mini,
      borderTopWidth: 1,
      borderColor: opacityColor(reduxColors.neutralPrimary, 10),
      alignItems: "center",
    },
    viewAllButtonTitle: {
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.onSurface,
    },

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

    container: {
      flex: 1,
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    tabButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    activeTab: {
      borderBottomWidth: 3,
      borderBottomColor: reduxColors.onSurface,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    tabText: {
      fontSize: 16,
    },
    dataContainer: {
      flex: 1,
    },
  });
