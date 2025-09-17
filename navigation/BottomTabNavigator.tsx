import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from "../components/Drawer";
import RecentOrdersScreen from "../screens/restaurant/RecentOrdersScreen";
import AvailabilityStatusScreen from '../screens/restaurant/AttendanceHistoricScreen';
import StudentFormScreen from "../screens/restaurant/StudentFormScreen";
import HomeAdminScreen from "../screens/restaurant/HomeAdminScreen";
import StudentsScreen from "../screens/restaurant/StudentsScreen";
import StudentDetailsScreen from "../screens/restaurant/StudentDetailsScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {


    return (<Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props: any) => <CustomDrawerContent {...props} />}
        screenOptions={{
            drawerStyle: {
                width: '85%',
                backgroundColor: '#F9F9F9',
            },
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            drawerType: 'front',
            headerShown: false
        }}
    >
        <Drawer.Screen name="Home" component={HomeAdminScreen} options={{title: 'Orders overview'}}/>
        <Drawer.Screen name="Orders" component={RecentOrdersScreen} options={{title: 'Recent Orders'}}/>
        <Drawer.Screen name="StudentsScreen" component={StudentsScreen} options={{title: 'StudentsScreen'}}/>
        <Drawer.Screen name="Availability" component={AvailabilityStatusScreen} options={{title: 'Availability'}}/>
        <Drawer.Screen name="StudentDetails" component={StudentDetailsScreen} options={{title: 'Student Details'}}/>
        <Drawer.Screen name="StudentForm" component={StudentFormScreen} options={{title: 'Help'}}/>
    </Drawer.Navigator>);
}








