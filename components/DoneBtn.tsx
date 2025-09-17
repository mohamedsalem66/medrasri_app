import * as React from 'react';
import {Button} from "react-native-elements";
import {StyleSheet} from "react-native"
import Colors from "../constants/Colors";
import {ButtonProps} from "react-native-elements/dist/buttons/Button";
import {LinearGradient} from 'expo-linear-gradient';

export function DoneBtn({...props}: & ButtonProps) {
    const {
        containerStyle,
        titleStyle,
        buttonStyle,
        ViewComponent,
        linearGradientProps,
        disabled,
        disabledTitleStyle,
        ...otherProps
    } = props
    return (

        <Button
            ViewComponent={ViewComponent ? ViewComponent : LinearGradient}
            linearGradientProps={linearGradientProps ? linearGradientProps :
                {
                    colors: disabled ? ['#939393', '#c2c2c2'] : ['#fdc799', Colors.primary],
                    start: [0.0, 0.5],
                    end: [1.0, 0.5],
                    locations: [0.0, 1.0],
                }}
            buttonStyle={[styles.doneBtn, buttonStyle]}
            containerStyle={[styles.container, containerStyle]}
            titleStyle={[styles.title, titleStyle]}
            disabledTitleStyle={[styles.disabledTitleStyle, disabledTitleStyle]}
            disabled={disabled}
            {...otherProps}
        />
    )
}

const styles = StyleSheet.create({
    doneBtn: {
        backgroundColor: 'transparent',
        height: 50,
        borderRadius: 5,
        borderColor: Colors.primary,
    },
    container: {
        alignItems: 'center',
    },
    title: {
        color: '#fff'
    },
    disabledTitleStyle: {
        color: '#fff'
    }
});
