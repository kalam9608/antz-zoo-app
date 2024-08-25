import { StyleSheet, Text, View, Image, BackHandler } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Spacing from "../configs/Spacing";
import AnimalCustomCard from "./AnimalCustomCard";
import MedicalEnclosureCard from "./MedicalEnclosureCard";
import BottomSheetModalComponent from "./BottomSheetModalComponent";
import InsideBottomsheet from "./Move_animal/InsideBottomsheet";
import ObservationSectionCard from "./ObservationScetionCard";
import { useNavigation } from "@react-navigation/native";
import NotesSiteCard from "./NotesSiteCard";

const ObservationAnimalCard = ({
  cardcolorbg,
  outerStyle,
  title,
  selectedAnimal,
  navigation,
  enclosureData,
  sectionData,
  siteList,
  animalList,
  deleteFun,
  completeName,
  disable,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const selectMedicalModalRef = useRef(null);
  const navi = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const listData =
    siteList && siteList?.length > 0
      ? [...sectionData, ...enclosureData, ...animalList, ...siteList]
      : [...sectionData, ...enclosureData, ...animalList];

  useEffect(() => {
    const backAction = () => {
      if (isModalVisible) {
        selectMedicalModalRef.current.close();
      } else {
        navi.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navi, isModalVisible]);

  return (
    <View style={outerStyle}>
      <TouchableOpacity
        disabled={completeName?.animal_id || disable}
        onPress={navigation}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius:cardcolorbg?Spacing.mini: Spacing.small,
            backgroundColor:cardcolorbg?constThemeColor?.displaybgPrimary: constThemeColor?.surface,
            padding: Spacing.body,
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "80%" }}
          >
            <Text
              style={[
                animalList?.length + enclosureData?.length + sectionData?.length
                  ? reduxColors?.title
                  : reduxColors?.commonTitle,
              ]}
            >
              {animalList?.length +
              enclosureData?.length +
              sectionData?.length +
              siteList?.length
                ? animalList?.length +
                    enclosureData?.length +
                    sectionData?.length +
                    siteList?.length ==
                  1
                  ? `${
                      animalList?.length +
                      enclosureData?.length +
                      sectionData?.length +
                      siteList?.length
                    }  Entity`
                  : `${
                      animalList?.length +
                      enclosureData?.length +
                      sectionData?.length +
                      siteList?.length
                    }  Entities`
                : title}
            </Text>
          </View>
          {completeName?.animal_id || disable ? null : (
            <>
              <Feather
                name="plus-circle"
                size={24}
                color={constThemeColor.addPrimary}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
      {completeName?.animal_id ? (
        <View
          style={{
            backgroundColor: constThemeColor?.onPrimary,
            borderRadius: Spacing.small,
          }}
        >
          <Divider bold={true} />
          {/* <Text style={reduxColors?.seletedStyle}>Selected Animal</Text> */}
          <AnimalCustomCard
            item={selectedAnimal}
            animalIdentifier={
              selectedAnimal?.local_identifier_value
                ? selectedAnimal?.local_identifier_name
                : selectedAnimal?.animal_id
            }
            localID={selectedAnimal?.local_identifier_value ?? null}
            icon={selectedAnimal?.default_icon}
            enclosureName={selectedAnimal?.user_enclosure_name}
            animalName={
              completeName?.common_name
                ? completeName?.common_name
                : completeName?.scientific_name ?? ""
            }
            sectionName={completeName?.section_name}
            siteName={completeName?.site_name}
            show_specie_details={true}
            show_housing_details={true}
            chips={completeName?.sex}
            style={{
              paddingHorizontal: Spacing.body,
              paddingVertical: Spacing.small,
            }}
            noArrow={true}
            remove={props.closeButton == false ? false : true}
          />
        </View>
      ) : null}

      {animalList?.length > 0 &&
      sectionData?.length > 0 &&
      enclosureData?.length > 0 ? (
        <>
          <View
            style={{
              backgroundColor: constThemeColor?.onPrimary,
              borderRadius: Spacing.small,
            }}
          >
            <Divider bold={true} />
            {/* <Text style={reduxColors?.seletedStyle}>Selected Animal</Text> */}
            <AnimalCustomCard
              item={selectedAnimal}
              animalIdentifier={
                selectedAnimal?.local_identifier_value
                  ? selectedAnimal?.local_identifier_name
                  : selectedAnimal?.animal_id
              }
              localID={selectedAnimal?.local_identifier_value ?? null}
              icon={selectedAnimal?.default_icon}
              enclosureName={selectedAnimal?.user_enclosure_name}
              animalName={selectedAnimal?.common_name}
              siteName={selectedAnimal?.site_name}
              scientific_name={selectedAnimal?.scientific_name}
              sectionName={selectedAnimal?.section_name}
              show_specie_details={true}
              show_housing_details={true}
              chips={selectedAnimal?.sex}
              style={{
                paddingHorizontal: Spacing.body,
                paddingVertical: Spacing.small,
              }}
              noArrow={true}
              remove={props.closeButton == false ? false : true}
              onRemove={() => {
                deleteFun("animal", selectedAnimal?.animal_id);
              }}
            />
          </View>
          <>
            <Divider bold={true} />
            {/* <Text style={reduxColors?.seletedStyle}>Selected Enclosure</Text> */}
            <ObservationSectionCard
              style={reduxColors.containerStyle}
              title={enclosureData[0]?.user_enclosure_name}
              type="Enclosure"
              incharge={""}
              site={enclosureData[0]?.site_name}
              remove={props.closeButton == false ? false : true}
              label={`Sec: ${enclosureData[0]?.section_name}`}
              onRemove={() => {
                deleteFun("enclosure", enclosureData[0]?.enclosure_id);
              }}
            />
          </>
          <>
            <Divider bold={true} />
            {/* <Text style={reduxColors?.seletedStyle}>Selected Section</Text> */}
            <ObservationSectionCard
              style={reduxColors.containerStyle}
              title={`Sec :${sectionData[0]?.section_name}`}
              incharge={""}
              remove={props.closeButton == false ? false : true}
              label={`Site : ${sectionData[0]?.site_name}`}
              onRemove={() => {
                deleteFun("section", sectionData[0]?.section_id);
              }}
            />
          </>
        </>
      ) : (
        listData?.slice(0, 3)?.map((item) => {
          if (item?.selectType == "section") {
            return (
              <>
                <Divider bold={true} />
                {/* <Text
                  style={[
                    reduxColors?.seletedStyle,
                    {
                      paddingLeft:
                        Spacing.major +
                        Spacing.major +
                        Spacing.minor -
                        Spacing.mini,
                    },
                  ]}
                >
                  Selected Section
                </Text> */}
                <ObservationSectionCard
                  style={reduxColors.containerStyle}
                  title={`Sec : ${item?.section_name}`}
                  incharge={""}
                  remove={props.closeButton == false ? false : true}
                  label={`Site : ${item?.site_name}`}
                  onRemove={() => {
                    deleteFun("section", item?.section_id);
                  }}
                />
              </>
            );
          }
          if (item?.selectType == "enclosure") {
            return (
              <>
                <Divider bold={true} />
                {/* <Text
                  style={[
                    reduxColors?.seletedStyle,
                    {
                      paddingLeft:
                        Spacing.major +
                        Spacing.major +
                        Spacing.minor -
                        Spacing.mini,
                    },
                  ]}
                >
                  Selected Enclosure
                </Text> */}
                <ObservationSectionCard
                  style={reduxColors.containerStyle}
                  title={`Encl : ${item?.user_enclosure_name}`}
                  type="Enclosure"
                  incharge={""}
                  site={enclosureData[0]?.site_name}
                  remove={props.closeButton == false ? false : true}
                  label={`Section : ${item?.section_name}`}
                  onRemove={() => {
                    deleteFun("enclosure", item?.enclosure_id);
                  }}
                />
              </>
            );
          }
          if (item?.selectType == "site") {
            return (
              <>
                <Divider bold={true} />

                <NotesSiteCard
                  style={reduxColors.containerStyle}
                  title={`Site : ${item?.site_name}`}
                  type="Site"
                  incharge={""}
                  remove={props.closeButton == false ? false : true}
                  onRemove={() => {
                    deleteFun("site", item?.site_id);
                  }}
                />
              </>
            );
          }
          if (item?.selectType == "animal") {
            return (
              <View
                style={{
                  backgroundColor: constThemeColor?.onPrimary,
                  borderRadius: Spacing.small,
                }}
              >
                <Divider bold={true} />
                {/* <Text
                  style={[
                    reduxColors?.seletedStyle,
                    {
                      paddingLeft:
                        Spacing.major +
                        Spacing.major +
                        Spacing.minor +
                        Spacing.micro,
                    },
                  ]}
                >
                  Selected Animal{" "}
                </Text> */}
                <AnimalCustomCard
                  item={item}
                  animalIdentifier={
                    item?.local_identifier_value
                      ? item?.local_identifier_name
                      : item?.animal_id
                  }
                  localID={item?.local_identifier_value ?? null}
                  icon={item?.default_icon}
                  enclosureName={item?.user_enclosure_name}
                  animalName={
                    item?.common_name
                      ? item?.common_name
                      : item?.scientific_name ?? ""
                  }
                  siteName={item?.site_name}
                  scientific_name={item?.scientific_name}
                  sectionName={item?.section_name}
                  show_specie_details={true}
                  show_housing_details={true}
                  chips={item?.sex}
                  style={{
                    paddingHorizontal: Spacing.body,
                    paddingVertical: Spacing.micro,
                  }}
                  noArrow={true}
                  remove={props.closeButton == false ? false : true}
                  onRemove={() => {
                    deleteFun("animal", item?.animal_id);
                  }}
                />
              </View>
            );
          }
        })
      )}

      {listData.length > 3 && (
        <>
          <Divider bold={true} style={{}} />
          <TouchableOpacity
            onPress={() => {
              selectMedicalModalRef.current.present();
              setIsModalVisible(true);
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor?.onPrimary,
                height: 43,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: Spacing.small,
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.Antz_Minor_Regular.fontSize,
                  fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                  color: constThemeColor?.onSurface,
                }}
              >
                + {listData.length - 3} more
              </Text>
            </View>
          </TouchableOpacity>
        </>
      )}
      <BottomSheetModalComponent
        // style={{ marginHorizontal: Spacing.body }}
        ref={selectMedicalModalRef}
        onDismiss={() => setIsModalVisible(false)}
      >
        <InsideBottomsheet
          title="Select Animal"
          type="medicalSelected"
          siteList={siteList}
          selectEnclosureData={enclosureData}
          selectSectionData={sectionData}
          selectAnimalData={animalList}
          onRemove={(type, id) => {
            deleteFun(type, id);
          }}
          closeButton={props.closeButton}
        />
      </BottomSheetModalComponent>
    </View>
  );
};

export default ObservationAnimalCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    userTitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    designation: {
      fontSize: FontSize.Antz_Body_Title.fontSize,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    department: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    image: {
      height: heightPercentageToDP(4),
      color: reduxColors.onPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      color: reduxColors.onSurfaceVariant,
      fontWeight: FontSize.Antz_Body_Title.fontWeight,
      flexWrap: "wrap",
    },
    commonTitle: {
      color: reduxColors.onPrimaryContainer,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      flexWrap: "wrap",
    },
    containerStyle: {
      paddingHorizontal: Spacing.body,
      width: "100%",
      borderRadius: Spacing.small,
    },
    seletedStyle: {
      paddingLeft: Spacing.major + Spacing.major + Spacing.minor - Spacing.mini,
      fontSize: FontSize?.Antz_Body_Regular?.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      paddingTop: Spacing.small + Spacing.mini,
      // paddingBottom:Spacing.mini,
      backgroundColor: reduxColors.onPrimary,
      color: reduxColors.neutralPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
  });
