import apiClient from "./ApiClient";
import { Endpoints } from "./Endpoints";

const endPoint = `${Endpoints.MARSA_DRIVE}/`;

const getEnrollementAll = (page) => {
    return apiClient.get(`${endPoint}enrollements/all?page=${page}`);
};

const getEnrollement = (enrollementId) => {
    return apiClient.get(`${endPoint}enrollements/${enrollementId}`);
};



export const EnrollementsApi = {
    getEnrollement,
    getEnrollementAll
};
