import { StyleSheet, Text, View, Image, BackHandler } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Spacing from "../configs/Spacing";
import AnimalCustomCard from "./AnimalCustomCard";
import { shortenNumber } from "../utils/Utils";
import MedicalEnclosureCard from "./MedicalEnclosureCard";
import BottomSheetModalComponent from "./BottomSheetModalComponent";
import InsideBottomsheet from "./Move_animal/InsideBottomsheet";
import { useNavigation } from "@react-navigation/native";

const MedicalAnimalCard = ({
  outerStyle,
  title,
  selectedAnimal,
  navigation,
  enclosureData,
  sectionData,
  animalList,
  deleteFun,
  completeName,
  disable,
  hideIcon,
  boldStyle,
  allowRemove = true,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const selectMedicalModalRef = useRef(null);
  const navi = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const listData = [...sectionData, ...enclosureData, ...animalList];

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
  const countAnimals = (arrayOfObjects) => {
    if (arrayOfObjects?.length > 0) {
      let totalCount = 0;
      arrayOfObjects?.forEach((item) => {
        if (item?.type === "single") {
          totalCount += 1;
        } else if (item?.type === "group") {
          totalCount += parseInt(item?.total_animal);
        }
      });
      return totalCount;
    } else {
      return 0;
    }
  };

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
            borderRadius: Spacing.small,
            backgroundColor: constThemeColor?.surface,
            padding: Spacing.body,
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "80%" }}
          >
            {hideIcon ? null : (
              <MaterialCommunityIcons
                name="home-plus-outline"
                style={{ paddingRight: Spacing.body }}
                color={constThemeColor?.onPrimaryContainer}
                size={24}
              />
            )}

            <Text
              style={[
                animalList?.length + enclosureData?.length + sectionData?.length
                  ? reduxColors?.title
                  : props.maintitleStyle
                  ? reduxColors?.commonTitleStyle
                  : boldStyle
                  ? reduxColors?.title
                  : reduxColors?.commonTitle,
              ]}
            >
              {animalList?.length + enclosureData?.length + sectionData?.length
                ? `${
                    countAnimals(animalList) +
                    enclosureData?.length +
                    sectionData?.length
                  } Selected`
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
          <Text style={reduxColors?.seletedStyle}>Selected Animal</Text>
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
            remove={allowRemove}
            onRemove={() => {
              deleteFun("animal", completeName?.animal_id);
            }}
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
            <Text style={reduxColors?.seletedStyle}>Selected Animal</Text>
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
                selectedAnimal?.common_name
                  ? selectedAnimal?.common_name
                  : selectedAnimal?.scientific_name ?? ""
              }
              sectionName={selectedAnimal?.section_name}
              siteName={selectedAnimal?.site_name}
              show_specie_details={true}
              show_housing_details={true}
              chips={selectedAnimal?.sex}
              style={{
                paddingHorizontal: Spacing.body,
                paddingVertical: Spacing.small,
              }}
              noArrow={true}
              remove={true}
              onRemove={() => {
                deleteFun("animal", selectedAnimal?.animal_id);
              }}
            />
          </View>
          <>
            <Divider bold={true} />
            <Text style={reduxColors?.seletedStyle}>Selected Enclosure</Text>
            <MedicalEnclosureCard
              style={reduxColors.containerStyle}
              title={enclosureData[0]?.user_enclosure_name}
              type="Enclosure"
              incharge={""}
              chip1={
                "Occupants " +
                shortenNumber(enclosureData[0]?.enclosure_wise_animal_count)
              }
              chip2={
                "Species " + shortenNumber(enclosureData[0]?.species_count ?? 0)
              }
              remove={true}
              label={`Section : ${enclosureData[0]?.section_name}`}
              onRemove={() => {
                deleteFun("enclosure", enclosureData[0]?.enclosure_id);
              }}
            />
          </>
          <>
            <Divider bold={true} />
            <Text style={reduxColors?.seletedStyle}>Selected Section</Text>
            <MedicalEnclosureCard
              style={reduxColors.containerStyle}
              title={sectionData[0]?.section_name}
              incharge={""}
              chip2={"Animals " + shortenNumber(sectionData[0]?.animal_count)}
              chip1={
                "Enclosures " + shortenNumber(sectionData[0]?.enclosure_count)
              }
              remove={true}
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
                <Text
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
                </Text>
                <MedicalEnclosureCard
                  style={reduxColors.containerStyle}
                  title={item?.section_name}
                  incharge={""}
                  chip2={
                    <Text>
                      Animals{" "}
                      <Text style={[FontSize.Antz_Body_Title]}>
                        {shortenNumber(item?.animal_count)}
                      </Text>{" "}
                    </Text>
                  }
                  chip1={
                    <Text>
                      Enclosures{" "}
                      <Text style={[FontSize.Antz_Body_Title]}>
                        {shortenNumber(item?.enclosure_count)}
                      </Text>{" "}
                    </Text>
                  }
                  remove={true}
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
                <Text
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
                </Text>
                <MedicalEnclosureCard
                  style={reduxColors.containerStyle}
                  title={item?.user_enclosure_name}
                  type="Enclosure"
                  incharge={""}
                  chip1={
                    <Text>
                      Occupants{" "}
                      <Text style={[FontSize.Antz_Body_Title]}>
                        {shortenNumber(item?.enclosure_wise_animal_count)}
                      </Text>{" "}
                    </Text>
                  }
                  chip2={
                    <Text>
                      Species{" "}
                      <Text style={[FontSize.Antz_Body_Title]}>
                        {shortenNumber(item?.species_count ?? 0)}
                      </Text>{" "}
                    </Text>
                  }
                  remove={true}
                  label={`Section : ${item?.section_name}`}
                  onRemove={() => {
                    deleteFun("enclosure", item?.enclosure_id);
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
                <Text
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
                </Text>
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
                  sectionName={item?.section_name}
                  siteName={item?.site_name}
                  show_specie_details={true}
                  show_housing_details={true}
                  chips={item?.sex}
                  style={{
                    paddingHorizontal: Spacing.body,
                    paddingVertical: Spacing.micro,
                  }}
                  noArrow={true}
                  remove={disable ? false : true}
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
          selectEnclosureData={enclosureData}
          selectSectionData={sectionData}
          selectAnimalData={animalList}
          onRemove={(type, id) => {
            deleteFun(type, id);
          }}
        />
      </BottomSheetModalComponent>
    </View>
  );
};

export default MedicalAnimalCard;

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
    commonTitleStyle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onSurface,
    },
    commonTitle: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onSurfaceVariant,
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
