import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Header from "../../components/Header";
import { useState } from "react";
import { getAnimalMedicalRecordListNew } from "../../services/AnimalService";
import { FlatList } from "react-native-gesture-handler";
import Loader from "../../components/Loader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import ListEmpty from "../../components/ListEmpty";
import MedicalListCard from "../../components/MedicalListCard";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { TabBar, TabView } from "react-native-tab-view";
import ModalFilterComponent, {
  ModalTitleData,
} from "../../components/ModalFilterComponent";
import { useToast } from "../../configs/ToastConfig";
import { useRoute } from "@react-navigation/native";
import Constants from "../../configs/Constants";
import { StyleSheet } from "react-native";
import { Card, FAB, TextInput } from "react-native-paper";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { opacityColor } from "../../utils/Utils";
import { TouchableOpacity } from "react-native";
import {
  getUserLabs,
  getUserLabsTests,
} from "../../services/staffManagement/addPersonalDetails";
import InputBox from "../../components/InputBox";
import moment from "moment";

const LabRequestsList = (props) => {
  const [labList, setLabList] = useState([]);
  const [labListLength, setLabListLength] = useState(0);
  const [allAnimalDataLength, setAllAnimalDataLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [index, setIndex] = useState(
    props.route.params?.filter_label_name ? 1 : 0
  );
  const [fabOpen, setFabOpen] = useState(false);
  const [medicalListModal, setMedicalListModal] = useState(false);
  const [selectedCheckBox, setselectedCheckBox] = useState(1);
  const [count, setCount] = useState(0);
  const [allCount, setAllCount] = useState(0);
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
  const [filterDays, setFilterDays] = useState("60");

  const { errorToast } = useToast();
  const route = useRoute();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setPage(1);
      loadData(1, filterType);

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [])
  );

  //   const changeIndexFun = (index) => {
  //     setAnimalMedicalList([]);
  //     setAnimalDataLength(0);
  //     setCount(0);
  //     setIndex(index);
  //     setIsLoading(true);
  //     setPage(1);
  //     loadData(1, filterType, index);
  //   };

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
    closePrintModal();
  };

  const handleFilter = () => {
    setPage(1);
    setIsLoading(true);
    loadData(1, filterType);
  };

  const onStateChange = ({ open }) => setFabOpen(open);

  const loadData = (pageNo, filter) => {
    getUserLabsTests({
      page_no: pageNo,
      filter_type: filter,
      filter_date: moment()
        .subtract(parseInt(filterDays), "days")
        .format("YYYY-MM-DD"),
    })
      .then((res) => {
        let dataArr = pageNo == 1 ? [] : labList;
        if (res.data) {
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

  const UserDetails = useSelector((state) => state.UserAuth?.userDetails);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  return (
    <View style={reduxColors.container}>
      <Loader visible={isLoading} />
      <Header
        title={UserDetails.user_first_name + "'s Lab Request"}
        noIcon={true}
        backgroundColor={constThemeColor?.onPrimary}
        hideMenu={true}
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
            <Text style={reduxColors.cardNumber}>{"30"}</Text>
          </View>
          <View style={reduxColors.dataRow}>
            <Text style={reduxColors.cardNumberTitle}>3 days</Text>
            <Text style={reduxColors.cardNumber}>{"23"}</Text>
          </View>
          <View style={reduxColors.dataRow}>
            <Text style={reduxColors.cardNumberTitle}>Today</Text>
            <Text style={reduxColors.cardNumber}>{"10"}</Text>
          </View>
          <View style={reduxColors.dataRow}>
            <Text style={reduxColors.cardNumberTitle}>Total</Text>
            <Text style={reduxColors.cardNumber}>{"50"}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={labList}
        contentContainerStyle={{
          paddingBottom: Spacing.major + Spacing.body,
        }}
        renderItem={({ item }) => (
          <>
            <Card
              style={reduxColors.card}
              elevation={0}
              onPress={() =>
                navigation.navigate("LabRequestsFilter", {
                  item,
                  filterName: filterName,
                  filterType: filterType,
                  filterDays: filterDays,
                })
              }
            >
              <Card.Content>
                <View style={[reduxColors.cardContentRow, { width: "100%" }]}>
                  <Text style={reduxColors.cardContentTitle}>{item.name}</Text>
                  <Text style={reduxColors.cardContentTitle}>
                    {item.request_count}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </>
        )}
        keyExtractor={(item) => item.id}
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
        icon={fabOpen ? "close-circle-outline" : "plus-circle-outline"}
        actions={[
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
        ]}
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

export default LabRequestsList;

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
