import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Colors from '../constants/Colors';
import { isAndroid } from '../constants/PlatformConsts';

const MapMarkers = ({ driverPosition, restoPosition }) => {
    const mapRef = useRef<MapView>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (driverPosition && restoPosition) {
            const distance = calculateDistance(driverPosition, restoPosition);
            const zoomLevel = distance < 1000 ? 0.05 : 0.10;

            mapRef.current.animateToRegion({
                latitude: (driverPosition.latitude + restoPosition.latitude) / 2,
                longitude: (driverPosition.longitude + restoPosition.longitude) / 2,
                latitudeDelta: zoomLevel,
                longitudeDelta: zoomLevel,
            }, 1000);
        }
    }, [driverPosition, restoPosition]);

    const calculateDistance = (pos1, pos2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371e3; // Earth radius in meters
        const dLat = toRad(pos2.latitude - pos1.latitude);
        const dLon = toRad(pos2.longitude - pos1.longitude);
        const lat1 = toRad(pos1.latitude);
        const lat2 = toRad(pos2.latitude);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    const renderDirections = (origin, destination, color) => (
        <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={'AIzaSyC6mFvn9yYXTt9E_BLhHw6DKS9WdFiMoyw'}
            strokeWidth={2}
            strokeColor={color}
            lineDashPattern={[3, 5]}
        />
    );

    const animateMarker = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
    };

    return (
        <MapView
            ref={mapRef}
            style={styles.map}
            showsMyLocationButton={true}
            provider={isAndroid() ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            initialRegion={{
                latitude: restoPosition?.latitude,
                longitude: restoPosition?.longitude,
                latitudeDelta: 0.009,
                longitudeDelta: 0.009,
            }}
            onMapReady={animateMarker}
        >
            <Marker coordinate={driverPosition}>
                <Animated.View >
                    <Image source={require('../assets/icons/moto-white.png')} style={styles.markerIcon} />
                </Animated.View>
            </Marker>
            <Marker coordinate={restoPosition}>
                <View >
                    <Image source={require('../assets/icons/restaurant_marker.png')} style={styles.restoMarker} />
                </View>
            </Marker>
            {renderDirections(driverPosition, restoPosition, Colors.primary)}
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
        zIndex: 1,
    },
    markerContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    restoMarker: {
        width: 40,
        height: 40,
    },
    markerIcon: {
        width: 60,
        height: 60,
    },
});

export default MapMarkers;
