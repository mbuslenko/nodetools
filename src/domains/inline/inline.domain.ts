import { clipboard } from "electron";
import {
  translator,
  trasnliterator,
  currencyConvertor,
  spellChecker,
  urlShortener,
} from "../../services";
import { ConvertOptions } from "../../services/currencies-convertor/currencies-convertor.types";
import { utils } from "../../shared";
import * as types from "./inline.types";
import settings from "../../settings";
import ErrorsHandler from "../../errors/errors.module";
import { Key, keyboard } from "@nut-tree/nut-js";

export class InlineDomain {
  protected readonly translatorService: translator.TranslatorService;
  protected readonly transliteratorService: trasnliterator.TransliterationService;
  protected readonly currencyConvertorService: currencyConvertor.CurrencyConvertorService;
  protected readonly spellCheckerService: spellChecker.SpellCheckerService;
  protected readonly urlShortenerService: urlShortener.UrlShortenerService;

  protected errorsHandler = new ErrorsHandler();

  constructor() {
    this.translatorService = new translator.TranslatorService();
    this.transliteratorService = new trasnliterator.TransliterationService();
    this.currencyConvertorService =
      new currencyConvertor.CurrencyConvertorService();
    this.spellCheckerService = new spellChecker.SpellCheckerService();
    this.urlShortenerService = new urlShortener.UrlShortenerService();
  }

