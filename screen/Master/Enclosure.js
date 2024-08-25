//create by:Gaurav Shukla
// create on :23/02/2023

import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";
import CustomForm from "../../components/CustomForm";
import Category from "../../components/DropDownBox";
import InputBox from "../../components/InputBox";


const items = [
    {
        id: 1,
        name: "Ondo",
    },
    {
        id: 2,
        name: "Ogun",
    },
    {
        id: 3,
        name: "Calabar",
    },
    {
        id: 4,
        name: "Lagos",
    },
    {
        id: 5,
        name: "Maiduguri",
    },
];


export default function Enclosure(props) {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(null);


    const catPressed = (item) => {
        setData(item.map(u => u.name).join(', '))
    };

    return (
        <CustomForm header={true} title={"Add Enclosure Type"}>
            <InputBox
                inputLabel={"Choose Section"}
                placeholder={"Choose Section"}
                editable={false}
                defaultValue={
                    data != null ? data : null
                }
                rightElement={
                    <AntDesign
                        onPress={() => setOpenDropdown(!openDropdown)}
                        name={openDropdown ? "up" : "down"}
                        size={24}
                        color="grey"
                    />
                }
            />
            <InputBox
                inputLabel={"Choose Enclosure"}
                placeholder={"Choose Enclosure"}
                editable={false}
                defaultValue={
                    data != null ? data : null
                }
                rightElement={
                    <AntDesign
                        onPress={() => setOpen(!open)}
                        name={open ? "up" : "down"}
                        size={24}
                        color="grey"
                    />
                }
            />
            {openDropdown ?
                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    <Category
                        categoryData={items}
                        onCatPress={catPressed}
                        heading={"Choose Section"}
                        userType={"admin"}
                        navigation={props.navigation}
                        permission={"Yes"}
                        screen={"AddCategory"}
                        isMulti={true}
                    />
                </View>
                : null}
            {open ?
                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    <Category
                        categoryData={items}
                        onCatPress={catPressed}
                        heading={"Choose Enclosure"}
                        userType={"admin"}
                        navigation={props.navigation}
                        permission={"Yes"}
                        screen={"AddCategory"}
                        isMulti={true}
                    />
                </View>
                : null}
        </CustomForm>
    )
};
