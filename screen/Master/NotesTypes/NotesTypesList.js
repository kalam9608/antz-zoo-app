import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../../configs/Colors";
import { useSelector } from "react-redux";
import FontSize from "../../../configs/FontSize";
import FloatingButton from "../../../components/FloatingButton";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import ListEmpty from "../../../components/ListEmpty";
import Loader from "../../../components/Loader";
import { getOrganization } from "../../../services/Organization";
import { ifEmptyValue } from "../../../utils/Utils";
import CustomCard from "../../../components/CustomCard";
import { capitalize } from "../../../utils/Utils";
import moment from "moment";
import Spacing from "../../../configs/Spacing";
import { useToast } from "../../../configs/ToastConfig";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { getObservationListforAdd } from "../../../services/ObservationService";

const NotesTypesList = () => {
  const [notesList, setNotesList] = useState([]);
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      getNotesList();
    });
    return unsubscribe;
  }, [navigation]);
  const getNotesList = () => {
    getObservationListforAdd({ type: "parent" })
      .then((v) => {
        const transformedData = v.data.map((item) => {
          return { id: item.id, isSelect: false, name: item.type_name };
        });
        setNotesList(transformedData);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        showToast("error", "Oops! Something went wrong!!");
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: constThemeColor.surfaceVariant }}>
      <Header noIcon={true} title={"Note Types"} />
      <Loader visible={isLoading} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={notesList}
        contentContainerStyle={{
          paddingBottom: 50,
          paddingHorizontal: Spacing.minor,
        }}
        renderItem={({ item }) => {
          return (
            <CustomCard
              title={capitalize(item?.name)}
              onPress={() =>
                navigation.navigate("SubTypesList", { parent_note: item })
              }
            />
          );
        }}
        ListEmptyComponent={<ListEmpty visible={isLoading} />}
      />
      <FloatingButton
        icon="plus-circle-outline"
        backgroundColor={Colors.backgroundColorinList}
        borderWidth={0}
        borderColor={Colors.borderColorinListStaff}
        borderRadius={50}
        linkTo=""
        floaterStyle={{ height: 60, width: 60 }}
        onPress={() => navigation.navigate("AddNotesType")}
      />
    </View>
  );
};

export default NotesTypesList;
const styles = (reduxColors) =>
  StyleSheet.create({
    roleWrap: {
      width: 40,
      height: 40,
      borderRadius: 100,
      backgroundColor: reduxColors.secondary,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    roleTitle: {
      fontSize: FontSize?.Antz_Body_Regular?.fontSize,
      width: widthPercentageToDP(90),
    },
    roleAddBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.backgroundColorAnimalCard,
      padding: 7,
      borderRadius: 5,
    },
  });
