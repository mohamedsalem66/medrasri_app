import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { FontAwesome, MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SchoolHeader from "../../components/SchoolHeader";
import { useAuth } from '../../hooks/useAuth';

const iconData = [
    { label: 'Students', icon: <FontAwesome name="users" size={30} color="#007AFF" />, screen: "StudentsScreen" },
    { label: 'Teachers', icon: <FontAwesome name="user" size={30} color="#FF9500" /> },
    { label: 'Attendance', icon: <MaterialIcons name="assignment" size={30} color="#34C759" /> ,screen: "Attendance" },
    { label: 'Syllabus', icon: <Ionicons name="book-outline" size={30} color="#5856D6" /> },
    { label: 'Time Table', icon: <FontAwesome name="calendar" size={30} color="#AF52DE" /> },
    { label: 'Assignments', icon: <Entypo name="text-document" size={30} color="#FF3B30" /> },
    { label: 'Exams', icon: <MaterialIcons name="quiz" size={30} color="#4CD964" /> },
    { label: 'Results', icon: <Entypo name="line-graph" size={30} color="#FFD60A" /> },
    { label: 'Fees', icon: <FontAwesome name="money" size={30} color="#FF2D55" /> },
    { label: 'Events', icon: <FontAwesome name="calendar-check-o" size={30} color="#5AC8FA" /> },
    { label: 'Inbox', icon: <FontAwesome name="inbox" size={30} color="#007AFF" /> },
    { label: 'Ask Doubt', icon: <FontAwesome name="question" size={30} color="#FF9500" /> },
    { label: 'Settings', icon: <Ionicons name="settings-outline" size={30} color="#808080" /> },
    { label: 'Logout', icon: <Ionicons name="log-out-outline" size={30} color="#FF3B30" /> },
];

const HomeAdminScreen = () => {
    const navigation = useNavigation();
    const { connectedUser, logOut } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleLogOut = async () => {
        await logOut();
        setIsModalVisible(false);
    };

    const confirmLogout = () => {
        setIsModalVisible(true);
    };

    const renderIconItem = ({ item }) => (
        <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
                if (item.label === 'Logout') {
                    confirmLogout();
                } else {
                    // @ts-ignore
                    navigation.navigate(item.screen);
                }
            }}
        >
            {item.icon}
            <Text style={styles.iconLabel}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <SchoolHeader manager={connectedUser} goBack={false} />
            <View style={styles.container}>
                <FlatList
                    data={iconData}
                    renderItem={renderIconItem}
                    keyExtractor={(item) => item.label}
                    numColumns={3}
                    contentContainerStyle={styles.iconGrid}
                />
            </View>

            {/* Logout Confirmation Modal */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Confirm Logout</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleLogOut}
                            >
                                <Text style={styles.confirmButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    iconGrid: {
        alignItems: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        margin: 10,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    iconLabel: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalMessage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',
    },
    confirmButton: {
        backgroundColor: '#FF3B30',
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeAdminScreen;
