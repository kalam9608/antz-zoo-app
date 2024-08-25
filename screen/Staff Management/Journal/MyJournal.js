import React, { useId } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { RefreshControl } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../../../components/Header";
import FontSize from "../../../configs/FontSize";
import Spacing from "../../../configs/Spacing";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ActivityIndicator } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Colors from "../../../configs/Colors";
import MenuModalComponent from "../../../components/MenuModalComponent";
import { useNavigation } from "@react-navigation/native";
import { getJournals } from "../../../services/JournalServices";
import JournalCard from "../../../components/JournalCard";
import ListEmpty from "../../../components/ListEmpty";
import Loader from "../../../components/Loader";
import { useToast } from "../../../configs/ToastConfig";
import { ViewPointCalculation } from "../../../utils/ViewPointCalculation";
import { MonthlyDate } from "../../../components/Calendar/MonthlyDate";

import MonthYearDropdown from "./MonthPickerModal";
import { setRefreshLoaderFalse } from "../../../redux/MyJournalSlice";

const dropDownData = [
  { id: 0, name: "Show All", value: "show_all" },
  { id: 1, name: "Login", value: "login" },
  { id: 2, name: "Logout", value: "logout" },
  { id: 3, name: "Animal Transfer Request", value: "animal_transfer_request" },
  {
    id: 4,
    name: "Transfer Approvals",
    value: "animal_movement_approval",
  },
  { id: 5, name: "Medical Record", value: "medical_record" },
  { id: 6, name: "Site", value: "site" },
  { id: 7, name: "Section", value: "section" },
  { id: 8, name: "Enclosure", value: "enclosure" },
  { id: 9, name: "Animal", value: "animal" },
  { id: 10, name: "Notes", value: "notes" },
  { id: 11, name: "Measurement", value: "measurement" },
  { id: 12, name: "User Profile", value: "user_profile" },
  { id: 13, name: "Role", value: "role" },
  { id: 14, name: "Mortality", value: "mortality" },
  { id: 15, name: "Media", value: "media" },
];

const generateMonthDayData = (numOfDays, date) => {
  return Array.from({ length: numOfDays }, (_, index) => {
    const generatedDate = date.clone().date(index + 1);
    return {
      id: String(index),
      date: generatedDate.format("DD"),
      day: generatedDate.format("ddd"),
      fullDate: generatedDate.format("YYYY-MM-DD"),
    };
  });
};

