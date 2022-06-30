import { Currency } from '../services/currencies-convertor/currencies-convertor.types';
import { Language } from '../services/translator/translator.types';
import * as Store from 'electron-store';
import { Settings } from './settings.types';

const defaultSettings = {
  shortcuts: {
    translate: ['Control', 'I'],
    transliterate: ['Control', 'T'],
    convertCurrency: ['Control', 'G'],
    humanizeText: ['Control', 'H'],
    spellCheck: ['Control', 'S'],
  },
  convertCurrencies: {
    from: Currency['US Dollar'],
    to: Currency['Ukrainian Hryvnia'],
  },
  translate: {
    to: Language.English,
  },
};

const settings = new Store();

export const initSettings = () => {
  let currentSettings = settings.store as Settings;

  if (!currentSettings.shortcuts) {
    settings.store = defaultSettings;
  }
};

export const changeSettings = (newSettings: Settings) => {
  settings.set('convertCurrencies', newSettings.convertCurrencies);
  settings.set('translate', newSettings.translate);
  settings.set('shortcuts', newSettings.shortcuts);
};

export default settings;
