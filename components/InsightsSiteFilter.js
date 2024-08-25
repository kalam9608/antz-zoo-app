import React, { useState, useEffect } from 'react'
import { View, StyleSheet} from "react-native";
import { useSelector } from "react-redux";
import Spacing from '../configs/Spacing';
import { ModalTitleData } from './ModalFilterComponent';
import ModalFilterComponent from './ModalFilterComponent';
import FontSize from '../configs/FontSize';
import { MaterialIcons } from '@expo/vector-icons'; 
export default function InsightsSiteFilter({selectedId, handleSiteSelect}) {
    const site = useSelector((state) => state.sites.sites);
    const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
    const reduxColors = styles(constThemeColor);
    const [sites, setSites] = useState([]);
    const [sitename, setSitename] = useState("");
    const [housingInshightModal, setHousingInshightModal] = useState(false);
    const [selectedCheckBox, setselectedCheckBox] = useState(selectedId ?? null);
  
    useEffect(() => {
      let data = site;
      let obj = {
        id: null,
        name: "All Sites",
      };
      data = data.map((item) => ({
        id: item.site_id,
        name: item.site_name,
      }));
      data.unshift(obj);
      setSites(data);
  
      setSitename(data.find((e) => e.id == selectedId)?.name);
    }, []);
  
    const isSelectedId = (id) => {
      return selectedCheckBox == id;
    };
  
    const closeMenu = (item) => {
      setselectedCheckBox(item.id);
      setSitename(item.name);
      handleSiteSelect(item);
      closePrintModal();
    };
  
    const truncateWord = (word) => {
      if (word?.length > 30) {
        return word?.substring(0, 30) + "...";
      }
      return word;
    };
  
    const togglePrintModal = () => {
      setHousingInshightModal(!housingInshightModal);
    };
  
    const closePrintModal = () => {
      setHousingInshightModal(false);
    };
  
    return (
      <>
        <View style={reduxColors.textbox}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <ModalTitleData
                selectDrop={truncateWord(sitename)}
                selectDropStyle={[FontSize.Antz_Minor_Medium, {color: constThemeColor.onPrimary, flex: 1}]}
                toggleModal={togglePrintModal}
                filterIconStyle={{
                  marginLeft: Spacing.small,
                  marginTop: Spacing.micro,
                }}
                filterIcon={true}
                size={24}
                isFromInsights={true}
                nearIcon={true}
              />
         
            </View>
            {housingInshightModal ? (
              <ModalFilterComponent
                onPress={togglePrintModal}
                onDismiss={closePrintModal}
                onBackdropPress={closePrintModal}
                onRequestClose={closePrintModal}
                data={sites}
                closeModal={closeMenu}
                title="Select Site"
                style={{ alignItems: "flex-start" }}
                isSelectedId={isSelectedId}
                radioButton={true}
                
              />
            ) : null}
          </View>
      </>
    )
}


const styles = (reduxColors) =>
  StyleSheet.create({
    textbox: {
      paddingVertical: Spacing.minor,
      paddingHorizontal: Spacing.minor, 
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexDirection: "row",
      backgroundColor: reduxColors.primary,
      borderTopLeftRadius: Spacing.minor,
      borderTopRightRadius: Spacing.minor,
    },
    
  });




