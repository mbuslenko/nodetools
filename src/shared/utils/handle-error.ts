import createDebug from 'debug';

export const handleError = (e: any, environment?: string) => {
  const debug = createDebug(environment ?? 'nodetools');
  debug({ e });
};
