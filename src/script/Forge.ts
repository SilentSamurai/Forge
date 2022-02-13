import {CommonUtil} from "../utility/commons";
import {Operations} from "../operations/operations";
import {Context} from "../interfaces/Context";
import {ExecutionOutput} from "../utility/utility";
import * as Helpers from "./helpers";
import {Logger} from "../logging/Logger";

const logger = Logger.getLogger("script.Forge");

const chalk = require('chalk');

const WINDOWS = Helpers.WINDOWS;
const MACOS = Helpers.MACOS;
const LINUX = Helpers.LINUX;

let context: Context;
const PLATFORM = Helpers.configurePlatform();


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

function profile(profile: string) {
    return context.isProfileActive(profile);
}

function print(message: string) {
    logger.info(chalk.blue(message));
}

function contains(string1: string, string2: string): boolean {
    return string1.includes(string2);
}


export async function executeScript(buildScript: string, profileString: string) {
    try {
        context = CommonUtil.setupContext(buildScript, profileString);
        let scriptJs = CommonUtil.loadFile(buildScript);
        scriptJs = "\"use strict\"; async function main() { " +
            scriptJs +
            " } \nmain().catch((e) => console.error(chalk.red(e.message)));";

        logger.info(scriptJs);

        const output = eval(scriptJs);
    } catch (e: any) {
        logger.error(chalk.red(e.message));
        logger.debug(e.stack);
    }
}
