import { makeSchema } from '../src';
import usersSchemaResponse from './schemas/users';
import usersData from './data/users';

describe('Функция генерации схемы', () => {
	it('Схема пользователей', () => {
		expect(makeSchema(usersData)).toEqual(usersSchemaResponse);
	});
});

export {};
