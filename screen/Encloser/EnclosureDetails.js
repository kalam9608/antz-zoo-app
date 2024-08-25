/**
 * Modified By: Arnab
 * ON: 24.05.2023
 * work : added focus listner & refactor code
 *
 */

/**
 * React Import
 */
import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
/**
 * Custom Component Import
 */
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import ListEmpty from "../../components/ListEmpty";
/**
 * Third Party Import
 */
import { useDispatch, useSelector } from "react-redux";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
/**
 * API Import
 */
import { GetDetailesEnclosure } from "../../services/FormEnclosureServices";
/**
 * Custom Function Import
 */
import { ifEmptyValue } from "../../utils/Utils";
import FontSize from "../../configs/FontSize";
import { removeAnimalMovementData } from "../../redux/AnimalMovementSlice";
import { errorToast } from "../../utils/Alert";
import { useToast } from "../../configs/ToastConfig";

const { width, height } = Dimensions.get("window");
const moreOptionData = [
  { id: 1, option: "Edit Enclosure", screen: "EnclosureEdit" },
  { id: 3, option: "Animal Movement", screen: "AnimalMovement" },
  { id: 4, option: "Animal in Enclosure", screen: "AnimalEnclosure" },
  { id: 5, option: "Add Animal", screen: "AnimalAddDynamicForm" },
];

const EnclosureDetails = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoding] = useState(false);
  const [enclosuredata, setEnclosureData] = useState(null);
  const [sectionMessage, setSectionMessage] = useState("");
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const dispatch = useDispatch();
const {showToast} = useToast()
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      let { enclosure_id } = route.params;
      setLoding(true);
      GetDetailesEnclosure(enclosure_id)
        .then((res) => {
          setEnclosureData(res.data[0]);
          setSectionMessage(res.message);
        })
        .finally(() => {
          setLoding(false);
        })
        .catch((err) => {
          // errorToast("Oops!", "Something went wrong!!");
          showToast('error',"Oops! Something went wrong!!")
        });
    });
    return unsubscribe;
  }, [navigation]);

  const chooseOption = (item) => {
    if (enclosuredata) {
      dispatch(removeAnimalMovementData());
      navigation.navigate(item.screen, { item: enclosuredata });
    }
  };
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <>
      <Header
        title="Enclosure Details"
        noIcon={true}
        optionData={moreOptionData}
        optionPress={chooseOption}
      />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        {enclosuredata ? (
          <View>
            <Loader visible={loading} />
            <View style={[reduxColors.innerContainer]}>
              <View style={reduxColors.row}>
                <Text style={{ marginHorizontal: 5 }}>Id:</Text>
                <Text>{`#${ifEmptyValue(enclosuredata.enclosure_id)}`}</Text>
              </View>
              <View style={reduxColors.row}>
                <Text style={{ marginHorizontal: 5 }}>Name:</Text>
                <Text
                  style={{ width: widthPercentageToDP(40), textAlign: "right" }}
                >
                  {ifEmptyValue(enclosuredata.user_enclosure_name)}
                </Text>
              </View>
              <View style={reduxColors.row}>
                <Text style={{ marginHorizontal: 5 }}>Code:</Text>
                <Text>{ifEmptyValue(enclosuredata.enclosure_code)}</Text>
              </View>
              <View style={[reduxColors.row]}>
                <Text style={{ marginHorizontal: 5 }}>Description:</Text>
                <Text
                  style={{ width: widthPercentageToDP(40), textAlign: "right" }}
                >
                  {ifEmptyValue(enclosuredata.enclosure_desc)}
                </Text>
              </View>
              <View style={reduxColors.row}>
                <Text style={{ marginHorizontal: 5 }}>Environment:</Text>
                <Text>{ifEmptyValue(enclosuredata.enclosure_environment)}</Text>
              </View>
              <View style={reduxColors.row}>
                <Text style={{ marginHorizontal: 5 }}>Sunlight:</Text>
                <Text>{ifEmptyValue(enclosuredata.enclosure_sunlight)}</Text>
              </View>
            </View>
          </View>
        ) : (
          <ListEmpty visible={loading} label={sectionMessage} />
        )}
      </View>
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
      alignItems: "center",
    },

    innerContainer: {
      backgroundColor: reduxColors.lightGrey,
      alignItems: "center",
      padding: 8,
      marginVertical: 20,
      marginHorizontal: "10%",
      width: width * 0.9,
      height: height * 0.5,
      justifyContent: "space-evenly",
      borderRadius: 12,
    },
    row: {
      flexDirection: "row",
      width: width * 0.8,
      justifyContent: "space-between",
    },
    buttonContainer: {
      width: "100%",
      padding: 10,
      paddingHorizontal: 30,
      borderBottomWidth: 1,
      borderBottomColor: reduxColors.neutralSecondary,
      marginTop: 10,
      height: 40,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    buttonText: {
      fontSize: FontSize.Antz_Minor,
    },
  });

export default EnclosureDetails;
