import {Input, InputProps} from "react-native-elements";
import {I18nManager, StyleSheet, TextInputProps, ViewStyle, StyleProp, TextStyle} from "react-native"
import {FontsEnum} from "../constants/FontsEnum";
import Colors from "../constants/Colors";
import {StyledText} from "./StyledText";
import {IMLocalized} from "../utils/Translater";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import React, { Dispatch, SetStateAction } from 'react';


interface AppInputProps extends TextInputProps {
    code?: string;
    setCode?: Dispatch<SetStateAction<string>>;
    telCode?: string;
    setTelCode?: Dispatch<SetStateAction<string>>;
    inputContainerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    onChangeText?: (text: string) => void;
    containerStyle?: StyleProp<ViewStyle>; // For the overall container
    optional?: boolean; // Indicates if the input is optional
    optionalStyle?: StyleProp<TextStyle>; // Style for the optional label part
    label?: React.ReactNode;
    labelStyle?: StyleProp<TextStyle>; // Style for the label text
    rightIconContainerStyle?: StyleProp<ViewStyle>; // Style for the right icon container
    leftIconContainerStyle?: StyleProp<ViewStyle>; // Style for the left icon container
    errorStyle?: StyleProp<ViewStyle>; // Style for the error message
    errorMessage?: string; // Error message text
}


export const AppInput: React.FC<AppInputProps & InputProps> = ({
        style,
        inputContainerStyle,
        containerStyle,
        optional=false,
        optionalStyle,
        label,
        labelStyle,
        rightIconContainerStyle,
        leftIconContainerStyle,
        errorStyle,
        errorMessage,
        placeholderTextColor,
        inputStyle,
        ...otherProps
    }) => {
    const displayLabel = optional
        ? (
            <StyledText style={labelStyle}>
                <StyledText allowFontScaling={false} style={labelStyle}>{label}</StyledText>
                <StyledText allowFontScaling={false} style={optionalStyle}> ({IMLocalized('optional')})</StyledText>
            </StyledText>
        )
        : <StyledText allowFontScaling={false} style={labelStyle}>{label}</StyledText>;
    return (
        <Input style={[styles.style, style]}
               label={displayLabel}
               inputContainerStyle={[styles.inputContainerStyle, inputContainerStyle]}
               containerStyle={[styles.containerStyle, errorMessage ? null : styles.optionalContainerStyle, containerStyle]}
               rightIconContainerStyle={[styles.rightIconContainerStyle, rightIconContainerStyle]}
               leftIconContainerStyle={[styles.leftIconContainerStyle, leftIconContainerStyle]}
               errorStyle={[styles.errorStyle, errorStyle]}
               errorMessage={errorMessage}
               inputStyle={[styles.inputStyle, inputStyle]}
               placeholderTextColor={placeholderTextColor ? placeholderTextColor : Colors.primary}
               {...otherProps}
        />
    )
}

const styles = StyleSheet.create({
    inputContainerStyle: {
        height: hp('5%'),
        borderColor: '#F1F1F1',
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor:'#F6F6F6'
    },
    containerStyle: {
        alignItems: 'center',
    },
    optionalContainerStyle: {
        height: 40,
        marginVertical: 10
    },
    style: {
        fontSize: 12,
        fontFamily: FontsEnum.Poppins_500Medium,
    },
    rightIconContainerStyle: {
        marginRight: 10
    },
    leftIconContainerStyle: {
        marginRight: 10
    },
    errorStyle: {
        width: 200,
    },
    inputStyle: {
        color: Colors.primary,
        textAlign:I18nManager.isRTL ? "right" : "left",
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    }
});
