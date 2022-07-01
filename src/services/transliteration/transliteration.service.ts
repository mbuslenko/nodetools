import ErrorsHandler from '../../errors/errors.module';
import { config } from './config';

export class TransliterationService {
  protected errorsHandler = new ErrorsHandler();

  protected normalize(str: string) {
    str = str
      .replace(/(Ю\s|Б\s|Ь\s)/g, (s) => {
        // TODO: refactor to avoid ts-ignore
        //@ts-ignore
        return config.words[s];
      })
      .replace(/\s{2,}/g, ' ')
      .trim();

    return str;
  }

  protected flip(trans: object) {
    let key,
      tmp = {};
    for (key in trans) {
      // TODO: refactor to avoid ts-ignore
      //@ts-ignore
      tmp[trans[key]] = key;
    }

    return tmp;
  }

  transliterate(text: string, normalize?: boolean): string {
    try {
      const cyrillicPattern = /^\p{Script=Cyrillic}+$/u;

      let type: string;
      if (cyrillicPattern.test(text)) {
        type = 'rueng';
      } else {
        type = 'engru';
      }

      // TODO: refactor to not change config.default
      switch (type) {
        case 'rueng': {
          if (process.platform == 'darwin') {
            config.default = config.dictionary.macRuEng;
          } else {
            config.default = config.dictionary.winRuEn;
          }

          break;
        }
        case 'engru': {
          if (process.platform == 'darwin') {
            config.default = this.flip(config.dictionary.macRuEng);
          } else {
            config.default = this.flip(config.dictionary.winRuEn);
          }

          break;
        }
        default: {
          config.default = this.flip(config.dictionary.winRuEn);
          break;
        }
      }

      let textToArray = text.split('');
      const result: any[] = [];
      let obj = config.default;

      textToArray.forEach(function (sym, i) {
        if (obj.hasOwnProperty(textToArray[i])) {
          // TODO: refactor to avoid ts-ignore
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
