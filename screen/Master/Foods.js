//Create by:Wasim Akram

import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "../../components/Header";
import InputBox from "../../components/InputBox";
import NewDropdown from "../../components/Dropdown";
import FontSize from "../../configs/FontSize";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const feedTypeItems = [
  {
    category_id: 1,
    category_name: "Select Education Type",
    category_type: 1,
    isExpanded: true,
    subcategory: [
      {
        id: "1",
        val: "Section",
      },
      {
        id: "2",
        val: "Encloser",
      },
      {
        id: "3",
        val: "Animal",
      },
      {
        id: "4",
        val: "Category",
      },
      {
        id: "5",
        val: "Subcategory",
      },
      {
        id: "6",
        val: "Common Name",
      },
    ],
  },
]

const GroupNameItem = [
  {
    category_id: 1,
    category_name: "Select Group Name",
    category_type: 1,
    isExpanded: true,
    subcategory: [
      {
        id: "1",
        val: "Gym",
      },
      {
        id: "2",
        val: "Kg",
      },
      {
        id: "3",
        val: "Ltr",
      },
    ],
  },
]
const expiryDateItems = [
  {
    category_id: 1,
    category_name: "Select expiry Date",
    category_type: 1,
    isExpanded: true,
    subcategory: [
      {
        id: "1",
        val: "Yes",
      },
      {
        id: "2",
        val: "No",
      },
    ],
  },
]

const openingItems = [
  {
    category_id: 1,
    category_name: "Select Opening Items",
    category_type: 1,
    isExpanded: true,
    subcategory: [
      {
        id: "1",
        val: "Yes",
      },
      {
        id: "2",
        name: "No",
      },
    ],
  },
]

