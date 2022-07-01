import axios from 'axios';
import { URLSearchParams } from 'url';
import * as types from './translator.types';
import ErrorsHandler from '../../errors/errors.module';

export class TranslatorService {
  protected errorsHandler = new ErrorsHandler();

  protected axiosInstance = axios.create({
    baseURL: 'https://translo.p.rapidapi.com/api/v3/',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      // ! TODO: CHANGE CREDENTIALS STORING IN ENVIRONMENT VARIABLES
      'X-RapidAPI-Key': 'bf894bec23msha5bef7181df062ap11d0c3jsncec1e59dab77',
      'X-RapidAPI-Host': 'translo.p.rapidapi.com',
    },
  });

  async translate(options: types.TranslateOptions): Promise<string> {
    try {
      const data = new URLSearchParams();
      data.append('to', options.to);
      data.append('text', options.text);

      const { data: response } = await this.axiosInstance.request<
        any,
        { data: types.TranslateResponse }
      >({
        method: 'POST',
        url: '/translate',
        data,
      });

      return response.translated_text;
    } catch (e) {
      this.errorsHandler.handleError({
        environment: 'Translator',
        message: `An error occurred while translating the text. Please check that provided text is valid, got ${options.text}`,
        trace: e,
      });

      return undefined;
    }
  }
}
