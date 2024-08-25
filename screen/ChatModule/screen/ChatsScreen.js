import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import bg from "../../../assets/BG.png";
import {
  GiftedChat,
  Bubble,
  Send,
  MessageText,
} from "react-native-gifted-chat";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import FontSize from "../../../configs/FontSize";
/**
 * Redux Import
 */
import { useSelector, useDispatch } from "react-redux";
import { connect, send as wssend } from "../../../redux/SocketSlice";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BottomPopUp } from "../../../components/BottomSheet";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { getFileData } from "../../../utils/Utils";
import { errorToast, warningDailog, warningToast } from "../../../utils/Alert";
import { Audio } from "expo-av";
import Spacing from "../../../configs/Spacing";
import {
  fetchPrivateMessage,
  sendImage,
  userSeenMessage,
  fetchGroupMessage,
  groupSeenMessage,
  sendDocuments,
  sendAudioFile,
} from "../../../services/chatModules/chatsApi";
import { audioType } from "../../../configs/Config";
import CustomSystemMessage from "../../../components/ChatModule/customSystemMessage";
import RenderMessageImage from "../../../components/ChatModule/renderMessageImage";
import RenderMessageText from "../../../components/ChatModule/renderMessageText";
import Loader from "../../../components/Loader";

/**
 *
 */
import { WEB_SOCKET_URL } from "@env";
import RenderCustomView from "../../../components/ChatModule/customView";
import { ActivityIndicator } from "react-native-paper";
import RenderMessageVideo from "../../../components/ChatModule/renderMessageVideo";
import RenderMessageAudio from "../../../components/ChatModule/renderMessageAudio";
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSAudioQuality,
  IOSOutputFormat,
} from "expo-av/build/Audio";
import RenderSend from "../../../components/ChatModule/renderSend";
import ScrollToBottomComponent from "../../../components/ChatModule/scrollToBottom";
import RenderBubble from "../../../components/ChatModule/renderBubble";

const optionData = [
  {
    id: "1",
    screen: "View contact",
  },
  {
    id: "2",
    screen: "Media, links, and docs",
  },
  {
    id: "3",
    screen: "Mute notifications",
  },
  {
    id: "4",
    screen: "Search",
  },
  {
    id: "5",
    screen: "Clear Chat",
  },
];

const MAX_RECONNECT_ATTEMPTS = 5;

