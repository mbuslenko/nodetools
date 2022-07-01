import { clipboard } from 'electron';
import { keyTap } from 'robotjs';
import {
  translator,
  trasnliterator,
  currencyConvertor,
  spellChecker,
  urlShortener,
} from '../../services';
import { ConvertOptions } from '../../services/currencies-convertor/currencies-convertor.types';
import { utils } from '../../shared';
import * as types from './inline.types';
import settings from '../../settings';
import { UrlShortenerService } from '../../services/url-shortener/url-shortener.service';

export class InlineDomain {
  private readonly translatorService: translator.TranslatorService;
  private readonly transliteratorService: trasnliterator.TransliterationService;
  private readonly currencyConvertorService: currencyConvertor.CurrencyConvertorService;
  private readonly spellCheckerService: spellChecker.SpellCheckerService;
  private readonly urlShortenerService: UrlShortenerService;

  constructor() {
    this.translatorService = new translator.TranslatorService();
    this.transliteratorService = new trasnliterator.TransliterationService();
    this.currencyConvertorService =
      new currencyConvertor.CurrencyConvertorService();
    this.spellCheckerService = new spellChecker.SpellCheckerService();
    this.urlShortenerService = new UrlShortenerService();
  }

  /**
   * It CLEARS THE CLIPBOARD, presses the ctrl+c keys, waits 200ms, and then returns the clipboard
   * contents
   * @returns The selected text from the clipboard.
   */
  private async getSelectedText(): Promise<string> {
    clipboard.clear();

    keyTap('c', process.platform === 'darwin' ? 'command' : 'control');
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
      'translate'
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
      keyTap('v', process.platform === 'darwin' ? 'command' : 'control');

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
      keyTap('v', process.platform === 'darwin' ? 'command' : 'control');

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
    const options: Omit<ConvertOptions, 'amount'> = settings.get(
      'convertCurrencies'
    ) as Omit<ConvertOptions, 'amount'>;

    // save current clipboard contents
    const previousClipboardText = clipboard.readText();

    const selectedText = await this.getSelectedText();

    if (!isNaN(+selectedText)) {
      const convertedText = await this.currencyConvertorService.convert({
        ...options,
        amount: +selectedText,
      });

      if (convertedText) {
        clipboard.writeText(convertedText.toString());

        // paste converted text
        keyTap('v', process.platform === 'darwin' ? 'command' : 'control');

        // wait for the clipboard to be updated
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
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
    keyTap('v', process.platform === 'darwin' ? 'command' : 'control');

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
    keyTap('v', process.platform === 'darwin' ? 'command' : 'control');

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
    keyTap('v', process.platform === 'darwin' ? 'command' : 'control');

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
    const cleanedText = selectedText.replace(/[^-()\d/*+.]/g, '');
    let result: number;

    try {
      result = eval(cleanedText);
    } catch (e) {
      return clipboard.writeText(previousClipboardText);
    }

    if (!isNaN(result)) {
      clipboard.writeText(result.toString());

      // paste converted text
      keyTap('v', process.platform === 'darwin' ? 'command' : 'control');

      // wait for the clipboard to be updated
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    clipboard.writeText(previousClipboardText);
  }
}
