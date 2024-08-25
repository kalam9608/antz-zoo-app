import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { opacityColor } from "../utils/Utils";

const AssessmentAddListItem = ({
  listItemObj,
  enableInputBox,
  handleListItemRemove,
  handleInputBoxRemove,
  listItemText,
  handleListItemAdd,
  setEnableInputBox,
  setListItemText,
  InputTextUpdate,
  latestInputRef,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <View>
      <Text
        style={{
          ...FontSize.Antz_Minor_Regular,
          color: constThemeColor.onPrimaryContainer,
          paddingBottom: Spacing.small,
        }}
      >
        {props.title}
      </Text>
      <View style={reduxColors.listContainer}>
        {listItemObj?.map((item, index) => {
          return (
            <>
              <View
                style={[
                  reduxColors.listItem,
                  {
                    backgroundColor:
                      index == focusedInput
                        ? constThemeColor.onPriamry
                        : constThemeColor.surface,
                        paddingLeft:item?.order? 10: 0,
                        alignItems: "center",
                     
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "90%",
                    justifyContent: "center"
                  }}
                >
                  {item?.order ? (
                    <Text style={reduxColors.descriptionText}>
                      {item?.order}.
                    </Text>
                  ) : null}
                  <TextInput
                  ref={index === listItemObj.length - 1 ? latestInputRef : null}
                    placeholder={index == focusedInput ? "" : "Enter List Item"}
                    style={[reduxColors?.textInput,{paddingTop: 12}]}
                    value={item.label}
                    onChangeText={(text) => InputTextUpdate(text, index)}
                    placeholderTextColor={constThemeColor?.onTertiaryContainer}
                    multiline
                    onFocus={() => setFocusedInput(index)}
                  />
                </View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 6,
                  }}
                >
                  {index == focusedInput && item.label ? (
                    <View style={{ padding: 4, paddingRight: 0 }}>
                      <Ionicons
                        name="close"
                        size={24}
                        color={constThemeColor.onSurfaceVariant}
                        onPress={() => {
                          handleListItemRemove(index)
                            index == focusedInput
                              ? setFocusedInput(null)
                              : null;
                        }}
                      />
                    </View>
                  ) : null}
                  {index !== focusedInput && listItemObj.length > 1 ? (
                    <View
                      style={{ padding: 4, paddingLeft: -8, paddingRight: 0 }}
                    >
                      <AntDesign
                        name="closecircleo"
                        size={24}
                        color={constThemeColor.onSurfaceVariant}
                        onPress={() => handleInputBoxRemove(index)}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
              <Divider bold />
            </>
          );
        })}

        <TouchableOpacity
          style={reduxColors.addListItemContainer}
          onPress={handleListItemAdd}
        >
          <Feather name="plus" size={22} color={constThemeColor.onSurface} />
          <Text style={reduxColors.addItemText}>{props.AddTitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AssessmentAddListItem;

const styles = (reduxColors) =>
  StyleSheet.create({
    listContainer: {
      borderWidth: 1,
      borderColor: reduxColors.outline,
      borderRadius: Spacing.mini,
    },
    listItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",

      borderRadius: Spacing.mini,
    },
    addListItemContainer: {
      flexDirection: "row",
      paddingHorizontal: Spacing.minor,
      paddingVertical: Spacing.body,
      alignItems: "center",
    },
    descriptionText: {
      ...FontSize.Antz_Minor_Regular,
    },
    addItemText: {
      color: reduxColors.primary,
      ...FontSize.Antz_Body_Medium,
      paddingLeft: Spacing.small,
    },
    textInput: {
      flex: 1,
      borderRadius: 8,
      ...FontSize.Antz_Minor_Regular,
      width: "95%",
      padding: Spacing.minor,
      paddingVertical: Spacing.body,
    },
    AdditemSend: {
      borderRadius: 8,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: Spacing.body,
    },
  });
