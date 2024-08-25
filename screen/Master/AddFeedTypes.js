//Create by:Nilesh kumar

import { View, Text, TouchableOpacity } from 'react-native'
import globalStyles from "../../configs/Styles"
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TriangleColorPicker, toHsv } from 'react-native-color-picker'
import Colors from '../../configs/Colors';
import React, { useState } from 'react'
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";
import { useSelector } from 'react-redux';


const AddFeedTypes = (props) => {
	const [isColorPickeropen, setisColorPickerOpen] = useState(false);
	const [color, setColor] = useState(Colors.primary);
	const [feed, setFeed] = useState("");

	const toogleColorPicker = () => {
		setisColorPickerOpen(!isColorPickeropen);
	};

	const onColorChange = (color) => {
		let hex = hsv2rgb(color.h, color.s, color.v);
		setColor(hex);
	};

	const hsv2rgb = (H, S, V) => {
		var V2 = V * (1 - S);
		var r =
			(H >= 0 && H <= 60) || (H >= 300 && H <= 360)
				? V
				: H >= 120 && H <= 240
				? V2
				: H >= 60 && H <= 120
				? mix(V, V2, (H - 60) / 60)
				: H >= 240 && H <= 300
				? mix(V2, V, (H - 240) / 60)
				: 0;
		var g =
			H >= 60 && H <= 180
				? V
				: H >= 240 && H <= 360
				? V2
				: H >= 0 && H <= 60
				? mix(V2, V, H / 60)
				: H >= 180 && H <= 240
				? mix(V, V2, (H - 180) / 60)
				: 0;
		var b =
			H >= 0 && H <= 120
				? V2
				: H >= 180 && H <= 300
				? V
				: H >= 120 && H <= 180
				? mix(V2, V, (H - 120) / 60)
				: H >= 300 && H <= 360
				? mix(V, V2, (H - 300) / 60)
				: 0;

		return (
			"#" +
			componentToHex(Math.round(r * 255)) +
			componentToHex(Math.round(g * 255)) +
			componentToHex(Math.round(b * 255))
		);
	};

	const componentToHex = (c) => {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	};

	const mix = (a, b, v) => {
		return (1 - v) * a + v * b;
	};
	const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
	// const reduxColors = styles(constThemeColor);
	return (
		<CustomForm header={true}>

			<InputBox
				inputLabel={"Feed Type"}
				placeholder={"Feed Type"}
				onChange={(val) => setFeed(val)}
				value={feed}
			/>
			<View style={[globalStyles.fieldBox]}>
				<Text style={globalStyles.labelName}>Color</Text>
				<TouchableOpacity
					style={[
						globalStyles.justifyContentCenter,
						globalStyles.borderColor,
						globalStyles.borderWidth1,
						{ backgroundColor: `${color}`, padding: 10 },
					]}
					onPress={toogleColorPicker}
				>
					<MaterialIcons name="colorize" size={24} color={constThemeColor.neutralPrimary} />
				</TouchableOpacity>
			</View>
			<View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
				<Text style={globalStyles.labelName}>Icon</Text>
				<TouchableOpacity
					activeOpacity={1}
					style={[globalStyles.imageContainer]}
					// onPress={this.chooseTagIcon}
				>
					<Ionicons name="image" size={35} />
				</TouchableOpacity>
			</View>
		

			{isColorPickeropen ? (
				<View style={[globalStyles.flex1, { padding: 30 }]}>
					<View
						style={[
							globalStyles.flexDirectionRow,
							globalStyles.justifyContentCenter,
							globalStyles.alignItemsCenter,
						]}
					>
						<Text style={globalStyles.labelName}>Pick any Color</Text>
						<TouchableOpacity
							style={globalStyles.closeButton}
							onPress={toogleColorPicker}
						>
							<Ionicons
								name="close-outline"
								style={globalStyles.closeButtonText}
							/>
						</TouchableOpacity>
					</View>
					<TriangleColorPicker
						oldColor={
							props.route.params?.item?.color
								? props.route.params?.item?.color
								: Colors.primary
						}
						// oldColor={Colors.primary}
						color={color}
						onColorChange={onColorChange}
						onColorSelected={(color) => alert(`Color selected: ${color}`)}
						onOldColorSelected={(color) =>
							alert(`Old color selected: ${color}`)
						}
						style={{ flex: 1 }}
					/>
				</View>
			) : null}
		</CustomForm>

	);
};

export default AddFeedTypes