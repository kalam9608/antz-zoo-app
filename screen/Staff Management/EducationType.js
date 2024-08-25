import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import ListComponent from "../../components/ListComponent";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import FloatingButton from "../../components/FloatingButton";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { ifEmptyValue } from "../../utils/Utils";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { getEducationType } from "../../services/staffManagement/getEducationType";

const EducationType = () => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [educationType, setEducationType] = useState([]);
  const [isLoading, setIsLoding] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoding(true);
      getEducationType()
        .then((res) => {
          setEducationType(res);
        })
        .finally(() => {
          setIsLoding(false);
        });
    });
    return unsubscribe;
  }, [navigation]);

  const InnerList = ({ item }) => {
    const { id, type_name } = item.item;
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Education", {
            type_id: id,
            type_name: type_name,
          })
        }
        style={{ padding: 5 }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text>Id : </Text>
          <Text>{ifEmptyValue(id)}</Text>
        </View>
        <View style={{ flexDirection: "row", width: wp(80) }}>
          <Text>Education Type: </Text>
          <Text>{ifEmptyValue(type_name)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Loader visible={isLoading} />
      <Header noIcon={true} title={"Education Types"} />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        <View style={reduxColors.listSection}>
          <FlatList
            data={educationType}
            renderItem={(item) => (
              <ListComponent item={item}>
                <InnerList item={item} />
              </ListComponent>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
          <FloatingButton
            icon="plus-circle-outline"
            backgroundColor={constThemeColor.flotionBackground}
            borderWidth={0}
            borderColor={constThemeColor.flotionBorder}
            borderRadius={50}
            linkTo=""
            floaterStyle={{ height: 60, width: 60 }}
            onPress={() => navigation.navigate("Education")}
          />
        </View>
      </View>
    </>
  );
};

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 8,
    },
    listSection: {
      flex: 1,
    },
    idNumber: {
      paddingLeft: 2,
    },
  });

export default EducationType;
