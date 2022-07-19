import { exec } from 'child_process'

export const openWebURL = (url: string) => {
	const start =
		process.platform == 'darwin'
			? 'open'
			: process.platform == 'win32'
			? 'start'
			: 'xdg-open';

	exec(start + ' ' + url);
};
