import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import Spacing from "../../configs/Spacing";
import { useSelector } from "react-redux";
import styles from "../../configs/Styles";
import FontSize from "../../configs/FontSize";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { LengthDecrease, ShortFullName } from "../../utils/Utils";
export default function DispenseCard({ item }) {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const navigation = useNavigation();
  const groupedData = item?.dispense_items?.reduce((acc, obj) => {
    const foundItem = acc.find((item) => item.name === obj.stock_name);
    if (foundItem) {
      foundItem.items.push(obj);
    } else {
      acc.push({ name: obj.stock_name, items: [obj] });
    }
    return acc;
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("DispenseSummary", {
          id: item?.id,
          store_id: item?.store_id,
        });
      }}
      style={{
        padding: Spacing.body,
        backgroundColor: constThemeColor.onPrimary,
        borderRadius: Spacing.small,
        marginVertical: Spacing.mini,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            ...FontSize.Antz_Minor_Medium,
            alignItems: "center",
            color: constThemeColor?.neutralPrimary,
            marginLeft: Spacing.mini,
          }}
        >
          {item?.dispense_id ?? "NA"}
        </Text>
        <Feather
          name="chevron-right"
          size={22}
          color={constThemeColor.onSurfaceVariant}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: Spacing.micro,
        }}
      >
        <Text
          style={[
            {
              ...FontSize.Antz_Subtext_Regular,
              color: constThemeColor.onSurfaceVariant,
              marginLeft: Spacing.micro,
            },
          ]}
        >
          {LengthDecrease(20, item?.from_store) ?? ""}
        </Text>
        <Entypo
          name="dot-single"
          size={21}
          color={constThemeColor.onSurfaceVariant}
        />
        <Text
          style={[
            {
              ...FontSize.Antz_Subtext_Regular,
              color: constThemeColor.onSurfaceVariant,
              marginLeft: Spacing.micro,
            },
          ]}
        >
          {moment(item?.created_at).format("DD MMM YYYY") ?? ""}
        </Text>
        <Entypo
          name="dot-single"
          size={21}
          color={constThemeColor.onSurfaceVariant}
        />
        <Text
          style={[
            {
              ...FontSize.Antz_Subtext_Regular,
              color: constThemeColor.onSurfaceVariant,
              marginLeft: Spacing.micro,
            },
          ]}
        >
          {moment(item?.created_at).format("LT") ?? ""}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="arrow-right-top"
          size={24}
          color={constThemeColor.editIconColor}
        />
        <View
          style={{
            backgroundColor: constThemeColor.secondary,
            borderRadius: 50,
            height: 32,
            width: 32,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: Spacing.mini,
          }}
        >
          {item.profile_pic ? (
            <Image
              source={{
                uri: item?.profile_pic,
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
              }}
            />
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  ...FontSize.Antz_Subtext_Medium,
                  color: constThemeColor.onPrimary,
                }}
              >
                {ShortFullName(
                  item?.user_first_name +
                    " " +
                    item?.user_last_name
                )}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={[
            {
              ...FontSize.Antz_Subtext_Regular,
              color: constThemeColor.onSurfaceVariant,
              marginLeft: Spacing.mini,
            },
          ]}
        >
          {item.user_first_name} {item.user_last_name}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: Spacing.small,
        }}
      >
        <View>
          <Text
            style={{
              ...FontSize.Antz_Minor_Medium,
              alignItems: "center",
              color: constThemeColor?.onPrimaryContainer,
              marginLeft: Spacing.mini,
            }}
          >
            {item.animal_count ?? "-"}
          </Text>
          <Text
            style={[
              {
                ...FontSize.Antz_Subtext_Regular,
                color: constThemeColor.onSurfaceVariant,
                marginLeft: Spacing.micro,
              },
            ]}
          >
            {"Animal(s)"}
          </Text>
        </View>
        <View>
          <Text
            style={{
              ...FontSize.Antz_Minor_Medium,
              alignItems: "center",
              color: constThemeColor?.onPrimaryContainer,
              marginLeft: Spacing.mini,
            }}
          >
            {groupedData?.length ?? "-"}
          </Text>
          <Text
            style={[
              {
                ...FontSize.Antz_Subtext_Regular,
                color: constThemeColor.onSurfaceVariant,
                marginLeft: Spacing.micro,
              },
            ]}
          >
            {"Medicine(s)"}
          </Text>
        </View>
        <View>
          <Text
            style={{
              ...FontSize.Antz_Minor_Medium,
              alignItems: "center",
              color: constThemeColor?.onPrimaryContainer,
              marginLeft: Spacing.mini,
            }}
          >
            {item?.dispense_items?.reduce((acc, crr) => acc + crr?.qty, 0) ??
              "-"}
          </Text>
          <Text
            style={[
              {
                ...FontSize.Antz_Subtext_Regular,
                color: constThemeColor.onSurfaceVariant,
                marginLeft: Spacing.micro,
              },
            ]}
          >
            {"Total Quantity"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
