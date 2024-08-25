import { BackHandler, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import EnclosuresList from "../../components/EnclosuresList";
import Spacing from "../../configs/Spacing";
import Header from "../../components/Header";
import MoveanimalFooter from "../../components/MoveanimalFooter";
import {
  changeAnimalEnclosure,
  getEnclosuresList,
} from "../../services/GetEnclosureBySectionIdServices";
import Loader from "../../components/Loader";
import { errorToast, successToast } from "../../utils/Alert";
import { useNavigation } from "@react-navigation/native";
import FontSize from "../../configs/FontSize";
import ListEmpty from "../../components/ListEmpty";
import {
  LengthDecrease,
  capitalizeFirstLetterAndUppercaseRest,
} from "../../utils/Utils";
import EnclosureCustomCard from "../../components/EnclosureCustomCard";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

const SelectEnclosure = (props) => {
  const navigation = useNavigation();
  const [section] = useState(props.route.params?.section);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const customStyles = styles(constThemeColor);
  const permission = useSelector((state) => state.UserAuth.permission);

  const [moreLoading, setMoreLoading] = useState(false);
  const [type, setType] = useState(props?.route?.params?.type ?? "section");
  const [page, setPage] = useState([]);
  const [enclosuresList, setEnclosuresList] = useState([]);
  const [stopCallEnclosuresList, setStopCallEnclosuresList] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [enclosureId, setEnclosureId] = useState(
    props?.route?.params?.enclosureId ?? null
  );
  const [enclosureName, setEnclosureName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(
    props?.route?.params?.headerTitle ?? section?.section_name
  );
  const [searchText, setSearchText] = useState("");
  const [selectedEnclosure, setSelectedEnclosure] = useState({});
  const [selectedItem, setSelectedItem] = useState({});
  const [storeArr, setStoreArr] = useState(
    props.route.params?.section ? [props.route.params?.section] : []
  );
  const [isSingleEnclosure, setIsSingleEnclosure] = useState(false); // state to handle child_enclosure scanned
  // console.log({ ss: props?.route?.params?.headerTitle });
  // Function to determine if the scan is for a child enclosure
  const isQrAndHasParentEnclosure = () => {
    return (
      props.route?.params?.isQr &&
      props.route?.params?.section?.enclosure_parent_id !== null &&
      props.route.params?.section?.enclosure_parent_id !== undefined
    );
  };
  useEffect(() => {
    if (!props?.route?.params?.preSelected) {
      setHeaderTitle(
        LengthDecrease(
          20,
          storeArr[storeArr.length - 1]?.user_enclosure_name
            ? storeArr[storeArr.length - 1]?.user_enclosure_name
            : storeArr[storeArr.length - 1]?.section_name
        )
      );
    }
  }, [storeArr]);

  const handleSubmit = () => {
    let obj = {
      animal_ids: JSON.stringify(props.route.params?.selected_animal),
      enclosure_id: selectedEnclosure?.enclosure_id,
      enclosure_name: selectedEnclosure?.user_enclosure_name,
      section_id: props.route.params?.section?.section_id,
      section_name: props.route.params?.section?.section_name,
      site_id: props.route.params?.site_id,
      animal_movement_id: props.route.params?.animal_movement_id,
    };
    setLoading(true);
    changeAnimalEnclosure(obj)
      .then((res) => {
        if (res.success) {
          successToast("Success", res.message);
          navigation.navigate("AllocateAnimals", {
            animal_movement_id: props.route.params?.animal_movement_id,
            destinationSite: { site_id: props.route.params?.site_id },
            request_id: props.route.params?.request_id,
            transfer_type: props?.route?.params?.transfer_type,
            allocateTo: props.route.params?.allocateTo,
          });
        } else {
          errorToast(
            "Error",
            res?.message?.animal_ids ?? "Oops!, Something went wrong"
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log({ err });
        errorToast("Error", "Oops!, Something went wrong");
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   if (!props?.route?.params?.preSelected) {
  //     setLoading(true);
  //     resetState();
  //     //Note-  Avoids hitting the enclosure with the child_enclosure_id if the child enclosure has been scanned.Why? -data
  //     !props.route.params?.section?.enclosure_parent_id &&
  //       loadEnclosureList(1, type, section?.section_id, enclosureId);
  //   }
  // }, []);

  const resetState = () => {
    setPage(1);
    setEnclosuresList([]);
    setStopCallEnclosuresList(false);
  };

  const loadEnclosureList = (count, type, section_id, enclosure_id, q) => {
    let obj = {
      page_no: count,
      q: q,
    };
    if (type == "section") {
      obj.section_id = section_id;
    } else if (type == "enclosure") {
      obj.enclosure_id = enclosure_id;
    }
    obj.include_sub_enclosure = 0;
    getEnclosuresList(obj)
      .then((res) => {
        if (res?.success) {
          setEnclosuresList((prev) => {
            if (count === 1) {
              return res?.data?.list_items ?? [];
            } else {
              return [...(prev ?? []), ...(res?.data?.list_items ?? [])];
            }
          });
          setStopCallEnclosuresList(res?.data?.list_items?.length < 10);
          if (props?.route?.params?.preSelected) {
            onItemPressCheck({
              ...props?.route?.params?.preSelectedItem,
              user_enclosure_name:
                props?.route?.params?.preSelectedItem?.enclosure_name,
            });
          }
        }
      })
      .catch((err) => {
        console.log("getEnclosuresList err :: ", err);
        setEnclosuresList([]);
      })
      .finally(() => {
        setLoading(false);
        setMoreLoading(false);
        setRefreshing(false);
      });
  };
  const loadChildEnclosureList = (count, type, parentEnclosureId = null, q) => {
    let obj = {
      page_no: count,
      q: q,
    };
    if (type == "section") {
      obj.section_id =
        section?.section_id ?? storeArr[storeArr.length - 1]?.section_id;
    } else if (type == "enclosure") {
      obj.enclosure_id = parentEnclosureId
        ? parentEnclosureId
        : storeArr[storeArr.length - 1]?.enclosure_id;
    }
    obj.include_sub_enclosure = 0;
    getEnclosuresList(obj)
      .then((res) => {
        if (res?.success) {
          setEnclosuresList((prev) => {
            if (count === 1) {
              return res?.data?.list_items ?? [];
            } else {
              return [...(prev ?? []), ...(res?.data?.list_items ?? [])];
            }
          });
          setStopCallEnclosuresList(res?.data?.list_items?.length < 10);
        }
      })
      .catch((err) => {
        console.log("getEnclosuresList err :: ", err);
        setEnclosuresList([]);
      })
      .finally(() => {
        setLoading(false);
        setMoreLoading(false);
        setRefreshing(false);
      });
  };

  const handleLoadMore = () => {
    if (!loading && !moreLoading && !stopCallEnclosuresList) {
      setMoreLoading(true);
      const nextPage = page + 1;
      setPage(nextPage);
      loadEnclosureList(
        nextPage,
        type,
        section?.section_id,
        enclosureId,
        searchText
      );
    }
  };

  const renderFooter = () => {
    if (moreLoading) return <ActivityIndicator />;
    return null;
  };

  const onItemPress = (item) => {
    if (item?.sub_enclosure_count > 0) {
      setEnclosureName(item.user_enclosure_name);
      setEnclosureId(item.enclosure_id);
      setSelectedEnclosure({});
      setLoading(true);
      setEnclosuresList([]);
      setType("enclosure");
    } else {
      setSelectedEnclosure(item);
      setEnclosureName(null);
      setEnclosureId(null);
    }
  };
  const onItemPressCheck = (item) => {
    setSelectedEnclosure(item);
    setEnclosureName(item.user_enclosure_name);
    setEnclosureId(null);
  };

  // useEffect functionality
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (!props?.route?.params?.preSelected) {
        setLoading(true);
        setPage(1);
        if (props.route?.params?.isSection == "section") {
          loadEnclosureList(1, type, section?.section_id, enclosureId, "");
        }
        if (props.route.params?.section?.user_enclosure_name) {
          if (isQrAndHasParentEnclosure()) {
            loadChildEnclosureList(
              1,
              "enclosure",
              props.route.params?.section?.enclosure_parent_id,
              ""
            );
            setIsSingleEnclosure(true);
          } else CardPress(props.route.params?.section);
        }
        if (props.route?.params?.isEnclosure == "enclosure") {
          setSelectedItem(props.route?.params?.enclosure);
          setStoreArr([...storeArr, props.route?.params?.enclosure]);
        }
      } else {
        setLoading(true);
        setPage(1);
        loadEnclosureList(1, type, section?.section_id, enclosureId, "");
      }
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    if (isSingleEnclosure) {
      CardPress(props.route.params?.section);
    }
  }, [isSingleEnclosure]);
  useEffect(() => {
    return () => {
      setIsSingleEnclosure(false);
    };
  }, []);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!props?.route?.params?.preSelected) {
      setLoading(true);
      setPage(1);
      if (storeArr?.length == 1) {
        if (
          !props.route.params?.section?.enclosure_parent_id &&
          !isFirstRender.current
        ) {
          loadEnclosureList(1, "section", section?.section_id, enclosureId, "");
        } else {
          isFirstRender.current = false;
          setLoading(false);
        }
      } else {
        loadChildEnclosureList(1, type, null, "");
      }
    }
  }, [JSON.stringify(storeArr)]);

  useEffect(() => {
    if (
      props.route?.params?.isSection != "section" &&
      enclosuresList.length == 0
    ) {
      props.route.params?.onPress(selectedItem);
    }
  }, [selectedItem]);

  const CardPress = (item) => {
    isFirstRender.current = true;
    setSearchText("");
    if (item?.sub_enclosure_count > 0) {
      setSelectedItem(item);
      setType(item?.type);
      setStoreArr([...storeArr, item]);
      onItemPress(item);
    } else {
      setSelectedItem(item);
      onItemPress(item);
    }
  };

  const gotoBack = () => {
    isFirstRender.current = true;

    if (storeArr.length === 1) {
      navigation.goBack();
    } else {
      isFirstRender.current = false;
      setSearchText("");
      setStoreArr(storeArr.slice(0, storeArr.length - 1));
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        gotoBack();
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, [storeArr]);

  useEffect(() => {
    if (!isFirstRender?.current) {
      if (searchText.length >= 3) {
        setPage(1);
        const getData = setTimeout(() => {
          setRefreshing(true);
          if (storeArr?.length == 1) {
            if (
              !props.route.params?.section?.enclosure_parent_id &&
              !isFirstRender.current
            ) {
              loadEnclosureList(
                1,
                "section",
                section?.section_id,
                enclosureId,
                searchText
              );
            } else {
              isFirstRender.current = false;
            }
          } else {
            loadChildEnclosureList(1, type, null, searchText);
          }
        }, 1000);

        return () => clearTimeout(getData);
      } else if (searchText.length == 0) {
        setPage(1);
        setLoading(true);
        if (storeArr?.length == 1) {
          if (
            !props.route.params?.section?.enclosure_parent_id &&
            !isFirstRender.current
          ) {
            loadEnclosureList(
              1,
              "section",
              section?.section_id,
              enclosureId,
              ""
            );
          } else {
            isFirstRender.current = false;
          }
        } else {
          loadChildEnclosureList(1, type, null, "");
        }
      }
    } else {
      isFirstRender.current = false;
    }
  }, [searchText]);

  return (
    <>
      {/* <Header noIcon={true} title={headerTitle} customBack={gotoBack} /> */}
      <Loader visible={loading} />
      <View style={customStyles.container}>
        <View style={[customStyles.searchbox, {}]}>
          <Searchbar
            mode="bar"
            autoFocus={false}
            editable={props?.route?.params?.preSelected ? false : true}
            placeholder="Search Enclosure"
            caretHidden={true}
            onChangeText={(e) => {
              isFirstRender.current = false;
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
        <View style={[customStyles.textBox]}>
          <Text style={customStyles.textstyle}>{headerTitle}</Text>
        </View>
        <FlatList
          data={enclosuresList}
          ListEmptyComponent={<ListEmpty height={"50%"} visible={loading} />}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <EnclosureCustomCard
              // title={capitalizeFirstLetterAndUppercaseRest(
              //   item.user_enclosure_name
              // )}
              title={item.user_enclosure_name}
              subenclosuresCount={item?.sub_enclosure_count}
              icon={item.image}
              enclosureType={item?.enclosure_type ?? null}
              // onPress={() => onItemPress(item)}
              disabled={props?.route?.params?.preSelected ? true : false}
              onPress={() => CardPress({ ...item, type: "enclosure" })}
              onItemPressCheck={() => onItemPressCheck(item)}
              isSelected={item?.enclosure_id == selectedEnclosure.enclosure_id}
              onSelect={() => handleEnclosureSelect(item)}
              isAllocate={true}
            />
          )}
        />
      </View>
      {selectedEnclosure?.enclosure_id ? (
        <View style={{ position: "absolute", bottom: 0 }}>
          <MoveanimalFooter onPress={handleSubmit} />
        </View>
      ) : null}
    </>
  );
};
export default SelectEnclosure;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      paddingHorizontal: Spacing.body,
      backgroundColor: reduxColors.surfaceVariant,
    },
    mainContainer: {
      paddingLeft: Spacing.minor,
      paddingRight: Spacing.minor,
      backgroundColor: reduxColors.surfaceVariant,
    },
    showSubenclosuresContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.body,
      backgroundColor: reduxColors.onPrimary,
      borderRadius: Spacing.small,
      paddingVertical: Spacing.minor,
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
    },
    showSubenclosuresText: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
      flex: 1,
    },
    searchbox: {
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
