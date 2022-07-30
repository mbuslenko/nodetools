import * as path from 'path';
import * as fs from 'fs';
import { FileType, ImagesExtensions } from './files.types';
//@ts-ignore
import * as encrypt from 'node-file-encrypt';
import Jimp = require('jimp');
import ErrorsHandler from '../../errors/errors.module';

export class FilesDomain {
	protected errorsHandler = new ErrorsHandler();

	getFileType(extension: string): FileType {
		if (
			Object.values(ImagesExtensions).includes(extension as ImagesExtensions)
		) {
			return 'image';
		}
	}

	/**
	 * It reads an image from a file path, converts it to the desired extension and saves it to the same
	 * file path
	 * @param {string} filePath - The path to the file you want to convert.
	 * @param {ImagesExtensions} to - ImagesExtensions - the extension to which the image will be
	 * converted
	 */
	async convertImage(filePath: string, to: ImagesExtensions): Promise<void> {
		Jimp.read(filePath)
			.then((image) => {
				return image.write(`${filePath.split('.')[0]}.${to}`);
			})
			.catch((e) => {
				this.errorsHandler.handleError({
					message: 'Unexpected error during the image conversion',
					trace: e,
					environment: 'File converter',
				});
			});
	}

	/**
	 * "Encrypt a file using a password."
	 * 
	 * The first line of the function is a comment. It's a good idea to add comments to your code.
	 * Comments are ignored by the compiler
	 * @param {string} filePath - The path to the file you want to encrypt.
	 * @param {string} password - The password to use for encryption.
	 */
	async encryptFile(filePath: string, password: string): Promise<void> {
		const file = new encrypt.FileEncrypt(filePath, undefined, undefined, false);

		file.openSourceFile();
		file.encrypt(password);

		// remove unencrypted file
		fs.unlink(filePath, () => {});
	}

/**
 * It decrypts a file
 * @param {string} filePath - The path to the file you want to encrypt.
 * @param {string} password - The password used to encrypt the file
 */
	async decryptFile(filePath: string, password: string): Promise<void> {
		try {
			const file = new encrypt.FileEncrypt(
				filePath,
				undefined,
				undefined,
				false,
			);

			file.openSourceFile();
			file.decrypt(password);

			// remove encrypted file
			fs.unlink(filePath, () => {});
		} catch {
			throw new Error('Password is incorrect');
		}
	}
}
