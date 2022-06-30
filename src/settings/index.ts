import { Currency } from '../services/currencies-convertor/currencies-convertor.types';
import { Language } from '../services/translator/translator.types';
import * as Store from 'electron-store';
import { Settings } from './settings.types';
import { relaunchApp } from '../main';

const defaultSettings: Settings = {
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
  restartToApplyChanges: false,
};

const settings = new Store();

export const initSettings = () => {
  let currentSettings = settings.store as Settings;

  if (!currentSettings.shortcuts) {
    settings.store = defaultSettings;
  }

  settings.set('restartToApplyChanges', false);
};

export const changeSettings = (newSettings: Settings) => {
  settings.set('convertCurrencies', newSettings.convertCurrencies);
  settings.set('translate', newSettings.translate);

  const shortcutsSettings = settings.get('shortcuts') as Settings['shortcuts'];
  if (
    JSON.stringify(shortcutsSettings) != JSON.stringify(newSettings.shortcuts)
  ) {
    settings.set('shortcuts', newSettings.shortcuts);
    settings.set('restartToApplyChanges', true);

    relaunchApp();
  }
};

export default settings;
