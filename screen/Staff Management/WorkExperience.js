//Create by: Gaurav Shukla
//Create on :21/02/2023
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import CustomForm from '../../components/CustomForm';
import InputBox from '../../components/InputBox';
import Loader from '../../components/Loader';
import { useToast } from '../../configs/ToastConfig';
const WorkExperience = () => {
  const navigation=useNavigation()
  const [workExperience, setWorkExperience] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [instituteLocation, setInstituteLocation] = useState("");
  const [course, SetCourse] = useState("");
  const [marks, setMarks] = useState("");
  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoding] = useState(false)
  const { successToast, errorToast, } = useToast();
  const validation = () => {
    if (workExperience.trim().length === 0) {
      setIsError({ workExperience: true })
      setErrorMessage({ workExperience: "Enter The  workExperience" })
      return false;
    } else if (instituteName.trim().length === 0) {
      setIsError({ instituteName: true })
      setErrorMessage({ instituteName: "Enter The InstituteName" })
      return false;
    } else if (instituteLocation.trim().length === 0) {
      setIsError({ instituteLocation: true })
      setErrorMessage({ instituteLocation: "Enter The InstituteLocation" })
      return false;
    }
    else if (course.trim().length === 0) {
      setIsError({ course: true })
      setErrorMessage({ course: "Enter The Course" })
      return false;
    }
    else if (marks.trim().length === 0) {
      setIsError({ marks: true })
      setErrorMessage({ marks: "Enter The Marks" })
      return false;
    }
    return true;
  };

 const getdata=()=>{
  setLoding(true);
        if(validation()){
          let obj=
          {
            workExperience:workExperience,
            instituteName:instituteName,
            instituteLocation:instituteLocation,
            course:course,
            marks:marks
          }
          if (obj) {
              navigation.goBack();
          } else {
              errorToast("error","Something went wrong");
          }
        }
 }

  return (
    <>
      {loading ? <Loader /> : <CustomForm header={true} title={"Work Experience"} onPress={getdata}>
        <InputBox
          inputLabel={"Total Work Experience"}
          placeholder={"Enter Work Experience"}
          onChange={(e) => setWorkExperience(e)}
          value={workExperience}
          errors={errorMessage.workExperience}
          isError={isError.workExperience}
        />
        <InputBox
          inputLabel={"Instiution Name"}
          placeholder={"Enter Instiution Name"}
          onChange={(e) => setInstituteName(e)}
          value={instituteName}
          errors={errorMessage.instituteName}
          isError={isError.instituteName}
        />
        <InputBox
          inputLabel={"Instiution loaction"}
          placeholder={"Instiution location"}
          onChange={(value) => setInstituteLocation(value)}
          value={instituteLocation}
          errors={errorMessage.instituteLocation}
          isError={isError.instituteLocation}
        />
        <InputBox
          inputLabel={"Course"}
          placeholder={"Enter Course Name"}
          onChange={(value) => SetCourse(value)}
          value={course}
          errors={errorMessage.course}
          isError={isError.course}
        />
        <InputBox
          inputLabel={"Marks (%)"}
          placeholder={"Marks in %"}
          onChange={(value) => setMarks(value)}
          value={marks}
          errors={errorMessage.marks}
          isError={isError.marks}
        />
      </CustomForm>}
    </>
  )
}
export default WorkExperience;
