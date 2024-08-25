// Name : ganesh aher
// Date : 23.5.23
// Works: design and API implimentation

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

import Loader from "../../components/Loader";
import Header from "../../components/Header";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../configs/Colors";
import { useSelector } from "react-redux";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { GetDetailesSection } from "../../services/CreateSectionServices";
import { ifEmptyValue } from "../../utils/Utils";
import ListEmpty from "../../components/ListEmpty";
import FontSize from "../../configs/FontSize";
import Spacing from "../../configs/Spacing";
import { useToast } from "../../configs/ToastConfig";

const { width, height } = Dimensions.get("window");

const moreOptionData = [
  { id: 1, option: "Edit Section", screen: "EditSection" },
];

const SectionDetails = ({ route }) => {
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const navigation = useNavigation();
  const [loading, setLoding] = useState(false);

  const [sectiondata, setSectionData] = useState(null);
  const [sectionMessage, setSectionMessage] = useState("");

  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      let { section_id } = route.params;
      let requestObj = {
        zoo_id: zooID,
        section_id,
      };

      setLoding(true);
      GetDetailesSection(requestObj)
        .then((res) => {
          setSectionData(res.success ? res.data : null);
          setSectionMessage(res.message);
        })
        .finally(() => {
          setLoding(false);
        })
        .catch((err) => {
          errorToast("error","Oops! Something went wrong!!");
        });
    });
    return unsubscribe;
  }, [navigation]);

  const chooseOption = (item) => {
    if (sectiondata) {
      navigation.navigate(item.screen, { section: sectiondata });
    }
  };

  return (
    <>
      <Header
        title="Section Details"
        noIcon={true}
        optionData={moreOptionData}
        optionPress={chooseOption}
      />
      <Loader visible={loading} />
      <View
        style={[
          styles.container,
          { backgroundColor: isSwitchOn ? "#1F415B" : "#DAE7DF" },
        ]}
      >
        {sectiondata ? (
          <View>
            <View style={[styles.innerContainer]}>
              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Id:</Text>
                <Text>{`#${ifEmptyValue(sectiondata.section_id)}`}</Text>
              </View>

              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Site Name :</Text>
                <Text>{ifEmptyValue(sectiondata.site_name)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Section Name:</Text>
                <Text>{ifEmptyValue(sectiondata.section_name)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Enclosures:</Text>
                <Text>{ifEmptyValue(sectiondata.total_enclosures)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Animals :</Text>
                <Text>{ifEmptyValue(sectiondata.total_animals)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={{ marginHorizontal: 5 }}>Species :</Text>
                <Text>{ifEmptyValue(sectiondata.total_species)}</Text>
              </View>
            </View>
          </View>
        ) : (
          <ListEmpty visible={loading} label={sectionMessage} />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  innerContainer: {
    backgroundColor: "rgba(100,100,100,0.2)",
    alignItems: "center",
    padding: Spacing.small,
    marginVertical: 20,
    marginHorizontal: "10%",
    width: width * 0.9,
    height: height * 0.5,
    justifyContent: "space-evenly",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",

    width: width * 0.8,
    justifyContent: "space-between",
  },
  buttonContainer: {
    width: "100%",
    padding: 10,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.mediumGrey,
    marginTop: 10,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: FontSize.Antz_Body_Regular.fontSize,
  },
});

export default SectionDetails;
