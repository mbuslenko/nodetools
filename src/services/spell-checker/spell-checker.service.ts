import axios from 'axios';

export class SpellCheckerService {
  private axiosInstace = axios.create({
    url: 'https://jspell-checker.p.rapidapi.com',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'bf894bec23msha5bef7181df062ap11d0c3jsncec1e59dab77',
      'X-RapidAPI-Host': 'jspell-checker.p.rapidapi.com',
    },
  });

  //@ts-ignore
  async check(text: string): Promise<string | undefined> {
    const data = {
      language: 'enUs',
      fieldvalues: text,
      config: {
        forceUpperCase: false,
        ignoreIrregularCaps: false,
        ignoreFirstCaps: false,
        ignoreNumbers: true,
        ignoreUpper: false,
        ignoreDouble: false,
        ignoreWordsWithNumbers: true,
      },
    };

    const { data: response } = await this.axiosInstace.request({
        method: 'POST',
        url: '/spellcheck',
    })
  }
}
