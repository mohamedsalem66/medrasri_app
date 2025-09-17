import * as React from 'react';
import {useEffect, useState} from 'react';
import {I18nManager, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import AuthHeader from "../../components/AuthHeader"
import Screen from "../../components/utils/Screen";
import {FontsEnum} from '../../constants/FontsEnum';
import {StyledText} from "../../components/StyledText";
import GlobalStyle from "../../constants/GlobalStyle";
import {IMLocalized} from "../../utils/Translater";
import {isValidPhone, trimTel} from "../../utils/functionHelpers";
import {DoneBtn} from "../../components/DoneBtn";
import Colors from "../../constants/Colors";
import {AuthApi} from "../../api/AuthApi";
import {useAuth} from "../../hooks/useAuth";
import {Toast} from "../../components/Toast";
import {AppInputPassword} from "../../components/AppInputPassword";
import {useLoader} from "../../hooks/useLoader";
import {CheckBox} from "react-native-elements";
import {MaterialIcons} from "@expo/vector-icons";
import {isAndroid} from "../../constants/PlatformConsts";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {AppInput} from '../../components/AppInput';
import {LoginResponse} from "../../models/LoginResponse";

export default function LoginScreen({navigation, route}) {
    const [code, setCode] = useState('MR');
    const {
        storeToken,
        rememberUser,
        getRememberedUser,
        clearRememberedUser,
        setTmpPass,
        connectedUser,
        refreshUser
    } = useAuth();
    const [emailOrPhone, setEmailOrPhone] = useState(''); // Renamed state for email or phone
    const [password, setPassword] = useState('');
    const [isRememberMe, setIsRememberMe] = useState(false);
    const {setLoader, removeLoader, isLoading} = useLoader();
    const [isValidationStep, setIsValidationStep] = useState(false);
    const isRTL = I18nManager.isRTL;

    const goTo = (root: string) => {
        navigation.push(root);
    };


    useEffect(() => {
        (async () => {
            const user = await getRememberedUser();
            if (user) {
                setIsRememberMe(true);
                setEmailOrPhone(user.emailOrPhone)
                setPassword(user.password);
            }
        })()
    }, []);

    const onLogin = async () => {
        const isPhone = isValidPhone(emailOrPhone, code);

        let data = isPhone ? {username: `${trimTel(emailOrPhone, code)}`, password: password}
            : {username: emailOrPhone, password: password};

        try {
            setLoader();
            const result = await AuthApi.login(data);
            const loginData = result?.data as LoginResponse;
            if (result?.ok) {

                if (route?.params?.isFromForget) {
                    await setTmpPass(password)
                }
                if (isRememberMe) {
                    const storeUser = {
                        emailOrPhone,
                        password,
                    }
                    await rememberUser(storeUser)
                } else {
                    await clearRememberedUser()
                }


                await storeToken(loginData?.access_token, loginData?.refresh_token, loginData?.expires_in, loginData?.refresh_expires_in)

                await refreshUser();
                return;
            } else if (!result?.ok) {
                if (result.status === 403) {
                    Toast(IMLocalized(IMLocalized('User inactive')))
                    return
                }
                if (result.status === 404 || result.status === 401) {
                    Toast(IMLocalized('login error'))
                    return
                }
            } else if (!result?.ok) {
                Toast(IMLocalized('An error occurred'))
            }
        } catch (error) {
            console.error("Error during login: ", error);
        } finally {
            removeLoader();
        }
    };

    return (<Screen>
        <AuthHeader/>
        <ScrollView
            keyboardShouldPersistTaps={'handled'}>
            <View style={[styles.formContainer,]}>
                {!isValidationStep && <>
                    <View style={[GlobalStyle.flexRow, GlobalStyle.center, styles.titleCont]}>
                        <StyledText style={styles.title}>
                            {IMLocalized('Connect to your account')}
                        </StyledText>
                    </View>

                    <AppInput
                        placeholder={IMLocalized('Email or Phone number')}
                        placeholderTextColor="#B0B0B0"
                        keyboardType={'default'}
                        onChangeText={text => setEmailOrPhone(text)}
                        value={emailOrPhone}
                        inputContainerStyle={styles.inputContainerStyle}
                        inputStyle={styles.inputStyle}
                        leftIcon={<MaterialIcons name="person" size={24} color="#B0B0B0"/>}
                    />

                    <AppInputPassword
                        placeholder={IMLocalized('Password')}
                        placeholderTextColor="#B0B0B0"
                        onChangeText={text => setPassword(text)}
                        value={password}
                        inputContainerStyle={styles.inputContainerStyle}
                        inputStyle={styles.inputStyle}
                        leftIcon={<MaterialIcons name="lock" size={24} color="#B0B0B0"/>}
                    />
                    <View style={{
                        width: wp('81%'), alignItems: 'flex-end', marginTop: hp('4%'), marginBottom: hp('1%')
                    }}>
                        <TouchableOpacity onPress={() => goTo('ForgotPassword')}>
                            <StyledText
                                style={styles.forgotPassword}>{IMLocalized('forgot password')}</StyledText>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        width: wp('81%'), alignItems: 'flex-start',
                    }}>
                        <CheckBox
                            checkedColor={Colors.primary}
                            uncheckedColor={Colors.primary}
                            containerStyle={styles.checkbox}
                            titleProps={{
                                style: styles.remember
                            }}
                            title={IMLocalized('Remember me')}
                            onPress={() => setIsRememberMe(!isRememberMe)}
                            checked={isRememberMe}
                        />

                    </View>
                    <View style={{
                        width: wp('81%'), alignItems: 'center', margin: 10
                    }}>
                        <DoneBtn
                            onPress={() => onLogin()}
                            buttonStyle={{width: wp('100%'), height: 50}}
                            title={IMLocalized('login')}
                            titleStyle={{
                                fontFamily: FontsEnum.Poppins_300Light, fontSize: isAndroid() ? 12 : 14
                            }}
                            containerStyle={[styles.btn]}
                            linearGradientProps={{
                                colors: [Colors.primary, Colors.primary]
                            }}
                        />
                    </View>
                </>}

            </View>
        </ScrollView>
    </Screen>);
}

