import ErrorsHandler from '../../errors/errors.module';
import { config } from './config';

export class TransliterationService {
	protected errorsHandler = new ErrorsHandler();

	protected normalize(str: string) {
		str = str
			.replace(/(Ю\s|Б\s|Ь\s)/g, (s) => {
				return config.words[s as keyof typeof config.words];
			})
			.replace(/\s{2,}/g, ' ')
			.trim();

		return str;
	}

	protected flip(trans: { [key: string]: any }) {
		let key;
		const tmp: { [key: string]: any } = {};

		for (key in trans) {
			tmp[trans[key]] = key;
		}

		return tmp;
	}

	transliterate(
		text: string,
		language?: 'ua' | 'ru',
		normalize?: boolean,
	): string {
		try {
			const cyrillicPattern = /^\p{Script=Cyrillic}+$/u;
			const ukrainianPattern = /[А-ЩЬЮЯҐЄІЇа-щьюяґєії]/gi;

			let type: string;
			if (language) {
				if (language === 'ua') {
					if (ukrainianPattern.test(text)) {
						type = 'uaeng';
					} else if (cyrillicPattern.test(text)) {
						type = 'uaeng';
					} else {
						type = 'engua';
					}
				} else if (language === 'ru') {
					if (cyrillicPattern.test(text)) {
						type = 'rueng';
					} else {
						type = 'engru';
					}
				}
			} else {
				if (cyrillicPattern.test(text)) {
					type = 'rueng';
				} else if (ukrainianPattern.test(text)) {
					console.log('+++++++');
					type = 'uaeng';
				} else {
					type = 'engru';
				}
			}

			let obj = {};
			switch (type) {
				case 'rueng': {
					if (process.platform == 'darwin') {
						obj = config.dictionary.macRuEng;
					} else {
						obj = config.dictionary.winRuEn;
					}

					break;
				}
				case 'engru': {
					if (process.platform == 'darwin') {
						obj = this.flip(config.dictionary.macRuEng);
					} else {
						obj = this.flip(config.dictionary.winRuEn);
					}

					break;
				}
				case 'uaeng':
					if (process.platform == 'darwin') {
						obj = config.dictionary.winUaEn;
					} else {
						obj = config.dictionary.winUaEn;
					}

					break;
				case 'engua':
					if (process.platform == 'darwin') {
						obj = this.flip(config.dictionary.macUaEn);
					} else {
						obj = this.flip(config.dictionary.winUaEn);
					}

					break;
				default: {
					config.default = this.flip(config.dictionary.winRuEn);
					break;
				}
			}
			const textToArray = text.split('');
			const result: any[] = [];

			textToArray.forEach(function (sym, i) {
				if (obj.hasOwnProperty(textToArray[i])) {
					//@ts-ignore
					result.push(obj[textToArray[i]]);
				} else {
					result.push(sym);
				}
			});

			if (normalize) {
				return this.normalize(result.join(''));
			} else {
				return result.join('');
			}
		} catch (e) {
			this.errorsHandler.handleError({
				environment: 'Transliteration',
				message: `An error occurred while transliterating the text, got ${text}`,
				trace: e,
			});
		}
	}
}
