import * as React from 'react';
import { StyleSheet } from "react-native"
import { Avatar, AvatarProps } from "react-native-elements";

export declare type IconNameType = 'command-active' | 'go-back' | 'transaction' | 'addressPic' |
    'addressPath' | 'walletIcon' | 'driverIcon' | 'loc-pic' | 'user-icon' | 'driver-icon' | 'account-circle';

export function CostumeIcon({ iconName, ...props }: { iconName: IconNameType } & AvatarProps) {
    const { avatarStyle, size } = props
    let name;
    switch (iconName) {
        case "command-active": name = require('../assets/icons/command-active.png'); break;
        case "go-back": name = require('../assets/icons/go-back.png'); break;
        case "transaction": name = require('../assets/icons/transaction.png'); break;
        case "addressPic": name = require('../assets/icons/addressPic.png'); break;
        case "addressPath": name = require('../assets/icons/addressPath.png'); break;
        case "walletIcon": name = require('../assets/icons/walletIcon.png'); break;
        case "driverIcon": name = require('../assets/icons/driverIcon.png'); break;
        case "loc-pic": name = require('../assets/icons/pic-loc.png'); break;
        case "user-icon": name = require('../assets/icons/user-icon.png'); break;
        case "driver-icon": name = require('../assets/icons/driver-icon.png'); break;
        case "account-circle": name = require('../assets/icons/account-circle.png'); break;
    }

    return (
        <Avatar
            size={size ? size : 17}
            avatarStyle={avatarStyle ? avatarStyle : styles.avatarStyle}
            source={name}
        />
    )
}

const styles = StyleSheet.create({
    avatarStyle: {
        resizeMode: 'contain'
    }
});
