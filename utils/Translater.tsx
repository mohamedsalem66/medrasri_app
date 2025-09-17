import i18n from 'i18n-js';
import {I18nManager} from 'react-native';
import {memoize} from "lodash";
import {LangEnum} from "../models/Static";
/*
export const translationGetters = {
    'fr-FR': () => require('../assets/translations/fr.json'),
    'ar-AR': () => require('../assets/translations/ar.json'),
    'en-EN': () => require('../assets/translations/en.json')
};*/


export const IMLocalized = memoize(
    (key, config?) =>
        i18n.t(key, config).includes('missing') ? key : i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key),
);
export const initTranslation = async (lang: LangEnum | string = LangEnum.ar_AR) => {
    //let localeLanguageTag = Localization.locale;
    let localeLanguageTag = lang;
    let isRTL = lang === LangEnum.ar_AR || lang === LangEnum.ur_UR;
    IMLocalized.cache.clear();
    // update layout direction
    I18nManager.forceRTL(isRTL);
    i18n.locale = localeLanguageTag;
};
