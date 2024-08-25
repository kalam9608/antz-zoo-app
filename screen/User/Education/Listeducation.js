import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import {
  deletetEducation,
  getEducation,
} from "../../../services/EducationService";
import ListComponent from "../../../components/ListComponent";
import Loader from "../../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import FloatingButton from "../../../components/FloatingButton";
import Header from "../../../components/Header";

import moment from "moment";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { ifEmptyValue } from "../../../utils/Utils";
import { useSelector } from "react-redux";
import Colors from "../../../configs/Colors";

const Listeducation = (props) => {
  const navigation = useNavigation();
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);
  const [educationDetails, setEducationDetails] = useState([]);
  const [user_id, setuser_id] = useState(
    props.route.params?.item?.user_id ?? 0
  );
  const [isLoading, setIsLoding] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const getData = () => {
    setIsLoding(true);
    getEducation({ user_id })
      .then((res) => {
        setEducationDetails(res.data);
      })
      .finally(() => {
        setIsLoding(false);
      });
  };

  const InnerList = ({ item }) => {
    const {
      education_id,
      user_id,
      education_type_name,
      institution_name,
      year_of_passout,
      course,
      marks,
      created_at,
      modified_at,
    } = item.item;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.innerHeader}>
            <Text>ID:</Text>
            <Text style={styles.idNumber}>{`#${ifEmptyValue(
              education_id
            )}`}</Text>
          </View>
        </View>
        {/* <View style={{ flexDirection: 'row' }}>
          <Text>user id:</Text>
          <Text style={styles.idNumber}>{ifEmptyValue(user_id)}</Text>
        </View> */}
        <View style={{ flexDirection: "row" }}>
          <Text>Education Type:</Text>
          <Text style={styles.idNumber}>{ifEmptyValue(education_type_name)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Institution name : </Text>
          <Text style={styles.idNumber}>{ifEmptyValue(institution_name)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Year of passout:</Text>
          <Text style={styles.idNumber}>{ifEmptyValue(year_of_passout)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Course:</Text>
          <Text style={styles.idNumber}>{ifEmptyValue(course)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>marks:</Text>
          <Text style={styles.idNumber}>{ifEmptyValue(marks) + "%"}</Text>
        </View>
      </View>
    );
  };
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    <>
      <Header noIcon={true} title={"User Educations"} />
          <Loader visible={isLoading} />
          <View
            style={[
              styles.container,
              {
                backgroundColor : constThemeColor.surfaceVariant
              },
            ]}
          >
            <FlatList
              data={educationDetails}
              renderItem={(item) => (
                <ListComponent
                  item={item}
                  onPress={() =>
                    navigation.navigate("CreateEducation", { item: item })
                  }
                >
                  <InnerList item={item} />
                </ListComponent>
              )}
              keyExtractor={(item) => item.id}
            />

            <FloatingButton
              icon="plus-circle-outline"
              backgroundColor="#eeeeee"
              borderWidth={0}
              borderColor="#aaaaaa"
              borderRadius={50}
              linkTo=""
              floaterStyle={{ height: 60, width: 60 }}
              onPress={() =>
                navigation.navigate("CreateEducation", {
                  item: { item: { user_id: user_id } },
                })
              }
            />
          </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: heightPercentageToDP(4),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  innerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  idNumber: {
    marginLeft: 3,
    fontWeight: "500",
  },
  shadow: {
    shadowOffset: {
      height: 10,
      width: 5,
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});

export default Listeducation;
