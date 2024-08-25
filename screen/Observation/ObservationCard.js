import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Card, Divider, Searchbar } from "react-native-paper";
import { useSelector } from "react-redux";
import {
  Entypo,
  EvilIcons,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import FontSize from "../../configs/FontSize";
import SvgUri from "react-native-svg-uri";
import flag_priority_low from "../../assets/priroty/flag_priority_low.svg";
import flag_priority_critical from "../../assets/priroty/flag_priority_critical.svg";
import flag_priority_high from "../../assets/priroty/flag_priority_high.svg";
import flag_priority_medium from "../../assets/priroty/flag_priority_medium.svg";
import subtypeImage from "../../assets/raven.svg";
import headingImage from "../../assets/family_home.svg";
import moment from "moment";
import {
  LengthDecrease,
  ShortFullName,
  capitalize,
  ifEmptyValue,
  opacityColor,
  shortenNumber,
  timeCalculate,
} from "../../utils/Utils";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
// import { Image } from "react-native";
import { Image } from "expo-image";
import { SvgXml } from "react-native-svg";
import { TouchableOpacity } from "react-native";
import AnimalCustomCard from "../../components/AnimalCustomCard";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import Spacing from "../../configs/Spacing";
import Config from "../../configs/Config";
import MedicalEnclosureCard from "../../components/MedicalEnclosureCard";
import ObservationSectionCard from "../../components/ObservationScetionCard";
import { FlatList } from "react-native";
import NotesSiteCard from "../../components/NotesSiteCard";
const ObservationCard = ({
  item,
  onPress,
  priroty,
  assign_to,
  borderWidth,
  borderColor,
  routeName,
  hideCommentSection,
  onPressComment,
  style,
}) => {
  // fot taking styles from redux use this function
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const userDetails = useSelector((state) => state.UserAuth.userDetails);
  let childTypeData = item?.child_master_type?.child_observation_type;
  // const documents_count = item?.attachments?.filter(
  //   (value) => value?.file_type?.split("/")[0] != "image"
  // );
  const documents_count = item?.attachments?.filter((value) => {
    const fileType = value?.file_type?.split("/")[0];
    return fileType !== "image" && fileType !== "audio" && fileType !== "video";
  });

  const images_count =
    item?.attachments?.filter(
      (value) => value?.file_type?.split("/")[0] == "image"
    ) ?? [];
  // for the attachments notes count
  const Notes_images_count = item?.note?.notes_attachment?.filter(
    (value) => value?.file_type?.split("/")[0] == "image"
  );
  const Notes_documents_count = item?.note?.notes_attachment?.filter(
    (value) => value?.file_type?.split("/")[0] != "image"
  );

  const getIconName = (fileType) => {
    const iconMap = {
      image: "attach",
      audio: "mic-circle",
      video: "videocam",
      // Add more mappings as needed
    };
    return iconMap[fileType] || "attach"; // Return default icon if file type is not found
  };
  const countsOfComments = item?.note?.notes_attachment?.reduce(
    (acc, value) => {
      const fileType = value?.file_type?.split("/")[0];
      let fileTypeObj = acc.find((item) => item.file_type === fileType);

      if (!fileTypeObj) {
        fileTypeObj = {
          file_type: fileType,
          count: 0,
          icon_name: getIconName(fileType), // Function to get icon name based on file type
        };
        acc.push(fileTypeObj);
      }

      fileTypeObj.count++;
      return acc;
    },
    []
  );

  const counts = item?.attachments?.reduce((acc, value) => {
    const fileType = value?.file_type?.split("/")[0];
    let fileTypeObj = acc.find((item) => item.file_type === fileType);

    if (!fileTypeObj) {
      fileTypeObj = {
        file_type: fileType,
        count: 0,
        icon_name: getIconName(fileType), // Function to get icon name based on file type
      };
      acc.push(fileTypeObj);
    }

    fileTypeObj.count++;
    return acc;
  }, []);

  // if (Platform.OS === "android") {
  //   if (UIManager.setLayoutAnimationEnabledExperimental) {
  //     UIManager.setLayoutAnimationEnabledExperimental(true);
  //   }
  // }
  // const toggleView = () => {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //   setExpand(!expand);
  // };
  const stylesSheet = BottomSheetModalStyles.ShodowOpacity(constThemeColor);
  const refData = item?.ref_data;
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
      switch (data?.type) {
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
  const [showMore, setShowMore] = useState(false);
  const [textLines, setTextLines] = useState(4);
  const textRef = useRef(null);
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [showMore]);

  const handleTextLayout = (e) => {
    const { lines } = e.nativeEvent;
    setTextLines(lines.length);
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const renderAttachmentInfo = (count, icon, text, i) => {
    if (count > 0) {
      return (
        <View
          key={i}
          style={{
            flexDirection: "row",
            marginHorizontal: Spacing.mini,
            alignItems: "center",
          }}
        >
          <Ionicons
            name={icon}
            size={18}
            color={constThemeColor.neutralSecondary}
          />
          <Text style={reduxColors.docsCount}>
            {" "}
            {count}{" "}
            {text === "application"
              ? count === 1
                ? "document"
                : "documents"
              : count === 1
              ? text
              : text + "s"}
            {i < counts.length - 1 ? `,` : null}
          </Text>
        </View>
      );
    }
    return null;
  };
  const renderAttachmentNotesInfo = (count, icon, text, i) => {
    if (count > 0) {
      return (
        <View
          key={i}
          style={{
            flexDirection: "row",
            marginHorizontal: Spacing.mini,
            alignItems: "center",
          }}
        >
          <Ionicons
            name={icon}
            size={18}
            color={constThemeColor.neutralSecondary}
          />
          <Text style={reduxColors.docsCount}>
            {" "}
            {count}{" "}
            {text === "application"
              ? count === 1
                ? "document"
                : "documents"
              : count === 1
              ? text
              : text + "s"}
            {i < countsOfComments.length - 1 ? `,` : null}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          reduxColors.container,
          {
            elevation: stylesSheet.elevationShadow.elevation,
            shadowColor: stylesSheet.elevationShadow.shadowColor,
            borderWidth: borderWidth,
            borderColor: borderColor,
          },
          style,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: Spacing.body,
            }}
          >
            <View style={reduxColors.iconStyle}>
              <MaterialCommunityIcons
                name="note-outline"
                size={20}
                color={constThemeColor.onPrimary}
              />
              {/* <SvgXml xml={headingImage} /> */}
            </View>
            <View>
              <Text
                style={[
                  reduxColors.title,
                  {
                    marginLeft: Spacing.small,
                    ...FontSize.Antz_Major_Medium,
                  },
                ]}
              >
                {item?.child_master_type?.parent_observation_type}
              </Text>
            </View>
          </View>
          <View style={[reduxColors.imageView]}>
            {priroty === "Low" ? (
              <SvgXml
                xml={flag_priority_low}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            ) : priroty === "Moderate" ? (
              <SvgXml
                xml={flag_priority_medium}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            ) : priroty === "High" ? (
              <SvgXml
                xml={flag_priority_high}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            ) : priroty === "Critical" ? (
              <SvgXml
                xml={flag_priority_critical}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            ) : (
              ""
            )}
          </View>
        </View>

        <View
          style={{
            paddingLeft: Spacing.minor,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: Spacing.small,
            }}
          >
            {childTypeData?.map((item, index) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    // marginTop: Spacing.small,
                  }}
                  key={index}
                >
                  <View
                    style={{
                      backgroundColor: opacityColor(
                        constThemeColor.neutralPrimary,
                        5
                      ),
                      borderRadius: Spacing.minor,
                      marginRight: Spacing.small,
                      marginVertical: Spacing.mini,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        // backgroundColor: constThemeColor.onPrimary,
                        borderRadius: Spacing.minor,
                        paddingVertical: Spacing.minor,
                      }}
                    >
                      {/* <SvgXml xml={subtypeImage} /> */}
                    </View>
                    <Text
                      style={{
                        ...FontSize.Antz_Small,
                        marginHorizontal: Spacing.small,
                      }}
                    >
                      {item?.type_name}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={reduxColors.subTitleView}>
            <Text style={reduxColors.subTitleText}>Noted by • </Text>
            <Text
              style={[
                reduxColors.title,
                { fontSize: FontSize.Antz_Subtext_title.fontSize },
              ]}
            >
              {/* {item?.created_by} */}
              {LengthDecrease(35, item?.created_by ?? "NA")}
            </Text>
            <Text style={reduxColors.subTitleText}>
              {" "}
              • {timeCalculate(item?.created_at)}
            </Text>
          </View>
          {item?.observation_name ? (
            <View style={{}}>
              <Text
                ref={textRef}
                onTextLayout={handleTextLayout}
                numberOfLines={showMore ? undefined : 5}
                style={reduxColors.secondViewTitleText}
              >
                {item?.observation_name}
              </Text>
              {textLines > 5 && (
                <TouchableOpacity onPress={toggleShowMore}>
                  <Text style={{ color: constThemeColor.secondary }}>
                    {showMore ? "Show less" : "Show more"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
          {/* <View style={reduxColors.attachCount}>
            {images_count?.length > 0 && (
              <Ionicons
                name="attach"
                size={18}
                color={constThemeColor.neutralSecondary}
              />
            )}
            {images_count?.length > 0 && (
              <Text style={reduxColors.docsCount}>
                {images_count?.length === 1
                  ? `${images_count?.length} image`
                  : `${images_count?.length} images`}
              </Text>
            )}
            {images_count?.length > 0 && <Text>, </Text>}
            {documents_count?.length > 0 && (
              <Ionicons
                name="attach"
                size={18}
                color={constThemeColor.neutralSecondary}
              />
            )}
            {documents_count?.length > 0 && (
              <Text style={reduxColors.docsCount}>
                {documents_count?.length === 1
                  ? `${documents_count?.length} document`
                  : `${documents_count?.length} documents`}
              </Text>
            )}
            {audio_count?.length > 0 ? (
              <Ionicons
                name="mic-circle"
                size={18}
                color={constThemeColor.neutralSecondary}
              />
            ) : null}
            {audio_count?.length > 0 && (
              <Text style={reduxColors.docsCount}>
                {audio_count?.length === 1
                  ? `${audio_count?.length} audio`
                  : `${audio_count?.length} audios`}
                {" , "}
              </Text>
            )}
            {video_count?.length > 0 ? (
              <Ionicons
                name="videocam"
                size={18}
                color={constThemeColor.neutralSecondary}
              />
            ) : null}
            {video_count?.length > 0 && (
              <Text
                style={[reduxColors.docsCount, { marginLeft: Spacing.mini }]}
              >
                {video_count?.length === 1
                  ? `${video_count?.length} video`
                  : `${video_count?.length} videos`}
                {" , "}
              </Text>
            )}
          </View> */}
          <View style={[reduxColors.attachCount, { flexWrap: "wrap" }]}>
            {counts?.map((count, i) => {
              return renderAttachmentInfo(
                count.count,
                count.icon_name,
                count.file_type,
                i
              );
            })}
          </View>
        </View>
        <View style={{ padding: Spacing.body }}>
          <Divider />
          {refData?.length > 0 && (
            <View
              style={[
                reduxColors.cardContainer,
                {
                  flexDirection: "row",
                  flex: 1,
                  width: "100%",
                  alignItems: "center",
                },
              ]}
            >
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
          <Divider />
        </View>

        {images_count?.length === 0 ? null : (
          <View>
            <Image
              source={{
                uri: images_count[0]?.file,
              }}
              style={{ width: "100%", height: 400 }}
            />
          </View>
        )}
        <View
          style={{
            backgroundColor: constThemeColor.background,
            paddingHorizontal: Spacing.body,
            marginHorizontal: Spacing.body,
            borderRadius: Spacing.mini,
            marginTop: images_count?.length == 0 ? 0 : Spacing.body,
          }}
        >
          {item?.note?.total_comments ? (
            <View style={reduxColors.commentAndPersonCount}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={reduxColors.commentCount}>
                  {item?.note?.total_comments === 1 ? `Comment` : `Comments`}
                </Text>
                <Text
                  style={[
                    reduxColors.commentCount,
                    {
                      color: constThemeColor.outline,
                      marginLeft: Spacing.small,
                    },
                  ]}
                >
                  {item?.note?.total_comments === 1
                    ? `${item?.note?.total_comments}`
                    : `${item?.note?.total_comments}`}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  paddingTop: Spacing.small,
                }}
              >
                <View
                  style={{
                    backgroundColor: constThemeColor.secondary,
                    borderRadius: 50,
                    height: 36,
                    width: 36,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item?.note?.profile_pic ? (
                    <Image
                      source={{ uri: item?.note?.profile_pic }}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 50,
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
                        {ShortFullName(item?.note?.commented_by)}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{ marginLeft: Spacing.small, width: "88%" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={reduxColors.nameText}>
                      {/* {item?.note?.commented_by} */}
                      {LengthDecrease(30, item?.note?.commented_by ?? "NA")}
                    </Text>
                    <Entypo
                      name="dot-single"
                      size={16}
                      color={opacityColor(constThemeColor.neutralPrimary, 50)}
                    />
                    <Text
                      style={[reduxColors.docsCount, { alignSelf: "flex-end" }]}
                    >
                      {timeCalculate(item?.note?.created_at)}
                    </Text>
                  </View>
                  {item?.note?.observation ? (
                    <View style={{}}>
                      <Text
                        style={{ color: constThemeColor.onSurfaceVariant }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item?.note?.observation}
                      </Text>
                    </View>
                  ) : item?.note?.notes_attachment?.length > 0 ? (
                    <View
                      style={[reduxColors.attachCount, { flexWrap: "wrap" }]}
                    >
                      {countsOfComments?.map((count, i) => {
                        return renderAttachmentNotesInfo(
                          count.count,
                          count.icon_name,
                          count.file_type,
                          i
                        );
                      })}
                    </View>
                  ) : // item?.note?.notes_attachment?.length > 0 ? (
                  //   <View
                  //     style={{
                  //       flexDirection: "row",
                  //       alignItems: "center",
                  //       justifyContent: "space-between",
                  //     }}
                  //   >
                  //     <View style={reduxColors.attachCount}>
                  //       {(Notes_images_count?.length > 0 ||
                  //         Notes_documents_count?.length > 0) && (
                  //         <Ionicons
                  //           name="attach"
                  //           size={18}
                  //           color={constThemeColor.neutralSecondary}
                  //         />
                  //       )}

                  //       {Notes_images_count?.length > 0 && (
                  //         <Text style={reduxColors.docsCount}>
                  //           {Notes_images_count?.length === 1
                  //             ? `${Notes_images_count?.length} image`
                  //             : `${Notes_images_count?.length} images`}
                  //           {Notes_documents_count?.length > 0 ? `,` : null}
                  //         </Text>
                  //       )}
                  //       {Notes_documents_count?.length > 0 && (
                  //         <Text style={reduxColors.docsCount}>
                  //           {Notes_documents_count?.length === 1
                  //             ? `${Notes_documents_count?.length} document`
                  //             : `${Notes_documents_count?.length} documents`}
                  //         </Text>
                  //       )}
                  //     </View>
                  //   </View>
                  // )
                  null}
                </View>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={onPressComment}>
              <View style={[reduxColors.commentAndPersonCount]}>
                <Text style={reduxColors.commentCount}> Comment</Text>
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: Spacing.small,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: constThemeColor.secondary,
                      borderRadius: 50,
                      height: 36,
                      width: 36,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {userDetails.profile_pic ? (
                      <Image
                        source={{ uri: userDetails?.profile_pic }}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 50,
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
                            userDetails?.user_first_name +
                              " " +
                              userDetails?.user_last_name
                          )}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={[reduxColors.histopathologySearchField]}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: constThemeColor.onSurfaceVariant,
                          marginLeft: Spacing.mini,
                          fontSize: FontSize.Antz_Minor_Title.fontSize,
                        }}
                      >
                        Add a comment
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/* <View style={{ paddingHorizontal: 16 }}>
          {hideCommentSection ? null : (
            <>

              {item?.note && (
                <View style={reduxColors.mainCommentView}>
                  <View style={reduxColors.commentView}>
                    <View style={reduxColors.commentPerson}>
                      <View
                        style={{
                          backgroundColor: constThemeColor.surfaceVariant,
                          borderRadius: 50,
                          height: 36,
                          width: 36,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item?.note?.profile_pic ? (
                          <Image
                            source={{ uri: item?.note?.profile_pic }}
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 50,
                            }}
                          />
                        ) : (
                          <Feather
                            name="user"
                            size={20}
                            color={constThemeColor.onSurfaceVariant}
                          />
                        )}
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={reduxColors.nameText}>
                          {item?.note?.commented_by}
                        </Text>

                        {item?.note?.observation ? (
                          <View style={[reduxColors.notesView]}>
                            <Text style={reduxColors.notesText}>
                              {item?.note?.observation}
                            </Text>
                          </View>
                        ) : item?.note?.notes_attachment?.length > 0 ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <View style={reduxColors.attachCount}>
                              {(Notes_images_count?.length > 0 ||
                                Notes_documents_count?.length > 0) && (
                                  <Ionicons
                                    name="attach"
                                    size={18}
                                    color={constThemeColor.neutralSecondary}
                                  />
                                )}

                              {Notes_images_count?.length > 0 && (
                                <Text style={reduxColors.docsCount}>
                                  {Notes_images_count?.length} images
                                  {Notes_documents_count?.length > 0
                                    ? `,`
                                    : null}
                                </Text>
                              )}
                              {Notes_documents_count?.length > 0 && (
                                <Text style={reduxColors.docsCount}>
                                  {Notes_documents_count?.length} documents
                                </Text>
                              )}
                            </View>
                          </View>
                        ) : null}
                        <Text
                          style={[
                            reduxColors.docsCount,
                            { alignSelf: "flex-end" },
                          ]}
                        >
                          {timeCalculate(item?.note?.created_at)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
        </View> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ObservationCard;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      elevation: 1,
      shadowColor: reduxColors.neutralPrimary, // for shadow on iOS
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      backgroundColor: reduxColors.onPrimary,
      borderRadius: 10,
      paddingVertical: 12,
      marginBottom: Spacing.minor
      //marginTop: 16,
    },
    priroty: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    title: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    subTitleView: {
      flexDirection: "row",
      paddingTop: Spacing.small,
    },
    subTitleText: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.neutralSecondary,
    },
    image: {
      height: heightPercentageToDP(5),
      color: reduxColors.onPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
    secondViewTitleText: {
      fontStyle: "normal",
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      color: reduxColors.neutralPrimary,
      width: widthPercentageToDP(80),
      paddingTop: 8,
    },
    attachCount: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 5,
    },
    docsCount: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.neutralSecondary,
    },
    commentAndPersonCount: {
      // flexDirection: "row",
      // justifyContent: "space-between",
      marginVertical: 10,
    },
    PersonCountView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    commentCount: {
      ...FontSize.Antz_Body_Title,
      color: reduxColors.onSecondaryContainer,
    },
    personCount: {
      marginLeft: 2,
      color: reduxColors.onSecondaryContainer,
    },
    mainCommentView: {
      marginTop: 10,
    },

    commentPerson: {
      display: "flex",
      flexDirection: "row",
    },
    nameText: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onPrimaryContainer,
    },
    nameDateTime: {
      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
      color: reduxColors.onTertiaryContainer,
    },
    notesView: {
      backgroundColor: reduxColors.notes,
      marginVertical: 5,
      padding: 10,
      borderRadius: 5,
    },
    notesText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onErrorContainer,
    },
    malechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondaryContainer,
      marginRight: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    femalechip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.errorContainer,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      marginHorizontal: widthPercentageToDP(0.5),
    },
    undeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.displaybgPrimary,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    indeterminedChip: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.indertermineChip,
      marginHorizontal: widthPercentageToDP(0.5),
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
    },
    malechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    undeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    indeterminedText: {
      fontSize: FontSize.Antz_Strong,
      color: reduxColors.onPrimaryContainer,
    },
    cardContainer: {
      // borderWidth: 1,
      // borderColor: reduxColors.whiteSmoke,
      // borderRadius: Spacing.small,
      // // backgroundColor: reduxColors.surface,
      // marginVertical: Spacing.mini,
      // marginHorizontal: Spacing.body,
    },
    iconStyle: {
      height: 30,
      width: 30,
      borderRadius: Spacing.mini,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: reduxColors.onPrimaryContainer,
      marginHorizontal: Spacing.mini,
    },
    histopathologySearchField: {
      color: reduxColors.onSurfaceVariant,
      fontSize: FontSize.Antz_Minor,
      backgroundColor: opacityColor(reduxColors.neutralPrimary, 5),
      width: "84%",
      height: 33,
      borderRadius: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.body,
      marginLeft: 8,
    },
  });
