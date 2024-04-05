import i18n from "i18next";  
import { initReactI18next } from "react-i18next";
import HOME_EN from 'src/locales/en/home.json'
import PRODUCT_EN from 'src/locales/en/product.json'
import HOME_VI from 'src/locales/vi/home.json'
import PRODUCT_VI from 'src/locales/vi/product.json'

export const locales = {
    en: 'Tiếng Anh',
    vi: 'Tiếng Việt'
} as const
const resources = {
    en: {
        home: HOME_EN,
        product: PRODUCT_EN
    },
    vi: {
        home: HOME_VI,
        product: PRODUCT_VI
    }
};

const defaultNs = 'home'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "vi",
    ns: ['home', 'product'],
    fallbackLng: 'vi',
    defaultNs: defaultNs,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
});