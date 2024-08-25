import React, { useEffect, useRef } from "react";
import { AppState, InteractionManager, View } from "react-native";
import { warningToast } from "../utils/Alert";

const AppInactiveChecker = (props) => {
  const appState = useRef(AppState.currentState);
  const lastInteractionTime = useRef(Date.now());

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    InteractionManager.runAfterInteractions(resetInteractionTimer);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      props.backgroundState("active");
      resetInteractionTimer();
      props.idleState("running");
    }

    if (
      appState.current === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      props.backgroundState("inactive");
    }

    appState.current = nextAppState;
  };

  const handleUserInteraction = () => {
    lastInteractionTime.current = Date.now();
  };

  const resetInteractionTimer = () => {
    lastInteractionTime.current = Date.now();

    const interactionCheckInterval = setInterval(() => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastInteractionTime.current;
      props.onTimer(inactiveTime);
      if (inactiveTime >= 30 * 60 * 1000) {
        //5 * 60 * 1000 = 5min or 30*60*1000 = 30min
        clearInterval(interactionCheckInterval);
        props.idleState("idle");
      }
    }, 1000);
  };

  return (
    <View style={{ flex: 1 }} onTouchStart={handleUserInteraction}>
      {props.children}
    </View>
  );
};

export default AppInactiveChecker;
