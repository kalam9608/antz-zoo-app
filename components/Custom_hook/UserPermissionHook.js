// Custom hook to check user permissions
import { useContext } from "react";
import { useSelector } from "react-redux";

export const usePermission = (permission) => {
  const userPermissions = useSelector((state) => state.UserAuth.permission);

  // Check if the user's role has the required permission
  return userPermissions[permission];
};

export function useFilteredArray(data) {
  const userPermissions = useSelector((state) => state.UserAuth.permission);
  
  if(data && data.length>0) {
    var result =  data.filter(
      (item) =>
      userPermissions[item.key] == true ||
        item.key == "not_required" ||
        userPermissions[item.subKey] == "ADD" ||
        userPermissions[item.subKey] == "EDIT" ||
        userPermissions[item.subKey] == "DELETE"
    );
    return result;
  }
  return [];
}
