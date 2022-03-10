import { makeSchema } from '../src';
import usersSchemaResponse from './schemas/users';
import productsSchemaResponse from './schemas/products';
import pointsSchemaResponse from './schemas/points';
import categoriesSchemaResponse from './schemas/categories';
import bannerSchemaResponse from './schemas/banner';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const data = [
	['./tests/data/users.json', usersSchemaResponse],
	['./tests/data/products.json', productsSchemaResponse],
	['./tests/data/points.json', pointsSchemaResponse],
	['./tests/data/categories.json', categoriesSchemaResponse],
	['./tests/data/banner-slider.json', bannerSchemaResponse],
	['./tests/data/banner-banner1.json', bannerSchemaResponse],
	['./tests/data/banner-banner3.json', bannerSchemaResponse],
	['./tests/data/banner-banner4.json', bannerSchemaResponse],
	['./tests/data/banner-banner5.json', bannerSchemaResponse],
];

for (let i = 0; i < data.length; i += 1) {
	data[i][2] = JSON.parse(fs.readFileSync(data[i][0], 'utf-8'));
}

describe('Функция создания схемы', () => {
	for (let i = 0; i < data.length; i += 1) {
		it(`Схема ${data[i][0]}`, () => {
			expect(makeSchema(data[i][2])).toEqual(data[i][1]);
		});
	}
});

export {};
