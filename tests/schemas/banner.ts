import { SchemaResponse } from '../../src';

export const bannerSchemaResponse: SchemaResponse = {
	schema: {
		array: {
			object: { href: { string: {} }, title: { string: {} }, src: { string: {} }, 'src-mobile': { string: {} } },
		},
	},
};

export default bannerSchemaResponse;
