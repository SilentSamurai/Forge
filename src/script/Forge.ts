import {CommonUtil} from "../utility/commons";
import {Operations} from "../operations/operations";
import {Context} from "../interfaces/Context";

const chalk = require('chalk')


let context: Context;

async function cd(path: string) {
    await Operations.cd(context, path)
}

async function execute(command: string) {
    return await Operations.executeOne(context, command)
}

async function set_env(key: string, value: string) {
    await Operations.set_env(context, key, value);
}

async function get_env(key: string, value: string) {
    return await Operations.get_env(context, key);
}


export async function executeScript(buildScript: string, profile: string) {

    try {
        context = CommonUtil.setupContext(buildScript, profile);
        let scriptJs = CommonUtil.loadFile(buildScript);
        scriptJs = "async function main() { " +
            scriptJs +
            " } \nmain().catch((e) => console.error(chalk.red(e.message)));"

        const output = eval(scriptJs);
    } catch (e: any) {
        console.error(chalk.red(e.message));
    }
}
