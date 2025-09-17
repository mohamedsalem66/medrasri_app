import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import UserHeader from '../../components/UserHeader';

const enrollement = {
    student: {
        firstName: 'Alice',
        lastName: 'Johnson',
        dateOfBirth: '2005-04-21',
        tel: '123-456-7890',
        whatsappNumber: '123-456-7890',
        address: '123 Main St',
        genre: 'Female',
        photo: { uri: 'https://example.com/student-photo.jpg' }
    },
    schoolClass: {
        name: 'Grade 10',
        arabicName: 'الصف العاشر'
    },
    enrollementPrice: 2000,
    payed: false,
    year: '2024',
    enrollementPayments: [
        { id: 1, paymentDate: '2024-01-15', paidAmount: 500, paymentMethod: 'Credit Card', paymentStatus: 'Completed' },
        { id: 2, paymentDate: '2024-02-15', paidAmount: 500, paymentMethod: 'Cash', paymentStatus: 'Pending' },
    ],
    invoices: [
        { id: 1, ref: 'INV-12345', master: true, paymentMethod: 'Credit Card' },
    ]
};

const StudentDetailsScreen = () => {
    return (
        <>
            <UserHeader/>
            <ScrollView style={styles.container}>
            <View style={styles.profileSection}>
                <Image source={{ uri: enrollement.student.photo.uri }} style={styles.profileImage} />
                <Text style={styles.studentName}>{enrollement.student.firstName} {enrollement.student.lastName}</Text>
                <Text style={styles.studentDetails}>Date of Birth: {enrollement.student.dateOfBirth}</Text>
                <Text style={styles.studentDetails}>Phone: {enrollement.student.tel}</Text>
                <Text style={styles.studentDetails}>WhatsApp: {enrollement.student.whatsappNumber}</Text>
                <Text style={styles.studentDetails}>Address: {enrollement.student.address}</Text>
            </View>

            {/* Enrollment Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Enrollment Information</Text>
                <Text style={styles.infoText}>Class: {enrollement.schoolClass.name} ({enrollement.schoolClass.arabicName})</Text>
                <Text style={styles.infoText}>Year: {enrollement.year}</Text>
                <Text style={styles.infoText}>Enrollment Price: ${enrollement.enrollementPrice}</Text>
                <Text style={styles.infoText}>Payment Status: {enrollement.payed ? 'Paid' : 'Pending'}</Text>
            </View>

            {/* Payment History */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment History</Text>
                {enrollement.enrollementPayments.map(payment => (
                    <View key={payment.id} style={styles.paymentItem}>
                        <Text style={styles.paymentText}>Date: {payment.paymentDate}</Text>
                        <Text style={styles.paymentText}>Amount: ${payment.paidAmount}</Text>
                        <Text style={styles.paymentText}>Method: {payment.paymentMethod}</Text>
                        <Text style={styles.paymentText}>Status: {payment.paymentStatus}</Text>
                    </View>
                ))}
            </View>

            {/* Invoices */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Invoices</Text>
                {enrollement.invoices.map(invoice => (
                    <TouchableOpacity key={invoice.id} style={styles.invoiceItem}>
                        <Text style={styles.invoiceText}>Invoice Ref: {invoice.ref}</Text>
                        <Text style={styles.invoiceText}>Master: {invoice.master ? 'Yes' : 'No'}</Text>
                        <Text style={styles.invoiceText}>Payment Method: {invoice.paymentMethod}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 16,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    studentName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    studentDetails: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    section: {
        marginVertical: 10,
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    infoText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    paymentItem: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    paymentText: {
        fontSize: 14,
        color: '#444',
    },
    invoiceItem: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    invoiceText: {
        fontSize: 14,
        color: '#444',
    },
});

export default StudentDetailsScreen;
