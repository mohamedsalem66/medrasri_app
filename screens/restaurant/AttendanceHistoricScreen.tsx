import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useApi } from "../../hooks/useApi";
import { AttendanceApi } from "../../api/AttendanceApi";
import Colors from "../../constants/Colors";
import { FontsEnum } from "../../constants/FontsEnum";

const AttendanceHistoricScreen = () => {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAllAttendance = useApi(
        AttendanceApi.getAttendnaceBySchoolClassIdAndMonth,
        false,
        null,
        "Error while getting attendance",
        true
    );
    const getAllClasses = useApi(
        AttendanceApi.getSchoolClasses,
        false,
        null,
        "Error while getting classes",
        true
    );

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) fetchAttendanceData(selectedMonth, selectedClass);
    }, [selectedMonth, selectedClass]);

    useEffect(() => {
        if (selectedDay) {
            const filtered = attendanceData.filter(
                (item) => new Date(item.date).getDate() === selectedDay
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(attendanceData);
        }
    }, [selectedDay, attendanceData]);

    const fetchClasses = async () => {
        setIsLoading(true);
        try {
            const response = await getAllClasses.request();
            setClasses(response.data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAttendanceData = async (month, schoolClassId) => {
        setIsLoading(true);
        try {
            const response = await getAllAttendance.request(month, schoolClassId);
            setAttendanceData(response.data);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMonthChange = (direction) => {
        setSelectedMonth((prev) => {
            const newMonth = prev + direction;
            if (newMonth < 1) return 12;
            if (newMonth > 12) return 1;
            return newMonth;
        });
    };

    const renderDayNavigation = () => {
        const daysInMonth = new Date(2024, selectedMonth, 0).getDate();
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return (
            <FlatList
                horizontal
                data={days}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.dayButton,
                            selectedDay === item && styles.selectedDayButton,
                        ]}
                        onPress={() => setSelectedDay(item)}
                    >
                        <Text
                            style={[
                                styles.dayText,
                                selectedDay === item && styles.selectedDayText,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                style={styles.dayNavigation}
            />
        );
    };

    const renderAttendanceItem = ({ item }) => (
        <View style={styles.attendanceItem}>
            <View style={styles.attendanceHeader}>
                <Text style={styles.attendanceDate}>
                    {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={styles.attendanceCourse}>
                    Maths
                </Text>
            </View>
            <View style={styles.attendanceStats}>
                <Text style={styles.attendanceStatText}>
                    Present: 12
                </Text>
                <Text style={styles.attendanceStatText}>
                    Absent: 11
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Attendance History</Text>

            <Picker
                selectedValue={selectedClass}
                onValueChange={(itemValue) => setSelectedClass(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select Class" value={null} />
                {classes.map((cls) => (
                    <Picker.Item key={cls.id} label={cls.name} value={cls.id} />
                ))}
            </Picker>

            <View style={styles.monthNavigation}>
                <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                    <Text style={styles.arrow}>{"<"}</Text>
                </TouchableOpacity>
                <Text style={styles.monthText}>{months[selectedMonth - 1]}</Text>
                <TouchableOpacity onPress={() => handleMonthChange(1)}>
                    <Text style={styles.arrow}>{">"}</Text>
                </TouchableOpacity>
            </View>

            {renderDayNavigation()}

            {isLoading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : filteredData.length === 0 ? (
                <Text style={styles.noDataText}>No attendance records found.</Text>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAttendanceItem}
                    contentContainerStyle={styles.attendanceList}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f8",
        padding: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
    },
    picker: {
        height: 50,
        marginBottom: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
    },
    monthNavigation: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    arrow: {
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 10,
        color: Colors.primary,
    },
    monthText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    dayNavigation: {
        marginBottom: 16,
        maxHeight: 40
    },
    dayButton: {
        padding: 10,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: "#e0e0e0",
    },
    selectedDayButton: {
        backgroundColor: Colors.primary,
    },
    dayText: {
        fontSize: 14,
        color: "#333",
    },
    selectedDayText: {
        color: "#fff",
    },
    attendanceItem: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    attendanceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    attendanceDate: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.primary,
    },
    attendanceCourse: {
        fontSize: 14,
        color: "#666",
    },
    attendanceStats: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    attendanceStatText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    noDataText: {
        textAlign: "center",
        fontSize: 16,
        color: "#999",
        marginTop: 20,
    },
    attendanceList: {
        paddingBottom: 16,
    },
});

export default AttendanceHistoricScreen;
