import * as React from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, View} from "react-native";
import Layout from "../constants/Layout";
import {IMLocalized} from "../utils/Translater";
import GlobalStyle from "../constants/GlobalStyle";
import {FontsEnum} from "../constants/FontsEnum";
import Screen from "../components/utils/Screen";
import {StyledText} from "../components/StyledText";
import {DoneBtn} from "../components/DoneBtn";
import {CostumeIcon} from "../components/CostumeIcon";

export default function CheckInternetScreen({onPress}) {


    return <Screen>
        <View style={[styles.containerHeader, GlobalStyle.bgTransparent]}>
            <ImageBackground source={require('../assets/images/bg-header.png')}
                             style={[GlobalStyle.bgTransparent, styles.image]}>
                <View
                    style={[GlobalStyle.flexRow,
                        GlobalStyle.bgTransparent,
                        GlobalStyle.center]}>
                    <View style={[GlobalStyle.bgTransparent]}>
                        <Image
                            style={styles.tinyLogo}
                            source={require('../assets/images/logo.png')}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>

        <ScrollView>
            <View style={[styles.container]}>
                <View style={[GlobalStyle.center]}>
                    <CostumeIcon
                        size={300}
                        iconName={'no-internet'}/>
                    <StyledText style={[styles.title]}>
                        {IMLocalized('No internet connection')}
                    </StyledText>

                    <StyledText style={styles.msg}>
                        {IMLocalized(`Please check your internet connection`)}
                    </StyledText>

                </View>
                <View style={[GlobalStyle.center, styles.containerBtn]}>
                    <DoneBtn
                        onPress={onPress}
                        buttonStyle={styles.donBtn}
                        title={IMLocalized('Try again')}
                    />
                </View>
            </View>
        </ScrollView>
    </Screen>
}

const styles = StyleSheet.create({
    containerHeader: {
        height: 97,
        flexDirection: 'column',
        zIndex: 9
    },
    container: {
        paddingHorizontal: 10,
        paddingTop: 40
    },
    donBtn: {
        width: Layout.window.width - 40,
        borderRadius: 10,
        marginTop: 30
    },
    containerBtn: {
        width: Layout.window.width
    },
    title: {
        fontSize: 20,
        fontFamily: FontsEnum.Poppins_600SemiBold,
        textAlign: 'center',
        marginVertical: 10,
        textTransform: 'uppercase',
        marginTop: 30
    },
    msg: {
        fontSize: 14,
        fontFamily: FontsEnum.Poppins_500Medium,
        textAlign: 'center',
        marginVertical: 5,
        color: '#AAAAAA'
    },
    tinyLogo: {
        width: 97.85,
        height: 41.42,
        resizeMode: 'contain',
        marginTop: 12.68
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
        alignItems: 'center'
    }
});
