import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../../components/Header";
import List from "./component/List";
import Loader from "../../../components/Loader";
import FontSize from "../../../configs/FontSize";
import ListEmpty from "../../../components/ListEmpty";
import { ifEmptyValue } from "../../../utils/Utils";
import { ActivityIndicator } from "react-native-paper";
import { errorToast } from "../../../utils/Alert";
import Spacing from "../../../configs/Spacing";
import { speciesPopulation } from "../../../services/AddSiteService";

const ListingData = (props) => {
  const navigation = useNavigation();
  const constThemeColors = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColors);
  const [speciesData, setSpeciesData] = useState([]);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [data, setData] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showBottomLoader, setShowBottomLoader] = useState(false);
  const [allDatafetched, setAllDataFetched] = useState(false);
  const [speciesLength, setSpeciesLength] = useState(0);
  const [countData, setCount] = useState(0);

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      setLoading(true);
      loadData(1);
      setPage(1);
    });

    return subscribe;
  }, [navigation]);
  const loadData = (count) => {
    speciesPopulation(
      count,
      props?.route.params?.species_id,
      props?.route.params?.type
    )
      .then((res) => {
        if (!res.success) {
          setAllDataFetched(true);
          setSpeciesLength(0);
        } else {
          setAllDataFetched(false);
          let dataArr = count == 1 ? [] : speciesData;
          setSpeciesData(dataArr.concat(res?.data?.result));
          setSpeciesLength(res?.data?.result?.length ?? 0);
        }
      })
      .catch((err) => {
        errorToast("Oops!", "Something went wrong!!");
        setLoading(false);
        setShowBottomLoader(false);
      })
      .finally(() => {
        setLoading(false);
        setShowBottomLoader(false);
      });
  };

  const handleLoadMore = () => {
    if (!allDatafetched && !loading && speciesLength > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  const ListEmptyComponent = () => {
    return <>{loading ? <ListEmpty visible={loading} /> : null}</>;
  };

  const renderFooter = () => {
    if (speciesLength == 0 || speciesLength < 10) return null;
    return (
      <ActivityIndicator style={{ color: constThemeColors.housingPrimary }} />
    );
  };
  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <Header
        noIcon={true}
        title={
          props.route.params?.type == "enclosure"
            ? "Enclosures"
            : props.route.params?.type == "animal"
            ? "Animals"
            : props.route.params?.type == "site"
            ? "Sites"
            : "Sections"
        }
        search={true}
        gotoSearchPage={() => navigation.navigate("SearchScreen")}
      />
      <View style={styles.body}>
        <Text style={styles.count}>
          {`${
            props.route.params?.type == "animal"
              ? "Animals"
              : props.route.params?.type == "section"
              ? "Sections"
              : props.route.params?.type == "site"
              ? "Sites"
              : "Enclosures"
          }`}{" "}
          - {!loading ? ifEmptyValue(props.route.params?.total_count) : 0}
          {/* - {countData} */}
        </Text>
        <FlatList
          data={speciesData}
          renderItem={({ item }) => (
            <List data={item} type={props.route.params?.type} />
          )}
          keyExtractor={(i, index) => index.toString()}
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

const style = (reduxColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColor.surfaceVariant,
    },
    body: {
      flex: 1,
    },
    count: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColor?.onSurfaceVariant,
      paddingBottom: Spacing.small,
      marginHorizontal: Spacing.minor,
    },
    emptyWrap: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    emptyText: {
      fontSize: FontSize.Antz_Large_Title.fontSize,
      fontWeight: FontSize.Antz_Large_Title.fontWeight,
      color: reduxColor?.onSurfaceVariant,
    },
  });

export default ListingData;
