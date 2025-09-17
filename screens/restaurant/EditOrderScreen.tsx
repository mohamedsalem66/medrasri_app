import React, { useState } from 'react';
import {View, StyleSheet, FlatList, Alert, Image, Modal, TouchableOpacity} from 'react-native';
import UserHeader from '../../components/UserHeader';
import {StyledText} from "../../components/StyledText";
import {FontsEnum} from "../../constants/FontsEnum";
import Colors from "../../constants/Colors";
import AntDesign from '@expo/vector-icons/AntDesign';
import Checkbox from 'expo-checkbox';


const EditOrderScreen = ({ route, navigation }) => {
    const { order } = route.params;
    const [meals, setMeals] = useState(order?.selectedMeals);

    const [supplementModalVisible, setSupplementModalVisible] = useState(false);
    const [mealModalVisible, setMealModalVisible] = useState(false);
    const [currentMeal, setCurrentMeal] = useState(null);
    const [currentSupplement, setCurrentSupplement] = useState(null);

    const [suggestMealIds, setSuggestMealIds] = useState([]);
    const [suggestSupplementds, setSuggestSupplementIds] = useState([]);


    const [tempSelectedMealIds, setTempSelectedMealIds] = useState([]);
    const [tempSupplemntMealIds, setTempSupplemntMealIds] = useState([]);


    const toggleTempMealSelection = (mealId) => {
        setTempSelectedMealIds((prevIds) =>
            prevIds.includes(mealId)
                ? prevIds.filter((id) => id !== mealId)
                : [...prevIds, mealId]
        );
    };

    const toggleTempSupplementSelection = (mealId) => {
        setTempSupplemntMealIds((prevIds) =>
            prevIds.includes(mealId)
                ? prevIds.filter((id) => id !== mealId)
                : [...prevIds, mealId]
        );
    };

    const handleRemoveSupplement = (supplement) => {
        setCurrentSupplement(supplement)
        setSupplementModalVisible(true);
    };

    const handleRemoveMeal = (meal) => {
        setCurrentMeal(meal);
        setMealModalVisible(true);
    };

    const SupplementSuggestionModal = () => {
        const suggestedSupplements = currentSupplement ? currentSupplement?.suggestedSupplements : [];
        console.log(suggestedSupplements);

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={supplementModalVisible}
                onRequestClose={() => {
                    setMealModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <StyledText style={styles.modalHeader}>Suggested Suppement</StyledText>
                        <FlatList
                            data={suggestedSupplements}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View
                                    style={[
                                        styles.suggestedMealRow,
                                        tempSupplemntMealIds.includes(item?.groupSupplementRelation?.supplement?.id) && styles.selectedMeal,
                                    ]}
                                >
                                    <Image
                                        source={{ uri: item?.groupSupplementRelation?.supplement?.thumbnail.link }}
                                        style={styles.suggestedMealImage}
                                    />
                                    <StyledText style={styles.suggestedMealName}>{item?.groupSupplementRelation?.supplement?.name}</StyledText>
                                    <Checkbox
                                        value={tempSupplemntMealIds.includes(item?.groupSupplementRelation?.supplement?.id)}
                                        onValueChange={() => toggleTempSupplementSelection(item?.groupSupplementRelation?.supplement?.id)}
                                        style={styles.checkbox}
                                        color={tempSupplemntMealIds.includes(item?.groupSupplementRelation?.supplement?.id) ? Colors.primary : undefined}
                                    />
                                </View>
                            )}
                        />
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setSupplementModalVisible(false)}
                        >
                            <StyledText style={styles.textStyle}>Close</StyledText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    const MealSuggestionModal = () => {
        const suggestedMeals = currentMeal ? currentMeal.suggestedMeals : [];

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={mealModalVisible}
                onRequestClose={() => {
                    setMealModalVisible(false); // Close only when explicitly requested
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <StyledText style={styles.modalHeader}>Suggested Meals</StyledText>
                        <FlatList
                            data={suggestedMeals}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View
                                    style={[
                                        styles.suggestedMealRow,
                                        tempSelectedMealIds.includes(item.id) && styles.selectedMeal,
                                    ]}
                                >
                                    <Image
                                        source={{ uri: item.thumbnail.link }}
                                        style={styles.suggestedMealImage}
                                    />
                                    <StyledText style={styles.suggestedMealName}>{item.name}</StyledText>
                                    <Checkbox
                                        value={tempSelectedMealIds.includes(item.id)}
                                        onValueChange={() => toggleTempMealSelection(item.id)}
                                        style={styles.checkbox}
                                        color={tempSelectedMealIds.includes(item.id) ? Colors.primary : undefined}
                                    />
                                </View>
                            )}
                        />
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setMealModalVisible(false)}
                            >
                                <StyledText style={styles.textStyle}>Close</StyledText>
                            </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };


    const MealDetailsView = ({ meal }) => {
        const groupedSupplements = meal.selectedSupplements.reduce((acc, supplement) => {
            const name = supplement?.groupSupplementRelation?.supplement?.name;
            if (acc[name]) {
                acc[name].count += 1;
            } else {
                acc[name] = {
                    ...supplement,
                    count: 1,
                };
            }
            return acc;
        }, {});

        return (
            <View style={styles.card}>
                <View style={styles.detailsContainer}>
                    <View style={styles.mealDetailsRow}>
                        <Image
                            source={{ uri: meal?.meal?.thumbnail?.link }}
                            style={styles.mealImage}
                        />
                        <StyledText style={styles.mealQuantity}>{meal.quantity} x</StyledText>
                        <StyledText style={styles.mealName}>{meal.meal.name}</StyledText>
                        <AntDesign name="closesquare" size={30} color="red" onPress={() => handleRemoveMeal(meal)}/>
                    </View>
                    {Object.values(groupedSupplements).map((selectedSupplement, index) => (
                        <View key={index} style={styles.supplementContainer}>
                            <Image
                                source={{ uri: selectedSupplement?.groupSupplementRelation?.supplement?.thumbnail?.link }}
                                style={styles.supplementImage}
                            />
                            <View style={styles.supplementInfo}>
                                <StyledText style={styles.supplementName}>
                                    {selectedSupplement?.count} x {selectedSupplement?.groupSupplementRelation?.supplement?.name}
                                </StyledText>
                                <StyledText style={styles.supplementPrice}>
                                    <AntDesign name="closesquare" size={24} color="red" onPress={() => handleRemoveSupplement(selectedSupplement)}/>
                                </StyledText>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const renderOrderDetail = () => (
        <View >
            {meals.map((meal) => (
                <MealDetailsView key={meal.id} meal={meal} />
            ))}
        </View>
    );


    return (
        <View >
            <UserHeader goBack={true} />
            <FlatList
                data={[]}
                ListHeaderComponent={renderOrderDetail}
                renderItem={() => null}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
            <SupplementSuggestionModal />
            <MealSuggestionModal />
        </View>
    );
};

const styles = StyleSheet.create({
    mealContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    supplementRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    mealName: {
        fontSize: 16,
        color: '#333',
        fontFamily: FontsEnum.Poppins_600SemiBold
    },
    mealDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        alignItems: 'center'
    },
    mealQuantity: {
        fontSize: 16,
        color: Colors.primary,
        fontFamily: FontsEnum.Poppins_600SemiBold

    },
    mealPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
        fontFamily: FontsEnum.Poppins_600SemiBold
    },
    supplementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    supplementImage: {
        width: 30,
        height: 30,
        borderRadius: 5,
        marginRight: 10,
        marginLeft: 30
    },
    supplementInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },
    supplementName: {
        fontSize: 14,
        color: '#555',
    },
    supplementPrice: {
        fontSize: 14,
        color: '#555',
    },
    mealImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginVertical: 6,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginLeft: 10,
        marginRight: 10
    },
    imageContainer: {
        marginRight: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        width: '90%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalHeader: {
        marginBottom: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center",
        color: Colors.primary,
        fontFamily: FontsEnum.Poppins_600SemiBold,
    },
    suggestedMealRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    selectedMeal: {
        backgroundColor: '#e6f7ff',
        borderColor: Colors.primary,
    },
    suggestedMealImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 10,
    },
    suggestedMealName: {
        flex: 1,
        fontSize: 16,
        fontFamily: FontsEnum.Poppins_600SemiBold,
        color: '#333',
    },
    checkbox: {
        marginLeft: 10,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
});

export default EditOrderScreen;
