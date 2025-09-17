import * as React from 'react';
import {StyleSheet} from "react-native"
import {IMLocalized} from "../utils/Translater";
import {CustomIcon} from "./CustomIcon";
import {Icon, InputProps} from "react-native-elements";
import Colors from "../constants/Colors";
import {AppInput} from "./AppInput";
import {useState} from "react";
import { EvilIcons } from '@expo/vector-icons';

export function AppInputPassword({...props}: & InputProps, containerStyle) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AppInput
            placeholder={IMLocalized('password')}
            secureTextEntry={!showPassword}
            leftIcon={
                <EvilIcons name="lock" size={32} color="#EA9B3D" />
            }
            containerStyle={containerStyle}
            rightIcon={
                showPassword ? <Icon
                    name='eye'
                    color={"#B0B0B0"}
                    type={'font-awesome-5'}
                    size={17}
                    onPress={() => setShowPassword(!showPassword)}
                /> : <Icon
                    name='eye-slash'
                    color={"#B0B0B0"}
                    type={'font-awesome-5'}
                    size={17}
                    onPress={() => setShowPassword(!showPassword)}
                />
            }
            style={{ marginBottom: 2 }}

            {...props}
        />
    )
}

const styles = StyleSheet.create({});
