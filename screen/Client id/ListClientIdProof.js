import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { listIdProof } from "../../services/ClientService";
import ListComponent from "../../components/ListComponent";
import Loader from "../../components/Loader";
import { useNavigation } from "@react-navigation/native";
import FloatingButton from "../../components/FloatingButton";
import Header from "../../components/Header";
import { heightPercentageToDP } from "react-native-responsive-screen";
import FontSize from "../../configs/FontSize";
import { useSelector } from "react-redux";
import { ifEmptyValue } from "../../utils/Utils";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Spacing from "../../configs/Spacing";
import DragDrop from "../../components/DragDrop";
import ListEmpty from "../../components/ListEmpty";

const ListClientIdProof = () => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [clientIdProof, setClientIdProof] = useState([]);
  const [isLoading, setIsLoding] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoding(true);
      listIdProof()
        .then((res) => {
          setClientIdProof(res);
        })
        .finally(() => {
          setIsLoding(false);
        });
    });
    return unsubscribe;
  }, [navigation]);

  const InnerList = ({ item }) => {
    const { id, id_name, required } = item.item;
    return (
      <View style={{ padding: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <Text>Id : </Text>
          <Text>{ifEmptyValue(id)}</Text>
        </View>
        <View style={{ flexDirection: "row", width: wp(80) }}>
          <Text>ID Type: </Text>
          <Text>{ifEmptyValue(id_name)}</Text>
        </View>
        <View style={{ flexDirection: "row", width: wp(70) }}>
          <Text>Required: </Text>
          <Text>{required == 1 ? "Yes" : "No"}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Loader visible={isLoading} />
      <Header noIcon={true} title={"Id Proof Types"} />
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
            data={clientIdProof}
            renderItem={(item) => (
              <ListComponent item={item}>
                <InnerList item={item} />
              </ListComponent>
            )}
            ListEmptyComponent={<ListEmpty visible={isLoading} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
          {/* <DragDrop> */}
          <FloatingButton
            icon="plus-circle-outline"
            backgroundColor={constThemeColor.flotionBackground}
            borderWidth={0}
            borderColor={constThemeColor.flotionBorder}
            borderRadius={50}
            linkTo=""
            floaterStyle={{ height: 60, width: 60 }}
            onPress={() => navigation.navigate("ClientIdproof")}
          />
          {/* </DragDrop> */}
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

export default ListClientIdProof;
