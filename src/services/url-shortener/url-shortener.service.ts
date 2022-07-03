import ErrorsHandler from '../../errors/errors.module';
import { axiosInstance } from '../../shared/axios';

export class UrlShortenerService {
  protected errorsHandler = new ErrorsHandler();

  async shortenUrl(url: string): Promise<string> {
    try {
      const { data: response } = await axiosInstance.request({
        method: 'POST',
        url: '/shorten-url',
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
