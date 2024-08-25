import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Header from "../../../components/Header";
import {
  getExperience,
  deleteExperience,
} from "../../../services/ExperienceService";
import ListComponent from "../../../components/ListComponent";
import FloatingButton from "../../../components/FloatingButton";
import Loader from "../../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import Colors from "../../../configs/Colors";
import { dateFormatter, ifEmptyValue } from "../../../utils/Utils";
import Spacing from "../../../configs/Spacing";
import { useToast } from "../../../configs/ToastConfig";

const GetExperience = (props) => {
  const user = props.route.params?.item;
  const [expData, setExpData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const navigation = useNavigation();
  const { successToast, errorToast,  } = useToast();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      getExperience({ user_id: user.user_id })
        .then((res) => {
          setExpData(res.data);
        })
        .catch((err) => {
          errorToast("error","Oops! Something went wrong!!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
    return unsubscribe;
  }, [navigation]);

  const InnerComponent = ({ item }) => {
    const {
      experience_id,
      total_work_experience,
      modified_at,
      join_date,
      institution_name,
      institution_location,
      industry,
      end_date,
      designation,
      created_at,
    } = item.item;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <Text>Id:</Text>
          <Text style={styles.idNumber}>#{ifEmptyValue(experience_id)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Institute Name:</Text>
          <Text style={styles.idNumber}>{ifEmptyValue(institution_name)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Institute Location:</Text>
          <Text style={styles.idNumber}>
            {ifEmptyValue(institution_location)}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Work Exp.:</Text>
          <Text style={styles.idNumber}>
            {ifEmptyValue(total_work_experience)}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Industry:</Text>
          <Text style={styles.idNumber}>{ifEmptyValue(industry)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Designation:</Text>
          <Text style={styles.idNumber}>{ifEmptyValue(designation)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Join Date:</Text>
          <Text style={styles.idNumber}>
            {join_date == "0000-00-00" ? "NA" : dateFormatter(join_date)}
          </Text>
        </View>
        {/* <View style={{ flexDirection: 'row' }}>
                    <Text>Create Date:</Text>
                    <Text style={styles.idNumber}>{created_at}</Text>
                </View> */}
        <View style={{ flexDirection: "row" }}>
          <Text>End Date:</Text>
          <Text style={styles.idNumber}>
            {end_date == "0000-00-00" ? "NA" : dateFormatter(end_date)}
          </Text>
        </View>
      </View>
    );
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    <>
      <Header noIcon={true} title={"Work Experiences"} />
      <Loader visible={isLoading} />
      <View
        style={[
          styles.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        <View style={styles.listSection}>
          <FlatList
            data={expData}
            renderItem={(item) => (
              <ListComponent
                item={item}
                onPress={() =>
                  navigation.navigate("AddExperience", { item: item.item })
                }
              >
                <InnerComponent item={item} />
              </ListComponent>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <FloatingButton
        icon="plus-circle-outline"
        backgroundColor="#eeeeee"
        borderWidth={0}
        borderColor="#aaaaaa"
        borderRadius={50}
        linkTo=""
        floaterStyle={{ height: 60, width: 60 }}
        onPress={() =>
          navigation.navigate("AddExperience", {
            item: { user_id: user.user_id },
          })
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: Spacing.small,
    paddingBottom: Spacing.small,
  },
  listSection: {
    flex: 1,
    marginBottom: heightPercentageToDP(4),
  },
  idNumber: {
    marginLeft: 5,
    fontWeight: "500",
  },
});

export default GetExperience;
