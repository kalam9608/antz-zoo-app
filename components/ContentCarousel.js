import React from 'react';
import { StyleSheet, View,
    Text,
    Dimensions,
    Image } from 'react-native';
import ViewSlider from 'react-native-view-slider'

const ContentCarousel = (props) => {
    const { width, height } = Dimensions.get('window');
    const defaultStyles = styles(width);

    return(
        <>
            <ViewSlider 
                renderSlides = {
                <>
                {/* <View style={styless.viewBox}></View> */}
                    <View style={defaultStyles.viewBox}>
                        <Image source={{uri: 'https://image.shutterstock.com/image-photo/beautiful-autumn-scene-hintersee-lake-260nw-747646759.jpg'}} style={{height: 200, width}}/>
                    </View>
                    <View style={defaultStyles.viewBox}><Text>TWO</Text></View>
                    <View style={defaultStyles.viewBox}><Text>THREE</Text></View>
                    <View style={defaultStyles.viewBox}><Text>FOUR</Text></View>
                </>
            }
            style={defaultStyles.slider}     //Main slider container style
            height = {200}    //Height of your slider
            slideCount = {4}    //How many views you are adding to slide
            dots = {true}     // Pagination dots visibility true for visibile 
            dotActiveColor = 'red'     //Pagination dot active color
            dotInactiveColor = 'gray'    // Pagination do inactive color
            dotsContainerStyle={defaultStyles.dotContainer}     // Container style of the pagination dots
            autoSlide = {false}    //The views will slide automatically
            slideInterval = {1000}    //In Miliseconds
            />
    </>
    );
}


const styles = (width) => StyleSheet.create({
    viewBox: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        width: width,
        padding: 10,
        alignItems: 'center',
        height: 150
    },
    slider: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink'
    },
    dotContainer: {
      backgroundColor: 'transparent',
      position: 'absolute',
      bottom: 15,
      zIndex: 1

    }
  });




export default ContentCarousel;

