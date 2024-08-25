import { View, Text, Dimensions, ScrollView } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import { KeyboardAvoidingView } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import BottomSheetModalStyles from "../configs/BottomSheetModalStyles";
import { TouchableWithoutFeedback } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Divider } from "react-native-paper";
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import ListEmpty from "./ListEmpty";
const width = Dimensions.get("screen").width;
const LabMappingModalComponent = ({
  onDismiss,
  onBackdropPress,
  onRequestClose,
  onPress,
  data,
  selectedLabId,
  selectedLabName,
  closeModal,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const modalStyles =
    BottomSheetModalStyles.getBottomSheetModalStyle(constThemeColor);
  const navigation = useNavigation();

  return (
    <>
      <Modal
        avoidKeyboard
        animationType="fade"
        visible={true}
        onDismiss={onDismiss}
        onBackdropPress={onBackdropPress}
        onRequestClose={onRequestClose}
        style={[{ backgroundColor: "transparent", flex: 1, margin: 0 }]}
      >
        <TouchableWithoutFeedback onPress={onBackdropPress}>
          <View style={[reduxColors.modalOverlay]}>
            <View
              style={[
                reduxColors.modalContainer,
                {
                  //
                },
              ]}
            >
              <View style={reduxColors.modalHeader}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={reduxColors.accession}>{props.title}</Text>
                </View>
              </View>

              <View
                style={{ width: "95%", maxHeight: heightPercentageToDP(60) }}
              >
                <Divider style={{ marginHorizontal: Spacing.small }} />
                <FlatList
                  data={data}
                  ListEmptyComponent={<ListEmpty visible={props?.loading} />}
                  renderItem={({ item }) => (
                    <>
                      <TouchableOpacity
                        style={{
                          backgroundColor: constThemeColor.onPrimary,
                          padding: Spacing.major,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        onPress={() => onPress(item)}
                      >
                        <View>{props.icon}</View>
                        <Text
                          style={[
                            reduxColors.itemTitle,
                            {
                              paddingHorizontal: Spacing.minor,
                            },
                          ]}
                        >
                          {item.lab_name}
                        </Text>
                        {selectedLabId === item.lab_id &&
                        selectedLabName === item.lab_name ? (
                          <MaterialCommunityIcons
                            name="check"
                            size={24}
                            color={constThemeColor.inversePrimary}
                          />
                        ) : null}
                      </TouchableOpacity>
                      <Divider style={{ marginHorizontal: Spacing.small }} />
                    </>
                  )}
                  onEndReachedThreshold={0.4}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default LabMappingModalComponent;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: reduxColors.onPrimary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: reduxColors.blackWithPointEight,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: reduxColors.onPrimary,
      width: widthPercentageToDP("70%"),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: Spacing.small,
    },
    modalView: {
      alignItems: "center",
      justifyContent: "center",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    accession: {
      fontSize: FontSize.Antz_Major_Medium.fontSize,
      fontWeight: FontSize.Antz_Major_Medium.fontWeight,
      padding: Spacing.minor,
      color: reduxColors.onSurfaceVariant,
    },
    itemTitle: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSurface,
    },
  });
