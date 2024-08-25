/**
 * @React Imports
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
/**
 * @Third Party Imports
 */
import { Image } from "expo-image";
import { useSelector } from "react-redux";
/**
 * @Config Imports
 */
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";

/**
 * @Utils Imports
 */
import {
  ShortFullName,
  capitalize,
  checkPermissionAndNavigate,
  checkPermissionAndNavigateWithAccess,
  opacityColor,
  removeUnderScore,
} from "../utils/Utils";
/**
 * @Assets Imports
 */
import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Config from "../configs/Config";
import { useNavigation } from "@react-navigation/native";
import AnimalCustomCard from "./AnimalCustomCard";
import ObservationSectionCard from "./ObservationScetionCard";
import NotesSiteCard from "./NotesSiteCard";
import { Divider } from "react-native-paper";
import { SvgXml } from "react-native-svg";
import line_start_circle from "../assets/line_start_circle.svg";
import line_end_square from "../assets/line_end_square.svg";

const JournalCard = ({ item, ...props }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const navigation = useNavigation();
  const permission = useSelector((state) => state.UserAuth.permission);
  if (item?.type == "role") {
    return (
      <TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={() =>
            checkPermissionAndNavigate(
              permission,
              "allow_creating_roles",
              navigation,
              "EditRole",
              {
                role_id: item?.entity_id,
                user_id: "",
              }
            )
          }
          style={[reduxColors.cardContainer, props?.style]}
        >
          <Text
            style={[
              reduxColors.title,
              {
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Body_Medium.fontSize,
              },
            ]}
          >
            {item?.custom_data?.message ?? removeUnderScore(item?.action)}
          </Text>
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Text style={reduxColors.title}>
              {item?.custom_data ? item?.custom_data?.role_name ?? "NA" : "NA"}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  } else if (item?.type == "site") {
    return (
      <TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("siteDetails", {
              id: item.custom_data.site_id,
            });
          }}
          style={[
            reduxColors.cardContainer,
            props?.style,
            { backgroundColor: constThemeColor.onPrimary },
          ]}
        >
          <Text
            style={[
              {
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                marginBottom: 2,
              },
            ]}
          >
            {item?.custom_data?.message ?? removeUnderScore(item?.action)}
          </Text>

          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <Image
                style={
                  item?.details?.site_default_icon
                    ? reduxColors.image
                    : reduxColors.svg_image
                }
                contentFit="cover"
                transition={300}
                source={{
                  uri:
                    item?.details?.site_default_icon ??
                    Config.BASE_APP_URL +
                      "uploads/assets/class_images/default_animal.svg",
                }}
              />
            </View>
            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.custom_data ? item?.custom_data?.site_name ?? "NA" : "NA"}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  } else if (item?.type == "section") {
    return (
      <TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("HousingEnclosuer", {
              section_id: item?.custom_data.section_id ?? 0,
              sectiondata: item?.custom_data,
              incharge_name: item.incharge_name ? item.incharge_name : "NA",
            })
          }
          style={[
            reduxColors.cardContainer,
            props?.style,
            { backgroundColor: constThemeColor.onPrimary },
          ]}
        >
          <Text
            style={[
              {
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                marginBottom: 2,
              },
            ]}
          >
            {item?.custom_data?.message ?? removeUnderScore(item?.action)}
          </Text>

          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <Image
                style={
                  item?.details?.section_default_icon
                    ? reduxColors.image
                    : reduxColors.svg_image
                }
                contentFit="cover"
                transition={300}
                source={{
                  uri:
                    item?.details?.section_default_icon ??
                    Config.BASE_APP_URL +
                      "uploads/assets/class_images/default_animal.svg",
                }}
              />
            </View>

            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.custom_data
                ? item?.custom_data?.section_name ?? "NA"
                : "NA"}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <Image
                style={
                  item?.details?.site_default_icon
                    ? reduxColors.image
                    : reduxColors.svg_image
                }
                contentFit="cover"
                transition={300}
                source={{
                  uri:
                    item?.details?.site_default_icon ??
                    Config.BASE_APP_URL +
                      "uploads/assets/class_images/default_animal.svg",
                }}
              />
            </View>
            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.custom_data ? item?.custom_data?.site_name ?? "NA" : "NA"}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  } else if (item?.type == "enclosure") {
    return (
      <TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("OccupantScreen", {
              enclosure_id: item?.custom_data?.enclosure_id ?? 0,
              section_id: item?.custom_data?.section_id,
              section_name: item?.custom_data?.section_name,
              enclosure_name: item?.custom_data?.user_enclosure_name,
              enclosure_id: item?.custom_data?.enclosure_id,
            })
          }
          style={[
            reduxColors.cardContainer,
            props?.style,
            { backgroundColor: constThemeColor.onPrimary },
          ]}
        >
          <Text
            style={[
              {
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                marginBottom: 2,
              },
            ]}
          >
            {item?.custom_data?.message ?? removeUnderScore(item?.action)}
          </Text>
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <Image
                style={
                  item?.details?.enclosure_default_icon
                    ? reduxColors.image
                    : reduxColors.svg_image
                }
                contentFit="cover"
                transition={300}
                source={{
                  uri:
                    item?.details?.enclosure_default_icon ??
                    Config.BASE_APP_URL +
                      "uploads/assets/class_images/default_animal.svg",
                }}
              />
            </View>

            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.custom_data
                ? item?.custom_data?.enclosure_name ?? "NA"
                : "NA"}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <Image
                style={
                  item?.details?.section_default_icon
                    ? reduxColors.image
                    : reduxColors.svg_image
                }
                contentFit="cover"
                transition={300}
                source={{
                  uri:
                    item?.details?.section_default_icon ??
                    Config.BASE_APP_URL +
                      "uploads/assets/class_images/default_animal.svg",
                }}
              />
            </View>

            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.custom_data
                ? item?.custom_data?.section_name ?? "NA"
                : "NA"}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <Image
                style={
                  item?.details?.site_default_icon
                    ? reduxColors.image
                    : reduxColors.svg_image
                }
                contentFit="cover"
                transition={300}
                source={{
                  uri:
                    item?.details?.site_default_icon ??
                    Config.BASE_APP_URL +
                      "uploads/assets/class_images/default_animal.svg",
                }}
              />
            </View>
            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.custom_data ? item?.custom_data?.site_name ?? "NA" : "NA"}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  } else if (item?.type == "animal" || item?.type == "mortality") {
    let params = { animal_id: item.custom_data.animal_id };
    if (item?.type == "mortality") {
      params.default_tab = "Mortality";
    }
    return (
      <TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={() =>
            checkPermissionAndNavigateWithAccess(
              permission,
              "collection_animal_record_access",
              navigation,
              "AnimalsDetails",
              params,
              "VIEW"
            )
          }
          style={[
            reduxColors.cardContainer,
            props?.style,
            { backgroundColor: constThemeColor.onPrimary },
          ]}
        >
          <Text
            style={[
              {
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                marginBottom: 2,
              },
            ]}
          >
            {item?.custom_data?.message ?? removeUnderScore(item?.action)}
          </Text>
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              {item?.type == "mortality" ? (
                <View
                  style={{
                    backgroundColor: constThemeColor.error,
                    height: 30,
                    width: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                    padding: Spacing.mini,
                  }}
                >
                  <MaterialCommunityIcons
                    name="emoticon-dead-outline"
                    size={21}
                    color={constThemeColor.onPrimary}
                  />
                </View>
              ) : (
                <Image
                  style={
                    item?.details?.default_icon
                      .split(".")
                      .pop()
                      .toLowerCase() == "svg"
                      ? reduxColors.svg_image
                      : reduxColors.image
                  }
                  contentFit="cover"
                  transition={300}
                  source={{
                    uri: item?.details?.default_icon,
                  }}
                />
              )}
            </View>

            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.details?.common_name ?? item?.details?.scientific_name}
              {item?.details?.type == "group" &&
                ` (${item?.details?.total_animal})`}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <Image
                style={
                  item?.details?.enclosure_default_icon
                    ? reduxColors.image
                    : reduxColors.svg_image
                }
                contentFit="cover"
                transition={300}
                source={{
                  uri:
                    item?.details?.enclosure_default_icon ??
                    Config.BASE_APP_URL +
                      "uploads/assets/class_images/default_animal.svg",
                }}
              />
            </View>

            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.details
                ? item?.details?.user_enclosure_name ?? "NA"
                : "NA"}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <Image
                style={
                  item?.details?.section_default_icon
                    ? reduxColors.image
                    : reduxColors.svg_image
                }
                contentFit="cover"
                transition={300}
                source={{
                  uri:
                    item?.details?.section_default_icon ??
                    Config.BASE_APP_URL +
                      "uploads/assets/class_images/default_animal.svg",
                }}
              />
            </View>

            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.details ? item?.details?.section_name ?? "NA" : "NA"}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <Image
                style={
                  item?.details?.site_default_icon
                    ? reduxColors.image
                    : reduxColors.svg_image
                }
                contentFit="cover"
                transition={300}
                source={{
                  uri:
                    item?.details?.site_default_icon ??
                    Config.BASE_APP_URL +
                      "uploads/assets/class_images/default_animal.svg",
                }}
              />
            </View>
            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.details ? item?.details?.site_name ?? "NA" : "NA"}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  } else if (item?.type == "notes") {
    const refData = item?.details?.ref_data;
    const renderAnimalData = (animalData) => {
      return (
        <View
          style={[
            {
              backgroundColor: constThemeColor?.onPrimary,
              borderRadius: Spacing.mini,
              marginLeft: -12,
            },
          ]}
        >
          <AnimalCustomCard
            item={animalData}
            animalIdentifier={
              animalData?.local_identifier_value
                ? animalData?.local_identifier_name
                : animalData?.animal_id
            }
            localID={animalData?.local_identifier_value ?? null}
            icon={animalData?.default_icon}
            enclosureName={animalData?.user_enclosure_name}
            animalName={animalData?.common_name}
            siteName={animalData?.site_name}
            scientific_name={animalData?.scientific_name}
            sectionName={animalData?.section_name}
            show_specie_details={true}
            show_housing_details={true}
            chips={animalData?.sex}
            style={{
              paddingHorizontal: Spacing.body,
              paddingVertical: Spacing.small,
            }}
            noArrow={true}
            remove={false}
          />
        </View>
      );
    };

    const renderEnclosureData = (enclosureData) => {
      return (
        <View style={{ padding: Spacing.small }}>
          <ObservationSectionCard
            style={reduxColors.containerStyle}
            title={`Encl : ${enclosureData?.user_enclosure_name}`}
            type="Enclosure"
            incharge={""}
            site={enclosureData?.site_name}
            remove={false}
            label={`Sec : ${enclosureData?.section_name}`}
          />
        </View>
      );
    };

    const renderSectionData = (sectionData) => {
      return (
        <View style={{ padding: Spacing.small }}>
          <ObservationSectionCard
            style={reduxColors.containerStyle}
            title={`Sec : ${sectionData?.section_name}`}
            incharge={""}
            remove={false}
            label={`Site : ${sectionData?.site_name}`}
          />
        </View>
      );
    };

    const renderSiteData = (siteData) => {
      return (
        <View style={{ padding: Spacing.small }}>
          <NotesSiteCard
            style={reduxColors.containerStyle}
            title={`Site : ${siteData?.site_name}`}
            type="Site"
            incharge={""}
          />
        </View>
      );
    };
    const renderDataAtIndexZero = () => {
      if (refData?.length > 0) {
        const data = refData[0];
        switch (data?.ref_type) {
          case "animal":
            return renderAnimalData(data.animalData);
          case "enclosure":
            return renderEnclosureData(data.enclosureData);
          case "section":
            return renderSectionData(data.sectionData);
          case "site":
            return renderSiteData(data.siteData);
          default:
            return null;
        }
      } else {
        return null;
      }
    };
    return (
      <TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ObservationSummary", {
              item: { observation_id: item.custom_data.note_id },
            });
          }}
          style={[
            reduxColors.cardContainer,
            props?.style,
            { backgroundColor: constThemeColor.onPrimary },
          ]}
        >
          <Text
            style={[
              {
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                marginBottom: 2,
              },
            ]}
          >
            {item?.custom_data?.message ?? removeUnderScore(item?.action)}
          </Text>
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <MaterialCommunityIcons
                name="note-outline"
                size={20}
                color={constThemeColor.onSurfaceVariant}
              />
            </View>

            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.details?.type_name ?? "NA"}
            </Text>
          </View>
          {refData?.length > 0 && (
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>{renderDataAtIndexZero()}</View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                {refData?.length > 1 && (
                  <>
                    <View>
                      <View
                        style={{
                          backgroundColor: constThemeColor?.surfaceVariant,
                          height: 46,
                          width: 46,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 50,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: FontSize.Antz_Body_Title.fontSize,
                            fontWeight: FontSize.Antz_Body_Title.fontWeight,
                            color: constThemeColor?.onSurface,
                          }}
                        >
                          + {refData?.length - 1}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </View>
          )}
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  } else if (item?.type == "user_profile") {
    return (
      <TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("UserDetails", {
              user_id: item?.custom_data.user_id,
            });
          }}
          style={[
            reduxColors.cardContainer,
            props?.style,
            { backgroundColor: constThemeColor.onPrimary },
          ]}
        >
          <Text
            style={[
              {
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                marginBottom: 2,
              },
            ]}
          >
            {item?.custom_data?.message ?? removeUnderScore(item?.action)}
          </Text>
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.secondary,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              {item?.details?.user_profile_pic ? (
                <Image
                  source={{ uri: item?.details?.user_profile_pic }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 20,
                  }}
                />
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      ...FontSize.Antz_Subtext_Medium,
                      color: constThemeColor.onPrimary,
                    }}
                  >
                    {ShortFullName(
                      item?.details?.user_first_name +
                        " " +
                        item?.details?.user_last_name
                    )}
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: Spacing.micro,
                  marginLeft: Spacing.small,
                },
              ]}
            >
              {item?.details?.user_first_name +
                " " +
                item?.details?.user_last_name}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  } else if (item?.type == "medical_record") {
    return (
      <TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MedicalSummary", {
              medical_record_id: item.custom_data.medical_id,
            });
          }}
          style={[
            reduxColors.cardContainer,
            props?.style,
            { backgroundColor: constThemeColor.onPrimary },
          ]}
        >
          <Text
            style={[
              {
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Minor_Medium.fontSize,
                fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                marginBottom: 2,
              },
            ]}
          >
            {item?.custom_data?.message ?? removeUnderScore(item?.action)}
          </Text>

          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "red",
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <FontAwesome6 name="stethoscope" size={16} color="white" />
            </View>

            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Body_Medium.fontSize,
                  fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  marginBottom: 2,
                  marginLeft: 5,
                },
              ]}
            >
              {item?.custom_data
                ? item?.custom_data?.medical_record_code ?? "NA"
                : "NA"}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  } else if (item?.type == "login" || item?.type == "logout") {
    return (
      <TouchableWithoutFeedback>
        <TouchableOpacity
          // onPress={() => {
          //   navigation.navigate("UserDetails", {
          //     user_id: item?.custom_data.user_id,
          //     default_tab: "Devices",
          //   });
          // }}
          style={[
            reduxColors.cardContainer,
            props?.style,
            { backgroundColor: constThemeColor.onPrimary },
          ]}
        >
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingHorizontal: Spacing.micro,
              paddingVertical: Spacing.micro,
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                backgroundColor: constThemeColor.surfaceVariant,
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                padding: Spacing.mini,
              }}
            >
              <AntDesign
                name={item?.type}
                size={21}
                color={constThemeColor.onSurfaceVariant}
              />
            </View>

            <Text
              style={[
                {
                  color: constThemeColor.onSurfaceVariant,
                  fontSize: FontSize.Antz_Minor_Medium.fontSize,
                  fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
                  marginBottom: 2,
                  marginLeft: 5,
                },
              ]}
            >
              {item?.custom_data?.message ?? removeUnderScore(item?.action)}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  } else if (item?.type == "animal_transfer") {
    const headetTitle =
      item.details?.transfer_type == "inter"
        ? "Inter-site "
        : item.details?.transfer_type == "intra"
        ? "In-house "
        : "External ";
    return (
      <TouchableWithoutFeedback>
        <TouchableOpacity
        onPress={() => {
          navigation.navigate("ApprovalSummary", {
            animal_movement_id: item?.entity_id,
            site_id: item.details?.source_site_id,
            screen: "site",
            reference: "list",
          });
        }}
          style={[
            reduxColors.cardContainer,
            { backgroundColor: constThemeColor.onPrimary },
            props?.style,
          ]}
        >
          <Text
            style={{
              ...FontSize.Antz_Minor_Medium,
              color: constThemeColor.onSurfaceVariant,
            }}
          >
            {headetTitle + item?.custom_data?.message}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: Spacing.small - 2,
            }}
          >
            {item.details?.transfer_type == "intra" ? null : (
              <SvgXml
                xml={line_start_circle}
                width="16"
                height="8"
                style={{ marginRight: Spacing.mini + 2 }}
              />
            )}
            <Text
              style={{
                ...FontSize.Antz_Minor_Title,
                color: constThemeColor.onSurfaceVariant,
              }}
            >
              {item.details?.source_site_name}
            </Text>
          </View>
          {item.details?.transfer_type == "intra" ? null : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <SvgXml
                xml={line_end_square}
                width="16"
                height="8"
                style={{ marginRight: Spacing.mini + 2 }}
              />

              <Text
                style={{
                  ...FontSize.Antz_Minor_Title,
                  color: constThemeColor.onSurfaceVariant,
                }}
              >
                {item.details?.destination_name}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  } else {
    return (
      <TouchableWithoutFeedback>
        <TouchableOpacity
          disabled
          style={[reduxColors.cardContainer, props?.style]}
        >
          <Text
            style={[
              {
                color: constThemeColor.onSurfaceVariant,
                fontSize: FontSize.Antz_Body_Medium.fontSize,
              },
              reduxColors.title,
            ]}
          >
            {removeUnderScore(item?.action)}
          </Text>
          {/* <View
            style={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: "cyan",
              padding: 5,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginRight: 15,
              }}
            >
              <View
                style={{
                  backgroundColor: constThemeColor.neutral50,
                  borderRadius: 50,
                  height: 36,
                  width: 36,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: constThemeColor.secondary,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: FontSize.Antz_Minor_Title.fontSize,
                      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                      textAlign: "center",
                      color: reduxColors.onPrimary,
                    }}
                  >
                    {item?.user_name?.slice(0, 1) ?? "NA"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text style={reduxColors.subtitle}>{item.user_name ?? "NA"}</Text>

              <Text style={reduxColors.subtitle}>
                {item?.custom_data
                  ? JSON?.parse(item?.custom_data)?.role_name ?? "NA"
                  : "NA"}
              </Text>
            </View>
          </View> */}
        </TouchableOpacity>
      </TouchableWithoutFeedback>
      // *****************Made request to move animal*************************

      //   **********************Medical checkup update*************************

      //   ***************************************Added section************************

      // *************************Made request to move animal*******************************************
      // <TouchableWithoutFeedback>
      //   <TouchableOpacity
      //     style={[
      //       reduxColors.cardContainer,
      //       props?.style,
      //       { backgroundColor: constThemeColor.onPrimary },
      //     ]}
      //   >
      //     <Text
      //       style={[
      //         reduxColors.title,
      //         {
      //           color: constThemeColor.onSurfaceVariant,
      //           fontSize: FontSize.Antz_Body_Medium.fontSize,
      //         },
      //       ]}
      //     >
      //       Made request to move animal
      //     </Text>

      //     <View
      //       style={{
      //         justifyContent: "flex-start",
      //         flexDirection: "row",
      //         paddingHorizontal: Spacing.micro,
      //         paddingVertical: Spacing.small - 2,
      //         alignItems: "center",
      //       }}
      //     >
      //       <View
      //         style={{
      //           backgroundColor: constThemeColor.secondary,
      //           height: 32,
      //           width: 32,
      //           alignItems: "center",
      //           justifyContent: "center",

      //           borderRadius: 50,
      //           padding: Spacing.mini,
      //         }}
      //       >
      //         <MaterialIcons
      //           name="pets"
      //           size={21}
      //           color="white"
      //           style={{ alignSelf: "center" }}
      //         />
      //       </View>

      //       <Text
      //         style={[
      //           {
      //             color: constThemeColor.onSurfaceVariant,
      //             fontSize: FontSize.Antz_Body_Medium.fontSize,
      //             fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      //             marginBottom: 2,
      //             marginLeft: 5,
      //           },
      //         ]}
      //       >
      //         Animal name
      //       </Text>
      //     </View>

      //     <View
      //       style={{
      //         justifyContent: "space-between",
      //         flexDirection: "row",
      //         paddingHorizontal: Spacing.micro,
      //         paddingVertical: Spacing.micro,
      //       }}
      //     >
      //       <View
      //         style={{
      //           backgroundColor: opacityColor(
      //             constThemeColor.neutralPrimary,
      //             5
      //           ),
      //           flexDirection: "row",
      //           borderRadius: 8,
      //           padding: Spacing.mini,
      //           alignItems: "center",
      //         }}
      //       >
      //         <View
      //           style={{
      //             backgroundColor: constThemeColor.surfaceVariant,
      //             height: 26,
      //             width: 26,
      //             alignItems: "center",
      //             justifyContent: "center",
      //             borderRadius: 50,
      //             padding: Spacing.mini,
      //           }}
      //         >
      //           <MaterialCommunityIcons
      //             name="bag-suitcase-outline"
      //             size={16}
      //             color="black"
      //             style={{ alignSelf: "center" }}
      //           />
      //         </View>

      //         <View>
      //           <Text
      //             style={[
      //               reduxColors.title,
      //               {
      //                 color: constThemeColor.onSurfaceVariant,
      //                 fontSize: FontSize.Antz_Subtext_title.fontSize,
      //                 fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      //               },
      //             ]}
      //           >
      //             COO7
      //           </Text>
      //           <Text
      //             style={[
      //               reduxColors.title,
      //               {
      //                 color: constThemeColor.onSurfaceVariant,
      //                 fontSize: FontSize.Antz_Small,
      //               },
      //             ]}
      //           >
      //             Section name
      //           </Text>
      //         </View>
      //       </View>

      //       <MaterialCommunityIcons
      //         name="arrow-right-top"
      //         size={24}
      //         color="black"
      //         style={{ alignSelf: "center" }}
      //       />

      //       <View
      //         style={{
      //           backgroundColor: opacityColor(
      //             constThemeColor.neutralPrimary,
      //             5
      //           ),
      //           flexDirection: "row",
      //           borderRadius: 8,
      //           padding: Spacing.mini,
      //           alignItems: "center",
      //         }}
      //       >
      //         <View
      //           style={{
      //             backgroundColor: constThemeColor.surfaceVariant,
      //             height: 26,
      //             width: 26,
      //             alignItems: "center",
      //             justifyContent: "center",
      //             borderRadius: 50,
      //             padding: Spacing.mini,
      //           }}
      //         >
      //           <MaterialCommunityIcons
      //             name="bag-suitcase-outline"
      //             size={16}
      //             color="black"
      //             style={{ alignSelf: "center" }}
      //           />
      //         </View>
      //         <View>
      //           <Text
      //             style={[
      //               reduxColors.title,
      //               {
      //                 color: constThemeColor.onSurfaceVariant,
      //                 fontSize: FontSize.Antz_Subtext_title.fontSize,
      //                 fontWeight: FontSize.Antz_Subtext_title.fontWeight,
      //               },
      //             ]}
      //           >
      //             COO7
      //           </Text>
      //           <Text
      //             style={[
      //               reduxColors.title,
      //               {
      //                 color: constThemeColor.onSurfaceVariant,
      //                 fontSize: FontSize.Antz_Small,
      //               },
      //             ]}
      //           >
      //             Section name
      //           </Text>
      //         </View>
      //       </View>
      //     </View>
      //   </TouchableOpacity>
      // </TouchableWithoutFeedback>
      // ******************************Transferred Animal******************************************
      //   <TouchableWithoutFeedback>
      //   <TouchableOpacity
      //     style={[
      //       reduxColors.cardContainer,
      //       props?.style,
      //       { backgroundColor: constThemeColor.onPrimary },
      //     ]}
      //   >
      //     <Text
      //       style={[
      //         reduxColors.title,
      //         {
      //           color: constThemeColor.onSurfaceVariant,
      //           fontSize: FontSize.Antz_Body_Medium.fontSize,
      //         },
      //       ]}
      //     >
      //       Transferred Animal
      //     </Text>

      //     <View
      //       style={{
      //         justifyContent: "flex-start",
      //         flexDirection: "row",
      //         paddingHorizontal: Spacing.micro,
      //         paddingVertical: Spacing.small - 2,
      //         alignItems: "center",
      //       }}
      //     >
      //       <View
      //         style={{
      //           backgroundColor: constThemeColor.secondary,
      //           height: 32,
      //           width: 32,
      //           alignItems: "center",
      //           justifyContent: "center",

      //           borderRadius: 50,
      //           padding: Spacing.mini,
      //         }}
      //       >
      //         <MaterialIcons
      //           name="pets"
      //           size={21}
      //           color="white"
      //           style={{ alignSelf: "center" }}
      //         />
      //       </View>

      //       <Text
      //         style={[
      //           {
      //             color: constThemeColor.onSurfaceVariant,
      //             fontSize: FontSize.Antz_Body_Medium.fontSize,
      //             fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      //             marginBottom: 2,
      //             marginLeft: 5,
      //           },
      //         ]}
      //       >
      //         Animal name
      //       </Text>
      //     </View>

      //     <View
      //       style={{
      //         justifyContent: "space-between",
      //         flexDirection: "row",
      //         paddingHorizontal: Spacing.micro,
      //         paddingVertical: Spacing.micro,
      //       }}
      //     >
      //       <View
      //         style={{
      //           backgroundColor: opacityColor(
      //             constThemeColor.neutralPrimary,
      //             5
      //           ),
      //           flexDirection: "row",
      //           borderRadius: 8,
      //           padding: Spacing.mini,
      //           paddingHorizontal:Spacing.small,
      //           alignItems: "center",
      //         }}
      //       >
      //         <View
      //           style={{
      //             backgroundColor: Colors.percantage,
      //             height: 30,
      //             width: 30,
      //             alignItems: "center",
      //             justifyContent: "center",
      //             borderRadius: 50,
      //             padding: Spacing.mini,
      //           }}
      //         >
      //           <Entypo name="globe"
      //             size={20}
      //             color={constThemeColor.onPrimary}
      //             style={{ alignSelf: "center" }}
      //           />
      //         </View>

      //         <View>

      //           <Text
      //             style={[
      //               reduxColors.title,
      //               {
      //                 color: constThemeColor.onSurfaceVariant,
      //                 fontSize: FontSize.Antz_Small,
      //                 marginLeft:Spacing.mini
      //               },
      //             ]}
      //           >
      //             Section name
      //           </Text>
      //         </View>
      //       </View>

      //       <MaterialCommunityIcons
      //         name="arrow-right-top"
      //         size={24}
      //         color="black"
      //         style={{ alignSelf: "center" }}
      //       />

      //       <View
      //         style={{
      //           backgroundColor: opacityColor(
      //             constThemeColor.neutralPrimary,
      //             5
      //           ),
      //           flexDirection: "row",
      //           borderRadius: 8,
      //           padding: Spacing.mini,
      //           paddingHorizontal:Spacing.small,
      //           alignItems: "center",
      //         }}
      //       >
      //         <View
      //           style={{
      //             backgroundColor:Colors.percantage,
      //             height: 30,
      //             width: 30,
      //             alignItems: "center",
      //             justifyContent: "center",
      //             borderRadius: 50,
      //             padding: Spacing.mini,
      //           }}
      //         >
      //           <Entypo name="globe"
      //             size={20}
      //             color={constThemeColor.onPrimary}
      //             style={{ alignSelf: "center" }}
      //           />
      //         </View>
      //         <View>

      //           <Text
      //             style={[
      //               reduxColors.title,
      //               {
      //                 color: constThemeColor.onSurfaceVariant,
      //                 fontSize: FontSize.Antz_Small,
      //                 marginLeft:Spacing.mini
      //               },
      //             ]}
      //           >
      //             Section name
      //           </Text>
      //         </View>
      //       </View>
      //     </View>
      //   </TouchableOpacity>
      // </TouchableWithoutFeedback>
    );
  }
};

const styles = (reduxColors) =>
  StyleSheet.create({
    cardContainer: {
      borderRadius: 10,
      marginVertical: Spacing.mini,
      elevation: 0.5, // for shadow on Android
      shadowColor: reduxColors.onPrimary, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      //   flexDirection: "row",
      padding: Spacing.body,
      backgroundColor: reduxColors.onPrimary,
    },
    title: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      marginBottom: Spacing.micro,
    },
    subtitle: {
      fontSize: FontSize.Antz_Subtext_title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      fontStyle: "italic",
    },
    image: {
      width: 30,
      height: 30,
      alignSelf: "center",
      borderRadius: 50,
    },
    svg_image: {
      width: 20,
      height: 20,
      alignSelf: "center",
      borderRadius: 50,
    },
  });

export default JournalCard;
