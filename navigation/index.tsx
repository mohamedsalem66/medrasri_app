import React, {useEffect, useRef, useState} from 'react';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LinkingConfiguration from './LinkingConfiguration';
import LoginScreen from "../screens/auth/LoginScreen";
import {navigationRef} from "../utils/CustomeNavigate";
import useCachedResources from "../hooks/useCachedResources";
import {useAuth} from "../hooks/useAuth";
import {Host} from 'react-native-portalize';
import {getData} from "../utils/AsyncStorage";
import {DataKey, LangEnum} from "../models/Static";
import {initTranslation} from "../utils/Translater";
import OrderScreen from "../screens/restaurant/OrderScreen";
import DriverLocationScreen from "../screens/restaurant/DriverLocationScreen";
import SupplementScreen from "../screens/restaurant/SupplementScreen";
import DeclineScreen from "../screens/restaurant/DeclineScreen";
import AvailabilityStatusScreen from "../screens/restaurant/AttendanceHistoricScreen";
import EditOrderScreen from "../screens/restaurant/EditOrderScreen";
import SupplementIndisponibleScreen from "../screens/restaurant/SupplementIndisponibleScreen";
import HomeAdminScreen from "../screens/restaurant/HomeAdminScreen";
import RecentOrdersScreen from "../screens/restaurant/RecentOrdersScreen";
import StudentsScreen from "../screens/restaurant/StudentsScreen";
import StudentDetailsScreen from "../screens/restaurant/StudentDetailsScreen";
import StudentFormScreen from "../screens/restaurant/StudentFormScreen";
import AttendanceForm from '../screens/restaurant/AttendanceScreen';
import AttendanceHistoricScreen from "../screens/restaurant/AttendanceHistoricScreen";

export default function Navigation({colorScheme}) {
    const {connectedUser, token, refreshUser, storeToken} = useAuth();
    const [sessionOpened, setSessionOpened] = useState(false);
    const isLoadingComplete = useCachedResources();
    const navigationReadyRef = useRef(false);



    useEffect(() => {
        const initializeTranslation = async () => {
            const currentLang = await getData(DataKey.currentLang);
            await initTranslation(currentLang || LangEnum.en_EN);
        };
        initializeTranslation().then(() => {
        });
    }, [connectedUser]);

    useEffect(() => {
        if (isLoadingComplete) {
            if (connectedUser?.id && token) {
                setSessionOpened(true);
            } else {
                setSessionOpened(false);
            }
        }
    }, [token, connectedUser, isLoadingComplete]);


    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                navigationReadyRef.current = true;
            }}
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            {isLoadingComplete && (
                <>
                    {sessionOpened ? <RootNavigator/> : <AuthNavigator/>}
                </>
            )}

        </NavigationContainer>
    );
}


const AuthStack = createStackNavigator();

function AuthNavigator() {
    return (
        <Host>
            <AuthStack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
                <AuthStack.Screen name="Login" component={LoginScreen}/>
            </AuthStack.Navigator>
        </Host>
    );
}

const Stack = createStackNavigator();

function RootNavigator() {
    return (
        <Host>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Root" component={HomeAdminScreen}  />
                <Stack.Screen name={'OrderScreen'} component={OrderScreen}/>
                <Stack.Screen name={'DriverLocation'} component={DriverLocationScreen}/>
                <Stack.Screen name={'SupplementScreen'} component={SupplementScreen}/>
                <Stack.Screen name={'AvailabilityStatusScreen'} component={AvailabilityStatusScreen}/>
                <Stack.Screen name={'Decline'} component={DeclineScreen}/>
                <Stack.Screen name={'EditOrder'} component={EditOrderScreen}/>
                <Stack.Screen name={'Attendance'} component={AttendanceHistoricScreen}/>
                <Stack.Screen name={'SupplementIndisponible'} component={SupplementIndisponibleScreen}/>
                <Stack.Screen name="Home" component={HomeAdminScreen} />
                <Stack.Screen name="Orders" component={RecentOrdersScreen} />
                <Stack.Screen name="StudentsScreen" component={StudentsScreen} />
                <Stack.Screen name="Availability" component={AvailabilityStatusScreen} />
                <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} />
                <Stack.Screen name="StudentForm" component={StudentFormScreen} />

            </Stack.Navigator>
        </Host>
    );
}
