import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAsyncData = async (STORAGE_KEY) => {
    try {
      let rawData = await AsyncStorage.getItem(STORAGE_KEY);
      return rawData !== null ? JSON.parse(rawData) : null;
    } catch (e) {
      throw new Error("failed data retrieve from device");
    }
  };
  
  export const saveAsyncData = async (STORAGE_KEY, value) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      throw new Error("failed data save to device");
    }
  };
  
  export const clearAsyncData = async (STORAGE_KEY) => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      throw new Error("failed to remove data from device");
    }
  };