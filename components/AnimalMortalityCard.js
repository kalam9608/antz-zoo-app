// work: Design FlatListCard component

/**
 * @React Imports
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

/**
 * @Redux Imports
 */
import { useSelector } from "react-redux";

/**
 * @Component Imports
 */

/**
 * @Third Party Imports
 */
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";

/**
 * @Config Imports
 */
import FontSize from "../configs/FontSize";

const AnimalListCard = ({
  UserEnclosureName,
  title,
  subtitle,
  onPress,
  checkbox,
  SectionName,
  color,
  fontSize,
  fontWeight,
  borderColor,
  backgroundColor,
  tags,
  sectionData,
  sectionfontSize,
  sectionfontWeight,
  enclosurefontSize,
  enclosurefontWeight,
  borderWidth,
  mortalityTitle,
  ...props
}) => {
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  return(
 <TouchableWithoutFeedback
    onPress={onPress}
  >
    <View style={[reduxColors.cardContainer, { borderWidth: borderWidth,borderColor:borderColor,backgroundColor:backgroundColor }]}>
      <View style={{flexDirection:'row',width:'70%'}}>
      <View style={reduxColors.image}>
        <Image
          source={require("../assets/antz.png")} 
          height={widthPercentageToDP(35)}
          width={widthPercentageToDP(35)}
          style={{ marginLeft: 10 }}
        />
      </View>
     
      <View style={reduxColors.contentContainer}>

        <View style={reduxColors.middleSection}>
          {props.titleName ? (
            <Text style={reduxColors.titleName}>{props.titleName}</Text>
          ) : null}

        { title ? 
            <View style={{ display: "flex", width:widthPercentageToDP(75), flexDirection:'row',}}>
          
              <Text style={reduxColors.title}>
                {props.titleNames}
                {title}
              </Text>
         
            </View>
            : "" 
        }

       

          <View
            style={{ width:widthPercentageToDP(80), flexDirection:'row',}}
          >
            {subtitle ? (

              <Text
                style={[
                  reduxColors.subtitle,
                  { fontWeight: fontWeight },
                  { fontSize: fontSize },
                ]}
              >
                {subtitle}
              </Text>
            ) : null}



            {tags == "typesTag" ? (
              <View style={reduxColors.mainTag}>
                <View style={reduxColors.tagscontainerM}>
                  <Text
                    style={{
                      color: constThemeColor.onPrimary,
                      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                      fontSize: FontSize?.Antz_Small,
                      textAlign: "center",
                    }}
                  >
                    M
                  </Text>
                </View>

                <View style={reduxColors.tagscontainerB}>
                  <Text
                    style={{
                      color: constThemeColor.onPrimary,
                      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                      fontSize: FontSize?.Antz_Small,
                      textAlign: "center",
                    }}
                  >
                    B
                  </Text>
                </View>
              </View>
            ) : null}
      
        
          </View>

        { mortalityTitle ? 
            <View style={{ display: "flex", width:widthPercentageToDP(75), flexDirection:'row',}}>
          
              <Text style={[reduxColors.title,{width:widthPercentageToDP(90)}]}>
                {mortalityTitle}
              </Text>
         
            </View>
            : "" 
        }
        </View>

        <View style={reduxColors.enclosure}>
          <Text
            style={[
              reduxColors.enclosureName,
              { fontSize: enclosurefontSize },
              { fontWeight: enclosurefontWeight },
              { color: constThemeColor.onSurfaceVariant },
              { width:widthPercentageToDP('70%')}
            ]}
          >
            {UserEnclosureName}
       
          </Text>
          <Text
            style={[
              reduxColors.enclosureName,
              { fontSize: enclosurefontSize },
              { fontWeight: enclosurefontWeight },
              {color:constThemeColor.onSurfaceVariant},
              {marginTop:3}
            ]}
          >
           
            {SectionName}
          </Text>
     
        </View>

      
  
      </View>
      </View>
      <View style={[ 
           reduxColors.rightSideIcon,
      

          { fontWeight: fontWeight },
          { fontSize: fontSize }
         
         ]}> 
         <AntDesign name="right" size={16} color="black" />
         </View>
    </View>
  </TouchableWithoutFeedback>
)};

const styles = (reduxColors) => StyleSheet.create({
  rightSideIcon:{ 
  // backgroundColor:'white',
  justifyContent:'center',
  alignItems:'center',
  marginHorizontal:0,
  width:widthPercentageToDP(6),
  height:heightPercentageToDP(4),
  },
  cardContainer: {
    backgroundColor: reduxColors.surface,
    borderColor: reduxColors.outlineVariant,
    borderRadius: widthPercentageToDP("2%"),
    marginVertical: widthPercentageToDP("2%"),
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems:'center',
    justifyContent:'space-between'


  },
 
  image: {
    width: 48,
    height: 48,
    marginRight: 10,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: reduxColors.onPrimary,
    borderRadius: 100,
  },

  middleSection: {
    // width: "70%",
    justifyContent: "center",
  },
  titleName: {
    color: reduxColors.titleName,
    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
    fontSize: FontSize?.Antz_Body_Regular.fontSize,
    lineHeight: 17,
  },
 

  title: {
    fontSize: FontSize?.Antz_Minor_Regular.fontSize,
    fontWeight: FontSize.Antz_Body_Title.fontWeight,
    color: reduxColors.onSurfaceVariant,
    width: widthPercentageToDP(40),
  
    alignItems: "center",
   
  },
  subtitle: {
    fontSize: FontSize?.Antz_Body_Regular.fontSize,
    color: reduxColors.onSurfaceVariant,
    fontWeight: FontSize.Antz_Body_Regular.fontWeight,
     marginTop:heightPercentageToDP(0.1),
    width:widthPercentageToDP(30),
 

    
  },
  mainTag: {
    flexDirection: "row",
    justifyContent: "space-evenly",
   
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(4),
   
  },
  tagscontainerM: {
    width: widthPercentageToDP(6),
    height: heightPercentageToDP(3),
    backgroundColor:reduxColors.surfaceVariant,
    borderRadius: 5,
    marginLeft: widthPercentageToDP(1.2),
    justifyContent: "center",
  },
  tagscontainerB: {
    width: widthPercentageToDP(6),
    height: heightPercentageToDP(3),
    backgroundColor:reduxColors.secondary,
    borderRadius: 5,

    justifyContent: "center",
  },
 
  enclosureName: {
    fontSize: FontSize?.Antz_Body_Regular.fontSize,
 
  },
});

export default AnimalListCard;
