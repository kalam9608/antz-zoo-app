import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const themeColors = useSelector((state) => state.darkMode.theme.colors);
const reduxColors = Styles(themeColors);

export const Styles = (reduxColors) => StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: reduxColors?.onPrimary
    }
})