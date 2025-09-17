import * as yup from "yup";
import { IMLocalized } from "../utils/Translater";

export const stepOneValidation = yup.object().shape({
    firstName: yup.string()
        .min(3, IMLocalized('First name must be at least 3 characters'))
        .required(IMLocalized('First name is required')),
    lastName: yup.string()
        .min(3, IMLocalized('Last name must be at least 3 characters'))
        .required(IMLocalized('Last name is required')),
    email: yup.string()
        .email(IMLocalized('Email is not valid'))
        .required(IMLocalized('Email is required')),
    tel: yup.string()
        .matches(/^[234][0-9]{7}$/, IMLocalized('Phone number must be 8 digits and start with 2, 3, or 4'))
        .required(IMLocalized('Phone number is required')),
    password: yup.string()
        .min(8, IMLocalized('Minimum password length 8 characters'))
        .required(IMLocalized('Password is required')),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], IMLocalized('Passwords do not match'))
        .required(IMLocalized('Confirm password is required')),
    nationality: yup.string().required(IMLocalized('Nationality is required')),
    gender: yup.string().required(IMLocalized('Gender is required')),

});

export const stepTwoValidation = yup.object().shape({
    profileImage: yup.object().shape({
        type: yup.string().required(IMLocalized('Profile image type is required')),
        thumbnail: yup.string().required(IMLocalized('Profile image is required')),
    }),
    nni: yup.string()
        .when('nationality', {
            is: 'Mauritania',
            then: yup.string()
                .matches(/^[0-9]{10}$/, IMLocalized('NNI must be 10 digits'))
                .required(IMLocalized('NNI is required')),
            otherwise: yup.string().notRequired(),
        }),
    passportNumber: yup.string()
        .when('nationality', {
            is: (value) => value !== 'Mauritania',
            then: yup.string()
                .matches(/^[A-Z0-9]{5,9}$/, IMLocalized('Passport number is invalid'))
                .required(IMLocalized('Passport number is required')),
            otherwise: yup.string().notRequired(),
        }),
    passport: yup.object().shape({
        type: yup.string()
            .when('nationality', {
                is: (value) => value !== 'Mauritania',
                then: yup.string().required(IMLocalized('Passport image type is required')),
                otherwise: yup.string().notRequired(),
            }),
        thumbnail: yup.string()
            .when('nationality', {
                is: (value) => value !== 'Mauritania',
                then: yup.string().required(IMLocalized('Passport image is required')),
                otherwise: yup.string().notRequired(),
            }),
    }),
    identityFront: yup.object().shape({
        type: yup.string()
            .when('nationality', {
                is: 'Mauritania',
                then: yup.string().required(IMLocalized('Identity front image type is required')),
                otherwise: yup.string().notRequired(),
            }),
        thumbnail: yup.string()
            .when('nationality', {
                is: 'Mauritania',
                then: yup.string().required(IMLocalized('Identity front image is required')),
                otherwise: yup.string().notRequired(),
            }),
    }),
    identityBack: yup.object().shape({
        type: yup.string()
            .when('nationality', {
                is: 'Mauritania',
                then: yup.string().required(IMLocalized('Identity back image type is required')),
                otherwise: yup.string().notRequired(),
            }),
        thumbnail: yup.string()
            .when('nationality', {
                is: 'Mauritania',
                then: yup.string().required(IMLocalized('Identity back image is required')),
                otherwise: yup.string().notRequired(),
            }),
    }),
});


export const stepThreeValidation = yup.object().shape({
    vehicleType: yup.string()
        .required(IMLocalized('Vehicle type is required'))
        .oneOf(['MOTORBIKE_DRIVER', 'CAR_DRIVER', 'TRUCK_DRIVER', 'MOTOR_DRIVER'], IMLocalized('Invalid vehicle type')),

    vehicleImage: yup.object().shape({
        type: yup.string().required(IMLocalized('Image is required')),
        thumbnail: yup.string().required(IMLocalized('Image is required')),
    }),

    cartGrisFront: yup.mixed().when('vehicleType', {
        is: (val) => val !== 'MOTORBIKE_DRIVER',
        then: yup.object().shape({
            type: yup.string().required(IMLocalized('Image is required')),
            thumbnail: yup.string().required(IMLocalized('Image is required')),
        }),
        otherwise: yup.mixed().notRequired(),
    }),

    cartGrisBack: yup.mixed().when('vehicleType', {
        is: (val) => val !== 'MOTORBIKE_DRIVER',
        then: yup.object().shape({
            type: yup.string().required(IMLocalized('Image is required')),
            thumbnail: yup.string().required(IMLocalized('Image is required')),
        }),
        otherwise: yup.mixed().notRequired(),
    }),

    permit: yup.mixed().when('vehicleType', {
        is: (val) => val !== 'MOTORBIKE_DRIVER',
        then: yup.object().shape({
            type: yup.string().required(IMLocalized('Image is required')),
            thumbnail: yup.string().required(IMLocalized('Image is required')),
        }),
        otherwise: yup.mixed().notRequired(),
    }),

    serialNumber: yup.string().when('vehicleType', {
        is: (val) => val !== 'MOTORBIKE_DRIVER',
        then: yup.string()
            .min(3, IMLocalized('Serial number must be at least 8 characters'))
            .required(IMLocalized('Serial number is required'))
            .nullable(),
        otherwise: yup.string().notRequired().nullable(),
    }),
});


export const stepFourValidation = yup.object().shape({
    accounts: yup.array().of(
        yup.object().shape({
            tel: yup.string()
                .matches(/^[0-9]{8}$/, IMLocalized('Phone number must be 8 digits'))
                .required(IMLocalized('Account phone number is required')),
            type: yup.string()
                .required(IMLocalized('Account type is required')),
            iban: yup.string().optional(),
        })
    )
});
