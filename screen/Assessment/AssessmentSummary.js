import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import Spacing from "../../configs/Spacing";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import FontSize from "../../configs/FontSize";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import MeasurmentFooterCom from "../Animals/MeasurmentFooterCom";
import AssessmentMeasurList from "../../components/AssessmentMesurList";
import { AssessmentModal } from "../../components/Assessment/AssessmentModalComponent";
import {
  addAssessmentCategory,
  getAssessmentSummary,
  updateAssessmentCategory,
} from "../../services/assessmentService/AssessmentServiceApi";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../../components/Loader";
import moment from "moment";
import Modal from "react-native-modal";
import { opacityColor } from "../../utils/Utils";
import ListEmpty from "../../components/ListEmpty";

const AssessmentSummary = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const userDetails = useSelector(
    (state) => state.UserAuth.userDetails?.user_id
  );
  const [activeTabIndex, setActiveTabIndex] = useState(
    props?.route?.params?.index ? props?.route?.params?.index : 0
  );
  const [routes] = useState(
    props?.route?.params?.subCategory.map((item) => ({
      key: item?.assessment_type_id,
      title: item?.assessment_name,
    }))
  );
  const [selectedTabName, setSelectedTabName] = useState(
    props?.route?.params?.parentItem?.assessment_name
  );
  const [selectedTypeId, setSelectedTypeId] = useState(
    props?.route?.params?.parentItem?.assessment_type_id
  );
  const animalDetails = props?.route?.params?.animalDetails;
  const animalId = props?.route?.params?.animalDetails?.animal_id;
  const subCategory = props?.route?.params?.subCategory;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState("");
  const [listModalData, setListModalData] = useState([]);
  const [dateValue, setDateValue] = useState(new Date());
  const [dateModal, setDateModal] = useState(false);
  const [timeValue, setTimeValue] = useState(new Date());
  const [timeModal, setTimeModal] = useState(false);
  const [addNotes, setAddNotes] = useState("");
  const [unitValue, setUnitValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentSummary, setAssessmentSummary] = useState([]);
  const [addNumericValue, setAddNumericValue] = useState("");
  const [numericValue, setNumericValue] = useState("");
  const [selectedListData, setSelectedListData] = useState([]);
  const [fromAddIcon, setFromAddIcon] = useState(false);
  const [responseTextInput, setResponseTextInput] = useState("");
  const [addResponseTextInput, setAddResponseTextInput] = useState("");
  const [assessmentTypeListDataLength, setAssessmentTypeListDataLength] =
    useState(0);
  const [pageType, setPageType] = useState(1);
  const [assessmentDataCount, setAssessmentDataCount] = useState(0);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const flatListRef = useRef(null);
  const [animalAssessmentId, setAnimalAssesementId] = useState("");
  const [onPressSelectedItem, setOnPressSelectedItem] = useState("");
  const [isResponseTrue, setIsResponseTrue] = useState(false);
  const [assessmentDetail, setAssessmentDetail] = useState("");
  const [assessmentCreatedBy, setAssessmentCreatedBy] = useState("");
  const toggleModal = () => {
    setIsVisible(!isVisible);
  };
  const handleItemPress = (item, newIndex) => {
    setIsVisible(false);
    setActiveTabIndex(newIndex);
    setSelectedTabName(item.title);
    setSelectedTypeId(item.key);
    setAssessmentSummary([]);
  };

  useEffect(() => {
    setIsLoading(true);
    assessmentSummaryApiCall(1);
    setPageType(1);
  }, [selectedTypeId]);
  const assessmentSummaryApiCall = (pageNo) => {
    const obj = {
      assessment_type_id: selectedTypeId,
      page_no: pageNo,
    };
    getAssessmentSummary(animalId, obj)
      .then((res) => {
        if (res.success) {
          let arrData = pageNo == 1 ? [] : assessmentSummary;

          setAssessmentDataCount(
            res?.data?.total_count == undefined ? 0 : res?.data?.total_count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setAssessmentSummary(arrData);
            setAssessmentTypeListDataLength(arrData?.length);
            setIsLoading(false);
          }
        } else {
          setAssessmentTypeListDataLength(assessmentDataCount);
        }
      })
      .catch((error) => {
        console.log("error", "Oops! Something went wrong!");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleLoadMore = () => {
    if (
      !isLoading &&
      assessmentTypeListDataLength >= 10 &&
      assessmentTypeListDataLength !== assessmentDataCount
    ) {
      const nextPage = pageType + 1;
      setPageType(nextPage);
      console.log(nextPage);
      assessmentSummaryApiCall(nextPage);
    }
  };

  const renderFooter = () => {
    if (
      isLoading ||
      assessmentTypeListDataLength < 10 ||
      assessmentTypeListDataLength == assessmentDataCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
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
        userId={userDetails}
        assessmentDetail={assessmentCreatedBy}
      />
    );
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
            setIsModalOpen(!isModalOpen);
            setFromAddIcon(!fromAddIcon);
            setAddNumericValue("");
            setAddResponseTextInput("");
            setAddNotes("");
            assessmentSummaryApiCall(1);
          }
        })
        .catch((err) => {
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      console.log("update button pressed", response);
      updateAssessmentCategory(response, animalId)
        .then((response) => {
          console.log(response);
          if (response?.success) {
            assessmentSummaryApiCall(1);
            setIsModalOpen(!isModalOpen);
            setIsResponseTrue(true);
            setAddNotes("");
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
  const onCancelPress = () => {
    setIsModalOpen(!isModalOpen);
    setFromAddIcon(false);
    setAddNotes("");
  };

  const handleTabPress = (index) => {
    setActiveTabIndex(index);
    const selectedTabName = routes[index].title;
    const selectTypeId = routes[index].key;
    setSelectedTabName(selectedTabName);
    setSelectedTypeId(selectTypeId);
    setAssessmentSummary([]);
  };

  useEffect(() => {
    if (flatListRef.current && activeTabIndex >= 0) {
      const tabWidth = 100;
      const offset = (activeTabIndex - 0.5) * tabWidth;
      flatListRef.current.scrollToOffset({ offset, animated: true });
    }
  }, [activeTabIndex]);
  return (
    <View style={{ flex: 1 }}>
      <Loader visible={isLoading} />
      <Header
        title="Assessment"
        noIcon={true}
        showBackButton={true}
        backgroundColor={(backgroundColor = constThemeColor.background)}
        arrowColor={false}
        hideMenu={true}
      />
      <View style={{ margin: Spacing.micro, marginVertical: -Spacing.mini }}>
        <AnimalCustomCard
          item={animalDetails}
          age={"Age" + " : " + animalDetails?.age}
          extra={animalDetails?.age}
          style={{
            backgroundColor: constThemeColor.background,
          }}
          animalIdentifier={
            !animalDetails?.local_identifier_value
              ? animalDetails?.animal_id
              : animalDetails?.local_identifier_name ?? null
          }
          localID={animalDetails?.local_identifier_value ?? null}
          icon={animalDetails?.default_icon}
          enclosureName={animalDetails?.user_enclosure_name}
          animalName={
            animalDetails?.vernacular_name
              ? animalDetails?.vernacular_name
              : animalDetails?.scientific_name
          }
          sectionName={animalDetails?.section_name}
          show_specie_details={true}
          show_housing_details={true}
          chips={animalDetails?.sex}
          noArrow={true}
        />
      </View>

      <View
        style={{
          backgroundColor: constThemeColor.onPrimary,
          borderBottomWidth: 1,
          borderBottomColor: constThemeColor.outline,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: Spacing.small,
          }}
        >
          <MaterialIcons
            name="segment"
            size={24}
            color={constThemeColor.onSurfaceVariant}
            onPress={toggleModal}
          />
        </View>
        <FlatList
          ref={flatListRef}
          data={routes}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleTabPress(index)}
              style={{
                flex: 1,
                padding: 20,
                alignItems: "center",
                paddingVertical: Spacing.body,
              }}
            >
              <Text
                style={{
                  color:
                    activeTabIndex === index
                      ? constThemeColor.onSurface
                      : constThemeColor.onSurfaceVariant,
                  ...FontSize.Antz_Minor_Regular,
                }}
              >
                {item.title}
              </Text>
              <View
                style={[
                  reduxColors.tabItemIndigator,
                  activeTabIndex === index &&
                    reduxColors.activeTabItemIndigator,
                  ,
                  { width: item?.title.length * 8 },
                ]}
              ></View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<ListEmpty />}
        />
      </View>

      <View style={{ flex: 1, backgroundColor: constThemeColor.onPrimary }}>
        {subCategory.map((items) => {
          return (
            <>
              <View style={{}}>
                {items?.response_type === "list" &&
                selectedTabName == items?.assessment_name ? (
                  <View style={{ marginBottom: 110 }}>
                    <FlatList
                      data={assessmentSummary}
                      keyExtractor={(_, index) => index.toString()}
                      renderItem={({ item, index }) => (
                       
                        <AssessmentMeasurList
                          index={index}
                          item={item}
                          type={items?.response_type}
                          listPress={() => {
                           
                            setOnPressSelectedItem(item);
                            setIsModalOpen(true), setModalData(items);
                            setAnimalAssesementId(item?.id);
                            setAddNotes(item?.comments);
                            setDateValue(
                              moment(
                                item?.record_date,
                                "YYYY-MM-DD HH:mm:ss"
                              ).toISOString()
                            );
                            setTimeValue(
                              moment(item?.record_time, "HH:mm:ss").valueOf()
                            );
                            setAssessmentCreatedBy(item)
                          }}
                        />
                      )}
                      ListEmptyComponent={<ListEmpty />}
                      onEndReached={handleLoadMore}
                      ListFooterComponent={renderFooter}
                    />
                  </View>
                ) : items?.response_type === "numeric_scale" &&
                  selectedTabName == items?.assessment_name ? (
                  <View style={{ marginBottom: 110 }}>
                    <FlatList
                      data={assessmentSummary}
                      keyExtractor={(_, index) => index.toString()}
                      renderItem={({ item, index }) => (
                        <AssessmentMeasurList
                          index={index}
                          item={item}
                          type={items?.response_type}
                          numericScalePress={() => {
                            setOnPressSelectedItem(item);
                            setIsModalOpen(true), setModalData(items);
                            setAnimalAssesementId(item?.id);
                            setAddNotes(item?.comments);
                            setDateValue(
                              moment(
                                item?.record_date,
                                "YYYY-MM-DD HH:mm:ss"
                              ).toISOString()
                            );
                            setTimeValue(
                              moment(item?.record_time, "HH:mm:ss").valueOf()
                            );
                            setAssessmentCreatedBy(item)
                            // setAssessmentDetail(items);
                          }}
                        />
                      )}
                      ListEmptyComponent={<ListEmpty />}
                      onEndReached={handleLoadMore}
                      ListFooterComponent={renderFooter}
                    />
                  </View>
                ) : items?.response_type === "numeric_value" &&
                  selectedTabName == items?.assessment_name ? (
                  <View style={{ marginBottom: 110 }}>
                    <FlatList
                      data={assessmentSummary}
                      keyExtractor={(_, index) => index.toString()}
                      renderItem={({ item, index }) => (
                        <AssessmentMeasurList
                          index={index}
                          item={item}
                          type={items?.response_type}
                          numericValuePress={() => {
                            console.log("===================>",item),
                            setIsModalOpen(true),
                              setNumericValue(item?.assessment_value);
                            setUnitValue(item?.assessment_unit_id);
                            setModalData(items);
                            setAnimalAssesementId(item?.id);
                            setAddNotes(item?.comments);
                            setDateValue(
                              moment(
                                item?.record_date,
                                "YYYY-MM-DD HH:mm:ss"
                              ).toISOString()
                            );
                            setTimeValue(
                              moment(item?.record_time, "HH:mm:ss").valueOf()
                            );
                            setAssessmentCreatedBy(item)
                          }}
                        />
                      )}
                      ListEmptyComponent={<ListEmpty />}
                      onEndReached={handleLoadMore}
                      ListFooterComponent={renderFooter}
                    />
                  </View>
                ) : items?.response_type === "text" &&
                  selectedTabName == items?.assessment_name ? (
                  <View style={{ marginBottom: 110 }}>
                    <FlatList
                      data={assessmentSummary}
                      keyExtractor={(_, index) => index.toString()}
                      renderItem={({ item, index }) => (
                        <AssessmentMeasurList
                          index={index}
                          item={item}
                          type={items?.response_type}
                          textPress={() => {
                            setOnPressSelectedItem(item);
                            setIsModalOpen(true), setModalData(items);
                            setAnimalAssesementId(item?.id);
                            setResponseTextInput(item?.assessment_value);
                            setAddNotes(item?.comments);
                            setDateValue(
                              moment(
                                item?.record_date,
                                "YYYY-MM-DD HH:mm:ss"
                              ).toISOString()
                            );
                            setTimeValue(
                              moment(item?.record_time, "HH:mm:ss").valueOf()
                            );
                            setAssessmentCreatedBy(item)
                          }}
                        />
                      )}
                      ListEmptyComponent={<ListEmpty />}
                      onEndReached={handleLoadMore}
                      ListFooterComponent={renderFooter}
                    />
                  </View>
                ) : null}
              </View>
              {(items?.response_type === "numeric_value" &&
                selectedTabName == items?.assessment_name) ||
              (items?.response_type === "numeric_scale" &&
                selectedTabName == items?.assessment_name) ||
              (items?.response_type === "text" &&
                selectedTabName == items?.assessment_name) ||
              (items?.response_type === "list" &&
                selectedTabName == items?.assessment_name) ? (
                <MeasurmentFooterCom
                  name={`Add New ${selectedTabName}`}
                  onPress={() => {
                    setIsModalOpen(true),
                      setModalData(items),
                      setFromAddIcon(true);
                    if (
                      items?.response_type === "numeric_scale" ||
                      items?.response_type === "list"
                    ) {
                      setListModalData(items?.data);
                    }
                  }}
                />
              ) : null}
            </>
          );
        })}
      </View>
      {modalHandler()}

      <Modal
        isVisible={isVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        propagateSwipe={true}
        hideModalContentWhileAnimating={true}
        swipeThreshold={90}
        swipeDirection={"down"}
        animationInTiming={400}
        animationOutTiming={100}
        useNativeDriver={true}
        style={{
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "90%",
            minHeight: "30%",
            maxHeight: "50%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginBottom: 10,
                ...FontSize.Antz_Minor_Medium,
                color: constThemeColor.onPrimaryContainer,
              }}
            >
              Total assessment types
            </Text>
            <Text
              style={{
                marginBottom: 10,
                ...FontSize.Antz_Minor_Medium,
                color: constThemeColor.onPrimaryContainer,
              }}
            >
              {subCategory?.length}
            </Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {routes?.map((item, index) => {
              return (
                <TouchableOpacity onPress={() => handleItemPress(item, index)}>
                  <View
                    style={{
                      backgroundColor: opacityColor(
                        constThemeColor.neutralPrimary,
                        5
                      ),
                      marginBottom: Spacing.body,
                      borderRadius: Spacing.mini,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: Spacing.body,
                    }}
                  >
                    <Text
                      style={{
                        ...FontSize.Antz_Body_Medium,
                        color: constThemeColor.onPrimaryContainer,
                      }}
                    >
                      {item?.title}
                    </Text>
                    {activeTabIndex == index ? (
                      <Feather name="check" size={22} color="black" />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default AssessmentSummary;

const styles = (reduxColors) =>
  StyleSheet.create({
    activeTabItemIndigator: {
      borderBottomWidth: 3,
      borderBottomColor: reduxColors.onSurface,

      borderTopRightRadius: Spacing.body,
      borderTopLeftRadius: Spacing.body,
      position: "absolute",
      bottom: 0,
    },
    tabItemIndigator: {},
  });
