import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  GetIdProofService,
  deleteIdProof,
} from "../../../services/IdProofService";
import FloatingButton from "../../../components/FloatingButton";
import Loader from "../../../components/Loader";
import Header from "../../../components/Header";
import ListComponent from "../../../components/ListComponent";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import Colors from "../../../configs/Colors";
import { capitalize, ifEmptyValue } from "../../../utils/Utils";
import FontSize from "../../../configs/FontSize";
import { useToast } from "../../../configs/ToastConfig";

const GetIdProof = (props) => {
  const navigation = useNavigation();
  const { successToast, errorToast } = useToast();
  const [idProofData, setIdProofData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user_id, setuser_id] = useState(
    props.route.params?.item?.user_id ?? 0
  );
  const [isDelete, setIsDelete] = useState(false);
  const isSwitchOn = useSelector((state) => state.darkMode.darkMode);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      GetIdProofService({ user_id })
        .then((res) => {
          setIdProofData(res.data);
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

  const RenderItem = (item) => {
    const {
      id,
      user_id,
      id_type,
      id_type_name,
      id_value,
      id_doc,
      status,
      created_at,
      modified_at,
    } = item.item;
    return (
      <>
        <View
          style={[
            styles.listContainer,
            Platform.OS != "ios" ? styles.shadow : null,
          ]}
        >
          <View style={styles.header}>
            <View style={styles.innerHeader}>
              <Text>ID : </Text>
              <Text style={styles.idNumber}>{`#${ifEmptyValue(id)}`}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text>Id Type :</Text>
            <Text style={styles.idNumber}>{ifEmptyValue(id_type_name)}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text>{id_type_name} Number :</Text>
            <Text style={styles.idNumber}>{ifEmptyValue(id_value)}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Image
              style={{
                width: 51,
                height: 51,
                resizeMode: "contain",
                // backgroundColor:'teal',
              }}
              source={{
                uri: id_doc,
              }}
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text>Status : </Text>
            <Text style={styles.idNumber}>
              {capitalize(ifEmptyValue(status))}
            </Text>
          </View>

          {/* <View style={{ flexDirection: "row" }}>
            <Text>Created at : </Text>
            <Text style={styles.idNumber}>{ifEmptyValue(created_at)}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>Modified_at : </Text>
            <Text style={styles.idNumber}>{ifEmptyValue(modified_at)}</Text>
          </View> */}
        </View>
      </>
    );
  };

  const onPressEdit = ({ item }) => {
    navigation.navigate("AddIdProof", { item });
  };

  const onPressDelete = ({ item }) => {
    setIsLoading(true);
    let obj = {
      id: item.experience_id,
    };
    deleteIdProof(obj)
      .then((res) => {
        if (!res.success) {
          errorToast("error","Something went wrong!!");
        } else {
          successToast("success",res.message);
          setIsDelete(true);
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
      <Header noIcon={true} title={"Id Proofs"} />
      <Loader visible={isLoading} />
      <View
        style={[
          styles.container,
          {
            backgroundColor: isSwitchOn
              ? Colors.darkBackground
              : Colors.background,
          },
        ]}
      >
        <View style={styles.listSection}>
          <FlatList
            data={idProofData}
            renderItem={(item) => (
              <ListComponent
                item={item}
                onPressDelete={() => onPressDelete(item)}
                onPressEdit={() => onPressEdit(item)}
              >
                <RenderItem {...item} />
              </ListComponent>
            )}
            keyExtractor={idProofData.id}
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
        onPress={() => navigation.navigate("AddIdProof", { item: { user_id } })}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // padding: 8,
    // paddingTop: 12,
  },
  titleSection: {
    marginTop: 14,
    alignSelf: "center",
  },
  title: {
    fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
    fontWeight: FontSize.Antz_Body_Title.fontWeight,
    paddingVertical: 10,
    color: "#000",
    lineHeight: 22,
  },
  listSection: {
    // backgroundColor:'#ffe',

    marginBottom: heightPercentageToDP(1),
    flex: 1,
    marginTop: 15,
  },
  listContainer: {
    backgroundColor: "#ccc",
    marginVertical: 5,
    borderRadius: 8,
    padding: 5,
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

export default GetIdProof;
