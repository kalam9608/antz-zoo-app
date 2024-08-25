import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Accordion from "../../components/medical/Accordion/accordion";
import Spacing from "../../configs/Spacing";
import { useSelector } from "react-redux";
import { Searchbar } from "react-native-paper";
import { FlatList } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import MedicalSearchFooter from "../../components/MedicalSearchFooter";
import Loader from "../../components/Loader";

const LabTestSearch = (props) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  const [searchInput, setSearchInput] = useState("");
  const [filterData, setfilterData] = useState([]);
  const [data, setData] = useState(props.route.params?.listData ?? []);
  const [selectCount, setSelectCount] = useState(0);
  const [toggleSelectedList, setToggleSelectedList] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [Loading, setLoading] = useState(false);

  /**
   * Filter data
   */
  const searchFilterData = (text) => {
    setSearchInput(text);
    setLoading(true);
    const filteredData = props.route.params?.listData
      .map((sample) => {
        // Check if the sample_name includes the search text
        const sampleNameMatches = sample.sample_name
          .toLowerCase()
          .includes(text.toLowerCase());

        // Filter child tests based on test_name or child_test_name
        const filteredTests = sample.tests.filter((test) => {
          const testMatches = test.test_name
            .toLowerCase()
            .includes(text.toLowerCase());
          const childTestMatches = test.child_tests.some((childTest) =>
            childTest.test_name.toLowerCase().includes(text.toLowerCase())
          );

          return testMatches || childTestMatches;
        });

        // If either sample_name or child tests match the search criteria, return the sample with filtered tests
        if (sampleNameMatches || filteredTests.length > 0) {
          return {
            ...sample,
            tests: filteredTests,
          };
        }
        // Otherwise, return null to indicate no match
        return null;
      })
      .filter(Boolean); // Remove null entries

    setfilterData(filteredData);
    setLoading(false);
  };

  const back = () => {
    props.route.params?.onGoBack(data);
    props.navigation.goBack();
  };

  const clearSearch = () => {
    setSearchInput("");
  };

  const updatedData = (v) => {
    const result = [];
    let arr = data.map((i) => {
      if (i?.sample_id === v?.sample_id) {
        // Update the sample data if the sample_id matches
        return {
          ...i,
          ...v,
        };
      } else {
        return {
          ...i,
        };
      }
    });

    // Iterate through the updated data to count and extract child tests
    for (const sample of arr) {
      for (const test of sample?.tests) {
        for (const childTest of test?.child_tests) {
          if (childTest?.value === true) {
            result?.push({
              id: childTest?.test_id,
              name: childTest?.test_name,
            });
          }
        }
      }
    }
    setData(arr);
    setSelectCount(result?.length);
    setSelectedItems(result);
  };
  useEffect(() => {}, [filterData, searchInput]);

  return (
    <>
      <View style={styles.container}>
        <Loader visible={Loading} />
        <Searchbar
          accessible={true}
          accessibilityLabel={"labTestSearch"}
          AccessibilityId={"labTestSearch"}
          placeholder={`Search ${props.route.params?.name}`}
          placeholderTextColor={constThemeColor.mediumGrey}
          defaultValue={props.route.params?.itemName}
          onChangeText={(e) => searchFilterData(e)}
          value={searchInput}
          inputStyle={styles.input}
          style={[
            styles.Searchbar,
            { backgroundColor: constThemeColor.onPrimary },
          ]}
          icon={({ size, color }) => (
            <Ionicons
              name="arrow-back"
              size={24}
              color
              style={{
                color: constThemeColor.onSecondaryContainer,
              }}
              onPress={() => props.navigation.goBack()}
            />
          )}
          right={() => (
            <>
              <View style={{ paddingRight: Spacing.small }}>
                {searchInput ? (
                  <View>
                    <Entypo
                      name="cross"
                      size={30}
                      color={constThemeColor.mediumGrey}
                      onPress={clearSearch}
                    />
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </>
          )}
        />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={filterData.length && searchInput.length > 0 ? filterData : data}
          contentContainerStyle={{ paddingBottom: 85 }}
          style={{ flex: 1, marginHorizontal: Spacing.minor }}
          keyExtractor={(item, index) => index?.toString()}
          renderItem={({ item }) => {
            return (
              <View style={{ marginTop: Spacing.small }}>
                <Accordion
                  item={item}
                  updatedData={updatedData}
                  sampleFullTestShow={
                    props.route.params?.page === "AddLab" ? true : false
                  }
                />
              </View>
            );
          }}
        />
        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <MedicalSearchFooter
            title={props.route.params?.name}
            selectCount={selectCount}
            toggleSelectedList={toggleSelectedList}
            onPress={back}
            selectedItems={selectedItems}
          />
        </View>
      </View>
    </>
  );
};

const style = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: reduxColors.surfaceVariant,
    },
    Searchbar: {
      borderRadius: 0,
      borderBottomWidth: 1,
      borderColor: reduxColors.lightGrey,
      width: "100%",
    },
  });

export default LabTestSearch;
