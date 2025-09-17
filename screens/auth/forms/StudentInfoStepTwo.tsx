import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import {ImageUpload} from "../../../components/ImageUpload";
import {PhotoPickerModal} from "../../../components/PhotoPickerModal";
import {convertToB64} from "../../../utils/functionHelpers";

type imgTypeName = 'photo' | 'card' ;

const StudentInfoStepOne = ({onSubmit}) => {
    const { control, handleSubmit } = useForm();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gender, setGender] = useState('Female');

    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [imgType, setImgType] = useState<imgTypeName>('photo');

    const deleteImage = (imgType: imgTypeName) => {
        console.log("delete")
    };

    const pickImage = (imgType: imgTypeName) => {
        console.log(imgType)
        setImgType(imgType);
        setPhotoModalVisible(true);
    };

    const handleImageSelected = async (imageUri: string) => {
        const base64Image = await convertToB64(imageUri, false);
        console.log(base64Image)
        setPhotoModalVisible(false);
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
            <View style={styles.container}>
                <Text style={styles.title}>Enrollment</Text>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <View>
                        <Text style={styles.label}>First Name</Text>
                        <Controller
                            name="firstName"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your name"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                    </View>
                    <View>
                        <Text style={styles.label}>Last Name</Text>
                        <Controller
                            name="lastName"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your name"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                    </View>

                </View>

                <Text style={styles.label}>Your login or email</Text>
                <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                    <TouchableOpacity
                        style={[styles.genderButton, gender === 'Female' && styles.genderButtonActive]}
                        onPress={() => setGender('Female')}
                    >
                        <Text style={[styles.genderText, gender === 'Female' && styles.genderTextActive]}>Female</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.genderButton, gender === 'Male' && styles.genderButtonActive]}
                        onPress={() => setGender('Male')}
                    >
                        <Text style={[styles.genderText, gender === 'Male' && styles.genderTextActive]}>Male</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Birth Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                    <MaterialIcons name="calendar-today" size={20} color="#8E8E93" />
                    <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                <Text style={styles.label}>Email</Text>
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                <Text style={styles.label}>Mobile</Text>
                <Controller
                    name="mobile"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your mobile number"
                            keyboardType="phone-pad"
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.submitButtonText}>Register</Text>
                </TouchableOpacity>

                <ImageUpload
                    deleteImage={() => deleteImage('photo')}
                    onPress={() => pickImage('photo')}
                    label="Photo"
                    iconSize={60}
                    secondaryIconSize={25}
                    styleDelete={{right: 18}}
                />

                <PhotoPickerModal
                    visible={photoModalVisible}
                    onClose={() => setPhotoModalVisible(false)}
                    onImageSelected={handleImageSelected}
                />
            </View>
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

export default StudentInfoStepOne;
