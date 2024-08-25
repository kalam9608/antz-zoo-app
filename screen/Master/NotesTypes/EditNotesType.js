import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import CustomFormWithoutKeyboardScroll from "../../../components/CustomFormWithoutKeyboardScroll";
import Loader from "../../../components/Loader";
import InputBox from "../../../components/InputBox";
import { useSelector } from "react-redux";
import { useToast } from "../../../configs/ToastConfig";
import {
  addNotesList,
  deleteNotesList,
  editNotesList,
} from "../../../services/ObservationService";

const EditNotesType = (props) => {
  const navigation = useNavigation();
  const [notesType, setNotesType] = useState(
    props.route.params?.item?.name ?? ""
  );
  const [notesTypeId] = useState(props.route.params?.item?.id ?? null);
  const [isChild] = useState(props.route.params?.is_child ?? false);
  const [loading, setLoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const { showToast } = useToast();

  const editNotesType = () => {
    setIsError({});
    setErrorMessage({});
    if (notesType.trim().length === 0) {
      setIsError({ notesType: true });
      setErrorMessage({ notesType: "Note type name is required" });
      return false;
    } else {
      setLoding(true);
      let obj = {
        observation_type_id: notesTypeId,
        type_name: notesType,
      };
      editNotesList(obj)
        .then((res) => {
          if (!res.success) {
            showToast("error", res?.message);
          } else {
            showToast("success", res?.message);
            if (isChild) {
              navigation.goBack();
            } else {
              navigation.pop(2);
            }
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

  const DeleteNotesType = () => {
    setLoding(true);
    let obj = {
      observation_type_id: notesTypeId,
    };
    deleteNotesList(obj)
      .then((res) => {
        if (!res.success) {
          showToast("error", res?.message);
        } else {
          showToast("success", res?.message);
          if (isChild) {
            navigation.goBack();
          } else {
            navigation.pop(2);
          }
        }
      })
      .catch((err) => {
        showToast("error", "Oops! Something went wrong!!");
      })
      .finally(() => {
        setLoding(false);
      });
  };

  return (
    <CustomFormWithoutKeyboardScroll
      header={true}
      title={isChild ? "Edit Sub-Note Type" : "Edit Note Type"}
      onPress={editNotesType}
      deleteButton={notesTypeId ? DeleteNotesType : undefined}
      deleteTitle={isChild ? "Sub-Note Type" : "Note Type"}
    >
      <Loader visible={loading} />
      <InputBox
        inputLabel={"Name"}
        placeholder={isChild ? "Enter Sub-Note Type" : "Enter Note Type"}
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

export default EditNotesType;
