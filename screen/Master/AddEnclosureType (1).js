//Create by:Nilesh kumar

import React, { useState } from 'react'
import CustomForm from "../../components/CustomForm";
import InputBox from '../../components/InputBox';

const AddEnclosureType = () => {
    const [enclosureType, setEnclosureType] = useState("")
    return (
        <CustomForm header={true} title={"Add Enclosure Type"}>
            <InputBox
                inputLabel={"Enclosure Type"}
                placeholder={"Enter Enclosure Type"}
                onChange={(e) => setEnclosureType(e)}
                value={enclosureType}
            />
        </CustomForm>
    )
};

export default AddEnclosureType