import DeclarationTools from '../src';
import identifyType = DeclarationTools.identifyType;
import Type = DeclarationTools.Type;

describe('Функция определения типа данных на основе переданных данных', () => {
	it('Определить тип: number', () => {
		expect(identifyType(1)).toStrictEqual(Type.number);
	});
	it('Определить тип: string', () => {
		expect(identifyType('1')).toStrictEqual(Type.string);
	});
	it('Определить тип: boolean', () => {
		expect(identifyType(true)).toStrictEqual(Type.boolean);
	});
	it('Определить тип: null', () => {
		expect(identifyType(null)).toStrictEqual(Type.null);
	});
	it('Определить тип: undefined', () => {
		expect(identifyType(undefined)).toStrictEqual(Type.undefined);
	});
	it('Определить тип: object', () => {
		expect(identifyType({})).toStrictEqual(Type.object);
	});
	it('Определить тип: array', () => {
		expect(identifyType([])).toStrictEqual(Type.array);
	});
});

export {};
