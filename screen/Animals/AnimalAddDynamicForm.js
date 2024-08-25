import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Loader from "../../components/Loader";
import Header from "../../components/Header";

import { getDynamicForm } from "../../services/EggsService";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import Category from "../../components/DropDownBox";
import { listAccessionType } from "../../services/AccessionService";
import { DynamicForm } from "../../components/DynamicForm";
import { getObjFromDynamicForm } from "../../utils/Utils";
import { addAnimal } from "../../services/AnimalService";
import { errorToast } from "../../utils/Alert";

export default class AnimalAddDynamicForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      formData: [],
      accTypeData: [],
      accType: "",
      accTypeId: "",
      isaccTypeMenuOpen: false,
      formObj: {},
      isError: {},
      errorMessage: {},
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      "focus",
      this.onScreenFocus
    );
  }

  onScreenFocus = () => {
    this.setState(
      {
        isLoading: true,
        users: [],
      },
      () => {
        this.getData();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  getData = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        listAccessionType()
          .then((response) => {
            this.setState({
              isLoading: false,
              accTypeData: response.data.map((item) => {
                return {
                  id: item.accession_id,
                  name: item.accession_type,
                };
              }),
            });
          })
          .catch((error) => errorToast("Oops!", "Something went wrong!!"));
      }
    );
  };

  loadDynamicFormData = (item) => {
    this.setState(
      {
        isLoading: true,
        accType: item[0].name,
        accTypeId: item[0].id,
        isaccTypeMenuOpen: !this.state.isaccTypeMenuOpen,
      },
      () => {
        let obj = {
          field_id: item[0].id,
          purpose: "Add",
          form_name: "Animal",
        };
        getDynamicForm(obj)
          .then((response) => {
            this.setState({
              isLoading: false,
              formData: response.data != null ? response.data.data : null,
            });
          })
          .catch((error) => errorToast("Oops!", "Something went wrong!!"));
      }
    );
  };

  setFormData = (data) => {
    this.setState({ formData: data, formObj: getObjFromDynamicForm(data) });
  };

  onSubmit = () => {
    let obj = this.state.formObj;
    obj.parent_id = "1";
    obj.accession_type = this.state.accTypeId;

    obj.description = "Testing";
    this.setState(
      {
        isLoading: true,
      },
      () => {
        addAnimal(obj)
          .then((response) => {
            this.setState({
              isLoading: false,
            });
            if (response.success) {
              alert(message);
              this.props.navigation.goBack();
            } else {
              alert("Something went wrong!!");
            }
          })
          .catch((error) => {
            this.setState({
              isLoading: false,
            });
            alert("Something went wrong!!");
          });
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.isLoading} />

        <CustomForm
          header={true}
          title={"Add Animals"}
          marginBottom={60}
          onPress={this.onSubmit}
        >
          <InputBox
            inputLabel={"Accession Type"}
            placeholder={"Choose Accession Type"}
            editable={false}
            value={this.state.accType}
            defaultValue={
              this.state.accType != null ? this.state.accType : null
            }
            rightElement={
              this.state.isaccTypeMenuOpen ? "menu-up" : "menu-down"
            }
            DropDown={() =>
              this.setState({
                isaccTypeMenuOpen: !this.state.isaccTypeMenuOpen,
              })
            }
            errors={this.state.errorMessage.accType}
            isError={this.state.isError.accType}
          />
          {this.state.formData == null ? (
            <Text style={{ color: "tomato", textAlign: "center" }}>
              No Form found for this Accession Type!!
            </Text>
          ) : (
            <DynamicForm
              formData={this.state.formData}
              setFormData={this.setFormData}
              isLoading={this.state.isLoading}
            />
          )}
        </CustomForm>
        {this.state.isaccTypeMenuOpen ? (
          // <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Category
              categoryData={this.state.accTypeData}
              onCatPress={this.loadDynamicFormData}
              heading={"Choose Accession Type"}
              isMulti={false}
              onClose={() =>
                this.setState({
                  isaccTypeMenuOpen: !this.state.isaccTypeMenuOpen,
                })
              }
            />
          // </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
  },
});
