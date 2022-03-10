import { set, has, intersection, concat, difference, uniq } from 'lodash';

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

enum SchemaErrorType {
	// Новый ключ. По определенному пути найден ключ объекта, которого нет в схеме
	key = 'key',
	// Не совпал тип. По определенному пути найдены данные с новым типом
	type = 'type',
	// Нет ключа. По определенному пути должен быть ключ с данными, но его нет
	undefined = 'undefined',
}

type SchemaError = {
	key: string;
	type: SchemaErrorType;
};

const schemaIterator = (
	data: any,
	schemaResponse: SchemaResponse,
	key: string,
	handle: (schemaResponse: SchemaResponse, key: string, place: number) => void
): SchemaResponse => {
	const type = identifyType(data);
	const typeKey = `${key}.${type}`;

	if (!has(schemaResponse, key)) {
		handle(schemaResponse, key, 1);
	}

	if (!has(schemaResponse, typeKey)) {
		handle(schemaResponse, typeKey, 2);
	}

	if (type === IdType.array) {
		let maximumKeys: string[] = [];
		let minimumKeys: string[] = [];
		let keysMounted = false;
		for (let i = 0; i < data.length; i += 1) {
			schemaIterator(data[i], schemaResponse, typeKey, handle);

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
			handle(schemaResponse, `${typeKey}.${IdType.object}.${undefinedKeys[i]}.${IdType.undefined}`, 3);
		}
	} else if (type === IdType.object) {
		const objectKeys = Object.keys(data);

		for (let i = 0; i < objectKeys.length; i += 1) {
			schemaIterator(data[objectKeys[i]], schemaResponse, `${typeKey}.${objectKeys[i]}`, handle);
		}
	}

	return schemaResponse;
};

export const makeSchema = (data: any) => {
	const schemaResponse: SchemaResponse = { schema: {} };

	schemaIterator(data, schemaResponse, 'schema', (schemaResponse, key) => {
		set(schemaResponse, key, {});
	});

	return schemaResponse;
};

export const checkSchema = (schema: Schema, data: any): SchemaError[] => {
	const errors: SchemaError[] = [];
	const schemaResponse: SchemaResponse = { schema };

	schemaIterator(data, schemaResponse, 'schema', (schemaResponse, key, place) => {
		if (place === 1) {
			errors.push({
				key,
				type: SchemaErrorType.key,
			});
		} else if (place === 2) {
			errors.push({
				key,
				type: SchemaErrorType.type,
			});
		} else if (place === 3) {
			if (!has(schemaResponse, key)) {
				errors.push({
					key,
					type: SchemaErrorType.type,
				});
			}
		}
	});

	return errors;
};

export default {
	identifyType,
	makeSchema,
};
