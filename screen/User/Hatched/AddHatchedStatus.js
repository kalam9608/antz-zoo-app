import { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import CustomForm from "../../../components/CustomForm";
import InputBox from "../../../components/InputBox";
import { addHatchedStatus } from "../../../services/HatchService";
import NewDropdown from "../../../components/Dropdown";
import Loader from "../../../components/Loader";
import { useToast } from "../../../configs/ToastConfig";

const HatchedTypeItem = [
  {
    category_id: 1,
    category_name: "Hatched Type",
    category_type: 1,
    isExpanded: true,
    subcategory: [
      {
        id: 0,
        val: "No",
      },
      {
        id: 1,
        val: "Yes",
      },
    ],
  },
];

const AddHatchedStatus = ({ navigation }) => {
  const [hatchedType, setHatchedType] = useState("");
  const [hatchedTypeError, setHatchedTypeError] = useState(false);

  const [hatchedKey, setHatchedKey] = useState("");
  const [hatchedKeyError, setHatchedKeyError] = useState(false);

  const [hatchedComment, setHatchedComment] = useState("");
  const [hatchedCommentError, setHatchedCommentError] = useState(false);
  const [loading, setLoding] = useState(false);
  const { successToast, errorToast, } = useToast();
  let hatchedData = {
    hatched_type: hatchedType,
    hatched_key: hatchedKey,
    comment: hatchedComment,
  };

  const onSubmit = () => {
    if (hatchedType === "") {
      setHatchedTypeError(true);
    } else {
      setHatchedTypeError(false);
    }

    if (hatchedKey === "") {
      setHatchedKeyError(true);
    } else {
      setHatchedKeyError(false);
    }

    if (hatchedComment === "") {
      setHatchedCommentError(true);
    } else {
      setHatchedCommentError(false);
    }
    if (
      hatchedTypeError === false &&
      hatchedCommentError === false &&
      hatchedCommentError === false
    ) {
      setLoding(true);
      addHatchedStatus(hatchedData)
        .then((response) => {})
        .finally(() => {
          setLoding(false);
          navigation.navigate("ListAllHatchedStatus");
          successToast("success","EnclosureForm Added Successfully");
        })
        .catch((error) => errorToast("error","Oops! Something went wrong!!"));
    }
  };

  const getHatchedTypeData = (item) => {
    const hatchedTypeData = item.id;
    setHatchedType(hatchedTypeData);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <CustomForm
          header={true}
          title={"Add Hatched Status"}
          onPress={onSubmit}
        >
          <View>
            <NewDropdown
              title="Hatched Type"
              data={HatchedTypeItem}
              afterPressDropdown={getHatchedTypeData}
            />
          </View>
          <View>
            <InputBox
              inputLabel="Enter Hatched Key"
              placeholder="Enter Hatched Key"
              value={hatchedKey}
              onChange={(value) => setHatchedKey(value)}
            />
            {hatchedKeyError ? (
              <Text style={styles.errorMessage}>Must place a key</Text>
            ) : null}
          </View>
          <View>
            <InputBox
              inputLabel="Enter Hatched Comment"
              placeholder="Enter Hatched Comment"
              value={hatchedComment}
              onChange={(value) => setHatchedComment(value)}
            />
            {hatchedCommentError ? (
              <Text style={styles.errorMessage}>Must place a comment</Text>
            ) : null}
          </View>
        </CustomForm>
      )}
    </>
  );
};

const styles = StyleSheet.create({

  errorMessage: {
    color: "red",
  },
});

export default AddHatchedStatus;

{
  /* <FormControl>
<FormControl.Label style={styles.label}>Hatched Type</FormControl.Label>
<Select
  style={styles.select}
  placeholder="Choose Hatched Type"
  selectedValue={hatchedType}
  onValueChange={(value) => setHatchedType(value)}
>
  <Select.Item label="Yes" value="1" />
  <Select.Item label="No" value="2" />
</Select>
{
  hatchedTypeError
    ? <Text style={styles.errorMessage}>Must choose a type</Text>
    : null
}
</FormControl> */
}
