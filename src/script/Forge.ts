import {CommonUtil} from "../utility/commons";
import {Operations} from "../operations/operations";
import {Context} from "../interfaces/Context";
import {ExecutionOutput} from "../utility/utility";

const chalk = require('chalk')


let context: Context;

async function cd(path: string) {
    await Operations.cd(context, path)
}

async function execute(command: string): Promise<ExecutionOutput> {
    return await Operations.executeNoThrow(context, command);
}

async function set_env(key: string, value: string) {
    await Operations.set_env(context, key, value);
}

async function get_env(key: string, value: string) {
    return await Operations.get_env(context, key);
}

function print(message: string) {
    console.log(chalk.blue(message));
}

function contains(string1: string, string2: string): boolean {
    return string1.includes(string2);
}


export async function executeScript(buildScript: string, profile: string) {

    try {
        context = CommonUtil.setupContext(buildScript, profile);
        let scriptJs = CommonUtil.loadFile(buildScript);
        scriptJs = "\"use strict\"; async function main() { " +
            scriptJs +
            " } \nmain().catch((e) => console.error(chalk.red(e.message)));"

        const output = eval(scriptJs);
    } catch (e: any) {
        console.error(chalk.red(e.message));
    }
}
