import { ipcRenderer } from 'electron';
import { addErrorToStorage } from '../settings';
import * as errorTypes from './errors.types';
import * as crypto from 'crypto';

export default class ErrorsHandler {
  handleError(error: Partial<errorTypes.ErrorStructure>) {
    const errorStructure = {
      id: crypto.randomUUID(),
      date: error.date ?? new Date(),
      environment: error.environment ?? 'nodetools',
      message: error.message,
      trace: error.trace ?? null,
    };

    this.sendErrorToStorage(errorStructure);
  }

  protected sendErrorToStorage(error: errorTypes.ErrorStructure) {
    addErrorToStorage(error);
  }
}
