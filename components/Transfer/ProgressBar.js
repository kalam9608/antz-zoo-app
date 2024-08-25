import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Spacing from "../../configs/Spacing";

const transferStatuses = {
  intra: ["APPROVED", "COMPLETED"],
  external: [
    "CHECKED_TEMPERATURE",
    "LOADED_ANIMALS",
    "RIDE_STARTED",
    "SECURITY_CHECKOUT_ALLOWED",
  ],
  inter: [
    "CHECKED_TEMPERATURE",
    "LOADED_ANIMALS",
    "RIDE_STARTED",
    "SECURITY_CHECKOUT_ALLOWED",
    "DESTINATION_VEHICLE_ARRIVED",
    "SECURITY_CHECKIN_ALLOWED",
    "REACHED_DESTINATION",
    "COMPLETED",
  ],
};

const ProgressBar = ({ logs, transferType }) => {
  const constThemeColor = useSelector((state) => state.darkMode?.theme?.colors);
  const reduxColors = styles(constThemeColor);
  const statuses = transferStatuses[transferType?.toLowerCase()];
  const completedStatuses = logs?.filter((log) =>
    statuses?.includes(log?.status)
  );
  const progress = (completedStatuses?.length / statuses?.length) * 100;

  return (
    <View style={reduxColors.container}>
      <View style={reduxColors.progressBarContainer}>
        <View style={[reduxColors.progressBar, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};
export default ProgressBar;
const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      padding: Spacing.small,
      justifyContent: "center",
      alignItems: "center",
    },
    progressBarContainer: {
      height: Spacing.small,
      width: "95%",
      backgroundColor: "#0000001A",
      borderRadius: Spacing.small,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: reduxColors.onSurface,
      borderRadius: Spacing.small,
    },
  });


