import React from 'react'

import { Button, StyleSheet, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

// Created By :- Nilesh kumar
// Date :- 13-02-2023


const ButtonLoader = ({
    loaderColor,
    buttonColor,
    buttonWidth,
    buttonHeight,
    loaderSize,
}) => {
    return (
        // <Button style={{ ...style.container}} mt="2" colorScheme={buttonColor} w={buttonWidth} h={buttonHeight}>
            <ActivityIndicator size={loaderSize} color={loaderColor} />
        // </Button>
    )
}

export default ButtonLoader

const style = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    lottie: {
        width: 100,
        height: 100
      }
})

