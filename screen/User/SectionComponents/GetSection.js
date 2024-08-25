import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import FloatingButton from "../../../components/FloatingButton";
import Loader from "../../../components/Loader";
import Header from "../../../components/Header";
import { useNavigation } from "@react-navigation/native";
import {
  GetSectionData,
  deleteSectionData,
} from "../../../services/AllSectionApis";
import ListComponent from "../../../components/ListComponent";
import Spacing from "../../../configs/Spacing";
import { useToast } from "../../../configs/ToastConfig";

const GetSection = () => {
  const { successToast, errorToast, } = useToast();
  const [sectionData, setSectionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getRefreshData();
    });
    return unsubscribe;
  }, [navigation]);

  const getRefreshData = () => {
    setRefreshing(true);
    setIsLoading(true);
    GetSectionData()
      .then((res) => {
        setSectionData(res.data);
      })
      .catch((err) => {
        errorToast("error","Oops! Something went wrong!!");
      })
      .finally(() => {
        setRefreshing(false);
        setIsLoading(false);
      });
  };

  const InnerComponent = ({ item }) => {
    const {
      section_id,
      section_name,
      section_image,
      user_id,
      full_access,
      active,
      created_at,
      modified_at,
    } = item.item;
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <Text>Section Id:</Text>
          <Text style={styles.idNumber}>{section_id}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Section Name:</Text>
          <Text style={styles.idNumber}>{section_name}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Section Image:</Text>
          <Text style={styles.idNumber}>{section_image}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>User Id:</Text>
          <Text style={styles.idNumber}>{user_id}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Full Access :</Text>
          <Text style={styles.idNumber}>{full_access}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Active :</Text>
          <Text style={styles.idNumber}>{active}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Created_at:</Text>
          <Text style={styles.idNumber}>{created_at}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Modified_at:</Text>
          <Text style={styles.idNumber}>{modified_at}</Text>
        </View>
      </View>
    );
  };

  const EditSectionData = ({ item }) => {
    navigation.navigate("UserCreateSection", { item });
  };

  const deleteSection = (item) => {
    setIsLoading(true);
    let obj = {
      id: item,
    };
    deleteSectionData(obj)
      .then((res) => {
        if (!res.success) {
          errorToast("error","Something went wrong!!");
        } else {
          successToast("success","Deleted Successfully");
        }
      })
      .catch((err) => {
        errorToast("error","Oops! Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading || refreshing ? (
        <Loader loaderSize={"lg"} />
      ) : (
        <View style={styles.container}>
          <Header noIcon={true} title={"User Section"} />
          <View style={styles.listSection}>
            <FlatList
              data={sectionData}
              renderItem={(item) => (
                <ListComponent
                  item={item}
                  onPressDelete={(item) => deleteSection(item)}
                  onPressEdit={() => EditSectionData(item)}
                >
                  <InnerComponent item={item} />
                </ListComponent>
              )}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={getRefreshData}
                />
              }
            />

            <FloatingButton
              icon="plus-circle-outline"
              backgroundColor="#eeeeee"
              borderWidth={0}
              borderColor="#aaaaaa"
              borderRadius={50}
              linkTo=""
              floaterStyle={{ height: 60, width: 60 }}
              onPress={() => navigation.navigate("UserCreateSection")}
            />
          </View>
        </View>
      )}
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
  },
});

export default GetSection;