const MyJournal = ({
  hideTitle = false,
  userId = null,
  focused = true,
  refreshLoaderUserRef = true,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [orientation, setOrientation] = useState(null);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const { myJournalRefreshLoader } = useSelector(
    (state) => state.myRefreshJournalSlice
  );
  const reduxColors = styles(constThemeColor);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const userID = useSelector((state) => state.UserAuth.userDetails.user_id);
  const [refreshing, setRefreshing] = useState(false);

  const flatListRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(
    moment(new Date())?.format("YYYY-MM-DD")
  );
  const [currentDate, setCurrentDate] = useState(moment());
  const [numOfDays, setNumOfDays] = useState(moment().daysInMonth());

  const [visible, setVisible] = useState(false);
  const [selectDrop, setSelectDrop] = useState("Show All");
  const [isCalendarDisabled, setIsCalendarDisabled] = useState(true);
  const [dropDownValue, setDropDownValue] = useState("show_all");
  const [isLoading, setIsLoading] = useState(true);

  // pagination states
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const openMenu = () => setVisible(true);
  const [calendarDateData, setCalendarDateData] = useState(
    generateMonthDayData(numOfDays, currentDate)
  );
  const [ActivityData, setActivityData] = useState([]);

  const { showToast, errorToast, successToast, warningToast } = useToast();

  // Date picker states
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDateModal, setSelectedDateModal] = useState(moment());
  const onChangeDatePicker = (data) => setSelectedDateModal(data);
  const hideDatePicker = () => setIsDatePickerVisible(!isDatePickerVisible);
  const [initialRender, setIntialRender] = useState(false);

  const [page, setPage] = useState(1);
  const [activiyCount, setActivityCount] = useState(0);
  const currentDt = new Date();
  const singleDigitCurrentDate = moment(currentDt).format("D");

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [pageLoad, setPageLoad] = useState(false);
  const onPressCancelDatePicker = () => setIsDatePickerVisible(false);
  const onPressConfirmDatePicker = () => {
    closeMonthYearModal(selectedDateModal);
    hideDatePicker();
  };

  const closeMonthYearModal = (item) => {
    hideDatePicker();
    const selectedDate = moment(item);
    const noOfDaysInSelectedMonth = item.daysInMonth();
    setCurrentDate(selectedDate);
    setCalendarDateData(
      generateMonthDayData(noOfDaysInSelectedMonth, selectedDate)
    );
    setNumOfDays(noOfDaysInSelectedMonth);
    setSelectedDate(moment(selectedDate).format("YYYY-MM-DD"));

    setIsCalendarDisabled(false);
    setTimeout(() => scrollToSpecificDate(moment(selectedDate)), 500);
  };

  // for FlatList so that scrollToIndex can work
  const getItemLayout = (data, index) => ({
    length: 66,
    offset: initialRender
      ? 66 * index
      : Platform.OS == "android"
      ? 56 * index
      : 56 * index,
    index,
  });

  const scrollToCurrentDate = useCallback(() => {
    // Find the index of the current date
    const currentIndex = calendarDateData?.findIndex(
      (item) => item?.fullDate === moment().format("YYYY-MM-DD")
    );

    // Scroll to the current date
    flatListRef.current?.scrollToIndex({
      index: currentIndex >= 0 ? currentIndex : 0,
      animated: true,
    });
  }, []);

  const scrollToSpecificDate = useCallback((scrollToDate) => {
    // Find the index of the current date
    const currentIndex = calendarDateData?.findIndex(
      (item) => item?.fullDate === moment(scrollToDate).format("YYYY-MM-DD")
    );

    // Scroll to the current date
    flatListRef.current?.scrollToIndex({
      index: currentIndex >= 0 ? currentIndex : 0,
      animated: true,
    });
  }, []);

  const closeMenu = (item) => {
    setSelectDrop(item.name ?? item);
    setDropDownValue(item.value);
    setVisible(false);
  };

  //Function for today calendar pressed in header
  const handleDataToCurrentDate = () => {
    setCalendarDateData(generateMonthDayData(moment().daysInMonth(), moment()));
    setNumOfDays(moment().daysInMonth());

    setCurrentDate(moment());
    setIsCalendarDisabled(true);
    setSelectedDate(moment().format("YYYY-MM-DD"));

    setTimeout(() => {
      scrollToCurrentDate(moment());
    }, 500);
  };

  useEffect(() => {
    setTimeout(() => scrollToCurrentDate(), 500);
    return () => {
      clearTimeout();
      setSelectedDate(moment().format("YYYY-MM-DD"));
      setSelectedDateModal(moment());
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const handleOrientationChange = (orientationInfo) => {
        setOrientation(orientationInfo?.orientationInfo?.orientation);
      };
      ScreenOrientation.addOrientationChangeListener(handleOrientationChange);

      ScreenOrientation.getOrientationAsync().then((orientationInfo) => {
        setOrientation(orientationInfo);
      });
    }, [])
  );
  useEffect(() => {
    if (refreshing == false) {
      setIsLoading(true);
      setPage(1);
      GetJournals({ selectedDate: selectedDate }, 1);
    }
  }, [selectedDate, dropDownValue, userId, focused]);

  const GetJournals = ({ selectedDate }, page_count) => {
    //  till current date object
    const obj = {
      to_date: selectedDate,
      from_date: selectedDate,
      zoo_id: zooID,
      user_id: userID,
      page_no: page_count,
    };

    if (dropDownValue != "show_all") {
      obj.type = dropDownValue;
    }
    if (userId != null) {
      obj.user_id = userId;
    }

    getJournals(obj)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : ActivityData;
        if (res?.data?.result) {
          setActivityData(dataArr.concat(res?.data?.result));
          setActivityCount(res.data.result.length);
        } else {
          setActivityCount(0);
        }
        //setActivityData(res?.data ?? []);
        setIsLoading(false);
        setRefreshing(false);
        dispatch(setRefreshLoaderFalse());
      })
      .catch((err) => {
        setIsLoading(false);
        setRefreshing(false);
        dispatch(setRefreshLoaderFalse());

        errorToast("error", "Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
        dispatch(setRefreshLoaderFalse());
        setPageLoad(false);
      });
  };

  const handleItemSelected = (index) => {
    const vp = ViewPointCalculation({ index }, orientation);
    setIntialRender(true);
    // Scroll to the centerIndex
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: index,
        viewPosition: vp,
      });
    }, 0);
  };

  const onDatePress = (isCurrentDate, index, item) => {
    handleItemSelected(index);
    if (isCurrentDate) {
      setSelectedDate(moment().format("YYYY-MM-DD"));
      setIsCalendarDisabled(true);

      return;
    }
    setIsCalendarDisabled(false);
    setSelectedDate(item?.fullDate);
  };

  const renderHeaderDate = ({ item, index }) => {
    const checkCurrentDate = moment(item?.fullDate).isBefore(currentDt);
    const isCurrentDate = item?.fullDate === moment().format("YYYY-MM-DD");
    const isSelectedDate = item?.fullDate === selectedDate;
    return (
      <MonthlyDate
        item={item}
        index={index}
        isSelectedDate={isSelectedDate}
        isCurrentDate={isCurrentDate}
        selectedDate={selectedDate}
        checkCurrentDate={checkCurrentDate}
        showAllDate={false}
        onDatePress={() => onDatePress(isCurrentDate, index, item)}
      />
    );
  };

  const handleLoadMore = () => {
    if (!isLoading && activiyCount >= 10 && !pageLoad && focused) {
      const nextPage = page + 1;
      setPageLoad(true);
      setPage(nextPage);
      GetJournals({ selectedDate: selectedDate }, nextPage);
    }
  };

  const renderFooter = () => {
    if (isLoading || activiyCount < 10 || activiyCount < 10 || !pageLoad) {
      return null;
    } else {
      return (
        <View style={reduxColors.footerContainer}>
          <ActivityIndicator
            style={{ color: constThemeColor.housingPrimary }}
          />
        </View>
      );
    }
  };

  const isWithinFirstFiveDays = (fullDate) => {
    // Convert the fullDate string to a Date object
    const dateObj = new Date(fullDate);
    // Extract year, month, and date from the date object
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    // Compare with current year, month, and date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    if (year == currentYear && month == currentMonth) {
      if (currentDay <= day) {
        return false;
      }
    } else {
      return true;
    }
  };
  useEffect(() => {
    if (myJournalRefreshLoader) handleRefresh();
  }, [myJournalRefreshLoader]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    // setDropDownValue("show_all");
    // setSelectDrop("Show All");
    GetJournals({ selectedDate: selectedDate }, 1);
  };

  return (
    <View style={[reduxColors.container]}>
      <Loader visible={isLoading} />
      <Header
        title={hideTitle ? "" : "My Journal"}
        headerTitle={reduxColors.headerTitle}
        noIcon={true}
        search={false}
        showBackButton={hideTitle ? false : true} //intentionally opposite to headerTitle
        hideMenu={true}
        calendarMonth={moment(selectedDate).format("MMM")}
        calendarYear={moment(selectedDate).format("YYYY")}
        isCalendarDisabled={isCalendarDisabled}
        handleTodayCalendarPress={() => handleDataToCurrentDate()}
        showCalendar={true}
        backgroundColor={constThemeColor.displaybgSecondary}
        customBack={() => navigation.goBack()}
        // year month props
        openDatePicker={hideDatePicker}
      />

      <View>
        <FlatList
          ref={flatListRef}
          data={calendarDateData}
          contentContainerStyle={{ minWidth: "100%" }}
          horizontal
          renderItem={renderHeaderDate}
          getItemLayout={getItemLayout}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          // scrollEnabled={
          //   calendarDateData.length > 0 &&
          //   isWithinFirstFiveDays(calendarDateData[4].fullDate)
          // }
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: Spacing.small,
          marginVertical: Spacing.small,
        }}
      >
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Text style={{ ...FontSize.Antz_Body_Title, color: Colors.subtitle }}>
            {/* {selectedDate == ""
              ? "Today's Activity"
              : `Activity on ${moment(selectedDate, "YYYY-MM-DD").format(
                  "DD MMM YYYY"
                )}`} */}
            Activity
          </Text>
        </View>
        <View>
          <MenuModalComponent
            Data={dropDownData}
            visible={visible}
            isAntDesign={true}
            iconSize={10}
            isSetDefaultValue={true}
            iconName="caretdown"
            onDismiss={() => setVisible(false)}
            openMenu={openMenu}
            selectDrop={selectDrop}
            iconStyle={{ paddingLeft: Spacing.small }}
            dropdownValue={dropDownValue}
            closeMenu={closeMenu}
            style={{
              marginTop: Platform.OS == "ios" ? -Spacing.small : Spacing.small,
              maxHeight: 300,
            }}
            textColor={{
              color: constThemeColor.subtitle,
              ...FontSize.Antz_Body_Medium,
            }}
            isRefresh={refreshing}
          />
        </View>
      </View>
      <FlatList
        data={ActivityData ?? []}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <RenderActivityCard item={item} reduxColors={reduxColors} />
        )}
        keyExtractor={(_, index) => index?.toString()}
        ListEmptyComponent={<ListEmpty visible={isLoading} />}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshLoaderUserRef ? refreshing : false}
            onRefresh={() => handleRefresh()}
          />
        }
      />

      {isDatePickerVisible && (
        <View style={{ backgroundColor: constThemeColor.displaybgSecondary }}>
          {/* <MonthYearDropdown
            isOpen={isDatePickerVisible}
            toggleOpen={hideDatePicker}
            onChange={onChangeDatePicker}
            value={selectedDateModal}
            onPressCancelDatePicker={onPressCancelDatePicker}
            onPressConfirmDatePicker={onPressConfirmDatePicker}
          /> */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(data) => {
              closeMonthYearModal(moment(data)),
                setTimeout(() => {
                  handleItemSelected(moment(data).date() - 1);
                }, 1000);
            }}
            onCancel={onPressCancelDatePicker}
            maximumDate={currentDt}
          />
        </View>
      )}
    </View>
  );
};

