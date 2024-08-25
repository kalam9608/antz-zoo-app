import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Spacing from "../../configs/Spacing";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import CheckListSelectComponent from "../../components/Transfer/CheckListSelectComponent";
import SubmitBtn from "../../components/SubmitBtn";
import { setTransferChecklistData } from "../../redux/AnimalTransferSlice";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import {
  addTransferCheckList,
  transferChecklist,
} from "../../services/Animal_movement_service/MoveAnimalService";
import { useToast } from "../../configs/ToastConfig";

const TransferCheckList = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const gotoBack = () => navigation.goBack();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [listDataArray, setListDataArray] = useState(
    props?.route?.params?.checklistData ?? []
  );
  const { errorToast, successToast, warningToast } = useToast();
  const checkListRedux = useSelector(
    (state) => state.AnimalTransfer.transferChecklistData
  );

  const updateListDataRef = useRef(props?.route?.params?.checklistData ?? []);

  useFocusEffect(
    React.useCallback(() => {
      if (listDataArray?.length == 0) {
        checklistApi();
      }
    }, [])
  );

  const checklistApi = () => {
    setIsLoading(true);
    transferChecklist()
      .then((res) => {
        const jsonData = res.data;
        jsonData.forEach((category) => {
          if (category.sub_category) {
            category.sub_category.forEach((subCategory) => {
              if (subCategory.items) {
                subCategory.items.forEach((item) => {
                  if (item.type === "checkbox") {
                    item.value = false;
                  } else if (item.type === "textbox") {
                    item.value = "";
                  }
                });
              }
            });
          } else if (category.items) {
            category.items.forEach((item) => {
              if (item.type === "checkbox") {
                item.value = false;
              } else if (item.type === "textbox") {
                item.value = "";
              } else if (item.type === "multi_line_textbox") {
                item.value = "";
              }
            });
          }
        });
        setListDataArray(jsonData);
        updateListDataRef.current = jsonData;
      })
      .catch((e) => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const submitList = () => {
    setIsLoading(true);
    // const obj = {
    //   animal_movement_id: props?.route?.params?.animalMovementId,
    //   request_id: props?.route?.params?.requestId,
    //   checklist: JSON.stringify(listDataArray),
    // };
    const checkListData = updateListDataRef.current?.map((category) => {
      if (category.sub_category) {
        category.sub_category.forEach((subCategory) => {
          if (subCategory.items) {
            subCategory.items.forEach((item) => {
              if (item.type === "checkbox" && item.value !== true) {
                item.value = false;
              } else if (
                (item.type === "textbox" ||
                  item.type === "multi_line_textbox") &&
                item.value == undefined
              ) {
                item.value = "";
              }
            });
          }
        });
      } else if (category.items) {
        category.items.forEach((item) => {
          if (item.type === "checkbox" && item.value !== true) {
            item.value = false;
          } else if (
            (item.type === "textbox" || item.type === "multi_line_textbox") &&
            item.value == undefined
          ) {
            item.value = "";
          }
        });
      }
      return category; // Return the modified category
    });
    const obj = {
      animal_movement_id: props?.route?.params?.animalMovementId,
      request_id: props?.route?.params?.requestId,
      checklist: JSON.stringify(checkListData),
    };

    addTransferCheckList(obj)
      .then((res) => {
        if (res.success) {
          if (props?.route?.params?.qrGenerated) {
            successToast("success", "Checklist updated Successfully");
            gotoBack();
          } else {
            successToast("success", "Checklist submitted successfully");
            navigation.navigate("ApprovalSummary", {
              animal_movement_id: props.route.params?.animal_movement_id,
              site_id: props.route.params?.site_id,
              screen: props?.route?.params?.screen,
              reference: "list",
            });
          }
        } else {
          errorToast("error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log({ err });
        errorToast("error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updatedData = (v) => {
    const updatedListData = updateListDataRef.current?.map((item) =>
      item?.type === v?.type ? { ...item, ...v } : item
    );

    // Update the ref without triggering a re-render

    updateListDataRef.current = updatedListData;
  };
  const handleCheckBoxUpdatedData = (v) => {
    const updatedListData = updateListDataRef.current?.map((item) =>
      item?.type === v?.type ? { ...item, ...v } : item
    );

    // Update the ref without triggering a re-render

    updateListDataRef.current = updatedListData;
    setListDataArray(updatedListData);
  };
  const handleSubmitAndGenerateQR = () => {
    submitList();
    dispatch(setTransferChecklistData(updateListDataRef.current));

    // dispatch(setTransferChecklistData(listDataArray));
    // navigation.navigate("TransferCheckListSummary");
  };
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -60}
        style={styles.container}
      >
        <Loader visible={isLoading} />
        <Header
          noIcon={true}
          hideMenu={true}
          title={"Transfer Checklist"}
          showBackButton={true}
          style={{ backgroundColor: constThemeColor.onPrimary }}
          backgroundColor={constThemeColor.onPrimary}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={listDataArray}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{ paddingBottom: 85 }}
          style={{ flex: 1, marginHorizontal: Spacing.minor }}
          keyExtractor={(item, index) => index?.toString()}
          renderItem={({ item }) => {
            return (
              item && (
                <View style={{ marginTop: Spacing.small }}>
                  <CheckListSelectComponent
                    item={item}
                    updatedData={updatedData}
                    handleCheckBoxUpdatedData={handleCheckBoxUpdatedData}
                    edit={props?.route?.params?.edit}
                  />
                </View>
              )
            );
          }}
        />
        {props?.route?.params?.edit ? (
          <View
            style={{
              width: "100%",
              backgroundColor: constThemeColor?.onPrimary,
              paddingHorizontal: Spacing.major,
              paddingVertical: Spacing.small,
              position: "absolute",
              bottom: 0,
            }}
          >
            <SubmitBtn
              onPress={handleSubmitAndGenerateQR}
              backgroundColor={constThemeColor?.primary}
              buttonText={"Submit"}
            />
          </View>
        ) : null}

        {/* KeyboardAvoidView doesn't work well with the last element that's why static height */}
        <View
          style={{ height: Platform.OS == "android" ? Spacing.body * 6 : 0 }}
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

export default TransferCheckList;
