import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import ImageComponent from "../../components/ImageComponent";
import { opacityColor } from "../../utils/Utils";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import HeaderWithSearch from "../../components/HeaderWithSearch";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import ListEmpty from "../../components/ListEmpty";
import MedicalListCard from "../../components/MedicalListCard";
import {
  getMedicalRecordCount,
  getMedicalRecordList,
} from "../../services/medicalRecord";
import { useToast } from "../../configs/ToastConfig";
import Config from "../../configs/Config";
import CommonSpeciesCard from "../../components/CommonSpeciesCard";
import MedicalStatsCommonFilterComponent from "../../components/medical_record/MedicalStatsCommonFilterComponent";

const SpeciesLabTestAnimalsList = (props) => {
  const { showToast, successToast, errorToast, alertToast, warningToast } =
    useToast();
  const navigation = useNavigation();
  const permission = useSelector((state) => state.UserAuth.permission);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = style(constThemeColor);

  const [Loading, setLoading] = useState(false);
  const [screenType, setScreenType] = useState("Active");
  const [labTestCount, setLabTestCount] = useState(
    props?.route?.params?.total_test ?? 0
  );

  // for Lab Test
  const [labTestAnimals, setLabTestAnimals] = useState([]);
  const [labTestAnimalsLength, setLabTestAnimalsLength] = useState(0);
  const [labTestAnimalsCount, setLabTestAnimalsCount] = useState(0);
  const [labPage, setLabPage] = useState(0);

  //Toggle tab
  const toggleTab = (data) => {
    setScreenType(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setLabPage(1);
      fetchLabTestAnimalsData(1);

      return () => {
        // Clean up the effect when the screen is unfocused (if necessary)
      };
    }, [navigation, screenType])
  );

  const fetchLabTestAnimalsData = (pageNo) => {
    let obj = {
      medical: "lab",
      ref_id: props?.route?.params?.test_id,
      ref_type: "medical_record",
      species_id: props?.route?.params?.species_id,
      page_no: pageNo,
    };
    getMedicalRecordList(obj)
      .then((res) => {
        if (res?.success) {
          let arrData = pageNo == 1 ? [] : labTestAnimals;

          setLabTestAnimalsCount(
            res?.data?.count == undefined ? 0 : res?.data?.count
          );
          if (res?.data) {
            if (res?.data?.result) {
              arrData = arrData.concat(res?.data?.result);
            }
            setLabTestAnimals(arrData);
            setLabTestAnimalsLength(arrData?.length);

            setLoading(false);
          }
        } else {
          setLabTestAnimalsLength(labTestAnimalsCount);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        errorToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (
      !Loading &&
      labTestAnimalsLength >= 10 &&
      labTestAnimalsLength !== labTestAnimalsCount
    ) {
      const nextPage = labPage + 1;
      setLabPage(nextPage);
      fetchLabTestAnimalsData(nextPage);
    }
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (
      Loading ||
      labTestAnimalsLength == 0 ||
      labTestAnimalsLength < 10 ||
      labTestAnimalsLength == labTestAnimalsCount
    )
      return null;
    return <ActivityIndicator style={{ color: constThemeColor.primary }} />;
  };

  return (
    <View style={reduxColors.container}>
      <HeaderWithSearch
        noIcon={true}
        title={"Lab Tests"}
        search={false}
        titlePaddingHorizontal={Spacing.mini}
        backgroundColor={constThemeColor?.secondaryContainer}
      />
      <Loader visible={Loading} />
      <View style={reduxColors.body}>
        <CommonSpeciesCard
          icon={props?.route?.params?.icon}
          SpeciesName={props?.route?.params?.SpeciesName}
          complete_name={props?.route?.params?.complete_name}
        />
        {/* date filter */}

        <MedicalStatsCommonFilterComponent
          screenType={screenType}
          leftTitle={"Active"}
          // rightTitle={"By Tests"}
          onTogglePress={(e)=>{console.log("============|||======>>")}}
          leftStatsCount={labTestCount ?? "0"}
          // rightStatsCount={"0"}
          isDateFilter={false} // if you wants to date filter then pass to all bottom props
        />

        <View
          style={{
            flex: 1,
            paddingHorizontal: Spacing.micro,
            marginTop: Spacing.small,
          }}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            data={labTestAnimals}
            renderItem={({ item }) => <MedicalListCard item={item} />}
            keyExtractor={(i, index) => index.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={<ListEmpty height={"50%"} visible={Loading} />}
          />
        </View>
      </View>
    </View>
  );
};

export default SpeciesLabTestAnimalsList;

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors?.secondaryContainer,
    },
    body: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
    },
    statsCard: {
      backgroundColor: reduxColors.surface,
      borderRadius: Spacing.small + Spacing.mini,
      paddingTop: Spacing.minor,
      paddingHorizontal: Spacing.major,
      // marginVertical: Spacing.minor,
    },
    countStyle: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColors.onTertiaryContainer,
      textAlign: "center",
    },
    countText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors.onErrorContainer,
      marginBottom: Spacing.small,
      textAlign: "center",
    },
    speciesCard: {
      backgroundColor: opacityColor(reduxColors.surfaceDisabled, 10),
      flexDirection: "row",
      borderWidth: 1,
      borderColor: opacityColor(reduxColors?.outlineVariant, 5),
      borderRadius: Spacing.small,
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.minor,
      marginTop: Spacing.minor,
    },
  });
