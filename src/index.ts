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

type SchemaItem = {
	children: string[];
};

type Schema = {
	[key: string]: SchemaItem;
};

type SchemaResponse = {
	schema: Schema;
};

const processingSchema = (data: any, schemaResponse: SchemaResponse): SchemaResponse => {
	const type = identifyType(data);
	if (!schemaResponse.schema[type]) {
		schemaResponse.schema[type] = { children: [] };
	}

	return schemaResponse;
};

export const makeSchema = (data: any) => processingSchema(data, { schema: {} });

export default {
	identifyType,
};
