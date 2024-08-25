import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import List from "./component/List";
import Loader from "../../components/Loader";
import FontSize from "../../configs/FontSize";
import ListEmpty from "../../components/ListEmpty";
import { ifEmptyValue } from "../../utils/Utils";
import { errorToast } from "../../utils/Alert";
import Spacing from "../../configs/Spacing";
import { collectionInsightListing } from "../../services/AddSiteService";

const CollectionSliderListing = (props) => {
  const navigation = useNavigation();
  const constThemeColors = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColors);
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showBottomLoader, setShowBottomLoader] = useState(false);
  const [allDatafetched, setAllDataFetched] = useState(false);
  const [listLength, setListLength] = useState(0);
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
    let obj = {
      type: props.route.params?.class_type,
      parent_tsn: props.route.params?.species_id,
      data_type: props.route.params?.data_type,
      page_no: count,
    };
    collectionInsightListing(obj)
      .then((res) => {
        setCount(res?.data?.total_count);
        if (!res.success) {
          setAllDataFetched(true);
          setListLength(0);
        } else {
          setAllDataFetched(false);
          let dataArr = count == 1 ? [] : listData;
          setListData(dataArr.concat(res?.data?.result));
          setListLength(res?.data?.result?.length ?? 0);
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
    if (
      !allDatafetched &&
      !loading &&
      listLength > 0 &&
      listData?.length != countData
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  const ListEmptyComponent = () => {
    return (
      <>
        <ListEmpty visible={loading} />
      </>
    );
  };

  const renderFooter = () => {
    if (listLength == 0 || listLength < 10 || listData?.length == countData)
      return null;
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
          props.route.params?.data_type == "enclosure"
            ? "Enclosures"
            : props.route.params?.data_type == "animal"
            ? "Animals"
            : props.route.params?.data_type == "site"
            ? "Sites"
            : props.route.params?.data_type == "section"
            ? "Sections"
            : null
        }
        // search={true}
        // gotoSearchPage={() => navigation.navigate("SearchScreen")}
      />
      <View style={styles.body}>
        <Text style={styles.count}>
          {`${
            props.route.params?.data_type == "section"
              ? "Sections"
              : props.route.params?.data_type == "site"
              ? "Sites"
              : props.route.params?.data_type == "enclosure"
              ? "Enclosures"
              : null
          }`}{" "}
          - {!loading ? countData : 0}
        </Text>
        <FlatList
          data={listData}
          renderItem={({ item }) => (
            <List
              data={item}
              type={props.route.params?.data_type}
              from={props?.route.params?.ref_type}
              fromId={props?.route.params?.ref_id}
            />
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

export default CollectionSliderListing;
