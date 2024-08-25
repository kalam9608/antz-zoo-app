/**
 * @React Imports
 */
import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  AppState,
  View,
  Text,
  Image,
  BackHandler,
} from "react-native";
// import Device from "react-native";
/**
 * @Expo Imports
 */
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import * as ScreenCapture from "expo-screen-capture";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
// import * as Sentry from "sentry-expo";
import * as Sentry from "@sentry/react-native";

/**
 * @Third Party Imports
 */
import NetInfo from "@react-native-community/netinfo";
import { Provider } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AlertNotificationRoot } from "react-native-alert-notification";

/**
 * @Redux Imports
 */
import { store } from "./redux/store";
import { setPassCode, setSignIn, setSignOut } from "./redux/AuthSlice";
import { setSites } from "./redux/SiteSlice";
import ErrorBoundary from "react-native-error-boundary";

/**
 * @Custom Imports
 */
import Navigation from "./navigation/Navigation";
import {
  clearAsyncData,
  getAsyncData,
  saveAsyncData,
} from "./utils/AsyncStorageHelper";
import AppInactiveChecker from "./components/InactiveChecker";

/**
 * @API Imports
 */
import { getRefreshToken } from "./services/AuthService";

/**
 * @Config Imports
 */
import Config from "./configs/Config";
import Colors from "./configs/Colors";
import FontSize from "./configs/FontSize";
import { ToastProvider } from "./configs/ToastConfig";

/**
 * @Utils Imports
 */
import { warningToast } from "./utils/Alert";
import {
  getDeviceData,
  getDeviceInformation,
  getDeviceToken,
} from "./utils/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setPharmacyData } from "./redux/PharmacyAccessSlice";

Text.defaultProps = {
  allowFontScaling: false,
};

