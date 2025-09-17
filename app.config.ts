import 'dotenv/config';

import {ConfigContext} from '@expo/config';

const isDev = process.env.ENVIRONMENT === "development";
const isStg = process.env.ENVIRONMENT === "staging";
const isInteg = process.env.ENVIRONMENT === "integration";

export default ({config}: ConfigContext) => {
    let customConfig = {} ;
    if (isDev) {
        customConfig = {
            name: 'MarsaRestaurant (DEV)',
            scheme: "marsarestaurant-dev",
            ios: {
                ...config?.ios,
                bundleIdentifier: 'com.marsadrive.restaurant.dev',
            },
            android: {
                 ...config?.android,
                package: 'com.marsadrive.restaurant.dev',
            }
        }
    }
    if (isStg) {
        customConfig = {
            name: 'Medrasti App(STG)',
            scheme: "medrasti-app-stg",
            ios: {
                ...config?.ios,
                bundleIdentifier: 'com.medrasti.admin.stg',
                newArchEnabled: true
            },
            android: {
                ...config?.android,
                package: 'com.medrasti.admin.stg',
                newArchEnabled: true
            }
        }
    }
    if (isInteg) {
        customConfig = {
            name: 'MarsaRestaurant App (INTEG)',
            scheme: "marsarestaurant-integ",
            ios: {
                ...config?.ios,
                bundleIdentifier: 'com.marsadrive.restaurant.integ',
            },
            android: {
                ...config?.android,
                package: 'com.marsadrive.restaurant.integ',
            }
        }
    }
    return {
        ...config,
        ...customConfig
    }
};
