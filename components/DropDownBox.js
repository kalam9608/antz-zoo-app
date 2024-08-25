import { AntDesign } from "@expo/vector-icons";
import React, { Component } from "react";
//import react in our project
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
  TextInput,
} from "react-native";
//import basic react native components
import { Bullets } from "react-native-easy-content-loader";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import FontSize from "../configs/FontSize";
import { Checkbox } from "react-native-paper";
import SearchOnPage from "./searchOnPage";

class ExpandableItemComponent extends Component {
  //Custom Component for the Expandable List
  constructor(props) {
    super();

    this.state = {
      layoutHeight: 0,
      isMulti: props.isMulti,
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.isSelect) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <>
        <TouchableOpacity
          onPress={this.props.onClickFunction}
          style={[
            styles.selectedChild2,
            {
              backgroundColor: this.props.item.isSelect ? "#FFFFFF" : "#EFF5F2",
            },
          ]}
        >
          <View
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "90%" }}>
              <Text
                style={{
                  // textAlign: "center",
                  // color: this.props.item.isSelect ? "#FFFFFF" : "#6A858B",
                  color: "#44544A",
                  fontSize: FontSize.Antz_Minor_Regular.fontSize,
                  fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
                }}
                numberOfLines={1}
              >
                {this.props.item.name}
              </Text>
            </View>
            {this.state.isMulti ? (
              <Checkbox.Android
                status={this.props.item.isSelect ? "checked" : "unchecked"}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      </>
    );
  }
}

