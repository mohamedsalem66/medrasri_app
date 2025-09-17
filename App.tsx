import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Store from './store/Store'
import {AppRegistry, LogBox} from "react-native";
import 'moment/locale/fr';
import moment from 'moment';
import {makeId} from "./utils/functionHelpers";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import './utils/CostmeMomentAr'
import 'moment/locale/en-gb';
import 'moment/locale/ur';

import {
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    useFonts
} from "@expo-google-fonts/poppins";
import {getData} from "./utils/AsyncStorage";
import {DataKey, LangEnum} from "./models/Static";
import {initTranslation} from "./utils/Translater";
import {useAppNetInfo} from "./hooks/useAppNetInfo";
import CheckInternetScreen from "./screens/CheckInternetScreen";
import {useLang} from "./hooks/useLang";
import * as SplashScreen from "expo-splash-screen";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";


export default App;

function App() {
    const {isInternetReachable, checkNetwork} = useAppNetInfo(true);
    const {currentLangCode} = useLang();

    let [fontsLoaded] = useFonts({
        Poppins_700Bold,
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_500Medium,
        Poppins_300Light
    });

    useEffect(() => {
        if (currentLangCode) {
            moment.locale(currentLangCode);
        }
    }, [currentLangCode]);

    moment.relativeTimeThreshold('ss', 0);


    useEffect(() => {
        (async () => {
            await SplashScreen.preventAutoHideAsync();
            const currentLang = await getData(DataKey.currentLang)
            await initTranslation(currentLang ? currentLang : LangEnum.ar_AR);
        })()
    }, []);

    const colorScheme = useColorScheme();
    if (!fontsLoaded) return null;

    return (
        <ActionSheetProvider>
            <GestureHandlerRootView style={{flex: 1}}>
                <SafeAreaProvider style={{backgroundColor: '#FFF'}} key={makeId()}>
                    <Store>
                        {isInternetReachable === false ?
                            <CheckInternetScreen onPress={checkNetwork}/> :
                                <Navigation colorScheme={colorScheme}/>
                        }
                        <StatusBar backgroundColor='black'/>
                    </Store>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </ActionSheetProvider>
    );

}

AppRegistry.registerComponent('MarsaRide', () => App);
