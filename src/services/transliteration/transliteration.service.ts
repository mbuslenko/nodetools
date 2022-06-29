import { config } from './config';

export class TransliterationService {
  private normalize(str: string) {
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

  private fix(str: string) {
    let obj = config.dictionary.retranslit;
    Object.keys(obj).map(function (key, v) {
      let reg = new RegExp('(' + key + ')', 'g');
      str = str.replace(reg, (s) => {
        // TODO: refactor to avoid ts-ignore
        //@ts-ignore
        return obj[s];
      });
    });
    return str;
  }

  private flip(trans: object) {
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
    const cyrillicPattern = /^\p{Script=Cyrillic}+$/u;

    let type: string;
    if (cyrillicPattern.test(text)) {
      type = 'rueng';
    } else {
      type = 'engru';
    }

    switch (type) {
      case 'rueng': {
        config.default = config.dictionary.keys;
        break;
      }
      case 'engru': {
        config.default = this.flip(config.dictionary.keys);
        break;
      }
      case 'translit': {
        config.default = config.dictionary.translit;
        break;
      }
      case 'retranslit': {
        config.default = this.flip(config.dictionary.translit);
        text = this.fix(text);
        break;
      }
      default: {
        config.default = this.flip(config.dictionary.keys);
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
  }
}
