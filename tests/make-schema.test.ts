import usersSchema from './schemas/users';
import productsSchema from './schemas/products';
import pointsSchema from './schemas/points';
import categoriesSchema from './schemas/categories';
import bannerSchema from './schemas/banner';
import { makeSchema } from '../src';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const data = [
	['./tests/data/users.json', usersSchema],
	['./tests/data/products.json', productsSchema],
	['./tests/data/points.json', pointsSchema],
	['./tests/data/categories.json', categoriesSchema],
	['./tests/data/banner-slider.json', bannerSchema],
	['./tests/data/banner-banner1.json', bannerSchema],
	['./tests/data/banner-banner3.json', bannerSchema],
	['./tests/data/banner-banner4.json', bannerSchema],
	['./tests/data/banner-banner5.json', bannerSchema],
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
