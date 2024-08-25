// Created by Ashutosh Raj ---> 25-04-023

import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/Header";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { useEffect } from "react";
import { postAnimalEnclosure } from "../../services/AnimalEnclosureService";
import { useState } from "react";
import CustomCard from "../../components/CustomCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import Loader from "../../components/Loader";
import FontSize from "../../configs/FontSize";
import { useSelector } from "react-redux";
import { checkPermissionAndNavigateWithAccess } from "../../utils/Utils";
import { useToast } from "../../configs/ToastConfig";

const AnimalEnclosure = () => {
  const [animalData, setAnimalData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const permission = useSelector((state) => state.UserAuth.permission);

  const route = useRoute();
  const { successToast, errorToast, alertToast, warningToast } = useToast();

  useEffect(() => {
    setLoading(true);
    postAnimalEnclosure({
      enclosure_id: route.params.item?.enclosure_id,
    })
      .then((res) => {
        setAnimalData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        errorToast("error","Oops! Something went wrong!");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return (
    <View style={reduxColors.container}>
      <View>
        <Header title="Animal in Enclosure" noIcon={true} />
        {Loading ? (
          <Loader visible={Loading} />
        ) : (
          <ScrollView
            style={{ backgroundColor: constThemeColor.surfaceVariant }}
            showsVerticalScrollIndicator={false}
          >
            {animalData.length > 0 ? (
              <>
                {animalData.map((item) => {
                  return (
                    <View style={{ marginHorizontal: 14 }}>
                      <CustomCard
                        title={item.complete_name}
                        onPress={() =>
                          checkPermissionAndNavigateWithAccess(
                            permission,
                            "collection_animal_record_access",
                            navigation,
                            "AnimalsDetails",
                            {
                              animal_id: item.animal_id,
                            },
                            "VIEW"
                          )
                        }
                        chips={
                          <View style={reduxColors.tagMainCont}>
                            <View
                              style={
                                item.sex == "male"
                                  ? [
                                      reduxColors.tagsContainer,
                                      {
                                        backgroundColor:
                                          constThemeColor.surfaceVariant,
                                      },
                                    ]
                                  : item.sex == "female"
                                  ? [
                                      reduxColors.tagsContainer,
                                      {
                                        backgroundColor:
                                          constThemeColor.secondary,
                                      },
                                    ]
                                  : {}
                              }
                              onStartShouldSetResponder={() => true}
                            >
                              <View
                                reduxColors={
                                  item.sex == "male"
                                    ? reduxColors.malechipM
                                    : item.sex == "female"
                                    ? reduxColors.femalechipF
                                    : {}
                                }
                              >
                                <Text
                                  style={
                                    item.sex == "male"
                                      ? reduxColors.malechipText
                                      : item.sex == "female"
                                      ? reduxColors.femalechipText
                                      : {}
                                  }
                                >
                                  {item.sex == "male"
                                    ? `M`
                                    : item.sex == "female"
                                    ? `F`
                                    : null}
                                </Text>
                              </View>
                            </View>
                          </View>
                        }
                        subtitle={
                          "Animal Id: " +
                          item.animal_id +
                          "\n" +
                          "Enclosure Id: " +
                          item.enclosure_id
                        }
                        rightIcon={
                          <View
                            style={{
                              marginHorizontal: widthPercentageToDP(10),
                              marginVertical: widthPercentageToDP(6.5),
                            }}
                          >
                            <AntDesign
                              name="right"
                              size={14}
                              color={constThemeColor.neutralPrimary}
                            />
                          </View>
                        }
                      />
                    </View>
                  );
                })}
              </>
            ) : (
              <>
                <View style={reduxColors.noData}>
                  <Text>No Data</Text>
                </View>
              </>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default AnimalEnclosure;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: "14%",
    },
    noData: {
      height: heightPercentageToDP(94),
      justifyContent: "center",
      alignItems: "center",
    },
    tagMainCont: {
      marginLeft: 3,
    },
    tagsContainer: {
      flexDirection: "row",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginHorizontal: 5,
      fontWeight: FontSize.weight500,
    },

    malechipM: {
      backgroundColor: reduxColors.surfaceVariant,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      marginHorizontal: 5,
      fontWeight: FontSize.weight700,
    },
    femalechipF: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: reduxColors.secondary,
      fontWeight: FontSize.weight500,
      marginLeft: 5,
    },
    malechipText: {
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      color: reduxColors.onPrimaryContainer,
    },
    femalechipText: {
      fontSize: FontSize.Antz_Standerd,
      color: reduxColors.onPrimaryContainer,
    },
  });
