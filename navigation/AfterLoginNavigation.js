import MainStackNavigation from "./StackNavigation";
import { useSelector } from "react-redux";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import PasscodeAuth from "../screen/LoginScreen/PasscodeAuth";
import PassCode from "../screen/LoginScreen/PassCode";

const Stack = createStackNavigator();

const AfterLoginNavigation = () => {
  const isLogin = useSelector((state) => state.UserAuth.passcode);
  return (
    <>
      {isLogin === null ? (
        <Stack.Navigator
          initialRouteName="PasscodeAuth"
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <Stack.Screen name="PasscodeAuth" component={PassCode} />
        </Stack.Navigator>
      ) : (
        <MainStackNavigation />
      )}
    </>
  );
};

export default AfterLoginNavigation;