  /**
   * It CLEARS THE CLIPBOARD, presses the ctrl+c keys, waits 200ms, and then returns the clipboard
   * contents
   * @returns The selected text from the clipboard.
   */
  private async getSelectedText(): Promise<string> {
    clipboard.clear();

    await keyboard.pressKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.C)
    await keyboard.releaseKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.C)
    
    await new Promise((resolve) => setTimeout(resolve, 200)); // add a delay before checking clipboard
    const selectedText = clipboard.readText();

    return selectedText;
  }

  /**
   * It saves the current clipboard contents, translates the selected text, pastes the translated text,
   * waits for the clipboard to be updated, and then restores the previous clipboard contents
   */
  async translateText(): Promise<void> {
    const options: types.TranslateOptions = settings.get(
      "translate"
    ) as types.TranslateOptions;

    // save current clipboard contents
    const previousClipboardText = clipboard.readText();

    const selectedText = await this.getSelectedText();
    const translatedText = await this.translatorService.translate({
      ...options,
      text: selectedText,
    });

    if (translatedText) {
      clipboard.writeText(translatedText);

      // paste translated text
      await keyboard.pressKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)
      await keyboard.releaseKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)

      // wait for the clipboard to be updated
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // restore previous clipboard contents
    clipboard.writeText(previousClipboardText);
  }

  /**
   * It saves the current clipboard contents, gets the selected text, transliterates it, pastes the
   * transliterated text, and then restores the previous clipboard contents
   */
  async transliterateText(): Promise<void> {
    // save current clipboard contents
    const previousClipboardText = clipboard.readText();

    const selectedText = await this.getSelectedText();
    const transliteratedText =
      this.transliteratorService.transliterate(selectedText);

    if (transliteratedText) {
      clipboard.writeText(transliteratedText);

      // paste translated text
      await keyboard.pressKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)
      await keyboard.releaseKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)
      
      // wait for the clipboard to be updated
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // restore previous clipboard contents
    clipboard.writeText(previousClipboardText);
  }

  /**
   * It gets the selected text, converts it to a number, converts it to the target currency, and pastes
   * the converted text
   */
  async convertCurrency(): Promise<void> {
    const options: Omit<ConvertOptions, "amount"> = settings.get(
      "convertCurrencies"
    ) as Omit<ConvertOptions, "amount">;

    // save current clipboard contents
    const previousClipboardText = clipboard.readText();

    const selectedText = await this.getSelectedText();

    if (isNaN(+selectedText)) {
      this.errorsHandler.handleError({
        message:
          'Please specify only numeric characters and ".", convertion was failed',
        environment: "Currencies convertor",
        trace: null,
        date: new Date(),
      });
    }

    const convertedText = await this.currencyConvertorService.convert({
      ...options,
      amount: +selectedText,
    });

    if (convertedText) {
      clipboard.writeText(convertedText);

      // paste converted text
      await keyboard.pressKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)
      await keyboard.releaseKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)

      // wait for the clipboard to be updated
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // restore previous clipboard contents
    clipboard.writeText(previousClipboardText);
  }

  /**
   * It gets the selected text, converts it to humanized text, pastes the converted text, and then
   * restores the previous clipboard contents
   */
  async humanizeText(): Promise<void> {
    // save current clipboard contents
    const previousClipboardText = clipboard.readText();

    const selectedText = await this.getSelectedText();
    const humanizedText = utils.humanizeString(selectedText);

    clipboard.writeText(humanizedText);

    // paste converted text
    await keyboard.pressKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)
    await keyboard.releaseKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)

    // wait for the clipboard to be updated
    await new Promise((resolve) => setTimeout(resolve, 200));

    // restore previous clipboard contents
    clipboard.writeText(previousClipboardText);
  }

  /**
   * It saves the current clipboard contents, gets the selected text, spell checks it, and then pastes
   * the fixed text
   */
  async spellCheck(): Promise<void> {
    // save current clipboard contents
    const previousClipboardText = clipboard.readText();

    const selectedText = await this.getSelectedText();
    const fixedText = await this.spellCheckerService.check(selectedText);

    if (!fixedText) {
      // restore previous clipboard contents
      return clipboard.writeText(previousClipboardText);
    }

    clipboard.writeText(fixedText);

    // paste converted text
    await keyboard.pressKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)
    await keyboard.releaseKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)

    // wait for the clipboard to be updated
    await new Promise((resolve) => setTimeout(resolve, 200));

    // restore previous clipboard contents
    clipboard.writeText(previousClipboardText);
  }

  /**
   * It saves the current clipboard contents, gets the selected text, shortens the URL, writes the
   * shortened URL to the clipboard, pastes the shortened URL, waits for the clipboard to be updated, and
   * then restores the previous clipboard contents
   */
  async shortenUrl(): Promise<void> {
    // save current clipboard contents
    const previousClipboardText = clipboard.readText();

    const selectedText = await this.getSelectedText();
    const shortenedUrl = await this.urlShortenerService.shortenUrl(
      selectedText
    );

    if (!shortenedUrl) {
      // restore previous clipboard contents
      return clipboard.writeText(previousClipboardText);
    }

    clipboard.writeText(shortenedUrl);

    // paste converted text
    await keyboard.pressKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)
    await keyboard.releaseKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)

    // wait for the clipboard to be updated
    await new Promise((resolve) => setTimeout(resolve, 200));

    // restore previous clipboard contents
    clipboard.writeText(previousClipboardText);
  }

  /**
   * It gets the selected text, removes all non-numeric characters except *,/,+,-,. and then evaluates
   * the result. If the result is a number, it replaces the clipboard contents with the result and then
   * pastes it
   */
  async calculate(): Promise<void> {
    // save current clipboard contents
    const previousClipboardText = clipboard.readText();

    const selectedText = await this.getSelectedText();

    // remove from text all non-numeric characters except *,/,+,-,.
    const cleanedText = selectedText.replace(/[^-()\d/*+.]/g, "");
    if (cleanedText.length === 0) {
      return this.errorsHandler.handleError({
        message: "No numeric characters found",
        environment: "Calculator",
        date: new Date(),
        trace: null,
      });
    }

    let result: number;

    try {
      result = eval(cleanedText);
    } catch (e) {
      return clipboard.writeText(previousClipboardText);
    }

    if (!isNaN(result)) {
      clipboard.writeText(result.toString());

      // paste converted text
      await keyboard.pressKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)
      await keyboard.releaseKey(process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl, Key.V)

      // wait for the clipboard to be updated
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    clipboard.writeText(previousClipboardText);
  }
}
