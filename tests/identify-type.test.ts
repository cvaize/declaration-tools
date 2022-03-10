import { identifyType, IdType } from '../src';

describe('Функция определения типа данных на основе переданных данных', () => {
	it('Определить тип: number', () => {
		expect(identifyType(1)).toStrictEqual(IdType.number);
	});
	it('Определить тип: string', () => {
		expect(identifyType('1')).toStrictEqual(IdType.string);
	});
	it('Определить тип: boolean', () => {
		expect(identifyType(true)).toStrictEqual(IdType.boolean);
	});
	it('Определить тип: null', () => {
		expect(identifyType(null)).toStrictEqual(IdType.null);
	});
	it('Определить тип: undefined', () => {
		expect(identifyType(undefined)).toStrictEqual(IdType.undefined);
	});
	it('Определить тип: object', () => {
		expect(identifyType({})).toStrictEqual(IdType.object);
	});
	it('Определить тип: array', () => {
		expect(identifyType([])).toStrictEqual(IdType.array);
	});
});

export {};
