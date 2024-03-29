import { Currency } from '../services/currencies-convertor/currencies-convertor.types';
import { Language } from '../services/translator/translator.types';
import * as Store from 'electron-store';
import { Settings } from './settings.types';
import { relaunchApp } from '../main';
import { ErrorStructure } from '../errors/errors.types';
import { ipcMain } from 'electron';
import axios from 'axios';

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
	transliterate: {
		to: null,
	},
	restartToApplyChanges: false,
	errorsStorage: [],
	airAlerts: {
		state: null,
		enabled: null,
	},
};

const settings = new Store<Settings>();

export const setDefaultSettings = () => {
	settings.store = defaultSettings;
}

export const initSettings = async () => {
	const currentSettings = settings.store as Settings;

	if (!currentSettings.shortcuts) {
		setDefaultSettings();

		// if settings are not set, so it's a new user
		await axios.request({
			method: 'POST',
			url: 'https://nodetools-back.herokuapp.com/api/v1/users/new',
			data: {
				platform: process.platform,
			},
		});
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

/**
 * Change one property of settings
 * @param {string} key - The key of the setting to change.
 * @param {unknown} value - The value to set the setting to.
 */
export const changeSetting = (key: string, value: unknown) => {
	settings.set(key, value);
};

export const addErrorToStorage = (error: ErrorStructure) => {
	const errors = settings.get('errorsStorage') as ErrorStructure[];
	errors.push(error);

	settings.set('errorsStorage', errors);

	ipcMain.emit('handle-error', errors);
};

export const removeErrorFromStorage = (id: string) => {
	const errorsStorage = settings.get('errorsStorage') as ErrorStructure[];

	const newErrorsStorage = errorsStorage.filter((error) => error.id !== id);

	settings.set('errorsStorage', newErrorsStorage);
};

export default settings;