const styles = StyleSheet.create({
    inputContainerStyle: {
        height: hp('6%'),
        width: wp('81%'),
        borderRadius: 10,
        borderColor: "#F6F6F6"
    },
    inputStyle: {
        color: '#000',
        fontSize: 18,
        fontFamily:
        FontsEnum.Poppins_600SemiBold
    },

    title: {
        fontSize: 22, color: '#505050', fontFamily: FontsEnum.Poppins_600SemiBold, textAlign: "center"
    },
    forgotPassword: {
        fontSize: 10, color: Colors.primary,
    },
    checkbox: {
        backgroundColor: Colors.transparent, borderWidth: 0, paddingHorizontal: 0, marginHorizontal: 0, padding: 0
    },
    remember: {
        color: Colors.primary, paddingHorizontal: 5, fontSize: 12, fontFamily: FontsEnum.Poppins_300Light
    },
    socialLoginCont: {
        justifyContent: 'center', marginVertical: isAndroid() ? hp('1%') : hp('2%')
    },
    titleCont: {
        justifyContent: 'space-evenly', width: '100%', marginTop: '2%'
    },
    btn: {
        borderRadius: 10,
        height: 50,
        width: '100%',
        marginVertical: hp('0.5%'),
        borderColor: Colors.primary,
        borderWidth: 1,
    },
    social: {
        width: 52,
        height: 52,
        marginHorizontal: 10,
        borderRadius: 50,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#2120201A'
    },
    socialFb: {
        width: 52,
        height: 52,
        marginHorizontal: 10,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#1778F2',
        backgroundColor: '#1778F2',
        shadowColor: '#1778F2',
        shadowOffset: {
            width: 0, height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    socialApple: {
        width: 52,
        height: 52,
        marginHorizontal: 10,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: '#000',
        shadowColor: '#000',
        shadowOffset: {
            width: 0, height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    formContainer: {
        ...GlobalStyle.center,
        width: '90%',
        margin: 20,
        marginTop: hp('30%'),
        backgroundColor: "#fff",
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
        paddingHorizontal: 10,
        paddingVertical: 5,
    }
});
