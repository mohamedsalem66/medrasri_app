import {CardType, OrderStatusEnum} from "../models/Static";
import {IconNameType} from "../components/CostumeIcon";
import {IMLocalized} from "./Translater";
import {Alert, Linking, Platform} from "react-native";
import * as FileSystem from 'expo-file-system';
import {EncodingType} from 'expo-file-system';
import {SystemUserModel} from "../models/SystemUserModel";
import {Toast} from "../components/Toast";
import moment, {Moment} from "moment";

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export const makeId = (length = 30) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const getExtension = (uri, isFromCam) => {
    if (isFromCam) {
        return uri.toString().substring(uri.toString().lastIndexOf(".") + 1, uri.length)?.toLowerCase();
    }
    return Platform.OS === 'ios' && uri.toString().lastIndexOf("ext=") != -1 ?
        uri.toString().substring(uri.toString().lastIndexOf("ext=") + 4, uri.length)?.toLowerCase()
        :
        uri.toString().substring(uri.toString().lastIndexOf(".") + 1, uri.length)?.toLowerCase();
};

export const createFileData = (photo, isFromCam = false) => {
    return {
        name: makeId() + '.' + getExtension(photo, isFromCam),
        type: 'image/' + getExtension(photo, isFromCam),
        uri: photo
    }
};

export const avatarTitle = (user: SystemUserModel | null) => {
    return avatarTitleByName(user?.name);
};

export const avatarTitleByName = (name: string | null) => {
    let tempTitle = '';
    if (name) {
        let nm = name.replace(/\s+/g, ' ').toUpperCase().trim().split(' ')
        if (nm.length === 1) {
            tempTitle = `${nm[0][0].toUpperCase()}`
        }
        if (nm.length >= 2) {
            tempTitle = `${nm[0][0].toUpperCase()}${nm[1][0].toUpperCase()}`
        }
    }
    return tempTitle;
};

export const isNum = (val: string): boolean => {
    return /^\d+$/.test(val);
}

export const isValidPhone = (tel: string, code: string): boolean => {
    if (!tel || !code) return false
    try {
        const phone = phoneUtil.parseAndKeepRawInput(tel, code);
        return phoneUtil.isValidNumber(phone);
    } catch (e) {
        return false
    }
}

export const trimTel = (tel: string, code: string): string => {
    if (!tel?.length || !code) return tel;
    const phone = phoneUtil.parseAndKeepRawInput(tel, code);
    return phone.getNationalNumber()?.toString();
}

export const extractPhone = (internationNumber) => {
    if (!internationNumber) return null;

    const code = phoneUtil.getRegionCodeForNumber(phoneUtil.parse(internationNumber));
    const number = phoneUtil.parseAndKeepRawInput(internationNumber, code);
    const telCode = `+${number.getCountryCode()}`
    const tel = `${number.getNationalNumber()}`
    return {
        code,
        telCode,
        tel
    }
}

export const getPaymentCardIcon = (cardType: CardType): IconNameType => {
    switch (cardType) {
        case CardType.APPLE:
            return 'apple';
        case CardType.VISA:
            return 'card-payment';
        case CardType.PAYPAL:
            return 'paypal';
    }
}

export const getStatusTranslation = (status) => {
    switch (status) {
        case OrderStatusEnum.WAITING:
            return IMLocalized("Waiting");
        case OrderStatusEnum.IN_PROGRESS:
            return IMLocalized("In progress");
        case OrderStatusEnum.FINISHED:
            return IMLocalized("Finished");
        case OrderStatusEnum.CANCELED:
            return IMLocalized("Canceled");
        case OrderStatusEnum.DELIVERED:
            return IMLocalized("Delivered");
        case OrderStatusEnum.DELIVERED_OUTSIDE_APPLICATION:
            return IMLocalized("Delivered");
        case OrderStatusEnum.INCOMPLETE:
            return IMLocalized("Incomplete");
        case OrderStatusEnum.SCHEDULED:
            return IMLocalized("Scheduled");
        default:
            return IMLocalized(status)
    }
}


const buildFormData = (formData, data, parentKey?) => {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)
        && !(data?.type?.startsWith('image/'))) {
        Object.keys(data).forEach(key => {
            let validKey = key;
            if (parentKey) {
                validKey = `${parentKey}.${key}`
            }
            if (parentKey && data[key]?.type?.startsWith('image/')) {
                validKey = parentKey
            }
            buildFormData(formData, data[key], validKey);
        });
    } else {
        const value = data == null ? null : data;
        if (value === null) return;
        formData.append(parentKey, value);
    }
}

export function jsonToFormData(data) {
    const formData = new FormData();

    buildFormData(formData, data);

    return formData;
}

export const convertToB64 = async (file, withPrefix = false) => {
    try {
        const fileUri = file.startsWith('file://') ? file.replace('file://', '') : file.uri;
        const base64String = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return withPrefix
            ? `data:${file.type};base64,${base64String}`
            : base64String;
    } catch (error) {
        console.error('Error converting file to base64:', error);
        return null;
    }
};

export const openLinking = async (body) => {
    if (!body) return
    const canOpen = await Linking.canOpenURL(body);
    canOpen ?
        await Linking.openURL(body) :
        Toast(IMLocalized("We can't handle opening this app"));
}

export const delay = ms => new Promise(res => setTimeout(res, ms));

export const toFixedWithoutRound = (n: number, fixed: number = 2): number => {
    if (!n) return 0;
    return +(`${n}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${fixed}})?`)) as string[])[0]
};

export const localDate = (date?): Moment => {
    return moment.utc(date).local();
}

export const maskTel = (tel: string) => {
    if (tel && typeof tel === 'string' && tel.length >= 5) {
        return '*****' + tel.substring(9);
    } else {
        return '';
    }
};

export const fetchDataFromGoogleMaps = async (lat, lng, type) => {
    const apiKey = "AIzaSyC6mFvn9yYXTt9E_BLhHw6DKS9WdFiMoyw";
    const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            console.error("Error fetching data from Google Maps:", response.statusText);
            return null;
        }

        const data = await response.json();
        if (data?.results) {
            for (let result of data.results) {
                if (result?.address_components) {
                    for (let component of result.address_components) {
                        if (component.types.includes(type)) {
                            return component.long_name;
                        }
                    }
                }
            }
        }

        console.warn("Data not found in Google Maps response");
        return null;
    } catch (error) {
        console.error("Error fetching data from Google Maps:", error);
        return null;
    }
}

export const alertUser = (title, message) => {
    Alert.alert(
        title,
        message,
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Linking.openSettings() },
        ]
    );
};

const openMapItinerary = (startAdr: any, dAdr: any) => {
    if (startAdr?.latitude && startAdr?.longitude && dAdr?.latitude && dAdr?.longitude) {
        const scheme = Platform.select({
            ios: 'https://maps.apple.com/?',
            android: 'https://maps.google.com/maps?'
        });
        const sLatLng = `${startAdr.latitude},${startAdr.longitude}`;
        const dLatLng = `${dAdr.latitude},${dAdr.longitude}`;
        const url = Platform.select({
            ios: `${scheme}saddr=${sLatLng}&daddr=${dLatLng}`,
            android: `${scheme}saddr=${sLatLng}&daddr=${dLatLng}`
        });
        Linking.openURL(url);
    }
};
