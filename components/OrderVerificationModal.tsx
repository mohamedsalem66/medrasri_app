import React, { useState } from 'react';
import {
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Keyboard,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Colors from "../constants/Colors";
import { FontsEnum } from "../constants/FontsEnum";
import { isAndroid } from "../constants/PlatformConsts";
import { useAuth } from "../hooks/useAuth";
import { DoneBtn } from "./DoneBtn";
import { StyledText } from "./StyledText";
import { MaterialIcons } from '@expo/vector-icons';

const OrderVerificationModal = ({ isVisible, onClose, verifyCode }) => {
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const handleClose = async () => {
        onClose(false);
    };

    const handleCODEComplete = (code) => {
        setLoading(true)
        const isValid = verifyCode(code);
        if (!isValid) {
            setErrorMessage('Incorrect code. Please try again.');
        } else {
            setErrorMessage('');
        }
        setLoading(true)
    };


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => onClose(false)}
        >
            <KeyboardAvoidingView
                style={styles.centeredView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => handleClose()}
                        >
                            <MaterialIcons name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <Image
                            style={styles.otpLogo}
                            source={require('../assets/images/Code.png')}
                        />
                        <StyledText style={styles.title}>Code de validation</StyledText>
                        <StyledText style={styles.modalText}>
                            Entrer le code de vérification de la commande.
                        </StyledText>
                        <View style={styles.otpContainer}>
                            <OTPTextInput
                                inputCount={6}
                                handleTextChange={text => setOtp(text)}
                                textInputStyle={styles.otpInput}
                            />
                        </View>
                        {errorMessage ? <StyledText style={styles.errorText}>{errorMessage}</StyledText> : null}
                        <DoneBtn
                            onPress={() => handleCODEComplete(otp)}
                            title='Confirm'
                            buttonStyle={styles.doneButton}
                            titleStyle={styles.doneTitle}
                            containerStyle={styles.buttonContainer}
                            linearGradientProps={{
                                colors: [Colors.primary, Colors.primary]
                            }}
                        />
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: wp('90%'),
        margin: wp('2%'),
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 17,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    otpLogo: {
        width: 200,
        height: 200,
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 22,
        marginVertical: hp('1.5%'),
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    otpInput: {
        width: 45,
        height: 45,
        borderWidth: 1,
        borderColor: '#DCDCDC',
        borderRadius: 5,
        backgroundColor: "#F4F4F4",
    },
    resendButton: {
        margin: 4,
        marginVertical: 15,
        alignSelf: "flex-start",
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    doneButton: {
        width: wp('100%'),
        height: 50,
    },
    doneTitle: {
        fontFamily: FontsEnum.Poppins_300Light,
        fontSize: isAndroid() ? 12 : 14,
    },
    buttonContainer: {
        borderRadius: 10,
        height: 50,
        width: '100%',
        marginTop: hp('0.5%'),
        borderColor: Colors.primary,
        borderWidth: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    otpInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default OrderVerificationModal;
