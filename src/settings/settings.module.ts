import { Currency } from '../services/currencies-convertor/currencies-convertor.types';
import { Language } from '../services/translator/translator.types';

const settings = {
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

export default settings;
