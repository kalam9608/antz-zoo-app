//Create by: Ramij Dafadar
//Create on :23/03/2023

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, BackHandler, Alert } from "react-native";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import DatePicker from "../../components/DatePicker";
import Category from "../../components/DropDownBox";
import { getSection } from "../../services/staffManagement/getEducationType";
import { Checkbox } from "react-native-paper";
import CheckBox from "../../components/CheckBox";
import { useSelector } from "react-redux";
import {
  createFeedLog,
  getFeedBy,
  getFeedUOM,
} from "../../services/FeedService";
import moment from "moment";
import { errorToast } from "../../utils/Alert";
import FontSize from "../../configs/FontSize";

const AddFeedLog = (props) => {
  const navigation = useNavigation();

  const [foodProvided, setFoodProvided] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [quantity, setQuantity] = useState("");
  const [consumed, SetConsumed] = useState("");
  const [left, setLeft] = useState("");
  const [quantityUOM, setQuantityUOM] = useState("");
  const [uomId, setId] = useState("");
  const [FeedById, setFeedById] = useState("");
  const [feedingMethod, setFeedingMethod] = useState("");
  const [fedBy, setFedBy] = useState("");
  const [occupents, setOccupent] = useState(false);
  const [details, setDetails] = useState("");

  const [quantity_UOM_DropDown, setQuantity_UOM_DropDown] = useState("");
  const [quantity_UOM_Data, setQuantity_UOM_Data] = useState([]);

  const [feedingMethod_Dropdown, setFeedingMethod_Dropdown] = useState("");
  const [feedingMethod_Data, setFeedingMethod_Data] = useState([]);

  const [fedByDropDown, setFedByDropDown] = useState("");
  const [fedBy_Data, setFedBy_Data] = useState([]);

  const [isLoading, setLoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isError, setIsError] = useState({});
  const zooID = useSelector((state) => state.UserAuth.zoo_id);

  useEffect(() => {
    Promise.all([getFeedBy(), getFeedUOM()]).then((res) => {
      let getdata = res[1].data.map((item) => {
        return {
          id: item._id,
          name: item.name,
        };
      });
      setQuantity_UOM_Data(getdata);
      setFeedingMethod_Data(getdata);
      setFedBy_Data(res[0].data);
    });
  }, []);

  const catPressed = (item) => {
    setQuantityUOM(item.map((u) => u.name).join(", "));
    setId(item.map((id) => id.id).join(","));
    setQuantity_UOM_DropDown(!quantity_UOM_DropDown);
  };

  const MethodPressed = (item) => {
    setFeedingMethod(item.map((u) => u.name).join(", "));
    // setId(item.map((id) => id.id).join(','));
    setFeedingMethod_Dropdown(!feedingMethod_Dropdown);
  };

  const FedPressed = (item) => {
    setFedBy(item.map((u) => u.name).join(", "));
    setFeedById(item.map((id) => id.id).join(","));
    setFedByDropDown(!fedByDropDown);
  };

  const SetDropDown = () => {
    setQuantity_UOM_DropDown(!quantity_UOM_DropDown);
    setFeedingMethod_Dropdown(false);
    setFedByDropDown(false);
  };

  const SetMethodDropDown = () => {
    setFeedingMethod_Dropdown(!feedingMethod_Dropdown);
    setQuantity_UOM_DropDown(false);
    setFedByDropDown(false);
  };

  const SetFedDropDown = () => {
    setFedByDropDown(!fedByDropDown);
    setQuantity_UOM_DropDown(false);
    setFeedingMethod_Dropdown(false);
  };

  const onSubmit = () => {
    setIsError({});
    setErrorMessage({});
    if (foodProvided.trim().length === 0) {
      setIsError({ foodProvided: true });
      setErrorMessage({ foodProvided: "This field is required!!" });
      return false;
    } else if (quantity.trim().length === 0) {
      setIsError({ quantity: true });
      setErrorMessage({
        quantity: "This field is required!!",
      });
      return false;
    } else if (consumed.trim().length === 0) {
      setIsError({ consumed: true });
      setErrorMessage({ consumed: "This field is required!!" });
      return false;
    } else if (left.trim().length === 0) {
      setIsError({ left: true });
      setErrorMessage({ left: "This field is required!!" });
      return false;
    } else if (quantityUOM.trim().length === 0) {
      setIsError({ quantityUOM: true });
      setErrorMessage({ quantityUOM: "This field is required!!" });
      return false;
    } else if (feedingMethod.trim().length === 0) {
      setIsError({ feedingMethod: true });
      setErrorMessage({ feedingMethod: "This field is required!!" });
      return false;
    } else if (fedBy.trim().length === 0) {
      setIsError({ fedBy: true });
      setErrorMessage({ fedBy: "This field is required!!" });
      return false;
    } else if (details.trim().length === 0) {
      setIsError({ details: true });
      setErrorMessage({ details: "This field is required!!" });
      return false;
    } else {
      // setLoding(true);
      let obj = {
        feed_date: moment(date).format("YYYY-MM-DD"),
        feed_time: moment(time).format("HH:mm"),
        feed_quantity: quantity,
        feed_consumed_qty: consumed,
        feed_left_qty: left,
        feeding_method: feedingMethod,
        feed_uom_type: uomId,
        fed_by: FeedById,
      };
      createFeedLog(obj)
        .then((res) => {
          setLoding(false);
          alert(res.message);
          navigation.goBack();
        })
        .catch((err) => {
          setLoding(false);
          errorToast("Oops!", "Something went wrong!!");
        });
    }
  };

  const onOccupent = () => {
    setOccupent(!occupents);
  };

  useEffect(() => {
    $postData = {
      zoo_id: zooID,
    };
    getSection($postData).then((res) => {
      let getdata = res.map((item) => {
        return {
          id: item.section_id,
          name: item.section_name,
        };
      });
      setQuantity_UOM_Data(getdata);
      setFeedingMethod_Data(getdata);
      setFedBy_Data(getdata);
    });
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel", onPress: () => {} },
          { text: "OK", onPress: () => navigation.goBack() },
        ],
        { cancelable: false }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <>
      <Loader loaderSize="lg" visible={isLoading} />
      <CustomForm header={true} title={"Add Feed Log"} onPress={onSubmit}>
        <InputBox
          inputLabel={"Food provided"}
          placeholder={"Food provided"}
          keyboardType={"default"}
          onChange={(e) => setFoodProvided(e)}
          value={foodProvided}
          errors={errorMessage.foodProvided}
          isError={isError.foodProvided}
        />
        <DatePicker
          today={date}
          onChange={(item) => {
            let today = item.toJSON().slice(0, 10);
            setDate(today);
          }}
          mode="date"
          title="Feeding Date"
        />
        <DatePicker
          today={time}
          onChange={(item) => {
            let today = item.toJSON().slice(0, 10);
            setTime(today);
          }}
          mode="time"
          title="Feeding Time"
        />
        <InputBox
          inputLabel={"Quantity"}
          placeholder={"Quantity"}
          keyboardType={"numeric"}
          onChange={(value) => setQuantity(value)}
          value={quantity}
          maxLength={4}
          errors={errorMessage.quantity}
          isError={isError.quantity}
        />
        <InputBox
          inputLabel={"Consumed"}
          placeholder={"Consumed"}
          onChange={(value) => SetConsumed(value)}
          value={consumed}
          errors={errorMessage.consumed}
          isError={isError.consumed}
        />
        <InputBox
          inputLabel={"Left"}
          onChange={(value) => setLeft(value)}
          value={left}
          placeholder={"Left"}
          errors={errorMessage.left}
          isError={isError.left}
        />

        <View>
          <InputBox
            editable={false}
            inputLabel="Quantity UOM"
            value={quantityUOM}
            placeholder="Select UOM"
            rightElement={quantity_UOM_DropDown ? "menu-up" : "menu-down"}
            DropDown={SetDropDown}
            errors={errorMessage.quantityUOM}
            isError={isError.quantityUOM}
          />
        </View>

        <View>
          <InputBox
            editable={false}
            inputLabel="Feeding method"
            value={feedingMethod}
            placeholder="Select Feeding method"
            rightElement={feedingMethod_Dropdown ? "menu-up" : "menu-down"}
            DropDown={SetMethodDropDown}
            errors={errorMessage.feedingMethod}
            isError={isError.feedingMethod}
          />
        </View>

        <View>
          <InputBox
            editable={false}
            inputLabel="Fed by"
            value={fedBy}
            placeholder="Select Fed by"
            rightElement={fedByDropDown ? "menu-up" : "menu-down"}
            DropDown={SetFedDropDown}
            errors={errorMessage.fedBy}
            isError={isError.fedBy}
          />
        </View>

        <View style={{}}>
          {/* <Checkbox
                    status={occupents ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setOccupent(!occupents);
                    }}
                />
                <Text style={{fontWeight:'600', color:'#2d2d2d'}}>Apply to all enclosures occupents?</Text> */}
          <CheckBox
            title={"Apply to all enclosures occupents?"}
            onPress={onOccupent}
            checked={occupents}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <InputBox
            inputLabel={"Details"}
            keyboardType={"default"}
            onChange={(value) => setDetails(value)}
            maxLength={3}
            value={details}
            placeholder={"Details"}
            errors={errorMessage.details}
            isError={isError.details}
            multiline={true}
          />
        </View>
      </CustomForm>
      {quantity_UOM_DropDown ? (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <Category
            categoryData={quantity_UOM_Data}
            onCatPress={catPressed}
            heading={"Choose quantity UOM"}
            isMulti={false}
            onClose={SetDropDown}
          />
        </View>
      ) : null}

      {feedingMethod_Dropdown ? (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <Category
            categoryData={feedingMethod_Data}
            onCatPress={MethodPressed}
            heading={"Choose feeding"}
            isMulti={false}
            onClose={SetMethodDropDown}
          />
        </View>
      ) : null}

      {fedByDropDown ? (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <Category
            categoryData={fedBy_Data}
            onCatPress={FedPressed}
            heading={"Choose fed"}
            isMulti={false}
            onClose={SetFedDropDown}
          />
        </View>
      ) : null}
    </>
  );
};

const Styles = StyleSheet.create({
});
export default AddFeedLog;
