import { get, set, has, intersection, concat, difference, uniq } from 'lodash';

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

enum Place {
	Id1,
	Id2,
	Id3,
	Id4,
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

export type Schema = {
	[key: string]: Schema;
};

const schemaKey = 'schema';
export type SchemaResponse = {
	schema: Schema;
};

export enum SchemaErrorType {
	// Новый ключ. По определенному пути найден ключ объекта, которого нет в схеме
	key = 'key',
	// Не совпал тип. Ключ со значением undefined, тоже сюда подходит По определенному пути найдены данные с новым типом
	type = 'type',
	// Нет ключа. По определенному пути должен быть ключ с данными, но его нет
	undefined = 'undefined',
}

export type SchemaError = {
	key: string;
	type: SchemaErrorType;
};

const dataIterator = (
	data: any,
	schemaResponse: SchemaResponse,
	key: string,
	handle: (schemaResponse: SchemaResponse, key: string, place: Place) => void
): SchemaResponse => {
	const type = identifyType(data);
	const typeKey = `${key}.${type}`;

	if (!has(schemaResponse, key)) {
		handle(schemaResponse, key, Place.Id1);
	}

	if (!has(schemaResponse, typeKey)) {
		handle(schemaResponse, typeKey, Place.Id2);
	}

	if (type === IdType.array) {
		let maximumKeys: string[] = [];
		let minimumKeys: string[] = [];
		let keysMounted = false;
		for (let i = 0; i < data.length; i += 1) {
			dataIterator(data[i], schemaResponse, typeKey, handle);

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
			handle(schemaResponse, `${typeKey}.${IdType.object}.${undefinedKeys[i]}.${IdType.undefined}`, Place.Id3);
		}
	} else if (type === IdType.object) {
		const objectKeys = Object.keys(data);

		for (let i = 0; i < objectKeys.length; i += 1) {
			dataIterator(data[objectKeys[i]], schemaResponse, `${typeKey}.${objectKeys[i]}`, handle);
		}
	}

	return schemaResponse;
};

const checkSchemaOnlyUndefinedIterator = (
	data: any,
	schemaResponse: SchemaResponse,
	key: string,
	handle: (schemaResponse: SchemaResponse, key: string, place: Place) => void
) => {
	const type = identifyType(data);
	const typeKey = `${key}.${type}`;
	const object = get(schemaResponse, key);

	if (type === IdType.undefined && !object[IdType.undefined]) {
		handle(schemaResponse, key, Place.Id4);
	} else {
		// Функция проверяет только на undefined, если тип не совпал, то ранее это уже было определено
		// eslint-disable-next-line no-lonely-if
		if (type === IdType.array && object[IdType.array]) {
			for (let i = 0; i < data.length; i += 1) {
				checkSchemaOnlyUndefinedIterator(data[i], schemaResponse, typeKey, handle);
			}
		} else if (type === IdType.object && object[IdType.object]) {
			const objectKeys = Object.keys(object[IdType.object]);

			for (let i = 0; i < objectKeys.length; i += 1) {
				checkSchemaOnlyUndefinedIterator(
					data[objectKeys[i]],
					schemaResponse,
					`${typeKey}.${objectKeys[i]}`,
					handle
				);
			}
		}
	}
};

const handleSetType = (schemaResponse: SchemaResponse, key: string, place: Place) => {
	set(schemaResponse, key, {});
};

const handleError = (
	errors: SchemaError[],
	schemaResponse: SchemaResponse,
	key: string,
	undefinedKeys: string[],
	place: Place
) => {
	if (place === Place.Id1) {
		undefinedKeys.push(key);
		errors.push({
			key,
			type: SchemaErrorType.key,
		});
	} else if (place === Place.Id2) {
		if (!undefinedKeys.find((undefinedKey) => key.indexOf(undefinedKey) === 0)) {
			errors.push({
				key,
				type: SchemaErrorType.type,
			});
		}
	} else if (place === Place.Id3) {
		if (!has(schemaResponse, key) && !undefinedKeys.find((undefinedKey) => key.indexOf(undefinedKey) === 0)) {
			errors.push({
				key,
				type: SchemaErrorType.type,
			});
		}
	} else if (place === Place.Id4) {
		if (!errors.find((error) => error.key.indexOf(key) === 0)) {
			errors.push({
				key,
				type: SchemaErrorType.undefined,
			});
		}
	}
};

export const makeSchema = (data: any) => {
	const schemaResponse: SchemaResponse = { schema: {} };

	dataIterator(data, schemaResponse, schemaKey, (schemaResponse, key, place) => {
		handleSetType(schemaResponse, key, place);
	});

	return schemaResponse;
};

export const checkSchema = (schema: Schema, data: any): SchemaError[] => {
	const errors: SchemaError[] = [];
	const schemaResponse: SchemaResponse = { schema };

	const undefinedKeys: string[] = [];
	dataIterator(data, schemaResponse, schemaKey, (schemaResponse, key, place) => {
		handleError(errors, schemaResponse, key, undefinedKeys, place);
	});
	checkSchemaOnlyUndefinedIterator(data, schemaResponse, schemaKey, (schemaResponse, key, place) => {
		handleError(errors, schemaResponse, key, undefinedKeys, place);
	});

	return errors;
};

export default {
	identifyType,
	makeSchema,
};
