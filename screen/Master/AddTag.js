//Create by: Biswajit 

import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import CustomForm from "../../components/CustomForm";
import NewDropdown from "../../components/Dropdown";
import FontSize from "../../configs/FontSize";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const assignForItems = [
	{
		category_id: 1,
		category_name: "Choose Enclosure",
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

const SectionItems = [
	{
		category_id: 1,
		category_name: "Choose Section",
		category_type: 1,
		isExpanded: true,
		subcategory: [
			{
				id: "1",
				val: "Reproduction",
			},
			{
				id: "2",
				val: "Season",
			},
			{
				id: "3",
				val: "Deficiency",
			},
			{
				id: "4",
				val: "Behavioural",
			},
			{
				id: "5",
				val: "Medical Condition",
			},
			{
				id: "6",
				val: "Diet",
			},

		],
	},
]


export default function AddTag() {
	const [encloser, setEnclosure] = useState("")
	const [section, setSection] = useState("")

	const getEnclosureData = (item) => {
		const enclosuredata = item.val
			setEnclosure(enclosuredata)
	}

	const getSectionData = (item) => {
		const sectionData = item.val
		setSection(sectionData)
	}

	return (
		<>
			<CustomForm header={true} title={"Add Tag"}>
				<NewDropdown
					title="Enclosure"
					data={assignForItems}
					afterPressDropdown={getEnclosureData}
				/>
				<View style={{ marginTop: 20 }}>
					<NewDropdown
						title="Section"
						data={SectionItems}
						afterPressDropdown={getSectionData}
					/>
				</View>

			</CustomForm>

		</>

	)
};

const styles = StyleSheet.create({
	container: {
		width: windowWidth,
		height: windowHeight,
		flex: 1,
		backgroundColor: "#fff",
		alignItems: 'center',
		// position: 'relative',
	},
	Label: {
		top: "3%",
	},
	inputContainer: {
		flex: 1,
		width: "89%"
	},

	inputFlieds: {
		fontSize: FontSize.Antz_Subtext_Regular.fontSize,
		fontWeight: FontSize.Antz_Subtext_Regular.fontWeight,
		color: "black",
		borderBottomWidth: 1,
		borderColor: "grey",
	},
	iconBox: {
		width: "50%",
		bottom: 30,
		marginHorizontal: "90%",
	},

	slideUp: {
		position: 'absolute',
		bottom: 0,
	}
});
{/* <View style={styles.container}>
			<Header title="AddTag"/>
			<View style={styles.inputContainer}>
				<FormControl >
					<View>
						<FormControl.Label _text={{ fontWeight: '500', fontSize: 14 }} style={styles.Label}>Choose Section</FormControl.Label>
						{/* <View style={{flexDirection : 'row'}}> */}
		// 				<Input
		// 					variant="underlined"
		// 					placeholder="Choose Section"
		// 					editable={false}
		// 					style={styles.inputFlieds}
		// 					_focus={{ borderColor: '#2B3990', borderBottomWidth: 3 }}
		// 					defaultValue={
		// 						assignForData != null ? assignForData : null
		// 					}
		// 				/>
		// 				<View style={styles.iconBox}>
		// 					<AntDesign
		// 						onPress={() => setOpenAssignForDropdown(!openAssignForDropdown)}
		// 						name={openAssignForDropdown ? "up" : "down"}
		// 						size={24}
		// 						color="grey"
		// 					/>
		// 				</View>
		// 			</View>
		// 			<View style={{ bottom: 10 }}>
        //                 <FormControl.Label _text={{ fontWeight: '500', fontSize: 14 }} style={styles.Label}>Choose Enclosure</FormControl.Label>
        //                 {/* <View style={{flexDirection : 'row'}}> */}
        //                 <Input
        //                     variant="underlined"
        //                     placeholder="Choose Enclosure"
        //                     editable={false}
        //                     style={styles.inputFlieds}
        //                     _focus={{ borderColor: '#2B3990', borderBottomWidth: 3 }}
        //                     defaultValue={
        //                         groupNameData != null ? groupNameData : null
        //                     }
        //                 />
        //                 <View style={styles.iconBox}>
        //                     <AntDesign
        //                         onPress={() => setOpenGroupNameDropdown(!openGroupNameDropdown)}
        //                         name={openGroupNameDropdown ? "up" : "down"}
        //                         size={24}
        //                         color="grey"
        //                     />
        //                 </View>
        //             </View>
		// 		</FormControl>
		// 	</View>
		// 	{
		// 		openAssignForDropdown
		// 			?
		// 			<View style={styles.slideUp}>
		// 				<Category
		// 					categoryData={assignForItems}
		// 					onCatPress={assignForCatPressed}
		// 					heading={"Choose Section"}
		// 					userType={"admin"}
		// 					navigation={props.navigation}
		// 					permission={"Yes"}
		// 					screen={"AddCategory"}
		// 					isMulti={false}
		// 				/>
		// 			</View>
		// 			: null
		// 	}

		// 	{openGroupNameDropdown ?
		// 		<View style={styles.slideUp}>
		// 			<Category
		// 				categoryData={groupNameItems}
		// 				onCatPress={groupNameCatPressed}
		// 				heading={"Choose Section"}
		// 				userType={"admin"}
		// 				navigation={props.navigation}
		// 				permission={"Yes"}
		// 				screen={"AddCategory"}
		// 				isMulti={false}
		// 			/>
		// 		</View>
		// 		: null}
		// </View> */}