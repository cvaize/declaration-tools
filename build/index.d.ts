export declare namespace DeclarationTools {
    enum Type {
        number = "number",
        string = "string",
        boolean = "boolean",
        null = "null",
        undefined = "undefined",
        object = "object",
        array = "array",
        any = "any"
    }
    const identifyType: (data: any) => Type;
    type DataSchema = {
        [key: string]: DataSchema;
    };
    type Schema = {
        schema: DataSchema;
    };
    enum SchemaErrorType {
        key = "key",
        type = "type",
        undefined = "undefined"
    }
    type SchemaError = {
        key: string;
        type: SchemaErrorType;
    };
    const makeSchema: (data: any) => Schema;
    const checkSchema: (schema: Schema, data: any) => SchemaError[];
}
export default DeclarationTools;
