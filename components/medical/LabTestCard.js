import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useFocusEffect, useIsFocused } from "@react-navigation/core";

const LabTestCard = ({ data, removeTests, reOrderedLabTestArray = null }) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);
  const [scrollEnable, setScrollEnable] = useState(true);
  const [key, setKey] = useState(0);
  const isFocused = useIsFocused();
  const labTestDataRef = useRef(data);

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        labTestDataRef.current = data;
        setKey(key + 1);
      }
      return () => {
        labTestDataRef.current = null;
        setKey(0);
      };
    }, [isFocused, data])
  );

  const reOrderedLabTestArrayInner = (index, updatedTests) => {
    // Create a new array of objects
    const newData = [...labTestDataRef?.current];

    // Update the tests array of the specified object
    newData[index] = { ...newData[index], tests: updatedTests };
    labTestDataRef.current = newData;
  };
  const renderItemDrag = ({ item, drag }) => {
    return (
      <>
        {item?.child_tests?.full_test ||
          (item?.child_tests?.filter((v) => v.value == true).length ? (
            <TouchableOpacity onLongPress={drag}>
              <View
                style={{
                  backgroundColor: constThemeColor?.onPrimary,
                  marginVertical: Spacing.mini + Spacing.micro,
                  borderRadius: Spacing.small,
                  borderWidth: 1,
                  borderColor: constThemeColor?.background,
                  padding: Spacing.body,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={[
                      FontSize.Antz_Minor_Title,
                      { color: constThemeColor?.onSurfaceVariant },
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item?.test_name}
                  </Text>
                  <MaterialIcons
                    name="highlight-remove"
                    size={24}
                    color={constThemeColor?.error}
                    onPress={() => {
                      removeTests(item), setKey(key + 1);
                    }}
                  />
                </View>
                {item?.child_tests.length > 0 && !item?.full_test && (
                  <>
                    {item?.child_tests?.map((v) => {
                      return (
                        <>
                          {v?.value && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginVertical: Spacing.mini,
                              }}
                            >
                              <MaterialCommunityIcons
                                name="check"
                                size={24}
                                color={constThemeColor?.primary}
                                style={{
                                  marginRight: Spacing.small,
                                }}
                              />
                              <Text
                                style={[
                                  FontSize.Antz_Minor_Regular,
                                  {
                                    color: constThemeColor?.onTertiaryContainer,
                                    flex: 1,
                                  },
                                ]}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                              >
                                {v?.test_name}
                              </Text>
                            </View>
                          )}
                        </>
                      );
                    })}
                  </>
                )}

                {item?.input_value ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: Spacing.mini,
                    }}
                  >
                    <Text
                      style={[
                        FontSize.Antz_Minor_Regular,
                        {
                          color: constThemeColor?.onTertiaryContainer,
                        },
                      ]}
                    >
                      {item.input_value}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          ) : null)}
      </>
    );
  };

  return (
    <View key={key}>
      {labTestDataRef?.current?.map((item, index) => {
        return (
          <>
            {item?.active && (
              <View
                style={{ paddingHorizontal: Spacing.minor }}
                key={index.toString()}
              >
                <Text
                  style={[
                    FontSize.Antz_Minor_Medium,
                    {
                      color: constThemeColor?.onSurfaceVariant,
                      marginVertical: Spacing.small,
                    },
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item?.sample_name}test
                </Text>
                <DraggableFlatList
                  data={item?.tests ?? []}
                  activationDistance={scrollEnable ? 100 : 1}
                  onDragBegin={() => setScrollEnable(false)}
                  onDragEnd={({ data }) => {
                    if (reOrderedLabTestArray != null)
                      reOrderedLabTestArray(index, data);
                    reOrderedLabTestArrayInner(index, data);
                    setScrollEnable(true);
                  }}
                  keyExtractor={(item) => item?.child_tests[0]?.test_id}
                  renderItem={renderItemDrag}
                />
              </View>
            )}
          </>
        );
      })}
    </View>
  );
};

const style = () => StyleSheet.create({});

export default LabTestCard;
