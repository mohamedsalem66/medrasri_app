import {Alert, Platform, ToastAndroid} from "react-native";
import * as React from "react";

export const Toast = (msg: string) => {
    if (msg === '' || !msg) msg ='Une erreur s\'est produite!';

    if (Platform.OS != 'android') {
       Alert.alert(msg);
    } else {
        ToastAndroid.showWithGravity(
            msg,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
        );
    }
};
