import { Currency } from '../services/currencies-convertor/currencies-convertor.types';
import { Language } from '../services/translator/translator.types';
import { ErrorStructure } from '../errors/errors.types';

export type Settings = {
	shortcuts: ShortcutsSettings;
	convertCurrencies: {
		from: Currency;
		to: Currency;
	};
	translate: {
		to: Language;
	};
	restartToApplyChanges?: boolean;
	errorsStorage: ErrorStructure[];
	airAlerts: {
		enabled: boolean;
		state: string;
	};
};

export type ShortcutsSettings = {
	translate: string[];
	transliterate: string[];
	convertCurrency: string[];
	humanizeText: string[];
	spellCheck: string[];
	shortenUrl: string[];
	calculate: string[];
};
