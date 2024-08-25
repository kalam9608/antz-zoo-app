//Create by: Om Tripathi
//Create on :23/02/2023


import React, { useState } from 'react';
import CustomForm from '../../../components/CustomForm';
import InputBox from '../../../components/InputBox';

const AddDiagnosis = () => {
    const [name, setName] = useState("")

    return (
        <CustomForm header={true} title={"Add AffectedParts"}>
            <InputBox
                inputLabel={' Name '}
                placeholder={"Enter Name"}
                onChange={(e) => setName(e)}
            />

        </CustomForm>
    )
}
export default AddDiagnosis;