/**
 *
 * Setting Up Notification Handler
 *
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      isReady: false,
      appState: AppState.currentState,
      location: {},
      permissionStatus: "",
      screenData: null,
      isExpoGo: false,
      // type:""
    };

    this.notificationListener = React.createRef();
    this.responseListener = React.createRef();
    this.backPressRef = React.createRef();
    this.navigationRef = React.createRef();
    this.state.isExpoGo = Constants.appOwnership === "expo";
  }

  async componentDidMount() {
    this.onStart();
    if (!this.state.isExpoGo) {
      import("@sentry/react-native").then((Sentry) => {
        Sentry.init({
          dsn: "https://9d18dc772eba71a4f587515f2b3810cb@o4504395006345216.ingest.sentry.io/4505719232593920",
          debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
          enableNative: true,
          enableCaptureFailedRequests: true,
          attachViewHierarchy: true,
        });
      });
    }
    // For get the AppState
    this.appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
        }
        this.setState({ appState: nextAppState });
      }
    );

    this.connectionSubscription = NetInfo.addEventListener(
      this.handleConnectionInfoChange
    );

    this.notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        //warningToast(notification);
      });

    // this notification listener when app is open
    Notifications.addNotificationResponseReceivedListener(async (response) => {
      if (response.notification.request.content.data) {
        if (response.notification.request.content.data.screenName) {
          let screenName =
            response.notification.request.content.data.screenName;
          let params = response.notification.request.content.data.params;

          this.navigationRef.current?.navigate(screenName, params);
        } else {
          if (response.notification.request.content.data.type) {
            let screen_type = response.notification.request.content.data.type;
            let id = response.notification.request.content.data.id ?? 0;

            switch (screen_type) {
              case "animal_movement":
                this.navigationRef.current?.navigate("ApprovalSummary", {
                  animal_movement_id: id,
                  screen: "home",
                });
            }
          }
        }
      }
    });

    // this listener when app is close / killed
    this.responseListener.current =
      Notifications.getLastNotificationResponseAsync().then(
        async (response) => {
          await AsyncStorage.setItem("isBackNotificationPressed", "true");
          if (response != null) {
            if (response.notification.request.content.data) {
              if (response.notification.request.content.data.screenName) {
                let screenName =
                  response.notification.request.content.data.screenName;
                let params = response.notification.request.content.data.params;
                await AsyncStorage.setItem(
                  "notificationPressedScreenName",
                  JSON.stringify(screenName)
                );
                await AsyncStorage.setItem(
                  "notificationPressedScreenParams",
                  JSON.stringify(params)
                );
                this.navigationRef.current?.navigate(screenName, params);
              } else {
                if (response.notification.request.content.data.type) {
                  let screen_type =
                    response.notification.request.content.data.type;
                  let id = response.notification.request.content.data.id ?? 0;

                  await AsyncStorage.setItem(
                    "notificationPressedScreenName",
                    "animal_movement"
                  );
                  switch (screen_type) {
                    case "animal_movement":
                      this.navigationRef.current?.navigate("ApprovalSummary", {
                        animal_movement_id: id,
                        screen: "home",
                      });
                  }
                }
              }
            }
          }
        }
      );

    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount = () => {
    this.appStateSubscription.remove();

    Notifications.removeNotificationSubscription(
      this.notificationListener.current
    );

    Notifications.removeNotificationSubscription(this.responseListener.current);
    this.connectionSubscription && this.connectionSubscription();
  };

  handleConnectionInfoChange = (state) => {
    this.setState({ isConnected: state.isConnected });
  };

  handleBackPress = () => {
    if (
      this.backPressRef.current &&
      this.backPressRef.current + 2000 >= Date.now()
    ) {
      BackHandler.exitApp();
      return true;
    }

    this.backPressRef.current = Date.now();
    return true;
  };

  onStart = async () => {
    // for stop screen capture
    if (Config.ENABLE_SCREEN_SHOT) {
      await ScreenCapture.preventScreenCaptureAsync();
    }
    try {
      let fontSources = {
        // InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
        InterBold: require("./assets/fonts/Inter-Bold.ttf"),
        InterLight: require("./assets/fonts/Inter-Light.ttf"),
        InterExtraLight: require("./assets/fonts/Inter-ExtraLight.ttf"),
        InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
        InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
        ...Ionicons.font,
      };
      const userData = await getAsyncData("@antz_user_data");

      if (userData) {
        Promise.all([Font.loadAsync(fontSources), getDeviceData()])
          .then((data) => {
            getRefreshToken({ device_details: data[1] }).then((response) => {
              if (response) {
                if (!response.success) {
                  warningToast("Oops!!", response.message);
                  clearAsyncData("@antz_user_device_token");
                  clearAsyncData("@antz_user_data");
                  clearAsyncData("@antz_user_token");
                  clearAsyncData("@antz_selected_site");
                  store.dispatch(setSignOut());
                  store.dispatch(setPassCode(null));
                } else {
                  if (response.login_count === "-1") {
                    clearAsyncData("@antz_user_device_token");
                    clearAsyncData("@antz_user_data");
                    clearAsyncData("@antz_user_token");
                    clearAsyncData("@antz_selected_site");
                    store.dispatch(setSignOut());
                    store.dispatch(setPassCode(null));
                    warningToast("Oops!!", "Need to Login again!!");
                  } else {
                    saveAsyncData(
                      "@antz_user_device_token",
                      data[1]?.device_token
                    );
                    saveAsyncData("@antz_user_token", response?.token);
                    saveAsyncData("@antz_max_upload_sizes", response?.settings);
                    store.dispatch(setSignIn(response ?? userData));
                    store.dispatch(setSites(response?.user?.zoos[0]?.sites));
                    store.dispatch(
                      setPharmacyData(response?.modules?.pharmacy_data)
                    );
                  }
                }
                this.setState({
                  isReady: true,
                });
              }
            });
          })
          .catch((error) => {
            this.setState({
              isReady: true,
            });
            console.log(error);
          });
      } else {
        Promise.all([Font.loadAsync(fontSources)]).finally(() => {
          this.setState({
            isReady: true,
          });
        });
      }
      // await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      warningToast(e);
      this.setState({
        isReady: true,
      });
    } finally {
    }
  };

  hideScreen = async () => {
    if (this.state.isReady) {
      await SplashScreen.hideAsync();
    }
  };

  handleInactiveTime = (data) => {
    // setInActive(data);
  };

  handleIdleState = (state) => {
    if ((state == "idle") & !Config.isDev) {
      store.dispatch(setPassCode(null));
    }
    // setIdleState(state);
  };

  handleBackgroundState = (state) => {
    // setBackgroundState(state);
  };

  render = () => {
    return (
      <ErrorBoundary>
        {this.state.isReady ? (
          <Provider store={store}>
            <ToastProvider>
              <AppInactiveChecker
                onTimer={this.handleInactiveTime}
                idleState={this.handleIdleState}
                backgroundState={this.handleBackgroundState}
              >
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <BottomSheetModalProvider>
                    <SafeAreaView style={styles.container}>
                      {this.state.isConnected ? (
                        <AlertNotificationRoot>
                          <Navigation navigationRef={this.navigationRef} />
                        </AlertNotificationRoot>
                      ) : (
                        <View style={styles.offlineView}>
                          <Ionicons
                            name="cloud-offline"
                            size={50}
                            color={Colors.tomato}
                          />
                          <Text style={styles.offlineText}>
                            You are offline
                          </Text>
                        </View>
                      )}
                    </SafeAreaView>
                  </BottomSheetModalProvider>
                </GestureHandlerRootView>
              </AppInactiveChecker>
            </ToastProvider>
          </Provider>
        ) : (
          <View style={styles.container}>
            <Image
              source={require("./assets/splash.png")}
              resizeMode="contain"
              style={[styles.image, { backgroundColor: "#1F415B" }]}
            />
          </View>
        )}
      </ErrorBoundary>
    );
  };
}

let appExport = App;

if (!(Constants.appOwnership === "expo")) {
  import("@sentry/react-native").then((Sentry) => {
    // appExport = Sentry.Native.wrap(App);
    appExport = Sentry.wrap(App);
  });
}
export default appExport;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  offlineView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.lightGrey,
  },
  offlineText: {
    fontSize: FontSize.Antz_Body_Regular.fontSize,
    color: Colors.textColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
