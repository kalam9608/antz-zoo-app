// ToastProvider.js
// This toast config used for toast alert
import React, { useState } from "react";
import ToastModal from "../components/ToastModalCom";
import Config from "./Config";

const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setTostIcon] = useState([]);
  const [alertType, setAlertType] = useState();

  const showToast = (type, message) => {
    setToastMessage(message);
    setToastVisible(true);
    setAlertType(type);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const successToast = (type, message) => {
    setToastMessage(message);
    setToastVisible(true);
    setAlertType(Config.SUCCESS_TYPE);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };
  const errorToast = (type, message) => {
    setToastMessage(message);
    setToastVisible(true);
    setAlertType(Config.ERROR_TYPE);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };
  const alertToast = (type, message) => {
    setToastMessage(message);
    setToastVisible(true);
    setAlertType(Config.ALERT_TYPE);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };
  const warningToast = (type, message) => {
    setToastMessage(message);
    setToastVisible(true);
    setAlertType(Config.WARNING_TYPE);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const contextValue = {
    showToast,
    successToast,
    errorToast,
    alertToast,
    warningToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastModal
        isVisible={toastVisible}
        message={toastMessage}
        onClose={hideToast}
        type={alertType}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return React.useContext(ToastContext);
};
