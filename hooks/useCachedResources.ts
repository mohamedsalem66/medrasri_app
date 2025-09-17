import {Ionicons} from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useState} from 'react';
import {
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    useFonts
} from "@expo-google-fonts/poppins";
import {useAuth} from "./useAuth";
import {getData, storeData} from "../utils/AsyncStorage";
import {DataKey, LangEnum} from "../models/Static";
import {initTranslation} from "../utils/Translater";
import * as Updates from 'expo-updates';
import Constants from "expo-constants";

export default function useCachedResources() {
    const [isLoadingComplete, setLoadingComplete] = useState(false);
    let [fontsLoaded] = useFonts({
        Poppins_700Bold,
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_500Medium,
        Poppins_300Light
    });
    const {refreshUser} = useAuth();

    // Load any resources or data that we need prior to rendering the app
    useEffect(() => {
        (async () => {
            try {
                if (Constants.appOwnership !== 'expo') {
                    const update = await Updates.checkForUpdateAsync();
                    if (update.isAvailable) {
                        await Updates.fetchUpdateAsync();
                        // ... notify user of update ...
                        await Updates.reloadAsync();
                    }
                }
                const currentLang = await getData(DataKey.currentLang)
                await initTranslation(currentLang ? currentLang : LangEnum.en_EN);
                await refreshUser();

            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setLoadingComplete(true);
                await SplashScreen.hideAsync().catch(reason => console.log(reason));
            }
        })()
    }, []);

    return isLoadingComplete && fontsLoaded;
}
