import json
import sys
import re

# Define the path to your app.json file
app_json_path = './app.json'
# Define the paths to your JSON files
staging_google_json_path = './google-services-staging.json'
default_google_json_path = './google-services.json'

# # total arguments
# n = len(sys.argv)
# print("Total arguments passed:", n)

# # Arguments passed
# new_app_version = sys.argv[0]
# print("\nApp Version Number is :", sys.argv[1])

# Load the existing app.json file
with open(app_json_path, 'r') as app_json_file:
    app_data = json.load(app_json_file)

# Define the new values for the properties
new_icon_url = './assets/app_icons/antz_lset_icon.png'  # Replace with your new icon URL
new_app_name = 'Antz App'  # Replace with your new app name
new_version = '1.2.2'  # Replace with your new app version
new_adaptive_icon_foreground = './assets/app_icons/antz_lset_adaptive_icon.png'  # Replace with your new adaptiveIcon foreground image path
new_adaptive_icon_background_color = '#EB5D37'  # Replace with your new adaptiveIcon background color


with open(staging_google_json_path, 'r') as staging_json_file:
    staging_data = json.load(staging_json_file)

# Write the contents of the staging JSON file to the original JSON file
with open(default_google_json_path, 'w') as original_json_file:
    json.dump(staging_data, original_json_file, indent=2)

# Update the properties in app_data
app_data['expo']['icon'] = new_icon_url
app_data['expo']['name'] = new_app_name
app_data['expo']['version'] = new_version
app_data['expo']['client'] = 'antz'
app_data['expo']['ios']['bundleIdentifier'] = 'com.desun.antzapp'
app_data['expo']['android']['package'] = 'com.antz.antzapp'
app_data['expo']['android']['adaptiveIcon']['foregroundImage'] = new_adaptive_icon_foreground
app_data['expo']['android']['adaptiveIcon']['backgroundColor'] = new_adaptive_icon_background_color
app_data['expo']['extra']['eas']['projectId'] = 'ef8e0b99-5b7f-4ed1-b662-b05398c4ac3e'
app_data['expo']['owner'] = "antz-app"

# Save the updated app.json
with open(app_json_path, 'w') as app_json_file:
    json.dump(app_data, app_json_file, indent=2)

print('app.json updated with new values.')
# TODO set this from config files

js_file_path = './configs/Config.js'

# Variables to update
variables_to_update = {
    'isDev': False,
    'vantara_build': False,
    'experience_id' : "@antz/antz-app",
    'uat_build': False,
}

# Read the content of the JavaScript file
with open(js_file_path, 'r') as file:
    content = file.read()


# Update the values of the specified variables
for variable_name, new_value in variables_to_update.items():
    pattern = re.compile(rf'const {re.escape(variable_name)}\s*=\s*(true|false|"@antz/antz-app"|"@nidhintrell/antz-app");')
    match = pattern.search(content)
    if match:
        old_value = match.group(1)
        if isinstance(new_value, str):
            replacement_value = f'"{new_value}"'  # Add double quotes for strings
        else:
            replacement_value = str(new_value).lower()  # Keep boolean values as is
        replacement = f'const {variable_name} = {replacement_value};'
        print(f"Match found for {variable_name}: Replace '{variable_name} = {old_value}' with '{replacement}'")
        content = pattern.sub(replacement, content)
    else:
        print(f"No match found for {variable_name}")



# Write the updated content back to the file
with open(js_file_path, 'w') as file:
    file.write(content)

