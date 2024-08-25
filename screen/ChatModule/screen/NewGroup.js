import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import Header from "../../../components/Header";
import Spacing from "../../../configs/Spacing";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontSize from "../../../configs/FontSize";
import ChatListItem from "../chatListItem";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import FloatingButton from "../../../components/FloatingButton";
import { groupAddMember } from "../../../services/chatModules/chatsApi";
import { getStaffListWithPagination } from "../../../services/staffManagement/addPersonalDetails";
import ListEmpty from "../../../components/ListEmpty";
import Loader from "../../../components/Loader";
import { errorToast, successToast } from "../../../utils/Alert";
import SearchOnPage from "../../../components/searchOnPage";
import { ActivityIndicator } from "react-native-paper";
import ChatUserCard from "../../../components/ChatModule/chatUserCard";

const NewGroup = (props) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);

  const [groupUser, setGroupUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [staff, setstaff] = useState([]);
  const [staffLength, setStaffLength] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");

  const [selectedUser] = useState(
    props.route.params?.item?.map((v) => v?.user_id)
  );

  useEffect(() => {
    setIsLoading(true);
    loadData(1, "");
  }, []);

  const loadData = (count, searchText) => {
    let postData = {
      zoo_id: zooID,
      page_no: count,
      q: searchText,
      key: "chat",
    };
    getStaffListWithPagination(postData)
      .then((res) => {
        setIsLoading(false);
        if (searchText.length > 0) {
          setStaffLength(0);
          setstaff(res.data);
        } else {
          setSearch(false);
          let dataArr = count == 1 ? [] : staff;
          setStaffLength(res.data.length);
          if (res.data) {
            let user = res.data
              ?.filter((v) => v?.user_id !== UserId)
              ?.map((i) => {
                return {
                  user_id: i.user_id,
                  user_name: i.user_name,
                  role_name: i.role_name,
                  user_profile_pic:
                    i.user_profile_pic ??
                    "https://e7.pngegg.com/pngimages/550/997/png-clipart-user-icon-foreigners-avatar-child-face.png",
                  isSelected: selectedUser?.includes(i?.user_id),
                  already_member: selectedUser?.includes(i?.user_id),
                };
              });
            setstaff(dataArr.concat(user));
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const selectUser = (item) => {
    const userIndex = groupUser.findIndex(
      (user) => user.user_id === item.user_id
    );

    if (userIndex === -1) {
      setGroupUser([...groupUser, item]);
    } else {
      const updatedGroupUser = [...groupUser];
      updatedGroupUser.splice(userIndex, 1);
      setGroupUser(updatedGroupUser);
    }

    const selectItem = staff.map((v) => {
      return {
        ...v,
        isSelected: v.user_id === item.user_id ? !v.isSelected : v.isSelected,
      };
    });
    setstaff(selectItem);
  };

  const onSubmit = () => {
    let obj = {
      group_id: props.route.params?.item[0]?.group_id,
      members:
        groupUser?.length > 0
          ? [...new Set(groupUser.map((i) => i.user_id))].join(",")
          : null,
    };
    setIsLoading(true);
    groupAddMember(obj)
      .then((res) => {
        if (res?.success) {
          setIsLoading(false);
          successToast("Successful!", res.message);
          navigation.goBack();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        errorToast("Error", err.message);
      });
  };

  const handleSearch = (text) => {
    setSearchModalText(text);
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setIsLoading(true);
        loadData(1, text);
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      setSearchModalText("");
      const getData = setTimeout(() => {
        setIsLoading(true);
        loadData(1, text);
      }, 2000);
      return () => clearTimeout(getData);
    }
  };

  const clearSearchText = () => {
    setSearchModalText("");
    setIsLoading(true);
    setPage(1);
    loadData(1, "");
  };

  const handleLoadMore = () => {
    if (!isLoading && staffLength > 0 && !search) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, "");
    }
  };

  const renderFooter = () => {
    if (isLoading || staffLength == 0 || search || staffLength < 10)
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />
      <Header
        noIcon={true}
        search={true}
        title={"New group"}
        gotoSearchPage={() => setSearch(!search)}
      />
      {search && (
        <View style={{ marginBottom: Spacing.small }}>
          <SearchOnPage
            handleSearch={handleSearch}
            searchModalText={searchModalText}
            placeholderText={"Search user"}
            clearSearchText={clearSearchText}
          />
        </View>
      )}
      {groupUser?.length >= 1 && (
        <View style={{}}>
          <FlatList
            data={groupUser}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            style={[styles.headerSection]}
            renderItem={({ item }) => {
              return (
                <View style={styles.logo}>
                  <View
                    style={{
                      alignItems: "center",
                      paddingBottom: Spacing.minor,
                    }}
                  >
                    <View style={{}}>
                      <Image
                        source={{
                          uri: item?.user_profile_pic,
                        }}
                        style={styles.logoImage}
                      />
                      <TouchableOpacity
                        style={styles.closeIcon}
                        onPress={() => selectUser(item)}
                      >
                        <MaterialCommunityIcons
                          name="close"
                          size={15}
                          color={constThemeColor?.error}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={[FontSize.Antz_Body_Title, styles.headerTitle]}
                      numberOfLines={1}
                    >
                      {item?.user_name}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <FlatList
          data={staff}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={
            isLoading ? null : <ListEmpty visible={isLoading} />
          }
          renderItem={({ item }) => {
            return (
              // <View>
              //   <ChatListItem
              //     chat={item}
              //     onPress={() => selectUser(item)}
              //     trick={true}
              //   />
              // </View>
              <ChatUserCard
                name={item?.user_name}
                image={item?.user_profile_pic}
                message={
                  item?.already_member
                    ? "Already added this group"
                    : "Add to group"
                }
                onPress={() => selectUser(item)}
                trick={true}
                isSelected={item?.isSelected}
                already_member={item?.already_member}
              />
            );
          }}
          style={{ marginHorizontal: Spacing.small }}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
        />
      </View>
      {groupUser?.length > 0 && (
        <FloatingButton
          icon={selectedUser ? "check-bold" : "arrow-right"}
          onPress={() =>
            selectedUser
              ? onSubmit()
              : navigation.navigate("GroupDetails", {
                  data: groupUser,
                  groupmembers: groupUser.map((i) => i.user_id).join(","),
                })
          }
        />
      )}
    </View>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    headerSection: {
      padding: Spacing.minor,
      paddingLeft: 0,
      paddingTop: Spacing.mini,
      borderBottomWidth: 0.5,
      borderBottomColor: reduxColors?.onSurfaceVariant,
      marginBottom: Spacing.mini,
    },
    headerTitle: {
      color: reduxColors?.onSurfaceVariant,
      marginVertical: Spacing.small,
    },
    logo: {
      alignItems: "center",
      width: wp(25),
    },
    logoImage: {
      height: 50,
      width: 50,
      borderRadius: 50,
    },
    closeIcon: {
      position: "absolute",
      right: -5,
      bottom: 0,
      height: 20,
      width: 20,
      borderRadius: wp(50),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: reduxColors?.onBackground,
    },
    body: {
      flex: 1,
      padding: Spacing.body,
      backgroundColor: reduxColors?.background,
    },
    card: {
      backgroundColor: reduxColors?.onBackground,
      padding: Spacing.small,
      borderRadius: Spacing.mini,
      flexDirection: "row",
      alignItems: "center",
    },
    cardImage: {
      height: 50,
      width: 50,
      borderRadius: 50,
      backgroundColor: reduxColors?.background,
      alignItems: "center",
      justifyContent: "center",
    },
    cardBodyText: {
      color: reduxColors?.onSurfaceVariant,
      marginHorizontal: Spacing.body,
    },
    bodyTitle: {
      marginVertical: Spacing.minor,
    },
  });

export default NewGroup;
