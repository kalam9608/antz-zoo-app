import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Touchable,
  StatusBar,
} from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import LinkTab from "../../components/LinkTab";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { clearAsyncData } from "../../utils/AsyncStorageHelper";
import { useDispatch } from "react-redux";
import { setPassCode, setSignOut } from "../../redux/AuthSlice";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import FontSize from "../../configs/FontSize";
import Animated from "react-native-reanimated";
import Spacing from "../../configs/Spacing";
import {
  ShortFullName,
  capitalize,
  getDeviceData,
  getDeviceInformation,
} from "../../utils/Utils";
import { unsetModuleLab } from "../../redux/accessLabSlice";
import { unsetPharmacyData } from "../../redux/PharmacyAccessSlice";
import Loader from "../../components/Loader";
import { useState } from "react";
import { useToast } from "../../configs/ToastConfig";
import { manageDeviceLog } from "../../services/staffManagement/addPersonalDetails";

export default function Profile() {
  const userDetails = useSelector((state) => state.UserAuth.userDetails);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const navigation = useNavigation();

  const gotoLogout = async () => {
    setIsLoading(true);
    const data = await getDeviceInformation();
    let obj = {
      user_id: userDetails?.user_id,
      user_name: userDetails?.user_name,
      zoo_id: zooID,
      type: "logout",
      device_details: data.device,
      device_id: data.device_id,
      lat: data.lat,
      long: data.long,
    };
    manageDeviceLog(obj)
      .then((token) => {
        clearAsyncData("@antz_user_device_token");
        clearAsyncData("@antz_user_data");
        clearAsyncData("@antz_user_token");
        clearAsyncData("@antz_selected_site");
        dispatch(setSignOut());
        dispatch(setPassCode(null));
        dispatch(unsetModuleLab());
        dispatch(unsetPharmacyData());
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showToast("error", "Something went wrong!, Please try again!!");
      })
      .finally(() => setIsLoading(false));
  };
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      <View style={reduxColors.container}>
        <Loader visible={isLoading} />
        <View style={{ backgroundColor: constThemeColor.onPrimaryContainer }}>
          <View style={reduxColors.topBar}>
            <View style={reduxColors.usernameAndGreeting}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() =>
                  navigation.navigate("ProfileQr", {
                    userDetails: userDetails.user_id,
                  })
                }
              >
                <MaterialIcons
                  name="qr-code"
                  size={24}
                  color={constThemeColor.onPrimary}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  marginLeft: Spacing.minor,
                  width: 30,
                  height: 30,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={()=> null}
              >
                <MaterialCommunityIcons
                  color={constThemeColor.onPrimary}
                  name="dots-vertical"
                  size={24}
                />
              </TouchableOpacity> */}
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: Spacing.minor,
            }}
          >
            <TouchableOpacity
              style={{ width: 124, height: 124, borderRadius: 62 }}
              onPress={() => {
                navigation.navigate("UserDetails", {
                  user_id: userDetails.user_id,
                });
              }}
            >
              {userDetails.profile_pic ? (
                <Animated.Image
                  source={{ uri: userDetails.profile_pic }}
                  style={{
                    width: 124,
                    height: 124,
                    borderRadius: 62,
                  }}
                />
              ) : (
                <Animated.View
                  style={[
                    {
                      width: 124,
                      height: 124,
                      borderRadius: 62,
                      backgroundColor: constThemeColor.secondary,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Animated.Text
                    style={{
                      fontSize: FontSize.Antz_Large_Title.fontSize,
                      fontWeight: FontSize.Antz_Large_Title.fontWeight,
                      textAlign: "center",
                      color: constThemeColor.onPrimary,
                    }}
                  >
                    {ShortFullName(
                      userDetails?.user_first_name +
                        " " +
                        userDetails?.user_last_name
                    )}
                  </Animated.Text>
                </Animated.View>
              )}
            </TouchableOpacity>
            <View style={reduxColors.profileDetails}>
              <View>
                {/* <TouchableOpacity
                  // onPress={() => {
                  //   navigation.navigate("UserDetails", {
                  //     user_id: userDetails.user_id,
                  //   });
                  // }}
                > */}
                <Text style={reduxColors.profileName}>
                  {userDetails.user_first_name} {userDetails.user_last_name}
                </Text>
                {/* </TouchableOpacity> */}
                <Text style={reduxColors.profileType}>
                  {capitalize(userDetails?.role_name ?? userDetails?.user_type)}
                </Text>
              </View>
              <View></View>
            </View>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: constThemeColor.background }}
        >
          <LinkTab
            tabIcon={
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            }
            tabText="My Profile"
            navigateIcon={
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            }
            onPress={() => {
              navigation.navigate("UserDetails", {
                user_id: userDetails.user_id,
              });
            }}
          />
          <LinkTab
            tabIcon={
              <MaterialCommunityIcons
                name="book-outline"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            }
            tabText="My Journal"
            navigateIcon={
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            }
            onPress={() => {
              navigation.navigate("MyJournal", {
                user_id: userDetails.user_id,
              });
            }}
          />
          {/* <LinkTab
            tabIcon={
              <AntDesign
                name="book"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            }
            tabText="My Journal"
            navigateIcon={
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            }
          /> */}
          <LinkTab
            tabIcon={
              <Ionicons
                name="settings-outline"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            }
            tabText="My Settings"
            navigateIcon={
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            }
            onPress={() =>
              navigation.navigate("Setings", {
                userDetails: userDetails,
              })
            }
          />
          {/* <LinkTab
            tabIcon={
              <AntDesign
                name="Trophy"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            }
            tabText="My Rewards"
            navigateIcon={
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            }
          /> */}
          <LinkTab
            tabIcon={
              <Ionicons
                name="log-out-outline"
                size={24}
                color={constThemeColor.onSurfaceVariant}
              />
            }
            tabText="Logout"
            onPress={() => gotoLogout()}
          />

          {/* <LinkTab
            tabIcon={
              <MaterialCommunityIcons
                name="lock-reset"
                size={24}
                color={constThemeColor.neutralPrimary}
              />
            }
            tabText="Reset Pasword"
            navigateIcon={
              <AntDesign
                name="right"
                size={30}
                color={constThemeColor.mediumGrey}
                onPress={() => {
                  navigation.navigate("UserPassword", {
                    userDetails: userDetails,
                  });
                }}
              />
            }
            onPress={() => {
              navigation.navigate("UserPassword", {
                userDetails: userDetails,
              });
            }}
          />
          <LinkTab
            tabIcon={
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color={constThemeColor.neutralPrimary}
              />
            }
            tabText="Change Passcode"
            navigateIcon={
              <AntDesign
                name="right"
                size={30}
                color={constThemeColor.mediumGrey}
                onPress={() => {
                  navigation.navigate("ResetPasscode");
                }}
              />
            }
            onPress={() => {
              navigation.navigate("ResetPasscode");
            }}
          />
          <LinkTab
            tabIcon={
              <FontAwesome
                name="sign-out"
                size={24}
                color={constThemeColor.neutralPrimary}
              />
            }
            tabText="Logout"
            navigateIcon={
              <AntDesign
                name="logout"
                size={30}
                color={constThemeColor.mediumGrey}
                onPress={() => gotoLogout()}
              />
            }
            onPress={() => gotoLogout()}
          /> */}
        </ScrollView>
      </View>
    </>
  );
}

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: Spacing.body,
      paddingTop: Spacing.minor,
    },
    usernameAndGreeting: {
      flexDirection: "row",
    },
    profileDetails: {
      marginVertical: Spacing.small,
    },

    profileName: {
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      textAlign: "center",
      color: reduxColors.onPrimary,
    },
    profileType: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      textAlign: "center",
      padding: Spacing.small,
      color: reduxColors.onPrimary,
    },
  });
