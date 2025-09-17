import {GenderEnum, RolesEnum} from "./Static";
import { ImageSourcePropType } from "react-native";

export class SystemUserModel {
    createdAt?: string;
    updatedAt?: string;
    id?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    name?: string;
    tel?: string;
    resetToken?: string;
    language?: string;
    birthDate?: Date;
    role?: RolesEnum;
    isActive?: boolean
    gender?: GenderEnum;
    nationalityCode?: string;
    nationality?: string;
    password?: string;
    referredBy?: number;
    isTmpPassword?: boolean;
    isTelVerified?: Boolean;
    isVerified?: boolean;
    loginProvider?: string;
    logo: ImageSourcePropType;
    walletSold?: string;
}
