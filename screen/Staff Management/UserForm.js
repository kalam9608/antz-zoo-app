
import React, { useState } from "react";
import CustomForm from "../../components/CustomForm";
import InputBox from "../../components/InputBox";


const items = [
    {
        category_id: 1,
        category_name: "FullAccess",
        category_type: 1,
        isExpanded: true,
        subcategory: [
            {
                id: 0,
                val: "No",
            },
            {
                id: 1,
                val: "Yes",
            },

        ],
    },
]

const UserForm = () => {
	const [RecruitmentType, setRecruitmentType] =useState("");
	const [staff, setStaff] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [department, setDepartment] = useState("");
	const [designation, setDesignation] = useState("");

	const getRecruitmentData = (item) => {
        const activeData = item.id
        setRecruitmentType(activeData)
    }

	return (
		<CustomForm header={true} title={"User Forms"}>
			<InputBox
				inputLabel={"Staff ID"}
				placeholder={"Enter Staff Id"}
				onChange={(val) => setStaff(val)}
				value={staff}
			/>
			<InputBox
				inputLabel={"First Name"}
				placeholder={"First Name"}
				onChange={(val) => setFirstName(val)}
				value={firstName}
			/>
			<InputBox
				inputLabel={"Last Name"}
				placeholder={"Last Name"}
				onChange={(val) => setLastName(val)}
				value={lastName}
			/>
			<InputBox
				inputLabel={"Email"}
				placeholder={"Email"}
				onChange={(val) => setEmail(val)}
				value={email}
			/>
			<InputBox
				inputLabel={"Password"}
				placeholder={"Password"}
				onChange={(val) => setPassword(val)}
				value={password}
			/>
			<InputBox
				inputLabel={"Department"}
				placeholder={"Department"}
				onChange={(val) => setDepartment(val)}
				value={department}
			/>
			<InputBox
				inputLabel={"Designation"}
				placeholder={"Designation"}
				onChange={(val) => setDesignation(val)}
				value={designation}
			/>
		      <NewDropdown
                        title="Type Of Recruitment"
                        data={items}
                        afterPressDropdown={getRecruitmentData}
                    />
		</CustomForm>
	);
};

export default UserForm;

{/* <FormControl isRequired>
<FormControl.Label
	_text={{ fontWeight: "400" }}
	style={styles.Label}
>
	
</FormControl.Label>
<Select
	selectedValue={RecruitmentType}
	minWidth="200"
	accessibilityLabel="Choose Service"
	placeholder="Type Of Recruitment"
	mt={1}
	onValueChange={(itemValue) => setRecruitmentType(itemValue)}
>
	<Select.Item label="OffRoll" value="OffRoll" />
	<Select.Item label="OnRoll" value="OnRoll" />
</Select>
</FormControl>
{RecruitmentType == "OffRoll" || null ? (
<FormControl isRequired>
	<FormControl.Label
		_text={{ fontWeight: "400" }}
		style={styles.Label}
	>
		Agency Name
	</FormControl.Label>
	<Input
		variant="underlined"
		placeholder="Agency Name"
		placeholderTextColor="black"
		style={styles.inputFlieds}
		_focus={{
			borderColor: "#2B3990",
			borderBottomWidth: 3,
		}}
	/>
</FormControl>
) : null}

{RecruitmentType == "OffRoll" || null ? (
<FormControl>
	<FormControl.Label
		_text={{ fontWeight: "400" }}
		style={styles.Label}
	>
		Agency Employee Id
	</FormControl.Label>
	<Input
		variant="underlined"
		placeholder="Agency Employee Id"
		placeholderTextColor="black"
		style={styles.inputFlieds}
		_focus={{
			borderColor: "#2B3990",
			borderBottomWidth: 3,
		}}
	/>
</FormControl>
) : null}
<TouchableOpacity style={styles.nextBtn}>
<Text style={styles.btnText}>Next</Text>
</TouchableOpacity> */}