import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserHeader from "../../components/UserHeader";
import { useApi } from "../../hooks/useApi";
import { EnrollementsApi } from "../../api/EnrollementsApi";
import { StyledText } from "../../components/StyledText";
import { Ionicons } from '@expo/vector-icons';
import SchoolHeader from "../../components/SchoolHeader";

const StudentsScreen = () => {
    const navigation = useNavigation();

    const getAllEnrollements = useApi(EnrollementsApi.getEnrollementAll, false, null, 'Error while getting enrollements', true);
    const [enrollements, setEnrollements] = useState([]);
    const [filteredEnrollements, setFilteredEnrollements] = useState([]);
    const [page, setPage] = useState(0);

    const [classFilter, setClassFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchAllEnrollements = async (reset = false) => {
        try {
            if (reset) setPage(0); // Reset page on refresh
            const response = await getAllEnrollements.request(reset ? 0 : page);
            if (response?.response?.ok) {
                const newEnrollements = response.data?.content || [];
                const updatedEnrollements =
                    reset ? newEnrollements : [...enrollements, ...newEnrollements];
                setEnrollements(updatedEnrollements);
                setFilteredEnrollements(updatedEnrollements);
            } else {
                console.error('Failed to fetch recent enrollements:', response.response?.problem);
            }
        } catch (error) {
            console.error('An error occurred while fetching recent enrollements:', error);
        } finally {
            if (reset) setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAllEnrollements();
    }, [page]);

    useEffect(() => {
        const filteredData = enrollements.filter((item) => {
            const matchesClass =
                !classFilter || item.schoolClass?.name.toLowerCase().includes(classFilter.toLowerCase());
            const matchesName =
                !nameFilter ||
                `${item.student?.firstName} ${item.student?.lastName}`
                    .toLowerCase()
                    .includes(nameFilter.toLowerCase());
            return matchesClass && matchesName;
        });
        setFilteredEnrollements(filteredData);
    }, [classFilter, nameFilter, enrollements]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchAllEnrollements(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.studentContainer}
            onPress={() => navigation.navigate('StudentDetails')}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item?.student?.photo?.link }}
                    style={styles.studentImage}
                />
            </View>
            <View style={styles.infoContainer}>
                <StyledText style={styles.studentName}>
                    {item?.student?.firstName} {item?.student?.lastName}
                </StyledText>
                <StyledText style={styles.studentClass}>
                    Class: {item?.schoolClass?.name}
                </StyledText>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <SchoolHeader goBack={true}/>
            <View style={styles.container}>
                <View style={styles.filterContainer}>
                    <View style={styles.filterInputWrapper}>
                        <Ionicons name="school-outline" size={20} color="#7F8C8D" style={styles.filterIcon} />
                        <TextInput
                            style={styles.filterInput}
                            placeholder="Filter by class"
                            value={classFilter}
                            onChangeText={setClassFilter}
                        />
                    </View>
                    <View style={styles.filterInputWrapper}>
                        <Ionicons name="person-outline" size={20} color="#7F8C8D" style={styles.filterIcon} />
                        <TextInput
                            style={styles.filterInput}
                            placeholder="Filter by name"
                            value={nameFilter}
                            onChangeText={setNameFilter}
                        />
                    </View>
                </View>
                <FlatList
                    data={filteredEnrollements}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.orderId}
                    showsVerticalScrollIndicator={false}
                    onEndReached={() => setPage(prevPage => prevPage + 1)}
                    onEndReachedThreshold={0.5}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('StudentForm')}
                >
                    <Ionicons name="add" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    filterInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginHorizontal: 8,
        paddingHorizontal: 12,
    },
    filterIcon: {
        marginRight: 8,
    },
    filterInput: {
        flex: 1,
        height: 40,
        fontSize: 14,
    },
    studentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    imageContainer: {
        marginRight: 16,
    },
    studentImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#4A90E2',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    studentName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
    },
    studentClass: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 4,
    },
    fab: {
        position: 'absolute',
        bottom: 40,
        right: 30,
        width: 60,
        height: 60,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
});

export default StudentsScreen;
