import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from '../langs/ar.json';
import de from '../langs/de.json';
import en from '../langs/en.json';
import es from '../langs/es.json';
import fr from '../langs/fr.json';
import it from '../langs/it.json';

i18n.use(initReactI18next).init({
  resources: {
    en,
    fr,
    de,
    it,
    ar,
    es,
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
