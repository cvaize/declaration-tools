import { Schema } from '../../src';

export const categoriesSchema: Schema = {
	schema: {
		object: {
			items: {
				array: {
					object: {
						id: { number: {} },
						parent_id: { number: {} },
						name: { string: {} },
						is_active: { boolean: {} },
						position: { number: {} },
						level: { number: {} },
						children: { string: {} },
						created_at: { string: {} },
						updated_at: { string: {} },
						path: { string: {} },
						available_sort_by: { array: {} },
						include_in_menu: { boolean: {} },
						custom_attributes: {
							array: { object: { attribute_code: { string: {} }, value: { string: {} } } },
						},
					},
				},
			},
			search_criteria: {
				object: {
					filter_groups: {
						array: {
							object: {
								filters: {
									array: {
										object: {
											field: { string: {} },
											value: { string: {} },
											condition_type: { string: {} },
										},
									},
								},
							},
						},
					},
					page_size: { number: {} },
					current_page: { number: {} },
				},
			},
			total_count: { number: {} },
		},
	},
};

export default categoriesSchema;
