//create by:om Tripathi
// create on :23/02/2023

import React, { useState } from "react";
import { StyleSheet, View,Text} from "react-native";
import CustomForm from "../../../components/CustomForm";
import InputBox from "../../../components/InputBox";
import DatePicker from "./DatePicker2";
import FontSize from "../../../configs/FontSize";



const AddMealSlots = () => {
    const [MealSlotsName, setMealSlotsName] = useState("")

    return (

        <CustomForm header={true} title={"AddMealSlots"}>
            <InputBox
                inputLabel={'Name'}
                placeholder={"Enter Name"}
                onChange={(e) => setMealSlotsName(e)}
            />

            <View style={style.timePickerBox}>
                <Text style={{ fontSize: FontSize.Antz_Strong, top: 15 }}>Start Time</Text>
                <View style={style.timePicker}>
                    <DatePicker mode='time' />
                </View>
            </View>
            <View style={style.timePickerBox}>
                <Text style={{ fontSize: FontSize.Antz_Strong, top: 15 }}>End Time</Text>
                <View style={style.timePicker}>
                    <DatePicker mode='time' />
                </View>
            </View>

        </CustomForm>


    );
};

export default AddMealSlots;

const style = StyleSheet.create({

    timePickerBox: {
        borderBottomWidth: 0.5,
        borderBottomColor: "grey",
        marginTop: 15,
        // padding:2,
        //    backgroundColor:"green"     
    },
    timePicker: {
        bottom: "10%",
        width: "50%",
        marginHorizontal: "50%",
    },
})
