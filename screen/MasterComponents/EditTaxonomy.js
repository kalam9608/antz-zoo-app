import React, { useState, useRef } from "react";
import { Image } from "expo-image";
import {
  View,
  useWindowDimensions,
  // Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/core";
import { AutoCompleteSearch } from "../../components/AutoCompleteSearch";
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import InputBox from "../../components/InputBox";
import Category from "../../components/DropDownBox";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  bannerUpload,
  deleteBannerImage,
  getBannerImage,
  getVernacularName,
  taxonomyEdit,
} from "../../services/AccessionService";

import { getFileData } from "../../utils/Utils";
import CustomForm from "../../components/CustomForm";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { useEffect } from "react";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import ImageViewer from "../../components/ImageViewer";
// import { errorToast } from "../../utils/Alert";
import SubmitBtn from "../../components/SubmitBtn";
import DynamicAlert from "../../components/DynamicAlert";
import { opacityColor } from "../../utils/Utils";
import SvgUri from "react-native-svg-uri";
import Config from "../../configs/Config";
import { useToast } from "../../configs/ToastConfig";
import { removeDisplayImage } from "../../services/ZooSiteService";
import { handleFilesPick } from "../../utils/UploadFiles";

const EditTaxonomy = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [isLoading, setLoding] = useState(false);
  const [species, setSpecies] = useState(
    props.route.params?.taxonomyName ?? ""
  );
  const [sepciesID, setSpeciesID] = useState(props.route.params?.tsn_id ?? "");

  const [isVernacularMenuOpen, setIsVernacularMenuOpen] = useState(false);
  const [vernacularType, setVernacularType] = useState(
    props.route.params?.default_common_name ?? null
  );
  const [vernacularId, setvernacularId] = useState("");

  const [vernacularName, setvernacularName] = useState(null);
  const [scientificName, setScientificName] = useState(
    props.route.params?.taxonomyName ?? "Scientific Name"
  );

  const [accessionTypeData, setAccessionTypeData] = useState();
  const [image, setImage] = useState([]);

  const [icon, setIcon] = useState(props.route.params?.imgUrl ?? null);

  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();

  // error use state

  const [taxonomyError, setTaxonomyError] = useState(false);
  const [taxonomyErrorMessage, setTaxonomyErrorMessage] = useState(false);
  const [commonNameError, setCommonNameError] = useState(false);
  const [commonNameErrorMessage, setCommonNameErrorMessage] = useState(false);

  const [getBanner, setGetBanner] = useState(false);

  useEffect(() => {
    const url = props.route.params?.imgUrl;
    if (url) {
      const parts = url?.split("/"); // Split the URL into parts using "/" as separator
      const startIndex = parts?.indexOf("uploads") + 1; // Index after "uploads"
      const variableValue = parts?.slice(startIndex).join("/"); // Join the parts starting from startIndex
      let obj = {};
      (obj.type = "image/*"),
        (obj.name = variableValue),
        (obj.uri = props.route.params?.imgUrl);
      setIcon(obj);
    }
  }, []);

  useEffect(() => {
    setLoding(true);
    getBannerImage({ tsn_id: sepciesID })
      .then((res) => {
        let images = res.data.map((el) => ({
          id: el.id,
          url: el.image_url,
        }));
        setImage(images);
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setLoding(false);
      })
      .finally(() => {
        setLoding(false);
      });
  }, [getBanner]);

  const catTaxonomydata = (item) => {
    if (item) {
      setSpecies(item.title);
      handleSubmitFocus(enclRef);
      setSpeciesID(item.taxonomy_id);
      setScientificName(item.scientific_name);
    } else {
      setSpecies(props.route.params?.taxonomyName);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoding(true);
    getVernacularName(sepciesID)
      .then((res) => {
        setAccessionTypeData(
          res.data.map((item) => {
            return {
              id: item.id,
              vern_id: item.vern_id,
              name: item.vernacular_name,
              isSelect: item.vernacular_name == vernacularType ? true : false,
            };
          })
        );
        let filterData = res.data.filter(
          (item) => item.vernacular_name == vernacularType
        );
        setvernacularId(filterData[0]?.id);
        // setvernacularName(filterData[0]?.vernacular_name);
      })

      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setLoding(false);
      })
      .finally(() => {
        setLoding(false);
      });
  };

  const Validation = () => {
    if (!species) {
      setTaxonomyError(true);
      setTaxonomyErrorMessage("Please choose taxonomy");
      return false;
    }

    return true;
  };

  const hideAlert = () => {
    setIsVisible(false);
  };
  const showAlert = () => {
    setIsVisible(true);
  };
  const handleOK = () => {
    setIsVisible(false);
    if (alertType === "success") {
      navigation.goBack();
    }
  };
  const handleCancel = () => {
    navigation.goBack();
    setIsVisible(false);
  };

  const submitRequest = () => {
    if (Validation()) {
      let postData = {
        // "banner_images[]": image,
        // vernacular_name: vernacularName,
        vernacular_id: vernacularId,
        species_image: icon,
        tsn_id: sepciesID,
      };
      if (vernacularName) {
        postData["vernacular_name"] = vernacularName;
      }
      setLoding(true);
      taxonomyEdit(postData)
        .then((res) => {
          if (res?.success) {
            successToast("success", res?.message);
            navigation.goBack();
          } else {
            errorToast("error", res?.message);
          }
        })
        .catch((err) => {
          errorToast("error", "Oops! Something went wrong!");
        })
        .finally(() => {
          setLoding(false);
          setTimeout(() => {
            showAlert();
          }, 500);
        });
    }
  };

  const taxonomyRef = useRef(null);
  const enclRef = useRef(null);
  const accessRef = useRef(null);

  const SetAcsnTypeDropDown = () => {
    setIsVernacularMenuOpen(!isVernacularMenuOpen);
  };
  const handleSubmitFocus = (refs, time) => {};

  const accessPressed = (item) => {
    setIsVernacularMenuOpen(!isVernacularMenuOpen);
    setVernacularType(item.map((value) => value.name).join(","));
    setvernacularId(item.map((value) => value.id).join(","));
  };
  const acsnClose = () => {
    setIsVernacularMenuOpen(false);
  };

  const pickImage = async () => {
    let selectedImages = await handleFilesPick(
      errorToast,
      "image",
      setLoding,
      [],
      true
    );
    if (selectedImages && selectedImages?.length > 0) {
      uploadBannerImage(selectedImages);
    }
  };
  const uploadBannerImage = (banner_image) => {
    setLoding(true);
    const reqObj = {
      tsn_id: sepciesID,
    };
    bannerUpload(reqObj, banner_image)
      .then((res) => {
        if (res.success) {
          successToast("success", res?.message);
          setGetBanner(!getBanner);
        } else {
          errorToast("error", res?.message);
        }
      })
      .catch((err) => {
        errorToast("error", "Oops! Something went wrong!");
        setLoding(false);
      })
      .finally(() => setLoding(false));
  };

  const pickIcon = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 1,
    // });

    // if (!result.canceled) {
    //   setIcon(getFileData(result.assets[0]));
    // }
    let img=await handleFilesPick(errorToast, "image", setLoding, [], false)
    if (img&&img?.length>0) {
      setIcon(img[0]);
    }
  };

  const imageClose = (url) => {
    setLoding(true);

    deleteBannerImage({ id: url?.id })
      .then((res) => {
        if (res.success) {
          successToast("success", res?.message);
          setGetBanner(!getBanner);
        } else {
          errorToast("error", res?.message);
        }
      })
      .catch((err) => {
        setLoding(false);
      })
      .finally(() => {
        setLoding(false);
      });
  };

  // svg image check
  const [isSvg, setIsSvg] = useState(false);

  const checkUrl = (url) => {
    if (typeof url !== "string") {
      const type = ["svg"];

      const value = url?.uri?.split(".");

      //get the extension part
      const extension = value[value?.length - 1];

      if (type.includes(extension) == 1) {
        return true;
      }
    }
  };

  useEffect(() => {
    const is_svg = checkUrl(
      icon ?? Config.BASE_APP_URL + "assets/class_images/default_animal.svg"
    );
    setIsSvg(is_svg);
  }, [icon]);

  return (
    <>
      <Loader visible={isLoading} />
      <CustomForm header={false} onPress={submitRequest}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "transparent",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={constThemeColor.shadow}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 10,
              color: constThemeColor.onSurFace,
              fontSize: FontSize.Antz_Major_Regular.fontSize,
              fontWeight: FontSize.Antz_Major_Regular.fontWeight,
            }}
          >
            Edit Species
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
          }}
        >
          <AutoCompleteSearch
            refs={taxonomyRef}
            placeholder="Enter atleast 3 charecter to search..."
            label="Choose Taxonomy"
            value={species}
            onPress={catTaxonomydata}
            errors={!species ? taxonomyErrorMessage : false}
            isError={!species ? taxonomyError : false}
            type="master"
            showClear={false}
            edit={false}
          />

          <View style={reduxColors.iconStyle}>
            {icon ? (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    pickIcon();
                  }}
                  style={[reduxColors.iconImage]}
                >
                  {isSvg ? (
                    <SvgUri
                      width="75"
                      height="75"
                      style={reduxColors.iconImage}
                      source={{
                        uri: icon.uri ? icon.uri : icon,
                      }}
                    />
                  ) : (
                    <Image
                      style={reduxColors.iconImage}
                      source={{ uri: icon.uri ? icon.uri : icon }}
                      // placeholder={blurhash}
                      contentFit="scale-down"
                      transition={300}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    pickIcon();
                  }}
                >
                  <Text style={reduxColors.iconImageText}>
                    Edit Display Picture{" "}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    pickIcon();
                  }}
                  style={[reduxColors.iconImage]}
                >
                  <MaterialIcons
                    name="add-photo-alternate"
                    size={72}
                    color={constThemeColor.onPrimary}
                  />
                </TouchableOpacity>
                <Text style={reduxColors.iconImageText}>
                  Add Display Picture{" "}
                </Text>
              </View>
            )}
          </View>

          <View style={{ marginTop: 20, marginBottom: 8 }}>
            <Text style={reduxColors.labelTitle}>Scientific Name</Text>
            <View style={reduxColors.viewBox}>
              <Text style={reduxColors.viewBoxText}>{scientificName}</Text>
            </View>
          </View>

          <Text style={reduxColors.labelTitle}>Common Names</Text>

          <InputBox
            inputLabel={"Choose Vernacular Name"}
            placeholder={"Choose Vernacular Name"}
            refs={accessRef}
            editable={false}
            rightElement={isVernacularMenuOpen ? "menu-up" : "menu-down"}
            value={vernacularType}
            DropDown={SetAcsnTypeDropDown}
            onFocus={SetAcsnTypeDropDown}
            errors={
              !vernacularId && !vernacularName ? commonNameErrorMessage : null
            }
            isError={!vernacularId && !vernacularName ? commonNameError : null}
          />

          <Text
            style={{
              alignSelf: "center",
              fontSize: FontSize.Antz_Minor_Regular.fontSize,
              fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
              color: constThemeColor.neutralPrimary,
              marginVertical: 5,
            }}
          >
            or{" "}
          </Text>
          <InputBox
            inputLabel={"Enter Common Name"}
            placeholder={"Enter Common Name"}
            value={vernacularName}
            onChange={(val) => setvernacularName(val)}
            errors={!vernacularName ? commonNameErrorMessage : null}
            isError={!vernacularName ? commonNameError : null}
          />
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            {/* <Text
              style={{
                fontSize: FontSize.Antz_Body_Regular.fontSize,
                color: constThemeColor.onSurface,
                fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                marginTop: 5,
              }}
            >
              + Add another Common name{" "}
            </Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickImage()}
            style={reduxColors.galleryImage}
          >
            <MaterialIcons
              name="add-photo-alternate"
              size={24}
              color={constThemeColor.onPrimary}
            />
            <Text style={reduxColors.galleryImgText}>Add gallery Images</Text>
          </TouchableOpacity>

          <View
            style={
              {
                // marginVertical: heightPercentageToDP(1)
              }
            }
          >
            <Text style={reduxColors.imageNotifications}>
              Add images in JPG or PNG format only. Preferable dimension of the
              image is 2000 width x 1250 height or higher
            </Text>
            <ImageViewer data={image} imageClose={imageClose} />
          </View>
        </View>
      </CustomForm>
      {isVernacularMenuOpen ? (
        <View>
          <Modal
            animationType="fade"
            visible={isVernacularMenuOpen}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={acsnClose}
          >
            <Category
              categoryData={accessionTypeData}
              onCatPress={accessPressed}
              heading={"Choose Common Name"}
              isMulti={false}
              onClose={acsnClose}
            />
          </Modal>
        </View>
      ) : null}
      {/* <DynamicAlert
        isVisible={isVisible}
        onClose={hideAlert}
        type={alertType}
        title={alertType === "success" ? "Success" : "Error"}
        message={alertMessage}
        onOK={handleOK}
        onCancel={handleCancel}
      /> */}
    </>
  );
};

