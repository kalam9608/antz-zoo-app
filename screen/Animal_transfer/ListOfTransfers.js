import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { capitalize, ifEmptyValue } from "../../utils/Utils";
import MoveAnimalHeader from "../../components/MoveAnimalHeader";
import { getListOfTransfers } from "../../services/Animal_transfer/TransferAnimalService";
import Loader from "../../components/Loader";
import moment from "moment";
import FontSize from "../../configs/FontSize";
import { useSelector } from "react-redux";
import ImageComponent from "../../components/ImageComponent";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/Header";
import ListEmpty from "../../components/ListEmpty";
const ApprovalTaskCard = ({
  item,
  animal_id,
  common_name,
  sex,
  status,
  institute_name,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const dynamicStyles = styles(constThemeColor);
  return (
    <>
      <View
        style={[
          dynamicStyles.containerCard,
          {
            marginBottom: 3,
            marginTop: 8,
          },
        ]}
      >
        <View style={dynamicStyles.topInnerContainer1}>
          {/* img style */}
          <View
            style={[
              dynamicStyles.revertBack,
              { backgroundColor: constThemeColor.outlineVariant },
            ]}
          >
            <Image
              style={dynamicStyles.shareImeage}
              source={require("../../assets/share_windows.png")}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <View style={{ marginLeft: widthPercentageToDP(4) }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: FontSize.Antz_Minor, marginRight: 2 }}>
                  Transferred to{" "}
                  <Text style={[dynamicStyles.titleText]}>
                    {props?.transferPlace?.length > 50
                      ? capitalize(props.transferPlace).slice(0, 50) + "..."
                      : capitalize(props.transferPlace)}
                  </Text>
                </Text>
              </View>
              <Text style={[dynamicStyles.titleTwo, {}]}>
                By{" "}
                <Text
                  style={{ fontWeight: FontSize.Antz_Subtext_title.fontWeight }}
                >
                  {props.requestBY}
                </Text>{" "}
              </Text>
              <Text style={dynamicStyles.titleTime}>
                {ifEmptyValue(
                  moment(props.transferred_on).format("DD MMM YYYY LT")
                )}
              </Text>
            </View>
          </View>
        </View>
        <AnimalCustomCard
          item={item}
          show_housing_details={true}
          show_specie_details={true}
          chips={item.sex}
          icon={item.default_icon}
          enclosureName={item.enclosure_name ? item.enclosure_name : "NA"}
          sectionName={item.section_name}
          animalName={
            item?.common_name ? item?.common_name : item?.scientific_name
          }
          animalIdentifier={
            !item?.local_identifier_value
              ? item?.animal_id
              : item?.local_identifier_name ?? null
          }
          localID={item?.local_identifier_value ?? null}
          noArrow={true}
          style={{ padding: 0, paddingTop: 12, backgroundColor: "transparent" }}
        />
        {props.note && (
          <View style={dynamicStyles.note}>
            <Text style={dynamicStyles.noteText}>{props.note}</Text>
          </View>
        )}
      </View>
    </>
  );
};

