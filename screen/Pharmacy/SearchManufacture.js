import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { ActivityIndicator, FAB } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";
import AddMedicalRecordCard from "../../components/AddMedicalRecordCard";
import ListEmpty from "../../components/ListEmpty";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { capitalize } from "../../utils/Utils";
import {
  AddDrugStorage,
  AddDrugs,
  AddGSTtaxslab,
  AddManufacture,
  AddPackages,
  AddProductforms,
  AddSalts,
  AddUom,
  GetListZooDrugStorage,
  GetListZooDrugs,
  GetListZooGSTtaxslab,
  GetListZooManufacturer,
  GetListZooPackages,
  GetListZooProductforms,
  GetListZooSalts,
  GetListZooUom,
} from "../../services/PharmicyApi";
import ManufacturerCard from "./ManufacturerCard";
import SearchOnPage from "../../components/searchOnPage";
import MedicalSearchFooter from "../../components/MedicalSearchFooter";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "../../configs/Colors";
import { useToast } from "../../configs/ToastConfig";

const SearchManufacture = (props) => {
  const { successToast, errorToast, alertToast, warningToast, showToast } =
    useToast();
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = React.useState({ open: false });
  const [searchModalText, setSearchModalText] = useState("");
  const [page, setPage] = useState(1);
  const [manufacturer, setManufacturer] = useState([]);
  const [ForAddManufacturer, setForAddManufacturer] = useState([]);
  const [type_of, setTypeOf] = useState(props.route.params?.type_of ?? "");
  const [index, setIndex] = useState(props.route.params?.index ?? null);
  const [totalCount, setTotalCount] = useState(0);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const [selectedCheckedBox, setSelectedCheckBox] = useState([]);
  const [preSelectedIds] = useState(props.route.params?.preselectedSalt ?? []);
  const [sort, setSort] = useState("asc");
  const [selectedItems, setSelectedItems] = useState();
  const clearSearchText = () => {
    setSearchModalText("");
    setIsLoading(true);
    setPage(1);
    if (type_of == "Manufacturer") {
      loadData(1, "");
    } else if (type_of == "Package") {
      loadPackageData(1, "");
    } else if (type_of == "UOM") {
      loadUomData(1, "");
    } else if (type_of == "ProductForm") {
      loadProductformsData(1, "");
    } else if (type_of == "Salt") {
      loadSaltData(1, "");
    } else if (type_of == "Drug") {
      loadDrugsData(1, "");
    } else if (type_of == "DrugStorage") {
      loadDrugStorageData(1, "");
    } else if (type_of == "GST") {
      loadGSTtaxslabData(1, "");
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setPage(1);
      if (type_of == "Manufacturer") {
        loadData(1, searchModalText);
      } else if (type_of == "Package") {
        loadPackageData(1, searchModalText);
      } else if (type_of == "UOM") {
        loadUomData(1, searchModalText);
      } else if (type_of == "ProductForm") {
        loadProductformsData(1, searchModalText);
      } else if (type_of == "Salt") {
        loadSaltData(1, searchModalText);
      } else if (type_of == "Drug") {
        loadDrugsData(1, searchModalText);
      } else if (type_of == "DrugStorage") {
        loadDrugStorageData(1, searchModalText);
      } else if (type_of == "GST") {
        loadGSTtaxslabData(1, searchModalText);
      }

      return () => {};
    }, [navigation, sort])
  );
  const loadData = (count, search) => {
    let obj = {
      sort: sort,
      column: "label",
    };

    GetListZooManufacturer(count, search, obj)
      .then((res) => {
        if (res?.success) {
          setTotalCount(res?.data?.total_count ?? 0);
          let dataArr = count == 1 ? [] : manufacturer;
          setManufacturer(dataArr.concat(res?.data?.list_items));
          if (res?.data?.total_count == 0) {
            setForAddManufacturer([{ active: "1", id: "0000", label: search }]);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const loadPackageData = (count, search) => {
    let obj = {
      sort: sort,
      column: "label",
    };

    GetListZooPackages(count, search, obj)
      .then((res) => {
        if (res?.success) {
          setTotalCount(res?.data?.total_count ?? 0);
          let dataArr = count == 1 ? [] : manufacturer;
          setManufacturer(dataArr.concat(res?.data?.list_items));
          if (res?.data?.total_count == 0) {
            setForAddManufacturer([{ active: "1", id: "0000", label: search }]);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const loadUomData = (count, search) => {
    let obj = {
      sort: sort,
      column: "unit_name",
    };

    GetListZooUom(count, search, obj)
      .then((res) => {
        if (res?.success) {
          setTotalCount(res?.data?.total_count ?? 0);
          let dataArr = count == 1 ? [] : manufacturer;
          setManufacturer(dataArr.concat(res?.data?.list_items));
          if (res?.data?.total_count == 0) {
            setForAddManufacturer([{ active: "1", id: "0000", label: search }]);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const loadProductformsData = (count, search) => {
    let obj = {
      sort: sort,
      column: "label",
    };

    GetListZooProductforms(count, search, obj)
      .then((res) => {
        if (res?.success) {
          setTotalCount(res?.data?.total_count ?? 0);
          let dataArr = count == 1 ? [] : manufacturer;
          setManufacturer(dataArr.concat(res?.data?.list_items));
          if (res?.data?.total_count == 0) {
            setForAddManufacturer([{ active: "1", id: "0000", label: search }]);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const loadSaltData = (count, search) => {
    let obj = {
      sort: sort,
      column: "label",
    };

    GetListZooSalts(count, search, obj)
      .then((res) => {
        if (res?.success) {
          setTotalCount(res?.data?.total_count ?? 0);
          let dataArr = count == 1 ? [] : manufacturer;
          setManufacturer(dataArr.concat(res?.data?.list_items));
          if (res?.data?.total_count == 0) {
            setForAddManufacturer([{ active: "1", id: "0000", label: search }]);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const loadDrugsData = (count, search) => {
    let obj = {
      sort: sort,
      column: "label",
    };

    GetListZooDrugs(count, search, obj)
      .then((res) => {
        if (res?.success) {
          setTotalCount(res?.data?.total_count ?? 0);
          let dataArr = count == 1 ? [] : manufacturer;
          setManufacturer(dataArr.concat(res?.data?.list_items));
          if (res?.data?.total_count == 0) {
            setForAddManufacturer([{ active: "1", id: "0000", label: search }]);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const loadDrugStorageData = (count, search) => {
    let obj = {
      sort: sort,
      column: "label",
    };

    GetListZooDrugStorage(count, search, obj)
      .then((res) => {
        if (res?.success) {
          setTotalCount(res?.data?.total_count ?? 0);
          let dataArr = count == 1 ? [] : manufacturer;
          setManufacturer(dataArr.concat(res?.data?.list_items));
          if (res?.data?.total_count == 0) {
            setForAddManufacturer([{ active: "1", id: "0000", label: search }]);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const loadGSTtaxslabData = (count, search) => {
    let obj = {
      sort: sort,
      column: "label",
    };
    GetListZooGSTtaxslab(count, search, obj)
      .then((res) => {
        if (res?.success) {
          setTotalCount(res?.data?.total_count ?? 0);
          let dataArr = count == 1 ? [] : manufacturer;
          setManufacturer(dataArr.concat(res?.data?.list_items));
          // if (res?.data?.total_count == 0) {
          //   setForAddManufacturer([{ active: "1", id: "0000", label: search }]);
          // }
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearch = (text) => {
    setSearchModalText(text);
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        setPage(1);
        if (type_of == "Manufacturer") {
          setIsLoading(true);
          loadData(1, text);
        } else if (type_of == "Package") {
          setIsLoading(true);
          loadPackageData(1, text);
        } else if (type_of == "UOM") {
          setIsLoading(true);
          loadUomData(1, text);
        } else if (type_of == "ProductForm") {
          setIsLoading(true);
          loadProductformsData(1, text);
        } else if (type_of == "Salt") {
          setIsLoading(true);
          loadSaltData(1, text);
        } else if (type_of == "Drug") {
          setIsLoading(true);
          loadDrugsData(1, text);
        } else if (type_of == "DrugStorage") {
          setIsLoading(true);
          loadDrugStorageData(1, text);
        } else if (type_of == "GST") {
          loadGSTtaxslabData(1, text);
        }
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      setSearchModalText("");
      const getData = setTimeout(() => {
        setPage(1);
        setIsLoading(true);
        if (type_of == "Manufacturer") {
          loadData(1, text);
        } else if (type_of == "Package") {
          loadPackageData(1, text);
        } else if (type_of == "UOM") {
          loadUomData(1, text);
        } else if (type_of == "ProductForm") {
          loadProductformsData(1, text);
        } else if (type_of == "Salt") {
          loadSaltData(1, text);
        } else if (type_of == "Drug") {
          loadDrugsData(1, text);
        } else if (type_of == "DrugStorage") {
          loadDrugStorageData(1, text);
        } else if (type_of == "GST") {
          loadGSTtaxslabData(1, text);
        }
      }, 2000);
      return () => clearTimeout(getData);
    }
  };

  const renderFooter = () => {
    if (
      isLoading ||
      manufacturer.length == 0 ||
      totalCount == 0 ||
      totalCount <= 9 ||
      manufacturer.length == totalCount
    )
      return null;
    return (
      <ActivityIndicator style={{ color: constThemeColor.housingPrimary }} />
    );
  };

  const handleLoadMore = () => {
    if (
      !isLoading &&
      manufacturer.length >= 10 &&
      manufacturer.length != totalCount
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      if (type_of == "Manufacturer") {
        loadData(nextPage, searchModalText);
      } else if (type_of == "Package") {
        loadPackageData(nextPage, searchModalText);
      } else if (type_of == "UOM") {
        loadUomData(nextPage, searchModalText);
      } else if (type_of == "ProductForm") {
        loadProductformsData(nextPage, searchModalText);
      } else if (type_of == "Salt") {
        loadSaltData(nextPage, searchModalText);
      } else if (type_of == "Drug") {
        loadDrugsData(nextPage, searchModalText);
      } else if (type_of == "DrugStorage") {
        loadDrugStorageData(nextPage, searchModalText);
      } else if (type_of == "GST") {
        loadGSTtaxslabData(nextPage, searchModalText);
      }
    }
  };
  const selectAction = (e) => {
    if (manufacturer.length > 0) {
      if (type_of == "Salt") {
        if (selectedCheckedBox.length > 0) {
          if (selectedCheckedBox.includes(e.id)) {
            let x = selectedCheckedBox.filter((id) => id !== e.id);
            setSelectedCheckBox(x);
            setSelectedItems();
          }
        } else {
          if (!preSelectedIds.includes(e.id)) {
            setSelectedCheckBox([...selectedCheckedBox, e.id]);
            setSelectedItems([e]);
          }
        }
      } else {
        if (selectedCheckedBox.length > 0) {
          if (selectedCheckedBox.includes(e.id)) {
            let x = selectedCheckedBox.filter((id) => id !== e.id);
            setSelectedCheckBox(x);
            setSelectedItems();
          }
        } else {
          if (!selectedCheckedBox.includes(e.id)) {
            setSelectedCheckBox([...selectedCheckedBox, e.id]);
            setSelectedItems([e]);
          }
        }
      }
    }
  };
  const back = () => {
    props.route.params?.onGoBack(selectedItems, type_of, index && index),
      props.navigation.goBack();
  };

  const AddDrugData = () => {
    if (searchModalText !== "") {
      let obj = {
        name: searchModalText,
      };
      setIsLoading(true);
      AddDrugs(obj)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            loadDrugsData(1, searchModalText);
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const AddSaltData = () => {
    if (searchModalText !== "") {
      let obj = {
        name: searchModalText,
      };
      setIsLoading(true);
      AddSalts(obj)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            loadSaltData(1, searchModalText);
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const AddProductformData = () => {
    if (searchModalText !== "") {
      let obj = {
        name: searchModalText,
      };
      setIsLoading(true);
      AddProductforms(obj)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            loadProductformsData(1, searchModalText);
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const AddUomData = () => {
    if (searchModalText !== "") {
      let obj = {
        unit_name: searchModalText,
      };
      setIsLoading(true);
      AddUom(obj)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            loadUomData(1, searchModalText);
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const AddPackage = () => {
    if (searchModalText !== "") {
      let obj = {
        name: searchModalText,
      };
      setIsLoading(true);
      AddPackages(obj)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            loadPackageData(1, searchModalText);
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const AddManufacturer = () => {
    if (searchModalText !== "") {
      let obj = {
        manufacturer_name: searchModalText,
      };
      setIsLoading(true);
      AddManufacture(obj)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            loadData(1, searchModalText);
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const AddStorage = () => {
    if (searchModalText !== "") {
      let obj = {
        name: searchModalText,
      };
      setIsLoading(true);
      AddDrugStorage(obj)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            loadDrugStorageData(1, searchModalText);
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const AddGst = () => {
    if (searchModalText !== "") {
      let obj = {
        name: searchModalText,
      };
      setIsLoading(true);
      AddGSTtaxslab(obj)
        .then((res) => {
          if (res?.success) {
            setIsLoading(false);
            successToast("success", res?.message);
            loadGSTtaxslabData(1, searchModalText);
          } else {
            errorToast("error", `Opps! ${res?.message}!!`);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          errorToast("error", "Opps! something went wrong !!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const { open } = state;
  return (
    <>
      <Header
        title={
          type_of == "ProductForm"
            ? "Product Form"
            : type_of == "DrugStorage"
            ? "Drug Storage"
            : type_of ?? "List"
        }
        noIcon={true}
      />
      <Loader visible={isLoading} />
      <View
        style={[
          reduxColors.container,
          {
            backgroundColor: constThemeColor.surfaceVariant,
          },
        ]}
      >
        <SearchOnPage
          handleSearch={handleSearch}
          searchModalText={searchModalText}
          placeholderText={
            type_of == "ProductForm"
              ? " Search Product Form"
              : type_of == "DrugStorage"
              ? " Search Drug Storage"
              : "Search " + type_of ?? ""
          }
          clearSearchText={clearSearchText}
        />
        <TouchableOpacity
          onPress={() => {
            if (sort == "asc") {
              setSort("desc");
            } else setSort("asc");
          }}
          style={{
            justifyContent: "flex-start",
            alignSelf: "flex-end",
            paddingTop: Spacing.small,
          }}
        >
          {sort == "desc" ? (
            <FontAwesome5
              name="sort-alpha-down"
              size={Spacing.major}
              color={constThemeColor.onSurfaceVariant}
            />
          ) : (
            <FontAwesome5
              name="sort-alpha-down-alt"
              size={Spacing.major}
              color={constThemeColor.onSurfaceVariant}
            />
          )}
        </TouchableOpacity>

        <View style={{ marginBottom: 6 }}></View>
        <View style={{ flex: 1 }}>
          {manufacturer.length > 0 ? (
            <FlatList
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
              ListFooterComponent={renderFooter}
              showsVerticalScrollIndicator={false}
              data={manufacturer}
              renderItem={(item, index) => (
                <ManufacturerCard
                  item={item?.item}
                  index={index}
                  selectedCheckedBox={selectedCheckedBox}
                  selectAction={selectAction}
                  preSelectedIds={preSelectedIds}
                  ForAddManufacturer={ForAddManufacturer}
                />
              )}
              ListEmptyComponent={
                isLoading ? null : <ListEmpty visible={isLoading} />
              }
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={() => {
                    setIsLoading(true);
                    setPage(1);
                    if (type_of == "Manufacturer") {
                      loadData(1, searchModalText);
                    } else if (type_of == "Package") {
                      loadPackageData(1, searchModalText);
                    } else if (type_of == "UOM") {
                      loadUomData(1, searchModalText);
                    } else if (type_of == "ProductForm") {
                      loadProductformsData(1, searchModalText);
                    } else if (type_of == "Salt") {
                      loadSaltData(1, searchModalText);
                    } else if (type_of == "Drug") {
                      loadDrugsData(1, searchModalText);
                    } else if (type_of == "DrugStorage") {
                      loadDrugStorageData(1, searchModalText);
                    } else if (type_of == "GST") {
                      loadGSTtaxslabData(1, searchModalText);
                    }
                  }}
                />
              }
            />
          ) : ForAddManufacturer?.length > 0 ? (
            <View
              style={{
                display: ForAddManufacturer?.length > 0 ? "flex" : "none",
                height: 50,
                // marginHorizontal: Spacing.minor,
                borderRadius: Spacing.mini,
                paddingLeft: Spacing.body,
                paddingRight: Spacing.minor,
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: constThemeColor.onPrimary,
                marginTop: Spacing.minor,
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.Antz_Body_Regular.fontSize,
                  fontWeight: FontSize.Antz_Body_Regular.fontWeight,
                  color: constThemeColor.onSurfaceVariant,
                  flex: 1,
                  marginRight: Spacing.small,
                }}
              >
                Add & Select:{" "}
                <Text
                  style={{
                    fontSize: FontSize.Antz_Minor_Title.fontSize,
                    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
                    color: constThemeColor.onSurfaceVariant,
                  }}
                >
                  {searchModalText}
                </Text>
              </Text>
              <Ionicons
                name="add-outline"
                size={24}
                onPress={
                  type_of == "Manufacturer"
                    ? AddManufacturer
                    : type_of == "Package"
                    ? AddPackage
                    : type_of == "UOM"
                    ? AddUomData
                    : type_of == "ProductForm"
                    ? AddProductformData
                    : type_of == "Salt"
                    ? AddSaltData
                    : type_of == "Drug"
                    ? AddDrugData
                    : type_of == "DrugStorage"
                    ? AddStorage
                    : type_of == "GST"
                    ? AddGst
                    : console.log("-------------->")
                }
                color={Colors.mediumGrey}
              />
            </View>
          ) : (
            <ListEmpty visible={isLoading} />
          )}
        </View>
        {selectedCheckedBox.length > 0 && (
          <View style={{ minHeight: "10%" }}>
            <MedicalSearchFooter
              title={
                type_of == "ProductForm"
                  ? "Product Form"
                  : type_of == "DrugStorage"
                  ? "Drug Storage"
                  : type_of ?? ""
              }
              selectCount={selectedCheckedBox.length}
              onPress={() => {
                back();
              }}
              selectedItems={selectedItems}
            />
          </View>
        )}
      </View>
    </>
  );
};
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: Spacing.minor,
    },
    fabStyle: {
      margin: 10,
      right: 5,
      bottom: 20,
      width: 45,
      height: 45,
      justifyContent: "center",
      alignItems: "center",
    },
    subtitle: {
      fontSize: FontSize.Antz_Minor_Title.fontSize,
      fontWeight: FontSize.Antz_Minor_Title.fontWeight,
    },
  });

export default SearchManufacture;
