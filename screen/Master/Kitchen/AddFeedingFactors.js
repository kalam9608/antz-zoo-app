//Create by: Om Tripathi
//Create on :23/02/2023


import React, { useState } from 'react';
import CustomForm from '../../../components/CustomForm';
import InputBox from '../../../components/InputBox';

const AddDiagnosis = () => {
    const [factorName, setFactorName] = useState("")
    const [Details, setDetails] = useState("")

    return (
    
        <CustomForm header={true} title={"AddFeedingFactors"}>
        <InputBox
            inputLabel={'Factor Name'}
            placeholder={"Enter Factor Name"}
            onChange={(e) => setFactorName(e)}
        />
        <InputBox
            inputLabel={"Details"}
            placeholder={"Enter Details"}
            onChange={(e) => setDetails(e)}
        />
    </CustomForm>
    )
}
export default AddDiagnosis;