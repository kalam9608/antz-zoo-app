import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Header from "../../components/Header";
import List from "./component/List";
import { getSpeciesData } from "../../services/ZooSiteService";
import Loader from "../../components/Loader";
import FontSize from "../../configs/FontSize";
import ListEmpty from "../../components/ListEmpty";
import { capitalize, ifEmptyValue } from "../../utils/Utils";
import { ActivityIndicator } from "react-native-paper";
import { errorToast } from "../../utils/Alert";
import Spacing from "../../configs/Spacing";

const Listing = (props) => {
  const navigation = useNavigation();
  const constThemeColors = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColors);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [speciesData, setSpeciesData] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showBottomLoader, setShowBottomLoader] = useState(false);
  const [allDatafetched, setAllDataFetched] = useState(false);
  const [speciesLength, setSpeciesLength] = useState(0);

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
      zoo_id: zooID,
      list_type: props.route.params?.type,
      page_no: count,
    };
    if (
      props.route.params?.class_type &&
      props.route.params?.class_type != "zoo"
    ) {
      obj.class_type = props.route.params?.class_type;
      obj.parent_tsn = props.route.params?.tsn_id;
    }

    //if(count>1)
    // setShowBottomLoader(true);

    getSpeciesData(obj)
      .then((res) => {
        if (!res.success) {
          setAllDataFetched(true);
          setSpeciesLength(0);
        } else {
          setAllDataFetched(false);
          let dataArr = count == 1 ? [] : speciesData;
          if (res?.data?.list_type == "animals") {
            setType(res.data?.list_type);
            setSpeciesData(dataArr.concat(res?.data?.animals));
            setSpeciesLength(res?.data?.animals?.length ?? 0);
          } else if (res?.data?.list_type == "species") {
            setType(res.data?.list_type);
            setSpeciesData(dataArr.concat(res?.data?.classification_list));
            setSpeciesLength(res?.data?.classification_list?.length ?? 0);
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        errorToast("Oops!", "Something went wrong!!");
        setShowBottomLoader(false);
      })
      .finally(() => {
        setLoading(false);
        setShowBottomLoader(false);
        // setAllDataFetched(true);
      });
  };

  const handleLoadMore = () => {
    // if (!allDatafetched) {
    //   const nextPage = page + 1;
    //   setPage(nextPage);
    //   loadData(nextPage);
    // }

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
        title={props.route.params?.type !== "species" ? "Animals" : "Species"}
        search={true}
        gotoSearchPage={() => navigation.navigate("SearchScreen")}
      />
      <View style={styles.body}>
        <Text style={styles.count}>
          {`${
            props.route.params?.type !== "species" ? "Animals" : "Species"
          } in ${capitalize(props.route.params?.class_type ?? " ")}`}{" "}
          - {!loading ? ifEmptyValue(props.route.params?.totalCount) : 0}
        </Text>
        <FlatList
          data={speciesData}
          renderItem={({ item }) => <List data={item} type={type} />}
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
      padding: hp(2),
      paddingBottom: hp(0),
      paddingTop: hp(0),
    },
    count: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
      color: reduxColor?.onSurfaceVariant,
      paddingBottom: Spacing.small,
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

export default Listing;
