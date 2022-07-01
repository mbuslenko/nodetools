import axios from 'axios';
import ErrorsHandler from '../../errors/errors.module';
import { utils } from '../../shared';

export class UrlShortenerService {
  protected errorsHandler = new ErrorsHandler();
  
  protected axiosInstance = axios.create({
    baseURL: 'https://url-shortener20.p.rapidapi.com',
    headers: {
      'content-type': 'application/json',
      // ! TODO: CHANGE CREDENTIALS STORING IN ENVIRONMENT VARIABLES
      'X-RapidAPI-Key': 'bf894bec23msha5bef7181df062ap11d0c3jsncec1e59dab77',
      'X-RapidAPI-Host': 'url-shortener20.p.rapidapi.com',
    },
  });

  async shortenUrl(url: string): Promise<string> {
    try {
      const { data: response } = await this.axiosInstance.request({
        method: 'POST',
        url: '/shorten',
        params: {
          url,
        },
        data: {
          url,
        },
      });

      return response.short_link;
    } catch (e) {
      this.errorsHandler.handleError({
        environment: 'Url shortener',
        message: `An error occurred while shortening the url. Please check that provided URL is valid, got ${url}`,
        trace: e,
      });

      return undefined;
    }
  }
}
