import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useSelector } from "react-redux";

const StarredMessage = () => {
    const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    const styles = style(constThemeColor);
    return (
        <View style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
            <Text>Starred message</Text>
        </View>
    )
}

const style = (reduxColors) => StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: reduxColors?.background,
    }
})

export default StarredMessage;