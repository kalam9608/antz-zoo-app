import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
} from "react-native";
import Colors from "../../configs/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CheckBox from "../../components/CheckBox";
import { Searchbar } from "react-native-paper";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import MedicalSearchFooter from "../../components/MedicalSearchFooter";
import { useSelector } from "react-redux";
import FontSize from "../../configs/FontSize";
import { GetOrganList } from "../../services/NecropcyService";
import Loader from "../../components/Loader";
import { errorToast } from "../../utils/Alert";
import { useToast } from "../../configs/ToastConfig";

const AddOrganSelection = (props) => {
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [selectedCheckedBox, setSelectedCheckBox] = useState(
    props.route.params?.extraData?.selectedCheckedBox
      ? props.route.params?.extraData?.selectedCheckedBox
      : []
  );
  const [selectedItems, setSelectedItems] = useState(
    props.route.params?.data ? props.route.params?.data : []
  );
  const [selectCount, setSelectCount] = useState(
    props.route.params?.extraData?.selectCount
      ? props.route.params?.extraData?.selectCount
      : 0
  );
  const [selectedOrganIds, setSelectedOrganIds] = useState(
    props.route.params?.extraData?.selectedOrganIds
      ? props.route.params?.extraData?.selectedOrganIds
      : []
  );
  const [selectedPartIds, setSelectedPartIds] = useState(
    props.route.params?.extraData?.selectedPartIds
      ? props.route.params?.extraData?.selectedPartIds
      : []
  );
  const [selectedParts, setSelectedParts] = useState(
    props.route.params?.extraData?.selectedParts
      ? props.route.params?.extraData?.selectedParts
      : []
  );
  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [searchInput, setSearchInput] = useState("");
  const { showToast } = useToast();

  // Step 2: Create a function to filter the data based on search input
  const searchFilterData = (text) => {
    setSearchInput(text);
    if (text.length === 0) {
      getOrgansData();
    } else if (text.length >= 3) {
      setLoading(true);
      const filteredData = data.map((item) => {
        return {
          ...item,
          parts: item.parts.filter(
            (part) =>
              part.label.toLowerCase().includes(text.toLowerCase()) ||
              part.string_id.toLowerCase().includes(text.toLowerCase())
          ),
        };
      });
      const filteredOrgans = filteredData.filter(
        (item) => item.parts.length > 0
      );
      setData(filteredOrgans);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getOrgansData();
  }, []);
  const getOrgansData = () => {
    var obj = {
      zoo_id: zooID,
    };

    GetOrganList(obj)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        showToast("error", "Oops! Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const selectAction = (parts, item) => {
    if (selectedCheckedBox.includes(parts.id)) {
      setSelectedCheckBox(
        selectedCheckedBox.filter((item) => item !== parts.id)
      );
      setSelectedPartIds(selectedPartIds.filter((item) => item !== parts.id));

      const index = selectedItems.findIndex(
        (e) => e.string_id === item.string_id
      );
      if (index !== -1) {
        const updatedParts = selectedItems[index]?.parts.filter(
          (e) => e.id !== parts.id
        );
        setSelectedItems((prevSelectedItems) => {
          const updatedItems = [...prevSelectedItems];
          if (updatedParts.length === 0) {
            updatedItems.splice(index, 1);
            setSelectedOrganIds((prevSelectedOrganIds) =>
              prevSelectedOrganIds.filter((id) => id !== item.id)
            );
          } else {
            updatedItems[index] = {
              ...selectedItems[index],
              parts: updatedParts,
            };
          }
          const updatedSelectedParts = updatedItems.reduce(
            (partsArr, item) => partsArr.concat(item.parts),
            []
          );
          setSelectedParts(updatedSelectedParts);
          setSelectCount(updatedSelectedParts.length);
          return updatedItems;
        });
      }
    } else {
      if (selectedOrganIds.includes(item.id)) {
        setSelectedCheckBox([...selectedCheckedBox, parts.id]);
        setSelectedPartIds([...selectedPartIds, parts.id]);

        setSelectedItems((prevSelectedItems) => {
          const index = prevSelectedItems.findIndex(
            (e) => e.string_id === item.string_id
          );
          if (index !== -1) {
            const partsObj = {
              id: parts.id,
              label: parts.label,
              body_section_id: parts.body_section_id,
              string_id: parts.string_id,
              description: parts.description,
            };
            const updatedItems = [...prevSelectedItems];
            updatedItems[index] = {
              ...prevSelectedItems[index],
              parts: [...prevSelectedItems[index]?.parts, partsObj],
            };
            const updatedSelectedParts = updatedItems.reduce(
              (partsArr, item) => partsArr.concat(item.parts),
              []
            );
            setSelectedParts(updatedSelectedParts);
            setSelectCount(updatedSelectedParts.length);
            return updatedItems;
          }
          return prevSelectedItems;
        });
      } else {
        setSelectedCheckBox([...selectedCheckedBox, parts.id]);
        setSelectedPartIds([...selectedPartIds, parts.id]);
        setSelectedOrganIds([...selectedOrganIds, item.id]);

        let partsObj = {
          id: parts.id,
          label: parts.label,
          body_section_id: parts.body_section_id,
          string_id: parts.string_id,
          description: parts.description,
        };

        setSelectedItems((prevSelectedItems) => {
          const updatedItems = [
            ...prevSelectedItems,
            {
              ...("id" && { ["id"]: item.id }),
              ...("description" && { ["description"]: item.description }),
              ...("label" && { ["label"]: item.label }),
              ...("string_id" && { ["string_id"]: item.string_id }),
              ...("parts" && { ["parts"]: [partsObj] }),
            },
          ];
          const updatedSelectedParts = updatedItems.reduce(
            (partsArr, item) => partsArr.concat(item.parts),
            []
          );
          setSelectedParts(updatedSelectedParts);
          setSelectCount(updatedSelectedParts.length);
          return updatedItems;
        });
      }
    }
  };
  const back = () => {
    props.route.params?.onGoBack(selectedItems),
      props.route.params?.saveExtraData({
        selectCount: selectCount,
        selectedOrganIds: selectedOrganIds,
        selectedPartIds: selectedPartIds,
        selectedCheckedBox: selectedCheckedBox,
        selectedParts: selectedParts,
      });
    props.navigation.goBack();
  };
  const renderItem = ({ item }) => (
    <View>
      <Text
        style={[
          reduxColors.searchItemName,
          {
            fontSize: FontSize.Antz_Body_Title.fontSize,
            fontWeight: FontSize.Antz_Body_Title.fontWeight,
            color: constThemeColor.outline,
            marginLeft: 10,
            marginTop: 10,
            marginBottom: 5,
          },
        ]}
      >
        {item.label}
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={item.parts}
        renderItem={({ item: parts }) => (
          <View style={reduxColors.searchItemList}>
            <Text
              style={{
                fontSize: FontSize.Antz_Minor_Title.fontSize,
                fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                color: constThemeColor.onSurfaceVariant,
              }}
            >
              {parts?.label}
            </Text>
            <TouchableOpacity>
              <CheckBox
                activeOpacity={1}
                iconSize={18}
                checkedColor={constThemeColor?.green}
                checked={selectedCheckedBox.includes(parts?.id)}
                uncheckedColor={constThemeColor.onPrimary}
                onPress={() => selectAction(parts, item)}
                labelStyle={[reduxColors.labelName, reduxColors.mb0]}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(parts, index) => `parts-${index}`}
      />
    </View>
  );
  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={constThemeColor.onPrimary}
      />
      <Loader visible={Loading} />
      <View style={reduxColors.container}>
        <View>
          <Searchbar
            placeholder={`Search`}
            placeholderTextColor={constThemeColor?.mediumGrey}
            onChangeText={searchFilterData} // Step 3: Handle search input change
            value={searchInput} // Step 3: Set the search input value
            inputStyle={reduxColors.input}
            style={[
              reduxColors.Searchbar,
              { backgroundColor: constThemeColor.onPrimary },
            ]}
            autoFocus={true}
            icon={({ size, color }) => (
              <Ionicons
                name="arrow-back"
                size={24}
                color
                style={{
                  color: constThemeColor.onSecondaryContainer,
                }}
                onPress={() => navigation.goBack()}
              />
            )}
          />
        </View>

        {/* Search List */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `label-${index}`}
        />

        {/* Footer */}

        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <MedicalSearchFooter
            title="Organ"
            selectCount={selectCount}
            toggleSelectedList={"false"}
            onPress={back}
            selectedItems={selectedParts}
          />
        </View>
      </View>
    </>
  );
};

export default AddOrganSelection;
const windowHeight = Dimensions.get("screen").height;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: reduxColors.surfaceVariant,
      position: "relative",
    },
    Searchbar: {
      width: widthPercentageToDP(100),
      borderRadius: 0,
      borderBottomWidth: 1,
      borderColor: reduxColors.lightGreyHexa,
    },

    searchItemList: {
      height: heightPercentageToDP(6),
      width: widthPercentageToDP(90),
      marginBottom: heightPercentageToDP(1),
      borderRadius: 5,
      paddingHorizontal: 10,
      backgroundColor: reduxColors.onPrimary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 5,
    },
    labelName: {
      color: reduxColors.textColor,
      fontSize: FontSize.Antz_Strong,
    },
    searchItemName: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      color: reduxColors.neutralPrimary,
    },
  });
