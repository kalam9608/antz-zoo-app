import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { G, SvgXml } from "react-native-svg";
import moment from "moment";
import {
  AntDesign,
  MaterialIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectDropdown from "react-native-select-dropdown";
import DateIcon from "../../assets/DateIcon.svg";
import TimeIcon from "../../assets/TimeIcon.svg";
import { useFocusEffect } from "@react-navigation/native";
import {
  getMeasurmentUnit,
  getMeasurmentListUnit,
} from "../../services/AnimalService";
import { getAsyncData } from "../../utils/AsyncStorageHelper";

export const AssessmentModal = ({
  isModalOpen,
  fromAddIcon,
  onClosePress,
  modalData,
  onCancelPress,
  onAddEntryPress,
  responseTextInput,
  addResponseTextInput,
  onChangeAddResponseTextInput,
  onChangeResponseTextInput,
  addNotes,
  onChangeAddNotesInput,
  unitValue,
  numericValue,
  onChangeNumericValue,
  onDateModalPress,
  dateValue,
  dateModal,
  onDateConfirmPress,
  onDateCancelPress,
  onTimeModalPress,
  timeValue,
  timeModal,
  onTimeConfirmPress,
  onTimeCancelPress,
  listModalData,
  addNumericValue,
  onChangeAddNumericValue,
  selectedItem,
  onPressSelectedItem,
  isResponseTrue,
  selectedUnitId,
  userId,
  assessmentDetail,
}) => {
  const height = Dimensions.get("window").height;
  const themeColors = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = Styles(themeColors);
  const [up, setUp] = useState(false);
  const [listData, setListData] = useState([]);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const date = new Date();
  const currentDate = moment(date).format("YYYY-MM-DD");
  const convertDateValue = moment(dateValue).format("YYYY-MM-DD");
  const [unitList, setUnitList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [diplayUnitValue, setDisplayUnitvalue] = useState("");
  const [measurementList, setMeasurementList] = useState([]);
  const [isUnitSelectedId, setIsUnitSelected] = useState("")

  useFocusEffect(
    React.useCallback(() => {
      if (isResponseTrue) {
        setIsUnitSelected("")
        setIsItemSelected(false);
      }
    }, [modalData])
  );

  useEffect(() => {
    setListData(modalData?.default_values);
    if (modalData?.measurement_type?.length > 0) {
      // fetchUnit();
      fetchMeasurementList();
    }
  }, [isModalOpen]);

  const fetchMeasurementList = () => {
    getMeasurmentListUnit()
      .then((res) => {
        if (res?.success) {
          const filterListData = res?.data?.filter(
            (item) => item?.measurement_type == modalData?.measurement_type
          );
          const filterItemData = filterListData?.filter(
            (item) => item?.id == unitValue
          );
          setDisplayUnitvalue(filterItemData[0]?.uom_abbr);
          setMeasurementList(filterListData);
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

  // const fetchUnit = () => {
  //   getMeasurmentUnit(modalData?.measurement_type)
  //     .then((res) => {
  //       if (res?.success) {
  //         const filterData = res?.data?.filter((item) => item?.id == unitValue);
  //         console.log("unitValue=====>", filterData[0]?.uom_abbr)
  //         setDisplayUnitvalue(filterData[0]?.uom_abbr);
  //         setUnitList(res?.data);
  //       }
  //     })
  //     .catch((e) => {
  //       //errorToast("error", "Something went wrong");
  //       setIsLoading(false);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  const renderModalHeader = () => (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: modalData?.description ? Spacing.minor : 0,
        }}
      >
        <View>
          <Text
            style={[
              reduxColors.mediumText,
              { color: themeColors?.onPrimaryContainer },
            ]}
          >
            {modalData?.assessment_name}
          </Text>
          <Text
            style={[
              reduxColors.microRegularText,
              {
                color: themeColors?.onSurfaceVariant,
                marginTop: 2,
              },
            ]}
          >
            {modalData?.assessment_category_name}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            onClosePress(), setIsItemSelected(false);
          }}
        >
          <AntDesign name="close" size={24} color={themeColors?.onSurface} />
        </TouchableOpacity>
      </View>
      {modalData?.description ? (
        <Text
          style={[
            reduxColors.regularText,
            {
              color: themeColors?.onSurfaceVariant,
              //marginBottom: Spacing.minor,
            },
          ]}
        >
          {modalData?.description}
        </Text>
      ) : null}
      <View style={reduxColors.divider} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: Spacing.minor,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={reduxColors.dateTimeContainer}
          onPress={onDateModalPress}
        >
          <SvgXml
            xml={DateIcon}
            width="24"
            height="24"
            style={reduxColors.image}
          />

          {fromAddIcon ? (
            <Text
              style={[
                reduxColors?.minorMediumText,
                {
                  color: themeColors?.onPrimaryContainer,
                  marginLeft: 5,
                },
              ]}
            >
              {dateValue
                ? moment(dateValue).format("D MMM YYYY")
                : moment(new Date()).format("D MMM YYYY")}
            </Text>
          ) : (
            <Text
              style={[
                reduxColors?.minorMediumText,
                {
                  color: themeColors?.onPrimaryContainer,
                  marginLeft: 5,
                },
              ]}
            >
              {moment(dateValue).format("D MMM YYYY")}
            </Text>
          )}

          {dateModal && (
            <DateTimePickerModal
              isVisible={dateModal}
              mode="date"
              onConfirm={onDateConfirmPress}
              onCancel={onDateCancelPress}
              maximumDate={new Date()}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={reduxColors.dateTimeContainer}
          onPress={onTimeModalPress}
        >
          <SvgXml
            xml={TimeIcon}
            width="24"
            height="24"
            style={reduxColors.image}
          />
          {fromAddIcon ? (
            <Text
              style={[
                reduxColors?.minorMediumText,
                {
                  color: themeColors?.onPrimaryContainer,
                  marginLeft: 5,
                },
              ]}
            >
              {timeValue
                ? moment(timeValue).format("LT")
                : moment(new Date()).format("LT")}
            </Text>
          ) : (
            <Text
              style={[
                reduxColors?.minorMediumText,
                {
                  color: themeColors?.onPrimaryContainer,
                  marginLeft: 5,
                },
              ]}
            >
              {moment(timeValue).format("LT")}
            </Text>
          )}

          {timeModal && (
            <DateTimePickerModal
              isVisible={timeModal}
              mode="time"
              onConfirm={onTimeConfirmPress}
              onCancel={onTimeCancelPress}
              maximumDate={
                currentDate === convertDateValue ? new Date() : undefined
              }
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNotes = () => (
    <TextInput
      value={addNotes}
      onChangeText={onChangeAddNotesInput}
      multiline
      style={[
        reduxColors.inputContainer,
        {
          borderColor: themeColors?.moderateSecondary,
          backgroundColor: themeColors?.notes,
          marginBottom: Spacing.minor,
          color: "#4A0415",
        },
      ]}
      placeholder="Add Notes"
      placeholderTextColor={themeColors?.onErrorContainer}
    />
  );

  const renderViewModalFooter = () => {
    const convertDate = moment(
      assessmentDetail?.record_date,
      "YYYY-MM-DD HH:mm:ss"
    ).toISOString();
    const convertedTime = moment(
      assessmentDetail?.record_time,
      "HH:mm:ss"
    ).valueOf();

    return (
      <View
        style={{
          marginVertical: addNotes && Spacing.minor,
          marginBottom: Spacing.minor,
        }}
      >
        <Text
          style={[
            reduxColors?.smallRegularText,
            { color: themeColors?.onSurfaceVariant },
          ]}
        >
          Recorded by
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: Spacing.mini,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: assessmentDetail?.user_profile_pic }}
              resizeMode="cover"
              style={reduxColors?.avatarStyle}
            />

            <Text
              style={[
                reduxColors.microRegularText,
                {
                  color: themeColors?.onSurfaceVariant,
                  marginLeft: Spacing.mini,
                },
              ]}
            >
              {assessmentDetail?.user_full_name}
            </Text>
          </View>

          <View>
            <Text
              style={[
                reduxColors.microRegularText,
                {
                  color: themeColors?.onSurfaceVariant,
                },
              ]}
            >
              {moment(convertDate).format("D MMM YYYY")} •{" "}
              {moment(convertedTime).format("LT")}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const onItemPresshandler = (item) => {
    const clone = listData?.map((element, index) => {
      if (item?.id === element?.id) {
        return { ...element, isSelected: true };
      }
      return { ...element, isSelected: false };
    });
    setIsItemSelected(true);
    setListData(clone);
    selectedItem(clone);
  };

  const renderViewModalheader = () => (
    <View>
      <View>
        <View>
          <Text
            style={[
              reduxColors.mediumText,
              { color: themeColors?.onPrimaryContainer },
            ]}
          >
            {modalData?.assessment_name}
          </Text>
          <Text
            style={[
              reduxColors.microRegularText,
              {
                color: themeColors?.onSurfaceVariant,
                marginTop: 2,
              },
            ]}
          >
            {modalData?.assessment_category_name}
          </Text>
        </View>

        {modalData?.description && (
          <Text
            style={[
              reduxColors.regularText,
              {
                color: themeColors?.onSurfaceVariant,
                marginTop: Spacing.minor,
              },
            ]}
          >
            {modalData?.description}
          </Text>
        )}

        <View style={reduxColors.divider} />
      </View>
    </View>
  );

  const renderViewModalNotes = () => (
    <View
      style={[
        reduxColors?.addContainer,
        {
          backgroundColor: "rgba(252, 244, 174, 0.5)",
          borderWidth: 0,
          paddingVertical: Spacing.minor,
          alignItems: "flex-start",
        },
      ]}
    >
      <Text
        style={[
          reduxColors?.regularText,
          {
            color: "rgba(35, 14, 1, 1)",
            lineHeight: Spacing.minor,
          },
        ]}
      >
        {addNotes}
      </Text>
    </View>
  );

  const renderNumericScalesAndList = () => (
    <FlatList
      data={listData}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => {
        return (
          <View>
            {fromAddIcon ? (
              <TouchableOpacity
                style={[
                  reduxColors?.listContainer,
                  {
                    backgroundColor: item?.isSelected
                      ? themeColors?.primaryContainer
                      : themeColors?.displaybgPrimary,
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  onItemPresshandler(item);
                }}
              >
                <Text
                  style={[
                    reduxColors?.minorMediumText,
                    {
                      color: themeColors?.onPrimaryContainer,
                      width: "90%",
                    },
                  ]}
                >
                  {item?.label}
                </Text>

                {item?.isSelected ? (
                  <Ionicons
                    name="checkmark-sharp"
                    size={20}
                    color={themeColors?.onPrimaryContainer}
                  />
                ) : null}
              </TouchableOpacity>
            ) : (
              <View>
                {!isItemSelected ? (
                  <TouchableOpacity
                    style={[
                      reduxColors?.listContainer,
                      {
                        backgroundColor:
                          onPressSelectedItem?.assessment_value == item?.id
                            ? themeColors?.primaryContainer
                            : themeColors?.displaybgPrimary,
                        flexDirection: "row",
                        alignItems: "center",
                      },
                    ]}
                    onPress={() => {
                      onItemPresshandler(item);
                    }}
                  >
                    <Text
                      style={[
                        reduxColors?.minorMediumText,
                        {
                          color: themeColors?.onPrimaryContainer,
                          width: "90%",
                        },
                      ]}
                    >
                      {item?.label}
                    </Text>

                    {isItemSelected ? (
                      item?.isSelected ? (
                        <Ionicons
                          name="checkmark-sharp"
                          size={20}
                          color={themeColors?.onPrimaryContainer}
                        />
                      ) : null
                    ) : onPressSelectedItem?.assessment_value == item?.id ? (
                      <Ionicons
                        name="checkmark-sharp"
                        size={20}
                        color={themeColors?.onPrimaryContainer}
                      />
                    ) : null}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      reduxColors?.listContainer,
                      {
                        backgroundColor: item?.isSelected
                          ? themeColors?.primaryContainer
                          : themeColors?.displaybgPrimary,

                        flexDirection: "row",
                        alignItems: "center",
                      },
                    ]}
                    onPress={() => {
                      onItemPresshandler(item);
                    }}
                  >
                    <Text
                      style={[
                        reduxColors?.minorMediumText,
                        {
                          color: themeColors?.onPrimaryContainer,
                          width: "90%",
                        },
                      ]}
                    >
                      {item?.label}
                    </Text>

                    {isItemSelected ? (
                      item?.isSelected ? (
                        <Ionicons
                          name="checkmark-sharp"
                          size={20}
                          color={themeColors?.onPrimaryContainer}
                        />
                      ) : null
                    ) : onPressSelectedItem?.assessment_value == item?.id ? (
                      <Ionicons
                        name="checkmark-sharp"
                        size={20}
                        color={themeColors?.onPrimaryContainer}
                      />
                    ) : null}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
      }}
    />
  );

  const editAddModal = () => (
    <Modal animationType="fade" visible={isModalOpen} style={{ margin: 0 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
      >
        <View
          style={{
            height: "100%",
            flexDirection: "column-reverse",
            backgroundColor: themeColors?.neutral50,
          }}
        >
          <View style={reduxColors.modalMainContainer}>
            {modalData?.response_type === "text" ? (
              <View style={{ paddingHorizontal: Spacing.minor }}>
                {renderModalHeader()}
                {fromAddIcon ? (
                  <TextInput
                    value={addResponseTextInput}
                    onChangeText={onChangeAddResponseTextInput}
                    multiline
                    style={[
                      reduxColors.inputContainer,
                      {
                        borderColor: themeColors?.outline,
                        backgroundColor: themeColors?.surface,
                      },
                    ]}
                    placeholder="Enter assessment..."
                  />
                ) : (
                  <TextInput
                    value={responseTextInput}
                    onChangeText={onChangeResponseTextInput}
                    multiline
                    style={[
                      reduxColors.inputContainer,
                      {
                        borderColor: themeColors?.outline,
                        backgroundColor: themeColors?.surface,
                      },
                    ]}
                    placeholder="Enter assessment..."
                  />
                )}
                {renderNotes()}
              </View>
            ) : modalData?.response_type === "numeric_value" ? (
              <View style={{ paddingHorizontal: Spacing.minor }}>
                {renderModalHeader()}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: Spacing.minor,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={[
                      reduxColors.dateTimeContainer,
                      {
                        justifyContent: "flex-start",
                        paddingHorizontal: Spacing.small,
                        width:
                          modalData?.measurement_type?.length > 0
                            ? "48%"
                            : "100%",
                      },
                    ]}
                  >
                    {fromAddIcon ? (
                      <TextInput
                        value={addNumericValue}
                        onChangeText={onChangeAddNumericValue}
                        maxLength={10}
                        placeholder={`Enter Value`}
                        keyboardType="numeric"
                        style={{width: '100%'}}
                      />
                    ) : (
                      <TextInput
                        value={numericValue}
                        onChangeText={onChangeNumericValue}
                        maxLength={10}
                        keyboardType="numeric"
                        placeholder={`Update Value`}
                        style={{width: '100%'}}
                      />
                    )}
                  </View>
                  {modalData?.measurement_type?.length > 0 && (

                      <SelectDropdown
                        onFocus={() => {
                          setUp(true);
                        }}
                        onBlur={() => {
                          setUp(false);
                        }}
                        defaultButtonText={
                          fromAddIcon ? "Select unit" : diplayUnitValue
                        }
                        selectedRowStyle={{
                          backgroundColor: themeColors.surface,
                        }}
                        showsVerticalScrollIndicator={false}
                        buttonStyle={{
                          borderRadius:4,
                          borderWidth:1,
                          borderColor: themeColors?.outline,
                          backgroundColor: themeColors.surface,
                          width: "48%",
                        }}
                        data={measurementList}
                        onSelect={(selectedItem, index) => {
                          selectedUnitId(selectedItem?.id);
                          setIsUnitSelected(selectedItem?.id)
                          // setUnitError(false);
                          // setSelectedUnitId(selectedItem?.id);
                        }}
                        rowStyle={{
                          borderBottomWidth: 0,
                          height: heightPercentageToDP(4.5),
                          // backgroundColor: 'red'
                        }}
                        dropdownStyle={{
                          height: heightPercentageToDP(15),
                          paddingHorizontal: 5,
                          borderWidth: 0.5,
                          backgroundColor: themeColors.onPrimary,
                          borderRadius: 5,
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return selectedItem?.uom_abbr;
                        }}
                        buttonTextStyle={{
                          textAlign: "left",
                          fontSize: FontSize.Antz_Body_Title.fontSize,
                          fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                        }}
                        rowTextForSelection={(item, index) => {
                          return item?.uom_abbr;
                        }}
                        rowTextStyle={{
                          textAlign: "left",
                          fontSize: FontSize.Antz_Body_Title.fontSize,
                        }}
                        renderDropdownIcon={() => {
                          return (
                            <>
                              {up ? (
                                <MaterialIcons
                                  name="keyboard-arrow-up"
                                  size={24}
                                  color="black"
                                />
                              ) : (
                                <MaterialIcons
                                  name="keyboard-arrow-down"
                                  size={24}
                                  color="black"
                                />
                              )}
                            </>
                          );
                        }}
                      />
               
                  )}
                </View>
                {renderNotes()}
              </View>
            ) : modalData?.response_type === "list" ? (
              <View style={{ paddingHorizontal: Spacing.minor }}>
                {renderModalHeader()}
                {renderNumericScalesAndList()}
                {renderNotes()}
              </View>
            ) : modalData?.response_type === "numeric_scale" ? (
              <View style={{ paddingHorizontal: Spacing.minor }}>
                {renderModalHeader()}
                {renderNumericScalesAndList()}
                {renderNotes()}
              </View>
            ) : null}

            <View style={reduxColors?.footerContainer}>
              <TouchableOpacity
                style={[
                  reduxColors?.buttonContainer,
                  {
                    borderWidth: 1,
                    borderColor: themeColors?.outline,
                    backgroundColor: themeColors?.onPrimary,
                  },
                ]}
                onPress={() => {
                  onCancelPress(), setIsItemSelected(false);
                }}
              >
                <Text
                  style={[
                    reduxColors?.minorMediumText,
                    { color: themeColors?.onSurfaceVariant },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  reduxColors?.buttonContainer,
                  { backgroundColor: validationOnSubmit() ? themeColors?.primary : themeColors?.outline},
                ]}
                disabled={validationOnSubmit() ? false : true}
                onPress={() => validationOnSubmit() && onAddEntryPress()}
              >
                <Text
                  style={[
                    reduxColors?.minorMediumText,
                    { color: themeColors?.onPrimary },
                  ]}
                >
                  {fromAddIcon ? "Add Entry" : "Update Entry"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const viewModal = () => (
    <Modal
      animationType="fade"
      visible={isModalOpen}
      style={{ margin: 0 }}
      // animationIn="slideInUp"
      // animationOut="slideOutDown"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
      >
        <View
          style={{
            height: "100%",
            flexDirection: "column-reverse",
            backgroundColor: themeColors?.neutral50,
          }}
        >
          <View style={reduxColors.modalMainContainer}>
            {modalData?.response_type === "text" ? (
              <View style={{ paddingHorizontal: Spacing.minor }}>
                {renderViewModalheader()}
                <View>
                  <Text
                    style={[
                      reduxColors?.mediumText,
                      {
                        color: themeColors?.onPrimaryContainer,
                        marginVertical: Spacing.minor,
                      },
                    ]}
                  >
                    {responseTextInput}
                  </Text>

                  {addNotes && <View>{renderViewModalNotes()}</View>}
                </View>
                {renderViewModalFooter()}
              </View>
            ) : modalData?.response_type === "numeric_value" ? (
              <View style={{ paddingHorizontal: Spacing.minor }}>
                {renderViewModalheader()}
                <View>
                  <Text
                    style={[
                      reduxColors?.majorText,
                      {
                        color: themeColors?.onPrimaryContainer,
                        marginVertical: Spacing.minor,
                      },
                    ]}
                  >
                    {numericValue}{" "}
                    <Text
                      style={[
                        reduxColors?.title,
                        { color: themeColors?.onPrimaryContainer },
                      ]}
                    >
                      {diplayUnitValue}
                    </Text>
                  </Text>

                  {addNotes && <View>{renderViewModalNotes()}</View>}
                </View>
                {renderViewModalFooter()}
              </View>
            ) : modalData?.response_type === "list" ? (
              <View style={{ paddingHorizontal: Spacing.minor }}>
                {renderViewModalheader()}
                <FlatList
                  data={listData}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        {onPressSelectedItem?.assessment_value == item?.id && (
                          <Text
                            style={[
                              reduxColors?.minorMediumText,
                              {
                                color: themeColors?.onPrimaryContainer,
                                marginVertical: Spacing?.minor,
                              },
                            ]}
                          >
                            {item?.label}
                          </Text>
                        )}
                      </View>
                    );
                  }}
                />
                {addNotes && <View>{renderViewModalNotes()}</View>}

                {renderViewModalFooter()}
              </View>
            ) : modalData?.response_type === "numeric_scale" ? (
              <View style={{ paddingHorizontal: Spacing.minor }}>
                {renderViewModalheader()}
                <FlatList
                  data={listData}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        {onPressSelectedItem?.assessment_value == item?.id && (
                          <Text
                            style={[
                              reduxColors?.minorMediumText,
                              {
                                color: themeColors?.onPrimaryContainer,
                                marginVertical: Spacing?.minor,
                              },
                            ]}
                          >
                            {item?.label}
                          </Text>
                        )}
                      </View>
                    );
                  }}
                />
                {addNotes && <View>{renderViewModalNotes()}</View>}

                {renderViewModalFooter()}
              </View>
            ) : null}

            <View style={reduxColors?.footerContainer}>
              <TouchableOpacity
                style={[
                  reduxColors?.buttonContainer,
                  {
                    width: "100%",
                    borderWidth: 1,
                    borderColor: themeColors?.outline,
                    backgroundColor: themeColors?.onPrimary,
                  },
                ]}
                onPress={() => {
                  onCancelPress(), setIsItemSelected(false);
                }}
              >
                <Text
                  style={[
                    reduxColors?.minorMediumText,
                    { color: themeColors?.onSurfaceVariant },
                  ]}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const validationOnSubmit = () => {
    let validate = false
    const dateLength = moment(dateValue).format("D MMM YYYY")?.length
    const timeLength = moment(timeValue).format("LT")?.length

    if(modalData?.response_type === "text") {
      if(fromAddIcon){
        if(dateLength && timeLength && addResponseTextInput){
          validate = true
        } 
      } else {
        if(dateLength && timeLength && responseTextInput){
          validate = true
        }
      }
    } else if(modalData?.response_type === "numeric_value") {
      if(modalData?.measurement_type?.length > 0) {
        if(fromAddIcon) {
          if(dateLength && timeLength && isUnitSelectedId?.length > 0 && addNumericValue?.length > 0){
            validate = true
          } 
        } else {
          if(dateLength && timeLength && numericValue?.length>0 && unitValue > 0){
            validate = true
          }
        }
      } else {
        if(fromAddIcon) {
          if(dateLength && timeLength && addNumericValue?.length > 0){
            validate = true
          } 
        } else {
          if(dateLength && timeLength && numericValue?.length>0){
            validate = true
          }
        }
      }
        
    } else if(modalData?.response_type === "numeric_scale") {
      if(fromAddIcon){
        if(dateLength && timeLength && isItemSelected){
          validate = true
        } 
      } else {
        if(dateLength && timeLength && onPressSelectedItem?.assessment_value?.length > 0){
          validate = true
        }
      }
    } else if (modalData?.response_type === "list") {
      if(fromAddIcon){
        if(dateLength && timeLength && isItemSelected){
          validate = true
        } 
      } else {
        if(dateLength && timeLength && onPressSelectedItem?.assessment_value?.length > 0){
          validate = true
        }
      }
    }
    return validate;
  }


  return (
    <View>
      {fromAddIcon ? (
        <View>{editAddModal()}</View>
      ) : (
        <View>
          {userId == assessmentDetail?.created_by ? (
            <View>{editAddModal()}</View>
          ) : (
            <View>{viewModal()}</View>
          )}
        </View>
      )}
    </View>
  );
};

const Styles = (reduxColors) =>
  StyleSheet.create({
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
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4,
      backgroundColor: reduxColors.lightGreyHexa,
      paddingHorizontal: Spacing.small,
    },
    filterListContainer: {
      width: "100%",
      marginTop: Spacing.minor,
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
      marginTop: Spacing.minor,
      backgroundColor: reduxColors.onPrimary,
      alignItems: "center",
    },

    subCategoryItemContainer: {
      marginTop: heightPercentageToDP(2),
      borderRadius: 8,
      paddingHorizontal: widthPercentageToDP(0),
      width: "100%",
    },

    subCategoryHeaderContainer: {
      justifyContent: "space-between",
      paddingBottom: 10,
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      paddingTop: 8,
      paddingHorizontal: widthPercentageToDP(2),
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
      // minWidth: widthPercentageToDP(15),
      minHeight: heightPercentageToDP(6),
      flexDirection: "column",
      justifyContent: "space-evenly",
      paddingRight: 5,
      paddingVertical: 5,
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
    },

    dateTimeContainer: {
      width: "48%",
      height: 48,
      //paddingVertical: Spacing.small,
      alignItems: "center",
      flexDirection: "row",
      borderRadius: 4,
      borderWidth: 1,
      borderColor: reduxColors?.outline,
      backgroundColor: reduxColors?.surface,
      paddingHorizontal: Spacing.small,
    },

    inputContainer: {
      paddingTop: 15,
      paddingHorizontal: 9,
      paddingVertical: Spacing.minor,
      backgroundColor: "red",
      borderRadius: 4,
      borderWidth: 1,
      marginTop: Spacing.minor,
      maxHeight: 100,
      minHeight: 50,
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

    footerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.minor,
      paddingVertical: 20,
      backgroundColor: reduxColors?.background,
      justifyContent: "space-between",
    },

    avatarStyle: {
      width: 30,
      height: 30,
      borderRadius: 30,
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
    smallRegularText: {
      fontSize: FontSize.Antz_Small,
      fontWeight: FontSize.Antz_Small.fontWeight,
    },

    //verticleLine
    verticalLine: {
      width: 1,
      height: 60,
      marginHorizontal: 10,
    },

    //Divider
    divider: {
      width: "100%",
      height: 0.5,
      backgroundColor: reduxColors?.outlineVariant,
      marginTop: Spacing.minor,
    },
  });
