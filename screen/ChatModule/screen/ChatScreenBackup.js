import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ChatListItem from "../chatListItem";
import FloatingButton from "../../../components/FloatingButton";

import chats from "../../../assets/data/chats.json";
import Header from "../../../components/Header";
import Loader from "../../../components/Loader";
import { useSelector } from "react-redux";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import {
  getGroupList,
  userListforChat,
} from "../../../services/chatModules/chatsApi";
import { errorToast } from "../../../utils/Alert";
import { getStaffListWithPagination } from "../../../services/staffManagement/addPersonalDetails";
import SearchOnPage from "../../../components/searchOnPage";

const ChatScreen = () => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  // const newSocket = new WebSocket(`wss://chat.desuntechnologies.com/wss/:8888?user_id=${UserId}`);
  const [search, setSearch] = useState(false);

  const [routes] = useState([
    { key: "chats", title: "Chats" },
    { key: "group", title: "Groups" },
  ]);

  const renderScene = SceneMap({
    chats: () => ChatsRoute(search),
    group: GroupRoute,
  });

  const moreOptionData = [
    { id: 1, option: "New group", screen: "NewGroup" },
    { id: 2, option: "Edit profile", screen: "EditChatUserProfile" },
  ];

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  // useEffect(() => {

  //   newSocket.onopen = () => {
  //     console.log('WebSocket connection opened');
  //   };

  //   newSocket.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   };

  //   newSocket.onclose = () => {
  //     console.log('WebSocket connection closed');
  //   };

  //   return () => {
  //     if (newSocket) {
  //       newSocket.close();
  //     }
  //   };
  // }, []);

  // console.log('messages=========>', messages);

  return (
    <View style={styles.bg}>
      <Header
        noIcon={true}
        search={true}
        optionData={moreOptionData}
        gotoSearchPage={() => setSearch(!search)}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{
              backgroundColor: constThemeColor?.surface,
            }}
            labelStyle={{
              color: constThemeColor?.onPrimaryContainer,
            }}
            indicatorStyle={{
              backgroundColor: constThemeColor?.primary,
            }}
            activeColor={constThemeColor?.onPrimaryContainer}
          />
        )}
      />
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

const ChatsRoute = (search) => {
  const navigation = useNavigation();

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);
  const [staff, setstaff] = useState([]);
  const [filterUser, setFilterUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchChatData();
      return () => {};
    }, [navigation])
  );

  const fetchChatData = () => {
    let obj = {
      user_id: UserId,
    };
    setIsLoading(true);
    userListforChat(obj)
      .then((res) => {
        const mergedData = [];

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
        setIsLoading(false);
        setstaff(mergedData);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const handleSearch = (text) => {
    setSearchModalText(text);
    const foundUsers = [];
    staff?.forEach((item) => {
      if (item.user_name?.includes(text)) {
        foundUsers.push(item);
      }
    });

    setFilterUser(foundUsers);
  };

  return (
    <View style={styles.body}>
      <Loader visible={isLoading} />
      {
        search &&
        <SearchOnPage
          handleSearch={handleSearch}
          searchModalText={searchModalText}
          placeholderText={"Search user"}
          // clearSearchText={clearSearch}
        />
      }
      <FlatList
        data={filterUser && filterUser?.length > 0 ? filterUser : staff}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            onPress={() =>
              navigation.navigate("ChatList", { item: item, group: false })
            }
          />
        )}
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setIsLoading(true);
              fetchChatData();
            }}
          />
        }
      />
    </View>
  );
};

const GroupRoute = () => {
  const navigation = useNavigation();
  const [groupData, setGroupData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  useFocusEffect(
    useCallback(() => {
      fetchGroupData();
      return () => {};
    }, [navigation])
  );

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

  return (
    <View style={styles.body}>
      <Loader visible={isLoading} />
      <FlatList
        data={groupData}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            onPress={() =>
              navigation.navigate("ChatList", { item: item, group: true })
            }
          />
        )}
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setIsLoading(true);
              fetchGroupData();
            }}
          />
        }
      />
    </View>
  );
};
