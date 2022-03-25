import DeclarationTools from '../../src';
import Schema = DeclarationTools.Schema;

export const bannerSchema: Schema = {
	schema: {
		array: {
			object: { href: { string: {} }, title: { string: {} }, src: { string: {} }, 'src-mobile': { string: {} } },
		},
	},
};

export default bannerSchema;
