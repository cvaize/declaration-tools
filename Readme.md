# Инструменты для декларативного программирования
Назначение данного инструмента облегчить типизацию, гарантировать надежность и четкое соблюдение типов посредством создания схем, которые можно будет использовать для проверки типов в процессе работы (runtime) JS. Инструмент занимает всего 2.1кб `build/index.esm.min.js`, в зависимостях только `lodash`. Поддерживаемые форматы: esm, cjs, umd. Инструмент написан на TypeScript.

## Использование
Установка: `npm i declaration-tools`

Использование:
```js
// node.js
// ESM формат
import {makeSchema, checkSchema} from 'declaration-tools'
// Commonjs формат
const {makeSchema, checkSchema} = require('declaration-tools')

const data = [
    {
        "id": 116,
        "group_id": 1,
        "created_at": "2022-03-03 09:33:03",
        "updated_at": "2022-03-07 07:48:14",
        "addresses": [
            {
                "home": "123",
                "street": "a123"
            }
        ],
        "full_addresses": [
            "awd 123",
            "123123 aws"
        ],
        "categories": [
            1,
            24,
            22
        ],
        "dynamic": [
            {
                "home": "123",
                "street": "a123"
            },
            24,
            "123"
        ],
        "extension_attributes": {
            "is_subscribed": false
        }
    },
    {
        "id": 117,
        "group_id": 1,
        "created_at": "2022-03-03 09:33:03",
        "addresses": [
            {
                "home": "123",
                "street": "a123"
            }
        ],
        "full_addresses": [
            "awd 123",
            "123123 aws"
        ],
        "categories": 22,
        "dynamic": "12313",
        "extension_attributes": {
            "is_subscribed": false
        }
    },
    8124,
    "1231"
];
const schema = makeSchema(data);
// Добавление нового типа в массив, чтобы увидеть ответ ошибки
data.push(true);
const errors = checkSchema(schema, data);

console.log('schema = ', schema)
console.log('errors = ', errors)
```
```shell
$ node node.js
schema =  { schema: { array: { object: [Object], number: {}, string: {} } } }
errors =  [ { key: 'schema.array.boolean', type: 'type' } ]
```

## Формат схемы

Схема представляет собой объект с ключами, ключи являются возможными типами данных.

Например, вот такие данные:
`tests/data/users.json`
```json
[
  {
    "id": 116,
    "group_id": 1,
    "created_at": "2022-03-03 09:33:03",
    "updated_at": "2022-03-07 07:48:14",
    "addresses": [
      {
        "home": "123",
        "street": "a123"
      }
    ],
    "full_addresses": [
      "awd 123",
      "123123 aws"
    ],
    "categories": [
      1,
      24,
      22
    ],
    "dynamic": [
      {
        "home": "123",
        "street": "a123"
      },
      24,
      "123"
    ],
    "extension_attributes": {
      "is_subscribed": false
    }
  },
  {
    "id": 117,
    "group_id": 1,
    "created_at": "2022-03-03 09:33:03",
    "addresses": [
      {
        "home": "123",
        "street": "a123"
      }
    ],
    "full_addresses": [
      "awd 123",
      "123123 aws"
    ],
    "categories": 22,
    "dynamic": "12313",
    "extension_attributes": {
      "is_subscribed": false
    }
  },
  8124,
  "1231"
]
```

преобразуются в схему: `tests/schemas/users.ts`
```typescript
import { Schema } from '../../src';

export const usersSchema: Schema = {
  schema: {
    array: {
      object: {
        id: {
          number: {},
        },
        group_id: {
          number: {},
        },
        created_at: {
          string: {},
        },
        updated_at: {
          string: {},
          undefined: {},
        },
        addresses: {
          array: {
            object: {
              home: {
                string: {},
              },
              street: {
                string: {},
              },
            },
          },
        },
        full_addresses: {
          array: {
            string: {},
          },
        },
        categories: {
          array: {
            number: {},
          },
          number: {},
        },
        dynamic: {
          array: {
            object: {
              home: {
                string: {},
              },
              street: {
                string: {},
              },
            },
            number: {},
            string: {},
          },
          string: {},
        },
        extension_attributes: {
          object: {
            is_subscribed: {
              boolean: {},
            },
          },
        },
      },
      number: {},
      string: {},
    },
  },
};

export default usersSchema;
```

## Формат ошибок
Ответ ошибки представляет собой массив с объектами, следовательно, если массив пустой то и ошибок нет.

В объекте ошибки всегда есть ключ "key", чтобы понять по какому пути возникла ошибка, а так же ключ "type", чтобы понять какого рода эта ошибка.
```js
const error = { 
  key: 'schema.array.boolean', 
  type: 'type'
}
```
Есть всего 3 типа ошибок добавленных как перечисление.
```typescript
export enum SchemaErrorType {
  // Новый ключ. По определенному пути найден ключ объекта, которого нет в схеме
  key = 'key',
  // Не совпал тип. Ключ со значением undefined, тоже сюда подходит. 
  // По определенному пути найдены данные с новым типом
  type = 'type',
  // Нет ключа. По определенному пути должен быть ключ с данными, но его нет
  undefined = 'undefined',
}
```

## Применение
В проектах с неконтролируемым развитием API, а так же в сложных API разработчик может писать простые тесты в 3-4 строчки, а так же использовать проверку в runtime, для своевременного определения не состыковок между ожидаемыми данными и пришедшими с API. 

## Алгоритм использования

1) Получать данные от API во время тестирования;
2) Создание схемы и типа на основе этих данных с помощью "declaration-tools";
3) За тем поместить тип и схему в проект;
4) Написать тест в 3-4 строчки: получить данные, поместить в функцию проверки заранее сгенерированную схему и данные, ожидать ошибку или отсутствие ошибки, если проверка прошла успешно.
5) Поместить в коде проекта функции проверки после получения данных и условие, чтобы эти проверки работали только в проекте во время разработки или тестирования, или на проектах с тестированием на "production";
6) Дополнительно: Отлавливать ошибки теста схемы на тестовой группе на production когда пользователи используют ваше приложение и отправлять отчеты на API логирования. 

## Примечание
Для создания типов на основе различных JSON данные уже есть инструменты, такие как [quicktype.io](https://quicktype.io/). Следовательно, я решил такой инструмент не разрабатывать, если у вас есть идеи, что добавить, то пишите мне на почту: cvaize@gmail.com.
