import * as Device from "expo-device";
import { DeviceType } from "expo-device";

export const ViewPointCalculation = ({ index }, orientation) => { 
  const isTab = Device.deviceType === DeviceType.TABLET
  const isOriented = orientation !== 1;
  
  const indexMap = {
    0: 0.5,
    1: 0.5,
    2: 0.5,
    3: 0.35,
    4: 0.32,
    5: isTab ? 0.45 : 0.28,
    6: isTab && isOriented ? 0.9 : isTab ? 0.42 : 0.22,
    7: isTab && isOriented ? 0.41 : isTab ? 0.4 : 0.2,
    8: isTab && isOriented ? 0.41 : isTab ? 0.39 : 0.15,
    9: isTab && isOriented ? 0.41 : isTab ? 0.38 : 0.12,
    10: isTab && isOriented ? 0.4 : isTab ? 0.36 : 0.07,
    11: isTab && isOriented ? 0.39 : isTab ? 0.34 : 0.04,
    12: isTab && isOriented ? 0.38 : isTab ? 0.33 : 0.01,
    13: isTab && isOriented ? 0.37 : isTab ? 0.31 : -0.05,
    14: isTab && isOriented ? 0.36 : isTab ? 0.3 : -0.1,
    15: isTab && isOriented ? 0.35 : isTab ? 0.29 : -0.13,
    16: isTab && isOriented ? 0.34 : isTab ? 0.27 : -0.17,
    17: isTab && isOriented ? 0.33 : isTab ? 0.26 : -0.2,
    18: isTab && isOriented ? 0.32 : isTab ? 0.25 : -0.23,
    19: isTab && isOriented ? 0.31 : isTab ? 0.23 : -0.27,
    20: isTab && isOriented ? 0.3 : isTab ? 0.22 : -0.33,
    21: isTab && isOriented ? 0.29 : isTab ? 0.21 : -0.37,
    22: isTab && isOriented ? 0.28 : isTab ? 0.19 : -0.4,
    23: isTab && isOriented ? 0.27 : isTab ? 0.18 : -0.45,
    24: isTab && isOriented ? 0.26 : isTab ? 0.17 : -0.5,
    25: isTab && isOriented ? 0.25 : isTab ? 0.17 : -0.53,
    26: isTab ? 0.17 : -0.57,
    27: isTab ? 0.17 : -0.62,
    28: isTab ? 0.17 : -0.67,
    29: isTab ? 0.17 : -0.7,
    30: isTab ? 0.17 : -0.7,
  };

  return indexMap[index];
};
