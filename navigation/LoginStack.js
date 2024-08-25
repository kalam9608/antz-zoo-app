import React from "react";
import {
	createStackNavigator,
	CardStyleInterpolators,
} from "@react-navigation/stack";
import LoginScreen from "../screen/LoginScreen/LoginScreen";
import UserPassword from "../screen/User/UserPassword";
import PassCode from "../screen/LoginScreen/PassCode";



const Stack = createStackNavigator();

const LoginStack = () => (
	<Stack.Navigator
		initialRouteName="Login"
		screenOptions={{
			headerShown: false,
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
		}}
	>
		{/* testing perpuse */}
				<Stack.Screen name="PassCode" component={PassCode} />

		<Stack.Screen name="Login" component={LoginScreen} />
		<Stack.Screen name="UserPassword" component={UserPassword} />

		
	</Stack.Navigator>
);

export default LoginStack;
