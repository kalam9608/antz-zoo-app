import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Spacing from "../../../configs/Spacing";
import FontSize from "../../../configs/FontSize";
import { useSelector } from "react-redux";
import Header from "../../../components/Header";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import ChatInput from "../../../components/ChatModule/TextInput";
import BottomSheetModalStyles from "../../../configs/BottomSheetModalStyles";
import * as ImagePicker from "expo-image-picker";

const EditChatUserProfile = () => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageModal, setImageModal] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [imgformat, setimgformat] = useState();
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImageData(result.assets[0].uri);
      const fileExtension = result.assets[0].uri.split(".").pop();
      setimgformat(fileExtension);
    }
    setImageModal(false);
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setImageData(result.assets[0].uri);
      const fileExtension = result.assets[0].uri.split(".").pop();
      setimgformat(fileExtension);
    }
    setImageModal(false);
  };

  const closeUserImageModal = () => {
    setImageModal(false);
  };
  const toggleUserImageModal = () => {
    setImageModal(!imageModal);
  };

  return (
    <View style={styles.container}>
      <Header noIcon={true} title={"Profile"} />
      <View style={styles.body}>
        <View style={styles.imageSection}>
          <Image
            source={{
              uri:
                imageData ??
                "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/lukas.jpeg",
            }}
            style={styles.image}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => {
              setImageModal(true);
            }}
          >
            <MaterialCommunityIcons
              name="camera"
              size={24}
              color={constThemeColor?.onPrimary}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.inputWrapper}>
          <View style={styles.inputLeftIcon}>
            <MaterialIcons
              name="person"
              size={24}
              color={constThemeColor?.onSurfaceVariant}
            />
          </View>
          <View style={styles.middleSection}>
            <Text
              style={[
                FontSize.Antz_Minor_Regular,
                { color: constThemeColor?.onSurfaceVariant },
              ]}
            >
              Name
            </Text>
            <ChatInput
              value={name}
              placeholder={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          {/* <View style={styles.inputIcon}>
            <MaterialIcons
              name="edit"
              size={24}
              color={constThemeColor?.primary}
            />
          </View> */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputWrapper}>
          <View style={styles.inputLeftIcon}>
            <MaterialCommunityIcons
              name="information-outline"
              size={24}
              color={constThemeColor?.onSurfaceVariant}
            />
          </View>
          <View style={styles.middleSection}>
            <Text
              style={[
                FontSize.Antz_Minor_Regular,
                { color: constThemeColor?.onSurfaceVariant },
              ]}
            >
              About
            </Text>
            {/* <Text
              style={[
                FontSize.Antz_Body_Title,
                {
                  color: constThemeColor?.onSurfaceVariant,
                  paddingBottom: Spacing.small,
                  paddingTop: Spacing.small,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderColor: constThemeColor?.onSurfaceVariant,
                },
              ]}
            >
              Make sure there are no conflicting styles or positioning that
              might hide the menu items.
            </Text> */}
            <View>
              <ChatInput
                value={bio}
                placeholder={bio}
                onChangeText={(text) => setBio(text)}
              />
            </View>
          </View>
          {/* <View style={styles.inputIcon}>
            <MaterialIcons
              name="edit"
              size={24}
              color={constThemeColor?.primary}
            />
          </View> */}
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <View style={styles.inputLeftIcon}>
            <MaterialIcons
              name="call"
              size={24}
              color={constThemeColor?.onSurfaceVariant}
            />
          </View>
          <View style={styles.middleSection}>
            <Text
              style={[
                FontSize.Antz_Minor_Regular,
                { color: constThemeColor?.onSurfaceVariant },
              ]}
            >
              Phone
            </Text>
            <Text
              style={[
                FontSize.Antz_Body_Title,
                {
                  color: constThemeColor?.onSurfaceVariant,
                  paddingBottom: Spacing.small,
                  paddingTop: Spacing.small,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderColor: constThemeColor?.onSurfaceVariant,
                },
              ]}
            >
              7699259492
            </Text>
          </View>
        </View>
      </View>
      {imageModal ? (
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
    imageSection: {
      height: 150,
      width: 150,
      borderRadius: wp(50),
      alignSelf: "center",
      marginVertical: hp(1),
    },
    image: {
      height: 150,
      width: 150,
      borderRadius: wp(50),
      // borderWidth:StyleSheet.hairlineWidth,
      // borderColor:reduxColors?.grey
    },
    icon: {
      height: 40,
      width: 40,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "green",
      borderRadius: wp(50),
      right: 0,
      bottom: hp(2),
      position: "absolute",
    },
    inputWrapper: {
      backgroundColor: reduxColors?.onBackground,
      marginVertical: Spacing.small,
      flexDirection: "row",
    },
    inputIcon: {
      position: "absolute",
      right: 0,
      marginHorizontal: Spacing.micro,
    },
    inputLeftIcon: {
      paddingHorizontal: Spacing.mini,
      marginRight: Spacing.small,
    },
    middleSection: {
      flex: 1,
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
  });

export default EditChatUserProfile;
