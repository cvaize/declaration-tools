import { get, set, intersection, concat, difference, uniq } from 'lodash';

// Строковое представление типов данных. Не поддерживается bigint, date, symbol, function и другие специальные объекты
export enum IdType {
	number = 'number',
	string = 'string',
	boolean = 'boolean',
	null = 'null',
	undefined = 'undefined',
	object = 'object',
	array = 'array',
	any = 'any',
}

// Определить тип данных, который передан параметром
export const identifyType = (data: any): IdType => {
	let result = IdType.any;
	const type = typeof data;

	if (type === 'number') {
		result = IdType.number;
	} else if (type === 'string') {
		result = IdType.string;
	} else if (type === 'boolean') {
		result = IdType.boolean;
	} else if (type === 'undefined') {
		result = IdType.undefined;
	} else if (type === 'object') {
		if (data === null) {
			result = IdType.null;
		} else if (Array.isArray(data)) {
			result = IdType.array;
		} else {
			result = IdType.object;
		}
	}

	return result;
};

type Schema = {
	[key: string]: Schema;
};

type SchemaResponse = {
	schema: Schema;
};

const processingSchema = (data: any, schemaResponse: SchemaResponse, key: string): SchemaResponse => {
	const type = identifyType(data);
	const typeKey = `${key}.${type}`;

	if (!get(schemaResponse, key)) {
		set(schemaResponse, key, {});
	}

	if (!get(schemaResponse, typeKey)) {
		set(schemaResponse, typeKey, {});
	}

	if (type === IdType.array) {
		let maximumKeys: string[] = [];
		let minimumKeys: string[] = [];
		let keysMounted = false;
		for (let i = 0; i < data.length; i += 1) {
			processingSchema(data[i], schemaResponse, typeKey);

			// Обработка undefined ключей в объектах
			if (identifyType(data[i]) === IdType.object) {
				if (keysMounted) {
					const objectKeys = Object.keys(data[i]);
					minimumKeys = intersection(minimumKeys, objectKeys);
					maximumKeys = concat(maximumKeys, difference(maximumKeys, objectKeys));
				} else {
					minimumKeys = Object.keys(data[i]);
					maximumKeys = minimumKeys;
					keysMounted = true;
				}
			}
		}

		const undefinedKeys = uniq(difference(maximumKeys, minimumKeys));

		for (let i = 0; i < undefinedKeys.length; i += 1) {
			set(schemaResponse, `${typeKey}.${IdType.object}.${undefinedKeys[i]}.${IdType.undefined}`, {});
		}
	} else if (type === IdType.object) {
		const objectKeys = Object.keys(data);

		for (let i = 0; i < objectKeys.length; i += 1) {
			processingSchema(data[objectKeys[i]], schemaResponse, `${typeKey}.${objectKeys[i]}`);
		}
	}

	return schemaResponse;
};

export const makeSchema = (data: any) => processingSchema(data, { schema: {} }, 'schema');

export default {
	identifyType,
};
