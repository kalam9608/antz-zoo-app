import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

const onPressButton = (onPress) => {
  if (typeof onPress != "undefined") {
    onPress();
  }
  Dialog.hide();
};

const onPressCancelButton = (onCancel) => {
  if (typeof onCancel != "undefined") {
    onCancel();
  }
  Dialog.hide();
};

export const successDailog = (
  title,
  body,
  buttonTitle,
  onPress,
  cancelButtonTile,
  onCancel
) => {
  Dialog.show({
    type: ALERT_TYPE.SUCCESS,
    title: title,
    textBody: body,
    button: buttonTitle,
    onPressButton: () => {
      onPressButton(onPress);
    },
    cancelButton: cancelButtonTile,
    onPressCancelButton: () => {
      onPressCancelButton(onCancel);
    },
  });
};

export const errorDailog = (
  title,
  body,
  buttonTitle,
  onPress,
  cancelButtonTile,
  onCancel
) => {
  Dialog.show({
    type: ALERT_TYPE.DANGER,
    title: title,
    textBody: body,
    button: buttonTitle,
    onPressButton: () => {
      onPressButton(onPress);
    },
    cancelButton: cancelButtonTile,
    onPressCancelButton: () => {
      onPressCancelButton(onCancel);
    },
  });
};

export const warningDailog = (
  title,
  body,
  buttonTitle,
  onPress,
  cancelButtonTile,
  onCancel
) => {
  Dialog.show({
    type: ALERT_TYPE.WARNING,
    title: title,
    textBody: body,
    button: buttonTitle,
    onPressButton: () => {
      onPressButton(onPress);
    },
    cancelButton: cancelButtonTile,
    onPressCancelButton: () => {
      onPressCancelButton(onCancel);
    },
  });
};

export const successToast = (title, body) => {
  Toast.show({
    type: ALERT_TYPE.SUCCESS,
    title: title,
    textBody: body,
    onPress: () => {
      Toast.hide();
    },
    onLongPress: () => {
      Toast.hide();
    },
  });
};

export const errorToast = (title, body) => {
  Toast.show({
    type: ALERT_TYPE.DANGER,
    title: title,
    textBody: body,
    onPress: () => {
      Toast.hide();
    },
    onLongPress: () => {
      Toast.hide();
    },
  });
};
export const warningToast = (title, body) => {
  Toast.show({
    type: ALERT_TYPE.WARNING,
    title: title,
    textBody: body,
    onPress: () => {
      Toast.hide();
    },
    onLongPress: () => {
      Toast.hide();
    },
  });
};
