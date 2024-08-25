import React, { useState, useRef } from "react";
import {
  View,
  useWindowDimensions,
  Image,
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
  widthPercentageToDP,
} from "react-native-responsive-screen";
import InputBox from "../../components/InputBox";
import Category from "../../components/DropDownBox";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  createTaxonomy,
  listVernacularType,
} from "../../services/AccessionService";

import { getFileData } from "../../utils/Utils";
import CustomForm from "../../components/CustomForm";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import BottomSheetModalStyles from "../../configs/BottomSheetModalStyles";
import SubmitBtn from "../../components/SubmitBtn";
import DynamicAlert from "../../components/DynamicAlert";
import { useToast } from "../../configs/ToastConfig";
import { handleFilesPick } from "../../utils/UploadFiles";

const Taxonomy = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const stylesSheet =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);

  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [isLoading, setLoding] = useState(false);
  const [species, setSpecies] = useState(props.route.params?.tsn ?? "");
  const [sepciesID, setSpeciesID] = useState(props.route.params?.tsn_id ?? "");

  const [isVernacularMenuOpen, setIsVernacularMenuOpen] = useState(false);
  const [vernacularType, setVernacularType] = useState(null);
  const [vernacularId, setvernacularId] = useState("");

  const [vernacularName, setvernacularName] = useState(null);
  const [scientificName, setScientificName] = useState("Scientific Name");

  const [accessionTypeData, setAccessionTypeData] = useState([]);
  const [image, setImage] = useState([]);

  const [icon, setIcon] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const [isError, setIsError] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { showToast, successToast, errorToast, alertToast, warningToast } = useToast();

  // error use state

  const [taxonomyError, setTaxonomyError] = useState(false);
  const [taxonomyErrorMessage, setTaxonomyErrorMessage] = useState(false);
  const [commonNameError, setCommonNameError] = useState(false);
  const [commonNameErrorMessage, setCommonNameErrorMessage] = useState(false);

  //this is  function Taxonomay dropDwon Filed
  const catTaxonomydata = (item) => {
    if (item) {
      setSpecies(item.title);
      handleSubmitFocus(enclRef);
      getData(item.taxonomy_id);
      setSpeciesID(item.taxonomy_id);
      setScientificName(item.scientific_name);
    } else {
      setSpecies(false);
    }
  };

  const getData = (id) => {
    setLoding(true);
    let requestObj = {
      tsn: id,
    };
    listVernacularType(requestObj)
      .then((res) => {
        setAccessionTypeData(
          res.data.map((item) => ({
            id: item.vern_id,
            name: item.vernacular_name,
          }))
        );
      })
      .catch((err) => {
        errorToast("error","Oops! Something went wrong!");
      })
      .finally(() => {
        setLoding(false);
      });
  };
  // validation
  const Validation = () => {
    if (!species) {
      setTaxonomyError(true);
      setTaxonomyErrorMessage("Please choose taxonomy");
      return false;
    }

    if (!(vernacularId || vernacularName)) {
      setCommonNameError(true);
      setCommonNameErrorMessage("Please select this one *");
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
        tsn_id: sepciesID,
        vernacular_id: vernacularId,
        vernacular_name: vernacularName,
        species_image: icon,
        zoo_id: zooID,
      };
      setLoding(true);
      createTaxonomy(postData, image)
        .then((res) => {
          if (res?.success) {
            successToast("success",res?.message);
            navigation.goBack();
          } else {
            errorToast("error",res?.message);
          }
        })
        .catch((err) => {
          errorToast("error","Oops! Something went wrong!");
        })
        .finally(() => {
          // showAlert();
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
  const handleSubmitFocus = (refs, time) => { };

  const accessPressed = (item) => {
    setIsVernacularMenuOpen(!isVernacularMenuOpen);
    setVernacularType(item.map((value) => value.name).join(","));
    setvernacularId(item.map((value) => value.id).join(","));
    setvernacularName(null);
  };
  const acsnClose = () => {
    setIsVernacularMenuOpen(false);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   // allowsEditing: true,
    //   // aspect: [4, 3],
    //   // quality: 1,
    //   allowsMultipleSelection: true,  // Enable multi-selection
    // });

    // if (!result.canceled) {
    //   const selectedImages = result.assets.map((asset) => getFileData(asset));
    //   setImage([...image, ...selectedImages]);
    // }
      let selectedImages = await handleFilesPick(errorToast, "image", setLoding,image, true)
      if (selectedImages&&selectedImages?.length>0) {
        setImage(selectedImages);
      }
  };

  const pickIcon = async () => {
    // No permissions request is necessary for launching the image library
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 1,
    // });

    // if (!result.canceled) {
    //   setIcon(getFileData(result.assets[0]));
    // }
    let selectedImages = await handleFilesPick(errorToast, "image", setLoding,[], false)
    if (selectedImages&&selectedImages?.length>0) {
      setIcon(selectedImages[0]);
    }
  };

  const imageClose = (url) => {
    let newIndex = image.findIndex((value) => url.uri === value.uri);
    const newValue = image.splice(newIndex, 1);

    const filterValue = image.filter((item) => item.uri !== newValue.uri);
    setImage(filterValue);
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader visible={isLoading} />
      <CustomForm header={false} onPress={submitRequest}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "transparent",
            alignItems: "center",
            // marginTop: Platform.OS === "ios" ? -26 : wp("-7%"),
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
              // fontSize: wp("6%"),
              // marginTop: wp("0%"),
              // marginLeft: wp("2%"),

              marginLeft: 10,
              color: constThemeColor.onSurFace,
              fontSize: FontSize.Antz_Major_Regular.fontSize,
              fontWeight: FontSize.Antz_Major_Regular.fontWeight,
            }}
          >
            Add New Species
          </Text>
        </View>

        <View
          style={{
            // marginTop: heightPercentageToDP(2),
            // paddingHorizontal: widthPercentageToDP(0.5),
            marginTop: 20,
          }}
        >
          <AutoCompleteSearch
            refs={taxonomyRef}
            placeholder="Enter atleast 3 characters to search..."
            label="Choose Taxonomy"
            value={species}
            onPress={catTaxonomydata}
            errors={!species ? taxonomyErrorMessage : false}
            isError={!species ? taxonomyError : false}
            type="master"
          />
          <View style={reduxColors.iconStyle}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  pickIcon();
                }}
                style={[reduxColors.iconImage]}
              >
                {icon === null ? (
                  <MaterialIcons
                    name="add-photo-alternate"
                    // size={wp(16)}
                    size={72}
                    color={constThemeColor.onPrimary}
                  />
                ) : (
                  <Image
                    source={{ uri: icon.uri }}
                    style={reduxColors.iconImage}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  pickIcon();
                }}>

                <Text style={reduxColors.iconImageText}>
                  {icon === null
                    ? "Add Display Picture"
                    : "Change Display Picture"}
                </Text>
              </TouchableOpacity>

            </View>
          </View>

          <View
            style={{
              // marginVertical: heightPercentageToDP(2)
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            <Text style={reduxColors.labelTitle}>Scientific Name</Text>
            <View style={reduxColors.viewBox}>
              <Text style={reduxColors.viewBoxText}>{scientificName}</Text>
            </View>
          </View>

          <Text style={reduxColors.labelTitle}>Common Names</Text>
          {accessionTypeData?.length !== 0 && (
            <>
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
                  !vernacularId && !vernacularName
                    ? commonNameErrorMessage
                    : null
                }
                isError={
                  !vernacularId && !vernacularName ? commonNameError : null
                }
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
            </>
          )}

          <InputBox
            inputLabel={"Enter Common Name"}
            placeholder={"Enter Common Name"}
            value={vernacularName}
            onChange={(val) => setvernacularName(val)}
            errors={!vernacularName ? commonNameErrorMessage : null}
            isError={!vernacularName ? commonNameError : null}
          />
          <TouchableOpacity
            // onPress={() => }
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

          {/* images */}
          <TouchableOpacity
            onPress={() => pickImage()}
            style={reduxColors.galleryImage}
          >
            <MaterialIcons
              name="add-photo-alternate"
              // size={wp(6.5)}
              size={24}
              color={constThemeColor.onPrimary}
            />
            <Text style={reduxColors.galleryImgText}> Add gallery Images</Text>
          </TouchableOpacity>

          <View
            style={
              {
                // marginVertical: heightPercentageToDP(1)
                // backgroundColor: "red",
              }
            }
          >
            <Text style={reduxColors.imageNotifications}>
              Add images in JPG or PNG format only. Preferable dimension of the
              image is 2000 width x 1250 height or higher
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                // marginTop: widthPercentageToDP(2),
                marginVertical: 14,
                columnGap: 6,
                rowGap: 12,
              }}
            >
              {image.map((url) => (
                <View
                  style={{
                    // margin: widthPercentageToDP(1),
                    // backgroundColor: "green",
                    width: "49%",
                  }}
                >
                  <Image
                    source={{ uri: url.uri }}
                    style={{
                      // width: widthPercentageToDP("40%"),
                      // height: heightPercentageToDP("15%"),
                      width: "100%",
                      height: 150,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                  <View style={reduxColors.imgNameStyle}>
                    <Text style={reduxColors.imageName}>
                      {url.name.slice(-12)}
                    </Text>
                    <TouchableOpacity onPress={() => imageClose(url)}>
                      <Entypo
                        name="cross"
                        // size={wp(5.5)}
                        size={20}
                        color={constThemeColor.onSurfaceVariant}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </CustomForm>
      {isVernacularMenuOpen && species ? (
        <View>
          <Modal
            animationType="fade"
            // transparent={true}
            // deviceWidth={width}
            visible={isVernacularMenuOpen}
            // style={{
            //   margin: 0,
            //   justifyContent: "flex-end",
            //   height: widthPercentageToDP(4),
            // }}
            style={stylesSheet.bottomSheetStyle}
            onBackdropPress={acsnClose}
          >
            <Category
              categoryData={accessionTypeData}
              onCatPress={accessPressed}
              heading={"Choose Common Name"}
              isMulti={true}
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
        // isCancelButton={alertType === "success" ? true : false}
        onCancel={handleCancel}
      /> */}
    </View>
  );
};

export default Taxonomy;

const styles = (reduxColors) =>
  StyleSheet.create({
    iconStyle: {
      justifyContent: "space-between",
      // marginTop: heightPercentageToDP(1),
      marginTop: 20,
      justifyContent: "center",
      alignItems: "center",
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
      // minHeight: heightPercentageToDP(8),
      backgroundColor: reduxColors.background,
      justifyContent: "center",
      // borderRadius: heightPercentageToDP(1.5),
      // marginTop: heightPercentageToDP(2),

      height: 50,
      borderRadius: 4,
      marginTop: 10,
      marginBottom: 10,
    },
    viewBoxText: {
      color: reduxColors.onSecondaryContainer,
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      // marginLeft: widthPercentageToDP(4),
      marginLeft: Spacing.minor,
    },
    buttonContainer: {
      width: "100%",
      paddingHorizontal: Spacing.body,
      paddingBottom: Spacing.body,
      backgroundColor: reduxColors.onPrimary,
    },
    iconImage: {
      // borderRadius: wp("50%"),
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      // width: wp("30%"),
      // height: wp("30%"),
      // marginTop: wp("3%"),
      backgroundColor: reduxColors.secondary,

      width: 124,
      height: 124,
      borderRadius: 62,
    },
    iconImageText: {
      alignSelf: "center",
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      color: reduxColors.primary,
      // marginTop: wp("2%"),
      marginTop: 10,
    },
    labelTitle: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      // marginLeft: heightPercentageToDP(1),
      marginLeft: 8,
    },
    galleryImage: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      // borderRadius: wp("3%"),
      // width: wp("85%"),
      // minHeight: wp("15%"),
      // marginTop: wp(5),
      backgroundColor: reduxColors.secondary,

      marginTop: 25,
      height: 50,
      borderRadius: 4,
    },
    galleryImgText: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onPrimary,
      // paddingLeft: wp(3),
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
      // paddingHorizontal: widthPercentageToDP(1.5),
      marginTop: 10,
    },
    button: {
      // width: wp("85%"),
      backgroundColor: reduxColors.onPrimaryContainer,
      // marginTop: wp("4%"),
      // minHeight: wp("15%"),
      // borderRadius: wp("3%"),
      justifyContent: "center",
      alignItems: "center",

      marginTop: 20,
      height: 50,
      borderRadius: 4,
    },
    buttonText: {
      fontSize: FontSize.Antz_Major_Title_btn.fontSize,
      fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
      color: reduxColors.onPrimary,
    },
  });
