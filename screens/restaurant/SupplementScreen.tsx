import React, {useCallback, useEffect, useState} from 'react';
import { FlatList, Image, StyleSheet, Switch, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import UserHeader from "../../components/UserHeader";
import { StyledText } from "../../components/StyledText";
import { FontsEnum } from "../../constants/FontsEnum";
import Colors from "../../constants/Colors";
import StatusModal from "../../components/StatusModal";
import { useApi } from "../../hooks/useApi";
import { EnrollementsApi } from "../../api/EnrollementsApi";
import {useLoader} from "../../hooks/useLoader";
import {useMeals} from "../../hooks/useMeals";

const SupplementScreen = ({ route }) => {
    const { meal } = route.params;
    const [mealData, setMealData] = useState(meal);
    const [selectedStatus, setSelectedStatus] = useState("available");
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [currentToggleType, setCurrentToggleType] = useState(null);
    const {setLoader, removeLoader} = useLoader();
    const { menu, refreshMeals } = useMeals();

    useEffect(() => {
        if (menu && meal) {
            const associatedMeal = menu.find(m => m.id === meal.id);
            if (associatedMeal) {
                setMealData(associatedMeal);
            }
        }
    }, [menu, meal]);


    const updateMealAvailability = useApi(
        EnrollementsApi.updateMealAvailability,
        false,
        null,
        false,
        false
    );

    const updateSupplementAvailability = useApi(
        EnrollementsApi.updateSupplementAvailability,
        false,
        null,
        false,
        false
    );


    const handleAvailabilityChange = async (id, type, status) => {
        setStatusModalVisible(false);
        try {
            setLoader();
            const updateFunction = type === 'meal' ? updateMealAvailability : updateSupplementAvailability;
            await updateFunction.request(id, status);
            await refreshMeals();
        } catch (error) {
            console.error('Failed to update availability', error);
            Alert.alert("Update Failed", "Could not update the " + type + " status.");
        } finally {
            removeLoader();
        }
    };


    const openStatusModal = (id, type) => {
        setCurrentToggleType({ id, type });
        setStatusModalVisible(true);
    };

    const confirmStatusChange = (status) => {
        setSelectedStatus(status);
        handleAvailabilityChange(currentToggleType.id, currentToggleType.type, status);
    };

    const renderSupplement = useCallback(({ item }) => {
        const isAvailable = item?.supplement?.availability?.available || item?.supplement?.availability === null;

        return (
            <View>
                <TouchableOpacity style={styles.supplementContainer}>
                    <View style={styles.switchAndText}>
                        <Switch
                            value={isAvailable}
                            onValueChange={() => openStatusModal(item.supplement.id, 'supplement')}
                            trackColor={{ false: "#ccc", true: Colors.primary }}
                            thumbColor={isAvailable ? "#FFF" : "#FFF"}
                        />
                        <Image source={{ uri: item?.supplement?.thumbnail?.link }} style={[styles.logo, { width: 25, height: 25 }]} />
                        <StyledText style={styles.supplementText}>{item?.supplement?.name}</StyledText>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }, [openStatusModal]);

    const renderItem = useCallback(({ item }) => {
        const isAvailable = item?.availability?.available || item?.availability === null;

        return (
            <View style={styles.mealContainer}>
                <View style={styles.mealHeader}>
                    <View style={styles.switchAndText}>
                        <Switch
                            value={isAvailable}
                            onValueChange={() => openStatusModal(item.id, 'meal')}
                            trackColor={{ false: "#ccc", true: Colors.primary }}
                            thumbColor={isAvailable ? "#FFF" : "#FFF"}
                        />
                        <Image source={{ uri: item?.thumbnail?.link }} style={styles.logo} />
                        <StyledText style={styles.mealText}>{item.name}</StyledText>
                    </View>
                </View>

                {isAvailable && item.groupSupplements && (
                    <FlatList
                        data={item.groupSupplements.flatMap(group => group.groupSupplementRelations)}
                        renderItem={({ item }) => renderSupplement({ item })}
                        keyExtractor={item => item.id.toString()}
                    />
                )}
            </View>
        );
    }, [openStatusModal, renderSupplement]);

    return (
        <>
            <UserHeader goBack={true} />
            <View style={styles.container}>
                <StyledText style={styles.menuTextStyle}>{meal.name}</StyledText>
                <FlatList
                    data={mealData.meals}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <StatusModal
                visible={statusModalVisible}
                onClose={() => setStatusModalVisible(false)}
                onSelect={confirmStatusChange}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#FFFFFF',
    },
    mealContainer: {
        backgroundColor: '#F7F7F7',
        marginVertical: 5,
        borderRadius: 10,
        overflow: 'hidden',
        padding: 18,
    },
    mealHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    switchAndText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mealText: {
        fontSize: 15,
        fontFamily: FontsEnum.Poppins_600SemiBold,
        color: '#383838',
        marginLeft: 10,
    },
    supplementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginLeft: 20,
    },
    supplementText: {
        fontSize: 16,
        fontFamily: FontsEnum.Poppins_400Regular,
        color: '#383838',
        marginLeft: 10,
    },
    subSupplementsContainer: {
        marginLeft: 40,
        paddingTop: 5,
    },
    subSupplementText: {
        fontSize: 14,
        color: '#555',
    },
    menuTextStyle: {
        marginTop: 10,
        fontFamily: FontsEnum.Poppins_600SemiBold,
        fontSize: 22,
        color: '#383838',
        textAlign: 'left',
    },
    icon: {
        marginLeft: 'auto',
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginLeft: 8,
    }
});

export default SupplementScreen;
