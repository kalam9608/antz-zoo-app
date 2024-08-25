/**
 * @React Imports
 */
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
/**
 * @Redux Imports
 */
import { setAnimal as setTransferAnimal } from "../redux/AnimalTransferSlice";
import { setMedicalAnimal } from "../redux/MedicalSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setAnimal,
  setFatherAnimal,
  setMotherAnimal,
} from "../redux/AnimalMovementSlice";
/**
 * @Component Imports
 */
import CommonAnimalSelectComponent from "./CommonAnimalSelectComponent";
import Footermedical from "./Footermedical";

/**
 * @Third Party Imports
 */
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
/**
 * @Config Imports
 */
import Colors from "../configs/Colors";

const CommonAnimalSelect = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [screenName] = useState(props.route.params.screenName);
  const [type, settype] = useState(props.route?.params?.type ?? "");
  const [limit, setlimit] = useState(props.route?.params?.limit ?? 1);

  const [sectionType, setSectionType] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [selectEnclosure, setSelectEnclosure] = useState("");
  const [selectEnclosureId, setSelectEnclosureId] = useState("");

  const [selectedAnimalName, setSelectedAnimalName] = useState("");

  const [selectedAnimal, setSelectedAnimal] = useState([]);
  const [animalTest, setAnimalTest] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const navigatePreviousScreen = () => {
    dispatch(setMedicalAnimal(selectedAnimal));
    navigation.navigate("CaseType");
  };
  const navigateNextScreen = () => {
    dispatch(setMedicalAnimal(selectedAnimal));
    navigation.navigate("Complaints");
  };

  const goback = () => {
    if (screenName === "Medical") {
      dispatch(setMedicalAnimal(selectedAnimal));
      navigation.navigate("AddMedical");
    } else if (screenName === "TransferAnimal") {
      selectedAnimal.user_enclosure_name = selectEnclosure;
      dispatch(setTransferAnimal(selectedAnimal));
      navigation.goBack();
    } else if (screenName === "MoveAnimal") {
      // animalData.forEach((v) => (v.user_enclosure_name = selectEnclosure));
      // selectedAnimal.user_enclosure_name = selectEnclosure;
      dispatch(setAnimal(animalTest));
      navigation.goBack();
    } else if (screenName === "Observation") {
      // selectedAnimal.user_enclosure_name = selectEnclosure;
      // dispatch(setAnimal(selectedAnimal));
      navigation.navigate("Observation", {
        sectionType: sectionType ?? null,
        sectionId: sectionId ?? null,
        selectEnclosure: selectEnclosure ?? null,
        selectEnclosureId: selectEnclosureId ?? null,
        selectedAnimal: selectedAnimal ?? null,
        edit: true,
      });
    } else if (screenName === "EditObservation") {
      navigation.navigate("EditObservation", {
        sectionType: sectionType ?? null,
        sectionId: sectionId ?? null,
        selectEnclosure: selectEnclosure ?? null,
        selectEnclosureId: selectEnclosureId ?? null,
        selectedAnimal: selectedAnimal ?? null,
        edit: true,
      });
    } else {
      if (type == "mother") {
        selectedAnimal.user_enclosure_name = selectEnclosure;
        dispatch(setMotherAnimal(selectedAnimal));
      } else if (type == "father") {
        dispatch(setFatherAnimal(animalTest));
      } else {
        selectedAnimal.user_enclosure_name = selectEnclosure;
        dispatch(setAnimal(selectedAnimal));
      }
      navigation.goBack();
    }
  };

  const selectAnimalHandler = (animal) => {
    if (type == "father" || screenName == "MoveAnimal") {
      if (selectedIds.includes(animal?.animal_id)) {
        setAnimalTest((old) => {
          return old?.filter((v) => v?.animal_id !== animal?.animal_id);
        });
      } else {
        if (animalTest?.length < Number(limit)) {
          // setSelectedAnimalName(animal.complete_name);
          // setSelectedAnimal(animal);
          setAnimalTest((old) => {
            return [...old, animal];
          });
        }
      }
    } else {
      setSelectedAnimalName(animal.complete_name);
      setSelectedAnimal(animal);
      // selectAnimalModalRef.current.close();
    }
  };

  const sectionPressed = (item) => {
    setSectionType(item.section_name);
    setSectionId(item.section_id);
  };

  const enclosurePressed = (item) => {
    // After change Encluser need to remove animal data
    setSelectedAnimalName("");
    // -------------------
    setSelectEnclosure(item.user_enclosure_name);
    setSelectEnclosureId(item.enclosure_id);
  };

  useEffect(() => {
    setSelectedIds(animalTest?.map((v) => v?.animal_id));
  }, [animalTest?.length]);

  return (
    <>
      <View style={reduxColors.container}>
        <CommonAnimalSelectComponent
          screenName={props.route.params.screenName}
          type={props.route?.params?.type ?? ""}
          limit={props.route?.params?.limit ?? 1}
          selctedQr={props.route?.params?.details}
          animal_idToFilter={props.route?.params?.animal_idToFilter ?? null}
          sectionPressed={(item) => sectionPressed(item)}
          enclosurePressed={(item) => enclosurePressed(item)}
          selectAnimalHandler={(item) => selectAnimalHandler(item)}
          oncloseMoveAnimal={(item) => setAnimalTest(item)}
          oncloseAnimal={(item) => setSelectedAnimalName("")}
        />
        <View style={reduxColors.footerStyle}>
          {screenName === "Medical" ? (
            <Footermedical
              ShowIonicons={true}
              firstlabel={"Case Type"}
              navigatePreviousScreen={navigatePreviousScreen}
              navigateNextScreen={navigateNextScreen}
              lastlabel={"Complaints"}
              onPress={goback}
              ShowRighticon={true}
            />
          ) : selectedAnimalName || animalTest.length > 0 ? (
            <Footermedical onPress={goback} />
          ) : screenName === "Observation" ? (
            sectionId == "" ? null : (
              <Footermedical onPress={goback} />
            )
          ) : screenName === "EditObservation" ? (
            <Footermedical onPress={goback} />
          ) : null}
        </View>
      </View>
    </>
  );
};

