import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import Card from "../../components/CustomCard";
import MoveanimalFooter from "../../components/MoveanimalFooter";
import {
  heightPercentageToDP,
  widthPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { getParentOrChildEnc } from "../../services/Animal_movement_service/MoveAnimalService";
import Loader from "../../components/Loader";
import { setDestination } from "../../redux/AnimalMovementSlice";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../configs/Colors";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import ListEmpty from "../../components/ListEmpty";
import FontSize from "../../configs/FontSize";
import { LengthDecrease } from "../../utils/Utils";
import { useToast } from "../../configs/ToastConfig";
import Spacing from "../../configs/Spacing";

const MoveToEnclosure = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [section, setSection] = useState(props.route.params?.section);
  const [enclosures, setEnclosures] = useState([]);
  const [enclosuresLength, setEnclosuresLength] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [storeArr, setStoreArr] = useState(
    props.route.params?.section ? [props.route.params?.section] : []
  );
  const isFirstRender = useRef(true);
  const [page, setPage] = useState(1);
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true);
      setPage(1);
      if (props.route?.params?.isSection == "section") {
        getParentEnclosureData(1, searchText);
      }
      if (props.route.params?.section?.user_enclosure_name) {
        CardPress(props.route.params?.section);
      }
      if (props.route?.params?.isEnclosure == "enclosure") {
        setSelectedItem(props.route?.params?.enclosure);
        setStoreArr([...storeArr, props.route?.params?.enclosure]);
      }
    });
    return unsubscribe;
  }, [navigation]);

  getParentEnclosureData = (page_count, q) => {
    let postData = {
      section_id: section?.section_id,
      page_no: page_count,
      q: q,
    };
    getParentOrChildEnc(postData)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : enclosures;
        setEnclosuresLength(res.data?.length);
        setEnclosures(dataArr.concat(res.data));
      })
      .catch((err) => {
        errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);
    getChildEnclosureData(1);
  }, [storeArr]);

  useEffect(() => {
    if (
      props.route?.params?.isSection != "section" &&
      props.route.params?.isQr &&
      enclosures?.length == 0
    ) {
      props.route.params?.onPress(selectedItem);
      // navigation.goBack();
    }
  }, [selectedItem]);

  getChildEnclosureData = (page_count, q) => {
    let postData = {
      section_id:
        section?.section_id ?? storeArr[storeArr?.length - 1]?.section_id,
      page_no: page_count,
      parent_enclosure_id: storeArr[storeArr?.length - 1]?.enclosure_id,
      q: q,
    };
    getParentOrChildEnc(postData)
      .then((res) => {
        let dataArr = page_count == 1 ? [] : enclosures;
        setEnclosuresLength(res.data?.length);
        setEnclosures(dataArr.concat(res.data));
      })
      .catch((err) => {
        errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const handleLoadMore = () => {
    if (!Loading && enclosuresLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      function isObjectBlank(obj) {
        return Object.keys(obj)?.length === 0;
      }
      let check = isObjectBlank(selectedItem);
      if (check) {
        getParentEnclosureData(nextPage, searchText);
      } else {
        getChildEnclosureData(nextPage, searchText);
      }
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (Loading || enclosuresLength == 0 || enclosuresLength < 10) return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  const CardPress = (item) => {
    isFirstRender.current = true;
    setSearchText("");
    setSelectedItem(item);
    setStoreArr([...storeArr, item]);
  };

  const gotoBack = () => {
    isFirstRender.current = true;
    setSearchText("");
    if (storeArr?.length === 1) {
      navigation.goBack();
    } else {
      setStoreArr(storeArr.slice(0, storeArr?.length - 1));
    }
  };
  const mediator = (item) => {
    props.route.params?.onPress(selectedItem);
    navigation.goBack();
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  useEffect(() => {
    if (!isFirstRender?.current) {
      if (searchText.length >= 3) {
        setPage(1);
        const getData = setTimeout(() => {
          setRefreshing(true);
          function isObjectBlank(obj) {
            return Object.keys(obj)?.length === 0;
          }
          let check = isObjectBlank(selectedItem);
          if (check) {
            getParentEnclosureData(1, searchText);
          } else {
            getChildEnclosureData(1, searchText);
          }
        }, 1000);

        return () => clearTimeout(getData);
      } else if (searchText.length == 0) {
        setPage(1);
        setLoading(true);
        function isObjectBlank(obj) {
          return Object.keys(obj)?.length === 0;
        }
        let check = isObjectBlank(selectedItem);
        if (check) {
          getParentEnclosureData(1, "");
        } else {
          getChildEnclosureData(1, "");
        }
      }
    } else {
      isFirstRender.current = false;
    }
  }, [searchText]);
  return (
    <>
      <Loader visible={Loading} />
      <StatusBar
        barStyle={"dark-content"}
        // backgroundColor={Colors.ContainerBackgroundColor}
      />
      {/* <View
        style={[
          reduxColors.headerContainer,
          {
            backgroundColor: Colors.ContainerBackgroundColor,
          },
        ]}
      >
        <TouchableOpacity
          onPress={gotoBack}
          style={{
            left: 14,
          }}
        >
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color={Colors.defaultTextColor}
          />
        </TouchableOpacity>
    

        <Text style={reduxColors.titleStyle}>
          {LengthDecrease(
            20,
            storeArr[storeArr?.length - 1]?.user_enclosure_name
              ? storeArr[storeArr?.length - 1]?.user_enclosure_name
              : storeArr[storeArr?.length - 1]?.section_name
          )}
        </Text>
      </View> */}

      <View style={reduxColors.container}>
        <View style={[reduxColors.searchbox, {}]}>
          <Searchbar
            mode="bar"
            autoFocus={false}
            editable={true}
            placeholder="Search Enclosure"
            caretHidden={true}
            onChangeText={(e) => {
              setSearchText(e);
            }}
            value={searchText}
            loading={refreshing}
            style={{
              backgroundColor: constThemeColor.surface,
              width: "100%",
            }}
            icon={(size) => (
              <Ionicons
                name="arrow-back"
                size={24}
                color={constThemeColor.neutralPrimary}
              />
            )}
            onIconPress={gotoBack}
            // right={() => (
            //   <>
            //     <MaterialIcons
            //       name="qr-code-scanner"
            //       size={24}
            //       color={reduxColors.neutralPrimary}
            //       style={{ marginRight: heightPercentageToDP(3) }}
            //       onPress={() =>
            //         navigation.navigate("LatestCamScanner", {
            //           dataSendBack: (item) => QrMergeData(item),
            //           screen: "enclosure",
            //         })
            //       }
            //     />
            //   </>
            // )}
          />
        </View>
        <View style={[reduxColors.textBox]}>
          <Text style={reduxColors.textstyle} ellipsizeMode="tail" numberOfLines={1}>
            {LengthDecrease(
              45,
              storeArr[storeArr?.length - 1]?.user_enclosure_name
                ? storeArr[storeArr?.length - 1]?.user_enclosure_name
                : storeArr[storeArr?.length - 1]?.section_name
            )}
          </Text>
        </View>
        {enclosures?.length === 0 ? (
          <ListEmpty
            label={
              storeArr?.length == 1
                ? "No Enclosure Found"
                : "No sub Enclosures Added Yet "
            }
            visible={Loading}
          />
        ) : (
          <View style={reduxColors.listbox}>
            <FlatList
              data={enclosures}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              contentContainerStyle={{ paddingBottom: 100 }}
              ListFooterComponent={renderFooter}
              onEndReachedThreshold={0.1}
              renderItem={({ item }) => (
                <Card
                  title={item.user_enclosure_name}
                  rightIcon={
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={constThemeColor.onSurfaceVariant}
                    />
                  }
                  style={reduxColors.cardstyle}
                  onPress={() => CardPress(item)}
                  svgUri={true}
                />
              )}
            />
          </View>
        )}
      </View>
      <View
        style={[
          reduxColors.footerbox,
          {
            display:
              storeArr?.length > 1 ||
              props.route?.params?.isEnclosure == "enclosure"
                ? "flex"
                : "none",
            backgroundColor: Colors.red,
          },
        ]}
      >
        <MoveanimalFooter
          type={props?.route?.params?.type}
          onPress={() => mediator()}
        />
      </View>
    </>
  );
};
export default MoveToEnclosure;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      width: "100%",
      paddingHorizontal: Spacing.body,
      backgroundColor: reduxColors.surfaceVariant,
    },
    headerContainer: {
      padding: wp(1),
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      // marginTop: hp(2),
      alignItems: "center",
      paddingVertical: 10,
    },
    titleStyle: {
      fontSize: FontSize.Antz_Major_Regular.fontSize,
      color: reduxColors.neutralPrimary,
      paddingLeft: wp(6),
    },
    footerbox: {
      position: "absolute",
      bottom: 0,
    },
    listbox: {
      width: widthPercentageToDP(90),
      paddingBottom: heightPercentageToDP(2),
    },
    cardstyle: {
      backgroundColor: reduxColors.onPrimary,
      borderRadius: widthPercentageToDP("2%"),
      marginVertical: widthPercentageToDP("2%"),
      elevation: 1, // for shadow on Android
      shadowColor: reduxColors.neutralPrimary, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 1,
      flexDirection: "row",
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    searchbox: {
      width: "100%",
      paddingTop: heightPercentageToDP(2),
      backgroundColor: reduxColors?.ContainerBackgroundColor,
    },
    textBox: {
      marginTop: Spacing.small,
      marginBottom: Spacing.small,
      paddingHorizontal: Spacing.small,
      width: "100%",
    },

    textstyle: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSecondaryContainer,
      textAlign: "left",
    },
  });
