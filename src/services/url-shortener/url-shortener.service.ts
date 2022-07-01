import axios from 'axios';
import { utils } from '../../shared';

export class UrlShortenerService {
  private axiosInstance = axios.create({
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
      utils.handleError(e, 'api:url-shortener');

      return undefined;
    }
  }
}
