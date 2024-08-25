//Create by: Biswajit 


import { useState } from "react";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";


const AddTagGroup = () => {
    const[enclosureType,setEnclosureType]=useState("")
    return (
        <CustomForm header={true} title={"Add Tag Group"}>
            <InputBox
                inputLabel={"Enclosure Type"}
                placeholder={"Enter Enclosure Type"}
                onChange={(e) => setEnclosureType(e)}
                value={enclosureType}
            />
        </CustomForm>
    );
};


export default AddTagGroup;
