import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import FontSize from "../../../configs/FontSize";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const ChipGroup = ({accessFunction, access}) => {
    const navigation = useNavigation();
    const [isActive, setIsActive] = useState(access ?? "");

    const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    const styles = style(constThemeColor);

    const activeFunction = (data) => {
        setIsActive(data)
        accessFunction(data)
    }

    useEffect(() => {
        setIsActive(access)
    }, [access])
    
    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity style={isActive == "VIEW" || isActive == "ADD" || isActive == "EDIT" || isActive == "DELETE" ? styles.chip : styles.inActiveChip} onPress={() => activeFunction("VIEW")}>
                    <MaterialIcons name="visibility" size={25} color={isActive == "VIEW" || isActive == "ADD" || isActive == "EDIT" || isActive == "DELETE" ? constThemeColor.primary : constThemeColor.outline} />
                    <Text style={isActive == "VIEW" || isActive == "ADD" || isActive == "EDIT" || isActive == "DELETE" ? styles.chipText : styles.inactiveChipText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity style={isActive == "ADD" || isActive == "EDIT" || isActive == "DELETE" ? styles.chip : styles.inActiveChip} onPress={() => activeFunction("ADD")}>
                    <MaterialIcons name="add" size={25} color={isActive == "ADD" || isActive == "EDIT" || isActive == "DELETE" ? constThemeColor.primary : constThemeColor.outline} />
                    <Text style={isActive == "ADD" || isActive == "EDIT" || isActive == "DELETE" ? styles.chipText : styles.inactiveChipText}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={isActive == "EDIT" || isActive == "DELETE" ? styles.chip : styles.inActiveChip} onPress={() => activeFunction("EDIT")}>
                    <MaterialIcons name="edit" size={25} color={isActive == "EDIT" || isActive == "DELETE" ? constThemeColor.primary : constThemeColor.outline} />
                    <Text style={isActive == "EDIT" || isActive == "DELETE" ? styles.chipText : styles.inactiveChipText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={isActive == "DELETE" ? styles.chip : styles.inActiveChip} onPress={() => activeFunction("DELETE")}>
                    <MaterialIcons name="delete" size={25} color={isActive == "DELETE" ? constThemeColor.primary : constThemeColor.outline} />
                    <Text style={isActive == "DELETE" ? styles.chipText : styles.inactiveChipText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const style = (reduxColor) => StyleSheet.create({
    container:{
        backgroundColor: reduxColor?.background,
        borderRadius:4,
        padding:wp(5),
        flexDirection:'row',
        justifyContent:'space-between'
    },
    chip:{
        backgroundColor:reduxColor?.onPrimary,
        paddingVertical:wp(1),
        paddingHorizontal:wp(2),
        borderRadius:4,
        alignItems:'center',
        minWidth:wp(15),
        minHeight:hp(6),
        flexDirection:'column',
        justifyContent:'space-between'
    },
    inActiveChip:{
        backgroundColor:reduxColor?.background,
        paddingVertical:wp(1),
        paddingHorizontal:wp(2),
        borderRadius:4,
        alignItems:'center',
        minWidth:wp(15),
        minHeight:hp(6),
        flexDirection:'column',
        justifyContent:'space-between'
    },
    chipText:{
        fontSize:FontSize.Antz_Body_Regular.fontSize,
        fontWeight:FontSize.Antz_Body_Regular.fontWeight,
        color:reduxColor?.onSurface,
        lineHeight:16
    },
    inactiveChipText:{
        fontSize:FontSize.Antz_Body_Regular.fontSize,
        fontWeight:FontSize.Antz_Body_Regular.fontWeight,
        color:reduxColor?.onSurfaceVariant,
        lineHeight:16
    }
})

export default ChipGroup;