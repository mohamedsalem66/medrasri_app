import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserHeader from "../../components/UserHeader";
import GlobalStyle from "../../constants/GlobalStyle";
import {FontsEnum} from "../../constants/FontsEnum";
import {useApi} from "../../hooks/useApi";
import {EnrollementsApi} from "../../api/EnrollementsApi";
import {useNavigation} from "@react-navigation/native";

const DeclineScreen = ({route}) => {
    const orderId = route?.params?.id;

    const rejectOrder = useApi(EnrollementsApi.rejectOrder, false, null, 'Error while getting your wallet', true);

    const navigation = useNavigation();

    const handlePress = async (reason: string) => {
        await rejectOrder.request(orderId);
        Alert.alert(
            'Order Rejected',
            'The order has been rejected.',
            [
                { text: 'OK', onPress: () => navigation.navigate('Home') }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <UserHeader goBack={true}/>
            <View style={styles.subContainer}>

            <View style={[GlobalStyle.flexRow,styles.alertContainer]}>
                <Icon name="information" size={24} color="#FF0000" style={styles.icon} />

                <Text  style={styles.alertText}>
                    Des frais peuvent vous être facturés si {'\n'}vous refusez cette commande
                </Text>
            </View>
            <Text style={styles.title}>Triste de te voir décliner</Text>
            <Text style={styles.subtitle}>Sélectionnez votre motif de refus</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => handlePress('Restaurant fermé')}
            >
                <Icon name="store-off" size={30} color="#000" style={styles.icon} />
                <Text style={styles.buttonText}>Restaurant fermé</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => handlePress('Trop occupé')}
            >
                <Icon name="clock-outline" size={30} color="#000" style={styles.icon} />
                <Text style={styles.buttonText}>Trop occupé</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => handlePress('Article non viable')}
            >
                <Icon name="package-variant" size={30} color="#000" style={styles.icon} />
                <Text style={styles.buttonText}>Article non viable</Text>
            </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    subContainer:{
      margin : 20
    },
    alertContainer: {
        backgroundColor: '#fdecea',
        padding: 10,
        borderRadius: 5,
        marginBottom : 20,
        borderWidth : 1,
        borderColor : "#FF0000"
    },
    alertText: {
        fontSize: 14,
        textAlign: 'left',
        fontFamily : FontsEnum.Poppins_600SemiBold
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    buttonText: {
        fontSize: 20,
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
});

export default DeclineScreen;
