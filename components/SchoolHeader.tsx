import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import {StyledText} from "./StyledText";

const UserHeader = ({ manager, goBack }) => {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {goBack ? (
                <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
                    <StyledText style={styles.goBackStyledText}>Go Back</StyledText>
                </TouchableOpacity>
            ) : (
                <>
                    <Image
                        source={{ uri: manager?.school?.logo?.link }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <View style={styles.StyledTextContainer}>
                        <StyledText style={styles.schoolName}>{manager?.school?.name}</StyledText>
                        <StyledText style={styles.managerName}>
                            {manager?.firstName} {manager?.lastName}
                        </StyledText>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F8F9FA',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingTop:30
    },
    goBackButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goBackStyledText: {
        fontSize: 16,
        color: '#007AFF',
        marginLeft: 5,
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    StyledTextContainer: {
        flex: 1,
    },
    schoolName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    managerName: {
        fontSize: 16,
        color: '#666',
    },
});

export default UserHeader;
