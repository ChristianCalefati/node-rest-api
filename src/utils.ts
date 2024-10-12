export function isNumber(input: string): RegExpMatchArray | boolean{
    return input?.match(/^\d+$/) ?? false;
}