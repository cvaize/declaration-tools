(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash')) :
    typeof define === 'function' && define.amd ? define(['exports', 'lodash'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DeclarationTools = {}, global.lodash));
})(this, (function (exports, lodash) { 'use strict';

    // Строковое представление типов данных. Не поддерживается bigint, date, symbol, function и другие специальные объекты
    exports.Type = void 0;
    (function (Type) {
        Type["number"] = "number";
        Type["string"] = "string";
        Type["boolean"] = "boolean";
        Type["null"] = "null";
        Type["undefined"] = "undefined";
        Type["object"] = "object";
        Type["array"] = "array";
        Type["any"] = "any";
    })(exports.Type || (exports.Type = {}));
    var Place;
    (function (Place) {
        Place[Place["Id1"] = 0] = "Id1";
        Place[Place["Id2"] = 1] = "Id2";
        Place[Place["Id3"] = 2] = "Id3";
        Place[Place["Id4"] = 3] = "Id4";
    })(Place || (Place = {}));
    // Определить тип данных, который передан параметром
    const identifyType = (data) => {
        let result = exports.Type.any;
        const type = typeof data;
        if (type === 'number') {
            result = exports.Type.number;
        }
        else if (type === 'string') {
            result = exports.Type.string;
        }
        else if (type === 'boolean') {
            result = exports.Type.boolean;
        }
        else if (type === 'undefined') {
            result = exports.Type.undefined;
        }
        else if (type === 'object') {
            if (data === null) {
                result = exports.Type.null;
            }
            else if (Array.isArray(data)) {
                result = exports.Type.array;
            }
            else {
                result = exports.Type.object;
            }
        }
        return result;
    };
    const schemaKey = 'schema';
    exports.SchemaErrorType = void 0;
    (function (SchemaErrorType) {
        // Новый ключ. По определенному пути найден ключ объекта, которого нет в схеме
        SchemaErrorType["key"] = "key";
        // Не совпал тип. Ключ со значением undefined, тоже сюда подходит По определенному пути найдены данные с новым типом
        SchemaErrorType["type"] = "type";
        // Нет ключа. По определенному пути должен быть ключ с данными, но его нет
        SchemaErrorType["undefined"] = "undefined";
    })(exports.SchemaErrorType || (exports.SchemaErrorType = {}));
    const dataIterator = (data, schema, key, handle) => {
        const type = identifyType(data);
        const typeKey = `${key}.${type}`;
        if (!lodash.has(schema, key)) {
            handle(schema, key, Place.Id1);
        }
        if (!lodash.has(schema, typeKey)) {
            handle(schema, typeKey, Place.Id2);
        }
        if (type === exports.Type.array) {
            let maximumKeys = [];
            let minimumKeys = [];
            let keysMounted = false;
            for (let i = 0; i < data.length; i += 1) {
                dataIterator(data[i], schema, typeKey, handle);
                // Обработка undefined ключей в объектах
                if (identifyType(data[i]) === exports.Type.object) {
                    if (keysMounted) {
                        const objectKeys = Object.keys(data[i]);
                        minimumKeys = lodash.intersection(minimumKeys, objectKeys);
                        maximumKeys = lodash.concat(maximumKeys, lodash.difference(maximumKeys, objectKeys));
                    }
                    else {
                        minimumKeys = Object.keys(data[i]);
                        maximumKeys = minimumKeys;
                        keysMounted = true;
                    }
                }
            }
            const undefinedKeys = lodash.uniq(lodash.difference(maximumKeys, minimumKeys));
            for (let i = 0; i < undefinedKeys.length; i += 1) {
                handle(schema, `${typeKey}.${exports.Type.object}.${undefinedKeys[i]}.${exports.Type.undefined}`, Place.Id3);
            }
        }
        else if (type === exports.Type.object) {
            const objectKeys = Object.keys(data);
            for (let i = 0; i < objectKeys.length; i += 1) {
                dataIterator(data[objectKeys[i]], schema, `${typeKey}.${objectKeys[i]}`, handle);
            }
        }
        return schema;
    };
    const checkSchemaOnlyUndefinedIterator = (data, schema, key, handle) => {
        const type = identifyType(data);
        const typeKey = `${key}.${type}`;
        const object = lodash.get(schema, key);
        if (type === exports.Type.undefined && !object[exports.Type.undefined]) {
            handle(schema, key, Place.Id4);
        }
        else {
            // Функция проверяет только на undefined, если тип не совпал, то ранее это уже было определено
            // eslint-disable-next-line no-lonely-if
            if (type === exports.Type.array && object[exports.Type.array]) {
                for (let i = 0; i < data.length; i += 1) {
                    checkSchemaOnlyUndefinedIterator(data[i], schema, typeKey, handle);
                }
            }
            else if (type === exports.Type.object && object[exports.Type.object]) {
                const objectKeys = Object.keys(object[exports.Type.object]);
                for (let i = 0; i < objectKeys.length; i += 1) {
                    checkSchemaOnlyUndefinedIterator(data[objectKeys[i]], schema, `${typeKey}.${objectKeys[i]}`, handle);
                }
            }
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSetType = (schema, key, place) => {
        lodash.set(schema, key, {});
    };
    const handleError = (errors, schema, key, undefinedKeys, place) => {
        if (place === Place.Id1) {
            undefinedKeys.push(key);
            errors.push({
                key,
                type: exports.SchemaErrorType.key,
            });
        }
        else if (place === Place.Id2) {
            if (!undefinedKeys.find((undefinedKey) => key.indexOf(undefinedKey) === 0)) {
                errors.push({
                    key,
                    type: exports.SchemaErrorType.type,
                });
            }
        }
        else if (place === Place.Id3) {
            if (!lodash.has(schema, key) && !undefinedKeys.find((undefinedKey) => key.indexOf(undefinedKey) === 0)) {
                errors.push({
                    key,
                    type: exports.SchemaErrorType.type,
                });
            }
        }
        else if (place === Place.Id4) {
            if (!errors.find((error) => error.key.indexOf(key) === 0)) {
                errors.push({
                    key,
                    type: exports.SchemaErrorType.undefined,
                });
            }
        }
    };
    const makeSchema = (data) => {
        const schema = { schema: {} };
        dataIterator(data, schema, schemaKey, (schema, key, place) => {
            handleSetType(schema, key);
        });
        return schema;
    };
    const checkSchema = (schema, data) => {
        const errors = [];
        const undefinedKeys = [];
        dataIterator(data, schema, schemaKey, (schema, key, place) => {
            handleError(errors, schema, key, undefinedKeys, place);
        });
        checkSchemaOnlyUndefinedIterator(data, schema, schemaKey, (schema, key, place) => {
            handleError(errors, schema, key, undefinedKeys, place);
        });
        return errors;
    };
    var index = {
        Type: exports.Type,
        identifyType,
        SchemaErrorType: exports.SchemaErrorType,
        makeSchema,
        checkSchema,
    };

    exports.checkSchema = checkSchema;
    exports["default"] = index;
    exports.identifyType = identifyType;
    exports.makeSchema = makeSchema;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
