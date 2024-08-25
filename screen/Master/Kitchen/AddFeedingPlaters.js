//Create by: Om Tripathi
//Create on :23/02/2023

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomForm from "../../../components/CustomForm";
import InputBox from "../../../components/InputBox";
import FontSize from "../../../configs/FontSize";


const AddFeedingPlaters = () => {
    const [platersName, setPlatersName] = useState("")

    const chooseIcon = () => {
        ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
            if (status.granted) {
                let optins = {
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.5,
                };

                ImagePicker.launchImageLibraryAsync(optins).then((result) => {
                    if (!result.canceled) {
                        setChooseIcon({
                            imageURI: result.uri,
                            imageData: getFileData(result),
                            imageValidationFailed: false,
                        });
                    }
                });
            } else {
                alert("Please allow permission to choose an icon");
            }
        });
    };

    return (
        <CustomForm header={true} title={"AddFeedingPlaters"}>
            <InputBox
                inputLabel={'Platers Name'}
                placeholder={"Enter Platers Name"}
                onChange={(e) => setPlatersName(e)}
            />
            <View style={style.fieldBox}>
                <Text style={style.iconLabel}>Icon</Text>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={chooseIcon}
                >
                    {typeof iconURI !== "undefined" ? (
                        <Image
                            source={{ uri: iconURI }}
                        />
                    ) : (
                        <Ionicons name="image" size={35} />
                    )}
                </TouchableOpacity>
            </View>
        </CustomForm>

    )
};

export default AddFeedingPlaters;

const style = StyleSheet.create({
    fieldBox: {
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        flexDirection: "row",
        padding: 5,
        marginTop: 15,
        borderRadius: 3,
        borderColor: "gray",
        borderBottomWidth: 1,
        backgroundColor: "#fff",
        height: "auto",
        justifyContent: "space-between",

    },
    iconLabel: {
        color: "black",
        // lineHeight: 40,
        fontSize: FontSize.Antz_Minor_Medium.fontSize,
        // paddingLeft: 4,
        height: "auto",
        paddingVertical: 10,

    },
})
