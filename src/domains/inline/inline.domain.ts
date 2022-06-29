import { clipboard } from 'electron';
import { keyTap } from 'robotjs';
import { translator, trasnliterator } from '../../services';
import * as types from './inline.types';

export class InlineDomain {
  private readonly translatorService: translator.TranslatorService;
  private readonly transliteratorService: trasnliterator.TransliterationService;

  constructor() {
    this.translatorService = new translator.TranslatorService();
    this.transliteratorService = new trasnliterator.TransliterationService();
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
   * @param options - types.TranslateOptions
   */
  async translateText(options: types.TranslateOptions): Promise<void> {
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
    const transliteratedText = this.transliteratorService.transliterate(selectedText);

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
}