const ListOfTransfers = () => {
  const navigation = useNavigation();
  const [transferData, setTransferData] = useState([]);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const [isLoading, setIsLoading] = useState(false);
  const [transferDataLength, setTransferDataLength] = useState(0);
  const [page, setPage] = useState(1);

  const dynamicStyles = styles(constThemeColor);
  const gotoBack = () => {
    navigation.goBack("AnimalTransfer");
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      setPage(1);
      getRefreshData(1);
    });
    return unsubscribe;
  }, [navigation]);

  const getRefreshData = (count) => {
    getListOfTransfers({ page_no: count, entity_id: 1 })
      .then((res) => {
        let dataArr = count == 1 ? [] : transferData;
        setTransferDataLength(res.data ? res.data.length : 0);
        if (res.data) {
          setTransferData(dataArr.concat(res.data));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
        setIsLoading(false);
      });
  };
  const renderFooter = () => {
    if (isLoading || transferDataLength == 0 || transferDataLength < 10)
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };
  const handleLoadMore = () => {
    if (!isLoading && transferDataLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      getRefreshData(nextPage);
    }
  };

  return (
    <>
      <Loader visible={isLoading} />

      <Header
        noIcon={true}
        title={"Transfers"}
        customBack={() => navigation.navigate("Home")}
        showBackButton={true}
        style={{ backgroundColor: constThemeColor.onPrimary }}
        backgroundColor={constThemeColor.onPrimary}
      />

      <View
        style={{
          paddingHorizontal: 12,
          flex: 1,
          marginTop: 3,
        }}
      >
        <FlatList
          data={transferData}
          extraData={transferData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <ApprovalTaskCard
              item={item}
              common_name={
                item.local_id == null || item.local_identifier_name == null
                  ? item.animal_id
                  : item.local_identifier_name + " " + item.local_id
              }
              from_enclosure_name={
                item.enclosure_name ? item.enclosure_name : "NA"
              }
              from_section_name={item.section_name ? item.section_name : "NA"}
              sex={item.sex}
              texnomoy_id={item.taxonomy_id ? item.taxonomy_id : "NA"}
              requestBY={item.requested_by ? item.requested_by : "NA"}
              transferPlace={
                " " + item.institute_name ? item.institute_name : "NA"
              }
              transferred_on={item.transferred_on}
              note={item.notes}
            />
          )}
          ListEmptyComponent={<ListEmpty visible={isLoading} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
        />
      </View>
    </>
  );
};

export default ListOfTransfers;

const styles = (dynamicStyles) =>
  StyleSheet.create({
    containerCard: {
      display: "flex",
      paddingBottom: "5.5%",
      paddingTop: "3%",
      paddingHorizontal: 12,
      width: "100%",
      backgroundColor: dynamicStyles.onPrimary,
      borderRadius: 10,
      paddingBottom: 10,
    },
    headerTitle: {
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      color: dynamicStyles.headertitle,
    },
    topInnerContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    topInnerContainer1: {
      width: widthPercentageToDP(90),
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },

    revertBack: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: 40,
      height: 40,
      borderRadius: 30,
    },
    titleText: {
      fontStyle: "normal",
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      fontSize: FontSize.Antz_Minor,
      lineHeight: 19,
      color: dynamicStyles.onSecondaryContainer,
    },

    titleTwo: {
      fontStyle: "normal",
      fontSize: FontSize.Antz_Standerd,
      lineHeight: 17,
      color: dynamicStyles.onSurfaceVariant,
      flexBasis: "auto",
    },

    secondViewTitleText: {
      fontStyle: "normal",
      fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      fontSize: FontSize.Antz_Minor,
      lineHeight: 19,
      color: dynamicStyles.onSecondaryContainer,
      top: 5,
      width: widthPercentageToDP(60),
    },
    titleTime: {
      fontStyle: "normal",
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      color: dynamicStyles.blackWithPointEight,
      flexBasis: "auto",
    },

    secondSymbolOne: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      textAlign: "center",
      width: 21,
      height: 18,
      backgroundColor: dynamicStyles.surfaceVariant,
      borderRadius: 5,
      left: 12,
      top: 7,
      fontSize: FontSize.Antz_Strong,
    },
    rejectionMsg: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: "4%",
      width: "100%",
      height: heightPercentageToDP(5.5),
      backgroundColor: dynamicStyles.errorContainer,
      borderRadius: 10,
      top: "4.3%",
      marginVertical: 3,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    note: {
      backgroundColor: dynamicStyles.notes,
      padding: 10,
      marginTop: 10,
      marginHorizontal: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: dynamicStyles.outlineVariant,
    },
    noteText: {
      color: dynamicStyles.onSecondaryContainer,
      fontStyle: "italic",
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
    },
    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: dynamicStyles.secondaryContainer,
      marginRight: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: dynamicStyles.errorContainer,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginHorizontal: widthPercentageToDP(0.5),
    },
    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: dynamicStyles.displaybgPrimary,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    indeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: dynamicStyles.indertermineChip,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    malechipText: {
      fontSize: FontSize.Antz_Strong,
      color: dynamicStyles.onPrimaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Strong,
      color: dynamicStyles.onPrimaryContainer,
    },
    undeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: dynamicStyles.onPrimaryContainer,
    },
    indeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: dynamicStyles.onPrimaryContainer,
    },
  });