export default class Category extends Component {
  //Main View defined under this Class
  constructor(props) {
    super(props);
    this.dataRef = React.createRef(null);
    this.blankRef = React.createRef(null);
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      newCat: null,
      listDataSource: props.categoryData,
      catPresed: props.onCatPress,
      heading: props.heading,
      userType: props.userType,
      navigation: props.navigation,
      permission: props.permission,
      screen: props.screen,
      isMulti: props.isMulti,
      searchValue: "",
      isOpen: false,
      noOptionMessage: props.noOptionAvailableMessage,
      oldData: props.categoryData,
      selectLimit: props.selectLimit,
    };
  }

  componentDidMount() {
    if (this.listDataSource !== [] && this.listDataSource !== null) {
      // if (Array.isArray(this.listDataSource) && this.listDataSource.length>0) {
      setTimeout(() => {
        this.dataRef.current?.focus();
      }, 0);
    }
  }

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.categoryData?.length != state.listDataSource?.length) {
      return {
        newCat: null,
        listDataSource: props.categoryData,
        catPresed: props.onCatPress,
        heading: props.heading,
        userType: props.userType,
        navigation: props.navigation,
        permission: props.permission,
        screen: props.screen,
      };
    }
    return null;
  }

  filterSubCat = (i) => {
    const arrayy = [...this.state.listDataSource];
    arrayy.map((value, placeindex) =>
      placeindex === i ? this.setState({ newCat: value }) : null
    );
  };

  changeText = (value) => {
    this.setState({ searchValue: value });
    this.getData(value);
  };

  clearSearchText = () => {
    this.setState({ searchValue: "" });
    this.getData("");
  };

  getData = (value) => {
    // let { searchValue } = this.state;
    // let items = this.props.items || [];
    let items = this.props.categoryData || [];
    let data = items.filter((element) => {
      let name = element.name
        ? element.name.toLowerCase()
        : element?.item?.toLowerCase();
      let index = name?.indexOf(value.toLowerCase());

      return index > -1;
    });
    this.setState(() => {
      return {
        oldData: data,
      };
    });
    return data;
  };

  toggleInput = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  updateLayout = ({ item, index }) => {
    this.filterSubCat(index);
    /**
     * Comment this line beacuse its stuck apps screen when pre selected is being clicked
     * Update by Anirban Pan
     * Date 11 Aug, 2023
     */
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.listDataSource];
    if (!this.state.isMulti) {
      array.map((value, placeindex) => (array[placeindex]["isSelect"] = false));
      //For Single Expand at a time
      array.map((value, placeindex) =>
        value.id === item.id
          ? (array[placeindex]["isSelect"] = !array[placeindex]["isSelect"])
          : (array[placeindex]["isSelect"] = false)
      );
      this.state.catPresed(array.filter((element) => element.isSelect == true));
    } else {
      if (this.state.selectLimit) {
        let arr;
        arr = array.filter((value) => value.isSelect === true);
        if (arr.length >= this.state.selectLimit) {
          array[index]["isSelect"] = false;
        } else {
          //For Multiple Expand at a time
          array[index]["isSelect"] = !array[index]["isSelect"];
          this.state.catPresed(
            array.filter((element) => element.isSelect == true)
          );
        }
      } else {
        //For Multiple Expand at a time
        array[index]["isSelect"] = !array[index]["isSelect"];
        this.state.catPresed(
          array.filter((element) => element.isSelect == true)
        );
      }
    }

    this.setState(() => {
      return {
        oldData: array,
      };
    });
  };

  render() {
    const { listDataSource, newCat, catPresed, heading, navigation, screen } =
      this.state;

    return (
      <>
        {listDataSource != "" ? (
          <View
            style={styles.container}
            ref={Platform.OS == "android" ? this.dataRef : null}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#1F515B",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                paddingLeft: 15,
                height: heightPercentageToDP(6.5),
                // width: widthPercentageToDP(100),
                alignItems: "center",
              }}
            >
              <Text style={[styles.topHeading, { color: "#4DE78A" }]}>
                {this.state.heading}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    paddingVertical: 5,
                    paddingRight: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    // this.state.navigation.navigate(screen);
                  }}
                >
                  {/* <AntDesign
                    active
                    name="edit"
                    type="AntDesign"
                    style={{
                      color: "#FFFFFF",
                      fontSize: FontSize.Antz_Major_Title_btn.fontSize,
                      fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
                    }}
                  /> */}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    // backgroundColor: "red",
                    paddingVertical: 5,
                    marginHorizontal: 5,
                    paddingRight: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={this.toggleInput}
                >
                  <AntDesign
                    active
                    name="search1"
                    type="AntDesign"
                    style={{
                      color: this.state.isOpen ? "#4de78a" : "#fff",
                      fontSize: FontSize.Antz_Major_Title_btn.fontSize,
                      fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingVertical: 5,
                    paddingRight: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={this.props?.onClose}
                >
                  <AntDesign
                    active
                    name="close"
                    type="AntDesign"
                    style={{
                      color: "#fff",
                      fontSize: FontSize.Antz_Major_Title_btn.fontSize,
                      fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {this.state.isOpen ? (
              // <TextInput
              //   value={this.state.searchValue}
              //   autoFocus={true}
              //   onChangeText={this.changeText}
              //   placeholder="Search ..."
              //   style={{ marginHorizontal: 1, borderWidth: 0.5, padding: 5 }}
              // />

              <SearchOnPage
                handleSearch={this.changeText}
                searchModalText={this.state.searchValue}
                placeholderText={"Search"}
                clearSearchText={this.clearSearchText}
                customStyle={{ backgroundColor: "white", borderRadius: 0 }}
              />
            ) : null}
            <FlatList
              contentContainerStyle={{
                paddingHorizontal: ".5%",
                marginVertical: 4,
              }}
              data={this.state.oldData}
              extraData={this.state.oldData}
              showsVerticalScrollIndicator={false}
              // numColumns={3}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <ExpandableItemComponent
                  key={item.id}
                  onClickFunction={this.updateLayout.bind(this, {
                    item,
                    index,
                  })}
                  onCatPressed={catPresed}
                  item={item}
                  isMulti={this.state.isMulti}
                />
              )}
            />
          </View>
        ) : (
          <View style={[styles.container, { height: "30%" }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#1F515B",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                paddingLeft: 15,
                height: heightPercentageToDP(6.5),
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.topHeading,
                  !this.state.isOpen
                    ? { color: "#FFFFFF" }
                    : { color: "#4DE78A" },
                ]}
              >
                {this.state.heading}
              </Text>

              <TouchableOpacity
                style={{
                  paddingVertical: 5,
                  paddingRight: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={this.props?.onClose}
              >
                <AntDesign
                  active
                  name="close"
                  type="AntDesign"
                  style={{
                    color: "#FFFFFF",
                    fontSize: FontSize.Antz_Major_Title_btn.fontSize,
                    fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.Antz_Minor_Title.fontSize,
                  fontWeight: FontSize.Antz_Major_Title.fontWeight,
                  color:
                    this.state.noOptionMessage !== undefined
                      ? "red"
                      : "#44544A",
                }}
              >
                {this.state.noOptionMessage !== undefined
                  ? this.state.noOptionMessage
                  : "No options available"}
              </Text>
            </View>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#DAE7DF",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: heightPercentageToDP(50),
    //minHeight: "30%",
    //maxHeight: "70%",
    paddingBottom: 30,
    //height: 'auto',
  },
  topHeading: {
    paddingVertical: 10,
    fontSize: FontSize.Antz_Minor_Title.fontSize,
    fontWeight: FontSize.Antz_Minor_Title.fontWeight,
  },
  // header: {
  //   backgroundColor: "#FFFFFF",
  //   height: 40,
  //   justifyContent: "center",
  // },
  // headerText: {
  //   fontSize: 15,
  //   fontWeight: "500",
  //   paddingLeft: 15,
  // },
  // separator: {
  //   height: 0.5,
  //   backgroundColor: "#808080",
  //   width: "95%",
  //   marginLeft: 16,
  //   marginRight: 16,
  // },
  // text: {
  //   fontSize: 15,
  //   color: "#606070",
  //   padding: 10,
  // },
  // content: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   paddingLeft: 6,
  //   height: 40,
  //   borderBottomWidth: 1,
  //   borderColor: "#ccc",
  // },
  // selectedChild: {
  //   width: 100,
  //   height: 50,
  //   borderRadius: 5,
  //   marginLeft: "4%",
  //   marginTop: "5%",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "white",
  //   flexDirection: "row",
  //   paddingLeft: 10,
  //   paddingRight: 10,
  // },

  selectedChild2: {
    // maxWidth: widthPercentageToDP(31),
    // minWidth: widthPercentageToDP(31),
    minHeight: heightPercentageToDP(6.5),
    borderRadius: 5,
    flex: 1 / 3,
    margin: 4,
    backgroundColor: "#EFF5F2",
    borderColor: "#C3CEC7",
    borderWidth: 1,
    // flexDirection: "row",
    // alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "center",
  },

  // submit_Icon: {
  //   width: "100%",
  //   height: "14%",
  //   // borderWidth: 1,
  //   // borderColor: "black",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
});
