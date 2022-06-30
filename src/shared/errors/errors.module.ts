import { ipcRenderer } from 'electron';
import * as errorTypes from './errors.types';

export default class ErrorsHandler {
  handleError(error: Partial<errorTypes.ErrorStructure>) {
    const errorStructure = {
      date: error.date ?? new Date(),
      environment: error.environment ?? 'nodetools',
      message: error.message,
      trace: error.trace ?? null,
    };

    this.sendErrorToLocalStorage(errorStructure);
  }

  protected sendErrorToLocalStorage(error: errorTypes.ErrorStructure) {
    ipcRenderer.send('handle-error', error);
  }
}
