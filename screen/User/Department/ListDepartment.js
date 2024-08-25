import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import ListComponent from "../../../components/ListComponent";
import Loader from "../../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import FloatingButton from "../../../components/FloatingButton";
import Header from "../../../components/Header";
import {
  deleteUserDepartment,
  getUserDepartment,
} from "../../../services/UserDepartmentService";
import { useSelector } from "react-redux";
import { useToast } from "../../../configs/ToastConfig";

const ListDepartment = () => {
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  const navigation = useNavigation();
  const [userDept, setuserDept] = useState([]);
  const [isLoading, setIsLoding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getRefreshData();
    });
    return unsubscribe;
  }, [navigation]);

  const getRefreshData = () => {
    setRefreshing(true);
    setIsLoding(true);
    getUserDepartment()
      .then((res) => {
        setuserDept(res.data);
      })
      .finally(() => {
        setRefreshing(false);
        setIsLoding(false);
      });
  };

  const editDept = (item) => {
    navigation.navigate("AddDepartment", {
      item: item,
    });
  };

  const deleteDept = (item) => {
    setIsLoding(true);
    let obj = {
      id: item.id,
    };
    deleteUserDepartment(obj)
      .then((res) => {
        if (!res.success) {
          errorToast("error","Oops! Something went wrong!!");
        } else {
          successToast("success","Deleted Successfully");
        }
      })
      .catch((err) => {
        errorToast("error","Oops! Something went wrong!!");
      })
      .finally(() => {
        setIsLoding(false);
      });
  };

  const InnerList = ({ item }) => {
    const { department_id, dept_name, created_at, dept_code } = item.item;
    return (
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <View style={styles.innerHeader}>
            <Text>ID:</Text>
            <Text style={styles.idNumber}>{`#${department_id}`}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Name:</Text>
          <Text style={styles.idNumber}>{dept_name}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Dept Code:</Text>
          <Text style={styles.idNumber}>{dept_code}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>Created at:</Text>
          <Text style={styles.idNumber}>{created_at}</Text>
        </View>
      </View>
    );
  };

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);

  return (
    <View style={{ flex: 1, backgroundColor: constThemeColor.onPrimary }}>
      <Header noIcon={true} title={"User Department"} />
      <View style={{ flex: 1 }}>
        {isLoading || refreshing ? (
          <Loader />
        ) : (
          <View style={styles.container}>
            <FlatList
              data={userDept}
              renderItem={(item) => (
                <ListComponent
                  item={item}
                  onPressEdit={editDept}
                  onPressDelete={deleteDept}
                  onPress={() =>
                    navigation.navigate("GetuserDept", { itemId: item.item.id })
                  }
                >
                  <InnerList item={item} />
                </ListComponent>
              )}
              keyExtractor={(item) => item.id}
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
              onPress={() => navigation.navigate("AddDepartment")}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    paddingHorizontal: 10,
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
    marginLeft: 5,
    fontWeight: "500",
  },
  shadow: {
    shadowOffset: {
      height: 10,
      width: 5,
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 1,
    // backgroundColor:'rgba(0,0,0,0.2)'
  },
});

export default ListDepartment;