let recording = new Audio.Recording();
const ChatScreen = (props) => {
  const navigation = useNavigation();
  const {
    user,
    group_id,
    user_id,
    group_name,
    type,
    group_image,
    user_name,
    user_profile_pic,
  } = props.route.params?.item;
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [longPress, setLongPress] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [page, setPage] = useState(1);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const UserDetails = useSelector((state) => state.UserAuth?.userDetails);

  const popUpRef = useRef();
  // let recording = new Audio.Recording();

  const sockets = useSelector((state) => state.SocketSlice);

  //Informing everyone user joined
  useEffect(() => {
    if (props.route.params?.group) {
      const initial_message = {
        action: "join",
        user_id: UserId,
        group_name: group_name,
        group_id: group_id,
        room: `${group_name}-${group_id}`,
        createdAt: new Date(),
        user_name: `${UserDetails?.user_first_name} ${UserDetails?.user_last_name}`,
        conversation_type: "group",
        message_type: "text",
      };
      if (sockets.status == "OPEN") {
        dispatch(wssend(JSON.stringify(initial_message)));
      }
    }
  }, []);

  useEffect(() => {
    if (sockets.status == "OPEN") {
      sockets.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message?.conversation_type == "private") {
          if (message.sender_id === user_id) {
            let onMsg = {
              _id: Math.random().toString(36).substring(7),
              createdAt: message.createdAt,
              conversation_type: message.conversation_type,
              message_type: message.message_type,
              user: {
                _id: message.sender_id,
              },
              isSelected: false,
            };

            //Handling Text message display
            if (message?.message_type == "text") {
              onMsg.text = message.message;
            }

            //Handling IMage message display
            if (message?.message_type == "image") {
              onMsg.image = message.message;
            }

            //Handling IMage message display
            if (message?.system == true) {
              onMsg.system = true;
            }

            //Handling IMage message display
            if (message?.message_type == "pdf") {
              onMsg.pdf = message.message;
            }

            // setMessages((prevMessages) => [...prevMessages, onMsg]);
            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, onMsg)
            );
            userSeenMessageUpdate();
          }
        } else if (message?.conversation_type == "group") {
          if (message.group_id === group_id) {
            let onMsg = {
              _id: Math.random().toString(36).substring(7),
              createdAt: message.createdAt,
              conversation_type: message.conversation_type,
              message_type: message.message_type,
              user: {
                _id: message.sender_id,
              },
            };

            //Handling Text message display
            if (message?.message_type == "text") {
              onMsg.text = message.message;
            }

            //Handling IMage message display
            if (message?.message_type == "image") {
              onMsg.image = message.message;
            }

            //Handling IMage message display
            if (message?.system == true) {
              onMsg.system = true;
            }

            //Handling IMage message display
            if (message?.message_type == "pdf") {
              onMsg.pdf = message.message;
            }

            // setMessages((prevMessages) => [...prevMessages, onMsg]);
            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, onMsg)
            );
          }
        }
      };
    }
  }, [sockets.status]);

  useEffect(() => {
    if (!props.route.params?.group) {
      userSeenMessageUpdate();
      messageHistory(1);
    } else {
      updateGroupSeenStatus();
      groupMessageHistory(1);
    }
  }, []);

  // clear state
  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      const updatedMessages = messages.map((i) => {
        if (i?.isSelected) {
          return {
            ...i,
            isSelected: false,
          };
        }
        return i;
      });
      setLongPress(false);
      setMessages(updatedMessages);
    });

    return () => {
      subscribe();
    };
  }, [navigation, messages]);
  // useFocusEffect(
  //   React.useCallback(() => {

  //     const updatedMessages = messages.map((i) => {
  //       if (i?.isSelected) {
  //         return {
  //           ...i,
  //           isSelected: false,
  //         };
  //       } else {
  //         return i;
  //       }
  //     });
  //     setLongPress(false);
  //     setMessages(updatedMessages);
  //     return () => {
  //       // Clean up the effect when the screen is unfocused (if necessary)
  //     };
  //   }, [navigation, messages])
  // );

  const userSeenMessageUpdate = () => {
    let obj = {
      user_id: UserId,
      receiver_id: user_id,
    };
    userSeenMessage(obj)
      .then((res) => {})
      .catch((err) => {
        console.log("error", err);
      });
  };

  const updateGroupSeenStatus = () => {
    let obj = {
      group_id: group_id,
      user_id: UserId,
    };
    groupSeenMessage(obj)
      .then((res) => {})
      .catch((err) => {
        console.log("error", err);
      });
  };

  const messageHistory = (count) => {
    let obj = {
      user_id: UserId,
      receiver_id: user_id,
      page_no: count,
    };
    fetchPrivateMessage(obj)
      .then((res) => {
        let all_msg = res.data?.map((item) => {
          let singleMsg = {
            _id: Math.random().toString(36).substring(7),
            createdAt: item.createdAt,
            message_type: item.message_type,
            user: {
              _id: item.sender_id,
            },
            receiver_id: item?.receiver_id,
            sender_id: item?.sender_id,
            timestamp: item?.timestamp,
            isSelected: false,
          };

          //Handling Text message display
          if (item?.message_type == "text") {
            singleMsg.text = item.content;
          }

          //Handling IMage message display
          if (item?.message_type == "image") {
            singleMsg.image = item.content;
          }

          //Handling pdf message display
          if (item?.message_type == "pdf") {
            singleMsg.pdf = item.content;
          }

          //Handling audio message display
          if (item?.message_type == "audio") {
            singleMsg.audio = item.content;
          }
          return singleMsg;
        });
        setMessages((previousMessages) =>
          GiftedChat.append(all_msg, previousMessages)
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error 1", err);
        setIsLoading(false);
      });
  };

  const groupMessageHistory = (count) => {
    let obj = {
      group_id: group_id,
      page_no: count,
    };
    fetchGroupMessage(obj)
      .then((res) => {
        let all_msg = res.data?.map((item) => {
          let singleMsg = {
            _id: Math.random().toString(36).substring(7),
            createdAt: item.createdAt,
            user: {
              _id: item.sender_id,
            },
          };

          //Handling Text message display
          if (item?.message_type == "text") {
            singleMsg.text = item.content;
          }

          //Handling IMage message display
          if (item?.message_type == "image") {
            singleMsg.image = item.content;
          }

          //Handling IMage message display
          if (item?.message_type == "pdf") {
            singleMsg.pdf = item.content;
          }

          return singleMsg;
        });
        setMessages((previousMessages) =>
          GiftedChat.append(all_msg, previousMessages)
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("", err);
        setIsLoading(false);
      });
  };

  const onShowPopUp = () => {
    popUpRef.current.show();
  };
  const onClosePopUp = (item) => {
    popUpRef.current.close();
  };

  const sendImageToServer = (image) => {
    setIsLoading(true);
    sendImage({ chat_image: image })
      .then((res) => {
        if (res.success) {
          if (props.route.params?.group) {
            onSendGroup("", "image", res.data);
          } else {
            onSend("", "image", res.data);
          }
        } else {
          warningToast("Error!", "Please try again!");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        warningToast("Error!", err.message);
        setIsLoading(false);
      });
  };

  const sendDocsToServer = (docs) => {
    setIsLoading(true);
    sendDocuments({ chat_doc: docs })
      .then((res) => {
        if (res.success) {
          if (props.route.params?.group) {
            onSendGroup("", "pdf", res.data);
          } else {
            onSend("", "pdf", res.data);
          }
        } else {
          warningToast("Error!", "Please try again!");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        warningToast("Error!", err.message);
        setIsLoading(false);
      });
  };

  const sendAudioToServer = (file) => {
    sendAudioFile({ chat_audio: file })
      .then((res) => {
        if (props.route.params?.group) {
          onSendGroup("", "audio", res.data);
        } else {
          onSend("", "audio", res.data);
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const onSend = (messageArray, type = "text", data) => {
    const msg = messageArray[0];
    if (type == "image") {
      const myMsg = {
        ...msg,
        createdAt: new Date(),
        user: {
          _id: UserId,
        },
        action: "private",
        image: data,
        conversation_type: "private",
        message_type: type,
        receiver_id: user_id,
        sender_id: UserId,
        file: {
          url: data,
        },
      };
      // socket.send(JSON.stringify(myMsg));
      dispatch(wssend(JSON.stringify(myMsg)));
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, myMsg)
      );
    } else if (type == "pdf") {
      const myMsg = {
        ...msg,
        createdAt: new Date(),
        user: {
          _id: UserId,
        },
        action: "private",
        conversation_type: "private",
        message_type: type,
        receiver_id: user_id,
        sender_id: UserId,
        pdf: data,
      };
      // socket.send(JSON.stringify(myMsg));
      dispatch(wssend(JSON.stringify(myMsg)));
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, myMsg)
      );
    } else if (type == "audio") {
      const myMsg = {
        ...msg,
        createdAt: new Date(),
        user: {
          _id: UserId,
        },
        action: "private",
        conversation_type: "private",
        message_type: type,
        receiver_id: user_id,
        sender_id: UserId,
        audio: data,
      };
      // socket.send(JSON.stringify(myMsg));
      dispatch(wssend(JSON.stringify(myMsg)));
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, myMsg)
      );
    } else {
      const myMsg = {
        ...msg,
        user: {
          _id: UserId,
        },
        action: "private",
        conversation_type: "private",
        message_type: type,
        receiver_id: user_id,
        sender_id: UserId,
      };
      // socket.send(JSON.stringify(myMsg));
      dispatch(wssend(JSON.stringify(myMsg)));
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, myMsg)
      );
    }
    setText("");
  };

  const onSendGroup = (messageArray, type = "text", data) => {
    const msg = messageArray[0];
    if (type == "image") {
      const myMsg = {
        ...msg,
        user: {
          _id: UserId,
        },
        createdAt: new Date(),
        action: "message",
        image: data,
        conversation_type: "group",
        message_type: type,
        group_id: group_id,
        group_name: group_name,
        sender_id: UserId,
        room: `${group_name}-${group_id}`,
        file: {
          url: data,
        },
      };
      dispatch(wssend(JSON.stringify(myMsg)));
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, myMsg)
      );
    } else if (type == "pdf") {
      const myMsg = {
        ...msg,
        user: {
          _id: UserId,
        },
        createdAt: new Date(),
        action: "message",
        conversation_type: "group",
        message_type: type,
        group_id: group_id,
        group_name: group_name,
        sender_id: UserId,
        room: `${group_name}-${group_id}`,
        pdf: data,
        file: {
          url: data,
        },
      };
      dispatch(wssend(JSON.stringify(myMsg)));
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, myMsg)
      );
    } else if (type == "audio") {
      const myMsg = {
        ...msg,
        user: {
          _id: UserId,
        },
        createdAt: new Date(),
        action: "message",
        conversation_type: "group",
        message_type: type,
        group_id: group_id,
        group_name: group_name,
        sender_id: UserId,
        room: `${group_name}-${group_id}`,
        audio: data,
        file: {
          url: data,
        },
      };
      // socket.send(JSON.stringify(myMsg));
      dispatch(wssend(JSON.stringify(myMsg)));
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, myMsg)
      );
    } else {
      const myMsg = {
        ...msg,
        user: {
          _id: UserId,
        },
        createdAt: new Date(),
        action: "message",
        conversation_type: "group",
        message_type: type,
        group_id: group_id,
        group_name: group_name,
        sender_id: UserId,
        room: `${group_name}-${group_id}`,
      };
      // socket.send(JSON.stringify(myMsg));
      dispatch(wssend(JSON.stringify(myMsg)));
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, myMsg)
      );
    }
    setText("");
  };

  const openSendCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    const fileType = getFileData(result?.assets[0]).type;
    if (!result?.canceled) {
      onClosePopUp();
      sendImageToServer(`data:${fileType};base64,${result?.assets[0]?.base64}`);
    } else {
      warningDailog("Warning!!", "Please allow permission to choose an Image");
    }
  };

  const chooseSendImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    // if (result?.assets[0].type == "image/gif") {
    //   warningDailog("Warning", "Not accepted this format!");
    // }
    const fileType = getFileData(result?.assets[0]).type;
    if (!result?.canceled) {
      onClosePopUp();
      sendImageToServer(`data:${fileType};base64,${result?.assets[0]?.base64}`);
    } else {
      warningDailog("Warning", "Please allow permission to choose an Image");
    }
  };

  const chooseSendVideo = () => {
    console.log("called for video");
  };
  // document picker use here
  const _pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      const file = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      if (!result.canceled) {
        onClosePopUp();
        sendDocsToServer(`data:${result.mimeType};base64,${file}`);
      }
    } catch (err) {
      console.log("error", err);
      errorToast("Error!", err.message);
    }
  };
  // audio document picker
  const sendAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: audioType,
      });
      const file = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      if (!result.canceled) {
        onClosePopUp();
        sendAudioToServer(`data:${result?.mimeType};base64,${file}`);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  // checking for forward message
  const forwardMessage = messages.filter((i) => i?.isSelected);

  const Header = ({ title, image, goBack }) => {
    return (
      <View style={styles.headerContainer}>
        {!longPress ? (
          <>
            <TouchableOpacity
              onPress={goBack}
              style={{ marginRight: Spacing.small }}
            >
              <MaterialIcons
                name="arrow-back"
                size={30}
                color={constThemeColor?.onSurfaceVariant}
              />
            </TouchableOpacity>
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 50,
                backgroundColor: constThemeColor?.secondaryContainer,
              }}
            >
              <Image
                source={{ uri: image }}
                style={{ height: 30, width: 30, borderRadius: 50 }}
              />
            </View>
            <View
              style={{
                marginHorizontal: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  FontSize.Antz_Minor_Title,
                  { color: constThemeColor?.onSurfaceVariant },
                ]}
                onPress={() =>
                  navigation.navigate("ChatUserDetails", {
                    item: props.route.params?.item ?? user,
                  })
                }
              >
                {title}
              </Text>
              {sockets.status == "OPEN" ? (
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: wp(50),
                    backgroundColor: constThemeColor?.primary,
                    marginHorizontal: Spacing.mini,
                    // alignSelf: "center",
                  }}
                />
              ) : sockets.status != "OPEN" ? (
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: wp(50),
                    backgroundColor: constThemeColor?.error,
                    marginHorizontal: Spacing.mini,
                    // alignSelf: "center",
                  }}
                />
              ) : null}
            </View>
            <View
              style={{
                position: "absolute",
                right: 10,
                flex: 1,
                flexDirection: "row",
              }}
            >
              {sockets.status !== "OPEN" && (
                <MaterialCommunityIcons
                  name="reload"
                  size={24}
                  color={constThemeColor?.onSurfaceVariant}
                  onPress={() =>
                    dispatch(connect(`${WEB_SOCKET_URL}${UserId}`))
                  }
                />
              )}
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={constThemeColor?.onSurfaceVariant}
              />
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons
                name="arrow-back"
                size={30}
                color={constThemeColor?.onSurfaceVariant}
              />
            </TouchableOpacity>
            <View style={styles.middleSection}>
              <TouchableOpacity style={{ marginHorizontal: 10 }}>
                <MaterialCommunityIcons name="star" size={24} />
              </TouchableOpacity>
              <View style={{ marginHorizontal: 10 }}>
                <MaterialCommunityIcons name="delete" size={24} />
              </View>
              <View style={{ marginHorizontal: 10 }}>
                <MaterialCommunityIcons name="content-copy" size={24} />
              </View>
              <TouchableOpacity
                style={{ marginHorizontal: 10 }}
                onPress={() =>
                  navigation.navigate("SelectContact", {
                    messageType: "forward",
                    forwardMessage: forwardMessage,
                  })
                }
              >
                <FontAwesome name="mail-forward" size={20} />
              </TouchableOpacity>
            </View>
            <View style={{ position: "absolute", right: 10 }}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={constThemeColor?.onSurfaceVariant}
              />
            </View>
          </>
        )}
      </View>
    );
  };

  const renderAction = () => {
    return (
      <TouchableOpacity style={{ margin: 8 }} onPress={onShowPopUp}>
        <MaterialCommunityIcons name="plus" size={24} />
      </TouchableOpacity>
    );
  };

  const handleLongPress = (context, message) => {
    const modifiedArray = messages.map((value) => {
      if (value?._id == message?._id && message?.isSelected == false) {
        return {
          ...value,
          isSelected: true,
        };
      } else if (value?._id == message?._id && message?.isSelected == true) {
        return { ...value, isSelected: false };
      } else {
        return { ...value };
      }
    });
    const headerShow = modifiedArray?.filter((i) => i?.isSelected)?.length;
    if (headerShow > 0) {
      setLongPress(true);
    } else {
      setLongPress(false);
    }
    setMessages(modifiedArray);
  };

  const handleUrlPress = (url) => {
    Linking.openURL(`${url}`);
  };

  const handlePhonePress = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  function isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 50;
    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    );
  }
  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const abc = await recording.prepareToRecordAsync(
        (Audio.RecordingOptionsPresets.HIGH_QUALITY = {
          isMeteringEnabled: true,
          android: {
            extension: ".m4a",
            outputFormat: AndroidOutputFormat.MPEG_4,
            audioEncoder: AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: ".aac",
            outputFormat: IOSOutputFormat.MPEG4AAC,
            audioQuality: IOSAudioQuality.MAX,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        })
        // Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const audioURI = recording.getURI();
    // console.log("Recording stopped and stored at", recording);

    //Play audio
    // await sound.loadAsync({
    //   uri: audioURI,
    // });
    // await sound.playAsync();

    //File read
    const blobToBase64 = (blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };

    // Fetch audio binary blob data
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", audioURI, true);
      xhr.send(null);
    });

    const audioBase64 = await blobToBase64(blob);
    sendAudioToServer(audioBase64);
    // const response = await axios.post("http://192.168.29.143:5000/test", {
    //   data: audioBase64,
    //   platform: Platform.OS,
    // });

    // setText(response.data);
    // console.log("Your text==========>>>>>>", response.data);
    blob.close();
    new Audio.Recording();
    onClosePopUp();
  }
  return (
    <View style={styles.bg}>
      <Loader visible={isLoading} />
      <Header
        title={group_name ? group_name : user_name ? user_name : user?.name}
        goBack={() => navigation.goBack()}
        image={
          user?.image
            ? user?.image
            : user_profile_pic
            ? user_profile_pic
            : group_image
        }
      />
      <ImageBackground source={bg} style={styles.bg}>
        <GiftedChat
          messages={messages}
          user={{
            _id: UserId,
          }}
          renderAvatar={null}
          renderSystemMessage={(message) => (
            <CustomSystemMessage currentMessage={message} />
          )}
          renderMessageText={(props) => <RenderMessageText {...props} />}
          renderMessageImage={(props) => <RenderMessageImage {...props} />}
          renderCustomView={(props) => <RenderCustomView {...props} />}
          scrollToBottom
          scrollToBottomComponent={<ScrollToBottomComponent />}
          onSend={(messages) =>
            props.route.params?.group ? onSendGroup(messages) : onSend(messages)
          }
          renderMessageVideo={(props) => <RenderMessageVideo {...props} />}
          renderMessageAudio={(props) => <RenderMessageAudio {...props} />}
          renderSend={(props) => <RenderSend {...props} />}
          renderActions={renderAction}
          renderBubble={(props) => <RenderBubble {...props} />}
          parsePatterns={(linkStyle) => [
            { type: "url", style: styles.url, onPress: handleUrlPress },
            { type: "phone", style: styles.phone, onPress: handlePhonePress },
            { type: "email", style: styles.email, onPress: handleEmailPress },
          ]}
          onLongPress={(context, message) => handleLongPress(context, message)}
          loadEarlier={isLoadingEarlier}
          isLoadingEarlier={isLoadingEarlier}
          renderLoadEarlier={(props) => {
            return (
              <>
                <ActivityIndicator />
              </>
            );
          }}
          listViewProps={{
            scrollEventThrottle: 400,
            onScroll: ({ nativeEvent }) => {
              if (isCloseToTop(nativeEvent)) {
                if (!props.route.params?.group) {
                  let nextPage = page + 1;
                  setPage(nextPage);
                  setIsLoadingEarlier(true);
                  setTimeout(() => {
                    messageHistory(nextPage);
                    setIsLoadingEarlier(false);
                  }, 2000);
                } else {
                  let nextPage = page + 1;
                  setPage(nextPage);
                  setIsLoadingEarlier(true);
                  setTimeout(() => {
                    groupMessageHistory(nextPage);
                    setIsLoadingEarlier(false);
                  }, 2000);
                }
              }
            },
          }}
        />
      </ImageBackground>
      <BottomPopUp
        ref={popUpRef}
        onTouchOutside={onClosePopUp}
        style={{ backgroundColor: constThemeColor.surface }}
      >
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              marginBottom: hp(2),
              marginHorizontal: wp(3),
            }}
            // onPress={() => setCameraOpen(true)}
            onPress={openSendCamera}
          >
            <MaterialCommunityIcons
              name="camera-outline"
              size={24}
              color={constThemeColor?.onSurfaceVariant}
            />
            <Text
              style={{
                color: constThemeColor?.onSurfaceVariant,
              }}
            >
              Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: "center",
              marginBottom: hp(2),
              marginHorizontal: wp(3),
            }}
            onPress={chooseSendImage}
          >
            <MaterialCommunityIcons
              name="image-outline"
              size={24}
              color={constThemeColor?.onSurfaceVariant}
            />
            <Text
              style={{
                color: constThemeColor?.onSurfaceVariant,
              }}
            >
              Image
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              alignItems: "center",
              marginBottom: hp(2),
              marginHorizontal: wp(3),
            }}
            onPress={chooseSendVideo}
          >
            <MaterialCommunityIcons
              name="video-outline"
              size={24}
              color={constThemeColor?.onSurfaceVariant}
            />
            <Text
              style={{
                color: constThemeColor?.onSurfaceVariant,
              }}
            >
              Video
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{
              alignItems: "center",
              marginBottom: hp(2),
              marginHorizontal: wp(3),
            }}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <MaterialCommunityIcons
              name="microphone-outline"
              size={24}
              color={constThemeColor?.onSurfaceVariant}
            />
            <Text
              style={{
                color: constThemeColor?.onSurfaceVariant,
              }}
            >
              Voice
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: "center",
              marginBottom: hp(2),
              marginHorizontal: wp(3),
            }}
            onPress={_pickDocument}
          >
            <MaterialIcons
              name="attach-file"
              size={24}
              color={constThemeColor?.onSurfaceVariant}
            />
            <Text
              style={{
                color: constThemeColor?.onSurfaceVariant,
              }}
            >
              Documents
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              alignItems: "center",
              marginBottom: hp(2),
              marginHorizontal: wp(3),
            }}
            onPress={sendAudio}
          >
            <MaterialCommunityIcons
              name="music-clef-treble"
              size={24}
              color={constThemeColor?.onSurfaceVariant}
            />
            <Text
              style={{
                color: constThemeColor?.onSurfaceVariant,
              }}
            >
              Audio
            </Text>
          </TouchableOpacity> */}
        </View>
      </BottomPopUp>
    </View>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    bg: {
      flex: 1,
    },
    headerContainer: {
      height: 50,
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 5,
      backgroundColor: reduxColors?.surfaceVariant,
    },
    middleSection: {
      flexDirection: "row",
      alignItems: "center",
      position: "absolute",
      right: wp(15),
    },
    url: {
      color: reduxColors?.skyblue,
      textDecorationLine: "underline",
      fontStyle: "italic",
    },
    phone: {
      color: reduxColors?.skyblue,
      textDecorationLine: "underline",
    },
    email: {
      color: reduxColors?.skyblue,
      textDecorationLine: "underline",
      fontStyle: "italic",
    },
  });

export default ChatScreen;
