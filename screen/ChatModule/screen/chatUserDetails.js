import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableWithoutFeedback } from "react-native";
import { useSelector } from "react-redux";
import Spacing from "../../../configs/Spacing";
import Header from "../../../components/Header";
import FontSize from "../../../configs/FontSize";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Switch from "../../../components/Switch";
import ChatListItem from "../chatListItem";
import { TouchableOpacity } from "react-native";
import {
  getGroupDetails,
  getGroupMember,
  groupRemoveMember,
} from "../../../services/chatModules/chatsApi";
import { useNavigation } from "@react-navigation/native";
import { errorToast, successToast, warningDailog } from "../../../utils/Alert";
import Loader from "../../../components/Loader";
import ChatUserCard from "../../../components/ChatModule/chatUserCard";

const ChatUserDetails = (props) => {
  const navigation = useNavigation();
  const {
    name,
    image,
    group_id,
    groupMember,
    group_name,
    member_count,
    group_image,
    user_profile_pic,
    user_name,
  } = props.route.params?.item;
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);

  const [moreOptionData, setMoreOptionData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [existMe, setExistMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState("");

  useEffect(() => {
    setMoreOptionFn();
    myGroupCheck(groupData);
  }, [groupData?.length > 1]);

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      groupDetails();
      groupMemberList();
    });

    return subscribe;
  }, [navigation]);

  const handleImageClick = (imageUrl) => {
    setEnlargedImageUrl(imageUrl);
    setModalVisible(true);
  };

  const myGroupCheck = (users) => {
    const data = users?.filter((i) => i.user_id == UserId);
    if (data.length > 0) {
      setExistMe(true);
    } else {
      setExistMe(false);
    }
  };
  const setMoreOptionFn = () => {
    let options = [];
    if (groupData?.length > 1) {
      options.push(
        {
          id: 1,
          option: "Add participants",
          screen: "NewGroup",
          data: groupData,
        },
        {
          id: 2,
          option: "Change Group Name",
          screen: "ChangeGroupName",
          data: props.route.params?.item,
        }
      );
    }
    setMoreOptionData(options);
  };

  const groupDetails = () => {
    setLoading(true);
    getGroupDetails(group_id)
      .then((res) => {
        setLoading(false);
        setGroupData(res.data);
        myGroupCheck(res.data);
      })
      .catch((err) => {
        setLoading(false);
        errorToast("Error!", err.message);
      });
  };

  const groupMemberList = () => {
    let obj = {
      group_id: group_id,
    };
    getGroupMember(obj)
      .then((res) => {
        setGroupMembers(res.data);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const removeMember = (id) => {
    let obj = {
      group_id: group_id,
      user_id: id ? id : UserId,
    };
    groupRemoveMember(obj)
      .then((res) => {
        if (res.success) {
          successToast("Success!!!", res.message);
          groupDetails();
          groupMemberList();
          myGroupCheck(groupData);
        }
      })
      .catch((err) => {
        errorToast("Error!", err.message);
      });
  };
  const deleteGroup = () => {
    console.log("call me for delete");
  };

  // const [notification, setNotification] = useState(false);
  // const notificationToggle = () => setNotification(!notification);

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <Header noIcon={true} optionData={moreOptionData} />
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={() => handleImageClick(image
                    ? image
                    : group_image
                    ? group_image
                    : user_profile_pic
                    ? user_profile_pic
                    : "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/graham.jpg")}>
              <Image
                source={{
                  uri: image
                    ? image
                    : group_image
                    ? group_image
                    : user_profile_pic
                    ? user_profile_pic
                    : "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/graham.jpg",
                }}
                style={styles.profilePic}
              />
            </TouchableOpacity>
            <Text style={[styles.nameText, FontSize.Antz_Major_Title]}>
              {group_name ? group_name : user_name ? user_name : name}
            </Text>
            {groupData?.length > 1 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: Spacing.mini,
                }}
              >
                <Text
                  style={[
                    FontSize.Antz_Minor_Regular,
                    {
                      marginHorizontal: Spacing.mini,
                      color: constThemeColor?.onSurfaceVariant,
                    },
                  ]}
                >
                  Group .
                </Text>
                <Text
                  style={[
                    FontSize.Antz_Minor_Regular,
                    {
                      marginHorizontal: Spacing.mini,
                      color: constThemeColor?.onSurfaceVariant,
                    },
                  ]}
                >
                  {groupData?.length} participants
                </Text>
              </View>
            )}
          </View>
          {groupData?.length > 1 && (
            <View
              style={[
                styles.profileSection,
                {
                  marginTop: Spacing.body,
                  alignItems: null,
                  paddingHorizontal: Spacing.body,
                },
              ]}
            >
              <Text style={[FontSize.Antz_Minor_Title]}>Group bio</Text>
              <View style={[styles.rightSection, { marginTop: Spacing.mini }]}>
                <Text
                  style={[
                    FontSize.Antz_Minor_Title,
                    {
                      color: constThemeColor?.onSurfaceVariant,
                      marginRight: Spacing.mini,
                    },
                  ]}
                >
                  Created by Ramij Dafadar,
                </Text>
                <Text
                  style={[
                    FontSize.Antz_Minor_Title,
                    { color: constThemeColor?.onSurfaceVariant },
                  ]}
                >
                  09/08/17
                </Text>
              </View>
            </View>
          )}
          <View style={[styles.profileSection, styles.profileCard]}>
            <Text style={[FontSize.Antz_Minor_Title]}>
              Media, links, and docs
            </Text>
            <View style={styles.rightSection}>
              <Text
                style={[
                  FontSize.Antz_Minor_Title,
                  { color: constThemeColor?.onSurfaceVariant },
                ]}
              >
                2
              </Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={constThemeColor?.onSurfaceVariant}
              />
            </View>
          </View>
          <View style={[styles.profileSection, { alignItems: null }]}>
            {/* <View
              style={[styles.cardInnerBody, { marginBottom: Spacing.major }]}
            >
              <MaterialCommunityIcons
                name="bell"
                size={24}
                color={constThemeColor?.onSurfaceVariant}
              />
              <Text
                style={[
                  FontSize.Antz_Minor_Title,
                  { marginHorizontal: Spacing.minor },
                ]}
              >
                Mute notifications
              </Text>
              <View style={{ position: "absolute", right: 10 }}>
                <Switch
                  active={notification}
                  handleToggle={notificationToggle}
                />
              </View>
            </View> */}
            <View style={styles.cardInnerBody}>
              <MaterialIcons
                name="photo"
                size={24}
                color={constThemeColor?.onSurfaceVariant}
              />
              <Text
                style={[
                  FontSize.Antz_Minor_Title,
                  { marginHorizontal: Spacing.minor },
                ]}
              >
                Media Visibility
              </Text>
            </View>
          </View>
          {groupData?.length > 1 && (
            <View
              style={[
                styles.profileSection,
                { alignItems: null, marginTop: Spacing.body },
              ]}
            >
              <View
                style={[
                  styles.cardInnerBody,
                  { marginBottom: Spacing.major, paddingHorizontal: 0 },
                ]}
              >
                <Text
                  style={[
                    FontSize.Antz_Minor_Title,
                    { marginHorizontal: Spacing.minor },
                  ]}
                >
                  {groupMembers?.length} participants
                </Text>
                <View style={{ position: "absolute", right: 10 }}>
                  <MaterialIcons
                    name="search"
                    size={24}
                    color={constThemeColor?.onSurfaceVariant}
                  />
                </View>
              </View>
              <View style={{paddingHorizontal:Spacing.small}}>
                {groupMembers?.map((item, index) => {
                  return (
                    // <ChatListItem
                    //   chat={item}
                    //   key={index?.toString()}
                    //   trick={false}
                      // onPress={() => {
                      //   warningDailog(
                      //     null,
                      //     `Want to remove ${
                      //       item?.user_first_name ?? ""
                      //     } from the Group?`,
                      //     "Confirm",
                      //     () => {
                      //       removeMember(item?.user_id);
                      //     },
                      //     "Cancel",
                      //     () => {
                      //       console.log("cancel");
                      //     }
                      //   );
                      // }}
                    // />
                    <ChatUserCard 
                      key={index?.toString()}
                      trick={false}
                      image={item?.user_profile_pic ?? "https://e7.pngegg.com/pngimages/550/997/png-clipart-user-icon-foreigners-avatar-child-face.png"}
                      name={item?.user_first_name + " " + item?.user_last_name}
                      message={"NA"}
                      onPress={() => {
                        warningDailog(
                          null,
                          `Want to remove ${
                            item?.user_first_name ?? ""
                          } from the Group?`,
                          "Confirm",
                          () => {
                            removeMember(item?.user_id);
                          },
                          "Cancel",
                          () => {
                            console.log("cancel");
                          }
                        );
                      }}
                    />
                  );
                })}
              </View>
            </View>
          )}
          {groupData?.length > 1 && (
            <>
              {existMe ? (
                <TouchableOpacity
                  style={[
                    styles.profileSection,
                    {
                      alignItems: null,
                      marginTop: Spacing.body,
                      paddingBottom: 0,
                    },
                  ]}
                  onPress={() => removeMember()}
                >
                  <View
                    style={[
                      styles.cardInnerBody,
                      { marginBottom: Spacing.major },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="location-exit"
                      size={24}
                      color={constThemeColor?.error}
                    />
                    <Text
                      style={[
                        FontSize.Antz_Minor_Title,
                        {
                          marginHorizontal: Spacing.minor,
                          color: constThemeColor?.error,
                        },
                      ]}
                    >
                      Exit group
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.profileSection,
                    {
                      alignItems: null,
                      marginTop: Spacing.body,
                      paddingBottom: 0,
                    },
                  ]}
                  onPress={() => deleteGroup()}
                >
                  <View
                    style={[
                      styles.cardInnerBody,
                      { marginBottom: Spacing.major },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="location-exit"
                      size={24}
                      color={constThemeColor?.error}
                    />
                    <Text
                      style={[
                        FontSize.Antz_Minor_Title,
                        {
                          marginHorizontal: Spacing.minor,
                          color: constThemeColor?.error,
                        },
                      ]}
                    >
                      Delete group
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Image
            source={{ uri: enlargedImageUrl }}
            style={styles.enlargedImage}
          />
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.lightGrey,
    },
    body: {
      flex: 1,
      padding: Spacing.body,
    },
    profileSection: {
      alignItems: "center",
      paddingVertical: Spacing.minor,
      backgroundColor: reduxColors?.whiteSmoke,
      borderRadius: 10,
    },
    profileCard: {
      marginVertical: Spacing.micro + Spacing.small,
      flexDirection: "row",
      paddingHorizontal: Spacing.micro + Spacing.small,
      alignItems: "center",
      justifyContent: "space-between",
    },
    profilePic: {
      height: 100,
      width: 100,
      borderRadius: 50,
    },
    nameText: {
      paddingTop: Spacing.small,
      color: reduxColors.onSurfaceVariant,
    },
    rightSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    cardInnerBody: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.minor,
      marginVertical: Spacing.mini,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: reduxColors?.blackWithPointEight,
    },
    closeButton: {
      position: "absolute",
      top: 20,
      right: 20,
    },
    enlargedImage: {
      width: "100%",
      height: "50%",
    },
  });

export default ChatUserDetails;
