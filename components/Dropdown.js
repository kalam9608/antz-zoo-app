// Created by - Sharad yadav //
// Date - 14-March-2023 //

import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	FlatList,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import FontSize from "../configs/FontSize";

const rawData = [
	{
		category_id: 1,
		category_name: "Payment",
		category_type: 1,
		isExpanded: true,
		subcategory: [
			{
				id: 1,
				val: "Cash",
			},
			{
				id: 2,
				val: "UPI",
			},
			{
				id: 3,
				val: "card",
			},
			{
				id: 4,
				val: "online",
			},
		],
	},
	{
		category_id: 2,
		category_name: "Hotel",
		category_type: 2,
		isExpanded: true,
		subcategory: [
			{
				id: 1,
				val: "2 Star",
			},
			{
				id: 2,
				val: "3 Star",
			},
			{
				id: 3,
				val: "4 Star",
			},
			{
				id: 4,
				val: "5 Star",
			},
		],
	},
	{
		category_id: 3,
		category_name: "Car",
		category_type: 3,
		isExpanded: true,
		subcategory: [
			{
				id: 1,
				val: "Petrol",
			},
			{
				id: 2,
				val: "Diesel",
			},
			{
				id: 3,
				val: "Electric",
			},
		],
	},
	{
		category_id: 3,
		category_name: "Party",
		category_type: 3,
		isExpanded: true,
		subcategory: [],
	},
];

const { Width, Height } = Dimensions.get("window");

const NewDropdown = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isSelect, setIsSelect] = useState(false);
	const [selectedVal, setSelectedVal] = useState("");
	const [data, setData] = useState([]);
	const [subData, setSubData] = useState([]);

	useEffect(() => {
		setData(props.data);
		setSelectedVal("");
	}, []);

	const handleIconChange = () => {
		setIsOpen(!isOpen);
	};

	const handleSelectedItem = (item) => {
		setSubData(item.subcategory);
		setIsSelect(!isSelect);
	};

	const saveSelectedEmptyValue = (item) => {
		setSelectedVal(item.category_name);
		props.afterPressDropdown(item);
		setIsOpen(!isOpen);
	};

	const saveSelectedValue = (item) => {
		setSelectedVal(item.val);
		props.afterPressDropdown(item);
		setIsSelect(!isSelect);
		setIsOpen(!isOpen);
	};

	return (
		<View style={styles.container}>
			<View style={styles.dropdown}>
				<TextInput
					style={styles.input}
					value={selectedVal}
					editable={false}
					mode="outlined"
					label={props.title}
					placeholder="Please select the value"
					right={
						<TextInput.Icon
							icon="chevron-down"
							size={30}
							style={{ paddingTop: 5 }}
							onPress={handleIconChange}
						/>
					}
				/>
				{/* {/ <AntDesign onPress={handleIconChange} name={isOpen ? "up" : "down"} size={24} color="black" style={{paddingRight:"5%", alignSelf:"center" }} /> /} */}
			</View>

			{/* {/ select box to open ----->>>>> /} */}
			{isOpen ? (
				<View style={styles.dropDownBox}>
					<View style={styles.headingBox}>
						<Text
							style={{
								fontSize:FontSize.Antz_Minor_Regular.fontSize,
								fontWeight: "bold",
								color: "grey",
								left: "7%",
							}}
						>
							{props.title}
						</Text>
					</View>

					<View style={styles.contentBox}>
						<View style={styles.child1}>
							{data &&
								data.map((item) => {
									return (
										<>
											{item.subcategory.length > 0 ? (
												<TouchableOpacity
													onPress={() => handleSelectedItem(item)}
													style={styles.option}
												>
													<Text
														style={{
															left: "20%",
															color: "white",
														}}
													>
														{item.category_name}
													</Text>
													<AntDesign
														name="right"
														size={16}
														color="white"
														style={{ paddingRight: "5%" }}
													/>
												</TouchableOpacity>
											) : (
												<TouchableOpacity
													onPress={() =>
														saveSelectedEmptyValue(item)
													}
													style={styles.option}
												>
													<Text
														style={{
															left: "20%",
															color: "white",
														}}
													>
														{item.category_name}
													</Text>
												</TouchableOpacity>
											)}
										</>
									);
								})}
						</View>

						{isSelect ? (
							<View style={styles.child2}>
								{subData &&
									subData.map((item) => {
										return (
											<TouchableOpacity
												onPress={() => saveSelectedValue(item)}
												style={[
													styles.option_2,
													{ justifyContent: "center" },
												]}
											>
												<Text
													style={{ left: "20%", color: "white" }}
												>
													{item.val}
												</Text>
											</TouchableOpacity>
										);
									})}
							</View>
						) : null}
					</View>
				</View>
			) : null}
			<View style={{ width: "100%" }}>
				{props.isError ? (
					<Text style={{ color: "red", fontSize: FontSize.Antz_Body_Regular.fontSize, textAlign: "left" }}>
						{props.errors}
					</Text>
				) : null}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		width: Width,
		height: Height,
		alignItems: "center",
	},
	dropdown: {
		backgroundColor: "#fff",
		width: "100%",
		height: 60,
		justifyContent: "space-between",
		flexDirection: "row",
		borderRadius: 10,
		justifyContent: "center",
	},
	input: {
		width: "100%",
		height: 50,
		color: "black",
		borderRadius: 15,
	},
	dropDownBox: {
		backgroundColor: "red",
		width: "100%",
		height: Height,
		bottom: 5,
		top: 10,

	},
	headingBox: {
		backgroundColor: "lightgrey",
		width: "100%",
		height: 50,
		justifyContent: "center",
	},
	contentBox: {
		flex: 2,
		backgroundColor: "#253342",
		width: "100%",
		height: 350,
		flexDirection: "row",
	},
	child1: {
		backgroundColor: "#253342",
		width: "50%",
		height: "100%",
		position: "absolute",
		borderRightWidth: 1,
		borderColor: "white",
	},
	child2: {
		backgroundColor: "#253342",
		width: "50%",
		height: "100%",
		position: "absolute",
		borderRightWidth: 1,
		borderColor: "white",
		left: "50%",
	},
	option: {
		backgroundColor: "#253342",
		width: "100%",
		height: 50,
		borderWidth: 0.4,
		borderColor: "white",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	option_2: {
		backgroundColor: "#253342",
		width: "100%",
		height: 35,
		borderWidth: 0.4,
		borderColor: "white",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});

export default NewDropdown;

// Documentation ----------->>>>>>>>  //
// pass props in tag <Dropdown title={"any title"} data={data}
