import { get, set, has, intersection, concat, difference, uniq } from 'lodash';

// Строковое представление типов данных. Не поддерживается bigint, date, symbol, function и другие специальные объекты
export enum Type {
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
export const identifyType = (data: any): Type => {
	let result = Type.any;
	const type = typeof data;

	if (type === 'number') {
		result = Type.number;
	} else if (type === 'string') {
		result = Type.string;
	} else if (type === 'boolean') {
		result = Type.boolean;
	} else if (type === 'undefined') {
		result = Type.undefined;
	} else if (type === 'object') {
		if (data === null) {
			result = Type.null;
		} else if (Array.isArray(data)) {
			result = Type.array;
		} else {
			result = Type.object;
		}
	}

	return result;
};

export type DataSchema = {
	[key: string]: DataSchema;
};

const schemaKey = 'schema';
export type Schema = {
	schema: DataSchema;
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
	schema: Schema,
	key: string,
	handle: (schema: Schema, key: string, place: Place) => void
): Schema => {
	const type = identifyType(data);
	const typeKey = `${key}.${type}`;

	if (!has(schema, key)) {
		handle(schema, key, Place.Id1);
	}

	if (!has(schema, typeKey)) {
		handle(schema, typeKey, Place.Id2);
	}

	if (type === Type.array) {
		let maximumKeys: string[] = [];
		let minimumKeys: string[] = [];
		let keysMounted = false;
		for (let i = 0; i < data.length; i += 1) {
			dataIterator(data[i], schema, typeKey, handle);

			// Обработка undefined ключей в объектах
			if (identifyType(data[i]) === Type.object) {
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
			handle(schema, `${typeKey}.${Type.object}.${undefinedKeys[i]}.${Type.undefined}`, Place.Id3);
		}
	} else if (type === Type.object) {
		const objectKeys = Object.keys(data);

		for (let i = 0; i < objectKeys.length; i += 1) {
			dataIterator(data[objectKeys[i]], schema, `${typeKey}.${objectKeys[i]}`, handle);
		}
	}

	return schema;
};

const checkSchemaOnlyUndefinedIterator = (
	data: any,
	schema: Schema,
	key: string,
	handle: (schema: Schema, key: string, place: Place) => void
) => {
	const type = identifyType(data);
	const typeKey = `${key}.${type}`;
	const object = get(schema, key);

	if (type === Type.undefined && !object[Type.undefined]) {
		handle(schema, key, Place.Id4);
	} else {
		// Функция проверяет только на undefined, если тип не совпал, то ранее это уже было определено
		// eslint-disable-next-line no-lonely-if
		if (type === Type.array && object[Type.array]) {
			for (let i = 0; i < data.length; i += 1) {
				checkSchemaOnlyUndefinedIterator(data[i], schema, typeKey, handle);
			}
		} else if (type === Type.object && object[Type.object]) {
			const objectKeys = Object.keys(object[Type.object]);

			for (let i = 0; i < objectKeys.length; i += 1) {
				checkSchemaOnlyUndefinedIterator(data[objectKeys[i]], schema, `${typeKey}.${objectKeys[i]}`, handle);
			}
		}
	}
};

const handleSetType = (schema: Schema, key: string, place: Place) => {
	set(schema, key, {});
};

const handleError = (errors: SchemaError[], schema: Schema, key: string, undefinedKeys: string[], place: Place) => {
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
		if (!has(schema, key) && !undefinedKeys.find((undefinedKey) => key.indexOf(undefinedKey) === 0)) {
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
	const schema: Schema = { schema: {} };

	dataIterator(data, schema, schemaKey, (schema, key, place) => {
		handleSetType(schema, key, place);
	});

	return schema;
};

export const checkSchema = (schema: Schema, data: any): SchemaError[] => {
	const errors: SchemaError[] = [];

	const undefinedKeys: string[] = [];
	dataIterator(data, schema, schemaKey, (schema, key, place) => {
		handleError(errors, schema, key, undefinedKeys, place);
	});
	checkSchemaOnlyUndefinedIterator(data, schema, schemaKey, (schema, key, place) => {
		handleError(errors, schema, key, undefinedKeys, place);
	});

	return errors;
};

export default {
	identifyType,
	makeSchema,
};
