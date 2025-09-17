import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import UserHeader from "../../components/UserHeader";
import StudentInfoStepTwo from "../auth/forms/StudentInfoStepTwo";
import SchoolHeader from "../../components/SchoolHeader";

const StudentFormScreen = () => {
    const onSubmit = data => {
        console.log("Form Data: ", data);
    };

    return (
        <>
            <SchoolHeader goBack={true}/>
            <StudentInfoStepTwo onSubmit={onSubmit} />

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    label: {
        fontSize: 16,
        color: '#8E8E93',
        marginTop: 20,
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        color: '#333',
    },
    genderContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    genderButton: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginHorizontal: 5,
        backgroundColor: '#FFFFFF',
    },
    genderButtonActive: {
        borderColor: '#007AFF',
        backgroundColor: '#E0F0FF',
    },
    genderText: {
        fontSize: 16,
        color: '#8E8E93',
    },
    genderTextActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    submitButton: {
        marginTop: 30,
        backgroundColor: '#007AFF',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default StudentFormScreen;
