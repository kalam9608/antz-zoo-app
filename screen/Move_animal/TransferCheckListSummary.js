import React, { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Spacing from "../../configs/Spacing";
import { useSelector } from "react-redux";
import { FlatList } from "react-native";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import ListEmpty from "../../components/ListEmpty";
import CheckListSummayComponent from "../../components/Transfer/CheckListSummayComponent";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  getFilledChecklist,
  transferChecklist,
} from "../../services/Animal_movement_service/MoveAnimalService";

const TransferCheckListSummary = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const TransferChecklistData = useSelector(
    (state) => state.AnimalTransfer.transferChecklistData
  );
  const styles = style(constThemeColor);
  const navigation = useNavigation();
  const [Loading, setLoading] = useState(false);
  const [listDataArray, setListDataArray] = useState([]);
  const handleEditButtonPress = () => {
    navigation.navigate("TransferCheckList", {
      checklistData: listDataArray,
      animalMovementId: props?.route?.params?.animalMovementId,
      requestId: props?.route?.params?.id,
      screen: props?.route?.params?.screen,
      edit: props?.route?.params?.edit,
      qrGenerated: props?.route?.params?.qrGenerated,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      checklistApi();
    }, [])
  );

  const checklistApi = () => {
    setLoading(true);
    Promise.all([
      transferChecklist(),
      getFilledChecklist({
        animal_movement_id: props?.route?.params?.animalMovementId,
      }),
    ])
      .then((res) => {
        const jsonData = res[0].data;
        const checkedData = res[1]?.data;
        jsonData.forEach((category) => {
          if (category.sub_category) {
            category.sub_category.forEach((subCategory) => {
              if (subCategory.items) {
                let itemStatus = false;
                subCategory.items.forEach((item) => {
                  const itemFind = findItemByKey(checkedData, item?.key);

                  if (item.type === "checkbox") {
                    item.value = itemFind?.value ? true : false;
                    if (itemFind?.value) {
                      itemStatus = true;
                    }
                  } else if (
                    item.type === "textbox" ||
                    item.type === "multi_line_textbox"
                  ) {
                    item.value = itemFind?.value ?? "";
                  }
                });
              }
            });
          } else if (category.items) {
            category.items.forEach((item) => {
              const itemFind = findItemByKey(checkedData, item?.key);
              if (item.type === "checkbox") {
                item.value = itemFind?.value
                  ? Boolean(Number(itemFind?.value))
                  : false;
              } else if (
                item.type === "textbox" ||
                item.type === "multi_line_textbox"
              ) {
                item.value = itemFind?.value ?? "";
              }
            });
          }
        });
        handleCheckBox(jsonData);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const findItemByKey = (dataArray, key) => {
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i].key == key) {
        return dataArray[i];
      }
    }
    return null;
  };

  const handleCheckBox = (itemData) => {
    const mapData = itemData?.map((item, i) => {
      if (item?.sub_category) {
        return {
          ...item,
          active: item?.sub_category?.some((p) =>
            p?.items?.some((v) => v.value)
          ),
          sub_category: item?.sub_category?.map((value) => ({
            ...value,
            active: value?.items?.some((v) => v.value),
          })),
        };
      } else if (item?.items) {
        return {
          ...item,
          active: item?.items?.some((v) => v.value),
        };
      }
    });
    setListDataArray(mapData);
    setLoading(false);
  };

  // const checklistApi = () => {
  //   setLoading(true);
  //   Promise.all([
  //     transferChecklist(),
  //     getFilledChecklist({
  //       animal_movement_id: props?.route?.params?.animalMovementId,
  //     }),
  //   ])
  //     .then((res) => {
  //       const jsonData = res[0].data;
  //       const checkedData = res[1]?.data;
  //       jsonData.forEach((category) => {
  //         if (category.sub_category) {
  //           category.sub_category.forEach((subCategory) => {
  //             if (subCategory.items) {
  //               let itemStatus = false;
  //               subCategory.items.forEach((item) => {
  //                 const itemFind = checkedData?.find((p) => p.key == item?.key);

  //                 if (item.type === "checkbox") {
  //                   item.value = itemFind?.value ? true : false;
  //                   if (itemFind?.value) {
  //                     itemStatus = true;
  //                   }
  //                 } else if (item.type === "textbox") {
  //                   item.value = itemFind?.value ?? "";
  //                 }
  //               });
  //             }
  //           });
  //         } else if (category.items) {
  //           category.items.forEach((item) => {
  //             const itemFind = checkedData?.find((p) => p.key == item?.key);
  //             if (item.type === "checkbox") {
  //               item.value = itemFind?.value
  //                 ? Boolean(Number(itemFind?.value))
  //                 : false;
  //             } else if (item.type === "textbox") {
  //               item.value = itemFind?.value ?? "";
  //             } else if (item.type === "multi_line_textbox") {
  //               item.value = itemFind?.value ?? "";
  //             }
  //           });
  //         }
  //       });
  //       handleCheckBox(jsonData);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  // const handleCheckBox = (itemData) => {
  //   const mapData = itemData?.map((item, i) => {
  //     if (item?.sub_category) {
  //       return {
  //         ...item,
  //         active: item?.sub_category?.find((p) =>
  //           p?.items?.find((v) => v.value) ? true : false
  //         )
  //           ? true
  //           : false,
  //         sub_category: item?.sub_category?.map((value) => {
  //           return {
  //             ...value,
  //             active: value?.items?.find((v) => v.value) ? true : false,
  //           };
  //         }),
  //       };
  //     } else if (item?.items) {
  //       return {
  //         ...item,
  //         active: item?.items?.find((v) => v.value) ? true : false,
  //       };
  //     }
  //   });
  //   setListDataArray(mapData);
  //   setLoading(false);
  // };
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -120}
        style={styles.container}
      >
        <Loader visible={Loading} />
        <Header
          noIcon={true}
          hideMenu={true}
          editButton={props?.route?.params?.edit}
          onPressEditButton={handleEditButtonPress}
          title={"Transfer Checklist"}
          showBackButton={true}
          style={{ backgroundColor: constThemeColor.onPrimary }}
          backgroundColor={constThemeColor.onPrimary}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={listDataArray}
          contentContainerStyle={{ paddingBottom: 85 }}
          style={{ flex: 1, marginHorizontal: Spacing.minor }}
          keyExtractor={(item, index) => index?.toString()}
          renderItem={({ item }) => {
            return (
              item?.active && (
                <View style={{ marginTop: Spacing.small }}>
                  <CheckListSummayComponent item={item} />
                </View>
              )
            );
          }}
          ListEmptyComponent={() => <ListEmpty visible={Loading} />}
        />
      </KeyboardAvoidingView>
    </>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: reduxColors.surfaceVariant,
    },
    Searchbar: {
      borderRadius: 0,
      borderBottomWidth: 1,
      borderColor: reduxColors.lightGrey,
      width: "100%",
    },
  });

export default TransferCheckListSummary;