const RenderActivityCard = ({ item, reduxColors }) => {
  return (
    <View style={reduxColors.item}>
      <View style={{ paddingVertical: Spacing.major }}>
        <Text style={reduxColors.time}>
          {item?.created_on
            ? moment(new Date(item?.created_on), "h:mm A").format("hh:mm")
            : "N/A"}
        </Text>

        <Text style={reduxColors.timeFormat}>
          {item?.created_on
            ? moment(new Date(item?.created_on), "h:mm A").format("A")
            : "N/A"}
        </Text>
      </View>
      <JournalCard style={reduxColors.card} item={item ?? {}} />
    </View>
  );
};
export default MyJournal;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.displaybgSecondary,
    },
    card: {
      borderRadius: Spacing.small,
      // flexDirection: "row",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.body,
      alignSelf: "center",
      flex: 1,
    },
    cardTitleStyle: {
      color: reduxColors.subtitle,
      ...FontSize.Antz_Minor_Medium,
      paddingVertical: Spacing.mini,
    },
    date: { ...FontSize.Antz_Minor_Title },
    day: { ...FontSize.Antz_Subtext_title },
    item: {
      flexDirection: "row",
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.body,
    },
    time: {
      ...FontSize.Antz_Body_Title,
      paddingRight: Spacing.small,
    },
    timeFormat: {
      textAlign: "right",
      paddingRight: Spacing.small,
      ...FontSize.Antz_Subtext_Regular,
    },
    text1: {
      ...FontSize.Antz_Minor_Medium,
      paddingBottom: Spacing.small,
    },
    text2: {
      ...FontSize.Antz_Body_Regular,
      paddingBottom: Spacing.small,
    },
    footerContainer: {
      width: "100%",
      paddingVertical: Spacing.minor,
      alignItems: "center",
      justifyContent: "center",
    },
  });
