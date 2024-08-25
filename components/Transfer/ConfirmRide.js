import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  animalListBySpecies,
  getChekoutList,
  updateTransferStatus,
} from "../../services/Animal_movement_service/MoveAnimalService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomBottomSheet from "./CustomBottomSheet";
import Loader from "../Loader";
import { useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";
import Spacing from "../../configs/Spacing";
import FontSize from "../../configs/FontSize";
import { useToast } from "../../configs/ToastConfig";

const ConfirmRide = (props) => {
  const [allAnimalList, setAllAnimalList] = useState([]);
  const [allAnimalCount, setAllAnimalCount] = useState(0);
  const [selectAnimals, setSelectedAnimals] = useState(
    props?.route?.params?.selectAnimals ?? []
  );
  const [loadCount, setLoadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [seletedIds, setSelectedIds] = useState([]);
  const navigation = useNavigation();
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const { showToast, errorToast, successToast, warningToast } = useToast();
  const reduxColors = styles(constThemeColor);
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      fetchAllAnimal(props?.route?.params?.animal_movement_id);
    }, [props?.route?.params?.animal_movement_id])
  );

  const fetchAllAnimal = (id) => {
    setIsLoading(true);
    getChekoutList({
      animal_movement_id: id,
      type: "start_ride",
    })
      .then((res) => {
        if (res?.success) {
          setAllAnimalCount(res?.data?.total_animal_count);
          setAllAnimalList(res.data?.result);
          setLoadCount(res.data?.type_wise_count);
          setSelectedIds(
            res.data?.animal_ids?.map((v) => Number(v?.entity_id))
          );
        } else {
          errorToast("error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        errorToast("error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const closeAnimalSheet = () => {
    navigation.goBack();
    if (props?.route?.params?.screen === "LoadAnimal") {
      props?.moveToBack;
    }
  };

  const submit = () => {
    const obj = {
      movement_id: props?.route?.params?.animal_movement_id,
      status: "RIDE_STARTED",
    };
    setIsLoading(true);
    updateTransferStatus(obj)
      .then((res) => {
        if (res?.success) {
          successToast("success", res?.message);
          // navigation.goBack();
          // navigation.navigate("ApprovalSummary", {
          //   animal_movement_id: props?.route?.params?.animal_movement_id,
          //   site_id: '',
          //   screen: "site",
          //   reference: "list",
          // });
          navigation.navigate("TransferQR", {
            qrUrl: props?.route.params?.qr_code_full_path,
            id: props?.route.params?.request_id,
            animalMovementId: props?.route.params?.animal_movement_id,
            screen: props?.route.params?.screen,
          });
        } else {
          errorToast("error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log({ err });
        errorToast("error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchAllAnimalCheckout = () => {
    // setIsLoading(true);
    getChekoutList({
      animal_movement_id: props?.route?.params?.animal_movement_id,
      type: "security_check_out",
    })
      .then((res) => {
        if (res?.success) {
          const animalIds = [];
          res?.data?.result.forEach((item) => {
            if (item.animal_details) {
              item.animal_details.forEach((detail) => {
                if (detail.animal_id) {
                  animalIds.push(detail);
                }
              });
            }
          });
          navigation.navigate("AnimalChecklist", {
            type: "checkList",
            animal_movement_id: props?.route?.params?.animal_movement_id,
            selectAnimals: animalIds,
            edit: true,
            screen: props?.route?.params?.screen,
            status: props?.route?.params?.trasferStatus,
            loadCount: loadCount,
            qr_code_full_path: props?.route.params?.qr_code_full_path,
            request_id: props?.route.params?.request_id,
          });
        } else {
          errorToast("error", "Oops! ,Something went wrong!!");
        }
      })
      .catch((err) => {
        console.log("err", err);
        errorToast("error", "Oops! ,Something went wrong!!");
      })
      .finally(() => {
        // setIsLoading(false);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader visible={isLoading} />

      <View style={{ paddingBottom: 120 }}>
        <CustomBottomSheet
          data={allAnimalList}
          type="animal"
          title="Move to Security Check"
          total={allAnimalCount}
          closeModal={closeAnimalSheet}
          loadCount={loadCount}
          loadWarning={true}
          showSwitch={false}
          allSelectedIds={(data) => setSelectedAnimals(data)}
          hideCount={true}
          trasferStatus={props?.route?.params?.trasferStatus}
          editLoad={() => {
            fetchAllAnimalCheckout()
            // navigation.navigate("AnimalChecklist", {
            //   type: "checkList",
            //   animal_movement_id: props?.route?.params?.animal_movement_id,
            //   selectAnimals: seletedIds,
            //   edit: true,
            //   screen: props?.route?.params?.screen,
            //   status: props?.route?.params?.trasferStatus,
            //   loadCount: loadCount,
            // });
          }}
          //   navigation={dnavigation}
        />
      </View>
      <View
        style={{
          minHeight: 100,
          width: "100%",
          backgroundColor: constThemeColor?.background,
          position: "absolute",
          bottom: 0,
          paddingBottom: Spacing.small,
          alignItems: "center",
        }}
      >
        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate("AnimalChecklist", {
              type: "checkList",
              animal_movement_id: props?.route?.params?.animal_movement_id,
              selectAnimals: seletedIds,
              edit: true,
            })
          }
          style={{
            alignSelf: "center",
            borderWidth: 1,
            borderColor: constThemeColor.onSurfaceVariant,
            width: "90%",
            borderRadius: Spacing.small,
            paddingVertical: Spacing.minor,
            backgroundColor: constThemeColor.background,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: Spacing.small,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: constThemeColor.onSurfaceVariant,
              fontSize: FontSize.Antz_Minor_Title.fontSize,
              fontWeight: FontSize.Antz_Minor_Title.fontWeight,
            }}
          >
            {`Edit Loaded List`}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={submit}
          style={{
            alignSelf: "center",
            borderWidth: 1,
            borderColor: constThemeColor.onPrimaryContainer,
            width: "90%",
            borderRadius: Spacing.body,
            paddingVertical: Spacing.minor,
            backgroundColor: constThemeColor.onPrimaryContainer,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: Spacing.small,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: constThemeColor.onPrimary,
              fontSize: FontSize.Antz_Major_Title_btn.fontSize,
              fontWeight: FontSize.Antz_Major_Title_btn.fontWeight,
            }}
          >
            {`Move to Security Check`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmRide;

const styles = (reduxColors) => StyleSheet.create({});
