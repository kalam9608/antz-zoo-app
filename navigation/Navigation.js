import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import LoginStack from "./LoginStack";
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { useSelector } from "react-redux";
import AfterLoginNavigation from "./AfterLoginNavigation";

const Navigation = (props) => {
  const theme = useSelector((state) => state.darkMode.theme);
  const isLogin = useSelector((state) => state.UserAuth.userDetails);

  return (
    <>
      <PaperProvider theme={theme}>
        <NavigationContainer ref={props.navigationRef}>
          {isLogin === null ? <LoginStack /> : <AfterLoginNavigation />}
        </NavigationContainer>
      </PaperProvider>
    </>
  );
};

export default Navigation;
