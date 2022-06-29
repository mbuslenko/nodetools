export type TranslateOptions = {
    to: string;
    text: string;
}

export type TranslateResponse = {
    translated_text: string;
    text_lang: string;
    ok: boolean;
}
