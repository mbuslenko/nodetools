import { Currency } from '../services/currencies-convertor/currencies-convertor.types';
import { Language } from '../services/translator/translator.types';
import * as Store from 'electron-store';
import { Settings } from './settings.types';
import { relaunchApp } from '../electron';
import { ErrorStructure } from '../errors/errors.types';
import { ipcMain } from 'electron';

const defaultSettings: Settings = {
  shortcuts: {
    translate: ['Control', 'I'],
    transliterate: ['Control', 'T'],
    convertCurrency: ['Control', 'G'],
    humanizeText: ['Control', 'H'],
    spellCheck: ['Control', 'S'],
    shortenUrl: ['Control', 'U'],
    calculate: ['Control', 'K'],
  },
  convertCurrencies: {
    from: Currency['US Dollar'],
    to: Currency['Ukrainian Hryvnia'],
  },
  translate: {
    to: Language.English,
  },
  restartToApplyChanges: false,
  errorsStorage: [],
};

const settings = new Store();

export const initSettings = () => {
  let currentSettings = settings.store as Settings;

  //if (!currentSettings.shortcuts) {
    settings.store = defaultSettings;
  //}

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

export const addErrorToStorage = (error: ErrorStructure) => {
  const errors = settings.get('errorsStorage') as ErrorStructure[];
  errors.push(error);

  settings.set('errorsStorage', errors);

  ipcMain.emit('handle-error', errors)
};

export const removeErrorFromStorage = (id: string) => {
  const errorsStorage = settings.get('errorsStorage') as ErrorStructure[];

  const newErrorsStorage = errorsStorage.filter((error) => error.id !== id);

  settings.set('errorsStorage', newErrorsStorage);
};

export default settings;
