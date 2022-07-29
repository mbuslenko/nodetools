import { execa } from 'execa';
import * as path from 'path';
import * as fs from 'fs';
import * as tmp from 'tmp';
import { FileType, ImagesExtensions } from './files.types';
//@ts-ignore
import * as encrypt from 'node-file-encrypt';

export class FilesDomain {
	getFileType(extension: string): FileType {
		if (
			Object.values(ImagesExtensions).includes(extension as ImagesExtensions)
		) {
			return 'image';
		}
	}

	private duplicateFile(dir: string, filePath: string) {
		const { base } = path.parse(filePath);
		const newFilePath = path.join(dir, base.replace(/\s+/g, ''));

		fs.cpSync(filePath, newFilePath);

		return newFilePath;
	}

	async convertImage(filePath: string, to: ImagesExtensions): Promise<void> {
		const tmpDir = tmp.dirSync().name;
		const tmpFile = this.duplicateFile(tmpDir, filePath);

		const args = ['convert', '-type', to, '-out', filePath, tmpFile];

		try {
			// TODO: fix require() of ESM module
			//await execa(filePath, args)
		} finally {
			fs.unlinkSync(tmpDir);
		}
	}

	async encryptFile(filePath: string, password: string): Promise<void> {
		const file = new encrypt.FileEncrypt(filePath, undefined, undefined, false);

		file.openSourceFile();
		file.encrypt(password);

		// remove unencrypted file
		fs.unlink(filePath, () => {});
	}

	async decryptFile(filePath: string, password: string): Promise<void> {
        const file = new encrypt.FileEncrypt(filePath, undefined, undefined, false);
        
        file.openSourceFile();
        file.decrypt(password);

        // remove encrypted file
        fs.unlink(filePath, () => {});
    }
}