export default EditTaxonomy;

const styles = (reduxColors) =>
  StyleSheet.create({
    iconStyle: {
      justifyContent: "space-between",
      marginTop: 20,
      alignItems: "center",
      alignSelf: "center",
    },
    imgNameStyle: {
      borderWidth: wp(0.225),
      borderColor: reduxColors.outlineVariant,
      minHeight: heightPercentageToDP(4.5),
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    viewBox: {
      backgroundColor: reduxColors.background,
      justifyContent: "center",
      height: 50,
      borderRadius: 4,
      marginTop: Spacing.body,
      marginBottom: Spacing.body,
    },
    viewBoxText: {
      color: reduxColors.onSecondaryContainer,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      marginLeft: Spacing.minor,
    },
    iconImage: {
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: reduxColors.displaybgPrimary,
      width: 124,
      height: 124,
      borderRadius: 62,
    },
    iconImageText: {
      alignSelf: "center",
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.primary,
      marginTop: Spacing.body,
    },
    labelTitle: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      marginLeft: Spacing.small,
    },
    galleryImage: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: reduxColors.secondary,
      marginTop: 25,
      height: 50,
      borderRadius: 4,
    },
    galleryImgText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onPrimary,
      paddingLeft: Spacing.minor,
    },
    imageName: {
      fontSize: FontSize.Antz_Small.fontSize,
      fontWeight: FontSize.Antz_Small.fontWeight,
      color: reduxColors.onSurfaceVariant,
    },
    imageNotifications: {
      fontSize: FontSize.Antz_Small.fontSize,
      fontWeight: FontSize.Antz_Small.fontWeight,
      color: reduxColors.outline,
      marginTop: Spacing.body,
    },
    buttonContainer: {
      width: "100%",
      paddingHorizontal: Spacing.body,
      paddingBottom: Spacing.body,
      backgroundColor: reduxColors.onPrimary,
    },
    button: {
      backgroundColor: reduxColors.onPrimaryContainer,
      justifyContent: "center",
      alignItems: "center",
      marginTop: Spacing.body,
      height: 50,
      borderRadius: 4,
    },
    buttonText: {
      fontSize: FontSize.Antz_Major_Title_btn.fontSize,
      fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
      color: reduxColors.onPrimary,
    },
  });
