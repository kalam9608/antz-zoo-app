import React, { useRef, useState } from "react";
import { WebView } from "react-native-webview";
import Header from "../components/Header";
import { Dimensions, ScrollView } from "react-native";
import { RefreshControl } from "react-native";
import { StyleSheet } from "react-native";

const WebViewScreen = ({ route }) => {
  const { url } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [height, setHeight] = useState(Dimensions.get("screen").height);
  const webViewRef = useRef(null);

  const onRefresh = () => {
    setRefreshing(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <>
      <Header title="Help & Support" noIcon={true} hideMenu={true} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.view}
      >
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={[styles.view, { height }]}
        />
        
      </ScrollView>
    </>
  );
};

export default WebViewScreen;
const styles = StyleSheet.create({
  view: { flex: 1,  },
});
