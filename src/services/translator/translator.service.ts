import axios from "axios";
import { URLSearchParams } from "url";
import * as types from "./translator.types";
import ErrorsHandler from "../../errors/errors.module";
import { axiosInstance } from "../../shared/axios";

export class TranslatorService {
  protected errorsHandler = new ErrorsHandler();

  async translate(options: types.TranslateOptions): Promise<string> {
    try {
      const { data: response } = await axiosInstance.request<
        any,
        { data: types.TranslateResponse }
      >({
        method: "GET",
        url: "/translate",
        params: {
          to: options.to,
          text: options.text,
        },
      });

      return response.translated_text;
    } catch (e) {
      this.errorsHandler.handleError({
        environment: "Translator",
        message: `An error occurred while translating the text. Please check that provided text is valid, got ${options.text}`,
        trace: e,
      });

      return undefined;
    }
  }
}
