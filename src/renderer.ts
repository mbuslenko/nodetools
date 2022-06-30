// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features

const settings = {
  shortcuts: {
    translate: ['Control', 'I'],
    transliterate: ['Control', 'T'],
    convertCurrency: ['Control', 'G'],
    humanizeText: ['Control', 'H'],
    spellCheck: ['Control', 'S'],
  },
};

enum Language {
  'Afrikaans' = 'af',
  'Amharic' = 'am',
  'Arabic' = 'ar',
  'Aragonese' = 'an',
  'Armenian' = 'hy',
  'Avaric' = 'av',
  'Avestan' = 'ae',
  'Azerbaijani' = 'az',
  'Basque' = 'eu',
  'Belarusian' = 'be',
  'Bengali' = 'bn',
  'Bosnian' = 'bs',
  'Bulgarian' = 'bg',
  'Burmese' = 'my',
  'Catalan' = 'ca',
  'Chamorro' = 'ch',
  'Chechen' = 'ce',
  'Chichewa' = 'ny',
  'Chinese' = 'zh',
  'Chuvash' = 'cv',
  'Cornish' = 'kw',
  'Corsican' = 'co',
  'Cree' = 'cr',
  'Croatian' = 'hr',
  'Czech' = 'cs',
  'Danish' = 'da',
  'Dutch' = 'nl',
  'English' = 'en',
  'Esperanto' = 'eo',
  'Estonian' = 'et',
  'Finnish' = 'fi',
  'French' = 'fr',
  'Fula' = 'ff',
  'Galician' = 'gl',
  'Georgian' = 'ka',
  'German' = 'de',
  'Greek' = 'el',
  'Gujarati' = 'gu',
  'Haitian' = 'ht',
  'Hausa' = 'ha',
  'Hebrew' = 'he',
  'Herero' = 'hz',
  'Hindi' = 'hi',
  'Hiri Motu' = 'ho',
  'Hungarian' = 'hu',
  'Icelandic' = 'is',
  'Ido' = 'io',
  'Igbo' = 'ig',
  'Indonesian' = 'id',
  'Irish' = 'ga',
  'Italian' = 'it',
  'Japanese' = 'ja',
  'Javanese' = 'jv',
  'Kannada' = 'kn',
  'Kanuri' = 'kr',
  'Kazakh' = 'kk',
  'Khmer' = 'km',
  'Kikuyu' = 'ki',
  'Kinyarwanda' = 'rw',
  'Komi' = 'kv',
  'Kongo' = 'kg',
  'Korean' = 'ko',
  'Kurdish' = 'ku',
  'Kwanyama' = 'kj',
  'Kyrgyz' = 'ky',
  'Lao' = 'lo',
  'Latin' = 'la',
  'Latvian' = 'lv',
  'Limburgish' = 'li',
  'Lithuanian' = 'lt',
  'Luba-Katanga' = 'lu',
  'Luxembourgish' = 'lb',
  'Macedonian' = 'mk',
  'Malagasy' = 'mg',
  'Malay' = 'ms',
  'Malayalam' = 'ml',
  'Maltese' = 'mt',
  'Marathi' = 'mr',
  'Marshallese' = 'mh',
  'Mongolian' = 'mn',
  'Māori' = 'mi',
  'Navajo' = 'nv',
  'Ndonga' = 'ng',
  'Nepali' = 'ne',
  'Northern Ndebele' = 'nd',
  'Northern Sami' = 'se',
  'Norwegian' = 'no',
  'Norwegian Bokmål' = 'nb',
  'Norwegian Nynorsk' = 'nn',
  'Nuosu' = 'ii',
  'Ojibwe' = 'oj',
  'Old Church Slavonic' = 'cu',
  'Oriya' = 'or',
  'Panjabi' = 'pa',
  'Pashto' = 'ps',
  'Persian' = 'fa',
  'Polish' = 'pl',
  'Portuguese' = 'pt',
  'Pāli' = 'pi',
  'Romanian' = 'ro',
  'Russian' = 'ru',
  'Samoan' = 'sm',
  'Sardinian' = 'sc',
  'Scottish Gaelic' = 'gd',
  'Serbian' = 'sr',
  'Shona' = 'sn',
  'Sindhi' = 'sd',
  'Sinhala' = 'si',
  'Slovak' = 'sk',
  'Slovene' = 'sl',
  'Somali' = 'so',
  'Southern Ndebele' = 'nr',
  'Southern Sotho' = 'st',
  'Spanish' = 'es',
  'Sundanese' = 'su',
  'Swahili' = 'sw',
  'Swedish' = 'sv',
  'Tagalog' = 'tl',
  'Tahitian' = 'ty',
  'Tajik' = 'tg',
  'Tamil' = 'ta',
  'Tatar' = 'tt',
  'Telugu' = 'te',
  'Thai' = 'th',
  'Turkish' = 'tr',
  'Turkmen' = 'tk',
  'Ukrainian' = 'uk',
  'Urdu' = 'ur',
  'Uyghur' = 'ug',
  'Uzbek' = 'uz',
  'Vietnamese' = 'vi',
  'Walloon' = 'wa',
  'Welsh' = 'cy',
  'Western Frisian' = 'fy',
  'Xhosa' = 'xh',
  'Yiddish' = 'yi',
  'Yoruba' = 'yo',
}

// needed in the renderer process.
const languages = Object.entries(Language);

const selector: any[] = [];
languages.forEach(([key, value]) => {
  selector.push({
    text: key,
    value,
    ...(value === 'en' ? { selected: true } : undefined),
  });
});

const selectorBox = document.getElementById('translate-to');

for (const o of selector) {
  const { text, value, selected } = o;

  const option = document.createElement('option');
  option.innerText = text;
  option.value = value;
  option.selected = selected ?? false;

  selectorBox.append(option);
}

// @ts-ignore
document.getElementById('shortcut-translate').value =
  settings.shortcuts.translate.join('+');
// @ts-ignore
document.getElementById('shortcut-convert-currency').value =
  settings.shortcuts.convertCurrency.join('+');
// @ts-ignore
document.getElementById('shortcut-transliterate').value =
  settings.shortcuts.transliterate.join('+');
// @ts-ignore
document.getElementById('shortcut-humanize').value =
  settings.shortcuts.humanizeText.join('+');

// @ts-ignore
document.getElementById('shortcut-spell-check').value = 
    settings.shortcuts.spellCheck.join('+');
