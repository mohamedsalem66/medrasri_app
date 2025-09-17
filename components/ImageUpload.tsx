import React from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet, ViewStyle, ImageStyle} from 'react-native';
import { Icon } from 'react-native-elements';
import { StyledText } from './StyledText';
import Colors from "../constants/Colors";
import { FontsEnum } from "../constants/FontsEnum";
import { CostumeIcon } from "./CostumeIcon";

interface ImageUploadProps {
    img?: string | null; // The image URI, optional
    deleteImage?: () => void; // Optional function to delete the image
    error?: string | null; // Optional error message
    style?: ViewStyle; // Optional custom styles for the wrapper
    onPress?: () => void; // Required function to handle image picking
    label?: string; // Optional label, default is "Image"
    iconName?: string; // Optional main icon name, default is "profile"
    iconSize?: number; // Optional icon size, default is 55
    secondaryIconName?: string | null; // Optional secondary icon name
    secondaryIconSize?: number; // Optional secondary icon size, default is 25
    secondaryIconStyle?: ViewStyle; // Optional custom styling for secondary icon
    isLarge?: boolean; // Optional flag for larger size display (for Vélo or similar cases)
    styleDelete?: ViewStyle;
    isLink?: boolean;
    styleUpload?: ViewStyle;

}

export const ImageUpload: React.FC<ImageUploadProps> = ({
                                                            img,
                                                            deleteImage,
                                                            error,
                                                            style,
                                                            onPress,
                                                            label = "Image",
                                                            iconName = "profile",
                                                            iconSize = 55,
                                                            secondaryIconName = null,
                                                            secondaryIconSize = 25,
                                                            secondaryIconStyle = {},
                                                            isLarge = false,
                                                            isLink = false,
                                                            styleDelete={},
                                                            styleUpload = {}
                                                        }) => {
    const containerStyle = isLarge ? styles.largeImageUpload : styles.imageUpload;

    return (
        <View style={style}>
            {img && deleteImage && (
                <TouchableOpacity onPress={deleteImage} style={[styles.deleteIcon, styleDelete]}>
                    <Icon name="close" size={15} color={'#FFF'} />
                </TouchableOpacity>
            )}

            <TouchableOpacity
                onPress={onPress}
                style={[
                    containerStyle, styleUpload,
                    error ? { borderColor: 'red', borderWidth: 2 } : {}
                ]}
            >
                {img ? (
                    <Image source={{ uri: isLink ? img : `data:image/jpeg;base64,${img}` }}  style={styles.uploadedImage} />) : (
                    <>
                        <CostumeIcon iconName={iconName} size={iconSize} />
                        {secondaryIconName && (
                            <View style={[styles.secondaryIconContainer, secondaryIconStyle]}>
                                <CostumeIcon iconName={secondaryIconName} size={secondaryIconSize} />
                            </View>
                        )}
                        <View style={styles.addButton}>
                            <StyledText style={styles.addTextStyle}>+</StyledText>
                        </View>
                    </>
                )}
            </TouchableOpacity>

            {error ? (
                <StyledText style={styles.errorText}>{label} IMG</StyledText>
            ) : (
                <StyledText style={styles.textStyle}>{label} IMG</StyledText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    imageUpload: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
        width: 95,
        height: 85,
        backgroundColor: '#F2F2F2',
    },
    largeImageUpload: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
        width: 260,
        height: 260,
        backgroundColor: '#F2F2F2',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 9,
        backgroundColor:"#fff"
    },
    addButton: {
        position: 'absolute',
        right: 8,
        bottom: 10,
        backgroundColor: Colors.primary,
        borderRadius: 19,
        width: 19,
        height: 19,
        alignItems: 'center',
    },
    addTextStyle: {
        fontSize: 18,
        fontFamily: FontsEnum.Poppins_700Bold,
        color: '#FFF',
        bottom: 3,
    },
    textStyle: {
        color: '#525252',
        fontFamily: FontsEnum.Poppins_400Regular,
        fontSize: 13,
    },
    errorText: {
        color: 'red',
        fontFamily: FontsEnum.Poppins_400Regular,
        fontSize: 12,
        marginTop: 5,
    },
    deleteIcon: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#E8505B',
        borderRadius: 15,
        padding: 4,
        zIndex: 1,
    },
    secondaryIconContainer: {
        position: 'absolute',
        backgroundColor: '#828282',
        left: 26,
        height: 32,
        paddingTop: 2,
    },
});
