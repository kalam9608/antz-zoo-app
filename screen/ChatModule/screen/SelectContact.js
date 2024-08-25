import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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
import { getStaffListWithPagination } from "../../../services/staffManagement/addPersonalDetails";
import { ActivityIndicator } from "react-native-paper";
import Loader from "../../../components/Loader";
import SearchOnPage from "../../../components/searchOnPage";
import ChatUserCard from "../../../components/ChatModule/chatUserCard";
import FloatingButton from "../../../components/FloatingButton";

const SelectContact = (props) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const UserId = useSelector((state) => state.UserAuth?.userDetails?.user_id);

  const [isLoading, setIsLoading] = useState(false);
  const [staff, setstaff] = useState([]);
  const [staffLength, setStaffLength] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");

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
                if(props.route.params?.messageType == "forward") {
                  return {
                    isSelected: false,
                    user_id: i.user_id,
                    user_name: i.user_name,
                    user_profile_pic:
                    i.user_profile_pic ??
                    "https://e7.pngegg.com/pngimages/550/997/png-clipart-user-icon-foreigners-avatar-child-face.png",
                    role_name: i.role_name,
                  }
                }
                return {
                  user_id: i.user_id,
                  user_name: i.user_name,
                  user_profile_pic:
                    i.user_profile_pic ??
                    "https://e7.pngegg.com/pngimages/550/997/png-clipart-user-icon-foreigners-avatar-child-face.png",
                  role_name: i.role_name,
                };
              });
            setstaff(dataArr.concat(user));
          }
        }
      })
      .catch((err) => {
        console.log("error", err);
        // errorToast("Oops!", "Something went wrong!!");
        setIsLoading(false);
      });
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
  // Select user for forward messaage
  const selectUser = (item) => {
    const selectItem = staff.map((v) => {
      return {
        ...v,
        isSelected: v.user_id === item.user_id ? !v.isSelected : v.isSelected,
      };
    });
    setstaff(selectItem);
  }
  // check user select for forward
  const userSelect = staff.filter(i => i?.isSelected);
  // send for submit message
  const onSubmit = () => {
    let obj = {
      message: props.route.params?.forwardMessage,
      user_id: userSelect?.length > 0 ? [...new Set(userSelect.map((i) => i.user_id))].join(",") : null
    }
    // console.log('forward message sending function called', obj);
    if (userSelect?.length > 1) {
      navigation.goBack();
    } else {
      navigation.push('ChatList', {item: userSelect[0]});
    }
  }

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />
      <Header
        noIcon={true}
        search={true}
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
      <View style={styles.body}>
        {props.route.params?.messageType == "forward" ? null : (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("NewGroup")}
          >
            <View style={styles.cardImage}>
              <MaterialCommunityIcons name="account-group" size={30} />
            </View>
            <Text style={[FontSize.Antz_Minor_Title, styles.cardBodyText]}>
              New group
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.bodyTitle}>
          <Text style={[FontSize.Antz_Minor_Title]}>
            Contacts on Antz Chats
          </Text>
        </View>
        <FlatList
          data={staff}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <ChatUserCard
                image={item?.user_profile_pic}
                name={item?.user_name}
                message={item?.role_name ?? "NA"}
                onPress={props.route.params?.messageType == "forward" ? () => selectUser(item) : () => navigation.navigate("ChatList", { item: item })}
                trick={true}
                isSelected={item?.isSelected}
              />
            );
          }}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
        />
      </View>
      {
        props.route.params?.messageType == "forward" ?
        <FloatingButton
          icon={"check-bold"}
          onPress={onSubmit}
        /> : null}
    </View>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
      borderRadius: wp(50),
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

export default SelectContact;
