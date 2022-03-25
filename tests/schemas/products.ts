import DeclarationTools from '../../src';
import Schema = DeclarationTools.Schema;

export const productsSchema: Schema = {
	schema: {
		object: {
			items: {
				array: {
					object: {
						id: { number: {} },
						sku: { string: {} },
						name: { string: {} },
						attribute_set_id: { number: {} },
						price: { number: {} },
						status: { number: {} },
						visibility: { number: {} },
						type_id: { string: {} },
						created_at: { string: {} },
						updated_at: { string: {} },
						extension_attributes: {
							object: {
								website_ids: { array: { number: {} } },
								category_links: {
									array: { object: { position: { number: {} }, category_id: { string: {} } } },
								},
								qty: { string: {} },
								rating: { string: {} },
								category_for_search: { array: { string: {} } },
								feedbacks: { string: {} },
							},
						},
						product_links: { array: {} },
						options: { array: {} },
						media_gallery_entries: {
							array: {
								object: {
									id: { number: {} },
									media_type: { string: {} },
									label: { string: {}, null: {} },
									position: { number: {} },
									disabled: { boolean: {} },
									types: { array: { string: {} } },
									file: { string: {} },
								},
							},
						},
						tier_prices: { array: {} },
						custom_attributes: {
							array: {
								object: {
									attribute_code: { string: {} },
									value: { string: {}, array: { string: {} } },
								},
							},
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
					sort_orders: { array: { object: { field: { string: {} }, direction: { string: {} } } } },
					page_size: { number: {} },
					current_page: { number: {} },
				},
			},
			total_count: { number: {} },
		},
	},
};

export default productsSchema;
