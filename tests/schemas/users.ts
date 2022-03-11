import { SchemaResponse } from '../../src';

export const usersSchemaResponse: SchemaResponse = {
	schema: {
		array: {
			object: {
				id: {
					number: {},
				},
				group_id: {
					number: {},
				},
				created_at: {
					string: {},
				},
				updated_at: {
					string: {},
					undefined: {},
				},
				addresses: {
					array: {
						object: {
							home: {
								string: {},
							},
							street: {
								string: {},
							},
						},
					},
				},
				full_addresses: {
					array: {
						string: {},
					},
				},
				categories: {
					array: {
						number: {},
					},
					number: {},
				},
				dynamic: {
					array: {
						object: {
							home: {
								string: {},
							},
							street: {
								string: {},
							},
						},
						number: {},
						string: {},
					},
					string: {},
				},
				extension_attributes: {
					object: {
						is_subscribed: {
							boolean: {},
						},
					},
				},
			},
			number: {},
			string: {},
		},
	},
};

export default usersSchemaResponse;
