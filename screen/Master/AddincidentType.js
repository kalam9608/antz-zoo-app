//Create by:Wasim Akram


import React, { useState } from "react";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";

const AddincidentType = () => {
  const [incidentType,setIncidentType]=useState("")
  return (
    <CustomForm header={true} title={"Add Incident Type"}>
      <InputBox
        inputLabel={"Incident Type Name"}
        placeholder={"Enter Incident Type Name"}
        onChange={(e) => setIncidentType(e)}
        value={incidentType}
      />
    </CustomForm>
  )
};

export default AddincidentType;

