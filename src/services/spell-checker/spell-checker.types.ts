export type SpellCheckerResponse = {
  elements: {
    id: number;
    errors: {
      word: string;
      position: number;
      suggestions: string[];
    }[];
  }[];
};

export type SpellCheckerErrorResponse = {
  errorMessage: string;
  errorType: string;
  stackTrace: string[];
};
