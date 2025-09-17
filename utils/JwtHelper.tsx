import jwt_decode from "jwt-decode";
import jwtDecode from "jwt-decode";
import {DataKey} from "../models/Static";
import {getSecureData} from "./SecureStorage";

export const decodeJwt = async () => {
    const token = await getSecureData(DataKey.token);
    const refreshToken = await getSecureData(DataKey.refreshToken);
    const accessTokenExpiry = await getSecureData(DataKey.accessTokenExpiry);
    const refreshTokenExpiry = await getSecureData(DataKey.refreshTokenExpiry);

    if (isJwtExpired(token)) return null

    const decodedJwt = jwt_decode(token);

    return {userName: decodedJwt.sub, token, refreshToken, accessTokenExpiry, refreshTokenExpiry};
};


const isJwtExpired = (token) => {
    if (typeof (token) !== 'string' || !token) {
        return true;
    }

    let isJwtExpired = false;
    const {exp} = jwtDecode(token);
    const currentTime = new Date().getTime() / 1000;

    if (currentTime > exp) isJwtExpired = true;

    return isJwtExpired;
}
