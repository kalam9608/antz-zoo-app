import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { getSpeciesData } from "../../services/ZooSiteService";
import List from "./component/List";
import Loader from "../../components/Loader";
import ListEmpty from "../../components/ListEmpty";
import { capitalize, ifEmptyValue } from "../../utils/Utils";
import Spacing from "../../configs/Spacing";
import ModalList from "./component/ModalList";
import FontSize from "../../configs/FontSize";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const ModalListing = ({
  closeButtonSheet,
  type,
  classType,
  tsnId,
  totalCount,
  zooId,
  navigation,
}) => {
  const [speciesData, setSpeciesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [speciesLength, setSpeciesLength] = useState(0);
  const [allDataFetched, setAllDataFetched] = useState(false);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  useEffect(() => {
    setLoading(true);
    loadData(1);
    setPage(1);
  }, [classType, navigation, totalCount, type, tsnId, zooId]);

  const loadData = (count) => {
    let obj = {
      zoo_id: zooId,
      list_type: type,
      page_no: count,
    };
    if (classType && classType !== "zoo") {
      obj.class_type = classType;
      obj.parent_tsn = tsnId;
    }

    getSpeciesData(obj)
      .then((res) => {
        if (!res.success) {
          setAllDataFetched(true);
          setSpeciesLength(0);
        } else {
          setAllDataFetched(false);
          let dataArr = count === 1 ? [] : speciesData;
          if (res?.data?.list_type === "animals") {
            setSpeciesData(dataArr.concat(res?.data?.animals));
            setSpeciesLength(res?.data?.animals?.length ?? 0);
          } else if (res?.data?.list_type === "species") {
            setSpeciesData(dataArr.concat(res?.data?.classification_list));
            setSpeciesLength(res?.data?.classification_list?.length ?? 0);
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (!allDataFetched && !loading && speciesLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  const ListEmptyComponent = () => {
    return <>{<ListEmpty />}</>;
  };

  const renderFooter = () => {
    if (speciesLength === 0 || speciesLength < 10) return null;
    return <ActivityIndicator />;
  };

  return (
    <View
      style={{
        backgroundColor: constThemeColor.onPrimary,
      }}
    >
      <Loader visible={loading} />
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{
            fontSize: FontSize.Antz_Major_Medium.fontSize,
            fontWeight: FontSize.Antz_Major_Medium.fontWeight,
            color: constThemeColor.onPrimaryContainer,
            paddingBottom: Spacing.mini,
          }}
        >
          {type && type !== "species" ? "Animal List" : "Species List"}{" "}
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: hp(2),
          marginBottom: hp(27),
          paddingTop: hp(0),
        }}
      >
        <Text
          style={{
            fontSize: FontSize.Antz_Minor_Title.fontSize,
            fontWeight: FontSize.Antz_Minor_Title.fontWeight,
            color: constThemeColor?.onSurfaceVariant,
            paddingBottom: Spacing.mini,
          }}
        >
          {`${type !== "species" ? "Animals" : "Species"} in ${capitalize(
            classType ?? " "
          )}`}{" "}
          - {!loading ? ifEmptyValue(totalCount) : 0}
        </Text>
        <FlatList
          data={speciesData}
          renderItem={({ item }) => (
            <ModalList
              data={item}
              type={type}
              navigation={navigation}
              closeButtonSheet={closeButtonSheet}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={renderFooter}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Add your default background color here
  },
  body: {
    flex: 1,
    padding: Spacing.medium,
  },
  count: {
    fontSize: 18, // Add your default font size here
    fontWeight: "bold", // Add your default font weight here
    paddingBottom: Spacing.small,
  },
});

export default ModalListing;
