import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Card, TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import FontSize from "../../../configs/FontSize";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const MultiCard = ({
  borderRadius,
  leftIcon,
  data,
  routeName,
  handleDropdown,
  roleValue,
  extraData,
  leftIconName,
  rightIconName
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    const styles = style(constThemeColor);

  return (
    <>
      <Card style={{ marginVertical: hp(0.5) }}>
        {routeName == "EditPermissions" && data.name == "Role" ? (
          <View style={{ marginHorizontal: 10, marginTop: 10 }}>
            <TextInput
              mode="outlined"
              label={"Choose a Role"}
              value={roleValue?.role_name}
              showSoftInputOnFocus={false}
              caretHidden={true}
              onFocus={() => handleDropdown()}
              left={
                <TextInput.Icon
                  icon={(props) => (
                    <MaterialCommunityIcons
                      {...props}
                      name="account-circle-outline"
                      size={25}
                      color={constThemeColor.onPrimaryContainer}
                    />
                  )}
                />
              }
              right={
                <TextInput.Icon
                  icon={(props) => (
                    <MaterialCommunityIcons
                      {...props}
                      name="chevron-down"
                      size={25}
                      color={"red"}
                      onPress={() => handleDropdown()}
                    />
                  )}
                />
              }
            />
          </View>
        ) : routeName == "EditPermissions" && data?.name == "Add Users" ? (
          <Card.Title
            title={<Text style={styles.adminText}>Allow Creating Roles</Text>}
            left={() => (
              <MaterialCommunityIcons
                name="playlist-plus"
                size={36}
                color={constThemeColor.onPrimaryContainer}
              />
            )}
            right={() => (
              <MaterialCommunityIcons
                name="chevron-right"
                size={36}
                color={constThemeColor.onPrimaryContainer}
                style={{ marginRight: 10 }}
              />
            )}
            style={{
              // backgroundColor: cardBackground?.headerBackgroundColor,
            }}
          />
        ) : (
          <Card.Title
            title={<Text style={styles.permissionCardText}>{data?.name}</Text>}
            subtitle={
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="checkmark"
                  style={{ padding: wp(0) }}
                  color={constThemeColor.onPrimaryContainer}
                  size={20}
                />
                <Text style={styles.permissionSubtitle}>{data?.title}</Text>
              </View>
            }
            left={() => (
              <MaterialIcons name={leftIconName} size={24} style={{alignSelf:'center', paddingHorizontal: wp(1)}} />
            )}
            right={() => (
              <View style={{height:60}}>
                <MaterialIcons name={rightIconName} size={24} style={{ paddingHorizontal: wp(1) }} />
              </View>
            )}
            style={{ backgroundColor:constThemeColor.displaybgPrimary, borderRadius:8 }}
          />
        )}
        {data?.data?.length > 1 && (
          <>
            {data?.data?.map((item) => {
              return (
                <Card.Content
                  style={{
                    paddingVertical: 10,
                    backgroundColor: cardBackground?.cardBackgroundColor,
                  }}
                >
                  <View
                    style={[
                      styles.permissionCard,
                      { borderRadius: borderRadius },
                    ]}
                  >
                    <Image source={leftIcon} style={{ marginHorizontal: 10 }} />
                    <View style={{}}>
                      <Text style={styles.permissionCardText}>
                        {item?.subTitle}
                      </Text>
                      {item?.data?.map((innerItem) => {
                        return (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View style={{ padding: 5 }}>
                                <Ionicons
                                  name="checkmark"
                                  style={{ padding: 5 }}
                                  color={constThemeColor.onPrimaryContainer}
                                  size={20}
                                />
                              </View>
                              <Text style={styles.permissionSubtitle}>
                                {innerItem?.title}
                              </Text>
                            </View>
                            <View
                              style={{ flexDirection: "row", marginLeft: 30 }}
                            >
                              {innerItem?.permission?.map((i, index) => {
                                return (
                                  <Text
                                    style={{
                                      fontSize: FontSize.Antz_Subtext_Regular.fontSize,
                                      fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
                                      color: constThemeColor.onSecondaryContainer,
                                      marginRight: 3,
                                    }}
                                  >
                                    {i?.name}
                                  </Text>
                                );
                              })}
                            </View>
                          </>
                        );
                      })}
                    </View>
                  </View>
                </Card.Content>
              );
            })}
          </>
        )}
      </Card>
    </>
  );
};

const style = (reduxColor) => StyleSheet.create({
  permissionCard: {
    flexDirection: "row",
  },
  permissionCardText: {
    fontSize: FontSize.Antz_Body_Regular.fontSize,
    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    color: reduxColor.cardTextHeading,
    lineHeight: 16,
  },
  permissionSubtitle: {
    fontSize: FontSize.Antz_Minor_Medium.fontSize,
    fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    color: reduxColor.onSecondaryContainer,
    padding: wp(0),
  },
  adminText: {
    fontSize: FontSize.Antz_Minor_Medium.fontSize,
    fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
    color: reduxColor.onSurfaceVariant,
  },
});

export default MultiCard;
