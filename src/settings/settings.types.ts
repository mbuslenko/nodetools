import { Currency } from '../services/currencies-convertor/currencies-convertor.types';
import { Language } from '../services/translator/translator.types';

export type Settings = {
  shortcuts: ShortcutsSettings;
  convertCurrencies: {
    from: Currency;
    to: Currency;
  },
  translate: {
    to: Language;
  }
  restartToApplyChanges?: boolean;
}

export type ShortcutsSettings = {
  translate: string[];
  transliterate: string[];
  convertCurrency: string[];
  humanizeText: string[];
  spellCheck: string[];
}
