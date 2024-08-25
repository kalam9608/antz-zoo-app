import React from "react";
import {
  Modal,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
const deviceHeight = Dimensions.get("window").height;
import FontSize from './../configs/FontSize'
export class BottomPopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  show = () => {
    this.setState({ show: true });
  };

  close = () => {
    this.setState({ show: false });
  };
  renderOutsideTouchable(onTouch) {
    const view = <View style={{ flex: 1, width: "100%" }} />;
    if (!onTouch) return view;
    return (
      <TouchableWithoutFeedback
        onPress={onTouch}
        style={{ flex: 1, width: "100%" }}
      >
        {view}
      </TouchableWithoutFeedback>
    );
  }
  render() {
    let { show } = this.state;
    const { onTouchOutside } = this.props;
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={show}
        onRequestClose={this.close}
        style={this.props.style}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000AA",
            justifyContent: "flex-end",
          }}
        >
          {this.renderOutsideTouchable(onTouchOutside)}
          <View
            style={{
              backgroundColor: "#F2FFF8",
              width: "100%",
              paddingHorizontal: 10,
              maxHeight: deviceHeight * 0.55,
              borderTopRightRadius: 40,
              borderTopLeftRadius: 40,
            }}
          >
           
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: FontSize.Antz_Major_Title.fontSize,
                  fontWeight:  FontSize.Antz_Major_Title.fontWeight,
                  top: 15,
                  marginBottom: 20,
                }}
              >
                 {this.props.title}
              </Text>
            </View>
            <View>{this.props.children}</View>
          </View>
        </View>
      </Modal>
    );
  }
}
