import 'reflect-metadata'

export function Operation(target: any, key: string) {
    const operation = Reflect.getMetadata("design:type", target, key);
    console.log(`${key} type: ${operation.name}`);
    const instance = Object.create(target);
    ForgeAnnotation.addOperation(key, target[key].bind(instance));
}


export class ForgeAnnotation {
    static operations: { [key: string]: Function; } = {}

    public static addOperation(name: string, func: Function) {
        ForgeAnnotation.operations[name] = func;
    }
}
