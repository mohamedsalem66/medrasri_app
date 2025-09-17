import * as React from 'react';

import {Text, TextProps} from './Themed';
import {Platform, StyleSheet} from "react-native";
import {FontsEnum} from "../constants/FontsEnum";

export function MonoText(props: TextProps) {
    return <Text {...props} style={[props.style, styles.mono]}/>;
}

export function StyledText(props: TextProps) {
    return <Text {...props} allowFontScaling={false} style={[styles.styledText, props.style]}/>
}

const styles = StyleSheet.create({
    styledText: {
        color: '#525252',
        fontFamily: FontsEnum.Poppins_400Regular,
        // textTransform: 'capitalize'
    },
    mono: {
        fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir"
    }
});
