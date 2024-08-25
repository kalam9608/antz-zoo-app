// Created By: Asutosh Raj
// Created At: 11/05/2023
// modified by Wasim Akram  at 12/05/2023
// description : fixed design as per figma

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import SearchAnimalHeader from "../components/SearchAnimalHeader";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Colors from "../configs/Colors";
import AddMedicalRecordCard from "../components/AddMedicalRecordCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  searchAnimalDepartment,
  searchUserListing,
} from "../services/Animal_movement_service/SearchApproval";
import Loader from "../components/Loader";
import ListEmpty from "../components/ListEmpty";
import { setApprover, setRequestBy } from "../redux/AnimalMovementSlice";
import { RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";
// import { TouchableOpacity } from "@gorhom/bottom-sheet";
import FontSize from "../configs/FontSize";
import {
  getRoleListDetails,
  getRoleListFilterData,
} from "../services/staffManagement/addPersonalDetails";
import { AntDesign, Feather } from "@expo/vector-icons";
import Spacing from "../configs/Spacing";
import ModalFilterComponent, { ModalTitleData } from "./ModalFilterComponent";
import { useToast } from "../configs/ToastConfig";
import UserCustomCard from "./UserCustomCard";

const InchargeAndApproverSelect = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [deptDataValue, setDeptDataValue] = useState("");
  const [moveAnimal, setMoveAnimal] = useState([]);
  const [dropDownData, setDropDownData] = useState([]);
  const [roleValue, setRoleValue] = useState(null);
  const [roleValueId, setRoleValueId] = useState("");
  const [Loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState("");
  const gotoBackPage = () => navigation.goBack();
  const [roleList, setRoleList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [staffDataLength, setStaffDataLength] = useState(0);
  const [search, setSearch] = useState(false);
  const allUser = {
    id: null,
    name: "All Users",
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const handleSearch = (text) => {
    setSearchData(text);
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setLoading(true);
        setPage(1);
        loadData(1, text, roleValueId);
        // closeMenu(allUser);
      }, 1500);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      const getData = setTimeout(() => {
        setLoading(true);
        setPage(1);
        loadData(1, "", roleValueId);
        // closeMenu(allUser);
      }, 1500);
      return () => clearTimeout(getData);
    }
  };

  const onValueChacked = (e) => {
    /**
     * Redux value save approvar and request by
     */
    // console.log(props?.route?.params?.selectedInchargeIds?.includes(e.user_id));
    if (props?.route?.params?.is_single) {
      setSelectedUsers([e]);
    } else {
      if (selectedIds?.includes(e?.user_id)) {
        if (props?.route?.params?.screen == "addMember") {
          if (!props?.route?.params?.selectedInchargeIds?.includes(e.user_id)) {
            setSelectedUsers((old) => {
              return old?.filter((v) => v?.user_id !== e?.user_id);
            });
          }
        } else {
          setSelectedUsers((old) => {
            return old?.filter((v) => v?.user_id !== e?.user_id);
          });
        }
      } else {
        setSelectedUsers((old) => {
          if (props?.route?.params?.allowMultipleIncharge) {
            if (props?.route?.params?.allowMultipleIncharge === "false") {
              if (old?.length === 1) return [e];
            }
            if (old?.length >= props?.route?.params?.maxAllowedInCharges) {
              showToast(
                "error",
                `Maximum incharge exceeded ${props?.route?.params?.maxAllowedInCharges}`
              );
              return [...old];
            }
          }
          return [...old, e];
        });
      }
    }
  };
  useEffect(() => {
    const transformedArray = props?.route?.params?.inchargeDetailsData?.map(
      (obj) => {
        return {
          departments: obj?.departments ? obj?.departments : null,
          user_profile_pic: obj?.user_profile_pic
            ? obj?.user_profile_pic
            : null,
          designation: obj?.designation ? obj?.designation : "",
          user_email: obj?.user_email,
          user_id: obj?.user_id,
          user_mobile_number: obj?.user_mobile_number,
          user_name: obj?.user_name
            ? obj?.user_name
            : `${obj?.user_first_name} ${obj?.user_last_name}`,
        };
      }
    );
    setSelectedUsers(transformedArray ? transformedArray : []);
  }, [props?.route?.params?.inchargeDetailsData]);
  useEffect(() => {
    if (selectedUsers?.length !== 0) {
      setSelectedIds(selectedUsers?.map((v) => v?.user_id));
    } else {
      setSelectedIds([]);
    }
  }, [selectedUsers]);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      getRoleList();
      loadData(1, "", null);

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [])
  );

  const handleLoadMore = () => {
    if (!Loading && staffDataLength > 0 && !search) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, searchData, roleValueId);
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (Loading || staffDataLength == 0 || search || staffDataLength < 10)
      return null;
    return <ActivityIndicator style={{ color: Colors.primary }} />;
  };

  const sendApprovalList = () => {
    if (props.route.params?.isRequestByScreen) {
      dispatch(setRequestBy(selectedUsers));
      gotoBackPage();
    } else {
      dispatch(setApprover(selectedUsers));
      gotoBackPage();
    }
  };

  const getRoleList = () => {
    getRoleListDetails()
      .then((v) => {
        let data = v?.data.map((item) => ({
          id: item.id,
          name: item.role_name,
        }));
        data.unshift(allUser);
        setRoleList(data);
        closeMenu(allUser);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //user listing api
  const loadData = (page, searchText, role_id) => {
    // setLoading(true);
    let postData = {
      zoo_id: zooID,
      page_no: page,
      q: searchText,
      isActive: true,
      type: null,
    };
    if (role_id != "" && role_id) {
      postData.role_id = role_id;
    }
    if (props?.route?.params?.screen == "addMember" || props?.route?.params?.screen == "addIncharge") {
      postData.type = props?.route?.params?.type;
      postData.site_id = props?.route?.params?.site_id;
    }

    searchUserListing(postData)
      .then((res) => {
        // setLoading(false);
        // setRefreshing(false);
        // if ((searchText.length >= 3 && page == 1) || role_id) {
        //   setStaffDataLength(0);
        //   setUserData(res.data);
        // } else {
        setSearch(false);
        let dataArr = page == 1 ? [] : userData;
        setStaffDataLength(res.data.length);
        if (res.data) {
          setUserData(dataArr.concat(res.data));
        }
        // }
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log({ error });
        showToast("error", "Oops! Something went wrong!!");
        setLoading(false);
        setRefreshing(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearSearchText = () => {
    setSearchData("");
    setLoading(true);
    setPage(1);
    loadData(1, "", null);
    closeMenu(allUser);
  };

  const [rolesFilter, setRolesFilter] = useState(false);
  const toggleRoleModal = () => {
    setRolesFilter(!rolesFilter);
  };
  const closeRoleModal = () => {
    setRolesFilter(false);
  };
  const [selectedCheckBox, setselectedCheckBox] = useState("");

  const closeMenu = (item) => {
    if (isSelectedId(item.id)) {
      setselectedCheckBox(selectedCheckBox.filter((item) => item !== item?.id));
    } else {
      setselectedCheckBox([selectedCheckBox, item?.id]);
    }
    setRoleValue(item.name ? item.name : item);
    setRoleValueId(item?.id);
    setRolesFilter(false);
    if (item?.id) {
      setPage(1);
      setLoading(true);
      loadData(1, searchData, item.id);
    } else if (!item?.id) {
      setLoading(true);
      setPage(1);
      setSearchData("");
      loadData(1, "", null);
    } else {
      if (searchData.length === 0) {
        setPage(1);
        setLoading(true);
        loadData(1, "", null);
      }
    }
  };
  const isSelectedId = (id) => {
    return selectedCheckBox.includes(id);
  };

  return (
    <>
      <Loader visible={Loading} />
      <View style={reduxColors.container}>
        <View style={reduxColors.searchbox}>
          <SearchAnimalHeader
            label="Search people"
            onPressFirst={gotoBackPage}
            onChangeText={(e) => handleSearch(e)}
            value={searchData}
            routeName={props.route?.name}
            clearSearchText={clearSearchText}
          />
          {/* <View
            style={{
              marginHorizontal: Spacing.minor,
            }}
          >
            <View>
              <Dropdown
                style={reduxColors.collectionsDropdown}
                placeholderStyle={reduxColors.placeHolderStyle}
                selectedTextStyle={reduxColors.selectedItemStyle}
                data={roleList}
                labelField="role_name"
                valueField="id"
                placeholder="Roles"
                searchPlaceholder="Search..."
                value={roleValue}
                onChange={(item) => setRoleValue(item.id)}
              />
            </View>
          </View> */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: Spacing.body,
            }}
          >
            {rolesFilter ? (
              <ModalFilterComponent
                onPress={toggleRoleModal}
                onDismiss={closeRoleModal}
                onBackdropPress={closeRoleModal}
                onRequestClose={closeRoleModal}
                data={roleList}
                closeModal={closeMenu}
                title="Filter By"
                style={{ alignItems: "flex-start" }}
                isSelectedId={isSelectedId}
                radioButton={true}
              />
            ) : null}
          </View>
          <View
            style={{
              marginHorizontal: Spacing.minor,
              marginBottom: Spacing.minor,
              alignItems: "flex-end",
            }}
          >
            <ModalTitleData
              selectDrop={roleValue ? roleValue : "All Users"}
              toggleModal={toggleRoleModal}
              filterIcon={true}
              size={22}
              filterIconStyle={{ marginLeft: Spacing.small }}
            />
          </View>
        </View>
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
            onEndReachedThreshold={0.1}
            renderItem={({ item }) => (
              <UserCustomCard
                item={item}
                onPress={() => onValueChacked(item)}
                selectedStyle={
                  selectedIds.includes(item.user_id) && reduxColors.selectedCard
                }
                type={
                  props?.route?.params?.selectedInchargeIds?.includes(
                    item.user_id
                  ) && props?.route?.params?.screen
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
                  loadData(1, "", null);
                  closeMenu(allUser);
                }}
              />
            }
          />
          {props?.route?.params?.screen == "addMember" &&
          selectedUsers.length >
            props?.route?.params?.selectedInchargeIds.length ? (
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={reduxColors.btnBg}
                onPress={sendApprovalList}
              >
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
          ) : (
            selectedUsers?.length > 0 &&
            props?.route?.params?.screen != "addMember" && (
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={reduxColors.btnBg}
                  onPress={sendApprovalList}
                >
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
            )
          )}
        </View>
      </View>
    </>
  );
};

export default InchargeAndApproverSelect;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.surfaceVariant,
    },
    btnBg: {
      backgroundColor: reduxColors.primary,
      marginVertical: Spacing.small,
      width: 90,
      height: 40,
      borderRadius: Spacing.small,
      alignItems: "center",
      justifyContent: "center",
    },
    collectionsDropdown: {
      width: "100%",
      height: 56,
      borderColor: reduxColors.outline,
      borderWidth: 1,
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.onPrimary,
      paddingHorizontal: Spacing.minor,
    },
    placeHolderStyle: {
      color: reduxColors.onPrimaryContainer,
    },
    selectedItemStyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      // textAlign: "center",
    },
    userTitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    designation: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginTop: Spacing.micro,
    },
    // department: {
    //   fontSize: FontSize.Antz_Body_Regular.fontSize,
    //   fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    //   color: reduxColors.onSurfaceVariant,
    // },
    card: {
      marginVertical: Spacing.mini,
      borderRadius: Spacing.small,
      backgroundColor: reduxColors.onPrimary,
    },
    selectedCard: {
      backgroundColor: reduxColors.surface,
      alignItems: "center",
    },
  });
