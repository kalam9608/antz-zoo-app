//create by:Gaurav Shukla
// create on :23/02/2023

import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import CustomForm from "../../components/CustomForm";
import Category from "../../components/DropDownBox";
import InputBox from "../../components/InputBox";
import FontSize from "../../configs/FontSize";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

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



export default function Section(props) {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [data, setData] = useState(null);


    const catPressed = (item) => {
        setData(item.map(u => u.name).join(', '))
    };

    return (
        <CustomForm header={true} title={"Add Section Type"}>
            <InputBox
                inputLabel={"Choose Section"}
                placeholder={"Choose Section Type"}
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

        </CustomForm>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: windowWidth,
        height: windowHeight,
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        // marginTop: 90,
        // justifyContent: "center",
    },
    Label: {
        top: "3%",
    },
    inputContainer: {
        flex: 1,
        width: "89%"
    },
    inputFlieds: {
        fontSize: FontSize.Antz_Subtext_title.fontSize,
        fontWeight: FontSize.Antz_Subtext_title.fontWeight,
        color: "black",
        borderBottomWidth: 1,
        borderColor: "grey",
    },
    iconBox: {
        width: "50%",
        bottom: 30,
        marginHorizontal: "90%",
    },
});
{/* <View style={styles.mainContainer}>
        //     <Header/>
        //     <View style={styles.inputContainer}>
        //         <FormControl >
        //             <FormControl.Label _text={{ fontWeight: '400', fontSize: 15 }} style={styles.Label}>Choose Section</FormControl.Label> */}
        //             {/* <View style={{flexDirection : 'row'}}> */}
        //             <Input
        //                 variant="underlined"
        //                 placeholder="Choose Section"
        //                 editable={false}
        //                 style={styles.inputFlieds}
        //                 _focus={{ borderColor: '#2B3990', borderBottomWidth: 3 }}
        //                 defaultValue={
        //                     data != null ? data : null
        //                 }
        //             />
        //             <View style={styles.iconBox}>
        //                 <AntDesign
        //                     onPress={() => setOpenDropdown(!openDropdown)}
        //                     name={openDropdown ? "up" : "down"}
        //                     size={24}
        //                     color="grey"
        //                 />
        //             </View>
        //         </FormControl>
        //     </View>
        //     {openDropdown ?
        //         <View style={{ flex: 1, backgroundColor: "#fff" }}>
        //             <Category
        //                 categoryData={items}
        //                 onCatPress={catPressed}
        //                 heading={"Choose Section"}
        //                 userType={"admin"}
        //                 navigation={props.navigation}
        //                 permission={"Yes"}
        //                 screen={"AddCategory"}
        //                 isMulti={true}
        //             />
        //         </View>
        //         : null}
        // </View>