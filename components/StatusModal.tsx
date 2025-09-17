import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from "../constants/Colors";
import {useLoader} from "../hooks/useLoader";

const StatusModal = ({ visible, onClose, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleConfirm = () => {
        if (selectedOption) {
            onSelect(selectedOption);
        }
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Pressable style={styles.closeIcon} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#333" />
                    </Pressable>
                    <Text style={styles.title}>Select Status</Text>
                    {['available', 'unavailable', '1-hour', '2-hour', '3-hour', '4-hour', 'next-day'].map(option => (
                        <TouchableOpacity
                            key={option}
                            style={styles.optionButton}
                            onPress={() => setSelectedOption(option)}
                        >
                            <Ionicons
                                name={selectedOption === option ? "radio-button-on" : "radio-button-off"}
                                size={20}
                                color={Colors.primary}
                            />
                            <Text style={styles.optionText}>{option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={handleConfirm}
                    >
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        width: 320,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        position: 'relative',
        alignItems: 'center',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
    confirmButton: {
        marginTop: 20,
        paddingVertical: 12,
        width: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 5,
    },
    confirmButtonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
});

export default StatusModal;
