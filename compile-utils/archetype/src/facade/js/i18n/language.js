import en from './en';
import es from './es';

/**
 * Default object with es and en translate.
 *
 * @const
 * @type {object}
 */
const translations = {
  en,
  es,
};

const getLang = () => {
  let res = 'es';
  if (typeof IDEE.language.getLang === 'function') {
    res = IDEE.language.getLang();
  }

  return res;
};

/**
 * This function sets a new language translate.
 * @param {string} lang
 * @param {JSON} json
 * @public
 * @api
 */
export const addTranslation = (lang, json) => {
  translations[lang] = json;
};

/**
 * This function gets a language translate.
 *
 * @param {string} lang
 * @return {JSON}
 * @public
 * @api
 */
export const getTranslation = (lang) => {
  if (lang === 'es' || lang === 'en') {
    return translations[lang];
  }
  return IDEE.language.getTranslation(lang).basic;
};

/**
 * This function gets a language value from key
 *
 * @public
 * @param {string}
 * @param {string}
 * @return {string}
 * @public
 * @api
 */

export const getValue = (keyPath, lang = getLang()) => {
  const translation = getTranslation(lang);
  let value = '';
  if (IDEE.utils.isNullOrEmpty(translation)) {
    /* eslint-disable no-console */
    console.warn(`The translation '${lang}' has not been defined.`);
  } else {
    value = keyPath.split('.').reduce((prev, current) => prev[current], translation);
  }

  return value;
};
