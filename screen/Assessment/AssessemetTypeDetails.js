import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { getAssessmentTypeDetails } from "../../services/assessmentService/AssessmentServiceApi";
import Loader from "../../components/Loader";
import { useToast } from "../../configs/ToastConfig";
import Header from "../../components/Header";

const AssessemetTypeDetails = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const navigation = useNavigation();
  const assessmentTypeId = props?.route?.params?.assessmentId;
  const [isLoading, setIsLoading] = useState(false);
  const { showToast, errorToast } = useToast();
  const [assessmentDetails, setAssessmentDetails] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    getAssessmentTypeDetailsData();
  }, []);
  const getAssessmentTypeDetailsData = () => {
    const obj = {
      assessment_type_id: assessmentTypeId,
    };
    getAssessmentTypeDetails(obj)
      .then((res) => {
        if (res.success) {
          setAssessmentDetails(res?.data);
        } else {
          navigation.goBack();
          errorToast("", "Oops!! No data found!!");
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const { response_type, default_values } = assessmentDetails;
  return (
    <View style={{ flex: 1, backgroundColor: constThemeColor.onPrimary }}>
      <Loader visible={isLoading} />
      <Header
        noIcon={true}
        showBackButton={true}
        title={"Assessment Type"}
        backgroundColor={(backgroundColor = constThemeColor.onPrimary)}
        arrowColor={false}
        hideMenu={true}
        editIconCheck={assessmentDetails?.already_in_use == false ? true :false}
        editButtonPress={() =>
          navigation.navigate("AddAssessmentType", {
            assessmentDetails: assessmentDetails,
            editAssessmentTypeCheck: "Edit",
          })
        }
        customBack={()=>navigation.navigate("Assessment")}
      />
          <ScrollView showsVerticalScrollIndicator={false}>
      <View style={reduxColors.detailsContainer}>
        {assessmentDetails?.active == 1 ? (
          <View style={reduxColors.activeContainer}>
            <Text style={reduxColors.activeText}>
              {assessmentDetails?.active == 1 ? "Active" : "InActive"}
            </Text>
          </View>
        ) : null}
        <Text style={reduxColors.assessmentName}>
          {assessmentDetails?.assessments_type_label}
        </Text>
        <View style={reduxColors.categoryCont}>
          <Text style={reduxColors.categoryText}>Category</Text>
          <Text style={reduxColors.category}>{assessmentDetails?.label}</Text>
        </View>
        {assessmentDetails?.description == "" ? null : (
          <View style={[reduxColors.categoryCont, { marginTop: 0 }]}>
            <Text style={reduxColors.categoryText}>Description</Text>
            <Text style={reduxColors.category}>
              {assessmentDetails?.description}
            </Text>
          </View>
        )}

        <View style={[reduxColors.categoryCont, { marginTop: 0 }]}>
          <Text style={reduxColors.categoryText}>Response Type</Text>
          <Text style={reduxColors.category}>
            {assessmentDetails?.response_type_label}
          </Text>

          {response_type == "list" ? (
            <View>
              {default_values?.map((item, index) => (
                <View style={reduxColors.responseTypeContainer}>
                  <Text style={reduxColors.responseDetails}>{item?.label}</Text>
                </View>
              ))}
            </View>
          ) : response_type == "numeric_scale" ? (
            <View>
              {default_values?.map((item, index) => (
                <View
                  style={[
                    reduxColors.responseTypeContainer,
                    { flexDirection: "row", alignItems: "center" },
                  ]}
                >
                  <Text style={reduxColors.responseDetails}>{item.order}.</Text>
                  <Text
                    style={[
                      reduxColors.responseDetails,
                      { marginLeft: Spacing.body },
                    ]}
                  >
                    {item?.label}
                  </Text>
                </View>
              ))}
            </View>
          ) : response_type == "numeric_value" ? (
            <View style={reduxColors.responseTypeContainer}>
              <Text style={reduxColors.responseDetails}>
                {assessmentDetails?.measurement_type_label}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      </ScrollView>
      <View style={reduxColors.bottomTempDetailsContainer}>
        <Text style={reduxColors.bottomTempText}>Used in Templates</Text>
        <Text style={reduxColors.bottomTempText}>
          {assessmentDetails?.template_count}
        </Text>
      </View>
    
    </View>
  );
};

export default AssessemetTypeDetails;

const styles = (reduxColors) =>
  StyleSheet.create({
    detailsContainer: {
      padding: Spacing.minor,
      paddingTop: Spacing.small,
    },
    activeContainer: {
      backgroundColor: reduxColors.secondary,
      height: 24,
      width: 53,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Spacing.mini,
    },
    activeText: {
      ...FontSize.Antz_Subtext_Medium,
    },
    assessmentName: {
      ...FontSize.Antz_Major_Medium,
    },
    categoryCont: {
      marginVertical: Spacing.small + 2,
    },
    category: {
      ...FontSize.Antz_Minor_Regular,
    },
    categoryText: {
      color: reduxColors.onSurfaceVariant,
      ...FontSize.Antz_Body_Regular,
      paddingVertical: Spacing.mini - 2,
    },
    responseTypeContainer: {
      backgroundColor: reduxColors.background,
      padding: Spacing.small,
      marginVertical: Spacing.small,
      borderRadius: Spacing.small - 2,
    },
    responseDetails: {
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.onSurfaceVariant,
    },
    bottomTempDetailsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      height: 80,
      position: "absolute",
      bottom: 0,
      backgroundColor: reduxColors.displaybgPrimary,
      paddingHorizontal: Spacing.minor,
    },
    bottomTempText: {
      ...FontSize.Antz_Minor_Regular,
      color: reduxColors.on_Surface,
    },
  });