export default CommonAnimalSelect;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: reduxColors.onPrimary,
    },
    searchbox: {
      marginTop: heightPercentageToDP(2),
      width: widthPercentageToDP(90),
      justifyContent: "center",
      alignItems: "center",
    },

    title: {
      fontSize: widthPercentageToDP(4.8),
      fontWeight: "500",
      color: Colors.subtitle,
      width: "100%",
    },

    subtitle: {
      fontSize: widthPercentageToDP(4.5),
      color: Colors.subtitle,
      fontWeight: "600",
      fontStyle: "italic",
    },

    ScientificName: {
      fontSize: widthPercentageToDP(4.5),
      color: Colors.subtitle,
      fontWeight: "300",
      fontStyle: "italic",
    },

    MBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(2),
      height: heightPercentageToDP(3),
      backgroundColor: Colors.mbox,
    },
    BBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(2),
      height: heightPercentageToDP(3),
      backgroundColor: Colors.bBox,
    },

    secondItembox: {
      width: widthPercentageToDP(90),
      marginTop: heightPercentageToDP(2),
      flexDirection: "row",
      alignItems: "flex-end",
    },

    dateDropdown: {
      height: heightPercentageToDP(4),
      borderColor: Colors.boxBorderColor,
      borderWidth: widthPercentageToDP(0.2),
      borderRadius: 8,
      marginRight: widthPercentageToDP(2),
      backgroundColor: "white",
      flexDirection: "row",
      alignItems: "center",
      width: "27%",
    },
    collectionsDropdown: {
      width: widthPercentageToDP(30),
      height: heightPercentageToDP(4),
      borderColor: Colors.boxBorderColor,
      borderWidth: widthPercentageToDP(0.2),
      borderRadius: 8,
      fontSize: 10,
      backgroundColor: "white",
      marginRight: 7,
    },

    siteDropdown: {
      width: widthPercentageToDP(29),
      height: heightPercentageToDP(4),
      borderColor: Colors.boxBorderColor,
      borderWidth: widthPercentageToDP(0.2),
      marginRight: widthPercentageToDP(3),
      borderRadius: 8,
      backgroundColor: "white",
    },
    sitecontainerStyle: {
      width: widthPercentageToDP(26),
      marginRight: 10,
    },
    speciesDropdown: {
      width: widthPercentageToDP(25),
      height: heightPercentageToDP("4.7%"),
      borderColor: "gray",
      borderWidth: widthPercentageToDP(0.3),
      borderRadius: 8,
      backgroundColor: Colors.white,
    },
    textBox: {
      marginTop: heightPercentageToDP(3),
      alignItems: "flex-start",
      width: widthPercentageToDP(90),
    },

    textstyle: {
      fontSize: 16,
      fontWeight: "500",
      color: reduxColors.onSecondaryContainer,
    },
    dropdownBox: {
      marginTop: heightPercentageToDP(2),
      width: widthPercentageToDP(90),
    },

    placehStyle: {
      fontSize: 14,
      fontWeight: "500",
      textAlign: "center",
    },
    placehStyles: {
      fontSize: 14,
      fontWeight: "500",
      textAlign: "center",
      // backgroundColor:'red',
      paddingLeft: widthPercentageToDP(1),
    },

    itemstyle: {
      fontSize: 14,
      fontWeight: "500",
      textAlign: "center",
    },
    footerStyle: {
      //position: "absolute",
      width: "100%",
      bottom: 0,
      width: "100%",
    },
    boxStyle: {
      width: widthPercentageToDP(90),
      borderWidth: 1,
      borderColor: reduxColors.outlineVariant,
      borderRadius: 4,
      paddingTop: heightPercentageToDP(1.5),
      backgroundColor: reduxColors.surface,
    },

    boxstylesecond: {
      width: widthPercentageToDP(90),
      height: heightPercentageToDP(10),
      flexDirection: "row",
      justifyContent: "space-between",
      borderWidth: 1,
      borderRadius: 4,
      paddingTop: heightPercentageToDP(1.5),
    },
    selectTextstyle: {
      fontSize: 16,
      fontWeight: "300",
      textAlign: "left",
      marginLeft: widthPercentageToDP(2.5),
    },
    cardstyle: {
      borderRadius: widthPercentageToDP("2%"),
      marginVertical: widthPercentageToDP("2%"),

      flexDirection: "row",
      paddingHorizontal: 10,
      paddingVertical: 10,
      width: widthPercentageToDP(85),
      alignSelf: "center",
      backgroundColor: reduxColors.secondaryContainer,
    },
    modalMaster: {
      flex: 1,
    },

    headerStyle: {
      width: widthPercentageToDP(60),
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginTop: heightPercentageToDP(3),
    },
    headerText: {
      textAlign: "center",
      fontSize: 22,
      fontWeight: "500",
    },
    modalFirstbox: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: heightPercentageToDP(2),
    },
    //modal search box
    searchBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: reduxColors.onPrimary,
      borderRadius: 8,
      borderWidth: 1,
      // paddingVertical: 8,
      paddingLeft: 12,
      height: 35,
      padding: 5,
      borderColor: reduxColors.onPrimaryContainer,
    },
    searchIcon: {
      marginRight: 8,
    },
    input: {
      color: reduxColors.onPrimaryContainer,
      width: "30%",
    },
    listofModalStyle: {
      width: widthPercentageToDP(90),
      marginTop: heightPercentageToDP(3),
    },

    modalSearchplaceholderStyle: {
      fontSize: 14,
      fontWeight: "500",
      textAlign: "center",
    },
    tagsContainer: {
      flexDirection: "row",
    },
    tag: {
      backgroundColor: reduxColors.tagColor,
      borderRadius: 8,
      // paddingVertical: 4,
      paddingHorizontal: 8,
      marginRight: 8,
    },
    malechipText: {
      fontSize: 12,
      color: reduxColors.onPrimaryContainer,
    },
    femalechipText: {
      fontSize: 12,
      color: reduxColors.onPrimaryContainer,
    },
    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.surfaceVariant,
      marginHorizontal: 5,
      fontWeight: 500,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.surfaceVariant,
      fontWeight: 500,
      marginLeft: 5,
    },
    malechipM: {
      backgroundColor: reduxColors.surfaceVariant,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      marginHorizontal: 5,
      fontWeight: 500,
    },
    femalechipF: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.surfaceVariant,
      fontWeight: 500,
      marginLeft: 5,
    },

    // Modal Style

    modalView: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "white",
      borderRadius: 20,
      paddingTop: 35,
      alignItems: "center",
      borderWidth: 0.7,
      overflow: "hidden",
      marginTop: 50,
      marginBottom: 50,
    },

    title: {
      fontSize: widthPercentageToDP(4),
      fontWeight: "400",
      color: Colors.subtitle,
      width: "100%",
    },

    subtitle: {
      fontSize: widthPercentageToDP(4),
      color: Colors.subtitle,
      fontWeight: "400",
    },

    ScientificName: {
      fontSize: widthPercentageToDP(4),
      color: Colors.subtitle,
      fontWeight: "300",
      fontStyle: "italic",
    },

    MBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(2),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.surfaceVariant,
    },
    BBox: {
      marginLeft: widthPercentageToDP(3),
      paddingTop: widthPercentageToDP(0.3),
      padding: widthPercentageToDP(1.5),
      borderRadius: widthPercentageToDP(2),
      height: heightPercentageToDP(3),
      backgroundColor: reduxColors.secondary,
    },
  });
