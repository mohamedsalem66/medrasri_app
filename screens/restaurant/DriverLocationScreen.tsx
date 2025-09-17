import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import UserHeader from "../../components/UserHeader";
import { StyledText } from "../../components/StyledText";
import MapMarkers from '../../components/MapMarkers';
import { FontsEnum } from "../../constants/FontsEnum";
import { CostumeIcon } from "../../components/CostumeIcon";
import Colors from "../../constants/Colors";

const DriverLocationScreen = ({ route, navigation }) => {
    const { addresses } = route.params;

    return (
        <>
            <UserHeader goBack={true} />

            <View style={styles.mapContainer}>
                <MapMarkers
                    driverPosition={addresses?.driver?.address}
                    restoPosition={addresses?.restoPosition}
                />
            </View>

            <View style={styles.container}>
                <StyledText style={{ fontFamily: FontsEnum.Poppins_600SemiBold, fontSize: 15 }}>Estimation delivery</StyledText>

                <View style={styles.detailItem}>
                    <CostumeIcon iconName={'driverIcon'} size={52} />
                    <View style={styles.detailTextContainer}>
                        <StyledText style={styles.detailLabel}>Livreur</StyledText>
                        <StyledText style={styles.detailValue}>{addresses?.driver?.firstName} {addresses?.driver?.lastName}</StyledText>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <StyledText style={styles.buttonText}>Close</StyledText>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        flex: 3,
    },
    container: {
        flex: 1.2,
        backgroundColor: '#fff',
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        height: 70,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    detailIcon: {
        width: 24,
        height: 24,
    },
    detailTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    detailLabel: {
        fontSize: 16,
        color: Colors.primary,
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: Colors.primary,
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 17,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 15,
        fontFamily: FontsEnum.Poppins_600SemiBold,
        color: '#fff',
    },
});

export default DriverLocationScreen;
