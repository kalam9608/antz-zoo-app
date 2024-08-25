import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import FontSize from "../../../configs/FontSize";
import Spacing from "../../../configs/Spacing";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Header from "../../../components/Header";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FloatingButton from "../../../components/FloatingButton";
import BottomSheetModalStyles from "../../../configs/BottomSheetModalStyles";
import ChatInput from "../../../components/ChatModule/TextInput";
import {
  createGroup,
  createGroupImage,
} from "../../../services/chatModules/chatsApi";
import { errorToast, successToast } from "../../../utils/Alert";
import { getFileData } from "../../../utils/Utils";
import Loader from "../../../components/Loader";

const GroupDetails = (props) => {
  const navigation = useNavigation();
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const [groupName, setGroupName] = useState("");

  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const [imageData, setImageData] = useState(null);
  const [userImageModal, setUserImageModal] = useState(false);
  const [imageId, setImageId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});

  const validate = () => {
    if (groupName.trim().length == 0) {
      setIsError({ groupName: true });
      setErrorMessage({ groupName: "Enter group name" });
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (validate()) {
      let obj = {
        group_name: groupName,
        created_by: UserId,
        members: props.route.params?.groupmembers + "," + UserId,
        group_image_id: imageId,
      };
      setLoading(true);
      createGroup(obj)
        .then((res) => {
          setLoading(false);
          navigation.navigate("Chats");
          successToast("Successful", res.message);
        })
        .catch((err) => {
          setLoading(false);
          errorToast("Error!", err.message);
        });
      // navigation.navigate("ChatList", { item: obj });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImageData(result.assets[0].uri);
      groupImage(getFileData(result.assets[0]));
    }
    setUserImageModal(false);
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImageData(result.assets[0].uri);
      groupImage(getFileData(result.assets[0]));
    }
    setUserImageModal(false);
  };
  const closeUserImageModal = () => {
    setUserImageModal(false);
  };
  const toggleUserImageModal = () => {
    setUserImageModal(!userImageModal);
  };

  const groupImage = (image) => {
    setLoading(true);
    createGroupImage({ group_image: image })
      .then((res) => {
        setLoading(false);
        setImageId(res.data?.group_image_id);
      })
      .catch((err) => {
        setLoading(false);
        errorToast("Error!", err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <Header noIcon={true} title={"New group"} />
      <View style={styles.body}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: constThemeColor?.addBackground,
            padding: Spacing.minor,
            borderRadius: Spacing.body,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setUserImageModal(true);
            }}
            style={{
              height: 40,
              width: 40,
              backgroundColor: "green",
              borderRadius: wp(50),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {imageData ? (
              <Image
                source={{ uri: imageData }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: wp(50),
                  alignSelf: "center",
                  backgroundColor: "green",
                  justifyContent: "center",
                }}
              />
            ) : (
              <MaterialCommunityIcons
                name="camera"
                size={24}
                color={constThemeColor?.onPrimary}
              />
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <ChatInput
              placeholder={"Group name"}
              value={groupName}
              onChangeText={(text) => {
                setGroupName(text);
                setErrorMessage({});
                setIsError({});
              }}
            />
            {isError.groupName && (
              <View>
                <Text
                  style={{
                    color: constThemeColor?.error,
                    marginLeft: Spacing.mini + Spacing.micro,
                  }}
                >
                  {errorMessage?.groupName}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.memberSection}>
          <Text style={[FontSize.Antz_Body_Title, styles.memberTitle]}>
            Participants: {props.route.params?.data?.length}
          </Text>
        </View>
        <FlatList
          data={props.route.params?.data}
          numColumns={4}
          contentContainerStyle={{ flex: 1 }}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.logo}>
                <View style={{ marginVertical: hp(0.5) }}>
                  <Image
                    source={{
                      uri: item?.user_profile_pic,
                    }}
                    style={styles.logoImage}
                  />
                </View>
                <View style={{ marginVertical: hp(1) }}>
                  <Text
                    style={[FontSize.Antz_Body_Title, {}]}
                    numberOfLines={1}
                  >
                    {item?.user_name}
                  </Text>
                </View>
              </View>
            );
          }}
        />
        <FloatingButton icon={"check-bold"} onPress={onSubmit} />
      </View>
      {userImageModal ? (
        <Modal
          avoidKeyboard
          animationType="fade"
          visible={true}
          onDismiss={closeUserImageModal}
          onBackdropPress={closeUserImageModal}
          onRequestClose={closeUserImageModal}
          style={[
            stylesSheet.bottomSheetStyle,
            { backgroundColor: "transparent" },
          ]}
        >
          <TouchableWithoutFeedback onPress={toggleUserImageModal}>
            <View style={[styles.modalOverlay]}>
              <View style={styles.modalContainer}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <TouchableWithoutFeedback onPress={pickImage}>
                    <View style={styles.modalView}>
                      <View
                        style={{
                          backgroundColor: constThemeColor.secondary,
                          height: 50,
                          width: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 25,
                        }}
                      >
                        <MaterialIcons
                          name="photo-library"
                          size={24}
                          color={constThemeColor.onPrimary}
                        />
                      </View>
                      <Text style={styles.docsText}>Gallery</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={takePhoto}>
                    <View style={styles.modalView}>
                      <View
                        style={{
                          backgroundColor: constThemeColor.secondary,
                          height: 50,
                          width: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 25,
                        }}
                      >
                        <MaterialIcons
                          name="camera-alt"
                          size={24}
                          color={constThemeColor.onPrimary}
                        />
                      </View>
                      <Text style={styles.docsText}>Camera</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
    </View>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors?.background,
    },
    body: {
      flex: 1,
      padding: Spacing.body,
    },

    memberSection: {
      paddingVertical: Spacing.body,
      marginHorizontal: wp(1),
    },
    memberTitle: {
      color: reduxColors?.onSurfaceVariant,
    },
    logo: {
      alignItems: "center",
      // backgroundColor:reduxColors?.surfaceVariant,
      flex: 0.25,
      marginVertical: hp(1),
      marginHorizontal: wp(0.1),
      borderRadius: wp(2),
    },
    logoImage: {
      height: 50,
      width: 50,
      borderRadius: 50,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors?.blackWithPointEight,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.surface,
      height: 150,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.major,
    },
    docsText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      marginTop: Spacing.mini,
    },
  });

export default GroupDetails;
