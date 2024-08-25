import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import {
  AntDesign,
  EvilIcons,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { setApprover } from "../../redux/AnimalMovementSlice";
import ListEmpty from "../../components/ListEmpty";
import UserCustomCard from "../../components/UserCustomCard";
import { Image } from "react-native";
import { FlatList } from "react-native";
import SaveTemplate from "../../components/SaveTemplate";
import {
  NewObservationTemplate,
  NewObservationTemplateList,
} from "../../services/ObservationService";
import { useToast } from "../../configs/ToastConfig";
import Modal from "react-native-modal";
import MedicalRecordSection from "../../components/MedicalRecordSection";
import Loader from "../../components/Loader";
import { QrGetDetails } from "../../services/staffManagement/addPersonalDetails";
const AssignTo = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [extraData, setExtraData] = useState({});
  const [selectedUserData, setSelectedUserData] = useState(
    props?.route?.params?.data ? props?.route?.params?.data : []
  );
  const [isLoading, setisLoading] = useState(false);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState([]);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const searchSelectData = (data) => {
    setSelectedUserData(data);
  };
  const saveExtraData = (e) => {
    setExtraData(e);
  };
  const [templateData, setTemplateData] = useState([]);
  const [typeId, settypeId] = useState(props?.route?.params?.selectedTypeIds);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const removeAsign = (item) => {
    const updatedUsers = selectedUserData.filter(
      (user) => user.user_id !== item.user_id
    );
    setSelectedUserData(updatedUsers);
  };
  const sendApprovalList = () => {
    if (props.route.params?.isRequestByScreen) {
      dispatch(setRequestBy(selectedUserData));
      navigation.goBack();
    } else {
      dispatch(setApprover(selectedUserData));
      navigation.goBack();
    }
  };
  const clearSection = () => {
    setSelectedUserData([]);
  };
  const handleSaveTemp = () => {
    setIsModalVisible(!isModalVisible);
    if (templateName) {
      let checkTempName = templateData.filter(
        (item) =>
          item.template_name.toLowerCase() === templateName.toLowerCase()
      );
      if (checkTempName.length === 0) {
        setisLoading(true);

        const obj = {
          zooID: zooID,
          template_name: templateName,
          template_type: "observation",
          template_items: [],
          template_sub_type: typeId,
          is_default: 0,
          status: 1,
        };
        let templatesMapItems = selectedUserData.map((item) => item.user_id);
        const numbersArray = templatesMapItems
          .map((item) => parseInt(item, 10))
          .filter((item) => !isNaN(item));
        obj.template_items = JSON.stringify(numbersArray);
        NewObservationTemplate(obj)
          .then((response) => {
            if (response?.success) {
              successToast("Success", response?.message);
              setTemplates(response?.data);
              setTemplateName("");
            }
          })
          .catch((e) => {
            setisLoading(false);
            warningToast("error", "Something went wrong");
          })
          .finally(() => {
            setisLoading(false);
          });
      } else {
        warningToast("Oops!!", "Template name already exist!");
      }
    } else {
      warningToast("Oops!!", "Please enter a valid Template name!");
    }
  };

  // const QrMergeData = (item) => {
  //   const existingIds = selectedUserData.map((item) => item?.user_id);
  //   if (!existingIds.includes(item?.user_id)) {
  //     setSelectedUserData(selectedUserData?.concat([item]));
  //   }
  // };

  const QrMergeData = (data) => {
    setisLoading(true);
    let obj = {
      type: "user",
      id: data?.user_id,
    };
    QrGetDetails(obj)
      .then((res) => {
        if (res.success == true) {
          const existingIds = selectedUserData.map((item) => item?.user_id);
          if (!existingIds.includes(data?.user_id)) {
            setSelectedUserData(selectedUserData?.concat([res?.data]));
          } else {
            warningToast("error", "User already exists!");
          }
        } else {
          errorToast("error", "Oops! Something went wrong!");
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setisLoading(true);
      getTemplateList();
      return () => {};
    }, [templates])
  );
  const getTemplateList = () => {
    const obj = {
      ZooId: zooID,
      observation_types: typeId,
    };
    NewObservationTemplateList(obj)
      .then((res) => {
        if (res.data.result) {
          setTemplateData(res?.data?.result);
        }
      })
      .catch((e) => {
        setisLoading(false);
        console.log("error", e);
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const handleLongPress = (item) => {
    navigation.navigate("Edittemplate", {
      editTempData: item,
      data: item.template_items,
      typeId: typeId,
      onGoBackData: (e) => editSelectData(e),
    });
  };

  const editSelectData = (e) => {
    setSelectedUserData(e);
  };
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSelectFromTemplate = (items) => {
    const existingIds = selectedUserData.map((item) => item.user_id);

    if (!existingIds.includes(items.template_items.user_id)) {
      setSelectedUserData(items.template_items);
    } else {
      const updatedData = selectedUserData.map((item) => {
        if (item.user_id === items.template_items.user_id) {
          return items.template_items;
        }
        return item;
      });
      setSelectedUserData(updatedData);
    }
  };
  const mappedTempData = templateData.map((item) => ({
    id: item.id,
    name: item.template_name,
    is_default: item.is_default,
    template_items: item.template_items,
  }));
  return (
    <View style={reduxColors.container}>
      <Loader visible={isLoading} />
      <Header
        title={"Add Members"}
        headerTitle={reduxColors.headerTitle}
        noIcon={true}
        search={false}
        hideMenu={true}
        backgroundColor={constThemeColor?.onPrimary}
      />
      <TouchableOpacity
        activeOpacity={0.5}
        style={[reduxColors.searchBox]}
        onPress={() =>
          navigation.navigate("searchUsers", {
            data: selectedUserData,
            extraData: extraData,
            onGoBack: (e) => searchSelectData(e),
            saveExtraData: (e) => saveExtraData(e),
          })
        }
      >
        <View style={[reduxColors.histopathologySearchField]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <EvilIcons
              name="search"
              size={30}
              color={constThemeColor.onSurfaceVariant}
              style={{ marginBottom: 6 }}
            />
            <Text
              style={{
                color: constThemeColor.onSurfaceVariant,
                marginLeft: Spacing.body,
                fontSize: FontSize.Antz_Minor_Title.fontSize,
              }}
            >
              Search People
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("LatestCamScanner", {
                dataSendBack: (item) => QrMergeData(item),
                screen: "userSelect",
              })
            }
            style={{
              alignItems: "flex-end",
              flexDirection: "row",
              alignItems: "center",
              padding: Spacing.mini,
            }}
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={22}
              color={reduxColors.onSurfaceVariant}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <ScrollView style={{ marginBottom: 75 }}>
        <View
          style={{
            // flex: 1,
            marginHorizontal: Spacing.minor,
          }}
        >
          <FlatList
            data={selectedUserData}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.4}
            renderItem={({ item }) => (
              <UserCustomCard
                item={item}
                handleRemove={() => removeAsign(item)}
              />
            )}
          />
        </View>
        {selectedUserData.length > 0 && (
          <View style={reduxColors.temp}>
            <TouchableOpacity
              onPress={() => {
                if (props.route.params?.selectedTypeIds) {
                  navigation.navigate("AddTemplate", {
                    addTempData: selectedUserData,
                    data: mappedTempData.template_items,
                    typeId: typeId,
                  });
                } else {
                  errorToast(
                    "error",
                    "Please select the observation type to create a new group"
                  );
                  navigation.goBack();
                }
              }}
            >
              <View style={reduxColors.tempView}>
                <AntDesign
                  name="save"
                  size={20}
                  color={constThemeColor.outline}
                  style={{ marginRight: Spacing.mini }}
                />
                <Text style={reduxColors.tempText}>Save new group</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearSection}>
              <View style={reduxColors.tempView}>
                <AntDesign
                  name="close"
                  size={20}
                  color={constThemeColor.tertiary}
                  style={{ marginRight: Spacing.mini }}
                />
                <Text style={reduxColors.tempText}>Clear Selection</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ marginHorizontal: Spacing.minor }}>
          {templateData.length >= 1 && (
            <MedicalRecordSection
              data={mappedTempData}
              title={"PreDefine groups"}
              handleToggle={handleSelectFromTemplate}
              titleStyle={{ color: constThemeColor.onSurface }}
              contStyle={{ backgroundColor: constThemeColor.surface }}
              onLongPress={handleLongPress}
            />
          )}
        </View>
      </ScrollView>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        hardwareBackPressCloseTimeoutMS={500}
        propagateSwipe={true}
        hideModalContentWhileAnimating={true}
        swipeThreshold={90}
        swipeDirection={"down"}
        animationInTiming={400}
        animationOutTiming={100}
        useNativeDriver={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }}
        >
          <View
            style={{
              height: 190,
              width: "95%",
              marginHorizontal: 24,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                flex: 1,
                justifyContent: "center",
                paddingHorizontal: Spacing.minor,
              }}
            >
              <Text
                style={{
                  ...FontSize.Antz_Minor_Medium,
                  marginVertical: Spacing.minor,
                }}
              >
                Enter new group name
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: constThemeColor.outlineVariant,
                  borderRadius: Spacing.mini,
                  padding: Spacing.small,
                }}
                placeholder="Group name"
                onChangeText={(text) => setTemplateName(text)}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingVertical: Spacing.minor,
                }}
              >
                <TouchableOpacity
                  onPress={toggleModal}
                  style={[
                    reduxColors.btnModal,
                    {
                      backgroundColor: constThemeColor.surfaceVariant,
                      marginRight: Spacing.small,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: constThemeColor.onSurfaceVariant,
                      ...FontSize.Antz_Minor_Medium,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveTemp}
                  style={reduxColors.btnModal}
                >
                  <Text
                    style={{
                      color: constThemeColor.onPrimary,
                      ...FontSize.Antz_Minor_Medium,
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          position: "absolute",
          bottom: 0,
          backgroundColor: constThemeColor.displaybgPrimary,
        }}
      >
        <TouchableOpacity style={reduxColors.btnBg} onPress={sendApprovalList}>
          <Text
            style={{
              fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
              color: constThemeColor.onPrimary,
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AssignTo;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    searchBox: {
      marginBottom: Spacing.body,
      marginHorizontal: Spacing.minor,
    },
    histopathologySearchField: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Minor,
      backgroundColor: reduxColors?.onPrimary,
      borderWidth: 1,
      borderColor: reduxColors?.outline,
      width: "100%",
      height: 50,
      borderRadius: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.body,
    },
    card: {
      marginVertical: Spacing.mini,
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.displaybgPrimary,
      borderWidth: 0.5,
      borderColor: reduxColors.outline,
      alignItems: "center",
      marginHorizontal: Spacing.small - 2,
    },
    btnBg: {
      backgroundColor: reduxColors.primary,
      marginVertical: Spacing.minor,
      width: 90,
      height: 44,
      borderRadius: Spacing.small,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    temp: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: Spacing.minor,
      marginVertical: Spacing.small,
    },
    tempView: {
      flexDirection: "row",
      alignItems: "center",
    },
    tempText: {
      color: reduxColors.onSurface,
      ...FontSize.Antz_Subtext_Regular,
    },
    btnModal: {
      backgroundColor: reduxColors.primary,
      alignItems: "center",
      justifyContent: "center",
      padding: Spacing.small,
      paddingHorizontal: Spacing.body,
      borderRadius: Spacing.mini,
    },
  });
