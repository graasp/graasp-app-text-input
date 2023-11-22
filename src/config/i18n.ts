import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../langs/en.json';
import fr from '../langs/fr.json';

i18n.use(initReactI18next).init({
  resources: {
    en,
    fr,
  },
  fallbackLng: 'en',
  // debug only when not in production
  debug: import.meta.env.DEV,
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
});

export default i18n;