export default function Foods(props) {
  const [names, setNames] = useState("");
  const [feedType, setFeedType] = useState("");
  const [groupName, setGroupName] = useState("");
  const [HSNCode, setHSNCode] = useState("");
  const [gst, setGST] = useState("");
  const [salesPrice, setSalesPrice] = useState("")
  const [energy, setEnergy] = useState("")
  const [protein, setProtein] = useState("")
  const [fat, setFat] = useState("")
  const [fiber, setFiber] = useState("")
  const [carbs, setCarbs] = useState("")
  const [sugar, setSugar] = useState("")
  const [minerals, setMinerals] = useState("")
  const [vitaminA, setVitaminA] = useState("")
  const [vitaminB, setVitaminB] = useState("")
  const [vitaminC, setVitaminC] = useState("")
  const [vitaminD, setVitaminD] = useState("")
  const [vitaminb, setVitaminb] = useState("")
  const [calcium, setCalcium] = useState("");
  const [potassium, setPotassium] = useState("");
  const [iron, setIron] = useState("");
  const [expiryDateData, setExpiryDateData] = useState(null);
  const [openingStockData, setOpeningStockData] = useState(null);


  const getFeedTypeData = (item) => {
    const dataFeedType = item.val
    setFeedType(dataFeedType)
  }
  const getGroupNameData = (item) => {
    const dataGroupName = item.val
    setGroupName(dataGroupName)
  }
  const getExpiryDateData = (item) => {
    const dataExpiryDate = item.val
    setExpiryDateData(dataExpiryDate)
  }
  const getOpeningStockData = (item) => {
    const dataOpeningStock = item.val
    setOpeningStockData(dataOpeningStock)
  }
  // fot taking styles from redux use this function 
     const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
     const reduxColors = styles(constThemeColor);
  return (
    <View style={reduxColors.maincontainer}>
      <Header />
      <View style={reduxColors.Container}>
        <ScrollView>
          {/* Assign For */}
          <InputBox
            inputLabel={"Name"}
            placeholder={"Enter Name"}
            onChange={(val) => setNames(val)}
            value={names}
          />
          <NewDropdown
            title="Feed Type"
            data={feedTypeItems}
            afterPressDropdown={getFeedTypeData}
          />
          {/* Group Name */}
          <View style={{ marginTop: 10 }}>
            <NewDropdown
              title="Group Name"
              data={GroupNameItem}
              afterPressDropdown={getGroupNameData}
            />
          </View>
          <InputBox
            inputLabel={"HSN Code"}
            placeholder={"Enter HSN Code"}
            onChange={(val) => setHSNCode(val)}
            value={HSNCode}
          />
          <InputBox
            inputLabel={"GST"}
            placeholder={"Enter GST"}
            onChange={(val) => setGST(val)}
            value={gst}
          />
          <InputBox
            inputLabel={"Sales Price"}
            placeholder={"Enter Sales Price"}
            onChange={(val) => setSalesPrice(val)}
            value={salesPrice}
          />
          <InputBox
            inputLabel={"Energy"}
            placeholder={"Enter Energy"}
            onChange={(val) => setEnergy(val)}
            value={energy}
          />
          <InputBox
            inputLabel={"Protein"}
            placeholder={"Enter Protein"}
            onChange={(val) => setProtein(val)}
            value={protein}
          />
          <InputBox
            inputLabel={"Fat"}
            placeholder={"Enter Fat"}
            onChange={(val) => setFat(val)}
            value={fat}
          />
          <InputBox
            inputLabel={"Fiber"}
            placeholder={"Enter Fiber"}
            onChange={(val) => setFiber(val)}
            value={fiber}
          />
          <InputBox
            inputLabel={"Carbs"}
            placeholder={"Enter Carbs"}
            onChange={(val) => setCarbs(val)}
            value={carbs}
          />
          <InputBox
            inputLabel={"Minerals"}
            placeholder={"Enter Minerals"}
            onChange={(val) => setMinerals(val)}
            value={minerals}
          />
          <InputBox
            inputLabel={"Sugar"}
            placeholder={"Enter Sugar"}
            onChange={(val) => setSugar(val)}
            value={sugar}
          />
          <InputBox
            inputLabel={"Vitamin A"}
            placeholder={"Enter Vitamin A"}
            onChange={(val) => setVitaminA(val)}
            value={vitaminA}
          />
          <InputBox
            inputLabel={"Vitamin B"}
            placeholder={"Enter Vitamin B"}
            onChange={(val) => setVitaminB(val)}
            value={vitaminB}
          />
          <InputBox
            inputLabel={"Vitamin C"}
            placeholder={"Enter Vitamin C"}
            onChange={(val) => setVitaminC(val)}
            value={vitaminC}
          />
          <InputBox
            inputLabel={"Vitamin D"}
            placeholder={"Enter Vitamin D"}
            onChange={(val) => setVitaminD(val)}
            value={vitaminD}
          />
          <InputBox
            inputLabel={"Vitamin B 12"}
            placeholder={"Enter Vitamin B 12"}
            onChange={(val) => setVitaminb(val)}
            value={vitaminb}
          />
          <InputBox
            inputLabel={"Calcium"}
            placeholder={"Enter Calcium"}
            onChange={(val) => setCalcium(val)}
            value={calcium}
          />
          <InputBox
            inputLabel={"Iron"}
            placeholder={"Enter Iron"}
            onChange={(val) => setIron(val)}
            value={iron}
          />
          <InputBox
            inputLabel={"Potassium"}
            placeholder={"Enter Potassium"}
            onChange={(val) => setPotassium(val)}
            value={potassium}
          />
          <NewDropdown
            title="Expiry Date"
            data={expiryDateItems}
            afterPressDropdown={getExpiryDateData}
          />
          <NewDropdown
            title="Opening Stock"
            data={openingItems}
            afterPressDropdown={getOpeningStockData}
          />

        </ScrollView>
      </View>
    </View>
  );
}

const styles =(reduxColors)=> StyleSheet.create({
  maincontainer: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: reduxColors.onPrimary,
    flex: 1,
    alignItems: "center",
  },

  Container: {
    flex: 1,
    width: "89%",
    marginVertical: 5,
    // backgroundColor:"red",
  },

  Label: {
    top: "3%",
  },
  inputContainer: {
    flex: 1,
    // width: "90%",
    position: "relative",
  },
  inputFlieds: {
    fontSize: FontSize.Antz_Body_Regular.fontSize,
    color: reduxColors.neutralPrimary,
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  dropMark: {
    position: "absolute",
    right: 5,
    top: 45,
  },
  Label1: {
    top: "3%",
  },
  inputFlieds1: {
    fontSize: FontSize.Antz_Body_Regular.fontSize,
    color: reduxColors.neutralPrimary,
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  SlideUp: {
    position: "absolute",
    bottom: 0,
  },
});
