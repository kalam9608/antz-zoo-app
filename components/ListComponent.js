import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";

const ListComponent = ({
  item,
  onPress,
  label,
  children,
  onPressDelete,
  onPressEdit,
}) => {
  const {
    id,
    type_name,
    client_id,
    created_at,
    created_by,
    status,
    modified_at,
  } = item.item;
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const styles = style(constThemeColor);

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          Platform.OS != "ios" ? styles.shadow : null,
          { borderRadius: 8 },
        ]}
      >
        {children ? (
          children
        ) : (
          <View>
            <View style={styles.header}>
              <View style={styles.innerHeader}>
                <Text>{`${label.id}`}</Text>
                <Text style={styles.idNumber}>{`#${id}`}</Text>
              </View>
              <Text style={styles.idNumber}>{status}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text>{`${label.eduType}:`}</Text>
              <Text style={styles.idNumber}>{type_name}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text>{`${label.clientId}:`}</Text>
              <Text style={styles.idNumber}>{client_id}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text>{`${label.createdBy}:`}</Text>
              <Text style={styles.idNumber}>{created_by}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text>{`${label.createdAt}:`}</Text>
              <Text style={styles.idNumber}>{created_at}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text>{`${label.modifiedAt}:`}</Text>
              <Text style={styles.idNumber}>{modified_at}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const style = (reduxColor) => StyleSheet.create({
  container: {
    backgroundColor: reduxColor.onSecondary,
    marginVertical: 5,
    // borderRadius:8,
    padding: wp(2),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  innerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  idNumber: {
    marginLeft: 5,
    fontWeight: "500",
  },
  shadow: {
    shadowOffset: {
      height: 10,
      width: 5,
    },
    shadowColor: reduxColor.shadow,
    shadowOpacity: 1,
    backgroundColor:reduxColor.onPrimary
  },
  leftSwipesection: {
    backgroundColor: reduxColor.primary,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  leftButtonSection: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  swipeIcon: {
    height: 30,
    width: 30,
    tintColor: reduxColor.onSecondary,
  },
  rightSwipesection: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  rightButtonSection: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ListComponent;
