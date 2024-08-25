import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Checkbox, Searchbar } from "react-native-paper";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { searchUserListing } from "../../services/Animal_movement_service/SearchApproval";
import { RefreshControl } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import { ActivityIndicator } from "react-native";
import Colors from "../../configs/Colors";
import UserCustomCard from "../../components/UserCustomCard";
import { Image } from "react-native";
import FontSize from "../../configs/FontSize";
import Loader from "../../components/Loader";
import { setApprover, setRequestBy } from "../../redux/AnimalMovementSlice";
import MedicalSearchFooter from "../../components/MedicalSearchFooter";

const SearchUsers = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const navigation = useNavigation();
  const [userData, setUserData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [page, setPage] = useState(1);
  const [staffDataLength, setStaffDataLength] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(
    props?.route?.params?.data ? props?.route?.params?.data : []
  );

  const [checked, setChecked] = React.useState(false);
  const dispatch = useDispatch();
  const loadData = (page, searchText) => {
    // setLoading(true);
    let postData = {
      zoo_id: zooID,
      page_no: page,
      q: searchText,
      isActive: true,
      module: "notes",
    };
    searchUserListing(postData)
      .then((res) => {
        setLoading(false);
        setRefreshing(false);
        if (searchText.length > 0) {
          setStaffDataLength(0);
          setUserData(res.data);
        } else {
          setSearch(false);
          let dataArr = page == 1 ? [] : userData;
          setStaffDataLength(res.data.length);
          if (res.data) {
            setUserData(dataArr.concat(res.data));
          }
        }
      })
      .catch((error) => {
        console.log({ error });
        // showToast("error", "Oops! Something went wrong!!");
        setLoading(false);
        setRefreshing(false);
      });
  };

  const handleSearch = (text) => {
    setSearchData(text);
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setLoading(true);
        loadData(1, text, null);
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      loadData(1, "", null);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadData(1, "");

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [])
  );
  const handleLoadMore = () => {
    if (!Loading && staffDataLength > 0 && !search) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, "");
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (Loading || staffDataLength == 0 || search || staffDataLength < 10)
      return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  const onValueChacked = (e) => {
    if (selectedIds?.includes(e?.user_id)) {
      setSelectedUsers((old) => {
        return old?.filter((v) => v?.user_id !== e?.user_id);
      });
    } else {
      setSelectedUsers((old) => {
        return [...old, e];
      });
    }
  };
  useEffect(() => {
    if (selectedUsers?.length !== 0) {
      setSelectedIds(selectedUsers?.map((v) => v?.user_id));
    } else {
      setSelectedIds([]);
    }
  }, [selectedUsers]);

  const sendApprovalList = () => {
    props.route.params.onGoBack(selectedUsers), props.navigation.goBack();
  };
  return (
    <View style={reduxColors.container}>
      <Loader visible={Loading} />
      <Searchbar
        placeholder={`Search`}
        placeholderTextColor={constThemeColor?.mediumGrey}
        onChangeText={(e) => handleSearch(e)}
        inputStyle={reduxColors.input}
        style={[
          reduxColors.Searchbar,
          { backgroundColor: constThemeColor.onPrimary },
        ]}
        autoFocus={false}
        icon={({ size, color }) => (
          <Ionicons
            name="arrow-back"
            size={24}
            color
            style={{
              color: constThemeColor.onSecondaryContainer,
            }}
            onPress={() => navigation.goBack()}
          />
        )}
      />
      <View
        style={{
          flex: 1,
          marginHorizontal: Spacing.minor,
        }}
      >
        <FlatList
          data={userData}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmpty visible={Loading} />}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.4}
          contentContainerStyle={{
            paddingBottom: heightPercentageToDP(10),
          }}
          renderItem={({ item }) => (
            <UserCustomCard
              item={item}
              onPress={() => onValueChacked(item)}
              selectedStyle={
                selectedIds.includes(item.user_id) && reduxColors.selectedCard
              }
              selectedIds={selectedIds}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setPage(1);
                loadData(1, "");
              }}
            />
          }
        />
        {selectedUsers?.length > 0 && (
          <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
            <MedicalSearchFooter
              title={"User"}
              selectCount={selectedUsers?.length}
              onPress={sendApprovalList}
              selectedItems={selectedUsers}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchUsers;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.surfaceVariant,
      position: "relative",
    },
    Searchbar: {
      width: widthPercentageToDP(100),
      borderRadius: 0,
      borderBottomWidth: 1,
      borderColor: reduxColors.lightGreyHexa,
    },

    btnBg: {
      backgroundColor: reduxColors.primary,
      marginVertical: Spacing.minor,
      width: 90,
      height: 44,
      borderRadius: Spacing.small,
      alignItems: "center",
      justifyContent: "center",
    },
    selectedCard: {},
    card: {
      marginTop: Spacing.small,
      borderRadius: Spacing.small,
      flexDirection: "row",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.minor,
      width: "100%",
    },
    userTitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    designation: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginTop: Spacing.micro,
    },
  });
