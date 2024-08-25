import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import CustomFormWithoutKeyboardScroll from "../../../components/CustomFormWithoutKeyboardScroll";
import Loader from "../../../components/Loader";
import InputBox from "../../../components/InputBox";
import { useSelector } from "react-redux";
import { useToast } from "../../../configs/ToastConfig";
import { addNotesList } from "../../../services/ObservationService";

const AddNotesType = (props) => {
  const navigation = useNavigation();
  const [notesType, setNotesType] = useState("");
  const [parentNoteId] = useState(props.route.params?.parent_id ?? null);
  const [parentNoteName] = useState(props.route.params?.parent_name ?? null);
  const [loading, setLoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const [description, setDescription] = useState("");
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { showToast } = useToast();

  const saveNotesType = () => {
    setIsError({});
    setErrorMessage({});
    if (notesType.trim().length === 0) {
      setIsError({ notesType: true });
      setErrorMessage({ notesType: "Note type name is required" });
      return false;
    } else {
      setLoding(true);
      let obj = {
        type_name: notesType,
      };
      if (parentNoteId) {
        obj.parent_id = parentNoteId;
      }
      addNotesList(obj)
        .then((res) => {
          if (!res.success) {
            showToast("error", res?.message);
          } else {
            showToast("success", res?.message);
            navigation.goBack();
          }
        })
        .catch((err) => {
          showToast("error", "Something Went Wrong");
          setLoding(false);
        })
        .finally(() => {
          setLoding(false);
        });
    }
  };

  return (
    <CustomFormWithoutKeyboardScroll
      header={true}
      title={
        parentNoteName
          ? "Add Sub-Note Type of " + parentNoteName
          : "Add Note Type"
      }
      onPress={saveNotesType}
    >
      <Loader visible={loading} />
      <InputBox
        inputLabel={"Name"}
        placeholder={
          parentNoteName
            ? "Enter Sub-Note Type of " + parentNoteName
            : "Enter Note Type"
        }
        onChange={(val) => setNotesType(val)}
        value={notesType}
        errors={errorMessage.notesType}
        isError={!notesType ? isError.notesType : false}
        keybordType={"default"}
        autoFocus={false}
      />
    </CustomFormWithoutKeyboardScroll>
  );
};

export default AddNotesType;
