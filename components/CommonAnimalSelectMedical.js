import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";

import {
  setEffectListApiCall,
  setMedicalAnimal,
  setMedicalEnclosure,
  setMedicalSection,
  setMedicalSite,
  setprescription,
} from "../redux/MedicalSlice";
import Footermedical from "./Footermedical";

import CommonAnimalSelectComponentMedical from "./CommonAnimalSelectComponentMedical";
/**
 * @Third Party Imports
 */
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
/**
 * @Config Imports
 */
import Colors from "../configs/Colors";

const CommonAnimalSelectMedical = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [seletedSection, setSeletedSection] = useState([]);

  const [selectedEnclosure, setSelectedEnclosure] = useState([]);

  const [selectedAnimal, setSelectedAnimal] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const SelectedAnimalRedux = useSelector((state) => state.medical.animal);
  const SelectedEnclosureRedux = useSelector(
    (state) => state.medical.enclosure
  );
  const SelectedSectionRedux = useSelector((state) => state.medical.section);
  const SelectedSiteRedux = useSelector((state) => state.medical.site);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);

  const findExesting = (array1 = [], array2 = [], key1, key2) => {
    const arrayIds1 = array1?.map((v) => v[key1]);
    const arrayIds2 = array2?.map((v) => v[key2]);
    const filter = arrayIds1?.filter((p) => arrayIds2?.includes(p));
    return filter;
  };
  const goback = () => {
    if (
      seletedSection?.length > 0 &&
      selectedEnclosure?.length == 0 &&
      selectedAnimal?.length == 0
    ) {
      const filterEnclosureReturn = findExesting(
        seletedSection,
        SelectedEnclosureRedux,
        "section_id",
        "section_id"
      );
      const filterAnimalReturn = findExesting(
        seletedSection,
        SelectedAnimalRedux,
        "section_id",
        "section_id"
      );
      if (filterEnclosureReturn?.length > 0) {
        const filterData = SelectedEnclosureRedux?.filter(
          (p) => !filterEnclosureReturn?.includes(p?.section_id)
        );
        dispatch(setMedicalEnclosure([...filterData]));
        dispatch(
          setMedicalSection([...SelectedSectionRedux, ...seletedSection])
        );
      }
      if (filterAnimalReturn?.length > 0) {
        const filterData = SelectedAnimalRedux?.filter(
          (p) => !filterAnimalReturn?.includes(p?.section_id)
        );
        dispatch(setMedicalAnimal([...filterData]));
        dispatch(
          setMedicalSection([...SelectedSectionRedux, ...seletedSection])
        );
      } else {
        dispatch(
          setMedicalSection([...SelectedSectionRedux, ...seletedSection])
        );
      }
    } else if (selectedEnclosure?.length > 0 && selectedAnimal?.length == 0) {
      const filterAnimalReturn = findExesting(
        selectedEnclosure,
        SelectedAnimalRedux,
        "enclosure_id",
        "enclosure_id"
      );

      if (filterAnimalReturn?.length > 0) {
        const filterData = SelectedAnimalRedux?.filter(
          (p) => !filterAnimalReturn?.includes(p?.enclosure_id)
        );

        dispatch(setMedicalAnimal([...filterData]));
        dispatch(
          setMedicalEnclosure([...SelectedEnclosureRedux, ...selectedEnclosure])
        );
      } else {
        dispatch(
          setMedicalEnclosure([...SelectedEnclosureRedux, ...selectedEnclosure])
        );
      }
    } else if (selectedAnimal?.length > 0) {
      dispatch(setMedicalAnimal([...SelectedAnimalRedux, ...selectedAnimal]));
    } else if(selectedSites?.length > 0 &&
      selectedEnclosure?.length == 0 &&
      seletedSection?.length == 0){
        dispatch(setMedicalSite([...SelectedSiteRedux, ...selectedSites]));
      }
    if (
      selectedAnimal?.length > 0 ||
      selectedEnclosure?.length > 0 ||
      seletedSection?.length > 0
    ) {
      dispatch(setprescription([]));
    }
    dispatch(setEffectListApiCall(true));

    if (props.route.params?.screenName == "Transfer") {
      navigation.navigate("MoveAnimal");
    } else if (props.route.params?.screenName == "Medical") {
      navigation.navigate("AddMedical");
    } else {
      navigation.navigate("Observation");
    }
  };
  const checkDoneButton =
    props.route.params?.screenName == "Transfer" ||
    props.route.params?.screenName == "Medical"
      ? selectedAnimal?.length > 0
      : seletedSection?.length > 0 ||
        selectedEnclosure?.length > 0 ||
        selectedAnimal?.length > 0;
  const observationCheck =
    props.route.params?.screenName == "Observation" && selectedSites.length > 0;
  return (
    <>
      <View style={reduxColors.container}>
        <CommonAnimalSelectComponentMedical
          siteSelectedIds={props.route.params?.siteSelectedIds ?? []}
          setSelectedSites={setSelectedSites}
          selectedIds={props.route.params?.selectedIds ?? []}
          screenName={props.route.params?.screenName}
          excludeHousingWithNoAnimals={
            props.route.params?.excludeHousingWithNoAnimals
          }
          type={props.route?.params?.type ?? ""}
          limit={props.route?.params?.limit ?? 1}
          sectionPressed={(item) => setSeletedSection(item)}
          enclosurePressed={(item) => setSelectedEnclosure(item)}
          selectAnimalHandler={(item) => setSelectedAnimal(item)}
          sectionData={props?.route?.params?.sectionData}
        />
        {checkDoneButton ||
        (props.route.params?.screenName == "Observation" &&
          selectedSites?.length > 0) ? (
          <View style={{ width: "100%" }}>
            <Footermedical onPress={goback} />
          </View>
        ) : null}
      </View>
    </>
  );
};

export default CommonAnimalSelectMedical;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: reduxColors.onPrimary,
    },
  });
