import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, RefreshControl, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FloatingButton from "../../../components/FloatingButton";

import Header from "../../../components/Header";
import Loader from "../../../components/Loader";
/**
 * Redux Imports
 */
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../../redux/SocketSlice";

/**
 * ENV import
 */
import { WEB_SOCKET_URL } from "@env";

import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";
import {
  getGroupList,
  userListforChat,
} from "../../../services/chatModules/chatsApi";
import { errorToast } from "../../../utils/Alert";
import SearchOnPage from "../../../components/searchOnPage";
import ChatUserCard from "../../../components/ChatModule/chatUserCard";
import moment from "moment";
import FontSize from "../../../configs/FontSize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spacing from "../../../configs/Spacing";
import { event } from "react-native-reanimated";

const ChatScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [staff, setstaff] = useState([]);
  const [filterUser, setFilterUser] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [filterGroup, setFilterGroup] = useState([]);
  const [search, setSearch] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTabName, setCurrentTabName] = useState("Chats");

  const moreOptionData = [
    { id: 1, option: "New group", screen: "NewGroup" },
    // { id: 2, option: "Edit profile", screen: "EditChatUserProfile" },
    { id: 2, option: "Starred messages", screen: "StarredMessage" },
  ];

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const UserDetails = useSelector((state) => state.UserAuth?.userDetails);
  const socket = useSelector((state) => state.SocketSlice);

  useEffect(() => {
    dispatch(connect(`${WEB_SOCKET_URL}${UserId}`));
  }, []);

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      fetchChatData();
      fetchGroupData();
    });

    return subscribe;
  }, [navigation]);

  socket.socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.receiver_id == UserId) {
      fetchChatData();
    }
  };

  const fetchChatData = () => {
    let obj = {
      user_id: UserId,
    };
    setIsLoading(true);
    userListforChat(obj)
      .then((res) => {
        const mergedData = [];
        setIsLoading(false);
        res.data?.forEach((item) => {
          // Check if the user_id already exists in mergedData
          const existingItem = mergedData.find(
            (existing) => existing.user_id === item.user_id
          );

          if (!existingItem) {
            // If user_id doesn't exist in mergedData, add the item
            mergedData.push(item);
          } else if (item.last_message) {
            // If user_id exists and the current item has a non-empty last_message, update the existing item
            existingItem.last_message = item.last_message;
          }
        });
        setstaff(mergedData);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const fetchGroupData = () => {
    setIsLoading(true);
    getGroupList(UserId)
      .then((res) => {
        setIsLoading(false);
        setGroupData(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        errorToast("Error!", err.message);
      });
  };

  const handleTabChange = (index) => {
    if (index == 0) {
      setCurrentTabName("Chats");
    } else if (index == 1) {
      setCurrentTabName("Groups");
    }
  };

  const handleSearch = (text) => {
    setSearchModalText(text);
    const foundUsers = [];
    if (currentTabName == "Chats") {
      staff?.forEach((item) => {
        if (item.user_name?.toLowerCase()?.includes(text?.toLowerCase())) {
          foundUsers.push(item);
        }
      });
      setFilterUser(foundUsers);
    } else {
      groupData?.forEach((item) => {
        if (item.group_name?.toLowerCase()?.includes(text?.toLowerCase())) {
          foundUsers.push(item);
        }
      });
      setFilterGroup(foundUsers);
    }
  };

  const TabButton = (props) => {
    return (
      <MaterialTabBar
        {...props}
        tabStyle={{ backgroundColor: constThemeColor?.surfaceVariant }}
        activeColor={constThemeColor?.primary}
        indicatorStyle={{ backgroundColor: constThemeColor?.primary }}
        labelStyle={{ fontWeight: FontSize.weight500 }}
        style={{ borderWidth: 0 }}
      />
    );
  };
  return (
    <View style={styles.bg}>
      <Loader visible={isLoading} />
      <Header
        noIcon={true}
        title={UserDetails?.user_first_name + " " + UserDetails?.user_last_name}
        search={true}
        optionData={moreOptionData}
        gotoSearchPage={() => setSearch(!search)}
        connectionStatus={socket.status}
        routeName={"chats"}
      />
      {socket.status == "CLOSED" && (
        <View
          style={{
            backgroundColor: constThemeColor?.error,
            padding: Spacing.mini,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                FontSize.Antz_Minor_Regular,
                {
                  color: constThemeColor?.onPrimary,
                  marginHorizontal: Spacing.small,
                },
              ]}
            >
              You are disconnected from antz chat
            </Text>
            <MaterialCommunityIcons
              name="reload"
              size={24}
              color={constThemeColor.onPrimary}
              onPress={() => dispatch(connect(`${WEB_SOCKET_URL}${UserId}`))}
            />
          </View>
        </View>
      )}
      {socket.status == "ERROR" && (
        <View
          style={{
            backgroundColor: constThemeColor?.error,
            padding: Spacing.mini,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                FontSize.Antz_Minor_Regular,
                {
                  color: constThemeColor?.onPrimary,
                  marginHorizontal: Spacing.small,
                },
              ]}
            >
              Oops! Something wrong with server
            </Text>
            <MaterialCommunityIcons
              name="reload"
              size={24}
              color={constThemeColor.onPrimary}
              onPress={() => dispatch(connect(`${WEB_SOCKET_URL}${UserId}`))}
            />
          </View>
        </View>
      )}
      {search && (
        <SearchOnPage
          handleSearch={handleSearch}
          searchModalText={searchModalText}
          placeholderText={"Search user"}
          clearSearchText={() => handleSearch("")}
        />
      )}
      <Tabs.Container
        renderTabBar={TabButton}
        onIndexChange={(index) => handleTabChange(index)}
      >
        <Tabs.Tab name="Chats">
          <Tabs.ScrollView>
            <ChatsRoute
              filterUser={filterUser}
              staff={staff}
              isLoading={isLoading}
              onRefresh={() => {
                fetchChatData();
              }}
              onPress={(item) =>
                navigation.navigate("ChatList", { item: item, group: false })
              }
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Groups">
          <Tabs.ScrollView>
            <GroupRoute
              filterGroup={filterGroup}
              groupData={groupData}
              onPress={(item) =>
                navigation.navigate("ChatList", { item: item, group: true })
              }
              onRefresh={() => {
                fetchGroupData();
              }}
              isLoading={isLoading}
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
      <FloatingButton
        icon={"plus-circle-outline"}
        onPress={() => navigation.navigate("SelectContact")}
      />
    </View>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    bg: {
      flex: 1,
    },
    body: {
      flex: 1,
      backgroundColor: reduxColors?.background,
    },
    list: {
      padding: 10,
    },
  });

export default ChatScreen;

const ChatsRoute = ({ filterUser, staff, isLoading, onRefresh, onPress }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  return (
    <View style={styles.body}>
      <FlatList
        data={filterUser && filterUser?.length > 0 ? filterUser : staff}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <ChatUserCard
              image={
                item?.user_profile_pic ??
                "https://e7.pngegg.com/pngimages/550/997/png-clipart-user-icon-foreigners-avatar-child-face.png"
              }
              name={item?.user_name}
              timeStamp={moment(item?.latest_message_time).format("LT")}
              message={item?.last_message}
              count={item?.unseen_count}
              onPress={() => onPress(item)}
            />
          );
        }}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const GroupRoute = ({
  filterGroup,
  groupData,
  isLoading,
  onPress,
  onRefresh,
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  return (
    <View style={styles.body}>
      <FlatList
        data={filterGroup && filterGroup?.length > 0 ? filterGroup : groupData}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <ChatUserCard
              image={
                item?.group_image ??
                "https://e7.pngegg.com/pngimages/550/997/png-clipart-user-icon-foreigners-avatar-child-face.png"
              }
              name={item?.group_name}
              timeStamp={moment(item?.latest_message_time).format("LT")}
              onPress={() => onPress(item)}
            />
          );
        }}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};
