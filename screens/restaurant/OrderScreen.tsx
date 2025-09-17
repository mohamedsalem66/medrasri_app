import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert, RefreshControl } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import UserHeader from "../../components/UserHeader";
import { AntDesign } from "@expo/vector-icons";
import PaymentSummary from "../../components/Basket/PaymentSummary";
import { StyledText } from "../../components/StyledText";
import { CostumeIcon } from "../../components/CostumeIcon";
import { useApi } from "../../hooks/useApi";
import { EnrollementsApi } from "../../api/EnrollementsApi";
import { FontsEnum } from "../../constants/FontsEnum";
import { useNavigation } from '@react-navigation/native';
import OrderVerificationModal from "../../components/OrderVerificationModal";
import Colors from "../../constants/Colors";


const OrderScreen = ({ route }) => {
    const { order } = route?.params;
    const [meals, setMeals] = useState(order?.selectedMeals);
    const [restaurant, setRestaurant] = useState(null);
    const [orderStatus, setOrderStatus] = useState(order.status);
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const getRestaurantById = useApi(EnrollementsApi.getRestaurant, false, null, 'Error while getting your wallet', true);
    const accepteOrder = useApi(EnrollementsApi.accepteOrder, false, null, 'Error while getting your wallet', true);
    const orderReadyToPickup = useApi(EnrollementsApi.orderReadyToPickup, false, null, 'Error while getting your wallet', true);
    const orderPickedUp = useApi(EnrollementsApi.orderPickedUp, false, null, 'Error while getting your wallet', true);

    const navigation = useNavigation();

    const handleEdit = (item) => {
        navigation.navigate('EditOrder', { order: item })
    };

    const generateInvoice = async () => {
        console.log("invoice")
    };

    const handleButtonPress = async (status, action) => {
        try {
            let response;
            switch (status) {
                case 'WAITING':
                    if (action === 'accept') {
                        response = await accepteOrder.request(order.id);
                        setOrderStatus('ACCEPTED');
                    } else if (action === 'reject') {
                        response = navigation.navigate('Decline', { id: order.id })
                    }
                    break;
                case 'ACCEPTED':
                    if (action === 'ready') {
                        response = await orderReadyToPickup.request(order.id);
                        setOrderStatus('READY_TO_PICKUP');
                    }
                    break;
                case 'READY_TO_PICKUP':
                    setModalVisible(true);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("ERROR", error);
        }
    };



    const verifyCode = async (code) => {
        try {
            const response = await orderPickedUp.request(order.id, code);
            if (response && response.data && response.data.status === 'PICKED_UP') {
                setOrderStatus('PICKED_UP');
                setModalVisible(false);
                Alert.alert(
                    'Code Verified',
                    `The code is verified. The order is now picked up by ${order?.delivery?.driver?.firstName} ${order?.delivery?.driver?.lastName}.`,
                    [
                        { text: 'OK', onPress: () => navigation.navigate('Home') }
                    ],
                    { cancelable: false }
                );
                return true;
            } else {
                Alert.alert('Verification Failed', 'The code is not correct. Please try again.');
                return false;
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                Alert.alert(
                    'Verification Failed',
                    `Request failed with status code 404: ${error.response.data.message}`,
                    [
                        { text: 'OK', onPress: () => setModalVisible(false) }
                    ],
                    { cancelable: false }
                );
            } else {
                console.error("Verification Error", error);
                Alert.alert('Verification Error', 'An error occurred while verifying the code. Please try again.');
            }
            return false;
        }
    };

    useEffect(() => {
        fetchRestaurant();
    }, [order]);

    const fetchRestaurant = async () => {
        setLoading(true);
        const res = await getRestaurantById.request(order?.restaurantId);
        if (res && res.data) {
            setRestaurant(res.data);
        }
        setLoading(false);
        setRefreshing(false);
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
                        <StyledText style={styles.mealPrice}>{meal.totalMealPrice} MRU</StyledText>
                    </View>
                    {Object.values(groupedSupplements).map((selectedSupplement, index) => (
                        <View
                            key={index}
                            style={[
                                styles.supplementContainer,
                                selectedSupplement.suggestedSupplements.length > 0
                                    ? styles.highlightedSupplement
                                    : {},
                            ]}
                        >
                            <View style={{flexDirection: "row"}}>
                            <Image
                                source={{ uri: selectedSupplement?.groupSupplementRelation?.supplement?.thumbnail?.link }}
                                style={styles.supplementImage}
                            />
                            <View style={styles.supplementInfo}>
                                <StyledText style={styles.supplementName}>
                                    {selectedSupplement?.count} x {selectedSupplement?.groupSupplementRelation?.supplement?.name}
                                </StyledText>
                                <StyledText style={styles.supplementPrice}>
                                    {selectedSupplement?.groupSupplementRelation?.price === 0
                                        ? "Free"
                                        : `${selectedSupplement?.groupSupplementRelation?.price} MRU`}
                                </StyledText>
                            </View>
                            </View>
                            {selectedSupplement.suggestedSupplements.length > 0 && (
                                <View style={styles.suggestedSupplementsContainer}>
                                    {selectedSupplement.suggestedSupplements.map((suggestedSupplement, idx) => (
                                        <View key={idx} style={styles.suggestedSupplement}>
                                            <Image
                                                source={{ uri: suggestedSupplement?.supplement?.thumbnail?.link }}
                                                style={styles.suggestedSupplementImage}
                                            />
                                            <StyledText style={styles.suggestedSupplementName}>
                                                {suggestedSupplement?.supplement?.name}
                                            </StyledText>
                                            <StyledText style={[styles.supplementPrice, {left: 20}]}>
                                                {suggestedSupplement?.price === 0
                                                    ? "Free"
                                                    : `${suggestedSupplement?.price} MRU`}
                                            </StyledText>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        );
    };
    const renderOrderDetail = () => (
        <View >
            <View style={{ padding: 10, paddingTop: 10 }}>
                <View style={styles.header}>
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={{ uri: restaurant?.logo?.link }}
                            style={styles.logo} />
                        <StyledText style={[styles.orderTitle, {fontSize: 20, marginLeft: 10}]}>{restaurant?.name}</StyledText>
                    </View>

                    <TouchableOpacity style={styles.iconButton} onPress={generateInvoice}>
                        <AntDesign name="printer" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerText}>
                    <StyledText style={styles.orderTitle}>Order #{order?.number}</StyledText>
                    <StyledText style={styles.timeText}>{order?.delivery?.estimatedDeliveryTime} Min</StyledText>
                </View>
                <View style={styles.detailItem}>
                    <CostumeIcon iconName={'user-icon'} size={52} />
                    <View style={styles.detailTextContainer}>
                        <StyledText style={styles.detailLabel}>Client</StyledText>
                        <StyledText style={styles.detailValue}>{order?.client?.firstName} {order?.client?.lastName}</StyledText>
                    </View>
                </View>
                {order?.delivery?.driver && (
                    <View style={styles.detailItem}>
                        <CostumeIcon iconName={'driverIcon'} size={52} />
                        <View style={styles.detailTextContainer}>
                            <StyledText style={styles.detailLabel}>Livreur</StyledText>
                            <StyledText style={styles.detailValue}>{order?.delivery?.driver?.firstName} {order?.delivery?.driver?.lastName}</StyledText>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('DriverLocation', { addresses : { driver: order?.delivery?.driver , restoPosition: restaurant?.address } })}>
                            <CostumeIcon iconName={'loc-pic'} size={45}  />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={styles.divider} />
            {meals.map((meal) => (
                <MealDetailsView key={meal.id} meal={meal} />
            ))}
            <View style={styles.divider} />
            <PaymentSummary total={order?.totalWithMargin} subTotal={order?.total} serviceFees={order?.marginOnOrder}/>
        </View>
    );

    const renderButtons = () => {
        switch (orderStatus) {
            case 'WAITING':
                return (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#f44336'}]} onPress={() => handleButtonPress('WAITING', 'reject')}>
                            <StyledText style={styles.buttonText}>Reject</StyledText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#04AA6D'}]} onPress={() => handleButtonPress('WAITING', 'accept')}>
                            <StyledText style={[styles.buttonText]}>Accept</StyledText>
                        </TouchableOpacity>
                    </View>
                );
            case 'ACCEPTED':
                return (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('ACCEPTED', 'ready')}>
                            <StyledText style={styles.buttonText}>Commande prête</StyledText>
                        </TouchableOpacity>
                    </View>
                );
            case 'READY_TO_PICKUP':
                return (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#FFA500'}]} onPress={() => handleButtonPress('READY_TO_PICKUP', 'picked_up')}>
                            <StyledText style={styles.buttonText}>Remettre au livreur</StyledText>
                        </TouchableOpacity>
                    </View>
                );
            case 'PICKED_UP':
                return (
                    <View style={styles.buttonContainer} >
                        <View style={[styles.button]}>
                            <StyledText style={styles.buttonText}>Livraison en cours</StyledText>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <UserHeader goBack={true} onEdit={() => handleEdit(order)}  />
            <View style={styles.container}>
                {loading ? (
                    <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">
                        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" paddingHorizontal={10} paddingVertical={15}>
                            <SkeletonPlaceholder.Item width={50} height={50} borderRadius={25} />
                            <SkeletonPlaceholder.Item marginLeft={10} flex={1}>
                                <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
                                <SkeletonPlaceholder.Item marginTop={6} width={80} height={15} borderRadius={4} />
                            </SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item marginLeft="auto" width={30} height={30} borderRadius={6} />
                        </SkeletonPlaceholder.Item>

                        <SkeletonPlaceholder.Item paddingHorizontal={10}>
                            <SkeletonPlaceholder.Item marginTop={10} width="50%" height={20} borderRadius={4} />
                            <SkeletonPlaceholder.Item marginTop={6} width="30%" height={15} borderRadius={4} />
                        </SkeletonPlaceholder.Item>

                        <SkeletonPlaceholder.Item marginTop={20} paddingHorizontal={10}>
                            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginBottom={10}>
                                <SkeletonPlaceholder.Item width={52} height={52} borderRadius={26} />
                                <SkeletonPlaceholder.Item marginLeft={10} flex={1}>
                                    <SkeletonPlaceholder.Item width="70%" height={20} borderRadius={4} />
                                    <SkeletonPlaceholder.Item marginTop={6} width="50%" height={15} borderRadius={4} />
                                </SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item width={30} height={30} borderRadius={15} />
                            </SkeletonPlaceholder.Item>

                            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                                <SkeletonPlaceholder.Item width={52} height={52} borderRadius={26} />
                                <SkeletonPlaceholder.Item marginLeft={10} flex={1}>
                                    <SkeletonPlaceholder.Item width="70%" height={20} borderRadius={4} />
                                    <SkeletonPlaceholder.Item marginTop={6} width="50%" height={15} borderRadius={4} />
                                </SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item width={30} height={30} borderRadius={15} />
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder.Item>

                        <SkeletonPlaceholder.Item paddingHorizontal={10} marginTop={20}>
                            {[...Array(5)].map((_, index) => (
                                <SkeletonPlaceholder.Item key={index} flexDirection="row" alignItems="center" marginBottom={10}>
                                    <SkeletonPlaceholder.Item width={60} height={60} borderRadius={8} />
                                    <SkeletonPlaceholder.Item marginLeft={10} flex={1}>
                                        <SkeletonPlaceholder.Item width="60%" height={20} borderRadius={4} />
                                        <SkeletonPlaceholder.Item marginTop={6} width="40%" height={15} borderRadius={4} />
                                    </SkeletonPlaceholder.Item>
                                    <SkeletonPlaceholder.Item width={50} height={20} borderRadius={4} />
                                </SkeletonPlaceholder.Item>
                            ))}
                        </SkeletonPlaceholder.Item>

                        <SkeletonPlaceholder.Item paddingHorizontal={10} marginTop={10}>
                            <SkeletonPlaceholder.Item width="80%" height={20} borderRadius={4} />
                            <SkeletonPlaceholder.Item marginTop={6} width="60%" height={15} borderRadius={4} />
                            <SkeletonPlaceholder.Item marginTop={6} width="40%" height={15} borderRadius={4} />
                        </SkeletonPlaceholder.Item>

                        <SkeletonPlaceholder.Item flexDirection="row" padding={15} marginTop={20} justifyContent="space-between">
                            <SkeletonPlaceholder.Item flex={1} height={45} borderRadius={10} marginHorizontal={5} />
                            <SkeletonPlaceholder.Item flex={1} height={45} borderRadius={10} marginHorizontal={5} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>                ) : (
                    <>
                        <FlatList
                            data={[]}
                            ListHeaderComponent={renderOrderDetail}
                            renderItem={() => null}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchRestaurant} />}
                            showsVerticalScrollIndicator={false}
                        />
                        {renderButtons()}
                        <OrderVerificationModal
                            isVisible={isModalVisible}
                            onClose={setModalVisible}
                            verifyCode={verifyCode}
                        />
                    </>
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: 70,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
    },
    headerText: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    orderTitle: {
        fontSize: 40,
        fontFamily: FontsEnum.Poppins_600SemiBold,
        color: '#383838'
    },
    orderCode: {
        fontSize: 16,
        color: '#888',
    },
    iconButton: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: "#010ECA",
        left: 310,
        position: 'absolute'
    },
    icon: {
        width: 24,
        height: 24,
    },
    timeText: {
        fontSize: 16,
        color: '#383838',
        marginTop: 10,
        marginBottom: 20,
    },
    detailRow: {},
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 2,
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
    mealImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
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
    divider: {
        borderBottomWidth: 2,
        borderBottomColor: '#888',
        marginVertical: 10,
        opacity: 0.4
    },
    orderSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 16,
    },
    summaryValue: {
        fontSize: 16,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    paymentMethodTitle: {
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
    paymentMethod: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 15,
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 18,
        fontFamily: FontsEnum.Poppins_600SemiBold,
        color: '#fff',
    },
    highlightedSupplement: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        paddingTop: 10,
        paddingRight: 10,
        borderRadius: 8,
    },
    suggestedSupplementsContainer: {
        marginTop: 8,
    },
    suggestedSupplement: {
        flexDirection: 'row',
        marginVertical: 5,
        justifyContent: 'space-between',
    },
    suggestedSupplementImage: {
        width: 25,
        height: 25,
        borderRadius: 5,
        marginRight: 10,
    },
    suggestedSupplementName: {
        fontSize: 14,
        color: 'green',
        fontFamily: FontsEnum.Poppins_500Medium,
    },
});

export default OrderScreen;
