import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UserHeader from "../../components/UserHeader";
import {useApi} from "../../hooks/useApi";
import {EnrollementsApi} from "../../api/EnrollementsApi";
import {format} from 'date-fns';
import {MatchMode, OrderStatusEnum} from "../../models/Static";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyle from "../../constants/GlobalStyle";
import {FontsEnum} from "../../constants/FontsEnum";
import {useAuth} from "../../hooks/useAuth";
import Colors from "../../constants/Colors";
import {useRestaurant} from "../../hooks/useRestaurant";

const RecentOrdersScreen = ({route}) => {
    const [selectedTab, setSelectedTab] = useState('Today');
    const getRecentOrdersApi = useApi(EnrollementsApi.getRecentOrders, false, null, 'Error while getting  recent orders', true);
    const [recentOrders, setRecentOrders] = useState([]);
    const [page, setPage] = useState(0);


    const statusStyles = {
        [OrderStatusEnum.WAITING]: {backgroundColor: '#FFF3E0', color: '#FFA500'},
        [OrderStatusEnum.PICKED_UP]: {backgroundColor: '#E0F3FF', color: '#007BFF'},
        [OrderStatusEnum.ACCEPTED]: {backgroundColor: '#E0FFE0', color: '#28A745'},
        [OrderStatusEnum.CANCELED]: {backgroundColor: '#F8E0E0', color: '#DC3545'},
        [OrderStatusEnum.DELIVERED]: {backgroundColor: '#E0F8E0', color: '#20C997'},
        [OrderStatusEnum.PENDING]: {backgroundColor: '#E0F4F8', color: '#17A2B8'},
        [OrderStatusEnum.INCOMPLETE]: {backgroundColor: '#F0F0F0', color: '#6C757D'},
        [OrderStatusEnum.BASKET]: {backgroundColor: '#FFF8E0', color: '#FFC107'},
        [OrderStatusEnum.REFUSED]: {backgroundColor: '#F8E0E0', color: '#DC3545'},
        [OrderStatusEnum.READY_TO_PICKUP]: {backgroundColor: '#EDE0F8', color: '#6F42C1'},
    };

    const {connectedUser} = useAuth();
    const [loading, setLoading] = useState(true);
    const { restaurant, updateRestaurant } = useRestaurant();

    const getRestaurantGroup = useApi(
        EnrollementsApi.getRestaurantGroup,
        false,
        null,
        'Error while getting restaurant group',
        true,
    );




    const getFormattedDate = (daysAgo) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return format(date, 'yyyyMMdd');
    };

    const createdAtValue = selectedTab === 'Today' ? getFormattedDate(0) : getFormattedDate(1);
    console.log(createdAtValue)
    const criteria = {
        page: page,
        pageSize: 10,
        sortOrder: '1',
        filters: [{key: 'restaurantId', value: restaurant?.id, matchMode: MatchMode.equals}, {
            key: 'createdAt', value: createdAtValue, matchMode: MatchMode.dateIs
        }]
    };

    const fetchRecentOrders = async () => {
        try {
            const response = await getRecentOrdersApi.request(criteria);
            if (response?.response?.ok) {
                setRecentOrders(prevOrders => page === 0 ? response.data?.content : [...prevOrders, ...response.data?.content]);
            } else {
                console.error('Failed to fetch recent orders:', response.response?.problem);
            }
        } catch (error) {
            console.error('An error occurred while fetching recent orders:', error);
        }
    };

    useEffect(() => {
        (async () => await fetchRecentOrders())()
    }, [selectedTab, page]);

    useEffect(() => {
        setRecentOrders([]);
        setPage(0);
    }, [selectedTab]);


    const renderOrder = ({item}) => {
        const formattedTime = format(new Date(item.createdAt), 'HH:mm');
        const statusStyle = statusStyles[item.status] || {backgroundColor: '#E0E0E0', color: '#000'};
        return (<View style={styles.orderContainer}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderTimestamp}>{formattedTime}</Text>
                <Text
                    style={[styles.statusText, statusStyle]}>
                    {item.status}
                </Text>
            </View>
            <View style={styles.orderHeader}>
                <View style={GlobalStyle.flexRow}>
                    <Text style={styles.orderId}>#{item.id}</Text>
                    <Text style={styles.orderDetail}>{item.reference}</Text>
                </View>
                <Text style={styles.orderAmount}>MRU {item.total}</Text>
            </View>

            <View style={styles.orderHeader}>
                <View style={GlobalStyle.flexRow}>
                    <Icon name="account-circle" size={20} color={Colors.primary}/>
                    <Text style={styles.customerName}>{item?.client?.firstName}</Text>
                </View>
                <View style={styles.statusContainer}>

                    {item.status === 'DELIVERED' && (<TouchableOpacity>
                        <Text style={styles.rateRider}>Rate rider</Text>
                    </TouchableOpacity>)}
                </View>
            </View>
        </View>);
    }

    return (<>
        <UserHeader/>
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'Today' && styles.activeTab]}
                    onPress={() => setSelectedTab('Today')}
                >
                    <Text style={[styles.tabText, selectedTab === 'Today' && styles.activeTabText]}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'Yesterday' && styles.activeTab]}
                    onPress={() => setSelectedTab('Yesterday')}
                >
                    <Text
                        style={[styles.tabText, selectedTab === 'Yesterday' && styles.activeTabText]}>Yesterday</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>All- {recentOrders?.length} (MRU 5.783.397)</Text>
            </View>

            <FlatList
                data={recentOrders}
                renderItem={renderOrder}
                keyExtractor={(item) => item.orderId}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                onEndReached={() => setPage(prevPage => prevPage + 1)}
                onEndReachedThreshold={0.5}
            />
        </View>
    </>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#F5F5F5',
    }, tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 7,
        backgroundColor: '#010ECA00',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.primary,
    }, tab: {
        flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 25,
    }, activeTab: {
        backgroundColor: Colors.primary,
    }, tabText: {
        fontSize: 16, color: Colors.primary,
    }, activeTabText: {
        color: '#FFF', fontWeight: 'bold',
    }, summaryContainer: {
        padding: 20,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 8,
    }, summaryText: {
        color: '#FFF', fontSize: 18, fontWeight: 'bold',
    }, listContainer: {
        paddingHorizontal: 20, paddingTop: 10, paddingBottom: 70
    }, orderContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    }, orderHeader: {
        flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5,
    }, orderId: {
        fontWeight: 'bold', color: '#333', fontSize: 14,
    }, orderTimestamp: {
        color: '#333', fontSize: 14, fontFamily : FontsEnum.Poppins_700Bold
    }, orderDetail: {
        marginBottom: 10, color: '#666', fontSize: 14, marginHorizontal : 10
    }, customerInfo: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    }, customerName: {
        fontSize: 14, fontWeight: 'bold', color: '#333', marginLeft: 5, marginTop : 2
    }, orderAmount: {
        fontSize: 16, fontWeight: 'bold', color: '#333',
    }, statusContainer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5,
    }, statusText: {
        fontSize: 12,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        overflow: 'hidden',
        fontWeight: 'bold',
    }, inDelivery: {
        backgroundColor: '#010ECA00', color: Colors.primary,
    }, completed: {
        backgroundColor: '#E0F8E0', color: '#00CC66',
    }, rateRider: {
        color: Colors.primary, fontSize: 14, fontWeight: 'bold',
    },
});

export default RecentOrdersScreen;
