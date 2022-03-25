export declare enum Type {
    number = "number",
    string = "string",
    boolean = "boolean",
    null = "null",
    undefined = "undefined",
    object = "object",
    array = "array",
    any = "any"
}
export declare const identifyType: (data: any) => Type;
export declare type DataSchema = {
    [key: string]: DataSchema;
};
export declare type Schema = {
    schema: DataSchema;
};
export declare enum SchemaErrorType {
    key = "key",
    type = "type",
    undefined = "undefined"
}
export declare type SchemaError = {
    key: string;
    type: SchemaErrorType;
};
export declare const makeSchema: (data: any) => Schema;
export declare const checkSchema: (schema: Schema, data: any) => SchemaError[];
declare const _default: {
    Type: typeof Type;
    identifyType: (data: any) => Type;
    SchemaErrorType: typeof SchemaErrorType;
    makeSchema: (data: any) => Schema;
    checkSchema: (schema: Schema, data: any) => SchemaError[];
};
export default _default;
