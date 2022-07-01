import axios from 'axios';
import ErrorsHandler from '../../errors/errors.module';
import { utils } from '../../shared';
import * as types from './currencies-convertor.types';

export class CurrencyConvertorService {
  protected errorsHandler = new ErrorsHandler();

  protected axiosInstance = axios.create({
    baseURL: 'https://global-currency.p.rapidapi.com',
    headers: {
      // ! TODO: CHANGE CREDENTIALS STORING IN ENVIRONMENT VARIABLES
      'X-RapidAPI-Key': 'bf894bec23msha5bef7181df062ap11d0c3jsncec1e59dab77',
      'X-RapidAPI-Host': 'global-currency.p.rapidapi.com',
    },
  });

  // TODO: Add validation to options enum
  async convert(options: types.ConvertOptions) {
    try {
      const { data: response } = await this.axiosInstance.request<
        any,
        { data: types.ConvertResponse }
      >({
        method: 'GET',
        url: `/currency/${options.from}/${options.to}/${options.amount}`,
      });

      return +response.rateCurrency.amount;
    } catch (e) {
      this.errorsHandler.handleError({
        environment: 'Currency converter',
        message: `An error occured while converting ${options.amount} ${options.from} to ${options.to}`,
        trace: e,
      });

      return undefined;
    }
  }
}
