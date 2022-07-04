import axios from "axios";
import ErrorsHandler from "../../errors/errors.module";
import { axiosInstance } from "../../shared/axios";
import * as spellCheckerTypes from "./spell-checker.types";

export class SpellCheckerService {
  protected errorHandler = new ErrorsHandler();

  async check(text: string): Promise<string> {
    try {
      const { data: response } = await axiosInstance.request<
        unknown,
        { data: spellCheckerTypes.SpellCheckerResponse }
      >({
        method: "GET",
        url: "/spell-check",
        params: {
          text,
        },
      });

      if (!response.elements) {
        const errorResponse =
          response as unknown as spellCheckerTypes.SpellCheckerErrorResponse;

        if (errorResponse.errorMessage) {
          return this.handleError(response);
        }
      }

      const typeErrors = response.elements[0].errors;

      typeErrors.forEach((el) => {
        text = text.replace(el.word, el.suggestions[0]);
      });

      if (!text || text == "undefined") {
        return this.handleError(new Error("No text was returned"));
      }

      return text;
    } catch (e) {
      return this.handleError(e);
    }
  }

  private handleError(e: any): undefined {
    this.errorHandler.handleError({
      environment: "Spell checker",
      date: new Date(),
      message:
        "An error occurred while checking the spelling of the text. Note that this feature only works with English.",
      trace: e,
    });

    return undefined;
  }
}
