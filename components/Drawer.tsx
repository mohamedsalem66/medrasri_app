import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    FlatList,
    Text,
    StatusBar
} from 'react-native';
import {DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import { StyledText } from "./StyledText";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { FontsEnum } from "../constants/FontsEnum";
import { EnrollementsApi } from '../api/EnrollementsApi';
import { useRestaurant } from '../hooks/useRestaurant';
import { AntDesign } from '@expo/vector-icons';
import "react-native-gesture-handler";
import {CostumeIcon} from "./CostumeIcon";

function CustomDrawerContent(props) {
    const [restaurants, setRestaurants] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMany, setIsMany] = useState(false);
    const { connectedUser } = useAuth();
    const { restaurant, updateRestaurant } = useRestaurant();


    const {logOut} = useAuth();


    const handleLogOut = async () => {
        await logOut()
    };

    const handleRestaurantChange = (selectedRestaurant) => {
        updateRestaurant(selectedRestaurant);
        setModalVisible(false);
    };

    return (
        <DrawerContentScrollView {...props}>
            <StatusBar barStyle={"dark-content"} animated={true} />
            <View style={styles.container}>
                        <View style={styles.header}>
                            <Image source={{ uri: connectedUser?.school?.logo?.link }} style={styles.logo} />
                            <StyledText style={styles.headerTitle}>{connectedUser?.school?.name}</StyledText>
                        </View>
            </View>

            <DrawerItemList {...props} />

            <DrawerItem
                label={"Logout"}
                onPress={handleLogOut}
                labelStyle={{ color: "#EA546A" }}
            />

        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    logo: {
        width: 50,
        height: 70,
        borderRadius: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FontsEnum.Poppins_700Bold,
        paddingLeft: 7,
        flex: 1,
    },
    switchButton: {
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: FontsEnum.Poppins_700Bold,
        textAlign: 'center',
    },
    restaurantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    restaurantLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    restaurantName: {
        fontSize: 16,
        fontFamily: FontsEnum.Poppins_500Medium,
        flex: 1,
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007bff',
        borderRadius: 10,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: FontsEnum.Poppins_600SemiBold,
    },
});

export default CustomDrawerContent;
