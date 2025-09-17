import apiClient from "./ApiClient";
import { Endpoints } from "./Endpoints";

const endPoint = `${Endpoints.MARSA_DRIVE}/`;

const getAttendnaceBySchoolClassIdAndMonth = (month, schoolClassId) => {
    return apiClient.get(`${endPoint}attendance/by-month-and-course?month=${month}&schoolClassId=${schoolClassId}`);
};

const getSchoolClasses = () => {
    return apiClient.get(`${endPoint}school-classes/all`);
};



export const AttendanceApi = {
    getAttendnaceBySchoolClassIdAndMonth,
    getSchoolClasses
};
