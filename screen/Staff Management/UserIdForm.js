import { View, Text,TouchableOpacity} from 'react-native'
import React from 'react'
import DocumentUpload from '../../components/DocumentUpload';
import styles from '../../configs/Styles';
import CustomForm from '../../components/CustomForm';
import InputBox from '../../components/InputBox';
import NewDropdown from "../../components/Dropdown";
import FontSize from '../../configs/FontSize';

const items = [
	{
		category_id: 1,
		category_name: "Choose Service",
		category_type: 1,
		isExpanded: true,
		subcategory: [
			{
				id: 1,
				val: "Passport",
			},
			{
				id: 2,
				val: "Aadhar Card",
			},
		],
	},
];

let type = "";

const UserIdForm = () => {
	const [DocumentType, setDocumentType] = React.useState("");
	const [Document, setDocument] = React.useState([]);
	const [value, setValue] = React.useState("");

	const getDataDocumentType = (item) => {
		type = item.val;
		setDocumentType(type);
	};

	return (
		<CustomForm header={true} title={"User Id Form"}>
			<NewDropdown
				title="Type"
				data={items}
				afterPressDropdown={getDataDocumentType}
				// errors={errorMessage.DocumentType}
				// isError={isError.DocumentType}
			/>

			<InputBox
				inputLabel={"Value"}
				placeholder={"Value"}
				onChange={(val) => setValue(val)}
				value={value}
			/>

			<View>
				<Text
					style={[
						styles.Label,
						{ fontSize: FontSize.Antz_Body_Title.fontSize, color: "grey", fontWeight: FontSize.Antz_Body_Title.fontWeight },
					]}
				>
					File
				</Text>
				<DocumentUpload
					uploadable={true}
					type={"document"}
					items={[...Document]}
					onChange={(value) => {
						setDocument(value);
					}}
				/>
			</View>

			<TouchableOpacity style={styles.nextBtn}>
				<Text style={styles.btnText}>Next</Text>
			</TouchableOpacity>
		</CustomForm>
	);
};

export default UserIdForm;