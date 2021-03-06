import { cloneDeep } from 'lodash';
import usersSchema from './schemas/users';
import { checkSchema, SchemaErrorType } from '../src';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const originalData = JSON.parse(fs.readFileSync('./tests/data/users.json', 'utf-8'));

describe('Функция проверки схемы', () => {
	it('Проверка определения не состыковок типов', () => {
		let data = cloneDeep(originalData);
		data[0].id = '22';
		data[0].group_id = '123';
		expect(checkSchema(usersSchema, data)).toEqual([
			{ key: 'schema.array.object.id.string', type: SchemaErrorType.type },
			{ key: 'schema.array.object.group_id.string', type: SchemaErrorType.type },
		]);

		data = cloneDeep(originalData);
		data[0].addresses = undefined;
		expect(checkSchema(usersSchema, data)).toEqual([
			{ key: 'schema.array.object.addresses.undefined', type: SchemaErrorType.type },
		]);

		data = cloneDeep(originalData);
		data[0].dynamic = {};
		expect(checkSchema(usersSchema, data)).toEqual([
			{ key: 'schema.array.object.dynamic.object', type: SchemaErrorType.type },
		]);

		data = [123];
		expect(checkSchema(usersSchema, data)).toEqual([]);

		data = cloneDeep(originalData);
		data[0].addresses[0].home = 123;
		expect(checkSchema(usersSchema, data)).toEqual([
			{
				key: 'schema.array.object.addresses.array.object.home.number',
				type: SchemaErrorType.type,
			},
		]);

		data = cloneDeep(originalData);
		data[0].categories = [];
		expect(checkSchema(usersSchema, data)).toEqual([]);

		data = cloneDeep(originalData);
		data[0].full_addresses = [123];
		expect(checkSchema(usersSchema, data)).toEqual([
			{
				key: 'schema.array.object.full_addresses.array.number',
				type: SchemaErrorType.type,
			},
		]);
	});
	it('Проверка на наличие новых ключей', () => {
		let data = cloneDeep(originalData);
		data[0].newId = 123;
		expect(checkSchema(usersSchema, data)).toEqual([
			{ key: 'schema.array.object.newId', type: SchemaErrorType.key },
		]);

		data = cloneDeep(originalData);
		data[1].updated_at = '2022-03-07 07:48:14';
		expect(checkSchema(usersSchema, data)).toEqual([]);

		data = cloneDeep(originalData);
		data[1].updated_at_new = '2022-03-07 07:48:14';
		expect(checkSchema(usersSchema, data)).toEqual([
			{ key: 'schema.array.object.updated_at_new', type: SchemaErrorType.key },
		]);
	});
	it('Проверка на отсутствие ключей', () => {
		let data = cloneDeep(originalData);
		delete data[0].group_id;
		expect(checkSchema(usersSchema, data)).toEqual([
			{ key: 'schema.array.object.group_id', type: SchemaErrorType.undefined },
		]);

		data = cloneDeep(originalData);
		delete data[0].updated_at;
		expect(checkSchema(usersSchema, data)).toEqual([]);

		data = cloneDeep(originalData);
		delete data[0].addresses;
		expect(checkSchema(usersSchema, data)).toEqual([
			{ key: 'schema.array.object.addresses', type: SchemaErrorType.undefined },
		]);

		data = cloneDeep(originalData);
		delete data[0].created_at;
		expect(checkSchema(usersSchema, data)).toEqual([
			{ key: 'schema.array.object.created_at', type: SchemaErrorType.undefined },
		]);

		data = cloneDeep(originalData);
		delete data[0].dynamic[0].home;
		expect(checkSchema(usersSchema, data)).toEqual([
			{
				key: 'schema.array.object.dynamic.array.object.home',
				type: SchemaErrorType.undefined,
			},
		]);

		data = cloneDeep(originalData);
		delete data[1].extension_attributes.is_subscribed;
		expect(checkSchema(usersSchema, data)).toEqual([
			{
				key: 'schema.array.object.extension_attributes.object.is_subscribed',
				type: SchemaErrorType.undefined,
			},
		]);
	});
});

export {};
