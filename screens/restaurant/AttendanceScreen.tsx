import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Switch,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useApi} from "../../hooks/useApi";
import {EnrollementsApi} from "../../api/EnrollementsApi";
import {AttendanceApi} from "../../api/AttendanceApi";

const mockData = [
    { id: '1', name: 'Akash Gupta', rollNo: '01', status: 'Present' },
    { id: '2', name: 'Brijesh Gupta', rollNo: '02', status: 'Absent' },
    { id: '3', name: 'Cajoton D’souza', rollNo: '03', status: 'Present' },
    { id: '4', name: 'Danish Shaikh', rollNo: '04', status: 'Present' },
    { id: '5', name: 'Daniel Walter', rollNo: '05', status: 'Present' },
    { id: '6', name: 'Faisal Khan', rollNo: '06', status: 'Present' },
    { id: '7', name: 'Ishwar Palekar', rollNo: '07', status: 'Present' },
];

const AttendanceScreen = () => {
    const [attendanceData, setAttendanceData] = useState(mockData);
    const [date, setDate] = useState(new Date());
    const [isTeacherPresent, setIsTeacherPresent] = useState(true);


    const toggleStatus = (id) => {
        setAttendanceData((prevData) =>
            prevData.map((item) =>
                item.id === id
                    ? { ...item, status: item.status === 'Present' ? 'Absent' : 'Present' }
                    : item
            )
        );
    };

    const handleSubmit = () => {
        // Simulate payload structure
        const payload = {
            weeklySchedule: {
                id: 2, // Static ID, replace as needed
            },
            teacherPresent: isTeacherPresent,
            date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            studentAttendances: attendanceData.map((student) => ({
                student: {
                    id: parseInt(student.id), // Convert to integer
                },
                present: student.status === 'Present',
            })),
        };

        // Log payload to console
        console.log('Payload:', JSON.stringify(payload, null, 2));
    };

    const renderItem = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={[styles.tableText, styles.columnName]}>{item.name}</Text>
            <Text style={[styles.tableText, styles.columnRollNo]}>{item.rollNo}</Text>
            <Switch
                value={item.status === 'Present'}
                onValueChange={() => toggleStatus(item.id)}
                trackColor={{ false: '#E74C3C', true: '#2ECC71' }}
                thumbColor={item.status === 'Present' ? '#27AE60' : '#C0392B'}
                style={styles.switch}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Text style={styles.date}>
                        {date.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.className}>Basic of Geometry Class</Text>
            </View>

            {/* Teacher Attendance Toggle */}
            <View style={styles.teacherAttendance}>
                <Text style={styles.teacherText}>Teacher Present</Text>
                <Switch
                    value={isTeacherPresent}
                    onValueChange={() => setIsTeacherPresent(!isTeacherPresent)}
                    trackColor={{ false: '#E74C3C', true: '#2ECC71' }}
                    thumbColor={isTeacherPresent ? '#27AE60' : '#C0392B'}
                />
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.columnName]}>Name</Text>
                <Text style={[styles.tableHeaderText, styles.columnRollNo]}>N°</Text>
                <Text style={[styles.tableHeaderText, styles.columnStatus]}>Status</Text>
            </View>

            {/* Attendance List */}
            <FlatList
                data={attendanceData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.tableContainer}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Confirm & Submit Attendance</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        padding: 20,
        backgroundColor: '#3498DB',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'center',
    },
    date: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
    },
    className: {
        fontSize: 16,
        color: '#FFF',
        marginTop: 5,
    },
    teacherAttendance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    teacherText: {
        fontSize: 16,
        color: '#34495E',
        fontWeight: 'bold',
    },
    tableContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#3498DB',
        paddingVertical: 10,
        borderRadius: 5,
        marginHorizontal: 10,
        marginTop: 5,
    },
    tableHeaderText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    columnName: {
        flex: 2,
        textAlign: 'left',
        paddingLeft: 10,
    },
    columnRollNo: {
        flex: 1,
        textAlign: 'center',
    },
    columnStatus: {
        flex: 1,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        paddingVertical: 10,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    tableText: {
        fontSize: 14,
        color: '#34495E',
    },
    switch: {
        alignSelf: 'center',
    },
    submitButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#3498DB',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default AttendanceScreen;
