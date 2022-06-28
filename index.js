import * as ex from 'execa';

const env = {
	LC_CTYPE: 'UTF-8',
};

const clipboard = {
	copy: async options => ex.execa('pbcopy', {...options, env}),
	paste: async options => {
		const {stdout} = await ex.execa('pbpaste', {...options, env});
		return stdout;
	},
	copySync: options => ex.execaSync('pbcopy', {...options, env}),
	pasteSync: options => ex.execaSync('pbpaste', {...options, env}).stdout,
};
const res = {}
res.read = async () => clipboard.paste({stripFinalNewline: false});

(async function read() {
  const result = await res.read()

  console.log(typeof(result))
})()
