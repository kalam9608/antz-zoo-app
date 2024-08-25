import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Loader from "../../components/Loader";
import { getPersonalDetails } from "../../services/staffManagement/addPersonalDetails";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../configs/Colors";
import { useToast } from "../../configs/ToastConfig";

const ShowPersonalDetails = (props) => {
  const navigation = useNavigation();
  const [user_id, setuser_id] = useState(
    props.route.params?.item?.user_id ?? 0
  );
  const [isLoading, setIsLoading] = useState(false);
  const [personalDetails, setPersonalDetails] = useState();
  const { successToast, errorToast, alertToast, warningToast } = useToast();
  useEffect(() => {
    setIsLoading(true);
    getPersonalDetails({ user_id: user_id })
      .then((response) => {
        setPersonalDetails(response);
      })
      .catch((error) => errorToast("error","Oops! omething went wrong!!"))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Loader loaderSize={"lg"} visible={isLoading} />
      <Header title="User Personal Details" noIcon={true} />
      {!personalDetails?.is_success ? (
        <View>
          <Text>No data Found</Text>
        </View>
      ) : (
        <View style={styles.innerContainer}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={{ marginHorizontal: 5 }}>User Id : </Text>
              <Text style={{ marginHorizontal: 5 }}>
                {personalDetails.user_details.user_id}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={{ marginHorizontal: 5 }}>Name : </Text>
              <Text style={{ marginHorizontal: 5 }}>
                {personalDetails.user_details.user_first_name}{" "}
                {personalDetails.user_details.user_last_name}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={{ marginHorizontal: 5 }}>Email : </Text>
              <Text style={{ marginHorizontal: 5 }}>
                {personalDetails.user_details.user_email}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={{ marginHorizontal: 5 }}>Mobile Number : </Text>
              <Text style={{ marginHorizontal: 5 }}>
                {personalDetails.user_details.user_mobile_number}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={{ marginHorizontal: 5 }}>Gender : </Text>
              <Text style={{ marginHorizontal: 5 }}>
                {personalDetails.user_details.user_gender}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={{ marginHorizontal: 5 }}>Date of Birth : </Text>
              <Text style={{ marginHorizontal: 5 }}>
                {personalDetails.user_details.user_dob}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={{ marginHorizontal: 5 }}>Blood Group : </Text>
              <Text style={{ marginHorizontal: 5 }}>
                {personalDetails.user_details.user_blood_grp}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={{ marginHorizontal: 5 }}>Marital Status : </Text>
              <Text style={{ marginHorizontal: 5 }}>
                {personalDetails.user_details.user_marital_status}
              </Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <Text style={{ marginHorizontal: 5 }}>Address : </Text>
              <Text style={{ marginHorizontal: 5 }}>
                {personalDetails.user_details.user_address}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
    //   <View style={styles.container}>
    //     <Header noIcon={true} title={'User Personal Details'} />
    //     {
    //       ! personalDetails.is_success
    //         ? <Text>Wait a second!</Text>
    //          :  <View style={styles.outerContainer}>
    //             {
    //               ! personalDetails.hasOwnProperty('user_details')
    //                 ? <Loader
    //                     loaderColor="primary.500"
    //                     loaderSize="lg"
    //                     loaderText='Loading...'
    //                     loaderTextStyle={{
    //                       fontSize :  20,
    //                       color :  "red",
    //                       marginLeft :  6
    //                     }}
    //                     flexDirection="column"
    //                   />
    //                  :
    //                   // (<View style={styles.card}>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.user_first_name}</Text>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.user_last_name}</Text>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.user_id}</Text>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.user_email}</Text>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.user_mobile_number}</Text>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.user_gender}</Text>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.user_dob}</Text>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.user_blood_grp}</Text>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.user_marital_status}</Text>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.user_address}</Text>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.created_at}</Text>
    //                   //   <Text style={styles.cardItem}>{personalDetails.user_details.modified_at}</Text>
    //                   // </View>)
    //                   (
    //                     <View style={styles.innerContainer}>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>First Name : </Text>
    //                         <Text>{personalDetails.user_details.user_first_name}</Text>
    //                       </View>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>Last Name : </Text>
    //                         <Text>{personalDetails.user_details.user_last_name}</Text>
    //                       </View>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>User Id : </Text>
    //                         <Text>{personalDetails.user_details.user_id}</Text>
    //                       </View>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>Email : </Text>
    //                         <Text>{personalDetails.user_details.user_email}</Text>
    //                       </View>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>Mobile Number : </Text>
    //                         <Text>{personalDetails.user_details.user_mobile_number}</Text>
    //                       </View>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>Gender : </Text>
    //                         <Text>{personalDetails.user_details.user_gender}</Text>
    //                       </View>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>Date of Birth : </Text>
    //                         <Text>{personalDetails.user_details.user_dob}</Text>
    //                       </View>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>Blood Group : </Text>
    //                         <Text>{personalDetails.user_details.user_blood_grp}</Text>
    //                       </View>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>Marital Status : </Text>
    //                         <Text>{personalDetails.user_details.user_marital_status}</Text>
    //                       </View>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>Address : </Text>
    //                         <Text>{personalDetails.user_details.user_address}</Text>
    //                       </View>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>Created At : </Text>
    //                         <Text>{personalDetails.user_details.created_at}</Text>
    //                       </View>
    //                       <View style={styles.row}>
    //                         <Text style={{ marginHorizontal :  5 }}>Modified At : </Text>
    //                         <Text>{personalDetails.user_details.modified_at}</Text>
    //                       </View>
    //                     </View>
    //                   )
    //             }
    //         </View>
    //     }
    //   </View>
    // </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  card: {
    width: "100%",
    padding: "2%",
    borderWidth: 1,
    borderColor: "darkgrey",
    marginVertical: "10%",
  },
  cardItem: {
    marginVertical: "1%",
  },
  loader: {
    marginTop: "50%",
  },
  outerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  innerContainer: {
    backgroundColor: "rgba(100,100,100,0.2)",
    padding: 10,
    marginVertical: 20,
    marginHorizontal: 10,
    borderRadius: 12,
    width: "90%",
  },
  row: {
    flexDirection: "row",
    height: 50,
    borderBottomWidth: 1,
    alignItems: "center",
    borderColor: Colors.mediumGrey,
    justifyContent: "space-between",
  },
  column: {
    borderWidth: 1,
    borderColor: Colors.mediumGrey,
    borderRadius: 12,
  },
});

export default ShowPersonalDetails;
