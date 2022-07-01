import axios from 'axios';
import ErrorsHandler from '../../errors/errors.module';
import * as spellCheckerTypes from './spell-checker.types';

export class SpellCheckerService {
  protected errorHandler = new ErrorsHandler();

  protected axiosInstace = axios.create({
    baseURL: 'https://jspell-checker.p.rapidapi.com',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'bf894bec23msha5bef7181df062ap11d0c3jsncec1e59dab77',
      'X-RapidAPI-Host': 'jspell-checker.p.rapidapi.com',
    },
  });

  async check(text: string): Promise<string> {
    const data = {
      language: 'enUS',
      fieldvalues: text,
      config: {
        forceUpperCase: false,
        ignoreIrregularCaps: false,
        ignoreFirstCaps: false,
        ignoreNumbers: true,
        ignoreUpper: false,
        ignoreDouble: false,
        ignoreWordsWithNumbers: true,
      },
    };

    const { data: response } = await this.axiosInstace.request<
      unknown,
      { data: spellCheckerTypes.SpellCheckerResponse }
    >({
      method: 'POST',
      url: '/check',
      data,
    });

    if (!response.elements) {
      const errorResponse =
        response as unknown as spellCheckerTypes.SpellCheckerErrorResponse;

      if (errorResponse.errorMessage) {
        this.errorHandler.handleError({
          environment: 'Spell checker',
          date: new Date(),
          message:
            'An error occurred while checking the spelling of the text. Please note that this feature only works with English.',
          trace: response,
        });

        return undefined;
      }
    }

    const typeErrors = response.elements[0].errors;

    // TODO: Refactor to change only one word instead of all similar
    typeErrors.forEach((el) => {
      text = text.replace(el.word, el.suggestions[0]);
    });

    return text;
  }
}
