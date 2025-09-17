import * as React from 'react';
import {ScrollView, Image, View, StyleSheet} from 'react-native';
import GlobalStyle from "../constants/GlobalStyle";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

const AuthHeader = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.topImage}
                source={require('../assets/images/header1.png')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    topImage: {
        width: wp('76%'),
        height: hp('30%'),
        top: hp('5%'),
        resizeMode: 'cover',
        position: 'absolute',
    },
    logo: {
        width: wp('30%'),
        height: hp('12%'),
        resizeMode: 'contain',
        top: hp('2%'),
        marginHorizontal: wp('25%')
    },
    slogan: {
        width: wp('27%'),
        resizeMode: 'contain',
        position: 'absolute',
        top: hp('2%') + hp('12%') + hp('0.5%'),
        marginHorizontal: wp('25%')
    }
});

export default AuthHeader;
