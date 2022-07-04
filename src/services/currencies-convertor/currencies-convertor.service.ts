import ErrorsHandler from "../../errors/errors.module";
import { utils } from "../../shared";
import { axiosInstance } from "../../shared/axios";
import * as types from "./currencies-convertor.types";

export class CurrencyConvertorService {
  protected errorsHandler = new ErrorsHandler();

  async convert(options: types.ConvertOptions) {
    try {
      const { data: response } = await axiosInstance.request<
        any,
        { data: types.ConvertResponse }
      >({
        method: "GET",
        url: `/convert-currency`,
        params: {
          from: options.from,
          to: options.to,
          amount: options.amount,
        },
      });

      return response.rateCurrency.amount;
    } catch (e) {
      this.errorsHandler.handleError({
        environment: "Currency converter",
        message: `An error occured while converting ${options.amount} ${options.from} to ${options.to}`,
        trace: e,
      });

      return undefined;
    }
  }
}
