//Create by: Om Tripathi
//Create on :23/02/2023


import React, { useState } from 'react';
import CustomForm from '../../../components/CustomForm';
import InputBox from '../../../components/InputBox';

const AddDiagnosis = () => {
    const [diagnosis, setDiagnosis] = useState("")
    const [description, setDescription] = useState("")

    return (
        <CustomForm header={true} title={"AddDiagnosis"}>
            <InputBox
                inputLabel={'Diagnosis Name'}
                placeholder={"Enter Diagnosis Name"}
                onChange={(e) => setDiagnosis(e)}
            />
            <InputBox
                inputLabel={"Description"}
                placeholder={"Enter Description"}
                onChange={(e) => setDescription(e)}
            />
        </CustomForm>
    )
}
export default AddDiagnosis;