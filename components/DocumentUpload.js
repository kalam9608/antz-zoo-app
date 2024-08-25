import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as WebBrowser from "expo-web-browser";
import { errorToast } from "../utils/Alert";

class DocumentUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }
  componentDidMount() {
    this.setState({
      items: this.props.items,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      items: nextProps.items == null ? [] : nextProps.items,
    });
  }

  handleFileDownload = async (uri) => {
    let result = await WebBrowser.openBrowserAsync(uri);
  };

  _pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: "image/*",
      });
      if (result.type === "success") {
        let items = this.state.items;
        let fileBase64 = await FileSystem.readAsStringAsync(result.uri, {
          encoding: "base64",
        });
        items.push({
          file: result.uri,
          type: result.mimeType,
          name: result.name,
          fileBase64: fileBase64,
        });
        let obj = {
          file: result.uri,
          type: result.mimeType,
          name: result.name,
          fileBase64: fileBase64,
        };
        this.setState(
          {
            items: items,
          },
          () => {
            this.props.onChange(items);
          }
        );
      }
    } catch (E) {
      errorToast("Oops!", "Something went wrong!!");
    }
  };

  isImage = (url) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  };

  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView>
          {this.props.uploadable === true ? (
            <TouchableOpacity
              onPress={this._pickDocument}
              style={styles.uploadcontainer}
            >
              <Ionicons
                name="add"
                size={45}
                style={[
                  this.props.isDarkMode ? styles.lightMode : styles.darkMode,
                ]}
              />
            </TouchableOpacity>
          ) : null}
          <ScrollView>
            {this.state.items && this.state.items.length > 0
              ? this.state.items.map((value, index) => {
                  return (
                    <TouchableOpacity
                      // onPress={this.handleFileDownload.bind(this, value.file)}
                      key={index}
                      // style={{ marginVertical: 5 }}
                    >
                      {/* <Text style={{ color: "skyblue" }}>
                        {index + 1 + " . "}
                      </Text> */}
                      {this.isImage(value.file) ? (
                        <View style={{ display: "flex", flexDirection: "row" }}>
                          <Text style={{ color: "skyblue", marginTop: 20 }}>
                            {index + 1 + " . "}
                          </Text>
                          <Image
                            source={{ uri: value.file }}
                            style={{
                              //   resizeMode: "contain",
                              height: 55,
                              width: 55,
                              marginTop: 20,
                              flexDirection: "row",
                            }}
                          />
                        </View>
                      ) : (
                        <Text style={{ color: "skyblue" }}>
                          {index + 1 + " . "}
                          {value.name}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })
              : null}
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}
export default DocumentUpload;

const styles = StyleSheet.create({
  wrapper: {
    // borderBottomWidth: 1,
    // borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 3,
    width: "100%",
    // marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    // height: 90,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
  },
  img: { resizeMode: "contain", height: 55, width: 55, marginBottom: 5 },
  uploadcontainer: {
    // height: 70,
    width: 70,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor:"red"
  },
  sampleDoc: {
    height: 70,
    width: 70,
    resizeMode: "contain",
    marginRight: 5,
  },
  darkMode: {
    color: "#222", // dark mode background color
  },
  lightMode: {
    color: "#fff",
  },
});

/**
 * Created by: Om Tripathi
 * Created on: 17/02/2023
 * Description: Through This Component We Can Make DatePicker And TimePicker. 
 * @param {boolean} uploadable : Accept the boolean value.
 * @param {string} type : Set the Default mode.
 * @param {object} items : Store the value images/files.
 * @param {boolean} isDarkMode : true / false - Show the darkMode.
 * @param {function} onChange :Store the value in state and show the parant component.
 * 
 * Example---
 <DocumentUpload
    uploadable={true}
    type={"document"}
    items={document}
    onChange={(value) => {
    setDocument(value)
      }}
     isDarkMode={isDarkMode}
  />

 * @public
 */
